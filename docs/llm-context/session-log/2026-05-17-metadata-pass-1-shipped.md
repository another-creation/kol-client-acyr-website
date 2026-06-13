# Session: Metadata Pass 1 shipped + four-doc set + Vercel filesystem-routing debug

**Date:** 2026-05-17
**Agent:** Grim (Claude Opus 4.7, 1M context)
**Summary:** Stood up the edge-injection metadata pipeline end-to-end. 12 static routes get route-specific titles + descriptions + OG/Twitter cards + canonical URLs + robots directives. 18 OG images (3 sets: logo/photoshoot/yr) mapped to 11 named constants. Vercel rewrite + serverless proxy fills `dist/app.html` placeholders per request. Hit a launch-blocker on the bare `/` route (Vercel filesystem routing won over rewrites), debugged through three hypotheses, fixed by renaming the build output. Built a four-doc set in `docs/client/kol-client-acyr/01-website/04-metadata/` and a separate Pass-1-incident log. Verified live in production.

## Changes Made

### Pass 1 metadata pipeline (live in prod, commit `937e8c1` on `main`)
- `index.html` — full default OG + Twitter tag set with `__TITLE__` / `__DESCRIPTION__` / `__IMAGE__` / `__URL__` / `__ROBOTS__` placeholders. `og:image:width/height` declared 2400/1260 to match the actual files.
- `api/metadata-proxy.mjs` — new serverless function. Reads `dist/app.html`, resolves metadata via `lookupMeta(pathname)`, substitutes placeholders, returns HTML with `Cache-Control: s-maxage=60, stale-while-revalidate`. Handles dynamic-route fallback (`/blog/:slug` → `STATIC_META['/blog']` until Pass 2 wires Sanity lookup).
- `src/data/seo-metadata.js` — `STATIC_META` for 12 routes, `DEFAULT_META`, `lookupMeta()`, `escapeHtml()`. 11 named `OG_*` constants pointing at the new image files.
- `vercel.json` — replaced SPA catch-all `/(.*) → /index.html` with `[/, /:path*] → /api/metadata-proxy`. `/site/*` legacy redirects preserved.
- `package.json` — `build` script now: `vite build && mv dist/index.html dist/app.html`. Kills the filesystem match Vercel was using to bypass the rewrite for `/`.
- `public/robots.txt` — allow all, disallow `/cart` + `/checkout` + `/checkout/confirmation`, sitemap pointer.
- `public/sitemap.xml` — 12 routes hand-listed, priority + change-frequency assigned.
- `public/og/` — 18 images (3 sets × 6): `logo-*` (brand-forward), `ps-*` (photoshoot), `yr-*` (Yr-centric). 10 mapped to constants, 8 in reserve. All 2400×1260 JPG.
- `scripts/test-meta.sh` — crawler-simulation script. Three target modes (localhost / live / arbitrary preview URL). Auto-reads `VERCEL_AUTOMATION_BYPASS_SECRET` from `.env.local` for `.vercel.app` URLs and appends bypass query string. Uses `mktemp` cookie jar so Vercel's JWT-set-and-redirect dance doesn't drop the auth cookie. Trap cleans up on exit.
- `.env.local` — added `VERCEL_AUTOMATION_BYPASS_SECRET` field.

### Doc set in `docs/client/kol-client-acyr/01-website/04-metadata/` (paired four-doc structure)
- `metadata.md` — the plan. Edge-injection architecture, file inventory, three-pass implementation order. Frontmatter harmonized to use `topics` list, `pass_status` block, `companion_to` + `related` linking the other three docs.
- `routes.md` — canonical copy reference. Per-route titles, descriptions, target queries, OG constant. Tables for Pass 1 (live), Pass 2 (Sanity-driven, planned), Pass 3 (products, planned), noindex routes. Single source of truth for copy.
- `og-images.md` — asset inventory. 18 files in three sets, full file links into `public/og/`, route mappings, reserve list, swap procedure.
- `playbook.md` — operations doc. Copy workflow (character budgets, voice anchors), deploy → indexed loop, Google Search Console + Bing Webmaster setup, Umami self-host pattern (fork → Vercel → `/metrics` first-party proxy), iteration rules, tools catalogue.
- `crawler-blocked-on-root-route.md` — incident log for the Pass 1 root-route bug. §1 setup → §2 branch workflow → §3 script design → §4 auth + cookie blockers → §5 root-route bug + three hypotheses + real cause → §6 verification → §7 lessons → §8 files touched.

All five docs cross-link via Obsidian wikilinks. Frontmatter uses typed Properties with nested topics/tags/related/companion_to.

