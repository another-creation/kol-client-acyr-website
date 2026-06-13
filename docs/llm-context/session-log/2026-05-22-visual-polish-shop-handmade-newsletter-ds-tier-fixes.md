# Session: Visual polish across Shop / Handmade / Newsletter + cascading DS-tier fixes

**Date:** 2026-05-22
**Agent:** Grim (Claude Opus 4.7, 1M context)
**Summary:** Long visual-verification walk turned into ~35 small-to-medium changes spanning the catalog pages, newsletter / contact forms, footer + nav chrome, and several DS-tier fixes uncovered en route (Input/Dropdown lg size bug, [data-theme="light"] scoped rule missing, three-tier border-opacity collapsed to two). Also extracted a shared `<EnquiryForm>` and a `<SectionOpener>` with split layout to close more drift.

## Changes Made

### New components

- **`apps/website/src/components/site/SectionOpener.jsx`** — eyebrow + optional title + optional subline + optional children + optional divider. Two layouts: `stacked` (default) and `split` (2-col, heading left / content right). Single source for the 7+ ad-hoc `<p className="site-eyebrow-section"> + <Divider /> + content` sibling sequences across Handmade + CollectionDetail. Internal spacing baked: gap-2 inside heading group, mt-6 on divider, mt-8 on children. Split layout uses `md:grid-cols-[1fr_2fr]` with gap-8/gap-12.
- **`apps/website/src/components/site/EnquiryForm.jsx`** — shared mailto-composed enquiry form for Handmade (commission flow) + Contact (general enquiries). Props: `categories`, `defaultCategory`, optional `subjectField`, `messagePlaceholder`, optional `tag` for mailto subject prefix, `recipient` (defaults to `BRAND_INFO.contact.email`). Builds the mailto contract internally.

### DS-tier fixes

- **`packages/ds/components/atoms.css`** — Input/Dropdown lg-size font-class mismatch with the docs. `.ac-control-lg` docs say "pair w/ kol-mono-16" but Input was wired to mono-14 and Dropdown trigger was wired to mono-14. Bumped both to mono-16 so Input + Dropdown + Button at lg now all render at the same height. Also bumped Input's inner `<input>` height pin from `h-[18px]` to `h-[22px]` at lg.
- **`apps/website/src/components/molecules/Dropdown.jsx`** — `SIZE_TYPE.lg` mono-14 → mono-16. Replaced `<MenuDropdownItem>` (hardcoded `h-8 ac-helper-12`) in the options panel with inline `<button>` that reuses the trigger's `SIZE_TYPE[resolvedSize]` class and `metrics.paddingY/paddingX`. Trigger and option rows now share height at every size.
- **`packages/ds/tokens/color.css`** — added scoped `[data-theme="light"]` rule with light surface tokens + fg-NN ramp redeclaration. Parallel to existing `[data-theme="dark"]`. Closes the one-way-inversion bug: previously a section with `data-theme="light"` did nothing in dark-mode pages. Also added the fg-NN ramp redeclaration to the dark block (was missing; relied on inheritance from `:root` which is fragile per the `.bg-surface-inverse` precedent).
- **`packages/ds/tokens/brand-color.css`** — added `--grey-250: #C5C5C6` between `--grey-200` and `--grey-300` to fill a hole in the grey ramp. Plus matching `--color-grey-250` in `@theme` and `.bg-grey-250` / `.text-grey-250` explicit utility classes.
- **`packages/ds/components/atoms.css`** — `.ac-btn-secondary:hover` background lifted from `var(--grey-200)` → `var(--grey-250)`. Hover delta now ~38 RGB vs prior 16; reads as a real hover, not a polite suggestion.
- **`apps/website/src/components/atoms/Input.jsx`** — `SIZE_TYPE.lg` `ac-mono-14` → `ac-mono-16`. Bug fix per DS docs.
- **`apps/website/src/components/atoms/Textarea.jsx`** — removed decorative `resize-corner` Icon span (the icon implied resizability but resize was disabled — visual lie). Flipped `resize: none` → `resize: vertical` so the textarea is now genuinely resizable; browser draws its own drag handle. Dropped unused Icon import.

