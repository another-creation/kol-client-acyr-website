# Handoff — 2026-05-22 17:03

## Goal of the current arc

Add a `lead` variant to `<Footer>` that places the wordmark and a stacked newsletter inside the existing grid's first column (wordmark top, newsletter bottom via `space-between`, no top strip). Default variant kept intact so both layouts ship side by side. SiteLayout flipped to lead to preview live.

## Last actions taken (causal trail, newest first)

- `.ac-site-footer-newsletter--stack`: added `margin-bottom: 24px` to give breathing room below the form inside the stacked col. (User asked for 24px mb.)
- Reverted padding-top hack on `.ac-site-footer-newsletter--stack` after user pushback ("why not flex?"). Replaced with `.ac-site-footer-col--lead { justify-content: space-between; gap: 48px }` — flex-native spacing on the column itself. Pulled CSS knob from container, not child.
- Swapped wordmark/newsletter order twice — first put newsletter on top, user said "nah wordmark above". Final order: wordmark top, newsletter bottom.
- `justify-content: space-between` added to `.ac-site-footer-col--lead` so the col stretches to row height (grid item default) and pushes wordmark up + newsletter down.
- Newsletter form input cap tuned 280px → 360px. The col is wider than I assumed (~475px on 1900px viewport per the 1.4fr stretch in the grid template).
- Initial misread of the brief: I built the lead variant as a HERO BLOCK above the grid (big wordmark + signup as a top hero, then 4-col grid below). User corrected: "I said move the newsletter signup under wordmark, not move wordmark over newsetter signup." Fixed — newsletter goes inside the wordmark column in the existing 5-col grid; top strip just drops.
- Cleaned up the dead `.ac-site-footer-lead`, `.ac-site-footer-mark--lead`, and `.ac-site-footer-grid--4col` CSS that the abandoned hero approach had added. Reverted the wordmark width-bump (220px). 5-col grid stays.
- `FooterNewsletter` gained `layout` prop (`'strip'` default | `'stack'`). Stack mode = vertical form with eyebrow+body+form stacked, max-width cap, no horizontal padding. Strip mode unchanged.
- `Footer` gained `variant` prop (`'default'` | `'lead'`). Refactored link-column markup into local `StudioCol` + `LinkCol` helpers so both branches reuse them.
- SiteLayout flipped to `<Footer variant="lead" />` so the user can see the change live without having to set a prop themselves.

## Current state / open decision points

- **Footer is on `variant="lead"` site-wide.** Default variant still exists in code but isn't currently consumed. If you want to keep lead permanently, the default branch could become dead code that we'd drop in a future pass.
- **Footer Sign Up button is `variant="secondary"`** — quiet against the dark `bg-surface-tertiary` chrome. Newsletter card on Home is `variant="primary"` (loud dark CTA on a light-forced card). Open decision: align the two, or accept the deliberate register difference (chrome quiet, hero card loud).
- **Primary-button site-wide sweep is still pending.** Outstanding from the prior arc — earlier today we rewired `.ac-btn-primary` from theme-aware subtle chrome to always-dark solid CTA. Every existing primary consumer needs a visual check.

## Next intended action

1. **Visual walk of the lead-variant footer at multiple breakpoints** — desktop (where the col 1 stretches to Studio's 6-line height), tablet (still 5-col?), mobile (collapses to 1-col stack — the `space-between` becomes irrelevant on a single-col layout, but worth confirming the newsletter cap looks right).
2. **Resume primary-button sweep.** This is the dangling thread from the earlier arc.
3. **Settle the Sign Up button variant question** — pass `variant="primary"` to the footer signup or leave it secondary. One sentence decision.

## Working memory not yet in AGENT-CONTEXT

- **The user is very literal about "this above that" / "this under that".** When I built the hero-block version on the first pass, the wordmark ended up above the signup, but in the wrong place architecturally (top of the footer, not inside the grid col). They corrected with the exact phrase reversed: "I said move the newsletter signup under wordmark, not move wordmark over newsetter signup." The fix wasn't about ordering — it was about WHERE the wordmark+signup pair lives. Pattern: re-read the original ask before assuming the correction is a swap.
- **`justify-content: space-between` is what they reached for when I had a padding-top hack.** Memory worth keeping: when adjusting space between two fixed-position children of a flex parent, reach for `justify-content` / `gap` / `margin-auto` on the children, not padding on the children's wrappers. The "why not flex" pushback was a real principle, not a stylistic preference.
- **Input width tuning was iterative**: 280 → 360 in one round. They didn't ask for breakpoints or media-query thinking; they picked a single px value at desktop. Don't over-engineer with `min-w-[Xpx] md:max-w-[Ypx] lg:max-w-[Zpx]` chains — they'll tell you when a value is wrong.
- **The dead-code lead-block CSS I had to clean up** (`.ac-site-footer-lead`, `.ac-site-footer-mark--lead`, `.ac-site-footer-grid--4col`) was a useful reminder: when you build the wrong thing first and pivot, clean up the rules you no longer need. The footer was the only consumer of those names — they would have been orphans.
- **The user typed "what?" mid-flow** when I asked them to manually flip the variant in SiteLayout. I should have just flipped it for them — they want to see the result, not get a how-to. Default to auto-flipping consumer when adding a new variant to preview.
- **Auto-mode handling note:** Auto Mode toggled on/off across the session. When on, the user expects forward motion without checkpoints — flip the consumer to preview, tune until they say "fine." When off, surface decisions before acting.
