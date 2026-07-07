---
title: atoms.css
type: reference
status: canonical
updated: 2026-05-19
verified: 2026-05-19
description: The biggest DS file. Owns .ac-control (input/select/textarea shell), .ac-btn (all button variants + sizes), toggles, switches, sliders, sidenav primitives, label scale, icon swap pattern.
aliases:
  - atoms
  - buttons
  - controls
tags:
  - project/acyr
  - domain/css
  - domain/components
covers:
  - .ac-control + variants (filled/ghost/outline/textarea) + sizes (sm/md/lg)
  - .ac-btn + variants (primary/secondary/accent/outline/ghost/quiet) + sizes
  - .ac-icon-swap-container pattern
  - .toggle-bracket--active
  - .toggle-switch (incl. plain variant)
  - .toggle-checkbox
  - .control-slider / .slider-black
  - .ac-sidenav-hop / -hops / -group / link.is-active
  - .ac-label-mono-* + .ac-label-compact-* + aliases
  - .ac-page-section-divider
  - .icon-default / .icon-hover generic swap
sources:
  - packages/ds/components/atoms.css
related:
  - "[[INDEX|components]]"
  - "[[02-molecules|molecules]]"
  - "[[05-framework/INDEX|framework]]"
---

# atoms.css

The biggest single CSS file in the DS. Owns most of the interactive chrome: input shells, button variants, toggles, switches, sliders, sidenav primitives, label classes, icon swap. If you're styling a button or input, this is the place.

## `.ac-control` — the input shell

Generic shell used by Input, Select, Textarea, Stepper, Dropdown trigger. Inline-flex, 4px radius, 150ms transitions, pointer cursor.

### Variants

```css
.ac-control--filled      /* persistent secondary surface bg */
.ac-control--ghost       /* transparent at rest, fg-04 bg, border on hover/focus-within */
.ac-control--outline     /* bordered + transparent (forced-reveal for ghost) */
.ac-control--textarea    /* flips to block display for multiline */
```

### Sizes

```css
.ac-control-sm    /* padding: 4px 12px */
.ac-control-md    /* padding: 6px 16px */
.ac-control-lg    /* padding: 8px 20px */
```

### States

```css
.ac-control[aria-disabled="true"]
.ac-control:disabled
.ac-control:has(:disabled)
```

All disable to `opacity: 0.5` + `pointer-events: none`.

### Decorative

```css
.ac-textarea-resize-icon   /* bottom-right resize affordance */
```

## `.ac-btn` — the button atom

Inline-flex, center-aligned, 4px radius, 150ms transitions. **Use this for every button.** Don't roll your own.

### Variants

```css
.ac-btn-primary      /* subtle secondary surface fill (default) */
.ac-btn-secondary    /* heavy inverted ink on light grey (weight 500) */
.ac-btn-accent       /* brand-yellow filled CTA (weight 500) */
.ac-btn-outline      /* bordered, transparent bg */
.ac-btn-ghost        /* transparent, dimmed text (fg-48) */
.ac-btn-quiet        /* dimmed at rest (opacity-disabled), brightens on hover */
```

### Sizes

```css
.ac-btn-sm    /* padding: 4px 12px */
.ac-btn-md    /* padding: 6px 16px */
.ac-btn-lg    /* padding: 8px 20px */
```

### Modifier

```css
.ac-btn-animate    /* disables default :hover state (consumer-driven animation) */
```

### States

```css
.ac-btn:hover       /* shifts bg-color + color per variant */
.ac-btn:disabled    /* opacity-disabled + cursor: not-allowed */
.ac-btn-quiet:not(:disabled):hover    /* opacity: 1 */
```

### The `rounded-full!` gotcha — load-bearing

`.ac-btn` sets `border-radius: var(--ac-radius-sm)` (4px). It loads later than Tailwind utilities, so:

```jsx
<button className="ac-btn ac-btn-primary rounded-full">…</button>
{/* ❌ Renders with 4px radius — .ac-btn wins specificity tie */}

<button className="ac-btn ac-btn-primary rounded-full!">…</button>
{/* ✓ Tailwind important suffix beats .ac-btn — circle */}
```

Same applies to padding, border-color, etc. Whenever you need to override DS button defaults with Tailwind, reach for the `!` suffix.

Real fix is wrapping atoms.css in `@layer components` so Tailwind utilities sit naturally above. Tracked as DS hygiene. Not done yet.

### Button-atom visuals on non-button elements

