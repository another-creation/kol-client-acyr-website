---
title: Typography cheat sheet
type: reference
status: canonical
updated: 2026-05-19
verified: 2026-05-19
description: Every text class in the repo, one table per category. Class · family · size · weight · line-height · tracking · transform · use. The doc to open before writing a single font-size in CSS.
aliases:
  - typography-cheatsheet
  - type-cheatsheet
  - text-cheatsheet
tags:
  - project/acyr
  - domain/css
  - domain/typography
  - domain/cheatsheet
covers:
  - every .ac-sans-* class (display, heading, body, nav)
  - every .ac-mono-N class (8/10/12/14/16/20)
  - every .ac-helper-N class (8/10/12/14/16/20)
  - t-shirt helpers (s/xs/xxs + .ac-mono-text)
  - every .ac-prose / .ac-prose-* class
  - every .ac-label-* clamp-driven class
  - Tailwind font-family utilities
sources:
  - packages/ds/tokens/typography.css
  - packages/ds/tokens/typography-mono.css
  - packages/ds/tokens/brand-typography.css
  - packages/ds/utilities/typography-helpers.css
  - packages/ds/components/atoms.css
related:
  - "[[00-color-cheatsheet|color-cheatsheet]]"
  - "[[02-tokens/04-typography|typography]]"
  - "[[02-tokens/05-typography-mono|typography-mono]]"
  - "[[07-finding-the-right-class|finding-the-right-class]]"
---

# Typography cheat sheet

**Every text class in the repo. Look here before writing `font-size:`.** All rows reflect the current state of `packages/ds/tokens/typography.css`, `typography-mono.css`, `brand-typography.css`, `utilities/typography-helpers.css`, `components/atoms.css`.

**Font families** in the cascade after the AC brand override:

| Family | Resolves to | Token | Tailwind |
|---|---|---|---|
| Right Grotesk (base) | sans serif | `--ac-font-family-sans` | `font-display` / `font-text` / `font-serif` |
| Right Grotesk Narrow | tight, top-of-scale | `--ac-font-family-sans-narrow` | `font-narrow` |
| Right Grotesk Compact | compressed mid-scale | `--ac-font-family-sans-compact` | — |
| Right Grotesk Mono | brand-overridden mono | `--ac-font-family-mono` | `font-mono` |

`Wide`, `Tall`, `Spatial`, `Tight`, `Text` cuts are `@font-face`'d but not tokenized — reach for them by literal family name only when nothing else works.

---

## Sans — display

Narrow cut. Weight 600. Line-height 100%. Sizes are responsive: **mobile → ≥768px → ≥1280px**.

| Class | Family | Size | Weight | LH | Tracking | Transform | Use |
|---|---|---|---|---|---|---|---|
| `.ac-sans-display-01` | Narrow | 56 → 80 → 96 px | 600 | 100% | tight | none | Page-hero supersize text |
| `.ac-sans-display-02` | Narrow | 44 → 56 → 64 px | 600 | 100% | tight | none | Below-hero display |
| `.ac-sans-display-03` | — | **deferred** — token exists, class not declared | — | — | — | — | Add when first consumer appears |

---

## Sans — heading

Six stops. **01–02** use Narrow (display-grade headings). **03–06** use Compact (UI-grade). All weight 500.

| Class | Family | Size | Weight | LH | Tracking | Transform | Use |
|---|---|---|---|---|---|---|---|
| `.ac-sans-heading-01` | Narrow | 48 → 56 → 64 px | 500 | 110% | tight | none | Page hero title |
| `.ac-sans-heading-02` | Narrow | 40 px | 500 | 110% | tight | none | Section title |
| `.ac-sans-heading-03` | Compact | 32 px | 500 | 120% | normal | none | Subsection title |
| `.ac-sans-heading-04` | Compact | 24 px | 500 | 120% | normal | none | Group heading |
| `.ac-sans-heading-05` | Compact | 20 px | 500 | 120% | normal | none | Card title, FAQ question |
| `.ac-sans-heading-06` | Compact | 16 px | 500 | 125% | normal | none | Inline emphasis heading |

---

## Sans — body

Base Right Grotesk. Weight 400. Generous line-height for reading.

