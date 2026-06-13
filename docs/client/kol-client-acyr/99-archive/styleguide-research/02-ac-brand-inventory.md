---
title: AC Brand inventory + drift
date: 2026-05-16
status: archived
type: reference
---

# AC Brand inventory + drift

Comparison of `src/brand/` between `kol-client-ac` (SG = styleguide repo, harness with KOL DS + AC Brand) and `kol-acyr-website` (CWD = live site repo, extracted 2026-05-15 and evolved with Sanity/PayPal/Printful integrations). Both trees share the same provenance; this catalogues exactly where they have diverged.

## File-by-file comparison

| Path | SG | CWD | Status | Authoritative |
|---|---|---|---|---|
| `config.js` | yes (12 LOC) | yes (12 LOC) | identical (byte-for-byte) | either |
| `kol-brand-color.css` | yes (111 LOC) | yes (111 LOC) | identical (byte-for-byte) | either |
| `kol-brand-typography.css` | yes (90 LOC) | yes (90 LOC) | **diverged** — comment-only (line 5) | **CWD** (extraction stripped a stale `/site/*` path reference) |
| `logos/index.js` | yes | yes | identical | either |
| `logos/KolLogo.jsx` | yes (68 LOC) | yes (68 LOC) | identical | either |
| `logos/svg/lockup-hori.svg` | yes (17626 B) | yes (17626 B) | identical | either |
| `logos/svg/lockup-vert.svg` | yes (17529 B) | yes (17529 B) | identical | either |
| `logos/svg/logomark.svg` | yes (12554 B) | yes (12554 B) | identical | either |
| `logos/svg/wordmark.svg` | yes (5057 B) | yes (5057 B) | identical | either |
| `data/blog-data.js` | yes (159 LOC) | yes (159 LOC) | identical | either |
| `data/collections-data.js` | yes (202 LOC) | yes (202 LOC) | identical | either |
| `data/images.js` | yes (37 LOC) | yes (37 LOC) | identical | either |
| `data/info.js` | yes (41 LOC) | yes (41 LOC) | identical | either |
| `data/placeholder-logos.jsx` | yes (72 LOC) | yes (72 LOC) | identical | either |
| `data/shop-data.js` | yes (580 LOC) | yes (615 LOC) | **diverged** — CWD adds Printful sync (lines 191–225) | **CWD** (strict superset; SG is the pre-Printful baseline) |
| `data/branded-assets.js` | yes (204 LOC) | — | **SG-only** | SG |
| `data/business-data.js` | yes (259 LOC) | — | **SG-only** | SG |
| `data/printful-products.json` | — | yes (57 LOC) | **CWD-only** (generated artefact) | CWD |

## Diverged files — detailed diffs

### `kol-brand-typography.css`

Single-line divergence at line 5:

- SG (`kol-client-ac`): `` * `/site/*` route mounts and stays loaded for the rest of the session.``
- CWD (`kol-acyr-website`): `` * site route mounts and stays loaded for the rest of the session.``

