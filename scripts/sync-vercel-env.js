#!/usr/bin/env node
"use strict";
const { execSync } = require("child_process");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const vars = [
  "MONGODB_URI",
  "ENCRYPTION_KEY",
  "ENCRYPTION_HMAC_KEY",
  "FIREBASE_PROJECT_ID",
  "FIREBASE_WEB_API_KEY",
  "ALLOWED_ORIGINS"
];

for (const k of vars) {
  const val = process.env[k];
  if (!val) continue;
  for (const env of ["production", "preview", "development"]) {
    try {
      execSync(`npx vercel env rm ${k} ${env} --yes`, { stdio: "ignore" });
    } catch (_) {}
    try {
      execSync(`npx vercel env add ${k} ${env}`, {
        input: val,
        stdio: ["pipe", "pipe", "ignore"]
      });
      console.log(`✅ Synced ${k} to Vercel (${env})`);
    } catch (e) {
      console.warn(`⚠️ Notice syncing ${k} (${env}):`, e.message);
    }
  }
}
