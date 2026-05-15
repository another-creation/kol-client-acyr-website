import { useMemo, useState } from 'react'
import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '../../brand/config'
import { BRAND_INFO } from '../../brand/data/info'
import Divider from '../../components/atoms/Divider'
import Button from '../../components/atoms/Button'
import Input from '../../components/atoms/Input'
import Textarea from '../../components/atoms/Textarea'
import Dropdown from '../../components/molecules/Dropdown'

const SUBJECTS = [
  { value: 'general',       label: 'General enquiry' },
  { value: 'order',         label: 'Order or shipping' },
  { value: 'made-to-order', label: 'Made-to-order / fitting' },
  { value: 'press',         label: 'Press / interview' },
  { value: 'wholesale',     label: 'Stockist / wholesale' },
]

export default function Contact() {
  usePageTitle(`Contact · ${BRAND.name}`)
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [subject, setSubject] = useState('general')
  const [message, setMessage] = useState('')

  const mailtoHref = useMemo(() => {
    const label = SUBJECTS.find((s) => s.value === subject)?.label ?? 'General enquiry'
    const subj  = `[${label}] ${name || 'New enquiry'}`
    const body  = [`Name: ${name || '—'}`, `Email: ${email || '—'}`, `Subject: ${label}`, '', message || '—'].join('\n')
    return `mailto:${BRAND_INFO.contact.email}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`
  }, [name, email, subject, message])

  return (
    <main className="bg-surface-primary pb-24">
      <section className="max-w-3xl mx-auto px-8 pt-20">
        <p className="kol-prose-label">Contact</p>
        <h1 className="kol-prose-display-md">Studio &amp; enquiries.</h1>
        <p className="kol-prose-lede">
          For appointments, made-to-order fittings, press, or general enquiries — write directly. We answer within two business days.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-8 pt-12 pb-12">
        <Divider />
        <div className="grid gap-8 sm:grid-cols-2 pt-8">
          <div>
            <p className="kol-prose-label">Studio</p>
            <div className="kol-prose">
              <p style={{ margin: '0 0 4px' }}><strong>{BRAND_INFO.studio.street}</strong></p>
              <p style={{ margin: '0 0 4px' }}>{BRAND_INFO.studio.postcode}</p>
              <p style={{ margin: 0 }}>{BRAND_INFO.studio.country}</p>
            </div>
          </div>
          <div>
            <p className="kol-prose-label">Hours</p>
            <div className="kol-prose">
              <p style={{ margin: '0 0 4px' }}>Mon–Fri 13:00–18:00</p>
              <p style={{ margin: 0 }}>Sat 13:00–16:00</p>
            </div>
          </div>
          <div>
            <p className="kol-prose-label">Direct</p>
            <div className="kol-prose">
              <p style={{ margin: '0 0 4px' }}>
                <a href={`mailto:${BRAND_INFO.contact.email}`}>{BRAND_INFO.contact.email}</a>
              </p>
              <p style={{ margin: 0 }}>{BRAND_INFO.contact.phone}</p>
            </div>
          </div>
          <div>
            <p className="kol-prose-label">Press</p>
            <div className="kol-prose">
              <p style={{ margin: 0 }}>
                <a href={`mailto:${BRAND_INFO.contact.email}?subject=${encodeURIComponent('[Press] Enquiry')}`}>{BRAND_INFO.contact.email}</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-8 pb-24">
        <Divider />
        <p className="kol-prose-label" style={{ marginTop: '32px' }}>Write to us</p>
        <p className="kol-prose-tagline" style={{ marginTop: '4px' }}>
          The form opens your mail client with the message pre-filled.
        </p>

        <form
          className="flex flex-col gap-4 mt-8"
          onSubmit={(e) => { e.preventDefault(); window.location.href = mailtoHref }}
        >
          <Input placeholder="Name"  required value={name}  onChange={(e) => setName(e.target.value)} />
          <Input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Dropdown variant="subtle" options={SUBJECTS} value={subject} onChange={setSubject} className="w-full" />
          <Textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message"
            required
            className="!p-4 [&>textarea]:!p-0"
          />
          <div style={{ marginTop: '8px' }}>
            <Button type="submit" variant="primary" size="lg">Send</Button>
          </div>
        </form>
      </section>
    </main>
  )
}
