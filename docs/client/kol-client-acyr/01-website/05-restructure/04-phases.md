---
title: Phases — migration plan
type: plan
status: draft
related:
  - "[[01-website/05-restructure/INDEX|restructure-index]]"
  - "[[01-website/05-restructure/01-decisions|decisions]]"
  - "[[01-website/05-restructure/02-current-state|current-state]]"
  - "[[01-website/05-restructure/03-target-state|target-state]]"
  - "[[01-website/05-restructure/05-css-audit|css-audit]]"
companion_to: "[[01-website/05-restructure/03-target-state|target-state]]"
tags:
  - restructure
  - migration
  - phases
created: 2026-05-17
---

# Migration phases

Four phases. Each its own PR. Each reversible. Feature work resumes between phases.

| Phase | Title | PR scope | Acceptance | Reversibility | Estimated effort |
|---|---|---|---|---|---|
| 1 | DS collapse + rename | Collapse `kol-*` into `src/ds/`, rename to `ac-*`, fix the JSX side-door, separate site-chrome from framework | Vercel builds green on all three projects; visual diff acceptable | High (single revert) | 0.5–1 day |
| 2 | Apps + packages split | Move folders to `apps/`, extract `packages/ds` + `packages/brand-data`, redirect aliases to package imports, extract `assets/` and symlink | All three Vercel projects build green; all three live URLs functional | Medium (single revert; multiple Vercel project settings update in lockstep) | 1–2 days |
| 3 | Workspace enablement | `pnpm-workspace.yaml`, dep hoisting, retire `verify-versions.mjs`, update Vercel Install Commands | `pnpm install` at root works; all three apps build; no duplicate React versions in any bundle | Medium-Low (install topology change) | 0.5 day |
| 4 | Cleanup + naming hygiene | Drop residual `kol-` prefixes, audit framework-vs-site-chrome boundary inside styleguide, retire dead data files (`blog-data.js`, `collections-data.js`), update ARCHITECTURE + AGENT-CONTEXT | All docs reflect new shape | High | 0.5 day |

Total: 2.5–4 days of focused work spread across however many sessions. Feature work continues between phases.

---

## Phase 1 — DS collapse + rename

**Goal:** Single DS folder at `src/ds/`, all `kol-*` prefixes renamed to `ac-*`, JSX side-door fixed, site-chrome separated from framework. **No workspace yet. No file moves cross-app.** Pure reorganization within the current `src/` shape.

### Prerequisites
- Newsletter branch merged or parked. No mid-flight CSS edits expected during the rename.
- Working knowledge of which CSS rules are DS-canon vs site-chrome (see [[01-website/05-restructure/05-css-audit|css-audit]]).

### Steps

1. **Create `src/ds/` skeleton.**
   ```
   src/ds/
   ├── tokens/
   ├── utilities/
   ├── components/
   ├── framework/
   └── index.css
   ```

2. **Move files into `src/ds/` and rename.**
   | From | To |
   |---|---|
   | `src/styles/kol-theme.css` | `src/ds/tokens/theme.css` |
   | `src/styles/kol-color.css` | `src/ds/tokens/color.css` |
   | `src/styles/kol-opacity.css` | `src/ds/tokens/opacity.css` |
   | `src/styles/kol-typography.css` | `src/ds/tokens/typography.css` |
   | `src/styles/kol-typography-mono.css` | `src/ds/tokens/typography-mono.css` |
   | `src/brand/kol-brand-color.css` | `src/ds/tokens/brand-color.css` |
   | `src/brand/kol-brand-typography.css` | `src/ds/tokens/brand-typography.css` |
   | `src/styles/kol-utilities.css` | `src/ds/utilities/utilities.css` |
   | `src/styles/kol-components-atoms.css` | `src/ds/components/atoms.css` |
   | `src/styles/kol-components-molecules.css` | `src/ds/components/molecules.css` |
   | `src/styles/kol-components-organisms.css` | `src/ds/components/organisms.css` |
   | `src/components/framework/kol-framework.css` (DS-canon portion only, ~500 lines) | `src/ds/framework/framework.css` |
   | `src/styles/kol-site.css` | stays put, renamed → `src/styles/site.css` |
   | `src/components/framework/kol-framework.css` (site-chrome portion, ~700 lines) | merged into `src/styles/site-design-foundations.css` (new file) |

