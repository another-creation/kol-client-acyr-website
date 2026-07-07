---
title: Role-layer sweep notes
type: log
status: active
updated: 2026-05-21
description: Running log of decisions, visible deltas, and "revisit later" items captured during the JSX sweep onto site-typography role classes.
audience: agency-internal
tags:
  - project/acyr
  - domain/website
  - domain/typography
related:
  - "[[INDEX|style audit index]]"
  - "[[../../../apps/website/src/styles/site-typography.css|site-typography.css]]"
---

# Role-layer sweep notes

Running log. Append-only per region. Each item is a visible delta, a decision deferred, or a heads-up to discuss after visual review.

## Region: Nav + footer (done)

- Bottom-bar copyright shrank 11px → 10px (collapsed to `.site-meta-status`).
- `.site-meta-status` color tuned fg-64 → fg-48 mid-sweep (user feedback — bottom bar was too bright). Affects every `.site-meta-status` consumer.
- Deleted dead `.ac-site-footer-label` + `.ac-site-footer-meta` rules from `site.css`. `.ac-site-footer-list` kept (pure list-layout).
- `FooterNewsletter` native `<input>` still bypasses the `Input` atom (no underline variant exists). Known atom-skip — deferred to backlog 3d.
- Drawer-nav `text-[14px]` override moved into `site-typography.css` as a descendant scope rule (`.ac-site-nav-drawer .site-link-nav`).

## Region: Page heroes (done)

- **Home hero kicker** initially migrated to `.site-eyebrow-hero` (visible quietening) — user reverted via new `.site-display-eyebrow` role (Mono 24 600 0.10em uppercase brand-accent). The display-tier eyebrow lives as its own role; not folded into the standard hero-eyebrow.
- **NotFound body copy** shifted from `.ac-sans-body-01` (Sans 16 400 160lh) to `.site-subline-hero` (Compact 24 400 28lh). Bigger + different family. May want a `.site-body-page` role later if NotFound or similar surfaces want a smaller editorial body outside `.ac-prose`.
- **ProductDetail breadcrumb** — was `.ac-helper-xxs uppercase text-meta` (Mono 10 fg-48), now `.site-meta-status` (Mono 10 fg-48). Equivalent spec, but the `<Link>` color inside still uses `text-meta hover:text-emphasis` Tailwind utilities. Acceptable for now.
- **404 status labels** converged from 4 conventions (`.ac-prose-label` / `.ac-helper-xxs text-meta` / `.ac-helper-12 tracking-widest text-meta` / `.ac-sans-display-01`) to one (`.site-meta-status`). Some surfaces shrank from 12 → 10.
- **Back-link `marginBottom: '32px'` inline style** preserved across all consumers. Could move to parent `gap-N` later; not structural enough to fix in this pass.

## Region: Mid-page sections (done)

### Visible deltas

- **`.site-title-section` defaults to 64px.** Affected:
  - FAQ heading: 40 → 64 (heavier — `.ac-sans-heading-02` was 40)
  - Newsletter heading: 40 → 64 (heavier)
  - HandmadeCard heading: 80 → 64 (lighter — `.ac-prose-display` was 80)
  - Handmade "Ask the studio.": 40 → 64 (heavier)
  - DesignerVision: 64 ✓ no change
  - SupportCTA: 64 ✓ no change
- **Collection home section** intentionally NOT promoted to `.site-title-section`. Both "Collection" and "SS 2026" use `.site-meta-editorial` (Mono 12 fg-48). Kept the existing small-label feel — but it's now a label, not a heading. **Decision needed:** small-label vs full section heading.
- **SupportCTA body** swept from `text-[20px] leading-7` to `.site-subline-hero` (Compact 24 28lh). Bigger size + Compact family — visible delta.
- **DesignerVision body × 2** swept from `text-[20px] leading-7` to `.site-subline-hero`. Same direction as SupportCTA. Second variant (italic narrow light) preserved via `font-light font-narrow italic opacity-64` Tailwind utilities on top of role.
- **Handmade "Ask the studio."** title scale changed (was Narrow 40 inline-overridden, now Narrow 64). Subline preserved.
- **Testimonial** quote now uses `.site-quote` (Sans clamp 32→64 italic bold) — equivalent visual to before. Cite uses `.site-quote-cite` (Mono 12 fg-64).

### Inversion convention

- **SupportCTA + Newsletter sections** got `data-theme="dark"` added per the inversion contract. `.text-on-inverse` overrides dropped (role classes flip correctly under theme scope).
- HandmadeCard already had `data-theme="dark"` on its inner div — left as-is.

