import { useState } from 'react'
import { Link } from 'react-router-dom'
import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '../../brand/config'
import { BRAND_INFO } from '../../brand/data/info'
import Divider from '../../components/atoms/Divider'
import Input from '../../components/atoms/Input'
import Textarea from '../../components/atoms/Textarea'
import Button from '../../components/atoms/Button'
import Icon from '../../components/loaders/icons/Icon'
import { handmadeProducts, formatPrice, HANDMADE_FAQ } from '../../brand/data/shop-data'
import { ACImages } from '../../brand/data/images'
import ProductCard from '../../components/site/ProductCard'

function FaqItem({ q, a, open, onToggle }) {
  return (
    <li className="border-b border-fg-08">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 text-left"
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit' }}
        aria-expanded={open}
      >
        <span className="kol-prose-label" style={{ margin: 0 }}>{q}</span>
        <Icon name={open ? 'minus' : 'plus'} size={14} />
      </button>
      {open && (
        <div className="kol-prose pb-5">
          <p style={{ margin: 0 }}>{a}</p>
        </div>
      )}
    </li>
  )
}

export default function Handmade() {
  usePageTitle(`${BRAND.name} — Handmade`)
  const products = handmadeProducts().slice(0, 6)
  const [openIdx, setOpenIdx] = useState(-1)
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [message, setMessage] = useState('')

  const buildMailto = () => {
    const subj = `[Handmade enquiry] ${name || 'New enquiry'}`
    const body = [`Name: ${name || '—'}`, `Email: ${email || '—'}`, '', message || '—'].join('\n')
    return `mailto:${BRAND_INFO.contact.email}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`
  }

  return (
    <main className="bg-surface-primary pb-24">
      {/* Hero — full-bleed mood image with overlaid Custom Made title (matches her live /handmade) */}
      <section className="relative w-full h-[60dvh] overflow-hidden">
        <img
          src={ACImages.handmade}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, color-mix(in srgb, var(--kol-surface-primary) 30%, transparent), color-mix(in srgb, var(--kol-surface-primary) 30%, transparent), var(--kol-surface-primary))' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-8">
            <p className="kol-prose-label">Made by hand by Ýr</p>
            <h1 className="kol-prose-display">Custom Made</h1>
            <p className="kol-prose-tagline" style={{ marginTop: '8px' }}>{BRAND_INFO.labels.manifesto}</p>
          </div>
        </div>
      </section>

      {/* Pieces */}
      <section className="max-w-6xl mx-auto px-8 pt-16">
        <p className="kol-prose-label">Pieces</p>
        <Divider className="mb-8" />
        <ul className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <li key={p.slug}>
              <ProductCard
                to={`/handmade/${p.slug}`}
                src={p.image}
                label={p.name}
                name={p.name}
                price={formatPrice(p.price, p.currency)}
                sizes={p.sizes}
              />
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-8 pt-24">
        <p className="kol-prose-label">Frequently asked questions</p>
        <Divider />
        <ul className="flex flex-col">
          {HANDMADE_FAQ.map((item, i) => (
            <FaqItem
              key={item.q}
              q={item.q}
              a={item.a}
              open={openIdx === i}
              onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}
            />
          ))}
        </ul>
      </section>

      {/* Inline contact form (mailto-styled) */}
      <section className="max-w-3xl mx-auto px-8 pt-20">
        <p className="kol-prose-label">Have questions?</p>
        <h2 className="kol-prose-title" style={{ fontSize: '40px', lineHeight: '44px', marginBottom: '16px' }}>Ask the studio.</h2>
        <p className="kol-prose-lede">
          Brief us on what you have in mind. We respond within two business days.
        </p>

        <form
          className="flex flex-col gap-4 mt-8"
          onSubmit={(e) => { e.preventDefault(); window.location.href = buildMailto() }}
        >
          <Input placeholder="Name"  required value={name}  onChange={(e) => setName(e.target.value)} />
          <Input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What can we make?"
            required
            className="!p-4 [&>textarea]:!p-0"
          />
          <div><Button type="submit" variant="primary" size="lg">Send</Button></div>
        </form>
      </section>
    </main>
  )
}
