# Stitch Enhanced Prompts: Kaamzo `/customer` & `/worker`

## Screen 1: `/customer` — Customer Portal

**PLATFORM:** Web & Hybrid Mobile App (Android/iOS Capacitor), Responsive 360px Mobile-First to 1280px Desktop

**DESIGN SYSTEM (REQUIRED):**
See `DESIGN.md` — Warm Alabaster (`#FAF7F2`) / Obsidian Zinc (`#0B0D12`), Calibrated Saffron Amber (`#F59E0B`) primary accent, Verified Emerald (`#16A34A`) status indicator, `Plus Jakarta Sans` + `tabular-nums` numeric alignment, tactile spring transitions (`cubic-bezier(0.22, 1, 0.36, 1)`), `min-height: 100dvh`.

**PAGE STRUCTURE:**
1. **Header:** Sticky navigation bar with Kaamzo mark, Customer Portal indicator, Ludhiana / operating city GPS calibrator, audio accessibility reader toggle, language selector, theme switcher, and Switch Role control (`min-h: 44px`).
2. **Hero Section:** Asymmetric split grid (`#kaamzo-customer-hero`) with headline, quick-launch actions ("Post a Job Broadcast", "Scan Worker Badge", "Live ETA & OTP Timer", "Crew & 1-Tap Rebook", "SOS Check-In"), and 2x2 visual trade Bento cards.
3. **Primary Content Area:** Active bookings list, live 10km worker availability radar, 4-digit Start/End Work OTP Escrow release controls, and Multi-Worker Crew wage estimator.
4. **Footer:** Minimal bottom bar with copyright, Investor Pitch action, and Terms of Service link.

---

## Screen 2: `/worker` — Worker Portal

**PLATFORM:** Web & Hybrid Mobile App (Android/iOS Capacitor), Mobile-First Single-Column under 768px

**DESIGN SYSTEM (REQUIRED):**
See `DESIGN.md` — High-contrast outdoor readability on both `#FAF7F2` and `#0B0D12`, tabular figures for daily wages and attendance timers, zero pure `#000000` backgrounds, hairline borders separating high-density ledger entries.

**PAGE STRUCTURE:**
1. **Header:** Sticky header with Worker Portal badge, live city/GPS status, online availability switch, and Switch Role control.
2. **Hero / Earnings Overview Card:** Three-card metric row displaying Withdrawable Balance, Escrow Pending, and Weekly Total in tabular monospace figures alongside editable UPI payout ID (`name@bank`) and one-tap withdrawal trigger.
3. **Primary Content Area:** Incoming 10km job broadcast cards with one-tap acceptance, active job Start/End 4-digit OTP attendance clock (`HH:MM:SS`), Recent Khata Ledger rows separated by `1px` dividers, downloadable QR-embedded Verified Society Gate-Pass ID card, and SOS GPS Safety Check-In modal.
4. **Footer:** Compact bottom footer with Helpline & Terms links.
