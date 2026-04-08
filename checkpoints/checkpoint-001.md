# Checkpoint 001 — 2026-04-08

## Project: PO Dashboard
Single-file SPA (`index.html`) backed by a Vercel serverless API (`api/sheets.js`) that reads/writes Google Sheets. Served locally via `node serve.mjs` on port 3000.

---

## Stack
- **Frontend**: Single `index.html` — Tailwind CDN, inline styles, vanilla JS IIFEs per page
- **Backend**: `api/sheets.js` — Vercel serverless, Google Sheets API v4 via `googleapis`
- **Auth**: `GOOGLE_CREDENTIALS` env var (service account JSON), `SPREADSHEET_ID` env var
- **Charting**: Chart.js (CDN)
- **PDF export**: jsPDF (CDN)
- **Dev server**: `node serve.mjs` → `http://localhost:3000`

---

## Tabs Built

### 1. Overview
- KPI cards: Total POs, Supplier Cost, Customer Price, Gross Profit
- Profit Over Time chart (line), Spend by Supplier chart (bar)
- Recent POs table (last 5), Delivery Status breakdown
- Data source: `po_headers` tab
- Fix applied: removed SAMPLE_HEADERS fallback (was showing 4 hardcoded POs), added `normalizeDate()` for "DD-Mon-YYYY" format

### 2. PO Register
- Groups line items by PO number — expandable rows
- Each group row shows: Supplier, Date Req. By, Job #, PO Number, Lines count, Supplier Cost, Cust. Price, Gross Profit, Margin, Status
- Expand to see line items: Line #, Description, Item Code, Qty, costs, margin, status
- **Checkboxes** per PO row for selective PDF export
  - Select-all checkbox in header (with indeterminate state for partial selection)
  - Export PDF button shows count badge: "Export PDF (2)"
  - Guard: alert if nothing selected before exporting
- **Search**: `Object.values()` across all fields — immune to `parseGeneric` key-name drift
- Filters: Supplier dropdown, Status dropdown, Date From/To
- Pagination: 20 POs per page
- Data source: `po_line_items` tab (line items) + `po_headers` tab (header metadata)
- Fix applied: `item_code` fallback chain: `r.item_number || r.item_code || r.item_ || r.item`
- Fix applied: `line_number` fallback: `r.line_number || r.line_`

### 3. Supplier View
- Groups line items by PO number — expandable rows (same pattern as PO Register)
- Group row: Supplier, Date Req. By, Job #, PO Number, Lines, Supplier Cost, Cust. Price, Gross Profit, Margin, Status
- Expand to see line items with full detail
- Search: `Object.values()` across all fields
- Filters: Supplier dropdown, Status dropdown, Date From/To + Clear button
- Date filter fixed: uses `toISO()` to normalise "30-Apr-2026" → "2026-04-30" before comparing
- Data source: `supplier_view` tab
- Fix applied: `normalizeRow()` handles `parseGeneric` drift:
  - "Line #" header → key `line_` → mapped to `line_number`
  - "Margin %" header → key `margin_` → mapped to `margin_pct`
  - "Item Number" header → key `item_number` → mapped to `item_code`

### 4. Vendor Spend
- Supplier summary cards (top spend, PO count, avg/PO)
- Bar chart (Chart.js) — spend by supplier
- Breakdown table: Supplier, POs, Lines, Total Spend, Avg/PO
- Data source: `vendor_spend` tab (pre-aggregated)
- Fix applied: `renderVendorSpend()` now detects pre-aggregated format (`po_count` key present) and maps directly instead of running through `aggregate()` which expected raw line items
- Font fix: all number/currency values use `'Inter'` + `font-variant-numeric:tabular-nums` (matching Overview KPI style)

### 5. Delivery Tracker
- Cards: Overdue, Due Soon, On Track, Received counts
- Table sorted by urgency, shows all deliveries
- Data source: `po_headers` tab
- **Pending fix**: Show Item Code (not description) in Description column; show total qty per PO aggregated

### 6. Discount Threshold
- Shows supplier spend vs threshold limits
- Data source: `thresholds` tab + `discount` tab
- **Pending fix**: Ensure table shows Supplier Name, Threshold, Actual Spend, % Reached, Status from live Sheets data

---

## Google Sheets Tab Map (`api/sheets.js`)
| Key           | Sheet Tab Name       | Purpose                          |
|---------------|----------------------|----------------------------------|
| `po_headers`  | PO Headers           | One row per PO, summary fields   |
| `po_line_items`| PO Line Items       | One row per line item            |
| `supplier_view`| Supplier View       | Line items with customer pricing |
| `vendor_spend`| Vendor Spend         | Pre-aggregated spend per supplier|
| `thresholds`  | Thresholds           | Supplier spend threshold limits  |
| `discount`    | Discount Threshold   | Discount trigger thresholds      |
| `activity`    | Activity             | Audit log                        |

---

## Key Patterns / Known Gotchas

### parseGeneric key drift
`parseGeneric` in `api/sheets.js` lowercases headers and strips non-alphanumeric:
- `"Line #"` → `line_`
- `"Margin %"` → `margin_`
- `"Item #"` → `item_`
- `"Total Spend (Inc Tax)"` → `total_spend_inc_tax`

Always add fallback chains in field lookups or use `Object.values()` for search.

### Date formats from Sheets
Dates come as `"30-Apr-2026"` (not ISO). Use `toISO()` before any string comparison:
```js
const MO = {jan:'01',feb:'02',...,dec:'12'};
function toISO(val) {
  if (!val) return '';
  if (/^\d{4}-\d{2}-\d{2}/.test(val)) return val.slice(0,10);
  const m = val.match(/^(\d{1,2})[-\/]([A-Za-z]+)[-\/](\d{4})/);
  if (m) return `${m[3]}-${MO[m[2].slice(0,3).toLowerCase()]||'01'}-${m[1].padStart(2,'0')}`;
  const p = val.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (p) return `${p[3]}-${p[2].padStart(2,'0')}-${p[1].padStart(2,'0')}`;
  return val;
}
```

### Currency values from Sheets
Come as `"$1,500.00"` strings. Always strip before parsing:
```js
parseFloat(String(val).replace(/[^0-9.-]/g, '')) || 0
```

### Robust search pattern
```js
const haystack = Object.values(r)
  .filter(v => typeof v === 'string')
  .join(' ')
  .toLowerCase();
if (!haystack.includes(q)) return false;
```

---

## Pending Work (as of this checkpoint)
1. **Delivery Tracker** — show Item Code in Description column; aggregate total qty per PO
2. **Discount Threshold** — wire to live Sheets data (Supplier Name, Threshold, Actual Spend, % Reached, Status)

---

## Local Dev
```bash
node serve.mjs          # starts http://localhost:3000
node screenshot.mjs http://localhost:3000   # screenshots to ./temporary screenshots/
```