| Class | Family | Size | Weight | LH | Use |
|---|---|---|---|---|---|
| `.ac-sans-body-01` | Right Grotesk | 16 px | 400 | 160% | Default body |
| `.ac-sans-body-02` | Right Grotesk | 14 px | 400 | 160% | UI body, form helper text |
| `.ac-sans-body-03` | Right Grotesk | 12 px | 400 | 150% | Meta, small UI, footer |

---

## Sans — nav

| Class | Family | Size | Weight | LH | Tracking | Transform | Use |
|---|---|---|---|---|---|---|---|
| `.ac-sans-nav` | Narrow | 12 px | 500 | 1 | 0.08em | uppercase | Topnav links, Footer links, ProductCard meta, Marquee labels |

---

## Mono — body scale (`.ac-mono-N`)

Right Grotesk Mono (after brand override; DS-default was JetBrains Mono). Weight 400. **Has line-height** — for multi-line content.

| Class | Family | Size | Weight | LH | Use |
|---|---|---|---|---|---|
| `.ac-mono-8` | Mono | 8 px | 400 | 12 px | Sub-meta values |
| `.ac-mono-10` | Mono | 10 px | 400 | 14 px | Compact value display |
| `.ac-mono-12` | Mono | 12 px | 400 | 16 px | Tabular values, code excerpts |
| `.ac-mono-14` | Mono | 14 px | 400 | 18 px | Default mono body |
| `.ac-mono-16` | Mono | 16 px | 400 | 22 px | Code block body, prose code |
| `.ac-mono-20` | Mono | 20 px | 400 | 26 px | Featured mono value |

---

## Mono — helper / label scale (`.ac-helper-N`)

Same family. Weight **500**. **Line-height 1**, letter-spaced. Single-line labels, kickers, eyebrows.

| Class | Family | Size | Weight | LH | Tracking | Use |
|---|---|---|---|---|---|---|
| `.ac-helper-8` | Mono | 8 px | 500 | 1 | 0.10em | Tiniest metadata stamp |
| `.ac-helper-10` | Mono | 10 px | 500 | 1 | 0.10em | Dateline, sub-kicker |
| `.ac-helper-12` | Mono | 12 px | 500 | 1 | 0.06em | Default section kicker — most common |
| `.ac-helper-14` | Mono | 14 px | 500 | 1 | 0.06em | Medium kicker |
| `.ac-helper-16` | Mono | 16 px | 500 | 1 | 0.06em | Large kicker, FAQ kicker |
| `.ac-helper-20` | Mono | 20 px | 500 | 1 | 0.06em | Hero kicker |

**Common pattern:** combine with `uppercase` and a `text-fg-NN` for color: `<span className="ac-helper-12 uppercase text-fg-48">…</span>`

---

## Mono — t-shirt helpers (legacy)

Survivors from the t-shirt-scale era before numeric naming. Sized by `--ac-text-helper-*` tokens declared in `brand-typography.css`. **Default to `.ac-helper-N` (numeric) for new code.**

| Class | Family | Size | Weight | LH | Tracking | Use |
|---|---|---|---|---|---|---|
| `.ac-helper-s` | Mono | 14 px (`--ac-text-helper-s`) | 500 | 1 | 0.06em | Legacy mid-size label |
| `.ac-helper-xs` | Mono | 12 px (`--ac-text-helper-xs`) | 500 | 1 | 0.06em | Legacy small label |
| `.ac-helper-xxs` | Mono | 10 px (`--ac-text-helper-xxs`) | 500 | 1 | 0.10em | Legacy tiny label |
| `.ac-mono-text` | Mono | 14 px | 400 | 1.5 | normal | Generic mono body fallback |

---

## Prose family — editorial / long-form

`.ac-prose` is the body class for markdown / Portable Text content. Sub-classes used inside or as wrappers for editorial layouts.

