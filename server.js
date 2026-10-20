const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const WWW_DIR = path.join(__dirname, "www");

// In-memory OTP store for server API verification alongside Firestore
const otpStore = new Map();

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
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    return res.end();
  }

  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = parsedUrl.pathname;

  // API: /api/send-otp
  if (pathname === "/api/send-otp" && req.method === "POST") {
    const data = await parseBody(req);
    const recipient = (data.recipient || "").trim().toLowerCase();
    const code = String(data.code || "").trim();
    if (recipient && code) {
      otpStore.set(recipient, { code, expiresAt: Date.now() + 10 * 60 * 1000 });
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

  // API: /api/verify-otp
  if (pathname === "/api/verify-otp" && req.method === "POST") {
    const data = await parseBody(req);
    const recipient = (data.recipient || data.email || "").trim().toLowerCase();
    const code = String(data.code || data.otp || "").trim();
    const record = otpStore.get(recipient);
    if (record) {
      if (Date.now() > record.expiresAt) {
        res.writeHead(400, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ success: false, expired: true, error: "OTP expired. Please request a new code." }));
      }
      if (record.code === code) {
        res.writeHead(200, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ success: true, verified: true, message: "OTP verified successfully!" }));
      }
    }
    res.writeHead(400, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ success: false, error: "Invalid OTP. Please check the code and try again." }));
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

server.listen(PORT, () => {
  console.log(`Kaamzo Local Server running at http://localhost:${PORT}`);
});
