import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap'
import ProductCard from './ProductCard'
import { PRODUCTS, formatPrice } from '../../data/shop-data'

/**
 * Collection — cards scrub INTO the original 2×4 grid layout.
 *
 * Resting state IS the original layout. The animation only happens during
 * scroll-in: cards start displaced (off-grid) and translate to their final
 * grid positions as scroll progresses. The grid itself is unchanged.
 */
export default function Collection() {
  const sectionRef = useRef(null)
  const gridRef = useRef(null)
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 8)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      const cards = gridRef.current?.children
      if (!cards || cards.length === 0) return

      // Each card starts displaced — alternating in/out of frame for a feel
      // of cards "falling into" the grid as you scroll past.
      gsap.from(cards, {
        x: (i) => (i % 2 === 0 ? -120 : 120),
        y: (i) => (i < 4 ? -60 : 60),
        opacity: 0,
        scale: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'top 20%',
          scrub: 1,
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-surface-primary px-8 py-12">
      <div className="flex items-baseline justify-between mb-10">
        <h2 className="site-meta-editorial text-emphasis">Collection</h2>
        <span className="site-meta-editorial">SS 2026</span>
      </div>

      <div ref={gridRef} className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 h-[110vh]">
        {featured.map((p) => (
          <div key={p.slug} className="h-full">
            <ProductCard
              to={p.kind === 'pod' ? `/shop/${p.slug}` : `/handmade/${p.slug}`}
              src={p.image}
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
