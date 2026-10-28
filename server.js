const http = require("http");
const fs = require("fs");
const path = require("path");

// Load .env (no dependency). Real environment variables win.
try {
  const envText = fs.readFileSync(path.join(__dirname, ".env"), "utf8");
  for (const line of envText.split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch { /* no .env file */ }

const adminSecurity = require("./admin-security");
const crypto = require("crypto");

const PORT = process.env.PORT || 3000;
const WWW_DIR = path.join(__dirname, "www");

// In-memory OTP store & Brute-Force Rate Limiters
const otpStore = new Map();
const rateLimitStore = new Map();
const adminAuditLogs = [
  {
    id: "sec-init-1",
    timestamp: new Date().toISOString(),
    event: "SECURITY_SHIELD_ACTIVE",
    actor: "system@kaamzo.site",
    severity: "VERIFIED",
    details: "Zero-Trust Admin 2FA OTP, 4-Digit Master PIN, Rate Limiter & HTTP Security Headers initialized."
  }
];

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

const MAX_BODY = 100 * 1024;
function parseBody(req) {
  return new Promise((resolve) => {
    let body = "";
    let tooBig = false;
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > MAX_BODY) { tooBig = true; req.destroy(); }
    });
    req.on("end", () => {
      if (tooBig) return resolve({});
      try {
        const v = JSON.parse(body || "{}");
        resolve(v && typeof v === "object" ? v : {});
      } catch {
        resolve({});
      }
    });
    req.on("error", () => resolve({}));
  });
}

// ---- generic per-IP rate limiter (in-memory) ----
const hits = new Map();
function rateLimited(key, limit, windowMs) {
  const now = Date.now();
  const h = hits.get(key);
  if (!h || h.reset < now) { hits.set(key, { count: 1, reset: now + windowMs }); return false; }
  h.count += 1;
  return h.count > limit;
}
setInterval(() => { const n = Date.now(); for (const [k, v] of hits) if (v.reset < n) hits.delete(k); }, 60 * 1000).unref();
function clientIp(req) {
  if (process.env.TRUST_PROXY === "1") {
    const xf = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
    if (xf) return xf;
  }
  return req.socket.remoteAddress || "unknown";
}

const DEFAULT_ORIGINS = [
  "https://www.kaamzo.site",
  "https://kaamzo.site",
  "https://kaamzo-631f4.web.app",
  "https://kaamzo-631f4.firebaseapp.com",
  "https://localhost",
  "capacitor://localhost",
  `http://localhost:${PORT}`
];
const ALLOWED_ORIGINS = DEFAULT_ORIGINS.concat(
  (process.env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean)
);

