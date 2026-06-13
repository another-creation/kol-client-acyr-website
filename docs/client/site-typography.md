---
title: Site typography — role layer
type: reference
status: active
updated: 2026-05-21
verified: 2026-05-21
description: The website's typography role layer. `apps/website/src/styles/site-typography.css` is the single tuning surface — ~20 classes named by *where* the text renders. This doc captures both the migration that shipped it and the catalog of roles for ongoing use.
audience: agency-internal
tags:
  - project/acyr
  - domain/website
  - domain/typography
sources:
  - apps/website/src/styles/site-typography.css
related:
  - "[[06-style-audit/INDEX|website style audit (origin)]]"
  - "[[../../../../ac-documentation/06-app-layers/05-site-typography|ac-docs reference]]"
---

# Site typography — role layer

**`apps/website/src/styles/site-typography.css`** is the website's single tuning surface for typography. Every text-bearing element in the page + site layer renders through a `.site-*` role class. Change the visual register of any region by editing one CSS rule.

This doc captures two things:

1. **The migration** — what shipped, what it replaced, what's left out of scope.
2. **The role catalog** — the ~20 roles, their specs, and where each is used.

---

## 1. What shipped

### The convention

Role classes are named by **where** they render — not by primitive size. `.site-eyebrow-hero` is "the kicker above a page-hero title." `.site-name-card` is "the product name in a card / cart row / order row." `.site-meta-status` is "the small uppercase chrome label for status / 404 / breadcrumb."

At each JSX call site:

```jsx
<p className="site-eyebrow-hero">Legal</p>
<h1 className="site-title-page">Privacy policy</h1>
<p className="site-tagline">Effective 21 May 2026</p>
```

No stack of DS classes, no Tailwind arbitrary `text-[Npx]` values, no inline `style={{ fontSize, lineHeight }}`. One class per text slot.

### Migration scope

| Region | Files touched | Roles applied |
|---|---|---|
| Nav + footer | Nav.jsx, Footer.jsx, FooterNewsletter.jsx | `.site-link-nav` / `.site-link-footer` / `.site-label-footer` / `.site-body-footer` / `.site-eyebrow-section` / `.site-meta-system` |
| Page heroes (19 surfaces) | Home, About, Journal, Collections, Shop, Handmade, Privacy, Terms, ShippingReturns, Brand, Press, JournalAuthor, JournalArticle, CollectionDetail, ProductDetail, OrderConfirmation, Contact, Checkout-empty, NotFound | `.site-display-eyebrow` / `.site-eyebrow-hero` / `.site-title-hero` / `.site-title-page` / `.site-subline-hero` / `.site-tagline` / `.site-back-link` / `.site-meta-status` |
| Mid-page sections (14 surfaces) | DesignerVision, SupportCTA, Newsletter, FAQ, HandmadeCard, Collection home, Handmade interior, CollectionDetail interior, OrderConfirmation labels, Contact studio labels, Journal / JournalAuthor / Collections card metas, JournalArticle author bio, Testimonial | `.site-eyebrow-section` / `.site-title-section` / `.site-meta-editorial` / `.site-subline-hero` / `.site-quote` / `.site-quote-cite` |
| Cards / commerce (7 surfaces) | ProductCard, CartDrawer, Checkout aside, OrderConfirmation rows, ProductDetail control labels + size pill + qty, Brand swatches, Marquee, SignupOverlay, Cmd-K, About figcaption | `.site-name-card` / `.site-meta-card` / `.site-label-form` / `.site-meta-status` / `.site-meta-system` |
| FAQ mop-up | FAQ.jsx | `.site-title-row` (new role) |

### Key convergences

