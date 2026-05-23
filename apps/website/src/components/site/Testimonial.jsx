import { useRef } from 'react'
import useReveal from '../../hooks/useReveal'

export default function Testimonial({ kicker, quote, cite }) {
  const containerRef = useRef(null)

  // Kicker, quote, cite fade up in sequence — quote reveals as a single block.
  useReveal(containerRef, { y: 14, duration: 0.45, stagger: 0.06, ease: 'power2.out' })

  return (
    <section className="bg-surface-primary text-on-primary px-5 md:px-8 lg:px-14 py-16 md:py-24">
      <div ref={containerRef} className="max-w-[1200px] h-[600px] mx-auto flex flex-col justify-center text-center">
        <p data-reveal className="mb-8 site-eyebrow-section">{kicker}</p>
        <p data-reveal className="site-quote before:content-['“'] before:text-accent-primary before:opacity-70 after:content-['”'] after:text-accent-primary after:opacity-70">{quote}</p>
        <p data-reveal className="mt-10 site-quote-cite before:content-['—_']">{cite}</p>
      </div>
    </section>
  )
}
