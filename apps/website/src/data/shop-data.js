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
 * `printful-products.json` is generated by `pnpm sync-printful` and committed.
 * Per-product enrichment for fields Printful doesn't carry (capsule print,
 * shop type filter, copy) goes in PRINTFUL_OVERRIDES, keyed by slug. */
import printfulProducts from './printful-products.json' with { type: 'json' }

const PRINTFUL_OVERRIDES = {
  'all-over-print-gym-bag': {
    type:    'bag',
    excerpt: 'Recycled all-over-print gym bag — one main compartment, front pocket.',
  },
  'snapback-hat': {
    type:    'hat',
    excerpt: 'Six-panel snapback with structured front, flat brim, adjustable strap.',
  },
}

const fromPrintful = (p) => pod({
  slug:              p.slug,
  name:              p.name,
  price:             p.price,
  priceMax:          p.priceMax ?? null,
  fromPrice:         p.fromPrice ?? null,
  currency:          p.currency,
  image:             p.image,
  sizes:             p.sizes,
  colors:            p.colors ?? [],
  print:             null,
  type:              null,
  excerpt:           '',
  description:       null,
  printfulProductId: p.printfulProductId,
  variants:          p.variants,
  ...(PRINTFUL_OVERRIDES[p.slug] ?? {}),
})

