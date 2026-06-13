# Session: docs reorg + newsletter restoration + skills rename + kol-docs framework promotion

**Date:** 2026-05-18
**Agent:** Grim (Claude Opus 4.7, 1M context)
**Summary:** Newsletter pipeline restored after Phase 2 file loss + MailerLite DNS auth + sender swap + checkout opt-in wiring + Ignored Build Step bug fix. Full docs/client/ cutover to the new framework-conformant layout. Skills renamed (init-repo → init-agent-context). kol-docs framework promoted into kol-system as a canonical package surface.

## Changes Made

### Newsletter — pipeline restored from spec (was lost in Phase 2)

- `apps/website/api/newsletter/subscribe.mjs` — new. POST endpoint, validates email, hits MailerLite Connect API `POST /api/subscribers` with `groups: [GROUP_ID]`, omits `status` so account-level double opt-in controls confirmation flow. 422 → 400, other failures → 502.
- `apps/website/src/components/site/Newsletter.jsx` — added idle/sending/success/error state machine + fetch wiring. Visuals preserved exactly (no design changes — 8j tracks that).
- `apps/website/src/components/site/FooterNewsletter.jsx` — new. Slim strip variant, same four-state machine, on-dark color tokens matching the existing footer typography (Right Grotesk Narrow body + Mono label).
- `apps/website/src/components/site/Footer.jsx` — imports + mounts `<FooterNewsletter />` above `ac-site-footer-grid`.
- `apps/website/src/pages/site/Checkout.jsx` — `onApprove` now fires `/api/newsletter/subscribe` fire-and-forget after PayPal capture succeeds, gated on the existing opt-in checkbox + email present. Failure cannot break order completion.

### MailerLite DNS — domain authentication

