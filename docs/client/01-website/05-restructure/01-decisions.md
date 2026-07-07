---
title: Architectural decisions — restructure
type: decisions
status: canonical
related:
  - "[[01-website/05-restructure/INDEX|restructure-index]]"
  - "[[01-website/05-restructure/03-target-state|target-state]]"
  - "[[01-website/05-restructure/04-phases|phases]]"
companion_to: "[[01-website/05-restructure/INDEX|restructure-index]]"
# external ref dropped — pointed to `../../llm-context/ARCHITECTURE` outside this docs vault
tags:
  - restructure
  - decisions
  - ac-ds
created: 2026-05-17
---

# Architectural decisions — restructure

The structural choices already locked in for this restructure. Each one was argued through. Revisiting any of them means revisiting the case, not the implementation.

---

## D1. KOL → AC DS (collapse the upstream-DS fiction)

**Decision:** Rename the `kol-*` prefix and accompanying cascade to **AC DS** (Another Creation Design System). Single named system, no separate KOL upstream tier.

**Why:**

The two-name discipline in `../../llm-context/ARCHITECTURE` (outside vault) §1 was set up to keep KOL extractable later as a reusable design system. The escape hatch was always "extract KOL into a separate package when a second consumer appears." Months in, no second consumer exists. No `@kol/styles` lives anywhere. No client repo waits to import "the KOL system." Meanwhile, every change is *for AC*, the brand-rebind cascade is a layer of indirection that costs cognitive overhead, file names lie about their tier (`kol-framework.css` is partly DS canon, partly site chrome), and agents waste cycles asking "is this DS or brand?" when the practical answer is "AC, there is no other."

A namespace without a real consumer is theater. Collapsing it means tokens are named for what they are, files live in one tier, and the mental model matches reality.

If a second client ever appears and the case for a reusable upstream becomes real, that extraction is done from concrete AC DS, not from a fictional KOL we maintained on speculation. **You only know what's truly shared once you have two things to share between.**

**Implications:**
- The `kol-` prefix in CSS classes and file names becomes `ac-` or drops entirely.
- The brand-rebind layer (`kol-brand-color.css`, `kol-brand-typography.css`) merges into AC DS as the system's color + typography tier, no separate "brand override" cascade step.
- ARCHITECTURE §1 ("Two-name discipline") gets rewritten in the AGENT-CONTEXT pass after Phase 1.
- The `BRAND.name` single-source contract is unchanged. Brand display name lives in `src/brand/config.js` → moves to `packages/brand-data/config.js` in Phase 2.

**Counter-positions considered:**
- *"Keep KOL extractable so a future client repo can fork it cleanly."* Rejected: the cost of maintaining a fictional upstream is paid every day; the benefit only materializes if a second client appears, which it hasn't.
- *"Just rename `kol-` → `ds-` instead of `ac-`."* Considered. Could work. Picked `ac-` because the system *is* the AC system — no pretense of generality. Easy to revisit if we extract later.

---

## D2. `apps/` + `packages/` over flat `src/`

**Decision:** Adopt the pnpm workspace layout with explicit `apps/` and `packages/` top-level folders.

```
apps/
  website/        # the current root, including src/, api/, public/
  studio/         # the current studio/ (Sanity)
  styleguide/     # the current styleguide/ (brand book + editor)
packages/
  ds/             # AC Design System: tokens, atoms, molecules, organisms, framework primitives
  brand-data/     # BRAND_INFO, SOCIAL, business-data, etc. (read at runtime by multiple apps)
```

**Why:**

Three apps already exist. They deploy as three separate Vercel projects with separate Root Directory settings. They have separate `package.json` files and separate Vite bundles. That separation is *real*, not incidental — and the folder layout should reflect it.

