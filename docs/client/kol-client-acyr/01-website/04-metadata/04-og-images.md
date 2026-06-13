---
title: OG images — asset inventory
type: reference
topics:
  - metadata
  - social
  - design
audience: agency-internal
status: active
domain: another-creation.xyz
source_file: src/data/seo-metadata.js
assets_folder: public/og/
specs:
  dimensions: 2400x1260
  ratio: "1.91:1"
  display_size: 1200x630
  format: jpg
inventory:
  total_files: 18
  mapped_files: 10
  reserve_files: 8
  sets:
    - logo
    - ps
    - yr
companion_to:
  - "[[01-website/04-metadata/02-operations|operations]]"
  - "[[01-website/04-metadata/03-routes|routes]]"
  - "[[01-website/04-metadata/01-plan|metadata-plan]]"
related:
  - "[[01-website/04-metadata/03-routes|routes]]"
  - "[[01-website/04-metadata/02-operations|operations]]"
  - "[[01-website/04-metadata/01-plan|metadata-plan]]"
  - "[[02-brand/03-branded-assets|branded-assets]]"
  - "[[02-brand/04-writing-guidelines|writing-guidelines]]"
modified: 2026-05-16
tags:
  - client/setup/metadata
  - client/setup/social
  - asset/inventory
  - reference/canonical
  - topic/social/open-graph
  - topic/social/twitter-cards
  - status/living
---

# OG images — asset inventory

The 18 images in `apps/website/public/og/` and how they map to routes. Sibling to [[03-routes|routes]] (which holds the copy) and [[02-operations|operations]] (which holds the runbook).

---

## Specs

| Property | Value |
|---|---|
| Dimensions | **2400 × 1260** (2× retina 1200 × 630) |
| Aspect ratio | **1.91 : 1** (landscape) |
| Format | JPG |
| File size range | 248 KB – 2.9 MB |
| Cap | 1 MB recommended, 8 MB hard ceiling (Facebook) |

---

## Three sets

| Set | Theme | Used for |
|---|---|---|
| **`logo-*`** | Brand-forward, logomark-anchored | site-wide DEFAULT, HOME, CONTACT, BRAND, LEGAL, COMMERCE |
| **`ps-*`** | Photoshoot — the work itself | SHOP, BLOG, COLLECTIONS |
| **`yr-*`** | Yr-centric — the maker | HANDMADE, ABOUT, PRESS |

---

## Logo set (6)

| File | Mapped to | Routes served | Status |
|---|---|---|---|
| `open-graph-logo-01.jpg` | `OG_DEFAULT` + `OG_HOME` + `OG_COMMERCE` | site-wide fallback · `/` · `/cart` · `/checkout` · `/checkout/confirmation` | **live** |
| `open-graph-logo-02.jpg` | `OG_CONTACT` | `/contact` | **live** |
| `open-graph-logo-03.jpg` | `OG_BRAND` | `/brand` | **live** |
| `open-graph-logo-04.jpg` | `OG_LEGAL` | `/privacy` · `/terms` · `/shipping-returns` | **live** |
| `open-graph-logo-05.jpg` | — | — | reserve |
| `open-graph-logo-06.jpg` | — | — | reserve |

## Photoshoot set (6)

| File | Mapped to | Routes served | Status |
|---|---|---|---|
| `open-graph-ps-01.jpg` | `OG_SHOP` | `/shop` + `/shop/:slug` | **live** |
| `open-graph-ps-02.jpg` | `OG_BLOG` | `/blog` + `/blog/:slug` | **live** |
| `open-graph-ps-03.jpg` | `OG_COLLECTIONS` | `/collections` + `/collections/:slug` | **live** |
| `open-graph-ps-04.jpg` | — | — | reserve |
| `open-graph-ps-05.jpg` | — | — | reserve |
| `open-graph-ps-06.jpg` | — | — | reserve |

## Yr set (6)

| File | Mapped to | Routes served | Status |
|---|---|---|---|
| `open-graph-yr-01.jpg` | `OG_HANDMADE` | `/handmade` + `/handmade/:slug` | **live** |
| `open-graph-yr-02.jpg` | `OG_ABOUT` | `/about` | **live** |
| `open-graph-yr-03.jpg` | `OG_PRESS` | `/press` | **live** |
| `open-graph-yr-04.jpg` | — | — | reserve |
| `open-graph-yr-05.jpg` | — | — | reserve |
| `open-graph-yr-06.jpg` | — | — | reserve |

---

## Reverse map — constant → file

For the route → constant mapping see [[03-routes|routes]].

| Constant | File |
|---|---|
| `OG_DEFAULT` | `open-graph-logo-01.jpg` |
| `OG_HOME` | → `OG_DEFAULT` |
| `OG_SHOP` | `open-graph-ps-01.jpg` |
| `OG_HANDMADE` | `open-graph-yr-01.jpg` |
| `OG_BLOG` | `open-graph-ps-02.jpg` |
| `OG_COLLECTIONS` | `open-graph-ps-03.jpg` |
| `OG_ABOUT` | `open-graph-yr-02.jpg` |
| `OG_CONTACT` | `open-graph-logo-02.jpg` |
| `OG_BRAND` | `open-graph-logo-03.jpg` |
| `OG_PRESS` | `open-graph-yr-03.jpg` |
| `OG_LEGAL` | `open-graph-logo-04.jpg` |
| `OG_COMMERCE` | → `OG_DEFAULT` |

---

## How to swap an image

1. Drop a new **2400 × 1260** (or 1200 × 630) JPG/PNG into `apps/website/public/og/`.
2. Update the matching constant in `apps/website/src/data/seo-metadata.js`.
3. Update the matching row in this doc.
4. Build + smoke-test: `pnpm build && ./scripts/test-meta.sh /the-route`
5. Push → bust caches in Facebook Sharing Debugger + LinkedIn Post Inspector (see [[02-operations|operations §3]]).

## How to add a section image (use one from reserve)

1. Pick a reserve file (e.g. `open-graph-ps-04.jpg`).
2. Add a new named constant in `seo-metadata.js` (e.g. `OG_NEW_SECTION = …`).
3. Point the route(s) in `STATIC_META` at the new constant.
4. Update this doc — move the reserve row into the relevant set's mapped list.
5. Build, smoke-test, push.

## Per-product / per-article overrides (Pass 3+)

Each Sanity article / collection has an `seo.ogImage` field — editors can upload a per-document landscape image when they want a unique preview. The Sanity fallback chain is `seo.ogImage` → `coverImage` (Sanity image URL builder serves the right crop at 1200×630).

Per-product (POD + handmade) overrides aren't wired yet. Pass 3 will decide whether to add a `shareImage` field on `printful-products.json` + `shop-data.js` for landscape crops, or accept that product mockups render as small thumbnails on FB / LinkedIn. See [[01-plan|metadata plan §5]] for the trade-off.