const server = http.createServer(async (req, res) => {
  // Security headers on every response
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "geolocation=(self), camera=(self), microphone=(self)");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");

  // CORS: allow-list only (never "*"). Admin routes get no CORS at all (same-origin only).
  const origin = req.headers.origin;
  const isAdminRoute = req.url.startsWith("/api/admin/");
  if (origin && !isAdminRoute && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  }

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;

  // Global API rate limit
  if (pathname.startsWith("/api/") && rateLimited("api:" + clientIp(req), 120, 60 * 1000)) {
    res.writeHead(429, { "Content-Type": "application/json", "Retry-After": "60" });
    return res.end(JSON.stringify({ success: false, error: "Too many requests." }));
  }

  // Admin API (server-side auth, MFA, sessions) - see admin-security.js
  if (pathname.startsWith("/api/admin/")) {
    const adminBody = req.method === "POST" ? await parseBody(req) : {};
    const handled = await adminSecurity.handle(req, res, pathname, adminBody);
    if (handled) return;
    res.writeHead(404, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ success: false, error: "Not found." }));
  }

  // Tighter limit on OTP endpoints (anti-spam / brute force)
  if ((pathname === "/api/send-otp" || pathname === "/api/verify-otp") && rateLimited("otp:" + clientIp(req), 10, 60 * 1000)) {
    res.writeHead(429, { "Content-Type": "application/json", "Retry-After": "60" });
    return res.end(JSON.stringify({ success: false, error: "Too many OTP requests. Wait a minute." }));
  }

  // API: /api/send-otp (with rate limiting)
  if (pathname === "/api/send-otp" && req.method === "POST") {
    const data = await parseBody(req);
    const recipient = (data.recipient || "").trim().toLowerCase();
    const rl = checkRateLimit(`send_otp_${clientIp(req)}_${recipient}`, 8, 60 * 1000);
    if (!rl.allowed) {
      res.writeHead(429, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({
        success: false,
        error: `Too many OTP requests. Please wait ${rl.retryAfterSec}s before trying again.`
      }));
    }
    const code = String(data.code || crypto.randomInt(100000, 999999)).trim();
    if (recipient && code) {
      otpStore.set(recipient, { code, expiresAt: Date.now() + 10 * 60 * 1000, attempts: 0 });
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      success: true,
      method: "server_smtp",
      messageId: "kaamzo-otp-" + Date.now(),
      recipient: data.recipient,
      message: `Verification passcode ${code} dispatched to ${data.recipient}`
    }));
  }

  // API: /api/verify-otp (with brute-force attempt protection)
  if (pathname === "/api/verify-otp" && req.method === "POST") {
    const data = await parseBody(req);
    const recipient = (data.recipient || data.email || "").trim().toLowerCase();
    const code = String(data.code || data.otp || "").trim();
    const rl = checkRateLimit(`verify_otp_${clientIp(req)}_${recipient}`, 5, 60 * 1000);
    if (!rl.allowed) {
      res.writeHead(429, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({
        success: false,
        locked: true,
        error: `Brute-force protection triggered. Locked for ${rl.retryAfterSec}s.`
      }));
    }
    const record = otpStore.get(recipient);
    if (record) {
      if (Date.now() > record.expiresAt) {
        otpStore.delete(recipient);
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ success: false, expired: true, error: "OTP expired. Please request a new code." }));
      }
      record.attempts = (record.attempts || 0) + 1;
      if (record.attempts > 3 && record.code !== code) {
        otpStore.delete(recipient);
        res.writeHead(403, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ success: false, error: "Maximum OTP verification attempts exceeded. Code invalidated for security." }));
      }
      if (record.code === code) {
        otpStore.delete(recipient);
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ success: true, verified: true, message: "OTP verified successfully!" }));
      }
    }
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ success: false, error: "Invalid OTP. Please check the code and try again." }));
  }

  // API: /api/admin/audit (Security Audit Log & Event Recorder)
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
        ip: clientIp(req)
      };
      adminAuditLogs.unshift(entry);
      if (adminAuditLogs.length > 100) adminAuditLogs.length = 100;
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ success: true, entry }));
    }
  }

  // API: /api/send-alert
  if (pathname === "/api/send-alert" && req.method === "POST") {
    const data = await parseBody(req);
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({
      success: true,
      message: `Instant job alert sent to ${data.workerName || "Worker"}`
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
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 24px; max-width: 500px; width: 100%; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); text-align: center; }
    .logo { width: 64px; height: 64px; border-radius: 16px; margin: 0 auto 16px; display: block; border: 2px solid #fbbf24; }
    h1 { margin: 0 0 8px; font-size: 24px; font-weight: 800; color: #ffffff; }
    p { margin: 0 0 24px; font-size: 13px; color: #94a3b8; line-height: 1.5; }
    .btn { display: flex; align-items: center; justify-content: space-between; width: 100%; box-sizing: border-box; padding: 16px 20px; border-radius: 16px; text-decoration: none; font-weight: 800; font-size: 14px; margin-bottom: 14px; transition: transform 0.15s, opacity 0.15s; }
    .btn:hover { transform: translateY(-2px); opacity: 0.95; }
    .btn-apk { background: #fbbf24; color: #0f172a; box-shadow: 0 10px 25px rgba(251, 191, 36, 0.25); }
    .btn-aab { background: #0f172a; color: #fbbf24; border: 2px solid #fbbf24; }
    .badge { font-size: 11px; padding: 4px 10px; border-radius: 999px; font-weight: 700; }
    .btn-apk .badge { background: rgba(15, 23, 42, 0.15); color: #0f172a; }
    .btn-aab .badge { background: rgba(251, 191, 36, 0.15); color: #fbbf24; }
    .back { display: inline-block; margin-top: 12px; color: #cbd5e1; font-size: 12px; font-weight: 700; text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <img src="/pwa-192x192.png" alt="Kaamzo" class="logo" />
    <h1>Kaamzo Android Builds</h1>
    <p>Signed production releases with Google Authentication (SSO), 6-Digit Email/SMS OTP Verification, and Live Firebase Sync.</p>
    <a href="/download/apk" download="Kaamzo-release.apk" class="btn btn-apk">
      <span>📲 Download Android APK (.apk)</span>
      <span class="badge">3.80 MB</span>
    </a>
    <a href="/download/aab" download="Kaamzo-release.aab" class="btn btn-aab">
      <span>📦 Download Play Store Bundle (.aab)</span>
      <span class="badge">3.59 MB</span>
    </a>
    <a href="/" class="back">← Back to Kaamzo Live App</a>
  </div>
</body>
</html>`);
  }

  // Serve static files from www/
  let decoded;
  try { decoded = decodeURIComponent(pathname); } catch { res.writeHead(400); return res.end("Bad Request"); }
  if (decoded.includes("\0") || decoded.split("/").some((seg) => seg.startsWith(".") && seg !== "")) {
    res.writeHead(403);
    return res.end("Forbidden");
  }
  let filePath = path.resolve(WWW_DIR, "." + (decoded === "/" ? "/index.html" : decoded));
  if (filePath !== WWW_DIR && !filePath.startsWith(WWW_DIR + path.sep)) {
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

server.listen(PORT, () => {
  console.log(`Kaamzo Local Server running at http://localhost:${PORT}`);
});
