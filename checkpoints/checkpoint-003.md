# Checkpoint 003 — 2026-04-09

## Project: PO Dashboard
Single-file SPA (`index.html`) backed by a Vercel serverless API (`api/sheets.js`) that reads/writes Google Sheets. Served locally via `node serve.mjs` on port 3000.

Continues from checkpoint-002.md. Records all work completed in the third session.

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
- Profit Over Time chart — single dot when only one date exists (enlarges to 8px radius for visibility)
- Spend by Supplier chart (bar), Recent POs table (last 5, horizontal scroll), Delivery Status breakdown
- **Fix this session**: KPIs now exclude "Not Shipped" POs from totals
- Data source: `po_headers` tab

### 2. PO Register ✅
- Groups line items by PO — expandable rows
- Checkboxes + PDF export, search, filters, pagination (20/page)
- Data source: `po_line_items` + `po_headers`

### 3. Supplier View ✅
- Groups line items by PO — expandable rows
- Search (`Object.values()`), filters, date normaliser (`toISO()`), `normalizeRow()` for key drift
- Data source: `supplier_view` tab

### 4. Vendor Spend ✅
- Supplier cards, bar chart, breakdown table (horizontal scroll)
- **Fix this session**: Excludes suppliers whose POs are all "Not Shipped" — cross-references `po_headers` to build `activeSuppliers` set
- Data source: `vendor_spend` tab (pre-aggregated)

### 5. Customer Pricing ✅ (new this session)
- Aggregates from `supplier_view` by **Customer Name** (column B)
- Cards per customer (top 6), bar chart "Revenue by Customer", breakdown table
- Table columns: Customer, Lines, Customer Price, Gross Profit, Margin %
- **Fix this session**: Excludes "Not Shipped" rows from aggregation
- Data source: `supplier_view` tab

### 6. Not Shipped ✅ (new this session)
- **Red badge** on nav item showing count of Not Shipped POs (live, auto-refreshes)
- Summary cards: Not Shipped POs count, Supplier Cost on hold, Customer Price pending
- Table: PO Number, Supplier, Customer, Job #, Date Req. By, Supplier Cost, Customer Price, Status
- Data source: `po_headers` tab (filters `delivery_status === 'Not Shipped'`)

### 7. Delivery Tracker ✅
- Cards: Overdue, Due Soon, On Track, Received
- Table sorted by urgency, shows item codes (from `po_line_items`) + total qty per PO
- Date normaliser (`toISO()`) for "DD-Mon-YYYY" format
- Data source: `po_headers` + `po_line_items`

### 8. Discount Threshold ✅
- Cards + table: Supplier, Threshold, Actual Spend, % Reached, Status
- Craigs Welding Ltd supplemented from `thresholds` tab (not in `discount` tab)
- Inline threshold editing → writes back to Google Sheets via PUT
- Data source: `discount` + `thresholds` tabs

### 9. Activity Feed ✅ (fixed this session)
- Right panel, always visible, auto-refreshes
- **Fix**: `api/sheets.js` TAB_MAP updated: `activity → 'Activity Feed'` (was `'Activity'`)
- **Fix**: Timestamp parser handles `"2026-04-09 00:32:33"` (space not T) via `.replace(' ','T')`
- **Fix**: `'ENRICHED'` type mapped to `supplier` CSS class (amber color)
- Shows most recent 20 entries, newest first
- Data source: `Activity Feed` tab

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
| `activity`      | Activity Feed        | Audit log (tab renamed this session) |

---

## Live Sheet Data (as of checkpoint)
### PO Headers — 5 POs
| PO Number         | Supplier                     | Status           | Client              |
|-------------------|------------------------------|------------------|---------------------|
| PO-252928-001     | TPS Machining & Welding      | Shipped          | Maple Homes         |
| PO-25292-9-002    | Craigs Welding Ltd           | Request For Quote| Silverline Estates  |
| PO-25292-10-001   | Northern Industrial Supply   | Quote Received   | ABC Property Group  |
| PO-25292-11-001   | Rotating Equipment Specialist| Not Shipped      | Northview Retail    |
| PO-25292-12-001   | TGW Bearings Supply          | Received         | Western Build Co    |

### Supplier View — columns (parseGeneric keys)
`supplier_name, customer_name, date_required_by, job_number, po_number, line_, description, notes, qty, price_ex_tax, amount_ex_tax, tax, amount_inc_tax, item_number, customer_price, customer_total, gross_profit, margin_, delivery_status`

---

## Key Patterns / Known Gotchas

### parseGeneric key drift
- `"Line #"` → `line_`
- `"Margin %"` → `margin_`
- `"% Reached"` → `_reached`
- `"Total Spend (Inc Tax)"` → `total_spend_inc_tax`

### Date formats from Sheets
`"30-Apr-2026"` — use `toISO()` before any comparison or `new Date()`.

### Currency values
`"$1,500.00"` — strip with `replace(/[^0-9.-]/g, '')`.

### Timestamp from Activity Feed
`"2026-04-09 00:32:33"` — use `.replace(' ', 'T')` before `new Date()`.

### Not Shipped exclusion pattern
```js
// In Overview
const activePOs = (monthPOs.length ? monthPOs : headers).filter(r => r.delivery_status !== 'Not Shipped');

// In Customer Pricing aggregate
if (r.delivery_status === 'Not Shipped') return;

// In Vendor Spend — build active supplier set from po_headers
const activeSuppliers = new Set(
  (headersRaw || []).filter(r => r.delivery_status !== 'Not Shipped').map(r => r.supplier_name)
);
suppliers = vsRaw...filter(s => activeSuppliers.has(s.name));
```

### Horizontal scroll pattern for tables
```html
<div style="overflow-x:auto;">
  <table class="data-table" style="min-width:500px;">...</table>
</div>
```

### Nav badge pattern
```html
<span id="not-shipped-badge" style="position:absolute; right:10px; ...display:none;"></span>
```
```js
// In load():
badge.textContent = count;
badge.style.display = count > 0 ? 'flex' : 'none';
```

---

## Pending Work
- None outstanding. All tabs complete and wired to live data.

---

## Local Dev
```bash
node serve.mjs          # starts http://localhost:3000
node screenshot.mjs http://localhost:3000   # screenshots to ./temporary screenshots/
```
