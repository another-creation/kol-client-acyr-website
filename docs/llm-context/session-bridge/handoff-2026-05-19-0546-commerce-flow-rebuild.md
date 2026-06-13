# Handoff — 2026-05-19 05:46

## Goal of the current arc

Commerce flow end-to-end overhaul: PDP → Drawer → Checkout treated as one system, not three pages polished separately. Major surfaces shipped this session (drawer replaces `/cart` page, checkout retired its view-flipper, PDP went full-bleed). Next arc: verify live (currently dev-only, PayPal 404s under Vite), then turn to listing pages (`/shop`, `/handmade`) which haven't been aligned to the new shape, then the rest of the polish backlog.

## Last actions taken (causal trail, newest first)

- Qty number badge dropped from the thumbnail overlay; qty moved inline on the meta line (`Size: One size · Qty: 2`) — readable at body size, no overlay.
- Aside row gap bumped `gap-4` → `gap-5`, name's `pt-1` so it doesn't kiss the top of the row, Size line `mt-1` → `mt-2`. Qty badge font went up `ac-helper-xxs` → `ac-helper-xs` but then got removed entirely.
- All `ac-helper-xxs` in the aside bumped to `ac-helper-xs` (10 → 12px) to read closer to the left-side `ac-mono-14`.
- Paypal preamble ("Paid securely through PayPal…") moved BELOW the PayPal buttons, not above.
- Shipping status display rewritten from inline `<div className="border…">` to `<Input variant="outline" size="lg" disabled>` — uses a real component variant. Different status states fold into a single string value.
- Delivery (country) pulled out of the 2nd section into its own section. Now 5 top-level sections: Contact, Delivery (country), Address (name/street/postcode/phone), Shipping, Payment.
- PropertyInput extended with `children` slot + `labelClassName` + `size` + `placeholder` props. Used for Country Dropdown (children slot with `labelClassName="ac-helper-xxs uppercase text-emphasis mb-2"` and label "Delivery" — replaced the old SectionHeading).
- Address fields (First/Last/Street/Postcode/City/Phone) wrapped in PropertyInput with `size="lg"`. Dropdown's hardcoded 140px inline `width` bypassed via `className="w-full"` escape hatch already built into the component.
- Input atom `lg` retuned to 36px tall: `ac-control-lg` padding `8px 20px` → `8px 16px`; `SIZE_TYPE.lg` `ac-mono-16` → `ac-mono-14`; `heightCls.lg` `h-[22px]` → `h-[18px]`. Math: 18 + 8+8 + 1+1 = 36. Matches Dropdown lg metrics exactly.
- Checkout right-column aside repositioned: `lg:fixed lg:right-0 lg:top-0 lg:h-dvh lg:w-[480px] lg:z-[60]`. Covers the nav. `bg-surface-secondary` (no border-l) separates it visually. Left section gets `lg:pr-[480px]` to make room. No `vw` anywhere — user explicitly rejected vw.
- Checkout left-form column wrapped in `lg:h-dvh lg:flex lg:flex-col justify-center` so content centers vertically. Inner form is `w-[680px] max-w-full mx-auto flex flex-col gap-8` (width fixed, centered).
- Checkout single-page redesign: dropped `step`/`states`/`StepHeader`/`StepCollapsed`. All sections now flow vertically. Shipping rate auto-fetches on delivery completion (600ms debounce). PayPal buttons always rendered, `opacity-50 pointer-events-none` until `email && delivery && shipping`.
- Aside item rows use `<Divider />` placed INSIDE `px-8` wrappers (inset 32px each side) instead of `border-b` going edge-to-edge.
- PDP went full-bleed: dropped `max-w-6xl`. `grid lg:grid-cols-[3fr_2fr]` (60/40). Image left sticky `100dvh`. Info right with `560px` reading cap. Breadcrumb pattern. Add-to-bag full-width with inline price. View-cart button retired.
- Cart drawer (`CartDrawer.jsx`) replaces the `/cart` page AND the prior `CartAddedModal`. Auto-opens on `addItem`. Slides in from right. Body scroll locked while open. `CartContext` swapped one-shot `lastAdded` modal-trigger for persistent `isOpen` drawer state.
- `/blog` → `/journal` rename: 3 page files renamed, App.jsx routes, all internal `<Link>` refs, seo-metadata keys + prefix matches, meta-resolver Tier 1 prefixes, sitemap.xml, and `vercel.json` 301 redirects (`/blog` and `/blog/:path*`). `BlogBody.jsx` (Portable Text renderer) kept as-is since it's shared with CollectionDetail.
- `<h1>` for Checkout switched from inline `text-[64px] leading-[68px]` + inline `fontFamily` → DS class `ac-sans-heading-02` (32/40) per user calling out that I'd been hardcoding instead of using the typography classes.

