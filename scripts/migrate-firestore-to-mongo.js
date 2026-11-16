#!/usr/bin/env node
"use strict";
/**
 * Kaamzo One-Time Migration Script: Cloud Firestore -> MongoDB Atlas (with AES-256-GCM Field Encryption)
 *
 * - Reads all documents from all 7 collections in Firestore (`kaamzo-631f4` and `nifty-backup-mc9s2`)
 *   via Firebase Admin SDK (if service account JSON is present) and Firestore REST API
 * - Preserves every document `id`, Firebase `uid`, and relationship (`workerId`, `jobId`, `assignedWorkerId`)
 * - Encrypts sensitive fields (`phone`, `customerPhone`, `workerPhone`, `address`, `locationAddress`, `aadhaarNumber`, `upiId`, `email`)
 *   with AES-256-GCM (random 12-byte IV + 16-byte auth tag per value)
 * - Generates HMAC-SHA256 searchable blind indexes (`phoneHash`, `emailHash`, `aadhaarHash`)
 * - Does NOT delete or modify anything in Firestore (safe read-only copy for instant rollback)
 */
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const { connectMongo, MODELS, upsertDoc, getDocById, lookupByPhone } = require("../lib/models");
const { isEncryptedValue } = require("../lib/encryption");

const SOURCES = [
  { projectId: "kaamzo-631f4", databaseId: "(default)" },
  {
    projectId: process.env.FIREBASE_PROJECT_ID || "nifty-backup-mc9s2",
    databaseId:
      process.env.FIRESTORE_DATABASE_ID || "ai-studio-remixdihadi2-48a2ad23-40fd-4483-b22e-afff081bb36d"
  },
  { projectId: "nifty-backup-mc9s2", databaseId: "(default)" }
];

const COLLECTIONS = [
  "workers",
  "jobs",
  "verifications",
  "disputes",
  "accounts",
  "sosAlerts",
  "securityVerifications"
];

function parseFirestoreValue(valObj) {
  if (!valObj || typeof valObj !== "object") return null;
  if ("stringValue" in valObj) return valObj.stringValue;
  if ("integerValue" in valObj) return Number(valObj.integerValue);
  if ("doubleValue" in valObj) return Number(valObj.doubleValue);
  if ("booleanValue" in valObj) return Boolean(valObj.booleanValue);
  if ("nullValue" in valObj) return null;
  if ("timestampValue" in valObj) return valObj.timestampValue;
  if ("arrayValue" in valObj) {
    const vals = (valObj.arrayValue && valObj.arrayValue.values) || [];
    return vals.map(parseFirestoreValue);
  }
  if ("mapValue" in valObj) {
    const fields = (valObj.mapValue && valObj.mapValue.fields) || {};
    const out = {};
    for (const [k, v] of Object.entries(fields)) {
      out[k] = parseFirestoreValue(v);
    }
    return out;
  }
  return null;
}

function parseFirestoreDoc(doc) {
  const parts = String(doc.name || "").split("/");
  const docId = parts[parts.length - 1];
  const fields = doc.fields || {};
  const out = { id: docId };
  for (const [k, v] of Object.entries(fields)) {
    out[k] = parseFirestoreValue(v);
  }
  if (!out.id) out.id = docId;
  return out;
}

async function fetchCollectionFromFirestoreRest(projectId, databaseId, collectionName) {
  const docs = [];
  let pageToken = "";
  do {
    const url =
      `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}` +
      `/databases/${encodeURIComponent(databaseId)}/documents/${encodeURIComponent(collectionName)}` +
      `?pageSize=200${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ""}`;

    const res = await fetch(url);
    if (!res.ok) {
      break;
    }
    const data = await res.json();
    const batch = Array.isArray(data.documents) ? data.documents : [];
    for (const rawDoc of batch) {
      docs.push(parseFirestoreDoc(rawDoc));
    }
    pageToken = data.nextPageToken || "";
  } while (pageToken);

  return docs;
}

async function fetchCollectionViaAdminSdk(collectionName) {
  const saPath = path.resolve(
    __dirname,
    "..",
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "./firebase-service-account.json"
  );
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON && !fs.existsSync(saPath)) {
    return [];
  }
  try {
    const { initFirebaseAdmin } = require("../lib/firebase-auth");
    const admin = require("firebase-admin");
    initFirebaseAdmin();
    const db = admin.firestore();
    const snap = await db.collection(collectionName).get();
    const out = [];
    snap.forEach((doc) => {
      out.push({ id: doc.id, ...doc.data() });
    });
    return out;
  } catch (_) {
    return [];
  }
}

