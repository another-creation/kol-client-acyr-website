import { useState } from 'react'
import Button from '../atoms/Button'

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
    <div className="ac-site-footer-newsletter px-8 py-10 border-b border-fg-12">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-col gap-1.5 max-w-[420px]">
          <p className="ac-prose-label">Newsletter</p>
          <p className="ac-sans-nav text-body normal-case tracking-[0.04em]" style={{ fontSize: 14, lineHeight: 1.4 }}>
            {status === 'success'
              ? 'Thank you. Please check your inbox to confirm your subscription.'
              : 'Early access to new releases and atelier notes.'}
          </p>
        </div>

        {status !== 'success' && (
          <form
            onSubmit={onSubmit}
            className="ac-site-footer-newsletter-row flex gap-3 flex-1 min-w-[260px] max-w-[440px]"
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
              className="ac-sans-nav text-emphasis flex-1 bg-transparent border-0 border-b border-fg-24 px-0 py-2.5 outline-none"
              style={{ fontSize: 13 }}
            />
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? 'Signing up…' : 'Sign Up'}
            </Button>
          </form>
        )}
      </div>

      {status === 'error' && (
        <p role="alert" className="ac-sans-nav text-meta normal-case tracking-[0.04em] mt-3" style={{ fontSize: 12 }}>
          {errMsg}
        </p>
      )}
    </div>
  )
}
