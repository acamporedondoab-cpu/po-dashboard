# Checkpoint 011 — 2026-04-13

## Session: UI Polish — Sidebar, Topbar, Donut Chart, Empty States

Continues from checkpoint-010.md.

---

## What Was Built / Changed

### 1. Sidebar Logo Redesign

**Problem:** The sidebar header used a bold full-width green banner (`background: #3D9B35`) with a green box + document SVG icon. Felt overfilled and heavy.

**Fix:**
- Removed the green background from `.sidebar-logo` → now `background: transparent` (dark sidebar shows through)
- Removed the square box icon with SVG document
- Replaced with a **circle avatar** (`border-radius: 50%`) showing initials **"AC"** in white on green (`#3D9B35`), 36×36px
- `sidebar-logo-title` font reduced: 18px → 15px, weight 700 → 600, tighter feel
- Removed `<div class="sidebar-logo-sub">Field Service</div>` (hidden via `display:none`)
- Sidebar footer: "Field Service" label → "Administrator"

---

### 2. Topbar Date (replaced page title)

**Problem:** Topbar showed the current page name ("Overview", "PO Register", etc.) — redundant with the nav sidebar already highlighting the active page.

**Fix:** Replaced with a live two-line date display:
```
MONDAY          ← 10px, Inter 500, letter-spaced caps, muted color
April 13, 2026  ← 14px, Inter 600, primary color
```
- Format: `Month DD, YYYY` (e.g. "April 13, 2026")
- Both lines use **Inter** (not Syne — Syne rendered distorted/gradient artifacts at small sizes)
- Date set on page load via IIFE using `new Date()`
- Removed `PAGE_TITLES` map and `topbarTitle.textContent` update from `navigateTo()`

---

### 3. Donut Chart Overhaul (Spend by Supplier)

Multiple iterations to match a reference design (thick ring, vibrant colors, clean separators).

**Final state:**

**Layout:**
- Card body changed from stacked (chart above, legend below) to **side-by-side**: 160×160px donut on left, legend column on right
- Canvas container: `width:160px; height:160px`

**Chart config:**
- `cutout: '60%'` — thicker ring (was 68% → 74% → 60%)
- `borderWidth: 0` — removes all dark separator lines between segments
- `hoverOffset: 5` — subtle lift on hover

**Colors — 6-tone green family:**
```js
['#4CAF50', '#a3e635', '#6BCB6B', '#86efac', '#3D9B35', '#c8f275']
```
All bright/light greens, no dark forest tones. Hash-distributed per supplier name.

**Plugins:**
- `donutTrack` — draws a faint background ring before segments (`rgba(255,255,255,0.05)` dark / `rgba(0,0,0,0.06)` light)
- `arcGlow` — `shadowBlur: 10`, `shadowColor: rgba(76,175,80,0.35)` — subtle green warmth, not neon

**Legend:** name on top, bold percentage below each entry (stacked vertically)

**Bug fixed:** Previous glow attempt used `shadowBlur: 18` with `rgba(134,239,172,0.55)` — produced a neon effect. Reduced to 10 / 0.35 opacity.

---

### 4. Polished Empty States — Full Implementation

#### CSS (new classes added)

```css
@keyframes emptyFadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}
.empty-state         — flex column, centered, 44px padding, fade-in animation
.empty-state-icon    — 52×52px rounded square, green-tinted bg + border, theme-aware
.empty-state-icon svg — 22px, green (#4CAF50), 0.75 opacity
.empty-state-title   — 13px, semibold, primary color
.empty-state-desc    — 12px, muted, 1.6 line-height, max-width 220px
.chart-empty-overlay — position:absolute; inset:0 — fills chart's position:relative container
.inline-empty        — wrapper for non-chart empty states (status bars, legend areas)
```

#### JS Helper

```js
function emptyState(svgInner, title, desc) {
  return `<div class="empty-state">
    <div class="empty-state-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${svgInner}</svg>
    </div>
    <div class="empty-state-title">${title}</div>
    <div class="empty-state-desc">${desc}</div>
  </div>`;
}
```

