# Session: FAQ + Testimonial CSS purge

**Date:** 2026-05-19
**Agent:** Grim (Claude Opus 4.7, 1M context)
**Summary:** Two home-page sections rewritten Tailwind/DS-first, `.site-faq*` and `.site-testimonial*` CSS blocks deleted, FAQ container locked at 600px, accordion now mutually-exclusive via native `<details name="faq">`. Real Another Creation FAQ copy in place of the federation/starship placeholder.

## Changes Made

### Files Modified

- `apps/website/src/components/site/FAQ.jsx` — full rewrite. Section now `bg-surface-primary text-on-primary px-8 h-[1000px] overflow-hidden flex items-center` (final value set by user; earlier iterations went through `h-screen` and `h-[600px]`). Inner grid `max-w-[1200px] w-full mx-auto grid gap-8 md:gap-12 md:grid-cols-[1fr_2fr]`. Kicker `ac-helper-16 uppercase text-fg-48`. Title `ac-sans-heading-02`. Each `<details>` carries `name="faq"` so the accordion is browser-native mutually exclusive — only one open at a time, zero JS. Item row uses `group border-t border-fg-08 first:border-t-0`. Summary `flex items-center justify-between gap-4 py-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden ac-sans-heading-05`. Toggle is a `<span>` (can't nest `<button>` inside `<summary>`) that picks up Button-atom visuals: `ac-btn ac-btn-primary w-7 h-7 shrink-0 rounded-full! transition-transform duration-200 group-open:rotate-45`. Plus icon swapped from text `+` to `<Icon name="plus" size={12} />` so the 45° rotate gives a clean ×. Body `<div className="ac-prose pb-6">` — `.ac-prose` is the DS editorial body class (16px weight 300 line 24px fg-80 max-w-720) so the answer reads light and legible.

- `apps/website/src/components/site/Testimonial.jsx` — full rewrite, no `<blockquote>`/`<cite>` ceremony. Section + div + three `<p>`s. `inverse` prop dropped (zero consumers used it). One className per element, no template literals, no `surface` helper variable. Curly quote characters used directly in `before:content-['"']` / `after:content-['"']` so the accent quote marks read naturally without escape gymnastics. `ac-helper-12 uppercase text-fg-48` kicker, italic-bold clamp blockquote with `before/after` accent quote marks, `ac-helper-12 uppercase text-fg-64 before:content-['—_']` cite. Section padding `px-5 md:px-8 lg:px-14 py-16 md:py-24` (lg:py-32 dropped by user). Inner `max-w-[1200px] h-[600px] mx-auto flex flex-col justify-center text-center`.

- `apps/website/src/pages/site/Home.jsx` — `FAQ_ITEMS` array fully rewritten. Replaced 5 federation/bridge-platform placeholder Q/As with real AC atelier copy: shop vs atelier, lead time, made-to-measure, shipping, care. Kicker/title `Ship's log` / `Transmissions from the bridge.` → `Frequently asked` / `Before you order.`.

- `apps/website/src/styles/site.css` — three deletions:
  - Entire `.site-faq*` block (~90 lines), replaced with a one-line breadcrumb comment.
  - Entire `.site-testimonial*` block (~65 lines), replaced with a one-line breadcrumb comment.
  - Both `.site-faq` and `.site-testimonial` dropped from the full-bleed selector list at line 20 (`width: 100vw; margin-left: calc(50% - 50vw)`).

### Features Added/Removed

- **Accordion-style FAQ (one open at a time).** Browser-native via `<details name="faq">`. No React state, no `onToggle` handler.
- **FAQ container locked at 1000px.** Section is fixed height `h-[1000px] overflow-hidden flex items-center` — opening an item cannot grow the layout. (User landed on 1000px after iterating 600px → screen → 1000px.)
- **Plus icon (rotates to ×).** `<Icon name="plus" />` replaces the text `+` in the toggle button. Rotation is geometrically clean at 45°.
- **Button-atom visuals on FAQ toggle.** Toggle `<span>` picks up `ac-btn ac-btn-primary` so border, hover background, transition, cursor, flex-centering all come from the DS atoms layer instead of being hand-rolled.
- **Rounded-full override on `.ac-btn`.** `.ac-btn` sets `border-radius: var(--ac-radius-sm)` and lives later in the cascade than Tailwind utilities, so plain `rounded-full` loses the specificity tie. Documented as a real gotcha — use `rounded-full!` (Tailwind v4 important suffix) when needing a circular shape inside the button system.
- **Star-trek-ipsum retired from FAQ.** Real AC voice copy in place.

## Current State

### Working

- FAQ renders: 5 Q/As in a 600px-tall section (now 1000px after last user edit), one-open-at-a-time accordion, plus icon rotates to ×, kicker `ac-helper-16` + title `ac-sans-heading-02` on the left column, accordion list on the right. Toggle picks up DS button styling so it visually ties to every other button on the site.
- Testimonial renders: kicker + italic-bold quote with accent-coloured curly quote marks + em-dashed cite, all centered inside a 600px-tall block with surface-primary background.
- `.site-faq*` and `.site-testimonial*` CSS blocks deleted from `site.css`. Both components self-contained in JSX.
- Two full-bleed selectors (`.site-faq`, `.site-testimonial`) cleaned from the `width: 100vw` escape list — neither component needs the escape any more.

### Known Issues

- **Tailwind utility cascade specificity vs `.ac-btn`.** `.ac-btn` sits after Tailwind's utility layer source-order, so `border-radius`, `padding`, transitions etc. set on `.ac-btn` win the tie against bare Tailwind utilities. Forces use of `rounded-full!` style overrides whenever the button shape needs to break out of the default `border-radius: var(--ac-radius-sm)`. Same pattern would bite anyone trying to override Button atom internals with plain Tailwind. Could be addressed in a DS hygiene pass by moving `.ac-btn` into an explicit `@layer components` block so utilities win automatically.
- **No transition smoothing on the FAQ open/close height change.** Browser-native `<details>` toggles open/closed without animation. Acceptable for the editorial brief; if motion is wanted later, the move is the new CSS `interpolate-size: allow-keywords` + `height: calc-size(auto)` pattern (Chrome 129+) or framer-motion with controlled state. Not in this scope.
- **FAQ overflow at 1000px.** `overflow-hidden` clips silently if the open answer is too long for the locked height. With 5 answers averaging 2-3 lines, current copy fits. Long answers added later will be invisible — pruning copy is the discipline, not bumping the height.

## Next Steps

1. **Visual review of FAQ + Testimonial in dev.** User has been iterating live; one more pass once everything settles.
2. **DS hygiene pass: `.ac-btn` cascade ordering.** Move `.ac-btn` into `@layer components` so Tailwind utility overrides (`rounded-full`, `p-0` etc.) work without `!`. Tracked here, not a blocker.
3. **Newsletter design rework (backlog 3d).** Still the next genuine polish target on the home flow now that FAQ + Testimonial are out of the way.
4. **Multi-color end-to-end test via `vercel dev`.** Same standing item from the 14:18 handoff — not advanced this session.
