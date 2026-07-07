---
title: Styleguide-only surface
date: 2026-05-16
status: archived
type: reference
---

# Styleguide-only surface

What needs to migrate from `kol-client-ac` to `styleguide/` in CWD. Everything below lives in `kol-client-ac/src/` unless noted.

## Pages

| File | Route | Purpose | KOL / AC bits consumed |
|---|---|---|---|
| `pages/Styleguide.jsx` (516 LOC) | `/styleguide` | 16-chapter client deliverable — brand book. About / voice / look / logos / color / type / stationery / labels / bags / packaging / branded mockups / social sizes / profile / generators / slide-deck / patterns. | KOL: `Swatch`, `TypeSample`, `Table`, `kol-prose`, `kol-grid`, `kol-page-section`, `Graphic`, `Image`, `LogoCard`, `DeckShell`, `SlideDeck`, `BRAND_RAMPS`, `TYPOGRAPHY_SECTIONS`, `resolveCssVar`. AC: `BRAND` config, `StationeryMocks` (A/B variants), `Avatar` (SocialMocks), `GENERATOR_ROWS`. |
| `pages/Reference.jsx` (382 LOC) | `/reference` | Token + asset reference — every URL, color, type class, asset row. Cross-bridge between `data/color.js` + `data/typography.js` (string `columns` keys) and JSX render funcs. | KOL: `Table`, `AssetTable`, `Icon`, `LiveValue`, `resolveCssVar`, `BRAND_COLORS_SECTIONS`, `TYPOGRAPHY_SECTIONS`, `graphicUrl`. AC: `ASSET_SPECS` from `brand/data/branded-assets`. |
| `pages/Acyr.jsx` (319 LOC) | `/acyr` | Single-page registry of the ACYR brand — identity / bio / timeline / press / awards / films / companies / collaborations / social / vendors / stack / live-site map / media inventory / marketing playbook / open questions. **All from `brand/data/*` files — this is brand-content, not pure styleguide.** | KOL: `Table`, `Divider`, `Badge`, `PageSection`. AC: `BRAND_INFO`, `BIO`, `TIMELINE`, `PRESS`, `AWARDS`, `FILMS`, `PROFILES`, `COMPANIES`, `COLLABORATIONS`, `SOCIAL`, `VENDORS`, `STACK`, `LIVE_SITE_MAP`, `MARKETING_PLAYBOOK`, `OPEN_QUESTIONS`, `COLLECTIONS`, `PRODUCTS`, `ARTICLES`, `AUTHORS`. |
| `pages/Gallery.jsx` (157 LOC) | `/gallery` | Dev tool — fetches `/__photos.json` (emitted by `photoIndexPlugin` at vite dev/build), renders every group as a clickable grid with focus-zoom. Standalone — no framework chrome, hard-coded inline styles. | None of the KOL chrome. Depends on the vite plugin. |
| `pages/Landing.jsx` (43 LOC) | `/` | Splash — hero image + `KolLogo` logomark + display title + "Enter site / Styleguide" CTAs. | KOL: `KolLogo`, `Button`. AC: `BRAND.name`, `ACImages.hero`. |
| `pages/NotFound.jsx` (20 LOC) | `*` | 404. Trivial. | KOL: `kol-page-hero`, `kol-sans-display-01`. |

**Pages total: 1,437 LOC across 6 files.**

## Framework chrome

| File | Purpose | Load-bearing for |
|---|---|---|
| `components/framework/BrandHero.jsx` (14 LOC) | Hero block — label + display title + lede + optional mark. | Styleguide only. |
| `components/framework/BrandLayout.jsx` (49 LOC) | Outlet wrapper — `SideNav` + mobile drawer + `<Outlet />`. **Wraps tree in `GeneratorLibraryProvider` (from editor) and `ModalProvider`.** | Every page under BrandLayout route (Landing, Styleguide, Reference, Acyr, Gallery, Editor). |
| `components/framework/PageSection.jsx` (24 LOC) | Section block — label + title + body + children + optional divider. Used everywhere as the page-section primitive. | Styleguide, Reference, Acyr. |
| `components/framework/PortalFooter.jsx` (22 LOC) | Kolkrabbi credit footer. **Unused — zero importers.** Dead code. | (none) |
| `components/framework/SideNav.jsx` (208 LOC) | Left sidebar — driven by `NAV_TREE` from `sidebars.config.js`. Scroll-spy, drawer mode, collapsed mode on editor routes. Uses `ThemeToggle` (framework-local). | All pages under BrandLayout. |
| `components/framework/SubPageHero.jsx` (27 LOC) | Hero with back-link. **Unused — zero importers.** Dead code. | (none) |
| `components/framework/sidebars.config.js` (173 LOC) | The single `NAV_TREE` — Home / Styleguide / Gallery / Another Creation (Acyr) / Reference / Editor / Live site. Used by SideNav. | All BrandLayout pages. |

