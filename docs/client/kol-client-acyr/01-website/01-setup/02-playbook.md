---
title: Printful + PayPal direct integration — replication playbook
type: playbook
topic: setup
audience: agency-internal
status: active
related:
  - "[[01-website/01-setup/01-overview|setup-overview]]"
  - "[[01-website/01-setup/03-repo-workflow|repo-workflow]]"
  - "[[01-website/02-commerce/01-paypal-handoff|paypal-handoff]]"
tags:
  - handoff-kit
  - client/playbook/setup
  - integration/paypal
  - integration/printful
  - integration/vercel-serverless
---

# Printful + PayPal direct integration — replication playbook

A sequential, copy-pasteable runbook for setting up the full commerce stack (Printful catalog sync + PayPal Smart Buttons + real-time shipping + Vercel serverless fulfillment) on a fresh client repo.

For the *why* behind the architectural choices, see `llm-context/ARCHITECTURE.md` and `history.md` in this repo. This doc is purely "do these things in this order."

Placeholders:
- `{{BRAND_NAME}}` — display name (e.g. `Another Creation`)
- `{{BRAND_SLUG}}` — short codename (e.g. `acyr`)
- `{{BRAND_DOMAIN}}` — primary domain (e.g. `another-creation.xyz`)
- `{{PRINTFUL_STORE}}` — Printful API store name (e.g. `acyr-test`)
- `{{CURRENCY}}` — fixed currency code (e.g. `EUR`)
- `{{MERCHANT_COUNTRY}}` — for context only (e.g. Iceland)
- `{{SANITY_PROJECT_ID}}` — only if section 11 (Sanity CMS) is in scope (e.g. `ajbrqqhq`)

---

## 0. Prerequisites

You will need accounts at:
- **Vercel** — connected to a GitHub repo. Project created.
- **Printful** — API store (not Etsy/Shopify-linked). Currency set to `{{CURRENCY}}`.
- **PayPal Business** — onboarded for `{{MERCHANT_COUNTRY}}`. Note: Stripe doesn't onboard merchants in Iceland; that's why PayPal is the gateway here.

Stack assumed by the playbook:
- Vite + React 19 SPA
- Tailwind v4 (registered design tokens via `@theme`)
- `react-router-dom` v7
- pnpm
- Node 20+ on Vercel (default)

If the stack differs significantly, the React snippets need adapting but the serverless functions and external setup are stack-agnostic.

---

## 1. Repo scaffolding

### LLM agent context (optional but recommended)

Run the `/init-repo` skill in a fresh repo to scaffold `LLM_RULES.md`, `docs/llm-context/`, `docs/history.md`, `docs/backlog.md`, and the `/init` + `/log-work` skills. This isn't payment-specific but pays for itself across the project.

### .gitignore

Append explicit env + Vercel patterns to `.gitignore`:

```gitignore
# Environment files
.env
.env.*
!.env.example

# Vercel CLI local state
.vercel/
```

`*.local` would technically cover `.env.local` but **be explicit** — relying on a less-obvious catch-all for secrets is exactly the kind of thing that bites you on the first `git add -A`.

---

## 2. Printful setup

### 2.1 Store currency

The single trap that costs an hour if missed: **store currency is configured under `Preferences`, not in store settings and not per-product**. The "Edit retail prices" screen on a product has no currency picker.

1. Printful dashboard → top-right gear → **Preferences** → set currency to `{{CURRENCY}}`.
2. **Prices don't auto-convert.** If you flip from USD to EUR, the numeric value (e.g. `66`) stays and gets relabeled as €66. Re-enter retail prices manually if you want them tuned.

### 2.2 Add a product

Set the product's `external_id` to a meaningful slug **containing a hyphen** (e.g. `gym-bag` or `acyr-gym-bag`). The sync script ignores hex-hash auto-generated external_ids and falls back to slugifying the name, which is usually fine but a deliberately-set external_id is more stable across renames.

### 2.3 Generate a Printful Private Token

developer.printful.com → Tokens → Create token. Scope to the store. Save the value somewhere safe.

---

## 3. Sync script

Pulls Printful catalog into a committed JSON + downloads mockup images. Treated like a lockfile — committed, reproducible builds.

### 3.1 Create `scripts/sync-printful.mjs`

