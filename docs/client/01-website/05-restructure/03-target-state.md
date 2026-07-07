---
title: Target state — apps + packages + AC DS
type: reference
status: draft
related:
  - "[[01-website/05-restructure/INDEX|restructure-index]]"
  - "[[01-website/05-restructure/01-decisions|decisions]]"
  - "[[01-website/05-restructure/02-current-state|current-state]]"
  - "[[01-website/05-restructure/04-phases|phases]]"
  - "[[01-website/05-restructure/05-css-audit|css-audit]]"
companion_to: "[[01-website/05-restructure/02-current-state|current-state]]"
tags:
  - restructure
  - target
  - ac-ds
  - workspace
created: 2026-05-17
---

# Target state — what the repo looks like after the move

This is the destination. Present tense. After all four phases complete, this is what the repo *is*.

## Top-level layout

```
kol-acyr-website/
├── apps/
│   ├── website/        # the website app (current root contents)
│   ├── studio/         # Sanity Studio (current studio/)
│   └── styleguide/     # brand book + editor (current styleguide/)
├── packages/
│   ├── ds/             # AC Design System (tokens, components, framework primitives)
│   └── brand-data/     # BRAND_INFO, SOCIAL, business-data — read at runtime by apps
├── assets/             # shared static assets (brand, fonts) — see Q1 below
├── docs/               # unchanged; restructured during migration
├── scripts/            # repo-wide scripts (migrate-sanity, etc); per-app scripts move into the app
├── .claude/            # unchanged
├── package.json        # workspace root; no app code
├── pnpm-workspace.yaml # declares apps/* and packages/* as members
└── pnpm-lock.yaml      # single lockfile for the whole workspace
```

## `apps/` — three independent deployment units

Each app is its own `package.json`, its own Vite (or Sanity CLI) config, its own Vercel project. They share dependencies through the workspace, not through file aliases.

### `apps/website/`

```
apps/website/
├── api/                # Vercel serverless functions (paypal, printful, newsletter, metadata-proxy)
│   └── _lib/
├── public/             # website-specific static files (og/, robots.txt, sitemap.xml)
├── src/
│   ├── components/     # website-specific compositions (Cart, Checkout, ProductDetail, etc)
│   ├── pages/          # React Router page components
│   ├── data/           # website-only data (seo-metadata.js)
│   ├── lib/            # website-only utilities (sanity.js, queries.js)
│   ├── hooks/          # website-only React hooks
│   ├── styles/         # website-specific CSS (site.css — the artist formerly known as kol-site.css)
│   └── main.jsx, App.jsx, index.css
├── vite.config.js
├── vercel.json
├── eslint.config.js
└── package.json        # depends on @ac/ds, @ac/brand-data
```

Vercel project: `kol-client-acyr-website` → Root Directory **`apps/website`**.

### `apps/studio/`

```
apps/studio/
├── schemaTypes/        # author.js, article.js, collection.js, look.js, index.js
├── static/             # favicon.svg (symlinked from /assets, or copied — see Q1)
├── sanity.config.js
├── sanity.cli.js
├── vercel.json
└── package.json        # no workspace package deps; isolated Sanity runtime
```

Vercel project: `kol-client-acyr-studio` → Root Directory **`apps/studio`**.

**Studio doesn't import from `packages/`.** Verified zero cross-imports today, stays that way.

### `apps/styleguide/`

```
apps/styleguide/
├── public/             # symlinks to /assets (brand, fonts, favicon.svg) — see Q1
├── src/
│   ├── components/     # styleguide-specific compositions (LogoCard, AssetTable, SlideDeck, etc)
│   ├── editor/         # the interactive style editor
│   ├── pages/          # Acyr.jsx, Landing.jsx, Reference.jsx, Styleguide.jsx
│   ├── data/           # styleguide-only data
│   ├── styles/         # styleguide-specific CSS (the ~700 lines of design-foundations UI moved here from kol-framework.css)
│   └── main.jsx, App.jsx, index.css
├── vite-plugins/
│   └── photoIndexPlugin.js
├── vite.config.js      # no alias hacks; imports @ac/ds and @ac/brand-data normally
├── vercel.json
└── package.json        # depends on @ac/ds, @ac/brand-data
```

Vercel project: `kol-client-acyr-styleguide` → Root Directory **`apps/styleguide`**.

The `@brand` and `@components` aliases go away — styleguide imports `import { BRAND } from '@ac/brand-data'` and `import Button from '@ac/ds/atoms/Button'` like any normal npm consumer.

## `packages/` — shared code

Two packages. Both private workspace packages (`"private": true`, not published). Both consumed by `apps/website` and `apps/styleguide`. Neither is consumed by `apps/studio`.

### `packages/ds/` — AC Design System

