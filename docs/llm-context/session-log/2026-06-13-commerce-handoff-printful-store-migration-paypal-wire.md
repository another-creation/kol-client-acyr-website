# Session: Commerce handoff — Printful store migration + PayPal client-account wire + live verify

**Date:** 2026-06-13
**Agent:** Grim (Claude Opus 4.8, 1M context)
**Summary:** Moved the live commerce stack onto the client's own accounts — re-synced the catalog from Ýr's Printful store (EUR fix), created fresh PayPal REST apps under her Business account, wired both per Vercel scope, and verified the full pipeline with one real €46.99 live checkout into her balance.

## Changes Made

### Files Modified
- `apps/website/src/data/printful-products.json` — regenerated via `pnpm sync-printful` against **Ýr's own store**. Replaced the 3 demo items (unisex t-shirt / snapback / gym bag from the retired `acyr-test` store) with her two real products: `all-over-print-unisex-wide-leg-pants` (€37 / max €45, 11 variants) and `women-s-cropped-windbreaker` (€37.50 / max €39, 6 variants). First sync came back **USD** → fixed at source (Printful → Preferences → EUR) and re-synced; now EUR.
- `apps/website/src/data/shop-data.js` — `PRINTFUL_OVERRIDES` rewired off the dead old slugs onto the two new ones: pants → `type:'pants'` + `SPEC.pants`, windbreaker → `type:'jacket'` + `SPEC.windbreaker` (excerpts pulled from existing SPEC blurbs, no invented copy). Synced products still spread first in `PRODUCTS`, so they're the first POD items automatically.
- `apps/website/public/brand/shop/pod/` — deleted orphaned images for the departed products: `all-over-print-gym-bag/` + `.png`, `snapback-hat/` + `.png`, `unisex-t-shirt/` + `.png`. Confirmed zero source references first.
- `.env.local` — PayPal creds swapped to Ýr's **sandbox** app pair (`PAYPAL_CLIENT_ID` / `PAYPAL_SECRET` / `VITE_PAYPAL_CLIENT_ID`), `PAYPAL_ENV=sandbox`. Live creds intentionally kept off the local machine. (`PRINTFUL_TOKEN` already swapped to her store token earlier.)

### Provider / account changes (done by user, recorded here)
- **Printful:** new store under Ýr's account; old `acyr-test` temp store retired. Store currency EUR. Her billing card connected. New store-scoped Private Token (scopes: *View+manage orders*, *View products* only — Files/Webhooks left off).
- **PayPal:** two fresh **Merchant**-type REST apps created under Ýr's Business account (apps can't transfer between accounts) — `acyr-website-sandbox` (app `APP-84M305081Y669862Y`) + `acyr-website-live` (app `APP-0BG03851P3671604G`), minimum features.
- **Vercel:** PayPal creds split by scope — **Production = live pair, Preview = sandbox pair**; `VITE_PAYPAL_CLIENT_ID` = same id as `PAYPAL_CLIENT_ID` per scope (public browser mirror, never the secret); `PAYPAL_ENV` (`live`/`sandbox`) left as-is from the agency build. `PRINTFUL_TOKEN` = her store token. Catalog changes committed + pushed; redeployed green.

## Current State

### Working (verified)
- Commerce (PayPal + Printful) is **client-owned and live-proven**. Both PayPal cred sets authenticate (OAuth 200, read-only checks).
- Live end-to-end test on another-creation.xyz: real pants checkout, customer paid **€46.99** (€37 item + €9.99 Printful real-time shipping) into **Ýr's** PayPal balance; Printful order **#PF162418628** created correctly in her store (pants / XS / White, correct recipient). Order stopped safely at "No billing method" (billing was off for the test). Test order **deleted**, PayPal payment **refunded** (€46.99), then her billing card connected → real orders now confirm + fulfill.
- This proves capture → her balance, the Printful order-creation leg against her store/token/new variant IDs, and the EUR money math. Only the final confirm → production wasn't exercised (a Printful billing toggle, not code).

### Known Issues / open
- **Economics:** pants retail €37 vs Printful cost €28.55 blank + €9.99 shipping − €4.84 discount = €33.70 → ~€13 gross / ~€11 after PayPal fees. €37 is only €8.45 over the blank cost — thin. Ýr to revisit pricing in Printful (number change, not code).
- Windbreaker slug `women-s-cropped-windbreaker` has an apostrophe artifact (cosmetic).
- Catalog is now just the 2 real POD products + the hand-authored demo capsule (metal/earth/art-deco) still present in `shop-data.js`.
- Developer's PayPal Multi-User access to Ýr's account **not yet revoked** — do at final sign-off, not before.

## Next Steps
1. Continue the ownership handoff — remaining phases: **domain (Cloudflare account-internal move)** → **email (Proton credential swap)** → **Vercel + GitHub** (3 projects) → **Sanity project transfer** (`ajbrqqhq`) → **MailerLite**.
2. Final sign-off: revoke developer PayPal Multi-User access; confirm no agency-held tokens remain.
3. Optional: tidy the windbreaker slug; Ýr to set proper EUR retail prices.
