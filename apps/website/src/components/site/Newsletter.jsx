import { useState } from 'react'
import Button from '../atoms/Button'
import Input from '../atoms/Input'

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
    <section className="bg-surface-inverse flex flex-col items-center gap-6 px-8 py-20">
      <p className="ac-prose-label text-center">Newsletter</p>
      <h2 className="ac-sans-heading-02 text-emphasis text-on-inverse text-center max-w-[640px]">
        {status === 'success'
          ? 'Thank you. Check your inbox to confirm.'
          : 'Early access on new releases, plus 10% off your first order.'}
      </h2>

      {status !== 'success' && (
        <form
          onSubmit={onSubmit}
          className="flex flex-col sm:flex-row gap-3 w-full max-w-[520px] mt-4"
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
            size="lg"
            variant="outline"
            className="flex-1"
          />
          <Button
            type="submit"
            variant="secondary"
            size="lg"
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Signing up…' : 'Sign Up'}
          </Button>
        </form>
      )}

      {status === 'error' && (
        <p role="alert" className="ac-helper-xs text-meta text-center">
          {errMsg}
        </p>
      )}
    </section>
  )
}
