# Project Status — PO Dashboard

## Client
ServiceM8 / Field Service (internal tool)

## Last Updated
2026-04-13

## Last Deployed Commit
82551ea (pending — auth feature not yet deployed)

## Current State
Fully functional SPA dashboard with login wall. Username/password auth protects both the frontend and /api/sheets endpoint. 24h token stored in localStorage.

## What Was Last Changed
- Login screen with dark/light theme support
- Logout button in topbar (red hover, sign-out icon)
- HMAC-SHA256 token auth (no npm package — Node crypto built-in)
- /api/auth.js — new login endpoint
- /api/sheets.js — verifyToken guard on all requests
- scripts/serve.mjs — dynamic API handler routing + ROOT path fix
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
