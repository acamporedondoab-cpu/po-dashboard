# PO Dashboard — Project Context for Claude Code
> Read this entire file before doing anything. After reading, summarize your understanding and wait for instructions.

---

## ⚠️ MOST IMPORTANT THING TO UNDERSTAND

This dashboard is a **NEW separate project** — `po-dashboard/` folder.
It is the frontend visualization layer for the existing PO Parser pipeline.

**Data source:** Google Sheets (already populated by the PO Parser pipeline)
**Backend:** Single Vercel serverless function (`api/sheets.js`)
**Frontend:** Single `index.html` with Tailwind CDN

DO NOT touch the `PO_PARSER` folder — it is a separate working system.

---

## 1. What This Dashboard Does

Visualizes Purchase Order data for a field service business (client: Shiv).
Data flows from:
```
MyPO (ServiceM8 add-on)
    ↓ PDF via email
PO_PARSER pipeline (existing, working)
    ↓ writes to Google Sheets
po-dashboard (THIS PROJECT)
    ↓ reads from Google Sheets via API
Shiv sees data in browser
```

---

## 2. Tech Stack

```
Frontend:   Single index.html
            Tailwind CSS via CDN
            Vanilla JavaScript (no framework)
            Chart.js via CDN (for charts)
            
Backend:    api/sheets.js (Vercel serverless function)
            Reads Google Sheets via googleapis npm package
            
Deployment: Vercel (vercel --prod)
Server:     node serve.mjs (local dev, port 3000)
Screenshots: node screenshot.mjs http://localhost:3000 [label]
```

---

## 3. Folder Structure

```
po-dashboard/
├── index.html              ← Full dashboard (ALL pages in one file)
├── api/
│   └── sheets.js           ← Vercel serverless function (Google Sheets reader)
├── serve.mjs               ← Local dev server (copy from PropTrack)
├── screenshot.mjs          ← Puppeteer screenshots (copy from PropTrack)
├── package.json            ← puppeteer + googleapis dependencies
├── vercel.json             ← Routing config
├── CLAUDE.md               ← Frontend rules (see Section 15)
├── DASHBOARD_CONTEXT.md    ← This file
└── brand_assets/           ← Logo, colors if any
```

---

## 4. Design Reference

**Reference image provided:** Dark SaaS dashboard (DWISON style)

### Color System
```css
:root {
  /* Backgrounds */
  --bg-base:    #0c0c0c;   /* Page background */
  --bg-surface: #141414;   /* Cards, sidebar */
  --bg-elevated:#1c1c1c;   /* Hover states, inputs */
  --bg-border:  #2a2a2a;   /* Borders, dividers */

  /* Accent — Neon Green */
  --accent:         #a3e635;   /* Primary accent (lime green) */
  --accent-dim:     #65a30d;   /* Muted accent */
  --accent-glow:    rgba(163, 230, 53, 0.15); /* Glow effect */

  /* Text */
  --text-primary:   #ffffff;
  --text-secondary: #a1a1aa;
  --text-muted:     #52525b;

  /* Status colors */
  --status-shipped:   #a3e635;  /* green */
  --status-pending:   #f59e0b;  /* amber */
  --status-received:  #3b82f6;  /* blue */
  --status-not-shipped: #ef4444; /* red */
  --status-rfq:       #8b5cf6;  /* purple */
}
```

### Typography
```
Display/Headings: Syne (Google Fonts) — tight tracking, heavy weight
Body/UI:          DM Sans (Google Fonts) — clean, readable
```

### Layout
```
3-column layout:
├── Left Sidebar (240px, fixed)     ← Navigation
├── Main Content (flex-1)           ← Active page content
└── Right Panel (280px, fixed)      ← Activity feed / notifications
```

### Key Design Elements
- Dark cards with subtle `#2a2a2a` borders
- Neon green (`#a3e635`) as primary accent
- Rounded corners: `border-radius: 12px` on cards
- Layered shadows with green tint on hover
- Smooth transitions on all interactive elements
- Active sidebar item: green background pill
- Charts: green line/fill, dark grid lines

