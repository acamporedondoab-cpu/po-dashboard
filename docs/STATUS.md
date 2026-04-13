# Project Status — PO Dashboard

## Client
ServiceM8 / Field Service (internal tool)

## Last Updated
2026-04-14

## Last Deployed Commit
pending — notification bell polish + discount threshold vanish fix

## Current State
Fully functional SPA dashboard with login wall, polished UI, and full empty state coverage. Auth protects both frontend and /api/sheets. All charts and tables have graceful no-data states. Notification bell in topbar with per-PO detail and mark-as-read on close. Sidebar badges for Not Shipped and Discount Threshold persist independently of bell read state.

## What Was Last Changed
- Notification bell mark-as-read on close (dropdown clears after viewing, sidebar badges stay)
- Not Shipped dropdown: per-PO detail (PO number, job #, client name)
- Discount threshold dot: green → amber (#F59E0B) to avoid clash with active nav
- Threshold notification text: "Threshold met / Supplier — 119%"
- Discount threshold vanish bug fixed: `_dtLoaded` guard prevents poll failure from re-rendering with SAMPLE data

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
