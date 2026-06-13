---
title: AC CSS knowledge base
type: index
status: active
updated: 2026-05-19
description: Single source of truth for what every CSS file in this repo does. Read this before writing CSS or before believing an agent's claim that "we need a new class".
tags:
  - project/acyr
  - domain/css
  - domain/design-system
aliases:
  - ac-documentation
  - ac-css
---

# AC CSS knowledge base

The repo's CSS is laid out in **five tiers** that load in order. Tiers below override tiers above. Skipping a tier breaks theming. This folder documents what every tier owns, every class it defines, every gotcha that bit us once already.

## Why this exists

The repo has been growing CSS faster than it has been pruning it. Agents puke chunks of CSS into one page, forget the design system has the class already, and the file rots. The fix is not policing — it's reference. If you can find the class you need in two clicks, you stop reinventing it.

**Two rules** apply to every doc here:

1. **Tailwind-first.** If a Tailwind utility expresses the concept, use it. Don't write CSS for what `className="h-4"` already does. Reach for CSS only when Tailwind genuinely can't express the rule (pseudo-elements, descendant selectors, cascade-level theming).
2. **Use the DS class before inventing a new one.** Every kicker has [[02-tokens/05-typography-mono|ac-helper-12]]. Every heading has [[02-tokens/04-typography|ac-sans-heading-N]]. Every button picks up [[04-components/01-atoms|ac-btn ac-btn-primary]]. If you're writing `font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase;` you are reinventing `ac-helper-12`.

## The five tiers

| Tier | Lives in | What it owns |
|---|---|---|
| 1. Tokens | `packages/ds/tokens/` | Spacing, radius, surfaces, opacity ramps, font families, type scales, brand ramps, brand fonts. The vocabulary. |
| 2. Utilities | `packages/ds/utilities/` | Tiny generic helpers (`.flex-center`, `.sr-only`, `.text-balance`) and small typography helper classes. |
| 3. Components | `packages/ds/components/` | Reusable chrome: buttons, inputs, controls, pills, badges, popovers, table. The DS proper. |
| 4. Framework | `packages/ds/framework/` | Page scaffold: layout grid, sidenav, overlay, carousel, exit-preview, code blocks. |
| 5. App layers | `apps/*/src/styles/`, `apps/styleguide/src/editor/` | Per-app chrome that layers on top of the DS — website marketing sections, styleguide demos, editor surfaces. |

Cascade order is load-bearing — see [[01-cascade|cascade]].

## Cheat sheets — start here

The fastest route in. Open these before writing CSS.

| Cheat sheet | What it gives you |
|---|---|
| [[00-typography-cheatsheet\|00-typography-cheatsheet]] | Every text class in the repo, in tables. Class · family · size · weight · line-height · tracking · transform · use. |
| [[00-color-cheatsheet\|00-color-cheatsheet]] | Every color token and color class in the repo, in tables. Brand ramps with hex, surfaces (light + dark), accent, UI state, foreground opacity ramps (3 tiers × 14 stops × 3 properties), descriptor classes. |

## Sections

| Section | Contents |
|---|---|
| [[01-cascade\|01-cascade]] | The 13-import cascade in `packages/ds/index.css`. What loads when, what overrides what, what breaks if reordered. |
| `02-tokens/` | Reference for every token file: [[02-tokens/INDEX\|index]] · [[02-tokens/01-theme\|theme]] · [[02-tokens/02-color\|color]] · [[02-tokens/03-opacity\|opacity]] · [[02-tokens/04-typography\|typography]] · [[02-tokens/05-typography-mono\|typography-mono]] · [[02-tokens/06-brand-color\|brand-color]] · [[02-tokens/07-brand-typography\|brand-typography]] |
| `03-utilities/` | Generic helpers: [[03-utilities/INDEX\|index]] · [[03-utilities/01-utilities\|utilities]] · [[03-utilities/02-typography-helpers\|typography-helpers]] |
| `04-components/` | Buttons, inputs, pills, popovers, tables: [[04-components/INDEX\|index]] · [[04-components/01-atoms\|atoms]] · [[04-components/02-molecules\|molecules]] · [[04-components/03-organisms\|organisms]] |
| [[05-framework\|05-framework]] | Page scaffold + layout: `framework.css`. |
| `06-app-layers/` | App-tier CSS that builds on the DS: [[06-app-layers/INDEX\|index]] · [[06-app-layers/01-site\|site]] · [[06-app-layers/02-design-foundations\|design-foundations]] · [[06-app-layers/03-editor\|editor]] · [[06-app-layers/04-color-panel\|color-panel]] |
| [[07-finding-the-right-class\|07-finding-the-right-class]] | Decision tree — "I need to style X, where do I look?" |

## How to use this folder

- **Before writing a new class:** open [[07-finding-the-right-class|07-finding-the-right-class]] and grep for the concept (kicker, heading, button, surface, etc.). If it exists, use it.
- **Before reviewing an agent's diff:** check the relevant tier doc and flag any new CSS that reinvents something already documented.
- **When you add a new class or token:** update the matching reference doc. The whole point of this folder is staying current; a stale reference is worse than no reference.

## Framework conformance

All docs here follow the kol-docs framework spec at `docs/_framework/`. Frontmatter schema, archetypes, tag taxonomy, wikilink form — see [[../_framework/INDEX|_framework]].
