# Checkpoint 016 — 2026-04-14

## Session: Procurement Detail / Action Drawer

Continues from checkpoint-015.md.

---

## What Was Changed

### Global PO Detail Drawer
- Single slide-out panel (`#po-drawer`) fixed to the right edge, 500px wide, max 96vw
- Animated: `transform: translateX(100%) → translateX(0)` with `.32s cubic-bezier(.4,0,.2,1)`
- Semi-opaque backdrop (`#po-drawer-backdrop`) with `backdrop-filter: blur(2px)`
- Closes via: × button, backdrop click, Escape key
- `window.openPODrawer(data)` global function — any page can call it with a PO data object

### Drawer Content Sections
1. **Header** — PO number (green Syne font, 17px), status badge
2. **PO Information** — 2-column info grid: Supplier, Customer, Job #, Required By, Urgency (if present), Description + Qty (for DT rows)
3. **Financials** — 4 stat cards: Supplier Cost, Cust. Price, Gross Profit, Margin % (color-coded)
4. **Line Items** — horizontally scrollable table with #, Description, Item Code, Qty, Cost, Price, Margin %, Status per line (only shown when `lines[]` is present)

### PO Register Integration
- Row click (excluding checkbox cell and expand cell) → `openPODrawer(groupData)`
- `por-expand-cell` class added to the Lines `<td>` — clicking it toggles inline expand with `stopPropagation` (preserves existing expand behavior)

### Supplier View Integration
- Row click (excluding `sv-expand-cell`) → `openPODrawer(groupData)`
- `sv-expand-cell` class added to supplier name `<td>` — clicking it toggles inline expand with `stopPropagation`

### Not Shipped Integration
- `ns-row drawer-row-clickable` classes on each `<tr>`
- `data-idx` attribute + `_nsRows[]` module-level array
- Row click → `openPODrawer` with po_headers data (no line items)

### Delivery Tracker Integration
- `dt-row drawer-row-clickable` classes on each `<tr>`
- `data-idx` attribute + `_dtRows[]` module-level array
- Row click → `openPODrawer` with urgency, description, qty populated

---

## New CSS Classes
- `#po-drawer-backdrop` — fixed overlay with blur
- `#po-drawer` — fixed right panel with slide animation
- `.drawer-header` — PO number + status + close button row
- `.drawer-close` — circular × close button
- `.drawer-body` — scrollable content area
- `.drawer-section` / `.drawer-section-label` — labeled content sections
- `.drawer-info-grid` / `.drawer-info-item` / `.drawer-info-label` / `.drawer-info-value` — 2-col info grid
- `.drawer-fin-row` / `.drawer-fin-card` / `.drawer-fin-label` / `.drawer-fin-value` — 4-col financials row
- `.drawer-lines-wrap` / `.drawer-lines-table` — scrollable line items table
- `.drawer-row-clickable` — cursor pointer + green hover tint for NS/DT rows

---

## Files Changed
- `f:\po-dashboard\index.html`
  - CSS: drawer system (backdrop, panel, sections, financials, lines table, row hover)
  - HTML: `#po-drawer-backdrop` + `#po-drawer` structure before `</body>`
  - JS (global): `window.openPODrawer()` + backdrop/close wiring
  - JS (PO Register): row click → drawer; `por-expand-cell` td for inline expand
  - JS (Supplier View): row click → drawer; `sv-expand-cell` td for inline expand
  - JS (Not Shipped): `_nsRows[]` + clickable rows + click handler
  - JS (Delivery Tracker): `_dtRows[]` + clickable rows + click handler

---

## Verification
- Drawer opens correctly in dark mode and light mode
- Escape key and backdrop click both close drawer
- DT row click: shows urgency, description, qty, no financials (none available for individual line items)
- POR manually tested: shows full 3-section layout with line items table
- NS: row click passes headers data (no line items section shown)
- Expand behavior preserved in POR and SV (chevron/expand cell still works)

---

## Pending Deploy
Push `main` → Vercel auto-deploys.
