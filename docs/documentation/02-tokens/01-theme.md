---
title: theme.css
type: reference
status: canonical
updated: 2026-05-19
verified: 2026-05-19
description: Foundation primitives. Spacing, radius, shadow, z-index, transition, opacity scales. No classes defined — pure variable declarations.
aliases:
  - theme
  - theme-tokens
tags:
  - project/acyr
  - domain/css
  - domain/tokens
  - domain/spacing
covers:
  - --ac-spacing-* scale (14 stops + semantic gaps)
  - --ac-radius-* scale (7 stops)
  - --ac-shadow-* scale (5 stops + inner)
  - --ac-transition-* timings (4 timings)
  - --ac-z-* index strata (8 layers)
  - --ac-opacity-* state values
sources:
  - packages/ds/tokens/theme.css
related:
  - "[[INDEX|tokens]]"
  - "[[02-color|color]]"
  - "[[05-framework/INDEX|framework]]"
---

# theme.css

Root-level primitives. Spacing scale, radius scale, shadow scale, z-index strata, transition timings, opacity state values. **No classes defined here** — this file declares variables only. Everything downstream references them.

## Spacing scale

4px base. All values are `rem`-expressed for accessibility scaling.

```css
--ac-spacing-1   →  0.25rem (4px)
--ac-spacing-2   →  0.5rem  (8px)
--ac-spacing-3   →  0.75rem (12px)
--ac-spacing-4   →  1rem    (16px)
--ac-spacing-5   →  1.25rem (20px)
--ac-spacing-6   →  1.5rem  (24px)
--ac-spacing-8   →  2rem    (32px)
--ac-spacing-10  →  2.5rem  (40px)
--ac-spacing-12  →  3rem    (48px)
--ac-spacing-16  →  4rem    (64px)
--ac-spacing-20  →  5rem    (80px)
--ac-spacing-24  →  6rem    (96px)
```

Semantic aliases:

```css
--ac-spacing-section   /* major vertical rhythm */
--ac-spacing-container /* container padding */
--ac-spacing-gap-sm
--ac-spacing-gap-md
--ac-spacing-gap-lg
```

**Practical note:** Tailwind has its own spacing scale on the same 4px base. Don't reach for `var(--ac-spacing-4)` in JSX — use Tailwind `p-4` / `gap-4`. The DS variables exist for CSS-tier consumers (framework.css padding tokens, atoms.css internal use).

## Border radius

```css
--ac-radius-none  →  0
--ac-radius-xs    →  2px
--ac-radius-sm    →  4px       ← the repo-wide cap
--ac-radius-md    →  6px
--ac-radius-lg    →  8px
--ac-radius-xl    →  12px
--ac-radius-full  →  9999px    ← pills, circles
```

**Load-bearing constraint:** the repo's global rule is **border-radius never exceeds 4px** for normal-shaped elements. The xs/sm stops are the practical ceiling. `md/lg/xl` exist but aren't routinely used in component chrome. `full` is for pills and circular buttons.

`.ac-btn` and `.ac-control` both hard-code `border-radius: var(--ac-radius-sm)` (4px). This means Tailwind `rounded-*` utilities **lose the specificity tie** against these components — to make a circular button you need `rounded-full!` (Tailwind v4 important suffix). See [[../04-components/01-atoms|atoms]] for the full gotcha.

## Shadows

```css
--ac-shadow-sm     →  small lift
--ac-shadow-md     →  default card
--ac-shadow-lg     →  popover, dropdown
--ac-shadow-xl     →  modal, sheet
--ac-shadow-inner  →  inset pressed state
```

**Dark-mode flip:** under `[data-theme="dark"]`, shadows flip from black-with-alpha to white-with-alpha so elevation still reads on dark surfaces. Handled inside this file.

## Transitions

```css
--ac-transition-fast    →  150ms
--ac-transition-base    →  200ms
--ac-transition-slow    →  300ms
--ac-transition-spring  →  500ms
```

`--ac-transition-base` is the default for most button/control hovers. `--ac-transition-fast` is for nav links and link-style hovers. `--ac-transition-spring` is reserved for sheet/drawer enter/exit.

## Z-index strata

```css
--ac-z-base       →  1
--ac-z-dropdown   →  10
--ac-z-sticky     →  20
--ac-z-overlay    →  50
--ac-z-modal      →  100
--ac-z-toast      →  200
--ac-z-tooltip    →  500
--ac-z-nav        →  1000
```

Eight named strata. **Use a stratum, not a magic number.** If you're typing `z-index: 9999`, you're stepping outside the system — there's exactly one place this is legitimate ([[05-framework/INDEX|framework]]'s `.ac-exit-preview`, which is intentionally above everything).

## Opacity state values

```css
--ac-opacity-hover     →  0.8
--ac-opacity-disabled  →  0.5
--ac-opacity-subtle    →  0.6
--ac-opacity-loading   →  0.7
```

Used by [[../04-components/01-atoms|atoms]] (disabled state on buttons, `.ac-btn-quiet` rest state).

## What this file does NOT define

- **No classes.** Pure variable declarations only.
- **No colors.** Color tokens live in [[02-color|color.css]].
- **No fonts.** Type tokens live in [[04-typography|typography.css]] and [[05-typography-mono|typography-mono.css]].

## When to edit this file

- Adding a new spacing stop the DS reuses in multiple places.
- Adding a new z-index stratum (rare — discuss before).
- Adjusting global transition timings (very rare).

Don't add brand-specific values here. Brand is [[06-brand-color|brand-color]] and [[07-brand-typography|brand-typography]].
