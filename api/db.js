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
  purgeAllCollections,
  hashPhoneForLookup,
  hashEmailForLookup
} = require("../lib/models");
const { decryptDocumentFields } = require("../lib/encryption");
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
    if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return false;
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    if (parsed && parsed.exp && Number(parsed.exp) < Date.now()) return false;
    return true;
  } catch {
    return false;
  }
}

function kzClientHash(s) {
  if (!s) return "";
  let h1 = 0x811c9dc5;
  let h2 = 5381;
  let h3 = 0x12345678;
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 0x01000193);
    h2 = Math.imul((h2 << 5) + h2, 33) ^ c;
    h3 = (h3 ^ Math.imul(c, 0x9e3779b9)) >>> 0;
  }
  return "kzh_" + (h1 >>> 0).toString(16) + (h2 >>> 0).toString(16) + (h3 >>> 0).toString(16);
}

async function findAccountDocs(identifier, role = "") {
  const raw = String(identifier || "").trim();
  if (!raw) return [];
  await connectMongo();
  const cleanLower = raw.toLowerCase();
  const cleanUid = cleanLower.replace(/^@/, "");
  const phoneDigits = raw.replace(/[^0-9]/g, "");
  const phone10 = phoneDigits.length >= 10 ? phoneDigits.slice(-10) : "";

  const orClauses = [{ id: cleanLower }, { id: cleanUid }, { username: cleanLower }, { username: cleanUid }];
  if (phone10) {
    orClauses.push({ id: phone10 }, { username: phone10 });
  }
  const emailHash = hashEmailForLookup(raw);
  if (emailHash) orClauses.push({ emailHash });
  if (phoneDigits.length >= 7) {
    const phoneHash = hashPhoneForLookup(raw);
    if (phoneHash) orClauses.push({ phoneHash });
    if (phone10) {
      const ph10Hash = hashPhoneForLookup(phone10);
      const ph91Hash = hashPhoneForLookup("+91" + phone10);
      const ph91SpHash = hashPhoneForLookup("+91 " + phone10);
      if (ph10Hash) orClauses.push({ phoneHash: ph10Hash });
      if (ph91Hash) orClauses.push({ phoneHash: ph91Hash });
      if (ph91SpHash) orClauses.push({ phoneHash: ph91SpHash });
    }
  }

  let docs = await MODELS.accounts.find({ $or: orClauses }).limit(25).lean();
  let decrypted = docs.map(decryptDocumentFields);

  // Fallback scan across recent decrypted accounts if blind-index formatting differed or user typed their full Name/Email
  if (decrypted.length === 0) {
    const allAccs = (await MODELS.accounts.find({}).limit(200).lean()).map(decryptDocumentFields);
    decrypted = allAccs.filter((acc) => {
      if (!acc) return false;
      const aId = String(acc.id || "").trim().toLowerCase();
      const aUser = String(acc.username || "").trim().toLowerCase();
      const aName = String(acc.name || "").trim().toLowerCase();
      const aEm = String((acc.extraData && acc.extraData.email) || acc.email || "").trim().toLowerCase();
      const aPh = String(acc.phone || (acc.extraData && acc.extraData.phone) || "").replace(/[^0-9]/g, "").slice(-10);
      return (
        aId === cleanUid ||
        aUser === cleanUid ||
        aName === cleanLower ||
        (aEm && (aEm === cleanLower || aEm.split("@")[0] === cleanUid)) ||
        (phone10 && aPh === phone10)
      );
    });
  }

  // Also check `workers` collection if a worker registered directly into workers collection
  if (decrypted.length === 0) {
    const allWorkers = (await MODELS.workers.find({}).limit(200).lean()).map(decryptDocumentFields);
    const matchedWorkers = allWorkers.filter((w) => {
      if (!w) return false;
      const wId = String(w.id || "").trim().toLowerCase().replace(/^w-/, "");
      const wUser = String(w.username || w.userId || "").trim().toLowerCase();
      const wName = String(w.name || "").trim().toLowerCase();
      const wEm = String(w.email || "").trim().toLowerCase();
      const wPh = String(w.phone || "").replace(/[^0-9]/g, "").slice(-10);
      return (
        wId === cleanUid ||
        wUser === cleanUid ||
        wName === cleanLower ||
        (wEm && (wEm === cleanLower || wEm.split("@")[0] === cleanUid)) ||
        (phone10 && wPh === phone10)
      );
    });
    decrypted = matchedWorkers.map((w) => ({
      id: w.username || w.userId || String(w.id || "").replace(/^w-/, ""),
      username: w.username || w.userId || String(w.id || "").replace(/^w-/, ""),
      name: w.name,
      phone: w.phone || "",
      email: w.email || "",
      role: "worker",
      password: w.password || "",
      passwordHash: w.passwordHash || "",
      extraData: {
        trade: w.primaryTrade || w.trade || "Electrician",
        rate: w.dailyRate || w.rate || 850,
        exp: w.experienceYears || 3,
        area: w.area || "Model Town",
        city: w.city || "Ludhiana",
        address: w.address || w.area || "Model Town, Ludhiana",
        aadhaar: w.aadhaarNumber || "",
        upi: w.upiId || "",
        email: w.email || "",
        photoUrl: w.photoUrl || w.avatar || "",
        aadhaarFrontPhoto: w.aadhaarFrontPhoto || "",
        aadhaarBackPhoto: w.aadhaarBackPhoto || "",
        toolsStatus: w.toolsStatus || "",
        transportMode: w.transportMode || "",
        preferredLanguage: w.preferredLanguage || "hi",
        emergencyContactName: w.emergencyContactName || "",
        emergencyContactPhone: w.emergencyContactPhone || "",
        isVerified: Boolean(w.isVerified)
      }
    }));
  }

  if (role === "worker" || role === "customer") {
    const roleFiltered = decrypted.filter((acc) => acc && acc.role === role);
    if (roleFiltered.length > 0) return roleFiltered;
  }
  return decrypted;
}

