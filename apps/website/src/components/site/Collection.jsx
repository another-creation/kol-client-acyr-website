import { Link, useNavigate } from 'react-router-dom'
import Button from '../atoms/Button'

/**
 * Collection — full-bleed door to the shop.
 *
 * Mirror of DesignerVision: same grid, same type roles, same height, sides
 * flipped (image right / text left on desktop; image on top on mobile). The
 * pair reads as a diptych as you scroll.
 *
 * Not a product grid — one card, one route to /shop.
 */

const COVER = '/brand/shop/set/set-08.jpg'

export default function Collection() {
  const navigate = useNavigate()
  return (
    <section className="bg-surface-primary grid grid-cols-1 md:grid-cols-10 md:h-screen">
      <div className="bg-surface-secondary overflow-hidden relative h-[55vh] md:h-full md:col-start-5 md:col-span-6">
        <Link to="/shop" aria-label="Shop the collection" className="block w-full h-full">
          <img
            src={COVER}
            alt=""
            className="w-full h-full object-cover block"
          />
        </Link>
      </div>

      <div className="flex flex-col justify-center px-16 py-20 gap-6 md:col-start-2 md:col-span-2 md:row-start-1 md:px-0">
        <p className="site-eyebrow-section">Collection</p>
        <h2 className="site-title-section uppercase" style={{ marginBottom: 16 }}>SS 2026</h2>
        {/* placeholder copy — awaiting Ýr's pass */}
        <p className="site-subline-hero">
          Print pieces from the current season, produced per order and shipped
          worldwide. The same prints that run through the atelier work, cut for
          everyday wear.
        </p>
        <div className="mt-2">
          <Button size="lg" variant="secondary" onClick={() => navigate('/shop')}>Shop Collection</Button>
        </div>
      </div>
    </section>
  )
}
