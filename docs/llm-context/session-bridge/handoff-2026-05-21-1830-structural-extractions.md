# Handoff — 2026-05-21 18:30

## Goal of the current arc

Close the original 3-thread style audit scope: typography drift + shared classes + structural duplication. First two threads landed in the prior session (role layer at `apps/website/src/styles/site-typography.css`). This session closed the third (structural duplication) via six extractions. **Arc is logically closed but not visually verified.**

## Last actions taken (causal trail, newest first)

- Extracted `<SiteSection>` with 5-stop width enum (narrow / reading / wide / grid / panel) and migrated ~30 section wrappers across 10 pages.
- Extracted `<CartRow>` + `<CartTotalsRow>` at `components/site/CartSummary.jsx`; migrated CartDrawer and Checkout aside to use them. Outer shells stay surface-specific.
- Extracted `<SecondaryPageShell>` composing BackLink + PageHero + outer `<main>`/`<section>` + `.ac-prose` body wrapper. Migrated 5 legal pages (Privacy / Terms / ShippingReturns / Brand / Press).
- Extracted `<PageHero>` with granular variant API (`variant` / `eyebrowVariant` / `sublineKind`). Migrated 16 page-hero sites.
- Extracted `<BackLink>` wrapping the canonical `<Link className="site-back-link">`. Migrated 12 sites.
- Consolidated FAQ — added `layout="stacked"` prop to canonical `<FAQ>`, deleted Handmade's inline `FaqItem`, Handmade now renders the canonical with stacked layout.
- One CollectionDetail closing-tag mismatch found mid-sweep (SiteSection open / `</div>` close) and fixed.

## Current state / open decision points

**Code state:** All 6 extractions land cleanly. Build should be green (no orphan classes, all imports resolve, all section wrappers swept). **Not yet visually verified in a browser** — ~80 file edits over today's session without running `pnpm dev`.

**11 heads-up items waiting for design calls** (full details in `docs/client/kol-client-acyr/01-website/06-style-audit/05-sweep-notes.md` + this session's log). Most pressing 3:

1. **Mid-section title scale at 64px** — FAQ + Newsletter + Handmade interior headings grew from 40 → 64. May feel too loud on home page. One CSS rule tune.
2. **Cmd-K result rows uppercase** — `.site-link-nav` bakes uppercase, search rows should probably be sentence-case. Add a variant or override at call site.
3. **Mid-section heading scale on Handmade interior** ("Ask the studio.") went 40 → 64 via `.site-title-section`.

**Newly introduced API decisions to validate:**

- `PageHero` 5-prop API (variant / eyebrowVariant / sublineKind / eyebrow / title / subline) — flexible but noisy. If too many shapes emerge, may collapse to named compositions.
- `SiteSection` 5-stop width enum — `reading` (4xl) may be redundant if it collapses cleanly into `narrow` or `wide`.
- `CartSummary` thumb size is consumer-passed (80 vs 64). Three-surface scenario would force standardisation.

**Out of scope for this arc, on backlog:**

- Newsletter form share (backlog 3d) — `<Newsletter>` + `<FooterNewsletter>` still share zero markup. Gated on design rework but now technically unblocked.
- Atom-tier text register (Button / Input / etc.) — stays on DS classes by design.

## Next intended action

1. **Visual verification.** Run dev server. Walk every page. Catch regressions before iterating on heads-up items.
2. **If verification shows the 11 heads-up items want tuning, action them one CSS rule at a time** — that's the role-layer / component-layer payoff.
3. **Update `docs/client/site-typography.md` + `docs/ac-documentation/06-app-layers/05-site-typography.md`** to reference the new components (BackLink / PageHero / SecondaryPageShell / CartSummary / SiteSection). These are now part of the site's compositional vocabulary, not just the typography layer.

## Working memory not yet in AGENT-CONTEXT

- The user pushed back hard mid-session on my hedging — explicit instruction: pick the long-term option, don't manufacture issues to flag, don't menu. Pattern to maintain across future sessions.
- PageHero's `variant` API: 5 dimensions is intentionally granular. If a designer says "all marketing heroes should be one shape" later, collapse to named compositions. But not premature.
- The user reframed structural extractions from "nice-to-have" to "real engineering value" once I explained what each component was (BackLink, PageHero, SecondaryPageShell). The role layer was sold as the main win in the prior session — the structural extractions are the second-tier win that landed today.
- `docs/client/` is the **client handoff tree** (flat client-facing docs, NOT agency-internal process). User corrected me when I nested a typography reference deep in the framework tree — file lives at `docs/client/site-typography.md` directly. Audit folder remains at `docs/client/kol-client-acyr/01-website/06-style-audit/` but its prescriptive sections are superseded; only the reference doc stays canonical going forward.
- One inline CollectionHero variant on the CollectionDetail page (the hero rendered inside a positioned div with `bg-image` veil) uses `<PageHero variant="marketing" sublineKind="tagline">` — proves the variant API can carry a non-default subline kind cleanly.
- The `<CartSummary>` extraction deliberately stopped at row + totals primitives. Three differences between drawer + checkout aside (interactive qty vs text, thumb size, outer shell) were preserved by passing them as consumer-controlled props.
- The 6 extractions surface a follow-up pattern: anywhere the website has a recurring 3-element JSX motif with role-class classes baked in, there's a candidate for extraction. If the user wants to keep simplifying, the next 2 candidates are `<NewsletterForm>` (gated on backlog 3d) and any future cart-checkout-order layout pattern that recurs.
