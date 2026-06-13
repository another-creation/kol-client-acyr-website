# Session: Custom domain + Proton email live, handoff docs expanded

**Date:** 2026-05-16
**Agent:** Grim (Claude Opus 4.7, 1M context)
**Summary:** Registered `another-creation.xyz` at Cloudflare, wired Vercel + Proton Mail Plus, added domain/email handoff docs, restructured `docs/client/` with rich Obsidian Properties frontmatter, fixed `/log-work` skill ordering.

## Changes Made

### Files Modified
- `docs/plan.md` → `docs/backlog.md` — renamed (open from prior session), reordered with custom domain at #1, added a–f sub-list for the domain rollout. a–d marked done; e (code cleanup) + f (later client handoff) remain. Updated cross-refs in `LLM_RULES.md`, `docs/history.md`, `docs/llm-context/AGENT-CONTEXT.md`, `docs/client/replication-playbook.md`.
- `docs/client/proton-custom-domain.md` — new. Setup recap: `hello@another-creation.xyz` default + catch-all, the verify→addresses→MX/SPF/DKIM/DMARC flow, DNS table, gotchas (Cloudflare's BIND import auto-proxies CNAMEs; "Add Proton address" button does support custom domain despite the label).
- `docs/client/domain-email-handoff.md` — new. Handoff playbook covering Cloudflare account-internal domain move (instant, no auth code, no ICANN 60-day lock) + Proton credential swap (recovery email → password → 2FA reset → billing card). Recommends handing off domain first so DNS zone is in client's account before email.
- `docs/client/records-bind/proton-records.txt` + `proton-records-bind.md` — new. BIND zone snippet for Cloudflare DNS import + human-readable notes. Moved into a `records-bind/` subfolder to keep `docs/client/` clean.
- All six `.md` files in `docs/client/` — added rich Obsidian Properties frontmatter. Common fields: `title`, `type`, `topic`/`topics`, `audience`, `status`, `related` (as `"[[wikilinks]]"`). Doc-specific fields: `provider`/`providers`, `plan`, `primary_address`, `catch_all`, `domain`. Tag scheme: flat umbrella `handoff-kit` + nested trees `client/handoff/...`, `client/playbook/...`, `client/setup/...`, `provider/...`, `pattern/...`, `tool/...`, `integration/...`.
- `.claude/skills/log-work/SKILL.md` + `~/.claude/skills/init-repo/templates/.claude/skills/log-work/SKILL.md` — reordered. Old flow wrote the entire session log before asking about handoff. New flow asks first (right after reading AGENT-CONTEXT), then writes all artifacts in one pass based on the answer. Template synced so future scaffolds inherit the fix.

### Features Added/Removed
- **Custom domain live.** `https://another-creation.xyz` resolves to Vercel; `www` redirects to apex (307). HTTPS valid on both. Cloudflare DNS: A apex → `216.198.79.1`, CNAME `www → cname.vercel-dns.com`, proxy OFF on both.
- **Email live on Proton Mail Plus monthly.** All status pills green (VERIFIED, 1 ADDRESS, MX, SPF, DKIM, DMARC, CATCH-ALL). `hello@another-creation.xyz` is default + catch-all.
- **Docs taxonomy.** `docs/client/` is now an Obsidian-queryable kit with `handoff-kit` as the flat umbrella tag plus per-doc faceted tag trees and typed Properties.

## Current State

### Working
- Custom domain serving the SPA over HTTPS.
- Email through Proton custom-domain inbox, catch-all on.
- Full DNS record set at Cloudflare: Vercel A + www CNAME, Proton MX×2 + SPF + DKIM×3 + DMARC + `protonmail-verification` TXT.
- Backlog reordered + renamed. Item #1 mostly done; queue continues with #2 SANITY CMS, then #3 multi-image + color variants.
- `/log-work` skill now asks about handoff before writing.

### Known Issues
- **Cloudflare BIND import auto-proxies CNAMEs/A records** regardless of the "Proxy imported DNS records" checkbox state. Manual gray-cloud sweep needed post-import. Captured in `proton-custom-domain.md`.
- **`.xyz` email deliverability tax.** Mailchimp newsletters from `@another-creation.xyz` will hit a slight floor in some spam filters vs legacy `.com`. SPF/DKIM/DMARC all set; DMARC at `p=quarantine` — tighten to `p=reject` once a clean send history accumulates.
- **NS propagation delay on fresh `.xyz`** caused initial Vercel "Invalid Configuration" + Proton verify failures. Resolved after the `.xyz` registry published Cloudflare nameservers. Worth flagging if a future `.xyz` registration looks broken right after purchase.
- **Vercel "DNS Change Recommended"** on the `www` redirect row. Cosmetic — site works. Not investigated.

## Next Steps
1. **Backlog item 1e** — sweep the codebase for hard-coded `kol-client-acyr-website.vercel.app` strings (canonical URLs, sitemap, OG/meta, PayPal app return URLs) and replace with `another-creation.xyz`. Then redeploy.
2. **Backlog item 2** (SANITY CMS) is now top of the remaining work queue — move journal + collections out of hand-authored data files so Ýr can publish without a code change.
3. **Backlog item 1f** stays pending until client has a Cloudflare account + is ready to receive the domain + Proton handoff.