---

## 5. Dashboard Pages (Left Sidebar Navigation)

### Page 1 — Overview
```
KPI Cards (top row, 4 cards):
  ├── Total POs This Month     (count)
  ├── Total Supplier Cost      ($X,XXX.XX)
  ├── Total Customer Revenue   ($X,XXX.XX)
  └── Total Gross Profit       ($X,XXX.XX) + margin %

Charts (middle row):
  ├── Left: Profit Over Time   (line chart — green)
  └── Right: Spend by Supplier (donut chart — green shades)

Bottom row:
  ├── Recent POs table (last 5)
  └── Delivery Status breakdown (mini donut or bar)
```

### Page 2 — PO Register
```
Search bar (top) — searches across all fields
Filter chips: Supplier | Status | Date Range | Job Number

Full sortable table:
  Supplier Name | Customer Name | Job # | PO Number | Date Required |
  Description | Item Code | Qty | Supplier Cost | Customer Price |
  Gross Profit | Margin % | Delivery Status

Pagination: 20 rows per page
Export CSV button (top right)
```

### Page 3 — Vendor Spend
```
Top: Summary cards per supplier
  (Total POs | Total Spend | Avg Order Value | Top Item)

Bar chart: Spend per supplier (horizontal, green bars)

Table: 
  Supplier | PO Count | Line Items | Total Spend | Avg Per PO
```

### Page 4 — Supplier View
```
Filter bar:
  Supplier Name dropdown | Delivery Status dropdown |
  Date Required By range | Search

Table (same as Looker Studio current view + new columns):
  Supplier Name | Date Required By | Job Number | PO Number |
  Line # | Description | Item Code | Item Number |
  Qty | Supplier Cost | Customer Price | Gross Profit | 
  Margin % | Delivery Status

Color-coded Delivery Status badges:
  Shipped         → green
  Pending         → amber
  Not Shipped     → red
  Quote Received  → blue
  Request For Quote → purple
  Received        → teal
```

### Page 5 — Delivery Tracker
```
Urgency-based view — sorted by date_required_by

Color coding per row:
  🔴 OVERDUE     — date_required_by < today
  🟡 DUE SOON    — date_required_by within 3 days
  🟢 ON TRACK    — date_required_by > 3 days away
  ✅ RECEIVED    — delivery_status = "Received"

Columns:
  Urgency | Supplier | PO Number | Job # | Description |
  Qty | Date Required By | Delivery Status

Top summary badges:
  Overdue: N | Due Soon: N | On Track: N | Received: N
```

### Page 6 — Discount Threshold
```
Summary cards (top):
  Per supplier: progress bar showing % toward threshold
  Color: red (< 50%) → amber (50-80%) → green (80%+) → bright green (met)

Editable table:
  Supplier Name | Threshold Amount (EDITABLE) |
  Actual Spend | % Reached | Status

Edit interaction:
  Click Threshold Amount cell → inline edit → save button
  On save: PUT /api/sheets → updates Thresholds tab in Google Sheets

Status badges:
  THRESHOLD MET → green
  CLOSE         → amber  
  BELOW         → red
```

---

## 6. Right Panel (Always Visible)

```
Activity Feed — shows recent pipeline activity:
  ├── "PO-252926-001 processed — 3 line items" (timestamp)
  ├── "Delivery status updated: Shipped" (timestamp)
  └── "New supplier: TPS Machining & Welding" (timestamp)

Note: Activity feed is read from a dedicated "Activity" tab
in Google Sheets that main.py writes to on each run.
(This tab needs to be added to sheets_writer.py later)
```

---

## 7. Google Sheets — Data Source

**Spreadsheet ID:** In `api/sheets.js` from environment variable `SPREADSHEET_ID`
**Service Account JSON:** In `api/sheets.js` from environment variable `GOOGLE_CREDENTIALS`

