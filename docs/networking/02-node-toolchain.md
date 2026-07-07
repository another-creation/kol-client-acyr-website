---
title: Node toolchain
type: guide
status: active
updated: 2026-07-06
audience: internal
description: Get the right Node version with fnm, pin it so local matches the Vercel deploy, and understand how .node-version, engines, and pnpm fit together. Explains every command and file.
tags:
  - project/acyr
  - domain/networking
  - domain/tooling
  - provider/vercel
related:
  - "[[01-remote-dev-access|remote dev access]]"
aliases:
  - node-toolchain
---

# Node toolchain

**Goal:** make sure this project runs on the **Node version it expects**, the same one Vercel builds with — and switch to it automatically without thinking about it. Written from zero.

## 0. The mental model

**Node.js** is the program that runs the JavaScript tooling (Vite, the build, the scripts). It has **versions** — `20`, `22`, `24`, `26` — and they are *not* interchangeable: a project tested on Node 22 can break on Node 26 because some low-level piece (a compiled add-on) isn't ready for the newer Node yet.

Two facts that cause 90% of "works on my machine" pain:

1. **You had one global Node**, installed by Homebrew, and Homebrew can only hold **one version at a time**. Switching versions per-project was impossible.
2. **The repo didn't say which version it wanted**, so your Mac (Node 26) and Vercel (whatever Vercel defaults to) silently disagreed.

**fnm** fixes #1 (hold many Node versions, switch instantly). A file called **`.node-version`** fixes #2 (the repo states its version; both fnm and Vercel obey it).

## 1. What fnm is, and its one dependency

**fnm** = "Fast Node Manager." It lets you install several Node versions side by side and switch between them per-folder, in milliseconds.

- **Dependency:** just a shell (zsh here) and permission to edit your `~/.zshrc`. That's it — no Node required to install fnm (fnm is a standalone binary written in Rust, installed by Homebrew).
- **It replaces** Homebrew's `node` as *the* source of Node. After setup you **uninstall brew's node** so there's exactly one source of truth.

## 2. Install fnm

```bash
brew install fnm
```

- `brew` — Homebrew, the macOS package installer.
- `install fnm` — download + install the fnm binary.

This installs fnm itself. It does **not** yet install any Node, and does **not** yet hook into your shell — that's the next two steps.

## 3. The shell hook (the step everyone misses)

fnm has to be **activated in every terminal you open**. You do that by adding one line to your shell startup file, `~/.zshrc`. This repo added:

```bash
# fnm (Node version manager) — auto-switch on cd into dirs with .node-version
eval "$(fnm env --use-on-cd)"
```

Breaking it down:

- **`fnm env`** — prints the settings that put "fnm's current Node" onto your `PATH` (the list of places the shell looks for programs). Without this, the shell can't find fnm's Node at all — you'll get `error: We can't find the necessary environment variables…`.
- **`--use-on-cd`** — adds a hook that fires **every time you `cd` into a folder**: if the folder has a `.node-version` file, fnm auto-switches to that version. This is the magic that makes it effortless.
- **`eval "$(…)"`** — runs the printed settings in *your current shell*. `$(…)` means "run this command and paste its output here"; `eval` means "then execute that output."

> **The `.zshrc` line does NOT set a version.** It's version-agnostic plumbing — the same one line no matter how many projects pin different versions. The *version* lives in the repo's `.node-version` (§5).

After adding it, reload the shell so the line takes effect:

```bash
exec zsh
```

`exec zsh` replaces the current shell with a fresh one, re-reading `~/.zshrc`. (Opening a new terminal tab does the same thing.)

## 4. Install a Node version

```bash
fnm install 22
```

Downloads Node 22 (the current LTS — "Long Term Support," the stable line projects target) and stores it under fnm. You can install more later (`fnm install 20`, etc.) and they coexist.

Useful siblings:

```bash
fnm list           # show every Node version fnm has installed
fnm use 22         # switch THIS shell to 22 right now (manual)
fnm default 22     # make 22 the fallback when no .node-version applies
```

## 5. Pinning the version — `.node-version`

This is what makes local match the deploy. A one-line file at the repo root:

```
22
```

- **fnm reads it:** thanks to `--use-on-cd`, the moment you `cd` into this repo, fnm switches to 22 automatically. Leave the repo, it switches back.
- **Vercel reads it too:** Vercel looks for `.node-version` and builds with that same version. So "works locally" now genuinely means "works on the deploy."

`.node-version` is committed to the repo — it's a shared instruction to everyone (and every machine), not a personal setting.

### Two more repo-level pins

The root `package.json` also declares:

```json
"packageManager": "pnpm@11.10.0",
"engines": {
  "node": ">=22 <23"
}
```

- **`packageManager`** — states the exact pnpm version, so everyone uses the same package manager (and Corepack can auto-provide it).
- **`engines.node`** — declares the acceptable Node range. If someone runs the project on Node 24, tooling can warn them. `>=22 <23` means "22.x only."

## 6. Verify it worked

```bash
node -v
which node
```

- `node -v` — should print `v22.x.x`.
- `which node` — should print a path **under fnm** (something like `~/.local/share/fnm/...`), **not** `/opt/homebrew/bin/node`. If it still says `/opt/homebrew`, the shell hook (§3) isn't active — re-run `exec zsh` and `cd` back into the repo.

## 7. Remove Homebrew's Node (finish the switch)

Once §6 confirms Node comes from fnm, delete the old brew copy so there's only one source:

```bash
brew uninstall node
```

**Heads-up:** any tools you installed globally via `npm install -g …` lived under brew's Node and **disappear** with it. Re-install them under fnm's Node (`npm install -g <tool>` again while on 22) if you rely on any. If you never used global npm tools, there's nothing to lose.

## 8. Where pnpm fits

**pnpm** is the **package manager** — it installs the project's dependencies and runs the `dev` / `build` scripts. It's a *different tool* from Node and fnm:

- **Node** runs JavaScript.
- **fnm** picks which Node.
- **pnpm** installs packages and runs scripts (on top of whatever Node is active).

This repo is a **pnpm workspace** ("monorepo") — one install covers all the apps (`apps/website`, `apps/studio`, `apps/styleguide`) and shared packages. That's why commands use `--filter` to target one app, e.g. `pnpm --filter website dev`. See the root `package.json` scripts and `pnpm-workspace.yaml`.

Common commands:

```bash
pnpm install       # install all dependencies for every workspace
pnpm dev           # run just the website dev server
pnpm dev-server    # run website + studio + styleguide together
```

## 9. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `fnm: command not found` | fnm not installed | `brew install fnm` (§2) |
| `We can't find the necessary environment variables…` on `fnm use` | shell hook missing | add the `eval "$(fnm env --use-on-cd)"` line, `exec zsh` (§3) |
| `node -v` shows the wrong version in the repo | `.node-version` missing, or you didn't `cd` in after the hook was added | confirm `.node-version` exists; `cd` out and back in |
| `which node` still shows `/opt/homebrew` | brew node still on PATH ahead of fnm | finish §3 (hook), then §7 (uninstall brew node) |
| A global CLI vanished | it was under brew's node | reinstall it: `npm install -g <tool>` while on fnm's Node |

## Related

- [[01-remote-dev-access|remote dev access]] — reaching the dev server this toolchain runs, from other devices.
