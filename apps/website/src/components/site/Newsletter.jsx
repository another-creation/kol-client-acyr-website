import { useState } from 'react'

const NARROW = "'Right Grotesk Narrow', 'Right Grotesk', sans-serif"

export default function Newsletter() {
  const [email, setEmail]   = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errMsg, setErrMsg] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setErrMsg('')
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus('success')
        setEmail('')
        return
      }
      const data = await res.json().catch(() => ({}))
      setErrMsg(data?.error === 'Invalid email' ? 'Please enter a valid email.' : 'Something went wrong. Please try again.')
      setStatus('error')
    } catch {
      setErrMsg('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          background: 'color-mix(in srgb, var(--ac-surface-on-primary) 88%, transparent)',
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
            color: 'color-mix(in srgb, var(--ac-surface-primary) 40%, transparent)',
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
            color: 'var(--ac-surface-primary)',
            maxWidth: '400px',
          }}
        >
          {status === 'success' ? (
            <>Thank you. Please check your inbox<br />to confirm your subscription.</>
          ) : (
            <>Sign up for early access on new releases<br />and save 10% on your first order</>
          )}
        </p>
        {status !== 'success' && (
          <form onSubmit={onSubmit} className="ac-site-newsletter-row" style={{ maxWidth: '480px', width: '100%' }} noValidate>
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={status === 'sending'}
              aria-invalid={status === 'error' ? 'true' : undefined}
              style={{
                fontFamily: NARROW,
                fontSize: '13px',
                letterSpacing: '0.04em',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid color-mix(in srgb, var(--ac-surface-primary) 40%, transparent)',
                color: 'var(--ac-surface-primary)',
                padding: '10px 0',
                flex: 1,
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="ac-btn ac-btn-primary ac-btn-sm ac-site-newsletter-submit"
              style={{
                fontFamily: NARROW,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {status === 'sending' ? 'Signing up…' : 'Sign Up'}
            </button>
          </form>
        )}
        {status === 'error' && (
          <p
            role="alert"
            style={{
              fontFamily: NARROW,
              fontSize: '12px',
              letterSpacing: '0.04em',
              color: 'color-mix(in srgb, var(--ac-surface-primary) 70%, transparent)',
              textAlign: 'center',
            }}
          >
            {errMsg}
          </p>
        )}
      </div>
    </div>
  )
}
