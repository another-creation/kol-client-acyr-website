---
title: Branded assets
version: 1.0.0
date: 2026-05-16
status: active
type: reference
aliases:
  - asset specs
  - print production
  - stationery
tags:
  - brand/assets
  - brand/print
  - brand/production
related:
  - "[[02-brand/01-contact-and-identity|contact-and-identity]]"
  - "[[02-brand/02-career-and-press|career-and-press]]"
---

# Branded assets

Readable mirror of `src/brand/data/branded-assets.js` — production specs (trim, bleed, stock, print) for stationery, labels, and packaging. JS is canonical (the styleguide Reference page consumes it directly).

Sizes are physical mm. Digital values assume 300 dpi unless stated. CMYK = FOGRA39 by default.

---

## Stationery

| Asset                   | Trim (mm)      | Stock                          | Print                  |
|-------------------------|----------------|--------------------------------|------------------------|
| Business card · front   | 85 × 55        | 350 gsm uncoated cream         | CMYK · FOGRA39         |
| Business card · back    | 85 × 55        | (same)                         | Burgundy ink           |
| Envelope · DL           | 220 × 110      | 120 gsm uncoated cream         | 1-color K · litho      |
| Letterhead · A4         | 210 × 297      | 100 gsm uncoated cream         | 1-color K (or digital) |
| Email signature         | 600 px wide    | HTML table (Gmail/Outlook/Apple) | sRGB · `#5A0816` mark on `#FBF7EE` |

All stationery: +3 mm bleed where printed. Email signature is HTML table-based for client compatibility; mark is PNG @ 2× (128 × 128 px), CDN-hosted not inline.

---

## Labels and tags

| Asset            | Trim (mm)   | Stock / Construction                                   | Print                     |
|------------------|-------------|--------------------------------------------------------|---------------------------|
| Hangtag          | 60 × 100    | 400 gsm uncoated cream (front), burgundy back         | 1-color · ⌀4 mm punch     |
| Swing tag        | 60 × 95     | 400 gsm coated burgundy                                | 1-color · rounded die     |
| Edition card     | 100 × 148 (A6) | 300 gsm uncoated cream                               | 1-color K · letterpress preferred · hand or letterpress numbering |
| Neck label       | 50 × 30 (centre-fold) | Damask weave, 2-colour yarn (cream/burgundy) | Heat-cut edges            |
| Size label       | 25 × 40     | Printed satin, soft-hand                              | 1-color K on cream satin  |
| Care label       | 40 × 80 (folded once) | Printed nylon taffeta, heat-resistant         | ISO/GINETEX symbols + composition (EN/FR/DE/IS/中文) |

Care label tiers:
- **A · Minimal** — 30 × 50 mm, symbols only, sewn behind size tag
- **B · Standard** — 40 × 80 mm, three-language (default)
- **C · Long** — 30 × 120 mm, folded mid-length, all five languages

Compliance: EU 1007/2011 textile labelling. Country of origin required.

---

## Soft goods and packaging

| Asset                | Trim (mm)            | Material                            | Print / Finish                          |
|----------------------|----------------------|-------------------------------------|------------------------------------------|
| Dust bag             | 400 × 500 (flat)     | 200 gsm natural cotton calico (undyed, GOTS preferred) | 1-color screen print, K only, centred at 28% from top |
| Garment bag          | 600 × 1500           | Recycled polyester non-woven, 80 gsm (or canvas) | Sewn-on cream print patch (240 × 340 mm), 1-color K |
| Gift box             | 320 × 240 × 60       | Rigid grey board (1500 gsm) wrapped in cream paper (140 gsm) | Blind deboss · AC mark · 0.6 mm depth · burgundy satin band closure |

Dust bag drawstring: 4 mm cotton, natural, unwaxed.
Garment bag closure: centre zip, burgundy YKK or equivalent.
Gift box interior: cream tissue lining (17 gsm) with one AC pattern stamp at centre. No external print — identity carried by deboss + ribbon.

---

## Color conventions

- **Stationery** uses greyscale only. Brand colour is 10% accent, not surface.
- **Garment-attached items** (tags, labels, neck) carry brand color — these are identity touchpoints.
- **Brand hexes** (hardcoded until Layer 2 token migration):
  - Burgundy: `#750E20` · Dark Maroon: `#5A0816` · Deep Wine: `#3A0008`
  - Cream: `#FBF7EE` · Champagne: `#F2E5CB` · Sand Gold: `#F2D9A9`

---

## Future additions (not yet specced)

- Kraft hangtag (heavier paper, fold-open)
- Fabric ribbon tag (woven cloth for higher-end pieces)
- Seasonal collection tag (AW / SS limited-edition format)
- Outer wrapping: shopping bag, tissue paper wrap, sticker / wax seal, branded ribbon
- Documents: receipt (print), invoice (digital), order confirmation (email template)
- Retail / wayfinding: window vinyl, show invitation card, lookbook cover
- Digital social templates (see `/styleguide` chapter 12 — social sizes)

---

## Source

- `src/brand/data/branded-assets.js` — canonical
- Consumed by: `pages/Reference.jsx` (styleguide asset register), future press kit / vendor briefs