### Border opacity audit (2-tier collapse)

Surveyed 24 fg-NN border usages across the site. Three tiers in active use:
- `fg-08` — structural dividers (CartPanel, FAQ rows, Modal, Cmd-K, etc.)
- `fg-12` — squishy middle (only 3 consumers: Footer top divider, FooterNewsletter bottom, ProductDetail SizeRow)
- `fg-16` — interactive controls (outline Input/Dropdown/Textarea, Carousel buttons, focus ring, code-block copy chip)

Then user observed `fg-16` reads loud on the input border. Sweep B (whole interactive tier 16 → 12):
- **`packages/ds/components/atoms.css`** — `.ac-control--outline` border + `.ac-control--ghost:hover/:focus-within` border: fg-16 → fg-12.
- **`apps/website/src/components/primitives/Carousel.jsx`** — chevron buttons: `border-fg-16` → `border-fg-12` (hover-state `fg-32` kept).
- **`packages/ds/framework/framework.css`** — `.ac-codeblock-copy`: fg-16 → fg-12. (`.ac-codeblock` container itself left at fg-16; structural, separate decision.)
- Earlier in the session, fg-12 raw-border consumers swept TO 08 or 16 per their role:
  - Footer top divider, FooterNewsletter strip bottom → 08 (structural)
  - ProductDetail SizeRow underline → 16 (now 12 after the second sweep — interactive)

Net: 2-tier system live. Structural = 08. Interactive = 12. `.border-fg-12` token + utility class kept available for future explicit needs but unused as a "drift" tier.

### Files modified — pages / components

