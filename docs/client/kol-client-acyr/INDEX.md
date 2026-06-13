---
title: Another Creation — client docs
type: index
status: active
updated: 2026-05-18
description: Documentation surface for the Another Creation (acyr) client engagement. Website, brand, infrastructure, plus an archive lane.
audience: agency-internal
tags:
  - project/acyr
  - domain/client
---

# Another Creation — client docs

Another Creation is a Reykjavík atelier by Ýr Þrastardóttir, womenswear since 2013. Public site at `another-creation.xyz`. This folder holds all documentation for the agency engagement: website code + commerce + brand + infrastructure handoffs.

**Start with [[HANDOFF|HANDOFF.md]]** — one-page quicklook (site, brand, providers + credentials pointer, Proton aliases). Read this first.

## Pillars

| Pillar | What's in it |
|---|---|
| [[01-website/INDEX\|01-website]] | Repo, setup, commerce (PayPal/Printful), CMS (Sanity), metadata, restructure planning |
| [[02-brand/INDEX\|02-brand]] | Identity, voice, copy guidelines, branded assets, career and press |
| [[03-infrastructure/INDEX\|03-infrastructure]] | Domain (Cloudflare), email (Proton), DNS records |
| [[99-archive/INDEX\|99-archive]] | Superseded research and plans, kept for reference |

## Cross-cutting

- **Handoff playbooks** live in the relevant pillar (PayPal under commerce, Sanity under cms, domain under infrastructure). Find them all with tag `pattern/handoff-kit`.
- **External services** are tagged `provider/<name>` — `provider/sanity`, `provider/paypal`, `provider/printful`, `provider/vercel`, `provider/cloudflare`, `provider/proton`.
- **The repo restructure** ([[01-website/05-restructure/INDEX|restructure]]) is the active multi-phase rebuild from sibling-apps to a real pnpm workspace. Status: research complete, Phase 1 pending.

## Framework

This folder follows [[../_framework/INDEX|the kol-docs framework]] — frontmatter schema, numbered prefixes, INDEX-when-it-adds-signal, explicit-with-display wikilinks. Migrated from the original flat layout on 2026-05-18.
