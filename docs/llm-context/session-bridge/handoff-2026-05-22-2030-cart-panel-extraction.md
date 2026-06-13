# Handoff — 2026-05-22 20:30

## Goal of the current arc

Close the cart-aside unification thread (backlog 1h) properly: shared shell, not just shared rows. Drift between drawer + checkout aside must require an explicit prop override to reintroduce itself, not happen passively through per-file edits. Secondary goal: close backlog category 4 (Page chrome & copy) — `<PageHero>` already covered the hero standardisation, role layer already covered Home text-style inconsistencies, and the last star-trek-ipsum hits in Home.jsx needed clearing.

## Last actions taken (causal trail, newest first)

- Wrote `feedback_extract_at_the_right_layer.md` memory after the user flagged the same drift three times in the session — captures the rule "extract the wrapper, not just the leaves, when two surfaces share data + look + behavior."
- Updated `docs/backlog.md` + `docs/backlog-notes.md` + audit docs to reflect cart unification closure and the four newly-closed items in section 4.
- Cleared the two remaining star-trek-ipsum hits in `Home.jsx` (page title `the federation bridge platform` → just `BRAND.name`; Testimonial kicker `Stardate 2026` → `2026`).
- Extracted `<CartPanel>` at `apps/website/src/components/site/CartSummary.jsx` — owns the entire `<aside>` shell. Drawer + checkout aside now consume it via slot props.
- Lifted `QtyControl` from `CartDrawer.jsx` into `CartSummary.jsx` so both surfaces could share it.
- Hand-matched the checkout aside's wrapper styling to the drawer (bg / px / border / gap) — that pass was made redundant by the subsequent `<CartPanel>` extraction but it correctly identified what the unified styling looked like.
- Extracted the row primitives earlier in the session (CartRow + CartTotalsRow) — user pushed back that this stopped one layer too short, leading to the CartPanel work.

## Current state / open decision points

**Code state:** clean. `<CartPanel>` is the single source of truth for the cart shell. CartDrawer.jsx is now ~110 lines (was ~140), Checkout.jsx aside dropped from inline JSX to a single `<CartPanel>` call. Build green; no orphan classes, no missing imports.

**Visual verification still pending** — same heads-up that's been on the bridge for two sessions now. The cart unification adds new visible deltas on top of the prior structural extractions:

- Checkout aside thumbs jumped 64px → 80px.
- Checkout aside qty went from text "· Qty: N" to interactive `<QtyControl>`.
- Checkout aside background flipped `surface-secondary` → `surface-primary`.
- Checkout aside paddings tightened `px-8` → `px-6` everywhere.
- All `<Divider/>` instances in the aside replaced with `border-b` / `border-t` on the panel's natural boundaries.

The 11 heads-up items in `docs/client/kol-client-acyr/01-website/06-style-audit/05-sweep-notes.md` still apply. Most pressing 3 remain:

1. Mid-section title scale at 64px (FAQ + Newsletter + Handmade interior) may feel too loud on home.
2. Cmd-K result rows render UPPERCASE via `.site-link-nav` — likely want sentence-case.
3. Handmade "Ask the studio." heading 40 → 64.

Plus the cart-specific items from today:

4. OrderConfirmation rows still render their own row markup directly — not yet migrated to `<CartRow>`. Visual match already holds via `.site-name-card`. Low-priority follow-up; would close row-shape parity across all three commerce surfaces.
5. `<CartPanel>` defaults `onClick={(e) => e.stopPropagation()}`. Required by drawer (clicks inside must not bubble to backdrop close). Harmless on checkout aside. Passthrough if needed later.

**Doc sync open decision:** `docs/ac-documentation/06-app-layers/05-site-typography.md` is the peer reference to `docs/client/site-typography.md`. Today added a §7 "Site components — compositional vocabulary" section to the client-tier doc but did NOT propagate it to the peer. User was flagged about this at end of doc-sync turn; no decision taken.

## Next intended action

1. **Visual verification.** Run `pnpm dev`, walk every page, focus especially on the two cart surfaces. Confirm the 80px thumb + interactive qty in checkout aside reads right.
2. **Action the 11 heads-up items** based on what the walk shows. Each is a 1-CSS-rule or 1-prop edit.
3. **Decide on the peer-doc sync** for `docs/ac-documentation/06-app-layers/05-site-typography.md` — propagate the §7 Site components addition, or accept that the client-tier doc is now the canonical compositional reference and the peer is typography-only.

## Working memory not yet in AGENT-CONTEXT

- The user was frustrated mid-session about the pattern of half-measures — extracting the symptom layer (rows), stopping, defending the gap, then taking the next step only after pushback. The memory `feedback_extract_at_the_right_layer.md` captures this. Future sessions: when two surfaces share data + look + behavior, the candidate for extraction is the OUTER wrapper with slot props, not just the inner primitives. If you'd be matching wrapper styling between two files by hand, you've stopped one layer too soon.
- The `<CartPanel>` slot API uses function props (`qtyControlFor(item)`, `linkToFor(item)`) rather than a pre-built items array. Reason: lets the consumer wire per-item interactivity (`updateQty(it.id, q)`) without the panel needing to know about cart-context plumbing. If a third consumer surfaces (OrderConfirmation), this API stays sensible — it can pass `qtyControlFor={() => null}` for static rows.
- Backlog category 4 closing was tidier than expected because the structural-extractions session had already done most of the work; 4c and 4d were closed by virtue of existing components. 4b was outdated. Only 4e required actual code change (~3 lines).
- User declined to expand scope to propagate doc changes outside docs/client tree when explicitly asked — they want scope kept tight. The peer doc decision stays open rather than being auto-propagated.
- One ergonomic gain worth noting: now that `<CartPanel>` exists, a future "view cart" page surface or a server-rendered order-receipt email would have a single component to compose against. The pattern is set up to scale to 3-4 surfaces without re-introducing drift.
