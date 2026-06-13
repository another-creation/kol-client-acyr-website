# Handoff — 2026-05-19 14:18

## Goal of the current arc

Three intertwined pushes: (1) Phase A plumbing for multi-color/multi-image variants (Printful sync schema + cart line ID + checkout payload + PDP swatches/gallery — the data layer is done, end-to-end live test still pending), (2) Cmd+K search across both apps, and (3) a sustained DS-conformance audit of the home page that incidentally ended up registering large parts of the brand color system (grey + cream + burgundy + magenta ramps as explicit utility classes, plus a new magenta brand color and accent rebind). Visual work on the home is mostly done but Newsletter + the cream/grey ink interactions still feel like they could shake further as the user reviews.

## Last actions taken (causal trail, newest first)

- `.text-on-inverse` + `.text-on-primary` shortcuts added in `brand-color.css`. Solves the bug where `text-emphasis` inside `.bg-surface-inverse` doesn't flip because `--ac-fg-emphasis` is baked at `:root` and the descriptor tokens aren't redeclared in the inverse cascade block.
- Newsletter heading `text-emphasis` → `text-on-inverse` (user explicitly typed the class name expecting it to exist, so I added it to the DS).
- Newsletter rewrite — full bordered Input atom, Button primary→secondary (per user), heading from `ac-prose-display-md` (64px) → `ac-sans-heading-02` (40px).
- `ac-prose-display-md` heading on SupportCTA wrapped in `data-theme="dark"` to make outline + secondary buttons resolve dark-mode-tokens correctly on the burgundy bg.
- Magenta ramp registered as primitives + @theme exposures + explicit utility classes (`--brand-magenta-100..500` + `.bg-brand-magenta-NN` / `.text-brand-magenta-NN`). `--ac-accent-primary` rebound from burgundy-100 → magenta-200; strong from burgundy-300 → magenta-300; dark-mode override deleted (magenta is theme-neutral).
- Cream + burgundy + grey explicit ramp utility classes added in `brand-color.css` (load after opacity.css so they win the cascade over `text-emphasis` et al).
- `.ac-btn-secondary` rewritten: solid `--grey-100` bg + `--grey-900` text + `--grey-200` hover. Theme-invariant. Was a color-mix-with-transparent that rendered as a glassy panel — the actual "outline button doesn't look right" bug from earlier.
- ProductCard hover-button removed from no-overlay variant (home Collection). overlay=true keeps the single Add to Bag button.
- HandmadeCard `data-theme="dark"` scope (then user simplified). `ac-prose-display text-emphasis uppercase` h2.
- LookbookCarousel arrows extracted to `<CarouselArrow />` molecule in `apps/website/src/components/molecules/`. Chevron icons. Gallery lightbox in styleguide also adopts it via `@components/molecules/CarouselArrow`.
- Marquee plumbed: 8 real client SVGs (svgr `?react`), `fill="black"` → `fill="currentColor"`, hardcoded width/height stripped from `<svg>` tags so viewBox-only scaling works. Seamless loop fixed by moving gap to per-item padding-right (2 copies = exactly 2× one-copy width, `translateX(-50%)` lands clean). GPU compositing hints. Hover opacity-only (0.48 → 1.0 over 700ms).
- 8 new `hm()` entries appended to `shop-data.js` with `featured: true`, using `/brand/photoshoot/*.jpg`. Home Collection block now reads `PRODUCTS.filter(p => p.featured)` instead of fake `ACImages.looks`.
- FeatureSplit retired entirely — 1 abusive consumer (Home.jsx with `!flex max-w-none` override war). Inline centered hero JSX now in Home.jsx; FeatureSplit.jsx (website + styleguide copy) deleted; `.site-feature*` block deleted from site.css.
- IDIOT AUDIT of home components: ProductCard, Collection, SupportCTA, DesignerVision, FooterNewsletter, Newsletter, HandmadeCard. Dropped `const NARROW = "..."`, `const MONO = "..."`, `const TIGHT = "..."` font literals + inline typography blocks. Replaced with `ac-sans-nav` (new DS class — narrow 12/12 medium 0.08em uppercase) + ac-prose-display* + DS color classes.
- Phase A multi-color/multi-image plumbing complete: sync script writes `colors[]`, lookupVariant takes color, cart line ID is triple-key, PDP has color swatches (round, inner radio dot, hex map) + size text-row + gallery thumb strip + variant-aware pricing.
- Cmd+K search shipped in both apps with cross-app Tailwind v4 `@source` directive to scan `apps/website/src/components/**` from the styleguide.

