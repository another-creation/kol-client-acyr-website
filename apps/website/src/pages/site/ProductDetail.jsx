import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '@ac/brand-data/config'
import Divider from '../../components/atoms/Divider'
import Button from '../../components/atoms/Button'
import Icon from '../../components/loaders/icons/Icon'
import { findProduct, formatPrice } from '../../data/shop-data'
import { useCart } from '../../components/site/CartContext'
import BackLink from '../../components/site/BackLink'
import PageHero from '../../components/site/PageHero'
import SiteSection from '../../components/site/SiteSection'

const COLOR_HEX = {
  'White':         '#ffffff',
  'Dark Navy':     '#1c2433',
  'Heather Clay':  '#a3796b',
  'Black Heather': '#222129',
  'Red':           '#c4232f',
  'Kelly':         '#1b8240',
  'Light Blue':    '#a8c8e1',
}

function SizeRow({ sizes, value, onChange }) {
  return (
    <div className="flex flex-wrap items-center border-b border-fg-16">
      {sizes.map((s) => {
        const active = s === value
        return (
          <button
            type="button"
            key={s}
            onClick={() => onChange(s)}
            className="site-name-card"
            style={{
              padding: '10px 14px',
              border: 'none',
              borderBottom: '2px solid',
              borderBottomColor: active ? 'var(--ac-surface-on-primary)' : 'transparent',
              marginBottom: -1,
              background: 'transparent',
              color: active ? 'var(--ac-surface-on-primary)' : 'var(--ac-fg-80)',
              cursor: 'pointer',
              transition: 'border-color 150ms ease, color 150ms ease',
            }}
          >
            {s}
          </button>
        )
      })}
    </div>
  )
}

const isLightHex = (hex) => {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 180
}

