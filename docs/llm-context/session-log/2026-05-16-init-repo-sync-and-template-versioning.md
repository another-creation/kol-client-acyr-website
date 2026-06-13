# Session: Template versioning + `/init-repo-sync` skill

**Date:** 2026-05-16
**Agent:** Grim (Claude Opus 4.7, 1M context)
**Summary:** Added per-file template versioning to the `~/.claude/skills/init-repo/` scaffold and shipped a new `/init-repo-sync` skill that brings already-scaffolded repos up to date.

## Changes Made

### Files Modified
- `~/.claude/skills/init-repo/templates/LLM_RULES.md`, `docs/history.md`, `docs/plan.md`, `docs/llm-context/{ARCHITECTURE,AGENT-CONTEXT,README}.md`, `docs/llm-context/session-bridge/README.md`, `.claude/skills/init/SKILL.md`, `.claude/skills/log-work/SKILL.md` — added `_template:` frontmatter block to each (9 files). Each carries `version: 1`, the canonical path, and a sync policy (`replace` / `notify-only` / `skip`).
- `~/.claude/skills/init-repo/SKILL.md` — added Note documenting the versioning scheme and pointing at `/init-repo-sync` as the mechanism for already-scaffolded repos to pull in template improvements.
- `~/.claude/skills/init-repo-sync/SKILL.md` — new. Full skill spec covering: how drift is detected (`_template.version` source vs. target), the three sync policies, the underscore-namespacing rationale (clean conflict boundary between tool-managed and human-managed frontmatter), step-by-step procedure (enumerate templates → build report table → confirm via `AskUserQuestion` → apply per policy), and when to bump versions.

### Features Added/Removed
- **Per-file template versioning** under a reserved `_template:` frontmatter key. The underscore signals "tool-managed" — sync skill reads/writes only inside `_template:`, leaving all other frontmatter (tags, title, status, related) to the user.
- **Sync policy taxonomy:** `replace` (skill SKILL.md files, protocol READMEs), `notify-only` (LLM_RULES, scaffold READMEs that grow per project), `skip` (project-owned state like AGENT-CONTEXT, ARCHITECTURE, history, plan).
- **`/init-repo-sync` skill** available globally. Run inside any previously-scaffolded repo to pull in template improvements without re-scaffolding.

## Current State

### Working
- Template versioning convention defined, documented, applied to all 9 current template MD files.
- New `/init-repo-sync` skill present and ready for first invocation.
- `/init-repo` updated so future scaffolds inherit the `_template:` blocks (they get copied across by the existing `cp -R templates/. .` step).

### Known Issues
- **Sync skill not yet tested.** First real run will be inside this repo (kol-acyr-website) — none of this project's scaffold-managed files have `_template:` blocks yet, so they'll all show as "stale" / pre-versioning. That's the realistic upgrade scenario for any repo init'd before today.
- **Rename drift:** template still has `docs/plan.md`, but this project renamed it to `docs/backlog.md` mid-session. Sync skill explicitly doesn't handle renames in v1 — would see template `plan.md` as missing in target. Resolve by either renaming the template too, or leaving as-is and accepting that mid-life renames live outside the sync mechanism.
- **No content-hash check.** Sync compares versions, not content. A template author who edits a file without bumping `_template.version` produces silent drift. By design (avoids forcing constant 3-way merges) but worth knowing.
- **Non-MD scaffold files are unversioned.** `.gitkeep` and any future binary/non-YAML scaffold pieces won't be tracked. If this becomes a problem, add a manifest at `~/.claude/skills/init-repo/templates/.template-manifest.json`.

## Next Steps
1. Run `/init-repo-sync` in this repo (kol-acyr-website) as the first real test. Will detect that all scaffolded files are pre-versioning and offer to patch the `replace`-policy files.
2. Decide whether to rename the template's `docs/plan.md` to `docs/backlog.md` so future scaffolds match this project's convention. (Quick win, low risk.)
3. Resume backlog item 1e — code sweep for `kol-client-acyr-website.vercel.app` references.
