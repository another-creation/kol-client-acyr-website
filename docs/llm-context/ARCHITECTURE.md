# kol-acyr-website — Architecture

Load-bearing decisions and constraints. Anything in this document is "we chose this deliberately and it has downstream consequences." Do not revisit without explicit reason. For decision history (alternatives considered, rejections, and evolution), see `../history.md`.

---

## §1 — DS tier ≠ brand identity (workspace packages, separate apps)

`ac-*` everywhere refers to the design system tier (the AC DS) — extracted to `packages/ds/` in Phase 2 of the repo restructure (2026-05-18). The DS is a private workspace package (`@ac/ds`) consumed by both `apps/website/` and `apps/styleguide/` via `workspace:*` deps. Phase 1 collapsed the upstream-Kolkrabbi fiction and renamed `kol-*` → `ac-*`; Phase 2 moved everything to its workspace topology. The end-client brand is **Another Creation** (designer Ýr, Reykjavík atelier). The repo codename `acyr` = AC × Ýr. The Printful store is `acyr-test`. Vercel preview is `kol-client-acyr-website.vercel.app` (legacy URL; sweep tracked in backlog 1e). The live legacy site (Squarespace, being replaced) is `another-creation.com`.

**Consequence:** DS CSS lives in `packages/ds/{tokens,utilities,components,framework}/`. Brand identity (display name, info, business-data, images, branded-assets, placeholder-logos, logos) lives in `packages/brand-data/` as the `@ac/brand-data` workspace package. Brand-color and brand-typography stylesheets are inside `packages/ds/tokens/` — they are DS tokens parameterised by brand values, not standalone brand assets, so they belong with the cascade not the brand-data package. The single source of truth for the brand display name is `BRAND.name` in `packages/brand-data/config.js` — every page title, aria label, copy reference resolves through it. Website-only data (commerce: `shop-data.js`, `printful-products.json`; pre-Sanity: `blog-data.js`, `collections-data.js`; metadata: `seo-metadata.js`) lives at `apps/website/src/data/`.

**Do not revisit** unless the project is rebranded, the AC DS gets a real upstream extraction beyond a private workspace package, or the workspace topology itself is refactored.

---

## §2 — Iceland merchant → Stripe blocked → PayPal direct, no checkout middleware

Stripe does not onboard Icelandic entities. PayPal Business is the only viable mainstream gateway. We integrate PayPal Orders API v2 directly — PayPal JS SDK Smart Buttons on the client, Orders API on the server. No Snipcart, no Shopify, no hosted-checkout middleware (see `../history.md` for the Snipcart rejection).

**Consequence:** We own the cart, checkout, address collection, shipping rate fetch, payment integration, fulfillment dispatch, and refund flow end-to-end. PayPal hosts only the auth/approval step — the single unavoidable redirect when the customer approves payment on PayPal's domain. PayPal sandbox is a real test environment (unlike Snipcart's PayPal-blind test mode), so dev iteration doesn't need live transactions.

**Do not revisit** unless the merchant entity moves out of Iceland (Stripe becomes available) *or* PayPal terminates the Orders API.

---

## §3 — SPA + Vercel serverless functions. No SSR, no long-running backend, no database.

Vite + React 19 + `BrowserRouter` on the client. Vercel static SPA with rewrite to the metadata proxy AND Vercel serverless functions under `apps/website/api/` for the parts that need secrets or server-side trust. Vercel project Root Directory is `apps/website`; functions resolve as `/api/*` at the URL level.

Functions planned:
- `POST /api/paypal/create-order` — validate cart server-side against `printful-products.json`, call PayPal `POST /v2/checkout/orders`, return order ID to the client.
- `POST /api/paypal/capture-order` — call PayPal `POST /v2/checkout/orders/{id}/capture`, on success call Printful `POST /v2/orders` with PayPal capture ID as `external_id` for idempotency, return confirmation.
- (Phase 2) `POST /api/paypal/webhook` — async events: disputes, refunds, edge-case captures. Skip for MVP; rely on synchronous capture response.

