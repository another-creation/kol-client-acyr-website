---
title: Contact and identity
version: 1.0.0
date: 2026-05-16
status: active
type: reference
aliases:
  - brand info
  - studio contact
tags:
  - brand/identity
  - brand/contact
related:
  - "[[02-brand/02-career-and-press|career-and-press]]"
  - "[[02-brand/03-branded-assets|branded-assets]]"
---

# Contact and identity

Readable mirror of `src/brand/data/info.js`. JS is canonical. Update there; this doc gets re-summarised when it drifts.

---

## Identity

| Field        | Value                  |
|--------------|------------------------|
| Brand        | Another Creation       |
| Short name   | AC (internal only)     |
| Founder      | Ýr Þrastardóttir       |
| Role         | Founder · Designer     |
| Established  | 2013                   |

---

## Contact

| Channel | Value                          |
|---------|--------------------------------|
| Email   | yr@another-creation.xyz        |
| Phone   | +354-698-5802                  |
| Web     | another-creation.xyz           |

Studio aliases: `hello@`, `dev@`, `billing@`, `legal@`, `noreply@` (all `@another-creation.xyz`).

---

## Social

| Platform | Handle | URL | Notes |
|---|---|---|---|
| Instagram | `@anothercreation_yr` | `https://www.instagram.com/anothercreation_yr/` | Primary brand account |
| Instagram | `@xyrx` | `https://www.instagram.com/xyrx/` | Ýr's secondary handle |
| Facebook | `@anothercreationyr` | `https://www.facebook.com/anothercreationyr/` | — |
| LinkedIn | `creatoryr` | `https://www.linkedin.com/in/creatoryr/` | Ýr's professional profile |
| FilmFreeway | `YrThrastardottir` | `https://filmfreeway.com/YrThrastardottir` | Director profile |
| TikTok | `@yr_another_creation` | `https://www.tiktok.com/@yr_another_creation` | — |
| X | `@xYrx` | `https://x.com/xYrx` | Ýr's secondary handle |

Canonical list lives in `packages/brand-data/business-data.js` (`SOCIAL` array). When social handles move to `info.js` (planned — they're contact channels, not press artifacts), the consumer in `Footer.jsx` should import from there too.

---

## Studio

| Field    | Value             |
|----------|-------------------|
| Street   | Vatnsstígur 3     |
| Postcode | 101 Reykjavík     |
| Region   | Gullbringa        |
| Country  | Iceland           |
| City     | Reykjavík         |
| Short    | Reykjavík · IS    |

---

## Legal

| Field          | Value                  |
|----------------|------------------------|
| Legal entity   | Another Creation ehf   |
| Kennitala (kt) | 580126-2240            |

---

## Standard labels

| Label    | String                              |
|----------|-------------------------------------|
| Made in  | Made in Iceland                     |
| Handmade | Handmade in Reykjavík               |
| Hand by  | Made by hand by Ýr                  |
| Manifesto| Garments cut for slow living.       |

---

## Source

- `src/brand/data/info.js` — canonical
- Consumers: `StationeryMocks` (styleguide), `Footer`, `Contact` page, `/press`, `/brand`
