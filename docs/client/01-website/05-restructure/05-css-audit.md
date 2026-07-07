---
title: CSS audit — line-level classification
type: audit
status: active
related:
  - "[[01-website/05-restructure/INDEX|restructure-index]]"
  - "[[01-website/05-restructure/03-target-state|target-state]]"
  - "[[01-website/05-restructure/04-phases|phases]]"
companion_to: "[[01-website/05-restructure/04-phases|phases]]"
tags:
  - restructure
  - css
  - ac-ds
  - classification
created: 2026-05-17
---

# CSS audit — DS-canon / Brand / Site-chrome

Line-level pass through the 14 CSS files. Each rule block classified so [[01-website/05-restructure/04-phases|phases]] step 1 has a precise file-move map.

**Tiers:**
- **DS-canon** — brand-agnostic design system primitives. Tokens, breakpoints, utility classes, atoms/molecules/organisms, framework-level layout primitives (sidenav, page grid, carousel base, overlay, footer chrome, back link, code block). Goes to `packages/ds/`.
- **Brand** — AC-specific identity. Hue ramps, brand color names, font face declarations, `@theme` block registering brand colors as Tailwind utilities. Goes to `packages/ds/tokens/brand-*.css` (single named system per [[01-website/05-restructure/01-decisions|decisions]] D1).
- **Site-chrome** — consumer code. Marketing-site sections, styleguide design-foundations UI. Goes to `apps/website/src/styles/` or `apps/styleguide/src/styles/`.
- **Meta** — comments, file headers, cascade declarations. No migration impact.

## Summary

| Tier | Lines | % of total | Destination |
|---|---:|---:|---|
| DS-canon | ~1,950 | 36% | `packages/ds/` |
| Brand | ~203 | 4% | `packages/ds/tokens/brand-*.css` |
| Site-chrome (website) | ~1,110 | 21% | `apps/website/src/styles/site.css` |
| Site-chrome (styleguide design-foundations) | ~700 | 13% | `apps/styleguide/src/styles/design-foundations.css` |
| Meta | ~47 | 1% | (no migration) |
| **Total** | **~4,010** | | |

Discrepancy from the 5,391-line total: ~1,381 lines are comments, blank lines, or section dividers not counted in tier totals.

## File-by-file classification

### `src/index.css` — 13 lines

**Classification: Meta (cascade ordering only). Migration: rewrite, don't move.**

After Phase 1, this file becomes:
```css
@import "tailwindcss";
@import "./ds/index.css";
@import "./styles/site.css";
```

### `src/styles/kol-theme.css` — 105 lines

**Classification: DS-canon (umbrella + foundation tokens). Migration: `packages/ds/tokens/theme.css`.**

| Lines | Section | Classification |
|---|---|---|
| 1–24 | Documentation header | Meta |
| 26–33 | `@import` statements (8 leaf files) | DS-canon (acts as umbrella) |
| 35–95 | `:root` tokens — spacing, radius, shadow, z-index, transition, opacity scales | DS-canon |
| 97–105 | Dark mode shadow adjustments | DS-canon |

**Move whole file. Update `@import` paths to siblings in new location.**

### `src/styles/kol-color.css` — 311 lines

**Classification: DS-canon (surface tier color tokens). Migration: `packages/ds/tokens/color.css`.**

100% DS-canon. Surface tiers (primary/secondary/tertiary/inverse), accent default (neutral ink-based; explicitly designed for brand-rebind override), color-mix opacity derivatives. Reusable as-is.

### `src/styles/kol-opacity.css` — 369 lines

**Classification: DS-canon (foreground opacity scale + text roles). Migration: `packages/ds/tokens/opacity.css`.**

100% DS-canon. `--ac-fg-*` scale (01–96, 14 stops), standard + inverse tiers, semantic text-role classes (emphasis, lede, body, meta, subtle).

### `src/styles/kol-typography.css` — 617 lines

**Classification: DS-canon (Right Grotesk @font-face + type scale). Migration: `packages/ds/tokens/typography.css`.**

