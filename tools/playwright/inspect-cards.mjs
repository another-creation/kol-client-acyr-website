/**
 * Card animation recon — wait past the loader, then scroll through the page in
 * steps to trigger scroll-driven animations, hover over likely interactive
 * elements, capture frames + trace at every stage.
 *
 * Usage: node inspect-cards.mjs [url ...]
 */

import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = __dirname

const SITES = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['https://375.studio/', 'https://good-fella.com/']

const slugify = (url) =>
  url.replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/-+$/g, '')

async function inspect(url) {
  const slug = slugify(url)
  console.log(`\n→ ${url}`)

  const tracesDir = join(ROOT, 'traces-cards', slug)
  const framesDir = join(ROOT, 'frames-cards', slug)
  await mkdir(tracesDir, { recursive: true })
  await mkdir(framesDir, { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: tracesDir, size: { width: 1440, height: 900 } },
  })
  await context.tracing.start({ screenshots: true, snapshots: true, sources: true })
  const page = await context.newPage()

  let frameIdx = 0
  const snap = async (label) => {
    const name = String(frameIdx).padStart(3, '0') + (label ? `-${label}` : '') + '.png'
    try {
      const buf = await page.screenshot({ fullPage: false, animations: 'allow' })
      await writeFile(join(framesDir, name), buf)
    } catch {}
    frameIdx++
  }

  await page.goto(url, { waitUntil: 'domcontentloaded' })

  // Wait past loader.
  await page.waitForTimeout(4500)
  await snap('post-loader')

  // Get scroll height.
  const scrollH = await page.evaluate(() => document.documentElement.scrollHeight)
  const vh = 900
  const steps = Math.min(12, Math.max(4, Math.ceil(scrollH / (vh * 0.6))))
  console.log(`  scrollHeight=${scrollH}, vh=${vh}, steps=${steps}`)

  for (let i = 1; i <= steps; i++) {
    const y = Math.round((scrollH - vh) * (i / steps))
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'smooth' }), y)
    await page.waitForTimeout(700)
    await snap(`scroll-${String(i).padStart(2, '0')}`)
    // Mid-step capture too — catches motion in-progress
    await page.waitForTimeout(250)
    await snap(`scroll-${String(i).padStart(2, '0')}-mid`)
  }

  // Back to top + hover on likely card targets.
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.waitForTimeout(800)
  await snap('back-to-top')

  // Hover over the first few "cards" — generic selectors.
  const cardSelectors = ['article', '[class*="card" i]', '[class*="project" i]', '[class*="item" i]', 'a[href]']
  for (const sel of cardSelectors) {
    const handles = await page.locator(sel).all().catch(() => [])
    for (let i = 0; i < Math.min(3, handles.length); i++) {
      try {
        await handles[i].scrollIntoViewIfNeeded({ timeout: 1500 })
        await snap(`pre-hover-${sel.replace(/[^a-z]/gi, '')}-${i}`)
        await handles[i].hover({ timeout: 1500 })
        await page.waitForTimeout(450)
        await snap(`hover-${sel.replace(/[^a-z]/gi, '')}-${i}`)
        await page.mouse.move(10, 10)
        await page.waitForTimeout(300)
      } catch {}
    }
  }

  await context.tracing.stop({ path: join(tracesDir, 'trace.zip') })
  await context.close()
  await browser.close()

  console.log(`  trace:  traces-cards/${slug}/trace.zip`)
  console.log(`  frames: frames-cards/${slug}/ (${frameIdx} shots)`)
}

for (const url of SITES) {
  try {
    await inspect(url)
  } catch (e) {
    console.error(`× ${url} — ${e.message}`)
  }
}
