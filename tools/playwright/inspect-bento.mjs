import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'

const URL = 'https://demos.gsap.com/demo/scrubbed-bento-gallery/'
const OUT = 'bento'

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

  const responses = []
  page.on('response', (r) => {
    const u = r.url()
    if (/\.(js|mjs)(\?|$)/.test(u)) responses.push(u)
  })

  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 })
  console.log('FINAL URL:', page.url())
  console.log('TITLE:', await page.title())

  // Inline scripts + iframe srcs
  const info = await page.evaluate(() => {
    const inline = [...document.querySelectorAll('script:not([src])')].map((s) => s.textContent)
    const srcs = [...document.querySelectorAll('script[src]')].map((s) => s.src)
    const iframes = [...document.querySelectorAll('iframe')].map((f) => f.src)
    const bodyHTML = document.body.innerHTML.slice(0, 4000)
    return { inline, srcs, iframes, bodyHTML, scrollHeight: document.documentElement.scrollHeight }
  })
  await writeFile(`${OUT}/inline-scripts.js`, info.inline.join('\n\n/* ---- next inline script ---- */\n\n'))
  await writeFile(`${OUT}/meta.json`, JSON.stringify({ srcs: info.srcs, iframes: info.iframes, jsResponses: [...new Set(responses)], scrollHeight: info.scrollHeight }, null, 2))
  await writeFile(`${OUT}/body-head.html`, info.bodyHTML)

  // Fetch the page's own JS files (same-origin app code, not the gsap lib CDN)
  for (const src of info.srcs) {
    try {
      if (/cdn|jsdelivr|unpkg|gstatic|googletagmanager/.test(src)) continue
      const txt = await (await page.request.get(src)).text()
      const name = src.split('/').pop().split('?')[0] || 'script.js'
      await writeFile(`${OUT}/src-${name}`, txt)
      console.log('saved src:', src)
    } catch (e) { console.log('skip', src, e.message) }
  }

  // Screenshot the scroll sequence
  const h = info.scrollHeight
  const vh = 900
  const steps = 9
  for (let i = 0; i <= steps; i++) {
    const y = Math.round((i / steps) * (h - vh))
    await page.evaluate((yy) => window.scrollTo(0, yy), y)
    await page.waitForTimeout(400)
    await page.screenshot({ path: `${OUT}/scroll-${String(i).padStart(2, '0')}-${y}px.png` })
    console.log('shot at', y)
  }

  await browser.close()
  console.log('DONE')
}

main().catch((e) => { console.error(e); process.exit(1) })