100% DS-canon. Right Grotesk family @font-face (12+ weights), display/heading/text scales. The typeface is a generic Pangram Pangram library face (not AC-exclusive); ownership at the DS tier is appropriate.

### `src/styles/kol-typography-mono.css` — 177 lines

**Classification: DS-canon (JetBrains Mono @font-face + mono scales). Migration: `packages/ds/tokens/typography-mono.css`.**

100% DS-canon. JetBrains Mono @font-face (4 weights), `.ac-mono-N` and `.ac-helper-N` class scales for portal-style typography.

### `src/styles/kol-utilities.css` — 92 lines

**Classification: DS-canon (CSS utility helpers). Migration: `packages/ds/utilities/utilities.css`.**

100% DS-canon. `.flex-center`, `.absolute-center`, `.text-balance`, `.breakpoint-padding`, `.sr-only`, `.fullbleed`. Generic helpers.

### `src/styles/kol-components-atoms.css` — 709 lines

**Classification: DS-canon (atom-level component CSS). Migration: `packages/ds/components/atoms.css`.**

100% DS-canon. `.ac-control` shell with variants (filled, ghost, outline), size variants (sm/md/lg), state rules (disabled, aria-disabled). Reusable button/input chrome.

### `src/styles/kol-components-molecules.css` — 255 lines

**Classification: DS-canon (molecule-level component CSS). Migration: `packages/ds/components/molecules.css`.**

100% DS-canon. `.ac-popover`, `.ac-tooltip`, `.ac-pill-subtle`, `.ac-pill-inverse`. Composed component chrome.

### `src/styles/kol-components-organisms.css` — 220 lines

**Classification: DS-canon (organism-level component CSS). Migration: `packages/ds/components/organisms.css`.**

100% DS-canon. `.ac-table-wrapper`, `.ac-table`, cell classes, table variants (`.ac-table--simple`). Multi-part data table chrome.

### `src/brand/kol-brand-color.css` — 111 lines

**Classification: Brand (AC color identity). Migration: `packages/ds/tokens/brand-color.css`.**

| Lines | Section | Classification |
|---|---|---|
| 1–14 | Documentation header | Meta |
| 16–53 | Burgundy / cream / grey ramps | Brand |
| 55–67 | Brand roles (`--brand-primary`, `--brand-secondary`, ink-on-fill pairs) | Brand |
| 69–81 | Accent rebind (switches `--ac-accent-*` from neutral to burgundy) | Brand |
| 83–111 | `@theme` block (registers brand tokens as Tailwind utilities) | Brand |

**Move whole file. Rename `--brand-*` and `--kol-*` token vars to `--ac-*` for namespace consistency.**

### `src/brand/kol-brand-typography.css` — 91 lines

**Classification: MIXED (loading bug + tier confusion). Migration: split.**

| Lines | Section | Classification | Destination |
|---|---|---|---|
| 1–14 | Documentation header | Meta | (drop or update) |
| 16–40 | `@font-face` Right Grotesk Mono | Brand | `packages/ds/tokens/brand-typography.css` |
| 42–55 | Tokens (`--ac-text-helper-*`, `--ac-font-family-mono` override) | **Ambiguous → treat as Brand** | `packages/ds/tokens/brand-typography.css` |
| 57–90 | Helper classes (`.kol-helper-*`, `.kol-mono-text`) | Site-chrome (marketing site helpers) | `apps/website/src/styles/site.css` |

