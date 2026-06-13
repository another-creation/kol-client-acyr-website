# Handoff — 2026-05-17 02:55

## Goal of the current arc

Newsletter subscribe pipeline (backlog item 8). MailerLite picked, API + forms shipped, domain verification + double opt-in set up. The first-pass implementation is functionally working but visually off-base; sender swap + custom tracking domain are gated on MailerLite finishing automated domain re-check.

## Last actions taken (causal trail, newest first)

- Updated `docs/backlog.md` item 8 (a/b ✅, new sub-items g/h/i/j) and `docs/backlog-notes.md` with anchored notes for 8b/8d/8i/8j.
- User reported the design of both newsletter surfaces is "way off base" — captured as 8j with redesign criteria.
- User clarified: this MailerLite account is the dev/test instance; the client's actual list will be connected in the next days (8h). Also flagged `.xyz` deliverability concern; possible future TLD swap (8i).
- Confirmation email landed in Gmail Junk (expected for new `.xyz` sender). uBlock Origin blocked the confirm link because it routes via `*.clicks.mlsend.com` (Peter Lowe blocklist). User clicked Proceed to confirm; flow worked end-to-end.
- Sender edit in MailerLite Subscribe settings is gated on domain verification finishing. Pending.
- SPF merged in Cloudflare: hand-edited the existing TXT on `@` from `v=spf1 include:_spf.protonmail.ch ~all` to `v=spf1 include:_spf.mlsend.com include:_spf.protonmail.ch ~all`. Did NOT use MailerLite's "Authorize and Delete conflicts" button — that would have wiped Proton's SPF and broken outbound email.
- MailerLite domain `another-creation.xyz` connected: CNAME (DKIM) ✅, domain-verification TXT ✅, SPF ✅ after the manual merge.
- Patched `api/newsletter/subscribe.mjs` to drop hard-coded `status: 'active'` from the body. Account-level "Double opt-in for API and integrations" toggle (turned ON) now actually controls confirmation flow.
- Wrote `api/newsletter/subscribe.mjs`, `src/components/site/FooterNewsletter.jsx`, updated `src/components/site/Newsletter.jsx` + `Footer.jsx` + `src/styles/kol-site.css`. Added `MAILERLITE_TOKEN` + `MAILERLITE_GROUP_ID` to `.env.local` and Vercel Production + Preview.
- Created MailerLite account (free tier), group `Newsletter` (ID `187676036627957365`), API token `acyr-website`.

## Current state / open decision points

- **Functionally complete:** form → API → MailerLite → confirmation email → MailerLite subscriber active. Proven end-to-end.
- **Gated on MailerLite domain re-check (auto):** sender swap `dev@` → `hello@` (8g), and custom tracking domain `clicks.another-creation.xyz` (8d). Both unblock once domain shows fully verified in MailerLite.
- **Open / user-flagged:**
  - Design rework (8j) — both surfaces off-base; redesign criteria captured.
  - `.xyz` deliverability watch (8i) — first send hit Junk; expected new-domain behavior; revisit TLD swap after 30 days.
  - Client list handover (8h) — separate workstream, next days.
  - 10% claim on home card — user said "fine as is" for now since this isn't the live client instance yet.

## Next intended action

- **First task:** Wait for MailerLite domain auto-recheck. Once green:
  1. Subscribe settings → Sender → Edit → change to `hello@another-creation.xyz`. MailerLite sends sender-verification email to `hello@`; confirm it.
  2. Domains → Custom tracking domain → add `clicks.another-creation.xyz`. CNAME record will need to be added in Cloudflare DNS (gray cloud, unproxied). This fixes the uBlock blocklist hit on confirm links.
- **If user goes to design first:** redesign the home card + footer strip (8j) against brand voice docs (`docs/client/kol-client-acyr/02-brand/04-writing-guidelines.md`) and the existing footer typography system (`.kol-site-footer-*` in `src/styles/kol-site.css` — Right Grotesk Narrow / Mono, 11–12px label, 0.08–0.14em letter-spacing, uppercase).

## Working memory not yet in AGENT-CONTEXT

- **MailerLite Connect API base:** `https://connect.mailerlite.com/api/subscribers`. Bearer token auth. Body shape: `{ email, groups: [id], status? }`. Omit `status` to defer to account toggle. 422 = validation error; 200 = success/idempotent update. Endpoint is the new "Connect" API, not the legacy v2 — make sure future code references the right base URL.
- **MailerLite group `Newsletter` ID:** `187676036627957365`. Lives in env var `MAILERLITE_GROUP_ID`. Token label `acyr-website`. Token value lives only in `.env.local` + Vercel project env vars (Production + Preview).
- **SPF merge pattern is load-bearing for future ESP / verification work.** Any future sender (Brevo, Postmark, etc.) added to this domain must append to the existing SPF, not overwrite. The MailerLite "Authorize and Delete conflicts" UI deletes the existing record blindly — never click it on a domain that has a working email setup.
- **uBlock / privacy blocklist trap.** Default MailerLite click-tracking domain `*.clicks.mlsend.com` is on Peter Lowe's blocklist. Custom tracking domain (`clicks.another-creation.xyz` CNAME → MailerLite tracking endpoint) fixes this for ALL future campaigns, not just confirmation emails. High-leverage one-time setup.
- **The `Send a confirmation email` setting and the API `status` field interact.** With `status: 'active'` in API body, MailerLite treats the subscriber as already-confirmed regardless of the account toggle. To make the toggle authoritative, omit `status` (current code does). To force double opt-in regardless of toggle, send `status: 'unconfirmed'`. We picked "omit" so the toggle controls.
- **First test subscriber state:** `thordur.grimsson@gmail.com` confirmed via the test send; the Junk-folder + uBlock-blocked-link path. `dev@another-creation.xyz` was auto-added as the MailerLite account holder, not via the form.
- **Branch state:** committed + pushed + Vercel preview built + user tested end-to-end ("we already did that"). 8b is verifiable as functionally complete.
- **User context:** "the design is fucked, its way off base" — strong rejection of the visuals on both home card and footer strip. Treat 8j as a meaningful redesign, not a quick polish pass. Brand voice docs (`docs/client/kol-client-acyr/02-brand/04-writing-guidelines.md`, `writing-examples.md`) and the existing footer typography system are the reference points.
