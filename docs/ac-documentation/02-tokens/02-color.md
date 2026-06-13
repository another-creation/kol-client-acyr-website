---
title: color.css
type: reference
status: canonical
updated: 2026-05-19
verified: 2026-05-19
description: Surface tiers (primary / secondary / tertiary / inverse), accent defaults, UI state colors, border tokens. The brand-neutral color base — overridden by brand-color.css.
aliases:
  - color
  - color-tokens
  - surfaces
tags:
  - project/acyr
  - domain/css
  - domain/tokens
  - domain/color
covers:
  - --ac-surface-* tier system (4 tiers × on-color pairs)
  - --ac-accent-* defaults (rebound by brand layer)
  - --ui-* state colors (error / warning / info / success)
  - --ac-border-* + --ac-focus-* tokens
  - surface utility classes (.bg-surface-*, .elevation-*)
sources:
  - packages/ds/tokens/color.css
related:
  - "[[INDEX|tokens]]"
  - "[[03-opacity|opacity]]"
  - "[[06-brand-color|brand-color]]"
---

# color.css

The brand-neutral color base. Defines four surface tiers with on-color pairs, default accent (ink, rebound to magenta by [[06-brand-color|brand-color.css]]), UI state colors, and border tokens. A project that doesn't pull the brand layer renders fine with this file — it just looks black-and-white.

## Surface tiers

Four tiers, each with a paired on-color for legible text. Values flip in dark mode.

```css
--ac-surface-primary       /* main page background */
--ac-surface-on-primary    /* text on primary */

--ac-surface-secondary     /* card / panel one tier above */
--ac-surface-on-secondary  /* text on secondary */

--ac-surface-tertiary      /* deeper card / nested panel */
--ac-surface-on-tertiary   /* text on tertiary */

--ac-surface-inverse       /* dark band on light theme, vice versa */
--ac-surface-on-inverse    /* text on inverse */
```

**Light mode (default):**

| Tier | Background | Text |
|---|---|---|
| primary | `#FAFAFA` | `#121215` |
| secondary | `#F2F2F2` | `#19191D` |
| tertiary | `#FFFFFF` | `#0E0E11` |
| inverse | `#0E0E11` | `#FCFBF8` |

**Dark mode flip** is handled inside this file via `[data-theme="dark"]` and `@media (prefers-color-scheme: dark)` blocks. The explicit attribute wins over the media query — that's how `ThemeToggle` overrides system preference.

## Absolute colors (theme-invariant)

```css
--ac-color-absolute-white   /* #FFFFFF */
--ac-color-absolute-black   /* #000000 */
```

Used when something must stay the same across themes — toggle switch dots, checkbox checkmarks, marquee black background.

## Accent tokens (rebound by brand layer)

In this file, accent defaults to ink:

```css
--ac-accent-primary           /* → --ac-surface-on-primary (ink) */
--ac-accent-on-primary        /* → --ac-surface-primary (cream/white) */
--ac-accent-primary-strong    /* 80% ink via color-mix */
```

[[06-brand-color|brand-color.css]] rebinds these to magenta. The indirection is intentional — dark-mode flips of `--ac-surface-on-primary` still cascade to `--ac-accent-primary` because the rebind points at a CSS variable, not a literal.

## UI state colors

```css
--ui-error     /* red */
--ui-warning   /* amber */
--ui-info      /* blue */
--ui-success   /* green */
```

These are direct hex, not ramp-dependent. Both light and dark modes have explicit values. Registered in `@theme` as `--color-ui-error` etc., so Tailwind utilities like `bg-ui-error` / `text-ui-success` are available.

## Border + focus

```css
--ac-border-default   /* 8% ink — the default 1px hairline */
--ac-border-focus     /* 70% accent on primary surface */
--ac-focus-ring       /* → --ac-accent-primary */
```

`.ac-control:focus-visible` and `.ac-btn:focus-visible` use these.

## Classes defined

### Surface utilities (background + paired text in one class)

```css
.bg-surface-primary       /* primary bg + on-primary text */
.bg-surface-secondary     /* secondary bg + on-secondary text */
.bg-surface-tertiary      /* tertiary bg + on-tertiary text */
.bg-surface-inverse       /* inverse bg + on-inverse text */
```

**Pair them as a unit.** `bg-surface-primary` already sets the right text color. Don't combine with a separate `text-*` class unless you specifically want to override.

### Elevation utilities (semantic aliases)

```css
.elevation-base       /* base surface */
.elevation-raised     /* one step up */
.elevation-elevated   /* two steps up */
```

Maps to surface tiers semantically. Use when expressing visual hierarchy is clearer than naming the tier directly.

### Basic foreground / background helpers

```css
.text-auto       /* on-primary text */
.text-inverse    /* on-inverse text */
.bg-auto         /* primary surface */
.bg-fg           /* primary surface foreground fill */
.border-auto     /* default border */
.divider-auto    /* same — divider line */
```

### Surface-based borders (for use on `.bg-fg`)

```css
.border-surface       /* primary surface */
.border-surface-08    /* 8% surface */
.border-surface-16    /* 16% surface */
```

### State utilities

```css
.hover\:border-hover:hover
.focus\:border-focus:focus
.focus-visible\:border-focus:focus-visible
.focus-visible\:ring-focus:focus-visible
```

### Absolute color utilities

```css
.bg-absolute-white
.bg-absolute-black
.text-absolute-white
.text-absolute-black
```

## `@theme` block contents

```css
@theme {
  --color-ui-error:    var(--ui-error);
  --color-ui-warning:  var(--ui-warning);
  --color-ui-info:     var(--ui-info);
  --color-ui-success:  var(--ui-success);
}
```

Registers UI state colors as Tailwind utilities. Surface utilities are NOT in this `@theme` block — they're exposed via the explicit classes above.

## Load-bearing detail: `--ac-fg-*` redeclaration inside `.bg-surface-inverse`

This file redeclares the entire `--ac-fg-*` opacity ramp (01 through 96) inside the `.bg-surface-inverse` selector. CSS variable substitution happens **at the declaration site**, not at usage — that's why `--ac-fg-08` defined at `:root` (against on-primary) doesn't auto-flip inside `.bg-surface-inverse`. The redeclaration forces every descendant consuming `--ac-fg-*` (borders, dimmed text) to compute against `--ac-surface-on-inverse` instead.

**Open gap:** the descriptor aliases (`--ac-fg-emphasis`, `--ac-fg-strong`, `--ac-fg-body`, `--ac-fg-meta`, `--ac-fg-subtle`) are NOT redeclared inside `.bg-surface-inverse`. Result: `.text-emphasis` doesn't flip on inverse backgrounds. Workaround in [[06-brand-color|brand-color.css]] — the `.text-on-inverse` class directly references `var(--ac-surface-on-inverse)`. The real fix is redeclaring the descriptor aliases inside the inverse selector. See AGENT-CONTEXT's "active known issues" for the full thread.

## What this file does NOT define

- **No brand ramps.** Burgundy, cream, grey, magenta all live in [[06-brand-color|brand-color.css]].
- **No opacity ramps.** Those live in [[03-opacity|opacity.css]].
- **No typography.** That's [[04-typography|typography.css]].

## When to edit this file

- Adjusting surface tier values (very rare — affects everything).
- Adding a new UI state color (`--ui-pending`, `--ui-archived`, etc.) — remember to register in `@theme`.
- Tuning the focus ring.

Don't add brand-specific colors here. They belong in [[06-brand-color|brand-color.css]] so the AC layer stays clearly separable from the DS-neutral base.
