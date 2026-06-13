# kol-acyr-website — backlog

Status legend: ▢ open · 🚧 blocked

Context + rationale in `backlog-notes.md` (anchored per item). Closed items snapshotted at `backlog-archive/2026-05-19.md`.



---



# Quick view


1. POLISH - Cart / commerce (8)
   - ✅ a. Cart row polish (thumb 1:1, shipping*, minus→trash at qty 1)
   - ✅ b. Cart drawer (replaces `/cart` page + added-to-cart modal)
   - ✅ c. Hide footer on `/checkout/*`
   - ✅ d. Container width → 1600px on checkout
   - ✅ e. `min-h-dvh` on `/checkout`
   - ✅ f. Checkout single-page redesign
   - ✅ g. PDP full-bleed split (image left half-viewport, info right with reading cap)
   - ✅ h. Unify cart asides — `<CartPanel>` + row/totals primitives, drawer + checkout aside share one shell

2. POLISH - Tokens & theme (3)
   - ✅ a. FOUC / theme flash on first paint
   - ✅ b. Dark-mode burgundy accent contrast
   - ✅ c. accent-burgundy-brighter

3. POLISH - Components (5)
   - ✅ a. Button variant adjustment
   - ✅ b. Icon audit (inline SVG → Icon loader)
   - ✅ c. Table copy syntax (Markdown / `kbd`)
   - ✅ d. Newsletter home card + footer strip
   - ✅ e. Unified row component — shape parity achieved (extraction deferred)
  
4. POLISH - Page chrome & copy (5)
   - ✅ a. Logo SVG in navbar
   - ✅ b. Font page card missing `href` — closed as outdated (referent could not be located)
   - ✅ c. Standardise hero treatment across pages — `<PageHero>` extraction, 16 consumers
   - ✅ d. Home page text-style inconsistencies — addressed by site-typography role layer
   - ✅ e. Copy scan — star-trek-ipsum sweep

5. GLOBAL FEATURE (2)
   - ✅ a. Form-element chrome reset
   - ✅ b. Cmd+K search

6. PROVIDERS (4)
   - a. Plausible + GSC + Bing (roadmap drafted)
   - ✅ b. SEO provider decision (closed by 6a)
   - ✅ c. Vercel CNAME swap
   - d. Newsletter provider-side template

7. animations
8. loader?
9. brand+press https://brand.vettvangur.is/ https://good-fella.com/ https://375.studio/

https://demos.gsap.com/demo/directional-marquee/
https://demos.gsap.com/demo/scrubbed-bento-gallery/

https://demos.gsap.com/demo/horizontal-text/
https://demos.gsap.com/demo/horizontal-scrolling-gallery/
https://demos.gsap.com/demo/infinite-looped-panels/

---

 can we use smoothscroll on home? 
https://codepen.io/GreenSock/pen/KKXZOyZ



---




# Full list

## 1. POLISH — Cart / commerce (8)
- ✅ a. Cart row polish (1:1 thumb, shipping asterisk, minus-to-trash at qty 1) — shipped 2026-05-19. Carried into the drawer when the `/cart` page was replaced.
- ✅ b. **Cart drawer replaces `/cart` page + added-to-cart modal.** Shipped 2026-05-19. `CartDrawer.jsx` slide-in from right, mounted in `SiteLayout`. Auto-opens on `addItem`. Cart icon in nav opens the drawer instead of navigating. `/cart` route deleted; `Cart.jsx` + `CartAddedModal.jsx` deleted. Drawer = sole cart surface, both confirmation feedback and full cart view. Non-blocking: backdrop dimmed but page still visible, click outside / Esc / X dismiss. Body scroll locked while open.
- ✅ c. Hide footer on `/checkout/*` — shipped 2026-05-19 (`/cart` no longer exists)
- ✅ d. Container width → `max-w-[1600px]` on checkout — shipped 2026-05-19
- ✅ e. `min-h-dvh` on `/checkout` — shipped 2026-05-19
- ✅ f. Checkout single-page redesign — shipped 2026-05-19. Multi-step view-flipper retired (`StepHeader`/`StepCollapsed` gone, `step` state gone). Now single-page: Contact / Delivery / Shipping / Payment all flow vertically on the left; sticky summary on the right (lg:sticky lg:top-20). Shipping rate auto-fetches on delivery completion (600ms debounce). PayPal buttons always visible, disabled-with-helper-text until `email + delivery + shipping` all ready.
- ✅ g. **PDP full-bleed split.** Shipped 2026-05-19. Old `max-w-6xl` centered box retired. Now full-viewport `grid lg:grid-cols-2`: image fills the left half (sticky, `100dvh` tall), info column right with 560px internal reading cap. Breadcrumb pattern (`Shop / Product Name`) at top of info column replaces the standalone "Back to shop" link. Add-to-bag button is full-width of the info column and surfaces the unit price inline. "View cart" button retired (drawer auto-opens on add).
- ✅ h. **Unify cart asides** — shipped 2026-05-21. `apps/website/src/components/site/CartSummary.jsx` now exports `<CartPanel>` (outer shell — bg / border / header bar / scrollable list / footer scaffold) + `<CartRow>` (80px thumb + name + meta + qty slot + line price) + `<CartTotalsRow>` + `<QtyControl>`. `CartDrawer.jsx` wraps `<CartPanel>` in its overlay backdrop; `Checkout.jsx` aside uses `<CartPanel>` directly. Drawer-only differences (close ×, empty-bag JSX, Checkout CTA + Continue link) flow through slot props. Visible aside deltas: `bg-surface-secondary` → `bg-surface-primary`; `px-8` → `px-6`; `<Divider>` instances dropped in favour of `border-b/-t`; checkout aside gained interactive qty + 80px thumbs. OrderConfirmation rows not yet migrated to `<CartRow>` — low-priority follow-up.

