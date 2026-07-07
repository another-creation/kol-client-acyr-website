---
title: Home page animation
type: plan
status: active
updated: 2026-05-22
description: GSAP + ScrollTrigger animation across the Home route. Per-section desired outcomes, implementation sketches, ordering. Phase 1-3 shipped 2026-05-22; phase 4 (tuning) open.
tags:
  - project/acyr
  - domain/animation
  - provider/gsap
phases:
  - infra
  - hero-and-chrome
  - per-section
  - tuning
related:
  - "[[02-backlog|backlog]]"
---

# Home page animation

The Home route had nine vertical sections, all static beyond the prior CSS-keyframe Marquee and the FAQ accordion expand. Phase 1-3 shipped 2026-05-22 — every section now has a defined entry behavior plus chrome intro. Phase 4 (tuning, consistency, mobile reduce) is open.

## Why

The site read correct but felt static next to the references (375.studio, good-fella.com). Animation isn't decoration — it's the editorial register that distinguishes a craft-atelier site from generic e-commerce. Per-section reveals, scroll-pinned moments, and hover affordances are the standard vocabulary; absence reads as cheap.

## Current state — shipped 2026-05-22

### Phase 1: Infrastructure (shipped)

| File | Role |
|---|---|
| `apps/website/src/lib/gsap.js` | Single import surface. Registers ScrollTrigger. Exports `gsap`, `ScrollTrigger`, `prefersReducedMotion()`. |
| `apps/website/src/hooks/useReveal.js` | IntersectionObserver-backed fade-up + stagger. Targets `[data-reveal]` descendants. Reduced-motion safe. |
| `apps/website/src/hooks/useSplitReveal.js` | Per-character text reveal (manual split, no paid SplitText). Reduced-motion skips entirely. |

`gsap` package installed in `apps/website` (workspace filter, not global).

### Phase 2: Chrome + hero (shipped)

1. **`Nav` chrome entry** — on first mount, nav bar slides down (y -24 → 0, 600ms ease-out), then inner links + clusters stagger fade-in (50ms apart). Reduced-motion: snaps to final state.
2. **`PageHero` (every page hero, 16 consumers)** — eyebrow fades up first (0s), title character-reveals via `useSplitReveal` (delay 0.25s, 30ms per char, ±8px x-scatter), subline fades up last (delay 1.1s).

### Phase 3: Per-section on Home (shipped)

| # | Section | What shipped | Notes |
|---|---|---|---|
| 1 | `PageHero` | Char-reveal title sequence (Phase 2). | Lights every page hero, not just Home. |
| 2 | `Marquee` | GSAP tween (not CSS keyframe); scrolls left by default, **reverses to right when scroll direction flips**. Bg `bg-black` → `bg-surface-tertiary`. | Speed knob: `duration: 90` in `Marquee.jsx`. |
| 3 | `Collection` | Cards scrub IN to the original 2×4 grid layout. Each card starts off-position (alternating ±120/-60 x/y, scale 0.85, opacity 0) and resolves to grid as scroll progresses. **Grid layout itself unchanged.** | First implementation tried full pin + horizontal scrub — user vetoed ("you can't just change the layout"). Reverted to scrub-into-grid. |
| 4 | `LookbookCarousel` | **Replaced Embla carousel with scrubbed bento gallery.** 5 image tiles in a 4-col × 2-row bento (one 2×2 hero + four 1×1). Each tile scrubs in with its own offset + staggered scrub speed (1 + i × 0.15). | Layout change is intentional per the GSAP demo reference. |
| 5 | `Testimonial` | Kicker fades up → quote per-character reveal (looser stagger 15ms for word-feel) → cite fades up. Cascaded via `useReveal` stagger 1.4s between kicker and cite. | Wasn't in the original plan inventory — added because Testimonial sits between Lookbook and DesignerVision. |
| 6 | `DesignerVision` | **Portrait deck flips** through 5 alternates (acyr-02 → -04 → -06 → -08 → -01) at 240ms intervals on scroll-into-view, lands on canonical acyr-01. Text column staggers fade-up alongside. | User asked for "flip through other portrait images before landing on this one." `flipStartedRef` guards against re-trigger. |
| 7 | `SupportCTA` | **Theme flipped `data-theme="dark"` → `"light"`** so it forces light surface regardless of page theme. Added elevation (`shadow-[0_-12px_40px...]`). Content staggers fade-up. CTAs updated: primary (dark) + ghost. | Mirrors the Newsletter card pattern (forced light surface). |
| 8 | `HandmadeCard` | **Full-screen rotating image deck**: 4 images (handmade hero + 3 from `/brand/photoshoot/`), 4s each, crossfade 800ms. Progress timer bar across the top refills with each interval (CSS `animation: ac-timer-fill`). | User suggested "full screen image timer." Reduced-motion: deck stays on first image, no timer animation. |
| 9 | `Newsletter` | Content (eyebrow + headline + form) staggers fade-up on scroll-into-view. | Already had the right copy + layout from earlier; just adds entry motion. |
| 10 | `FAQ` | Each `<details>` row stagger-reveals (80ms apart) on scroll-into-view. Native accordion expand untouched. | Accessibility win — `<details>` stays as semantic interactive. |

