---
title: Structural duplication
type: audit
status: active
updated: 2026-05-21
description: Repeated structural patterns across the website — FAQ rendered twice, three separate accordion implementations, eleven near-identical back links, twenty-one page-hero shapes reimplemented per page, five legal pages with identical shells. Identifies what extracts vs what stays local.
audience: agency-internal
tags:
  - project/acyr
  - domain/website
  - domain/audit
sources:
  - apps/website/src/components/site/**/*.jsx
  - apps/website/src/pages/site/**/*.jsx
related:
  - "[[INDEX|style audit index]]"
  - "[[01-typography-inventory|typography inventory]]"
  - "[[03-regional-alignment|regional alignment]]"
---

# Pass 2 — Structural duplication

Findings sorted by extraction priority — biggest mechanical wins first.

## Status — 2026-05-21

This audit is historical; the recommendations have shipped. Current state of each finding:

| # | Finding | Status |
|---|---|---|
| 1 | `<BackLink>` extraction | ✅ Shipped 2026-05-21. `components/site/BackLink.jsx`, 12 consumers. |
| 2 | `<PageHero>` extraction | ✅ Shipped 2026-05-21. `components/site/PageHero.jsx`, 16 consumers. Granular variant API: `variant` / `eyebrowVariant` / `sublineKind`. |
| 3 | Legal-page shell | ✅ Shipped 2026-05-21. `components/site/SecondaryPageShell.jsx`, 5 consumers (Privacy / Terms / ShippingReturns / Brand / Press). |
| 4 | FAQ consolidation | ✅ Shipped 2026-05-21. Canonical `<FAQ>` gained `layout="stacked"`; Handmade's local `FaqItem` deleted. |
| 5 | Accordion three impls | ✅ Closed by #4. Two legitimate primitives remain (`FAQ` for editorial Q/A, `primitives/Accordion` for general collapsibles). |
| 6 | DS prose margin strip | ▢ Deferred — DS-tier task. Bigger surgery; sequenced after the website-tier sweeps. |
| 7 | `<SiteSection>` width wrapper | ✅ Shipped 2026-05-21. 5-stop width enum (`narrow` / `reading` / `wide` / `grid` / `panel` + `full`); ~30 sections migrated across 10 pages. |
| 8 | Newsletter form share | ▢ Gated on backlog 3d (Newsletter design rework). |
| 9 | Cart asides | ✅ Shipped 2026-05-21 (second arc). `<CartPanel>` + `<CartRow>` + `<CartTotalsRow>` + `<QtyControl>` in `components/site/CartSummary.jsx`. Drawer + checkout aside both consume `<CartPanel>` via slot props. See finding text below + `[[05-sweep-notes#Region: Cart panel unification (done — 2026-05-21, second arc)|sweep notes Region: Cart panel unification]]`. |

Only #6 (DS-tier margin strip) and #8 (Newsletter form, gated on design rework) remain open. Findings below preserved as the original audit record.

## 1. `<BackLink>` — 11 instances, 3 visual variants (highest ROI extraction)

Eight pages render the **canonical** secondary-page back link with this exact class string:

```jsx
<Link to="/" className="ac-back-link ac-helper-xs uppercase tracking-widest text-body hover:text-emphasis no-underline inline-flex items-center gap-1.5" style={{ marginBottom: '32px' }}>
  ← Back
</Link>
```

Files: `Journal`, `Privacy`, `Press`, `Brand`, `Terms`, `ShippingReturns`, `JournalAuthor`, `JournalArticle`, `CollectionDetail` (× 2 — error-state + content-state).

Two divergent variants do the same job with different classes:

- **Commerce variant** — `ac-helper-xxs uppercase text-emphasis underline underline-offset-4 hover:no-underline` (smaller, underlined). Files: `ProductDetail.jsx:135`, `Checkout.jsx:104`.
- **`.ac-prose-label` variant** — `JournalAuthor`, `JournalArticle`, `CollectionDetail` use `.ac-prose-label` directly as the back-link class. That's the section-eyebrow style being repurposed as a link — renders in mono, not narrow uppercase.

**Recommendation:** extract `<BackLink to={} children={} className?={} />` at `components/site/BackLink.jsx`. Default to the canonical class string. Three call-site variants collapse to one prop-driven component. Net delete: ~10 lines of duplicated class soup per consumer × 11 consumers = ~110 lines.

> Composition note: a sibling `<NavBackLink>` may be warranted for the commerce-variant. Or treat them as the same `BackLink` with a `variant="underlined"` prop. Decide when extracting.

## 2. `<PageHero>` — 21 instances, 4 shape variants

Every page-level marketing surface opens with the same shape:

