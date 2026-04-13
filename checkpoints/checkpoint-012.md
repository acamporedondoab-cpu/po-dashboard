# Checkpoint 012 — 2026-04-13

## Session: Login UI Polish — Premium Refinements

Continues from checkpoint-011.md.

---

## What Was Changed

### 1. Login Card — Padding & Width
- Card padding: 28px → 36px
- Container max-width: 360px → 400px
- More breathing room, modern SaaS proportions

### 2. Card Depth & Layering
- `backdrop-filter: blur` increased: 20px → 28px
- Layered box-shadow added (3 levels in light, 4 in dark with inner top highlight)
- Dark card bg: `rgba(20,20,20,0.45)` → `rgba(22,22,22,0.72)` (more opaque/premium)

### 3. Card Border Radius
- Wrapper: 14px → 20px
- `::before` shine border: 14px → 20px
- Card inner: 13px → 19px

### 4. Card Shadow Softened (×0.85 blur)
- Light: `6px / 32px / 72px` → `5px / 27px / 61px`
- Dark: same blur reduction, opacity unchanged

### 5. Input Fields
- Moved from inline styles to `.login-input` CSS class
- Dark mode background: `var(--bg-tertiary)` → `#0f0f0f` (near-black, flat)
- Light mode background: `var(--bg-tertiary)` → `#E5E7EB` (off-white)
- Border: `rgba(255,255,255,0.1)` → `rgba(255,255,255,0.06)` (barely visible)
- Inner shadow removed — flat appearance
- Text color: `var(--text-primary)` → `#c8c8c8`
- Focus: green border `rgba(76,175,80,0.5)` + soft `0 0 0 3px rgba(76,175,80,0.12)` ring
- Transition on `border-color` and `box-shadow`

### 6. Input Labels
- Font-weight: 700 → 600
- Opacity: 0.65 → 0.75 (brighter, more readable)

### 7. Button
- Padding: 11px → 17px (chunkier, more premium)
- Moved to `#login-btn` CSS rule (removed inline styles + onfocus/onblur handlers)
- Hover: `translateY(-1px)` lift + stronger green glow
- Active: resets transform
- Resting box-shadow: `0 2px 8px rgba(76,175,80,0.25)`

### 8. Typography
- "Welcome Back": 24px/700 → 28px/800, `letter-spacing: -0.04em`
- Subtitle: `margin-top` 4px → 22px (more breathing room), color `text-muted` → `text-secondary`

### 9. Card Entrance Animation
- New `@keyframes loginCardIn`: `opacity 0→1` + `translateY(18px→0)` + `scale(0.98→1)`
- Applied to both `#login-card-wrapper` and header div (staggered feel)
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)` — spring-like

---

## Files Changed
- `f:\po-dashboard\index.html`

---

## Bug Fixes
None this session — polish only.

---

## Pending Deploy
Push `main` → Vercel auto-deploys.
