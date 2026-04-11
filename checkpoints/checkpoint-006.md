# Checkpoint 006 — 2026-04-12

## Session: UI Interaction Polish — Hover & Focus Effects

Continues from checkpoint-005.md. Records all interaction improvements made this session.

---

## What Was Done

### 1 — Card hover effects (`.card-hover`)

**Before:** Flat border-color + box-shadow change only. No movement.

**After:**
- `transform: translateY(-2px)` — lift on hover
- Spring easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` on all three properties
- Layered box-shadow: close ambient + deep distance + faint green glow
- `will-change: transform` for GPU compositing
- Light mode override with adjusted shadow values
- Added `card-hover` to 19 more cards: chart cards (Overview, Vendor Spend, Customer Pricing), stat cards (Not Shipped, Delivery Tracker, Item Search). Table container cards deliberately excluded (overflow:hidden would clip the lifted shadow).

---

### 2 — Sidebar nav hover/focus (`.nav-item`)

**Before:** Hover changed background to `--bg-tertiary` (#242424) — barely visible against `#1A1A1A` sidebar. No focus-visible state. Icon opacity unchanged.

**After:**
- Hover: `rgba(255,255,255,0.07)` — true white-tinted lift, clearly visible
- Icon opacity at rest: `0.55` → `1.0` on hover (was 0.65 → 0.9)
- `focus-visible`: green ring `box-shadow: 0 0 0 2px rgba(76,175,80,0.5)` — was completely missing
- Active press: green tint + white text
- **Light mode fix:** sidebar is always `#1A1A1A` but `--text-secondary` switches to `#555555` in light mode (dark text on dark bg). Fixed by forcing `color: rgba(255,255,255,0.55)` on `.nav-item` in light mode.
- Nav section labels (`#666666`) also fixed to `rgba(255,255,255,0.3)` — always readable on dark sidebar.

---

### 3 — Table row hover (`.data-table`)

**Before:** Instant background swap to `--bg-tertiary`. No transition on `td`.

**After:**
- `transition: background 0.15s ease, color 0.15s ease` added to `td`
- Hover background: `rgba(76,175,80,0.06)` — green-tinted highlight instead of flat grey
- Left accent stripe on first cell: `box-shadow: inset 3px 0 0 rgba(76,175,80,0.7)` — sharp green left border anchors the eye
- Light mode override with `rgba(61,155,53,...)` equivalents

---

### 4 — Button hover (`.btn`, `.btn-primary`, `.btn-ghost`)

**Before:** `.btn-primary:hover` used `--green-deeper` (#2E7A28) — actually *darker*, not brighter. No scale. Transition only covered `opacity` and `transform`.

**After:**
- `scale(1.025)` on hover, `scale(0.96)` on active — spring easing
- `will-change: transform` for smooth compositing
- Primary: `filter: brightness(1.15)` + green glow shadow `0 4px 14px rgba(76,175,80,0.4)`
- Ghost dark: `filter: brightness(1.2)` — brightens dark surface
- Ghost light: `filter: brightness(0.93)` — darkens correctly for light surface
- Transition changed to `filter`, `transform`, `box-shadow`

---

### 5 — Input focus (`.input`)

**Before:** Focus had `border-color: green` + single `box-shadow: 0 0 0 3px rgba(76,175,80,0.12)` — too subtle. Hover used hardcoded `#4A4A4A` (invisible in light mode).

**After:**
- Double-layer focus glow: `0 0 0 1px rgba(76,175,80,0.35)` (crisp ring) + `0 0 12px rgba(76,175,80,0.12)` (diffused bloom)
- Background tint on focus: `rgba(76,175,80,0.04)` — surface shifts slightly green
- Hover border: `rgba(255,255,255,0.15)` dark / `rgba(0,0,0,0.2)` light — theme-aware
- `background` added to transition so tint fades in smoothly
- Light mode overrides for all states

---

## Files Changed

- `f:\po-dashboard\index.html` — all CSS changes inline, no JS changes

---

## Git / Deploy

- Changes not yet committed (checkpoint save only — deploy when user requests)
- Last deployed commit: `9e2beb2`
