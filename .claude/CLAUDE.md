# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Storefront SPA for **Another Creation** (Acyr) — an Icelandic atelier brand. Sells Printful print-on-demand products via a self-owned cart + PayPal checkout, plus hand-made bespoke pieces (enquiry-only). Built on a private design-system tier (the "AC DS"). Deployed on Vercel as a static SPA backed by serverless functions. No SSR, no database. JavaScript only — **no TypeScript** in the website (`.jsx`/`.js`), by deliberate choice.

## Startup protocol (read first)

This project keeps load-bearing context outside the code. When the user says "read `LLM_RULES.md`" (or before any substantive work), read in order:
1. `.kol/llm-context/ARCHITECTURE.md` — load-bearing decisions and constraints (the "do not revisit" list)
2. `.kol/llm-context/AGENT-CONTEXT.md` — current project state, contracts, gotchas
3. The newest file in `.kol/llm-context/session-log/` (sort by date)
4. `.kol/llm-context/session-bridge/` — read the newest `handoff-*.md` only if its timestamp is newer than the newest session log

`docs/operations/01-history.md` holds decision history (alternatives considered/rejected); `docs/operations/02-backlog.md` holds deferred work. Use the `/log-work` skill to write a session log when finishing significant work. Note: `.kol/`, `docs/`, `LLM_RULES.md`, and `.claude/` are gitignored — local-only context, not shipped.

## Commands

```bash
pnpm dev                 # website dev server (Vite) — most common
pnpm dev:studio          # Sanity Studio dev
pnpm dev:styleguide      # DS styleguide dev
pnpm dev-server          # all three in parallel
pnpm build               # build website (then renames dist/index.html → dist/app.html — see metadata proxy)
pnpm lint                # eslint the website
pnpm sync-printful       # regenerate apps/website/src/data/printful-products.json (needs .env.local)
pnpm publish-media       # web-optimize + upload curated product images (Media ledger → R2), regenerate product-media.json (needs .env.local + rclone/magick)
pnpm migrate-sanity      # one-off migration of blog/collections into Sanity
./scripts/test-meta.sh <route> [target]   # crawler simulation — checks meta tags from the metadata proxy
```

Per-app variants exist (`build:website`, `studio:build`, etc.). Package manager is **pnpm** (workspaces); do not use npm/yarn. There is **no test framework** — verification is via lint, `test-meta.sh`, and manual/Playwright recon (`tools/playwright/`). Secrets live in `.env.local` at the repo root (shared by Vite via `envDir: '../../'` and the Node scripts).

## Monorepo topology

pnpm workspaces — `apps/*` and `packages/*`:

- `apps/website` — the storefront (React 19 + Vite 8 + Tailwind 4 + react-router-dom 7). Vercel Root Directory is this folder, so functions resolve as `/api/*`.
- `apps/studio` — Sanity Studio (CMS for blog/journal articles, authors, collections, lookbook). Separate toolchain (`sanity` CLI, TypeScript-friendly, Prettier).
- `apps/styleguide` — DS reference/demo app, consumes the same DS cascade.
- `packages/ds` (`@ac/ds`) — **CSS-only** design system. No React components; just the token/utility/component/framework stylesheets. Consumed via `workspace:*`.
- `packages/brand-data` (`@ac/brand-data`) — brand identity: name, business data, images, logos. `BRAND.name` in `config.js` is the single source of truth for the brand display name — resolve every user-facing brand reference through it, never hardcode "Another Creation".

`ac-*` / `@ac/*` = the design-system tier, **not** the brand. The brand is "Another Creation"; repo codename `acyr` = AC × Ýr (the designer).

## Architecture essentials

**CSS cascade is load-bearing.** `apps/website/src/index.css` is three imports: `tailwindcss` → `@ac/ds/index.css` → `./styles/site.css`. Inside `@ac/ds/index.css` the order is tokens → brand tokens → utilities → components → framework, and **reordering silently breaks theming** (cascade order decides ties; brand tokens must follow DS-neutral tokens). Brand vars become Tailwind utilities only via the `@theme {}` block in `packages/ds/tokens/brand-color.css` — prefer `bg-brand-primary`/`text-emphasis` over arbitrary `bg-[var(--…)]`. Tailwind-first: don't add a CSS variable when a utility already expresses it. See ARCHITECTURE.md §4 before touching DS CSS.

**SPA + serverless, no backend/DB.** `BrowserRouter` client routing (routes in `apps/website/src/App.jsx`). Serverless functions in `apps/website/api/` handle anything needing secrets/server trust. Order state lives in PayPal + Printful, queried on demand — never stored locally.

**The metadata proxy (SEO trick).** `vercel.json` rewrites *every* path to `api/metadata-proxy.mjs`. The build renames `index.html` → `app.html` so it isn't served directly; the proxy reads `app.html`, injects per-route OG/meta tags (`__TITLE__` etc.) resolved by `api/_lib/meta-resolver.mjs` (Sanity → shop-data → static map in `src/data/seo-metadata.js`), and serves the result. This is why `build` renames the file — don't "fix" it.

**Commerce.** Catalog source of truth is `apps/website/src/data/shop-data.js`, fed by Printful-synced `printful-products.json` (committed like a lockfile) plus hand-authored handmade entries. The `kind` discriminator drives everything: `'pod'` → `/shop`, cart + PayPal checkout; `'handmade'` → `/handmade`, mailto enquiry only, no cart. All prices EUR. Cart is `src/components/site/CartContext.jsx` (localStorage `kol.ac.cart.v1`); checkout flow is `Cart`/`Checkout`/`OrderConfirmation` pages with PayPal Smart Buttons. **Stripe is blocked** (Iceland merchant) — PayPal Orders API v2 only; the server recomputes totals and never trusts the client's posted price.

**CMS.** Sanity provides journal articles, authors, collections, looks (schemas in `apps/studio/schemaTypes/`). Client in `src/lib/sanity.js` (`urlFor` for images), GROQ queries in `src/lib/queries.js`. Read-only published perspective from the website.

**Animation.** GSAP via a single import surface: `import { gsap, ScrollTrigger, ... } from '../lib/gsap'`. `src/lib/gsap.js` registers all plugins (ScrollTrigger, Flip, SplitText, etc.) once. `prefersReducedMotion()` short-circuits the reveal hooks (`useReveal`, `useSplitReveal`) to snap to final state. GSAP skills are available in `.claude/skills/` — use them for non-trivial animation work.

## Conventions

- Make only requested changes; delete unused code outright (no backwards-compat shims); prefer editing existing files; follow established patterns.
- Filenames: protocol/docs files UPPERCASE (`ARCHITECTURE.md`), content files kebab-case.
- Website React components are layered atoms/molecules/organisms/primitives + `framework` (page scaffold) + `site` (storefront-specific). DS-equivalent *styling* lives in `@ac/ds`; the React components live in the website.
- Commit only when explicitly asked. Never force-push or run destructive git commands without permission.

## Non-goals (do not reopen without explicit ask — see ARCHITECTURE.md §7)

TypeScript in the website · Stripe · Snipcart/Shopify/any hosted-checkout middleware · a long-running backend or database · customer accounts / saved addresses / order-history UI · runtime validation libraries (zod et al.) · wrapping/proxying the legacy Squarespace site.
