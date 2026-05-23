import { useRef } from 'react'
import { gsap, Flip, useGSAP, prefersReducedMotion } from '../../lib/gsap'

/**
 * LookbookCarousel — scrubbed-bento gallery.
 *
 * Port of GSAP's "scrubbed bento gallery": two CSS grid layouts (.lookbook-grid
 * bento + .lookbook-grid--final blown up) and Flip morphs between them on a
 * pinned scrub. Phase 1 — the bento scrolls to centre (start: 'center center').
 * Phase 2 — pinned, the grid zooms (Flip with expoScale ease) so the centre
 * item (nth-child 3) fills the viewport while the rest scale off-screen.
 *
 * Grid CSS lives in site.css (.lookbook-*). Order matters — index 2 (the 3rd
 * item) is the centre hero that ends up full-bleed.
 */

const ITEMS = [
  '/brand/shop/set/set-15.jpg', // 1 — left, tall
  '/brand/shop/set/set-02.jpg', // 2 — top centre
  '/brand/shop/set/set-08.jpg', // 3 — CENTRE hero (fills the frame)
  '/brand/shop/set/set-05.jpg', // 4 — right, tall
  '/brand/shop/set/set-11.jpg', // 5 — mid-left
  '/brand/shop/set/set-18.jpg', // 6 — right, bottom tall
  '/brand/shop/set/set-06.jpg', // 7 — bottom left
  '/brand/shop/set/set-13.jpg', // 8 — bottom centre
]

export default function LookbookCarousel() {
  const wrapRef = useRef(null)
  const gridRef = useRef(null)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    const grid = gridRef.current
    const wrap = wrapRef.current
    if (!grid || !wrap) return

    let flipCtx
    const build = () => {
      const items = grid.querySelectorAll('.lookbook-item')
      flipCtx && flipCtx.revert()
      grid.classList.remove('lookbook-grid--final')

      flipCtx = gsap.context(() => {
        // Capture the final (zoomed) layout, then revert to bento; Flip
        // animates bento → final, scrubbed.
        grid.classList.add('lookbook-grid--final')
        const state = Flip.getState(items)
        grid.classList.remove('lookbook-grid--final')

        const flip = Flip.to(state, { simple: true, ease: 'expoScale(1, 5)' })
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: grid,
            start: 'center center',
            end: '+=100%',
            scrub: true,
            pin: wrap,
          },
        })
        tl.add(flip)
        return () => gsap.set(items, { clearProps: 'all' })
      })
    }

    build()
    window.addEventListener('resize', build)
    return () => {
      window.removeEventListener('resize', build)
      flipCtx && flipCtx.revert()
    }
  }, { scope: wrapRef })

  return (
    <section className="relative w-screen ml-[calc(50%-50vw)] bg-surface-primary">
      <div ref={wrapRef} className="lookbook-wrap">
        <div ref={gridRef} className="lookbook-grid">
          {ITEMS.map((src, i) => (
            <div key={i} className="lookbook-item">
              <img src={src} alt="" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
