const crypto = require("crypto");

function getEncryptionKey() {
  const hex = process.env.ENCRYPTION_KEY || "";
  if (/^[0-9a-fA-F]{64}$/.test(hex)) {
    return Buffer.from(hex, "hex");
  }
  const secret = process.env.KAAMZO_CRYPTO_SECRET || process.env.TWILIO_AUTH_TOKEN || "kaamzo-ludhiana-2026-aes256-default-key";
  return crypto.createHash("sha256").update(secret).digest();
}

function decryptOtpToken(token) {
  const parts = String(token || "").split(".");
  if (parts.length !== 3) return null;
  const iv = Buffer.from(parts[0], "base64url");
  const tag = Buffer.from(parts[1], "base64url");
  const encrypted = Buffer.from(parts[2], "base64url");
  const decipher = crypto.createDecipheriv("aes-256-gcm", getEncryptionKey(), iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]).toString("utf8");
  return JSON.parse(decrypted);
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
    const submittedOtp = String(body.otp || body.code || "").trim();
    const token = body.encryptedOtpToken || body.token;

    if (token && submittedOtp) {
      const payload = decryptOtpToken(token);
      if (!payload || Date.now() > payload.exp) {
        return res.status(400).json({ success: false, error: "OTP token expired or invalid." });
      }
      const expectedBuf = Buffer.from(payload.codeHash, "hex");
      const actualBuf = crypto.createHash("sha256").update(`${submittedOtp}:${payload.salt}`).digest();
      if (expectedBuf.length === actualBuf.length && crypto.timingSafeEqual(expectedBuf, actualBuf)) {
        return res.status(200).json({
          success: true,
          verified: true,
          recipient: payload.recipient,
          encryption: "AES-256-GCM + SHA-256"
        });
      }
    }
  } catch (e) {}

  return res.status(400).json({
    success: false,
    error: "Invalid OTP code. Please check the 6-digit code and try again."
  });
};
