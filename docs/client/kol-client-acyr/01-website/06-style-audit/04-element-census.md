---
title: Text-bearing element census
type: audit
status: active
updated: 2026-05-21
description: Per-region enumeration of every text-bearing element across apps/website/src — surface, element, current class, count, notes. Raw input for drafting the site-typography role layer.
audience: agency-internal
tags:
  - project/acyr
  - domain/website
  - domain/typography
  - domain/audit
sources:
  - apps/website/src/**/*.{jsx,js}
related:
  - "[[INDEX|style audit index]]"
  - "[[01-typography-inventory|typography inventory]]"
  - "[[02-structural-duplication|structural duplication]]"
  - "[[03-regional-alignment|regional alignment]]"
---

# Pass 4 — Text-bearing element census

Per-region enumeration. One row per visually distinct text slot. Counts are call-site counts in JSX (not render-time instances).

This census informs the role layer planned at `site-typography.css`. Roles are **not** assigned here — only "what is each text slot doing today + which class is on it." Role draft sits on top of this in a separate plan doc.

Columns:

- **Element** — what the text represents
- **Class today** — current className (or inline `style` if no class)
- **Sites** — distinct call-site count
- **Notes** — escapes, drift, edge cases

---

## A. Top nav (`Nav.jsx`, `SiteLayout.jsx`)

| Element | Class today | Sites | Notes |
|---|---|---|---|
| Nav link (desktop) | `.ac-sans-nav` | 1 component, N consumers | Narrow 12 uppercase 0.08em |
| Nav link (drawer / mobile) | `.ac-sans-nav text-[14px]` | 1 | Same class scaled to 14px |
| Cart count badge | (text inside cart icon button) | 1 | No dedicated text class; inherits |
| Wordmark logo | `<KolLogo variant="wordmark" height={14}>` | 1 | Image, not text |

## B. Footer (`Footer.jsx`, `FooterNewsletter.jsx`)

| Element | Class today | Sites | Notes |
|---|---|---|---|
| Wordmark logo | `<KolLogo>` inside `.ac-site-footer-mark` | 1 | Image |
| Column title (Studio / Browse / Connect / More) | `.ac-site-footer-label` | 4 (data-driven) | Mono 12 0.10em uppercase fg-48 — **identical spec to `.ac-prose-label`, different name** |
| Link list item | `<ul class="ac-site-footer-list ac-sans-nav">` | 4 | Narrow 12 (same as nav) |
| Footer link `<a>` | `.ac-site-footer-link` | per-item | Hover dims to 0.55 opacity |
| Bottom-bar copyright | `.ac-site-footer-meta` | 1 | Mono 11 0.06em fg-56 — **non-grid 11px** |
| Bottom-bar entity / kt | `.ac-site-footer-meta` | 1 | Same |
| Newsletter strip kicker ("Newsletter") | `.ac-prose-label` | 1 | Mono 12 — co-existing with `.ac-site-footer-label` in same component |
| Newsletter strip body | `.ac-sans-nav text-body normal-case tracking-[0.04em]` + inline `style={{ fontSize: 14, lineHeight: 1.4 }}` | 1 | **Inline-style escape** |
| Newsletter input (native) | `.ac-sans-nav text-emphasis` + inline `style={{ fontSize: 13 }}` | 1 | **Inline-style escape** |
| Newsletter error alert | `.ac-sans-nav text-meta normal-case tracking-[0.04em]` + inline `style={{ fontSize: 12 }}` | 1 | **Inline-style escape** |
| Newsletter button label | `<Button variant="ghost" size="sm">` | 1 | Atom-driven — Mono 12 via `.ac-mono-12` |

## C. Marketing page hero (Home / About / Journal / Collections / Shop / Handmade)

| Element | Class today | Sites | Notes |
|---|---|---|---|
| Eyebrow / kicker | `.ac-prose-label` | 5 | Mono 12 0.10em uppercase fg-48 |
| Hero title (h1) | `.ac-prose-display` | 5 | Narrow 80 500 |
| Subline (lede) | `.ac-prose-lede max-w-xl` | 5 | Compact 24 400 28lh |
| **Home variant** kicker | `.ac-helper-20 uppercase text-accent-primary` + inline `style={{ fontSize: 24, fontWeight: 600 }}` | 1 | **Off-contract** — mono class force-fit to look sans |
| **Home variant** title | `font-narrow uppercase font-medium text-[clamp(56px,8vw,96px)] leading-[1.05]` | 1 | **Off-contract** — no DS class, equivalent to `.ac-sans-display-01` |

## D. Secondary page hero (Privacy / Terms / ShippingReturns / Brand / Press / JournalAuthor / OrderConfirmation / ProductDetail / JournalArticle / CollectionDetail / Contact / Checkout-empty / 404 variants)

