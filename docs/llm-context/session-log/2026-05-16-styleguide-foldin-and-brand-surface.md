# Session: Styleguide fold-in (Phase A/B/C) + brand surface

**Date:** 2026-05-16
**Agent:** Grim (Claude Opus 4.7, 1M context)
**Summary:** Folded the styleguide repo into the website repo as a third Vercel project, deployed at `brand.another-creation.xyz` behind Cloudflare Access. Built public `/brand` + `/press` pages on the live site. Established paired brand writing docs (guidelines + worked examples). Mirrored brand data into readable markdown. Misc small wins: Sanity deprecation fix, env-aware Live-site link, favicon fix, footer cleanup.

## Changes Made

### Phase A — Pre-merge hygiene (CWD)
- `pnpm remove wawoff2` — orphan dep from yesterday's extraction.
- `src/index.css` — collapsed to canonical 5-line imports-only per KOL DS rule (`kol-system/packages/kol-docs/src/00-system/02-imports.md`). Dead duplicate `@theme` block (with broken `--color-brand-primary-on` names) removed; correct `@theme` already exists in `src/brand/kol-brand-color.css`. `:root { scrollbar-gutter: stable }` moved to `src/styles/kol-site.css`.
- `framework/Layout.jsx` — left as-is (site-only Layout is correct for CWD's single-surface deployment; kol-client-ac's multi-surface version would re-introduce a dead `/site/*` regex branch).

