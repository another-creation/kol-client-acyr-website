---
title: The cascade
type: reference
status: canonical
updated: 2026-05-19
verified: 2026-05-19
description: The 13 imports in packages/ds/index.css. Load order, why it matters, what breaks if reordered.
aliases:
  - cascade
  - cascade-order
tags:
  - project/acyr
  - domain/css
  - domain/design-system
covers:
  - packages/ds/index.css load order
  - tier responsibilities (tokens → brand → utilities → components → framework)
  - what overrides what
sources:
  - packages/ds/index.css
  - apps/website/src/index.css
  - apps/styleguide/src/index.css
related:
  - "[[../INDEX|documentation]]"
  - "[[02-tokens/INDEX|tokens]]"
  - "[[02-tokens/06-brand-color|brand-color]]"
---

# The cascade

`packages/ds/index.css` is the canonical entry point for the AC design system. It does nothing except import 13 files in a specific order. **The order is load-bearing.** Reordering anything below silently breaks theming.

## App-level entries (3 lines each)

Both consumer apps have a 3-line `index.css` and that's it:

```css
/* apps/website/src/index.css */
@import "tailwindcss";
@import "@ac/ds/index.css";
@import "./styles/site.css";
```

```css
/* apps/styleguide/src/index.css */
@import "tailwindcss";
@import "@ac/ds/index.css";
@import "./styles/design-foundations.css";
```

The DS cascade is the same for both apps. App-specific chrome layers last.

## The 13 imports

`packages/ds/index.css` in order:

| # | File | Tier | What it owns |
|---|---|---|---|
| 1 | `tokens/theme.css` | tokens | Spacing, radius, shadow, z-index, transition, opacity scales |
| 2 | `tokens/color.css` | tokens | Surface tiers + accent default (brand-neutral) + UI state colors |
| 3 | `tokens/opacity.css` | tokens | fg opacity ramps (standard / inverse / absolute) + text-role classes |
| 4 | `tokens/typography.css` | tokens | Right Grotesk families + sans heading/body/nav/prose scales |
| 5 | `tokens/typography-mono.css` | tokens | DS default mono (JetBrains Mono) + numeric `.ac-mono-N` / `.ac-helper-N` scales |
| 6 | `tokens/brand-color.css` | brand | AC ramps (burgundy, cream, grey, magenta), accent rebind to magenta, `@theme` registration |
| 7 | `tokens/brand-typography.css` | brand | AC mono override (Right Grotesk Mono replaces JetBrains Mono via token rebind) + helper size tokens |
| 8 | `utilities/utilities.css` | utilities | Generic helpers — `.flex-center`, `.sr-only`, `.text-balance`, etc. |
| 9 | `utilities/typography-helpers.css` | utilities | Small mono helper classes (`.ac-helper-s/-xs/-xxs`, `.ac-mono-text`) |
| 10 | `components/atoms.css` | components | Buttons, inputs, controls, toggles, sliders, sidenav primitives |
| 11 | `components/molecules.css` | components | Pills, tags, badges, popovers, tooltips |
| 12 | `components/organisms.css` | components | Table |
| 13 | `framework/framework.css` | framework | Page scaffold, sidenav layout, overlay, carousel, exit-preview, code block |

Then app-tier CSS (`site.css` for website, `design-foundations.css` for styleguide) loads on top.

## The five tiers

```
tokens   ──→  brand   ──→  utilities   ──→  components   ──→  framework   ──→  app
```

Each tier can:

- **Consume** tokens declared in earlier tiers via `var(--ac-*)`.
- **Override** tokens declared earlier (the brand layer is the canonical example — it rebinds `--ac-accent-primary` from ink to magenta).
- **Define** new tokens that later tiers consume.

Each tier must NOT:

- Reorder itself relative to other tiers (cascade ties go to the later declaration).
- Skip a tier dependency (utilities can't reference component classes; tokens can't reference utility classes).

## Why the order matters

### Brand follows DS-neutral

Step 1–5 declare the **brand-neutral** DS. A scaffolded project that doesn't pull brand-color.css renders fine — it just uses ink for accents and JetBrains Mono for mono.

Step 6–7 are the **brand layer**. They override accent tokens and rebind the mono family. The rebind only works in one direction: brand-color.css points `--ac-accent-primary` at `--brand-magenta-200`, but if brand loaded first, color.css would point it back at ink.

### Utilities follow tokens

`utilities/*.css` reference `var(--ac-fg-*)`, `var(--ac-font-family-mono)`, etc. They must load AFTER the tokens they reference are declared.

### Components follow utilities

Component classes (`.ac-btn`, `.ac-control`) can be composed with utility classes (`.flex-center`, `.sr-only`) inside JSX. Source-order matters for the specificity tie — `.ac-btn` declared later than the Tailwind utilities means `.ac-btn { border-radius: var(--ac-radius-sm) }` beats plain `rounded-full`. See [[04-components/01-atoms|atoms]] for the `rounded-full!` workaround.

### Framework follows components

`framework.css` defines `.ac-page`, `.ac-overlay`, `.ac-embla-*` etc. — page-level chrome. It loads last so it can override component defaults at equal specificity, and so its responsive cascade (e.g., `.ac-sidenav.is-collapsed`) can adjust component-layer rules.

### App layers follow everything

`site.css` (website) and `design-foundations.css` (styleguide) load on top of the entire DS. They can override anything, and they're where bespoke page chrome lives. **Most "we need a new class" is actually "we need a Tailwind className"** — see [[06-app-layers/INDEX|app-layers/INDEX]] for the audit of single-consumer CSS that shouldn't live here.

## The `@theme` contract

Tailwind v4 reads `@theme {}` blocks across all imported CSS and generates utility classes from the registered variables. Three files in the cascade contribute:

- [[02-tokens/02-color|color.css]] — UI state colors (`--color-ui-error`, etc.)
- [[02-tokens/04-typography|typography.css]] — sans families (`--font-display`, `--font-narrow`, etc.)
- [[02-tokens/05-typography-mono|typography-mono.css]] — `--font-mono`
- [[02-tokens/06-brand-color|brand-color.css]] — brand roles + accent + ramps (burgundy, magenta, cream, grey)

Result: `bg-brand-primary`, `text-accent-primary`, `bg-cream-300`, `text-grey-900`, `font-mono`, etc. are all valid Tailwind utilities. If a brand token is missing from `@theme`, the Tailwind utility won't generate — that's why brand-color.css has the `@theme` block at the end.

## What breaks if reordered

| Move | Symptom |
|---|---|
| brand-color.css before color.css | Accent rebind silently no-ops; site renders with ink accents |
| brand-typography.css before typography-mono.css | Mono rebind silently no-ops; site renders JetBrains Mono |
| utilities before tokens | Utility classes reference undeclared `--ac-*` vars → empty/initial values |
| components before utilities | Same as above; `.ac-btn` references `--ac-radius-sm` and breaks |
| framework before components | Component class overrides land BEFORE component defaults → framework rules win when they shouldn't |
| Any tier loaded twice | Source-order tie-break flips unpredictably; expect ghost styling regressions |

## Don't revisit

Don't reorder this cascade without reading this doc end-to-end and writing the symptom into the table above. ARCHITECTURE §4 also locks this — see `.kol/llm-context/ARCHITECTURE.md`.
