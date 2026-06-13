# Session: Site-typography role layer — single tuning surface for the website

**Date:** 2026-05-21
**Agent:** Grim (Claude Opus 4.7, 1M context)
**Summary:** Shipped `apps/website/src/styles/site-typography.css` — ~20 role classes named by *where* the text renders (page hero, mid-section, card, cart row, back link, etc.) rather than by primitive size. Migrated every text-bearing JSX call site in the website's page + site layer onto roles across 5 sweep passes. To retune any region of the site visually = edit one CSS rule. Atoms, primitives, and `.ac-prose` editorial body correctly stay on DS classes.

## Changes Made

### New file

- **`apps/website/src/styles/site-typography.css`** — the role layer. ~20 classes:
  - `.site-link-nav` / `.site-link-footer` / `.site-label-footer` — nav + footer chrome
  - `.site-display-eyebrow` — louder brand-accent hero kicker (Home only)
  - `.site-eyebrow-hero` / `.site-title-hero` / `.site-title-page` — page hero kicker + marketing h1 + secondary h1
  - `.site-subline-hero` / `.site-tagline` — hero sublines (sentence vs uppercase)
  - `.site-eyebrow-section` / `.site-title-section` — mid-page section openers
  - `.site-name-card` / `.site-meta-card` / `.site-meta-editorial` — catalog + cart + editorial card register
  - `.site-label-form` — form field labels (Mono 10 uppercase)
  - `.site-body-footer` — footer body copy (Narrow 14 normal-case)
  - `.site-back-link` — canonical Mono 12 uppercase back link, replaces 3 visual variants
  - `.site-meta-status` — uppercase chrome (404 / breadcrumb / Cmd-K / subtotal labels)
  - `.site-meta-system` — sentence-case body (footer copyright / errors / helper / "Continue shopping")
  - `.site-quote` / `.site-quote-cite` — testimonial pull + cite
  - `.site-title-row` — Compact 20 row title (FAQ question)
  - Plus a scope rule: `.ac-site-nav-drawer .site-link-nav { font-size: 14px }` (drawer scales nav links)

  Font families pull from DS tokens (`var(--ac-font-family-sans-narrow)` etc.) so brand swap cascades. Sizes / weights / tracking declared in raw values so site iterates independently of DS. `data-theme="dark"` on wrapper sections handles inversion (no `*-inverse` role variants).

### Files modified — JSX sweeps (~30 files)

**Nav region:**
- `components/site/Nav.jsx` — links → `.site-link-nav`. Drawer `text-[14px]` override moved into role file as scope rule. Unused `drawer` prop deleted.
- `components/site/Footer.jsx` — column titles → `.site-label-footer`. Link lists → `.site-link-footer`. Bottom-bar copyright + entity → `.site-meta-system` (after mid-sweep fix).
- `components/site/FooterNewsletter.jsx` — kicker → `.site-eyebrow-section`. Body description → `.site-body-footer`. Native `<input>` field → `.site-body-footer text-emphasis`. Error → `.site-meta-system`.

**Page heroes (19 surfaces):**
- `pages/site/Home.jsx` — bespoke hero on-contract: `.site-display-eyebrow` (Mono 24 600 brand-accent — kept loud per user) + `.site-title-hero`.
- `pages/site/About.jsx`, `Journal.jsx`, `Collections.jsx`, `Shop.jsx`, `Handmade.jsx` — marketing hero (`.site-eyebrow-hero` + `.site-title-hero` + `.site-subline-hero` or `.site-tagline`).
- `pages/site/Privacy.jsx`, `Terms.jsx`, `ShippingReturns.jsx`, `Brand.jsx`, `Press.jsx` — secondary hero (`.site-eyebrow-hero` + `.site-title-page` + `.site-tagline`) + `.site-back-link`.
- `pages/site/JournalAuthor.jsx`, `JournalArticle.jsx`, `CollectionDetail.jsx` — secondary hero + back link + 404 state.
- `pages/site/ProductDetail.jsx` — breadcrumb → `.site-meta-status`. Hero → `.site-title-page` + `.site-tagline`. 404 state migrated.
- `pages/site/OrderConfirmation.jsx`, `Contact.jsx`, `Checkout.jsx` (empty state), `pages/NotFound.jsx` — secondary hero shape.

