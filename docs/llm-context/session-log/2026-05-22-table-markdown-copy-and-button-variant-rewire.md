# Session: Table markdown-copy + Button primary/secondary rewire

**Date:** 2026-05-22
**Agent:** Grim (Claude Opus 4.7, 1M context)
**Summary:** Closed backlog 3c (table copy → markdown) and 3a (button variant adjustment). Tables now write GFM markdown to clipboard on ⌘C. Button primary + secondary rewired to mirror each other on raw greys — symmetric "always-dark" / "always-light" pair, theme-invariant.

## Changes Made

### Files modified

- **`apps/website/src/components/organisms/Table.jsx`** — wired up `copy` event listener on `document` that intercepts cell selection inside the table wrapper and rewrites `clipboardData` as GitHub-flavored markdown: `| h1 | h2 |\n| --- | --- |\n| c1 | c2 |`. `<code>` / `<kbd>` content wraps in backticks; `<a>` becomes `[text](href)`. `text/html` cleared so paste-into-Notion/Slack/etc. uses the plain-text markdown rather than the styled HTML table. Initially edited the styleguide-local Table.jsx by mistake (drift duplicate exists); the website's copy via `@components` alias is the canonical consumer for the styleguide pages, so the fix moved there.
- **`apps/styleguide/src/components/organisms/Table.jsx`** — same copy-as-markdown wiring (duplicate of website's; consumed by `AssetTable.jsx` + `TypeScaleSection.jsx` via relative-path import). Both copies now carry the same behavior. Drift heads-up flagged but not consolidated this session.
- **`packages/ds/components/atoms.css`** — `.ac-btn-primary` rewired from `surface-secondary` fill / `surface-on-primary` text (theme-aware, subtle chrome) to `--grey-900` fill / `--grey-100` text / `--grey-500` hover. Now always-dark, theme-invariant, font-weight 500 (matched to secondary). `.ac-btn-secondary` hover bumped from `--grey-250` → `--grey-300` to mirror primary's 4-stop ramp lift on hover. Docstring block updated to reflect the new symmetric model.
- **`apps/website/src/components/site/Newsletter.jsx`** — signup button variant flipped `secondary` → `primary` to render the dark CTA against the forced-light Newsletter card.
- **`docs/backlog.md`** — 3a (Button variant adjustment) and 3c (Table copy syntax) marked ✅ with detail lines. Earlier in the session also confirmed 2b / 2c / 5a were already closed in quick-view but stale `▢` in the full list — synced.

### Behavior changes

- Selecting cells in any `<Table>` and pressing ⌘C now writes a markdown table to the clipboard. Header row + separator + selected body rows. Inline `<code>` and `<kbd>` preserved as backticked spans. Anchor links emitted as `[text](href)`. Both website's `<Table>` and styleguide's (twin) carry the behavior.
- `.ac-btn-primary` no longer rebinds under theme — it's now a static-dark button across light + dark pages. Symmetric to secondary (static-light). The variant tier reads as:
  - **primary** = always-dark (grey-900 / grey-100), font-weight 500
  - **secondary** = always-light (grey-100 / grey-900), font-weight 500
  - **accent** = theme-aware brand CTA (burgundy by default)
  - **outline** = bordered, transparent bg

## Current State

### Working

- Table markdown copy verified end-to-end by the user: selected the Routes table on `/reference`, pasted, got clean GFM with backticked paths + linked page names.
- Newsletter signup button rendering as expected — dark fill on light card.

### Known issues / heads-up items

- **Site-wide primary-button impact not visually verified.** The variant was previously theme-flipping subtle chrome; every existing `.ac-btn-primary` consumer is now solid-dark in light-mode and won't flip in dark-mode. Expect noticeable popping anywhere primary was being used as "daily chrome." Sweep next.
- **Table.jsx duplication still live.** `apps/website/src/components/organisms/Table.jsx` and `apps/styleguide/src/components/organisms/Table.jsx` are now identical twins. Styleguide pages reach across to the website's via `@components` alias, but `AssetTable.jsx` and `TypeScaleSection.jsx` still import the styleguide-local copy via relative path. Drift waiting to happen. Consolidation deferred.
- **`<EditorButton>` is NOT the canonical `<Button>` atom.** It's a separate atom in `apps/styleguide/src/editor/components/` that happens to map `variant="ghost"` → `.ac-btn-ghost`. Counted twice during the ghost-variant audit before realizing the distinction. True count of `<Button variant="ghost">` consumers = zero (Demo.jsx is showcase, not a real surface).

### Out of scope (intentionally)

- Site-wide primary-button visual sweep — flagged as next-up by user.
- Table.jsx duplicate consolidation — pre-existing drift, not bundled.

## Next Steps

1. **Site-wide primary-button sweep.** Walk every consumer of `<Button variant="primary">` (or implicit primary — it's the default) and confirm the new always-dark fill works visually in each context. User asked for screenshots as the most efficient way to communicate findings.
2. **Decide on Table.jsx consolidation.** Delete the styleguide-local copy, repoint `AssetTable` + `TypeScaleSection` at `@components/organisms/Table`. Pre-existing drift, separate item.
3. **Backlog 3b** (Icon audit — inline SVG → Icon loader) or **3d** (Newsletter design rework) next, depending on energy.
