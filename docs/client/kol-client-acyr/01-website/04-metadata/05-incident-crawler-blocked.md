---
title: Pass 1 incident — crawlers blocked on the root route
type: log
topics:
  - metadata
  - vercel
  - deploy
  - debugging
audience: agency-internal
status: archived
domain: another-creation.xyz
date: 2026-05-17
severity: launch-blocker
resolution_time_minutes: 45
fixed_in:
  commit: 937e8c1
  branch: metadata-pass-1
companion_to:
  - "[[01-website/04-metadata/01-plan|metadata-plan]]"
  - "[[01-website/04-metadata/02-operations|operations]]"
related:
  - "[[01-website/04-metadata/01-plan|metadata-plan]]"
  - "[[01-website/04-metadata/02-operations|operations]]"
  - "[[01-website/04-metadata/03-routes|routes]]"
  - "[[01-website/04-metadata/04-og-images|og-images]]"
modified: 2026-05-17
tags:
  - client/setup/metadata
  - provider/vercel
  - topic/incident
  - topic/troubleshooting
  - topic/deploy/routing
  - topic/deploy/rewrites
  - topic/deploy/filesystem
  - topic/deploy/preview-branches
  - topic/crawlers
  - status/resolved
---

# Pass 1 incident — crawlers blocked on the root route

**One-liner:** every route except the bare homepage `/` served correct metadata to crawlers. The homepage returned the raw template with literal `__TITLE__` / `__IMAGE__` strings. Root cause: Vercel's filesystem routing serves `dist/index.html` for `/` **before** any rewrite is evaluated, so the metadata-proxy function never ran for the homepage. Fix: rename the build output to `dist/app.html` so Vercel has no `index.html` to filesystem-serve for `/`, the rewrite fires unopposed, the proxy runs.

---

## §1 — What we were trying to do

Ship Pass 1 of the metadata pipeline: every route returns route-specific `<title>`, `<meta description>`, Open Graph tags, Twitter card tags, canonical URL, robots directive. Edge-injection pattern — Vercel serverless function reads `dist/<template>`, substitutes placeholders, returns filled HTML to whoever asked (crawler or browser).

Architecture, by design:

```
Crawler hits  https://another-creation.xyz/<anything>
        ↓
Vercel rewrites /<anything>  →  /api/metadata-proxy
        ↓
Proxy looks up the route in src/data/seo-metadata.js
        ↓
Reads dist/<template>, fills __TITLE__ / __DESCRIPTION__ / __IMAGE__ / __URL__ / __ROBOTS__
        ↓
Returns the filled HTML  →  crawler sees correct meta tags ✓
```

For every route to work, the rewrite has to fire for every URL — including `/`.

---

## §2 — The branch workflow we used

Because the change rewrote `vercel.json` to route **every HTML request** through a serverless function, a bug in the function would 500 the entire site. Pushing straight to `main` would have meant a production outage if anything went wrong. So we used Vercel's preview-branch flow:

```
1. git checkout -b metadata-pass-1         ← isolated feature branch
2. git push -u origin metadata-pass-1      ← pushes branch to GitHub
3. Vercel sees the push, builds a preview deploy automatically
4. Vercel publishes a preview URL — kol-client-acyr-website-git-metad-…vercel.app
5. We smoke-test against the preview URL — production is untouched
6. If smoke tests pass: git checkout main && git merge metadata-pass-1 && git push
7. Production redeploys with the verified code
```

The preview URL is a **branch alias** — it stays the same across multiple pushes to the same branch, always pointing at the latest deploy. (Vercel also publishes a per-commit immutable URL, but the branch alias is what we use for iterative testing.)

This kept production safe while we shipped four fixes in sequence on the branch:

| Commit | What it changed |
|---|---|
| (initial branch push) | All Pass 1 files: proxy, seo-metadata, index.html template, robots, sitemap, OG images |
| `b16a06c` | `vercel.json` rewrite source from `/(.*)` to `/:path*` |
| (in between) | Explicit `/` rewrite added |
| `937e8c1` | Renamed build output to `app.html`; proxy reads new filename |

Only after every smoke test passed on the preview did we merge to `main`.

---

## §3 — What the smoke-test script does

`scripts/test-meta.sh` simulates a crawler hitting a URL with a Twitterbot user-agent, then prints the meta tags the server returned. It's how we verify "what crawlers see" without manually viewing the page source 8 times.