| Element | Class today | Sites | Notes |
|---|---|---|---|
| Back link "← Back" | `.ac-back-link .ac-helper-xs uppercase tracking-widest text-body hover:text-emphasis no-underline inline-flex items-center gap-1.5` | 8 (Privacy, Terms, ShippingReturns, Brand, Press, JournalAuthor, JournalArticle, CollectionDetail) | Pass 2 §1 canonical |
| Back link "← Back to shop" (commerce) | `.ac-helper-xxs uppercase text-emphasis underline underline-offset-4 hover:no-underline` | 2 (ProductDetail, Checkout) | **Different visual** — Mono 10 underlined |
| Back link "← Back to journal/collections" (editorial) | `.ac-prose-label` | 3 (JournalArticle, JournalAuthor, CollectionDetail 404 states) | **Wrong register** — eyebrow class repurposed as link |
| Eyebrow / kicker | `.ac-prose-label` | 12 | Mono 12 |
| Hero title (h1) | `.ac-prose-display-md` | 11 | Narrow 64 500 |
| Subline (tagline, legal pages) | `.ac-prose-tagline` + inline `style={{ marginTop: '8px' }}` | 6 | Narrow 14 0.14em uppercase fg-64 + always-overridden marginTop |
| Subline (lede, detail pages) | `.ac-prose-lede` | 4 | Compact 24 |
| 404 label | `.ac-prose-label` ("404") | 3 (JournalAuthor, JournalArticle, CollectionDetail 404) | Eyebrow class doubling as status badge |
| Confirmation 404 status | `.ac-helper-xxs uppercase text-meta` ("404") | 1 (ProductDetail 404) | Different register from the editorial-404 |
| Checkout empty kicker | `.ac-helper-xxs uppercase text-meta` ("Checkout") | 1 | Same Mono 10 register |

## E. Mid-page section opener (within-page sections — not full-page hero)

| Surface | Kicker | Heading | Surface bg |
|---|---|---|---|
| `DesignerVision` | `.ac-prose-label` ("The Designer") | `.ac-prose-display-md uppercase` | surface-primary, 2-col |
| `SupportCTA` | `.ac-prose-label text-on-inverse` | `.ac-prose-display-md text-on-inverse` | surface-inverse |
| `Newsletter` (home card) | `.ac-prose-label text-center` ("Newsletter") | `.ac-sans-heading-02 text-emphasis text-on-inverse text-center` | surface-inverse |
| `FAQ` | `.ac-helper-16 uppercase text-fg-48` | `.ac-sans-heading-02 m-0` | surface-primary, 2-col |
| `Collection` (home) | (none) | `.ac-sans-heading-06 uppercase text-emphasis` + season tag `.ac-sans-heading-06 uppercase text-meta` | surface-primary |
| `Marquee` | `.ac-helper-12 uppercase text-white/50` (kicker, optional) + `text-[13px] text-white/60` (head-note, optional) | (no heading) | absolute black, full-bleed |
| `HandmadeCard` | (none) | `.ac-prose-display text-emphasis uppercase` (480px container) | image bg with gradient veil |
| `Checkout` left form | (none) | `.ac-sans-heading-02 m-0` ("Checkout") | surface-primary |

**Drift signal:** 8 mid-section openers, 4 kicker classes, 5 heading scales.

## F. Editorial body — `.ac-prose` container

| Element | Class today (inside `.ac-prose`) | Notes |
|---|---|---|
| Body paragraph | `<p>` | Sans 16 300 24lh — DS default |
| Heading h1 | `<h1>` | Narrow 48 500 (matches heading-01) |
| Heading h2 | `<h2>` | Compact 32 400 40lh |
| Heading h3 | `<h3>` | Compact 24 400 32lh |
| Heading h4 / h5 / h6 | `<h{4,5,6}>` | Compact 20 / 16 / 16 |
| Bullet list / numbered list | `<ul>` / `<ol>` | 24px indent + 8px between items |
| Inline emphasis | `<em>` italic, `<strong>` 700 |
| Inline code | `<code>` | Mono 0.875em fg-04 bg |
| Code block | `<pre>` | Mono 14 22lh fg-04 bg |
| Blockquote | `<blockquote>` | 24px Sans 600 with 2px fg-32 border-left |
| Cite | `<cite>` (inside blockquote) | Mono 12 500 0.04em fg-48, prefixed `— ` |
| Link | `<a>` | Inherits, default underline |

Used by: `Privacy`, `Terms`, `ShippingReturns`, `Brand`, `Press`, `About`, `Journal article body (BlogBody)`, `Collection notes (BlogBody)`, `Handmade FAQ answer`, `Contact studio info`, `CollectionDetail show/collaborators/press blocks`, `JournalArticle author bio`. ~15 surfaces.

**Frequent escape:** `<p style={{ margin: 0 }}>` / `<p style={{ margin: '0 0 4px' }}>` etc. — ~25 instances overriding the DS-baked 24px margin-bottom on `<p>`. Pass 2 §6.

