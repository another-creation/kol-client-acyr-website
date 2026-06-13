# Session: GSAP animation infra + Home roadmap phase 1-3

**Date:** 2026-05-22
**Agent:** Grim (Claude Opus 4.7, 1M context)
**Summary:** Shipped the GSAP animation foundation + applied signature motion to every Home section. Playwright recon used to inspect reference sites (375.studio, good-fella.com) + four GSAP demos. New `lib/gsap.js` + `useReveal` + `useSplitReveal` hooks. PageHero gained char-reveal that lights every page hero. Nav got chrome entry. Marquee → GSAP directional tween (replacing CSS keyframe). Collection cards scrub into the original grid. LookbookCarousel converted from Embla to scrubbed bento. DesignerVision flips through portrait deck before landing on canonical. Testimonial got per-character quote reveal. SupportCTA flipped to `data-theme="light"` + shadow elevation. HandmadeCard became a full-screen rotating 4-image deck with progress timer. FAQ rows stagger-reveal. Newsletter content staggers in. Phase 4 tuning still open.

## Changes Made

### Files added

- **`apps/website/src/lib/gsap.js`** — single import surface for `gsap` + `ScrollTrigger`. Registers ScrollTrigger once at module load. Exports `prefersReducedMotion()` helper.
- **`apps/website/src/hooks/useReveal.js`** — IntersectionObserver-backed scroll-into-view fade-up. Targets `[data-reveal]` descendants. Supports `y`, `duration`, `delay`, `stagger`, `ease`, `threshold`. Reduced-motion safe.
- **`apps/website/src/hooks/useSplitReveal.js`** — per-character text reveal. Manual span injection (no paid SplitText plugin). Animates opacity + alternating ±x. Optional scroll-trigger or mount-trigger. Idempotent via `data-split-done`.
- **`docs/plans/01-home-page-animation.md`** — plan archetype doc. Started as draft scope; updated to reflect actual shipped implementation with per-section table + decisions-made section.
- **`tools/playwright/`** subfolder (outside workspace) — `package.json` + `inspect-animations.mjs` (initial recon) + `inspect-cards.mjs` (scroll + hover capture) + `find-iframes.mjs` (extract codepen iframe URLs from demos.gsap.com). Playwright as devDep; not in workspace lockfile.

### Files modified

- **`apps/website/src/components/site/PageHero.jsx`** — added refs + useReveal on the container + useSplitReveal on the title. Eyebrow + subline get `data-reveal`. Sequence: eyebrow (0s) → title chars (0.25s, 30ms stagger, ±8px x) → subline (1.1s).
- **`apps/website/src/components/site/Nav.jsx`** — added `gsap.timeline()` on mount: nav bar slides down (y -24 → 0, 600ms ease-out), then `.ac-site-nav-link` + `.ac-site-nav-cluster > *` stagger fade-in (50ms apart). Reduced-motion: no-op.
- **`apps/website/src/components/site/Marquee.jsx`** — replaced CSS keyframe + `.marquee-scroll` atom with `gsap.to(row, { xPercent: -50, duration: 90, ease: 'none', repeat: -1 })`. Added scroll-direction reversal: scroll down → moves left, scroll up → moves right (via `tween.reversed()` flip on scroll delta). Bg `bg-black` → `bg-surface-tertiary`, text `text-white` → `text-on-primary`.
- **`apps/website/src/components/site/Collection.jsx`** — first attempt tried pinned horizontal scrub (full layout change), user vetoed. Final implementation: cards START displaced (alternating ±120 x, ±60 y, scale 0.85, opacity 0) and scrub INTO the original 2×4 grid as scroll progresses. Grid layout itself unchanged.
- **`apps/website/src/components/site/LookbookCarousel.jsx`** — full rewrite. Removed Embla carousel + `useEmblaCarousel` + arrow nav. Replaced with 4-col × 2-row bento grid: one 2×2 hero tile (`ACImages.hero`) + four 1×1 tiles (`editorial.left`, `portrait`, `editorial.right`, `handmade`). Each tile has its own ScrollTrigger animating x/y offset, opacity, scale with staggered scrub speeds (`1 + i * 0.15`).
- **`apps/website/src/components/site/DesignerVision.jsx`** — added 5-image portrait deck (acyr-02 → -04 → -06 → -08 → -01). On scroll-into-view, deck cycles at 240ms intervals via setTimeout chain triggered by `ScrollTrigger.create({ once: true, onEnter })`. Lands on canonical acyr-01. Text column staggers fade-up via `gsap.from(... [data-reveal])` with ScrollTrigger.
- **`apps/website/src/components/site/Testimonial.jsx`** — added refs + useReveal (1.4s stagger between kicker and cite so quote-reveal completes between) + useSplitReveal on the quote (scroll-triggered, looser 15ms stagger for word-feel).
- **`apps/website/src/components/site/SupportCTA.jsx`** — `data-theme="dark"` → `"light"`. `bg-surface-inverse` → `bg-surface-primary`. Added `shadow-[0_-12px_40px_-24px_rgba(0,0,0,0.25),0_24px_60px_-30px_rgba(0,0,0,0.18)]` for elevation. Buttons `secondary + outline` → `primary + ghost`. Content gets `data-reveal` + useReveal stagger.
- **`apps/website/src/components/site/HandmadeCard.jsx`** — replaced single bg-image with 4-image deck (`ACImages.handmade` + 3 from `/brand/photoshoot/`). Crossfade 800ms between images, 4s hold each. `setInterval` cycles `idx` state. Progress timer bar (`@keyframes ac-timer-fill`) at top refills with each interval. Button variant `secondary` → `ghost`.
- **`apps/website/src/components/site/FAQ.jsx`** — added useReveal on items container; each `<details>` row gets `data-reveal` for stagger entry. Native accordion expand untouched.
- **`apps/website/src/components/site/Newsletter.jsx`** — added useReveal on section; eyebrow + headline get `data-reveal` for stagger entry. Form unchanged.
- **`apps/website/package.json`** — `gsap@^3.x` added as dependency.

