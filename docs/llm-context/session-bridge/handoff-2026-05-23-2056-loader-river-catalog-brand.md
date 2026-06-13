# Handoff — 2026-05-23 20:56

## Goal of the current arc
Live design polish of the home + secondary pages with the user driving rapid, reactive feedback. This arc: IntroLoader, the Collections "river of words" hero, catalog (Shop/Handmade) unification, Brand page matching the styleguide, and a wave of hero/type/chrome tuning. Everything is unverified-by-me — the user reloads and reacts.

## Last actions taken (causal trail, newest first)
- Hero type sizes: all `site-title-hero` → 128px, home → 144px via `.home-hero .site-title-hero` (fixes About clipping). Eyebrow accent → light + 64% via colour-alpha + weight 500.
- Nav 48→64px, logo 28→36px. HandmadeCard → h-screen. Marquee bg user-tweaked to `text-auto`/`bg-surface-tertiary`.
- Brand page rebuilt to match styleguide: swatch (96px chip + `ac-helper-10`/`text-meta`/`text-strong` mono meta, `auto-fit minmax(100px,1fr)` gap-1) + logo Table (default variant, Preview|Name|Path). Footer: Press above Brand. SecondaryPageShell "← Back" removed.
- SupportCTA → exact spec (image-left 397px-text-right) + marble 15% + parallax. Newsletter marble overlay 15% (opacity on the overlay div, not section bg).
- Shop+Handmade unified on `CatalogHero`; grids identical + tight to hero; filters removed from Shop; Handmade 6→8 products + home-Collection card type; `set` images split 01-08 (Handmade) / 09-20 (Shop); Newsletter at the end of both.
- DesignerVision reverted to static; Our Story → /about via useNavigate.
- Collections hero = autoplay river-of-words overlay (3rd attempt; first two were scroll-coupled = wrong).
- IntroLoader 375-style (no scale, looping word, color-slide exit, centered logomark) + `/loader` dev workbench (forcePlay).

## Current state / open decision points
- **Nothing verified by me this session** — user is the live validator. Trust their tweaks (FLOW_SPEED 400, marble 0.15, logo 36) as intentional.
- **ScrollSmoother + parallax**: requested, NOT started, gated on green-light. Architectural — wrap SiteLayout in `#smooth-wrapper>#smooth-content`, keep fixed overlays (Nav/CartDrawer/SignupOverlay/WebsiteSearch) outside, rewire Nav scroll-hide + SignupOverlay scroll-arm (both read `window.scrollY`, which ScrollSmoother breaks). Pen source saved at `tools/playwright/smooth/`.
- Shop vs Handmade card type now diverges (Handmade fancy fill/dim, Shop plain 4-col) — user asked for Handmade only; open whether to match Shop.
- `HorizontalScrollText` is a misnomer now (autoplay, not scroll) — rename to `RiverText`? No answer yet.

## Next intended action
- Wait for the user's next live reaction. If they greenlight ScrollSmoother, do the SiteLayout restructure + Nav/SignupOverlay scroll-read rewire carefully (it touches the nav scroll-hide that's currently stable).

## Working memory not yet in AGENT-CONTEXT
- **`cdpn.io/pen/debug/<id>`** is the reliable way to read GSAP demo source (codepen.io itself is Cloudflare-walled to the bot). `tools/playwright/inspect-cdpn.mjs <penId> <outDir>`. For pages that gate behind a cookie banner (375.studio), accept it first then reload so the banner doesn't obscure the capture (`inspect-375b.mjs`).
- **Opacity-via-class is overridden by useReveal** — useReveal/useSplitReveal set inline `opacity:1` at the end of the entrance, which beats any CSS `opacity` on the element. To dim a revealed element, bake the alpha into its **colour** (`color-mix(... N%, transparent)`), not `opacity`. (Hit this on the hero eyebrow.)
- **Recon output dirs not gitignored**: `tools/playwright/{bento,pen,smooth,375,375b,dv-walk,htext}/` — add to .gitignore before the next push (the earlier push was rejected for large trace files; same risk).
- User taste this session: snappy/clean, hates "amateur" touches (back link), wants real components reused (styleguide swatch/table) not hand-rolled, big confident type, autoplay over scroll-jacking for ambient effects.
