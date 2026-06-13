---
title: framework.css
type: reference
status: canonical
updated: 2026-05-19
verified: 2026-05-19
description: Page scaffold + structural layout. Sidenav layout (full / rail / drawer modes), .ac-page container, .ac-grid, fullscreen overlay, Embla carousel chrome, logo containers, exit-preview, code block, scroll-reveal hook, portal footer, back link.
aliases:
  - framework
  - page-scaffold
tags:
  - project/acyr
  - domain/css
  - domain/design-system
  - domain/layout
covers:
  - root padding + container + sidenav width custom properties (responsive at 768/1024/1280)
  - .ac-brand-layout grid shell + sidenav drawer mode (<768px)
  - .ac-page / .ac-page-hero / .ac-page--fullbleed
  - .ac-grid (4→2→1 col responsive)
  - .ac-overlay / .ac-overlay-sheet / .ac-overlay-close (modal)
  - .ac-embla-* (carousel chrome — viewport, container, slide, controls, btn)
  - .ac-brand-logo + .ac-logomark containers
  - .ac-exit-preview floating button
  - .ac-portal-footer
  - .ac-back-link
  - .ac-codeblock + .ac-codeblock-lang + .ac-codeblock-copy
  - [data-reveal] / .is-revealed scroll animation hook
sources:
  - packages/ds/framework/framework.css
related:
  - "[[INDEX|ac-documentation]]"
  - "[[01-cascade|cascade]]"
  - "[[04-components/01-atoms|atoms]]"
  - "[[06-app-layers/01-site|site]]"
---

# framework.css

The page-scaffold layer. Owns layout decisions that span the entire page — sidenav, page containers, grids, overlays, carousels, footers. Loads last in the DS cascade so it can override component-layer defaults at equal specificity.

This is where you reach for **structural** chrome — not for component variants (those are [[04-components/01-atoms|atoms]] / [[04-components/02-molecules|molecules]]).

## Root configuration

Custom properties declared at `:root` that the rest of the layout consumes:

```css
--ac-topnav-h           /* 0px — reserved for top nav height (currently unused) */
--ac-sidenav-w          /* 260px (or 56px when collapsed) */
--ac-sidenav-w-collapsed /* 56px */

--ac-container-max      /* 100% (mobile) → 1400px (1024+) → 1600px (1280+) */

--ac-t-btn              /* button transition shortcut: bg/color/border 200ms ease */

--ac-pad-page-x         /* 20px / 32px / 56px — page horizontal padding */
--ac-pad-page-y         /* 64px / 96px / 128px — page vertical padding */
--ac-pad-section-x      /* 20px / 32px / 48px — section horizontal */
--ac-pad-section-y      /* 48px / 64px / 80px — section vertical */
--ac-pad-band-y         /* 56px / 80px / 104px — full-bleed band vertical */
```

Sidenav collapses via `:root[data-sidenav="collapsed"]`. Responsive steps at 768 / 1024 / 1280.

## Brand layout — sidenav grid shell

```css
.ac-brand-layout         /* grid: [sidebar] [content] */
.ac-sidenav              /* sticky sidebar */
.ac-sidenav-toggle       /* collapse/expand button */
.ac-sidenav-body         /* expanded body (hidden in rail mode) */
.ac-sidenav-backdrop     /* mobile drawer overlay */
.ac-sidenav-hamburger    /* mobile drawer trigger */
```

### Three responsive modes

| Viewport | Behaviour |
|---|---|
| **`>1024px`** — full mode | Sidebar 260px, toggle visible, all labels + body shown |
| **768–1024px** — rail mode | Sidebar collapses to 56px; user pref ignored at this width |
| **`<768px`** — drawer mode | Sidebar `position: fixed`, `transform: translateX(-100%)`; `.is-drawer-open` slides in over 220ms; backdrop appears via `[data-drawer-open="true"]` |

