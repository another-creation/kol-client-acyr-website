---
title: Writing guidelines — agent reference
version: 1.0.0
date: 2026-05-16
status: active
type: implementation
aliases:
  - agent voice spec
  - copy spec for agents
tags:
  - brand/voice
  - brand/copy
  - agent/reference
related:
  - "[[writing-guidelines]]"
---

# Writing guidelines — agent reference

Granular spec for agents drafting copy on behalf of Another Creation. The source of truth for tone is [[writing-guidelines]]. This doc adds the per-context detail an agent needs to not screw up.

If the brand doc and this doc conflict, the brand doc wins.

---

## Voice anchor (don't drift)

Quiet, deliberate, anti-trend. Specifics over claims. Materials over marketing. The considered phrase over the loud one. The voice doesn't sell — it describes.

Tone test before shipping a paragraph: would Ýr say this out loud in the studio? If no, cut.

---

## Vocabulary — full set

| Favour                | Avoid              | Why                                                       |
|-----------------------|--------------------|-----------------------------------------------------------|
| considered            | curated            | "Considered" describes work; "curated" is decorative      |
| handmade              | luxury             | Method vs marketing word                                  |
| small numbers         | exclusive          | Small is a fact; exclusive is a gate                      |
| made for years        | iconic             | Claimed durability vs claimed status                      |
| material              | premium            | Name the thing; don't grade it                            |
| studio                | atelier (alone)    | Plain over set phrase                                     |
| deliberate            | effortless         | Work is visible; pretending it isn't is dishonest         |
| by hand               | drops / capsule    | Method vs streetwear cadence                              |
| by intention          | limited time       | Maker's pacing, not the calendar's                        |
| Reykjavík             | "Nordic luxury"    | Geography as fact, not identity claim                     |
| made for years        | must-have          | Durability vs manufactured urgency                        |
| in small numbers      | shop now           | Production framing vs clickbait                           |

Also avoid: amazing, incredible, stunning, ultimate, perfect, best, transformative, elevated, sophisticated, timeless (overused), authentic (overused), unique.

---

## House style

### Punctuation

- **Em-dashes** — heavy. Voice signature. Always spaced: ` — `, never flush (`—`).
- **Oxford comma** — yes. `wool, linen, and cotton`.
- **Sentence case** for headings, buttons, navigation.
- **"and"** over **"&"**. Ampersand only inside lockup labels by exception.
- **Curly quotes** in prose. Straight quotes in code / form inputs only.
- **No exclamation points.** None.
- **Terminal periods** only on full sentences. Nav labels, button text, form labels take none.

### Capitalization

- Sentence case for almost everything in UI.
- Uppercase reserved for editorial section labels (`01 — ABOUT`) via `kol-prose-label` class.
- Brand name: `Another Creation` (two words, capital A, capital C). `AC` is internal-notes only.
- Designer: `Ýr Þrastardóttir`. Diacritics always. Never anglicized.
- Place: `Reykjavík`, `Iceland`. Diacritics preserved.
- Materials: lowercase. `wool`, `linen`, `boiled wool`, `cotton`.

---

## Per-context spec

### Product titles

- **Shape:** colour, material, garment. Sentence case.
- **Do:** `Burgundy wool coat`, `Cream linen shirt`, `Black wool trousers`
- **Don't:** `THE COAT — BURGUNDY`, `Iconic Wool Coat (Limited)`, `Must-Have Winter Layer`

### Product descriptions

- **Shape:** 2–4 sentences. Lead with material and construction. End on the use, not the sell.
- **Do:** `Heavy boiled wool, lined in cotton. Cut for layering through winter.`
- **Don't:** Open with adjectives. Promise transformation. Use `effortless`.

### Journal ledes

- **Shape:** Set the subject in one sentence. Em-dash for the sharpener.
- **Do:** `A note on why this coat exists — and why the lining is cotton.`
- **Don't:** Tease. Open with a question. Start with `In a world where…`.

### Navigation labels

- **Shape:** Single word where possible. Sentence case. No icons doing the talking.
- **Do:** `Shop`, `Journal`, `About`, `Contact`
- **Don't:** `Discover`, `Explore`, `Our story`, `Get in touch`

### Button text

- **Shape:** Verb + object, or single verb. No exclamation. No first person.
- **Do:** `Add to bag`, `Continue`, `Read more`, `Email us`
- **Don't:** `Shop now!`, `Click here`, `Discover the collection`, `Take me there`

### Error states

- **Shape:** State what happened. Offer the next step. No mascot energy.
- **Do:** `This size is out of stock.` `Payment didn't go through — try again, or email us.`
- **Don't:** `Oops!`, `Something went wrong :(`, `Whoops — looks like we hit a snag!`

### Page meta titles / descriptions

- **Title shape:** `Page name — Another Creation`. Em-dash, brand last.
- **Description shape:** Factual lede, under 160 chars, no keyword stuffing, no `|` pipes, no `Shop Now`.
- **Do:** `About — Another Creation` / `Founded in Reykjavík in 2013 by Ýr Þrastardóttir. Handmade clothing, made in small numbers.`
- **Don't:** `Another Creation | Premium Icelandic Womenswear | Shop Now`

### OG / social share copy

Same register as the page. The garment carries the share, not the caption. No hashtags, no CTA lines, no emoji.

---

## Examples — before / after

### Designer's vision

**Before:** Ýr is committed to breaking the cycle of overproduction and material waste in the fashion industry. With a deep understanding of the environmental impact of fast fashion, Ýr is driven by the belief that sustainable practices are not only necessary but also achievable without compromising on style or functionality.

**After:** Another Creation works against the cycle of overproduction and material waste that defines mainstream fashion. Each garment is made by hand, in small numbers. The answer to overproduction is to make less, deliberately.

### Heritage paragraph

**Before:** The concept of Another Creation is to make beautiful and functional clothes that empower the independent woman. The Icelandic culture has a long history of strong females throughout the centuries and Another Creation puts the concept into modern times.

**After:** The work draws on a long history of strong, independent women, translating that into modern garments designed for long ownership. Reykjavík is the studio.

### Product description

**Before:** Our iconic burgundy wool coat is the perfect statement piece for the modern woman. Crafted with the finest Italian wool, this premium garment will elevate any wardrobe.

**After:** Burgundy wool coat. Heavy boiled wool, lined in cotton. Cut wide enough for a thick knit underneath. Made in small numbers.

---

## Common drift to watch for

- **Nationalism creep** — "Icelandic lineage", "Nordic identity", "rooted in Iceland" all drift toward identity-as-marketing. Reykjavík = location. Iceland = country of origin label. Neither is an identity claim.
- **Adjective stacks** — `beautifully crafted timeless minimalist` is four adjectives doing no work. Cut to zero or one.
- **Aspirational second person** — `for the woman who…`, `for those who…`. Replace with direct address or third-person fact.
- **Sentence inflation** — "It is not merely a coat, but rather a statement". Cut to "It's a coat."
- **Sustainability buzzwords** — `eco-conscious`, `responsibly sourced`, `mindfully made`. Name the specific practice instead (e.g., "boiled wool from a single mill in Yorkshire").

---

## Open questions / TODO

- Product copy order — colour-material-garment, or material-colour-garment? Settle on three real product pages.
- Journal article structure — title shape, dek/lede convention, byline format. Derive from one reference article.
- Newsletter voice — same register, or slightly warmer? Decide before the first send.
- Form microcopy pass — checkout, sizing help, account-page strings.
- Press one-liner — single sentence Ýr can paste into press emails. Draft three, pick one.
