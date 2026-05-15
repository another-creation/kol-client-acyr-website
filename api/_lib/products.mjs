/**
 * Server-side cart validation. The client posts a cart; we recompute every
 * line against `printful-products.json` (the committed source of truth) and
 * reject anything that doesn't line up. Client-submitted prices are never
 * trusted.
 *
 * Shipping is computed separately via `./shipping.mjs` (Printful real-time
 * rates) so it's not in this file's return shape.
 */

import productsData from '../../src/brand/data/printful-products.json' with { type: 'json' }

export function lookupVariant(slug, size) {
  const product = productsData.find((p) => p.slug === slug)
  if (!product) return null
  const wantedSize = size || 'One size'
  const variant    = product.variants.find((v) => v.size === wantedSize)
  if (!variant) return null
  return { product, variant }
}

export function validateAndPrice(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Cart is empty')
  }

  const lines   = []
  let itemTotal = 0
  let currency  = 'EUR'

  for (const it of items) {
    const found = lookupVariant(it.slug, it.size)
    if (!found) {
      throw new Error(`Unknown product: ${it.slug}${it.size ? ` (${it.size})` : ''}`)
    }
    const qty = Number(it.qty) || 0
    if (qty < 1 || qty > 99 || !Number.isInteger(qty)) {
      throw new Error(`Invalid qty for ${it.slug}: ${it.qty}`)
    }

    const unit      = Number(found.variant.retailPrice)
    const lineTotal = unit * qty
    itemTotal += lineTotal
    currency   = found.variant.currency

    lines.push({
      slug:          it.slug,
      size:          found.variant.size,
      qty,
      name:          found.product.name,
      unitPrice:     unit,
      lineTotal,
      currency:      found.variant.currency,
      syncVariantId: found.variant.syncVariantId,
    })
  }

  return { lines, itemTotal, currency }
}
