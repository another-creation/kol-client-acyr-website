import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap'

/**
 * Marquee — continuously translating horizontal reel.
 *
 * Seamless leftward loop. The visible row holds two copies of the items
 * concatenated; the tween translates the row one copy-width (xPercent -50)
 * and repeats, so there's no seam. Pure drift — not coupled to scroll.
 */
export default function Marquee({ kicker, note, items = [] }) {
  const list = items.map((it) => (typeof it === 'string' ? { name: it } : it))
  const rowRef = useRef(null)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    const row = rowRef.current
    if (!row) return
    // 90 seconds for one full sweep — adjust speed by changing this.
    gsap.to(row, {
      xPercent: -150,
      duration: 90,
      ease: 'none',
      repeat: -1,
    })
  }, { scope: rowRef })

  return (
    <section data-theme="dark" className="relative w-screen ml-[calc(50%-50vw)] h-48 text-auto flex flex-col justify-center overflow-hidden pt-4">
      {(kicker || note) && (
        <div className="max-w-[1200px] mx-auto mb-10 px-[var(--ac-pad-page-x)] flex items-baseline justify-between gap-4 flex-wrap">
          {kicker && <span className="site-eyebrow-section">{kicker}</span>}
          {note && <span className="site-meta-system">{note}</span>}
        </div>
      )}
      <div className="relative w-full overflow-hidden">
        <div ref={rowRef} className="flex w-max will-change-transform">
          {[...list, ...list].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-3 pr-16 md:pr-32">
              {item.logo ? (
                <span className="inline-flex items-center">{item.logo}</span>
              ) : (
                <span className="inline-flex items-baseline gap-1.5 whitespace-nowrap text-[22px] font-medium tracking-[-0.005em]">
                  {item.name}
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
