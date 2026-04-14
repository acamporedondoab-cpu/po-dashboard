# Checkpoint 018 — 2026-04-14

## Session: Advanced Filter Panel — 2-Column Compact Layout

Continues from checkpoint-017.md (Row Metadata Chips + Smart Metadata Filters).

---

## What Was Changed

### Problem
The More Filters panel stacked numeric inputs and metadata toggle buttons vertically (~200px tall), reducing table visibility when open.

### Solution: 2-Column Grid Layout
Restructured both POR and SV advanced filter panels from a flat `flex-wrap` container into a `grid` with `grid-template-columns: max-content 1fr`:

- **Left column** — Supplier Cost, Margin %, Job Number inputs in one horizontal row
- **Right column** — Internal Metadata Filters (Priority / Tag / Special toggles)
- Separated by a vertical `border-right` / `border-left` divider

Panel height when open reduced from ~200px → ~120px.

### CSS Changes
- `.adv-panel.open { max-height: 200px }` — reduced from 300px (tighter animation envelope)
- `transition: max-height .22s` — snapped from .28s for crisper open/close feel
- Added `.meta-filter-section.meta-side` — removes `border-top`, adds `padding-left:16px` for the right-column variant

### HTML Changes (POR + SV)
- Inner panel `div` changed from `display:flex; flex-wrap:wrap` → `display:grid; grid-template-columns:max-content 1fr`
- Numeric inputs wrapped in left-column `div` with `border-right`
- `.meta-filter-section` gets additional class `meta-side`

---

## Behavior Unchanged
- Panel starts collapsed (hidden by default)
- More Filters button toggles it open with chevron rotation
- Active filter chips persist above the table when panel is collapsed
- Chip `×` deactivates the corresponding toggle button
- All filter logic (JS) untouched

---

## Files Changed
- `f:\po-dashboard\index.html`
  - CSS: `.adv-panel.open` max-height + transition, new `.meta-filter-section.meta-side`
  - HTML (POR): `#por-adv-panel` inner layout → 2-col grid
  - HTML (SV): `#sv-adv-panel` inner layout → 2-col grid
- `f:\po-dashboard\docs\STATUS.md` — updated

---

## Verification
- Panel opens to compact 2-column layout (dark + light mode)
- Active filter chips render correctly with colored active states
- Chips persist above table when panel is collapsed
- Filter logic unchanged — all existing filters still work

---

## Deploy
Push `main` → Vercel auto-deploys.