function isCustomerOwnerOfJob(job, customerKey) {
  if (!job || !customerKey) return false;
  const ck = String(customerKey).trim().toLowerCase();
  if (!ck || ck.length < 3) return false;
  const candidates = [
    job.customerId,
    job.uid,
    job.customerEmail,
    job.customerPhone && String(job.customerPhone).replace(/[^0-9]/g, "").slice(-10)
  ]
    .filter(Boolean)
    .map((v) => String(v).trim().toLowerCase());
  const ckPhone = ck.replace(/[^0-9]/g, "").slice(-10);
  return candidates.includes(ck) || (ckPhone.length === 10 && candidates.includes(ckPhone));
}

function sanitizePublicDoc(collectionName, doc, allowPrivateKyc = false, allowJobOtps = false) {
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
    delete copy.password;
  }
  if (!allowPrivateKyc && (collectionName === "workers" || collectionName === "verifications")) {
    delete copy.aadhaarNumber;
    delete copy.aadhaar;
    delete copy.aadhaarFrontPhoto;
    delete copy.aadhaarBackPhoto;
    delete copy.emergencyContactPhone;
    delete copy.emergencyContactName;
  }
  if (collectionName === "jobs" && !allowPrivateKyc && !allowJobOtps) {
    delete copy.otpCode;
    delete copy.endOtpCode;
  }
  return copy;
}

