# Handoff — 2026-05-16 03:05

## Goal of the current arc

Complete the custom-domain rollout for `another-creation.xyz`. Infrastructure (DNS, Vercel, email) is live; code-side cleanup of hard-coded `kol-client-acyr-website.vercel.app` references is the remaining open item before the rebrand is fully through.

## Last actions taken (causal trail, newest first)

- Fixed `/log-work` skill order in both local + template scaffold (`~/.claude/skills/init-repo/templates/.claude/skills/log-work/SKILL.md`) so it asks about handoff BEFORE writing the session log, not after.
- Added `handoff-kit` flat umbrella tag to all six `.md` files in `docs/client/` alongside the nested `client/...`, `provider/...`, `pattern/...` tag trees.
- Argued and confirmed `provider` over `services` as the frontmatter property naming for vendor identity. Reverted a brief mistaken switch to `services`.
- Added rich Obsidian Properties frontmatter (title, type, topic/topics, audience, status, related as `[[wikilinks]]`, plus doc-specific props) to all six docs in `docs/client/`. First pass had only bare `tags:` block — user called out the miss, second pass delivered Properties-style metadata.
- Moved `proton-records-bind.md` + `proton-records.txt` into a `docs/client/records-bind/` subfolder. Updated cross-refs in `proton-custom-domain.md` and `domain-email-handoff.md`.
- Created `docs/client/proton-custom-domain.md` (setup recap) + `docs/client/domain-email-handoff.md` (handoff playbook covering Cloudflare account-internal move + Proton credential swap).
- Updated `docs/backlog.md` item #1 with a–d done, e + f open. Marked the live state in the item header.
- Proton catch-all set to `hello@another-creation.xyz`. All status pills green (VERIFIED, 1 ADDRESS, MX, SPF, DKIM, DMARC, CATCH-ALL).
- Imported Proton MX/SPF/DKIM/DMARC records to Cloudflare via BIND zone file (`docs/client/records-bind/proton-records.txt`). Manually flipped DKIM CNAMEs from Proxied → DNS only (Cloudflare's BIND import bug).
- Set up Proton Mail Plus monthly, custom domain `another-creation.xyz`, created `hello@` address (display name "Another Creation"), default.
- Wired Vercel: apex `another-creation.xyz` as Production, `www` as 307 redirect to apex. Cloudflare DNS: A `@` → `216.198.79.1`, CNAME `www` → `cname.vercel-dns.com`, both proxy OFF.
- Registered `another-creation.xyz` at Cloudflare Registrar (under agency account).

## Current state / open decision points

- **Live URLs:** site at `https://another-creation.xyz` + `www` redirect; email at `hello@another-creation.xyz` (default + catch-all).
- **Code still on old preview URL.** Hard-coded `kol-client-acyr-website.vercel.app` strings probably exist in: canonical URLs, sitemap, OG/meta tags, possibly PayPal app return URLs / approved domains. Not swept yet — that's the next action.
- **PayPal app return URLs:** unverified whether the live PayPal REST app has `kol-client-acyr-website.vercel.app` registered as a return URL/approved domain. If yes, switching to `another-creation.xyz` may need a PayPal-side update too.
- **DMARC policy** sits at `p=quarantine` per Proton's recommendation. Tighten to `p=reject` after a clean send history accumulates (weeks).
- **Vercel "DNS Change Recommended"** on the `www` redirect row — cosmetic, site functions. Could investigate later if it bothers anyone.
- **Backlog item 1f** (client handoff) gates on the client having a Cloudflare account ready to receive the domain via internal move. Not actionable yet.

## Next intended action

Backlog item 1e — code sweep for `kol-client-acyr-website.vercel.app`:

1. `grep -rni "kol-client-acyr-website" src/ public/ index.html vercel.json` to find every reference.
2. Replace with `another-creation.xyz` (or `https://another-creation.xyz` for full URLs).
3. Check PayPal developer dashboard → live app → approved return URLs. Add `https://another-creation.xyz` if needed.
4. Redeploy. Smoke-test that the live SPA still resolves, that any sitemap/OG meta now reflects the new domain.

## Working memory not yet in AGENT-CONTEXT

- The `.xyz` registry's NS propagation was the cause of *every* initial "Invalid Configuration" / verify failure today, both at Vercel and Proton. If this pattern repeats for any future fresh `.xyz` registration, don't burn time debugging records — just wait for `dig NS another-creation.xyz +short` to return the Cloudflare nameservers.
- Cloudflare's BIND import bug (auto-proxying CNAMEs regardless of the "Proxy imported DNS records" checkbox) is documented but worth re-flagging if any future BIND-style import happens on another zone.
- User strongly prefers Grim-style direct pushback over deferential acknowledgment. Saved as feedback memory (`feedback_push_back_directly.md`). Keep the dial cranked — they explicitly asked for "more like this."
- Skill files now live in two places: the local repo `.claude/skills/log-work/SKILL.md` AND the template at `~/.claude/skills/init-repo/templates/.claude/skills/log-work/SKILL.md`. When fixing a skill behavior, sync both. (Pattern continues from prior session's session-bridge-protocol propagation.)
- Three memory files added this session: `feedback_obsidian_frontmatter.md`, `feedback_answer_the_asked_question.md`, `feedback_push_back_directly.md`. MEMORY.md index updated.