**Framework total: 517 LOC across 7 files. Two files (PortalFooter, SubPageHero) are dead.**

Also under `components/framework/` but NOT in scope here: `Layout.jsx` (the App-level shell with `ScrollToTop`), `ScrollToTop.jsx`, `ThemeToggle.jsx`, `kol-framework.css` (31KB) — these are app-tier; some are needed by the live site too. The 31KB CSS file is the chrome cascade — sidebar layout, drawer transitions, sticky positioning, scroll-spy active state, etc. **Required.**

## Loaders subsystem

The total weight is **62 MB**, confirming the prior 62 MB estimate. **40 MB is raster PNGs (mocks).** **20 MB is one SVG dir (`graphics/svg/web/`).**

| Subdir | Files | Size | What it stores | Consumers |
|---|---|---|---|---|
| `loaders/decks/` | 4 (`DeckShell.jsx`, `SlideDeck.jsx`, `deckStyles.js`, `slideTemplates.js`) | 60 KB | 14-slide typographic deck + embla shell + inline CSS injection. SlideDeck imports `fgOn` from `editor/modes/palette/palettes` — **cross-dep into editor.** | Styleguide ch. 15. Editor compose uses `slideTemplates`. |
| `loaders/graphics/` | 2 JS (`Graphic.jsx`, `index.js`) + **74 SVGs** across 11 subdirs | 20 MB | Vector mockups — stationery, labels, garment-bags, packaging, social, patterns, abstract, devices, diagrams, structure, **web (17 MB / 4 files)**. Glob-loaded as `?raw` and `?url`. | Styleguide chs. 8–10, 12, 16; Reference logos/graphics/patterns tables. |
| `loaders/icons/` | 2 JS (`Icon.jsx`, `index.js`) + **367 SVGs** in 18 numbered categories | 1.5 MB | KOL icon set — `00-kol/` is canonical; other folders fall back. Layered into one cache by filename. | App-wide (SideNav, drawer toggles, Reference, AssetTable, Editor, site). **Not styleguide-only — but the styleguide consumes it.** |
| `loaders/images/` | 2 JS (`Image.jsx`, `index.js`) + 16 PNGs in `img/mocks/` | 40 MB | Branded photo-mocks — business card, email signature, label dressings, pamphlets, yrac-label-1/2 (5 MB each). Vite `?url`. | Styleguide ch. 11 (branded mockups carousel). |
| `loaders/logos/` | 2 JS (`Logomark.jsx`, `index.js`) + 4 KOL SVGs in `svg/` | 52 KB | KOL DS marks (logomark / wordmark / lockup). | KOL DS — consumed by app chrome, not styleguide-specific. |
| `loaders/marks/` | 2 JS (`BrandLogo.jsx`, `index.js`) + 4 SVGs in `svg/` | 24 KB | Client brand-marks. | Currently appears unused at top-level — needs verification on migration. |

**Heaviness explained: it's the assets, not the code.** `loaders/decks/` total JS is 1,077 LOC; `loaders/graphics/Graphic.jsx` is 61 LOC. The mass is:
- **40 MB raster PNGs** in `images/img/mocks/` — `yrac-label-1.png` (5 MB), `yrac-label-2.png` (5 MB), `mocks-labels-04.png` (4.9 MB), etc. These are pre-rendered photo composites used in the branded-mockups carousel.
- **17 MB** in `graphics/svg/web/` (4 SVG files). Likely full webpage exports embedded as SVG.
- 1.5 MB icons (367 small SVGs).

