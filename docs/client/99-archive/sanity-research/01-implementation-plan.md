---
title: Sanity implementation plan — Another Creation (ARCHIVED)
type: plan
topic: cms
audience: agency-internal
status: archived
archived_at: 2026-05-16
superseded_by: "[[sanity-playbook]]"
providers:
  - sanity
related:
  - "[[sanity-playbook]]"
  - "[[sanity-handoff]]"
tags:
  - archive
  - plan
  - provider/sanity
---

# Sanity implementation plan — Another Creation

Living doc. Replaces ad-hoc decisions in chat. Update as we lock or unlock things.

**Sanity project (already created):**
- Name: `another-creation`
- Project ID: `ajbrqqhq`
- Org ID: `o1RP6YtZv`
- Plan: Growth Trial (30 days)
- Dataset: `production` (default — to be confirmed in Datasets tab; if absent, you create it once)

---

## 1 — Decisions to lock before anything else

These are the load-bearing calls. Locking them up front means no mid-build refactor.

### 1.1 Self-host the Studio on Vercel — not on `*.sanity.studio`

Sanity's built-in `sanity deploy` only gives you `<name>.sanity.studio`. A custom domain like `studio.another-creation.xyz` **requires self-hosting**. Per Sanity docs: *"For a custom domain like studio.example.com, you must self-host the Studio. Sanity's built-in hosting only provides `*.sanity.studio` subdomains."*

Self-hosting on Vercel also sidesteps the class of bugs that bit you in the other repo:
- Studio bundle on infrastructure you already understand (same Vercel, same DNS provider as the main site).
- Auth still goes to Sanity's auth service — that part is unchanged regardless of where the static bundle is hosted. The "doesn't work like dev server" you saw on `kolkrabbi.sanity.studio` was almost certainly a CORS gap or a stale build, not a hosting limitation.
- No `sanity deploy` step. Vercel rebuilds on push.

**Decision: self-host on Vercel.**

### 1.2 Same repo, two Vercel projects — *not* a formal monorepo

This is the standard Sanity + Vite/Next pattern. `/studio` lives as a subfolder of `kol-acyr-website` with its **own** `package.json`. No pnpm workspaces, no Turborepo, no shared `packages/`. Two independent npm projects that happen to live in the same git repo.

```
kol-acyr-website/
├── package.json          ← existing site (Vite, React)
├── src/                  ← existing site code
├── api/                  ← existing Vercel serverless
├── studio/               ← NEW: Sanity Studio
│   ├── package.json      ← studio's own deps (sanity, @sanity/vision, etc.)
│   ├── sanity.config.js
│   ├── sanity.cli.js
│   └── schemaTypes/
└── scripts/
    └── migrate-to-sanity.mjs   ← one-shot, lives in main repo
```

Vercel side: **two projects pointing at the same repo**:
- `kol-client-acyr-website` (existing) — Root Directory `.`, builds the site.
- `acyr-studio` (new) — Root Directory `studio`, builds the Studio.

This is exactly how Vercel's "Root Directory" project setting is designed to be used. No formal monorepo tooling needed.

**Decision: subfolder, two Vercel projects, no workspaces.**

### 1.3 Content scope, locked

In Sanity now:
- `article` (journal posts) — 4 dummies migrated 1:1
- `author` (referenced from `article`)
- `collection` (the runway-style collections)
- `look` (nested inside `collection` — currently inline in `collections-data.js`)

Deferred — not in this round:
- Legal pages (Privacy / Terms / Shipping & Returns) → see §9.1.
- Multi-image / color variants for shop products → backlog item 3, unchanged.

### 1.4 Image handling

Collections images **and** videos → uploaded to Sanity as assets during migration. Blog images → uploaded too, but lower priority since they're still mocks (per your call).

Originals in `public/brand/collections/`, `public/brand/photoshoot/`, `public/brand/mood/` **stay put** until I grep the repo for other consumers and confirm what's safe to remove. We do not delete anything in this round.

### 1.5 Trade-off you're accepting

`/blog` and `/collections` currently render instantly because the data ships inside the JS bundle. After Sanity, the page mounts → fires a fetch to `api.sanity.io` → renders when the response lands. ~100-300ms of empty state on first load, cached after that. Not catastrophic, but visible. Fix later by baking the data into the build (static fetch at build time) if it bothers you. Not doing it now.

---

## 2 — What I need from you (action items)

Ordered. Do them in this sequence; nothing in section 3+ runs until these are done. Each one is small.

