# Session: First sandbox transaction — pipeline proven end-to-end

**Date:** 2026-05-15
**Agent:** Grim (Claude Opus 4.7, 1M context)
**Summary:** Ran the first sandbox PayPal payment all the way through. Site → PayPal → Printful all three sides agreed on a single transaction. Architecture verified; ready to flip Production to live mode.

## Changes Made

### Code
- `.gitignore` — added explicit `.env`, `.env.*`, `!.env.example`, and `.vercel/` patterns. The pre-existing `*.local` rule was technically covering `.env.local` but the user was rightly nervous about relying on a catch-all for secrets. Belt-and-suspenders now.

### External
- Snipcart account cancellation triggered a $20 final charge. Refund email sent to `support@snipcart.com`; outcome pending.
- Vercel env vars set for **Production + Preview** scopes (Development scope skipped because Vercel auto-marks `PAYPAL_SECRET` / `PRINTFUL_TOKEN` as Sensitive and disallows Development for those).
- First sandbox transaction completed.

## Verification (this session)

End-to-end flow tested with sandbox personal account (John Doe, $5,000 USD sandbox balance):

| Surface | Result |
|---|---|
| `/checkout` → 3 steps | Email + delivery + pay all render correctly |
| `<PayPalButtons>` | Renders, Smart Buttons SDK loads with `VITE_PAYPAL_CLIENT_ID` |
| `/api/paypal/create-order` | €76 total computed server-side (€66 + €10 shipping), PayPal order created |
| PayPal sandbox approve | Logged in as personal account, approved €76.00 EUR |
| `/api/paypal/capture-order` | Captured + Printful draft created |
| `/checkout/confirmation` | Shows real PayPal capture ID `66M964261K833382E` and Printful order `#158586472` |
| PayPal sandbox merchant Activity | €76.00 EUR received from John Doe, status Completed |
| Printful Drafts | Order `66M964261K833382E` (PayPal capture ID = `external_id`), recipient correct, total €56.72 wholesale |

Idempotency contract working as designed: PayPal capture ID is the Printful `external_id`. Test draft deleted from Printful after verification.

## Findings worth recording

- **Real margin on the gym bag to Iceland:** retail €76 − Printful cost €56.72 − PayPal fee ~€2.58 ≈ **€16.70 profit**.
- **Flat shipping is a small leak:** we charge €10, Printful charges us €13.99 to ship to Iceland → we lose €3.99 per bag on shipping alone (offsets margin above). Could be much worse for non-EU destinations. Phase 2 fix is real Printful shipping rates; interim fix is bumping the flat constant to €15–€20.
- **Printful wholesale ≠ what the Printful product page shows in USD.** $50.50 wholesale × ~0.84 FX ≈ €42.42, and Printful's invoice shows €42.73 — close. Currency conversion happens at order time, not when the catalog was switched to EUR.

## Current State

### Working
- Full sandbox pipeline: shop → cart → checkout → PayPal sandbox → confirmation → Printful draft.
- All idempotency / cross-system mapping verified once.

### Known Issues
- **Flat €10 shipping leaks margin** (see above). Tune the constant before launch.
- **Snipcart refund** still outstanding; no response yet.

## Next Steps
1. Decide whether to bump `FLAT_SHIPPING_EUR` (in both `api/_lib/products.mjs` and `src/pages/site/Checkout.jsx`) before live, or accept the leak and fix in Phase 2.
2. Flip Production scope to live: update `PAYPAL_ENV`, `PAYPAL_CLIENT_ID`, `PAYPAL_SECRET`, `VITE_PAYPAL_CLIENT_ID` to the `acyr-website-live` values. Leave Preview on sandbox.
3. Live test: set gym bag to €1 in Printful, sync, deploy, real PayPal purchase from a different account, refund yourself, restore price.
4. Phase 2 backlog (unchanged): real shipping rates, PayPal webhook listener, prune hand-authored demo entries.
