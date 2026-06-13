# Session: Styleguide unlisted — Cloudflare Access gate removed

**Date:** 2026-05-27
**Agent:** Grim (Claude Opus 4.7, 1M context)
**Summary:** Client wanted `brand.another-creation.xyz` (styleguide) publicly reachable but unlisted — no login. Deleted the Cloudflare Access app; hardened crawl-protection with a `robots.txt`.

## Changes Made

### Files Modified
- `apps/styleguide/public/robots.txt` — new file, `User-agent: * / Disallow: /`. Vercel serves it as a static file ahead of the SPA rewrite. The `noindex` meta in `apps/styleguide/index.html` (line 7) was already present.

### Infrastructure (user-driven, agency Cloudflare account)
- Deleted the **`brand`** Access application (destination `brand.another-creation.xyz`, self-hosted, "Client access" policy) under Zero Trust → Access → Applications. OTP gate gone with it. User confirmed done.

## Current State

### Working
- `brand.another-creation.xyz` serves straight from Vercel, no OTP. `noindex` meta + `robots.txt Disallow: /` keep it out of search.

### Known Issues
- `robots.txt Disallow: /` and the `noindex` meta technically conflict (a blocked crawler can't read the meta). Moot while the site has no inbound links; if it ever gets linked publicly, Google could surface a URL-only result.
- `robots.txt` ships on next styleguide Vercel deploy (`kol-client-acyr-styleguide`).

## Next Steps
1. None pending — self-contained.
