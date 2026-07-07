---
title: Metadata, social previews, SEO
type: plan
topics:
  - seo
  - metadata
  - social
audience: agency-internal
status: active
domain: another-creation.xyz
providers:
  - vercel
  - sanity
pattern_source:
  site: kolkrabbi.io
  live_since: 2026-02-20
  reference_doc: "_tmp/docs/documentation/01-foundation/1.5.0-social-crawlers.md"
scope:
  - per-route titles + meta descriptions
  - open graph (facebook, linkedin, slack, imessage, whatsapp)
  - twitter cards
  - robots.txt
  - sitemap.xml
  - sanity-driven dynamic metadata
  - canonical urls
implementation_passes:
  pass_1: static-routes
  pass_2: sanity-driven
  pass_3: products
pass_status:
  pass_1: shipped-in-repo
  pass_2: planned
  pass_3: planned
estimated_effort_hours: 6
companion_to:
  - "[[01-website/04-metadata/03-routes|routes]]"
  - "[[01-website/04-metadata/02-operations|operations]]"
  - "[[01-website/04-metadata/04-og-images|og-images]]"
related:
  - "[[01-website/04-metadata/03-routes|routes]]"
  - "[[01-website/04-metadata/02-operations|operations]]"
  - "[[01-website/04-metadata/04-og-images|og-images]]"
  - "[[01-website/03-cms/02-sanity-log|sanity-log]]"
  - "[[01-website/01-setup/02-playbook|setup-playbook]]"
  - "[[03-infrastructure/02-handoff|domain-handoff]]"
modified: 2026-05-16
tags:
  - client/setup/metadata
  - client/setup/seo
  - client/setup/social
  - handoff-kit
  - provider/vercel
  - provider/sanity
  - topic/social/open-graph
  - topic/social/twitter-cards
  - topic/seo/sitemap
  - topic/seo/robots-txt
  - topic/edge-injection
  - status/in-progress
---

# Metadata, social previews, SEO

## What is this doc?

- A **plan for acyr**. The architecture + file inventory + implementation order.
- The pattern is **copied from `kolkrabbi.io`**, which has been running this exact setup in production since 2026-02-20. Reference doc lives in this repo at `_tmp/docs/documentation/01-foundation/1.5.0-social-crawlers.md`.
- Pass 1 (static routes + infrastructure) is **wired in the repo** as of 2026-05-16. Pass 2 (Sanity) and Pass 3 (products) are planned.

## Companion docs (same folder)

- [`routes.md`](routes.md) — canonical copy reference. Per-route titles, descriptions, target queries, OG constant, status. **Source of truth for what each route advertises.**
- [`og-images.md`](og-images.md) — OG image asset inventory. 18 files in three sets (`logo-*`, `ps-*`, `yr-*`), route mappings, reserve list, swap procedure. **Source of truth for which visual sits on which route.**
- [`playbook.md`](playbook.md) — operations playbook. Copy workflow, tracking (Google Search Console / Bing / Umami), cache-busting, iteration rules, tools catalogue.

---

## Quick answers

| Question | Answer |
|---|---|
| Is this live? | **No.** Plan only. |
| Does it cover SEO? | **Yes.** Titles + meta descriptions + canonical URLs + structured data, all per-route. |
| Does it cover Open Graph / social previews? | **Yes.** Facebook, LinkedIn, Slack, iMessage, WhatsApp. |
| Does it cover Twitter / X? | **Yes.** `twitter:card`, `twitter:image`, `twitter:title`, `twitter:description`. |
| Does it cover `robots.txt`? | **Yes.** §6 below. |
| Does it cover `sitemap.xml`? | **Yes.** §7 below. |
| Unique OG image per blog article? | **Yes.** Per article in Sanity. |
| Unique OG image per collection? | **Yes.** Per collection in Sanity. |
| Unique OG image per product? | **Yes**, optional. Defaults to the product mockup; see §5 for the portrait-vs-landscape gotcha. |
| Does Sanity auto-grab the hero/coverImage as the OG thumbnail? | **Yes.** Automatic fallback chain — if the editor sets nothing, the cover image is used. |
| Do editors *have* to fill anything in Sanity for this to work? | **No.** Defaults cover everything. Filling the `seo` fields is opt-in for when you want to override the auto-pulled title / excerpt / cover. |

