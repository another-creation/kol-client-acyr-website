import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Icon from '../loaders/icons/Icon'
import { gsap, prefersReducedMotion } from '../../lib/gsap'

const linkStyle = {
  color: 'var(--ac-surface-on-primary)',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  textDecoration: 'none',
}

function NavLink({ label, to, onClick }) {
  const className = `ac-site-nav-link site-link-nav`
  if (to) {
    return (
      <Link to={to} onClick={onClick} className={className} style={linkStyle}>
        {label}
      </Link>
    )
  }
  return (
    <span onClick={onClick} className={className} style={linkStyle}>
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
    <div className="ac-site-nav-cluster flex items-center gap-6">
      {leftLinks.map(l => (
        <NavLink key={l.label} label={l.label} to={l.to} onClick={() => onNavigate?.(l.label.toLowerCase())} />
      ))}
    </div>
  )

  const logoNode = logo && (
    <Link to={logoTo} style={{ ...linkStyle, userSelect: 'none', display: 'inline-flex', alignItems: 'center' }}>
      {logo}
    </Link>
  )

  const rightCluster = (
    <div className="ac-site-nav-cluster flex items-center gap-5 justify-end">
      {rightLinks.map(l => (
        <NavLink key={l.label} label={l.label} to={l.to} />
      ))}
      {rightActions}
    </div>
  )

  const hamburger = (
    <button
      type="button"
      className="ac-site-nav-hamburger"
      aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={mobileOpen}
      onClick={() => setMobileOpen((v) => !v)}
    >
      <Icon name={mobileOpen ? 'x' : 'menu'} size={18} />
    </button>
  )

  const navRef = useRef(null)
  useEffect(() => {
    if (prefersReducedMotion()) return
    if (!navRef.current) return
    const tl = gsap.timeline()
    tl.from(navRef.current, { y: -24, opacity: 0, duration: 0.6, ease: 'power2.out' })
    tl.from(navRef.current.querySelectorAll('.ac-site-nav-link, .ac-site-nav-cluster > *'),
      { opacity: 0, y: -8, duration: 0.5, stagger: 0.05, ease: 'power2.out' }, '-=0.3')
    return () => tl.kill()
  }, [])

  return (
    <>
      <nav
        ref={navRef}
        className={`ac-site-nav bg-surface-tertiary${variant === 'center' ? ' is-center' : ''}${hidden ? ' is-hidden' : ''}`}
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
        className={`ac-site-nav-backdrop${mobileOpen ? ' is-open' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      <div className={`ac-site-nav-drawer${mobileOpen ? ' is-open' : ''}`} aria-hidden={!mobileOpen}>
        <div className="ac-site-nav-drawer-inner">
          {leftLinks.map(l => (
            <NavLink key={l.label} label={l.label} to={l.to} onClick={() => { onNavigate?.(l.label.toLowerCase()); setMobileOpen(false) }} />
          ))}
          {rightLinks.map(l => (
            <NavLink key={l.label} label={l.label} to={l.to} onClick={() => setMobileOpen(false)} />
          ))}
          {rightActions && (
            <div className="ac-site-nav-drawer-actions" style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
              {rightActions}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
