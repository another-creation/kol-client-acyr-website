---
title: typography.css
type: reference
status: canonical
updated: 2026-05-19
verified: 2026-05-19
description: Right Grotesk family (display, compact, tall, wide, narrow, spatial, tight, text cuts), responsive type-size tokens, and atomic display / heading / body / nav / prose classes.
aliases:
  - typography
  - typography-tokens
  - type-scale
tags:
  - project/acyr
  - domain/css
  - domain/tokens
  - domain/typography
covers:
  - Right Grotesk @font-face declarations
  - --ac-font-family-sans / -narrow / -compact tokens
  - --ac-text-display-NN, --ac-text-heading-NN, --ac-text-body-NN tokens (responsive)
  - .ac-sans-display-NN classes
  - .ac-sans-heading-NN classes (01–06)
  - .ac-sans-body-NN classes
  - .ac-sans-nav class
  - .ac-prose family classes
sources:
  - packages/ds/tokens/typography.css
related:
  - "[[INDEX|tokens]]"
  - "[[05-typography-mono|typography-mono]]"
  - "[[07-brand-typography|brand-typography]]"
---

# typography.css

Sans typography. Right Grotesk family declarations, three responsive type scales (display / heading / body), atomic classes for each scale, plus a navigation class and an editorial `.ac-prose` family for long-form copy.

## Font families

Right Grotesk has many cuts. Three are registered as DS tokens:

```css
--ac-font-family-sans            /* Right Grotesk base */
--ac-font-family-sans-narrow     /* Right Grotesk Narrow — top of scale, display + heading-01/02 */
--ac-font-family-sans-compact    /* Right Grotesk Compact — mid-scale, heading-03 through -06 */
```

Other cuts (`Tall`, `Wide`, `Spatial`, `Tight`, `Text`) are loaded as `@font-face` but not exposed as tokens — consumers reach for them by literal font-family name in the rare case they're needed. Right Grotesk Text (optical body grade) is used implicitly by `.ac-prose`.

`@theme` block exposes the sans family to Tailwind:

```css
@theme {
  --font-display:  'Right Grotesk', sans-serif;
  --font-text:     'Right Grotesk', sans-serif;
  --font-serif:    'Right Grotesk', sans-serif;
  --font-narrow:   'Right Grotesk Narrow', 'Right Grotesk', sans-serif;
}
```

So `font-display`, `font-narrow`, etc. are valid Tailwind utilities. Mono lives in [[05-typography-mono|typography-mono.css]].

## Size tokens — responsive

All size tokens scale at two breakpoints: 768px (tablet) and 1280px (wide).

### Display

```css
--ac-text-display-01    →  56px → 80px → 96px
--ac-text-display-02    →  44px → 56px → 64px
--ac-text-display-03    →  36px → 42px → 48px
```

### Heading

```css
--ac-text-heading-01    →  48px → 56px → 64px
--ac-text-heading-02    →  40px → 40px → 40px
--ac-text-heading-03    →  32px → 32px → 32px
--ac-text-heading-04    →  24px → 24px → 24px
--ac-text-heading-05    →  20px → 20px → 20px
--ac-text-heading-06    →  16px → 16px → 16px
```

### Body

```css
--ac-text-body-01    →  16px (default body)
--ac-text-body-02    →  14px (UI text)
--ac-text-body-03    →  12px (small UI / footer)
```

## Classes — display (3 stops, but only 2 defined)

Narrow cut, weight 600, line-height 100%, tight letter-spacing.

```css
.ac-sans-display-01    /* 56–96px responsive, top of page */
.ac-sans-display-02    /* 44–64px responsive */
/* .ac-sans-display-03 is deferred — token exists, class added on demand */
```

## Classes — heading (6 stops)

Two cuts splice the scale: Narrow for 01/02 (display-grade headings), Compact for 03–06 (UI-grade headings). All at weight 500.

```css
.ac-sans-heading-01    /* Narrow, 48–64px, 110% lh — page hero */
.ac-sans-heading-02    /* Narrow, 40px, 110% lh — section title */
.ac-sans-heading-03    /* Compact, 32px, 120% lh */
.ac-sans-heading-04    /* Compact, 24px, 120% lh */
.ac-sans-heading-05    /* Compact, 20px, 120% lh — card title, FAQ question */
.ac-sans-heading-06    /* Compact, 16px, 125% lh */
```

## Classes — body (3 stops)

Base sans, weight 400, generous line-height for reading.

```css
.ac-sans-body-01    /* 16px, 160% lh — default body */
.ac-sans-body-02    /* 14px, 160% lh — UI text */
.ac-sans-body-03    /* 12px, 150% lh — meta */
```

## `.ac-sans-nav`

Narrow cut, 12px, uppercase, weight 500, letter-spacing 0.08em, line-height 1.

```css
.ac-sans-nav
```

Used by Topnav, Footer, ProductCard meta, Marquee labels. **This is the right class for nav-link-flavoured text** — don't roll your own `font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;` block.

## `.ac-prose` family — editorial body

For long-form copy in articles, FAQ answers, atelier vision blocks. Heavier line-height, lighter weight than UI body.

```css
.ac-prose             /* 16px, weight 300, 24px lh, 0.02em tracking, max-width 720px, color fg-80 */
```

### Prose sub-classes

```css
.ac-prose-label        /* mono 12px 500 0.1em uppercase fg-48 — section kicker inside prose */
.ac-prose-display      /* 80px, 500, 80px lh — prose-style display */
.ac-prose-display-md   /* 64px, 68px lh */
.ac-prose-title        /* 56px, 60px lh — article title */
.ac-prose-lede         /* Compact, 24px, 400, 28px lh, 0.02em — opening paragraph */
.ac-prose-tagline      /* Narrow, 14px, 500, 16px lh, 0.14em, uppercase, fg-64 — tagline / dateline */
```

### Inside `.ac-prose`

Direct child rules style markdown-style content automatically:

- `h1` / `h2` / `h3` / `h4` / `h5` / `h6` — get scale tokens
- `p`, `ul`, `ol`, `li` — body styling, margins
- `em`, `strong`, `code`, `pre` — inline marks
- `blockquote` — with `cite` rendered as pseudo-element

**Skip on h2:** prose `h2` deliberately uses heading-03 size (32px), not heading-02 (40px). Jumps from heading-01 → heading-03 for a tighter visual hierarchy inside long copy.

## When to use `.ac-prose` vs `.ac-sans-body-01`

- **`.ac-prose`** — long-form content rendered from markdown or Portable Text. FAQ answer body. Article body. Wraps a content container.
- **`.ac-sans-body-01/02/03`** — UI body text. Card descriptions. Form helper text. Atomic, used on a single element.

## Cross-references

- Prose colors reference [[03-opacity|opacity.css]] tokens (`--ac-fg-80`, `--ac-fg-48`, `--ac-fg-64`).
- Code block styling inside `.ac-prose pre` uses `--ac-font-family-mono` — repointed by [[07-brand-typography|brand-typography]] to Right Grotesk Mono.

## What this file does NOT define

- **No mono classes.** That's [[05-typography-mono|typography-mono.css]].
- **No mono family token.** Same.
- **No color.** Prose uses `--ac-fg-*` from [[03-opacity|opacity.css]].

## When to edit this file

- Adding a new heading stop (e.g., `heading-00` for an even larger display) — be sparing; six stops is already a lot.
- Adjusting prose body styling — the most common edit, since editorial copy gets tuned per project.
- Adding `.ac-prose-*` sub-class for a new content pattern (timeline entry, callout, etc.).

Don't add brand-specific font overrides here. That's [[07-brand-typography|brand-typography.css]].
