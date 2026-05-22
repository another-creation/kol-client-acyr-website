import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../atoms/Button'
import Icon from '../loaders/icons/Icon'
import { useCart } from './CartContext'
import { formatPrice } from '../../data/shop-data'
import { CartPanel, CartTotalsRow, QtyControl } from './CartSummary'

export default function CartDrawer() {
  const { items, updateQty, removeItem, subtotal, currency, itemCount, isOpen, closeCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => { if (e.key === 'Escape') closeCart() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, closeCart])

  if (!isOpen) return null

  const onCheckout = () => {
    closeCart()
    navigate('/checkout')
  }

  return (
    <div className="fixed inset-0 z-[1000]" aria-modal="true" role="dialog" aria-label="Shopping bag">
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0, 0, 0, 0.5)' }}
        onClick={closeCart}
      />
      <CartPanel
        className="absolute top-0 right-0 h-dvh w-[min(480px,100vw)]"
        header={
          <>
            <p className="site-meta-status text-emphasis">
              Your bag {itemCount > 0 && <span className="text-meta">· {itemCount}</span>}
            </p>
            <button
              type="button"
              aria-label="Close bag"
              onClick={closeCart}
              className="text-meta hover:text-emphasis transition-colors"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}
            >
              <Icon name="x" size={14} />
            </button>
          </>
        }
        items={items}
        linkToFor={(it) => `/${it.kind === 'pod' ? 'shop' : 'handmade'}/${it.slug}`}
        onLinkClick={closeCart}
        qtyControlFor={(it) => (
          <QtyControl
            qty={it.qty}
            onChange={(q) => updateQty(it.id, q)}
            onDelete={() => removeItem(it.id)}
          />
        )}
        empty={
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-4">
            <p className="site-meta-system">Your bag is empty.</p>
            <div className="flex gap-4 site-meta-system">
              <Link to="/shop" onClick={closeCart} className="text-emphasis underline underline-offset-4 hover:no-underline">Shop</Link>
              <Link to="/handmade" onClick={closeCart} className="text-emphasis underline underline-offset-4 hover:no-underline">Handmade</Link>
            </div>
          </div>
        }
        footer={
          <>
            <CartTotalsRow label="Subtotal" value={formatPrice(subtotal, currency)} />
            <p className="site-meta-system">Shipping + tax calculated at checkout.</p>
            <Button variant="primary" size="lg" className="w-full" onClick={onCheckout}>
              Checkout · {formatPrice(subtotal, currency)}
            </Button>
            <button
              type="button"
              onClick={closeCart}
              className="site-meta-system hover:text-emphasis self-center"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              Continue shopping
            </button>
          </>
        }
      />
    </div>
  )
}
