"use strict";
/**
 * Kaamzo Firebase ID Token Verification Middleware
 *
 * RULE 1 COMPLIANCE:
 *  - Frontend Firebase Google login remains 100% untouched.
 *  - Backend verifies the Firebase ID token using Firebase Admin SDK (`admin.auth().verifyIdToken(idToken)`)
 *    and extracts `uid` (used as the user's `uid` in MongoDB).
 */
const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "nifty-backup-mc9s2";

function initFirebaseAdmin() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  // 1. Check inline JSON env var (ideal for Vercel production)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      const certObj = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
      return admin.initializeApp({
        credential: admin.credential.cert(certObj),
        projectId: certObj.project_id || PROJECT_ID
      });
    } catch (e) {
      console.warn("[Firebase Admin] Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:", e.message);
    }
  }

  // 2. Check service account file path
  const saPath = path.resolve(
    __dirname,
    "..",
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "./firebase-service-account.json"
  );
  if (fs.existsSync(saPath)) {
    try {
      const certObj = JSON.parse(fs.readFileSync(saPath, "utf8"));
      return admin.initializeApp({
        credential: admin.credential.cert(certObj),
        projectId: certObj.project_id || PROJECT_ID
      });
    } catch (e) {
      console.warn("[Firebase Admin] Failed to load service account file:", e.message);
    }
  }

  // 3. Initialize with projectId (verifyIdToken verifies Google RS256 public keys for nifty-backup-mc9s2)
  return admin.initializeApp({ projectId: PROJECT_ID });
}

/**
 * Verifies a Firebase Auth ID token from `Authorization: Bearer <idToken>` or `body.idToken`.
 * Returns `{ verified: true, uid, email, name, emailVerified }` or `{ verified: false, uid: null }`.
 */
async function verifyFirebaseIdToken(req, body = {}) {
  const authHeader = String((req && req.headers && req.headers.authorization) || "");
  let idToken = "";
  if (authHeader.startsWith("Bearer ")) {
    idToken = authHeader.slice(7).trim();
  } else if (body && body.idToken) {
    idToken = String(body.idToken).trim();
  }

  if (!idToken) {
    return {
      verified: false,
      uid: (body && body.uid) || null,
      reason: "no_token_provided"
    };
  }

  try {
    initFirebaseAdmin();
    const decoded = await admin.auth().verifyIdToken(idToken);
    return {
      verified: true,
      uid: decoded.uid,
      email: decoded.email || "",
      name: decoded.name || "",
      emailVerified: !!decoded.email_verified,
      method: "firebase_admin_verifyIdToken"
    };
  } catch (adminErr) {
    // Fallback to Google Identity Toolkit lookup if running without service credentials
    const apiKey = process.env.FIREBASE_WEB_API_KEY;
    if (apiKey) {
      try {
        const resp = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken })
          }
        );
        if (resp.ok) {
          const data = await resp.json();
          const u = data && data.users && data.users[0];
          if (u && u.localId) {
            return {
              verified: true,
              uid: u.localId,
              email: u.email || "",
              name: u.displayName || "",
              emailVerified: !!u.emailVerified,
              method: "firebase_identity_toolkit"
            };
          }
        }
      } catch (_) {}
    }

    return {
      verified: false,
      uid: null,
      error: adminErr.message
    };
  }
}

module.exports = {
  initFirebaseAdmin,
  verifyFirebaseIdToken
};