3. **Rewrite `src/index.css` to consume `src/ds/index.css`.**
   ```css
   @import "tailwindcss";
   @import "./ds/index.css";
   @import "./styles/site.css";
   @import "./styles/site-design-foundations.css"; /* if needed by website; otherwise styleguide-only and lives there */
   ```

4. **Write `src/ds/index.css` with the canonical cascade.**
   ```css
   @import "./tokens/theme.css";
   @import "./tokens/color.css";
   @import "./tokens/opacity.css";
   @import "./tokens/typography.css";
   @import "./tokens/typography-mono.css";
   @import "./tokens/brand-color.css";
   @import "./tokens/brand-typography.css";  /* fixes the JSX side-door bug */
   @import "./utilities/utilities.css";
   @import "./components/atoms.css";
   @import "./components/molecules.css";
   @import "./components/organisms.css";
   @import "./framework/framework.css";
   ```

5. **Remove the JSX side-door.** Delete `import '../../brand/kol-brand-typography.css'` from `src/components/site/SiteLayout.jsx`. The file is now in the cascade.

6. **Rename CSS class prefix `kol-` → `ac-` everywhere it lives in the DS files.** Global find-replace within `src/ds/`. Then update consumers:
   - `src/components/**` JSX `className="kol-..."` → `className="ac-..."`
   - `src/pages/**` same
   - `src/styles/site.css` and `src/styles/site-design-foundations.css` may reference `.kol-*` classes from the DS — update to `.ac-*`.

7. **Update the `styleguide/src/index.css` @imports** that reach into root's CSS — they currently import `kol-theme.css`, `kol-brand-color.css`, `kol-framework.css` from `../../src/`. Redirect to the new `src/ds/index.css` (single entry point). Also remove the dead reach into `kol-framework.css`'s site-chrome portion that's now in `src/styles/site-design-foundations.css` (or copy that file into styleguide's local styles — see step 8).

8. **Decide what `site-design-foundations.css` belongs to.** Two valid answers:
   - If the website itself doesn't use these styles (combo-lab, spectrum-grid, mood-tile are styleguide-app patterns), the file lives only in styleguide's local styles (`styleguide/src/styles/design-foundations.css`) and doesn't need to live in the website at all. Cleaner.
   - If the website's `/brand` page reuses any of them, the file lives in `src/styles/` and both apps consume it.

   **Pick: styleguide-only.** Audit confirms the website's `/brand` page is its own thing (`src/pages/site/Brand.jsx`) and doesn't reuse the design-foundations UI patterns. Move `site-design-foundations.css` content directly into `styleguide/src/styles/design-foundations.css` and skip placing it in the website at all.

9. **Lint, build, smoke-test.** `pnpm build` should produce a clean bundle. Visually diff `pnpm dev` against main: no theme regressions, no missing styles, no flash-of-unstyled-anything.

10. **Update `docs/llm-context/ARCHITECTURE.md` §4** to point at `src/ds/index.css` as the canonical cascade.

11. **Commit + push branch `phase-1-ds-collapse`. PR. Merge after Vercel previews green on all three projects.**

### Acceptance criteria
- All three Vercel projects build green.
- `pnpm dev` (root) loads without console errors.
- Visual smoke test of website pages: home, shop, handmade, journal, collections, brand, press, cart, checkout — all render identically to pre-PR.
- Visual smoke test of styleguide pages: same.
- `kol-` prefix appears nowhere in `src/ds/` files.
- `src/components/site/SiteLayout.jsx` no longer imports `kol-brand-typography.css` directly.
- `src/styles/site-design-foundations.css` doesn't exist (or has only website-relevant content).

### Blast radius
- Every CSS file moves or gets renamed.
- Every JSX `className` referencing `kol-*` updates.
- Styleguide's index.css imports update.