## G. Card — product / handmade catalog (ProductCard)

| Element | Class today | Notes |
|---|---|---|
| Name (overlay variant) | `.ac-sans-nav text-emphasis mb-1` | Narrow 12 uppercase |
| Price (overlay variant) | `.ac-sans-nav text-meta mb-4` | Narrow 12 fg-meta |
| Name (caption-below variant) | `.ac-sans-nav text-emphasis truncate` | |
| Price (caption-below variant) | `.ac-sans-nav text-meta flex-shrink-0` | |
| CTA button (overlay) | `<Button variant="primary" size="md">` → `.ac-mono-14` | Atom-driven |

Used by: `Shop`, `Handmade`, `Collection` (home). ~3 surfaces × N grid items.

## H. Card — editorial (journal list / collection list / author article list)

| Element | Class today | Surface |
|---|---|---|
| Meta line (date + tag badge) | `.ac-prose-label flex items-center gap-3` | Journal article list, JournalAuthor article list |
| Article title (inside list card) | `.ac-prose h3` (Sans 24 Compact 400 inside prose) | Journal, JournalAuthor |
| Article excerpt | `.ac-prose p` | Same |
| Author + reading minutes | `.ac-prose-label flex gap-3` | Journal list — uses eyebrow class for byline |
| Collection card label | `.ac-prose-label` ("Title · Year") | Collections list |
| Collection card title | `.ac-prose h3` | Collections list |
| Collection card excerpt | `.ac-prose p` | Collections list |
| Look card label | `.ac-prose-label` ("Look 01 · Family") | CollectionDetail looks grid |
| Look card name | `<p><strong>` inside `.ac-prose` | CollectionDetail |
| Look card fabric | `<p style={{ fontSize: '14px', lineHeight: '20px' }}>` inside `.ac-prose` | **Inline-style escape** |
| Adjacent collection navigation | `.ac-prose-label` ("← Previous" / "Next →") + `.ac-prose p` for title/year | CollectionDetail bottom |
| Badge inside meta | `<Badge variant="outline" size="sm">` → `.ac-badge` | Journal, JournalArticle, JournalAuthor |

## I. Cart drawer (`CartDrawer.jsx`)

| Element | Class today | Notes |
|---|---|---|
| Header "Your bag · N" | `.ac-helper-xxs uppercase text-emphasis` + `<span class="text-meta">` for count | Mono 10 uppercase |
| Close button | (`Icon name="x"`, no text) | |
| Empty state copy | `.ac-helper-xxs text-meta` | Mono 10 |
| Empty state link (Shop / Handmade) | `.ac-helper-xxs text-emphasis underline underline-offset-4 hover:no-underline` | Mono 10 |
| Row item name | `.ac-helper-xxs uppercase text-emphasis no-underline mb-2` (as Link) | Mono 10 — **same data as ProductCard.name (Narrow 12)** |
| Row item meta (size · color) | `.ac-helper-xxs text-meta mb-2` | Mono 10 |
| Row qty value | `.ac-helper-xs` (will → `.ac-helper-12`) | Mono 12 — different scale from row meta |
| Row line price | `.ac-helper-xxs text-emphasis` | Mono 10 |
| Subtotal label | `.text-meta uppercase` (inside parent `.ac-helper-xxs`) | Mono 10 |
| Subtotal value | `.text-emphasis` (inside parent `.ac-helper-xxs`) | Mono 10 |
| Shipping helper text | `.ac-helper-xxs text-meta` | Mono 10 |
| Checkout button label | `<Button variant="primary" size="lg">` → `.ac-mono-16` | Atom-driven |
| Continue-shopping link | `.ac-helper-xxs text-meta hover:text-emphasis self-center` | Mono 10 |

## J. Checkout aside (`Checkout.jsx` right column)

| Element | Class today | Notes |
|---|---|---|
| Header "Your bag · N" | `.ac-helper-xs uppercase text-emphasis` | **Mono 12 — different from CartDrawer's Mono 10** |
| Row item name | `.ac-helper-xs uppercase text-emphasis m-0` | Mono 12 |
| Row item meta | `.ac-helper-xs text-meta mt-2 mb-0` | Mono 12 |
| Row line price | `.ac-helper-xs text-emphasis m-0 pt-1` | Mono 12 |
| Subtotal label | `.text-meta uppercase` (inside parent `.ac-helper-xs`) | Mono 12 |
| Subtotal value | `.text-emphasis` (inside parent `.ac-helper-xs`) | Mono 12 |
| Shipping label / value | `.text-meta uppercase` / `.text-emphasis` (inside `.ac-helper-xs`) | Mono 12 |
| Total label / value | `.ac-helper-xs uppercase text-emphasis` / `.ac-helper-xs text-emphasis <strong>` | Mono 12 |
| "Secure checkout via PayPal" | `.ac-helper-xs text-meta inline-flex items-center gap-2 m-0 pt-2` | Mono 12 with Icon |

