# Session: Structural extractions — FAQ + BackLink + PageHero + SecondaryPageShell + CartSummary + SiteSection

**Date:** 2026-05-21
**Agent:** Grim (Claude Opus 4.7, 1M context)
**Summary:** Closed the structural-duplication thread of the original audit (Pass 2). Six extractions across the website: FAQ canonicalised onto one component with a `layout="stacked"` variant, four wrapper / layout components extracted (`BackLink`, `PageHero`, `SecondaryPageShell`, `SiteSection`), and the cart aside duplicated rows/totals collapsed into a shared `<CartRow>` + `<CartTotalsRow>` pair. Original 3-thread audit scope (typography + shared classes + structural duplication) is now closed end-to-end.

## Changes Made

### New components

- `apps/website/src/components/site/BackLink.jsx` — wraps `<Link className="site-back-link">`. Optional `className` for margins. Consumed by 12 sites (8 standard back links, 4 in-page 404 states).
- `apps/website/src/components/site/PageHero.jsx` — kicker + title + subline composition. Props: `eyebrow`, `title`, `subline`, `variant` (`'marketing'` / `'secondary'`), `eyebrowVariant` (`'standard'` / `'display'`), `sublineKind` (`'lede'` / `'tagline'`), `className`. Defaults: secondary + tagline. Consumed by 16 sites.
- `apps/website/src/components/site/SecondaryPageShell.jsx` — composes outer `<main>` + `<section class="max-w-3xl ...">` + `<BackLink>` + `<PageHero>` + `.ac-prose` body wrapper. Single component for legal / system pages. Consumed by Privacy, Terms, ShippingReturns, Brand, Press.
- `apps/website/src/components/site/CartSummary.jsx` — two exports: `<CartRow>` (thumb + name + meta + line price; `thumbSize` prop, optional `linkTo`/`onLinkClick`, optional `qtyControl` JSX; if `qtyControl` is omitted, qty is rendered inline in the meta line) + `<CartTotalsRow>` (label + value pair, `emphasis` prop for the total row). Consumed by CartDrawer + Checkout aside.
- `apps/website/src/components/site/SiteSection.jsx` — section wrapper with a named max-width enum: `narrow` (3xl), `reading` (4xl), `wide` (5xl), `grid` (6xl), `panel` ([1200px]), `full` (none). Always centers via `mx-auto`. Horizontal + vertical padding stays at the call site via `className` (kept asymmetric `pt-20 pb-12` patterns intact). Consumed by ~30 sections across 10 pages.

### Existing components modified

- `apps/website/src/components/site/FAQ.jsx` — added `layout` prop (`'split'` default, `'stacked'` new). `'split'` keeps the existing 2-col home layout with `h-[1000px]` lock. `'stacked'` drops the container + grid + lock — just renders the optional header + items list, leaving the section wrapper to the parent. Internals refactored to share `Header` + `Items` JSX between layouts.
- `apps/website/src/pages/site/Handmade.jsx` — local `FaqItem` inline component deleted. `HANDMADE_FAQ` now rendered via `<FAQ items={HANDMADE_FAQ} layout="stacked" />`. Page state for the FAQ open index dropped (canonical FAQ uses native `<details name>`).

### Pages migrated to use the extractions

- **BackLink consumers** (12 sites): Privacy, Terms, ShippingReturns, Brand, Press, JournalAuthor (× 2 — body + 404), JournalArticle (× 2), CollectionDetail (× 2), ProductDetail (404), OrderConfirmation (404), Checkout (empty bag).
- **PageHero consumers** (16 sites): Home (display-eyebrow variant), About, Journal, Collections, Shop (marketing + tagline), Handmade (marketing + tagline), Privacy / Terms / ShippingReturns / Brand / Press (replaced by SecondaryPageShell), JournalAuthor, JournalArticle, CollectionDetail (CollectionHero), ProductDetail, OrderConfirmation, Contact.
- **SecondaryPageShell consumers** (5 sites): Privacy, Terms, ShippingReturns, Brand, Press — outer `<main>` + `<section>` boilerplate gone; pages are now ~20 lines of frontmatter + body content.
- **CartSummary consumers** (2 surfaces): `CartDrawer.jsx` row + subtotal; `Checkout.jsx` aside row + 3 totals rows. Outer shells (drawer overlay vs sticky sidebar) stay surface-specific.
- **SiteSection consumers** (~30 sections, 10 pages): About, Journal, JournalAuthor, JournalArticle, Collections, CollectionDetail, Handmade, Shop, Contact, OrderConfirmation, ProductDetail (404), Checkout (empty state). Pages now read `<SiteSection width="grid" className="px-8 pt-16">` instead of `<section className="max-w-6xl mx-auto px-8 pt-16">`.

### Removed code

