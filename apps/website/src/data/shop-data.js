/**
 * Another Creation — shop products (POD line + handmade line).
 *
 *   kind: 'pod'      — Printful all-over-print, fulfilled by the studio.
 *   kind: 'handmade' — bespoke / made-to-order atelier work.
 *
 *   print: 'metal' | 'earth' | 'art-deco' | null
 *
 * Sizes follow Printful's all-over-print catalog. Description fields use the
 * Printful spec sheets for the matching blank product.
 *
 * `externalUrl` retained for reference (her live Squarespace product page) but
 * the client app uses the local cart for the buy flow.
 *
 * Scraped 2026-04-28 from anothercreation.com/shop-now and /handmade.
 */

const SHOP = '/brand/shop/pod'
const HM   = '/brand/shop/handmade'
const BASE = 'https://www.another-creation.com'

const SIZES = {
  windbreaker: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
  pants:       ['2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL'],
  top:         ['2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL'],
  swim:        ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
  swimMix:     ['2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL'],
  active:      ['XS', 'S', 'M', 'L', 'XL'],
  activeFull:  ['2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL'],
  sportsBra:   ['XS', 'S', 'M', 'L', 'XL', '2XL'],
  sweatshirt:  ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
  oneSize:     ['One size'],
  bespoke:     ['Made to measure'],
  tracksuit:   ['XS', 'S', 'M', 'L', 'XL'],
}

