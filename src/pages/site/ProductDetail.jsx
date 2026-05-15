import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '../../brand/config'
import Divider from '../../components/atoms/Divider'
import Button from '../../components/atoms/Button'
import Icon from '../../components/loaders/icons/Icon'
import { findProduct, formatPrice } from '../../brand/data/shop-data'
import { useCart } from '../../components/site/CartContext'

function SizeRow({ sizes, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map((s) => {
        const active = s === value
        return (
          <button
            type="button"
            key={s}
            onClick={() => onChange(s)}
            className="kol-helper-xs uppercase"
            style={{
              padding: '8px 14px',
              border: '1px solid',
              borderColor: active ? 'var(--kol-surface-on-primary)' : 'var(--kol-fg-12)',
              borderRadius: '999px',
              background: active ? 'var(--kol-surface-on-primary)' : 'transparent',
              color: active ? 'var(--kol-surface-primary)' : 'var(--kol-fg-80)',
              cursor: 'pointer',
              transition: 'background 150ms ease, border-color 150ms ease, color 150ms ease',
            }}
          >
            {s}
          </button>
        )
      })}
    </div>
  )
}

export default function ProductDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const product  = findProduct(slug)
  const { addItem } = useCart()
  const [size, setSize] = useState(null)
  const [qty, setQty]   = useState(1)
  const [added, setAdded] = useState(false)

  usePageTitle(product ? `${product.name} · ${BRAND.name}` : `${BRAND.name}`)

  useEffect(() => {
    if (product?.sizes?.length === 1) setSize(product.sizes[0])
  }, [product])

  if (!product) {
    return (
      <main className="bg-surface-primary max-w-3xl mx-auto px-8 py-24 text-center">
        <p className="kol-prose-label">404</p>
        <h1 className="kol-prose-display-md">Product not found.</h1>
        <Link to="/shop" className="kol-back-link kol-helper-xs uppercase tracking-widest text-body hover:text-emphasis no-underline">← Back to shop</Link>
      </main>
    )
  }

  const isPod      = product.kind === 'pod'
  const indexHref  = isPod ? '/shop' : '/handmade'
  const indexLabel = isPod ? 'shop' : 'handmade'
  const desc       = product.description ?? null

  return (
    <main className="bg-surface-primary pb-24">
      <section className="max-w-6xl mx-auto px-8 pt-16">
        <Link
          to={indexHref}
          className="kol-back-link kol-helper-xs uppercase tracking-widest text-body hover:text-emphasis no-underline inline-flex items-center gap-1.5"
          style={{ marginBottom: '32px' }}
        >
          ← Back to {indexLabel}
        </Link>

        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] items-start">
          <div className="aspect-[3/4] rounded overflow-hidden bg-surface-secondary">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col">
            <h1 className="kol-prose-display-md">{product.name}</h1>
            <p className="kol-prose-tagline" style={{ marginTop: '8px' }}>
              {formatPrice(product.price, product.currency)}
            </p>

            <Divider className="my-6" />

            <div className="kol-prose" style={{ marginBottom: '24px' }}>
              <p style={{ margin: 0 }}>{product.excerpt}</p>
              {desc?.blurb && <p style={{ margin: '12px 0 0' }}>{desc.blurb}</p>}
            </div>

            {product.sizes && product.sizes.length > 1 && (
              <>
                <p className="kol-prose-label" style={{ marginBottom: '12px' }}>Size</p>
                <SizeRow sizes={product.sizes} value={size} onChange={setSize} />
                <div style={{ height: '24px' }} />
              </>
            )}

            <p className="kol-prose-label" style={{ marginBottom: '12px' }}>Quantity</p>
            <div className="inline-flex items-center gap-3" style={{ marginBottom: '32px' }}>
              <button
                type="button"
                aria-label="Decrease"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-9 h-9 inline-flex items-center justify-center bg-fg-04 hover:bg-fg-08 transition-colors rounded-full"
                style={{ border: 'none', cursor: 'pointer', color: 'inherit' }}
              ><Icon name="minus" size={14} /></button>
              <span className="kol-helper-xs" style={{ minWidth: '2em', textAlign: 'center' }}>{qty}</span>
              <button
                type="button"
                aria-label="Increase"
                onClick={() => setQty((q) => q + 1)}
                className="w-9 h-9 inline-flex items-center justify-center bg-fg-04 hover:bg-fg-08 transition-colors rounded-full"
                style={{ border: 'none', cursor: 'pointer', color: 'inherit' }}
              ><Icon name="plus" size={14} /></button>
            </div>

            <div className="flex flex-col gap-3" style={{ maxWidth: '380px' }}>
              {isPod ? (
                <>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={() => {
                      if (product.sizes.length > 1 && !size) return
                      addItem(product, { size: size ?? null, qty })
                      setAdded(true)
                      setTimeout(() => setAdded(false), 1600)
                    }}
                    disabled={product.sizes.length > 1 && !size}
                  >
                    {added ? 'Added to cart ✓' : 'Add to cart'}
                  </Button>
                  <Button variant="outline" size="lg" className="w-full" onClick={() => navigate('/cart')}>
                    View cart
                  </Button>
                </>
              ) : (
                <a href={`mailto:yr@another-creation.com?subject=Enquiry: ${encodeURIComponent(product.name)}`} className="no-underline">
                  <Button variant="primary" size="lg" className="w-full">Enquire about this piece</Button>
                </a>
              )}
            </div>

            {desc?.bullets?.length > 0 && (
              <>
                <Divider className="my-8" />
                <p className="kol-prose-label" style={{ marginBottom: '12px' }}>Details</p>
                <ul className="kol-prose">
                  {desc.bullets.map((b, i) => <li key={i} style={{ margin: '0 0 4px' }}>{b}</li>)}
                </ul>
              </>
            )}

            <Divider className="my-8" />

            <p className="kol-prose-label" style={{ marginBottom: '8px' }}>About this piece</p>
            <div className="kol-prose">
              {isPod ? (
                <p style={{ margin: 0 }}>
                  Made-to-order. Production 2–7 business days, then shipping. Recycled fabrics where possible.
                </p>
              ) : (
                <p style={{ margin: 0 }}>
                  Bespoke / made-to-order. Constructed by hand at the studio in Reykjavík. Lead time approximately four weeks; first fitting required for sizing.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