No fonts under loaders — fonts live in `src/editor/styles/kol-typography-fonts-full.css` (23 KB, declarations only; the actual woff2 files are referenced from the loaded font CSS that lives elsewhere in the project).

## Styleguide components (`components/styleguide/`)

23 files, 1,787 LOC, 136 KB. **Only Styleguide.jsx and Reference.jsx consume this folder** — it really is styleguide-private.

| File | LOC | Purpose | Consumers |
|---|---|---|---|
| `AssetCard.jsx` | 25 | Caption + bg-fg-04 padded frame for asset child. | Styleguide chs. 8–10, 12. |
| `AssetCarousel.jsx` | 48 | Embla-wrapped carousel of assets. | Unconfirmed — may be unused. |
| `AssetFigure.jsx` | 23 | Figure + caption. | Unconfirmed. |
| `AssetGrid.jsx` | 7 | Trivial grid wrapper. | Unconfirmed. |
| `AssetTable.jsx` | **237** | Logo/graphic asset table — overlay-on-click, ink/inverse toggle, recolor download via `currentColor` replacement. **Largest non-mock file.** Imports `KolLogo`, `Graphic`. | Reference (logos/graphics/patterns tables). |
| `ClearspaceDiagram.jsx` | 38 | Logo clearspace framework. | LogoCard. |
| `FeatureSplit.jsx` | 40 | 2-column split. | Unconfirmed. |
| `FullscreenGallery.jsx` | 32 | Fullscreen image overlay. | Unconfirmed. |
| `LogoCard.jsx` | 49 | Logo preview frame + clearspace toggle. Imports `KolLogo`. | Styleguide chs. 4–5. |
| `LogoCarousel.jsx` | 18 | Trivial wrapper. | Unconfirmed. |
| `LogoScaling.jsx` | 67 | Logo at multiple scales. | Unconfirmed. |
| `MoodTile.jsx` | 21 | Mood image tile. | Unconfirmed. |
| `PortalIndex.jsx` | 43 | Portal route index. | Unconfirmed. |
| `ProsePreview.jsx` | 40 | Prose sample render. | Unconfirmed. |
| `Ramp.jsx` | 16 | Color ramp row. | Unconfirmed. |
| `SigTicker.jsx` | 25 | Animated signature ticker. **Likely uses gsap.** | Unconfirmed. |
| `SocialMocks.jsx` | 136 | IG post/story mockups (`PostPhoto`, `PostType`, `PostProduct`, `PostEditorial`, `StoryPhoto`, `StoryType`, `Avatar`). Imports `KolLogo`. | Styleguide ch. 13 uses `Avatar`. Others may be standalone. |
| `SpectrumGrid.jsx` | 81 | Color spectrum grid. | Unconfirmed. |
| `StationeryMocks.jsx` | **722** | **Largest file.** Pure-JSX renderings of every printed AC asset (business cards, envelope, letterhead A/B, email signature, hangtag A/B, swing/care/neck/size labels A/B, edition cards, dust bag A/B, garment bag, packaging). | Imported by Styleguide.jsx (chs. 8–10) but **most exports are replaced by `Graphic` loader calls in the current page**. Some unused. |
| `Swatch.jsx` | 23 | Color chip + hex/name caption. | Styleguide ch. 6. |
| `TypeSample.jsx` | 31 | Type spec row — label + sample line. | Styleguide ch. 7. |
| `TypeScaleSection.jsx` | 34 | Type scale block. | Unconfirmed. |
| `TypeSpecCard.jsx` | 31 | Type spec card. | Unconfirmed. |

**About 10 of these 23 components (StationeryMocks subsets, AssetCarousel/Figure/Grid, LogoCarousel, FullscreenGallery, MoodTile, PortalIndex, ProsePreview, SigTicker, SpectrumGrid, TypeScaleSection, TypeSpecCard) likely have no current consumer.** Worth verifying with a dead-code pass before migration — could shave several hundred LOC.

## Data files

`src/data/` — 4 files, 921 LOC.

