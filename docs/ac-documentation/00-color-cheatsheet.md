---
title: Color cheat sheet
type: reference
status: canonical
updated: 2026-05-19
verified: 2026-05-19
description: Every color token + every color class in the repo, in tables. Brand ramps, surfaces (light + dark), accent, UI state, foreground opacity ramps (standard / inverse / absolute), text-role descriptors. The doc to open before writing a single hex value.
aliases:
  - color-cheatsheet
  - colors-cheatsheet
tags:
  - project/acyr
  - domain/css
  - domain/color
  - domain/tokens
  - domain/cheatsheet
covers:
  - --brand-burgundy / -cream / -grey / -magenta ramps with full hex values
  - --brand-primary / -secondary role pair
  - --ac-accent-* (rebound to magenta)
  - --ac-surface-* tiers (light + dark mode)
  - --ui-* state colors
  - --ac-border-default / -focus / focus-ring
  - --ac-color-absolute-white/-black
  - --ac-fg-NN, --ac-fg-inverse-NN, --ac-fg-absolute-NN (3 tiers × 14 stops each)
  - .bg-fg-NN / .text-fg-NN / .border-fg-NN classes (+ hover + inverse + absolute variants)
  - .text-subtle/-meta/-body/-strong/-emphasis descriptor classes
  - all .bg-brand-* / .text-brand-* / .bg-grey-* / .text-grey-* / .bg-cream-* / .text-cream-* utility classes
  - .bg-surface-* / .elevation-* / .text-on-inverse / .text-on-primary
sources:
  - packages/ds/tokens/color.css
  - packages/ds/tokens/opacity.css
  - packages/ds/tokens/brand-color.css
related:
  - "[[00-typography-cheatsheet|typography-cheatsheet]]"
  - "[[02-tokens/02-color|color]]"
  - "[[02-tokens/03-opacity|opacity]]"
  - "[[02-tokens/06-brand-color|brand-color]]"
  - "[[07-finding-the-right-class|finding-the-right-class]]"
---

# Color cheat sheet

**Every color token and color class in the repo. Look here before writing `color:` or `background:`.** Reflects the current state of `packages/ds/tokens/color.css`, `opacity.css`, `brand-color.css`.

---

## Brand — Burgundy ramp

AC's brand identity hue. **Anchor at 200** (`#750E20`).

| Stop | CSS var | Tailwind bg | Tailwind text | Hex | Notes |
|---|---|---|---|---|---|
| 100 | `--brand-burgundy-100` | `bg-brand-burgundy-100` | `text-brand-burgundy-100` | `#943143` | Lightest |
| **200** | `--brand-burgundy-200` | `bg-brand-burgundy-200` | `text-brand-burgundy-200` | `#750E20` | ★ **anchor — the AC red** |
| 300 | `--brand-burgundy-300` | `bg-brand-burgundy-300` | `text-brand-burgundy-300` | `#5A0816` | Dark Maroon |
| 400 | `--brand-burgundy-400` | `bg-brand-burgundy-400` | `text-brand-burgundy-400` | `#3A0008` | Deep Wine |
| 500 | `--brand-burgundy-500` | `bg-brand-burgundy-500` | `text-brand-burgundy-500` | `#290006` | Darkest |

---

## Brand — Cream ramp

Project-flavoured utility neutral. Two anchors: **300 (Champagne)** and **400 (Sand Gold)**.

| Stop | CSS var | Tailwind bg | Tailwind text | Hex | Notes |
|---|---|---|---|---|---|
| 100 | `--cream-100` | `bg-cream-100` | `text-cream-100` | `#FBF7EE` | Near-white, on-brand-primary text |
| 200 | `--cream-200` | `bg-cream-200` | `text-cream-200` | `#F8F1E0` | — |
| **300** | `--cream-300` | `bg-cream-300` | `text-cream-300` | `#F2E5CB` | ★ Champagne Beige |
| **400** | `--cream-400` | `bg-cream-400` | `text-cream-400` | `#F2D9A9` | ★ Sand Gold |
| 500 | `--cream-500` | `bg-cream-500` | `text-cream-500` | `#D9B97A` | Darkest |

---

## Brand — Grey ramp

