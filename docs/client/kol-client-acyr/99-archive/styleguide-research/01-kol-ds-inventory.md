---
title: KOL DS inventory (kol-client-ac)
date: 2026-05-16
status: archived
type: reference
---

# KOL DS inventory

What the KOL Design System contains in `kol-client-ac` today. Source of truth for the planned styleguide fold-in.

Source repo: `/Users/kolkrabbi/dev/projects/kol-client-ac`. All paths in this doc are relative to that root.

---

## CSS layer

Eleven `kol-*.css` files. Ten in `src/styles/`, one in `src/components/framework/`. The framework one is layered separately — see import order below.

| File | Role | Token families / class families | LOC |
|---|---|---|---|
| `src/styles/kol-theme.css` | Entry point. `@import`s the other 8 style files in cascade order. Owns the theme-wide spacing / radius / shadow / transition / z-index / opacity scales. | `--kol-spacing-{1..24}`, `--kol-radius-{none..full}`, `--kol-shadow-{sm..xl,inner}`, `--kol-transition-{fast,base,slow,spring}`, `--kol-z-{base..nav}`, `--kol-opacity-{hover,disabled,subtle,loading}` | 105 |
| `src/styles/kol-color.css` | Brand-neutral color surface tier. Light/dark/system-preference modes. Surface inverse re-declares fg ramp for contrast-flip. | `--kol-color-absolute-{white,black}`, `--kol-surface-{primary,secondary,tertiary,inverse}` + `-on-*`, `--kol-accent-{primary,on-primary,primary-strong}`, `--ui-{error,warning,info,success}`, `--kol-border-{default,focus}`, `--kol-focus-ring`. Utility classes: `.bg-surface-*`, `.elevation-{base,raised,elevated}`, `.text-{auto,inverse}`, `.bg-{auto,fg}`, `.border-{auto,surface,surface-08,surface-16}`, `.divider-auto`, focus + hover + absolute color classes. Registers `--color-ui-*` via `@theme`. | 311 |
| `src/styles/kol-opacity.css` | 14-stop fg-opacity ramp × 2 tiers (standard, inverse) × 3 properties (bg, text, border) × hover variants. Plus a 14-stop absolute (theme-independent black) ramp for bg-fg-absolute-*. Semantic descriptors (subtle/meta/body/strong/emphasis) alias into the numeric ramp. | `--kol-fg-{01..96}`, `--kol-fg-inverse-{01..96}`, `--kol-fg-absolute-{01..96}`, `--kol-fg-{subtle,meta,body,strong,emphasis}`. Class families: `.bg-fg-*`, `.text-fg-*`, `.border-fg-*`, all inverse + hover variants, `.text-{subtle,meta,body,strong,emphasis}` + hover. | 369 |
| `src/styles/kol-typography.css` | Right Grotesk @font-face declarations (29 cuts across 8 families: base, Compact, Tall, Wide, Narrow, Spatial, Tight, Text). Type-scale tokens. Atomic display/heading/body classes. `.kol-prose` rich-text container + sub-elements. Registers Tailwind `--font-{display,text,serif,narrow}`. | `--kol-font-family-{sans,sans-narrow,sans-compact}`, `--kol-text-{display-01..03,heading-01..06,body-01..03}`. Class families: `.kol-sans-{display,heading,body}-NN`, `.kol-prose`, `.kol-prose-{label,display,display-md,title,lede,tagline}`, prose h1-h6, p, ul/ol, em/strong, code/pre, blockquote. | 617 |
| `src/styles/kol-typography-mono.css` | JetBrains Mono @font-face (4 cuts: 400, 500, 500i, 600). Two mono scales at shared px stops. Registers Tailwind `--font-mono`. | `--kol-font-family-mono`. Classes: `.kol-mono-{8,10,12,14,16,20}` (body, weight 400) and `.kol-helper-{8,10,12,14,16,20}` (labels, weight 500, letter-spaced). | 177 |
| `src/styles/kol-utilities.css` | Generic helper classes — narrow curated slice. | `.flex-center`, `.absolute-center`, `.text-balance`, `.breakpoint-padding`, `.sr-only`, `.fullbleed`, `.text-trim`, `.hide-number-spinners`. | 92 |
| `src/styles/kol-components-atoms.css` | Atom-tier component chrome. `.kol-control` shell primitive (filled/ghost/outline variants × sm/md/lg sizes), Button (5 variants × 3 sizes), Toggle Switch, Toggle Checkbox, Label scales, SideNav primitives (hop/link/group), page section divider. | `.kol-control{,--filled,--ghost,--outline,--textarea,-sm/md/lg}`, `.kol-btn{,-primary,-secondary,-accent,-outline,-ghost,-quiet,-animate,-sm/md/lg}`, `.kol-icon-{swap-container,default,hover}`, `.toggle-switch{,--plain,-label,-indicator}`, `.toggle-checkbox{,-indicator,-label}`, `.toggle-bracket--active`, `.kol-label{,-compact,-compact-{md,lg},-mono-{xs,sm,md}}`, `.kol-sidenav-{group,hop,hop-icon,hop-label,link}`, `.kol-page-section-divider`, `.kol-textarea-resize-icon`. | 709 |
| `src/styles/kol-components-molecules.css` | Molecule-tier chrome. Popover/Tooltip panels and pill family (inverse/subtle/outline + sm/md/lg). Badges (8 variants × 3 sizes). | `.kol-popover`, `.kol-tooltip{,-key}`, `.pill-{outline,subtle,inverse,sm,md,lg}`, `.kol-badge{,-default,-secondary,-destructive,-outline,-success,-warning,-critical,-info,-sm,-md,-lg}`. | 255 |
| `src/styles/kol-components-organisms.css` | Organism-tier chrome. Table (default + simple variant) with structural classes + cell classes + inline-content classes. | `.kol-table{,-wrapper,-thead,-row}`, `.kol-table-cell-{title,text,meta,meta-strong}`, `.kol-table-{meta,meta-strong,pair,pill,pill-light,pill-muted,pill-dark,token}`, `.kol-table--simple`. | 220 |
| `src/styles/kol-site.css` | Marketing-site (`/site/*`) section chrome. Intro reveal, feature panel, marquee, anchor, sig, gallery, testimonial, faq. GSAP-animated landing section CSS. | `.site-intro{,-bg,-veil,-mark,-word}`, `.site-mark-{halo,wipe}`, `.site-{feature,marquee,anchor,sig,gallery,testimonial,faq}-*`, `.site-pullline-*`, `.site-scroll-cue`, `.site-word-char`. | 1020 |
| `src/components/framework/kol-framework.css` | Styleguide-portal chrome. Sidenav grid + responsive cascade, page scaffold, asset figure/grid, mood tile, swatch + ramp, type sample, prose extensions, fullscreen overlay, embla carousel, asset carousel, brand logo, type spec, exit preview, portal footer, back link, code block, reveal, combo lab. | `:root { --kol-topnav-h, --kol-sidenav-w{,-collapsed}, --kol-container-max, --kol-t-btn, --kol-pad-{page,section,band}-{x,y} }`. Class families: `.kol-{brand-layout,sidenav,page,page-hero,page--fullbleed,grid,grid--tight-y,asset-figure-frame,asset-grid-*col,mood-tile-*,swatch,swatch-chip,swatch-meta,ramp-chips,type-sample,prose-{indented,pullout},overlay,overlay-{sheet,close},embla{,-viewport,-container,-slide,-controls,-btn},asset-{carousel,card,card-frame,card-overlay},website-preview,brand-logo,logomark,type-spec-sample,exit-preview*,portal-footer,back-link,codeblock{,-lang,-copy},combo-*}`, `[data-reveal]`, `::selection`. | 1211 |

