---
title: Utilities
type: index
status: active
updated: 2026-05-19
description: Generic helper classes. Layout primitives and small typography helpers. Sit between tokens and components in the cascade.
aliases:
  - utilities
tags:
  - project/acyr
  - domain/css
  - domain/design-system
related:
  - "[[../01-cascade|cascade]]"
  - "[[../INDEX|ac-documentation]]"
---

# Utilities

Two thin files. Neither owns a single component — both are loose helpers that components and pages reach for.

## Files

| File | Owns |
|---|---|
| [[01-utilities\|01-utilities]] | Generic layout helpers: `.flex-center`, `.sr-only`, `.text-balance`, `.fullbleed`, `.breakpoint-padding`, `.text-trim`, `.hide-number-spinners` |
| [[02-typography-helpers\|02-typography-helpers]] | Small mono helper classes: `.ac-helper-s`, `.ac-helper-xs`, `.ac-helper-xxs`, `.ac-mono-text` |

## Why this layer exists separate from components

A `.flex-center` is not a component — it's a one-line helper applied to many components' wrappers. Same for `.sr-only` or `.text-balance`. Keeping them out of the components layer lets the components layer stay focused on real chrome (buttons, inputs, pills).

The small typography helpers in `02-typography-helpers.css` are also peri-token in nature — they reference size tokens declared in [[../02-tokens/07-brand-typography|brand-typography.css]] but they're consumable classes, not raw variables.

## Tailwind-first reminder

Most of what you'd write CSS for has a Tailwind equivalent. **Reach for `className="flex items-center justify-center"` before you reach for `className="flex-center"`.** The DS class exists for the cases where it reads cleaner (single intent, many usages) or where a CSS rule references it internally.

The classes in this layer are stable enough to lean on, but Tailwind utilities are still the default for application code.
