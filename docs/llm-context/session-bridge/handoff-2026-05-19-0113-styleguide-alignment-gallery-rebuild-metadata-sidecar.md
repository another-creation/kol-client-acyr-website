# Handoff — 2026-05-19 01:13

## Goal of the current arc

Bring the styleguide app's structured pages onto one consistent shape (BrandHero → numbered PageSections → simple Tables → flex-gap spacing), and pull Gallery into that system instead of letting it remain a raw-hex outlier. Then layer in a hand-authored metadata sidecar so a single file can be cross-posted to multiple sections and filtered by tag, with credits/year/season surfacing in the lightbox. Open arc next: dedupe photoshoot images by tagging + crossPostTo instead of physical-folder duplication, then revisit form-element native chrome (backlog 19) and newsletter design (backlog 8j).

## Last actions taken (causal trail, newest first)

- Added backlog items 20 (`accent-burgundy-brighter`), 21 (`Cmd+K search` indexing styleguide + maybe website), 22 (unified row component — cart/checkout × gallery list).
- Deleted `apps/styleguide/public/brand/video/ac-rff-2015-{01,02}.jpeg` — the placeholder JPEGs left over from when videos didn't render. Manifest tolerates orphans, no breakage.
- Introduced `crossPostTo` field in `media-metadata.js` because tags-only didn't relocate sections — user expected the rff video to surface in `collections / creation-1`, not just be filterable by tag. `flatMap` now produces base entry + one extra per crossPost target. Each cross-post entry has its own `groupKey` (`'collections / creation-1'`) but same `src`/`name`/etc.
- Created `apps/styleguide/src/data/media-metadata.js` with schema: `crossPostTo`, `tags`, `title`, `credits`, `year`, `season`, `featured`. Seeded one entry for `/brand/video/ac-rff-2015-srt.mp4`.
- Gallery wires Tags filter group (conditionally — only if tagValues is non-empty). Search includes `tags`. Lightbox caption shows title (when curated), credits (when set), year/season + counter.
- Lightbox upgrade: 0.6 → 0.9 backdrop opacity. Added `<button>`-based prev/next arrows (48×48 circles, `bg-fg-12 hover:bg-fg-24`, `arrow-left`/`arrow-right` icons, `e.stopPropagation()` on click). Keyboard Arrow nav + wrap-at-ends. Counter moved into a caption block at bottom-center. `key={entry.src}` on `<img>`/`<video>` so they re-mount between slides (avoids video-frame freeze).
- Lightbox state model changed from `{ entry }` to `{ list, index }`. Lightbox owns its own currentIndex via internal `useState(startIndex)`. `openHandler` computes `findIndex(x => x.src === entry.src)` on click — O(n) but only on click, fine.
- Filter panel layout: `flex items-start gap-16` (horizontal, eaten by long chip rows) → `flex flex-col gap-6` (vertical stack). `Clear all` button repositioned via `self-start`. Affects /shop on the live site too — should read cleaner there as a side effect.
- Search field tweak `border-0 appearance-none` had **zero effect** on the blue strokes above/below the expanded input. Reverted. Filed backlog 19 — global form-element chrome reset. Root cause not the native input border. Next time, DevTools Computed pane on the focused input to find the actual source (likely a `:focus-within` style on a parent, or a global `*:focus` somewhere we haven't found).
- Gallery rewrite: BrandHero + PageSection chrome, ContentFilters integration with renderItem callback handing filtered items to GridView/ListView. `groupByCategory` uses Map insertion order to preserve original `data.groups` order. Subcategory derivation walks the path: `/brand/collections/creation-1/img.jpg` → category=`collections`, subcategory=`creation-1`, groupKey=`'collections / creation-1'`. Section ids slugified (`slugifyKey`) so anchors don't carry spaces or slashes.
- Grid sizing: `minmax(160px, 1fr)` → `minmax(200px, 1fr)`; `gap-[2px]` → `gap-2`. Image frames `rounded-[4px]`.
- Lightbox click-to-open replaces direct-file-open. Click handler wrapped in `openHandler` — left-click only (no modifier keys) opens lightbox; cmd/ctrl/shift/middle click still opens the source file URL in a new tab (escape hatch). List view also has a separate external-link icon at the end of each row for explicit new-tab.
- All 20 tables across the three structured pages flipped to `variant="simple"`. Identity table was the one-off seed; rest applied via `<Table columns=` → `<Table variant="simple" columns=` (Acyr) and `<Table caption=` → `<Table variant="simple" caption=` (Reference + Styleguide).
- Reference renumbered `00–14` → `01–15` to baseline at `01` across all pages. `BRAND_COLORS_SECTIONS` labels shifted `02–05` → `03–06`; `TYPOGRAPHY_SECTIONS` rendered ones (prose, mono, opacity, cuts) shifted `06–09` → `07–10`. Filtered (sans-families, sans-atomic) left at `10–11` since they don't render.
- PageSection became `flex flex-col gap-8` — children stop declaring `mt-*`. Acyr stripped `<main className="ac-page">` (was double-wrapping ac-page) and inline prose margin styles. Styleguide stripped all chapter-level `mt-12/8/6`. BrandHero gained optional `children` slot for Acyr's snapshot block under the lede.
- BrandLayout's outer `<div className="min-w-0">` → `<main className="min-w-0">` — applies the semantic landmark once per BrandLayout-routed page.

## Current state / open decision points

- **Form-element chrome (backlog 19)** is the unresolved technical irritation. Two unsuccessful attempts: (a) `border-0 appearance-none` on the input, (b) earlier nothing in this area was reset. Root cause is somewhere else — could be a `:focus-within` on the input's pill wrapper, a global `*:focus` style buried in the cascade, or a Cloudflare/browser-extension overlay. Devtools inspection is the next action.
- **Cross-tag relocation semantics:** `tags` is now strictly filter-only; `crossPostTo` is the section relocator. Two separate axes — but the user's mental model when typing a tag like `creation-1` was relocation, not filtering. Worth a UX revisit if cross-posting becomes the norm. For now: when you want a file to appear under another section, you write `crossPostTo: ['collections/creation-1']`; when you want it filterable but stay in its folder, you write `tags: ['creation-1']`.
- **Photoshoot dedupe.** Plan agreed in conversation, not executed. Pre-req: confirm nothing in `apps/styleguide/src/**` directly references `/brand/shop/<filename>` paths — i.e., the styleguide's shop folder is gallery-only, no other consumer. The website's Printful mockups live in `apps/website/public/brand/shop/pod/`, separate from styleguide's `public/brand/shop/`, so the live-site contract is unaffected.
- **`<input>` orphan in the codebase ⚠️:** The unused-but-still-present `Fragment` import was dropped from Acyr.jsx. No other orphan imports observed but worth a `pnpm lint` run before next push.
- **Backlog deltas this session:** 6d closed (Pass 2 + 3 verified live earlier). 19, 20, 21, 22 added. 9c (gallery zoom/lightbox + arrows + grid/list toggle) is now substantially shipped — could be closed or kept open if user wants full lightbox features (zoom-within-lightbox, swipe gestures). I left it open.
- **`/log-work` was just invoked** — this handoff was produced at the end.

## Next intended action

Open `/gallery` in DevTools, focus the search input expanded state, screenshot the Computed pane styles plus inheritance chain to identify the real source of the blue strokes. Then write the global form-element reset in `packages/ds/framework/framework.css` covering `input/select/textarea` for `border`, `outline`, `appearance`, `accent-color`, and `:focus`/`:focus-visible`/`:focus-within`. Closes backlog 19.

Alternative if user wants to keep moving on content rather than chrome: start the photoshoot dedupe — `grep -r "/brand/shop/" apps/styleguide/src/` first to confirm it's gallery-only, then batch the metadata entries for the photoshoot images that have known duplicates in creation-7 + shop, then delete the dup files.

## Working memory not yet in AGENT-CONTEXT

- `media-metadata.js` orphan tolerance is structural — `MEDIA_METADATA[f.src] ?? {}` silently skips missing-file keys. Worth a small audit helper later that warns at build time if `Object.keys(MEDIA_METADATA)` has entries with no matching file in the photoIndexPlugin output. Low priority.
- `ContentFilters` is shared across the website's `/shop` AND the styleguide Gallery. The vertical-stack filter panel change improves both. The collapsed-by-default behavior remains — user wanted to revisit "categories visible by default" but parked it as part of the "categories more discussion" item; deferred and never reopened this session.
- The `slugifyKey` helper in Gallery (`'collections / creation-1'` → `'collections--creation-1'`) is local — fine for now; promote if other consumers ever group on slashed keys.
- The lightbox's `key={entry.src}` on the media element is load-bearing — without it React reuses the same DOM node between slides and Safari sometimes freezes the previous video frame.
- The user's two `FAILFAILFAIL` interruptions today were both about text overload — keep responses tight, especially when answering "what" / "how" questions. The `/init-agent` skill's "answer the asked question, nothing else" memory is the relevant pattern.
- Gallery's `categoryValues` for the Category filter chips comes from `data.groups.map((g) => g.name)` — top-level folders only, NOT subcategories. So users get `collections, mood, photoshoot, shop, textures, video, yr` as chips, never `creation-1`. Subcategories surface only through tags or crossPostTo, never through filter chips. That's the right call (chip count would explode otherwise).
- The grid `minmax(200px, 1fr)` produces ~6 cols at 1300px viewport, ~7 at 1500px. If the user later wants strictly 8 cols, drop to ~160px min. They asked for "6 or 8", picked the middle.
