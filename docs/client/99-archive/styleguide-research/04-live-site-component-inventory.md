---
title: Live site component inventory (CWD)
date: 2026-05-16
status: archived
type: reference
# related: entries dropped — referenced files (01-styleguide-extraction-plan, 02-sanity-cms-integration, 03-paypal-printful-integration) don't exist in this vault
tags:
  - inventory
  - architecture
  - kol-acyr-website
  - styleguide/research
---

# Live site component inventory

What the live site at `another-creation.xyz` actually compiles and ships today.
Snapshot taken 2026-05-16, post-extraction (May 15) and post-Sanity/PayPal/Printful additions.

Cross-references kol-client-ac at `/Users/kolkrabbi/dev/projects/kol-client-ac` for what's shared, diverged, or unique-to-here.

## Component tree

| Subdir                                | Files | Role                                     | Notes                                                                       |
| ------------------------------------- | ----: | ---------------------------------------- | --------------------------------------------------------------------------- |
| `src/components/atoms/`               |     5 | KOL DS — shared primitives               | Pruned subset of kol-client-ac (12 files there)                             |
| `src/components/molecules/`           |     6 | KOL DS — shared primitives               | Pruned subset of kol-client-ac (17 files there)                             |
| `src/components/primitives/`          |     2 | KOL DS — shared primitives               | Pruned subset of kol-client-ac (7 files there)                              |
| `src/components/framework/`           |     4 | KOL DS — page chrome + theme             | Pruned subset of kol-client-ac (11 files there)                             |
| `src/components/hooks/`               |     1 | KOL DS — shared utility                  | Only `usePageTitle.js` (used by every page)                                 |
| `src/components/loaders/icons/`       |     2 | KOL DS — Icon component + registry       | 367 SVG files in `svg/` (identical to kol-client-ac)                        |
| `src/components/loaders/images/`      |     2 | KOL DS — Image component + registry      | 16 image files in `img/` (identical to kol-client-ac)                       |
| `src/components/site/`                |    20 | Site-specific — marketing/commerce       | Identical roster to kol-client-ac's `site/` minus 3 styleguide-only entries |
| `src/pages/site/`                     |    18 | Site-specific — routed pages             | Now uses Sanity for Blog/Collections; +Cart/Checkout/OrderConfirmation      |
| `src/pages/`                          |     1 | Shared chrome page                       | Only `NotFound.jsx`                                                         |
| `src/lib/`                            |     2 | Site-specific — Sanity client + queries  | New post-extraction                                                         |
| `api/`                                |     7 | Site-specific — serverless functions     | New post-extraction (PayPal + Printful)                                     |
| `src/brand/`                          |    11 | KOL brand layer (logos, data, CSS, info) | `printful-products.json` added; `branded-assets.js` + `business-data.js` dropped |
| `src/styles/`                         |    10 | KOL DS CSS layer                         | Byte-identical to kol-client-ac                                             |
| `studio/`                             |     5 schemas | Sanity Studio (sibling sub-project)| Separate package, separate vercel.json deploy                               |
| `scripts/`                            |     2 | Site-specific — data sync utilities      | `sync-printful.mjs`, `migrate-to-sanity.mjs`                                |

Totals (source only, excludes `node_modules`, `dist`, `.git`, `studio/`):
- 85 source files under `src/components/` (excluding SVG/img assets).
- 367 SVG icons + 16 raster mocks under `loaders/`.
- 108 `.jsx`/`.js`/`.mjs`/`.css`/`.json` files repo-wide (excludes lock files).

## Per-component table

JSX/JS components in the website (excludes asset registries and CSS).

