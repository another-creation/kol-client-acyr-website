# Session: Repo restructure research + Phase 1 (DS collapse + KOL → AC DS rename)

**Date:** 2026-05-17
**Agent:** Grim (Claude Opus 4.7, 1M context)
**Summary:** Promoted backlog item 11 from "CSS library reorg" to a full repo restructure. Spent the first half in research mode with four parallel agents (repo inventory, cross-app dependency graph, CSS tier audit, docs survey) and synthesized findings into a 7-doc plan at `docs/client/kol-client-acyr/01-website/05-restructure/`. Locked five architectural decisions (KOL → AC DS collapse, apps/+packages workspace shape, phased migration, target-not-journey docs, studio untouched). Executed Phase 1 end-to-end on a `phase-1-ds-collapse` branch: 11 CSS file moves into `src/ds/`, surgical split of `kol-framework.css` (DS-canon vs styleguide design-foundations) and `kol-brand-typography.css` (brand tokens vs helper utilities), `kol-` → `ac-` rename across CSS classes + CSS custom properties + 163 JSX/JS consumers, removal of the JSX side-door for brand-typography, plus the TikTok social handle addition. 173 files / +3604 / −3613, both Vite builds green, lint baseline unchanged, shipped to `origin/phase-1-ds-collapse` (commit `3a8eaa0`). Branch awaiting PR to main after tomorrow's meeting.

## Changes Made

### Restructure planning docs (new — `docs/client/kol-client-acyr/01-website/05-restructure/`)
- `README.md` — index, principles, status table
- `decisions.md` — D1 (KOL → AC DS), D2 (apps + packages over flat src/), D3 (phased migration), D4 (target-not-journey docs), D5 (studio untouched) + 3 open questions resolved in target-state
- `current-state.md` — inventory snapshot frozen 2026-05-17 (120 cross-app boundary points, 14 CSS files / 5,391 lines, 10 shared deps, 57 docs)
- `target-state.md` — destination shape: `apps/{website,studio,styleguide}` + `packages/{ds,brand-data}` + top-level `assets/` + workspace package definitions
- `phases.md` — 4 PRs, each with prereqs, acceptance criteria, blast radius, rollback. Phase 1 detailed line-by-line
- `css-audit.md` — line-level classification of all 14 CSS files (DS-canon vs Brand vs Site-chrome) including the `kol-framework.css` line-range split map
- `docs-fate.md` — 57-doc catalog with LOAD-BEARING / EVOLVE / SUPERSEDE / ARCHIVE / UNTOUCHED classifications

### Phase 1 execution (commit `3a8eaa0` on branch `phase-1-ds-collapse`)
- **File moves into `src/ds/`** — 11 CSS files: theme, color, opacity, typography, typography-mono, utilities, atoms, molecules, organisms, brand-color (`git mv`, history preserved)
- **`kol-framework.css` split** — `~500` lines DS-canon → `src/ds/framework/framework.css` (page scaffold, sidenav layout, overlay, embla base, brand-logo + logomark, exit-preview, portal-footer, back-link, codeblock, data-reveal); `~700` lines styleguide design-foundations → `styleguide/src/styles/design-foundations.css` (combo lab, spectrum grid, mood tile, asset card, type sample, color anatomy, accordion, etc.). Original deleted via `git rm`. Note: had to fix one orphaned brace (`.ac-prose-pullout` block) caught by brace-balance check before build went green.
- **`kol-brand-typography.css` split** — `@font-face` Right Grotesk Mono + `--ac-font-family-mono` override → `src/ds/tokens/brand-typography.css`; `.ac-helper-{s,xs,xxs}` + `.ac-mono-text` utilities → `src/ds/utilities/typography-helpers.css`. Original deleted via `git rm`.
- **`kol-site.css` rename** — `git mv` to `src/styles/site.css`. 100% website site-chrome; no migration to DS.
- **`src/ds/index.css`** — new canonical cascade entry. 13 imports in load-bearing order (tokens → brand → utilities → components → framework).
- **JSX side-door removed** — `src/components/site/SiteLayout.jsx` no longer JSX-imports `kol-brand-typography.css`. Cascade now resolves through `src/ds/index.css`.
- **`src/index.css`** — collapsed to 3 lines: `tailwindcss`, `./ds/index.css`, `./styles/site.css`.
- **`styleguide/src/index.css`** — rewired to import `../../src/ds/index.css` + local `./styles/design-foundations.css`.
- **Bulk `kol-` → `ac-` rename** — applied to:
  - CSS files: `--kol-` → `--ac-` (var defs + refs) and `\.kol-` → `\.ac-` (class selectors)
  - JSX/JS files (~163 files in `src/`, `styleguide/src/`, `api/`): className strings, inline-style `var(--kol-*)` refs, Tailwind arbitrary-value selectors (`[&_.kol-foo]`), styleguide data files (`{cls: '.ac-sans-display-01', ...}`)
  - Two passes: first for general patterns, second for `\.kol-` patterns in arbitrary contexts (Tailwind selectors, comments, data strings)