```
packages/ds/
├── tokens/
│   ├── color.css           # was kol-color.css (DS-canon surface tiers)
│   ├── opacity.css         # was kol-opacity.css (fg scale + text roles)
│   ├── typography.css      # was kol-typography.css (Right Grotesk family + scales)
│   ├── typography-mono.css # was kol-typography-mono.css (JetBrains Mono + helper scales)
│   ├── theme.css           # was kol-theme.css (spacing, radius, shadow, z-index, transition)
│   ├── brand-color.css     # was kol-brand-color.css — AC color palette + @theme block
│   └── brand-typography.css# was kol-brand-typography.css — fixed loading via index.css cascade, not JSX side-door
├── utilities/
│   └── utilities.css       # was kol-utilities.css (flex-center, sr-only, text-balance, etc)
├── components/
│   ├── atoms.css           # was kol-components-atoms.css (.ac-control + variants)
│   ├── molecules.css       # was kol-components-molecules.css (.ac-popover, .ac-pill, etc)
│   ├── organisms.css       # was kol-components-organisms.css (.ac-table)
│   └── jsx/                # React components if/when extracted
│       ├── atoms/
│       ├── molecules/
│       ├── organisms/
│       └── framework/      # SideNav, PageSection, BrandLayout, etc
├── framework/
│   └── framework.css       # was kol-framework.css MINUS the ~700 lines of styleguide-app design-docs UI
├── index.css               # canonical cascade entry — imports tokens → brand → utilities → components → framework
└── package.json            # name: "@ac/ds"
```

Single named system. No two-tier (DS-neutral + brand-rebind) cascade fiction. The brand color and typography ARE the system's color and typography — they live in the same package, not in a separate "brand layer." The cascade is preserved (tokens before brand-color before framework) but expressed in `packages/ds/index.css`, which consumer apps import as `import '@ac/ds/index.css'` from their own entry.

Class prefix migrates from `kol-*` to `ac-*`. Where the prefix added no information (e.g. `kol-site-*` which was always site-chrome), the prefix drops entirely.

**Not in `packages/ds/`:**
- `kol-site.css` content — that's website consumer code, lives in `apps/website/src/styles/site.css`.
- The ~700 lines of combo-lab / spectrum-grid / mood-tile / asset-card CSS currently in `kol-framework.css` — that's styleguide-app design-docs UI, lives in `apps/styleguide/src/styles/`.

See [[01-website/05-restructure/05-css-audit|css-audit]] for the full line-level migration map.

### `packages/brand-data/` — brand identity data

```
packages/brand-data/
├── config.js              # BRAND.name, BRAND.nameSlug (the single-source brand display name)
├── info.js                # BRAND_INFO (contact, studio, legal)
├── business-data.js       # bio, education, shows, awards, press, SOCIAL, vendors
├── images.js              # ACImages — image manifest
├── branded-assets.js      # stationery / labels / packaging specs
├── placeholder-logos.jsx  # used by Marquee on home
└── package.json           # name: "@ac/brand-data"
```

Read at runtime by both apps. Updated when the brand identity changes; not part of the design system per se.

**Not in `packages/brand-data/`:**
- `blog-data.js`, `collections-data.js` — these were used pre-Sanity; now superseded. Slated for removal in Phase 4 cleanup.
- `printful-products.json`, `shop-data.js` — website-only (commerce data). Live in `apps/website/src/data/`.
- `seo-metadata.js` — website-only (route → meta tags). Lives in `apps/website/src/data/`.

## `assets/` — the symlink/dedup question

