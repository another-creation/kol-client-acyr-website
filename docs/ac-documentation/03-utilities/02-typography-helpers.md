---
title: typography-helpers.css
type: reference
status: canonical
updated: 2026-05-19
verified: 2026-05-19
description: Three t-shirt-scale mono helper classes (.ac-helper-s/-xs/-xxs) and a generic .ac-mono-text body class. Survivors of the legacy t-shirt scale before the numeric scale became canonical.
aliases:
  - typography-helpers
  - helper-classes-legacy
tags:
  - project/acyr
  - domain/css
  - domain/utilities
  - domain/typography
covers:
  - .ac-helper-s / -xs / -xxs (t-shirt scale labels)
  - .ac-mono-text (generic mono body, 14px)
sources:
  - packages/ds/utilities/typography-helpers.css
related:
  - "[[INDEX|utilities]]"
  - "[[../02-tokens/05-typography-mono|typography-mono]]"
  - "[[../02-tokens/07-brand-typography|brand-typography]]"
---

# typography-helpers.css

Four small mono classes. Three t-shirt-scale label helpers, one generic 14px mono body.

The numeric scale `.ac-helper-N` defined in [[../02-tokens/05-typography-mono|typography-mono.css]] is the canonical naming. The t-shirt scale survivors in this file exist because of legacy markup; new code should reach for the numeric versions.

## Classes

### Label helpers — t-shirt scale

All three use `--ac-font-family-mono` (Right Grotesk Mono after brand override), weight 500, line-height 1.

```css
.ac-helper-s     /* var(--ac-text-helper-s)   = 14px, 0.06em tracking */
.ac-helper-xs    /* var(--ac-text-helper-xs)  = 12px, 0.06em tracking */
.ac-helper-xxs   /* var(--ac-text-helper-xxs) = 10px, 0.10em tracking */
```

The size tokens are declared in [[../02-tokens/07-brand-typography|brand-typography.css]] (the brand-layer override file picked them up because they're project-flavoured).

**`.ac-helper-xxs`** uses wider tracking (0.10em vs 0.06em) for sub-12px readability — same pattern as the numeric `.ac-helper-8/-10`.

### Generic mono body

```css
.ac-mono-text    /* 14px, line-height 1.5, weight 400 */
```

Hardcoded 14px, has leading. Fallback for mono body when the t-shirt helpers are too rigid.

## When to use these vs `.ac-helper-N`

| You want | Reach for |
|---|---|
| Section kicker / eyebrow | `.ac-helper-12` (numeric) |
| Small dateline | `.ac-helper-10` (numeric) |
| Brand-flavored t-shirt-scale legacy markup | `.ac-helper-xs` (t-shirt) |
| Generic mono body, wraps | `.ac-mono-text` |
| Mono value display, 16px | `.ac-mono-16` (from [[../02-tokens/05-typography-mono|typography-mono]]) |

Default to the numeric scale (`.ac-helper-N`). Use the t-shirt scale (`.ac-helper-s/-xs/-xxs`) only when you're working in an existing area that already uses it.

## What this file does NOT define

- **No sans helpers.** All sans typography is in [[../02-tokens/04-typography|typography.css]].
- **No font-family token.** That's `--ac-font-family-mono` in [[../02-tokens/05-typography-mono|typography-mono.css]].

## When to edit this file

- **Adjusting t-shirt helper tracking** — currently 0.06em / 0.10em, may want refining.
- **Retiring** — once all legacy `.ac-helper-s/-xs/-xxs` consumers migrate to numeric, this file becomes one class (`.ac-mono-text`) and could be folded back into [[../02-tokens/05-typography-mono|typography-mono]].

Don't add new t-shirt-scale classes. Add numeric scale classes to [[../02-tokens/05-typography-mono|typography-mono.css]] instead.
