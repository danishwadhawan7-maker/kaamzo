"use strict";
/**
 * Kaamzo Unified MongoDB Atlas API Endpoint (/api/db)
 *
 * Security Hardening:
 *  - Blocks all browser reads/lists of `securityVerifications` (OTP hashes stay strictly server-side)
 *  - Redacts `passwordHash` from account query responses
 *  - Requires verified Firebase ID Token OR Admin HMAC session cookie for `purgeAll`
 *  - Supports multi-device encrypted `messages` thread sync (`AES-256-GCM`)
 *  - Strict CORS allow-list + Helmet security headers + Rate limiting
 */
const crypto = require("crypto");
const {
  connectMongo,
  MODELS,
  upsertDoc,
  getDocById,
  listDocs,
  lookupByPhone,
  purgeAllCollections
} = require("../lib/models");
const { verifyFirebaseIdToken } = require("../lib/firebase-auth");

const ALLOWED_COLLECTIONS = new Set([
  "workers",
  "jobs",
  "verifications",
  "disputes",
  "accounts",
  "sosAlerts",
  "messages"
]);

const rateBuckets = new Map();

function checkRateLimit(ip, maxReqs = 180, windowMs = 60 * 1000) {
  const now = Date.now();
  const entry = rateBuckets.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + windowMs;
  }
  entry.count += 1;
  rateBuckets.set(ip, entry);
  return {
    allowed: entry.count <= maxReqs,
    retryAfterSec: Math.ceil((entry.resetAt - now) / 1000)
  };
}

function hasValidAdminCookie(req) {
  try {
    const secret = process.env.SESSION_SECRET || "";
    if (!secret || secret.length < 32) return false;
    const cookieHeader = String((req.headers && req.headers.cookie) || "");
    const parts = cookieHeader.split(";").map((s) => s.trim());
    const kz = parts.find((p) => p.startsWith("kz_admin="));
    if (!kz) return false;
    const tok = decodeURIComponent(kz.slice("kz_admin=".length));
    const [body, mac] = tok.split(".");
    if (!body || !mac) return false;
    const expected = crypto.createHmac("sha256", secret).update(body).digest();
    const given = Buffer.from(mac, "base64url");
    return given.length === expected.length && crypto.timingSafeEqual(given, expected);
  } catch {
    return false;
  }
}

function sanitizePublicDoc(collectionName, doc) {
  if (!doc || typeof doc !== "object") return doc;
  const copy = { ...doc };
  delete copy.phoneHash;
  delete copy.customerPhoneHash;
  delete copy.workerPhoneHash;
  delete copy.emailHash;
  delete copy.aadhaarHash;
  delete copy.identifierHash;
  if (collectionName === "accounts") {
    delete copy.passwordHash;
  }
  return copy;
}

function applySecurityAndCorsHeaders(req, res) {
  const allowedList = (
    process.env.ALLOWED_ORIGINS ||
    "https://kaamzo.site,https://www.kaamzo.site,http://localhost:3000,http://localhost:5173,capacitor://localhost,https://localhost"
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const origin = req.headers && req.headers.origin;
  if (origin && (allowedList.includes(origin) || /^http:\/\/localhost(:\d+)?$/.test(origin))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  } else {
    res.setHeader("Access-Control-Allow-Origin", "https://www.kaamzo.site");
  }

  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Kaamzo-Admin-Token");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-DNS-Prefetch-Control", "off");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "geolocation=(self), microphone=(self), camera=(self)");
}

