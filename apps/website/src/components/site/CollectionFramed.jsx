import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap'
import Button from '../atoms/Button'

/**
 * CollectionFramed — the SupportCTA-style take on the Collection card.
 *
 * Side-by-side comparison against the full-bleed diptych in Collection.jsx:
 * contained card, rounded image frame, parallax inside the frame,
 * bottom-aligned text column. Same image + copy as the diptych so the only
 * variable is layout.
 *
 * No useReveal here — SupportCTA's [data-reveal] blocks never fired in this
 * slot (first section after the hero) and left the whole text column at
 * opacity 0. The diptych has no entry animation either, so the pair matches.
 *
 * ponytail: temporary — one of these two dies once the shape is picked.
 */

const COVER = '/brand/shop/set/set-08.jpg'

export default function CollectionFramed() {
  const navigate = useNavigate()
  const sectionRef = useRef(null)
  const imgRef = useRef(null)

  // Parallax — the oversized image drifts slower than scroll inside its
  // rounded frame, giving the card depth.
  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.fromTo(
      imgRef.current,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    )
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} data-theme="dark" className="relative bg-surface-primary p-6 lg:p-12 overflow-hidden">
      <div className="relative flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-12 lg:h-[80vh]">
        {/* image — rounded frame; oversized image inside parallaxes for depth */}
        <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:flex-1 lg:self-stretch overflow-hidden rounded-[4px] bg-surface-secondary">
          <Link to="/shop" aria-label="Shop the collection" className="block w-full h-full">
            <img
              ref={imgRef}
              src={COVER}
              alt=""
              className="absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover will-change-transform"
            />
          </Link>
        </div>

        {/* text column — fixed 397px on desktop, bottom-aligned */}
        <div className="w-full lg:w-[397px] shrink-0 lg:pb-8 flex flex-col items-start gap-8">
          <div className="self-stretch flex flex-col items-start gap-2">
            <p className="site-eyebrow-section">Collection</p>
            <div className="self-stretch flex flex-col items-start gap-6">
              <h2 className="site-title-section uppercase" style={{ marginBottom: 0 }}>
                SS 2026
              </h2>
              {/* placeholder copy — awaiting Ýr's pass */}
              <p className="site-subline-hero">
                Print pieces from the current season, produced per order and shipped
                worldwide. The same prints that run through the atelier work, cut for
                everyday wear.
              </p>
            </div>
          </div>
          <div>
            <Button size="lg" variant="secondary" onClick={() => navigate('/shop')}>Shop Collection</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
