# Checkpoint 002 — 2026-04-08

## Project: PO Dashboard
Single-file SPA (`index.html`) backed by a Vercel serverless API (`api/sheets.js`) that reads/writes Google Sheets. Served locally via `node serve.mjs` on port 3000.

Continues from checkpoint-001.md. Records all work completed in the second session.

---

## Stack
- **Frontend**: Single `index.html` — Tailwind CDN, inline styles, vanilla JS IIFEs per page
- **Backend**: `api/sheets.js` — Vercel serverless, Google Sheets API v4 via `googleapis`
- **Auth**: `GOOGLE_CREDENTIALS` env var (service account JSON), `SPREADSHEET_ID` env var
- **Charting**: Chart.js (CDN)
- **PDF export**: jsPDF (CDN)
- **Dev server**: `node serve.mjs` → `http://localhost:3000`

---

## Tabs Status

### 1. Overview ✅
- KPI cards: Total POs, Supplier Cost, Customer Price, Gross Profit
- Profit Over Time chart (line), Spend by Supplier chart (bar)
- Recent POs table (last 5), Delivery Status breakdown
- Data source: `po_headers` tab (via `parseGeneric`)
- Fixes from prior session: removed SAMPLE_HEADERS fallback, added `normalizeDate()` for "DD-Mon-YYYY" format

### 2. PO Register ✅
- Groups line items by PO number — expandable rows
- Group row: Supplier, Date Req. By, Job #, PO Number, Lines, Supplier Cost, Cust. Price, Gross Profit, Margin, Status
- Expand to see line items: Line #, Description, Item Code, Qty, costs, margin, status
- Checkboxes per PO row for selective PDF export (with select-all, badge count, guard)
- Search: `Object.values()` across all fields
- Filters: Supplier dropdown, Status dropdown, Date From/To
- Pagination: 20 POs per page
- Data source: `po_line_items` + `po_headers`
- Fix: `item_code` fallback chain; `line_number` fallback

### 3. Supplier View ✅ (overhauled this session)
- Groups line items by PO number — expandable rows (same pattern as PO Register)
- Group row: Supplier, Date Req. By, Job #, PO Number, Lines, Supplier Cost, Cust. Price, Gross Profit, Margin, Status
- Expand to see line items with full detail
- Search: `Object.values()` across all fields (immune to parseGeneric drift)
- Filters: Supplier dropdown, Status dropdown, Date From/To + Clear button
- Date filter uses `toISO()` to normalise "30-Apr-2026" → "2026-04-30" before comparing
- Data source: `supplier_view` tab
- `normalizeRow()` handles parseGeneric drift:
  - "Line #" → `line_` → mapped to `line_number`
  - "Margin %" → `margin_` → mapped to `margin_pct`
  - "Item Number" → `item_number` → mapped to `item_code`
  - `date_required_by` converted via `toISO()` at load time

### 4. Vendor Spend ✅ (fixed this session)
- Supplier summary cards (top spend, PO count, avg/PO)
- Bar chart (Chart.js) — spend by supplier
- Breakdown table: Supplier, POs, Lines, Total Spend, Avg/PO
- Data source: `vendor_spend` tab (pre-aggregated)
- **Fix**: `renderVendorSpend()` detects pre-aggregated format (`po_count` key or key containing `spend`) and maps directly instead of calling `aggregate()` which expected raw line items
- **Fix**: All number/currency values use `'Inter'` + `font-variant-numeric:tabular-nums` (matching Overview KPI style)
- Live data: Craigs Welding Ltd $4,612.50 (1 PO, 3 lines), TPS Machining & Welding $2,698.51 (1 PO, 6 lines)

### 5. Delivery Tracker ⚠️ (pending)
- Cards: Overdue, Due Soon, On Track, Received counts
- Table sorted by urgency
- Data source: `po_headers` tab
- **Pending fix**: Show Item Code in Description column; aggregate total qty per PO