### Tabs Read By Dashboard
```
Tab Name           | Used By
PO Headers         | Overview KPIs, Delivery Tracker
PO Line Items      | PO Register, Supplier View, Vendor Spend
Supplier View      | Supplier View page (pre-joined data)
Vendor Spend       | Vendor Spend page
Thresholds         | Discount Threshold (read + write)
Discount Threshold | Discount Threshold page
```

### api/sheets.js Endpoints
```
GET  /api/sheets?tab=po_headers        → PO Headers data
GET  /api/sheets?tab=po_line_items     → PO Line Items data
GET  /api/sheets?tab=supplier_view     → Supplier View data
GET  /api/sheets?tab=vendor_spend      → Vendor Spend data
GET  /api/sheets?tab=thresholds        → Thresholds data
GET  /api/sheets?tab=discount          → Discount Threshold data
PUT  /api/sheets/threshold             → Update threshold amount
```

---

## 8. Real-Time Strategy

```javascript
// Poll every 30 seconds — silent background refresh
const POLL_INTERVAL = 30000;

async function pollData() {
    try {
        const data = await fetchAllData();
        updateDashboard(data);
        updateLastRefreshed(); // shows "Last updated: X seconds ago"
    } catch (e) {
        // Silent fail — show stale data, don't crash
    }
}

setInterval(pollData, POLL_INTERVAL);
```

---

## 9. vercel.json

```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## 10. Environment Variables (Vercel Dashboard)

```
SPREADSHEET_ID      = [Google Sheets ID from config.py]
GOOGLE_CREDENTIALS  = [Full JSON of service account key — minified]
```

For local dev — create `.env.local`:
```
SPREADSHEET_ID=...
GOOGLE_CREDENTIALS=...
```

---

## 11. CLAUDE.md Rules For This Project

```
## Always Do First
- Read DASHBOARD_CONTEXT.md before any code
- Read frontendSKILL.md for design guidelines

## Design Rules
- Dark theme ONLY — #0c0c0c base, #141414 cards
- Accent: neon green #a3e635 ONLY — never default Tailwind colors
- Fonts: Syne (headings) + DM Sans (body) from Google Fonts
- All 6 pages in ONE index.html — JS handles page switching
- Match reference image layout exactly

## Local Server
- node serve.mjs → http://localhost:3000
- node screenshot.mjs http://localhost:3000 [label]

## Hard Rules
- Never use transition-all
- Never use default Tailwind blue/indigo/purple as primary
- Every clickable element needs hover + active states
- Charts use Chart.js CDN only
- No external UI libraries (no shadcn, no MUI)
- Do not add features not in DASHBOARD_CONTEXT.md
- Test in browser before saying done
```

---

## 12. Build Order For Claude Code

```
PROMPT 1: Read DASHBOARD_CONTEXT.md + summarize → wait for go

PROMPT 2: Create project structure
  - Create po-dashboard/ folder
  - Copy serve.mjs + screenshot.mjs from PropTrack
  - Create package.json
  - Create vercel.json
  - Create CLAUDE.md

PROMPT 3: Create api/sheets.js
  - Google Sheets API authentication
  - Tab routing (tab query param)
  - PUT endpoint for threshold updates
  - Error handling

PROMPT 4: Build index.html — Sidebar + Layout shell
  - Left sidebar (240px) with all 6 nav items
  - Main content area
  - Right panel (280px)
  - Page switching via JS (no reload)
  - Colors, fonts, base styles

PROMPT 5: Build Overview page
  - 4 KPI cards
  - Line chart (profit over time)
  - Donut chart (spend by supplier)
  - Recent POs table
  - Connect to /api/sheets

PROMPT 6: Build PO Register page
  - Search + filter bar
  - Full sortable table
  - Pagination
  - Connect to /api/sheets

PROMPT 7: Build Vendor Spend page
  - Summary cards per supplier
  - Horizontal bar chart
  - Table
  - Connect to /api/sheets

PROMPT 8: Build Supplier View page
  - Filter bar (supplier, status, date)
  - Color-coded status badges
  - Full table
  - Connect to /api/sheets

PROMPT 9: Build Delivery Tracker page
  - Urgency color coding (red/amber/green)
  - Summary badges
  - Sorted table
  - Connect to /api/sheets

