---
title: Components
type: index
status: active
updated: 2026-05-19
description: Reusable chrome — atoms, molecules, organisms. Buttons, inputs, controls, toggles, pills, badges, tooltips, table.
aliases:
  - components
tags:
  - project/acyr
  - domain/css
  - domain/design-system
related:
  - "[[01-cascade/INDEX|cascade]]"
  - "[[../INDEX|documentation]]"
---

# Components

The DS proper. Reusable chrome that gets composed into JSX. Three tiers — atoms, molecules, organisms — borrowed loosely from atomic design but not religiously.

## Files

| File | Owns | Lines |
|---|---|---|
| [[01-atoms\|01-atoms]] | `.ac-control`, `.ac-btn` + variants, toggles, sliders, sidenav hop primitives, label classes, icon swap | 709 |
| [[02-molecules\|02-molecules]] | `.ac-popover`, `.ac-tooltip`, `.pill-*`, `.tag-*`, `.ac-badge-*` | 255 |
| [[03-organisms\|03-organisms]] | `.ac-table-*` family | 220 |

## When to reach here

These classes are **the right answer** for buttons, inputs, badges, tooltips. **Don't write a bespoke `<button>` style.** Reach for `.ac-btn ac-btn-primary` (or secondary, ghost, outline, accent). If you need a different shape, pass Tailwind layout utilities (`w-7 h-7`, `rounded-full!`, etc.) — see the [[01-atoms|atoms]] gotcha section for the `rounded-full!` workaround.

## The cascade-tie gotcha

`.ac-btn` (and `.ac-control`) hard-code `border-radius: var(--ac-radius-sm)` (4px). They sit later in source order than Tailwind utilities, so plain `rounded-full` loses on specificity tie. **Use `rounded-full!` (Tailwind v4 important suffix)** when you need to break out of the default 4px radius.

Same pattern applies to overriding component internals: padding, border-color, etc. The DS class wins by default. Add `!` to override when you genuinely need to.

The real fix is wrapping atoms.css in `@layer components` so Tailwind utilities win automatically. Tracked as DS hygiene work — not done yet.

## What this layer does NOT define

- **No page-level layout.** That's [[05-framework/INDEX|framework.css]].
- **No bespoke page chrome.** That belongs in app layers — [[../06-app-layers/INDEX|app-layers]].
- **No tokens.** Components consume `var(--ac-*)` from tokens; they don't declare new ones.