**Drift signal:** CartDrawer rows are Mono 10, Checkout aside rows are Mono 12 — same conceptual rows, two different scales.

## K. Order confirmation summary (`OrderConfirmation.jsx`)

| Element | Class today | Notes |
|---|---|---|
| Status icon container | `<div class="bg-surface-secondary">` with `<Icon name="check">` | |
| Eyebrow ("Thank you") | `.ac-prose-label` | Mono 12 (Region C/D treatment) |
| Heading ("Your order is confirmed.") | `.ac-prose-display-md` | Narrow 64 |
| Lede with capture ID | `.ac-prose-lede` | Compact 24 |
| Order-reference label | `.ac-prose-label` ("Order reference", "Shipping to", "Order") | Mono 12 |
| Order-reference body | `.ac-prose <p>` | Sans 16 300 |
| Tracking footnote | `.ac-helper-xxs text-meta` | Mono 10 |
| Row item name | `.ac-helper-xs text-emphasis m-0` | **Mono 12 — different from CartDrawer Mono 10 and Checkout aside Mono 12** |
| Row item meta | `.ac-helper-xxs text-meta` | **Mono 10 — different from Row name's Mono 12** |
| Row line price | `.ac-helper-xs text-emphasis m-0` | Mono 12 |
| Totals (Subtotal / Tax / Shipping / Total) | `.ac-prose <p style={{ display: 'flex', justifyContent: 'space-between' }}>` | Sans 16 300 — **completely different register from CartDrawer/Checkout totals which are Mono** |

**Drift signal:** three commerce surfaces (CartDrawer, Checkout aside, OrderConfirmation) render the same data (row name, meta, price; subtotal/total) in three different registers.

## L. PDP / Product detail page (`ProductDetail.jsx` right column)

| Element | Class today | Notes |
|---|---|---|
| Breadcrumb (Shop / Handmade) | `.ac-helper-xxs uppercase text-meta` + child `<Link class="text-meta hover:text-emphasis">` + `<span class="text-emphasis">` | Mono 10 |
| Product name (h1) | `.ac-prose-display-md` | Narrow 64 |
| Price tagline | `.ac-prose-tagline` + inline `style={{ marginTop: '8px' }}` | Narrow 14 0.14em uppercase |
| Excerpt / blurb | `.ac-prose <p>` with inline `style={{ margin: 0 }}` / `style={{ margin: '12px 0 0' }}` | Sans 16 300 — inline-style overrides |
| Color picker label "Color:" | `.ac-helper-xxs uppercase text-emphasis mb-3` with child `<span class="text-meta">` for value | Mono 10 |
| Color swatch (visual only) | (button, no text label) | |
| Size picker label "Size:" | `.ac-helper-xxs uppercase text-emphasis mb-3` | Mono 10 |
| Size row pill | `.ac-helper-xs uppercase` + inline `style` for padding/borders | **Mono 12 + inline style escape** |
| Quantity label | `.ac-helper-xxs uppercase text-emphasis mb-3` | Mono 10 |
| Quantity value | `.ac-helper-xs` + inline `style={{ minWidth: '2em', textAlign: 'center' }}` | Mono 12 |
| Add-to-bag button (label varies: "Select a color" / "Select a size" / "Add to bag — €X") | `<Button variant="primary" size="lg">` → `.ac-mono-16` | Atom-driven |
| Enquire button label (handmade) | Same | |
| Details section label | `.ac-helper-xxs uppercase text-emphasis mb-3` | Mono 10 |
| Details bullets | `.ac-prose <ul><li>` with inline `style={{ margin: '0 0 4px' }}` | Sans 16 300 |
| About-this-piece label | `.ac-helper-xxs uppercase text-emphasis mb-3` | Mono 10 |
| About-this-piece body | `.ac-prose <p>` with inline `style={{ margin: 0 }}` | Sans 16 300 |

## M. Forms — labels, helper text, errors

