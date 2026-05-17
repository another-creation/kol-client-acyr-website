import { readFile } from 'node:fs/promises'
import path from 'node:path'
import {
  DEFAULT_META,
  lookupMeta,
  escapeHtml,
  SITE_URL,
} from '../src/data/seo-metadata.js'

let cachedTemplate = null

async function getTemplate() {
  if (cachedTemplate) return cachedTemplate
  // Reads dist/app.html (renamed from index.html post-build so Vercel's
  // filesystem routing can't shortcut bare `/` past our rewrite).
  const filePath = path.join(process.cwd(), 'dist', 'app.html')
  cachedTemplate = await readFile(filePath, 'utf8')
  return cachedTemplate
}

export default async function handler(req, res) {
  let pathname = '/'
  try {
    pathname = new URL(req.url, SITE_URL).pathname
  } catch {
    /* fall through with default */
  }

  const resolved = lookupMeta(pathname)
  const meta = resolved ?? DEFAULT_META
  const status = resolved ? 200 : 404
  const fullUrl = SITE_URL + pathname

  let template
  try {
    template = await getTemplate()
  } catch {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8')
    res.status(500).send('Metadata proxy: dist/app.html not built. Run `pnpm build` first.')
    return
  }

  const html = template
    .replace(/__TITLE__/g, escapeHtml(meta.title))
    .replace(/__DESCRIPTION__/g, escapeHtml(meta.description))
    .replace(/__IMAGE__/g, escapeHtml(meta.image))
    .replace(/__URL__/g, escapeHtml(fullUrl))
    .replace(/__ROBOTS__/g, escapeHtml(meta.robots ?? 'index, follow'))

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate')
  res.status(status).send(html)
}