CWD scrubbed the `/site/*` path slug from the comment during extraction (live site doesn't route under `/site/*`; SG harness does). Zero runtime impact. The fonts, `@font-face` blocks, tokens, helper classes are byte-identical. **Keep CWD's wording**; if a unified version lives in SG, sync the comment back.

### `data/shop-data.js`

SG version (580 LOC) is the pre-Printful catalog: hand-authored `PRODUCTS` array of POD + handmade items with `externalUrl` pointing at the live Squarespace pages.

CWD version (615 LOC) layers a Printful-sync block on top (lines 191–225):

```js
import printfulProducts from './printful-products.json' with { type: 'json' }
const PRINTFUL_OVERRIDES = { 'all-over-print-gym-bag': {...}, 'snapback-hat': {...} }
const fromPrintful = (p) => pod({ ...p, ...(PRINTFUL_OVERRIDES[p.slug] ?? {}) })
```

And prepends them into `PRODUCTS`:

```js
export const PRODUCTS = [
  ...printfulProducts.map(fromPrintful),  // CWD-only line 225
  /* ─── Metal print ─── */
  pod({ slug: 'metal-windbreaker', ... }),
  ...
]
```

Everything else (SIZES, SPEC, pod/hm helpers, the full hand-authored catalog, selectors, PRINTS, formatPrice, HANDMADE_FAQ) is identical.

**Keep CWD.** It's a strict superset — adds Printful integration without touching the existing data. Folding back into SG means lifting both `printful-products.json` and the import/override/spread block. Sync direction: CWD → SG.

## SG-only files (need to come over if SG dissolves into CWD)

### `data/branded-assets.js` (204 LOC)

Specs for printed/woven brand assets (stationery, hangtags, neck labels, dust bag, garment bag, gift box). Frame/trim/bleed dimensions in mm + `rows` arrays for table render. Maps to physical production data, not site content.

- Consumer: `kol-client-ac/src/pages/Reference.jsx` (line 13 import, line 364 `id="branded-assets"` section).
- Used by `AssetSpecTable` on the styleguide Reference page.
- No consumers in CWD today — pure styleguide / production-spec data. Only needed in CWD if the unified site exposes an internal asset-spec page.

### `data/business-data.js` (259 LOC)

ACYR registry data: `BIO`, `TIMELINE`, `COMPANIES`, `COLLABORATIONS`, `SOCIAL`, `VENDORS`, `STACK`, `LIVE_SITE_MAP`, `MARKETING_PLAYBOOK`, `OPEN_QUESTIONS`. Holds the long-form bio dossier, press citations, founding/award timeline, plus operational metadata (vendors, tech stack, marketing playbook).

- Consumer: `kol-client-ac/src/pages/Acyr.jsx` (line 14 import — multi-named).
- Drives the entire `/acyr` registry page in SG.
- No consumers in CWD today. Needed in CWD only if the registry page comes across.

## CWD-only files (stay where they are)

### `data/printful-products.json` (57 LOC, 1294 B)

Generated artefact from `pnpm sync-printful`. Current snapshot: 2 products (Snapback Hat, All-over print gym bag) with 3 sync variants total — Printful productId / syncVariantId / catalogVariantId / size / color / retailPrice / SKU.

- Consumer: `data/shop-data.js` line 195.
- Should never be hand-edited; the sync script owns it. Belongs in CWD because that's where the Printful integration lives.

## Brand tokens registered for Tailwind

Two registration sites — both repos are identical here:

**From `src/brand/kol-brand-color.css` `@theme` block (lines 91–111):**

```
--color-brand-primary        → --brand-primary       (= burgundy-200, #750E20)
--color-brand-on-primary     → --brand-on-primary    (= cream-100,    #FBF7EE)
--color-brand-secondary      → --brand-secondary     (= cream-300,    #F2E5CB)
--color-brand-on-secondary   → --brand-on-secondary  (= burgundy-300, #5A0816)
--color-brand-burgundy-{100..500}  → burgundy ramp direct access
--color-cream-{100..500}            → cream ramp direct access
```

Plus accent rebind at `:root` (lines 78–80) — when this CSS loads, the DS's `--kol-accent-*` switches from ink-on-surface to the burgundy brand identity.

**From `src/index.css` `@theme` block (lines 17–24):**

```
--color-brand-primary        → --brand-primary
--color-brand-primary-on     → --brand-primary-on        (drift alert: see Observations)
--color-brand-secondary      → --brand-secondary
--color-brand-secondary-on   → --brand-secondary-on      (drift alert: see Observations)
--color-brand-accent         → --kol-accent
--color-brand-accent-primary → --kol-accent-primary
```

## Sized summary

| Repo | Files | LOC (excl. SVG, JSON) |
|---|---|---|
| SG `src/brand/` | 14 (12 source + 4 SVG counted as 1 logos sub-dir) | ~2049 |
| CWD `src/brand/` | 12 (10 source + 4 SVG + 1 JSON) | ~1678 |
| Delta | SG has 2 extra files (`branded-assets.js`, `business-data.js`) | SG +463 LOC of styleguide-only data; CWD +35 LOC for Printful integration + 57 LOC JSON |

## Observations

- **CWD is more mature on the shop axis, SG is more mature on the registry axis.** The two repos forked at extraction time and each grew along its own axis: CWD added Printful integration + the JSON snapshot; SG kept the styleguide / `/acyr` registry data. No file is "older" in any meaningful sense — they're complementary, not competing.
- **Eleven of fourteen shared files are byte-identical.** Drift is localised to two files only: a one-line comment in `kol-brand-typography.css` and the Printful import block in `shop-data.js`. Everything else (logo SVGs, color CSS, blog/collections/info/images data, placeholder-logos, KolLogo, config) has zero drift. A fold-in is mostly a take-the-CWD-version pick + carry SG-only files across.
- **Two divergences need a human call, not an automated diff merge.** First, the `shop-data.js` Printful block prepends entries to `PRODUCTS`, which means SG's catalog ordering changes if the import is taken verbatim — fine if the unified site is OK with Printful-synced items appearing first, but worth confirming. Second, the typography comment fix is trivial but should be reconciled with SG so the comment doesn't bounce back next sync.
- **`src/index.css` `@theme` block has a token-naming drift vs. `kol-brand-color.css`.** The brand CSS exports `--color-brand-on-primary` / `--color-brand-on-secondary` (matching the `--brand-on-primary` / `--brand-on-secondary` primitives). The index.css `@theme` reaches for `--color-brand-primary-on` / `--color-brand-secondary-on` against `--brand-primary-on` / `--brand-secondary-on` — variables that don't exist in `kol-brand-color.css`. Either the brand CSS or `index.css` needs renaming to align; this isn't a SG-vs-CWD drift (both repos have the same bug), but it'll surface during consolidation cleanup.
- **SG-only data needs a consumer decision before move.** `branded-assets.js` (204 LOC) and `business-data.js` (259 LOC) are pure brand-identity data — they fit conceptually under `src/brand/data/`, but they have zero consumers in CWD today (their consumers are `Reference.jsx` and `Acyr.jsx`, both styleguide pages). If the unified site keeps those pages, lift the files as-is. If not, they live in SG as styleguide-only reference and the consolidation skips them.
