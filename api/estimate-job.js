"use strict";
/**
 * Kaamzo AI Custom Job Price Estimator & Conversational Bot (/api/estimate-job)
 *
 * - Understands 45+ specific Indian home & construction tasks (English + Hinglish)
 * - Parses quantities, BHK/rooms, days, worker count, and urgency
 * - Supports conversational follow-ups (e.g., "make it urgent", "for 2 days", "2 workers")
 * - Returns itemized Ludhiana/Punjab fair market price breakdown + safety screening
 */
const rateBuckets = new Map();

function checkRateLimit(ip, maxReqs = 90, windowMs = 60 * 1000) {
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

// Specific task rules checked before general trade fallbacks
const SPECIFIC_TASKS = [
  // Electrician
  { trade: "Electrician", rx: /ac\s*(gas|refill|charging)|gas\s*refill/i, label: "AC Gas Refill & Check", unitPrice: 1800, perDay: 950, hours: "1–2 hours", unitName: "AC unit" },
  { trade: "Electrician", rx: /ac\s*(install|uninstal|shift|fit)/i, label: "AC Installation / Uninstallation", unitPrice: 1200, perDay: 950, hours: "2–3 hours", unitName: "AC unit" },
  { trade: "Electrician", rx: /ac\s*(service|clean|repair|cooling|jet)/i, label: "AC Service & Repair", unitPrice: 550, perDay: 900, hours: "1–2 hours", unitName: "AC unit" },
  { trade: "Electrician", rx: /inverter|ups|battery\s*connect/i, label: "Inverter / UPS Installation", unitPrice: 650, perDay: 850, hours: "1.5–2.5 hours", unitName: "unit" },
  { trade: "Electrician", rx: /geyser\s*(install|repair|element|thermostat|fit)/i, label: "Geyser Installation / Repair", unitPrice: 500, perDay: 850, hours: "1–2 hours", unitName: "geyser" },
  { trade: "Electrician", rx: /ceiling\s*fan|pankha|exhaust\s*fan|fan\s*(install|repair|regulator|capacitor|lagwa)/i, label: "Fan Installation / Repair", unitPrice: 300, perDay: 850, hours: "45–90 mins", unitName: "fan" },
  { trade: "Electrician", rx: /switch\s*board|socket|mcb|short\s*circuit|tripping|fuse|bijli\s*board/i, label: "Switchboard / MCB / Fault Repair", unitPrice: 350, perDay: 850, hours: "1–2 hours", unitName: "board" },
  { trade: "Electrician", rx: /house\s*wiring|rewiring|full\s*wiring|earthing|cctv|meter\s*box/i, label: "Wiring / Electrical Panel Work", unitPrice: 900, perDay: 900, hours: "Half day – 1 day", unitName: "job" },
  { trade: "Electrician", rx: /chandelier|jhumar|tube\s*light|led|bulb|light\s*fit/i, label: "Light / Chandelier Fitting", unitPrice: 350, perDay: 850, hours: "1–2 hours", unitName: "fixture" },

  // Plumber
  { trade: "Plumber", rx: /water\s*tank|tank\s*clean|sintex|overhead\s*tank/i, label: "Water Tank Cleaning / Fitting", unitPrice: 700, perDay: 800, hours: "2–3 hours", unitName: "tank" },
  { trade: "Plumber", rx: /motor|submersible|water\s*pump|tullu/i, label: "Water Motor / Pump Repair", unitPrice: 550, perDay: 850, hours: "1.5–3 hours", unitName: "motor" },
  { trade: "Plumber", rx: /commode|toilet\s*seat|western\s*toilet|flush\s*tank|cistern/i, label: "Toilet / Flush Tank Repair", unitPrice: 500, perDay: 800, hours: "1.5–2.5 hours", unitName: "unit" },
  { trade: "Plumber", rx: /drain|block|choke|clog|naali|sink\s*block/i, label: "Drain / Pipe Unblocking", unitPrice: 400, perDay: 800, hours: "1–2 hours", unitName: "drain" },
  { trade: "Plumber", rx: /tap|nal|faucet|mixer|shower|sink|wash\s*basin|pipe\s*leak|leakage/i, label: "Tap / Pipe Leak Repair", unitPrice: 350, perDay: 800, hours: "1–2 hours", unitName: "point" },

  // Carpenter
  { trade: "Carpenter", rx: /cupboard|wardrobe|almirah|modular\s*kitchen|cabinet/i, label: "Cupboard / Wardrobe Carpentry", unitPrice: 900, perDay: 900, hours: "Half day – 1 day", unitName: "unit" },
  { trade: "Carpenter", rx: /bed|sofa|table|chair|furniture\s*(repair|assemble|make)/i, label: "Furniture Repair / Assembly", unitPrice: 550, perDay: 900, hours: "2–3 hours", unitName: "piece" },
  { trade: "Carpenter", rx: /door|darwaza|window|khidki|lock|handle|hinge|stopper|channel|drawer/i, label: "Door / Lock / Hinge Repair", unitPrice: 400, perDay: 900, hours: "1–2.5 hours", unitName: "door/lock" },

  // Painter
  { trade: "Painter", rx: /waterproof|damp|seepage|silan|terrace\s*coat/i, label: "Dampness & Waterproofing Coat", unitPrice: 950, perDay: 900, hours: "1 day", unitName: "area" },
  { trade: "Painter", rx: /polish|varnish|wood\s*paint|door\s*paint/i, label: "Wood Polish / Door Painting", unitPrice: 750, perDay: 850, hours: "Half day – 1 day", unitName: "unit" },
  { trade: "Painter", rx: /putty|primer|whitewash|distemper|wall\s*paint|room\s*paint|kamra\s*paint|ceiling\s*paint|paint/i, label: "Interior / Exterior Wall Painting", unitPrice: 850, perDay: 850, hours: "1 day per room", unitName: "room" },

  // Mason
  { trade: "Mason", rx: /kitchen\s*slab|counter|boundary\s*wall|pillar|lintel|concrete|rcc/i, label: "Masonry / Structural Construction", unitPrice: 1000, perDay: 950, hours: "1+ day", unitName: "section" },
  { trade: "Mason", rx: /plaster|cement|brick|crack\s*fill|wall\s*repair|floor\s*repair|mason|mistri/i, label: "Cement Plaster / Brick Repair", unitPrice: 850, perDay: 950, hours: "Half day – 1 day", unitName: "area" },

  // Tile Worker
  { trade: "Tile Worker", rx: /granite|marble|stone\s*polish|floor\s*tile|bathroom\s*tile|grout|skirting|tile/i, label: "Tile / Marble Fixing & Grouting", unitPrice: 900, perDay: 950, hours: "Half day – 1 day", unitName: "area" },

  // Welder
  { trade: "Welder", rx: /shed|tin\s*shed|roof\s*shed|fabrication|railing|staircase/i, label: "Steel Shed / Railing Fabrication", unitPrice: 1050, perDay: 950, hours: "1 day", unitName: "job" },
  { trade: "Welder", rx: /gate|grill|shutter|iron|steel|weld|lohe/i, label: "Iron Gate / Grill Welding", unitPrice: 600, perDay: 950, hours: "2–4 hours", unitName: "unit" },

  // Loader / Mover
  { trade: "Loader/Mover", rx: /shift|shifting|move|moving|relocat|tempo|truck|saman|luggage|fridge|washing\s*machine/i, label: "Home / Furniture Shifting & Loading", unitPrice: 700, perDay: 750, hours: "2–4 hours", unitName: "load" },

  // Helper
  { trade: "Construction Helper", rx: /malba|debris|clean|safai|dig|garden|helper|labour|labor|majdoor|carry|wash/i, label: "Site Helper / Debris & Cleaning", unitPrice: 600, perDay: 650, hours: "Half day – 1 day", unitName: "shift" }
];

const TRADE_DEFAULTS = {
  Electrician: { basePrice: 450, perDay: 850, defaultTime: "1–3 hours", keywords: /electric|bijli|wire|power|current|phase|panel/i },
  Plumber: { basePrice: 400, perDay: 800, defaultTime: "1–3 hours", keywords: /plumb|water|pani|pipe|bathroom|kitchen\s*sink/i },
  Carpenter: { basePrice: 500, perDay: 900, defaultTime: "2–4 hours", keywords: /carpent|wood|lakdi|ply|furniture/i },
  Painter: { basePrice: 750, perDay: 850, defaultTime: "Half day – 1 day", keywords: /paint|rang|colour|color|wall/i },
  Mason: { basePrice: 800, perDay: 950, defaultTime: "Half day – 1 day", keywords: /mason|mistri|cement|brick|eent|diwar/i },
  "Tile Worker": { basePrice: 800, perDay: 950, defaultTime: "Half day – 1 day", keywords: /tile|marble|granite|floor/i },
  Welder: { basePrice: 600, perDay: 950, defaultTime: "2–4 hours", keywords: /weld|iron|metal|steel|grill/i },
  "Loader/Mover": { basePrice: 550, perDay: 750, defaultTime: "2–4 hours", keywords: /load|move|shift|carry|helper/i },
  "Construction Helper": { basePrice: 500, perDay: 650, defaultTime: "Half day – 1 day", keywords: /helper|labour|labor|clean|site/i }
};

function parseRequestModifiers(text) {
  const lower = text.toLowerCase();

  // Explicit days ("2 days", "3 din", "full day", "half day")
  let explicitDays = null;
  const dayMatch = lower.match(/\b(\d+)\s*(day|days|din)\b/);
  if (dayMatch) explicitDays = Math.max(1, Math.min(30, Number(dayMatch[1])));
  else if (/\b(full\s*day|poora\s*din)\b/.test(lower)) explicitDays = 1;

  // BHK / rooms ("2bhk", "3 bhk", "2 rooms", "3 kamre")
  let bhk = 0;
  const bhkMatch = lower.match(/\b([1-5])\s*bhk\b/);
  if (bhkMatch) bhk = Number(bhkMatch[1]);
  const roomMatch = lower.match(/\b([1-8])\s*(room|rooms|bedroom|bedrooms|kamra|kamre|bathroom|bathrooms|wall|walls)\b/);
  const rooms = roomMatch ? Number(roomMatch[1]) : 0;

  // Workers count ("2 workers", "3 helpers")
  const workerMatch = lower.match(/\b([1-6])\s*(worker|workers|helper|helpers|plumber|electrician|painter|mason|people|bande)\b/);
  const workersCount = workerMatch ? Number(workerMatch[1]) : 1;

  // General item count ("2 fans", "2 ceiling fans", "3 kitchen taps", "4 switches")
  let itemQty = 1;
  const qtyMatch = lower.match(/\b([2-9]|1[0-5])\s+(?:[a-z]+\s+){0,2}(fan|fans|pankhe|tap|taps|nal|switch|switches|board|boards|light|lights|ac|door|doors|lock|locks|window|windows|chair|chairs|pipe|pipes|tile|tiles|unit|units|point|points)\b/);
  if (qtyMatch) itemQty = Number(qtyMatch[1]);

  // Urgency / night / emergency
  const isUrgent = /\b(urgent|emergency|asap|immediately|abhi|turant|today\s*night|tonight|night)\b/.test(lower);
  const isHalfDay = /\b(half\s*day|aadha\s*din|small|minor|chota)\b/.test(lower);

  return { explicitDays, bhk, rooms, workersCount, itemQty, isUrgent, isHalfDay };
}

function estimateCustomJob(promptText, opts = {}) {
  const raw = String(promptText || "").trim();
  const prev = opts.previousEstimate && typeof opts.previousEstimate === "object" ? opts.previousEstimate : null;
  const city = String(opts.city || "Ludhiana").trim() || "Ludhiana";

  if (raw.length < 3) {
    return {
      allowed: false,
      rejected: true,
      reason: "Tell me what work you need (e.g., 'Install 2 ceiling fans', 'Fix leaking kitchen tap', or 'Paint 2 bedrooms').",
      reply: "Tell me what work you need — like 'Install 2 ceiling fans', 'Fix leaking kitchen tap', or 'Paint 2 bedrooms' — and I'll give you an instant fair rate for " + city + "."
    };
  }

  for (const rx of INAPPROPRIATE_PATTERNS) {
    if (rx.test(raw)) {
      return {
        allowed: false,
        rejected: true,
        reason: "This job request violates Kaamzo Safety & Legal Guidelines and cannot be broadcasted.",
        reply: "Sorry, this request cannot be estimated or posted under Kaamzo Safety & Legal Guidelines."
      };
    }
  }

  // Handle conversational follow-ups on a previous estimate ("make it urgent", "for 2 days", "2 workers")
  const isFollowUpOnly =
    Boolean(prev) &&
    raw.length < 48 &&
    !/\b(fan|tap|pipe|paint|brick|tile|weld|shift|door|cupboard|ac|geyser|inverter|switch|toilet|motor|tank|clean)\b/i.test(raw) &&
    /\b(urgent|emergency|day|days|din|worker|workers|bhk|room|rooms|half|full|cheaper|discount|total|with|add|plus)\b/i.test(raw);

  const effectiveText = isFollowUpOnly && prev?.originalPrompt ? `${prev.originalPrompt} ${raw}` : raw;
  const mods = parseRequestModifiers(effectiveText);

  // Detect specific task first
  let specific = SPECIFIC_TASKS.find((t) => t.rx.test(effectiveText));
  let detectedTrade = specific ? specific.trade : null;

  if (!detectedTrade) {
    for (const [trName, cfg] of Object.entries(TRADE_DEFAULTS)) {
      if (cfg.keywords.test(effectiveText)) {
        detectedTrade = trName;
        break;
      }
    }
  }
  if (!detectedTrade && opts.trade && TRADE_DEFAULTS[opts.trade]) {
    detectedTrade = opts.trade;
  }
  if (!detectedTrade && prev?.trade && TRADE_DEFAULTS[prev.trade]) {
    detectedTrade = prev.trade;
  }
  if (!detectedTrade) {
    detectedTrade = "Construction Helper";
  }

  const tradeCfg = TRADE_DEFAULTS[detectedTrade] || TRADE_DEFAULTS["Construction Helper"];
  const taskLabel = specific ? specific.label : `${detectedTrade} Service`;
  const perDayRate = specific ? specific.perDay : tradeCfg.perDay;

  // Calculate base labor estimate cleanly
  let estimatedDays = mods.explicitDays || 1;
  let laborTotal = specific ? specific.unitPrice : tradeCfg.basePrice;

  if (mods.bhk > 0) {
    if (detectedTrade === "Painter") {
      estimatedDays = Math.max(estimatedDays, mods.bhk + 1);
      laborTotal = perDayRate * estimatedDays;
    } else if (detectedTrade === "Loader/Mover") {
      laborTotal = 750 * mods.bhk + 300;
      estimatedDays = Math.max(estimatedDays, 1);
    } else {
      estimatedDays = Math.max(estimatedDays, mods.bhk);
      laborTotal = perDayRate * estimatedDays;
    }
  } else if (mods.rooms > 1) {
    if (detectedTrade === "Painter" || detectedTrade === "Mason" || detectedTrade === "Tile Worker") {
      estimatedDays = Math.max(estimatedDays, Math.ceil(mods.rooms * 0.85));
      laborTotal = perDayRate * estimatedDays;
    } else {
      laborTotal = Math.round(laborTotal * (1 + (mods.rooms - 1) * 0.45));
    }
  } else if (mods.itemQty > 1) {
    // Additional items at 55% of first-item callout price
    laborTotal = Math.round(laborTotal + (mods.itemQty - 1) * (laborTotal * 0.55));
  }

  if (mods.explicitDays && mods.explicitDays >= 1) {
    laborTotal = Math.max(laborTotal, perDayRate * mods.explicitDays);
  }
  if (mods.isHalfDay && !mods.explicitDays) {
    laborTotal = Math.max(300, Math.round(laborTotal * 0.85));
  }
  if (mods.workersCount > 1) {
    laborTotal = Math.round(laborTotal * mods.workersCount);
  }

  const urgencyAddon = mods.isUrgent ? Math.max(150, Math.round((laborTotal * 0.15) / 50) * 50) : 0;
  const suggestedTotal = Math.round((laborTotal + urgencyAddon) / 50) * 50;
  const suggestedWage = Math.max(300, Math.round((suggestedTotal / Math.max(1, estimatedDays)) / 50) * 50);
  const minPrice = Math.max(250, Math.round((suggestedTotal * 0.85) / 50) * 50);
  const maxPrice = Math.round((suggestedTotal * 1.2) / 50) * 50;
  const platformFee = Math.round(suggestedTotal * 0.2);
  const customerTotalWithFee = suggestedTotal + platformFee;

  let estimatedTime = specific ? specific.hours : tradeCfg.defaultTime;
  if (estimatedDays > 1) {
    estimatedTime = `${estimatedDays} days (~${estimatedDays * 7} hrs)`;
  } else if (suggestedTotal >= perDayRate) {
    estimatedTime = "Full Day (6–8 hours)";
  }

  const breakdown = [
    {
      label: `${taskLabel}${mods.itemQty > 1 ? ` (×${mods.itemQty})` : ""}${mods.bhk ? ` (${mods.bhk} BHK)` : mods.rooms > 1 ? ` (${mods.rooms} rooms)` : ""}${mods.workersCount > 1 ? ` · ${mods.workersCount} workers` : ""}`,
      amount: Math.round(laborTotal / 50) * 50
    }
  ];
  if (urgencyAddon > 0) {
    breakdown.push({ label: "Urgent / same-day priority", amount: urgencyAddon });
  }

  const tips = [
    `Fair ${city} rate range: ₹${minPrice}–₹${maxPrice} (materials/spare parts billed separately at actuals).`,
    "Pay only after work is completed via Razorpay UPI."
  ];

  const followUps = [];
  if (!mods.isUrgent) followUps.push("Make it urgent");
  if (estimatedDays === 1) followUps.push("Change to 2 days");
  if (mods.workersCount === 1) followUps.push("Need 2 workers");

  const reply = `Estimated for **${taskLabel}** (${detectedTrade}) in ${city}: **₹${suggestedTotal}** (fair range ₹${minPrice}–₹${maxPrice}, ~${estimatedTime}).`;

  return {
    allowed: true,
    rejected: false,
    trade: detectedTrade,
    taskLabel,
    originalPrompt: effectiveText,
    suggestedPrice: suggestedTotal,
    suggestedWage,
    estimatedDays,
    workersCount: mods.workersCount,
    isUrgent: mods.isUrgent,
    minPrice,
    maxPrice,
    platformFee,
    customerTotalWithFee,
    estimatedTime,
    breakdown,
    tips,
    followUps,
    summaryTitle: raw.length > 52 ? raw.slice(0, 49) + "..." : raw,
    summary: reply.replace(/\*\*/g, ""),
    explanation: reply.replace(/\*\*/g, ""),
    reply: reply.replace(/\*\*/g, "")
  };
}

function readRawBody(req) {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 100000) req.destroy();
    });
    req.on("end", () => resolve(data));
    req.on("error", () => resolve(""));
  });
}

