# Session: Phase 2 shipped (apps + packages + workspace) + editor render fix

**Date:** 2026-05-18
**Agent:** Grim (Claude Opus 4.7, 1M context)
**Summary:** Executed Phase 2 of the repo restructure end-to-end on `phase-2-apps-packages` branch — 1,420 file changes moving from sibling-projects-with-aliases to a real pnpm workspace (`apps/{website,studio,styleguide}` + `packages/{ds,brand-data}` + `assets/`). Resolved a post-merge Vercel metadata-proxy bundling regression (`includeFiles` config + multi-candidate path resolution). Then traced and fixed a styleguide editor render bug — Phase 1's bulk `kol-` → `ac-` rename hit JSX consumers but explicitly excluded `kol-editor.css` + `color-panel.css`, leaving a silent class-name mismatch that collapsed the editor's 3-column grid layout. Deleted a 1211-line orphan `kol-framework.css` discovered during the audit (post-styleguide-fold-in dead code, all 116 classes already covered by the Phase 1 split). All post-merge docs (backlog, AGENT-CONTEXT, ARCHITECTURE) refreshed for the workspace shape.

## Changes Made

### Phase 2 — apps + packages split (commit `ebd6668`)
- **File moves** — `git mv src api public vite.config.js eslint.config.js vercel.json package.json pnpm-lock.yaml index.html apps/website/`; `git mv studio apps/studio`; `git mv styleguide apps/styleguide`.
- **`packages/ds/`** — `git mv apps/website/src/ds packages/ds`. Created `packages/ds/package.json` (`@ac/ds`, `main: index.css`, subpath exports for tokens/utilities/components/framework).
- **`packages/brand-data/`** — `git mv` of `config.js`, `data/{info,business-data,images,branded-assets,placeholder-logos}`, and `logos/` from `apps/website/src/brand/` into `packages/brand-data/`. Wrote `package.json` (`@ac/brand-data`, per-file subpath exports + `react`/`react-dom` peerDeps so KolLogo JSX resolves in consumers) + `index.js` barrel re-exporting `BRAND`, `BRAND_INFO`, business-data, `ACImages`, `ASSET_SPECS`.
- **Website-only data** — `git mv apps/website/src/brand/data/{shop-data.js,printful-products.json,blog-data.js,collections-data.js} apps/website/src/data/`. `apps/website/src/brand/` removed.
- **`assets/`** — `git mv apps/website/public/{brand,fonts,favicon.svg} assets/`. Recreated 7 symlinks: `apps/website/public/{brand,fonts,favicon.svg}` + `apps/styleguide/public/{brand,fonts,favicon.svg}` + `apps/studio/static/favicon.svg`, all pointing at `../../../assets/*`.
- **Workspace setup** — wrote root `pnpm-workspace.yaml` (`apps/*` + `packages/*` + `allowBuilds.esbuild: true` for pnpm v11), root `package.json` (workspace-only, no deps, just proxy scripts via `pnpm --filter <app> <cmd>` + repo-wide scripts). Per-app lockfiles deleted; single workspace lockfile generated.
- **Consumer imports — bulk sed across ~200 files** in `apps/website/src/` and `apps/styleguide/src/`:
  - `../../brand/{config,data/info,data/business-data,data/images,data/branded-assets,data/placeholder-logos,logos/KolLogo,logos}` → `@ac/brand-data/{config,info,business-data,images,branded-assets,placeholder-logos,logos/KolLogo,logos}`
  - `../../brand/data/{shop,blog,collections}-data` → `../../data/{shop,blog,collections}-data` (stays in website)
  - styleguide `@brand/*` → `@ac/brand-data/*` (alias killed)
  - styleguide `@brand/data/{shop,blog,collections}-data` → `@website-data/*` (new temporary alias, see below)
