# Checkpoint 014 — 2026-04-14

## Session: Notification Bell Polish + Discount Threshold Vanish Fix

Continues from checkpoint-013.md.

---

## What Was Changed

### 1. Notification Bell — Mark as Read on Close
- **Behaviour:** Bell dropdown shows alerts while open. On close, bell badge clears and dropdown shows "No alerts" next time.
- Sidebar badges (Not Shipped, Discount Threshold) stay until underlying data changes — they are not affected by read state.
- New data on next poll resets the "new" flags → bell badge reappears.

### 2. Not Shipped — Per-PO Detail in Dropdown
- Each not-shipped PO now shows as its own dropdown item with full detail.
- Title: "PO status: Not Shipped"
- Sub: `PO-25292-20-001 - job # 20 - Rotating Equipment Specialist`
- `window.NOTIFICATIONS.notShippedItems` stores `{po_number, job_number, client_name, supplier_name}` array instead of just a count.

### 3. Discount Threshold — Notification Text Format
- Old: supplier name / "Discount threshold met — 119% of target"
- New: "Threshold met" / "TPS Machining & Welding — 119%"

### 4. Threshold Dot Color — Green → Amber
- Changed `notif-dot-green` (#4CAF50) to `notif-dot-amber` (#F59E0B)
- Prevents clash with green active nav item in sidebar

### 5. Discount Threshold Vanish Bug Fix
- **Bug:** On poll, some supplier cards vanished then reappeared on next refresh.
- **Root cause:** If `discountRaw` returned null/empty during a burst poll, code fell through to `else → SAMPLE` data and re-rendered with fewer suppliers.
- **Fix:** Added `_dtLoaded` flag — same pattern as KPI $0 fix. If already loaded and both APIs return empty, skip re-render to preserve current state.

---

## Files Changed
- `f:\po-dashboard\index.html`
  - CSS: `notif-dot-green` → `notif-dot-amber` (#F59E0B)
  - JS: `window.NOTIFICATIONS` — added `notShippedItems[]`, `_prevThresholdCount`, `_prevNotShippedCount`, `_newThreshold`, `_newNotShipped` flags
  - JS: `updateNotificationBell()` — per-PO not-shipped items, amber dot, "Threshold met" format, mark-as-read on close
  - JS: Bell click handler — closes marks as read (not open); outside-click also marks read
  - JS: Not-shipped `load()` — stores full row objects in `notShippedItems` instead of count
  - JS: Discount threshold `load()` — added `_dtLoaded` guard to prevent vanish on poll failure

---

## Bug Fixes
- Discount threshold suppliers vanishing on activity feed refresh → fixed with `_dtLoaded` guard
- Bell dropdown showing "No alerts" immediately on open → fixed (mark-as-read on close, not open)
- Threshold dot green clashing with active nav → changed to amber

---

## Pending Deploy
Push `main` → Vercel auto-deploys.
