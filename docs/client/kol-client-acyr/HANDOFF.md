---
title: Handoff — quicklook
type: reference
status: active
updated: 2026-05-18
description: One-page operational overview of the Another Creation engagement. Site, brand, providers, credentials pointer, email aliases. Read this first.
audience: agency-internal
tags:
  - project/acyr
  - domain/handoff
  - pattern/handoff-kit
related:
  - "[[INDEX|project index]]"
  - "[[03-infrastructure/02-handoff|domain + email handoff playbook]]"
  - "[[01-website/02-commerce/01-paypal-handoff|paypal handoff playbook]]"
  - "[[01-website/03-cms/01-sanity-handoff|sanity handoff playbook]]"
---

# Handoff — quicklook

Everything you need to operate, audited, refresh, or hand the engagement over. Detail for any single item lives in its provider-specific playbook (linked at the bottom).

## Site

- **Live:** [another-creation.xyz](https://another-creation.xyz) (apex; `www` 307-redirects to apex)
- **What it does:** SPA storefront for **Another Creation** — Reykjavík atelier. Custom checkout (PayPal Smart Buttons + Orders API v2 + Printful fulfillment). Self-hosted Sanity CMS for journal + collections. Static brand surface (`/brand`, `/press`). Newsletter signup (MailerLite).
- **Stack:** Vite 7 + React 19 + Tailwind v4 + pnpm workspace. JS, no TypeScript. Three apps: `apps/{website,studio,styleguide}`. Two private packages: `@ac/ds`, `@ac/brand-data`.
- **Code:** GitHub. Production branch `main` → Vercel auto-deploy.

## Brand

- **Name:** Another Creation. Designer: Ýr Þrastardóttir (diacritics always).
- **Founded:** 2013, Reykjavík.
- **Atelier:** Vatnsstígur 3, 101 Reykjavík.
- **Voice docs:** [[02-brand/04-writing-guidelines|writing-guidelines]] + [[02-brand/05-writing-examples|writing-examples]].
- **Brand surface:** [[02-brand/INDEX|02-brand]].

## Credentials

All provider passwords live in **Bitwarden**. Vault entry name matches the Provider column below. If "User" is blank, look it up in the vault.

## Providers

| Provider | Description | User | Pass | Integration | Ownership | Status | Link |
|---|---|---|---|---|---|---|---|
| Cloudflare | Registrar + DNS for `another-creation.xyz`; Zero Trust Access on `brand.another-creation.xyz` |  | Bitwarden | Dashboard only — no programmatic integration | not yet transferred | live | [dash.cloudflare.com](https://dash.cloudflare.com) |
| Vercel | Hosting for 3 projects: `kol-client-acyr-website`, `kol-client-acyr-studio`, `kol-client-acyr-styleguide` |  | Bitwarden | Git-push deploy. Env vars per-scope (Production = live, Preview = sandbox) | not yet transferred | live | [vercel.com](https://vercel.com) |
| GitHub | Code hosting. Production branch `main` |  | Bitwarden | Git over SSH/HTTPS | not yet transferred | live | [github.com](https://github.com) |
| Sanity | CMS for journal + collections. Project `ajbrqqhq`, dataset `production`. Studio at `studio.another-creation.xyz` | GitHub OAuth | Bitwarden | `@sanity/client` GROQ reads (`perspective: 'published'`); write-scoped `migration-script` token in `.env.local` | not yet transferred | live | [sanity.io/manage](https://sanity.io/manage) |
| MailerLite | Newsletter ESP. Free tier (14-day trial banner; staying Free). Group `Newsletter` (ID `187676036627957365`). Domain Authenticated | `dev@another-creation.xyz` | Bitwarden | Connect API `POST /api/subscribers`, bearer `MAILERLITE_TOKEN` (named `acyr-website`) | not yet transferred | live | [dashboard.mailerlite.com](https://dashboard.mailerlite.com) |
| Proton | Mail Plus monthly. Custom domain `another-creation.xyz`, `hello@` default + catch-all |  | Bitwarden | MX + SPF + DKIM + DMARC (`p=quarantine`) at Cloudflare. SPF merged with MailerLite | not yet transferred | live | [account.proton.me](https://account.proton.me) |
| PayPal | Payment gateway. REST apps `acyr-website-sandbox` + `acyr-website-live`. Public Smart Buttons via `VITE_PAYPAL_CLIENT_ID` |  | Bitwarden | Orders API v2. OAuth2 via `PAYPAL_CLIENT_ID` + `PAYPAL_SECRET` | not yet transferred | sandbox verified; live mode pending | [developer.paypal.com](https://developer.paypal.com) |
| Printful | POD fulfillment. Store `acyr-test` (temp). Currency EUR |  | Bitwarden | v1 API bearer `PRINTFUL_TOKEN`. Order create on PayPal capture; `external_id` = capture ID for idempotency. Catalog synced via `pnpm sync-printful` | not yet transferred | live (test store) | [printful.com](https://www.printful.com) |
| Bitwarden | Credential vault. Source of truth for the "Pass" column on every other row |  |  | None — agency-managed access | not yet transferred | live | [vault.bitwarden.com](https://vault.bitwarden.com) |

## Proton aliases

All `@another-creation.xyz`. Catch-all on `hello@` means typos route there.

| Alias | Purpose |
|---|---|
| `hello@` | Default. Public contact. Catch-all sink. Newsletter sender. |
| `yr@` | Ýr's personal/founder mailbox. |
| `dev@` | Development / agency / MailerLite account login. |
| `billing@` | Invoices, subscriptions, vendor billing correspondence. |
| `legal@` | Legal correspondence, GDPR/DSAR, T&Cs. |
| `noreply@` | Automated send-only (transactional confirmations if ever wired). |

## Handoff playbooks (per provider)

When transferring ownership at engagement end, follow the relevant playbook — each covers the account move, credential swap, and token rotation.

- [[03-infrastructure/02-handoff|Cloudflare + Proton handoff]] — account-internal move + credential swap
- [[01-website/02-commerce/01-paypal-handoff|PayPal handoff]] — Multi-User Access pattern
- [[01-website/03-cms/01-sanity-handoff|Sanity handoff]] — org-to-org project transfer
- Vercel / GitHub / Printful / MailerLite — covered inline in the playbooks above where they touch the relevant flow; standalone handoff docs not yet written.

## Status caveats

- Domain + email handoff to client gated on client having a Cloudflare account (backlog 1f).
- Proton recovery email is agency-owned — swap to a client-controlled address before transferring the mailbox, otherwise the agency keeps a back-door reset path.
- PayPal live mode flip pending (Production env-var swap to `acyr-website-live` creds).
- MailerLite client list handover pending — decision between new client project vs user-management transfer (backlog 8h).
- Sanity migration token still in `.env.local` — revoke at engagement end.
