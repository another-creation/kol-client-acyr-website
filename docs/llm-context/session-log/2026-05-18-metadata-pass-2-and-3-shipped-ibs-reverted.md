# Session: Metadata Pass 2 + 3 shipped + Ignored Build Step reverted + HANDOFF.md + social-channel reconciliation

**Date:** 2026-05-18
**Agent:** Grim (Claude Opus 4.7, 1M context)
**Summary:** Dynamic-route metadata (Sanity + shop-data) live in production via f53e478. Vercel Ignored Build Step reverted to Automatic on all three projects after second attempt at the skip script silently cancelled valid builds. HANDOFF.md authored as the project root quicklook. SOCIAL array gained TikTok + X. Companion playbooks for SMB-Tailscale and git-as-sync drafted at /docs/.

## Changes Made

### Metadata Pass 2 + Pass 3 — shipped as `f53e478` (live)

- `apps/studio/schemaTypes/article.js` — added collapsible `seo` field group (`seoTitle`, `seoDescription`, `ogImage`).
- `apps/studio/schemaTypes/collection.js` — same.
- `apps/website/api/_lib/sanity.mjs` — new. Server-side `@sanity/client` + `@sanity/image-url`. Three fetchers (`fetchArticleMeta`, `fetchCollectionMeta`, `fetchAuthorMeta`) returning normalized meta objects. Image URLs rendered at 2400×1260 (1.91:1) with `auto('format')`.
- `apps/website/api/_lib/meta-resolver.mjs` — new. Async dispatcher. Tier 1 (Sanity) covers `/blog/author/:slug`, `/blog/:slug`, `/collections/:slug`. Tier 2 (shop-data) covers `/shop/:slug` (pod) and `/handmade/:slug` (handmade). Falls through to the existing static map + prefix fallback on miss; `withFallback` merges specific lookups with parent route metadata so missing fields inherit from `/blog`, `/collections`, etc.
- `apps/website/api/metadata-proxy.mjs` — switched from synchronous `lookupMeta` to `await resolveMeta(pathname)`. Single-line change.
- Editors get auto-coverage for existing content via the fallback chain (`seo.seoTitle` → `title`, `seo.seoDescription` → `excerpt`, `seo.ogImage` → `cover`). SEO group is pure override.

### Vercel Ignored Build Step — reverted

- Attempt 2 (`git diff --quiet "${VERCEL_GIT_PREVIOUS_SHA:-HEAD^}" HEAD -- <paths>`) silently cancelled all three projects on the f53e478 push, including website + studio which legitimately touched paths in their filters.
- Root cause not diagnosed — eating ~30 s of build time per push was a smaller cost than continuing to debug.
- All three Vercel projects flipped to *Settings → Build & Deployment → Ignored Build Step → **Automatic***.
- `docs/backlog.md` 7e flipped from ✅ to ❌ with revert annotation.
- `docs/backlog-notes.md#7e` rewritten — captures both abandoned commands, why each broke, and what to look at if it's ever revisited.
- AGENT-CONTEXT entry updated.

### HANDOFF.md — project quicklook

- New: `docs/client/kol-client-acyr/HANDOFF.md`. UPPERCASE meta file at the kol-client-acyr project root (exempt from framework's `NN-` prefix rule).
- Sections: site overview, brand, credentials note (Bitwarden), providers table (Description / User / Pass / Integration / Ownership / Status / Link), Proton aliases table, handoff playbook pointers, status caveats.
- Provider table covers Cloudflare, Vercel, GitHub, Sanity, MailerLite, Proton, PayPal, Printful, Bitwarden. All Ownership rows = "not yet transferred". User column blank where not factually known (no guessed values).
- Proton aliases: `hello@` (default + catch-all + newsletter sender), `yr@`, `dev@`, `billing@`, `legal@`, `noreply@`.
- Project `INDEX.md` updated with "Start with HANDOFF.md" callout.

### Social channel reconciliation (backlog 10)

- `packages/brand-data/business-data.js` — added TikTok (`@yr_another_creation`) and X (`@xYrx`, Ýr's secondary) to `SOCIAL` array.
- `docs/client/kol-client-acyr/02-brand/01-contact-and-identity.md` — Social table updated.
- `docs/client/kol-client-acyr/02-brand/02-career-and-press.md` — Social table updated. Three surfaces now in sync.
- `docs/backlog.md` item 10 — added the X line.

### Cross-machine sync exploration — companion playbooks

- `docs/smb-local-server-playbook.md` — new. Host an SMB share at home, reach it on LAN + over Tailscale for off-network work. Hardware options, server setup (macOS / Linux / Synology), Tailscale layer, client mount, backup.
- `docs/git-repo-docs-playbook.md` — new. Companion. Three approaches (Obsidian Git plugin for vault, chezmoi/yadm for dotfiles, custom launchd script for arbitrary folders). Conflict handling, gitignore essentials, "when to pick this vs SMB" cross-link.
- Both files at `/docs/` root, lean.

### Global CLAUDE.md — docs framework conformance

- `~/.claude/CLAUDE.md` — added new section "Docs in kol-system projects". Reinforces that markdown authoring in projects with `docs/_framework/` must conform: numbered playbook sections, list-form tags with namespace, explicit-with-display wikilinks, mutual `related:` cross-references, `NN-` prefix unless meta file.

### Backlog additions

- **15** Metrics — Umami wire-up (decide hosted vs client-owned, then uncomment script in `init-scaffold`)
- **16** SEO provider open question (Ahrefs / Semrush / GSC-only)
- **17** Journal label vs `/blog` URL mismatch — pick `/journal` rename + redirect or accept the drift
- **18** Vercel CNAME deprecation — swap legacy `cname.vercel-dns.com` for per-project regional targets on the 3 Vercel-hosted CNAMEs at Cloudflare

### Item 13 (Client overview doc) closed

- `HANDOFF.md` satisfies the long-open "Create an overview doc for client" item. Marked ✅ with path link.

## Current State

### Working

- f53e478 live on website + studio. Dynamic-route OG metadata now serves per-article / per-collection / per-author / per-product previews (with parent-route fallback on miss).
- Three Vercel projects on Automatic Ignored Build Step — every push rebuilds; no more silent skips to debug.
- HANDOFF.md is the canonical one-page reference; linked from project INDEX.
- Social channels canonical in business-data.js (5 platforms, 7 entries including secondaries).
- SMB + Git playbooks available as alternatives for cross-machine docs sync.

### Known Issues / Deferred

- **Build Logs from canceled IBS deployment never inspected** — root cause of Attempt 2 silent-skip remains unknown. Captured in backlog-notes.md#7e as the next-time entry point.
- **Footer.jsx still hardcodes its `SOCIAL` list** — drift surface. Same future-pass that moves socials into `info.js` should refactor Footer to import.
- **8j design rework** — the only newsletter functional work left. Pipeline complete + metadata live; no more blockers.
- **uBlock blocks MailerLite confirmation link** — Free tier limitation, workaround is the "Proceed" button.

## Next Steps

1. **8j newsletter design rework** — both home card + footer strip. Pipeline + metadata stable; clean slate for design.
2. **Verify Pass 2/3 in production** — share a `/blog/<slug>` URL into iMessage / X / Slack, confirm article-specific OG image renders. Same for `/collections/<slug>` and `/shop/<slug>`.
3. **Add `og:image` fields to Sanity content** when overriding the cover image makes sense (per-article; not required, fallback already covers).
4. **18 Vercel CNAME swap** when convenient — 10-min, low-risk.
5. **kol-system git** — out-of-repo but high-leverage; see kol-system/README.md future plans.
