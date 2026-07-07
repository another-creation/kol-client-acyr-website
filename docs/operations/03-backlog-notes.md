# Backlog notes

Context, rationale, and paste-ready details for open items in `02-backlog.md`. Anchors match item IDs (`7a`, `7d`, etc).

Closed-item notes live in `../backlog-archive/2026-05-19-notes.md` with original numbering preserved.

---

## 6a
Stack to ship — all free except Plausible (€9/mo). Order matters; do top-down.

**Pivot:** previously planned self-hosted Umami → Plausible. Umami's dollar cost is zero but hours-cost is real (4th Vercel project + Postgres + `/metrics` rewrite + per-event JSX wire-ups + ongoing version maintenance). Plausible is one `<script>` tag + dashboard-configured goals + first-party proxy (one `vercel.json` block), no cookie banner, EU-hosted, UTM/source view built in for the Iceland → Asia → America campaign sequence. €108/yr buys back ~6 hr of agency time + a dashboard Ýr can read alone. Keep self-hosted Umami for personal curiosity projects.

### 1. Google Search Console (~15 min, free)
- search.google.com/search-console → Add property → Domain → `another-creation.xyz`
- Copy TXT, add at Cloudflare DNS (Name `@`, TTL Auto, proxy off)
- Verify → Sitemaps → submit `sitemap.xml`
- First data ~48–72 hr

### 2. Bing Webmaster (~5 min, free)
- bing.com/webmasters → Add a site → **Import from Google Search Console** (skips manual TXT)
- Submit sitemap URL

### 3. Plausible (~30 min, €9/mo)
- plausible.io → free 30-day trial, no card → Add site `another-creation.xyz`, tz Europe/Reykjavik, EUR
- **First-party proxy** in `apps/website/vercel.json` — add ABOVE the metadata-proxy catch-all rewrite (order matters):
  ```json
  { "source": "/js/script.js", "destination": "https://plausible.io/js/script.js" },
  { "source": "/api/event",   "destination": "https://plausible.io/api/event" }
  ```
- Test: `curl -I https://another-creation.xyz/js/script.js` → 200, not SPA fallback
- Script in `apps/website/index.html` `<head>` (use tagged-events bundle for auto mailto/outbound/file-dl tracking):
  ```html
  <script defer data-domain="another-creation.xyz"
          src="/js/script.outbound-links.file-downloads.tagged-events.js"></script>
  ```
- Dashboard goals (5): `pageview /shop`, `pageview /handmade`, `pageview /checkout`, custom event `Outbound: mailto`, custom event `Order completed`
- Wire `Order completed` in `apps/website/src/pages/site/OrderConfirmation.jsx`:
  ```jsx
  useEffect(() => {
    if (window.plausible && capture?.id) {
      window.plausible('Order completed', {
        props: { value_eur: capture.amount },
        revenue: { amount: capture.amount, currency: 'EUR' }
      })
    }
  }, [capture?.id])
  ```
- Build two funnels in dashboard: shop (`/shop` → `/shop/:slug` → `/checkout` → `Order completed`) and handmade (`/handmade` → `/handmade/:slug` → `Outbound: mailto`)

### 4. Native dashboards → Bitwarden (~10 min)
PayPal Business, Printful, MailerLite, Sanity Studio, Vercel — URLs + 1-liner "what to look at" per entry.

### 5. Meta + TikTok Pixel — STAGE, don't fire (~20 min, $0)
Reason to install pre-campaign: pixel with 30–90 days of conversion data attached when first ad launches outperforms one installed the day-of. Cold-start cost is real.
- Create both pixel accounts (manual install method), note Pixel IDs, **don't paste codes**
- New `apps/website/src/components/site/PixelLoader.jsx` reads `VITE_META_PIXEL_ID` + `VITE_TIKTOK_PIXEL_ID`; loads snippets only when set; mount once in `SiteLayout.jsx`
- Leave both env vars unset in Vercel. Inert = no pixel fires = no GDPR consent banner owed yet
- Triggers to flip on: first Meta boost / TikTok promoted post / first organic link-in-bio campaign worth attributing. Ship the cookie consent banner same PR.

### 6. UTM convention for the campaign sequence (~10 min)
Plausible's Sources view groups by UTM, but only if links are tagged consistently. Locked convention:
- `utm_source` = platform: `instagram` / `tiktok` / `linkedin` / `press` / `newsletter`
- `utm_medium` = placement: `paid` / `organic` / `story` / `bio` / `email` / `article`
- `utm_campaign` = `launch-<region>-<YYYY-MM>` (e.g. `launch-iceland-2026-06`)
- `utm_content` = optional creative variant (`reel-a`, `static-1`)

