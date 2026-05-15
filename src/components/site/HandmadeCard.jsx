import { ACImages } from '../../brand/data/images'
import Button from '../atoms/Button'

const TIGHT = "'Right Grotesk Tight', 'Right Grotesk', sans-serif"

export default function HandmadeCard() {
  return (
    <section
      style={{
        position: 'relative',
        height: '90vh',
        minHeight: '560px',
        backgroundImage: `url(${ACImages.handmade})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '64px',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)',
        }}
      />
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          maxWidth: '480px',
        }}
      >
        <h2
          style={{
            fontFamily: TIGHT,
            fontWeight: 600,
            fontSize: 'clamp(40px, 5.5vw, 72px)',
            lineHeight: 1.05,
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            color: '#F5F3EF',
          }}
        >
          Handmade &amp;<br />tailored<br />to your needs
        </h2>
        <div style={{ marginTop: '8px' }}>
          <Button size="lg" variant="outline">Shop Jackets</Button>
        </div>
      </div>
    </section>
  )
}