```
<p ac-prose-label>{kicker}</p>
<h1 ac-prose-display(-md)>{title}</h1>
[<p ac-prose-tagline>{tagline}</p>] OR [<p ac-prose-lede>{lede}</p>]
```

Variants observed:

| Variant | Kicker | Title | Subline | Files |
|---|---|---|---|---|
| Marketing hero | `.ac-prose-label` | `.ac-prose-display` (80px) | `.ac-prose-lede` | Home, About, Journal, Collections, Shop, Handmade |
| Legal / system page | `.ac-prose-label` | `.ac-prose-display-md` (64px) | `.ac-prose-tagline` | Privacy, Terms, ShippingReturns, Brand, Press, JournalAuthor |
| Detail page | `.ac-prose-label` | `.ac-prose-display-md` | (none / various) | OrderConfirmation, JournalArticle, ProductDetail (× 2), CollectionDetail (× 2), Contact, Checkout (empty state) |
| Editorial (section) | `.ac-prose-label` | `.ac-prose-display-md` | (varies) | DesignerVision, SupportCTA |

Identifying signal: every one starts with `<p className="ac-prose-label">` followed by a heading using `.ac-prose-display` or `.ac-prose-display-md`. **Twenty-one re-implementations of the same three-line motif.**

**Recommendation:** extract `<PageHero kicker title subline?={} variant?={'marketing' | 'legal' | 'detail'} />` at `components/site/PageHero.jsx`. The variant prop selects the heading scale (display vs display-md) and the subline class (lede vs tagline). All 21 sites collapse to one call each. ~150 line net delete and a single point of truth for the "page-opening visual register."

> Sub-pattern: every legal/system page also sets `style={{ marginTop: '8px' }}` on the tagline. If the DS class shipped with `margin-top: 8px` baked in, the override would disappear too — see finding #6.

## 3. Legal-page shell — 5 files, identical wrapper

`Privacy.jsx`, `Terms.jsx`, `ShippingReturns.jsx`, `Brand.jsx`, `Press.jsx` are byte-identical from L1 to L26 except for the body content and the `usePageTitle` argument. Same imports, same `<main>` wrapper, same `<section>` constraints, same back link, same kicker/title/tagline, same `.ac-prose` wrapper opening tag.

```jsx
<main className="bg-surface-primary pb-24">
  <section className="max-w-3xl mx-auto px-8 pt-20">
    <BackLink to="/">← Back</BackLink>
    <PageHero kicker="..." title="..." subline="..." variant="legal" />
    <div className="ac-prose">
      {children}
    </div>
  </section>
</main>
```

**Recommendation:** after #1 and #2 land, extract `<LegalPageShell title kicker subline children />` that composes BackLink + PageHero + the standard outer wrapper. Or use as the "secondary page" pattern shell (`<SecondaryPageShell>`) and have legal/brand/press call into it. Five pages reduce to:

```jsx
export default function Privacy() {
  usePageTitle(`Privacy · ${BRAND.name}`)
  return (
    <SecondaryPageShell kicker="Legal" title="Privacy policy" subline={`Effective ${date}`}>
      ... body ...
    </SecondaryPageShell>
  )
}
```

Eliminates ~25 lines of identical wrapper from each file.

## 4. FAQ — two implementations, same intent

Two completely different implementations of the same feature:

- **`components/site/FAQ.jsx`** — used on Home. Native `<details name="faq">` for exclusive-open, no React state. Right-column accordion list with a left-column header (`grid md:grid-cols-[1fr_2fr]`). Toggle visual: `ac-btn ac-btn-primary` 7×7 rounded-full circle with a `<Icon name="plus">` that rotates 45° to × on open. Item q in `.ac-sans-heading-05` (20px Compact 500). Item a in `.ac-prose` (16px Sans 300 / 24lh / fg-80).

- **`pages/site/Handmade.jsx`** — local `FaqItem` component, React state `openIdx`, single-open behavior managed manually. Single-column layout, no grid. Toggle visual: standalone `<Icon name="plus"/minus" size={14} />`. Item q in `.ac-prose-label` (mono 12 uppercase fg-48 — the *eyebrow* class repurposed as a question heading). Item a in `.ac-prose` p tags.

Different markup, different toggle, different question typography. Same feature.

**Recommendation:** retire `FaqItem` in `Handmade.jsx`. Render the canonical `<FAQ>` component there too (it accepts `items={[{q,a}]}` already; just pass `HANDMADE_FAQ` in). The optional `kicker` + `title` props on the canonical can be omitted to drop the left header on Handmade if the visual register should differ. If the layouts genuinely need to diverge (one-column vs two-column), add a `layout="stacked" | "split"` prop on FAQ rather than a parallel impl.

