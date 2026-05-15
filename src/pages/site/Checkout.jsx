import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'
import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '../../brand/config'
import Button from '../../components/atoms/Button'
import Divider from '../../components/atoms/Divider'
import Input from '../../components/atoms/Input'
import Dropdown from '../../components/molecules/Dropdown'
import Icon from '../../components/loaders/icons/Icon'
import { useCart } from '../../components/site/CartContext'
import { formatPrice } from '../../brand/data/shop-data'

const COUNTRIES = [
  { value: 'IS', label: 'Iceland' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'IE', label: 'Ireland' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'NL', label: 'Netherlands' },
  { value: 'DK', label: 'Denmark' },
  { value: 'NO', label: 'Norway' },
  { value: 'SE', label: 'Sweden' },
  { value: 'FI', label: 'Finland' },
  { value: 'US', label: 'United States' },
  { value: 'CA', label: 'Canada' },
]

const PAYPAL_OPTS = {
  'client-id': import.meta.env.VITE_PAYPAL_CLIENT_ID,
  currency:    'EUR',
  intent:      'capture',
  components:  'buttons',
}

function StepHeader({ index, label, status, onEdit }) {
  return (
    <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
      <p className="kol-prose-label" style={{ margin: 0 }}>
        <span className="text-meta">{String(index).padStart(2, '0')}</span>
        <span style={{ marginLeft: '12px' }}>{label}</span>
      </p>
      {status === 'done' && (
        <button
          type="button"
          onClick={onEdit}
          className="kol-helper-xxs text-meta hover:text-emphasis"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          Edit
        </button>
      )}
    </div>
  )
}

function StepCollapsed({ children }) {
  return <div className="kol-prose"><p style={{ margin: 0 }}>{children}</p></div>
}

