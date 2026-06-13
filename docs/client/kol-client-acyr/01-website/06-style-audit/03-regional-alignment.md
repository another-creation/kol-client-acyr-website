---
title: Regional alignment
type: audit
status: active
updated: 2026-05-21
description: Map of the visual register each region of the website actually uses today (top nav, footer, hero, mid-section, cards, cart, forms, microcopy). Identifies same-role-different-class drift and proposes a regional typography contract with three named "chrome stops" — Narrow nav, Mono editorial, Mono dense.
audience: agency-internal
tags:
  - project/acyr
  - domain/website
  - domain/typography
  - domain/audit
sources:
  - apps/website/src/components/site/**/*.jsx
  - apps/website/src/components/molecules/**/*.jsx
  - apps/website/src/pages/site/**/*.jsx
  - apps/website/src/styles/site.css
related:
  - "[[INDEX|style audit index]]"
  - "[[01-typography-inventory|typography inventory]]"
  - "[[02-structural-duplication|structural duplication]]"
---

# Pass 3 — Regional alignment

**Premise:** the website has a small number of natural "regions" — top nav, footer, page hero, mid-section opener, card, cart row, form input — each with its own visual register. Drift happens when the same conceptual role is rendered with different classes depending on which region a consumer happens to be writing in.

This pass:

1. Maps each region to the classes actually in use.
2. Flags the same-role-different-class drift.
3. Proposes a regional typography contract — three "chrome stops" that consolidate the microcopy registers.

## 1. Region map (current state)

### Region A — Top nav (`Nav.jsx` + `.ac-site-nav`)

| Element | Class | Spec |
|---|---|---|
| Link | `.ac-sans-nav` | Narrow 12 · 500 · 1lh · 0.08em · uppercase |
| Drawer link | `.ac-sans-nav text-[14px]` | Same, scaled |
| Cart count badge | (inline span) | — |
| Bg | `var(--ac-surface-primary)` | — |
| Height | 48px fixed | — |

### Region B — Footer (`Footer.jsx` + `.ac-site-footer*`)

| Element | Class | Spec |
|---|---|---|
| Column title | `.ac-site-footer-label` | Mono 12 · 500 · 16lh · 0.10em · uppercase · fg-48 |
| Link list | `.ac-site-footer-list .ac-sans-nav` | Narrow 12 · 500 · 1lh · 0.08em · uppercase |
| Newsletter kicker | `.ac-prose-label` | Mono 12 · 500 · 16lh · 0.10em · uppercase · fg-48 |
| Newsletter body | `.ac-sans-nav` + inline `style={fontSize:14, lineHeight:1.4}` | (escape) |
| Bottom meta | `.ac-site-footer-meta` | Mono 11 · 400 · 0.06em · fg-56 |
| Bg | `var(--ac-color-absolute-black)` | — |

**Drift signal:** `.ac-site-footer-label` is byte-identical to `.ac-prose-label` (Mono 12/16/0.10em/uppercase/fg-48). Two class names for the same spec. The same component (FooterNewsletter) uses *both* on the same page.

### Region C — Marketing page hero (Home / About / Journal / Collections / Shop / Handmade)

| Element | Class | Spec |
|---|---|---|
| Kicker | `.ac-prose-label` | Mono 12 · 0.10em uppercase fg-48 |
| Title | `.ac-prose-display` | Narrow 80 · 500 · 80lh · -0.01em |
| Subline | `.ac-prose-lede` | Compact 24 · 400 · 28lh · 0.02em |
| Bg image | full-bleed `<img>` + `linear-gradient` veil | — |
| Container | `relative max-w-3xl mx-auto px-5 py-24 text-center flex flex-col items-center` | — |

**Exception:** `Home.jsx` itself uses a bespoke hero — `.ac-helper-20 uppercase text-accent-primary` (with inline `fontSize:24, fontWeight:600` override) for the kicker and `font-narrow uppercase font-medium text-[clamp(56px,8vw,96px)] leading-[1.05]` for the title. Neither maps to the Region C contract. Documented at Pass 1 §6.1 + Tier A.3.

### Region D — Secondary page hero (Privacy / Terms / Brand / Press / ShippingReturns / JournalAuthor / OrderConfirmation / ProductDetail / JournalArticle / CollectionDetail / Contact / Checkout-empty)

| Element | Class | Spec |
|---|---|---|
| Back link | `.ac-back-link .ac-helper-xs uppercase tracking-widest` | Mono 12 · 500 · 0.10em (via override) |
| Kicker | `.ac-prose-label` | Mono 12 · 0.10em uppercase fg-48 |
| Title | `.ac-prose-display-md` | Narrow 64 · 500 · 68lh |
| Subline | `.ac-prose-tagline` (legal) OR `.ac-prose-lede` (editorial-detail) | Narrow 14 / 0.14em uppercase OR Compact 24 |
| Container | `max-w-3xl mx-auto px-8 pt-20` | — |

