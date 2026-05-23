import { useRef } from 'react'
import useSplitReveal from '../../hooks/useSplitReveal'
import useReveal from '../../hooks/useReveal'

export default function Testimonial({ kicker, quote, cite }) {
  const containerRef = useRef(null)
  const quoteRef = useRef(null)

  // Quote: per-word reveal on scroll (using SplitReveal which we split per
  // character but with looser stagger so it reads as smooth word reveal).
  useSplitReveal(quoteRef, { delay: 0.1, duration: 1.1, stagger: 0.015, x: 4, scroll: true })

  // Kicker + cite: fade-up before and after the quote settles.
  useReveal(containerRef, { y: 16, duration: 0.7, stagger: 1.4, ease: 'power2.out' })

  return (
    <section className="bg-surface-primary text-on-primary px-5 md:px-8 lg:px-14 py-16 md:py-24">
      <div ref={containerRef} className="max-w-[1200px] h-[600px] mx-auto flex flex-col justify-center text-center">
        <p data-reveal className="mb-8 site-eyebrow-section">{kicker}</p>
        <p ref={quoteRef} className="site-quote before:content-['“'] before:text-accent-primary before:opacity-70 after:content-['”'] after:text-accent-primary after:opacity-70">{quote}</p>
        <p data-reveal className="mt-10 site-quote-cite before:content-['—_']">{cite}</p>
      </div>
    </section>
  )
}