- **Product name register**: Narrow 12 across catalog ProductCard, CartDrawer rows, Checkout aside rows, and OrderConfirmation rows. Previously three different scales (Narrow 12 / Mono 10 / Mono 12).
- **Back link**: one canonical `.site-back-link` (Mono 12 uppercase, no underline). Replaced 3 visual variants across 11 sites.
- **404 / status labels**: converged to `.site-meta-status` (uppercase chrome) or `.site-meta-system` (sentence body). Was 4 different conventions.
- **Inversion**: handled via `data-theme="dark"` on the wrapper section. No `*-inverse` role variants needed.

### What's out of scope (and why)

- **DS atoms** (Button, Input, Dropdown, MenuItem, ContentFilters, ViewToggle, SegmentedToggle, ToggleBracket, Textarea, Stepper, ToggleCheckbox, ToggleSwitch, PropertyInput, Avatar, SectionLabel) carry their own text register internally. Don't override at consumer call site; edit the atom if the atom's register needs to change.
- **DS primitives** (Accordion) — same.
- **Editorial body content** inside `<div className="ac-prose">` — blog posts, legal-page bodies, BlogBody-rendered Sanity content. Stays on the DS `.ac-prose` container; inner `<h2>` / `<p>` / `<li>` / `<blockquote>` inherit DS prose styling automatically.

### Dead CSS removed

`apps/website/src/styles/site.css`:

- `.ac-site-footer-label` + `.ac-site-footer-label--legal` (replaced by `.site-label-footer`)
- `.ac-site-footer-meta` (replaced by `.site-meta-system`)
- `.site-marquee*` block (deleted in an earlier session)
- `.site-faq*` block (deleted in an earlier session)
- `.site-testimonial*` block (deleted in an earlier session)

`.ac-prose-*` DS classes (label / display / display-md / tagline / lede / title) now have zero direct JSX consumers in the website. They remain in the DS for descendant use inside `.ac-prose h1..h6` and for the styleguide app.

---

## 2. Role catalog

Six groups. ~20 rules. Each rule bakes the full spec (family + size + weight + line-height + tracking + case + color + margin) so the JSX call site doesn't have to.

### Nav + footer — Narrow chrome

| Role | Spec | Where |
|---|---|---|
| `.site-link-nav` | Narrow 12 / 500 / lh 1 / 0.08em / uppercase | Top-bar nav link |
| `.site-link-footer` | Narrow 12 / 500 / lh 1.5 / 0.08em / uppercase | Footer column link list items |
| `.site-label-footer` | Mono 12 / 500 / lh 16px / 0.10em / uppercase / fg-48 | Footer column title ("Studio", "Browse", "Connect", "More") |

Scope rule: `.ac-site-nav-drawer .site-link-nav { font-size: 14px }` — drawer scales nav links without per-call override.

### Page heroes — top of a page

| Role | Spec | Where |
|---|---|---|
| `.site-display-eyebrow` | Mono 24 / 600 / lh 1 / 0.10em / uppercase / accent | Home hero kicker (brand-color callout, intentionally loud) |
| `.site-eyebrow-hero` | Mono 12 / 500 / lh 16px / 0.10em / uppercase / fg-48 | All other page-hero kickers |
| `.site-title-hero` | Narrow clamp(56px, 8vw, 96px) / 500 / lh 1.05 / -0.01em | Marketing hero h1 (Home / About / Journal / Collections / Shop / Handmade) |
| `.site-title-page` | Narrow 64 / 500 / lh 68px / -0.01em | Secondary-page h1 (legal / detail / 404 states) |
| `.site-subline-hero` | Compact 24 / 400 / lh 28px / 0.02em | Marketing-page subline (sentence). Also doubles as mid-section body. |
| `.site-tagline` | Narrow 14 / 500 / lh 16px / 0.14em / uppercase / fg-64 | Secondary-page subline (uppercase one-liner) |

### Mid-page sections

| Role | Spec | Where |
|---|---|---|
| `.site-eyebrow-section` | Mono 12 / 500 / lh 16px / 0.10em / uppercase / fg-48 | Mid-section kicker. Identical spec to `.site-eyebrow-hero` but kept as a separate role so the two can be tuned independently. |
| `.site-title-section` | Narrow 64 / 500 / lh 68px / -0.01em | Mid-section h2 |

