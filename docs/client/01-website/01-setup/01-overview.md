---
title: Printful + PayPal direct integration — overview
type: guide
topic: setup
audience: agency-internal
status: active
related:
  - "[[01-website/01-setup/02-playbook|setup-playbook]]"
tags:
  - handoff-kit
  - client/playbook/setup
  - integration/paypal
  - integration/printful
---

# Printful + PayPal direct integration — overview

High-level step-by-step. No code, no commands — just the work in order. For the full code, env shapes, and gotcha details, see `setup-playbook.md`.

Audience: someone setting up the same commerce stack on another project, or scoping the effort before starting.

Placeholders:
- `{{BRAND_NAME}}` — display name shown to customers
- `{{BRAND_SLUG}}` — internal short codename
- `{{BRAND_DOMAIN}}` — primary domain (only used in section 10 — Sanity CMS)
- `{{CURRENCY}}` — single fixed currency the merchant operates in
- `{{MERCHANT_COUNTRY}}` — context only
- `{{SANITY_PROJECT_ID}}` — only if section 10 (Sanity CMS) is in scope

---

## What the stack does

A static frontend with cart + checkout UI, calling small serverless endpoints that talk to PayPal (payment) and Printful (catalog + fulfillment + shipping rates). No persistent backend, no database. Order state lives in PayPal and Printful, queried on demand.

```
shop  →  cart  →  /checkout
                    ├─ get real shipping rate from Printful
                    ├─ create PayPal order (server-validated total)
                    ├─ Smart Buttons → PayPal approval
                    └─ capture PayPal → create Printful order
```

PayPal capture ID is used as Printful's `external_id` — single load-bearing idempotency seam.

---

## 1. External account setup

- **Vercel** project provisioned and connected to source control.
- **Printful** API store created. **Set the store currency to `{{CURRENCY}}` under Preferences (top-right gear) — not under store or product settings.** Add at least one product with a deliberate hyphenated `external_id` slug.
- **PayPal Business** account onboarded for `{{MERCHANT_COUNTRY}}` — **owned by the client**, with the developer granted Multi-User Access (see `../paypal/paypal-handoff.md`). Two REST apps created at developer.paypal.com under the client's account:
  - `{{BRAND_SLUG}}-website-sandbox` (Sandbox pill in the left sidebar — not a tab)
  - `{{BRAND_SLUG}}-website-live`
  - Minimum-privilege features: Payment links and buttons, JavaScript SDK v6, Customer disputes. Nothing else.

Generate a Printful Private Token scoped to the store. Note both PayPal client IDs + secrets (sandbox and live).

---

## 2. Local secrets file

A `.env.local` (gitignored) holds the developer's local copies of:
- The Printful token
- The sandbox PayPal `ENV`, client ID, secret
- A duplicate of the sandbox client ID prefixed with `VITE_` so the frontend bundle can read it

The duplication is intentional — only `VITE_`-prefixed vars are exposed to the browser. The secret never gets that prefix.

---

## 3. Catalog sync

A small Node script pulls Printful's sync products + downloads one mockup image per product, then writes a committed JSON file the frontend imports. Treated like a lockfile — committed, reproducible builds, the Printful token never lives on Vercel build hosts.

The script handles a few learned quirks:
- Ignores Printful's auto-generated hex-hash `external_id` and falls back to slugified product name.
- Detects image extension from the URL (Printful mockups are PNG).
- Captures every variant with its `syncVariantId` for later mapping to Printful fulfillment.

A small per-product overrides map in the catalog file lets you add category/filter tags and editorial copy that Printful doesn't carry natively.

---

## 4. Serverless backend

Four small functions under `/api/`, plus four shared helpers.

| Function | Purpose |
|---|---|
| `POST /api/printful/shipping-rates` | Public. Returns the cheapest Printful shipping option for a given cart + delivery address. Called by the frontend after the delivery form is filled. |
| `POST /api/paypal/create-order` | Public. Validates the cart against the committed catalog (never trusts the client), fetches real shipping internally, creates a PayPal order, returns the order ID. |
| `POST /api/paypal/capture-order` | Public. Captures the approved PayPal order, then creates a Printful order using the PayPal capture ID as the `external_id` (idempotency key). Sandbox keeps Printful orders as drafts; live mode auto-confirms via `?confirm=true`. |

The shared helpers cover PayPal OAuth2 token caching, a Printful fetch wrapper, server-side cart validation against the JSON catalog, and the shipping rate fetch.

---

## 5. Checkout UI wiring

Frontend installs `@paypal/react-paypal-js`. Three-step flow on the checkout page: **email → delivery → pay**.

The pay step:
- On entry, fires a fetch to `/api/printful/shipping-rates` with the cart + delivery and shows the result in the order summary.
- Renders PayPal Smart Buttons, disabled until shipping is loaded.
- `createOrder` hits `/api/paypal/create-order`.
- `onApprove` hits `/api/paypal/capture-order` and navigates to the confirmation page with the response in route state (real capture ID + Printful order ID, no fake tracking numbers).

The fake card-form / "Place order" mock that pre-existed gets deleted entirely; PayPal's Smart Buttons component handles PayPal account, debit/credit card, and Apple/Google Pay (when eligible) as one block.

---

## 6. Cloud env vars

In the Vercel project, set five variables — sandbox values to start — scoped to **Production + Preview** only:

- `PRINTFUL_TOKEN`
- `PAYPAL_ENV` (initially `sandbox`)
- `PAYPAL_CLIENT_ID`
- `PAYPAL_SECRET`
- `VITE_PAYPAL_CLIENT_ID` (mirrors the client ID, exposes it to the browser)