- **`apps/website/src/components/site/DesignerVision.jsx`** — italic second paragraph migrated from 4-class stack (`site-subline-hero font-light font-narrow italic opacity-64`) to new `.site-subline-emphasis` role (Compact 300 italic 0.04em fg-64, baked in `site-typography.css`). Copy rewritten: "Based in Central Europe, our small atelier works with local artisans..." → "From a studio in Reykjavík, each piece is cut by hand in small numbers..." (the "small atelier with local artisans" framing was a fabrication — brand reality is Ýr making garments by hand at the studio).
- **`apps/website/src/styles/site-typography.css`** — added `.site-subline-emphasis` role (Compact 300 italic, 0.04em, fg-64). Registered in the `@layer base { :where(...) }` margin reset. Also bumped `.site-link-nav` and `.site-link-footer` from 12px → 14px, deleted the now-redundant `.ac-site-nav-drawer .site-link-nav` override.
- **`apps/website/src/components/site/SignupOverlay.jsx`** — 4 category buttons (SHOP / HANDMADE / COLLECTIONS / JOURNAL) wired to `useNavigate` so they actually go somewhere (were just closing the overlay). Headline "15% off your first order" replaced with "Where would you like to start?"; helper text dropped. Sidelabel + overlay now route-gated to `/`, `/shop`, `/handmade` only (was visible everywhere).
- **`apps/website/src/pages/site/Shop.jsx`** — hero aligned to Collections/Journal editorial pattern (min-h-[80vh], 60/30/primary gradient, `<SiteSection as="div">` wrapper, lede subline, title `Shop.`). Grid section: `width="grid"` → `width="full"`; grid bumped to `lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6` and `pt-16` → `py-32`. Dropped now-unused BRAND_INFO import.
- **`apps/website/src/pages/site/Handmade.jsx`** — same hero alignment as Shop. Pieces grid: full-width, `md:grid-cols-3 xl:grid-cols-4`, py-32. FAQ + "Ask the studio" sections: width=panel, py-32, `<SectionOpener layout="split">`. Contact form replaced with `<EnquiryForm tag="Handmade" subjectField categories={...}>`. Lost ~30 lines of duplicated form JSX + 8 unused imports.
- **`apps/website/src/pages/site/Collections.jsx`** — grid: `width="wide"` → `width="full"`, columns `md:grid-cols-2 xl:grid-cols-3`.
- **`apps/website/src/pages/site/Contact.jsx`** — inline form replaced with `<EnquiryForm categories={SUBJECTS} defaultCategory="general">`. Lost ~25 lines + 6 unused imports. Press column link updated to use `BRAND_INFO.contact.press`.
- **`apps/website/src/pages/site/CollectionDetail.jsx`** — 4 ad-hoc opener patterns (The looks / The show / Collaborators / Press) migrated to `<SectionOpener eyebrow="..." divider>` with stacked layout.
- **`apps/website/src/pages/site/ProductDetail.jsx`** — SizeRow underline border updated through both border sweeps (12 → 16 then 16 → 12 net).
- **`apps/website/src/pages/site/Press.jsx`** — `BRAND_INFO.contact.email` → `BRAND_INFO.contact.press` (×2 — Press contact line + Press kit line).
- **`apps/website/src/pages/site/Brand.jsx`** — press-kit asset request line: `BRAND_INFO.contact.email` → `BRAND_INFO.contact.press`.
- **`apps/website/src/components/site/Newsletter.jsx`** — `<section data-theme="dark" className="bg-surface-inverse ...">` → `<section data-theme="light" className="bg-surface-primary ...">`. Section now FORCES light theme regardless of page theme. Input variant: outline → filled. Required the DS-tier `[data-theme="light"]` scoped rule fix above.
- **`apps/website/src/components/site/FooterNewsletter.jsx`** — raw `<input>` (line 52-61 with `border-b border-fg-24` underline-style) replaced with `<Input variant="outline" size="md">`. Button to `variant="secondary" size="md"`. Container `border-b` dropped (Footer.jsx now owns the divider after the strip). Atom-skip anti-pattern closed.
- **`apps/website/src/components/site/Footer.jsx`** — two raw `border-t border-fg-08` + `border-b border-fg-08` divider markers replaced with `<Divider className="mx-8" />` instances. One before footer-grid, one before footer-bottom — identical, atom-driven. Footer outer surface flipped from hardcoded `var(--ac-color-absolute-black)` → `bg-surface-tertiary` (theme-aware: pure white #FFFFFF light, near-black #0E0E11 dark). Removed empty `.ac-site-footer` base CSS rule (had only bg+color; both now utility-driven).
- **`apps/website/src/components/site/Nav.jsx`** — `<nav className="ac-site-nav ...">` now also includes `bg-surface-tertiary`. Matches footer.
- **`apps/website/src/styles/site.css`** — `.ac-site-nav` background/color declarations removed (utility owns it now). `.ac-site-footer` base rule deleted entirely.
- **`apps/website/src/components/site/SiteLayout.jsx`** — `<KolLogo height={24}>` → `height={28}`.
- **`packages/brand-data/info.js`** — `BRAND_INFO.contact.press = 'press@another-creation.xyz'` added.
- **`docs/ac-documentation/00-color-cheatsheet.md`** — grey ramp row added for `--grey-250 #C5C5C6`.

### Backlog updates

- **`docs/backlog.md`** + **`docs/backlog-notes.md`** — 4e (star-trek-ipsum sweep) closed earlier in the day; if not already reflected: Home.jsx page title + Testimonial kicker cleaned of "federation bridge platform" / "Stardate 2026".

### Memory written

- **`~/.claude/projects/-Users-kolkrabbi-dev-projects-kol-acyr-website/memory/feedback_extract_at_the_right_layer.md`** (earlier in the day) — was the lesson. Re-applied multiple times during this session (SectionOpener, EnquiryForm).
- **`~/.claude/projects/-Users-kolkrabbi-dev-projects-kol-acyr-website/memory/feedback_tailwind_v4_layer_cascade.md`** (earlier in the day) — was the lesson. Re-applied (margin reset, border tier sweep).
- No new memory this arc — the existing rules already covered the work.

## Current State

### Working

- **Cart asides, structural extractions, role-layer typography, margin cascade, font preload** — all from earlier in the day, still working.
- **Shop / Handmade / Collections / Journal hero family** — all four list-page heroes now share the editorial Collections/Journal pattern (min-h-[80vh], dark-top gradient, lede subline). Reads as one cohesive family.
- **Shop / Handmade / Collections grids** — all three full-width, sensibly column-scaled per content type.
- **`<SectionOpener>` is now site-wide** for the "eyebrow + optional title + optional content + optional divider" pattern. Stacked + split layouts.
- **`<EnquiryForm>` is now site-wide** for mailto-driven enquiry forms. Handmade (commission flow with subject input) + Contact (general subjects) both use it.
- **Input + Dropdown lg sizes** now consistently render at the same height as Button lg (mono-16).
- **2-tier border opacity** in active use: fg-08 (structural) + fg-12 (interactive).
- **`data-theme="light"` works as a scoped force-override** inside dark-mode pages (parallel to existing `data-theme="dark"` scoping).
- **Footer + Nav** both on `bg-surface-tertiary` — theme-aware, DS-conformant, matching pair bracketing the page.
- **Press email** explicitly routed to `press@another-creation.xyz` across Contact, Press, Brand pages.
- **SignupOverlay** sidelabel + overlay confined to `/`, `/shop`, `/handmade`; 4 buttons actually navigate.

### Known issues / heads-up items

- **SignupOverlay sidelabel still reads "UNLOCK 15% OFF"** while the overlay no longer carries a discount. Dangling promise. Either update the sidelabel copy (e.g. "Where to start?", "Begin here") or restore the discount framing once backlog 3d (Newsletter design rework) ships an actual discount mechanism.
- **PageHero subline-emphasis ("DesignerVision" italic body)** baked at fg-64 in the role. Works in both themes via the @layer base mechanism but hasn't been visually verified in dark mode specifically.
- **Cold-reload FOUC** — pre-paint inline `<style>` in index.html still paints `#FAFAFA/#121215` (surface-primary). Nav + footer are now on surface-tertiary which is *slightly* different (#FFFFFF light / #0E0E11 dark). Microsecond visible mismatch on hard refresh. Probably not worth fixing unless noticeable; if so, update the pre-paint to also seed nav/footer tertiary.
- **`SupportCTA`, `Marquee`, `HandmadeCard`** still use `data-theme="dark"` inversion. Newsletter flipped to `data-theme="light"`; the other three are still inverted-dark. Inconsistent inversion strategy across "statement" sections. May want to harmonize as a follow-up.
- **`.ac-codeblock`** container border still at fg-16 (structural, not interactive — could move to fg-08 for consistency but separate call).
- **Accumulated visual changes still not fully walked**. We've been verifying as we go but a final end-to-end pass would catch anything missed (e.g., Cmd-K result row uppercase from the earlier sweep notes, mid-section title scale at 64 in FAQ on Home, OrderConfirmation rows not migrated to `<CartRow>`).
- **Top nav links at 14px** may feel slightly loud at desktop sizes — visual check post-reload.

### Out of scope (intentionally)

- DS-tier `.ac-prose-*` margin strip — still deferred per audit recommendation #6.
- Newsletter design rework (backlog 3d) — still gated on design direction. Atoms now share between the home card + footer strip, so visual unification is half-done.

## Next Steps

1. **End-to-end visual walk** of every route now that ~35 changes have landed. Catch anything that shifted unexpectedly. Particularly: PDP (SizeRow border tier change), DesignerVision (in dark mode), Cmd-K (still uppercase result rows?), OrderConfirmation rows (still un-migrated).
2. **SignupOverlay sidelabel copy** — decide the dangling "15% OFF" framing. Either update or ship backlog 3d.
3. **Harmonize remaining "statement" inversion sections** (SupportCTA / Marquee / HandmadeCard) — either flip them to match Newsletter's `data-theme="light"` pattern, or keep them inverted-dark and accept the asymmetry.
4. **OrderConfirmation rows → `<CartRow>`** for full commerce-surface parity. Low-priority follow-up flagged from the prior cart-panel session.
5. **Backlog 3b (dark-mode burgundy accent contrast)** and **3c (accent-burgundy-brighter)** — outstanding token work that may interact with the new `[data-theme="light"]` scope rule.
