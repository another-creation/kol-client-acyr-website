---
title: Typography inventory
type: audit
status: active
updated: 2026-05-21
description: Snapshot of every typography class used across apps/website/src — DS classes, arbitrary text-[N] escapes, tracking/leading overrides, inline-style escape hatches. Identifies the gaps where the DS scale didn't fit and proposes a mechanical cleanup queue.
audience: agency-internal
tags:
  - project/acyr
  - domain/website
  - domain/typography
  - domain/audit
sources:
  - apps/website/src/**/*.{jsx,js}
  - apps/website/src/styles/site.css
  - packages/ds/tokens/typography.css
  - packages/ds/tokens/typography-mono.css
  - packages/ds/tokens/brand-typography.css
  - packages/ds/utilities/typography-helpers.css
related:
  - "[[INDEX|style audit index]]"
  - "[[02-structural-duplication|structural duplication]]"
  - "[[03-regional-alignment|regional alignment]]"
---

# Pass 1 — Typography inventory

Scope: every typography-bearing class in `apps/website/src/**`, including:

- DS classes: `.ac-sans-*`, `.ac-helper-*`, `.ac-mono-*`, `.ac-label-*`, `.ac-prose*`
- Tailwind arbitrary values: `text-[N]`, `tracking-[N]`, `leading-[N]`
- Tailwind type ramp: `text-{xs..9xl}`
- Tailwind weight utilities: `font-{thin..black}`
- Inline `style={{ fontSize, lineHeight }}` escapes

## 1. DS class usage — current

What's actually used in JSX (whole-site count):

| Class | Hits | DS spec |
|---|---|---|
| `ac-prose-label` | 61 | Mono 12 · 500 · 16lh · 0.10em · uppercase · fg-48. Section eyebrow / kicker. |
| `ac-prose` | 31 | Sans 16 · 300 · 24lh · 0.02em · fg-80. Editorial body wrapper. |
| `ac-helper-xxs` | 30 | Mono 10 · 500 · 1lh · 0.10em — *t-shirt scale*. |
| `ac-helper-xs` | 30 | Mono 12 · 500 · 1lh · 0.06em — *t-shirt scale*. |
| `ac-helper-12` | 19 | Mono 12 · 500 · 1lh · 0.06em — *numeric scale*. |
| `ac-prose-display-md` | 18 | Narrow 64 · 500 · 68lh · -0.01em. Sub-hero. |
| `ac-sans-nav` | 14 | Narrow 12 · 500 · 1lh · 0.08em · uppercase. Nav + footer link chrome. |
| `ac-mono-12` | 14 | Mono 12 · 400 · 16lh. Mono body / values. |
| `ac-prose-tagline` | 11 | Narrow 14 · 500 · 16lh · 0.14em · uppercase · fg-64. Editorial subtitle. |
| `ac-prose-lede` | 9 | Compact 24 · 400 · 28lh · 0.02em. Editorial lede. |
| `ac-mono-14` | 8 | Mono 14 · 400 · 18lh. |
| `ac-prose-display` | 7 | Narrow 80 · 500 · 80lh · -0.01em. Editorial hero. |
| `ac-helper-10` | 6 | Mono 10 · 500 · 1lh · 0.10em — *numeric scale*. |
| `ac-sans-heading-02` | 4 | Narrow 40 (56/64 desktop) · 500 · 110lh. H2. |
| `ac-mono-16` | 3 | Mono 16 · 400 · 22lh. |
| `ac-helper-14` | 3 | Mono 14 · 500 · 1lh · 0.06em — *numeric scale*. |
| `ac-sans-heading-06` | 2 | Compact 16 · 500 · 125lh. H6. Used as section heading on `Collection`. |
| `ac-helper-20` | 2 | Mono 20 · 500 · 1lh · 0.06em — *numeric scale*. **One of two consumers misuses it (see §6.4).** |
| `ac-sans-heading-05` | 1 | Compact 20 · 500 · 125lh. |
| `ac-sans-heading-03` | 1 | Compact 32 · 500 · 120lh. |
| `ac-sans-display-01` | 1 | Narrow 56 (80/96 desktop) · 600 · 100lh. |
| `ac-sans-body-01` | 1 | Sans 16 · 400 · 160lh. |
| `ac-prose-title` | 1 | Narrow 56 · 500 · 60lh · -0.01em. |
| `ac-label-compact-md` | 1 | (component label class) |
| `ac-label-compact-lg` | 1 | (component label class) |
| `ac-helper-s` | 1 | Mono 14 · 500 · 1lh · 0.06em — *t-shirt scale*. |
| `ac-helper-16` | 1 | Mono 16 · 500 · 1lh · 0.06em — *numeric scale*. |