```js
#!/usr/bin/env node
import { writeFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const TOKEN = process.env.PRINTFUL_TOKEN
if (!TOKEN) {
  console.error('Missing PRINTFUL_TOKEN. Add it to .env.local.')
  process.exit(1)
}

const API         = 'https://api.printful.com'
const IMG_DIR     = resolve('public/brand/shop/pod')
const IMG_URL_DIR = '/brand/shop/pod'
const OUTPUT_JSON = resolve('src/brand/data/printful-products.json')

const slugify = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

// Printful auto-fills external_id with a hex hash when none is set.
// Only trust the field when it looks deliberate — i.e. has a hyphen.
const slugFromProduct = (sp) => {
  const ext = sp.external_id?.trim()
  if (ext && /-/.test(ext)) return ext
  return slugify(sp.name)
}

const extFromUrl = (url) => {
  const m = url.split('?')[0].match(/\.(png|jpe?g|webp|gif)$/i)
  return m ? m[1].toLowerCase().replace('jpeg', 'jpg') : 'png'
}

async function pf(path) {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  })
  const body = await res.text()
  if (!res.ok) throw new Error(`Printful ${path} → ${res.status}: ${body.slice(0, 300)}`)
  return JSON.parse(body).result
}

async function downloadImage(url, dest) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Image ${url} → ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(dest, buf)
}

async function main() {
  await mkdir(IMG_DIR, { recursive: true })

  const list = await pf('/sync/products')
  console.log(`Printful → ${list.length} sync product(s)`)

  const products = []

  for (const summary of list) {
    if (summary.is_ignored) continue
    const detail   = await pf(`/sync/products/${summary.id}`)
    const sp       = detail.sync_product
    const variants = detail.sync_variants.filter((v) => !v.is_ignored)
    if (variants.length === 0) continue

    const slug         = slugFromProduct(sp)
    const firstVariant = variants[0]
    const previewUrl   = firstVariant.files.find((f) => f.type === 'preview')?.preview_url
    const imageExt     = previewUrl ? extFromUrl(previewUrl) : 'png'
    const imageRelPath = `${IMG_URL_DIR}/${slug}.${imageExt}`

    if (previewUrl) {
      await downloadImage(previewUrl, resolve(`public${imageRelPath}`))
      console.log(`  ${slug} ← image (.${imageExt})`)
    }

    const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))]

    products.push({
      source:            'printful',
      printfulProductId: sp.id,
      slug,
      name:              sp.name,
      price:             Number(firstVariant.retail_price),
      currency:          firstVariant.currency,
      image:             imageRelPath,
      sizes:             sizes.length > 0 ? sizes : ['One size'],
      variants: variants.map((v) => ({
        syncVariantId:    v.id,
        catalogVariantId: v.variant_id,
        size:             v.size || 'One size',
        color:            v.color || null,
        retailPrice:      Number(v.retail_price),
        currency:         v.currency,
        sku:              v.sku,
      })),
    })
  }

  await writeFile(OUTPUT_JSON, JSON.stringify(products, null, 2) + '\n')
  console.log(`✓ Wrote ${products.length} product(s) → ${OUTPUT_JSON.replace(resolve('.'), '.')}`)
}

main().catch((err) => { console.error(err.message); process.exit(1) })
```

### 3.2 Wire into package.json

```json
"scripts": {
  "sync-printful": "node --env-file=.env.local scripts/sync-printful.mjs"
}
```

The `--env-file` flag is Node 20.6+. Loads `.env.local` without dependencies.

### 3.3 First run

After putting `PRINTFUL_TOKEN=...` in `.env.local`:

```sh
pnpm sync-printful
```

You should see `Printful → N sync product(s)` and one image per product downloaded.

### 3.4 Merge into the catalog

In `src/brand/data/shop-data.js` (or whatever holds your catalog), import + map:

```js
import printfulProducts from './printful-products.json' with { type: 'json' }

// Per-product enrichment for fields Printful doesn't carry
// (filter category, capsule print, copy).
const PRINTFUL_OVERRIDES = {
  // 'gym-bag': { type: 'bag', excerpt: 'Recycled all-over-print gym bag.' },
}

const fromPrintful = (p) => pod({
  slug:              p.slug,
  name:              p.name,
  price:             p.price,
  currency:          p.currency,
  image:             p.image,
  sizes:             p.sizes,
  print:             null,
  type:              null,
  excerpt:           '',
  description:       null,
  printfulProductId: p.printfulProductId,
  variants:          p.variants,
  ...(PRINTFUL_OVERRIDES[p.slug] ?? {}),
})

export const PRODUCTS = [
  ...printfulProducts.map(fromPrintful),
  // ...hand-authored entries here
]
```

`pod()` is whatever factory tags POD products in your catalog. The point is: Printful entries get prepended; hand-authored entries (e.g. bespoke/handmade items not in Printful) coexist.

---

## 4. PayPal setup

> **If building for a client**, the REST apps should be created under the **client's** PayPal Business account via Multi-User Access — not yours. See `../paypal/paypal-handoff.md` for the kickoff sequence. The steps below describe the app creation flow itself; whose account is doing it is the question `../paypal/paypal-handoff.md` answers.

### 4.1 Create REST apps

developer.paypal.com → Apps & Credentials.

The **Sandbox/Live toggle is a pill in the left sidebar, under the PayPal logo** — not a tab.

1. Pill = **Sandbox** → **Create App** → name `{{BRAND_SLUG}}-website-sandbox` → app type Merchant.
2. On the app config screen, set features to:
   - ✅ Payment links and buttons
   - ✅ JavaScript SDK v6
   - ✅ Customer disputes
   - ❌ Subscriptions, Payouts, Mobile SDKs, Save payment methods, Invoicing, Log in with PayPal, Transaction search
3. Save. Copy **Client ID** and reveal/copy **Secret**.
4. Flip pill to **Live**. Repeat: app name `{{BRAND_SLUG}}-website-live`, same feature checkboxes, copy creds.

The sandbox dashboard auto-creates a Personal buyer + a Business merchant account under Testing Tools → Sandbox Accounts. You'll use the Personal account to test purchases.

### 4.2 .env.local

