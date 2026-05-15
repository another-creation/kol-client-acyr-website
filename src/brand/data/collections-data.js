/**
 * Another Creation — collections data.
 *
 * Slugs `creation-1` through `creation-7` (sequential; mapped from her live
 * URL mix of Roman numerals: creation-i, ii, iii, iiii, x, xi, cycle-7).
 *
 * Cover field is two-part:
 *   cover  — image used in listing/card view (always still image)
 *   hero   — { type: 'image' | 'video', src, poster? } for the detail page
 *
 * Block-structured (matches blog-data) so a CMS can replace these arrays
 * without changing page JSX.
 */

const COL = '/brand/collections'

const looks = (slug, count) =>
  Array.from({ length: count }, (_, i) => ({
    number: i + 1,
    image:  `${COL}/${slug}/${String(i + 1).padStart(2, '0')}.jpeg`,
    name:   `Look ${String(i + 1).padStart(2, '0')}`,
    family: null,
    fabric: null,
  }))

export const COLLECTIONS = [
  {
    slug: 'creation-7',
    number: 7,
    title: 'Creation 7',
    subtitle: null,
    year: '2026',
    excerpt: 'Twenty-six looks. The seventh runway collection.',
    publishedAt: '2026-01-01',
    cover: `${COL}/creation-7/01.jpeg`,
    hero:  { type: 'image', src: `${COL}/creation-7/01.jpeg` },
    show: { venue: null, event: null, date: null, music: null, film: null, lighting: null },
    collaborators: [],
    notes: [
      { type: 'p', text: 'Creation 7 — twenty-six looks across the season.' },
    ],
    looks: looks('creation-7', 26),
    press: [],
    videos: [],
  },
  {
    slug: 'creation-6',
    number: 6,
    title: 'Creation 6',
    subtitle: null,
    year: '2023',
    excerpt: 'Twenty-six looks. The sixth runway collection.',
    publishedAt: '2023-01-01',
    cover: `${COL}/creation-6/01.jpeg`,
    hero:  { type: 'image', src: `${COL}/creation-6/01.jpeg` },
    show: { venue: null, event: null, date: null, music: null, film: null, lighting: null },
    collaborators: [],
    notes: [
      { type: 'p', text: 'Creation 6 — twenty-six looks across the season.' },
    ],
    looks: looks('creation-6', 26),
    press: [],
    videos: [],
  },
  {
    slug: 'creation-5',
    number: 5,
    title: 'Creation 5',
    subtitle: null,
    year: '2022',
    excerpt: 'Twelve looks.',
    publishedAt: '2022-01-01',
    cover: `${COL}/creation-5/01.jpeg`,
    hero:  { type: 'image', src: `${COL}/creation-5/01.jpeg` },
    show: { venue: null, event: null, date: null, music: null, film: null, lighting: null },
    collaborators: [],
    notes: [
      { type: 'p', text: 'Creation 5 — twelve looks across the season.' },
    ],
    looks: looks('creation-5', 12),
    press: [],
    videos: [],
  },
  {
    slug: 'creation-4',
    number: 4,
    title: 'Creation 4',
    subtitle: null,
    year: '2020',
    excerpt: 'Fifteen looks.',
    publishedAt: '2020-01-01',
    cover: `${COL}/creation-4/01.jpeg`,
    hero:  { type: 'image', src: `${COL}/creation-4/01.jpeg` },
    show: { venue: null, event: null, date: null, music: null, film: null, lighting: null },
    collaborators: [],
    notes: [
      { type: 'p', text: 'Creation 4 — fifteen looks across the season.' },
    ],
    looks: looks('creation-4', 15),
    press: [],
    videos: [],
  },
  {
    slug: 'creation-3',
    number: 3,
    title: 'Creation 3',
    subtitle: null,
    year: '2018',
    excerpt: 'Sixteen looks at DesignMarch 2018.',
    publishedAt: '2018-03-16',
    cover: `${COL}/creation-3/01.jpeg`,
    hero:  { type: 'image', src: `${COL}/creation-3/01.jpeg` },
    show: { venue: null, event: 'DesignMarch 2018', date: '2018-03-16', music: null, film: null, lighting: null },
    collaborators: [],
    notes: [
      { type: 'p', text: 'Creation 3 — sixteen looks shown at DesignMarch 2018.' },
    ],
    looks: looks('creation-3', 16),
    press: [
      { outlet: 'Reykjavík Grapevine', date: '2018-03-15', quote: 'From fabric to fruition — the structural designs of Another Creation.', href: 'https://grapevine.is/icelandic-culture/design/2018/03/15/from-fabric-to-fruition-the-structural-designs-of-another-creation/' },
    ],
    videos: [],
  },
  {
    slug: 'creation-2',
    number: 2,
    title: 'Creation 2',
    subtitle: null,
    year: '2017',
    excerpt: 'Fifteen looks. Featured on the Not Just A Label industry archive.',
    publishedAt: '2017-01-01',
    cover: `${COL}/creation-2/01.jpeg`,
    hero:  { type: 'image', src: `${COL}/creation-2/01.jpeg` },
    show: { venue: null, event: null, date: null, music: null, film: null, lighting: null },
    collaborators: [],
    notes: [
      { type: 'p', text: 'Creation 2 — fifteen looks across the season. Archived on Not Just A Label.' },
    ],
    looks: looks('creation-2', 15),
    press: [
      { outlet: 'Not Just A Label', date: null, quote: 'Creation Two — featured on the NJAL industry archive.', href: 'https://industry.notjustalabel.com/collection/yr1/creation-two' },
    ],
    videos: [],
  },
  {
    slug: 'creation-1',
    number: 1,
    title: 'Creation 1',
    subtitle: 'Reykjavík Fashion Festival 2015',
    year: '2015',
    excerpt:
      'The debut runway at Reykjavík Fashion Festival 2015 — military tailoring, Art Deco gowns, and long coats in black, gold, and tan.',
    publishedAt: '2015-03-01',
    cover: `${COL}/creation-1/ac-rff-2015-01.jpeg`,
    hero: {
      type: 'video',
      src: '/brand/video/ac-rff-2015-srt.mp4',
      poster: `${COL}/creation-1/ac-rff-2015-01.jpeg`,
    },
    show: {
      venue: 'Harpa, Reykjavík',
      event: 'Reykjavík Fashion Festival 2015',
      date:  '2015-03-01',
      music: null, film: null, lighting: null,
    },
    collaborators: [],
    notes: [
      { type: 'p', text: 'The debut at Reykjavík Fashion Festival 2015. Military tailoring sits at the spine of the collection — sharp shoulders, hard lines — softened by Art Deco gowns and a small group of long coats. Three colours: black, gold, tan.' },
      { type: 'h2', text: 'Materials' },
      { type: 'p', text: 'Heavy wool for the tailoring, silk for the gowns, brass and gold-thread embellishment hand-applied at the atelier. The overall register sits closer to romance than rigour — which is why the military shapes work.' },
      { type: 'quote', text: 'Another Creation changes up with the times.', cite: 'Icelandmag, RFF 15 review' },
    ],
    looks: looks('creation-1', 8),
    press: [
      { outlet: 'Icelandmag',         date: '2015-03-01', quote: 'RFF 15: Another Creation changes up with the times.',      href: 'https://icelandmag.is/article/rff-15-another-creation-changes-times' },
      { outlet: 'Interview Magazine', date: '2015-03-01', quote: 'Reykjavík Fashion Festival 2015 — featured.',              href: 'https://www.interviewmagazine.com/fashion/reykjavik-fashion-festival-2015' },
    ],
    videos: [],
  },
]

/* ── Selectors ── */

export const findCollection = (slug) => COLLECTIONS.find((c) => c.slug === slug)
export const sortedCollections = () => [...COLLECTIONS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

export const adjacentCollections = (slug) => {
  const sorted = sortedCollections()
  const i = sorted.findIndex((c) => c.slug === slug)
  return {
    prev: i > 0 ? sorted[i - 1] : null,
    next: i < sorted.length - 1 ? sorted[i + 1] : null,
  }
}

export const formatShowDate = (iso) => {
  if (!iso) return null
  const d = new Date(iso)
  if (iso.length <= 10) return d.toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' })
  return d.toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' }) +
    ' · ' + d.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false })
}
