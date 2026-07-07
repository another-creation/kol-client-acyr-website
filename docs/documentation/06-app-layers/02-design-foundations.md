---
title: design-foundations.css
type: reference
status: active
updated: 2026-05-19
verified: 2026-05-19
description: Styleguide specimen + demo styles. Asset figures, mood tiles, swatches, ramp grids, asset carousel, combo lab (interactive color-combo demonstration), spectrum grid (9 ramps × 10 stops matrix), color anatomy, accordion, logo subsections.
aliases:
  - design-foundations
  - styleguide-css
tags:
  - project/acyr
  - domain/css
audience: internal
covers:
  - .ac-asset-figure-frame / .ac-asset-grid-Ncol responsive grids
  - .ac-mood-tile-frame image crop
  - .ac-swatch / .ac-swatch-chip / .ac-swatch-meta / .ac-ramp-chips
  - .ac-type-sample dividers + .ac-prose-indented/-pullout/-display etc.
  - .ac-embla.ac-asset-carousel chrome
  - .ac-combo-* family — full interactive combo lab (frame/slab/label/number/stage variants/cards/stripes/applied/swatches)
  - .ac-spectrum-grid (9 ramps × 10 stops matrix)
  - .ac-anatomy-sample figcaption styling
  - .ac-accordion-panel state
  - .ac-graphic / -native
  - .ac-logo-subsection-body
sources:
  - apps/styleguide/src/styles/design-foundations.css
related:
  - "[[INDEX|app-layers]]"
  - "[[01-site|site]]"
  - "[[05-framework/INDEX|framework]]"
---

# design-foundations.css

The styleguide app's specimen-and-demo CSS. Loaded after the DS cascade in `apps/styleguide/src/index.css`. **736 lines** — heavy because the styleguide IS a demo of design system primitives, so it needs a lot of one-off layouts (specimen frames, combo lab, spectrum grid, ramp tables).

## Asset specimens

```css
.ac-asset-figure-frame img    /* 100% width, height auto, block */
.ac-asset-grid-2col           /* repeat(2, 1fr) */
.ac-asset-grid-3col           /* repeat(3, 1fr) → 2-col <768px → 1-col <480px */
.ac-asset-grid-4col           /* repeat(4, 1fr) → same responsive collapse */
```

## Mood tile

```css
.ac-mood-tile-frame img                /* absolute inset-0, object-fit cover */
.ac-mood-tile-overlay .ac-brand-logo   /* 32% width, max 180px */
```

## Color swatch / ramp

```css
.ac-swatch         /* flex column gap 6 */
.ac-swatch-chip    /* height 96px, 4px radius — the colored rectangle */
.ac-swatch-meta    /* flex space-between, label + hex */
.ac-ramp-chips     /* grid auto-fit minmax(100px,1fr), gap 4 */
```

## Type sample dividers + prose helpers

```css
.ac-type-sample + .ac-type-sample    /* adjacent sibling 1px fg-08 divider */

.ac-prose-indented    /* 32px left padding, 1px fg-16 left border */
.ac-prose pre         /* mono 16px, 24 lh, overflow-x auto */
.ac-prose code        /* mono 0.9em, 1px 4px padding, 3px radius */
.ac-prose pre code    /* override: no padding/bg/radius inside pre */
.ac-prose-pullout     /* padding-y 16, border-y 1px fg-08 */
```

**Note:** the file's own header comment says "Prose moved to DS typography." The `.ac-prose-*` rules above are wrappers that depend on the DS `.ac-prose` base class declared in [[../02-tokens/04-typography|typography.css]]. Verify these wrappers are still in use; some may be dead code.

## Asset carousel — `.ac-asset-carousel`

Extends the framework's [[05-framework/INDEX|Embla chrome]] with styleguide-specific sizing.

```css
.ac-embla.ac-asset-carousel .ac-embla-viewport       /* height 440px */
.ac-embla.ac-asset-carousel.is-slides .ac-embla-viewport  /* height 560px tall variant */
.ac-embla.ac-asset-carousel .ac-embla-container      /* full-height, align stretch */
.ac-embla.ac-asset-carousel .ac-embla-slide          /* height 100% */

.ac-asset-card                  /* flex column gap 8, full height */
.ac-asset-card-frame            /* 1px fg-08 border, 4px radius, fg-04 bg, cursor zoom-in */
.ac-asset-card-frame:hover      /* border fg-24 */
.ac-asset-card-frame img        /* object-fit contain, padding 16 */
.ac-asset-card-frame.is-cover img  /* variant: object-fit cover, padding 0 */
.ac-asset-card-overlay          /* watermark overlay, fg-96, pointer-events:none */
.ac-asset-card-overlay .ac-brand-logo  /* 24% width */
```

## Website preview

```css
.ac-website-preview                              /* margin-bottom 32 */
.ac-website-preview .ac-asset-figure-frame       /* fg-02 bg — lighter than default */
```

