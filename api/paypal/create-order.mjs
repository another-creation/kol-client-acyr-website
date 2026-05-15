/**
 * POST /api/paypal/create-order
 *
 * Body: { items: [{ slug, size, qty }], delivery: { country, ... } }
 *
 * Validates the cart, fetches real Printful shipping for the destination,
 * creates a PayPal order (intent=CAPTURE) with the combined total. Returns
 * { orderID } for the Smart Buttons SDK to approve.
 */

import { paypalFetch } from '../_lib/paypal.mjs'
import { validateAndPrice } from '../_lib/products.mjs'
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

    const priced   = validateAndPrice(items)
    const shipping = await getShippingRate({ items, delivery })
    const total    = priced.itemTotal + shipping.rate

    const order = await paypalFetch('/v2/checkout/orders', {
      method: 'POST',
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: priced.currency,
            value:         total.toFixed(2),
            breakdown: {
              item_total: { currency_code: priced.currency, value: priced.itemTotal.toFixed(2) },
              shipping:   { currency_code: priced.currency, value: shipping.rate.toFixed(2) },
            },
          },
          items: priced.lines.map((l) => ({
            name:        l.size && l.size !== 'One size' ? `${l.name} (${l.size})` : l.name,
            quantity:    String(l.qty),
            unit_amount: { currency_code: l.currency, value: l.unitPrice.toFixed(2) },
          })),
        }],
      }),
    })

    res.status(200).json({ orderID: order.id })
  } catch (err) {
    console.error('create-order error:', err.message)
    res.status(400).json({ error: err.message })
  }
}