## 5. Accordion — three implementations

Three accordion-flavored implementations coexist:

| Where | Open-mode | State | Title class | Marker |
|---|---|---|---|---|
| `components/site/FAQ.jsx` | exclusive (`<details name="faq">`) | native | `.ac-sans-heading-05` (20px) | `.ac-btn` circle, plus → × rotation |
| `components/primitives/Accordion.jsx` (`AccordionPanel`) | additive (multi-open) or controlled | local state OR controlled | `.ac-helper-12 uppercase tracking-widest` | mono `+` / `−` glyph |
| `pages/site/Handmade.jsx` (`FaqItem` inline) | single-open via parent `openIdx` | controlled | `.ac-prose-label` | `<Icon name="plus" / "minus">` |

The primitive and the FAQ component are genuinely different (multi-open data table rows vs single-open editorial Q/A). The Handmade local is the redundant one. Once #4 collapses Handmade onto the canonical FAQ, only two accordion shapes remain — both legitimate.

**Recommendation:** keep both `primitives/Accordion.jsx` and `components/site/FAQ.jsx`. Document them at `components/site/FAQ.jsx` and `components/primitives/Accordion.jsx` headers as "editorial Q/A list" vs "general collapsible panel group." Deprecate nothing.

## 6. Inline `style={{ margin* }}` overrides on `.ac-prose-*` — ~30 sites

The DS prose classes (`.ac-prose-label`, `.ac-prose-tagline`, `.ac-prose-display`, `.ac-prose-display-md`, `.ac-prose-title`, `.ac-prose-lede`, and inner `.ac-prose p / h2 / li`) all ship with opinionated margins. Consumers override them constantly:

- `style={{ marginBottom: 0 }}` — kill DS margin (8 sites)
- `style={{ marginBottom: 16 / 12 / 4 / 32 }}` — substitute a specific value (12 sites)
- `style={{ marginTop: '8px' }}` — add a top margin DS doesn't ship (every "legal" page tagline)
- `style={{ margin: 0 }}` — full reset (10+ sites)

This is the same anti-pattern as Pass 1's `text-[Npx]` escapes — the DS shipped a specific value, callers route around it.

**Recommendation (architectural):** strip the margin declarations from `.ac-prose-*` (display, display-md, title, lede, tagline, label) and let callers use flexbox `gap-N` on the parent. The DS already does this for `.ac-prose h1..h6` inside the prose container (margins are sensible defaults because the container is editorial flowing copy). But the **section-opening** prose primitives (label / display / lede / tagline) are almost always used as *flex items* inside a section column, where parent gap should drive spacing. Removing the margins and updating consumers to use parent `gap-N` removes ~30 inline-style overrides.

Caveat: this is bigger surgery — touches the DS itself + every consumer. Pass to do AFTER finishing the website-tier sweeps. Schedule as a separate DS-tier task.

## 7. Section wrapper drift — every page invents its own

`max-w-*` and `py-*` choices across pages:

| Container | Files |
|---|---|
| `max-w-3xl mx-auto px-8 pt-20` | Privacy, Terms, ShippingReturns, Brand, Press (5 — the legal-page shell) |
| `max-w-3xl mx-auto px-8 pt-24` | Handmade (FAQ section) |
| `max-w-3xl mx-auto px-8 pb-24` | Collections (intro section), Handmade (contact form) |
| `max-w-3xl mx-auto px-5 py-24 text-center flex flex-col items-center` | Journal, Collections (hero) |
| `max-w-4xl mx-auto px-8 pb-24` | Journal, JournalAuthor (article list) |
| `max-w-4xl mx-auto px-8 py-20` | JournalAuthor |
| `max-w-5xl mx-auto px-8 pb-24` | Collections (grid section) |
| `max-w-6xl mx-auto px-8 pt-16` | Handmade (pieces grid) |
| `max-w-[1200px] w-full mx-auto` | FAQ, Testimonial, SigTicker, Marquee |
| (no max-w; full-bleed) | Collection (home), Newsletter, SupportCTA, DesignerVision, HandmadeCard |

Six different "page section" container widths in active use, with little internal logic for which page picks which.

**Recommendation:** define a small set of named section widths and a section wrapper:

```jsx
<SiteSection width="narrow" | "reading" | "wide" | "edge" pad="lg" | "md" | "sm">
  ...
</SiteSection>
```

Maps to: `narrow` = 3xl (legal/forms), `reading` = 4xl (journal), `wide` = 6xl (catalog grids), `edge` = full-bleed. Then sweep all the magic max-w values to the named tokens. Lower priority than #1 / #2 / #3 — the visible drift is small unless someone resizes a page.

## 8. Newsletter form — two implementations

