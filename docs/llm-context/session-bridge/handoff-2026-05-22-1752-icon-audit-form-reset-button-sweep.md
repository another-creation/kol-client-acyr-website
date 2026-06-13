# Handoff — 2026-05-22 17:52

## Goal of the current arc

Close out the easy components-category backlog items (3b Icon audit, 3d Newsletter card/strip, 5a Form-element chrome reset for real) and finish the primary-button sweep that was deferred from the morning's variant rewire. Spent ~half the arc repurposing the dormant ghost variant (Button + Input) to match QtyControl's fg-04/fg-08 ramp, then sweeping every "loud where it shouldn't be" primary button to ghost.

## Last actions taken (causal trail, newest first)

- Footer email hardcode: `BRAND_INFO.contact.email` → literal `hello@another-creation.xyz` in Footer.jsx. Other consumers (Contact page, checkout) still use `yr@` from BRAND_INFO. Open decision: flip the source field.
- SignupOverlay sidelabel: `rounded-l-[2px]` (page-facing outward corners after `rotate-180`).
- Footer polish: phone removed; "Shipping & Returns" → "Shipping"; col 1 width `1.4fr` → `1.8fr`; TikTok + X (Twitter) added to SOCIAL with placeholder `anothercreation_yr` handle URLs; X label is "X Twitter" per explicit user ask.
- FooterNewsletter stack-mode spacing: outer gap `gap-4` → `gap-6` (24px); inner eyebrow-to-body gap `gap-1.5` → `gap-3` (12px, matches footer col gap). Body paragraph got `uppercase` Tailwind utility per explicit user override of the no-auto-text-transform rule.
- FooterNewsletter Input variant `outline` → `ghost`.
- `.ac-control--ghost` rewired to mirror `.ac-btn-ghost`: fg-04 rest, fg-08 hover, no border reveal, text in surface-on-primary.
- ContentFilters search input: bg token fixed (`rgba(255,255,255,0.04)` → `var(--ac-fg-04)`), input chrome force-killed with inline `outline: none` + `boxShadow: none` + `WebkitTextFillColor: currentColor` + `autoComplete="off"`. User confirmed fix worked.
- `packages/ds/utilities/forms.css` shipped + imported in DS index between utilities.css and typography-helpers.css. Wrapped in `@layer base` so Tailwind utilities + atom class selectors override cleanly.
- Discovered backlog 5a was marked ✅ in quick view but no actual global reset existed. Now genuinely done.
- Button sweep to ghost: PDP (Add-to-bag + Enquire), CartDrawer (Checkout), EnquiryForm (Send — affects Contact + Handmade), ProductCard (Add to Bag overlay), FAQ (+ pill — was `ac-btn-primary`, now `ac-btn-ghost`).
- `.ac-btn-ghost` rewired: was `bg: transparent + color: fg-48 / hover bg fg-08`; now `bg fg-04 / color surface-on-primary / hover bg fg-08`. Iterated 04/16 → 04/12 → 04/08 based on user tuning + matching QtyControl.
- Icon audit (backlog 3b): scoped to `apps/website/src`. 5 inline `<svg>` sites total; 3 migrated to `<Icon>` (QuantityInput chevrons, DropdownTagFilter chevron, CodeBlock check/copy). 2 intentionally inline (ToggleCheckbox checkmark polyline, TransparentX stretching marker). Styleguide app out of scope.

## Current state / open decision points

- **The variant tier is now this:** primary = always-dark (loud CTA only), secondary = always-light, ghost = subtle fg-04/fg-08 (default for "any button that isn't a hero CTA"), accent = theme-aware brand, outline = bordered. After today's sweep, primary is used almost only on the Newsletter Home card.
- **`BRAND_INFO.contact.email` still `yr@another-creation.xyz`** — Footer is now hardcoded to `hello@…`. Decision pending: flip the source field, or treat `hello@` as footer-only.
- **Site-css `:focus-visible` rule is unlayered + global** — beats anything layered. Affects every focusable element. Long-term clean answer is to move it into `@layer base`, but that affects every input + button + link focus indicator. Out of scope today.
- **Primary-button sweep not exhaustive** — only the high-traffic surfaces were touched. A full grep + walk would catch the stragglers. EditorButton in styleguide also picked up the new ghost ramp (same `.ac-btn-ghost` class); not visually verified.
- **TikTok / X URLs are placeholders.** User has not confirmed real handles.
- **Backlog has 3 new placeholder items** (7 animations, 8 loader?, 9 brand+press) added by user mid-session in the quick view. No scope yet on any of them.

## Next intended action

1. **Decide `BRAND_INFO.contact.email`** — keep yr@ as the working contact (and footer always-hardcoded `hello@`), OR flip to `hello@` site-wide.
2. **Full primary-button grep** — `grep -rn 'variant="primary"' apps/website/src` and walk each surface. Confirm the only remaining is Newsletter Home.
3. **Replace TikTok / X URLs** with the real handles when user provides them.
4. **Visual check the styleguide editor** (RuleRow's `<EditorButton variant="ghost">`) under the new fg-04/fg-08 ramp. The editor is the only other consumer of `.ac-btn-ghost` and was previously rendering as transparent/quiet — it'll now have a subtle fill.
5. **Consider moving `:focus-visible` into `@layer base`** in `apps/website/src/styles/site.css` — would let Tailwind `focus-visible:outline-none` utilities work without inline-style force-overrides. Risky because it affects keyboard-focus a11y site-wide.

## Working memory not yet in AGENT-CONTEXT

- **The "extract at the right layer" memory came up again today** — when I tried to extract a hero-block lead variant of the Footer and the user corrected with "I said move the newsletter signup under wordmark, not move wordmark over newsletter signup." Pattern: when a correction comes in, re-read the ORIGINAL ask, not the inverse of what I shipped.
- **The `plain prose for simple answers` memory triggered an apology mid-session** ("why can't you just answer normally?") when I formatted a 3-consumer ghost-variant count as a structured report. Memory now in MEMORY.md. Apply: factual lookups get a sentence or two in prose, not bullets/headers.
- **The user is extremely literal about icon meaning.** `<EditorButton>` is NOT `<Button>`, even though they share the underlying `.ac-btn-ghost` class. Counting them together drew real anger. Same lesson likely applies to `<FooterNewsletter>` vs `<Newsletter>`, `<CartPanel>` vs `<CartDrawer>` — never conflate atoms unless they're literally the same component.
- **Ghost ramp landed at fg-04 / fg-08** after iteration. 04/16 was too aggressive on hover. 04/12 was the in-between. 04/08 matches QtyControl which the user explicitly named as the reference. Don't propose ghost as 04/16 again for this codebase.
- **`hello@another-creation.xyz` is the Proton catch-all + default address** (per AGENT-CONTEXT). `yr@another-creation.xyz` is a separate identity that may route to the same mailbox via catch-all — but conceptually it's the founder/owner alias. Likely candidates for keeping yr@ as an internal/sensitive email and hello@ as the public-facing one. The footer change reflects that lineage.
- **Tailwind v4 layer cascade memory was load-bearing twice today** — once when I shipped the forms.css reset (wrapped in `@layer base` so utilities win), once when I hit the unlayered `:focus-visible` rule and had to use inline style because nothing in layer-land could beat it.
- **3 new backlog placeholders (7 / 8 / 9 — animations / loader? / brand+press)** are speculative future items, not blocked. They have no scope yet — when user revisits, treat as fresh.