| Class | Family | Size | Weight | LH | Tracking | Color | Use |
|---|---|---|---|---|---|---|---|
| `.ac-prose` | Right Grotesk | 16 px | 300 | 24 px | 0.02em | `fg-80` | Body container, max-width 720px |
| `.ac-prose-label` | Mono | 12 px | 500 | 1 | 0.1em | `fg-48` | Section eyebrow inside prose, uppercase |
| `.ac-prose-display` | Right Grotesk | 80 px | 500 | 80 px | tight | inherit | Prose-style display |
| `.ac-prose-display-md` | Right Grotesk | 64 px | 500 | 68 px | tight | inherit | Mid prose display |
| `.ac-prose-title` | Right Grotesk | 56 px | 500 | 60 px | tight | inherit | Article title |
| `.ac-prose-lede` | Compact | 24 px | 400 | 28 px | 0.02em | inherit | Opening paragraph |
| `.ac-prose-tagline` | Narrow | 14 px | 500 | 16 px | 0.14em | `fg-64` | Dateline / tagline, uppercase |

**Inside `.ac-prose`** the following elements auto-style: `h1`–`h6`, `p`, `ul`, `ol`, `li`, `em`, `strong`, `code`, `pre`, `blockquote`. Prose `h2` deliberately uses heading-03 size (32px), not heading-02 (40px) — tighter visual hierarchy.

---

## Clamp-driven label scale (atoms.css)

Responsive labels — size scales between min and max via `clamp()`. Used by `SectionLabel.jsx`.

| Class | Family | Size (clamp) | Weight | LH | Tracking | Transform | Alias | Use |
|---|---|---|---|---|---|---|---|---|
| `.ac-label-mono-sm` | Mono | clamp(14, …, 24) px | 470 | 1 | 0.05em | uppercase | `.ac-label` | Section label, default |
| `.ac-label-mono-md` | Mono | clamp(12, …, 16) px | 470 | 1 | 0.05em | uppercase | — | Smaller responsive label |
| `.ac-label-mono-xs` | Mono | clamp(10, …, 14) px | 470 | 1 | 0.05em | uppercase | — | Tiny responsive label |
| `.ac-label-compact-lg` | Mono | clamp(24, …, 28) px | 500 | 1 | 0.03em | uppercase | — | Large responsive label |
| `.ac-label-compact-md` | Mono | clamp(12, …, 16) px | 500 | 1 | 0.03em | uppercase | `.ac-label-compact` | Smaller compact label |

The two aliases (`.ac-label` → `.ac-label-mono-sm`, `.ac-label-compact` → `.ac-label-compact-md`) are interchangeable in markup.

---

## Tailwind font-family utilities

Generated from `@theme` blocks in typography.css + typography-mono.css.

| Tailwind utility | `--font-*` token | Resolves to |
|---|---|---|
| `font-display` | `--font-display` | Right Grotesk |
| `font-text` | `--font-text` | Right Grotesk |
| `font-serif` | `--font-serif` | Right Grotesk |
| `font-narrow` | `--font-narrow` | Right Grotesk Narrow |
| `font-mono` | `--font-mono` | Right Grotesk Mono (after brand override) |

**No** `font-compact` utility — Compact is reached via the explicit `.ac-sans-heading-03..06` classes, not Tailwind. Add to `@theme` in `typography.css` if you need it Tailwind-accessible.

---

## Picking the right class — quick map

| You're styling | Reach for |
|---|---|
| Section kicker / eyebrow (uppercase label) | `.ac-helper-12 uppercase` (or `-14`, `-16`, `-20` for larger) |
| Page hero text | `.ac-sans-display-01` or `.ac-sans-heading-01` |
| Section title | `.ac-sans-heading-02` |
| Subsection / card title | `.ac-sans-heading-03` to `-05` |
| Body UI text | `.ac-sans-body-01/02/03` |
| Editorial body (markdown / article) | `.ac-prose` container |
| Top nav link, Footer link, Product meta | `.ac-sans-nav` |
| Tabular data, code, value display | `.ac-mono-12/14/16` |
| Inline code (one-liner) | `.ac-mono-12` or Tailwind `font-mono text-sm` |
| Responsive section label | `.ac-label` (auto-clamp) |

---

## Do not

- **Don't write `font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; font-family: mono;`.** That's literally `ac-helper-12 uppercase`.
- **Don't hardcode `'Right Grotesk Narrow'` etc. as font-family literals.** Use the token or a class that consumes it.
- **Don't combine `text-fg-NN` with `.ac-prose`** to change color — prose body color is already `fg-80` by design.
- **Don't reach for the t-shirt helpers (`-s/-xs/-xxs`) in new code.** Use numeric `.ac-helper-N`.
