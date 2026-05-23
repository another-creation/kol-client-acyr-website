import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const URL = 'https://375.studio/'
const OUT = '375b'

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
  })
  const page = await ctx.newPage()

  // First visit: dismiss the cookie banner so it won't cover the loader.
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 60000 })
  await page.waitForTimeout(2500)
  try {
    await page.getByText('Accetta', { exact: true }).click({ timeout: 4000 })
    console.log('accepted cookies')
  } catch { console.log('no cookie button found') }
  await page.waitForTimeout(1500)

  // Reload to replay the loader cleanly, capturing fine-grained frames.
  await page.goto(URL, { waitUntil: 'commit', timeout: 60000 })
  const interval = 100
  const frames = 45
  for (let i = 0; i < frames; i++) {
    try { await page.screenshot({ path: `${OUT}/${String(i).padStart(2, '0')}.png` }) } catch {}
    await page.waitForTimeout(interval)
  }
  console.log('captured', frames, 'frames at', interval, 'ms (≈', (frames * interval) / 1000, 's)')
  await browser.close()
  console.log('DONE')
}
main().catch((e) => { console.error('ERR', e.message); process.exit(1) })
