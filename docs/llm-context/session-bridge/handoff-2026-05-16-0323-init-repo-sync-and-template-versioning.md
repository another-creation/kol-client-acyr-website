# Handoff — 2026-05-16 03:23

## Goal of the current arc

Bring already-scaffolded repos up to date with template improvements without forcing re-scaffolding. Now requires (a) validating the new `/init-repo-sync` skill works end-to-end, and (b) deciding what to do about the `plan.md` → `backlog.md` rename divergence between template and this project.

## Last actions taken (causal trail, newest first)

- Updated `~/.claude/skills/init-repo/SKILL.md` Notes section to document the versioning scheme and point at `/init-repo-sync` for existing repos.
- Wrote `~/.claude/skills/init-repo-sync/SKILL.md`. Defines drift detection (`_template.version` comparison), three sync policies (`replace` / `notify-only` / `skip`), the underscore-namespacing rationale, step-by-step procedure, and when to bump versions.
- Added `_template:` frontmatter block to all 9 template MD files under `~/.claude/skills/init-repo/templates/`. All start at `version: 1`. Sync policies assigned per file (skills + protocol READMEs = `replace`; LLM_RULES + llm-context/README = `notify-only`; AGENT-CONTEXT/ARCHITECTURE/history/plan = `skip`).
- Argued for and adopted the `_template:` namespace approach over a flat frontmatter scheme. Underscore prefix marks tool-managed fields so they don't collide with user-managed fields (tags, title, etc.). Cleaner conflict boundary.
- Designed the versioning shape: per-file version stamps in YAML frontmatter, no separate lock file, frontmatter IS the source of truth.
- User asked whether the template-drift problem is worth solving with versioning + a sync skill. Confirmed: standard problem (cookiecutter/yeoman/Rails-generator pattern), worth doing.

## Current state / open decision points

- **Sync skill exists but unproven.** No real run has happened yet. First run will be inside this repo (kol-acyr-website) — all scaffold-managed files here are pre-versioning, so the skill should see them as "missing `_template:` block" and offer to patch.
- **Rename divergence.** Template's `docs/plan.md` was renamed to `docs/backlog.md` in this project mid-session. Sync skill in v1 doesn't handle renames — would see template `plan.md` as missing in this target and template doesn't know about `backlog.md`. Options: rename in template too (future scaffolds match this convention), or leave as-is. **Lean: rename the template** — better than the inconsistency.
- **Unanswered: when does `/init-repo-sync` get invoked?** No automatic trigger. User runs it manually when they want to check for drift. That's fine for a low-frequency operation. Could later add a hook to suggest it after `git pull` of a downstream repo, but premature now.
- **Backlog item 1e** (code sweep for `kol-client-acyr-website.vercel.app` references) is still untouched. That's the *original* next-up item from before this template-versioning detour.

## Next intended action

Pick one of:

a) **Test the sync skill.** Run `/init-repo-sync` inside this repo. Watch for: does the report correctly mark all scaffolded files as pre-versioning? Do the `replace`-policy files get offered for patching? Do the `skip`-policy files get correctly left alone? Iterate on the skill spec based on what breaks.

b) **Resolve the rename divergence first.** Rename `~/.claude/skills/init-repo/templates/docs/plan.md` → `docs/backlog.md`, bump its version, update any references in the templates. Then run the sync skill.

c) **Resume backlog 1e.** Code sweep for the preview URL. The sync work is shipped; can validate later.

Recommended: (a) first — proving the sync skill works is the natural completion of this push. Then (b) as a follow-up. (c) is the next *real* product work.

## Working memory not yet in AGENT-CONTEXT

- **Underscore-namespace convention is reusable beyond this skill.** Any future tool-managed metadata on Markdown files in this scaffold ecosystem should also live under `_<tool-name>:` to keep the same clean boundary. Mention this if/when another tool needs to add metadata.
- **`_template.version` is per-file, not global.** Each template file evolves on its own clock. Don't be tempted to add a single "template version" at the repo level — that's the wrong granularity (forces bumping unrelated things).
- **Sync skill explicitly compares versions, not content.** A common alternative (cookiecutter, etc.) computes content hashes. We chose version-only because we want author intent, not accidental drift. The cost: a template author who edits without bumping produces silent drift. Document this in the skill spec for future maintainers.
- **The `/init-repo-sync` skill needs `disable-model-invocation: true`** if we want it to only run on explicit `/init-repo-sync` (no auto-invoke). Currently set. Don't accidentally drop it.
- **Two log-work runs in one session is fine.** This is the second one. Each captures a discrete arc — the previous log captured domain+email+docs; this one captures versioning+sync. Don't try to consolidate retroactively.
