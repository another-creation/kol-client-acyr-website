import { Link } from 'react-router-dom'
import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '../../brand/config'
import { BRAND_INFO } from '../../brand/data/info'

export default function Terms() {
  usePageTitle(`Terms · ${BRAND.name}`)

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
        <h1 className="kol-prose-display-md">Terms of service</h1>
        <p className="kol-prose-tagline" style={{ marginTop: '8px' }}>
          Effective {new Date().toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        <div className="kol-prose">
          <p>This is a placeholder template. Replace with the studio's actual terms before going live. By using anothercreation.com you agree to these terms. The site is operated by {BRAND_INFO.legal.entity}, kennitala {BRAND_INFO.legal.kt}.</p>

          <h2>Orders</h2>
          <p>Placing an order is an offer to buy. We confirm orders by email. Stock availability and pricing are not guaranteed until your order is confirmed.</p>

          <h2>Made-to-order</h2>
          <p>Made-to-order pieces (atelier work) are produced specifically for you after a confirmation deposit. Lead time is approximately four weeks. Final sizing is set at the first fitting; we cannot accept returns of made-to-order pieces unless faulty.</p>

          <h2>Print-on-demand</h2>
          <p>Print-on-demand pieces are produced after order. Production takes 2–7 business days; shipping follows. We pass through the carrier's tracking once dispatched.</p>

          <h2>Pricing & currency</h2>
          <p>Prices on the site are in EUR including any applicable VAT. International orders may incur duties or taxes at the destination, which are the customer's responsibility.</p>

          <h2>Returns</h2>
          <p>See our <Link to="/shipping-returns">shipping and returns</Link> page for the full return policy.</p>

          <h2>Intellectual property</h2>
          <p>All photography, prints, and editorial copy on this site are the property of {BRAND_INFO.identity.name} or its photographers. Reproduction without permission is not permitted.</p>

          <h2>Liability</h2>
          <p>To the extent permitted by Icelandic law, our liability for any product is limited to the amount you paid for it. We are not liable for indirect or consequential losses.</p>

          <h2>Governing law</h2>
          <p>These terms are governed by Icelandic law. Disputes are subject to the exclusive jurisdiction of the Icelandic courts.</p>

          <h2>Contact</h2>
          <p>Questions about these terms: <a href={`mailto:${BRAND_INFO.contact.email}`}>{BRAND_INFO.contact.email}</a></p>
        </div>
      </section>
    </main>
  )
}
