#!/usr/bin/env node
/**
 * Publish product images to the Cloudflare R2 bucket `acyr-store-media`
 * (served at https://cdn.another-creation.xyz) and regenerate the website's
 * media manifests.
 *
 * Source of truth: the migration ledger at ~/dev/Media/acyr-store-products/.
 * Two trees are published:
 *   - shop-now/<folder>  (POD)      → key = INDEX.md printful_id  → product/<id>/NN.jpg
 *   - handmade/<folder>  (bespoke)  → key = folder name           → handmade/<slug>/NN.jpg
 * Per product, the curated images in _assets/upload/ are web-optimized via the
 * dotfiles tool `img-web-batch.sh` (resize + sRGB JPEG, ~500 KB cap), then
 * uploaded in sorted order. A file with `hero` in its name floats to NN=01.
 * Originals in _assets/ are never touched.
 *
 * URLs carry a ?v=<content-hash> cache-buster so re-curated images bust the
 * Cloudflare/browser cache (the R2 path is reused on overwrite).
 *
 * Output:
 *   apps/website/src/data/product-media.json  — { printfulId: { slug, hero, images[] } }
 *   apps/website/src/data/handmade-media.json — { slug: { hero, images[] } }
 *
 * Run: `pnpm publish-media` (loads R2 creds from .env.local). Needs rclone +
 * imagemagick (magick) on PATH.
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, copyFileSync, statSync, rmSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { resolve, join } from 'node:path'
import { homedir, tmpdir } from 'node:os'

const MEDIA_ROOT   = process.env.ACYR_MEDIA_ROOT || join(homedir(), 'dev/Media/acyr-store-products')
const SHOP         = join(MEDIA_ROOT, 'shop-now')
const HANDMADE     = join(MEDIA_ROOT, 'handmade')
const IMG_WEB      = join(homedir(), '.dotfiles/bin/img-web-batch.sh')
const POD_JSON     = resolve('apps/website/src/data/product-media.json')
const HM_JSON      = resolve('apps/website/src/data/handmade-media.json')
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

/**
 * Web-optimize a folder's _assets/upload/ set and upload it to
 * <bucketPrefix>/NN.jpg (1-based, sorted, hero first). Returns the public URLs
 * in order, or null if the folder has no curated images.
 */
function publishFolder(dir, bucketPrefix) {
  const uploadDir = join(dir, '_assets', 'upload')
  let sources
  try {
    sources = readdirSync(uploadDir)
      .filter((f) => IMG_RE.test(f) && !f.startsWith('.'))
      .filter((f) => statSync(join(uploadDir, f)).isFile())
      .sort()
  } catch { sources = [] }
  if (sources.length === 0) return null

  // A file named with `hero` floats to position 01 → the card + gallery lead.
  const heroes = sources.filter((f) => /hero/i.test(f))
  sources = [...heroes, ...sources.filter((f) => !/hero/i.test(f))]

  // Stage a clean copy so img-web-batch's ./web_optimized/ lands in temp, not
  // the ledger. Stage dir is unique per bucketPrefix (POD ids vs handmade slugs).
  // Wipe it first so a re-curated image can never reuse a prior run's optimized
  // output (which would upload a stale image under the same key).
  const stage = join(STAGE_ROOT, bucketPrefix.replace(/\//g, '__'))
  rmSync(stage, { recursive: true, force: true })
  mkdirSync(stage, { recursive: true })
  // img-web-batch handles jpg/jpeg/png/tiff/heic; pre-convert anything else
  // (e.g. webp) to png in staging so its basename still maps to <slug>.jpg.
  for (const f of sources) {
    const src = join(uploadDir, f)
    if (/\.(jpe?g|png|tiff?|heic)$/i.test(f)) copyFileSync(src, join(stage, f))
    else execFileSync('magick', [src, join(stage, f.replace(/\.[^.]*$/, '.png'))], { stdio: 'ignore' })
  }
  execFileSync('bash', [IMG_WEB], { cwd: stage, stdio: 'ignore', env: process.env })

  const images = []
  sources.forEach((src, i) => {
    const optimized = join(stage, 'web_optimized', `${slug(src)}.jpg`)
    const key = `${bucketPrefix}/${String(i + 1).padStart(2, '0')}.jpg`
    execFileSync('rclone', ['copyto', optimized, `:s3:${R2_BUCKET}/${key}`], { env: RCLONE_ENV, stdio: 'ignore' })
    // Content-hash cache-buster: overwrites reuse the same R2 path, so without a
    // changing query string browsers/CDN serve the stale copy. Unchanged images
    // keep their ?v (stay cached); re-curated ones get a fresh one automatically.
    const v = createHash('sha1').update(readFileSync(optimized)).digest('hex').slice(0, 10)
    images.push(`${R2_PUBLIC_BASE}/${key}?v=${v}`)
  })
  return { images, heroSet: heroes.length > 0 }
}

const isDir = (p) => { try { return statSync(p).isDirectory() } catch { return false } }

function main() {
  let totalImages = 0

  // ── POD (shop-now) → product-media.json, keyed by printful_id ──
  const podManifest = {}
  for (const folder of readdirSync(SHOP).sort()) {
    const dir = join(SHOP, folder)
    if (!isDir(dir)) continue
    let printfulId
    try { printfulId = printfulIdOf(join(dir, 'INDEX.md')) } catch { continue }
    if (!printfulId) continue                       // non-POD (no bucket slot)

    const r = publishFolder(dir, `product/${printfulId}`)
    if (!r) { console.log(`  skip ${folder} (upload/ empty)`); continue }
    podManifest[printfulId] = { slug: folder, hero: r.images[0] ?? null, images: r.images }
    totalImages += r.images.length
    console.log(`  [pod] ${folder} → ${r.images.length} image(s)${r.heroSet ? ' (hero set)' : ''} @ product/${printfulId}/`)
  }
  writeFileSync(POD_JSON, JSON.stringify(podManifest, null, 2) + '\n')

  // ── Handmade → handmade-media.json, keyed by folder name ──
  const hmManifest = {}
  for (const folder of readdirSync(HANDMADE).sort()) {
    const dir = join(HANDMADE, folder)
    if (!isDir(dir)) continue

    const r = publishFolder(dir, `handmade/${folder}`)
    if (!r) { console.log(`  skip ${folder} (upload/ empty)`); continue }
    hmManifest[folder] = { hero: r.images[0] ?? null, images: r.images }
    totalImages += r.images.length
    console.log(`  [handmade] ${folder} → ${r.images.length} image(s)${r.heroSet ? ' (hero set)' : ''} @ handmade/${folder}/`)
  }
  writeFileSync(HM_JSON, JSON.stringify(hmManifest, null, 2) + '\n')

  console.log(`✓ ${Object.keys(podManifest).length} pod + ${Object.keys(hmManifest).length} handmade product(s), ${totalImages} image(s)`)
  console.log(`  → ${POD_JSON.replace(resolve('.'), '.')}`)
  console.log(`  → ${HM_JSON.replace(resolve('.'), '.')}`)
  console.log(`  Cache note: overwrites serve stale until Cloudflare cache expires — purge cdn.another-creation.xyz if replacing existing images.`)
}

main()
