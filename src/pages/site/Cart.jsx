import { Link, useNavigate } from 'react-router-dom'
import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '../../brand/config'
import Button from '../../components/atoms/Button'
import Divider from '../../components/atoms/Divider'
import Icon from '../../components/loaders/icons/Icon'
import { useCart } from '../../components/site/CartContext'
import { formatPrice } from '../../brand/data/shop-data'

function QtyControl({ qty, onChange }) {
  return (
    <div className="inline-flex items-center gap-3">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(qty - 1)}
        className="w-7 h-7 inline-flex items-center justify-center bg-fg-04 hover:bg-fg-08 transition-colors rounded-full"
        style={{ border: 'none', cursor: 'pointer', color: 'inherit' }}
      >
        <Icon name="minus" size={12} />
      </button>
      <span className="kol-helper-xs" style={{ minWidth: '1.5em', textAlign: 'center' }}>{qty}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(qty + 1)}
        className="w-7 h-7 inline-flex items-center justify-center bg-fg-04 hover:bg-fg-08 transition-colors rounded-full"
        style={{ border: 'none', cursor: 'pointer', color: 'inherit' }}
      >
        <Icon name="plus" size={12} />
      </button>
    </div>
  )
}

export default function Cart() {
  usePageTitle(`Cart · ${BRAND.name}`)
  const navigate = useNavigate()
  const { items, updateQty, removeItem, subtotal, currency } = useCart()

  return (
    <main className="bg-surface-primary pb-24">
      <section className="max-w-5xl mx-auto px-8 pt-16 pb-8">
        <p className="kol-prose-label">Cart</p>
        <h1 className="kol-prose-display-md">Shopping cart</h1>
      </section>

      <section className="max-w-5xl mx-auto px-8">
        <Divider className="mb-8" />

        {items.length === 0 ? (
          <div className="kol-prose">
            <p>Your cart is empty.</p>
            <p>Browse the <Link to="/shop">shop</Link> or the <Link to="/handmade">handmade</Link> pieces.</p>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-[1fr_320px] items-start">
            <ul className="flex flex-col">
              {items.map((it, i) => (
                <li key={it.id}>
                  {i > 0 && <Divider />}
                  <div className="grid gap-4 grid-cols-[60px_1fr_auto] sm:grid-cols-[80px_1fr_auto] items-start py-6">
                    <Link to={`/${it.kind === 'pod' ? 'shop' : 'handmade'}/${it.slug}`} className="block">
                      <div className="w-[60px] sm:w-20 aspect-[3/4] rounded overflow-hidden bg-surface-secondary">
                        <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                      </div>
                    </Link>
                    <div>
                      <Link
                        to={`/${it.kind === 'pod' ? 'shop' : 'handmade'}/${it.slug}`}
                        className="kol-prose-label no-underline text-emphasis hover:text-emphasis"
                        style={{ marginBottom: '4px' }}
                      >
                        {it.name}
                      </Link>
                      {it.size && <p className="kol-helper-xxs text-meta" style={{ margin: '0 0 12px' }}>Size: {it.size}</p>}
                      <QtyControl qty={it.qty} onChange={(q) => updateQty(it.id, q)} />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <p className="kol-prose-label" style={{ margin: 0 }}>{formatPrice(it.price * it.qty, it.currency)}</p>
                      <button
                        type="button"
                        aria-label={`Remove ${it.name}`}
                        onClick={() => removeItem(it.id)}
                        className="kol-helper-xxs text-meta hover:text-emphasis transition-colors"
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <aside className="bg-surface-secondary p-6 rounded sticky top-20">
              <p className="kol-prose-label" style={{ marginBottom: '16px' }}>Summary</p>
              <div className="kol-prose">
                <p style={{ display: 'flex', justifyContent: 'space-between', margin: '0 0 8px' }}>
                  <span>Subtotal</span><strong>{formatPrice(subtotal, currency)}</strong>
                </p>
                <p style={{ display: 'flex', justifyContent: 'space-between', margin: 0, color: 'var(--kol-fg-48)' }}>
                  <span>Shipping</span><span>at checkout</span>
                </p>
              </div>
              <div className="mt-6">
                <Button variant="primary" size="lg" className="w-full" onClick={() => navigate('/checkout')}>
                  Checkout
                </Button>
              </div>
              <p className="kol-helper-xxs text-meta mt-4" style={{ marginBottom: 0 }}>
                Tax + shipping calculated at the next step.
              </p>
            </aside>
          </div>
        )}
      </section>
    </main>
  )
}