| File                                                    | LOC | Role            | KOL DS vs site | Origin                                                       |
| ------------------------------------------------------- | --: | --------------- | -------------- | ------------------------------------------------------------ |
| `src/components/atoms/Avatar.jsx`                       |  19 | atom            | KOL DS         | pre-extraction, **diverged** (added `src` image support)     |
| `src/components/atoms/Button.jsx`                       | 159 | atom            | KOL DS         | pre-extraction, identical                                    |
| `src/components/atoms/Divider.jsx`                      |  34 | atom            | KOL DS         | pre-extraction, identical                                    |
| `src/components/atoms/Input.jsx`                        | 108 | atom            | KOL DS         | pre-extraction, identical                                    |
| `src/components/atoms/Textarea.jsx`                     |  70 | atom            | KOL DS         | pre-extraction, identical                                    |
| `src/components/molecules/Badge.jsx`                    |  45 | molecule        | KOL DS         | pre-extraction, identical                                    |
| `src/components/molecules/ContentFilters.jsx`           | 262 | molecule        | KOL DS         | pre-extraction, **diverged** (dropped `ViewToggle` import)   |
| `src/components/molecules/Dropdown.jsx`                 | 223 | molecule        | KOL DS         | pre-extraction, identical                                    |
| `src/components/molecules/MenuItem.jsx`                 | 148 | molecule        | KOL DS         | pre-extraction, identical (transitive via Dropdown)          |
| `src/components/molecules/Popover.jsx`                  | 208 | molecule        | KOL DS         | pre-extraction, identical (transitive via Dropdown/MenuItem) |
| `src/components/molecules/Tag.jsx`                      |  19 | molecule        | KOL DS         | pre-extraction, identical — **orphan** (no consumers)        |
| `src/components/primitives/AssetPlaceholder.jsx`        |  28 | primitive       | KOL DS         | pre-extraction, identical (transitive via Image loader)      |
| `src/components/primitives/Carousel.jsx`                |  50 | primitive       | KOL DS         | pre-extraction, identical (consumed by `pages/site/About`)   |
| `src/components/framework/Layout.jsx`                   |  13 | framework       | KOL DS         | pre-extraction, **diverged** (dropped ExitPreview + `/site/*` regex) |
| `src/components/framework/ScrollToTop.jsx`              |  17 | framework       | KOL DS         | pre-extraction, identical                                    |
| `src/components/framework/ThemeToggle.jsx`              |  95 | framework       | KOL DS         | pre-extraction, identical                                    |
| `src/components/framework/kol-framework.css`            | 1211| framework CSS   | KOL DS         | pre-extraction, identical                                    |
| `src/components/hooks/usePageTitle.js`                  |   ~ | hook            | KOL DS         | pre-extraction, identical                                    |
| `src/components/loaders/icons/Icon.jsx`                 |   ~ | loader          | KOL DS         | pre-extraction, identical                                    |
| `src/components/loaders/icons/index.js`                 |   ~ | loader registry | KOL DS         | pre-extraction, identical                                    |
| `src/components/loaders/images/Image.jsx`               |   ~ | loader          | KOL DS         | pre-extraction, identical                                    |
| `src/components/loaders/images/index.js`                |   ~ | loader registry | KOL DS         | pre-extraction, identical                                    |
| `src/components/site/BlogBody.jsx`                      |  41 | site organism   | site-specific  | pre-extraction, **diverged** (now PortableText, was block JSON) |
| `src/components/site/ButtonNav.jsx`                     |  32 | site molecule   | site-specific  | pre-extraction, identical                                    |
| `src/components/site/CartContext.jsx`                   |  97 | site state      | site-specific  | pre-extraction, identical (localStorage `kol.ac.cart.v1`)    |
| `src/components/site/Collection.jsx`                    |  50 | site organism   | site-specific  | pre-extraction, identical                                    |
| `src/components/site/DesignerVision.jsx`                |  81 | site organism   | site-specific  | pre-extraction, identical                                    |
| `src/components/site/FAQ.jsx`                           |  28 | site organism   | site-specific  | pre-extraction, identical                                    |
| `src/components/site/FeatureSplit.jsx`                  |  40 | site organism   | site-specific  | pre-extraction, identical                                    |
| `src/components/site/Footer.jsx`                        | 100 | site chrome     | site-specific  | pre-extraction, **diverged** (route prefix `/site/x` → `/x`) |
| `src/components/site/HandmadeCard.jsx`                  |  56 | site molecule   | site-specific  | pre-extraction, identical                                    |
| `src/components/site/LookbookCarousel.jsx`              |  92 | site organism   | site-specific  | pre-extraction, identical                                    |
| `src/components/site/Marquee.jsx`                       |  32 | site organism   | site-specific  | pre-extraction, identical                                    |
| `src/components/site/Nav.jsx`                           | 157 | site chrome     | site-specific  | pre-extraction, identical                                    |
| `src/components/site/Newsletter.jsx`                    |  80 | site organism   | site-specific  | pre-extraction, identical                                    |
| `src/components/site/ProductCard.jsx`                   |  84 | site molecule   | site-specific  | pre-extraction, identical                                    |
| `src/components/site/SigTicker.jsx`                     |  25 | site molecule   | site-specific  | pre-extraction, identical                                    |
| `src/components/site/SiteLayout.jsx`                    |  96 | site chrome     | site-specific  | pre-extraction, **diverged** (dropped NAV_RIGHT styleguide links + routes) |
| `src/components/site/SupportCTA.jsx`                    |  62 | site organism   | site-specific  | pre-extraction, identical                                    |
| `src/components/site/Testimonial.jsx`                   |  17 | site organism   | site-specific  | pre-extraction, identical                                    |

