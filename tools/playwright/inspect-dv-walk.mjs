import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'

const URL = 'http://localhost:5173/'
const OUT = 'dv-walk'

const findRects = () => {
  const byH2 = (txt) => {
    const h = [...document.querySelectorAll('h2')].find((e) => e.textContent.includes(txt))
    return h ? h.closest('section') : null
  }
  const rect = (el) => {
    if (!el) return null
    const r = el.getBoundingClientRect()
    return { top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height) }
  }
  return {
    dv: rect(byH2('Designer')),
    cta: rect(byH2('Support my Journey')),
    handmade: rect(byH2('Handmade')),
    scrollY: Math.round(window.scrollY),
    docH: Math.round(document.documentElement.scrollHeight),
  }
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(1200) // fonts-ready reveal + ScrollTrigger.refresh

  // Find where DesignerVision starts in document coords.
  const start = await page.evaluate(() => {
    const h = [...document.querySelectorAll('h2')].find((e) => e.textContent.includes('Designer'))
    const sec = h ? h.closest('section') : null
    if (!sec) return null
    const r = sec.getBoundingClientRect()
    return Math.round(r.top + window.scrollY)
  })
  console.log('DesignerVision doc-top:', start)
  if (start == null) { console.log('DV not found'); await browser.close(); return }

  const log = []
  const begin = Math.max(0, start - 600)
  const step = 120
  const frames = 34
  for (let i = 0; i < frames; i++) {
    const y = begin + i * step
    await page.evaluate((yy) => window.scrollTo(0, yy), y)
    await page.waitForTimeout(180)
    const r = await page.evaluate(findRects)
    log.push({ i, target: y, ...r })
    await page.screenshot({ path: `${OUT}/${String(i).padStart(2, '0')}-y${y}.png` })
  }
  await writeFile(`${OUT}/positions.json`, JSON.stringify(log, null, 2))
  // Print a compact table for quick scan.
  console.log('frame  scrollY   DV.top  CTA.top  HM.top')
  for (const e of log) {
    const f = (v) => (v == null ? '   -' : String(v.top).padStart(6))
    console.log(
      String(e.i).padStart(4),
      String(e.scrollY).padStart(8),
      f(e.dv), f(e.cta), f(e.handmade),
    )
  }
  await browser.close()
  console.log('DONE')
}
main().catch((e) => { console.error('ERR', e.message); process.exit(1) })