| Surface | Field label | Helper / hint | Error alert |
|---|---|---|---|
| `Checkout` (Contact section) | `.ac-helper-xxs uppercase text-emphasis mb-2` (via `<PropertyInput labelClassName>`) — Mono 10 | `.ac-helper-xxs text-meta inline-flex items-center gap-2 cursor-pointer` (checkbox row) | inline `<p class="ac-helper-xs text-emphasis m-0">` inside `.bg-fg-04` panel |
| `Checkout` (Delivery / Shipping / Address) | Same Mono 10 | (none) | (none) |
| `Checkout` (Payment) | `<SectionHeading>` = `.ac-helper-xxs uppercase text-emphasis mb-4` | `.ac-helper-xs text-meta` ("Processing your order…") | `.ac-helper-xs text-emphasis m-0` |
| `Newsletter` home card | (no labels — placeholder only) | (none) | `.ac-helper-xs text-meta text-center` |
| `FooterNewsletter` | `.ac-prose-label` ("Newsletter") — Mono 12 (eyebrow class, not real label) | inline-style body description | inline-style error |
| `Contact` form | (no labels — placeholder only) | `.ac-prose-tagline` ("The form opens your mail client…") + inline `style={{ marginTop: '4px' }}` | (none) |
| `Handmade` enquiry form | (no labels — placeholder only) | (none) | (none) |
| `Input` atom (filled / outline / ghost) | (no label slot — supplied by consumer) | `prefix`/`suffix` text uses `.text-meta` | (none) |
| `Label` atom default | `.text-fg-48` + consumer-supplied class | Used by PropertyInput | |
| `LabeledControl` molecule | `.ac-helper-10 uppercase tracking-widest text-meta` (inline + stacked layouts) | `.ml-2 normal-case tracking-normal text-subtle` (hint span) | |
| `PropertyInput` molecule | default `.ac-helper-10 text-fg-48` (no uppercase) — Mono 10 | (none — handled by Input atom) | |
| `ToggleCheckbox` / `ToggleSwitch` atoms | (label inside class `toggle-checkbox-label ac-helper-12 uppercase tracking-[0.08em]`) | `.ml-2 opacity-60 normal-case tracking-normal text-[10px]` | |

**Drift signal:** five form field-label conventions: `.ac-helper-xxs uppercase text-emphasis`, `.ac-helper-10 uppercase tracking-widest text-meta`, `.ac-helper-10 text-fg-48`, `.ac-prose-label`, `.ac-helper-12 uppercase tracking-[0.08em]`. Five surfaces, five labels register variants.

## N. Empty states / 404 / error alerts

| Element | Class today | Surface |
|---|---|---|
| 404 status "404" | `.ac-prose-label` | JournalAuthor, JournalArticle, CollectionDetail (in-page error states) |
| 404 status "404" | `.ac-helper-xxs uppercase text-meta` | ProductDetail (in-page error state) |
| 404 status "Checkout" | `.ac-helper-xxs uppercase text-meta` | Checkout (empty bag state) |
| 404 heading | `.ac-prose-display-md` | (all of the above) |
| 404 back link | (varies — see Region D back-link variants) | |
| NotFound page route 404 | `.ac-helper-12 uppercase tracking-widest text-meta m-0 mb-4` ("404") + `.ac-sans-display-01 text-emphasis m-0 mb-6` (heading) + `.ac-sans-body-01 text-body m-0 max-w-[60ch]` (body) | NotFound.jsx — **uses different DS classes again** (heading-01-via-display-01, body-01) |
| Newsletter error alert | `.ac-helper-xs text-meta text-center` | Newsletter |
| Newsletter alert (Footer variant) | inline-style escape on `.ac-sans-nav` | FooterNewsletter |
| Checkout payment error | `.ac-helper-xs text-emphasis m-0` inside `.bg-fg-04` panel | Checkout |
| Order confirmation fulfillment warning | `.ac-helper-xs text-emphasis` inside `.bg-fg-04` panel | OrderConfirmation |

## O. Inline meta / status / microcopy

| Element | Class today | Surface |
|---|---|---|
| Marquee head-note | `text-[13px] text-white/60` | Marquee (optional) |
| Marquee kicker | `.ac-helper-12 uppercase text-white/50` | Marquee (optional) |
| Site signature ticker | `.site-sig` block | Mono 11 0.12em uppercase fg-56 (CSS-only) |
| Site signature separator | `.site-sig-sep` | (visual `×`) |
| Site signature hex value | `.site-sig-hex` (inherits Mono) | |
| Marquee item name | `text-[22px] font-medium tracking-[-0.005em]` (inside `inline-flex items-baseline gap-1.5`) | Off-DS body register |
| Avatar initial (sm) | `.text-xs` | Avatar atom |
| Avatar initial (md) | `.text-sm` | |
| Avatar initial (lg) | `.text-base` | |
| Avatar initial (xl) | `.text-3xl` | |
| Reading time / date | inside `.ac-prose-label` flex row | Journal, JournalArticle |
| Cart icon count | (text on Button atom) | SiteLayout nav |
| Cmd-K hint "ESC" | `.ac-helper-xxs text-meta` | CmdKSearch |
| Cmd-K placeholder | inline `style={{ fontSize: 14 }}` on native `<input>` | **Inline-style escape** |
| Cmd-K result label | `.ac-sans-nav truncate` | Narrow 12 |
| Cmd-K result section tag | `.ac-helper-xxs text-meta flex-shrink-0` | Mono 10 |
| Cmd-K "No results." | `.ac-helper-xxs text-meta` | Mono 10 |

## P. Atom / molecule text registers (used across regions)

