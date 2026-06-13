## Session: Post-re-org backlog cleanup + Vercel Ignored Build Step + Gallery refactor reverted

**Date:** 2026-05-18
**Agent:** Grim (Claude Opus 4.7, 1M context)
**Summary:** Continuation of the same calendar-day session that closed the repo restructure earlier. Backlog audit + status reconciliation across items 7e (Vercel Ignored Build Step applied to all three projects), 1e (URL sweep — already done in code), 4 (FLAT_SHIPPING_EUR — already retired by real Printful rates), 3 (multi-image + color variants — flipped 🚧 gated on real client Printful store), 2f (Sanity handoff — flipped 🚧 gated on client engagement end), 8g (sender swap — flipped 🚧 gated on MailerLite verification), 8i (.xyz deliverability watch — flipped 🚧 gated on 30 days sending). Restructured the Gallery item (now "9. Styleguide polish") to bundle Gallery sub-items + the pre-existing padding/margin drift + text-selection highlight quirks (moved from 5j). One attempted Gallery rewrite was over-scoped, full revert applied — DO NOT proceed with that approach.

## Changes Made

### Backlog (`docs/backlog.md`)
- **7e ✅** — "Vercel 'Ignored Build Step' applied to all three projects." User applied via Vercel UI on website + studio + styleguide projects (Settings → Build and Deployment → Ignored Build Step → Custom). Updated commands in `docs/backlog-notes.md#7e` to post-Phase-2 paths.
- **1e ✅** — "Sweep hard-coded `kol-client-acyr-website.vercel.app` references." Audited code: zero matches in `apps/` (outside dist/ + node_modules). `SITE_URL` constant in `apps/website/src/data/seo-metadata.js`, sitemap.xml, robots.txt, Landing.jsx `LIVE_SITE_URL` — all already `another-creation.xyz`. Note added: PayPal app return URL in PayPal Developer UI still needs visual verification by user.
- **4 ✅** — "Bump `FLAT_SHIPPING_EUR`" — flipped from open to ✅ retired. Real Printful rates already wired via `api/_lib/shipping.mjs` + `api/paypal/create-order.mjs` + `Checkout.jsx` fetch. No flat constant remains in code; the bump task is obsolete.
- **3 🚧** — "Multi-image + color variants" flipped from open to blocked. Gated on real client Printful store (current `acyr-test` is a temp placeholder).
- **2f 🚧** — "Sanity handoff" flipped from open to blocked. Gated on client Sanity org / engagement end.
- **8g 🚧** — Newsletter sender swap `dev@` → `hello@` flipped from open to blocked. Gated on MailerLite domain verification finishing (explicit in its own description).
- **8i 🚧** — `.xyz` deliverability watch flipped from open to blocked. Gated on 30 days of sending history before TLD-swap revisit.
- **5j removed** — "Text-selection highlight quirks" moved out of item 5 (Polish) into new item 9 (Styleguide polish).
- **Item 9 restructured** — renamed from "Gallery" to "Styleguide polish". Sub-items now: `a` Gallery video support ✅, `b` image scaling, `c` zoom/click-through (lightbox + prev/next + grid/list toggle), `d` populate video assets, `e` padding/margin/spacing drift (pre-existing), `f` text-selection highlight quirks (moved from 5j).

