---
title: site-typography.css
type: reference
status: active
updated: 2026-05-21
verified: 2026-05-21
description: Website role-layer typography. ~20 classes named by *where* the text renders (page hero, mid-section, card, cart row, back link, etc.). Single tuning surface for the website's typography. Lives at apps/website/src/styles/site-typography.css.
aliases:
  - site-typography
  - site-typography-css
  - role-layer
  - typography-roles
tags:
  - project/acyr
  - domain/css
  - domain/typography
audience: internal
covers:
  - role-by-region naming convention
  - 20 role classes (nav / footer / hero / section / card / form / back-link / status / quote)
  - inversion via data-theme="dark" scope
  - relationship to DS classes (.ac-prose stays for editorial body)
  - what's in scope vs atom-tier
sources:
  - apps/website/src/styles/site-typography.css
related:
  - "[[INDEX|app layers index]]"
  - "[[01-site|site.css]]"
  - "[[../00-typography-cheatsheet|typography cheatsheet]]"
  - "[[../02-tokens/04-typography|DS typography tokens]]"
---

# site-typography.css

The website's role-layer. **One file is the source of truth for the typography of `apps/website/src/` page + site layer.** Every text-bearing JSX call site uses a `.site-*` role class. To change the visual register of any region — edit one rule here.

## Why this exists

The website had drift. Same conceptual role (page-hero kicker, card name, footer label) rendered with different DS classes per file. Per-page edits compounded the drift. The role layer collapses each conceptual slot to one named class. Retuning is one CSS edit; the call site doesn't change.

## The convention

- **Role classes are named by where they render**, not by primitive size.
- **One role per text slot.** A consumer doesn't pick a class — the JSX semantic context determines the role.
- **Roles bake the full spec**: family + size + weight + line-height + tracking + case + color + margin.
- **Font families and brand colors pull from DS tokens** (so brand swap cascades).
- **Sizes / weights / tracking are raw values** (so the site iterates independently of the DS).

## The roles

Six groups, ~20 rules.

### Nav + footer chrome — Narrow uppercase

| Role | Spec | Where |
|---|---|---|
| `.site-link-nav` | Narrow 12 · 500 · 0.08em · uppercase | Top nav link |
| `.site-link-footer` | Narrow 12 · 500 · 0.08em · uppercase · lh 1.5 | Footer link list item |
| `.site-label-footer` | Mono 12 · 500 · 0.10em · uppercase · fg-48 | Footer column title ("Studio", "Browse", etc.) |

Scope rule: `.ac-site-nav-drawer .site-link-nav { font-size: 14px }` — drawer scales nav links.

### Page heroes — the opening section of a page

| Role | Spec | Where |
|---|---|---|
| `.site-display-eyebrow` | Mono 24 · 600 · 0.10em · uppercase · accent | Home hero kicker (loud, brand-color callout) |
| `.site-eyebrow-hero` | Mono 12 · 500 · 0.10em · uppercase · fg-48 | All other page-hero kickers |
| `.site-title-hero` | Narrow clamp(56,8vw,96) · 500 · -0.01em · lh 1.05 | Marketing hero h1 (Home / About / Journal / Collections / Shop / Handmade) |
| `.site-title-page` | Narrow 64 · 500 · -0.01em · lh 68px | Secondary-page h1 (legal / detail / 404 states) |
| `.site-subline-hero` | Compact 24 · 400 · 0.02em · lh 28px | Marketing-page subline (sentence) + mid-section body |
| `.site-tagline` | Narrow 14 · 500 · 0.14em · uppercase · fg-64 | Secondary-page subline (uppercase one-liner) |

### Mid-page section openers

| Role | Spec | Where |
|---|---|---|
| `.site-eyebrow-section` | Mono 12 · 500 · 0.10em · uppercase · fg-48 | Mid-section kicker (identical spec to `.site-eyebrow-hero`; separate role so they can tune independently) |
| `.site-title-section` | Narrow 64 · 500 · -0.01em · lh 68px | Mid-section h2 |

### Cards (catalog + cart + editorial)

| Role | Spec | Where |
|---|---|---|
| `.site-name-card` | Narrow 12 · 500 · 0.08em · uppercase · emphasis | Product name (ProductCard, CartDrawer rows, Checkout aside, OrderConfirmation rows). Also: PDP size pill, qty values, totals values. |
| `.site-meta-card` | Narrow 12 · 500 · 0.08em · uppercase · fg-64 | Price, size · color line, qty meta, total labels |
| `.site-meta-editorial` | Mono 12 · 500 · 0.10em · uppercase · fg-48 | Journal byline / date / reading-time, Collection card label, Look label, definition-term labels, About figcaption |

### Forms

| Role | Spec | Where |
|---|---|---|
| `.site-label-form` | Mono 10 · 500 · 0.10em · uppercase · emphasis | Field labels (Checkout, PDP control labels — Color / Size / Quantity / Details / About this piece) |
| `.site-body-footer` | Narrow 14 · 500 · 0.04em · normal-case · fg-80 | Footer body copy (FooterNewsletter description + native input) |