Subtotal LOC for `src/components/`: ~4,200 lines JSX/JS + ~3,800 lines CSS (styles + framework + brand).

## Site-specific surfaces

### `src/pages/site/` (18 routed pages)

| File                                  | LOC | Sanity? | Cart? | PayPal? | Notes                                          |
| ------------------------------------- | --: | :-----: | :---: | :-----: | ---------------------------------------------- |
| `About.jsx`                           | 116 |         |       |         | Uses `Carousel` primitive                      |
| `Blog.jsx`                            |  87 | yes     |       |         | `sortedArticles`, `urlFor`                     |
| `BlogArticle.jsx`                     | 116 | yes     |       |         | `findArticle`, PortableText via `BlogBody`     |
| `BlogAuthor.jsx`                      | 121 | yes     |       |         | `findAuthor` + `articlesByAuthor`              |
| `Cart.jsx`                            | 120 |         | yes   |         | `useCart`                                      |
| `Checkout.jsx`                        | 352 |         | yes   | yes     | `usePayPalScriptReducer`, calls `/api/paypal/*`|
| `Collections.jsx`                     |  84 | yes     |       |         | `sortedCollections`                            |
| `CollectionDetail.jsx`                | 277 | yes     |       |         | `findCollection`, `adjacentCollections`        |
| `Contact.jsx`                         | 110 |         |       |         | Static form                                    |
| `Handmade.jsx`                        | 139 |         |       |         | Static — sources from `brand/data/shop-data`   |
| `Home.jsx`                            |  64 |         |       |         | Composes most `components/site/*`              |
| `OrderConfirmation.jsx`               | 132 |         | yes   |         | Reads order from session                       |
| `Privacy.jsx`                         |  57 |         |       |         | Static                                         |
| `ProductDetail.jsx`                   | 184 |         | yes   |         | `addItem` from cart                            |
| `ShippingReturns.jsx`                 |  64 |         |       |         | Static                                         |
| `Shop.jsx`                            |  74 |         |       |         | Uses `ContentFilters` molecule                 |
| `Terms.jsx`                           |  59 |         |       |         | Static                                         |

Subtotal: 2,256 LOC.

### `src/components/site/` (20 components)

Already enumerated in per-component table above. Total: ~1,217 LOC.

### `src/lib/`

| File         | LOC | Purpose                                                                       |
| ------------ | --: | ----------------------------------------------------------------------------- |
| `sanity.js`  |  14 | Single client + `urlFor` builder                                              |
| `queries.js` | 153 | All GROQ projections + helpers (`sortedArticles`, `findCollection`, dates)    |

### `api/` (Vercel serverless, 7 files)

| File                                | LOC | Role                                                          |
| ----------------------------------- | --: | ------------------------------------------------------------- |
| `api/_lib/paypal.mjs`               |  54 | OAuth + signed fetch wrapper                                  |
| `api/_lib/printful.mjs`             |  28 | Auth-header fetch wrapper                                     |
| `api/_lib/products.mjs`             |  59 | `validateAndPrice`, `lookupVariant` over `printful-products.json` |
| `api/_lib/shipping.mjs`             |  58 | `getShippingRate` Printful proxy                              |
| `api/paypal/create-order.mjs`       |  57 | Server-validated PayPal order create                          |
| `api/paypal/capture-order.mjs`      | 100 | Capture + push fulfillment to Printful                        |
| `api/printful/shipping-rates.mjs`   |  30 | Pre-checkout shipping quotes                                  |

