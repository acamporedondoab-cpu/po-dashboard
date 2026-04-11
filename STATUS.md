# Project Status — PO Dashboard

## Client
ServiceM8 / Field Service (internal tool)

## Last Updated
2026-04-12

## Last Deployed Commit
82551ea

## Current State
Fully functional SPA dashboard. PO parser running on-demand (manual trigger). Activity feed live with 30s polling. Toast notifications wired to activity feed.

## What Was Last Changed
- Activity feed icon + color system (NEW PO/ENRICHED/UPDATED)
- Toast notifications auto-fire on 30s poll when new activity entries detected
- Premium toast system replacing old dt2-toast
- UI interaction polish: card lift, nav hover fix, table row glow, button scale, input focus glow

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
