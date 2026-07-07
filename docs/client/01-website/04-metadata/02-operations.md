---
title: Metadata, SEO, analytics — operations playbook
type: playbook
topics:
  - seo
  - metadata
  - analytics
  - copywriting
audience: agency-internal
status: draft
domain: another-creation.xyz
companion_to:
  - "[[01-website/04-metadata/01-plan|metadata-plan]]"
  - "[[01-website/04-metadata/03-routes|routes]]"
  - "[[01-website/04-metadata/04-og-images|og-images]]"
providers:
  tracking:
    - google-search-console
    - bing-webmaster-tools
  analytics:
    - plausible-cloud
  validation:
    - facebook-sharing-debugger
    - linkedin-post-inspector
    - google-rich-results-test
  hosting:
    - vercel
    - cloudflare
budgets:
  title_chars: 60
  description_chars: 160
  og_image: 1200x630
implementation_passes:
  pass_1: static-routes
  pass_2: sanity-driven
  pass_3: products
related:
  - "[[01-website/04-metadata/01-plan|metadata-plan]]"
  - "[[01-website/04-metadata/03-routes|routes]]"
  - "[[01-website/04-metadata/04-og-images|og-images]]"
  - "[[01-website/03-cms/02-sanity-log|sanity-log]]"
  - "[[01-website/01-setup/02-playbook|setup-playbook]]"
  - "[[02-brand/04-writing-guidelines|writing-guidelines]]"
modified: 2026-05-16
tags:
  - client/setup/metadata
  - client/setup/seo
  - client/setup/analytics
  - client/setup/copywriting
  - handoff-kit
  - provider/google/search-console
  - provider/google/trends
  - provider/microsoft/bing-webmaster
  - provider/plausible
  - provider/vercel
  - provider/cloudflare
  - topic/seo/rank-tracking
  - topic/seo/keyword-research
  - topic/seo/sitemap
  - topic/seo/robots-txt
  - topic/social/open-graph
  - topic/social/twitter-cards
  - topic/social/cache-busting
  - topic/analytics/visitor-tracking
  - topic/analytics/event-tracking
  - topic/analytics/funnels
  - topic/copywriting/voice
  - topic/copywriting/budgets
  - status/draft
---

# Metadata, SEO, analytics — operations playbook

How we **run** the metadata + SEO + analytics layer day-to-day. Companion to [[01-plan|the metadata plan]] which says what we're building.

---

## §1 — Copy workflow

How a new route's title + description gets written.

1. **Pick the route** — append to the routes inventory (§2).
2. **Identify the target searcher** — who's typing what into Google to land here? 1–3 plausible queries. Example for `/about`: "ýr þrastardóttir designer", "another creation iceland", "icelandic fashion atelier".
3. **Draft the title** — ≤ 60 characters. Format: `<Page topic> — Another Creation`. The topic carries the keyword(s), the brand carries the recognition.
4. **Draft the description** — 120–160 characters. Concrete sentence. Weave 1–2 of the target queries in natural language. No marketing-speak, no boast, no apology (writing-guidelines applies).
5. **Self-check** — read it aloud. If it sounds like SARA or H&M ad copy, rewrite. If it lists features without saying anything, rewrite.
6. **Apply to `src/data/seo-metadata.js`** — exact path, exact route key.
7. **Build + smoke-test** — `pnpm build && ./scripts/test-meta.sh /the-route`.
8. **Push** — Vercel redeploys → live.

### Voice anchors

- `docs/client/brand/writing-guidelines.md` — the rules.
- `docs/client/brand/writing-examples.md` — 10 worked prose pieces. The voice in motion.

### Character budgets

| Field | Target | Hard ceiling | Truncation behaviour |
|---|---|---|---|
| `<title>` | 50–60 chars | 70 | Google truncates with `…` past ~600 px |
| `<meta name="description">` | 120–160 chars | 320 | Google truncates past ~160; longer text is wasted |
| `og:title` | match `<title>` | 95 | LinkedIn truncates past 120 |
| `og:description` | match meta description | 200 | Facebook truncates past 200 |
| `twitter:title` | match `<title>` | 70 | X truncates past 70 |
| `twitter:description` | match meta description | 200 | X truncates past 200 |

The proxy fills all three pairs from the same `title` + `description` fields in `seo-metadata.js`. We don't author them separately unless a route specifically needs different framing for a specific platform.

---

## §2 — Routes inventory

**Canonical table lives in [[03-routes|routes]]** — per-route titles, descriptions, target queries, OG image, status. Edit there first, then mirror to `src/data/seo-metadata.js`.

### OG image map

**Canonical inventory lives in [[04-og-images|og-images]]** — three sets (`logo-*`, `ps-*`, `yr-*`), 18 files total, 10 mapped + 8 in reserve, full file links, route assignments, swap instructions.

---

## §3 — Deploy → indexed loop

Timeline from `git push` to "shows up in Google":

