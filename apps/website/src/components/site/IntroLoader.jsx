import { useEffect, useState } from 'react'

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
const EXIT_DURATION_MS  = 700

export default function IntroLoader({ variant = 'percentage' }) {
  const [phase, setPhase] = useState('checking') // checking | counting | exiting | done
  const [pct, setPct] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem(SHOWN_KEY)) {
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
          sessionStorage.setItem(SHOWN_KEY, String(Date.now()))
          setPhase('done')
        }, EXIT_DURATION_MS)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  if (phase === 'done' || phase === 'checking') return null

  if (variant === 'wedge') {
    return <WedgeLoader pct={pct} exiting={phase === 'exiting'} />
  }
  return <PercentageLoader pct={pct} exiting={phase === 'exiting'} />
}

/* ─── 375.studio style: bottom-corners, scale-up-as-it-counts ──────────── */
function PercentageLoader({ pct, exiting }) {
  // Scale 0.4 → 1 over the count duration, mirrors 375.studio
  const scale = 0.4 + (pct / 100) * 0.6
  return (
    <div
      className="fixed inset-0 z-[100] bg-grey-900 text-grey-100 pointer-events-none"
      style={{
        opacity: exiting ? 0 : 1,
        transition: `opacity ${EXIT_DURATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      }}
      aria-hidden="true"
    >
      <div className="absolute left-8 bottom-8 origin-bottom-left">
        <span
          className="font-narrow font-light leading-none block"
          style={{
            fontSize: '8vw',
            transform: `scale(${scale})`,
            transformOrigin: 'left bottom',
            transition: 'transform 80ms linear',
          }}
        >
          Loading
        </span>
      </div>
      <div className="absolute right-8 bottom-8 origin-bottom-right">
        <span
          className="font-narrow font-light leading-none block"
          style={{
            fontSize: '8vw',
            transform: `scale(${scale})`,
            transformOrigin: 'right bottom',
            transition: 'transform 80ms linear',
          }}
        >
          {pct}%
        </span>
      </div>
    </div>
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
