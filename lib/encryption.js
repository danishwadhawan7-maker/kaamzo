"use strict";
/**
 * Kaamzo 256-Bit Field-Level Encryption & Searchable Blind Indexing Module
 *
 * - Algorithm: AES-256-GCM (256-bit key, 96-bit / 12-byte CSPRNG IV per value, 128-bit / 16-byte Auth Tag)
 * - Searchable Blind Index: HMAC-SHA256 (256-bit key) for O(1) indexed lookups on phone numbers, emails, and Aadhaar
 * - Ciphertext Wire Format: enc:v1:<iv_base64url>:<authTag_base64url>:<ciphertext_base64url>
 */
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// Load .env if not already loaded
try {
  const envFile = path.resolve(__dirname, "..", ".env");
  if (fs.existsSync(envFile)) {
    const lines = fs.readFileSync(envFile, "utf8").split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx > 0) {
        const k = trimmed.slice(0, idx).trim();
        let v = trimmed.slice(idx + 1).trim();
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
          v = v.slice(1, -1);
        }
        if (!process.env[k]) process.env[k] = v;
      }
    }
  }
} catch (_) {}

const PREFIX = "enc:v1:";

function getAesKey() {
  const hex = process.env.ENCRYPTION_KEY || "";
  if (/^[0-9a-fA-F]{64}$/.test(hex)) {
    return Buffer.from(hex, "hex");
  }
  if (!hex) {
    throw new Error("ENCRYPTION_KEY (64-char hex / 256-bit) is missing in environment variables. Run: node scripts/generate-keys.js");
  }
  return crypto.createHash("sha256").update(String(hex)).digest();
}

function getHmacKey() {
  const hex = process.env.ENCRYPTION_HMAC_KEY || "";
  if (/^[0-9a-fA-F]{64}$/.test(hex)) {
    return Buffer.from(hex, "hex");
  }
  if (!hex) {
    throw new Error("ENCRYPTION_HMAC_KEY (64-char hex / 256-bit) is missing in environment variables. Run: node scripts/generate-keys.js");
  }
  return crypto.createHash("sha256").update(String(hex)).digest();
}

function isEncryptedValue(val) {
  return typeof val === "string" && val.startsWith(PREFIX) && val.split(":").length === 5;
}

/**
 * Encrypts a string value using AES-256-GCM with a unique random 12-byte IV and 16-byte Auth Tag.
 */
