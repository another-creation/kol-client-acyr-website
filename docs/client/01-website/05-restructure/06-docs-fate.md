---
title: Docs fate — what survives, evolves, supersedes
type: audit
status: active
related:
  - "[[01-website/05-restructure/INDEX|restructure-index]]"
  - "[[01-website/05-restructure/04-phases|phases]]"
companion_to: "[[01-website/05-restructure/04-phases|phases]]"
tags:
  - restructure
  - docs
  - classification
created: 2026-05-17
---

# Docs fate — catalog with restructure classifications

Every doc in `docs/client/`, `docs/llm-context/`, `docs/archive/`, and root `docs/*.md` classified by what happens to it during the restructure. Source: docs-survey research agent, 2026-05-17.

## Classifications

- **LOAD-BEARING** — survives verbatim. Procedure-or-decision content where the file paths it mentions are incidental, not central.
- **EVOLVE** — content stays valuable but needs substantial rewrite to reflect the new shape. Anything that names today's folder layout falls here.
- **SUPERSEDE** — fully replaced by this restructure-docs folder. Move to `docs/archive/` in Phase 4.
- **ARCHIVE** — already superseded by current state; move to `docs/archive/` in Phase 4.
- **UNTOUCHED** — orthogonal to restructure. Don't touch.

## Catalog

### LOAD-BEARING (17 files)

Operational playbooks. The procedure is the value. File paths they mention are surface details that update naturally.

| Path | Lines | Purpose |
|---|---:|---|
| `docs/client/paypal/paypal-handoff.md` | 139 | PayPal Multi-User Access ownership pattern |
| `docs/client/paypal/paypal-printful-integration.md` | 199 | PayPal Smart Buttons + Printful runbook |
| `docs/client/domain/domain-email-handoff.md` | 115 | Cloudflare + Proton ownership-swap playbook |
| `docs/client/domain/proton-custom-domain.md` | 87 | Proton Mail Plus custom-domain setup recap |
| `docs/client/sanity/sanity-handoff.md` | 140 | Sanity project + Studio + tokens transfer |
| `docs/client/records/proton-records-bind.md` | 18 | BIND zone snippet for Proton DNS |
| `docs/client/metadata/metadata.md` | 372 | Edge-injection metadata plan + three-pass roadmap |
| `docs/client/metadata/playbook.md` | 310 | SEO + analytics operations playbook |
| `docs/client/metadata/og-images.md` | 151 | OG image asset inventory |
| `docs/client/metadata/routes.md` | 108 | Per-route metadata copy reference |
| `docs/client/metadata/crawler-blocked-on-root-route.md` | 321 | Pass 1 incident log (filesystem routing) |
| `docs/client/brand/writing-guidelines.md` | 94 | Voice manifesto |
| `docs/client/brand/writing-examples.md` | 231 | Ten worked prose pieces |
| `docs/client/brand/contact-and-identity.md` | 84 | Mirror of `info.js` |
| `docs/client/brand/career-and-press.md` | 179 | Mirror of `business-data.js` |
| `docs/client/brand/branded-assets.md` | 101 | Mirror of `branded-assets.js` |
| `docs/history.md` | 114 | Decision history archive |

### EVOLVE (8 files)

Need surgery during/after the restructure. Path references update; concepts may need rewriting.

| Path | Lines | Why it evolves |
|---|---:|---|
| `docs/llm-context/ARCHITECTURE.md` | 110 | §1 (two-name discipline) gets replaced with AC DS single-system. §4 (CSS cascade) updates with new file paths. §7 gains a "no KOL upstream extraction" closing rule. |
| `docs/llm-context/AGENT-CONTEXT.md` | 301 | "Key files and their roles" table — every row's path updates. "Critical consistency seams" — file paths update. "Contracts" — paths update. |
| `docs/llm-context/README.md` | 43 | Index references update. Carries template versioning frontmatter — coordinate with template author per `/init-repo-sync`. |
| `docs/backlog.md` | 90 | Item 11 (CSS library reorg) becomes the restructure backlog. Some sub-items get replaced by phase-level checkboxes. |
| `docs/backlog-notes.md` | 75 | Anchored notes for item 11 expand to point at this restructure folder. |
| `docs/client/sanity/sanity-playbook.md` | 411 | The 2026-05-16 "Docs restructure" entry at the bottom is obsoleted by this restructure. Repo-layout discussion (§"Repo layout — `/studio` subfolder, not a real monorepo") gets a follow-up note: "→ migrated to pnpm workspace in 2026-05-17 restructure." |
| `docs/client/setup/setup-overview.md` | 207 | Teaches the current sibling-projects shape. Replication runbook needs to teach the new shape post-Phase-3. |
| `docs/client/setup/setup-playbook.md` | 1008 | The 1008-line replication runbook. Step-by-step instructions need to update for `apps/` + `packages/` shape. Largest "EVOLVE" cost in the doc set. |
| `docs/client/repo/client-repo.md` | 112 | Branching model + Vercel preview workflow. Vercel project Root Directory references update. |

### SUPERSEDE (5 files)

The prior styleguide-fold-in research. Documented the sibling-project shape we're now undoing. Move to `docs/archive/` in Phase 4.

| Path | Lines | Original purpose |
|---|---:|---|
| `docs/client/styleguide/01-kol-ds-inventory.md` | 238 | KOL DS inventory at fold-in time |
| `docs/client/styleguide/02-ac-brand-inventory.md` | 142 | `src/brand/` drift between styleguide repo + website repo |
| `docs/client/styleguide/03-styleguide-surface.md` | 232 | Styleguide-only surface inventory pre-fold-in |
| `docs/client/styleguide/04-live-site-component-inventory.md` | 265 | Live site component inventory post-extraction |
| `docs/client/styleguide/05-merge-plan.md` | 384 | Runbook proposing the sibling-project fold-in (now being undone) |

