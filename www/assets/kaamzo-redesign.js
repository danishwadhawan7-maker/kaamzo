/* Kaamzo Pixel-Faithful Redesign — Core Runtime, Exact SVGs, Router, Global Chrome & Modals
   Preserves 100% of existing SSO, Firebase Auth, MongoDB /api/db, OTP, GPS, and Escrow logic via window.__KZ_CTX__.
*/
(function () {
  "use strict";

  const KZ = (window.__KZ_REDESIGN__ = window.__KZ_REDESIGN__ || {
    views: {},
    utils: {},
    components: {},
  });

  // Lazy bridges (kaamzo-redesign.js executes before module index-v30.js)
  const getCtx = () => window.__KZ_CTX__;
  const getReact = () => window.__KZ_CTX__.React;
  const h = (...args) => window.__KZ_CTX__.React.createElement(...args);
  const Frag = (...children) =>
    window.__KZ_CTX__.React.createElement(window.__KZ_CTX__.Fragment, null, ...children);
  const useApp = () => window.__KZ_CTX__.useApp();
  const useState = (init) => getReact().useState(init);
  const useEffect = (fn, deps) => getReact().useEffect(fn, deps);
  const useRef = (init) => getReact().useRef(init);
  const useMemo = (fn, deps) => getReact().useMemo(fn, deps);
  const useCallback = (fn, deps) => getReact().useCallback(fn, deps);

  // =========================================================================
  // 1. EXACT DESIGN CONSTANTS, LUDHIANA TRADES & RATES, HELPERS
  // =========================================================================
  const ICON_PATHS = {
    bolt: "M13 2 3 14h9l-1 8 10-12h-9l1-8z",
    wrench:
      "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z",
    brush: "M18 2l4 4-10 10H8v-4L18 2z M8 16l-5 5",
    hammer:
      "M15 12l-8.5 8.5a2.12 2.12 0 1 1-3-3L12 9 M17.64 15 22 10.64 M20.91 11.7l-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91",
    brick: "M3 4h18v16H3z M3 9h18 M3 15h18 M9 4v5 M15 9v6 M9 15v5",
    tile: "M3 3h8v8H3z M13 3h8v8h-8z M3 13h8v8H3z M13 13h8v8h-8z",
    flame: "M12 2c1 4 5 6 5 11a5 5 0 0 1-10 0c0-3 2-4 2-7 2 1 3 3 3 5 0-3 0-6 0-9z",
    truck:
      "M1 3h15v13H1z M16 8h4l3 3v5h-7z M5.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z M18.5 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
    user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4",
    lock: "M5 11h14v10H5z M8 11V7a4 4 0 0 1 8 0v4",
    pin: "M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z M12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
    alert: "M12 9v4 M12 17h.01 M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
    search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z M20 20l-3.5-3.5",
    arrowR: "M5 12h14 M13 6l6 6-6 6",
    arrowL: "M19 12H5 M11 6l-6 6 6 6",
    arrowNE: "M7 17 17 7 M9 7h8v8",
    arrowDown: "M12 5v14 M6 13l6 6 6-6",
    speaker: "M11 5 6 9H2v6h4l5 4z M15.5 8.5a5 5 0 0 1 0 7 M19 5a10 10 0 0 1 0 14",
    help: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3 M12 17h.01",
    settings:
      "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
    phone:
      "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z",
    chat: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
    qr: "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h3v3h-3z M19 14h2v2h-2z M14 19h2v2h-2z M18 18h3v3h-3z",
    award: "M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M8.21 13.89 7 23l5-3 5 3-1.21-9.12",
    check: "M20 6 9 17l-5-5",
    x: "M18 6 6 18 M6 6l12 12",
    camera: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z M12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    calendar: "M3 4h18v18H3z M16 2v4 M8 2v4 M3 10h18",
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    sun: "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z M12 1v2 M12 21v2 M4.22 4.22l1.42 1.42 M18.36 18.36l1.42 1.42 M1 12h2 M21 12h2 M4.22 19.78l1.42-1.42 M18.36 5.64l1.42-1.42",
    moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
    radar: "M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0 M16.24 7.76a6 6 0 0 1 0 8.49 M7.76 16.24a6 6 0 0 1 0-8.49 M19.07 4.93a10 10 0 0 1 0 14.14 M4.93 19.07a10 10 0 0 1 0-14.14",
    wallet: "M20 7H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z M16 14h.01 M4 7V5a2 2 0 0 1 2-2h11",
    plus: "M12 5v14 M5 12h14",
    home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
    briefcase: "M2 7h20v14H2z M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2",
  };

  const TRADES = [
    {
      id: "Electrician",
      name: "Electrician",
      hi: "बिजली मिस्त्री",
      desc: "Wiring, MCB & fans",
      rate: 850,
      icon: ICON_PATHS.bolt,
      bg: "#FFF0BF",
      fg: "#6B4600",
    },
    {
      id: "Plumber",
      name: "Plumber",
      hi: "प्लम्बर",
      desc: "Pipes, taps & motors",
      rate: 800,
      icon: ICON_PATHS.wrench,
      bg: "#DCEBFF",
      fg: "#123A6B",
    },
    {
      id: "Carpenter",
      name: "Carpenter",
      hi: "बढ़ई",
      desc: "Woodwork & doors",
      rate: 850,
      icon: ICON_PATHS.hammer,
      bg: "#F6E2D2",
      fg: "#6B3612",
    },
    {
      id: "Painter",
      name: "Painter",
      hi: "पेंटर",
      desc: "Wall painting",
      rate: 850,
      icon: ICON_PATHS.brush,
      bg: "#FBE0EE",
      fg: "#6B1A45",
    },
    {
      id: "Mason",
      name: "Mason",
      hi: "राजमिस्त्री",
      desc: "Brickwork & plaster",
      rate: 900,
      icon: ICON_PATHS.brick,
      bg: "#EDE6DA",
      fg: "#4A3A24",
    },
    {
      id: "Tile Worker",
      name: "Tile worker",
      hi: "टाइल मिस्त्री",
      desc: "Flooring & tiles",
      rate: 950,
      icon: ICON_PATHS.tile,
      bg: "#DDF2EC",
      fg: "#11524A",
    },
    {
      id: "Welder",
      name: "Welder",
      hi: "वेल्डर",
      desc: "Metal & fabrication",
      rate: 950,
      icon: ICON_PATHS.flame,
      bg: "#FFE1D2",
      fg: "#7A2E0E",
    },
    {
      id: "Loader / Mover",
      name: "Loader / mover",
      hi: "लोडर",
      desc: "Shifting goods",
      rate: 750,
      icon: ICON_PATHS.truck,
      bg: "#E3E0FF",
      fg: "#2E2470",
    },
    {
      id: "Helper",
      name: "Helper",
      hi: "सहायक",
      desc: "General labour",
      rate: 600,
      icon: ICON_PATHS.user,
      bg: "#E6F1D6",
      fg: "#2F4A12",
    },
  ];

  const LUDHIANA_AREAS = [
    { name: "Model Town", lat: 30.8926, lng: 75.8415, x: 46, y: 58 },
    { name: "Sarabha Nagar", lat: 30.8884, lng: 75.8224, x: 28, y: 60 },
    { name: "Civil Lines", lat: 30.9142, lng: 75.8398, x: 48, y: 36 },
    { name: "BRS Nagar", lat: 30.8758, lng: 75.8035, x: 18, y: 74 },
    { name: "Rajguru Nagar", lat: 30.8819, lng: 75.7921, x: 14, y: 66 },
    { name: "Focal Point", lat: 30.8925, lng: 75.9182, x: 84, y: 54 },
    { name: "Dugri", lat: 30.8691, lng: 75.8491, x: 52, y: 80 },
    { name: "Gill Road", lat: 30.8861, lng: 75.8622, x: 64, y: 62 },
    { name: "Ferozepur Road", lat: 30.8967, lng: 75.7885, x: 24, y: 46 },
    { name: "Samrala Chowk", lat: 30.9098, lng: 75.8754, x: 74, y: 40 },
    { name: "Haibowal", lat: 30.9278, lng: 75.8162, x: 32, y: 24 },
  ];

  function normalizeTrade(t) {
    const s = String(t || "").toLowerCase().trim();
    if (!s) return "";
    if (s.includes("elect")) return "electrician";
    if (s.includes("plumb")) return "plumber";
    if (s.includes("carpent")) return "carpenter";
    if (s.includes("paint")) return "painter";
    if (s.includes("mason") || s.includes("rajmistri")) return "mason";
    if (s.includes("tile")) return "tile";
    if (s.includes("weld")) return "welder";
    if (s.includes("load") || s.includes("move") || s.includes("shift")) return "loader";
    if (s.includes("help") || s.includes("labour") || s.includes("general")) return "helper";
    return s;
  }

  function getTradeMeta(tradeName) {
    const norm = normalizeTrade(tradeName);
    return TRADES.find((tr) => normalizeTrade(tr.id) === norm || normalizeTrade(tr.name) === norm) || TRADES[8];
  }

  function getLiveTradeRate(tradeName, workers) {
    const meta = getTradeMeta(tradeName);
    const norm = normalizeTrade(tradeName);
    const matching = (Array.isArray(workers) ? workers : []).filter(
      (w) => normalizeTrade(w.primaryTrade) === norm && Number(w.dailyRate) > 0
    );
    if (!matching.length) return meta.rate;
    const avg = Math.round(matching.reduce((acc, w) => acc + Number(w.dailyRate), 0) / matching.length);
    return avg > 0 ? avg : meta.rate;
  }

  function haversineKm(lat1, lng1, lat2, lng2) {
    if (![lat1, lng1, lat2, lng2].every((v) => typeof v === "number" && !Number.isNaN(v))) return null;
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    return +(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
  }

  function formatInr(n) {
    const num = Number(n) || 0;
    return "₹" + Math.round(num).toLocaleString("en-IN");
  }

  function milestoneBonusPct(jobsDone) {
    const count = Math.max(0, Number(jobsDone) || 0);
    return Math.min(100, Math.floor(count / 10) * 10);
  }

  function nextMilestoneTarget(jobsDone) {
    const count = Math.max(0, Number(jobsDone) || 0);
    if (count >= 100) return 100;
    return Math.floor(count / 10 + 1) * 10;
  }

  function isJobWithin10Km(job, worker) {
    if (!job) return false;
    const wGps = worker && worker.gpsLocation;
    const jGps = job.jobGps;
    if (wGps && jGps && typeof wGps.lat === "number" && typeof jGps.lat === "number") {
      const km = haversineKm(wGps.lat, wGps.lng, jGps.lat, jGps.lng);
      if (km !== null) return km <= 10.0;
    }
    if (typeof job.distanceKm === "number") return job.distanceKm <= 10.0;
    return true;
  }

  function getJobDistanceKm(job, worker) {
    const wGps = worker && worker.gpsLocation;
    const jGps = job && job.jobGps;
    if (wGps && jGps && typeof wGps.lat === "number" && typeof jGps.lat === "number") {
      const km = haversineKm(wGps.lat, wGps.lng, jGps.lat, jGps.lng);
      if (km !== null) return Math.max(0.3, km);
    }
    return typeof job.distanceKm === "number" ? job.distanceKm : 1.8;
  }

  // =========================================================================
  // 2. EXACT SVG ASSETS (Hero Scene + Plumber / Carpenter / Painter cards)
  // =========================================================================
  const HERO_SCENE_SVG = `<svg role="img" aria-label="A painter on a ladder rolling marigold paint onto a wall while a mason in a hard hat lays bricks beside bamboo scaffolding, with a city skyline behind" viewBox="0 0 1440 520" preserveAspectRatio="xMidYMax slice" style="position:absolute;left:0;top:0;width:100%;height:100%">
<defs>
<pattern id="rbrick" x="0" y="0" width="44" height="22" patternUnits="userSpaceOnUse"><rect width="44" height="22" fill="#D9C7AE"></rect><rect x="1.5" y="1.5" width="41" height="8.5" rx="2" fill="#C9744C"></rect><rect x="-20.5" y="12.5" width="41" height="8.5" rx="2" fill="#BE6A43"></rect><rect x="23.5" y="12.5" width="41" height="8.5" rx="2" fill="#C66F47"></rect></pattern>
<linearGradient id="rpaint" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F3AE4E"></stop><stop offset="1" stop-color="#F9C979"></stop></linearGradient>
<linearGradient id="rplaster" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F5EBDD"></stop><stop offset="1" stop-color="#E6D5BE"></stop></linearGradient>
<linearGradient id="rfloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D8C3A5"></stop><stop offset="1" stop-color="#BFA585"></stop></linearGradient>
<linearGradient id="rshade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A3A20" stop-opacity="0"></stop><stop offset="1" stop-color="#5A3A20" stop-opacity="0.2"></stop></linearGradient>
<radialGradient id="rsun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#FFE3A8" stop-opacity="0.95"></stop><stop offset="1" stop-color="#FFD08A" stop-opacity="0"></stop></radialGradient>
<linearGradient id="rlight" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD9A0" stop-opacity="0.35"></stop><stop offset="0.6" stop-color="#FFD9A0" stop-opacity="0"></stop></linearGradient>
<linearGradient id="rwin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#CFE2F1"></stop><stop offset="1" stop-color="#9FC1E0"></stop></linearGradient>
<filter id="rgrain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"></feTurbulence><feColorMatrix type="saturate" values="0"></feColorMatrix></filter>
</defs>
<circle cx="1180" cy="150" r="190" fill="url(#rsun)"></circle>
<circle cx="1180" cy="150" r="42" fill="#FFDB8E" opacity="0.9"></circle>
<path d="M0 200 L0 113 L64 113 L64 144 L138 144 L138 155 L200 155 L200 143 L255 143 L255 96 L320 96 L320 109 L383 109 L383 157 L474 157 L474 98 L553 98 L553 111 L632 111 L632 87 L713 87 L713 109 L775 109 L775 98 L830 98 L830 158 L894 158 L894 126 L988 126 L988 108 L1071 108 L1071 112 L1151 112 L1151 146 L1247 146 L1247 127 L1339 127 L1339 152 L1395 152 L1395 81 L1469 81 L1440 200 Z" fill="#D8C9D2" opacity="0.75"></path>
<g fill="#F3E3D0" opacity="0.7"><rect x="782" y="123" width="6" height="8"></rect><rect x="1363" y="117" width="6" height="8"></rect><rect x="703" y="140" width="6" height="8"></rect><rect x="186" y="173" width="6" height="8"></rect><rect x="1340" y="176" width="6" height="8"></rect><rect x="435" y="184" width="6" height="8"></rect><rect x="301" y="187" width="6" height="8"></rect><rect x="141" y="179" width="6" height="8"></rect><rect x="86" y="172" width="6" height="8"></rect><rect x="407" y="128" width="6" height="8"></rect><rect x="1195" y="168" width="6" height="8"></rect><rect x="1206" y="166" width="6" height="8"></rect><rect x="595" y="181" width="6" height="8"></rect><rect x="740" y="164" width="6" height="8"></rect><rect x="286" y="130" width="6" height="8"></rect><rect x="1241" y="122" width="6" height="8"></rect><rect x="1099" y="150" width="6" height="8"></rect><rect x="741" y="173" width="6" height="8"></rect><rect x="1041" y="189" width="6" height="8"></rect><rect x="414" y="149" width="6" height="8"></rect><rect x="317" y="155" width="6" height="8"></rect><rect x="1092" y="146" width="6" height="8"></rect><rect x="1054" y="119" width="6" height="8"></rect><rect x="1049" y="179" width="6" height="8"></rect><rect x="460" y="154" width="6" height="8"></rect><rect x="509" y="111" width="6" height="8"></rect><rect x="615" y="153" width="6" height="8"></rect><rect x="460" y="144" width="6" height="8"></rect><rect x="78" y="164" width="6" height="8"></rect><rect x="531" y="158" width="6" height="8"></rect><rect x="621" y="163" width="6" height="8"></rect><rect x="368" y="160" width="6" height="8"></rect><rect x="248" y="131" width="6" height="8"></rect><rect x="1368" y="113" width="6" height="8"></rect><rect x="423" y="130" width="6" height="8"></rect><rect x="624" y="124" width="6" height="8"></rect><rect x="37" y="158" width="6" height="8"></rect><rect x="710" y="131" width="6" height="8"></rect><rect x="1175" y="165" width="6" height="8"></rect><rect x="484" y="127" width="6" height="8"></rect></g>
<g stroke="#B7A3AE" stroke-width="5" fill="none" stroke-linecap="round"><path d="M1330 200 V40"></path><path d="M1240 46 H1420"></path><path d="M1330 40 L1250 46 M1330 40 L1410 46"></path><path d="M1270 46 V86"></path></g><rect x="1260" y="86" width="20" height="12" fill="#B7A3AE"></rect>
<g fill="none" stroke="#5B4A48" stroke-width="2.4" stroke-linecap="round"><animateTransform attributeName="transform" type="translate" values="0 0; 60 -10; 0 0" dur="16s" repeatCount="indefinite"></animateTransform><path d="M520 60 q7 -8 14 0 q7 -8 14 0"></path><path d="M556 44 q7 -8 14 0 q7 -8 14 0"></path><path d="M590 70 q7 -8 14 0 q7 -8 14 0"></path><path d="M980 40 q7 -8 14 0 q7 -8 14 0"></path><path d="M1010 58 q7 -8 14 0 q7 -8 14 0"></path></g>
<g transform="translate(0 100)">
<g stroke="#C9A46A" stroke-width="9" stroke-linecap="round"><path d="M985 60 V380"></path><path d="M1135 50 V380"></path><path d="M1060 40 V180"></path><path d="M970 110 H1150"></path><path d="M975 70 L1145 160" stroke-width="6"></path></g>
<g fill="#8C6A3A"><rect x="978" y="105" width="14" height="10" rx="3"></rect><rect x="1128" y="105" width="14" height="10" rx="3"></rect><rect x="1053" y="105" width="14" height="10" rx="3"></rect></g>
<rect x="960" y="128" width="200" height="12" rx="3" fill="#A8834F"></rect>
<path d="M0 70 H880 V380 H0 Z" fill="url(#rplaster)"></path>
<path d="M0 70 H380 C 392 110, 372 150, 390 190 C 404 230, 380 270, 396 310 C 404 340, 388 362, 394 380 H0 Z" fill="url(#rpaint)"></path>
<g stroke="#EFA03E" stroke-width="12" opacity="0.28" stroke-linecap="round"><path d="M28 82 V370"></path><path d="M72 82 V370"></path><path d="M116 82 V370"></path><path d="M160 82 V370"></path><path d="M204 82 V370"></path><path d="M248 82 V370"></path><path d="M292 82 V370"></path><path d="M336 82 V370"></path></g>
<g stroke="#FFE0A8" stroke-width="4" opacity="0.5" stroke-linecap="round"><path d="M38 90 V360"></path><path d="M126 90 V360"></path><path d="M214 90 V360"></path><path d="M302 90 V360"></path></g>
<g fill="#F3AE4E"><path d="M392 150 q4 0 4 6 v18 a4 4 0 0 1-8 0 v-18 q0-6 4-6 z"></path><path d="M386 250 q4 0 4 6 v26 a4 4 0 0 1-8 0 v-26 q0-6 4-6 z"></path><path d="M398 300 q4 0 4 6 v12 a4 4 0 0 1-8 0 v-12 q0-6 4-6 z"></path></g>
<rect x="0" y="60" width="892" height="12" rx="2" fill="#C8B293"></rect>
<g><rect x="552" y="112" width="186" height="166" rx="8" fill="#C8B293"></rect><rect x="560" y="120" width="170" height="150" rx="6" fill="url(#rwin)"></rect><path d="M575 135 L615 135 L575 175 Z" fill="#FFFFFF" opacity="0.4"></path><path d="M645 120 V270 M560 195 H730" stroke="#F5EBDD" stroke-width="8"></path><rect x="548" y="268" width="194" height="12" rx="3" fill="#B9A07E"></rect><path d="M676 268 l6 -24 h22 l6 24 z" fill="#B5643E"></path><g fill="#5E7A3A"><ellipse cx="684" cy="236" rx="8" ry="16" transform="rotate(-25 684 236)"></ellipse><ellipse cx="700" cy="232" rx="8" ry="18" transform="rotate(20 700 232)"></ellipse><ellipse cx="692" cy="226" rx="7" ry="18"></ellipse></g></g>
<path d="M800 72 V140" stroke="#5B4A48" stroke-width="2"></path><circle cx="800" cy="150" r="30" fill="#FFE3A0" opacity="0.35"></circle><circle cx="800" cy="148" r="11" fill="#FFE7B0"></circle><rect x="795" y="134" width="10" height="8" fill="#5B4A48"></rect>
<path d="M880 380 V180 H1000 V200 H1000 V248 H1120 V178 H1440 V380 Z" fill="url(#rbrick)"></path>
<path d="M880 380 V180 H1000 V248 H1120 V178 H1440 V380 Z" fill="url(#rshade)"></path>
<g><rect x="1150" y="166" width="150" height="12" rx="3" fill="#2E9E57"></rect><rect x="1215" y="168" width="22" height="8" rx="3" fill="#DDF5E5"></rect><circle cx="1226" cy="172" r="2.5" fill="#2E9E57"></circle></g>
<path d="M880 172 L1440 170" stroke="#E5484D" stroke-width="1.5" opacity="0.8"></path>
<g><path d="M1352 178 h18 l-2 -26 h-14 z" fill="#FFFFFF" opacity="0.75"></path><path d="M1353 170 h16 l-1 -12 h-14 z" fill="#C98A4E"></path><g fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" opacity="0.7"><path d="M1358 146 q-6 -8 0 -16 q6 -8 0 -16"><animate attributeName="opacity" values="0.15;0.7;0.15" dur="3s" repeatCount="indefinite"></animate></path><path d="M1366 148 q-6 -8 0 -16 q6 -8 0 -16"><animate attributeName="opacity" values="0.6;0.15;0.6" dur="3s" repeatCount="indefinite"></animate></path></g><path d="M1390 178 h34 v-22 a17 14 0 0 0 -34 0 z" fill="#8A97A6"></path><path d="M1424 162 l12 -8" stroke="#8A97A6" stroke-width="5" stroke-linecap="round"></path><rect x="1400" y="138" width="14" height="6" rx="2" fill="#6B7684"></rect></g>
<rect x="0" y="378" width="1440" height="44" fill="url(#rfloor)"></rect>
<rect x="0" y="378" width="1440" height="6" fill="#5A3A20" opacity="0.12"></rect>
<path d="M120 384 Q 300 376 560 386 L 580 422 L 100 422 Z" fill="#F4EEE3"></path><path d="M180 396 Q 300 392 420 400" stroke="#E6DCCB" stroke-width="3" fill="none"></path>
<g fill="#F3AE4E"><circle cx="271" cy="410" r="4"></circle><circle cx="216" cy="403" r="4"></circle><circle cx="392" cy="412" r="4"></circle><circle cx="183" cy="411" r="2"></circle><circle cx="390" cy="400" r="4"></circle><circle cx="269" cy="398" r="4"></circle><circle cx="390" cy="409" r="4"></circle><circle cx="393" cy="404" r="4"></circle><circle cx="227" cy="399" r="4"></circle><circle cx="227" cy="408" r="3"></circle><circle cx="529" cy="392" r="4"></circle><circle cx="182" cy="397" r="4"></circle><circle cx="171" cy="401" r="2"></circle><circle cx="287" cy="407" r="4"></circle></g>
<g fill="#5A3A20" opacity="0.18"><ellipse cx="475" cy="404" rx="70" ry="6"></ellipse><ellipse cx="222" cy="406" rx="34" ry="5"></ellipse></g>
<g stroke="#B07A4A" stroke-width="8" stroke-linecap="round"><path d="M430 400 L470 236"></path><path d="M520 400 L482 236"></path></g>
<g stroke="#B07A4A" stroke-width="6"><path d="M438 366 H512"></path><path d="M446 330 H504"></path><path d="M454 296 H496"></path></g>
<path d="M450 236 L452 266 Q454 280 456 294 L472 294 Q472 276 474 262 L476 244 Z" fill="#7E99BF"></path>
<path d="M476 244 L480 264 Q482 280 482 294 L498 294 Q500 276 500 262 L502 236 Z" fill="#7E99BF"></path>
<path d="M462 268 l8 0 M488 268 l8 0" stroke="#5E7AA3" stroke-width="2" stroke-linecap="round"></path>
<path d="M450 292 h24 q6 0 6 6 v2 h-30 z M478 292 h24 q6 0 6 6 v2 h-30 z" fill="#3A3A44"></path>
<path d="M446 184 Q446 168 462 165 L490 165 Q506 168 506 184 L503 240 Q476 247 449 240 Z" fill="#E3EAE6"></path>
<path d="M462 165 L476 178 L490 165" fill="none" stroke="#C9D4DC" stroke-width="3" stroke-linejoin="round"></path>
<path d="M454 196 H498 L502 240 Q476 247 450 240 Z" fill="#7E99BF"></path>
<path d="M452 170 L458 198 M500 170 L494 198" stroke="#7E99BF" stroke-width="7" stroke-linecap="round"></path>
<circle cx="458" cy="199" r="3" fill="#E3EAE6"></circle><circle cx="494" cy="199" r="3" fill="#E3EAE6"></circle>
<rect x="463" y="205" width="26" height="20" rx="3" fill="none" stroke="#5E7AA3" stroke-width="2.5"></rect>
<path d="M451 232 Q476 238 501 232" stroke="#5E7AA3" stroke-width="2.5" fill="none"></path>
<g fill="#F3AE4E"><circle cx="456" cy="228" r="3.5"></circle><circle cx="494" cy="236" r="3"></circle><circle cx="482" cy="212" r="2.5"></circle><circle cx="470" cy="262" r="3"></circle></g>
<path d="M500 178 Q510 190 510 206" stroke="#E3EAE6" stroke-width="16" stroke-linecap="round" fill="none"></path>
<path d="M510 206 L514 222" stroke="#F1C7A3" stroke-width="11" stroke-linecap="round"></path>
<rect x="503" y="222" width="24" height="26" rx="4" fill="#E89A5A"></rect><rect x="503" y="222" width="24" height="7" fill="#F3AE4E"></rect><path d="M505 222 q10 -10 20 0" fill="none" stroke="#5B6470" stroke-width="2.5"></path>
<ellipse cx="514" cy="224" rx="7" ry="6" fill="#F1C7A3"></ellipse>
<g><animateTransform attributeName="transform" type="rotate" values="0 452 176; -7 452 176; 3 452 176; 0 452 176" dur="2.6s" repeatCount="indefinite"></animateTransform><path d="M420 130 L372 92" stroke="#6B6B74" stroke-width="6" stroke-linecap="round"></path><g transform="rotate(-40 366 86)"><rect x="340" y="78" width="54" height="18" rx="9" fill="#F3AE4E"></rect><rect x="340" y="78" width="54" height="6" rx="3" fill="#FBD596"></rect></g><path d="M452 176 Q440 166 434 152" stroke="#E3EAE6" stroke-width="16" stroke-linecap="round" fill="none"></path><path d="M434 152 L423 134" stroke="#F1C7A3" stroke-width="11" stroke-linecap="round"></path><ellipse cx="420" cy="129" rx="7.5" ry="7" fill="#F1C7A3"></ellipse><path d="M414 126 q6 -3 12 2" stroke="#E2B08A" stroke-width="2" fill="none"></path></g>
<path d="M469 150 h14 v17 q-7 4 -14 0 z" fill="#E9B592"></path>
<circle cx="476" cy="136" r="25" fill="#F1C7A3"></circle>
<path d="M451 134 q2 -22 25 -24 q23 2 25 24 q-6 -10 -16 -10 q-4 6 -12 6 q-10 0 -22 4 z" fill="#4A2E22"></path>
<path d="M448 124 q28 -30 56 0 l-4 6 q-24 -18 -48 0 z" fill="#EEF2F4"></path><rect x="447" y="120" width="58" height="8" rx="4" fill="#C9D4DC"></rect>
<circle cx="451" cy="139" r="5" fill="#E9B592"></circle><circle cx="501" cy="139" r="5" fill="#E9B592"></circle>
<ellipse cx="467" cy="139" rx="2.6" ry="3.4" fill="#2B2420"></ellipse><ellipse cx="485" cy="139" rx="2.6" ry="3.4" fill="#2B2420"></ellipse>
<circle cx="459" cy="148" r="7" fill="#F2938A" opacity="0.6"></circle><circle cx="493" cy="148" r="7" fill="#F2938A" opacity="0.6"></circle>
<path d="M470 150 q6 6 12 0 z" fill="#B5473F"></path>
<path d="M300 392 h70 l10 14 h-90 z" fill="#C9CED6"></path><path d="M306 394 h58 l5 7 h-68 z" fill="#F3AE4E"></path>
<g><path d="M200 360 h44 l-4 44 h-36 z" fill="#FFFFFF"></path><rect x="198" y="356" width="48" height="8" rx="3" fill="#E9DFCC"></rect><path d="M204 374 h36" stroke="#F3AE4E" stroke-width="12"></path><path d="M200 358 q22 -26 44 0" fill="none" stroke="#5B6470" stroke-width="3"></path><path d="M212 364 v16" stroke="#F3AE4E" stroke-width="4" stroke-linecap="round"></path></g>
<g><rect x="610" y="370" width="54" height="34" rx="6" fill="#B5643E"></rect><circle cx="626" cy="388" r="9" fill="#5B3A2A"></circle><rect x="640" y="380" width="18" height="4" rx="2" fill="#F5EBDD"></rect><rect x="640" y="390" width="18" height="4" rx="2" fill="#F5EBDD"></rect><path d="M650 370 l14 -22" stroke="#5B4A48" stroke-width="2.5"></path></g>
<g fill="none" stroke="#5B4A48" stroke-width="2" stroke-linecap="round"><path d="M674 362 q6 -6 0 -12"><animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite"></animate></path><path d="M682 366 q10 -10 0 -20"><animate attributeName="opacity" values="0;1;0" dur="2s" begin="0.5s" repeatCount="indefinite"></animate></path></g>
<path d="M1032 186 Q1032 170 1050 167 L1082 167 Q1100 170 1100 186 L1098 252 H1034 Z" fill="#E3EAE6"></path>
<path d="M1050 167 L1066 181 L1082 167" fill="none" stroke="#C9D4DC" stroke-width="3" stroke-linejoin="round"></path>
<path d="M1040 198 H1092 L1094 252 H1038 Z" fill="#7E99BF"></path>
<path d="M1042 172 L1048 200 M1090 172 L1084 200" stroke="#7E99BF" stroke-width="7" stroke-linecap="round"></path>
<circle cx="1048" cy="201" r="3" fill="#E3EAE6"></circle><circle cx="1084" cy="201" r="3" fill="#E3EAE6"></circle>
<rect x="1053" y="208" width="26" height="20" rx="3" fill="none" stroke="#5E7AA3" stroke-width="2.5"></rect>
<path d="M1060 208 v-6" stroke="#E5484D" stroke-width="3" stroke-linecap="round"></path>
<path d="M1094 180 Q1106 194 1106 210" stroke="#E3EAE6" stroke-width="16" stroke-linecap="round" fill="none"></path>
<path d="M1106 210 L1104 228" stroke="#D9A27A" stroke-width="11" stroke-linecap="round"></path>
<ellipse cx="1104" cy="233" rx="8" ry="7" fill="#E0B341"></ellipse>
<g><animateTransform attributeName="transform" type="rotate" values="0 1040 182; 7 1040 182; 0 1040 182" dur="1.4s" repeatCount="indefinite"></animateTransform><path d="M1040 182 Q1028 194 1028 212" stroke="#E3EAE6" stroke-width="16" stroke-linecap="round" fill="none"></path><path d="M1028 212 L1024 228" stroke="#D9A27A" stroke-width="11" stroke-linecap="round"></path><ellipse cx="1023" cy="232" rx="8" ry="7" fill="#E0B341"></ellipse><path d="M1018 236 l-4 8 M1014 244 l-22 6 l8 -14 z" stroke="#5B6470" stroke-width="3" fill="#9AA3AD" stroke-linejoin="round"></path></g>
<path d="M1059 152 h14 v17 q-7 4 -14 0 z" fill="#CB9068"></path>
<circle cx="1066" cy="138" r="25" fill="#D9A27A"></circle>
<path d="M1043 140 q0 -16 10 -20 h26 q10 4 10 20 q-6 -8 -14 -8 h-18 q-8 0 -14 8 z" fill="#3A2418"></path>
<path d="M1038 128 a28 26 0 0 1 56 0 Z" fill="#E8C15A"></path><rect x="1034" y="125" width="64" height="8" rx="4" fill="#D4A93E"></rect><path d="M1066 103 V126" stroke="#D4A93E" stroke-width="5"></path>
<path d="M1043 136 q-2 18 6 22 M1089 136 q2 18 -6 22" stroke="#B88A30" stroke-width="2" fill="none"></path>
<circle cx="1041" cy="142" r="5" fill="#CB9068"></circle><circle cx="1091" cy="142" r="5" fill="#CB9068"></circle>
<ellipse cx="1057" cy="142" rx="2.6" ry="3.4" fill="#2B2420"></ellipse><ellipse cx="1075" cy="142" rx="2.6" ry="3.4" fill="#2B2420"></ellipse>
<path d="M1053 135 q4 -3 8 0 M1071 135 q4 -3 8 0" stroke="#3A2418" stroke-width="2" fill="none" stroke-linecap="round"></path>
<circle cx="1049" cy="151" r="7" fill="#F2938A" opacity="0.55"></circle><circle cx="1083" cy="151" r="7" fill="#F2938A" opacity="0.55"></circle>
<path d="M1059 151 q7 7 14 0" fill="none" stroke="#3A2418" stroke-width="2.6" stroke-linecap="round"></path>
<path d="M1000 380 V248 H1120 V380 Z" fill="url(#rbrick)"></path><path d="M1000 380 V248 H1120 V380 Z" fill="url(#rshade)"></path>
<path d="M1002 246 h46" stroke="#9E9488" stroke-width="5" stroke-linecap="round"></path><rect x="1004" y="228" width="40" height="16" rx="3" fill="#D98A60" stroke="#8C4A2E" stroke-width="2"></rect>
<ellipse cx="1310" cy="388" rx="90" ry="7" fill="#5A3A20" opacity="0.22"></ellipse>
<g><rect x="1230" y="370" width="42" height="13" rx="2" fill="#D98A60" stroke="#8C4A2E" stroke-width="2"></rect><rect x="1276" y="370" width="42" height="13" rx="2" fill="#E09A6E" stroke="#8C4A2E" stroke-width="2"></rect><rect x="1322" y="370" width="42" height="13" rx="2" fill="#D98A60" stroke="#8C4A2E" stroke-width="2"></rect><rect x="1252" y="356" width="42" height="13" rx="2" fill="#E09A6E" stroke="#8C4A2E" stroke-width="2"></rect><rect x="1298" y="356" width="42" height="13" rx="2" fill="#D98A60" stroke="#8C4A2E" stroke-width="2"></rect><rect x="1344" y="356" width="42" height="13" rx="2" fill="#E09A6E" stroke="#8C4A2E" stroke-width="2"></rect><rect x="1230" y="342" width="42" height="13" rx="2" fill="#D98A60" stroke="#8C4A2E" stroke-width="2"></rect><rect x="1276" y="342" width="42" height="13" rx="2" fill="#E09A6E" stroke="#8C4A2E" stroke-width="2"></rect><rect x="1322" y="342" width="42" height="13" rx="2" fill="#D98A60" stroke="#8C4A2E" stroke-width="2"></rect><rect x="1252" y="328" width="42" height="13" rx="2" fill="#E09A6E" stroke="#8C4A2E" stroke-width="2"></rect><rect x="1298" y="328" width="42" height="13" rx="2" fill="#D98A60" stroke="#8C4A2E" stroke-width="2"></rect></g>
<g><ellipse cx="1170" cy="406" rx="52" ry="14" fill="#2B2420"></ellipse><ellipse cx="1170" cy="400" rx="46" ry="10" fill="#9E9488"></ellipse><path d="M1190 396 l34 -26" stroke="#7A4E2E" stroke-width="5" stroke-linecap="round"></path></g>
</g>
<rect width="1440" height="520" fill="url(#rlight)"></rect>
<rect width="1440" height="520" filter="url(#rgrain)" opacity="0.09"></rect>
</svg>`;

  const PLUMBER_CARD_SVG = `<svg role="img" aria-label="Illustration of a plumber fixing the pipe under a sink" viewBox="0 0 400 300" style="display:block;width:100%;height:auto;background:linear-gradient(180deg,#DCEBFF 0%,#EEF5FF 100%)"><g stroke="#C9DCF3" stroke-width="2"><path d="M0 60H400M0 120H400M0 180H400M60 0V250M140 0V250M220 0V250M300 0V250M380 0V250"></path></g><rect x="0" y="250" width="400" height="50" fill="#B3CDEB"></rect><rect x="200" y="118" width="190" height="18" rx="4" fill="#FFFFFF"></rect><rect x="278" y="104" width="6" height="16" fill="#9AA7B5"></rect><rect x="270" y="100" width="22" height="6" rx="3" fill="#9AA7B5"></rect><rect x="212" y="136" width="166" height="114" rx="6" fill="#EFE7DA"></rect><rect x="228" y="150" width="134" height="100" rx="4" fill="#2C3440"></rect><path d="M290 136 V182 a16 16 0 0 0 32 0 V172 H362" fill="none" stroke="#B9C3CF" stroke-width="11" stroke-linejoin="round"></path><ellipse cx="300" cy="212" rx="4" ry="6" fill="#5EA8F0"></ellipse><ellipse cx="312" cy="228" rx="3" ry="5" fill="#5EA8F0"></ellipse><ellipse cx="290" cy="238" rx="10" ry="3" fill="#5EA8F0" opacity="0.6"></ellipse><path d="M104 250 H152 V222 H122 Z" fill="#1F4F9E"></path><rect x="116" y="158" width="52" height="72" rx="20" fill="#2F6FD6"></rect><rect x="130" y="166" width="24" height="22" rx="4" fill="#5C93EA"></rect><path d="M164 182 L232 196" stroke="#B97A55" stroke-width="11" stroke-linecap="round"></path><path d="M226 198 L264 186" stroke="#5B6470" stroke-width="8" stroke-linecap="round"></path><circle cx="268" cy="184" r="8" fill="none" stroke="#5B6470" stroke-width="6"></circle><circle cx="146" cy="138" r="19" fill="#B97A55"></circle><path d="M126 134 a20 20 0 0 1 40 0 Z" fill="#F5A524"></path><rect x="160" y="130" width="18" height="6" rx="3" fill="#E8930C"></rect></svg>`;

  const CARPENTER_CARD_SVG = `<svg role="img" aria-label="Illustration of a carpenter working at a wooden workbench" viewBox="0 0 400 300" style="display:block;width:100%;height:auto;background:linear-gradient(180deg,#F6E2D2 0%,#FBF1E8 100%)"><rect x="250" y="40" width="110" height="80" rx="6" fill="#FFFFFF" opacity="0.7"></rect><path d="M305 40V120M250 80H360" stroke="#F0D9C4" stroke-width="3"></path><rect x="0" y="250" width="400" height="50" fill="#E3C3A2"></rect><rect x="150" y="176" width="220" height="16" rx="3" fill="#A86A3D"></rect><rect x="160" y="192" width="12" height="58" fill="#8A5530"></rect><rect x="348" y="192" width="12" height="58" fill="#8A5530"></rect><rect x="160" y="226" width="200" height="8" fill="#8A5530"></rect><rect x="196" y="164" width="150" height="12" rx="2" fill="#E8B985"></rect><path d="M268 160 L338 128 L344 136 L276 168 Z" fill="#C9CED6"></path><rect x="332" y="118" width="22" height="14" rx="5" fill="#2E2470" transform="rotate(-24 343 125)"></rect><g fill="none" stroke="#C98A4E" stroke-width="3" stroke-linecap="round"><path d="M200 262 q6 -8 12 0 q6 8 12 0"></path><path d="M300 266 q5 -7 10 0"></path><path d="M240 258 q4 -6 8 0"></path></g><rect x="84" y="196" width="16" height="54" rx="4" fill="#3D3830"></rect><rect x="106" y="196" width="16" height="54" rx="4" fill="#3D3830"></rect><rect x="76" y="122" width="56" height="84" rx="20" fill="#F2F0EA"></rect><rect x="88" y="150" width="32" height="56" rx="6" fill="#8A5A3A"></rect><rect x="96" y="160" width="16" height="10" rx="2" fill="#A86A3D"></rect><path d="M128 146 L176 162" stroke="#9C6646" stroke-width="11" stroke-linecap="round"></path><path d="M176 162 L188 132" stroke="#7A4E2E" stroke-width="6" stroke-linecap="round"></path><rect x="176" y="120" width="26" height="12" rx="3" fill="#5B6470" transform="rotate(22 189 126)"></rect><circle cx="104" cy="102" r="19" fill="#9C6646"></circle><path d="M85 98 a19 19 0 0 1 38 -2 q-10 -8 -38 2 Z" fill="#2B2420"></path><path d="M96 116 q8 6 16 0" fill="none" stroke="#2B2420" stroke-width="4" stroke-linecap="round"></path></svg>`;

  const PAINTER_CARD_SVG = `<svg role="img" aria-label="Illustration of a painter rolling fresh paint onto a wall" viewBox="0 0 400 300" style="display:block;width:100%;height:auto;background:#F6EFE6"><path d="M0 0 H232 C 226 40, 238 80, 228 120 C 220 160, 236 200, 230 250 H0 Z" fill="#F7C3D9"></path><path d="M214 120 v22 a4 4 0 0 0 8 0 v-22 Z M196 180 v16 a4 4 0 0 0 8 0 v-16 Z" fill="#F7C3D9"></path><rect x="0" y="250" width="400" height="50" fill="#E6DCEC"></rect><g stroke="#A86A3D" stroke-width="8" stroke-linecap="round"><path d="M290 250 L316 96"></path><path d="M350 250 L324 96"></path></g><g stroke="#A86A3D" stroke-width="6"><path d="M298 210 H340M304 170 H334M309 132 H330"></path></g><path d="M60 240 L120 240 L130 254 L50 254 Z" fill="#C9CED6"></path><path d="M66 242 L114 242 L118 248 L62 248 Z" fill="#D9478E"></path><rect x="340" y="226" width="30" height="26" rx="4" fill="#6A5AE0"></rect><rect x="340" y="226" width="30" height="7" fill="#D9478E"></rect><rect x="150" y="198" width="16" height="52" rx="4" fill="#4A3DB8"></rect><rect x="172" y="198" width="16" height="52" rx="4" fill="#4A3DB8"></rect><rect x="142" y="124" width="56" height="84" rx="20" fill="#6A5AE0"></rect><rect x="156" y="136" width="28" height="20" rx="4" fill="#8C80EA"></rect><circle cx="160" cy="176" r="4" fill="#F7C3D9"></circle><circle cx="182" cy="190" r="3" fill="#F7C3D9"></circle><path d="M192 140 L224 98" stroke="#C88A5E" stroke-width="11" stroke-linecap="round"></path><path d="M224 98 L226 76" stroke="#5B6470" stroke-width="6" stroke-linecap="round"></path><rect x="204" y="60" width="46" height="18" rx="9" fill="#D9478E"></rect><circle cx="170" cy="104" r="19" fill="#C88A5E"></circle><path d="M150 98 L190 98 L184 84 Q170 76 156 84 Z" fill="#FFFFFF"></path><rect x="148" y="96" width="44" height="6" rx="3" fill="#EDE6F5"></rect></svg>`;

  function HeroWorkSceneSvg({ style }) {
    return h("div", {
      style: Object.assign({ position: "relative", width: "100%", height: "520px", overflow: "hidden" }, style || {}),
      dangerouslySetInnerHTML: { __html: HERO_SCENE_SVG },
    });
  }

  function TradeIllustration({ type }) {
    const svg =
      type === "Plumber" ? PLUMBER_CARD_SVG : type === "Carpenter" ? CARPENTER_CARD_SVG : PAINTER_CARD_SVG;
    return h("div", { dangerouslySetInnerHTML: { __html: svg } });
  }

  function SvgIcon({ path, size = 18, color = "currentColor", strokeWidth = 2.2, style }) {
    return h(
      "svg",
      {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: color,
        strokeWidth,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": "true",
        style: Object.assign({ flexShrink: 0, display: "inline-block" }, style || {}),
      },
      h("path", { d: path })
    );
  }

  function KaamzoLogo({ size = 22, dark = false, onClick }) {
    return h(
      "a",
      {
        href: "/",
        onClick: (e) => {
          e.preventDefault();
          if (onClick) onClick();
          else navigate("/", { role: "select_role" });
        },
        style: {
          textDecoration: "none",
          color: dark ? "#EDE6DA" : "#1C1913",
          fontWeight: 800,
          fontSize: size + "px",
          letterSpacing: "-0.4px",
          display: "inline-flex",
          alignItems: "center",
          flexShrink: 0,
        },
      },
      "kaamzo",
      h("span", { style: { color: "#E8930C" } }, ".")
    );
  }

  // =========================================================================
  // 3. CLIENT-SIDE ROUTER
  // =========================================================================
  function normalizePathname(p) {
    let clean = String(p || window.location.pathname || "/").toLowerCase();
    clean = clean.replace(/\.html$/, "").replace(/\/index$/, "");
    if (clean.length > 1) clean = clean.replace(/\/+$/, "");
    return clean || "/";
  }

  function roleForPath(path) {
    if (path === "/admin" || path.startsWith("/admin/")) return "admin";
    if (path === "/pitch" || path.startsWith("/pitch/")) return "pitch_deck";
    if (path === "/customer" || path.startsWith("/customer/")) return "customer";
    if (path === "/worker" || path.startsWith("/worker/") || path === "/jobs" || path.startsWith("/jobs/")) {
      return "worker";
    }
    return null;
  }

  function navigate(targetPath, opts) {
    const o = opts || {};
    const path = targetPath.startsWith("/") ? targetPath : "/" + targetPath;
    const urlObj = new URL(window.location.origin + path);
    const norm = normalizePathname(urlObj.pathname);
    try {
      window.history.pushState(o.state || {}, "", urlObj.pathname + urlObj.search + urlObj.hash);
    } catch (_) {}
    if (o.searchQuery) KZ.lastSearchQuery = o.searchQuery;
    if (o.selectedTrade) KZ.lastSelectedTrade = o.selectedTrade;
    if (o.registerRole) KZ.preferredRegisterRole = o.registerRole;
    const ctx = getCtx();
    if (ctx) {
      // Trigger role updates cleanly via custom window sync when AppProvider is mounted
      window.dispatchEvent(new CustomEvent("kz_route_change", { detail: { path: norm, role: o.role } }));
    } else {
      window.dispatchEvent(new CustomEvent("kz_route_change", { detail: { path: norm, role: o.role } }));
    }
    window.scrollTo({ top: 0, behavior: "instant" in window ? "auto" : "auto" });
  }

  function useRoute() {
    const app = useApp();
    const [path, setPath] = useState(() => normalizePathname(window.location.pathname));

    useEffect(() => {
      const handleSync = (e) => {
        const nextPath = (e && e.detail && e.detail.path) || normalizePathname(window.location.pathname);
        setPath(nextPath);
        const explicitRole = e && e.detail && e.detail.role;
        const implied = explicitRole || roleForPath(nextPath);
        if (implied && app.currentRole !== implied) {
          app.setCurrentRole(implied);
        } else if (nextPath === "/" && !e?.detail?.keepRole && !window.location.search.includes("app=")) {
          if (app.currentRole !== "select_role") app.setCurrentRole("select_role");
        }
      };
      const onPop = () => handleSync({ detail: { path: normalizePathname(window.location.pathname) } });
      window.addEventListener("kz_route_change", handleSync);
      window.addEventListener("popstate", onPop);
      return () => {
        window.removeEventListener("kz_route_change", handleSync);
        window.removeEventListener("popstate", onPop);
      };
    }, [app.currentRole]);

    return { path, navigate };
  }

  // =========================================================================
  // 4. GLOBAL POPOVERS, AUDIO BAR, 6-DIGIT GMAIL OTP MODAL & HELP PILL
  // =========================================================================
  KZ.openOtpModal = null; // bound inside GlobalChrome

  function TopUtilityBar({ compact = false }) {
    const app = useApp();
    const isDark = app.isDarkMode;
    const [openMenu, setOpenMenu] = useState(null); // "settings" | "lang" | "city" | "profile" | null
    const [audioOn, setAudioOn] = useState(false);

    useEffect(() => {
      const onKey = (e) => {
        if (e.key === "Escape") setOpenMenu(null);
      };
      const onClickOutside = (e) => {
        if (!e.target.closest("[data-kz-menu-root]")) setOpenMenu(null);
      };
      window.addEventListener("keydown", onKey);
      document.addEventListener("mousedown", onClickOutside);
      return () => {
        window.removeEventListener("keydown", onKey);
        document.removeEventListener("mousedown", onClickOutside);
      };
    }, []);

    const toggleLang = (code) => {
      app.setCurrentLanguage(code);
      if (typeof window.kaamzoSetLanguage === "function") {
        try {
          window.kaamzoSetLanguage(code);
        } catch (_) {}
      }
      setOpenMenu(null);
    };

    const toggleAudio = () => {
      if (typeof window.kaamzoToggleAudioReader === "function") {
        try {
          window.kaamzoToggleAudioReader();
        } catch (_) {}
      }
      setAudioOn((prev) => !prev);
      setOpenMenu(null);
    };

    const stopAudio = () => {
      if (typeof window.kaamzoStopAudio === "function") {
        try {
          window.kaamzoStopAudio();
        } catch (_) {}
      }
      setAudioOn(false);
    };

    const activeUser =
      app.currentRole === "worker"
        ? app.currentWorker
        : app.currentRole === "customer"
        ? app.currentCustomer
        : app.currentCustomer || app.currentWorker;
    const roleLabel =
      app.currentRole === "worker"
        ? "Worker"
        : app.currentRole === "customer"
        ? "Customer"
        : app.currentCustomer
        ? "Customer"
        : app.currentWorker
        ? "Worker"
        : "Guest";

    const popCardStyle = {
      position: "absolute",
      top: "calc(100% + 10px)",
      right: 0,
      width: "300px",
      maxWidth: "calc(100vw - 24px)",
      borderRadius: "24px",
      background: isDark ? "#1F1C17" : "#FFFFFF",
      color: isDark ? "#EDE6DA" : "#1C1913",
      border: "1px solid " + (isDark ? "#2E2A22" : "#EFE7DA"),
      boxShadow: "0 20px 44px rgba(80,50,10,0.16)",
      padding: "14px",
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      zIndex: 80,
    };

    const pillBtn = {
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      height: "36px",
      padding: "0 12px",
      borderRadius: "999px",
      border: "1px solid " + (isDark ? "#3A342C" : "#E5DCCB"),
      background: isDark ? "#1F1C17" : "#FFFFFF",
      color: isDark ? "#EDE6DA" : "#1C1913",
      fontSize: "12px",
      fontWeight: 700,
    };

    return h(
      "div",
      {
        "data-kz-menu-root": "1",
        className: isDark ? "kz-muted-surface" : "",
        style: {
          position: "relative",
          zIndex: 60,
          background: isDark ? "#14120E" : "#F4EEE3",
          borderBottom: "1px solid " + (isDark ? "#2E2A22" : "#EFE7DA"),
          color: isDark ? "#EDE6DA" : "#1C1913",
          fontSize: "12px",
        },
      },
      h(
        "div",
        {
          style: {
            maxWidth: "1240px",
            margin: "0 auto",
            padding: "8px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
            flexWrap: "wrap",
          },
        },
        // Left: City & 10 km GPS selector
        h(
          "div",
          { style: { position: "relative", display: "flex", alignItems: "center", gap: "8px" } },
          h(
            "button",
            {
              type: "button",
              onClick: () => setOpenMenu(openMenu === "city" ? null : "city"),
              style: pillBtn,
              "aria-label": "Operating city and 10 km GPS radius",
            },
            h("span", {
              style: { width: "7px", height: "7px", borderRadius: "50%", background: "#2E9E57" },
            }),
            h("span", null, (app.currentCity?.name || "Ludhiana") + " · 10 km GPS"),
            h("span", { style: { opacity: 0.6 } }, "▾")
          ),
          openMenu === "city" &&
            h(
              "div",
              { style: Object.assign({}, popCardStyle, { left: 0, right: "auto" }) },
              h(
                "span",
                {
                  style: {
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "1px",
                    color: isDark ? "#F5A524" : "#7A4E00",
                    padding: "4px 12px 6px",
                  },
                },
                "OPERATING CITY & GPS"
              ),
              [
                { name: "Ludhiana", sub: "Live · 10 km radar", active: true },
                { name: "Delhi NCR", sub: "Coming soon", active: false },
                { name: "Chandigarh", sub: "Coming soon", active: false },
              ].map((city) =>
                h(
                  "button",
                  {
                    key: city.name,
                    type: "button",
                    onClick: () => {
                      if (!city.active) {
                        app.showNotification?.(city.name + " launches soon! Live operations in Ludhiana.");
                        return;
                      }
                      const found = (app.supportedCities || []).find((c) => c.name === city.name);
                      if (found && app.setCurrentCity) app.setCurrentCity(found);
                      setOpenMenu(null);
                    },
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px",
                      borderRadius: "14px",
                      border: 0,
                      textAlign: "left",
                      background: city.active
                        ? isDark
                          ? "#2C2415"
                          : "#FFF0BF"
                        : "transparent",
                      color: isDark ? "#EDE6DA" : "#1C1913",
                    },
                  },
                  h(
                    "span",
                    { style: { flex: 1, display: "flex", flexDirection: "column" } },
                    h("b", { style: { fontSize: "14px" } }, city.name),
                    h("span", { style: { fontSize: "12px", color: isDark ? "#B0A899" : "#6F685D" } }, city.sub)
                  ),
                  city.active ? "✓" : ""
                )
              ),
              h(
                "div",
                {
                  style: {
                    marginTop: "6px",
                    padding: "12px",
                    borderRadius: "14px",
                    background: isDark ? "#192B1E" : "#E3F4E8",
                    color: isDark ? "#CFEAD7" : "#1C1913",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  },
                },
                h("b", { style: { fontSize: "13px" } }, "Your live pin"),
                h(
                  "span",
                  { style: { fontSize: "12px", color: isDark ? "#A6D6B3" : "#2D4A36" } },
                  app.currentResolvedAddress ||
                    `${activeUser?.area || "Model Town"}, ${app.currentCity?.name || "Ludhiana"} · 10 km radar active`
                ),
                h(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      app.detectAndSetLiveLocation?.();
                      app.refreshCustomerGpsLocation?.();
                      app.refreshWorkerGpsLocation?.();
                      setOpenMenu(null);
                    },
                    style: {
                      height: "38px",
                      padding: "0 18px",
                      borderRadius: "999px",
                      fontWeight: 800,
                      fontSize: "12px",
                      border: 0,
                      background: "#1C1913",
                      color: "#FBF8F2",
                    },
                  },
                  app.isLocating ? "Locating…" : "Calibrate GPS"
                )
              )
            )
        ),

        // Right controls: Listen, Language, Settings, Profile/Sign In
        h(
          "div",
          { style: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" } },
          // Voice Reader button
          h(
            "button",
            {
              type: "button",
              onClick: toggleAudio,
              style: Object.assign({}, pillBtn, {
                background: audioOn ? "#1C1913" : pillBtn.background,
                color: audioOn ? "#F5A524" : pillBtn.color,
              }),
              title: "Listen in your language",
            },
            h(SvgIcon, { path: ICON_PATHS.speaker, size: 14 }),
            h("span", null, audioOn ? "Audio On" : "Listen")
          ),

          // Language selector
          h(
            "div",
            { style: { position: "relative" } },
            h(
              "button",
              {
                type: "button",
                onClick: () => setOpenMenu(openMenu === "lang" ? null : "lang"),
                style: pillBtn,
              },
              h(
                "span",
                null,
                app.currentLanguage === "hi"
                  ? "हिंदी · HI"
                  : app.currentLanguage === "pa"
                  ? "ਪੰਜਾਬੀ · PA"
                  : "EN · हिं · ਪੰ"
              )
            ),
            openMenu === "lang" &&
              h(
                "div",
                { style: popCardStyle },
                h(
                  "span",
                  {
                    style: {
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "1px",
                      color: isDark ? "#F5A524" : "#7A4E00",
                      padding: "4px 12px 6px",
                    },
                  },
                  "LANGUAGE"
                ),
                [
                  { code: "en", label: "English", sub: "EN" },
                  { code: "hi", label: "हिंदी", sub: "Hindi", hi: true },
                  { code: "pa", label: "ਪੰਜਾਬੀ", sub: "Punjabi" },
                ].map((lg) =>
                  h(
                    "button",
                    {
                      key: lg.code,
                      type: "button",
                      onClick: () => toggleLang(lg.code),
                      style: {
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "12px",
                        borderRadius: "14px",
                        border: 0,
                        textAlign: "left",
                        background:
                          app.currentLanguage === lg.code
                            ? isDark
                              ? "#2C2415"
                              : "#FFF0BF"
                            : "transparent",
                        color: isDark ? "#EDE6DA" : "#1C1913",
                      },
                    },
                    h(
                      "span",
                      { style: { flex: 1, display: "flex", flexDirection: "column" } },
                      h(
                        "b",
                        {
                          style: {
                            fontSize: "14px",
                            fontFamily: lg.hi ? "var(--kz-font-hindi)" : "inherit",
                          },
                        },
                        lg.label
                      ),
                      h("span", { style: { fontSize: "12px", color: isDark ? "#B0A899" : "#6F685D" } }, lg.sub)
                    ),
                    app.currentLanguage === lg.code ? "✓" : ""
                  )
                ),
                h(
                  "span",
                  { style: { padding: "8px 12px 4px", fontSize: "12px", color: isDark ? "#B0A899" : "#6F685D" } },
                  "Trade names show in both languages, e.g. Mason (राजमिस्त्री)"
                )
              )
          ),

          // Settings popover
          h(
            "div",
            { style: { position: "relative" } },
            h(
              "button",
              {
                type: "button",
                onClick: () => setOpenMenu(openMenu === "settings" ? null : "settings"),
                style: pillBtn,
                "aria-label": "Settings",
              },
              h(SvgIcon, { path: ICON_PATHS.settings, size: 14 }),
              !compact && h("span", { className: "hide-sm" }, "Settings")
            ),
            openMenu === "settings" &&
              h(
                "div",
                { style: popCardStyle },
                h(
                  "span",
                  {
                    style: {
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "1px",
                      color: isDark ? "#F5A524" : "#7A4E00",
                      padding: "4px 12px 6px",
                    },
                  },
                  "SETTINGS"
                ),
                // Dark mode row
                h(
                  "button",
                  {
                    type: "button",
                    onClick: () => app.toggleTheme?.(),
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px",
                      borderRadius: "14px",
                      border: 0,
                      background: "transparent",
                      textAlign: "left",
                      color: isDark ? "#EDE6DA" : "#1C1913",
                    },
                  },
                  h(
                    "span",
                    { style: { flex: 1, display: "flex", flexDirection: "column" } },
                    h("b", { style: { fontSize: "14px" } }, "Dark mode"),
                    h("span", { style: { fontSize: "12px", color: isDark ? "#B0A899" : "#6F685D" } }, "Easier on the eyes at night")
                  ),
                  h(
                    "span",
                    {
                      style: {
                        width: "44px",
                        height: "26px",
                        borderRadius: "999px",
                        background: isDark ? "#F5A524" : "#E5DCCB",
                        padding: "3px",
                        display: "flex",
                        justifyContent: isDark ? "flex-end" : "flex-start",
                      },
                    },
                    h("span", {
                      style: { width: "20px", height: "20px", borderRadius: "50%", background: "#FFFFFF" },
                    })
                  )
                ),
                // Voice assistant row
                h(
                  "button",
                  {
                    type: "button",
                    onClick: toggleAudio,
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px",
                      borderRadius: "14px",
                      border: 0,
                      background: "transparent",
                      textAlign: "left",
                      color: isDark ? "#EDE6DA" : "#1C1913",
                    },
                  },
                  h(
                    "span",
                    { style: { flex: 1, display: "flex", flexDirection: "column" } },
                    h("b", { style: { fontSize: "14px" } }, "Voice assistant"),
                    h("span", { style: { fontSize: "12px", color: isDark ? "#B0A899" : "#6F685D" } }, "Hear the app in your language")
                  ),
                  h(
                    "span",
                    {
                      style: {
                        padding: "5px 10px",
                        borderRadius: "999px",
                        background: "#1C1913",
                        color: "#F5A524",
                        fontSize: "11px",
                        fontWeight: 800,
                      },
                    },
                    audioOn ? "STOP" : "PLAY"
                  )
                ),
                // Admin portal link
                h(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setOpenMenu(null);
                      navigate("/admin", { role: "admin" });
                    },
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px",
                      borderRadius: "14px",
                      border: 0,
                      background: "transparent",
                      textAlign: "left",
                      color: isDark ? "#EDE6DA" : "#1C1913",
                    },
                  },
                  h(
                    "span",
                    { style: { flex: 1, display: "flex", flexDirection: "column" } },
                    h("b", { style: { fontSize: "14px" } }, "Admin Portal"),
                    h("span", { style: { fontSize: "12px", color: isDark ? "#B0A899" : "#6F685D" } }, "KYC verification & escrow console")
                  ),
                  h("span", { style: { padding: "5px 10px", borderRadius: "999px", background: "#FFF0BF", color: "#6B4600", fontSize: "11px", fontWeight: 800 } }, "ADMIN")
                ),
                // Investor Pitch
                h(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setOpenMenu(null);
                      navigate("/pitch", { role: "pitch_deck" });
                    },
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px",
                      borderRadius: "14px",
                      border: 0,
                      background: "transparent",
                      textAlign: "left",
                      color: isDark ? "#EDE6DA" : "#1C1913",
                    },
                  },
                  h(
                    "span",
                    { style: { flex: 1, display: "flex", flexDirection: "column" } },
                    h("b", { style: { fontSize: "14px" } }, "Investor Pitch Deck"),
                    h("span", { style: { fontSize: "12px", color: isDark ? "#B0A899" : "#6F685D" } }, "Kaamzo overview & metrics")
                  ),
                  "→"
                ),
                // Terms
                h(
                  "a",
                  {
                    href: "https://kaamzo-terms.vercel.app/",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "12px",
                      borderRadius: "14px",
                      textDecoration: "none",
                      color: isDark ? "#EDE6DA" : "#1C1913",
                    },
                  },
                  h("span", { style: { flex: 1 } }, h("b", { style: { fontSize: "14px" } }, "Terms & conditions")),
                  "↗"
                )
              )
          ),

          // Profile & Account menu
          h(
            "div",
            { style: { position: "relative" } },
            h(
              "button",
              {
                type: "button",
                onClick: () => setOpenMenu(openMenu === "profile" ? null : "profile"),
                style: Object.assign({}, pillBtn, {
                  padding: "0 12px 0 4px",
                  background: activeUser ? "#1C1913" : pillBtn.background,
                  color: activeUser ? "#FBF8F2" : pillBtn.color,
                  borderColor: activeUser ? "#1C1913" : pillBtn.borderColor,
                }),
              },
              h(
                "span",
                {
                  style: {
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: activeUser ? "#F5A524" : "#FFF0BF",
                    color: "#1C1913",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    fontSize: "12px",
                  },
                },
                (activeUser?.name || "G").slice(0, 1).toUpperCase()
              ),
              h("span", null, activeUser ? activeUser.name.split(" ")[0] : "Sign in")
            ),
            openMenu === "profile" &&
              h(
                "div",
                { style: popCardStyle },
                h(
                  "span",
                  {
                    style: {
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "1px",
                      color: isDark ? "#F5A524" : "#7A4E00",
                      padding: "4px 12px 6px",
                    },
                  },
                  "PROFILE & ACCOUNT"
                ),
                h(
                  "div",
                  { style: { display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px" } },
                  h(
                    "span",
                    {
                      style: {
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        background: "#1C1913",
                        color: "#F5A524",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 800,
                        fontSize: "16px",
                      },
                    },
                    (activeUser?.name || "K").slice(0, 1).toUpperCase()
                  ),
                  h(
                    "span",
                    { style: { display: "flex", flexDirection: "column" } },
                    h("b", null, activeUser ? activeUser.name : "Not signed in"),
                    h(
                      "span",
                      { style: { fontSize: "12px", color: isDark ? "#B0A899" : "#6F685D" } },
                      `${roleLabel} · ${app.currentCity?.name || "Ludhiana"}`
                    )
                  )
                ),
                activeUser &&
                  h(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        setOpenMenu(null);
                        if (app.currentRole === "worker") navigate("/worker/account-and-pay", { role: "worker" });
                        else navigate("/customer/my-bookings", { role: "customer" });
                      },
                      style: {
                        padding: "12px",
                        borderRadius: "14px",
                        border: 0,
                        background: "transparent",
                        textAlign: "left",
                        fontWeight: 700,
                        fontSize: "14px",
                        color: isDark ? "#EDE6DA" : "#1C1913",
                      },
                    },
                    app.currentRole === "worker" ? "Account, KYC & UPI" : "My profile & bookings"
                  ),
                h(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setOpenMenu(null);
                      const next = app.currentRole === "worker" ? "customer" : "worker";
                      navigate(next === "worker" ? "/worker" : "/customer", { role: next });
                    },
                    style: {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px",
                      borderRadius: "14px",
                      border: 0,
                      background: "transparent",
                      textAlign: "left",
                      color: isDark ? "#EDE6DA" : "#1C1913",
                    },
                  },
                  h(
                    "span",
                    { style: { display: "flex", flexDirection: "column" } },
                    h("b", { style: { fontSize: "14px" } }, "Switch role"),
                    h("span", { style: { fontSize: "12px", color: isDark ? "#B0A899" : "#6F685D" } }, "Customer ⇄ Worker")
                  ),
                  "⇄"
                ),
                h(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setOpenMenu(null);
                      navigate("/register");
                    },
                    style: {
                      padding: "12px",
                      borderRadius: "14px",
                      border: 0,
                      background: isDark ? "#2C2415" : "#FFF0BF",
                      textAlign: "left",
                      fontWeight: 800,
                      fontSize: "14px",
                      color: isDark ? "#F5A524" : "#6B4600",
                    },
                  },
                  activeUser ? "Register or switch account" : "Register or Sign in"
                ),
                activeUser &&
                  h(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        setOpenMenu(null);
                        if (app.currentRole === "worker") app.logoutWorker?.();
                        else app.logoutCustomer?.();
                        navigate("/", { role: "select_role" });
                      },
                      style: {
                        padding: "12px",
                        borderRadius: "14px",
                        border: 0,
                        background: "transparent",
                        textAlign: "left",
                        fontWeight: 700,
                        fontSize: "14px",
                        color: "#B42318",
                      },
                    },
                    "Sign out"
                  )
              )
          )
        )
      ),
      audioOn &&
        h(
          "div",
          {
            style: {
              background: "#1C1913",
              color: "#FBF8F2",
              padding: "10px 20px",
            },
          },
          h(
            "div",
            {
              style: {
                maxWidth: "1240px",
                margin: "0 auto",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                flexWrap: "wrap",
              },
            },
            h(
              "span",
              {
                style: {
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "#F5A524",
                  color: "#1C1913",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                },
              },
              h(SvgIcon, { path: ICON_PATHS.speaker, size: 18 })
            ),
            h(
              "span",
              { style: { flex: 1, display: "flex", flexDirection: "column" } },
              h("b", { style: { fontSize: "14px" } }, "Audio reader on"),
              h("span", { style: { fontSize: "12px", color: "#CFC6B8" } }, "Tap any word or job card on screen to hear it read aloud")
            ),
            h(
              "button",
              {
                type: "button",
                onClick: stopAudio,
                style: {
                  height: "34px",
                  padding: "0 12px",
                  borderRadius: "999px",
                  border: "1px solid #3A342C",
                  background: "transparent",
                  color: "#FBF8F2",
                  fontWeight: 700,
                  fontSize: "12px",
                },
              },
              "Stop"
            ),
            h(
              "button",
              {
                type: "button",
                onClick: () => {
                  stopAudio();
                  if (typeof window.kaamzoToggleAudioReader === "function") {
                    try {
                      window.kaamzoToggleAudioReader();
                    } catch (_) {}
                  }
                },
                style: {
                  height: "34px",
                  padding: "0 12px",
                  borderRadius: "999px",
                  border: 0,
                  background: "#FBF8F2",
                  color: "#1C1913",
                  fontWeight: 800,
                  fontSize: "12px",
                },
              },
              "Exit"
            )
          )
        )
    );
  }

  function GlobalOtpModal({ config, onClose }) {
    const app = useApp();
    const isDark = app.isDarkMode;
    const [digits, setDigits] = useState(["", "", "", "", "", ""]);
    const [sending, setSending] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [status, setStatus] = useState("");
    const [countdown, setCountdown] = useState(0);
    const inputRefs = useRef([]);

    const sendCode = async () => {
      if (!config?.email) return;
      setSending(true);
      setStatus("");
      try {
        const res = await fetch("/api/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: config.email,
            purpose: config.purpose || "email_verification",
            role: config.role || "customer",
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success !== false) {
          setStatus("6-digit verification code sent to " + config.email);
          setCountdown(30);
        } else {
          setStatus(data.error || "Could not send code right now.");
        }
      } catch (err) {
        setStatus("Network error sending code.");
      }
      setSending(false);
    };

    useEffect(() => {
      if (!config) return;
      setDigits(["", "", "", "", "", ""]);
      setCountdown(0);
      if (config.autoSend !== false) sendCode();
    }, [config?.email]);

    useEffect(() => {
      if (countdown <= 0) return;
      const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }, [countdown]);

    if (!config) return null;

    const handleDigitChange = (idx, val) => {
      const clean = String(val || "").replace(/[^0-9]/g, "");
      if (clean.length > 1) {
        const next = clean.slice(0, 6).split("");
        while (next.length < 6) next.push("");
        setDigits(next);
        const lastIdx = Math.min(5, clean.length - 1);
        inputRefs.current[lastIdx]?.focus?.();
        return;
      }
      const next = [...digits];
      next[idx] = clean;
      setDigits(next);
      if (clean && idx < 5) inputRefs.current[idx + 1]?.focus?.();
    };

    const handleVerify = async () => {
      const code = digits.join("");
      if (code.length !== 6) {
        setStatus("Please enter all 6 digits.");
        return;
      }
      setVerifying(true);
      try {
        const res = await fetch("/api/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: config.email, code }),
        });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.verified) {
          window.__kzOtpTokens = window.__kzOtpTokens || {};
          if (data.token) window.__kzOtpTokens[config.email] = data.token;
          app.showNotification?.("Gmail verified successfully!");
          config.onVerified?.(data);
          onClose();
        } else {
          setStatus(data.error || "Invalid or expired 6-digit code.");
        }
      } catch (_) {
        setStatus("Verification error. Please try again.");
      }
      setVerifying(false);
    };

    return h(
      "div",
      {
        style: {
          position: "fixed",
          inset: 0,
          background: "rgba(28,25,19,0.58)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          zIndex: 120,
        },
        onClick: (e) => {
          if (e.target === e.currentTarget) onClose();
        },
      },
      h(
        "div",
        {
          style: {
            width: "100%",
            maxWidth: "420px",
            borderRadius: "24px",
            background: isDark ? "#1F1C17" : "#FFFFFF",
            color: isDark ? "#EDE6DA" : "#1C1913",
            border: "1px solid " + (isDark ? "#2E2A22" : "#EFE7DA"),
            boxShadow: "0 20px 44px rgba(80,50,10,0.22)",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          },
        },
        h(
          "div",
          { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
          h("span", { style: { fontSize: "12px", fontWeight: 800, letterSpacing: "1px", color: isDark ? "#F5A524" : "#7A4E00" } }, "VERIFY GMAIL · 6-DIGIT OTP"),
          h(
            "button",
            {
              type: "button",
              onClick: onClose,
              style: { border: 0, background: "transparent", color: isDark ? "#EDE6DA" : "#1C1913", fontSize: "18px", fontWeight: 800 },
              "aria-label": "Close OTP modal",
            },
            "✕"
          )
        ),
        h("b", { style: { fontSize: "20px" } }, "Check your Gmail"),
        h("span", { style: { fontSize: "13px", color: isDark ? "#B0A899" : "#4A443A" } }, "We sent a 6-digit code to " + (config.email || "you@gmail.com")),
        h(
          "div",
          { style: { display: "grid", gridTemplateColumns: "repeat(6,minmax(0,1fr))", gap: "8px" } },
          digits.map((d, idx) =>
            h("input", {
              key: idx,
              ref: (el) => (inputRefs.current[idx] = el),
              type: "text",
              inputMode: "numeric",
              maxLength: 6,
              value: d,
              onChange: (e) => handleDigitChange(idx, e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Backspace" && !d && idx > 0) inputRefs.current[idx - 1]?.focus?.();
              },
              style: {
                height: "52px",
                width: "100%",
                textAlign: "center",
                borderRadius: "14px",
                border: "2px solid " + (d ? "#E8930C" : isDark ? "#3A342C" : "#E5DCCB"),
                background: isDark ? "#14120E" : "#FBF8F2",
                color: isDark ? "#EDE6DA" : "#1C1913",
                fontSize: "22px",
                fontWeight: 800,
              },
            })
          )
        ),
        status &&
          h("span", { style: { fontSize: "12px", fontWeight: 700, color: status.includes("sent") ? "#1D6B36" : "#B42318" } }, status),
        h(
          "button",
          {
            type: "button",
            disabled: verifying,
            onClick: handleVerify,
            style: {
              height: "50px",
              padding: "0 22px",
              borderRadius: "999px",
              fontWeight: 800,
              fontSize: "15px",
              border: 0,
              background: "#F5A524",
              color: "#1C1913",
            },
          },
          verifying ? "Verifying…" : "Verify Gmail"
        ),
        h(
          "div",
          { style: { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: isDark ? "#B0A899" : "#6F685D" } },
          h("span", null, countdown > 0 ? `Didn’t get it? Resend in 0:${String(countdown).padStart(2, "0")}` : "Didn’t get the code?"),
          h(
            "button",
            {
              type: "button",
              disabled: sending || countdown > 0,
              onClick: sendCode,
              style: { border: 0, background: "transparent", color: isDark ? "#F5A524" : "#7A4E00", fontWeight: 800, textDecoration: "underline" },
            },
            sending ? "Sending…" : "Resend code"
          )
        )
      )
    );
  }

  function HelpAndSupportFloating() {
    const app = useApp();
    const isDark = app.isDarkMode;
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState("price"); // "price" | "help"
    const [inputVal, setInputVal] = useState("");
    const [busy, setBusy] = useState(false);
    const [lastEstimate, setLastEstimate] = useState(null);
    const [messages, setMessages] = useState([
      {
        id: "welcome",
        sender: "bot",
        text: "Hi! Tell me any home or site job (English or Hinglish) and I'll calculate a fair Ludhiana rate + time estimate.",
        estimate: null,
      },
    ]);

    const QUICK_PROMPTS = [
      "Fix leaking kitchen tap",
      "Install 2 ceiling fans",
      "Paint 2 bedrooms",
      "AC service & check",
    ];

    const sendPriceQuery = async (rawText) => {
      const text = String(rawText || inputVal || "").trim();
      if (!text || busy) return;
      setInputVal("");
      const userMsg = { id: "u_" + Date.now(), sender: "user", text };
      setMessages((prev) => prev.concat([userMsg]));
      setBusy(true);
      try {
        const res = await fetch("/api/estimate-job", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: text,
            city: app.currentCity?.name || "Ludhiana",
            previousEstimate: lastEstimate,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || data.rejected) {
          setMessages((prev) =>
            prev.concat([
              {
                id: "b_" + Date.now(),
                sender: "bot",
                text: data.reason || data.reply || "Please describe the work in a few words (e.g. 'Fix 2 fans and 1 switchboard').",
                estimate: null,
              },
            ])
          );
        } else {
          setLastEstimate(data);
          setMessages((prev) =>
            prev.concat([
              {
                id: "b_" + Date.now(),
                sender: "bot",
                text: data.reply || `Estimated ₹${data.suggestedPrice} for ${data.trade}.`,
                estimate: data,
              },
            ])
          );
        }
      } catch (_) {
        setMessages((prev) =>
          prev.concat([
            {
              id: "b_" + Date.now(),
              sender: "bot",
              text: "Could not reach the price estimator right now. Please try again in a moment.",
              estimate: null,
            },
          ])
        );
      } finally {
        setBusy(false);
      }
    };

    const applyEstimateToPostJob = (est) => {
      if (!est) return;
      KZ.prefillPostJob = {
        trade: est.trade || "Plumber",
        title: est.taskLabel || est.summaryTitle || "",
        description: est.originalPrompt || "",
        dailyWage: est.suggestedWage || est.suggestedPrice || 850,
        durationDays: est.estimatedDays || 1,
        aiNote: est.reply || "",
      };
      setOpen(false);
      navigate("/customer/post-a-job", { role: "customer" });
    };

    const borderCol = isDark ? "#2E2A22" : "#EFE7DA";

    return h(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "10px",
        },
        className: "kz-help-float",
      },
      open &&
        h(
          "div",
          {
            style: {
              width: "min(360px, calc(100vw - 28px))",
              maxHeight: "min(560px, calc(100vh - 110px))",
              borderRadius: "24px",
              background: isDark ? "#1F1C17" : "#FFFFFF",
              color: isDark ? "#EDE6DA" : "#1C1913",
              border: "1px solid " + borderCol,
              boxShadow: "0 22px 50px rgba(40,25,5,0.22)",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              overflow: "hidden",
            },
          },
          h(
            "div",
            { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" } },
            h(
              "div",
              { style: { display: "flex", gap: "6px", background: isDark ? "#14120E" : "#F7F2EA", padding: "4px", borderRadius: "999px" } },
              h(
                "button",
                {
                  type: "button",
                  onClick: () => setTab("price"),
                  style: {
                    height: "32px",
                    padding: "0 12px",
                    borderRadius: "999px",
                    border: 0,
                    background: tab === "price" ? "#1C1913" : "transparent",
                    color: tab === "price" ? "#F5A524" : isDark ? "#CFC6B8" : "#4A443A",
                    fontWeight: 800,
                    fontSize: "12px",
                    cursor: "pointer",
                  },
                },
                "AI Price Bot"
              ),
              h(
                "button",
                {
                  type: "button",
                  onClick: () => setTab("help"),
                  style: {
                    height: "32px",
                    padding: "0 12px",
                    borderRadius: "999px",
                    border: 0,
                    background: tab === "help" ? "#1C1913" : "transparent",
                    color: tab === "help" ? "#FBF8F2" : isDark ? "#CFC6B8" : "#4A443A",
                    fontWeight: 800,
                    fontSize: "12px",
                    cursor: "pointer",
                  },
                },
                "Support & SOS"
              )
            ),
            h(
              "button",
              {
                type: "button",
                onClick: () => setOpen(false),
                style: { border: 0, background: "transparent", color: isDark ? "#EDE6DA" : "#1C1913", fontWeight: 800, fontSize: "16px", cursor: "pointer", padding: "4px 6px" },
              },
              "✕"
            )
          ),

          tab === "price"
            ? h(
                "div",
                { style: { display: "flex", flexDirection: "column", gap: "10px", minHeight: 0, flex: 1 } },
                h(
                  "div",
                  {
                    style: {
                      flex: 1,
                      minHeight: "220px",
                      maxHeight: "310px",
                      overflowY: "auto",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      paddingRight: "2px",
                    },
                  },
                  messages.map((m) =>
                    h(
                      "div",
                      {
                        key: m.id,
                        style: {
                          alignSelf: m.sender === "user" ? "flex-end" : "flex-start",
                          maxWidth: "92%",
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                        },
                      },
                      h(
                        "div",
                        {
                          style: {
                            padding: "10px 13px",
                            borderRadius: m.sender === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                            background: m.sender === "user" ? "#1C1913" : isDark ? "#27231C" : "#FBF8F2",
                            color: m.sender === "user" ? "#FBF8F2" : isDark ? "#EDE6DA" : "#1C1913",
                            border: m.sender === "user" ? "none" : "1px solid " + borderCol,
                            fontSize: "13px",
                            lineHeight: 1.45,
                            fontWeight: m.sender === "user" ? 600 : 500,
                          },
                        },
                        m.text
                      ),
                      m.estimate &&
                        h(
                          "div",
                          {
                            style: {
                              padding: "12px",
                              borderRadius: "16px",
                              background: isDark ? "#242019" : "#FFF7E3",
                              border: "1px solid #F5A524",
                              display: "flex",
                              flexDirection: "column",
                              gap: "8px",
                              fontSize: "12px",
                            },
                          },
                          h(
                            "div",
                            { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" } },
                            h("span", { style: { padding: "3px 8px", borderRadius: "999px", background: "#1C1913", color: "#F5A524", fontWeight: 800, fontSize: "11px" } }, m.estimate.trade),
                            h("span", { style: { fontWeight: 700, color: isDark ? "#CFC6B8" : "#6B4600" } }, m.estimate.estimatedTime)
                          ),
                          h(
                            "div",
                            { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline" } },
                            h("b", { style: { fontSize: "20px", color: isDark ? "#FBF8F2" : "#1C1913" } }, formatInr(m.estimate.suggestedPrice)),
                            h("span", { style: { color: isDark ? "#A49B8C" : "#6F685D", fontWeight: 600 } }, `Range ${formatInr(m.estimate.minPrice)}–${formatInr(m.estimate.maxPrice)}`)
                          ),
                          Array.isArray(m.estimate.breakdown) &&
                            m.estimate.breakdown.map((row, rIdx) =>
                              h(
                                "div",
                                { key: rIdx, style: { display: "flex", justifyContent: "space-between", fontSize: "11px", color: isDark ? "#CFC6B8" : "#4A443A" } },
                                h("span", null, row.label),
                                h("b", null, formatInr(row.amount))
                              )
                            ),
                          Array.isArray(m.estimate.followUps) &&
                            m.estimate.followUps.length > 0 &&
                            h(
                              "div",
                              { style: { display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "2px" } },
                              m.estimate.followUps.map((fu) =>
                                h(
                                  "button",
                                  {
                                    key: fu,
                                    type: "button",
                                    onClick: () => sendPriceQuery(fu),
                                    style: {
                                      padding: "4px 9px",
                                      borderRadius: "999px",
                                      border: "1px solid " + borderCol,
                                      background: isDark ? "#1F1C17" : "#FFFFFF",
                                      color: isDark ? "#EDE6DA" : "#1C1913",
                                      fontSize: "11px",
                                      fontWeight: 700,
                                      cursor: "pointer",
                                    },
                                  },
                                  "+ " + fu
                                )
                              )
                            ),
                          h(
                            "button",
                            {
                              type: "button",
                              onClick: () => applyEstimateToPostJob(m.estimate),
                              style: {
                                marginTop: "4px",
                                height: "36px",
                                borderRadius: "999px",
                                border: 0,
                                background: "#2E9E57",
                                color: "#FFFFFF",
                                fontWeight: 800,
                                fontSize: "12px",
                                cursor: "pointer",
                              },
                            },
                            `Post this Job at ${formatInr(m.estimate.suggestedWage || m.estimate.suggestedPrice)}/day →`
                          )
                        )
                    )
                  ),
                  busy &&
                    h("span", { style: { fontSize: "12px", color: isDark ? "#A49B8C" : "#6F685D", fontWeight: 700 } }, "Calculating fair Ludhiana rate…")
                ),

                messages.length <= 1 &&
                  h(
                    "div",
                    { style: { display: "flex", flexWrap: "wrap", gap: "6px" } },
                    QUICK_PROMPTS.map((qp) =>
                      h(
                        "button",
                        {
                          key: qp,
                          type: "button",
                          onClick: () => sendPriceQuery(qp),
                          style: {
                            padding: "6px 10px",
                            borderRadius: "999px",
                            border: "1px solid " + borderCol,
                            background: isDark ? "#27231C" : "#FBF8F2",
                            color: isDark ? "#EDE6DA" : "#1C1913",
                            fontSize: "11px",
                            fontWeight: 700,
                            cursor: "pointer",
                          },
                        },
                        qp
                      )
                    )
                  ),

                h(
                  "form",
                  {
                    onSubmit: (e) => {
                      e.preventDefault();
                      sendPriceQuery(inputVal);
                    },
                    style: { display: "flex", gap: "6px", alignItems: "center" },
                  },
                  h("input", {
                    type: "text",
                    value: inputVal,
                    onChange: (e) => setInputVal(e.target.value),
                    placeholder: "e.g. Install 2 fans or paint 2 rooms…",
                    style: {
                      flex: 1,
                      height: "40px",
                      borderRadius: "999px",
                      border: "1px solid " + borderCol,
                      padding: "0 14px",
                      fontSize: "13px",
                      background: isDark ? "#14120E" : "#FBF8F2",
                      color: isDark ? "#EDE6DA" : "#1C1913",
                    },
                  }),
                  h(
                    "button",
                    {
                      type: "submit",
                      disabled: busy,
                      style: {
                        height: "40px",
                        padding: "0 16px",
                        borderRadius: "999px",
                        border: 0,
                        background: "#F5A524",
                        color: "#1C1913",
                        fontWeight: 800,
                        fontSize: "13px",
                        cursor: "pointer",
                      },
                    },
                    "Ask"
                  )
                )
              )
            : h(
                "div",
                { style: { display: "flex", flexDirection: "column", gap: "10px" } },
                h(
                  "a",
                  {
                    href: "https://wa.me/919592221100?text=Hi%20Kaamzo%20Support%2C%20I%20need%20help%20on%20kaamzo.site",
                    target: "_blank",
                    rel: "noopener noreferrer",
                    style: {
                      height: "46px",
                      padding: "0 20px",
                      borderRadius: "999px",
                      fontWeight: 800,
                      fontSize: "14px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textDecoration: "none",
                      background: "#2E9E57",
                      color: "#FFFFFF",
                    },
                  },
                  "WhatsApp us"
                ),
                h(
                  "a",
                  {
                    href: "tel:+919592221100",
                    style: {
                      height: "46px",
                      padding: "0 20px",
                      borderRadius: "999px",
                      fontWeight: 800,
                      fontSize: "14px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textDecoration: "none",
                      background: "#1C1913",
                      color: "#FBF8F2",
                    },
                  },
                  "Call +91 95922 21100"
                ),
                h(
                  "button",
                  {
                    type: "button",
                    onClick: () => {
                      setOpen(false);
                      app.openGlobalChat?.(
                        null,
                        { name: "Kaamzo Support", phone: "+91 95922 21100", role: "support" },
                        app.currentRole === "worker" ? "worker" : "customer"
                      );
                    },
                    style: {
                      height: "46px",
                      padding: "0 20px",
                      borderRadius: "999px",
                      fontWeight: 800,
                      fontSize: "14px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1px solid " + (isDark ? "#3A342C" : "#E5DCCB"),
                      background: isDark ? "#14120E" : "#FFFFFF",
                      color: isDark ? "#EDE6DA" : "#1C1913",
                    },
                  },
                  "Live support chat"
                ),
                h(
                  "a",
                  {
                    href: "mailto:support@kaamzo.in",
                    style: {
                      height: "42px",
                      padding: "0 18px",
                      borderRadius: "999px",
                      fontWeight: 700,
                      fontSize: "13px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textDecoration: "none",
                      border: "1px solid " + (isDark ? "#3A342C" : "#E5DCCB"),
                      background: "transparent",
                      color: isDark ? "#EDE6DA" : "#1C1913",
                    },
                  },
                  "Email support@kaamzo.in"
                ),
                h(
                  "a",
                  {
                    href: "tel:112",
                    style: {
                      height: "46px",
                      padding: "0 20px",
                      borderRadius: "999px",
                      fontWeight: 800,
                      fontSize: "14px",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      textDecoration: "none",
                      background: "#FFE1E1",
                      color: "#8A1C1C",
                    },
                  },
                  "SOS · Dial 112"
                )
              )
        ),
      h(
        "button",
        {
          type: "button",
          onClick: () => setOpen((v) => !v),
          style: {
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            height: "48px",
            padding: "0 18px",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "#1C1913",
            color: "#FBF8F2",
            fontWeight: 800,
            fontSize: "14px",
            boxShadow: "0 12px 28px rgba(28,25,19,0.22)",
            cursor: "pointer",
          },
        },
        h("span", { style: { width: "9px", height: "9px", borderRadius: "50%", background: "#F5A524" } }),
        "AI Price Bot & Help"
      )
    );
  }

  function KaamzoFooter() {
    const linkStyle = { color: "#D9CFC2", textDecoration: "none", fontWeight: 600 };
    return h(
      "footer",
      { style: { background: "#1C1620", color: "#D9CFC2", overflow: "hidden", marginTop: "auto" } },
      h(
        "div",
        {
          style: {
            maxWidth: "1240px",
            margin: "0 auto",
            padding: "48px 24px 0",
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "14px",
          },
        },
        h("span", null, "© 2026 Kaamzo Technologies India"),
        h(
          "nav",
          { "aria-label": "Footer", style: { display: "flex", flexWrap: "wrap", gap: "20px" } },
          h(
            "a",
            {
              href: "/customer",
              style: linkStyle,
              onClick: (e) => {
                e.preventDefault();
                navigate("/customer", { role: "customer" });
              },
            },
            "Customer login"
          ),
          h(
            "a",
            {
              href: "/worker",
              style: linkStyle,
              onClick: (e) => {
                e.preventDefault();
                navigate("/worker", { role: "worker" });
              },
            },
            "Worker login"
          ),
          h(
            "a",
            {
              href: "/jobs",
              style: linkStyle,
              onClick: (e) => {
                e.preventDefault();
                navigate("/jobs", { role: "worker" });
              },
            },
            "Jobs"
          ),
          h(
            "a",
            {
              href: "/admin",
              style: linkStyle,
              onClick: (e) => {
                e.preventDefault();
                navigate("/admin", { role: "admin" });
              },
            },
            "Admin"
          ),
          h(
            "a",
            {
              href: "/pitch",
              style: linkStyle,
              onClick: (e) => {
                e.preventDefault();
                navigate("/pitch", { role: "pitch_deck" });
              },
            },
            "Investor Pitch"
          ),
          h(
            "a",
            {
              href: "https://kaamzo-terms.vercel.app/",
              target: "_blank",
              rel: "noopener noreferrer",
              style: linkStyle,
            },
            "Terms"
          ),
          h("a", { href: "mailto:support@kaamzo.in", style: linkStyle }, "support@kaamzo.in")
        )
      ),
      h(
        "div",
        {
          "aria-hidden": "true",
          style: {
            textAlign: "center",
            fontWeight: 800,
            fontSize: "clamp(90px, 21vw, 300px)",
            lineHeight: 0.8,
            letterSpacing: "-0.06em",
            color: "rgba(251,248,242,0.07)",
            paddingTop: "30px",
            marginBottom: "-0.12em",
            userSelect: "none",
          },
        },
        "kaamzo."
      )
    );
  }

  async function launchRazorpayCheckout(job, app) {
    if (!job) return;
    const fullAmount = (Number(job.dailyWage) || 850) * (Number(job.durationDays) || 1);
    const cust = app.currentCustomer;

    const loadScript = () =>
      new Promise((resolve, reject) => {
        if (window.Razorpay) return resolve(true);
        const s = document.createElement("script");
        s.src = "https://checkout.razorpay.com/v1/checkout.js";
        s.async = true;
        s.onload = () => resolve(true);
        s.onerror = () => reject(new Error("Could not load Razorpay Checkout script."));
        document.head.appendChild(s);
      });

    try {
      await loadScript();
      app.showNotification?.("Creating Razorpay test order…");
      const orderResp = await fetch("/api/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createOrder",
          jobId: job.id,
          amountInr: fullAmount,
          customerName: cust?.name || job.customerName || "Customer",
          customerPhone: cust?.phone || job.customerPhone || "+91 98101 00000",
          customerEmail: cust?.email || "",
          jobSnapshot: job,
        }),
      });
      const orderData = await orderResp.json().catch(() => ({}));
      if (!orderResp.ok || !orderData.success || !orderData.order) {
        throw new Error(orderData.error || "Failed to initialize Razorpay order.");
      }

      const cleanContact = String(cust?.phone || job.customerPhone || "9810100000")
        .replace(/[^0-9]/g, "")
        .slice(-10);

      const options = {
        key: orderData.keyId,
        amount: orderData.order.amount,
        currency: orderData.order.currency || "INR",
        name: "Kaamzo",
        description: `${job.title || "Work Order"} · ${job.trade || "Service"}`,
        order_id: orderData.order.id,
        prefill: {
          name: cust?.name || job.customerName || "Kaamzo Customer",
          email: cust?.email || "customer@kaamzo.site",
          contact: cleanContact || "9810100000",
        },
        notes: {
          jobId: String(job.id),
          workerId: String(job.assignedWorkerId || ""),
          workerUpi: String(job.assignedWorkerUpi || ""),
        },
        theme: { color: "#F5A524" },
        handler: async function (response) {
          try {
            app.showNotification?.("Verifying Razorpay signature & settling worker payout…");
            const vResp = await fetch("/api/razorpay", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "verifyPayment",
                jobId: job.id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                rating: 5,
                review: "Paid via Razorpay Checkout (Test Mode)",
                amountInr: fullAmount,
                workerUpi: job.assignedWorkerUpi || "",
                jobSnapshot: job,
              }),
            });
            const vData = await vResp.json().catch(() => ({}));
            if (!vResp.ok || !vData.verified) {
              throw new Error(vData.error || "Signature verification failed.");
            }
            job.razorpayOrderId = response.razorpay_order_id;
            job.razorpayPaymentId = response.razorpay_payment_id;
            job.razorpayPayoutId = vData.payout?.id || job.razorpayPayoutId;
            job.razorpayPayoutStatus = vData.payout?.status || "processed_test_mode";
            job.paymentStatus = "paid_and_settled";
            app.releasePaymentByCustomer?.(
              job.id,
              5,
              `Paid via Razorpay Checkout (${response.razorpay_payment_id})`,
              "RAZORPAY_CHECKOUT_UPI",
              response.razorpay_payment_id,
              ["Paid via Razorpay", "UPI Settled"]
            );
            app.showNotification?.(`Paid ₹${fullAmount}! Payment ID: ${response.razorpay_payment_id}`);
          } catch (err) {
            app.showNotification?.("Verification error: " + (err?.message || "Please retry"));
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (resp) {
        const msg = resp?.error?.description || "Test payment declined or cancelled.";
        app.showNotification?.("Razorpay payment failed: " + msg);
      });
      rzp.open();
    } catch (err) {
      app.showNotification?.("Razorpay error: " + (err?.message || "Unable to open checkout"));
    }
  }

  function JobProgressPipeline({ job, isDark }) {
    if (!job) return null;
    const st = job.status || "broadcast";
    let step = 1;
    if (st === "accepted" || st === "approved" || st === "in_progress") step = 2;
    else if (st === "completed_pending_payment") step = job.paymentStatus === "order_created" ? 4 : 3;
    else if (st === "paid_and_closed" || job.isPaid) step = 5;

    const stages = [
      { n: 1, label: "Booked" },
      { n: 2, label: "Assigned" },
      { n: 3, label: "Completed & UPI" },
      { n: 4, label: "Razorpay Pay" },
      { n: 5, label: "Paid & Settled" },
    ];

    return h(
      "div",
      {
        style: {
          padding: "12px 14px",
          borderRadius: "16px",
          background: isDark ? "#27231C" : "#FBF8F2",
          border: "1px solid " + (isDark ? "#3A342C" : "#EFE7DA"),
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        },
      },
      h(
        "div",
        { style: { display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" } },
        stages.map((s) => {
          const done = step >= s.n;
          return h(
            "span",
            {
              key: s.n,
              style: {
                padding: "4px 10px",
                borderRadius: "999px",
                fontSize: "11px",
                fontWeight: 800,
                background:
                  step === 5 && s.n === 5
                    ? "#2E9E57"
                    : done
                    ? step === s.n
                      ? "#F5A524"
                      : "#E3F4E8"
                    : isDark
                    ? "#1F1C17"
                    : "#EFE7DA",
                color:
                  step === 5 && s.n === 5
                    ? "#FFFFFF"
                    : done
                    ? step === s.n
                      ? "#1C1913"
                      : "#1D6B36"
                    : isDark
                    ? "#A49B8C"
                    : "#6F685D",
              },
            },
            (done ? "✓ " : "") + s.label
          );
        })
      ),
      (job.assignedWorkerUpi || job.razorpayPaymentId || job.transactionRef) &&
        h(
          "div",
          {
            style: {
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              fontSize: "11px",
              fontWeight: 700,
              color: isDark ? "#CFC6B8" : "#4A443A",
            },
          },
          job.assignedWorkerUpi && h("span", null, "Worker UPI: " + job.assignedWorkerUpi),
          (job.razorpayPaymentId || (job.transactionRef && String(job.transactionRef).startsWith("pay_"))) &&
            h("span", { style: { color: "#1D6B36" } }, "Razorpay ID: " + (job.razorpayPaymentId || job.transactionRef)),
          job.razorpayOrderId && h("span", null, "Order: " + job.razorpayOrderId)
        )
    );
  }

  // Export core toolkit + MainApp shell
  Object.assign(KZ.utils, {
    getCtx,
    getReact,
    h,
    Frag,
    useApp,
    useState,
    useEffect,
    useRef,
    useMemo,
    useCallback,
    ICON_PATHS,
    TRADES,
    LUDHIANA_AREAS,
    normalizeTrade,
    getTradeMeta,
    getLiveTradeRate,
    haversineKm,
    formatInr,
    milestoneBonusPct,
    nextMilestoneTarget,
    isJobWithin10Km,
    getJobDistanceKm,
    normalizePathname,
    navigate,
    useRoute,
    launchRazorpayCheckout,
  });

  Object.assign(KZ.components, {
    HeroWorkSceneSvg,
    TradeIllustration,
    SvgIcon,
    KaamzoLogo,
    TopUtilityBar,
    GlobalOtpModal,
    HelpAndSupportFloating,
    KaamzoFooter,
    JobProgressPipeline,
  });

  function FallbackView({ path }) {
    return h(
      "div",
      { style: { padding: "64px 24px", textAlign: "center", fontFamily: "var(--kz-font-ui)" } },
      h("h2", { style: { fontSize: "28px", fontWeight: 800 } }, "Loading Kaamzo view…"),
      h("p", { style: { color: "#6F685D" } }, path)
    );
  }

  function LoginRequiredModal({ config, onClose }) {
    const app = useApp();
    const isDark = app.isDarkMode;
    const [ssoLoading, setSsoLoading] = useState(false);

    if (!config) return null;

    const targetRole = config.role === "worker" ? "worker" : "customer";
    const headingPrefix = config.headingPrefix || "Login to ";
    const headingAccent = config.headingAccent || (targetRole === "worker" ? "go online." : "post a job.");
    const bodyText =
      config.body ||
      (targetRole === "worker"
        ? "Without logging in, you cannot go online or broadcast your 10 km GPS availability. Sign in or register as a Worker to start receiving live jobs."
        : "Please sign in to your Customer account first. After logging in, you can broadcast jobs within 10 km, receive your 4-digit Start OTP, and pay via UPI escrow.");
    const ctaLabel =
      config.ctaLabel || (targetRole === "worker" ? "Sign in / Register as Worker →" : "Sign in / Register as Customer →");

    const handleGoogle = async () => {
      setSsoLoading(true);
      try {
        const res = await app.signInWithGoogleSSO?.(targetRole);
        if (res && res.loggedIn) {
          app.showNotification?.(targetRole === "worker" ? "Signed in! You can now go online." : "Signed in! You can now post your job.");
          onClose();
        } else {
          onClose();
        }
      } catch (_) {
        setSsoLoading(false);
      }
      setSsoLoading(false);
    };

    return h(
      "div",
      {
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "kz-login-req-title",
        style: {
          position: "fixed",
          inset: 0,
          background: "rgba(28,25,19,0.62)",
          backdropFilter: "blur(6px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          zIndex: 130,
        },
        onClick: (e) => {
          if (e.target === e.currentTarget) onClose();
        },
      },
      h(
        "div",
        {
          style: {
            width: "100%",
            maxWidth: "440px",
            borderRadius: "28px",
            background: isDark ? "#1F1C17" : "#FFFFFF",
            color: isDark ? "#EDE6DA" : "#1C1913",
            border: "1px solid " + (isDark ? "#2E2A22" : "#EFE7DA"),
            boxShadow: "0 24px 56px rgba(28,25,19,0.28)",
            padding: "26px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          },
        },
        h(
          "div",
          { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
          h(
            "span",
            { style: { fontSize: "11px", fontWeight: 800, letterSpacing: "1px", color: isDark ? "#F5A524" : "#7A4E00" } },
            "LOGIN REQUIRED"
          ),
          h(
            "button",
            {
              type: "button",
              onClick: onClose,
              "aria-label": "Close login popup",
              style: { border: 0, background: "transparent", color: isDark ? "#EDE6DA" : "#1C1913", fontSize: "18px", fontWeight: 800 },
            },
            "✕"
          )
        ),
        h(
          "h2",
          { id: "kz-login-req-title", style: { margin: 0, fontSize: "28px", lineHeight: 1.08, letterSpacing: "-0.8px", fontWeight: 800 } },
          headingPrefix,
          h("span", { style: { fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400 } }, headingAccent)
        ),
        h(
          "p",
          { style: { margin: 0, fontSize: "14px", lineHeight: 1.55, color: isDark ? "#CFC6B8" : "#4A443A" } },
          bodyText
        ),
        h(
          "button",
          {
            type: "button",
            disabled: ssoLoading,
            onClick: handleGoogle,
            style: {
              height: "52px",
              borderRadius: "999px",
              border: "1px solid " + (isDark ? "#3A342C" : "#E5DCCB"),
              background: isDark ? "#14120E" : "#FFFFFF",
              color: isDark ? "#EDE6DA" : "#1C1913",
              fontWeight: 800,
              fontSize: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
            },
          },
          h(
            "svg",
            { width: 18, height: 18, viewBox: "0 0 48 48", "aria-hidden": "true" },
            h("path", { fill: "#EA4335", d: "M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.8 6C12.4 13.7 17.7 9.5 24 9.5z" }),
            h("path", { fill: "#4285F4", d: "M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17.5z" }),
            h("path", { fill: "#FBBC05", d: "M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.8-6C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.8-6z" }),
            h("path", { fill: "#34A853", d: "M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.2-13.5-10l-7.8 6C6.6 42.6 14.6 48 24 48z" })
          ),
          ssoLoading ? "Signing in with Google…" : "Continue with Google"
        ),
        h(
          "button",
          {
            type: "button",
            onClick: () => {
              KZ.preferredRegisterRole = targetRole;
              onClose();
              navigate("/register", { registerRole: targetRole });
            },
            style: {
              height: "52px",
              borderRadius: "999px",
              border: 0,
              background: "#F5A524",
              color: "#1C1913",
              fontWeight: 800,
              fontSize: "15px",
            },
          },
          ctaLabel
        ),
        h(
          "button",
          {
            type: "button",
            onClick: onClose,
            style: {
              border: 0,
              background: "transparent",
              color: isDark ? "#A49B8C" : "#6F685D",
              fontWeight: 700,
              fontSize: "13px",
              padding: "4px",
            },
          },
          "Cancel"
        )
      )
    );
  }

  function CompleteJobUpiModal({ job, onClose }) {
    const app = useApp();
    const isDark = app.isDarkMode;
    const worker = app.currentWorker;
    const savedUpi = worker?.upiId || job?.assignedWorkerUpi || "";
    const [upiId, setUpiId] = useState(savedUpi);
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState("");

    if (!job) return null;

    const fullAmount = Math.max(
      1,
      Math.round(Number(job.dailyWage || 850) * Number(job.durationDays || 1))
    );
    const workerNet = Math.max(
      1,
      Math.round(Number(job.workerPayout || fullAmount * 0.8))
    );

    const cardBg = isDark ? "#1F1C17" : "#FFFFFF";
    const borderCol = isDark ? "#3A342C" : "#E5DCCB";

    const handleSubmit = async (e) => {
      e.preventDefault();
      const cleanUpi = String(upiId || "").trim().toLowerCase();
      if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(cleanUpi)) {
        setErr("Enter a valid UPI ID (e.g. raju@okaxis or success@razorpay).");
        return;
      }
      setErr("");
      setBusy(true);
      try {
        // Save UPI to worker profile immediately so it pre-fills next time
        app.updateWorkerUpi?.(cleanUpi);
        job.assignedWorkerUpi = cleanUpi;
        job.workerUpi = cleanUpi;

        // Mark completed locally (sets status = completed_pending_payment)
        app.completeJobByWorker?.(job.id);

        // Register RazorpayX Contact + UPI Fund Account & persist to MongoDB
        const resp = await fetch("/api/razorpay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "markCompleted",
            jobId: job.id,
            upiId: cleanUpi,
            workerId: worker?.id || job.assignedWorkerId,
            workerName: worker?.name || job.assignedWorkerName || "Kaamzo Worker",
            workerPhone: worker?.phone || job.assignedWorkerPhone || "",
            jobSnapshot: Object.assign({}, job, {
              status: "completed_pending_payment",
              assignedWorkerUpi: cleanUpi,
              workerUpi: cleanUpi,
            }),
          }),
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok || !data.success) {
          throw new Error(data.error || "Could not verify UPI payout account.");
        }
        job.razorpayContactId = data.fundAccount?.contactId || data.job?.razorpayContactId || job.razorpayContactId;
        job.razorpayFundAccountId = data.fundAccount?.fundAccountId || data.job?.razorpayFundAccountId || job.razorpayFundAccountId;
        job.razorpayPayoutMode = data.fundAccount?.mode || job.razorpayPayoutMode;

        app.showNotification?.(
          `Job marked completed! UPI (${cleanUpi}) saved & Pay Now enabled for customer.`
        );
        onClose();
      } catch (e2) {
        setErr(e2?.message || "Failed to save UPI & mark completed.");
      } finally {
        setBusy(false);
      }
    };

    return h(
      "div",
      {
        role: "dialog",
        "aria-modal": "true",
        style: {
          position: "fixed",
          inset: 0,
          background: "rgba(28, 25, 19, 0.62)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          zIndex: 135,
          backdropFilter: "blur(6px)",
        },
        onClick: (e) => {
          if (e.target === e.currentTarget && !busy) onClose();
        },
      },
      h(
        "form",
        {
          onSubmit: handleSubmit,
          style: {
            width: "100%",
            maxWidth: "460px",
            borderRadius: "28px",
            background: cardBg,
            color: isDark ? "#EDE6DA" : "#1C1913",
            border: "1px solid " + borderCol,
            padding: "26px",
            boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          },
        },
        h(
          "div",
          { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" } },
          h(
            "span",
            {
              style: {
                padding: "4px 10px",
                borderRadius: "999px",
                background: "#E3F4E8",
                color: "#1D6B36",
                fontSize: "11px",
                fontWeight: 800,
              },
            },
            "RAZORPAYX UPI PAYOUT"
          ),
          h(
            "span",
            { style: { fontSize: "12px", fontWeight: 700, color: isDark ? "#A49B8C" : "#6F685D" } },
            "Test Mode"
          )
        ),
        h("h3", { style: { margin: 0, fontSize: "24px", fontWeight: 800, lineHeight: 1.15 } }, "Mark Completed & Enter UPI"),
        h(
          "div",
          {
            style: {
              padding: "12px 14px",
              borderRadius: "16px",
              background: isDark ? "#27231C" : "#F7F2EA",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
            },
          },
          h(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "2px" } },
            h("b", { style: { fontSize: "14px" } }, job.title || "Work Order"),
            h(
              "span",
              { style: { fontSize: "12px", color: isDark ? "#A49B8C" : "#6F685D" } },
              `Customer pays ${formatInr(fullAmount)} · You receive ${formatInr(workerNet)}`
            )
          )
        ),
        h(
          "label",
          { style: { display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: 700 } },
          savedUpi ? "Saved Worker UPI ID (editable)" : "Your UPI ID for payout (saved for next time)",
          h("input", {
            type: "text",
            required: true,
            value: upiId,
            onChange: (e) => setUpiId(e.target.value),
            placeholder: "e.g. name@okaxis or success@razorpay",
            style: {
              height: "48px",
              borderRadius: "14px",
              border: "2px solid " + borderCol,
              padding: "0 14px",
              fontSize: "15px",
              fontWeight: 700,
              background: isDark ? "#14120E" : "#FBF8F2",
              color: isDark ? "#EDE6DA" : "#1C1913",
            },
          })
        ),
        h(
          "div",
          { style: { display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" } },
          h(
            "button",
            {
              type: "button",
              onClick: () => setUpiId("success@razorpay"),
              style: {
                padding: "6px 12px",
                borderRadius: "999px",
                border: "1px solid " + borderCol,
                background: isDark ? "#27231C" : "#FFF7E3",
                color: isDark ? "#F5A524" : "#7A4E00",
                fontSize: "12px",
                fontWeight: 800,
                cursor: "pointer",
              },
            },
            "Use test UPI: success@razorpay"
          ),
          h(
            "span",
            { style: { fontSize: "11px", color: isDark ? "#A49B8C" : "#6F685D" } },
            "Saved automatically for next job"
          )
        ),
        err &&
          h(
            "div",
            { style: { padding: "10px 12px", borderRadius: "12px", background: "#FFE1E1", color: "#9B1C1C", fontSize: "13px", fontWeight: 700 } },
            err
          ),
        h(
          "div",
          { style: { display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "4px" } },
          h(
            "button",
            {
              type: "button",
              disabled: busy,
              onClick: onClose,
              style: {
                height: "44px",
                padding: "0 18px",
                borderRadius: "999px",
                border: "1px solid " + borderCol,
                background: "transparent",
                color: isDark ? "#EDE6DA" : "#1C1913",
                fontWeight: 700,
                fontSize: "13px",
              },
            },
            "Cancel"
          ),
          h(
            "button",
            {
              type: "submit",
              disabled: busy,
              style: {
                height: "44px",
                padding: "0 22px",
                borderRadius: "999px",
                border: 0,
                background: "#2E9E57",
                color: "#FFFFFF",
                fontWeight: 800,
                fontSize: "14px",
                cursor: busy ? "wait" : "pointer",
              },
            },
            busy ? "Saving UPI & Submitting…" : "Mark Completed →"
          )
        )
      )
    );
  }

  function playCustomerRingTone() {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      if (!window.__kzAudioCtx || window.__kzAudioCtx.state === "closed") {
        window.__kzAudioCtx = new AC();
      }
      const ctx = window.__kzAudioCtx;
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
      const now = ctx.currentTime;

      // Dual-frequency telephone ring burst (440Hz + 480Hz) — two bursts like a real phone ring
      [0, 0.42].forEach((offset) => {
        const o1 = ctx.createOscillator();
        const o2 = ctx.createOscillator();
        const g = ctx.createGain();
        o1.type = "sine";
        o2.type = "sine";
        o1.frequency.setValueAtTime(440, now + offset);
        o2.frequency.setValueAtTime(480, now + offset);
        g.gain.setValueAtTime(0.18, now + offset);
        g.gain.setValueAtTime(0.18, now + offset + 0.28);
        g.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.34);
        o1.connect(g);
        o2.connect(g);
        g.connect(ctx.destination);
        o1.start(now + offset);
        o2.start(now + offset);
        o1.stop(now + offset + 0.35);
        o2.stop(now + offset + 0.35);
      });

      // Uplifting confirmation chime right after the ring burst
      [587.33, 739.99, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        const t0 = now + 0.85 + idx * 0.09;
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, t0);
        g.gain.setValueAtTime(0.2, t0);
        g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.24);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(t0);
        osc.stop(t0 + 0.25);
      });

      if (navigator.vibrate) {
        navigator.vibrate([350, 140, 350]);
      }
    } catch (_) {}
  }

  function JobAcceptedRingingModal({ job, onAnswer, onDismiss }) {
    const app = useApp();
    const isDark = app.isDarkMode;

    useEffect(() => {
      if (!job) return;
      playCustomerRingTone();
      const iv = setInterval(() => {
        playCustomerRingTone();
      }, 2100);
      const stopT = setTimeout(() => {
        onDismiss?.();
      }, 25000);
      return () => {
        clearInterval(iv);
        clearTimeout(stopT);
      };
    }, [job?.id]);

    if (!job) return null;

    const etaMin = Math.max(3, Math.round(Number(job.distanceKm || 1.2) * 4));

    return h(
      "div",
      {
        role: "dialog",
        "aria-modal": "true",
        style: {
          position: "fixed",
          inset: 0,
          background: "rgba(28, 25, 19, 0.65)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
          zIndex: 160,
          backdropFilter: "blur(6px)",
        },
      },
      h(
        "div",
        {
          style: {
            width: "100%",
            maxWidth: "460px",
            borderRadius: "30px",
            background: isDark ? "#1F1C17" : "#FFFFFF",
            color: isDark ? "#EDE6DA" : "#1C1913",
            border: "2px solid #F5A524",
            padding: "28px",
            boxShadow: "0 28px 68px rgba(0,0,0,0.34)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "14px",
          },
        },
        h(
          "div",
          {
            style: {
              width: "74px",
              height: "74px",
              borderRadius: "50%",
              background: "#F5A524",
              color: "#1C1913",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "34px",
              boxShadow: "0 0 0 12px rgba(245,165,36,0.22)",
            },
          },
          "🔔"
        ),
        h(
          "span",
          {
            style: {
              padding: "5px 14px",
              borderRadius: "999px",
              background: "#E3F4E8",
              color: "#1D6B36",
              fontSize: "12px",
              fontWeight: 800,
              letterSpacing: "0.8px",
            },
          },
          "JOB ACCEPTED · WORKER ON THE WAY"
        ),
        h(
          "h3",
          { style: { margin: 0, fontSize: "26px", fontWeight: 800, lineHeight: 1.15 } },
          `${job.assignedWorkerName || "Verified Worker"} accepted your job!`
        ),
        h(
          "p",
          { style: { margin: 0, fontSize: "14px", color: isDark ? "#CFC6B8" : "#4A443A", lineHeight: 1.5 } },
          `Heading to ${job.locationAddress || job.area || "your location"} for "${job.title || job.trade}" · ETA ~${etaMin} min (${job.distanceKm || 1.2} km away).`
        ),
        job.otpCode &&
          h(
            "div",
            {
              style: {
                width: "100%",
                padding: "14px 16px",
                borderRadius: "18px",
                background: "#1C1913",
                color: "#FBF8F2",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              },
            },
            h("span", { style: { fontSize: "12px", fontWeight: 700, color: "#CFC6B8" } }, "Share 4-Digit Start OTP on arrival"),
            h("b", { style: { fontSize: "24px", letterSpacing: "3px", color: "#F5A524" } }, job.otpCode)
          ),
        h(
          "div",
          { style: { display: "flex", gap: "10px", width: "100%", marginTop: "6px" } },
          h(
            "button",
            {
              type: "button",
              onClick: onDismiss,
              style: {
                height: "46px",
                padding: "0 18px",
                borderRadius: "999px",
                border: "1px solid " + (isDark ? "#3A342C" : "#E5DCCB"),
                background: "transparent",
                color: isDark ? "#EDE6DA" : "#1C1913",
                fontWeight: 700,
                fontSize: "13px",
                cursor: "pointer",
              },
            },
            "Silence Ring"
          ),
          h(
            "button",
            {
              type: "button",
              onClick: onAnswer,
              style: {
                flex: 1,
                height: "46px",
                padding: "0 22px",
                borderRadius: "999px",
                border: 0,
                background: "#2E9E57",
                color: "#FFFFFF",
                fontWeight: 800,
                fontSize: "14px",
                cursor: "pointer",
                boxShadow: "0 8px 22px rgba(46,158,87,0.35)",
              },
            },
            "View Live Map & ETA →"
          )
        )
      )
    );
  }

  KZ.notifyJobAcceptedForCustomer = function (jobId) {
    if (!jobId) return;
    try {
      localStorage.setItem(
        "kz_pending_customer_ring",
        JSON.stringify({ jobId: String(jobId), ts: Date.now() })
      );
      const ackRaw = localStorage.getItem("kz_acked_customer_accepts") || "[]";
      const ackList = JSON.parse(ackRaw).filter((id) => String(id) !== String(jobId));
      localStorage.setItem("kz_acked_customer_accepts", JSON.stringify(ackList));
    } catch (_) {}
  };

  KZ.MainApp = function MainApp() {
    const app = useApp();
    const { path } = useRoute();
    const [otpConfig, setOtpConfig] = useState(null);
    const [loginPrompt, setLoginPrompt] = useState(null);
    const [completeJobModal, setCompleteJobModal] = useState(null);
    const [customerRingJob, setCustomerRingJob] = useState(null);
    const [storageTick, setStorageTick] = useState(0);
    const prevStatusesRef = useRef({});
    const seededInitialRef = useRef(false);

    useEffect(() => {
      const onStorage = (ev) => {
        if (!ev || !ev.key || ev.key === "kz_pending_customer_ring" || ev.key.startsWith("kaamzo_")) {
          setStorageTick((n) => n + 1);
        }
      };
      window.addEventListener("storage", onStorage);
      return () => window.removeEventListener("storage", onStorage);
    }, []);

    // Unlock WebAudio on first user gesture so ringing plays reliably
    useEffect(() => {
      const unlock = () => {
        try {
          const AC = window.AudioContext || window.webkitAudioContext;
          if (!AC) return;
          if (!window.__kzAudioCtx || window.__kzAudioCtx.state === "closed") {
            window.__kzAudioCtx = new AC();
          }
          if (window.__kzAudioCtx.state === "suspended") {
            window.__kzAudioCtx.resume().catch(() => {});
          }
        } catch (_) {}
      };
      window.addEventListener("click", unlock, { passive: true });
      window.addEventListener("touchstart", unlock, { passive: true });
      window.addEventListener("keydown", unlock, { passive: true });
      return () => {
        window.removeEventListener("click", unlock);
        window.removeEventListener("touchstart", unlock);
        window.removeEventListener("keydown", unlock);
      };
    }, []);

    useEffect(() => {
      KZ.openOtpModal = (cfg) => setOtpConfig(cfg);
      KZ.openLoginPrompt = (cfg) => setLoginPrompt(cfg || { title: "Login to post a job" });
      KZ.openCompleteJobModal = (job) => setCompleteJobModal(job || null);
      return () => {
        KZ.openOtpModal = null;
        KZ.openLoginPrompt = null;
        KZ.openCompleteJobModal = null;
      };
    }, []);

    // Detect when any job transitions from broadcast/open -> accepted/approved (or pending ring marker)
    // and trigger ringing + automatic Live Map navigation when in the Customer Portal!
    useEffect(() => {
      const jobs = Array.isArray(app.jobs) ? app.jobs : [];
      if (jobs.length === 0) return;

      const prev = prevStatusesRef.current;
      const next = {};
      jobs.forEach((j) => {
        if (!j || !j.id) return;
        next[j.id] = j.status;
        const oldSt = prev[j.id];
        if (
          seededInitialRef.current &&
          (oldSt === "broadcast" || oldSt === "open") &&
          (j.status === "accepted" || j.status === "approved")
        ) {
          KZ.notifyJobAcceptedForCustomer(j.id);
        }
      });
      prevStatusesRef.current = next;
      seededInitialRef.current = true;

      const isCustomerView =
        path === "/customer" ||
        path.startsWith("/customer/") ||
        (app.currentRole === "customer" && !path.startsWith("/worker") && path !== "/jobs" && !path.startsWith("/admin"));

      if (!isCustomerView) return;

      let pendingId = null;
      try {
        const raw = localStorage.getItem("kz_pending_customer_ring");
        if (raw) {
          const parsed = JSON.parse(raw);
          // Valid if accepted within the last 15 minutes
          if (parsed && parsed.jobId && Date.now() - Number(parsed.ts || 0) < 15 * 60 * 1000) {
            pendingId = String(parsed.jobId);
          }
        }
      } catch (_) {}

      let ackList = [];
      try {
        ackList = JSON.parse(localStorage.getItem("kz_acked_customer_accepts") || "[]").map(String);
      } catch (_) {}

      const candidate =
        (pendingId &&
          !ackList.includes(pendingId) &&
          jobs.find((j) => String(j.id) === pendingId && (j.status === "accepted" || j.status === "approved"))) ||
        (app.ringingJob &&
          !ackList.includes(String(app.ringingJob.id)) &&
          jobs.find((j) => String(j.id) === String(app.ringingJob.id)));

      if (candidate && (!customerRingJob || String(customerRingJob.id) !== String(candidate.id))) {
        setCustomerRingJob(candidate);
        KZ.selectedTrackingJobId = candidate.id;
        app.setActiveWorkJobId?.(candidate.id);
        if (path !== "/customer/live-eta-attendance") {
          navigate("/customer/live-eta-attendance", { role: "customer" });
        }
      }
    }, [app.jobs, app.ringingJob, path, app.currentRole, storageTick]);

    const acknowledgeCustomerRing = (job, goMap) => {
      const target = job || customerRingJob;
      if (target && target.id) {
        try {
          const ackList = JSON.parse(localStorage.getItem("kz_acked_customer_accepts") || "[]").map(String);
          if (!ackList.includes(String(target.id))) ackList.push(String(target.id));
          localStorage.setItem("kz_acked_customer_accepts", JSON.stringify(ackList));
          localStorage.removeItem("kz_pending_customer_ring");
        } catch (_) {}
        KZ.selectedTrackingJobId = target.id;
        app.setActiveWorkJobId?.(target.id);
      }
      app.silenceRingingJob?.();
      setCustomerRingJob(null);
      if (goMap && path !== "/customer/live-eta-attendance") {
        navigate("/customer/live-eta-attendance", { role: "customer" });
      }
    };

    // If user completed Firebase Google SSO and needs registration, jump to /register
    useEffect(() => {
      if (app.ssoGoogleUser && path !== "/register") {
        navigate("/register");
      }
    }, [app.ssoGoogleUser]);

    // Determine view from pathname
    let ViewComp = null;
    if (path === "/admin" || path.startsWith("/admin/") || app.currentRole === "admin") {
      ViewComp = KZ.views.AdminPortal;
    } else if (path === "/register") {
      ViewComp = KZ.views.RegisterPage;
    } else if (path === "/jobs") {
      ViewComp = KZ.views.JobsPage;
    } else if (path === "/customer" || path.startsWith("/customer/")) {
      ViewComp = KZ.views.CustomerPortal;
    } else if (path === "/worker" || path.startsWith("/worker/")) {
      ViewComp = KZ.views.WorkerPortal;
    } else {
      ViewComp = KZ.views.HomePage;
    }

    const isDark = app.isDarkMode;

    return h(
      "div",
      {
        className: isDark ? "kz-page-surface" : "",
        style: {
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          fontFamily: "var(--kz-font-ui)",
          background: isDark ? "#14120E" : "#FBF8F2",
          color: isDark ? "#EDE6DA" : "#1C1913",
        },
      },
      ViewComp ? h(ViewComp, { path, openOtpModal: (cfg) => setOtpConfig(cfg) }) : h(FallbackView, { path }),
      h(HelpAndSupportFloating, null),
      otpConfig && h(GlobalOtpModal, { config: otpConfig, onClose: () => setOtpConfig(null) }),
      loginPrompt && h(LoginRequiredModal, { config: loginPrompt, onClose: () => setLoginPrompt(null) }),
      completeJobModal && h(CompleteJobUpiModal, { job: completeJobModal, onClose: () => setCompleteJobModal(null) }),
      customerRingJob &&
        h(JobAcceptedRingingModal, {
          job: customerRingJob,
          onAnswer: () => acknowledgeCustomerRing(customerRingJob, true),
          onDismiss: () => acknowledgeCustomerRing(customerRingJob, false),
        })
    );
  };
})();


/* Part 2 — HomePage (/) & Register / Sign-In Wizard (/register) */
(function () {
  "use strict";
  const KZ = window.__KZ_REDESIGN__;
  const U = KZ.utils;
  const C = KZ.components;
  const { h, useApp, useState, useEffect, useRef, ICON_PATHS, TRADES, getLiveTradeRate, formatInr, navigate } = U;
  const { HeroWorkSceneSvg, TradeIllustration, SvgIcon, TopUtilityBar, KaamzoFooter } = C;

  // =========================================================================
  // HOME PAGE (/) — pixel-exact port of home/index.html
  // =========================================================================
  KZ.views.HomePage = function HomePage() {
    const app = useApp();
    const isDark = app.isDarkMode;
    const [searchText, setSearchText] = useState("");

    const workers = app.workers || [];

    const flowers = U.useMemo(() => {
      const list = [];
      const cols = ["#FFE27A", "#FFFFFF", "#F59E3B", "#F3D24E", "#E7C3F0"];
      let seed = 7;
      const rnd = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };
      for (let i = 0; i < 140; i++) {
        const y = 440 + rnd() * 78;
        list.push({
          x: Math.round(rnd() * 1440),
          y: Math.round(y),
          r: +(1.5 + (y - 440) / 20).toFixed(1),
          c: cols[Math.floor(rnd() * cols.length)],
        });
      }
      return list;
    }, []);

    const handleSearch = (e) => {
      e.preventDefault();
      const q = searchText.trim();
      if (q) {
        const lower = q.toLowerCase();
        const hit = TRADES.find(
          (t) =>
            t.name.toLowerCase().includes(lower) ||
            t.desc.toLowerCase().includes(lower) ||
            lower.includes(t.name.toLowerCase())
        );
        navigate("/customer", {
          role: "customer",
          searchQuery: q,
          selectedTrade: hit ? hit.id : undefined,
        });
      } else {
        navigate("/customer", { role: "customer" });
      }
    };

    const toggleLangQuick = () => {
      const next = app.currentLanguage === "en" ? "hi" : app.currentLanguage === "hi" ? "pa" : "en";
      app.setCurrentLanguage(next);
      if (typeof window.kaamzoSetLanguage === "function") {
        try {
          window.kaamzoSetLanguage(next);
        } catch (_) {}
      }
    };

    const activeAccount =
      app.currentRole === "worker" && app.currentWorker
        ? { label: app.currentWorker.name.split(" ")[0] + " · Worker", href: "/worker", role: "worker" }
        : app.currentCustomer
        ? { label: app.currentCustomer.name.split(" ")[0] + " · Account", href: "/customer", role: "customer" }
        : null;

    const plumberRate = formatInr(getLiveTradeRate("Plumber", workers));
    const carpenterRate = formatInr(getLiveTradeRate("Carpenter", workers));
    const painterRate = formatInr(getLiveTradeRate("Painter", workers));
    const elecRate = formatInr(getLiveTradeRate("Electrician", workers));

    const howSteps = [
      {
        n: "1",
        title: "Broadcast your job",
        body: "Post your task & location — Kaamzo broadcasts instantly to verified workers within 10 km.",
        bg: "#DCEAF5",
      },
      {
        n: "2",
        title: "Worker arrives on live map",
        body: "Track your accepted worker live on GPS with ETA and confirm arrival using your 4-digit Start OTP.",
        bg: "#FCEBCB",
      },
      {
        n: "3",
        title: "Work in progress",
        body: "Watch live work progress and digital attendance while your verified neighbour completes the job.",
        bg: "#FBE3D3",
      },
      {
        n: "4",
        title: "Pay via Razorpay UPI",
        body: "Once the worker marks completed, tap Pay Now to settle cleanly via UPI with instant status updates.",
        bg: "#E3F4E8",
      },
    ];

    const trustItems = [
      { title: "Aadhaar verified", body: "Every worker checks ID and face before taking jobs.", icon: ICON_PATHS.shield },
      { title: "Escrow payments", body: "Money is released only with your OTP.", icon: ICON_PATHS.lock },
      { title: "Live GPS on every job", body: "Both sides see where the job is in real time.", icon: ICON_PATHS.pin },
      { title: "One-tap SOS", body: "Call 112 straight from an active job.", icon: ICON_PATHS.alert },
    ];

    const workerPerks = [
      { title: "Free registration", body: "Phone number and UPI ID is all you need." },
      { title: "Jobs within 10 km", body: "Less travel, more jobs in a day." },
      { title: "Paid straight to UPI", body: "PhonePe, GPay or Paytm, as soon as the customer confirms." },
      { title: "Bonuses as you grow", body: "Milestone bonus ladder from 10 to 100 jobs." },
    ];

    const pageBg = isDark ? "#14120E" : "#FBF8F2";
    const cardBg = isDark ? "#1F1C17" : "#FFFFFF";
    const borderCol = isDark ? "#2E2A22" : "#EFE7DA";
    const textCol = isDark ? "#EDE6DA" : "#1C1913";
    const bodyCol = isDark ? "#CFC6B8" : "#4A443A";
    const mutedCol = isDark ? "#A49B8C" : "#6F685D";

    return h(
      "div",
      {
        style: {
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          color: textCol,
          background: pageBg,
          minHeight: "100vh",
          overflowX: "clip",
        },
      },
      h(TopUtilityBar, null),

      // ============ HERO SCENE ============
      h(
        "section",
        {
          id: "top",
          style: {
            position: "relative",
            minHeight: "940px",
            overflow: "hidden",
            color: "#1C1913",
            background: "linear-gradient(180deg, #BAD6EC 0%, #D9EAF6 36%, #F5EBDD 72%, #FBF8F2 100%)",
          },
        },
        h("img", {
          src: "/assets/kaamzo-hero-bg.jpg",
          alt: "",
          "aria-hidden": "true",
          style: {
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center bottom",
            pointerEvents: "none",
            userSelect: "none",
          },
        }),
        h("div", {
          "aria-hidden": "true",
          style: {
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "160px",
            zIndex: 2,
            pointerEvents: "none",
            background: isDark
              ? "linear-gradient(180deg, rgba(20,18,14,0) 0%, rgba(20,18,14,0.45) 55%, #14120E 100%)"
              : "linear-gradient(180deg, rgba(251,248,242,0) 0%, rgba(251,248,242,0.45) 55%, #FBF8F2 100%)",
          },
        }),

        // Hidden reference SVG matching template structure
        h(
          "svg",
          { "aria-hidden": "true", viewBox: "0 0 1440 520", preserveAspectRatio: "none", style: { display: "none" } },
          flowers.map((f, idx) => h("circle", { key: idx, cx: f.x, cy: f.y, r: f.r, fill: f.c }))
        ),

        // Floating Glass Nav Pill
        h(
          "header",
          { style: { position: "relative", zIndex: 10, display: "flex", justifyContent: "center", padding: "22px 16px 0" } },
          h(
            "nav",
            {
              "aria-label": "Main",
              style: {
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 6px 6px 18px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.72)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.9)",
                boxShadow: "0 8px 30px rgba(80,60,30,0.10)",
              },
            },
            h(
              "a",
              {
                href: "#top",
                style: {
                  textDecoration: "none",
                  color: "#1C1913",
                  fontWeight: 800,
                  fontSize: "20px",
                  letterSpacing: "-0.4px",
                  marginRight: "14px",
                },
              },
              "kaamzo",
              h("span", { style: { color: "#E8930C" } }, ".")
            ),
            h(
              "div",
              { className: "navlinks", style: { display: "flex", gap: "2px", alignItems: "center" } },
              h("a", { href: "#services", style: { padding: "10px 14px", fontSize: "14px", fontWeight: 600, color: "#3D3830", textDecoration: "none" } }, "Services"),
              h("a", { href: "#how", style: { padding: "10px 14px", fontSize: "14px", fontWeight: 600, color: "#3D3830", textDecoration: "none" } }, "How it works"),
              h("a", { href: "#workers", style: { padding: "10px 14px", fontSize: "14px", fontWeight: 600, color: "#3D3830", textDecoration: "none" } }, "For workers"),
              h(
                "a",
                {
                  href: "/jobs",
                  onClick: (e) => {
                    e.preventDefault();
                    navigate("/jobs", { role: "worker" });
                  },
                  style: { padding: "10px 14px", fontSize: "14px", fontWeight: 600, color: "#3D3830", textDecoration: "none" },
                },
                "Jobs"
              ),
              h(
                "button",
                {
                  type: "button",
                  onClick: toggleLangQuick,
                  "aria-label": "Switch language",
                  style: { padding: "10px 14px", border: 0, background: "transparent", font: "inherit", fontSize: "14px", fontWeight: 700, color: "#3D3830", cursor: "pointer" },
                },
                "EN · ",
                h("span", { style: { fontFamily: "'Noto Sans Devanagari', sans-serif" } }, "हिं")
              )
            ),
            h(
              "a",
              {
                href: activeAccount ? activeAccount.href : "/register",
                onClick: (e) => {
                  e.preventDefault();
                  if (activeAccount) navigate(activeAccount.href, { role: activeAccount.role });
                  else navigate("/register");
                },
                style: {
                  padding: "11px 20px",
                  borderRadius: "999px",
                  background: "#1C1913",
                  color: "#FBF8F2",
                  fontSize: "14px",
                  fontWeight: 700,
                  textDecoration: "none",
                },
              },
              activeAccount ? activeAccount.label : "Sign in"
            )
          )
        ),

        // Hero Copy
        h(
          "div",
          {
            style: {
              position: "relative",
              zIndex: 5,
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "96px 24px 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "22px",
            },
          },
          h(
            "span",
            {
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 14px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.9)",
                fontSize: "13px",
                fontWeight: 700,
                color: "#3D3830",
              },
            },
            h("span", { style: { width: "8px", height: "8px", borderRadius: "50%", background: "#2E9E57" } }),
            "Now live in " + (app.currentCity?.name || "Ludhiana")
          ),
          h(
            "h1",
            {
              style: {
                margin: 0,
                fontSize: "clamp(52px, 8.4vw, 116px)",
                lineHeight: 0.95,
                letterSpacing: "-3px",
                fontWeight: 800,
                maxWidth: "1000px",
              },
            },
            "Kaam ",
            h(
              "span",
              {
                style: {
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  letterSpacing: "-1px",
                },
              },
              "ho jayega."
            )
          ),
          h(
            "p",
            {
              style: {
                margin: 0,
                fontSize: "clamp(17px, 1.6vw, 21px)",
                lineHeight: 1.5,
                color: "#3D3830",
                maxWidth: "560px",
              },
            },
            "Homes that can trust. Workers that can thrive."
          ),
          h(
            "form",
            {
              onSubmit: handleSearch,
              style: {
                marginTop: "10px",
                width: "100%",
                maxWidth: "620px",
                display: "flex",
                flexWrap: "wrap",
                gap: "6px",
                padding: "6px",
                borderRadius: "999px",
                background: "rgba(255,255,255,0.82)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid rgba(255,255,255,0.95)",
                boxShadow: "0 18px 50px rgba(110,70,20,0.16)",
              },
            },
            h("label", { htmlFor: "kz-hero-q", style: { position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" } }, "What work do you need done?"),
            h(
              "div",
              { style: { flex: "1 1 240px", display: "flex", alignItems: "center", gap: "10px", padding: "0 16px", minHeight: "52px" } },
              h(SvgIcon, { path: ICON_PATHS.search, size: 20, color: "#6F685D", strokeWidth: 2 }),
              h("input", {
                id: "kz-hero-q",
                type: "text",
                value: searchText,
                onChange: (e) => setSearchText(e.target.value),
                placeholder: "Leaking tap, fan repair, wall painting…",
                style: { flex: 1, minWidth: 0, border: 0, outline: "none", font: "inherit", fontSize: "16px", background: "transparent", color: "#1C1913" },
              })
            ),
            h(
              "button",
              {
                type: "submit",
                style: {
                  minHeight: "52px",
                  padding: "0 26px",
                  border: 0,
                  borderRadius: "999px",
                  background: "#1C1913",
                  color: "#FBF8F2",
                  font: "inherit",
                  fontSize: "15px",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                },
              },
              "Find a worker",
              h(SvgIcon, { path: ICON_PATHS.arrowR, size: 16, strokeWidth: 2.4 })
            )
          ),
          h(
            "a",
            {
              href: "/jobs",
              onClick: (e) => {
                e.preventDefault();
                navigate("/jobs", { role: "worker" });
              },
              style: {
                fontSize: "15px",
                fontWeight: 700,
                color: "#1C1913",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
                textDecorationColor: "rgba(28,25,19,0.35)",
              },
            },
            "I'm a worker, I want jobs"
          )
        ),

        // Floating worker card (left)
        h(
          "div",
          {
            className: "float",
            style: {
              left: "3%",
              top: "560px",
              zIndex: 6,
              width: "268px",
              padding: "16px",
              borderRadius: "20px",
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              border: "1px solid rgba(255,255,255,0.85)",
              boxShadow: "0 16px 40px rgba(80,60,30,0.12)",
              transform: "rotate(-3deg)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              textAlign: "left",
            },
          },
          h(
            "div",
            { style: { display: "flex", alignItems: "center", gap: "10px" } },
            h(
              "span",
              { style: { width: "40px", height: "40px", borderRadius: "12px", background: "#FFE08A", color: "#6B4600", display: "flex", alignItems: "center", justifyContent: "center" }, "aria-hidden": "true" },
              h(SvgIcon, { path: ICON_PATHS.bolt, size: 20, strokeWidth: 2 })
            ),
            h(
              "span",
              { style: { display: "flex", flexDirection: "column" } },
              h(
                "span",
                { style: { fontSize: "12px", fontWeight: 700, color: "#1D6B36", display: "flex", alignItems: "center", gap: "5px" } },
                h("span", { style: { width: "7px", height: "7px", borderRadius: "50%", background: "#2E9E57" } }),
                "Available now"
              ),
              h("span", { style: { fontWeight: 800, fontSize: "15px" } }, "Electrician")
            )
          ),
          h("span", { style: { fontSize: "13px", lineHeight: 1.45, color: "#3D3830" } }, "Wiring, fans, switchboards and appliances."),
          h("span", { style: { fontSize: "12px", fontWeight: 600, color: "#4A443A" } }, `Aadhaar verified · ${elecRate}/day · within 10 km`)
        ),

        // Floating escrow card (right)
        h(
          "div",
          {
            className: "float",
            style: {
              right: "3%",
              top: "530px",
              zIndex: 6,
              width: "250px",
              padding: "16px",
              borderRadius: "20px",
              background: "rgba(28,25,19,0.78)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              color: "#FBF8F2",
              boxShadow: "0 16px 40px rgba(40,25,5,0.25)",
              transform: "rotate(3deg)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              textAlign: "left",
            },
          },
          h("span", { style: { fontSize: "12px", fontWeight: 700, color: "#F3C969", letterSpacing: "0.6px" } }, "PAYMENT IN ESCROW"),
          h("span", { style: { fontWeight: 800, fontSize: "15px", lineHeight: 1.35 } }, "Released to the worker only with your OTP"),
          h(
            "div",
            { style: { display: "flex", gap: "8px" }, "aria-hidden": "true" },
            [0, 1, 2, 3].map((i) =>
              h(
                "span",
                {
                  key: i,
                  style: {
                    flex: 1,
                    height: "38px",
                    borderRadius: "10px",
                    background: "rgba(255,255,255,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                  },
                },
                "•"
              )
            )
          )
        ),

        // Floating stickers
        h(
          "span",
          {
            className: "float",
            style: {
              left: "7%",
              top: "420px",
              zIndex: 6,
              transform: "rotate(-8deg)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "9px 14px 9px 9px",
              borderRadius: "12px",
              background: "#DCEBFF",
              color: "#123A6B",
              fontWeight: 800,
              fontSize: "14px",
              boxShadow: "0 10px 24px rgba(20,50,100,0.15)",
            },
          },
          h(
            "span",
            { style: { width: "26px", height: "26px", borderRadius: "50%", background: "#2F6FD6", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }, "aria-hidden": "true" },
            h(SvgIcon, { path: ICON_PATHS.wrench, size: 14, strokeWidth: 2.4 })
          ),
          "Plumber"
        ),
        h(
          "span",
          {
            className: "float",
            style: {
              left: "6%",
              top: "150px",
              zIndex: 6,
              transform: "rotate(7deg)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "9px 14px 9px 9px",
              borderRadius: "12px",
              background: "#FBE0EE",
              color: "#6B1A45",
              fontWeight: 800,
              fontSize: "14px",
              boxShadow: "0 10px 24px rgba(100,20,60,0.15)",
            },
          },
          h(
            "span",
            { style: { width: "26px", height: "26px", borderRadius: "50%", background: "#D9478E", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }, "aria-hidden": "true" },
            h(SvgIcon, { path: ICON_PATHS.brush, size: 14, strokeWidth: 2.4 })
          ),
          "Painter"
        ),
        h(
          "span",
          {
            className: "float",
            style: {
              right: "7%",
              top: "400px",
              zIndex: 6,
              transform: "rotate(-5deg)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "9px 14px 9px 9px",
              borderRadius: "12px",
              background: "#E3E0FF",
              color: "#2E2470",
              fontWeight: 800,
              fontSize: "14px",
              boxShadow: "0 10px 24px rgba(40,30,110,0.15)",
            },
          },
          h(
            "span",
            { style: { width: "26px", height: "26px", borderRadius: "50%", background: "#6A5AE0", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }, "aria-hidden": "true" },
            h(SvgIcon, { path: ICON_PATHS.hammer, size: 14, strokeWidth: 2.4 })
          ),
          "Carpenter"
        ),

        // Doodles
        h(
          "svg",
          { className: "float", "aria-hidden": "true", width: "90", height: "40", viewBox: "0 0 90 40", style: { right: "8%", top: "170px", zIndex: 4 } },
          h("path", { d: "M4 30 C 14 6, 24 6, 30 24 S 46 40, 52 18 S 70 0, 86 20", fill: "none", stroke: "#F2C230", strokeWidth: "5", strokeLinecap: "round" })
        ),
        h(
          "svg",
          { className: "float", "aria-hidden": "true", width: "70", height: "70", viewBox: "0 0 70 70", style: { left: "9%", top: "290px", zIndex: 4 } },
          h("path", { d: "M10 50 C 10 20, 40 6, 60 14 C 44 22, 34 40, 10 50 Z M10 50 C 30 46, 50 50, 62 62", fill: "none", stroke: "#C9E24A", strokeWidth: "4", strokeLinecap: "round", strokeLinejoin: "round" })
        ),

        // Bottom row
        h(
          "p",
          {
            className: "float",
            style: { left: "4%", bottom: "44px", zIndex: 6, margin: 0, fontFamily: "'Caveat', cursive", fontSize: "30px", lineHeight: 1.05, color: isDark ? "#F5E8C8" : "#3D2A05" },
          },
          "— Not just workers.",
          h("br", null),
          "Your neighbours."
        ),
        h(
          "a",
          {
            href: "#services",
            style: {
              position: "absolute",
              left: "50%",
              bottom: "36px",
              transform: "translateX(-50%)",
              zIndex: 6,
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "11px 20px",
              borderRadius: "999px",
              background: "#1C1913",
              border: "1px solid #1C1913",
              color: "#FBF8F2",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "3px",
              textDecoration: "none",
            },
          },
          "SCROLL",
          h(SvgIcon, { path: ICON_PATHS.arrowDown, size: 14, strokeWidth: 2.4 })
        ),
        h(
          "div",
          {
            className: "float",
            style: {
              right: "4%",
              bottom: "36px",
              zIndex: 6,
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 16px 10px 10px",
              borderRadius: "16px",
              background: "rgba(28,25,19,0.85)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#FBF8F2",
            },
          },
          h(
            "span",
            { style: { width: "38px", height: "38px", borderRadius: "10px", background: "rgba(255,255,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }, "aria-hidden": "true" },
            h(SvgIcon, { path: ICON_PATHS.shield, size: 20, strokeWidth: 2 })
          ),
          h(
            "span",
            { style: { display: "flex", flexDirection: "column" } },
            h("span", { style: { fontWeight: 800, fontSize: "14px" } }, "100% Aadhaar verified"),
            h("span", { style: { fontSize: "12px", opacity: 0.9 } }, "Every worker, before every job")
          )
        )
      ),

      // ============ TWO PATHS ============
      h(
        "section",
        { style: { maxWidth: "1240px", margin: "0 auto", padding: "96px 24px 40px", display: "flex", flexDirection: "column", gap: "40px" } },
        h(
          "h2",
          { style: { margin: 0, textAlign: "center", fontSize: "clamp(34px, 4.4vw, 58px)", lineHeight: 1.02, letterSpacing: "-1.6px", fontWeight: 800 } },
          "One app, ",
          h("span", { style: { fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400 } }, "two ways"),
          " in."
        ),
        h(
          "div",
          { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" } },
          h(
            "a",
            {
              href: "/customer",
              onClick: (e) => {
                e.preventDefault();
                navigate("/customer", { role: "customer" });
              },
              style: {
                position: "relative",
                overflow: "hidden",
                minHeight: "380px",
                borderRadius: "32px",
                padding: "36px",
                textDecoration: "none",
                color: "#1C1913",
                background: "linear-gradient(180deg, #CFE2F1 0%, #F7E3CC 70%, #F5C98F 100%)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              },
            },
            h(
              "svg",
              { "aria-hidden": "true", viewBox: "0 0 600 160", preserveAspectRatio: "none", style: { position: "absolute", left: 0, bottom: 0, width: "100%", height: "150px" } },
              h("path", { d: "M0 70 C 120 30, 260 80, 380 50 C 480 26, 540 50, 600 40 L600 160 L0 160 Z", fill: "#A9BE72" }),
              h("path", { d: "M0 110 C 160 80, 320 120, 600 92 L600 160 L0 160 Z", fill: "#E8C53A" })
            ),
            h("span", { style: { position: "relative", fontSize: "13px", fontWeight: 800, letterSpacing: "1.2px", color: "#6B4600" } }, "FOR HOMES & CONTRACTORS"),
            h(
              "span",
              { style: { position: "relative", fontSize: "40px", fontWeight: 800, letterSpacing: "-1px", lineHeight: 1 } },
              "I need ",
              h("span", { style: { fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400 } }, "a worker")
            ),
            h("span", { style: { position: "relative", fontSize: "17px", lineHeight: 1.5, color: "#3D3830", maxWidth: "380px" } }, "See fair rates upfront, choose from your top 5 nearby, and pay nothing until it is done."),
            h("span", { style: { position: "relative", marginTop: "10px", alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "8px", padding: "13px 22px", borderRadius: "999px", background: "#1C1913", color: "#FBF8F2", fontWeight: 700, fontSize: "15px" } }, "Book a worker →")
          ),
          h(
            "a",
            {
              href: "/worker",
              onClick: (e) => {
                e.preventDefault();
                navigate("/worker", { role: "worker" });
              },
              style: {
                position: "relative",
                overflow: "hidden",
                minHeight: "380px",
                borderRadius: "32px",
                padding: "36px",
                textDecoration: "none",
                color: "#FBF8F2",
                background: "linear-gradient(180deg, #2A2342 0%, #6E4A63 55%, #D38457 100%)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              },
            },
            h(
              "svg",
              { "aria-hidden": "true", viewBox: "0 0 600 160", preserveAspectRatio: "none", style: { position: "absolute", left: 0, bottom: 0, width: "100%", height: "150px" } },
              h("path", { d: "M0 80 C 140 40, 280 90, 420 60 C 500 44, 560 60, 600 50 L600 160 L0 160 Z", fill: "#3A2F3A" }),
              h("path", { d: "M0 120 C 200 90, 380 130, 600 100 L600 160 L0 160 Z", fill: "#1F1A22" })
            ),
            h("span", { style: { position: "relative", fontSize: "13px", fontWeight: 800, letterSpacing: "1.2px", color: "#F3C969" } }, "FOR SKILLED WORKERS"),
            h(
              "span",
              { style: { position: "relative", fontSize: "40px", fontWeight: 800, letterSpacing: "-1px", lineHeight: 1 } },
              "I want ",
              h("span", { style: { fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400 } }, "work"),
              " ",
              h("span", { style: { fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: "26px", fontWeight: 600, color: "#EBD9C8" } }, "· काम चाहिए")
            ),
            h("span", { style: { position: "relative", fontSize: "17px", lineHeight: 1.5, color: "#EBD9C8", maxWidth: "380px" } }, "Jobs within 10 km, paid straight to your UPI the moment the customer confirms."),
            h("span", { style: { position: "relative", marginTop: "10px", alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "8px", padding: "13px 22px", borderRadius: "999px", background: "#FBF8F2", color: "#1C1913", fontWeight: 700, fontSize: "15px" } }, "Open Worker Portal →")
          )
        )
      ),

      // ============ MEET THE TRADES ============
      h(
        "section",
        { style: { maxWidth: "1240px", margin: "0 auto", padding: "72px 24px 24px", display: "flex", flexDirection: "column", gap: "36px" } },
        h(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", textAlign: "center" } },
          h("span", { style: { fontSize: "13px", fontWeight: 800, letterSpacing: "1.2px", color: isDark ? "#F5A524" : "#7A4E00" } }, "MEET THE HANDS"),
          h(
            "h2",
            { style: { margin: 0, fontSize: "clamp(34px, 4vw, 52px)", lineHeight: 1.02, letterSpacing: "-1.4px", fontWeight: 800 } },
            "Skilled people, ",
            h("span", { style: { fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400 } }, "right around the corner.")
          )
        ),
        h(
          "div",
          { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" } },
          [
            {
              name: "Plumber",
              rate: plumberRate,
              desc: "Leaking taps, blocked drains, new fittings and motor connections.",
            },
            {
              name: "Carpenter",
              rate: carpenterRate,
              desc: "Furniture repairs, doors and hinges, shelves and custom woodwork.",
            },
            {
              name: "Painter",
              rate: painterRate,
              desc: "Fresh walls, primer, touch-ups and full-room colour changes.",
            },
          ].map((item) =>
            h(
              "a",
              {
                key: item.name,
                href: "/customer",
                onClick: (e) => {
                  e.preventDefault();
                  navigate("/customer", { role: "customer", selectedTrade: item.name });
                },
                style: {
                  textDecoration: "none",
                  color: textCol,
                  borderRadius: "32px",
                  overflow: "hidden",
                  background: cardBg,
                  border: "1px solid " + borderCol,
                  display: "flex",
                  flexDirection: "column",
                },
              },
              h(TradeIllustration, { type: item.name }),
              h(
                "span",
                { style: { padding: "22px 24px 26px", display: "flex", flexDirection: "column", gap: "6px" } },
                h(
                  "span",
                  { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline" } },
                  h("span", { style: { fontSize: "22px", fontWeight: 800 } }, item.name),
                  h(
                    "span",
                    { style: { fontFamily: "'Instrument Serif', serif", fontSize: "24px" } },
                    item.rate,
                    h("span", { style: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "13px", color: mutedCol, fontWeight: 600 } }, " /day")
                  )
                ),
                h("span", { style: { fontSize: "15px", lineHeight: 1.5, color: bodyCol } }, item.desc)
              )
            )
          )
        )
      ),

      // ============ SERVICES GRID (9 TRADES) ============
      h(
        "section",
        { id: "services", style: { maxWidth: "1240px", margin: "0 auto", padding: "72px 24px", display: "flex", flexDirection: "column", gap: "36px" } },
        h(
          "div",
          { style: { display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "16px" } },
          h(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "10px" } },
            h("span", { style: { fontSize: "13px", fontWeight: 800, letterSpacing: "1.2px", color: isDark ? "#F5A524" : "#7A4E00" } }, "SERVICES IN LUDHIANA"),
            h(
              "h2",
              { style: { margin: 0, fontSize: "clamp(34px, 4vw, 52px)", lineHeight: 1.02, letterSpacing: "-1.4px", fontWeight: 800 } },
              "Fair rates, ",
              h("span", { style: { fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400 } }, "shown upfront.")
            )
          ),
          h(
            "a",
            {
              href: "/customer",
              onClick: (e) => {
                e.preventDefault();
                navigate("/customer", { role: "customer" });
              },
              style: {
                padding: "12px 20px",
                borderRadius: "999px",
                border: "1px solid " + (isDark ? "#3A342C" : "#E2D9C8"),
                background: cardBg,
                color: textCol,
                fontWeight: 700,
                fontSize: "14px",
                textDecoration: "none",
              },
            },
            "See all services →"
          )
        ),
        h(
          "div",
          { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: "14px" } },
          TRADES.map((t) =>
            h(
              "a",
              {
                key: t.id,
                href: "/customer",
                onClick: (e) => {
                  e.preventDefault();
                  navigate("/customer", { role: "customer", selectedTrade: t.id });
                },
                style: {
                  textDecoration: "none",
                  color: textCol,
                  background: cardBg,
                  border: "1px solid " + borderCol,
                  borderRadius: "24px",
                  padding: "22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                  boxShadow: "0 1px 0 rgba(0,0,0,0.02), 0 12px 30px rgba(90,60,20,0.05)",
                },
              },
              h(
                "span",
                { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" } },
                h(
                  "span",
                  { style: { width: "52px", height: "52px", borderRadius: "16px", background: t.bg, color: t.fg, display: "flex", alignItems: "center", justifyContent: "center" }, "aria-hidden": "true" },
                  h(SvgIcon, { path: t.icon, size: 24, strokeWidth: 2 })
                ),
                h(
                  "span",
                  { style: { width: "34px", height: "34px", borderRadius: "50%", border: "1px solid " + borderCol, display: "flex", alignItems: "center", justifyContent: "center", color: bodyCol }, "aria-hidden": "true" },
                  h(SvgIcon, { path: ICON_PATHS.arrowNE, size: 14, strokeWidth: 2.4 })
                )
              ),
              h(
                "span",
                { style: { display: "flex", flexDirection: "column", gap: "4px" } },
                h("span", { style: { fontSize: "18px", fontWeight: 800 } }, t.name),
                h("span", { style: { fontSize: "14px", color: mutedCol } }, t.desc)
              ),
              h(
                "span",
                { style: { fontFamily: "'Instrument Serif', serif", fontSize: "30px", lineHeight: 1 } },
                formatInr(getLiveTradeRate(t.id, workers)),
                h("span", { style: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "13px", color: mutedCol, fontWeight: 600 } }, " /day")
              )
            )
          )
        )
      ),

      // ============ HOW IT WORKS ============
      h(
        "section",
        { id: "how", style: { maxWidth: "1240px", margin: "0 auto", padding: "72px 24px", display: "flex", flexDirection: "column", gap: "40px" } },
        h(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "10px", alignItems: "center", textAlign: "center" } },
          h("span", { style: { fontSize: "13px", fontWeight: 800, letterSpacing: "1.2px", color: isDark ? "#F5A524" : "#7A4E00" } }, "HOW IT WORKS"),
          h(
            "h2",
            { style: { margin: 0, fontSize: "clamp(34px, 4vw, 52px)", lineHeight: 1.02, letterSpacing: "-1.4px", fontWeight: 800 } },
            "Booked & done in ",
            h("span", { style: { fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400 } }, "four clear steps.")
          )
        ),
        h(
          "ol",
          { style: { listStyle: "none", margin: 0, padding: 0, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "18px" } },
          howSteps.map((step) =>
            h(
              "li",
              {
                key: step.n,
                style: {
                  position: "relative",
                  overflow: "hidden",
                  background: step.bg,
                  color: "#1C1913",
                  borderRadius: "28px",
                  padding: "32px",
                  minHeight: "280px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  gap: "12px",
                },
              },
              h(
                "span",
                {
                  "aria-hidden": "true",
                  style: { position: "absolute", top: "4px", right: "22px", fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontSize: "150px", lineHeight: 1, color: "rgba(28,25,19,0.10)" },
                },
                step.n
              ),
              h("span", { style: { position: "relative", fontSize: "24px", fontWeight: 800, letterSpacing: "-0.4px" } }, step.title),
              h("span", { style: { position: "relative", fontSize: "16px", lineHeight: 1.55, color: "#3D3830" } }, step.body)
            )
          )
        )
      ),

      // ============ TRUST ============
      h(
        "section",
        { style: { maxWidth: "1240px", margin: "0 auto", padding: "24px 24px 96px" } },
        h(
          "div",
          {
            style: {
              borderRadius: "32px",
              padding: "44px",
              background: "linear-gradient(135deg, #EEF3DC 0%, #FDF1D2 100%)",
              border: "1px solid #E7E2C6",
              color: "#1C1913",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "32px",
            },
          },
          trustItems.map((r) =>
            h(
              "div",
              { key: r.title, style: { display: "flex", flexDirection: "column", gap: "12px" } },
              h(
                "span",
                { style: { width: "48px", height: "48px", borderRadius: "50%", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 16px rgba(60,70,20,0.10)" }, "aria-hidden": "true" },
                h(SvgIcon, { path: r.icon, size: 22, color: "#3F5E22", strokeWidth: 2 })
              ),
              h("span", { style: { fontSize: "18px", fontWeight: 800 } }, r.title),
              h("span", { style: { fontSize: "15px", lineHeight: 1.5, color: "#3D3830" } }, r.body)
            )
          )
        )
      ),

      // ============ WORKERS MORNING SCENE ============
      h(
        "section",
        { id: "workers", style: { position: "relative", overflow: "hidden", background: "linear-gradient(180deg, #E4EFF8 0%, #F4F1EA 45%, #FCEBD2 100%)", color: "#1C1913" } },
        h("div", { "aria-hidden": "true", style: { position: "absolute", right: "10%", top: "70px", width: "340px", height: "340px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,214,140,0.85) 0%, rgba(255,214,140,0) 62%)" } }),
        h("div", { "aria-hidden": "true", style: { position: "absolute", right: "calc(10% + 125px)", top: "195px", width: "90px", height: "90px", borderRadius: "50%", background: "#FFD98A" } }),
        h("div", { "aria-hidden": "true", style: { position: "absolute", left: "8%", top: "90px", width: "220px", height: "34px", borderRadius: "999px", background: "rgba(255,255,255,0.8)" } }),
        h("div", { "aria-hidden": "true", style: { position: "absolute", left: "14%", top: "66px", width: "120px", height: "40px", borderRadius: "999px", background: "rgba(255,255,255,0.8)" } }),
        h(
          "svg",
          { "aria-hidden": "true", viewBox: "0 0 1440 260", preserveAspectRatio: "none", style: { position: "absolute", left: 0, bottom: 0, width: "100%", height: "240px" } },
          h("path", { d: "M0 120 C 200 60, 380 130, 600 90 C 820 50, 1000 120, 1200 80 C 1320 56, 1400 70, 1440 66 L1440 260 L0 260 Z", fill: "#CFE0A6" }),
          h("path", { d: "M0 170 C 260 130, 520 180, 800 150 C 1060 122, 1260 170, 1440 150 L1440 260 L0 260 Z", fill: "#F5D86A" }),
          h("path", { d: "M0 220 C 360 196, 760 228, 1100 214 C 1280 206, 1380 214, 1440 212 L1440 260 L0 260 Z", fill: "#A9BE72" })
        ),
        h(
          "div",
          { style: { position: "relative", maxWidth: "1240px", margin: "0 auto", padding: "110px 24px 300px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "24px" } },
          h(
            "span",
            { style: { padding: "8px 14px", borderRadius: "999px", background: "#FFFFFF", border: "1px solid #EFE7DA", fontSize: "13px", fontWeight: 700, color: "#7A4E00" } },
            "For workers · ",
            h("span", { style: { fontFamily: "'Noto Sans Devanagari', sans-serif" } }, "कामगारों के लिए")
          ),
          h(
            "h2",
            { style: { margin: 0, fontSize: "clamp(42px, 6vw, 84px)", lineHeight: 0.98, letterSpacing: "-2px", fontWeight: 800, maxWidth: "900px" } },
            "Kaam aapke paas ",
            h("span", { style: { fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, color: "#B5641A" } }, "aayega.")
          ),
          h("p", { style: { margin: 0, fontSize: "18px", lineHeight: 1.55, color: "#4A443A", maxWidth: "560px" } }, "Register free in 2 minutes with your phone number and UPI ID. Pick your trade, set your daily rate, and start getting jobs nearby."),
          h(
            "a",
            {
              href: "/register",
              onClick: (e) => {
                e.preventDefault();
                navigate("/register", { registerRole: "worker" });
              },
              style: {
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "15px 26px",
                borderRadius: "999px",
                background: "#1C1913",
                color: "#FBF8F2",
                fontWeight: 800,
                textDecoration: "none",
                boxShadow: "0 12px 28px rgba(28,25,19,0.18)",
              },
            },
            "Register free · ",
            h("span", { style: { fontFamily: "'Noto Sans Devanagari', sans-serif" } }, "मुफ्त रजिस्टर करें")
          ),
          h(
            "ul",
            { style: { listStyle: "none", margin: "24px 0 0", padding: 0, width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "14px", textAlign: "left" } },
            workerPerks.map((k) =>
              h(
                "li",
                {
                  key: k.title,
                  style: {
                    padding: "22px",
                    borderRadius: "24px",
                    background: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    border: "1px solid #FFFFFF",
                    boxShadow: "0 14px 30px rgba(90,60,20,0.08)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  },
                },
                h("span", { style: { width: "34px", height: "34px", borderRadius: "50%", background: "#FFF0BF", color: "#6B4600", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }, "aria-hidden": "true" }, "✓"),
                h("span", { style: { fontWeight: 800, fontSize: "16px" } }, k.title),
                h("span", { style: { fontSize: "14px", lineHeight: 1.5, color: "#4A443A" } }, k.body)
              )
            )
          )
        )
      ),

      h(KaamzoFooter, null)
    );
  };

  // =========================================================================
  // REGISTER & SIGN-IN PAGE (/register) — Step-by-step + Live ID Card + SSO
  // =========================================================================
  KZ.views.RegisterPage = function RegisterPage({ openOtpModal }) {
    const app = useApp();
    const initialRole = KZ.preferredRegisterRole || (app.ssoGoogleUser ? null : null);
    const [mode, setMode] = useState("register"); // "register" | "signin"
    const [role, setRole] = useState(initialRole); // null | "customer" | "worker"
    const [stepIdx, setStepIdx] = useState(0);
    const [done, setDone] = useState(false);

    // Form state
    const [name, setName] = useState(() => app.ssoGoogleUser?.displayName || "");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState(() => app.ssoGoogleUser?.email || "");
    const [emailVerified, setEmailVerified] = useState(() => Boolean(app.ssoGoogleUser?.email));
    const [area, setArea] = useState("Model Town");
    const [address, setAddress] = useState("Model Town, Ludhiana");
    const [trade, setTrade] = useState("Electrician");
    const [rate, setRate] = useState(850);
    const [exp, setExp] = useState(3);
    const [aadhaar, setAadhaar] = useState("");
    const [age, setAge] = useState("26");
    const [dob, setDob] = useState("1999-05-15");
    const [declare, setDeclare] = useState(true);
    const [photoUrl, setPhotoUrl] = useState(() => app.ssoGoogleUser?.photoURL || "");
    const [upiId, setUpiId] = useState("");
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);

    // Sign in state
    const [loginRole, setLoginRole] = useState("customer");
    const [loginIdent, setLoginIdent] = useState("");
    const [loginPwd, setLoginPwd] = useState("");
    const [loginErr, setLoginErr] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Camera capture
    const [cameraActive, setCameraActive] = useState(false);
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
      if (app.ssoGoogleUser) {
        if (app.ssoGoogleUser.displayName && !name) setName(app.ssoGoogleUser.displayName);
        if (app.ssoGoogleUser.email && !email) {
          setEmail(app.ssoGoogleUser.email);
          setEmailVerified(true);
        }
        if (app.ssoGoogleUser.photoURL && !photoUrl) setPhotoUrl(app.ssoGoogleUser.photoURL);
      }
    }, [app.ssoGoogleUser]);

    useEffect(() => {
      return () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }
      };
    }, []);

    const workerSteps = [
      "name",
      "phone",
      "email",
      "trade",
      "wage",
      "area",
      "aadhaar",
      "age",
      "photo",
      "upi",
      "password",
      "review",
    ];
    const customerSteps = ["name", "phone", "email", "area", "upi", "password", "review"];
    const steps = role === "worker" ? workerSteps : customerSteps;
    const currentStepKey = role ? steps[stepIdx] || "name" : null;

    const cleanPhone = phone.replace(/[^0-9]/g, "").slice(-10);
    const cleanAadhaar = aadhaar.replace(/[^0-9]/g, "");

    const validateCurrentStep = () => {
      if (!role || !currentStepKey) return false;
      switch (currentStepKey) {
        case "name":
          return name.trim().length >= 2;
        case "phone":
          return cleanPhone.length === 10;
        case "email":
          return !email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
        case "trade":
          return Boolean(trade);
        case "wage":
          return Number(rate) >= 300;
        case "area":
          return area.trim().length >= 2 && address.trim().length >= 3;
        case "aadhaar":
          return cleanAadhaar.length === 12;
        case "age":
          return Number(age) >= 18 && declare;
        case "photo":
          return Boolean(photoUrl);
        case "upi":
          return upiId.trim().includes("@") || role === "customer";
        case "password":
          return password.trim().length >= 4;
        case "review":
          return true;
        default:
          return true;
      }
    };

    const handleSnapAddress = async () => {
      if (typeof app.snapToRealWorldAddress === "function") {
        const res = await app.snapToRealWorldAddress();
        if (res) {
          const snappedArea = res.sublocality || res.locality || res.city || area;
          setArea(snappedArea);
          setAddress([res.street, res.sublocality, res.city || "Ludhiana"].filter(Boolean).join(", "));
          app.showNotification?.("Snapped real-world address: " + (res.sublocality || res.city));
          return;
        }
      }
      setArea("Model Town");
      setAddress("Model Town, Ludhiana");
    };

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
        streamRef.current = stream;
        setCameraActive(true);
        setTimeout(() => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        }, 50);
      } catch (_) {
        app.showNotification?.("Camera blocked — please upload a clear face photo instead.");
        fileInputRef.current?.click?.();
      }
    };

    const captureSelfie = () => {
      const video = videoRef.current;
      if (!video) return;
      const canvas = document.createElement("canvas");
      canvas.width = 480;
      canvas.height = 480;
      const ctx2d = canvas.getContext("2d");
      const size = Math.min(video.videoWidth || 480, video.videoHeight || 480);
      const sx = ((video.videoWidth || 480) - size) / 2;
      const sy = ((video.videoHeight || 480) - size) / 2;
      ctx2d.drawImage(video, sx, sy, size, size, 0, 0, 480, 480);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      setPhotoUrl(dataUrl);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      setCameraActive(false);
    };

    const handleFilePhoto = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => setPhotoUrl(String(reader.result || ""));
      reader.readAsDataURL(file);
    };

    const handleSubmitStep = (e) => {
      e.preventDefault();
      if (!validateCurrentStep()) return;
      if (stepIdx < steps.length - 1) {
        setStepIdx(stepIdx + 1);
        return;
      }
      // Final registration submission
      setSubmitting(true);
      const userId =
        (email && email.includes("@") ? email.split("@")[0].toLowerCase() : "") ||
        cleanPhone ||
        name.trim().toLowerCase().replace(/\s+/g, "_");
      if (role === "worker") {
        app.registerWorkerWithAuth?.({
          name: name.trim(),
          phone: "+91 " + cleanPhone,
          email: email.trim(),
          userId,
          password: password.trim(),
          area: area.trim(),
          city: app.currentCity?.name || "Ludhiana",
          address: address.trim(),
          primaryTrade: trade,
          dailyRate: Number(rate) || 850,
          experienceYears: Number(exp) || 1,
          aadhaarNumber: cleanAadhaar,
          upiId: upiId.trim() || `${cleanPhone}@upi`,
          photoUrl,
          age: Number(age) || 26,
          dateOfBirth: dob,
          childLabourConsent: declare,
          isPhoneVerified: true,
          isEmailVerified: emailVerified || Boolean(app.ssoGoogleUser?.email),
        });
      } else {
        app.registerCustomerWithAuth?.({
          name: name.trim(),
          phone: "+91 " + cleanPhone,
          email: email.trim(),
          userId,
          password: password.trim(),
          area: area.trim(),
          address: address.trim(),
          upiId: upiId.trim() || `${cleanPhone}@upi`,
          isPhoneVerified: true,
          isEmailVerified: emailVerified || Boolean(app.ssoGoogleUser?.email),
        });
      }
      app.setSsoGoogleUser?.(null);
      setSubmitting(false);
      setDone(true);
    };

    const handleSignInSubmit = async (e) => {
      e.preventDefault();
      setLoginErr("");
      setSubmitting(true);
      try {
        const fn = loginRole === "worker" ? app.loginWorkerWithAuth : app.loginCustomerWithAuth;
        const res = await fn?.(loginIdent, loginPwd);
        if (res && res.success) {
          navigate(loginRole === "worker" ? "/worker" : "/customer", { role: loginRole });
        } else {
          setLoginErr(res?.error || "Invalid credentials. Check your ID/Mobile/Email and password.");
        }
      } catch (err) {
        setLoginErr(err?.message || "Sign-in failed.");
      }
      setSubmitting(false);
    };

    const handleGoogleSSO = async () => {
      try {
        const res = await app.signInWithGoogleSSO?.(role || loginRole || undefined);
        if (res && res.loggedIn) {
          const targetRole = res.role === "worker" ? "worker" : "customer";
          navigate(targetRole === "worker" ? "/worker" : "/customer", { role: targetRole });
        }
      } catch (_) {}
    };

    const stepMeta = {
      name: { q: "What’s your full", qAccent: "name?", sub: "As it appears on your Aadhaar or bank account." },
      phone: { q: "Your mobile", qAccent: "number?", sub: "Used for OTP updates, arrival alerts, and direct UPI payout." },
      email: { q: "Gmail", qAccent: "address?", sub: "Optional — verifies your account with a 6-digit Gmail OTP." },
      trade: { q: "Pick your primary", qAccent: "trade.", sub: "Once set, jobs and your QR Gate Pass lock to this trade." },
      wage: { q: "Daily wage", qAccent: "expectation?", sub: "Customers see your rate upfront. You keep 80% + milestone bonuses." },
      area: { q: "Where in Ludhiana", qAccent: "are you?", sub: "We match jobs strictly within a 10 km GPS radius." },
      aadhaar: { q: "12-digit", qAccent: "Aadhaar ID.", sub: "Encrypted at rest for Admin KYC verification." },
      age: { q: "Confirm age", qAccent: "(18+ only).", sub: "Zero-tolerance compliance against child labour." },
      photo: { q: "Live face", qAccent: "photo.", sub: "Shown to customers before job start OTP and audited by Admin." },
      upi: { q: "Your UPI", qAccent: "ID?", sub: role === "worker" ? "Payouts go straight to this UPI ID via IMPS/UPI." : "Optional for instant refunds & escrow checkout." },
      password: { q: "Set a account", qAccent: "password.", sub: "At least 4 characters so you can sign in anytime." },
      review: { q: "Everything look", qAccent: "good?", sub: "Tap any row to edit before creating your Kaamzo account." },
    };

    const meta = stepMeta[currentStepKey] || stepMeta.name;
    const isWorker = role === "worker";
    const cardBg = isWorker ? "#1C1913" : "#FFFFFF";
    const cardFg = isWorker ? "#FBF8F2" : "#1C1913";
    const cardBlob = isWorker ? "rgba(245,165,36,0.16)" : "rgba(47,111,214,0.12)";
    const chipBg = isWorker ? "#F5A524" : "#DCEBFF";
    const chipFg = isWorker ? "#1C1913" : "#123A6B";
    const avatarBg = isWorker ? "#F5A524" : "#1C1913";
    const avatarFg = isWorker ? "#1C1913" : "#F5A524";

    const reviewRows = isWorker
      ? [
          { k: "Name", v: name || "—", step: 0 },
          { k: "Phone", v: cleanPhone ? "+91 " + cleanPhone : "—", step: 1 },
          { k: "Email", v: email || "Not set", step: 2 },
          { k: "Primary trade", v: trade, step: 3 },
          { k: "Daily rate", v: formatInr(rate) + "/day", step: 4 },
          { k: "Location", v: area + " (" + address + ")", step: 5 },
          { k: "Aadhaar", v: cleanAadhaar.length === 12 ? "XXXX-XXXX-" + cleanAadhaar.slice(-4) : "—", step: 6 },
          { k: "Age", v: age + " yrs", step: 7 },
          { k: "UPI ID", v: upiId || (cleanPhone ? cleanPhone + "@upi" : "—"), step: 9 },
        ]
      : [
          { k: "Name", v: name || "—", step: 0 },
          { k: "Phone", v: cleanPhone ? "+91 " + cleanPhone : "—", step: 1 },
          { k: "Email", v: email || "Not set", step: 2 },
          { k: "Location", v: area + " (" + address + ")", step: 3 },
          { k: "UPI ID", v: upiId || "Optional", step: 4 },
        ];

    const stepLabels = isWorker
      ? ["Name", "Phone", "Email", "Trade", "Wage", "Area", "Aadhaar", "18+", "Photo", "UPI", "Password", "Review"]
      : ["Name", "Phone", "Email", "Area", "UPI", "Password", "Review"];

    const activeTradeObj = U.getTradeMeta(trade);
    const keep80 = Math.round((Number(rate) || 850) * 0.8);

    return h(
      "div",
      {
        style: {
          position: "relative",
          minHeight: "100vh",
          overflow: "hidden",
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          color: "#1C1913",
          background: "linear-gradient(180deg, #C7DCEC 0%, #E9E4DC 45%, #F6E2CF 100%)",
        },
      },
      h(HeroWorkSceneSvg, { style: { position: "absolute", left: 0, bottom: 0, width: "100%", height: "520px", zIndex: 1 } }),

      // Header
      h(
        "header",
        {
          style: {
            position: "relative",
            zIndex: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "22px 24px",
            flexWrap: "wrap",
            gap: "12px",
          },
        },
        h(
          "a",
          {
            href: "/",
            onClick: (e) => {
              e.preventDefault();
              navigate("/", { role: "select_role" });
            },
            style: { textDecoration: "none", color: "#1C1913", fontWeight: 800, fontSize: "24px", letterSpacing: "-0.4px" },
          },
          "kaamzo",
          h("span", { style: { color: "#E8930C" } }, ".")
        ),
        h(
          "span",
          { style: { display: "flex", gap: "8px", alignItems: "center", fontSize: "14px", fontWeight: 600, color: "#3D3830" } },
          mode === "register" ? "Already registered?" : "New to Kaamzo?",
          h(
            "button",
            {
              type: "button",
              onClick: () => {
                setMode(mode === "register" ? "signin" : "register");
                setDone(false);
              },
              style: {
                padding: "10px 16px",
                borderRadius: "999px",
                border: 0,
                background: "#1C1913",
                color: "#FBF8F2",
                fontWeight: 700,
              },
            },
            mode === "register" ? "Sign in" : "Register free"
          )
        )
      ),

      // Main Grid: Live ID Card (left) + Form Card (right)
      h(
        "main",
        {
          style: {
            position: "relative",
            zIndex: 2,
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "12px 24px 520px",
            display: "flex",
            flexWrap: "wrap",
            gap: "32px",
            alignItems: "flex-start",
            justifyContent: "center",
          },
        },
        // LEFT: live rotated ID card
        h(
          "aside",
          { "aria-label": "Your Kaamzo profile preview", style: { flex: "1 1 360px", maxWidth: "460px", display: "flex", flexDirection: "column", gap: "18px", paddingTop: "18px" } },
          h(
            "p",
            { style: { margin: 0, fontFamily: "'Caveat', cursive", fontSize: "34px", lineHeight: 1.05, color: "#3D2A05" } },
            isWorker ? "Your digital Kaamzo pass — 80% yours, direct to UPI." : "Instant 10 km radar + escrow protection."
          ),
          h(
            "div",
            {
              style: {
                position: "relative",
                overflow: "hidden",
                borderRadius: "30px",
                background: cardBg,
                color: cardFg,
                padding: "24px",
                boxShadow: "0 30px 60px rgba(80,50,10,0.18)",
                transform: "rotate(-2deg)",
              },
            },
            h("div", { "aria-hidden": "true", style: { position: "absolute", right: "-50px", top: "-50px", width: "200px", height: "200px", borderRadius: "50%", background: cardBlob } }),
            h(
              "div",
              { style: { position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" } },
              h(
                "span",
                { style: { fontWeight: 800, fontSize: "18px" } },
                "kaamzo",
                h("span", { style: { color: "#E8930C" } }, "."),
                " ",
                h("span", { style: { fontWeight: 600, fontSize: "12px", opacity: 0.8 } }, "ID")
              ),
              h("span", { style: { padding: "6px 12px", borderRadius: "999px", background: chipBg, color: chipFg, fontSize: "11px", fontWeight: 800, letterSpacing: "0.6px" } }, role ? (isWorker ? "WORKER" : "CUSTOMER") : "NEW ACCOUNT")
            ),
            h(
              "div",
              { style: { position: "relative", marginTop: "20px", display: "flex", gap: "16px", alignItems: "center" } },
              photoUrl
                ? h("img", { src: photoUrl, alt: name || "Avatar", style: { width: "76px", height: "76px", borderRadius: "24px", objectFit: "cover", flex: "0 0 auto" } })
                : h("span", { style: { width: "76px", height: "76px", borderRadius: "24px", background: avatarBg, color: avatarFg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px", fontWeight: 800, flex: "0 0 auto" } }, (name.trim() || "K").slice(0, 1).toUpperCase()),
              h(
                "span",
                { style: { display: "flex", flexDirection: "column", gap: "4px", minWidth: 0 } },
                h("span", { style: { fontSize: "24px", fontWeight: 800, lineHeight: 1.1 } }, name.trim() || "Your Name"),
                h("span", { style: { fontSize: "13px", fontWeight: 600, opacity: 0.85 } }, (isWorker ? trade : "Verified Employer") + " · " + (area || "Ludhiana"))
              )
            ),
            h(
              "dl",
              { style: { position: "relative", margin: "20px 0 0", display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px" } },
              [
                { k: "MOBILE", v: cleanPhone ? "+91 " + cleanPhone : "Pending" },
                { k: isWorker ? "DAILY RATE" : "GPS RADIUS", v: isWorker ? formatInr(rate) + "/day" : "10 km strict" },
                { k: isWorker ? "AADHAAR KYC" : "ESCROW", v: isWorker ? (cleanAadhaar.length === 12 ? "XXXX-" + cleanAadhaar.slice(-4) : "Pending") : "OTP Released" },
                { k: "UPI", v: upiId || (cleanPhone ? cleanPhone + "@upi" : "Not set") },
              ].map((row) =>
                h(
                  "div",
                  {
                    key: row.k,
                    style: {
                      padding: "10px 12px",
                      borderRadius: "14px",
                      background: isWorker ? "rgba(255,255,255,0.08)" : "#FBF8F2",
                    },
                  },
                  h("dt", { style: { fontSize: "10px", fontWeight: 800, letterSpacing: "0.6px", opacity: 0.7 } }, row.k),
                  h("dd", { style: { margin: "2px 0 0", fontSize: "14px", fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, row.v)
                )
              )
            )
          ),
          role &&
            mode === "register" &&
            !done &&
            h(
              "ol",
              {
                style: {
                  listStyle: "none",
                  margin: "4px 0 0",
                  padding: "16px",
                  borderRadius: "24px",
                  background: "rgba(255,255,255,0.6)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                },
              },
              stepLabels.map((lbl, idx) => {
                const isDone = idx < stepIdx;
                const isCur = idx === stepIdx;
                return h(
                  "li",
                  {
                    key: lbl,
                    onClick: () => idx <= stepIdx && setStepIdx(idx),
                    style: {
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "7px 12px 7px 8px",
                      borderRadius: "999px",
                      background: isCur ? "#1C1913" : isDone ? "#E3F4E8" : "#FFFFFF",
                      color: isCur ? "#FBF8F2" : isDone ? "#1D6B36" : "#4A443A",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: idx <= stepIdx ? "pointer" : "default",
                    },
                  },
                  h(
                    "span",
                    {
                      style: {
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        background: isCur ? "#F5A524" : isDone ? "#2E9E57" : "#EFE7DA",
                        color: isCur ? "#1C1913" : isDone ? "#FFFFFF" : "#6F685D",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "11px",
                        fontWeight: 800,
                      },
                    },
                    isDone ? "✓" : String(idx + 1)
                  ),
                  lbl
                );
              })
            )
        ),

        // RIGHT: Question / Sign-In Card
        h(
          "section",
          {
            "aria-live": "polite",
            style: {
              flex: "1 1 440px",
              maxWidth: "560px",
              borderRadius: "34px",
              background: "rgba(255,255,255,0.86)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              border: "1px solid rgba(255,255,255,0.95)",
              boxShadow: "0 30px 70px rgba(80,50,10,0.16)",
              padding: "30px",
            },
          },
          // SIGN IN MODE
          mode === "signin" &&
            h(
              "form",
              { onSubmit: handleSignInSubmit, style: { display: "flex", flexDirection: "column", gap: "18px" } },
              h("span", { style: { fontSize: "13px", fontWeight: 800, letterSpacing: "1px", color: "#7A4E00" } }, "RETURNING USER SIGN IN"),
              h(
                "h1",
                { style: { margin: 0, fontSize: "38px", lineHeight: 1.02, letterSpacing: "-1.2px", fontWeight: 800 } },
                "Welcome ",
                h("span", { style: { fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400 } }, "back.")
              ),
              h(
                "div",
                { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", padding: "4px", borderRadius: "999px", background: "#F4EEE3" } },
                ["customer", "worker"].map((r) =>
                  h(
                    "button",
                    {
                      key: r,
                      type: "button",
                      onClick: () => setLoginRole(r),
                      style: {
                        height: "42px",
                        borderRadius: "999px",
                        border: 0,
                        fontWeight: 800,
                        fontSize: "14px",
                        background: loginRole === r ? "#1C1913" : "transparent",
                        color: loginRole === r ? "#FBF8F2" : "#4A443A",
                      },
                    },
                    r === "customer" ? "Customer / Employer" : "Worker"
                  )
                )
              ),
              h("input", {
                type: "text",
                placeholder: "User ID, Mobile number, or Email",
                value: loginIdent,
                onChange: (e) => setLoginIdent(e.target.value),
                required: true,
                style: {
                  height: "58px",
                  borderRadius: "18px",
                  border: "2px solid #E9DFCC",
                  background: "#FFFFFF",
                  padding: "0 16px",
                  fontSize: "16px",
                  fontWeight: 600,
                },
              }),
              h(
                "div",
                { style: { display: "flex", alignItems: "center", height: "58px", borderRadius: "18px", border: "2px solid #E9DFCC", background: "#FFFFFF", padding: "0 8px 0 16px" } },
                h("input", {
                  type: showPw ? "text" : "password",
                  placeholder: "Password",
                  value: loginPwd,
                  onChange: (e) => setLoginPwd(e.target.value),
                  required: true,
                  style: { flex: 1, minWidth: 0, height: "100%", border: 0, outline: "none", fontSize: "16px", fontWeight: 600, background: "transparent" },
                }),
                h(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowPw((v) => !v),
                    style: { height: "38px", padding: "0 12px", border: 0, borderRadius: "12px", background: "#F4EEE3", fontSize: "12px", fontWeight: 800 },
                  },
                  showPw ? "Hide" : "Show"
                )
              ),
              loginErr && h("span", { style: { fontSize: "13px", fontWeight: 800, color: "#B42318" } }, loginErr),
              h(
                "button",
                {
                  type: "submit",
                  disabled: submitting,
                  style: { height: "56px", border: 0, borderRadius: "999px", background: "#1C1913", color: "#FBF8F2", fontWeight: 800, fontSize: "16px" },
                },
                submitting ? "Signing in…" : "Sign in →"
              ),
              h("div", { style: { display: "flex", alignItems: "center", gap: "12px", color: "#857D70", fontSize: "12px", fontWeight: 700 } }, h("span", { style: { flex: 1, height: "1px", background: "#E9DFCC" } }), "OR", h("span", { style: { flex: 1, height: "1px", background: "#E9DFCC" } })),
              h(
                "button",
                {
                  type: "button",
                  onClick: handleGoogleSSO,
                  style: { height: "54px", borderRadius: "999px", border: "1px solid #E5DCCB", background: "#FFFFFF", fontWeight: 800, fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" },
                },
                h(
                  "svg",
                  { width: 20, height: 20, viewBox: "0 0 48 48", "aria-hidden": "true" },
                  h("path", { fill: "#EA4335", d: "M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.8 6C12.4 13.7 17.7 9.5 24 9.5z" }),
                  h("path", { fill: "#4285F4", d: "M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17.5z" }),
                  h("path", { fill: "#FBBC05", d: "M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.8-6C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.8-6z" }),
                  h("path", { fill: "#34A853", d: "M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.2-13.5-10l-7.8 6C6.6 42.6 14.6 48 24 48z" })
                ),
                "Continue with Google"
              )
            ),

          // ROLE PICK
          mode === "register" &&
            !done &&
            !role &&
            h(
              "div",
              { style: { display: "flex", flexDirection: "column", gap: "18px" } },
              h("span", { style: { fontSize: "13px", fontWeight: 800, letterSpacing: "1px", color: "#7A4E00" } }, app.ssoGoogleUser ? "FINISH GOOGLE ACCOUNT SETUP" : "CREATE YOUR ACCOUNT"),
              h(
                "h1",
                { style: { margin: 0, fontSize: "40px", lineHeight: 1.02, letterSpacing: "-1.2px", fontWeight: 800 } },
                "How will you use ",
                h("span", { style: { fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400 } }, "Kaamzo?")
              ),
              h(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setRole("customer");
                    setStepIdx(0);
                  },
                  style: { textAlign: "left", border: "2px solid #E9DFCC", borderRadius: "26px", background: "#FFFFFF", padding: "20px", display: "flex", alignItems: "center", gap: "16px" },
                },
                h(
                  "span",
                  { style: { width: "60px", height: "60px", borderRadius: "20px", background: "#DCEBFF", color: "#123A6B", display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }, "aria-hidden": "true" },
                  h(SvgIcon, { path: ICON_PATHS.home, size: 28, strokeWidth: 2 })
                ),
                h(
                  "span",
                  { style: { flex: 1, display: "flex", flexDirection: "column", gap: "3px" } },
                  h("span", { style: { fontSize: "20px", fontWeight: 800 } }, "I need a worker"),
                  h("span", { style: { fontSize: "14px", color: "#4A443A" } }, "Customer / employer · hire verified help")
                ),
                h("span", { style: { fontSize: "22px" }, "aria-hidden": "true" }, "→")
              ),
              h(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setRole("worker");
                    setStepIdx(0);
                  },
                  style: { textAlign: "left", border: 0, borderRadius: "26px", background: "#1C1913", color: "#FBF8F2", padding: "20px", display: "flex", alignItems: "center", gap: "16px" },
                },
                h(
                  "span",
                  { style: { width: "60px", height: "60px", borderRadius: "20px", background: "#F5A524", color: "#1C1913", display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" }, "aria-hidden": "true" },
                  h(SvgIcon, { path: ICON_PATHS.wrench, size: 28, strokeWidth: 2 })
                ),
                h(
                  "span",
                  { style: { flex: 1, display: "flex", flexDirection: "column", gap: "3px" } },
                  h(
                    "span",
                    { style: { fontSize: "20px", fontWeight: 800 } },
                    "I want work ",
                    h("span", { style: { fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: "17px", color: "#F3C969" } }, "· काम चाहिए")
                  ),
                  h("span", { style: { fontSize: "14px", color: "#D9CFC2" } }, "Worker · get jobs within 10 km, paid to UPI")
                ),
                h("span", { style: { fontSize: "22px" }, "aria-hidden": "true" }, "→")
              ),
              h("div", { style: { display: "flex", alignItems: "center", gap: "12px", color: "#857D70", fontSize: "12px", fontWeight: 700 } }, h("span", { style: { flex: 1, height: "1px", background: "#E9DFCC" } }), "OR", h("span", { style: { flex: 1, height: "1px", background: "#E9DFCC" } })),
              h(
                "button",
                {
                  type: "button",
                  onClick: handleGoogleSSO,
                  style: { height: "54px", borderRadius: "999px", border: "1px solid #E5DCCB", background: "#FFFFFF", fontWeight: 800, fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" },
                },
                h(
                  "svg",
                  { width: 20, height: 20, viewBox: "0 0 48 48", "aria-hidden": "true" },
                  h("path", { fill: "#EA4335", d: "M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.4 30.2 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.8 6C12.4 13.7 17.7 9.5 24 9.5z" }),
                  h("path", { fill: "#4285F4", d: "M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17.5z" }),
                  h("path", { fill: "#FBBC05", d: "M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.8-6C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.8-6z" }),
                  h("path", { fill: "#34A853", d: "M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.2-13.5-10l-7.8 6C6.6 42.6 14.6 48 24 48z" })
                ),
                "Continue with Google"
              )
            ),

          // ONE QUESTION PER STEP WIZARD
          mode === "register" &&
            !done &&
            role &&
            h(
              "form",
              { onSubmit: handleSubmitStep, style: { display: "flex", flexDirection: "column", gap: "18px" } },
              h(
                "div",
                { style: { display: "flex", alignItems: "center", gap: "12px" } },
                h(
                  "button",
                  {
                    type: "button",
                    onClick: () => (stepIdx > 0 ? setStepIdx(stepIdx - 1) : setRole(null)),
                    "aria-label": "Back",
                    style: { width: "44px", height: "44px", borderRadius: "50%", border: "1px solid #E5DCCB", background: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", flex: "0 0 auto" },
                  },
                  h(SvgIcon, { path: "M15 18l-6-6 6-6", size: 16, strokeWidth: 2.6 })
                ),
                h(
                  "div",
                  { style: { flex: 1, display: "flex", flexDirection: "column", gap: "6px" } },
                  h(
                    "span",
                    { style: { display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 800, color: "#6F685D" } },
                    h("span", null, isWorker ? "WORKER REGISTRATION" : "CUSTOMER REGISTRATION"),
                    h("span", null, `Step ${stepIdx + 1} of ${steps.length}`)
                  ),
                  h(
                    "span",
                    { style: { height: "8px", borderRadius: "8px", background: "#EFE7DA", overflow: "hidden" } },
                    h("span", { style: { display: "block", height: "8px", width: Math.round(((stepIdx + 1) / steps.length) * 100) + "%", borderRadius: "8px", background: "#E8930C", transition: "width 400ms ease" } })
                  )
                )
              ),
              h(
                "div",
                { style: { display: "flex", flexDirection: "column", gap: "6px" } },
                h(
                  "h1",
                  { style: { margin: 0, fontSize: "34px", lineHeight: 1.08, letterSpacing: "-1px", fontWeight: 800 } },
                  meta.q + " ",
                  h("span", { style: { fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400 } }, meta.qAccent)
                ),
                h("p", { style: { margin: 0, fontSize: "15px", lineHeight: 1.5, color: "#4A443A" } }, meta.sub)
              ),

              // Step fields
              currentStepKey === "name" &&
                h(
                  "div",
                  { style: { display: "flex", flexDirection: "column", gap: "6px" } },
                  h("input", {
                    type: "text",
                    autoFocus: true,
                    placeholder: "e.g. Rajesh Kumar",
                    value: name,
                    onChange: (e) => setName(e.target.value),
                    style: { height: "60px", borderRadius: "18px", border: "2px solid " + (name.trim().length >= 2 ? "#2E9E57" : "#E9DFCC"), background: "#FFFFFF", padding: "0 16px", fontSize: "18px", fontWeight: 600 },
                  })
                ),

              currentStepKey === "phone" &&
                h(
                  "div",
                  { style: { display: "flex", alignItems: "center", gap: "8px", height: "60px", padding: "0 16px", borderRadius: "18px", border: "2px solid " + (cleanPhone.length === 10 ? "#2E9E57" : "#E9DFCC"), background: "#FFFFFF" } },
                  h("span", { style: { padding: "6px 10px", borderRadius: "10px", background: "#F4EEE3", fontWeight: 800, fontSize: "15px" } }, "+91"),
                  h("input", {
                    type: "tel",
                    inputMode: "numeric",
                    autoFocus: true,
                    placeholder: "98140 12345",
                    value: phone,
                    onChange: (e) => setPhone(e.target.value),
                    style: { flex: 1, minWidth: 0, height: "100%", border: 0, outline: "none", fontSize: "18px", fontWeight: 600, background: "transparent" },
                  })
                ),

              currentStepKey === "email" &&
                h(
                  "div",
                  { style: { display: "flex", flexDirection: "column", gap: "10px" } },
                  h(
                    "div",
                    { style: { display: "flex", alignItems: "center", gap: "8px", height: "60px", padding: "0 10px 0 16px", borderRadius: "18px", border: "2px solid " + (emailVerified ? "#2E9E57" : "#E9DFCC"), background: "#FFFFFF" } },
                    h("input", {
                      type: "email",
                      placeholder: "you@gmail.com",
                      value: email,
                      onChange: (e) => {
                        setEmail(e.target.value);
                        setEmailVerified(false);
                      },
                      style: { flex: 1, minWidth: 0, height: "100%", border: 0, outline: "none", fontSize: "17px", fontWeight: 600, background: "transparent" },
                    }),
                    email &&
                      email.includes("@") &&
                      !emailVerified &&
                      h(
                        "button",
                        {
                          type: "button",
                          onClick: () =>
                            openOtpModal?.({
                              email: email.trim(),
                              role,
                              onVerified: () => setEmailVerified(true),
                            }),
                          style: { height: "40px", padding: "0 14px", borderRadius: "999px", border: 0, background: "#F5A524", color: "#1C1913", fontWeight: 800, fontSize: "12px" },
                        },
                        "Send 6-digit OTP"
                      ),
                    emailVerified &&
                      h("span", { style: { padding: "6px 10px", borderRadius: "999px", background: "#E3F4E8", color: "#1D6B36", fontSize: "12px", fontWeight: 800 } }, "✓ Verified")
                  )
                ),

              currentStepKey === "trade" &&
                h(
                  "div",
                  { role: "radiogroup", "aria-label": "Your trade", style: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "10px" } },
                  TRADES.map((t) => {
                    const sel = trade === t.id;
                    return h(
                      "button",
                      {
                        key: t.id,
                        type: "button",
                        role: "radio",
                        "aria-checked": sel,
                        onClick: () => {
                          setTrade(t.id);
                          setRate(t.rate);
                        },
                        style: {
                          borderRadius: "20px",
                          border: "2px solid " + (sel ? "#1C1913" : "#EFE7DA"),
                          background: sel ? t.bg : "#FFFFFF",
                          padding: "14px 8px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "8px",
                          color: "#1C1913",
                        },
                      },
                      h(
                        "span",
                        { style: { width: "44px", height: "44px", borderRadius: "14px", background: t.bg, color: t.fg, display: "flex", alignItems: "center", justifyContent: "center" } },
                        h(SvgIcon, { path: t.icon, size: 22 })
                      ),
                      h("span", { style: { fontSize: "13px", fontWeight: 800 } }, t.name)
                    );
                  })
                ),

              currentStepKey === "wage" &&
                h(
                  "div",
                  { style: { display: "flex", flexDirection: "column", gap: "16px" } },
                  h(
                    "div",
                    { style: { padding: "18px", borderRadius: "22px", background: "#FFF0BF", display: "flex", flexDirection: "column", gap: "10px" } },
                    h(
                      "label",
                      { htmlFor: "kz-reg-wage", style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: "13px", fontWeight: 800 } },
                      "Daily wage expectation",
                      h(
                        "span",
                        { style: { fontFamily: "'Instrument Serif', serif", fontSize: "40px", fontWeight: 400 } },
                        formatInr(rate),
                        h("span", { style: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "13px", fontWeight: 700 } }, " /day")
                      )
                    ),
                    h("input", {
                      id: "kz-reg-wage",
                      type: "range",
                      min: 300,
                      max: 2500,
                      step: 50,
                      value: rate,
                      onChange: (e) => setRate(Number(e.target.value)),
                    }),
                    h(
                      "span",
                      { style: { display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: 700, color: "#6B4600" } },
                      h("span", null, "₹300"),
                      h("span", null, `You keep 80% · ${formatInr(keep80)} per day`),
                      h("span", null, "₹2,500")
                    )
                  ),
                  h(
                    "div",
                    { style: { padding: "14px 18px", borderRadius: "22px", background: "#DCEBFF", display: "flex", alignItems: "center", justifyContent: "space-between" } },
                    h("span", { style: { fontSize: "13px", fontWeight: 800 } }, "Experience"),
                    h(
                      "span",
                      { style: { display: "flex", alignItems: "center", gap: "12px" } },
                      h("button", { type: "button", onClick: () => setExp((e) => Math.max(0, e - 1)), style: { width: "44px", height: "44px", borderRadius: "50%", border: 0, background: "#FFFFFF", fontSize: "22px", fontWeight: 800 } }, "−"),
                      h("span", { style: { minWidth: "76px", textAlign: "center", fontSize: "24px", fontWeight: 800 } }, exp + " yrs"),
                      h("button", { type: "button", onClick: () => setExp((e) => Math.min(40, e + 1)), style: { width: "44px", height: "44px", borderRadius: "50%", border: 0, background: "#1C1913", color: "#FBF8F2", fontSize: "22px", fontWeight: 800 } }, "+")
                    )
                  )
                ),

              currentStepKey === "area" &&
                h(
                  "div",
                  { style: { display: "flex", flexDirection: "column", gap: "12px" } },
                  h("input", {
                    type: "text",
                    placeholder: "Neighbourhood (e.g. Model Town, Dugri)",
                    value: area,
                    onChange: (e) => setArea(e.target.value),
                    style: { height: "56px", borderRadius: "18px", border: "2px solid #E9DFCC", background: "#FFFFFF", padding: "0 16px", fontSize: "17px", fontWeight: 600 },
                  }),
                  h("input", {
                    type: "text",
                    placeholder: "Full street / landmark address",
                    value: address,
                    onChange: (e) => setAddress(e.target.value),
                    style: { height: "56px", borderRadius: "18px", border: "2px solid #E9DFCC", background: "#FFFFFF", padding: "0 16px", fontSize: "16px", fontWeight: 600 },
                  }),
                  h(
                    "button",
                    {
                      type: "button",
                      onClick: handleSnapAddress,
                      style: {
                        alignSelf: "flex-start",
                        height: "44px",
                        padding: "0 16px",
                        borderRadius: "999px",
                        border: "1px solid #E8D3A8",
                        background: "#FFF7E3",
                        color: "#7A4E00",
                        fontWeight: 800,
                        fontSize: "13px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      },
                    },
                    h(SvgIcon, { path: ICON_PATHS.radar, size: 16 }),
                    "Snap my real-world address"
                  )
                ),

              currentStepKey === "aadhaar" &&
                h("input", {
                  type: "text",
                  inputMode: "numeric",
                  maxLength: 14,
                  placeholder: "1234 5678 9012",
                  value: aadhaar,
                  onChange: (e) => setAadhaar(e.target.value),
                  style: { height: "60px", borderRadius: "18px", border: "2px solid " + (cleanAadhaar.length === 12 ? "#2E9E57" : "#E9DFCC"), background: "#FFFFFF", padding: "0 16px", fontSize: "20px", fontWeight: 700, letterSpacing: "2px" },
                }),

              currentStepKey === "age" &&
                h(
                  "div",
                  { style: { display: "flex", flexDirection: "column", gap: "14px" } },
                  h(
                    "div",
                    { style: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "10px" } },
                    h(
                      "label",
                      { style: { display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: 800 } },
                      "Age in years (18+)",
                      h("input", {
                        type: "number",
                        inputMode: "numeric",
                        value: age,
                        onChange: (e) => setAge(e.target.value),
                        style: { height: "60px", borderRadius: "18px", border: "2px solid " + (Number(age) >= 18 ? "#2E9E57" : "#E5484D"), background: "#FFFFFF", padding: "0 16px", fontSize: "18px", fontWeight: 600 },
                      })
                    ),
                    h(
                      "label",
                      { style: { display: "flex", flexDirection: "column", gap: "6px", fontSize: "13px", fontWeight: 800 } },
                      "Date of birth",
                      h("input", {
                        type: "date",
                        value: dob,
                        onChange: (e) => setDob(e.target.value),
                        style: { height: "60px", borderRadius: "18px", border: "2px solid #E9DFCC", background: "#FFFFFF", padding: "0 14px", fontSize: "16px", fontWeight: 600 },
                      })
                    )
                  ),
                  Number(age) < 18 && h("span", { style: { fontSize: "12px", fontWeight: 800, color: "#B42318" } }, "Workers must be at least 18 years old."),
                  h(
                    "label",
                    { style: { display: "flex", gap: "12px", alignItems: "flex-start", padding: "14px", borderRadius: "18px", background: "#FFF7E3", fontSize: "13px", lineHeight: 1.5, color: "#3D3830", cursor: "pointer" } },
                    h("input", { type: "checkbox", checked: declare, onChange: (e) => setDeclare(e.target.checked), style: { width: "22px", height: "22px", margin: 0, accentColor: "#E8930C", flex: "0 0 auto" } }),
                    "I declare that I am 18 years of age or older. I understand that child labour is strictly prohibited on Kaamzo and my face photo will be audited."
                  )
                ),

              currentStepKey === "photo" &&
                h(
                  "div",
                  { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "14px", padding: "18px", borderRadius: "24px", background: "#FFF7E3", border: "1px solid #F1DEB4" } },
                  cameraActive
                    ? h(
                        "div",
                        { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" } },
                        h("video", { ref: videoRef, autoPlay: true, playsInline: true, muted: true, style: { width: "180px", height: "180px", borderRadius: "50%", objectFit: "cover", border: "4px solid #F5A524" } }),
                        h("button", { type: "button", onClick: captureSelfie, style: { height: "44px", padding: "0 20px", border: 0, borderRadius: "999px", background: "#2E9E57", color: "#FFFFFF", fontWeight: 800 } }, "Capture Selfie")
                      )
                    : photoUrl
                    ? h("img", { src: photoUrl, alt: "Selfie preview", style: { width: "150px", height: "150px", borderRadius: "50%", objectFit: "cover", border: "4px solid #2E9E57" } })
                    : h(
                        "span",
                        { style: { width: "150px", height: "150px", borderRadius: "50%", border: "4px dashed #E8930C", background: "#FFFFFF", color: "#7A4E00", display: "flex", alignItems: "center", justifyContent: "center" } },
                        h(SvgIcon, { path: ICON_PATHS.camera, size: 52, strokeWidth: 1.8 })
                      ),
                  h("span", { style: { fontSize: "14px", fontWeight: 800, color: photoUrl ? "#1D6B36" : "#7A4E00" } }, photoUrl ? "Face photo captured ✓" : "Waiting for clear live selfie"),
                  h(
                    "span",
                    { style: { display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center" } },
                    h("button", { type: "button", onClick: startCamera, style: { height: "46px", padding: "0 18px", border: 0, borderRadius: "999px", background: "#1C1913", color: "#FBF8F2", fontWeight: 800, fontSize: "14px" } }, "Take live selfie"),
                    h("button", { type: "button", onClick: () => fileInputRef.current?.click?.(), style: { height: "46px", padding: "0 18px", borderRadius: "999px", border: "1px solid #E5DCCB", background: "#FFFFFF", fontWeight: 800, fontSize: "14px" } }, "Upload photo"),
                    h("input", { ref: fileInputRef, type: "file", accept: "image/*", style: { display: "none" }, onChange: handleFilePhoto })
                  ),
                  h("span", { style: { fontSize: "12px", color: "#6B4600", textAlign: "center", lineHeight: 1.5 } }, "Mandatory anti-child-labour check under the Child Labour (Prohibition and Regulation) Act.")
                ),

              currentStepKey === "upi" &&
                h("input", {
                  type: "text",
                  placeholder: cleanPhone ? cleanPhone + "@upi" : "name@okaxis",
                  value: upiId,
                  onChange: (e) => setUpiId(e.target.value),
                  style: { height: "60px", borderRadius: "18px", border: "2px solid #E9DFCC", background: "#FFFFFF", padding: "0 16px", fontSize: "18px", fontWeight: 600 },
                }),

              currentStepKey === "password" &&
                h(
                  "div",
                  { style: { display: "flex", alignItems: "center", height: "60px", borderRadius: "18px", border: "2px solid " + (password.length >= 4 ? "#2E9E57" : "#E9DFCC"), background: "#FFFFFF", padding: "0 8px 0 16px" } },
                  h("input", {
                    type: showPw ? "text" : "password",
                    placeholder: "Minimum 4 characters",
                    value: password,
                    onChange: (e) => setPassword(e.target.value),
                    style: { flex: 1, minWidth: 0, height: "100%", border: 0, outline: "none", fontSize: "18px", fontWeight: 600, background: "transparent" },
                  }),
                  h(
                    "button",
                    { type: "button", onClick: () => setShowPw((v) => !v), style: { height: "40px", padding: "0 12px", border: 0, borderRadius: "12px", background: "#F4EEE3", fontSize: "12px", fontWeight: 800 } },
                    showPw ? "Hide" : "Show"
                  )
                ),

              currentStepKey === "review" &&
                h(
                  "div",
                  { style: { display: "flex", flexDirection: "column", gap: "12px" } },
                  h(
                    "div",
                    { style: { display: "flex", flexDirection: "column", borderRadius: "22px", border: "1px solid #EFE7DA", background: "#FFFFFF", overflow: "hidden" } },
                    reviewRows.map((r, i) =>
                      h(
                        "div",
                        { key: r.k, style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", padding: "12px 16px", borderTop: i === 0 ? 0 : "1px solid #F4EEE3" } },
                        h("span", { style: { fontSize: "12px", fontWeight: 800, color: "#6F685D" } }, r.k),
                        h(
                          "span",
                          { style: { display: "flex", alignItems: "center", gap: "10px", minWidth: 0 } },
                          h("span", { style: { fontSize: "14px", fontWeight: 800, textAlign: "right", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, r.v),
                          h("button", { type: "button", onClick: () => setStepIdx(r.step), style: { border: 0, background: "transparent", color: "#7A4E00", fontSize: "12px", fontWeight: 800, padding: "6px" } }, "Edit")
                        )
                      )
                    )
                  ),
                  h(
                    "p",
                    { style: { margin: 0, fontSize: "12px", color: "#6F685D", lineHeight: 1.5 } },
                    "By registering you agree to Kaamzo’s ",
                    h("a", { href: "https://kaamzo-terms.vercel.app/", target: "_blank", rel: "noopener noreferrer" }, "Terms of Service & Platform Policies"),
                    "."
                  )
                ),

              h(
                "button",
                {
                  type: "submit",
                  disabled: submitting || !validateCurrentStep(),
                  style: {
                    height: "60px",
                    border: 0,
                    borderRadius: "999px",
                    background: validateCurrentStep() ? "#1C1913" : "#D6CEC0",
                    color: "#FBF8F2",
                    fontWeight: 800,
                    fontSize: "17px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "10px",
                  },
                },
                currentStepKey === "review" ? (submitting ? "Creating account…" : "Create my Kaamzo account") : "Continue",
                h(SvgIcon, { path: ICON_PATHS.arrowR, size: 18, strokeWidth: 2.6 })
              ),
              h("span", { style: { textAlign: "center", fontSize: "12px", fontWeight: 700, color: "#857D70" } }, "Press Enter to continue")
            ),

          // DONE SCREEN
          done &&
            h(
              "div",
              { style: { display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "16px", padding: "20px 0" } },
              h(
                "svg",
                { width: 220, height: 120, viewBox: "0 0 220 120", "aria-hidden": "true" },
                h("circle", { cx: 30, cy: 30, r: 6, fill: "#F5A524" }),
                h("circle", { cx: 190, cy: 24, r: 5, fill: "#2F6FD6" }),
                h("rect", { x: 170, y: 80, width: 12, height: 12, rx: 3, fill: "#D9478E", transform: "rotate(20 176 86)" }),
                h("rect", { x: 34, y: 84, width: 10, height: 10, rx: 2, fill: "#2E9E57", transform: "rotate(-15 39 89)" }),
                h("circle", { cx: 110, cy: 60, r: 50, fill: "#2E9E57" }),
                h("path", { d: "m88 60 15 15 30-32", fill: "none", stroke: "#FFFFFF", strokeWidth: 10, strokeLinecap: "round", strokeLinejoin: "round" })
              ),
              h(
                "h1",
                { style: { margin: 0, fontSize: "38px", lineHeight: 1.05, letterSpacing: "-1px", fontWeight: 800 } },
                "Welcome to Kaamzo, ",
                h("span", { style: { fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400 } }, (name.trim().split(" ")[0] || "friend") + "!")
              ),
              h(
                "p",
                { style: { margin: 0, fontSize: "15px", lineHeight: 1.5, color: "#4A443A", maxWidth: "380px" } },
                isWorker
                  ? `Your ${activeTradeObj.name} profile is live in ${area}. Check your nearby 10 km job board now.`
                  : `Your Employer account is active in ${area}. Find Aadhaar-verified workers within 10 km.`
              ),
              h(
                "button",
                {
                  type: "button",
                  onClick: () => navigate(isWorker ? "/jobs" : "/customer", { role: isWorker ? "worker" : "customer" }),
                  style: { height: "56px", padding: "0 26px", border: 0, borderRadius: "999px", background: "#1C1913", color: "#FBF8F2", fontWeight: 800, display: "flex", alignItems: "center", fontSize: "16px" },
                },
                isWorker ? "See jobs near you →" : "Open Customer Portal →"
              ),
              h(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setDone(false);
                    setRole(null);
                    setStepIdx(0);
                  },
                  style: { border: 0, background: "transparent", color: "#7A4E00", fontWeight: 800, fontSize: "13px" },
                },
                "Start again"
              )
            )
        )
      )
    );
  };
})();


/* Part 3 — Customer Portal (/customer/*) & Mobile Layouts */
(function () {
  "use strict";
  const KZ = window.__KZ_REDESIGN__;
  const U = KZ.utils;
  const C = KZ.components;
  const {
    h,
    useApp,
    useState,
    useEffect,
    useRef,
    useMemo,
    ICON_PATHS,
    TRADES,
    LUDHIANA_AREAS,
    normalizeTrade,
    getTradeMeta,
    getLiveTradeRate,
    haversineKm,
    formatInr,
    navigate,
    launchRazorpayCheckout,
  } = U;
  const { SvgIcon, TopUtilityBar, KaamzoFooter, JobProgressPipeline } = C;

  const CUSTOMER_SUBNAV = [
    { path: "/customer", label: "Find workers" },
    { path: "/customer/my-bookings", label: "My bookings" },
    { path: "/customer/support", label: "Support" },
    { path: "/customer/post-a-job", label: "+ Post a job" },
    { path: "/customer/live-eta-attendance", label: "Live ETA" },
    { path: "/customer/crew-and-rebook", label: "Crew & rebook" },
    { path: "/customer/sos-check-in", label: "SOS check-in" },
    { path: "/customer/map-and-radar", label: "10 km Radar" },
    { path: "/customer/scan-badge-and-chat", label: "Scan & chat" },
  ];

  function CustomerShell({ path, openOtpModal, children }) {
    const app = useApp();
    const isDark = app.isDarkMode;
    const cust = app.currentCustomer;
    const displayName = cust?.name || "Guest Employer";
    const areaName = cust?.area || app.currentCity?.name || "Ludhiana";

    const mainTabs = [
      { path: "/customer", label: "Find workers", match: (p) => p === "/customer" },
      { path: "/customer/my-bookings", label: "My bookings", match: (p) => p === "/customer/my-bookings" },
      { path: "/customer/support", label: "Support", match: (p) => p === "/customer/support" },
    ];

    const quickTools = CUSTOMER_SUBNAV.slice(3);

    return h(
      "div",
      {
        style: {
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          background: isDark ? "#14120E" : "#FBF8F2",
          color: isDark ? "#EDE6DA" : "#1C1913",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        },
      },
      h(TopUtilityBar, { compact: false }),

      // Sticky Customer Header
      h(
        "header",
        {
          className: "kz-app-header " + (isDark ? "kz-sticky-header" : ""),
          style: {
            position: "sticky",
            top: 0,
            zIndex: 40,
            background: isDark ? "rgba(20,18,14,0.92)" : "rgba(251,248,242,0.92)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderBottom: "1px solid " + (isDark ? "#2E2A22" : "#EFE7DA"),
          },
        },
        h(
          "div",
          {
            style: {
              maxWidth: "1320px",
              margin: "0 auto",
              padding: "12px 24px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "14px",
            },
          },
          h(
            "a",
            {
              href: "/",
              onClick: (e) => {
                e.preventDefault();
                navigate("/", { role: "select_role" });
              },
              style: {
                textDecoration: "none",
                color: isDark ? "#EDE6DA" : "#1C1913",
                fontWeight: 800,
                fontSize: "22px",
                letterSpacing: "-0.4px",
              },
            },
            "kaamzo",
            h("span", { style: { color: "#E8930C" } }, ".")
          ),
          h(
            "nav",
            {
              "aria-label": "Customer",
              className: "kz-tabs " + (isDark ? "kz-tab-track" : ""),
              style: {
                display: "flex",
                gap: "4px",
                padding: "5px",
                borderRadius: "999px",
                background: isDark ? "#1F1C17" : "#FFFFFF",
                border: "1px solid " + (isDark ? "#2E2A22" : "#EFE7DA"),
              },
            },
            mainTabs.map((t) => {
              const active = t.match(path);
              return h(
                "button",
                {
                  key: t.path,
                  type: "button",
                  "aria-current": active ? "page" : undefined,
                  onClick: () => navigate(t.path, { role: "customer" }),
                  style: {
                    padding: "10px 16px",
                    borderRadius: "999px",
                    border: 0,
                    background: active ? (isDark ? "#F5A524" : "#1C1913") : "transparent",
                    color: active ? (isDark ? "#14120E" : "#FBF8F2") : isDark ? "#EDE6DA" : "#3D3830",
                    fontSize: "14px",
                    fontWeight: 700,
                  },
                },
                t.label
              );
            })
          ),
          h(
            "div",
            { style: { marginLeft: "auto", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px" } },
            h(
              "button",
              {
                type: "button",
                onClick: () => navigate("/customer/post-a-job", { role: "customer" }),
                style: {
                  height: "44px",
                  padding: "0 18px",
                  borderRadius: "999px",
                  border: 0,
                  background: "#F5A524",
                  color: "#1C1913",
                  fontWeight: 800,
                  fontSize: "14px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                },
              },
              h(SvgIcon, { path: ICON_PATHS.plus, size: 16, strokeWidth: 2.6 }),
              "Post a job",
              h(
                "span",
                {
                  style: {
                    padding: "3px 8px",
                    borderRadius: "999px",
                    background: "#1C1913",
                    color: "#F5A524",
                    fontSize: "10px",
                    fontWeight: 800,
                  },
                },
                "LIVE"
              )
            ),
            cust?.email &&
              !cust.isEmailVerified &&
              h(
                "button",
                {
                  type: "button",
                  onClick: () =>
                    openOtpModal?.({
                      email: cust.email,
                      role: "customer",
                      onVerified: () => app.showNotification?.("Gmail verified!"),
                    }),
                  style: {
                    height: "44px",
                    padding: "0 16px",
                    borderRadius: "999px",
                    border: "1px solid #E8D3A8",
                    background: "#FFF7E3",
                    color: "#7A4E00",
                    fontWeight: 700,
                    fontSize: "13px",
                  },
                },
                "Verify Gmail"
              ),
            h(
              "span",
              { className: "hide-sm", style: { display: "flex", alignItems: "center", gap: "10px", paddingLeft: "6px" } },
              h(
                "span",
                { style: { display: "flex", flexDirection: "column", alignItems: "flex-end" } },
                h("span", { style: { fontSize: "14px", fontWeight: 800 } }, displayName),
                h("span", { style: { fontSize: "11px", fontWeight: 700, color: isDark ? "#A49B8C" : "#6F685D" } }, `Customer · ${areaName}`)
              ),
              h(
                "span",
                {
                  style: {
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    background: "#1C1913",
                    color: "#F5A524",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                  },
                },
                displayName.slice(0, 1).toUpperCase()
              )
            ),
            h(
              "button",
              {
                type: "button",
                "aria-label": cust ? "Sign out" : "Sign in",
                onClick: () => {
                  if (cust) {
                    app.logoutCustomer?.();
                    navigate("/", { role: "select_role" });
                  } else {
                    navigate("/register", { registerRole: "customer" });
                  }
                },
                style: {
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  border: "1px solid " + (isDark ? "#2E2A22" : "#EFE7DA"),
                  background: isDark ? "#1F1C17" : "#FFFFFF",
                  color: isDark ? "#EDE6DA" : "#3D3830",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                },
              },
              h(SvgIcon, { path: cust ? "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9" : ICON_PATHS.user, size: 18 })
            )
          )
        ),
        // Sub-navigation quick pills row
        h(
          "div",
          {
            style: {
              borderTop: "1px solid " + (isDark ? "#2E2A22" : "#EFE7DA"),
              background: isDark ? "#191611" : "#F4EEE3",
            },
          },
          h(
            "div",
            {
              style: {
                maxWidth: "1320px",
                margin: "0 auto",
                padding: "8px 24px",
                display: "flex",
                gap: "8px",
                overflowX: "auto",
                alignItems: "center",
              },
            },
            quickTools.map((tool) => {
              const active = path === tool.path || (tool.path === "/customer/live-eta-attendance" && path === "/customer/work");
              return h(
                "button",
                {
                  key: tool.path,
                  type: "button",
                  onClick: () => navigate(tool.path, { role: "customer" }),
                  style: {
                    whiteSpace: "nowrap",
                    height: "34px",
                    padding: "0 14px",
                    borderRadius: "999px",
                    border: "1px solid " + (active ? "#1C1913" : isDark ? "#3A342C" : "#E5DCCB"),
                    background: active ? "#1C1913" : isDark ? "#1F1C17" : "#FFFFFF",
                    color: active ? "#FBF8F2" : isDark ? "#EDE6DA" : "#3D3830",
                    fontSize: "12px",
                    fontWeight: 700,
                  },
                },
                tool.label
              );
            })
          )
        )
      ),

      h("div", { style: { flex: 1, paddingBottom: "40px" } }, children),

      // Mobile sticky bottom tab bar (visible <=760px via .mbar)
      h(
        "nav",
        {
          className: "mbar",
          "aria-label": "Customer mobile tabs",
          style: {
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 55,
            background: isDark ? "#1F1C17" : "#FFFFFF",
            borderTop: "1px solid " + (isDark ? "#2E2A22" : "#EFE7DA"),
            padding: "8px 10px",
          },
        },
        h(
          "div",
          { style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "6px" } },
          [
            { path: "/customer", label: "Find", icon: ICON_PATHS.search },
            { path: "/customer/post-a-job", label: "Post", icon: ICON_PATHS.plus },
            { path: "/customer/my-bookings", label: "Bookings", icon: ICON_PATHS.briefcase },
            { path: "/customer/live-eta-attendance", label: "Live", icon: ICON_PATHS.pin },
          ].map((m) => {
            const act = path === m.path || (m.path === "/customer/live-eta-attendance" && path === "/customer/work");
            return h(
              "button",
              {
                key: m.path,
                type: "button",
                onClick: () => navigate(m.path, { role: "customer" }),
                style: {
                  border: 0,
                  borderRadius: "14px",
                  padding: "6px 4px",
                  background: act ? "#FFF0BF" : "transparent",
                  color: act ? "#6B4600" : isDark ? "#CFC6B8" : "#4A443A",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "2px",
                  fontSize: "11px",
                  fontWeight: 800,
                },
              },
              h(SvgIcon, { path: m.icon, size: 17 }),
              m.label
            );
          })
        )
      ),

      h(KaamzoFooter, null)
    );
  }

  // -------------------------------------------------------------------------
  // 1. /customer — Find Workers Hero + 10km Radar Matches + Direct Hire Modal
  // -------------------------------------------------------------------------
  function CustomerFindView() {
    const app = useApp();
    const isDark = app.isDarkMode;
    const cust = app.currentCustomer;
    const workers = app.workers || [];
    const jobs = app.jobs || [];

    const myCustomerJobs = useMemo(() => {
      if (!cust?.phone && !cust?.name) return jobs;
      const cleanCPhone = String(cust.phone || "").replace(/[^0-9]/g, "").slice(-10);
      const filtered = jobs.filter((j) => {
        const jPhone = String(j.customerPhone || "").replace(/[^0-9]/g, "").slice(-10);
        return (cleanCPhone && jPhone === cleanCPhone) || (cust.name && j.customerName === cust.name);
      });
      return filtered.length > 0 ? filtered : jobs;
    }, [jobs, cust?.phone, cust?.name]);

    const pendingPayJobs = myCustomerJobs.filter((j) => j.status === "completed_pending_payment");
    const trackableJobs = myCustomerJobs
      .filter((j) => ["broadcast", "open", "accepted", "approved", "in_progress", "paid_and_closed"].includes(j.status))
      .slice(0, 4);

    const [query, setQuery] = useState(() => KZ.lastSearchQuery || "");
    const [selectedTrade, setSelectedTrade] = useState(() => KZ.lastSelectedTrade || "All");
    const [strict10Km, setStrict10Km] = useState(true);
    const [hireWorker, setHireWorker] = useState(null);
    const [hireTitle, setHireTitle] = useState("");
    const [hireDays, setHireDays] = useState(1);

    const custGps = cust?.gpsLocation || {
      lat: app.currentCity?.lat || 30.8926,
      lng: app.currentCity?.lng || 75.8415,
    };

    const filteredWorkers = useMemo(() => {
      return workers
        .map((w) => {
          const wGps = w.gpsLocation || {};
          const km =
            typeof wGps.lat === "number" && typeof custGps.lat === "number"
              ? haversineKm(custGps.lat, custGps.lng, wGps.lat, wGps.lng)
              : w.location?.distanceKm ?? 2.4;
          return Object.assign({}, w, { _distanceKm: Math.max(0.3, Number(km || 2.1)) });
        })
        .filter((w) => w.isVerified !== false)
        .filter((w) => (strict10Km ? w._distanceKm <= 10.0 : true))
        .filter((w) => {
          if (selectedTrade === "All") return true;
          return normalizeTrade(w.primaryTrade) === normalizeTrade(selectedTrade);
        })
        .filter((w) => {
          if (!query.trim()) return true;
          const q = query.trim().toLowerCase();
          return (
            String(w.name || "").toLowerCase().includes(q) ||
            String(w.primaryTrade || "").toLowerCase().includes(q) ||
            String(w.location?.area || "").toLowerCase().includes(q)
          );
        })
        .sort((a, b) => (b.rating || 4.8) - (a.rating || 4.8) || a._distanceKm - b._distanceKm);
    }, [workers, selectedTrade, query, strict10Km, custGps.lat, custGps.lng]);

    const top5List = (app.latestTop5Matches && app.latestTop5Matches.length > 0)
      ? app.latestTop5Matches
      : filteredWorkers.slice(0, 5).map((w, idx) => ({
          worker: w,
          distanceKm: w._distanceKm,
          matchScore: Math.max(82, 98 - idx * 3),
        }));

    const submitDirectHire = (e) => {
      e.preventDefault();
      if (!cust) {
        KZ.openLoginPrompt?.({ title: "Login to post a job", returnPath: "/customer" });
        return;
      }
      if (!hireWorker) return;
      const baseRate = Number(hireWorker.dailyRate) || getLiveTradeRate(hireWorker.primaryTrade, workers);
      const created = app.postJob?.({
        title: hireTitle.trim() || `Direct hire: ${hireWorker.name} (${hireWorker.primaryTrade})`,
        trade: hireWorker.primaryTrade,
        description: `Direct hiring request for ${hireWorker.name} in ${hireWorker.location?.area || "Ludhiana"}.`,
        customerName: cust?.name || "Customer",
        customerPhone: cust?.phone || "+91 98101 00000",
        locationAddress: cust?.address || (cust?.area || "Model Town") + ", Ludhiana",
        area: cust?.area || "Model Town",
        dailyWage: baseRate,
        durationDays: Number(hireDays) || 1,
        startDate: new Date().toISOString().slice(0, 10),
        baseLabor: baseRate * (Number(hireDays) || 1),
      });
      if (created) {
        app.showNotification?.(`Work order #${created.id} posted for ${hireWorker.name}!`);
        setHireWorker(null);
        navigate("/customer/my-bookings", { role: "customer" });
      }
    };

    const cardBg = isDark ? "#1F1C17" : "#FFFFFF";
    const borderCol = isDark ? "#2E2A22" : "#EFE7DA";

    return h(
      "main",
      { style: { maxWidth: "1320px", margin: "0 auto", padding: "28px 24px 80px", display: "flex", flexDirection: "column", gap: "28px" } },
      // HERO
      h(
        "section",
        {
          style: {
            position: "relative",
            overflow: "hidden",
            borderRadius: "36px",
            background: "linear-gradient(180deg, #C7DCEC 0%, #F6E2CF 55%, #F7C79C 100%)",
            color: "#1C1913",
            padding: "44px",
            display: "flex",
            flexWrap: "wrap",
            gap: "36px",
          },
        },
        h(
          "svg",
          { "aria-hidden": "true", viewBox: "0 0 1300 220", preserveAspectRatio: "none", style: { position: "absolute", left: 0, bottom: 0, width: "100%", height: "160px" } },
          h("path", { d: "M0 90 C 200 40, 400 110, 650 70 C 900 30, 1100 100, 1300 60 L1300 220 L0 220 Z", fill: "#A9BE72", opacity: 0.7 }),
          h("path", { d: "M0 150 C 300 110, 600 170, 900 140 C 1100 120, 1200 150, 1300 140 L1300 220 L0 220 Z", fill: "#F3D24E", opacity: 0.8 })
        ),
        h(
          "div",
          { style: { position: "relative", flex: "1 1 560px", minWidth: 0, display: "flex", flexDirection: "column", gap: "18px" } },
          h(
            "span",
            { style: { alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "8px", padding: "8px 14px", borderRadius: "999px", background: "rgba(255,255,255,0.7)", fontSize: "13px", fontWeight: 700 } },
            h("span", { style: { width: "8px", height: "8px", borderRadius: "50%", background: "#2E9E57" } }),
            `Verified local workforce · 10 km GPS live · ${app.currentCity?.name || "Ludhiana"}`
          ),
          h(
            "h1",
            { style: { margin: 0, fontSize: "clamp(38px, 4.6vw, 62px)", lineHeight: 0.98, letterSpacing: "-2px", fontWeight: 800 } },
            "Find trusted, ",
            h("span", { style: { fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400 } }, "verified"),
            " workers."
          ),
          h(
            "p",
            { style: { margin: 0, fontSize: "17px", lineHeight: 1.5, color: "#3D3830", maxWidth: "560px" } },
            "Aadhaar and face-ID verified electricians, plumbers, carpenters, painters and masons nearby. 20% flat platform fee, 100% UPI escrow."
          ),
          h(
            "form",
            {
              onSubmit: (e) => e.preventDefault(),
              style: { display: "flex", flexWrap: "wrap", gap: "6px", padding: "6px", borderRadius: "999px", background: "rgba(255,255,255,0.9)", boxShadow: "0 16px 40px rgba(110,70,20,0.14)", maxWidth: "620px" },
            },
            h("label", { htmlFor: "kz-cust-q", style: { position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)" } }, "Search trade, skill or worker"),
            h(
              "span",
              { style: { flex: "1 1 240px", display: "flex", alignItems: "center", gap: "10px", padding: "0 16px", minHeight: "52px" } },
              h(SvgIcon, { path: ICON_PATHS.search, size: 18, color: "#6F685D" }),
              h("input", {
                id: "kz-cust-q",
                type: "text",
                value: query,
                onChange: (e) => setQuery(e.target.value),
                placeholder: "Search trade, skill or worker",
                style: { flex: 1, minWidth: 0, border: 0, outline: "none", background: "transparent", fontSize: "15px", color: "#1C1913" },
              })
            ),
            h(
              "button",
              {
                type: "button",
                onClick: () => navigate("/customer/post-a-job", { role: "customer" }),
                style: { minHeight: "52px", padding: "0 22px", border: 0, borderRadius: "999px", background: "#1C1913", color: "#FBF8F2", fontWeight: 800, fontSize: "14px" },
              },
              "Post Custom Job"
            )
          )
        ),
        // Right Quick Radar Summary Card
        h(
          "div",
          {
            style: {
              position: "relative",
              flex: "0 1 320px",
              borderRadius: "28px",
              background: "rgba(255,255,255,0.84)",
              backdropFilter: "blur(12px)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              gap: "12px",
            },
          },
          h("span", { style: { fontSize: "11px", fontWeight: 800, letterSpacing: "0.8px", color: "#7A4E00" } }, "LIVE DISPATCH SUMMARY"),
          h("span", { style: { fontSize: "42px", fontWeight: 800, lineHeight: 1 } }, filteredWorkers.length + " pros"),
          h("span", { style: { fontSize: "14px", color: "#3D3830" } }, "Aadhaar-verified workers active inside your strict 10 km radar."),
          h(
            "label",
            { style: { display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 700, cursor: "pointer" } },
            h("input", { type: "checkbox", checked: strict10Km, onChange: (e) => setStrict10Km(e.target.checked), style: { accentColor: "#E8930C" } }),
            "Strict 10 km GPS filter"
          ),
          h(
            "button",
            {
              type: "button",
              onClick: () => navigate("/customer/map-and-radar", { role: "customer" }),
              style: { height: "44px", borderRadius: "999px", border: 0, background: "#1C1913", color: "#FBF8F2", fontWeight: 800, fontSize: "13px" },
            },
            "Open 10 km Radar →"
          )
        )
      ),

      // AUTO "PAY NOW" BANNER FOR COMPLETED JOBS (RAZORPAY CHECKOUT)
      pendingPayJobs.length > 0 &&
        h(
          "section",
          {
            style: {
              borderRadius: "28px",
              background: isDark ? "#27231C" : "#FFF7E3",
              border: "2px solid #F5A524",
              padding: "22px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            },
          },
          h(
            "div",
            { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" } },
            h(
              "div",
              null,
              h("span", { style: { fontSize: "11px", fontWeight: 800, letterSpacing: "1px", color: "#9B4D00" } }, "ACTION REQUIRED · WORK COMPLETED"),
              h("h2", { style: { margin: "4px 0 0", fontSize: "22px", fontWeight: 800, color: isDark ? "#FBF8F2" : "#1C1913" } }, `${pendingPayJobs.length} job${pendingPayJobs.length > 1 ? "s" : ""} ready for Razorpay UPI payment`)
            ),
            h(
              "button",
              {
                type: "button",
                onClick: () => navigate("/customer/my-bookings", { role: "customer" }),
                style: { height: "38px", padding: "0 14px", borderRadius: "999px", border: "1px solid " + borderCol, background: cardBg, color: isDark ? "#EDE6DA" : "#1C1913", fontWeight: 700, fontSize: "12px" },
              },
              "View all bookings →"
            )
          ),
          pendingPayJobs.map((j) => {
            const fullAmt = Math.max(1, Math.round(Number(j.dailyWage || 850) * Number(j.durationDays || 1)));
            return h(
              "div",
              {
                key: j.id,
                style: {
                  borderRadius: "20px",
                  background: cardBg,
                  border: "1px solid " + borderCol,
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                },
              },
              h(
                "div",
                { style: { display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px" } },
                h(
                  "div",
                  { style: { display: "flex", flexDirection: "column", gap: "4px" } },
                  h("b", { style: { fontSize: "17px" } }, j.title),
                  h(
                    "span",
                    { style: { fontSize: "13px", color: isDark ? "#CFC6B8" : "#4A443A" } },
                    `Worker: ${j.assignedWorkerName || "Assigned Worker"}${j.assignedWorkerUpi ? " · UPI: " + j.assignedWorkerUpi : ""}`
                  )
                ),
                h(
                  "button",
                  {
                    type: "button",
                    onClick: () => launchRazorpayCheckout(j, app),
                    style: {
                      height: "46px",
                      padding: "0 22px",
                      borderRadius: "999px",
                      border: 0,
                      background: "#F5A524",
                      color: "#1C1913",
                      fontWeight: 800,
                      fontSize: "14px",
                      cursor: "pointer",
                      boxShadow: "0 6px 18px rgba(245,165,36,0.35)",
                    },
                  },
                  `Pay Now · ${formatInr(fullAmt)}`
                )
              ),
              h(JobProgressPipeline, { job: j, isDark })
            );
          })
        ),

      // LIVE JOB STATUS STRIP ON DASHBOARD
      trackableJobs.length > 0 &&
        pendingPayJobs.length === 0 &&
        h(
          "section",
          {
            style: {
              borderRadius: "28px",
              background: cardBg,
              border: "1px solid " + borderCol,
              padding: "20px 22px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            },
          },
          h(
            "div",
            { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" } },
            h("h3", { style: { margin: 0, fontSize: "18px", fontWeight: 800 } }, "Recent Work Order Status"),
            h(
              "button",
              {
                type: "button",
                onClick: () => navigate("/customer/my-bookings", { role: "customer" }),
                style: { border: 0, background: "transparent", color: "#9B4D00", fontWeight: 800, fontSize: "13px", cursor: "pointer" },
              },
              "Open My Bookings →"
            )
          ),
          trackableJobs.map((j) =>
            h(
              "div",
              {
                key: j.id,
                role: "button",
                tabIndex: 0,
                onClick: () => {
                  KZ.selectedTrackingJobId = j.id;
                  app.setActiveWorkJobId?.(j.id);
                  navigate("/customer/live-eta-attendance", { role: "customer" });
                },
                style: {
                  padding: "12px 14px",
                  borderRadius: "16px",
                  background: isDark ? "#27231C" : "#FBF8F2",
                  border: "1px solid " + borderCol,
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  cursor: "pointer",
                },
              },
              h(
                "div",
                { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" } },
                h("b", { style: { fontSize: "14px" } }, `${j.title} · ${j.assignedWorkerName || j.trade}`),
                h(
                  "div",
                  { style: { display: "flex", alignItems: "center", gap: "8px" } },
                  h(
                    "span",
                    {
                      style: {
                        padding: "4px 10px",
                        borderRadius: "999px",
                        background: j.status === "paid_and_closed" ? "#E3F4E8" : "#FFF0BF",
                        color: j.status === "paid_and_closed" ? "#1D6B36" : "#6B4600",
                        fontSize: "11px",
                        fontWeight: 800,
                      },
                    },
                    String(j.status || "").toUpperCase().replace(/_/g, " ")
                  ),
                  h("span", { style: { fontSize: "12px", fontWeight: 800, color: "#9B4D00" } }, "Track Live →")
                )
              ),
              h(JobProgressPipeline, { job: j, isDark })
            )
          )
        ),

      // TRADE FILTER PILLS
      h(
        "div",
        { style: { display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" } },
        [{ id: "All", name: "All trades" }].concat(TRADES).map((tr) => {
          const active = selectedTrade === tr.id || (selectedTrade !== "All" && normalizeTrade(selectedTrade) === normalizeTrade(tr.id));
          return h(
            "button",
            {
              key: tr.id,
              type: "button",
              onClick: () => setSelectedTrade(tr.id),
              style: {
                height: "40px",
                padding: "0 16px",
                borderRadius: "999px",
                border: "1px solid " + (active ? "#1C1913" : borderCol),
                background: active ? "#1C1913" : cardBg,
                color: active ? "#FBF8F2" : isDark ? "#EDE6DA" : "#3D3830",
                fontWeight: 700,
                fontSize: "13px",
              },
            },
            tr.name
          );
        })
      ),

      // TOP 5 NEARBY / VERIFIED WORKERS GRID
      app.latestMatchedJob &&
        top5List.length > 0 &&
        h(
          "section",
          {
            style: {
              borderRadius: "28px",
              background: isDark ? "#1F1C17" : "#FFF7E3",
              border: "1px solid " + (isDark ? "#3A342C" : "#F1DEB4"),
              padding: "20px 24px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "14px",
            },
          },
          h(
            "div",
            null,
            h("span", { style: { fontSize: "11px", fontWeight: 800, letterSpacing: "0.8px", color: "#7A4E00" } }, "TOP 5 AI MATCHES FOR YOUR JOB"),
            h("div", { style: { fontSize: "18px", fontWeight: 800 } }, app.latestMatchedJob.title + ` (${app.latestMatchedJob.trade})`)
          ),
          h(
            "button",
            {
              type: "button",
              onClick: () => app.openTop5Shortlist?.(app.latestMatchedJob),
              style: { height: "42px", padding: "0 18px", borderRadius: "999px", border: 0, background: "#1C1913", color: "#FBF8F2", fontWeight: 800, fontSize: "13px" },
            },
            "View Top 5 Match Modal"
          )
        ),

      h(
        "div",
        { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))", gap: "18px" } },
        filteredWorkers.length === 0
          ? h(
              "div",
              { style: { gridColumn: "1 / -1", borderRadius: "28px", background: cardBg, border: "1px solid " + borderCol, padding: "40px", textAlign: "center" } },
              h("h3", { style: { margin: "0 0 8px", fontSize: "20px", fontWeight: 800 } }, "No verified workers match this filter right now"),
              h("p", { style: { margin: "0 0 18px", color: isDark ? "#A49B8C" : "#6F685D" } }, "Broadcast your requirement to alert all nearby verified pros within 10 km."),
              h(
                "button",
                {
                  type: "button",
                  onClick: () => navigate("/customer/post-a-job", { role: "customer" }),
                  style: { height: "48px", padding: "0 22px", borderRadius: "999px", border: 0, background: "#F5A524", color: "#1C1913", fontWeight: 800 },
                },
                "+ Post Job Requirement"
              )
            )
          : filteredWorkers.map((w) => {
              const tm = getTradeMeta(w.primaryTrade);
              const rate = Number(w.dailyRate) || tm.rate;
              return h(
                "article",
                {
                  key: w.id,
                  className: isDark ? "kz-card-surface" : "",
                  style: {
                    borderRadius: "28px",
                    background: cardBg,
                    border: "1px solid " + borderCol,
                    padding: "22px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                    boxShadow: "0 14px 34px rgba(90,60,20,0.06)",
                  },
                },
                h(
                  "div",
                  { style: { display: "flex", alignItems: "center", gap: "12px" } },
                  w.photoUrl || w.avatar
                    ? h("img", { src: w.photoUrl || w.avatar, alt: w.name, style: { width: "54px", height: "54px", borderRadius: "18px", objectFit: "cover" } })
                    : h(
                        "span",
                        { style: { width: "54px", height: "54px", borderRadius: "18px", background: tm.bg, color: tm.fg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "20px" } },
                        (w.name || "W").slice(0, 1).toUpperCase()
                      ),
                  h(
                    "div",
                    { style: { flex: 1, minWidth: 0 } },
                    h("div", { style: { fontSize: "17px", fontWeight: 800, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, w.name),
                    h(
                      "div",
                      { style: { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", fontWeight: 700, color: isDark ? "#A49B8C" : "#6F685D" } },
                      h("span", { style: { padding: "2px 8px", borderRadius: "999px", background: tm.bg, color: tm.fg } }, tm.name),
                      h("span", null, `${w._distanceKm} km`)
                    )
                  ),
                  h(
                    "span",
                    { style: { padding: "4px 10px", borderRadius: "999px", background: "#E3F4E8", color: "#1D6B36", fontSize: "11px", fontWeight: 800 } },
                    "★ " + Number(w.rating || 4.8).toFixed(1)
                  )
                ),
                h(
                  "div",
                  { style: { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", color: isDark ? "#CFC6B8" : "#4A443A" } },
                  h("span", null, (w.location?.area || "Ludhiana") + ` · ${w.experienceYears || 2} yrs exp`),
                  h("span", { style: { padding: "3px 8px", borderRadius: "999px", background: w.isOnline !== false ? "#E3F4E8" : "#EFE7DA", color: w.isOnline !== false ? "#1D6B36" : "#6F685D", fontSize: "11px", fontWeight: 800 } }, w.isOnline !== false ? "Online" : "Offline")
                ),
                h(
                  "div",
                  { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", paddingTop: "6px", borderTop: "1px solid " + borderCol } },
                  h(
                    "span",
                    { style: { fontFamily: "'Instrument Serif', serif", fontSize: "30px", lineHeight: 1 } },
                    formatInr(rate),
                    h("span", { style: { fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "12px", color: isDark ? "#A49B8C" : "#6F685D", fontWeight: 700 } }, " /day")
                  ),
                  h(
                    "div",
                    { style: { display: "flex", gap: "8px" } },
                    h(
                      "button",
                      {
                        type: "button",
                        onClick: () => app.openGlobalChat?.(null, { name: w.name, phone: w.phone, role: "worker" }, "customer"),
                        style: { height: "40px", padding: "0 14px", borderRadius: "999px", border: "1px solid " + borderCol, background: "transparent", color: isDark ? "#EDE6DA" : "#1C1913", fontWeight: 700, fontSize: "13px" },
                      },
                      "Chat"
                    ),
                    h(
                      "button",
                      {
                        type: "button",
                        onClick: () => {
                          setHireWorker(w);
                          setHireTitle(`${tm.name} work for my home`);
                          setHireDays(1);
                        },
                        style: { height: "40px", padding: "0 18px", borderRadius: "999px", border: 0, background: "#1C1913", color: "#FBF8F2", fontWeight: 800, fontSize: "13px" },
                      },
                      "Hire"
                    )
                  )
                )
              );
            })
      ),

      // Direct Hire Modal
      hireWorker &&
        h(
          "div",
          {
            style: { position: "fixed", inset: 0, background: "rgba(28,25,19,0.58)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", zIndex: 110 },
            onClick: (e) => {
              if (e.target === e.currentTarget) setHireWorker(null);
            },
          },
          h(
            "form",
            {
              onSubmit: submitDirectHire,
              style: { width: "100%", maxWidth: "460px", borderRadius: "28px", background: cardBg, border: "1px solid " + borderCol, padding: "24px", display: "flex", flexDirection: "column", gap: "14px" },
            },
            h("span", { style: { fontSize: "11px", fontWeight: 800, letterSpacing: "0.8px", color: "#7A4E00" } }, "DIRECT BOOKING WITH ESCROW"),
            h("h3", { style: { margin: 0, fontSize: "24px", fontWeight: 800 } }, "Book " + hireWorker.name),
            h("input", {
              type: "text",
              required: true,
              value: hireTitle,
              onChange: (e) => setHireTitle(e.target.value),
              placeholder: "Job description",
              style: { height: "48px", borderRadius: "14px", border: "1px solid " + borderCol, padding: "0 14px", fontSize: "15px", background: isDark ? "#14120E" : "#FBF8F2", color: isDark ? "#EDE6DA" : "#1C1913" },
            }),
            h(
              "div",
              { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: "16px", background: isDark ? "#27231C" : "#FFF7E3" } },
              h("span", { style: { fontWeight: 700, fontSize: "14px" } }, "Days needed"),
              h("input", {
                type: "number",
                min: 1,
                max: 30,
                value: hireDays,
                onChange: (e) => setHireDays(Math.max(1, Number(e.target.value) || 1)),
                style: { width: "80px", height: "38px", textAlign: "center", borderRadius: "10px", border: "1px solid #E5DCCB", fontWeight: 800 },
              })
            ),
            h(
              "div",
              { style: { display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "6px" } },
              h("button", { type: "button", onClick: () => setHireWorker(null), style: { height: "44px", padding: "0 18px", borderRadius: "999px", border: "1px solid " + borderCol, background: "transparent", color: isDark ? "#EDE6DA" : "#1C1913", fontWeight: 700 } }, "Cancel"),
              h("button", { type: "submit", style: { height: "44px", padding: "0 22px", borderRadius: "999px", border: 0, background: "#F5A524", color: "#1C1913", fontWeight: 800 } }, "Confirm & Broadcast")
            )
          )
        )
    );
  }

  // -------------------------------------------------------------------------
  // 2. /customer/my-bookings
  // -------------------------------------------------------------------------
  function CustomerBookingsView() {
    const app = useApp();
    const isDark = app.isDarkMode;
    const cust = app.currentCustomer;
    const jobs = app.jobs || [];

    const myJobs = useMemo(() => {
      if (!cust?.phone && !cust?.name) return jobs;
      const cleanCPhone = String(cust.phone || "").replace(/[^0-9]/g, "").slice(-10);
      const filtered = jobs.filter((j) => {
        const jPhone = String(j.customerPhone || "").replace(/[^0-9]/g, "").slice(-10);
        return (cleanCPhone && jPhone === cleanCPhone) || (cust.name && j.customerName === cust.name);
      });
      return filtered.length > 0 ? filtered : jobs;
    }, [jobs, cust?.phone, cust?.name]);

    const activeCount = myJobs.filter((j) => ["accepted", "approved", "in_progress", "completed_pending_payment"].includes(j.status)).length;
    const broadcastCount = myJobs.filter((j) => j.status === "broadcast").length;
    const doneCount = myJobs.filter((j) => j.status === "paid_and_closed").length;

    const cardBg = isDark ? "#1F1C17" : "#FFFFFF";
    const borderCol = isDark ? "#2E2A22" : "#EFE7DA";

    return h(
      "main",
      { style: { maxWidth: "1320px", margin: "0 auto", padding: "32px 24px 80px", display: "flex", flexDirection: "column", gap: "28px" } },
      h(
        "div",
        { style: { display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "16px" } },
        h(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "8px" } },
          h(
            "h1",
            { style: { margin: 0, fontSize: "clamp(34px, 4vw, 54px)", lineHeight: 1, letterSpacing: "-1.6px", fontWeight: 800 } },
            "My bookings & ",
            h("span", { style: { fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400 } }, "work orders")
          ),
          h("p", { style: { margin: 0, fontSize: "16px", color: isDark ? "#CFC6B8" : "#4A443A" } }, "Track assigned workers, verify start OTPs, follow 10 km GPS routes and release UPI payments.")
        ),
        h(
          "button",
          {
            type: "button",
            onClick: () => navigate("/customer/post-a-job", { role: "customer" }),
            style: { height: "52px", padding: "0 24px", border: 0, borderRadius: "999px", background: "#F5A524", color: "#1C1913", fontWeight: 800, display: "flex", alignItems: "center", gap: "8px" },
          },
          h(SvgIcon, { path: ICON_PATHS.plus, size: 16, strokeWidth: 2.6 }),
          "Post new job"
        )
      ),

      // Stats
      h(
        "div",
        { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" } },
        h(
          "div",
          { style: { borderRadius: "28px", background: "#1C1913", color: "#FBF8F2", padding: "22px", display: "flex", flexDirection: "column", gap: "6px" } },
          h("span", { style: { fontSize: "12px", fontWeight: 800, letterSpacing: "0.6px", color: "#F3C969" } }, "ACTIVE"),
          h("span", { style: { fontSize: "48px", fontWeight: 800, lineHeight: 1 } }, activeCount),
          h("span", { style: { fontSize: "13px", color: "#CFC6B8" } }, "Jobs in progress")
        ),
        h(
          "div",
          { style: { borderRadius: "28px", background: "#FFF0BF", color: "#1C1913", padding: "22px", display: "flex", flexDirection: "column", gap: "6px" } },
          h("span", { style: { fontSize: "12px", fontWeight: 800, letterSpacing: "0.6px", color: "#6B4600" } }, "BROADCASTING"),
          h("span", { style: { fontSize: "48px", fontWeight: 800, lineHeight: 1 } }, broadcastCount),
          h("span", { style: { fontSize: "13px", color: "#4A443A" } }, "Jobs waiting for workers")
        ),
        h(
          "div",
          { style: { borderRadius: "28px", background: "#E3F4E8", color: "#1C1913", padding: "22px", display: "flex", flexDirection: "column", gap: "6px" } },
          h("span", { style: { fontSize: "12px", fontWeight: 800, letterSpacing: "0.6px", color: "#1D6B36" } }, "COMPLETED"),
          h("span", { style: { fontSize: "48px", fontWeight: 800, lineHeight: 1 } }, doneCount),
          h("span", { style: { fontSize: "13px", color: "#2D4A36" } }, "Paid & closed work orders")
        )
      ),

      // Booking cards
      h(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "16px" } },
        myJobs.length === 0
          ? h(
              "div",
              { style: { borderRadius: "28px", background: cardBg, border: "1px solid " + borderCol, padding: "40px", textAlign: "center" } },
              h("h3", { style: { margin: "0 0 8px", fontSize: "20px", fontWeight: 800 } }, "No bookings yet"),
              h("p", { style: { margin: "0 0 18px", color: isDark ? "#A49B8C" : "#6F685D" } }, "Post your first job to broadcast within 10 km."),
              h(
                "button",
                {
                  type: "button",
                  onClick: () => navigate("/customer/post-a-job", { role: "customer" }),
                  style: { height: "48px", padding: "0 22px", borderRadius: "999px", border: 0, background: "#1C1913", color: "#FBF8F2", fontWeight: 800 },
                },
                "+ Post a job"
              )
            )
          : myJobs.map((j) => {
              const tm = getTradeMeta(j.trade);
              const pendingProposals = (j.negotiationHistory || []).filter((p) => p.status === "pending" && p.senderRole === "worker");
              return h(
                "article",
                {
                  key: j.id,
                  onClick: (e) => {
                    if (e.target && e.target.closest && e.target.closest("button, a, input")) return;
                    KZ.selectedTrackingJobId = j.id;
                    app.setActiveWorkJobId?.(j.id);
                    navigate("/customer/live-eta-attendance", { role: "customer" });
                  },
                  style: {
                    borderRadius: "28px",
                    background: cardBg,
                    border: "1px solid " + borderCol,
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                    cursor: "pointer",
                  },
                },
                h(
                  "div",
                  { style: { display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" } },
                  h(
                    "div",
                    { style: { display: "flex", flexDirection: "column", gap: "6px" } },
                    h(
                      "div",
                      { style: { display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" } },
                      h("span", { style: { padding: "4px 10px", borderRadius: "999px", background: tm.bg, color: tm.fg, fontSize: "12px", fontWeight: 800 } }, tm.name),
                      h("span", { style: { padding: "4px 10px", borderRadius: "999px", background: j.status === "paid_and_closed" ? "#E3F4E8" : j.status === "completed_pending_payment" ? "#FFE7B8" : "#FFF0BF", color: j.status === "paid_and_closed" ? "#1D6B36" : "#6B4600", fontSize: "11px", fontWeight: 800 } }, String(j.status || "broadcast").toUpperCase().replace(/_/g, " ")),
                      j.isEscrowPrepaid && h("span", { style: { padding: "4px 10px", borderRadius: "999px", background: "#E3F4E8", color: "#1D6B36", fontSize: "11px", fontWeight: 800 } }, "ESCROW FUNDED"),
                      j.razorpayPaymentId && h("span", { style: { padding: "4px 10px", borderRadius: "999px", background: "#DCEBFF", color: "#123A6B", fontSize: "11px", fontWeight: 800 } }, "RZP: " + j.razorpayPaymentId)
                    ),
                    h("h2", { style: { margin: 0, fontSize: "22px", fontWeight: 800 } }, j.title),
                    h("span", { style: { fontSize: "13px", color: isDark ? "#A49B8C" : "#6F685D" } }, `${j.locationAddress || j.area} · ${j.durationDays || 1} day(s)`),
                    j.assignedWorkerName && h("span", { style: { fontSize: "14px", fontWeight: 700, color: "#1D6B36" } }, `Assigned worker: ${j.assignedWorkerName} (${j.assignedWorkerPhone || ""})${j.assignedWorkerUpi ? " · UPI: " + j.assignedWorkerUpi : ""}`)
                  ),
                  h(
                    "div",
                    { style: { textAlign: "right" } },
                    h("div", { style: { fontFamily: "'Instrument Serif', serif", fontSize: "34px", lineHeight: 1 } }, formatInr((j.dailyWage || 850) * (j.durationDays || 1))),
                    j.otpCode &&
                      h(
                        "div",
                        { style: { marginTop: "6px", padding: "6px 12px", borderRadius: "12px", background: "#1C1913", color: "#F5A524", fontWeight: 800, fontSize: "13px", letterSpacing: "2px" } },
                        "START OTP: " + j.otpCode
                      )
                  )
                ),

                // 5-Step Live Status Pipeline
                h(JobProgressPipeline, { job: j, isDark }),

                // Pending worker wage counter-offers
                pendingProposals.length > 0 &&
                  h(
                    "div",
                    { style: { borderRadius: "18px", background: "#FFF7E3", padding: "14px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "10px", color: "#1C1913" } },
                    h(
                      "div",
                      null,
                      h("b", null, `${pendingProposals[pendingProposals.length - 1].senderName} proposed ${formatInr(pendingProposals[pendingProposals.length - 1].proposedWage)}/day`),
                      pendingProposals[pendingProposals.length - 1].note && h("div", { style: { fontSize: "12px", color: "#6B4600" } }, pendingProposals[pendingProposals.length - 1].note)
                    ),
                    h(
                      "button",
                      {
                        type: "button",
                        onClick: () => app.acceptJobProposal?.(j.id, pendingProposals[pendingProposals.length - 1]),
                        style: { height: "38px", padding: "0 16px", borderRadius: "999px", border: 0, background: "#2E9E57", color: "#FFFFFF", fontWeight: 800, fontSize: "13px" },
                      },
                      "Accept proposal"
                    )
                  ),

                // Actions bar
                h(
                  "div",
                  { style: { display: "flex", flexWrap: "wrap", gap: "10px" } },
                  j.status === "accepted" &&
                    !j.isEscrowPrepaid &&
                    h(
                      "button",
                      {
                        type: "button",
                        onClick: () => app.approveAndFundEscrow?.(j.id),
                        style: { height: "42px", padding: "0 18px", borderRadius: "999px", border: 0, background: "#F5A524", color: "#1C1913", fontWeight: 800, fontSize: "13px" },
                      },
                      "Approve & Fund Escrow"
                    ),
                  !j.isEscrowPrepaid &&
                    j.status !== "paid_and_closed" &&
                    j.status !== "cancelled" &&
                    h(
                      "button",
                      {
                        type: "button",
                        onClick: () => app.payPrepaidEscrow?.(j.id),
                        style: { height: "42px", padding: "0 18px", borderRadius: "999px", border: "1px solid " + borderCol, background: "transparent", color: isDark ? "#EDE6DA" : "#1C1913", fontWeight: 700, fontSize: "13px" },
                      },
                      "Prepay Escrow"
                    ),
                  h(
                    "button",
                    {
                      type: "button",
                      onClick: () => {
                        KZ.selectedTrackingJobId = j.id;
                        app.setActiveWorkJobId?.(j.id);
                        navigate("/customer/live-eta-attendance", { role: "customer" });
                      },
                      style: { height: "42px", padding: "0 18px", borderRadius: "999px", border: 0, background: "#1C1913", color: "#FBF8F2", fontWeight: 800, fontSize: "13px", cursor: "pointer" },
                    },
                    j.status === "broadcast" || j.status === "open"
                      ? "Track Broadcast Status →"
                      : j.status === "in_progress"
                      ? "Watch Live Work →"
                      : j.status === "paid_and_closed"
                      ? "View Receipt & Steps"
                      : "Live Map & Start Code →"
                  ),
                  j.status === "completed_pending_payment" &&
                    h(
                      "button",
                      {
                        type: "button",
                        onClick: () => launchRazorpayCheckout(j, app),
                        style: {
                          height: "42px",
                          padding: "0 20px",
                          borderRadius: "999px",
                          border: 0,
                          background: "#F5A524",
                          color: "#1C1913",
                          fontWeight: 800,
                          fontSize: "13px",
                          cursor: "pointer",
                          boxShadow: "0 4px 14px rgba(245,165,36,0.35)",
                        },
                      },
                      `Pay Now · ${formatInr((j.dailyWage || 850) * (j.durationDays || 1))}`
                    ),
                  j.status === "in_progress" &&
                    h(
                      "button",
                      {
                        type: "button",
                        onClick: () => launchRazorpayCheckout(j, app),
                        style: { height: "42px", padding: "0 18px", borderRadius: "999px", border: 0, background: "#2E9E57", color: "#FFFFFF", fontWeight: 800, fontSize: "13px", cursor: "pointer" },
                      },
                      "Pay with Razorpay UPI"
                    ),
                  j.status === "broadcast" &&
                    h(
                      "button",
                      {
                        type: "button",
                        onClick: () => app.openTop5Shortlist?.(j),
                        style: { height: "42px", padding: "0 18px", borderRadius: "999px", border: "1px solid " + borderCol, background: "transparent", color: isDark ? "#EDE6DA" : "#1C1913", fontWeight: 700, fontSize: "13px" },
                      },
                      "Top 5 Matches"
                    ),
                  j.assignedWorkerName &&
                    h(
                      "button",
                      {
                        type: "button",
                        onClick: () => app.openGlobalChat?.(j, { name: j.assignedWorkerName, phone: j.assignedWorkerPhone, role: "worker" }, "customer"),
                        style: { height: "42px", padding: "0 16px", borderRadius: "999px", border: "1px solid " + borderCol, background: "transparent", color: isDark ? "#EDE6DA" : "#1C1913", fontWeight: 700, fontSize: "13px" },
                      },
                      "Chat worker"
                    ),
                  j.status !== "paid_and_closed" &&
                    j.status !== "cancelled" &&
                    h(
                      "button",
                      {
                        type: "button",
                        onClick: () => app.cancelJobOrder?.(j.id, "Cancelled by employer"),
                        style: { height: "42px", padding: "0 16px", borderRadius: "999px", border: 0, background: "#FFE1E1", color: "#8A1C1C", fontWeight: 700, fontSize: "13px" },
                      },
                      "Cancel"
                    )
                )
              );
            })
      )
    );
  }

  // -------------------------------------------------------------------------
  // 3. /customer/post-a-job — No End Date input, AI Estimator, Live 20% Fee
  // -------------------------------------------------------------------------
  function CustomerPostJobView() {
    const app = useApp();
    const isDark = app.isDarkMode;
    const cust = app.currentCustomer;
    const workers = app.workers || [];

    const prefill = KZ.prefillPostJob || null;
    const [trade, setTrade] = useState(() => prefill?.trade || "Plumber");
    const [title, setTitle] = useState(() => prefill?.title || "");
    const [desc, setDesc] = useState(() => prefill?.description || "");
    const [area, setArea] = useState(cust?.area || "Model Town");
    const [addr, setAddr] = useState(cust?.address || "Model Town, Ludhiana");
    const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
    const [shiftStart, setShiftStart] = useState("09:00");
    const [days, setDays] = useState(() => prefill?.durationDays || 1);
    const [baseRate, setBaseRate] = useState(() => prefill?.dailyWage || getLiveTradeRate("Plumber", workers));
    const [estimating, setEstimating] = useState(false);
    const [aiNote, setAiNote] = useState(() => prefill?.aiNote || "");
    const [aiEstimated, setAiEstimated] = useState(() => Boolean(prefill?.aiNote && prefill?.dailyWage));
    const [pageStep, setPageStep] = useState(1); // 1 = Trade & Job Details (+ AI Price), 2 = Schedule & Broadcast

    useEffect(() => {
      if (KZ.prefillPostJob) {
        const pf = KZ.prefillPostJob;
        if (pf.trade) setTrade(pf.trade);
        if (pf.title) setTitle(pf.title);
        if (pf.description) setDesc(pf.description);
        if (pf.dailyWage) setBaseRate(Number(pf.dailyWage));
        if (pf.durationDays) setDays(Number(pf.durationDays));
        if (pf.aiNote) {
          setAiNote(pf.aiNote);
          setAiEstimated(true);
        }
        KZ.prefillPostJob = null;
      }
    }, []);

    const hasWorkDescribed = Boolean(title.trim().length >= 3 || desc.trim().length >= 3);
    const baseLabor = Number(baseRate) * Number(days);
    const platformFee = Math.round(baseLabor * 0.2);
    const totalCustomer = baseLabor + platformFee;

    const runAiEstimate = async () => {
      if (!hasWorkDescribed) {
        app.showNotification?.("Please describe the work first before asking AI for the price.");
        return;
      }
      setEstimating(true);
      try {
        const promptText = (title + " " + desc).trim();
        const res = await fetch("/api/estimate-job", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            trade,
            prompt: promptText,
            description: promptText,
            city: app.currentCity?.name || "Ludhiana",
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (data.rejected) {
          setAiNote(data.reason || "Please describe a valid home/site job.");
          setAiEstimated(false);
        } else {
          if (data.trade && TRADES.some((t) => t.id === data.trade)) setTrade(data.trade);
          const nextWage = Number(data.suggestedWage || data.suggestedPrice || 0);
          if (nextWage >= 250) setBaseRate(nextWage);
          if (data.estimatedDays) setDays(Number(data.estimatedDays));
          setAiNote(
            data.reply ||
              data.summary ||
              data.explanation ||
              `Suggested Labour Price: ₹${nextWage} (${data.estimatedTime || "1 day"}).`
          );
          setAiEstimated(true);
        }
      } catch (_) {
        setAiNote("Estimated Ludhiana labour rate for " + trade + ": " + formatInr(baseRate) + "/day.");
        setAiEstimated(true);
      }
      setEstimating(false);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!hasWorkDescribed || !aiEstimated) {
        app.showNotification?.("Please describe the work and ask AI for the price first.");
        return;
      }
      if (pageStep !== 2) {
        setPageStep(2);
        return;
      }
      if (!cust) {
        KZ.openLoginPrompt?.({ title: "Login to post a job", returnPath: "/customer/post-a-job" });
        return;
      }
      if (!title.trim()) {
        app.showNotification?.("Please enter a short job title.");
        return;
      }
      const created = app.postJob?.({
        title: title.trim(),
        trade,
        description: desc.trim() || `Need Aadhaar-verified ${trade} in ${area}.`,
        customerName: cust?.name || "Employer",
        customerPhone: cust?.phone || "+91 98101 00000",
        locationAddress: addr.trim() || area + ", Ludhiana",
        area,
        dailyWage: baseRate,
        durationDays: days,
        startDate,
        shiftStartTime: shiftStart,
        baseLabor,
      });
      if (created) {
        navigate("/customer/my-bookings", { role: "customer" });
      }
    };

    const cardBg = isDark ? "#1F1C17" : "#FFFFFF";
    const borderCol = isDark ? "#2E2A22" : "#EFE7DA";

    return h(
      "main",
      { style: { maxWidth: "1080px", margin: "0 auto", padding: "32px 24px 80px", display: "flex", flexDirection: "column", gap: "24px" } },
      // Top Header with Cross (✕) Close Button to exit back to Home Page
      h(
        "div",
        { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" } },
        h(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "8px" } },
          h("span", { style: { fontSize: "13px", fontWeight: 800, letterSpacing: "1px", color: "#7A4E00" } }, `STEP ${pageStep} OF 2 · BROADCAST TO VERIFIED PROS WITHIN 10 KM`),
          h(
            "h1",
            { style: { margin: 0, fontSize: "clamp(32px, 4vw, 50px)", lineHeight: 1, letterSpacing: "-1.6px", fontWeight: 800 } },
            pageStep === 1 ? "Tell workers " : "Schedule & ",
            h(
              "span",
              { style: { fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400 } },
              pageStep === 1 ? "what you need." : "broadcast job."
            )
          ),
          h(
            "p",
            { style: { margin: 0, fontSize: "15px", color: isDark ? "#CFC6B8" : "#4A443A", maxWidth: "680px", lineHeight: 1.5 } },
            pageStep === 1
              ? "Page 1: Select the trade, describe your work, and ask AI for the fair labour price to unlock scheduling."
              : "Page 2: Pick your date, time, and Ludhiana address, review the labour price, and broadcast to nearby workers."
          )
        ),
        // Cross (✕) Button to abort posting and return to Find Workers / Home page
        h(
          "button",
          {
            type: "button",
            title: "Cancel and return to home page",
            "aria-label": "Close and return to home page",
            onClick: () => navigate("/customer", { role: "customer" }),
            style: {
              width: "46px",
              height: "46px",
              borderRadius: "50%",
              border: "1px solid " + borderCol,
              background: cardBg,
              color: isDark ? "#EDE6DA" : "#1C1913",
              fontSize: "20px",
              fontWeight: 800,
              cursor: "pointer",
              flexShrink: 0,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            },
          },
          "✕"
        )
      ),

      // 2-Page Progress Pill Bar
      h(
        "div",
        { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" } },
        h(
          "button",
          {
            type: "button",
            onClick: () => setPageStep(1),
            style: {
              height: "44px",
              borderRadius: "16px",
              border: pageStep === 1 ? "2px solid #F5A524" : "1px solid " + borderCol,
              background: pageStep === 1 ? "#1C1913" : cardBg,
              color: pageStep === 1 ? "#FBF8F2" : isDark ? "#CFC6B8" : "#4A443A",
              fontWeight: 800,
              fontSize: "13px",
              cursor: "pointer",
            },
          },
          "1 · Trade & Job Details (Ask AI Price)"
        ),
        h(
          "button",
          {
            type: "button",
            disabled: !hasWorkDescribed || !aiEstimated,
            onClick: () => {
              if (hasWorkDescribed && aiEstimated) setPageStep(2);
            },
            style: {
              height: "44px",
              borderRadius: "16px",
              border: pageStep === 2 ? "2px solid #F5A524" : "1px solid " + borderCol,
              background: pageStep === 2 ? "#1C1913" : cardBg,
              color: pageStep === 2 ? "#FBF8F2" : !hasWorkDescribed || !aiEstimated ? "#9E9587" : isDark ? "#CFC6B8" : "#4A443A",
              fontWeight: 800,
              fontSize: "13px",
              cursor: !hasWorkDescribed || !aiEstimated ? "not-allowed" : "pointer",
              opacity: !hasWorkDescribed || !aiEstimated ? 0.6 : 1,
            },
          },
          "2 · Schedule, Labour Price & Broadcast"
        )
      ),

      h(
        "form",
        { onSubmit: handleSubmit, style: { display: "flex", flexDirection: "column", gap: "22px" } },
        pageStep === 1
          ? // ==================== PAGE 1: TRADE & JOB DETAILS + AI PRICE GATE ====================
            h(
              "div",
              { style: { display: "flex", flexDirection: "column", gap: "20px" } },
              // 1. Trade
              h(
                "section",
                { style: { borderRadius: "30px", background: cardBg, border: "1px solid " + borderCol, padding: "24px", display: "flex", flexDirection: "column", gap: "14px" } },
                h("span", { style: { fontSize: "18px", fontWeight: 800 } }, "1 · Which trade?"),
                h(
                  "div",
                  { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: "10px" } },
                  TRADES.map((t) => {
                    const active = normalizeTrade(trade) === normalizeTrade(t.id);
                    return h(
                      "button",
                      {
                        key: t.id,
                        type: "button",
                        onClick: () => {
                          setTrade(t.id);
                          setBaseRate(getLiveTradeRate(t.id, workers));
                        },
                        style: {
                          borderRadius: "18px",
                          border: "2px solid " + (active ? "#1C1913" : borderCol),
                          background: t.bg,
                          color: "#1C1913",
                          padding: "12px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          gap: "2px",
                          textAlign: "left",
                          cursor: "pointer",
                        },
                      },
                      h("span", { style: { fontWeight: 800, fontSize: "14px" } }, t.name),
                      h("span", { style: { fontFamily: "'Noto Sans Devanagari', sans-serif", fontSize: "12px", color: t.fg } }, t.hi)
                    );
                  })
                )
              ),

              // 2. Job Details + Mandatory Ask AI for Price
              h(
                "section",
                { style: { borderRadius: "30px", background: cardBg, border: "1px solid " + borderCol, padding: "24px", display: "flex", flexDirection: "column", gap: "14px" } },
                h(
                  "div",
                  { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", flexWrap: "wrap" } },
                  h("span", { style: { fontSize: "18px", fontWeight: 800 } }, "2 · Job details"),
                  h(
                    "button",
                    {
                      type: "button",
                      disabled: estimating || !hasWorkDescribed,
                      onClick: runAiEstimate,
                      style: {
                        height: "42px",
                        padding: "0 18px",
                        borderRadius: "999px",
                        border: 0,
                        background: hasWorkDescribed ? "#F5A524" : "#E5DCCB",
                        color: "#1C1913",
                        fontWeight: 800,
                        fontSize: "13px",
                        cursor: hasWorkDescribed ? "pointer" : "not-allowed",
                      },
                    },
                    estimating ? "Asking AI for Price…" : "✨ Ask AI for Price"
                  )
                ),
                h("input", {
                  type: "text",
                  required: true,
                  value: title,
                  onChange: (e) => {
                    setTitle(e.target.value);
                    setAiEstimated(false);
                  },
                  placeholder: "Describe the work (e.g. Fix kitchen tap & overhead motor)",
                  style: { height: "54px", borderRadius: "16px", border: "1px solid " + borderCol, padding: "0 16px", fontSize: "15px", fontWeight: 600, background: isDark ? "#14120E" : "#FBF8F2", color: isDark ? "#EDE6DA" : "#1C1913" },
                }),
                h("textarea", {
                  rows: 3,
                  value: desc,
                  onChange: (e) => {
                    setDesc(e.target.value);
                    setAiEstimated(false);
                  },
                  placeholder: "Tools required, floor number, number of items or rooms…",
                  style: { borderRadius: "16px", border: "1px solid " + borderCol, padding: "14px 16px", fontSize: "14px", background: isDark ? "#14120E" : "#FBF8F2", color: isDark ? "#EDE6DA" : "#1C1913" },
                }),

                // Show AI Price Result OR Prompt to Ask AI first
                aiEstimated && hasWorkDescribed
                  ? h(
                      "div",
                      {
                        style: {
                          padding: "18px 20px",
                          borderRadius: "20px",
                          background: isDark ? "#1B2920" : "#E3F4E8",
                          border: "2px solid #2E9E57",
                          display: "flex",
                          flexWrap: "wrap",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "14px",
                        },
                      },
                      h(
                        "div",
                        { style: { display: "flex", flexDirection: "column", gap: "4px", maxWidth: "620px" } },
                        h("span", { style: { fontSize: "11px", fontWeight: 800, letterSpacing: "0.8px", color: "#1D6B36" } }, "✓ AI LABOUR PRICE ESTIMATED"),
                        h("div", { style: { fontSize: "14px", fontWeight: 700, color: isDark ? "#E3F4E8" : "#1C1913" } }, aiNote),
                        h("span", { style: { fontSize: "13px", fontWeight: 800, color: "#1D6B36" } }, `Estimated Labour Price: ${formatInr(baseRate)}/day · Est. Duration: ${days} day(s)`)
                      ),
                      h(
                        "button",
                        {
                          type: "button",
                          onClick: () => setPageStep(2),
                          style: {
                            height: "48px",
                            padding: "0 24px",
                            borderRadius: "999px",
                            border: 0,
                            background: "#1C1913",
                            color: "#F5A524",
                            fontWeight: 800,
                            fontSize: "14px",
                            cursor: "pointer",
                            boxShadow: "0 8px 22px rgba(28,25,19,0.22)",
                          },
                        },
                        "Schedule Next →"
                      )
                    )
                  : h(
                      "div",
                      {
                        style: {
                          padding: "14px 16px",
                          borderRadius: "16px",
                          background: isDark ? "#27231C" : "#FFF7E3",
                          border: "1px dashed #F5A524",
                          color: isDark ? "#F3C969" : "#7A4E00",
                          fontSize: "13px",
                          fontWeight: 700,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          flexWrap: "wrap",
                          gap: "10px",
                        },
                      },
                      h("span", null, "Step required: Write your job details above and tap 'Ask AI for Price' to unlock Schedule & Broadcast."),
                      hasWorkDescribed &&
                        h(
                          "button",
                          {
                            type: "button",
                            disabled: estimating,
                            onClick: runAiEstimate,
                            style: { height: "36px", padding: "0 16px", borderRadius: "999px", border: 0, background: "#1C1913", color: "#F5A524", fontWeight: 800, fontSize: "12px", cursor: "pointer" },
                          },
                          estimating ? "Calculating…" : "Ask AI for Price Now →"
                        )
                    )
              )
            )
          : // ==================== PAGE 2: SCHEDULE & SITE + LABOUR PRICE & BROADCAST ====================
            h(
              "div",
              { style: { display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "flex-start" } },
              h(
                "section",
                { style: { flex: "999 1 520px", borderRadius: "30px", background: cardBg, border: "1px solid " + borderCol, padding: "24px", display: "flex", flexDirection: "column", gap: "16px" } },
                h(
                  "div",
                  { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" } },
                  h("span", { style: { fontSize: "18px", fontWeight: 800 } }, "3 · Schedule & Ludhiana site"),
                  h(
                    "button",
                    {
                      type: "button",
                      onClick: () => setPageStep(1),
                      style: { height: "36px", padding: "0 14px", borderRadius: "999px", border: "1px solid " + borderCol, background: "transparent", color: isDark ? "#EDE6DA" : "#1C1913", fontWeight: 700, fontSize: "12px", cursor: "pointer" },
                    },
                    "← Edit Trade & Job Details"
                  )
                ),
                h(
                  "div",
                  { style: { padding: "12px 14px", borderRadius: "14px", background: isDark ? "#27231C" : "#FBF8F2", fontSize: "13px", fontWeight: 700 } },
                  `${trade} · "${title}" — ${aiNote || "AI price verified"}`
                ),
                h(
                  "div",
                  { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "12px" } },
                  h(
                    "label",
                    { style: { display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", fontWeight: 800 } },
                    "Start Date",
                    h("input", { type: "date", value: startDate, onChange: (e) => setStartDate(e.target.value), style: { height: "48px", borderRadius: "14px", border: "1px solid " + borderCol, padding: "0 12px", background: isDark ? "#14120E" : "#FBF8F2", color: isDark ? "#EDE6DA" : "#1C1913" } })
                  ),
                  h(
                    "label",
                    { style: { display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", fontWeight: 800 } },
                    "Shift Start Time",
                    h("input", { type: "time", value: shiftStart, onChange: (e) => setShiftStart(e.target.value), style: { height: "48px", borderRadius: "14px", border: "1px solid " + borderCol, padding: "0 12px", background: isDark ? "#14120E" : "#FBF8F2", color: isDark ? "#EDE6DA" : "#1C1913" } })
                  ),
                  h(
                    "label",
                    { style: { display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", fontWeight: 800 } },
                    "Duration (Days)",
                    h("input", { type: "number", min: 1, max: 30, value: days, onChange: (e) => setDays(Math.max(1, Number(e.target.value) || 1)), style: { height: "48px", borderRadius: "14px", border: "1px solid " + borderCol, padding: "0 12px", background: isDark ? "#14120E" : "#FBF8F2", color: isDark ? "#EDE6DA" : "#1C1913" } })
                  )
                ),
                h(
                  "div",
                  { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" } },
                  h(
                    "label",
                    { style: { display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", fontWeight: 800 } },
                    "Ludhiana Area",
                    h(
                      "select",
                      {
                        value: area,
                        onChange: (e) => setArea(e.target.value),
                        style: { height: "48px", borderRadius: "14px", border: "1px solid " + borderCol, padding: "0 12px", background: isDark ? "#14120E" : "#FBF8F2", color: isDark ? "#EDE6DA" : "#1C1913" },
                      },
                      LUDHIANA_AREAS.map((a) => h("option", { key: a.name, value: a.name }, a.name))
                    )
                  ),
                  h(
                    "label",
                    { style: { display: "flex", flexDirection: "column", gap: "6px", fontSize: "12px", fontWeight: 800 } },
                    "Full Site Address",
                    h("input", { type: "text", value: addr, onChange: (e) => setAddr(e.target.value), style: { height: "48px", borderRadius: "14px", border: "1px solid " + borderCol, padding: "0 12px", background: isDark ? "#14120E" : "#FBF8F2", color: isDark ? "#EDE6DA" : "#1C1913" } })
                  )
                )
              ),

              // Labour Price & Broadcast Card (ONLY shown on Page 2 after AI Price + Schedule!)
              h(
                "aside",
                { style: { flex: "1 1 320px", borderRadius: "30px", background: "#1C1913", color: "#FBF8F2", padding: "26px", display: "flex", flexDirection: "column", gap: "14px" } },
                h("span", { style: { fontSize: "11px", fontWeight: 800, letterSpacing: "0.8px", color: "#F3C969" } }, "AI VERIFIED LABOUR PRICE"),
                h(
                  "label",
                  { style: { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", fontWeight: 700 } },
                  "Daily Labour Rate (₹)",
                  h("input", {
                    type: "number",
                    min: 250,
                    max: 10000,
                    step: 50,
                    value: baseRate,
                    onChange: (e) => setBaseRate(Math.max(250, Number(e.target.value) || 400)),
                    style: { width: "105px", height: "38px", textAlign: "right", borderRadius: "10px", border: "1px solid #3A342C", background: "#2A241B", color: "#FBF8F2", padding: "0 10px", fontWeight: 800 },
                  })
                ),
                h(
                  "div",
                  { style: { borderTop: "1px solid #3A342C", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "baseline" } },
                  h("span", { style: { fontWeight: 700, fontSize: "15px" } }, `Labour Price (${days}d)`),
                  h("span", { style: { fontFamily: "'Instrument Serif', serif", fontSize: "44px", color: "#F5A524", lineHeight: 1 } }, formatInr(baseLabor))
                ),
                h("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#A49B8C" } }, h("span", null, "Platform fee (+20% escrow)"), h("span", null, formatInr(platformFee))),
                h(
                  "button",
                  {
                    type: "submit",
                    onClick: (e) => {
                      if (!cust) {
                        e.preventDefault();
                        KZ.openLoginPrompt?.({ title: "Login to post a job", returnPath: "/customer/post-a-job" });
                      }
                    },
                    style: { height: "54px", borderRadius: "999px", border: 0, background: "#F5A524", color: "#1C1913", fontWeight: 800, fontSize: "16px", cursor: "pointer", marginTop: "4px" },
                  },
                  `Broadcast Job Now · ${formatInr(baseLabor)} →`
                ),
                h("span", { style: { fontSize: "12px", color: "#CFC6B8", lineHeight: 1.5 } }, "Payment releases to worker UPI only after Start & End QR completion check.")
              )
            )
      )
    );
  }

  // -------------------------------------------------------------------------
  // 4. /customer/live-eta-attendance & /customer/work — 4-Step Live Job Condition Tracker
  // -------------------------------------------------------------------------
  function CustomerLiveEtaView() {
    const app = useApp();
    const isDark = app.isDarkMode;
    const cust = app.currentCustomer;
    const jobs = app.jobs || [];

    const myJobs = useMemo(() => {
      if (!cust?.phone && !cust?.name) return jobs;
      const cleanCPhone = String(cust.phone || "").replace(/[^0-9]/g, "").slice(-10);
      const filtered = jobs.filter((j) => {
        const jPhone = String(j.customerPhone || "").replace(/[^0-9]/g, "").slice(-10);
        return (cleanCPhone && jPhone === cleanCPhone) || (cust.name && j.customerName === cust.name);
      });
      return filtered.length > 0 ? filtered : jobs;
    }, [jobs, cust?.phone, cust?.name]);

    const [selectedId, setSelectedId] = useState(
      () => KZ.selectedTrackingJobId || app.activeWorkJobId || myJobs[0]?.id || null
    );

    useEffect(() => {
      if (KZ.selectedTrackingJobId && KZ.selectedTrackingJobId !== selectedId) {
        setSelectedId(KZ.selectedTrackingJobId);
      }
    }, [KZ.selectedTrackingJobId]);

    const activeJob =
      myJobs.find((j) => j.id === selectedId) ||
      myJobs.find((j) => j.id === app.activeWorkJobId) ||
      myJobs.find((j) => ["in_progress", "approved", "accepted", "completed_pending_payment", "broadcast"].includes(j.status)) ||
      myJobs[0];

    const [elapsedSec, setElapsedSec] = useState(0);
    useEffect(() => {
      setElapsedSec(0);
      if (activeJob?.status !== "in_progress") return;
      const t = setInterval(() => setElapsedSec((s) => s + 1), 1000);
      return () => clearInterval(t);
    }, [activeJob?.id, activeJob?.status]);

    const fmtClock = (s) => {
      const m = Math.floor(s / 60);
      const r = s % 60;
      return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0") + ":" + String(r).padStart(2, "0");
    };

    const cardBg = isDark ? "#1F1C17" : "#FFFFFF";
    const borderCol = isDark ? "#2E2A22" : "#EFE7DA";

    const st = String(activeJob?.status || "broadcast").toLowerCase();
    const isBroadcasting = st === "broadcast" || st === "open";
    const isComing = st === "accepted" || st === "approved";
    const isWorking = st === "in_progress";
    const isPayDue = st === "completed_pending_payment";
    const isPaid = st === "paid_and_closed";

    const currentStepIdx = isPaid || isPayDue ? 3 : isWorking ? 2 : isComing ? 1 : 0;

    const fourSteps = [
      { n: "1", title: "Job Broadcasted", sub: "10 km verified radar", bg: "#DCEAF5", fg: "#123A6B" },
      { n: "2", title: "Worker Coming", sub: "Live GPS map & Start OTP", bg: "#FCEBCB", fg: "#6B4600" },
      { n: "3", title: "Work In Progress", sub: "Job being completed", bg: "#FBE3D3", fg: "#7A2E0E" },
      { n: "4", title: "Completed & Paid", sub: "Razorpay UPI settlement", bg: "#E3F4E8", fg: "#1D6B36" },
    ];

    const animStyles = `
      @keyframes kzRadarPing { 0% { transform: scale(0.35); opacity: 0.8; } 100% { transform: scale(1.65); opacity: 0; } }
      @keyframes kzRadarSweep { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      @keyframes kzWorkerDrive { 0% { transform: translate(0px, 0px); } 50% { transform: translate(118px, -78px); } 100% { transform: translate(235px, -112px); } }
      @keyframes kzToolSwing { 0%, 100% { transform: rotate(-14deg); } 50% { transform: rotate(16deg); } }
      @keyframes kzWorkerBob { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-4px); } }
      @keyframes kzSparkFloat { 0% { transform: translateY(6px) scale(0.7); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(-16px) scale(1.1); opacity: 0; } }
      @keyframes kzBarGlide { 0% { background-position: 0 0; } 100% { background-position: 56px 0; } }
      @keyframes kzPulseDot { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.35); opacity: 0.65; } }
      @keyframes kzCheckPop { 0% { transform: scale(0.75); } 60% { transform: scale(1.08); } 100% { transform: scale(1); } }
    `;

    const fullAmount = activeJob
      ? Math.max(1, Math.round(Number(activeJob.dailyWage || 850) * Number(activeJob.durationDays || 1)))
      : 850;

    return h(
      "main",
      { style: { maxWidth: "1320px", margin: "0 auto", padding: "28px 24px 60px", display: "flex", flexDirection: "column", gap: "22px" } },
      h("style", null, animStyles),
      h(
        "div",
        { style: { display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "16px" } },
        h(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "8px" } },
          h("span", { style: { fontSize: "13px", fontWeight: 800, letterSpacing: "1px", color: "#7A4E00" } }, "4-STEP LIVE JOB TRACKER"),
          h(
            "h1",
            { style: { margin: 0, fontSize: "clamp(34px,4vw,52px)", lineHeight: 1, letterSpacing: "-1.6px", fontWeight: 800 } },
            "Live job ",
            h("span", { style: { fontFamily: "'Instrument Serif',serif", fontStyle: "italic", fontWeight: 400 } }, "condition & progress.")
          ),
          h("p", { style: { margin: 0, fontSize: "16px", color: isDark ? "#CFC6B8" : "#4A443A", maxWidth: "720px", lineHeight: 1.5 } }, "Watch every stage live — from 10 km broadcast radar, to your worker arriving on the map, to live work in progress and Razorpay UPI payment.")
        ),
        h(
          "button",
          {
            type: "button",
            onClick: () => navigate("/customer/my-bookings", { role: "customer" }),
            style: { height: "44px", padding: "0 18px", borderRadius: "999px", border: "1px solid " + borderCol, background: cardBg, color: isDark ? "#EDE6DA" : "#1C1913", fontWeight: 700, fontSize: "13px", cursor: "pointer" },
          },
          "← All My Bookings"
        )
      ),

      // Quick Job Switcher Pills (click any broadcasted/active job to inspect its live condition)
      myJobs.length > 1 &&
        h(
          "div",
          { style: { display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" } },
          h("span", { style: { fontSize: "12px", fontWeight: 800, color: isDark ? "#A49B8C" : "#6F685D", marginRight: "4px" } }, "SELECT JOB:"),
          myJobs.slice(0, 6).map((j) => {
            const isSel = activeJob && j.id === activeJob.id;
            return h(
              "button",
              {
                key: j.id,
                type: "button",
                onClick: () => {
                  KZ.selectedTrackingJobId = j.id;
                  setSelectedId(j.id);
                  app.setActiveWorkJobId?.(j.id);
                },
                style: {
                  height: "36px",
                  padding: "0 14px",
                  borderRadius: "999px",
                  border: "1px solid " + (isSel ? "#1C1913" : borderCol),
                  background: isSel ? "#1C1913" : cardBg,
                  color: isSel ? "#FBF8F2" : isDark ? "#EDE6DA" : "#3D3830",
                  fontWeight: 700,
                  fontSize: "12px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                },
              },
              h("span", {
                style: {
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  background: j.status === "paid_and_closed" ? "#2E9E57" : j.status === "in_progress" ? "#F5A524" : "#3B82F6",
                },
              }),
              (j.title || j.trade || "Job").slice(0, 28)
            );
          })
        ),

      // 4-Step Job Procedure Stepper (New Kaamzo Color Palette)
      activeJob &&
        h(
          "section",
          {
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
              gap: "12px",
            },
          },
          fourSteps.map((step, idx) => {
            const done = idx < currentStepIdx || (idx === 3 && isPaid);
            const active = idx === currentStepIdx && !isPaid;
            return h(
              "div",
              {
                key: step.n,
                style: {
                  borderRadius: "22px",
                  padding: "16px 18px",
                  background: active ? step.bg : done ? (isDark ? "#1C2B20" : "#E3F4E8") : cardBg,
                  border: active ? "2px solid #F5A524" : "1px solid " + (done ? "#2E9E57" : borderCol),
                  color: active || done ? (done && isDark ? "#E3F4E8" : "#1C1913") : isDark ? "#A49B8C" : "#6F685D",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  transition: "all .25s ease",
                },
              },
              h(
                "span",
                {
                  style: {
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    flexShrink: 0,
                    background: done ? "#2E9E57" : active ? "#1C1913" : isDark ? "#2E2A22" : "#EFE7DA",
                    color: done || active ? "#FBF8F2" : isDark ? "#A49B8C" : "#6F685D",
                    fontWeight: 800,
                    fontSize: "14px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  },
                },
                done ? "✓" : step.n
              ),
              h(
                "div",
                { style: { display: "flex", flexDirection: "column", gap: "2px", minWidth: 0 } },
                h(
                  "span",
                  { style: { fontSize: "14px", fontWeight: 800, display: "flex", alignItems: "center", gap: "6px" } },
                  step.title,
                  active &&
                    h("span", {
                      style: {
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "#F5A524",
                        animation: "kzPulseDot 1.3s ease-in-out infinite",
                      },
                    })
                ),
                h("span", { style: { fontSize: "12px", opacity: 0.85 } }, step.sub)
              )
            );
          })
        ),

      !activeJob
        ? h(
            "div",
            { style: { borderRadius: "28px", background: cardBg, border: "1px solid " + borderCol, padding: "40px", textAlign: "center" } },
            h("h3", { style: { margin: "0 0 8px", fontSize: "20px", fontWeight: 800 } }, "No active work order to track"),
            h("button", { type: "button", onClick: () => navigate("/customer/post-a-job", { role: "customer" }), style: { height: "46px", padding: "0 20px", borderRadius: "999px", border: 0, background: "#F5A524", fontWeight: 800 } }, "+ Post a job")
          )
        : h(
            "div",
            { style: { display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "flex-start" } },
            // LEFT DYNAMIC CONDITION CANVAS
            h(
              "section",
              { style: { flex: "999 1 560px", minWidth: 0, display: "flex", flexDirection: "column", gap: "16px" } },

              // CONDITION 1: BROADCASTING (Animated 10km Radar)
              isBroadcasting &&
                h(
                  "div",
                  {
                    style: {
                      position: "relative",
                      minHeight: "380px",
                      borderRadius: "30px",
                      overflow: "hidden",
                      background: isDark
                        ? "linear-gradient(155deg, #1E242B 0%, #27231C 100%)"
                        : "linear-gradient(155deg, #DCEAF5 0%, #FBF8F2 55%, #FCEBCB 100%)",
                      border: "1px solid " + borderCol,
                      padding: "28px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      gap: "16px",
                    },
                  },
                  h(
                    "span",
                    { style: { position: "absolute", left: "18px", top: "18px", padding: "8px 14px", borderRadius: "999px", background: "#1C1913", color: "#F5A524", fontSize: "12px", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "8px" } },
                    h("span", { style: { width: "8px", height: "8px", borderRadius: "50%", background: "#F5A524", animation: "kzPulseDot 1.2s infinite" } }),
                    "STEP 1 · BROADCASTING WITHIN 10 KM"
                  ),
                  // Animated Radar Rings
                  h(
                    "div",
                    { style: { position: "relative", width: "180px", height: "180px", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "24px" } },
                    h("span", { style: { position: "absolute", inset: "20px", borderRadius: "50%", border: "2px solid #F5A524", animation: "kzRadarPing 2.2s ease-out infinite" } }),
                    h("span", { style: { position: "absolute", inset: "20px", borderRadius: "50%", border: "2px solid #2E9E57", animation: "kzRadarPing 2.2s ease-out 1.1s infinite" } }),
                    h("div", {
                      style: {
                        position: "absolute",
                        inset: "12px",
                        borderRadius: "50%",
                        background: "conic-gradient(from 0deg, rgba(245,165,36,0.34) 0deg, rgba(245,165,36,0) 75deg, transparent 360deg)",
                        animation: "kzRadarSweep 2.6s linear infinite",
                      },
                    }),
                    h(
                      "div",
                      { style: { position: "relative", width: "68px", height: "68px", borderRadius: "50%", background: "#1C1913", color: "#F5A524", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "13px", boxShadow: "0 10px 28px rgba(28,25,19,0.22)" } },
                      "10 km"
                    )
                  ),
                  h("h3", { style: { margin: 0, fontSize: "24px", fontWeight: 800 } }, `Notifying verified ${activeJob.trade || "workers"} near ${activeJob.area || "you"}…`),
                  h("p", { style: { margin: 0, maxWidth: "460px", fontSize: "14px", color: isDark ? "#CFC6B8" : "#4A443A", lineHeight: 1.5 } }, "As soon as a nearby worker accepts, this screen automatically switches to the live GPS arrival map."),
                  h(
                    "button",
                    {
                      type: "button",
                      onClick: () => app.openTop5Shortlist?.(activeJob),
                      style: { height: "44px", padding: "0 22px", borderRadius: "999px", border: 0, background: "#F5A524", color: "#1C1913", fontWeight: 800, fontSize: "13px", cursor: "pointer" },
                    },
                    "View Top 5 Nearby Matches →"
                  )
                ),

              // CONDITION 2: WORKER IS COMING (Live Route Map with Animated Moving Worker Pin)
              isComing &&
                h(
                  "div",
                  { style: { position: "relative", height: "380px", borderRadius: "30px", overflow: "hidden", background: "#E9F0DA", border: "1px solid " + borderCol } },
                  h(
                    "svg",
                    { role: "img", "aria-label": "Live route map showing worker approaching", viewBox: "0 0 800 380", preserveAspectRatio: "xMidYMid slice", style: { position: "absolute", inset: 0, width: "100%", height: "100%" } },
                    h(
                      "g",
                      { stroke: "#FFFFFF", strokeWidth: 16, fill: "none" },
                      h("path", { d: "M-10 95 H820" }),
                      h("path", { d: "M220 -10 V390" }),
                      h("path", { d: "M-10 270 C 200 245, 520 305, 820 250" }),
                      h("path", { d: "M600 -10 C 570 125, 630 215, 580 390" })
                    ),
                    // Route path from worker to customer home
                    h("path", { d: "M125 295 C 190 245, 250 185, 360 150 S 520 110, 610 105", fill: "none", stroke: "#1C1913", strokeWidth: 6, strokeDasharray: "2 12", strokeLinecap: "round" }),
                    // Destination: Customer Home Pin
                    h("circle", { cx: 610, cy: 105, r: 22, fill: "#2E9E57", stroke: "#FFFFFF", strokeWidth: 5 }),
                    h("text", { x: 610, y: 110, textAnchor: "middle", fill: "#FFFFFF", fontSize: 12, fontWeight: 800 }, "HOME"),
                    // Animated Worker Pin gliding toward Home
                    h(
                      "g",
                      { style: { animation: "kzWorkerDrive 5.5s ease-in-out infinite alternate" } },
                      h("circle", { cx: 145, cy: 278, r: 28, fill: "rgba(245,165,36,0.28)" }),
                      h("circle", { cx: 145, cy: 278, r: 18, fill: "#F5A524", stroke: "#1C1913", strokeWidth: 4 }),
                      h("circle", { cx: 145, cy: 278, r: 5, fill: "#1C1913" })
                    )
                  ),
                  h(
                    "span",
                    { style: { position: "absolute", left: "16px", top: "16px", padding: "9px 15px", borderRadius: "999px", background: "#1C1913", color: "#FBF8F2", fontSize: "13px", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "8px" } },
                    h("span", { style: { width: "8px", height: "8px", borderRadius: "50%", background: "#F5A524", animation: "kzPulseDot 1.2s infinite" } }),
                    `ON THE WAY · ${activeJob.assignedWorkerName || "Worker"} · ${activeJob.distanceKm || 1.2} km · ETA ~${Math.max(3, Math.round((activeJob.distanceKm || 1.2) * 4))} min`
                  ),
                  h(
                    "a",
                    {
                      href: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(activeJob.locationAddress || "Ludhiana Punjab")}`,
                      target: "_blank",
                      rel: "noopener noreferrer",
                      style: { position: "absolute", right: "16px", bottom: "16px", height: "46px", padding: "0 20px", borderRadius: "999px", background: "#1C1913", color: "#FBF8F2", fontWeight: 800, fontSize: "13px", display: "inline-flex", alignItems: "center", textDecoration: "none" },
                    },
                    "Open Google Maps"
                  )
                ),

              // CONDITION 3: WORK IN PROGRESS (Animated Worker-At-Work Scene)
              isWorking &&
                h(
                  "div",
                  {
                    style: {
                      position: "relative",
                      minHeight: "380px",
                      borderRadius: "30px",
                      overflow: "hidden",
                      background: isDark
                        ? "linear-gradient(155deg, #27231C 0%, #1F1C17 60%, #1B2920 100%)"
                        : "linear-gradient(155deg, #FFF7E3 0%, #FBF8F2 55%, #E3F4E8 100%)",
                      border: "2px solid #F5A524",
                      padding: "28px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      gap: "16px",
                    },
                  },
                  h(
                    "span",
                    { style: { position: "absolute", left: "18px", top: "18px", padding: "8px 14px", borderRadius: "999px", background: "#2E9E57", color: "#FFFFFF", fontSize: "12px", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "8px" } },
                    h("span", { style: { width: "8px", height: "8px", borderRadius: "50%", background: "#FFFFFF", animation: "kzPulseDot 1.1s infinite" } }),
                    "STEP 3 · WORK IN PROGRESS"
                  ),
                  // Animated Worker SVG Scene
                  h(
                    "svg",
                    { viewBox: "0 0 320 180", style: { width: "290px", maxWidth: "100%", height: "auto", marginTop: "20px" }, "aria-label": "Worker actively completing the job" },
                    // Warm backdrop sun circle
                    h("circle", { cx: 160, cy: 105, r: 72, fill: isDark ? "rgba(245,165,36,0.12)" : "#FCEBCB" }),
                    // Floor line
                    h("rect", { x: 40, y: 152, width: 240, height: 6, rx: 3, fill: isDark ? "#3A342C" : "#E5DCCB" }),
                    // Workbench / Fixture
                    h("rect", { x: 185, y: 104, width: 78, height: 48, rx: 10, fill: "#D4A373" }),
                    h("rect", { x: 194, y: 114, width: 60, height: 10, rx: 4, fill: "#FBF8F2", opacity: 0.7 }),
                    // Worker body (bobbing subtly while working)
                    h(
                      "g",
                      { style: { animation: "kzWorkerBob 1.8s ease-in-out infinite" } },
                      // Legs
                      h("rect", { x: 112, y: 116, width: 16, height: 36, rx: 6, fill: "#2B303A" }),
                      h("rect", { x: 132, y: 116, width: 16, height: 36, rx: 6, fill: "#1C1913" }),
                      // Torso in Kaamzo marigold amber
                      h("rect", { x: 106, y: 74, width: 48, height: 48, rx: 14, fill: "#F5A524" }),
                      // Head & cap
                      h("circle", { cx: 130, cy: 52, r: 18, fill: "#D99B72" }),
                      h("path", { d: "M112 48 C114 32, 146 32, 148 48 Z", fill: "#1C1913" }),
                      h("rect", { x: 128, y: 44, width: 26, height: 5, rx: 2.5, fill: "#1C1913" }),
                      // Animated Swinging Working Arm + Wrench/Tool
                      h(
                        "g",
                        { style: { transformOrigin: "146px 86px", animation: "kzToolSwing 1.15s ease-in-out infinite" } },
                        h("rect", { x: 142, y: 80, width: 44, height: 12, rx: 6, fill: "#D99B72" }),
                        h("rect", { x: 178, y: 72, width: 28, height: 8, rx: 3, fill: "#4A5568", transform: "rotate(-22 182 82)" }),
                        h("circle", { cx: 204, cy: 70, r: 6, fill: "#2E9E57" })
                      )
                    ),
                    // Floating animated sparks / work progress dots
                    h("circle", { cx: 212, cy: 82, r: 4, fill: "#F5A524", style: { animation: "kzSparkFloat 1.5s ease-out infinite" } }),
                    h("circle", { cx: 226, cy: 90, r: 3.5, fill: "#2E9E57", style: { animation: "kzSparkFloat 1.5s ease-out 0.5s infinite" } }),
                    h("circle", { cx: 200, cy: 76, r: 3, fill: "#E07A5F", style: { animation: "kzSparkFloat 1.5s ease-out 0.9s infinite" } })
                  ),
                  h("h3", { style: { margin: 0, fontSize: "24px", fontWeight: 800 } }, `${activeJob.assignedWorkerName || "Your worker"} is completing the job`),
                  h("p", { style: { margin: 0, maxWidth: "480px", fontSize: "14px", color: isDark ? "#CFC6B8" : "#4A443A", lineHeight: 1.5 } }, `Work is actively underway for "${activeJob.title}". Once finished, the worker will click Mark Completed and your Pay Now button will unlock automatically.`),
                  // Animated progress bar
                  h(
                    "div",
                    { style: { width: "100%", maxWidth: "420px", height: "12px", borderRadius: "999px", background: isDark ? "#2E2A22" : "#EFE7DA", overflow: "hidden" } },
                    h("div", {
                      style: {
                        width: "72%",
                        height: "100%",
                        borderRadius: "999px",
                        backgroundImage: "repeating-linear-gradient(45deg, #F5A524 0, #F5A524 14px, #2E9E57 14px, #2E9E57 28px)",
                        backgroundSize: "56px 56px",
                        animation: "kzBarGlide 1.4s linear infinite",
                      },
                    })
                  )
                ),

              // CONDITION 4: COMPLETED / PAID
              (isPayDue || isPaid) &&
                h(
                  "div",
                  {
                    style: {
                      position: "relative",
                      minHeight: "380px",
                      borderRadius: "30px",
                      overflow: "hidden",
                      background: isPaid
                        ? isDark
                          ? "linear-gradient(155deg, #1B2920 0%, #1F1C17 100%)"
                          : "linear-gradient(155deg, #E3F4E8 0%, #FBF8F2 100%)"
                        : isDark
                        ? "linear-gradient(155deg, #2B2418 0%, #1F1C17 100%)"
                        : "linear-gradient(155deg, #FFF7E3 0%, #FBF8F2 100%)",
                      border: "2px solid " + (isPaid ? "#2E9E57" : "#F5A524"),
                      padding: "32px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      textAlign: "center",
                      gap: "14px",
                    },
                  },
                  h(
                    "div",
                    {
                      style: {
                        width: "76px",
                        height: "76px",
                        borderRadius: "50%",
                        background: isPaid ? "#2E9E57" : "#F5A524",
                        color: isPaid ? "#FFFFFF" : "#1C1913",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "34px",
                        fontWeight: 900,
                        animation: "kzCheckPop 0.6s ease-out",
                        boxShadow: "0 14px 32px rgba(28,25,19,0.16)",
                      },
                    },
                    isPaid ? "✓" : "₹"
                  ),
                  h("h3", { style: { margin: 0, fontSize: "26px", fontWeight: 800 } }, isPaid ? "Job Completed & Settled via Razorpay!" : "Job Completed — Ready for Payment"),
                  h(
                    "p",
                    { style: { margin: 0, maxWidth: "480px", fontSize: "14px", color: isDark ? "#CFC6B8" : "#4A443A", lineHeight: 1.5 } },
                    isPaid
                      ? `Paid ${formatInr(fullAmount)} to ${activeJob.assignedWorkerName || "Worker"}${activeJob.assignedWorkerUpi ? " (" + activeJob.assignedWorkerUpi + ")" : ""}${activeJob.razorpayPaymentId ? " · Ref: " + activeJob.razorpayPaymentId : ""}.`
                      : `${activeJob.assignedWorkerName || "Your worker"} marked "${activeJob.title}" completed${activeJob.assignedWorkerUpi ? " with UPI " + activeJob.assignedWorkerUpi : ""}. Pay securely via Razorpay UPI now.`
                  ),
                  isPayDue &&
                    h(
                      "button",
                      {
                        type: "button",
                        onClick: () => launchRazorpayCheckout(activeJob, app),
                        style: {
                          height: "48px",
                          padding: "0 26px",
                          borderRadius: "999px",
                          border: 0,
                          background: "#F5A524",
                          color: "#1C1913",
                          fontWeight: 800,
                          fontSize: "15px",
                          cursor: "pointer",
                          boxShadow: "0 8px 22px rgba(245,165,36,0.38)",
                        },
                      },
                      `Pay Now · ${formatInr(fullAmount)} (Razorpay UPI)`
                    )
                )
            ),

            // RIGHT SUMMARY & CONTROLS PANEL
            h(
              "aside",
              { style: { flex: "1 1 340px", borderRadius: "30px", background: cardBg, border: "1px solid " + borderCol, padding: "24px", display: "flex", flexDirection: "column", gap: "14px" } },
              h("span", { style: { fontSize: "11px", fontWeight: 800, letterSpacing: "0.8px", color: "#7A4E00" } }, "WORK ORDER #" + activeJob.id),
              h("h2", { style: { margin: 0, fontSize: "22px", fontWeight: 800 } }, activeJob.title),
              h(JobProgressPipeline, { job: activeJob, isDark }),
              h("div", { style: { padding: "14px", borderRadius: "18px", background: "#1C1913", color: "#FBF8F2", display: "flex", justifyContent: "space-between", alignItems: "center" } }, h("span", { style: { fontSize: "12px", fontWeight: 700, color: "#CFC6B8" } }, "4-Digit Start OTP"), h("b", { style: { fontSize: "24px", letterSpacing: "3px", color: "#F5A524" } }, activeJob.otpCode || "—")),
              h("div", { style: { padding: "14px", borderRadius: "18px", background: "#E3F4E8", color: "#1D6B36", display: "flex", justifyContent: "space-between", alignItems: "center" } }, h("span", { style: { fontSize: "13px", fontWeight: 700 } }, "Attendance clock"), h("b", { style: { fontSize: "18px" } }, fmtClock(elapsedSec))),
              h(
                "div",
                { style: { display: "flex", flexWrap: "wrap", gap: "8px" } },
                h("button", { type: "button", onClick: () => app.dispatchJobStartOtp?.(activeJob), style: { height: "44px", padding: "0 16px", borderRadius: "999px", border: "1px solid " + borderCol, background: "transparent", color: isDark ? "#EDE6DA" : "#1C1913", fontWeight: 700, fontSize: "13px" } }, "Resend Start OTP"),
                isPaid
                  ? h("span", { style: { flex: 1, height: "44px", padding: "0 18px", borderRadius: "999px", background: "#E3F4E8", color: "#1D6B36", fontWeight: 800, fontSize: "13px", display: "inline-flex", alignItems: "center", justifyContent: "center" } }, "✓ Paid via Razorpay")
                  : h("button", { type: "button", onClick: () => launchRazorpayCheckout(activeJob, app), style: { flex: 1, height: "44px", padding: "0 18px", borderRadius: "999px", border: 0, background: isPayDue ? "#F5A524" : "#2E9E57", color: isPayDue ? "#1C1913" : "#FFFFFF", fontWeight: 800, fontSize: "13px", cursor: "pointer" } }, `Pay Now · ${formatInr(fullAmount)}`)
              )
            )
          )
    );
  }

  // -------------------------------------------------------------------------
  // 5. /customer/crew-and-rebook
  // -------------------------------------------------------------------------
  function CustomerCrewView() {
    const app = useApp();
    const isDark = app.isDarkMode;
    const cust = app.currentCustomer;
    const workers = app.workers || [];
    const jobs = app.jobs || [];

    const pastPros = useMemo(() => {
      const done = jobs.filter((j) => j.assignedWorkerName);
      if (done.length > 0) return done.slice(0, 6);
      return workers.slice(0, 4).map((w) => ({
        id: "pro-" + w.id,
        assignedWorkerName: w.name,
        trade: w.primaryTrade,
        title: w.primaryTrade + " service",
        dailyWage: w.dailyRate,
        rating: w.rating || 4.8,
      }));
    }, [jobs, workers]);

    const [crewCounts, setCrewCounts] = useState({ Mason: 2, Helper: 3, Electrician: 1, Plumber: 0, Painter: 0 });
    const [crewDays, setCrewDays] = useState(3);

    const crewTotalBase = Object.keys(crewCounts).reduce((sum, tr) => {
      const n = crewCounts[tr] || 0;
      return sum + n * getLiveTradeRate(tr, workers) * crewDays;
    }, 0);
    const crewFee = Math.round(crewTotalBase * 0.2);

    const rebookPro = (item) => {
      if (!cust) {
        KZ.openLoginPrompt?.({ title: "Login to post a job", returnPath: "/customer/crew-and-rebook" });
        return;
      }
      const r = Number(item.dailyWage) || getLiveTradeRate(item.trade, workers);
      const created = app.postJob?.({
        title: `Rebook ${item.assignedWorkerName} (${item.trade})`,
        trade: item.trade,
        description: `1-tap rebook for trusted ${item.trade} ${item.assignedWorkerName}.`,
        customerName: cust?.name || "Employer",
        customerPhone: cust?.phone || "+91 98101 00000",
        locationAddress: cust?.address || "Model Town, Ludhiana",
        area: cust?.area || "Model Town",
        dailyWage: r,
        durationDays: 1,
        startDate: new Date().toISOString().slice(0, 10),
        baseLabor: r,
      });
      if (created) navigate("/customer/my-bookings", { role: "customer" });
    };

    const postCrew = () => {
      if (!cust) {
        KZ.openLoginPrompt?.({ title: "Login to post a job", returnPath: "/customer/crew-and-rebook" });
        return;
      }
      const summary = Object.entries(crewCounts)
        .filter(([, n]) => n > 0)
        .map(([tr, n]) => `${n}× ${tr}`)
        .join(", ");
      if (!summary) {
        app.showNotification?.("Add at least 1 worker to your crew.");
        return;
      }
      const leadTrade = Object.entries(crewCounts).find(([, n]) => n > 0)?.[0] || "Mason";
      const created = app.postJob?.({
        title: `Site Crew (${summary}) · ${crewDays}d`,
        trade: leadTrade,
        description: `Multi-trade crew broadcast: ${summary} for ${crewDays} days.`,
        customerName: cust?.name || "Employer",
        customerPhone: cust?.phone || "+91 98101 00000",
        locationAddress: cust?.address || "Model Town, Ludhiana",
        area: cust?.area || "Model Town",
        dailyWage: Math.round(crewTotalBase / crewDays),
        durationDays: crewDays,
        startDate: new Date().toISOString().slice(0, 10),
        baseLabor: crewTotalBase,
      });
      if (created) navigate("/customer/my-bookings", { role: "customer" });
    };

    const cardBg = isDark ? "#1F1C17" : "#FFFFFF";
    const borderCol = isDark ? "#2E2A22" : "#EFE7DA";

    return h(
      "main",
      { style: { maxWidth: "1320px", margin: "0 auto", padding: "28px 24px 60px", display: "flex", flexDirection: "column", gap: "24px" } },
      h(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "8px" } },
        h("span", { style: { fontSize: "13px", fontWeight: 800, letterSpacing: "1px", color: "#7A4E00" } }, "REPEAT & TEAM HIRING"),
        h(
          "h1",
          { style: { margin: 0, fontSize: "clamp(34px,4vw,52px)", lineHeight: 1, letterSpacing: "-1.6px", fontWeight: 800 } },
          "1-tap rebook & ",
          h("span", { style: { fontFamily: "'Instrument Serif',serif", fontStyle: "italic", fontWeight: 400 } }, "crew mode.")
        ),
        h("p", { style: { margin: 0, fontSize: "16px", color: isDark ? "#CFC6B8" : "#4A443A", maxWidth: "720px", lineHeight: 1.5 } }, "Book the workers you already trust again, or put together a whole team in one broadcast.")
      ),
      h(
        "div",
        { style: { display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "flex-start" } },
        h(
          "section",
          { style: { flex: "1 1 460px", minWidth: 0, borderRadius: "30px", background: cardBg, border: "1px solid " + borderCol, padding: "24px", display: "flex", flexDirection: "column", gap: "14px" } },
          h("b", { style: { fontSize: "20px" } }, "Rebook your trusted workers"),
          pastPros.map((item) => {
            const tm = getTradeMeta(item.trade);
            return h(
              "div",
              { key: item.id, style: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "14px", padding: "16px", borderRadius: "22px", background: isDark ? "#27231C" : "#FBF8F2" } },
              h("span", { style: { width: "52px", height: "52px", borderRadius: "18px", background: tm.bg, color: tm.fg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 } }, (item.assignedWorkerName || "W").slice(0, 1).toUpperCase()),
              h(
                "span",
                { style: { flex: 1, minWidth: "200px", display: "flex", flexDirection: "column", gap: "2px" } },
                h("b", null, `${item.assignedWorkerName} · ${tm.name}`),
                h("span", { style: { fontSize: "13px", color: isDark ? "#CFC6B8" : "#4A443A" } }, `${item.title} · ${formatInr(item.dailyWage || tm.rate)}/day · ★ ${Number(item.rating || 4.8).toFixed(1)}`)
              ),
              h("button", { type: "button", onClick: () => rebookPro(item), style: { height: "44px", padding: "0 20px", borderRadius: "999px", fontWeight: 800, fontSize: "14px", border: 0, background: "#1C1913", color: "#FBF8F2" } }, "1-Tap Rebook")
            );
          })
        ),
        h(
          "section",
          { style: { flex: "1 1 420px", minWidth: 0, borderRadius: "30px", background: cardBg, border: "1px solid " + borderCol, padding: "24px", display: "flex", flexDirection: "column", gap: "14px" } },
          h("b", { style: { fontSize: "20px" } }, "Crew mode calculator"),
          Object.keys(crewCounts).map((tr) =>
            h(
              "div",
              { key: tr, style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: "16px", background: isDark ? "#27231C" : "#FBF8F2" } },
              h("span", { style: { fontWeight: 800 } }, tr + ` (${formatInr(getLiveTradeRate(tr, workers))}/d)`),
              h(
                "div",
                { style: { display: "flex", alignItems: "center", gap: "10px" } },
                h("button", { type: "button", onClick: () => setCrewCounts((c) => Object.assign({}, c, { [tr]: Math.max(0, (c[tr] || 0) - 1) })), style: { width: "34px", height: "34px", borderRadius: "50%", border: "1px solid " + borderCol, background: cardBg, color: isDark ? "#EDE6DA" : "#1C1913", fontWeight: 800 } }, "−"),
                h("b", { style: { minWidth: "24px", textAlign: "center" } }, crewCounts[tr] || 0),
                h("button", { type: "button", onClick: () => setCrewCounts((c) => Object.assign({}, c, { [tr]: Math.min(20, (c[tr] || 0) + 1) })), style: { width: "34px", height: "34px", borderRadius: "50%", border: 0, background: "#1C1913", color: "#FBF8F2", fontWeight: 800 } }, "+")
              )
            )
          ),
          h("label", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: 700 } }, "Duration (days)", h("input", { type: "number", min: 1, max: 30, value: crewDays, onChange: (e) => setCrewDays(Math.max(1, Number(e.target.value) || 1)), style: { width: "80px", height: "40px", textAlign: "center", borderRadius: "12px", border: "1px solid " + borderCol } })),
          h("div", { style: { padding: "14px", borderRadius: "18px", background: "#1C1913", color: "#FBF8F2", display: "flex", justifyContent: "space-between", alignItems: "baseline" } }, h("span", null, `Crew total (+20% fee ${formatInr(crewFee)})`), h("b", { style: { fontSize: "24px", color: "#F5A524" } }, formatInr(crewTotalBase + crewFee))),
          h("button", { type: "button", onClick: postCrew, style: { height: "50px", borderRadius: "999px", border: 0, background: "#F5A524", color: "#1C1913", fontWeight: 800, fontSize: "15px" } }, "Broadcast Full Crew →")
        )
      )
    );
  }

  // -------------------------------------------------------------------------
  // 6. /customer/sos-check-in & /customer/support
  // -------------------------------------------------------------------------
  function CustomerSosView() {
    const app = useApp();
    const isDark = app.isDarkMode;
    const cust = app.currentCustomer;
    const [sendingSos, setSendingSos] = useState(false);

    const triggerSosAlert = async () => {
      setSendingSos(true);
      try {
        await fetch("/api/db", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "upsert",
            collection: "sosAlerts",
            id: "sos-" + Date.now(),
            data: {
              senderRole: "customer",
              senderName: cust?.name || "Customer",
              senderPhone: cust?.phone || "+91 98101 00000",
              area: cust?.area || "Ludhiana",
              gpsLocation: cust?.gpsLocation || { lat: 30.8926, lng: 75.8415 },
              createdAt: new Date().toISOString(),
              status: "active",
            },
          }),
        });
        app.showNotification?.("Emergency SOS check-in recorded in Admin Security Log!");
        if (typeof window.kaamzoSendSosWhatsApp === "function") {
          window.kaamzoSendSosWhatsApp(cust?.name || "Customer", cust?.area || "Ludhiana");
        }
      } catch (_) {}
      setSendingSos(false);
    };

    const cardBg = isDark ? "#1F1C17" : "#FFFFFF";
    const borderCol = isDark ? "#2E2A22" : "#EFE7DA";

    return h(
      "main",
      { style: { maxWidth: "1320px", margin: "0 auto", padding: "28px 24px 60px", display: "flex", flexDirection: "column", gap: "24px" } },
      h(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "8px" } },
        h("span", { style: { fontSize: "13px", fontWeight: 800, letterSpacing: "1px", color: "#7A4E00" } }, "24×7 EMERGENCY & LIVE GPS SAFETY SHIELD"),
        h(
          "h1",
          { style: { margin: 0, fontSize: "clamp(34px,4vw,52px)", lineHeight: 1, letterSpacing: "-1.6px", fontWeight: 800 } },
          "SOS & ",
          h("span", { style: { fontFamily: "'Instrument Serif',serif", fontStyle: "italic", fontWeight: 400 } }, "safety check-in.")
        ),
        h("p", { style: { margin: 0, fontSize: "16px", color: isDark ? "#CFC6B8" : "#4A443A", maxWidth: "720px", lineHeight: 1.5 } }, "Every check-in is recorded in Kaamzo’s security audit log and can be sent to help straight away.")
      ),
      h(
        "div",
        { style: { display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "stretch" } },
        h(
          "section",
          { style: { flex: "1 1 460px", minWidth: 0, borderRadius: "32px", background: "#2A2342", color: "#FBF8F2", padding: "28px", display: "flex", flexDirection: "column", gap: "16px" } },
          h("span", { style: { display: "flex", alignItems: "center", gap: "10px", fontWeight: 800 } }, h("span", { style: { width: "12px", height: "12px", borderRadius: "50%", background: "#5BD68A" } }), "Live GPS locked for customer & worker safety"),
          h(
            "div",
            { style: { position: "relative", height: "220px", borderRadius: "24px", background: "#3B2C4A", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" } },
            h(
              "svg",
              { "aria-hidden": "true", width: 220, height: 220, viewBox: "0 0 220 220" },
              h("circle", { cx: 110, cy: 110, r: 100, fill: "none", stroke: "#6E4A63", strokeWidth: 2 }),
              h("circle", { cx: 110, cy: 110, r: 66, fill: "none", stroke: "#6E4A63", strokeWidth: 2 }),
              h("circle", { cx: 110, cy: 110, r: 30, fill: "#E5484D", opacity: 0.25 }),
              h("circle", { cx: 110, cy: 110, r: 12, fill: "#E5484D" })
            )
          ),
          h(
            "div",
            { style: { display: "flex", flexWrap: "wrap", gap: "10px" } },
            h("a", { href: "tel:112", style: { height: "50px", padding: "0 24px", borderRadius: "999px", background: "#E5484D", color: "#FFFFFF", fontWeight: 800, textDecoration: "none", display: "inline-flex", alignItems: "center" } }, "Call 112 Police/SOS"),
            h("button", { type: "button", disabled: sendingSos, onClick: triggerSosAlert, style: { height: "50px", padding: "0 22px", borderRadius: "999px", border: 0, background: "#F5A524", color: "#1C1913", fontWeight: 800 } }, sendingSos ? "Recording SOS…" : "Log Safety SOS & WhatsApp")
          )
        ),
        h(
          "section",
          { style: { flex: "1 1 380px", borderRadius: "32px", background: cardBg, border: "1px solid " + borderCol, padding: "28px", display: "flex", flexDirection: "column", gap: "14px" } },
          h("b", { style: { fontSize: "20px" } }, "How Kaamzo protects every site visit"),
          h("p", { style: { margin: 0, fontSize: "14px", color: isDark ? "#CFC6B8" : "#4A443A", lineHeight: 1.6 } }, "1. Aadhaar + live selfie KYC approved before any worker can accept a job.\n2. Exact 4-digit start OTP verified on site.\n3. One-tap 112 dial + instant WhatsApp live GPS ping."),
          h("button", { type: "button", onClick: () => navigate("/customer/support", { role: "customer" }), style: { alignSelf: "flex-start", height: "44px", padding: "0 18px", borderRadius: "999px", border: "1px solid " + borderCol, background: "transparent", color: isDark ? "#EDE6DA" : "#1C1913", fontWeight: 700 } }, "Open Support & Disputes →")
        )
      )
    );
  }

  function CustomerSupportView() {
    const app = useApp();
    const isDark = app.isDarkMode;
    const jobs = app.jobs || [];
    const disputes = app.disputes || [];

    const [selJobId, setSelJobId] = useState(jobs[0]?.id || "");
    const [reason, setReason] = useState("Delay or quality issue");
    const [details, setDetails] = useState("");

    const submitDispute = (e) => {
      e.preventDefault();
      if (!selJobId) {
        app.showNotification?.("Please select a booking first.");
        return;
      }
      app.raiseJobComplaint?.(selJobId, reason, details.trim() || reason);
      setDetails("");
      app.showNotification?.("Dispute ticket filed and escrow paused for review.");
    };

    const cardBg = isDark ? "#1F1C17" : "#FFFFFF";
    const borderCol = isDark ? "#2E2A22" : "#EFE7DA";

    return h(
      "main",
      { style: { maxWidth: "1320px", margin: "0 auto", padding: "32px 24px 80px", display: "flex", flexDirection: "column", gap: "24px" } },
      h(
        "section",
        { style: { position: "relative", overflow: "hidden", borderRadius: "36px", background: "linear-gradient(180deg, #2A2342 0%, #6E4A63 60%, #D38457 100%)", color: "#FBF8F2", padding: "44px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "20px" } },
        h(
          "div",
          { style: { position: "relative", display: "flex", flexDirection: "column", gap: "12px", maxWidth: "640px" } },
          h("span", { style: { alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "8px", padding: "8px 14px", borderRadius: "999px", background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.25)", fontSize: "13px", fontWeight: 700 } }, h("span", { style: { width: "8px", height: "8px", borderRadius: "50%", background: "#5BD68A" } }), "Support live & active"),
          h("h1", { style: { margin: 0, fontSize: "clamp(36px, 4.4vw, 58px)", lineHeight: 1, letterSpacing: "-1.6px", fontWeight: 800 } }, "Support & ", h("span", { style: { fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, color: "#F7C88E" } }, "safety"), " hub"),
          h("p", { style: { margin: 0, fontSize: "16px", lineHeight: 1.5, color: "#EBD9C8" } }, "24/7 voice help, WhatsApp, dispute resolution and hyperlocal safety for every booking.")
        ),
        h("a", { href: "tel:112", style: { position: "relative", height: "54px", padding: "0 24px", borderRadius: "999px", background: "#E5484D", color: "#FFFFFF", fontWeight: 800, textDecoration: "none", display: "inline-flex", alignItems: "center" } }, "SOS · Call 112")
      ),

      h(
        "div",
        { style: { display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "flex-start" } },
        h(
          "form",
          { onSubmit: submitDispute, style: { flex: "1 1 460px", borderRadius: "30px", background: cardBg, border: "1px solid " + borderCol, padding: "24px", display: "flex", flexDirection: "column", gap: "14px" } },
          h("b", { style: { fontSize: "20px" } }, "Raise an escrow dispute or complaint"),
          h(
            "select",
            { value: selJobId, onChange: (e) => setSelJobId(e.target.value), style: { height: "48px", borderRadius: "14px", border: "1px solid " + borderCol, padding: "0 12px", background: isDark ? "#14120E" : "#FBF8F2", color: isDark ? "#EDE6DA" : "#1C1913" } },
            jobs.length === 0 ? h("option", { value: "" }, "No bookings yet") : jobs.map((j) => h("option", { key: j.id, value: j.id }, `${j.title} (#${j.id})`))
          ),
          h("input", { type: "text", value: reason, onChange: (e) => setReason(e.target.value), placeholder: "Reason", style: { height: "48px", borderRadius: "14px", border: "1px solid " + borderCol, padding: "0 14px", background: isDark ? "#14120E" : "#FBF8F2", color: isDark ? "#EDE6DA" : "#1C1913" } }),
          h("textarea", { rows: 3, value: details, onChange: (e) => setDetails(e.target.value), placeholder: "Describe what happened…", style: { borderRadius: "14px", border: "1px solid " + borderCol, padding: "12px 14px", background: isDark ? "#14120E" : "#FBF8F2", color: isDark ? "#EDE6DA" : "#1C1913" } }),
          h("button", { type: "submit", style: { height: "48px", borderRadius: "999px", border: 0, background: "#1C1913", color: "#FBF8F2", fontWeight: 800 } }, "Submit Dispute Ticket")
        ),
        h(
          "section",
          { style: { flex: "1 1 380px", borderRadius: "30px", background: cardBg, border: "1px solid " + borderCol, padding: "24px", display: "flex", flexDirection: "column", gap: "12px" } },
          h("b", { style: { fontSize: "20px" } }, `Active tickets (${disputes.length})`),
          disputes.length === 0
            ? h("span", { style: { color: isDark ? "#A49B8C" : "#6F685D" } }, "No active disputes right now.")
            : disputes.slice(0, 6).map((d) =>
                h(
                  "div",
                  { key: d.id, style: { padding: "14px", borderRadius: "16px", background: isDark ? "#27231C" : "#FBF8F2", display: "flex", flexDirection: "column", gap: "4px" } },
                  h("b", null, d.reason || "Support dispute"),
                  h("span", { style: { fontSize: "13px", color: isDark ? "#CFC6B8" : "#4A443A" } }, d.detailedReason || ""),
                  h("span", { style: { fontSize: "11px", fontWeight: 800, color: "#7A4E00" } }, String(d.status || "open").toUpperCase())
                )
              )
        )
      )
    );
  }

  // -------------------------------------------------------------------------
  // 7. /customer/map-and-radar — Clean 10 km radar (worker name, trade, dist ONLY)
  // -------------------------------------------------------------------------
  function CustomerMapRadarView() {
    const app = useApp();
    const isDark = app.isDarkMode;
    const workers = app.workers || [];
    const [tab, setTab] = useState("radar"); // "map" | "radar"
    const nearby = workers.filter((w) => w.isVerified !== false).slice(0, 12);
    const cardBg = isDark ? "#1F1C17" : "#FFFFFF";
    const borderCol = isDark ? "#2E2A22" : "#EFE7DA";

    return h(
      "main",
      { style: { maxWidth: "1320px", margin: "0 auto", padding: "28px 24px 60px", display: "flex", flexDirection: "column", gap: "24px" } },
      h(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "8px" } },
        h("span", { style: { fontSize: "13px", fontWeight: 800, letterSpacing: "1px", color: "#7A4E00" } }, "10 KM LIVE MAP"),
        h(
          "h1",
          { style: { margin: 0, fontSize: "clamp(34px,4vw,52px)", lineHeight: 1, letterSpacing: "-1.6px", fontWeight: 800 } },
          "Workers ",
          h("span", { style: { fontFamily: "'Instrument Serif',serif", fontStyle: "italic", fontWeight: 400 } }, "around you.")
        ),
        h("p", { style: { margin: 0, fontSize: "16px", color: isDark ? "#CFC6B8" : "#4A443A", maxWidth: "720px", lineHeight: 1.5 } }, "See every verified worker inside your 10 km Ludhiana radius on the map or radar.")
      ),
      h(
        "div",
        { role: "tablist", style: { alignSelf: "flex-start", display: "flex", gap: "4px", padding: "5px", borderRadius: "999px", background: cardBg, border: "1px solid " + borderCol } },
        h("button", { type: "button", onClick: () => navigate("/customer", { role: "customer" }), style: { height: "42px", padding: "0 16px", border: 0, borderRadius: "999px", background: "transparent", color: isDark ? "#EDE6DA" : "#3D3830", fontWeight: 700 } }, "Grid view"),
        h("button", { type: "button", onClick: () => setTab("map"), style: { height: "42px", padding: "0 16px", border: 0, borderRadius: "999px", background: tab === "map" ? "#1C1913" : "transparent", color: tab === "map" ? "#FBF8F2" : isDark ? "#EDE6DA" : "#3D3830", fontWeight: 700 } }, "Ludhiana Map"),
        h("button", { type: "button", onClick: () => setTab("radar"), style: { height: "42px", padding: "0 16px", border: 0, borderRadius: "999px", background: tab === "radar" ? "#1C1913" : "transparent", color: tab === "radar" ? "#FBF8F2" : isDark ? "#EDE6DA" : "#3D3830", fontWeight: 700 } }, "10 km GPS radar")
      ),
      h(
        "div",
        { style: { display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "stretch" } },
        h(
          "section",
          {
            style: {
              flex: "999 1 560px",
              minWidth: 0,
              position: "relative",
              height: "480px",
              borderRadius: "32px",
              overflow: "hidden",
              background: tab === "radar" ? "#1C1913" : "#E9F0DA",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
          },
          tab === "radar"
            ? h(
                "svg",
                { viewBox: "0 0 400 400", style: { width: "100%", height: "100%", maxWidth: "440px" } },
                h("circle", { cx: 200, cy: 200, r: 175, fill: "none", stroke: "#3A342C", strokeWidth: 1.5, strokeDasharray: "4 4" }),
                h("circle", { cx: 200, cy: 200, r: 120, fill: "none", stroke: "#3A342C", strokeWidth: 1.5 }),
                h("circle", { cx: 200, cy: 200, r: 65, fill: "none", stroke: "#5B5040", strokeWidth: 1.5 }),
                h("circle", { cx: 200, cy: 200, r: 10, fill: "#F5A524" }),
                nearby.map((w, i) => {
                  const angle = (i * 2.399) % (Math.PI * 2);
                  const rad = 45 + ((i * 29) % 120);
                  const x = 200 + Math.cos(angle) * rad;
                  const y = 200 + Math.sin(angle) * rad;
                  return h(
                    "g",
                    { key: w.id },
                    h("circle", { cx: x, cy: y, r: 8, fill: "#5BD68A", stroke: "#1C1913", strokeWidth: 2 }),
                    h("text", { x: x + 12, y: y + 4, fill: "#FBF8F2", fontSize: "12", fontWeight: "700" }, w.name)
                  );
                })
              )
            : h(
                "svg",
                { viewBox: "0 0 800 520", preserveAspectRatio: "xMidYMid slice", style: { position: "absolute", inset: 0, width: "100%", height: "100%" } },
                h("g", { stroke: "#FFFFFF", strokeWidth: 18, fill: "none" }, h("path", { d: "M-10 150 H820" }), h("path", { d: "M300 -10 V530" }), h("path", { d: "M-10 400 C 220 360, 540 440, 820 380" })),
                nearby.map((w, i) => {
                  const x = 110 + ((i * 137) % 580);
                  const y = 80 + ((i * 97) % 340);
                  return h(
                    "g",
                    { key: w.id },
                    h("circle", { cx: x, cy: y, r: 12, fill: "#1C1913", stroke: "#F5A524", strokeWidth: 3 }),
                    h("text", { x: x + 16, y: y + 5, fill: "#1C1913", fontSize: "14", fontWeight: "800" }, w.name)
                  );
                })
              )
        ),
        // Right list: shows worker name + trade + distance ONLY (per user rule #7)
        h(
          "aside",
          { style: { flex: "1 1 320px", borderRadius: "32px", background: cardBg, border: "1px solid " + borderCol, padding: "22px", display: "flex", flexDirection: "column", gap: "10px", maxHeight: "480px", overflowY: "auto" } },
          h("span", { style: { fontSize: "12px", fontWeight: 800, letterSpacing: "0.8px", color: "#7A4E00" } }, `WORKERS INSIDE 10 KM (${nearby.length})`),
          nearby.map((w) => {
            const tm = getTradeMeta(w.primaryTrade);
            return h(
              "div",
              { key: w.id, style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 14px", borderRadius: "16px", background: isDark ? "#27231C" : "#FBF8F2" } },
              h("div", { style: { display: "flex", flexDirection: "column" } }, h("b", { style: { fontSize: "15px" } }, w.name), h("span", { style: { fontSize: "12px", color: isDark ? "#A49B8C" : "#6F685D" } }, tm.name)),
              h("span", { style: { fontSize: "12px", fontWeight: 800, color: "#1D6B36" } }, `${w.location?.distanceKm || 1.9} km`)
            );
          })
        )
      )
    );
  }

  // -------------------------------------------------------------------------
  // 8. /customer/scan-badge-and-chat
  // -------------------------------------------------------------------------
  function CustomerScanChatView() {
    const app = useApp();
    const isDark = app.isDarkMode;
    const workers = app.workers || [];

    const [badgeInput, setBadgeInput] = useState("");
    const [matchedWorker, setMatchedWorker] = useState(null);
    const [scanning, setScanning] = useState(false);
    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const lookupBadge = (raw) => {
      const q = String(raw || badgeInput || "").trim().toLowerCase();
      if (!q) return;
      const found = workers.find(
        (w) =>
          String(w.id || "").toLowerCase() === q ||
          String(w.phone || "").toLowerCase().includes(q) ||
          String(w.name || "").toLowerCase().includes(q)
      );
      if (found) {
        setMatchedWorker(found);
        app.showNotification?.("Verified Kaamzo badge: " + found.name);
      } else {
        app.showNotification?.("No verified worker found matching '" + raw + "'.");
      }
    };

    const startQrScan = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        streamRef.current = stream;
        setScanning(true);
        setTimeout(() => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        }, 50);
      } catch (_) {
        app.showNotification?.("Camera unavailable — enter Worker ID below.");
      }
    };

    useEffect(() => {
      if (!scanning) return;
      const timer = setInterval(() => {
        const v = videoRef.current;
        if (!v || !v.videoWidth || typeof window.jsQR !== "function") return;
        const canvas = document.createElement("canvas");
        canvas.width = v.videoWidth;
        canvas.height = v.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(v, 0, 0);
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = window.jsQR(img.data, canvas.width, canvas.height);
        if (code && code.data) {
          setBadgeInput(code.data);
          lookupBadge(code.data);
          setScanning(false);
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((t) => t.stop());
            streamRef.current = null;
          }
        }
      }, 350);
      return () => clearInterval(timer);
    }, [scanning]);

    useEffect(() => {
      return () => {
        if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      };
    }, []);

    const cardBg = isDark ? "#1F1C17" : "#FFFFFF";
    const borderCol = isDark ? "#2E2A22" : "#EFE7DA";

    return h(
      "main",
      { style: { maxWidth: "1320px", margin: "0 auto", padding: "28px 24px 60px", display: "flex", flexDirection: "column", gap: "24px" } },
      h(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "8px" } },
        h("span", { style: { fontSize: "13px", fontWeight: 800, letterSpacing: "1px", color: "#7A4E00" } }, "SCAN · CHAT"),
        h(
          "h1",
          { style: { margin: 0, fontSize: "clamp(34px,4vw,52px)", lineHeight: 1, letterSpacing: "-1.6px", fontWeight: 800 } },
          "Scan a worker’s ",
          h("span", { style: { fontFamily: "'Instrument Serif',serif", fontStyle: "italic", fontWeight: 400 } }, "badge, then chat.")
        ),
        h("p", { style: { margin: 0, fontSize: "16px", color: isDark ? "#CFC6B8" : "#4A443A", maxWidth: "720px", lineHeight: 1.5 } }, "Point your camera at a Kaamzo gate-pass or type the Worker ID to verify Aadhaar status and chat directly.")
      ),
      h(
        "div",
        { style: { display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "stretch" } },
        h(
          "section",
          { style: { flex: "1 1 420px", minWidth: 0, borderRadius: "32px", background: "#1C1913", color: "#FBF8F2", padding: "24px", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" } },
          h("span", { style: { alignSelf: "flex-start", fontSize: "12px", fontWeight: 800, letterSpacing: "0.8px", color: "#F3C969" } }, "SCAN WORKER BADGE"),
          h(
            "div",
            { style: { position: "relative", width: "260px", height: "260px", borderRadius: "28px", background: "#2E2A22", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" } },
            scanning
              ? h("video", { ref: videoRef, autoPlay: true, playsInline: true, muted: true, style: { width: "100%", height: "100%", objectFit: "cover" } })
              : h(SvgIcon, { path: ICON_PATHS.qr, size: 110, color: "#6F685D", strokeWidth: 1.4 }),
            h("span", { style: { position: "absolute", inset: "20px", border: "4px dashed #F5A524", borderRadius: "20px", pointerEvents: "none" } })
          ),
          h("button", { type: "button", onClick: startQrScan, style: { height: "44px", padding: "0 20px", borderRadius: "999px", border: 0, background: "#F5A524", color: "#1C1913", fontWeight: 800 } }, scanning ? "Scanning…" : "Start Camera QR Scan"),
          h(
            "div",
            { style: { display: "flex", width: "100%", gap: "8px" } },
            h("input", { type: "text", value: badgeInput, onChange: (e) => setBadgeInput(e.target.value), placeholder: "Or enter Worker ID / Name / Phone", style: { flex: 1, height: "44px", borderRadius: "12px", border: "1px solid #3A342C", background: "#2A241B", color: "#FBF8F2", padding: "0 12px" } }),
            h("button", { type: "button", onClick: () => lookupBadge(), style: { height: "44px", padding: "0 16px", borderRadius: "12px", border: 0, background: "#FBF8F2", color: "#1C1913", fontWeight: 800 } }, "Verify")
          )
        ),
        h(
          "section",
          { style: { flex: "1 1 420px", minWidth: 0, borderRadius: "32px", background: cardBg, border: "1px solid " + borderCol, padding: "24px", display: "flex", flexDirection: "column", gap: "16px" } },
          h("b", { style: { fontSize: "20px" } }, "Verified Worker Result & Direct Chat"),
          matchedWorker
            ? h(
                "div",
                { style: { display: "flex", flexDirection: "column", gap: "14px" } },
                h("div", { style: { padding: "16px", borderRadius: "20px", background: "#E3F4E8", color: "#1D6B36" } }, h("b", { style: { fontSize: "18px" } }, `${matchedWorker.name} · ${matchedWorker.primaryTrade}`), h("div", { style: { fontSize: "13px" } }, `ID: ${matchedWorker.id} · Aadhaar KYC: ${matchedWorker.isVerified ? "Approved" : "Pending"}`)),
                h("button", { type: "button", onClick: () => app.openGlobalChat?.(null, { name: matchedWorker.name, phone: matchedWorker.phone, role: "worker" }, "customer"), style: { height: "48px", borderRadius: "999px", border: 0, background: "#1C1913", color: "#FBF8F2", fontWeight: 800 } }, "Open Live Chat with " + matchedWorker.name)
              )
            : h("span", { style: { color: isDark ? "#A49B8C" : "#6F685D", fontSize: "15px" } }, "Scan any worker's Kaamzo Gate Pass QR or enter their Worker ID to inspect credentials and open encrypted direct chat.")
        )
      )
    );
  }

  KZ.views.CustomerPortal = function CustomerPortal({ path, openOtpModal }) {
    let body = null;
    if (path === "/customer/my-bookings") body = h(CustomerBookingsView, null);
    else if (path === "/customer/support") body = h(CustomerSupportView, null);
    else if (path === "/customer/post-a-job") body = h(CustomerPostJobView, null);
    else if (path === "/customer/live-eta-attendance" || path === "/customer/work") body = h(CustomerLiveEtaView, null);
    else if (path === "/customer/crew-and-rebook") body = h(CustomerCrewView, null);
    else if (path === "/customer/sos-check-in") body = h(CustomerSosView, null);
    else if (path === "/customer/map-and-radar") body = h(CustomerMapRadarView, null);
    else if (path === "/customer/scan-badge-and-chat") body = h(CustomerScanChatView, null);
    else body = h(CustomerFindView, null);

    return h(CustomerShell, { path, openOtpModal }, body);
  };
})();


/* Part 4 — Worker Portal (/worker/*), Dedicated /jobs Feed & Mobile Layouts */
(function () {
  "use strict";
  const KZ = window.__KZ_REDESIGN__;
  const U = KZ.utils;
  const C = KZ.components;
  const {
    h,
    useApp,
    useState,
    useEffect,
    useMemo,
    ICON_PATHS,
    LUDHIANA_AREAS,
    normalizeTrade,
    getTradeMeta,
    formatInr,
    milestoneBonusPct,
    nextMilestoneTarget,
    isJobWithin10Km,
    getJobDistanceKm,
    navigate,
  } = U;
  const { SvgIcon, TopUtilityBar, KaamzoFooter, JobProgressPipeline } = C;

  // Check if worker is blocked by Admin or under 24-hour offline penalty after rejecting an accepted job
  function getWorkerRestriction(worker) {
    if (!worker || !worker.id) {
      return { isBlocked: false, isPenalized: false, penaltyUntil: 0, remainingText: "" };
    }
    let blockedFlag = Boolean(worker.isBlocked || worker.isBanned);
    let localPenalty = 0;
    try {
      const b = localStorage.getItem("kz_blocked_worker_" + worker.id);
      if (b === "1") blockedFlag = true;
      else if (b === "0") blockedFlag = false;
      localPenalty = Number(localStorage.getItem("kz_penalty_until_" + worker.id) || 0);
    } catch (_) {}
    const penaltyUntil = Math.max(Number(worker.offlinePenaltyUntil || 0), localPenalty);
    const diffMs = penaltyUntil - Date.now();
    const isPenalized = diffMs > 0;
    let remainingText = "";
    if (isPenalized) {
      const hrs = Math.floor(diffMs / 3600000);
      const mins = Math.max(1, Math.ceil((diffMs % 3600000) / 60000));
      remainingText = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
    }
    return { isBlocked: blockedFlag, isPenalized, penaltyUntil, remainingText };
  }

  async function applyWorker24hPenalty(worker, app) {
    if (!worker || !worker.id) return;
    const penaltyUntil = Date.now() + 24 * 60 * 60 * 1000;
    worker.offlinePenaltyUntil = penaltyUntil;
    worker.isOnline = false;
    try {
      localStorage.setItem("kz_penalty_until_" + worker.id, String(penaltyUntil));
    } catch (_) {}
    if (app.currentWorker?.isOnline) {
      app.toggleWorkerStatus?.();
    }
    app.updateWorkerProfile?.({ isOnline: false, offlinePenaltyUntil: penaltyUntil });
    try {
      await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "upsert",
          collection: "workers",
          id: worker.id,
          data: Object.assign({}, worker, {
            id: worker.id,
            isOnline: false,
            offlinePenaltyUntil: penaltyUntil,
            syncedAt: new Date().toISOString(),
          }),
        }),
      });
    } catch (_) {}
  }

  // Deterministic 21x21 QR Code SVG generator for Start Job QR & End Job QR
  function renderDeterministicQrSvg(seedText, accentCol) {
    const str = String(seedText || "KAAMZO-QR");
    let hash = 2166136261;
    for (let i = 0; i < str.length; i++) {
      hash ^= str.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    const size = 21;
    const rects = [];
    const isFinder = (r, c) =>
      (r < 7 && c < 7) || (r < 7 && c >= size - 7) || (r >= size - 7 && c < 7);
    const finderBit = (r, c) => {
      const lr = r < 7 ? r : r >= size - 7 ? r - (size - 7) : r;
      const lc = c < 7 ? c : c >= size - 7 ? c - (size - 7) : c;
      if (lr === 0 || lr === 6 || lc === 0 || lc === 6) return true;
      if (lr >= 2 && lr <= 4 && lc >= 2 && lc <= 4) return true;
      return false;
    };
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        let on = false;
        if (isFinder(r, c)) {
          on = finderBit(r, c);
        } else if (
          (r === 7 && (c < 8 || c >= size - 8)) ||
          (r === size - 8 && c < 8) ||
          (c === 7 && (r < 8 || r >= size - 8)) ||
          (c === size - 8 && r < 8)
        ) {
          on = false;
        } else {
          const bitSeed = Math.imul(hash ^ (r * 31 + c * 97), 2654435761) >>> 0;
          on = (bitSeed & 3) !== 0;
        }
        if (on) {
          rects.push(
            h("rect", {
              key: r + "_" + c,
              x: 8 + c * 6,
              y: 8 + r * 6,
              width: 5.5,
              height: 5.5,
              rx: 1.2,
              fill: isFinder(r, c) ? accentCol || "#1C1913" : "#1C1913",
            })
          );
        }
      }
    }
    return h(
      "svg",
      {
        viewBox: "0 0 142 142",
        style: {
          width: "136px",
          height: "136px",
          borderRadius: "16px",
          background: "#FFFFFF",
          padding: "4px",
          border: "2px solid " + (accentCol || "#1C1913"),
          flexShrink: 0,
        },
        "aria-label": "Verification QR Code",
      },
      rects
    );
  }

  const WORKER_SUBNAV = [
    { path: "/worker", label: "Work" },
    { path: "/jobs", label: "Jobs" },
    { path: "/worker/account-and-pay", label: "Account & pay" },
    { path: "/worker/support", label: "Support" },
    { path: "/worker/live-job", label: "Live job" },
    { path: "/worker/khata-and-gate-pass", label: "Khata & pass" },
    { path: "/worker/bonus-ladder-calculator", label: "Bonus ladder" },
  ];

  function WorkerShell({ path, children }) {
    const app = useApp();
    const isDark = app.isDarkMode;
    const worker = app.currentWorker;
    const jobs = app.jobs || [];
    const displayName = worker?.name || "Worker Account";
    const tradeName = worker ? getTradeMeta(worker.primaryTrade).name : "Electrician";
    const areaName = worker?.location?.area || app.currentCity?.name || "Ludhiana";
    const restr = getWorkerRestriction(worker);
    const isOnline = Boolean(worker && worker.isOnline && !restr.isBlocked && !restr.isPenalized);
    const walletBal = worker?.walletBalance || 0;

    // Active uncompleted job locks the worker onto /worker/live-job until Start QR + End QR are completed (or job is rejected/cancelled)
    const lockedActiveJob = useMemo(() => {
      if (!worker) return null;
      return jobs.find(
        (j) =>
          (j.assignedWorkerId === worker.id || j.assignedWorkerName === worker.name) &&
          ["accepted", "approved", "in_progress"].includes(j.status)
      );
    }, [jobs, worker]);

    // Auto-redirect to /worker/live-job whenever worker has an active uncompleted job
    useEffect(() => {
      if (lockedActiveJob && path !== "/worker/live-job" && path !== "/worker/work") {
        navigate("/worker/live-job", { role: "worker" });
      }
    }, [lockedActiveJob?.id, lockedActiveJob?.status, path]);

    // Ensure penalized or blocked worker is forced offline
    useEffect(() => {
      if (worker && worker.isOnline && (restr.isBlocked || restr.isPenalized)) {
        worker.isOnline = false;
        app.toggleWorkerStatus?.();
      }
    }, [worker?.id, worker?.isOnline, restr.isBlocked, restr.isPenalized]);

    const guardedWorkerNavigate = (targetPath, opts) => {
      if (lockedActiveJob && targetPath !== "/worker/live-job" && targetPath !== "/worker/work") {
        app.showNotification?.(
          "🔒 Active job in progress! Complete Start QR & End QR (or cancel the job below) before leaving this page."
        );
        if (path !== "/worker/live-job") {
          navigate("/worker/live-job", { role: "worker" });
        }
        return;
      }
      navigate(targetPath, opts || { role: "worker" });
    };

    const mainTabs = [
      { path: "/worker", label: "Work", match: (p) => p === "/worker" },
      { path: "/jobs", label: "Jobs", match: (p) => p === "/jobs" },
      { path: "/worker/account-and-pay", label: "Account & pay", match: (p) => p === "/worker/account-and-pay" },
      { path: "/worker/support", label: "Support", match: (p) => p === "/worker/support" },
    ];

    const quickTools = WORKER_SUBNAV.slice(4);

    return h(
      "div",
      {
        style: {
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          background: isDark ? "#14120E" : "#FBF8F2",
          color: isDark ? "#EDE6DA" : "#1C1913",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        },
      },
      !lockedActiveJob && h(TopUtilityBar, { compact: false }),

      // Sticky Worker Header
      h(
        "header",
        {
          className: "kz-app-header " + (isDark ? "kz-sticky-header" : ""),
          style: {
            position: "sticky",
            top: 0,
            zIndex: 40,
            background: isDark ? "rgba(20,18,14,0.92)" : "rgba(251,248,242,0.92)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderBottom: "1px solid " + (isDark ? "#2E2A22" : "#EFE7DA"),
          },
        },
        h(
          "div",
          {
            style: {
              maxWidth: "1320px",
              margin: "0 auto",
              padding: "12px 24px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "14px",
            },
          },
          h(
            "a",
            {
              href: "/",
              onClick: (e) => {
                e.preventDefault();
                guardedWorkerNavigate("/", { role: "select_role" });
              },
              style: {
                textDecoration: "none",
                color: isDark ? "#EDE6DA" : "#1C1913",
                fontWeight: 800,
                fontSize: "22px",
                letterSpacing: "-0.4px",
              },
            },
            "kaamzo",
            h("span", { style: { color: "#E8930C" } }, ".")
          ),
          // Worker identity pill
          h(
            "span",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "5px 14px 5px 5px",
                borderRadius: "999px",
                background: isDark ? "#1F1C17" : "#FFFFFF",
                border: "1px solid " + (isDark ? "#2E2A22" : "#EFE7DA"),
              },
            },
            worker?.photoUrl || worker?.avatar
              ? h("img", { src: worker.photoUrl || worker.avatar, alt: displayName, style: { width: "36px", height: "36px", borderRadius: "50%", objectFit: "cover" } })
              : h(
                  "span",
                  {
                    style: {
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      background: "#DCEBFF",
                      color: "#123A6B",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                    },
                  },
                  displayName.slice(0, 1).toUpperCase()
                ),
            h(
              "span",
              { style: { display: "flex", flexDirection: "column" } },
              h(
                "span",
                { style: { fontSize: "13px", fontWeight: 800 } },
                displayName + " ",
                h(
                  "span",
                  {
                    style: {
                      padding: "2px 6px",
                      borderRadius: "999px",
                      background: worker?.isVerified ? "#FFF0BF" : "#FFE1E1",
                      color: worker?.isVerified ? "#6B4600" : "#8A1C1C",
                      fontSize: "10px",
                    },
                  },
                  worker?.isVerified ? "UIDAI VERIFIED" : worker ? "KYC PENDING" : "GUEST"
                )
              ),
              h("span", { style: { fontSize: "11px", fontWeight: 700, color: isDark ? "#A49B8C" : "#6F685D" } }, `${tradeName} · ${areaName}`)
            )
          ),

          // Main 4 Worker tabs
          h(
            "nav",
            {
              "aria-label": "Worker",
              className: "kz-tabs " + (isDark ? "kz-tab-track" : ""),
              style: {
                display: "flex",
                gap: "4px",
                padding: "5px",
                borderRadius: "999px",
                background: isDark ? "#1F1C17" : "#FFFFFF",
                border: "1px solid " + (isDark ? "#2E2A22" : "#EFE7DA"),
              },
            },
            mainTabs.map((t) => {
              const active = t.match(path);
              return h(
                "button",
                {
                  key: t.path,
                  type: "button",
                  "aria-current": active ? "page" : undefined,
                  onClick: () => guardedWorkerNavigate(t.path, { role: "worker" }),
                  style: {
                    padding: "10px 16px",
                    borderRadius: "999px",
                    border: 0,
                    background: active ? (isDark ? "#F5A524" : "#1C1913") : "transparent",
                    color: active ? (isDark ? "#14120E" : "#FBF8F2") : isDark ? "#EDE6DA" : "#3D3830",
                    fontSize: "14px",
                    fontWeight: 700,
                    opacity: lockedActiveJob ? 0.55 : 1,
                    cursor: lockedActiveJob ? "not-allowed" : "pointer",
                  },
                },
                (lockedActiveJob ? "🔒 " : "") + t.label
              );
            })
          ),

          // Right Online Switch + Wallet
          h(
            "div",
            { style: { marginLeft: "auto", display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" } },
            h(
              "button",
              {
                type: "button",
                role: "switch",
                "aria-checked": isOnline,
                onClick: () => {
                  if (worker) {
                    const r = getWorkerRestriction(worker);
                    if (r.isBlocked) {
                      app.showNotification?.(
                        "🚫 Account Blocked by Admin for violating Kaamzo company policy. You cannot go online."
                      );
                      return;
                    }
                    if (r.isPenalized) {
                      app.showNotification?.(
                        `⏳ 24-Hour Penalty Active: You cannot go online for 1 day after rejecting a job (${r.remainingText} remaining).`
                      );
                      return;
                    }
                    app.toggleWorkerStatus?.();
                  } else {
                    KZ.openLoginPrompt?.({
                      role: "worker",
                      headingPrefix: "Login to ",
                      headingAccent: "go online.",
                      body: "Without logging in, you cannot go online or broadcast your 10 km GPS availability. Sign in or register as a Worker to start receiving live jobs.",
                      ctaLabel: "Sign in / Register as Worker →",
                    });
                  }
                },
                style: {
                  height: "44px",
                  padding: "0 16px",
                  borderRadius: "999px",
                  border: 0,
                  background: isOnline ? "#2E9E57" : "#E5484D",
                  color: "#FFFFFF",
                  fontWeight: 800,
                  fontSize: "13px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  cursor: restr.isBlocked || restr.isPenalized ? "not-allowed" : "pointer",
                },
              },
              restr.isBlocked
                ? "🚫 Blocked by Admin"
                : restr.isPenalized
                ? `○ Offline · 24h Penalty (${restr.remainingText})`
                : isOnline
                ? "● Online · broadcasting"
                : "○ Offline"
            ),
            h(
              "button",
              {
                type: "button",
                className: "hide-sm",
                onClick: () => guardedWorkerNavigate("/worker/khata-and-gate-pass", { role: "worker" }),
                style: {
                  height: "44px",
                  padding: "0 16px",
                  borderRadius: "999px",
                  border: 0,
                  background: "#1C1913",
                  color: "#FBF8F2",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  fontWeight: 700,
                },
              },
              h("span", { style: { color: "#CFC6B8" } }, "Wallet"),
              h("span", { style: { color: "#F5A524", fontWeight: 800 } }, formatInr(walletBal))
            )
          )
        ),

        // Quick tools subnav bar
        h(
          "div",
          {
            style: {
              borderTop: "1px solid " + (isDark ? "#2E2A22" : "#EFE7DA"),
              background: isDark ? "#191611" : "#F4EEE3",
            },
          },
          h(
            "div",
            {
              style: {
                maxWidth: "1320px",
                margin: "0 auto",
                padding: "8px 24px",
                display: "flex",
                gap: "8px",
                overflowX: "auto",
                alignItems: "center",
              },
            },
            quickTools.map((tool) => {
              const active = path === tool.path || (tool.path === "/worker/live-job" && path === "/worker/work");
              return h(
                "button",
                {
                  key: tool.path,
                  type: "button",
                  onClick: () => guardedWorkerNavigate(tool.path, { role: "worker" }),
                  style: {
                    whiteSpace: "nowrap",
                    height: "34px",
                    padding: "0 14px",
                    borderRadius: "999px",
                    border: "1px solid " + (active ? "#1C1913" : isDark ? "#3A342C" : "#E5DCCB"),
                    background: active ? "#1C1913" : isDark ? "#1F1C17" : "#FFFFFF",
                    color: active ? "#FBF8F2" : isDark ? "#EDE6DA" : "#3D3830",
                    fontSize: "12px",
                    fontWeight: 700,
                  },
                },
                tool.label
              );
            }),
            !worker &&
              h(
                "button",
                {
                  type: "button",
                  onClick: () => navigate("/register", { registerRole: "worker" }),
                  style: {
                    marginLeft: "auto",
                    whiteSpace: "nowrap",
                    height: "34px",
                    padding: "0 14px",
                    borderRadius: "999px",
                    border: 0,
                    background: "#F5A524",
                    color: "#1C1913",
                    fontSize: "12px",
                    fontWeight: 800,
                  },
                },
                "Worker Sign In / Register →"
              )
          )
        )
      ),

      h("div", { style: { flex: 1, paddingBottom: "40px" } }, children),

      // Mobile sticky bottom tab bar
      h(
        "nav",
        {
          className: "mbar",
          "aria-label": "Worker mobile tabs",
          style: {
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 55,
            background: isDark ? "#1F1C17" : "#FFFFFF",
            borderTop: "1px solid " + (isDark ? "#2E2A22" : "#EFE7DA"),
            padding: "8px 10px",
          },
        },
        h(
          "div",
          { style: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "6px" } },
          [
            { path: "/worker", label: "Work", icon: ICON_PATHS.briefcase },
            { path: "/jobs", label: "Jobs", icon: ICON_PATHS.radar },
            { path: "/worker/khata-and-gate-pass", label: "Khata", icon: ICON_PATHS.wallet },
            { path: "/worker/bonus-ladder-calculator", label: "Bonus", icon: ICON_PATHS.award },
          ].map((m) => {
            const act = path === m.path;
            return h(
              "button",
              {
                key: m.path,
                type: "button",
                onClick: () => navigate(m.path, { role: "worker" }),
                style: {
                  border: 0,
                  borderRadius: "14px",
                  padding: "6px 4px",
                  background: act ? "#FFF0BF" : "transparent",
                  color: act ? "#6B4600" : isDark ? "#CFC6B8" : "#4A443A",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "2px",
                  fontSize: "11px",
                  fontWeight: 800,
                },
              },
              h(SvgIcon, { path: m.icon, size: 17 }),
              m.label
            );
          })
        )
      ),

      h(KaamzoFooter, null)
    );
  }

  // -------------------------------------------------------------------------
  // DEDICATED /jobs FEED (matches design-reference/jobs/index.html)
  // -------------------------------------------------------------------------
  function JobsFeedView() {
    const app = useApp();
    const isDark = app.isDarkMode;
    const worker = app.currentWorker;
    const jobs = app.jobs || [];

    const [filter, setFilter] = useState("all"); // "all" | "urgent" | "high" | "near"
    const [sortBy, setSortBy] = useState("nearest"); // "nearest" | "pay" | "newest"
    const [areaFilter, setAreaFilter] = useState("");
    const [skippedIds, setSkippedIds] = useState([]);
    const [negOpenId, setNegOpenId] = useState(null);
    const [negWage, setNegWage] = useState("");
    const [negNote, setNegNote] = useState("");
    const [acceptedModalJob, setAcceptedModalJob] = useState(null);
    const [otpInputs, setOtpInputs] = useState({});

    const workerTradeNorm = worker ? normalizeTrade(worker.primaryTrade) : null;
    const doneJobs = worker ? worker.completedJobsCount || worker.completedJobs || 0 : 0;
    const isZeroFee = Boolean(worker && (worker.isPremiumWorker || (worker.zeroCommissionJobsRemaining || 0) > 0));

    // Trade-locked & <= 10km broadcast jobs
    const matchingJobs = useMemo(() => {
      return jobs
        .filter((j) => j.status === "broadcast" || j.status === "open" || !j.assignedWorkerId)
        .filter((j) => !skippedIds.includes(j.id))
        .filter((j) => (workerTradeNorm ? normalizeTrade(j.trade) === workerTradeNorm : true))
        .filter((j) => isJobWithin10Km(j, worker))
        .map((j) => Object.assign({}, j, { _distKm: getJobDistanceKm(j, worker) }))
        .filter((j) => {
          if (areaFilter && String(j.area || j.locationAddress || "").toLowerCase().indexOf(areaFilter.toLowerCase()) === -1) {
            return false;
          }
          const netPay = j.workerPayout || Math.round((j.dailyWage || 850) * (j.durationDays || 1) * 0.8);
          if (filter === "urgent") return (j.durationDays || 1) <= 1 || String(j.description || "").toLowerCase().includes("urgent");
          if (filter === "high") return netPay >= 800;
          if (filter === "near") return j._distKm <= 3.0;
          return true;
        })
        .sort((a, b) => {
          if (sortBy === "pay") {
            const pa = a.workerPayout || a.dailyWage || 0;
            const pb = b.workerPayout || b.dailyWage || 0;
            return pb - pa;
          }
          if (sortBy === "newest") return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
          return a._distKm - b._distKm;
        });
    }, [jobs, skippedIds, workerTradeNorm, worker, areaFilter, filter, sortBy]);

    // Active & recently settled jobs for this worker
    const activeWorkerJobs = useMemo(() => {
      if (!worker) return [];
      return jobs.filter(
        (j) =>
          (j.assignedWorkerId === worker.id || j.assignedWorkerName === worker.name) &&
          ["accepted", "approved", "in_progress", "completed_pending_payment", "paid_and_closed"].includes(j.status)
      );
    }, [jobs, worker]);

    // Heatmap area counts across open Ludhiana broadcasts
    const heatmapAreas = useMemo(() => {
      return LUDHIANA_AREAS.slice(0, 9).map((a) => {
        const count = jobs.filter(
          (j) =>
            j.status === "broadcast" &&
            (normalizeTrade(j.trade) === workerTradeNorm || !workerTradeNorm) &&
            String(j.area || j.locationAddress || "").toLowerCase().includes(a.name.toLowerCase())
        ).length;
        const lvl = count >= 3 ? { bg: "#FFE1D2", fg: "#7A2E0E", lbl: "Fastest" } : count === 2 ? { bg: "#FFF0BF", fg: "#6B4600", lbl: "Busy" } : count === 1 ? { bg: "#E3F4E8", fg: "#1D6B36", lbl: "Steady" } : { bg: isDark ? "#27231C" : "#F4EEE3", fg: isDark ? "#CFC6B8" : "#6F685D", lbl: "Quiet" };
        return Object.assign({}, a, { count, lvl });
      });
    }, [jobs, workerTradeNorm, isDark]);

    const handleAccept = (job) => {
      if (worker) {
        const r = getWorkerRestriction(worker);
        if (r.isBlocked) {
          app.showNotification?.("🚫 Your account is blocked by Admin for policy violation.");
          return;
        }
        if (r.isPenalized) {
          app.showNotification?.(`⏳ 24-Hour Offline Penalty active (${r.remainingText} remaining).`);
          return;
        }
      }
      app.acceptJobByWorker?.(job.id);
      if (worker && worker.isVerified) {
        KZ.notifyJobAcceptedForCustomer?.(job.id);
        navigate("/worker/live-job", { role: "worker" });
      }
    };

    const submitProposal = (job) => {
      const w = Number(negWage);
      if (!w || w < 300) {
        app.showNotification?.("Enter a valid daily wage (₹300+).");
        return;
      }
      app.proposeJobWage?.(job.id, w, "worker", worker?.name || "Worker", negNote.trim() || "Worker counter-offer");
      setNegOpenId(null);
      setNegWage("");
      setNegNote("");
    };

    const ladderProgressPct = Math.min(100, Math.round(((doneJobs % 10) / 10) * 100));
    const cardBg = isDark ? "#1F1C17" : "#FFFFFF";
    const borderCol = isDark ? "#2E2A22" : "#EFE7DA";

    return h(
      "div",
      null,
      // HERO (warm cream sunset glow + animated 10 km radar ring)
      h(
        "section",
        {
          style: {
            position: "relative",
            overflow: "hidden",
            color: "#1C1913",
            background: "linear-gradient(180deg, #F6E2CF 0%, #FBE9D4 45%, #FBF8F2 100%)",
          },
        },
        h("div", {
          "aria-hidden": "true",
          style: {
            position: "absolute",
            right: "-120px",
            top: "-160px",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245,165,36,.28), rgba(245,165,36,0) 65%)",
          },
        }),
        h(
          "div",
          {
            className: "kz-jobs-wrap",
            style: {
              maxWidth: "1320px",
              margin: "0 auto",
              padding: "48px 24px 40px",
              position: "relative",
              display: "flex",
              flexWrap: "wrap",
              gap: "32px",
              alignItems: "center",
              justifyContent: "space-between",
            },
          },
          h(
            "div",
            { style: { maxWidth: "720px", display: "flex", flexDirection: "column", gap: "14px" } },
            h(
              "span",
              {
                style: {
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: 800,
                  background: "#FFFFFF",
                  border: "1px solid #F1D9A9",
                  color: "#7A4E00",
                  width: "max-content",
                },
              },
              h("span", { style: { width: "8px", height: "8px", borderRadius: "50%", background: "#2E9E57" } }),
              "Hyperlocal 10 km GPS radar active"
            ),
            h(
              "h1",
              { style: { margin: 0, fontSize: "clamp(36px,5vw,64px)", lineHeight: 1, letterSpacing: "-1.8px", fontWeight: 800 } },
              "Jobs near you, ",
              h("span", { className: "kz-serif" }, "paid before"),
              " you start."
            ),
            h(
              "p",
              { style: { margin: 0, fontSize: "17px", lineHeight: 1.55, color: "#4A443A", maxWidth: "600px" } },
              `Live jobs within your 10 km neighbourhood in ${app.currentCity?.name || "Ludhiana"}. Every job is prepaid or backed by escrow. Your ${isZeroFee ? "100%" : "80%"} payout reaches your UPI once started and completed.`
            ),
            h(
              "div",
              { style: { display: "flex", flexWrap: "wrap", gap: "14px", fontSize: "13px", fontWeight: 700, color: "#4A443A" } },
              h("span", null, "100% Escrow backed"),
              h("span", null, isZeroFee ? "100% Zero-Fee Active" : "Keep 80% of every job"),
              h("span", null, "≤ 10 km strict GPS radius")
            )
          ),

          // Live Radar Card
          h(
            "div",
            {
              style: {
                background: "#FFFFFF",
                border: "1px solid #EFE7DA",
                borderRadius: "28px",
                boxShadow: "0 14px 34px rgba(90,60,20,0.06)",
                padding: "20px",
                display: "flex",
                gap: "18px",
                alignItems: "center",
              },
            },
            h(
              "div",
              { className: "kz-radar-ring", "aria-hidden": "true" },
              h("div", { className: "ping" }),
              h("div", { className: "dot" }),
              h("span", { className: "rj", style: { left: "68%", top: "24%" } }),
              h("span", { className: "rj", style: { left: "22%", top: "62%" } }),
              h("span", { className: "rj", style: { left: "74%", top: "70%" } })
            ),
            h(
              "div",
              { style: { display: "flex", flexDirection: "column", gap: "8px" } },
              h("span", { style: { fontSize: "12px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "#7A4E00" } }, "Your live pin"),
              h("strong", { style: { fontSize: "18px" } }, (worker?.location?.area || "Rajguru Nagar") + `, ${app.currentCity?.name || "Ludhiana"}`),
              h("span", { style: { fontSize: "13px", color: "#6F685D", fontWeight: 600 } }, `Accuracy ±${worker?.gpsLocation?.accuracyMeters || 96} m · Strict radius ≤ 10 km`),
              h(
                "button",
                {
                  type: "button",
                  onClick: () => app.refreshWorkerGpsLocation?.(),
                  style: {
                    height: "40px",
                    padding: "0 16px",
                    borderRadius: "999px",
                    border: "1px solid #EFE7DA",
                    background: "#FFFFFF",
                    fontWeight: 700,
                    fontSize: "13px",
                    width: "max-content",
                    color: "#1C1913",
                  },
                },
                "Calibrate GPS"
              )
            )
          )
        )
      ),

      // BODY 2-COL GRID (.kz-jobs-grid)
      h(
        "main",
        { className: "kz-jobs-wrap", style: { maxWidth: "1320px", margin: "0 auto", padding: "28px 24px 80px" } },
        h(
          "div",
          { className: "kz-jobs-grid" },
          // LEFT FEED
          h(
            "section",
            { style: { display: "flex", flexDirection: "column", gap: "18px" } },
            h(
              "div",
              { style: { display: "flex", flexWrap: "wrap", alignItems: "end", justifyContent: "space-between", gap: "12px" } },
              h(
                "div",
                null,
                h(
                  "span",
                  { style: { fontSize: "12px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "#7A4E00" } },
                  worker ? `Your registered trade · ${worker.primaryTrade} only` : "Live broadcasts across Ludhiana"
                ),
                h("h2", { style: { margin: "6px 0 0", fontSize: "30px", letterSpacing: "-0.8px" } }, `${matchingJobs.length} job${matchingJobs.length === 1 ? "" : "s"} waiting nearby`)
              ),
              h(
                "select",
                {
                  value: sortBy,
                  onChange: (e) => setSortBy(e.target.value),
                  "aria-label": "Sort jobs",
                  style: {
                    height: "42px",
                    padding: "0 14px",
                    borderRadius: "999px",
                    border: "1px solid " + borderCol,
                    background: cardBg,
                    color: isDark ? "#EDE6DA" : "#1C1913",
                    fontWeight: 700,
                    fontSize: "13px",
                  },
                },
                h("option", { value: "nearest" }, "Sort: Nearest first"),
                h("option", { value: "pay" }, "Sort: Highest payout"),
                h("option", { value: "newest" }, "Sort: Newest")
              )
            ),

            // Filter Chips
            h(
              "div",
              { style: { display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" } },
              [
                { id: "all", label: "All nearby" },
                { id: "urgent", label: "Urgent / Today" },
                { id: "high", label: "High pay (₹800+)" },
                { id: "near", label: "≤ 3 km close" },
              ].map((ch) =>
                h(
                  "button",
                  {
                    key: ch.id,
                    type: "button",
                    onClick: () => setFilter(ch.id),
                    style: {
                      height: "40px",
                      padding: "0 16px",
                      borderRadius: "999px",
                      border: "1px solid " + (filter === ch.id ? "#1C1913" : borderCol),
                      background: filter === ch.id ? "#1C1913" : cardBg,
                      color: filter === ch.id ? "#FBF8F2" : isDark ? "#EDE6DA" : "#3D3830",
                      fontWeight: 700,
                      fontSize: "13px",
                    },
                  },
                  ch.label
                )
              ),
              areaFilter &&
                h(
                  "span",
                  { style: { display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", borderRadius: "999px", background: "#FFF0BF", color: "#6B4600", fontSize: "12px", fontWeight: 800 } },
                  "Area: " + areaFilter,
                  h("button", { type: "button", onClick: () => setAreaFilter(""), style: { border: 0, background: "transparent", fontWeight: 800 } }, "✕")
                )
            ),

            // Job Feed Cards
            matchingJobs.length === 0
              ? h(
                  "div",
                  { style: { background: cardBg, border: "1px solid " + borderCol, borderRadius: "28px", padding: "40px", textAlign: "center" } },
                  h("h3", { style: { margin: "0 0 6px", fontSize: "22px", fontWeight: 800 } }, "No jobs match right now"),
                  h("p", { style: { margin: 0, color: isDark ? "#A49B8C" : "#6F685D" } }, `Stay online — we’ll alert you the second a new ${worker?.primaryTrade || "matching"} job is posted within 10 km.`)
                )
              : matchingJobs.map((j) => {
                  const tm = getTradeMeta(j.trade);
                  const days = j.durationDays || 1;
                  const netTake = isZeroFee ? Math.round((j.dailyWage || 850) * days) : j.workerPayout || Math.round((j.dailyWage || 850) * days * 0.8);
                  const interested = Array.isArray(j.interestedWorkerIds) && worker && j.interestedWorkerIds.includes(worker.id);
                  return h(
                    "article",
                    {
                      key: j.id,
                      style: {
                        background: cardBg,
                        border: "1px solid " + borderCol,
                        borderRadius: "28px",
                        padding: "24px",
                        boxShadow: "0 14px 34px rgba(90,60,20,0.06)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                      },
                    },
                    h(
                      "div",
                      { style: { display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" } },
                      h(
                        "div",
                        { style: { flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "8px" } },
                        h(
                          "div",
                          { style: { display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" } },
                          h("span", { style: { padding: "5px 12px", borderRadius: "999px", background: tm.bg, color: tm.fg, fontSize: "12px", fontWeight: 800 } }, tm.name),
                          h("span", { style: { padding: "5px 10px", borderRadius: "999px", background: "#E3F4E8", color: "#1D6B36", fontSize: "12px", fontWeight: 800 } }, `${j._distKm} km away`),
                          days > 1 && h("span", { style: { padding: "5px 10px", borderRadius: "999px", background: isDark ? "#27231C" : "#F4EEE3", fontSize: "12px", fontWeight: 700 } }, `${days} days`)
                        ),
                        h("h3", { style: { margin: 0, fontSize: "22px", fontWeight: 800 } }, j.title),
                        h("p", { style: { margin: 0, fontSize: "14px", color: isDark ? "#CFC6B8" : "#4A443A", lineHeight: 1.5 } }, j.description),
                        h("div", { style: { fontSize: "13px", fontWeight: 700, color: isDark ? "#A49B8C" : "#6F685D" } }, `${j.customerName} · ${j.locationAddress || j.area}`)
                      ),
                      h(
                        "div",
                        { className: "kz-pricebox", style: { textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px" } },
                        h("span", { className: "kz-jobs-price", style: { fontFamily: "'Instrument Serif', serif", fontSize: "52px", lineHeight: 0.95, fontWeight: 400 } }, formatInr(netTake)),
                        h("span", { style: { fontSize: "12px", fontWeight: 800, color: "#1D6B36" } }, isZeroFee ? "100% yours (Zero-fee pass)" : "Your net payout (80%)")
                      )
                    ),

                    // Action Buttons
                    h(
                      "div",
                      { className: "kz-actions", style: { display: "flex", flexWrap: "wrap", gap: "8px", paddingTop: "8px", borderTop: "1px solid " + borderCol } },
                      h(
                        "button",
                        {
                          type: "button",
                          onClick: () => app.speak?.(`${j.trade} job: ${j.title}. Area ${j.area || "Ludhiana"}. Payout ${netTake} rupees.`, "hi-IN"),
                          style: { height: "42px", padding: "0 14px", borderRadius: "999px", border: "1px solid " + borderCol, background: "transparent", color: isDark ? "#EDE6DA" : "#1C1913", fontWeight: 700, fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" },
                        },
                        h(SvgIcon, { path: ICON_PATHS.speaker, size: 15 }),
                        "Listen"
                      ),
                      h(
                        "button",
                        {
                          type: "button",
                          disabled: interested,
                          onClick: () => app.expressWorkerInterest?.(j.id, worker?.id),
                          style: { height: "42px", padding: "0 14px", borderRadius: "999px", border: "1px solid " + borderCol, background: interested ? "#E3F4E8" : "transparent", color: interested ? "#1D6B36" : isDark ? "#EDE6DA" : "#1C1913", fontWeight: 700, fontSize: "13px" },
                        },
                        interested ? "✓ Interested" : "Interested"
                      ),
                      h(
                        "button",
                        {
                          type: "button",
                          onClick: () => {
                            if (negOpenId === j.id) setNegOpenId(null);
                            else {
                              setNegOpenId(j.id);
                              setNegWage(String(Math.round((j.workerPayout || j.dailyWage || 850) / days) + 100));
                            }
                          },
                          style: { height: "42px", padding: "0 14px", borderRadius: "999px", border: "1px solid " + borderCol, background: "transparent", color: isDark ? "#EDE6DA" : "#1C1913", fontWeight: 700, fontSize: "13px" },
                        },
                        "Negotiate"
                      ),
                      h(
                        "button",
                        {
                          type: "button",
                          onClick: () => setSkippedIds((prev) => prev.concat([j.id])),
                          style: { height: "42px", padding: "0 14px", borderRadius: "999px", border: "1px solid " + borderCol, background: "transparent", color: isDark ? "#A49B8C" : "#6F685D", fontWeight: 700, fontSize: "13px" },
                        },
                        "Skip"
                      ),
                      h(
                        "button",
                        {
                          type: "button",
                          className: "kz-btn-accept",
                          onClick: () => handleAccept(j),
                          style: { marginLeft: "auto", height: "44px", padding: "0 22px", borderRadius: "999px", border: 0, background: "#F5A524", color: "#1C1913", fontWeight: 800, fontSize: "14px" },
                        },
                        "1-Tap Accept →"
                      )
                    ),

                    // Inline Negotiate Panel
                    negOpenId === j.id &&
                      h(
                        "div",
                        { style: { padding: "14px", borderRadius: "18px", background: isDark ? "#27231C" : "#FFF7E3", display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" } },
                        h("input", { type: "number", min: 300, value: negWage, onChange: (e) => setNegWage(e.target.value), placeholder: "Proposed daily ₹", style: { width: "140px", height: "40px", borderRadius: "12px", border: "1px solid #E5DCCB", padding: "0 12px", fontWeight: 800 } }),
                        h("input", { type: "text", value: negNote, onChange: (e) => setNegNote(e.target.value), placeholder: "Note to employer (e.g. tools + helper included)", style: { flex: "1 1 200px", height: "40px", borderRadius: "12px", border: "1px solid #E5DCCB", padding: "0 12px" } }),
                        h("button", { type: "button", onClick: () => submitProposal(j), style: { height: "40px", padding: "0 18px", borderRadius: "999px", border: 0, background: "#1C1913", color: "#FBF8F2", fontWeight: 800, fontSize: "13px" } }, "Send Proposal")
                      )
                  );
                })
          ),

          // RIGHT STICKY SIDEBAR
          h(
            "aside",
            { style: { display: "flex", flexDirection: "column", gap: "18px", position: "sticky", top: "96px" } },
            // Active work card
            h(
              "section",
              { style: { background: cardBg, border: "1px solid " + borderCol, borderRadius: "28px", padding: "22px", display: "flex", flexDirection: "column", gap: "12px" } },
              h(
                "div",
                { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } },
                h("h3", { style: { margin: 0, fontSize: "18px" } }, "Active work"),
                h("span", { style: { padding: "5px 10px", borderRadius: "999px", background: isDark ? "#27231C" : "#F7F2EA", fontSize: "12px", fontWeight: 800 } }, activeWorkerJobs.length + " in progress")
              ),
              activeWorkerJobs.length === 0
                ? h("p", { style: { margin: 0, color: isDark ? "#A49B8C" : "#6F685D", fontSize: "14px" } }, "No active jobs. Accept one from the list and it will show up here with its start code.")
                : activeWorkerJobs.map((aj) =>
                    h(
                      "div",
                      { key: aj.id, style: { padding: "14px", borderRadius: "18px", background: isDark ? "#27231C" : "#FBF8F2", display: "flex", flexDirection: "column", gap: "8px" } },
                      h("b", { style: { fontSize: "15px" } }, aj.title),
                      h("span", { style: { fontSize: "12px", color: isDark ? "#A49B8C" : "#6F685D" } }, aj.locationAddress || aj.area),
                      h(JobProgressPipeline, { job: aj, isDark }),
                      (aj.status === "accepted" || aj.status === "approved") &&
                        h(
                          "div",
                          { style: { display: "flex", gap: "6px" } },
                          h("input", {
                            type: "text",
                            maxLength: 4,
                            placeholder: "4-digit OTP",
                            value: otpInputs[aj.id] || "",
                            onChange: (e) => setOtpInputs((m) => Object.assign({}, m, { [aj.id]: e.target.value })),
                            style: { width: "110px", height: "38px", textAlign: "center", borderRadius: "10px", border: "1px solid #E5DCCB", fontWeight: 800, letterSpacing: "2px" },
                          }),
                          h(
                            "button",
                            {
                              type: "button",
                              onClick: () => app.startJobWithOtp?.(aj.id, otpInputs[aj.id] || ""),
                              style: { flex: 1, height: "38px", borderRadius: "10px", border: 0, background: "#2E9E57", color: "#FFFFFF", fontWeight: 800, fontSize: "12px" },
                            },
                            "Start Job"
                          )
                        ),
                      ["accepted", "approved", "in_progress"].includes(aj.status) &&
                        h(
                          "button",
                          {
                            type: "button",
                            onClick: () => KZ.openCompleteJobModal?.(aj),
                            style: { height: "38px", borderRadius: "999px", border: 0, background: aj.status === "in_progress" ? "#F5A524" : "#1C1913", color: aj.status === "in_progress" ? "#1C1913" : "#FBF8F2", fontWeight: 800, fontSize: "12px", cursor: "pointer" },
                          },
                          "Mark Completed · Enter UPI"
                        ),
                      aj.status === "completed_pending_payment" &&
                        h(
                          "div",
                          { style: { padding: "8px 10px", borderRadius: "10px", background: "#FFF0BF", color: "#6B4600", fontSize: "11px", fontWeight: 800 } },
                          `Awaiting Customer Razorpay Pay (${aj.assignedWorkerUpi || worker?.upiId || "UPI saved"})`
                        ),
                      aj.status === "paid_and_closed" &&
                        h(
                          "div",
                          { style: { padding: "8px 10px", borderRadius: "10px", background: "#E3F4E8", color: "#1D6B36", fontSize: "11px", fontWeight: 800 } },
                          `✓ Paid via Razorpay${aj.razorpayPaymentId ? " · " + aj.razorpayPaymentId : ""}`
                        )
                    )
                  )
            ),

            // 10-to-100 Cash Doubler Progress
            h(
              "section",
              { style: { borderRadius: "28px", padding: "22px", background: "#1C1913", color: "#FBF8F2" } },
              h("span", { style: { fontSize: "12px", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase", color: "#F5A524" } }, "10-to-100 cash doubler"),
              h("p", { style: { margin: "8px 0 12px", fontSize: "15px", lineHeight: 1.5, color: "#E6DED0" } }, "Finish ", h("b", { style: { color: "#fff" } }, "10 jobs"), " to unlock ", h("b", { style: { color: "#F5A524" } }, "+10%"), " on your next job. Up to +100% at 100 jobs."),
              h("div", { style: { height: "10px", borderRadius: "999px", background: "#3A342C", overflow: "hidden" } }, h("div", { style: { height: "100%", width: ladderProgressPct + "%", background: "#F5A524", borderRadius: "999px", transition: "width .4s" } })),
              h(
                "div",
                { style: { display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "12px", fontWeight: 700, color: "#CFC6B8" } },
                h("span", null, `${doneJobs}/${nextMilestoneTarget(doneJobs)} jobs (${milestoneBonusPct(doneJobs)}% tier)`),
                h("a", { href: "/worker/bonus-ladder-calculator", onClick: (e) => { e.preventDefault(); navigate("/worker/bonus-ladder-calculator", { role: "worker" }); }, style: { color: "#F5A524", textDecoration: "none" } }, "See ladder →")
              )
            ),

            // Clickable Ludhiana Live Demand Heatmap
            h(
              "section",
              { style: { background: cardBg, border: "1px solid " + borderCol, borderRadius: "28px", padding: "22px", display: "flex", flexDirection: "column", gap: "12px" } },
              h("div", null, h("h3", { style: { margin: 0, fontSize: "18px" } }, "Ludhiana live demand"), h("p", { style: { margin: "4px 0 0", fontSize: "13px", color: isDark ? "#A49B8C" : "#6F685D" } }, "Tap an area to filter its jobs.")),
              h(
                "div",
                { style: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "8px" } },
                heatmapAreas.map((a) =>
                  h(
                    "button",
                    {
                      key: a.name,
                      type: "button",
                      onClick: () => setAreaFilter(areaFilter === a.name ? "" : a.name),
                      style: {
                        borderRadius: "14px",
                        border: areaFilter === a.name ? "2px solid #1C1913" : "1px solid transparent",
                        background: a.lvl.bg,
                        color: a.lvl.fg,
                        padding: "10px 8px",
                        textAlign: "left",
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      },
                    },
                    h("b", { style: { fontSize: "11px" } }, a.name),
                    h("span", { style: { fontSize: "10px", fontWeight: 700 } }, `${a.count} jobs · ${a.lvl.lbl}`)
                  )
                )
              )
            ),

            // Help + SOS card
            h(
              "section",
              { style: { background: cardBg, border: "1px solid " + borderCol, borderRadius: "28px", padding: "18px", display: "flex", gap: "10px", flexWrap: "wrap" } },
              h("button", { type: "button", onClick: () => navigate("/worker/support", { role: "worker" }), style: { flex: 1, height: "44px", borderRadius: "999px", border: "1px solid " + borderCol, background: "transparent", color: isDark ? "#EDE6DA" : "#1C1913", fontWeight: 700 } }, "Help"),
              h("a", { href: "tel:112", style: { flex: 1, height: "44px", borderRadius: "999px", background: "#FFE1E1", color: "#9B1C1C", fontWeight: 800, textDecoration: "none", display: "inline-flex", alignItems: "center", justifyContent: "center" } }, "SOS 112")
            )
          )
        )
      ),

      // Accept confirmation modal
      acceptedModalJob &&
        h(
          "div",
          {
            style: { position: "fixed", inset: 0, background: "rgba(28,25,19,0.58)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", zIndex: 110 },
            onClick: (e) => {
              if (e.target === e.currentTarget) setAcceptedModalJob(null);
            },
          },
          h(
            "div",
            { style: { width: "100%", maxWidth: "460px", borderRadius: "28px", background: cardBg, border: "1px solid " + borderCol, padding: "26px", display: "flex", flexDirection: "column", gap: "14px" } },
            h("span", { style: { padding: "5px 12px", borderRadius: "999px", background: "#E3F4E8", color: "#1D6B36", fontSize: "12px", fontWeight: 800, width: "max-content" } }, "✓ Job accepted"),
            h("h3", { style: { margin: 0, fontSize: "24px", fontWeight: 800 } }, acceptedModalJob.title),
            h("p", { style: { margin: 0, fontSize: "14px", color: isDark ? "#CFC6B8" : "#4A443A", lineHeight: 1.5 } }, "Reach the customer’s address, ask for their 4-digit start OTP code, and enter it under Active Work to release escrow."),
            h("div", { style: { display: "flex", justifyContent: "space-between", padding: "14px", borderRadius: "16px", background: isDark ? "#27231C" : "#F7F2EA", fontWeight: 800 } }, h("span", null, "Your payout"), h("span", { style: { color: "#1D6B36" } }, formatInr(acceptedModalJob.workerPayout || Math.round((acceptedModalJob.dailyWage || 850) * (acceptedModalJob.durationDays || 1) * 0.8)))),
            h(
              "div",
              { style: { display: "flex", gap: "8px" } },
              h("a", { href: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(acceptedModalJob.locationAddress || "Ludhiana")}`, target: "_blank", rel: "noopener noreferrer", style: { flex: 1, height: "44px", borderRadius: "999px", border: "1px solid " + borderCol, display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none", fontWeight: 700, color: isDark ? "#EDE6DA" : "#1C1913" } }, "Open map"),
              h("button", { type: "button", onClick: () => setAcceptedModalJob(null), style: { flex: 1, height: "44px", borderRadius: "999px", border: 0, background: "#1C1913", color: "#FBF8F2", fontWeight: 800 } }, "Done")
            )
          )
        )
    );
  }

  // -------------------------------------------------------------------------
  // WORKER PORTAL VIEWS: /worker, /worker/live-job, /worker/account-and-pay, /worker/khata-and-gate-pass, /worker/bonus-ladder-calculator, /worker/support
  // -------------------------------------------------------------------------
  function WorkerWorkHomeView() {
    const app = useApp();
    const isDark = app.isDarkMode;
    const worker = app.currentWorker;
    const jobs = app.jobs || [];
    const [searchQ, setSearchQ] = useState("");
    const tradeNorm = worker ? normalizeTrade(worker.primaryTrade) : null;

    const matchingOpen = jobs
      .filter((j) => j.status === "broadcast" && (!tradeNorm || normalizeTrade(j.trade) === tradeNorm) && isJobWithin10Km(j, worker))
      .slice(0, 4);

    const assignedWorkerJobs = useMemo(() => {
      if (!worker) return [];
      return jobs.filter(
        (j) =>
          (j.assignedWorkerId === worker.id || j.assignedWorkerName === worker.name) &&
          ["accepted", "approved", "in_progress", "completed_pending_payment", "paid_and_closed"].includes(j.status)
      );
    }, [jobs, worker]);

    const cardBg = isDark ? "#1F1C17" : "#FFFFFF";
    const borderCol = isDark ? "#2E2A22" : "#EFE7DA";

    return h(
      "main",
      { style: { maxWidth: "1320px", margin: "0 auto", padding: "28px 24px 80px", display: "flex", flexDirection: "column", gap: "24px" } },
      // HERO
      h(
        "section",
        { style: { position: "relative", overflow: "hidden", borderRadius: "36px", background: "linear-gradient(180deg, #2A2342 0%, #5E4260 55%, #C9805A 100%)", color: "#FBF8F2", padding: "40px", display: "flex", flexWrap: "wrap", gap: "28px", alignItems: "flex-end" } },
        h(
          "div",
          { style: { position: "relative", flex: "1 1 560px", minWidth: 0, display: "flex", flexDirection: "column", gap: "16px" } },
          h("span", { style: { alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "8px", padding: "8px 14px", borderRadius: "999px", background: "rgba(255,255,255,0.14)", border: "1px solid rgba(255,255,255,0.25)", fontSize: "13px", fontWeight: 700 } }, h("span", { style: { width: "8px", height: "8px", borderRadius: "50%", background: "#5BD68A" } }), "Live hyperlocal job broadcasts"),
          h("h1", { style: { margin: 0, fontSize: "clamp(36px, 4.4vw, 60px)", lineHeight: 0.98, letterSpacing: "-1.8px", fontWeight: 800 } }, "Jobs near you, ", h("span", { style: { fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, color: "#F7C88E" } }, "paid daily.")),
          h("p", { style: { margin: 0, fontSize: "16px", lineHeight: 1.5, color: "#EBD9C8", maxWidth: "540px" } }, "Work within your 10 km neighbourhood. No middlemen. Payouts go straight to your UPI the moment work is confirmed."),
          h(
            "form",
            { onSubmit: (e) => { e.preventDefault(); navigate("/jobs", { role: "worker", searchQuery: searchQ }); }, style: { display: "flex", flexWrap: "wrap", gap: "6px", padding: "6px", borderRadius: "999px", background: "rgba(255,255,255,0.95)", maxWidth: "600px" } },
            h("input", { type: "text", value: searchQ, onChange: (e) => setSearchQ(e.target.value), placeholder: "Search nearby work in Ludhiana…", style: { flex: "1 1 200px", height: "48px", border: 0, outline: "none", background: "transparent", padding: "0 16px", fontSize: "15px", color: "#1C1913" } }),
            h("button", { type: "submit", style: { height: "48px", padding: "0 22px", borderRadius: "999px", border: 0, background: "#1C1913", color: "#FBF8F2", fontWeight: 800 } }, "Open 10 km Job Board →")
          )
        )
      ),

      // Stats Row
      h(
        "div",
        { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "14px" } },
        [
          { label: "WITHDRAWABLE WALLET", val: formatInr(worker?.walletBalance || 0), bg: "#1C1913", fg: "#FBF8F2", accent: "#F5A524", to: "/worker/khata-and-gate-pass" },
          { label: "TODAY'S EARNINGS", val: formatInr(worker?.todayEarnings || 0), bg: "#E3F4E8", fg: "#1C1913", accent: "#1D6B36", to: "/worker/account-and-pay" },
          { label: "JOBS COMPLETED", val: String(worker?.completedJobsCount || worker?.completedJobs || 0), bg: "#FFF0BF", fg: "#1C1913", accent: "#6B4600", to: "/worker/bonus-ladder-calculator" },
          { label: "MATCHING WITHIN 10 KM", val: String(matchingOpen.length), bg: "#DCEBFF", fg: "#1C1913", accent: "#123A6B", to: "/jobs" },
        ].map((s) =>
          h(
            "button",
            {
              key: s.label,
              type: "button",
              onClick: () => navigate(s.to, { role: "worker" }),
              style: { borderRadius: "28px", border: 0, background: s.bg, color: s.fg, padding: "22px", textAlign: "left", display: "flex", flexDirection: "column", gap: "6px" },
            },
            h("span", { style: { fontSize: "11px", fontWeight: 800, letterSpacing: "0.8px", color: s.accent } }, s.label),
            h("span", { style: { fontFamily: "'Instrument Serif', serif", fontSize: "48px", lineHeight: 1 } }, s.val)
          )
        )
      ),

      // Assigned & Active Jobs (Mark Completed + Live Payout Status)
      assignedWorkerJobs.length > 0 &&
        h(
          "section",
          { style: { borderRadius: "30px", background: cardBg, border: "2px solid #F5A524", padding: "24px", display: "flex", flexDirection: "column", gap: "14px" } },
          h(
            "div",
            { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" } },
            h("h2", { style: { margin: 0, fontSize: "22px", fontWeight: 800 } }, "Your Assigned & Active Jobs"),
            h("button", { type: "button", onClick: () => navigate("/worker/live-job", { role: "worker" }), style: { height: "38px", padding: "0 16px", borderRadius: "999px", border: "1px solid " + borderCol, background: "transparent", color: isDark ? "#EDE6DA" : "#1C1913", fontWeight: 700, fontSize: "12px" } }, "Open Live Job View →")
          ),
          assignedWorkerJobs.map((aj) =>
            h(
              "div",
              { key: aj.id, style: { padding: "16px", borderRadius: "20px", background: isDark ? "#27231C" : "#FBF8F2", display: "flex", flexDirection: "column", gap: "12px" } },
              h(
                "div",
                { style: { display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px" } },
                h(
                  "div",
                  null,
                  h("b", { style: { fontSize: "17px" } }, aj.title),
                  h("div", { style: { fontSize: "13px", color: isDark ? "#A49B8C" : "#6F685D" } }, `${aj.customerName || "Customer"} · ${aj.locationAddress || aj.area || "Ludhiana"}${aj.assignedWorkerUpi ? " · UPI: " + aj.assignedWorkerUpi : ""}`)
                ),
                h(
                  "div",
                  { style: { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" } },
                  h("b", { style: { fontSize: "20px" } }, formatInr(aj.workerPayout || Math.round((aj.dailyWage || 850) * (aj.durationDays || 1) * 0.8))),
                  ["accepted", "approved", "in_progress"].includes(aj.status) &&
                    h(
                      "button",
                      {
                        type: "button",
                        onClick: () => KZ.openCompleteJobModal?.(aj),
                        style: { height: "42px", padding: "0 20px", borderRadius: "999px", border: 0, background: "#2E9E57", color: "#FFFFFF", fontWeight: 800, fontSize: "13px", cursor: "pointer" },
                      },
                      "Mark Completed →"
                    ),
                  aj.status === "completed_pending_payment" &&
                    h("span", { style: { padding: "8px 14px", borderRadius: "999px", background: "#FFF0BF", color: "#6B4600", fontSize: "12px", fontWeight: 800 } }, "Awaiting Customer Razorpay Pay"),
                  aj.status === "paid_and_closed" &&
                    h("span", { style: { padding: "8px 14px", borderRadius: "999px", background: "#E3F4E8", color: "#1D6B36", fontSize: "12px", fontWeight: 800 } }, "✓ Paid & Settled via Razorpay")
                )
              ),
              h(JobProgressPipeline, { job: aj, isDark })
            )
          )
        ),

      // Quick Jobs Preview
      h(
        "section",
        { style: { borderRadius: "30px", background: cardBg, border: "1px solid " + borderCol, padding: "24px", display: "flex", flexDirection: "column", gap: "16px" } },
        h(
          "div",
          { style: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" } },
          h("h2", { style: { margin: 0, fontSize: "22px", fontWeight: 800 } }, `Latest ${worker?.primaryTrade || ""} broadcasts near you`),
          h("button", { type: "button", onClick: () => navigate("/jobs", { role: "worker" }), style: { height: "40px", padding: "0 18px", borderRadius: "999px", border: 0, background: "#F5A524", color: "#1C1913", fontWeight: 800, fontSize: "13px" } }, "See all jobs in 10 km Radar →")
        ),
        matchingOpen.length === 0
          ? h("span", { style: { color: isDark ? "#A49B8C" : "#6F685D" } }, "No open jobs in your trade right now. Keep Online status active for instant alerts.")
          : matchingOpen.map((j) =>
              h(
                "div",
                { key: j.id, style: { display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px", padding: "16px", borderRadius: "20px", background: isDark ? "#27231C" : "#FBF8F2" } },
                h("div", null, h("b", { style: { fontSize: "16px" } }, j.title), h("div", { style: { fontSize: "13px", color: isDark ? "#A49B8C" : "#6F685D" } }, `${j.area || "Ludhiana"} · ${getJobDistanceKm(j, worker)} km`)),
                h(
                  "div",
                  { style: { display: "flex", alignItems: "center", gap: "12px" } },
                  h("b", { style: { fontSize: "20px" } }, formatInr(j.workerPayout || Math.round((j.dailyWage || 850) * 0.8))),
                  h("button", { type: "button", onClick: () => { if (worker) { const r = getWorkerRestriction(worker); if (r.isBlocked) { app.showNotification?.("🚫 Your account is blocked by Admin for policy violation."); return; } if (r.isPenalized) { app.showNotification?.(`⏳ 24-Hour Offline Penalty active (${r.remainingText} remaining).`); return; } } app.acceptJobByWorker?.(j.id); if (worker && worker.isVerified) { KZ.notifyJobAcceptedForCustomer?.(j.id); navigate("/worker/live-job", { role: "worker" }); } }, style: { height: "40px", padding: "0 18px", borderRadius: "999px", border: 0, background: "#1C1913", color: "#FBF8F2", fontWeight: 800, fontSize: "13px", cursor: "pointer" } }, "1-Tap Accept")
                )
              )
            )
      )
    );
  }

  function WorkerAccountPayView() {
    const app = useApp();
    const isDark = app.isDarkMode;
    const worker = app.currentWorker;
    const [upiInput, setUpiInput] = useState(worker?.upiId || "");
    const [rateInput, setRateInput] = useState(worker?.dailyRate || 850);

    const cardBg = isDark ? "#1F1C17" : "#FFFFFF";
    const borderCol = isDark ? "#2E2A22" : "#EFE7DA";

    return h(
      "main",
      { style: { maxWidth: "1320px", margin: "0 auto", padding: "32px 24px 80px", display: "flex", flexDirection: "column", gap: "24px" } },
      h(
        "div",
        { style: { display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "16px" } },
        h(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "8px" } },
          h("h1", { style: { margin: 0, fontSize: "clamp(34px, 4vw, 54px)", lineHeight: 1, letterSpacing: "-1.6px", fontWeight: 800 } }, "Account & ", h("span", { style: { fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400 } }, "payouts")),
          h("p", { style: { margin: 0, fontSize: "16px", color: isDark ? "#CFC6B8" : "#4A443A" } }, "Verified job history, UPI earnings, client ratings and your locked primary trade.")
        ),
        h("span", { style: { height: "44px", padding: "0 18px", borderRadius: "999px", background: "#E3F4E8", color: "#1D6B36", fontWeight: 800, fontSize: "14px", display: "flex", alignItems: "center" } }, "✓ 100% settled via UPI")
      ),
      h(
        "section",
        { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "14px" } },
        h(
          "div",
          { style: { position: "relative", overflow: "hidden", borderRadius: "32px", background: "#1C1913", color: "#FBF8F2", padding: "26px", display: "flex", flexDirection: "column", gap: "10px", minHeight: "200px" } },
          h("div", { "aria-hidden": "true", style: { position: "absolute", right: "-60px", top: "-60px", width: "220px", height: "220px", borderRadius: "50%", background: "radial-gradient(circle, rgba(245,165,36,0.45) 0%, rgba(245,165,36,0) 65%)" } }),
          h("span", { style: { position: "relative", fontSize: "12px", fontWeight: 800, letterSpacing: "0.8px", color: "#F3C969" } }, "WITHDRAWABLE BALANCE"),
          h("span", { style: { position: "relative", fontFamily: "'Instrument Serif', serif", fontSize: "64px", lineHeight: 0.9 } }, formatInr(worker?.walletBalance || 0)),
          h("span", { style: { position: "relative", fontSize: "13px", color: "#CFC6B8" } }, "Paid to your UPI after every confirmed job"),
          h("button", { type: "button", onClick: () => app.withdrawWorkerEarnings?.(upiInput || worker?.upiId), style: { position: "relative", alignSelf: "flex-start", marginTop: "auto", height: "44px", padding: "0 18px", border: 0, borderRadius: "999px", background: "#F5A524", color: "#1C1913", fontWeight: 800 } }, "Withdraw to UPI now")
        ),
        h(
          "div",
          { style: { borderRadius: "32px", background: cardBg, border: "1px solid " + borderCol, padding: "24px", display: "flex", flexDirection: "column", gap: "12px" } },
          h("b", { style: { fontSize: "18px" } }, "Trade & Daily Rate Settings"),
          h("div", { style: { padding: "10px 14px", borderRadius: "14px", background: isDark ? "#27231C" : "#FFF7E3", fontSize: "13px", fontWeight: 800 } }, `Locked Trade: ${worker?.primaryTrade || "Register to set"} (Immutable)`),
          h("label", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "13px", fontWeight: 700 } }, "Daily Base Rate (₹)", h("input", { type: "number", min: 300, step: 50, value: rateInput, onChange: (e) => setRateInput(Number(e.target.value)), style: { width: "110px", height: "40px", borderRadius: "10px", border: "1px solid " + borderCol, padding: "0 10px", fontWeight: 800 } })),
          h("input", { type: "text", value: upiInput, onChange: (e) => setUpiInput(e.target.value), placeholder: "name@okaxis", style: { height: "44px", borderRadius: "12px", border: "1px solid " + borderCol, padding: "0 12px" } }),
          h(
            "button",
            {
              type: "button",
              onClick: () => {
                if (upiInput.trim()) app.updateWorkerUpi?.(upiInput.trim());
                if (rateInput >= 300) app.updateWorkerProfile?.({ dailyRate: Number(rateInput) });
                app.showNotification?.("Payout rate & UPI updated!");
              },
              style: { height: "44px", borderRadius: "999px", border: 0, background: "#1C1913", color: "#FBF8F2", fontWeight: 800 },
            },
            "Save Rate & UPI"
          )
        )
      )
    );
  }

  function WorkerKhataView() {
    const app = useApp();
    const isDark = app.isDarkMode;
    const worker = app.currentWorker;
    const jobs = app.jobs || [];
    const escrowPending = jobs
      .filter((j) => worker && j.assignedWorkerId === worker.id && ["accepted", "approved", "in_progress", "completed_pending_payment"].includes(j.status))
      .reduce((acc, j) => acc + (j.workerPayout || Math.round((j.dailyWage || 850) * (j.durationDays || 1) * 0.8)), 0);

    const cardBg = isDark ? "#1F1C17" : "#FFFFFF";
    const borderCol = isDark ? "#2E2A22" : "#EFE7DA";

    return h(
      "main",
      { style: { maxWidth: "1320px", margin: "0 auto", padding: "28px 24px 60px", display: "flex", flexDirection: "column", gap: "24px" } },
      h(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "8px" } },
        h("span", { style: { fontSize: "13px", fontWeight: 800, letterSpacing: "1px", color: "#7A4E00" } }, "WORKER EARNINGS & GATE-PASS ID"),
        h("h1", { style: { margin: 0, fontSize: "clamp(34px,4vw,52px)", lineHeight: 1, letterSpacing: "-1.6px", fontWeight: 800 } }, "Digital khata & ", h("span", { style: { fontFamily: "'Instrument Serif',serif", fontStyle: "italic", fontWeight: 400 } }, "gate-pass.")),
        h("p", { style: { margin: 0, fontSize: "16px", color: isDark ? "#CFC6B8" : "#4A443A", maxWidth: "720px", lineHeight: 1.5 } }, "Every rupee you earn, plus an Aadhaar-linked digital ID pass accepted at gated colonies and industrial sites.")
      ),
      h(
        "section",
        { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "14px" } },
        h("div", { style: { borderRadius: "28px", background: "#1C1913", color: "#FBF8F2", padding: "22px", display: "flex", flexDirection: "column", gap: "6px" } }, h("span", { style: { fontSize: "12px", fontWeight: 800, color: "#F3C969" } }, "WITHDRAWABLE"), h("span", { style: { fontFamily: "'Instrument Serif',serif", fontSize: "52px", lineHeight: 1 } }, formatInr(worker?.walletBalance || 0)), h("span", { style: { fontSize: "13px", color: "#CFC6B8" } }, "Ready for instant UPI payout")),
        h("div", { style: { borderRadius: "28px", background: "#FFF0BF", color: "#1C1913", padding: "22px", display: "flex", flexDirection: "column", gap: "6px" } }, h("span", { style: { fontSize: "12px", fontWeight: 800, color: "#6B4600" } }, "ESCROW PENDING"), h("span", { style: { fontFamily: "'Instrument Serif',serif", fontSize: "52px", lineHeight: 1 } }, formatInr(escrowPending)), h("span", { style: { fontSize: "13px", color: "#4A443A" } }, "Releases on start/end verification")),
        h("div", { style: { borderRadius: "28px", background: "#E3F4E8", color: "#1C1913", padding: "22px", display: "flex", flexDirection: "column", gap: "6px" } }, h("span", { style: { fontSize: "12px", fontWeight: 800, color: "#1D6B36" } }, "TOTAL WITHDRAWN"), h("span", { style: { fontFamily: "'Instrument Serif',serif", fontSize: "52px", lineHeight: 1 } }, formatInr(worker?.totalWithdrawn || 0)), h("span", { style: { fontSize: "13px", color: "#2D4A36" } }, "80% net payout (20% fee)"))
      ),
      h(
        "div",
        { style: { display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "flex-start" } },
        // Ledger & Withdraw
        h(
          "section",
          { style: { flex: "1 1 460px", borderRadius: "30px", background: cardBg, border: "1px solid " + borderCol, padding: "24px", display: "flex", flexDirection: "column", gap: "14px" } },
          h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, h("b", { style: { fontSize: "20px" } }, "Payout Ledger"), h("button", { type: "button", onClick: () => app.withdrawWorkerEarnings?.(worker?.upiId), style: { height: "40px", padding: "0 18px", borderRadius: "999px", border: 0, background: "#F5A524", color: "#1C1913", fontWeight: 800, fontSize: "13px" } }, "Withdraw Wallet →")),
          (worker?.withdrawalHistory || []).length === 0
            ? h("span", { style: { color: isDark ? "#A49B8C" : "#6F685D" } }, "Completed UPI withdrawals and settlement reference IDs will appear here.")
            : worker.withdrawalHistory.map((tx) =>
                h(
                  "div",
                  { key: tx.id, style: { display: "flex", justifyContent: "space-between", padding: "12px 14px", borderRadius: "16px", background: isDark ? "#27231C" : "#FBF8F2" } },
                  h("div", null, h("b", null, tx.refId || tx.id), h("div", { style: { fontSize: "12px", color: isDark ? "#A49B8C" : "#6F685D" } }, `${tx.upiId} · ${tx.timestamp}`)),
                  h("b", { style: { color: "#1D6B36" } }, "+" + formatInr(tx.amount))
                )
              )
        ),

        // Gate Pass QR Card
        h(
          "aside",
          { style: { flex: "1 1 360px", borderRadius: "32px", background: "#1C1913", color: "#FBF8F2", padding: "26px", display: "flex", flexDirection: "column", gap: "14px" } },
          h("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, h("span", { style: { fontWeight: 800, fontSize: "18px" } }, "kaamzo", h("span", { style: { color: "#F5A524" } }, "."), " GATE PASS"), h("span", { style: { padding: "4px 10px", borderRadius: "999px", background: "#2E9E57", color: "#FFFFFF", fontSize: "11px", fontWeight: 800 } }, worker?.isVerified ? "UIDAI VERIFIED" : "KYC PENDING")),
          h("div", { style: { fontSize: "24px", fontWeight: 800 } }, worker?.name || "Sign in to view Gate Pass"),
          h("div", { style: { fontSize: "14px", color: "#F3C969", fontWeight: 700 } }, `Trade: ${worker?.primaryTrade || "—"} (Locked) · ID: ${worker?.id || "—"}`),
          h(
            "button",
            {
              type: "button",
              onClick: () => {
                if (typeof window.kaamzoDownloadGatePassImage === "function") {
                  window.kaamzoDownloadGatePassImage(worker || { name: "Worker", id: "demo", primaryTrade: "Plumber" });
                }
              },
              style: { height: "46px", borderRadius: "999px", border: 0, background: "#F5A524", color: "#1C1913", fontWeight: 800, fontSize: "14px" },
            },
            "Download Official Gate Pass PNG"
          )
        )
      )
    );
  }

  function WorkerBonusLadderView() {
    const app = useApp();
    const isDark = app.isDarkMode;
    const worker = app.currentWorker;
    const [simJobs, setSimJobs] = useState(worker ? worker.completedJobsCount || worker.completedJobs || 20 : 20);
    const [simWage, setSimWage] = useState(worker?.dailyRate || 850);

    const bars = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((m, i) => {
      const unlocked = simJobs >= m;
      return {
        jobs: String(m),
        pct: "+" + m + "%",
        next: "×" + (i + 1),
        h: Math.max(36, 26 + m * 2.1) + "px",
        bg: unlocked ? "#1C1913" : "rgba(255,255,255,0.65)",
        fg: unlocked ? "#F5A524" : "#3D2A05",
      };
    });

    const bonusPct = milestoneBonusPct(simJobs);
    const baseWorker80 = Math.round(Number(simWage) * 0.8);
    const bonusAmount = Math.round((baseWorker80 * bonusPct) / 100);
    const cardBg = isDark ? "#1F1C17" : "#FFFFFF";
    const borderCol = isDark ? "#2E2A22" : "#EFE7DA";

    return h(
      "main",
      { style: { maxWidth: "1320px", margin: "0 auto", padding: "28px 24px 60px", display: "flex", flexDirection: "column", gap: "24px" } },
      h(
        "div",
        { style: { display: "flex", flexDirection: "column", gap: "8px" } },
        h("span", { style: { fontSize: "13px", fontWeight: 800, letterSpacing: "1px", color: "#7A4E00" } }, "10-TO-100 JOBS CASH DOUBLER"),
        h("h1", { style: { margin: 0, fontSize: "clamp(34px,4vw,52px)", lineHeight: 1, letterSpacing: "-1.6px", fontWeight: 800 } }, "Milestone bonus ", h("span", { style: { fontFamily: "'Instrument Serif',serif", fontStyle: "italic", fontWeight: 400 } }, "ladder & calculator.")),
        h("p", { style: { margin: 0, fontSize: "16px", color: isDark ? "#CFC6B8" : "#4A443A", maxWidth: "720px", lineHeight: 1.5 } }, "10 jobs gives +10% for your next 1 job, 20 jobs gives +20% for the next 2, up to 100 jobs for +100% on the next 10.")
      ),
      h(
        "section",
        { style: { borderRadius: "34px", background: "linear-gradient(120deg,#F5A524 0%,#F7C24E 60%,#FBDC86 100%)", padding: "28px", display: "flex", flexDirection: "column", gap: "16px", color: "#1C1913" } },
        h(
          "div",
          { style: { display: "grid", gridTemplateColumns: "repeat(10,minmax(0,1fr))", gap: "8px", alignItems: "end", height: "260px" } },
          bars.map((b) =>
            h(
              "div",
              { key: b.jobs, style: { height: b.h, borderRadius: "16px", background: b.bg, color: b.fg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", paddingTop: "10px", gap: "2px", textAlign: "center" } },
              h("b", { style: { fontSize: "14px" } }, b.pct),
              h("span", { style: { fontSize: "10px", fontWeight: 700, opacity: 0.85 } }, b.next)
            )
          )
        ),
        h("div", { style: { display: "grid", gridTemplateColumns: "repeat(10,minmax(0,1fr))", gap: "8px", textAlign: "center", fontSize: "11px", fontWeight: 800, color: "#3D2A05" } }, bars.map((b) => h("span", { key: b.jobs }, b.jobs + " jobs")))
      ),
      h(
        "div",
        { style: { display: "flex", flexWrap: "wrap", gap: "24px", alignItems: "stretch" } },
        h(
          "section",
          { style: { flex: "1 1 420px", borderRadius: "30px", background: cardBg, border: "1px solid " + borderCol, padding: "24px", display: "flex", flexDirection: "column", gap: "14px" } },
          h("b", { style: { fontSize: "20px" } }, "Bonus calculator"),
          h("label", { htmlFor: "kz-sim-jobs", style: { display: "flex", justifyContent: "space-between", fontWeight: 800 } }, "Jobs done this cycle", h("span", { style: { fontSize: "24px" } }, simJobs)),
          h("input", { id: "kz-sim-jobs", type: "range", min: 0, max: 100, value: simJobs, onChange: (e) => setSimJobs(Number(e.target.value)) }),
          h("label", { htmlFor: "kz-sim-wage", style: { display: "flex", justifyContent: "space-between", fontWeight: 800 } }, "Daily job rate (₹)", h("span", { style: { fontSize: "20px" } }, formatInr(simWage))),
          h("input", { id: "kz-sim-wage", type: "range", min: 500, max: 2500, step: 50, value: simWage, onChange: (e) => setSimWage(Number(e.target.value)) })
        ),
        h(
          "section",
          { style: { flex: "1 1 360px", borderRadius: "30px", background: "#1C1913", color: "#FBF8F2", padding: "26px", display: "flex", flexDirection: "column", gap: "12px", justifyContent: "center" } },
          h("span", { style: { fontSize: "12px", fontWeight: 800, letterSpacing: "1px", color: "#F5A524" } }, `UNLOCKED BONUS TIER: +${bonusPct}%`),
          h("span", { style: { fontFamily: "'Instrument Serif', serif", fontSize: "58px", lineHeight: 1 } }, formatInr(baseWorker80 + bonusAmount)),
          h("span", { style: { fontSize: "14px", color: "#CFC6B8" } }, `Base 80% (${formatInr(baseWorker80)}) + Milestone Bonus (${formatInr(bonusAmount)}) per qualifying job`)
        )
      )
    );
  }

  function WorkerLiveJobView() {
    const app = useApp();
    const isDark = app.isDarkMode;
    const worker = app.currentWorker;
    const jobs = app.jobs || [];
    const active =
      jobs.find((j) => worker && (j.assignedWorkerId === worker.id || j.assignedWorkerName === worker.name) && ["accepted", "approved", "in_progress", "completed_pending_payment"].includes(j.status)) ||
      jobs.find((j) => worker && (j.assignedWorkerId === worker.id || j.assignedWorkerName === worker.name) && j.status === "paid_and_closed");

    const [otpCode, setOtpCode] = useState("");
    const [endUpi, setEndUpi] = useState(() => worker?.upiId || active?.assignedWorkerUpi || "");
    const [endBusy, setEndBusy] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [, setTick] = useState(0);

    useEffect(() => {
      if (worker?.upiId && !endUpi) setEndUpi(worker.upiId);
    }, [worker?.upiId]);

    const cardBg = isDark ? "#1F1C17" : "#FFFFFF";
    const borderCol = isDark ? "#2E2A22" : "#EFE7DA";

    const isJobLocked = Boolean(active && ["accepted", "approved", "in_progress"].includes(active.status));
    const isStep1Done = Boolean(active && ["in_progress", "completed_pending_payment", "paid_and_closed"].includes(active.status));
    const isStep2Done = Boolean(active && ["completed_pending_payment", "paid_and_closed"].includes(active.status));

    const handleStartViaQr = async () => {
      if (!active) return;
      const codeToUse = String(otpCode || active.otpCode || "").trim();
      if (codeToUse && app.startJobWithOtp) {
        app.startJobWithOtp(active.id, codeToUse);
      }
      active.status = "in_progress";
      active.startQrVerified = true;
      active.startedAt = new Date().toISOString();
      setTick((n) => n + 1);
      app.showNotification?.("✓ Start QR Verified! Job is now In Progress. Complete the work, then scan/confirm End QR.");
      try {
        await fetch("/api/db", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "upsert",
            collection: "jobs",
            id: active.id,
            data: Object.assign({}, active, { status: "in_progress", startQrVerified: true, syncedAt: new Date().toISOString() }),
          }),
        });
      } catch (_) {}
    };

    const handleEndViaQr = async () => {
      if (!active || !isStep1Done || endBusy) return;
      const cleanUpi = String(endUpi || worker?.upiId || "success@razorpay").trim().toLowerCase();
      if (!/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(cleanUpi)) {
        app.showNotification?.("Enter a valid UPI ID (e.g. name@okaxis or success@razorpay) to complete End QR.");
        return;
      }
      setEndBusy(true);
      try {
        app.updateWorkerUpi?.(cleanUpi);
        active.assignedWorkerUpi = cleanUpi;
        active.workerUpi = cleanUpi;
        active.endQrVerified = true;
        app.completeJobByWorker?.(active.id);
        active.status = "completed_pending_payment";
        await fetch("/api/razorpay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "markCompleted",
            jobId: active.id,
            upiId: cleanUpi,
            workerId: worker?.id || active.assignedWorkerId,
            workerName: worker?.name || active.assignedWorkerName || "Kaamzo Worker",
            workerPhone: worker?.phone || active.assignedWorkerPhone || "",
            jobSnapshot: Object.assign({}, active, {
              status: "completed_pending_payment",
              assignedWorkerUpi: cleanUpi,
              endQrVerified: true,
            }),
          }),
        });
        setTick((n) => n + 1);
        app.showNotification?.("✓ End QR Verified & Job Completed! Page unlocked — customer can now tap Pay Now.");
      } catch (_) {
        app.showNotification?.("✓ Job marked completed via End QR.");
      } finally {
        setEndBusy(false);
      }
    };

    const confirmRejectWith24hPenalty = async () => {
      if (!active || !worker) return;
      await applyWorker24hPenalty(worker, app);
      app.releaseJobByWorker?.(active.id, "Rejected by worker — 24h offline penalty applied");
      setShowRejectModal(false);
      app.showNotification?.("⚠️ Job cancelled. You are now OFFLINE for the next 24 hours.");
      navigate("/worker", { role: "worker" });
    };

    const distKm = active ? getJobDistanceKm(active, worker) : 1.4;
    const etaMin = Math.max(4, Math.round(Number(distKm || 1.4) * 4));
    const payoutAmt = active
      ? active.workerPayout || Math.round((active.dailyWage || 850) * (active.durationDays || 1) * 0.8)
      : 680;

    return h(
      "main",
      { style: { maxWidth: "1200px", margin: "0 auto", padding: "28px 24px 72px", display: "flex", flexDirection: "column", gap: "22px" } },
      // Top Header + Lock Notice
      h(
        "div",
        { style: { display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "14px" } },
        h(
          "div",
          { style: { display: "flex", flexDirection: "column", gap: "6px" } },
          h(
            "span",
            { style: { fontSize: "12px", fontWeight: 800, letterSpacing: "0.9px", color: isJobLocked ? "#9B1C1C" : "#1D6B36" } },
            isJobLocked
              ? "🔒 PAGE LOCKED · COMPLETE START QR & END QR TO LEAVE"
              : "✓ JOB COMPLETED · PAGE UNLOCKED"
          ),
          h(
            "h1",
            { style: { margin: 0, fontSize: "clamp(32px,4vw,48px)", fontWeight: 800, lineHeight: 1 } },
            "Go to work site & ",
            h("span", { style: { fontFamily: "'Instrument Serif',serif", fontStyle: "italic", fontWeight: 400 } }, "verify QR steps.")
          )
        ),
        !isJobLocked &&
          h(
            "button",
            {
              type: "button",
              onClick: () => navigate("/worker", { role: "worker" }),
              style: { height: "44px", padding: "0 20px", borderRadius: "999px", border: 0, background: "#1C1913", color: "#FBF8F2", fontWeight: 800, fontSize: "13px", cursor: "pointer" },
            },
            "← Return to Worker Home"
          )
      ),

      !active
        ? h(
            "div",
            { style: { borderRadius: "28px", background: cardBg, border: "1px solid " + borderCol, padding: "40px", textAlign: "center" } },
            h("b", { style: { fontSize: "18px" } }, "No active job in progress"),
            h("p", { style: { color: isDark ? "#A49B8C" : "#6F685D" } }, "Accept a broadcast on the Jobs tab to begin."),
            h("button", { type: "button", onClick: () => navigate("/jobs", { role: "worker" }), style: { height: "44px", padding: "0 20px", borderRadius: "999px", border: 0, background: "#F5A524", fontWeight: 800, cursor: "pointer" } }, "Browse 10 km Jobs")
          )
        : h(
            "div",
            { style: { display: "flex", flexDirection: "column", gap: "20px" } },

            // 1. WORK SITE INSTRUCTION BANNER & DETAILS CARD
            h(
              "section",
              {
                style: {
                  borderRadius: "28px",
                  background: isDark ? "#27231C" : "#FFF7E3",
                  border: "2px solid #F5A524",
                  padding: "22px 24px",
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                },
              },
              h(
                "div",
                { style: { display: "flex", flexDirection: "column", gap: "6px" } },
                h(
                  "span",
                  { style: { padding: "4px 10px", borderRadius: "999px", background: "#1C1913", color: "#F5A524", fontSize: "11px", fontWeight: 800, width: "max-content" } },
                  `📍 HEAD TO WORK SITE · ${distKm} KM AWAY (~${etaMin} MIN)`
                ),
                h("h2", { style: { margin: 0, fontSize: "24px", fontWeight: 800 } }, active.title),
                h(
                  "div",
                  { style: { fontSize: "15px", fontWeight: 700, color: isDark ? "#EDE6DA" : "#1C1913" } },
                  `Work Site: ${active.locationAddress || active.area || "Ludhiana"} · Customer: ${active.customerName || "Employer"} (${active.customerPhone || ""})`
                ),
                h(
                  "span",
                  { style: { fontSize: "13px", color: isDark ? "#CFC6B8" : "#6B4600", fontWeight: 600 } },
                  "Instruction: Go directly to the work site shown on the map below, scan/verify Step 1 Start QR on arrival, and Step 2 End QR after finishing."
                )
              ),
              h(
                "div",
                { style: { textAlign: "right", display: "flex", flexDirection: "column", gap: "4px" } },
                h("span", { style: { fontSize: "11px", fontWeight: 800, color: "#7A4E00" } }, "YOUR LABOUR PAYOUT"),
                h("span", { style: { fontFamily: "'Instrument Serif', serif", fontSize: "42px", lineHeight: 1, fontWeight: 400 } }, formatInr(payoutAmt))
              )
            ),

            // 2. LIVE ROUTE MAP TO THE WORK SITE
            h(
              "section",
              {
                style: {
                  position: "relative",
                  height: "320px",
                  borderRadius: "30px",
                  overflow: "hidden",
                  background: "#E9F0DA",
                  border: "1px solid " + borderCol,
                },
              },
              h(
                "svg",
                { role: "img", "aria-label": "Map route to customer work site", viewBox: "0 0 900 320", preserveAspectRatio: "xMidYMid slice", style: { position: "absolute", inset: 0, width: "100%", height: "100%" } },
                h(
                  "g",
                  { stroke: "#FFFFFF", strokeWidth: 18, fill: "none" },
                  h("path", { d: "M-10 85 H920" }),
                  h("path", { d: "M240 -10 V340" }),
                  h("path", { d: "M-10 245 C 240 220, 560 285, 920 230" }),
                  h("path", { d: "M660 -10 C 630 120, 690 210, 640 340" })
                ),
                // Dashed navigation route from Worker to Work Site
                h("path", { d: "M140 255 C 230 210, 320 145, 450 120 S 620 95, 700 95", fill: "none", stroke: "#1C1913", strokeWidth: 6, strokeDasharray: "4 12", strokeLinecap: "round" }),
                // Worker Origin Pin
                h("circle", { cx: 140, cy: 255, r: 18, fill: "#F5A524", stroke: "#1C1913", strokeWidth: 4 }),
                h("text", { x: 140, y: 292, textAnchor: "middle", fill: "#1C1913", fontSize: 12, fontWeight: 800 }, "YOU"),
                // Customer Work Site Destination Pin
                h("circle", { cx: 700, cy: 95, r: 24, fill: "#2E9E57", stroke: "#FFFFFF", strokeWidth: 5 }),
                h("text", { x: 700, y: 100, textAnchor: "middle", fill: "#FFFFFF", fontSize: 11, fontWeight: 800 }, "SITE")
              ),
              h(
                "span",
                {
                  style: {
                    position: "absolute",
                    left: "16px",
                    top: "16px",
                    padding: "9px 16px",
                    borderRadius: "999px",
                    background: "#1C1913",
                    color: "#FBF8F2",
                    fontSize: "13px",
                    fontWeight: 800,
                  },
                },
                `Work Site: ${active.locationAddress || active.area || "Ludhiana"} · ${distKm} km · ETA ~${etaMin} min`
              ),
              h(
                "a",
                {
                  href: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(active.locationAddress || active.area || "Ludhiana Punjab")}`,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  style: {
                    position: "absolute",
                    right: "16px",
                    bottom: "16px",
                    height: "46px",
                    padding: "0 20px",
                    borderRadius: "999px",
                    background: "#1C1913",
                    color: "#F5A524",
                    fontWeight: 800,
                    fontSize: "13px",
                    display: "inline-flex",
                    alignItems: "center",
                    textDecoration: "none",
                  },
                },
                "Open Work Site in Google Maps ↗"
              )
            ),

            h(JobProgressPipeline, { job: active, isDark }),

            // 3. BELOW THE MAP: START JOB QR & END JOB QR CARDS
            h(
              "div",
              { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "18px" } },

              // CARD 1: QR FOR STARTING THE JOB
              h(
                "section",
                {
                  style: {
                    borderRadius: "28px",
                    background: cardBg,
                    border: "2px solid " + (isStep1Done ? "#2E9E57" : "#F5A524"),
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  },
                },
                h(
                  "div",
                  { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" } },
                  h(
                    "span",
                    {
                      style: {
                        padding: "4px 10px",
                        borderRadius: "999px",
                        background: isStep1Done ? "#E3F4E8" : "#FFF0BF",
                        color: isStep1Done ? "#1D6B36" : "#6B4600",
                        fontSize: "11px",
                        fontWeight: 800,
                      },
                    },
                    isStep1Done ? "✓ STEP 1 COMPLETE" : "STEP 1 OF 2 · ARRIVAL AT SITE"
                  ),
                  h("span", { style: { fontSize: "12px", fontWeight: 700, color: isDark ? "#A49B8C" : "#6F685D" } }, "Start QR")
                ),
                h("h3", { style: { margin: 0, fontSize: "20px", fontWeight: 800 } }, "1 · QR for Starting the Job"),
                h(
                  "div",
                  { style: { display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" } },
                  renderDeterministicQrSvg(`KAAMZO-START:${active.id}:${active.otpCode || "START"}`, "#2E9E57"),
                  h(
                    "div",
                    { style: { flex: "1 1 160px", display: "flex", flexDirection: "column", gap: "8px" } },
                    h(
                      "p",
                      { style: { margin: 0, fontSize: "13px", color: isDark ? "#CFC6B8" : "#4A443A", lineHeight: 1.45 } },
                      "Show or scan this Start QR at the customer's door (or enter their 4-digit Start OTP) to start the job clock."
                    ),
                    !isStep1Done &&
                      h("input", {
                        type: "text",
                        maxLength: 4,
                        value: otpCode,
                        onChange: (e) => setOtpCode(e.target.value),
                        placeholder: "4-digit Start OTP (optional)",
                        style: {
                          height: "42px",
                          borderRadius: "12px",
                          border: "1px solid " + borderCol,
                          padding: "0 12px",
                          fontWeight: 800,
                          letterSpacing: "2px",
                          background: isDark ? "#14120E" : "#FBF8F2",
                          color: isDark ? "#EDE6DA" : "#1C1913",
                        },
                      })
                  )
                ),
                isStep1Done
                  ? h(
                      "div",
                      { style: { padding: "12px 14px", borderRadius: "14px", background: "#E3F4E8", color: "#1D6B36", fontWeight: 800, fontSize: "13px" } },
                      "✓ Start QR verified — Job is now In Progress! Proceed to Step 2 End QR when finished."
                    )
                  : h(
                      "button",
                      {
                        type: "button",
                        onClick: handleStartViaQr,
                        style: {
                          height: "46px",
                          borderRadius: "999px",
                          border: 0,
                          background: "#2E9E57",
                          color: "#FFFFFF",
                          fontWeight: 800,
                          fontSize: "14px",
                          cursor: "pointer",
                        },
                      },
                      "Scan / Verify Start QR & Begin Job →"
                    )
              ),

              // CARD 2: QR FOR ENDING THE JOB
              h(
                "section",
                {
                  style: {
                    borderRadius: "28px",
                    background: cardBg,
                    border: "2px solid " + (isStep2Done ? "#2E9E57" : isStep1Done ? "#F5A524" : borderCol),
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                    opacity: isStep1Done ? 1 : 0.62,
                  },
                },
                h(
                  "div",
                  { style: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" } },
                  h(
                    "span",
                    {
                      style: {
                        padding: "4px 10px",
                        borderRadius: "999px",
                        background: isStep2Done ? "#E3F4E8" : isStep1Done ? "#FFF0BF" : "#EFE7DA",
                        color: isStep2Done ? "#1D6B36" : "#6B4600",
                        fontSize: "11px",
                        fontWeight: 800,
                      },
                    },
                    isStep2Done ? "✓ STEP 2 COMPLETE" : isStep1Done ? "STEP 2 OF 2 · READY TO FINISH" : "LOCKED UNTIL STEP 1 START QR"
                  ),
                  h("span", { style: { fontSize: "12px", fontWeight: 700, color: isDark ? "#A49B8C" : "#6F685D" } }, "End QR")
                ),
                h("h3", { style: { margin: 0, fontSize: "20px", fontWeight: 800 } }, "2 · QR for Ending the Job"),
                h(
                  "div",
                  { style: { display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" } },
                  renderDeterministicQrSvg(`KAAMZO-END:${active.id}:COMPLETE`, "#F5A524"),
                  h(
                    "div",
                    { style: { flex: "1 1 160px", display: "flex", flexDirection: "column", gap: "8px" } },
                    h(
                      "p",
                      { style: { margin: 0, fontSize: "13px", color: isDark ? "#CFC6B8" : "#4A443A", lineHeight: 1.45 } },
                      "After finishing the work, verify this End QR and confirm your UPI ID to unlock customer Razorpay payment and leave this page."
                    ),
                    !isStep2Done &&
                      h("input", {
                        type: "text",
                        disabled: !isStep1Done,
                        value: endUpi,
                        onChange: (e) => setEndUpi(e.target.value),
                        placeholder: "Your UPI ID (e.g. success@razorpay)",
                        style: {
                          height: "42px",
                          borderRadius: "12px",
                          border: "1px solid " + borderCol,
                          padding: "0 12px",
                          fontWeight: 700,
                          fontSize: "13px",
                          background: isDark ? "#14120E" : "#FBF8F2",
                          color: isDark ? "#EDE6DA" : "#1C1913",
                        },
                      }),
                    !isStep2Done &&
                      isStep1Done &&
                      h(
                        "button",
                        {
                          type: "button",
                          onClick: () => setEndUpi("success@razorpay"),
                          style: {
                            alignSelf: "flex-start",
                            padding: "4px 10px",
                            borderRadius: "999px",
                            border: "1px solid " + borderCol,
                            background: isDark ? "#27231C" : "#FFF7E3",
                            color: "#7A4E00",
                            fontSize: "11px",
                            fontWeight: 800,
                            cursor: "pointer",
                          },
                        },
                        "Use test UPI: success@razorpay"
                      )
                  )
                ),
                isStep2Done
                  ? h(
                      "div",
                      { style: { padding: "12px 14px", borderRadius: "14px", background: "#E3F4E8", color: "#1D6B36", fontWeight: 800, fontSize: "13px" } },
                      active.status === "paid_and_closed"
                        ? `✓ Paid & Settled via Razorpay!${active.razorpayPaymentId ? " Ref: " + active.razorpayPaymentId : ""}`
                        : `✓ End QR verified! Waiting for customer Razorpay payment to ${active.assignedWorkerUpi || worker?.upiId || "your UPI"}. You may now leave this page.`
                    )
                  : h(
                      "button",
                      {
                        type: "button",
                        disabled: !isStep1Done || endBusy,
                        onClick: handleEndViaQr,
                        style: {
                          height: "46px",
                          borderRadius: "999px",
                          border: 0,
                          background: isStep1Done ? "#F5A524" : "#CFC6B8",
                          color: "#1C1913",
                          fontWeight: 800,
                          fontSize: "14px",
                          cursor: isStep1Done ? "pointer" : "not-allowed",
                        },
                      },
                      endBusy ? "Verifying End QR & Saving UPI…" : "Scan / Verify End QR & Complete Job →"
                    )
              )
            ),

            // 4. CANCEL / REJECT JOB TO LEAVE PAGE (WITH 24-HOUR OFFLINE PENALTY)
            isJobLocked &&
              h(
                "section",
                {
                  style: {
                    borderRadius: "24px",
                    background: isDark ? "#2B1818" : "#FFF2F2",
                    border: "1px solid #F5B5B5",
                    padding: "18px 22px",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                  },
                },
                h(
                  "div",
                  { style: { display: "flex", flexDirection: "column", gap: "2px" } },
                  h("b", { style: { fontSize: "15px", color: isDark ? "#FFB4B4" : "#8A1C1C" } }, "Cannot complete this job?"),
                  h(
                    "span",
                    { style: { fontSize: "13px", color: isDark ? "#E5C1C1" : "#6B2020" } },
                    "You cannot leave this page until Start QR & End QR are done. Rejecting or cancelling will lock your account OFFLINE for 24 hours."
                  )
                ),
                h(
                  "button",
                  {
                    type: "button",
                    onClick: () => setShowRejectModal(true),
                    style: {
                      height: "42px",
                      padding: "0 18px",
                      borderRadius: "999px",
                      border: 0,
                      background: "#E5484D",
                      color: "#FFFFFF",
                      fontWeight: 800,
                      fontSize: "13px",
                      cursor: "pointer",
                    },
                  },
                  "Reject / Cancel Job to Leave Page"
                )
              )
          ),

      // 24-HOUR OFFLINE PENALTY WARNING MODAL
      showRejectModal &&
        h(
          "div",
          {
            role: "dialog",
            "aria-modal": "true",
            style: {
              position: "fixed",
              inset: 0,
              background: "rgba(28, 25, 19, 0.68)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              zIndex: 150,
              backdropFilter: "blur(6px)",
            },
            onClick: (e) => {
              if (e.target === e.currentTarget) setShowRejectModal(false);
            },
          },
          h(
            "div",
            {
              style: {
                width: "100%",
                maxWidth: "460px",
                borderRadius: "28px",
                background: cardBg,
                color: isDark ? "#EDE6DA" : "#1C1913",
                border: "2px solid #E5484D",
                padding: "28px",
                boxShadow: "0 24px 64px rgba(0,0,0,0.34)",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              },
            },
            h(
              "span",
              {
                style: {
                  padding: "5px 12px",
                  borderRadius: "999px",
                  background: "#FFE1E1",
                  color: "#9B1C1C",
                  fontSize: "11px",
                  fontWeight: 800,
                  width: "max-content",
                },
              },
              "⚠️ 24-HOUR OFFLINE PENALTY WARNING"
            ),
            h("h3", { style: { margin: 0, fontSize: "24px", fontWeight: 800, lineHeight: 1.15 } }, "Reject job & go offline for 1 day?"),
            h(
              "p",
              { style: { margin: 0, fontSize: "14px", color: isDark ? "#CFC6B8" : "#4A443A", lineHeight: 1.55 } },
              "If you reject or cancel this accepted job, you will NOT be able to get online for 1 full day (the next 24 hours). Your account will be switched to OFFLINE immediately and the job will return to other workers."
            ),
            h(
              "div",
              { style: { display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "6px", flexWrap: "wrap" } },
              h(
                "button",
                {
                  type: "button",
                  onClick: () => setShowRejectModal(false),
                  style: {
                    height: "44px",
                    padding: "0 18px",
                    borderRadius: "999px",
                    border: "1px solid " + borderCol,
                    background: "#2E9E57",
                    color: "#FFFFFF",
                    fontWeight: 800,
                    fontSize: "13px",
                    cursor: "pointer",
                  },
                },
                "Stay & Complete Job"
              ),
              h(
                "button",
                {
                  type: "button",
                  onClick: confirmRejectWith24hPenalty,
                  style: {
                    height: "44px",
                    padding: "0 20px",
                    borderRadius: "999px",
                    border: 0,
                    background: "#E5484D",
                    color: "#FFFFFF",
                    fontWeight: 800,
                    fontSize: "13px",
                    cursor: "pointer",
                  },
                },
                "Confirm Reject · Offline for 24h"
              )
            )
          )
        )
    );
  }

  function WorkerSupportView() {
    const app = useApp();
    const isDark = app.isDarkMode;
    const jobs = app.jobs || [];
    const [selJob, setSelJob] = useState(jobs[0]?.id || "");
    const [note, setNote] = useState("");
    const cardBg = isDark ? "#1F1C17" : "#FFFFFF";
    const borderCol = isDark ? "#2E2A22" : "#EFE7DA";

    return h(
      "main",
      { style: { maxWidth: "1320px", margin: "0 auto", padding: "28px 24px 60px", display: "flex", flexDirection: "column", gap: "24px" } },
      h(
        "section",
        { style: { borderRadius: "36px", background: "linear-gradient(180deg, #2A2342 0%, #6E4A63 60%, #D38457 100%)", color: "#FBF8F2", padding: "40px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "20px" } },
        h("div", null, h("h1", { style: { margin: 0, fontSize: "clamp(34px,4vw,52px)", fontWeight: 800 } }, "Worker support & ", h("span", { style: { fontFamily: "'Instrument Serif',serif", fontStyle: "italic", fontWeight: 400, color: "#F7C88E" } }, "helpline")), h("p", { style: { margin: "8px 0 0", color: "#EBD9C8" } }, "Hindi, Punjabi and English voice assistance, OTP/payment help, and 112 safety line.")),
        h("a", { href: "tel:112", style: { height: "50px", padding: "0 24px", borderRadius: "999px", background: "#E5484D", color: "#FFFFFF", fontWeight: 800, textDecoration: "none", display: "inline-flex", alignItems: "center" } }, "SOS · Call 112")
      ),
      h(
        "div",
        { style: { display: "flex", flexWrap: "wrap", gap: "20px" } },
        h(
          "div",
          { style: { flex: "1 1 400px", borderRadius: "28px", background: cardBg, border: "1px solid " + borderCol, padding: "24px", display: "flex", flexDirection: "column", gap: "12px" } },
          h("b", { style: { fontSize: "20px" } }, "Report OTP or Payment Issue"),
          h("select", { value: selJob, onChange: (e) => setSelJob(e.target.value), style: { height: "46px", borderRadius: "14px", border: "1px solid " + borderCol, padding: "0 12px" } }, jobs.length === 0 ? h("option", { value: "" }, "No jobs yet") : jobs.map((j) => h("option", { key: j.id, value: j.id }, j.title))),
          h("textarea", { rows: 3, value: note, onChange: (e) => setNote(e.target.value), placeholder: "Describe payment or site issue…", style: { borderRadius: "14px", border: "1px solid " + borderCol, padding: "12px" } }),
          h("button", { type: "button", onClick: () => { if (selJob) app.raiseJobComplaint?.(selJob, "Worker payment/site support", note || "Worker requested help"); setNote(""); }, style: { height: "46px", borderRadius: "999px", border: 0, background: "#1C1913", color: "#FBF8F2", fontWeight: 800 } }, "Send to Admin & Escrow Team")
        ),
        h(
          "div",
          { style: { flex: "1 1 320px", borderRadius: "28px", background: cardBg, border: "1px solid " + borderCol, padding: "24px", display: "flex", flexDirection: "column", gap: "12px" } },
          h("b", { style: { fontSize: "20px" } }, "Direct Helplines"),
          h("button", { type: "button", onClick: () => app.speak?.("Kaamzo sahayta kendra. Aapki har kamai UPI escrow mein surakshit hai.", "hi-IN"), style: { height: "46px", borderRadius: "999px", border: 0, background: "#FFF0BF", color: "#6B4600", fontWeight: 800 } }, "Hear Audio Guide (Hindi)"),
          h("button", { type: "button", onClick: () => app.openGlobalChat?.(null, { name: "Kaamzo Support", phone: "+91 95922 21100", role: "support" }, "worker"), style: { height: "46px", borderRadius: "999px", border: "1px solid " + borderCol, background: "transparent", color: isDark ? "#EDE6DA" : "#1C1913", fontWeight: 700 } }, "Open Live Support Chat")
        )
      )
    );
  }

  KZ.views.JobsPage = function JobsPage({ path }) {
    return h(WorkerShell, { path }, h(JobsFeedView, null));
  };

  KZ.views.WorkerPortal = function WorkerPortal({ path }) {
    let body = null;
    if (path === "/worker/account-and-pay") body = h(WorkerAccountPayView, null);
    else if (path === "/worker/khata-and-gate-pass") body = h(WorkerKhataView, null);
    else if (path === "/worker/bonus-ladder-calculator") body = h(WorkerBonusLadderView, null);
    else if (path === "/worker/live-job" || path === "/worker/work") body = h(WorkerLiveJobView, null);
    else if (path === "/worker/support") body = h(WorkerSupportView, null);
    else body = h(WorkerWorkHomeView, null);

    return h(WorkerShell, { path }, body);
  };
})();


/* Part 5 — Admin Portal (/admin) with Kaamzo Theme Shell */
(function () {
  "use strict";
  const KZ = window.__KZ_REDESIGN__;
  const U = KZ.utils;
  const C = KZ.components;
  const { h, useApp, useState, useMemo, getCtx, navigate } = U;
  const { TopUtilityBar, KaamzoFooter } = C;

  KZ.views.AdminPortal = function AdminPortal() {
    const app = useApp();
    const isDark = app.isDarkMode;
    const ctx = getCtx();
    const LegacyAdmin = ctx && ctx.LegacyAdmin;
    const [policySearch, setPolicySearch] = useState("");
    const [blockTick, setBlockTick] = useState(0);

    const workers = app.workers || [];
    const verifiedCount = workers.filter((w) => w.isVerified).length;
    const activeJobsCount = (app.jobs || []).filter((j) =>
      ["broadcast", "accepted", "approved", "in_progress"].includes(j.status)
    ).length;
    const pendingKycCount = (app.verifications || []).filter((v) => v.status === "pending").length;
    const openDisputesCount = (app.disputes || []).filter((d) => d.status !== "resolved").length;

    const isWorkerBlocked = (w) => {
      if (!w) return false;
      try {
        if (localStorage.getItem("kz_blocked_worker_" + w.id) === "1") return true;
        if (localStorage.getItem("kz_blocked_worker_" + w.id) === "0") return false;
      } catch (_) {}
      return Boolean(w.isBlocked || w.isBanned);
    };

    const toggleBlockWorker = async (w) => {
      if (!w || !w.id) return;
      const currentlyBlocked = isWorkerBlocked(w);
      const nextBlocked = !currentlyBlocked;
      const reason = nextBlocked ? "Blocked by Admin for violating Kaamzo company policy" : "";
      w.isBlocked = nextBlocked;
      w.isBanned = nextBlocked;
      w.blockReason = reason;
      if (nextBlocked) w.isOnline = false;
      try {
        localStorage.setItem("kz_blocked_worker_" + w.id, nextBlocked ? "1" : "0");
      } catch (_) {}
      setBlockTick((n) => n + 1);
      app.showNotification?.(
        nextBlocked
          ? `🚫 Blocked ${w.name} for company policy violation (forced offline).`
          : `✓ Unblocked ${w.name}.`
      );
      try {
        await fetch("/api/db", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "upsert",
            collection: "workers",
            id: w.id,
            data: Object.assign({}, w, {
              id: w.id,
              isBlocked: nextBlocked,
              isBanned: nextBlocked,
              isOnline: nextBlocked ? false : w.isOnline,
              blockReason: reason,
              syncedAt: new Date().toISOString(),
            }),
          }),
        });
      } catch (_) {}
    };

    const filteredPolicyWorkers = useMemo(() => {
      const q = policySearch.trim().toLowerCase();
      return workers.filter((w) => {
        if (!q) return true;
        return (
          String(w.name || "").toLowerCase().includes(q) ||
          String(w.primaryTrade || "").toLowerCase().includes(q) ||
          String(w.phone || "").toLowerCase().includes(q) ||
          String(w.id || "").toLowerCase().includes(q)
        );
      });
    }, [workers, policySearch, blockTick]);

    const cardBg = isDark ? "#1F1C17" : "#FFFFFF";
    const borderCol = isDark ? "#2E2A22" : "#EFE7DA";

    return h(
      "div",
      {
        style: {
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
          background: isDark ? "#14120E" : "#FBF8F2",
          color: isDark ? "#EDE6DA" : "#1C1913",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        },
      },
      h(TopUtilityBar, { compact: false }),

      // Sticky Kaamzo Admin Header
      h(
        "header",
        {
          className: "kz-app-header " + (isDark ? "kz-sticky-header" : ""),
          style: {
            position: "sticky",
            top: 0,
            zIndex: 40,
            background: isDark ? "rgba(20,18,14,0.92)" : "rgba(251,248,242,0.92)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderBottom: "1px solid " + (isDark ? "#2E2A22" : "#EFE7DA"),
          },
        },
        h(
          "div",
          {
            style: {
              maxWidth: "1320px",
              margin: "0 auto",
              padding: "12px 24px",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              gap: "14px",
            },
          },
          h(
            "a",
            {
              href: "/",
              onClick: (e) => {
                e.preventDefault();
                navigate("/", { role: "select_role" });
              },
              style: {
                textDecoration: "none",
                color: isDark ? "#EDE6DA" : "#1C1913",
                fontWeight: 800,
                fontSize: "22px",
                letterSpacing: "-0.4px",
              },
            },
            "kaamzo",
            h("span", { style: { color: "#E8930C" } }, ".")
          ),
          h(
            "span",
            {
              style: {
                padding: "6px 12px",
                borderRadius: "999px",
                background: "#FFF0BF",
                color: "#6B4600",
                fontSize: "11px",
                fontWeight: 800,
                letterSpacing: "0.8px",
              },
            },
            "ADMIN PORTAL"
          ),
          h(
            "nav",
            {
              "aria-label": "Admin",
              className: "kz-tabs " + (isDark ? "kz-tab-track" : ""),
              style: {
                display: "flex",
                gap: "4px",
                padding: "5px",
                borderRadius: "999px",
                background: isDark ? "#1F1C17" : "#FFFFFF",
                border: "1px solid " + (isDark ? "#2E2A22" : "#EFE7DA"),
              },
            },
            [
              { label: "Command Center", active: true, onClick: () => navigate("/admin", { role: "admin" }) },
              { label: "Customer Portal", active: false, onClick: () => navigate("/customer", { role: "customer" }) },
              { label: "Worker Portal", active: false, onClick: () => navigate("/worker", { role: "worker" }) },
              { label: "10 km Jobs", active: false, onClick: () => navigate("/jobs", { role: "worker" }) },
              { label: "← Home", active: false, onClick: () => navigate("/", { role: "select_role" }) },
            ].map((item) =>
              h(
                "button",
                {
                  key: item.label,
                  type: "button",
                  onClick: item.onClick,
                  style: {
                    padding: "10px 16px",
                    borderRadius: "999px",
                    border: 0,
                    background: item.active ? (isDark ? "#F5A524" : "#1C1913") : "transparent",
                    color: item.active ? (isDark ? "#14120E" : "#FBF8F2") : isDark ? "#EDE6DA" : "#3D3830",
                    fontSize: "13px",
                    fontWeight: 700,
                  },
                },
                item.label
              )
            )
          ),
          app.currentAdmin &&
            h(
              "div",
              { style: { marginLeft: "auto", display: "flex", alignItems: "center", gap: "10px" } },
              h(
                "span",
                {
                  style: {
                    padding: "6px 12px",
                    borderRadius: "999px",
                    background: "#E3F4E8",
                    color: "#1D6B36",
                    fontSize: "12px",
                    fontWeight: 800,
                  },
                },
                "● " + (app.currentAdmin.email || "Admin Unlocked")
              )
            )
        )
      ),

      // Main Container
      h(
        "main",
        {
          style: {
            maxWidth: "1320px",
            width: "100%",
            margin: "0 auto",
            padding: "28px 24px 80px",
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            flex: 1,
          },
        },
        // Dusk-to-Marigold Hero Banner
        h(
          "section",
          {
            style: {
              position: "relative",
              overflow: "hidden",
              borderRadius: "36px",
              background: "linear-gradient(180deg, #2A2342 0%, #5E4260 55%, #C9805A 100%)",
              color: "#FBF8F2",
              padding: "36px 40px",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: "24px",
            },
          },
          h("div", {
            "aria-hidden": "true",
            style: {
              position: "absolute",
              right: "-60px",
              top: "-60px",
              width: "300px",
              height: "300px",
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(245,165,36,0.38) 0%, rgba(245,165,36,0) 68%)",
            },
          }),
          h(
            "div",
            { style: { position: "relative", display: "flex", flexDirection: "column", gap: "10px", maxWidth: "620px" } },
            h(
              "span",
              {
                style: {
                  alignSelf: "flex-start",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "7px 14px",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,0.14)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "0.6px",
                },
              },
              h("span", { style: { width: "8px", height: "8px", borderRadius: "50%", background: "#5BD68A" } }),
              "KAAMZO OPERATIONS VAULT · 20% FEE & KYC CONSOLE"
            ),
            h(
              "h1",
              { style: { margin: 0, fontSize: "clamp(34px, 4.2vw, 54px)", lineHeight: 0.98, letterSpacing: "-1.6px", fontWeight: 800 } },
              "Admin command ",
              h("span", { style: { fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, color: "#F7C88E" } }, "center.")
            ),
            h(
              "p",
              { style: { margin: 0, fontSize: "15px", lineHeight: 1.5, color: "#EBD9C8" } },
              "Review Aadhaar & Face-ID KYC applications, monitor live GPS jobs & escrow payouts, resolve disputes, and audit security logs."
            )
          ),
          h(
            "div",
            {
              style: {
                position: "relative",
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(120px, 1fr))",
                gap: "10px",
              },
            },
            [
              { label: "VERIFIED WORKERS", val: verifiedCount, col: "#5BD68A" },
              { label: "ACTIVE JOBS", val: activeJobsCount, col: "#F5A524" },
              { label: "PENDING KYC", val: pendingKycCount, col: "#F7C88E" },
              { label: "OPEN DISPUTES", val: openDisputesCount, col: "#FFB4B4" },
            ].map((stat) =>
              h(
                "div",
                {
                  key: stat.label,
                  style: {
                    padding: "12px 16px",
                    borderRadius: "20px",
                    background: "rgba(28,25,19,0.55)",
                    border: "1px solid rgba(255,255,255,0.16)",
                  },
                },
                h("div", { style: { fontSize: "10px", fontWeight: 800, letterSpacing: "0.8px", color: "#EBD9C8" } }, stat.label),
                h("div", { style: { fontFamily: "'Instrument Serif', serif", fontSize: "30px", lineHeight: 1.1, color: stat.col } }, stat.val)
              )
            )
          )
        ),

        // Worker Policy Compliance & Block/Ban Console (CTO Policy Enforcement)
        h("style", null, `[title="Reset Platform Records"] { display: none !important; }`),
        h(
          "section",
          {
            style: {
              borderRadius: "30px",
              background: cardBg,
              border: "1px solid " + borderCol,
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            },
          },
          h(
            "div",
            { style: { display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "12px" } },
            h(
              "div",
              { style: { display: "flex", flexDirection: "column", gap: "4px" } },
              h("span", { style: { fontSize: "11px", fontWeight: 800, letterSpacing: "0.8px", color: "#9B1C1C" } }, "COMPANY POLICY ENFORCEMENT · BAN / BLOCK WORKERS"),
              h("h2", { style: { margin: 0, fontSize: "22px", fontWeight: 800 } }, "Block or reinstate workers for company policy compliance")
            ),
            h("input", {
              type: "text",
              value: policySearch,
              onChange: (e) => setPolicySearch(e.target.value),
              placeholder: "Search worker name, trade, or phone…",
              style: {
                width: "280px",
                maxWidth: "100%",
                height: "42px",
                borderRadius: "999px",
                border: "1px solid " + borderCol,
                padding: "0 16px",
                fontSize: "13px",
                background: isDark ? "#14120E" : "#FBF8F2",
                color: isDark ? "#EDE6DA" : "#1C1913",
              },
            })
          ),
          h(
            "div",
            { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "12px", maxHeight: "360px", overflowY: "auto", paddingRight: "4px" } },
            filteredPolicyWorkers.map((w) => {
              const blocked = isWorkerBlocked(w);
              const penaltyUntil = Math.max(
                Number(w.offlinePenaltyUntil || 0),
                Number((() => { try { return localStorage.getItem("kz_penalty_until_" + w.id) || 0; } catch (_) { return 0; } })())
              );
              const penalized = penaltyUntil > Date.now();
              return h(
                "div",
                {
                  key: w.id,
                  style: {
                    padding: "14px 16px",
                    borderRadius: "20px",
                    background: blocked ? (isDark ? "#2D1818" : "#FFF1F1") : isDark ? "#27231C" : "#FBF8F2",
                    border: "1px solid " + (blocked ? "#E5484D" : borderCol),
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                  },
                },
                h(
                  "div",
                  { style: { display: "flex", flexDirection: "column", gap: "3px", minWidth: 0 } },
                  h(
                    "div",
                    { style: { display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" } },
                    h("b", { style: { fontSize: "15px" } }, w.name),
                    h(
                      "span",
                      {
                        style: {
                          padding: "2px 8px",
                          borderRadius: "999px",
                          background: blocked ? "#E5484D" : penalized ? "#FFF0BF" : "#E3F4E8",
                          color: blocked ? "#FFFFFF" : penalized ? "#6B4600" : "#1D6B36",
                          fontSize: "10px",
                          fontWeight: 800,
                        },
                      },
                      blocked ? "🚫 BLOCKED" : penalized ? "⏳ 24H PENALTY" : "ACTIVE"
                    )
                  ),
                  h("span", { style: { fontSize: "12px", color: isDark ? "#A49B8C" : "#6F685D" } }, `${w.primaryTrade || "Worker"} · ${w.phone || w.id}`)
                ),
                h(
                  "button",
                  {
                    type: "button",
                    onClick: () => toggleBlockWorker(w),
                    style: {
                      height: "36px",
                      padding: "0 14px",
                      borderRadius: "999px",
                      border: 0,
                      background: blocked ? "#2E9E57" : "#E5484D",
                      color: "#FFFFFF",
                      fontWeight: 800,
                      fontSize: "12px",
                      cursor: "pointer",
                      flexShrink: 0,
                    },
                  },
                  blocked ? "Unblock" : "Block Worker"
                )
              );
            })
          )
        ),

        // LegacyAdmin Content Wrapper (preserves 100% of SSO, 2FA OTP, PIN, KYC, Treasury, Security Vault)
        h(
          "div",
          { className: "kz-admin-theme-scope" },
          LegacyAdmin
            ? h(LegacyAdmin, { isEmbedded: true })
            : h(
                "div",
                {
                  style: {
                    padding: "40px",
                    borderRadius: "28px",
                    background: isDark ? "#1F1C17" : "#FFFFFF",
                    border: "1px solid " + (isDark ? "#2E2A22" : "#EFE7DA"),
                    textAlign: "center",
                    fontWeight: 700,
                  },
                },
                "Loading Admin Command Console…"
              )
        )
      ),

      h(KaamzoFooter, null)
    );
  };
})();
