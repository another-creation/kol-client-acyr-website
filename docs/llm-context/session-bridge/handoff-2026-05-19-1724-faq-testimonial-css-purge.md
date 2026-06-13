# Handoff — 2026-05-19 17:24

## Goal of the current arc

Continue stripping bespoke per-component CSS from the home page in favour of Tailwind + DS classes inline. This session: FAQ + Testimonial. Both `.site-faq*` and `.site-testimonial*` blocks deleted, both components rewritten with Tailwind utilities and DS classes (`ac-helper-*`, `ac-sans-heading-*`, `ac-prose`, `ac-btn`, `text-fg-*`, `border-fg-*`). FAQ also picked up: native exclusive-open accordion, real AC voice copy in place of star-trek-ipsum, button-atom visuals on the toggle. Trajectory matches the FeatureSplit / Collection / Newsletter pattern from the earlier IDIOT AUDIT pass.

## Last actions taken (causal trail, newest first)

- Testimonial.jsx flattened. `<blockquote>` + `<cite>` ceremony dropped → three `<p>`s + a div + a section. `inverse` prop removed (no consumers). Template literals + `surface` helper variable killed. Curly quote characters used directly in `before:content-['"']` so the accent quote marks read naturally. User then trimmed `lg:py-32` → leaving `px-5 md:px-8 lg:px-14 py-16 md:py-24` (final form is in the file, intentional).
- `.site-testimonial*` block deleted from `site.css` (~65 lines). `.site-testimonial` also dropped from the full-bleed selector list at line 20.
- Testimonial rewritten Tailwind-only. Surface pair on section, `max-w-[1200px] h-[600px] flex flex-col justify-center text-center` on inner, `ac-helper-12 uppercase text-fg-48` kicker, italic-bold clamp blockquote with `before:/after:content-['"']` accent quote marks, `ac-helper-12 uppercase text-fg-64 before:content-['—_']` cite.
- FAQ container locked. User iterated `min-h-[88px]` (wrong — inflated open card) → `py-6` (wrong — container still grew with content) → `h-screen` (wrong — content overflowed past) → `h-screen overflow-hidden` (wrong — too tall) → `h-[600px] max-h-[600px] overflow-hidden` (accepted). User then manually bumped to `h-[1000px]`. The takeaway: fixed-height container on the section, content centered inside, overflow clipped.
- FAQ accordion made mutually exclusive via native `<details name="faq">`. Zero JS, browser-native exclusive-open behaviour. Caniuse ~94% — safe for this project's audience.
- FAQ question typography → `ac-sans-heading-05` (20px weight 500). FAQ body answer → `.ac-prose` (DS editorial body — 16px weight 300 line 24px fg-80). FAQ kicker → `ac-helper-16 uppercase text-fg-48` (was `ac-sans-nav` 12px, bumped per user feedback). Padding settled at summary `py-6` + answer `pb-6`.
- FAQ toggle button picked up Button-atom visuals via `ac-btn ac-btn-primary` on a `<span>` (can't nest `<button>` in `<summary>`). Plus icon swapped from text `+` → `<Icon name="plus" size={12} />` so 45° rotate gives a clean ×. Used `rounded-full!` because `.ac-btn` sets `border-radius: var(--ac-radius-sm)` and beats plain `rounded-full` on cascade order.
- Caught using `border-[color:var(--ac-fg-08)]` arbitrary values when `.border-fg-08` / `.border-fg-24` exist as DS ramped classes. Swapped to the DS classes.
- `.site-faq*` block deleted (~90 lines). `.site-faq` dropped from full-bleed selector list. FAQ section accent-color flips (summary hover, toggle on-open, body links) all removed — section is neutral, no `--brand-primary` highlight on any state.
- FAQ_ITEMS in Home.jsx rewritten. Five real AC atelier questions: shop vs atelier, lead time, made-to-measure, shipping, care. Kicker/title swapped: "Ship's log" → "Frequently asked", "Transmissions from the bridge." → "Before you order."

## Current state / open decision points

- **FAQ section height is `h-[1000px]` per user's last edit.** Section is `overflow-hidden` so opened answer is clipped if it runs past visible space. Current copy (2-3 line answers) fits comfortably. If a future answer is longer, copy gets pruned, not the height bumped.
- **Star-trek-ipsum still alive in two places on the home page:** `<Testimonial>` kicker passes `${BRAND.name} positioning · Kolkrabbi · Stardate 2026` and cite passes `Brand positioning, Kolkrabbi` — neither component owns those strings, they're passed from `Home.jsx`. User flagged FAQ specifically this session and I left Testimonial copy alone; flag for the next pass.
- **`.ac-btn` cascade ordering bites whenever a consumer needs to override DS button defaults.** Used `rounded-full!` this session; same trick will resurface anywhere else. Real fix: wrap `.ac-btn` (and atoms.css more broadly) in `@layer components` so utilities sit naturally above components in Tailwind v4's layer order. Not done here — DS hygiene scope.
- **`text-emphasis` inside `.bg-surface-inverse`** still broken (same as 14:18 handoff). Workaround `.text-on-inverse` still in use. Real DS fix not attempted this session.
- **No animation on the `<details>` toggle.** Native open/close is instant. Acceptable for now. If motion wanted, swap to `interpolate-size: allow-keywords` + `height: calc-size(auto)` (Chrome 129+) or controlled framer-motion.

## Next intended action

1. **Visual review of FAQ + Testimonial in dev once the user is happy with current state.** All changes are HMR-live; restart `pnpm --filter website dev` if symlinked DS files don't pick up (known issue with `packages/ds/` HMR).
2. **Testimonial copy pass.** Replace `Kolkrabbi · Stardate 2026` + `Brand positioning, Kolkrabbi` with real AC voice — pull from `docs/client/kol-client-acyr/02-brand/05-writing-examples.md` if anything fits. Or write fresh — atelier vision quote from Ýr, or a press citation from the 2011/2013/2018/2020 press list.
3. **DS hygiene: move `.ac-btn` (and the wider atoms layer) into `@layer components`.** Removes the `rounded-full!` workaround, removes the cascade-specificity surprise for future consumers.
4. **Newsletter design rework (backlog 3d).** Still the next polish target on the home flow.

## Working memory not yet in AGENT-CONTEXT

- **`<details name="…">` is supported widely enough to lean on for accordions in this repo.** Caniuse ~94%. Zero React state, zero `onToggle`. This is the project's first use; if more accordions land, reach for this pattern, not a custom React state machine.
- **`.ac-prose` is the right DS body class for editorial copy** (16px weight 300 fg-80 max-w-720, includes 24px line-height). Heavier than `.ac-sans-body-01` (weight 400). Use `.ac-prose` for body copy in long-form contexts (FAQ answers, blog body fallback, atelier vision blocks); `.ac-sans-body-01/02/03` for UI text in cards / chrome.
- **`.ac-helper-N` mono helpers** (8, 10, 12, 14, 16, 20px) are the right scale for section-level kickers and eyebrow labels. The home hero uses `ac-helper-20`; FAQ + Testimonial now use `ac-helper-16` and `ac-helper-12`. `.ac-sans-nav` (12px narrow sans) is for nav/footer links and ProductCard meta, not editorial eyebrows.
- **Curly quotes in Tailwind `content-[]` arbitrary values work cleanly** without escape headaches if you use the actual `"` `"` Unicode characters: `before:content-['"']`. Avoids the JSX-string `\"` mess from straight quotes.
- **The user's height-fix vocabulary:** "fix the height" means *pin it at a value*, not *repair*. Hit this hard this session — `fix` here is `assign a fixed value`. Default to literal pixel/viewport heights on container divs whenever this phrasing surfaces.
- **Button-atom visuals work fine on a `<span>` if you can't use a real `<button>`** (e.g., nested-interactive cases like inside `<summary>`). `ac-btn ac-btn-primary` gives border, background, hover, transition, flex-centering, cursor. Per-context shape (circle, fixed dimensions) layered on top with Tailwind.
- **`.border-fg-NN` ramped classes exist** at `packages/ds/tokens/opacity.css` lines 264–277 (primary surface) + 279–292 (inverse surface). I missed them at first with a shallow grep that only caught `.border-fg` + `.border-fg-inverse`. Always grep both anchor patterns when checking for DS utilities.
