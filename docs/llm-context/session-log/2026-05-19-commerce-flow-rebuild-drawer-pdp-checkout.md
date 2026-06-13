# Session: Commerce flow rebuild — Cart drawer + PDP full-bleed + Checkout single-page + Journal rename

**Date:** 2026-05-19
**Agent:** Grim (Claude Opus 4.7, 1M context)
**Summary:** End-to-end commerce flow rebuilt: `/blog` → `/journal` with 301 redirect. PDP full-bleed split (60/40 image/info). Cart page deleted; replaced by slide-in `CartDrawer` (auto-opens on Add, dismissable, body scroll locked). Checkout redesigned from multi-step view-flipper into single-page two-column (form left, fixed right sidebar with `lg:fixed lg:z-[60]` overlapping nav). PropertyInput extended with `children` slot + `labelClassName` + `size` + `placeholder` prop forwarding. Input atom `lg` variant retuned (8/16 padding, ac-mono-14, 36px tall — matches Dropdown lg).

## Changes Made

### Files Modified

- **`apps/website/src/App.jsx`** — `/blog/*` routes renamed to `/journal/*`; `/cart` route + import removed.
- **`apps/website/src/pages/site/Blog.jsx` → `Journal.jsx`**, `BlogArticle.jsx` → `JournalArticle.jsx`, `BlogAuthor.jsx` → `JournalAuthor.jsx` — file renames, component names, 8 internal `<Link to="/blog/...">` references updated.
- **`apps/website/src/components/site/SiteLayout.jsx`** — Cart icon swapped from `<Link to="/cart">` to `<button onClick={openCart}>`. Footer + `<CartDrawer>` skipped on `/checkout/*` so the fixed aside can extend over the nav unobstructed. Nav stays visible on /checkout; aside has `z-[60]` to overlap it per user's call.
- **`apps/website/src/components/site/CartContext.jsx`** — replaced one-shot `lastAdded` modal pattern with `isOpen` drawer state + `openCart/closeCart/toggleCart`. `addItem` auto-opens drawer.
- **`apps/website/src/components/site/CartDrawer.jsx`** — NEW. Slide-in from right (480px, dimmed backdrop), Esc + click-outside + X dismiss, body scroll locked while open. Inline `QtyControl` with minus-→-trash icon swap on hover at qty=1. Drawer is the sole cart surface (replaces both the prior `/cart` page and the added-to-cart modal).
- **`apps/website/src/pages/site/Cart.jsx`** — DELETED.
- **`apps/website/src/components/site/CartAddedModal.jsx`** — DELETED.
- **`apps/website/src/pages/site/ProductDetail.jsx`** — full rewrite. Old `max-w-6xl` centered box → `grid lg:grid-cols-[3fr_2fr]` full-bleed split. Left = image (sticky, `100dvh`, aspect-square on mobile). Right = info column with 560px reading cap. Breadcrumb pattern (`Shop / Product Name`) replaces back link. `Add to bag` button full-width with inline price. `View cart` button retired (drawer auto-opens on add). Click-handler unchanged.
- **`apps/website/src/pages/site/Checkout.jsx`** — major rewrite. Multi-step `StepHeader`/`StepCollapsed` view-flipper retired (`step` state + `states` object gone). Now single-page form: Contact + Delivery (country) + Address fields + Shipping (auto-rate, Input outline variant readout) + Payment all flow vertically on the left in 5 sections. Title is `h1` with `ac-sans-heading-02` (32/40). Right column is fixed `lg:fixed lg:right-0 lg:top-0 lg:h-dvh lg:w-[480px] lg:z-[60]` covering the nav, `bg-surface-secondary`, drawer-style item list + totals + Secure-checkout-via-PayPal footnote. Dividers in aside use `<Divider />` placed inside `px-8` so they inset from the column edges. Shipping rate auto-fetches on delivery completion (600ms debounce). PayPal buttons always visible, `opacity-50 pointer-events-none` until ready.
- **`apps/website/api/_lib/meta-resolver.mjs`** — `/blog/author/` + `/blog/` prefix matching → `/journal/*`.
- **`apps/website/src/data/seo-metadata.js`** — `/blog` static-meta key → `/journal`; `OG_BLOG` constant renamed `OG_JOURNAL`; lookup prefix paths updated.
- **`apps/website/public/sitemap.xml`** — `/blog` → `/journal`.
- **`apps/website/vercel.json`** — added 301 redirects: `/blog` → `/journal` + `/blog/:path*` → `/journal/:path*`.
- **`apps/website/src/components/atoms/Input.jsx`** — `SIZE_TYPE.lg`: `ac-mono-16` → `ac-mono-14`. `heightCls.lg`: `h-[22px]` → `h-[18px]`. Net: lg input renders 36px tall (18 line-height + 8+8 padding + 1+1 border) — matches Dropdown lg.
- **`packages/ds/components/atoms.css`** — `.ac-control-lg` padding: `8px 20px` → `8px 16px` (matches Dropdown horizontal metrics). Textarea lg padding mirrored.
- **`apps/website/src/components/molecules/PropertyInput.jsx`** — extended with `children` slot (renders custom controls like Dropdown under the same Label wrapper), `labelClassName` override prop (default `ac-helper-10 text-fg-48`), `size` prop forwarded to Input (`sm`/`md`/`lg`), `placeholder` prop forwarded to Input. Backward-compatible — old `number`/`text` type fallbacks still work.

