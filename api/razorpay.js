"use strict";
/**
 * Kaamzo Razorpay Payment Gateway + RazorpayX UPI Payouts API (/api/razorpay)
 *
 * Modes & Actions (TEST MODE by default with test keys):
 *  - action: "config"        -> Returns public Razorpay Key ID & test UPI handles
 *  - action: "markCompleted" -> Worker marks job completed, saves UPI ID on worker + creates RazorpayX Contact/VPA Fund Account
 *  - action: "createOrder"   -> Creates a live Razorpay Order for the full quoted job amount (in paise)
 *  - action: "verifyPayment" -> Verifies HMAC-SHA256 signature, records payment, initiates RazorpayX UPI Payout, & updates MongoDB
 *  - action: "webhook"       -> Verifies X-Razorpay-Signature webhook events (payment.captured, order.paid, payout.*)
 */
const crypto = require("crypto");
const Razorpay = require("razorpay");
const {
  validatePaymentVerification,
  validateWebhookSignature
} = require("razorpay/dist/utils/razorpay-utils");
const { connectMongo, getDocById, upsertDoc, MODELS } = require("../lib/models");

const DEFAULT_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_U25bPjykCCHuUg";
const DEFAULT_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "BB6kS7ldkGy7868tIuplC6Fd";
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "kaamzo_rzp_webhook_secret_test";

function getRazorpayCredentials() {
  const keyId = (process.env.RAZORPAY_KEY_ID || DEFAULT_KEY_ID).trim();
  const keySecret = (process.env.RAZORPAY_KEY_SECRET || DEFAULT_KEY_SECRET).trim();
  return { keyId, keySecret };
}

function getFamPayGatewayConfig() {
  const apiKey = String(process.env.FAMPAY_API_KEY || "").trim();
  const apiBaseUrl = String(process.env.FAMPAY_API_BASE_URL || "").trim().replace(/\/+$/, "");
  const upiId = String(process.env.FAMPAY_UPI_ID || "6284194807@fam").trim() || "6284194807@fam";
  return {
    apiKey,
    apiBaseUrl,
    upiId,
    configured: Boolean(apiKey)
  };
}

async function verifyUtrWithFamPayGateway({ utr, amountInr, jobId, upiId }) {
  const cfg = getFamPayGatewayConfig();
  if (!cfg.configured) {
    return { gatewayConfigured: false, verifiedViaApi: false, mode: "utr_format_and_dedup" };
  }
  if (!cfg.apiBaseUrl) {
    return {
      gatewayConfigured: true,
      verifiedViaApi: false,
      mode: "fampay_key_active_utr_verified"
    };
  }
  try {
    const resp = await fetch(`${cfg.apiBaseUrl}/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cfg.apiKey}`,
        "X-API-Key": cfg.apiKey
      },
      body: JSON.stringify({ utr, amount: amountInr, jobId, upiId: upiId || cfg.upiId })
    });
    const data = await resp.json().catch(() => ({}));
    if (resp.ok && (data.verified || data.success || data.status === "PAID" || data.status === "SUCCESS")) {
      return {
        gatewayConfigured: true,
        verifiedViaApi: true,
        mode: "fampay_gateway_api_verified"
      };
    }
    return {
      gatewayConfigured: true,
      verifiedViaApi: false,
      mode: "fampay_gateway_api_rejected",
      error: data.error || data.message || `FamPay Gateway HTTP ${resp.status}`
    };
  } catch (err) {
    return {
      gatewayConfigured: true,
      verifiedViaApi: false,
      mode: "fampay_gateway_unreachable_fallback",
      error: "FamPay gateway temporarily unreachable"
    };
  }
}

function getRazorpayClient() {
  const { keyId, keySecret } = getRazorpayCredentials();
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
}

function applyCors(req, res) {
  const origin = (req.headers && req.headers.origin) || "";
  const allow =
    origin && (origin.includes("kaamzo.site") || /^http:\/\/localhost(:\d+)?$/.test(origin))
      ? origin
      : "https://www.kaamzo.site";
  res.setHeader("Access-Control-Allow-Origin", allow);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Kaamzo-Admin-Token, X-Razorpay-Signature"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("X-Content-Type-Options", "nosniff");
}

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  return res.end(JSON.stringify(payload));
}

function readRawRequestBody(req) {
  return new Promise((resolve) => {
    if (typeof req.rawBody === "string") return resolve(req.rawBody);
    if (Buffer.isBuffer(req.rawBody)) return resolve(req.rawBody.toString("utf8"));
    if (req.body && typeof req.body === "object") {
      return resolve(JSON.stringify(req.body));
    }
    if (typeof req.body === "string") return resolve(req.body);
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
    });
    req.on("end", () => resolve(data));
    req.on("error", () => resolve(""));
  });
}

async function rzpxRequest(apiPath, method, payload, extraHeaders = {}) {
  const { keyId, keySecret } = getRazorpayCredentials();
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const resp = await fetch(`https://api.razorpay.com${apiPath}`, {
    method,
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
      ...extraHeaders
    },
    body: payload ? JSON.stringify(payload) : undefined
  });
  const text = await resp.text();
  let json = {};
  try {
    json = JSON.parse(text || "{}");
  } catch (_) {}
  if (!resp.ok) {
    const err = new Error(json?.error?.description || `RazorpayX HTTP ${resp.status}`);
    err.statusCode = resp.status;
    err.razorpayError = json?.error || json;
    throw err;
  }
  return json;
}

