# Session: GSAP skills install + scrubbed-bento rebuild + scroll-effect tuning

**Date:** 2026-05-23
**Agent:** Grim (Claude Opus 4.7, 1M context)
**Summary:** Installed the official GSAP AI skills, fixed the StrictMode reveal bugs from the prior arc by moving to `useGSAP`, tamed/simplified several "crazy" Home animations per user review, rebuilt LookbookCarousel as the real GSAP scrubbed-bento gallery (Flip + ExpoScaleEase, sourced via Playwright recon of the actual pen), reordered it before Collection, swapped in a new curated `set` image set, and reworked DesignerVision into a scroll-driven portrait deck that pins + opens to full width with SupportCTA stacking over it.

## Changes Made

### Tooling / infra
- **`tools/playwright/traces*` + `frames*` purged from git history** — push was rejected (trace.zip files 57–128 MB over GitHub's limits). `git filter-branch --index-filter` stripped them from the unpushed tip commit; `.gitignore` gained `tools/playwright/{frames,frames-cards,traces,traces-cards,logs}/`. User did the push.
- **GSAP AI skills installed** — cloned `github.com/greensock/gsap-skills`, copied all 8 (`gsap-core/timeline/scrolltrigger/plugins/utils/react/performance/frameworks`) into `.claude/skills/`. Invokable via Skill tool after the session restart. (`/plugin marketplace add` is a Claude Code built-in I can't invoke — manual copy is the equivalent.)
- **`@gsap/react` installed** (`pnpm add --filter website`). `apps/website/src/lib/gsap.js` now registers + exports `useGSAP`, `Flip`, `ExpoScaleEase` alongside `gsap`/`ScrollTrigger`.
- **Playwright recon scripts** added: `tools/playwright/inspect-bento.mjs`, `inspect-pen.mjs`, `inspect-cdpn.mjs` (parametric). Confirmed demos.gsap.com demos are CodePen embeds; the **`cdpn.io/pen/debug/<id>` view loads fine in Playwright** (codepen.io itself is Cloudflare-walled, but the debug host isn't) — this is how the bento + ScrollSmoother pen sources were obtained. Recon output for the bento pen lives at `tools/playwright/pen/`, smooth-scroll pen at `tools/playwright/smooth/`.

### Files modified — animation rework
- **`apps/website/src/main.jsx`** — `ScrollTrigger.refresh()` after `document.fonts.ready` reveal, so triggers reset to post-cloak layout.
- **`apps/website/src/hooks/useSplitReveal.js`** — fixed StrictMode bug (the `data-split-done` guard early-exited on the 2nd mount and never re-created the observer → text stuck at opacity 0). Now reuses existing spans + always re-arms the observer. Also swapped the alternating ±x scatter for a uniform `y` rise (the scatter read as "weird"); prop renamed `x`→`y`.
- **`apps/website/src/components/site/PageHero.jsx`** — `useSplitReveal(... { y: 14 })` (was x:8 scatter).
- **`apps/website/src/components/site/Nav.jsx`** — entry animation → `useGSAP`; **opacity-only** on the bar (the old `y:-24` wrote a transform that clobbered the scroll-hide's `translateY(-100%)`); dropped the per-link stagger entirely (it was getting stuck at opacity 0 — second nav bug).
- **`apps/website/src/components/site/Marquee.jsx`** — `useGSAP`; **removed the scroll-direction reversal** (the "directionally confused" gimmick). Clean continuous leftward loop only.
- **`apps/website/src/components/site/Testimonial.jsx`** — dropped `useSplitReveal` on the quote (per-char reveal "too much"); quote now fades in as one block via `useReveal` (kicker→quote→cite, 0.15s stagger).
- **`apps/website/src/components/site/Collection.jsx`** — scrub replaced with a **timed** reveal (fixed 0.9s + stagger on enter) — scrub tied speed to scroll speed, which read as "too quick". Now uses the new curated `SET` images (`set-01/04/07/09/10/14/16/19`) for the 8 cards; product name/price/link unchanged.
- **`apps/website/src/components/site/SupportCTA.jsx`** — `min-h-[70vh]` + `justify-center` (was ~524px); added `relative z-10` so it overlaps DesignerVision.
- **`apps/website/src/components/site/HandmadeCard.jsx`** — `useGSAP`; background image deck wrapped in an oversized (`-top-[15%] h-[130%]`) parallax layer that drifts `yPercent -8→8` slower than scroll (the chosen "background image drift" parallax).
- **`apps/website/src/components/site/DesignerVision.jsx`** — full rework (see below).
- **`apps/website/src/components/site/Collection.jsx` + `LookbookCarousel.jsx`** — `useEffect+gsap.context()` → `useGSAP`.
- **`apps/website/src/pages/site/Home.jsx`** — title authored `"TIMELESS QUALITY DESIGN"` (was `<span className="uppercase">` which the char-split stripped); **LookbookCarousel moved before Collection** (intro to it); desktop-only `h-screen` spacer added between DesignerVision and SupportCTA.
- **`apps/website/src/styles/site.css`** — added `.lookbook-*` grid CSS (two layouts: bento + `--final` blown-up).

### LookbookCarousel — the main rebuild
Predecessor's "scrubbed bento" was a static 4×2 grid (wrong). Rebuilt as the **real GSAP `scrubbed-bento-gallery`** (`apps/website/src/components/site/LookbookCarousel.jsx`): two CSS grid layouts (`.lookbook-grid` bento `repeat(3,32.5vw)×repeat(4,23vh)` + `.lookbook-grid--final` blown to `repeat(3,100vw)×repeat(4,49.5vh)`), 8 `.lookbook-item`s placed by `grid-area`, and **Flip morphs between them** with `ease: "expoScale(1, 5)"`, `scrub`, pinning the parent. Phase 1 = bento scrolls to centre (`start: "center center"`); phase 2 = pinned, grid zooms so the centre item (nth-child 3) fills the viewport. Faithful port of the pen (`cdpn.io` debug source). Uses `set` images.

### DesignerVision — scroll-driven deck + pin-open + stack
- Portrait deck (`acyr-02→04→06→08→01`) is now **scroll-position-driven** (was a setTimeout flip): a ScrollTrigger `onUpdate` maps progress→index; crossfade 80ms→250ms.
- **Layout restructured**: image column is absolute left-half (desktop), text absolute right-half behind it; stacks on mobile.
- **Pin + open (desktop, matchMedia ≥768px)**: section pins (`start: 'bottom bottom'`, `pin: true`, **`pinSpacing: false`**, `end: '+=260%'`) so it stays in place; a separate scrubbed trigger (`end: '+=80%'`) opens the image column `width 50%→100%` over the first stretch while the deck keeps cycling. The desktop `h-screen` spacer in Home delays SupportCTA's overlap by ~100vh; SupportCTA (`z-10`, opaque) then scrolls up over the pinned DV.

## Current State

### Working (pending live verification)
- GSAP skills + `useGSAP`/`Flip`/`ExpoScaleEase` resolve and register (verified `gsap/EasePack` exports `ExpoScaleEase`).
- StrictMode reveal bugs fixed (Testimonial quote, nav links, DesignerVision text no longer stick at opacity 0).
- LookbookCarousel scrubbed-bento, Collection timed reveal + new images, Marquee clean loop, HandmadeCard parallax.

### Known issues / heads-up
- **DesignerVision pin uses `pinSpacing: false`** — known to cause a one-frame jump when the pin engages (content below loses DV's height from flow). NOT yet verified live. If it jumps, fall back to a negative-margin overlap technique.
- The DV numbers (`+=260%` pin, `h-screen` spacer, `+=80%` open) are estimates — need a live tuning pass.
- Parallax only lands on HandmadeCard; SupportCTA/Newsletter are solid (no bg image). User accepted this.
- `tools/playwright/` recon output dirs (`pen/`, `smooth/`, `bento/`) are gitignored.

## Next Steps
1. **Live-walk DesignerVision** — confirm no pinSpacing:false jump; tune pin/spacer/open numbers; decide if image should fully open before SupportCTA overlaps.
2. **ScrollSmoother + parallax** — user wants it (linked the ScrollSmoother pen, `cdpn.io` debug source saved at `tools/playwright/smooth/`). Pending green-light because it's architectural: wrap SiteLayout in `#smooth-wrapper > #smooth-content` with all fixed overlays (Nav/CartDrawer/SignupOverlay/WebsiteSearch) kept OUTSIDE, and rewire Nav scroll-hide + SignupOverlay scroll-arm (both read `window.scrollY`, which ScrollSmoother breaks).
3. Map the 20 `set` images to specific products (currently paired by index in Collection; LookbookCarousel uses a hand-picked subset).
4. Phase 4 tuning from the prior arc still open (easing/stagger consistency, mobile sweep, CLS/FPS, IntroLoader fate).
