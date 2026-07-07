# kol-acyr-website — history & decisions

Knowledge base tracking the conversation that produced this project, the alternatives considered, and the reasoning behind core decisions. Reference for humans or future AI sessions that need the *why* rather than the *what*.

For decisions as enforced rules, see `llm-context/ARCHITECTURE.md`. For current operational state, see `llm-context/AGENT-CONTEXT.md`.

---

## origin

The Acyr project (codename: AC × Ýr) is a custom-coded replacement for designer Ýr's existing Squarespace site at `another-creation.com`. The motivation: take design control of the storefront UI, move Printful fulfillment in-house via API, and exit the Squarespace platform fee. The KOL design system (`kol-*`) was applied as the visual foundation; the Acyr brand layer rebinds tokens on top.

The shop catalog was initially scraped from the live Squarespace product pages on 2026-04-28 to serve as design fixtures while the integration work was in flight. Real product migration happens product-by-product as each one lands in the `acyr-test` Printful store.

---

## alternatives surveyed and rejected

### Stripe

- The natural default for direct payment integration. Considered first.
- **Rejected:** Stripe does not onboard Icelandic merchant entities. Hard regulatory blocker — not a feature gap, a country-of-incorporation gap.

### Shopify

- Hosted commerce platform, full storefront + checkout + fulfillment integrations.
- **Rejected:** Throws away the custom design work and the KOL design system applicability. Monthly fees + transaction fees on top. Would obviate the whole project.

### Snipcart (initially adopted, later reversed)

- A drop-in JS checkout layer that supports PayPal Express Checkout natively. Picked because (a) Iceland blocked Stripe, (b) Snipcart let us avoid building a backend, (c) it was "just a script tag and some buttons." A Snipcart account was created and PayPal API permissions were granted to `geeks_api1.snipcart.com` before the repo work started.
- **Rejected after the custom cart and checkout pages were built.** Snipcart's value is a hosted checkout UI. With our own cart and checkout already designed, that value flipped negative — Snipcart's modal would replace our work, not augment it. Snipcart can't be used "just for the payment step" because its checkout is a coupled flow (cart → address → shipping → payment all live inside their modal; no public API to drop in only at payment).
- Other features Snipcart bundles (multi-gateway abstraction, fraud detection, PCI shielding, inventory tracking, subscriptions, multi-currency, abandoned cart, accounts) were either irrelevant for this store (POD with unlimited inventory, single currency, single gateway, PayPal handles its own fraud + PCI) or premature optimization (abandoned cart, accounts, discount codes).
- The fee math also failed: Snipcart 2% on top of PayPal's ~3.4% + €0.35 = €1.32 extra on a €66 bag for a checkout we wouldn't use. The Snipcart cost reverses direction the moment custom UI exists.
- Net assessment: Snipcart was adopted before the design work made clear what the checkout would look like. Reversed once the conflict was visible.

### Mollie

- Iceland-supported alternative payment gateway, mentioned in the original Snipcart handoff as a fallback if Snipcart's deprecated PayPal NVP/SOAP API became a problem.
- **Not currently chosen,** but kept as a backup option if PayPal coverage becomes a problem (e.g. a customer region where PayPal acceptance is poor). Direct-Mollie via their API is similar in shape to direct-PayPal.

---

## core principles

These emerged through iteration and now anchor the project.

- **Design control is non-negotiable.** Every commerce platform that wanted to own the checkout UI was rejected. The KOL/Acyr design surface must extend through the entire pay funnel except for the unavoidable PayPal approval step.
- **Static where possible, server-only where necessary.** SPA + serverless functions, no long-running backend, no database. Order state lives in the systems that authoritatively own it (PayPal, Printful) and is fetched on demand. Keeps the deploy surface small.
- **Printful is the source of truth for POD product data.** Hand-authored catalog entries are demo/transitional only — they get pruned as real Printful products land.
- **Don't trust the client at the security seam.** Cart contents come from localStorage and are editable. Order totals are recomputed server-side from `printful-products.json` at order creation. Catalog prices are not client-secret but client-tampered values are not honored.
- **Tailwind-first for styling.** New CSS variables only when Tailwind utilities genuinely can't express the concept. Two ways to express the same concept always drift.

