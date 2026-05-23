import { useState } from 'react'
import { BRAND_INFO } from '@ac/brand-data/info'
import Input from '../atoms/Input'
import Textarea from '../atoms/Textarea'
import Button from '../atoms/Button'
import Dropdown from '../molecules/Dropdown'

/**
 * EnquiryForm — shared mailto-composed enquiry form.
 *
 * Single source of truth for the Name + Email + Category + (optional Subject)
 * + Message + Send pattern. Consumed by Handmade page (commission flow) and
 * Contact page (general enquiries) — different category sets, same shape.
 *
 * Props:
 *   categories       — [{ value, label }] for the routing dropdown.
 *   defaultCategory  — initial selected value. Falls back to first option.
 *   subjectField     — bool. If true, renders a freeform Subject input
 *                      between the dropdown and the message. Default false.
 *   messagePlaceholder — textarea placeholder. Default 'Message'.
 *   tag              — optional prefix in the mailto subject line, e.g.
 *                      'Handmade' → `[Handmade · {category}] …`.
 *   recipient        — mailto target. Default = BRAND_INFO.contact.email.
 *
 * Mailto contract:
 *   subject: `[{tag · category-label}] {subject || name || 'New enquiry'}`
 *            (tag omitted if not provided)
 *   body:    Name / Email / Category / Subject? / (blank) / message
 */
export default function EnquiryForm({
  categories,
  defaultCategory,
  subjectField = false,
  messagePlaceholder = 'Message',
  tag,
  recipient = BRAND_INFO.contact.email,
}) {
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [category, setCategory] = useState(defaultCategory ?? categories[0]?.value ?? '')
  const [subject, setSubject]   = useState('')
  const [message, setMessage]   = useState('')

  const buildMailto = () => {
    const catLabel = categories.find((c) => c.value === category)?.label ?? category
    const prefix   = tag ? `${tag} · ${catLabel}` : catLabel
    const tail     = subjectField
      ? (subject || name || 'New enquiry')
      : (name || 'New enquiry')
    const subj = `[${prefix}] ${tail}`

    const bodyLines = [
      `Name: ${name || '—'}`,
      `Email: ${email || '—'}`,
      `Category: ${catLabel}`,
    ]
    if (subjectField) bodyLines.push(`Subject: ${subject || '—'}`)
    bodyLines.push('', message || '—')

    return `mailto:${recipient}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(bodyLines.join('\n'))}`
  }

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => { e.preventDefault(); window.location.href = buildMailto() }}
    >
      <Input size="lg" placeholder="Name"  required value={name}  onChange={(e) => setName(e.target.value)} />
      <Input size="lg" type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      <Dropdown
        variant="subtle"
        size="lg"
        className="w-full"
        options={categories}
        value={category}
        onChange={setCategory}
      />
      {subjectField && (
        <Input size="lg" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
      )}
      <Textarea
        size="lg"
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={messagePlaceholder}
        required
        className="!p-4 [&>textarea]:!p-0"
      />
      <div><Button type="submit" variant="ghost" size="lg">Send</Button></div>
    </form>
  )
}