---

## How it works

Social crawlers (Facebook, LinkedIn, Slack, X) don't run JavaScript. Our site is a Vite SPA, so today they only see `index.html` — which says `<title>kol-ac</title>` and nothing else. Every shared link looks generic.

The fix is **edge injection**:

```
1. Crawler hits  another-creation.xyz/blog/some-article
        ↓
2. Vercel rewrites the request to  /api/metadata-proxy
        ↓
3. The proxy reads the URL  →  fetches metadata from one of three sources:
        ├─ Sanity            (for /blog/:slug, /collections/:slug)
        ├─ shop-data.js      (for /shop/:slug, /handmade/:slug)
        └─ static route map  (for /, /shop, /about, etc.)
        ↓
4. The proxy reads  dist/index.html  and fills in placeholders:
        __TITLE__       →  "Some Article — Another Creation"
        __DESCRIPTION__ →  "Article excerpt from Sanity"
        __IMAGE__       →  "https://cdn.sanity.io/.../cover.jpg"
        __URL__         →  "https://another-creation.xyz/blog/some-article"
        ↓
5. Crawler receives filled HTML  →  shows correct preview ✓

A normal browser hits the same URL:
- Gets the same filled HTML
- React hydrates over the top
- User sees the site exactly as today, no change
```

---

## What gets built

> Nothing on this list exists yet. This is the implementation checklist.

| File | New / change | What it does |
|---|---|---|
| `index.html` | change | Add `__TITLE__` / `__DESCRIPTION__` / `__IMAGE__` / `__URL__` placeholders + full default OG + Twitter tag set |
| `api/metadata-proxy.mjs` | **new** | Serverless function — resolves metadata, fills placeholders, returns HTML |
| `src/data/seo-metadata.js` | **new** | Static map for non-CMS routes; named OG image constants per section |
| `vercel.json` | change | Route all HTML requests through the proxy |
| `public/robots.txt` | **new** | Allow all crawlers, disallow `/cart` + `/checkout`, point to sitemap |
| `public/sitemap.xml` | **new** | All public routes with priority + change-frequency |
| `public/og/default.png` | **new** | 1200×630 PNG, brand burgundy + wordmark |
| `public/og/*.png` | optional | Per-section OG variants — `/shop`, `/blog`, `/collections`, etc. |
| `studio/schemaTypes/article.js` | change | Add `seo` field group → `seoTitle`, `seoDescription`, `ogImage` |
| `studio/schemaTypes/collection.js` | change | Same `seo` group |

---

## Where each piece of metadata comes from

The proxy checks **three places in order**. First match wins; inside each tier, fallbacks chain so nothing is ever blank.

### Tier 1 — Sanity (dynamic content)

| Route | Sanity doc | Lookup chain |
|---|---|---|
| `/blog/:slug` | `article` | **title** ← `seo.seoTitle` → `title` |
| | | **description** ← `seo.seoDescription` → `excerpt` |
| | | **image** ← `seo.ogImage` → **`coverImage`** ← ← yes, auto-pulled |
| `/collections/:slug` | `collection` | **title** ← `seo.seoTitle` → `title` |
| | | **description** ← `seo.seoDescription` → `description` |
| | | **image** ← `seo.ogImage` → **`coverImage`** ← ← auto-pulled |
| `/blog/author/:slug` | `author` | **title** ← `name` · **description** ← `bio[0]` · **image** ← `image` |

> The `coverImage` auto-pull is the key point. Editors don't need to touch the `seo` tab unless they want to override the headline / excerpt / hero. Backfilled content works without any Studio edits.

### Tier 2 — Shop data (commerce)

| Route | Source | Lookup |
|---|---|---|
| `/shop/:slug` | `src/brand/data/shop-data.js` | `name` · `description` · `image` (Printful mockup) |
| `/handmade/:slug` | `src/brand/data/shop-data.js` | `name` · `description` · `image` (hand-authored) |

### Tier 3 — Static map (everything else)