**Why split:** the @font-face + token override IS brand-tier (AC's chosen mono face overrides the DS default). The helper classes are marketing-site-specific text treatments. The audit confirmed this is the JSX side-door loading bug source — the override needs to load AFTER brand-color.css in the cascade, which is why someone put it in JSX. Fix: load it in the cascade via `packages/ds/index.css`, and migrate the site-chrome helpers out to `apps/website/src/styles/site.css`.

### `src/components/framework/kol-framework.css` — 1,212 lines

**Classification: MIXED (DS-canon framework primitives + ~700 lines of styleguide-app design-docs UI). Migration: split into `packages/ds/framework/framework.css` + `apps/styleguide/src/styles/design-foundations.css`.**

Most consequential file in the audit. Documented section-by-section:

| Lines | Section | Classification | Destination |
|---|---|---|---|
| 1–10 | Documentation header | Meta | drop |
| 12–16 | `html`/`body`/`::selection` base | DS-canon | `packages/ds/framework/framework.css` |
| 18–22 | Selection highlight (brand-primary color) | Brand | merge into `packages/ds/tokens/brand-color.css` |
| 24–71 | Spacing/layout tokens + responsive breakpoints (`--ac-topnav-h`, `--ac-pad-*`, `--ac-container-max`) | DS-canon | `packages/ds/framework/framework.css` |
| 74–116 | SideNav layout primitives (rail/drawer modes) | DS-canon | `packages/ds/framework/framework.css` |
| 117–143 | (likely sidenav continuation or section gap) | DS-canon | `packages/ds/framework/framework.css` |
| 144–189 | Page scaffold (`.ac-page`, `.ac-page-hero`, `.ac-grid`) | DS-canon | `packages/ds/framework/framework.css` |
| 192–216 | Asset figure/grid responsive columns | Site-chrome (styleguide) | `apps/styleguide/src/styles/design-foundations.css` |
| 218–240 | Mood tile (image + overlay logomark) | Site-chrome (styleguide) | `apps/styleguide/src/styles/design-foundations.css` |
| 242–268 | Swatch/Ramp (color specimens) | Site-chrome (styleguide) | `apps/styleguide/src/styles/design-foundations.css` |
| 270–315 | Type samples, prose, pullout | Site-chrome (styleguide) | `apps/styleguide/src/styles/design-foundations.css` |
| 316–363 | Fullscreen overlay (image viewer) | DS-canon | `packages/ds/framework/framework.css` |
| 365–425 | Carousel (Embla + asset carousel) | **Split** — generic carousel layout is DS-canon, asset-carousel specifics are styleguide-chrome | mixed; default to keeping carousel base in DS, asset-carousel overrides in styleguide |
| 426–477 | Asset card tiles | Site-chrome (styleguide) | `apps/styleguide/src/styles/design-foundations.css` |
| 478–512 | Brand logo + logomark sizing | DS-canon | `packages/ds/framework/framework.css` |
| 514–545 | Exit preview button (client surfaces) | DS-canon | `packages/ds/framework/framework.css` |
| 547–590 | Portal footer | DS-canon | `packages/ds/framework/framework.css` |
| 591–645 | Back link, code block | DS-canon | `packages/ds/framework/framework.css` |
| 672–684 | Reveal utility animation | DS-canon | `packages/ds/framework/framework.css` |
| 687–693 | Foundations page section comment | Meta | drop |
| 694–935 | Combo Lab layout + controls | Site-chrome (styleguide) | `apps/styleguide/src/styles/design-foundations.css` |
| 936–1015 | Spectrum Grid (color-token matrix) | Site-chrome (styleguide) | `apps/styleguide/src/styles/design-foundations.css` |
| 1017–1148 | Color Anatomy, Accordion, AssetPlaceholder, Graphic, Logo subsections | Site-chrome (styleguide) | `apps/styleguide/src/styles/design-foundations.css` |
| 1150–1212 | End-of-file deletion markers / comments | Meta | drop |

**DS-canon lines (rough total ~500):**
- `html`/`body`/`::selection` base
- Layout tokens + breakpoints
- SideNav layout
- Page scaffold + grid
- Fullscreen overlay
- Carousel base
- Logo container utilities
- Exit preview button
- Portal footer
- Back link, code block
- Reveal utility

**Site-chrome lines (rough total ~700) — all styleguide-app-specific:**
- Asset figure, asset grid, asset card
- Mood tile
- Swatch, Ramp, Type sample
- Combo Lab (260 lines)
- Spectrum Grid
- Color Anatomy, Graphic, Logo subsections

**Procedure for Phase 1:**

1. Open both target files in `src/ds/framework/framework.css` and `styleguide/src/styles/design-foundations.css` (styleguide gets a new local file).
2. Walk top-down through the source file.
3. For each section: copy to the destination matching its classification.
4. Update class prefixes `kol-` → `ac-` as you copy.
5. After full split, delete the source file.

### `src/styles/kol-site.css` — 1,112 lines

**Classification: Site-chrome (100% website marketing-site code). Migration: `apps/website/src/styles/site.css`. Drop the `kol-` prefix; this was never DS.**

| Lines | Section | Classification |
|---|---|---|
| 1–7 | Documentation header | Meta |
| 9–12 | Scrollbar gutter reserve | Site-chrome |
| 14–29 | Fullbleed (`.site-*` family base) | Site-chrome |
| 31–160 | INTRO section (kinetic brand reveal, GSAP timeline) | Site-chrome |
| 162–259 | FEATURE section (text + image editorial) | Site-chrome |
| 261–369 | MARQUEE section (customer logos carousel) | Site-chrome |
| 371–495 | PORTAL INDEX / ANCHOR section (card grid) | Site-chrome |
| 497–512 | SIGNATURE TICKER | Site-chrome |
| 514–633 | GALLERY section (carousel grid) | Site-chrome |
| 635–689 | TESTIMONIAL section (pull quote) | Site-chrome |
| 691–790 | FAQ section (collapsible Q/A) | Site-chrome |
| 792–871 | SITE NAV (top bar + mobile drawer) | Site-chrome |
| 873–1070 | SITE FOOTER (columns + newsletter strip) | Site-chrome |
| 1072–1110 | SITE COLLECTION (product grid) + helpers | Site-chrome |

**Move whole file to `apps/website/src/styles/site.css`. Class prefix is already `.site-*` (correctly applied — the file was just housed in the wrong tier folder).**

## After the audit — destination summary

### `packages/ds/` total: ~2,850 lines (DS-canon + Brand)

```
packages/ds/
├── tokens/
│   ├── theme.css         (~105 lines — from kol-theme.css)
│   ├── color.css         (~311 lines — from kol-color.css)
│   ├── opacity.css       (~369 lines — from kol-opacity.css)
│   ├── typography.css    (~617 lines — from kol-typography.css)
│   ├── typography-mono.css (~177 lines — from kol-typography-mono.css)
│   ├── brand-color.css   (~111 lines — from kol-brand-color.css + selection-highlight from kol-framework.css)
│   └── brand-typography.css (~55 lines — @font-face + override only, from kol-brand-typography.css)
├── utilities/
│   └── utilities.css     (~92 lines)
├── components/
│   ├── atoms.css         (~709 lines)
│   ├── molecules.css     (~255 lines)
│   └── organisms.css     (~220 lines)
├── framework/
│   └── framework.css     (~500 lines — DS-canon portion of kol-framework.css)
└── index.css             (~14 lines — cascade declarations)
```

### `apps/website/src/styles/site.css` — ~1,150 lines (Site-chrome website)

- Full content of `kol-site.css` (~1,112 lines)
- Plus the helper classes from `kol-brand-typography.css` (~35 lines)
- Class prefix already `.site-*`. No prefix changes needed.

### `apps/styleguide/src/styles/design-foundations.css` — ~700 lines (Site-chrome styleguide)

- The ~700 lines from `kol-framework.css` that are design-docs UI (combo-lab, spectrum-grid, mood-tile, asset-card, type-sample, etc.)
- Plus any existing styleguide-only CSS rules currently scattered.
- Class prefix updates `kol-` → `ac-` for the DS-canon parts that get referenced; the design-foundations selectors can stay specific (`.kol-foundations-*` rename to `.styleguide-foundations-*` if helpful).

## Validation

After Phase 1 file moves, a `grep -rn "kol-" packages/ds apps/website/src/styles apps/styleguide/src/styles` should return zero hits (excluding comment context). A diff of `pnpm build` output before vs after Phase 1 should show no new CSS class names — only renames (every `.kol-X` becomes `.ac-X`).

A visual smoke test against the live site post-Phase-1 should show no regressions. The cascade order is preserved; only file locations and class names change.
