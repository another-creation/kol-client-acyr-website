# Handoff — 2026-05-22 22:30

## Goal of the current arc

Make the `.site-*` role classes interop cleanly with Tailwind utilities. The role layer was supposed to be the single tuning surface for site typography — but the baked `margin: 0` on every role silently beat consumer `mb-N` overrides, which surfaced as "labels flush against their controls" on PDP. Found and fixed the cascade bug; the role layer now does what it advertises.

## Last actions taken (causal trail, newest first)

- Saved memory `feedback_tailwind_v4_layer_cascade.md` capturing the v4 layer rule (unlayered beats any @layer; baseline declarations need to be wrapped in `@layer base` to be overridable by utilities).
- Wrapped the role-margin `:where(...)` reset in `@layer base { ... }`. This was the actual fix — the earlier zero-specificity `:where()` approach didn't work because unlayered rules beat layered utilities regardless of specificity.
- Updated the file-header comment in `site-typography.css` to document the new mechanism + the "don't add `margin: 0` back to individual role rules" rule.
- Swapped the two `<link rel="preload">` font tags in `apps/website/index.html` — were targeting `PPRightGrotesk-Light.woff2` + `PPRightGrotesk-Medium.woff2` (both rarely used above the fold), now target `PPRightGrotesk-NarrowMedium.woff2` + `PPRightGroteskMono-Medium.woff2` (used by topnav + page hero + product cards + status chrome on every route).
- Stripped `margin: 0` from all 18 individual `.site-*` role rules via `replace_all` (the 19th — `.site-label-form` — had been touched in a prior attempt). Briefly broke the `:where()` block's body because the replace_all wiped that occurrence too; restored manually.
- First-attempt `:where()`-only approach: added a zero-specificity reset block at top of `site-typography.css` for all 22 roles. Did not work because Tailwind v4 puts utilities in `@layer utilities` and unlayered rules beat any layer.
- Targeted first-pass on `.site-label-form` only — changed `margin: 0` → `margin-top: 0` to let `margin-bottom` flow through. Did not work for same layer-cascade reason; was rewritten in the broader pass.
- User flagged PDP "QUANTITY" / "DETAILS" labels flush against their controls — `mb-3` on `.site-label-form` was being silently overridden by the role's `margin: 0`.

## Current state / open decision points

**Code state clean.** Single `@layer base { :where(.site-link-nav, ..., .site-title-row) { margin: 0 } }` block at top of `site-typography.css`; per-role `margin: 0` lines all gone. Build green. User confirmed live: "that actually fixed a bunch of stuff related to spacing."

**Visual verification still pending** — same heads-up that's been on the bridge across multiple sessions. The accumulated changes (structural extractions + cart panel + margin reset + preload swap) need an end-to-end browser walk. Likely surfaces that have shifted in this session: any `<p className="site-X mb-N">` or `<h* className="site-X mb-N">` previously silently broken now actually applies the spacing. The values chosen for `mb-N` were chosen under the assumption they worked, but were never actually visible — some may need re-tuning now that they take effect.

**Peer-doc sync open decision** — `docs/ac-documentation/06-app-layers/05-site-typography.md` does not have:
1. The §7 "Site components" addition (last session).
2. Documentation of the `@layer base + :where()` margin-reset mechanism (this session).
Two options: (a) propagate both, or (b) declare the client-tier doc canonical for compositional/structural concerns and let the AC-docs reference cover typography roles only. User has so far declined to expand scope outside docs/client when explicitly asked.

**Cosmetic open item:** `.site-display-eyebrow` uses `font-weight: 600`, brand Mono only has @font-face declarations for 400 / 500 / 700. Browser synthetic-bolds the 500. Either bump role to 500 or 700, or accept the synthetic. Not pressing.

## Next intended action

1. **Visual verification.** Run `pnpm dev`, walk every route. Triage anywhere the now-active `mb-N` spacing looks wrong vs intended. Most likely affected: PDP control rows, Checkout form labels, footer column headers, page hero subline (gap-2 internal still wins because PageHero bakes the flex gap, but anywhere outside the component may behave differently now).
2. **Tune any `mb-N` values that read wrong** under the new working state. One-line edits per call site.
3. **Decide peer-doc sync.** Either action 2 docs sync items now, or close the decision as "client-tier is canonical, peer is typography-only."

## Working memory not yet in AGENT-CONTEXT

- The Tailwind v4 layer rule is the single most important CSS-cascade fact for this project going forward. Saved to memory; will load on /init-agent. Any future "Tailwind utility doesn't override my custom class" question routes through that memory first.
- Tailwind v4's preflight reset is in `@layer base`. My margin reset joins the same layer. Source order within the layer determines tie-breaking — since `site-typography.css` is imported after Tailwind, my reset comes later. Both rules at specificity 0,0,0 (preflight) vs 0,0,0 (`:where()`) → mine wins. Acceptable: I'm killing margins on specific role classes, Tailwind's preflight kills the broader `<p>` etc. defaults — they don't actually conflict on the same target.
- Reasoning shortcut that worked: when the user said "same problem in other pages" after my first attempt, I knew the fix had to be deeper than per-role-rule. Survey of consumers (parallel grep) before the second attempt was the right move — it confirmed that just stripping `margin: 0` everywhere would inflate spacing on flex+gap layouts. The `:where()` + `@layer base` combo preserves the zero-margin baseline AND lets utilities win — both at once.
- The preload swap is a small win but real — page weight reduced by 2 woff2 files that nobody was using, and the FOUC reveal now waits on fonts that are actually painted on first frame. If the FOUC `is-ready` reveal feels faster after this change on cold reload, that's why.
