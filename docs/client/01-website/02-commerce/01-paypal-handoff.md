---
title: PayPal handoff — client ownership pattern
type: playbook
topic: payment
audience: agency-internal
status: active
providers:
  - paypal
  - printful
related:
  - "[[01-website/01-setup/02-playbook|setup-playbook]]"
  - "[[03-infrastructure/02-handoff|domain-handoff]]"
tags:
  - handoff-kit
  - client/handoff/payment
  - provider/paypal
  - provider/printful
  - pattern/multi-user-access
---

# PayPal handoff — client ownership pattern

Setup problem: an agency or freelancer builds a commerce integration that takes real money, then needs to hand it off to the client. Sharing PayPal account credentials is wrong (security, audit, money-movement risk). PayPal apps can't be transferred between accounts. The right pattern is **Multi-User Access** — client owns the account from day one, agency holds narrow developer permissions, access is revocable at handoff.

---

## Why "give me your PayPal login" is wrong

- A shared password is a compromised password. The agency holds full money-receiving access.
- No audit trail. PayPal's logs say "the merchant" — not who acted on the merchant's behalf.
- Dispute responses, fraud alerts, and account recovery all route through the client's email and phone. The agency seeing them is awkward at best.
- No clean off-ramp — at end of engagement, you can't really revoke a password you knew.

PayPal's actual answer is the same as AWS Organizations / GCP IAM / Stripe Restricted Keys: scoped, revocable, audited per-user access on top of a single owner.

---

## Pattern A — Client-owned from day one (recommended)

### Setup sequence at project kickoff

1. **Client creates PayPal Business** at paypal.com. Verify identity, link bank for receiving funds, set Preferences → Currency to match the project, enable "Accept all payments without converting" if selling across currencies.
2. **Client enables Multi-User Access:** Account Settings → Account Access → **Manage Users** → Add user. Invite the developer's email. Grant permissions:
   - ✅ **Manage Developer Apps**
   - ✅ Any related developer/integration permissions (refunds-via-API may be needed depending on the integration, but **start without it** and grant later if required)
   - ❌ Send Money, withdraw, change account settings — anything money-moving or admin
3. **Developer accepts the invite** via the link in their email. Logs into developer.paypal.com using their own PayPal email/password. PayPal shows a switcher: "You are managing {Client}'s account." The developer now operates inside the client's PayPal namespace.
4. **Developer creates the sandbox + live REST apps** under the client's account (developer.paypal.com → Apps & Credentials → Sandbox/Live pill → Create App). Suggested naming: `{{CLIENT_SLUG}}-website-sandbox`, `{{CLIENT_SLUG}}-website-live`. Client ID + secrets are owned by the client account from the moment of creation.
5. Developer plugs the credentials into Vercel env vars and proceeds with the build per `../setup/setup-playbook.md` / `../setup/setup-overview.md`.

### What the client sees

- Their Account Settings → Manage Users lists the developer + permission scope.
- They can revoke access at any time, one click.
- They can audit which apps the developer created.
- They never share a password.

### Project handoff

- Client revokes the developer's user access.
- All apps, credentials, and incoming payments continue uninterrupted — the client owned them all along.
- Developer no longer has any path into the client's PayPal.

---

## Migration path — if the integration was built under the agency's PayPal

Common situation: client wasn't ready at kickoff (verification pending, internal back-and-forth, etc) so the developer built under their own account to keep momentum. Migration is small.

1. Client completes Pattern A steps 1–3 (creates account, grants you Multi-User developer access).
2. As the delegated user, create new sandbox + live REST apps under the client's account. Same naming as before.
3. Add a billing method to the client's Printful account (Printful bills the seller for fulfillment; the card on file must be the client's).
4. Swap PayPal env vars in Vercel:
   - `PAYPAL_CLIENT_ID` / `PAYPAL_SECRET` / `VITE_PAYPAL_CLIENT_ID` — Production scope to client's **live** credentials, Preview scope to client's **sandbox** credentials.
   - `PAYPAL_ENV` stays the same (`live` in Production, `sandbox` in Preview).
5. Redeploy Production.
6. **Sandbox verification rerun** — preview deploy + sandbox personal account, three-side check (site / client's PayPal sandbox merchant view / Printful Drafts).
7. **Live verification rerun** — €1 product, real PayPal account different from the merchant, payment captures into the **client's** balance. Refund from the client's PayPal merchant dashboard. Restore product price.

Once both reruns pass, the integration is fully client-owned and the agency's PayPal can be untouched.

---

## Related — Printful handoff

Same problem, simpler answer. Printful doesn't have a Multi-User equivalent (as of this writing) — accounts are single-owner.

- Client creates their own Printful account and their own API store from day one.
- Client generates the Printful Private Token under their account.
- Token gets pasted into the developer's local `.env.local` and into Vercel as `PRINTFUL_TOKEN`.
- Client adds a billing method (their card) to their Printful account — required for any real order to fulfill.
- At handoff: **rotate the token** (Printful → Tokens → Revoke old, create new), client takes the new value, you replace it in Vercel. Old token becomes inert. Developer loses access.

The alternative (developer creates the Printful store, transfers later) is messy — Printful doesn't have a clean transfer flow. Client-owned-from-day-one is the simpler call.

---

## Related — Vercel handoff

The deploy surface also needs to end up under client ownership.

**Cleanest path:** Vercel project + GitHub repo live in the client's organization from day one. Developer is a Collaborator/Member with appropriate permissions, removed at handoff.

**If the project was bootstrapped under the agency:**

1. Transfer the GitHub repo to the client's org (GitHub Settings → Transfer ownership).
2. In Vercel, either (a) re-link the existing Vercel project to the new repo location, or (b) create a new Vercel project under the client's Vercel team and import the transferred repo.
3. Either way, env vars need to be re-added in the destination Vercel project (they don't follow the repo transfer).
4. Update the production domain DNS as applicable.

Either approach works. Path (b) is cleaner if the Vercel project also accumulated agency-specific settings (deployment protection rules, team-specific integrations, etc).

---

## Handoff verification checklist

Before signing off on a handoff:

- [ ] Client account owns the PayPal Business + sandbox app + live app
- [ ] Client account owns the Printful API store + token + billing method on file
- [ ] Vercel project is under the client's Vercel team
- [ ] GitHub repo is under the client's GitHub org
- [ ] Developer's PayPal Multi-User access revoked
- [ ] Developer's GitHub Collaborator access removed
- [ ] Old Printful token rotated (developer's copy no longer authenticates)
- [ ] Any other secrets/passwords the developer held are rotated
- [ ] One successful sandbox transaction has been verified on client-owned credentials
- [ ] One successful €1 live transaction has been completed + refunded, captured into the client's balance
- [ ] Documentation handed off (this repo's `docs/client/` folder)

---

## References

- PayPal Multi-User Access: paypal.com/businessmanage/users/setup (or Account Settings → Account Access → Manage Users in the dashboard)
- PayPal Developer Apps: developer.paypal.com → Apps & Credentials
- Printful API tokens: developer.printful.com → Tokens
- GitHub repo transfer: docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository
- Vercel team management: vercel.com/docs/accounts/team-members