```
git push
  ↓ ~30 sec
Vercel build + deploy
  ↓ instant
Site live with new metadata
  ↓ minutes – days
Googlebot re-crawls (faster if pages are linked from the homepage)
  ↓ 1 – 4 weeks
New title/description shows in Google search results
```

To **speed up indexing** of a specific URL: go to Google Search Console → URL Inspection → enter the URL → **Request indexing**. Bypasses the natural crawl interval. Use sparingly (rate-limited per day).

To **bust social platform caches** after a metadata change to an already-shared URL:

| Platform | Tool | What it does |
|---|---|---|
| Facebook | [Sharing Debugger](https://developers.facebook.com/tools/debug/) | Paste URL → **Scrape Again** (sometimes twice) |
| LinkedIn | [Post Inspector](https://www.linkedin.com/post-inspector/) | Paste URL → **Inspect** |
| X / Twitter | No scrape tool exists post-2023 | Wait up to 7 days, or append `?v=2` to force a new cache key |
| Slack | unfurl in a private channel → kebab menu → **Remove preview** → re-paste | |

---

## §4 — Tracking: Google Search Console

**The load-bearing tracking tool.** Free, owned by Google, shows you what queries surface your pages.

### One-time setup

1. Go to https://search.google.com/search-console.
2. **Add property** → choose **Domain** (not URL prefix) → enter `another-creation.xyz`.
3. Google gives you a `TXT` record to add to DNS. In Cloudflare DNS, add the `TXT` record at `@`. Save.
4. Back in Search Console → **Verify**. Usually green within 2 minutes.
5. **Sitemaps** → enter `sitemap.xml` → Submit. Status flips to "Success" within hours.

### Monthly review (15 min)

Open Search Console → **Performance** report.

| Metric | What it tells you | What to do |
|---|---|---|
| Total impressions | How visible we are in search | Watch the trend — rising = working |
| Total clicks | Actual visitors from search | Same |
| **Average CTR** | Clicks ÷ impressions | < 2 % = description isn't pulling. Rewrite. |
| **Average position** | Where we rank | Below 10 = page 2+, very few clicks. Improve content or links. |
| **Queries tab** | Every search term that surfaced us | Look for queries with high impressions + low position → add that term to the right page's description |
| **Pages tab** | Per-page metrics | Identify the highest-impression page and tune its copy first |

### What the patterns mean

- **High impressions, low CTR** → people see us, don't click. Description is generic or unconvincing. Rewrite.
- **High impressions, low position (15+)** → people search this, we appear, but not high enough. Page needs more content depth + internal links.
- **Low impressions on a query you care about** → page isn't being surfaced at all. Either the page doesn't contain the query, or competitors dominate. Add the term to title/description/content.
- **A query that shouldn't be ours** (e.g. someone else's brand) → ignore, that's noise.

---

## §5 — Tracking: Bing Webmaster Tools

Same idea, smaller market (~3 % global, ~6 % in the US). Free. Worth 5 minutes once.

### Setup

1. https://www.bing.com/webmasters → **Sign in** (Microsoft account) → **Add a site** → `https://another-creation.xyz`.
2. Verify via DNS (`TXT` record) OR by importing from Google Search Console (the easy path — Bing reads your GSC properties).
3. Submit sitemap: `https://another-creation.xyz/sitemap.xml`.

Same reports as GSC. Lower volume, but free.

---

## §6 — Tracking: Plausible analytics *(superseded the Umami plan, 2026-05-20)*

Visitor analytics — pageviews, sources, devices, geographies, goal completions, funnels.

**Decision:** Plausible Cloud (€9/mo, EU-hosted, cookieless) replaces the previously planned self-hosted Umami. Umami's dollar cost is zero but hours-cost is real (Vercel project + Postgres + `/metrics` rewrite + per-event JSX wire-ups + ongoing version maintenance). Plausible is one `<script>` tag + dashboard-configured goals + first-party proxy (one `vercel.json` block), no cookie banner needed, and includes the UTM/source view we need for the multi-region campaign sequence.

This section is the persistent reference. The executable step-by-step (account creation, exact `vercel.json` rewrites, env-var-gated pixel staging, UTM convention, monthly review routine) lives in `backlog-notes.md#6a` — agency-internal, not in the handoff tree.

### What gets tracked

- **Auto:** pageviews, referrers, devices, countries, browsers — the moment the script loads.
- **Auto via tagged-events extension:** outbound links, file downloads, `mailto:` clicks. The bespoke pipeline (`mailto:` on `/handmade/:slug`) is covered without code.
- **Manual via `plausible('Event name', { props })`:** PayPal `Order completed` with `value_eur` prop, wired in `OrderConfirmation.jsx`. Revenue + funnel completion at the conversion edge.

### Funnels

Configured in dashboard, no code. Two live:

- **Shop:** `/shop` → `/shop/:slug` → `/checkout` → `Order completed`
- **Handmade:** `/handmade` → `/handmade/:slug` → `Outbound: mailto`

Drop-off % at each step shows where the friction is.

---

## §7 — Iteration rules

Triggers for changing something after launch.

| Signal | Action |
|---|---|
| CTR < 2 % on a page with > 100 impressions/month | Rewrite the meta description |
| Average position 11–20 on a query we care about | Add content depth on that page + internal links to it |
| Average position 21+ | Page is invisible. Audit competition, decide if the page is worth keeping or merging |
| New press citation lands | Add the citation to the page; consider a JSON-LD `Article` block |
| New product category | Decide if it deserves a section-specific OG image; add a per-section listing route if traffic warrants |
| A specific shared URL keeps showing the old preview | Run it through the Facebook + LinkedIn debuggers (cache-bust) |

---

## §8 — Tools catalogue

Every tool mentioned in this playbook + the metadata doc, with cost and purpose. Use this as the reference when picking what to set up.

### Tracking (rank + query data)

| Tool | Cost | Purpose | Use? |
|---|---|---|---|
| **Google Search Console** | free | Query rankings, impressions, CTR. The load-bearing one. | **Yes, day one.** |
| **Bing Webmaster Tools** | free | Same for Bing. Smaller volume but free. | **Yes, day one.** |
| Google Trends | free | Search interest over time for any term. Research / planning. | Optional, ad-hoc |
| Ahrefs | ~$100+/mo | Competitor keyword + backlink research. | Skip for v1 |
| SEMrush | ~$130+/mo | Same as Ahrefs. | Skip for v1 |
| Moz Pro | ~$100+/mo | Same family. Older alternative. | Skip for v1 |

### Validation (one-shot checks)

| Tool | Cost | Purpose |
|---|---|---|
| **Facebook Sharing Debugger** | free | OG preview + cache-bust |
| **LinkedIn Post Inspector** | free | LinkedIn preview + cache-bust |
| Twitter Card Validator | discontinued 2023 | (no live tool — read the response with `curl -A Twitterbot`) |
| Google Rich Results Test | free | Validates JSON-LD structured data; previews the rich result |
| Schema Markup Validator | free | Validates schema.org markup at the protocol level |
| Mobile-Friendly Test | free | Confirms page renders correctly on mobile (now folded into PageSpeed Insights) |
| PageSpeed Insights | free | Core Web Vitals + performance audit |

### Analytics (visitors, behaviour)

| Tool | Cost | Hosting | GDPR-clean? | Notes |
|---|---|---|---|---|
| **Umami (self-hosted)** | free | Fork → Vercel + Postgres free tier | Yes — cookieless | Open source. Pair with `/metrics` proxy for first-party tracking (see §6). Recommended for v1. |
| Umami Cloud | free up to 100k events/mo; paid above | Hosted by Umami | Yes | No setup. Generous free tier. |
| Plausible | ~$9/mo | Hosted | Yes — cookieless | Mature, popular alternative |
| Fathom | ~$15/mo | Hosted | Yes — cookieless | Same family |
| Google Analytics 4 | free | Hosted by Google | **No** — needs cookie banner + consent | Skip for AC. Privacy footprint clashes with brand. |
| Vercel Analytics | $10/mo per project | Hosted by Vercel | Yes — cookieless | Easy install, sparse features |

### AI search (newer discovery surface)

| Tool | Cost | What it does |
|---|---|---|
| ChatGPT search | free | OpenAI's web-grounded search. Indexes a smaller, quality-weighted set. |
| Perplexity | free / paid | Citation-first AI search. Tends to surface well-structured pages. |
| Claude (with web tools) | inside Claude Code | Quality content matters more than keyword tuning. Write well = rank well. |

No proactive setup needed for any of these — they crawl the open web. Side effect of writing well in §1: you rank in these too.

---

## §9 — What we don't do

The boundary. Things that look like SEO but aren't, or actively hurt.

- **`<meta name="keywords">`** — dead since 2009. Don't add it.
- **Keyword stuffing** — repeating "icelandic fashion designer" 5 times in a description. Google penalises this. Use the term once, in natural language.
- **AI-generated thin pages** — auto-spinning 200-word product descriptions to "improve coverage". Google's helpful-content update kills these.
- **Gaming Core Web Vitals** — micro-optimising LCP from 2.1s to 1.9s. Diminishing returns. Spend that time on content depth.
- **Buying backlinks** — fast way to a manual penalty. Earn links via press citations + original work.
- **Cloaking** — serving different content to crawlers vs users. Our edge proxy is fine (same HTML to both); cloaking is when you serve keyword-stuffed pages only to bots.
- **Tracking with cookies + GA4** — clashes with the brand position. Use Umami / Plausible / Fathom.
- **Per-route OG images for every page out of the gate** — over-investment. Start with one default, add section variants only when traffic warrants.
