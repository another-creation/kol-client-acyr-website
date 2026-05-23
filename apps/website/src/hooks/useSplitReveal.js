import { useEffect } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap'

/**
 * useSplitReveal — per-character entry animation on a text element.
 *
 * Manually splits the element's text content into per-character spans (one
 * span per visible character; spaces preserved as inline-block spacers).
 * Animates each span with opacity 0→1 + x-displacement → 0, staggered.
 * Mirrors the 375.studio "Featured" character-displacement reveal without
 * needing the paid SplitText plugin.
 *
 * The hook handles its own split + cleanup. Idempotent across rerenders by
 * checking for a `data-split-done` marker.
 *
 * @param {React.RefObject} ref — element whose `textContent` will be split
 * @param {object} opts
 * @param {number} opts.x         — translateX start, applied alternating ± per char (default 8px)
 * @param {number} opts.duration  — seconds per char (default 0.9)
 * @param {number} opts.stagger   — seconds between chars (default 0.03)
 * @param {number} opts.delay     — initial delay (default 0)
 * @param {string} opts.ease      — GSAP ease string (default 'power3.out')
 * @param {boolean} opts.scroll   — true = trigger on scroll-into-view; false = on mount (default false)
 *
 * Reduced motion: skips split entirely. Original text stays in place.
 */
export default function useSplitReveal(ref, opts = {}) {
  const {
    x = 8,
    duration = 0.9,
    stagger = 0.03,
    delay = 0,
    ease = 'power3.out',
    scroll = false,
  } = opts

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) return
    if (el.dataset.splitDone === '1') return

    const text = el.textContent ?? ''
    if (!text) return

    // Build per-character spans. Spaces become non-animated spacers so the
    // line breaks behave naturally.
    const frag = document.createDocumentFragment()
    const chars = []
    for (let i = 0; i < text.length; i++) {
      const ch = text[i]
      if (ch === ' ') {
        frag.appendChild(document.createTextNode(' '))
        continue
      }
      const span = document.createElement('span')
      span.textContent = ch
      span.style.display = 'inline-block'
      span.style.willChange = 'transform, opacity'
      frag.appendChild(span)
      chars.push(span)
    }
    el.textContent = ''
    el.appendChild(frag)
    el.dataset.splitDone = '1'

    // Alternate ± x for a slight scatter feel (mirrors 375.studio).
    gsap.set(chars, {
      opacity: 0,
      x: (i) => (i % 2 === 0 ? -x : x),
    })

    const run = () => {
      gsap.to(chars, {
        opacity: 1,
        x: 0,
        duration,
        stagger,
        delay,
        ease,
      })
    }

    if (scroll) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              run()
              io.disconnect()
            }
          })
        },
        { threshold: 0.3 },
      )
      io.observe(el)
      return () => io.disconnect()
    }

    run()
  }, [ref, x, duration, stagger, delay, ease, scroll])
}
