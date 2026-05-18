import { useState } from 'react'

const NARROW = "'Right Grotesk Narrow', 'Right Grotesk', sans-serif"
const MONO   = "'Right Grotesk Mono', monospace"

export default function FooterNewsletter() {
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
    <div
      className="ac-site-footer-newsletter"
      style={{
        padding: '40px 32px',
        borderBottom: '1px solid color-mix(in srgb, var(--ac-surface-on-primary) 12%, transparent)',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '420px' }}>
          <p
            style={{
              fontFamily: MONO,
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'color-mix(in srgb, var(--ac-surface-on-primary) 48%, transparent)',
              margin: 0,
            }}
          >
            Newsletter
          </p>
          <p
            style={{
              fontFamily: NARROW,
              fontSize: '14px',
              fontWeight: 400,
              lineHeight: 1.4,
              letterSpacing: '0.04em',
              color: 'color-mix(in srgb, var(--ac-surface-on-primary) 80%, transparent)',
              margin: 0,
            }}
          >
            {status === 'success'
              ? 'Thank you. Please check your inbox to confirm your subscription.'
              : 'Early access to new releases and atelier notes.'}
          </p>
        </div>

        {status !== 'success' && (
          <form
            onSubmit={onSubmit}
            className="ac-site-footer-newsletter-row"
            style={{ display: 'flex', gap: '12px', flex: '1 1 320px', maxWidth: '440px', minWidth: '260px' }}
            noValidate
          >
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
                borderBottom: '1px solid color-mix(in srgb, var(--ac-surface-on-primary) 30%, transparent)',
                color: 'var(--ac-surface-on-primary)',
                padding: '10px 0',
                flex: 1,
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="ac-btn ac-btn-ghost ac-btn-sm"
              style={{
                fontFamily: MONO,
                fontSize: '11px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--ac-surface-on-primary)',
                borderColor: 'color-mix(in srgb, var(--ac-surface-on-primary) 30%, transparent)',
                whiteSpace: 'nowrap',
              }}
            >
              {status === 'sending' ? 'Signing up…' : 'Sign Up'}
            </button>
          </form>
        )}
      </div>

      {status === 'error' && (
        <p
          role="alert"
          style={{
            fontFamily: NARROW,
            fontSize: '12px',
            letterSpacing: '0.04em',
            marginTop: '12px',
            color: 'color-mix(in srgb, var(--ac-surface-on-primary) 70%, transparent)',
          }}
        >
          {errMsg}
        </p>
      )}
    </div>
  )
}
