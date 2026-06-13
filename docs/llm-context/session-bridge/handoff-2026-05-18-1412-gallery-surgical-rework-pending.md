# Handoff — 2026-05-18 14:12

## Goal of the current arc

Surgical Gallery rework — apply the user's three asks (lightbox+arrows, grid/list view toggle, *maybe* search) to `apps/styleguide/src/pages/Gallery.jsx` WITHOUT rewriting the page structure. The first attempt earlier today was a redesign that dropped the original sticky header summary line, the right-side group jump-nav, and the per-group `<h2>` + count sections — fully reverted. Next attempt is surgical: lightbox + grid/list ONLY, keep everything else.

## Last actions taken (causal trail, newest first)

- Backlog restructure (mid-session): item 9 renamed from "Gallery" to "Styleguide polish"; gallery sub-items kept, added 9e (padding/margin drift, pre-existing) + 9f (text-selection highlight quirks, moved from 5j). Removed 5j from item 5 Polish.
- Full revert of `apps/styleguide/src/pages/Gallery.jsx` — original 201-line file restored byte-for-byte from my context. The reverted version has: sticky header with title + summary line ("N items (M video) · K groups") + right-side group jump-nav, per-group `<section>` with `<h2>` + count, grid of 160px-min square thumbnails with `aspect-ratio: 1` + `objectFit: cover`, click-to-focus expands in-grid to 3×3 with `objectFit: contain`. Esc unfocuses. Cmd/Ctrl/Shift/middle-click opens raw asset in new tab.
- User flagged the rewrite as an unrequested redesign immediately on visual inspection. The rewrite had bundled in `ContentFilters` (`@components/molecules/ContentFilters`) which restructured the header chrome, replaced per-group sections with a single flat filtered list, dropped the jump-nav, dropped the inline count summary.
- Built styleguide green on the rewrite (3.03s) — the bug was scope, not functionality.
- The rewrite plan: ContentFilters wrapping flat-list + FullscreenOverlay lightbox + arrow keys + on-screen prev/next + grid/list view toggle via ContentFilters' built-in `viewModeOptions`. Filtered list captured in a ref (not state) to avoid render loop. Arrow nav looked up `overlaySrc` index in `filteredRef.current` at keypress time so navigation respected the active filters. All this is in git history of this file if needed for reference; not reapply blindly.
- Re-added `dev-server` script to root `package.json`: `pnpm --parallel --filter website --filter studio --filter styleguide dev`. Lost in the Phase 2 root rewrite. Boots all three (website 5173, studio 3333, styleguide 5174) in parallel.
- Backlog item-9 audit + flips (full list in session log). Highlights: 7e ✅ (Vercel Ignored Build Step applied by user via UI, paste-ready commands in `backlog-notes.md#7e` refreshed for post-Phase-2 paths), 1e ✅ (code clean, only PayPal Dev UI verification remains), 4 ✅ (FLAT_SHIPPING_EUR retired — real Printful rates already live), 3 🚧 (gated on real Printful store), 2f 🚧 (gated on client Sanity engagement), 8g 🚧 (gated on MailerLite verification per its own description), 8i 🚧 (time-gated 30 days). 8d / 8h / 9d left ▢ as borderline — user judgment call.

## Current state / open decision points

- **Gallery on disk = original** (pre-rewrite). Working tree is clean for that file (modifications from the rewrite are gone). Other working-tree changes from this session: `docs/backlog.md` flips, `docs/backlog-notes.md#7e` refresh, root `package.json` `dev-server` addition. All uncommitted.
- **The surgical Gallery rework hasn't been started.** Original layout intact, awaiting the targeted lightbox + grid/list additions.
- **User's three asks for the gallery, in priority order:**
  1. Replace in-grid expansion with FullscreenOverlay lightbox + prev/next arrows + ArrowLeft/ArrowRight keyboard nav. REPLACE the click behavior, don't add a second one.
  2. Grid/list toggle in the header (small addition; not via ContentFilters).
  3. ContentFilters search — user said "maybe" which means "exploration prompt, not approval." DO NOT integrate without explicit go-ahead.
