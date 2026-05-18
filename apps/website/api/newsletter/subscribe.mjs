/**
 * POST /api/newsletter/subscribe
 *
 * Body: { email }
 *
 * Posts to MailerLite Connect API. `status` is omitted so the account-level
 * "Double opt-in for API and integrations" toggle controls the confirmation flow.
 *
 * Env: MAILERLITE_TOKEN, MAILERLITE_GROUP_ID
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  const token   = process.env.MAILERLITE_TOKEN
  const groupId = process.env.MAILERLITE_GROUP_ID
  if (!token || !groupId) {
    res.status(500).json({ error: 'Newsletter not configured' })
    return
  }

  const email = String(req.body?.email ?? '').trim().toLowerCase()
  if (!EMAIL_RE.test(email)) {
    res.status(400).json({ error: 'Invalid email' })
    return
  }

  try {
    const upstream = await fetch('https://connect.mailerlite.com/api/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type':  'application/json',
        'Accept':        'application/json',
      },
      body: JSON.stringify({ email, groups: [groupId] }),
    })

    if (upstream.ok) {
      res.status(200).json({ ok: true })
      return
    }

    if (upstream.status === 422) {
      res.status(400).json({ error: 'Invalid email' })
      return
    }

    const detail = await upstream.text().catch(() => '')
    console.error('[newsletter] mailerlite error', upstream.status, detail)
    res.status(502).json({ error: 'Subscription failed' })
  } catch (err) {
    console.error('[newsletter] network error', err)
    res.status(502).json({ error: 'Subscription failed' })
  }
}