### Rollback
- `git revert <phase-1-merge-sha>`. Single PR; everything moves together.

### Risks
- **Stale `kol-*` references in components** — Tailwind utilities still work (those are unchanged); only literal `className="kol-..."` strings need updating. A grep for `kol-` post-edit catches stragglers.
- **CSS specificity drift** — moving a rule from `kol-framework.css` to `site-design-foundations.css` changes the cascade position. Test pages that use those rules.
- **Cascade ordering** — `brand-typography.css` was previously loaded via JSX after every other CSS; now loads in the cascade. Verify no rules depend on the late-loading behavior.

---

## Phase 2 — Apps + packages split

**Goal:** Repository topology matches [[01-website/05-restructure/03-target-state|target-state]]. Apps live in `apps/`. Shared code lives in `packages/`. Shared assets live in `assets/`. All cross-app boundaries are real package imports, not aliases.

### Prerequisites
- Phase 1 merged and green.
- All three Vercel project settings prepared (Root Directory changes ready to apply post-merge).
- A feature-work freeze of ~half a day during the cutover.

### Steps

1. **Move apps.**
   ```
   git mv src apps/website/src
   git mv api apps/website/api
   git mv public apps/website/public
   git mv vite.config.js apps/website/vite.config.js
   git mv eslint.config.js apps/website/eslint.config.js
   git mv vercel.json apps/website/vercel.json
   git mv package.json apps/website/package.json
   git mv studio apps/studio
   git mv styleguide apps/styleguide
   ```

2. **Extract `packages/ds/`.**
   ```
   git mv apps/website/src/ds packages/ds
   ```
   Update `apps/website/src/index.css` import: `@import "../ds/index.css"` → `@import "@ac/ds/index.css"` (with `package.json` field `"main": "index.css"` or `"exports"` configured).

   Create `packages/ds/package.json`:
   ```json
   {
     "name": "@ac/ds",
     "private": true,
     "version": "0.0.0",
     "exports": {
       ".": "./index.css",
       "./atoms": "./components/jsx/atoms/index.js",
       "./molecules": "./components/jsx/molecules/index.js",
       "./framework": "./components/jsx/framework/index.js"
     }
   }
   ```

3. **Extract `packages/brand-data/`.**
   ```
   git mv apps/website/src/brand/config.js packages/brand-data/config.js
   git mv apps/website/src/brand/data/info.js packages/brand-data/info.js
   git mv apps/website/src/brand/data/business-data.js packages/brand-data/business-data.js
   git mv apps/website/src/brand/data/images.js packages/brand-data/images.js
   git mv apps/website/src/brand/data/branded-assets.js packages/brand-data/branded-assets.js
   git mv apps/website/src/brand/data/placeholder-logos.jsx packages/brand-data/placeholder-logos.jsx
   ```

   Keep in website: `apps/website/src/data/seo-metadata.js`, `apps/website/src/data/printful-products.json`, `apps/website/src/data/shop-data.js`.

   Create `packages/brand-data/package.json`:
   ```json
   {
     "name": "@ac/brand-data",
     "private": true,
     "version": "0.0.0",
     "exports": {
       ".": "./index.js"
     }
   }
   ```

4. **Update consumer imports.**
   - `apps/website/src/**` — anything that imported `'../../brand/data/info'` etc updates to `'@ac/brand-data'`. The DS is consumed via the index.css; runtime JS components (if any are extracted) import from `@ac/ds/atoms` etc.
   - `apps/styleguide/src/**` — `@brand` alias maps to `@ac/brand-data`, `@components` alias maps to `@ac/ds/components/jsx`. (Or kill the aliases entirely and migrate the import strings to package imports. Decided: kill the aliases.)
   - `apps/website/api/**` — `'../../src/brand/data/printful-products.json'` becomes `'../src/data/printful-products.json'` (the data stays in the website, but the path shortens because `src/` is now under `apps/website/`).

