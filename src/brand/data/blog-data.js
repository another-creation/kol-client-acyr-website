/**
 * Another Creation — journal data.
 *
 * Shape chosen so a CMS (Sanity, Payload, Hygraph, etc.) can replace these
 * arrays with a fetched equivalent without the page JSX having to change.
 * Bodies are block-structured (type + payload) for the same reason — no
 * markdown parsing required at render time.
 *
 * Block types supported by the renderer:
 *   { type: 'p',     text }
 *   { type: 'h2',    text }
 *   { type: 'h3',    text }
 *   { type: 'quote', text, cite? }
 *   { type: 'ul',    items: [string] }
 *   { type: 'ol',    items: [string] }
 */

const ANNA = '/brand/photoshoot'
const MOOD = '/brand/mood'

export const AUTHORS = [
  {
    slug: 'yr-thrastardottir',
    name: 'Ýr Þrastardóttir',
    role: 'Founder · Designer',
    bio: 'Founded Another Creation in Reykjavík in 2013. BA in fashion design from the Icelandic Academy of the Arts (2010); represented Iceland at Designer\'s Nest, Copenhagen Fashion Week, in 2011. Custom-designs for film, theatre, concerts, and Iceland\'s dance company alongside the label.',
    links: [{ label: 'Instagram', href: 'https://instagram.com/anothercreation' }],
    avatarInitial: 'Ý',
  },
  {
    slug: 'studio-atelier',
    name: 'Another Creation Atelier',
    role: 'Studio',
    bio: 'The collective voice of the studio. Pattern-cutting, sample-making, and finishing all happen at Skólavörðustígur 12 in Reykjavík.',
    links: [],
    avatarInitial: 'AC',
  },
]

