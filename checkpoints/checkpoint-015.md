# Checkpoint 015 — 2026-04-14

## Session: Advanced Filtering System — Search Highlighting, Filter Chips, Advanced Panel

Continues from checkpoint-014.md.

---

## What Was Changed

### 1. Search Highlighting
- `hlText(str, q)` helper function added to both PO Register and Supplier View modules
- HTML-escapes input (`&`, `<`, `>`) before applying regex to prevent XSS
- Wraps each match in `<mark class="hl">` — amber highlight on matched text
- Applied to: supplier name, job number, PO number (group rows) + description, item code (detail rows) in PO Register
- Applied to: supplier name, job number, PO number, description, item code in Supplier View

### 2. Filter Chips
- `renderChips()` function added to both modules
- Reads all active filter input values, builds removable pill chips above the table
- Each chip shows the filter label + value; clicking × clears that input and re-applies filters
- Chips row hidden when no filters active, shown as flex-wrap row when any are active
- Covers: Search, Supplier, Status, Date From/To, Cost Min/Max, Margin Min/Max, Job Number

### 3. Advanced Filter Panel
- Collapsible panel (`adv-panel`) below the toolbar, toggled by "More filters" button
- Smooth open/close animation via `max-height` + `opacity` CSS transition
- Button shows active state (green border + tint) and chevron rotates 180° when open
- **PO Register fields:** Supplier Cost range (min/max $), Margin % range (min/max), Job Number text
- **Supplier View fields:** Supplier Cost range, Margin % range, Job Number text
- Numeric range filters applied at PO group level (post-grouping) to match aggregate cost/margin
- Advanced inputs wired to `applyFilters()` on `input` event; sv-clear also clears adv inputs

---

## New CSS Classes
- `mark.hl` — amber search highlight (`rgba(245,158,11,.22)`, lighter in light mode at `.3`)
- `.chips-row` — flex-wrap container for filter chips
- `.filter-chip` — green-tinted pill with label text
- `.chip-x` — circular × button inside each chip
- `.adv-panel` — collapsible container with max-height transition
- `.adv-filter-btn` — toolbar button for toggling panel (active state: green border/bg)
- `.adv-input-group` / `.adv-input-row` — layout helpers for advanced filter fields

---

## Files Changed
- `f:\po-dashboard\index.html`
  - CSS: 3 new sections (mark.hl, chips, advanced panel/button/inputs)
  - HTML: PO Register toolbar + chips row + advanced panel (por- prefix IDs)
  - HTML: Supplier View toolbar + chips row + advanced panel (sv- prefix IDs)
  - JS (initPORegister): `currentQ`, `hlText()`, `renderChips()`, extended `applyFilters()`, extended `wireControls()`
  - JS (initSupplierView): same pattern with sv- prefix, uses `supplier_cost` + `gross_profit/customer_price` for margin

---

## Verification
Screenshots taken and confirmed:
- PO Register toolbar with "More filters" button visible
- Supplier View toolbar with "More filters" button and Clear button
- PO Register: advanced panel open with Supplier Cost/Margin/Job fields; chips "Search: 'TPS'" and "Margin ≥ 20%" visible
- Supplier View: advanced panel open; chips "Search: 'West'" and "Job: JOB-1031" visible

---

## Pending Deploy
Push `main` → Vercel auto-deploys.