Each gets a header note when moved: *"Historical research from styleguide fold-in (2026-05-16). Superseded by repo-restructure (2026-05-17)."*

### ARCHIVE (4 files)

Already superseded. Some live in `docs/archive/` already; one needs to move there.

| Path | Lines | Why archived |
|---|---:|---|
| `docs/client/brand/styleguide-text-rewrite.md` | 216 | Voice exercise prose got promoted into `writing-examples.md`. Move to `docs/archive/` in Phase 4. |
| `docs/archive/sanity-implementation.md` | 248 | Already archived. Original Sanity plan, executed and superseded by `sanity-playbook.md`. |
| `docs/archive/styleguide-text.md` | 185 | Already archived. Raw scrape of legacy chapter text, pre-voice rewrite. |
| `docs/archive/writing-guidelines-agent.md` | 167 | Already archived. Earlier agent-reference voice guidelines, superseded by `writing-guidelines.md` + `writing-examples.md`. |

### UNTOUCHED (23 files)

Append-only history. Touching them rewrites history.

| Path | Type |
|---|---|
| `docs/llm-context/session-bridge/README.md` | Protocol doc |
| `docs/llm-context/session-bridge/handoff-2026-05-16-0003-protocol-test.md` | Handoff |
| `docs/llm-context/session-bridge/handoff-2026-05-16-0008-session-bridge-protocol.md` | Handoff |
| `docs/llm-context/session-bridge/handoff-2026-05-16-0305-custom-domain-and-proton-email-live.md` | Handoff |
| `docs/llm-context/session-bridge/handoff-2026-05-16-0323-init-repo-sync-and-template-versioning.md` | Handoff |
| `docs/llm-context/session-bridge/handoff-2026-05-16-1747-styleguide-foldin-and-brand-surface.md` | Handoff |
| `docs/llm-context/session-bridge/handoff-2026-05-17-0040-metadata-pass-1-shipped.md` | Handoff |
| `docs/llm-context/session-bridge/handoff-2026-05-17-0255-newsletter-mailerlite-wired.md` | Handoff |
| `docs/llm-context/session-log/2026-05-15-bootstrap-agent-context.md` | Session log |
| `docs/llm-context/session-log/2026-05-15-pivot-to-paypal-direct.md` | Session log |
| `docs/llm-context/session-log/2026-05-15-sandbox-pipeline-verified.md` | Session log |
| `docs/llm-context/session-log/2026-05-15-live-pipeline-verified-handoff-docs.md` | Session log |
| `docs/llm-context/session-log/2026-05-16-custom-domain-and-proton-email-live.md` | Session log |
| `docs/llm-context/session-log/2026-05-16-init-repo-sync-and-template-versioning.md` | Session log |
| `docs/llm-context/session-log/2026-05-16-init-repo-sync-first-run.md` | Session log |
| `docs/llm-context/session-log/2026-05-16-sanity-cms-and-docs-restructure.md` | Session log |
| `docs/llm-context/session-log/2026-05-16-session-bridge-protocol.md` | Session log |
| `docs/llm-context/session-log/2026-05-16-session-bridge-validated-and-propagated.md` | Session log |
| `docs/llm-context/session-log/2026-05-16-styleguide-foldin-and-brand-surface.md` | Session log |
| `docs/llm-context/session-log/2026-05-17-metadata-pass-1-shipped.md` | Session log |
| `docs/llm-context/session-log/2026-05-17-newsletter-mailerlite-wired.md` | Session log |

## Cross-links to call out in the new docs

Five files the restructure docs should explicitly reference:

1. **`docs/llm-context/ARCHITECTURE.md`** — §1 is the exact decision being revisited; §4 is the cascade contract the new shape preserves. [[01-website/05-restructure/01-decisions|decisions]] D1 already cites this.
2. **`docs/llm-context/AGENT-CONTEXT.md`** — "Key files and their roles" table + "Contracts" section is the migration map. [[01-website/05-restructure/03-target-state|target-state]] section "Contracts that survive verbatim" inherits from here.
3. **`docs/client/styleguide/05-merge-plan.md`** — the prior restructure plan. Worth a cross-link as "previous restructure for context" so future agents can see the trail.
4. **`docs/client/setup/setup-playbook.md`** — replication runbook spec. The restructure docs declare upfront that this playbook gets rewritten in Phase 4 to teach the new shape.
5. **`docs/client/sanity/sanity-playbook.md`** — the "Docs restructure" precedent entry at the bottom established the docs-folder convention. The new restructure extends those rules rather than reinventing.

## Phase 4 doc work

Summary of doc-related work in [[01-website/05-restructure/04-phases|phases]] Phase 4:

1. Update ARCHITECTURE.md sections §1, §4, §7.
2. Update AGENT-CONTEXT.md "Key files", "Critical consistency seams", "Contracts" sections.
3. Update backlog.md items 11 + sub-items (some flip to ✅).
4. Update backlog-notes.md anchors for items affected.
5. Update sanity-playbook.md — append a 2026-05-17 entry noting the repo restructure and the new shape.
6. Update setup-overview.md + setup-playbook.md to teach the new shape (may defer if engagement-pressure on other deliverables).
7. Update client-repo.md branching/Vercel sections with new project Root Directories.
8. Move 5 SUPERSEDE styleguide research docs to `docs/archive/` with header notes.
9. Move `docs/client/brand/styleguide-text-rewrite.md` to `docs/archive/`.
10. Update `docs/llm-context/README.md` if any cross-references break.

Estimated effort: 0.5 day if done all in one pass. Can spread across multiple sessions if Phase 4 is staged.
