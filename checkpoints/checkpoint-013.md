# Checkpoint 013 — 2026-04-14

## Session: Toast Fixes — Not Shipped Color + Auth Guard + Poll Speed

Continues from checkpoint-012.md.

---

## What Was Changed

### 1. Not Shipped Toast — Red Instead of Green
- **Bug:** "Not Shipped" delivery updates were showing as green (`success`) toasts
- **Root cause:** The regex `/shipped/i` in `isDelivery` matched the word inside "Not Shipped", routing it to green
- **Fix:** Added `isNotShipped = /not shipped/i.test(desc)` check that runs first and routes to `'error'` (red)
- Order: `isNotShipped` → red error toast; else `isDelivery` → green success toast

### 2. Toast Auth Guard — Dashboard Only
- **Bug:** Toasts could fire on the login screen (toast system runs before auth completes)
- **Fix:** Added `&& window.AUTH_TOKEN` guard to the toast-firing block
- Toasts now only appear when the user is authenticated and the dashboard is visible
- `window.AUTH_TOKEN` is `null` on login screen, set to JWT token after successful login

### 3. Poll Interval — 30s → 10s
- Reduced `window.POLL_INTERVAL` from `30000` to `10000`
- Minimises delay between parser writing to Google Sheets and toast appearing in dashboard

---

## Files Changed
- `f:\po-dashboard\index.html`
  - Activity feed toast logic (~line 2856): `isNotShipped` check + `AUTH_TOKEN` guard
  - Poll interval (~line 2758): `10000` (was `30000`)

---

## Bug Fixes
- Not Shipped toast was green → now red (`error`)
- Toasts were visible on login screen → now dashboard-only

---

## Pending Deploy
Push `main` → Vercel auto-deploys.