User collapse preference (stored in localStorage by JS) is honored only at `>1024px`. The CSS forces collapse at tablet breakpoint regardless.

### Sidenav row primitives

`.ac-sidenav-hop`, `.ac-sidenav-hop-icon`, `.ac-sidenav-hop-label`, `.ac-sidenav-group` were promoted to [[04-components/01-atoms|atoms.css]] on 2026-04-30. The responsive cascade rules (`.is-collapsed`, `.is-drawer-open`) still live here in framework.

## Page scaffold

```css
.ac-page                 /* centered container, max-width var(--ac-container-max), section padding */
.ac-page-hero            /* min-height 72dvh, flex column, left-aligned content */
.ac-page--fullbleed      /* override: 100vh, max-width none, zero horizontal padding */
.ac-page-section         /* implicit PageSection.jsx — flex column, gap-8 */
```

`PageSection.jsx` applies `.ac-page-section`. Owns its own gap; children should NOT declare `mt-*`. If you find a `<PageSection>` child with margin-top, that's a bug.

`.ac-page-section-divider` was promoted to [[04-components/01-atoms|atoms.css]].

## 4-column grid

```css
.ac-grid              /* repeat(4, 1fr), gap 1.5rem */
.ac-grid--tight-y     /* row-gap override to 0.75rem */
```

Responsive: 4 cols (`>768px`) → 2 cols (480–768) → 1 col (`<480px`). Children control their footprint with Tailwind `col-span-*` / `row-span-*`.

## Fullscreen overlay — `.ac-overlay`

Modal / image-expansion overlay.

```css
.ac-overlay              /* fixed inset-0, z-index var(--ac-z-modal, 100) */
.ac-overlay-sheet        /* centered modal container, max-width var(--ac-container-max) */
.ac-overlay-sheet img    /* max-height 90vh, object-fit contain */
.ac-overlay-close        /* X button, top-right, 40×40px, border 32% opacity on hover */
```

Paired with `FullscreenOverlay.jsx`. The JS handles `document.body.style.overflow = 'hidden'` on open + restoration on close. CSS doesn't enforce overflow lock — the contract is JS-managed.

## Carousel — Embla chrome

```css
.ac-embla                       /* outer wrapper, overflow hidden */
.ac-embla-viewport              /* Embla viewport (overflow hidden) */
.ac-embla-container             /* flex row, gap 16px */
.ac-embla-slide                 /* flex 0 0 auto, width clamp(260px, 32vw, 420px) */
.ac-embla.is-slides .ac-embla-slide  /* wider variant: clamp(320px, 72vw, 900px) */

.ac-embla-controls              /* button row (flex-end) */
.ac-embla-btn                   /* prev/next, 40×40px */
.ac-embla-btn:disabled          /* opacity 0.3, cursor not-allowed */
```

Used by `Carousel.jsx` (Embla wrapper). The JS controls `disabled` state on buttons.

## Logo containers

```css
.ac-brand-logo       /* inline-flex, line-height 0 (kills SVG baseline jitter) */
.ac-brand-logo svg   /* display block, 100% width, height auto */

.ac-logomark         /* inline-flex, line-height 0 */
.ac-logomark svg     /* display block, height 100%, width auto */
```

Two purposes: `.ac-brand-logo` scales with width (lockup variants), `.ac-logomark` scales with height (mark-only variants). The `line-height: 0` is load-bearing — without it, SVGs pick up text baseline and render with phantom bottom padding.

## Exit preview — floating debug button

```css
.ac-exit-preview          /* fixed bottom-left (24/24), 48px height, z-index 9999 */
.ac-exit-preview-icon     /* 48×48 icon slot */
.ac-exit-preview-label    /* max-width 0 at rest, expands to 120px on hover */
```

`z-index: 9999` is hardcoded — this button is intentionally above everything (overlay, modals, drawer). The label animates open on hover via `max-width` transition.

## Portal footer