**Total CSS: 5,086 LOC across 11 files.**

---

## index.css import order

`src/index.css` is the actual app-load entry. Order matters — later imports override earlier at equal specificity.

```css
@import "tailwindcss";                                      /* 1. Tailwind v4 preflight + utility engine */
@import "./styles/kol-theme.css";                           /* 2. DS theme bundle (color → opacity → typography → utilities → atoms → molecules → organisms) */
@import "./brand/kol-brand-color.css";                      /* 3. Brand layer — Kolkrabbi identity overrides --kol-accent + ramps. Layers ON TOP of kol-color.css. */
@import "./components/framework/kol-framework.css";         /* 4. Portal chrome — depends on DS tokens + brand */
@import "./styles/kol-site.css";                            /* 5. Marketing-site chrome (.site-*) */

@theme {
  /* App-level Tailwind contract: surfaces brand role tokens (--brand-primary etc.)
     as Tailwind color utilities (bg-brand-primary, text-brand-secondary, etc.) */
  --color-brand-primary:        var(--brand-primary);
  --color-brand-primary-on:     var(--brand-primary-on);
  --color-brand-secondary:      var(--brand-secondary);
  --color-brand-secondary-on:   var(--brand-secondary-on);
  --color-brand-accent:         var(--kol-accent);
  --color-brand-accent-primary: var(--kol-accent-primary);
}

:root { scrollbar-gutter: stable; }                         /* Reserve scrollbar gutter so 100vw fullbleed doesn't horizontal-scroll */
```