Secrets via Vercel env vars: `PAYPAL_CLIENT_ID`, `PAYPAL_SECRET`, `PAYPAL_ENV` (`sandbox` or `live`), `PRINTFUL_TOKEN`. The PayPal *public* client ID is also exposed to the client via `VITE_PAYPAL_CLIENT_ID` for the Smart Buttons SDK URL — that's by design and safe.

**Consequence:** Stateless serverless only. No database — order state lives in PayPal + Printful and is queried via their APIs when needed. Customer order history (if ever) is fetched-on-demand from PayPal/Printful, not stored. The client never sees the PayPal secret or the Printful token. Cart totals are recomputed server-side from `printful-products.json` before order creation; the client's posted total is checked, not trusted.

**Do not revisit** unless we need stateful order tracking (admin order management UI, persistent customer accounts) that PayPal/Printful APIs can't serve at query time.

---

## §4 — AC DS cascade order is load-bearing

`apps/website/src/index.css` is three lines:

```
@import "tailwindcss";
@import "@ac/ds/index.css";
@import "./styles/site.css";
```

`packages/ds/index.css` is the canonical cascade entry for the AC DS. The 13 imports load in this exact sequence (tokens → brand → utilities → components → framework):

```
tokens/theme.css           (spacing, radius, shadow, z, transition, opacity scales)
tokens/color.css           (surface tiers, accent default — brand-neutral)
tokens/opacity.css         (fg scale + text-role classes)
tokens/typography.css      (Right Grotesk family + scales)
tokens/typography-mono.css (JetBrains Mono — DS default mono)
tokens/brand-color.css     (AC burgundy ramp + cream + accent rebind + @theme contract)
tokens/brand-typography.css(AC Right Grotesk Mono override of the DS mono token)
utilities/utilities.css    (flex-center, sr-only, text-balance, etc.)
utilities/typography-helpers.css (small mono helper-text classes)
components/atoms.css       (controls, inputs, buttons)
components/molecules.css   (popovers, pills, tooltips)
components/organisms.css   (table, etc.)
framework/framework.css    (page scaffold, sidenav layout, overlay, carousel, exit-preview)
```

Then `apps/website/src/styles/site.css` adds website-specific chrome on top.

A `@theme { --color-brand-primary: var(--brand-primary); ... }` block in `packages/ds/tokens/brand-color.css` registers brand variables as Tailwind colors, so JSX uses `bg-brand-primary` / `text-emphasis` / `bg-fg-04` rather than arbitrary `bg-[var(--…)]`.

**Consequence:** Reordering imports inside `packages/ds/index.css` silently breaks theming because cascade order determines who wins ties. The brand tokens must follow the DS-neutral tokens (rebind only works in one direction). Utilities must follow tokens (they reference token variables). Components must follow utilities (atoms reference helper classes). Framework must come last so it can override component defaults at equal specificity. New tokens added to the brand layer become Tailwind utilities only if also registered in the `@theme` block. Don't add CSS variables when a Tailwind utility already expresses the concept (global rule: Tailwind-first).

The styleguide app consumes the same cascade via `apps/styleguide/src/index.css` → `@ac/ds/index.css` + local `./styles/design-foundations.css`. One source of truth for the DS; styleguide-specific styling layered on top.

**Do not revisit** unless we move off Tailwind v4 or migrate to a different theming primitive.

---

## §5 — Product catalog is Printful-synced + hand-authored handmade, EUR

`apps/website/src/data/shop-data.js` is the source of truth structure. Two layers feed it:

1. **`apps/website/src/data/printful-products.json`** — generated by `pnpm sync-printful` (script in `scripts/sync-printful.mjs`), committed like a lockfile. Reproducible builds on Vercel — the token never reaches Vercel. Each entry carries `printfulProductId` + per-variant `syncVariantId` for clean webhook mapping.
2. **Hand-authored handmade entries** in `shop-data.js` — bespoke atelier pieces that will never be in Printful.

