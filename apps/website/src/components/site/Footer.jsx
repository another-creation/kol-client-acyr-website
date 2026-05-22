import { Link } from 'react-router-dom'
import KolLogo from '@ac/brand-data/logos/KolLogo'
import { BRAND_INFO } from '@ac/brand-data/info'
import Divider from '../atoms/Divider'
import FooterNewsletter from './FooterNewsletter'

const BROWSE = [
  { label: 'Shop',         to: '/shop' },
  { label: 'Handmade',     to: '/handmade' },
  { label: 'Collections',  to: '/collections' },
  { label: 'Journal',      to: '/journal' },
  { label: 'About',        to: '/about' },
  { label: 'Contact',      to: '/contact' },
]

const SOCIAL = [
  { label: 'Instagram', href: 'https://www.instagram.com/anothercreation_yr/' },
  { label: 'Facebook',  href: 'https://www.facebook.com/anothercreationyr/' },
  { label: 'LinkedIn',  href: 'https://www.linkedin.com/in/creatoryr/' },
]

const MORE = [
  { label: 'Brand',              to: '/brand' },
  { label: 'Press',              to: '/press' },
  { label: 'Shipping & Returns', to: '/shipping-returns' },
  { label: 'Terms',              to: '/terms' },
  { label: 'Privacy',            to: '/privacy' },
]

function FooterLink({ label, to, href }) {
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="ac-site-footer-link">
        {label}
      </a>
    )
  }
  if (to) {
    return <Link to={to} className="ac-site-footer-link">{label}</Link>
  }
  return <span className="ac-site-footer-link">{label}</span>
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="ac-site-footer bg-surface-tertiary">
      <FooterNewsletter />
      <Divider className="mx-8" />
      <div className="ac-site-footer-grid">

        <div className="ac-site-footer-col">
          <div className="ac-site-footer-mark" aria-hidden="true">
            <KolLogo variant="wordmark" />
          </div>
        </div>

        <div className="ac-site-footer-col">
          <p className="site-label-footer">Studio</p>
          <ul className="ac-site-footer-list site-link-footer">
            <li>{BRAND_INFO.studio.street}</li>
            <li>{BRAND_INFO.studio.postcode}</li>
            <li>Mon–Fri 13:00–18:00</li>
            <li>Sat 13:00–16:00</li>
            <li><FooterLink label={BRAND_INFO.contact.email} href={`mailto:${BRAND_INFO.contact.email}`} /></li>
            <li>{BRAND_INFO.contact.phone}</li>
          </ul>
        </div>

        <div className="ac-site-footer-col">
          <p className="site-label-footer">Browse</p>
          <ul className="ac-site-footer-list site-link-footer">
            {BROWSE.map((l) => (
              <li key={l.label}><FooterLink {...l} /></li>
            ))}
          </ul>
        </div>

        <div className="ac-site-footer-col">
          <p className="site-label-footer">Connect</p>
          <ul className="ac-site-footer-list site-link-footer">
            {SOCIAL.map((l) => (
              <li key={l.label}><FooterLink {...l} /></li>
            ))}
          </ul>
        </div>

        <div className="ac-site-footer-col">
          <p className="site-label-footer">More</p>
          <ul className="ac-site-footer-list site-link-footer">
            {MORE.map((l) => (
              <li key={l.label}><FooterLink {...l} /></li>
            ))}
          </ul>
        </div>

      </div>

      <Divider className="mx-8" />

      <div className="ac-site-footer-bottom">
        <span className="site-meta-system">© {year} {BRAND_INFO.identity.name}</span>
        <span className="site-meta-system">{BRAND_INFO.legal.entity} · kt {BRAND_INFO.legal.kt}</span>
      </div>
    </footer>
  )
}
