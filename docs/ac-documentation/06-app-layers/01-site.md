---
title: site.css
type: reference
status: active
updated: 2026-05-19
verified: 2026-05-19
description: Website marketing chrome. Landing page intro animation, marquee, anchor portal, gallery carousel, site nav + drawer, footer, product card hover overlay, newsletter row. Lives at apps/website/src/styles/site.css.
aliases:
  - site
  - site-css
  - site-chrome
tags:
  - project/acyr
  - domain/css
audience: internal
covers:
  - scrollbar-gutter root rule
  - full-bleed pattern (width:100vw; margin-left:calc(50% - 50vw))
  - .site-intro / -word / -pullline / -scroll-cue (GSAP-driven hero)
  - .site-marquee (seamless infinite loop)
  - .site-anchor portal index
  - .site-gallery carousel chrome
  - .ac-site-nav (top bar + mobile drawer)
  - .ac-site-footer (5-col → 1-col grid)
  - .ac-product-card hover overlay
  - .ac-site-newsletter-row, .ac-site-support-cta-actions
sources:
  - apps/website/src/styles/site.css
related:
  - "[[INDEX|app-layers]]"
  - "[[02-design-foundations|design-foundations]]"
  - "[[../05-framework|framework]]"
---

# site.css

The website's bespoke marketing chrome. Loaded as the last `@import` in `apps/website/src/index.css`, so it sits on top of the entire DS cascade.

**744 lines.** Most of it is either GSAP-animation-bound or full-bleed landing-page-section CSS that genuinely needs to live somewhere bespoke. A handful of blocks are honest single-consumer smells (flagged at bottom).

## Foundation

### Root scrollbar gutter

```css
:root { scrollbar-gutter: stable; }
```

Reserves scrollbar space on all viewports so full-bleed carousels don't shift layout when a vertical scrollbar appears/disappears. **Load-bearing for every `width: 100vw` section.**

### Full-bleed pattern

```css
.site-intro, .site-marquee, .site-anchor, .site-sig, .site-gallery {
  width: 100vw;
  margin-left: calc(50% - 50vw);
}
```

The escape pattern. Every section that needs to break edge-to-edge gets this treatment. Equivalent to [[../03-utilities/01-utilities|`.fullbleed`]] but inlined here per-section.

## Landing hero — `.site-intro`

GSAP-driven intro animation. Multiple layered elements coordinate.

```css
.site-intro-bg          /* positioned background, opacity 0 → animated up */
.site-intro-veil        /* radial + linear gradient scrim, pointer-events:none */
.site-mark-halo         /* radial-gradient halo, blur(24px), brand-primary */
.site-intro-mark        /* logo container */
.site-mark-wipe         /* mask-image animation via --mask-x custom property */
.site-intro-word        /* h1, clamp(56–160px), Right Grotesk Wide 900 */
.site-word-char         /* per-character span — GSAP staggers */
.site-pullline          /* sub-line, gap 16px */
.site-pullline-item     /* each cue, GSAP target */
.site-pullline-serif    /* italic 700 brand-primary inside pullline */
.site-pullline-sep      /* opacity 0.4 separator */
.site-scroll-cue        /* bottom-centered scroll indicator */
@keyframes site-bob     /* the chevron bob */
```

**GSAP contract:** the JS timeline animates `--mask-x` on `.site-mark-wipe`, opacity/blur on `.site-mark-halo`, `.site-intro-word` characters, and `.site-pullline-item` transforms. CSS provides foundation + `will-change` hints. If you change a class name here, update `Landing.jsx`.

Uses hardcoded `font-family: 'Right Grotesk Wide'` (not a token) — `Wide` isn't currently exposed as a `--ac-font-family-*` variable.

## Marquee — `.site-marquee`

Seamless infinite logo strip. Full-bleed black background.

```css
.site-marquee                       /* full-bleed, ac-color-absolute-black bg, height 192px */
.site-marquee-kicker                /* mono 11px 600 0.14em uppercase, fg-48 */
.site-marquee-head-note             /* 13px Right Grotesk, fg-56 */
.site-marquee-track-wrap            /* overflow hidden */
.site-marquee-track                 /* flex max-content, animation 120s linear infinite */
@keyframes site-marquee-scroll      /* 0% translate3d(0) → 100% translate3d(-50%) */

.site-marquee-item                  /* padding-right var(--marquee-gap) */
.site-marquee-item-mark             /* 28×28 svg slot */
.site-marquee-item-label            /* inline-flex baseline, 22px medium */
.site-marquee-item-parent           /* 11px, 70% currentColor */
.site-marquee-item-descriptor       /* 0.64em uppercase, opacity 0.5 */
```

