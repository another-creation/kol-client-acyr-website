# Handoff — 2026-05-18 21:09

## Goal of the current arc

Newsletter track was 95% closed this session — pipeline fully restored, DNS authenticated, sender swapped, checkout opt-in wired, template doc shipped. The remaining piece is **8j design rework**: both surfaces (home card + footer strip) are visually off-base per user and need a brand-voice-aligned redesign before the newsletter track can really close.

Out-of-scope-but-touched: the user used the session to also (a) cut over `docs/client/` to a framework-conformant layout and (b) promote the kol-docs framework into the canonical `kol-system/packages/kol-docs/` package + rename the docs-init skills. Both are now stable, but they introduced cross-repo state worth tracking.

## Last actions taken (causal trail, newest first)

- Wrote root metadata at `kol-system/` (`package.json`, `README.md`, `CHANGELOG.md`) — declared future plans (git repo for cross-machine sync, formal pnpm workspace, log-work-to-global, writing-guidelines reconciliation watch).
- Merged the `kol-docs-framework` sibling package into `kol-docs/src/_framework/` at user direction (single package = single import surface). Updated both `init-agent-context` and `init-agent-context-sync` SKILL.md to point at the new path.
- Reconciled `kol-docs/src/00-system/01-writing-guidelines.md` against the framework — stripped overlap, kept the project-specific overlay (voice, tone, code formatting).
- Updated `init-scaffold/SKILL.md` to strip `docs/documentation/_framework` after the kol-docs copy.
- Renamed `~/.claude/skills/init-repo/` → `init-agent-context/`, `init-repo-sync/` → `init-agent-context-sync/`, and inside templates `init/` → `init-agent/`. Bumped the template's `_template.version` to 2.
- Frontmatter-normalized 19 kol-docs files (`date:` → `updated:`, `version:` dropped, types archetype-mapped, tags list-form with `project/kol-docs` + `domain/<area>` namespaces). Renamed `00-index.md` → `INDEX.md` across 6 subfolders.
- **Cutover** of `docs/client-1/kol-client-acyr/` → `docs/client/kol-client-acyr/`. ~35 broken markdown links repaired in metadata operations + og-images docs. Social section added to contact-and-identity. Newsletter template moved into 02-brand. 4 archive stragglers migrated to 99-archive subfolders. External-referrer path sweep on AGENT-CONTEXT, backlog, backlog-notes, all session-log + session-bridge files. Old `docs/client/` + `docs/archive/` deleted. 17 paths verified.
- Fixed the Vercel Ignored Build Step `HEAD^ HEAD` bug — multi-commit pushes silently skipped builds. Replaced with `${VERCEL_GIT_PREVIOUS_SHA:-HEAD^}` across all 3 Vercel projects.
- Wired Checkout opt-in to newsletter subscribe API (fire-and-forget after PayPal capture).
- Drafted newsletter template at `docs/client/kol-client-acyr/02-brand/07-newsletter-template.md` with worked June example.
- Swapped sender `dev@` → `hello@` in MailerLite UI; verified saved.
- Added DKIM CNAME (`litesrv._domainkey`) + domain verification TXT records at Cloudflare DNS. MailerLite domain status flipped to Authenticated. First live test landed inbox (not spam) — but the confirmation link still hits `clicks.mlsend.com`, which uBlock Origin blocks.
- Restored the missing newsletter pipeline files (subscribe.mjs, FooterNewsletter.jsx, Newsletter.jsx wiring, Footer.jsx mount) — they had been lost in the Phase 2 workspace restructure.

## Current state / open decision points

- **8j is the only functional newsletter work remaining.** Both surfaces' visuals haven't been touched (current state preserves the pre-restoration layout). 8j is now genuinely actionable — AC DS stable, pipeline live, no blockers. The "save 10% on your first order" claim on the home card has no backing discount mechanism — decide whether to drop that line or wire an actual first-order discount before the redesign.
- **uBlock-blocks-confirmation-link** (8d) is a known friction point on Free tier. Real fix (custom tracking domain) is paywalled; alternative (disable click tracking) isn't exposed on Free either. Workaround: subscribers can click "Proceed" through the warning page. Decide whether to add an inline note next to the form ("if your browser warns, click Proceed") as a soft mitigation, or just live with it.
- **`docs/_framework/` in this repo is a copy** — canonical lives at `kol-system/packages/kol-docs/src/_framework/`. The `/init-agent-context-sync` skill is meant to refresh it, but the skill itself was rewritten this session and has not been exercised end-to-end on a real target. First sync run will be the verification.
- **kol-system isn't under git.** User has 2 machines drifting. Future-plans note in `kol-system/README.md` lists this as #1 priority. Strongly recommend tackling soon — every session that touches `~/.claude/skills/` or `kol-system/packages/` widens the drift.
- **log-work skill location** is still per-repo. The protocol is generic; moving it to `~/.claude/skills/log-work/` is queued in `kol-system/README.md` future plans. Awaiting a clean moment to swap.
- **AGENT-CONTEXT line 53** (the "Newsletter MailerLite integration shipped" entry) was rewritten earlier in the session to reflect the restoration. Key-files table also updated. Other narrative entries (lines 48, 50, 52) describe historical state with path mentions that the sed sweep updated to the new tree — minor temporal inaccuracy (the events happened against the old tree) but pragmatically correct for navigation.

## Next intended action

**Pick up 8j design rework.** Open the two surfaces (`Newsletter.jsx` + `FooterNewsletter.jsx`) and the brand surface (`/brand` page + `writing-guidelines.md`) side-by-side; redesign against the brand voice. Two decisions in flight:
1. Home card: stays a card or becomes a section block?
2. Footer strip: keep current slim row layout or restructure to match the footer typography column system?

If you instead choose to address the cross-repo drift problem first, prioritize:
1. `git init` on `kol-system/` and `~/.claude/skills/` (separately).
2. Push to a private remote.
3. Pull on the other machine.

That eliminates the drift surface immediately.

## Working memory not yet in AGENT-CONTEXT

- The `business-data.js` SOCIAL array is missing the TikTok entry per backlog 10 (`@yr_another_creation` is claimed shipped but only LinkedIn made it in). Minor JS drift — fix when next touching that file.
- `Footer.jsx` hardcodes its `SOCIAL` array instead of importing from `business-data.js`. Drift surface. The right fix is the same one tracked for socials-in-info.js: move socials into `info.js`, then `Footer.jsx` imports from there. One coherent change, not done yet.
- The TikTok handle (`@yr_another_creation`) is one I have on tap from backlog but the actual JS data + Footer hardcode need it added.
- The newsletter template's worked June example is plausibly-fictional in tone (matches writing-examples). Real first issue should be hand-authored from the template before the template is exposed to the client as production-ready.
- The `/init-agent-context-sync` skill mentions reading `_template.version` from both source and target files. Several of the newly-renamed files (init-agent template, etc.) don't have `_template.path` updated to the new path — needs a follow-up sweep when the skill is actually exercised. Not blocking this repo.
- Reload Obsidian after the docs cutover — bulk renames outrun the metadata cache per the framework's maintenance note.
