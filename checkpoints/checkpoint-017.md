# Checkpoint 017 — 2026-04-14

## Session: Row Metadata Chips + Smart Metadata Filters

Continues from checkpoint-016.md (Global PO Detail Drawer).

---

## What Was Changed

### 1. Row Metadata Chips (`window.rowMetaChips`)
- Global helper function reads `localStorage` per PO and renders compact status chips below the supplier name in POR and SV table rows
- Chips are conditional — only render if data exists (priority ≠ Normal, tag set, notes set)
- Three chip types:
  - **Priority** (`rmc-watch` / `rmc-urgent` / `rmc-critical`) — amber/orange/red tinted pills
  - **Tag** (`rmc-tag`) — indigo pill showing the tag text
  - **Notes** (`rmc-notes`) — blue-gray pill with file SVG icon + "Note" label
- `data-po-chips` attribute on each chip container — used by `window.updateRowFlags()` to live-update chips in-place after drawer saves, without full table re-render
- Design: `border-radius:20px`, colored tinted bg + border + outer glow, `9.5px` font, `18px` height
- Full dark + light mode CSS coverage

### New CSS Classes
- `.row-meta-chips` — flex row container, `margin-top:3px` gap below supplier name
- `.rmc` — base chip: uppercase, letter-spacing, 18px height, 20px border-radius
- `.rmc-watch` / `.rmc-urgent` / `.rmc-critical` / `.rmc-tag` / `.rmc-notes` — color variants (dark + light mode)

### localStorage Keys
- `pod_${sanitized_po}_priority` — "Normal" | "Watch" | "Urgent" | "Critical"
- `pod_${sanitized_po}_tag` — free text tag string
- `pod_${sanitized_po}_notes` — free text notes string

---

### 2. Smart Metadata Filters
- New "Internal Metadata Filters" section added inside the existing "More Filters" advanced panel (both POR and SV)
- Toggle-pill buttons — click to activate (colored), click again to deactivate
- **Priority row:** Watch · Urgent · Critical (amber/orange/red when active)
- **Tag row:** Needs Review · Delayed · Issue Reported · Waiting Approval · Escalated (indigo when active)
- **Additional:** Has Notes · Flagged Only (green when active)
- OR logic across all active meta filters — any PO matching any active filter is shown
- Combines with all existing filters (search, supplier, status, date, cost, margin, job)
- Active filters appear as chips in the filter chip bar with × to remove
- SV Clear button resets all metadata toggle states
- Chip × removal also deactivates the corresponding toggle button
- Filter logic reads `localStorage` at group level (post-grouping, same pattern as numeric range filters)

### New CSS Classes
- `.meta-filter-section` — full-width bordered separator block inside the adv panel
- `.meta-filter-label` — uppercase section title
- `.meta-filter-row` — flex row of toggle buttons
- `.meta-filter-sublabel` — "Priority" / "Tag" label at left of row
- `.meta-tag-btn` — toggle pill button base; `.active` adds color tint
- Color variants on `.meta-tag-btn[data-meta="prio:*"].active` and `[data-meta^="tag:"].active`
- `.adv-panel.open` max-height increased from `140px` → `300px`

### New JS State (per module)
- `let metaFilters = new Set()` — tracks active filter keys ("prio:Watch", "tag:Escalated", "special:hasNotes", "special:flagged")

---

## Files Changed
- `f:\po-dashboard\index.html`
  - CSS: `.row-meta-chips`, `.rmc*` chip variants (dark + light), `.meta-filter-section`, `.meta-tag-btn` variants, adv-panel max-height
  - JS (global): `window.rowMetaChips()`, `window.updateRowFlags()` chips refresh section
  - HTML + JS (POR): metadata section in `#por-adv-panel`; `metaFilters` state; extended `renderChips()`; meta filter logic in `applyFilters()`; wired toggle buttons in `wireControls()`
  - HTML + JS (SV): same pattern with sv- prefix; sv-clear also resets meta toggles

---

## Verification
- Chips render correctly below supplier name in POR and SV rows
- Chips update live when drawer closes (no full re-render)
- Meta filter toggles activate/deactivate correctly
- Active meta filters appear as chips; × removes chip and deactivates button
- Combines correctly with search, supplier, status, and numeric filters
- SV Clear resets meta filters + button states

---

## Pending Deploy
Push `main` → Vercel auto-deploys.
