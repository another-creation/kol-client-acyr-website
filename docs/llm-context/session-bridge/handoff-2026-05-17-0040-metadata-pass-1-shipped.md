# Handoff — 2026-05-17 00:40

## Goal of the current arc

Three-pass metadata rollout for `another-creation.xyz`. Pass 1 (static routes + infrastructure) shipped to production this session. Pass 2 (Sanity-driven dynamic routes) and Pass 3 (product routes) are the remaining passes — both planned, both awaiting green light from the user.

## Last actions taken (causal trail, newest first)

- Updated memory + `MEMORY.md` index with `feedback-keep-tracking-docs-accurate` (don't ask permission to update tracking docs to reflect reality).
- Updated `backlog.md` 6d Pass 1 line: `12 static routes + 18 OG images (3 sets) + robots + sitemap — live in prod 2026-05-17`.
- Wrote `docs/client/kol-client-acyr/01-website/04-metadata/05-incident-crawler-blocked.md` (incident log) replacing initial too-generic `troubleshooting.md`. Eight-section narrative covering the bug, the branch workflow, the script design, the auth + cookie blockers, the real bug (Vercel filesystem priority), the fix, verification, lessons.
- User merged `metadata-pass-1` → `main`; commit `937e8c1` is live. All three Vercel projects rebuilt (site + studio + styleguide) — the Ignored-Build-Step issue (backlog 7e) is now actively wasting CI time on every push.
- Smoke-tested production: `/`, `/shop`, `/handmade`, `/robots.txt`, `/sitemap.xml` all green.
- Final fix (commit `937e8c1`): renamed build output `dist/index.html` → `dist/app.html` so Vercel filesystem routing doesn't preempt the rewrite for bare `/`. Proxy reads `app.html`.
- Earlier attempts that didn't fix the bare `/` bug: changed rewrite source `/(.*)` → `/:path*` (commit `b16a06c`), then added explicit `{ "source": "/" }` rule first. Both pushed and tested; neither worked because the actual blocker was filesystem-routing-precedence, not pattern matching.
- Patched `scripts/test-meta.sh` to use a `mktemp` cookie jar (`-c`/`-b`) so Vercel's bypass JWT survives the Set-Cookie + 307 redirect. Initially the bypass token alone wasn't enough because curl was dropping the cookie.
- Generated `VERCEL_AUTOMATION_BYPASS_SECRET` via Vercel UI (Settings → Deployment Protection → Protection Bypass for Automation), stored in `.env.local`. Script auto-applies it for any `.vercel.app` URL.
- Built the four-doc set in `docs/client/kol-client-acyr/01-website/04-metadata/`: `metadata.md` (plan), `routes.md` (copy reference), `og-images.md` (asset inventory), `playbook.md` (operations). All cross-linked, Obsidian Properties frontmatter harmonized.
- 18 OG images dropped into `public/og/` by user, organized into three sets (logo/ps/yr × 6 each). Mapped to 11 constants; 8 reserve.
- Generated initial placeholder `default.png` via ImageMagick (Yr portrait centered on brand burgundy `#750E20`) — superseded by the 18 real images.
- Studio favicon shipped earlier in the session: `studio/static/favicon.svg` symlinked to root `public/favicon.svg`.
- Styleguide cleanups (backlog 7f): `fgOn` extracted from editor tier to `styleguide/src/utils/contrast.js`; `Layout.jsx` dead `/site/*` regex branch deleted.
- Backlog rewritten from verbose changelog into lean checklist + companion notes file (`backlog.md` + `backlog-notes.md`). Convention saved to memory.

## Current state / open decision points

- **Pass 1 is live in production.** Verified via smoke tests against `another-creation.xyz`. No regressions reported.
- **Pass 2 is next.** Plan is fully documented in `metadata.md` §11 (Pass 2 section) + `routes.md` (Sanity-driven table). Awaiting user green light.
- **Pass 3 is gated** on Pass 2 + live verification. Plan documented; not started.
- **Backlog 7e (Ignored Build Step) is now hot** — every push to main rebuilds three Vercel projects unnecessarily. Three paste-ready `git diff --quiet` commands sit in `backlog-notes.md#7e`. User has the dashboard access; this is one-click-per-project work.
- **GSC + Bing setup** documented in `playbook.md` §4 + §5. Both are free, both take ~10 min. Recommended to do once Pass 1 has been live a few hours.
- **`fb:app_id`** Facebook Sharing Debugger will complain about it missing. Only needed for FB Analytics/SDK. Safe to ignore.
- **Sanity API token rotation** still open. `migration-script` token is unused after the one-shot migration; can be revoked when comfortable.

## Next intended action

- **First task** if user returns to metadata work: Pass 2. Add `seo` field group to `studio/schemaTypes/article.js` + `collection.js`, deploy Studio, extend `api/metadata-proxy.mjs` with Tier 1 Sanity lookup for `/blog/:slug` / `/collections/:slug` / `/blog/author/:slug`. The GROQ queries should mirror the existing helpers in `src/lib/queries.js` but server-side. Wire fallback chain (`seo.seoTitle` → `title` → site default).
- **If user wants to defer Pass 2 and ship operational polish first:** paste the three Ignored Build Step commands into Vercel UI (backlog 7e), then run GSC + Bing sitemap submission.

## Working memory not yet in AGENT-CONTEXT

- **Vercel filesystem routing nuance is now load-bearing.** `dist/index.html` MUST stay renamed to `dist/app.html` — if anyone reverts the build script change in `package.json`, the bare `/` route silently breaks on production. The incident doc `crawler-blocked-on-root-route.md` is the canonical reference for why.
- **Branch alias URLs are stable across commits.** `kol-client-acyr-website-git-metad-96a7d3-tor-grimssons-projects.vercel.app` always points to the latest deploy on `metadata-pass-1` — no need to grab a new URL each time. (The `96a7d3` in the URL is not a commit hash; it's part of the project's branch-alias identifier.)
- **`test-meta.sh` cookie-jar dance** is necessary specifically because Vercel's Protection Bypass uses a Set-Cookie + 307 redirect pattern. If we ever switch to header-based bypass (`x-vercel-protection-bypass: <token>` as a request header), the cookie jar might become unnecessary — but query-param + cookie-jar is the path that's verified working.
- **`VERCEL_AUTOMATION_BYPASS_SECRET` value** (`LsKVLhQ5GukRQOD960ARxIh0b0x2AXwL`) lives only in `.env.local` and Vercel project settings. Not in any committed file. If `.env.local` gets wiped, regenerate via Vercel UI.
- **User's name and patience-tested phrases this session:** `Stupid SIMPLE go`, `just start figureing this out`, `would sit down and read the fucking manual`, `dude this has to conclude soon`. The work concluded with Pass 1 live; the patience held. Next session don't propose options menus or double-ask on accuracy work.
- **OG `og:image:width/height`** is currently hardcoded at 2400/1260 in the `index.html` template. If we ever ship images at a different dimension (e.g. landscape product crops in Pass 3), these need to become per-route placeholders (`__IMAGE_WIDTH__` / `__IMAGE_HEIGHT__`) or be removed entirely (FB will sniff the actual image dimensions).
- **Default `OG_DEFAULT` + `OG_HOME` + `OG_COMMERCE`** all alias to the same file (`open-graph-logo-01.jpg`). Intentional — fallback consistency, plus `/cart`/`/checkout` are `noindex` so their OG image doesn't matter beyond direct social shares.
- **The reserve 8 OG images** (`logo-05/06`, `ps-04/05/06`, `yr-04/05/06`) are dropped in `public/og/` but NOT mapped to any constant. They're available for Pass 3 per-product overrides or future per-section variants. Documented in `og-images.md`.