### Backlog updates

- **`docs/backlog.md`**:
  - 1a–c (cart row polish: thumb 1:1, shipping*, minus→trash) → ✅
  - 1b NEW (cart drawer replaces page + modal) → ✅
  - 1c (hide footer on /checkout) → ✅
  - 1d (1600px container) → ✅
  - 1e (min-h-dvh) → ✅
  - 1f (checkout single-page redesign) → ✅
  - 1g (PDP full-bleed split 60/40) → ✅
  - 3e (unified row component — shape parity achieved, primitive extraction deferred) → ✅
  - 17 (journal vs /blog URL rename) → ✅

### Features Added/Removed

- **Added.** `/journal` route with 301 redirect from `/blog`. Full-bleed PDP (60/40 image/info, sticky image, breadcrumb). Slide-in `CartDrawer` auto-opening on add-to-cart. Single-page two-column checkout. Fixed-position checkout aside that covers nav (`z-[60]`). PropertyInput accepts custom controls via `children` slot. Dropdown variant="subtle" + escape-hatch `className="w-full"` to bypass its inline 140px lock-width.
- **Removed.** `/cart` page route + `Cart.jsx`. `CartAddedModal.jsx`. Old multi-step Checkout (`step` state, `StepHeader`, `StepCollapsed`). PayPal preamble copy moved below the buttons (was above). `<section>` wrapper around delivery items (delivery country now its own section). Bordered status box on Shipping (replaced with Input outline variant via PropertyInput).

## Current State

### Working

- PDP → Add to bag → drawer slides in from right → Checkout → single-page form → PayPal capture → /checkout/confirmation. Full path tested in dev (UI-level), the API legs still need `vercel dev` or preview to actually fire.
- Drawer is the sole cart surface — cart icon in nav opens it; Add auto-opens it.
- Checkout's right-column aside is fixed and edge-to-edge, covers nav via `z-[60]`, sticks across scroll. Uses `bg-surface-secondary` for visual separation (no border-l).
- Input.jsx + Dropdown.jsx both render 36px tall at `size="lg"` with matching `ac-mono-14` type and `padding 8/16`.
- PropertyInput is the single labeled-form-control primitive — handles Input, Stepper, or arbitrary children (Dropdown via children slot).

### Known Issues

- **PayPal buttons render at `opacity-50`** in dev because `/api/printful/shipping-rates` 404s under Vite (no serverless). Resolves only via `vercel dev` or Vercel preview deploy.
- **"Could not calculate shipping"** error in dev — same root cause. Documented behavior.
- **Inline-style flashes during this session** caught repeatedly by user — initial Checkout h1 was hardcoded `text-[64px] leading-[68px]` + inline `fontFamily`. Now using DS class `ac-sans-heading-02`. Watch for similar inline-style temptation elsewhere; DS class always preferred.
- **`<input type="checkbox">` accent** styled via inline `style={{ accentColor: 'var(--brand-primary)' }}` on the newsletter checkbox — works but per-instance. Repo-wide form-element reset (backlog 12 — formerly 19) would handle this globally.

## Next Steps

1. **Test the live checkout flow** via `vercel dev` or a Vercel preview push — confirm shipping rate auto-fetch, PayPal buttons resolve to full opacity, capture + confirmation flow runs end-to-end.
2. **Listing pages (`/shop`, `/handmade`)** — still untouched. They're the entry to PDP and aren't yet aligned with the new full-bleed shape.
3. **Polish backlog** — section 1 is now fully ✅; items in sections 2 (Tokens & theme), 3 (Components), 4 (Page chrome & copy) still queued.
4. **Form-element chrome reset (backlog 5)** — repo-wide global form reset to handle accent-color + native input chrome consistently. Would absorb the per-instance accent style on the newsletter checkbox.
