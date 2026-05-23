import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const URL = 'https://375.studio/'
const OUT = '375'

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
  })

  // Capture the loader phase: screenshot rapidly right from navigation start.
  await page.goto(URL, { waitUntil: 'commit', timeout: 60000 })
  const interval = 120
  const frames = 40
  for (let i = 0; i < frames; i++) {
    try {
      await page.screenshot({ path: `${OUT}/${String(i).padStart(2, '0')}.png` })
    } catch { /* page may be navigating */ }
    await page.waitForTimeout(interval)
  }
  console.log('captured', frames, 'frames at', interval, 'ms')
  await browser.close()
  console.log('DONE')
}
main().catch((e) => { console.error('ERR', e.message); process.exit(1) })
