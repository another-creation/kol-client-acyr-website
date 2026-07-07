---
title: Domain + Email handoff — client ownership pattern
type: playbook
topics:
  - domain
  - email
audience: agency-internal
status: active
domain: another-creation.xyz
providers:
  - cloudflare
  - proton
related:
  - "[[01-website/02-commerce/01-paypal-handoff|paypal-handoff]]"
  - "[[03-infrastructure/01-proton-email-setup|proton-email-setup]]"
  - "[[03-infrastructure/_files/proton-records.txt|proton-records]]"
tags:
  - handoff-kit
  - client/handoff/domain
  - client/handoff/email
  - provider/cloudflare
  - provider/proton
  - pattern/account-internal-transfer
---

# Domain + Email handoff — client ownership pattern

The domain (`another-creation.xyz`) and the email account (Proton Mail Plus) were both registered under the agency at project start, with the intent to push to the client later. Unlike PayPal (see `../paypal/paypal-handoff.md`), neither has a Multi-User access pattern — handoff is credential / account-ownership swap, not permission revocation.

---

## Domain handoff (Cloudflare)

`another-creation.xyz` is registered at **Cloudflare Registrar**. Cloudflare supports two transfer paths:

### Path A — Account-internal move (recommended)

Cloudflare allows pushing a domain to a different Cloudflare account in the same registrar. **Instant, no auth code, no 60-day ICANN lock.** This is the cleanest option as long as the client has (or creates) a Cloudflare account.

1. Client signs up for a free Cloudflare account at `dash.cloudflare.com`.
2. Agency: Cloudflare → Registrar → `another-creation.xyz` → **Transfer to another Cloudflare account** → enter client's account email. (Path may be named "Move domain" depending on dashboard revision.)
3. Client accepts the move in their account.
4. DNS zone, all records (Vercel A, www CNAME, Proton MX/SPF/DKIM/DMARC), and the registration itself land in the client's account intact. Public WHOIS is masked by Cloudflare regardless of account — no visible change.
5. Update the billing card if applicable (renewal will now charge the client's account).

### Path B — Transfer to a different registrar (only if client refuses Cloudflare)

Standard ICANN registrar-to-registrar transfer. 60-day lock from registration date applies — for `another-creation.xyz` (registered 2026-05-16), Path B is unavailable until 2026-07-15.

1. Agency: Cloudflare Registrar → unlock domain → generate **EPP / auth code**.
2. Client initiates transfer at their chosen registrar using the auth code.
3. ~5–7 day transfer window (ICANN standard).
4. **DNS records do not travel with the registrar transfer.** Either keep Cloudflare as DNS-only post-transfer, or re-create all records at the new DNS provider before the transfer completes.

Path A is materially simpler. Default to it unless the client has a strong reason to use a different registrar.

---

## Email handoff (Proton Mail)

Proton Mail Plus is a single-owner account. There is no admin-delegate or multi-user equivalent on the consumer Mail Plus plan. Handoff = credential ownership swap.

### Pre-handoff checklist

Before swapping, the agency should:

1. Confirm `hello@another-creation.xyz` is set as default + catch-all (it is — see `proton-custom-domain.md`).
2. Note the Proton login username (`anothercreation`) and confirm the recovery email currently set.
3. Document any address-specific settings the client should keep (signatures, filters, auto-replies). Currently none.

### Swap procedure

1. **Recovery email:** Proton → Settings → Recovery → change to client's chosen address. Proton sends a confirmation link to the new address; client clicks it to confirm.
2. **Password:** generate a new strong password. Communicate via 1Password shared item or equivalent secure channel — not email/Slack/text.
3. **Two-factor:** if 2FA was enabled under the agency, disable before handing off, let the client re-enroll with their own authenticator.
4. **Billing card:** Proton → Settings → Subscription → Payment methods → remove agency card, client adds their own. (Proton charges in advance; remaining monthly period stays paid.)
5. **Hand off documentation:** point the client at `proton-custom-domain.md` (this folder) for the setup recap and `../records/proton-records.txt` for the DNS records under their care.

### After swap

- Agency no longer has any path into the Proton account. Password and recovery email both belong to client.
- Custom domain (`another-creation.xyz`), DNS records (which live in Cloudflare regardless), and `hello@` address all stay in place uninterrupted.
- If domain handoff happened first (Path A above), DNS records for Proton are already under client's Cloudflare account — no additional sync needed.

---

## Handoff order recommendation

1. **Domain first** (Cloudflare account-internal move). Confirms client has Cloudflare account; DNS for everything (Vercel + Proton) flows through it.
2. **Email second** (Proton credential swap). Once client owns the DNS zone, email keeps working without DNS edits.
3. **Then** PayPal / Printful / Vercel / GitHub per `../paypal/paypal-handoff.md`.

This order means at every step, the records the next handoff depends on are already in client's hands.

---

## Handoff verification checklist

- [ ] Cloudflare account-internal move completed; domain visible under client's Cloudflare
- [ ] All DNS records intact post-move (apex A, www CNAME, MX×2, SPF, DKIM×3, DMARC, protonmail-verification TXT)
- [ ] `https://another-creation.xyz` still loads the site
- [ ] Test email sent to `hello@another-creation.xyz` arrives in the Proton inbox
- [ ] Proton recovery email changed to client's address (confirmation link clicked)
- [ ] Proton password rotated; old credentials no longer authenticate
- [ ] Proton billing card swapped to client's payment method
- [ ] Agency 2FA disabled; client 2FA enrolled

---

## References

- Cloudflare account-internal domain move: `developers.cloudflare.com/registrar/account-management/transferring-a-domain-between-accounts/`
- Proton recovery options: `proton.me/support/set-account-recovery-methods`
- Setup recap: `proton-custom-domain.md`
- DNS records snippet: `../records/proton-records.txt`
