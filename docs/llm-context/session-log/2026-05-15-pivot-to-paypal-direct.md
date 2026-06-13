# Session: Pivot to direct PayPal + implement integration

**Date:** 2026-05-15
**Agent:** Grim (Claude Opus 4.7, 1M context)
**Summary:** Killed the Snipcart plan after the user pushed on whether it added value — answer was no for a store with its own designed cart/checkout. Pivoted architecture and implemented the direct PayPal Orders API integration with Printful fulfillment in the same session.

## Changes Made

### Docs
- `ARCHITECTURE.md` rewritten: §2/§3/§6 swung to PayPal-direct + Vercel serverless; old §7 (Snipcart SPA-crawler problem) deleted.
- `AGENT-CONTEXT.md` rewritten to match the new architecture, then updated again at end-of-session to reflect implementation landed.
- `history.md` filled in — records Snipcart-considered-then-rejected with the actual reasoning (custom checkout design made Snipcart's main value negative).
- `docs/snipcart-paypal-integration.md` deleted; `docs/paypal-printful-integration.md` replaces it.

### Code
- `scripts/sync-printful.mjs` + `pnpm sync-printful` — Printful sync (downloads mockups, writes JSON). Slug heuristic ignores hex-hash external_ids; image extension detected from URL.
- `src/brand/data/printful-products.json` committed; first product (`all-over-print-gym-bag`, €66) in.
- `public/brand/shop/pod/all-over-print-gym-bag.png` committed.
- `src/brand/data/shop-data.js` — merges Printful JSON with hand-authored handmade entries; `PRINTFUL_OVERRIDES` map for per-product enrichment Printful doesn't carry.
- `api/_lib/{paypal,printful,products}.mjs` — server helpers (OAuth2 token cache, fetch wrappers, cart validation).
- `api/paypal/create-order.mjs` + `api/paypal/capture-order.mjs` — Vercel serverless endpoints. PayPal capture ID becomes Printful `external_id` for idempotency. Sandbox = draft Printful order, live = `?confirm=true`.
- `src/pages/site/Checkout.jsx` rewritten: 3 steps (email → delivery → pay). PayPal Smart Buttons replace the fake card form.
- `src/pages/site/OrderConfirmation.jsx` rewritten: reads `useLocation().state`, shows real PayPal capture ID + Printful order ID. Fake `IS…1234` tracking number gone.

### External
- Snipcart account cancelled (they billed $20 on cancellation; refund email sent).
- Printful store currency flipped USD → EUR via Preferences (it's in `Preferences`, not store or product).
- PayPal REST apps `acyr-website-sandbox` + `acyr-website-live` created with minimum-privilege features. Sandbox creds in `.env.local`.

## Current State

### Working
- Gym bag in catalog at `/shop` and `/shop/all-over-print-gym-bag`.
- Cart + checkout (through delivery) functional locally.
- PayPal Smart Buttons render at pay step.

### Known Issues / Not yet done
- **Vite dev does not serve `/api/*` routes.** Local end-to-end testing requires either `vercel dev` CLI or pushing to a Vercel preview.
- **Vercel project env vars not yet set.** Need: `PAYPAL_ENV`, `PAYPAL_CLIENT_ID`, `PAYPAL_SECRET`, `VITE_PAYPAL_CLIENT_ID`, `PRINTFUL_TOKEN`.
- **No real transaction has run yet.** Sandbox flow is wired but unproven.
- **Snipcart's old PayPal API permission** still sits inert in PayPal's NVP/SOAP UI — PayPal's revocation flow is a maze and the permission is harmless with Snipcart gone.

## Next Steps
1. Install Vercel CLI, link project, add env vars (sandbox).
2. Run sandbox end-to-end: gym bag → sandbox buyer account → approve → verify PayPal capture + Printful draft order.
3. Flip `PAYPAL_ENV=live` in Vercel and run a €1 live test with a real PayPal account; refund.
4. Phase 2: real shipping rates (Printful API), PayPal webhook listener (disputes/refunds), prune hand-authored demo POD entries as real products land in Printful.
