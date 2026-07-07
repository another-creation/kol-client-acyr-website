---
title: Sanity CMS — project setup recap and running log
type: playbook
topic: cms
audience: agency-internal
status: active
domain: another-creation.xyz
providers:
  - sanity
  - vercel
project:
  id: ajbrqqhq
  name: another-creation
  org_id: o1RP6YtZv
  dataset: production
related:
  - "[[01-website/03-cms/01-sanity-handoff|sanity-handoff]]"
  - "[[01-website/01-setup/02-playbook|setup-playbook]]"
  - "[[01-website/01-setup/01-overview|setup-overview]]"
tags:
  - handoff-kit
  - client/setup/cms
  - provider/sanity
  - provider/vercel
---

# Sanity playbook — running record

Companion to `../../archive/sanity-implementation.md` (the original plan, archived after execution). This is the **log of what we actually did and why** as we did it. Append, don't rewrite. Dated entries; newest at top.

This file lives under `/docs/` which is gitignored — local working notes only, not pushed to GitHub.

---

## 2026-05-16 — Project setup

### Sanity project (already existed before this session)
- Name: `another-creation`
- Project ID: `ajbrqqhq`
- Org ID: `o1RP6YtZv`
- Plan: Growth Trial (30 days from creation). Free tier limits afterwards: 1M API CDN req/mo, 250k API req/mo, 100 GB bandwidth, 10k docs, 20 user seats. Plenty for one-editor production use.

### Dataset
- `production`, public visibility. Created by Ýr account 2026-05-16 (~58 minutes before this session). 0 B / 10 GB used at session start.
- **Choice:** single dataset, no staging. Adding a `staging` dataset later costs nothing on Free, but unnecessary now — the Studio's draft system gives us editor-side staging via `drafts.*` document IDs.

