---
title: color-panel.css
type: reference
status: active
updated: 2026-05-19
verified: 2026-05-19
description: Self-contained macOS-style color picker modal. 14 scoped --cp-* tokens, fully bespoke styling, zero DS integration. Portable across contexts.
aliases:
  - color-panel
  - color-picker
tags:
  - project/acyr
  - domain/css
  - editor/color-panel
audience: internal
covers:
  - 14 scoped --cp-* tokens (panel, line, text, dim, mute, current)
  - .ac-color-panel root container + tabs row + close button + divider + tab
  - .ac-color-panel-swatch-stack / -ring (front/back) / -swap / -none / -eyedrop-swatch
  - .ac-color-panel-mode-select / -mode-menu / -mode-item
  - hue mode (hue strip + S/B square)
  - wheel mode (color wheel + triangle picker)
  - shared handles (.ac-color-panel-handle, .is-hue, .is-tri)
  - sliders mode (.ac-color-panel-slider-track + -num-input + -pal-strip)
  - opacity row (.ac-color-panel-op-track + -op-handle + -op-input)
  - stroke segmented control (.ac-color-panel-seg / -seg-opt)
  - swatches tab (-recent / -pal-select / -tool-btn / -sw-grid-cell / -search-input)
  - helper labels (.ac-color-panel-uplabel, -chev-y)
sources:
  - apps/styleguide/src/editor/color/color-panel.css
related:
  - "[[INDEX|app-layers]]"
  - "[[03-editor|editor]]"
---

# color-panel.css

A self-contained color picker — a macOS-style floating modal with hue/saturation, wheel, sliders, and palette tabs. **Zero DS integration.** Defines its own 14-variable token system (`--cp-*`) and a complete set of bespoke classes.

**Ported from a static HTML artifact** — the file's header points at `_tmp/_components-2import/color modal/Color Panel.html`. Treat as a self-contained widget that happens to live in this repo; don't try to teach it about the DS unless that's the explicit task.

**406 lines.** Larger than [[03-editor|editor.css]] because a color picker has many modes and many handles.

## Scoped tokens — `--cp-*`

All hardcoded hex / HSL, no DS inheritance:

```css
--cp-panel       #1a1a1a   /* primary background */
--cp-panel-2     #161616   /* darker variant — tabs row, segmented control */
--cp-panel-3     #222222   /* lighter variant — mode menu, input bg */
--cp-line        #2a2a2a   /* primary border */
--cp-line-2      #333333   /* secondary border */
--cp-text        #d4d4d4   /* foreground */
--cp-dim         #8a8a8a   /* dimmed text — inactive tab */
--cp-mute        #6a6a6a   /* muted text — icons */
--cp-current     #00689b   /* current/selected color (blue highlight) */
```

If DS theme tokens change, this panel won't follow. That's intentional — the picker is a portable widget.

## Panel container

```css
.ac-color-panel              /* 360px wide, flex column, --cp-panel bg, 1px --cp-line border, 4px radius */
.ac-color-panel-tabs         /* row container, --cp-panel-2 bg, border-bottom */
.ac-color-panel-close        /* 11×11 circular X button — pseudo-elements form the X */
.ac-color-panel-divider      /* 1px × 14px vertical separator */
.ac-color-panel-tab          /* 11px uppercase 0.04em, cursor pointer */
.ac-color-panel-tab.is-active  /* active: --cp-text color, underline via ::after */
```

Box-shadow uses dual-layer (drop + inset highlight) for macOS panel depth.

## Swatch stack — front/back color rings

```css
.ac-color-panel-swatch-stack  /* 56×40px container */
.ac-color-panel-ring          /* 30×30 circle, 1px --cp-line-2 border */
.ac-color-panel-ring.is-back  /* positioned right/top */
.ac-color-panel-ring.is-front /* positioned left/bottom, z-index 2, --cp-current bg */
.ac-color-panel-swap          /* 14×14 icon between rings — swap indicator */
.ac-color-panel-none          /* 12×12 white circle with red diagonal slash — "no color" state */
.ac-color-panel-eyedrop-swatch  /* 12×12 sampled-color preview */
```

## Mode select dropdown

```css
.ac-color-panel-mode-select  /* relative, --cp-panel-3 bg, 11px text — dropdown trigger */
.ac-color-panel-mode-menu    /* absolute, top calc(100%+4), z-10, --cp-panel-3 bg */
.ac-color-panel-mode-item    /* padding 5 10, 11px, --cp-dim color */
.ac-color-panel-mode-item:hover  /* bg #2a2a2a, color --cp-text */
.ac-color-panel-mode-item.is-active::before  /* prepends "✓ " checkmark */
```

## Hue mode

```css
.ac-color-panel-hue   /* 14px tall, 2px radius, full-spectrum linear-gradient — drag for hue */
.ac-color-panel-sb    /* aspect-ratio 1/0.7, dual gradient (white→cyan + transparent→black) — drag for saturation+brightness */
```