Development scope is unavailable: Vercel auto-flags `*SECRET*`/`*TOKEN*` as Sensitive, which blocks Development. That's fine — local dev reads `.env.local` directly.

---

## 7. Sandbox verification

Push or redeploy after env vars are set. Walk the full flow on the Vercel preview URL using a sandbox **personal** buyer account (auto-created at developer.paypal.com → Testing Tools → Sandbox Accounts). Three-side check:

| Surface | Look for |
|---|---|
| Site confirmation page | Real PayPal capture ID + Printful order ID |
| PayPal sandbox merchant Activity | Matching captured payment |
| Printful Drafts | Order with the PayPal capture ID as the order reference (because `external_id` is set) |

Once verified, delete the Printful draft (don't click Approve — that would charge the merchant's Printful balance for a fake order).

---

## 8. Live flip

Edit four Vercel env vars — **Production scope only**, leave Preview on sandbox:

- `PAYPAL_ENV` → `live`
- `PAYPAL_CLIENT_ID` → live app's client ID
- `PAYPAL_SECRET` → live app's secret
- `VITE_PAYPAL_CLIENT_ID` → same live client ID

Redeploy Production. Run a €1 real-payment test, then refund the capture from the PayPal merchant dashboard (loses the fixed-fee portion, ~€0.35). Restore the product price after.

---

## 9. Phase 2 (deferred)

Items the MVP doesn't ship:

- PayPal webhook listener for disputes, refunds, and recovery from interrupted captures.
- Multi-image per product / per variant (sync currently grabs one preview per product).
- Color variant selection (cart deduplicates on `slug + size`, so multi-color products with one size collapse to a single line).
- VAT / tax handling beyond destination duties.
- Admin refund UI.

---

## 10. Sanity CMS (optional, for editor-managed content)

Independent of the commerce stack. Add when the brief includes editor-managed content (journal, gallery, marketing pages); skip entirely if not.

### What this gets you
- Hosted editor UI ("Studio") at `studio.{{BRAND_DOMAIN}}` where the client edits content without code changes.
- Schema-driven content modeling (e.g. articles + authors + collections + looks for a journal site).
- A public read API the frontend hits via GROQ queries. CDN-fronted, no server-side work.

### What needs to happen
1. **Sanity account + project.** Either client signs up first and invites the developer (Pattern A), or developer signs up and transfers the project to the client's org at handoff (Pattern B). See `../sanity/sanity-handoff.md` for both patterns.
2. **Studio scaffold.** `npm create sanity@latest` from repo root with `--output-path studio`. Creates a sibling folder with its own `package.json` — not a pnpm workspace.
3. **Schemas.** Authored under `studio/schemaTypes/`. Use Portable Text for any rich-text body — far better editor UX than markdown and renders via `@portabletext/react` on the frontend.
4. **Content migration.** If migrating from existing data files: a one-shot Node script using `@sanity/client.createOrReplace` with deterministic IDs (idempotent reruns) and SHA-1 asset deduplication.
5. **Frontend reads.** `@sanity/client`, `@sanity/image-url`, `@portabletext/react` installed in the main app. Pages become async with loading-state handling.
6. **Studio deploy.** Self-hosted on Vercel as a **second project** in the same repo (Root Directory `studio`, Framework Preset Sanity). Required because Sanity-hosted `*.sanity.studio` URLs don't support custom domains.
7. **DNS.** `studio.{{BRAND_DOMAIN}}` → CNAME to `cname.vercel-dns.com`, proxy OFF (same pattern as the main site's domain).
8. **CORS + Studio registration.** Five CORS origins added in `sanity.io/manage` (production site, www, studio domain, both localhost ports), all with credentials allowed. Both the vercel.app URL and `studio.{{BRAND_DOMAIN}}` registered as studio hosts.
9. **Env vars.** `VITE_SANITY_PROJECT_ID` + `VITE_SANITY_DATASET` added to the main site's Vercel project (all environments). Both public — they ship in the client bundle. Write token stays in `.env.local` only.

### What stays out of MVP
- Multi-image per gallery item or per look (single image per schema field unless explicitly modeled as an array).
- Embedded video gallery (uploaded file assets work; YouTube-style embed components removed for simplicity).
- Build-time content bake — data is fetched at runtime by default. Switch to a Vite build-time fetch if the brief moment of empty state on first load is unacceptable.

### Key gotchas
- Modern Studios must be **registered** with their public URL before they can read content from the project. Each new URL (vercel.app, custom domain) registers separately at `sanity.io/manage → project → Studios`.
- Custom domain requires **self-hosting** on Vercel — `sanity deploy` only gives `*.sanity.studio`.
- `pnpm v11` is strict about ignored build scripts; esbuild's postinstall must be approved in `studio/pnpm-workspace.yaml` (`allowBuilds.esbuild: true`).
- Edits saved in Studio go into draft state. The frontend reads `perspective: 'published'`, so unpublished edits are invisible until you click Publish.

---

## The big gotchas (read once, save an hour each)

1. Printful currency setting lives under Preferences, not store or product settings.
2. Vercel auto-flags `*SECRET*`/`*TOKEN*` as Sensitive → no Development scope. Use `.env.local`.
3. Vite dev server alone doesn't serve `/api/*` — use `vercel dev` or push to preview to test end-to-end.
4. If migrating from Snipcart: cancel the account before its next billing cycle, ignore the PayPal NVP/SOAP revocation UI (it's a deprecation maze, the permissions are inert once the third party stops calling).
5. PayPal sandbox has two auto-created accounts — pay with the Personal one, the Business one is the merchant.
6. No `vercel.json` carve-out needed for `/api/*`. Filesystem routing wins over rewrites.
7. PayPal capture ID = Printful `external_id`. That's the idempotency contract. Don't refactor away from it.