### Studio favicon
- `studio/static/favicon.svg` — symlink to root `public/favicon.svg`. Sanity Studio's generated HTML references `/static/favicon.svg`; SVG alone covers all modern browsers.

### Styleguide cleanups (backlog 7f)
- `fgOn(bg)` color-contrast helper moved from `styleguide/src/editor/modes/palette/palettes.js` to new neutral file `styleguide/src/utils/contrast.js`. Two consumers updated (`SlideDeck.jsx`, `editor/modes/palette/layouts.jsx`). SlideDeck no longer reaches sideways into the editor tier.
- `styleguide/src/components/framework/Layout.jsx` — dropped dead `/site/*` regex branch and the unused `ExitPreview` import. Three lines + one import gone.

### Backlog + memory
- `docs/backlog.md` — 6d split into Pass 1 ✅ / Pass 2 ▢ / Pass 3 ▢ with links to all five metadata docs. Pass 1 line updated to reflect live status (12 routes + 18 OG images + robots + sitemap, live 2026-05-17). Item 12 (studio favicon) ✅. 7d closed. 7f cleanups ✅. 8 (newsletter) updated with free-tier + AI-drafted constraints.
- `docs/backlog-notes.md` — anchor companion for the lean checklist; 6d points at all three metadata docs.
- Memory entries saved this session:
  - `feedback_backlog_is_a_checklist.md` — backlog stays lean; detail goes to backlog-notes.md
  - `feedback_avoid_commit_verb.md` — don't use "commit" outside literal git
  - `feedback_keep_tracking_docs_accurate.md` — update tracking docs to match reality without asking
  - `feedback_no_solo_refactor_decisions.md` — updated to allow execution of scoped backlog items

## Current State

### Working
- **Pass 1 metadata pipeline live on production.** Verified via `./scripts/test-meta.sh / live`, `/shop live`, `/handmade live`. All routes return route-specific tags. `/robots.txt` and `/sitemap.xml` serve as static files (HTTP 200, not via proxy).
- **Edge-injection proxy.** `/api/metadata-proxy` reads `dist/app.html`, fills `__TITLE__` / `__DESCRIPTION__` / `__IMAGE__` / `__URL__` / `__ROBOTS__` per route, returns to crawlers + browsers alike. React hydrates over the top for browsers.
- **Dynamic-route fallback.** `/blog/:slug`, `/collections/:slug`, `/shop/:slug`, `/handmade/:slug` resolve to the parent listing's meta until Pass 2/3 wire real lookups.
- **18 OG images live** at `another-creation.xyz/og/open-graph-{logo,ps,yr}-{01..06}.jpg`. Mapped to 11 constants in `seo-metadata.js`.
- **Vercel Deployment Protection bypass** works for automated crawler-sim against preview deploys (token in `.env.local`, script auto-applies).
- **Studio favicon** rendering on `studio.another-creation.xyz`.
- **Styleguide `fgOn` + Layout.jsx cleanups** shipped, no regressions.

### Known Issues / Deferred
- **Pass 2 not started** — Sanity schemas (`seo` field group on `article` + `collection`) + proxy extension for `/blog/:slug` / `/collections/:slug` / `/blog/author/:slug` lookups. Plan documented in `metadata.md` §2 Tier 1.
- **Pass 3 not started** — proxy extension for `/shop/:slug` + `/handmade/:slug` via `shop-data.js`. Gotcha: Printful mockups are portrait/square, will render as small thumbnails on FB/LinkedIn. Decision deferred.
- **All-three-project rebuild waste continues** — every push to `main` rebuilds site + studio + styleguide. Paste-ready Ignored-Build-Step commands sit in `docs/backlog-notes.md#7e` for the user to apply via Vercel UI.
- **Google Search Console + Bing Webmaster not yet set up** — sitemap submission pending. Steps documented in `playbook.md` §4 + §5.
- **Sanity API token (`migration-script`)** still in `.env.local`. One-shot migration already complete. Can be revoked when comfortable.

## Next Steps
1. **Paste the three Ignored-Build-Step commands** into Vercel UI for `kol-client-acyr-website`, `kol-client-acyr-studio`, `kol-client-acyr-styleguide` — instant CI savings.
2. **Pass 2 — Sanity-driven metadata.** Add `seo` field group to `article` + `collection` schemas; deploy Studio; extend `api/metadata-proxy.mjs` with Tier 1 Sanity lookup. ~2 hours per plan.
3. **GSC + Bing submission.** 10 min admin step once Pass 1 has been live long enough for the canonical URLs to make sense (already true).
4. **(Phase 2)** Pass 3 — product routes via `shop-data.js`.
5. **(Phase 2)** Bump `FLAT_SHIPPING_EUR` €10 → €14 (or wait for real Printful shipping rates).
