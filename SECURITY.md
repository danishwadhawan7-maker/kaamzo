# Kaamzo Admin Security

## What was wrong (found by inspecting the shipped bundle)
Anyone could open DevTools → Sources / view-source and read:
- the admin master password (`Kaamzo@Admin#2026`) and a backdoor password (`admin123`)
- the default Security PIN (`2026`), printed in the UI as well
- the admin email whitelist
- the "2FA OTP" was generated in the browser with `Math.random()` and compared in the browser,
  and the unlock flag was just `sessionStorage["kaamzo_admin_mfa_unlocked"]="true"` (bypassable in the console).

Client-side checks can never protect an admin area. All of this is now **server-side**.

## What it is now
`admin-security.js` (loaded by `server.js`):
- Secrets only in server env vars: `ADMIN_EMAILS`, `ADMIN_PASSWORD_HASH`, `ADMIN_PIN_HASH`, `SESSION_SECRET` (scrypt hashes, nothing readable in the browser). Not configured ⇒ admin login is disabled (fails closed).
- Login = password (or Google SSO, ID token verified server-side) → emailed one-time code **and** PIN → session.
- Session: HttpOnly + SameSite=Strict + Secure cookie, HMAC-signed, server-side revocable, 15 min idle / 8 h absolute.
- Brute force: 5 failures ⇒ 15 min lockout per IP and per email; OTP max 5 tries; uniform "Invalid credentials" errors; constant-time compares.
- CSRF/Origin check on admin POSTs; no CORS on admin routes; CORS allow-list elsewhere (no `*`).
- Step-up PIN required for DB reset; wipe endpoint needs a session.
- Security headers, 100 KB body limit, rate limits, path-traversal/dotfile blocking, audit log (`logs/admin-audit.log`).

## Setup
```
npm install
node scripts/hash-secret.js            # password hash -> ADMIN_PASSWORD_HASH
node scripts/hash-secret.js            # PIN hash      -> ADMIN_PIN_HASH
node scripts/hash-secret.js --random   # SESSION_SECRET
cp .env.example .env                   # fill in, never commit
npm start
```
Firebase Hosting is static, so `/api/*` needs a backend: deploy the included `Dockerfile` to Cloud Run and
add to `firebase.json` hosting: `"rewrites":[{"source":"/api/**","run":{"serviceId":"kaamzo-api","region":"asia-south1"}}, ...]`.

## Rotate credentials
Change `ADMIN_PASSWORD_HASH` / `ADMIN_PIN_HASH` / `SESSION_SECRET` and restart (SESSION_SECRET change logs everyone out).
**The old `Kaamzo@Admin#2026`, `admin123` and `2026` were public – treat them as compromised.** They are in git history too.

## Still open (not fixed by this change)
1. `accounts` documents (including plaintext passwords) and OTP records in Firestore are readable with the public Firebase key. Needs migration to Firebase Auth + per-user rules.
2. Worker/customer login is still client-side. Admin *data* (workers, jobs) is not protected by this gate; only Firestore rules can do that.
3. A CSP header was not added (the app relies on inline scripts and several Google origins).
