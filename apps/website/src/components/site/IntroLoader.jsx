import { useEffect, useRef, useState } from 'react'
import { gsap, SplitText, useGSAP, prefersReducedMotion } from '../../lib/gsap'

/**
 * IntroLoader — session-once cold-visit loader.
 *
 * Two variants for A/B'ing:
 *   variant="percentage" — 375.studio style. Solid surface, "Loading"
 *     bottom-left + "NN%" bottom-right, both scale up with progress,
 *     fade out at completion.
 *   variant="wedge" — good-fella style. Brand-color full-bleed +
 *     "LOADING" + 3-block animated indicator centered, exits via a
 *     diagonal clip-path slide toward bottom-right.
 *
 * Gated by sessionStorage('kol.ac.intro.shown') so it only fires on
 * cold visit per session. To force-replay during dev:
 *   sessionStorage.removeItem('kol.ac.intro.shown')
 */

const SHOWN_KEY = 'kol.ac.intro.shown'
const COUNT_DURATION_MS = 1867
const PANEL_SLIDE_MS = 600    // each panel's slide-up duration
const PANEL_STAGGER_MS = 220  // delay between each panel in the train
const EXIT_DURATION_MS = PANEL_SLIDE_MS + PANEL_STAGGER_MS * 2 // last panel clears

export default function IntroLoader({ variant = 'percentage', forcePlay = false }) {
  const [phase, setPhase] = useState('checking') // checking | counting | exiting | done
  const [pct, setPct] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    // forcePlay (the /loader dev page) bypasses the session gate and never
    // writes it, so the loader can be replayed freely.
    if (!forcePlay && sessionStorage.getItem(SHOWN_KEY)) {
      setPhase('done')
      return
    }
    setPhase('counting')

    const start = performance.now()
    let raf = 0
    const tick = (now) => {
      const t = Math.min(1, (now - start) / COUNT_DURATION_MS)
      // Smooth ease-out so the last 20% doesn't feel snappy
      const eased = 1 - Math.pow(1 - t, 2)
      setPct(Math.round(eased * 100))
      if (t < 1) raf = requestAnimationFrame(tick)
      else {
        setPhase('exiting')
        setTimeout(() => {
          if (!forcePlay) sessionStorage.setItem(SHOWN_KEY, String(Date.now()))
          setPhase('done')
        }, EXIT_DURATION_MS)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [forcePlay])

  if (phase === 'done' || phase === 'checking') return null

  if (variant === 'wedge') {
    return <WedgeLoader pct={pct} exiting={phase === 'exiting'} />
  }
  return <PercentageLoader pct={pct} exiting={phase === 'exiting'} />
}

/* ─── 375.studio style: "Loading" word (bottom-left) + % (bottom-right), color-slide exit ── */
function PercentageLoader({ pct, exiting }) {
  const wordRef = useRef(null)

  // Masked per-character rise: each letter sits in an overflow-hidden clip
  // (SplitText mask:'chars') and slides up from below the baseline, staggered.
  useGSAP(
    () => {
      if (!wordRef.current || prefersReducedMotion()) return
      const split = SplitText.create(wordRef.current, { type: 'chars', mask: 'chars' })
      gsap.from(split.chars, {
        yPercent: 100,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.05,
        delay: 0.15,
      })
      return () => split.revert()
    },
    { scope: wordRef },
  )

  // Stacked panels both slide up on exit; magenta is staggered so the black
  // loader lifts first to reveal it, then magenta lifts to reveal the page.
  const slide = (delay) => ({
    transform: exiting ? 'translateY(-100%)' : 'translateY(0)',
    transition: `transform ${PANEL_SLIDE_MS}ms cubic-bezier(0.76, 0, 0.24, 1) ${delay}ms`,
  })

  return (
    <>
      {/* burgundy-300 — deepest layer, lifts last to reveal the page */}
      <div
        className="fixed inset-0 z-[100] bg-brand-burgundy-300 pointer-events-none will-change-transform"
        style={slide(PANEL_STAGGER_MS * 2)}
        aria-hidden="true"
      />

      {/* cream-500 wipe — revealed when the black loader lifts */}
      <div
        className="fixed inset-0 z-[101] bg-cream-500 pointer-events-none will-change-transform"
        style={slide(PANEL_STAGGER_MS)}
        aria-hidden="true"
      />

      {/* black loader: "Loading" (bottom-left) + % (bottom-right) */}
      <div
        className="fixed inset-0 z-[102] bg-grey-900 text-grey-100 pointer-events-none will-change-transform"
        style={slide(0)}
        aria-hidden="true"
      >
        <span
          ref={wordRef}
          className="absolute left-12 bottom-12 font-thin leading-[1.3] block"
          style={{ fontFamily: "'Right Grotesk Wide'", fontSize: '5vw', transform: 'translateY(0.2em)' }}
        >
          Loading
        </span>
        <span
          className="absolute right-12 bottom-12 font-thin leading-none block"
          style={{ fontFamily: "'Right Grotesk Wide'", fontSize: '5vw', transform: 'translateY(0.2em)' }}
        >
          {pct}%
        </span>
      </div>
    </>
  )
}

/* ─── good-fella style: brand color, 3-block, clip-path wedge exit ─────── */
function WedgeLoader({ pct, exiting }) {
  // 3-block indicator: which block is active rotates through 0/1/2 based on pct
  const active = Math.floor((pct / 100) * 6) % 3

  return (
    <div
      className="fixed inset-0 z-[100] bg-brand-primary text-grey-900 pointer-events-none flex items-center justify-center"
      style={{
        // Diagonal wedge exit: clip-path shrinks from full to a wedge in bottom-right
        clipPath: exiting
          ? 'polygon(100% 100%, 100% 100%, 100% 100%, 100% 100%)'
          : 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        transition: `clip-path ${EXIT_DURATION_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`,
      }}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-3 h-3 bg-grey-900"
              style={{
                opacity: i === active ? 1 : 0.3,
                transition: 'opacity 120ms linear',
              }}
            />
          ))}
        </div>
        <span className="ac-mono-12 uppercase tracking-[0.12em]">Loading</span>
      </div>
    </div>
  )
}
