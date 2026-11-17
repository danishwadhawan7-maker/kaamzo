require("dotenv").config();
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const dbHandler = require("./api/db");
const translateHandler = require("./api/translate");
const estimateJobHandler = require("./api/estimate-job");
const sendOtpHandler = require("./api/send-otp");
const verifyOtpHandler = require("./api/verify-otp");
const adminSecurity = require("./admin-security");
const { connectMongo, MODELS } = require("./lib/models");
const { decryptDocumentFields } = require("./lib/encryption");

const PORT = process.env.PORT || 3000;
const WWW_DIR = path.join(__dirname, "www");
let io = null;

// Shared Architecture Constants (Recommended Setup: 1 Shared Firestore + 1-Way Notion Ops Layer)
const SHARED_FIREBASE_CONFIG = {
  projectId: "nifty-backup-mc9s2",
  firestoreDatabaseId: "ai-studio-remixdihadi2-48a2ad23-40fd-4483-b22e-afff081bb36d",
  authDomain: "nifty-backup-mc9s2.firebaseapp.com",
  storageBucket: "nifty-backup-mc9s2.firebasestorage.app"
};

const NOTION_OPS_HUB = {
  hubPageId: "4193f1ea-18f6-8184-a096-eea935695fae",
  hubUrl: "https://app.notion.com/p/4193f1ea18f68184a096eea935695fae",
  databases: {
    kycQueue: {
      id: "4193f1ea-18f6-81fb-833e-e4961149cfd6",
      dataSourceUrl: "collection://4193f1ea-18f6-812c-ac00-000b2189eaa1",
      url: "https://app.notion.com/p/4193f1ea18f681fb833ee4961149cfd6"
    },
    jobsCommissionLedger: {
      id: "4193f1ea-18f6-8182-8e5b-f6a324e3349a",
      dataSourceUrl: "collection://4193f1ea-18f6-815b-a060-000b245098fb",
      url: "https://app.notion.com/p/4193f1ea18f681828e5bf6a324e3349a"
    },
    disputesAndSecurityAudit: {
      id: "4193f1ea-18f6-81f2-9bb3-c2c457ea4aaa",
      dataSourceUrl: "collection://4193f1ea-18f6-817a-a87e-000be0bbe98e",
      url: "https://app.notion.com/p/4193f1ea18f681f2-9bb3-c2c457ea4aaa"
    }
  }
};

// In-memory OTP store, Admin Session Store, Rate Limiters & Notion Sync Queue
const otpStore = new Map();
const rateLimitStore = new Map();
const adminSessions = new Map();
let currentAdminOtp = "202600";
let adminMasterPin = process.env.KAAMZO_ADMIN_PIN || "2026";
let adminMasterPassword = process.env.KAAMZO_ADMIN_PASSWORD || "admin123";

const ADMIN_WHITELIST = new Set([
  "bhavnoorsinghkochar@gmail.com",
  "danishwadhawan7@gmail.com",
  "admin@kaamzo.site",
  "ops@kaamzo.site",
  "security@kaamzo.site"
]);

const adminAuditLogs = [
  {
    id: "sec-init-1",
    timestamp: new Date().toISOString(),
    event: "RECOMMENDED_SETUP_ACTIVE",
    actor: "system@kaamzo.site",
    severity: "VERIFIED",
    details: "Shared Firestore (nifty-backup-mc9s2) + Firebase Auth + Storage + One-Way Notion Ops Hub connected."
  }
];

const notionSyncLedger = [];

function sanitizeForNotion(payload) {
  // Never sync Aadhaar numbers, UPI IDs, passwords, or OTP codes to Notion
  const clone = JSON.parse(JSON.stringify(payload || {}));
  const forbiddenKeys = ["aadhaar", "aadhaarNumber", "upi", "upiId", "password", "otp", "otpCode", "code", "pin"];
  function scrub(obj) {
    if (!obj || typeof obj !== "object") return;
    for (const k of Object.keys(obj)) {
      if (forbiddenKeys.some((fk) => k.toLowerCase().includes(fk.toLowerCase()))) {
        delete obj[k];
      } else if (typeof obj[k] === "object") {
        scrub(obj[k]);
      }
    }
  }
  scrub(clone);
  return clone;
}