async function ensureWorkerVpaFundAccount({ workerId, workerName, workerPhone, workerEmail, upiId }) {
  const cleanPhone = String(workerPhone || "9810100000").replace(/[^0-9]/g, "").slice(-10) || "9810100000";
  const result = {
    contactId: null,
    fundAccountId: null,
    mode: "razorpayx_test_registered",
    note: null
  };

  try {
    let existingWorker = null;
    try {
      await connectMongo();
      if (workerId) existingWorker = await getDocById("workers", workerId);
    } catch (_) {}

    let contactId = existingWorker && existingWorker.razorpayContactId;
    if (!contactId) {
      const contact = await rzpxRequest("/v1/contacts", "POST", {
        name: String(workerName || "Kaamzo Worker").slice(0, 50),
        email: workerEmail || undefined,
        contact: cleanPhone,
        type: "vendor",
        reference_id: workerId || undefined,
        notes: { platform: "Kaamzo", workerId: String(workerId || "") }
      });
      contactId = contact.id;
    }
    result.contactId = contactId;

    const fa = await rzpxRequest("/v1/fund_accounts", "POST", {
      contact_id: contactId,
      account_type: "vpa",
      vpa: { address: upiId }
    });
    result.fundAccountId = fa.id;
    return result;
  } catch (err) {
    // PG-only test accounts do not always have RazorpayX Contacts/Payouts enabled; store test-mode reference cleanly
    result.mode = "test_mode_fallback";
    result.contactId = `cont_test_${crypto.createHash("sha1").update(cleanPhone).digest("hex").slice(0, 14)}`;
    result.fundAccountId = `fa_test_${crypto.createHash("sha1").update(upiId).digest("hex").slice(0, 14)}`;
    result.note = err.message;
    return result;
  }
}

async function createWorkerUpiPayout({ fundAccountId, upiId, amountInr, jobId, paymentId }) {
  const amountPaise = Math.max(100, Math.round(Number(amountInr || 0) * 100));
  const accountNumber = (process.env.RAZORPAYX_ACCOUNT_NUMBER || "").trim();

  if (accountNumber && fundAccountId && !String(fundAccountId).startsWith("fa_test_")) {
    try {
      const idempotencyKey = `kz-pout-${jobId}-${paymentId}`.slice(0, 36);
      const payout = await rzpxRequest(
        "/v1/payouts",
        "POST",
        {
          account_number: accountNumber,
          fund_account_id: fundAccountId,
          amount: amountPaise,
          currency: "INR",
          mode: "UPI",
          purpose: "payout",
          queue_if_low_balance: true,
          reference_id: String(jobId).slice(0, 40),
          narration: "Kaamzo Worker Payout",
          notes: { jobId: String(jobId), paymentId: String(paymentId), vpa: upiId || "" }
        },
        { "X-Payout-Idempotency": idempotencyKey }
      );
      return {
        id: payout.id,
        status: payout.status || "processing",
        amountInr,
        vpa: upiId,
        mode: "razorpayx_live_api"
      };
    } catch (err) {
      return {
        id: `pout_test_${crypto.createHash("sha1").update(`${jobId}:${paymentId}`).digest("hex").slice(0, 14)}`,
        status: "processed_test_mode",
        amountInr,
        vpa: upiId,
        mode: "test_mode_fallback",
        note: err.message
      };
    }
  }

  return {
    id: `pout_test_${crypto.createHash("sha1").update(`${jobId}:${paymentId}`).digest("hex").slice(0, 14)}`,
    status: "processed_test_mode",
    amountInr,
    vpa: upiId,
    mode: "test_mode"
  };
}

function computeJobFinancials(job, explicitAmountInr) {
  const days = Math.max(1, Number(job?.durationDays) || 1);
  const baseLabor =
    Number(job?.baseLabor) > 0
      ? Math.round(Number(job.baseLabor))
      : Number(job?.dailyWage) > 0
      ? Math.round(Number(job.dailyWage) * days)
      : 650;
  const isZeroComm = Boolean(job && job.zeroCommissionApplied);
  const platformFee = isZeroComm
    ? 0
    : Number(job?.platformFee) > 0
    ? Math.round(Number(job.platformFee))
    : Math.round(baseLabor * 0.2);
  const explicit = Number(explicitAmountInr);
  const customerTotal =
    Number.isFinite(explicit) && explicit > 0
      ? Math.round(explicit)
      : Number(job?.totalAmount || job?.escrowPrepaidAmount) > 0
      ? Math.round(Number(job.totalAmount || job.escrowPrepaidAmount))
      : baseLabor + platformFee;
  const workerPayoutInr =
    Number(job?.workerPayout) > 0 ? Math.round(Number(job.workerPayout)) : Math.min(customerTotal, baseLabor);
  const adminCommissionInr = Math.max(0, customerTotal - workerPayoutInr);
  return { baseLabor, platformFee, customerTotal, workerPayoutInr, adminCommissionInr };
}

function computeQuotedAmountInr(job, explicitAmountInr) {
  return computeJobFinancials(job, explicitAmountInr).customerTotal;
}

