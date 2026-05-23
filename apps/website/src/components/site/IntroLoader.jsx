import { useEffect, useState } from 'react'
import { KolLogo } from '@ac/brand-data/logos'

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
const COUNT_DURATION_MS = 1400
const PANEL_SLIDE_MS = 600    // each panel's slide-up duration
const PANEL_STAGGER_MS = 220  // delay before the magenta panel follows the black
const EXIT_DURATION_MS = PANEL_SLIDE_MS + PANEL_STAGGER_MS // total before 'done'

// Bottom-left word flips through these as the % counts up (lands on the last).
const LOADER_WORDS = ['Loading', 'Another', 'Creation', 'Reykjavik', 'X YR X', 'and', 'Welcome']

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

/* ─── 375.studio style: centered logo, word-loop + "%", color-slide exit ──── */
const WORD_FLIP_MS = 160

function PercentageLoader({ pct, exiting }) {
  const [wordIdx, setWordIdx] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setWordIdx((i) => (i + 1) % LOADER_WORDS.length), WORD_FLIP_MS)
    return () => clearInterval(id)
  }, [])
  const word = LOADER_WORDS[wordIdx]

  // Stacked panels both slide up on exit; magenta is staggered so the black
  // loader lifts first to reveal it, then magenta lifts to reveal the page.
  const slide = (delay) => ({
    transform: exiting ? 'translateY(-100%)' : 'translateY(0)',
    transition: `transform ${PANEL_SLIDE_MS}ms cubic-bezier(0.76, 0, 0.24, 1) ${delay}ms`,
  })

  return (
    <>
      {/* magenta wipe — sits behind the black loader, revealed then lifts away */}
      <div
        className="fixed inset-0 z-[101] bg-brand-magenta-200 pointer-events-none will-change-transform"
        style={slide(PANEL_STAGGER_MS)}
        aria-hidden="true"
      />

      {/* black loader: centered logo + word (bottom-left) + % (bottom-right) */}
      <div
        className="fixed inset-0 z-[102] bg-grey-900 text-grey-100 pointer-events-none will-change-transform"
        style={slide(0)}
        aria-hidden="true"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <KolLogo variant="logomark" className="h-[34vh] w-auto" />
        </div>
        <span
          className="absolute left-8 bottom-8 font-narrow font-light leading-none block"
          style={{ fontSize: '8vw' }}
        >
          {word}
        </span>
        <span
          className="absolute right-8 bottom-8 font-narrow font-light leading-none block"
          style={{ fontSize: '8vw' }}
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
