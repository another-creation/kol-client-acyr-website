---
title: Proton Mail Plus — custom domain setup recap
type: playbook
topic: email
audience: agency-internal
status: active
domain: another-creation.xyz
provider: proton-mail-plus
plan: mail-plus-monthly
primary_address: hello@another-creation.xyz
catch_all: true
related:
  - "[[03-infrastructure/02-handoff|domain-handoff]]"
  - "[[03-infrastructure/_files/proton-records.txt|proton-records]]"
tags:
  - handoff-kit
  - client/setup/email
  - provider/proton
  - provider/cloudflare
---

# Proton Mail Plus — custom domain setup recap

What's running on `another-creation.xyz` for email, and how it got there. For the handoff procedure, see `domain-email-handoff.md`.

---

## What's live

- **Provider:** Proton Mail Plus, monthly billing (~€4.99/mo).
- **Primary address:** `hello@another-creation.xyz` (default + catch-all).
- **Login:** Proton account with username `anothercreation` (Proton-side address: `anothercreation@proton.me`). Webmail at `mail.proton.me`.
- **Status:** all green pills in Proton → Domain names (VERIFIED, 1 ADDRESS, MX, SPF, DKIM, DMARC, CATCH-ALL).

---

## Setup flow that worked

Proton's wizard runs tab-by-tab: **Domain → Verify → Addresses → MX → SPF → DKIM → DMARC**. The first two are gated; the rest are reference pages (no green checkmark on the tab itself — verification shows up on the Domain names list as pills).

1. **Sign up** at `proton.me/mail/pricing` → Mail Plus, toggle to **Monthly**. Use a neutral username (`anothercreation`), not personal email — keeps the account portable for handoff.
2. **Settings → Domain names → Add domain** → `another-creation.xyz`.
3. **Verify tab:** Proton gives a `protonmail-verification=...` TXT record. Add at Cloudflare DNS (Name `@`). Wait, click Verify.
4. **Addresses tab:** click **Add address** — Proton bounces you to **Identity and addresses**. The button labeled **Add Proton address** does in fact let you pick the custom domain from a dropdown (the label is misleading). Created `hello@another-creation.xyz`, display name **Another Creation**, set as default.
5. **MX / SPF / DKIM / DMARC tabs:** Proton displays records to add at Cloudflare. Captured in `../records/proton-records.txt` for BIND import.
6. **Catch-all:** Domain names page → action menu on the domain row → **Set catch-all** → pick `hello@`.

---

## DNS records on Cloudflare

See `../records/proton-records.txt` for the BIND zone snippet. Drag straight into Cloudflare DNS → **Import and Export → Import DNS records**.

After import: **manually flip the three `protonmail*._domainkey` CNAMEs to "DNS only" (gray cloud).** Cloudflare's import defaults CNAMEs/A records to Proxied regardless of the "Proxy imported DNS records" checkbox state — Cloudflare bug. DKIM CNAMEs MUST be unproxied or signing breaks.

The full record set ends up as:

| Type  | Name                     | Content                                | Proxy    |
|-------|--------------------------|----------------------------------------|----------|
| MX 10 | `@`                      | `mail.protonmail.ch`                   | DNS only |
| MX 20 | `@`                      | `mailsec.protonmail.ch`                | DNS only |
| TXT   | `@`                      | `v=spf1 include:_spf.protonmail.ch ~all` | DNS only |
| TXT   | `@`                      | `protonmail-verification=...`          | DNS only |
| CNAME | `protonmail._domainkey`  | `protonmail.domainkey.dxn6uszz...proton.ch.` | DNS only |
| CNAME | `protonmail2._domainkey` | `protonmail2.domainkey.dxn6uszz...proton.ch.` | DNS only |
| CNAME | `protonmail3._domainkey` | `protonmail3.domainkey.dxn6uszz...proton.ch.` | DNS only |
| TXT   | `_dmarc`                 | `v=DMARC1; p=quarantine`               | DNS only |

(`A @ → 216.198.79.1` and `CNAME www → cname.vercel-dns.com` also exist for the site itself — unrelated to email but live in the same zone.)

---

## Notes

- **E2EE stays ON** on the custom-domain address. Disabling defeats Proton's privacy guarantee for that address.
- **`.xyz` deliverability tax:** new-gTLDs (`.xyz`, `.shop`, etc.) score worse than legacy `.com` in some spam filters. For Mailchimp newsletters, expect a marginal floor — mitigatable with good DKIM/SPF/DMARC (all set) and sender reputation built over time.
- **DMARC policy:** currently `p=quarantine` (Proton's recommendation). Tighten to `p=reject` after a few weeks of clean send history if desired.
- **Proton catch-all** captures typos to any unknown `@another-creation.xyz` address into `hello@`. Cheap insurance.

---

## References

- Proton Mail custom domain docs: `proton.me/support/custom-domain`
- Proton account login: `account.proton.me`
- Cloudflare DNS for the zone: `dash.cloudflare.com → another-creation.xyz → DNS`
- BIND zone snippet: `../records/proton-records.txt`