---

## architectural decisions

### Why direct PayPal instead of Snipcart-managed PayPal

Snipcart's role was to be the checkout UI. Once `Cart.jsx` and `Checkout.jsx` were built in our design, Snipcart's UI was no longer an asset — it became something to work around. Direct PayPal Orders API integration gives full UI control, eliminates Snipcart's 2% per-transaction fee, removes the SPA-crawler problem (Snipcart's server-side `data-item-url` fetch returns an empty `#root`), and consolidates the moving parts (PayPal + Printful) into one serverless layer we own. The cost — having to write the integration ourselves instead of dropping in a `<script>` tag — is real but limited (~3-4 days of work) and was going to be incurred anyway for the Printful fulfillment webhook in Phase 2 of the original plan. The pivot just brings that work forward.

### Why static product JSON committed to repo

`src/brand/data/printful-products.json` is generated by `pnpm sync-printful` and committed like a lockfile. Alternatives considered:
- **Runtime API fetch via serverless proxy** — adds a moving piece that doesn't earn its keep (Printful's product API is slow and rate-limited; client-side caching would be required anyway).
- **Build-time sync without commit** (Vercel runs the sync on every deploy) — makes builds non-deterministic and forces Vercel to hold the Printful token.

Committing the JSON keeps builds reproducible from source, lets PRs show the catalog diff, and means Vercel never needs the Printful token. The sync becomes an intentional human action (`pnpm sync-printful` → review diff → commit).

### Why EUR everywhere

PayPal doesn't accept ISK. Iceland merchants set up a PayPal Business account with EUR as the receiving balance (or USD), and ISK conversion happens at withdrawal. EUR was chosen because the customer base is primarily European (per Ýr's existing Squarespace order history, not documented here but informed the call). Printful store currency was switched USD → EUR via Preferences after the initial sync surfaced the mismatch.

---

## API / interface evolution

### `data-item-id` → `syncVariantId`

Snipcart's planned integration was going to use `data-item-id` as the stable identifier mapping cart items to Printful sync variants. With Snipcart gone, the same identity chain still matters: `slug + size → syncVariantId → Printful order line`. The mapping moves from being a string attribute on a button to being a server-side lookup in `printful-products.json`. The contract stays the same; the implementation surface changes.

### `OrderConfirmation` fake tracking number

The original mock generated `IS${id.slice(-8)}1234` for visual demo purposes. Under the PayPal-direct flow, the confirmation page receives the real PayPal capture ID + Printful order ID via route state. The fabricated format gets deleted entirely.

---

## discussion outside the build

- **Squarespace coexistence.** During the build phase, the legacy Squarespace site continues to take real orders. Cutover happens after the Vercel site has run live PayPal transactions end-to-end and Ýr is comfortable with the operational workflow (sync, review, deploy).
- **Test transaction realism.** Snipcart's test mode doesn't support PayPal; PayPal sandbox is fully functional. The pivot improves dev-iteration speed because we can now test the full flow without spending real money on €1 test transactions.
- **Custom domain.** Not yet chosen. Vercel preview URL (`kol-client-acyr-website.vercel.app`) is the testing surface for now. Custom domain decision lags the cutover from Squarespace.

---

## references

- Original Snipcart handoff doc (deleted, see `client/paypal/paypal-printful-integration.md` for replacement).
- PayPal Orders API v2: https://developer.paypal.com/docs/api/orders/v2/
- Printful API v2: https://developers.printful.com/docs/v2-beta/
- KOL design system conventions: per repo `kol-*` files + global CLAUDE.md.

---

## what's *not* in this document

- Installation instructions → `../README.md`
- Load-bearing decisions stated as rules → `llm-context/ARCHITECTURE.md`
- Current state, roadmap, gotchas, contracts → `llm-context/AGENT-CONTEXT.md`
- Session-by-session dev log → `llm-context/session-log/`
- Active integration plan → `client/paypal/paypal-printful-integration.md`
- Deferred work items → `02-backlog.md`

This file is purely the decision history. Update it when a core decision is revisited or reversed, not for routine changes.