You can apply `ac-btn ac-btn-primary` to a `<span>` or `<a>` if you need the button look without a real `<button>` — example: FAQ accordion toggle nested inside `<summary>` (can't nest interactive). The classes give border, hover background, transition, cursor, flex-centering. Add Tailwind for shape and dimensions.

## Icon swap (Button.jsx internal)

Two-icon swap on hover. Used internally by Button when `iconHover` prop is set.

```css
.ac-icon-swap-container   /* wrapper, relative, inline-flex, overflow hidden */
.ac-icon-default          /* default icon — visible at rest */
.ac-icon-hover            /* hover icon — slides up from -4px translateY */
```

## Generic icon swap (button:hover / a:hover)

Reusable pattern for any hover-swap icon — not specific to Button.

```css
.icon-default    /* visible at rest, fades + translates on parent hover */
.icon-hover      /* hidden at rest, fades + translates in on parent hover */
```

Triggers on `button:hover`, `a:hover`, `.section-label-wrapper:hover`. Parent needs `overflow: hidden` (or use the `.ac-icon-swap-container` wrapper).

## Toggle Bracket

Used by `ToggleBracket.jsx` (molecule):

```css
.toggle-bracket--active    /* accent-yellow bg with matching text */
```

## Toggle Switch (`ToggleSwitch.jsx`)

```css
.toggle-switch                /* wrapper: flex row, 10/14px padding, 4px radius, subtle border */
.toggle-switch-label          /* 11px mono uppercase 0.08em */
.toggle-switch-indicator      /* 20×12px pill, rounded-full */
.toggle-switch-indicator::after  /* 8×8px slider dot inside */

.toggle-switch--plain         /* variant: no padding/border/bg — pure label-and-pill */
```

States:

```css
.toggle-switch[data-state='on']    /* indicator: white bg, dot translates 8px right, dot bg: black */
.toggle-switch:hover               /* border color increases 12% → 18% */
.toggle-switch:focus-visible       /* same as hover */
```

Uses absolute white/black colors (theme-invariant) — toggle on/off must look distinct regardless of theme.

## Toggle Checkbox (`ToggleCheckbox.jsx`)

```css
.toggle-checkbox                /* wrapper: inline-flex gap 8 */
.toggle-checkbox-indicator      /* 16×16px box, 3px radius, 1px border */
.toggle-checkbox-indicator svg  /* check stroke */
.toggle-checkbox.is-active      /* white bg, no border, check opacity 1 */
```

Same theme-invariant logic — uses `--ac-color-absolute-white` and `--ac-color-absolute-black`.

## Slider (`Slider.jsx`)

Two variants — default and subtle.

### Default

```css
.control-slider           /* inline-flex row, 24px tall, transparent */
.control-slider label     /* fg-80 label */
.control-slider span      /* 64px-wide value display, secondary surface */
```

### Subtle

```css
.control-slider-subtle             /* 6px 16px padding, secondary surface, transitions */
.control-slider-subtle label       /* fg-48 dimmer label */
```

### Native range slider chrome

```css
.slider-black                                         /* base, 2px track height */
.slider-black::-webkit-slider-runnable-track          /* webkit track */
.slider-black::-moz-range-track                       /* firefox track */
.slider-black::-webkit-slider-thumb                   /* 12×12px circle thumb */
.slider-black::-moz-range-thumb                       /* firefox thumb */
```

Custom `--ac-slider-track` variable on `.slider-black` allows per-instance track color override via inline style.

## Sidenav primitives (used by framework.css responsive layout)

Defined here (atoms layer); responsive cascade rules live in [[05-framework/INDEX|framework.css]].

```css
.ac-sidenav-hop          /* nav row, icon + label, uppercase 0.06em */
.ac-sidenav-hop-icon     /* icon slot */
.ac-sidenav-hop-label    /* label slot — hidden in rail mode by framework.css */
.ac-sidenav-hops         /* container */
.ac-sidenav-group        /* vertical group, padding 4px 0 */
```

Active state via dot indicator:

```css
.ac-sidenav-link.is-active::before    /* 4px circle, accent color, absolute positioned */
```

Position controlled by custom `--ac-sidenav-dot-left` variable (default 2px) — consumers override for indent levels.

## Label scale (`SectionLabel.jsx`)

Five clamp-driven label classes plus two aliases.

```css
.ac-label-mono-sm       /* clamp(14–24px), weight 470, mono uppercase 0.05em */
.ac-label-mono-md       /* clamp(12–16px), weight 470, mono uppercase 0.05em */
.ac-label-mono-xs       /* clamp(10–14px), weight 470, mono uppercase 0.05em */
.ac-label-compact-lg    /* clamp(24–28px), weight 500, mono uppercase 0.03em */
.ac-label-compact-md    /* clamp(12–16px), weight 500, mono uppercase 0.03em */

.ac-label               /* alias → .ac-label-mono-sm */
.ac-label-compact       /* alias → .ac-label-compact-md */
```

These are **clamp-driven, responsive** — different from the numeric helper scale ([[../02-tokens/05-typography-mono|`.ac-helper-N`]] is fixed-pixel). Reach for these when you want responsive label sizing.

## Page section divider

```css
.ac-page-section-divider    /* negative -64px top margin, 64px bottom; hidden on first .ac-page-section */
```

Migrated here from [[05-framework/INDEX|framework.css]] on 2026-04-30. Used to visually separate stacked `PageSection` children.

## Variables consumed

`--ac-radius-sm`, `--ac-radius-full`, `--ac-surface-*`, `--ac-fg-absolute-04`, `--ac-fg-08/16/48/64/80/88/96`, `--ac-color-absolute-white/-black`, `--ac-accent-primary*`, `--ac-border-default`, `--ac-font-family-mono`, `--ac-transition-base`, `--ac-opacity-disabled`. Slider-specific `--ac-slider-track` and sidenav-specific `--ac-sidenav-dot-left`.

## Notable redundancy

- `.ac-label` and `.ac-label-mono-sm` are both used in the codebase. Aliases, not dead code.
- Icon swap appears twice: `.ac-icon-swap-*` (Button-internal) and `.icon-default` / `.icon-hover` (generic). Two patterns for similar intent — keep both for now, but reach for the generic when extending.

## When to edit this file

- **Adding a new button variant** — register the variant class, hover state, disabled override. Document the use case in this file.
- **Adding a new control variant** — same as button.
- **Adjusting the cascade-tie gotcha** — moving `.ac-btn` into `@layer components` so Tailwind wins. DS hygiene work.

Don't add page-level chrome here. That's [[05-framework/INDEX|framework.css]]. Don't add bespoke per-page styles — those belong in app layers.