export const PRODUCTS = [
  ...printfulProducts.map(fromPrintful),

  /* ─── Metal print ─── */
  pod({
    slug: 'metal-windbreaker',
    name: 'Metal print windbreaker',
    price: 219,
    print: 'metal',
    type: 'jacket',
    image: `${SHOP}/metal-windbreaker.jpg`,
    excerpt: 'Cropped waterproof windbreaker — metal pattern, recycled shell.',
    description: SPEC.windbreaker,
    sizes: SIZES.windbreaker,
    externalUrl: `${BASE}/shop-now/p/another-creation-nature-print-windbreaker`,
  }),
  pod({
    slug: 'metal-wide-leg-pants',
    name: 'Metal print wide-leg pants',
    price: 159,
    print: 'metal',
    type: 'pants',
    image: `${SHOP}/metal-wide-leg-pants.jpg`,
    excerpt: 'Wide-leg adjustable-waist pants in the metal print.',
    description: SPEC.pants,
    sizes: SIZES.pants,
    externalUrl: `${BASE}/shop-now/p/metal-print-wide-leg-pants`,
  }),
  pod({
    slug: 'metal-crop-top',
    name: 'Metal printed crop top',
    price: 139,
    print: 'metal',
    type: 'top',
    image: `${SHOP}/metal-crop-top.jpg`,
    excerpt: 'Long-sleeve crop top, recycled elastane, all-over metal print.',
    description: SPEC.top,
    sizes: SIZES.top,
    externalUrl: `${BASE}/shop-now/p/another-creation-nature-metal-print-recycled-crop-top`,
  }),
  pod({
    slug: 'metal-swimsuit',
    name: 'Metal printed swimsuit',
    price: 159,
    print: 'metal',
    type: 'swim',
    image: `${SHOP}/metal-swimsuit.jpg`,
    excerpt: 'One-piece swimsuit, metal print, cut for all figures.',
    description: SPEC.swim,
    sizes: SIZES.swim,
    externalUrl: `${BASE}/shop-now/p/another-creation-metal-printed-swimsuit`,
  }),

  /* ─── Earth print ─── */
  pod({
    slug: 'earth-windbreaker-unique',
    name: 'Earth print windbreaker',
    price: 219,
    print: 'earth',
    type: 'jacket',
    image: `${SHOP}/earth-windbreaker-unique.jpg`,
    excerpt: 'Cropped waterproof windbreaker in the earth print.',
    description: SPEC.windbreaker,
    sizes: SIZES.windbreaker,
    externalUrl: `${BASE}/shop-now/p/unique-womens-earth-print-windbreaker-3`,
  }),
  pod({
    slug: 'earth-wide-leg-pants-unique',
    name: 'Earth print wide-leg pants',
    price: 159,
    print: 'earth',
    type: 'pants',
    image: `${SHOP}/earth-wide-leg-pants-unique.jpg`,
    excerpt: 'Wide-leg adjustable-waist pants in the earth print.',
    description: SPEC.pants,
    sizes: SIZES.pants,
    externalUrl: `${BASE}/shop-now/p/unique-womens-earth-print-wide-leg-pants`,
  }),
  pod({
    slug: 'earth-bikini-top',
    name: 'Earth print recycled string bikini top',
    price: 119,
    print: 'earth',
    type: 'swim',
    image: `${SHOP}/earth-bikini-top.jpg`,
    excerpt: 'Padded recycled string bikini top — earth print.',
    description: SPEC.bikiniTop,
    sizes: SIZES.swimMix,
    externalUrl: `${BASE}/shop-now/p/earth-print-recycled-string-bikini-top`,
  }),
  pod({
    slug: 'earth-bikini-bottom',
    name: 'Earth print recycled string bikini bottom',
    price: 109,
    print: 'earth',
    type: 'swim',
    image: `${SHOP}/earth-bikini-bottom.jpg`,
    excerpt: 'Recycled string bikini bottom — earth print.',
    description: SPEC.bikiniBottom,
    sizes: SIZES.swimMix,
    externalUrl: `${BASE}/shop-now/p/earth-print-recycled-string-bikini-bottom`,
  }),
  pod({
    slug: 'earth-swimsuit-unique',
    name: 'Earth print swimsuit',
    price: 159,
    print: 'earth',
    type: 'swim',
    image: `${SHOP}/earth-swimsuit-unique.jpg`,
    excerpt: 'One-piece swimsuit in the earth print.',
    description: SPEC.swim,
    sizes: SIZES.swim,
    externalUrl: `${BASE}/shop-now/p/unique-womens-earth-print-swimsuit`,
  }),
  pod({
    slug: 'earth-wide-leg-pants',
    name: 'Earth print wide-leg pants (alt)',
    price: 159,
    print: 'earth',
    type: 'pants',
    image: `${SHOP}/earth-wide-leg-pants.jpg`,
    excerpt: 'Wide-leg pants in the earth print — second cut.',
    description: SPEC.pants,
    sizes: SIZES.pants,
    externalUrl: `${BASE}/shop-now/p/earth-print-wide-leg-pants`,
  }),
  pod({
    slug: 'earthy-windbreaker',
    name: 'Earthy windbreaker',
    price: 219,
    print: 'earth',
    type: 'jacket',
    image: `${SHOP}/earthy-windbreaker.jpg`,
    excerpt: 'Cropped waterproof windbreaker — earth print at a different scale.',
    description: SPEC.windbreaker,
    sizes: SIZES.windbreaker,
    externalUrl: `${BASE}/shop-now/p/earthy-windbreaker`,
  }),
  pod({
    slug: 'earth-leggings',
    name: 'Earth print leggings with pockets',
    price: 159,
    print: 'earth',
    type: 'active',
    image: `${SHOP}/earth-leggings.jpg`,
    excerpt: 'High-waist leggings with side pockets — earth print, recycled fabric.',
    description: SPEC.leggings,
    sizes: SIZES.activeFull,
    externalUrl: `${BASE}/shop-now/p/earth-print-leggings-with-pockets-2`,
  }),

  /* ─── Art Deco print ─── */
  pod({
    slug: 'art-deco-sweatshirt',
    name: 'Art Deco printed unisex sweatshirt',
    price: 169,
    print: 'art-deco',
    type: 'sweatshirt',
    image: `${SHOP}/art-deco-sweatshirt.jpg`,
    excerpt: 'Recycled unisex sweatshirt with all-over Art Deco print, hand-sewn.',
    description: SPEC.sweatshirt,
    sizes: SIZES.sweatshirt,
    externalUrl: `${BASE}/shop-now/p/another-creation-classic-printed-unisex-sweatshirt`,
  }),
  pod({
    slug: 'art-deco-windbreaker',
    name: 'Art Deco printed windbreaker',
    price: 219,
    print: 'art-deco',
    type: 'jacket',
    image: `${SHOP}/art-deco-windbreaker.jpg`,
    excerpt: 'Cropped waterproof windbreaker in the Art Deco print.',
    description: SPEC.windbreaker,
    sizes: SIZES.windbreaker,
    externalUrl: `${BASE}/shop-now/p/another-creation-classic-printed-cropped-windbreaker-1`,
  }),
  pod({
    slug: 'art-deco-swimsuit',
    name: 'Art Deco printed swimsuit',
    price: 159,
    print: 'art-deco',
    type: 'swim',
    image: `${SHOP}/art-deco-swimsuit.jpg`,
    excerpt: 'One-piece swimsuit in the Art Deco print — bestseller.',
    description: SPEC.swim,
    sizes: SIZES.swim,
    externalUrl: `${BASE}/shop-now/p/another-creation-classic-printed-swimsuit`,
  }),
  pod({
    slug: 'art-deco-crop-top',
    name: 'Art Deco printed crop top',
    price: 139,
    print: 'art-deco',
    type: 'top',
    image: `${SHOP}/art-deco-crop-top.jpg`,
    excerpt: 'Long-sleeve crop top in the Art Deco print.',
    description: SPEC.top,
    sizes: SIZES.top,
    externalUrl: `${BASE}/shop-now/p/another-creation-classic-printed-recycled-crop-top`,
  }),
  pod({
    slug: 'art-deco-bikini',
    name: 'Art Deco printed high-waist bikini',
    price: 149,
    print: 'art-deco',
    type: 'swim',
    image: `${SHOP}/art-deco-bikini.jpg`,
    excerpt: 'High-waist two-piece bikini in the Art Deco print.',
    description: SPEC.highWaistBikini,
    sizes: SIZES.swim,
    externalUrl: `${BASE}/shop-now/p/classic-another-creation-printed-high-waisted-bikini`,
  }),
  pod({
    slug: 'art-deco-sports-bra',
    name: 'Art Deco printed sports bra',
    price: 118,
    print: 'art-deco',
    type: 'active',
    image: `${SHOP}/art-deco-sports-bra.jpg`,
    excerpt: 'Padded sports bra in the Art Deco print.',
    description: SPEC.sportsBra,
    sizes: SIZES.sportsBra,
    externalUrl: `${BASE}/shop-now/p/another-creation-classic-printed-padded-sports-bra`,
  }),
  pod({
    slug: 'art-deco-yoga-leggings',
    name: 'Art Deco printed yoga leggings',
    price: 139,
    print: 'art-deco',
    type: 'active',
    image: `${SHOP}/art-deco-yoga-leggings.jpg`,
    excerpt: 'Yoga leggings in the Art Deco print, made-to-order.',
    description: SPEC.yogaLeggings,
    sizes: SIZES.active,
    externalUrl: `${BASE}/shop-now/p/another-creation-classic-printed-yoga-leggings`,
  }),

  /* ─── Bag ─── */
  pod({
    slug: 'minimalist-backpack',
    name: 'Another Creation minimalist backpack',
    price: 239,
    print: null,
    type: 'bag',
    image: `${SHOP}/backpack.jpg`,
    excerpt: 'Minimalist all-over print backpack — designed to carry the essentials.',
    description: SPEC.backpack,
    sizes: SIZES.oneSize,
    externalUrl: `${BASE}/shop-now/p/another-creation-minimalist-backpack`,
  }),

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
