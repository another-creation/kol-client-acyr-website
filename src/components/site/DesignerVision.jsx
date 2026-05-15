import { ACImages } from '../../brand/data/images'
import Button from '../atoms/Button'

const NARROW = "'Right Grotesk Narrow', 'Right Grotesk', sans-serif"

export default function DesignerVision() {
  return (
    <section
      className="bg-surface-primary"
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', height: '80vh' }}
    >
      <div className="bg-surface-secondary" style={{ overflow: 'hidden' }}>
        <img
          src="/brand/yr/acyr-01.jpg"
          alt="Designer"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px 64px', gap: '24px' }}>
        <p
          style={{
            fontFamily: NARROW,
            fontSize: '11px',
            fontWeight: 400,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'color-mix(in srgb, var(--kol-surface-on-primary) 32%, transparent)',
          }}
        >
          The Designer
        </p>
        <h2
          style={{
            fontFamily: NARROW,
            fontWeight: 700,
            fontSize: 'clamp(32px, 4vw, 52px)',
            lineHeight: 1.05,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            color: 'var(--kol-surface-on-primary)',
          }}
        >
          Designer's<br />Vision
        </h2>
        <p
          style={{
            fontFamily: NARROW,
            fontSize: '15px',
            fontWeight: 400,
            lineHeight: 1.75,
            maxWidth: '380px',
            color: 'color-mix(in srgb, var(--kol-surface-on-primary) 72%, transparent)',
          }}
        >
          Every piece begins with a single question: what does a woman truly need?
          Not trend, not noise — but a garment that becomes part of her story.
          Crafted by hand from the finest materials, each design is made to age
          beautifully and last a lifetime.
        </p>
        <p
          style={{
            fontFamily: NARROW,
            fontSize: '15px',
            fontWeight: 400,
            lineHeight: 1.75,
            maxWidth: '380px',
            color: 'color-mix(in srgb, var(--kol-surface-on-primary) 48%, transparent)',
          }}
        >
          Based in Central Europe, our small atelier works with local artisans
          who share our obsession with detail. Slow fashion. No seasons.
          Just enduring quality.
        </p>
        <div style={{ marginTop: '8px' }}>
          <Button size="md">Our Story</Button>
        </div>
      </div>
    </section>
  )
}