### Region E — Mid-page section opener (DesignerVision / SupportCTA / Newsletter / FAQ / Collection / Marquee)

| Surface | Kicker | Heading | Note |
|---|---|---|---|
| `DesignerVision` | `.ac-prose-label` | `.ac-prose-display-md` (64) | Region C/D scale, mid-page placement |
| `SupportCTA` | `.ac-prose-label` | `.ac-prose-display-md` (64) | Same |
| `Newsletter` | `.ac-prose-label` | `.ac-sans-heading-02` (40) | **Drift — 40px not 64** |
| `FAQ` | `.ac-helper-16 uppercase text-fg-48` | `.ac-sans-heading-02` (40) | **Drift — different kicker class AND smaller heading** |
| `Collection` (home) | (none) | `.ac-sans-heading-06` (16) | **Drift — radically smaller; label-style heading** |
| `Marquee` | `.ac-helper-12 uppercase text-white/50` | (none) | Dark variant kicker |

**Drift signal:** five mid-section openers; four different heading sizes; three different kicker classes. No internal logic for who picks what.

### Region F — Product card (catalog grid)

| Element | Class | Spec |
|---|---|---|
| Name (overlay variant) | `.ac-sans-nav text-emphasis` | Narrow 12 uppercase 0.08em |
| Name (caption variant) | `.ac-sans-nav text-emphasis truncate` | Same |
| Price | `.ac-sans-nav text-meta` | Same family, fg-meta |
| CTA button | `<Button variant="primary" size="md">` | Atom |

Coherent. Single component, two layout variants, one register.

### Region G — Cart row (CartDrawer)

| Element | Class | Spec |
|---|---|---|
| Bag count label | `.ac-helper-xxs uppercase text-emphasis` | Mono 10 uppercase 0.10em |
| Item name | `.ac-helper-xxs uppercase text-emphasis` (as Link) | Same |
| Item meta (size/color) | `.ac-helper-xxs text-meta` | Mono 10 |
| Qty value | `.ac-helper-xs` (will be `.ac-helper-12`) | Mono 12 |
| Item line price | `.ac-helper-xxs text-emphasis` | Mono 10 |
| Subtotal label | `.ac-helper-xxs uppercase text-meta` | Mono 10 |
| Subtotal value | `.ac-helper-xxs text-emphasis` | Mono 10 |
| Helper text | `.ac-helper-xxs text-meta` | Mono 10 |
| Continue-shopping link | `.ac-helper-xxs text-meta hover:text-emphasis` | Mono 10 |
| CTA button | `<Button variant="primary" size="lg">` | Atom |

**Drift signal vs Region F:** the *same product name* shows in catalog as Narrow 12 uppercase, in cart as Mono 10 uppercase. Different surface, different register.

### Region H — Form input (Checkout / Newsletter / FooterNewsletter / Contact)

| Element | Class | Spec |
|---|---|---|
| Field label (Checkout) | `.ac-helper-xxs uppercase text-emphasis` | Mono 10 uppercase 0.10em |
| Field label (Newsletter home card) | (none — placeholder only) | — |
| Field label (FooterNewsletter) | `.ac-prose-label` (kicker, not real field label) | Mono 12 |
| Native input (FooterNewsletter) | `.ac-sans-nav text-emphasis` + inline `fontSize:13` | (escape) |
| Atom input wrapping | `<Input size="lg" variant="outline">` | Atom |
| Checkbox row (Checkout) | `.ac-helper-xxs text-meta` | Mono 10 |
| Error alert (Newsletter) | `.ac-helper-xs text-meta text-center` (will be `.ac-helper-12`) | Mono 12 |
| Error alert (FooterNewsletter) | `.ac-sans-nav text-meta normal-case` + inline `fontSize:12` | (escape) |
| CTA button | `<Button>` atom | — |

**Drift signal:** four form surfaces, four different label registers. No shared "Field" primitive.

## 2. The underlying logic — three chrome stops

Once mapped, three internally-consistent registers emerge. The codebase just hasn't named them.

### Stop 1 — Narrow chrome (Nav register)

- Class: `.ac-sans-nav`
- Spec: Narrow 12 · 500 · 0.08em · uppercase
- Where: top nav, footer link lists, product card name + meta
- Conceptual role: **navigation + catalog labels** — orientation chrome, always-visible structure

### Stop 2 — Mono editorial (Eyebrow / kicker register)

