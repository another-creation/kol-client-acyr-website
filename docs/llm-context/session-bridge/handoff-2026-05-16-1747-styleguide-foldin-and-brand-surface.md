# Handoff — 2026-05-16 17:47

## Goal of the current arc

Stand up the brand surface in three layers: (1) private styleguide portal at `brand.another-creation.xyz` behind a wall, (2) minimal public `/brand` + `/press` pages on the live site, (3) brand voice + reference docs that ground future copywriting in worked examples. Then sweep small site issues that surfaced during the styleguide work.

## Last actions taken (causal trail, newest first)

- Rewrote `docs/backlog.md`: restored finished sub-items with ✅ (going-forward convention noted), sorted loose notes (L34–46) into items, added new items 7–10 (styleguide fold-in, newsletter, gallery, social).
- Split `writing-guidelines.md` into paired files: rules in `writing-guidelines.md` (v4.0.0), prose in `writing-examples.md` (v1.0.0). Archived superseded `writing-guidelines-agent.md`.
- Mirrored brand JS data into readable markdown: `docs/client/kol-client-acyr/02-brand/{contact-and-identity, career-and-press, branded-assets}.md`. JS stays canonical.
- Fixed Sanity image-url deprecation in `src/lib/sanity.js` (named `createImageUrlBuilder`).
- Made styleguide `Live site` link env-aware (localhost:5173 in dev, prod URL in prod); pinned styleguide to port 5174.
- Added `styleguide/public/favicon.svg` symlink (was 404).
- Updated `src/brand/data/info.js` with new address, phone (kebab-cased), email, `region: Gullbringa` field, fixed `established: 2013` typo.
- Added 5 press citations + LinkedIn to `business-data.js`; removed resolved Address open question.
- Built `/brand` + `/press` pages (Privacy.jsx pattern, `max-w-3xl`), wired into `App.jsx` + Footer (fixed About broken link, added Contact, LinkedIn, renamed LEGAL → More with Brand + Press at top).
- **Phase C** — deployed styleguide to `brand.another-creation.xyz`. Vercel project + Cloudflare CNAME (proxy ON) + Cloudflare Access self-hosted app + OTP login. Verified end-to-end. Install Command override: `cd .. && pnpm install`.
- **Phase B** — folded styleguide into CWD as `styleguide/` sibling project. ~660 files copied, `@brand`/`@components` Vite aliases, 305 MB asset symlink, `photoIndexPlugin` extended for video + Gallery.jsx updated, `scripts/verify-versions.mjs` CI guard. Added missing atoms/molecules/primitives/organisms to CWD's shared kit.
- **Phase A** — pre-merge hygiene: dropped `wawoff2`, collapsed `src/index.css` to imports-only (correct `@theme` already in `kol-brand-color.css`), moved `:root scrollbar-gutter` to `kol-site.css`. Did NOT re-adopt kol-client-ac's `Layout.jsx` (its `/site/*` regex is dead in CWD's single-surface deployment).

## Current state / open decision points

- All three Vercel projects live and verified: site (`another-creation.xyz`), studio (`studio.another-creation.xyz`), styleguide (`brand.another-creation.xyz` gated).
- Writing voice grounded in 10 worked examples. The bio is real; the rest are fictional but plausibly named/dated (Yr × Hedi Slimane Spring 2027 collaboration is the running fiction).
- **Not yet committed/pushed.** User handles git. Vercel will redeploy on push.
- Backlog reflects current state with completed items visible. Three new tracks added (item 7 styleguide fold-in mostly ✅, item 8 newsletter, item 9 gallery enhancements).
- **Deferred / open questions:**
  - Backlog 7d/7e: verify styleguide Vercel project has zero PayPal/Printful/Sanity env vars; configure Vercel "Ignored Build Step" on site + styleguide projects.
  - Backlog 5h: FOUC dev-console warning — not from any code in CWD `src/` (grepped). Source likely third-party (embla-carousel, Sanity client at boot, or Chrome paint cycle warning). Defer.
  - Backlog 7f: SlideDeck → editor `fgOn` cross-tier import works but is a refactor candidate (extract to shared color-utils).
  - `hello@another-creation.xyz` may be a better default than `yr@` for non-personal contact in Footer — decide before client handoff.
  - TikTok presence (backlog 10) — needs client decision.

## Next intended action

Two paths, user's pick:

- **Commit + push** — trigger Vercel redeploys so the brand/press pages + styleguide live URL changes ship. Then drive Phase C follow-ups (backlog 7d/7e — env-var isolation + Ignored Build Step in Vercel UI).
- **Continue polish sweep** — bundle backlog 5a–n into one focused session (logo in navbar, cart thumbs 1:1, shipping footnote, button variant, font card href, hero standardisation, dark-mode contrast, selection styling, home text alignment, icon audit, cart minus-to-delete, table copy syntax).

If user is ready to handoff to client, Phase C follow-ups + small wins should land first.

## Working memory not yet in AGENT-CONTEXT

- The styleguide `Live site` localhost link assumes site grabs 5173 — guaranteed by styleguide's `vite.config.js` `server.port: 5174` + `strictPort: false`. Site's vite.config has no port override; if site is also pinned (currently not), drop the styleguide pin or rethink.
- Cloudflare Access uses **One-time PIN** identity provider out of the box on new Zero Trust accounts. No identity provider needed to be wired explicitly — verified at first login.
- Vercel `kol-client-acyr-styleguide` project Install Command had to be overridden to `cd .. && pnpm install` because the styleguide imports CWD's `src/components/primitives/ExitPreview` which itself imports `react-router-dom` — Node resolution walks UP from ExitPreview, needs `node_modules` at the repo root, not just inside `styleguide/`.
- pnpm at the styleguide level installed slightly newer patch versions of shared deps (React 19.2.6 vs root 19.2.5, Tailwind 4.3.0 vs 4.2.4, Vite 8.0.13 vs 8.0.10) because of `^` ranges and separate lockfiles. `verify-versions.mjs` compares package.json strings (matching ✓), not resolved versions. Functionally fine — three Vercel projects, three independent runtimes, no shared React tree.
- `framework/Layout.jsx` in CWD is the site-only minimal version (Outlet + ScrollToTop). Styleguide has its OWN copy at `styleguide/src/components/framework/Layout.jsx` which still carries the dead `/site/*` route-gate logic from kol-client-ac — harmless because the regex never matches in styleguide context. Backlog 7f.
- `docs/client/kol-client-acyr/02-brand/styleguide-text-rewrite.md` is a one-off voice exercise; its prose is folded into `writing-examples.md`. Keep both — rewrite shows the styleguide chapters at full length, examples shows discrete pieces.
- `writing-guidelines.md` version is now 4.0.0 because of the rewrite history (started as proposal, restructured several times during the session).