## Type spec card

```css
.ac-type-spec-sample p              /* margin 0 0 16 — overrides Preflight */
.ac-type-spec-sample p:last-child   /* margin-bottom 0 — trim trailing */
```

## Combo Lab — the interactive demo

**The largest section in this file (~200 lines).** Used only by `ComboLab.jsx`. Demonstrates color/brand combinations interactively. All single-consumer.

### Frame + slab primitives

```css
.ac-combo-frame              /* 4px radius, overflow hidden, transitions bg/border 400ms */
.ac-combo-slab               /* padding 16, flex column space-between, transitions 400ms */
.ac-combo-slab--end          /* justify-content flex-end */
.ac-combo-slab--between      /* justify-content space-between */
.ac-combo-label              /* Compact 12px 500, 0.08em uppercase */
.ac-combo-number             /* 16px 700, 0.02em */
.ac-combo-logo               /* inline-flex, currentColor */
```

### Stage layout variants

The stage holds the actual color combo demonstration. Multiple layout modes:

```css
.ac-combo-stage--fill          /* 100% × min-360 fill */
.ac-combo-stage--ratio         /* flex children 1, 3, 6 = 60/30/10 split */
.ac-combo-stage--tower         /* flex column, children flex 1 equal */
.ac-combo-stage--quad          /* flex, children flex 1 (2×2 implied) */
.ac-combo-quad-col             /* flex column, children flex 1 */

.ac-combo-stage--card-row      /* grid 4-col, gap 16, min-360 */
.ac-combo-card                 /* flex 1, min-240, padding 20, transitions 400ms */
.ac-combo-card--end / --between

.ac-combo-stage--stripe-row    /* flex column gap 16, min-360 */
.ac-combo-stripe-row           /* flex stretch */
.ac-combo-stripe-bar           /* flex 1, relative, 4px radius, overflow hidden */
.ac-combo-stripe-seg           /* bg transition 400ms */
.ac-combo-stripe-seg--6 / --3 / --1     /* flex 6 / 3 / 1 ratios */
.ac-combo-stripe-group         /* nested flex */
.ac-combo-stripe-group--3 / --1
.ac-combo-stripe-neutral       /* border-y 1px var(--stripe-rule, transparent) */
.ac-combo-stripe-accent-border /* border 1.73px var(--stripe-accent, transparent) */
.ac-combo-stripe-method        /* absolute top-left 12, Compact 12px uppercase, color white */

.ac-combo-stage--applied                /* flex, min-360 */
.ac-combo-applied-plate                 /* flex 2, padding 32, flex column space-between */
.ac-combo-applied-col                   /* flex 1 column */
.ac-combo-applied-surface               /* flex 3 */
.ac-combo-applied-band--lg / --sm
.ac-combo-applied-band
.ac-combo-applied-accent-strip          /* flex gap 8 */
.ac-combo-applied-accent-chip           /* 20×20px, 2px radius */
```

### Lab container + controls

```css
.ac-combo-lab                /* flex 1, padding 24, 1px fg-08 border, fg-02 bg */
.ac-combo-controls           /* margin-bottom 24 */
.ac-combo-stage-wrap         /* flex 1, padding 32, fg-02 bg, 4px radius, min-440 */
.ac-page--fullbleed .ac-combo-stage-wrap  /* min-520 variant */
.ac-combo-stage-anim         /* animation ac-combo-fade 260ms ease */

@keyframes ac-combo-fade     /* opacity 0.2 + 6px translateY → 1 + none */

.ac-combo-readout            /* grid auto-fit minmax(220,1fr), gap 8 32 */
.ac-combo-row                /* flex align-center gap 16 wrap */
.ac-combo-row-label          /* min-width 72 */
.ac-combo-row-controls       /* flex wrap gap 6 */
.ac-combo-footer             /* flex align-center gap 16 */
.ac-combo-footer-desc        /* flex 1 */
.ac-combo-randomize          /* bespoke button — padding 8 16, fg-80, 1px fg-16 border */
.ac-combo-randomize:hover    /* color on-primary, border fg-48, bg fg-04 */

.ac-combo-swatch-row         /* flex align-center gap 12 */
.ac-combo-swatch-chip        /* 24×24, 3px radius, transition bg 400ms */
.ac-combo-swatch-label       /* min-width 88, weight 600 */
.ac-combo-swatch-hex         /* mono, uppercase */
.ac-combo-summary            /* margin-top 16 */
```

### Combo Lab custom properties

```css
--stripe-rule        /* optional border color for stripe-neutral (default transparent) */
--stripe-accent      /* optional border color for stripe-accent-border (default transparent) */
```

Inline-set by JS to flash specific stripe variants.

## Spectrum Grid

Color reference matrix — 9 ramps × 10 stops grid.

