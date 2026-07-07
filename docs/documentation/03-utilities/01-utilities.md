---
title: utilities.css
type: reference
status: canonical
updated: 2026-05-19
verified: 2026-05-19
description: Seven generic layout and accessibility helpers. .flex-center, .absolute-center, .text-balance, .breakpoint-padding, .fullbleed, .sr-only, .text-trim, .hide-number-spinners.
aliases:
  - utilities
  - layout-helpers
tags:
  - project/acyr
  - domain/css
  - domain/utilities
covers:
  - .flex-center / .absolute-center centering primitives
  - .text-balance, .text-trim text-rendering helpers
  - .breakpoint-padding responsive container padding
  - .fullbleed viewport-edge escape
  - .sr-only screen-reader-only
  - .hide-number-spinners form helper
sources:
  - packages/ds/utilities/utilities.css
related:
  - "[[INDEX|utilities]]"
---

# utilities.css

A small set of generic helpers. Use them when a Tailwind utility doesn't read as cleanly, or when a component CSS rule needs to compose with them internally.

## Layout + positioning

### `.flex-center`

Flexbox with content centered both ways. Equivalent to `flex items-center justify-center`.

```css
.flex-center
```

### `.absolute-center`

Absolute positioning + transform-centered. Equivalent to `absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2`.

```css
.absolute-center
```

### `.text-balance`

`text-wrap: balance` for more even line breaks on multi-line headings. Modern browsers only — degrades silently.

```css
.text-balance
```

### `.breakpoint-padding`

Responsive horizontal padding pinned to KOL standard breakpoints (768 / 1024).

```css
.breakpoint-padding    /* 1rem mobile, 1.25rem md, 1.5rem lg */
```

Not Tailwind-driven — hardcoded to KOL's chosen breakpoints. Use on route page wrappers when you want consistent inset behaviour without ad-hoc Tailwind.

### `.fullbleed`

Escapes parent container to span 100vw edge-to-edge.

```css
.fullbleed   /* width: 100vw; margin-left: calc(50% - 50vw) */
```

**Only safe** on direct children of a centered column shell with no `overflow: hidden`. Pair with `:root { scrollbar-gutter: stable }` (already set in [[../06-app-layers/01-site|site.css]]) to prevent layout shift when scrollbars appear.

If you're using `.fullbleed` and a marketing landing section needs to escape the page container — also see the **manual** `width: 100vw; margin-left: calc(50% - 50vw)` pattern used in [[../06-app-layers/01-site|site.css]] for `.site-intro`, `.site-marquee`, etc. The site sections roll the same math inline rather than reaching for `.fullbleed` — historical, could be consolidated.

## Accessibility

### `.sr-only`

Visually hidden but readable by screen readers. Standard implementation.

```css
.sr-only   /* clip:rect(0,0,0,0) etc. */
```

Use for icon-only buttons that need text labels for assistive tech:

```jsx
<button>
  <Icon name="cart" />
  <span className="sr-only">Open cart</span>
</button>
```

### `.text-trim`

Modern `text-box-trim` (Chrome 133+, Safari 18.2+). Trims cap baseline gaps for tighter vertical centering on UI labels.

```css
.text-trim
```

**Opt-in only.** Browser support is recent; fall back to padding adjustments for production-critical text alignment.

## Form helpers

### `.hide-number-spinners`

Suppress native browser spinner arrows on `<input type="number">`.

```css
.hide-number-spinners
```

Apply to the input itself, not the wrapper.

## What this file does NOT define

- **No typography classes.** Those live in [[../02-tokens/04-typography|typography.css]] and [[02-typography-helpers|typography-helpers.css]].
- **No component chrome.** Those live in [[../04-components/INDEX|components]].
- **No colors.** Those live in [[../02-tokens/02-color|color.css]] and [[../02-tokens/06-brand-color|brand-color.css]].

## Header notes — historical drops

The file header documents classes intentionally dropped in past sweeps:

- `bg-opacity-hex-*` (Phase 5 sync)
- `inverse-*` variants
- `.reveal*` family
- Various brand filter utilities

These are NOT dead code — they were removed. If an old commit references them, that's history. Don't re-add without a strong reason.

## When to edit this file

- **Adding a new generic helper** that gets reused across many pages and reads cleaner as a single class than as a Tailwind utility stack.
- **Adjusting `.breakpoint-padding` values** if the project standardises different inset rhythms.

Most additions to this file are mistakes — Tailwind probably already has the utility. Before adding, search Tailwind docs.
