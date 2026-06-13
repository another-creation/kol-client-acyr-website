# Handoff — 2026-05-22 23:30

## Goal of the current arc

Sustained visual-verification + polish walk across the catalog pages, newsletter/contact forms, and footer/nav chrome. The structural/role/cascade work landed earlier today exposed how much downstream tuning was still needed once the foundation was right. Every flagged drift turned into either (a) a one-line tune at the leaf, or (b) a DS-tier fix that unblocked a class of consumers.

## Last actions taken (causal trail, newest first)

- KolLogo height 24 → 28 in SiteLayout.
- `.site-link-nav` 12 → 14, deleted now-redundant drawer override; `.site-link-footer` 12 → 14.
- Nav: `bg-surface-tertiary` added to className; `.ac-site-nav` CSS bg/color declarations dropped. Now matches footer.
- Footer: hardcoded `var(--ac-color-absolute-black)` background dropped from `.ac-site-footer`; `bg-surface-tertiary` added to JSX className. Theme-aware now.
- Footer: two raw `border-t/border-b` divider markers replaced with `<Divider className="mx-8" />`. FooterNewsletter's container `border-b` dropped (Footer owns the divider after the strip).
- Border opacity sweep B: fg-16 → fg-12 across all interactive control borders (atoms.css ghost-reveal + outline; Carousel chevron buttons; `.ac-codeblock-copy`). Earlier in the session, fg-12 raw-border consumers had been swept to either fg-08 (structural) or fg-16 (interactive). End state: 2-tier system live.
- `[data-theme="light"]` scoped rule added to DS color.css. Mirrors the existing `[data-theme="dark"]` block. Fixes the one-way-inversion bug — Newsletter card with `data-theme="light"` now actually flips to light surface inside dark-mode pages. Also added fg-NN ramp redeclaration to the dark block defensively.
- Newsletter card flipped: `data-theme="dark" bg-surface-inverse` → `data-theme="light" bg-surface-primary`. Initially I misread the request and just dropped data-theme entirely; user reasserted "data-theme LIGHT not drop" — corrected.
- FooterNewsletter atom-skip closed: raw `<input>` swapped to `<Input variant="outline" size="md">`. Newsletter card swapped to `variant="filled" size="lg"`. Press email separated to `BRAND_INFO.contact.press` and propagated across Contact + Press + Brand pages.
- `<EnquiryForm>` extracted as shared component; Handmade + Contact both consume it. Handmade form gained Category dropdown + Subject input. Textarea atom: removed lying resize-icon, flipped to `resize: vertical`.
- Input + Dropdown lg-size mono-14 → mono-16 (DS bug per docs); Dropdown panel option rows replaced MenuDropdownItem with inline buttons sharing the trigger's SIZE_TYPE + metrics.
- `<SectionOpener>` extracted (stacked + split layouts); 7 ad-hoc opener call sites migrated across Handmade + CollectionDetail. Handmade FAQ + contact sections now use split layout at panel width.
- Shop / Handmade / Collections grids: all moved to `width="full"` with content-appropriate column counts.
- Shop + Handmade heroes: aligned to Collections/Journal editorial pattern (min-h-[80vh], dark-top gradient, lede subline, new copy).
- SignupOverlay: 4 buttons wired to navigate; headline "15% off your first order" → "Where would you like to start?"; sidelabel + overlay route-gated to /, /shop, /handmade.
- DesignerVision italic body extracted as `.site-subline-emphasis` role; copy rewrite from "Central Europe + small atelier with local artisans" (fabrication) → "Reykjavík + made by hand in small numbers" (brand reality).
- `--grey-250: #C5C5C6` added to brand-color.css (intermediate ramp stop); `.ac-btn-secondary:hover` lifted from grey-200 → grey-250 — stronger hover affordance.

## Current state / open decision points

**Site is in better shape than at session start.** Most flagged drift closed. The visual cadence of the catalog pages now reads as one family. DS-tier inconsistencies that were biting (Input lg height, [data-theme="light"] not working, border opacity middle-tier) are gone.

