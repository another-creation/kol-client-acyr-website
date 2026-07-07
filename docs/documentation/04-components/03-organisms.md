---
title: organisms.css
type: reference
status: canonical
updated: 2026-05-19
verified: 2026-05-19
description: Table organism. Wrapper, head, row, cells (title/text/meta/meta-strong), inline content (pill / token / meta), simple variant. Applied by Table.jsx automatically — consumers only pass custom classes via column props.
aliases:
  - organisms
  - table
tags:
  - project/acyr
  - domain/css
  - domain/components
covers:
  - .ac-table-wrapper / -table / -thead / -row structural classes
  - .ac-table-cell-title / -text / -meta / -meta-strong cell classes
  - .ac-table-meta / -pair / -pill / -token inline content classes
  - .ac-table--simple variant
  - inline code + link styling inside table cells
sources:
  - packages/ds/components/organisms.css
related:
  - "[[INDEX|components]]"
  - "[[01-atoms|atoms]]"
  - "[[02-molecules|molecules]]"
---

# organisms.css

One organism: Table. The classes are applied by `Table.jsx` automatically. Consumers pass custom classes only via column.className and column.headerClassName props — direct className composition is rare.

## Structural classes (Table.jsx applies)

```css
.ac-table-wrapper    /* overflow-x auto, hides scrollbar, 1px fg-08 border, 4px radius */
.ac-table            /* the <table>, 100% width, mono 0.8125rem font, 1.5 lh */
.ac-table-thead      /* fg-04 bg, 1px fg-08 border-bottom */
.ac-table-row        /* 1px fg-08 border-bottom, vertical-align top; last row no border */
```

The wrapper hides scrollbars via `scrollbar-width: none` + webkit pseudo-element — content stays scrollable but the affordance is invisible. Provide alternative discovery cues (faded edges, "+ more" UI) when relevant.

## Cell classes (column.className / column.headerClassName)

Set via column definition in Table.jsx — the className gets applied to every `<th>` or `<td>` in that column.

```css
.ac-table-cell-title          /* header cell: 0.75rem, weight 400, uppercase, nowrap */
.ac-table-cell-text           /* default body: 0.75rem, weight 400, 1.4 lh, fg-64, nowrap */
.ac-table-cell-meta           /* wrapping description: 0.625rem, normal wrap, max-width 24rem */
.ac-table-cell-meta-strong    /* same as -meta, full opacity */
```

**Cell padding is on these classes**, not on `<th>`/`<td>` directly. So a raw `<th>` with no class will have content flush to the border. Table.jsx must apply a class on every cell.

## Inline content classes (use inside cell render functions)

These don't apply cell padding — they assume they're nested inside a padded cell.

```css
.ac-table-meta              /* meta label: 0.625rem, 1.3 lh, fg-64, normal wrap, max-width 24rem */
.ac-table-meta-strong       /* same as -meta, full opacity */

.ac-table-pair              /* key-value container, 18rem min-width */

.ac-table-pill              /* inline pill: 2px 12px padding, 9999px radius, 0.75rem */
.ac-table-pill-light        /* secondary surface bg */
.ac-table-pill-muted        /* fg-16 bg */
.ac-table-pill-dark         /* on-primary bg, primary text (inverted) */

.ac-table-token             /* inline code-token badge: 2px 4px padding, 2px radius, 0.75rem */
```

The `.ac-table-pill-*` variants exist parallel to [[02-molecules|`.pill-*`]] but are table-scoped (smaller, optimised for inside cells).

## Variants

```css
.ac-table--simple    /* borderless wrapper, flush, no column dividers */
```

Use for borderless grids inside cards or detail panels.

Specifically, `.ac-table--simple` removes:
- wrapper border + radius
- column dividers (the `border-right` between cells)
- the `padding-inline-start` on first-column cells
- the `padding-inline-end` on last-column cells

And lightens the thead border from fg-08 → fg-12.

## Inline styling inside cells

```css
.ac-table code           /* 11px, fg-80 color, 2px 5px padding, fg-08 bg, 3px radius */
.ac-table a              /* fg-88 color, underline, 1px thickness, 2px offset */
.ac-table a:hover        /* color: accent-primary */
```

Inline code blocks render like small badges inside cells. Links are explicitly styled (not Tailwind-driven) to avoid browser defaults.

## Variables consumed

`--ac-fg-04/08/12/16/64/80/88`, `--ac-surface-primary`, `--ac-surface-secondary`, `--ac-surface-on-primary`, `--ac-surface-on-secondary`, `--ac-accent-primary`, `--ac-font-family-mono`, `--ac-border-default`.

## Gotchas

- **Cell padding is on cell classes, not th/td.** Raw cells = no padding = content flush. Always apply a class.
- **Column dividers via `border-right` on every cell.** The `:not(:last-child)` logic handles the last column; custom column classes that override `border-right` may break it.
- **Hidden scrollbars.** `scrollbar-width: none` + `::-webkit-scrollbar { display: none }` makes wide tables scrollable without affordance. Add a discoverability cue when content extends past viewport.
- **Max-width 24rem on `.ac-table-cell-meta`** forces line breaks on long text. Intentional — prevents extremely wide cells. Wraps unexpectedly when text approaches the cap.
- **Responsive padding reduction** in `@media (max-width: 768px / 480px)` applies to cell classes only — inline content classes don't have responsive rules, so they may overflow at small viewports.

## When to edit this file

- **Adding a new cell type** (e.g., `.ac-table-cell-numeric` for right-aligned numbers) — register the class, document the use case.
- **Adding a new inline content molecule** (link button inside cell, etc.) — same.
- **Tuning the simple variant** — borderless / minimal alternative for embedded use.

If you're adding a second organism, this file becomes a misnomer (one-organism file currently). Consider splitting into `table.css`, `dialog.css`, etc., at that point.
