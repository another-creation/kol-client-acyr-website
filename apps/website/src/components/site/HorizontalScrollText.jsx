import { useRef } from 'react'
import { gsap, SplitText, useGSAP, prefersReducedMotion } from '../../lib/gsap'

/**
 * HorizontalScrollText — autoplay "river of words" OVERLAY.
 *
 * Renders as an absolute inset-0 overlay (transparent, pointer-events-none) so
 * it sits on top of a hero image. The line flows left continuously (a marquee
 * loop — NOT tied to scroll). Each letter is scattered (random y + rotation)
 * while on the right of the viewport and eases to the baseline as it flows
 * left, creating a river that calms in the centre, scatters at the edge.
 *
 * Place inside a `relative overflow-hidden` hero. Reduced motion: static line.
 */
const FLOW_SPEED = 300 // px per second

export default function HorizontalScrollText({ text }) {
  const wrapRef = useRef(null)
  const rowRef = useRef(null)

  useGSAP(() => {
    if (prefersReducedMotion()) return
    const row = rowRef.current
    if (!row) return
    const copies = row.querySelectorAll('.river-copy')
    if (copies.length < 2) return

    const split = SplitText.create(copies, { type: 'chars' })
    const copyWidth = copies[1].offsetLeft - copies[0].offsetLeft

    const items = split.chars.map((el) => ({
      setY: gsap.quickSetter(el, 'yPercent'),
      setR: gsap.quickSetter(el, 'rotation', 'deg'),
      baseX: el.offsetLeft,
      y: gsap.utils.random(-130, 130),
      r: gsap.utils.random(-22, 22),
    }))

    const tween = gsap.to(row, { x: -copyWidth, duration: copyWidth / FLOW_SPEED, ease: 'none', repeat: -1 })

    const update = () => {
      const rowX = gsap.getProperty(row, 'x')
      const vw = window.innerWidth
      for (const it of items) {
        const screenX = it.baseX + rowX
        const t = gsap.utils.clamp(0, 1, (screenX - vw * 0.3) / (vw * 0.7))
        it.setY(it.y * t)
        it.setR(it.r * t)
      }
    }
    gsap.ticker.add(update)

    return () => {
      gsap.ticker.remove(update)
      tween.kill()
      split.revert()
    }
  }, { scope: wrapRef })

  const copyClass = 'river-copy font-narrow font-medium text-emphasis pr-[4vw]'
  const copyStyle = { fontSize: 'clamp(4rem, 16vw, 12rem)', lineHeight: 1.1 }

  if (prefersReducedMotion()) {
    return (
      <div data-theme="dark" className="absolute inset-0 flex items-center overflow-hidden pointer-events-none">
        <span className={copyClass} style={copyStyle}>{text}</span>
      </div>
    )
  }

  return (
    <div ref={wrapRef} data-theme="dark" className="absolute inset-0 flex items-center overflow-hidden pointer-events-none">
      <div ref={rowRef} className="relative opacity-1 top-[350px] flex w-max whitespace-nowrap will-change-transform">
        <span className={copyClass} style={copyStyle}>{text}</span>
        <span className={copyClass} style={copyStyle} aria-hidden="true">{text}</span>
      </div>
    </div>
  )
}