module.exports = async function handler(req, res, io = null) {
  applySecurityAndCorsHeaders(req, res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }

  const sendJson = (status, payload) => {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    return res.end(JSON.stringify(payload));
  };

  const clientIp =
    (req.headers && req.headers["x-forwarded-for"] && String(req.headers["x-forwarded-for"]).split(",")[0].trim()) ||
    (req.socket && req.socket.remoteAddress) ||
    "127.0.0.1";

  const rl = checkRateLimit(clientIp);
  if (!rl.allowed) {
    res.setHeader("Retry-After", String(rl.retryAfterSec));
    return sendJson(429, {
      success: false,
      error: `Rate limit exceeded. Try again in ${rl.retryAfterSec}s.`
    });
  }

  try {
    const parsedUrl = new URL(req.url || "/api/db", "http://localhost:3000");
    let body = {};
    if (req.method === "POST" || req.method === "PUT" || req.method === "DELETE") {
      if (req.body && typeof req.body === "object") {
        body = req.body;
      } else if (typeof req.body === "string") {
        try { body = JSON.parse(req.body || "{}"); } catch (_) { body = {}; }
      }
    }

    const action = parsedUrl.searchParams.get("action") || body.action || (req.method === "GET" ? "list" : "upsert");
    const collection = parsedUrl.searchParams.get("collection") || body.collection || "";
    const docId = parsedUrl.searchParams.get("id") || body.id || (body.data && body.data.id) || "";

    const authResult = await verifyFirebaseIdToken(req, body);
    const isAdmin = hasValidAdminCookie(req);

    // 1. Health & Encryption Status Check
    if (action === "health") {
      await connectMongo();
      return sendJson(200, {
        success: true,
        database: "MongoDB Atlas (Mongoose + TLS)",
        encryption: "AES-256-GCM Field-Level + HMAC-SHA256 Blind Indexing",
        authProvider: "Firebase Authentication (Google Login + verifyIdToken)",
        firebaseTokenVerified: authResult.verified,
        uid: authResult.uid || null
      });
    }

    // 2. Searchable Blind-Index Phone Lookup
    if (action === "lookupByPhone") {
      const phone = parsedUrl.searchParams.get("phone") || body.phone || "";
      if (!phone) {
        return sendJson(400, { success: false, error: "Phone number is required" });
      }
      const matches = await lookupByPhone(phone);
      return sendJson(200, {
        success: true,
        encryption: "HMAC-SHA256 Blind Index + AES-256-GCM Decryption",
        workers: matches.workers.map((d) => sanitizePublicDoc("workers", d)),
        accounts: matches.accounts.map((d) => sanitizePublicDoc("accounts", d)),
        jobs: matches.jobs.map((d) => sanitizePublicDoc("jobs", d))
      });
    }

    // 3. Purge All Collections (Protected: Requires Admin Session or Verified Firebase Admin Token)
    if (action === "purgeAll") {
      const adminEmails = (process.env.ADMIN_EMAILS || "bhavnoorsinghkochar@gmail.com,danishwadhawan7@gmail.com")
        .split(",")
        .map((s) => s.trim().toLowerCase());
      const isFirebaseAdmin = authResult.verified && authResult.email && adminEmails.includes(authResult.email.toLowerCase());
      if (!isAdmin && !isFirebaseAdmin) {
        return sendJson(401, {
          success: false,
          error: "Unauthorized: Database purge requires authenticated Administrator credentials."
        });
      }
      const result = await purgeAllCollections();
      if (io) {
        io.emit("db:change", { action: "purgeAll", timestamp: Date.now() });
      }
      return sendJson(200, { success: true, ...result });
    }

    // Block direct read/write of OTP vault (`securityVerifications`) from `/api/db`
    if (collection === "securityVerifications") {
      return sendJson(403, {
        success: false,
        error: "Access Denied: securityVerifications can only be accessed via /api/send-otp and /api/verify-otp."
      });
    }

    if (!ALLOWED_COLLECTIONS.has(collection)) {
      return sendJson(400, {
        success: false,
        error: `Invalid or missing collection '${collection}'.`
      });
    }

    // 4. List Documents in Collection
    if (action === "list" && req.method === "GET") {
      const limit = Number(parsedUrl.searchParams.get("limit") || 100);
      const threadKey = parsedUrl.searchParams.get("threadKey");
      const filter = collection === "messages" && threadKey ? { threadKey: String(threadKey) } : {};
      const docs = await listDocs(collection, limit, filter);
      return sendJson(200, {
        success: true,
        collection,
        count: docs.length,
        docs: docs.map((d) => sanitizePublicDoc(collection, d))
      });
    }

    // 5. Get Single Document by ID
    if (action === "get") {
      if (!docId) {
        return sendJson(400, { success: false, error: "Document id is required" });
      }
      const doc = await getDocById(collection, docId);
      return sendJson(200, {
        success: true,
        collection,
        exists: !!doc,
        doc: sanitizePublicDoc(collection, doc)
      });
    }

    // 6. Upsert Document
    if (action === "upsert") {
      const payload = body.data || body.doc || body;
      const targetId = String(docId || payload.id || `doc_${Date.now()}`).trim();
      const savedDoc = await upsertDoc(collection, targetId, payload, authResult);

      const safeDoc = sanitizePublicDoc(collection, savedDoc);
      if (io) {
        io.emit("db:change", {
          action: "upsert",
          collection,
          id: targetId,
          doc: safeDoc,
          timestamp: Date.now()
        });
      }

      return sendJson(200, {
        success: true,
        collection,
        id: targetId,
        uid: savedDoc.uid || authResult.uid || null,
        doc: safeDoc
      });
    }

    return sendJson(400, { success: false, error: `Unsupported action '${action}'` });
  } catch (err) {
    console.error("[Kaamzo MongoDB API Error]:", err.message);
    return sendJson(500, {
      success: false,
      error: err.message || "Database operation failed"
    });
  }
};
