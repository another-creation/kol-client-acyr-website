import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../../lib/gsap'

/**
 * Marquee — continuously translating horizontal reel.
 *
 * GSAP-driven (replaces the prior CSS keyframe). Direction reverses based on
 * scroll velocity: scroll down → moves left, scroll up → moves right. Inspired
 * by GSAP's `horizontalLoop()` recipe but simplified for static-item content
 * (no need for snap-to-item or velocity-aware tween speeds — just direction).
 *
 * The visible row contains two copies of the items concatenated. The tween
 * translates the row from x=0 to x=-50% (one copy width) and yoyo-rewinds.
 * Direction is flipped by setting `reversed()` on the timeline.
 */
export default function Marquee({ kicker, note, items = [] }) {
  const list = items.map((it) => (typeof it === 'string' ? { name: it } : it))
  const rowRef = useRef(null)

  useEffect(() => {
    const row = rowRef.current
    if (!row) return
    if (prefersReducedMotion()) return

    // 90 seconds for one full sweep — adjust speed by changing this.
    const tween = gsap.to(row, {
      xPercent: -50,
      duration: 90,
      ease: 'none',
      repeat: -1,
    })

    let lastY = window.scrollY
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        const delta = y - lastY
        lastY = y
        // Scrolling down → reverse(false) [moves left, default]
        // Scrolling up   → reverse(true)  [moves right]
        if (delta > 0 && tween.reversed()) tween.reversed(false)
        else if (delta < 0 && !tween.reversed()) tween.reversed(true)
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      tween.kill()
    }
  }, [items])

  return (
    <section data-theme="dark" className="relative w-screen ml-[calc(50%-50vw)] h-48 bg-surface-tertiary text-on-primary flex flex-col justify-center overflow-hidden">
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