- **Theme.css simplified** — dropped the inline umbrella @imports (they pointed at the old kol-X.css filenames inside theme.css's own folder); umbrella role now lives canonically in `src/ds/index.css` only.
- **Documented residue (out of Phase 1 scope, deferred to Phase 4):**
  - Styleguide editor-internal CSS imports: `kol-editor.css`, `kol-typography-fonts-full.css` (these files still exist with their old names; editor cleanup is Phase 4 territory)
  - DnD MIME identifier `application/x-kol-library` (internal custom format, no rename benefit)
  - SVG fragment IDs in `SpectrumControls.jsx` (`#kol-wheel-*`) — internal IDs
  - 4 dead doc-path comments referencing `docs/kol-migration/...` (path from another repo, dead anyway)

### Backlog + tracking docs
- `docs/backlog.md` item 11 — promoted from "CSS library reorg" placeholder to "Repo restructure — apps + packages + AC DS" with 5 phase sub-items. Phase 0 (research) ✅; Phases 1–4 pending. Phase 1 actually done in this session but the backlog item still shows ▢ until merged to main.
- `docs/backlog.md` item 10 — TikTok ✅ (`@yr_another_creation`).
- `docs/llm-context/AGENT-CONTEXT.md` — added the repo restructure to "What's pending" + gated newsletter design rework (8j) on Phase 1.

### Social addition (one-off)
- TikTok handle `@yr_another_creation` added in three places: `src/brand/data/business-data.js` SOCIAL array, `src/components/site/Footer.jsx` SOCIAL array, `docs/backlog.md` item 10 ✅.

## Current State

### Working
- **Phase 1 committed + pushed to `phase-1-ds-collapse`.** Vercel preview building at `kol-client-acyr-website-git-phase-daeead-tor-grimssons-projects.vercel.app`.
- **Both production builds green.** `pnpm build` (website) succeeded; `cd styleguide && pnpm build` succeeded. Lint shows the pre-existing 389-error baseline — no new errors introduced.
- **CSS cascade preserved.** `src/ds/index.css` declares the same load order ARCHITECTURE §4 documented (tokens → brand → utilities → components → framework). Brace balance verified on all moved + split files.
- **`main` is clean.** Phase 1 lives only on the branch. Branch awaits PR after tomorrow's meeting.
- **Architecture decisions documented + locked.** Five Ds in `docs/client/kol-client-acyr/01-website/05-restructure/decisions.md`. Future agents reference these instead of re-litigating.

### Known Issues / Deferred
- **Phase 1 not yet merged to main.** Intentional — user wants safety until after tomorrow's meeting.
- **Phases 2–4 pending.** Plan documented in `docs/client/kol-client-acyr/01-website/05-restructure/phases.md`. Each phase its own PR. No timeline locked.
- **Newsletter follow-ups still open** (parked from earlier today):
  - 8d — custom tracking domain `clicks.another-creation.xyz` (gated on MailerLite domain finishing verification)
  - 8g — sender swap `dev@` → `hello@` (same gate)
  - 8h — client list handover (next-days work)
  - 8i — `.xyz` deliverability watch
  - 8j — newsletter design rework (now gated on Phase 1 merge so it can author against the AC DS, not the old kol-* tier)
- **Editor-internal CSS files** (`styleguide/src/editor/styles/kol-editor.css`, `styleguide/src/editor/styles/kol-typography-fonts-full.css`) still carry the `kol-` prefix. Out of Phase 1 scope; Phase 4 cleanup.
- **ARCHITECTURE.md + AGENT-CONTEXT.md still describe the old shape** — §1 (two-name discipline) and §4 (CSS cascade) reference the pre-Phase-1 layout. Phase 4 doc work.
- **Lint baseline at 389 errors** — pre-existing, not introduced by this session. Unrelated to commerce or restructure work.

## Next Steps
1. **Tomorrow's meeting first.** No PR merge until after.
2. **Open PR `phase-1-ds-collapse` → `main`** post-meeting once smoke tests pass on the Vercel preview. Visual regression check on the obvious pages (home / shop / handmade / brand / press / cart / checkout / footer).
3. **Resume newsletter follow-ups** (8d, 8g) once MailerLite domain finishes auto-verification.
4. **Newsletter design rework (8j)** — unblocked after Phase 1 merge; redesign home card + footer strip against the AC DS now that it's findable.
5. **Phase 2 (apps + packages split)** — gated on Phase 1 merge + a clear window of feature-light time. Plan in `phases.md`.