- Handmade local `FaqItem` (15 lines).
- ~30 instances of inline `style={{ marginTop: '8px' }}` / `style={{ marginBottom: '32px' }}` on subline / back-link elements (PageHero + BackLink internalised the spacing).
- Repeated `<main className="bg-surface-primary pb-24"><section className="max-w-3xl mx-auto px-8 pt-20"><BackLink ...><p eyebrow><h1 title><p subline><div ac-prose>...</div></section></main>` wrappers across 5 legal pages — single `<SecondaryPageShell>` call now.
- Duplicated grid row markup across CartDrawer + Checkout aside (~15 lines each).
- Duplicated label/value totals row markup in CartDrawer + Checkout aside.

Total deletion: ~250 lines of duplicated JSX boilerplate.

## Current State

### Working

- **Original 3-thread audit scope is closed end-to-end.**
  - Typography drift: resolved by the role layer (prior session).
  - Shared classes: resolved by the role layer (prior session).
  - Structural duplication: resolved by today's 6 extractions.
- `<FAQ>` canonical handles both home (split, 2-col, height-locked) and Handmade (stacked) layouts.
- `<BackLink>`, `<PageHero>`, `<SecondaryPageShell>`, `<CartSummary>`, `<SiteSection>` are the single-source-of-truth for their respective patterns. Tuning any pattern = one component edit.
- Build clean (no orphan classes, no missing imports — verified via grep that zero `max-w-{3xl,4xl,5xl,6xl}` references remain in `apps/website/src/pages` outside the SiteSection definition itself).
- One CollectionDetail closing-tag mismatch found and fixed during sweep (SiteSection open / `</div>` close after a mid-flight Edit failed cleanly; spot-checked structure post-fix).

### Known Issues / Heads-up items deferred for design review

From the prior session's `05-sweep-notes.md`, still open:

1. Mid-section title scale at 64 (FAQ + Newsletter + Handmade interior) may feel too loud near home hero.
2. Collection home section "heading" intentionally kept as `.site-meta-editorial` (small label) instead of `.site-title-section`. Decision pending: small-label or full heading.
3. Cart row name register converged to Narrow 12 — bigger feel than old Mono 10. Tuneable if dense-data feel was preferred.
4. Cmd-K result label is now UPPERCASE via `.site-link-nav`. Probably wants normal-case for readable rows.
5. SignupOverlay eyebrow uses `.site-display-eyebrow` (Mono 24 brand-accent) — louder than old Mono 20 fg-64.
6. Marquee head-note shrank 13px → 11px after migration to `.site-meta-system`.
7. `.site-subline-hero` doubles as mid-section body (SupportCTA + DesignerVision). May split if hero subline and mid-section body diverge later.

New heads-up from this session:

8. **Mid-section title scale on Handmade interior** ("Ask the studio.") went from Narrow 40 → 64 via `.site-title-section` — visible weight gain noted but not visually verified.
9. **PageHero variant API** uses 5 dimensions (variant / eyebrowVariant / sublineKind + slot props). API is currently granular; if too many variants emerge later, may collapse to fewer named compositions.
10. **CartSummary thumb size** is consumer-passed (80 in CartDrawer, 64 in Checkout aside). If a third surface ever shows up, decide whether to standardise.
11. **SiteSection width enum has 5 stops** (narrow / reading / wide / grid / panel). 5 may be more than the site actually needs in steady state — could collapse `reading` (4xl) into `narrow` or `wide` if either matches the journal-list visual.

### What's still out of scope (intentionally)

- Newsletter form share (backlog 3d) — gated on Newsletter design rework. `<Newsletter>` and `<FooterNewsletter>` still share zero markup.
- Atom-tier text register (Button, Input, Dropdown, etc.) stays on DS `.ac-mono-N` classes.
- Editorial `.ac-prose` body content untouched.
- Marquee item name (one-off `text-[22px]`), Testimonial quote inlined inside Testimonial.jsx — single-consumer styling, intentional.

## Next Steps

1. **Visual verification.** Open the dev server, walk every page (Home / Shop / PDP / Cart / Checkout / OrderConfirmation / Journal / Article / Author / Collections / CollectionDetail / About / Brand / Press / Contact / Privacy / Terms / ShippingReturns / NotFound). Confirm nothing shifted unexpectedly from the structural extractions.
2. **Resolve the 11 heads-up items** above based on visual review. Each is a 1-rule CSS edit or 1-prop component change.
3. **Update `docs/client/site-typography.md`** + `docs/ac-documentation/06-app-layers/05-site-typography.md` to reference the new components (BackLink, PageHero, SecondaryPageShell, CartSummary, SiteSection) — these are now part of the site's compositional vocabulary.
4. **Backlog 3d** (Newsletter design rework) is now genuinely unblocked — the role layer + new components remove every dependency.