## 2. Arbitrary `text-[N]` escapes

Eleven total. Each is the diagnostic: it's the place a consumer reached past the DS scale.

| Value | Where | What it's doing | Verdict |
|---|---|---|---|
| `text-[clamp(56px,8vw,96px)]` | `pages/site/Home.jsx:35` (hero h1) | Responsive display, clamped | **Redundant** — `.ac-sans-display-01` clamps 56 → 80 → 96px on the same breakpoints. Replace. |
| `text-[clamp(32px,4.5vw,64px)]` | `components/site/Testimonial.jsx:6` (blockquote) | Responsive blockquote pull | **Gap** — no DS class spans that range. Add `.ac-prose-blockquote` or use `.ac-prose-display-md` (64px) with a clamp variant. |
| `text-[64px]` | `components/site/SignupOverlay.jsx:90` (h2 with `!` override) | Want h2's narrow/uppercase 500 at 64px | **Redundant** — `.ac-sans-display-02` is exactly 44 / 56 / 64px at the standard breakpoints. Replace, drop the `!`. |
| `text-[22px]` | `components/site/Marquee.jsx:18` (item label) | One-off 22px sans-medium for marquee items | **Gap or collapse** — DS has 20 and 24 nearby. Either collapse to 20 or 24, or document as a marquee-tier value. |
| `text-[20px]` × 3 | `SupportCTA.jsx:12`, `DesignerVision.jsx:18 + 24` | Body lede at 20px / lh 28px / weight 400 (or 300 italic on one variant) | **Gap** — no DS class for "20px sans-base body-lede". `.ac-sans-body-01` is 16, `.ac-prose-lede` is 24/Compact. Add `.ac-sans-body-lede` or `.ac-prose-body-lede`. |
| `text-[18px]` | `components/primitives/Accordion.jsx:40` (chevron glyph) | Icon-as-text sizing | **Ignore** — it's a glyph `+`/`−`, not type. Better fix is to swap for an Icon component (already done elsewhere in the site). |
| `text-[16px]` | `components/site/SignupOverlay.jsx:60` (sidelabel) | `.ac-sans-nav` (12px) rescaled to 16px | **DS-acknowledged escape** — `.ac-sans-nav` comment explicitly says "override size via Tailwind `text-[Npx]` for drawer variants". But the two sites doing this (16, 14) could be promoted to a `.ac-sans-nav-{sm,md,lg}` set. |
| `text-[14px]` | `components/site/Nav.jsx:13` (drawer link) | `.ac-sans-nav` rescaled to 14px | Same as above. |
| `text-[13px]` | `components/site/Marquee.jsx:8` (head-note) | 13px sans-base body | **Gap or collapse** — no DS class at 13px sans. Either round to 12 (Mono / `.ac-mono-12`) or 14, or accept it as a one-off. |
| `text-[12px]` × 2 | `components/primitives/AssetPlaceholder.jsx:24-25` | 12px sans-uppercase + 12px sans-meta | **Redundant** — `.ac-helper-12` (mono 12, uppercase via `uppercase` class) covers the note. The label could be `.ac-sans-body-03`. |
| `text-[10px]` × 2 | `components/atoms/ToggleCheckbox.jsx:34`, `ToggleSwitch.jsx:32` | Hint text inside an uppercase tracked label, reset to `normal-case tracking-normal` | **Gap** — there's no "compact lowercase hint inside a label" class. Either add `.ac-form-hint` or restructure the label component to wrap hint in its own untracked span (preferred — keeps text contracts at the call site). |

### 2.1 Tailwind type ramp leakage

