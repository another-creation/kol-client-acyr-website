#!/usr/bin/env node
/**
 * Pull sync products from the Printful API store and write them to
 * apps/website/src/data/printful-products.json. Mockups download into
 * assets/brand/shop/pod/<slug>/<color-slug>/<N>.<ext> via the apps/website
 * /public/brand symlink, grouped by color.
 *
 * Run via `pnpm sync-printful` from repo root. Token loaded from .env.local at
 * runtime via Node's --env-file flag — it never reaches the bundle.
 */

import { writeFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const TOKEN = process.env.PRINTFUL_TOKEN
if (!TOKEN) {
  console.error('Missing PRINTFUL_TOKEN. Add it to .env.local.')
  process.exit(1)
}

const API           = 'https://api.printful.com'
const WEBSITE_ROOT  = resolve('apps/website')
const IMG_DIR       = resolve(WEBSITE_ROOT, 'public/brand/shop/pod')
const IMG_URL_DIR   = '/brand/shop/pod'
const OUTPUT_JSON   = resolve(WEBSITE_ROOT, 'src/data/printful-products.json')

const slugify = (s) =>
  s.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const slugFromProduct = (sp) => {
  const ext = sp.external_id?.trim()
  if (ext && /-/.test(ext)) return ext
  return slugify(sp.name)
}

const extFromUrl = (url) => {
  const m = url.split('?')[0].match(/\.(png|jpe?g|webp|gif)$/i)
  return m ? m[1].toLowerCase().replace('jpeg', 'jpg') : 'png'
}

async function pf(path) {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  })
  const body = await res.text()
  if (!res.ok) throw new Error(`Printful ${path} → ${res.status}: ${body.slice(0, 300)}`)
  return JSON.parse(body).result
}

async function downloadImage(url, dest) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Image ${url} → ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())
  await writeFile(dest, buf)
}

async function main() {
  await mkdir(IMG_DIR, { recursive: true })

  // limit=100: /sync/products defaults to a 20-item page. ponytail: single page
  // covers the catalog; add offset paging if it ever exceeds 100 products.
  const list = await pf('/sync/products?limit=100')
  console.log(`Printful → ${list.length} sync product(s)`)

  const products = []

  for (const summary of list) {
    if (summary.is_ignored) {
      console.log(`  skip ${summary.name} (ignored)`)
      continue
    }

    const detail   = await pf(`/sync/products/${summary.id}`)
    const sp       = detail.sync_product
    const variants = detail.sync_variants.filter((v) => !v.is_ignored)

    if (variants.length === 0) {
      console.warn(`  skip ${sp.name}: no active variants`)
      continue
    }

    const slug      = slugFromProduct(sp)
    const productDir = resolve(IMG_DIR, slug)
    await mkdir(productDir, { recursive: true })

    // Group variants by color (preserve first-seen order).
    const colorOrder = []
    const byColor    = new Map()
    for (const v of variants) {
      const colorName = v.color || 'Default'
      if (!byColor.has(colorName)) {
        colorOrder.push(colorName)
        byColor.set(colorName, [])
      }
      byColor.get(colorName).push(v)
    }

    const colors = []
    for (const colorName of colorOrder) {
      const colorSlug    = slugify(colorName)
      const colorDir     = resolve(productDir, colorSlug)
      const colorUrlBase = `${IMG_URL_DIR}/${slug}/${colorSlug}`
      await mkdir(colorDir, { recursive: true })

      // Collect preview URLs across all variants of this color, dedupe by URL.
      const seen = new Set()
      const previews = []
      for (const v of byColor.get(colorName)) {
        for (const f of v.files || []) {
          if (f.type !== 'preview') continue
          if (!f.preview_url) continue
          if (seen.has(f.preview_url)) continue
          seen.add(f.preview_url)
          previews.push(f.preview_url)
        }
      }

      const images = []
      for (let i = 0; i < previews.length; i++) {
        const url     = previews[i]
        const ext     = extFromUrl(url)
        const fname   = `${i + 1}.${ext}`
        const dest    = resolve(colorDir, fname)
        const relPath = `${colorUrlBase}/${fname}`
        await downloadImage(url, dest)
        images.push(relPath)
      }

      console.log(`  ${slug} / ${colorName} ← ${images.length} image(s)`)

      colors.push({
        name:   colorName,
        slug:   colorSlug,
        images,
      })
    }

    const currencies = new Set(variants.map((v) => v.currency))
    if (currencies.size > 1) console.warn(`  ⚠ ${slug}: variants have different currencies: ${[...currencies].join(', ')}`)

    const sizes = [...new Set(variants.map((v) => v.size).filter(Boolean))]

    const prices    = variants.map((v) => Number(v.retailPrice ?? v.retail_price))
    const minPrice  = Math.min(...prices)
    const maxPrice  = Math.max(...prices)
    const fromPrice = minPrice !== maxPrice ? minPrice : null

    const primaryImage = colors[0]?.images?.[0] ?? null

    products.push({
      source:            'printful',
      printfulProductId: sp.id,
      slug,
      name:              sp.name,
      price:             minPrice,
      priceMax:          maxPrice !== minPrice ? maxPrice : null,
      fromPrice,
      currency:          variants[0].currency,
      image:             primaryImage,
      sizes:             sizes.length > 0 ? sizes : ['One size'],
      colors,
      variants: variants.map((v) => ({
        syncVariantId:    v.id,
        catalogVariantId: v.variant_id,
        size:             v.size || 'One size',
        color:            v.color || null,
        retailPrice:      Number(v.retail_price),
        currency:         v.currency,
        sku:              v.sku,
      })),
    })
  }

  await writeFile(OUTPUT_JSON, JSON.stringify(products, null, 2) + '\n')
  console.log(`✓ Wrote ${products.length} product(s) → ${OUTPUT_JSON.replace(resolve('.'), '.')}`)
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