`Newsletter.jsx` (home card) and `FooterNewsletter.jsx` (footer strip) share zero markup. Same POST endpoint, same state machine (`idle | sending | success | error`), same field set (email only). Different visuals:

- Home card — centered hero card on `bg-surface-inverse`, big `.ac-sans-heading-02` headline, full-width Input + Button stacked sm:row.
- Footer strip — two-column layout in the footer, `.ac-prose-label` kicker + tiny body copy, native `<input>` with underline-only border, ghost-variant Button.

**Recommendation:** already on backlog item 3d ("Newsletter design rework"). When that lands, extract `<NewsletterForm layout="card" | "strip">` shared by both surfaces. State machine + endpoint goes into a `useNewsletterSubscribe` hook. Out of scope for this audit; flag and move on.

## 9. Cart asides — three surfaces

**✅ Shipped 2026-05-21 (second arc).** Originally tracked at backlog item 1h.

Original finding (preserved):

- `CartDrawer.jsx` — slide-in from right, full cart UI.
- `Checkout.jsx` aside — sticky right-column summary, no qty controls.
- (Previously) `Cart.jsx` page — deleted, but a third order-summary surface may appear later.

Cart row markup, qty stepper, total presentation all reimplemented per surface. Originally marked out of scope for this audit.

### Resolution

Two-tier extraction in `apps/website/src/components/site/CartSummary.jsx`:

**Inner primitives:**
- `<CartRow>` — 80px thumb + name + meta + line price + optional `qtyControl` slot. Used by both surfaces.
- `<CartTotalsRow>` — Subtotal / Shipping / Total row, with `emphasis` flag for the final row.
- `<QtyControl>` — minus / value / plus stepper with minus → trash-icon swap when qty=1.

**Outer shell:**
- `<CartPanel>` — owns the `<aside>` background / border / padding / header bar / scrollable list / footer scaffold. Consumers pass `className` (outer positioning), `header` (JSX node — drawer adds close ×, aside has bag title only), `items`, `qtyControlFor(it)` / `linkToFor(it)` / `onLinkClick` (per-row wiring), `empty` (drawer-only empty-bag JSX), `footer` (drawer = subtotal + note + Checkout CTA + Continue link; aside = subtotal + shipping + divider + total + PayPal note).

Drawer wraps `<CartPanel>` in its `fixed inset-0` overlay + backdrop + dialog role; checkout aside uses `<CartPanel>` directly with `lg:fixed lg:right-0 lg:top-0` positioning.

Wrapper styling now propagates from one component edit. Drift between the two surfaces cannot reintroduce itself without an explicit prop override.

OrderConfirmation rows currently re-implement row markup directly (not yet migrated to `<CartRow>`). Visual match already via `.site-name-card` role; migration is a low-priority follow-up.

## 10. Things that are already correctly shared (no action)

- **`<ProductCard>`** — one component, `overlay` + `fill` props drive the two variants (hover overlay vs caption-below; aspect-ratio vs flex-grow). Good pattern.
- **`<CarouselArrow>`** — molecule shared by home `LookbookCarousel` + styleguide Gallery lightbox. Good extraction.
- **`<Marquee>`** — single component, fully Tailwind/DS class-driven after the recent purge.
- **`<HandmadeCard>`** — single use. Bespoke section card; no duplication.

## 11. Recommendations — prioritised extraction queue

Order by ROI:

1. **`<BackLink>` extraction** (#1). Pure mechanical sweep, 11 call sites, zero behavior change risk. ~110 lines net delete.
2. **`<PageHero>` extraction** (#2). 21 call sites. ~150 lines net delete. Requires deciding on the variant API.
3. **FAQ consolidation** (#4). Retire `FaqItem` in Handmade, render canonical `<FAQ>` there. Add `layout="stacked"` prop if needed.
4. **`<SecondaryPageShell>` extraction** (#3). Composes BackLink + PageHero + outer wrapper. Closes Privacy/Terms/ShippingReturns/Brand/Press. Five pages collapse to a few lines each. Sequenced after #1 and #2.
5. **Newsletter form share** (#8). Gated on backlog 3d redesign — out of scope.
6. **Cart aside unification** (#9). Tracked at backlog 1h — out of scope.
7. **`<SiteSection>` width/padding wrapper** (#7). Lower priority; visible drift is small.
8. **DS prose margin strip** (#6). Bigger surgery, separate DS-tier task. Schedule after the website-tier sweeps land.

### Sequencing note

Items #1, #2, #3, #4 stack cleanly: #4 composes #1+#2. Do them in that order. #6 (DS margin strip) is the last domino; it removes ~30 inline-style overrides that the prior extractions don't reach.
