# Session: Footer lead variant — wordmark + stacked newsletter in grid col 1

**Date:** 2026-05-22
**Agent:** Grim (Claude Opus 4.7, 1M context)
**Summary:** Added `<Footer variant="lead">` — same 5-col grid as default, but col 1 now stacks the wordmark + a `<FooterNewsletter layout="stack">` (top + bottom of col via `justify-content: space-between`). Top newsletter strip dropped in the lead variant. Default variant unchanged. SiteLayout flipped to `variant="lead"` to preview live.

## Changes Made

### Files modified

- **`apps/website/src/components/site/Footer.jsx`** — added `variant` prop (`'default'` | `'lead'`). Refactored shared column blocks into local `StudioCol` and `LinkCol` helpers to avoid duplicating link-column markup across the two branches. Lead branch: grid with col 1 as `.ac-site-footer-col.ac-site-footer-col--lead` containing wordmark `<div className="ac-site-footer-mark">` (top) + `<FooterNewsletter layout="stack" />` (bottom). No top newsletter strip in lead.
- **`apps/website/src/components/site/FooterNewsletter.jsx`** — added `layout` prop (`'strip'` default | `'stack'`). Stack mode: outer wrapper `flex flex-col gap-4 max-w-[360px]`, form full-width within that cap. Eyebrow + body + form stack vertically. Strip mode (default) unchanged. Outer container gets `ac-site-footer-newsletter--stack` class in stack mode for layout-specific CSS hooks.
- **`apps/website/src/styles/site.css`** — added two new rules at the end of the footer block: `.ac-site-footer-newsletter--stack { padding: 0; margin-bottom: 24px; }` and `.ac-site-footer-col--lead { justify-content: space-between; gap: 48px; }`. The col modifier lets the grid item stretch to row height and pushes the wordmark up + newsletter down via `space-between`.
- **`apps/website/src/components/site/SiteLayout.jsx`** — `<Footer />` → `<Footer variant="lead" />` to preview the variant live. User can revert to default by dropping the prop.

### Behavior changes

- New `<Footer variant="lead">` API exists alongside the existing default. Both variants reuse the same `StudioCol` + `LinkCol` helpers; drift between them cannot reintroduce itself without explicit divergence.
- `<FooterNewsletter layout="stack">` is a vertical, max-360px-wide form intended for use inside a footer grid column (currently lead variant only). Default `layout="strip"` keeps the full-width horizontal strip behavior for the default Footer.
- Lead variant cols 2–5 (Studio / Browse / Connect / More) inherit the existing `.ac-site-footer-col` styles; only col 1 gets the `--lead` modifier.

## Current State

### Working

- Footer lead variant rendering as designed on `/` (and every non-checkout route via SiteLayout). Wordmark top, newsletter bottom of col 1, full grid row height, 24px mb on newsletter, 360px input cap. User confirmed by screenshot iteration: "this is fine."
- Default variant remains visually identical to pre-session — strip on top, 5-col grid below.

### Known issues / heads-up items

- **SiteLayout is currently on `variant="lead"`** — live site shows the new layout site-wide. If you want the default back: drop the prop in `SiteLayout.jsx:88` or pass `variant="default"`.
- **Sign Up button in the footer is still `variant="secondary"`** (FooterNewsletter passes secondary to its Button). Newsletter in the Home card was flipped to `primary` earlier in the day; footer stays secondary. Inconsistent if you want every signup CTA to use the same variant. Open decision.
- **Primary-button site-wide sweep still pending** — flagged in the previous handoff. The variant tier rewire from earlier in the session changes every existing `.ac-btn-primary` consumer; surfaces using primary as "subtle daily chrome" will now read as solid-dark CTAs. Sweep not done.
- **Top of col 1 stretching** — `space-between` makes the wordmark sit at the literal top of the row. If Studio's 6-line list pushes the row taller than feels right, the wordmark + newsletter visually disconnect. Worth eyeballing across breakpoints.

### Out of scope (intentionally)

- Sign-Up button variant alignment across home/footer.
- Primary-button site-wide sweep.
- Animation polish on the footer fold/reveal (user considered earlier; chose static layout instead).

## Next Steps

1. **Decide whether to keep `variant="lead"` as default** or flip SiteLayout back. If keeping it, the variant API is essentially a one-and-done — could drop the default branch as dead code after a quiet period.
2. **Resume primary-button sweep** — outstanding from the prior arc. Screenshot every consumer, decide per-surface.
3. **Footer Sign Up button** — align with Newsletter card (primary) or accept the inconsistency (footer = quiet secondary, hero card = loud primary; defensible per surface register).