Usage:

```bash
./scripts/test-meta.sh <route> [target]

# Examples:
./scripts/test-meta.sh /shop                    # localhost (needs vercel dev)
./scripts/test-meta.sh /shop live               # production another-creation.xyz
./scripts/test-meta.sh /shop https://…vercel.app   # any preview deploy
```

Under the hood:

```bash
curl -s -A "Twitterbot" -L -c "$COOKIES" -b "$COOKIES" "${FULL_URL}" \
  | grep -E 'og:|twitter:|<title|name="description"|name="robots"|rel="canonical"'
```

- **`-A "Twitterbot"`** — sends a User-Agent header that identifies us as a crawler, in case the server uses UA-sniffing to route us differently. (Vercel doesn't, but we use the convention to match real crawler traffic.)
- **`-L`** — follow redirects.
- **`-c $COOKIES -b $COOKIES`** — cookie jar (read and write to the same temp file). This part wasn't in the first version; it had to be added — see §4 below.
- **`grep -E ...`** — filter only the lines we care about so the output is scannable.

**When it works**, output looks like:

```
→ Crawler simulation: https://another-creation.xyz/shop

    <title>Shop — Another Creation</title>
    <meta name="description" content="Made-to-order pieces designed by Ýr in Reykjavík. Shipped worldwide." />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://another-creation.xyz/shop" />
    <meta property="og:title" content="Shop — Another Creation" />
    <meta property="og:image" content="https://another-creation.xyz/og/open-graph-ps-01.jpg" />
    …
```

**When it doesn't work**, you get either the auth wall (auth issue), or the raw template with `__TITLE__` placeholders (proxy didn't fire).

---

## §4 — Why the script initially didn't work (two blockers on preview deploys)

### Blocker 1: Vercel Deployment Protection

By default, Vercel preview deploys are **gated** — you have to be logged into Vercel to view them. This is correct for not-yet-published work, but it breaks `curl` because curl doesn't have a Vercel session cookie. First smoke test returned:

```html
<title>Authentication Required</title>
```

instead of the real HTML.

**Fix:** generate a Protection Bypass token in Vercel:

```
Vercel project → Settings → Deployment Protection
  → "Protection Bypass for Automation"
  → Add Secret
  → copy the generated token
```

Paste the token into `.env.local`:

```
VERCEL_AUTOMATION_BYPASS_SECRET=<token>
```

The script auto-reads it for any `.vercel.app` URL and appends:

```
?x-vercel-protection-bypass=<token>&x-vercel-set-bypass-cookie=true
```

### Blocker 2: cookie dropped on the redirect

Even with the token, the second smoke test STILL returned the auth wall. Trace:

```
1. curl requests …vercel.app/shop?x-vercel-protection-bypass=<token>&x-vercel-set-bypass-cookie=true
2. Vercel validates the token, sets a JWT cookie (`_vercel_jwt`) via Set-Cookie header,
   307-redirects to …vercel.app/shop (without the query params)
3. curl follows the redirect with `-L`
4. But without a cookie jar, curl drops the JWT cookie before the second request fires
5. The second request hits Vercel without auth → auth wall returned
```

**Fix:** add a cookie jar to curl so the JWT persists across the redirect:

```bash
COOKIES=$(mktemp)
trap 'rm -f "$COOKIES"' EXIT

curl -s -A "Twitterbot" -L -c "$COOKIES" -b "$COOKIES" "${FULL_URL}"
```

`-c $COOKIES` writes cookies to the jar; `-b $COOKIES` reads cookies from the jar on every subsequent request. The `trap` cleans up the temp file on script exit.

After both fixes, the script worked for 7 of 8 routes. `/` was the holdout.

---

## §5 — The real bug: Vercel filesystem routing beats rewrites for `/`

Symptom: `/` returned the literal placeholder template:

```html
<title>__TITLE__</title>
<meta name="description" content="__DESCRIPTION__" />
…
```

That means the proxy didn't run for `/`. Vercel served `dist/index.html` directly (the un-filled build output), without invoking the function.

`vercel.json` at that point was:

```json
"rewrites": [
  { "source": "/(.*)", "destination": "/api/metadata-proxy" }
]
```

### What we tried, in order

**Hypothesis 1: `/(.*)` doesn't match bare `/` because `.*` requires one or more chars.**

Switched to `/:path*` (path-to-regexp shorthand for "zero or more path segments"):

