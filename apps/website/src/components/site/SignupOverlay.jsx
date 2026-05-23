import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Icon from '../loaders/icons/Icon'
import Button from '../atoms/Button'

const SHOWN_KEY      = 'kol.ac.signup.lastShown'
const ONE_DAY_MS     = 24 * 60 * 60 * 1000
/* Sidelabel + auto-open trigger only show on home + commerce surfaces. */
const VISIBLE_ROUTES = ['/', '/shop', '/handmade']
const BOTTOM_OFFSET  = 50
const TOP_OFFSET     = 100

const SEGMENTS = [
  { label: 'SHOP',        to: '/shop' },
  { label: 'HANDMADE',    to: '/handmade' },
  { label: 'COLLECTIONS', to: '/collections' },
  { label: 'JOURNAL',     to: '/journal' },
]
const IMAGE    = '/brand/photoshoot/33a4480.jpg'

export default function SignupOverlay() {
  // 'collapsed' = sidelabel, 'open' = overlay, 'hidden' = label dismissed this session
  const [state, setState] = useState('collapsed')
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const open = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(SHOWN_KEY, String(Date.now()))
    }
    setState('open')
  }
  const collapse = () => setState('collapsed')
  const hide     = () => setState('hidden')

  useEffect(() => {
    if (state !== 'collapsed') return
    if (!VISIBLE_ROUTES.includes(pathname)) return
    if (typeof window === 'undefined') return

    const lastShown = Number(localStorage.getItem(SHOWN_KEY) || 0)
    if (Date.now() - lastShown < ONE_DAY_MS) return

    let armed = false
    const onScroll = () => {
      const { scrollY, innerHeight } = window
      const docHeight = document.documentElement.scrollHeight
      if (!armed && scrollY + innerHeight >= docHeight - BOTTOM_OFFSET) {
        armed = true
      }
      if (armed && scrollY < TOP_OFFSET) {
        open()
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [state, pathname])

  if (state === 'hidden') return null
  if (!VISIBLE_ROUTES.includes(pathname)) return null

  if (state === 'collapsed') {
    return (
      <button
        type="button"
        onClick={open}
        aria-label="Unlock 15% off"
        className="fixed left-0 top-1/2 -translate-y-1/2 z-40 flex items-center gap-2 bg-surface-inverse text-auto py-2 px-2 rounded-l-[2px] [writing-mode:vertical-rl] rotate-180 site-link-nav text-[16px] hover:bg-grey-800 transition-colors"
      >
        <span
          role="button"
          tabIndex={0}
          aria-label="Dismiss"
          onClick={(e) => { e.stopPropagation(); hide() }}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.stopPropagation(); hide() } }}
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
        <p className="site-display-eyebrow">Another Creation</p>
        <h2 className="site-title-section uppercase">Where would you like to start?</h2>
        <div className="flex flex-col gap-3 w-full max-w-[360px]">
          {SEGMENTS.map(({ label, to }) => (
            <Button
              key={label}
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => { collapse(); navigate(to) }}
            >
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