### Recon / discovery

- **Playwright recon scripts** at `tools/playwright/` — installed chromium binary (cached at `~/Library/Caches/ms-playwright/`). Three scripts: `inspect-animations.mjs` (5s frame capture of page load), `inspect-cards.mjs` (scroll + hover capture), `find-iframes.mjs` (extracts codepen iframe srcs from GSAP demo wrappers).
- **Codepen.io blocks bots** via Cloudflare — got verification challenge when navigating to demo iframe URLs directly. Mitigation: pattern-recognized the four GSAP demos by name from the docs catalog (`horizontalLoop()`, ScrollTrigger pin+scrub, scrubbed bento, infinite looped panels). Pattern knowledge was sufficient to implement without scraping demo source.

## Current State

### Working

- All 11 Home sections have entry animation. User can scroll top-to-bottom and every section "wakes up."
- `<PageHero>` char-reveal lights every page hero (16 consumers via the shared component) — not just Home.
- `Nav` chrome entry runs on every route mount (could later be gated to first-visit only via sessionStorage).
- Marquee scroll-direction reversal works.
- `prefers-reduced-motion` respected at hook level (`useReveal`, `useSplitReveal`) and in Marquee, DesignerVision flip, HandmadeCard rotation.
- `gsap.context()` used in pinned/ScrollTrigger sections for clean teardown on unmount.

### Known issues / heads-up items

- **Phase 4 tuning entirely open.** Easing / stagger / duration consistency across sections has NOT been audited. Each section was tuned individually; the whole-page sweep is the next move.
- **Mobile sweep not done.** LookbookCarousel bento (4×2 grid) doesn't make sense narrow — needs a fallback layout below 768px. Scrub-heavy patterns may also be too aggressive on touch devices.
- **CLS, FPS, ScrollTrigger-leak metrics not yet measured.** Acceptance criteria left as ⬜ in the plan doc.
- **HandmadeCard images** — three are placeholder picks from `/brand/photoshoot/` (33a4480.jpg, 33a4660.jpg, 33a4806.jpg). User should swap if any reads wrong at full-bleed.
- **DesignerVision portrait flip auto-triggers on scroll-into-view** — first scroll-up past the section retriggers (`flipStartedRef` guards in-component but doesn't reset between mount/unmount cleanly across route changes).
- **`IntroLoader` was shipped earlier in the day and is still in SiteLayout (`variant="percentage"`)** — user said "really bad, you need to work on it" then asked me to move on. Currently sessionStorage-gated, runs ~1.4s count + 0.7s exit. Could be replaced once a real loader design is settled.
- **`docs/plans/01-home-page-animation.md`** — updated to reflect what shipped + decisions-made. Status: `active`. Phase 4 tuning open.

### Out of scope (intentionally)

- Page transitions on route change.
- Magnetic cursor / custom-cursor effects.
- WebGL / 3D hero.
- ASCII portrait reveal (good-fella's hero trick).
- Per-section animations on routes other than Home. PageHero generalizes via the shared component; everything else is Home-specific for now.

## Next Steps

1. **Phase 4 tuning** — top-to-bottom sweep with the user walking the dev server. Adjust per-section timing/easing/duration based on visual feedback.
2. **Mobile sweep** — LookbookCarousel bento needs a single-column fallback below md breakpoint. ScrollTrigger-heavy sections (Collection, DesignerVision text reveal) may need reduced ranges on touch.
3. **Measure CLS + FPS + ScrollTrigger leak count.** Mark the ⬜ items in the plan as ✅ or fix.
4. **Decide on IntroLoader** — either delete (user said "really bad") or redesign. It's currently in SiteLayout as `variant="percentage"`.
5. **Animate other routes' Hero** is already happening via PageHero; could extend useReveal to other surfaces (catalog grids, journal article hero image, collection detail looks).