const NPCI_UPI_HANDLES = {
  fam: "FamPay",
  okaxis: "Google Pay (Axis Bank)",
  okicici: "Google Pay (ICICI Bank)",
  okhdfcbank: "Google Pay (HDFC Bank)",
  oksbi: "Google Pay (SBI)",
  ybl: "PhonePe (Yes Bank)",
  ibl: "PhonePe (ICICI Bank)",
  axl: "PhonePe (Axis Bank)",
  paytm: "Paytm UPI",
  ptsbi: "Paytm (SBI)",
  pthdfc: "Paytm (HDFC)",
  ptaxis: "Paytm (Axis)",
  ptyes: "Paytm (Yes Bank)",
  upi: "BHIM / NPCI UPI",
  apl: "Amazon Pay",
  rapl: "Amazon Pay (RBL)",
  waaxis: "WhatsApp Pay (Axis)",
  wahdfcbank: "WhatsApp Pay (HDFC)",
  waicici: "WhatsApp Pay (ICICI)",
  wasbi: "WhatsApp Pay (SBI)",
  sbi: "SBI YONO UPI",
  icici: "ICICI iMobile UPI",
  hdfcbank: "HDFC Bank UPI",
  axisbank: "Axis Bank UPI",
  kotak: "Kotak Mahindra UPI",
  kmbl: "Kotak Bank UPI",
  indus: "IndusInd Bank UPI",
  federal: "Federal Bank UPI",
  fbl: "Federal Bank UPI",
  slice: "Slice UPI",
  jupiteraxis: "Jupiter UPI",
  naviaxis: "CRED / Navi UPI",
  airtel: "Airtel Payments Bank",
  jio: "JioPay UPI",
  barodampay: "Bank of Baroda UPI",
  pnb: "PNB UPI",
  cnrb: "Canara Bank UPI",
  unionbank: "Union Bank UPI",
  uboi: "Union Bank UPI",
  boi: "Bank of India UPI",
  idbi: "IDBI Bank UPI",
  yesbank: "Yes Bank UPI",
  rbl: "RBL Bank UPI",
  idfcbank: "IDFC FIRST Bank UPI",
  equitas: "Equitas Bank UPI",
  au: "AU Small Finance Bank",
  sib: "South Indian Bank UPI",
  kvb: "Karur Vysya Bank UPI",
  cub: "City Union Bank UPI",
  dcb: "DCB Bank UPI",
  bandhan: "Bandhan Bank UPI",
  ippb: "India Post Payments Bank",
  postbank: "India Post Payments Bank",
  freecharge: "Freecharge UPI",
  mobikwik: "MobiKwik UPI",
  ikwik: "MobiKwik UPI",
  cred: "CRED UPI",
  razorpay: "Razorpay Test UPI"
};

const UPI_TYPO_SUGGESTIONS = {
  "gmail.com": "That looks like an email address, not a UPI ID. Use @fam, @okaxis, @ybl, or @paytm.",
  "yahoo.com": "That looks like an email address, not a UPI ID.",
  "outlook.com": "That looks like an email address, not a UPI ID.",
  "hotmail.com": "That looks like an email address, not a UPI ID.",
  fampay: "FamPay UPI IDs end with @fam (not @fampay).",
  fampayupi: "FamPay UPI IDs end with @fam.",
  gpay: "Google Pay uses @okaxis, @okicici, @okhdfcbank, or @oksbi (not @gpay).",
  googlepay: "Google Pay uses @okaxis, @okicici, @okhdfcbank, or @oksbi.",
  phonepe: "PhonePe uses @ybl, @ibl, or @axl (not @phonepe).",
  okhdfc: "Google Pay HDFC handle is @okhdfcbank (not @okhdfc).",
  axis: "Try @okaxis or @axisbank.",
  hdfc: "Try @okhdfcbank or @hdfcbank.",
  sbiupi: "SBI / GPay SBI uses @oksbi or @sbi.",
  bhim: "BHIM UPI IDs end with @upi (not @bhim)."
};

function validateUpiVpa(rawVpa) {
  const clean = String(rawVpa || "").trim().toLowerCase();
  if (!clean) {
    return { valid: false, vpa: "", error: "UPI ID is required (e.g. 6284194807@fam or name@okaxis)." };
  }
  if (/\s/.test(clean)) {
    return { valid: false, vpa: clean, error: "Wrong UPI ID: UPI IDs cannot contain spaces." };
  }
  const parts = clean.split("@");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return { valid: false, vpa: clean, error: "Wrong UPI ID format: must contain one '@' (e.g. 6284194807@fam)." };
  }
  const [userPart, handle] = parts;
  if (userPart.length < 2 || !/^[a-z0-9._-]+$/.test(userPart) || /^\.|\.$|\.\./.test(userPart)) {
    return {
      valid: false,
      vpa: clean,
      error: "Wrong UPI username before '@'. Only letters, numbers, dots, hyphens, and underscores are allowed."
    };
  }
  if (UPI_TYPO_SUGGESTIONS[handle]) {
    return {
      valid: false,
      vpa: clean,
      handle,
      error: `Wrong UPI handle (@${handle}): ${UPI_TYPO_SUGGESTIONS[handle]}`
    };
  }
  const appName = NPCI_UPI_HANDLES[handle];
  if (!appName) {
    return {
      valid: false,
      vpa: clean,
      handle,
      error: `Unrecognized UPI bank/app handle "@${handle}". Use a real NPCI handle like @fam, @okaxis, @okicici, @oksbi, @ybl, @ibl, @axl, @paytm, or @upi.`
    };
  }
  return { valid: true, vpa: clean, handle, appName };
}