Add to `.env.local` (the merchant's local-dev secrets file):

```
PRINTFUL_TOKEN=<from §2.3>

# PayPal — values from the `{{BRAND_SLUG}}-website-sandbox` app.
# Live values from `{{BRAND_SLUG}}-website-live` go in Vercel env vars only.
PAYPAL_ENV=sandbox
PAYPAL_CLIENT_ID=<sandbox client ID>
PAYPAL_SECRET=<sandbox secret>
VITE_PAYPAL_CLIENT_ID=<same sandbox client ID — duplicate is intentional>
```

The `VITE_` prefix exposes a var to the browser bundle. The Smart Buttons SDK in the React app reads `VITE_PAYPAL_CLIENT_ID` at build time. **Never** prefix `VITE_` on a secret.

### 4.3 If migrating from Snipcart (skip otherwise)

If the prior gateway was Snipcart with PayPal Express Checkout permissions:
- Cancel the Snipcart account before its next billing cycle (Snipcart's live-mode floor is ~$20-25/mo and **bills on cancellation** — set expectations).
- The PayPal NVP/SOAP "revoke third-party permission" UI is a deprecation-driven maze that loops back on itself. Skip it. Once Snipcart's account is gone, its API permissions are inert. PayPal will deprecate NVP/SOAP entirely.

---

## 5. Serverless surface (Vercel functions)

Vercel auto-routes files in `api/` to `/api/...`. The existing SPA catch-all rewrite (`/(.*) → /index.html`) doesn't catch them because filesystem routing wins first. **No `vercel.json` change is needed.**

### 5.1 Shared helpers

`api/_lib/paypal.mjs`:

```js
const PP_BASE = process.env.PAYPAL_ENV === 'live'
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

let cachedToken = null
let tokenExpiry = 0

export async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken
  const id     = process.env.PAYPAL_CLIENT_ID
  const secret = process.env.PAYPAL_SECRET
  if (!id || !secret) throw new Error('PAYPAL_CLIENT_ID / PAYPAL_SECRET not set')
  const auth = Buffer.from(`${id}:${secret}`).toString('base64')
  const res  = await fetch(`${PP_BASE}/v1/oauth2/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials',
  })
  const body = await res.text()
  if (!res.ok) throw new Error(`PayPal token ${res.status}: ${body.slice(0, 300)}`)
  const data  = JSON.parse(body)
  cachedToken = data.access_token
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000
  return cachedToken
}

export async function paypalFetch(path, init = {}) {
  const token = await getAccessToken()
  const res   = await fetch(`${PP_BASE}${path}`, {
    ...init,
    headers: { ...(init.headers ?? {}), Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  })
  const body = await res.text()
  if (!res.ok) throw new Error(`PayPal ${path} ${res.status}: ${body.slice(0, 500)}`)
  return body ? JSON.parse(body) : null
}
```

`api/_lib/printful.mjs`:

```js
const PF_BASE = 'https://api.printful.com'

export async function printfulFetch(path, init = {}) {
  const token = process.env.PRINTFUL_TOKEN
  if (!token) throw new Error('PRINTFUL_TOKEN not set')
  const res = await fetch(`${PF_BASE}${path}`, {
    ...init,
    headers: { ...(init.headers ?? {}), Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  })
  const body = await res.text()
  if (!res.ok) {
    const err = new Error(`Printful ${path} ${res.status}: ${body.slice(0, 500)}`)
    err.status = res.status; err.body = body
    throw err
  }
  return body ? JSON.parse(body) : null
}
```

`api/_lib/products.mjs`:

```js
import productsData from '../../src/brand/data/printful-products.json' with { type: 'json' }

export function lookupVariant(slug, size) {
  const product = productsData.find((p) => p.slug === slug)
  if (!product) return null
  const wantedSize = size || 'One size'
  const variant    = product.variants.find((v) => v.size === wantedSize)
  if (!variant) return null
  return { product, variant }
}

export function validateAndPrice(items) {
  if (!Array.isArray(items) || items.length === 0) throw new Error('Cart is empty')
  const lines = []
  let itemTotal = 0
  let currency = '{{CURRENCY}}'
  for (const it of items) {
    const found = lookupVariant(it.slug, it.size)
    if (!found) throw new Error(`Unknown product: ${it.slug}`)
    const qty = Number(it.qty) || 0
    if (qty < 1 || qty > 99 || !Number.isInteger(qty)) throw new Error(`Invalid qty for ${it.slug}: ${it.qty}`)
    const unit      = Number(found.variant.retailPrice)
    const lineTotal = unit * qty
    itemTotal += lineTotal
    currency   = found.variant.currency
    lines.push({
      slug: it.slug, size: found.variant.size, qty, name: found.product.name,
      unitPrice: unit, lineTotal, currency: found.variant.currency,
      syncVariantId: found.variant.syncVariantId,
    })
  }
  return { lines, itemTotal, currency }
}
```

`api/_lib/shipping.mjs` (real-time Printful rates):

```js
import { printfulFetch } from './printful.mjs'
import { lookupVariant } from './products.mjs'

export async function getShippingRate({ items, delivery }) {
  if (!Array.isArray(items) || items.length === 0) throw new Error('Cart is empty')
  if (!delivery?.country) throw new Error('Delivery country is required to calculate shipping')

  const printfulItems = items.map((it) => {
    const found = lookupVariant(it.slug, it.size)
    if (!found) throw new Error(`Unknown product: ${it.slug}`)
    return { sync_variant_id: found.variant.syncVariantId, quantity: Number(it.qty) || 1 }
  })

  const res = await printfulFetch('/shipping/rates', {
    method: 'POST',
    body: JSON.stringify({
      recipient: {
        address1:     delivery.street   ?? '',
        city:         delivery.city     ?? '',
        country_code: delivery.country,
        zip:          delivery.postcode ?? '',
      },
      items:    printfulItems,
      currency: '{{CURRENCY}}',
      locale:   'en_US',
    }),
  })

  const rates = res?.result ?? []
  if (rates.length === 0) throw new Error('No shipping options available for this address')
  const cheapest = rates.reduce((min, r) => (Number(r.rate) < Number(min.rate) ? r : min))

  return {
    rate:     Number(cheapest.rate),
    currency: cheapest.currency,
    name:     cheapest.name,
    minDays:  cheapest.minDeliveryDays,
    maxDays:  cheapest.maxDeliveryDays,
  }
}
```

### 5.2 Public endpoints

`api/printful/shipping-rates.mjs`:

```js
import { getShippingRate } from '../_lib/shipping.mjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { items = [], delivery = {} } = req.body ?? {}
    res.status(200).json(await getShippingRate({ items, delivery }))
  } catch (err) {
    console.error('shipping-rates error:', err.message)
    res.status(400).json({ error: err.message })
  }
}
```

`api/paypal/create-order.mjs`:

```js
import { paypalFetch } from '../_lib/paypal.mjs'
import { validateAndPrice } from '../_lib/products.mjs'
import { getShippingRate } from '../_lib/shipping.mjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { items = [], delivery = {} } = req.body ?? {}
    const priced   = validateAndPrice(items)
    const shipping = await getShippingRate({ items, delivery })
    const total    = priced.itemTotal + shipping.rate

    const order = await paypalFetch('/v2/checkout/orders', {
      method: 'POST',
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: priced.currency,
            value:         total.toFixed(2),
            breakdown: {
              item_total: { currency_code: priced.currency, value: priced.itemTotal.toFixed(2) },
              shipping:   { currency_code: priced.currency, value: shipping.rate.toFixed(2) },
            },
          },
          items: priced.lines.map((l) => ({
            name:        l.size && l.size !== 'One size' ? `${l.name} (${l.size})` : l.name,
            quantity:    String(l.qty),
            unit_amount: { currency_code: l.currency, value: l.unitPrice.toFixed(2) },
          })),
        }],
      }),
    })
    res.status(200).json({ orderID: order.id })
  } catch (err) {
    console.error('create-order error:', err.message)
    res.status(400).json({ error: err.message })
  }
}
```

`api/paypal/capture-order.mjs`:

```js
import { paypalFetch } from '../_lib/paypal.mjs'
import { printfulFetch } from '../_lib/printful.mjs'
import { lookupVariant } from '../_lib/products.mjs'