`kol-theme.css` itself bundles the DS stack in this internal order:
`kol-color` → `kol-opacity` → `kol-typography` → `kol-typography-mono` → `kol-utilities` → `kol-components-atoms` → `kol-components-molecules` → `kol-components-organisms`.

---

## Framework chrome (styleguide-specific)

Lives in `src/components/framework/`. These exist to render the brand portal — sidenav navigation, brand documentation hero, etc. Not used on the marketing site.

| File | Purpose |
|---|---|
| `BrandLayout.jsx` | Outer shell for all `/styleguide`, `/reference`, `/acyr`, `/gallery`, `/editor` routes. Sidenav grid + mobile drawer hamburger + GeneratorLibraryProvider + ModalProvider wrapping. |
| `SideNav.jsx` | Brand portal sidebar — scroll-spy + section anchors + collapsed/expanded states + theme toggle + Kolkrabbi footer. Reads from `sidebars.config.js`. |
| `sidebars.config.js` | `NAV_TREE` for the portal sidebar — Home/Styleguide/Gallery/Another Creation/Reference/Editor/Live site, with nested sections per page. |
| `BrandHero.jsx` | Page-top hero for portal pages — label + title + lede + optional mark slot. Uses `.kol-page-hero` + `.kol-prose-*` typography. |
| `SubPageHero.jsx` | Inner-page hero with back link — for sub-routes under a portal page. |
| `PageSection.jsx` | Generic `<section>` with optional header (label/title/body) + optional divider + optional `fullbleed` modifier. Uses `.kol-page` + `.kol-page-section`. |
| `PortalFooter.jsx` | Centered Kolkrabbi wordmark + favicon link + year. Used at the bottom of portal pages. |
| `ThemeToggle.jsx` | Light/dark theme toggle. Three variants (icon / hop / hop-bare). Persists to localStorage under `kol-theme`. |
| `kol-framework.css` | (See CSS table.) The CSS that backs everything above. |

## Framework chrome (generic, used by live site too)

| File | Purpose |
|---|---|
| `Layout.jsx` | App-root layout. Outlet shell + ScrollToTop + conditional ExitPreview for `/site/*` routes. Wraps both BrandLayout and SiteLayout. |
| `ScrollToTop.jsx` | Router-aware scroll handler — scrolls to top on path change, or to hash anchor if present. |

---

## Primitives

`src/components/primitives/`. Behavior wrappers that compose with DS atoms.

| File | Role | Key props / API |
|---|---|---|
| `Accordion.jsx` | Collapsible panel group. Composition-based — `<Accordion>` wraps `<AccordionPanel>` children. Controlled or uncontrolled per panel. | `<AccordionPanel title meta defaultOpen open onToggle>` |
| `AssetPlaceholder.jsx` | Deliberate "missing asset" tile. Outlined frame with category/name labels — surfaces missing resources instead of broken-image icons. | `{ category, name, aspectRatio, note, className }` |
| `Carousel.jsx` | Embla carousel wrapper. Renders viewport + container + slides + prev/next controls. | `{ children, options }` (embla options object) |
| `CodeBlock.jsx` | Code block with optional language label + copy-to-clipboard button. | `{ children, language }` |
| `ExitPreview.jsx` | Floating `×` link in bottom-left to return from `/site` preview to `/`. Used by Layout when on a `/site` route. | (no props) |
| `FullscreenOverlay.jsx` | Modal overlay with backdrop click + Esc dismiss + scroll lock. Generic wrapper for fullscreen content. | `{ open, onClose, children }` |
| `Image.jsx` | `<img>` wrapper with onError → AssetPlaceholder fallback. Aspect-ratio preserved. | `{ src, alt, category, name, aspectRatio, loading }` |

---

## Atoms

`src/components/atoms/`. Twelve atoms. Most build on `.kol-control` shell (Input, Stepper, Textarea) or `.kol-btn` (Button).

