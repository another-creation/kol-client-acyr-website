import { chromium } from 'playwright'

const URL = 'https://demos.gsap.com/demo/horizontal-text/'

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(1500)
  const iframes = await page.evaluate(() => [...document.querySelectorAll('iframe')].map((f) => f.src))
  console.log('TITLE:', await page.title())
  console.log('IFRAMES:', JSON.stringify(iframes, null, 2))
  await browser.close()
}
main().catch((e) => { console.error('ERR', e.message); process.exit(1) })
