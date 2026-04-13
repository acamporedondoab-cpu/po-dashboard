# Project Status — PO Dashboard

## Client
ServiceM8 / Field Service (internal tool)

## Last Updated
2026-04-13

## Last Deployed Commit
3a1585f — feat: add auth wall, login UI polish, sidebar/topbar redesign, donut overhaul, empty states

## Current State
Fully functional SPA dashboard with login wall, polished UI, and full empty state coverage. Auth protects both frontend and /api/sheets. All charts and tables have graceful no-data states.

## What Was Last Changed
- Auth system: HMAC-SHA256 token login, /api/auth.js, API guard on /api/sheets, logout button
- Login card: frosted glass with mask-composite shine border, centered "Welcome Back" header
- Sidebar: replaced green banner with 36px circle avatar "AC", removed "Field Service" label
- Topbar: replaced page title with live date (Inter font — day name + Month DD YYYY)
- Donut chart: side-by-side layout, borderWidth 0, 6-color bright green palette, subtle glow plugin
- Empty states: full system — CSS + JS helper + 8 tables + 6 charts + activity feed
- Item Search dark mode dropdown fix (select option styling)

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
- `crop_activity.mjs` temporary file in project root — safe to delete
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
