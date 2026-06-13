# Session: Phase 3 + Phase 4 shipped — repo restructure closed

**Date:** 2026-05-18
**Agent:** Grim (Claude Opus 4.7, 1M context)
**Summary:** Continuation of the same calendar-day session that shipped Phase 2 + the editor render fix earlier. Executed Phases 3 and 4 of the repo restructure back-to-back, each as its own branch / PR / merge. Phase 3 retired workspace-redundant artifacts (verify-versions script, inert studio yaml, install-command override) and bumped studio React so pnpm hoists a single version. Phase 4 did naming hygiene + dead-code sweep — renamed editor CSS files, swept remaining `kol-` residues including a real (latent) bug in `SpectrumControls.jsx`'s SVG fragment IDs, deleted Sanity-superseded data files, archived 6 superseded docs to `docs/client/kol-client-acyr/99-archive/`, added topology-note headers to the setup docs. Backlog item 11 — the multi-phase repo restructure — is fully closed (Phases 0–4 all ✅). All three Vercel projects build green; production sites at `another-creation.xyz`, `studio.another-creation.xyz`, `brand.another-creation.xyz` all live.

## Changes Made

### Phase 3 — Workspace cleanup (branch `phase-3-workspace-cleanup`)
- **`scripts/verify-versions.mjs`** — `git rm`'d. Workspace dedup makes it obsolete.
- **`package.json`** (root) — removed the `verify-versions` script entry.
- **`apps/studio/pnpm-workspace.yaml`** — `git rm`'d. Root `pnpm-workspace.yaml` is authoritative; the per-app file was inert post-Phase-2.
- **`apps/studio/package.json`** — React + react-dom 19.2.4 → 19.2.5. pnpm install dedupes to a single resolved React 19.2.6 across all six workspace projects.
- **Vercel install-command override** (Vercel UI, user-side) — `cd .. && pnpm install` removed from the `kol-client-acyr-styleguide` project's Build & Development Settings. Default install at repo root now handles styleguide via workspace autodetection.

### Phase 4 — Naming hygiene + dead code (branch `phase-4-naming-hygiene`)

#### CSS file renames
- `apps/styleguide/src/editor/styles/kol-editor.css` → `editor.css`
- `apps/styleguide/src/editor/styles/kol-typography-fonts-full.css` → `typography-fonts-full.css`
- Import updates: `apps/styleguide/src/editor/EditorShell.jsx:1` and `apps/styleguide/src/editor/modes/type/TypeLab.jsx:1`

#### `kol-` residue sweep
- **`apps/styleguide/src/editor/color/SpectrumControls.jsx`** — `url(#kol-wheel-ring-clip)`, `url(#kol-wheel-white-fade)`, `url(#kol-wheel-black-fade)` → `url(#ac-wheel-*)`. **Latent bug fix**: the `<clipPath>` + `<linearGradient>` definitions in the same file had already been renamed to `id="ac-wheel-*"` in Phase 1, but the `url()` refs that consumed those IDs were missed. The spectrum wheel's outer ring clip + triangle white/black fade gradients weren't binding to anything — broken refs, silently degraded rendering.
- **`apps/styleguide/src/editor/compose/CanvasArea.jsx`** — `application/x-kol-library` MIME identifier → `application/x-ac-library` (custom internal DnD type; not in active use because no `setData` call exists, but the consumer check is renamed for consistency).
- **`apps/styleguide/src/editor/icons/svg/layer-group.svg`** — `var(--kol-surface-primary, transparent)` → `var(--ac-surface-primary, transparent)`.
- **`apps/styleguide/src/styles/design-foundations.css`** — `kol-combo-fade` keyframes + animation ref → `ac-combo-fade`.
- **4 dead doc-path comments removed** — `Architecture: docs/kol-migration/...` references from `apps/styleguide/src/data/{color,typography}.js` + `apps/styleguide/src/editor/modes/palette/{pools,palettes}.js`. The referenced path is from a different repo and has been dead since the styleguide fold-in.

