# Session: Signup overlay (left-edge sidelabel → 50/50 full-bleed overlay)

**Date:** 2026-05-19
**Agent:** Grim (Claude Opus 4.7, 1M context)
**Summary:** New `SignupOverlay` component — vertical sidelabel pinned to viewport-left edge that expands into a Halfdays-style 50/50 overlay (cream content panel + full-bleed photo). Auto-opens once per session; persistent dismiss via the sidelabel `×`. Mounted in `SiteLayout` (skipped on `/checkout`).

## Changes Made

### Files Modified
- `apps/website/src/components/site/SignupOverlay.jsx` — **new**. Three states: `closed` (dismissed via `localStorage` flag `kol.ac.signup.dismissed`), `collapsed` (sidelabel), `open` (overlay). `sessionStorage` flag `kol.ac.signup.seen` auto-opens once per tab session.
- `apps/website/src/components/site/SiteLayout.jsx` — imports + mounts `<SignupOverlay />` inside the shell; guarded with `!isCheckout` so it doesn't appear on the checkout flow.

### Behavior
- **Sidelabel** — `fixed left-0 top-1/2 -translate-y-1/2`, `bg-surface-inverse`, vertical text via `[writing-mode:vertical-rl] rotate-180`, label "UNLOCK 15% OFF" + rotated `Icon name="close"` for permanent dismiss. Click the label body → expand.
- **Overlay** — `fixed inset-0 grid grid-cols-1 md:grid-cols-2`. Left half: cream `bg-surface-primary text-auto` panel, content `items-center justify-center text-center` (wordmark `ac-helper-20`, headline `ac-sans-heading-02 uppercase text-[64px]!`, lede `ac-helper-12`, four full-width `<Button variant="secondary" size="lg">` segment buttons). Right half: `bg-cover bg-center` photo from `/brand/photoshoot/33a4480.jpg`. Top-left `Icon name="close"` collapses back to sidelabel.
- **Segments** — placeholder labels SHOP / HANDMADE / COLLECTIONS / JOURNAL; current `onClick` just collapses the overlay. Step-2 email-capture is not wired (intentionally — pattern is the Halfdays segmentation → email shape, only step 1 is built).

## Current State

### Working
- Auto-opens on first page load per session.
- Sidelabel × → permanent dismiss (localStorage).
- Overlay × → collapse to sidelabel (not full dismiss).
- Click sidelabel body → re-open overlay.
- Skipped on `/checkout` routes.

### Known Issues
- **Button variant churn.** Iterated through `primary` (rendered hollow inside `bg-surface-inverse` because `ac-btn-primary` tokens redeclare under the inverse cascade), plain `<button>` with `bg-grey-900 text-grey-50` (theme-invariant, worked but didn't use a DS atom), and finally `variant="secondary"` per user — `ac-btn-secondary` is theme-invariant solid grey-100/grey-900 per the recent atoms.css rewrite. User-specified end state.
- **Sidelabel cascade hint discovered.** Tailwind utilities load BEFORE `@ac/ds/index.css` in `apps/website/src/index.css`, so DS classes win at equal specificity. Required `text-[64px]!` (Tailwind important modifier) to override `ac-sans-heading-02`'s `font-size: 40px`. Pattern worth remembering for future DS-vs-Tailwind size overrides — important modifier or inline style.
- **Step 2 (email capture) not built.** Segmentation buttons currently dead-end at collapsing the overlay. Wire to a follow-up email-capture step when the design is decided.

## Next Steps
1. Wire segment buttons to step 2 — email capture form + `POST /api/newsletter/subscribe` (with segment as a tag/field), success state, then collapse to sidelabel.
2. Decide if the 15% claim is backed by a discount mechanism (matching the existing home Newsletter card's "save 10%" claim, which has the same gap per AGENT-CONTEXT).
3. Replace placeholder segment labels (SHOP / HANDMADE / COLLECTIONS / JOURNAL) with whatever real segmentation makes sense for the brand.