// Sandbox: keep Printful orders as drafts (don't burn balance on tests).
// Live: auto-confirm so fulfillment kicks off immediately.
const AUTO_CONFIRM_PRINTFUL = process.env.PAYPAL_ENV === 'live'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const { orderID, items = [], delivery = {}, email = '' } = req.body ?? {}
    if (!orderID) return res.status(400).json({ error: 'Missing orderID' })

    const captured  = await paypalFetch(`/v2/checkout/orders/${orderID}/capture`, { method: 'POST' })
    const captureId = captured?.purchase_units?.[0]?.payments?.captures?.[0]?.id
    if (!captureId) throw new Error('PayPal capture succeeded but no capture ID was returned')

    let printfulOrderId = null
    let printfulError   = null
    try {
      const orderItems = items.map((it) => {
        const found = lookupVariant(it.slug, it.size)
        if (!found) throw new Error(`Cannot map ${it.slug} to a Printful sync variant`)
        return { sync_variant_id: found.variant.syncVariantId, quantity: Number(it.qty) || 1 }
      })
      const path = AUTO_CONFIRM_PRINTFUL ? '/orders?confirm=true' : '/orders'
      const printfulRes = await printfulFetch(path, {
        method: 'POST',
        body: JSON.stringify({
          external_id: captureId,                                       // ← idempotency key
          recipient: {
            name:         `${delivery.firstName ?? ''} ${delivery.lastName ?? ''}`.trim(),
            address1:     delivery.street   ?? '',
            city:         delivery.city     ?? '',
            country_code: delivery.country  ?? '',
            zip:          delivery.postcode ?? '',
            phone:        delivery.phone    ?? '',
            email,
          },
          items: orderItems,
        }),
      })
      printfulOrderId = printfulRes?.result?.id ?? null
    } catch (err) {
      console.error('Printful order creation failed (PayPal already captured):', err.message)
      printfulError = err.message
    }

    res.status(200).json({ captureId, paypalOrderId: orderID, printfulOrderId, printfulError, autoConfirmed: AUTO_CONFIRM_PRINTFUL })
  } catch (err) {
    console.error('capture-order error:', err.message)
    res.status(500).json({ error: err.message })
  }
}
```

### 5.3 The idempotency contract

**PayPal capture ID is the Printful `external_id`.** If the capture endpoint is called twice for the same PayPal order:
- PayPal returns the same capture (idempotent on order ID).
- Printful rejects the duplicate external_id (no double fulfillment).

This is the single load-bearing seam. Don't break it.

---

## 6. Frontend (Checkout + Smart Buttons)

### 6.1 Install

```sh
pnpm add @paypal/react-paypal-js
```

### 6.2 Checkout.jsx skeleton

Three steps: email → delivery → pay. PayPal Smart Buttons render at step 3 once shipping has been fetched.

Key contract:
- After delivery step, a `useEffect` fires when `step === 'pay'` and POSTs `{ items, delivery }` to `/api/printful/shipping-rates`.
- The Pay button is disabled until shipping is loaded.
- `createOrder` POSTs the same payload to `/api/paypal/create-order`; the server re-fetches shipping itself (don't trust client total).
- `onApprove` POSTs to `/api/paypal/capture-order` with `{ orderID, items, delivery, email }` and on success navigates to the confirmation page with state.

```jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'