- Cloudflare CNAME `litesrv._domainkey` → `litesrv._domainkey.mlsend.com` (DNS only, gray cloud — DKIM CNAMEs must not proxy).
- Cloudflare TXT `@` → `mailerlite-domain-verification=fbdb26e027bd3256ccd69fac4bb14fb582b35858`.
- Sender swapped `dev@another-creation.xyz` → `hello@another-creation.xyz` in MailerLite UI (backlog 8g closed).
- First live test from `kolkrabbi@kolkrabbi.io` landed in **inbox** (not spam) — `.xyz` reputation worry effectively neutralized for this provider.
- Known residual: confirmation link routes through `*.clicks.mlsend.com` → uBlock Origin blocks it (Peter Lowe's list). Fix paths (custom tracking domain / disable click tracking) both gated on Paid plan. 8d flipped 🚧.

### Vercel Ignored Build Step — diff-base bug

- Original commands used `HEAD^ HEAD` as the diff base. Multi-commit pushes silently skipped builds when the latest commit was docs-only (the source commit's changes lived at `HEAD^^`, outside the diff window). Vercel marked the build "Canceled".
- Fix: `HEAD^` → `${VERCEL_GIT_PREVIOUS_SHA:-HEAD^}`. Spans every commit since the last successful deploy. Fallback handles the first-deploy case.
- Applied to all three Vercel projects (website, studio, styleguide).
- `docs/backlog-notes.md#7e` updated with the corrected commands and the reason for the change.

### Newsletter template doc (8f reframed)

- Original 8f was "AI-drafted issues via Claude." Reframed at user request to "ship a generic template the client can use as a starting structure."
- File: `docs/client/kol-client-acyr/02-brand/07-newsletter-template.md` (lives in the new tree post-cutover).
- Built on writing-examples #7 (*From the studio — February*) as the shape anchor. Editorial guardrails (length 180–280, no urgency, fixed reply-friendly close), placeholder-driven body, per-section notes, "what this template is not" list, worked June example in a fenced code block.

### docs/client cutover — full migration to framework-conformant layout

The user had previously prototyped a reworked docs layout at `docs/client-1/kol-client-acyr/` following the kol-docs framework conventions (numbered prefixes, INDEX-when-it-adds-signal, rich frontmatter, explicit-with-display wikilinks, tag taxonomy). This session swept the cutover end-to-end.

- **Link fixes** in `01-website/04-metadata/{02-operations,04-og-images}.md` — ~35 broken markdown links repaired. Sibling refs (`metadata.md`, `routes.md`, `og-images.md`, `playbook.md`) converted to wikilinks pointing at the renumbered files. Image asset paths corrected from `../../../public/og/*` (broken pre-rework; OG images live at `apps/website/public/og/` post-Phase-2-restructure) to absolute repo-relative paths.
- **Social section added** to `02-brand/01-contact-and-identity.md` — mirror of `packages/brand-data/business-data.js` `SOCIAL` array (Instagram primary, Instagram secondary, Facebook, LinkedIn, FilmFreeway). Note flags the future move of social handles from `business-data.js` into `info.js` (they're contact channels, not press artifacts) + `Footer.jsx` import refactor (currently hardcoded).
- **Newsletter template** moved from `docs/client/newsletter/template.md` (old tree) into `docs/client/kol-client-acyr/02-brand/07-newsletter-template.md`. Frontmatter rebuilt to framework conventions. Wikilinks updated to point at sibling brand docs.
- **4 archive stragglers migrated** from `docs/archive/` into the new `99-archive/`:
  - `sanity-implementation.md` → `99-archive/sanity-research/01-implementation-plan.md`
  - `styleguide-text.md` → `99-archive/brand-voice/01-styleguide-text.md`
  - `styleguide-text-rewrite.md` → `99-archive/brand-voice/02-styleguide-text-rewrite.md`
  - `writing-guidelines-agent.md` → `99-archive/brand-voice/03-writing-guidelines-agent.md`
- **`99-archive/INDEX.md`** extended to reference the two new subfolders.
- **External-referrer path sweep** — three sed passes across `AGENT-CONTEXT.md`, `backlog.md`, `backlog-notes.md`, every file in `session-log/` and `session-bridge/`. All `../client/<topic>/<file>.md` paths rewritten to `../client/kol-client-acyr/<pillar>/<section>/<numbered-file>.md` per the new tree. All `docs/archive/` rewritten to `docs/client/kol-client-acyr/99-archive/`.
- **Delete + rename:** `rm -rf docs/client/` (old flat layout) + `rm -rf docs/archive/` + `mv docs/client-1 docs/client`. Final state: `docs/client/kol-client-acyr/` is the canonical tree, `_framework/` is at `docs/_framework/`, old tree gone.
- **17 referenced paths verified** via post-rename existence check — all green.

### Skills rename + kol-docs framework promotion (cross-repo, in `~/.claude/skills/` + `kol-system/`)

- `~/.claude/skills/init-repo/` → `init-agent-context/`. Pairs semantically with `/init-agent`.
- `~/.claude/skills/init-repo-sync/` → `init-agent-context-sync/`.
- Inside `init-agent-context/templates/.claude/skills/`: `init/` → `init-agent/`. Bumps `_template.version` to 2.
- Both skill SKILL.md files rewritten to:
  - Reference the new names everywhere.
  - Reference `kol-system/packages/kol-docs/src/_framework/` as the framework source.
  - Add a step to `cp -R` the framework into the target's `docs/_framework/` at scaffold time.
- **`kol-docs/src/_framework/`** added inside `packages/kol-docs/` (framework was first authored as a sibling `kol-docs-framework` package, then merged into kol-docs at user direction — single package = single import surface). Four spec files + `_example/` reference docs folder.
- **`kol-docs/package.json`** bumped to 0.1.0, gained description + `exports` surface (`./framework`, `./framework/conventions`, etc.) for path-stable addressing.
- **`kol-docs/README.md`** rewritten — dual-surface explanation (DS reference + framework), consumer-skill table, updated tree.
- **`kol-docs/src/{00-system…05-icons}/00-index.md` → `INDEX.md`** in all 6 subfolders (framework convention).
- **kol-docs frontmatter normalized** across all 19 files via a Python script: `date:` → `updated:`, `version:` dropped, `type:` archetype-mapped, `tags:` converted to list form with `project/kol-docs` + `domain/<area>` namespaces.
- **`kol-docs/src/00-system/01-writing-guidelines.md`** slimmed — stripped the sections covered by the framework (frontmatter, file/folder naming, status, versioning, content types, cross-references, migration, checklist); kept voice/tone, heading hierarchy, title format, language rules, code examples, lists/tables; opens with explicit framework pointer.
- **`init-scaffold/SKILL.md`** updated to `rm -rf docs/documentation/_framework` after the kol-docs copy — strips the framework so it doesn't land at the wrong consumer path. Description's `/init-repo` reference updated.
- **`kol-docs/src/00-system/02-imports.md`** updated to call out the `_framework/` exclusion.

### kol-system root metadata

- `kol-system/package.json` — new, name `kol-system`, version 0.1.0, private.
- `kol-system/README.md` — new. Overview, 9-package table with consumer-skill mapping, future plans section (git repo for cross-machine sync as #1 priority, formal pnpm workspace, writing-guidelines reconciliation watch, log-work-to-global).
- `kol-system/CHANGELOG.md` — new, Keep a Changelog format, `[0.1.0] 2026-05-18` entry captures the full session's churn at the kol-system level.

### Social channels — backlog 10 reconciliation

- Added **TikTok** (`@yr_another_creation`) and **X** (`@xYrx`, Ýr's secondary) to `packages/brand-data/business-data.js` `SOCIAL` array. Resolves the drift noted in this session's "known issues" — backlog 10 had marked TikTok as added but the JS data only had LinkedIn through that line; X was a new addition prompted by the user mid-handoff.
- Mirrored both additions into `docs/client/kol-client-acyr/02-brand/01-contact-and-identity.md` (Social table) and `docs/client/kol-client-acyr/02-brand/02-career-and-press.md` (Social table). Three surfaces now in sync.
- `Footer.jsx` still hardcodes its own `SOCIAL` list (Instagram, Facebook, LinkedIn) — not yet imported from `business-data.js`. Drift surface; deferred to the same future-pass that moves socials into `info.js`.

### Backlog status changes (`docs/backlog.md`)

- **8a ✅** Provider choice
- **8b ✅** Footer strip + home card + endpoint
- **8c ✅** Checkout opt-in wired
- **8d 🚧** Custom tracking domain / disable click tracking — gated on Paid plan
- **8e ✅** Closed N/A (no self-sent transactional mail)
- **8f ✅** Newsletter template doc shipped
- **8g ✅** Sender swap
- **8i 🚧** `.xyz` deliverability watch — still 30-day window, but first send already inbox
- **8j ▢** Design rework — only newsletter work left, now actionable
- **6d** routes/playbook paths updated to new tree
- **11** repo-restructure plan link updated to new tree

## Current State

### Working

- Newsletter end-to-end: home card + footer strip + checkout opt-in all fire `/api/newsletter/subscribe`. MailerLite domain Authenticated. Confirmation lands inbox.
- All 17 AGENT-CONTEXT-referenced paths exist post-cutover.
- 3 Vercel projects deploying cleanly with the corrected Ignored Build Step command.
- `docs/client/kol-client-acyr/` conforms to the kol-docs framework. `docs/_framework/` holds the spec (copy of canonical at kol-system).
- kol-system has root identity (package.json + README + CHANGELOG). kol-docs ships dual surface (DS ref + framework).

### Known Issues / Deferred

- **8j Design rework** — both newsletter surfaces still visually off-base. Now unblocked (AC DS stable, pipeline restored). Only newsletter work left.
- **uBlock blocks the confirmation link** for adblock-using subscribers (clicks.mlsend.com on Peter Lowe's blocklist). Workaround: subscribers can click "Proceed" through the warning. Real fix gated on Paid plan (8d).
- **kol-system isn't under git** — user has 2 active machines, drift accumulates manually. Filed as #1 future-plan in `kol-system/README.md`.
- **`~/.claude/skills/log-work/` location open** — currently per-repo via init-agent-context template. Generic protocol; reasonable candidate for global.
- **`docs/_framework/` in this repo is a copy** of canonical in kol-system. Drift propagates via `/init-agent-context-sync` — but that flow hasn't been exercised on this repo yet (sync skill rewritten this session, not yet tested end-to-end).
- **`writing-guidelines.md` ↔ `_framework/01-conventions.md`** — overlap stripped this session, but the relationship needs periodic re-check as both evolve.
- **TikTok in business-data.js** — backlog 10 says LinkedIn + TikTok added (`@yr_another_creation`), but only LinkedIn shows in the JS data. JS missing the TikTok entry. Minor drift.
- **Vercel CNAME deprecation watch** — `cname.vercel-dns.com` is being phased out for per-project regional targets. Studio/www/brand records still on the old target; Vercel's UI surfaces the new recommended value. Not urgent but accumulates.

## Next Steps

1. **8j newsletter design rework** — both surfaces. The only functional newsletter work left. Anchor against `/brand` page + writing-guidelines tone; decide whether home card stays a card or becomes a section block; reconsider the "save 10% on your first order" claim (no backing discount mechanism).
2. **Put kol-system under git** — biggest leverage point for cross-machine sanity. Likely two repos: `kol-system/` and `~/.claude/skills/`, with a top-level sync doc explaining the pair.
3. **Move log-work to global** — small, decided in principle but not yet executed.
4. **Reload Obsidian** per the framework's maintenance rule — fresh metadata index after the cutover.