Currently:
- `public/brand/` (305 MB) and `public/fonts/` (17 MB) live in the root `public/` (website's public folder).
- `styleguide/public/brand`, `styleguide/public/fonts`, `styleguide/public/favicon.svg` are symlinks to root.
- `studio/static/favicon.svg` is a symlink to root's `public/favicon.svg`.

Target — **Option C (decided)**: extract shared assets to top-level `assets/`, symlink from each app's public folder.

```
assets/
├── brand/      # 305 MB of photography, mockups, mood, design assets
├── fonts/      # 17 MB of typography
└── favicon.svg # shared site favicon
```

```
apps/website/public/brand    → ../../../assets/brand
apps/website/public/fonts    → ../../../assets/fonts
apps/website/public/favicon.svg → ../../../assets/favicon.svg
apps/styleguide/public/brand → ../../../assets/brand
apps/styleguide/public/fonts → ../../../assets/fonts
apps/studio/static/favicon.svg → ../../../assets/favicon.svg
```

Each app's own `public/` retains app-specific static files (e.g. `apps/website/public/og/`, `apps/website/public/robots.txt`, `apps/website/public/sitemap.xml` stay in the website only).

Why not `packages/assets/`? Because they're not code, and a package implies install-time resolution. Symlinks at the filesystem layer match what we already do, work on both macOS dev and Vercel Linux, and don't pretend the brand library is an npm package.

Why not keep in `apps/website/public/`? Because the styleguide app needs them too; today's symlink-into-sibling pattern would just become symlink-into-sibling-app, which is the same coupling expressed differently. Extracting to `assets/` makes the shared-ness explicit at the folder layout.

## `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/*"

# Studio's React version diverges from website + styleguide. Keep its
# install scope isolated so we don't try to force-hoist a single version.
onlyBuiltDependencies:
  - esbuild
  - "@parcel/watcher"  # if needed by Sanity
```

`pnpm install` at repo root resolves the whole workspace. Apps and packages share `node_modules` at root.

## Root `package.json`

```json
{
  "name": "kol-acyr-website",
  "private": true,
  "type": "module",
  "scripts": {
    "dev:website": "pnpm --filter website dev",
    "dev:studio": "pnpm --filter studio dev",
    "dev:styleguide": "pnpm --filter styleguide dev",
    "build:website": "pnpm --filter website build",
    "build:studio": "pnpm --filter studio build",
    "build:styleguide": "pnpm --filter styleguide build",
    "lint": "pnpm --recursive lint",
    "sync-printful": "pnpm --filter website sync-printful",
    "migrate-sanity": "node scripts/migrate-sanity.mjs"
  }
}
```

No `dependencies` or `devDependencies` at the workspace root — deps live in their owning packages.

The `verify-versions.mjs` script is **gone**. Workspace install topology guarantees a single resolved version per dep.

## Vercel project changes

| Project | Current Root Directory | New Root Directory | Install Command override? |
|---|---|---|---|
| `kol-client-acyr-website` | `.` | `apps/website` | none |
| `kol-client-acyr-studio` | `studio` | `apps/studio` | none |
| `kol-client-acyr-styleguide` | `styleguide` | `apps/styleguide` | none — drop the `cd .. && pnpm install` hack |

Vercel auto-detects pnpm workspaces if the lockfile is at repo root, which it will be.

## Cross-app boundary count — target

| Source | Target | Mechanism | Sites |
|---|---|---|---|
| `apps/styleguide` | `packages/ds`, `packages/brand-data` | npm package import (workspace-resolved) | 111 (was 111 via alias; now real imports) |
| `apps/website/src/` | `packages/ds`, `packages/brand-data` | npm package import | 0 today; expected to grow as website starts using DS components |
| `apps/website/api/` | `apps/website/src/data`, `apps/website/src/brand/data` (or `packages/brand-data`) | relative import within app, or package import if data moved out | 2 |
| symlinks `apps/*/public/` → `assets/` | filesystem symlink | 6 (3 per consumer app) | |

The cross-boundary count is similar in volume but qualitatively different: every code-level boundary is now an npm package import resolved through the workspace, not a Vite alias or filesystem symlink workaround.

## ARCHITECTURE.md after restructure

The §1 two-name discipline gets rewritten. The §4 CSS cascade order is preserved but the file paths update. Section by section:

- **§1 (renamed): "AC Design System namespace"** — single named system. Class prefix `ac-*`. Brand identity (`BRAND.name`, hue ramps, fonts) lives inside the DS package, not in a separate brand-rebind tier.
- **§2** — unchanged. Iceland merchant / Stripe-blocked / PayPal-direct.
- **§3** — unchanged in spirit; paths update (`api/` becomes `apps/website/api/`).
- **§4 (revised): "AC DS cascade order"** — same order, expressed in `packages/ds/index.css`, imported by both `apps/website` and `apps/styleguide`. Tokens → brand-color → utilities → components → framework. Per-app site/styleguide chrome layers on top inside the app.
- **§5** — unchanged. Catalog data structure stays at `apps/website/src/data/`.
- **§6** — unchanged. Cart + checkout flow.
- **§7 (revised): "Non-goals — additions"** — adds "TypeScript still off" (unchanged), "Stripe still off" (unchanged), and a new "no upstream KOL package extraction unless a second client engagement appears" line that closes the §1 escape hatch we just used.

## Contracts that survive verbatim

These are load-bearing today; they remain load-bearing in the target.

- **`BRAND.name` is the only place "Another Creation" appears as a string.** Now lives in `packages/brand-data/config.js`.
- **`kind: 'pod' | 'handmade'` discriminator** drives routing, cart eligibility, selectors. Unchanged.
- **EUR everywhere.** Unchanged.
- **Server-side price validation** in `apps/website/api/paypal/create-order.mjs`. Recompute total from `printful-products.json` server-side; reject client-posted totals. Non-negotiable.
- **PayPal capture ID → Printful `external_id`** for fulfillment idempotency. Unchanged.
- **Sanity project ID `ajbrqqhq` + dataset `production`** in four locations. Unchanged location-wise; the four locations move under the workspace but the contract stays.
- **AC DS cascade order in `packages/ds/index.css`.** New canonical location, same order rule.
- **Studio is a sibling npm project, not a workspace member by code-sharing** — it's a workspace member by topology but consumes nothing from `packages/`. Treat it as topologically present but conceptually isolated.

## Open questions resolved here

- **Q1 (assets):** decided. Extract to top-level `assets/`, symlinks from each consumer app's `public/`. Not a package.
- **Q2 (DS split):** decided. Single `packages/ds/` for now. Subdividing into `ds-tokens` + `ds-components` is premature until there's a reason. Easy to split later if one consumer needs only tokens.
- **Q3 (kol-framework site-chrome):** decided. The ~700 lines of design-foundations UI (combo-lab, spectrum-grid, mood-tile, asset-card, type-sample) migrate to `apps/styleguide/src/styles/`. The remaining ~500 lines of true framework primitives stay in `packages/ds/framework/framework.css`. See [[01-website/05-restructure/05-css-audit|css-audit]] for the line-range map.