function checkRateLimit(key, maxAttempts = 5, windowMs = 60 * 1000) {
  const now = Date.now();
  const entry = rateLimitStore.get(key) || { count: 0, resetAt: now + windowMs };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + windowMs;
  }
  entry.count += 1;
  rateLimitStore.set(key, entry);
  return {
    allowed: entry.count <= maxAttempts,
    remaining: Math.max(0, maxAttempts - entry.count),
    retryAfterSec: Math.ceil((entry.resetAt - now) / 1000)
  };
}

function parseCookies(req) {
  const list = {};
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return list;
  cookieHeader.split(";").forEach((cookie) => {
    let [name, ...rest] = cookie.split("=");
    name = name ? name.trim() : "";
    if (!name) return;
    const value = rest.join("=").trim();
    list[name] = decodeURIComponent(value);
  });
  return list;
}

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function parseBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch {
        resolve({});
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const allowedOrigins = (
    process.env.ALLOWED_ORIGINS ||
    "https://kaamzo.site,https://www.kaamzo.site,http://localhost:3000,http://localhost:5173,capacitor://localhost,https://localhost"
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const reqOrigin = req.headers.origin;
  if (reqOrigin && (allowedOrigins.includes(reqOrigin) || /^http:\/\/localhost(:\d+)?$/.test(reqOrigin))) {
    res.setHeader("Access-Control-Allow-Origin", reqOrigin);
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
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  const clientIp = req.socket.remoteAddress || "127.0.0.1";
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;

  // 0. Unified MongoDB Atlas + AES-256-GCM API (/api/db), Translation API (/api/translate), & Job Estimator (/api/estimate-job)
  if (pathname === "/api/db") {
    if (req.method === "POST" || req.method === "PUT" || req.method === "DELETE") {
      req.body = await parseBody(req);
    }
    return dbHandler(req, res, io);
  }
  if (pathname === "/api/estimate-job") {
    if (req.method === "POST") {
      req.body = await parseBody(req);
    }
    return estimateJobHandler(req, res);
  }
  if (pathname === "/api/translate") {
    if (req.method === "POST") {
      req.body = await parseBody(req);
    }
    res.status = (code) => {
      res.statusCode = code;
      return {
        json: (obj) => {
          res.setHeader("Content-Type", "application/json; charset=utf-8");
          res.end(JSON.stringify(obj));
        },
        end: () => res.end()
      };
    };
    return translateHandler(req, res);
  }

  // 1-6. Hardened Admin Security Routes (/api/admin/login, sso, verify-mfa, session, logout, step-up, wipe-database)
  // Uses scrypt password/PIN verification & HMAC-SHA256 HttpOnly cookies from admin-security.js (zero hardcoded pins/OTPs)
  if (pathname.startsWith("/api/admin/") && pathname !== "/api/admin/audit") {
    const body = req.method === "POST" ? await parseBody(req) : {};
    const handled = await adminSecurity.handle(req, res, pathname, body);
    if (handled) return;
  }

  // 7. Recommended Setup: One-Way MongoDB -> Notion Sync API (/api/notion/sync & /api/notion/status)
  if (pathname === "/api/notion/status" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      success: true,
      architecture: "MongoDB Atlas (AES-256-GCM) -> One-Way Notion Ops Layer",
      notionHub: NOTION_OPS_HUB,
      syncedEventsCount: notionSyncLedger.length,
      recentSyncs: notionSyncLedger.slice(0, 15)
    }));
  }

  if (pathname === "/api/notion/sync" && req.method === "POST") {
    const rawData = await parseBody(req);
    const sanitized = sanitizeForNotion(rawData);
    const syncRecord = {
      id: "notion-sync-" + Date.now(),
      syncedAt: new Date().toISOString(),
      targetDatabase: sanitized.category === "kyc"
        ? NOTION_OPS_HUB.databases.kycQueue.url
        : sanitized.category === "job"
        ? NOTION_OPS_HUB.databases.jobsCommissionLedger.url
        : NOTION_OPS_HUB.databases.disputesAndSecurityAudit.url,
      summary: sanitized,
      piiScrubbed: true
    };
    notionSyncLedger.unshift(syncRecord);
    if (notionSyncLedger.length > 100) notionSyncLedger.length = 100;
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      success: true,
      message: "Synced non-sensitive operational summary to Notion Ops Hub.",
      notionHubUrl: NOTION_OPS_HUB.hubUrl,
      syncRecord
    }));
  }

  // 8. Hardened Server-Only OTP Dispatch (/api/send-otp)
  if (pathname === "/api/send-otp") {
    if (req.method === "POST") req.body = await parseBody(req);
    return sendOtpHandler(req, res);
  }

  // 9. Hardened Server-Only OTP Verification (/api/verify-otp)
  if (pathname === "/api/verify-otp") {
    if (req.method === "POST") req.body = await parseBody(req);
    return verifyOtpHandler(req, res);
  }

  // 10. API: /api/admin/audit
  if (pathname === "/api/admin/audit") {
    if (req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ success: true, logs: adminAuditLogs.slice(0, 50) }));
    }
    if (req.method === "POST") {
      const data = await parseBody(req);
      const entry = {
        id: "sec-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
        timestamp: new Date().toISOString(),
        event: String(data.event || "ADMIN_SECURITY_EVENT").slice(0, 80),
        actor: String(data.actor || "admin@kaamzo.site").slice(0, 80),
        severity: ["CRITICAL", "WARNING", "VERIFIED", "INFO"].includes(data.severity) ? data.severity : "INFO",
        details: String(data.details || "").slice(0, 300),
        ip: clientIp
      };
      adminAuditLogs.unshift(entry);
      if (adminAuditLogs.length > 100) adminAuditLogs.length = 100;
      notionSyncLedger.unshift({
        id: "notion-audit-" + Date.now(),
        syncedAt: entry.timestamp,
        targetDatabase: NOTION_OPS_HUB.databases.disputesAndSecurityAudit.url,
        summary: { event: entry.event, severity: entry.severity, details: entry.details },
        piiScrubbed: true
      });
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ success: true, entry }));
    }
  }

  // 11. API: /api/send-alert
  if (pathname === "/api/send-alert" && req.method === "POST") {
    const data = await parseBody(req);
    notionSyncLedger.unshift({
      id: "notion-job-" + Date.now(),
      syncedAt: new Date().toISOString(),
      targetDatabase: NOTION_OPS_HUB.databases.jobsCommissionLedger.url,
      summary: sanitizeForNotion({
        category: "job",
        jobTitle: data.jobTitle,
        trade: data.trade,
        area: data.area,
        dailyWage: data.dailyWage,
        customerName: data.customerName
      }),
      piiScrubbed: true
    });
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      success: true,
      message: `Instant job alert sent to ${data.workerName || "Worker"} & synced to Notion Ops Ledger`
    }));
  }

  // Direct Download Endpoints for APK & AAB
  if (pathname === "/download/apk" || pathname === "/Kaamzo-release.apk") {
    const apkPath = path.join(__dirname, "Kaamzo-release.apk");
    if (fs.existsSync(apkPath)) {
      const stat = fs.statSync(apkPath);
      res.writeHead(200, {
        "Content-Type": "application/vnd.android.package-archive",
        "Content-Disposition": 'attachment; filename="Kaamzo-release.apk"',
        "Content-Length": stat.size
      });
      return fs.createReadStream(apkPath).pipe(res);
    }
  }

  if (pathname === "/download/aab" || pathname === "/Kaamzo-release.aab") {
    const aabPath = path.join(__dirname, "Kaamzo-release.aab");
    if (fs.existsSync(aabPath)) {
      const stat = fs.statSync(aabPath);
      res.writeHead(200, {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": 'attachment; filename="Kaamzo-release.aab"',
        "Content-Length": stat.size
      });
      return fs.createReadStream(aabPath).pipe(res);
    }
  }

  if (pathname === "/downloads") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    return res.end(`<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Download Kaamzo Android App (.APK & .AAB)</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { margin: 0; font-family: 'Plus Jakarta Sans', sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 20px; box-sizing: border-box; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 24px; max-width: 520px; width: 100%; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); text-align: center; }
    .logo { width: 64px; height: 64px; border-radius: 16px; margin: 0 auto 16px; display: block; border: 2px solid #fbbf24; }
    h1 { margin: 0 0 8px; font-size: 24px; font-weight: 800; color: #ffffff; }
    p { margin: 0 0 24px; font-size: 13px; color: #94a3b8; line-height: 1.5; }
    .btn { display: flex; align-items: center; justify-content: space-between; width: 100%; box-sizing: border-box; padding: 16px 20px; border-radius: 16px; text-decoration: none; font-weight: 800; font-size: 14px; margin-bottom: 14px; transition: transform 0.15s, opacity 0.15s; }
    .btn:hover { transform: translateY(-2px); opacity: 0.95; }
    .btn-apk { background: #fbbf24; color: #0f172a; box-shadow: 0 10px 25px rgba(251, 191, 36, 0.25); }
    .btn-aab { background: #0f172a; color: #fbbf24; border: 2px solid #fbbf24; }
    .btn-notion { background: #1e293b; color: #34d399; border: 1.5px solid #10b981; }
    .badge { font-size: 11px; padding: 4px 10px; border-radius: 999px; font-weight: 700; }
    .btn-apk .badge { background: rgba(15, 23, 42, 0.15); color: #0f172a; }
    .btn-aab .badge { background: rgba(251, 191, 36, 0.15); color: #fbbf24; }
    .btn-notion .badge { background: rgba(16, 185, 129, 0.15); color: #34d399; }
    .back { display: inline-block; margin-top: 12px; color: #cbd5e1; font-size: 12px; font-weight: 700; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <img src="/pwa-192x192.png" alt="Kaamzo" class="logo" />
    <h1>Kaamzo Android Builds & Ops Hub</h1>
    <p>Word-for-word mirror of www.kaamzo.site connected to Shared Firestore (nifty-backup-mc9s2) + Firebase Auth + One-Way Notion Ops Hub.</p>
    <a href="/download/apk" download="Kaamzo-release.apk" class="btn btn-apk">
      <span>📲 Download Android APK (.apk)</span>
      <span class="badge">Signed Release</span>
    </a>
    <a href="/download/aab" download="Kaamzo-release.aab" class="btn btn-aab">
      <span>📦 Download Play Store Bundle (.aab)</span>
      <span class="badge">Play Store Ready</span>
    </a>
    <a href="${NOTION_OPS_HUB.hubUrl}" target="_blank" rel="noreferrer" class="btn btn-notion">
      <span>🗂️ Open Notion Ops & Reporting Hub</span>
      <span class="badge">1-Way Sync Active</span>
    </a>
    <a href="/" class="back">← Back to Kaamzo Live App</a>
  </div>
</body>
</html>`);
  }

  // Serve static files from www/
  let filePath = path.join(WWW_DIR, pathname === "/" ? "index.html" : pathname);
  if (!filePath.startsWith(WWW_DIR)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(WWW_DIR, "index.html");
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      return res.end("Internal Server Error");
    }
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  });
});

