---
title: Routes — metadata copy reference
type: reference
topics:
  - metadata
  - copywriting
  - seo
audience: agency-internal
status: active
domain: another-creation.xyz
source_file: src/data/seo-metadata.js
companion_to:
  - "[[01-website/04-metadata/02-operations|operations]]"
  - "[[01-website/04-metadata/01-plan|metadata-plan]]"
  - "[[01-website/04-metadata/04-og-images|og-images]]"
related:
  - "[[01-website/04-metadata/02-operations|operations]]"
  - "[[01-website/04-metadata/01-plan|metadata-plan]]"
  - "[[01-website/04-metadata/04-og-images|og-images]]"
  - "[[02-brand/04-writing-guidelines|writing-guidelines]]"
  - "[[02-brand/05-writing-examples|writing-examples]]"
budgets:
  title_chars: 60
  description_chars: 160
  og_image: 1200x630
modified: 2026-05-16
tags:
  - client/setup/metadata
  - client/setup/copywriting
  - client/setup/seo
  - handoff-kit
  - reference/canonical
  - status/living
---

# Routes — metadata copy reference

The canonical table of what every route advertises to search engines and social platforms. **Edit this doc first; mirror to [`src/data/seo-metadata.js`](../../../src/data/seo-metadata.js).**

Voice: [`writing-guidelines.md`](../brand/writing-guidelines.md) · examples in [`writing-examples.md`](../brand/writing-examples.md).
Budgets: title ≤ 60 chars · description 120–160 chars · OG image 1200×630.

---

## Static routes (Pass 1 — wired in repo, not yet deployed)

| Route | Title | Description | Target queries | OG | Status |
|---|---|---|---|---|---|
| `/` | Another Creation | Reykjavík atelier by Ýr Þrastardóttir. Garments cut for slow living. Made in Iceland since 2013. | "another creation", "ýr þrastardóttir", "icelandic fashion designer" | `OG_HOME` | live |
| `/about` | About — Another Creation | The studio, the maker, the practice. Ýr Þrastardóttir cuts garments by hand in Reykjavík. | "ýr þrastardóttir designer", "another creation about", "icelandic fashion atelier" | `OG_ABOUT` | live |
| `/contact` | Contact — Another Creation | Studio enquiries, press, commissions. Vatnsstígur 3, Reykjavík. | "another creation contact", "ýr þrastardóttir email" | `OG_CONTACT` | live |
| `/blog` | Journal — Another Creation | Notes from the atelier. Process, material, and what gets made between collections. | "another creation journal", "icelandic fashion journal" | `OG_BLOG` | live |
| `/collections` | Collections — Another Creation | The body of work. Each collection a record of where the practice was at the time. | "another creation collections", "ýr collections" | `OG_COLLECTIONS` | live |
| `/shop` | Shop — Another Creation | Made-to-order pieces designed by Ýr in Reykjavík. Shipped worldwide. | "another creation shop", "icelandic designer clothing" | `OG_SHOP` | live |
| `/handmade` | Handmade — Another Creation | One-of-one pieces cut by hand in Reykjavík. Enquire by email. | "another creation handmade", "bespoke icelandic clothing", "one of one fashion reykjavik" | `OG_HANDMADE` | live |
| `/brand` | Brand — Another Creation | Visual identity, palette, type, and assets for press and partners. | "another creation brand assets" | `OG_BRAND` | live |
| `/press` | Press — Another Creation | About, facts, contact, and press kit on request. | "another creation press kit", "ýr press contact" | `OG_PRESS` | live |
| `/shipping-returns` | Shipping & returns — Another Creation | Where we ship, when it arrives, and how returns work. | "another creation shipping" | `OG_LEGAL` | live |
| `/privacy` | Privacy — Another Creation | What we collect, how we store it, and how to reach us about your data. | — | `OG_LEGAL` | live |
| `/terms` | Terms — Another Creation | Terms of sale, returns, and intellectual property. | — | `OG_LEGAL` | live |

---

## Dynamic routes (Pass 2 — Sanity-driven, planned)

The proxy looks up the right Sanity document per request and uses its fields. **Editors don't need to fill the `seo` tab unless they want to override the auto-pulled values.**

| Route | Sanity doc | Title source (with fallbacks) | Description source | Image source | Status |
|---|---|---|---|---|---|
| `/blog/:slug` | `article` | `seo.seoTitle` → `title` | `seo.seoDescription` → `excerpt` | `seo.ogImage` → `coverImage` | Pass 2 |
| `/collections/:slug` | `collection` | `seo.seoTitle` → `title` | `seo.seoDescription` → `description` | `seo.ogImage` → `coverImage` | Pass 2 |
| `/blog/author/:slug` | `author` | `name` | `bio[0]` | `image` | Pass 2 |

Pass 2 also adds the `seo` field group to `article` + `collection` schemas in `studio/schemaTypes/`.

---

## Dynamic routes (Pass 3 — shop data, planned)

| Route | Data source | Title | Description | Image | Status |
|---|---|---|---|---|---|
| `/shop/:slug` | `src/brand/data/shop-data.js` (POD) | `name` | `description` | `image` (Printful mockup — portrait/square; see note) | Pass 3 |
| `/handmade/:slug` | `src/brand/data/shop-data.js` (handmade) | `name` | `description` | `image` (hand-authored) | Pass 3 |

**Image note:** Printful mockups are portrait/square — Facebook + LinkedIn will render shared product links as small-thumbnail cards, not large landscape cards. Two options once Pass 3 lands: accept it (most product sharing goes via Instagram + DMs anyway) or add an optional `shareImage` field per product (1200×630 landscape crop).

---

## `noindex` routes (excluded from search engines)

These have metadata for direct visitors but are flagged `noindex, nofollow` so they never appear in search results. Also disallowed in `robots.txt`.

| Route | Title | Description | Why |
|---|---|---|---|
| `/cart` | Cart — Another Creation | Your selected pieces. | private — per-visitor state |
| `/checkout` | Checkout — Another Creation | Complete your order. | private — PII |
| `/checkout/confirmation` | Order confirmed — Another Creation | Thank you for your order. | private — order-specific |

---

## How to edit

1. Change the cell in this doc.
2. Mirror the change to [`src/data/seo-metadata.js`](../../../src/data/seo-metadata.js) — keyed by route path.
3. Build + smoke-test: `pnpm build && ./scripts/test-meta.sh /the-route`
4. Push → Vercel redeploys → Search Console picks up the change on its next crawl.

For dynamic routes (Pass 2 + 3), changes happen in Sanity Studio (for `/blog/*` + `/collections/*`) or in `src/brand/data/shop-data.js` (for `/shop/*` + `/handmade/*`). No edit to `seo-metadata.js` needed — the proxy resolves at request time.
