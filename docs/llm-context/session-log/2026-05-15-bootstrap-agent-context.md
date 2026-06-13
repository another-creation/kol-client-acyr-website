# Session: Bootstrap agent-context protocol

**Date:** 2026-05-15
**Agent:** Grim (Claude Opus 4.7, 1M context)
**Summary:** Scaffolded the Kolkrabbi LLM agent-context protocol into the repo and drafted ARCHITECTURE.md + AGENT-CONTEXT.md from a first read of the codebase and the existing Snipcart integration handoff doc.

## Changes Made

### Files added (via `/init-repo` scaffold)
- `LLM_RULES.md` — startup protocol, conventions, dir layout (placeholders substituted).
- `docs/llm-context/{README,ARCHITECTURE,AGENT-CONTEXT}.md` — protocol files.
- `docs/{history,plan}.md` — decision-history + speculative-work stubs.
- `docs/llm-context/session-log/` (empty until this entry).
- `.claude/skills/{init,log-work}/SKILL.md` — `/init` and `/log-work` wired up.
- `.gitignore` already had the sentinel block; left untouched.

### Files authored beyond the scaffold
- `docs/llm-context/ARCHITECTURE.md` — 8 load-bearing decisions: KOL/brand naming, PayPal-via-Snipcart (Iceland), SPA-only on Vercel, KOL CSS import order, static EUR catalog + `kind` discriminator, current cart is a UI mock to be replaced, **SPA + Snipcart crawler is the unresolved blocker (recommended fix: static `/products.json` JSON crawler)**, non-goals.
- `docs/llm-context/AGENT-CONTEXT.md` — status, what works, what's pending, key files, consistency seams (BRAND.name, `kind`, `slug → cart line → Snipcart item → Printful variant` chain, CSS import order), 7-step prioritized roadmap, gotchas.

### Untouched
- No code under `src/` was modified.
- `docs/snipcart-paypal-integration.md` left as-is, but flagged: line 49 hard-codes `currency: 'usd'` and the catalog is EUR. Will need to be `'eur'` when the loader is wired.

## Current State

### Working
- Everything that worked before this session still works — purely a docs/scaffolding session.
- Site deployed at https://kol-client-acyr-website.vercel.app (recorded in AGENT-CONTEXT).

### Known Issues (load-bearing, repeated here)
- **SPA + Snipcart price-validation crawler** — biggest open blocker. Snipcart's order-validation fetches `data-item-url` server-side and parses the DOM; a React SPA returns an empty `#root`. ARCHITECTURE §7 lays out the three options.
- **Mock checkout looks real on the live URL.** Fake card form + fabricated `IS…1234` tracking number. Either banner it as a demo or finish the Snipcart wiring before sharing the link broadly.
- **Currency mismatch in the integration doc** (USD) vs catalog (EUR). Use EUR.

## Next Steps
1. Decide the SPA price-validation path (recommend static `/products.json`) — unblocks everything else.
2. Wire the Snipcart loader (`currency: 'eur'`) into `index.html`, swap `ProductDetail` POD CTA to `snipcart-add-item`, swap the cart icon in `SiteLayout` to `snipcart-checkout` + `snipcart-items-count`.
3. Rip out the local cart/checkout flow (`CartContext`, `Cart.jsx`, `Checkout.jsx`, `OrderConfirmation.jsx`, `/cart` + `/checkout` routes).
4. External Snipcart dashboard config — allowlist the Vercel domain, add a flat shipping method.
