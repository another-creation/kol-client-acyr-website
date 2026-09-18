import { Link } from 'react-router-dom'
import Carousel from '../primitives/Carousel'
import { PRODUCTS } from '../../data/shop-data'

/**
 * CollectionCarousel — looping rail of featured pieces.
 *
 * Four products routing to their PDPs, plus one editorial look routing to its
 * collection. Built on the shared Carousel primitive (the one About uses) with
 * loop: true, so there is no first or last slide and the arrows never disable.
 *
 * Section owns the 80vh; the slides fill whatever height is left after the
 * arrow row, and take their width from the 3/4 product ratio.
 */

/* Editorial looks straight off the Sanity CDN. Hardcoded rather than fetched —
 * three images, and Sanity asset URLs are content-addressed, so these only
 * break if the image itself is replaced in the Studio. */
const look = (collection, hash) => ({
  src:   `https://cdn.sanity.io/images/ajbrqqhq/production/${hash}.jpg`,
  label: `Creation ${collection}`,
  to:    `/collections/creation-${collection}`,
})

/* Ordered rail. Editorial looks sit at positions 2/4/6 so two never land side
 * by side — including across the loop seam, where 7 wraps back to 1. */
const RAIL = [
  { slug: 'earth-print-wide-leg-pants' },
  look(6, '76aacddc7adf3f421d8f244c39bbcb38200f1d22-1772x2362'),        // look 22
  { slug: 'unique-earth-print-swimsuit' },
  look(5, '4494b082915a0654aeb5bb1779688a65123bcbd0-1600x1600'),        // look 05
  { slug: 'earth-print-leggings-with-pockets' },
  look(6, 'b38cb1ae7c0f91640ec4de5e1dfb24c52de5a4c9-1772x2362'),        // look 23
  { slug: 'art-deco-printed-windbreaker' },
]

export default function CollectionCarousel() {
  // filter(Boolean) guards a slug disappearing on the next Printful re-sync.
  const slides = RAIL.map((entry) => {
    if (!entry.slug) return entry
    const p = PRODUCTS.find((x) => x.slug === entry.slug)
    return p && { src: p.image, label: p.name, to: `/shop/${p.slug}` }
  }).filter(Boolean)

  // Run the rail twice so Embla always has the width it needs to loop.
  const featured = [...slides, ...slides]

  return (
    <section className="bg-surface-primary h-[80vh] flex flex-col justify-center px-8 overflow-hidden">
      <Carousel
        className={[
          'flex-1 min-h-0 flex flex-col',
          '[&_.ac-embla-viewport]:flex-1 [&_.ac-embla-viewport]:min-h-0',
          '[&_.ac-embla-container]:h-full [&_.ac-embla-container]:gap-0!',
          /* width derived from the 80vh height — 60vh keeps every card at 3:4 */
          '[&_.ac-embla-slide]:h-full [&_.ac-embla-slide]:w-[60vh]!',
        ].join(' ')}
        options={{ align: 'start', loop: true, dragFree: true }}
        arrows="overlay"
      >
        {featured.map((s, i) => (
          <Link
            key={`${s.to}-${i}`}
            to={s.to}
            className="group relative block w-full h-full overflow-hidden"
          >
            <img
              src={s.src}
              alt=""
              className="w-full h-full object-cover block"
              loading="lazy"
            />
            {/* name reveals centred on hover — tint keeps it legible over light photos */}
            <div className="absolute inset-0 flex items-center justify-center p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
              {/* no role class — every property would need overriding, so utilities only (and no ! fight) */}
              <p className="m-0 font-[family-name:var(--ac-font-family-sans-tight)] font-medium text-white text-center uppercase text-[8vh] leading-[0.95]">{s.label}</p>
            </div>
          </Link>
        ))}
      </Carousel>
    </section>
  )
}