function applySecurityAndCorsHeaders(req, res) {
  const allowedList = (
    process.env.ALLOWED_ORIGINS ||
    "https://kaamzo.site,https://www.kaamzo.site,https://kaamzo-live.vercel.app,http://localhost:3000,http://localhost:5173,capacitor://localhost,https://localhost"
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
    const adminEmailsList = (process.env.ADMIN_EMAILS || "bhavnoorsinghkochar@gmail.com,danishwadhawan7@gmail.com")
      .split(",")
      .map((s) => s.trim().toLowerCase());
    const isFirebaseAdmin = Boolean(
      authResult.verified && authResult.email && adminEmailsList.includes(authResult.email.toLowerCase())
    );
    const isPrivilegedAdmin = isAdmin || isFirebaseAdmin;

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

    // 3b. Account Existence Lookup (by ID, Username, Phone Hash, or Email Hash)
    if (action === "lookupAccount") {
      const identifier = String(
        parsedUrl.searchParams.get("identifier") || body.identifier || body.email || ""
      ).trim();
      const role = String(parsedUrl.searchParams.get("role") || body.role || "").trim().toLowerCase();
      if (!identifier) {
        return sendJson(400, { success: false, error: "Identifier or email is required." });
      }
      const candidates = await findAccountDocs(identifier, role);
      const matched = candidates[0] || null;
      return sendJson(200, {
        success: true,
        exists: !!matched,
        account: matched ? sanitizePublicDoc("accounts", matched) : null
      });
    }

    // 3c. Server-Side Password & Verified Firebase Google SSO Login (never ships passwordHash to browser)
    if (action === "loginAccount" && req.method === "POST") {
      const identifier = String(body.identifier || "").trim();
      const rawPassword = String(body.password || "").trim();
      const givenHash = String(body.passwordHash || "").trim();
      const role = String(body.role || "").trim().toLowerCase();
      if (!identifier) {
        return sendJson(400, { success: false, error: "User ID, Mobile number, or Email is required." });
      }
      const candidates = await findAccountDocs(identifier, role);
      if (candidates.length === 0) {
        return sendJson(404, {
          success: false,
          notFound: true,
          error: `Account "${identifier}" not found. Please register & verify to create your account.`
        });
      }

      const pwdHashFromRaw = rawPassword ? kzClientHash(rawPassword) : "";
      const firebaseEmail = authResult.verified && authResult.email ? authResult.email.toLowerCase().trim() : "";

      const matched = candidates.find((acc) => {
        const storedHash = String(acc.passwordHash || "").trim();
        const storedPlain = String(acc.password || "").trim();
        const accEmail = String((acc.extraData && acc.extraData.email) || acc.email || "").toLowerCase().trim();
        if (firebaseEmail && (accEmail === firebaseEmail || String(acc.id || "").toLowerCase() === firebaseEmail)) {
          return true;
        }
        if (storedHash) {
          if (pwdHashFromRaw && storedHash === pwdHashFromRaw) return true;
          if (givenHash && (storedHash === givenHash || storedHash === kzClientHash(givenHash))) return true;
          if (rawPassword && storedHash === kzClientHash(kzClientHash(rawPassword))) return true;
        }
        if (storedPlain) {
          if (rawPassword && storedPlain === rawPassword) return true;
          if (pwdHashFromRaw && storedPlain === pwdHashFromRaw) return true;
          if (givenHash && storedPlain === givenHash) return true;
        }
        return false;
      });

      if (!matched) {
        return sendJson(401, {
          success: false,
          error: `Incorrect password for ${candidates[0].name || identifier}. Please check your password.`
        });
      }

      return sendJson(200, {
        success: true,
        authenticated: true,
        account: sanitizePublicDoc("accounts", matched)
      });
    }

    // 3d. Atomic Job Claim (Prevents Double-Accept Race Condition & Generates Random Server Start/End OTPs)
    if (action === "claimJob" && req.method === "POST") {
      const targetJobId = String(docId || body.jobId || "").trim();
      const worker = body.worker || {};
      const workerId = String(worker.id || body.workerId || "").trim();
      if (!targetJobId || !workerId) {
        return sendJson(400, { success: false, error: "jobId and workerId are required to claim a job." });
      }
      await connectMongo();
      const existingJob = await getDocById("jobs", targetJobId);
      if (existingJob) {
        if (
          existingJob.assignedWorkerId &&
          existingJob.assignedWorkerId !== workerId &&
          existingJob.status &&
          existingJob.status !== "broadcast"
        ) {
          return sendJson(409, {
            success: false,
            alreadyClaimed: true,
            error: "This job was just accepted by another nearby verified worker."
          });
        }
      }
      const startOtp =
        existingJob && /^\d{4}$/.test(String(existingJob.otpCode || ""))
          ? String(existingJob.otpCode)
          : String(crypto.randomInt(1000, 10000));
      let endOtp =
        existingJob && /^\d{4}$/.test(String(existingJob.endOtpCode || "")) && existingJob.endOtpCode !== startOtp
          ? String(existingJob.endOtpCode)
          : String(crypto.randomInt(1000, 10000));
      if (endOtp === startOtp) endOtp = String(((Number(startOtp) + 3571) % 9000) + 1000);

      const claimPatch = {
        ...(existingJob || body.jobSnapshot || {}),
        id: targetJobId,
        status: "accepted",
        otpCode: startOtp,
        endOtpCode: endOtp,
        assignedWorkerId: workerId,
        assignedWorkerName: String(worker.name || body.workerName || "Verified Worker").trim(),
        assignedWorkerPhone: String(worker.phone || body.workerPhone || "").trim(),
        assignedWorkerTrade: String(worker.primaryTrade || (existingJob && existingJob.trade) || "Service").trim(),
        assignedWorkerUpi: String(worker.upiId || body.workerUpi || "").trim(),
        acceptedAt: new Date().toISOString()
      };
      const savedJob = await upsertDoc("jobs", targetJobId, claimPatch, authResult);
      return sendJson(200, {
        success: true,
        claimed: true,
        job: sanitizePublicDoc("jobs", savedJob, false, false)
      });
    }

    // 3e. Server-Side Start / End Job OTP & QR Verification (Never exposes OTPs to Worker browser)
    if (action === "verifyJobOtp" && req.method === "POST") {
      const targetJobId = String(docId || body.jobId || "").trim();
      const mode = String(body.mode || "start").toLowerCase() === "end" ? "end" : "start";
      const rawInput = String(body.code || body.otp || "").trim();
      if (!targetJobId || !rawInput) {
        return sendJson(400, { success: false, verified: false, error: "Job ID and 4-digit OTP / QR scan are required." });
      }
      await connectMongo();
      const job = await getDocById("jobs", targetJobId);
      if (!job) {
        return sendJson(404, { success: false, verified: false, error: "Work order not found." });
      }
      let extracted = rawInput;
      if (/^KAAMZO[_-](START|END):/i.test(rawInput)) {
        const parts = rawInput.split(":");
        const scannedJobId = String(parts[1] || "").trim();
        if (scannedJobId && scannedJobId !== targetJobId) {
          return sendJson(400, { success: false, verified: false, error: "Scanned QR belongs to a different work order." });
        }
        extracted = String(parts[2] || "").trim();
      }
      const expectedOtp = String(mode === "end" ? job.endOtpCode || "" : job.otpCode || "").trim();
      if (!expectedOtp || !/^\d{4}$/.test(extracted) || extracted !== expectedOtp) {
        return sendJson(400, {
          success: false,
          verified: false,
          error: mode === "end"
            ? "Invalid End OTP. Ask the customer for their 4-digit End Code or scan their End QR."
            : "Invalid Start OTP. Ask the customer for their 4-digit Start OTP or scan their Start QR."
        });
      }
      const nextStatus = mode === "end" ? "completed_pending_payment" : "in_progress";
      const extraPatch =
        mode === "end"
          ? {
              status: nextStatus,
              endQrVerified: true,
              completedAt: new Date().toISOString(),
              ...(body.upiId ? { assignedWorkerUpi: String(body.upiId).trim(), workerUpi: String(body.upiId).trim() } : {})
            }
          : {
              status: nextStatus,
              startQrVerified: true,
              startedAt: new Date().toISOString()
            };
      const updated = await upsertDoc("jobs", targetJobId, { ...job, ...extraPatch }, authResult);
      return sendJson(200, {
        success: true,
        verified: true,
        mode,
        job: sanitizePublicDoc("jobs", updated, false, false)
      });
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
      if (collection === "accounts" && !isPrivilegedAdmin) {
        return sendJson(403, {
          success: false,
          error: "Listing all accounts requires administrator authorization."
        });
      }
      const limit = Math.min(200, Math.max(1, Number(parsedUrl.searchParams.get("limit") || 100)));
      const threadKey = parsedUrl.searchParams.get("threadKey");
      if (collection === "messages" && !threadKey && !isPrivilegedAdmin) {
        return sendJson(400, {
          success: false,
          error: "threadKey is required when listing messages."
        });
      }
      const customerKey = parsedUrl.searchParams.get("customerKey") || "";
      const filter = collection === "messages" && threadKey ? { threadKey: String(threadKey) } : {};
      const docs = await listDocs(collection, limit, filter);
      return sendJson(200, {
        success: true,
        collection,
        count: docs.length,
        docs: docs.map((d) =>
          sanitizePublicDoc(
            collection,
            d,
            isPrivilegedAdmin,
            collection === "jobs" && isCustomerOwnerOfJob(d, customerKey || authResult.email || authResult.uid)
          )
        )
      });
    }

    // 5. Get Single Document by ID
    if (action === "get") {
      if (!docId) {
        return sendJson(400, { success: false, error: "Document id is required" });
      }
      const customerKey = parsedUrl.searchParams.get("customerKey") || body.customerKey || "";
      const doc = await getDocById(collection, docId);
      const allowJobOtps =
        collection === "jobs" && isCustomerOwnerOfJob(doc, customerKey || authResult.email || authResult.uid);
      return sendJson(200, {
        success: true,
        collection,
        exists: !!doc,
        doc: sanitizePublicDoc(collection, doc, isPrivilegedAdmin, allowJobOtps)
      });
    }

    // 6. Upsert Document (Hardened against financial/KYC/ownership tampering)
    if (action === "upsert") {
      const rawPayload = body.data || body.doc || body;
      const payload = rawPayload && typeof rawPayload === "object" ? { ...rawPayload } : {};
      const targetId = String(docId || payload.id || `doc_${Date.now()}`).trim();
      const existingDoc = await getDocById(collection, targetId).catch(() => null);

      if (!isPrivilegedAdmin) {
        if (collection === "workers") {
          if (existingDoc) {
            payload.walletBalance = Number(existingDoc.walletBalance) || 0;
            payload.pendingEscrowBalance = Number(existingDoc.pendingEscrowBalance) || 0;
            payload.totalEarnings = Number(existingDoc.totalEarnings) || 0;
            payload.todayEarnings = Number(existingDoc.todayEarnings) || 0;
            payload.totalWithdrawn = Number(existingDoc.totalWithdrawn) || 0;
            payload.isVerified = Boolean(existingDoc.isVerified);
            payload.isBlocked = Boolean(existingDoc.isBlocked);
            payload.isBanned = Boolean(existingDoc.isBanned);
            if (existingDoc.blockReason) payload.blockReason = existingDoc.blockReason;
          } else {
            payload.walletBalance = 0;
            payload.pendingEscrowBalance = 0;
            payload.totalEarnings = 0;
            payload.todayEarnings = 0;
            payload.totalWithdrawn = 0;
            payload.isBlocked = false;
            payload.isBanned = false;
          }
        } else if (collection === "jobs") {
          if (existingDoc) {
            // Prevent second worker from overwriting an already-claimed job
            if (
              existingDoc.assignedWorkerId &&
              payload.assignedWorkerId &&
              existingDoc.assignedWorkerId !== payload.assignedWorkerId &&
              existingDoc.status &&
              existingDoc.status !== "broadcast"
            ) {
              return sendJson(409, {
                success: false,
                alreadyClaimed: true,
                error: "This job is already assigned to another worker."
              });
            }
            // Prevent client from forging payment settlement via /api/db
            payload.isPaid = Boolean(existingDoc.isPaid);
            payload.paidVia = existingDoc.paidVia;
            payload.transactionRef = existingDoc.transactionRef;
            payload.upiUtr = existingDoc.upiUtr;
            payload.razorpayPaymentId = existingDoc.razorpayPaymentId;
            if (existingDoc.isPaid && payload.status !== "paid_and_closed") {
              payload.status = existingDoc.status;
            }
            if (existingDoc.otpCode) payload.otpCode = existingDoc.otpCode;
            if (existingDoc.endOtpCode) payload.endOtpCode = existingDoc.endOtpCode;
          } else {
            payload.isPaid = false;
            delete payload.transactionRef;
            delete payload.upiUtr;
            delete payload.razorpayPaymentId;
            if (!/^\d{4}$/.test(String(payload.otpCode || ""))) {
              payload.otpCode = String(crypto.randomInt(1000, 10000));
            }
            if (!/^\d{4}$/.test(String(payload.endOtpCode || "")) || payload.endOtpCode === payload.otpCode) {
              payload.endOtpCode = String(crypto.randomInt(1000, 10000));
            }
          }
        }
      }

      const savedDoc = await upsertDoc(collection, targetId, payload, authResult);
      const allowJobOtps =
        collection === "jobs" &&
        isCustomerOwnerOfJob(savedDoc, body.customerKey || payload.customerEmail || payload.customerId || authResult.email || authResult.uid);
      const safeDoc = sanitizePublicDoc(collection, savedDoc, isPrivilegedAdmin, allowJobOtps);
      if (io) {
        io.emit("db:change", {
          action: "upsert",
          collection,
          id: targetId,
          doc: sanitizePublicDoc(collection, savedDoc, false, false),
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

    // 7. Admin Permanently Remove Worker (deletes from workers, verifications, and worker accounts)
    if (action === "deleteWorker" && req.method === "POST") {
      if (!isPrivilegedAdmin) {
        return sendJson(401, {
          success: false,
          error: "Unauthorized: Removing a worker requires an authenticated Admin session."
        });
      }
      const targetWorkerId = String(body.workerId || docId || "").trim();
      if (!targetWorkerId) {
        return sendJson(400, { success: false, error: "workerId is required." });
      }
      await connectMongo();
      const existingWorker = await getDocById("workers", targetWorkerId);
      await MODELS.workers.deleteOne({ id: targetWorkerId });
      await MODELS.verifications.deleteMany({
        $or: [{ workerId: targetWorkerId }, { id: `ver_${targetWorkerId}` }]
      });

      const accOr = [{ id: targetWorkerId }, { username: targetWorkerId }];
      const userId = String(body.userId || (existingWorker && (existingWorker.userId || existingWorker.username)) || "").trim().toLowerCase();
      if (userId) accOr.push({ id: userId }, { username: userId });
      const phone = String(body.phone || (existingWorker && existingWorker.phone) || "").trim();
      if (phone) {
        const phHash = hashPhoneForLookup(phone);
        if (phHash) accOr.push({ phoneHash: phHash });
        const digits10 = phone.replace(/[^0-9]/g, "").slice(-10);
        if (digits10.length === 10) {
          accOr.push({ id: digits10 }, { username: digits10 });
          const ph10Hash = hashPhoneForLookup(digits10);
          if (ph10Hash) accOr.push({ phoneHash: ph10Hash });
        }
      }
      const email = String(body.email || (existingWorker && existingWorker.email) || "").trim().toLowerCase();
      if (email) {
        const emHash = hashEmailForLookup(email);
        if (emHash) accOr.push({ emailHash: emHash });
      }
      await MODELS.accounts.deleteMany({ role: "worker", $or: accOr });

      if (io) {
        io.emit("db:change", {
          action: "deleteWorker",
          collection: "workers",
          id: targetWorkerId,
          timestamp: Date.now()
        });
      }
      return sendJson(200, {
        success: true,
        deletedWorkerId: targetWorkerId
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