**The seamless-loop trick:** the track is exactly **2× one copy's width**. Translating `-50%` lands the second copy's first item at position 0, so the next iteration starts at exactly the same visual state. Each item's `padding-right` (not flexbox `gap`) is what creates the spacing, because the `gap` would add an extra space at the seam.

`--marquee-gap` custom property: 128px (desktop) → 64px (`<768px`).

## Anchor portal — `.site-anchor`

Editorial pull quote + portal card grid. Single-consumer (one page uses this — the portal index).

```css
.site-anchor                  /* full-bleed surface-primary, page padding */
.site-anchor-pull             /* h2-like, clamp(48–96px), Right Grotesk 900 */
.site-anchor-pull-italic      /* italic 700 brand-primary */
.site-anchor-body             /* 18px Right Grotesk Text, 1.55 lh, fg-78 */
.site-anchor-nav              /* grid wrapper for portal cards */
.site-anchor-link             /* card: flex column, gap 8, padding 32/28, min-h 200 */
.site-anchor-link-num         /* mono 11px 600 0.14em, fg-48 */
.site-anchor-link-label       /* 28px Right Grotesk 700 */
.site-anchor-link-sub         /* 13px Right Grotesk Text 400, fg-56 */
.site-anchor-link-mark        /* absolute, rotated -8deg, opacity 0.1 — decorative */
.site-anchor-link--client     /* modifier: brand-primary label + mark */
```

**Known dead code:** `.site-anchor-link--client` is duplicated (rule block appears twice, identical). One copy should be removed.

## Signature ticker — `.site-sig`

```css
.site-sig         /* full-bleed surface-primary, mono 11px 0.12em uppercase, fg-56 */
.site-sig-sep     /* opacity 0.3 */
.site-sig-hex     /* mono fallback */
```

Bottom-of-page signature meta line. Single-consumer.

## Gallery — `.site-gallery`

Work-highlights carousel. Embla-driven (inferred from class structure).

```css
.site-gallery                    /* full-bleed surface-primary, padding-y page-y */
.site-gallery-title              /* clamp(32–56px) Right Grotesk 700 */
.site-gallery-title em           /* italic 700 brand-primary */
.site-gallery-note               /* 13px, fg-56, max-width 384px */
.site-gallery-viewport           /* overflow hidden, cursor grab */
.site-gallery-viewport:active    /* cursor grabbing */
.site-gallery-card               /* flex 0 0 clamp(280–440px), translateY(-4px) on hover */
.site-gallery-card-visual        /* aspect 4/5, brand-surface-deep bg */
.site-gallery-card-visual img    /* object-cover, scale-1.04 on card hover */
.site-gallery-card-kicker        /* mono 10px 600 0.14em, fg-48 */
.site-gallery-card-title         /* 20px Right Grotesk 700; brand-primary on hover */
.site-gallery-card-desc          /* 13px Right Grotesk Text, fg-64 */
.site-gallery-card-mark-overlay .ac-brand-logo  /* 44% width */
.site-gallery-card-letter        /* clamp(80–200px), weight 500, line-height 0.9 */
```

## Testimonial + FAQ — dead comments

Lines 527–529 carry comments saying these sections are "fully inlined in Testimonial.jsx / FAQ.jsx (Tailwind + DS classes)." No CSS rules follow. **These are breadcrumb comments from purged blocks.** Components confirmed inlined as of 2026-05-19 (FAQ + Testimonial CSS purge session). Remove the comments next time you're in this file.

## Site nav — `.ac-site-nav`

Top bar + mobile drawer.

```css
.ac-site-nav                     /* fixed top, z-50, grid 2-col, height 48px */
.ac-site-nav.is-center           /* 3-col variant */
.ac-site-nav.is-hidden           /* translateY(-100%) — for scroll-up-show pattern */
.ac-site-nav-hamburger           /* mobile hamburger, hidden >767px */
.ac-site-nav-link                /* opacity 0.55 on hover/focus-visible */
.ac-site-nav-backdrop            /* fixed inset, z-40, rgba(0,0,0,0.5), pointer-events:none */
.ac-site-nav-backdrop.is-open    /* opacity 1, pointer-events: auto */
.ac-site-nav-drawer              /* fixed top-right, width min(80vw,320px), z-45 */
.ac-site-nav-drawer.is-open      /* translateX(0) — slid in */
.ac-site-nav-drawer-inner        /* padding 64 28 28, height 100% */
```

`@media (max-width: 767px)`: nav switches to 2-col, hides cluster, shows hamburger + drawer.

## Site footer — `.ac-site-footer`

Five-column desktop grid, single-column mobile.

