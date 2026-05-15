import { Link, Outlet } from 'react-router-dom'
import Nav from './Nav'
import ThemeToggle from '../framework/ThemeToggle'
import Footer from './Footer'
import Icon from '../loaders/icons/Icon'
import { CartProvider, useCart } from './CartContext'
import '../../brand/kol-brand-typography.css'

const NAV_LEFT = [
  { label: 'Shop',        to: '/shop' },
  { label: 'Handmade',    to: '/handmade' },
  { label: 'Collections', to: '/collections' },
  { label: 'Journal',     to: '/blog' },
  { label: 'About',       to: '/about' },
  { label: 'Contact',     to: '/contact' },
]

const iconBtnStyle = {
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  color: 'var(--kol-surface-on-primary)',
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
  background: 'var(--kol-accent-primary)',
  color: 'var(--kol-surface-on-primary)',
  fontFamily: 'var(--kol-font-family-mono)',
  fontSize: 9,
  fontWeight: 600,
  lineHeight: '14px',
  textAlign: 'center',
}

function CartIcon() {
  const { itemCount } = useCart()
  return (
    <Link to="/cart" aria-label={`Cart (${itemCount})`} style={iconBtnStyle} className="kol-site-nav-link">
      <Icon name="shopping-bag" size={16} />
      {itemCount > 0 && <span style={cartBadgeStyle}>{itemCount}</span>}
    </Link>
  )
}

function SearchIcon() {
  return (
    <button type="button" aria-label="Search" style={iconBtnStyle} className="kol-site-nav-link">
      <Icon name="search" size={16} />
    </button>
  )
}

function SiteShell() {
  return (
    <div className="font-display bg-surface-primary text-emphasis min-h-dvh flex flex-col">
      <Nav
        variant="center"
        leftLinks={NAV_LEFT}
        logo="Another Creation"
        logoTo="/"
        rightActions={
          <>
            <span style={{ color: 'var(--kol-surface-on-primary)', display: 'flex', alignItems: 'center' }}>
              <ThemeToggle />
            </span>
            <SearchIcon />
            <CartIcon />
          </>
        }
      />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
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