const SPEC = {
  windbreaker: {
    blurb:  'Hike in style in a recycled cropped windbreaker — wind- and water-resistant shell with a designer print across the body.',
    bullets: [
      'Shell: 100% recycled polyester',
      'Lining: 100% recycled polyester',
      'Stand-up collar with hood',
      'Front zipper closure',
      'Two slanted pockets with zipper closures',
      'Elastic cuffs and hem',
      'Wind-resistant, water-repellent',
    ],
  },
  pants: {
    blurb:  'Wide-leg trousers with adjustable drawstring waist — the comfort of pyjamas with the structure of resort wear.',
    bullets: [
      '95% polyester, 5% elastane',
      'Fabric weight: 5.32 oz/yd² (180 g/m²)',
      'Made-to-order',
      'Adjustable elastic waistband with drawstring',
      'Side pockets',
      'Wide-leg silhouette',
    ],
  },
  top: {
    blurb:  'Long-sleeve crop top in recycled elastane — soft, four-way stretch, all-over print.',
    bullets: [
      '82% recycled polyester, 18% elastane',
      'Fabric weight: 6.61 oz/yd² (224 g/m²)',
      'Crop hem at the natural waist',
      'Crew neckline',
      'Flat seams and bias binding',
      'Four-way stretch',
    ],
  },
  swim: {
    blurb:  'One-piece swimsuit cut for all figures — supportive, comfortable, all-over print.',
    bullets: [
      '82% recycled polyester, 18% spandex',
      'Fabric weight: 6.78 oz/yd² (230 g/m²)',
      'Four-way stretch material',
      'Removable padding',
      'Lined gusset',
      'Flat-stitched seams',
    ],
  },
  bikiniTop: {
    blurb:  'Padded recycled string bikini top — adjustable ties, four-way stretch, all-over print.',
    bullets: [
      '82% recycled polyester, 18% spandex',
      'Fabric weight: 6.78 oz/yd² (230 g/m²)',
      'Adjustable shoulder ties',
      'Removable foam padding',
      'Lined cups',
      'Made-to-order',
    ],
  },
  bikiniBottom: {
    blurb:  'String bikini bottom in recycled fabric — adjustable side ties, low-rise.',
    bullets: [
      '82% recycled polyester, 18% spandex',
      'Fabric weight: 6.78 oz/yd² (230 g/m²)',
      'Adjustable side ties',
      'Low-rise cut',
      'Lined gusset',
    ],
  },
  highWaistBikini: {
    blurb:  'High-waist two-piece bikini in recycled fabric — sculpting, supportive.',
    bullets: [
      '82% recycled polyester, 18% spandex',
      'Fabric weight: 6.78 oz/yd² (230 g/m²)',
      'High-waist bottom',
      'Padded triangle top',
      'Four-way stretch',
    ],
  },
  leggings: {
    blurb:  'High-waist recycled leggings with side pockets — soft hand, four-way stretch, made-to-order.',
    bullets: [
      '82% recycled polyester, 18% elastane',
      'Fabric weight: 6.78 oz/yd² (230 g/m²)',
      'High-waist fit',
      'Side pockets',
      'Four-way stretch',
      'Flat seams',
    ],
  },
  sportsBra: {
    blurb:  'Padded sports bra with moisture-wicking fabric, four-way stretch, removable padding.',
    bullets: [
      '82% polyester, 18% spandex',
      'Fabric weight: 6.78 oz/yd² (230 g/m²)',
      'Sports mesh lining: 92% polyester, 8% spandex',
      'Removable polyurethane perforated foam padding',
      'Scoop neckline and racerback',
      'Wide elastic underbust band',
      'Best for A–C cups',
    ],
  },
  yogaLeggings: {
    blurb:  'Yoga leggings with a high-waist fit, four-way stretch, made-to-order.',
    bullets: [
      '82% polyester, 18% spandex',
      'Fabric weight: 6.61 oz/yd² (224 g/m²)',
      'High-waist fit',
      'Four-way stretch',
      'Flat seams and bias binding',
    ],
  },
  sweatshirt: {
    blurb:  'Recycled unisex sweatshirt with all-over print — precision-cut and hand-sewn.',
    bullets: [
      '70% polyester, 27% cotton, 3% elastane',
      'Fabric weight: 8.85 oz/yd² (300 g/m²)',
      'Brushed inside',
      'Crew neckline',
      'Ribbed cuffs and hem',
      'Made-to-order',
    ],
  },
  backpack: {
    blurb:  'Minimalist all-over-print backpack — designed to carry the essentials, nothing more.',
    bullets: [
      '100% polyester body',
      'Adjustable shoulder straps',
      'One main compartment with zip closure',
      'Inside pocket',
      'External pocket on the front',
    ],
  },
  bespoke: {
    blurb:  'Made by hand at the atelier in Reykjavík. Lead time approximately four weeks; first fitting confirms sizing and finish.',
    bullets: [
      'Handmade by Ýr',
      'Made-to-order — first fitting required',
      'Approximately 4-week lead time',
      'Final price quoted at fitting',
    ],
  },
  tracksuit: {
    blurb:  'Reversible double-sided tracksuit — two individually printed layers, hand-finished at the atelier.',
    bullets: [
      'Reversible construction',
      'Hand-finished',
      'Two-layer print',
      'Made-to-order',
    ],
  },
}

const pod = (o) => ({ kind: 'pod', currency: 'EUR', ...o })
const hm  = (o) => ({ kind: 'handmade', currency: 'EUR', ...o })

/* ─── Printful-synced products ───
 * `printful-products.json` is generated by `pnpm sync-printful` (the live POD
 * products from the studio's Printful store) and committed. Printful carries
 * name/price/sizes/variants; the per-product print + type + copy it doesn't
 * hold lives in PRINTFUL_META, keyed by printfulProductId. Gallery + card
 * imagery comes from product-media.json (R2/CDN), keyed by the same id. */
import printfulProducts from './printful-products.json' with { type: 'json' }
import productMedia from './product-media.json' with { type: 'json' }

const meta = (print, type, spec) => ({ print, type, excerpt: spec?.blurb ?? '', description: spec ?? null })

