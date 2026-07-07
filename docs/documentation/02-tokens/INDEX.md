---
title: Tokens
type: index
status: active
updated: 2026-05-19
description: The vocabulary of the design system. Every CSS variable, every type scale, every brand ramp lives here.
aliases:
  - tokens
tags:
  - project/acyr
  - domain/css
  - domain/design-system
  - domain/tokens
related:
  - "[[01-cascade/INDEX|cascade]]"
  - "[[../INDEX|documentation]]"
---

# Tokens

The bottom layer of the AC design system. Everything else references these — utilities, components, framework, app CSS. If you're adding a hardcoded `16px` or `#943143` or `var(--some-new-var)` anywhere else in the cascade, you probably want to add a token here first and reference it.

## Files

| File | Owns |
|---|---|
| [[01-theme\|01-theme]] | Spacing, radius, shadow, z-index, transition, opacity scales |
| [[02-color\|02-color]] | Surface tiers + accent defaults + UI state + border tokens |
| [[03-opacity\|03-opacity]] | fg opacity ramps (standard / inverse / absolute), text-role classes, ramped bg/text/border utilities |
| [[04-typography\|04-typography]] | Right Grotesk families + sans heading/body/nav/prose scales + classes |
| [[05-typography-mono\|05-typography-mono]] | DS default mono (JetBrains Mono) + numeric `.ac-mono-N` / `.ac-helper-N` scales |
| [[06-brand-color\|06-brand-color]] | AC ramps (burgundy, cream, grey, magenta), accent rebind, `@theme` registration, ramp utility classes |
| [[07-brand-typography\|07-brand-typography]] | AC mono override — repoints `--ac-font-family-mono` from JetBrains to Right Grotesk Mono |

## DS-neutral vs brand layer

Files 1–5 are the **DS-neutral** base. A scaffolded project that doesn't pull AC brand renders fine with these — black ink for accents, JetBrains Mono for code.

Files 6–7 are the **brand layer**. They override `--ac-accent-primary` and rebind the mono family. The brand layer can be swapped without touching the DS-neutral files — that's the four-line rebrand contract in [[06-brand-color|06-brand-color]].

## When to add a token

- **Add a token** if the value will be reused in more than one place, or if it's a brand-controlled decision (color, font, scale).
- **Don't add a token** for one-off values that belong inside a single component. Inline the literal.
- **Don't add a token** for something Tailwind already exposes — `--spacing-4` (Tailwind) and `--ac-spacing-4` (DS) is duplication; pick one.

## When to extend the `@theme` block

If you add a brand token that needs to be reachable as a Tailwind utility (`bg-brand-foo`, `text-foo-300`), add the corresponding `--color-*` / `--font-*` mapping to the `@theme {}` block in [[06-brand-color|06-brand-color]] or [[04-typography|04-typography]]. Without that line, the token exists but no utility generates.
