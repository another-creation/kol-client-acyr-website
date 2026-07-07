---
title: molecules.css
type: reference
status: canonical
updated: 2026-05-19
verified: 2026-05-19
description: Pill, Tag, Badge, Popover, and Tooltip molecules. Composite single-purpose pill-shaped status/label components plus floating panel chrome.
aliases:
  - molecules
  - pills
  - badges
tags:
  - project/acyr
  - domain/css
  - domain/components
covers:
  - .ac-popover, .ac-tooltip, .ac-tooltip-key
  - .pill-inverse / -subtle / -outline (3 variants × 3 sizes)
  - .tag-control + .tag-sm/md/lg + .control-unified-inverse
  - .ac-badge-default / -secondary / -destructive / -outline / -success / -warning / -critical / -info (8 variants × 3 sizes)
sources:
  - packages/ds/components/molecules.css
related:
  - "[[INDEX|components]]"
  - "[[01-atoms|atoms]]"
  - "[[03-organisms|organisms]]"
---

# molecules.css

Five molecule families: popover, tooltip, pill, tag, badge. Pill and Tag and Badge overlap — see "Redundancy" at bottom.

## Popover

Floating panel chrome (positioning is JS — Floating UI).

```css
.ac-popover    /* secondary surface, 1px fg-08 border, 6px radius, shadow, z-index 1000 */
```

## Tooltip

Hover-triggered text label. Pointer-events disabled so it can't intercept clicks.

```css
.ac-tooltip       /* inline-flex, 4px 4px 4px 8px padding, 6px radius, mono 11px, nowrap, shadow */
.ac-tooltip-key   /* keyboard-shortcut chip nested inside */
```

## Pill — `.pill-*`

Status / label pill. Three variants × three sizes. Always full-radius (rounded endpoints).

### Variants

```css
.pill-inverse    /* inverted: on-primary bg, primary text */
.pill-subtle     /* 16% on-primary mix bg, no border */
.pill-outline    /* primary surface bg, on-primary text, default border */
```

### Sizes

```css
.pill-sm    /* 10px font, weight 470, 2px 10px padding */
.pill-md    /* 12px font, weight 470, 4px 16px padding */
.pill-lg    /* 14px font, weight 470, 6px 20px padding */
```

## Tag — `.tag-control`

Control-like pill with interactive state (active/hover). Three sizes plus an inverted modifier.

### Base + sizes

```css
.tag-control    /* base — inline-flex, 4px 16px padding, full radius, primary surface, 10px mono */
.tag-sm         /* 10px font, 4px 10px padding */
.tag-md         /* 12px font, 5px 12px padding */
.tag-lg         /* 14px font, 6px 14px padding */
```

### States

```css
.tag-control:hover           /* 24% on-primary mix bg, border transparent */
.tag-control.is-active       /* 24% on-primary mix bg, border matches bg */
```

### Inverse variant

```css
.control-unified-inverse           /* legacy inverted modifier — on-primary bg, primary text */
.control-unified-inverse:hover     /* inverts to primary bg, on-primary text */
```

## Badge — `.ac-badge-*`

Status indicator. **Eight variants** × three sizes. Some hex literals (not token-driven yet).

### Variants

```css
.ac-badge-default       /* on-primary bg, primary text */
.ac-badge-secondary     /* 12% on-primary mix bg */
.ac-badge-destructive   /* 20% #ef4444 mix bg, #ef4444 text, 30% border */
.ac-badge-outline       /* transparent bg, default border */
.ac-badge-success       /* 20% #22c55e mix bg, #22c55e text, 30% border */
.ac-badge-warning       /* 20% #eab308 mix bg, #eab308 text, 30% border */
.ac-badge-critical      /* 20% #ef4444 mix bg — same color as destructive, distinct semantic */
.ac-badge-info          /* 20% #3b82f6 mix bg, #3b82f6 text, 30% border */
```

### Sizes

```css
.ac-badge-sm    /* 20px height, 0 6px padding, 10px font */
.ac-badge-md    /* 24px height, 0 8px padding, 12px font */
.ac-badge-lg    /* 28px height, 0 12px padding, 14px font */
```

### Token-vs-hex inconsistency

`destructive` / `success` / `warning` / `critical` / `info` all use **literal hex** colors. The DS has `--ui-error`, `--ui-success`, `--ui-warning`, `--ui-info` tokens in [[../02-tokens/02-color|color.css]] that would be the right thing to reference. Flagged in the source comment as a future consolidation. Treat the hex values as a known smell, not the canonical pattern.

## Variables consumed

`--ac-surface-primary`, `--ac-surface-secondary`, `--ac-surface-on-primary`, `--ac-surface-on-secondary`, `--ac-fg-08`, `--ac-radius-full`, `--ac-font-family-mono`, `--ac-border-default`, `--ac-transition-base`. Status colors are literal hex (see above).

## Pill vs Tag vs Badge — when to use which

The three families overlap. Source comment flags this for future consolidation, but until then:

- **Pill** — pure label. No state. Reach for when you're displaying a category, status word, or tag (in the colloquial sense — "draft", "published", "shipped").
- **Tag** — interactive label. Has hover + active states. Reach for when the user can click it (filter chip, selectable category).
- **Badge** — status indicator. Often paired with severity colors (success, warning, error). Reach for when the value is semantic state (system health, operation result).

If you're unsure, default to **Pill**. It's the most generic and the simplest.

## Notable redundancy

- **Pill ↔ Badge overlap.** `.pill-subtle` and `.ac-badge-secondary` both use 16%/12% on-primary mix backgrounds. Visually nearly identical. Distinct semantics (label vs status) — keep both, but consider consolidating in a DS hygiene pass.
- **`.pill-inverse` ↔ `.control-unified-inverse`** — both implement inversion but belong to different families. Same observation.
- **`.ac-badge-destructive` ↔ `.ac-badge-critical`** — identical color (#ef4444). Intentional. Severity language vs. ARIA-language naming; both call sites are valid.

## When to edit this file

- **Adding a new badge severity** — migrate status colors to tokens first, then add the variant.
- **Adding a new pill or tag variant** — register the variant class, plus hover/active state for tag.
- **Consolidating Pill/Tag/Badge** — significant refactor; coordinate with consumer code.

Status color literals → tokens is the most-requested cleanup here.
