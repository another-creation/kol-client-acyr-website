---
title: Website style audit
type: index
status: active
updated: 2026-05-21
description: Three-pass audit of typography, structural duplication, and regional style alignment across apps/website/src. Output: shared-class gaps, mechanical migration lists, and a prioritised cleanup queue.
audience: agency-internal
tags:
  - project/acyr
  - domain/website
  - domain/typography
  - domain/audit
related:
  - "[[01-website/INDEX|website docs index]]"
  - "[[02-brand/04-writing-guidelines|writing guidelines]]"
---

# Website style audit — 2026-05-21

Triggered by the observation that the website has accumulated **lots of per-card class soup and few shared classes** — two FAQ instances rather than one shared component, font sizes that drift between footer / header / cards, and arbitrary `text-[Npx]` escapes scattered across consumers.

The audit asks: where does the AC DS cover the use case, where does it almost-cover, and where do consumers reach for inline values because no class fits.

## Method

Audit **across** the codebase by primitive type, not page-by-page. Per-page reads miss the duplication and produce local fixes that drift further from other pages. Each pass produces a flat findings doc; we act on findings in a second arc so we're not refactoring mid-audit.

Four passes, in order:

1. [[01-typography-inventory|01 — Typography inventory]] — every type class used across the website, every arbitrary escape, the gaps and the cleanup queue.
2. [[02-structural-duplication|02 — Structural duplication]] — repeated section shapes (FAQ, cards, kicker+title openings) and what should extract vs stay local.
3. [[03-regional-alignment|03 — Regional alignment]] — header / footer / cards / hero / body / forms — what scale each region uses today vs what the shared register should be.
4. [[04-element-census|04 — Text-bearing element census]] — per-region enumeration of every text slot with its current class. Raw input for the role-layer plan that supersedes the prescriptive sections of Passes 1–3.

## Scope

- `apps/website/src/**` — 94 .jsx/.js files
- `apps/website/src/styles/site.css` — site-tier CSS
- `packages/ds/{tokens,utilities,components,framework}/` — read-only reference for what the DS already provides

Out of scope: styleguide app, studio app, anything inside `packages/ds/` (the DS itself is documented at [[documentation/INDEX|documentation]]).

## Status

| Pass | Status | Output |
|---|---|---|
| 01 — Typography inventory | done | [[01-typography-inventory]] |
| 02 — Structural duplication | done | [[02-structural-duplication]] |
| 03 — Regional alignment | done | [[03-regional-alignment]] |
| 04 — Element census | done | [[04-element-census]] |

> **Reframe note (2026-05-21):** the user is still in design exploration. The prescriptive cleanup queues in Passes 1–3 assume "consolidate now"; they are no longer the path forward. The new path is a **site-typography role layer** at `apps/website/src/styles/site-typography.css` that lets the design get retuned from one place per region. Pass 4 (the census) is the raw input for that role layer. The role-layer plan supersedes the Tier A/B/C lists in Passes 1–3 — those remain valid as snapshots of current state, not as action plans.