- Class: `.ac-prose-label` (= `.ac-site-footer-label`; same spec, different name)
- Spec: Mono 12 · 500 · 0.10em · uppercase · fg-48
- Where: page-hero kicker (Region C+D), mid-section eyebrow (D, S, N, M variants), footer column title, secondary back-link target (in three places, ill-advised)
- Conceptual role: **editorial section eyebrow** — "this section is named X"; subordinate to a title

### Stop 3 — Mono dense (Data / chrome register)

- Class: `.ac-helper-xxs` (will be `.ac-helper-10` after Pass 1 Tier A.1 sweep)
- Spec: Mono 10 · 500 · 0.10em · uppercase
- Where: cart row name/meta/price, drawer subtotal, checkout field labels, commerce back-link, drawer helper text
- Conceptual role: **dense data UI** — checkout, cart, order summary — high information density per row

These three are the actual chrome registers the codebase has converged on. They're internally consistent within their surfaces; they only look chaotic when listed without the surface context.

### Drift against the three-stop contract

| Drift | Where | Fix |
|---|---|---|
| Footer column title uses `.ac-site-footer-label`, not `.ac-prose-label` | `Footer.jsx` + `site.css` | Alias `.ac-site-footer-label` to `.ac-prose-label` — they're already byte-identical. Best path: drop `.ac-site-footer-label` from `site.css`, change consumers to `.ac-prose-label`. |
| Bottom-bar meta uses `.ac-site-footer-meta` (Mono 11 · 0.06em · fg-56) | `Footer.jsx` + `site.css` | Either accept as a fourth stop ("system meta") or collapse to `.ac-helper-10` (Mono 10 · 0.10em). The 11px is awkward — non-grid. Recommend collapse. |
| `FooterNewsletter` body copy escapes via inline `style` | `FooterNewsletter.jsx` | Pick a real class — either `.ac-prose-lede` shrunk to 14px (add `.ac-prose-lede-sm`?) or accept it lives in Stop 1 (Narrow chrome). |
| `Marquee` head-note uses `text-[13px] text-white/60` | `Marquee.jsx` | Collapse to 12 (Stop 2 spec) or 14 (Narrow body-02). |
| Home hero kicker uses `.ac-helper-20` mono with inline 24/600 override | `Home.jsx` | New `.ac-display-eyebrow` (Narrow 20-24 uppercase brand-accent) — Pass 1 Tier B.3. Outside the three chrome stops; this is a *display-tier* eyebrow, not a chrome eyebrow. Document as such. |
| `Collection` home heading is `.ac-sans-heading-06` (16) | `Collection.jsx` | Choose: align to mid-section register (`.ac-sans-heading-02` like Newsletter/FAQ) OR formally adopt heading-06 as the "label-style section heading" register. Documented decision either way. |
| Region E mid-section heading scale picks between 64 / 40 / 16 | DesignerVision, SupportCTA, Newsletter, FAQ, Collection | See finding #4 below. |
| `ProductCard` name in catalog (Stop 1, Narrow 12) ≠ `CartDrawer` name (Stop 3, Mono 10) | ProductCard.jsx, CartDrawer.jsx | **Intentional and correct.** Catalog = browse register (Stop 1, navigation-y); cart = dense data register (Stop 3). Document the convention so future surfaces know which way to lean. |
| Form-field labels picked from Stop 3 in Checkout, from Stop 2 in FooterNewsletter, missing in Newsletter home | Checkout, FooterNewsletter, Newsletter | Pick one. Recommend Stop 3 (`.ac-helper-10`) for all form labels — matches Checkout's density. Add a shared `<Field label={} hint={}>` primitive to land it. |

## 3. Heading-scale drift in Region E (mid-section opener)

The home page alone renders five mid-section headings at four different sizes:

1. `Collection` — `.ac-sans-heading-06` (16px Compact)
2. `LookbookCarousel` — no heading at all (image-only)
3. `Testimonial` — `text-[clamp(32px,4.5vw,64px)]` (32→64px italic-bold)
4. `DesignerVision` — `.ac-prose-display-md` (64px Narrow)
5. `SupportCTA` — `.ac-prose-display-md` (64px Narrow)
6. `HandmadeCard` — `.ac-prose-display` (80px Narrow) inside a 480px container — Pass 1 §6.3
7. `Newsletter` — `.ac-sans-heading-02` (40px Narrow)
8. `FAQ` — `.ac-sans-heading-02` (40px Narrow)

Five scales: 16, 32-64 clamp, 40, 64, 80. On one page. No apparent rhythm.

**Recommendation:** define a mid-section heading contract.

