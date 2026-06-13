---
title: Styleguide fold-in — merge runbook
date: 2026-05-16
status: archived
type: playbook
tags: [styleguide, consolidation, vercel, vite]
---

# Styleguide fold-in — merge runbook

Synthesis of inventories 01–04. Concrete moves to fold the styleguide from `kol-client-ac` into `kol-acyr-website` as a sibling project, deployed at `brand.another-creation.xyz` behind Vercel password protection.

## Final shape

```
kol-acyr-website/
├── src/                              # live site (canonical) — unchanged
│   ├── brand/                        # shared brand tokens (single source of truth)
│   ├── components/                   # site components (site/, atoms/, etc.)
│   ├── lib/                          # Sanity client + queries
│   ├── pages/site/                   # 14 site pages
│   └── ...
├── api/                              # serverless functions — unchanged
├── studio/                           # Sanity Studio — unchanged, proven sibling
├── styleguide/                       # NEW sibling project
│   ├── package.json                  # own deps (gsap, opentype.js, vite-plugin-photo-index)
│   ├── vercel.json                   # SPA rewrite
│   ├── vite.config.js                # own Vite config
│   ├── vite-plugins/
│   │   └── photoIndexPlugin.js       # copied from kol-client-ac
│   ├── public/
│   │   ├── brand -> ../../public/brand   # SYMLINK to dedup 305 MB
│   │   └── fonts -> ../../public/fonts   # SYMLINK (verify identical first)
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx                   # styleguide-only route table
│       ├── index.css                 # imports site's brand css via relative path
│       ├── pages/                    # Styleguide, Reference, Acyr, Gallery, Landing, NotFound
│       ├── components/
│       │   ├── styleguide/           # all of components/styleguide/
│       │   ├── framework/            # BrandHero, BrandLayout, PageSection, SideNav
│       │   ├── loaders/              # decks, graphics, logos, marks (NOT icons — site owns those)
│       │   └── (imports site components via ../../../src/components/...)
│       ├── editor/                   # editor app — full copy (137 files, ~14K LOC)
│       └── data/                     # color, typography, generators (styleguide-only data)
├── scripts/                          # sync-printful, migrate-to-sanity — unchanged
└── docs/
    └── client/styleguide/            # this research workspace
```

