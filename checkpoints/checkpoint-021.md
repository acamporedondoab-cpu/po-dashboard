# Checkpoint 021 — 2026-04-14

## Session: Audit Trail / Activity History Timeline + Polish

Continues from checkpoint-020.md (Smart Alert Feed Interactive Polish).

---

## What Was Built

### 1. Audit Trail — Activity History Timeline

New section inside the PO detail drawer tracking metadata changes per PO.

**Storage:** `localStorage` key `pod_{poKey}_audit` — JSON array, max 50 entries, newest first.
Each entry: `{ label, dot, from?, to?, ts }`.

**Tracked events:**
- Note added (green dot `#4CAF50`)
- Note updated (green dot, deduplicated within 2 min)
- Priority changed (dot color matches severity: Normal `#64748b`, Watch `#f59e0b`, Urgent `#f97316`, Critical `#ef4444`)
- Attention tag (cyan dot `#67e8f9`)

**UI:** Vertical timeline — colored dot + connector line + label + optional from→to detail chips + relative timestamp.

**Timestamp format:** "Today 2:45 PM" / "Yesterday ..." / "Apr 12 ..."

### 2. From → To Value Display

Each priority and tag change shows before/after values as styled chips:

```
● Priority changed          Today 2:45 PM
  [ Normal ]  →  [ Critical ]

● Attention tag             Today 2:46 PM
  [ Delayed ]  →  [ Escalated ]

● Note updated              Today 2:47 PM
```

**Visual hierarchy:**
- `from` chip — muted text, `opacity: 0.65`, flat `var(--bg-secondary)` fill, standard border
- `to` chip — full `var(--text-primary)`, elevated `rgba(255,255,255,0.08)` fill, brighter border
- Arrow `→` — `font-size: 12px`, `font-weight: 600`, `opacity: 0.54`

**Deduplication:** Notes use `dedup: true` (refreshes timestamp if same label < 2 min old). Priority/tag changes always create new entries.

**Backward compat:** Old entries without `from`/`to` render as plain label + timestamp.

### 3. Current-value tracking

`let currentFlag` / `let currentTag` initialized from `savedFlag`/`savedTag` at drawer open.
Each handler captures `prev*` before writing, then updates the tracker — ensures correct from/to on rapid re-clicks within the same drawer session.

---

## Files Changed
- `f:\po-dashboard\index.html`
  - CSS: `.drawer-timeline`, `.drawer-tl-item/left/dot/line/content/label/time/empty` (new)
  - CSS: `.drawer-tl-detail`, `.drawer-tl-val-from`, `.drawer-tl-val-to`, `.drawer-tl-arrow` + light mode override
  - JS (`openPODrawer`): `getAuditLog`, `appendAudit`, `formatAuditTime`, `renderAuditItems`, `refreshAuditUI` helpers
  - JS: `currentFlag`/`currentTag` mutable trackers; priority + tag + notes handlers updated
  - JS: `auditHTML` appended to `body.innerHTML`
- `f:\po-dashboard\docs\STATUS.md` — updated
- `f:\po-dashboard\checkpoints\checkpoint-021.md` — this file

---

## Deploy
Push `main` → Vercel auto-deploys.
