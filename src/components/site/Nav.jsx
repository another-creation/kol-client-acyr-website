import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Icon from '../loaders/icons/Icon'

const NARROW = "'Right Grotesk Narrow', 'Right Grotesk', sans-serif"

const linkStyle = {
  fontFamily: NARROW,
  fontSize: '11px',
  fontWeight: 400,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--kol-surface-on-primary)',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  textDecoration: 'none',
}

function NavLink({ label, to, onClick, drawer = false }) {
  if (to) {
    return (
      <Link
        to={to}
        onClick={onClick}
        className="kol-site-nav-link"
        style={drawer ? { ...linkStyle, fontSize: '14px' } : linkStyle}
      >
        {label}
      </Link>
    )
  }
  return (
    <span
      onClick={onClick}
      className="kol-site-nav-link"
      style={drawer ? { ...linkStyle, fontSize: '14px' } : linkStyle}
    >
      {label}
    </span>
  )
}

export default function Nav({
  variant = 'center',
  leftLinks = [],
  logo = null,
  logoTo = '/',
  rightLinks = [],
  rightActions = null,
  onNavigate,
}) {
  const [hidden, setHidden] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const lastY = useRef(0)
  const { pathname } = useLocation()

  useEffect(() => { setMobileOpen(false) }, [pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e) => { if (e.key === 'Escape') setMobileOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      if (y <= 0) setHidden(false)
      else if (y > lastY.current + 4) setHidden(true)
      else if (y < lastY.current - 4) setHidden(false)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const leftCluster = (
    <div className="kol-site-nav-cluster flex items-center gap-6">
      {leftLinks.map(l => (
        <NavLink key={l.label} label={l.label} to={l.to} onClick={() => onNavigate?.(l.label.toLowerCase())} />
      ))}
    </div>
  )

  const logoNode = logo && (
    <Link to={logoTo} style={{ ...linkStyle, fontSize: '16px', fontWeight: 700, letterSpacing: '0.14em', userSelect: 'none', display: 'inline-flex', alignItems: 'center' }}>
      {logo}
    </Link>
  )

  const rightCluster = (
    <div className="kol-site-nav-cluster flex items-center gap-5 justify-end">
      {rightLinks.map(l => (
        <NavLink key={l.label} label={l.label} to={l.to} />
      ))}
      {rightActions}
    </div>
  )

  const hamburger = (
    <button
      type="button"
      className="kol-site-nav-hamburger"
      aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={mobileOpen}
      onClick={() => setMobileOpen((v) => !v)}
    >
      <Icon name={mobileOpen ? 'x' : 'menu'} size={18} />
    </button>
  )

  return (
    <>
      <nav
        className={`kol-site-nav${variant === 'center' ? ' is-center' : ''}${hidden ? ' is-hidden' : ''}`}
      >
        {variant === 'center' ? (
          <>
            {leftCluster}
            {logoNode}
            {rightCluster}
            {hamburger}
          </>
        ) : (
          <>
            {logoNode}
            {rightCluster}
            {hamburger}
          </>
        )}
      </nav>

      <div
        className={`kol-site-nav-backdrop${mobileOpen ? ' is-open' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      <div className={`kol-site-nav-drawer${mobileOpen ? ' is-open' : ''}`} aria-hidden={!mobileOpen}>
        <div className="kol-site-nav-drawer-inner">
          {leftLinks.map(l => (
            <NavLink key={l.label} label={l.label} to={l.to} drawer onClick={() => { onNavigate?.(l.label.toLowerCase()); setMobileOpen(false) }} />
          ))}
          {rightLinks.map(l => (
            <NavLink key={l.label} label={l.label} to={l.to} drawer onClick={() => setMobileOpen(false)} />
          ))}
          {rightActions && (
            <div className="kol-site-nav-drawer-actions" style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
              {rightActions}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
