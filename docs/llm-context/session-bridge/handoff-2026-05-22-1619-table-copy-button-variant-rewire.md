# Handoff — 2026-05-22 16:19

## Goal of the current arc

Close stupid-shit backlog items in sequence. 3c (table copy → markdown) and 3a (button variant adjustment) both shipped. Now mid-arc on the site-wide primary-button visual sweep — every existing `.ac-btn-primary` consumer just changed semantics from "subtle theme-flipping chrome" to "always-dark solid CTA" and needs a walk to spot regressions.

## Last actions taken (causal trail, newest first)

- Marked backlog 3a (Button variant adjustment) as ✅ with detail line. Symmetric model documented: primary = always-dark, secondary = always-light, accent = theme-aware, outline = bordered.
- Secondary hover dropped from grey-400 → grey-300 (#A3A3A4) after user said grey-400 was too much. Grey-300 hits the right read.
- Secondary hover: grey-250 → grey-400 (mirror of primary's 4-stop ramp lift). Then refined to grey-300 — see above.
- Primary hover: grey-700 → grey-500 (#363639). Delta ~35 RGB. User explicitly chose 500 over 700.
- Primary variant rewired to raw greys: `--grey-900` fill / `--grey-100` text / `--grey-500` hover. Font-weight 500 added (matched to secondary). Docstring rewritten to reflect symmetric "always-dark / always-light" model.
- Newsletter signup button flipped `secondary` → `primary` (the original user ask that triggered the variant audit).
- Discovered the variant tier was architecturally broken: primary was theme-aware (surface-secondary fill, rebinds), secondary was theme-invariant (raw grey-100 / grey-900). User called it out: "if secondary is light in both modes, primary has to be dark in both modes — either or." Confirmed and rewired.
- Earlier confusion: I misread "dark on light" as "dark text on light fill" (which secondary already is). User clarified by screenshot — they meant "dark BUTTON on light background." Reset.
- Closed backlog 3c (Table copy → markdown) end-to-end. Two `Table.jsx` files (website + styleguide twin) carry the same `copy` event handler. User confirmed working with a pasted GFM example.
- Initially edited the styleguide-local `Table.jsx`, which is a stale duplicate. The pages on `/reference`, `/styleguide`, `/acyr` import `Table` via `@components` alias → website's copy. Fix moved to the website file. Both now have the same code.

## Current state / open decision points

- **Site-wide primary-button sweep is the next concrete task.** User asked for screenshots as the comms format. Every `<Button variant="primary">` (and every implicit-default Button — primary IS the default in `apps/website/src/components/atoms/Button.jsx`) now renders solid-dark. Anywhere primary was being used as quiet chrome will pop visually.
- **Open question that didn't get answered:** Table.jsx duplicate consolidation. Two identical components; styleguide-local has two relative-path consumers (`AssetTable.jsx`, `TypeScaleSection.jsx`); website's has three styleguide-page consumers via `@components` alias. Pre-existing drift. I flagged it; user moved on without ruling.
- **Secondary hover tuning landed at grey-300** — perceptible but not aggressive. Both buttons now hit a different mid-tone on hover (primary → 500, secondary → 300) rather than converging to the same color. User accepted with "perfect."

## Next intended action

1. **Sweep all primary buttons** — grep the codebase for `<Button variant="primary">` and `<Button>` (no variant = default = primary). Walk each surface, screenshot any that read wrong against the new always-dark fill. User will decide per-surface whether to keep primary, flip to secondary, or switch to accent.
2. After the sweep, consider whether the Newsletter signup is the only place primary actually belongs (dark CTA against light card), and demote everything else to either secondary or accent.

## Working memory not yet in AGENT-CONTEXT

- **User-facing feedback I saved as a memory mid-session:** `feedback_plain_prose_for_simple_answers.md`. After I formatted a 3-consumer count with bold-bracketed totals + bulleted locations + recommendation block, user pushed back hard ("why can't you just answer normally?"). Rule: factual lookups get one or two prose sentences, not structured reports.
- **The variant-tier confusion was instructive.** "primary" in this DS originally meant "the daily chrome button that quietly fits the page surface" (theme-aware, subtle). User reads "primary" as "the prominent CTA" (loud, always-dark). The rewire matches user mental model. If we ever want the old quiet-chrome variant back, it should ship under a new name (e.g. `quiet` or `subtle`), not get bolted back onto primary.
- **Counted variant consumers in two ways during the session.** First pass conflated `Button` and `EditorButton` (both map ghost → `.ac-btn-ghost`, but they're separate atoms). True canonical `<Button variant="ghost">` consumer count = zero. EditorButton has its own consumer count (2 in RuleRow.jsx). For the upcoming primary sweep, audit BOTH atoms but report separately.
- **`grey-250` is a recent ramp stop** (added 2026-05-22 earlier today to fill the grey-200 ↔ grey-300 perceptibility hole). It's only consumed by `.ac-control--outline:hover` now that secondary hover moved past it to grey-300. Token still earns its place but watch for orphan-status if no new consumer surfaces.
- **The user's working pattern is iterative-with-screenshots.** Don't pre-decide values; ship a reasonable starting point and tune from their visual feedback. Don't lecture about the variant architecture in response to "I need X" — just do X and let them course-correct.