```css
.ac-site-footer            /* ac-color-absolute-black bg, on-primary color */
.ac-site-footer-grid       /* grid 1.4fr 1.2fr 1fr 1fr 1fr, padding 64 32 48, gap 48 */
.ac-site-footer-col        /* flex column gap 12 */
.ac-site-footer-mark       /* logo container, 140px width */
.ac-site-footer-label      /* mono 12px 500 0.1em uppercase, fg-48 */
.ac-site-footer-label--legal  /* margin-top 24 */
.ac-site-footer-list       /* flex column gap 8, list-style none */
.ac-site-footer-list li    /* color fg-80 */
.ac-site-footer-meta       /* mono 11px 400 0.06em, fg-56 */
.ac-site-footer-link       /* opacity 0.55 on hover */
.ac-site-footer-bottom     /* flex space-between, padding 24 32 */
```

`@media (max-width: 767px)`: grid collapses to 1-col, bottom flex-direction column.

## Product card overlay

Reveals hover overlay; touch devices show it always (no hover capability).

```css
.ac-product-card:hover [data-overlay]         { opacity: 1; }
.ac-product-card:focus-within [data-overlay]  { opacity: 1; }

@media (hover: none) {
  .ac-product-card [data-overlay]             { opacity: 1; }
}
```

## Newsletter row + support CTA

Layout-only rules — flex direction, gap, responsive collapse.

```css
.ac-site-newsletter-row              /* flex gap 12 side-by-side */
.ac-site-newsletter-submit           /* flex-shrink 0, min-h 44 */

@media (max-width: 479px) {
  .ac-site-newsletter-row            /* flex-direction column, gap 16 */
  .ac-site-newsletter-submit         /* width 100% */
}

.ac-site-support-cta-actions         /* flex gap 12 */
@media (max-width: 479px) { ... }    /* column, full-width, max-w 320 */
```

## Custom properties declared here

```css
--mask-x         /* used by .site-mark-wipe for GSAP-driven mask animation */
--marquee-gap    /* 128px desktop / 64px mobile, used by .site-marquee-track + items */
```

## Variables consumed

`--ac-surface-primary` / `-secondary`, `--ac-surface-on-primary`, `--ac-color-absolute-black`, `--ac-font-family-mono`, `--brand-primary`, `--brand-surface-deep`, `--ac-fg-08/16/24/48`, `--ac-pad-page-y` / `-page-x`.

## Gotchas

- **Full-bleed depends on `scrollbar-gutter: stable`.** Without it, scrollbar appearance shifts layout when sections become tall enough to scroll.
- **Marquee track width must equal exactly 2× one copy.** Rounding errors break the seamless loop. Pad with `padding-right`, not `gap`.
- **Breakpoint inconsistency.** Nav/footer use `<767px`. Newsletter/CTA use `<479px`. Marquee uses `<767px`. No single "mobile breakpoint" — varies by section.
- **`pointer-events: none`** pervasive on decorative overlays (intro-bg, intro-veil, mark-halo, anchor-link-mark) so interactive elements beneath remain clickable.
- **GSAP timeline contract.** Class names like `.site-mark-wipe`, `.site-word-char`, `.site-pullline-item` are referenced by JavaScript. Renames cascade — update both sides.

## Audit — observed smells

1. **`.site-anchor-link--client` duplicated.** Two identical rule blocks. Remove one.
2. **Dead Testimonial / FAQ breadcrumb comments** (lines 527–529). Remove.
3. **Single-consumer CSS** — `.site-anchor-*`, `.site-gallery-*`, `.site-sig-*`, `.site-intro-*` are bespoke to one section each. They're justified by animation/full-bleed reasons, BUT the `.site-anchor-link-num` / `.site-gallery-card-kicker` / `.site-marquee-kicker` rules **reinvent `.ac-helper-N` from [[../02-tokens/05-typography-mono|typography-mono]]**. `.site-anchor-link-num { font-size: 11px; letter-spacing: 0.14em; uppercase; }` is literally `.ac-helper-12 uppercase tracking-wider`. Migration target.
4. **Hardcoded font families** (`Right Grotesk Wide`, `Right Grotesk Compact`, `Right Grotesk Text`) bypass the DS font tokens. `Wide` isn't tokenized; `Compact` is `--ac-font-family-sans-compact`; `Text` is loaded but not tokenized. Either add tokens or accept the hardcoding.

## When to edit this file

- **New animation-bound landing section** — add the bespoke chrome here, document the GSAP contract.
- **New full-bleed marketing section** — add to the `width: 100vw` selector list at the top.
- **Site nav / footer layout change** — those classes are correctly here (they're site chrome, not DS).

**Don't** add component variants (those are [[../04-components/INDEX|components]]), don't add general layout (that's [[../05-framework|framework]]), don't reinvent typography (use [[../02-tokens/05-typography-mono|`.ac-helper-N`]] and [[../02-tokens/04-typography|`.ac-sans-*`]] classes).