- **`api/_lib/products.mjs`** — import path `'../../src/brand/data/printful-products.json'` → `'../../src/data/printful-products.json'`.
- **`scripts/sync-printful.mjs`** — `IMG_DIR` + `OUTPUT_JSON` re-anchored at `apps/website/{public,src/data}/`, `downloadImage` dest updated.
- **`scripts/migrate-to-sanity.mjs`** — `PUBLIC_DIR` → `apps/website/public/`.
- **`scripts/verify-versions.mjs`** — TARGETS paths re-anchored to `apps/website/package.json` + `apps/styleguide/package.json`. Flagged for Phase 3 deletion.
- **Vite configs** — `apps/website/vite.config.js` gets `envDir: '../../'` (so Vite finds repo-root `.env.local`). `apps/styleguide/vite.config.js` removes `@brand` alias, retargets `@components` → `../website/src/components` (JSX extraction deferred per decision Q2), adds `@website-data` → `../website/src/data` (temporary, for `Acyr.jsx`'s pre-Sanity refs — Phase 4 deletes).
- **CSS entries** — `apps/website/src/index.css` now `@import "@ac/ds/index.css"`; `apps/styleguide/src/index.css` same.

### Vercel metadata-proxy bundling fix (commits `2a463d1`, `5bc8366`, `a64cd49`)
- **`apps/website/vercel.json`** — added `functions.includeFiles: "dist/app.html"`. First attempt `dist/**` shipped the 305 MB asset tree and exceeded the 300 MB function size limit; narrowed to the literal template only.
- **`apps/website/api/metadata-proxy.mjs`** — multi-candidate path resolution (`__dirname`-relative, `process.cwd()`-relative, one-up fallback) replaces the original single `process.cwd() + dist/app.html`. New error response enumerates the candidate paths with their failure codes — diagnostics for any future runtime-layout surprise.

### Styleguide editor render fix (post-merge, this session)
- **`apps/styleguide/src/editor/styles/kol-editor.css`** — 85 `.kol-*` selectors + CSS custom property refs renamed to `.ac-*`. 17 `.ac-editor-*` grid-layout selectors now bind correctly to the JSX (`className="ac-editor-shell"`, `ac-editor-grid`, `ac-editor-left`, `ac-editor-right`, `ac-editor-canvas-column`).
- **`apps/styleguide/src/editor/color/color-panel.css`** — 55 `.kol-color-panel-*` selectors renamed to `.ac-color-panel-*` to match `ColourPanelRef.jsx`.
- **`apps/styleguide/src/editor/styles/kol-typography-fonts-full.css`** — swept too (zero `.kol-*` selectors found inside; only @font-face directives).
- **`apps/styleguide/src/components/framework/kol-framework.css`** — `git rm`'d. 1211-line orphan from the 2026-05-16 styleguide fold-in. Verified zero imports anywhere; all 116 of its class selectors are accounted for in the post-Phase-1 split (`packages/ds/framework/framework.css` + `apps/styleguide/src/styles/design-foundations.css`).

### Post-merge doc updates
- **`docs/backlog.md`** — item 11 Phase 2 ✅.
- **`docs/llm-context/AGENT-CONTEXT.md`** — added Phase 2 bullet to *what works*, rewrote restructure pending line for Phase 3–4 specifics, refreshed Key Files table via bulk sed (`src/*` → `apps/website/src/*`, `studio/*` → `apps/studio/*`, etc.) + targeted edits on a handful of rows that needed prose updates (`apps/website/src/index.css` description, `apps/styleguide/vite.config.js` aliases description, `apps/styleguide/public/{brand,fonts,favicon.svg}` symlink targets, `scripts/verify-versions.mjs` Phase 3 retirement note, `apps/studio/pnpm-workspace.yaml` inert note), added 7 new table rows (`packages/ds/package.json`, `packages/brand-data/package.json`, `packages/brand-data/index.js`, `pnpm-workspace.yaml`, root `package.json`, `assets/{brand,fonts,favicon.svg}`, refreshed cascade entry pointer). Rewrote the "Contracts the next agent should not quietly break" section to reflect workspace topology (studio is now a workspace member by topology, brand-data is a package not an alias, etc.). Updated debugging recipes for `pnpm --filter` proxy scripts. Last-updated stamp → 2026-05-18.
- **`docs/llm-context/ARCHITECTURE.md`** — §1 retitled "DS tier ≠ brand identity (workspace packages, separate apps)", rewrote consequences for the new paths (`packages/ds/`, `packages/brand-data/`, `apps/website/src/data/`). §3 paths refreshed (`apps/website/api/`). §4 cascade entry → `apps/website/src/index.css` → `@ac/ds/index.css` → `packages/ds/index.css`; styleguide consumes via same package import. §5 catalog paths refreshed. §6 cart paths refreshed.

## Current State

### Working
- **Phase 2 live on main.** Production at `another-creation.xyz`, `studio.another-creation.xyz`, `brand.another-creation.xyz` all loading. All three Vercel projects rebuilt green after Root Directory flips (`apps/{website,studio,styleguide}`).
- **Metadata proxy live.** Homepage renders correct OG/meta; `dist/app.html` ships with the function via `includeFiles`; runtime path resolution finds it.
- **Styleguide editor 3-column layout restored** at `brand.another-creation.xyz/editor/compose`. JSX class names + CSS selectors aligned.
- **Workspace topology in place.** `pnpm install` at repo root resolves all 6 workspace projects (apps × 3 + packages × 2 + root). `pnpm --filter <app> <cmd>` works for all three apps.
- **AGENT-CONTEXT + ARCHITECTURE reflect the workspace shape.** Future agents reading the docs see paths matching the merged code.

### Known Issues
- **Pre-existing padding/margin/spacing drift in styleguide** (NOT caused by Phase 2). User confirmed it predates this session. Diagnosis deferred — diffing computed styles against the pre-fold-in A/B reference is the next step if it ever comes up.
- **Vercel `kol-client-acyr-styleguide` may still have the `cd .. && pnpm install` install-command override** in project settings. Builds went green post-merge so it either still works or Vercel auto-handled. Phase 3 formally removes it via Vercel UI.
- **`apps/studio/pnpm-workspace.yaml`** is inert (root workspace authoritative) but still present. Phase 3 deletes.
- **`scripts/verify-versions.mjs`** updated to new paths so it still runs, but pnpm workspace dedup makes it obsolete. Phase 3 deletes the script + the root `package.json` proxy entry.
- **Newsletter pipeline status genuinely unknown to me.** AGENT-CONTEXT line 53 says verification was green; pending items 8d/8g say "gated on verification finishing". User mentioned mid-session that verification actually failed but didn't elaborate. Treat the existing newsletter status bullet as suspect until user resyncs.

## Next Steps
1. **Phase 3 — Workspace cleanup.** Delete `scripts/verify-versions.mjs` + root `verify-versions` script. Delete `apps/studio/pnpm-workspace.yaml`. Verify Vercel styleguide project no longer needs the `cd .. && pnpm install` install-command override (test by removing in Vercel UI, re-deploy preview). Optionally bump studio React 19.2.4 → 19.2.5 for full hoisting. Half-day of low-risk cleanup work.
2. **Phase 4 — Naming hygiene + dead code sweep.** Grep for remaining `kol-` residues (DnD MIME identifier `application/x-kol-library`, SVG fragment IDs `#kol-wheel-*` in `SpectrumControls.jsx`, 4 dead doc-path comments). Delete `apps/website/src/data/blog-data.js` + `collections-data.js` (Sanity-superseded; verify zero imports first). Retire `@components` alias by extracting JSX into `packages/ds/components/jsx/`. Retire `@website-data` alias once dead data files are deleted. Move 5 superseded styleguide docs into `docs/client/kol-client-acyr/99-archive/`. End-to-end ARCHITECTURE.md + AGENT-CONTEXT.md pass.
3. **Newsletter design rework (backlog 8j)** — unblocked by Phase 2. Original driver for the whole restructure. Author redesign against the stable `packages/ds/` cascade.
4. **Newsletter verification status check** — resolve the contradiction between "green" in *what works* and "gated on verification" in pending. Whatever the actual state is, pin it down and update both ends.
5. **Pre-existing padding/margin diagnosis** — if it ever blocks anything, A/B against the pre-fold-in repo and chase the regression source (likely candidates: Vite CSS resolver handling @import chains through the pnpm symlink, or a specific design-foundations.css rule that drifted).
