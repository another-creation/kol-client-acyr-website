/**
 * Extract iframe sources from demos.gsap.com demo wrappers so we can capture
 * the actual demo animation, not the GSAP+ wrapper UI.
 */

import { chromium } from 'playwright'

const URLS = [
  'https://demos.gsap.com/demo/directional-marquee/',
  'https://demos.gsap.com/demo/horizontal-scrolling-gallery/',
  'https://demos.gsap.com/demo/scrubbed-bento-gallery/',
  'https://demos.gsap.com/demo/infinite-looped-panels/',
]

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext()
const page = await context.newPage()

for (const url of URLS) {
  await page.goto(url, { waitUntil: 'networkidle' })
  const iframes = await page.evaluate(() =>
    Array.from(document.querySelectorAll('iframe')).map((f) => f.src)
  )
  console.log(`\n${url}`)
  for (const src of iframes) console.log('  →', src)
}

await context.close()
await browser.close()