## Current state / open decision points

- **`text-emphasis` inside `.bg-surface-inverse`** is broken because `--ac-fg-emphasis` is baked at `:root`. Workaround in place (`.text-on-inverse`). Real fix is redeclaring `--ac-fg-emphasis` + the other descriptor tokens inside `.bg-surface-inverse`. Worth a follow-up DS pass.
- **`.ac-btn-secondary` lives in atoms.css**, not Button.jsx — user explicitly clarified that "why atoms? why not button component?" was a question, not a refactor ask. Keep CSS-class-driven for now.
- **HMR + symlinked workspace packages.** Tailwind utility-class consumers in symlinked DS files don't always rebuild on HMR. Restart `pnpm --filter website dev` and `pnpm --filter styleguide dev` to pick up `.ac-sans-nav`, `.text-on-inverse`, grey/cream/magenta ramps.
- **End-to-end multi-color commerce test pending.** Data plumbing verified at code level (lookupVariant, line ID, cartPayload). PayPal + Printful round-trip needs `vercel dev` or a preview deploy with a non-trivial multi-color cart (e.g., 1× Heather Clay M + 1× Red XL).
- **Snapback White has no mockup.** User said "don't worry about it, t-shirt is the test case." Will surface again when real client catalog gets synced.
- **Home page section heights mostly set:** Collection grid 110vh, LookbookCarousel section 100vh (py-10), DesignerVision md:h-[120vh]. Newsletter section uses content-sized py-20. SupportCTA py-24. These felt good at last review; if the user dials further it'll be on those four.

## Next intended action

1. User to push to Vercel preview (or `vercel dev` locally) and verify the multi-color cart → PayPal capture → Printful order flow with real sync_variant_ids.
2. If multi-color verified — close backlog 7c. Move to 1h (cart aside primitives) or 3d (newsletter polish, footer variant).
3. The `--ac-fg-emphasis` redeclaration in `.bg-surface-inverse` is a DS hygiene win that removes the workaround class — small, scoped change in `tokens/color.css`.

## Working memory not yet in AGENT-CONTEXT

- **Magenta accent rebind is now system-wide.** Anywhere using `--ac-accent-primary` (testimonial quotes, focus rings, accent button variant, `text-accent-primary`, `bg-accent-primary`) renders magenta. If anyone wants the burgundy accent back, change `--ac-accent-primary: var(--brand-magenta-200)` back to `var(--brand-burgundy-100)` and re-add the dark-mode -strong override.
- **Cream ramp class set** (`.bg-cream-100..500` + `.text-cream-100..500`) plus burgundy + magenta + grey ramps are explicit CSS classes in brand-color.css. They load AFTER opacity.css in the cascade so they win when paired with `.text-emphasis` etc. on the same element.
- **Tailwind v4 `@source` directive** in `apps/styleguide/src/index.css` is what makes utility classes referenced from website-side components (CmdKSearch, CarouselArrow) actually generate when used in the styleguide. Without it the modal renders unstyled.
- **Cart drawer + checkout aside are still two implementations** of the same shape. Extraction plan logged at backlog-notes.md#1h.
- **The home Collection block uses the new `featured: true` flag.** Future curation = toggle the flag in shop-data.js. There are now ~14 handmade items total (8 featured editorial + the 6-ish original handmade entries); shop has POD products with `kind: 'pod'`.
- **CarouselArrow lives at `apps/website/src/components/molecules/`**, not in `packages/ds/`. The DS doesn't yet have a JSX folder — Q2 of the repo-restructure target-state defers that. When JSX moves to `packages/ds/components/jsx/`, CarouselArrow + ProductCard graduate.
- **The clients/ data folder uses svgr `?react` imports.** Pattern mirrors `@ac/brand-data/logos/KolLogo`. If we add more client logos, drop SVGs in `apps/website/src/data/clients/svg/` and add to the CLIENTS array.
- **User's strong preferences (re-confirmed loudly this session):** DS-first ALWAYS; no inline typography overrides; closest DS class even if visual shifts slightly; no `data-theme="dark"` scope hacks for things the page-level theme already handles; no half-assing — when registering a color/class, do BOTH @theme registration AND explicit utility classes.
