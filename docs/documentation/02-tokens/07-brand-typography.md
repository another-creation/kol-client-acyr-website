---
title: brand-typography.css
type: reference
status: canonical
updated: 2026-05-19
verified: 2026-05-19
description: AC mono override. Loads Right Grotesk Mono @font-face and repoints --ac-font-family-mono. Minimal — pure rebind point.
aliases:
  - brand-typography
  - mono-override
tags:
  - project/acyr
  - domain/css
  - domain/tokens
  - domain/typography
  - brand/typography
covers:
  - Right Grotesk Mono @font-face (3 weights)
  - --ac-font-family-mono override
  - --ac-text-helper-s / -xs / -xxs size tokens
sources:
  - packages/ds/tokens/brand-typography.css
related:
  - "[[INDEX|tokens]]"
  - "[[05-typography-mono|typography-mono]]"
  - "[[../03-utilities/02-typography-helpers|typography-helpers]]"
---

# brand-typography.css

The AC mono override layer. Replaces the DS-default JetBrains Mono with Right Grotesk Mono via a single token rebind. Also declares three t-shirt-scale helper size tokens consumed by [[../03-utilities/02-typography-helpers|typography-helpers.css]].

This file is intentionally minimal — it's a brand override point, not a feature module.

## What it does

### Right Grotesk Mono `@font-face`

Three weights loaded:

- 400 (Regular)
- 500 (Medium)
- 700 (Bold)

`.ac-mono-N` and `.ac-helper-N` classes (defined in [[05-typography-mono|typography-mono.css]]) use 400 + 500. The 700 weight is available for direct CSS overrides if a consumer needs it.

### Token override

```css
:root {
  --ac-font-family-mono: 'Right Grotesk Mono', monospace;
}
```

This is the load-bearing line. [[05-typography-mono|typography-mono.css]] declared `--ac-font-family-mono` pointing at JetBrains Mono. This file declares it again — later in cascade order — pointing at Right Grotesk Mono. Every consumer of `var(--ac-font-family-mono)` (every `.ac-mono-N` class, every `.ac-helper-N` class, the prose `code` styling, code blocks, marquee labels, footer chrome) automatically renders in Right Grotesk Mono.

**No JSX changes, no className updates required.** That's the whole point of the indirection.

### Helper size tokens

```css
--ac-text-helper-s     /* 14px */
--ac-text-helper-xs    /* 12px */
--ac-text-helper-xxs   /* 10px */
```

Consumed by `.ac-helper-s`, `.ac-helper-xs`, `.ac-helper-xxs` in [[../03-utilities/02-typography-helpers|typography-helpers.css]]. These are the t-shirt-scale survivors after the numeric scale (`.ac-helper-8/-10/-12/...`) became the canonical naming. Don't reach for these unless you're maintaining legacy markup.

## What this file does NOT define

- **No classes.** Pure font-face declarations + variable redefinition.
- **No `@theme` block.** The Tailwind `font-mono` utility was registered in [[05-typography-mono|typography-mono.css]] and points at `--ac-font-family-mono` — the override propagates automatically.
- **No sans override.** Right Grotesk sans is already AC's brand font, declared directly in [[04-typography|typography.css]] (which is part of the DS but AC happened to be designed around Right Grotesk from the start).

## When to edit this file

- **Swapping the mono font** — e.g., to a different monospace face for a rebrand. Update `@font-face` declarations + the `--ac-font-family-mono` value.
- **Loading additional weights** — if a consumer needs italic 400i or weight 600.

If you're tempted to add classes or new scale tokens here: don't. Add classes to [[../03-utilities/02-typography-helpers|typography-helpers]] (helper classes) or [[05-typography-mono|typography-mono]] (mono scale). Add tokens to the layer they semantically belong to.