## 2. POLISH — Tokens & theme (3)
- ✅ a. FOUC / theme flash on first paint — shipped 2026-05-20. Pre-paint theme `<script>` in `<head>` + inline anti-flash `<style>` painting `#121215`/`#FAFAFA` from frame 0 + font preload + body cloak `opacity 0 → 1` on `Promise.race([document.fonts.ready, 400ms])`. Also fixed silent theme persistence bug (`ThemeToggle.getInitialTheme()` was reading the HTML attribute instead of localStorage).
- ✅ b. Dark-mode burgundy accent contrast
- ✅ c. accent-burgundy-brighter — brighter burgundy accent stop

## 3. POLISH — Components (5)
- ✅ a. Button variant adjustment — shipped 2026-05-22. Primary + secondary rewired to mirror each other on raw greys. Primary = grey-900 fill / grey-100 text / grey-500 hover (always-dark, theme-invariant); secondary = grey-100 fill / grey-900 text / grey-300 hover (always-light, theme-invariant). 4-stop mirror symmetry on hover. No more theme-flipping behavior on primary.
- ✅ b. Icon audit (inline SVG → Icon loader) — shipped 2026-05-22. 5 inline-SVG sites in `apps/website/src`; 3 migrated to `<Icon name="..." size={N} />`: `QuantityInput.jsx` (chevron-up + chevron-down), `DropdownTagFilter.jsx` (chevron-down, rotate kept via `style` prop), `CodeBlock.jsx` (check + copy). 2 intentionally inline: `ToggleCheckbox.jsx` (bespoke 12×9 checkmark polyline inside a styled indicator — not a standalone icon) and `TransparentX.jsx` (decorative marker, stretches to parent via `preserveAspectRatio="none"` + `vectorEffect="non-scaling-stroke"`). Styleguide app intentionally out of scope.
- ✅ c. Table copy syntax (Markdown / `kbd`) — shipped 2026-05-22. `Table.jsx` in styleguide attaches a `copy` event listener to the wrapper that intercepts cell selection and writes GitHub-flavored markdown to `clipboardData` (`| h1 | h2 |\n| --- | --- |\n| c1 | c2 |`). `<code>` / `<kbd>` content wraps in backticks; `<a>` becomes `[text](href)`. `text/html` cleared so paste-into-Notion/Slack/etc. uses the markdown rather than the styled table HTML.
- ✅ d. Newsletter home card + footer strip — shipped across 2026-05-22 arcs. Home card: forced `data-theme="light"` (required scoped `[data-theme="light"]` rule in DS color.css), `<Input variant="filled" size="lg">`, signup `Button variant="primary"` (loud dark CTA). FooterNewsletter: atom-skip closed (raw `<input>` → `<Input variant="outline" size="md">`), copy aligned ("Newsletter" eyebrow + "Early access to new releases and atelier notes." body). New `layout="stack"` mode for use inside `<Footer variant="lead">` first column (vertical eyebrow+body+form, `max-w-[360px]` on the form row, 24px mb under the form). Default `layout="strip"` keeps the original horizontal full-width strip behavior. Footer Sign Up stays `variant="secondary"` (quiet against chrome) — deliberate register difference vs the Home card's primary.
- ✅ e. Unified row component — shape parity achieved 2026-05-19 (cart row + gallery list row both 1:1 thumb + name/meta column + trailing action). Primitive extraction deferred until a 3rd consumer surfaces.

