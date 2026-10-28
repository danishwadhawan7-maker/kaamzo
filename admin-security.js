"use strict";
/**
 * Kaamzo admin security module (server-side).
 *
 * All admin secrets (allow-listed emails, password hash, PIN hash, session
 * secret) live ONLY in server environment variables. Nothing here is ever
 * shipped to the browser. If the environment is not configured, the admin
 * portal fails CLOSED (no one can log in).
 *
 * Flow: password (or Google SSO ID token) -> emailed one-time code + PIN ->
 * HttpOnly, SameSite=Strict, HMAC-signed session cookie (15 min sliding idle,
 * 8 h absolute).
 */
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const PROD = process.env.NODE_ENV === "production";
const IDLE_MS = 15 * 60 * 1000;
const ABSOLUTE_MS = 8 * 60 * 60 * 1000;
const STAGE1_MS = 10 * 60 * 1000;
const OTP_MS = 5 * 60 * 1000;
const OTP_RESEND_COOLDOWN_MS = 30 * 1000;
const MAX_FAILS = 5;
const LOCK_MS = 15 * 60 * 1000;

const cfg = () => ({
  emails: (process.env.ADMIN_EMAILS || "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean),
  pwdHash: process.env.ADMIN_PASSWORD_HASH || "",
  pinHash: process.env.ADMIN_PIN_HASH || "",
  secret: process.env.SESSION_SECRET || "",
  firebaseKey: process.env.FIREBASE_WEB_API_KEY || "",
  extraOrigins: (process.env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean),
});

function enabled() {
  const c = cfg();
  return c.emails.length > 0 && c.pwdHash && c.pinHash && c.secret.length >= 32;
}

// ---------- crypto helpers ----------
const b64u = (buf) => Buffer.from(buf).toString("base64url");

function hashSecret(secret) {
  const salt = crypto.randomBytes(16);
  const N = 16384;
  const key = crypto.scryptSync(String(secret), salt, 64, { N });
  return `scrypt$${N}$${b64u(salt)}$${b64u(key)}`;
}
const DUMMY_HASH = hashSecret(crypto.randomBytes(12).toString("hex"));

function verifySecret(input, stored) {
  try {
    const [alg, n, saltB64, hashB64] = String(stored).split("$");
    if (alg !== "scrypt") return false;
    const expected = Buffer.from(hashB64, "base64url");
    const actual = crypto.scryptSync(String(input), Buffer.from(saltB64, "base64url"), expected.length, { N: Number(n) });
    return crypto.timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

function sign(payload) {
  const body = b64u(JSON.stringify(payload));
  const mac = crypto.createHmac("sha256", cfg().secret).update(body).digest("base64url");
  return `${body}.${mac}`;
}
function unsign(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [body, mac] = token.split(".");
  const expected = crypto.createHmac("sha256", cfg().secret).update(body).digest();
  let given;
  try { given = Buffer.from(mac, "base64url"); } catch { return null; }
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return null;
  try { return JSON.parse(Buffer.from(body, "base64url").toString("utf8")); } catch { return null; }
}
const sha = (s) => crypto.createHash("sha256").update(String(s)).digest();

// ---------- state ----------
const stage1 = new Map(); // sid -> { email, otpHash, otpExp, otpSentAt, tries, exp, via }
const sessions = new Map(); // sid -> { email, exp, abs }
const attempts = new Map(); // key -> { count, lockUntil }

setInterval(() => {
  const now = Date.now();
  for (const [k, v] of stage1) if (v.exp < now) stage1.delete(k);
  for (const [k, v] of sessions) if (v.exp < now || v.abs < now) sessions.delete(k);
  for (const [k, v] of attempts) if (v.lockUntil < now && v.count === 0) attempts.delete(k);
}, 60 * 1000).unref();

// ---------- audit ----------
function audit(event, details) {
  const line = JSON.stringify({ t: new Date().toISOString(), event, ...details });
  console.log("[ADMIN-AUDIT] " + line);
  try {
    const dir = path.join(__dirname, "logs");
    fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(path.join(dir, "admin-audit.log"), line + "\n");
  } catch { /* logging must never break auth */ }
}

// ---------- lockout ----------
function lockedFor(key) {
  const a = attempts.get(key);
  return a && a.lockUntil > Date.now() ? a.lockUntil - Date.now() : 0;
}
function fail(key) {
  const a = attempts.get(key) || { count: 0, lockUntil: 0 };
  a.count += 1;
  if (a.count >= MAX_FAILS) { a.lockUntil = Date.now() + LOCK_MS; a.count = 0; }
  attempts.set(key, a);
}
const clearFails = (key) => attempts.delete(key);

// ---------- http helpers ----------
function parseCookies(req) {
  const out = {};
  for (const part of String(req.headers.cookie || "").split(";")) {
    const i = part.indexOf("=");
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}
function isSecure(req) {
  return PROD || req.headers["x-forwarded-proto"] === "https" || !!req.socket.encrypted;
}
function cookie(req, name, value, maxAgeSec) {
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAgeSec}${isSecure(req) ? "; Secure" : ""}`;
}
function send(res, status, obj, extraHeaders = {}) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...extraHeaders });
  res.end(JSON.stringify(obj));
}
function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true; // non-browser client; SameSite=Strict cookies still protect browsers
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const proto = isSecure(req) ? "https" : "http";
  return origin === `${proto}://${host}` || cfg().extraOrigins.includes(origin);
}

function currentSession(req) {
  const tok = parseCookies(req).kz_admin;
  const p = unsign(tok);
  if (!p || !p.sid) return null;
  const s = sessions.get(p.sid);
  if (!s) return null;
  const now = Date.now();
  if (s.exp < now || s.abs < now) { sessions.delete(p.sid); return null; }
  return { sid: p.sid, ...s };
}
function touch(req, res, sess) {
  const exp = Math.min(Date.now() + IDLE_MS, sess.abs);
  sessions.get(sess.sid).exp = exp;
  res.setHeader("Set-Cookie", cookie(req, "kz_admin", sign({ sid: sess.sid }), Math.floor((exp - Date.now()) / 1000)));
}
function currentStage1(req) {
  const p = unsign(parseCookies(req).kz_admin_s1);
  if (!p || !p.sid) return null;
  const s = stage1.get(p.sid);
  if (!s || s.exp < Date.now()) { if (s) stage1.delete(p.sid); return null; }
  return { sid: p.sid, ...s };
}

// ---------- OTP delivery ----------
async function deliverOtp(email, code) {
  const host = process.env.SMTP_HOST;
  if (host) {
    let nodemailer;
    try { nodemailer = require("nodemailer"); } catch { throw new Error("nodemailer not installed"); }
    const t = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || "false") === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
    await t.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: "Kaamzo Admin verification code",
      text: `Your Kaamzo admin verification code is ${code}. It expires in 5 minutes. If this wasn't you, rotate your admin credentials immediately.`,
    });
    return;
  }
  if (!PROD) {
    console.log(`[ADMIN-OTP:DEV-ONLY] ${email} -> ${code}`);
    return;
  }
  throw new Error("OTP delivery is not configured");
}