A flat `STATIC_META` object in `src/data/seo-metadata.js`. One entry per route. Listing routes that need entries:

- `/` · `/shop` · `/handmade` · `/blog` · `/collections`
- `/about` · `/contact` · `/faq`
- `/brand` · `/press`
- `/privacy` · `/terms`
- `/cart` · `/checkout` · `/checkout/confirmation` → flagged `noindex`

Each entry: `{ title, description, image }`. Image points to a named constant (`OG_DEFAULT`, `OG_SHOP`, `OG_BLOG`, etc.) so per-section swaps are a one-liner.

---

## OG image specs

| Property | Rule |
|---|---|
| Dimensions | **1200 × 630 px** (1.91:1 ratio) |
| Format | JPG or PNG |
| File size | Under 1 MB recommended; 8 MB hard cap |
| Aspect ratio | **Landscape only** |

**Why landscape matters:**

```
1200 × 630 (landscape)  →  big card, image on top, title + description below  ✓
square / portrait       →  small thumbnail beside text, looks cheap           ✗
```

Facebook and LinkedIn choose the card layout from the image's aspect ratio. We don't get to override this.

### Gotcha for `/shop/:slug` and `/handmade/:slug`

Printful mockups are portrait or square. Shared product links on Facebook will render as small-thumbnail cards. Two options:

1. **Accept it for v1** — most product sharing happens via Instagram (no OG cards) or DMs. Recommended.
2. **Add a `shareImage` field per product** — 1200×630 landscape crop. Extends `printful-products.json` + `shop-data.js`. Roughly an hour of code + design time per crop.

---

## `robots.txt`

```
User-agent: *
Allow: /

# Block commerce paths from indexing — no SEO value, only privacy
Disallow: /cart
Disallow: /checkout
Disallow: /checkout/confirmation

Sitemap: https://another-creation.xyz/sitemap.xml
```

---

## `sitemap.xml`

Static XML committed to `public/`. Priorities and change-frequencies:

| Route | Priority | Change freq |
|---|---|---|
| `/` | 1.0 | weekly |
| `/shop` · `/handmade` · `/collections` · `/blog` | 0.9 | weekly |
| `/shop/:slug` · `/handmade/:slug` | 0.8 | monthly |
| `/blog/:slug` · `/collections/:slug` | 0.8 | monthly |
| `/about` · `/contact` · `/faq` | 0.6 | yearly |
| `/brand` · `/press` · `/privacy` · `/terms` | 0.4 | yearly |

For dynamic routes — hand-list them in v1. Build-time generation from `shop-data.js` + Sanity is a follow-up once the route count grows.

---

## Sanity schema additions

Same `seo` field group on both `article` and `collection`:

```js
defineField({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  group: 'meta',
  fields: [
    defineField({
      name: 'seoTitle',
      title: 'SEO title',
      type: 'string',
      validation: (Rule) => Rule.max(60),
      description: 'Overrides article title in social previews + search results.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO description',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(160),
      description: 'Overrides excerpt in social previews. 120–160 chars ideal.',
    }),
    defineField({
      name: 'ogImage',
      title: 'OG image',
      type: 'image',
      description: 'Landscape 1200×630 image for social previews. Defaults to cover image if empty.',
    }),
  ],
}),
```

Add a `meta` field group at the top of each schema so the Studio tabs the SEO fields away from the editorial fields. Editors never need to touch the SEO tab unless they want to override the auto-pulled defaults.

---

## Cache clearing after deploy

Social platforms cache OG metadata aggressively. After every metadata change:

