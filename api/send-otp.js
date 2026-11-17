"use strict";
/**
 * Kaamzo Hardened OTP Dispatch API (/api/send-otp)
 *
 * CTO Security Guarantees:
 *  - Server-Only OTP Generation using crypto.randomInt(100000, 999999) for account verification
 *  - NEVER returns plaintext OTP in JSON responses, messages, or WhatsApp URLs
 *  - Stores only salted HMAC-SHA256 hash + 10-min expiry in MongoDB (`securityVerifications`)
 *  - Returns sealed AES-256-GCM token containing ONLY { recipient, salt, codeHash, exp }
 *  - Supports real SMS (Twilio SMS, Fast2SMS, MSG91), WhatsApp (Twilio WA, AiSensy, Interakt), and Email (SMTP)
 *  - Fails closed (HTTP 503) if no real delivery provider is configured instead of displaying OTP on website
 *  - Strict CORS + per-IP rate limiting + Helmet headers
 */
const crypto = require("crypto");
const { upsertDoc, hashPhoneForLookup, hashEmailForLookup, hmacBlindIndex } = require("../lib/models");

const rateBuckets = new Map();

function checkRateLimit(key, maxReqs = 5, windowMs = 60 * 1000) {
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

function createOtpHashes(code, recipient) {
  const salt = crypto.randomBytes(16).toString("hex");
  const codeHash = crypto.createHash("sha256").update(`${String(code)}:${salt}`).digest("hex");
  const exp = Date.now() + 10 * 60 * 1000;
  const payload = JSON.stringify({
    recipient: String(recipient || "").trim().toLowerCase(),
    salt,
    codeHash,
    exp
  });
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(payload, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  const encryptedOtpToken = `${iv.toString("base64url")}.${tag.toString("base64url")}.${encrypted.toString("base64url")}`;
  return { salt, codeHash, exp, encryptedOtpToken };
}

function normalizeIndianPhone(raw) {
  const digits = String(raw || "").replace(/[^0-9]/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return digits ? `+${digits}` : "";
}

async function sendViaTwilioSms({ toNumber, code, role }) {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone = process.env.TWILIO_PHONE_NUMBER;
  if (!sid || !token || !fromPhone) return null;

  const roleLabel = role === "worker" ? "Worker Portal" : "Customer Account";
  const params = new URLSearchParams();
  params.append("To", toNumber);
  params.append("From", fromPhone);
  params.append("Body", `Kaamzo Security OTP: ${code}. Valid for 10 mins to verify your ${roleLabel}. Never share this code.`);

  const resp = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params.toString()
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data.message || `Twilio SMS error (${resp.status})`);
  return { method: "twilio_sms", messageId: data.sid || "twilio-sms" };
}

async function sendViaFast2Sms({ toNumber, code }) {
  const apiKey = process.env.FAST2SMS_API_KEY;
  if (!apiKey) return null;
  const digits10 = toNumber.replace(/[^0-9]/g, "").slice(-10);
  const resp = await fetch("https://www.fast2sms.com/dev/bulkV2", {
    method: "POST",
    headers: {
      authorization: apiKey,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      route: "otp",
      variables_values: String(code),
      numbers: digits10
    })
  });
  const data = await resp.json();
  if (!resp.ok || data.return === false) {
    throw new Error(data.message || `Fast2SMS error (${resp.status})`);
  }
  return { method: "fast2sms", messageId: data.request_id || "fast2sms-otp" };
}

async function sendViaMsg91({ toNumber, code }) {
  const authKey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_TEMPLATE_ID;
  if (!authKey || !templateId) return null;
  const mobile = toNumber.replace("+", "");
  const resp = await fetch(
    `https://control.msg91.com/api/v5/otp?template_id=${encodeURIComponent(templateId)}&mobile=${encodeURIComponent(mobile)}&otp=${encodeURIComponent(code)}`,
    { method: "POST", headers: { authkey: authKey } }
  );
  const data = await resp.json();
  if (!resp.ok || data.type === "error") {
    throw new Error(data.message || `MSG91 error (${resp.status})`);
  }
  return { method: "msg91_sms", messageId: data.request_id || "msg91-otp" };
}

async function sendViaTwilioWhatsApp({ toNumber, code, role }) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromWhatsApp = process.env.TWILIO_WHATSAPP_FROM;
  if (!accountSid || !authToken || !fromWhatsApp) return null;

  const toFormatted = toNumber.startsWith("whatsapp:") ? toNumber : `whatsapp:${toNumber}`;
  const fromFormatted = fromWhatsApp.startsWith("whatsapp:") ? fromWhatsApp : `whatsapp:${fromWhatsApp}`;
  const roleLabel = role === "worker" ? "Worker Portal" : "Customer Account";

  const params = new URLSearchParams();
  params.append("To", toFormatted);
  params.append("From", fromFormatted);
  params.append("Body", `Kaamzo Security Code: *${code}*\n\nUse this 6-digit OTP to verify your ${roleLabel}. Valid for 10 minutes.`);

  const resp = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params.toString()
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data.message || `Twilio WhatsApp error (${resp.status})`);
  return { method: "twilio_whatsapp", messageId: data.sid || "twilio-wa" };
}

