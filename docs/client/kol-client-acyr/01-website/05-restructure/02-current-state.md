---
title: Current state — repo inventory (2026-05-17 snapshot)
type: audit
status: active
related:
  - "[[01-website/05-restructure/INDEX|restructure-index]]"
  - "[[01-website/05-restructure/03-target-state|target-state]]"
  - "[[01-website/05-restructure/05-css-audit|css-audit]]"
companion_to: "[[01-website/05-restructure/03-target-state|target-state]]"
tags:
  - restructure
  - inventory
  - dependency-graph
created: 2026-05-17
---

# Current state — repo inventory

Snapshot of what exists today, taken 2026-05-17. Source: parallel read-only research agents. This document is frozen-in-time; do not update it as the migration progresses. [[01-website/05-restructure/03-target-state|target-state]] is the present-tense document; this one is the before picture.

## Three apps, one repo

| App | Folder | Vercel project | Root Directory | Vite? | Cross-imports? |
|---|---|---|---|---|---|
| Website (commerce + marketing) | repo root | `kol-client-acyr-website` | `.` | yes | none outbound |
| Sanity Studio (CMS) | `studio/` | `kol-client-acyr-studio` | `studio` | no (Sanity CLI) | **zero** in either direction |
| Styleguide (brand book + editor) | `styleguide/` | `kol-client-acyr-styleguide` | `styleguide` | yes | 111 import sites → root |

Each app has its own `package.json`, independent dependency tree, separate Vercel deployment. They share a git repo, three Vercel deployments, and a stitched-together import graph.

## File / line totals

| Path | Files | Lines | Notes |
|---|---:|---:|---|
| `src/` (website) | 505 | 174,725 | main React app |
| `api/` | 9 | 501 | Vercel serverless functions for website |
| `public/` | 566 | — | 344 MB total static assets |
| `scripts/` | 4 | 562 | sync-printful, migrate-sanity, test-meta, verify-versions |
| `studio/` (excl. node_modules) | 42 | 33,359 | Sanity Studio |
| `studio/schemaTypes/` | 5 | 419 | content schemas |
| `styleguide/` | 925 | 1,852,455 | includes mock images |
| `styleguide/src/` | 299 | 184,313 | source only |
| `styleguide/public/` | 0 | 0 | symlinks only |
| `docs/` | 60 | ~30k | onboarding + client + LLM context |

## Per-app `package.json` summary

### Root: `kol-ac`
- 14 dependencies, 8 devDependencies
- Scripts include cross-app orchestration: `studio:dev`, `studio:build`, `styleguide:dev`, `styleguide:build`, `dev-server` (parallel)
- Custom scripts: `sync-printful`, `migrate-sanity`, `verify-versions`
- Type: ESM module

### Studio: `another-creation`
- 4 dependencies (`@sanity/vision`, `react`, `react-dom`, `sanity`, `styled-components`)
- 5 devDependencies (Sanity-specific eslint, prettier, typescript)
- pnpm config: `onlyBuiltDependencies: ["esbuild"]` (required since pnpm v11 strictness)
- Prettier config inline: 100-char width, single quotes, no semicolons
- **Isolated**: no cross-app code dependencies

### Styleguide: `kol-acyr-styleguide`
- 9 dependencies, 8 devDependencies — **all dups of root** for the shared shell deps
- Scripts: standard Vite (`dev`, `build`, `lint`, `preview`)
- Type: ESM module

## Shared deps that drift if not policed

Tracked by `scripts/verify-versions.mjs`. CI fails if any of these mismatch between root and styleguide `package.json`:

1. `react`
2. `react-dom`
3. `react-router-dom`
4. `tailwindcss`
5. `@tailwindcss/vite`
6. `vite`
7. `@vitejs/plugin-react`
8. `vite-plugin-svgr`
9. `@floating-ui/react`
10. `embla-carousel-react`

Studio's `react`/`react-dom` are excluded — pinned to whatever the Sanity bundle expects (currently 19.2.4 vs the other two apps' 19.2.5).

