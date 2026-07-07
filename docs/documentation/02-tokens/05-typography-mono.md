---
title: typography-mono.css
type: reference
status: canonical
updated: 2026-05-19
verified: 2026-05-19
description: DS-default monospace (JetBrains Mono). Numeric size scale .ac-mono-N for body and .ac-helper-N for labels. The mono family token is repointed by brand-typography.css.
aliases:
  - typography-mono
  - mono-tokens
  - helper-classes
tags:
  - project/acyr
  - domain/css
  - domain/tokens
  - domain/typography
covers:
  - JetBrains Mono @font-face declarations
  - --ac-font-family-mono token (overridden by brand-typography)
  - .ac-mono-N body scale (8, 10, 12, 14, 16, 20)
  - .ac-helper-N label scale (8, 10, 12, 14, 16, 20)
sources:
  - packages/ds/tokens/typography-mono.css
related:
  - "[[INDEX|tokens]]"
  - "[[04-typography|typography]]"
  - "[[07-brand-typography|brand-typography]]"
---

# typography-mono.css

Monospace typography. Two parallel scales at six sizes each:

- **`.ac-mono-N`** — body / values / multi-line. Weight 400, has leading.
- **`.ac-helper-N`** — labels / kickers / eyebrows. Weight 500, line-height 1, letter-spaced.

The mono family token is repointed from JetBrains Mono to Right Grotesk Mono by [[07-brand-typography|brand-typography.css]]. Both scales follow the rebind automatically.

## Font family token

```css
--ac-font-family-mono   /* 'JetBrains Mono', monospace — DS default */
```

Overridden later in the cascade by [[07-brand-typography|brand-typography.css]] to `'Right Grotesk Mono', monospace`. Every consumer that uses the variable gets the brand font without any code change.

Registered in `@theme`:

```css
@theme {
  --font-mono: 'JetBrains Mono', monospace;
}
```

So `font-mono` is a valid Tailwind utility. (After the brand override, `font-mono` still resolves to whatever `--ac-font-family-mono` is at use time, since `@theme` registers the family fallback chain literal — Tailwind's `font-mono` utility reads the current var.)

## `.ac-mono-N` — body / value scale

Weight 400, has line-height (mono body needs leading for multi-line readability).

```css
.ac-mono-8     /* 8px / 12px lh */
.ac-mono-10    /* 10px / 14px lh */
.ac-mono-12    /* 12px / 16px lh */
.ac-mono-14    /* 14px / 18px lh */
.ac-mono-16    /* 16px / 22px lh */
.ac-mono-20    /* 20px / 26px lh */
```

Use for mono content that wraps — code blocks, tabular values, raw data. Not for one-line labels (use `.ac-helper-N` instead).

## `.ac-helper-N` — label / kicker scale

Same six sizes, weight 500, **line-height 1**, letter-spaced for small-size readability.

```css
.ac-helper-8     /* 8px,  0.10em tracking */
.ac-helper-10    /* 10px, 0.10em tracking */
.ac-helper-12    /* 12px, 0.06em tracking */
.ac-helper-14    /* 14px, 0.06em tracking */
.ac-helper-16    /* 16px, 0.06em tracking */
.ac-helper-20    /* 20px, 0.06em tracking */
```

Smaller stops (8, 10) get wider tracking (0.10em) to stay readable. Larger stops settle at 0.06em.

**Use for:** section kickers ("Frequently asked", "Brand positioning"), eyebrow labels, table column headers, dateline meta. Typically combined with `uppercase`.

### Common combinations

```jsx
<span className="ac-helper-12 uppercase text-fg-48">Ship's log</span>
<span className="ac-helper-16 uppercase text-fg-48">Frequently asked</span>
<span className="ac-helper-20 uppercase text-fg-64">Home hero kicker</span>
```

## Naming convention

The suffix is the **literal pixel size**. `.ac-helper-12` is 12px. `.ac-mono-16` is 16px. No t-shirt sizing, no decoder ring.

The legacy t-shirt scale classes (`.ac-helper-xl`, `.ac-helper-xxxxs`, `.ac-mono-text`) were retired — see [[../03-utilities/02-typography-helpers|typography-helpers]] for the remaining t-shirt helpers (s / xs / xxs).

## Naming priority — `.ac-helper-N` vs `.ac-sans-nav`

For uppercase eyebrow text, you have two valid options:

- **`.ac-helper-N`** — mono, six sizes, brand-flavoured (Right Grotesk Mono after brand override). Use for editorial kickers, section labels, datelines.
- **`.ac-sans-nav`** — Narrow sans, 12px only, used for nav links. Tighter, no letter-spacing visible at glance. Use for Topnav, Footer links, ProductCard meta.

Don't mix — pick by context. If you're labelling a section heading, use `.ac-helper-*`. If you're typesetting a nav link, use `.ac-sans-nav`.

## Italic note

Only 500i (Medium Italic) is bundled. `.ac-helper-N` in italic falls back to synthesized italic. If a consumer needs proper 400i (Regular Italic mono), load that face here.

## What this file does NOT define

- **No sans typography.** That's [[04-typography|typography.css]].
- **No mono helper t-shirt scale.** Those live in [[../03-utilities/02-typography-helpers|typography-helpers.css]].
- **No prose styling.** That's [[04-typography|typography.css]] inside the `.ac-prose` family.

## When to edit this file

- Adding a new size to the mono / helper scale (rare — six covers it).
- Tuning tracking for a specific stop.
- Loading additional font weights (currently only 400 + 500).

Don't put brand font choices here. The DS default is JetBrains Mono. The AC override happens in [[07-brand-typography|brand-typography.css]] so the DS-neutral default stays intact.
