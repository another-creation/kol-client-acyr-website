import { useRef } from 'react'
import Button from '../atoms/Button'
import useReveal from '../../hooks/useReveal'

export default function SupportCTA() {
  const sectionRef = useRef(null)
  useReveal(sectionRef, { y: 28, duration: 0.8, stagger: 0.12, ease: 'power2.out' })

  return (
    <section
      ref={sectionRef}
      data-theme="light"
      className="bg-surface-primary px-8 py-32 flex flex-col items-center text-center gap-6 shadow-[0_-12px_40px_-24px_rgba(0,0,0,0.25),0_24px_60px_-30px_rgba(0,0,0,0.18)]"
    >
      <p data-reveal className="site-eyebrow-section">Independent Studio</p>
      <h2 data-reveal className="site-title-section max-w-[720px]" style={{ marginBottom: 0 }}>
        Support my Journey
      </h2>
      <p data-reveal className="site-subline-hero opacity-60 max-w-[600px]">
        When you buy from Another Creation you support an independent atelier,
        not a factory floor. Made to order. Made to last.
      </p>
      <div data-reveal className="flex flex-wrap gap-3 justify-center mt-4">
        <Button size="lg" variant="primary">Shop Collection</Button>
        <Button size="lg" variant="ghost">Learn More</Button>
      </div>
    </section>
  )
}
