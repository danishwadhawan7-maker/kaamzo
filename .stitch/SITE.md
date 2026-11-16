# Site Constitution: Kaamzo

## 1. Core Identity
- **Project Name:** Kaamzo (`kaamzo.site`)
- **Stitch Project ID:** `[Stitch Project ID — pending active StitchMCP OAuth connection]`
- **Mission:** Connect verified daily-wage workers and hyperlocal customers within a 10km GPS radius with zero worker commission, 4-digit Start/End Work OTP attendance, and UPI Escrow protection.
- **Target Audience:** Indian homeowners, contractors, and housing societies hiring local tradespeople (`/customer`), alongside verified skilled workers and helpers managing incoming jobs, payouts, and gate-passes (`/worker`).
- **Voice:** Direct, high-trust, practical, bilingual-ready, zero-fluff.

## 2. Visual Language
- **Vibe (Adjectives):** Utilitarian, High-Trust, Warm-Industrial

## 3. Architecture & File Structure
- **Root Production Directory:** `www/` (synced to Capacitor `android/` and `ios/`)
- **Entry & Bundle:** `www/index.html`, `www/assets/index-v30.js`, synced route shims via `scripts/vite-shim.js`
- **Asset Flow:** `.stitch/DESIGN.md` + `.stitch/prompts/` → CSS token bridge in `www/index.html` → `node scripts/vite-shim.js` → `npx cap sync` → Vercel production
- **Navigation Strategy:** Direct top-level SPA portal routing between `/` (Landing / Role Switcher), `/customer` (Customer Portal), `/worker` (Worker Portal), and `/admin` (Admin Operations Console), preserving clean `window.history.pushState` URLs and full `popstate` history.

## 4. Live Sitemap
- [x] `index.html` (`/`) — Home & Role Selector
- [x] `customer.html` (`/customer`) — Customer Portal (Post Job Broadcast, 10km Radar, Crew & 1-Tap Rebook, Live ETA & OTP Timer, Scan Worker Badge)
- [x] `worker.html` (`/worker`) — Worker Portal (Incoming Job Radar, Start/End OTP Attendance, Digital Khata & Society Gate-Pass ID, SOS Check-In)
- [x] `admin.html` (`/admin`) — Platform Operations & Security Audit Vault

## 5. Roadmap Backlog
- **High Priority:** Maintain 2 dedicated customer/worker URL routes (`/customer` and `/worker`) backed by shared Firebase Auth & Firestore and Stitch `DESIGN.md` token calibration.
- **Medium Priority:** Tokenize typography (`Plus Jakarta Sans` + `tabular-nums`), `100dvh` viewport discipline, tactile spring interactions, and dark/light parity across both portals.
- **Low Priority:** Optional Stitch MCP remote screen sync once dynamic client registration / Stitch MCP login is authorized in the environment.

## 6. Creative Freedom Guidelines
- Preserve all working React logic, Firebase OAuth/Firestore hooks, Audio Reader, and WhatsApp OTP verification while applying non-destructive Stitch `taste-design` visual tokens and structured prompt artifacts.
