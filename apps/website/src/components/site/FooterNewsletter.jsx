import { useState } from 'react'
import Button from '../atoms/Button'
import Input from '../atoms/Input'

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
    <div className="ac-site-footer-newsletter px-8 py-10">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div className="flex flex-col gap-1.5 max-w-[420px]">
          <p className="site-eyebrow-section">Newsletter</p>
          <p className="site-body-footer">
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
            <Input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={status === 'sending'}
              aria-invalid={status === 'error' ? 'true' : undefined}
              size="md"
              variant="outline"
              className="flex-1"
            />
            <Button
              type="submit"
              variant="secondary"
              size="md"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? 'Signing up…' : 'Sign Up'}
            </Button>
          </form>
        )}
      </div>

      {status === 'error' && (
        <p role="alert" className="site-meta-system mt-3">
          {errMsg}
        </p>
      )}
    </div>
  )
}
