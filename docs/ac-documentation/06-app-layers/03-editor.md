---
title: editor.css
type: reference
status: active
updated: 2026-05-19
verified: 2026-05-19
description: Styleguide editor shell. Three-column layout (left rail / canvas / right rail), compose rail panels, layer rows with drag-and-drop, inspector body, canvas grid backdrop + checkerboard.
aliases:
  - editor
  - editor-shell
tags:
  - project/acyr
  - domain/css
  - editor/shell
audience: internal
covers:
  - .ac-editor-shell / -grid / -left / -right / -canvas-column / -canvas / -rail-header / -rail-body
  - .ac-compose-rail / -head / -add
  - .ac-compose-layer-line / -collapse / -row / -main / -swatch / -btn-icon / -mini
  - drop indicators (.is-drop-above / .is-drop-below)
  - .ac-compose-inspector-body / -placeholder
  - .ac-grid-bg (ruled grid backdrop)
  - .ac-checker (transparency checkerboard, currently unused)
sources:
  - apps/styleguide/src/editor/styles/editor.css
related:
  - "[[INDEX|app-layers]]"
  - "[[04-color-panel|color-panel]]"
  - "[[../05-framework|framework]]"
---

# editor.css

The styleguide's brand-token editor — a three-column workspace (left rail, canvas, right rail) for live editing brand colors, type tokens, layer composition. Loaded only inside the editor surface; doesn't affect the rest of the styleguide.

**297 lines.** Mostly layout primitives and stateful chrome for the layer-stack interaction (drag, drop, hide, lock).

## Shell layout

```css
.ac-editor-shell           /* full-viewport flex, height 100dvh, user-select: none */
.ac-editor-grid            /* 3-col grid: 320px | minmax(0,1fr) | 320px */
.ac-editor-left            /* fixed 320px rail, flex column, min-h 0 */
.ac-editor-right           /* fixed 320px rail, flex column, min-h 0 */
.ac-editor-canvas-column   /* canvas-area wrapper, min-h 0, min-w 0 */
.ac-editor-canvas-header   /* flex-shrink 0 header (collapses when empty) */
.ac-editor-canvas          /* main render surface, background #0E0E11 (hardcoded) */

.ac-editor-rail-header     /* flex-shrink 0 rail header (collapses when empty) */
.ac-editor-rail-body       /* flex-grow scrollable container */
```

**Critical `min-height: 0` rule** on rail/canvas grid items overrides flexbox default `min-height: auto`, allowing internal overflow-y scrolling to work. Drop it and rails will overflow their containers.

**`user-select: none` globally**, with text inputs / textareas / contenteditable re-enabling `user-select: text`. Prevents accidental text selection during drag-and-drop.

**Canvas background `#0E0E11` is hardcoded**, not a DS token. Intentional — render surface needs high contrast to on-canvas designs regardless of theme.

## Cursor inheritance for non-select tools

```css
[data-tool]:not([data-tool="select"]) [data-layer-id] {
  cursor: inherit !important;
}
```

Override inline `cursor: 'move'` when a non-select tool is active. The `!important` is deliberate.

## Empty header / body collapse

```css
.ac-editor-rail-header:empty   { display: none; }
.ac-editor-canvas-header:empty { display: none; }
```

Prevents border-stacking when no panels are mounted.

## Single-panel height override

```css
.ac-editor-rail-body > .ac-compose-rail:first-child:last-child {
  /* prevent single occupant from claiming 100% height */
}
.ac-editor-rail-body .ac-compose-rail { height: auto; }
```

So multi-panel stacks (e.g., inspector + tokens) coexist properly.

## Compose rail — panel container

```css
.ac-compose-rail        /* flex column, full-height by default */
.ac-compose-rail-head   /* flex row space-between, padding 16/16/8, border-top */
.ac-compose-rail-add    /* margin-top auto, padding 16, border-top — bottom action area */
```

First child's `.ac-compose-rail-head` border-top is suppressed (otherwise stacks visually).

## Layer rows (drag-and-drop tree)

The interactive heart of the editor — layer stack with collapse, hide, lock, drag-reorder.