| Atom / molecule | Default text class | Variant overrides |
|---|---|---|
| `Button` size sm | `.ac-mono-12` | (none) |
| `Button` size md (default) | `.ac-mono-14` | |
| `Button` size lg | `.ac-mono-16` | |
| `Input` size sm | `.ac-mono-12` | |
| `Input` size md (default) | `.ac-mono-14` | |
| `Input` size lg | `.ac-mono-14` | (same as md — quirk) |
| `Dropdown` size sm | `.ac-mono-12` | |
| `Dropdown` size md | `.ac-mono-12` | |
| `Dropdown` size lg | `.ac-mono-14` | |
| `Dropdown` menu item label | `.ac-mono-12` | (always — independent of trigger size) |
| `MenuItem` trigger | `.ac-helper-12 px-3 h-8` | Mono 12 |
| `MenuDropdownItem` | `.ac-helper-12` body + `.ac-helper-10` for shortcut | Mono 12 + Mono 10 |
| `SegmentedToggle` cell sm | (none) | |
| `SegmentedToggle` cell md | `.ac-mono-12` | |
| `ViewToggle` text variant active | `.ac-control--filled .ac-control-sm .ac-mono-12` | Mono 12 |
| `ViewToggle` text variant inactive | `.ac-control .ac-control-sm .ac-mono-12 text-meta hover:text-emphasis` | Mono 12 |
| `ButtonNav` label | `.ac-helper-s` | Mono 14 t-shirt — **legacy scale survivor** |
| `Pill` | `.pill-{outline,subtle,inverse}` + `.pill-{sm,md,lg}` | DS component classes |
| `Tag` | `.tag-control` or `.control-unified-inverse` | DS component classes |
| `Badge` | `.ac-badge .ac-badge-{variant} .ac-badge-{size}` | DS component classes |
| `Avatar` initial | `text-{xs,sm,base,3xl}` + `font-narrow font-semibold` | **Tailwind type ramp escape** |
| `SectionLabel` sm | `.ac-label-compact-md` (icon 16) | Label atom |
| `SectionLabel` md | `.ac-label-compact-lg` (icon 24) | |
| `SectionLabel` lg | `.ac-sans-heading-03` (icon 40) | |
| `Accordion` (primitives) title | `.ac-helper-12 uppercase tracking-widest` | Mono 12 + `tracking-widest` override |
| `Accordion` (primitives) meta | `.ac-helper-12 uppercase tracking-widest text-fg-48` | Mono 12 |
| `Accordion` (primitives) chevron | `font-mono text-[18px] text-fg-48` | **Glyph-as-text** |
| `QuantityStepper` value | inline `font-family: var(--ac-font-family-mono)` + `fontSize: 11/12/14` | **Inline-style escape** — no class |
| `ContentFilters` section title | `.ac-helper-14` | Mono 14 |
| `ContentFilters` count "N of M" | `.ac-helper-14 text-fg-64` | Mono 14 |
| `ContentFilters` filter group label | `.ac-helper-12 text-fg-48` | Mono 12 (no uppercase, no tracking) |
| `ContentFilters` view-mode option | `.ac-helper-14` + inline `style={{ textTransform: 'uppercase', letterSpacing: 1 }}` | **Inline-style escape** |
| `ContentFilters` "(N) filters active" | `.ac-helper-12 text-fg-48` | Mono 12 |
| `ContentFilters` "Clear all" | `.ac-helper-12 transition-colors underline text-fg-48` | Mono 12 |

## Q. Signup overlay (`SignupOverlay.jsx`)

| Element | Class today | Notes |
|---|---|---|
| Sidelabel (collapsed state) | `.ac-sans-nav text-[16px]` (vertical writing-mode) | Narrow 12 → 16 (Region A drift) |
| Sidelabel "UNLOCK 15% OFF" | (text inside button) | |
| Sidelabel × dismiss | (`Icon name="close" size={12}`) | |
| Overlay close × | (`Icon name="close" size={20}`) | |
| Overlay eyebrow "Another Creation" | `.ac-helper-20 text-fg-64` | Mono 20 — **off-register vs Region C kicker** |
| Overlay heading "15% off your first order" | `.ac-sans-heading-02 uppercase text-[64px]!` | Heading-02 force-scaled to 64px |
| Overlay sub-question | `.ac-helper-12 text-fg-48` | Mono 12 |
| Segment buttons (SHOP / HANDMADE / etc.) | `<Button variant="secondary" size="lg">` → `.ac-mono-16` | Atom-driven |

## R. Testimonial / quote-style copy

| Element | Class today | Notes |
|---|---|---|
| Kicker (optional) | `.ac-helper-12 uppercase text-fg-48` | Mono 12 |
| Quote | `m-0 italic font-bold text-[clamp(32px,4.5vw,64px)] leading-[1.2] tracking-[-0.005em]` with `before:content-['"']` / `after:content-['"']` accent quotes | **Arbitrary clamp** — no DS class |
| Cite | `.ac-helper-12 uppercase text-fg-64 before:content-['—_']` | Mono 12 |
| Editorial blockquote (inside `.ac-prose`) | `<blockquote><p>` Sans 24 600 | DS default |
| Editorial blockquote cite (inside `.ac-prose`) | `<blockquote><cite>` Mono 12 500 | DS default |

