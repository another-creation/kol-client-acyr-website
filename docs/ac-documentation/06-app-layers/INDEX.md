---
title: App layers
type: index
status: active
updated: 2026-05-21
description: Per-app CSS that layers on top of the DS — website marketing chrome, website typography role layer, styleguide specimen styles, editor surfaces.
aliases:
  - app-layers
tags:
  - project/acyr
  - domain/css
related:
  - "[[../01-cascade|cascade]]"
  - "[[../INDEX|ac-documentation]]"
---

# App layers

The four files in this section live in the consumer apps, not in the DS package. They layer on top of the entire DS cascade and own per-app concerns: the website's marketing landing sections, the styleguide's specimen demos, the editor's chrome and color picker.

**This is where the repo got into trouble.** The user's brief:

> the repo dropped using styles, every agent just pukes chunks of CSS rules that live sometimes at one page and then are just forgotten

The pattern is: someone needs a new section, agent writes 80 lines of bespoke CSS into one of these files. The DS already had three out of four classes covered. The CSS rots.

The two rules from [[../INDEX|the pillar INDEX]] apply doubly here:

1. **Tailwind-first.** If `className="bg-fg-04 px-4 py-2"` works, don't write `.site-something-card { ... }`.
2. **Use the DS class.** If you're styling a kicker, eyebrow, heading, button — the class exists in [[../02-tokens/04-typography|typography]] / [[../02-tokens/05-typography-mono|typography-mono]] / [[../04-components/INDEX|components]]. Find it before inventing.

## Files

| File | App | Lines | Owns |
|---|---|---|---|
| [[01-site\|01-site]] | `apps/website` | ~700 | Marketing landing sections (intro, marquee, anchor, gallery, testimonial breadcrumbs), site nav layout, footer layout, product card hover, newsletter strip |
| [[02-design-foundations\|02-design-foundations]] | `apps/styleguide` | 736 | Asset figures, mood tiles, swatches, ramp grids, combo lab, spectrum grid, color anatomy, accordion |
| [[03-editor\|03-editor]] | `apps/styleguide/src/editor` | 297 | Editor shell layout (rails + canvas), compose rail, layer rows, canvas backgrounds |
| [[04-color-panel\|04-color-panel]] | `apps/styleguide/src/editor` | 406 | Self-contained color picker (macOS-style panel with its own scoped tokens — no DS integration) |
| [[05-site-typography\|05-site-typography]] | `apps/website` | ~250 | Website typography role layer — ~20 `.site-*` classes named by where text renders (page hero, section, card, cart row, back link, etc.). Single tuning surface for the site's typography. |

## What each layer should look like

**A healthy app-layer file** is mostly:

- Page-level grids and full-bleed escapes (the `width: 100vw` trick).
- Bespoke chrome for the few sections that genuinely can't be done with Tailwind + DS classes (animation-bound elements, multi-element coordinated transitions, full-page hero choreography).
- App-specific overrides of DS defaults when the app intentionally diverges from the brand-neutral default.

**A sick app-layer file** has:

- Single-consumer card styles ("`.site-feature-kicker`" — only used by one component).
- Hardcoded font families ("`font-family: 'Right Grotesk Compact'`") when `--ac-font-family-sans-compact` exists.
- Duplicate utility-style rules ("`.site-anchor-link-num { font-size: 11px; letter-spacing: 0.14em; uppercase }`" — that's `.ac-helper-12 uppercase`).
- Dead breadcrumb comments from purged blocks (`/* Testimonial fully inlined in Testimonial.jsx */`).
- Duplicate rule blocks (saw one in `.site-anchor-link--client`).

Each file's reference doc flags the specific smells observed.

## When to add to an app layer

- **The animation can't live anywhere else.** GSAP-driven intro hero. Marquee seamless loop. Carousel grab cursors. These are page-specific and tightly coupled to JS — they belong here.
- **The full-bleed escape pattern is structural.** Sections that need `width: 100vw` to break out of the centered page column. The `.site-intro/-marquee/-anchor/-sig/-gallery` family — these belong here.
- **The override of a DS default is intentional and app-specific.** E.g., the website wants `.ac-product-card [data-overlay]` to always be visible on touch (no-hover) devices. Layering on top of the component class is fair.

## When to NOT add to an app layer

- **Anything Tailwind can express.** Padding, gap, font-size, color, flex, grid — all Tailwind.
- **Anything the DS already does.** Heading scale, kicker, body, button, pill, input, badge — DS.
- **Anything used in one page that could be inlined as `className`.** Single-consumer CSS is a smell — either it shouldn't exist (use Tailwind) or it should be a real reusable component.

The audit findings in each file's doc list the specific blocks that fail these tests.
