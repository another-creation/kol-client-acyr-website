import { useEffect, useMemo, useState } from 'react'
import CmdKSearch from './CmdKSearch'
import { PRODUCTS } from '../../data/shop-data'
import { sortedArticles, sortedCollections } from '../../lib/queries'

const STATIC_ROUTES = [
  { to: '/shop',             label: 'Shop',               section: 'Pages' },
  { to: '/handmade',         label: 'Handmade',           section: 'Pages' },
  { to: '/collections',      label: 'Collections',        section: 'Pages' },
  { to: '/journal',          label: 'Journal',            section: 'Pages' },
  { to: '/about',            label: 'About',              section: 'Pages' },
  { to: '/contact',          label: 'Contact',            section: 'Pages' },
  { to: '/brand',            label: 'Brand',              section: 'Pages' },
  { to: '/press',            label: 'Press',              section: 'Pages' },
  { to: '/shipping-returns', label: 'Shipping & Returns', section: 'Pages' },
  { to: '/terms',            label: 'Terms',              section: 'Pages' },
  { to: '/privacy',          label: 'Privacy',            section: 'Pages' },
]

const PRODUCT_ENTRIES = PRODUCTS.map((p) => ({
  to:       p.kind === 'pod' ? `/shop/${p.slug}` : `/handmade/${p.slug}`,
  label:    p.name,
  section:  p.kind === 'pod' ? 'Shop' : 'Handmade',
  haystack: [p.name, p.excerpt, p.print, p.type].filter(Boolean).join(' ').toLowerCase(),
}))

export default function WebsiteSearch({ open, setOpen }) {
  const [cms, setCms] = useState(null)

  useEffect(() => {
    if (!open || cms !== null) return
    Promise.all([sortedArticles(), sortedCollections()])
      .then(([articles, collections]) => {
        setCms([
          ...articles.map((a) => ({
            to:       `/journal/${a.slug}`,
            label:    a.title,
            section:  'Journal',
            haystack: [a.title, a.excerpt, a.tag, a.author?.name].filter(Boolean).join(' ').toLowerCase(),
          })),
          ...collections.map((c) => ({
            to:       `/collections/${c.slug}`,
            label:    c.title,
            section:  'Collection',
            haystack: [c.title, c.subtitle, c.excerpt, c.year, c.number].filter(Boolean).join(' ').toLowerCase(),
          })),
        ])
      })
      .catch(() => setCms([]))
  }, [open, cms])

  const entries = useMemo(
    () => [...STATIC_ROUTES, ...PRODUCT_ENTRIES, ...(cms ?? [])],
    [cms],
  )

  return (
    <CmdKSearch
      open={open}
      setOpen={setOpen}
      entries={entries}
      placeholder="Search products, journal, collections…"
    />
  )
}
