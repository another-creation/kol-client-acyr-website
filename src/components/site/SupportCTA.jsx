import Button from '../atoms/Button'

const NARROW = "'Right Grotesk Narrow', 'Right Grotesk', sans-serif"

export default function SupportCTA() {
  return (
    <section
      className="bg-surface-inverse"
      style={{
        padding: '96px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '20px',
      }}
    >
      <p
        style={{
          fontFamily: NARROW,
          fontSize: '11px',
          fontWeight: 400,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          opacity: 0.38,
        }}
      >
        Independent Studio
      </p>
      <h2
        style={{
          fontFamily: NARROW,
          fontWeight: 700,
          fontSize: 'clamp(36px, 5vw, 64px)',
          lineHeight: 1.05,
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
          maxWidth: '540px',
        }}
      >
        Support my Journey
      </h2>
      <p
        style={{
          fontFamily: NARROW,
          fontSize: '15px',
          fontWeight: 400,
          lineHeight: 1.75,
          maxWidth: '400px',
          opacity: 0.6,
        }}
      >
        When you buy from Another Creation you support an independent atelier,
        not a factory floor. Made to order. Made to last.
      </p>
      <div className="kol-site-support-cta-actions" style={{ marginTop: '16px' }}>
        <Button size="lg">Shop Collection</Button>
        <Button size="lg" variant="outline">Learn More</Button>
      </div>
    </section>
  )
}