Legacy 10-stop neutral. Not part of brand identity — use when you need tonal neutral that isn't tied to AC.

| Stop | CSS var | Tailwind bg | Tailwind text | Hex |
|---|---|---|---|---|
| 50 | `--grey-50` | `bg-grey-50` | `text-grey-50` | `#FCFBFB` |
| 100 | `--grey-100` | `bg-grey-100` | `text-grey-100` | `#EBEBEB` |
| 200 | `--grey-200` | `bg-grey-200` | `text-grey-200` | `#DBDBDB` |
| 250 | `--grey-250` | `bg-grey-250` | `text-grey-250` | `#C5C5C6` |
| 300 | `--grey-300` | `bg-grey-300` | `text-grey-300` | `#A3A3A4` |
| 400 | `--grey-400` | `bg-grey-400` | `text-grey-400` | `#5B5B5D` |
| 500 | `--grey-500` | `bg-grey-500` | `text-grey-500` | `#363639` |
| 600 | `--grey-600` | `bg-grey-600` | `text-grey-600` | `#2E2E30` |
| 700 | `--grey-700` | `bg-grey-700` | `text-grey-700` | `#242427` |
| 800 | `--grey-800` | `bg-grey-800` | `text-grey-800` | `#1B1B1E` |
| 900 | `--grey-900` | `bg-grey-900` | `text-grey-900` | `#131316` |

---

## Brand — Magenta ramp

AC accent pop. Distinct from burgundy — vivid pink-red for focus rings, quote marks, accent moments. **Anchor at 200**.

| Stop | CSS var | Tailwind bg | Tailwind text | Hex | Notes |
|---|---|---|---|---|---|
| 100 | `--brand-magenta-100` | `bg-brand-magenta-100` | `text-brand-magenta-100` | `#E04565` | Lightest |
| **200** | `--brand-magenta-200` | `bg-brand-magenta-200` | `text-brand-magenta-200` | `#CE1842` | ★ **anchor — current accent** |
| 300 | `--brand-magenta-300` | `bg-brand-magenta-300` | `text-brand-magenta-300` | `#A11335` | Darker, used for `-strong` |
| 400 | `--brand-magenta-400` | `bg-brand-magenta-400` | `text-brand-magenta-400` | `#730D26` | — |
| 500 | `--brand-magenta-500` | `bg-brand-magenta-500` | `text-brand-magenta-500` | `#480818` | Darkest |

---

## Brand roles (the rebrand contract)

**Four lines** that define AC's brand. Edit these to rebrand without touching consumers.

