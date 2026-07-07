---
title: brand-color.css
type: reference
status: canonical
updated: 2026-05-19
verified: 2026-05-19
description: AC brand color layer. Burgundy / cream / grey / magenta ramps, brand role pairs, accent rebind from ink to magenta, @theme registration that exposes everything as Tailwind utilities, plus explicit utility classes for every ramp stop.
aliases:
  - brand-color
  - brand-ramps
  - ac-ramps
tags:
  - project/acyr
  - domain/css
  - domain/tokens
  - domain/color
  - brand/colors
covers:
  - --brand-burgundy-100..500 (anchor 200)
  - --cream-100..500 (anchor 300/400)
  - --grey-50..900 (legacy neutral)
  - --brand-magenta-100..500 (anchor 200)
  - --brand-primary / -on-primary / -secondary / -on-secondary role pair
  - --ac-accent-primary rebind to magenta
  - @theme registration of all ramps
  - .bg-grey-N, .text-cream-N, .bg-brand-burgundy-N, .text-brand-magenta-N utility classes
  - .text-on-inverse, .text-on-primary surface-pair shortcuts
sources:
  - packages/ds/tokens/brand-color.css
related:
  - "[[INDEX|tokens]]"
  - "[[02-color|color]]"
  - "[[03-opacity|opacity]]"
---

# brand-color.css

The AC brand color layer. Four ramps (burgundy, cream, grey, magenta), role-pair tokens (`--brand-primary` etc.), accent rebind from ink to magenta, full `@theme` registration so Tailwind utilities generate for every ramp stop, and explicit utility classes that beat Tailwind's JIT in cases where component CSS needs the class declared.

This is also where the AC brand sits as a separable layer — swap this file (or unload it) and the DS reverts to brand-neutral.

## The four ramps

### Burgundy — `--brand-burgundy-100..500`

Anchor: **200** (`#750E20`). The signature AC red.

```css
--brand-burgundy-100    /* lightest */
--brand-burgundy-200    /* ★ anchor */
--brand-burgundy-300
--brand-burgundy-400
--brand-burgundy-500    /* darkest */
```

### Cream — `--cream-100..500`

Project neutral. Two anchor stops: **300** (Champagne `#F2E5CB`) and **400** (Sand Gold `#F2D9A9`).

```css
--cream-100    /* nearly white */
--cream-200
--cream-300    /* ★ Champagne */
--cream-400    /* ★ Sand Gold */
--cream-500    /* dark cream */
```

Used by SupportCTA, Newsletter, editorial backgrounds.

### Grey — `--grey-50..900`

Legacy ten-stop neutral. Brand-agnostic — kept available for greys that don't carry brand identity. Used by `.ac-btn-secondary`.

```css
--grey-50      /* near white */
--grey-100
...
--grey-900     /* near black */
```

### Magenta — `--brand-magenta-100..500`

Anchor: **200** (`#CE1842`). Distinct from burgundy — accent pop, not brand identity.

```css
--brand-magenta-100
--brand-magenta-200    /* ★ anchor — current accent */
--brand-magenta-300
--brand-magenta-400
--brand-magenta-500
```

## Brand roles (the rebrand contract)

Four lines that define the AC brand identity in semantic terms:

```css
--brand-primary        /* → burgundy-200 */
--brand-on-primary     /* → cream-100 */
--brand-secondary      /* → cream-300 */
--brand-on-secondary   /* → burgundy-300 */
```

**Rebrand by editing these four lines.** Any consumer using `var(--brand-primary)` rebinds automatically. That's why component CSS reaches for these aliases rather than the literal ramp stops — the indirection is the contract.

## Accent rebind

This is the heart of the brand layer:

```css
--ac-accent-primary           /* was --ac-surface-on-primary (ink), now magenta-200 */
--ac-accent-on-primary        /* was --ac-surface-primary, now cream-100 */
--ac-accent-primary-strong    /* was 80% ink, now magenta-300 */
```

[[02-color|color.css]] declared these tokens pointing at ink. This file overrides them to point at magenta. Because the cascade loads color.css first, brand-color.css second, the brand bind wins.