The instinct to flatten everything under `src/` (the brainstorm version: `src/editor/`, `src/styleguide/`, `src/website/` as siblings) collapses an app boundary that's enforced at the build layer. You can't share a single `src/` tree across three Vite bundles without either (a) shipping one giant bundle that contains the editor + styleguide + ecommerce site on every page load, or (b) reintroducing the app boundary in a config file — strictly worse than the current shape, because configs lie and folders don't.

The correct unification is at the **package** level, not the **app** level. Apps deploy separately, so they live separately. Packages are the unification layer for code that's actually shared across apps.

**Implications:**
- Root `package.json` becomes a workspace root (no app code, just scripts + workspace declaration).
- Vercel project Root Directories update: `kol-client-acyr-website` → `apps/website`, `kol-client-acyr-studio` → `apps/studio`, `kol-client-acyr-styleguide` → `apps/styleguide`.
- The `Install Command: cd .. && pnpm install` workaround on the styleguide Vercel project goes away — pnpm workspaces install everything at the root.
- The `scripts/verify-versions.mjs` CI guard against shared-dep drift goes away — workspaces hoist shared deps automatically.
- The styleguide → root cross-imports (111 import sites via `@brand` and `@components` aliases) become real package imports from `packages/ds` and `packages/brand-data`.
- The `public/{brand,fonts}` symlinks become a shared `packages/assets/` (or remain as symlinks targeting a single canonical location — TBD in [[01-website/05-restructure/03-target-state|target-state]]).

**Counter-positions considered:**
- *"Flat `src/` with apps as feature folders (user's first brainstorm)."* Rejected — collapses app boundary that's enforced at build layer. Argued in detail `../../../README#one-argument-where-you-re-wrong` (outside vault).
- *"Stay sibling-projects, just clean up the names."* Rejected — keeps every workaround in place. The fold-in research docs ([[99-archive/styleguide-research/05-merge-plan|merge-plan (archived)]]) explicitly chose the sibling shape, and we're now choosing against that based on six months of actual experience with it.

---

## D3. Phased migration, each phase is a PR

**Decision:** Four phases, each its own PR, each reversible. Feature work resumes between phases.

| Phase | Scope | Reversibility | Feature freeze? |
|---|---|---|---|
| 1 — DS collapse + rename | Move and rename CSS files within current shape. Fix the JSX side-door bug. No workspace yet. | High (single PR revert) | No |
| 2 — Apps + packages split | Move root → `apps/website`, `studio/` → `apps/studio`, `styleguide/` → `apps/styleguide`. Extract `packages/ds`, `packages/brand-data`. Update aliases + symlinks. | Medium (single PR revert; CI must verify all three Vercel projects build) | Brief, during the cutover |
| 3 — Workspace enablement | `pnpm-workspace.yaml` + dep hoisting + retire `scripts/verify-versions.mjs` + update Vercel Install Commands. | Medium-Low (workspace topology change) | No, but install behavior changes |
| 4 — Cleanup + naming hygiene | Drop residual `kol-` prefixes in places where the rename didn't reach. Audit framework-vs-site-chrome boundary in styleguide app. | High | No |

**Why:**

Big-bang means freezing newsletter design, metadata Pass 2/3, real shipping rates, possible live cutover work — all the in-flight client deliverables — for as long as the rip takes. A week minimum. That's an unacceptable freeze.

Phased means a half-state for a few days at each phase boundary, but no freeze. Each phase has its own PR with its own acceptance criteria, and the repo is fully functional between phases. If we discover a problem in Phase 2 mid-execution, we revert to the Phase 1 endpoint and feature work continues.

**Implications:**
- Each phase produces a working repo. Vercel deploys keep flowing. Production never goes dark.
- Phase 1 doesn't touch `apps/` — files stay where they are, just collapsed into one DS folder under `src/ds/`. Lets us verify the collapse independently of the workspace move.
- Phase 2 is the highest-risk PR. Cross-app imports (111 of them via aliases) all redirect at once. Acceptance criteria includes all three Vercel projects building green.
- Phase 3 changes install behavior. Vercel project settings need to update in lockstep with the PR merge.

