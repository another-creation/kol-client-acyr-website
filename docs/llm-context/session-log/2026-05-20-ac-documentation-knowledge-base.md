# Session: ac-documentation knowledge base + cheat sheets

**Date:** 2026-05-20
**Agent:** Grim (Claude Opus 4.7, 1M context)
**Summary:** Built a 25-file CSS knowledge base at `docs/ac-documentation/` covering every CSS file in `packages/ds/` and the four app-tier CSS files, with two high-density cheat sheets at the front (typography + color) that catalog every text class and every color token in the repo.

## Changes Made

### Files Added

**`docs/ac-documentation/` (new pillar, 25 files total)**

- `INDEX.md` — pillar entry. Five-tier model, "Tailwind-first + DS-first" rules, links to cheat sheets first then sections.
- `00-typography-cheatsheet.md` — every text class in 9 tables. Sans display/heading/body/nav, mono body scale (`.ac-mono-N`), mono helper scale (`.ac-helper-N`), legacy t-shirt helpers, prose family (7 classes), clamp-driven label scale (5 classes + aliases), Tailwind `font-*` utilities. Quick-map + "do not" list.
- `00-color-cheatsheet.md` — every color token in 16 tables. All four ramps with exact hex (burgundy/cream/grey 10-stop/magenta), brand roles, accent rebind, surfaces (light + dark mode hex), UI state (light value + light-explicit-attribute value), border/focus tokens, absolute white/black, full 14-stop foreground opacity tables for standard / inverse / absolute tiers including `bg-fg-NN` / `text-fg-NN` / `border-fg-NN` / hover variants, text-role descriptor classes. Quick-map + "do not" list.
- `01-cascade.md` — canonical reference for the 13-import order in `packages/ds/index.css`. Tier responsibilities, what overrides what, what breaks if reordered (table of symptoms), `@theme` contract.
- `02-tokens/INDEX.md` + 7 reference docs — `01-theme`, `02-color`, `03-opacity`, `04-typography`, `05-typography-mono`, `06-brand-color`, `07-brand-typography`. Each lists every variable + class defined in the source file, gotchas, when-to-edit guidance.
- `03-utilities/INDEX.md` + `01-utilities` + `02-typography-helpers`.
- `04-components/INDEX.md` + `01-atoms` + `02-molecules` + `03-organisms`. Documents `.ac-control`, `.ac-btn` + every variant, toggles, sliders, sidenav primitives, label scale, pills, tags, badges, table. Includes the `rounded-full!` cascade-tie gotcha.
- `05-framework.md` — page scaffold, sidenav three modes (full / rail / drawer at responsive breakpoints), `.ac-page`, `.ac-grid`, `.ac-overlay`, Embla chrome, exit-preview, code block.
- `06-app-layers/INDEX.md` + 4 reference docs — `01-site` (website marketing chrome), `02-design-foundations` (styleguide demos), `03-editor` (editor shell), `04-color-panel` (self-contained color picker). Each includes an "Audit — observed smells" section flagging single-consumer CSS that reinvents DS classes, duplicate rule blocks, hardcoded fonts.
- `07-finding-the-right-class.md` — decision tree. "You need to style X → here's where to look." Common needs (kicker, heading, button, surface, dimmed text, brand color) mapped to existing classes. 30-second check before writing CSS.

### Files Modified

- `docs/ac-documentation/INDEX.md` — added "Cheat sheets — start here" section above the main sections table, surfacing the two `00-` cheat sheets as the primary entry point.

### Features Added/Removed

