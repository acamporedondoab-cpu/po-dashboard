# Project Status — PO Dashboard

## Client
ServiceM8 / Field Service (internal tool)

## Last Updated
2026-04-14

## Last Deployed Commit
pending — advanced filtering system (search highlight, filter chips, advanced panel)

## Current State
Fully functional SPA dashboard with login wall, polished UI, and full empty state coverage. Auth protects both frontend and /api/sheets. All charts and tables have graceful no-data states. Notification bell in topbar with per-PO detail and mark-as-read on close. Sidebar badges for Not Shipped and Discount Threshold persist independently of bell read state. PO Register and Supplier View have premium enterprise-style filtering: search highlighting, removable filter chips, and collapsible advanced filter panel (cost range, margin range, job number).

## What Was Last Changed
- Search highlighting: matched text in PO Register and Supplier View wrapped in amber `<mark class="hl">` as user types
- Filter chips: active filters shown as removable green pills above table; × clears individual filter
- Advanced filter panel: collapsible panel with Supplier Cost range, Margin % range, Job Number text filter
- Numeric range filters applied at PO group level (post-grouping) for accurate cost/margin matching
- Covers both PO Register (por- prefix) and Supplier View (sv- prefix)

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