```css
.ac-compose-layer-line      /* row container: [chevron-or-spacer] [layer-row pill] */
.ac-compose-layer-collapse  /* 16×16 chevron button — color fg-64 → on-primary on hover */
.ac-compose-layer-nest      /* padding-left 16 — visual hierarchy nesting */

.ac-compose-layer-row       /* main pill: flex, padding 4 60 4 8 (60px reserves for lock/eye), cursor grab */
.ac-compose-layer-row:hover      /* bg fg-04, color on-primary */
.ac-compose-layer-row.is-active  /* same as hover */
.ac-compose-layer-row.is-hidden  /* opacity 0.45 */
.ac-compose-layer-row.is-dragging  /* opacity 0.4, cursor grabbing */

[draggable]:active          /* cursor grabbing while dragging */
```

### Drop indicators

```css
.is-drop-above::before    /* 2px accent line at top of row, z-index 1 */
.is-drop-below::after     /* 2px accent line at bottom of row, z-index 1 */
```

Pure CSS feedback — JS toggles the `.is-drop-above/-below` class on the target during drag-over.

### Layer row inner anatomy

```css
.ac-compose-layer-main      /* flex row gap 8, holds swatch + icon + label */
.ac-compose-layer-swatch    /* 18×18 square, 2px radius, 1px fg-08 border — color thumb */
.ac-compose-layer-btn-icon  /* 18×18 icon slot */
.ac-compose-layer-mini      /* 22×22 mini button (lock, eye) */
.ac-compose-layer-mini:hover  /* color on-primary, bg fg-08 */
```

The right padding of `60px` on `.ac-compose-layer-row` reserves space for absolutely-positioned lock/eye buttons. Changing their width requires adjusting this padding.

## Inspector body

```css
.ac-compose-inspector-body  /* flex-grow, padding 20 16, overflow-y auto */
.ac-compose-placeholder     /* empty state, padding 0 */
```

Hosts property inputs for the selected layer.

## Canvas patterns

### `.ac-grid-bg` — ruled alignment grid

```css
.ac-grid-bg {
  --ac-grid-step: 32px;
  --ac-grid-major-every: 4;     /* major line every 4 cells → 128px */
  --ac-grid-minor: color-mix(in srgb, var(--ac-surface-on-primary) 2%, transparent);
  --ac-grid-major: color-mix(in srgb, var(--ac-surface-on-primary) 4%, transparent);
  background-image: <4-layer gradient stack: major V, major H, minor V, minor H>;
}
```

Faint two-tier alignment grid on the canvas. Sized via `--ac-grid-step` custom property; major lines every fourth step.

### `.ac-checker` — Photoshop-style transparency

```css
.ac-checker {
  --ac-checker-c1: ...;
  --ac-checker-c2: var(--ac-surface-primary);
  --ac-checker-size: 16px;
  background-image: <4-layer gradient: 45deg + -45deg diagonal pairs>;
}
```

**Currently unused.** Retained for potential future canvas modes or external embedding.

## Variables consumed

`--ac-surface-primary`, `--ac-surface-on-primary`, `--ac-fg-04/08/48/64`, `--ac-accent-primary`. Hardcoded `#0E0E11` canvas bg.

## Gotchas

- **`min-height: 0` flex bug fix.** On grid items + flex-grow rail bodies. Critical for overflow-y to work.
- **`user-select: none` globally**, re-enabled on text inputs / textareas / contenteditable.
- **Cursor `!important` override** for non-select tools.
- **Drop indicator z-index 1.** Ensures the 2px line sits above row content but below absolutely-positioned mini buttons.
- **60px right padding on `.ac-compose-layer-row`** reserves for lock/eye buttons. Resize them, resize this.
- **Canvas background not tokenized.** `#0E0E11` is hardcoded; theme changes won't follow.

## What's bespoke vs reusable

Everything here is editor-specific. The classes don't appear in the website or other styleguide pages.

The `.ac-grid-bg` and `.ac-checker` patterns could in principle be promoted to [[../03-utilities/01-utilities|utilities]] if a non-editor consumer wants them. As of 2026-05-19, neither has cross-app consumers.

## What this file does NOT contain

- **No color picker.** That's [[04-color-panel|color-panel.css]] — a self-contained modal with its own scoped tokens.
- **No DS overrides.** Editor sits alongside the DS, not on top of it for component reuse.

## When to edit this file

- **Adding a new editor pane** (e.g., a third rail, a bottom dock) — extend the grid + add the matching shell class.
- **Adding a new layer-row interaction** (rename inline, multi-select, etc.) — extend the layer row state classes.
- **Adjusting drag-drop visual feedback** — `.is-drop-*` indicator styling.

Don't add general-purpose chrome here. Editor classes should not be reached for outside the editor surface.
