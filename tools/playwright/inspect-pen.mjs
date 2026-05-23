import { chromium } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'

const URL = 'https://codepen.io/GreenSock/debug/vYMzKZx'
const OUT = 'pen'

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
  })

  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(2500)
  console.log('FINAL URL:', page.url())
  console.log('TITLE:', await page.title())

  const info = await page.evaluate(() => {
    const inline = [...document.querySelectorAll('script:not([src])')].map((s) => s.textContent).filter((t) => t && t.length > 40)
    const styles = [...document.querySelectorAll('style')].map((s) => s.textContent).filter(Boolean)
    return {
      inline,
      styles,
      bodyHTML: document.body.innerHTML.slice(0, 6000),
      scrollHeight: document.documentElement.scrollHeight,
      title: document.title,
    }
  })
  await writeFile(`${OUT}/pen-scripts.js`, info.inline.join('\n\n/* ---- next script ---- */\n\n'))
  await writeFile(`${OUT}/pen-styles.css`, info.styles.join('\n\n/* ---- next style ---- */\n\n'))
  await writeFile(`${OUT}/pen-body.html`, info.bodyHTML)
  console.log('scripts:', info.inline.length, 'styles:', info.styles.length, 'scrollHeight:', info.scrollHeight)

  const h = info.scrollHeight
  const vh = 900
  const steps = 12
  for (let i = 0; i <= steps; i++) {
    const y = Math.round((i / steps) * Math.max(0, h - vh))
    await page.evaluate((yy) => window.scrollTo(0, yy), y)
    await page.waitForTimeout(350)
    await page.screenshot({ path: `${OUT}/pen-${String(i).padStart(2, '0')}-${y}px.png` })
  }
  console.log('shots done')
  await browser.close()
  console.log('DONE')
}

main().catch((e) => { console.error('ERR', e.message); process.exit(1) })
