# PO Dashboard — Handoff Document

Use this file to onboard a new Claude session to this project. At the start of any session say:
> "Read HANDOFF.md before we start."

---

## What This Is

A single-page Purchase Order Dashboard built for a field service business. It visualises PO data pulled live from Google Sheets (populated by a PO Parser pipeline). Fully deployable to Vercel. Falls back to hardcoded sample data when no credentials are available — so it always works in demos.

---

## File Structure

```
po-dashboard/
├── index.html          ← Entire frontend (~3500+ lines, all styles inline)
├── api/
│   └── sheets.js       ← Vercel serverless function (Google Sheets read/write)
├── serve.mjs           ← Local dev server (port 3000, proxies /api/* to sheets.js)
├── screenshot.mjs      ← Puppeteer screenshot utility
├── package.json        ← ESM, googleapis dep, puppeteer devDep
├── vercel.json         ← SPA + API rewrites
├── .env.local          ← NOT committed — holds SPREADSHEET_ID + GOOGLE_CREDENTIALS
├── CLAUDE.md           ← Claude instructions for this project
└── HANDOFF.md          ← This file
```

**Key constraint:** `index.html` is one file — no build step, no bundler. All JS is vanilla, all CSS is inline `<style>` blocks or inline attributes, Tailwind via CDN.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Frontend | Single `index.html` — vanilla JS SPA |
| Styles | Inline `<style>` + Tailwind CDN |
| Charts | Chart.js 4.4.4 via CDN |
| PDF export | jsPDF + AutoTable via CDN |
| Fonts | Inter (via Google Fonts) |
| Backend | Vercel serverless — `api/sheets.js` |
| Data | Google Sheets via `googleapis` npm package |
| Auth | Google service account (JSON credentials) |
| Hosting | Vercel (auto-deploy from GitHub main branch) |
| Local dev | `node serve.mjs` (port 3000) |
| Module system | ESM throughout (`"type": "module"` in package.json) |

---

## Design System

### Color Tokens (CSS variables)

```css
/* Dark mode (default) */
:root, html[data-theme="dark"] {
  --bg-primary:    #0F0F0F;   /* page background */
  --bg-secondary:  #1A1A1A;   /* sidebar, topbar, right panel */
  --bg-tertiary:   #242424;   /* elevated surfaces */
  --bg-card:       #1E1E1E;   /* card backgrounds */
  --border-color:  #2A2A2A;

  --green-primary: #4CAF50;   /* primary accent */
  --green-dark:    #3D9B35;   /* sidebar header bg, hover states */
  --green-deeper:  #2E7A28;   /* button hover */
  --green-light:   #C8E6C9;
  --green-neon:    #6BCB6B;   /* badge text */

  --text-primary:   #FFFFFF;
  --text-secondary: #A0A0A0;
  --text-muted:     #666666;
}

/* Light mode */
html[data-theme="light"] {
  --bg-primary:    #F5F6FA;
  --bg-secondary:  #FFFFFF;
  --bg-tertiary:   #F0F0F0;
  --bg-card:       #FFFFFF;
  --border-color:  #E0E0E0;

  /* green tokens are identical in both themes */

  --text-primary:   #1A1A1A;
  --text-secondary: #555555;
  --text-muted:     #999999;
}
```