const PAYPAL_OPTS = {
  'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID,
  currency:    '{{CURRENCY}}',
  intent:      'capture',
  components:  'buttons',
}

export default function Checkout() {
  // ...cart state from your cart context...
  const [step,          setStep]          = useState('email')
  const [email,         setEmail]         = useState('')
  const [delivery,      setDelivery]      = useState({ firstName: '', lastName: '', street: '', city: '', postcode: '', country: 'IS', phone: '' })
  const [shipping,      setShipping]      = useState(null)
  const [shippingError, setShippingError] = useState(null)
  const [paying,        setPaying]        = useState(false)
  const [payError,      setPayError]      = useState(null)

  // Fetch real Printful shipping when entering the pay step.
  useEffect(() => {
    if (step !== 'pay' || items.length === 0) return
    let cancelled = false
    fetch('/api/printful/shipping-rates', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        items: items.map((it) => ({ slug: it.slug, size: it.size, qty: it.qty })),
        delivery,
      }),
    })
      .then(async (r) => {
        const body = await r.json().catch(() => ({}))
        if (!r.ok) throw new Error(body.error ?? 'Could not calculate shipping')
        return body
      })
      .then((rate) => { if (!cancelled) setShipping(rate) })
      .catch((err)  => { if (!cancelled) setShippingError(err.message) })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  const cartPayload = () => items.map((it) => ({ slug: it.slug, size: it.size, qty: it.qty }))

  const createOrder = async () => {
    setPayError(null)
    const res = await fetch('/api/paypal/create-order', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ items: cartPayload(), delivery }),
    })
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error ?? 'Could not create PayPal order') }
    const { orderID } = await res.json()
    return orderID
  }

  const onApprove = async (data) => {
    setPaying(true)
    try {
      const res = await fetch('/api/paypal/capture-order', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ orderID: data.orderID, items: cartPayload(), delivery, email }),
      })
      if (!res.ok) { setPaying(false); const e = await res.json().catch(() => ({})); setPayError(e.error ?? 'Payment captured but processing failed.'); return }
      const result = await res.json()
      clear()           // your cart context's clear()
      navigate('/checkout/confirmation', {
        state: { ...result, items, delivery, email, subtotal, shipping: shipping?.rate ?? 0, total: subtotal + (shipping?.rate ?? 0), currency },
      })
    } catch (err) { setPaying(false); setPayError(err.message) }
  }

  return (
    <PayPalScriptProvider options={PAYPAL_OPTS}>
      {/* ...steps 1 + 2 (email + delivery forms)... */}
      {/* When user clicks Continue from delivery, reset shipping state in the SAME event handler that calls setStep('pay'):
           onSubmit={(e) => { e.preventDefault(); setShipping(null); setShippingError(null); setStep('pay') }}
         This avoids React 19's setState-in-effect lint warning. */}
      {step === 'pay' && (
        <PayPalButtons
          disabled={!shipping}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={(err) => { console.error(err); setPayError('Payment could not be completed.') }}
          onCancel={() => setPayError(null)}
        />
      )}
    </PayPalScriptProvider>
  )
}
```

### 6.3 OrderConfirmation.jsx

Read from `useLocation().state`. Show PayPal capture ID and Printful order ID. If `printfulError` is set, surface a "fulfillment will follow up via email" message instead of pretending everything's fine.

---

## 7. Env vars (Vercel)

### 7.1 Add all five vars

Vercel → Project Settings → Environment Variables. For each:
- Scope: **Production + Preview** (Development scope is unavailable for Sensitive vars — Vercel auto-flags `*SECRET*` and `*TOKEN*` patterns).
- Start with **sandbox values for all scopes**.

```
PRINTFUL_TOKEN          = <same as .env.local>
PAYPAL_ENV              = sandbox
PAYPAL_CLIENT_ID        = <sandbox client ID>
PAYPAL_SECRET           = <sandbox secret>
VITE_PAYPAL_CLIENT_ID   = <same sandbox client ID — Vite-exposed copy>
```

### 7.2 Why two PayPal client ID entries

- `PAYPAL_CLIENT_ID` → readable by serverless functions only.
- `VITE_PAYPAL_CLIENT_ID` → exposed to the browser bundle for the Smart Buttons SDK URL.

The PayPal client ID is public by design (it's in the SDK URL anyway). The **secret** stays server-only — **never** add `VITE_PAYPAL_SECRET`.

---

## 8. Sandbox verification

### 8.1 Deploy + test

1. Push to the branch tracked by Vercel (or hit "Redeploy" on the latest deployment after setting env vars).
2. Open the Vercel preview URL.
3. Add a product to cart, go to `/checkout`.
4. Fill email + delivery (any address; sandbox doesn't validate strictly).
5. Continue to pay step. Wait for "Calculating shipping…" to resolve.
6. Click the PayPal button.
7. Log in with your **sandbox personal account** (developer.paypal.com → Testing Tools → Sandbox Accounts → personal/buyer → View/edit → email + system-generated password).
8. Approve.
9. You should land on `/checkout/confirmation` with a real PayPal capture ID + Printful order ID.

### 8.2 Three-side verification

Check all three places agree:
- **Site confirmation page** — shows capture ID and Printful order ID.
- **PayPal sandbox merchant dashboard** (sandbox.paypal.com, log in as the business merchant account) — Activity should show a Completed payment matching the capture ID.
- **Printful dashboard** → Orders → **Drafts** — the order should appear with the PayPal capture ID as `Order #` (because we set it as `external_id`).

