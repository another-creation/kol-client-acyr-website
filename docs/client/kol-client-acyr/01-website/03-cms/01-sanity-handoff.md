---
title: Sanity handoff — client ownership pattern
type: playbook
topic: cms
audience: agency-internal
status: active
providers:
  - sanity
  - vercel
related:
  - "[[01-website/03-cms/02-sanity-log|sanity-log]]"
  - "[[01-website/02-commerce/01-paypal-handoff|paypal-handoff]]"
  - "[[03-infrastructure/02-handoff|domain-handoff]]"
  - "[[01-website/01-setup/02-playbook|setup-playbook]]"
tags:
  - handoff-kit
  - client/handoff/cms
  - provider/sanity
  - provider/vercel
  - pattern/org-project-transfer
---

# Sanity handoff — client ownership pattern

Setup problem: an agency/freelancer stands up Sanity for a client (project + dataset + schemas + Studio deploy), then needs to transfer ownership at end of engagement. Sharing the Sanity login is wrong (same arguments as `../paypal/paypal-handoff.md`). Sanity's clean off-ramp is **project transfer**: the project moves from the agency's org into the client's org as a single administrative action, schemas and content stay intact, the agency's access ends.

This doc covers two patterns:
- **Pattern A — Client-owned org from day one (recommended for greenfield engagements).**
- **Pattern B — Agency-owned org during build, transfer at handoff (what this project did).**

Both end at the same place; Pattern A skips the transfer step.

---

## Why "give me your Sanity login" is wrong

- Shared login = shared write access to the dataset, the API tokens, billing, member roles. Same audit / fraud / recovery problems as a shared PayPal password.
- Sanity ships first-class multi-member project access — every member has their own login, role-scoped permissions, individual audit log.
- At end of engagement, revoking an individual member is one click. Revoking a shared password isn't.

---

## Pattern A — Client-owned org from day one (recommended)

### Setup sequence at project kickoff

1. **Client signs up for Sanity** at sanity.io with their own email. This creates a personal org by default; rename it to the client's brand (Sanity → Organization settings → Edit org name).
2. **Client creates the project** inside that org. Project ID + dataset name (default `production`) are recorded for the developer to wire into the codebase.
3. **Client invites the developer** as an org member: sanity.io/manage → Organization → Members → Invite by email. Role: **Developer** (write content, read schemas, deploy Studio) or **Administrator** (also manage members, tokens, billing). For active build phase, Administrator is friction-free; downgrade to Developer or remove at handoff.
4. **Developer accepts** the invite in their own Sanity account.
5. Developer proceeds with the build (schemas, content migration, Studio deploy) inside the client's org. Tokens generated for migration scripts live in `.env.local`, named meaningfully (e.g. `migration-script`).

### What the client sees

- Their `sanity.io/manage` shows the org + project they own. The developer is a listed member with a known role.
- They can revoke access at any time, one click.
- They never share a password.
- All API tokens are auditable in the project's API tab.

### Project handoff

1. Developer revokes any active API tokens they generated (`sanity.io/manage → project → API → Tokens → trash icon`).
2. Client removes the developer from org membership.
3. If the developer's email was used for any Sanity-Studio-side member invites or as a "deployed by" signature, that history stays — it's auditable, not transferable.

---

## Pattern B — Agency-owned org during build, transfer at handoff

This is what **this project (another-creation)** did. Used when the client doesn't have a Sanity org at kickoff, or when the developer wants a single workspace across multiple builds.

### Setup sequence at project kickoff