| # | Action | Where | What I need back |
|---|---|---|---|
| A | Confirm or create dataset `production` | sanity.io/manage → project → Datasets tab | Just a "yes it exists" / "I created it" |
| B | Generate an API token, **Editor** scope, name it `migration-script` | sanity.io/manage → project → API tab → Tokens → Add API token | The token string — paste it once, I'll write it into `.env.local` (gitignored) and we never speak of it again |
| C | Add CORS origins | sanity.io/manage → project → API tab → CORS Origins → Add CORS origin | Add these four, all with **Allow credentials = YES**: <br>• `https://another-creation.xyz` <br>• `https://www.another-creation.xyz` <br>• `https://studio.another-creation.xyz` <br>• `http://localhost:5173` <br>(I can also do these from CLI later with `sanity cors add` — your call.) |

That's it for the upfront block. Nothing else from you until §5.

After §3 (repo scaffold) is done, you'll get a second short list:
- D. Create the Vercel project for the studio (Root Directory = `studio`).
- E. After the studio is live on `acyr-studio.vercel.app`, add `studio.another-creation.xyz` as a custom domain in that Vercel project → Cloudflare CNAME, proxy OFF (same pattern as the site domain).
- F. Run the migration script once (`pnpm migrate-sanity`).

---

## 3 — Repo scaffolding (I do this, no input needed)

Single PR / set of edits, no questions:

1. Create `studio/` folder with its own `package.json`. Deps: `sanity`, `@sanity/vision`, `react`, `react-dom`, `styled-components`.
2. `studio/sanity.config.js` wired to project ID `ajbrqqhq`, dataset `production`.
3. `studio/sanity.cli.js` — same config, for CLI commands.
4. Empty `studio/schemaTypes/index.js` ready for §4.
5. Add `studio/` to `.gitignore`-adjacent things: `studio/node_modules`, `studio/dist`.
6. Add scripts to **root** `package.json`:
   - `studio:dev` → `cd studio && pnpm dev`
   - `studio:build` → `cd studio && pnpm build`
   - `migrate-sanity` → `node scripts/migrate-to-sanity.mjs`
7. Add `@sanity/client` and `@sanity/image-url` to the **site's** root `package.json` (not the studio's).
8. Add a `.env.example` documenting:
   - `VITE_SANITY_PROJECT_ID=ajbrqqhq`
   - `VITE_SANITY_DATASET=production`
   - `SANITY_WRITE_TOKEN=` (for the migration script only — never client-side)

After this, `pnpm studio:dev` opens an empty studio at localhost. We've broken no existing code.

---

## 4 — Schemas (I do this, no input needed)

Mirror existing shapes 1:1. Field names match `blog-data.js` and `collections-data.js` so the JSX rename in §6 is mechanical.

- **`author`**: `name`, `slug`, `bio`, `avatar` (image with hotspot)
- **`article`**: `title`, `slug`, `excerpt`, `body` (portable text), `coverImage`, `author` (reference → author), `publishedAt`, `tags`
- **`collection`**: `title`, `slug`, `season`, `description`, `coverImage`, `coverVideo` (file), `looks` (array of `look`), `publishedAt`
- **`look`** (object, not document): `image`, `caption`, `credits`

Portable Text for `article.body` — Sanity's structured rich-text format. Maps to JSX through `@portabletext/react`. Better than markdown for editor UX (the whole point of Sanity).

---

## 5 — Migration script (I write, you run once)

`scripts/migrate-to-sanity.mjs` — uses `@sanity/client` with `SANITY_WRITE_TOKEN` from `.env.local`. Reads existing `ARTICLES`, `AUTHORS`, `COLLECTIONS` arrays directly from the data files. For each entry:

