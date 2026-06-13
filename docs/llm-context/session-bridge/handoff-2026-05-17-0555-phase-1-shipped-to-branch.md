# Handoff — 2026-05-17 05:55

## Goal of the current arc

Multi-phase repo restructure (backlog item 11): collapse the KOL → AC DS fiction into a single named design system, move from three sibling apps with alias/symlink workarounds into a real pnpm workspace with `apps/` + `packages/` + `assets/`. Plan fully documented at `docs/client/kol-client-acyr/01-website/05-restructure/` (7 files). Phase 1 shipped to a branch this session; the rest (Phases 2–4) is the forward arc.

## Last actions taken (causal trail, newest first)

- Committed Phase 1 to `phase-1-ds-collapse`, pushed to origin. Commit `3a8eaa0`. 173 files, +3604 / −3613.
- Visual smoke test deferred until after user's meeting tomorrow; PR to main also deferred.
- Built and lint-checked Phase 1 end-to-end. Both Vite builds (website + styleguide) green. Lint shows the pre-existing 389-error baseline — no new errors.
- Fixed one orphan closing brace in `src/ds/framework/framework.css` and one unclosed `.ac-prose-pullout` block in `styleguide/src/styles/design-foundations.css` (caused by line-range extraction splitting a CSS rule across the DS-canon / styleguide boundary in `kol-framework.css`). Brace balance now zero on both files.
- Cleaned up `kol-` residue in JSX/JS: one functional fix (`styleguide/src/pages/Styleguide.jsx:99` runtime regex `^kol-prose ` → `^ac-prose `), three comment fixes (path references to renamed files), left 15 acceptable residues out of scope.
- Bulk `kol-` → `ac-` rename pass across ~163 JSX/JS consumers (className strings + inline `var(--kol-*)` refs + Tailwind arbitrary-value selectors).
- Removed JSX side-door: deleted `import '../../brand/kol-brand-typography.css'` from `src/components/site/SiteLayout.jsx`. Cascade now resolves brand-typography via `src/ds/index.css`.
- Rewired entry points: `src/index.css` collapsed to 3 lines (tailwindcss + `./ds/index.css` + `./styles/site.css`); `styleguide/src/index.css` rewired to consume `../../src/ds/index.css` + local `./styles/design-foundations.css`.
- Wrote `src/ds/index.css` (13-line cascade entry) declaring the canonical load order.
- Split `kol-brand-typography.css` into `src/ds/tokens/brand-typography.css` (@font-face + token override) + `src/ds/utilities/typography-helpers.css` (the `.ac-helper-*` utility classes).
- Split `kol-framework.css` via `sed -n` line-range extraction: ~500 DS-canon lines → `src/ds/framework/framework.css`; ~700 styleguide design-foundations lines → `styleguide/src/styles/design-foundations.css`. Original `git rm`d.
- `git mv` of 11 CSS files into `src/ds/{tokens,utilities,components}` subfolders. `kol-site.css` `git mv`d to `src/styles/site.css` (kept inside the website; 100% site-chrome, not DS).
- Created `phase-1-ds-collapse` branch from main (user did this manually after merging newsletter to main + deleting newsletter branch + a one-off TikTok commit on newsletter before merge).
- Updated `docs/backlog.md` item 11 from "CSS library reorg" placeholder to a 5-phase restructure (Phase 0 ✅, Phases 1–4 ▢).
- Updated `docs/llm-context/AGENT-CONTEXT.md` — added "Repo restructure (backlog 11)" to "What's pending" and gated newsletter design rework (8j) on Phase 1.
- Wrote 7 planning docs at `docs/client/kol-client-acyr/01-website/05-restructure/` (README, decisions, current-state, target-state, phases, css-audit, docs-fate). Synthesized from 4 parallel research agents (repo inventory, cross-app dep graph, CSS tier audit, docs survey).
- Earlier in the session: added TikTok handle `@yr_another_creation` to `business-data.js` SOCIAL + `Footer.jsx` SOCIAL + flipped backlog item 10 TikTok ✅. Committed on newsletter branch by user before merge to main.

## Current state / open decision points

