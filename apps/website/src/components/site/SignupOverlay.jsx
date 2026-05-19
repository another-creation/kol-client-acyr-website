import { useEffect, useState } from 'react'
import Icon from '../loaders/icons/Icon'
import Button from '../atoms/Button'

const DISMISS_KEY = 'kol.ac.signup.dismissed'
const SEEN_KEY    = 'kol.ac.signup.seen'

const SEGMENTS = ['SHOP', 'HANDMADE', 'COLLECTIONS', 'JOURNAL']
const IMAGE    = '/brand/photoshoot/33a4480.jpg'

export default function SignupOverlay() {
  // 'closed' = dismissed (gone), 'collapsed' = sidelabel, 'open' = overlay
  const [state, setState] = useState('collapsed')

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (localStorage.getItem(DISMISS_KEY) === '1') { setState('closed'); return }
    if (!sessionStorage.getItem(SEEN_KEY)) {
      sessionStorage.setItem(SEEN_KEY, '1')
      setState('open')
    }
  }, [])

  const dismiss  = () => { localStorage.setItem(DISMISS_KEY, '1'); setState('closed') }
  const collapse = () => setState('collapsed')
  const open     = () => setState('open')

  if (state === 'closed') return null

  if (state === 'collapsed') {
    return (
      <button
        type="button"
        onClick={open}
        aria-label="Unlock 15% off"
        className="fixed left-0 top-1/2 -translate-y-1/2 z-40 flex items-center gap-2 bg-surface-inverse text-auto py-2 px-2 [writing-mode:vertical-rl] rotate-180 ac-sans-nav text-[16px] hover:bg-grey-800 transition-colors"
      >
        <span
          role="button"
          tabIndex={0}
          aria-label="Dismiss"
          onClick={(e) => { e.stopPropagation(); dismiss() }}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); dismiss() } }}
          className="rotate-90 inline-flex opacity-70 hover:opacity-100"
        >
          <Icon name="close" size={12} />
        </span>
        UNLOCK 15% OFF
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 grid grid-cols-1 md:grid-cols-2 bg-surface-primary text-auto">
      <button
        type="button"
        onClick={collapse}
        aria-label="Close"
        className="absolute top-4 left-4 z-10 p-2 hover:opacity-70"
      >
        <Icon name="close" size={20} />
      </button>

      <div className="flex flex-col items-center justify-center text-center px-12 py-16 gap-8">
        <div className="ac-helper-20 text-fg-64">Another Creation</div>
        <h2 className="ac-sans-heading-02 uppercase text-[64px]!">15% off your first order</h2>
        <p className="ac-helper-12 text-fg-48">Start by telling us what you're shopping for:</p>
        <div className="flex flex-col gap-3 w-full max-w-[360px]">
          {SEGMENTS.map((label) => (
            <Button key={label} variant="secondary" size="lg" className="w-full" onClick={collapse}>
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div
        className="hidden md:block bg-cover bg-center"
        style={{ backgroundImage: `url(${IMAGE})` }}
        role="img"
        aria-label="Another Creation photoshoot"
      />
    </div>
  )
}
