import { Link } from 'react-router-dom'
import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '../../brand/config'
import { BRAND_INFO } from '../../brand/data/info'

export default function ShippingReturns() {
  usePageTitle(`Shipping & Returns · ${BRAND.name}`)

  return (
    <main className="bg-surface-primary pb-24">
      <section className="max-w-3xl mx-auto px-8 pt-20">
        <Link
          to="/"
          className="kol-back-link kol-helper-xs uppercase tracking-widest text-body hover:text-emphasis no-underline inline-flex items-center gap-1.5"
          style={{ marginBottom: '32px' }}
        >
          ← Back
        </Link>

        <p className="kol-prose-label">Legal</p>
        <h1 className="kol-prose-display-md">Shipping &amp; returns</h1>
        <p className="kol-prose-tagline" style={{ marginTop: '8px' }}>
          Effective {new Date().toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        <div className="kol-prose">
          <p>This is a placeholder template. Replace specifics with the studio's actual policy before going live.</p>

          <h2>Production time</h2>
          <ul>
            <li><strong>Print-on-demand:</strong> 2–7 business days production, then shipping.</li>
            <li><strong>Made-to-order (atelier):</strong> approximately 4 weeks from confirmation, plus shipping.</li>
            <li><strong>Bespoke commissions:</strong> quoted at first fitting.</li>
          </ul>

          <h2>Shipping</h2>
          <p>We ship worldwide. EU and UK orders are dispatched from the EU; orders outside the EU are dispatched from the closest fulfilment hub. Tracking is provided by email when your order ships.</p>
          <ul>
            <li><strong>Iceland:</strong> 1–3 business days after dispatch.</li>
            <li><strong>EU / UK:</strong> 3–7 business days.</li>
            <li><strong>Rest of world:</strong> 5–14 business days.</li>
          </ul>

          <h2>Duties &amp; taxes</h2>
          <p>EU and UK orders include applicable VAT. Orders outside these regions may incur import duties or local taxes at delivery — these are the customer's responsibility.</p>

          <h2>Returns &amp; exchanges</h2>
          <p>You can return unworn, undamaged print-on-demand pieces in their original packaging within 14 days of delivery. Email us first at <a href={`mailto:${BRAND_INFO.contact.email}`}>{BRAND_INFO.contact.email}</a> with your order number to arrange the return.</p>
          <p>Made-to-order and bespoke pieces are not returnable except where faulty, since they are produced specifically for you.</p>

          <h2>Faulty items</h2>
          <p>If your order arrives damaged or faulty, write to us within 7 days of delivery with photos and your order number. We replace or refund at our cost.</p>

          <h2>Contact</h2>
          <p><a href={`mailto:${BRAND_INFO.contact.email}`}>{BRAND_INFO.contact.email}</a> · {BRAND_INFO.contact.phone}</p>

          <p className="kol-prose-label" style={{ marginTop: '32px' }}>
            See also: <Link to="/terms">Terms</Link> · <Link to="/privacy">Privacy</Link>
          </p>
        </div>
      </section>
    </main>
  )
}
