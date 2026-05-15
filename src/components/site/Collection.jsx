import { ACImages } from '../../brand/data/images'
import ProductCard from './ProductCard'

const NARROW = "'Right Grotesk Narrow', 'Right Grotesk', sans-serif"

export default function Collection() {
  return (
    <section className="bg-surface-primary" style={{ padding: '80px 32px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginBottom: '40px',
        }}
      >
        <h2
          style={{
            fontFamily: NARROW,
            fontWeight: 700,
            fontSize: '13px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--kol-surface-on-primary)',
          }}
        >
          Collection
        </h2>
        <span
          style={{
            fontFamily: NARROW,
            fontSize: '11px',
            fontWeight: 400,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'color-mix(in srgb, var(--kol-surface-on-primary) 32%, transparent)',
          }}
        >
          SS 2024
        </span>
      </div>

      <div className="kol-site-collection-grid">
        {ACImages.looks.map(look => (
          <ProductCard key={look.label} {...look} />
        ))}
      </div>
    </section>
  )
}
