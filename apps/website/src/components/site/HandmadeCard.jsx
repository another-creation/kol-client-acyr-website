import { useEffect, useRef, useState } from 'react'
import { ACImages } from '@ac/brand-data/images'
import { prefersReducedMotion } from '../../lib/gsap'
import Button from '../atoms/Button'

// Rotating image deck. Last entry is the canonical hero image — order matters
// because the timer cycles forward and loops back to start.
const DECK = [
  ACImages.handmade,
  '/brand/photoshoot/33a4480.jpg',
  '/brand/photoshoot/33a4660.jpg',
  '/brand/photoshoot/33a4806.jpg',
]

const INTERVAL_MS = 4000  // each image holds for 4s
const CROSSFADE_MS = 800

export default function HandmadeCard() {
  const [idx, setIdx] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    timerRef.current = setInterval(() => {
      setIdx((i) => (i + 1) % DECK.length)
    }, INTERVAL_MS)
    return () => clearInterval(timerRef.current)
  }, [])

  return (
    <section className="relative h-[90vh] min-h-[560px] flex items-end p-16 overflow-hidden bg-surface-secondary">
      {/* Image deck — crossfade between deck entries */}
      {DECK.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 bg-cover"
          style={{
            backgroundImage: `url(${src})`,
            backgroundPosition: 'center 40%',
            opacity: i === idx ? 1 : 0,
            transition: `opacity ${CROSSFADE_MS}ms ease-in-out`,
          }}
          aria-hidden="true"
        />
      ))}

      {/* Gradient overlay */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)' }}
      />

      {/* Progress timer — thin bar across the top, refilling per interval */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-fg-08 z-10" aria-hidden="true">
        <div
          key={idx}
          className="h-full bg-fg-64"
          style={{
            transformOrigin: 'left',
            animation: prefersReducedMotion() ? 'none' : `ac-timer-fill ${INTERVAL_MS}ms linear forwards`,
          }}
        />
      </div>

      <div data-theme="dark" className="relative flex flex-col gap-5 max-w-[480px]">
        <h2 className="site-title-section uppercase">
          Handmade &amp;<br />tailored<br />to your needs
        </h2>
        <div className="mt-2">
          <Button size="lg" variant="ghost">Shop Jackets</Button>
        </div>
      </div>

      <style>{`
        @keyframes ac-timer-fill {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
    </section>
  )
}