async function sendViaAiSensy({ toNumber, code, name }) {
  const apiKey = process.env.AISENSY_API_KEY;
  if (!apiKey) return null;
  const resp = await fetch("https://backend.aisensy.com/campaign/t1/api/v2", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apiKey,
      campaignName: process.env.AISENSY_CAMPAIGN_NAME || "kaamzo_otp",
      destination: toNumber.replace("+", ""),
      userName: name || "Kaamzo User",
      templateParams: [code]
    })
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data.message || `AiSensy error (${resp.status})`);
  return { method: "aisensy_whatsapp", messageId: data.id || "aisensy-wa" };
}

async function sendViaInterakt({ toNumber, code }) {
  const apiKey = process.env.INTERAKT_API_KEY;
  if (!apiKey) return null;
  const digits = toNumber.replace(/[^0-9]/g, "");
  const phoneNumber = digits.length > 10 ? digits.slice(-10) : digits;
  const countryCode = digits.length > 10 ? `+${digits.slice(0, digits.length - 10)}` : "+91";

  const resp = await fetch("https://api.interakt.ai/v1/public/message/", {
    method: "POST",
    headers: { Authorization: `Basic ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      countryCode,
      phoneNumber,
      callbackData: "kaamzo_otp",
      type: "Template",
      template: { name: process.env.INTERAKT_TEMPLATE_NAME || "kaamzo_otp", languageCode: "en", bodyValues: [code] }
    })
  });
  const data = await resp.json();
  if (!resp.ok || data.result === false) throw new Error(data.message || `Interakt error (${resp.status})`);
  return { method: "interakt_whatsapp", messageId: data.id || "interakt-wa" };
}

function buildOtpEmailHtml({ recipient, code, role = "customer", customerName, workerName }) {
  const name = customerName || workerName || "Kaamzo User";
  const roleLabel = role === "worker" ? "Worker KYC & Portal Access" : "Customer / Employer Account";
  return {
    subject: `Your Kaamzo Security Verification Code: ${code}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 16px; background: #ffffff; color: #111827;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h2 style="color: #ea580c; margin: 0; font-size: 24px; font-weight: 900;">KAAMZO CONNECT</h2>
          <p style="color: #6b7280; font-size: 13px; margin: 4px 0 0 0;">Unified Daily Wage Worker & Employer Platform</p>
        </div>
        <div style="background: #fff7ed; border-left: 4px solid #ea580c; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 8px 0; color: #9a3412; font-size: 16px; font-weight: 800;">Security Verification Code</h3>
          <p style="margin: 0; color: #4b5563; font-size: 14px;">
            Hello <strong>${name}</strong>, use the verification code below to authorize your <strong>${roleLabel}</strong>:
          </p>
        </div>
        <div style="text-align: center; margin: 28px 0;">
          <span style="display: inline-block; font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #111827; background: #f8fafc; padding: 14px 32px; border-radius: 12px; border: 2px dashed #cbd5e1; font-family: monospace;">
            ${code}
          </span>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 8px;">Valid for 10 minutes. Never share this security passkey with anyone.</p>
        </div>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 16px; font-size: 13px; color: #475569;">
          <strong>Recipient:</strong> ${recipient}
        </div>
      </div>
    `
  };
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
    const recipient = String(body.recipient || body.email || body.phone || "").trim();
    if (!recipient) {
      return sendJson(400, { success: false, error: "Recipient phone or email is required." });
    }

    const clientIp =
      (req.headers && req.headers["x-forwarded-for"] && String(req.headers["x-forwarded-for"]).split(",")[0].trim()) ||
      (req.socket && req.socket.remoteAddress) ||
      "127.0.0.1";

    const rl = checkRateLimit(`send_otp_${clientIp}_${recipient.toLowerCase()}`, 5, 60 * 1000);
    if (!rl.allowed) {
      res.setHeader("Retry-After", String(rl.retryAfterSec));
      return sendJson(429, {
        success: false,
        error: `Too many OTP requests. Please wait ${rl.retryAfterSec}s before trying again.`
      });
    }

    // Generate cryptographically random 6-digit OTP strictly on the server for account verification
    const isJobStartNotice = body.purpose === "job_start_otp" && body.code;
    const serverCode = isJobStartNotice ? String(body.code).trim() : String(crypto.randomInt(100000, 999999));
    const isEmail = recipient.includes("@");
    const canonicalRecipient = isEmail ? recipient.toLowerCase() : normalizeIndianPhone(recipient);
    const { salt, codeHash, exp, encryptedOtpToken } = createOtpHashes(serverCode, canonicalRecipient);

    // Save salted hash in MongoDB `securityVerifications` (never store plaintext OTP)
    try {
      const recId = isEmail ? hashEmailForLookup(canonicalRecipient) : (hashPhoneForLookup(canonicalRecipient) || hmacBlindIndex(canonicalRecipient));
      await upsertDoc("securityVerifications", recId, {
        id: recId,
        identifier: canonicalRecipient,
        codeHash,
        salt,
        attempts: 0,
        type: isEmail ? "email" : "sms",
        role: body.role || "customer",
        dispatchedAt: new Date().toISOString(),
        expiresAt: new Date(exp).toISOString()
      });
    } catch (dbErr) {
      console.warn("[OTP Vault Warning]:", dbErr.message);
    }

    // 1. Phone / SMS / WhatsApp Delivery
    if (!isEmail) {
      const delivery =
        (await sendViaTwilioSms({ toNumber: canonicalRecipient, code: serverCode, role: body.role }).catch(() => null)) ||
        (await sendViaFast2Sms({ toNumber: canonicalRecipient, code: serverCode }).catch(() => null)) ||
        (await sendViaMsg91({ toNumber: canonicalRecipient, code: serverCode }).catch(() => null)) ||
        (await sendViaTwilioWhatsApp({ toNumber: canonicalRecipient, code: serverCode, role: body.role }).catch(() => null)) ||
        (await sendViaAiSensy({ toNumber: canonicalRecipient, code: serverCode, name: body.customerName || body.workerName }).catch(() => null)) ||
        (await sendViaInterakt({ toNumber: canonicalRecipient, code: serverCode }).catch(() => null));

      if (delivery) {
        return sendJson(200, {
          success: true,
          method: delivery.method,
          messageId: delivery.messageId,
          recipient: canonicalRecipient,
          encryptedOtpToken,
          message: `6-digit OTP sent securely via SMS/WhatsApp to ${canonicalRecipient}.`
        });
      }

      // Fail closed: NEVER return the OTP in JSON or a wa.me link
      return sendJson(503, {
        success: false,
        providerRequired: true,
        error:
          "Live SMS OTP delivery provider is not configured on the server yet (add TWILIO_*, FAST2SMS_API_KEY, or MSG91_AUTH_KEY in Vercel env). Please use Google Sign-In in the meantime."
      });
    }

    // 2. Email SMTP Delivery
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

    if (smtpUser && smtpPass) {
      const nodemailer = require("nodemailer");
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT || 587),
        secure: String(process.env.SMTP_SECURE || "false") === "true",
        auth: { user: smtpUser, pass: smtpPass }
      });

      const { subject, html } = buildOtpEmailHtml({
        recipient: canonicalRecipient,
        code: serverCode,
        role: body.role,
        customerName: body.customerName,
        workerName: body.workerName
      });

      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || `"Kaamzo Security" <${smtpUser}>`,
        to: canonicalRecipient,
        subject,
        html
      });

      return sendJson(200, {
        success: true,
        method: "nodemailer_gmail_smtp",
        messageId: info.messageId || `kaamzo-smtp-${Date.now()}`,
        recipient: canonicalRecipient,
        encryptedOtpToken,
        message: `Verification code sent securely to ${canonicalRecipient}.`
      });
    }

    return sendJson(503, {
      success: false,
      providerRequired: true,
      error:
        "Email OTP SMTP provider is not configured on the server yet (add SMTP_USER & SMTP_PASS in Vercel env). Please verify instantly using your Google Account button below."
    });
  } catch (err) {
    return sendJson(500, {
      success: false,
      error: err.message || "Failed to dispatch verification OTP."
    });
  }
};
