import { useState } from 'react'

const NARROW = "'Right Grotesk Narrow', 'Right Grotesk', sans-serif"

export default function Newsletter() {
  const [email, setEmail] = useState('')

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          background: 'color-mix(in srgb, var(--kol-surface-on-primary) 88%, transparent)',
          padding: 'clamp(32px, 8vw, 64px) clamp(20px, 5vw, 48px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        <p
          style={{
            fontFamily: NARROW,
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            textAlign: 'center',
            color: 'color-mix(in srgb, var(--kol-surface-primary) 40%, transparent)',
          }}
        >
          Newsletter
        </p>
        <p
          style={{
            fontFamily: NARROW,
            fontSize: '24px',
            fontWeight: 400,
            lineHeight: 1.3,
            textAlign: 'center',
            color: 'var(--kol-surface-primary)',
            maxWidth: '400px',
          }}
        >
          Sign up for early access on new releases<br />
          and save 10% on your first order
        </p>
        <div className="kol-site-newsletter-row" style={{ maxWidth: '480px', width: '100%' }}>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              fontFamily: NARROW,
              fontSize: '13px',
              letterSpacing: '0.04em',
              background: 'transparent',
              border: 'none',
              borderBottom: '1px solid color-mix(in srgb, var(--kol-surface-primary) 40%, transparent)',
              color: 'var(--kol-surface-primary)',
              padding: '10px 0',
              flex: 1,
              outline: 'none',
            }}
          />
          <button
            className="kol-btn kol-btn-primary kol-btn-sm kol-site-newsletter-submit"
            style={{
              fontFamily: NARROW,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  )
}