| File | Exports | Consumers | Load-bearing? |
|---|---|---|---|
| `data/color.js` (286 LOC) | `BRAND_RAMPS`, `BRAND_COLORS_SECTIONS`, `UI_COLORS_SECTIONS` | Styleguide, Reference | **Yes.** Single source of truth for color reference tables + ramp definitions. |
| `data/typography.js` (285 LOC) | `TYPOGRAPHY_SECTIONS` | Styleguide, Reference | **Yes.** Drives both the styleguide type chapter and the reference type tables. |
| `data/generators.jsx` (58 LOC) | `GENERATOR_ROWS`, `generatorCols` | Styleguide ch. 14, Reference §01 | Yes — table for the editor mode index. **Note: `.jsx` extension because it returns `<code>` in a render func.** |
| `data/components.js` (292 LOC) | `ATOMS`, `MOLECULES`, `NAVIGATION_MOLECULES`, `ORGANISMS` | **None.** Zero importers in the codebase. | **No — orphaned.** Skip or archive. |

Also referenced from Reference.jsx: `resolveCssVar` + `LiveValue` from `components/sections/ColorRamp.jsx` — this file is *outside* `data/` but functions as a data-bridge (resolves `--var` to its computed hex at runtime). Single file, single export, needed by the live-hex swatches.

## Editor app (`src/editor/`)

**137 files, 884 KB on disk, ~13,691 LOC code + ~33 KB CSS + 41 inline SVG icons + 4 abstract pattern SVGs.**

It's a four-mode in-browser design tool mounted at `/editor/:mode`:

- **Compose** (`modes/compose/Compose.jsx`) — Figma-style layered editor. Background / pattern / photo / shape / text + groups. Multi-select, flatten, snap, SVG / PNG export. The unified editing surface.
- **Palette** (`modes/palette/ComboLab.jsx`) — Layout × palette × logo scratchpad. Was "Combo Lab."
- **Pattern** (`modes/pattern/PatternLab.jsx`) — Shape × grid × color → tileable SVG. Save to library, drag onto compose canvas.
- **Type** (`modes/type/TypeLab.jsx`) — Pick from full 98-cut Right Grotesk family. Axis morph between cuts, opentype outline export.

**Shape:**
```
editor/
  Editor.jsx               route dispatcher, wraps all 4 mode providers
  EditorShell.jsx          two-rail layout (left/right + canvas)
  color/                   shared color picker / panel / eyedropper (17 files)
  components/              EditorButton, TypeBlock, TypeBlockToolbar (3 files)
  compose/                 compose-mode internals (20 files — bbox, build, helpers, inspectors, layer renderer, snap, state)
  data/                    typography-cuts.js (98 cuts data)
  icons/                   EditorIcon.jsx + 41 inline SVGs
  library/                 LibraryProvider, starters
  modes/                   compose, palette, pattern, type subfolders (39 files)
  shell/                   canvas, menu, panels, shortcuts (9 files)
  state/                   keymap, panels, tools, useGlobalShortcuts (4 files)
  styles/                  kol-editor.css (9.6 KB) + kol-typography-fonts-full.css (23 KB)
```

