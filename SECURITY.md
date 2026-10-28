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

## Resolved in Latest Hardening Update
1. **Customer & Worker Passwords**:
   - Plaintext passwords are NEVER stored in Firestore `accounts` or `localStorage`.
   - All passwords are deterministically hashed before persistence; Firestore `accounts` only receives `passwordHash`.
2. **OTP Security**:
   - Raw OTP passcodes are NEVER written to public Firestore documents (only `codeHash` if synced).
   - Firestore rules for `securityVerifications` enforce `allow read: if false;` so passcodes cannot be sniffed with the Firebase Web API key.
   - OTP verification is routed to the server's rate-limited `/api/verify-otp` with brute-force invalidation after 3 failed attempts.
3. **Database Protection & Rules**:
   - Deletions (`allow delete: if false;`) are strictly blocked on all collections from the client; resets are routed through the authenticated server admin API.
   - Production Firestore rules with strict schema validation and size caps are deployed to `kaamzo-631f4`.
4. **Out-of-the-box Dev Environment**:
   - Local `.env` is initialized and gitignored with scrypt hashes and session secret.

## Architecture & Credentials
- Admin credentials reside entirely in server-side environment variables and are never bundled or exposed in client inspection.
- To rotate, run `node scripts/hash-secret.js` and update `.env`.
