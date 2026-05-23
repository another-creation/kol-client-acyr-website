import { useRef, useState } from 'react'
import Button from '../atoms/Button'
import Input from '../atoms/Input'
import useReveal from '../../hooks/useReveal'

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

  const sectionRef = useRef(null)
  useReveal(sectionRef, { y: 14, duration: 0.45, stagger: 0.06, ease: 'power2.out' })

  return (
    <section ref={sectionRef} data-theme="light" className="relative bg-surface-primary min-h-[60vh] flex flex-col items-center justify-center gap-6 px-8 py-20 overflow-hidden">
      {/* marble texture over the light surface, 40% */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: 'url(/brand/textures/ac-marble.jpg)', opacity: 0.15 }}
      />

      <p data-reveal className="relative site-eyebrow-section text-center">Newsletter</p>
      <h2 data-reveal className="relative site-title-section text-center max-w-[640px]">
        {status === 'success'
          ? 'Thank you. Check your inbox to confirm.'
          : 'Early access on new releases, plus 10% off your first order.'}
      </h2>

      {status !== 'success' && (
        <form
          onSubmit={onSubmit}
          className="relative flex flex-col sm:flex-row gap-3 w-full max-w-[520px] mt-4"
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
            variant="filled"
            className="flex-1"
          />
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={status === 'sending'}
          >
            {status === 'sending' ? 'Signing up…' : 'Sign Up'}
          </Button>
        </form>
      )}

      {status === 'error' && (
        <p role="alert" className="relative site-meta-system text-center">
          {errMsg}
        </p>
      )}
    </section>
  )
}