```css
.ac-portal-footer        /* flex column center, padding 48 24, border-top */
.ac-portal-footer p      /* margin reset */
.ac-portal-footer a      /* opacity transition; 0.8 on hover */
```

Used by `PortalFooter.jsx`. Minimal centered wordmark + year. Distinct from the main marketing `Footer.jsx` (which lives in [[06-app-layers/01-site|site.css]]).

## Back link

```css
.ac-back-link    /* inline-flex, gap 8px, margin-bottom 32px */
```

Structural container only. Typography is applied via Tailwind + DS utilities in JSX (`ac-helper-12 uppercase tracking-widest text-body hover:text-emphasis`).

## Code block — Markdown / Portable Text

```css
.ac-codeblock              /* relative wrapper, 1px fg-16 border, 4px radius */
.ac-codeblock pre          /* padding 20px 24px, mono 13px, line-height 1.55, overflow-x auto */
.ac-codeblock pre code     /* inherit font, zero padding, no bg/border */
.ac-codeblock-lang         /* absolute top-left language label */
.ac-codeblock-lang + pre   /* bumps pre padding-top to 32px to clear label */
.ac-codeblock-copy         /* absolute top-right copy button */
```

Used by markdown / Portable Text renderers in `BlogBody.jsx` and similar.

## Scroll reveal hook

```css
[data-reveal]               /* opacity 0, translateY(12px), transition 600ms ease both */
[data-reveal].is-revealed   /* opacity 1, transform none */
```

CSS half of an Intersection Observer reveal pattern. JS toggles `.is-revealed` when an element scrolls into view. No animation library required.

## Variables consumed

`--ac-surface-primary` / `-secondary` / `-inverse` / `-on-inverse`, `--ac-fg-04/08/16/40/48/64`, `--brand-primary` / `-on-primary` (text-selection highlight), `--ac-font-family-mono`, `--ac-z-modal`, `--ac-radius-sm`, `--ac-accent-primary`.

## Gotchas

- **Z-index stacking.** `.ac-overlay` uses `--ac-z-modal` (100). `.ac-exit-preview` hardcodes 9999. Mobile hamburger toggle is 30, sidenav backdrop 20, sidenav itself 20. If you raise `--ac-z-modal` above 30 you'll trap the hamburger under the overlay.
- **Mobile sidenav drawer.** Position `fixed`, transform `translateX(-100%)` at rest, `.is-drawer-open` slides in over 220ms. Width clamped to `min(80vw, 280px)`.
- **Sidenav user preference at 768–1024px is ignored** — CSS forces collapsed regardless. JS restores user preference once viewport crosses back over 1024px.
- **`.ac-grid` gap is raw rem** (1.5rem / 0.75rem), not Tailwind spacing. Don't ad-hoc-override.
- **`color-mix` with `currentColor` fallback** is used throughout for SVG-color compatibility (icons inside buttons inherit color from parent).
- **`border-radius` cap = 4px** is repo-wide. `.ac-embla-btn`, `.ac-overlay-close`, `.ac-codeblock` all comply. Don't exceed.
- **No `backdrop-filter`** on overlays. Background-darken is solid opacity, not frosted-glass. Performance + compatibility trade-off.

## What this file does NOT define

- **No button styling.** That's [[04-components/01-atoms|atoms.css]].
- **No bespoke per-page chrome.** That's [[06-app-layers/INDEX|app-layers]].
- **No tokens.** Page padding tokens declared here are framework-scoped — they reference scale primitives from [[02-tokens/01-theme|theme.css]].

## When to edit this file

- **Adjusting page padding rhythm** — edit `--ac-pad-*` custom properties.
- **Adjusting container max-widths** — edit `--ac-container-max` steps.
- **Adding a new structural pattern** (multi-column layout, side-by-side article+aside, etc.) — register the classes here.

If you're adding component chrome (buttons, inputs, badges) — that's [[04-components/INDEX|components]]. If you're adding per-page bespoke styles — that's [[06-app-layers/INDEX|app-layers]].