Vercel: three projects total (site, studio, styleguide). Each pointed at its own Root Directory. The styleguide project deploys to `brand.another-creation.xyz` via Cloudflare CNAME (proxy OFF, mirrors studio's pattern).

---

## Pre-merge cleanup — CWD side (~45 min)

These are independent fixes that should land BEFORE the migration, in their own small commits. Principle: **add before remove.** Only delete things we can prove unused; if uncertain, defer until post-fold-in observable state.

### 1. Drop confirmed-dead orphan dep
```bash
pnpm remove wawoff2
```
`wawoff2` is a font-conversion utility (woff ↔ tff); conversions already happened, the dep is inert. Confirmed by grep: zero importers in CWD.

**Keep `colord`** — it's an orphan in CWD *today* but the fold-in needs it (`kol-client-ac/src/editor/color/ColourPanel.jsx:2` imports it). Removing now = re-adding in two days. Skip.

**Keep `opentype.js`** — same reason, editor needs it.

### 2. Fix `src/index.css` to be imports-only

Per KOL DS rule (`kol-system/packages/kol-docs/src/00-system/02-imports.md:72–81`), `src/index.css` is canonical imports-only — no `@theme` blocks, no `:root` rules. CWD currently violates this twice.

Moves:
- The `@theme { --color-brand-* }` block (lines 17–24) → into `src/brand/kol-brand-color.css` at the bottom (it registers brand-tier Tailwind utilities; lives with the brand layer that defines the underlying `--brand-*` vars).
- The `:root { scrollbar-gutter: stable }` rule (line 29) → into `src/styles/kol-site.css` (site-chrome scope).
- `src/index.css` collapses to the canonical 5-line shape:
  ```css
  @import "tailwindcss";
  @import "./styles/kol-theme.css";
  @import "./brand/kol-brand-color.css";
  @import "./components/framework/kol-framework.css";
  @import "./styles/kol-site.css";
  ```

After this, the `styleguide/src/index.css` (created later) can follow the same shape — imports-only, referencing the same files via relative path. No `@theme` duplication anywhere.

### 3. Fix latent token typo
In the `@theme` block (now moved into `src/brand/kol-brand-color.css` per step 2), change references from `--brand-primary-on` / `--brand-secondary-on` to `--brand-on-primary` / `--brand-on-secondary` to match the actual definitions in the same file. Currently resolves to undefined.

### 4. Re-adopt the correct `framework/Layout.jsx`
Copy `kol-client-ac/src/components/framework/Layout.jsx` over CWD's version. The kol-client-ac version supports multi-surface routing (ExitPreview + route gate for `/site/*` vs `/styleguide/*` etc.) which becomes load-bearing once the styleguide ships. CWD's current version dropped this when site became the sole surface — needs restoring.

### 5. Skip Tag.jsx deletion for now
`molecules/Tag.jsx` has zero importers in CWD today. But the fold-in might surface a styleguide consumer. Defer the delete decision until post-fold-in audit. Cost of leaving it: ~70 LOC inert.

---

## Pre-migration cleanup — kol-client-ac side

**None.** Per add-before-remove: don't delete anything from the source repo. We just don't migrate it. Dead components, stale `pages/site/*`, unused data files — all stay where they are. They die when `kol-client-ac` is archived. Touching the source repo gains nothing and risks breaking the snapshot we're carving from.

---

## Migration execution

### Step 1 — Scaffold `styleguide/`

Create empty skeleton:
```bash
mkdir -p styleguide/{src,public,vite-plugins}
mkdir -p styleguide/src/{pages,components,editor,data}
mkdir -p styleguide/src/components/{styleguide,framework,loaders}
```

### Step 2 — Copy styleguide-only surface

Per add-before-remove: copy what's needed, leave the rest in the source repo. Source repo is read-only; no deletions over there.

**Pages (copy each):**
```
kol-client-ac/src/pages/Styleguide.jsx       → styleguide/src/pages/Styleguide.jsx
kol-client-ac/src/pages/Reference.jsx        → styleguide/src/pages/Reference.jsx
kol-client-ac/src/pages/Acyr.jsx             → styleguide/src/pages/Acyr.jsx
kol-client-ac/src/pages/Gallery.jsx          → styleguide/src/pages/Gallery.jsx
kol-client-ac/src/pages/Landing.jsx          → styleguide/src/pages/Landing.jsx
kol-client-ac/src/pages/NotFound.jsx         → styleguide/src/pages/NotFound.jsx
```
(Don't copy `src/pages/site/*` — CWD is canonical.)

**Components (copy each):**
```
kol-client-ac/src/components/styleguide/     → styleguide/src/components/styleguide/
kol-client-ac/src/components/framework/BrandHero.jsx          → styleguide/src/components/framework/BrandHero.jsx
kol-client-ac/src/components/framework/BrandLayout.jsx        → styleguide/src/components/framework/BrandLayout.jsx
kol-client-ac/src/components/framework/PageSection.jsx        → styleguide/src/components/framework/PageSection.jsx
kol-client-ac/src/components/framework/SideNav.jsx            → styleguide/src/components/framework/SideNav.jsx
kol-client-ac/src/components/framework/sidebars.config.js     → styleguide/src/components/framework/sidebars.config.js
kol-client-ac/src/components/loaders/{decks,graphics,logos,marks}/  → styleguide/src/components/loaders/
kol-client-ac/src/components/hooks/{useReveal,useScrollSpy}.js      → styleguide/src/components/hooks/
```
(Don't copy `framework/PortalFooter.jsx` and `framework/SubPageHero.jsx` — confirmed zero importers per inventory 03. Don't copy `loaders/icons/` — CWD already owns that.)

**Editor (copy whole tree):**
```
kol-client-ac/src/editor/                    → styleguide/src/editor/
```
Non-optional: BrandLayout mounts editor's LibraryProvider; SlideDeck imports `fgOn` from editor's palette module.

**Data (copy each):**
```
kol-client-ac/src/data/color.js              → styleguide/src/data/color.js
kol-client-ac/src/data/typography.js         → styleguide/src/data/typography.js
kol-client-ac/src/data/generators.jsx        → styleguide/src/data/generators.jsx
```
(Don't copy `data/components.js` — confirmed zero importers per inventory 03.)

**Brand data (copy into CWD's shared brand layer):**
```
kol-client-ac/src/brand/data/branded-assets.js   → src/brand/data/branded-assets.js
kol-client-ac/src/brand/data/business-data.js    → src/brand/data/business-data.js
```
Goes into the SITE's `src/brand/data/` (not styleguide's), since they're brand data that the styleguide consumes via the shared brand layer. Single source of truth.

**Vite plugin (copy):**
```
kol-client-ac/vite-plugins/photoIndexPlugin.js → styleguide/vite-plugins/photoIndexPlugin.js
```
Extend for video support per Step 7.

**Don't copy (confirmed unused per inventory 03; let them die with the archive):**
- `src/components/styleguide/AssetCarousel.jsx`, `AssetFigure.jsx`, `AssetGrid.jsx`, `LogoCarousel.jsx`, `FullscreenGallery.jsx`, `MoodTile.jsx`, `PortalIndex.jsx`, `ProsePreview.jsx`, `SigTicker.jsx`, `SpectrumGrid.jsx`, `TypeScaleSection.jsx`, `TypeSpecCard.jsx` — verify each via grep against the migration target list before excluding; if any TURNS OUT to be imported by a page that's coming over, copy it.

### Step 3 — Set up `styleguide/src/main.jsx` + `App.jsx`

`main.jsx` mirrors CWD's pattern:
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
```

`App.jsx` is styleguide-only routes:
```jsx
import { Route, Routes } from 'react-router-dom'
import Landing from './pages/Landing'
import Styleguide from './pages/Styleguide'
import Reference from './pages/Reference'
import Acyr from './pages/Acyr'
import Gallery from './pages/Gallery'
import NotFound from './pages/NotFound'
import EditorRoutes from './editor/routes'  // editor's own route tree

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/styleguide" element={<Styleguide />} />
      <Route path="/reference" element={<Reference />} />
      <Route path="/acyr" element={<Acyr />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/editor/*" element={<EditorRoutes />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
```

### Step 4 — `styleguide/src/index.css`

Imports-only, per KOL DS rule. Same 5-import shape as CWD's (post-fix step 2 above), via relative paths. No `@theme` block, no `:root` rules — those moved into the brand and site layers during pre-merge fix step 2.

```css
@import "tailwindcss";
@import "../../src/styles/kol-theme.css";
@import "../../src/brand/kol-brand-color.css";
@import "../../src/components/framework/kol-framework.css";
@import "../../src/styles/kol-site.css";
```

If the styleguide needs additional CSS (e.g. an editor-specific layer), add it as a new file under `styleguide/src/styles/` and import it here. Don't put rules inline.

### Step 5 — Refactor import paths in moved files

The moved files originally referenced `../brand/config`, `../components/atoms/...`, `../data/...` etc. Inside `styleguide/src/`, those paths need to ascend further:

- Brand tokens: `../brand/config` → `../../src/brand/config`
- Site components (Avatar, Carousel, etc.): `../components/atoms/Avatar` → `../../src/components/atoms/Avatar`
- Internal styleguide refs (data, framework, components/styleguide): stay relative within styleguide/src/

Pattern: anything pointing INTO the site, prefix `../../src/`. Anything internal to the styleguide stays where it was. Run a find-and-replace pass, then visual-inspect each file.

### Step 6 — Asset symlinks

```bash
cd styleguide/public
ln -s ../../public/brand brand
ln -s ../../public/fonts fonts
```

**Pre-flight verification:** confirm `kol-acyr-website/public/fonts/` and `kol-client-ac/public/fonts/` are identical. Agent 1 noted asset paths weren't enumerated. If they differ, reconcile first; otherwise the symlink works.

Vercel supports symlinks on Linux runners. If for some reason it doesn't, fallback is `vercel.json` rewrites pointing styleguide asset URLs at the site domain. Less clean.

### Step 7 — `styleguide/vite.config.js` + extend photoIndexPlugin for video

Copy `vite.config.js` from `kol-client-ac/`. Adjust paths so the photoIndexPlugin resolves from `./vite-plugins/`. Confirm React, Tailwind v4, svgr plugins all present.

Then extend `vite-plugins/photoIndexPlugin.js` to scan video. Current regex (`IMG_RE = /\.(jpe?g|png|webp|avif|gif)$/i`) is image-only. Replace with:

```js
const IMG_RE   = /\.(jpe?g|png|webp|avif|gif)$/i
const VIDEO_RE = /\.(mp4|webm|mov|ogv)$/i
const MEDIA_RE = new RegExp(`${IMG_RE.source}|${VIDEO_RE.source}`, 'i')
```

Use `MEDIA_RE` for the file-test branches. Tag each entry with a `type` field:
```js
const type = IMG_RE.test(entry) ? 'image' : 'video'
out.push({ type, src: '/' + rel })
```

Gallery.jsx then discriminates by `entry.type` (renders `<img>` or `<video>` accordingly). Backwards-compatible *if* Gallery is updated in the same PR. Otherwise breaking — track the update as part of the fold-in.

Optional: rename endpoint from `/__photos.json` to `/__media.json` for accuracy, but not required.

### Step 8 — `styleguide/package.json` strategy

**Recommended: own `package.json`** (matches studio pattern). Move styleguide-only deps from CWD root `package.json` into `styleguide/package.json`:

Styleguide-only deps to move:
- `gsap` (used by SigTicker and DeckShell)
- `opentype.js` (editor's Type mode)
- `vite-plugin-photo-index`
- Any other dep that only the styleguide imports — audit by running `pnpm why <pkg>` on each from both contexts.

Shared deps (React, Tailwind, Vite, React Router) get pinned to identical versions in both `package.json` files. Add a tiny `scripts/verify-versions.mjs` that diffs the shared dep versions between root and `styleguide/package.json` and fails CI on mismatch. ~20 lines of script.

Alternative shape (single root `package.json`, styleguide just has its own `vite.config.js` + `vercel.json`): also clean. Eliminates the version-drift risk entirely. Downside: site's `node_modules` carries styleguide-only deps. Pick on cognitive-load preference; either works.

### Step 9 — `styleguide/vercel.json`

Mirror studio's:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Step 10 — Vercel project setup

1. Create new Vercel project `kol-client-acyr-styleguide` (same naming pattern as studio).
2. Connect to the same GitHub repo.
3. Set Root Directory: `styleguide`.
4. Framework Preset: Vite.
5. Install Command: `pnpm install` (Vercel auto-detects).
6. Build Command: `pnpm build`.
7. Output Directory: `dist`.
8. Add Cloudflare CNAME: `brand.another-creation.xyz` → `cname.vercel-dns.com` (proxy OFF).
9. Add domain to the Vercel project, wait for TLS issuance.
10. Enable Vercel Pro Password Protection at project level.

### Step 11 — App routes update on the site project

CWD's `src/App.jsx` previously had `/styleguide` etc. wrapped routes. Remove them — those routes now live entirely in the styleguide project. CWD's App.jsx is site-only.

If you want a public-facing brand/press page on the site (backlog 6b), add a NEW route `/brand` or `/press` to the site's App.jsx that consumes the brand-data subset — separate from the full styleguide.

---

## Post-merge verification

Run through this checklist after deploying both projects:

- [ ] Site renders unchanged at `another-creation.xyz` — spot-check `/`, `/shop`, `/checkout`, `/blog`, `/collections`.
- [ ] Site cart + checkout work end-to-end (sanity smoke test).
- [ ] Styleguide renders at `brand.another-creation.xyz`.
  - [ ] `/` Landing renders
  - [ ] `/styleguide` all 12+ chapters render (color swatches read live, type samples render, asset mocks render)
  - [ ] `/reference` Reference page renders (consumes branded-assets.js)
  - [ ] `/acyr` Acyr page renders (consumes business-data.js)
  - [ ] `/gallery` Gallery renders (photoIndexPlugin generated `/__photos.json` consumed)
  - [ ] `/editor` editor app boots, all modes accessible
- [ ] No 404s in network tab for asset paths (symlinks working).
- [ ] No console errors.
- [ ] Password gate active and reaches the right surface after auth.
- [ ] No site-secret env vars exposed in the styleguide build (`grep -r 'PAYPAL\|PRINTFUL\|SANITY_WRITE' styleguide/dist/`).
- [ ] `pnpm sync-printful` still works from root.
- [ ] `pnpm dev` (site) runs unaffected.
- [ ] Sanity studio at `studio.another-creation.xyz` runs unaffected.

---

## Risks + mitigations

| Risk | Mitigation |
|---|---|
| Symlinks fail on Vercel Linux runner | Pre-flight test on a Vercel preview deploy; fallback to `vercel.json` rewrites |
| Editor's `LibraryProvider` breaks when bundled standalone | Test in styleguide preview deploy before merging to main; editor depends on context, isolate any window/document refs |
| SlideDeck's cross-tier `fgOn` import from `editor/modes/palette/palettes` resolves but couples styleguide-tier to editor-tier | Both files end up co-located under `styleguide/` post-fold-in; import path resolves. **Refactor candidate (defer):** `fgOn` is pure color math — extract to `styleguide/src/lib/color-utils.js` later if editor ever becomes optional. Don't gold-plate now. |
| `photoIndexPlugin` doesn't find images after path move | Plugin scans `public/brand/` paths; confirm paths resolve correctly after symlink |
| `photoIndexPlugin` extension to video breaks Gallery.jsx | Update Gallery in the same PR that extends the plugin; verify JSON shape (`{type, src}`) consumed correctly. Backwards-incompatible by design — `/__photos.json` consumers must change or stay on old plugin |
| Shared dep version drift between root + styleguide package.json | `scripts/verify-versions.mjs` CI check |
| Site rebuilds on every push (Vercel default) | Vercel's Ignored Build Step: `git diff HEAD^ HEAD --quiet -- src/ api/ public/ studio/` — only rebuild site if site-relevant paths changed. Same for styleguide. |
| Font files differ between repos | Diff `public/fonts/` between both before symlinking; reconcile if needed |
| Acyr.jsx imports brand data that doesn't exist yet | `business-data.js` migrates first; verify all consumed keys exist |
| index.css violations re-introduced in styleguide | Pre-merge step 2 (CWD imports-only fix) lands first; styleguide's own index.css mirrors that shape. Code review the styleguide/src/index.css to ensure no `@theme` or `:root` rules. |

---

## Backlog reflection

Item 6 (Brand surface + press portal) sub-items now read as concrete steps:

- 6a. **Writing guidelines doc** — drafted in chat; save to `docs/brand/writing-guidelines.md` v0.1.
- 6b. **Public brand/press page on `another-creation.xyz`** — separate small route (`/brand` or `/press`) on the SITE project; consumes a curated subset of brand data. Does NOT depend on the styleguide fold-in.
- 6c. **Private assets portal** — this runbook. Styleguide fold-in to `styleguide/`, deployed to `brand.another-creation.xyz`.
- 6d. **Per-route metadata + OG image** — design once the visual vocabulary is locked from 6b/6c work.

6a + 6b can ship independently of 6c. The fold-in (6c) is the largest piece and the gating risk; consider scheduling 6a and 6b in shorter sessions first to lock the brand voice and public surface, then take 6c as a focused half-day session.

---

## Open calls for the user before execution

These need explicit answers before the merge PR opens:

1. **Auth model — password protection vs noindex-only?** If the portal is just "don't index in Google + don't share publicly," `<meta name="robots" content="noindex">` + obscure subdomain is friction-free. If it's gatekeeping pre-launch IP, Vercel password protection. Default recommendation: password protection (you asked for a wall).
2. **Domain choice: `brand.another-creation.xyz` or `assets.another-creation.xyz`?** Recommend `brand.` — clearer semantics.
3. **Style unity stance — execute the JetBrains Mono → Right Grotesk Mono swap and `bg-fg-*` → true-black/white swap NOW (during fold-in) or as a separate sweep after?** Recommend separate: keep the fold-in clean of design changes so any visual regression is provably from the design swap, not the merge.
4. **`Acyr.jsx` — confirmed: stays in styleguide, behind the wall.** It's the 15-section client-facing source-of-truth registry (identity, bio, timeline, press, awards, films, companies, collaborations, social, vendors, stack, live-site map, media inventory, marketing playbook, gaps). Internal knowledge base, NOT public showcase. Lives in `styleguide/src/pages/Acyr.jsx`. No open call — closed.
5. **`package.json` shape — separate (studio pattern) or single root?** Recommend separate; matches established convention.
