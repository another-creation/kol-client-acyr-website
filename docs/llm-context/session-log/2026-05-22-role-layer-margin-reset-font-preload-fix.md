# Session: Role-layer margin reset (@layer base + :where) + font preload fix

**Date:** 2026-05-22
**Agent:** Grim (Claude Opus 4.7, 1M context)
**Summary:** Fixed a load-bearing CSS cascade bug — every `.site-*` role had `margin: 0` baked in, silently blocking consumer `mb-N`/`mt-N` Tailwind overrides. Tracked it to Tailwind v4's `@layer utilities` architecture; wrapping the reset in `@layer base { :where(...) }` lets utilities override cleanly while still killing `<p>`/`<h*>` browser defaults. Also swapped two font preloads in `index.html` that were warning about unused-within-seconds — they were targeting the wrong fonts for above-the-fold paint.

## Changes Made

### Files Modified

- **`apps/website/src/styles/site-typography.css`** — three-part rework:
  1. Added a single `@layer base { :where(.site-link-nav, .site-link-footer, ..., .site-title-row) { margin: 0; } }` block at the top of the file. 22 role classes listed. `@layer base` sits below Tailwind's `@layer utilities` in the cascade, so `mb-N` etc. win; `:where()` keeps the selector specificity at 0,0,0 so even unwrapped utilities at 0,1,0 would win.
  2. Stripped the per-role `margin: 0` declaration from all 18 individual role rules (the 19th was `.site-label-form` which I'd touched in a prior attempt).
  3. Rewrote the file-header comment "Margin handling" section to explain the new mechanism — layered + `:where()` combination, and the rule "do NOT add `margin: 0` back to individual role rules" since those are unlayered and would beat Tailwind utilities in any layer.

- **`apps/website/index.html`** — swapped the two `<link rel="preload">` font tags:
  - Removed: `PPRightGrotesk-Light.woff2` (base Right Grotesk 300, only used by `.ac-prose` body — below the fold on Home / Shop / Catalog → browser warned).
  - Removed: `PPRightGrotesk-Medium.woff2` (base Right Grotesk 500 — almost no consumers; hero uses *Narrow* Medium, not base).
  - Added: `PPRightGrotesk-NarrowMedium.woff2` (Narrow 500 — powers nav links + page hero titles + product card names — used on every route above the fold).
  - Added: `PPRightGroteskMono-Medium.woff2` (Mono 500 — powers eyebrows + status chrome + cart row meta).
  - Comment block updated to explain the rationale.

### Memory written

- **`~/.claude/projects/-Users-kolkrabbi-dev-projects-kol-acyr-website/memory/feedback_tailwind_v4_layer_cascade.md`** — captures the Tailwind v4 layer cascade rule: unlayered CSS beats any `@layer` rule regardless of specificity. For custom CSS to be overridable by Tailwind utilities, it must be wrapped in `@layer base` (or `@layer components`). The `:where()` zero-specificity trick alone is not enough — was wrong in this project's first attempt.

### Investigation / debugging

- Initial attempt: dropped only `margin-bottom` from `.site-label-form` so Tailwind `mb-N` could win. User reported same problem still visible on PDP `/shop/*`. Re-investigated and discovered the layer rule — Tailwind v4 utilities being in `@layer utilities` means unlayered rules ALWAYS beat them regardless of specificity. `:where()` alone wasn't sufficient.
- Surveyed all 22 role consumers: counted JSX consumers with vs without `mb-N`. Most roles don't pass `mb-N` (they rely on either the bake or parent flex `gap-N`). Blanket-stripping `margin: 0` without a replacement would have inflated spacing on every flex+gap layout where role classes are children. The `:where()` + `@layer base` approach preserves the baseline `margin: 0` for those consumers while letting `mb-N` win when present.

## Current State

### Working

- **Tailwind `mb-N` / `mt-N` / `my-N` / `margin-block` etc. now work cleanly on every `.site-*` role.** Tested mentally against `.site-label-form mb-3` consumers (9 sites across PDP + Checkout) — they now apply 12px bottom margin instead of being silently overridden.
- **Browser default `<p>` / `<h*>` / `<blockquote>` margins still get killed** when consumers don't override (we beat user-agent origin from `@layer base`).
- **Role rules themselves stay unlayered** — font-family, font-size, color etc. retain their normal source-order precedence and beat Tailwind utilities at same specificity (this is the role layer's design intent).
- **Font preload warnings should be gone** — preloads now target fonts actually used above the fold on every route.

### Known Issues

- **Visual verification still pending** — accumulated changes across the last few sessions (structural extractions + cart panel + margin reset + preload swap) have not been walked through a dev server end-to-end. Most likely visible effect this session: the `mb-3` margins on PDP control labels (Color / Size / Quantity / Details / About this piece) and Checkout form labels (Contact / Delivery / Shipping) now actually take effect — user already confirmed "that actually fixed a bunch of stuff related to spacing" on initial reload, but the full pass across all 18 routes is open.
- **`.site-display-eyebrow` uses `font-weight: 600`** but brand Mono only has @font-face declarations for 400 / 500 / 700. Browser will synthetic-bold the 500 variant. Cosmetic, not a hard bug — flagged for later.
- **The 11 prior heads-up items** in `docs/client/kol-client-acyr/01-website/06-style-audit/05-sweep-notes.md` still apply. Margin fix likely closes some of them passively (anywhere the prior unsold `mb-N` was the intended visual but had been silently overridden), but visual review is the only way to confirm.

### Doc sync state (carried from prior turn)

- `docs/ac-documentation/06-app-layers/05-site-typography.md` — peer reference to `docs/client/site-typography.md` — does NOT yet have:
  1. The §7 "Site components — compositional vocabulary" section added to the client-tier doc last turn.
  2. Documentation of the `@layer base { :where(...) }` margin-reset mechanism added today.
  Open decision: propagate, or treat the client-tier doc as the canonical compositional reference and let the peer cover typography only.

## Next Steps

1. **Visual verification pass.** Run `pnpm dev`, walk every page. Pay special attention to spacing — many `mb-N` consumers that previously silently failed are now active. Some surfaces may need their `mb-N` values tuned (the values that were "set" but never applied may not be the values the design wants).
2. **Resolve the 11+ heads-up items** in `05-sweep-notes.md` based on visual review. Several may close automatically now that margins work.
3. **Decide peer-doc sync** for `docs/ac-documentation/06-app-layers/05-site-typography.md` — propagate §7 Site components + @layer base mechanism, or accept divergence.
4. **Optional follow-up:** migrate OrderConfirmation rows to `<CartRow>` for full commerce-surface parity. Single-file change.