### Back link, status, system body

| Role | Spec | Where |
|---|---|---|
| `.site-back-link` | Mono 12 · 500 · 0.10em · uppercase · fg-64 (hover emphasis) | All "← Back" / "← Previous" / "Next →" links. Canonical; replaces 3 prior variants. |
| `.site-meta-status` | Mono 10 · 500 · 0.10em · uppercase · fg-48 | Uppercase chrome — 404 labels, breadcrumbs, "ESC" hint, Cmd-K section badges, subtotal / total / bag-count labels |
| `.site-meta-system` | Mono 11 · 400 · 0.04em · normal-case · fg-48 · lh 1.4 | Sentence-case body — footer copyright, error messages, helper text ("Continue shopping", "Secure via PayPal", "Tracking will be emailed…"), empty state, "No results.", Brand swatch labels |

### Quote + row

| Role | Spec | Where |
|---|---|---|
| `.site-quote` | Sans clamp(32,4.5vw,64) · 700 · italic · -0.005em · lh 1.2 · emphasis | Testimonial pull quote |
| `.site-quote-cite` | Mono 12 · 500 · 0.10em · uppercase · fg-64 | Testimonial cite |
| `.site-title-row` | Compact 20 · 500 · lh 1.25 · emphasis | Row title (FAQ question, future row-style components) |

## Inversion convention

**Don't maintain parallel `*-inverse` role classes.** Instead, wrap dark-surface sections in `data-theme="dark"`:

```jsx
<section data-theme="dark" className="bg-surface-inverse ...">
  <p className="site-eyebrow-section">Independent Studio</p>
  <h2 className="site-title-section">Support my Journey</h2>
</section>
```

The role classes reference `--ac-surface-on-primary` + `--ac-fg-NN` which flip correctly under the theme scope. The DS has a known bug where `.bg-surface-inverse` alone doesn't fully flip the descriptor aliases — always pair it with `data-theme="dark"` until that's fixed.

Current consumers: `SupportCTA`, `Newsletter`, `Marquee`, `HandmadeCard` (inner div), `SignupOverlay` (sidelabel surface uses `.bg-surface-inverse text-auto` pattern).

## Relationship to DS classes

| Layer | What it owns | Examples |
|---|---|---|
| **Role layer** (this file) | Consumer-tier text register at JSX call sites | `.site-name-card`, `.site-eyebrow-hero`, `.site-meta-status` |
| **DS tokens** (`packages/ds/tokens/`) | Font families, color tokens, spacing scale | `var(--ac-font-family-sans-narrow)`, `var(--ac-fg-48)` |
| **DS prose** (`.ac-prose`) | Editorial long-form body | Blog posts, legal-page bodies, BlogBody-rendered Sanity content |
| **DS atoms** (Button / Input / Dropdown / etc.) | Internal text of interactive controls | `.ac-mono-12` inside `Button` size=sm |

**The role layer covers consumer-tier text only.** Atom internals stay on DS classes. Editorial body stays on `.ac-prose`. Brand swap propagates because roles reference DS family + color tokens.

## When to use a role class

- Editing typography in `apps/website/src/components/site/` or `apps/website/src/pages/`.
- The text slot has a clear conceptual role (page-hero kicker, card name, etc.).
- The role exists in this file.

## When NOT to use a role class

- **You're inside an atom** (`Button`, `Input`, `Dropdown`, etc.). Edit the atom's internal `.ac-mono-N` reference instead.
- **The text is editorial body inside `.ac-prose`**. Use the DS prose container.
- **The role doesn't exist yet.** Add one — don't reach for a Tailwind arbitrary `text-[Npx]` value as a workaround.

## Adding a new role

1. The text slot must be **a real conceptual role** that recurs or is significant enough to name. Not a one-off.
2. Add the rule to `site-typography.css` in the appropriate group (or create a new group if it doesn't fit).
3. Reference DS tokens for font-family and color so brand swap cascades.
4. Declare size / weight / tracking / line-height in raw values.
5. Document the role here (this file).
6. Update the call site to use the new class. Don't leave the old arbitrary value behind.

## Anti-patterns (these are why the role layer exists)

- `<p style={{ fontSize: 13, lineHeight: 1.4 }}>` — inline-style typography. Use a role.
- `<h2 className="ac-sans-heading-02 text-[64px]!">` — DS class force-scaled with `!`. Use the right role (`.site-title-section`).
- `<p className="ac-prose-label">` outside an editorial-body context. `.ac-prose-label` is for inside `.ac-prose`; use `.site-eyebrow-section` or `.site-eyebrow-hero` instead.
- `.ac-helper-xxs uppercase text-meta tracking-widest` repeated 8 times across files. That's a role waiting to be named.
- Parallel `.site-*-inverse` variants for dark surfaces. Use `data-theme="dark"` on the section wrapper.

## Audit

The role-layer migration that produced this file is documented at [[../../../client/kol-client-acyr/01-website/06-style-audit/INDEX|the website style audit]] — 6 docs covering inventory, structural duplication, regional drift, element census, and the sweep notes log.