1. **Developer signs up for Sanity** (in this project: signed up via GitHub as `dev@another-creation.xyz` — an email under the client's domain that the developer controls during the build).
2. Developer creates a new org for the engagement (or uses an existing agency org).
3. Developer creates the project inside that org — captures Project ID, org ID, dataset name. Builds against it.
4. All build-time artifacts (schemas, content, studio Vercel project) are wired to this project ID. The dataset is the source of truth for content.

### Project handoff

The transfer happens in three layers, executed in order:

#### Layer 1 — Sanity project transfer

1. **Client creates a Sanity org** under their own login (sanity.io → sign up → org auto-created → rename to client brand).
2. **Developer initiates project transfer:** sanity.io/manage → project → Settings → Transfer project → choose the destination org. Requires the destination org's ID (client provides).
3. **Client confirms** the incoming transfer in their org's notifications/settings.
4. Project moves wholesale: schemas, all documents in all datasets, all assets, all API tokens, the studios list, all CORS origins. Project ID does NOT change — frontends keep working without re-wiring.
5. Member list does **not** auto-update. Developer remains a project member until step 3 below.

#### Layer 2 — Studio Vercel project transfer

The self-hosted Studio (this project: `kol-client-acyr-studio`) is a Vercel project, transferred the same way as the main site's Vercel project. See the Vercel section of `../paypal/paypal-handoff.md` for the agency-to-client Vercel transfer pattern. Sanity-specific notes:

- The Studio bundle is just a static React app. Sanity auth happens client-side against `api.sanity.io`. No env vars to migrate.
- Custom domain (`studio.{{CLIENT_DOMAIN}}`) follows once the Vercel project is in the client's account — same DNS pattern as the main site, no Sanity involvement.

#### Layer 3 — Developer access cleanup

1. **Revoke API tokens** the developer generated during the build. In this project: `migration-script` (Editor scope). Trash icon in `sanity.io/manage → project → API → Tokens`. Should already be revoked after migration verification — confirm.
2. **Client removes the developer** from project / org membership.
3. **Re-issue any fresh tokens** the client wants for their own future migration / scripting work.

---

## Verification checklist (end of handoff)

- [ ] `sanity.io/manage` under the client's account shows the project at the expected ID. Org ID has changed; project ID is unchanged.
- [ ] All datasets present and content count matches pre-transfer snapshot.
- [ ] Both registered Studios are still listed (in this project: `kol-client-acyr-studio.vercel.app` + `studio.{{CLIENT_DOMAIN}}`).
- [ ] CORS origins still include the production domains + Studio domains. Localhost origins can be removed at handoff or kept for the client's own dev work.
- [ ] No API tokens belong to the agency. All listed tokens are either revoked or owned by the client.
- [ ] The Studio at `studio.{{CLIENT_DOMAIN}}` still loads, the client can sign in (their Sanity login), the schemas show up, content is editable.
- [ ] Test edit: client makes a tiny content change in Studio → publishes → frontend at `{{CLIENT_DOMAIN}}/blog` (or wherever) reflects it. Closes the loop.
- [ ] Agency confirms it can no longer access `sanity.io/manage` for this project under its own login.

---

## Project-specific values (this engagement)

| Field | Value |
|---|---|
| Sanity project name | `another-creation` |
| Sanity project ID | `ajbrqqhq` |
| Org ID (agency org at build time) | `o1RP6YtZv` |
| Dataset | `production` |
| Plan at time of build | Growth Trial (30 days, then Free tier sufficient for one-editor production use) |
| Active API tokens at handoff time | TBD — revoke `migration-script` before handoff |
| Vercel project (Studio) | `kol-client-acyr-studio` |
| Studio public URL | `https://studio.another-creation.xyz` (custom domain) + `https://kol-client-acyr-studio.vercel.app` (fallback, both registered) |
| Main site URLs (Sanity CORS origins) | `https://another-creation.xyz`, `https://www.another-creation.xyz` |

---

## Related

- `sanity-playbook.md` — what was built, in detail
- `../paypal/paypal-handoff.md` — payment ownership pattern (Vercel transfer pattern reused for Studio)
- `../domain/domain-email-handoff.md` — domain + email transfer (precedes Studio handoff because Studio uses the custom domain)
- `../setup/setup-playbook.md` — full stack setup runbook (does not yet include Sanity — flagged for extension)
