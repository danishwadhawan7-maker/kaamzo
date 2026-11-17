"use strict";
/**
 * Kaamzo AI Custom Job Estimator & Safety Filter (/api/estimate-job)
 *
 * - Estimates typical fair price & duration in Ludhiana/Punjab for custom job descriptions
 * - Rejects inappropriate, illegal, unsafe, or harmful job requests before broadcasting
 */
const rateBuckets = new Map();

function checkRateLimit(ip, maxReqs = 60, windowMs = 60 * 1000) {
  const now = Date.now();
  const entry = rateBuckets.get(ip) || { count: 0, resetAt: now + windowMs };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + windowMs;
  }
  entry.count += 1;
  rateBuckets.set(ip, entry);
  return entry.count <= maxReqs;
}

const INAPPROPRIATE_PATTERNS = [
  /\b(kill|murder|assault|attack|beat up|hurt|weapon|gun|pistol|rifle|knife|bomb|explosive|poison)\b/i,
  /\b(drug|cocaine|heroin|meth|weed|marijuana|ganja|smuggle|contraband|illegal)\b/i,
  /\b(steal|theft|robbery|burglary|break.?in|hack|phishing|scam|fraud|fake id|forge|counterfeit)\b/i,
  /\b(sex|sexual|escort|nude|porn|adult service|prostitut|massage happy)\b/i,
  /\b(child labor|child labour|minor|underage|kid work)\b/i,
  /\b(harass|stalk|blackmail|extort|threaten|bribe)\b/i
];

const TRADE_RULES = [
  {
    trade: "Electrician",
    keywords: /fan|switch|socket|wiring|mcb|inverter|ups|geyser|ac|light|bulb|tube|chandelier|short circuit|earthing|meter|bell|exhaust/i,
    basePrice: 450,
    perDay: 850,
    defaultTime: "1–3 hours"
  },
  {
    trade: "Plumber",
    keywords: /tap|pipe|leak|sink|basin|toilet|flush|tank|water|motor|pump|drain|block|shower|bathroom|commode|geyser pipe/i,
    basePrice: 400,
    perDay: 800,
    defaultTime: "1–3 hours"
  },
  {
    trade: "Carpenter",
    keywords: /wood|door|window|lock|hinge|cupboard|wardrobe|almirah|bed|sofa|table|chair|shelf|drawer|plywood|furniture|handle/i,
    basePrice: 500,
    perDay: 900,
    defaultTime: "2–4 hours"
  },
  {
    trade: "Painter",
    keywords: /paint|whitewash|putty|primer|wall|ceiling|damp|waterproof|polish|varnish|texture|stencil|room paint/i,
    basePrice: 650,
    perDay: 850,
    defaultTime: "Half day – 1 day"
  },
  {
    trade: "Mason",
    keywords: /brick|cement|plaster|wall|concrete|slab|crack|floor|repair|masonry|pillar|boundary|kitchen slab/i,
    basePrice: 750,
    perDay: 950,
    defaultTime: "Half day – 1 day"
  },
  {
    trade: "Tile Worker",
    keywords: /tile|marble|granite|grout|bathroom tile|flooring|stone|skirting/i,
    basePrice: 750,
    perDay: 950,
    defaultTime: "Half day – 1 day"
  },
  {
    trade: "Welder",
    keywords: /weld|gate|grill|iron|steel|railing|shutter|hinge weld|shed|metal|fabrication/i,
    basePrice: 600,
    perDay: 950,
    defaultTime: "2–4 hours"
  },
  {
    trade: "Loader/Mover",
    keywords: /shift|move|load|unload|luggage|fridge|almirah|furniture shift|tempo|truck|carry|pack/i,
    basePrice: 500,
    perDay: 750,
    defaultTime: "2–4 hours"
  },
  {
    trade: "Construction Helper",
    keywords: /clean|debris|malba|dig|garden|helper|labour|labor|sweep|carry|site clean|wash/i,
    basePrice: 450,
    perDay: 650,
    defaultTime: "Half day – 1 day"
  }
];

function estimateCustomJob(promptText) {
  const text = String(promptText || "").trim();
  if (text.length < 4) {
    return {
      allowed: false,
      rejected: true,
      reason: "Please describe the job in a few words (e.g., 'Install 2 ceiling fans and fix bedroom switchboard')."
    };
  }

  for (const rx of INAPPROPRIATE_PATTERNS) {
    if (rx.test(text)) {
      return {
        allowed: false,
        rejected: true,
        reason: "This job request violates Kaamzo Safety & Legal Guidelines (unsafe, illegal, or inappropriate task) and cannot be broadcasted."
      };
    }
  }

  let matched = TRADE_RULES.find((r) => r.keywords.test(text));
  if (!matched) {
    matched = TRADE_RULES[TRADE_RULES.length - 1];
  }

  // Scale price slightly if multiple items / rooms / full day mentioned
  let multiplier = 1;
  const qtyMatch = text.match(/\b([2-9]|1[0-5])\b/);
  if (qtyMatch) {
    const qty = Number(qtyMatch[1]);
    if (qty >= 2 && qty <= 4) multiplier = 1.35;
    else if (qty >= 5) multiplier = 1.75;
  }
  if (/full day|whole house|entire|complete|2 days|3 days|major|big/i.test(text)) {
    multiplier = Math.max(multiplier, 1.6);
  }

  const suggestedPrice = Math.round((matched.basePrice * multiplier) / 50) * 50;
  const minPrice = Math.max(250, suggestedPrice - 150);
  const maxPrice = suggestedPrice + 250;
  const estHours = multiplier >= 1.5 ? "Full Day (6–8 hours)" : matched.defaultTime;

  return {
    allowed: true,
    rejected: false,
    trade: matched.trade,
    suggestedPrice,
    minPrice,
    maxPrice,
    estimatedTime: estHours,
    summaryTitle: text.length > 52 ? text.slice(0, 49) + "..." : text,
    reply: `For "${text}", a verified ${matched.trade} in Ludhiana typically charges ₹${minPrice}–₹${maxPrice} (Suggested: ₹${suggestedPrice}) and takes about ${estHours}.`
  };
}

module.exports = async function handler(req, res) {
  const origin = (req.headers && req.headers.origin) || "https://www.kaamzo.site";
  res.setHeader("Access-Control-Allow-Origin", origin.includes("localhost") || origin.includes("kaamzo.site") ? origin : "https://www.kaamzo.site");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }
  if (req.method !== "POST") {
    res.statusCode = 405;
    return res.end(JSON.stringify({ success: false, error: "Method not allowed" }));
  }

  const ip =
    (req.headers && req.headers["x-forwarded-for"] && String(req.headers["x-forwarded-for"]).split(",")[0].trim()) ||
    (req.socket && req.socket.remoteAddress) ||
    "127.0.0.1";

  if (!checkRateLimit(ip)) {
    res.statusCode = 429;
    return res.end(JSON.stringify({ success: false, error: "Too many requests. Please wait a moment." }));
  }

  let body = {};
  if (req.body && typeof req.body === "object") body = req.body;
  else if (typeof req.body === "string") {
    try { body = JSON.parse(req.body || "{}"); } catch (_) {}
  }

  const result = estimateCustomJob(body.prompt || body.description || "");
  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.end(JSON.stringify({ success: true, ...result }));
};