Only one consumer touches the Tailwind size ramp (`text-xs/sm/base/3xl`): `components/atoms/Avatar.jsx`. It uses the ramp to size the initial-letter inside a circular avatar at four size variants. Isolated; low priority. Mark as "OK as-is" or migrate to DS classes for parity.

### 2.2 Tailwind weight escapes

Five total. All fine — they're legitimate weight overrides on small spans where the parent class baked in a different weight:

- `font-bold` × 1 (Testimonial blockquote)
- `font-medium` × 2 (Home hero h1, Marquee item)
- `font-semibold` × 1 (Avatar)
- `font-light` × 1 (DesignerVision italic body)

None of these warrant DS additions.

## 3. Letter-spacing override pattern

**Finding:** `tracking-widest` (Tailwind = 0.1em) is the de facto letter-spacing on every helper consumer that needed visible "uppercase wide" — but the DS class `.ac-helper-{12,14,16,20}` defines `letter-spacing: 0.06em`. Consumers override.

15 `tracking-widest` usages across the website, breakdown:

- 8 × `ac-back-link ac-helper-xs uppercase tracking-widest text-body hover:text-emphasis no-underline` — back link on every secondary page (Journal, Privacy, Press, Brand, OrderConfirmation, CollectionDetail, JournalArticle, Terms, ShippingReturns).
- 3 × `ac-helper-12 uppercase tracking-widest text-meta` — NotFound 404 label, About figcaption, Newsletter error alert.
- 2 × `ac-helper-12 uppercase tracking-widest` — Accordion title + meta.
- 2 × `ac-helper-10 uppercase tracking-widest text-meta` — LabeledControl (label + inner label).

The DS class spec at `packages/ds/tokens/typography-mono.css` says `.ac-helper-{12,14,16,20}` = 0.06em, but only `.ac-helper-{8,10}` use 0.10em — meaning the small stops already match `tracking-widest`. The consumers want 0.10em across the board.

**Verdict:** the DS spec is wrong about what consumers want. Two ways to fix:

1. **Update the spec** — change `.ac-helper-{12,14,16,20}` from 0.06em → 0.10em. Then drop `tracking-widest` from every consumer (15 instances). One-shot mechanical sweep.
2. **Split the scale** — keep 0.06em on `.ac-helper-N` (label/value pairs in dense UI, where wider tracking would break the optical match) and add `.ac-helper-N-wide` for the editorial / nav / chrome usage. More classes, more nuance.

Option 1 is simpler and matches every existing consumer in this app. Option 2 only helps if dense data-grid UI surfaces appear later (none in `apps/website/src`).

## 4. Parallel mono-helper scales (t-shirt vs numeric)

Two scales coexist; both in active use; they're literally the same sizes under different names:

| t-shirt (deprecated per header comment) | numeric (current) | px |
|---|---|---|
| `.ac-helper-xxs` (30 hits) | `.ac-helper-10` (6 hits) | 10 |
| `.ac-helper-xs` (30 hits) | `.ac-helper-12` (19 hits) | 12 |
| `.ac-helper-s` (1 hit) | `.ac-helper-14` (3 hits) | 14 |

The header comment in `packages/ds/utilities/typography-helpers.css` already declared the t-shirt scale retired, but no migration sweep ever ran. 61 instances waiting.

**Sweep is mechanical:** find/replace `.ac-helper-xxs` → `.ac-helper-10`, `.ac-helper-xs` → `.ac-helper-12`, `.ac-helper-s` → `.ac-helper-14`. Then delete the t-shirt declarations from `typography-helpers.css`. No visual change.

> Caveat: the t-shirt classes carry a slightly *different* letter-spacing (0.10em on the smaller, 0.06em on `.ac-helper-s`). Numeric stops 10 + 8 already use 0.10em; 12/14/16/20 use 0.06em. If finding #3 lands first (move all numeric stops to 0.10em), this sweep becomes byte-identical at every size. Otherwise, the 0.06em → 0.10em jump on consumers of `.ac-helper-xs` (30 instances → `.ac-helper-12`) would be a regression of the wider-than-intended look. Order matters: do finding #3 first.

## 5. Inline-style escape hatch

