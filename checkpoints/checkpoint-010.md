# Checkpoint 010 — 2026-04-13

## Session: Auth Wall + Login Card UI Polish

Continues from checkpoint-009.md.

---

## What Was Built

### 1. Full Login / Auth System

Stateless HMAC-SHA256 token auth — no npm packages, uses Node built-in `crypto`.

**New file — `api/auth.js`**
- `POST /api/auth` — validates username/password against env vars using `timingSafeEqual`
- Returns signed token: `base64url(header).base64url(payload).hex_hmac`
- 24h TTL in payload `exp` claim
- 200ms artificial delay on failure (timing oracle mitigation)

**Modified — `api/sheets.js`**
- Added `verifyToken()` helper (HMAC verify + expiry check)
- Auth guard: reads `Authorization: Bearer <token>` header, returns 401 if invalid
- Guard wrapped in `if (secret)` — skips auth when `JWT_SECRET` not set (local dev without `.env.local`)
- Updated CORS header to include `Authorization`

**Modified — `scripts/serve.mjs`**
- Added `pathToFileURL` import (required for Windows ESM dynamic imports with absolute paths)
- Added `ROOT = path.dirname(__dirname)` — project root, one level up from `scripts/`
- All static file paths, `.env.local` load, and SPA fallback updated to use `ROOT`
- Dynamic API handler routing: `/api/auth` → `api/auth.js`, `/api/sheets` → `api/sheets.js`
- `ERR_MODULE_NOT_FOUND` catch → 404 JSON response

**Modified — `index.html`**
- Login screen HTML inserted between `<body>` and `<div id="app">`
- Logout button in topbar (34×34px, red hover, sign-out SVG icon)
- Auth IIFE `<script>` before main script:
  - Hides `#app` immediately (zero flash of dashboard)
  - Checks `localStorage('po-auth-token')` for valid unexpired token
  - `showApp()` / `showLogin()` toggle
  - Form submit → `POST /api/auth` → store token → showApp
  - Logout → clear token → showLogin
  - Exposes `window.authLogout` for API 401 handler
- `window.API` updated: all fetch calls include `Authorization: Bearer ${window.AUTH_TOKEN}`, 401 response calls `window.authLogout?.()`

**New env vars — `.env.local`**
```
AUTH_USERNAME=adminaries
AUTH_PASSWORD=Gkh8NcrEkZEHLEcK
JWT_SECRET=dbdfd180d1334b4d5f58e3deb47dee4272bdafc3a4bf20b331d7c3f290765095
```

---

### 2. Item Search Dark Mode Dropdown Fix

Native `<select>` options were invisible in dark mode. Fixed by adding explicit CSS:
```css
html[data-theme="dark"] select.input option { background: #1E1E1E; color: #FFFFFF; }
html[data-theme="dark"] select.input option:checked,
html[data-theme="dark"] select.input option:hover { background: #4CAF50; color: #FFFFFF; }
```

---

### 3. Login Card UI Polish

- Removed logo mark from login screen
- "Welcome Back" (24px Syne bold) + "Sign in to continue" (13px muted) centered above card
- Removed redundant "Sign in" title and subtitle from inside the card
- **Frosted glass card**: `backdrop-filter: blur(20px)`, `rgba(255,255,255,0.45)` light / `rgba(20,20,20,0.45)` dark
- **Shine border**: `mask-composite: exclude` technique
  - `@property --shine-angle` animated from 0→360deg
  - `::before` pseudo-element with rotating `conic-gradient` (green spotlight sweep)
  - Masked to border strip only — no center bleed-through
  - 1.5px border width, 4s rotation

---

## Files Changed

- `f:\po-dashboard\index.html`
- `f:\po-dashboard\api\auth.js` (new)
- `f:\po-dashboard\api\sheets.js`
- `f:\po-dashboard\scripts\serve.mjs`
- `f:\po-dashboard\.env.local`
- `f:\po-dashboard\docs\STATUS.md`

---

## Pending Deploy

Add to Vercel env vars before pushing:
- `AUTH_USERNAME=adminaries`
- `AUTH_PASSWORD=Gkh8NcrEkZEHLEcK`
- `JWT_SECRET=dbdfd180d1334b4d5f58e3deb47dee4272bdafc3a4bf20b331d7c3f290765095`

Then push `main` → Vercel auto-deploys.
