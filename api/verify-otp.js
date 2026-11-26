"use strict";
/**
 * Kaamzo Hardened OTP Verification API (/api/verify-otp)
 *
 * - Verifies against sealed AES-256-GCM encryptedOtpToken OR MongoDB `securityVerifications` salted hash
 * - Constant-time comparison (`crypto.timingSafeEqual`)
 * - 5-attempt brute-force lockout & single-use invalidation
 * - Strict CORS + per-IP rate limiting + Helmet headers
 */
const crypto = require("crypto");
const {
  connectMongo,
  MODELS,
  getDocById,
  hashPhoneForLookup,
  hashEmailForLookup,
  hmacBlindIndex
} = require("../lib/models");

const rateBuckets = new Map();

function checkRateLimit(key, maxReqs = 8, windowMs = 60 * 1000) {
  const now = Date.now();
  const entry = rateBuckets.get(key) || { count: 0, resetAt: now + windowMs };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + windowMs;
  }
  entry.count += 1;
  rateBuckets.set(key, entry);
  return {
    allowed: entry.count <= maxReqs,
    retryAfterSec: Math.ceil((entry.resetAt - now) / 1000)
  };
}

function getEncryptionKey() {
  const hex = process.env.ENCRYPTION_KEY || process.env.ENCRYPTION_HMAC_KEY || "";
  if (/^[0-9a-fA-F]{64}$/.test(hex)) {
    return Buffer.from(hex, "hex");
  }
  if (!hex) {
    throw new Error("Server ENCRYPTION_KEY is missing in environment variables.");
  }
  return crypto.createHash("sha256").update(hex).digest();
}

function decryptOtpToken(token) {
  const parts = String(token || "").split(".");
  if (parts.length !== 3) return null;
  const iv = Buffer.from(parts[0], "base64url");
  const tag = Buffer.from(parts[1], "base64url");
  const encrypted = Buffer.from(parts[2], "base64url");
  const decipher = crypto.createDecipheriv("aes-256-gcm", getEncryptionKey(), iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
  return JSON.parse(decrypted);
}

function normalizeIndianPhone(raw) {
  const digits = String(raw || "").replace(/[^0-9]/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return digits ? `+${digits}` : "";
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

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Cache-Control", "no-store");
}

module.exports = async function handler(req, res) {
  applySecurityAndCorsHeaders(req, res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify({ success: false, error: "Method not allowed" }));
  }

  const sendJson = (status, obj) => {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.end(JSON.stringify(obj));
  };

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const submittedOtp = String(body.otp || body.code || "").trim();
    const rawRecipient = String(body.recipient || body.email || body.phone || "").trim();
    const token = body.encryptedOtpToken || body.token;

    if (!submittedOtp || !/^\d{6}$/.test(submittedOtp)) {
      return sendJson(400, { success: false, error: "Please enter a valid 6-digit numeric OTP." });
    }

    let tokenPayload = null;
    if (token) {
      try {
        tokenPayload = decryptOtpToken(token);
      } catch (_) {
        tokenPayload = null;
      }
    }
    const effectiveRecipient = String(rawRecipient || (tokenPayload && tokenPayload.recipient) || "").trim();

    const clientIp =
      (req.headers && req.headers["x-forwarded-for"] && String(req.headers["x-forwarded-for"]).split(",")[0].trim()) ||
      (req.socket && req.socket.remoteAddress) ||
      "127.0.0.1";

    const rl = checkRateLimit(`verify_otp_${clientIp}_${effectiveRecipient.toLowerCase()}`, 8, 60 * 1000);
    if (!rl.allowed) {
      res.setHeader("Retry-After", String(rl.retryAfterSec));
      return sendJson(429, {
        success: false,
        error: `Too many OTP attempts. Locked for ${rl.retryAfterSec}s.`
      });
    }

    // 1. Verify via MongoDB `securityVerifications` (stateful single-use & attempt-limited)
    if (effectiveRecipient) {
      const isEmail = effectiveRecipient.includes("@");
      const canonical = isEmail ? effectiveRecipient.toLowerCase() : normalizeIndianPhone(effectiveRecipient);
      const recId = isEmail ? hashEmailForLookup(canonical) : (hashPhoneForLookup(canonical) || hmacBlindIndex(canonical));
      const doc = await getDocById("securityVerifications", recId).catch(() => null);
      if (doc) {
        if (doc.expiresAt && Date.now() > Date.parse(doc.expiresAt)) {
          await MODELS.securityVerifications.deleteOne({ id: recId }).catch(() => {});
          return sendJson(400, { success: false, expired: true, error: "OTP expired. Please request a new code." });
        }
        if ((doc.attempts || 0) >= 5) {
          await MODELS.securityVerifications.deleteOne({ id: recId }).catch(() => {});
          return sendJson(403, { success: false, error: "Maximum OTP attempts exceeded. Request a new code." });
        }
        if (doc.codeHash && doc.salt) {
          const expectedBuf = Buffer.from(doc.codeHash, "hex");
          const actualBuf = crypto.createHash("sha256").update(`${submittedOtp}:${doc.salt}`).digest();
          if (expectedBuf.length === actualBuf.length && crypto.timingSafeEqual(expectedBuf, actualBuf)) {
            await MODELS.securityVerifications.deleteOne({ id: recId }).catch(() => {});
            return sendJson(200, {
              success: true,
              verified: true,
              recipient: canonical,
              encryption: "AES-256-GCM + MongoDB Salted SHA-256"
            });
          }
          await MODELS.securityVerifications.updateOne({ id: recId }, { $inc: { attempts: 1 } }).catch(() => {});
          return sendJson(400, {
            success: false,
            error: "Invalid OTP code. Please check the 6-digit code and try again."
          });
        }
      } else {
        // Record was already consumed or expired/locked out -> reject stateless token replay!
        return sendJson(400, {
          success: false,
          expired: true,
          error: "OTP already used or expired. Please request a new verification code."
        });
      }
    }

    // 2. Fallback only if MongoDB was unreachable at send time and no recipient could be indexed
    if (tokenPayload) {
      if (Date.now() > tokenPayload.exp) {
        return sendJson(400, { success: false, expired: true, error: "OTP token expired or invalid." });
      }
      const expectedBuf = Buffer.from(tokenPayload.codeHash, "hex");
      const actualBuf = crypto.createHash("sha256").update(`${submittedOtp}:${tokenPayload.salt}`).digest();
      if (expectedBuf.length === actualBuf.length && crypto.timingSafeEqual(expectedBuf, actualBuf)) {
        return sendJson(200, {
          success: true,
          verified: true,
          recipient: tokenPayload.recipient,
          encryption: "AES-256-GCM + Salted SHA-256"
        });
      }
    }

    return sendJson(400, {
      success: false,
      error: "Invalid or expired OTP code. Please request a new code."
    });
  } catch (err) {
    return sendJson(400, {
      success: false,
      error: "Invalid OTP code. Please check the 6-digit code and try again."
    });
  }
};