**Counter-positions considered:**
- *"Big-bang on a branch, ship when ready."* Rejected — too long a branch life; feature work has to live somewhere in the meantime. Either it rebases against a moving target (painful) or it queues up (freeze).
- *"Smaller phases (8 instead of 4)."* Rejected at planning level — finer-grained phases mostly just split Phase 2 into smaller bites, but Phase 2 is *load-bearingly* one atomic change (every cross-app import has to redirect together). Splitting it further doesn't help.

---

## D4. Document the target, not the journey

**Decision:** All restructure documentation describes the **destination** shape and the migration plan. Git is the journey log. No per-move logs, no chronicle agents.

**Why:**

Documentation that narrates "what changed today" decays into noise. Git already logs every commit, every diff, every move. Adding a parallel chronicle creates two sources of truth that drift apart, and the chronicle is the one that loses, because the code is the truth and the doc isn't.

The discipline that *does* pay off is keeping the target docs accurate as the work happens. If the plan changes mid-Phase-2 because we discover an unforeseen constraint, the target doc gets updated — not appended-to. The README, target-state, phases docs describe the system that exists *or is about to exist*, present tense. They never describe "what we used to do" except in a discrete "history" section where that matters.

**Implications:**
- This `docs/client/repo-restructure/` folder is the canonical reference during and after the migration.
- The existing session-log + handoff pattern (`docs/llm-context/session-log/`, `docs/llm-context/session-bridge/`) continues unchanged — one human-readable note per session, never per-move.
- No "moves.log" file. No "what-changed-this-week" doc. No parallel agents writing logs.
- The migration is logged in git commit messages with clear scope ("phase-1: collapse kol-* into src/ds/", etc).

---

## D5. Studio is untouched

**Decision:** `studio/` moves to `apps/studio/` in Phase 2 as a path change only. Its internal structure stays identical. It does not consume any `packages/`.

**Why:**

The dependency graph audit confirmed zero cross-imports between `studio/` and the rest of the repo. Studio reads no code from root, no code from styleguide. Sanity Studio has its own UI system; it has no use for AC DS components or brand-data exports. Touching its internals would be pure churn.

The only studio change in Phase 2 is the Vercel project Root Directory: `studio/` → `apps/studio/`. The `studio/static/favicon.svg` symlink updates to point at the new canonical asset location (TBD per [[01-website/05-restructure/03-target-state|target-state]]).

**Implications:**
- Studio is the easiest app in the migration. Move the folder, update the Vercel setting, done.
- Studio's `package.json` stays independent — it doesn't share React versions with root + styleguide (it's pinned to whatever Sanity packages need). Worth excluding from the workspace's shared-dep hoisting.

---

## Open questions (not yet decisions)

These are flagged for the planning phase, not locked.

- **Q1.** Symlinks vs real `packages/assets/`? The 305MB `public/brand/` directory and 17MB `public/fonts/` are currently symlinked from styleguide into root's `public/`. Options: (a) keep symlinks targeting `apps/website/public/`, (b) extract to a `packages/assets/` with symlinks from each consumer app, (c) extract to `assets/` at repo root (not a package, just a folder) with symlinks. Each has trade-offs. Decided in [[01-website/05-restructure/03-target-state|target-state]].
- **Q2.** Single AC DS package, or split into `packages/ds-tokens` + `packages/ds-components`? The CSS audit showed 8 leaf token files + 3 component-layer files. Could split. Probably overkill for now; defer until there's a reason. Decided in [[01-website/05-restructure/03-target-state|target-state]].
- **Q3.** What happens to the `~700 lines of design-foundations UI` currently in `kol-framework.css`? The CSS audit identified that combo-lab, spectrum-grid, asset-card, mood-tile, type-sample sections are styleguide-app-specific. They need to migrate out of the DS package into `apps/styleguide/src/styles/`. Decision in [[01-website/05-restructure/05-css-audit|css-audit]] + [[01-website/05-restructure/04-phases|phases]].