function encryptField(plaintext) {
  if (plaintext === null || plaintext === undefined) return plaintext;
  const str = String(plaintext);
  if (!str.trim()) return str;
  if (isEncryptedValue(str)) return str; // Already encrypted

  const key = getAesKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(str, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return `${PREFIX}${iv.toString("base64url")}:${authTag.toString("base64url")}:${encrypted.toString("base64url")}`;
}

/**
 * Decrypts an AES-256-GCM encrypted string value, verifying the 16-byte Auth Tag.
 */
function decryptField(ciphertext) {
  if (ciphertext === null || ciphertext === undefined) return ciphertext;
  const str = String(ciphertext);
  if (!isEncryptedValue(str)) return str;

  try {
    const parts = str.slice(PREFIX.length).split(":");
    if (parts.length !== 3) return str;
    const iv = Buffer.from(parts[0], "base64url");
    const authTag = Buffer.from(parts[1], "base64url");
    const encrypted = Buffer.from(parts[2], "base64url");

    const key = getAesKey();
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(authTag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString("utf8");
  } catch (err) {
    console.error("[Kaamzo AES-256-GCM Decryption Error]:", err.message);
    return str;
  }
}

function normalizePhone(phone) {
  const plain = isEncryptedValue(phone) ? decryptField(phone) : String(phone || "");
  const digits = plain.replace(/[^0-9]/g, "");
  if (digits.length >= 10) return digits.slice(-10);
  return digits;
}

function normalizeEmail(email) {
  const plain = isEncryptedValue(email) ? decryptField(email) : String(email || "");
  return plain.trim().toLowerCase();
}

function normalizeAadhaar(aadhaar) {
  const plain = isEncryptedValue(aadhaar) ? decryptField(aadhaar) : String(aadhaar || "");
  return plain.replace(/[^0-9]/g, "");
}

/**
 * Generates a keyed HMAC-SHA256 hash so encrypted fields (like phone numbers for AI receptionist)
 * remain searchable with exact-match database indexes without exposing plaintext.
 */
function hmacBlindIndex(normalizedValue) {
  const clean = String(normalizedValue || "").trim();
  if (!clean) return "";
  return crypto.createHmac("sha256", getHmacKey()).update(clean).digest("hex");
}

function hashPhoneForLookup(phone) {
  const norm = normalizePhone(phone);
  return norm ? hmacBlindIndex(`phone:${norm}`) : "";
}

function hashEmailForLookup(email) {
  const norm = normalizeEmail(email);
  return norm ? hmacBlindIndex(`email:${norm}`) : "";
}

function hashAadhaarForLookup(aadhaar) {
  const norm = normalizeAadhaar(aadhaar);
  return norm.length >= 4 ? hmacBlindIndex(`aadhaar:${norm}`) : "";
}

// Sensitive top-level string fields to encrypt with AES-256-GCM
const TOP_LEVEL_SENSITIVE_FIELDS = [
  "phone",
  "customerPhone",
  "workerPhone",
  "assignedWorkerPhone",
  "address",
  "locationAddress",
  "aadhaarNumber",
  "upiId",
  "workerUpi",
  "assignedWorkerUpi",
  "email",
  "identifier",
  "text",
  "senderPhone",
  "receiverPhone"
];

// Sensitive nested fields inside extraData / location / gpsLocation
const NESTED_SENSITIVE_PATHS = [
  ["location", "address"],
  ["gpsLocation", "address"],
  ["extraData", "aadhaar"],
  ["extraData", "address"],
  ["extraData", "upi"],
  ["extraData", "email"],
  ["extraData", "phone"],
  ["agreedTermsSnapshot", "customerPhone"],
  ["agreedTermsSnapshot", "workerPhone"]
];

/**
 * Clones a document object, computes searchable HMAC-SHA256 blind indexes (phoneHash, emailHash, etc.),
 * and encrypts all sensitive fields with AES-256-GCM before saving to MongoDB.
 */
function encryptDocumentFields(doc) {
  if (!doc || typeof doc !== "object") return doc;
  const clone = JSON.parse(JSON.stringify(doc));

  // 1. Compute searchable HMAC-SHA256 blind indexes before encrypting
  const rawPhone = clone.phone || (clone.extraData && clone.extraData.phone) || "";
  if (rawPhone) {
    clone.phoneHash = hashPhoneForLookup(rawPhone);
  }
  if (clone.customerPhone) {
    clone.customerPhoneHash = hashPhoneForLookup(clone.customerPhone);
  }
  const rawWorkerPhone = clone.workerPhone || clone.assignedWorkerPhone || "";
  if (rawWorkerPhone) {
    clone.workerPhoneHash = hashPhoneForLookup(rawWorkerPhone);
  }
  const rawEmail = clone.email || (clone.extraData && clone.extraData.email) || "";
  if (rawEmail) {
    clone.emailHash = hashEmailForLookup(rawEmail);
  }
  const rawAadhaar = clone.aadhaarNumber || (clone.extraData && clone.extraData.aadhaar) || "";
  if (rawAadhaar && !String(rawAadhaar).startsWith("XXXX")) {
    clone.aadhaarHash = hashAadhaarForLookup(rawAadhaar);
  }
  if (clone.identifier) {
    const idStr = String(clone.identifier);
    clone.identifierHash = idStr.includes("@") ? hashEmailForLookup(idStr) : hmacBlindIndex(`id:${idStr.trim().toLowerCase()}`);
  }

  // 2. Encrypt top-level sensitive fields with AES-256-GCM
  for (const field of TOP_LEVEL_SENSITIVE_FIELDS) {
    if (typeof clone[field] === "string" && clone[field].trim() !== "") {
      clone[field] = encryptField(clone[field]);
    }
  }

  // 3. Encrypt nested sensitive fields with AES-256-GCM
  for (const [parentKey, childKey] of NESTED_SENSITIVE_PATHS) {
    if (
      clone[parentKey] &&
      typeof clone[parentKey] === "object" &&
      typeof clone[parentKey][childKey] === "string" &&
      clone[parentKey][childKey].trim() !== ""
    ) {
      clone[parentKey][childKey] = encryptField(clone[parentKey][childKey]);
    }
  }

  return clone;
}

/**
 * Clones a document retrieved from MongoDB and automatically decrypts all AES-256-GCM fields.
 */
function decryptDocumentFields(doc) {
  if (!doc || typeof doc !== "object") return doc;
  const raw = typeof doc.toObject === "function" ? doc.toObject() : JSON.parse(JSON.stringify(doc));

  for (const field of TOP_LEVEL_SENSITIVE_FIELDS) {
    if (typeof raw[field] === "string" && isEncryptedValue(raw[field])) {
      raw[field] = decryptField(raw[field]);
    }
  }

  for (const [parentKey, childKey] of NESTED_SENSITIVE_PATHS) {
    if (
      raw[parentKey] &&
      typeof raw[parentKey] === "object" &&
      typeof raw[parentKey][childKey] === "string" &&
      isEncryptedValue(raw[parentKey][childKey])
    ) {
      raw[parentKey][childKey] = decryptField(raw[parentKey][childKey]);
    }
  }

  // Recursively decrypt any remaining enc:v1: strings anywhere in the document
  function deepDecrypt(obj) {
    if (!obj || typeof obj !== "object") return;
    for (const k of Object.keys(obj)) {
      if (typeof obj[k] === "string" && isEncryptedValue(obj[k])) {
        obj[k] = decryptField(obj[k]);
      } else if (obj[k] && typeof obj[k] === "object") {
        deepDecrypt(obj[k]);
      }
    }
  }
  deepDecrypt(raw);

  // Strip internal MongoDB _id / __v and blind-index hash fields before returning to UI
  delete raw._id;
  delete raw.__v;
  return raw;
}

module.exports = {
  PREFIX,
  isEncryptedValue,
  encryptField,
  decryptField,
  hmacBlindIndex,
  normalizePhone,
  normalizeEmail,
  hashPhoneForLookup,
  hashEmailForLookup,
  hashAadhaarForLookup,
  encryptDocumentFields,
  decryptDocumentFields
};
