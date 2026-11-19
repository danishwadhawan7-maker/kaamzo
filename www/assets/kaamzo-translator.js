(function() {
  if (window.__kaamzoFullTranslatorLoaded) return;
  window.__kaamzoFullTranslatorLoaded = true;

  var STORAGE_KEY = 'kaamzo_language';
  var CACHE_KEY = 'kaamzo_i18n_cache_v4';
  try { localStorage.removeItem('kaamzo_i18n_cache_v3'); } catch (e) {}

  // Instant built-in dictionary for zero-latency UI switching across Home, Customer, Worker, Admin, & Survey
  var GLOSSARY = {
    hi: {
      "Switch Role": "भूमिका बदलें",
      "Install App Extension": "ऐप एक्सटेंशन इंस्टॉल करें",
      "Audio": "ऑडियो",
      "Find Workers": "कामगार खोजें",
      "My Bookings": "मेरी बुकिंग",
      "Support": "सहायता",
      "Post a Job": "काम पोस्ट करें",
      "Verify Gmail": "ईमेल सत्यापित करें",
      "Sign Out": "लॉग आउट",
      "Sign In": "लॉग इन",
      "Verified Local Workforce": "सत्यापित स्थानीय कामगार",
      "Find Trusted": "भरोसेमंद खोजें",
      "Workers.": "कामगार।",
      "✓ KYC Pros": "✓ KYC सत्यापित",
      "Hire Local Pros With Dignity.": "सम्मान के साथ स्थानीय कारीगरों को काम पर रखें।",
      "Book Aadhaar & Face-ID verified Electricians, Plumbers, Carpenters, Painters, and Masons nearby — 20% flat platform fee, 100% UPI Escrow.": "आधार और फेस-आईडी सत्यापित इलेक्ट्रीशियन, प्लंबर, बढ़ई, पेंटर और राजमिस्त्री बुक करें — 20% पारदर्शी शुल्क, 100% सुरक्षित UPI पेमेंट।",
      "⚡ Avg. 6 Min Match • 20% Transparent Platform Fee • 100% UPI Escrow Protected": "⚡ औसतन 6 मिनट में मिलान • 20% पारदर्शी शुल्क • 100% सुरक्षित UPI पेमेंट",
      "20% Flat Fee": "20% शुल्क",
      "80% Net Payout (20% Fee)": "80% शुद्ध भुगतान (20% शुल्क)",
      "Transparent 20% platform fee • 80% net daily wage settled via UPI": "पारदर्शी 20% प्लेटफॉर्म शुल्क • 80% शुद्ध दैनिक मज़दूरी UPI से प्राप्त करें",
      "Search trade, skill, or worker (e.g. Electrician, Plumber)...": "काम, कौशल या कारीगर खोजें (जैसे इलेक्ट्रीशियन, प्लंबर)...",
      "Search": "खोजें",
      "All Pros": "सभी कारीगर",
      "Electrician": "इलेक्ट्रीशियन",
      "Plumber": "प्लंबर",
      "Carpenter": "बढ़ई",
      "Painter": "पेंटर",
      "Mason": "राजमिस्त्री",
      "Cleaner": "सफाईकर्मी",
      "Helper": "हेल्पर",
      "Post a Job Broadcast": "नया काम पोस्ट करें",
      "Scan Worker Badge": "कामगार कार्ड स्कैन करें",
      "Quick Tools": "त्वरित उपकरण",
      "Live ETA & OTP": "लाइव समय और OTP",
      "Crew & Rebook": "टीम और दोबारा बुकिंग",
      "Khata & Gate-Pass": "खाता और गेट-पास",
      "SOS Check-In": "आपातकालीन SOS",
      "Popular Services": "लोकप्रिय सेवाएं",
      "Filters": "फ़िल्टर",
      "Reset": "रीसेट करें",
      "Service Trade": "काम की श्रेणी",
      "Location / Region": "इलाका / क्षेत्र",
      "Live GPS": "लाइव GPS",
      "Investor Pitch": "निवेशक प्रस्तुति",
      "Terms of Service": "सेवा की शर्तें",
      "Active Work Assignments": "सक्रिय काम असाइनमेंट",
      "Filter by Trade Categories": "श्रेणी के अनुसार काम छाँटें",
      "All Trades": "सभी काम",
      "Find Jobs": "काम खोजें",
      "Job History": "पुराना काम",
      "Wallet & UPI": "बटुआ और UPI",
      "Profile & KYC": "प्रोफ़ाइल और KYC",
      "Accept & Continue": "स्वीकार करें और आगे बढ़ें",
      "No Matching Jobs in Current Filter": "इस फ़िल्टर में कोई काम नहीं मिला",
      "Ludhiana Live Customer Heatmap": "लुधियाना लाइव ग्राहक नक्शा",
      "Daily-Wage Worker (Mason / Helper)": "दिहाड़ी मजदूर (राजमिस्त्री / हेल्पर)",
      "Skilled Tradesperson (Electrician / Plumber / Carpenter)": "कुशल कारीगर (इलेक्ट्रीशियन / प्लंबर / बढ़ई)",
      "Customer": "ग्राहक",
      "Site Supervisor / Small Contractor": "साइट सुपरवाइज़र / ठेकेदार",
      "Questions": "प्रश्न",
      "Responses": "प्रतिक्रियाएं",
      "Summary": "सारांश",
      "Question": "प्रश्नवार",
      "Individual": "व्यक्तिगत",
      "Your Role": "आपकी भूमिका",
      "Full Name": "पूरा नाम",
      "City / Region": "शहर / क्षेत्र",
      "Submit": "जमा करें",
      "Clear form": "फ़ॉर्म साफ़ करें",
      "← Back to Kaamzo": "← कामज़ो पर वापस जाएं",
      "Download responses (.csv)": "रिपोर्ट डाउनलोड करें (.csv)",
      "Accepting responses": "प्रतिक्रियाएं स्वीकार की जा रही हैं"
    },
    pa: {
      "Switch Role": "ਭੂਮਿਕਾ ਬਦਲੋ",
      "Install App Extension": "ਐਪ ਐਕਸਟੈਂਸ਼ਨ ਇੰਸਟਾਲ ਕਰੋ",
      "Audio": "ਆਡੀਓ",
      "Find Workers": "ਕਾਮੇ ਲੱਭੋ",
      "My Bookings": "ਮੇਰੀਆਂ ਬੁਕਿੰਗਾਂ",
      "Support": "ਮਦਦ",
      "Post a Job": "ਕੰਮ ਪੋਸਟ ਕਰੋ",
      "Verify Gmail": "ਈਮੇਲ ਤਸਦੀਕ ਕਰੋ",
      "Sign Out": "ਲੌਗ ਆਊਟ",
      "Sign In": "ਲੌਗ ਇਨ",
      "Verified Local Workforce": "ਤਸਦੀਕਸ਼ੁਦਾ ਸਥਾਨਕ ਕਾਮੇ",
      "Find Trusted": "ਭਰੋਸੇਮੰਦ ਲੱਭੋ",
      "Workers.": "ਕਾਮੇ।",
      "✓ KYC Pros": "✓ KYC ਤਸਦੀਕਸ਼ੁਦਾ",
      "Hire Local Pros With Dignity.": "ਸਤਿਕਾਰ ਨਾਲ ਨੇੜਲੇ ਮਾਹਿਰ ਕਾਮੇ ਰੱਖੋ।",
      "Book Aadhaar & Face-ID verified Electricians, Plumbers, Carpenters, Painters, and Masons nearby — 20% flat platform fee, 100% UPI Escrow.": "ਆਧਾਰ ਅਤੇ ਫੇਸ-ਆਈਡੀ ਤਸਦੀਕਸ਼ੁਦਾ ਇਲੈਕਟ੍ਰੀਸ਼ੀਅਨ, ਪਲੰਬਰ, ਤਰਖਾਣ, ਪੇਂਟਰ ਅਤੇ ਰਾਜਮਿਸਤਰੀ ਬੁੱਕ ਕਰੋ — 20% ਪਾਰਦਰਸ਼ੀ ਫੀਸ, 100% ਸੁਰੱਖਿਅਤ UPI ਭੁਗਤਾਨ।",
      "⚡ Avg. 6 Min Match • 20% Transparent Platform Fee • 100% UPI Escrow Protected": "⚡ ਔਸਤ 6 ਮਿੰਟ ਵਿੱਚ ਮੈਚ • 20% ਪਾਰਦਰਸ਼ੀ ਫੀਸ • 100% ਸੁਰੱਖਿਅਤ UPI ਭੁਗਤਾਨ",
      "20% Flat Fee": "20% ਫੀਸ",
      "80% Net Payout (20% Fee)": "80% ਸ਼ੁੱਧ ਭੁਗਤਾਨ (20% ਫੀਸ)",
      "Transparent 20% platform fee • 80% net daily wage settled via UPI": "ਪਾਰਦਰਸ਼ੀ 20% ਪਲੇਟਫਾਰਮ ਫੀਸ • 80% ਸ਼ੁੱਧ ਦਿਹਾੜੀ UPI ਰਾਹੀਂ ਪ੍ਰਾਪਤ ਕਰੋ",
      "Search trade, skill, or worker (e.g. Electrician, Plumber)...": "ਕੰਮ, ਹੁਨਰ ਜਾਂ ਕਾਮਾ ਲੱਭੋ (ਜਿਵੇਂ ਇਲੈਕਟ੍ਰੀਸ਼ੀਅਨ, ਪਲੰਬਰ)...",
      "Search": "ਖੋਜੋ",
      "All Pros": "ਸਾਰੇ ਕਾਮੇ",
      "Electrician": "ਇਲੈਕਟ੍ਰੀਸ਼ੀਅਨ",
      "Plumber": "ਪਲੰਬਰ",
      "Carpenter": "ਤਰਖਾਣ",
      "Painter": "ਪੇਂਟਰ",
      "Mason": "ਰਾਜਮਿਸਤਰੀ",
      "Cleaner": "ਸਫ਼ਾਈ ਕਰਮਚਾਰੀ",
      "Helper": "ਹੈਲਪਰ",
      "Post a Job Broadcast": "ਨਵਾਂ ਕੰਮ ਪੋਸਟ ਕਰੋ",
      "Scan Worker Badge": "ਕਾਮਾ ਕਾਰਡ ਸਕੈਨ ਕਰੋ",
      "Quick Tools": "ਤੁਰੰਤ ਟੂਲ",
      "Live ETA & OTP": "ਲਾਈਵ ਸਮਾਂ ਅਤੇ OTP",
      "Crew & Rebook": "ਟੀਮ ਅਤੇ ਦੁਬਾਰਾ ਬੁਕਿੰਗ",
      "Khata & Gate-Pass": "ਖਾਤਾ ਅਤੇ ਗੇਟ-ਪਾਸ",
      "SOS Check-In": "ਐਮਰਜੈਂਸੀ SOS",
      "Popular Services": "ਮਸ਼ਹੂਰ ਸੇਵਾਵਾਂ",
      "Filters": "ਫਿਲਟਰ",
      "Reset": "ਰੀਸੈੱਟ",
      "Service Trade": "ਕੰਮ ਦੀ ਸ਼੍ਰੇਣੀ",
      "Location / Region": "ਇਲਾਕਾ / ਖੇਤਰ",
      "Live GPS": "ਲਾਈਵ GPS",
      "Investor Pitch": "ਨਿਵੇਸ਼ਕ ਪੇਸ਼ਕਾਰੀ",
      "Terms of Service": "ਸੇਵਾ ਦੀਆਂ ਸ਼ਰਤਾਂ",
      "Active Work Assignments": "ਚੱਲ ਰਹੇ ਕੰਮ",
      "Filter by Trade Categories": "ਸ਼੍ਰੇਣੀ ਅਨੁਸਾਰ ਕੰਮ ਛਾਂਟੋ",
      "All Trades": "ਸਾਰੇ ਕੰਮ",
      "Find Jobs": "ਕੰਮ ਲੱਭੋ",
      "Job History": "ਪੁਰਾਣਾ ਕੰਮ",
      "Wallet & UPI": "ਵਾਲਿਟ ਅਤੇ UPI",
      "Profile & KYC": "ਪ੍ਰੋਫਾਈਲ ਅਤੇ KYC",
      "Accept & Continue": "ਮਨਜ਼ੂਰ ਕਰੋ ਅਤੇ ਅੱਗੇ ਵਧੋ",
      "No Matching Jobs in Current Filter": "ਇਸ ਫਿਲਟਰ ਵਿੱਚ ਕੋਈ ਕੰਮ ਨਹੀਂ ਮਿਲਿਆ",
      "Ludhiana Live Customer Heatmap": "ਲੁਧਿਆਣਾ ਲਾਈਵ ਗਾਹਕ ਨਕਸ਼ਾ",
      "Daily-Wage Worker (Mason / Helper)": "ਦਿਹਾੜੀਦਾਰ ਕਾਮਾ (ਰਾਜਮਿਸਤਰੀ / ਹੈਲਪਰ)",
      "Skilled Tradesperson (Electrician / Plumber / Carpenter)": "ਹੁਨਰਮੰਦ ਕਾਰੀਗਰ (ਇਲੈਕਟ੍ਰੀਸ਼ੀਅਨ / ਪਲੰਬਰ / ਤਰਖਾਣ)",
      "Customer": "ਗਾਹਕ",
      "Site Supervisor / Small Contractor": "ਸਾਈਟ ਸੁਪਰਵਾਈਜ਼ਰ / ਠੇਕੇਦਾਰ",
      "Questions": "ਸਵਾਲ",
      "Responses": "ਜਵਾਬ",
      "Summary": "ਸੰਖੇਪ",
      "Question": "ਸਵਾਲ ਅਨੁਸਾਰ",
      "Individual": "ਵਿਅਕਤੀਗਤ",
      "Your Role": "ਤੁਹਾਡੀ ਭੂਮਿਕਾ",
      "Full Name": "ਪੂਰਾ ਨਾਮ",
      "City / Region": "ਸ਼ਹਿਰ / ਇਲਾਕਾ",
      "Submit": "ਜਮ੍ਹਾਂ ਕਰੋ",
      "Clear form": "ਫਾਰਮ ਸਾਫ਼ ਕਰੋ",
      "← Back to Kaamzo": "← ਕਾਮਜ਼ੋ 'ਤੇ ਵਾਪਸ ਜਾਓ",
      "Download responses (.csv)": "ਜਵਾਬ ਡਾਊਨਲੋਡ ਕਰੋ (.csv)",
      "Accepting responses": "ਜਵਾਬ ਸਵੀਕਾਰ ਕੀਤੇ ਜਾ ਰਹੇ ਹਨ"
    }
  };

  var persistentCache = { hi: {}, pa: {} };
  try {
    var rawCache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
    if (rawCache && typeof rawCache === 'object') {
      if (rawCache.hi) persistentCache.hi = rawCache.hi;
      if (rawCache.pa) persistentCache.pa = rawCache.pa;
    }
  } catch (e) {}

  function savePersistentCache() {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(persistentCache));
    } catch (e) {}
  }

  // Track original English text cleanly without replacing DOM Text nodes (100% React-safe!)
  var origTextMap = new WeakMap();
  var origPlaceholderMap = new WeakMap();
  var inFlight = { hi: new Set(), pa: new Set() };
  var currentLang = 'en';
  var sweepTimer = null;
  var isApplying = false;

  function getActiveLang() {
    try {
      var v = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('kaamzo_language_v8') || 'en';
      return (v === 'hi' || v === 'pa') ? v : 'en';
    } catch (e) {
      return 'en';
    }
  }

  function shouldSkipString(str) {
    if (!str) return true;
    var s = str.trim();
    if (!s || s.length < 2 || s.length > 380) return true;
    // Skip pure brand names, short codes, numbers, prices, emails, URLs, emojis-only
    if (/^(kaamzo\.?|india|en|hi|pa|qr|otp|upi|gps|kmz-[a-z0-9-]+|pb-[0-9a-z-]+)$/i.test(s)) return true;
    if (/^[\d\s₹$%.,:+/\-()★•→↗←✕✓🔒⚡👷‍♂️📒🚨📍🔊💰🔥🔴🟡🟢🔵🗺️🔍⏱📜📥🖨️🏦🛠️🎉🛵🔒]+$/.test(s)) return true;
    if (/^https?:\/\//i.test(s) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)) return true;
    // Must contain at least one ASCII Latin letter to warrant English->HI/PA translation
    if (!/[a-zA-Z]{2,}/.test(s)) return true;
    // Skip strings already predominantly Devanagari or Gurmukhi
    if (/[\u0900-\u097F\u0A00-\u0A7F]/.test(s) && !/[a-zA-Z]{4,}/.test(s)) return true;
    return false;
  }

  function lookupTranslation(orig, lang) {
    var trimmed = orig.trim();
    if (GLOSSARY[lang] && GLOSSARY[lang][trimmed]) return GLOSSARY[lang][trimmed];
    if (persistentCache[lang] && persistentCache[lang][trimmed]) return persistentCache[lang][trimmed];
    return null;
  }

  function formatPreservingWhitespace(orig, translated) {
    var lead = (orig.match(/^\s*/) || [''])[0];
    var trail = (orig.match(/\s*$/) || [''])[0];
    return lead + translated + trail;
  }

  function isSkippedElement(el) {
    if (!el || el.nodeType !== 1) return false;
    var tag = (el.tagName || '').toUpperCase();
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'TEXTAREA' || tag === 'INPUT' || tag === 'SVG' || tag === 'CODE' || tag === 'PRE') return true;
    if (el.closest && el.closest('.notranslate, [data-no-translate], [aria-label="Language selection"], #kaamzo-gatepass-card')) {
      if (el.closest('.notranslate, [data-no-translate], [aria-label="Language selection"]')) return true;
    }
    return false;
  }

  function hasIndicScript(s) {
    return /[\u0900-\u097F\u0A00-\u0A7F]/.test(s || '');
  }

  function collectAndApply(lang) {
    if (!document.body) return;
    isApplying = true;
    var missing = [];
    var seenMissing = new Set();

    try {
      // 1. Walk all visible text nodes safely
      var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
      var node;
      while ((node = walker.nextNode())) {
        var parent = node.parentElement;
        if (!parent || isSkippedElement(parent)) continue;

        var curVal = node.nodeValue || '';
        if (!curVal.trim()) continue;

        if (!origTextMap.has(node)) {
          // Never store Hindi/Punjabi text rendered natively by React as the English source
          if (!hasIndicScript(curVal)) {
            origTextMap.set(node, curVal);
          }
        } else {
          // If React updated the node text to a new English value while in HI/PA mode, update original map
          var prevOrig = origTextMap.get(node);
          if (lang !== 'en' && !hasIndicScript(curVal) && /[a-zA-Z]{3,}/.test(curVal)) {
            var knownHi = lookupTranslation(prevOrig, 'hi');
            var knownPa = lookupTranslation(prevOrig, 'pa');
            if (curVal.trim() !== prevOrig.trim() && (!knownHi || curVal.trim() !== knownHi) && (!knownPa || curVal.trim() !== knownPa)) {
              origTextMap.set(node, curVal);
            }
          }
        }

        if (!origTextMap.has(node)) continue;
        var orig = origTextMap.get(node);
        if (lang === 'en') {
          if (!hasIndicScript(orig) && node.nodeValue !== orig && hasIndicScript(node.nodeValue)) {
            node.nodeValue = orig;
          }
          continue;
        }

        if (shouldSkipString(orig)) continue;
        var tr = lookupTranslation(orig, lang);
        if (tr) {
          var nextStr = formatPreservingWhitespace(orig, tr);
          if (node.nodeValue !== nextStr) node.nodeValue = nextStr;
        } else {
          var key = orig.trim();
          if (!seenMissing.has(key) && !inFlight[lang].has(key)) {
            seenMissing.add(key);
            missing.push(key);
          }
        }
      }

      // 2. Translate input/textarea placeholders
      var inputs = document.querySelectorAll('input[placeholder], textarea[placeholder]');
      for (var i = 0; i < inputs.length; i++) {
        var inp = inputs[i];
        if (!origPlaceholderMap.has(inp)) {
          origPlaceholderMap.set(inp, inp.placeholder || '');
        }
        var origPh = origPlaceholderMap.get(inp);
        if (lang === 'en') {
          if (inp.placeholder !== origPh) inp.placeholder = origPh;
          continue;
        }
        if (shouldSkipString(origPh)) continue;
        var trPh = lookupTranslation(origPh, lang);
        if (trPh) {
          if (inp.placeholder !== trPh) inp.placeholder = trPh;
        } else {
          var phKey = origPh.trim();
          if (!seenMissing.has(phKey) && !inFlight[lang].has(phKey)) {
            seenMissing.add(phKey);
            missing.push(phKey);
          }
        }
      }
    } finally {
      isApplying = false;
    }

    // 3. Batch-fetch any unseen strings from our first-party /api/translate endpoint
    if (lang !== 'en' && missing.length > 0) {
      fetchMissingBatches(missing, lang);
    }
  }

  function fetchMissingBatches(items, lang) {
    var chunks = [];
    for (var i = 0; i < items.length; i += 35) {
      chunks.push(items.slice(i, i + 35));
    }
    var apiBase = '';
    try {
      if (window.location.protocol === 'capacitor:' || (window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform())) {
        apiBase = 'https://www.kaamzo.site';
      }
    } catch (e) {}

    chunks.forEach(function(chunk) {
      chunk.forEach(function(k) { inFlight[lang].add(k); });
      fetch(apiBase + '/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: lang, texts: chunk })
      })
        .then(function(res) { return res.ok ? res.json() : null; })
        .then(function(data) {
          if (data && data.translations) {
            var changed = false;
            Object.keys(data.translations).forEach(function(src) {
              var dst = data.translations[src];
              if (dst && typeof dst === 'string' && !/[\u0400-\u04FF\u0600-\u06FF\u4E00-\u9FFF]/.test(dst)) {
                persistentCache[lang][src] = dst;
                changed = true;
              }
            });
            if (changed) {
              savePersistentCache();
              if (getActiveLang() === lang) collectAndApply(lang);
            }
          }
        })
        .catch(function() {})
        .finally(function() {
          chunk.forEach(function(k) { inFlight[lang].delete(k); });
        });
    });
  }

  function scheduleSweep() {
    if (sweepTimer) clearTimeout(sweepTimer);
    sweepTimer = setTimeout(function() {
      var lang = getActiveLang();
      currentLang = lang;
      if (lang !== 'en') collectAndApply(lang);
    }, 90);
  }

  window.kaamzoApplyFullLanguage = function(lang) {
    var target = (lang === 'hi' || lang === 'pa') ? lang : 'en';
    currentLang = target;
    try { document.documentElement.lang = target; } catch (e) {}
    collectAndApply(target);
  };

  // Intercept localStorage.setItem so switching EN <-> HI <-> PA in React applies cleanly AFTER React commits!
  try {
    var origSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, val) {
      origSetItem.apply(this, arguments);
      if (this === window.localStorage && (key === STORAGE_KEY || key === 'kaamzo_language_v8')) {
        setTimeout(function() {
          window.kaamzoApplyFullLanguage(val);
        }, 120);
      }
    };
  } catch (e) {}

  // Observe dynamic React DOM updates (tab switches, modals, route changes)
  function startObserver() {
    if (!document.body || typeof MutationObserver === 'undefined') return;
    var observer = new MutationObserver(function() {
      if (isApplying) return;
      if (getActiveLang() !== 'en') scheduleSweep();
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    // Apply immediately if user already had HI or PA selected
    var initial = getActiveLang();
    if (initial !== 'en') {
      collectAndApply(initial);
      setTimeout(function() { collectAndApply(getActiveLang()); }, 500);
      setTimeout(function() { collectAndApply(getActiveLang()); }, 1500);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserver);
  } else {
    startObserver();
  }
})();