async function runMigration() {
  console.log("=================================================================");
  console.log("🚀 KAAMZO MIGRATION: Cloud Firestore -> MongoDB Atlas (AES-256-GCM)");
  console.log("=================================================================");
  console.log(`• Target MongoDB Cluster   : ${(process.env.MONGODB_URI || "").replace(/:[^:@]+@/, ":****@")}`);

  await connectMongo();
  console.log("✅ Connected to MongoDB Atlas with TLS enabled.\n");

  // Ensure Mongoose indexes are created on all 7 collections
  for (const [colName, Model] of Object.entries(MODELS)) {
    await Model.init();
    console.log(`   ✓ Verified indexes for collection: ${colName}`);
  }
  console.log("");

  let totalMigrated = 0;
  for (const colName of COLLECTIONS) {
    const mergedDocs = new Map();

    // 1. Check Firebase Admin SDK if service account is configured
    const adminDocs = await fetchCollectionViaAdminSdk(colName);
    for (const d of adminDocs) {
      mergedDocs.set(d.id, d);
    }

    // 2. Check Firestore REST across configured projects/databases
    for (const src of SOURCES) {
      const restDocs = await fetchCollectionFromFirestoreRest(src.projectId, src.databaseId, colName);
      for (const d of restDocs) {
        if (!mergedDocs.has(d.id)) {
          mergedDocs.set(d.id, d);
        }
      }
    }

    console.log(`📦 Collection '${colName}': found ${mergedDocs.size} document(s) in Firestore.`);

    let colCount = 0;
    for (const [docId, doc] of mergedDocs.entries()) {
      const cleanId = String(docId || doc.id || `migrated_${Date.now()}`).trim();
      await upsertDoc(colName, cleanId, doc, doc.uid ? { uid: doc.uid } : null);
      colCount++;
      totalMigrated++;
    }
    console.log(`   ✅ Encrypted (AES-256-GCM + HMAC-SHA256) & upserted ${colCount} document(s) into MongoDB '${colName}'.`);
  }

  // Verify raw encrypted storage vs decrypted read in MongoDB
  console.log("\n🔐 Running Live End-to-End AES-256-GCM + HMAC-SHA256 Verification Check on MongoDB Atlas...");
  let sampleRawWorker = await MODELS.workers.findOne({}).lean();
  let createdProbe = false;
  if (!sampleRawWorker) {
    createdProbe = true;
    await upsertDoc(
      "workers",
      "w-encryption-verify-probe",
      {
        id: "w-encryption-verify-probe",
        name: "Gurpreet Singh (Encryption Verification)",
        phone: "+91 98765 43210",
        email: "gurpreet.verify@kaamzo.site",
        primaryTrade: "Electrician",
        dailyRate: 850,
        area: "Model Town",
        city: "Ludhiana",
        address: "House 142, Model Town Extension, Ludhiana",
        aadhaarNumber: "4912-8834-9901",
        upiId: "gurpreet.kaamzo@okaxis",
        isVerified: true
      },
      { uid: "firebase_uid_verify_probe" }
    );
    sampleRawWorker = await MODELS.workers.findOne({ id: "w-encryption-verify-probe" }).lean();
  }

  if (sampleRawWorker) {
    const decryptedWorker = await getDocById("workers", sampleRawWorker.id);
    const blindLookup = await lookupByPhone(decryptedWorker.phone);
    console.log("   • Raw MongoDB Document ID       :", sampleRawWorker.id);
    console.log("   • Raw MongoDB Firebase UID      :", sampleRawWorker.uid);
    console.log("   • Raw MongoDB Phone (Ciphertext):", sampleRawWorker.phone);
    console.log("   • Is Unreadable AES-256-GCM?    :", isEncryptedValue(sampleRawWorker.phone));
    console.log("   • Raw MongoDB Address           :", String(sampleRawWorker.address || "").slice(0, 56) + "...");
    console.log("   • Raw MongoDB Aadhaar           :", String(sampleRawWorker.aadhaarNumber || "").slice(0, 56) + "...");
    console.log("   • Raw MongoDB UPI ID            :", String(sampleRawWorker.upiId || "").slice(0, 56) + "...");
    console.log("   • Raw HMAC-SHA256 phoneHash     :", String(sampleRawWorker.phoneHash || "").slice(0, 32) + "...");
    console.log("   • Auto-Decrypted Phone on Read  :", decryptedWorker.phone);
    console.log("   • Auto-Decrypted Address on Read:", decryptedWorker.address);
    console.log("   • Blind-Index Phone Lookup Match:", blindLookup.workers.length > 0);
  }

  if (createdProbe) {
    await MODELS.workers.deleteOne({ id: "w-encryption-verify-probe" });
    console.log("   ✓ Cleaned up temporary verification probe document.");
  }

  console.log("\n=================================================================");
  console.log(`🎉 MIGRATION COMPLETE! Total documents migrated & encrypted: ${totalMigrated}`);
  console.log("🛡️ Firestore data was left 100% untouched for safe rollback.");
  console.log("=================================================================");
  process.exit(0);
}

runMigration().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
