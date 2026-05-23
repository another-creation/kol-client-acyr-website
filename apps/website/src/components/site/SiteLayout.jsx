import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import Nav from './Nav'
import ThemeToggle from '../framework/ThemeToggle'
import Footer from './Footer'
import Icon from '../loaders/icons/Icon'
import { CartProvider, useCart } from './CartContext'
import CartDrawer from './CartDrawer'
import WebsiteSearch from './WebsiteSearch'
import SignupOverlay from './SignupOverlay'
import IntroLoader from './IntroLoader'
import { BRAND } from '@ac/brand-data/config'
import { KolLogo } from '@ac/brand-data/logos'

const NAV_LEFT = [
  { label: 'Shop',        to: '/shop' },
  { label: 'Handmade',    to: '/handmade' },
  { label: 'Collections', to: '/collections' },
  { label: 'Journal',     to: '/journal' },
  { label: 'About',       to: '/about' },
  { label: 'Contact',     to: '/contact' },
]

const iconBtnStyle = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--ac-surface-on-primary)',
  display: 'flex',
  alignItems: 'center',
  padding: '4px',
  position: 'relative',
}

const cartBadgeStyle = {
  position: 'absolute',
  top: 0,
  right: 0,
  minWidth: 14,
  height: 14,
  padding: '0 3px',
  borderRadius: 7,
  background: 'var(--ac-accent-primary)',
  color: 'var(--ac-surface-on-primary)',
  fontFamily: 'var(--ac-font-family-mono)',
  fontSize: 9,
  fontWeight: 600,
  lineHeight: '14px',
  textAlign: 'center',
}

function CartIcon() {
  const { itemCount, openCart } = useCart()
  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Open bag (${itemCount})`}
      style={iconBtnStyle}
      className="ac-site-nav-link"
    >
      <Icon name="shopping-bag" size={16} />
      {itemCount > 0 && <span style={cartBadgeStyle}>{itemCount}</span>}
    </button>
  )
}

function SiteShell() {
  const { pathname } = useLocation()
  const isCheckout = pathname.startsWith('/checkout')
  const [searchOpen, setSearchOpen] = useState(false)
  return (
    <div className="font-display bg-surface-primary text-emphasis min-h-dvh flex flex-col">
      <Nav
        variant="center"
        leftLinks={NAV_LEFT}
        logo={<KolLogo variant="lockup-hori" height={36} aria-label={BRAND.name} />}
        logoTo="/"
        rightActions={
          <span className="flex items-center gap-3" style={{ color: 'var(--ac-surface-on-primary)' }}>
            <ThemeToggle />
            <CartIcon />
          </span>
        }
      />
      <div className="flex-1">
        <Outlet />
      </div>
      {!isCheckout && <Footer variant="lead" />}
      {!isCheckout && <CartDrawer />}
      <WebsiteSearch open={searchOpen} setOpen={setSearchOpen} />
      {!isCheckout && <SignupOverlay />}
      <IntroLoader variant="percentage" />
    </div>
  )
}

export default function SiteLayout() {
  return (
    <CartProvider>
      <SiteShell />
    </CartProvider>
  )
}
