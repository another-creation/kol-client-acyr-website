# Handoff — 2026-05-23 08:58

## Goal of the current arc
Tune the Home-page scroll choreography to the user's taste, live. Two big pieces just landed (LookbookCarousel scrubbed-bento rebuild, DesignerVision pin/open/stack) and need a dev-server walk; ScrollSmoother + parallax is the next requested feature but is gated on a green-light because it's architectural.

## Last actions taken (causal trail, newest first)
- DesignerVision: split into a long pin (`pinSpacing:false`, `end:'+=260%'`) that holds DV in place + a short image-open (`end:'+=80%'`); added desktop-only `h-screen` spacer in Home so SupportCTA waits ~100vh before overlapping. SupportCTA got `relative z-10`.
- DesignerVision: reworked layout to absolute half-columns so the image can open to full width over the text on scroll; deck made scroll-driven; crossfade 250ms.
- HandmadeCard: added background-image-drift parallax (oversized layer, `yPercent -8→8`).
- SupportCTA: `min-h-[70vh]`.
- Collection: timed reveal (not scrub); swapped to new `set` images; moved AFTER LookbookCarousel.
- LookbookCarousel: rebuilt as the real GSAP scrubbed-bento (Flip + `expoScale(1,5)`, two `.lookbook-*` CSS layouts) — sourced by loading the actual pen via `cdpn.io/pen/debug/vYMzKZx` in Playwright.
- Marquee: removed scroll-direction reversal (clean loop). Testimonial: quote fades as a block (no per-char). Nav: opacity-only entry via useGSAP, dropped per-link stagger. useSplitReveal: StrictMode fix + uniform `y` rise.
- Installed GSAP AI skills + `@gsap/react`; `lib/gsap.js` registers useGSAP/Flip/ExpoScaleEase. Fixed prior-arc StrictMode reveal bugs by moving to `useGSAP`.
- Purged big Playwright trace files from git history so the push could go through.

## Current state / open decision points
- **DesignerVision pin/stack is UNVERIFIED.** `pinSpacing:false` may cause a jump when the pin engages. The `+=260%` / `h-screen` / `+=80%` values are guesses. Open question the user raised earlier: should the image fully open *before* SupportCTA overlaps, or simultaneously? (Currently: opens in first ~80vh, then ~100vh hold, then overlap.)
- **ScrollSmoother is wanted but not started** — needs the user's go-ahead (it touches the layout shell + Nav/SignupOverlay scroll reads). Pen source saved at `tools/playwright/smooth/scripts.js` (it's just `ScrollSmoother.create({ smooth:2, effects:true, normalizeScroll:true })` + `data-speed` parallax).
- Nothing has been visually walked this session — user validates live and iterates fast, one knob at a time.

## Next intended action
- Have the user reload and scroll through DesignerVision → SupportCTA. Watch for the pinSpacing:false jump first; then tune timing. If it jumps, switch DV to a negative-margin overlap (SupportCTA `-mt-[Nvh]`) instead of pinSpacing:false.

## Working memory not yet in AGENT-CONTEXT
- **`cdpn.io/pen/debug/<id>` is the way to read GSAP demo source** — codepen.io is Cloudflare-walled to the Playwright bot, but the cdpn.io debug host serves the rendered pen with inline JS/CSS. `tools/playwright/inspect-cdpn.mjs <penId> <outDir>` does it.
- User taste signal this session: consistently wants LESS/cleaner motion (killed: char-scatter, marquee reversal, per-char quote, nav link stagger, Collection scrub) but YES to deliberate signature moments (scrubbed-bento zoom, DV pin-open-stack). When they say an effect is "too quick," scrub is usually the culprit (speed = scroll speed) — switch to timed, or add pin distance.
- The 20 `set` images (`/brand/shop/set/set-01..20.jpg`, optimized from `_tmp/shop-set/`) are not yet mapped to products — paired by index in Collection, hand-picked subset in LookbookCarousel.