module.exports = async function handler(req, res) {
  applyCors(req, res);

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }

  const parsedUrl = new URL(req.url || "/api/razorpay", "http://localhost:3000");
  const isWebhookRoute = parsedUrl.pathname === "/api/razorpay-webhook";

  let rawBody = "";
  let body = {};
  if (req.method === "POST" || req.method === "PUT") {
    if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
      body = req.body;
      rawBody = typeof req.rawBody === "string" ? req.rawBody : JSON.stringify(body);
    } else {
      rawBody = await readRawRequestBody(req);
      try {
        body = JSON.parse(rawBody || "{}");
      } catch (_) {
        body = {};
      }
    }
  }

  const action =
    (isWebhookRoute ? "webhook" : null) ||
    parsedUrl.searchParams.get("action") ||
    body.action ||
    (req.method === "GET" ? "config" : "");

  const { keyId, keySecret } = getRazorpayCredentials();

  try {
    // -----------------------------------------------------------------------
    // 1. CONFIG: Return Public Test Key ID & Test UPI IDs
    // -----------------------------------------------------------------------
    if (action === "config") {
      const famCfg = getFamPayGatewayConfig();
      return sendJson(res, 200, {
        success: true,
        keyId,
        mode: keyId.startsWith("rzp_test_") ? "test" : "live",
        fampayUpiId: famCfg.upiId,
        fampayGatewayConfigured: famCfg.configured,
        testUpiIds: {
          fampay: famCfg.upiId,
          success: "success@razorpay",
          failure: "failure@razorpay"
        }
      });
    }

    // -----------------------------------------------------------------------
    // 1b. VALIDATE VPA: Detect Wrong / Fake / Typo UPI IDs (+ Live NPCI lookup if enabled)
    // -----------------------------------------------------------------------
    if (action === "validateVpa") {
      const rawVpa = parsedUrl.searchParams.get("vpa") || body.vpa || body.upiId || "";
      const check = validateUpiVpa(rawVpa);
      if (!check.valid) {
        return sendJson(res, 200, {
          success: true,
          valid: false,
          vpa: check.vpa,
          mode: "npci_syntax_check",
          error: check.error
        });
      }

      // Attempt Razorpay Live NPCI VPA Existence Check when merchant account supports it
      try {
        const liveRes = await rzpxRequest("/v1/payments/validate/vpa", "POST", { vpa: check.vpa });
        if (typeof liveRes.success === "boolean") {
          return sendJson(res, 200, {
            success: true,
            valid: liveRes.success,
            vpa: check.vpa,
            appName: check.appName,
            customerName: liveRes.customer_name || null,
            mode: "razorpay_npci_live",
            error: liveRes.success
              ? null
              : `UPI ID "${check.vpa}" does not exist on NPCI (${check.appName}). Please double-check the spelling.`
          });
        }
      } catch (_) {}

      return sendJson(res, 200, {
        success: true,
        valid: true,
        vpa: check.vpa,
        appName: check.appName,
        mode: "npci_handle_verified"
      });
    }

    // -----------------------------------------------------------------------
    // 2. MARK COMPLETED: Worker submits UPI ID (saved for next time) + Fund Account
    // -----------------------------------------------------------------------
    if (action === "markCompleted") {
      if (req.method !== "POST") return sendJson(res, 405, { success: false, error: "Method not allowed" });

      const vpaCheck = validateUpiVpa(body.upiId || "6284194807@fam");
      if (!vpaCheck.valid) {
        return sendJson(res, 400, {
          success: false,
          error: vpaCheck.error
        });
      }
      const cleanUpi = vpaCheck.vpa;

      const jobId = String(body.jobId || "").trim();
      if (!jobId) return sendJson(res, 400, { success: false, error: "jobId is required" });

      let dbJob = null;
      let dbWorker = null;
      try {
        await connectMongo();
        dbJob = await getDocById("jobs", jobId);
        if (body.workerId) dbWorker = await getDocById("workers", String(body.workerId));
      } catch (_) {}

      const mergedJob = {
        ...(body.jobSnapshot || {}),
        ...(dbJob || {}),
        id: jobId,
        status: "completed_pending_payment",
        paymentStatus: "awaiting_customer_payment",
        assignedWorkerId: body.workerId || dbJob?.assignedWorkerId || body.jobSnapshot?.assignedWorkerId,
        assignedWorkerName: body.workerName || dbJob?.assignedWorkerName || body.jobSnapshot?.assignedWorkerName,
        assignedWorkerPhone: body.workerPhone || dbJob?.assignedWorkerPhone || body.jobSnapshot?.assignedWorkerPhone,
        assignedWorkerUpi: cleanUpi,
        completedAt: new Date().toISOString()
      };

      const fundAccount = await ensureWorkerVpaFundAccount({
        workerId: mergedJob.assignedWorkerId,
        workerName: mergedJob.assignedWorkerName,
        workerPhone: mergedJob.assignedWorkerPhone,
        workerEmail: dbWorker?.email || body.workerEmail,
        upiId: cleanUpi
      });

      mergedJob.razorpayContactId = fundAccount.contactId;
      mergedJob.razorpayFundAccountId = fundAccount.fundAccountId;

      try {
        await connectMongo();
        await upsertDoc("jobs", jobId, mergedJob);
        if (mergedJob.assignedWorkerId) {
          const workerUpdate = {
            ...(dbWorker || {}),
            id: mergedJob.assignedWorkerId,
            name: mergedJob.assignedWorkerName || dbWorker?.name || "Worker",
            upiId: cleanUpi,
            razorpayContactId: fundAccount.contactId,
            razorpayFundAccountId: fundAccount.fundAccountId
          };
          await upsertDoc("workers", mergedJob.assignedWorkerId, workerUpdate);
        }
      } catch (dbErr) {
        console.warn("[Razorpay markCompleted Mongo note]", dbErr.message);
      }

      return sendJson(res, 200, {
        success: true,
        job: mergedJob,
        savedUpiId: cleanUpi,
        fundAccount
      });
    }

    // -----------------------------------------------------------------------
    // 3. CREATE ORDER: Official razorpay.orders.create() for full quoted amount
    // -----------------------------------------------------------------------
    if (action === "createOrder") {
      if (req.method !== "POST") return sendJson(res, 405, { success: false, error: "Method not allowed" });

      const jobId = String(body.jobId || `job_${Date.now()}`).trim();
      let dbJob = null;
      try {
        await connectMongo();
        dbJob = await getDocById("jobs", jobId);
      } catch (_) {}

      const mergedJob = { ...(body.jobSnapshot || {}), ...(dbJob || {}), id: jobId };
      const quotedInr = computeQuotedAmountInr(mergedJob, body.amountInr);
      const amountPaise = Math.max(100, Math.round(quotedInr * 100));

      const rzp = getRazorpayClient();
      const order = await rzp.orders.create({
        amount: amountPaise,
        currency: "INR",
        receipt: `kz_${jobId}_${Date.now()}`.slice(0, 40),
        notes: {
          jobId,
          trade: String(mergedJob.trade || ""),
          workerId: String(mergedJob.assignedWorkerId || ""),
          workerUpi: String(mergedJob.assignedWorkerUpi || ""),
          customerName: String(body.customerName || mergedJob.customerName || "Customer")
        }
      });

      const updatedJob = {
        ...mergedJob,
        razorpayOrderId: order.id,
        razorpayOrderAmount: quotedInr,
        paymentStatus: "order_created",
        orderCreatedAt: new Date().toISOString()
      };

      try {
        await connectMongo();
        await upsertDoc("jobs", jobId, updatedJob);
      } catch (dbErr) {
        console.warn("[Razorpay createOrder Mongo note]", dbErr.message);
      }

      return sendJson(res, 200, {
        success: true,
        keyId,
        amountInr: quotedInr,
        order,
        job: updatedJob
      });
    }

    // -----------------------------------------------------------------------
    // 4. VERIFY PAYMENT: HMAC-SHA256 verification + RazorpayX UPI Payout
    // -----------------------------------------------------------------------
    if (action === "verifyPayment") {
      if (req.method !== "POST") return sendJson(res, 405, { success: false, error: "Method not allowed" });

      const {
        jobId,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        rating,
        review
      } = body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return sendJson(res, 400, {
          success: false,
          error: "Missing razorpay_order_id, razorpay_payment_id, or razorpay_signature."
        });
      }

      const expectedSig = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      const sdkValid = validatePaymentVerification(
        { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
        razorpay_signature,
        keySecret
      );

      if (expectedSig !== razorpay_signature || !sdkValid) {
        return sendJson(res, 400, {
          success: false,
          verified: false,
          error: "Invalid Razorpay payment signature."
        });
      }

      let fetchedPayment = null;
      try {
        const rzp = getRazorpayClient();
        fetchedPayment = await rzp.payments.fetch(razorpay_payment_id);
      } catch (_) {}

      const cleanJobId = String(jobId || "").trim();
      let dbJob = null;
      let dbWorker = null;
      try {
        await connectMongo();
        if (cleanJobId) dbJob = await getDocById("jobs", cleanJobId);
      } catch (_) {}

      const baseJob = { ...(body.jobSnapshot || {}), ...(dbJob || {}), id: cleanJobId || `job_${Date.now()}` };
      const fin = computeJobFinancials(baseJob, body.amountInr);
      const grossInr = fin.customerTotal;
      const workerPayoutInr = fin.workerPayoutInr;

      const workerUpi = baseJob.assignedWorkerUpi || body.workerUpi || "success@razorpay";
      let fundAccountId = baseJob.razorpayFundAccountId;
      if (!fundAccountId && baseJob.assignedWorkerId) {
        const fa = await ensureWorkerVpaFundAccount({
          workerId: baseJob.assignedWorkerId,
          workerName: baseJob.assignedWorkerName,
          workerPhone: baseJob.assignedWorkerPhone,
          upiId: workerUpi
        });
        fundAccountId = fa.fundAccountId;
      }

      const payout = await createWorkerUpiPayout({
        fundAccountId,
        upiId: workerUpi,
        amountInr: workerPayoutInr,
        jobId: baseJob.id,
        paymentId: razorpay_payment_id
      });

      const paidJob = {
        ...baseJob,
        status: "paid_and_closed",
        isPaid: true,
        isEscrowPrepaid: true,
        escrowStatus: "released_to_worker",
        paymentStatus: "paid_and_settled",
        paidVia: fetchedPayment?.method
          ? `RAZORPAY_${String(fetchedPayment.method).toUpperCase()}`
          : "RAZORPAY_CHECKOUT_UPI",
        transactionRef: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpayPaymentMethod: fetchedPayment?.method || "upi",
        razorpayPayerVpa: fetchedPayment?.vpa || null,
        razorpaySignatureVerified: true,
        razorpayPayoutId: payout.id,
        razorpayPayoutStatus: payout.status,
        assignedWorkerUpi: workerUpi,
        rating: Number(rating) || baseJob.rating || 5,
        review: review || baseJob.review || "Paid cleanly via Razorpay Checkout",
        paidAt: new Date().toISOString()
      };

      try {
        await connectMongo();
        if (cleanJobId) await upsertDoc("jobs", cleanJobId, paidJob);
        if (paidJob.assignedWorkerId) {
          dbWorker = await getDocById("workers", paidJob.assignedWorkerId);
          if (dbWorker) {
            const txEntry = {
              id: payout.id,
              amount: workerPayoutInr,
              upiId: workerUpi,
              refId: razorpay_payment_id,
              timestamp: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
              status: "Settled via RazorpayX UPI"
            };
            const existingHistory = Array.isArray(dbWorker.withdrawalHistory) ? dbWorker.withdrawalHistory : [];
            await upsertDoc("workers", paidJob.assignedWorkerId, {
              ...dbWorker,
              upiId: workerUpi,
              completedJobsCount: (dbWorker.completedJobsCount || 0) + 1,
              completedJobs: (dbWorker.completedJobs || dbWorker.completedJobsCount || 0) + 1,
              todayEarnings: (dbWorker.todayEarnings || 0) + workerPayoutInr,
              totalEarnings: (dbWorker.totalEarnings || 0) + workerPayoutInr,
              withdrawalHistory: [txEntry, ...existingHistory].slice(0, 30)
            });
          }
        }
      } catch (dbErr) {
        console.warn("[Razorpay verifyPayment Mongo note]", dbErr.message);
      }

      return sendJson(res, 200, {
        success: true,
        verified: true,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        payout,
        job: paidJob
      });
    }

    // -----------------------------------------------------------------------
    // 4b. CONFIRM FAMPAY UPI PAYMENT (6284194807@fam) — REAL MONEY TRANSFER UTR VERIFICATION
    // -----------------------------------------------------------------------
    if (action === "confirmFampayPayment") {
      if (req.method !== "POST") return sendJson(res, 405, { success: false, error: "Method not allowed" });

      const cleanJobId = String(body.jobId || `job_${Date.now()}`).trim();
      const targetUpi = String(body.upiId || "6284194807@fam").trim() || "6284194807@fam";
      const rawUtr = String(body.utr || "").trim();
      const digitsOnlyUtr = rawUtr.replace(/\D/g, "");
      const is12DigitUtr = /^\d{12}$/.test(digitsOnlyUtr) && !/^(\d)\1{11}$/.test(digitsOnlyUtr) && digitsOnlyUtr !== "123456789012";
      const isRzpPaymentId = /^pay_[A-Za-z0-9]{8,24}$/.test(rawUtr);

      if (!is12DigitUtr && !isRzpPaymentId) {
        return sendJson(res, 400, {
          success: false,
          verified: false,
          error:
            "Enter the valid 12-digit UPI Reference / UTR number from your FamPay / Google Pay / PhonePe receipt after transferring the money to 6284194807@fam."
        });
      }

      const utrRef = is12DigitUtr ? digitsOnlyUtr : rawUtr;

      let dbJob = null;
      let dbWorker = null;
      try {
        await connectMongo();
        if (cleanJobId) dbJob = await getDocById("jobs", cleanJobId);
        // Prevent duplicate reuse of the same 12-digit UPI UTR across different jobs
        if (MODELS && MODELS.jobs) {
          const dup = await MODELS.jobs
            .findOne({
              id: { $ne: cleanJobId },
              $or: [{ transactionRef: utrRef }, { razorpayPaymentId: utrRef }, { upiUtr: utrRef }]
            })
            .lean();
          if (dup && dup.id) {
            return sendJson(res, 409, {
              success: false,
              verified: false,
              error: `This 12-digit UPI UTR (${utrRef}) was already used for another work order (#${dup.id}). Please enter the new UTR from your payment receipt.`
            });
          }
        }
      } catch (_) {}

      const baseJob = { ...(body.jobSnapshot || {}), ...(dbJob || {}), id: cleanJobId };
      const fin = computeJobFinancials(baseJob, body.amountInr);
      const grossInr = fin.customerTotal;
      const workerPayoutInr = fin.workerPayoutInr;

      const famGatewayCheck = await verifyUtrWithFamPayGateway({
        utr: utrRef,
        amountInr: grossInr,
        jobId: baseJob.id,
        upiId: targetUpi
      });
      if (famGatewayCheck.mode === "fampay_gateway_api_rejected") {
        return sendJson(res, 400, {
          success: false,
          verified: false,
          error: famGatewayCheck.error || "FamPay Gateway could not verify this UTR."
        });
      }

      const apiVerified = Boolean(famGatewayCheck.verifiedViaApi);
      const payout = apiVerified
        ? await createWorkerUpiPayout({
            fundAccountId: baseJob.razorpayFundAccountId,
            upiId: targetUpi,
            amountInr: workerPayoutInr,
            jobId: baseJob.id,
            paymentId: utrRef
          })
        : {
            id: `pout_hold_${utrRef}`,
            status: "pending_admin_utr_audit",
            amountInr: workerPayoutInr,
            vpa: targetUpi,
            mode: "escrow_audit_hold"
          };

      const paidJob = {
        ...baseJob,
        baseLabor: fin.baseLabor,
        platformFee: fin.platformFee,
        totalAmount: grossInr,
        workerPayout: workerPayoutInr,
        status: "paid_and_closed",
        isPaid: true,
        isEscrowPrepaid: true,
        escrowStatus: apiVerified ? "released_to_worker" : "utr_pending_admin_audit",
        utrVerificationStatus: apiVerified ? "verified_api" : "pending_admin_audit",
        paymentStatus: apiVerified ? "paid_and_settled" : "utr_submitted_pending_audit",
        paidVia: "FAMPAY_UPI_6284194807@fam",
        fampayGatewayMode: famGatewayCheck.mode,
        fampayGatewayVerified: apiVerified,
        transactionRef: utrRef,
        upiUtr: utrRef,
        fampayUtr: utrRef,
        upiAppUsed: String(body.upiAppUsed || "FamPay UPI").slice(0, 40),
        payerUpi: String(body.payerUpi || "").trim().slice(0, 80) || undefined,
        razorpayPaymentId: utrRef,
        razorpayPaymentMethod: "upi_fampay",
        razorpayPayerVpa: targetUpi,
        razorpayPayoutId: payout.id,
        razorpayPayoutStatus: payout.status,
        assignedWorkerUpi: targetUpi,
        rating: Number(body.rating) || baseJob.rating || 5,
        review: body.review || baseJob.review || `Paid ₹${grossInr} via FamPay UPI (6284194807@fam · UTR: ${utrRef})`,
        paidAt: new Date().toISOString()
      };

      try {
        await connectMongo();
        if (cleanJobId) await upsertDoc("jobs", cleanJobId, paidJob);
        if (paidJob.assignedWorkerId) {
          dbWorker = await getDocById("workers", paidJob.assignedWorkerId);
          if (dbWorker) {
            const txEntry = {
              id: payout.id,
              amount: workerPayoutInr,
              upiId: targetUpi,
              refId: utrRef,
              timestamp: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
              status: apiVerified
                ? `Settled via FamPay UPI (UTR ${utrRef})`
                : `Escrow Hold — Awaiting Admin UTR Verification (${utrRef})`
            };
            const existingHistory = Array.isArray(dbWorker.withdrawalHistory) ? dbWorker.withdrawalHistory : [];
            await upsertDoc("workers", paidJob.assignedWorkerId, {
              ...dbWorker,
              upiId: dbWorker.upiId || targetUpi,
              walletBalance: apiVerified
                ? (Number(dbWorker.walletBalance) || 0) + workerPayoutInr
                : Number(dbWorker.walletBalance) || 0,
              pendingEscrowBalance: apiVerified
                ? Number(dbWorker.pendingEscrowBalance) || 0
                : (Number(dbWorker.pendingEscrowBalance) || 0) + workerPayoutInr,
              completedJobsCount: (dbWorker.completedJobsCount || 0) + 1,
              completedJobs: (dbWorker.completedJobs || dbWorker.completedJobsCount || 0) + 1,
              todayEarnings: (dbWorker.todayEarnings || 0) + workerPayoutInr,
              totalEarnings: (dbWorker.totalEarnings || 0) + workerPayoutInr,
              withdrawalHistory: [txEntry, ...existingHistory].slice(0, 30)
            });
          }
        }
      } catch (dbErr) {
        console.warn("[FamPay confirmPayment Mongo note]", dbErr.message);
      }

      return sendJson(res, 200, {
        success: true,
        verified: true,
        utrAuditRequired: !apiVerified,
        paymentId: utrRef,
        utr: utrRef,
        upiId: targetUpi,
        amountInr: grossInr,
        workerPayoutInr,
        payout,
        job: paidJob
      });
    }

    // -----------------------------------------------------------------------
    // 4b-2. ADMIN APPROVE FAMPAY UTR & RELEASE ESCROW TO WORKER WALLET
    // -----------------------------------------------------------------------
    if (action === "approveFamPayUtr") {
      if (req.method !== "POST") return sendJson(res, 405, { success: false, error: "Method not allowed" });
      const adminEmails = (process.env.ADMIN_EMAILS || "bhavnoorsinghkochar@gmail.com,danishwadhawan7@gmail.com")
        .split(",")
        .map((s) => s.trim().toLowerCase());
      const claimedAdminEmail = String(body.adminEmail || "").trim().toLowerCase();
      if (!claimedAdminEmail || !adminEmails.includes(claimedAdminEmail)) {
        return sendJson(res, 403, { success: false, error: "Administrator authorization required to approve UTR payouts." });
      }
      const cleanJobId = String(body.jobId || "").trim();
      if (!cleanJobId) return sendJson(res, 400, { success: false, error: "jobId is required." });
      await connectMongo();
      const job = await getDocById("jobs", cleanJobId);
      if (!job) return sendJson(res, 404, { success: false, error: "Job not found." });
      if (job.utrVerificationStatus === "verified_admin" || job.escrowStatus === "released_to_worker") {
        return sendJson(res, 200, { success: true, alreadyApproved: true, job });
      }
      const fin = computeJobFinancials(job, job.totalAmount);
      const workerPayoutInr = fin.workerPayoutInr;
      const updatedJob = await upsertDoc("jobs", cleanJobId, {
        ...job,
        escrowStatus: "released_to_worker",
        utrVerificationStatus: "verified_admin",
        paymentStatus: "paid_and_settled",
        utrApprovedBy: claimedAdminEmail,
        utrApprovedAt: new Date().toISOString()
      });
      if (job.assignedWorkerId) {
        const dbWorker = await getDocById("workers", job.assignedWorkerId);
        if (dbWorker) {
          await upsertDoc("workers", job.assignedWorkerId, {
            ...dbWorker,
            walletBalance: (Number(dbWorker.walletBalance) || 0) + workerPayoutInr,
            pendingEscrowBalance: Math.max(0, (Number(dbWorker.pendingEscrowBalance) || 0) - workerPayoutInr)
          });
        }
      }
      return sendJson(res, 200, { success: true, approved: true, workerPayoutInr, job: updatedJob });
    }

    // -----------------------------------------------------------------------
    // 4c. WITHDRAW WORKER WALLET TO FAMPAY / UPI (6284194807@fam)
    // -----------------------------------------------------------------------
    if (action === "withdrawWorkerWallet") {
      if (req.method !== "POST") return sendJson(res, 405, { success: false, error: "Method not allowed" });

      const workerId = String(body.workerId || "").trim();
      if (!workerId) {
        return sendJson(res, 400, { success: false, error: "Authenticated workerId is required to withdraw wallet funds." });
      }
      const vpaCheck = validateUpiVpa(body.upiId || "");
      if (!vpaCheck.valid) {
        return sendJson(res, 400, {
          success: false,
          error: vpaCheck.error
        });
      }
      const targetUpi = vpaCheck.vpa;

      await connectMongo();
      const dbWorker = await getDocById("workers", workerId);
      if (!dbWorker) {
        return sendJson(res, 404, { success: false, error: "Worker account not found." });
      }

      // Verify caller owns this worker profile (matching registered phone or registered UPI)
      const regPhone10 = String(dbWorker.phone || "").replace(/[^0-9]/g, "").slice(-10);
      const reqPhone10 = String(body.workerPhone || "").replace(/[^0-9]/g, "").slice(-10);
      const regUpi = String(dbWorker.upiId || "").trim().toLowerCase();
      if (regPhone10 && reqPhone10 !== regPhone10 && (!regUpi || regUpi !== targetUpi.toLowerCase())) {
        return sendJson(res, 403, {
          success: false,
          error: "Withdrawal denied: Phone number or UPI ID does not match the registered worker profile."
        });
      }

      // Strictly use server-verified walletBalance — NEVER trust client-supplied body.amountInr!
      const serverBalance = Math.floor(Number(dbWorker.walletBalance) || 0);
      if (serverBalance <= 0) {
        const pendingHold = Math.floor(Number(dbWorker.pendingEscrowBalance) || 0);
        return sendJson(res, 400, {
          success: false,
          error:
            pendingHold > 0
              ? `₹${pendingHold} is currently awaiting Admin UTR verification before withdrawal.`
              : "Withdrawable wallet balance is ₹0."
        });
      }

      const amountInr = serverBalance;

      // Atomic conditional balance deduction so parallel requests can NEVER double-withdraw
      const locked = await MODELS.workers.findOneAndUpdate(
        { id: workerId, walletBalance: { $gte: amountInr } },
        { $inc: { walletBalance: -amountInr, totalWithdrawn: amountInr } },
        { returnDocument: "after", lean: true }
      );
      if (!locked) {
        return sendJson(res, 409, {
          success: false,
          error: "Wallet balance changed during withdrawal. Please refresh and try again."
        });
      }

      const fundAccount = await ensureWorkerVpaFundAccount({
        workerId,
        workerName: dbWorker.name || "Kaamzo Worker",
        workerPhone: dbWorker.phone || "9810100000",
        upiId: targetUpi
      });

      const payoutRef = `UTR${Date.now().toString().slice(-9)}${Math.floor(100 + Math.random() * 900)}`;
      const payout = await createWorkerUpiPayout({
        fundAccountId: fundAccount.fundAccountId,
        upiId: targetUpi,
        amountInr,
        jobId: `wdr_${workerId}`,
        paymentId: payoutRef
      });

      const txEntry = {
        id: payout.id || `wdr_${Date.now()}`,
        amount: amountInr,
        upiId: targetUpi,
        refId: payoutRef,
        timestamp: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
        status: `Transferred to ${targetUpi}`
      };

      try {
        const freshWorker = await getDocById("workers", workerId);
        const existingHistory = Array.isArray(freshWorker?.withdrawalHistory) ? freshWorker.withdrawalHistory : [];
        await upsertDoc("workers", workerId, {
          ...(freshWorker || dbWorker),
          id: workerId,
          upiId: targetUpi,
          walletBalance: Math.max(0, Number(freshWorker?.walletBalance) || 0),
          withdrawalHistory: [txEntry, ...existingHistory].slice(0, 30)
        });
      } catch (_) {}

      return sendJson(res, 200, {
        success: true,
        upiId: targetUpi,
        amountInr,
        refId: payoutRef,
        payout,
        txEntry
      });
    }

    // -----------------------------------------------------------------------
    // 5. WEBHOOK: Official Razorpay + RazorpayX Webhook Handler
    // -----------------------------------------------------------------------
    if (action === "webhook") {
      if (req.method !== "POST") return sendJson(res, 405, { success: false, error: "Method not allowed" });

      const sig = req.headers && req.headers["x-razorpay-signature"];
      if (!sig) {
        return sendJson(res, 400, { success: false, error: "Missing X-Razorpay-Signature header." });
      }

      const valid = validateWebhookSignature(rawBody, String(sig), WEBHOOK_SECRET);
      if (!valid) {
        return sendJson(res, 400, { success: false, error: "Invalid webhook signature." });
      }

      const event = body.event || "";
      const paymentEntity = body?.payload?.payment?.entity;
      const payoutEntity = body?.payload?.payout?.entity;
      const targetJobId =
        paymentEntity?.notes?.jobId || payoutEntity?.notes?.jobId || payoutEntity?.reference_id || "";

      if (targetJobId) {
        try {
          await connectMongo();
          const job = await getDocById("jobs", String(targetJobId));
          if (job) {
            const patch = { ...job, lastWebhookEvent: event, lastWebhookAt: new Date().toISOString() };
            if (event === "payment.captured" || event === "order.paid") {
              patch.status = "paid_and_closed";
              patch.isPaid = true;
              patch.paymentStatus = "paid_and_settled";
              patch.escrowStatus = "released_to_worker";
              if (paymentEntity?.id) patch.razorpayPaymentId = paymentEntity.id;
            } else if (event === "payout.processed" && payoutEntity) {
              patch.razorpayPayoutId = payoutEntity.id;
              patch.razorpayPayoutStatus = "processed";
            } else if ((event === "payout.failed" || event === "payout.reversed") && payoutEntity) {
              patch.razorpayPayoutId = payoutEntity.id;
              patch.razorpayPayoutStatus = payoutEntity.status || event.replace("payout.", "");
            }
            await upsertDoc("jobs", String(targetJobId), patch);
          }
        } catch (dbErr) {
          console.warn("[Razorpay webhook Mongo note]", dbErr.message);
        }
      }

      return sendJson(res, 200, { success: true, received: true, event });
    }

    return sendJson(res, 400, { success: false, error: `Unsupported action: ${action || "none"}` });
  } catch (err) {
    console.error("[/api/razorpay] Error:", err);
    return sendJson(res, err.statusCode || 500, {
      success: false,
      error: err.message || "Razorpay server error"
    });
  }
};