## S. Color picker / size picker / commerce controls

| Element | Class today | Notes |
|---|---|---|
| PDP color swatch button | (no text, color fill only) | |
| PDP size row button | `.ac-helper-xs uppercase` + inline `style` for padding/borderBottom/color | **Inline-style escape** — Mono 12 |
| Quantity ± button glyph | (`Icon name="minus|plus"`) | |
| Cart row qty value | `.ac-helper-xs` + inline `style={{ minWidth: '1.5em', textAlign: 'center' }}` | Mono 12 |
| PDP qty value | `.ac-helper-xs` + inline `style={{ minWidth: '2em', textAlign: 'center' }}` | Mono 12 |

---

## Roll-up — distinct text registers actually rendered

Sorted by frequency (sites that use this register, counting components-with-N-consumers as N):

| Register | DS class(es) | Where it appears |
|---|---|---|
| Mono 12 0.10em uppercase fg-48 | `.ac-prose-label` / `.ac-site-footer-label` | section eyebrows, footer column titles, page-hero kickers (all variants of D), editorial cards, byline rows, label-on-data rows |
| Mono 12 (numeric / no DS-baked tracking) | `.ac-mono-12` | Button sm, Dropdown sm/md, Input sm |
| Mono 12 uppercase **+ override** to 0.10em | `.ac-helper-12 uppercase tracking-widest` (15 sites) | back link (8 canonical), accordion title/meta, NotFound 404, About figcaption, Newsletter error alert |
| Mono 10 uppercase 0.10em | `.ac-helper-xxs` (deprecated t-shirt) / `.ac-helper-10` (numeric) | cart row, drawer subtotal, commerce back-link, checkout field labels, Cmd-K hints, status text |
| Mono 14 (numeric) | `.ac-mono-14` / `.ac-helper-14` | Button md, ContentFilters title/count/view-mode, Input md/lg |
| Mono 16 | `.ac-mono-16` / `.ac-helper-16` | Button lg, FAQ kicker (one consumer) |
| Mono 20 | `.ac-helper-20` (off-label) | Home hero kicker (misuse), SignupOverlay eyebrow (legitimate-ish) |
| Mono 11 0.12em | `.site-sig*` / `.ac-site-footer-meta` | footer bottom-bar, signature ticker |
| Narrow 12 0.08em uppercase | `.ac-sans-nav` | top nav links, footer links, product card name + meta, Cmd-K result label |
| Narrow 14 0.14em uppercase fg-64 | `.ac-prose-tagline` | secondary-page subline, PDP price tagline, Contact "Write to us" sub |
| Narrow 14 (no tracking) | (none — overrides via `text-body normal-case tracking-[0.04em]`) | FooterNewsletter description (escape) |
| Narrow 24+ uppercase bespoke | inline `font-narrow uppercase font-medium text-[clamp...]` | Home hero h1, Home hero kicker (off-DS) |
| Narrow 64 500 | `.ac-prose-display-md` | secondary-page h1, mid-section heading (DesignerVision, SupportCTA), 404 headings, OrderConfirmation, ProductDetail, JournalArticle, CollectionDetail h1 |
| Narrow 80 500 | `.ac-prose-display` | marketing page h1 (5), HandmadeCard h2 (misuse), CollectionDetail hero h1, Shop hero h1 |
| Narrow 40 500 110lh | `.ac-sans-heading-02` | Newsletter h2, FAQ h2, Checkout h1, SignupOverlay h2 (force-scaled) |
| Compact 24 400 28lh | `.ac-prose-lede` | hero subline (5), PDP excerpt, JournalArticle excerpt |
| Compact 16 500 125lh | `.ac-sans-heading-06` | Collection h2 (home), Collection seasontag |
| Compact 20 500 125lh | `.ac-sans-heading-05` | FAQ row question (`<summary>`) |
| Sans 16 300 24lh fg-80 | `.ac-prose` body | editorial copy (~15 surfaces) |
| Sans 16 300 + bespoke font-size/lh inline | various inline-style | look-card fabric (14/20), FooterNewsletter body (14/1.4) |
| Sans 16 400 160lh | `.ac-sans-body-01` | NotFound body |
| Sans 20 400 lh-28 | `text-[20px] leading-7` | DesignerVision body, SupportCTA body (3 sites) |
| Sans 22 medium tracking-[-0.005em] | `text-[22px] font-medium tracking-[-0.005em]` | Marquee item name |
| Sans 13 | `text-[13px] text-white/60` | Marquee head-note |
| Italic-bold quote clamp 32→64 | `text-[clamp(32px,4.5vw,64px)] italic font-bold` | Testimonial quote |
| Tailwind type ramp (xs/sm/base/3xl) | `text-{xs,sm,base,3xl}` | Avatar initial only |