| Token | CSS var | Tailwind | Resolves to | Use |
|---|---|---|---|---|
| Brand primary | `--brand-primary` | `bg-brand-primary` | `--brand-burgundy-200` (#750E20) | Dominant brand color |
| On brand primary | `--brand-on-primary` | `text-brand-on-primary` | `--cream-100` (#FBF7EE) | Ink on brand-primary |
| Brand secondary | `--brand-secondary` | `bg-brand-secondary` | `--cream-300` (#F2E5CB) | Secondary brand color |
| On brand secondary | `--brand-on-secondary` | `text-brand-on-secondary` | `--brand-burgundy-300` (#5A0816) | Ink on brand-secondary |

---

## Accent (rebound by brand layer)

DS-neutral default is ink. The AC brand layer rebinds these to magenta.

| Token | CSS var | Tailwind | Resolves to (after rebind) | Use |
|---|---|---|---|---|
| Accent primary | `--ac-accent-primary` | `bg-accent-primary` / `text-accent-primary` | `--brand-magenta-200` (#CE1842) | Buttons, focus rings, accent moments |
| Accent on-primary | `--ac-accent-on-primary` | `text-accent-on-primary` / `bg-accent-on-primary` | `--cream-100` (#FBF7EE) | Ink on accent-primary |
| Accent primary strong | `--ac-accent-primary-strong` | `text-accent-primary-strong` | `--brand-magenta-300` (#A11335) | Hover / active accent |

---

## Surface tiers — light mode (default)

Four tiers, each with a paired ink color.

| Tier | CSS var (bg) | CSS var (ink) | Bg hex | Ink hex | Utility |
|---|---|---|---|---|---|
| Primary | `--ac-surface-primary` | `--ac-surface-on-primary` | `#FAFAFA` | `#121215` | `.bg-surface-primary` |
| Secondary | `--ac-surface-secondary` | `--ac-surface-on-secondary` | `#F2F2F2` | `#19191D` | `.bg-surface-secondary` |
| Tertiary | `--ac-surface-tertiary` | `--ac-surface-on-tertiary` | `#FFFFFF` | `#0E0E11` | `.bg-surface-tertiary` |
| Inverse | `--ac-surface-inverse` | `--ac-surface-on-inverse` | `#0E0E11` | `#FCFBF8` | `.bg-surface-inverse` |

---

## Surface tiers — dark mode (`[data-theme="dark"]` or `prefers-color-scheme: dark`)

Surfaces flip. **Inverse stays as inverse** (light band on dark page).

| Tier | Bg hex (dark) | Ink hex (dark) |
|---|---|---|
| Primary | `#121215` | `#FAFAFA` |
| Secondary | `#19191D` | `#F8F8F8` |
| Tertiary | `#0E0E11` | `#FFFFFF` |
| Inverse | `#FCFBF8` | `#0E0E11` |

---

## Surface + elevation utilities

| Class | Background | Ink | Use |
|---|---|---|---|
| `.bg-surface-primary` | primary | on-primary | Page background |
| `.bg-surface-secondary` | secondary | on-secondary | Card / panel one tier up |
| `.bg-surface-tertiary` | tertiary | on-tertiary | Nested card |
| `.bg-surface-inverse` | inverse | on-inverse | Dark band on light theme, vice versa |
| `.elevation-base` | primary | on-primary | Semantic alias for primary |
| `.elevation-raised` | secondary | on-secondary | Semantic alias for secondary |
| `.elevation-elevated` | tertiary | on-tertiary | Semantic alias for tertiary |

Use **one** of these — they set bg AND ink in a single class. Don't combine with `text-*` unless explicitly overriding.

---

## Basic + state utilities

| Class | Result | Use |
|---|---|---|
| `.text-auto` | color: on-primary | Default ink on primary surface |
| `.text-inverse` | color: on-inverse | Ink on inverse surface |
| `.bg-auto` | bg: primary | Primary surface background only |
| `.bg-fg` | bg: on-primary | Foreground-colored fill (inverse-ish band) |
| `.border-auto` | border-color: default | 8% ink hairline |
| `.divider-auto` | 1px default border | Standard divider |
| `.border-surface` | border-color: primary | Border matching primary surface — for use on `.bg-fg` |
| `.border-surface-08` | 8% primary | 8% surface, on `.bg-fg` |
| `.border-surface-16` | 16% primary | 16% surface, on `.bg-fg` |
| `.hover:border-hover` | default border on hover | Hover hairline |
| `.focus:border-focus` | focus border on focus | Focus reveal |
| `.focus-visible:border-focus` | focus border (keyboard) | Keyboard focus |
| `.focus-visible:ring-focus` | 2px outline at focus ring | Keyboard focus ring |
| `.text-on-inverse` | color: on-inverse | **Workaround:** `text-emphasis` doesn't flip inside `.bg-surface-inverse` — use this instead |
| `.text-on-primary` | color: on-primary | Full-emphasis ink |

---

## UI state colors

Direct hex. Not ramp-dependent. Registered in `@theme` so Tailwind utilities work (`bg-ui-error`, `text-ui-warning`, etc.).

| Token | CSS var | Tailwind | Default | `:root[data-theme="light"]` | Use |
|---|---|---|---|---|---|
| Error | `--ui-error` | `bg-ui-error` / `text-ui-error` | `#B91C1C` | `#DC2626` | Destructive operations, errors |
| Warning | `--ui-warning` | `bg-ui-warning` / `text-ui-warning` | `#EAB308` | `#CA8A04` | Caution, attention |
| Info | `--ui-info` | `bg-ui-info` / `text-ui-info` | `#1D4ED8` | `#2563EB` | Informational notices |
| Success | `--ui-success` | `bg-ui-success` / `text-ui-success` | `#15803D` | `#16A34A` | Completion, confirmation |

---

## Border / focus tokens

| Token | CSS var | Resolves to | Use |
|---|---|---|---|
| Border default | `--ac-border-default` | 8% on-primary mixed with transparent | Hairlines, dividers |
| Border focus | `--ac-border-focus` | 70% accent + 30% on-primary | Focused input border |
| Focus ring | `--ac-focus-ring` | `--ac-accent-primary` (magenta) | Keyboard focus outline |

---

## Absolute colors (theme-invariant)

| Token | CSS var | Tailwind | Hex |
|---|---|---|---|
| White | `--ac-color-absolute-white` | `bg-absolute-white` / `text-absolute-white` | `#FFFFFF` |
| Black | `--ac-color-absolute-black` | `bg-absolute-black` / `text-absolute-black` | `#000000` |

Use when the value must stay the same across themes — toggle dots, marquee black, etc.

---

## Foreground opacity — standard tier (`--ac-fg-NN`)

Computed from `--ac-surface-on-primary`. **Auto-flips inside `.bg-surface-inverse`** (the surface selector redeclares the entire ramp). Most code uses this tier even on dark surfaces — the redeclaration handles it.

| Stop | CSS var | `bg-fg-NN` | `text-fg-NN` | `border-fg-NN` | Hover variants |
|---|---|---|---|---|---|
| 01 | `--ac-fg-01` | `.bg-fg-01` | `.text-fg-01` | `.border-fg-01` | `.hover:bg-fg-01` · `.hover:text-fg-01` · `.hover:border-fg-01` |
| 02 | `--ac-fg-02` | `.bg-fg-02` | `.text-fg-02` | `.border-fg-02` | `.hover:bg-fg-02` · `.hover:text-fg-02` · `.hover:border-fg-02` |
| 04 | `--ac-fg-04` | `.bg-fg-04` | `.text-fg-04` | `.border-fg-04` | `.hover:bg-fg-04` · `.hover:text-fg-04` · `.hover:border-fg-04` |
| 08 | `--ac-fg-08` | `.bg-fg-08` | `.text-fg-08` | `.border-fg-08` | `.hover:bg-fg-08` · `.hover:text-fg-08` · `.hover:border-fg-08` |
| 12 | `--ac-fg-12` | `.bg-fg-12` | `.text-fg-12` | `.border-fg-12` | `.hover:bg-fg-12` · `.hover:text-fg-12` · `.hover:border-fg-12` |
| 16 | `--ac-fg-16` | `.bg-fg-16` | `.text-fg-16` | `.border-fg-16` | `.hover:bg-fg-16` · `.hover:text-fg-16` · `.hover:border-fg-16` |
| 24 | `--ac-fg-24` | `.bg-fg-24` | `.text-fg-24` | `.border-fg-24` | `.hover:bg-fg-24` · `.hover:text-fg-24` · `.hover:border-fg-24` |
| 32 | `--ac-fg-32` | `.bg-fg-32` | `.text-fg-32` | `.border-fg-32` | `.hover:bg-fg-32` · `.hover:text-fg-32` · `.hover:border-fg-32` |
| 40 | `--ac-fg-40` | `.bg-fg-40` | `.text-fg-40` | `.border-fg-40` | `.hover:bg-fg-40` · `.hover:text-fg-40` · `.hover:border-fg-40` |
| 48 | `--ac-fg-48` | `.bg-fg-48` | `.text-fg-48` | `.border-fg-48` | `.hover:bg-fg-48` · `.hover:text-fg-48` · `.hover:border-fg-48` |
| 64 | `--ac-fg-64` | `.bg-fg-64` | `.text-fg-64` | `.border-fg-64` | `.hover:bg-fg-64` · `.hover:text-fg-64` · `.hover:border-fg-64` |
| 80 | `--ac-fg-80` | `.bg-fg-80` | `.text-fg-80` | `.border-fg-80` | `.hover:bg-fg-80` · `.hover:text-fg-80` · `.hover:border-fg-80` |
| 88 | `--ac-fg-88` | `.bg-fg-88` | `.text-fg-88` | `.border-fg-88` | `.hover:bg-fg-88` · `.hover:text-fg-88` · `.hover:border-fg-88` |
| 96 | `--ac-fg-96` | `.bg-fg-96` | `.text-fg-96` | `.border-fg-96` | `.hover:bg-fg-96` · `.hover:text-fg-96` · `.hover:border-fg-96` |
| 100 | (`--ac-surface-on-primary`) | `.bg-fg` | `.text-fg` | `.border-fg` | — |

**Pattern shorthand for any stop:** `(.bg-fg-NN | .text-fg-NN | .border-fg-NN | .hover:<that>-fg-NN)`

---

## Foreground opacity — inverse tier (`--ac-fg-inverse-NN`)

Same 14 stops, computed from `--ac-surface-on-inverse`. Use when **explicitly** painting on `.bg-surface-inverse`. In most cases the standard tier's redeclaration handles it automatically; reach for the inverse tier when scoping fails.

| Stop | CSS var | `bg-fg-inverse-NN` | `text-fg-inverse-NN` | `border-fg-inverse-NN` |
|---|---|---|---|---|
| 01 | `--ac-fg-inverse-01` | `.bg-fg-inverse-01` | `.text-fg-inverse-01` | `.border-fg-inverse-01` |
| 02 | `--ac-fg-inverse-02` | `.bg-fg-inverse-02` | `.text-fg-inverse-02` | `.border-fg-inverse-02` |
| 04 | `--ac-fg-inverse-04` | `.bg-fg-inverse-04` | `.text-fg-inverse-04` | `.border-fg-inverse-04` |
| 08 | `--ac-fg-inverse-08` | `.bg-fg-inverse-08` | `.text-fg-inverse-08` | `.border-fg-inverse-08` |
| 12 | `--ac-fg-inverse-12` | `.bg-fg-inverse-12` | `.text-fg-inverse-12` | `.border-fg-inverse-12` |
| 16 | `--ac-fg-inverse-16` | `.bg-fg-inverse-16` | `.text-fg-inverse-16` | `.border-fg-inverse-16` |
| 24 | `--ac-fg-inverse-24` | `.bg-fg-inverse-24` | `.text-fg-inverse-24` | `.border-fg-inverse-24` |
| 32 | `--ac-fg-inverse-32` | `.bg-fg-inverse-32` | `.text-fg-inverse-32` | `.border-fg-inverse-32` |
| 40 | `--ac-fg-inverse-40` | `.bg-fg-inverse-40` | `.text-fg-inverse-40` | `.border-fg-inverse-40` |
| 48 | `--ac-fg-inverse-48` | `.bg-fg-inverse-48` | `.text-fg-inverse-48` | `.border-fg-inverse-48` |
| 64 | `--ac-fg-inverse-64` | `.bg-fg-inverse-64` | `.text-fg-inverse-64` | `.border-fg-inverse-64` |
| 80 | `--ac-fg-inverse-80` | `.bg-fg-inverse-80` | `.text-fg-inverse-80` | `.border-fg-inverse-80` |
| 88 | `--ac-fg-inverse-88` | `.bg-fg-inverse-88` | `.text-fg-inverse-88` | `.border-fg-inverse-88` |
| 96 | `--ac-fg-inverse-96` | `.bg-fg-inverse-96` | `.text-fg-inverse-96` | `.border-fg-inverse-96` |
| 100 | (`--ac-surface-on-inverse`) | `.bg-fg-inverse` | `.text-fg-inverse` | `.border-fg-inverse` |

Hover variants exist for `bg-fg-inverse-NN` and `text-fg-inverse-NN` and `border-fg-inverse-NN` — same `.hover:` prefix pattern.

---

## Foreground opacity — absolute tier (`--ac-fg-absolute-NN`)

Theme-invariant. Always against pure black `#000000`. Doesn't flip in dark mode. Use for components that must look the same across themes.

| Stop | CSS var | `bg-fg-absolute-NN` |
|---|---|---|
| 01 | `--ac-fg-absolute-01` | `.bg-fg-absolute-01` |
| 02 | `--ac-fg-absolute-02` | `.bg-fg-absolute-02` |
| 04 | `--ac-fg-absolute-04` | `.bg-fg-absolute-04` |
| 08 | `--ac-fg-absolute-08` | `.bg-fg-absolute-08` |
| 12 | `--ac-fg-absolute-12` | `.bg-fg-absolute-12` |
| 16 | `--ac-fg-absolute-16` | `.bg-fg-absolute-16` |
| 24 | `--ac-fg-absolute-24` | `.bg-fg-absolute-24` |
| 32 | `--ac-fg-absolute-32` | `.bg-fg-absolute-32` |
| 40 | `--ac-fg-absolute-40` | `.bg-fg-absolute-40` |
| 48 | `--ac-fg-absolute-48` | `.bg-fg-absolute-48` |
| 64 | `--ac-fg-absolute-64` | `.bg-fg-absolute-64` |
| 80 | `--ac-fg-absolute-80` | `.bg-fg-absolute-80` |
| 88 | `--ac-fg-absolute-88` | `.bg-fg-absolute-88` |
| 96 | `--ac-fg-absolute-96` | `.bg-fg-absolute-96` |

The absolute tier has `bg-fg-absolute-NN` background classes. Text and border classes are not generated for this tier — reach for the variable directly if needed: `style={{ color: 'var(--ac-fg-absolute-48)' }}`.

---

## Text-role descriptor classes

Semantic aliases over the standard fg ramp. Equivalent stops in parentheses.

| Class | Equivalent stop | CSS var | Hover variant | Use |
|---|---|---|---|---|
| `.text-subtle` | fg-24 | — | `.hover:text-subtle` | Captions, faint metadata |
| `.text-meta` | fg-48 | — | `.hover:text-meta` | Secondary labels, kicker color |
| `.text-body` | fg-64 | — | `.hover:text-body` | Default body color |
| `.text-strong` | fg-80 | — | `.hover:text-strong` | Prominent body |
| `.text-emphasis` | fg-100 (on-primary directly) | — | `.hover:text-emphasis` | Headings, full-emphasis text |

**Gotcha:** `.text-emphasis` does NOT flip on `.bg-surface-inverse`. Use `.text-on-inverse` (above) on dark surfaces.

---

## Picking the right color — quick map

| You need | Reach for |
|---|---|
| Full-emphasis text | `.text-emphasis` (or `.text-on-inverse` on dark surfaces) |
| Body color | `.text-body` (or `.text-fg-64`) |
| Dimmed meta | `.text-meta` (or `.text-fg-48`) |
| Captions, very faint | `.text-subtle` (or `.text-fg-24`) |
| Hairline divider | `border-t border-fg-08` |
| Faint card fill | `bg-fg-04` |
| Hover-darken fill | `bg-fg-04 hover:bg-fg-08` |
| Brand accent text | `text-accent-primary` (magenta) |
| Brand identity bg | `bg-brand-primary text-brand-on-primary` |
| Cream editorial bg | `bg-cream-300` (Champagne) or `bg-cream-400` (Sand Gold) |
| Dark band on light theme | `bg-surface-inverse text-on-inverse` |
| Light card on dark theme | `bg-surface-secondary` (auto-flips with theme) |
| Status: error | `bg-ui-error text-absolute-white` or `text-ui-error` |
| Status: success | `bg-ui-success` etc. |
| Burgundy specific stop | `text-brand-burgundy-200` etc. |
| Magenta specific stop | `text-brand-magenta-200` etc. |
| Greyscale neutral (legacy) | `bg-grey-900 text-grey-50` etc. |

---

## Do not

- **Don't hardcode hex.** `#750E20` should be `text-brand-burgundy-200` (or `var(--brand-burgundy-200)`).
- **Don't write `color: rgba(0,0,0,0.48)`.** That's `text-fg-48` (or `--ac-fg-48`).
- **Don't write `border: 1px solid rgba(0,0,0,0.08)`.** That's `border-fg-08` (or `--ac-border-default`).
- **Don't combine `.bg-surface-*` with `.text-*`** to set text color. The surface class already sets the paired text. Override only when you specifically need to.
- **Don't use `.text-emphasis` on `.bg-surface-inverse`.** It doesn't flip. Use `.text-on-inverse`.
- **Don't reach for `.bg-grey-*` for brand-flavoured neutrals.** Use cream — `.bg-cream-100/200/300/400/500`.
- **Don't add a new ramp stop without registering it in `@theme`** in `brand-color.css`. The Tailwind utility won't generate without it.