// Keyed by printfulProductId. The last two (…260 art-deco windbreaker, …294
// sports bra) are staged for when those are un-ignored in Printful + re-synced.
const PRINTFUL_META = {
  '445808920': meta(null,       'jacket', SPEC.windbreaker),
  '445808914': meta('earth',    'jacket', SPEC.windbreaker),
  '445808910': meta('earth',    'pants',  SPEC.pants),
  '445808899': meta('earth',    'swim',   SPEC.swim),
  '445808893': meta('metal',    'pants',  SPEC.pants),
  '445808886': meta(null,       'shorts', null),
  '445808879': meta('earth',    'jacket', SPEC.windbreaker),
  '445808875': meta('earth',    'pants',  SPEC.pants),
  '445808866': meta('earth',    'swim',   SPEC.bikiniTop),
  '445808863': meta('earth',    'swim',   SPEC.bikiniBottom),
  '445808857': meta('earth',    'active', SPEC.leggings),
  '445808852': meta('art-deco', 'swim',   SPEC.highWaistBikini),
  '445808711': meta('metal',    'jacket', SPEC.windbreaker),
  '445808625': meta('metal',    'top',    SPEC.top),
  '445808607': meta(null,       'bag',    SPEC.backpack),
  '445808552': meta('metal',    'swim',   SPEC.swim),
  '445808505': meta('art-deco', 'active', SPEC.yogaLeggings),
  '445808465': meta('art-deco', 'top',    SPEC.sweatshirt),
  '445808401': meta('art-deco', 'swim',   SPEC.swim),
  '445808352': meta('art-deco', 'top',    SPEC.top),
  '445808260': meta('art-deco', 'jacket', SPEC.windbreaker),
  '445808294': meta('art-deco', 'active', SPEC.sportsBra),
}

const fromPrintful = (p) => {
  const id    = String(p.printfulProductId)
  const media = productMedia[id]
  const m     = PRINTFUL_META[id] ?? {}
  return pod({
    slug:              p.slug,
    name:              p.name,
    price:             p.price,
    priceMax:          p.priceMax ?? null,
    fromPrice:         p.fromPrice ?? null,
    currency:          p.currency,
    image:             media?.hero ?? p.image,   // hero → /shop card
    media:             media?.images ?? [],       // CDN gallery → PDP
    sizes:             p.sizes,
    colors:            p.colors ?? [],
    print:             m.print ?? null,
    type:              m.type ?? null,
    excerpt:           m.excerpt ?? '',
    description:       m.description ?? null,
    printfulProductId: p.printfulProductId,
    variants:          p.variants,
  })
}

