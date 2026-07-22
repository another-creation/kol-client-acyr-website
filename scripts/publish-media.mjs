#!/usr/bin/env node
/**
 * Publish product images to the Cloudflare R2 bucket `acyr-store-media`
 * (served at https://cdn.another-creation.xyz) and regenerate the website's
 * product-media manifest.
 *
 * Source of truth: the migration ledger at ~/dev/Media/acyr-store-products/.
 * Per POD product (shop-now/<folder> with a printful_id in INDEX.md), the
 * curated images in _assets/upload/ are web-optimized via the dotfiles tool
 * `img-web-batch.sh` (resize + sRGB JPEG, ~500 KB cap), then uploaded to
 * product/<printful_id>/NN.jpg. Originals in _assets/ are never touched.
 *
 * Output: apps/website/src/data/product-media.json — { printfulId: { slug, images: [url…] } },
 * joined to printful-products.json on printfulProductId.
 *
 * Run: `pnpm publish-media` (loads R2 creds from .env.local). Needs rclone +
 * imagemagick (magick) on PATH.
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, copyFileSync, statSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { resolve, join } from 'node:path'
import { homedir, tmpdir } from 'node:os'

const MEDIA_ROOT   = process.env.ACYR_MEDIA_ROOT || join(homedir(), 'dev/Media/acyr-store-products')
const SHOP         = join(MEDIA_ROOT, 'shop-now')
const IMG_WEB      = join(homedir(), '.dotfiles/bin/img-web-batch.sh')
const OUTPUT_JSON  = resolve('apps/website/src/data/product-media.json')
const STAGE_ROOT   = join(tmpdir(), 'acyr-publish-media')

const { R2_BUCKET, R2_PUBLIC_BASE, R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY } = process.env
for (const [k, v] of Object.entries({ R2_BUCKET, R2_PUBLIC_BASE, R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY })) {
  if (!v) { console.error(`Missing ${k}. Fill it in .env.local.`); process.exit(1) }
}

// rclone talks to R2 over the S3 API via these env vars (no persistent config).
const RCLONE_ENV = {
  ...process.env,
  RCLONE_S3_PROVIDER: 'Cloudflare',
  RCLONE_S3_ACCESS_KEY_ID: R2_ACCESS_KEY_ID,
  RCLONE_S3_SECRET_ACCESS_KEY: R2_SECRET_ACCESS_KEY,
  RCLONE_S3_ENDPOINT: R2_ENDPOINT,
  RCLONE_S3_NO_CHECK_BUCKET: 'true', // bucket-scoped token can't CreateBucket; skip rclone's implicit check
}

// Same slug rule img-web-batch.sh uses to name its web_optimized/ output.
const slug = (name) =>
  name.replace(/\.[^.]*$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')

const IMG_RE = /\.(jpe?g|png|tiff?|heic|webp)$/i
const printfulIdOf = (indexPath) => {
  const m = readFileSync(indexPath, 'utf8').match(/^printful_id:\s*"?([0-9]+)"?/m)
  return m ? m[1] : null
}

function main() {
  const manifest = {}
  let totalImages = 0

  for (const folder of readdirSync(SHOP).sort()) {
    const dir = join(SHOP, folder)
    if (!statSync(dir).isDirectory()) continue

    const indexPath = join(dir, 'INDEX.md')
    let printfulId
    try { printfulId = printfulIdOf(indexPath) } catch { continue }
    if (!printfulId) continue                       // non-POD (no bucket slot)

    const uploadDir = join(dir, '_assets', 'upload')
    let sources
    try {
      sources = readdirSync(uploadDir)
        .filter((f) => IMG_RE.test(f) && !f.startsWith('.'))
        .filter((f) => statSync(join(uploadDir, f)).isFile())
        .sort()
    } catch { sources = [] }
    if (sources.length === 0) { console.log(`  skip ${folder} (upload/ empty)`); continue }

    // A file named with `hero` floats to position 01 → the /shop card + gallery lead.
    const heroes = sources.filter((f) => /hero/i.test(f))
    sources = [...heroes, ...sources.filter((f) => !/hero/i.test(f))]

    // Stage a clean copy so img-web-batch's ./web_optimized/ lands in temp, not the ledger.
    const stage = join(STAGE_ROOT, folder)
    mkdirSync(stage, { recursive: true })
    // img-web-batch handles jpg/jpeg/png/tiff/heic; pre-convert anything else
    // (e.g. webp) to png in staging so its basename still maps to <slug>.jpg.
    for (const f of sources) {
      const src = join(uploadDir, f)
      if (/\.(jpe?g|png|tiff?|heic)$/i.test(f)) copyFileSync(src, join(stage, f))
      else execFileSync('magick', [src, join(stage, f.replace(/\.[^.]*$/, '.png'))], { stdio: 'ignore' })
    }
    execFileSync('bash', [IMG_WEB], { cwd: stage, stdio: 'ignore', env: process.env })

    // Upload web_optimized/<slug>.jpg → product/<id>/NN.jpg, preserving source order.
    const images = []
    sources.forEach((src, i) => {
      const optimized = join(stage, 'web_optimized', `${slug(src)}.jpg`)
      const key = `product/${printfulId}/${String(i + 1).padStart(2, '0')}.jpg`
      execFileSync('rclone', ['copyto', optimized, `:s3:${R2_BUCKET}/${key}`], { env: RCLONE_ENV, stdio: 'ignore' })
      images.push(`${R2_PUBLIC_BASE}/${key}`)
    })

    manifest[printfulId] = { slug: folder, hero: images[0] ?? null, images }
    totalImages += images.length
    console.log(`  ${folder} → ${images.length} image(s)${heroes.length ? ' (hero set)' : ''} @ product/${printfulId}/`)
  }

  writeFileSync(OUTPUT_JSON, JSON.stringify(manifest, null, 2) + '\n')
  console.log(`✓ ${Object.keys(manifest).length} product(s), ${totalImages} image(s) → ${OUTPUT_JSON.replace(resolve('.'), '.')}`)
  console.log(`  Cache note: overwrites serve stale until Cloudflare cache expires — purge cdn.another-creation.xyz if replacing existing images.`)
}

main()
