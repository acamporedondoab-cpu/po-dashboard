# Project Status — PO Dashboard

## Client
ServiceM8 / Field Service (internal tool)

## Last Updated
2026-04-14

## Last Deployed Commit
pending — advanced filter panel 2-column compact layout

## Current State
Fully functional SPA dashboard with login wall, polished UI, and full empty state coverage. Auth protects both frontend and /api/sheets. All charts and tables have graceful no-data states. Notification bell in topbar with per-PO detail and mark-as-read on close. Sidebar badges for Not Shipped and Discount Threshold persist independently of bell read state. PO Register and Supplier View have premium enterprise-style filtering: search highlighting, removable filter chips, and collapsible advanced filter panel — now in a compact 2-column layout (numeric filters left, metadata filters right) reducing expanded panel height from ~200px to ~120px. Global PO detail drawer slides in from right on row click with financials, line items, internal notes, priority flags, and attention tags.

## What Was Last Changed
- Advanced filter panel redesigned to a 2-column grid: numeric inputs (Cost/Margin/Job) on left, Internal Metadata Filters on right, separated by a vertical divider
- Panel expanded height reduced from ~200px to ~120px; max-height capped at 200px; transition snapped from 0.28s to 0.22s
- Added `.meta-filter-section.meta-side` CSS class for the right-column variant (no top border, left border separator)
- Active filter chips still persist above the table when the panel is collapsed

## Pages / Features
- Overview — stats, profit chart, donut chart, recent POs, delivery status
- PO Register — full PO list with search/filter
- Vendor Spend — spend by supplier breakdown
- Supplier View — line items grouped by supplier
- Customer Pricing — pricing table
- Not Shipped — unshipped POs tracker
- Delivery Tracker — delivery status board
- Discount Thresholds — supplier discount rules with toast alerts
- Item Search — search items via ServiceM8 API

## Known Issues / Pending
- PO parser run is manual — could be scheduled via Windows Task Scheduler

## Checkpoints
- checkpoint-001.md — Initial build
- checkpoint-002.md — Early features
- checkpoint-003.md — ServiceM8 API integration
- checkpoint-004.md — PO parser + sheets writer
- checkpoint-005.md — Dark/light toggle, first deploy
- checkpoint-006.md — UI interaction polish
- checkpoint-007.md — Premium toast system
- checkpoint-008.md — Activity feed icons + poll-based toast wiring
- checkpoint-009.md — Skeleton loading states (KPI cards, charts, tables, activity feed)
- checkpoint-010.md — Auth wall, login card frosted glass + shine border
- checkpoint-011.md — Sidebar/topbar redesign, donut overhaul, full empty state system
- checkpoint-012.md — Login UI premium polish (card depth, inputs, button, typography)
- checkpoint-013.md — Toast fixes: Not Shipped red, auth guard, poll 10s
- checkpoint-014.md — Notification bell polish, per-PO detail, amber dot, discount threshold vanish fix
- checkpoint-015.md — Advanced filtering system: search highlight, filter chips, advanced panel
- checkpoint-016.md — Global PO detail drawer: slide-out panel, financials, line items, notes/priority/tags
- checkpoint-017.md — Row metadata chips + smart metadata filters (priority, tag, notes, flagged)
- checkpoint-018.md — Advanced filter panel 2-column compact layout
