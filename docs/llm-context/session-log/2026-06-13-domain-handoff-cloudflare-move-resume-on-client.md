# Session: Domain handoff — Cloudflare account move (handoff to self, resume on client computer)

**Date:** 2026-06-13
**Agent:** Grim (Claude Opus 4.8, 1M context)
**Summary:** Moved `another-creation.xyz` from the agency Cloudflare account into Ýr's own Cloudflare account (registration + freshly-rebuilt DNS zone). This is a self-handoff: the ownership handoff continues on the client's computer — domain + commerce are done, email/hosting/CMS/newsletter remain.

## Changes Made

### Files Modified
- **None in the repo.** This leg was all Cloudflare dashboard work. (Commerce file changes — `printful-products.json`, `shop-data.js`, deleted POD images, `.env.local` PayPal sandbox creds — were committed + pushed earlier today; see `2026-06-13-commerce-handoff-printful-store-migration-paypal-wire.md`.)

### What happened (domain move)
- `another-creation.xyz` moved **account→account** inside Cloudflare Registrar: agency acct `9f8f37252b7d3f6e51be37e4016d7a43` → **Ýr's** acct `384c8cbc1e9e0d14e4096b65126a2e2c`.
- **Load-bearing gotcha:** Cloudflare's "Move to another account" does **NOT** carry the DNS zone — the dialog states "zone settings will not be moved; a new zone is required." My earlier "all CNAMEs transfer" was wrong for this flow. Records had to be rebuilt in the destination account.
- Procedure used: exported the full BIND zone from the agency account → `/Users/kolkrabbi/dev/another-creation.xyz.txt` (13 records). Ýr → **Connect a domain** → chose **upload DNS zone file** (NOT auto-scan, which silently drops TXT/DKIM). New zone created on nameservers `anna` / `donald.ns.cloudflare.com`. Initiated Move-out on the agency side with her Account ID → she accepted → registration now in her account.
- Records confirmed present + correct: apex A → Vercel (216.198.79.1), `www`/`studio` CNAME → Vercel (grey/DNS-only), `brand` CNAME → Vercel (orange/proxied), 3 Proton DKIM + MailerLite `litesrv` DKIM CNAMEs, MX×2 → Proton, SPF (`include:_spf.mlsend.com include:_spf.protonmail.ch`), DMARC `p=quarantine`, Proton + MailerLite verification TXTs.

## Current State

### Working (verified live)
- Site `https://another-creation.xyz` → 200; `studio.` → 200. Email MX/SPF/DKIM/DMARC all intact (dig-verified).
- Registry (whois) **already** shows `anna`/`donald` — the move fully took.
- Commerce (PayPal + Printful) client-owned and live-proven (prior log).

### Known Issues / in-flight
- **Nameserver propagation:** public resolvers (1.1.1.1 / 8.8.8.8) still cache the old `dexter`/`elly` pair (TTL lag), so Ýr's zone shows **"invalid/pending nameservers."** This is **normal and self-resolving** — registry is already correct; clears when caches expire (≤~24h). Site + email keep working throughout because both zones hold identical records. **First thing to recheck next session:** `whois another-creation.xyz | grep -i "name server"` should be anna/donald (it is), and `dig +short NS another-creation.xyz @1.1.1.1` should flip from dexter/elly → anna/donald. Once flipped, her zone goes "Active."
- **Dark mode question (resolved, not a bug):** site default is hard dark (`<html data-theme="dark">`, no OS/`prefers-color-scheme` detection; pre-paint script only reads `localStorage['ac-theme']`). If a browser shows light, it has `ac-theme=light` saved from a manual toggle. Nothing we changed.
- `/Users/kolkrabbi/dev/sandbox live.rtf` (PayPal creds) + `/Users/kolkrabbi/dev/another-creation.xyz.txt` (zone export) are plaintext on disk — **delete both** once handoff is signed off (live PayPal creds are already in Vercel).

## Next Steps (resume on the client computer)
1. **Confirm NS propagation** flipped to anna/donald + Ýr's zone shows Active (commands above).
2. **Proton email handoff** — now zero-DNS since the zone is hers: swap recovery email to a client-controlled address, rotate password (hand over securely), disable agency 2FA → she re-enrolls, swap billing card, send test mail to `hello@`. (Login user `anothercreation`. See `docs/client/kol-client-acyr/03-infrastructure/02-handoff.md`.)
3. **Vercel + GitHub** — transfer the 3 Vercel projects (`-website`, `-studio`, `-styleguide`) to her team + the GitHub repo to her org; re-add env vars in each (they don't follow a transfer); remove agency access.
4. **Sanity** — transfer project `ajbrqqhq` (org `o1RP6YtZv` → her org); revoke `migration-script` token; verify Studio + a publish round-trip.
5. **MailerLite** — decide new-project vs user-transfer; rotate `MAILERLITE_TOKEN`.
6. **Final sign-off** — revoke developer PayPal Multi-User access to her account; delete the two plaintext files above.

### Reference values (for resume)
- Ýr Cloudflare Account ID: `384c8cbc1e9e0d14e4096b65126a2e2c` · agency: `9f8f37252b7d3f6e51be37e4016d7a43`
- Zone export: `/Users/kolkrabbi/dev/another-creation.xyz.txt`
- PayPal apps (under Ýr): sandbox `APP-84M305081Y669862Y`, live `APP-0BG03851P3671604G`
- Deferred (Ýr's call): €37 pants retail is thin over €28.55 blank cost; windbreaker slug `women-s-cropped-windbreaker` apostrophe artifact (cosmetic).
