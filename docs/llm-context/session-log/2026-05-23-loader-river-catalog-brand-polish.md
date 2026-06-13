# Session: IntroLoader + Collections river + catalog unify + Brand styleguide-match + hero/type polish

**Date:** 2026-05-23
**Agent:** Grim (Claude Opus 4.7, 1M context)
**Summary:** Long live-tuning session (second arc of the day). Built the IntroLoader 375.studio-style + a `/loader` dev workbench; reworked the Collections hero into an autoplay "river of words" overlay (after several wrong scroll-coupled attempts); reverted DesignerVision to static + linked Our Story → /about; unified Shop+Handmade onto a shared CatalogHero with matching grids + the new `set` imagery; rebuilt the Brand page to match the styleguide swatch + AssetTable; SupportCTA → exact spec layout (image left / 397px text right) + marble texture; Newsletter marble overlay; uppercased hero titles; bumped hero type (home 144 / others 128). Heavy Playwright recon throughout.

## Changes Made

### IntroLoader + /loader
- **`/loader` route + page** — `apps/website/src/pages/site/LoaderDev.jsx`, wired in `App.jsx` OUTSIDE SiteLayout (no nav/footer/duplicate loader). Replay button + Percentage/Wedge toggle. `IntroLoader` gained a `forcePlay` prop that bypasses the once-per-session `sessionStorage` gate (and doesn't write it) so it can be replayed.
- **IntroLoader (`components/site/IntroLoader.jsx`)** — PercentageLoader reworked to match 375.studio: fixed-size "Loading"/"%" in the corners (NO scaling — removed the 0.4→1 scale). Bottom-left word **loops** through `LOADER_WORDS = ['Loading','Another','Creation','Reykjavik','X YR X','and','Welcome']` via a 160ms `setInterval` (hard cut, no fade). **Exit is a color-slide**, not a fade: stacked panels slide up — black loader (z-102) lifts first, then a `bg-brand-magenta-200` panel (z-101) lifts, revealing the page (staggered, `PANEL_STAGGER_MS`/`PANEL_SLIDE_MS`). **Centered logomark** (`KolLogo variant="logomark" className="h-[34vh]"`).

### Collections hero — autoplay "river of words"
- `components/site/HorizontalScrollText.jsx` went through 3 wrong takes (pinned horizontal scroll, then centered scatter) before landing on what the user wanted: an **autoplay marquee** (NOT scroll-coupled). Renders as an `absolute inset-0` overlay (`data-theme="dark"`, `pointer-events-none`) on top of the hero image. Two text copies loop seamlessly left; each char is scattered (random y + rotation) while on the right of the viewport and eases to baseline by 30%-from-left — a river that calms centre, scatters at the entering edge. Driven by `gsap.ticker` reading the row's live x + each char's cached `offsetLeft` (cheap; no per-frame layout reads). `FLOW_SPEED` (currently 400), `clamp(4rem,16vw,12rem)`.
- `Collections.jsx` hero = bg image + gradient + the river overlay. **No PageHero text on the hero** (the river is the text). The collections grid below is unchanged.
- **Lesson (now a rule):** when the user says an effect should "not be connected to scroll," they mean autoplay — don't reach for ScrollTrigger/pin. Took several misreads to land.

### DesignerVision — reverted to static
- All the pin/open/scroll-deck machinery removed. Now a plain 2-col `md:h-[120vh]` section: portrait left (single `acyr-01`), text right. "Our Story" button now navigates to `/about` via `useNavigate` + onClick (Button atom only supports plain `<a href>` = full reload, so used the hook).

### Shop + Handmade unified
- **`components/site/CatalogHero.jsx`** — shared marketing hero (section + image + gradient + PageHero). Shop + Handmade both render it; only image/eyebrow/title/subline differ.
- Both pages: **filters removed** from Shop (ContentFilters gone), grids now identical — `grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4`, cards directly under the hero (no SectionOpener "Pieces"/divider, `px-8`, tight to hero). Handmade bumped 6→8 products and switched to the **home Collection card type** (`overlay={false} fill` + opacity-70/hover-100, 2×4 `h-[110vh]` grid). Shop grid has `pb-32` (gap before Newsletter); Handmade keeps FAQ + EnquiryForm sections.
- **Imagery**: product cards use the curated `set` images, split so they DON'T overlap — Handmade `set-01..08`, Shop `set-09..20` (cycled).
- **Newsletter** added at the end of both (`min-h-[60vh]`).

### Brand page — matched the styleguide
- Swatches: 96px chip (`h-24 rounded-[4px] border-fg-08`) + mono meta using the DS classes the styleguide uses (`ac-helper-10` + `text-meta` name / `text-strong` hex), in `grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-1` (the `.ac-ramp-chips` layout). The styleguide `.ac-swatch*` CSS is styleguide-only, but those text classes live in `packages/ds` so the website can use them.
- Logos: the `Table` organism (default variant — bordered, dividers, header bg) with **Preview | Name | Path** columns, mirroring the styleguide AssetTable (name `lockup / hori`, path `svg/<variant>.svg` in `<code>`).
- Footer `MORE` reordered: Press above Brand.

### SupportCTA + Newsletter + marble
- SupportCTA rebuilt to the user's exact spec: white section `p-12`, image left (`set-08`, `rounded-[4px]`, parallax drift `yPercent -8→8`) + **fixed 397px text column** bottom-aligned, Shop Collection (primary) + Learn More (secondary) buttons. Marble texture overlay at 15%.
- Newsletter: `surface-primary` + marble overlay at **15%** (image at 0.4→0.2→0.15; opacity lives on the overlay div, NOT a section bg — because `useReveal` writes inline `opacity:1` and would override). Content `relative` above the overlay. Marble optimized to `apps/website/public/brand/textures/ac-marble.jpg` (210KB).

### Type / hero / chrome
- `site-title-hero` uppercased (`text-transform: uppercase`); covers Shop/Handmade/Collections/Journal/About. Contact authored uppercase (`"STUDIO & ENQUIRIES."`) since it uses the secondary role (`site-title-page`) which is shared with product/article titles — didn't uppercase that role.
- Hero type size: **all 128px** (`clamp(56px,9vw,128px)`) except **home 144px** via `.home-hero .site-title-hero` (two-class specificity beats the unlayered base role; `home-hero` class added to the Home hero wrapper). Fixes About clipping.
- Hero **display eyebrow** (`.site-display-eyebrow`): magenta accent → light `surface-on-primary` (accent didn't read on the hero), weight 600→500, and 64% baked into the **colour alpha** (`color-mix(... 64%, transparent)`) NOT `opacity` (useReveal owns element opacity → would override).
- **HandmadeCard** → `h-screen`. **Marquee** bg `bg-black` → `text-auto`/`bg-surface-tertiary` (user tweak). **Nav** height 48→64px, **logo** 28→36px.
- **SecondaryPageShell** — removed the "← Back" link entirely (user: "amateur"; the fixed nav covers navigation). Affects Brand/Press/Privacy/Terms/Shipping.

### Tooling
- `tools/playwright/` recon scripts added/used: `inspect-375.mjs` + `inspect-375b.mjs` (375.studio loader, with cookie-accept so the banner doesn't obscure it), `inspect-cdpn.mjs <penId> <out>` (generic cdpn.io debug-view scraper), `inspect-dv-walk.mjs`, `find-htext.mjs`. Confirmed: GSAP demos are CodePen embeds; `cdpn.io/pen/debug/<id>` serves source. Recon output dirs are NOT all gitignored (only the original frames/traces patterns) — `bento/ pen/ smooth/ 375/ 375b/ dv-walk/ htext/` may need adding.

## Current State

### Working (pending live verification)
- `/loader` workbench, Collections river, static DesignerVision + Our Story link, unified Shop/Handmade, Brand styleguide-match, SupportCTA spec layout, Newsletter/SupportCTA marble, uppercased + resized hero titles, nav/logo sizing.

### Known issues / heads-up
- **Almost nothing visually verified by me** — the user is driving live and reacting; many values are their tweaks (FLOW_SPEED 400, marble 15%, logo 36).
- Handmade now uses the fancy fill/dim card grid while Shop uses the plain 4-col — they diverge again (user asked for Handmade specifically). Open whether Shop should match.
- `HorizontalScrollText` name is now a misnomer (it's autoplay, not scroll) — offered to rename to `RiverText`, no answer.
- IntroLoader still in SiteLayout as `variant="percentage"`; the wedge variant exists but isn't the chosen one.

## Next Steps
1. **ScrollSmoother + parallax** — still requested, still gated on green-light (architectural: SiteLayout `#smooth-wrapper>#smooth-content`, fixed overlays outside, rewire Nav/SignupOverlay scroll reads). Pen source at `tools/playwright/smooth/`.
2. Decide Shop card type (match Handmade's fill/dim, or keep plain).
3. Rename `HorizontalScrollText` → `RiverText` if wanted.
4. gitignore the new `tools/playwright/` recon output dirs.
5. Map the 20 `set` images to real products (still index-paired).
