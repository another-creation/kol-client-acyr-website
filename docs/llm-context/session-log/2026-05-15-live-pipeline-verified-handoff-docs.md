# Session: Live pipeline verified + handoff docs

**Date:** 2026-05-15
**Agent:** Grim (Claude Opus 4.7, 1M context)
**Summary:** Live PayPal transaction verified end-to-end (€21.99 captured, refunded). Found and fixed a real shipping API bug mid-test. Reorganized client-facing docs under `docs/client/` and added a `paypal-handoff.md` covering the agency-to-client ownership pattern (PayPal Multi-User Access).

## Changes Made

### Code
- **Bug fix:** `api/_lib/shipping.mjs` was sending `sync_variant_id` to Printful's `/shipping/rates` endpoint; the endpoint requires `variant_id` (catalog ID). Caused 400 errors at the pay step. Fixed; equivalent change made to the playbook code block in `docs/client/replication-playbook.md` for posterity.
- Snapback Hat synced (€22.50, two color variants — Dark Navy + White). `PRINTFUL_OVERRIDES` entry added. `'hat'` added to Shop's type filter values.

### Docs reorg
- `docs/replication-playbook.md` → `docs/client/replication-playbook.md`.
- `docs/replication-playbook-overview.md` → `docs/client/replication-playbook-overview.md`.
- `docs/client/client-repo.md` — new, covers branching, Vercel preview workflow, daily ops.
- `docs/client/paypal-handoff.md` — new, covers Pattern A (client-owned PayPal from day one with developer Multi-User Access), migration path if already built under the agency's account, related Printful + Vercel handoff sequencing, verification checklist.
- Cross-references added between all four client docs.

### External
- **Live mode flip:** Vercel env vars split per scope — Production now serves live PayPal credentials, Preview serves sandbox. `PRINTFUL_TOKEN` shared across scopes.
- **Live €21.99 transaction completed** with a friend's PayPal (card path, since merchant can't pay themselves). PayPal capture `4HR641262H177091F`. Refunded.
- Printful order #158607130 failed in Printful with "No billing method added" — informative finding for the playbook (real orders need the merchant's card on file in Printful Settings → Billing). For this test merchant, fixing isn't priority because the integration will be re-pointed to a client-owned Printful at handoff.

## Current State

### Working
- Full live commerce pipeline proven: shop → cart → checkout → real-time Printful shipping → PayPal Smart Buttons → live PayPal capture → Printful order created.
- Shipping rates are real (not flat), keyed by destination, via `/api/printful/shipping-rates` and recomputed server-side at order creation.
- Idempotency contract working: PayPal capture ID = Printful `external_id`.

### Known Issues / Not addressed in this session
- Multi-color variant cart collapse (snapback): cart line dedupes on `slug + size`; color is invisible. Noted for later session.
- Multi-image per variant: sync grabs one preview per product. Noted for later.
- Cart thumbnails should be 1:1. Noted for later.
- Asterisk + footnote on "Shipping at checkout". Noted for later.
- Embroidery digitization fee (€5.75 one-time per design) — only matters if real embroidered products land in catalog; not a concern for the gym bag (all-over print).

## Next Steps
1. (Client side) Client creates their own PayPal Business + Printful accounts. Grants developer Multi-User Access on PayPal. Adds Printful billing.
2. (Migration) Recreate sandbox + live PayPal REST apps under the client's account, swap Vercel env vars (Production → client's live creds, Preview → client's sandbox), redeploy, rerun sandbox + €1 live verification on client-owned credentials.
3. Address the "Noted for later" UI items (asterisk, thumbnails, button variant) before public launch.
4. Plan the deeper variant-color + multi-image refactor session.
