#!/usr/bin/env node
"use strict";
/**
 * Kaamzo 256-Bit Key Generator & .env Initializer
 * Generates:
 *  - ENCRYPTION_KEY: 256-bit (32-byte / 64-hex) key for AES-256-GCM field-level encryption
 *  - ENCRYPTION_HMAC_KEY: 256-bit (32-byte / 64-hex) key for HMAC-SHA256 searchable blind indexes
 * Also merges MONGODB_URI from atlas-credentials if present.
 */
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const envPath = path.resolve(__dirname, "..", ".env");
const atlasCredsPath = "c:\\Users\\punee\\Downloads\\atlas-credentials (1).env";
const forceRotate = process.argv.includes("--rotate");

function parseEnvFile(filePath) {
  const map = new Map();
  if (!fs.existsSync(filePath)) return map;
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      map.set(key, val);
    }
  }
  return map;
}

const existing = parseEnvFile(envPath);
const atlas = parseEnvFile(atlasCredsPath);

let encryptionKey = existing.get("ENCRYPTION_KEY");
let hmacKey = existing.get("ENCRYPTION_HMAC_KEY");

if (!encryptionKey || encryptionKey.length !== 64 || forceRotate) {
  encryptionKey = crypto.randomBytes(32).toString("hex");
  console.log("✅ Generated new 256-bit AES-256-GCM ENCRYPTION_KEY (32 bytes / 64 hex chars)");
} else {
  console.log("ℹ️ Preserved existing 256-bit ENCRYPTION_KEY in .env (use --rotate to regenerate)");
}

if (!hmacKey || hmacKey.length !== 64 || forceRotate) {
  hmacKey = crypto.randomBytes(32).toString("hex");
  console.log("✅ Generated new 256-bit HMAC-SHA256 ENCRYPTION_HMAC_KEY (32 bytes / 64 hex chars)");
} else {
  console.log("ℹ️ Preserved existing 256-bit ENCRYPTION_HMAC_KEY in .env (use --rotate to regenerate)");
}

let mongoUri = existing.get("MONGODB_URI") || atlas.get("MONGODB_URI") || "";
if (mongoUri && mongoUri.endsWith("/")) {
  mongoUri = `${mongoUri}kaamzo?retryWrites=true&w=majority&tls=true`;
}

existing.set("ENCRYPTION_KEY", encryptionKey);
existing.set("ENCRYPTION_HMAC_KEY", hmacKey);
if (mongoUri) existing.set("MONGODB_URI", mongoUri);
if (atlas.get("MONGODB_USERNAME")) existing.set("MONGODB_USERNAME", atlas.get("MONGODB_USERNAME"));
if (!existing.get("FIREBASE_PROJECT_ID")) existing.set("FIREBASE_PROJECT_ID", "nifty-backup-mc9s2");
if (!existing.get("FIRESTORE_DATABASE_ID")) existing.set("FIRESTORE_DATABASE_ID", "ai-studio-remixdihadi2-48a2ad23-40fd-4483-b22e-afff081bb36d");

const header = [
  "# =============================================================================",
  "# Kaamzo Production Environment (.env) - Gitignored (NEVER COMMIT TO GIT)",
  "# IMPORTANT: Back up ENCRYPTION_KEY and ENCRYPTION_HMAC_KEY in a password manager!",
  "# If ENCRYPTION_KEY is lost, AES-256-GCM encrypted fields in MongoDB cannot be decrypted.",
  "# ============================================================================="
];

const bodyLines = [];
for (const [k, v] of existing.entries()) {
  bodyLines.push(`${k}=${v}`);
}

fs.writeFileSync(envPath, header.concat(bodyLines).join("\n") + "\n", "utf8");
console.log(`🔒 Successfully wrote .env at: ${envPath}`);