Append-only log at `docs/utm-links.md` (NOT in client/ tree — internal): every link generated, what creative it was on, when. Single best protection against forgetting which IG post had which tag months later.

### 7. Monthly review routine (~20 min/month)
First Monday: GSC Performance (top queries, CTR<2% pages, rank 11–20 pages) → Plausible (top sources, funnel completion %) → PayPal + Printful (refunds, per-SKU margin) → MailerLite (open / unsub rate if a send went out). Findings into a `docs/monthly-review.md` append log.

### Skipped + why
- **GA4** — requires EU cookie banner, hostile dashboard, ethics mismatch with rest of stack
- **Umami self-hosted** — see pivot above
- **Ahrefs / Semrush** — $100+/mo for keyword data GSC's Queries tab gives free at this scale; revisit at 10× traffic
- **Vercel Analytics paid** — free tier fine for CWV only; custom events = Plausible's job
- **Hotjar / FullStory** — privacy-invasive, expensive, not actionable at <1k/week
- **A/B testing platforms** — sub-1k weekly sessions can't reach significance; revisit at 10×

### Verification — both 6a + 6b close when all green
- [ ] GSC verified + sitemap "Success"
- [ ] Bing imported + sitemap submitted
- [ ] Plausible registers first pageview within 5 min of script paste
- [ ] `curl -I /js/script.js` returns 200 (proxy works)
- [ ] 5 goals + 2 funnels configured in Plausible dashboard
- [ ] Sandbox PayPal capture fires `Order completed` event with revenue in Plausible
- [ ] `PixelLoader.jsx` mounted; both env vars exist + empty; no pixel network requests in DevTools
- [ ] 5 dashboard URLs in Bitwarden under AC folder
- [ ] `docs/utm-links.md` exists with convention table + 1 example row

### Strategic frame (not for client tree)
Ýr's reach is larger than the site suggests — active in field, on boards, easy press. Highest-leverage tracking isn't "cold discovery" (not the channel), it's **conversion rate from already-warm sources**: IG bio click-throughs, press-article referrals, board-member intros. Plausible's Sources + UTM view is built for that. The 5 press citations 2011–2020 in `business-data.js` become individually UTM-tagged if she emails those journalists about new work — same view tells you which press contacts drive real conversion vs. vanity.

A/B testing explicitly out of scope until traffic 10× current. Sub-1k weekly sessions cannot reach statistical significance; energy better spent writing one more product page or journal article.

## 7a
Playbook: `client/03-infrastructure/02-handoff.md` — Cloudflare account-internal move + Proton credential swap. Blocked until client has a Cloudflare account.

## 7b
Playbook: `client/01-website/03-cms/01-sanity-handoff.md` (Pattern B — three-layer transfer covering Sanity project, Vercel Studio project, developer access cleanup). After handoff: revoke the `migration-script` API token in `sanity.io/manage → project → API → Tokens`.

## 7c
Sync grabs one mockup; cart dedupes on `slug + size`. Real fix touches:
- `scripts/sync-printful.mjs` — pull all preview mockups, not just first
- `src/brand/data/printful-products.json` schema — image array + color variants
- `src/pages/site/ProductDetail.jsx` — gallery + color picker
- `src/components/site/CartContext.jsx` — line ID includes color
- `api/_lib/products.mjs` — `lookupVariant` keys on `slug + size + color`

## 7d
- **Unsubscribe wiring** — MailerLite auto-injects an unsubscribe footer + handles the link/page itself. Confirm "Unsubscribe settings" page templates match brand voice.
- **Custom tracking domain** — MailerLite default uses `*.clicks.mlsend.com` for link tracking, which uBlock Origin + similar privacy blocklists block (seen in test: subscriber's confirmation link blocked by Peter Lowe's list). Fix: set `clicks.another-creation.xyz` as a custom tracking domain in MailerLite → Domains → Custom tracking domain. CNAME points at MailerLite's tracking endpoint. Subscriber's click stays on our own domain → blocklists don't match.

## 7f
`.xyz` carries a deliverability tax (new-gTLD, used heavily by spam farms); first sandbox test landed in Gmail Junk despite full DKIM/SPF/DMARC. Reputation builds with sending history, so revisit after ~30 days of consistent valid sends. Options if it doesn't recover:
- **Switch site to `.com`** — cut over from the live Squarespace `another-creation.com` (client-owned, separate decision).
- **Buy `.io`** — ~$40-50/yr, neutral-reputation TLD. Site stays on `.io`, email lands clean.
- **Email-only split** — keep site on `.xyz`, send newsletters from a separate `.com` / `.io` sending domain (extra MailerLite config, more moving parts).