| Platform | Tool |
|---|---|
| Facebook | [Sharing Debugger](https://developers.facebook.com/tools/debug/) → paste URL → **Scrape Again** (sometimes twice) |
| LinkedIn | [Post Inspector](https://www.linkedin.com/post-inspector/) → paste URL → **Inspect** |
| X / Twitter | No scrape tool. Wait up to 7 days, or append `?v=2` to force a new cache key. |
| Slack | Unfurl in a private channel → kebab menu → **Remove preview** → re-paste. |

For first launch: ping each tool against every public route to seed the cache cleanly.

---

## Local testing

`scripts/test-meta.sh`:

```bash
#!/bin/bash
# Usage: ./scripts/test-meta.sh /blog/some-article
URL=$1
curl -A "Twitterbot" -L "http://localhost:3000$URL" | grep -E 'og:|twitter:|<title'
```

Run against `vercel dev` (not `pnpm dev` — Vite doesn't run serverless functions). After deploy, run the same script against `https://another-creation.xyz`.

---

## Implementation order

Three passes. Each ships independently.

### Pass 1 — Infrastructure + static routes (~2 hr)

1. Rewrite `index.html` → placeholders + full default OG + Twitter tags
2. Build `api/metadata-proxy.mjs` (Tier 3 only — static map)
3. Update `vercel.json` rewrite → route HTML through the proxy
4. Build `src/data/seo-metadata.js` with `STATIC_META` for non-CMS, non-product routes
5. Commit `public/robots.txt`
6. Design + commit `public/og/default.png` (1200×630, brand burgundy + wordmark)
7. Commit `public/sitemap.xml` (hand-listed for v1)

**Ships:** correct previews + indexing for `/`, `/shop`, `/handmade`, `/blog`, `/collections`, `/about`, `/contact`, `/faq`, `/brand`, `/press`, `/privacy`, `/terms`.

### Pass 2 — Sanity-driven routes (~2 hr)

1. Add `seo` field group to `studio/schemaTypes/article.js` + `collection.js`
2. Deploy Studio
3. Extend proxy → fetch Sanity for `/blog/:slug`, `/collections/:slug`, `/blog/author/:slug`
4. Wire fallback chain (`seo.seoTitle` → `title` → site default)

**Ships:** correct previews for every blog article + every collection, including all backfilled content. **Zero Studio edits needed** — fallbacks cover existing docs.

### Pass 3 — Product routes + polish (~2 hr)

1. Extend proxy → handle `/shop/:slug` + `/handmade/:slug` via `shop-data.js`
2. Decide on landscape product OG strategy (see §5 gotcha)
3. Add per-section OG variants if wanted (`/shop`, `/handmade`, `/blog`, `/collections`)
4. Run every route through Facebook + LinkedIn debuggers to seed cache
5. Submit `sitemap.xml` to Google Search Console + Bing Webmaster

**Ships:** complete coverage. Site is metadata-grade end to end.

---

## Open decisions

- **Per-section OG variants?** Single default is simplest. Per-section adds polish but ~4× design time. Recommendation: single default for v1.
- **Landscape product OGs?** See §5. Recommendation: defer.
- **Google Search Console + Bing Webmaster setup?** Required for sitemap submission. Free, tiny admin step per provider.
- **JSON-LD structured data?** Schema.org `Product`, `Article`, `Organization`. Boosts rich results in Google search. Phase 2 — only worth it once organic traffic is real.
- **`og:locale`?** Site is English-only. Tag `en_US` and move on.
- **Twitter handle?** No AC handle yet (LinkedIn-only per `business-data.js`). Skip `twitter:site` until there's a handle.

---

## Notes from the kolkrabbi.io build

Distilled from the 2026-02-20 implementation session at `_tmp/docs/llm-context-protocol/session-logs/2026-02-20-edge-injection-social-meta.md`:

- The proxy reads `dist/index.html` at request time. Vercel CDN already serves static JS/CSS/image assets before rewrites fire, so the proxy only runs for HTML requests — no perf impact on asset loading.
- Cache the proxy response: `Cache-Control: s-maxage=60, stale-while-revalidate`. Otherwise we'd hit Sanity on every crawler ping.
- Sanity credentials come from `VITE_SANITY_PROJECT_ID` and `VITE_SANITY_DATASET` — already set on Vercel for acyr. No new env vars, no token (dataset is public-read).
- `react-helmet-async` is **not** required on acyr. React 19 hoists `<title>` and `<meta>` natively for in-app SPA navigation. The edge proxy is the load-bearing piece for crawlers; React's native hoisting handles browser users.
- Facebook will complain about a missing `fb:app_id`. Only needed for Facebook Analytics/SDK. Ignore.
