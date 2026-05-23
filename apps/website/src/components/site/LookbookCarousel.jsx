import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap'
import { ACImages } from '@ac/brand-data/images'

/**
 * LookbookCarousel — scrubbed bento gallery.
 *
 * Was an Embla carousel. Replaced with a bento grid (5 images, 4×2 with a
 * large 2×2 hero cell) where each tile scrubs in on scroll: scale-up from 0.7,
 * fade in from 0, translateY from a per-cell offset. Each cell has a slightly
 * different timing so they don't move in lockstep — feels like a deal-in.
 */

const TILES = [
  { src: ACImages.hero,           col: 'col-span-2', row: 'row-span-2', from: { y: 80, x: -40 } },
  { src: ACImages.editorial.left, col: 'col-span-1', row: 'row-span-1', from: { y: -60, x: 40 } },
  { src: ACImages.portrait,       col: 'col-span-1', row: 'row-span-1', from: { y: -80, x: 80 } },
  { src: ACImages.editorial.right,col: 'col-span-1', row: 'row-span-1', from: { y: 80, x: 40 } },
  { src: ACImages.handmade,       col: 'col-span-1', row: 'row-span-1', from: { y: 100, x: 80 } },
]

export default function LookbookCarousel() {
  const sectionRef = useRef(null)
  const tilesRef = useRef([])

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      tilesRef.current.forEach((tile, i) => {
        if (!tile) return
        const from = TILES[i].from
        gsap.from(tile, {
          x: from.x,
          y: from.y,
          opacity: 0,
          scale: 0.85,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            end: 'bottom 60%',
            scrub: 1 + (i * 0.15), // staggered scrub speeds
          },
        })
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative w-screen ml-[calc(50%-50vw)] py-20 px-8 bg-surface-primary overflow-hidden">
      <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[120vh] max-w-[1600px] mx-auto">
        {TILES.map((tile, i) => (
          <div
            key={i}
            ref={(el) => { tilesRef.current[i] = el }}
            className={`${tile.col} ${tile.row} relative overflow-hidden bg-surface-secondary`}
          >
            <img
              src={tile.src}
              alt=""
              className="w-full h-full object-cover block"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