### 8.3 Clean up

**Don't click "Approve orders" on the Printful draft** — that would confirm it for real and charge your Printful balance. Delete the draft via ⋯ → Delete.

---

## 9. Live mode flip

Once sandbox verified, edit four Vercel env vars — **Production scope only**. Leave Preview on sandbox.

```
PAYPAL_ENV              (Production) → live
PAYPAL_CLIENT_ID        (Production) → <live client ID from `{{BRAND_SLUG}}-website-live`>
PAYPAL_SECRET           (Production) → <live secret>
VITE_PAYPAL_CLIENT_ID   (Production) → same live client ID
```

Redeploy Production.

### 9.1 First live test

1. In Printful: temporarily set one product to €1.
2. `pnpm sync-printful`, commit + push, wait for deploy.
3. Open the production URL, buy with a **real PayPal account different from the merchant**.
4. Verify three sides agree (PayPal Activity, Printful — note that with `PAYPAL_ENV=live` the order auto-confirms via `?confirm=true` and goes to fulfillment immediately).
5. **Cancel the Printful order before it ships** (or accept that you'll receive your own product) and **refund the PayPal capture from the merchant dashboard**.
6. Restore the product price. `pnpm sync-printful`, commit.

The refund loses the PayPal fixed fee (~€0.35) but returns the percentage. Cheapest end-to-end live confidence test.

---

## 10. Known leaks / Phase 2

Items the MVP defers. Track in `llm-context/AGENT-CONTEXT.md`.

- **PayPal webhook listener** (`api/paypal/webhook.mjs`) for disputes, refunds, recovery from interrupted captures. MVP relies on synchronous capture response; webhooks add belt-and-suspenders.
- **Multi-image per product / per variant.** Sync script only downloads the first variant's first preview. PDP shows one image. Worth a gallery when there are real images to show.
- **Multi-color variants collapse in cart.** Cart line ID is `slug + size`; products with one size and multiple colors deduplicate to a single line. Customer can't pick color, orders fulfill the first-listed variant. Needs a color picker on PDP and an extended line ID.
- **Tax / VAT.** Not handled. Printful handles destination duties for POD; EU VAT thresholds may eventually require registration depending on volume + merchant entity.
- **Admin refund UI.** Refunds done via PayPal dashboard manually. A `/api/paypal/refund` function with a small admin page is a Phase 2 nicety.

---

## 11. Sanity CMS (optional, for editor-managed content)

Independent of the commerce stack. Add when the site has journal posts, gallery content, or any editor-managed surface that shouldn't require a code deploy. Skip entirely if the brief is commerce-only.

For the ownership-transfer pattern, see `../sanity/sanity-handoff.md`. For an as-installed example of the configuration, see `../sanity/sanity-playbook.md`.

### 11.1 Sanity project setup

1. Sign up at sanity.io. **Pattern A** (recommended) — client signs up first under their own login, invites the developer as an org member. **Pattern B** — developer signs up under a project-specific email under the client's domain (e.g. `dev@{{BRAND_DOMAIN}}`); project transfers to client org at handoff. Details in `../sanity/sanity-handoff.md`.
2. Create the project. Name it `{{BRAND_SLUG}}` or `{{BRAND_NAME}}`. Default dataset `production` is fine. Note the **Project ID** (`{{SANITY_PROJECT_ID}}`) and the **Organization ID**.
3. Generate an **Editor**-scoped API token at `sanity.io/manage → project → API → Tokens`. Name it `migration-script`. Sanity shows the value only once — paste it straight into `.env.local`.
4. Add CORS origins at `sanity.io/manage → project → API → CORS Origins`, all with **Allow credentials = YES**:
   - `https://{{BRAND_DOMAIN}}`
   - `https://www.{{BRAND_DOMAIN}}`
   - `https://studio.{{BRAND_DOMAIN}}`
   - `http://localhost:5173` (Vite dev — main app)
   - `http://localhost:3333` (Sanity dev — Studio)

### 11.2 Studio scaffold

From repo root:

```sh
npm create sanity@latest -- --project {{SANITY_PROJECT_ID}} --dataset production --output-path studio --template clean
```

Prompts to answer:
- **Use TypeScript?** No (matches the rest of this stack).
- **Package manager?** pnpm.
- **MCP server?** Claude Code if you use Claude Code; skip otherwise.

Result: a `studio/` folder with its own `package.json`, `sanity.config.js`, `sanity.cli.js`, `schemaTypes/index.js`. It sits beside `src/` and `api/`. **Not** a pnpm workspace — independent npm project sharing the git repo.

### 11.3 pnpm v11 esbuild approval

pnpm v9+ refuses to run third-party `postinstall` scripts without explicit approval. Sanity's bundle includes esbuild, whose postinstall drops the platform-specific binary. Fix in `studio/pnpm-workspace.yaml`:

```yaml
allowBuilds:
  esbuild: true
onlyBuiltDependencies:
  - esbuild
```

Then `cd studio && pnpm install`. If install short-circuits ("Already up to date") without running the postinstalls, force it: `pnpm rebuild esbuild`.

### 11.4 Schemas

Define document and object types under `studio/schemaTypes/<name>.js` and wire them in `studio/schemaTypes/index.js`:

```js
import author from './author'
import article from './article'
import collection from './collection'
import look from './look'

export const schemaTypes = [author, article, collection, look]
```

Typical journal + collections shape (adapt to project content):
- **`author`** (document) — name, slug, role, bio (text), avatar (image, hotspot), avatarInitial (monogram fallback), links array.
- **`article`** (document) — title, slug, excerpt, author (reference → author), publishedAt (datetime), readingMinutes, tag, cover (image), body (Portable Text). PT block schema with `normal`/`h2`/`h3`/`blockquote` styles, bullet/numbered lists, em/strong decorators, and a `cite` annotation used to attach a citation source to blockquote markDefs.
- **`collection`** (document) — title, slug, number, year (string, free-form to accept ranges), excerpt, publishedAt, cover (image), heroImage + heroVideo + heroVideoPoster (renderer picks video if present), show object (collapsible), collaborators array, notes (PT), looks array (of look objects), press array.
- **`look`** (object, not document) — number, name, image (required), family, fabric. Embedded inside `collection.looks` since looks have no standalone identity.

Use `defineType` / `defineField` from `sanity` for typed authoring help.

### 11.5 Frontend client + queries

In the **main app** root (not in `studio/`):

```sh
pnpm add @sanity/client @sanity/image-url @portabletext/react
```

`src/lib/sanity.js`:

```js
import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const sanity = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  apiVersion: '2024-10-01',
  useCdn: true,
  perspective: 'published',
})

const builder = imageUrlBuilder(sanity)
export const urlFor = (source) => builder.image(source)
```

`src/lib/queries.js` — GROQ helpers mirroring whatever selector API the existing data-file layer exposes (e.g. `sortedArticles()`, `findArticle(slug)`, `articlesByAuthor(slug)`, `sortedCollections()`, `findCollection(slug)`, `adjacentCollections(slug)`). All become async. Use two projections per type — a list/card projection that excludes `body`/`notes`, and a full projection that includes them — to keep list payloads small.

Inline-resolve references in projections (`"author": author->{...}`) so consumers don't make a second fetch.

### 11.6 Migration script (only if migrating from existing data files)

`scripts/migrate-to-sanity.mjs` using `@sanity/client` with the write token. Pattern:

1. **Asset upload** — `client.assets.upload('image' | 'file', createReadStream(absPath), {filename})`. Cache results by SHA-1 of file content so reruns dedupe.
2. **Document creation** — `client.createOrReplace({_id, _type, ...fields})`. Use **deterministic IDs** like `author-<slug>`, `article-<slug>`, `collection-<slug>` so reruns overwrite instead of duplicating.
3. **Block format conversion** — if the source data uses a custom block shape (`{type: 'p', text}`, `{type: 'h2', text}`, etc.), convert to Sanity's Portable Text shape (`{_type: 'block', _key, style, markDefs, children}`) before posting.

Run once: `node --env-file=.env.local scripts/migrate-to-sanity.mjs`. Re-runs are safe (idempotent IDs + asset dedup).

### 11.7 Page swap

For each page that consumes the old data files, change:
- The import from `'./brand/data/<file>'` to `'./lib/queries'`
- The synchronous call to an async `useEffect` + `useState` pattern
- Images from raw string paths to `urlFor(image).width(W).height(H).url()`

Use a three-state machine (`loading` / `not-found` / `ok`) for detail pages so the renderer can show a minimal placeholder while the fetch is in flight, a real 404 when the document doesn't exist, or the page when content lands. For list pages, render the static chrome (hero section, page header) immediately and let the list area resolve from `null` to the rendered list.

Portable Text bodies render through `<PortableText value={blocks} components={...} />` from `@portabletext/react`. Override the `blockquote` style to pull a `cite` markDef out and render it as a separate `<cite>` element after the paragraph.

### 11.8 Studio deploy on Vercel (self-hosted)

The Studio is a static React app. **Self-host on Vercel for custom-domain support** — Sanity's built-in `*.sanity.studio` hosting does not accept custom domains.

1. Add `studio/vercel.json` with the SPA rewrite (so deep Studio routes don't 404 on Vercel):

   ```json
   { "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
   ```

2. Create a **second Vercel project** (alongside the main site's project), pointed at the same git repo. **Root Directory = `studio`** (manually set — Vercel won't infer it). Framework Preset: **Sanity** (Vercel autodetects once Root Directory is set). Build / Output / Install commands: leave the preset defaults (`sanity build` / `dist` / `pnpm install`).
3. First deploy completes → Vercel URL works (e.g. `{{BRAND_SLUG}}-studio.vercel.app`). Visit it. Sanity v3 shows a "Connect this studio" / "An error occurred" screen — click **Register this studio**. Confirm the URL. The Studio now reads content.
4. Add custom domain `studio.{{BRAND_DOMAIN}}` in the Vercel project Settings → Domains.
5. Cloudflare DNS: add a **CNAME** record. Name `studio`, target `cname.vercel-dns.com` (Vercel may suggest a newer IP-range record; either works), proxy status **DNS only (grey cloud)** — same as the apex and `www`. Vercel issues TLS within ~30s of DNS resolving.
6. Visit `studio.{{BRAND_DOMAIN}}` → register this URL too, in `sanity.io/manage → project → Studios → Add studio`. Now both the vercel.app fallback and the custom-domain URL work.

### 11.9 Main site env vars (Vercel)

In the **main site's** Vercel project (not the Studio's), add to all environments (Production + Preview + Development):

| Name | Value | Notes |
|---|---|---|
| `VITE_SANITY_PROJECT_ID` | `{{SANITY_PROJECT_ID}}` | Public — ships in client bundle (not a secret) |
| `VITE_SANITY_DATASET` | `production` | Public |

Redeploy. Frontend reads from Sanity in production.

The write token (`SANITY_WRITE_TOKEN`) stays in `.env.local` only — used by the migration script. Never goes to Vercel unless you add a server-side function that needs it (rare; not in the MVP).

### 11.10 Sandbox-style verification

1. Studio at `studio.{{BRAND_DOMAIN}}` loads, login succeeds, schemas visible in left rail.
2. Make a trivial content edit (a comma in an article excerpt) → **Publish** in Studio.
3. Refresh the live frontend (e.g. `{{BRAND_DOMAIN}}/blog`) → change is visible.
4. End-to-end loop closed.

### 11.11 Sanity-specific gotchas

- **Modern Studios require URL registration.** First-load "Connect this studio" prompt is normal — click Register. Each new URL (vercel.app, custom domain, preview deploys you want to use) registers separately.
- **Custom domain → self-host on Vercel.** `sanity deploy` (Sanity-hosted `*.sanity.studio`) does not accept custom domains. Self-hosting is mandatory for `studio.{{BRAND_DOMAIN}}`.
- **pnpm v11 strictness on postinstalls.** `ERR_PNPM_IGNORED_BUILDS` is a hard failure, not a warning. Fix is `allowBuilds.<pkg>: true` in `studio/pnpm-workspace.yaml`.
- **Drafts vs published perspective.** The frontend's `@sanity/client` is configured with `perspective: 'published'`. If a content edit "doesn't show up on the site" after refresh, check that the doc was **Published** in Studio (top-right pill should be green; if it says "Edited" or "Draft", click Publish).
- **CORS "Allow credentials = YES"** is required for any origin that hosts the Studio (auth cookies need to flow). Harmless on read-only origins.
- **API write token rotation.** Revoke the `migration-script` token after the one-shot migration verifies — it's a long-lived liability otherwise.
- **`autoUpdates: true`** in `sanity.cli.js` is the default and means the Studio auto-pulls patch/minor `sanity` package updates at runtime. Editors get bug fixes without redeploys. Disable only if you need pinned-version reproducibility.

---

## Appendix A — Local dev caveat

Vite alone doesn't serve `/api/*` — the Smart Buttons render but `createOrder` 404s. Two options:
- `pnpm dlx vercel link` then `vercel dev` — runs Vite + functions together. Most accurate.
- Push to a Vercel preview branch.

The Sensitive flag on the env vars prevents `vercel env pull` from populating Development scope, so local `.env.local` stays the source of truth for `vercel dev`.

## Appendix B — Verification commands

```sh
# Sync printful
pnpm sync-printful

# Lint everything
pnpm lint

# Check ignore rules cover .env.local
git check-ignore -v .env.local    # should show: .gitignore:N:.env.*\t.env.local

# Inspect committed JSON
cat src/brand/data/printful-products.json | jq '.[] | {slug, name, price, variants: (.variants | length)}'
```

## Appendix C — The single biggest gotcha list

In order of how badly each will burn an hour:

1. **Printful currency lives under Preferences, not store settings.** Hidden completely from product / store pages.
2. **Vercel auto-flags `*SECRET*` / `*TOKEN*` as Sensitive**, which blocks the Development scope. Skip Development, use `.env.local` locally.
3. **Vite doesn't serve `/api/*`** — `pnpm dev` alone breaks the checkout flow. Use `vercel dev` or deploy previews.
4. **Snipcart bills $20 on cancellation** if you were in live mode. Email support@snipcart.com for refund.
5. **PayPal's NVP/SOAP revocation UI is broken.** Don't waste time on it. Cancel the third-party service instead; the permissions become inert.
6. **PayPal sandbox auto-creates two accounts.** Use the **Personal** one to test purchases. Logging into the Business one to pay yourself fails.
7. **Vercel filesystem routing wins over rewrites.** No `vercel.json` carve-out needed for `/api/*`. The existing SPA catch-all is fine.
8. **The PayPal capture ID is the Printful idempotency key.** Don't refactor away from this pattern.