**Still not visually walked end-to-end** after the accumulated changes. The session was iterative-with-screenshots, so most surfaces have been seen, but a final pass would catch:
- PDP SizeRow border tier change (16 → 12 net) — visible?
- DesignerVision in dark mode (new `.site-subline-emphasis` role at fg-64)
- Cmd-K result row uppercase (flagged earlier, still pending)
- OrderConfirmation rows (still not migrated to `<CartRow>` from earlier session)
- Top nav at 14 — feel right at desktop sizes?

**Open decision points:**

1. **SignupOverlay sidelabel still says "UNLOCK 15% OFF"** — overlay no longer carries that promise. Either update copy (e.g. "Where to start?") or restore discount framing once backlog 3d ships an actual discount mechanism.
2. **Remaining `data-theme="dark"` inversion sections** — SupportCTA, Marquee, HandmadeCard. Newsletter flipped to `data-theme="light"`. The other three stay inverted-dark. Asymmetric. Decide: harmonize all to light, keep them dark, or accept the mix.
3. **`.ac-codeblock` container border** — left at fg-16. Structural; not interactive. Could move to fg-08 if you want full 2-tier purity (but `.ac-codeblock` is in framework.css and is more rare-use). Hold.
4. **Cold-reload FOUC** — pre-paint inline `<style>` in `index.html` paints surface-primary. Nav + footer are now surface-tertiary. Microsecond visible mismatch on hard refresh. Edit pre-paint if you notice it, otherwise ignore.

## Next intended action

1. **`pnpm dev` end-to-end walk.** Every route. Focus areas above.
2. **Dark mode toggle test.** Newsletter card forcing light theme is the high-risk change — make sure surface inversion looks right and text contrast holds.
3. **Decide on SignupOverlay sidelabel copy** + harmonize remaining inversion sections OR explicitly accept the mix.
4. **If a 36th polish item shows up during the walk**, tune it; otherwise close the arc and move to backlog 3b/3c (dark-mode burgundy contrast / accent-burgundy-brighter) which are the next visible-token items.

## Working memory not yet in AGENT-CONTEXT

- **The Tailwind v4 layer cascade rule (saved memory) was load-bearing twice this session** — the margin reset earlier, and the inverted [data-theme="light"] scope rule. The memory writeup says "wrap baseline declarations in @layer base." Applied here in slightly different form (scoped attribute selector with surface tokens redeclared) but the underlying principle — give the override mechanism the right cascade altitude — is the same.
- **The "extract at the right layer" memory came up twice** — once for SectionOpener (extracting the wrapper pattern instead of just the eyebrow), once for EnquiryForm (after the user flagged that I'd just rebuilt the same form on Handmade and Contact would silently drift). Pattern: when two surfaces share data + look + behavior, extract the shell, not the leaves.
- **`bg-surface-tertiary` for nav + footer chrome** feels right at this brand register — the page is the working surface (primary), the chrome strips bracket it at a different elevation tier (tertiary). If you ever add a third chrome zone (e.g., persistent search bar, sticky sub-nav), default to surface-tertiary unless there's a reason to deviate.
- **`<SectionOpener layout="split">` may become the default for the structured opener pattern in this site.** It already covers FAQ + contact-form sections on Handmade. If we want CollectionDetail's "The looks" / "The show" / etc. sections to also use split (heading left, content right) instead of stacked, that's a one-prop migration per section. Consider after visual review.
- **The user pushed hard on the "atom-skip" anti-pattern multiple times** — FooterNewsletter's raw input, the resize-corner icon lie, the Input/Dropdown lg mismatch. Pattern: when something in the JSX bypasses an atom or a role class, treat it as a smell signal — there's either a missing atom variant (then add it deliberately) OR the bypass is drift to be undone.
- **The user moved from `outline` to `filled` to `outline` to `filled` on the Newsletter form variants and from `lg` to `sm` to `md` on the FooterNewsletter sizing.** This is iterative visual work, not indecision — they're feeling the right values by seeing them. Don't pre-decide; show + adjust.
- **Press email is now `press@another-creation.xyz`** via BRAND_INFO.contact.press. Catch-all on Proton means it routes to the same inbox today; the explicit address sets up future routing/filtering at the email layer.