1. Upload referenced images from `public/brand/...` as Sanity assets via `client.assets.upload()`.
2. `createOrReplace` the document with a **deterministic `_id`** derived from the slug (so re-running the script is idempotent — doesn't duplicate).
3. Resolve `author` refs by slug after authors are uploaded first.

Why custom script over `sanity dataset import` NDJSON: images live as local file paths in this repo, not URLs. The custom script handles that cleanly; NDJSON import would need a pre-step to upload assets and rewrite refs. Less code overall.

You run it once: `pnpm migrate-sanity`. Output is a count + the document IDs. Verify in Studio. If a re-run is needed (e.g., schema tweak), it's safe — `createOrReplace` overwrites.

---

## 6 — Frontend read layer (I do this, no input)

One file at the seam, one page at a time:

1. `src/lib/sanity.js` — single `@sanity/client` instance, no token (public read), reads `VITE_SANITY_PROJECT_ID` / `VITE_SANITY_DATASET`.
2. `src/lib/queries.js` — GROQ queries: `articlesList`, `articleBySlug`, `collectionsList`, `collectionBySlug`, etc. Naming mirrors the existing helpers in `blog-data.js` / `collections-data.js` (`sortedArticles`, `findArticle`, etc.).
3. Swap `Blog.jsx` first — read from Sanity, verify visual parity, ship.
4. Swap `BlogArticle.jsx`, `BlogAuthor.jsx`.
5. Swap `Collections.jsx`, `CollectionDetail.jsx`.
6. Each swap is a single PR-sized change. Loading state = a thin skeleton matching the layout.

`blog-data.js` and `collections-data.js` stay in the repo until all five pages are swapped and live. Then your call on deletion.

---

## 7 — Studio deploy + custom domain (I write config, you do DNS)

1. I push `studio/` to the repo.
2. **You** create a new Vercel project pointing at this repo, Root Directory = `studio`. Default framework preset will detect Sanity. Build command `pnpm build`, output `dist`. Vercel gives it a URL like `acyr-studio.vercel.app`.
3. Verify login works there — visit URL, sign in with Google/GitHub linked to the Sanity account, see the schemas.
4. **You** add `studio.another-creation.xyz` as a custom domain in Vercel.
5. **You** add the CNAME in Cloudflare → `studio` → `cname.vercel-dns.com`, proxy **OFF** (same as the site domain).
6. Vercel issues TLS, ~1 min. Done.

The studio is then live, always-on, no `sanity dev` ever needed.

---

## 8 — Handoff readiness

What ownership transfer needs (when it happens):

- Sanity project → transfer org to client's Sanity account (Sanity's UI supports this).
- Vercel project (`acyr-studio`) → transfer to client's Vercel account along with the main site.
- The write token from §2.B is yours and gets revoked at handoff; client generates their own if they ever need migration scripts. The frontend doesn't use a token (public read).

This is covered alongside the existing `domain-email-handoff.md` playbook. I'll write a short `sanity-handoff.md` once the build is live.

---

## 9 — Deferred / not in this round

### 9.1 Legal pages in Sanity (`page` schema)

Single `page` schema with `slug`, `title`, `body` (portable text). Three docs: privacy, terms, shipping-returns. JSX pages become a generic `Page.jsx` driven by `useParams().slug`. Adds editor control over copy for Ýr.

Status: **agreed in principle, not in this round**. Land journal + collections first; bolt on after the swap is proven.

### 9.2 Build-time bake (kill loading state)

If the fetch-on-mount feels slow, swap to a Vite build-time fetch that writes Sanity data to a JSON bundle the SPA reads synchronously. Loses live-edit-without-deploy for those pages. Don't do this preemptively.

### 9.3 Studio plugin niceties

`@sanity/dashboard`, custom desk structure, Vision plugin for GROQ playground. Add later if Ýr asks. Vision is one line and worth adding from the start — small enough to bundle in §3.

---

## 10 — Order of operations (the only sequence that doesn't shoot itself in the foot)

1. **You** do §2 A–C (dataset + token + CORS).
2. **I** do §3 (scaffold) + §4 (schemas) + §5 (migration script). All in one PR-sized push to local. No deploys yet.
3. **You** run the migration script locally (`pnpm migrate-sanity`). Token still local-only.
4. **You** open studio locally (`pnpm studio:dev`) and eyeball the migrated content. Edit-friendly check.
5. **You** do §7 steps 2–5 (Vercel project + DNS for `studio.another-creation.xyz`).
6. **I** do §6 (swap reads on `Blog.jsx` first, ship, then collections).
7. **I** write §8 handoff doc.

Anything that swaps reads (§6) only happens **after** Sanity has the data. Anything that touches DNS only happens **after** the studio bundle is on Vercel and verified. No leapfrogging.

---

## Notes / scratch

- Token rotation: the migration token (§2.B) can be deleted from sanity.io/manage the moment §5 is done and verified. We do not need it long-term.
- The Sanity Growth Trial is 30 days. After that, the project drops to Free tier (one seat, three users, 10k docs, 100k API requests/month). For Ýr-only editing, Free is fine indefinitely. Watch the trial expiry — set a calendar nudge.

**Sources consulted while writing this:**
- [Deploying Sanity Studio v3+](https://www.sanity.io/docs/studio/deployment) — custom domain requires self-host
- [Access Your Data (CORS)](https://www.sanity.io/docs/content-lake/cors) — manage dashboard origin setup
- [Importing Data](https://www.sanity.io/docs/content-lake/importing-data) — NDJSON vs scripted migration trade-offs
- [How to structure your code repository in a Sanity.io project](https://www.sanity.io/blog/how-to-structure-your-code-repository-in-a-sanity-io-project) — co-located /studio folder pattern
