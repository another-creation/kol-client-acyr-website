# Handoff — 2026-05-18 23:20

## Goal of the current arc

Metadata pipeline is now end-to-end: Pass 1 (static), Pass 2 (Sanity dynamic), Pass 3 (product) all live. The arc that bridges to next session is **8j — newsletter design rework**, which is the only functional newsletter work remaining and is no longer blocked by anything. Plus there's accumulated cross-machine / cross-repo infrastructure work that lives outside this CWD but affects daily flow (kol-system git, log-work to global).

## Last actions taken (causal trail, newest first)

- Reverted Vercel Ignored Build Step to Automatic on all three projects after the `${VERCEL_GIT_PREVIOUS_SHA:-HEAD^}` attempt silently canceled valid builds (website + studio f53e478). Eating build time > continued debugging. Backlog 7e flipped ✅ → ❌; backlog-notes.md#7e rewritten with the abandoned commands + diagnosis notes.
- Redeployed f53e478 manually on website (`21obgBNQe`) + studio (`9ke9nK7NU`) with Ignore Build Step unchecked → both Ready + Current. Styleguide correctly skipped (no relevant paths).
- Pushed metadata Pass 2 + 3 as f53e478: Sanity `seo` field groups on `article.js` + `collection.js`; new `api/_lib/sanity.mjs` (server-side fetchers); new `api/_lib/meta-resolver.mjs` (async dispatcher); proxy switched to `await resolveMeta`.
- Added backlog items 15 (Umami metrics), 16 (SEO provider open question), 17 (Journal vs `/blog` URL mismatch), 18 (Vercel CNAME deprecation).
- Added new global CLAUDE.md section "Docs in kol-system projects" — reinforces framework conformance for future markdown authoring.
- Drafted companion playbooks at `/docs/`: `smb-local-server-playbook.md` + `git-repo-docs-playbook.md`. Two alternative approaches for cross-machine docs sync.
- Authored `docs/client/kol-client-acyr/HANDOFF.md` — project quicklook (providers, ownership, Proton aliases, handoff playbook pointers). Closed backlog item 13.
- Added TikTok + X entries to `SOCIAL` array in `business-data.js`; mirrored into the two brand markdown docs.

## Current state / open decision points

- **8j newsletter design rework** is the natural next pick-up. Both surfaces (Newsletter.jsx home card + FooterNewsletter.jsx strip) preserve the pre-restoration design and are visually off-base per user. AC DS stable, pipeline stable, no blockers. Outstanding sub-decision: the home card's "save 10% on your first order" line has no backing discount mechanism — drop the claim or wire a real first-order coupon before the redesign.
- **Metadata production verification** still owed — share a `/blog/<slug>`, `/collections/<slug>`, `/shop/<slug>` URL into iMessage/X/Slack to confirm article-/product-specific OG images render. Pass 1 had a launch-blocker bug (filesystem routing eating the rewrite) that the dist/app.html rename fixed; Pass 2/3 inherits that fix but new code paths are unverified live.
- **Vercel Ignored Build Step root cause never diagnosed.** Attempt 2 silently canceled even valid builds. Build Logs on a Canceled deployment would show the exact stdout/stderr/exit. If anyone wants to revisit, that's the entry point — captured in backlog-notes.md#7e under "If revisited".
- **Footer.jsx hardcodes its SOCIAL list** — drift surface vs business-data.js. Same future-pass that should move socials into `info.js` (per AGENT-CONTEXT seam note).
- **kol-system not under git** — biggest cross-machine drift risk. Filed as #1 in kol-system/README.md future plans. Not blocking this repo but accumulates risk.
- **log-work skill location** — still per-repo via init-agent-context template. Move to global `~/.claude/skills/log-work/` is queued.

## Next intended action

**8j design rework.** Open `Newsletter.jsx` + `FooterNewsletter.jsx` side-by-side with the `/brand` page + `writing-guidelines.md`. Anchor against the footer typography system (Right Grotesk Narrow body + Mono label). Two design decisions in flight:

1. Home card: stays a card-on-cream or becomes a section block flush with the page?
2. Footer strip: keep current slim layout or restructure to match the footer column grid?

If the user instead pushes for cross-repo infra cleanup first, the high-leverage move is `git init` on `kol-system/` and `~/.claude/skills/` (separately), then push to private remotes, then pull on the second machine — instant drift elimination.

## Working memory not yet in AGENT-CONTEXT

- The `21obgBNQe` and `9ke9nK7NU` Vercel deployment IDs are labeled "Redeploy of <canceled-ID>" but they ARE the f53e478 builds — Vercel labels redeploys by the originating canceled-deploy ID, which is confusing on first read.
- The Sanity `seo` field group is collapsed by default (`collapsible: true, collapsed: true`) — editors won't see it as visual noise. They open it only when overriding.
- The `meta-resolver.mjs` swallows Sanity fetch errors with `.catch(() => null)` — falls through to the parent-route fallback. Silent fallback is intentional for production stability; if Sanity is down the site still serves valid metadata.
- shop-data products have `image` paths like `/brand/shop/pod/foo.png` — the resolver prefixes `SITE_URL` for absolute URL. Already absolute URLs (rare) are passed through. Printful product mockups are portrait, will render small on FB/LinkedIn — known and accepted (per the §5 gotcha in the metadata plan).
- After this session, `docs/_framework/` in this repo and `kol-system/packages/kol-docs/src/_framework/` are drift candidates. `/init-agent-context-sync` is meant to refresh but hasn't been exercised end-to-end. First sync run is the verification.
- The `/init-agent-context-sync` skill mentions reading `_template.version` from both source and target — newly-renamed `init-agent` template file's `_template.path` was bumped to v2; other templates' versions weren't bumped this session (their content didn't change). Will matter when sync is actually run.