**Dark-mode behaviour:** the override removes any dark-mode-specific rebind because magenta is theme-neutral — works on both light and dark surfaces.

## `@theme` block — the Tailwind contract

The block registers everything as Tailwind utilities:

```css
@theme {
  /* Roles */
  --color-brand-primary:     var(--brand-primary);
  --color-brand-on-primary:  var(--brand-on-primary);
  --color-brand-secondary:   var(--brand-secondary);
  --color-brand-on-secondary:var(--brand-on-secondary);

  /* Accent (indirected through --ac-* so dark-mode flips work) */
  --color-accent-primary:        var(--ac-accent-primary);
  --color-accent-on-primary:     var(--ac-accent-on-primary);
  --color-accent-primary-strong: var(--ac-accent-primary-strong);

  /* Burgundy ramp (5 stops) */
  --color-brand-burgundy-100 ... --color-brand-burgundy-500;

  /* Magenta ramp (5 stops) */
  --color-brand-magenta-100 ... --color-brand-magenta-500;

  /* Cream (5 stops) */
  --color-cream-100 ... --color-cream-500;

  /* Grey (10 stops) */
  --color-grey-50 ... --color-grey-900;
}
```

Result — every ramp stop is a valid Tailwind utility:

```jsx
<div className="bg-brand-primary text-brand-on-primary">…</div>
<div className="bg-cream-300 text-fg-80">…</div>
<button className="text-accent-primary hover:text-accent-primary-strong">…</button>
<div className="bg-grey-900 text-grey-50">…</div>
<span className="text-brand-magenta-200">…</span>
```

**If you add a new brand color stop, you MUST also add it to `@theme` or the Tailwind utility won't generate.**

## Explicit utility classes (Tailwind backup)

This file ALSO defines bare CSS classes for every ramp stop:

```css
.bg-grey-50 ... .bg-grey-900
.text-grey-50 ... .text-grey-900

.bg-cream-100 ... .bg-cream-500
.text-cream-100 ... .text-cream-500

.bg-brand-burgundy-100 ... .bg-brand-burgundy-500
.text-brand-burgundy-100 ... .text-brand-burgundy-500

.bg-brand-magenta-100 ... .bg-brand-magenta-500
.text-brand-magenta-100 ... .text-brand-magenta-500
```

**Why both `@theme` AND explicit classes?** Tailwind v4's JIT scans JSX files for utility usage. CSS files (`.ac-btn-secondary` referencing `--grey-100`) aren't scanned, so without explicit classes, internal DS rules couldn't compose. The explicit classes guarantee availability even when the only consumer is another CSS rule.

These classes live later in the cascade than [[03-opacity|opacity.css]], so they beat `.text-emphasis` on specificity ties.

## Surface-pair shortcuts

```css
.text-on-inverse    /* → var(--ac-surface-on-inverse) — flips correctly on .bg-surface-inverse */
.text-on-primary    /* → var(--ac-surface-on-primary) — full-emphasis text */
```

Workarounds for the descriptor-alias-doesn't-flip gotcha noted in [[02-color|color.css]] and [[03-opacity|opacity.css]]. Until the real DS fix lands (redeclaring `--ac-fg-emphasis` etc. inside `.bg-surface-inverse`), use `.text-on-inverse` instead of `.text-emphasis` on dark surfaces.

## What this file does NOT define

- **No DS-neutral colors.** Those live in [[02-color|color.css]].
- **No opacity ramps.** [[03-opacity|opacity.css]].
- **No fonts.** [[04-typography|typography.css]] and [[05-typography-mono|typography-mono.css]].

## When to edit this file

- **Adding a new brand color stop** (e.g., adding `--brand-burgundy-600`). Remember to register in `@theme` AND add explicit utility classes.
- **Adding a new accent color family** (e.g., a complementary teal). Define ramp + roles + `@theme` + utilities.
- **Rebranding** — edit the four `--brand-*` role lines. Everything else cascades.

Don't touch the accent rebind unless you actually intend to change the brand's accent color. The indirection through `--ac-accent-*` is what makes dark-mode work.