| File | Role |
|---|---|
| `Avatar.jsx` | Initials-bearing circle. sm/md/lg/xl sizes. |
| `Button.jsx` | Unified button — link or button element, 5 variants (primary/secondary/accent/outline/ghost), 3 sizes, icon-left/right/only, icon hover-swap, quiet modifier. Built on `.kol-btn`. |
| `ColorSwatch.jsx` | Fixed-size color chip. Interactive (button) or static (span), with selected state, halo variant, transparent-X overlay for null/unset slots. |
| `Divider.jsx` | Horizontal or vertical line. Opacity scale (01..96) maps to `bg-fg-NN`. |
| `Input.jsx` | Single-line text input on `.kol-control` shell. filled/ghost/outline variants × sm/md/lg sizes. Prefix/suffix slots. |
| `Label.jsx` | Minimal form label — `<label htmlFor>` with `text-fg-48` default. |
| `Slider.jsx` | Range slider + editable value readout. default/subtle variants. Exposes `--kol-slider-track` CSS var. |
| `Stepper.jsx` | Number input + chevron buttons. Built on `.kol-control--filled`. Sm/md/lg. |
| `Textarea.jsx` | Multi-line text input on `.kol-control--textarea` shell. Controlled or uncontrolled. Decorative resize-corner icon. |
| `ToggleCheckbox.jsx` | Custom checkbox shape with sliding checkmark indicator. |
| `ToggleSwitch.jsx` | Pill toggle with sliding indicator. default/plain variants. |
| `TransparentX.jsx` | Diagonal stroke overlay for transparent/disabled slots. warning/error/info/success tones (`--ui-*`). |

---

## Molecules

`src/components/molecules/`. Seventeen molecules.

| File | Role |
|---|---|
| `Badge.jsx` | Status pill. 8 variants × 3 sizes via `.kol-badge-*`. |
| `ContentFilters.jsx` | Universal filter shell for content grids — expandable filter panel + tags + search + ViewToggle. Used by Shop/Collections/Specimens/Typefaces. |
| `Dropdown.jsx` | Single-select value picker built on Popover + MenuItem. Responsive sizing. default/minimal/subtle variants. |
| `DropdownTagFilter.jsx` | Multi-select chip-style filter. All-selected default; click to deselect; "Deselect All" affordance. |
| `LabeledControl.jsx` | Generic label + control body slot. Stacked (default) or inline layout. |
| `MenuItem.jsx` | Action-menu trigger + popover panel. `MenuDropdownItem` child for individual actions. Built on `usePopover`. |
| `Modal.jsx` | Promise-based prompt/confirm dialogs. `useModal()` hook returns `prompt(title, default)` → string\|null and `confirm(title)` → boolean. Portaled to body via `ModalProvider`. |
| `Pill.jsx` | Pill label. outline/subtle/inverse variants × sm/md/lg sizes (`pill-*` classes). |
| `Popover.jsx` | Anchored floating-element primitive on `@floating-ui/react`. Exports `usePopover` hook + `PopoverPanel` component with FloatingPortal + FloatingFocusManager. Hover / click / focus / dismiss / role config. |
| `PropertyInput.jsx` | Stacked label + Input or Stepper. For inspector panels — `type="number"` → Stepper, else → Input. |
| `QuantityInput.jsx` | Shop-style quantity picker. Responsive sizing. |
| `QuantityStepper.jsx` | Pill-shaped −/+ counter. Responsive sizing. |
| `SectionLabel.jsx` | Animated section heading with arrow-downright icon swap on hover. sm/md/lg sizes. |
| `SegmentedToggle.jsx` | N-way joined segmented control. Active uses bg-surface-secondary; dividers via border-l. md (26px) / sm (16px) sizes. |
| `Tag.jsx` | Pill-shaped tag with optional click. default / inverse variants. |
| `ToggleBracket.jsx` | Text-pair toggle: `Label [STATE]`. default (filled shell with active accent) / plain (bare text) variants. |
| `ViewToggle.jsx` | View-mode switcher. text (segmented) / icon (chip row) / single (binary) variants. |

---

## Organisms

`src/components/organisms/`. One organism.

| File | Role |
|---|---|
| `Table.jsx` | Data table. Columns array drives headers + cell renderers. default (bordered, column dividers, header bg) or simple (borderless) variant. |

---

## Hooks

`src/components/hooks/`. Three hooks.

| File | Purpose |
|---|---|
| `usePageTitle.js` | Sets `document.title` to `${title} · ${BRAND.name}`. Reads BRAND from `src/brand/config.js`. |
| `useReveal.js` | IntersectionObserver — adds `.is-revealed` to `[data-reveal]` elements when they scroll into view. Pairs with `[data-reveal]` CSS in kol-framework.css. |
| `useScrollSpy.js` | Tracks active section id from a list of ids. Edge-locks (top/bottom of page). Used by SideNav for in-page anchor highlighting. |

---

## Tailwind integration

Tailwind v4 via `@tailwindcss/vite` (no `tailwind.config.js`). Configuration happens entirely in CSS via `@theme` blocks.