**Finding:** `FooterNewsletter.jsx` uses inline `style={{ fontSize, lineHeight }}` to override `.ac-sans-nav` (12px) at three sites:

- L39: `style={{ fontSize: 14, lineHeight: 1.4 }}` on the description copy
- L61: `style={{ fontSize: 13 }}` on the email input
- L76: `style={{ fontSize: 12 }}` on the error alert

`Nav.jsx` similarly mixes inline `style={...}` for `color`/`cursor`/`textDecoration` (mostly because `.ac-site-nav-link` doesn't carry those, but this is more of a side concern).

`SignupOverlay.jsx:60` reaches for `text-[16px]` instead of inline style — same intent, cleaner mechanism.

**Verdict:** zero inline-style typography in the codebase. Replace with Tailwind arbitrary values *or* — better — a `.ac-sans-nav-{sm,md,lg}` set if we accept Nav as a recurring scale.

## 6. Class-level misuses (genuine bugs)

### 6.1 Home hero eyebrow is mono-class force-fit to sans

```jsx
<span className="ac-helper-20 uppercase text-accent-primary"
      style={{ fontSize: 24, fontWeight: 600 }}>
  Another Creation
</span>
```
— `pages/site/Home.jsx:32`

`.ac-helper-20` is mono (JetBrains / Right Grotesk Mono), 20px, 500 weight. The inline override pushes it to 24px and 600 weight — still mono. That's not what the brand register wants for a hero eyebrow. Almost certainly meant to be `.ac-prose-tagline` (Narrow 14 · 500 · 0.14em uppercase fg-64) at a bigger size, OR a new `.ac-display-eyebrow` class (Narrow 20-24 uppercase brand-accent).

### 6.2 SignupOverlay headline force-fits h2 to display

```jsx
<h2 className="ac-sans-heading-02 uppercase text-[64px]!">15% off your first order</h2>
```
— `components/site/SignupOverlay.jsx:90`

The `!` is fighting the cascade because consumer wants the 40px h2 at 64px. That's `.ac-sans-display-02` (44 / 56 / 64px responsive · weight 600 · 100% lh) — exactly the intent. Replace.

### 6.3 HandmadeCard uses `.ac-prose-display` as a card title

```jsx
<h2 className="ac-prose-display text-emphasis uppercase">
  Handmade &amp;<br />tailored<br />to your needs
</h2>
```
— `components/site/HandmadeCard.jsx:19`

`.ac-prose-display` is the editorial *hero* (80px Narrow), used inside a fixed-width 480px overlay on a hero card. That's mixing roles — the card sets `max-w-[480px]` then renders 80px text inside it. Renders OK because of `<br>` breaks. Probably meant `.ac-prose-display-md` (64) or `.ac-sans-display-02` (44-64).

### 6.4 `Collection` heading uses `.ac-sans-heading-06`

```jsx
<h2 className="ac-sans-heading-06 uppercase text-emphasis">Collection</h2>
<span className="ac-sans-heading-06 uppercase text-meta">SS 2026</span>
```
— `components/site/Collection.jsx:10-11`

`.ac-sans-heading-06` is the smallest heading (16px Compact). Used as the page-section heading on the home page. Compare to `Newsletter.jsx:38` which uses `.ac-sans-heading-02` (40px) as its section h2. Two adjacent home-page sections, two completely different heading scales. Either:

- Collection is intentionally a "label-style" heading (then this is fine, but call out the convention).
- Collection is a normal section heading (then promote to `.ac-sans-heading-02` to match Newsletter and FAQ).

This is exactly the kind of regional drift Pass 3 is for.

## 7. Recommendations — prioritised cleanup queue

Three tiers. Each tier is mostly mechanical given the inventory above.

### Tier A — mechanical sweeps (no DS additions)

1. **Sweep t-shirt helper scale → numeric** (61 instances). `ac-helper-xxs` → `ac-helper-10`, `ac-helper-xs` → `ac-helper-12`, `ac-helper-s` → `ac-helper-14`. Then delete the t-shirt declarations from `typography-helpers.css`. **Dependency:** do Tier A.2 first.
2. **Promote `.ac-helper-{12,14,16,20}` letter-spacing 0.06em → 0.10em** in `typography-mono.css`. Then strip `tracking-widest` from 15 consumers. Net result: helper scale carries the wider tracking everyone already wants; consumers get one less class.
3. **Replace Home hero h1's arbitrary clamp with `.ac-sans-display-01`** (`Home.jsx:35`). Identical clamp curve already in the token. Drop the line-height override (or set `leading-none` for the 105% vs 100% nudge if needed).
4. **Replace SignupOverlay h2's `text-[64px]!` with `.ac-sans-display-02`** (`SignupOverlay.jsx:90`). Drop the `!`.
5. **Replace `text-[12px]` × 2 in AssetPlaceholder with `.ac-helper-12` / `.ac-sans-body-03`** (`AssetPlaceholder.jsx:24-25`).
6. **Replace `.ac-prose-display` with `.ac-prose-display-md`** on HandmadeCard h2 (`HandmadeCard.jsx:19`). The 480px overlay can't hold 80px copy cleanly.

### Tier B — add classes the DS is missing

1. **`.ac-sans-body-lede`** — 20px / 1.75 / 400 sans-base. Three consumers waiting (`SupportCTA.jsx:12`, `DesignerVision.jsx:18`, `DesignerVision.jsx:24` italic variant). Add to `packages/ds/tokens/typography.css` body section. The third (italic narrow light) might warrant a separate `.ac-prose-lede-italic` if used more than once.
2. **`.ac-sans-nav-{md,lg}`** — promote the two existing escapes (`text-[14px]` drawer, `text-[16px]` sidelabel) into named stops. Default `.ac-sans-nav` stays 12px. Two new declarations, drop two arbitrary overrides.
3. **`.ac-display-eyebrow`** — Narrow 20-24 uppercase brand-accent. Replaces the mono-misused `.ac-helper-20` + inline override on the Home hero eyebrow. Alternatively, promote `.ac-prose-tagline` to accept a `-lg` variant.
4. **Decide on `.ac-prose-blockquote`** — 32 → 64px clamp for the Testimonial pull. The site already has one consumer; if a second one materialises later, extract.

### Tier C — call-site cleanups

1. **Move ToggleCheckbox / ToggleSwitch hint text out of the label class** — split label and hint into two spans, give hint a `.ac-sans-body-03` (or `.ac-form-hint` if it gets reused). Removes both `text-[10px]` escapes.
2. **Swap inline `style={{ fontSize, lineHeight }}` for class-driven sizes** in `FooterNewsletter.jsx` (3 sites). Either Tailwind arbitrary values or the new `.ac-sans-nav-*` stops from Tier B.2.
3. **Swap Accordion chevron `text-[18px]` for an Icon component** (`Accordion.jsx:40`). Aligns with the FAQ toggle approach.
4. **Decide on Collection h2 register** — promote to `.ac-sans-heading-02` to match Newsletter/FAQ, or formally adopt heading-06 as the "compact label-heading" convention and document it. Don't leave it inconsistent.

### Out of scope for typography pass

- ProductCard hover overlay vs caption-below variants — structural duplication question (Pass 2).
- Footer vs Nav vs Card label register — regional question (Pass 3).
- `.ac-sans-nav` doubling as the de facto "all uppercase small caps" class — partially structural (Pass 2), partially regional (Pass 3).

## Appendix — files surveyed

94 files in `apps/website/src/**/*.{jsx,js}`. Hot spots:

- `pages/site/Home.jsx` — hero, body lede patterns
- `components/site/{Footer,FooterNewsletter,Nav,SignupOverlay,Marquee}.jsx` — nav / chrome register
- `components/site/{Collection,Newsletter,SupportCTA,DesignerVision,HandmadeCard,FAQ,Testimonial}.jsx` — section register
- `components/site/{ProductCard,HandmadeCard,LookbookCarousel}.jsx` — card register
- `components/primitives/{AssetPlaceholder,Accordion,CodeBlock}.jsx` — primitive utility text
- `components/molecules/{LabeledControl,ContentFilters,Pill,Dropdown}.jsx` — UI chrome
- `components/atoms/{Avatar,Stepper,ToggleCheckbox,ToggleSwitch,Input,Button}.jsx` — atom-tier