## 4. POLISH — Page chrome & copy (5)
- ✅ a. Logo SVG in navbar — `<KolLogo variant="wordmark" height={14}>` swapped in for the text wordmark via SiteLayout
- ✅ b. Font page card missing `href` — closed 2026-05-22 as outdated. Referent could not be located: no card titled "Font" on the website; styleguide typography section is an anchored `<PageSection id="typography">`, not a card. Likely refers to a since-deleted surface.
- ✅ c. Standardise hero treatment across pages — shipped 2026-05-21. `<PageHero>` at `apps/website/src/components/site/PageHero.jsx` with granular variant API (`variant` / `eyebrowVariant` / `sublineKind`). 16 consumers (Home / About / Journal / Collections / Shop / Handmade / Privacy / Terms / ShippingReturns / Brand / Press / JournalAuthor / JournalArticle / CollectionDetail / ProductDetail / OrderConfirmation / Contact / Checkout-empty). Subline `marginTop` inline styles baked into the component via `gap-2` (tagline) / `gap-4` (lede).
- ✅ d. Home page text-style inconsistencies — addressed by the site-typography role layer (shipped 2026-05-21). `Home.jsx` now uses `<PageHero eyebrowVariant="display">` + component-level sections (Marquee / Collection / LookbookCarousel / DesignerVision / SupportCTA / HandmadeCard / Newsletter / FAQ). No raw `text-[Npx]` or inline-style typography in the file.
- ✅ e. Copy scan — star-trek-ipsum sweep. Shipped 2026-05-22. Two remaining hits in `Home.jsx` cleared: `usePageTitle` lost "the federation bridge platform" suffix (now just `BRAND.name`); Testimonial kicker `Stardate 2026` → `2026`. Codebase grep across `apps/website/src/` for star-trek terms returns zero hits.

## 5. GLOBAL FEATURE (2)
- ✅ a. **Form-element chrome reset — repo-wide.** Shipped 2026-05-22 (genuinely — earlier ✅ mark was premature). `packages/ds/utilities/forms.css` wraps the reset in `@layer base` so Tailwind utilities + atom class selectors override cleanly per the v4 cascade rule. Strips: `appearance`, `background`, `border`, `outline`, `box-shadow`, `border-radius` on `input`/`textarea`/`select`; Chrome autofill yellow bg (1000px-inset-shadow trick + `-webkit-text-fill-color: currentColor`); UA search-field × + magnifier decorations; native number-input spinner. `::placeholder` set to `fg-48` opacity 1. Imported in `packages/ds/index.css` between `utilities.css` and `typography-helpers.css`.
- ✅ b. **Cmd+K search.** `CmdKSearch.jsx` (website src, generic shell) + per-app wrappers. Website (`WebsiteSearch.jsx`): static routes + all products + Sanity articles + collections (lazy-loaded). Styleguide (`StyleguideSearch.jsx`, imports CmdKSearch via `@components` alias): pages from NAV_TREE + section anchors + every color token + every typography class (walks BRAND_COLORS_SECTIONS + TYPOGRAPHY_SECTIONS row-by-row). Cmd/Ctrl+K toggle global; search-icon trigger in topnav (website) + SideNav hop (styleguide). Keyboard nav + Esc close. Editor included as a single page entry only — no editor-internal indexing.

## 6. PROVIDERS (4)
- ▢ a. **Metrics — Plausible + GSC + Bing.** Pivot from self-hosted Umami → Plausible €9/mo. Step-by-step roadmap in [notes](backlog-notes.md#6a). User executes tomorrow.
- ✅ b. **SEO provider decision** — closed by 6a: GSC + Bing only, paid tools (Ahrefs/Semrush) deferred until traffic 10×. → [notes](backlog-notes.md#6a)
- ✅ c. **Vercel CNAME swap.** Shipped 2026-05-19. `www` → `935d02e1d1d61ccc.vercel-dns-017.com`, `studio` → its target, `brand` → `50ffd8912e3515d8.vercel-dns-017.com`. (Note: `brand` stays red as Invalid Configuration because Cloudflare Access needs proxy ON, which conflicts with Vercel's CNAME validation. Site still serves — purely cosmetic. Canonical fix would be a Cloudflare Tunnel; not worth the infra for one private URL.)
- ▢ d. **Newsletter — provider-side template.** Visual template in MailerLite — masthead, layout, footer signature. Copy guidance in `docs/client/kol-client-acyr/02-brand/07-newsletter-template.md`. Gated on first issue being hand-authored.

## 7. BLOCKED (7)
- 🚧 a. **Custom domain handoff.** Cloudflare move + Proton credential swap. Gated on client Cloudflare account. → [notes](backlog-notes.md#7a)
- 🚧 b. **Sanity CMS handoff.** Project transfer + migration-script token revoke. Gated on client Sanity org / engagement end. → [notes](backlog-notes.md#7b)
- 🚧 c. **Multi-image + color variants.** Gated on real client Printful store (current `acyr-test` is placeholder). Scope in [notes](backlog-notes.md#7c).
- 🚧 d. **Newsletter unsubscribe + custom tracking domain.** `clicks.another-creation.xyz` to bypass uBlock/Pi-hole. Gated on MailerLite Paid plan. → [notes](backlog-notes.md#7d)
- 🚧 e. **Newsletter client list handover.** Separate MailerLite project or user-management transfer. Gated on engagement transition.
- 🚧 f. **`.xyz` deliverability watch.** First sandbox send landed Junk; post-domain-auth landed inbox. Revisit TLD swap if recovery stalls after 30 days. → [notes](backlog-notes.md#7f)
- 🚧 g. **Gallery video assets.** Gated on client media.
