/**
 * Animation recon — load target sites, capture trace + video + frame strips,
 * dump computed transforms over time on hero candidates.
 *
 * Usage: node inspect-animations.mjs [url ...]
 *   default sites: 375.studio, good-fella.com
 *
 * Outputs:
 *   traces/<slug>/trace.zip         → open with `pnpm view`
 *   frames/<slug>/000.png … N.png   → numbered frame strip
 *   logs/<slug>.json                → computed-style samples
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

const FRAME_INTERVAL_MS = 100  // 10 fps frame strip
const CAPTURE_DURATION_MS = 5000

const slugify = (url) =>
  url.replace(/^https?:\/\//, '').replace(/[^a-z0-9]+/gi, '-').replace(/-+$/g, '')

async function inspect(url) {
  const slug = slugify(url)
  console.log(`\n→ ${url} (slug: ${slug})`)

  const tracesDir = join(ROOT, 'traces', slug)
  const framesDir = join(ROOT, 'frames', slug)
  const logsDir = join(ROOT, 'logs')
  await mkdir(tracesDir, { recursive: true })
  await mkdir(framesDir, { recursive: true })
  await mkdir(logsDir, { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: tracesDir, size: { width: 1440, height: 900 } },
  })

  await context.tracing.start({ screenshots: true, snapshots: true, sources: true })

  const page = await context.newPage()

  // Sample computed transforms / opacity on candidate elements at frame interval.
  const samples = []
  let sampling = true

  const samplePromise = (async () => {
    const start = Date.now()
    while (sampling && Date.now() - start < CAPTURE_DURATION_MS) {
      try {
        const snap = await page.evaluate(() => {
          const out = { ts: performance.now(), elements: [] }
          // Candidate selectors covering common loader/hero patterns.
          const sels = [
            'body', 'main', '[class*="loader" i]', '[class*="loading" i]',
            '[class*="intro" i]', '[class*="overlay" i]', '[class*="preloader" i]',
            'svg', 'canvas', 'h1', 'h2',
          ]
          for (const sel of sels) {
            const nodes = document.querySelectorAll(sel)
            nodes.forEach((node, i) => {
              if (i > 2) return
              const cs = getComputedStyle(node)
              if (cs.display === 'none') return
              out.elements.push({
                sel,
                idx: i,
                transform: cs.transform,
                opacity: cs.opacity,
                clipPath: cs.clipPath,
                visibility: cs.visibility,
                bg: cs.backgroundColor,
                text: (node.textContent || '').slice(0, 40),
              })
            })
          }
          return out
        })
        samples.push(snap)
      } catch (e) {
        // Page may be navigating; ignore.
      }
      await new Promise((r) => setTimeout(r, FRAME_INTERVAL_MS))
    }
  })()

  // Frame strip: screenshot at FRAME_INTERVAL_MS during load.
  const framePromise = (async () => {
    let i = 0
    const start = Date.now()
    while (Date.now() - start < CAPTURE_DURATION_MS) {
      try {
        const buf = await page.screenshot({ fullPage: false, animations: 'allow' })
        await writeFile(join(framesDir, String(i).padStart(3, '0') + '.png'), buf)
        i++
      } catch (e) {
        // Page may not be ready yet.
      }
      await new Promise((r) => setTimeout(r, FRAME_INTERVAL_MS))
    }
  })()

  // Navigate; both background loops run during/after.
  await page.goto(url, { waitUntil: 'domcontentloaded' })

  await Promise.all([samplePromise, framePromise])
  sampling = false

  await context.tracing.stop({ path: join(tracesDir, 'trace.zip') })
  await writeFile(join(logsDir, `${slug}.json`), JSON.stringify(samples, null, 2))

  await context.close()
  await browser.close()

  console.log(`  trace:  ${join('traces', slug, 'trace.zip')}`)
  console.log(`  frames: ${join('frames', slug)}/ (${samples.length}+ shots)`)
  console.log(`  log:    ${join('logs', slug + '.json')}`)
}

for (const url of SITES) {
  try {
    await inspect(url)
  } catch (e) {
    console.error(`× ${url} — ${e.message}`)
  }
}

console.log('\nDone. View traces: `pnpm view` (opens Playwright trace viewer).')