## Current state / open decision points

- **PayPal opacity in dev is a known artifact** of `/api/printful/shipping-rates` 404ing under Vite. User accepted this. Real test is `vercel dev` or preview deploy.
- **Listing pages (`/shop`, `/handmade`) are untouched** in this commerce-flow rebuild. They're the entry to PDP; visually they don't match the new full-bleed PDP shape yet. Polish backlog work but unprioritized.
- **PropertyInput is now the canonical labeled-form-control primitive.** Anything new should use it. The `children` slot extension means it can host any control, not just Input/Stepper. Don't reach for inline `<label>` + `<input>` patterns anymore.
- **Per-instance inline styles got called out repeatedly** — initial Checkout title was hardcoded font-size + inline fontFamily; user wanted DS class. Watch the temptation to reach for `text-[Npx]` arbitrary values when a DS class exists (`ac-sans-heading-N`, `ac-helper-N`, `ac-prose-*`).
- **Newsletter checkbox `accentColor` is inline-styled** as the only per-instance form-element customization. The proper fix is the repo-wide form-element chrome reset (backlog item).
- **Form column uses `flex flex-col justify-center` on the outer** to vertically center within `lg:min-h-dvh`. Works because content height ≈ viewport height; if the form grows much taller it'll need different vertical behavior.
- **Checkout aside has `pb-4`** to lift the bottom content off the viewport edge. Tweakable.
- **Backlog section 1 (Polish — Cart/commerce) is now fully ✅.** Backlog item 17 (`/blog` rename) is ✅. Section 6c (Vercel CNAME swap) was ✅ earlier this session. 6e (Cloudflare Tunnel) is back-noted in 6c's footnote rather than as its own item.

## Next intended action

1. **`vercel dev` or push to preview** and confirm:
   - shipping-rate fetch resolves
   - PayPal buttons go full opacity
   - capture → confirmation works
2. If listings stand out visually against the new PDP, do `/shop` + `/handmade` next. Both currently use the older container-based layout. Reasonable target: card grid full-bleed, hover preview, same aspect ratio as PDP first image.
3. If listings look fine, drop down into the remaining Polish backlog (items 2 / 3 / 4).

## Working memory not yet in AGENT-CONTEXT

- `Dropdown` has a built-in escape hatch: if `className.includes('w-full')` it skips the JS-driven inline `width: 140px / minWidth: 140px` style block. That's how the country dropdown got to fill its grid column. Useful to know for any future Dropdown placement in a grid/flex container.
- `Input` atom uses `.ac-control` + variant + size classes from `packages/ds/components/atoms.css`. The shell chrome (border, radius, bg, padding, transition, disabled state) all comes from CSS; Input.jsx owns prefix/suffix layout + the inner `<input>` height.
- After the lg-padding change, the textarea variant inside `.ac-control--textarea.ac-control-lg > textarea` was also updated to `8px 16px` for consistency. Other consumers of textarea lg (if any) will see this change.
- `bg-fg-04` was the right inline fill to match Input chrome before swapping to `.ac-control--filled` properly. The user pushed back on inline-fill approaches multiple times this session — DS class composition is the standard.
- Body scroll lock on drawer open: `document.body.style.overflow = 'hidden'` in CartDrawer's useEffect, restored on close. Same pattern works for any future overlay.
- The Checkout aside lives in the form's grid section but is positioned `lg:fixed` — meaning it removes itself from flow. The `lg:pr-[480px]` on the section creates the gutter so form text doesn't slide under the aside.
- Order of children in fixed aside vs flow form on mobile: at < lg breakpoint, aside falls back to normal block flow (no `fixed`), so it stacks below the form. Acceptable on small screens.
- `ac-helper-xxs` = 10px; `ac-helper-xs` = 12px; `ac-helper-s` = 14px. From `packages/ds/tokens/brand-typography.css`.
- Heading sizes from `packages/ds/tokens/typography.css`: `--ac-text-heading-01: 48px` (scales up via @media — 56px tablet, 64px desktop). Using `ac-sans-heading-02` for Checkout title gives 32/40 (smaller, less hero-y).
- The session burned context fast on visual back-and-forth. Future similar work should propose architecture first, then iterate within a known shape — not the other way around.