### Items to revisit

1. **Mid-section title scale** — 64 may be too loud everywhere. FAQ + Newsletter sit on the home page near the hero; could compete. If 64 is too heavy, the role tunes to 40 in one line.
2. **Collection home section "heading"** — currently `.site-meta-editorial` (label-style). Add a dedicated `.site-label-section` role if more surfaces want this small-label-as-heading pattern?
3. **`.site-subline-hero` doubles as mid-section body** — DesignerVision + SupportCTA body copy now uses the same role as page-hero sublines. If page heroes should diverge later, will need a `.site-body-section` role.
4. **DesignerVision second body** still carries `font-light font-narrow italic opacity-64` utilities. If this italic-narrow-light variant repeats elsewhere, extract as a role (`.site-subline-emphasis` or similar).

### Editorial card meta sweep (folded into this region)

- All `.ac-prose-label` used as card byline / date / reading-time / "← Previous" / collaborator role / press outlet / look label / show definition-term migrated to `.site-meta-editorial`.
- `.ac-prose-label` is now zero JSX consumers. DS rule remains for editorial body content authored in `.ac-prose` (no caller). Could be DS-tier cleanup later.

## Region: Cards / commerce (done)

### Bug fix mid-sweep — `.site-meta-status` split

User flagged footer copyright was rendering uppercase + wide-tracked when it should have been proper-case. Root cause: I'd baked `text-transform: uppercase` + `letter-spacing: 0.10em` into `.site-meta-status` and migrated sentence-case consumers (footer copyright, Newsletter error, FooterNewsletter error) onto it.

Split into two roles:

- `.site-meta-status` — uppercase chrome (404, ESC, breadcrumb, Cmd-K section badge, subtotal label, bag header)
- `.site-meta-system` — sentence-case body (footer copyright, error messages, helper text, "Continue shopping", "Secure via PayPal", tracking footnote, empty state copy, "No results.")

Re-routed Footer copyright, Newsletter error, FooterNewsletter error to `.site-meta-system`.

### Visible deltas

- **Product name register converged** to Narrow 12 (`.site-name-card`) across catalog (ProductCard), cart (CartDrawer), checkout aside, order confirmation rows. CartDrawer rows grew from Mono 10 → Narrow 12 — biggest visible delta in this region. Reads more like browse chrome, less like dense data table.
- **PDP size pill** Mono 12 → Narrow 12. Same scale, different family. Subtle.
- **PDP quantity value** Mono 12 → Narrow 12.
- **Checkout aside totals** Mono 12 → Narrow 12 (label dim, value emphasis — paired register).
- **OrderConfirmation row** Mono 12 (name) + Mono 10 (meta) mix → all Narrow 12. Cleaner.
- **CartDrawer empty state + helper + "Continue shopping" + tracking footnote** migrated to `.site-meta-system` (Mono 11 normal-case proper-case). Reads correctly as system body, not chrome.

### Items to revisit

