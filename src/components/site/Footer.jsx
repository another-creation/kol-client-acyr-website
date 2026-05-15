import { Link } from 'react-router-dom'
import KolLogo from '../../brand/logos/KolLogo'
import { BRAND_INFO } from '../../brand/data/info'

const BROWSE = [
  { label: 'Shop',         to: '/shop' },
  { label: 'Handmade',     to: '/handmade' },
  { label: 'Collections',  to: '/collections' },
  { label: 'Journal',      to: '/blog' },
  { label: 'About',        to: null },
]

const SOCIAL = [
  { label: 'Instagram', href: 'https://www.instagram.com/anothercreation_yr/' },
  { label: 'Facebook',  href: 'https://www.facebook.com/anothercreationyr/' },
]

const LEGAL = [
  { label: 'Shipping & Returns', to: '/shipping-returns' },
  { label: 'Terms',              to: '/terms' },
  { label: 'Privacy',            to: '/privacy' },
]

function FooterLink({ label, to, href }) {
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="kol-site-footer-link">
        {label}
      </a>
    )
  }
  if (to) {
    return <Link to={to} className="kol-site-footer-link">{label}</Link>
  }
  return <span className="kol-site-footer-link">{label}</span>
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="kol-site-footer">
      <div className="kol-site-footer-grid">

        <div className="kol-site-footer-col">
          <div className="kol-site-footer-mark" aria-hidden="true">
            <KolLogo variant="wordmark" />
          </div>
        </div>

        <div className="kol-site-footer-col">
          <p className="kol-site-footer-label">Studio</p>
          <ul className="kol-site-footer-list">
            <li>{BRAND_INFO.studio.street}</li>
            <li>{BRAND_INFO.studio.postcode}</li>
            <li>Mon–Fri 13:00–18:00</li>
            <li>Sat 13:00–16:00</li>
            <li><FooterLink label={BRAND_INFO.contact.email} href={`mailto:${BRAND_INFO.contact.email}`} /></li>
            <li>{BRAND_INFO.contact.phone}</li>
          </ul>
        </div>

        <div className="kol-site-footer-col">
          <p className="kol-site-footer-label">Browse</p>
          <ul className="kol-site-footer-list">
            {BROWSE.map((l) => (
              <li key={l.label}><FooterLink {...l} /></li>
            ))}
          </ul>
        </div>

        <div className="kol-site-footer-col">
          <p className="kol-site-footer-label">Connect</p>
          <ul className="kol-site-footer-list">
            {SOCIAL.map((l) => (
              <li key={l.label}><FooterLink {...l} /></li>
            ))}
          </ul>
        </div>

        <div className="kol-site-footer-col">
          <p className="kol-site-footer-label">Legal</p>
          <ul className="kol-site-footer-list">
            {LEGAL.map((l) => (
              <li key={l.label}><FooterLink {...l} /></li>
            ))}
          </ul>
        </div>

      </div>

      <div className="border-t border-fg-12 mx-8" aria-hidden="true" />

      <div className="kol-site-footer-bottom">
        <span className="kol-site-footer-meta">© {year} {BRAND_INFO.identity.name}</span>
        <span className="kol-site-footer-meta">{BRAND_INFO.legal.entity} · kt {BRAND_INFO.legal.kt}</span>
      </div>
    </footer>
  )
}