export const PRODUCTS = [
  ...printfulProducts.map(fromPrintful),

  /* ─── Bespoke pieces (live on /shop-now but priced as atelier) ─── */
  hm({
    slug: 'modular-leather-jacket',
    name: 'Modular leather jacket',
    price: 2290,
    print: null,
    type: 'jacket',
    image: `${SHOP}/modular-leather-jacket.jpg`,
    excerpt: 'A classic leather jacket redefined through modular design — convertible leather and suede.',
    description: SPEC.bespoke,
    sizes: SIZES.bespoke,
    externalUrl: `${BASE}/shop-now/p/teresa-jacket-78z93`,
  }),
  hm({
    slug: 'vigdis-coat',
    name: 'Vigdis coat',
    price: 1890,
    print: null,
    type: 'coat',
    image: `${SHOP}/vigdis-coat.jpg`,
    excerpt: 'Modular cashmere wool coat, made-to-measure. Multifunctional outerwear designed to adapt.',
    description: SPEC.bespoke,
    sizes: SIZES.bespoke,
    externalUrl: `${BASE}/shop-now/p/sachs-trouser-gachk`,
  }),

  /* ─── /handmade — bespoke pieces ─── */
  hm({
    slug: 'patchwork-silk-jacket',
    name: 'Patchwork silk and quilted satin jacket',
    price: 1290,
    print: null,
    type: 'jacket',
    image: `${HM}/patchwork-silk-jacket.jpg`,
    excerpt: 'A study in structure through material — patchwork silk and quilted satin, handmade by Ýr.',
    description: SPEC.bespoke,
    sizes: SIZES.bespoke,
    externalUrl: `${BASE}/handmade/p/patchwork-silk-quilted-satin-jacket`,
  }),
  hm({
    slug: 'metal-tracksuit',
    name: 'Metal print reversible double-sided tracksuit',
    price: 800,
    print: 'metal',
    type: 'tracksuit',
    image: `${HM}/metal-tracksuit.jpg`,
    excerpt: 'A reversible tracksuit — metal print on one side, two-layer construction.',
    description: SPEC.tracksuit,
    sizes: SIZES.tracksuit,
    externalUrl: `${BASE}/handmade/p/metal-double-sided-tracksuit`,
  }),
  hm({
    slug: 'earth-tracksuit',
    name: 'Earth print reversible double-sided tracksuit',
    price: 800,
    print: 'earth',
    type: 'tracksuit',
    image: `${HM}/earth-tracksuit.jpg`,
    excerpt: 'Reversible tracksuit with the earth print — two-layer construction, hand-finished.',
    description: SPEC.tracksuit,
    sizes: SIZES.tracksuit,
    externalUrl: `${BASE}/handmade/p/double-sided-tracksuit`,
  }),
  hm({
    slug: 'crepe-de-chine-dress',
    name: 'Digitally printed heavy crepe de chine dress',
    price: 2900,
    print: null,
    type: 'dress',
    image: `${HM}/crepe-de-chine-dress.jpg`,
    excerpt: 'A carefully adjusted digitally printed dress in heavy crepe de chine.',
    description: SPEC.bespoke,
    sizes: SIZES.bespoke,
    externalUrl: `${BASE}/handmade/p/digitally-printed-heavy-crepe-de-chine-dress`,
  }),
  hm({
    slug: 'silk-gown',
    name: 'Metallic printed silk gown',
    price: 2500,
    print: null,
    type: 'gown',
    image: `${HM}/silk-gown.jpg`,
    excerpt: 'A tailored silk gown made especially for you, digitally printed in Italy.',
    description: SPEC.bespoke,
    sizes: SIZES.bespoke,
    externalUrl: `${BASE}/handmade/p/metallic-printed-silk-gown`,
  }),
  hm({
    slug: 'nepal-cashmere-coat',
    name: 'Nepal embroidered cashmere coat',
    price: 2650,
    print: null,
    type: 'coat',
    image: `${HM}/nepal-cashmere-coat.jpg`,
    excerpt: 'Rooted in earthy tones and natural texture — a unique wool coat with Nepali embroidery.',
    description: SPEC.bespoke,
    sizes: SIZES.bespoke,
    externalUrl: `${BASE}/handmade/p/the-haven-vessel-ez9ej`,
  }),

  /* ─── Editorial pieces (photoshoot images, atelier one-offs) ─── */
  hm({
    slug:        'ivory-wool-overcoat',
    name:        'Ivory wool overcoat',
    price:       1280,
    print:       null,
    type:        'coat',
    image:       '/brand/photoshoot/33a6719.jpg',
    excerpt:     'Long-line ivory overcoat in heavy wool — clean shoulder, structured silhouette.',
    description: SPEC.bespoke,
    sizes:       SIZES.bespoke,
    featured:    true,
  }),
  hm({
    slug:        'charcoal-cashmere-blazer',
    name:        'Charcoal cashmere blazer',
    price:       960,
    print:       null,
    type:        'jacket',
    image:       '/brand/photoshoot/33a6082.jpg',
    excerpt:     'A relaxed cashmere blazer — soft hand, narrow lapel, single-button close.',
    description: SPEC.bespoke,
    sizes:       SIZES.bespoke,
    featured:    true,
  }),
  hm({
    slug:        'sand-linen-trench',
    name:        'Sand linen trench',
    price:       1140,
    print:       null,
    type:        'coat',
    image:       '/brand/photoshoot/33a5074.jpg',
    excerpt:     'Lightweight trench in undyed linen — fluid drape, raglan shoulder, belted waist.',
    description: SPEC.bespoke,
    sizes:       SIZES.bespoke,
    featured:    true,
  }),
  hm({
    slug:        'slate-silk-dress',
    name:        'Slate silk dress',
    price:       870,
    print:       null,
    type:        'dress',
    image:       '/brand/photoshoot/33a6361.jpg',
    excerpt:     'A bias-cut silk dress in slate — column line, narrow strap, hand-finished hem.',
    description: SPEC.bespoke,
    sizes:       SIZES.bespoke,
    featured:    true,
  }),
  hm({
    slug:        'onyx-tailored-trousers',
    name:        'Onyx tailored trousers',
    price:       620,
    print:       null,
    type:        'pants',
    image:       '/brand/photoshoot/33a4845.jpg',
    excerpt:     'High-rise tailored trouser in onyx wool — pressed crease, straight leg, side pocket.',
    description: SPEC.bespoke,
    sizes:       SIZES.bespoke,
    featured:    true,
  }),
  hm({
    slug:        'pearl-draped-blouse',
    name:        'Pearl draped blouse',
    price:       540,
    print:       null,
    type:        'top',
    image:       '/brand/photoshoot/33a5964.jpg',
    excerpt:     'Drape-front silk blouse in pearl — asymmetric tie, soft shoulder, fluid hem.',
    description: SPEC.bespoke,
    sizes:       SIZES.bespoke,
    featured:    true,
  }),
  hm({
    slug:        'gold-embroidered-cape',
    name:        'Gold embroidered cape',
    price:       1750,
    print:       null,
    type:        'cape',
    image:       '/brand/photoshoot/33a6554.jpg',
    excerpt:     'Floor-length cape with hand embroidery in metallic gold thread.',
    description: SPEC.bespoke,
    sizes:       SIZES.bespoke,
    featured:    true,
  }),
  hm({
    slug:        'obsidian-leather-skirt',
    name:        'Obsidian leather skirt',
    price:       780,
    print:       null,
    type:        'skirt',
    image:       '/brand/photoshoot/33a6242.jpg',
    excerpt:     'A-line leather skirt in obsidian — knee-length, hidden zip, unlined finish.',
    description: SPEC.bespoke,
    sizes:       SIZES.bespoke,
    featured:    true,
  }),
]