Subtotal: 386 LOC. All depend on `src/brand/data/printful-products.json` (the static product catalogue committed via `pnpm sync-printful`).

## CSS / Tailwind layer

The full KOL DS CSS layer is present **byte-identical** to kol-client-ac. Specifically:

- `src/index.css` — identical (29 LOC, same import order: tailwindcss → kol-theme → kol-brand-color → kol-framework → kol-site, with `@theme` token-registration block + scrollbar-gutter `:root`)
- `src/styles/kol-theme.css` — identical (105 LOC entry point chaining 9 sub-files)
- `src/styles/kol-color.css` (311), `kol-opacity.css` (369), `kol-typography.css` (617), `kol-typography-mono.css` (177), `kol-utilities.css` (92), `kol-components-atoms.css` (709), `kol-components-molecules.css` (255), `kol-components-organisms.css` (220), `kol-site.css` (1020) — all identical
- `src/components/framework/kol-framework.css` (1211) — identical
- `src/brand/kol-brand-color.css` (111) — identical
- `src/brand/kol-brand-typography.css` (90) — **1-line diff** (comment-only: `/site/*` route mounts → site route mounts)

Nothing has been pruned. The styleguide-only chrome (e.g. `kol-site-nav-right`, `SideNav` rules) is still loaded here even though no styleguide page consumes it. CSS layer is overpopulated relative to the JSX surface — at consolidation, prune or accept the dead-CSS cost.

Total CSS: ~5,316 lines (10 in `styles/` + 1,211 in `framework/` + 2 brand files + `index.css`).

## Component overlap with kol-client-ac

Source: `diff -rq /Users/kolkrabbi/dev/projects/kol-client-ac/src/components /Users/kolkrabbi/dev/projects/kol-acyr-website/src/components`.

### Diverged shared files (6 — the merge will need a decision on each)

| File                                    | Direction of divergence                                                                                             | Likely resolution                                       |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `atoms/Avatar.jsx`                      | **Website version is a strict superset** — adds optional `src`/`alt` image rendering, kol-client-ac is initial-only | Adopt website version everywhere                        |
| `framework/Layout.jsx`                  | Website **drops** ExitPreview + `/site/*` route gate; kol-client-ac still gates client-preview surfaces             | kol-client-ac version is correct for a multi-surface repo; website's simplification only works because it has 1 surface |
| `molecules/ContentFilters.jsx`          | Website **drops** `ViewToggle` import (since `ViewToggle.jsx` itself was dropped); functionally a removal           | Re-add `ViewToggle` if reintroducing styleguide; otherwise keep website's simpler import |
| `site/BlogBody.jsx`                     | **Total rewrite** — website is PortableText renderer for Sanity blocks; kol-client-ac is custom block JSON walker   | Adopt website version (PortableText is the new contract); kol-client-ac path is dead once Sanity moves in |
| `site/Footer.jsx`                       | Route-prefix only: `/site/x` → `/x` (4 link entries)                                                                | Adopt website version                                   |
| `site/SiteLayout.jsx`                   | Same route-prefix change + drops `NAV_RIGHT` (Styleguide + Gallery links)                                           | Keep route-prefix change; restore NAV_RIGHT only if styleguide rejoins the same React tree |
| `brand/kol-brand-typography.css`        | 1-line comment-only diff                                                                                            | Trivial — adopt either                                  |

### Files only in kol-client-ac (will need to come back if styleguide folds in)

