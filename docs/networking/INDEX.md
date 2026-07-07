---
title: Networking
type: index
status: active
updated: 2026-07-06
description: Repo machinery for the developer's own setup — reaching the dev server from other devices (LAN, Tailscale, MagicDNS, SSH) and pinning the Node toolchain (fnm, .node-version, pnpm). Not subject matter about the site.
tags:
  - project/acyr
  - domain/networking
aliases:
  - networking
---

# Networking

Repo / process machinery — a sibling of [[operations/INDEX|operations]]. This is about **your machine and how you reach the project on it**, not about how the website is built.

Written for someone who has never done this before. Every command shows the syntax and explains what each piece does. Copy-paste safe.

- [[networking/01-remote-dev-access|01 · remote dev access]] — run the dev server and open it from your phone, another laptop, or across the internet. Ports, LAN, Tailscale, MagicDNS, SSH.
- [[networking/02-node-toolchain|02 · node toolchain]] — get the right Node version with fnm, pin it so local matches the Vercel deploy, and how pnpm fits in.

## The one-minute version

| I want to… | Go to |
|---|---|
| Open `localhost:5173` from my phone on the same wifi | 01 → *LAN access* |
| Open it from anywhere (café, other city) securely | 01 → *Tailscale* |
| Get a clean `https://…` URL instead of an IP + port | 01 → *tailscale serve* |
| Fix "wrong Node version" / set up fnm | 02 |
| Understand why `.node-version` exists | 02 → *Pinning the version* |