function ColorSwatches({ colors, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {colors.map((c) => {
        const active = c.name === value
        const hex    = COLOR_HEX[c.name] ?? '#cccccc'
        const dot    = isLightHex(hex) ? '#000' : '#fff'
        return (
          <button
            type="button"
            key={c.name}
            onClick={() => onChange(c.name)}
            aria-label={c.name}
            title={c.name}
            className="inline-flex items-center justify-center rounded-full"
            style={{
              width: 28,
              height: 28,
              background: hex,
              border: 'none',
              padding: 0,
              cursor: 'pointer',
            }}
          >
            {active && (
              <span
                aria-hidden
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: dot,
                }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

export default function ProductDetail() {
  const { slug } = useParams()
  const product  = findProduct(slug)
  const { addItem } = useCart()

  const colors      = product?.colors ?? []
  const multiColor  = colors.length > 1
  const initColor   = useMemo(
    () => colors.find((c) => c.images?.length > 0) ?? colors[0] ?? null,
    [colors],
  )

  const [size, setSize]         = useState(null)
  const [color, setColor]       = useState(initColor?.name ?? null)
  const [imageIdx, setImageIdx] = useState(0)
  const [qty, setQty]           = useState(1)

  usePageTitle(product ? `${product.name} · ${BRAND.name}` : `${BRAND.name}`)

  useEffect(() => {
    if (product?.sizes?.length === 1) setSize(product.sizes[0])
  }, [product])

  const selectColor = (next) => {
    setColor(next)
    setImageIdx(0)
  }

  if (!product) {
    return (
      <SiteSection as="main" className="bg-surface-primary min-h-dvh px-8 py-24 text-center">
        <p className="site-meta-status">404</p>
        <h1 className="site-title-page">Product not found.</h1>
        <BackLink to="/shop">← Back to shop</BackLink>
      </SiteSection>
    )
  }

  const isPod      = product.kind === 'pod'
  const indexHref  = isPod ? '/shop' : '/handmade'
  const indexLabel = isPod ? 'Shop' : 'Handmade'
  const desc       = product.description ?? null

  const sizeRequired  = isPod && product.sizes && product.sizes.length > 1 && !size
  const colorRequired = isPod && multiColor && !color

  const selectedVariant = (product.variants ?? []).find((v) =>
    v.size === (size ?? 'One size') && (v.color ?? null) === (color ?? null),
  )
  const unitPrice = selectedVariant?.retailPrice ?? product.price

  const priceLabel = (() => {
    if (selectedVariant) return formatPrice(unitPrice, product.currency)
    if (product.priceMax && product.priceMax !== product.price) {
      return `From ${formatPrice(product.price, product.currency)}`
    }
    return formatPrice(product.price, product.currency)
  })()

  const colorObj       = colors.find((c) => c.name === color)
  const galleryImages  = (colorObj?.images?.length ? colorObj.images : [product.image]).filter(Boolean)
  const showThumbs     = galleryImages.length > 1
  const activeImage    = galleryImages[Math.min(imageIdx, galleryImages.length - 1)] ?? null

  return (
    <main className="bg-surface-primary">
      <section className="grid lg:grid-cols-[3fr_2fr] items-start min-h-[calc(100dvh-var(--ac-topnav-h,0px))]">
        {/* IMAGE */}
        <div className="bg-surface-secondary aspect-square lg:aspect-auto lg:h-[calc(100dvh-var(--ac-topnav-h,0px))] lg:sticky lg:top-[var(--ac-topnav-h,0px)] overflow-hidden relative">
          {activeImage ? (
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : null}

          {showThumbs && (
            <div className="absolute left-4 bottom-4 flex flex-col gap-2 max-h-[calc(100%-2rem)] overflow-y-auto">
              {galleryImages.map((src, i) => {
                const active = i === imageIdx
                return (
                  <button
                    type="button"
                    key={src}
                    onClick={() => setImageIdx(i)}
                    aria-label="View image"
                    className="block w-14 h-14 rounded-[4px] overflow-hidden bg-surface-primary"
                    style={{
                      border: `1px solid ${active ? 'var(--ac-surface-on-primary)' : 'var(--ac-fg-12)'}`,
                      padding: 0,
                      cursor: 'pointer',
                      transition: 'border-color 150ms ease',
                    }}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="px-8 lg:px-16 py-12 lg:py-20">
          <div className="max-w-[560px] flex flex-col">
            <p className="site-meta-status mb-6">
              <Link to={indexHref} className="text-meta hover:text-emphasis no-underline">{indexLabel}</Link>
              <span className="mx-2">/</span>
              <span className="text-emphasis">{product.name}</span>
            </p>

            <PageHero
              title={product.name}
              subline={priceLabel}
            />

            <Divider className="my-6" />

            <div className="ac-prose mb-8">
              <p style={{ margin: 0 }}>{product.excerpt}</p>
              {desc?.blurb && <p style={{ margin: '12px 0 0' }}>{desc.blurb}</p>}
            </div>

            {isPod && multiColor && (
              <div className="mb-6">
                <p className="site-label-form mb-3">
                  Color: <span className="text-meta ml-1">{color ?? '—'}</span>
                </p>
                <ColorSwatches
                  colors={colors}
                  value={color}
                  onChange={selectColor}
                />
              </div>
            )}

            {isPod && product.sizes && product.sizes.length > 1 && (
              <div className="mb-6">
                <p className="site-label-form mb-3">
                  Size: <span className="text-meta ml-1">{size ?? '—'}</span>
                </p>
                <SizeRow sizes={product.sizes} value={size} onChange={setSize} />
              </div>
            )}

            <div className="mb-8">
              <p className="site-label-form mb-3">Quantity</p>
              <div className="inline-flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Decrease"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-9 h-9 inline-flex items-center justify-center bg-fg-04 hover:bg-fg-08 transition-colors rounded-full"
                  style={{ border: 'none', cursor: 'pointer', color: 'inherit' }}
                ><Icon name="minus" size={14} /></button>
                <span className="site-name-card" style={{ minWidth: '2em', textAlign: 'center' }}>{qty}</span>
                <button
                  type="button"
                  aria-label="Increase"
                  onClick={() => setQty((q) => q + 1)}
                  className="w-9 h-9 inline-flex items-center justify-center bg-fg-04 hover:bg-fg-08 transition-colors rounded-full"
                  style={{ border: 'none', cursor: 'pointer', color: 'inherit' }}
                ><Icon name="plus" size={14} /></button>
              </div>
            </div>

            {isPod ? (
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => {
                  if (sizeRequired || colorRequired) return
                  addItem(product, {
                    size:  size ?? null,
                    color: color ?? null,
                    qty,
                    price: unitPrice,
                    image: activeImage ?? product.image,
                  })
                }}
                disabled={sizeRequired || colorRequired}
              >
                {colorRequired ? 'Select a color'
                  : sizeRequired ? 'Select a size'
                  : `Add to bag — ${formatPrice(unitPrice * qty, product.currency)}`}
              </Button>
            ) : (
              <a href={`mailto:yr@another-creation.com?subject=Enquiry: ${encodeURIComponent(product.name)}`} className="no-underline">
                <Button variant="primary" size="lg" className="w-full">Enquire about this piece</Button>
              </a>
            )}

            {desc?.bullets?.length > 0 && (
              <>
                <Divider className="my-10" />
                <p className="site-label-form mb-3">Details</p>
                <ul className="ac-prose">
                  {desc.bullets.map((b, i) => <li key={i} style={{ margin: '0 0 4px' }}>{b}</li>)}
                </ul>
              </>
            )}

            <Divider className="my-10" />

            <p className="site-label-form mb-3">About this piece</p>
            <div className="ac-prose">
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