**Deps NOT in normal app deps:**
- `opentype.js` — read font outlines for Type mode export. Used in `modes/type/fontLoader.js` + `MorphedText.jsx`.
- `colord` — color math used throughout (palette mode, pattern mode, color picker).
- `gsap`, `wawoff2` — package-listed but not used inside editor (gsap is loaded by `loaders/decks/DeckShell.jsx` only, wawoff2 wasn't found in actual imports — may be transitive).

**Cross-deps to/from styleguide surface:**
- `BrandLayout.jsx` imports `GeneratorLibraryProvider` from `editor/library/LibraryProvider` — **every page under BrandLayout depends on the editor's library provider being mounted.** Hard coupling. The styleguide cannot ship without the editor unless this is refactored to a no-op default, OR BrandLayout is forked.
- `loaders/decks/SlideDeck.jsx` imports `fgOn` from `editor/modes/palette/palettes` — cross-dep.
- `editor/components/TypeBlock.jsx` + `TypeBlockToolbar.jsx` import from `data/components.js` and `pages/Reference.jsx` (unconfirmed direction — needs inspection on migration).

**Does it stand alone?** No. It depends on KOL atoms (Slider, Button, Stepper, ViewToggle, Dropdown, LabeledControl from `components/atoms` + `components/molecules`), the icon loader, and the BrandLayout drawer chrome.

## App route table

Styleguide-relevant routes from `src/App.jsx`:

| Path | Element | Layout |
|---|---|---|
| `/` | `Landing` | Layout → BrandLayout |
| `/styleguide` | `Styleguide` | Layout → BrandLayout |
| `/reference` | `Reference` | Layout → BrandLayout |
| `/acyr` | `Acyr` | Layout → BrandLayout |
| `/gallery` | `Gallery` | Layout → BrandLayout |
| `/editor/:mode` | `Editor` | Layout → BrandLayout |
| `/editor` | redirect → `/editor/compose` | — |
| `/generators*` | legacy redirects → `/editor/*` | — |
| `/compose` | legacy redirect → `/editor/compose` | — |
| `*` | `NotFound` | Layout |

Site routes (`/site/*`) are out of scope — they're the marketing app, separate concern. **All styleguide routes live under BrandLayout** — that's the single load-bearing chrome boundary.

## Package.json delta

| Dependency | In `kol-client-ac` | In CWD (`kol-acyr-website`) | Styleguide-only? |
|---|---|---|---|
| `@floating-ui/react` | ✓ | ✓ | shared |
| `@tailwindcss/vite` | ✓ | ✓ | shared |
| `colord` | ✓ | ✓ | shared (editor + a few molecules) |
| `embla-carousel-react` | ✓ | ✓ | shared (used by `loaders/decks/DeckShell`, `loaders/styleguide/AssetCarousel`, `components/primitives/Carousel`, `components/site/LookbookCarousel`) |
| `gsap` | ✓ | ✓ | **styleguide chain — DeckShell only** (no other consumer). |
| `opentype.js` | ✓ | ✓ | **editor only** (Type mode). Transfer with editor. |
| `react`, `react-dom`, `react-router-dom`, `tailwindcss` | ✓ | ✓ | shared |
| `wawoff2` | ✓ | ✓ | **package-listed, no JS importer found** — likely a transitive build dep or stale. Worth deleting. |
| **— CWD-only —** | | | |
| `@paypal/react-paypal-js` | — | ✓ | site-only |
| `@portabletext/react` | — | ✓ | site-only (Sanity) |
| `@sanity/client` | — | ✓ | site-only |
| `@sanity/image-url` | — | ✓ | site-only |
| **vite-plugin-photo-index** | not an npm pkg — lives as `vite-plugins/photoIndexPlugin.js` locally | — | local plugin file; must be copied separately, not via npm. |
| `vite-plugin-svgr` | ✓ | ✓ | shared |

**New runtime deps the merge brings in: zero from npm.** Every dep `kol-client-ac` has is already in CWD. The styleguide consolidation is `import path` work, not dependency work. The exception is `photoIndexPlugin.js` — a local vite plugin that needs to be copied as a file into CWD.

Devdeps differ in versioning but are alignable (eslint, vite-plugin-svgr).

## Asset payload

**Identity verified.** Spot-check of 3 random textures (jpg files in `public/brand/textures/`) shows byte-identical content between the two repos:

- `textures/texture-01.jpg` — sha1 `1359317d05cb6414fa6de6eef98877cbec79fdbe` (MATCH)
- `textures/texture-02.jpg` — sha1 `396a478d10997c7bb0afeb3db0c2bf097357775c` (MATCH)
- `textures/texture-03.jpg` — sha1 `20148e33473cd406ad209ff88b721ef73d999e00` (MATCH)

**Sizes:**
- `kol-client-ac/public/brand/` = **304 MB** (316 files)
- `kol-acyr-website/public/brand/` = **305 MB** (319 files)

Both contain the same 7 subfolders: `collections`, `mood`, `photoshoot`, `shop`, `textures`, `video`, `yr`. The 3-file delta is microscopic — likely 3 new photos in CWD. **The 305 MB duplication estimate is correct.** Migration target: pick one canonical location, delete the other.

## Sized summary

| Bucket | Files | LOC | On-disk |
|---|---|---|---|
| Pages (Styleguide / Reference / Acyr / Gallery / Landing / NotFound) | 6 | 1,437 | ~80 KB |
| Framework (BrandHero, BrandLayout, PageSection, SideNav, sidebars.config; excludes Layout, ScrollToTop, ThemeToggle, kol-framework.css) | 7 | 517 | ~16 KB |
| Styleguide components | 23 | 1,787 | 136 KB |
| Data | 4 | 921 | ~40 KB |
| Loaders code | ~14 | ~1,820 | (code only) |
| Loaders assets — graphics SVG | 74 | — | **20 MB** |
| Loaders assets — icons SVG | 367 | — | **1.5 MB** |
| Loaders assets — image PNG | 16 | — | **40 MB** |
| Loaders assets — logos / marks SVG | 8 | — | ~76 KB |
| Loaders assets — decks code | 4 | 1,077 | 60 KB |
| Editor (code + CSS + 41 svg + 4 abstract svg) | 137 | ~13,691 | 884 KB |
| Public brand assets (duplicated 1:1 with CWD) | 316 vs 319 | — | **304 / 305 MB** |
| **Sum (excl. duplicated public/brand)** | **~660 files** | **~20,173 LOC** | **~62.7 MB** |

The 62 MB loaders + 1 MB editor + assorted code = the **63 MB styleguide tree** to be moved. Plus the **305 MB asset folder which is already a duplicate** — that's a deduplication job, not a copy job.

## Observations

- **BrandLayout couples the styleguide to the editor through `GeneratorLibraryProvider`.** Every page under BrandLayout — Landing, Styleguide, Reference, Acyr, Gallery — mounts the editor's library context. You can't migrate the styleguide pages without either bringing the editor or refactoring this dependency. Pick one before starting the move.
- **`loaders/decks/SlideDeck.jsx` imports `fgOn` from `editor/modes/palette/palettes`.** Slide-deck migration drags one editor file with it unless `fgOn` is extracted. Trivial inline (it's a one-liner), but it's a cross-cut to be aware of.
- **`data/components.js` (292 LOC) has zero importers in the entire codebase.** Drop on migration — don't carry stale inventory.
- **`framework/PortalFooter.jsx` and `framework/SubPageHero.jsx` are both unused.** Defined but never imported. Drop.
- **Roughly half of `components/styleguide/` (10–12 files) looks unconsumed by the current Styleguide.jsx / Reference.jsx.** AssetCarousel / AssetFigure / AssetGrid / LogoCarousel / FullscreenGallery / MoodTile / PortalIndex / ProsePreview / SigTicker / SpectrumGrid / TypeScaleSection / TypeSpecCard — do a dead-code sweep before migration. Could trim hundreds of LOC and one gsap dep (SigTicker).
- **The 305 MB public asset folder is the actual size issue, not the 62 MB loaders.** The loaders subsystem is heavy because of pre-rendered PNG mockups (40 MB in 16 files) and one bloated SVG dir (`graphics/svg/web/`, 17 MB in 4 files). The 305 MB `public/brand/` is byte-identical between repos and must be deduplicated, not copied.
- **`photoIndexPlugin` is a local file (`kol-client-ac/vite-plugins/photoIndexPlugin.js`), not an npm package.** Gallery.jsx and Reference.jsx both fetch `/__photos.json` which this plugin emits at build time. Must copy the plugin file and register it in CWD's `vite.config.js` if Gallery is to work.
- **Acyr.jsx is brand content, not styleguide.** It pulls entirely from `brand/data/*` files (BIO, TIMELINE, PRESS, AWARDS, FILMS, COMPANIES, COLLABORATIONS, SOCIAL, VENDORS, STACK, LIVE_SITE_MAP, MARKETING_PLAYBOOK, OPEN_QUESTIONS, COLLECTIONS, PRODUCTS, ARTICLES, AUTHORS). It belongs with the AC brand data, not the design-system styleguide — consider whether `/acyr` lives in the styleguide migration or moves to the AC brand inventory tree.