async function issueOtp(s1, sid) {
  const code = String(crypto.randomInt(100000, 1000000));
  await deliverOtp(s1.email, code);
  s1.otpHash = sha(code);
  s1.otpExp = Date.now() + OTP_MS;
  s1.otpSentAt = Date.now();
  stage1.set(sid, s1);
}

async function beginStage1(req, res, email, via) {
  const sid = crypto.randomBytes(24).toString("hex");
  const s1 = { email, otpHash: null, otpExp: 0, otpSentAt: 0, tries: 0, exp: Date.now() + STAGE1_MS, via };
  try {
    await issueOtp(s1, sid);
  } catch (e) {
    audit("OTP_DELIVERY_FAILED", { email, ip: ip(req), error: String(e.message) });
    return send(res, 503, { success: false, error: "Could not deliver the verification code. Contact the platform owner." });
  }
  audit("ADMIN_STEP1_PASSED", { email, via, ip: ip(req) });
  send(res, 200, { success: true, mfaRequired: true }, { "Set-Cookie": cookie(req, "kz_admin_s1", sign({ sid }), Math.floor(STAGE1_MS / 1000)) });
}

function ip(req) {
  if (process.env.TRUST_PROXY === "1") {
    const xf = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
    if (xf) return xf;
  }
  return req.socket.remoteAddress || "unknown";
}

