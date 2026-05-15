import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '../../brand/config'
import Button from '../../components/atoms/Button'
import Divider from '../../components/atoms/Divider'
import Icon from '../../components/loaders/icons/Icon'
import { useCart } from '../../components/site/CartContext'
import { formatPrice } from '../../brand/data/shop-data'

export default function OrderConfirmation() {
  usePageTitle(`Order placed · ${BRAND.name}`)
  const [params]    = useSearchParams()
  const navigate    = useNavigate()
  const { clear }   = useCart()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    let raw = null
    try { raw = window.localStorage.getItem('kol.ac.lastOrder') } catch { /* no-op */ }
    if (raw) {
      try { setOrder(JSON.parse(raw)) } catch { /* no-op */ }
    }
    clear()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!order) {
    return (
      <main className="bg-surface-primary max-w-3xl mx-auto px-8 py-24 text-center">
        <p className="kol-prose-label">Confirmation</p>
        <h1 className="kol-prose-display-md">No order found.</h1>
        <Link to="/shop" className="kol-back-link kol-helper-xs uppercase tracking-widest text-body hover:text-emphasis no-underline">← Back to shop</Link>
      </main>
    )
  }

  const trackingNumber = `IS${(order.id ?? params.get('id') ?? 'AC0000').slice(-8)}1234`

  return (
    <main className="bg-surface-primary pb-24">
      <section className="max-w-3xl mx-auto px-8 pt-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-secondary" style={{ marginBottom: '24px' }}>
          <Icon name="check" size={28} />
        </div>
        <p className="kol-prose-label">Thank you</p>
        <h1 className="kol-prose-display-md">Your order is on its way.</h1>
        <p className="kol-prose-lede">
          A receipt has been sent to <strong>{order.email}</strong>. Order number <strong>{order.id ?? params.get('id')}</strong>.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-8 pt-12">
        <Divider className="mb-8" />
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="kol-prose-label">Tracking</p>
            <div className="kol-prose">
              <p style={{ margin: 0 }}>{trackingNumber}</p>
              <p className="kol-helper-xxs text-meta" style={{ margin: '4px 0 0' }}>
                Estimated delivery: 5–14 days from dispatch.
              </p>
            </div>
          </div>
          <div>
            <p className="kol-prose-label">Shipping to</p>
            <div className="kol-prose">
              <p style={{ margin: '0 0 2px' }}>{order.delivery.firstName} {order.delivery.lastName}</p>
              <p style={{ margin: '0 0 2px' }}>{order.delivery.street}</p>
              <p style={{ margin: 0 }}>{order.delivery.postcode} {order.delivery.city}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-8 pt-12">
        <p className="kol-prose-label">Order</p>
        <Divider className="mb-6" />
        <ul className="flex flex-col gap-4" style={{ marginBottom: '24px' }}>
          {order.items.map((it) => (
            <li key={it.id} className="grid gap-4 grid-cols-[50px_1fr_auto] sm:grid-cols-[64px_1fr_auto]">
              <div className="w-[50px] sm:w-16 aspect-[3/4] rounded overflow-hidden bg-surface-secondary">
                <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="kol-helper-xs text-emphasis" style={{ margin: 0 }}>{it.name}</p>
                <p className="kol-helper-xxs text-meta" style={{ margin: '4px 0 0' }}>
                  {it.size && <>Size: {it.size} · </>}
                  Qty: {it.qty}
                </p>
              </div>
              <p className="kol-helper-xs text-emphasis" style={{ margin: 0 }}>{formatPrice(it.price * it.qty, it.currency)}</p>
            </li>
          ))}
        </ul>
        <Divider />
        <div className="kol-prose" style={{ marginTop: '16px' }}>
          <p style={{ display: 'flex', justifyContent: 'space-between', margin: '0 0 4px' }}><span>Subtotal</span><span>{formatPrice(order.subtotal, order.currency)}</span></p>
          <p style={{ display: 'flex', justifyContent: 'space-between', margin: '0 0 4px' }}><span>Tax</span><span>{formatPrice(order.tax, order.currency)}</span></p>
          <p style={{ display: 'flex', justifyContent: 'space-between', margin: '0 0 8px' }}><span>Shipping</span><span>{formatPrice(order.shipping, order.currency)}</span></p>
          <Divider />
          <p style={{ display: 'flex', justifyContent: 'space-between', margin: '12px 0 0' }}><span><strong>Total</strong></span><span><strong>{formatPrice(order.total, order.currency)}</strong></span></p>
        </div>
      </section>

      {!order.newsletter && (
        <section className="max-w-3xl mx-auto px-8 pt-16">
          <Divider className="mb-8" />
          <div className="bg-surface-secondary p-8 rounded text-center">
            <p className="kol-prose-label">One more thing</p>
            <h2 className="kol-prose-title" style={{ fontSize: '32px', lineHeight: '36px' }}>Hear about new releases first.</h2>
            <p className="kol-prose-lede" style={{ fontSize: '16px', lineHeight: '24px', maxWidth: '480px', margin: '0 auto 24px' }}>
              Sign up for the journal — collection releases, pop-ups, and atelier notes. No noise.
            </p>
            <Button variant="primary" size="lg">Sign up</Button>
          </div>
        </section>
      )}

      <section className="max-w-3xl mx-auto px-8 pt-16 text-center">
        <Button variant="outline" size="md" onClick={() => navigate('/shop')}>Continue shopping →</Button>
      </section>
    </main>
  )
}
