import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../../lib/gsap'
import Button from '../atoms/Button'

// Cycle deck — flips through alternates before settling on the canonical portrait (last).
const PORTRAIT_DECK = [
  '/brand/yr/acyr-02.jpg',
  '/brand/yr/acyr-04.jpg',
  '/brand/yr/acyr-06.jpg',
  '/brand/yr/acyr-08.jpg',
  '/brand/yr/acyr-01.jpg',
]

const FLIP_INTERVAL_MS = 240
const SETTLE_DELAY_MS = 600 // pause on last image before considering "settled"

/**
 * DesignerVision — portrait flips through alternates before settling.
 *
 * On scroll-into-view, the photo cycles through 4 alternate portraits at
 * ~240ms intervals, then lands on the canonical designer image and stays.
 * The text column gets its own fade-up entry alongside.
 */
export default function DesignerVision() {
  const [activeIdx, setActiveIdx] = useState(0)
  const sectionRef = useRef(null)
  const textRef = useRef(null)
  const flipStartedRef = useRef(false)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setActiveIdx(PORTRAIT_DECK.length - 1) // skip to canonical
      return
    }

    const ctx = gsap.context(() => {
      // Trigger the deck flip when section enters viewport.
      const st = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 70%',
        once: true,
        onEnter: () => {
          if (flipStartedRef.current) return
          flipStartedRef.current = true
          let i = 0
          const tick = () => {
            i++
            if (i < PORTRAIT_DECK.length) {
              setActiveIdx(i)
              setTimeout(tick, FLIP_INTERVAL_MS)
            }
          }
          setTimeout(tick, FLIP_INTERVAL_MS)
        },
      })

      // Text column: stagger fade-up on the [data-reveal] children.
      gsap.from(textRef.current?.querySelectorAll('[data-reveal]') ?? [], {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      })

      return () => st.kill()
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="bg-surface-primary grid grid-cols-1 md:grid-cols-2 md:h-[120vh]">
      <div className="bg-surface-secondary overflow-hidden relative">
        {PORTRAIT_DECK.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={i === PORTRAIT_DECK.length - 1 ? 'Designer' : ''}
            className="absolute inset-0 w-full h-full object-cover object-top block"
            style={{
              opacity: i === activeIdx ? 1 : 0,
              transition: 'opacity 80ms linear',
            }}
          />
        ))}
      </div>

      <div ref={textRef} className="flex flex-col justify-center px-16 py-20 gap-6">
        <p data-reveal className="site-eyebrow-section">The Designer</p>
        <h2 data-reveal className="site-title-section uppercase" style={{ marginBottom: 16 }}>Designer's<br />Vision</h2>
        <div className="flex flex-col gap-4">
          <p data-reveal className="site-subline-hero max-w-[380px]">
            Every piece begins with a single question: what does a woman truly need?
            Not trend, not noise — but a garment that becomes part of her story.
            Crafted by hand from the finest materials, each design is made to age
            beautifully and last a lifetime.
          </p>
          <p data-reveal className="site-subline-emphasis max-w-[380px]">
            From a studio in Reykjavík, each piece is cut by hand in small
            numbers. No seasons, no overproduction — clothing made for the
            independent woman, built to be kept.
          </p>
        </div>
        <div data-reveal className="mt-2">
          <Button size="lg" variant="secondary">Our Story</Button>
        </div>
      </div>
    </section>
  )
}
