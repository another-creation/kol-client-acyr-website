import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import Nav from './Nav'
import Footer from './Footer'
import Icon from '../loaders/icons/Icon'
import { CartProvider, useCart } from './CartContext'
import CartDrawer from './CartDrawer'
import WebsiteSearch from './WebsiteSearch'
import IntroLoader from './IntroLoader'
import { BRAND } from '@ac/brand-data/config'
import { KolLogo } from '@ac/brand-data/logos'

const NAV_LEFT = [
  { label: 'Shop',        to: '/shop' },
  { label: 'Collections', to: '/collections' },
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

/* `labelled` — drawer variant. In the drawer the button sits in a column of
 * word links, so a lone glyph reads as an orphan; in the header it sits among
 * icons, where a word would be. */
function CartIcon({ labelled = false }) {
  const { itemCount, openCart } = useCart()
  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Open bag (${itemCount})`}
      /* In the drawer the button stacks under the text links, which have no
         padding — drop the left inset so the icon sits on their left edge. */
      style={labelled ? { ...iconBtnStyle, paddingLeft: 0 } : iconBtnStyle}
      className="ac-site-nav-link site-link-nav"
    >
      <Icon name="shopping-bag" size={16} />
      {labelled && <span style={{ marginLeft: 10 }}>Bag</span>}
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
        leftLinks={NAV_LEFT}
        logo={<KolLogo variant="lockup-hori" height={36} aria-label={BRAND.name} />}
        logoTo="/"
        rightActions={
          <span className="flex items-center gap-3" style={{ color: 'var(--ac-surface-on-primary)' }}>
            <CartIcon />
          </span>
        }
        drawerActions={
          <span className="flex items-center gap-3" style={{ color: 'var(--ac-surface-on-primary)' }}>
            <CartIcon labelled />
          </span>
        }
      />
      {/* .ac-site-nav is position:fixed — out of flow — so the page must reserve
          its height here, or every route's first 64px renders under the bar. */}
      <div className="flex-1 pt-[var(--ac-topnav-h)]">
        <Outlet />
      </div>
      {!isCheckout && <Footer variant="lead" />}
      {!isCheckout && <CartDrawer />}
      <WebsiteSearch open={searchOpen} setOpen={setSearchOpen} />
      <IntroLoader variant="percentage" forcePlay />
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