**Mid-page sections (14 surfaces):**
- `components/site/DesignerVision.jsx`, `SupportCTA.jsx`, `Newsletter.jsx`, `FAQ.jsx`, `HandmadeCard.jsx`, `Collection.jsx`, `Testimonial.jsx`.
- `pages/site/Handmade.jsx` (interior sections), `CollectionDetail.jsx` (looks/show/collaborators/press/adjacent-nav), `OrderConfirmation.jsx` (order labels), `Contact.jsx` (studio/hours/direct/press/write-to-us).
- Editorial card metas: `pages/site/Journal.jsx`, `JournalAuthor.jsx`, `Collections.jsx`, `JournalArticle.jsx`.
- `pages/site/ShippingReturns.jsx` (see-also line).

**Cards / commerce (7 surfaces):**
- `components/site/ProductCard.jsx` — name + price → `.site-name-card` + `.site-meta-card`.
- `components/site/CartDrawer.jsx` — bag header, item rows, subtotal, helper, continue-shopping link all migrated.
- `pages/site/Checkout.jsx` — aside header, item rows, totals, helper migrated. Payment section heading + processing/error copy migrated.
- `pages/site/OrderConfirmation.jsx` — row breakdown, fulfillment warning, tracking footnote migrated.
- `pages/site/ProductDetail.jsx` — Color/Size/Quantity/Details/About control labels → `.site-label-form`. Size pill + qty value → `.site-name-card`.
- `pages/site/Brand.jsx` — color swatch labels → `.site-meta-system`.
- `components/site/Marquee.jsx` — section wrapped in `data-theme="dark"`. Kicker → `.site-eyebrow-section`. Head-note → `.site-meta-system`.
- `components/site/SignupOverlay.jsx` — sidelabel → `.site-link-nav text-[16px]`. Overlay eyebrow → `.site-display-eyebrow`. Heading → `.site-title-section` (drops force-scaled `text-[64px]!`). Sub-prompt → `.site-meta-system`.
- `components/site/CmdKSearch.jsx` — ESC hint + section badge → `.site-meta-status`. "No results." → `.site-meta-system`. Result label → `.site-link-nav`.
- `pages/site/About.jsx` — figcaption → `.site-meta-editorial`.

**Inversion convention applied:** `data-theme="dark"` added to wrapper sections of SupportCTA, Newsletter, Marquee. `.text-on-inverse` overrides dropped — role classes now flip correctly via theme scope.

**FAQ mop-up (final):** `components/site/FAQ.jsx <summary>` → `.site-title-row` (new role added — Compact 20).

### CSS deletions

- `apps/website/src/styles/site.css` — deleted `.ac-site-footer-label`, `.ac-site-footer-label--legal`, `.ac-site-footer-meta` (consumers all gone). `.ac-site-footer-list` kept (pure list-layout).

### Cascade wiring

- `apps/website/src/index.css` — added `@import "./styles/site-typography.css";` as the 4th line (loads after `site.css`).

## Features Added/Removed

- **Site has one CSS file as the source of truth for typography of its page + site layer.** Tuning a region = editing one rule.
- **Product name register converged** — Narrow 12 across catalog (ProductCard), cart (CartDrawer rows), checkout (aside rows), and order confirmation rows. Was 3 different scales (Narrow 12 / Mono 10 / Mono 12) — now consistent.
- **Back link converged to one visual** (`.site-back-link`, Mono 12 uppercase no-underline). Replaces 3 prior variants (canonical Mono 12 with tracking override, commerce Mono 10 underlined, editorial `.ac-prose-label`).
- **404 / status labels converged** to `.site-meta-status` (uppercase) or `.site-meta-system` (sentence). Was 4 different conventions.
- **Inversion via `data-theme="dark"` scope** is now the convention. No parallel `*-inverse` role classes maintained.
- **DS classes (`.ac-prose-label`, `.ac-prose-display`, `.ac-prose-display-md`, `.ac-prose-tagline`, `.ac-prose-lede`, `.ac-prose-title`) have zero direct JSX consumers in the website.** They remain in the DS for use inside `.ac-prose` editorial containers (which use them as descendant selectors via `.ac-prose h1` etc.) and for the styleguide app.