export const ARTICLES = [
  {
    slug: 'ss26-glacial-light',
    title: 'Spring/Summer 2026 — Glacial Light',
    excerpt:
      'A first look at the SS26 collection: pale wool, raw silk, and the ten looks that opened the show at Harpa on 14 March.',
    authorSlug: 'yr-thrastardottir',
    publishedAt: '2026-03-18',
    readingMinutes: 5,
    cover: `${ANNA}/33a4402.jpg`,
    tag: 'Runway',
    body: [
      { type: 'p', text: 'Spring/Summer 2026 begins where the last collection ended — at the edge of the glacier, with the light flat and pale and the clothes asked to do less, not more.' },
      { type: 'h2', text: 'The collection' },
      { type: 'p', text: 'Twenty-eight looks across three families: ivory wool tailoring, a raw-silk daywear group in sand and pearl, and a small evening capsule cut from a single bolt of slate jacquard. Every piece is made to order at the atelier in Reykjavík.' },
      { type: 'ul', items: [
        'Ivory wool overcoat, double-faced, no lining — the opener',
        'Raw-silk trench in sand, half-belted, pleated back yoke',
        'Slate jacquard column dress, hand-rolled hem, four weeks lead time',
        'Pearl crêpe blouse with a draped neck, drawn from the FW24 archive',
      ] },
      { type: 'h2', text: 'The show' },
      { type: 'p', text: 'Harpa, Friday 14 March, 19:00. A short film by Helga Magnúsdóttir runs before the first look. Music composed by Ólafur Arnalds. The runway is matte ash on poured concrete; we kept the lights at 2700K and stayed there.' },
      { type: 'quote', text: 'We wanted the clothes to read at a distance — quiet shapes, no logos, the colour of the room they walked through.', cite: 'Ýr Þrastardóttir' },
      { type: 'h2', text: 'Available now' },
      { type: 'p', text: 'Look book and made-to-order list opens 21 March. First fittings begin in April; first deliveries in late May. Drop a note via the contact page if you want a private appointment at the atelier.' },
    ],
  },
  {
    slug: 'fw25-in-review',
    title: 'Fall/Winter 2025 — six months on',
    excerpt:
      'The "Heavy Wool" collection is into its second production run. A note on what worked, what we corrected, and what we are keeping.',
    authorSlug: 'studio-atelier',
    publishedAt: '2026-02-02',
    readingMinutes: 6,
    cover: `${ANNA}/33a4845.jpg`,
    tag: 'Collection',
    body: [
      { type: 'p', text: 'Fall/Winter 2025 — "Heavy Wool" — is six months out of the gate. The first production run sold through in twelve weeks. We have just opened a second run on three pieces. Here is what we learned.' },
      { type: 'h2', text: 'What sold' },
      { type: 'p', text: 'The charcoal cashmere blazer outsold the projection by 40%. Most surprising: the made-to-order onyx trousers, which we expected to ship 30 pairs and shipped 84.' },
      { type: 'ol', items: [
        'Charcoal cashmere blazer — sold through; second run opened January',
        'Onyx tailored trousers — three lead-time waves, all delivered',
        'Slate silk dress — slow start, finished strong after the press week in November',
        'Gold embroidered cape — eight made, all sold; not repeating',
      ] },
      { type: 'h2', text: 'What we corrected' },
      { type: 'p', text: 'The cashmere blazer shoulder seam needed reinforcement on size L+ — we adjusted it on the second run. The silk-dress hem was too long for shorter clients; we made a 162cm option for run two.' },
      { type: 'h2', text: 'What stays' },
      { type: 'p', text: 'The "Heavy Wool" weight — 480gsm, double-faced, mill-finished — becomes a permanent fabric in the atelier library. Expect it to reappear in winter capsules from here on.' },
      { type: 'quote', text: 'A run that doesn\'t teach you something is just inventory.', cite: 'Atelier note, internal' },
    ],
  },
  {
    slug: 'popup-skolavordustigur',
    title: 'Pop-up · Skólavörðustígur 12, Reykjavík',
    excerpt:
      'A four-week pop-up runs 4 April to 3 May at the studio. Full SS26 collection, a small archive selection, made-to-order fittings on Saturdays.',
    authorSlug: 'studio-atelier',
    publishedAt: '2026-03-25',
    readingMinutes: 3,
    cover: `${MOOD}/image-34.jpeg`,
    tag: 'Events',
    body: [
      { type: 'p', text: 'For four weeks the studio at Skólavörðustígur 12 opens to the public — full SS26 collection on the rail, a short archive selection, and Saturday fittings for made-to-order pieces.' },
      { type: 'h2', text: 'What you can do there' },
      { type: 'ul', items: [
        'Try the full SS26 collection in person',
        'Browse a small archive rail — eight FW24 and SS25 pieces, end-of-run',
        'Book a made-to-order fitting (Saturdays only — please reserve)',
        'Pick up online orders without shipping',
      ] },
      { type: 'h2', text: 'When' },
      { type: 'p', text: 'Saturday 4 April through Sunday 3 May. Tuesday–Friday 13:00–18:00, Saturday 11:00–17:00, closed Sunday and Monday. Closed 17 April for Easter.' },
      { type: 'h2', text: 'How to get there' },
      { type: 'p', text: 'Skólavörðustígur 12, 101 Reykjavík — five minutes uphill from Hallgrímskirkja. No appointment needed except for the fitting room.' },
      { type: 'quote', text: 'The studio is the studio. Opening it for four weeks is the closest thing we run to a shop.', cite: 'Ýr Þrastardóttir' },
    ],
  },
  {
    slug: 'made-to-order',
    title: 'Made to order — how the atelier actually runs',
    excerpt:
      'A walk through the workflow: from first fitting to delivery, what a four-week made-to-order timeline actually looks like.',
    authorSlug: 'yr-thrastardottir',
    publishedAt: '2025-11-12',
    readingMinutes: 7,
    cover: `${ANNA}/33a5018.jpg`,
    tag: 'Process',
    body: [
      { type: 'p', text: 'About 60% of what leaves the atelier is made-to-order. The rest is small-run ready-to-wear from the seasonal collection. This is what the made-to-order timeline actually looks like, week by week.' },
      { type: 'h2', text: 'Week 1 — fitting and selection' },
      { type: 'p', text: 'Forty-five minutes at the atelier. We measure (15 points), discuss the piece, choose fabric from the cards, and confirm any adjustments — sleeve length, hem, lining, finish.' },
      { type: 'h2', text: 'Weeks 2–3 — pattern and toile' },
      { type: 'p', text: 'Pattern is drafted to the new measurements. We make a toile in calico or muslin and call you in for a second fitting. About 20% of pieces need a third fitting; we book it in advance and only use it if needed.' },
      { type: 'h2', text: 'Week 4 — make and finish' },
      { type: 'p', text: 'Cutting, sewing, hand-finishing — pressed, packed, signed. Delivery is hand-collected at the atelier or shipped DHL Express on Fridays.' },
      { type: 'ol', items: [
        'Initial fitting — 45 minutes',
        'Toile and second fitting — 20 minutes',
        'Optional third fitting — 15 minutes',
        'Final delivery and try-on — 20 minutes',
      ] },
      { type: 'h2', text: 'What it costs' },
      { type: 'p', text: 'Made-to-order is roughly the same price as the collection equivalent. Pieces with no collection counterpart price separately — quoted at the first fitting. We do not take a deposit; payment is on delivery.' },
      { type: 'quote', text: 'Made to order is not a luxury upgrade — it is just how a small atelier scales without losing fit.', cite: 'Ýr Þrastardóttir' },
    ],
  },
]

/* ── Selectors ── */

export const findAuthor = (slug) => AUTHORS.find((a) => a.slug === slug)
export const findArticle = (slug) => ARTICLES.find((a) => a.slug === slug)
export const articlesByAuthor = (slug) => ARTICLES.filter((a) => a.authorSlug === slug)
export const sortedArticles = () => [...ARTICLES].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' })