### API token
- Name `migration-script`, scope **Editor**, created 2026-05-16 ~05:30.
- **Why Editor and not Deploy Studio:** the migration script needs to create documents and upload assets. Read-only would block writes. Deploy Studio scope is unrelated (it's for `sanity deploy` CI). Editor is the minimum for what we need.
- Stored in `.env.local` as `SANITY_WRITE_TOKEN`. Gitignored (catch-all `.env.*` rule in `.gitignore`).
- **Rotation policy:** delete from sanity.io/manage immediately after migration is verified. Future migrations / scripts generate fresh tokens. Long-lived tokens lying around in shells = liability.

### CORS origins (sanity.io/manage → API → CORS Origins)
Five origins added, all with credentials allowed:
- `https://another-creation.xyz` — production site
- `https://www.another-creation.xyz` — production site, www redirect
- `https://studio.another-creation.xyz` — self-hosted Studio (Vercel, set up later this session)
- `http://localhost:5173` — Vite dev server (frontend)
- `http://localhost:3333` — Sanity Studio dev server

**Why all five up-front:** lets local dev, production, and the studio all read from the same dataset without per-environment surgery. Adding origins is free and reversible.

**Why "Allow credentials" = YES for all:** required for any origin that hosts the Studio (auth cookies need to flow). Harmless on read-only origins.

### Environment variables (`.env.local`)
```
VITE_SANITY_PROJECT_ID=ajbrqqhq
VITE_SANITY_DATASET=production
SANITY_PROJECT_ID=ajbrqqhq          # for the migration script (no VITE_ prefix)
SANITY_DATASET=production           # for the migration script
SANITY_WRITE_TOKEN=...              # Editor scope, migration script only
```

- **`VITE_*` vars are public** — Vite inlines them into the client bundle. Project ID and dataset name are not secrets; anyone hitting the site can read them in DevTools. This is by design and matches the public-read security model.
- **Non-`VITE_` vars are server-only** — used by the migration script (Node, not the bundle).
- **`SANITY_WRITE_TOKEN` is the secret.** Never goes into Vercel env vars unless we deploy a server-side function that needs it. The frontend doesn't and never will.

### Studio hosting choice — self-hosted on Vercel

**Decision:** the Studio will be built with `sanity build` and deployed to Vercel as a second project in this repo (Root Directory = `studio`), reachable at `studio.another-creation.xyz`.

**Why not `sanity deploy` (Sanity-hosted `*.sanity.studio`)?**
1. Custom domain support: Sanity-hosted Studios only get `<name>.sanity.studio` URLs. Custom domains require self-hosting (confirmed in Sanity docs).
2. Same infrastructure as the main site (Vercel + Cloudflare DNS) — one operational model, not two.
3. The user has had auth / deploy issues with Sanity-hosted Studios in past projects; self-hosting removes that variable entirely. The Studio bundle still authenticates against Sanity's auth service regardless of where it's served from.

**Trade-off accepted:** Self-hosted Studios don't appear in Sanity's Dashboard view by default. There's an opt-in `sanity deploy --external` registration to surface them in the Dashboard, but that's a "see all my projects at a glance" feature, not a content-editing requirement. Skipping for now; revisit if/when Ýr wants the Dashboard.

The "Studios" tab in sanity.io/manage will stay showing "No deployed studios" forever — that's expected, not a bug.

### Repo layout — `/studio` subfolder, not a real monorepo

`studio/` is a sibling of `src/` and `api/` inside this repo. It has its **own** `package.json` (its own deps, its own scripts). No pnpm workspaces, no Turborepo, no `packages/`. Two independent npm projects that share a git repo.

Vercel side: two projects pointing at the same git repo, distinguished by **Root Directory**:
- `kol-client-acyr-website` (existing) — Root Directory `.`
- `acyr-studio` (new, later this session) — Root Directory `studio`

**Why not workspaces?** Two projects don't justify the tooling overhead. The schema files don't need to be shared between studio and frontend at runtime — the frontend reads typed data via GROQ at runtime, not via shared TS types (the project is JS-only anyway, per ARCHITECTURE §7).

### Init command — Sanity's official scaffolder

Instead of hand-writing the studio boilerplate, ran Sanity's CLI scaffold:
```
npm create sanity@latest -- --project ajbrqqhq --dataset production --output-path studio --template clean
```

**Why CLI over hand-roll:** guaranteed to match current Sanity defaults. The CLI's `clean` template is the minimal framework-agnostic starting point (no Next.js coupling).

Choices made in the CLI prompts:
- TypeScript: **No** (project is JS-only per ARCHITECTURE §7)
- Package manager: **pnpm** (matches the rest of the repo)

### MCP server — Claude Code enabled

The Sanity CLI offered to configure an MCP server for either Claude Code or VS Code. Enabled **Claude Code** only.

**Why:** lets the assistant (this CLI) query the project, read schemas, run GROQ, and verify content state without the user copy-pasting screenshots. Reduces friction during the rest of this build. VS Code skipped because we don't use it on this project.

The MCP config is written to the Claude Code config automatically by the Sanity CLI. No further setup needed.

---

## 2026-05-16 — Init outcome + scaffolded files

CLI completed with exit 1 but the scaffold actually landed cleanly. Exit 1 came from `ERR_PNPM_IGNORED_BUILDS` — pnpm v9+ refuses to run third-party `postinstall` scripts (here: esbuild) without explicit approval. **The dependencies installed successfully** (1100 packages added); only esbuild's postinstall (which drops the platform binary) was skipped.

### Files generated

```
studio/
├── .gitignore                  (studio-local gitignore)
├── README.md                   (generic Sanity README)
├── eslint.config.mjs           (uses @sanity/eslint-config-studio)
├── node_modules/               (1100 packages)
├── package.json                (deps: sanity, @sanity/vision, react, react-dom, styled-components)
├── pnpm-lock.yaml
├── pnpm-workspace.yaml         (now configured with onlyBuiltDependencies: [esbuild])
├── sanity.cli.js               (project ajbrqqhq + dataset production + autoUpdates: true)
├── sanity.config.js            (structureTool, visionTool plugins; schemaTypes wired)
├── schemaTypes/index.js        (was empty []; now wires author/article/collection/look)
└── static/                     (Sanity-served static assets)
```

### Notes on the scaffold

- **TypeScript leaked into devDeps** (`@types/react`, `typescript`, `@sanity/eslint-config-studio`, `eslint`, `prettier`) even though we said "No to TypeScript" in the CLI prompt. That's a Sanity-template quirk: they keep the TS toolchain installed because the `sanity` package itself ships types and the ESLint config references them. The source files we author are all `.js`. Harmless.
- **`autoUpdates: true`** in `sanity.cli.js` — Studio auto-pulls patch/minor updates of `sanity` at runtime. For self-hosted-on-Vercel this means Ýr gets bug fixes without us redeploying. Good default; leaving it on.
- **`main: "package.json"`** in `package.json` is weird (usually `main` points at a JS entry), but it's what Sanity's scaffolder ships. Harmless — nothing imports the studio as a package.
- **`pnpm-workspace.yaml` inside `studio/`** isn't an actual workspace declaration — it's a `pnpm`-v10 location for the build-approval config. Now set to `onlyBuiltDependencies: [esbuild]` so esbuild's postinstall runs on next install.

### Fix for the esbuild block

User to run: `cd studio && pnpm install` — pnpm sees the changed workspace config and runs esbuild's postinstall. Or `pnpm rebuild esbuild` directly. Either works.

---

## 2026-05-16 — Schemas authored

Four schemas added under `studio/schemaTypes/`:

- **`author.js`** — name, slug (from name), role, bio, avatar image, avatar initial (monogram fallback), links array (`{label, href}`).
- **`article.js`** — title, slug, excerpt, author ref → author doc, publishedAt, readingMinutes, tag, cover image, **body as Portable Text**. Block schema supports normal/h2/h3/blockquote styles, bullet/numbered lists, em/strong decorators, and two annotations: `link` (URL) and `cite` (citation source for blockquotes).
- **`collection.js`** — title, slug, number, subtitle, year (string, free-form), excerpt, publishedAt, cover image, **`heroImage` + `heroVideo` + `heroVideoPoster`** (renderer picks video over image when both are set; poster hidden in Studio when no video), `show` object (venue/event/date/music/film/lighting, collapsible), collaborators array, **notes as Portable Text** (same block schema as article body), `looks` array, press array.
- **`look.js`** (object, not document — embedded in `collection.looks`) — number, name, image, family, fabric.

### Decisions baked in

**Portable Text over custom block format.** The repo's existing `body` shape (`{type: 'p', text}`, `{type: 'h2', text}`, `{type: 'quote', text, cite}`, `{type: 'ul', items}`) maps directly to Sanity's standard Portable Text. Portable Text gives a far better editor UX in Studio (the whole point of using Sanity), and `@portabletext/react` is the standard renderer. The page JSX has to change to render PT instead of the custom blocks — that's part of the §6 frontend swap.

**`heroImage` + `heroVideo` as two separate fields, not a discriminated union.** Sanity doesn't ship a clean "either image or video" type. Two optional fields + a renderer that picks one is simpler than a custom object with a `type` discriminator. `heroVideoPoster` is conditionally hidden in Studio (`hidden: ({document}) => !document?.heroVideo`) so editors only see it when relevant.

**`year` is a free-form string, not a number or date.** The data has values like "2026", "2018", "2015" — sometimes a calendar year, sometimes a fashion season range. Keeping it as a string preserves that flexibility and matches the existing data.

**`look` is an `object` type, not a `document` type.** Looks only exist inside a collection; they're never queried standalone. Embedding keeps the GROQ simple (`*[_type == "collection"] {..., looks[]{...}}` instead of joins).

**Slugs are derived from `title` / `name` with the `slug` input type.** Editors get an auto-generate button + manual override. Validation is `required` so the page-level URL (`/blog/:slug`, `/collections/:slug`) never resolves to nothing.

---

## 2026-05-16 — esbuild approval, pnpm v11 quirk

pnpm v11.0.8 (locally installed via Homebrew) is **strict** about ignored build scripts — `ERR_PNPM_IGNORED_BUILDS` is a hard failure on `pnpm install`, not a warning. Sanity's scaffolder dropped a `pnpm-workspace.yaml` template inside `studio/` with:

```yaml
allowBuilds:
  esbuild: set this to true or false
```

That placeholder string is invalid; pnpm refused to run esbuild's postinstall. We tried `pnpm.onlyBuiltDependencies` in `studio/package.json` and `onlyBuiltDependencies` at the YAML top level — neither helped on v11. The fix is the `allowBuilds.<pkg>: true` form pnpm v11 actually wants:

```yaml
allowBuilds:
  esbuild: true
onlyBuiltDependencies:
  - esbuild
```

(Both forms left in place — `allowBuilds` is what v11 reads; `onlyBuiltDependencies` is older syntax kept as a fallback if pnpm gets downgraded. Also added `"pnpm": {"onlyBuiltDependencies": ["esbuild"]}` to `studio/package.json` as a third belt.)

After the YAML change, `pnpm install` ran the esbuild postinstalls cleanly for both `esbuild@0.27.7` and `esbuild@0.28.0` (Vite ships 0.27.x, Sanity ships 0.28.x). No more error on install.

**Takeaway for future scaffolds:** newer pnpm versions ship more aggressive build-script policies than scaffold templates expect. When a `pnpm install` says `ERR_PNPM_IGNORED_BUILDS`, the safe fix is to write `allowBuilds.<pkg>: true` in `pnpm-workspace.yaml` rather than chase older syntaxes.

---

## 2026-05-16 — Sanity client + queries + migration script

Three deps added to the main app's `package.json`:
- `@sanity/client` 7.22.0 — runtime GROQ client
- `@sanity/image-url` 2.1.1 — image URL builder (resizing, cropping, format hints)
- `@portabletext/react` 6.2.0 — Portable Text renderer for `article.body` and `collection.notes`

Three files written:

### `src/lib/sanity.js`
Single `@sanity/client` instance + `urlFor` helper. Uses `VITE_SANITY_PROJECT_ID` / `VITE_SANITY_DATASET`, pinned API version `2024-10-01`, `useCdn: true` (CDN cache for reads), `perspective: 'published'` (drafts excluded from public site). No token — public-read.

### `src/lib/queries.js`
GROQ queries + helpers mirroring the existing `blog-data.js` / `collections-data.js` API one-for-one:

| Old (data-file) | New (queries.js) | GROQ |
|---|---|---|
| `sortedArticles()` | `sortedArticles()` → Promise | `*[_type == "article"] | order(publishedAt desc) {…}` |
| `findArticle(slug)` | `findArticle(slug)` → Promise | `*[_type == "article" && slug.current == $slug][0]` |
| `articlesByAuthor(slug)` | `articlesByAuthor(slug)` → Promise | `*[_type == "article" && author->slug.current == $slug]` |
| `findAuthor(slug)` | `findAuthor(slug)` → Promise | `*[_type == "author" && slug.current == $slug][0]` |
| `sortedCollections()` | `sortedCollections()` → Promise | `*[_type == "collection"] | order(publishedAt desc) {…}` |
| `findCollection(slug)` | `findCollection(slug)` → Promise | `*[_type == "collection" && slug.current == $slug][0]` |
| `adjacentCollections(slug)` | `adjacentCollections(slug)` → Promise | uses sorted query, computes prev/next client-side |
| `formatDate(iso)` | `formatDate(iso)` | (same — pure function) |
| `formatShowDate(iso)` | `formatShowDate(iso)` | (same — pure function) |

Same names, same arg shapes — only difference is they're async now. Page swap (§6 in the plan) will need `useEffect` / `useState` to consume them. Could go to a React Query / SWR setup later if we want caching; for four articles and seven collections, the built-in `useCdn: true` is plenty.

Two projections used:
- `ARTICLE_CARD_PROJECTION` — for list/index views, excludes `body`
- `ARTICLE_FULL_PROJECTION` — for detail views, includes `body` + extended author info

Same split for collections (`COLLECTION_CARD_PROJECTION` vs `COLLECTION_FULL_PROJECTION`).

### `scripts/migrate-to-sanity.mjs`
One-shot migration. Reads `AUTHORS`, `ARTICLES`, `COLLECTIONS` from the existing data files, uploads images and videos as Sanity assets, posts documents with deterministic IDs.

**Idempotency design:**
- Deterministic doc IDs: `author-<slug>`, `article-<slug>`, `collection-<slug>`. Reruns overwrite (not duplicate).
- `client.createOrReplace()` for every doc.
- In-memory asset dedup keyed by SHA-1 of file content — same image referenced twice gets uploaded once. (Note: Sanity's own asset-storage already content-addresses uploads, so this is belt-and-suspenders to avoid network calls.)

**Block format → Portable Text mapping:**
- `{type: 'p', text}` → `{_type: 'block', style: 'normal', children: [span(text)]}`
- `{type: 'h2'|'h3', text}` → `{_type: 'block', style: 'h2'|'h3', children: [span(text)]}`
- `{type: 'quote', text, cite?}` → `{_type: 'block', style: 'blockquote', children: [span(text, marks)], markDefs: [...]}` — `cite` (when present) becomes a markDef referencing the span
- `{type: 'ul'|'ol', items}` → N blocks, one per item, with `listItem: 'bullet'|'number'` and `level: 1`

**Hero image vs video:** `c.hero.type === 'image'` uploads to `heroImage`; `c.hero.type === 'video'` uploads to `heroVideo` (as a file asset) plus optional `heroVideoPoster`.

**Missing files don't abort** — script logs a warning and skips that asset. Catalog images on disk are uneven (only one of seven collections has a real video; some looks may be missing on disk) and we don't want a single 404 to kill the whole run.

### Root `package.json` scripts added

```
"studio:dev":      "pnpm --filter ./studio dev"
"studio:build":    "pnpm --filter ./studio build"
"migrate-sanity":  "node --env-file=.env.local scripts/migrate-to-sanity.mjs"
```

`pnpm --filter ./studio <script>` works even without a workspace declaration at the root — pnpm lets you target a relative-path package directly. So we can run `pnpm studio:dev` from repo root and pnpm will execute `dev` inside `studio/`.

---

## 2026-05-16 — Migration run

`pnpm migrate-sanity` ran clean. Output:

```
Migrating to ajbrqqhq/production ...
Authors (2): yr-thrastardottir, studio-atelier
Articles (4): ss26-glacial-light, fw25-in-review, popup-skolavordustigur, made-to-order
Collections (7): creation-7 (26 looks), creation-6 (26 looks), creation-5 (12 looks),
                  creation-4 (15 looks), creation-3 (16 looks), creation-2 (15 looks),
                  creation-1 (8 looks)
Done. assets uploaded: 123
```

**Asset math:** 4 article covers + 118 look images (26+26+12+15+16+15+8) + 1 hero video = **123 uniques**. SHA-1 dedup caught the cases where collection `cover` was the same file as `looks[0].image` (saved 7 redundant uploads) and where `creation-1.heroVideoPoster` was the same file as its cover.

Studio at localhost:3333 now shows all docs.

---

## 2026-05-16 — Five-page swap to Sanity reads

All five pages now read from Sanity via the helpers in `src/lib/queries.js`. The old data files (`src/brand/data/blog-data.js`, `src/brand/data/collections-data.js`) are still on disk but no longer imported anywhere in the page tree.

### Files touched

| File | Change |
|---|---|
| `src/components/site/BlogBody.jsx` | Rewritten to render Portable Text via `@portabletext/react`. Block-style overrides for normal/h2/h3/blockquote. Blockquote pulls `cite` annotation from `markDefs` and renders `<cite>` after the `<p>` (same shape as old custom renderer). |
| `src/pages/site/Blog.jsx` | `useState` + `useEffect` around `sortedArticles()`. Static hero stays instant; list waits for fetch. Cover images use `urlFor(article.cover).width(560).height(420).url()`. Author name comes from embedded `article.author` projection — no second fetch needed. |
| `src/pages/site/BlogArticle.jsx` | Three-state machine (`loading` / `not-found` / `ok`). Loading shows a `min-h-[60vh]` empty `<main>` so layout doesn't pop. Cover uses `urlFor(...).width(1600).height(800).url()`. Author bio comes from the embedded `article.author` projection (full version including `bio` + `links`). |
| `src/pages/site/BlogAuthor.jsx` | Same three-state pattern. Loads author + articles in parallel via `Promise.all`. Articles list uses card-sized images via `urlFor(...).width(480).height(360).url()`. |
| `src/pages/site/Collections.jsx` | List view. Static hero stays instant. Cards use `urlFor(collection.cover).width(900).height(1200).url()`. |
| `src/pages/site/CollectionDetail.jsx` | Three-state pattern. Loads collection + adjacent in parallel. **`CollectionHero` refactored** to take `heroImage` / `heroVideo` / `heroVideoPoster` / `cover` separately and pick the right element — video if present, else hero image, else fall back to cover. Look images use `urlFor(look.image).width(800).height(1066).url()`. |

### What got dropped on purpose

- **`VideoEmbed` component** (the YouTube-embed thumbnail player) — removed from `CollectionDetail.jsx`. The data's `videos: []` array was empty on all seven collections, and the schema doesn't currently include a `videos` field. If/when collections need multi-video embeds, schema gets a `videos` array, the component comes back. Both are easy to re-add.
- **Subtitle on prev/next collection link** — the adjacent-collection GROQ projection only fetches `slug`/`title`/`year`. Cleaner; if you want the subtitle back, one field added to the projection.

### Loading state policy

- **List pages** (`Blog`, `Collections`): hero section + page chrome render immediately. The list area is `null` until the fetch resolves. Visible "pop" is the list appearing under the hero.
- **Detail pages** (`BlogArticle`, `BlogAuthor`, `CollectionDetail`): nothing renders until fetched, just a `min-h-[60vh]` empty main to reserve scroll height. Avoids a "back link briefly visible then full page swoops in" flash.

### Image sizing

All Sanity images go through `urlFor(image).width(...).height(...).url()`. Specific widths chosen to match the rendered aspect ratios at typical desktop / tablet display sizes. The Sanity image CDN handles the resize + format negotiation; AVIF/WebP served when the browser supports it.

### Embedded projections vs separate fetches

GROQ projections in `queries.js` resolve author refs inline (`"author": author->{...}`) — every place that used to call `findAuthor(article.authorSlug)` after `findArticle()` now just reads `article.author`. Fewer round trips, less code at the call site.

---

## 2026-05-16 — Studio deployed + custom domain live

Studio is now live at `studio.another-creation.xyz` (custom domain) and `kol-client-acyr-studio.vercel.app` (fallback). Both URLs registered with the Sanity project. End-to-end edit pipeline verified.

### Vercel project for Studio
- Name: `kol-client-acyr-studio` (matches the `kol-client-acyr-website` convention).
- Source: this repo. **Root Directory = `studio`** (set manually; Vercel won't infer it).
- Framework Preset: **Sanity** (Vercel autodetected after Root Directory was set). Build/Output/Install commands left at preset defaults (`sanity build` / `dist` / `pnpm install`).
- `studio/vercel.json` added with SPA rewrite (`{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`) so deep Studio routes (e.g. `/structure/article`) don't 404 on Vercel. Belt-and-suspenders alongside the Sanity preset.

### DNS — `studio.another-creation.xyz`
- Type: **CNAME**
- Name: `studio`
- Target: `cname.vercel-dns.com` (the old/stable record — Vercel suggested a new IP-range record too; using old, flagged to switch later)
- Proxy status: **DNS only (grey cloud)** — matches the apex + `www` records
- Vercel issued TLS within ~30s of DNS resolving.

### Sanity Studio registration (modern requirement)
Sanity Studio v3 requires URLs to be "registered" with the project before they can read content from the dataset. Hit "Register this studio" the first time the deployed Studio loaded — registered the vercel.app URL first. Once the custom domain was live, registered `https://studio.another-creation.xyz` as a **second** studio host via `sanity.io/manage → project → Studios → Add studio`. Both URLs work; either can be used to edit content.

The "Studios" tab in sanity.io/manage now lists both URLs under **Hosting: Other** (Sanity's marker for self-hosted). Schema manifest synced on the vercel.app URL (greentick); studio.another-creation.xyz registration is identical bundle so editing works there too, manifest sync per-URL is informational only.

### Vercel env vars on the main site (kol-client-acyr-website)
Added `VITE_SANITY_PROJECT_ID=ajbrqqhq` and `VITE_SANITY_DATASET=production` to **all environments** (Production + Preview + Development) on the existing main site project. Redeployed. `another-creation.xyz/blog` and `/collections` now read from Sanity in production.

### Edit-test loop verified
Tiny edit in Studio (excerpt comma change) → Publish → refreshed `another-creation.xyz/blog` → updated text visible. Pipeline closed end-to-end.

### Author avatar — post-deploy fix
Initial migration didn't render uploaded avatar images on the live site — `Avatar.jsx` only knew how to render the `initial` monogram. Extended `Avatar` to accept a `src` prop and prefer the image when one's set, fall back to initial otherwise. Updated three call sites (`BlogArticle.jsx` byline + bio aside, `BlogAuthor.jsx` header) to pass `urlFor(author.avatar).width(...).height(...).url()` at size-appropriate dimensions.

---

## 2026-05-16 — Docs restructure (this folder + the rest of `docs/client/`)

Cleaned up `docs/client/` to a fully-foldered, consistent structure. Before: mix of top-level files and the `sanity/` subfolder. After: every topic is a folder, each holding a handoff doc + a recap/playbook.

### Final structure
```
docs/
├── archive/                                  (NEW)
│   └── sanity-implementation.md              (moved — historical plan)
├── llm-context/
├── backlog.md
├── history.md
└── client/
    ├── paypal/
    │   ├── paypal-handoff.md
    │   └── paypal-printful-integration.md    (moved from docs/ root)
    ├── domain/
    │   ├── domain-email-handoff.md
    │   └── proton-custom-domain.md
    ├── sanity/
    │   ├── sanity-handoff.md                 (NEW — this session)
    │   └── sanity-playbook.md                (this file)
    ├── repo/
    │   └── client-repo.md
    ├── setup/                                (renamed from replication/)
    │   ├── setup-playbook.md                 (was replication-playbook.md)
    │   └── setup-overview.md                 (was replication-playbook-overview.md)
    └── records/                              (renamed from scripts-records/)
        ├── proton-records.txt
        ├── proton-records-bind.md
        └── scripts-records.sieve
```

### Rule applied
`docs/client/` holds everything tagged `handoff-kit` in its frontmatter. Each topic gets a folder. Filenames keep their topic prefix so they remain self-describing out of context.

### Renames
- `replication/` → `setup/` (the folder's role is "setup runbooks"; `replication` was provider-vague). `replication-playbook.md` → `setup-playbook.md` and `replication-playbook-overview.md` → `setup-overview.md` to match the folder.
- `scripts-records/` → `records/` (these are DNS records, not scripts).

### Cross-references updated
All wikilinks (`[[replication-playbook]]` → `[[01-website/01-setup/02-playbook|setup-playbook]]`, `[[records-bind/proton-records]]` → `[[03-infrastructure/_files/proton-records.txt|proton-records]]`) and prose path references updated across `paypal-handoff.md`, `domain-email-handoff.md`, `proton-custom-domain.md`, `client-repo.md`, `setup-playbook.md`, `setup-overview.md`, `sanity-playbook.md`, `AGENT-CONTEXT.md`, `backlog.md`, `history.md`. Session logs and the archive folder left untouched (historical).

### Flagged for later
- `paypal-printful-integration.md`, `sanity-playbook.md`, `sanity-implementation.md` (archived) lack the typed frontmatter blocks the other handoff-kit docs carry. Add frontmatter as a separate cleanup pass.
- `setup-playbook.md` covers the commerce stack (PayPal+Printful+Vercel) but doesn't yet include Sanity. Either extend with a Sanity section or add a sibling Sanity setup playbook — decision deferred.

---

## Next entries (to be appended as we do them)

- Future Sanity work (multi-image gallery, color variants, etc.) lives in `../../backlog.md` — append here only when actively building.
