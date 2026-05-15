import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '../../brand/config'
import Divider from '../../components/atoms/Divider'
import { sortedCollections } from '../../brand/data/collections-data'

export default function Collections() {
  usePageTitle(`${BRAND.name} — Collections`)
  const collections = sortedCollections()

  return (
    <main className="bg-surface-primary">
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <img
          src="/brand/photoshoot/33a4402.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, color-mix(in srgb, var(--kol-surface-primary) 60%, transparent), color-mix(in srgb, var(--kol-surface-primary) 30%, transparent), var(--kol-surface-primary))' }}
        />
        <div className="relative max-w-3xl mx-auto px-5 py-24 text-center flex flex-col items-center">
          <p className="kol-prose-label">Collections</p>
          <h1 className="kol-prose-display">Seasons.</h1>
          <p className="kol-prose-lede max-w-xl">
            One collection a year, occasionally two. Materials come first; shapes follow. Each season is built from a small set of cloths and shown once at home in Reykjavík before it goes anywhere else.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-8 pb-24">
        <ul className="grid gap-12 md:grid-cols-2">
          {collections.map((collection) => (
            <li key={collection.slug}>
              <Link
                to={`/collections/${collection.slug}`}
                className="block no-underline group"
              >
                <div className="aspect-[3/4] rounded overflow-hidden bg-surface-secondary mb-6">
                  <img
                    src={collection.cover}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                    aria-hidden="true"
                  />
                </div>
                <p className="kol-prose-label" style={{ marginBottom: '12px' }}>
                  {collection.title} · {collection.year}
                </p>
                <div className="kol-prose">
                  <h3 style={{ margin: '0 0 12px' }}>{collection.subtitle ?? collection.title}</h3>
                  <p style={{ margin: 0 }}>{collection.excerpt}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="max-w-3xl mx-auto px-8 pb-24">
        <Divider />
        <div className="kol-prose pt-12 text-center">
          <p>
            Older collections live in the archive at the studio. For private viewings or made-to-order revivals of any past piece, write to{' '}
            <a href="mailto:yr@another-creation.com">yr@another-creation.com</a>.
          </p>
        </div>
      </section>
    </main>
  )
}