## Wheel mode

```css
.ac-color-panel-wheel-wrap   /* relative, aspect 1/1, grid place-items center */
.ac-color-panel-wheel        /* 92% width, radial+conic gradient — outer ring with transparent center */
.ac-color-panel-triangle-wrap  /* absolute 53% × 53% in wheel center */
.ac-color-panel-triangle     /* clip-path triangle, dual gradient — saturation+brightness */
```

## Shared handles

```css
.ac-color-panel-handle           /* 12×12 white circle, 1px black outline shadow — pointer-events:none */
.ac-color-panel-handle.is-hue    /* 14×14 larger for hue strip */
.ac-color-panel-handle.is-tri    /* 10×10 smaller for triangle */
```

`pointer-events: none` so handles don't intercept clicks — the parent track is the real drag target.

## Sliders mode

```css
.ac-color-panel-slider-track  /* 12px tall, linear gradient — single-value slider */
.ac-color-panel-num-input     /* numeric input, --cp-panel-3 bg, --cp-text */
.ac-color-panel-pal-strip     /* 56px tall, dual gradient (hue + alpha) — 2D palette preview */
```

## Opacity row

```css
.ac-color-panel-op-track          /* 12px tall, checkerboard background-image + opacity gradient ::after */
.ac-color-panel-op-handle         /* 12×12 circle handle, pointer-events default (interactive) */
.ac-color-panel-op-input          /* numeric percent input */
```

Checkerboard is 8×8px cells of `#2a2a2a` on `#1a1a1a`. Conceptually similar to [[03-editor|`.ac-checker`]] in editor.css but with literal colors instead of `color-mix()`.

## Stroke segmented control

```css
.ac-color-panel-seg              /* flex, --cp-panel-2 bg, 1px --cp-line-2 border */
.ac-color-panel-seg-opt          /* flex 1, 5px padding, --cp-dim — option */
.ac-color-panel-seg-opt:hover    /* color --cp-text */
.ac-color-panel-seg-opt.is-active  /* bg #2a2a2a, color --cp-text */
```

## Swatches tab

```css
.ac-color-panel-recent        /* 22px tall, linear-gradient with 6 hardcoded stops — recent colors strip */
.ac-color-panel-pal-select    /* flex 1, --cp-panel-3 bg — palette source dropdown */
.ac-color-panel-tool-btn      /* 24×24 grid place-center — add/delete/eyedropper */
.ac-color-panel-tool-btn:hover  /* color --cp-text */
.ac-color-panel-sw-grid-cell  /* aspect 1, 2px radius, subtle border — swatch tile */
.ac-color-panel-sw-grid-cell:hover  /* 1px outline at --cp-text, offset 1 */
.ac-color-panel-search-input  /* transparent bg, --cp-text — filter input */
```

## Helper labels

```css
.ac-color-panel-uplabel    /* 10px 0.08em uppercase, --cp-mute — eyebrow */
.ac-color-panel-chev-y     /* flex column 1px gap, --cp-mute — up/down increment buttons */
```

## Variables consumed

Only the 14 scoped `--cp-*` tokens. No DS tokens at all.

## Gotchas

- **All 14 tokens are hardcoded hex.** No DS theme integration. Adopting the panel into a light-mode context would require re-skinning the scoped tokens.
- **Z-index 10 on mode menu** — relative to the panel's stacking context. No global stacking issue.
- **Handles use `pointer-events: none`** so they don't intercept clicks on the drag track behind them.
- **Aspect ratios** — SB square uses `1/0.7`, wheel wrap and triangle wrap use `1/1`. Width is responsive to parent.
- **Checkerboard hardcoded colors** — `#2a2a2a` on `#1a1a1a` for the opacity track. Won't follow DS theme changes.
- **Font is `ui-monospace`** (with JetBrains Mono / Menlo fallback chain), not `var(--ac-font-family-mono)`. Aligns with developer-tool aesthetic.

## Audit — observed smells

1. **No DS integration.** Could share `--ac-fg-*` or `--ac-surface-*` for at least the panel background. Trade-off: stays portable as a self-contained widget. Decide based on whether the panel needs to follow brand theme.
2. **`.ac-color-panel-num-input` ↔ `.ac-color-panel-op-input`** — nearly identical. Could be a single `.ac-color-panel-input` class with width variants.
3. **`.ac-color-panel-recent` hardcoded gradient** — six color stops baked into the rule. Likely a placeholder awaiting JS-driven content (real recent-colors data). Verify how this surfaces in production.

## When to edit this file

- **Adding a new picker mode** (gradient, multi-stop) — extend with new mode classes.
- **Reskinning the panel** (light theme variant) — duplicate the scoped tokens with a `.ac-color-panel--light` variant.
- **Integrating with DS** — replace scoped tokens with `--ac-*` references. Significant work; do only if the panel needs to follow brand theme.

If the panel needs to be reused outside the styleguide editor, the self-contained design helps — drop the file into a new app, mount the component, done.
