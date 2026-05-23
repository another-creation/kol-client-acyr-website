import { useState } from 'react'
import IntroLoader from '../../components/site/IntroLoader'
import Button from '../../components/atoms/Button'

/**
 * /loader — dev workbench for IntroLoader.
 *
 * Renders the loader with `forcePlay` (bypasses the once-per-session gate) and
 * a key that remounts it on demand, so it can be replayed and A/B'd freely
 * while iterating. Not linked in nav — dev-only route.
 */
export default function LoaderDev() {
  const [runId, setRunId] = useState(1)
  const [variant, setVariant] = useState('percentage')

  const replay = () => setRunId((n) => n + 1)
  const pick = (v) => { setVariant(v); setRunId((n) => n + 1) }

  return (
    <main className="min-h-dvh bg-surface-primary text-emphasis flex flex-col items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="site-eyebrow-section">Dev</p>
        <h1 className="site-title-section">Loader workbench</h1>
        <p className="site-meta-system">variant: {variant} · run #{runId}</p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Button size="lg" variant={variant === 'percentage' ? 'primary' : 'ghost'} onClick={() => pick('percentage')}>
          Percentage
        </Button>
        <Button size="lg" variant={variant === 'wedge' ? 'primary' : 'ghost'} onClick={() => pick('wedge')}>
          Wedge
        </Button>
        <Button size="lg" variant="secondary" onClick={replay}>
          Replay
        </Button>
      </div>

      <IntroLoader key={`${variant}-${runId}`} variant={variant} forcePlay />
    </main>
  )
}