This entire guard goes away under pnpm workspaces (deps hoist; one resolved version per dep).

## Cross-app boundary points — 120 total

The stitching that keeps the three apps coherent. Counted at file granularity.

### Code imports — 113 sites

| Source | Target | Mechanism | Sites |
|---|---|---|---|
| `styleguide/src/**/*.jsx,.js` | `src/brand/**` | Vite alias `@brand` → `../src/brand` | 20 files, dozens of import statements |
| `styleguide/src/**/*.jsx,.js` | `src/components/**` | Vite alias `@components` → `../src/components` | 34 files |
| `api/_lib/products.mjs` | `src/brand/data/printful-products.json` | `import data from '../../src/brand/data/...'` | 1 |
| `api/metadata-proxy.mjs` | `src/data/seo-metadata.js` | `import { lookupMeta } from '../src/data/...'` | 1 |
| `src/` → anywhere outside | — | — | **0** |
| `studio/` → anywhere outside | — | — | **0** |

Subtotal: **111** styleguide → root + **2** api → src = **113**.

### CSS @imports — 4 sites

`styleguide/src/index.css` reaches into root's CSS:
```css
@import "../../src/styles/kol-theme.css";
@import "../../src/brand/kol-brand-color.css";
@import "../../src/components/framework/kol-framework.css";
```
Plus the standard tailwindcss import (intra-package, doesn't count).

### Filesystem symlinks — 3 sites

| Symlink | Target | Purpose |
|---|---|---|
| `styleguide/public/brand` | `../../public/brand` | shared brand asset library (305 MB) |
| `styleguide/public/fonts` | `../../public/fonts` | shared font files (17 MB) |
| `styleguide/public/favicon.svg` | `../../public/favicon.svg` | shared favicon |
| `studio/static/favicon.svg` | `../../public/favicon.svg` | shared favicon (only studio symlink, intra-app target) |

Total cross-boundary: **3** (the three styleguide → root symlinks; the studio one targets root's `public/` which is the website's own asset folder).

## Vercel configs

### Root (`vercel.json`)
- Redirects: `/site` → `/` permanent, `/site/:path*` → `/:path*` permanent
- Rewrites: `/` and `/:path*` → `/api/metadata-proxy` (edge-injection metadata pipeline)

### Studio (`studio/vercel.json`)
- Rewrites: `/(.*)` → `/index.html` (SPA fallback)
- No redirects, no functions

### Styleguide (`styleguide/vercel.json`)
- Rewrites: `/(.*)` → `/index.html` (SPA fallback)
- No redirects, no functions
- **Implicit:** Vercel project settings include `Install Command: cd .. && pnpm install` (UI-set, not in vercel.json) — because styleguide's `node_modules` doesn't exist; deps install at repo root and styleguide imports use the parent install.

## Vite configs

### Root (`vite.config.js`, 9 lines)
- Plugins: `react`, `svgr`, `tailwindcss`
- No aliases, no server overrides

### Styleguide (`styleguide/vite.config.js`)
- Plugins: `react`, `svgr`, `tailwindcss`, custom `photoIndexPlugin` (indexes `public/brand/` and emits `/__photos.json`)
- Aliases: `@brand` → `../src/brand`, `@components` → `../src/components`
- Server: `port: 5174` (pinned to leave 5173 for root), `fs.allow: ['..']` (cross-repo import permission)

### Studio (`studio/sanity.config.js`)
- Not a Vite config; Sanity's own CLI build
- Plugins: `structureTool`, `visionTool`
- Project ID `ajbrqqhq`, dataset `production`

## CSS layering — 14 files, 5,391 lines

See [[01-website/05-restructure/05-css-audit|css-audit]] for line-level classification. Summary:

| Tier | Files | Lines | % |
|---|---:|---:|---:|
| DS-canon (true design system) | 11 (most of the 14, plus partial of framework.css) | ~1,950 | 36% |
| Brand (AC-specific rebind) | 2 | 203 | 4% |
| Site-chrome (consumer code, marketing-site-specific) | 2 (kol-site.css + ~700 lines mis-housed in kol-framework.css) | ~1,810 | 34% |
| Meta (cascade declarations, comments) | umbrella files | 47 | 1% |

Misnamed-or-misplaced lines: ~700 lines of design-foundations UI inside `kol-framework.css` are styleguide-app-specific (combo-lab, spectrum-grid, mood-tile, etc.), not DS-canon. They need to migrate into `apps/styleguide/src/styles/` in Phase 2.

Loading bug: `src/brand/kol-brand-typography.css` is loaded via JSX import in `src/components/site/SiteLayout.jsx`, bypassing the cascade declared in `src/index.css`. Documented as a known issue; fixed in Phase 1.

## Public assets

`public/` total: 344 MB, 566 files.
- `public/brand/` — 319 files, 305 MB (photography, mockups, mood, design assets)
- `public/fonts/` — 224 files, 17 MB (Right Grotesk family, JetBrains Mono)
- `public/og/` — 18 JPGs, 22 MB (Open Graph image sets)
- Misc: `favicon.svg`, `robots.txt`, `sitemap.xml`

`styleguide/public/`: zero own files. All three entries (`brand`, `fonts`, `favicon.svg`) are symlinks to root.

`studio/static/`: one own file (`.gitkeep`) + one symlink (`favicon.svg` → root).

## Env vars in `.env.local`

13 keys (values redacted):
- `PRINTFUL_TOKEN`
- `PAYPAL_ENV`, `PAYPAL_CLIENT_ID`, `PAYPAL_SECRET`, `VITE_PAYPAL_CLIENT_ID`
- `VITE_SANITY_PROJECT_ID`, `VITE_SANITY_DATASET`, `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_WRITE_TOKEN`
- `MAILERLITE_TOKEN`, `MAILERLITE_GROUP_ID`
- `VERCEL_AUTOMATION_BYPASS_SECRET`

All website-scoped (read by `src/`, `api/`, or scripts). Studio + styleguide read no env vars from this file. Under workspace, this stays at repo root (apps inherit via root `.env.local`, Vercel reads per-project from its env settings — already correctly configured per-project).

## Documentation — 57 files

See [[01-website/05-restructure/06-docs-fate|docs-fate]] for full catalog with restructure classifications. Summary:

| Classification | Count | Notes |
|---|---:|---|
| LOAD-BEARING | 17 | operational playbooks; survive verbatim |
| EVOLVE | 8 | name today's folder shape; need surgery post-migration |
| SUPERSEDE | 5 | the prior styleguide-fold-in research; now obsolete |
| ARCHIVE | 4 | already retired or about to be |
| UNTOUCHED | 23 | session logs + handoffs; append-only history |

## The workarounds that go away

A clean list of things in the current state that exist *only because* the workspace boundary isn't there:

1. `scripts/verify-versions.mjs` — manual CI guard against shared-dep drift. Workspace hoisting makes this unnecessary.
2. `styleguide/vite.config.js` aliases `@brand` and `@components` — Vite-level path resolution to fake what a package import would do natively.
3. `styleguide/public/{brand,fonts,favicon.svg}` filesystem symlinks — would be either a `packages/assets/` import or app-internal copies.
4. Styleguide Vercel project's `Install Command: cd .. && pnpm install` UI override — exists because `node_modules` only lives at root.
5. Root `package.json` scripts that `cd studio && pnpm dev` / `cd styleguide && pnpm dev` — replaced by `pnpm --filter studio dev` etc under workspaces.
6. The two-name discipline in ARCHITECTURE §1 (`kol-*` = DS tier, AC = brand) — collapsed into a single named system, AC DS.

## Frozen as of

This document captures the state on **2026-05-17**, after the newsletter MailerLite integration (commit on `newsletter` branch) and before any restructure work.
