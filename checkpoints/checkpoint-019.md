# Checkpoint 019 — 2026-04-14

## Session: Smart Alert Engine + Discount Threshold Save Fix

Continues from checkpoint-018.md (Advanced Filter Panel 2-Column Compact Layout).

---

## Part 1: Smart Alert Engine

### What Was Built
Proactive business intelligence alerts surfaced inside the existing Activity Feed right panel. The dashboard now detects issues automatically without manual monitoring.

### 4 Alert Types
1. **Overdue Delivery** — `date_required_by` before today AND `delivery_status` not Delivered/Shipped/Received. Shows days overdue.
2. **Low Margin** — `margin_pct` below 15% threshold. Shows the exact margin %.
3. **Supplier Threshold Warning** — supplier spend ≥ 90% but < 100% of discount threshold. Shows % reached.
4. **Critical Flag Reminder** — PO has `priority = "Critical"` in localStorage.

### Architecture
- `window.ALERT_ENGINE` IIFE — self-contained module, exposes `updatePO(rows)`, `updateThreshold(rows)`, `refresh()`
- POR `loadData()` calls `window.ALERT_ENGINE?.updatePO(allRows)` after each fetch
- Discount Threshold `load()` calls `window.ALERT_ENGINE?.updateThreshold(rows)` after each fetch
- De-duplication by `po_number` — one alert per PO per type (prevents line-item row duplicates)
- Configurable constants: `MARGIN_WARN_PCT = 15`, `SPEND_WARN_PCT = 90`

### Panel Restructure
- `#activity-feed` (outer panel-body) unchanged — existing JS references preserved
- `#alert-items` — new container at top of feed, managed by ALERT_ENGINE
- `#alert-feed-divider` — "Recent Activity" label separator, shown only when alerts exist
- `#activity-items` — existing activity items moved into sub-container; Activity Feed IIFE writes here
- `#alert-count-badge` — red pill in panel header showing "N alerts", hidden when 0

### CSS Added
- `.activity-icon.ai-alert-*` — 4 icon background/color variants (red, amber, orange, red)
- `.activity-type.alert-*` — 4 label color variants
- `.activity-item.alert-*` — left border accent per severity (2px solid with opacity)
- `.alert-feed-divider` — uppercase muted separator label

---

## Part 2: Discount Threshold Save Bug Fix

### Problem
Saving a new threshold value would show the correct toast and briefly update the UI, but the old value would reappear after the 10-second poll fired.

### Root Cause
Two issues:
1. **Poll race condition**: `doSave()` is `async` — while awaiting `window.API.updateThreshold()`, the poll interval fires, `load()` re-fetches from Google Sheets (still old value), rebuilds `rows` from scratch, and calls `renderTable()` — wiping the in-memory edit.
2. **Data source priority**: `load()` built threshold from `n(r.threshold || r.threshold_amount || tMap[...])` — the Discount tab's `r.threshold` always won over `tMap` (Thresholds tab, where PUT writes), so even after the API write propagated, the poll still read the stale value.

### Fixes
1. **`_thresholdOverrides` map** — declared at IIFE scope. `doSave()` writes `supplier_name → newVal` immediately. `load()` re-applies overrides after rebuilding rows, before rendering. Poll can never wipe a user edit.
2. **`tMap` priority** — changed `n(r.threshold || r.threshold_amount || tMap[name])` → `tMap[name] || n(r.threshold || r.threshold_amount)` so the Thresholds tab (what PUT updates) wins over the Discount tab.
3. **Alert engine hook** — added `window.ALERT_ENGINE?.updateThreshold(rows)` to `doSave()` so threshold alerts update immediately on save, not just on next poll.

---

## Files Changed
- `f:\po-dashboard\index.html`
  - CSS: alert icon/label/item/divider classes
  - HTML: panel header badge, panel body restructure (alert-items, divider, activity-items sub-container)
  - JS (Activity Feed IIFE): `activityItems` sub-container reference; render writes to `activityItems`
  - JS (ALERT_ENGINE IIFE): full alert engine — `computeAlerts()`, `render()`, `updatePO()`, `updateThreshold()`
  - JS (POR): `window.ALERT_ENGINE?.updatePO(allRows)` hook in `loadData()`
  - JS (Discount Threshold): `_thresholdOverrides` map; override applied in `load()`; `tMap` priority fix; `ALERT_ENGINE?.updateThreshold` + override write in `doSave()`
- `f:\po-dashboard\docs\STATUS.md` — updated

---

## Verification
- Alert Engine: 5 alerts rendered correctly with colored icons, left-border accents, red badge, divider
- Threshold save: value persists after save and survives subsequent poll cycles

---

## Deploy
Push `main` → Vercel auto-deploys.