### Cards — catalog, cart, editorial

| Role | Spec | Where |
|---|---|---|
| `.site-name-card` | Narrow 12 / 500 / lh 1.2 / 0.08em / uppercase / emphasis | Product name everywhere (ProductCard, CartDrawer rows, Checkout aside, OrderConfirmation). Also: PDP size pill, qty values, totals values. |
| `.site-meta-card` | Narrow 12 / 500 / lh 1.2 / 0.08em / uppercase / fg-64 | Price, "size · color" line, qty meta, totals labels. Same register as name, dimmer. |
| `.site-meta-editorial` | Mono 12 / 500 / lh 16px / 0.10em / uppercase / fg-48 | Editorial card meta — Journal byline / date / reading-time, Collection card label "Title · Year", Look label, definition-term labels, About figcaption |

### Forms

| Role | Spec | Where |
|---|---|---|
| `.site-label-form` | Mono 10 / 500 / lh 1 / 0.10em / uppercase / emphasis | Field labels (Checkout, PDP control labels — Color / Size / Quantity / Details / About this piece) |
| `.site-body-footer` | Narrow 14 / 500 / lh 1.4 / 0.04em / fg-80 | Footer body copy (FooterNewsletter description + native input field) |

### Back link, status, system

| Role | Spec | Where |
|---|---|---|
| `.site-back-link` | Mono 12 / 500 / lh 1 / 0.10em / uppercase / fg-64 → hover emphasis / no-underline / `inline-flex items-center gap-6px` baked in | All "← Back" / "← Previous" / "Next →" links. Canonical; replaces 3 prior visual variants. |
| `.site-meta-status` | Mono 10 / 500 / lh 1 / 0.10em / uppercase / fg-48 | Uppercase chrome — 404 labels, breadcrumbs, "ESC" hint, Cmd-K section badges, bag-count headers, subtotal / total labels |
| `.site-meta-system` | Mono 11 / 400 / lh 1.4 / 0.04em / fg-48 (no uppercase, no wide tracking) | Sentence-case body — footer copyright, error messages, helper text ("Continue shopping", "Secure via PayPal", "Tracking will be emailed…"), empty state, "No results.", Brand swatch labels, tracking footnotes |

### Quote + row

| Role | Spec | Where |
|---|---|---|
| `.site-quote` | Sans clamp(32px, 4.5vw, 64px) / 700 / italic / lh 1.2 / -0.005em / emphasis | Testimonial pull quote |
| `.site-quote-cite` | Mono 12 / 500 / lh 1 / 0.10em / uppercase / fg-64 | Testimonial cite |
| `.site-title-row` | Compact 20 / 500 / lh 1.25 / emphasis | Row title (FAQ question, future row-style components) |

---

## 3. Conventions

### Inversion — use `data-theme="dark"`, don't write `*-inverse` variants

The DS supports theme scoping. Wrap dark-surface sections in `data-theme="dark"`:

```jsx
<section data-theme="dark" className="bg-surface-inverse px-8 py-24">
  <p className="site-eyebrow-section">Independent Studio</p>
  <h2 className="site-title-section">Support my Journey</h2>
</section>
```

The role classes reference `--ac-surface-on-primary` and `--ac-fg-NN` which flip correctly under theme scope. No parallel `.site-title-section-inverse` to maintain.

Current consumers using this pattern: `SupportCTA`, `Newsletter`, `Marquee`, `HandmadeCard` (inner div).

