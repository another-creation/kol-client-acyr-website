import { useEffect } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'

/**
 * useReveal — scroll-into-view fade-up.
 *
 * IntersectionObserver-backed (cheaper than ScrollTrigger for one-shot
 * reveals). Animates opacity 0→1 + translateY(y)→0 once per element, then
 * stops observing. When the parent contains multiple `[data-reveal]` children,
 * the hook staggers them in cascade.
 *
 * @param {React.RefObject} ref — container ref. Either the ref's element or
 *   its `[data-reveal]` descendants get animated.
 * @param {object} opts
 * @param {number} opts.y          — translateY start (default 24px)
 * @param {number} opts.duration   — seconds (default 0.8)
 * @param {number} opts.delay      — initial delay before the first child (default 0)
 * @param {number} opts.stagger    — seconds between children (default 0.08)
 * @param {string} opts.ease       — GSAP ease string (default 'power2.out')
 * @param {number} opts.threshold  — IO intersection threshold (default 0.15)
 *
 * Reduced motion: snaps targets to opacity 1 / translateY 0, no animation.
 */
export default function useReveal(ref, opts = {}) {
  const {
    y = 14,
    duration = 0.45,
    delay = 0,
    stagger = 0.05,
    ease = 'power2.out',
    threshold = 0.15,
  } = opts

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const targets = root.matches?.('[data-reveal]')
      ? [root]
      : Array.from(root.querySelectorAll('[data-reveal]'))
    if (targets.length === 0) return

    if (prefersReducedMotion()) {
      gsap.set(targets, { opacity: 1, y: 0 })
      return
    }

    gsap.set(targets, { opacity: 0, y })

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const idx = targets.indexOf(entry.target)
          gsap.to(entry.target, {
            opacity: 1,
            y: 0,
            duration,
            delay: delay + idx * stagger,
            ease,
            overwrite: 'auto',
          })
          io.unobserve(entry.target)
        })
      },
      { threshold, rootMargin: '0px 0px -10% 0px' },
    )

    targets.forEach((el) => io.observe(el))

    return () => io.disconnect()
  }, [ref, y, duration, delay, stagger, ease, threshold])
}