5. **Extract `assets/` and re-symlink.**
   ```
   mkdir assets
   git mv apps/website/public/brand assets/brand
   git mv apps/website/public/fonts assets/fonts
   git mv apps/website/public/favicon.svg assets/favicon.svg
   ln -s ../../../assets/brand apps/website/public/brand
   ln -s ../../../assets/fonts apps/website/public/fonts
   ln -s ../../../assets/favicon.svg apps/website/public/favicon.svg
   ln -s ../../../assets/brand apps/styleguide/public/brand
   ln -s ../../../assets/fonts apps/styleguide/public/fonts
   ln -s ../../../assets/favicon.svg apps/styleguide/public/favicon.svg
   ln -s ../../../assets/favicon.svg apps/studio/static/favicon.svg
   ```

6. **Update Vite configs.**
   - `apps/website/vite.config.js` — unchanged content; path changes are absolute resolution from the new app root.
   - `apps/styleguide/vite.config.js` — remove `@brand`/`@components` aliases. Remove `fs.allow: ['..']` (no longer needed; package imports don't reach out). `photoIndexPlugin` config update: `photosDir: 'public/brand'` still resolves correctly via symlink.

7. **Update Vercel project Root Directories.**
   - `kol-client-acyr-website`: `.` → `apps/website`
   - `kol-client-acyr-studio`: `studio` → `apps/studio`
   - `kol-client-acyr-styleguide`: `styleguide` → `apps/styleguide`

8. **Update `scripts/` references.**
   - `scripts/sync-printful.mjs` — outputs to `apps/website/src/data/printful-products.json`. Update path.
   - `scripts/migrate-sanity.mjs` — repo-wide, stays at root.
   - `scripts/test-meta.sh` — path-aware. Verify no hardcoded `dist/` paths break.
   - `scripts/verify-versions.mjs` — stays for now (Phase 3 removes).

9. **Commit + push branch `phase-2-apps-packages`. PR. Merge after manual verification that all three previews build AND function.**

### Acceptance criteria
- All three Vercel projects build green at their new Root Directories.
- `another-creation.xyz` loads correctly. Submits cart-to-PayPal correctly. Newsletter form submits.
- `studio.another-creation.xyz` loads, Sanity Studio renders.
- `brand.another-creation.xyz` loads behind Cloudflare Access; styleguide renders.
- No 404s on any asset (brand images, fonts, favicons load from the symlinked `assets/`).
- Grep returns no remaining `@brand/` or `@components/` alias imports.

### Blast radius
- Every file in the repo moves.
- Every cross-app import statement updates.
- Three Vercel project settings change.
- 6 symlinks created.

### Rollback
- `git revert <phase-2-merge-sha>`.
- Revert Vercel Root Directory changes manually (Settings → General).

### Risks
- **Vercel Root Directory update timing.** The merge brings the new folder structure; the Vercel setting must update before redeploy. Mitigation: pause auto-deploys before the merge, update settings, then unpause.
- **API endpoint paths.** `vercel.json` rewrite `/api/metadata-proxy` is relative to the app root; should "just work" once Vercel sees `apps/website/api/` as the function folder. Verify on preview before merge.
- **Sanity Studio URL registration.** Studio URLs (`studio.another-creation.xyz` + `*.vercel.app` fallback) are registered with the Sanity project. Move shouldn't break them; if the build deploys to a different path, re-register.

---

## Phase 3 — Workspace enablement

**Goal:** pnpm workspace is active. Dependencies hoist. The version-drift CI guard goes away. Install commands simplify.

### Prerequisites
- Phase 2 merged and green.
- All three Vercel deploys green with their new Root Directories.

### Steps

1. **Create `pnpm-workspace.yaml` at repo root.**
   ```yaml
   packages:
     - "apps/*"
     - "packages/*"

   onlyBuiltDependencies:
     - esbuild
   ```

2. **Update `package.json` files.**
   - Root: convert to workspace root. Move all `dependencies` and `devDependencies` out (they all belonged to the website app). Keep only scripts. Add `"workspaces": ["apps/*", "packages/*"]` if pnpm doesn't read it from `pnpm-workspace.yaml` alone.
   - `apps/website/package.json`: takes the deps that previously lived at root. Add `"@ac/ds": "workspace:*"`, `"@ac/brand-data": "workspace:*"`.
   - `apps/styleguide/package.json`: existing deps. Add `"@ac/ds": "workspace:*"`, `"@ac/brand-data": "workspace:*"`.
   - `apps/studio/package.json`: unchanged.
   - `packages/ds/package.json`, `packages/brand-data/package.json`: as written in Phase 2 step 2/3.

3. **Single root install.**
   ```
   rm -rf apps/*/node_modules studio/node_modules styleguide/node_modules
   rm pnpm-lock.yaml
   pnpm install
   ```

4. **Retire `scripts/verify-versions.mjs`.** Delete the script. Remove the `"verify-versions"` script from root `package.json`. Workspace resolves a single version per dep automatically.

5. **Update Vercel Install Command settings.**
   - Website: Use Vercel default (auto-detects pnpm workspace at root, runs `pnpm install`).
   - Studio: Same.
   - Styleguide: **Remove** the `cd .. && pnpm install` override. Use Vercel default.

6. **Update root scripts to use `pnpm --filter`.**
   ```json
   "scripts": {
     "dev:website": "pnpm --filter website dev",
     "build:website": "pnpm --filter website build",
     // etc.
   }
   ```

7. **Commit + push branch `phase-3-workspace`. PR. Merge after install + builds verified.**

### Acceptance criteria
- `pnpm install` at repo root succeeds without warnings about ignored builds.
- `pnpm --filter website dev` starts the website dev server.
- `pnpm --filter studio dev` starts Sanity Studio.
- `pnpm --filter styleguide dev` starts styleguide.
- All three Vercel projects build with the default Install Command.
- `node_modules` exists only at repo root (not inside any app folder).
- No `scripts/verify-versions.mjs`. No related CI step.

### Blast radius
- Install topology changes.
- `node_modules` location changes.
- Vercel Install Commands change.

### Rollback
- `git revert <phase-3-merge-sha>`.
- Re-add Vercel `Install Command: cd .. && pnpm install` override on styleguide.

### Risks
- **Sanity build under workspace.** Sanity's CLI has its own packaging assumptions. Verify `pnpm --filter studio build` produces the same `studio/dist/` (now `apps/studio/dist/`) that Vercel deploys. Sanity hoists differently than pure Vite; may need explicit `node-linker=hoisted` setting if isolated-mode hits a postinstall issue.
- **React version divergence.** Studio is on `react@19.2.4`; website + styleguide are on `19.2.5`. Workspace install will warn or de-dupe. May need `pnpm.overrides` to pin per-app, OR bump studio to 19.2.5 (cleanest).

---

## Phase 4 — Cleanup + naming hygiene

**Goal:** Catch what the earlier phases missed. Drop residual `kol-` prefixes. Audit the framework-vs-site-chrome boundary inside styleguide. Retire dead data files. Update documentation.

### Prerequisites
- Phase 3 merged and stable for at least 24 hours.

### Steps

1. **Grep for residual `kol-` references.**
   ```
   grep -rn "kol-" apps/ packages/ docs/llm-context/ARCHITECTURE.md
   ```
   Expected hits: comment headers in CSS files, AGENT-CONTEXT.md references. Update each in context.

2. **Audit the styleguide's local `design-foundations.css`** (the file we moved out of kol-framework.css). Make sure it's well-organized; split into logical sub-files if helpful (combo-lab.css, spectrum-grid.css, mood-tile.css).

3. **Retire dead data files.**
   - `apps/website/src/brand/data/blog-data.js` — superseded by Sanity. Confirm zero imports, delete.
   - `apps/website/src/brand/data/collections-data.js` — same. Confirm zero imports, delete.

4. **Update ARCHITECTURE.md** end-to-end. Walk every section, update paths and naming. Replace §1 with the new "AC Design System namespace" rule. Update §4 to point at `packages/ds/index.css`. Add §7 closing note: "No upstream KOL extraction unless a second client engagement appears."

5. **Update AGENT-CONTEXT.md** "Key files and their roles" table — every row that references `src/`, `studio/`, `styleguide/`, or `kol-*` updates to the new path/naming.

6. **Reclassify the SUPERSEDE docs** identified in [[01-website/05-restructure/06-docs-fate|docs-fate]]:
   - `docs/client/styleguide/01-kol-ds-inventory.md`
   - `docs/client/styleguide/02-ac-brand-inventory.md`
   - `docs/client/styleguide/03-styleguide-surface.md`
   - `docs/client/styleguide/04-live-site-component-inventory.md`
   - `docs/client/styleguide/05-merge-plan.md`

   Move each to `docs/archive/` with a one-line note at top: "Historical research from styleguide fold-in (2026-05-16). Superseded by repo-restructure (2026-05-17)."

7. **Reclassify the ARCHIVE doc** `docs/client/brand/styleguide-text-rewrite.md` to `docs/archive/` per [[01-website/05-restructure/06-docs-fate|docs-fate]].

8. **Update `setup-playbook.md` and `setup-overview.md`** to teach the new shape. The replication runbook becomes "monorepo with pnpm workspaces, apps + packages" rather than "sibling-projects with aliases + symlinks."

9. **Commit + push branch `phase-4-cleanup`. PR. Merge.**

### Acceptance criteria
- `grep -r "kol-" apps/ packages/` returns only legitimate (historical / contextual) references in comments.
- ARCHITECTURE.md describes the new shape; old §1 is rewritten.
- AGENT-CONTEXT.md "Key files" table reflects new paths.
- The 5 SUPERSEDE styleguide docs moved to `docs/archive/`.
- `apps/website/src/brand/data/` no longer contains `blog-data.js` or `collections-data.js`.

### Blast radius
- Documentation-heavy phase. Minimal code changes (only the dead file deletions).

### Rollback
- `git revert <phase-4-merge-sha>`. Low risk because most changes are docs.

---

## What happens between phases

- **Newsletter design rework (backlog 8j)** unblocks after Phase 1 — once `src/ds/` exists and `kol-` is `ac-`, redesign happens against a system that's actually findable.
- **Metadata Pass 2 (Sanity-driven dynamic routes)** can happen any time; not blocked by the restructure.
- **MailerLite custom tracking domain** (backlog 8d) is gated on MailerLite domain verification, not the restructure.
- **Real Printful shipping rates** (Phase 2 of commerce) — unblocked any time; touches `apps/website/api/_lib/shipping.mjs`.
- **`.xyz` deliverability watch** runs in calendar time, not blocked by anything.

The restructure is not on the critical path for any individual feature. It's the unblocker for *quality of design fixes* (8j onward) and the *handoff readiness* concern.

---

## Decision points within the migration

These are choices that come up during execution. Documented here so each phase's PR doesn't re-litigate them.

- **In Phase 1, what's the cutoff between "DS-canon" and "site-chrome" in `kol-framework.css`?** Documented line-by-line in [[01-website/05-restructure/05-css-audit|css-audit]]. Don't re-debate; follow the audit.
- **In Phase 2, do JSX components (atoms/molecules/organisms in `src/components/`) move into `packages/ds/components/jsx/`?** Not yet. Phase 2 moves CSS into `packages/ds/`; JSX component extraction is deferred to a later cleanup pass, after we see which components are actually shared across both apps in practice. Phase 2 scope is narrowly "make CSS a package; brand-data a package; keep JSX components in their current apps." This avoids opening 50+ files for migration that may be premature.
- **In Phase 3, do we pin React to 19.2.5 across all three apps to enable full hoisting?** Yes. Bump studio's React in the same PR. Sanity's React-DOM v19 compat range is wide; the patch bump is safe.
- **In Phase 4, do we update the `docs/client/setup/setup-playbook.md` immediately or defer?** Defer if engagement-pressure is on other deliverables. The playbook is a replication runbook; it has to be updated *eventually* but doesn't block daily work. Tag it as a follow-up if not done in Phase 4.