// ---------- route handler ----------
async function handle(req, res, pathname, body) {
  if (!pathname.startsWith("/api/admin/")) return false;
  const route = pathname.slice("/api/admin/".length);

  // public, non-secret
  if (route === "db-state" && req.method === "GET") {
    send(res, 200, { lastWipedAt: global.__kaamzoLastWiped || 0 });
    return true;
  }

  if (req.method !== "POST" && !(route === "session" && req.method === "GET")) {
    send(res, 405, { success: false, error: "Method not allowed." });
    return true;
  }
  if (req.method === "POST" && !sameOrigin(req)) {
    audit("CSRF_BLOCKED", { route, ip: ip(req), origin: req.headers.origin });
    send(res, 403, { success: false, error: "Forbidden." });
    return true;
  }
  if (!enabled()) {
    send(res, 503, { success: false, error: "Admin portal is not configured on this server." });
    return true;
  }

  const GENERIC = "Invalid credentials.";

  if (route === "login") {
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const kIp = "ip:" + ip(req);
    const kEm = "em:" + email;
    const wait = Math.max(lockedFor(kIp), lockedFor(kEm));
    if (wait) {
      audit("LOGIN_LOCKED", { email, ip: ip(req) });
      send(res, 429, { success: false, error: `Too many attempts. Try again in ${Math.ceil(wait / 60000)} min.` }, { "Retry-After": String(Math.ceil(wait / 1000)) });
      return true;
    }
    const c = cfg();
    const emailOk = c.emails.includes(email);
    const pwdOk = verifySecret(password, emailOk ? c.pwdHash : DUMMY_HASH); // constant-ish time either way
    if (!(emailOk && pwdOk)) {
      fail(kIp); fail(kEm);
      audit("LOGIN_FAILED", { email, ip: ip(req), emailAllowed: emailOk });
      send(res, 401, { success: false, error: GENERIC });
      return true;
    }
    clearFails(kIp); clearFails(kEm);
    await beginStage1(req, res, email, "password");
    return true;
  }

  if (route === "sso") {
    const kIp = "ip:" + ip(req);
    if (lockedFor(kIp)) { send(res, 429, { success: false, error: "Too many attempts. Try again later." }); return true; }
    const c = cfg();
    let email = "", verified = false;
    try {
      if (!c.firebaseKey) throw new Error("FIREBASE_WEB_API_KEY missing");
      const r = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(c.firebaseKey)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: String(body.idToken || "") }),
      });
      const d = await r.json();
      const u = r.ok && d.users && d.users[0];
      if (u) { email = String(u.email || "").toLowerCase(); verified = !!u.emailVerified; }
    } catch (e) {
      audit("SSO_VERIFY_ERROR", { ip: ip(req), error: String(e.message) });
    }
    if (!email || !verified || !c.emails.includes(email)) {
      fail(kIp);
      audit("SSO_DENIED", { email, ip: ip(req) });
      send(res, 401, { success: false, error: "This Google account is not authorized for admin access." });
      return true;
    }
    clearFails(kIp);
    await beginStage1(req, res, email, "google_sso");
    return true;
  }

  if (route === "resend-otp") {
    const s1 = currentStage1(req);
    if (currentSession(req)) { send(res, 200, { success: true }); return true; }
    if (!s1) { send(res, 401, { success: false, error: "Session expired. Sign in again." }); return true; }
    if (Date.now() - s1.otpSentAt < OTP_RESEND_COOLDOWN_MS) { send(res, 200, { success: true, cooldown: true }); return true; }
    try { await issueOtp(stage1.get(s1.sid), s1.sid); } catch {
      send(res, 503, { success: false, error: "Could not deliver the verification code." });
      return true;
    }
    send(res, 200, { success: true });
    return true;
  }

  if (route === "verify-mfa") {
    const s1 = currentStage1(req);
    if (!s1) { send(res, 401, { success: false, error: "Session expired. Sign in again." }); return true; }
    const rec = stage1.get(s1.sid);
    rec.tries += 1;
    if (rec.tries > MAX_FAILS) {
      stage1.delete(s1.sid);
      fail("ip:" + ip(req));
      audit("MFA_TOO_MANY_TRIES", { email: rec.email, ip: ip(req) });
      send(res, 429, { success: false, error: "Too many attempts. Sign in again." }, { "Set-Cookie": cookie(req, "kz_admin_s1", "", 0) });
      return true;
    }
    const otpOk = rec.otpHash && rec.otpExp > Date.now() && crypto.timingSafeEqual(sha(String(body.otp || "")), rec.otpHash);
    const pinOk = verifySecret(String(body.pin || ""), cfg().pinHash);
    if (!(otpOk && pinOk)) {
      audit("MFA_FAILED", { email: rec.email, ip: ip(req) });
      send(res, 401, { success: false, error: "Invalid verification code or PIN." });
      return true;
    }
    stage1.delete(s1.sid);
    const sid = crypto.randomBytes(32).toString("hex");
    const now = Date.now();
    sessions.set(sid, { email: rec.email, exp: now + IDLE_MS, abs: now + ABSOLUTE_MS });
    audit("ADMIN_LOGIN_OK", { email: rec.email, ip: ip(req) });
    res.setHeader("Set-Cookie", [
      cookie(req, "kz_admin", sign({ sid }), Math.floor(IDLE_MS / 1000)),
      cookie(req, "kz_admin_s1", "", 0),
    ]);
    send(res, 200, { success: true });
    return true;
  }

  if (route === "session") {
    const s = currentSession(req);
    if (!s) { send(res, 200, { authenticated: false }); return true; }
    touch(req, res, s);
    send(res, 200, { authenticated: true, email: s.email });
    return true;
  }

  if (route === "logout") {
    const s = currentSession(req);
    if (s) { sessions.delete(s.sid); audit("ADMIN_LOGOUT", { email: s.email, ip: ip(req) }); }
    const s1 = currentStage1(req);
    if (s1) stage1.delete(s1.sid);
    res.setHeader("Set-Cookie", [cookie(req, "kz_admin", "", 0), cookie(req, "kz_admin_s1", "", 0)]);
    send(res, 200, { success: true });
    return true;
  }

  // ---- everything below requires a fully authenticated session ----
  const s = currentSession(req);
  if (!s) { send(res, 401, { success: false, error: "Not authenticated." }); return true; }
  touch(req, res, s);

  if (route === "step-up") {
    const k = "su:" + s.sid;
    if (lockedFor(k)) { send(res, 429, { success: false, error: "Too many attempts." }); return true; }
    if (!verifySecret(String(body.pin || ""), cfg().pinHash)) {
      fail(k);
      audit("STEP_UP_FAILED", { email: s.email, ip: ip(req) });
      send(res, 401, { success: false, error: "Invalid PIN." });
      return true;
    }
    clearFails(k);
    send(res, 200, { success: true });
    return true;
  }

  if (route === "wipe-database") {
    global.__kaamzoLastWiped = Date.now();
    audit("DATABASE_WIPE", { email: s.email, ip: ip(req) });
    send(res, 200, { success: true, lastWipedAt: global.__kaamzoLastWiped });
    return true;
  }

  send(res, 404, { success: false, error: "Not found." });
  return true;
}

module.exports = { handle, hashSecret, verifySecret, enabled };
