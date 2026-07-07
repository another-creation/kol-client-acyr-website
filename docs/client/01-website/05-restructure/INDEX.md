---
title: Repo restructure — apps + packages + AC DS
type: index
status: active
updated: 2026-05-17
created: 2026-05-17
description: Planning + execution surface for the pnpm workspace migration and KOL → AC DS rename. Read decisions first; everything else flows from there.
audience: agency-internal
tags:
  - project/acyr
  - domain/restructure
  - domain/workspace
related:
  - "[[01-website/05-restructure/01-decisions|decisions]]"
  - "[[01-website/05-restructure/02-current-state|current-state]]"
  - "[[01-website/05-restructure/03-target-state|target-state]]"
  - "[[01-website/05-restructure/04-phases|phases]]"
  - "[[01-website/05-restructure/05-css-audit|css-audit]]"
  - "[[01-website/05-restructure/06-docs-fate|docs-fate]]"
# companion_to: removed — pointed to `../../llm-context/ARCHITECTURE` outside this docs vault
---

# Repo restructure — index

This folder is the planning + execution surface for the move from "three sibling apps in one repo with alias/symlink workarounds" → "pnpm workspace with `apps/` + `packages/` and a single named design system (AC DS, no KOL upstream fiction)."

Research-only as of 2026-05-17. No code has moved yet.

## Why this exists

The repo grew into a near-monorepo without the supporting structure. Three apps (`website`, `studio`, `styleguide`), shared brand assets, cross-app code imports — but stitched together with Vite aliases pointing into a sibling folder, filesystem symlinks for assets, an `Install Command: cd .. && pnpm install` hack on the styleguide's Vercel project, and a `scripts/verify-versions.mjs` CI guard to police shared-dep drift across two `package.json` files. Each of those is a workaround for the absence of a real workspace.

In parallel, the design-system naming (`kol-*` everywhere, with a brand-rebind cascade) was set up to keep the door open for KOL → AC DS extraction later. The door has been open for months. Nothing's walked through. Meanwhile every agent that opens the repo has to ask "is this DS-tier or brand-tier?" — when the answer in practice is "AC, because there is no other consumer." The cascade discipline costs cognitive overhead without earning the optionality it was designed for.

Both problems compound at the file layout: `kol-framework.css` carries DS primitives and design-foundations documentation UI in the same 1,211-line file. `kol-site.css` carries 1,111 lines of marketing-site chrome under a `kol-` prefix that pretends it's DS canon. The styleguide imports `@brand` and `@components` from a sibling folder via Vite alias rather than from a real package import.

This restructure addresses both at once: collapse the KOL → AC DS fiction (one named system, single tier model), and extract the actually-shared code into real workspace packages.

## Documents

- **[[01-website/05-restructure/01-decisions|decisions]]** — the architectural decisions already locked in (KOL → AC DS rename, apps + packages over flat `src/`, phased over big-bang, target-not-journey docs). Read this first; everything else flows from these.
- **[[01-website/05-restructure/02-current-state|current-state]]** — inventory snapshot: file counts, deps, Vercel configs, cross-app boundary points (111 import sites + 4 CSS @imports + 3 symlinks + 2 API imports = 120 total). Synthesized from research agents.
- **[[01-website/05-restructure/03-target-state|target-state]]** — the destination shape: `apps/{website,studio,styleguide}` + `packages/{ds,brand-data}`. What lives where, why, and what's *not* getting a package (and why not).
- **[[01-website/05-restructure/04-phases|phases]]** — phased migration plan. 4 phases, each its own PR, each reversible, feature work resumes between phases. Prerequisites, acceptance criteria, blast radius, rollback per phase.
- **[[01-website/05-restructure/05-css-audit|css-audit]]** — line-level classification of the 14 CSS files (DS-canon vs Brand vs Site-chrome). The map for Phase 1's file moves: which rule blocks stay in the DS package, which migrate to consumer code.
- **[[01-website/05-restructure/06-docs-fate|docs-fate]]** — every existing doc in `docs/client/*` + `docs/llm-context/*` classified as LOAD-BEARING / EVOLVE / SUPERSEDE / ARCHIVE / UNTOUCHED. The 5 SUPERSEDE docs are the prior styleguide-fold-in research, now obsolete because of this restructure.

## Principles

- **Folder boundary > config boundary.** Apps live in `apps/`, packages live in `packages/`. No app-as-config-flag.
- **One named system.** AC DS, not KOL-with-AC-paint. The two-name discipline (ARCHITECTURE §1) gets collapsed in this restructure. If a second client ever needs an extracted package, that's done from concrete AC DS, not from a fictional upstream.
- **Phased, not big-bang.** Each phase is a PR. Feature work (newsletter design, metadata Pass 2/3, real shipping rates) resumes between phases. Half-state is acceptable for a few days; freeze is not.
- **Document the target, not the journey.** Git is the journey log. These docs describe the destination shape and the migration plan, not "what I moved today."
- **Studio is untouched.** Zero cross-imports today; will live cleanly in `apps/studio/` post-move. No internal restructure.
- **Cascade order is preserved.** ARCHITECTURE §4's CSS import order is load-bearing. The new shape inherits it under the AC DS package name.

## Status

- **Phase 0 — Research + plan**: ✅ This folder.
- **Phase 1 — DS collapse + rename**: ▢ Pending green light.
- **Phase 2 — Apps + packages split**: ▢ Gated on Phase 1.
- **Phase 3 — Workspace enablement**: ▢ Gated on Phase 2.
- **Phase 4 — Cleanup + naming hygiene**: ▢ Gated on Phase 3.

See [[01-website/05-restructure/04-phases|phases]] for detail.