**Option A — single scale:** every mid-section heading uses `.ac-prose-display-md` (64px). The DS already has it; the Region C/D heroes use the next tier up (`.ac-prose-display` 80px). Consistent rhythm: hero 80 → mid-section 64 → in-section h3/h4 from `.ac-sans-heading-03/04`. Then move Collection, Newsletter, FAQ to `.ac-prose-display-md`. Testimonial keeps its clamp (it's a quote, not a heading).

**Option B — two-stop scale:** "loud" sections (DesignerVision, SupportCTA, HandmadeCard) at 64. "Quiet" sections (Newsletter, FAQ, Collection) at 40. Articulates the difference between primary mid-page content and secondary engagement chrome. Requires conscious classification per section.

Option A is simpler and probably right for this site — there isn't enough hierarchy density to justify two mid-section scales. Test it visually before committing.

## 4. Region-by-region recommendations

### Top nav (Region A)
No drift. Coherent. Leave as-is.

### Footer (Region B)
1. **Collapse `.ac-site-footer-label` → `.ac-prose-label`** (identical spec).
2. **Decide `.ac-site-footer-meta`** — accept as the system-meta stop or merge to `.ac-helper-10`.
3. **Strip inline `style` from `FooterNewsletter`** — pick a class for body copy (proposal: collapse the description to `.ac-sans-body-01` or new `.ac-sans-body-02` if 14px is the intended size).

### Marketing hero (Region C)
1. **Migrate Home hero off the bespoke implementation onto the Region C contract** — `.ac-prose-label + .ac-prose-display + .ac-prose-lede`. OR formally adopt the Home pattern as a distinct "Home-only display hero" and document it. Don't leave it as a one-off that breaks the contract silently.
2. (Pass 1 already proposed `.ac-sans-display-01` as the clamp replacement — equivalent path.)

### Secondary page hero (Region D)
1. After `<PageHero>` extracts (Pass 2), this region collapses to one component. Already coherent in spec.

### Mid-page section opener (Region E)
1. **Pick a heading-scale contract** — Option A (single 64) or Option B (two-stop 64/40). Settle on one.
2. **Pick a single kicker class** — make `.ac-prose-label` the canonical mid-section kicker. FAQ's `.ac-helper-16` and Marquee's `.ac-helper-12 white/50` either align or get documented as "dark-section variants" with explicit naming.

### Product card (Region F)
No drift. Leave as-is. Document the convention: catalog product cards render in **Stop 1 (Narrow chrome)** so they feel like navigation-y browse surfaces.

### Cart row (Region G)
No drift. Leave as-is. Document the convention: dense commerce surfaces render in **Stop 3 (Mono dense)** so information packs tightly per row.

### Forms (Region H)
1. **Standardise field labels on Stop 3** (`.ac-helper-10`). Touches Newsletter (currently uses placeholder-only), FooterNewsletter (currently uses mismatched `.ac-prose-label`).
2. **Extract `<Field label hint?>`** primitive sometime. Out of scope here; flag.

## 5. Documenting the regional contract

Once the cleanup lands, the contract should live somewhere consumers can find it. Recommend appending to `docs/ac-documentation/` (the AC CSS knowledge base) — specifically a new doc at `06-app-layers/05-site-regions.md`:

> Three chrome stops, three named registers, the body type scale layered on top. Each region picks its register and stays in it. Site eyebrows use Stop 2 (Mono 12). Site labels use Stop 3 (Mono 10) when dense, Stop 1 (Narrow 12) when browse-flavoured. Headings pull from the prose-display / heading scales per region intent.

That doc is the missing rulebook that explains why ProductCard is Narrow and CartDrawer is Mono. Without it, the next dev (or agent) will pick whichever class is nearest and add to the drift.

## 6. Sequence of action

Across all three passes, the cleanup order is:

1. **Pass 1 Tier A** — t-shirt helper sweep + letter-spacing fix + replace 3 redundant arbitrary values. Purely mechanical, no extractions.
2. **Pass 1 Tier B** — add the missing classes (`.ac-sans-body-lede`, `.ac-sans-nav-{md,lg}`, `.ac-display-eyebrow`).
3. **Pass 2 #1 + #2** — extract `<BackLink>` and `<PageHero>`. Big mechanical wins.
4. **Pass 2 #4** — collapse Handmade local FAQ onto the canonical.
5. **Pass 2 #3** — extract `<SecondaryPageShell>` on top of #1+#2.
6. **Pass 3 §4** — region-by-region cleanup (footer label collapse, mid-section heading-scale decision, Home hero migration, form-field label standardisation).
7. **Pass 2 #6** — DS-tier prose-margin strip. Most invasive; last.
8. **Pass 3 §5** — document the regional contract in `docs/ac-documentation/`.

Items 1–3 are mostly mechanical and low-risk. 4–7 require small design decisions before executing. 8 closes the loop so the drift doesn't return.
