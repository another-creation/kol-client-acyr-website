# Session: Newsletter wired to MailerLite — API endpoint + footer strip + home card

**Date:** 2026-05-17
**Agent:** Grim (Claude Opus 4.7, 1M context)
**Summary:** Stood up the newsletter signup pipeline end-to-end. MailerLite picked as provider; API endpoint built; existing home-card placeholder wired up; new footer strip added. Domain verification configured in MailerLite with SPF merged in Cloudflare to keep Proton + MailerLite coexisting in one record. Double opt-in toggled on (account-level, not API-level, after I caught my own hard-coded `status: 'active'` bug). Confirmation flow proved end-to-end via test send; landed in Gmail Junk as expected for a new `.xyz` sender. Design of both surfaces flagged as off-base; queued for rework.

## Changes Made

### Files added
- `api/newsletter/subscribe.mjs` — POST endpoint. Validates email, calls MailerLite Connect API (`POST /api/subscribers`) with `groups: [GROUP_ID]`. Status field omitted so MailerLite's account-level double opt-in toggle controls the confirmation flow. Treats 422 as 400 (client error), other failures as 502.
- `src/components/site/FooterNewsletter.jsx` — new slim subscribe strip. Idle / sending / success / error states. Form-element + status line, locks input + button while sending / after success.

### Files modified
- `src/components/site/Newsletter.jsx` — placeholder home card wired to `/api/newsletter/subscribe`. Same four-state machine. Visual design preserved as-is (including the "save 10% on your first order" copy, which has no backing discount and stays for now).
- `src/components/site/Footer.jsx` — imports + mounts `<FooterNewsletter />` above the link grid.
- `src/styles/kol-site.css` — adds `.kol-site-footer-newsletter*` rule set (grid, input, button, status line, mobile stack).
- `.env.local` — three-line block added for `MAILERLITE_TOKEN` + `MAILERLITE_GROUP_ID`. Token name `acyr-website` (matches PayPal naming).
- `docs/backlog.md` — Item 8 expanded: a/b ✅, new sub-items 8d (custom tracking domain), 8g (sender swap), 8h (client handover), 8i (`.xyz` deliverability watch), 8j (design rework).
- `docs/backlog-notes.md` — added 8b (what shipped), 8d (custom tracking domain rationale), 8i (TLD swap options), 8j (design-rework criteria).

### Infrastructure
- **MailerLite account** created on the free tier (1k subscribers / 12k sends / month / EU servers / GDPR).
- **Group `Newsletter`** (ID `187676036627957365`).
- **API token `acyr-website`** generated, full access scope, stored in `.env.local` + Vercel.
- **Vercel env vars** `MAILERLITE_TOKEN` + `MAILERLITE_GROUP_ID` set in Production + Preview scopes.
- **Subscribe settings:** Double opt-in for API and integrations toggled ON.
- **MailerLite domain verification:** `another-creation.xyz` connected. CNAME (DKIM) ✅, domain-verification TXT ✅, SPF ✅.
- **SPF merge in Cloudflare:** Edited existing TXT record on `@` from `v=spf1 include:_spf.protonmail.ch ~all` → `v=spf1 include:_spf.mlsend.com include:_spf.protonmail.ch ~all`. One SPF record, two senders. Did NOT delete-and-recreate (which is what MailerLite's "Authorize and Delete conflicts" button would have done — that would have broken Proton outbound).

## Current State

### Working
- API endpoint accepts POST + validates email format + handles missing config + handles MailerLite 4xx/5xx + returns `{ ok: true }` on success.
- Both forms (home card + footer strip) submit to the endpoint with proper four-state UX.
- End-to-end test send produced a confirmation email at `thordur.grimsson@gmail.com`. Subscriber landed in MailerLite `Newsletter` group with `unconfirmed` status (correct — pending confirmation click).

### Known Issues
- **First-send Junk landing** — Gmail filed the confirmation email under Junk. Expected for a new sender on `.xyz` even with full DKIM/SPF/DMARC. Reputation builds with sending history.
- **uBlock Origin blocks `mlsend.com`** — the confirmation link routes through MailerLite's click-tracking domain (`*.clicks.mlsend.com`), which is on Peter Lowe's blocklist. Real subscribers using uBlock / Brave / Pi-hole hit a block page on the confirm link. Fix: custom tracking domain (`clicks.another-creation.xyz`) — backlog 8d.
- **Sender still set to `dev@another-creation.xyz`** — the Subscribe settings sender edit form is gated on MailerLite finishing domain re-check. Pending. Backlog 8g.
- **Design of both surfaces off-base** per user. Home card preserves dated card-on-white pattern with a "save 10%" claim that has no backing mechanism; footer strip layout works but typography + button styling don't sit with the rest of the footer. Backlog 8j.

## Next Steps
1. **Wait for MailerLite domain auto-recheck.** Should be minutes-to-hours. Once green, swap sender `dev@` → `hello@` (8g) and add custom tracking domain `clicks.another-creation.xyz` (8d) in one pass.
2. **Design rework (8j).** Redesign home card + footer strip against brand voice + footer typography system. Decide whether home card stays a card or becomes a section block, and what to do with the "save 10%" claim (drop it, or wire a real discount via MailerLite automation + checkout code field).
3. **Connect client list (8h).** Separate workstream over the next days — either a new MailerLite project for the client, or a user-management transfer of this account.
4. **30-day `.xyz` deliverability watch (8i).** Track Gmail/Outlook inbox placement. If it stays bad after a month of consistent sending, revisit TLD swap (`.com` cut-over from Squarespace, or buy `.io`, or email-only domain split).
