---
title: Finding the right class
type: guide
status: active
updated: 2026-05-19
description: Decision tree. You need to style something — here's where to look. Stops the "agent pukes a new CSS block" failure mode at the source.
aliases:
  - finding-the-right-class
  - class-decision-tree
audience: internal
tags:
  - project/acyr
  - domain/css
  - domain/design-system
related:
  - "[[INDEX|ac-documentation]]"
  - "[[01-cascade|cascade]]"
  - "[[02-tokens/INDEX|tokens]]"
  - "[[04-components/INDEX|components]]"
---

# Finding the right class

This is the doc to open **before** you write CSS. The goal: have you check 90 seconds of existing classes before you spend 30 minutes writing new ones that already exist.

## The decision tree

```
Need to style something
        │
        ▼
Can Tailwind express it?  ─── Yes ──►  Use Tailwind className. Stop.
        │
        No (or unclear)
        │
        ▼
Is it a known shape?  ─── Look up below.
```

## Common needs, mapped to existing classes

### "I need a section kicker / eyebrow label"

The small uppercase mono text above a section title.

```jsx
<span className="ac-helper-12 uppercase text-fg-48">Frequently asked</span>
```

→ [[02-tokens/05-typography-mono|`.ac-helper-12`]] (also `-8`, `-10`, `-14`, `-16`, `-20`).

**Don't write:** `font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; font-family: mono;` — that's exactly `.ac-helper-12 uppercase`.

### "I need a heading"

Six stops. Pick by visual weight.

```jsx
<h1 className="ac-sans-heading-01">Page hero</h1>
<h2 className="ac-sans-heading-02">Section title</h2>
<h3 className="ac-sans-heading-05">Card title</h3>
```

→ [[02-tokens/04-typography|`.ac-sans-heading-01..06`]].

### "I need body text"

For UI body (cards, form helper text):

```jsx
<p className="ac-sans-body-01">Default body</p>
<p className="ac-sans-body-02">UI body</p>
<p className="ac-sans-body-03">Small meta</p>
```

For editorial / long-form copy (FAQ answer, blog body):

```jsx
<div className="ac-prose">{markdownContent}</div>
```

→ [[02-tokens/04-typography|typography.css]].

### "I need a nav link"

Topnav, footer link, ProductCard meta:

```jsx
<a className="ac-sans-nav">About</a>
```

→ [[02-tokens/04-typography|`.ac-sans-nav`]].

### "I need a button"

```jsx
<button className="ac-btn ac-btn-primary ac-btn-md">Save</button>
```

Variants: `primary`, `secondary`, `accent`, `outline`, `ghost`, `quiet`. Sizes: `sm`, `md`, `lg`.

→ [[04-components/01-atoms|atoms.css]].

**Want a circular button?** Add Tailwind `w-7 h-7 rounded-full!` — the `!` (Tailwind v4 important suffix) is required because `.ac-btn` sets 4px radius later in cascade.

### "I need an input / select / textarea"

```jsx
<input className="ac-control ac-control--ghost ac-control-md" />
```

Variants: `--filled`, `--ghost`, `--outline`, `--textarea`. Sizes: `sm`, `md`, `lg`.

→ [[04-components/01-atoms|atoms.css]].

### "I need a pill / tag / badge"

```jsx
<span className="pill-outline pill-sm">Draft</span>
<button className="tag-control tag-md">Filter</button>
<span className="ac-badge-success ac-badge-sm">Shipped</span>
```

→ [[04-components/02-molecules|molecules.css]]. Pick: pill (label), tag (interactive), badge (status severity).

### "I need a dimmed text color"

```jsx
<p className="text-subtle">Captions</p>     {/* 24% */}
<p className="text-meta">Secondary labels</p>  {/* 48% */}
<p className="text-body">Body color</p>     {/* 64% */}
<p className="text-strong">Prominent body</p> {/* 80% */}
<p className="text-emphasis">Heading</p>    {/* 100% */}

{/* Or by stop */}
<p className="text-fg-48">…</p>
<p className="text-fg-64">…</p>
```

→ [[02-tokens/03-opacity|opacity.css]]. 14 stops available for fg / inverse / absolute tiers.

### "I need a faint hairline / divider"

```jsx
<div className="border-t border-fg-08">
```

→ [[02-tokens/03-opacity|opacity.css]] ramp utilities.

### "I need a subtle background fill"

```jsx
<div className="bg-fg-04">
<div className="bg-fg-08 hover:bg-fg-12">
```

→ Same — `.bg-fg-N` from [[02-tokens/03-opacity|opacity.css]].

### "I need a surface (primary / secondary / tertiary / inverse)"

```jsx
<section className="bg-surface-primary">     {/* page bg, on-primary text */}
<aside className="bg-surface-secondary">     {/* card / panel */}
<div className="bg-surface-inverse">         {/* dark band — use text-on-inverse for emphasis text */}
```

→ [[02-tokens/02-color|color.css]]. **Don't combine with separate `text-*`** — the surface class already sets paired text color.

**Inverse gotcha:** `text-emphasis` doesn't flip on `.bg-surface-inverse`. Use `.text-on-inverse` instead. (See [[02-tokens/02-color|color.css]] redeclaration note.)

### "I need a brand color"

```jsx
<div className="bg-brand-primary text-brand-on-primary">
<span className="text-accent-primary">           {/* magenta */}
<div className="bg-cream-300">                   {/* editorial neutral */}
<button className="bg-grey-900 text-grey-50">    {/* tinted neutral */}
<span className="text-brand-burgundy-200">       {/* burgundy 200 anchor */}
<span className="text-brand-magenta-200">        {/* magenta 200 anchor */}
```

