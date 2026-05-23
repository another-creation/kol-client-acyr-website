import { useRef } from 'react'
import { gsap, useGSAP, prefersReducedMotion } from '../../lib/gsap'
import Button from '../atoms/Button'
import useReveal from '../../hooks/useReveal'

const IMAGE = '/brand/supportCTA.jpg'

export default function SupportCTA() {
  const sectionRef = useRef(null)
  const imgRef = useRef(null)
  useReveal(sectionRef, { y: 14, duration: 0.45, stagger: 0.06, ease: 'power2.out' })

  // Parallax — the (oversized) image drifts slower than scroll inside its
  // rounded frame, giving the card depth.
  useGSAP(() => {
    if (prefersReducedMotion()) return
    gsap.fromTo(
      imgRef.current,
      { yPercent: -8 },
      {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    )
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} data-theme="light" className="relative bg-surface-primary p-6 lg:p-12 overflow-hidden">
      {/* marble texture over the light surface, 15% */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: 'url(/brand/textures/ac-marble.jpg)', opacity: 0.15 }}
      />

      <div className="relative flex flex-col lg:flex-row lg:items-end gap-8 lg:gap-12 lg:h-[80vh]">
        {/* image — rounded frame; oversized image inside parallaxes for depth */}
        <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:flex-1 lg:self-stretch overflow-hidden rounded-[4px] bg-surface-secondary">
          <img
            ref={imgRef}
            src={IMAGE}
            alt=""
            className="absolute inset-x-0 -top-[10%] h-[120%] w-full object-cover will-change-transform"
          />
        </div>

        {/* text column — fixed 397px on desktop, bottom-aligned */}
        <div className="w-full lg:w-[397px] shrink-0 lg:pb-8 flex flex-col items-start gap-8">
          <div data-reveal className="self-stretch flex flex-col items-start gap-2">
            <p className="site-eyebrow-section">Independent Studio</p>
            <div className="self-stretch flex flex-col items-start gap-6">
              <h2 className="site-title-section" style={{ marginBottom: 0 }}>
                Support my Journey
              </h2>
              <p className="site-subline-hero">
                When you buy from Another Creation you support an independent atelier,
                not a factory floor. Made to order. Made to last.
              </p>
            </div>
          </div>
          <div data-reveal className="flex items-center gap-5">
            <Button size="md" variant="primary">Shop Collection</Button>
            <Button size="md" variant="secondary">Learn More</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