module.exports = async function handler(req, res) {
  const origin = (req.headers && req.headers.origin) || "https://www.kaamzo.site";
  res.setHeader(
    "Access-Control-Allow-Origin",
    origin.includes("localhost") || origin.includes("kaamzo.site") ? origin : "https://www.kaamzo.site"
  );
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    return res.end();
  }
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.end(JSON.stringify({ success: false, error: "Method not allowed" }));
  }

  const ip =
    (req.headers && req.headers["x-forwarded-for"] && String(req.headers["x-forwarded-for"]).split(",")[0].trim()) ||
    (req.socket && req.socket.remoteAddress) ||
    "127.0.0.1";

  if (!checkRateLimit(ip)) {
    res.statusCode = 429;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    return res.end(JSON.stringify({ success: false, error: "Too many requests. Please wait a moment." }));
  }

  let body = {};
  if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
    body = req.body;
  } else if (typeof req.body === "string") {
    try {
      body = JSON.parse(req.body || "{}");
    } catch (_) {}
  } else {
    const raw = await readRawBody(req);
    try {
      body = JSON.parse(raw || "{}");
    } catch (_) {}
  }

  const result = estimateCustomJob(body.prompt || body.description || "", {
    trade: body.trade,
    city: body.city,
    previousEstimate: body.previousEstimate
  });

  res.statusCode = 200;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  return res.end(JSON.stringify({ success: true, ...result }));
};
