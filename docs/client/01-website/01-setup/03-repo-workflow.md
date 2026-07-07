---
title: Client repo — branching, Vercel, and daily workflow
type: playbook
topic: repo
audience: agency-internal
status: active
related:
  - "[[01-website/01-setup/02-playbook|setup-playbook]]"
  - "[[01-website/01-setup/01-overview|setup-overview]]"
  - "[[01-website/02-commerce/01-paypal-handoff|paypal-handoff]]"
tags:
  - handoff-kit
  - client/playbook/repo
  - tool/vercel
  - tool/github
---

# Client repo — branching, Vercel, and daily workflow

Day-one setup for the client-side project repo + a workflow that uses Vercel's preview deploys as your sandbox surface. Pair with `../setup/setup-playbook.md` (the full setup runbook), `../setup/setup-overview.md` (the scoping summary), and `../paypal/paypal-handoff.md` (PayPal/Printful/Vercel ownership patterns for agency-to-client handoff).

---

## Branching model

- `main` is the **production branch**. Vercel deploys it to the live URL with **live PayPal**.
- Anything not in `main` lives on feature branches: `feature/checkout-rewrite`, `fix/cart-thumbnails`, `chore/sync-printful`. Push them; Vercel auto-creates a preview URL per branch with **sandbox PayPal**.
- No `develop` or `staging` branch. Vercel's preview deploys *are* your staging surface.

---

## Vercel one-time setup

In the Vercel project for the client repo:

- **Settings → Git → Production Branch:** confirm `main`.
- **Settings → Environment Variables:** add the five env vars (`PAYPAL_ENV`, `PAYPAL_CLIENT_ID`, `PAYPAL_SECRET`, `VITE_PAYPAL_CLIENT_ID`, `PRINTFUL_TOKEN`) with **values that differ by scope**:

```
                       Production  →  live values
                       Preview     →  sandbox values
```

Two ways to set this up depending on Vercel's UI version:
- **Newer UI:** click the env var, set separate values per environment in one entry.
- **Older UI:** add each name twice — once with Production scope (live value), once with Preview scope (sandbox value). Vercel routes by scope automatically.

`PRINTFUL_TOKEN` is the same value across both — same token whether sandbox or live.

---

## Daily workflow — risky changes (commerce, layout, anything customer-facing)

```
1. git checkout -b feature/<short-name>
2. <make changes locally>
3. git push -u origin feature/<short-name>
4. Vercel auto-builds → preview URL appears in the GitHub commit comment
   and on the Vercel dashboard
5. Open preview URL — uses Preview env vars (sandbox PayPal, no real money)
6. Test the change end-to-end on the preview URL. Sandbox transaction if it
   touches checkout.
7. Merge feature → main (PR if you want review, direct merge if solo)
8. Vercel auto-builds main → production deploys with live env vars
```

---

## Daily workflow — trivial changes (typos, copy tweaks, dependency bumps)

You can push directly to `main` and skip the preview cycle. Vercel still deploys, you just don't get a pre-merge sanity check. Use judgement.

Rule of thumb: if there's any chance the change could break the buy flow, branch + preview first. The cost is 60 seconds of git workflow vs. potentially shipping a broken checkout to live PayPal.

---

## Initial commerce build on the client repo

**Do not build the PayPal+Printful integration directly on `main`.** Sequence:

1. `git checkout -b feature/commerce` (or whatever name).
2. Build the integration on that branch — sync script, serverless functions, Smart Buttons, env vars in Vercel set as above.
3. The branch's preview URL runs with sandbox creds. Test there end-to-end (`../setup/setup-playbook.md` §8).
4. While you're building, the production `main` URL stays at whatever the prior state was (brochure, "coming soon", or empty).
5. Once sandbox is verified, merge `feature/commerce` → `main`. Production picks up live creds in one merge.

That sequencing means the live PayPal capture pipeline goes live the moment you intentionally merge — not gradually as you commit.

---

## Things to know about Vercel previews

- Each branch gets a stable preview URL (deterministic per branch name) + per-commit URLs.
- Preview deploys persist as long as the branch exists. Delete the branch and the preview goes away.
- A "production" deploy only happens when `main` advances. Pushing to a feature branch never affects production.
- Preview URLs are publicly accessible by default (anyone with the link can hit them). If that matters for unannounced product changes, password-protect them in Project Settings → Deployment Protection.

---

## Handoff — account ownership

The Vercel project + GitHub repo + PayPal apps + Printful store all need to end up under client ownership before signoff. See `../paypal/paypal-handoff.md` for the full ownership-and-revocation pattern (Pattern A: client-owned from day one with Multi-User Access for the developer).

## Verification checklist when handing off to the client repo

- [ ] Vercel project linked to the client GitHub repo
- [ ] Production Branch set to `main`
- [ ] Five env vars set with diverging Production/Preview values (live vs sandbox)
- [ ] `.gitignore` includes `.env*`, `!.env.example`, `.vercel/`
- [ ] First push went to a feature branch, not main
- [ ] Sandbox transaction verified on the branch's preview URL before any merge to main
- [ ] Live €1 test passes on main after merge, refund processed, product price restored