→ [[02-tokens/06-brand-color|brand-color.css]]. Every ramp stop is available as a Tailwind utility.

### "I need a popover / tooltip"

```jsx
<div className="ac-popover">…</div>
<div className="ac-tooltip">Cmd+K <span className="ac-tooltip-key">⌘K</span></div>
```

→ [[04-components/02-molecules|molecules.css]]. Positioning is JS (Floating UI).

### "I need a page container"

```jsx
<div className="ac-page">
  <section className="ac-page-section">…</section>
</div>
```

→ [[05-framework|framework.css]]. `PageSection.jsx` provides the children — they own their own gap, don't add `mt-*`.

### "I need a fullscreen modal / image overlay"

```jsx
<FullscreenOverlay open={isOpen} onClose={close}>…</FullscreenOverlay>
```

→ `.ac-overlay` / `.ac-overlay-sheet` / `.ac-overlay-close` in [[05-framework|framework.css]]. JS lock handles `body { overflow: hidden }`.

### "I need a carousel"

```jsx
<Carousel>
  <div className="ac-embla-slide">…</div>
</Carousel>
```

→ `.ac-embla-*` family in [[05-framework|framework.css]]. Embla-driven.

### "I need a table"

Use `Table.jsx` from atoms — pass column definitions with `.ac-table-cell-title` / `-text` / `-meta` classes. The wrapper, head, row, and `.ac-table--simple` variant come for free.

→ [[04-components/03-organisms|organisms.css]].

### "I need a code block"

```jsx
<pre className="ac-codeblock">
  <span className="ac-codeblock-lang">js</span>
  <code>…</code>
  <button className="ac-codeblock-copy">Copy</button>
</pre>
```

→ [[05-framework|framework.css]].

### "I need to flex-center something"

Just use Tailwind: `flex items-center justify-center`. Or `.flex-center` from [[03-utilities/01-utilities|utilities.css]] if it reads cleaner.

### "I need a full-bleed section that escapes the page container"

Add to the [[06-app-layers/01-site|`site.css`]] `width: 100vw; margin-left: calc(50% - 50vw)` selector list, OR use [[03-utilities/01-utilities|`.fullbleed`]].

**Requires `scrollbar-gutter: stable` on root** to avoid layout shift. Already set in site.css.

## What NOT to do — pattern smells

### ❌ Reinventing typography

```css
/* DON'T — that's exactly .ac-helper-12 uppercase */
.my-section-kicker {
  font-family: 'Right Grotesk Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-weight: 500;
}
```

### ❌ Hardcoded brand colors

```css
/* DON'T — that's --brand-burgundy-200 or text-brand-burgundy-200 */
.my-thing {
  color: #750E20;
}
```

### ❌ Single-consumer styles for things Tailwind expresses

```css
/* DON'T — that's className="bg-fg-04 px-6 py-4 rounded" */
.my-card-shell {
  background: var(--ac-fg-04);
  padding: 16px 24px;
  border-radius: 4px;
}
```

Unless the same shell shows up in 4+ places, write it inline.

### ❌ Re-overriding DS defaults via specificity wars

If `.ac-btn` says 4px radius and you need a circle, **use `rounded-full!`**, don't write `.my-circular-button { border-radius: 9999px !important; }`. Tailwind v4's `!` suffix is the canonical override.

### ❌ Reaching for an arbitrary value when a DS class exists

```jsx
{/* DON'T */}
<div className="border-[color:var(--ac-fg-08)]">

{/* DO */}
<div className="border-fg-08">
```

The DS ramp utilities (`.bg-fg-N`, `.border-fg-N`, `.text-fg-N`) live in [[02-tokens/03-opacity|opacity.css]].

## The 30-second check

Before adding CSS, ask:

1. **Can Tailwind do it?** Open `tailwindcss.com/docs` mentally. If yes, use Tailwind.
2. **Does a DS class do it?** Grep the relevant tier reference doc — kicker → typography-mono, button → atoms, surface → color, ramp → opacity, brand → brand-color, layout → framework.
3. **Is this used in more than one place?** If yes and it's not just Tailwind, it might justify an app-layer class. If no, inline it as Tailwind.
4. **Is it animation-bound or coordinated with JS?** Then yes, it might need bespoke CSS in [[06-app-layers/01-site|site.css]] or [[06-app-layers/02-design-foundations|design-foundations.css]].

If you can't answer "no" to all four, you have your answer.

## When you DO write new CSS

If you genuinely need new CSS (passed the 30-second check):

1. **Pick the right tier.** Token? Utility? Component? Framework? App-layer? Look at [[01-cascade|cascade]] to be sure.
2. **Use the right tokens.** Reach for `var(--ac-fg-08)`, not `rgba(0,0,0,0.08)`. Reach for `var(--ac-radius-sm)`, not `4px`. Reach for `var(--ac-font-family-mono)`, not `'JetBrains Mono'`.
3. **Update the reference doc.** Add your class to the relevant doc in this folder so the next person finds it. Stale docs are how this repo got into trouble in the first place.

## When in doubt

Open [[INDEX|the pillar INDEX]] for the five-tier overview, then [[01-cascade|cascade]] for the load order, then the tier doc for the specific question.

If the right answer isn't documented yet — that's a doc gap, fix it. Don't write the CSS without writing the reference.
