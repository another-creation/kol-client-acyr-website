# Session: SignupOverlay scroll-arm + FOUC body-cloak + focus-ring suppress + Marquee CSS purge

**Date:** 2026-05-20
**Agent:** Grim (Claude Opus 4.7, 1M context)
**Summary:** Four threads on the home/site flow. SignupOverlay re-triggered via a scroll-to-bottom-and-back behaviour; FOUC eliminated with a pre-paint theme script + anti-flash body cloak + font preload; focus rings dropped to a barely-there 1px hairline; Marquee rewritten Tailwind/DS-first with its 90-line `.site-marquee*` CSS block deleted.

## Changes Made

### Files Modified

- `apps/website/src/components/site/SignupOverlay.jsx` — full rewrite of trigger logic. Old: auto-open on first session via `sessionStorage` + permanent `localStorage` dismiss. New: state machine `'collapsed' | 'open' | 'hidden'`. Sidelabel always visible on mount; × on label sets `'hidden'` in React state only (reload restores). × on overlay collapses to sidelabel. Auto-open triggered by scroll listener on `/` or `/shop` only — arms when within 50px of `document.documentElement.scrollHeight`, fires when `scrollY` drops back under 100px. Gated by single `kol.ac.signup.lastShown` localStorage key (epoch ms); bumped on every overlay open (auto or manual), 24h cooldown. Old `kol.ac.signup.dismissed` + `kol.ac.signup.seen` keys retired. Imports `useLocation` from `react-router-dom` for route gating.

- `apps/website/index.html` — three insertions inside `<head>`. (1) Inline `<script>` reads `localStorage.getItem('ac-theme')` and writes `document.documentElement.dataset.theme` before any external CSS evaluates — fixes the persistence bug where `ThemeToggle.getInitialTheme()` was reading from the HTML attribute. (2) Inline `<style>` paints `html { background: #FAFAFA; color: #121215 }` and dark equivalent for `[data-theme="dark"]`, hardcoded to match `tokens/color.css`. Body starts at `opacity: 0` with a 180ms transition; reveals when `is-ready` class is added. (3) Two `<link rel="preload" as="font" type="font/woff2" crossorigin>` lines for `PPRightGrotesk-Light.woff2` and `PPRightGrotesk-Medium.woff2`.

- `apps/website/src/main.jsx` — appended a body-reveal block after `createRoot(...).render(...)`. `Promise.race([document.fonts.ready, setTimeout(..., 400)])` ensures the cloak lifts within 400ms even if a font fetch hangs. `requestAnimationFrame` callback adds `body.classList.add('is-ready')`.

- `apps/website/src/components/framework/ThemeToggle.jsx` — `getInitialTheme()` now reads `localStorage.getItem(STORAGE_KEY)` first and only falls back to `document.documentElement.dataset.theme` if storage is missing/blocked. Toggle persistence across reloads actually works now.

- `apps/website/src/styles/site.css` — three blocks.
  - Added under the `:root { scrollbar-gutter: stable }` line: global `:focus:not(:focus-visible) { outline: none }` + `:focus-visible { outline: 1px solid var(--ac-fg-16); outline-offset: 0 }`. Suppresses Chrome's UA blue outline on mouse-click; keyboard nav still gets a barely-visible 1px hairline ring.
  - `.site-marquee` removed from the FULLBLEED `width: 100vw` selector list at line 19. Marquee handles full-bleed inline via `w-screen ml-[calc(50%-50vw)]`.
  - Entire `.site-marquee*` block (~90 lines, 10 selectors) deleted. Replaced with the keyframes definition `@keyframes site-marquee-scroll` + a tiny 4-line `.marquee-scroll` atom carrying `animation: site-marquee-scroll 120s linear infinite; will-change: transform; backface-visibility: hidden`. Those three properties can't be Tailwind utilities; everything else is now inline in the JSX.