- **Knowledge base for the entire CSS surface of the repo.** Every class in `packages/ds/` (tokens, utilities, components, framework) + the four app-tier CSS files (`apps/website/src/styles/site.css`, `apps/styleguide/src/styles/design-foundations.css`, `apps/styleguide/src/editor/styles/editor.css`, `apps/styleguide/src/editor/color/color-panel.css`) is now catalogued with class signature, variants, sizes, use cases, and cross-references.
- **Two cheat sheets at the front.** Pure-text tables. Designed for scan-and-grab — an agent (or human) opens these before writing any CSS and finds the existing class in seconds. Filenames use `00-` prefix so they sort above everything else in catalog order.
- **Audit findings logged** in each app-layer doc. Specific smells flagged: duplicate `.site-anchor-link--client` rule block; dead Testimonial/FAQ breadcrumb comments in `site.css`; single-consumer kickers (`.site-anchor-link-num`, `.site-gallery-card-kicker`, `.site-marquee-kicker`) that reinvent `.ac-helper-12 uppercase`; hardcoded font families (`'Right Grotesk Wide'`, `'Right Grotesk Compact'`) bypassing the DS tokens; `.ac-combo-randomize` as bespoke button outside the `.ac-btn` family; `.ac-prose-*` wrapper rules in `design-foundations.css` that may be dead post-migration to DS typography. All read-only — flagged, not fixed.

## Current State

### Working

- All 25 docs follow kol-docs framework conventions: explicit-with-display wikilinks (`[[NN-name|name]]`), framework-conformant frontmatter (`title`, `type`, `status`, `updated`, `tags`, `aliases`, `related`), `NN-` filename prefix on every doc except `INDEX.md`.
- Token-cheatsheet hex values verified against source files (`packages/ds/tokens/color.css` and `brand-color.css`).
- Cross-references between docs are dense — every reference doc links back to `INDEX`, the `cascade`, the cheat sheets, the relevant sibling docs.
- Audit findings in each app-layer file's "Audit — observed smells" section name the specific blocks that fail Tailwind-first / DS-first / single-consumer tests.

### Known Issues

- **Recon agents reported some sizes from memory of typography.css.** The size column in the typography cheat sheet (display + heading responsive ranges) was sourced from the recon agent, not directly re-verified from typography.css. If the responsive breakpoints turn out to differ from the documented 768/1280, the typography cheat sheet rows need a sweep.
- **Inverse tier `--ac-fg-inverse-NN`** has classes generated for stop variants (`.bg-fg-inverse-NN` etc.); not every consumer is aware both the standard ramp redeclaration (inside `.bg-surface-inverse`) AND the inverse tier exist as separate mechanisms. The color cheat sheet notes "most code uses the standard tier even on dark surfaces — the redeclaration handles it" — worth verifying that's still the right guidance.
- **`.ac-fg-absolute-NN`** has only `bg-fg-absolute-NN` background classes generated, not text/border. Documented as such in the cheat sheet but worth confirming with a grep — if `text-fg-absolute-NN` is needed and doesn't exist, that's a class-generation gap to add to opacity.css.
- **The audit smells are logged, not actioned.** Specific cleanups (duplicate `.site-anchor-link--client`, dead Testimonial/FAQ breadcrumb comments, single-consumer kicker classes that should be `.ac-helper-N`) are documented but the source CSS files are unchanged. Cleanup is its own task.

## Next Steps

1. **Smoke-test discoverability.** Next time an agent reaches for a new CSS block, see if it actually opens `00-typography-cheatsheet.md` / `00-color-cheatsheet.md` first. If not, the cheat sheets need to be referenced from CLAUDE.md or AGENT-CONTEXT.md so agents find them on init.
2. **Act on `site.css` audit findings.** Specifically: remove the duplicate `.site-anchor-link--client` rule block, delete the dead Testimonial/FAQ breadcrumb comments at lines 527–529, and migrate single-consumer kicker classes to `.ac-helper-N uppercase` inline.
3. **DS hygiene pass: `.ac-btn` cascade ordering.** Move `.ac-btn` (and atoms.css more broadly) into `@layer components` so Tailwind utilities beat it on specificity ties. Removes the `rounded-full!` workaround documented across multiple cheat sheet entries.
4. **Migrate status badge hex literals to tokens.** `.ac-badge-destructive/-success/-warning/-critical/-info` use literal `#ef4444` / `#22c55e` etc. — should reference `--ui-error/-success/-warning/-info` from `color.css`.
5. **Add `font-compact` Tailwind utility.** Currently Compact cut is only reachable via `.ac-sans-heading-03..06` classes. Adding `--font-compact` to the `@theme` block in `typography.css` exposes it as a Tailwind utility.