/* ── Selectors ── */

export const findProduct      = (slug)  => PRODUCTS.find((p) => p.slug === slug)
export const podProducts      = ()      => PRODUCTS.filter((p) => p.kind === 'pod')
export const handmadeProducts = ()      => PRODUCTS.filter((p) => p.kind === 'handmade')
export const productsByPrint  = (print) => PRODUCTS.filter((p) => p.print === print)

export const PRINTS = [
  { slug: 'metal',    label: 'Metal',    description: 'Industrial pattern at scale — windbreakers, swim, tops, pants.' },
  { slug: 'earth',    label: 'Earth',    description: "Iceland's landscape pulled into print — the largest of the three capsules." },
  { slug: 'art-deco', label: 'Art Deco', description: 'Geometric, stripped, rhythmic. The first capsule that defined the print line.' },
]

export const formatPrice = (n, currency = 'EUR') =>
  new Intl.NumberFormat('en', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n)

/* ── Handmade page FAQ — pulled from the live site's /handmade FAQ. ── */

export const HANDMADE_FAQ = [
  {
    q: 'How long does a made-to-order piece take?',
    a: 'Approximately four weeks from the first fitting to delivery. Bespoke pieces with no collection counterpart can take longer; we quote you at the first fitting.',
  },
  {
    q: 'Do I need to come to Reykjavík for a fitting?',
    a: 'For full made-to-measure pieces a fitting in Reykjavík is ideal. If you are unable to travel, we can work from a complete set of measurements, with two video calls instead of in-person fittings.',
  },
  {
    q: 'How are sizes set?',
    a: 'We measure you at the first fitting (15 reference points). For pieces ordered remotely, we send a measurement guide and a video call follows.',
  },
  {
    q: 'What is your return policy on made-to-order?',
    a: 'Made-to-order pieces are produced specifically for you and cannot be returned unless faulty. We work closely with you at fitting stages to make sure the piece is right before final make.',
  },
  {
    q: 'Can I commission something not on this page?',
    a: 'Yes — write to yr@another-creation.com with a brief and a reference image. We respond within two business days with a feasibility note and a price range.',
  },
]