1. **Product name register on cart/checkout/order** now matches catalog ProductCard. **Visible weight gain** vs the old Mono 10 cart rows. If the dense-data feel was preferred, swap `.site-name-card` value back to Mono register — one CSS rule.
2. **Cmd-K result label** is now `.site-link-nav` (Narrow 12 uppercase). Search result titles are now UPPERCASE — may want to drop the uppercase for readable result rows. Either override at call site or add a `.site-link-nav-natural` variant.
3. **SignupOverlay overlay heading** "15% off your first order" was force-scaled `.ac-sans-heading-02 text-[64px]!` — now `.site-title-section` (clean 64). Drop in size from forced 64 to native 64 (same).
4. **SignupOverlay eyebrow** "Another Creation" was Mono 20 fg-64 — now `.site-display-eyebrow` (Mono 24 600 brand-accent). Bigger + colored — matches Home hero kicker register. Heads-up if you'd prefer it quieter inside the overlay context.
5. **Marquee section** got `data-theme="dark"` added. Kicker dropped `text-white/50` override, head-note dropped `text-[13px] text-white/60` arbitrary. Now `.site-eyebrow-section` + `.site-meta-system` resolve to correct dim-white under theme scope. Drops 13px → 11px on the head-note (minor shrink).
6. **Brand swatch labels** (Burgundy 200 / #750E20 / Brand primary) migrated to `.site-meta-system` (Mono 11 normal-case). Were `.ac-helper-xs` Mono 12. Minor shrink.

## Out-of-scope (correctly NOT swept)

- **Atoms / molecules** still carry their `.ac-mono-N` internal text register (Button, Input, Dropdown, MenuItem, ContentFilters, ViewToggle, SegmentedToggle, ToggleBracket, Textarea, Stepper, ToggleCheckbox, ToggleSwitch, PropertyInput, Avatar, SectionLabel). DS-tier; if atom text needs retuning, it's a separate task.
- **Editorial body content** inside `.ac-prose` containers (blog body, legal page body, BlogBody-rendered Sanity content). DS-owned.
- **FAQ summary** (`.ac-sans-heading-05` Compact 20). Component-internal; if we want to retune FAQ row question size, can either add a role or edit FAQ.jsx directly.
- **`primitives/Accordion`** title + meta (`.ac-helper-12 uppercase tracking-widest`). Primitive component, DS-tier.

## Region: Cart panel unification (done — 2026-05-21, second arc)

The earlier structural-extraction pass extracted `<CartRow>` + `<CartTotalsRow>` into `apps/website/src/components/site/CartSummary.jsx` but left `<CartDrawer>` and the `<Checkout>` aside as separate wrappers sharing only those inner row primitives. User flagged that the wrappers had visibly drifted — different background tier, different paddings, different separator style — and re-flagged across two passes. The fix was extracting the shell, not just the rows.

### Visible deltas

- **Wrapper component:** new `<CartPanel>` at `components/site/CartSummary.jsx` owns the `<aside>` shell — background, border, padding, header bar, scrollable item list, footer scaffold. Both surfaces consume it via slots (`header`, `items`, `qtyControlFor`, `linkToFor`, `onLinkClick`, `empty`, `footer`, `className`).
- **QtyControl moved.** The qty stepper component used to live inside `CartDrawer.jsx`; lifted into `CartSummary.jsx` and exported alongside `CartRow` / `CartTotalsRow`.
- **Checkout aside merged onto drawer styling:**
  - `bg-surface-secondary` → `bg-surface-primary`
  - `px-8` → `px-6` everywhere
  - Dangling `<Divider/>` after header dropped; row-internal `<Divider mt-5/>` dropped.
  - Header / list-item / footer now use `border-b` / `border-t` (matching the drawer).
  - Footer `gap-3` → `gap-4`. Trailing `pb-4` dropped.
- **Checkout aside qty representation:** text-only "· Qty: N" inside the meta line → interactive `<QtyControl>` rendered below meta. Users can now edit qty from checkout (Shopify / Snipcart standard).
- **Checkout aside thumb:** 64px → 80px. Matches drawer.
- **`thumbSize` and `qtyControl`-vs-text-fallback props on `<CartRow>` removed** — they were preserving drift.

### What stays different by necessity

- **Outer positioning** — drawer is `absolute top-0 right-0` inside a `fixed inset-0` overlay with backdrop + dialog role; checkout aside is `lg:fixed lg:right-0 lg:top-0` sitting in-page.
- **Header right slot** — drawer adds a close × button (it's modal); checkout aside renders the bag title only.
- **Footer content** — drawer = Subtotal + "Shipping + tax calculated at checkout" note + Checkout CTA + Continue link. Checkout aside = Subtotal + Shipping row + Divider + Total row + PayPal lock note. Different moments in the flow.

### Net change

Two surfaces, one `<CartPanel>` shell. Tuning any wrapper rule (background tier, padding, border treatment, gap) is a one-edit propagation. Drift between these two surfaces cannot reintroduce itself without an explicit prop override.

### Items to revisit

1. **OrderConfirmation rows** still render their own row markup directly in `OrderConfirmation.jsx`. Could be migrated to `<CartRow>` for full row-shape parity across all three commerce surfaces — was assumed shared in CartSummary's header comment but never wired. Low-priority follow-up; rows visually match already via `.site-name-card`.
2. **`onClick={(e) => e.stopPropagation()}` on the aside** is baked into `<CartPanel>` by default. Required for the drawer (clicks inside the panel must not trigger the backdrop close handler); harmless on the checkout aside. If a future consumer needs a different `onClick`, the prop is passthrough.

## Status

Role layer covers **every text-bearing element in the website's page/site layer**, except FAQ summary (1 line, component-internal). DS-tier atom text and editorial body content stay on DS classes as designed.

Total surface: 19 role classes in `apps/website/src/styles/site-typography.css` + 4 structural extractions (BackLink / PageHero / SecondaryPageShell / SiteSection) + the CartPanel + CartRow + CartTotalsRow + QtyControl cluster. Tuning the site's visual register is now a one-file edit; tuning the site's structural register is now a one-component edit.