```css
.ac-spectrum-grid            /* grid: 100px [label-col] + repeat(10, minmax(0,1fr)) [stop-cols], gap 4 */
.ac-spectrum-grid--loading   /* min-h 400, fg-02 bg, 6px radius */
.ac-spectrum-grid-head       /* display: contents — header row is logical, not visual */
.ac-spectrum-grid-corner     /* top-left label cell */
.ac-spectrum-grid-stop-label /* mono 11px 0.08em uppercase, fg-48 */
.ac-spectrum-grid-row        /* display: contents — row is logical, not visual */
.ac-spectrum-grid-row-label  /* mono 12px 500 0.02em, on-primary, padding-right 12 */
.ac-spectrum-grid-row-label::first-letter  /* uppercase */
.ac-spectrum-grid-cell       /* aspect 5/3, 4px radius, padding 6 8 */
.ac-spectrum-grid-cell-marker /* absolute center, 10px circle, currentColor 0.85 opacity — WCAG dot */
.ac-spectrum-grid-cell:hover /* scale(1.04) */
.ac-spectrum-grid-cell-stop  /* mono 12px 700 0.04em */
.ac-spectrum-grid-cell-hex   /* mono 9px uppercase, opacity 0.78 */

@media (max-width: 900px)    /* compress: 72px label col, gap 2, hide hex */
```

`display: contents` on `.ac-spectrum-grid-head` / `-row` makes them logical groupings (rows in DOM, but children participate directly in the parent grid layout). Watch a11y — screen readers may not announce these as table rows.

## Color anatomy

```css
.ac-anatomy-sample figcaption    /* 12px italic fg-48 */
.ac-anatomy-sample code          /* mono 11px, 18% currentColor mix bg, 3px radius */
```

## Accordion (`Accordion.jsx`)

Open-state chevron color flip + `:has()` rule for meta-present trigger.

```css
.ac-accordion-panel.is-open .ac-accordion-chevron  /* color on-primary */
.ac-accordion-trigger:has(.ac-accordion-meta) .ac-accordion-chevron  /* margin-left 0 */
```

**`:has()` is modern CSS** (~2024 browser support). Older browsers won't apply this rule. Acceptable trade-off for this internal-only styleguide app.

## Graphic wrapper

```css
.ac-graphic svg                  /* 100% width, height auto, block */
.ac-graphic--native              /* opt-in: respect SVG's intrinsic width */
.ac-graphic--native svg          /* width/height auto */
```

## Logo subsections

```css
.ac-logo-subsection-body p       /* mono font-family-mono, body-03 size, 1.6 lh, fg-64, max-w 70ch */
```

Logo doc page (`Logo.jsx` SubSection function). The only place body text is explicitly tokenized to mono in the styleguide.

## Custom properties consumed

`--ac-surface-on-primary`, `--ac-font-family-mono`, `--ac-fg-02/04/08/16/24/48/64/80/96`, `--ac-text-body-03`.

## Gotchas

- **`display: contents`** on spectrum grid head/row makes logical-only groupings — flat with DOM but participate in parent grid. Potential a11y impact (screen reader may not announce row).
- **`min-height: 0` flex bug fix** on `.ac-asset-card-frame` and `.ac-combo-slab` — overrides default `min-height: auto` so flex children can shrink below content size. Critical for carousel cards in constrained heights.
- **Aspect-ratio 5/3 on `.ac-spectrum-grid-cell`** locks shape; long hex values clip when there isn't horizontal room.
- **`:has()` requires modern browsers** — accordion meta rule won't apply on older browsers.

## Audit — observed smells

1. **Hardcoded fonts** — multiple rules reference `'Right Grotesk Compact'`, `'Right Grotesk Mono'`, `'Right Grotesk'` as literals instead of `var(--ac-font-family-sans-compact)` etc. Tokenize where possible.
2. **`.ac-combo-randomize` is a bespoke button** that exists outside the [[../04-components/01-atoms|`.ac-btn`]] family. Should probably be `.ac-btn ac-btn-outline ac-btn-sm` with the icon. Migration target.
3. **`.ac-prose-*` wrapper rules** may be dead — the header comment says prose moved to DS, but the wrappers remain. Verify consumers.
4. **Single-consumer breadth** — combo lab, spectrum grid, asset carousel are each ~100+ lines for one page. Acceptable for a styleguide demo app, but flag if patterns repeat — they should be extracted.
5. **Inconsistent breakpoint** — uses `<900px` in spectrum grid (not 768 / 1024 / 1280). Reconcile with framework breakpoints.

## When to edit this file

- **Adding a new specimen layout** (mood frame, swatch, ramp display, asset carousel) — register the classes here.
- **Extending the combo lab** with a new stage mode — add to `.ac-combo-stage--*` family.
- **Adjusting spectrum grid density / responsive collapse** — tune `@media (max-width: 900px)` block.

If you find yourself reaching for `.ac-asset-card-frame` or similar in the website app — extract upward to the DS or framework layer. App-layer CSS should not be cross-imported between apps.