#### Dead data deletion
- `apps/website/src/data/blog-data.js` — `git rm`'d. Sanity-migrated; no live consumers post-edit below.
- `apps/website/src/data/collections-data.js` — `git rm`'d. Same.
- **`apps/styleguide/src/pages/Acyr.jsx`** — stripped `import { COLLECTIONS } from '@website-data/collections-data'` and `import { ARTICLES, AUTHORS } from '@website-data/blog-data'`. Replaced dynamic media-inventory rows (one per collection + one per article) with static "live in Sanity · see Studio" placeholders. Dropped `collections`, `looks`, `articles`, `authors` from the snapshot `counts` object; trimmed the snapshot prose accordingly.
- **`scripts/migrate-to-sanity.mjs`** — RETIRED header added. Script kept on disk for reference pattern (deterministic doc IDs, SHA-1 asset dedup, Portable Text conversion); broken now that source data files are gone. Re-run requires restoring data files from git history.

#### Doc archive
- Plain `mv` (not `git mv` — these markdown files were never git-tracked):
  - `docs/client/styleguide/01-kol-ds-inventory.md` → `docs/client/kol-client-acyr/99-archive/`
  - `docs/client/styleguide/02-ac-brand-inventory.md` → `docs/client/kol-client-acyr/99-archive/`
  - `docs/client/styleguide/03-styleguide-surface.md` → `docs/client/kol-client-acyr/99-archive/`
  - `docs/client/styleguide/04-live-site-component-inventory.md` → `docs/client/kol-client-acyr/99-archive/`
  - `docs/client/styleguide/05-merge-plan.md` → `docs/client/kol-client-acyr/99-archive/`
  - `docs/client/kol-client-acyr/02-brand/styleguide-text-rewrite.md` → `docs/client/kol-client-acyr/99-archive/`
- `docs/client/styleguide/` directory removed (empty after the moves).

#### Setup-doc topology notes
- `docs/client/kol-client-acyr/01-website/01-setup/01-overview.md` and `docs/client/kol-client-acyr/01-website/01-setup/02-playbook.md` — added topology-note headers explaining the current repo uses a pnpm workspace (`apps/{website,studio,styleguide}/` + `packages/{ds,brand-data}/` + `assets/`) while the playbook steps below describe a simpler sibling-projects layout. Path mapping table included. The deeper code recipes still work for either pattern. Full rewrite intentionally deferred — these docs serve as a setup runbook for OTHER projects, and the simpler sibling layout is actually friendlier for first-time scaffolding.

#### `@website-data` alias — narrowed, not retired
- `apps/styleguide/vite.config.js` — alias kept (Acyr.jsx still uses it for `@website-data/shop-data` to render product counts). Comment updated: the alias's purpose is now narrowly "cross-app shop-data dep," not "pre-Sanity dead data refs." Full retirement is a deferred follow-up — requires either moving `shop-data.js` into `packages/brand-data/` or giving the styleguide its own Sanity-backed data fetcher.

### Post-merge doc updates (after both merges)
- `docs/backlog.md` — item 11 Phase 3 ✅; item 11 Phase 4 ✅. All 5 phases now complete.
- `docs/llm-context/AGENT-CONTEXT.md`:
  - Last-updated stamp 2026-05-18 (Phase 4 merged — re-org closed).
  - Phase 3 bullet added to *what works* (deleted verify-versions, dropped inert yaml, retired install-command override, bumped React).
  - Phase 4 bullet added to *what works* (CSS renames, residue sweep, dead-data deletion, doc archive, setup-doc notes; explicit "backlog 11 fully closed" callout).
  - *Pending* line for the restructure rewritten — now struck through with a one-liner noting "✅ Closed 2026-05-18" and naming JSX extraction + full `@website-data` retirement as separate deferred follow-ups (not phases).
  - Key Files table: removed rows for `scripts/verify-versions.mjs` + `apps/studio/pnpm-workspace.yaml` (both retired in Phase 3).
  - "Contracts the next agent should not quietly break" — install-command override note updated to say all three projects now use Vercel default.

## Current State