```diff
- { "source": "/(.*)", "destination": "/api/metadata-proxy" }
+ { "source": "/:path*", "destination": "/api/metadata-proxy" }
```

Pushed. Re-tested `/`. **Still raw placeholders.**

**Hypothesis 2: be explicit with two rules.**

```diff
"rewrites": [
+ { "source": "/", "destination": "/api/metadata-proxy" },
  { "source": "/:path*", "destination": "/api/metadata-proxy" }
]
```

Pushed. Re-tested `/`. **Still raw placeholders.**

That's when the actual cause became clear: **it's not that the rewrite isn't matching — it's that the rewrite never gets a chance to evaluate.**

### Vercel's actual routing order

```
1. Redirects   (always checked first)
2. Headers     (always applied)
3. Filesystem  (does a static file at this URL exist?  yes → serve it, done)
4. Rewrites    (only run if filesystem didn't match)
5. Fallbacks
```

For `/`, Vercel checks the build output and finds `dist/index.html`. That's a filesystem match for the URL `/index.html` and, by implicit-index convention, also for `/`. Vercel serves the static file. **The rewrite is never evaluated.**

This is why every other route worked: `/shop`, `/blog`, `/about`, etc. have no matching static file in `dist/`, so step 3 misses, step 4 runs, the rewrite fires, the proxy executes.

### The fix

Kill the filesystem match. If `dist/index.html` doesn't exist, Vercel has nothing to filesystem-serve for `/`, and step 3 falls through to step 4 (the rewrite fires).

Renamed the build output post-build:

```diff
// package.json
- "build": "vite build",
+ "build": "vite build && mv dist/index.html dist/app.html",
```

And taught the proxy to read the new filename:

```diff
// api/metadata-proxy.mjs
- const filePath = path.join(process.cwd(), 'dist', 'index.html')
+ const filePath = path.join(process.cwd(), 'dist', 'app.html')
```

Pushed (commit `937e8c1`). Re-tested `/`. **Filled correctly.** All 8 routes ✅.

---

## §6 — Verification on production

After merging `metadata-pass-1` → `main`, production rebuilt. Verified:

```bash
./scripts/test-meta.sh /         live    # ✅ Another Creation + logo-01.jpg
./scripts/test-meta.sh /shop     live    # ✅ Shop — AC + ps-01.jpg
./scripts/test-meta.sh /handmade live    # ✅ Handmade — AC + yr-01.jpg
curl -I https://another-creation.xyz/robots.txt     # ✅ HTTP 200, served as file
curl -I https://another-creation.xyz/sitemap.xml    # ✅ HTTP 200, served as file
```

Pass 1 live. Crawlers receive correct metadata for every route including `/`.

---

## §7 — Lessons

1. **Vercel rewrites cannot beat filesystem matches.** If a static file exists at the requested URL, it serves before any rewrite. For routes you want to always intercept, the filesystem must not have a file at that path.
2. **Bare `/` is special.** Implicit-index conventions make it match `index.html` even if you only meant to match the file at `/index.html` literally. Renaming the file is the only reliable way to take `/` away from filesystem routing.
3. **Preview branches are the right place to discover routing bugs.** Three pushes to `metadata-pass-1`, three Vercel rebuilds, zero production downtime. Pushing the first attempt to main would have served raw placeholders to every visitor on the homepage.
4. **Vercel's Deployment Protection bypass requires a cookie jar.** The bypass mechanism does a JWT-set-then-redirect dance that curl drops without `-c -b`. Any script that hits protected previews needs a temp cookie jar.
5. **Smoke-testing every route, not just one, catches partial bugs.** If we'd only tested `/shop` we'd have shipped Pass 1 with a broken homepage.

---

## §8 — Files touched during the fix

| File | Change |
|---|---|
| `vercel.json` | Rewrite source pattern adjusted (twice). Final form has explicit `/` + `/:path*`. |
| `package.json` | `build` script renames `dist/index.html` → `dist/app.html`. |
| `api/metadata-proxy.mjs` | Reads `dist/app.html` instead of `dist/index.html`. Error message updated. |
| `scripts/test-meta.sh` | Added cookie jar (`-c` / `-b`) so the Vercel Deployment Protection bypass redirect doesn't lose the JWT. |
| `.env.local` | Added `VERCEL_AUTOMATION_BYPASS_SECRET=` field for the bypass token. |