export default function Checkout() {
  usePageTitle(`Checkout · ${BRAND.name}`)
  const navigate              = useNavigate()
  const { items, subtotal, currency, clear } = useCart()

  const [step, setStep]         = useState(items.length === 0 ? null : 'email')
  const [email, setEmail]       = useState('')
  const [newsletter, setNewsletter] = useState(true)
  const [delivery, setDelivery] = useState({
    firstName: '', lastName: '', street: '', city: '', postcode: '', country: 'IS', phone: '',
  })
  const [payError, setPayError]         = useState(null)
  const [paying, setPaying]             = useState(false)
  const [shipping, setShipping]         = useState(null)
  const [shippingError, setShippingError] = useState(null)

  const tax       = 0
  const shipRate  = shipping?.rate ?? 0
  const total     = subtotal + shipRate

  // Fetch real Printful shipping when entering the pay step. Refetches on
  // re-entry (user edits delivery, comes back).
  useEffect(() => {
    if (step !== 'pay' || items.length === 0) return
    let cancelled = false
    fetch('/api/printful/shipping-rates', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        items: items.map((it) => ({ slug: it.slug, size: it.size, qty: it.qty })),
        delivery,
      }),
    })
      .then(async (r) => {
        const body = await r.json().catch(() => ({}))
        if (!r.ok) throw new Error(body.error ?? 'Could not calculate shipping')
        return body
      })
      .then((rate) => { if (!cancelled) setShipping(rate) })
      .catch((err)  => { if (!cancelled) setShippingError(err.message) })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  if (items.length === 0) {
    return (
      <main className="bg-surface-primary max-w-3xl mx-auto px-8 py-24 text-center">
        <p className="kol-prose-label">Checkout</p>
        <h1 className="kol-prose-display-md">Your cart is empty.</h1>
        <Link to="/shop" className="kol-back-link kol-helper-xs uppercase tracking-widest text-body hover:text-emphasis no-underline">← Back to shop</Link>
      </main>
    )
  }

  const deliveryReady = Boolean(
    delivery.firstName && delivery.lastName && delivery.street &&
    delivery.city && delivery.postcode && delivery.country,
  )

  const states = {
    email:    step === 'email'    ? 'open' : email           ? 'done' : 'pending',
    delivery: step === 'delivery' ? 'open' : delivery.street ? 'done' : 'pending',
    pay:      step === 'pay'      ? 'open' : 'pending',
  }

  const cartPayload = () => items.map((it) => ({ slug: it.slug, size: it.size, qty: it.qty }))

  const createOrder = async () => {
    setPayError(null)
    const res = await fetch('/api/paypal/create-order', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ items: cartPayload(), delivery }),
    })
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}))
      throw new Error(errBody.error ?? 'Could not create PayPal order')
    }
    const { orderID } = await res.json()
    return orderID
  }

  const onApprove = async (data) => {
    setPaying(true)
    try {
      const res = await fetch('/api/paypal/capture-order', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          orderID: data.orderID,
          items:   cartPayload(),
          delivery,
          email,
        }),
      })
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}))
        setPaying(false)
        setPayError(errBody.error ?? 'Payment captured but order processing failed. Please contact support with this reference.')
        return
      }
      const result = await res.json()

      const snapshotItems = items.map((it) => ({ ...it }))
      clear()

      navigate('/checkout/confirmation', {
        state: {
          captureId:       result.captureId,
          paypalOrderId:   result.paypalOrderId,
          printfulOrderId: result.printfulOrderId,
          printfulError:   result.printfulError,
          autoConfirmed:   result.autoConfirmed,
          items:           snapshotItems,
          delivery,
          email,
          newsletter,
          subtotal,
          shipping:        shipRate,
          tax,
          total,
          currency,
        },
      })
    } catch (err) {
      setPaying(false)
      setPayError(err.message)
    }
  }

  return (
    <PayPalScriptProvider options={PAYPAL_OPTS}>
      <main className="bg-surface-primary pb-24">
        <section className="max-w-6xl mx-auto px-8 pt-16 pb-8">
          <p className="kol-prose-label">Checkout</p>
          <h1 className="kol-prose-display-md">Secure checkout</h1>
        </section>

        <section className="max-w-6xl mx-auto px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_360px] items-start">
            {/* Steps */}
            <div className="flex flex-col gap-4">
              {/* 01 — Email */}
              <div className="border border-fg-08 rounded p-6">
                <StepHeader index={1} label="Your email" status={states.email} onEdit={() => setStep('email')} />
                {states.email === 'open' ? (
                  <form
                    onSubmit={(e) => { e.preventDefault(); setStep('delivery') }}
                    className="flex flex-col gap-4"
                  >
                    <Input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label className="kol-helper-xxs text-meta inline-flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} />
                      Sign up to get the latest collections in your inbox.
                    </label>
                    <div><Button type="submit" variant="primary" size="lg">Continue</Button></div>
                  </form>
                ) : states.email === 'done' ? (
                  <StepCollapsed>{email}</StepCollapsed>
                ) : null}
              </div>

              {/* 02 — Delivery */}
              <div className="border border-fg-08 rounded p-6">
                <StepHeader index={2} label="Delivery" status={states.delivery} onEdit={() => setStep('delivery')} />
                {states.delivery === 'open' ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      setShipping(null)
                      setShippingError(null)
                      setStep('pay')
                    }}
                    className="flex flex-col gap-4"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Input placeholder="First name" required value={delivery.firstName} onChange={(e) => setDelivery({ ...delivery, firstName: e.target.value })} />
                      <Input placeholder="Last name"  required value={delivery.lastName}  onChange={(e) => setDelivery({ ...delivery, lastName:  e.target.value })} />
                    </div>
                    <Input placeholder="Street address" required value={delivery.street} onChange={(e) => setDelivery({ ...delivery, street: e.target.value })} />
                    <div className="grid gap-4 sm:grid-cols-3">
                      <Input placeholder="City"     required value={delivery.city}     onChange={(e) => setDelivery({ ...delivery, city:     e.target.value })} />
                      <Input placeholder="Postcode" required value={delivery.postcode} onChange={(e) => setDelivery({ ...delivery, postcode: e.target.value })} />
                      <Dropdown options={COUNTRIES} value={delivery.country} onChange={(v) => setDelivery({ ...delivery, country: v })} />
                    </div>
                    <Input type="tel" placeholder="Phone (optional)" value={delivery.phone} onChange={(e) => setDelivery({ ...delivery, phone: e.target.value })} />
                    <div><Button type="submit" variant="primary" size="lg">Continue to payment</Button></div>
                  </form>
                ) : states.delivery === 'done' ? (
                  <StepCollapsed>
                    {delivery.firstName} {delivery.lastName} · {delivery.street}, {delivery.postcode} {delivery.city}, {COUNTRIES.find((c) => c.value === delivery.country)?.label}
                  </StepCollapsed>
                ) : null}
              </div>

              {/* 03 — Pay */}
              <div className="border border-fg-08 rounded p-6">
                <StepHeader index={3} label="Pay" status={states.pay} />
                {states.pay === 'open' && (
                  <div className="flex flex-col gap-4">
                    <div className="kol-prose">
                      <p style={{ margin: 0 }}>
                        {shipping
                          ? <>Total {formatPrice(total, currency)} — paid securely through PayPal. Pay with a PayPal account or any major card.</>
                          : shippingError
                            ? <>We couldn't calculate shipping for this address. Edit your delivery details and try again.</>
                            : <>Calculating shipping…</>}
                      </p>
                    </div>

                    {(payError || shippingError) && (
                      <div className="p-3 rounded bg-fg-04">
                        <p className="kol-helper-xs text-emphasis" style={{ margin: 0 }}>{payError ?? shippingError}</p>
                      </div>
                    )}

                    {paying ? (
                      <div className="kol-helper-xs text-meta">Processing your order…</div>
                    ) : (
                      <PayPalButtons
                        style={{ layout: 'vertical', color: 'black', shape: 'rect', label: 'pay', height: 48 }}
                        disabled={!deliveryReady || !shipping}
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={(err) => {
                          console.error('PayPal error:', err)
                          setPayError('Payment could not be completed. Please try again.')
                        }}
                        onCancel={() => setPayError(null)}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right — order summary */}
            <aside className="bg-surface-secondary p-6 rounded">
              <p className="kol-prose-label" style={{ marginBottom: '16px' }}>Order summary</p>
              <ul className="flex flex-col gap-3" style={{ marginBottom: '20px' }}>
                {items.map((it) => (
                  <li key={it.id} className="grid gap-3 grid-cols-[40px_1fr_auto] sm:grid-cols-[48px_1fr_auto] items-start">
                    <div className="w-10 sm:w-12 aspect-[3/4] rounded overflow-hidden bg-surface-primary">
                      <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="kol-helper-xxs text-emphasis" style={{ margin: 0 }}>{it.name}</p>
                      <p className="kol-helper-xxs text-meta" style={{ margin: '2px 0 0' }}>
                        {it.size && <>Size: {it.size} · </>}
                        Qty: {it.qty}
                      </p>
                    </div>
                    <p className="kol-helper-xxs text-emphasis" style={{ margin: 0 }}>{formatPrice(it.price * it.qty, it.currency)}</p>
                  </li>
                ))}
              </ul>
              <Divider />
              <div className="kol-prose" style={{ marginTop: '16px' }}>
                <p style={{ display: 'flex', justifyContent: 'space-between', margin: '0 0 4px' }}>
                  <span>Subtotal</span><span>{formatPrice(subtotal, currency)}</span>
                </p>
                <p style={{ display: 'flex', justifyContent: 'space-between', margin: '0 0 8px' }}>
                  <span>Shipping</span>
                  <span>
                    {shipping
                      ? formatPrice(shipping.rate, currency)
                      : step === 'pay'
                        ? (shippingError ? '—' : 'Calculating…')
                        : 'At checkout'}
                  </span>
                </p>
                <Divider />
                <p style={{ display: 'flex', justifyContent: 'space-between', margin: '12px 0 0' }}>
                  <span><strong>Total</strong></span><span><strong>{formatPrice(total, currency)}</strong></span>
                </p>
              </div>
              <p className="kol-helper-xxs text-meta inline-flex items-center gap-2 mt-6" style={{ marginBottom: 0 }}>
                <Icon name="lock" size={12} /> Secure checkout via PayPal
              </p>
            </aside>
          </div>
        </section>
      </main>
    </PayPalScriptProvider>
  )
}