- **Constraints from the over-scope feedback:**
  - Keep the original sticky header (title + summary line + group jump-nav).
  - Keep per-group sections with `<h2>` + count.
  - Keep `#0b0b0b` dark background.
  - Keep Cmd/Ctrl/Shift/middle-click escape hatch for raw asset.
  - Don't rewrite the file. Modify the existing 201-line structure surgically.

## Next intended action

- **First task next session:** ask user to confirm the surgical scope before touching the file. State: "I'll modify the existing Gallery.jsx to (1) replace in-grid expand with FullscreenOverlay + prev/next + arrow keys, (2) add a small grid/list toggle in the header. Nothing else changes. Sound good?" — wait for "go" before editing.
- **For (1) lightbox:** add state `const [overlaySrc, setOverlaySrc] = useState(null)`. Wrap with `FullscreenOverlay` from `@components/primitives/FullscreenOverlay`. Inside `children`, render `<img>` or `<video>` based on `currentItem.type` + on-screen left/right buttons (`position: absolute, left/right: -8, top: 50%`). Arrow-key effect with `ArrowLeft`/`ArrowRight` handlers, looking up neighbors in a flat list of all media (across all groups, NOT just current group — flat navigation). Replace `onThumbClick`'s `setFocused` with `setOverlaySrc(src)`. Remove the in-grid `gridColumn: span 3` + `gridRow: span 3` + `objectFit` toggle.
- **For (2) grid/list toggle:** add `const [viewMode, setViewMode] = useState('grid')`. In header, after the existing nav, add a small toggle (two text spans "Grid" / "List", clickable, styled with opacity). For `list` mode: render each group's `g.files` as a flat row layout (64px thumb + filename + group label + type badge) instead of the 160px-min grid. Keep per-group `<section>` + `<h2>` structure intact. Toggle just swaps the inner layout, not the outer chrome.
- **Total estimated diff:** ~60-90 lines added/changed on top of the existing 201. Single file.

## Working memory not yet in AGENT-CONTEXT

- **The over-scope lesson from this session:** "maybe utilise X component" from a user is an exploration prompt, not a green light. Treat as a question to revisit, not a feature to implement. Same goes for "I think instead of Y" — that's a direction signal for ONE change, not authorization for a broader rewrite of related chrome.
- **Per-group structure is load-bearing UX in the gallery.** The right-side jump nav lets users navigate to specific brand-asset folders (photoshoot, mood, yr, collections, etc.). The per-section `<h2>` + count is a content hierarchy signal. Both vanish in a flat-list approach. Lightbox + view toggle can coexist with the per-group structure (lightbox just opens on top; view toggle swaps the inner layout per section).
- **The ContentFilters component IS the right answer eventually** for the gallery if the brand library grows to the point that group jump-nav becomes unwieldy. But not now, and not by my unilateral decision.
- **Vercel Ignored Build Step commands** for reference (also in `backlog-notes.md#7e`):
  - Website: `git diff --quiet HEAD^ HEAD -- apps/website packages assets pnpm-lock.yaml pnpm-workspace.yaml`
  - Studio: `git diff --quiet HEAD^ HEAD -- apps/studio assets pnpm-lock.yaml pnpm-workspace.yaml`
  - Styleguide: `git diff --quiet HEAD^ HEAD -- apps/styleguide apps/website/src/components apps/website/src/data packages assets pnpm-lock.yaml pnpm-workspace.yaml`
- **Item 5 sub-letters are no longer sequential** after 5j moved to 9f. Now `e, i, k, l, m, n` after the existing `a, b, c, d, f, g, h`. Cosmetic re-lettering deferred — user can request if it bothers.
- **`dev-server` script choice** uses `--parallel --filter` instead of recursive `-r`. Explicit is better here because packages/* don't have `dev` scripts and we don't want pnpm warning about missing scripts.
- **Backlog item 13 + 14 were added by the user** mid-session (Client overview doc + Copy / scan website copy "star trek ipsum"). Item 14 is a content-audit task — scan live site for placeholder/lorem-ipsum-style copy. Don't auto-action; pick up when user explicitly asks.
- **Newsletter pipeline status remains contradictory** — line 53 "verification green" vs user's "verification failed" + the 8g/8i gating. Anyone picking up newsletter MUST reconcile by checking MailerLite UI before doing redesign or other newsletter work.
