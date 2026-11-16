---
page: customer
---
Customer Hiring Portal & Asymmetric Trade Dispatch Screen (`/customer`) for Kaamzo.

**DESIGN SYSTEM (REQUIRED):**
- Visual Theme: Calibrated, utilitarian-yet-warm daily-wage marketplace interface (Density 6, Variance 6, Motion 6).
- Light Surface: Warm Alabaster Canvas (`#FAF7F2`) with Pure Surface White (`#FFFFFF`) cards, Charcoal Ink (`#111827`) headings, and Whisper Border (`#EDE8E0`).
- Dark Surface: Obsidian Zinc (`#0B0D12`) header and Elevated Midnight Slate (`#12151E`) cards, Crisp Ivory (`#F8FAFC`) text, and warm Whisper Border Dark (`rgba(245, 158, 11, 0.25)`). Never pure `#000000`.
- Singular Accent: Calibrated Saffron Amber (`#F59E0B`) for primary CTAs and focus rings; Verified Emerald (`#16A34A`) strictly for Aadhaar KYC and UPI Escrow release verification.
- Typography: `Plus Jakarta Sans` display/body (`-0.025em` tracking on headlines, `16px` base body, `65ch` max width) and `JetBrains Mono` / `tabular-nums` for wages, distances, and OTPs.
- Controls: Tactile `-1px` active press using `cubic-bezier(0.22, 1, 0.36, 1)` spring timing and `44px` minimum mobile touch targets.

**PAGE STRUCTURE:**
1. **Header:** Sticky Obsidian Zinc (`#0B0D12`) or Warm Alabaster (`#FAF7F2`) bar (`z-50`) with Kaamzo brand mark, active role badge, operating city GPS selector, theme toggle, language switcher, and Worker/Role Switch button.
2. **Hero Section (`/customer`):** Offset 2-column asymmetric Bento layout (`1.15fr` / `0.95fr`) pairing concise value headline and primary Saffron Amber CTA ("Post a Job Broadcast") + secondary Ghost actions ("Scan Worker Badge", "Crew & 1-Tap Rebook", "Live ETA & OTP Timer", "SOS Check-In") alongside a 2x2 photographic trade card grid.
3. **Primary Content Area:** Interactive 10km worker availability feed, Start/End 4-digit Work OTP escrow modal, Multi-Worker Crew daily-wage calculator, and active job booking tracker collapsing cleanly to single column below `768px`.
4. **Footer:** Compact single-row legal & Investor Pitch bar with Terms of Service link.