## Synthesis — patches to the proposed role list

Comparing the census against the role list from the previous message (~12 roles):

### Confirmed roles (the original 12 stand up)

- `.site-link-nav`, `.site-link-footer`, `.site-label-footer` (collapses `.ac-site-footer-label` to canonical)
- `.site-eyebrow-hero`, `.site-title-hero`, `.site-subline-hero` (covers Region C + D titles + sublines)
- `.site-eyebrow-section`, `.site-title-section` (Region E openers)
- `.site-name-card`, `.site-meta-card` (ProductCard pair)
- `.site-row-cart` (cart drawer / checkout aside / order summary commerce rows)
- `.site-label-form` (checkout fields, eventually Newsletter / Contact / Handmade)

### Roles to add (missed in first cut)

- **`.site-back-link`** — 11 instances across 3 visual variants. Genuine role; deserves its own class.
- **`.site-meta-status`** — small status / system text (404 labels, Cmd-K hints, Marquee head-note, signature ticker, ESC pill, "No results.", reading-time meta, badge-adjacent dates). Currently scattered across `.ac-helper-xxs text-meta`, `.ac-helper-12 text-fg-48`, `.site-sig*`. Genuine "small system text" role.
- **`.site-meta-card-editorial`** — distinct from the catalog card meta. Journal article meta line and Collection card label both use `.ac-prose-label` to mark editorial-card byline / date / tag rows. Different from `.site-meta-card` (commerce) because it sits in an editorial register, not a navigation register.
- **`.site-tagline`** — the `.ac-prose-tagline` use (Narrow 14 uppercase 0.14em) covers 6 secondary-page sublines + PDP price tagline + Contact sub. Already in §C/D as "subline" but the subline role is split across `.ac-prose-tagline` (uppercase narrow chrome) and `.ac-prose-lede` (sentence-case compact reading). These are two distinct sub-roles; either split `.site-subline-hero` into `-tagline` + `-lede`, or accept one and migrate.
- **`.site-quote` + `.site-quote-cite`** — Testimonial. Currently arbitrary clamp + accent quote-marks. One consumer today; second consumer would force extraction.
- **`.site-section-label`** — short Mono labels inside editorial sections (CollectionDetail show/collaborators/press section openers — "The show", "Collaborators", "Press"). Uses `.ac-prose-label` today. Could fold into `.site-eyebrow-section` if the visual register matches; might be a tighter `.site-section-eyebrow` if section openers want a smaller register.

### Roles likely too granular to split

- `.site-name-cart-row` vs `.site-name-product-card` — drift today (Mono 10 vs Narrow 12) is real, but probably should *converge*, not be encoded as separate roles. Pick one register for "product name" and apply it both places. **Decision needed before this role lands.**
- `.site-totals-row` vs `.site-row-cart` — totals are a sub-pattern of the cart-row register today; folding them into one `.site-row-cart` role + sub-class for emphasis is enough.

### Surfaces the role layer should explicitly NOT cover

- Anything inside `.ac-prose` — editorial body, Sanity-published article markup, legal-page bodies. Stays on DS prose.
- Atoms' built-in text register (Button, Input, Dropdown, Pill, Badge, MenuItem, ContentFilters, QuantityStepper, ToggleCheckbox). These are atom-tier concerns and changing them affects every surface that consumes them. Treat as out-of-scope unless they're a problem.
- `.site-sig*` (SigTicker) — single-consumer site-CSS chrome, already self-contained.

### Open questions before role-list lands

1. **Product name register convergence** — catalog Narrow 12 (ProductCard) vs cart Mono 10 (CartDrawer) vs checkout aside Mono 12 vs order confirmation Mono 12. Four different scales for the same datum. **Pick one** before defining `.site-name-card` / `.site-row-cart`.
2. **Subline split** — `.site-subline-hero` as one role, or split into `-tagline` (Narrow uppercase chrome) and `-lede` (Compact sentence-case body lede)? Census shows both in use; depends on whether marketing pages should match legal pages.
3. **Form label register** — Mono 10 (Checkout) or Mono 12 (FooterNewsletter eyebrow) or another stop? Currently 5 conventions across 5 surfaces.
4. **Back link variants** — three visual variants (canonical 8, commerce-underlined 2, editorial-eyebrow 3). Collapse to one `.site-back-link`, or accept two (`.site-back-link` + `.site-back-link-underline`)?
5. **404 / empty-state status register** — currently four conventions (`.ac-prose-label`, `.ac-helper-xxs text-meta`, `.ac-helper-12 tracking-widest text-meta`, `.ac-sans-display-01`). Pick one.

These are the design calls that need to land before the role CSS gets drafted.