## Phase 4 — Tuning (open)

Sweep the page top-to-bottom and adjust:

- **Easing consistency.** Settle on 2-3 site-wide eases (`power2.out` for fades, `power3.out` for titles, `expo.out` for dramatic moments). Audit + collapse.
- **Stagger consistency.** Reuse the same cascade direction (top-down or left-right). Some sections may currently go opposite ways.
- **Duration consistency.** Reveals 600-800ms. Char reveals 900-1200ms. Hovers 250-400ms. Anything outside needs a reason.
- **Layout-shift audit.** Every entry animation must reserve final-state layout BEFORE animating in. Confirm CLS = 0 in Lighthouse.
- **Scroll-frame audit.** Test on 6× throttled CPU (DevTools Performance). Anything below 50fps gets simplified or removed.
- **Mobile sweep.** Disable scrub-heavy patterns on `<768px`. Reduce stagger durations to 50% of desktop. Specifically: LookbookCarousel bento may need a simpler reveal on mobile (the 4×2 bento doesn't make sense narrow).
- **Reduced-motion verification.** Toggle `prefers-reduced-motion` in DevTools rendering tab. Every motion path should snap to final state.
- **HandmadeCard image deck** — verify all 4 images exist + look right at full-bleed. Currently using `33a4480.jpg`, `33a4660.jpg`, `33a4806.jpg` from `/brand/photoshoot/` — replace if any reads wrong.

## Acceptance criteria

- ✅ Every Home section has a defined entry behavior.
- ✅ PageHero character reveal works on Home + lights every page hero (16 consumers via the shared component).
- ⬜ No layout shift (Lighthouse CLS = 0) — not yet measured.
- ⬜ 60fps maintained on 6× throttled CPU — not yet measured.
- ✅ `prefers-reduced-motion` respected at hook level (`useReveal`, `useSplitReveal`, Marquee, DesignerVision flip, HandmadeCard rotation). Section-level `gsap.from()` with ScrollTrigger may still animate under reduce — phase 4 sweep needed.
- ⬜ No GSAP / ScrollTrigger leaks across route changes (verifiable via `ScrollTrigger.getAll().length`) — not yet measured.

## Out of scope (this plan)

- Page transitions on route change (SPA shell-transition orchestration).
- Cursor effects (magnetic / custom-cursor — gimmicky for AC's register).
- 3D / WebGL hero (out of register for the brand).
- ASCII portrait reveal (good-fella's hero trick — editorial flourish, deferred).
- Per-section animations on routes other than Home. The hooks generalize; per-route application is a follow-up.

## Decisions made during execution

- **Collection — scrub-into-grid, not pin+horizontal-scrub.** First attempt removed the 2×4 grid in favor of a horizontal-scrolling track. User pushed back: "it has to either start or end in my layout, you can't just change the layout." Reverted; animation now respects the grid as the resting state and only adds entry motion.
- **LookbookCarousel — layout change is intentional.** Replaced Embla manual-nav carousel with a 4×2 bento. User explicitly referenced the scrubbed-bento-gallery GSAP demo, which implies the layout change.
- **DesignerVision portrait flip** is auto-triggered on scroll-into-view (not user-driven). 240ms per image, 4 alternates + canonical = ~1 second total. Lands and stays.
- **HandmadeCard rotating deck** runs continuously (4s/image, looping). Doesn't pause on hover or scroll-out. Could be changed to pause-on-leave-viewport if performance becomes a concern.
- **SupportCTA theme flip + elevation** — user specced "fix data-theme light (look at newsletter) + slight elevation." Shipped both; the shadow uses a two-stop layered gradient (top inner-shadow + bottom drop-shadow) for the "card lifting out of the page" feel.
- **Reduced-motion guard placement.** Every hook checks `prefersReducedMotion()` and short-circuits. Components calling `gsap.from()` directly (DesignerVision, HandmadeCard) also check. Phase 4 will audit anything calling gsap directly without the guard.