- `apps/website/src/components/site/Marquee.jsx` — full rewrite. Zero `.site-marquee*` classes. Section: `relative w-screen ml-[calc(50%-50vw)] h-48 bg-black text-white flex flex-col justify-center overflow-hidden`. Kicker/note wrapper unchanged (already inline). Kicker: `ac-helper-12 uppercase text-white/50`. Head-note: `text-[13px] text-white/60`. Track wrap: `relative w-full overflow-hidden`. Track: `marquee-scroll flex w-max`. Item: `inline-flex items-center gap-3 pr-16 md:pr-32` — the per-item padding-right is what keeps the `translate3d(-50%)` seamless-loop math intact (2× one-copy width). Label fallback simplified to `inline-flex items-baseline gap-1.5 whitespace-nowrap text-[22px] font-medium tracking-[-0.005em]`.

### Features Added/Removed

- **SignupOverlay scroll-arm trigger.** Replaces the on-first-visit auto-open. Filters out bouncers entirely and only fires for users who've actually browsed a full page worth of content and are circling back. Sidelabel acts as a permanent reentry point for everyone else.
- **24h cooldown on overlay re-fire.** Single timestamp key, no double-bookkeeping.
- **Body cloak (opacity 0 → 1 fade) on cold load.** Eliminates the unstyled-then-styled flash, the font-fallback-then-swap flash, and the white-page-before-CSS flash in one move. Solid dark surface paints from frame 0 via the inline `<style>` in `<head>`.
- **Font preload for the two heaviest Right Grotesk weights.** Cuts FOUT window so fonts are ready by the time the cloak lifts.
- **Pre-paint theme persistence.** Toggle to light, reload — page actually comes back light now. Was silently broken.
- **Mouse-focus rings fully suppressed.** Keyboard-focus rings reduced to a 1px `var(--ac-fg-16)` hairline (effectively invisible).
- **Marquee CSS purged.** Trajectory matches the prior FAQ / Testimonial / FeatureSplit / Collection purges.

## Current State

### Working

- SignupOverlay on `/` and `/shop`: scroll to footer then back to hero → overlay pops. Once per 24h. Sidelabel remains as manual re-entry. × on label hides label until reload; × on overlay collapses to sidelabel.
- Cold-load FOUC: solid dark surface for first frames, no white flash, no unstyled-text flash, no visible font swap. Body fades in over 180ms once fonts are ready (capped at 400ms). Theme persistence across reloads actually works.
- Focus ring: invisible on click for every interactive element on the page; 1px hairline `--ac-fg-16` on keyboard tab.
- Marquee renders identically to the prior visual — same 192px black band, same scroll speed (120s), same seamless loop, same client SVG sizing. Zero `.site-marquee*` classes in the JSX.

### Known Issues

- **`.ac-btn` cascade ordering still bites.** Flagged in yesterday's handoff, no movement this session. Anywhere a consumer needs to override `border-radius` / `padding` defaults on the Button atom still requires Tailwind v4 `!` suffix (`rounded-full!`). Real fix is wrapping `.ac-btn` in `@layer components` so utilities sit above components in cascade order.
- **`text-emphasis` doesn't flip inside `.bg-surface-inverse`** — workaround `.text-on-inverse` still in use. Same as prior sessions.
- **`SignupOverlay` route-gating uses pathname-equality, not prefix.** `/shop/:slug` PDPs are excluded by design (`ARM_ROUTES.includes(pathname)`). If shop PDPs should also arm the trigger later, switch to `startsWith` or extend the list.

## Next Steps

1. **Verify SignupOverlay in dev on home and shop.** Scroll to footer, scroll back, overlay should pop. `localStorage.removeItem('kol.ac.signup.lastShown')` in devtools to reset between tests.
2. **Cold-load FOUC sanity check across browsers.** Cmd+Shift+R in Chrome/Safari/Firefox; confirm solid dark fade-in, no white flash, no font swap mid-view.
3. **DS hygiene pass: `.ac-btn` cascade ordering** (still on the standing list).
4. **Newsletter design rework (backlog 3d)** — still the next polish target on the home flow.
