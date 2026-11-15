const crypto = require("crypto");

function normalizeIndianWhatsAppNumber(raw) {
  const digits = String(raw || "").replace(/[^0-9]/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  if (String(raw || "").trim().startsWith("+")) return `+${digits}`;
  return digits ? `+${digits}` : "";
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
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 16px; font-size: 13px; color: #475569; margin-bottom: 20px;">
          <strong>Recipient:</strong> ${recipient}
        </div>
      </div>
    `
  };
}

async function sendViaTwilioWhatsApp({ toNumber, code, role }) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromWhatsApp = process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886";
  if (!accountSid || !authToken) return null;

  const toFormatted = toNumber.startsWith("whatsapp:") ? toNumber : `whatsapp:${toNumber}`;
  const fromFormatted = fromWhatsApp.startsWith("whatsapp:") ? fromWhatsApp : `whatsapp:${fromWhatsApp}`;
  const roleLabel = role === "worker" ? "Worker Portal" : "Customer Account";
  const bodyText = `Kaamzo Security Code: *${code}*\n\nUse this 6-digit OTP to verify your ${roleLabel}. Valid for 10 minutes. Never share this code with anyone.`;

  const params = new URLSearchParams();
  params.append("To", toFormatted);
  params.append("From", fromFormatted);
  params.append("Body", bodyText);

  const authHeader = "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64");
  const resp = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params.toString()
  });

  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(data.message || `Twilio WhatsApp error (${resp.status})`);
  }
  return {
    success: true,
    method: "twilio_whatsapp",
    messageId: data.sid || ("kaamzo-wa-" + Date.now()),
    recipient: toNumber,
    message: `WhatsApp OTP sent to ${toNumber}`
  };
}

async function sendViaAiSensy({ toNumber, code, name }) {
  const apiKey = process.env.AISENSY_API_KEY;
  const campaignName = process.env.AISENSY_CAMPAIGN_NAME || "kaamzo_otp";
  if (!apiKey) return null;

  const resp = await fetch("https://backend.aisensy.com/campaign/t1/api/v2", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apiKey,
      campaignName,
      destination: toNumber.replace("+", ""),
      userName: name || "Kaamzo User",
      templateParams: [code]
    })
  });

  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(data.message || `AiSensy error (${resp.status})`);
  }
  return {
    success: true,
    method: "aisensy_whatsapp",
    messageId: data.id || ("kaamzo-aisensy-" + Date.now()),
    recipient: toNumber,
    message: `WhatsApp OTP sent to ${toNumber}`
  };
}

async function sendViaInterakt({ toNumber, code }) {
  const apiKey = process.env.INTERAKT_API_KEY;
  const templateName = process.env.INTERAKT_TEMPLATE_NAME || "kaamzo_otp";
  if (!apiKey) return null;

  const digits = toNumber.replace(/[^0-9]/g, "");
  const phoneNumber = digits.length > 10 ? digits.slice(-10) : digits;
  const countryCode = digits.length > 10 ? `+${digits.slice(0, digits.length - 10)}` : "+91";

  const resp = await fetch("https://api.interakt.ai/v1/public/message/", {
    method: "POST",
    headers: {
      Authorization: `Basic ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      countryCode,
      phoneNumber,
      callbackData: "kaamzo_otp",
      type: "Template",
      template: {
        name: templateName,
        languageCode: "en",
        bodyValues: [code]
      }
    })
  });

  const data = await resp.json();
  if (!resp.ok || data.result === false) {
    throw new Error(data.message || `Interakt error (${resp.status})`);
  }
  return {
    success: true,
    method: "interakt_whatsapp",
    messageId: data.id || ("kaamzo-interakt-" + Date.now()),
    recipient: toNumber,
    message: `WhatsApp OTP sent to ${toNumber}`
  };
}

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const recipient = String(body.recipient || body.email || body.phone || "").trim();
    const code = String(body.code || crypto.randomInt(100000, 999999)).trim();

    if (!recipient) {
      return res.status(400).json({ success: false, error: "Recipient is required" });
    }

    // 1. Phone / WhatsApp OTP Path (when recipient is a phone number)
    if (!recipient.includes("@")) {
      const toNumber = normalizeIndianWhatsAppNumber(recipient);
      const userName = body.customerName || body.workerName || "Kaamzo User";

      const twilioResult = await sendViaTwilioWhatsApp({ toNumber, code, role: body.role });
      if (twilioResult) return res.status(200).json(twilioResult);

      const aiSensyResult = await sendViaAiSensy({ toNumber, code, name: userName });
      if (aiSensyResult) return res.status(200).json(aiSensyResult);

      const interaktResult = await sendViaInterakt({ toNumber, code });
      if (interaktResult) return res.status(200).json(interaktResult);

      return res.status(200).json({
        success: true,
        method: "simulated_fallback",
        messageId: "kaamzo-wa-sim-" + Date.now(),
        recipient: toNumber,
        message: `WhatsApp gateway not configured yet (add TWILIO_ACCOUNT_SID/TWILIO_AUTH_TOKEN or AISENSY_API_KEY or INTERAKT_API_KEY). Simulated OTP ${code} for ${toNumber}.`
      });
    }

    // 2. Gmail SMTP Path (when recipient is an email)
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

    if (smtpUser && smtpPass && recipient.includes("@")) {
      const nodemailer = require("nodemailer");
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: Number(process.env.SMTP_PORT || 587),
        secure: String(process.env.SMTP_SECURE || "false") === "true",
        auth: { user: smtpUser, pass: smtpPass }
      });

      const { subject, html } = buildOtpEmailHtml({
        recipient,
        code,
        role: body.role,
        customerName: body.customerName,
        workerName: body.workerName
      });

      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || `"Kaamzo Security" <${smtpUser}>`,
        to: recipient,
        subject,
        html
      });

      return res.status(200).json({
        success: true,
        method: "nodemailer_gmail_smtp",
        messageId: info.messageId || ("kaamzo-smtp-" + Date.now()),
        recipient,
        message: `Verification code sent to ${recipient}`
      });
    }

    return res.status(200).json({
      success: true,
      method: "simulated_fallback",
      messageId: "kaamzo-otp-" + Date.now(),
      recipient,
      message: `Verification code ${code} prepared for ${recipient}`
    });
  } catch (err) {
    return res.status(200).json({
      success: true,
      method: "simulated_fallback",
      error: err.message
    });
  }
};