Two `kind` values:
- `kind: 'pod'` → Printful all-over-print, routes under `/shop`, goes through cart + PayPal.
- `kind: 'handmade'` → atelier bespoke, routes under `/handmade`, no cart (mailto enquiry only).

All prices are EUR. Printful store currency must stay EUR (set in Printful → Preferences). The legacy hand-authored POD demo entries in `shop-data.js` (~30 items scraped from Squarespace on 2026-04-28) are display-only and get pruned one-by-one as real products land in Printful.

**Consequence:** The `kind` discriminator drives routing and UI affordances. Catalog refresh = `pnpm sync-printful` → commit JSON + image → deploy. Catalog source data + commit history serve as the audit trail; no inventory DB needed because Printful POD is unlimited and handmade isn't sold through cart. Product `externalUrl` on hand-authored entries points at the legacy Squarespace page and is reference-only — never used as a live URL.

**Do not revisit** the static catalog choice unless non-engineers need to add products without a deploy.

---

## §6 — Cart + checkout pages are the real flow. PayPal Smart Buttons at the payment step.

`apps/website/src/components/site/CartContext.jsx` (localStorage `kol.ac.cart.v1`), `apps/website/src/pages/site/{Cart,Checkout,OrderConfirmation}.jsx` are **the actual flow**, not a mock to be replaced. The shape stays:

1. PDP → `addItem` → `CartContext` (localStorage).
2. `/cart` shows cart, "Checkout" navigates to `/checkout`.
3. `/checkout` collects email + delivery address through our forms. The fake card form at step 3 is replaced by **PayPal Smart Buttons** — the PayPal JS SDK renders Pay / Pay with Card / Apple Pay (when eligible) inline. No PayPal modal, no Snipcart modal, no redirect until the user actually clicks Pay.
4. Smart Buttons → on click: `POST /api/paypal/create-order` → SDK opens PayPal approval (popup or in-page redirect; modern SDK prefers popup).
5. User approves on PayPal → SDK `onApprove` callback → client `POST /api/paypal/capture-order` → server captures + creates Printful order → returns confirmation data.
6. `/checkout/confirmation` shows the real PayPal capture ID + Printful order ID, no more fabricated `IS…1234`.

The handmade flow stays unchanged: PDP routes to a `mailto:` enquiry, no cart involvement.

**Consequence:** All visible cart/checkout UI is ours. The only third-party UI is the Smart Buttons component itself (a sandboxed iframe block from PayPal). The `CartContext` keeps localStorage as the cart store (cross-tab sync, survives refresh) but a server-side recompute happens at order creation — the client is never trusted on price or total.

**Do not revisit** unless we adopt a hosted-checkout middleware later (which contradicts §2's rejection of Snipcart and similar — would need a strong new reason).

---

## §7 — Non-goals (do not reopen)

- **TypeScript.** Project is JS-only by choice; no `.ts`/`.tsx` files. ESLint flat config covers what types would.
- **Stripe.** Blocked by §2.
- **Snipcart / Shopify / any hosted-checkout middleware.** Considered and rejected — see `../history.md`. Reopening requires explicit ask.
- **A long-running backend or database.** Stateless serverless only. Order state belongs to PayPal and Printful.
- **Replacing or proxying the Squarespace site directly.** `externalUrl` on each hand-authored product points at the legacy live page for reference; this is the new site, not a wrapper.
- **Runtime validation libraries (zod, valibot).** Trust internal data, validate only at external boundaries (PayPal webhook payloads, Printful responses) when those land.
- **Customer accounts / saved addresses / order history UI.** Guest checkout only for MVP. PayPal saves payment info on its side; if customer accounts are ever needed, they can layer on top.