### `docs/backlog-notes.md#7e`
- Refreshed the paste-ready commands to the post-Phase-2 layout (`apps/website`, `apps/studio`, `apps/styleguide` + `packages`, `assets`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`). Marked "Applied 2026-05-18".

### Borderline gating left as-is (user's call)
- **8d** (Unsubscribe wiring + custom tracking domain) — left ▢. Mixed scope: unsubscribe wiring is MailerLite UI config (doable solo); custom tracking domain CNAME also doable solo. Implicitly gated on MailerLite pipeline being healthy but the items themselves aren't strictly blocked.
- **8h** (Hand over to client list) — left ▢. Needs a decision about approach (separate MailerLite project vs user-management transfer); user is operational client so not externally blocked.
- **9d** (Populate video assets) — left ▢. Content-task, content from Ýr would help but not strictly required.

### Root `package.json`
- Re-added `dev-server` script: `pnpm --parallel --filter website --filter studio --filter styleguide dev`. Was lost in the Phase 2 root-package rewrite. Boots all three apps concurrently with combined output (cross-platform; replaces the original `pnpm dev & pnpm studio:dev & pnpm styleguide:dev` chain).

### Gallery — attempted refactor and full revert
- `apps/styleguide/src/pages/Gallery.jsx` was rewritten to wrap everything in `ContentFilters` (`@components/molecules/ContentFilters`) + `FullscreenOverlay` (`@components/primitives/FullscreenOverlay`) with grid/list view toggle. User immediately flagged it as an unrequested redesign — the rewrite dropped the original sticky header summary line, the right-side group jump-nav, the per-group `<h2>` + count sections.
- **Reverted in full** — Gallery.jsx restored byte-for-byte to the original 201-line version (in-grid 3×3 expansion, per-group sections, group jump-nav, sticky header summary all intact).
- **Lesson recorded** — when the user says "maybe utilise X", treat as exploration, not approval. The asked-for changes (lightbox + prev/next, grid/list toggle, optional search) should be applied SURGICALLY to the existing layout, not via a top-down rewrite. Keep header + per-group sections + jump nav.

## Current State

### Working
- **All four phases of the repo restructure on main** (Phase 0–4, backlog item 11 fully ✅ as of earlier today).
- **All three Vercel projects building green**, all production sites live (`another-creation.xyz`, `studio.another-creation.xyz`, `brand.another-creation.xyz`).
- **Ignored Build Step active on all three Vercel projects.** Pushes that touch only one app now skip rebuilds on the other two — saves build minutes and unblocks merge-to-deploy time.
- **Backlog accurately reflects gating.** All 🚧 items are genuinely externally blocked. Open ▢ items are actionable.
- **`pnpm dev-server` restored** at root — single command boots website (5173) + studio (3333) + styleguide (5174) in parallel.
- **Gallery is back to its original behavior** post-revert — clicking a thumbnail expands it in-grid 3×3, the rest of the layout unchanged.

### Known Issues / Deferred
- **Surgical Gallery rework still pending** — the next attempt must keep the original header + per-group structure and ONLY change: (a) replace in-grid expansion with a FullscreenOverlay lightbox + prev/next arrows + ArrowLeft/ArrowRight keys, and (b) add a small grid/list toggle in the header. NO ContentFilters integration. NO restructure of the per-group sections.
- **Padding/margin/spacing drift in styleguide** (now backlog 9e) — pre-existing, not a re-org regression. Diagnosis path: A/B against the pre-fold-in `kol-client-ac` reference.
- **Text-selection highlight quirks** (now backlog 9f) — moved from 5j, not described in detail elsewhere; needs user to specify what the quirks are when picked up.
- **Newsletter pipeline verification status still contradictory** — AGENT-CONTEXT line 53 says "Domain verification in MailerLite green" but user mentioned mid-session that verification actually failed. Whoever picks up 8j next must reconcile by checking MailerLite UI.
- **PayPal Developer UI verification (1e tail)** — code is clean, but the PayPal REST app's return URLs may still reference the preview URL. User should verify next time they're in the PayPal developer dashboard.
- **`@components` + `@website-data` aliases still live** in `apps/styleguide/vite.config.js`. JSX extraction + alias retirement still deferred per Phase 2 decision Q2.

## Next Steps
1. **Surgical Gallery rework** — apply the user's three asks to the original Gallery.jsx layout WITHOUT rewriting it. Lightbox + prev/next arrows (replace in-grid expand) and grid/list toggle in the header. Keep everything else byte-identical to current. Single file, ~30-50 lines of additions, not 280.
2. **Re-letter item 5 sub-items** if user wants — currently `e, i, k, l, m, n` after `j` removal. Cosmetic.
3. **Backlog 5** polish sweep — 12 small UI fixes. Could be a focused half-day session.
4. **Newsletter pipeline status reconciliation** — needed before any newsletter work picks up.
5. **Metadata Pass 2** — Sanity-driven dynamic routes; small backlog 6d Pass 2, ~half day.