| Source | Tokens exposed to Tailwind |
|---|---|
| `kol-color.css` (line 305) | `--color-ui-{error,warning,info,success}` → `bg-ui-error`, `text-ui-warning`, etc. |
| `kol-typography.css` (line 611) | `--font-{display,text,serif,narrow}` → `font-display`, `font-narrow`, etc. |
| `kol-typography-mono.css` (line 175) | `--font-mono` → `font-mono`. |
| `src/index.css` (line 17) | `--color-brand-{primary,primary-on,secondary,secondary-on,accent,accent-primary}` — brand role tokens lifted into Tailwind utilities (`bg-brand-primary`, `text-brand-secondary-on`, etc.). |
| `src/brand/kol-brand-color.css` | Brand ramps + cream ramp also registered (not inspected for this inventory — out of scope). |

Vite plugin stack (`vite.config.js`): `react()`, `svgr()`, `tailwindcss()`, custom `photoIndexPlugin`. No PostCSS / Tailwind config files. Whole DS is CSS-first.

---

## Sized summary

| Surface | Files | LOC |
|---|---:|---:|
| CSS (DS + framework + site) | 11 | 5,086 |
| Atoms | 12 | 868 |
| Molecules | 17 | 2,094 |
| Organisms | 1 | 46 |
| Primitives | 7 | 253 |
| Framework | 11 (9 jsx, 1 js, 1 css) | 1,856 (640 jsx/js + 1,211 css + 5 from layout) |
| Hooks | 3 | 92 |
| **Total** | **62** | **~10,300** |

JSX/JS subtotal (no CSS): 3,901 LOC across 50 files.

Biggest files:
- `kol-framework.css` — 1,211
- `kol-site.css` — 1,020
- `kol-components-atoms.css` — 709
- `kol-typography.css` — 617
- `kol-opacity.css` — 369
- `kol-color.css` — 311
- `kol-components-molecules.css` — 255
- `ContentFilters.jsx` — 263
- `DropdownTagFilter.jsx` — 253
- `Dropdown.jsx` — 223
- `kol-components-organisms.css` — 220
- `SideNav.jsx` — 208
- `Popover.jsx` — 208

---

## Observations

- **The styleguide is the engine, not a sidecar.** `BrandLayout` wraps not just `/styleguide` but every portal route (`/reference`, `/acyr`, `/gallery`, `/editor`). Merging into the live-site repo means deciding whether the fold-in retains the portal layout for non-`/site` routes or absorbs only the DS primitives and leaves portal chrome behind. The CSS that backs the portal (`kol-framework.css`, 1,211 lines) is a significant chunk that has zero use on the marketing site.

- **`kol-site.css` is already the marketing-site layer.** 1,020 lines of `.site-*` chrome with intro reveals, marquees, feature sections — heavily GSAP-animated landing-page typography. If the merge target is the live site, this file is the boundary: everything to the left of `kol-site.css` in the cascade is what needs to come along; this file may already exist (or its successor) in `kol-acyr-website`. Worth diffing both before assuming.

- **Two parallel typography systems live side by side and they're load-bearing.** `kol-typography.css` ships 29 Right Grotesk @font-face declarations across 8 family widths (display/Compact/Tall/Wide/Narrow/Spatial/Tight/Text). All of `/fonts/Right-Grotesk/*.woff2` must come along. `kol-typography-mono.css` adds 4 JetBrains Mono cuts from `/fonts/jetbrains-mono/`. Both font folders sit under `public/` and weren't enumerated here — confirm asset paths before the merge.

- **Brand layer is the seam.** `src/brand/kol-brand-color.css` overrides `--kol-accent-*` and registers brand-specific Tailwind tokens. Per the cascade comment in `index.css`, this file loads AFTER `kol-color.css` and BEFORE `kol-framework.css` — that ordering matters for both override-correctness AND for whether the framework picks up brand or DS-neutral defaults. Any merge plan needs to preserve this three-tier sandwich: DS → brand → framework.

- **The opacity system is huge and the canonical primitive.** `kol-opacity.css` is 369 lines defining ~250 utility classes. The note about `.text-fg-*` having "594 references" in kol-color.css is the key signal — this isn't a token system you can swap out, every JSX consumer uses these classes inline. The fold-in must keep `bg-fg-*` / `text-fg-*` / `border-fg-*` + hover + inverse variants intact byte-for-byte.

- **Tailwind v4 with zero config file.** All `@theme` registration is in CSS. The merge target needs to already be on Tailwind v4 (the `kol-acyr-website` should be checked) or the CSS-first contracts won't resolve. No `tailwind.config.js` to migrate — but `@theme` blocks are scattered across kol-color, kol-typography, kol-typography-mono, kol-brand-color, and index.css. Consolidating these into a single `@theme` block during the merge would be a quality win, not a requirement.
