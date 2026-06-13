---
title: acyr — infrastructure docs
type: index
status: active
updated: 2026-05-18
description: Domain (Cloudflare), email (Proton Mail Plus), DNS records for another-creation.xyz. Plus the agency-to-client handoff playbook.
audience: agency-internal
tags:
  - project/acyr
  - domain/infrastructure
  - provider/cloudflare
  - provider/proton
---

# acyr — infrastructure docs

What's running outside the repo: DNS, email, domain registrar. All on `another-creation.xyz`.

## Files

- [[03-infrastructure/01-proton-email-setup|proton-email-setup]] — Proton Mail Plus custom-domain setup recap. What's live, how it got there, DNS records.
- [[03-infrastructure/02-handoff|domain-handoff]] — Cloudflare + Proton ownership-transfer playbook (account-internal move recommended). `pattern/handoff-kit`.
- [[03-infrastructure/03-dns-records|dns-records]] — BIND zone snippet for the Proton DNS records.

## Supporting files

`_files/` holds the raw configs imported into Cloudflare and Proton:

- `proton-records.txt` — BIND zone for Cloudflare DNS import
- `scripts-records.sieve` — Proton Mail filter script (alias routing)

These are linked from the docs and shown inline as fenced code blocks where needed. Don't `![[embed]]` — Obsidian doesn't render `.txt`/`.sieve`.

## Live state

- **Domain:** `another-creation.xyz` registered at Cloudflare Registrar
- **Email:** Proton Mail Plus, primary `hello@another-creation.xyz` (catch-all enabled)
- **Aliases:** `hello@`, `yr@`, `dev@`, `billing@`, `legal@`, `noreply@` (filtered via Sieve)
