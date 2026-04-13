# Project Status — PO Dashboard

## Client
ServiceM8 / Field Service (internal tool)

## Last Updated
2026-04-13

## Last Deployed Commit
pending — checkpoint-012 login polish

## Current State
Fully functional SPA dashboard with login wall, polished UI, and full empty state coverage. Auth protects both frontend and /api/sheets. All charts and tables have graceful no-data states.

## What Was Last Changed
- Login card entrance animation (fade + rise + scale, spring easing)
- Card padding 28px → 36px, max-width 360 → 400px
- Card border-radius increased to 20px, shadow softened (×0.85 blur)
- Input fields: near-black bg (#0f0f0f dark / #E5E7EB light), border barely visible, flat style
- Input labels: font-weight 600, opacity 0.75 (brighter)
- Button padding 11px → 17px (chunkier), hover lift + glow
- "Welcome Back" 28px/800, subtitle margin-top 22px (more breathing room)

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
- checkpoint-012.md — Login UI premium polish (card depth, inputs, button, typography)
