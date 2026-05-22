import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '@ac/brand-data/config'
import Button from '../../components/atoms/Button'
import Divider from '../../components/atoms/Divider'
import Icon from '../../components/loaders/icons/Icon'
import { useCart } from '../../components/site/CartContext'
import { formatPrice } from '../../data/shop-data'
import BackLink from '../../components/site/BackLink'
import PageHero from '../../components/site/PageHero'
import SiteSection from '../../components/site/SiteSection'

export default function OrderConfirmation() {
  usePageTitle(`Order placed · ${BRAND.name}`)
  const { state } = useLocation()
  const navigate  = useNavigate()
  const { clear } = useCart()

  // Clear the cart on first mount in case the buyer refreshes the page mid-flow.
  useEffect(() => {
    clear()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!state || !state.captureId) {
    return (
      <SiteSection as="main" className="bg-surface-primary px-8 py-24 text-center">
        <p className="site-eyebrow-hero">Confirmation</p>
        <h1 className="site-title-page">No order found.</h1>
        <p className="site-tagline" style={{ marginBottom: '24px' }}>
          If you just placed an order, your confirmation email is on its way.
        </p>
        <BackLink to="/shop">← Back to shop</BackLink>
      </SiteSection>
    )
  }

  const {
    captureId,
    printfulOrderId,
    printfulError,
    items,
    delivery,
    email,
    subtotal,
    shipping,
    tax,
    total,
    currency,
  } = state

  return (
    <main className="bg-surface-primary pb-24">
      <SiteSection className="px-8 pt-16 text-center flex flex-col items-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-secondary mb-6">
          <Icon name="check" size={28} />
        </div>
        <PageHero
          eyebrow="Thank you"
          title="Your order is confirmed."
          subline={<>A receipt has been sent to <strong>{email}</strong>. PayPal capture ID <strong>{captureId}</strong>.</>}
          sublineKind="lede"
          className="items-center"
        />
      </SiteSection>

      <SiteSection className="px-8 pt-12">
        <Divider className="mb-8" />
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="site-eyebrow-section">Order reference</p>
            <div className="ac-prose">
              <p style={{ margin: 0 }}>
                {printfulOrderId ? `Printful #${printfulOrderId}` : 'Fulfillment processing'}
              </p>
              <p className="site-meta-system" style={{ margin: '4px 0 0' }}>
                Tracking will be emailed when the order ships (typically 2–7 business days).
              </p>
            </div>
          </div>
          <div>
            <p className="site-eyebrow-section">Shipping to</p>
            <div className="ac-prose">
              <p style={{ margin: '0 0 2px' }}>{delivery.firstName} {delivery.lastName}</p>
              <p style={{ margin: '0 0 2px' }}>{delivery.street}</p>
              <p style={{ margin: 0 }}>{delivery.postcode} {delivery.city}</p>
            </div>
          </div>
        </div>
        {printfulError && (
          <div className="mt-8 p-4 rounded bg-fg-04">
            <p className="site-meta-system text-emphasis">
              Payment received. Fulfillment hasn't been queued yet — our team will follow up by email.
            </p>
          </div>
        )}
      </SiteSection>

      <SiteSection className="px-8 pt-12">
        <p className="site-eyebrow-section">Order</p>
        <Divider className="mb-6" />
        <ul className="flex flex-col gap-4" style={{ marginBottom: '24px' }}>
          {items.map((it) => (
            <li key={it.id} className="grid gap-4 grid-cols-[50px_1fr_auto] sm:grid-cols-[64px_1fr_auto]">
              <div className="w-[50px] sm:w-16 aspect-[3/4] rounded overflow-hidden bg-surface-secondary">
                <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="site-name-card">{it.name}</p>
                <p className="site-meta-card" style={{ marginTop: '4px' }}>
                  {it.size && <>Size: {it.size} · </>}
                  Qty: {it.qty}
                </p>
              </div>
              <p className="site-name-card">{formatPrice(it.price * it.qty, it.currency)}</p>
            </li>
          ))}
        </ul>
        <Divider />
        <div className="ac-prose" style={{ marginTop: '16px' }}>
          <p style={{ display: 'flex', justifyContent: 'space-between', margin: '0 0 4px' }}><span>Subtotal</span><span>{formatPrice(subtotal, currency)}</span></p>
          {tax > 0 && (
            <p style={{ display: 'flex', justifyContent: 'space-between', margin: '0 0 4px' }}><span>Tax</span><span>{formatPrice(tax, currency)}</span></p>
          )}
          <p style={{ display: 'flex', justifyContent: 'space-between', margin: '0 0 8px' }}><span>Shipping</span><span>{formatPrice(shipping, currency)}</span></p>
          <Divider />
          <p style={{ display: 'flex', justifyContent: 'space-between', margin: '12px 0 0' }}><span><strong>Total</strong></span><span><strong>{formatPrice(total, currency)}</strong></span></p>
        </div>
      </SiteSection>

      <SiteSection className="px-8 pt-16 text-center">
        <Button variant="outline" size="md" onClick={() => navigate('/shop')}>Continue shopping →</Button>
      </SiteSection>
    </main>
  )
}