#### Table Empty States (8 locations)

| Table | ID | Icon | Title | Description |
|---|---|---|---|---|
| Customer Pricing | `cp-tbody` | Price tag | No pricing data | Customer pricing will appear here once orders are synced |
| Not Shipped | `ns-tbody` | ✓ Check circle | All caught up | Every purchase order has been shipped. Nothing pending |
| Delivery Tracker | `dt-tbody` | Truck | No deliveries | Active deliveries will appear here once orders are in transit |
| PO Register (filtered) | `pr-tbody` | Search+ | No matches found | Try adjusting your search or clearing some filters |
| Vendor Spend | `vs-tbody` | Bar chart | No spend data | Supplier spend will appear here once purchase orders are loaded |
| Supplier View (filtered) | `sv-tbody` | Search+ | No matches found | Try adjusting your search or clearing some filters |
| Recent POs (overview) | `recent-pos-body` | Clipboard | No purchase orders | Recent orders will appear here once data is synced |
| Item Search | `#is-no-results` | Search | No items found | No items matched your search. Try a different keyword or part number |

#### Chart / Widget Empty States (6 locations)

Chart pattern: canvas hidden + `.chart-empty-overlay` div (absolute, inset:0) injected into chart's `position:relative` parent. On data arrival: overlay removed, canvas restored.

| Widget | Trigger | Icon | Title | Description |
|---|---|---|---|---|
| Profit Over Time (line chart) | `timeLabels.length === 0` | Pulse/waveform | No chart data | Profit trends will appear once purchase orders are recorded |
| Spend by Supplier (donut) | `supplierNames.length === 0` | Info circle | No supplier data | Spend distribution will render once orders are loaded |
| Status Breakdown (bars) | `entries.length === 0` | Document list | No status data | Order status breakdown will appear here |
| Vendor Spend (bar chart) | `suppliers.length === 0` | Bar chart | No vendor data | Supplier spend breakdown will appear once synced |
| Customer Pricing (bar chart) | `jobs.length === 0` | People | No customer data | Revenue by customer will appear once pricing data is available |
| Customer Cards grid | `jobs.length === 0` | Person | No customers yet | Customer cards will appear once pricing data is loaded |

#### Activity Feed Empty State

```js
// Replaces plain: 'No activity yet'
emptyState(
  '<path d="M18 8h1a4 4 0 0 1 0 8h-1"/>...',  // coffee/activity icon
  'No activity yet',
  'New POs, enrichments, and status changes will appear here in real time.'
)
```

---

## Bug Fixes

| Bug | Fix |
|---|---|
| Syne font distorted at small sizes in topbar | Switched both topbar date lines to Inter — Syne is a display font, renders with color artifacts at 14px in some browsers |
| Donut chart neon glow | `shadowBlur: 18 / rgba(134,239,172,0.55)` → `10 / rgba(76,175,80,0.35)` |
| Dark separator lines between donut segments | `borderWidth: 2` → `borderWidth: 0` |
| Donut colors too dark/muddy | Removed forest greens (`#2a5c2a`, `#1a3d1a`) — replaced with 6-tone bright green palette |
| Chart containers blank when no data | All 6 chart render functions now guard `!data.length` → canvas hidden, overlay injected |
| `skProfit` declared twice in `renderProfitChart` | Moved declaration to function top, removed duplicate at bottom |

---

## Files Changed

- `f:\po-dashboard\index.html` — all changes above

---

## Pending Deploy

Add to Vercel env vars before pushing:
- `AUTH_USERNAME=adminaries`
- `AUTH_PASSWORD=Gkh8NcrEkZEHLEcK`
- `JWT_SECRET=dbdfd180d1334b4d5f58e3deb47dee4272bdafc3a4bf20b331d7c3f290765095`

Then push `main` → Vercel auto-deploys.
