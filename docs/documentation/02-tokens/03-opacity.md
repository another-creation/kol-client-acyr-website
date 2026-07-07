---
title: opacity.css
type: reference
status: canonical
updated: 2026-05-19
verified: 2026-05-19
description: Three-tier foreground opacity ramps (standard / inverse / absolute) with 14 stops each, plus semantic text-role aliases, plus comprehensive bg/text/border utility classes for every stop.
aliases:
  - opacity
  - fg-ramp
  - opacity-tokens
tags:
  - project/acyr
  - domain/css
  - domain/tokens
  - domain/color
covers:
  - --ac-fg-NN ramp (standard tier, 14 stops)
  - --ac-fg-inverse-NN ramp (inverse tier, 14 stops)
  - --ac-fg-absolute-NN ramp (theme-invariant, 14 stops)
  - text-role descriptor aliases (subtle/meta/body/strong/emphasis)
  - .bg-fg-NN, .text-fg-NN, .border-fg-NN utility classes + hover variants
sources:
  - packages/ds/tokens/opacity.css
related:
  - "[[INDEX|tokens]]"
  - "[[02-color|color]]"
---

# opacity.css

Foreground opacity ramps. Three tiers — **standard**, **inverse**, **absolute** — each with 14 stops. Every stop has matching `.bg-fg-NN`, `.text-fg-NN`, `.border-fg-NN` utility classes (plus `:hover` variants). Semantic descriptor aliases (`.text-emphasis`, `.text-body`, etc.) round it out.

## The 14 stops

Every tier has the same stops:

```
01  02  04  08  12  16  24  32  40  48  64  80  88  96
```

Lower numbers = more transparent. The progression is hand-tuned for visual rhythm, not a uniform ramp (note the gap between 32 → 40 → 48 — that's where most "medium" emphasis lands).

## The three tiers

### Standard tier — `--ac-fg-NN`

Foreground on primary surface. Computed from `--ac-surface-on-primary` (ink in light mode, cream in dark mode).

```css
--ac-fg-01   →   1% on-primary
--ac-fg-04   →   4% on-primary
--ac-fg-08   →   8% on-primary
...
--ac-fg-96   →  96% on-primary
```

Use these for normal page contexts.

### Inverse tier — `--ac-fg-inverse-NN`

Foreground on inverse surface. Computed from `--ac-surface-on-inverse` (cream in light mode, ink in dark mode).

```css
--ac-fg-inverse-01   →   1% on-inverse
...
--ac-fg-inverse-96   →  96% on-inverse
```

Use these when explicitly painting on `.bg-surface-inverse`. **Why both tiers exist** — see "the redeclaration gotcha" below.

### Absolute tier — `--ac-fg-absolute-NN`

Theme-invariant. Always against `--ac-color-absolute-black`. Doesn't flip in dark mode.

```css
--ac-fg-absolute-01   →   1% black
...
--ac-fg-absolute-96   →  96% black
```

Use these for components that must look the same regardless of theme — toggle switch backgrounds, marquee chrome, etc.

## Semantic descriptor aliases

Five named stops layered on top of the standard ramp:

```css
--ac-fg-subtle     →  24%  (--ac-fg-24)
--ac-fg-meta       →  48%  (--ac-fg-48)
--ac-fg-body       →  64%  (--ac-fg-64)
--ac-fg-strong     →  80%  (--ac-fg-80)
--ac-fg-emphasis   →  100% (on-primary directly)
```

With matching classes:

```css
.text-subtle      /* dimmed metadata, captions */
.text-meta        /* secondary labels */
.text-body        /* default body copy color */
.text-strong      /* prominent body */
.text-emphasis    /* full-emphasis text — heading, lede */
```

**Practical guide:** for editorial / marketing copy, the descriptor classes are clearer. For UI chrome (dimmed icon, faint divider), the numeric stops are more explicit.

## Classes defined — utility ramps

For every stop × every tier × every property × `:hover` variant. That's why this file is 369 lines.

### Background

```css
.bg-fg                    /* 100% on-primary */
.bg-fg-01 ... .bg-fg-96   /* standard tier, 14 stops */
.bg-fg-inverse-01 ... .bg-fg-inverse-96
.bg-fg-absolute-01 ... .bg-fg-absolute-96

.hover\:bg-fg-NN          /* hover variants — all three tiers */
```

### Text

```css
.text-fg                       /* 100% on-primary */
.text-fg-01 ... .text-fg-96    /* standard tier */
.text-fg-inverse-01 ... .text-fg-inverse-96
.hover\:text-fg-NN             /* hover variants */
```

### Border

```css
.border-fg                              /* 100% on-primary */
.border-fg-01 ... .border-fg-96         /* standard tier */
.border-fg-inverse-01 ... .border-fg-inverse-96
.hover\:border-fg-NN                    /* hover variants */
```

### Practical examples

```jsx
<div className="border-t border-fg-08">         {/* 8% hairline divider */}
<button className="bg-fg-04 hover:bg-fg-08">    {/* very faint button */}
<p className="text-fg-48">                       {/* meta-level dimmed */}
```

## The redeclaration gotcha

The standard tier `--ac-fg-NN` ramp is declared at `:root` against `--ac-surface-on-primary`. CSS substitutes variables **at the declaration site**, so naively `--ac-fg-08` is frozen as "8% of light-mode on-primary" even on a dark surface.

[[02-color|color.css]] handles this by redeclaring the entire ramp inside the `.bg-surface-inverse` selector. So **when a descendant is inside `.bg-surface-inverse`**, `var(--ac-fg-08)` computes against the inverse surface. That's why most of the codebase uses standard `--ac-fg-NN` even on dark sections — the redeclaration handles it.

**Edge case:** the descriptor aliases (`--ac-fg-emphasis` etc.) are NOT redeclared inside `.bg-surface-inverse`. `.text-emphasis` keeps light-mode ink color on dark surfaces. Workaround in [[06-brand-color|brand-color.css]]: `.text-on-inverse` directly references the inverse on-color.

## `currentColor` fallback (load-bearing)

Every ramp value is a `color-mix(in srgb, var(--ac-surface-on-primary, currentColor) NN%, transparent)`. The `currentColor` fallback is intentional — it makes the ramps work inside SVG `fill` contexts (where `currentColor` is the SVG's own `color:` property). This is how icon-internal opacity ramps work without explicit color tokens.

## What this file does NOT define

- **No background colors.** Surface tiers live in [[02-color|color.css]].
- **No brand colors.** Those live in [[06-brand-color|brand-color.css]].
- **No grey ramp.** That's also in [[06-brand-color|brand-color.css]] — `--grey-*` is a brand-layer neutral.

## When to edit this file

- Adding a new stop (very rare — 14 covers it).
- Tuning a specific stop value (rare — affects every consumer).
- Adding new descriptor aliases (consider whether numeric is clearer first).

If a class for the stop you want doesn't exist (e.g., `.text-fg-32`), it's not because the stop is missing — it's because the explicit class file only generates classes for stops actually used. Add the class here and reference it. Don't reach for `text-[var(--ac-fg-32)]` in JSX.
