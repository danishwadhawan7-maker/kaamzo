# Design System: Kaamzo (`/customer` & `/worker`)

## 1. Visual Theme & Atmosphere
A calibrated, utilitarian-yet-warm daily-wage marketplace interface built for speed under sunlight on mobile devices and cockpit clarity on desktop. Density sits at 6 (daily-app balanced), Variance at 6 (offset asymmetric customer hero paired with clean modular portal strips), and Motion at 6 (fluid CSS spring physics). Light mode evokes warm limestone and studio drafting paper; dark mode shifts to deep obsidian zinc surfaces framed by hairline amber-gold edges.

## 2. Color Palette & Roles
- **Warm Alabaster Canvas** (`#FAF7F2`) — Primary light-mode viewport background canvas
- **Obsidian Zinc** (`#0B0D12`) — Primary dark-mode surface and sticky header foundation (never pure `#000000`)
- **Pure Surface White** (`#FFFFFF`) — Light-mode elevated card, modal, and input container fill
- **Elevated Midnight Slate** (`#12151E`) — Dark-mode card and navigation panel fill
- **Charcoal Ink** (`#111827`) — Light-mode primary headings, labels, and body copy
- **Crisp Ivory** (`#F8FAFC`) — Dark-mode high-contrast typography and active labels
- **Muted Steel** (`#64748B`) — Secondary metadata, timestamps, distance readouts, and helper text
- **Whisper Border Light** (`#EDE8E0`) — 1px structural hairline dividers on light surfaces
- **Whisper Border Dark** (`rgba(245, 158, 11, 0.25)`) — Subtle warm-tinted borders on dark surfaces
- **Calibrated Saffron Amber** (`#F59E0B`) — Singular brand accent for primary CTAs, active navigation tabs, focus rings, and city selector highlights
- **Verified Emerald** (`#16A34A`) — Functional verification state exclusively for Aadhaar KYC badges, UPI Escrow release, and Active Check-In confirmations

## 3. Typography Rules
- **Display & Body:** `Plus Jakarta Sans`, sans-serif — Track-tight headings (`-0.025em`) with hierarchy driven by font weight (`700`–`800`) and contrast rather than oversized display scales; body prose uses `16px` minimum base with `1.5` line-height and `65ch` maximum line measure.
- **Mono / Tabular Figures:** `JetBrains Mono` (paired with `font-variant-numeric: tabular-nums`) — Enforced across all daily-wage amounts, UPI Escrow balances, 10km GPS distances, 4-digit Start/End OTP inputs, and Digital Attendance `HH:MM:SS` timers.
- **Banned:** `Inter`, generic system serif fonts (`Times New Roman`, `Georgia`, `Garamond`), and decorative serif typography inside portal dashboards.

## 4. Component Stylings
- **Buttons:** Flat tactile construction with `-1px` vertical press translation (`translateY(-1px)`) on active state and `44px` minimum accessible tap height on mobile. Primary CTAs use Calibrated Saffron Amber (`#F59E0B`) with high-contrast Charcoal Ink (`#111827`) labels; secondary actions use bordered Pure Surface / Midnight Slate ghost containers. No neon outer glows or purple gradient washes.
- **Cards & Containers:** Generously rounded corners (`18px`–`24px` on portal cards, `12px`–`14px` on compact ledger rows) with 1px hairline borders and diffused whisper shadows tinted to the active canvas hue. High-density Khata and job history lists separate entries with `1px` border dividers rather than nested floating shadows.
- **Inputs & Forms:** Descriptive label positioned cleanly above the control, optional concise helper text, `16px` minimum input font size (preventing iOS Safari auto-zoom), and a crisp `3px` Calibrated Saffron Amber (`rgba(245, 158, 11, 0.22)`) focus ring.
- **Loaders & Status Indicators:** Skeleton shimmer placeholders matching card geometry; hardware-accelerated CSS pulse indicators reserved strictly for live 10km GPS radar sweeps and active attendance timers.
- **Empty States:** Structured instructional panels prompting direct next actions (e.g., broadcasting a job, scanning a worker QR badge, or updating UPI settlement details).

## 5. Layout Principles
- **Viewport Height Discipline:** Use `min-height: 100dvh` on root containers (`body`, `.kaamzo-landing-page`, and portal roots) — never `100vh` alone — to avoid mobile Safari viewport jumps.
- **Asymmetric Split Hero (`/customer`):** Offset 1.15fr headline/action zone paired with a 0.95fr 2x2 Bento visual grid (`#kaamzo-customer-hero`) inside a `1280px` centered max-width frame.
- **Grid-First Responsive Collapse:** Multi-column grids collapse cleanly to single-column stacking below `768px` (`100%` width action buttons below `480px`), with zero horizontal overflow on `360px`–`375px` viewports.
- **Spatial Separation:** Non-overlapping spatial zones with generous vertical rhythm (`24px`–`36px` container padding on desktop, `12px`–`16px` on compact screens).

## 6. Motion & Interaction
- **Spring Physics:** Transitions use `cubic-bezier(0.22, 1, 0.36, 1)` (`180ms`–`220ms`) for crisp, weighty tactile feedback; linear easing is disallowed on interactive controls.
- **Perpetual Micro-Interactions:** Subtle status beacon animations on live worker radar and attendance clocks, isolated to GPU-composited properties.
- **Performance Rule:** Animate exclusively via `transform`, `opacity`, and `box-shadow`/`border-color` — never animate `top`, `left`, `width`, or `height`.

## 7. Anti-Patterns (Banned)
- No AI purple/blue neon button glows or oversaturated multi-hue header gradients.
- No pure `#000000` black backgrounds anywhere; always use Obsidian Zinc (`#0B0D12`) or Deep Charcoal (`#0F172A`).
- No emojis in formal design tokens, specification copy, or metric cards.
- No generic placeholder personas (`John Doe`, `Acme`, `Nexus`) or fabricated system performance percentage cards.
- No centered symmetric hero cards when an asymmetric Bento layout is active.
- No horizontal scroll overflow on `360px` or `375px` mobile screens.
- No generic scroll-prompt text (`Scroll to explore`, `Swipe down`, bouncing chevrons).
