import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '../../lib/gsap'
import ProductCard from './ProductCard'
import { PRODUCTS, formatPrice } from '../../data/shop-data'

/**
 * Collection — featured products in a 2×4 grid, revealed on scroll-into-view.
 *
 * Imagery uses the curated `set` shoot; product name / price / link still come
 * from the featured PRODUCTS (paired by index).
 */

// Curated set images for the grid (chosen to not overlap the bento above).
const SET = [
  '/brand/shop/set/set-01.jpg',
  '/brand/shop/set/set-04.jpg',
  '/brand/shop/set/set-07.jpg',
  '/brand/shop/set/set-09.jpg',
  '/brand/shop/set/set-10.jpg',
  '/brand/shop/set/set-14.jpg',
  '/brand/shop/set/set-16.jpg',
  '/brand/shop/set/set-19.jpg',
]

export default function Collection() {
  const sectionRef = useRef(null)
  const gridRef = useRef(null)
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 8)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    const cards = gridRef.current?.children
    if (!cards || cards.length === 0) return

    // Timed reveal (NOT scrub) — cards rise in over a fixed duration when the
    // section enters view. Opacity is NOT animated here (CSS owns it: cards
    // rest at 70%, hover 100%) — animating it would leave an inline opacity
    // that overrides the hover.
    gsap.set(cards, { y: 40, scale: 0.96 })
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          y: 0,
          scale: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: 'power2.out',
        })
      },
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} className="bg-surface-primary px-8 py-12">
      <div className="flex items-baseline justify-between mb-10">
        <h2 className="site-meta-editorial text-emphasis">Collection</h2>
        <span className="site-meta-editorial">SS 2026</span>
      </div>

      <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 h-[110vh]">
        {featured.map((p, i) => (
          <div key={p.slug} className="h-full opacity-70 hover:opacity-100 transition-opacity duration-300">
            <ProductCard
              to={p.kind === 'pod' ? `/shop/${p.slug}` : `/handmade/${p.slug}`}
              src={SET[i] ?? p.image}
              name={p.name}
              price={formatPrice(p.price, p.currency)}
              overlay={false}
              fill
            />
          </div>
        ))}
      </div>
    </section>
  )
}
