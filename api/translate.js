const CACHE = new Map();

function isValidTranslation(out) {
  if (!out || typeof out !== "string") return false;
  if (out.includes("MYMEMORY WARNING")) return false;
  // Reject UTF-8-as-Latin-1 mojibake (e.g. "à¨—à©±à¨²à¨¬à¨¾à¨¤" from MyMemory) and replacement chars
  if (/[àÀÃÂ][¨©¤¥\x80-\xBF]|Ã[\x80-\xBF]|â€|\uFFFD/.test(out)) return false;
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

async function translateBatchFast(texts, tl) {
  const uncached = [];
  const results = {};

  for (const raw of texts) {
    const clean = String(raw || "").trim();
    if (!clean) continue;
    const cacheKey = `${tl}:${clean}`;
    if (CACHE.has(cacheKey)) {
      results[clean] = CACHE.get(cacheKey);
    } else {
      uncached.push(clean);
    }
  }

  if (uncached.length === 0) return results;

  // Fast Path: Join up to 25 strings with " ||| " or newline in a single Google GTX request (~150ms total)
  const SEP = "\n";
  for (let i = 0; i < uncached.length; i += 25) {
    const slice = uncached.slice(i, i + 25);
    let batchResolved = false;
    if (slice.length > 1 && slice.every(s => !s.includes("\n"))) {
      try {
        const joinedPayload = slice.join(SEP);
        const gUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(joinedPayload)}`;
        const r = await fetch(gUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
        if (r.ok) {
          const data = await r.json();
          if (Array.isArray(data) && Array.isArray(data[0])) {
            const fullTranslated = data[0].map(part => (Array.isArray(part) ? part[0] : "")).join("");
            const lines = fullTranslated.split(/\r?\n/);
            if (lines.length === slice.length && isValidTranslation(fullTranslated)) {
              slice.forEach((src, idx) => {
                const tr = (lines[idx] || "").trim() || src;
                CACHE.set(`${tl}:${src}`, tr);
                results[src] = tr;
              });
              batchResolved = true;
            }
          }
        }
      } catch (_) {}
    }

    if (!batchResolved) {
      const fallbackRes = await Promise.all(slice.map(t => translateSingle(t, tl)));
      slice.forEach((src, idx) => {
        results[src] = fallbackRes[idx];
      });
    }
  }

  return results;
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
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ success: false, error: "Method not allowed" });

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const target = String(body.target || "").toLowerCase();
    const texts = Array.isArray(body.texts) ? body.texts.slice(0, 80) : [];

    if (!["hi", "pa"].includes(target)) {
      return res.status(400).json({ success: false, error: "Unsupported target language" });
    }

    const unique = [...new Set(texts.map(t => String(t || "").trim()).filter(t => t && t.length <= 400))];
    const translations = await translateBatchFast(unique, target);

    return res.status(200).json({ success: true, target, translations });
  } catch (err) {
    return res.status(200).json({ success: true, translations: {}, error: err.message });
  }
};