### Working
- **Repo restructure (backlog 11) closed.** Phase 0 (research) ✅; Phase 1 (DS collapse + `kol-` → `ac-` rename) ✅ `3a8eaa0`; Phase 2 (apps + packages split + pnpm workspace + `@ac/ds` + `@ac/brand-data` extracted) ✅ `ebd6668`; Phase 3 (workspace cleanup) ✅; Phase 4 (naming hygiene + dead code) ✅. All five phases shipped to main inside two calendar days (2026-05-17 → 2026-05-18).
- **All three apps build green.** Website (Vite), styleguide (Vite), studio (Sanity CLI). pnpm workspace at repo root resolves all 6 projects; single hoisted React 19.2.6.
- **Production sites live.** `another-creation.xyz`, `studio.another-creation.xyz`, `brand.another-creation.xyz`. Editor at `brand.another-creation.xyz/editor/compose` renders correctly post-Phase-1 CSS rename + Phase 4 SVG ID fix.
- **Workspace topology stable.** `apps/{website,studio,styleguide}/` + `packages/{ds,brand-data}/` + `assets/{brand,fonts,favicon.svg}/`. Single `pnpm-workspace.yaml` + single `pnpm-lock.yaml` at root. Three Vercel projects each with Root Directory = `apps/<name>/`, default install command.

### Known Issues / Deferred
- **`@components` alias still live** in `apps/styleguide/vite.config.js` pointing at `../website/src/components`. JSX extraction (move shared atoms/molecules/organisms into `packages/ds/components/jsx/`) is a separate deferred follow-up — kicked because Phase 2 decision Q2 said "after we see real shared-component pressure." Same rationale stands.
- **`@website-data` alias still live** for the styleguide's `Acyr.jsx` to read `shop-data.js`. Retirement options: (a) move `shop-data.js` into `packages/brand-data/` (probably wrong — it's commerce data, not brand identity), (b) extract `packages/website-data/` for commerce stuff (more granular packaging), (c) give the styleguide a Sanity-backed fetcher + drop the shop-data dependency (probably the cleanest long-term but requires Sanity-client wiring in styleguide). No urgent driver.
- **Pre-existing styleguide padding/margin/spacing drift** — confirmed by user as NOT a Phase 2/3/4 regression. Diagnosis path: A/B against the pre-styleguide-fold-in `kol-client-ac` reference repo. Not blocking; deferred.
- **`scripts/migrate-to-sanity.mjs` is broken** — data files it reads are deleted. Header notes "RETIRED 2026-05-18 (Phase 4)." Script kept as a reference pattern, not runnable.
- **Newsletter pipeline verification status remains contradictory in the docs** — AGENT-CONTEXT line 53 (Phase 2 update) says "Domain verification in MailerLite green"; the original 8d/8g pending items say "gated on verification finishing." User mid-session said verification actually failed. Reconciliation deferred to whoever picks up 8j next.
- **Setup-playbook + setup-overview** carry topology-note headers but the deeper code recipes still describe a sibling-projects layout. Anyone replicating the stack on a NEW project can choose either pattern; anyone trying to read the playbook as documentation of CURRENT state needs to mentally apply the path mapping in the header.
- **15ish residual `kol-` mentions** in non-code surfaces — commit messages, prior session logs, historical narrative in `docs/llm-context/AGENT-CONTEXT.md` and `docs/client/kol-client-acyr/01-website/05-restructure/`. All intentional (historical record) or contextual ("kol-client-acyr-website" Vercel project names, `kolkrabbi.io` references). Not Phase 4 scope.

## Next Steps
1. **Newsletter design rework (backlog 8j)** — originally the driver for the whole restructure; now fully unblocked. First task on pickup: reconcile the MailerLite verification status (genuinely failed? still pending? actually green?). Then author the redesign against `packages/ds/` (the now-stable cascade). Decide on the home card's "save 10% on your first order" claim — no discount mechanism exists.
2. **Backlog 1e — URL sweep** — replace hard-coded `kol-client-acyr-website.vercel.app` refs (canonical URLs, sitemap, OG meta, PayPal app return URLs) with `another-creation.xyz`. Small focused PR.
3. **Metadata Pass 2 — Sanity-driven dynamic routes** — add `seo` field group to `studio/schemaTypes/{article,collection}.js`, extend `api/metadata-proxy.mjs` with Tier 1 Sanity lookup for `/blog/:slug`, `/collections/:slug`, `/blog/author/:slug`. Plan in `docs/client/kol-client-acyr/01-website/04-metadata/01-plan.md` §11.
4. **JSX extraction** — `@components` alias retirement; non-trivial scope. Defer until there's a real driver (a component diverges between apps, or the styleguide needs to publish components).
5. **`@website-data` alias retirement** — small scope but needs a topology call (where does `shop-data.js` actually belong?). Defer until JSX extraction OR until someone wants to clean up the cross-app coupling.