**Hard rule:** Never hardcode `#fff` or `#000` for text. Always use `var(--text-primary)`. The sidebar logo header is the only exception — it always has a green background (#3D9B35) so its text is hardcoded `#ffffff`.

### Theme Toggle
- Button in topbar swaps moon/sun icon
- Applies `data-theme="dark"` or `data-theme="light"` on `<html>` element
- Persisted to `localStorage` key `po-theme`
- Defaults to dark if no saved preference
- On toggle: also calls `window._rerenderSupplierChart()` to re-render the donut chart with fresh CSS variable values

### Layout Dimensions (at 100% browser zoom)
```css
#sidebar      { width: clamp(180px, 16vw, 220px); }
#topbar       { height: 52px; padding: 0 20px; }
#content      { padding: 20px; }
#right-panel  { width: 260px; background: var(--bg-secondary); }
.card         { padding: 16px; }
.kpi-grid     { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.page-section.active { display: flex; flex-direction: column; gap: 16px; }
```

---

## 6 Dashboard Pages

| Page | Nav key | Description |
|------|---------|-------------|
| Overview | `overview` | KPI cards (revenue, cost, profit, margin), profit trend line chart, supplier donut chart, recent POs table, status breakdown |
| PO Register | `po-register` | Full PO table — search, filter, sort, paginate (20/page), CSV export |
| Vendor Spend | `vendor-spend` | Supplier spend cards, horizontal bar chart, ranked table |
| Supplier View | `supplier-view` | 14-column filtered table, supplier dropdown + status filter |
| Delivery Tracker | `delivery-tracker` | Urgency-sorted list (OVERDUE → DUE SOON → PENDING → RECEIVED), 4 summary badges |
| Discount Thresholds | `discount-thresholds` | Per-supplier threshold cards with progress bars, inline editor (PUT to Google Sheets) |

Page switching is vanilla JS — each page is a `<div class="page-section" data-page="...">` toggled with `.active`. No router library.

---

## API Layer

**Endpoint:** `GET /api/sheets?tab=<tab_name>`

Valid tab names and their Sheets mapping:
```
po_headers    → 'PO Headers'
po_line_items → 'PO Line Items'
supplier_view → 'Supplier View'
vendor_spend  → 'Vendor Spend'
thresholds    → 'Thresholds'
discount      → 'Discount Threshold'
activity      → 'Activity Feed'
```

**PUT /api/sheets** — updates a threshold value. Body: `{ supplier_name, threshold_amount }`.

**Frontend API wrapper** (`window.API.get(tab)`):
- Returns `null` on empty response or error (not `[]`) — so `|| SAMPLE_DATA` fallback works
- All 6 pages have hardcoded `SAMPLE_*` arrays that activate when API is unavailable

---

## Real-time Features

- 30-second polling via `window._pollCallbacks` array + `setInterval`
- Connection state: green/amber pulse dot in topbar
- Stale data banner: amber, fixed below topbar, appears after 2+ consecutive API failures
- "X min ago" ticker: updates every 15 seconds
- Register per-page poll callbacks with `window.registerPollCallback(fn)`

---

## Local Dev Setup

1. `npm install`
2. Create `.env.local` in project root:
   ```
   SPREADSHEET_ID=your_sheet_id_here
   GOOGLE_CREDENTIALS={"type":"service_account","project_id":"...entire JSON blob..."}
   ```
3. `node serve.mjs` — serves at http://localhost:3000
4. Without `.env.local`, API calls fail gracefully and sample data loads instead

**Screenshot command:**
```bash
node serve.mjs & sleep 2 && node screenshot.mjs http://localhost:3000 label && kill %1
```
Screenshots save to `./temporary screenshots/screenshot-N-label.png` (auto-incremented).

---

## Deployment (Vercel)

- **GitHub repo:** `https://github.com/acamporedondoab-cpu/po-dashboard.git`
- **Branch:** `main` — Vercel auto-deploys on every push
- **Env vars to set in Vercel dashboard:**
  - `SPREADSHEET_ID` — the Google Sheet ID from the URL
  - `GOOGLE_CREDENTIALS` — paste the full service account JSON blob as a single string

**Critical:** Use `GOOGLE_CREDENTIALS` (full JSON blob), not split `GOOGLE_CLIENT_EMAIL` + `GOOGLE_PRIVATE_KEY`. The `\n` characters in the private key get mangled when split across Vercel UI fields.

---

## Adapting for a New Client

When copying this project for a new client, the things that need changing are:

### 1. Google Sheets connection
- Create a new Google Sheet with the same tab names (or update `TAB_MAP` in `api/sheets.js`)
- Create a new service account in Google Cloud Console, share the sheet with it
- Set new `SPREADSHEET_ID` and `GOOGLE_CREDENTIALS` env vars

### 2. Sample data
- Each page has a `SAMPLE_*` array near the top of its script block — update these to match the new client's data structure

### 3. Branding
- Sidebar logo title/subtitle text (search for `sidebar-logo-title` and `sidebar-logo-sub`)
- Page `<title>` tag at the top of `<head>`
- Color tokens in `:root` if the client has a different brand color (replace `#4CAF50` green family)

### 4. Column mapping
- `api/sheets.js` row parsers (`parsePoHeaders`, `parsePoLineItems`) — update if the new sheet has different column order
- The generic `parseGeneric()` parser auto-maps column headers to lowercase snake_case keys — works without changes if header names match

### 5. Deploy
- Create new Vercel project pointing to the new GitHub repo
- Set env vars
- Push to main

---

## Known Gotchas & Bugs Fixed (summary)

Full details in memory file `project_bugs_fixed.md`. Key ones to know:

| # | Issue | Fix |
|---|-------|-----|
| 1 | Chrome path hardcoded in screenshot.mjs | Update `executablePath` to match your machine's Puppeteer cache |
| 2 | ERR_HTTP_HEADERS_SENT in serve.mjs | Fixed by storing `_origEnd` before overwriting `res.end`; checking `res.headersSent` before `writeHead` |
| 6 | Sample data fallback not triggering | `window.API.get()` returns `null` (not `[]`) so `raw \|\| SAMPLE` works |
| 7 | Vercel Google auth failing | Always use `GOOGLE_CREDENTIALS` (full JSON blob), not split vars |
| 11 | Layout cramped at 100% zoom | All dimensions reduced; sidebar uses `clamp(180px, 16vw, 220px)` |
| 12 | Donut chart center invisible in light mode | `chartBackground` Chart.js plugin fills canvas with `--bg-card` using `destination-over` compositing |
| 13 | Activity feed labels invisible in light mode | Type label classes changed to `var(--green-dark)` / `var(--green-deeper)` |
| 14 | Donut chart shows wrong color after theme toggle | Plugin reads `--bg-card` dynamically on every `beforeDraw`; theme toggle calls `window._rerenderSupplierChart()` |
| 15 | Right panel stays dark in light mode | `#right-panel` background changed to `var(--bg-secondary)` |

---

## Donut Chart — Special Notes

The supplier donut chart (`renderSupplierChart()` function) has a custom `chartBackground` Chart.js plugin that fills the canvas background with `--bg-card`. This is required because:

- Chart.js canvases are transparent by default
- The cutout (center hole) is also transparent
- Without the fill, the browser's white canvas background shows through gaps between slices in dark mode

**Plugin pattern:**
```js
plugins: [{
  id: 'chartBackground',
  beforeDraw(chart) {
    const ctx = chart.ctx;
    const currentBgCard = getComputedStyle(document.documentElement)
      .getPropertyValue('--bg-card').trim() || '#1E1E1E';
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.fillStyle = currentBgCard;
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  },
}]
```

`destination-over` draws BEHIND existing content — slices are unaffected, only transparent areas get filled.

The chart must be re-rendered on theme switch. The IIFE at the bottom of the overview section exposes:
```js
window._rerenderSupplierChart = () => renderSupplierChart(data);
```
And the theme toggle button calls `window._rerenderSupplierChart()` after switching theme.

---

## Activity Type Label Colors

All activity type labels use green — readable on both dark and light backgrounds:

```css
.activity-type.new-po   { color: var(--green-primary); }   /* #4CAF50 */
.activity-type.status   { color: var(--green-dark); }      /* #3D9B35 */
.activity-type.supplier { color: var(--green-deeper); }    /* #2E7A28 */
```

Do not change these to cyan or purple — those colors are near-invisible on white (light mode).

---

## Current Deployment State

- **Latest commit:** `7ad9a7b` (as of 2026-04-10)
- **Status:** All 6 pages complete, deployed to Vercel, both dark and light mode verified
- **Nothing pending** — wait for client feedback before next changes
