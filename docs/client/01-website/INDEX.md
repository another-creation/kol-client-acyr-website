---
title: acyr — website docs
type: index
status: active
updated: 2026-05-21
description: All website + repo work for Another Creation. Setup, commerce, CMS, metadata pipeline, restructure, and the style audit.
audience: agency-internal
tags:
  - project/acyr
  - domain/website
---

# acyr — website docs

Everything related to the `another-creation.xyz` codebase and its operations. Five subsections, ordered by typical engagement flow: setup first, then the major integrations, then metadata work, then the in-progress restructure.

## Subsections

### `01-setup/` — bootstrap and daily workflow

- [[01-setup/01-overview|setup-overview]] — high-level scoping summary of the commerce stack (no code, just the work in order)
- [[01-website/01-setup/02-playbook|setup-playbook]] — full sequential runbook (1000+ lines, copy-pasteable)
- [[01-website/01-setup/03-repo-workflow|repo-workflow]] — branching, Vercel preview deploys, daily flow

### `02-commerce/` — PayPal + Printful

- [[01-website/02-commerce/01-paypal-handoff|paypal-handoff]] — Multi-User Access ownership pattern (`pattern/handoff-kit`)
- [[01-website/02-commerce/02-paypal-printful|paypal-printful]] — integration runbook (Smart Buttons + Vercel serverless + Printful fulfillment)

### `03-cms/` — Sanity

- [[01-website/03-cms/01-sanity-handoff|sanity-handoff]] — org-to-org project transfer pattern
- [[01-website/03-cms/02-sanity-log|sanity-log]] — running record of setup decisions, dated entries

### `04-metadata/` — SEO + social previews

- [[01-website/04-metadata/01-plan|metadata-plan]] — three-pass strategy (static → Sanity-driven → products)
- [[01-website/04-metadata/02-operations|operations]] — SEO + analytics + copywriting operations playbook
- [[01-website/04-metadata/03-routes|routes]] — canonical per-route metadata copy table
- [[01-website/04-metadata/04-og-images|og-images]] — 18-asset OG image inventory
- [[01-website/04-metadata/05-incident-crawler-blocked|incident-crawler-blocked]] — Pass 1 launch-blocker post-mortem

### `05-restructure/` — pnpm workspace migration

In-progress multi-phase rebuild. [[01-website/05-restructure/INDEX|Restructure INDEX]] frames the work; six docs inside cover decisions, current state, target state, phases, CSS audit, and docs fate.

### `06-style-audit/` — typography, structural duplication, regional alignment

Three-pass audit of `apps/website/src/` style — shared-class gaps, mechanical migration lists, prioritised cleanup queue. Historical context; produced the role layer documented at [[../../site-typography|docs/client/site-typography.md]]. [[01-website/06-style-audit/INDEX|Style audit INDEX]] frames the passes.

- [[01-website/06-style-audit/01-typography-inventory|01 — typography inventory]] — every type class used, every arbitrary escape, gaps + cleanup queue
- [[01-website/06-style-audit/02-structural-duplication|02 — structural duplication]] — repeated section shapes (FAQ, page heroes, back links) and what extracts
- [[01-website/06-style-audit/03-regional-alignment|03 — regional alignment]] — header/footer/hero/card/cart/form register map and the three-stop chrome contract

## Where things live

- Anything client-handoff-related → search tag `pattern/handoff-kit`
- External services → `provider/<name>` tags
- The commerce + CMS work is what's currently live in production