**Atoms (7):** `ColorSwatch`, `Label`, `Slider`, `Stepper`, `ToggleCheckbox`, `ToggleSwitch`, `TransparentX`
**Molecules (11):** `DropdownTagFilter`, `LabeledControl`, `Modal`, `Pill`, `PropertyInput`, `QuantityInput`, `QuantityStepper`, `SectionLabel`, `SegmentedToggle`, `ToggleBracket`, `ViewToggle`
**Primitives (5):** `Accordion`, `CodeBlock`, `ExitPreview`, `FullscreenOverlay`, `Image` (duplicate of loader Image — already a known overlap)
**Framework (6):** `BrandHero`, `BrandLayout`, `PageSection`, `PortalFooter`, `SideNav`, `SubPageHero` + `sidebars.config.js`
**Hooks (2):** `useReveal`, `useScrollSpy`
**Loaders (4 dirs):** `decks/` (4 files), `graphics/` (Graphic + 9 SVG subdirs), `logos/` (Logomark.jsx), `marks/` (BrandLogo.jsx)
**Organisms (1):** `Table.jsx`
**Sections (1):** `ColorRamp.jsx`
**Site (4):** `Checkbox`, `Swatch`, `UnitSelector`, plus `site/FeatureSplit` (yes — there's a kol-client-ac styleguide `FeatureSplit.jsx` distinct from `site/FeatureSplit.jsx`)
**Styleguide (20):** `AssetCard`, `AssetCarousel`, `AssetFigure`, `AssetGrid`, `AssetTable`, `ClearspaceDiagram`, `FeatureSplit`, `FullscreenGallery`, `LogoCard`, `LogoCarousel`, `LogoScaling`, `MoodTile`, `PortalIndex`, `ProsePreview`, `Ramp`, `SigTicker`, `SocialMocks`, `SpectrumGrid`, `StationeryMocks`, `Swatch`, `TypeSample`, `TypeScaleSection`, `TypeSpecCard`

### Files only in CWD (post-extraction net additions)

**lib/ (2):** `sanity.js`, `queries.js`
**api/ (7):** see above
**brand/data:** `printful-products.json`
**scripts/ (2):** `sync-printful.mjs`, `migrate-to-sanity.mjs`
**studio/ (1 package):** Sanity Studio sub-project (5 schemas: `article`, `author`, `collection`, `look`, `index`)
**pages/site/ (3 new ones since kol-client-ac last snapshot):** none net-new — both repos have the same 18 routed pages. The Cart/Checkout/OrderConfirmation set predates extraction.

Counts: 1 net-new directory (`src/lib/`), 1 net-new top-level dir (`api/`), 1 net-new sub-project (`studio/`), 1 net-new data file (`printful-products.json`), 2 new scripts.

## What's grown post-extraction

Comparing the website's tree to kol-client-ac's snapshot (kol-client-ac retains the styleguide surface; both share the same site code base by design until consolidation):

1. **Sanity wiring layer** — `src/lib/sanity.js` + `src/lib/queries.js` + Studio sub-project. Consumed by `Blog`, `BlogArticle`, `BlogAuthor`, `Collections`, `CollectionDetail` (5 of 18 pages).
2. **PayPal + Printful serverless** — `api/_lib/*` + 3 endpoints. Consumed by `Checkout.jsx` (client-side) plus the `sync-printful` script.
3. **Site-side enhancements** —
   - `Avatar.jsx` gained `src`/`alt` image variant (for Sanity author avatars).
   - `BlogBody.jsx` rewrote to render PortableText blocks.
   - Route prefix collapse `/site/*` → `/*` in Footer + SiteLayout (because there's no longer a styleguide surface to disambiguate from).
4. **Printful catalog data** — `src/brand/data/printful-products.json` (committed; regenerated via `pnpm sync-printful`).
5. **Pruning** — `branded-assets.js` and `business-data.js` (kol-client-ac brand/data) not carried over.

Net new LOC since extraction: ~553 (sanity 167 + api 386). Plus the studio package (~5 short schema files, total <300 LOC of schema declarations).

## Package.json delta

| Dependency                       | kol-client-ac    | kol-acyr-website   | Status                          |
| -------------------------------- | ---------------- | ------------------ | ------------------------------- |
| `@floating-ui/react`             | ^0.27.19         | ^0.27.19           | shared (Popover/Dropdown)       |
| `@paypal/react-paypal-js`        | —                | ^9.2.0             | **added post-extraction**       |
| `@portabletext/react`            | —                | ^6.2.0             | **added post-extraction**       |
| `@sanity/client`                 | —                | ^7.22.0            | **added post-extraction**       |
| `@sanity/image-url`              | —                | ^2.1.1             | **added post-extraction**       |
| `@tailwindcss/vite`              | ^4.2.4           | ^4.2.4             | shared                          |
| `colord`                         | ^2.9.3           | ^2.9.3             | shared (used by styleguide swatch tooling — orphan here) |
| `embla-carousel-react`           | ^8.6.0           | ^8.6.0             | shared (LookbookCarousel)       |
| `gsap`                           | ^3.15.0          | ^3.15.0            | shared (Marquee, SigTicker)     |
| `opentype.js`                    | ^1.3.5           | ^1.3.5             | shared (kol-client typography tooling — orphan here) |
| `react` / `react-dom`            | ^19.2.5          | ^19.2.5            | shared                          |
| `react-router-dom`               | ^7.14.2          | ^7.14.2            | shared                          |
| `tailwindcss`                    | ^4.2.4           | ^4.2.4             | shared                          |
| `wawoff2`                        | ^2.0.1           | ^2.0.1             | shared (font conversion — orphan here) |

Scripts added in website: `sync-printful`, `studio:dev`, `studio:build`, `migrate-sanity`.

**Orphan deps inherited from extraction:** `colord`, `opentype.js`, `wawoff2` — all kol-client-ac styleguide font/color tooling. Eligible for removal until styleguide rejoins.

## Sized summary

| Metric                                  | Count   |
| --------------------------------------- | ------- |
| JSX components (site + DS)              | 40      |
| Routed pages                            | 18      |
| Serverless endpoints                    | 7 (3 routes + 4 lib)|
| Sanity schemas                          | 5       |
| Icon SVGs                               | 367     |
| Image mocks                             | 16      |
| Total source files (excl. assets)       | 108     |
| Total source LOC (JSX/JS/MJS)           | ~5,400  |
| Total CSS LOC                           | ~5,300  |

## Observations

1. **CSS layer is dead-code-loaded.** The full kol-client-ac CSS suite ships here, but ~30% of the styleguide-chrome rules (`SideNav`, `sidebars`, `kol-portal-*`, `BrandHero` patterns) have no consumer. After consolidation, either prune or accept the cost — but it should be a deliberate choice.
2. **The merge will hit exactly 6 JSX files.** Five trivial (`Avatar` is a superset, `Footer`/`SiteLayout` are route prefixes, `ContentFilters` is just an import drop, `Layout` is a feature removal) and one substantive (`BlogBody` is PortableText vs block JSON — and PortableText wins because data now lives in Sanity).
3. **`framework/Layout.jsx` divergence is the only one where the styleguide-aware version is strictly *better*.** Website dropped `ExitPreview` because there's no styleguide; re-adopting the kol-client-ac version (with `/site/*` regex gating) gives a clean multi-surface foundation when styleguide folds back in.
4. **The "site is layered on top of the DS" architecture survived the extraction cleanly.** `site/` only imports from `atoms/` (Button, Avatar, Divider, Input, Textarea), `molecules/` (Badge, ContentFilters, Dropdown), `primitives/` (Carousel), and `framework/` (ThemeToggle) — 9 DS components total. Everything else in `atoms`/`molecules`/`primitives`/`framework` is currently dead surface in this repo, but exists because the styleguide originally consumed them.
5. **`molecules/Tag.jsx` is the one true orphan in the DS shipped here.** Zero consumers in any site file. Either kol-client-ac styleguide used it or it was always speculative.
6. **`src/lib/` is the clearest "new tier" since extraction.** Pure Sanity wiring — no other lib utilities. Belongs in any consolidation as `src/lib/sanity/*` (room to grow for cart-server, mailer, etc.).
7. **The `studio/` package and `api/` directory are perfectly separable.** Studio is a standalone Vercel deploy; api/ is Vercel serverless functions co-located with the SPA. Neither needs to be touched in a fold-in — they're parallel surfaces, not entangled with the React tree.
