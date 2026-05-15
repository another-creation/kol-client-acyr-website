/**
 * Real-time shipping rate from Printful. Called by `/api/printful/shipping-rates`
 * (client-visible) and `/api/paypal/create-order` (server-internal). Both go
 * through this helper so the rate the customer sees matches what PayPal charges.
 */

import { printfulFetch } from './printful.mjs'
import { lookupVariant } from './products.mjs'

export async function getShippingRate({ items, delivery }) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Cart is empty')
  }
  if (!delivery?.country) {
    throw new Error('Delivery country is required to calculate shipping')
  }

  const printfulItems = items.map((it) => {
    const found = lookupVariant(it.slug, it.size)
    if (!found) throw new Error(`Unknown product: ${it.slug}`)
    return {
      sync_variant_id: found.variant.syncVariantId,
      quantity:        Number(it.qty) || 1,
    }
  })

  const res = await printfulFetch('/shipping/rates', {
    method: 'POST',
    body: JSON.stringify({
      recipient: {
        address1:     delivery.street   ?? '',
        city:         delivery.city     ?? '',
        country_code: delivery.country,
        zip:          delivery.postcode ?? '',
      },
      items:    printfulItems,
      currency: 'EUR',
      locale:   'en_US',
    }),
  })

  const rates = res?.result ?? []
  if (rates.length === 0) {
    throw new Error('No shipping options available for this address')
  }

  // Printful returns sorted cheapest-first but be explicit.
  const cheapest = rates.reduce((min, r) => (Number(r.rate) < Number(min.rate) ? r : min))

  return {
    rate:     Number(cheapest.rate),
    currency: cheapest.currency,
    name:     cheapest.name,
    minDays:  cheapest.minDeliveryDays,
    maxDays:  cheapest.maxDeliveryDays,
  }
}