### 6. Discount Threshold ✅ (overhauled this session)
- Cards: suppliers at/above threshold, approaching, below
- Table: Supplier Name, Threshold, Actual Spend, % Reached, Status
- Data source: `discount` tab (primary) + `thresholds` tab (supplement)
- **Fix**: Rewrote `load()` to use `Promise.all` fetching both tabs simultaneously; `discount` tab is primary, `thresholds` tab supplements missing suppliers
- **Fix**: Suppliers only in `thresholds` (e.g. Craigs Welding Ltd) are added with $0 actual spend
- **Known data gap**: Craigs Welding Ltd shows $0 actual spend — Craigs exists in `thresholds` tab but not in `discount` tab. Two options discussed:
  - Option A: Manually add Craigs to Discount Threshold Google Sheet
  - Option B: Code cross-references `vendor_spend` tab to pull actual spend for suppliers missing from `discount`
  - **Awaiting user decision**

---

## Google Sheets Tab Map (`api/sheets.js`)
| Key             | Sheet Tab Name       | Purpose                          |
|-----------------|----------------------|----------------------------------|
| `po_headers`    | PO Headers           | One row per PO, summary fields   |
| `po_line_items` | PO Line Items        | One row per line item            |
| `supplier_view` | Supplier View        | Line items with customer pricing |
| `vendor_spend`  | Vendor Spend         | Pre-aggregated spend per supplier|
| `thresholds`    | Thresholds           | Supplier spend threshold limits  |
| `discount`      | Discount Threshold   | Discount trigger thresholds      |
| `activity`      | Activity             | Audit log                        |

---

## Key Patterns / Known Gotchas

### parseGeneric key drift
`parseGeneric` in `api/sheets.js` lowercases headers and strips non-alphanumeric:
- `"Line #"` → `line_`
- `"Margin %"` → `margin_`
- `"Item #"` → `item_`
- `"% Reached"` → `_reached`
- `"Total Spend (Inc Tax)"` → `total_spend_inc_tax`

Always add fallback chains in field lookups or use `Object.values()` for search.

### Date formats from Sheets
Dates come as `"30-Apr-2026"` (not ISO). Use `toISO()` before any string comparison:
```js
const MO = {jan:'01',feb:'02',mar:'03',apr:'04',may:'05',jun:'06',jul:'07',aug:'08',sep:'09',oct:'10',nov:'11',dec:'12'};
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

### Pre-aggregated vs raw line-item detection (Vendor Spend)
```js
if (vsRaw && vsRaw.length > 0 && (vsRaw[0].hasOwnProperty('po_count') || Object.keys(vsRaw[0]).some(k => k.includes('spend')))) {
  // pre-aggregated: map directly
} else {
  // raw line items: run through aggregate()
}
```

### Dynamic key lookup for drifted keys
```js
// "% Reached" → "_reached" (leading underscore, not found by name)
const pctKey = Object.keys(r).find(k => k.includes('reached')) || '';
```

---

## Actual Sheet Data (as of checkpoint)

### Vendor Spend tab
| Supplier Name            | PO Count | Line Items | Total Spend (Inc Tax) |
|--------------------------|----------|------------|-----------------------|
| Craigs Welding Ltd       | 1        | 3          | $4,612.50             |
| TPS Machining & Welding  | 1        | 6          | $2,698.51             |

### Thresholds tab
| Supplier Name            | Threshold Amount |
|--------------------------|-----------------|
| Craigs Welding Ltd       | $15,000          |
| TPS Machining & Welding  | $10,000          |

---

## Pending Work (as of this checkpoint)
1. **Delivery Tracker** — show Item Code in Description column; aggregate total qty per PO
2. **Craigs Welding Ltd actual spend** — decide: Option A (add to Discount Threshold sheet manually) or Option B (code cross-references `vendor_spend` tab)

---

## Local Dev
```bash
node serve.mjs          # starts http://localhost:3000
node screenshot.mjs http://localhost:3000   # screenshots to ./temporary screenshots/
```