PROMPT 10: Build Discount Threshold page
  - Progress bars per supplier
  - Editable threshold table
  - PUT to /api/sheets on save
  - Connect to /api/sheets

PROMPT 11: Polish + Real-time
  - Add 30-second polling
  - "Last updated" indicator
  - Loading states
  - Error states (stale data notice)
  - Smooth page transitions

PROMPT 12: Deploy
  - vercel --prod
  - Set environment variables in Vercel dashboard
  - Test live URL
  - Share URL with Shiv
```

---

## 13. Data Column Reference

### PO Headers columns (index 0-14):
```
0  PO Number
1  Date
2  Supplier Name
3  Supplier Email
4  Supplier Phone
5  Delivery Address
6  Notes
7  Date Required By
8  Requested By
9  Job Number
10 Processed At
11 Delivery Status
12 Total Supplier Cost
13 Total Customer Price
14 Total Gross Profit
```

### PO Line Items columns (index 0-16):
```
0  PO Number
1  Line #
2  Description
3  Item Code
4  Notes
5  Qty
6  Price Ex Tax (supplier cost/unit)
7  Amount Ex Tax
8  Tax
9  Amount Inc Tax (supplier total)
10 Item Number
11 Supplier Name
12 Customer Price
13 Customer Total
14 Gross Profit
15 Margin %
16 Delivery Status
```

---

## 14. Key Business Rules For Dashboard Logic

1. **Urgency calculation** (Delivery Tracker):
   ```javascript
   const today = new Date();
   const required = new Date(dateRequiredBy);
   const daysUntil = Math.ceil((required - today) / (1000 * 60 * 60 * 24));
   
   if (daysUntil < 0)  urgency = 'OVERDUE';   // red
   if (daysUntil <= 3) urgency = 'DUE SOON';  // amber
   if (daysUntil > 3)  urgency = 'ON TRACK';  // green
   if (status === 'Received') urgency = 'RECEIVED'; // teal
   ```

2. **Discount threshold status:**
   ```javascript
   if (pct >= 100) status = 'THRESHOLD MET';  // bright green
   if (pct >= 80)  status = 'CLOSE';          // amber
   if (pct < 80)   status = 'BELOW';          // red
   ```

3. **Profit margin color coding:**
   ```javascript
   if (margin >= 30) color = '--accent';        // green
   if (margin >= 15) color = 'amber';           // amber
   if (margin < 15)  color = 'red';             // red
   ```

4. **Currency format:** Always `$X,XXX.XX`
5. **Percentage format:** Always `XX.XX%`
6. **Date format:** Display as `DD-MMM-YYYY` (e.g. `13-Apr-2026`)

---

## 15. Delivery Status Badge Colors

```javascript
const STATUS_COLORS = {
  'Shipped':           { bg: '#14532d', text: '#a3e635' },  // green
  'Received':          { bg: '#164e63', text: '#67e8f9' },  // teal
  'Not Shipped':       { bg: '#7f1d1d', text: '#fca5a5' },  // red
  'Quote Received':    { bg: '#1e3a5f', text: '#93c5fd' },  // blue
  'Request For Quote': { bg: '#3b0764', text: '#d8b4fe' },  // purple
  'Pending':           { bg: '#78350f', text: '#fcd34d' },  // amber
}
```

---

## 16. Sample Data (For Testing Before Real API)

```javascript
// Use this if api/sheets.js is not ready yet
// Replace with real API calls in production

const SAMPLE_KPI = {
  totalPOs: 4,
  totalSupplierCost: '$2,264.30',
  totalCustomerRevenue: '$3,354.75',
  totalGrossProfit: '$1,090.45',
  avgMargin: '32.5%'
};

const SAMPLE_SUPPLIERS = [
  { name: 'TPS Machining & Welding', spend: '$1,039.80', pos: 1 },
  { name: 'Urban Trade Warehouse',   spend: '$224.00',   pos: 2 },
  { name: 'West Supply Co',          spend: '$2,000.00', pos: 3 },
];
```