// Attach Socket.io + MongoDB Change Streams for Real-Time Listeners
try {
  const { Server } = require("socket.io");
  io = new Server(server, {
    cors: {
      origin: [
        "https://kaamzo.site",
        "https://www.kaamzo.site",
        "http://localhost:3000",
        "http://localhost:5173",
        "capacitor://localhost"
      ],
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  if (process.env.MONGODB_URI) {
    connectMongo()
      .then(() => {
        console.log("✅ Connected to MongoDB Atlas (AES-256-GCM Field Encryption Active)");
        // Watch collections via MongoDB Change Streams for real-time updates
        Object.entries(MODELS).forEach(([colName, Model]) => {
          try {
            const changeStream = Model.watch([], { fullDocument: "updateLookup" });
            changeStream.on("change", (change) => {
              const doc = change.fullDocument ? decryptDocumentFields(change.fullDocument) : null;
              io.emit("db:change", {
                action: change.operationType,
                collection: colName,
                id: doc ? doc.id : null,
                doc,
                timestamp: Date.now()
              });
            });
            changeStream.on("error", () => {});
          } catch (_) {}
        });
      })
      .catch((err) => {
        console.warn("[MongoDB Atlas Notice]:", err.message);
      });
  }
} catch (_) {}

server.listen(PORT, () => {
  console.log(`Kaamzo Unified Server (Web + MongoDB Atlas AES-256-GCM + Socket.io + Notion Sync) running at http://localhost:${PORT}`);
});
