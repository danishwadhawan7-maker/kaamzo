const CACHE = new Map();

function isValidTranslation(out) {
  if (!out || typeof out !== "string") return false;
  if (out.includes("MYMEMORY WARNING")) return false;
  // Reject Cyrillic (e.g. Ukrainian/Russian) or CJK/Arabic garbage from crowdsourced TM
  if (/[\u0400-\u04FF\u0600-\u06FF\u4E00-\u9FFF]/.test(out)) return false;
  return true;
}

async function translateSingle(text, tl) {
  const clean = String(text || "").trim();
  if (!clean) return text;
  const cacheKey = `${tl}:${clean}`;
  if (CACHE.has(cacheKey)) return CACHE.get(cacheKey);

  // 1. Try Google translate_a/single first (accurate for Hindi & Punjabi scripts)
  try {
    const gUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(clean)}`;
    const r = await fetch(gUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (r.ok) {
      const data = await r.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const joined = data[0].map(part => (Array.isArray(part) ? part[0] : "")).join("");
        if (isValidTranslation(joined)) {
          CACHE.set(cacheKey, joined);
          return joined;
        }
      }
    }
  } catch (_) {}

  // 2. Fallback to MyMemory API (strictly rejecting non-Indic/Cyrillic results)
  try {
    const mmUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=en|${encodeURIComponent(tl)}`;
    const r = await fetch(mmUrl, { headers: { "User-Agent": "KaamzoApp/1.0" } });
    if (r.ok) {
      const data = await r.json();
      const out = data && data.responseData && data.responseData.translatedText;
      if (isValidTranslation(out)) {
        CACHE.set(cacheKey, out);
        return out;
      }
    }
  } catch (_) {}

  return clean;
}

module.exports = async function handler(req, res) {
  const origin = req.headers && req.headers.origin;
  const allowed =
    origin && (origin.includes("kaamzo.site") || /^http:\/\/localhost(:\d+)?$/.test(origin))
      ? origin
      : "https://www.kaamzo.site";
  res.setHeader("Access-Control-Allow-Origin", allowed);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed" });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const target = String(body.target || "").toLowerCase();
    const texts = Array.isArray(body.texts) ? body.texts.slice(0, 60) : [];

    if (!["hi", "pa"].includes(target)) {
      return res.status(400).json({ success: false, error: "Unsupported target language" });
    }

    const unique = [...new Set(texts.map(t => String(t || "").trim()).filter(t => t && t.length <= 400))];
    const translations = {};

    // Run in small batches of 8 concurrently for low latency
    for (let i = 0; i < unique.length; i += 8) {
      const chunk = unique.slice(i, i + 8);
      const results = await Promise.all(chunk.map(t => translateSingle(t, target)));
      chunk.forEach((src, idx) => {
        translations[src] = results[idx];
      });
    }

    return res.status(200).json({ success: true, target, translations });
  } catch (err) {
    return res.status(200).json({ success: true, translations: {}, error: err.message });
  }
};
