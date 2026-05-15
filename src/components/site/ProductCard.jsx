import { Link } from 'react-router-dom'

const NARROW = "'Right Grotesk Narrow', 'Right Grotesk', sans-serif"

export default function ProductCard({ src, label, name, price, sizes = [], color, to }) {
  const Wrapper = to ? Link : 'div'
  const wrapperProps = to ? { to, className: 'block no-underline' } : {}
  return (
    <Wrapper {...wrapperProps}>
      <div
        className="kol-product-card bg-surface-secondary group"
        style={{ position: 'relative', aspectRatio: '3 / 4', overflow: 'hidden' }}
      >
        <img
          src={src}
          alt={label}
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
        />
        <div
          data-overlay
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            background: '#000',
            display: 'flex',
            flexDirection: 'column',
            padding: '16px 14px',
          }}
        >
          <p style={{ fontFamily: NARROW, fontWeight: 700, fontSize: '13px', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#fff', marginBottom: '2px' }}>
            {name}
          </p>
          <p style={{ fontFamily: NARROW, fontSize: '13px', fontWeight: 400, color: 'rgba(255,255,255,0.72)', marginBottom: '10px' }}>
            {price}
          </p>
          {color && (
            <p style={{ fontFamily: NARROW, fontSize: '9px', fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '6px' }}>
              Color: {color}
            </p>
          )}
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '14px' }}>
            {sizes.map(s => (
              <span
                key={s}
                style={{
                  fontFamily: NARROW,
                  fontSize: '9px',
                  letterSpacing: '0.06em',
                  padding: '2px 6px',
                  border: '1px solid rgba(255,255,255,0.24)',
                  color: 'rgba(255,255,255,0.64)',
                }}
              >
                {s}
              </span>
            ))}
          </div>
          <button className="kol-btn kol-btn-primary kol-btn-sm" style={{ fontFamily: NARROW, letterSpacing: '0.08em', width: '100%', marginBottom: '6px' }}>
            Add to Bag
          </button>
          <button className="kol-btn kol-btn-outline kol-btn-sm" style={{ fontFamily: NARROW, letterSpacing: '0.08em', width: '100%', borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>
            Wishlist
          </button>
        </div>
      </div>
      <p
        style={{
          fontFamily: NARROW,
          fontSize: '11px',
          fontWeight: 400,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'color-mix(in srgb, var(--kol-surface-on-primary) 48%, transparent)',
          marginTop: '8px',
        }}
      >
        {label}
      </p>
    </Wrapper>
  )
}