## Current State

### Working

- Every text-bearing element in the website's page + site layer renders through a role class. To retune the visual register of any region — open `apps/website/src/styles/site-typography.css` and edit one rule.
- Inverse-surface sections (SupportCTA / Newsletter / Marquee / HandmadeCard / SignupOverlay sidelabel) flip foreground correctly via `data-theme="dark"` scope.
- Sentence-case system text (footer copyright, error messages, helper copy) renders proper-case through `.site-meta-system`.
- Uppercase chrome (404 / breadcrumb / Cmd-K / subtotal labels) renders through `.site-meta-status`.
- Build clean (no missing imports, no orphan classes referenced in JSX).

### Known Issues / Heads-up items for design review

Logged in `docs/client/kol-client-acyr/01-website/06-style-audit/05-sweep-notes.md`. Quick list:

1. **Mid-section title scale at 64** — FAQ + Newsletter + Handmade interior headings grew from 40 → 64. May feel too loud on home page near the hero. One CSS rule to dim back.
2. **Collection home heading** — both "Collection" and "SS 2026" intentionally kept as small `.site-meta-editorial` rather than promoted to `.site-title-section` (would have jumped from 16 → 64).
3. **Cart row name register converged to Narrow 12** — bigger feel than the old Mono 10. If dense-data feel was preferred, swap role value.
4. **Cmd-K result label is now UPPERCASE** via `.site-link-nav`. Probably wants normal-case for readable search rows.
5. **SignupOverlay eyebrow** louder — was Mono 20 fg-64, now `.site-display-eyebrow` (Mono 24 600 brand-accent).
6. **Marquee head-note** shrank 13 → 11px.
7. **`.site-subline-hero` doubles as mid-section body** (SupportCTA + DesignerVision). May split later if registers diverge.

### What's NOT covered

- Atoms (Button / Input / Dropdown / MenuItem / ContentFilters / ViewToggle / SegmentedToggle / ToggleBracket / Textarea / Stepper / ToggleCheckbox / ToggleSwitch / PropertyInput / Avatar / SectionLabel) — DS-tier text register, intentionally out of scope.
- Primitives (Accordion) — same.
- Editorial body content inside `.ac-prose` (blog posts, legal page bodies, BlogBody Sanity content).
- `.ac-prose-*` DS classes for inner `<h2>` / `<p>` / `<li>` / `<blockquote>` etc. inside the prose container remain in use via descendant selectors.

## Next Steps

1. **Visual verification** — open the site in dev / staging, walk through each region (Home, Shop, PDP, Cart, Checkout, Order confirmation, Journal, Article, Author, Collections, Collection detail, About, Brand, Press, Contact, Privacy, Terms, ShippingReturns, NotFound). Look for shifts that read wrong.
2. **Tune the 7 heads-up items** based on what the visual review surfaces. Each is one CSS rule.
3. **Drop the audit doc statuses** — Passes 1-3 in `docs/client/kol-client-acyr/01-website/06-style-audit/` can be marked `status: superseded` since the role layer replaces their prescriptive sections. Cosmetic.
4. **Backlog 3d (Newsletter design rework)** remains the named next polish target — now made easier by the role layer (FooterNewsletter description / error / kicker all on roles).

## Architectural note for future agents

If you're editing typography in `apps/website/src/`:

- **Most slots use a `.site-*` role class** — open `apps/website/src/styles/site-typography.css` and find the role. Edit the rule there, NOT the call site.
- **Atoms (Button / Input / Dropdown / etc.) carry their own text register.** Don't override at consumer call site; edit the atom.
- **Editorial body content** (long-form copy, blog, legal-page body) goes inside `<div className="ac-prose">` and uses DS prose styling automatically.
- **Dark-surface sections** wrap in `data-theme="dark"`. Role classes flip via theme scope; never reach for `*-inverse` variants.
- **New role needed?** Add it to `site-typography.css`, document the slot, use it at the call site. Don't reach for a Tailwind arbitrary `text-[Npx]` value as a workaround — that's how drift returns.