> **DS caveat**: `.bg-surface-inverse` alone does NOT fully flip the descriptor aliases (known DS bug — `--ac-fg-emphasis` is declared at `:root` and doesn't re-resolve under `.bg-surface-inverse`). Always pair `.bg-surface-inverse` with `data-theme="dark"` until the DS bug is fixed. Once fixed, `data-theme="dark"` becomes redundant on dark-surface sections — but harmless.

### Relationship to other layers

| Layer | What it owns |
|---|---|
| **Role layer** (`site-typography.css`) | Consumer-tier text register at JSX call sites |
| **DS tokens** (`packages/ds/tokens/`) | Font families, color tokens, spacing scale — referenced by role classes via `var(--ac-…)` |
| **DS prose** (`.ac-prose`) | Editorial long-form body — blog posts, legal-page bodies, BlogBody Sanity content |
| **DS atoms** (Button, Input, Dropdown, etc.) | Internal text of interactive controls — atoms own their own `.ac-mono-N` size mapping |

### When to use a role class

- Editing typography in `apps/website/src/components/site/` or `apps/website/src/pages/`.
- The text slot has a clear conceptual role (page-hero kicker, card name, etc.).
- The role exists in the file.

### When NOT to use a role class

- **Inside an atom** (`Button`, `Input`, `Dropdown`, etc.). Edit the atom's internal `.ac-mono-N` reference instead.
- **Editorial body inside `.ac-prose`.** Use the DS prose container — it styles its descendants automatically.
- **The role doesn't exist yet.** Add one — don't reach for a Tailwind arbitrary `text-[Npx]` value as a workaround.

---

## 4. Adding a new role

1. The text slot must be **a real conceptual role** that recurs or is significant. Not a one-off.
2. Add the rule to `site-typography.css` in the appropriate group (or create a new group if it doesn't fit).
3. Reference DS tokens for font-family and color (so brand swap cascades).
4. Declare size / weight / tracking / line-height in raw values.
5. Document the role in this doc and in the ac-docs reference at `docs/ac-documentation/06-app-layers/05-site-typography.md`.
6. Update call sites to use the new class. Don't leave old arbitrary values behind.

---

## 5. Anti-patterns

The role layer exists to prevent these:

- `<p style={{ fontSize: 13, lineHeight: 1.4 }}>` — inline-style typography. Use a role.
- `<h2 className="ac-sans-heading-02 text-[64px]!">` — DS class force-scaled with `!`. Use the right role (`.site-title-section`).
- `<p className="ac-prose-label">` outside an editorial-body context. `.ac-prose-label` is for inside `.ac-prose`; use `.site-eyebrow-section` or `.site-eyebrow-hero` instead.
- `.ac-helper-xxs uppercase text-meta tracking-widest` repeated 8 times across files. That's a role waiting to be named.
- Parallel `.site-*-inverse` variants for dark surfaces. Use `data-theme="dark"` on the section wrapper.

---

## 6. Tuning the site

To change the visual register of any region:

1. Identify the role (this doc's catalog, or grep `.site-*` in JSX to find it).
2. Open `apps/website/src/styles/site-typography.css`.
3. Edit the rule.
4. Reload — every consumer follows.

To change the brand color: tune the DS `--ac-accent-primary` token. To change the font family: tune the DS `--ac-font-family-*` tokens. The role layer propagates automatically.

---

## 7. Site components — compositional vocabulary

Beyond the role classes, the website has a small set of structural components that own the recurring page motifs. Together they are the site's compositional vocabulary: **roles set typography, components set structure.** Both live in `apps/website/src/components/site/`.

### Page-level wrappers

| Component | File | What it owns |
|---|---|---|
| `<PageHero>` | `PageHero.jsx` | Kicker + title + subline composition. Props `variant` (`'marketing' | 'secondary'`) + `eyebrowVariant` (`'standard' | 'display'`) + `sublineKind` (`'lede' | 'tagline'`) select the role classes. Internal `gap-2` / `gap-4` removes the per-call `style={{ marginTop }}` overrides. Used by 16 sites. |
| `<SecondaryPageShell>` | `SecondaryPageShell.jsx` | Composes outer `<main>` + `<section max-w-3xl>` + `<BackLink>` + `<PageHero>` + `.ac-prose` body wrapper. Single component for legal / system pages. Used by Privacy, Terms, ShippingReturns, Brand, Press. |
| `<SiteSection>` | `SiteSection.jsx` | Section wrapper with a 5-stop named width enum: `narrow` (3xl, 768px), `reading` (4xl, 896px), `wide` (5xl, 1024px), `grid` (6xl, 1152px), `panel` ([1200px]). Plus `full` (no max-width). Always centers via `mx-auto`. Horizontal + vertical padding stays at call site via `className`. ~30 sections migrated across 10 pages. |
| `<BackLink>` | `BackLink.jsx` | Canonical wrapper for `<Link className="site-back-link">`. Optional `className` for spacing. Used by 12 sites. |

### Cart surface

| Component | File | What it owns |
|---|---|---|
| `<CartPanel>` | `CartSummary.jsx` | The whole cart `<aside>` shell: `bg-surface-primary` + `border-l` + `flex flex-col` + header bar (h-14, `border-b`, `px-6`) + scrollable item list + footer scaffold (`border-t`, `px-6 py-5`, `gap-4`). Slot props (`className` / `header` / `items` / `qtyControlFor` / `linkToFor` / `onLinkClick` / `empty` / `footer`) drive the differences between drawer (overlaid, with close ×, Checkout CTA + Continue link) and checkout aside (in-page sticky, no close, totals breakdown + PayPal lock note). |
| `<CartRow>` | `CartSummary.jsx` | Per-row layout: 80px thumb (left) + name (`.site-name-card`) + meta (`.site-meta-card`, "size · color") + optional `qtyControl` slot below meta + trailing line price (`.site-name-card`). Optional `linkTo` wraps thumb + name in a `<Link>` for surfaces that want to navigate to PDP. |
| `<CartTotalsRow>` | `CartSummary.jsx` | Label + value pair for Subtotal / Shipping / Total rows. `emphasis` prop bumps the label register to `.site-name-card` for the final Total row. |
| `<QtyControl>` | `CartSummary.jsx` | The qty stepper used inside `<CartRow>` — minus / value / plus, with minus → trash-icon swap when qty=1. |

### Editorial + chrome

| Component | File | What it owns |
|---|---|---|
| `<FAQ>` | `FAQ.jsx` | Native `<details name="faq">` accordion (exclusive open, no React state). `layout="split"` (default, 2-col with left header) for home; `layout="stacked"` (no container, no header) for Handmade interior. |
| `<ProductCard>` | `ProductCard.jsx` | Catalog card. `overlay` (default true) + `fill` (default false) props for hover overlay vs caption-below + aspect-ratio vs flex-grow. |
| `<CarouselArrow>` | `molecules/CarouselArrow.jsx` | Shared chevron button for home LookbookCarousel + styleguide Gallery lightbox. |
| `<Marquee>` | `Marquee.jsx` | Edge-to-edge logo strip with seamless `translateX(-50%)` loop. |

When the visual register of a region needs to change, edit the role class (typography) or the component (structure). The call site doesn't change.

## 8. Where the migration is documented in detail

- [[06-style-audit/INDEX|Website style audit]] — 5 docs: typography inventory, structural duplication, regional alignment, element census, sweep notes. The audit produced this role layer + the component extractions. Treat as historical context.
- `docs/llm-context/session-log/2026-05-21-site-typography-role-layer.md` — full file-by-file change log for the typography migration session.
- `docs/llm-context/session-log/2026-05-21-structural-extractions-faq-backlink-pagehero-secondarypageshell-cartsummary-sitesection.md` — change log for the structural extraction session (BackLink / PageHero / SecondaryPageShell / SiteSection / FAQ / CartSummary primitives).
- `docs/ac-documentation/06-app-layers/05-site-typography.md` — peer reference doc inside the AC CSS knowledge base (same content, AC-docs-framework-conformant).
