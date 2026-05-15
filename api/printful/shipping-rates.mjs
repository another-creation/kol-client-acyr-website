/**
 * POST /api/printful/shipping-rates
 *
 * Body: { items: [{ slug, size, qty }], delivery: { country, postcode, street, city } }
 *
 * Returns the cheapest Printful shipping option for the cart + destination.
 * Client calls this when delivery is filled; PayPal's create-order re-fetches
 * the same rate server-side so the customer is never undercharged.
 */

import { getShippingRate } from '../_lib/shipping.mjs'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    const body     = req.body ?? {}
    const items    = body.items    ?? []
    const delivery = body.delivery ?? {}

    const shipping = await getShippingRate({ items, delivery })
    res.status(200).json(shipping)
  } catch (err) {
    console.error('shipping-rates error:', err.message)
    res.status(400).json({ error: err.message })
  }
}
