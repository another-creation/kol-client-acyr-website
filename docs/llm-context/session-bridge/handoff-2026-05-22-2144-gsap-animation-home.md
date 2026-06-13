# Handoff — 2026-05-22 21:44

## Goal of the current arc

Bring the Home page to life with GSAP animations. Install the framework, build reusable hooks, apply signature motion to every section. Reference sites: 375.studio (percentage loader + character reveals) and good-fella.com (orange wedge intro + scroll-pinned step sequence + ASCII portrait). User cited four specific GSAP demos for section behaviors: directional-marquee, horizontal-scrolling-gallery, scrubbed-bento-gallery, infinite-looped-panels. Phase 1-3 shipped; phase 4 (tuning, mobile, metrics) is the open thread.

## Last actions taken (causal trail, newest first)

- Updated `docs/plans/01-home-page-animation.md` to reflect what shipped + decisions made during execution. Per-section table now shows actual implementations, not draft sketches. New "Decisions made during execution" section captures Collection layout-revert, Lookbook Embla→bento intent, DesignerVision flip mechanic, HandmadeCard timing, SupportCTA elevation, reduced-motion guard placement.
- **Newsletter** content gets `data-reveal` + useReveal stagger (eyebrow + headline).
- **FAQ** rows stagger-reveal on scroll into view. Each `<details>` gets `data-reveal`.
- **HandmadeCard** rewritten: 4-image rotating deck (4s holds, 800ms crossfade) + progress timer bar at top. Button variant `secondary` → `ghost`. Placeholder photoshoot images.
- **SupportCTA** flipped `data-theme="dark"` → `"light"`, `bg-surface-inverse` → `bg-surface-primary`, added two-stop shadow elevation. Buttons updated to primary + ghost. Content staggers in.
- **Testimonial** got per-character quote reveal via useSplitReveal (scroll-triggered, 15ms stagger). Kicker + cite fade-up via useReveal with 1.4s stagger (so quote completes between them).
- **DesignerVision** got 5-image portrait deck that flips through alternates on scroll-into-view then lands on canonical acyr-01. Used `ScrollTrigger.create({ once: true, onEnter })` to trigger a setTimeout chain. Text column gets stagger fade-up.
- **LookbookCarousel** full rewrite: Embla removed, replaced with 4-col × 2-row bento (one 2×2 hero + four 1×1). Each tile has its own ScrollTrigger with staggered scrub speeds.
- **Collection** — first attempt shipped a pinned full-section horizontal scrub. User vetoed ("you can't just change the layout"). Reverted to the original 2×4 grid, added scrub-INTO-grid animation: cards start displaced (alternating ±x/±y, scale 0.85, opacity 0) and resolve to grid positions as scroll progresses.
- **Marquee** rewritten: CSS keyframe + `.marquee-scroll` atom replaced with GSAP tween. Scroll-direction reversal added (scroll down → moves left, scroll up → moves right via `tween.reversed()` flip on scroll delta). Bg `bg-black` → `bg-surface-tertiary`.
- **Nav** got chrome entry: timeline drops the nav bar from y -24 + stagger fades in the inner links/clusters.
- **PageHero** got the hero text sequence: eyebrow fades up (0s), title char-reveals (0.25s, 30ms per char, ±8px x-scatter), subline fades up (1.1s). Lights every page hero (16 consumers).
- Phase 1 infra: `lib/gsap.js` (registered ScrollTrigger, exposes `prefersReducedMotion()`), `hooks/useReveal.js` (IO-backed fade-up + stagger), `hooks/useSplitReveal.js` (per-char manual split, no paid SplitText).
- `pnpm add gsap --filter website` — gsap installed in the website app, not global.
- Playwright recon scripts in `tools/playwright/` (outside workspace so it doesn't pollute the lockfile). Captured 375.studio + good-fella.com + four GSAP demos. CodePen blocks bots via Cloudflare; for the demos I pattern-recognized from the GSAP docs catalog instead of scraping.
- User initial reaction to the first round (just hooks + PageHero + Marquee + Nav): "I'm actually super disappointed, you didn't add 1 wow animation." Then "why are you doing the smallest amount possible then stopping, you know what I want." Course-corrected to ship everything in one push.
- The `IntroLoader` (earlier in the day) is still live in SiteLayout — user said "really bad, you need to work on it" then asked me to move on. Currently `variant="percentage"`, session-once.

## Current state / open decision points

**Animation is wired across the whole Home page.** Walking the page top-to-bottom should now feel like a sequence of moments. Hooks generalize — `PageHero` already lights every page hero across the site.

**Open decision points:**

1. **IntroLoader's fate.** User called it "really bad." Currently still in SiteLayout. Options: delete entirely (page just loads naturally), redesign to match the editorial register (375-style percentage in burgundy?), or hand off to the user to design.
2. **LookbookCarousel mobile fallback.** The 4×2 bento doesn't work narrow. Needs either a 2×4 stacked version or a single-column fade-up cascade below 768px.
3. **DesignerVision portrait flip** — currently 240ms per image × 4 alternates + canonical = ~1s total. User may want it slower (240ms feels fast) or faster (more decisive landing). Tune after walking.
4. **HandmadeCard image deck** — placeholder images. User should swap if any reads wrong.
5. **Phase 4 metrics** — CLS, FPS on throttled CPU, ScrollTrigger leak count. Marked ⬜ in the plan doc.

## Next intended action

1. **User walks `pnpm dev` from top to bottom of Home.** Note what feels too fast / too slow / too subtle / too aggressive per section.
2. **Tune per-section** based on that feedback. Easing/stagger/duration adjustments are typically one-liner changes per component.
3. **Mobile sweep** — start with LookbookCarousel which is the most obviously broken at narrow widths.
4. **Decide on IntroLoader.**
5. **Measure** the ⬜ acceptance criteria once tuning settles.

## Working memory not yet in AGENT-CONTEXT

- **The "either start or end in my layout" rule was load-bearing on Collection.** When the user said this, they meant: the existing visual layout IS the resting state of the animation. Animations can play during scroll-in or scroll-out, but should resolve to/from the existing layout. I missed it on the first Collection attempt and built a layout-replacing pinned horizontal scrub. The corrected pattern (scrub-INTO-grid) is the template for any future "scroll-animate but preserve the layout" task.
- **The user's frustration pattern.** Stopping after each small change reads as half-effort to this user. When the brief is clear ("apply animations to every section"), execute everything before stopping. Save the stop-and-confirm for genuine architectural forks (Collection layout was one — but I should have shipped first attempt knowing I might be told to redo).
- **`gsap.context()` is the cleanup pattern.** Used in Collection, LookbookCarousel, DesignerVision. Wraps all gsap calls so `ctx.revert()` cleanly tears down on unmount. Without it, ScrollTriggers leak across route changes.
- **The Playwright recon was valuable for the references but a dead-end for the GSAP demos** because CodePen blocks bots. Pattern recognition from the demo names was the actual win. If we need to look at GSAP demos again, just trust the docs catalog naming or have the user export a screen recording.
- **`prefersReducedMotion()` is exported from `lib/gsap.js`** — every animation component that calls gsap directly should import + check it. Currently inconsistent — useReveal/useSplitReveal check internally; Marquee/DesignerVision/HandmadeCard check at the component level; section components that just call `gsap.from()` with ScrollTrigger don't always check. Phase 4 sweep should audit.
- **Marquee scroll-direction reversal can feel "drunk" if the user does small back-and-forth scrolls** — the marquee flips direction each time. May want to debounce or only reverse on sustained scroll. Open for tuning if it bothers the user.
- **`useSplitReveal` mutates DOM** (replaces text with per-char spans). Idempotency guard via `data-split-done` attribute. But: if the parent component re-renders with new text content, the old chars stay. Not a problem for static hero titles, but be aware for dynamic text.
- **The HandmadeCard `<style>` injection** for `@keyframes ac-timer-fill` is component-local. Could move to `site.css` if more timer-bar consumers appear.
- **Backlog 7 "animations" placeholder is what this work resolves** — could be marked ✅ pointing to `docs/plans/01-home-page-animation.md`. User added the placeholder mid-session earlier today.
