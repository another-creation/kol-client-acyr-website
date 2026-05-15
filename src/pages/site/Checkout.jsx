import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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

function PaymentMethodToggle({ value, onChange }) {
  const options = [
    { value: 'card', label: 'Card', icon: 'credit-card' },
    { value: 'paypal', label: 'PayPal', icon: 'paypal' },
    { value: 'apple', label: 'Apple Pay', icon: 'apple' },
  ]
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <label
          key={opt.value}
          className="flex items-center gap-3 p-4 rounded border border-fg-08 cursor-pointer transition-colors"
          style={{ background: value === opt.value ? 'var(--kol-fg-04)' : 'transparent' }}
        >
          <input
            type="radio"
            name="payment-method"
            value={opt.value}
            checked={value === opt.value}
            onChange={(e) => onChange(e.target.value)}
            style={{ accentColor: 'currentColor' }}
          />
          <span className="kol-prose-label" style={{ margin: 0 }}>{opt.label}</span>
        </label>
      ))}
    </div>
  )
}

export default function Checkout() {
  usePageTitle(`Checkout · ${BRAND.name}`)
  const navigate = useNavigate()
  const { items, subtotal, currency } = useCart()

  const [step, setStep] = useState(items.length === 0 ? null : 'email')
  const [email, setEmail]       = useState('')
  const [newsletter, setNewsletter] = useState(true)
  const [delivery, setDelivery] = useState({
    firstName: '', lastName: '', street: '', city: '', postcode: '', country: 'IS', phone: '',
  })
  const [payment, setPayment]   = useState({ method: 'card', cardNumber: '', name: '', exp: '', cvc: '' })

  const tax      = useMemo(() => Math.round(subtotal * 0),     [subtotal])
  const shipping = useMemo(() => (subtotal > 0 ? 20 : 0),       [subtotal])
  const total    = subtotal + tax + shipping

  if (items.length === 0) {
    return (
      <main className="bg-surface-primary max-w-3xl mx-auto px-8 py-24 text-center">
        <p className="kol-prose-label">Checkout</p>
        <h1 className="kol-prose-display-md">Your cart is empty.</h1>
        <Link to="/shop" className="kol-back-link kol-helper-xs uppercase tracking-widest text-body hover:text-emphasis no-underline">← Back to shop</Link>
      </main>
    )
  }

  const states = {
    email:    step === 'email'    ? 'open' : email                    ? 'done' : 'pending',
    delivery: step === 'delivery' ? 'open' : delivery.street          ? 'done' : 'pending',
    payment:  step === 'payment'  ? 'open' : payment.cardNumber       ? 'done' : 'pending',
    review:   step === 'review'   ? 'open' : 'pending',
  }

  return (
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
                  onSubmit={(e) => { e.preventDefault(); setStep('payment') }}
                  className="flex flex-col gap-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input placeholder="First name" required value={delivery.firstName} onChange={(e) => setDelivery({ ...delivery, firstName: e.target.value })} />
                    <Input placeholder="Last name"  required value={delivery.lastName}  onChange={(e) => setDelivery({ ...delivery, lastName:  e.target.value })} />
                  </div>
                  <Input placeholder="Street address" required value={delivery.street} onChange={(e) => setDelivery({ ...delivery, street: e.target.value })} />
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Input placeholder="City"       required value={delivery.city}     onChange={(e) => setDelivery({ ...delivery, city:     e.target.value })} />
                    <Input placeholder="Postcode"   required value={delivery.postcode} onChange={(e) => setDelivery({ ...delivery, postcode: e.target.value })} />
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

            {/* 03 — Payment */}
            <div className="border border-fg-08 rounded p-6">
              <StepHeader index={3} label="Payment" status={states.payment} onEdit={() => setStep('payment')} />
              {states.payment === 'open' ? (
                <form
                  onSubmit={(e) => { e.preventDefault(); setStep('review') }}
                  className="flex flex-col gap-5"
                >
                  <PaymentMethodToggle value={payment.method} onChange={(method) => setPayment({ ...payment, method })} />
                  {payment.method === 'card' && (
                    <div className="flex flex-col gap-4">
                      <Input placeholder="Card number"     required value={payment.cardNumber} onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })} />
                      <Input placeholder="Cardholder name" required value={payment.name}       onChange={(e) => setPayment({ ...payment, name:       e.target.value })} />
                      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                        <Input placeholder="MM / YY"  required value={payment.exp} onChange={(e) => setPayment({ ...payment, exp: e.target.value })} />
                        <Input placeholder="CVC"      required value={payment.cvc} onChange={(e) => setPayment({ ...payment, cvc: e.target.value })} />
                      </div>
                    </div>
                  )}
                  <div><Button type="submit" variant="primary" size="lg">Continue to review</Button></div>
                </form>
              ) : states.payment === 'done' ? (
                <StepCollapsed>
                  {payment.method === 'card'
                    ? <>Card ending {payment.cardNumber.slice(-4)}</>
                    : <>{payment.method.charAt(0).toUpperCase() + payment.method.slice(1)}</>}
                </StepCollapsed>
              ) : null}
            </div>

            {/* 04 — Review */}
            <div className="border border-fg-08 rounded p-6">
              <StepHeader index={4} label="Review &amp; place order" status={states.review} />
              {states.review === 'open' && (
                <div className="flex flex-col gap-4">
                  <div className="kol-prose">
                    <p style={{ margin: 0 }}>
                      You're about to place a {formatPrice(total, currency)} order to {delivery.firstName} {delivery.lastName} at {delivery.street}, {delivery.postcode} {delivery.city}.
                    </p>
                  </div>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => {
                      const order = {
                        id: 'AC' + Date.now().toString(36).toUpperCase(),
                        items, email, delivery, payment, subtotal, shipping, tax, total, currency, newsletter,
                        placedAt: new Date().toISOString(),
                      }
                      try { window.localStorage.setItem('kol.ac.lastOrder', JSON.stringify(order)) } catch { /* no-op */ }
                      navigate(`/checkout/confirmation?id=${order.id}`)
                    }}
                  >
                    Place order
                  </Button>
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
              <p style={{ display: 'flex', justifyContent: 'space-between', margin: '0 0 4px' }}>
                <span>Tax</span><span>{formatPrice(tax, currency)}</span>
              </p>
              <p style={{ display: 'flex', justifyContent: 'space-between', margin: '0 0 8px' }}>
                <span>Shipping</span><span>{formatPrice(shipping, currency)}</span>
              </p>
              <Divider />
              <p style={{ display: 'flex', justifyContent: 'space-between', margin: '12px 0 0' }}>
                <span><strong>Total</strong></span><span><strong>{formatPrice(total, currency)}</strong></span>
              </p>
            </div>
            <p className="kol-helper-xxs text-meta inline-flex items-center gap-2 mt-6" style={{ marginBottom: 0 }}>
              <Icon name="lock" size={12} /> Secure checkout
            </p>
          </aside>
        </div>
      </section>
    </main>
  )
}