### Phase B — Styleguide fold-in (CWD)
- New sibling project `styleguide/` (matches `studio/` precedent).
  - `styleguide/package.json` — own deps (gsap, colord, opentype.js, etc.). Shared deps (React 19.2.5, Tailwind 4.2.4, Vite 8.0.10, etc.) pinned identically to root.
  - `styleguide/vite.config.js` — `@brand` → `../src/brand` and `@components` → `../src/components` Vite aliases for cross-repo imports. `server.port: 5174` pinned so site reliably owns 5173.
  - `styleguide/vercel.json` — SPA rewrite.
  - `styleguide/index.html` — `noindex` meta + favicon link.
  - `styleguide/src/{main.jsx, App.jsx, index.css}` — entry, route table (Landing, Styleguide, Reference, Acyr, Gallery, /editor/*, NotFound), imports-only CSS via relative paths to CWD's brand layer.
- Copied ~660 styleguide-only files from `kol-client-ac`:
  - Pages (6), `components/styleguide/` (23), framework chrome, `components/loaders/{decks,graphics,logos,marks,images}` (NOT icons — CWD owns), `components/hooks`, `components/sections/ColorRamp.jsx`, `components/organisms/Table.jsx`.
  - Full `editor/` tree (137 files, ~14 K LOC — non-optional, `BrandLayout` mounts editor's `LibraryProvider`).
  - Data: `color.js`, `typography.js`, `generators.jsx`.
- Refactored ~103 cross-repo imports to use `@brand/*` and `@components/*` aliases (sed pass, longest-pattern-first).
- Asset symlinks (305 MB dedup): `styleguide/public/{brand,fonts,favicon.svg}` → `../../public/{brand,fonts,favicon.svg}`.
- `vite-plugins/photoIndexPlugin.js` — extended for video. Regex now covers mp4/webm/mov/ogv. JSON output is `{type, src}` objects (breaking change from raw string array).
- `styleguide/src/pages/Gallery.jsx` — updated to discriminate by `entry.type`, render `<video>` for videos with "VIDEO" badge overlay when not focused.
- New `scripts/verify-versions.mjs` — CI guard against shared-dep drift between root and `styleguide/package.json` (10 deps pinned).
- Brand data files `branded-assets.js` + `business-data.js` copied into CWD's `src/brand/data/` (single source of truth — styleguide consumes via shared brand layer).
- Add-before-remove side effects in CWD: copied 7 missing atoms (ColorSwatch, Label, Slider, Stepper, ToggleCheckbox, ToggleSwitch, TransparentX), 11 missing molecules (DropdownTagFilter, LabeledControl, Modal, Pill, PropertyInput, QuantityInput, QuantityStepper, SectionLabel, SegmentedToggle, ToggleBracket, ViewToggle), 5 missing primitives (ExitPreview, FullscreenOverlay, Image, Accordion, CodeBlock), and `organisms/Table.jsx` (new dir).

### Phase C — Deployment
- Vercel project `kol-client-acyr-styleguide` (Root Directory `styleguide`, Framework Preset Vite). Install Command override: `cd .. && pnpm install` (cross-repo imports need root's `node_modules`).
- Cloudflare DNS: CNAME `brand` → `cname.vercel-dns.com`, proxy ON (required for Cloudflare Access).
- Cloudflare Zero Trust → Access → self-hosted application for `brand.another-creation.xyz`.
- Access policy: Allow if `Emails ending in @another-creation.xyz` OR `Emails ending in @another-creation.com` (two Include rules — OR logic per Cloudflare convention).
- Login: One-time PIN (Cloudflare default, free). Verified end-to-end with OTP email.
- Vercel `kol-client-acyr-styleguide` env vars left empty (no PayPal/Printful/Sanity secrets leaked into styleguide project).

### Public brand surface
- `src/pages/site/Brand.jsx` — minimal /brand page: back link, mark (logomark + wordmark), 4 swatches with hex (burgundy + cream), type note, assets-on-request line. Privacy.jsx pattern (`max-w-3xl`).
- `src/pages/site/Press.jsx` — minimal /press page: about, quick facts (founded, designer, studio, legal entity), press contact, kit-on-request (slide deck "in progress"), link to /brand.
- `src/App.jsx` — `/brand` + `/press` routes wired.
- `src/components/site/Footer.jsx`:
  - Fixed broken About link (was `to: null`).
  - Added Contact to BROWSE.
  - Added LinkedIn to SOCIAL.
  - Renamed LEGAL column → "More"; added Brand + Press at top.

### Brand voice & documentation
- `docs/client/kol-client-acyr/02-brand/04-writing-guidelines.md` (v4.0.0) — voice manifesto, 10 observations on what makes prose work, house style, vocabulary table. Rules half.
- `docs/client/kol-client-acyr/02-brand/05-writing-examples.md` (v1.0.0, new) — 10 worked prose pieces: article (linen mill), collection note, press release (fictional Yr × Hedi Slimane), longer bio (real), advertisement, Document Journal interview, monthly newsletter, social captions, product page description, runway show note. Prose half.
- `docs/client/kol-client-acyr/02-brand/styleguide-text-rewrite.md` (v0.1.0, new) — rewrite of styleguide-text.md against the new voice; drops "Icelandic lineage" nationalist register; tightens bio and About chapters.
- `docs/client/kol-client-acyr/02-brand/01-contact-and-identity.md` (new) — readable mirror of `src/brand/data/info.js`.
- `docs/client/kol-client-acyr/02-brand/02-career-and-press.md` (new) — readable mirror of `src/brand/data/business-data.js`. All 19 press citations including the 5 added today.
- `docs/client/kol-client-acyr/02-brand/03-branded-assets.md` (new) — readable mirror of `src/brand/data/branded-assets.js`.
- `docs/client/kol-client-acyr/99-archive/writing-guidelines-agent.md` — old agent-guidelines doc archived (superseded by paired guidelines + examples).

### Brand data updates
- `src/brand/data/info.js`:
  - `email`: `yr@another-creation.xyz` (was `.com`)
  - `phone`: `+354-698-5802` (kebab-cased per user)
  - `web`: `another-creation.xyz`
  - `street`: `Vatnsstígur 3` (was Klapparstígur 16)
  - `region`: `Gullbringa` (new field)
  - `established`: `2013` (was `2024` — typo)
- `src/brand/data/business-data.js`:
  - Added 5 press citations: 2011 Vísir (Barney's), 2× 2013 Vísir, 2018 Mannlíf, 2020 Mbl.
  - Added LinkedIn social profile (`creatoryr`).
  - Removed resolved Address open question.

### Small wins
- `src/lib/sanity.js` — switched from deprecated `imageUrlBuilder` default import to named `createImageUrlBuilder`. Deprecation warning gone.
- Styleguide `Live site` link is now env-aware: `http://localhost:5173` in dev, `https://another-creation.xyz` in prod. Both Landing.jsx button and SideNav sidebar entry.
- Styleguide pinned to port 5174 in vite.config.js so dev links resolve to a real local site.
- Styleguide favicon fixed (was `/brand/favicon.svg`, now `/favicon.svg` via new symlink).

### Backlog rewrite (`docs/backlog.md`)
- Restored ALL completed sub-items with ✅ checkmarks. Going forward: completed work stays visible.
- Item 1 (domain): a–d ✅; e, f open.
- Item 2 (Sanity): a–e ✅; f open.
- Item 6 (Brand surface + press portal): a, b, c ✅; d open (OG metadata).
- **New Item 7 (Styleguide fold-in)**: a–c ✅ (Phase A/B/C); d–f open follow-ups.
- Item 5 (Polish) extended with letters i–n from loose notes (dark-mode contrast, selection bug, home text alignment, icon audit, cart minus-to-delete, table copy syntax).
- **New Item 8** Newsletter (ESP + checkout opt-in + footer signup track).
- **New Item 9** Gallery enhancements (video ✅ done; scaling/zoom/asset population open).
- **New Item 10** Social channels (LinkedIn ✅; TikTok decision pending).
- **New Item 11** CSS library reorg (was 7).
- Loose-notes section (L34–46) fully sorted into items.

## Current State

### Working
- `another-creation.xyz` site unchanged and live.
- `studio.another-creation.xyz` Sanity Studio unchanged and live.
- `brand.another-creation.xyz` styleguide live + gated by Cloudflare Access OTP (verified end-to-end with email login).
- `/brand` + `/press` pages built on the live site, footer-linked.
- Styleguide local dev: `pnpm styleguide:dev` boots Vite on 5174; site `pnpm dev` owns 5173. `Live site` link in dev points at localhost.
- Three Vercel projects, three independent deploys, shared brand tokens via `src/brand/` (CWD canonical, styleguide imports via `@brand/*` alias).
- 305 MB `public/brand/` asset duplication eliminated via symlink.
- Writing voice now grounded in 10 worked prose examples instead of abstract rules. Paired docs.

### Known Issues / Deferred
- FOUC dev-console warning — source not in CWD `src/` (grepped useLayoutEffect / getBoundingClientRect / offsetHeight / scrollHeight / getComputedStyle — zero matches). Likely third-party or browser paint-cycle warning. Logged as backlog 5h.
- `framework/Layout.jsx` in `styleguide/` still has dead `/site/*` route-gate code path (defensive — regex matches nothing in styleguide context but cosmetic noise). Backlog 7f.
- SlideDeck → editor `fgOn` cross-tier coupling — works post-fold-in (co-located), refactor candidate (extract to shared color-utils). Backlog 7f.
- Vercel "Ignored Build Step" not yet configured on either project — every push triggers both rebuilds. Backlog 7e.

## Next Steps

1. Commit + push to trigger Vercel redeploys (site + styleguide).
2. Tackle remaining Phase C follow-ups (backlog 7d, 7e): verify env-var isolation in styleguide Vercel project; configure Ignored Build Step on both site and styleguide projects.
3. Pick a direction:
   - **Polish sweep** (backlog 5) — bundle small UI/UX fixes into one focused session.
   - **Multi-image + color variants** (backlog 3) — biggest commerce-functional gap; touches sync + JSON + PDP + cart + server.
   - **Per-route metadata + OG image** (backlog 6d) — once visual vocabulary is locked, design and wire across the site.
   - **Newsletter track** (backlog 8) — pick provider, scaffold signup flow.