- **Phase 1 lives on `phase-1-ds-collapse` branch.** Vercel preview building at `kol-client-acyr-website-git-phase-daeead-tor-grimssons-projects.vercel.app`. Not yet smoke-tested visually. PR to main deferred until after user's meeting tomorrow.
- **`main` is clean.** Identical to pre-restructure state plus the newsletter + TikTok commits from earlier today.
- **Phases 2–4 pending.** Plan documented in `docs/client/kol-client-acyr/01-website/05-restructure/phases.md`. Each is its own PR; each reversible; feature work resumes between phases.
- **Newsletter pipeline still has open follow-ups** (parked from earlier session):
  - 8d — custom tracking domain `clicks.another-creation.xyz` (gated on MailerLite domain finishing auto-verification)
  - 8g — sender swap `dev@` → `hello@` (same gate)
  - 8h — client list handover (separate workstream)
  - 8i — `.xyz` deliverability watch (30-day calendar tick)
  - 8j — newsletter design rework (now explicitly gated on Phase 1 merge so the redesign happens against the AC DS, not the old kol-* tier)
- **Phase 1 acceptance gate is the user's visual smoke test on the Vercel preview.** If anything regresses visually, fix on the same branch and push; if all good, open PR.

## Next intended action

- **First task next session:** ask user how the meeting went and whether they want to PR Phase 1 to main, or smoke-test the preview first. If both go green, merge Phase 1 to main. After merge, the newsletter design rework (8j) becomes the natural next pickup since it was the original driver for 11 and now has a stable findable DS to author against.
- **If user wants to defer 8j and clear newsletter operational follow-ups first:** check MailerLite domain status, do sender swap (8g) + custom tracking domain (8d) in one pass once verification is green.
- **If user wants to push restructure forward to Phase 2 instead:** the plan is `docs/client/kol-client-acyr/01-website/05-restructure/phases.md` "Phase 2 — Apps + packages split." Highest-risk PR of the four; needs a half-day cutover window with three Vercel project Root Directory updates synchronized to the merge.

## Working memory not yet in AGENT-CONTEXT

- **The orphan-brace incident is a load-bearing lesson for future surgical CSS splits.** Extracting line ranges with `sed -n` from a CSS file is fragile: if a rule's `{` and `}` straddle a kept/dropped boundary, one of the two halves has unbalanced braces. Brace-balance check after every range-based split, and fix imbalances before running the build. The `awk` walker I used (find the block that opens from depth 0 and never closes) is a quick diagnostic.
- **The `kol-` → `ac-` rename needed two sed passes.** First pass `s/([\" '\`({, ])kol-/\1ac-/g` catches className strings + inline var refs. Second pass `s/\.kol-/\.ac-/g` catches Tailwind arbitrary-value selectors (`[&_.kol-foo]`), styleguide data-strings (`{cls: '.kol-sans-display-01', ...}`), and doc comments mentioning `.kol-foo`. Pattern noted for Phase 4 cleanup work if more kol-* prefixes need renaming.
- **`kol-framework.css` split line ranges:** DS-canon = lines `1-191, 217, 240, 269, 314-402, 486-513, 521-686` (~500 lines); styleguide design-foundations = lines `192-216, 218-239, 241-268, 270-313, 403-485, 514-520, 687-1212` (~700 lines). Map in `docs/client/kol-client-acyr/01-website/05-restructure/css-audit.md` if the split needs to be redone.
- **Vercel preview URL is stable for the branch:** `kol-client-acyr-website-git-phase-daeead-tor-grimssons-projects.vercel.app` always points at the latest deploy on `phase-1-ds-collapse`.
- **15 acceptable `kol-` residues remain in JSX/JS** — see session log "Documented residue (out of Phase 1 scope)" section. All deferred to Phase 4 cleanup. Not blocking Phase 1 merge.
- **Permission system snapshot:** `.claude/settings.json` was migrated from another computer mid-session. Git commands ARE denied in this session — `git status` and `git diff` got blocked when I tried to verify against my own summary. Workaround: ask the user to run them and paste output. `git mv` and `git rm` via Bash succeeded (the deny rule is narrower than full `git*`).
- **Backlog 11 should flip to ✅ after Phase 1 merges to main.** It currently shows ▢ for Phase 1 in the backlog (item 11) — the sub-item check happens when the branch lands on main, not when it's shipped to a branch.
- **User constraints noted this session:** no Co-Authored-By trailers, no direct git commits by me, no PRs by me; user reviews and commits. Hold this line.
