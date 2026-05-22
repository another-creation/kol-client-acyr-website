import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '@ac/brand-data/config'
import Divider from '../../components/atoms/Divider'
import PageHero from '../../components/site/PageHero'
import SiteSection from '../../components/site/SiteSection'
import { sortedCollections } from '../../lib/queries'
import { urlFor } from '../../lib/sanity'

export default function Collections() {
  usePageTitle(`${BRAND.name} — Collections`)
  const [collections, setCollections] = useState(null)

  useEffect(() => {
    sortedCollections().then(setCollections)
  }, [])

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
          style={{ background: 'linear-gradient(to bottom, color-mix(in srgb, var(--ac-surface-primary) 60%, transparent), color-mix(in srgb, var(--ac-surface-primary) 30%, transparent), var(--ac-surface-primary))' }}
        />
        <SiteSection as="div" className="relative px-5 py-24 text-center">
          <PageHero
            variant="marketing"
            eyebrow="Collections"
            title="Seasons."
            subline="One collection a year, occasionally two. Materials come first; shapes follow. Each season is built from a small set of cloths and shown once at home in Reykjavík before it goes anywhere else."
            className="items-center"
          />
        </SiteSection>
      </section>

      <SiteSection width="full" className="px-8 pb-24">
        {collections && (
          <ul className="grid gap-12 md:grid-cols-2 xl:grid-cols-3">
            {collections.map((collection) => (
              <li key={collection.slug}>
                <Link
                  to={`/collections/${collection.slug}`}
                  className="block no-underline group"
                >
                  <div className="aspect-[3/4] rounded overflow-hidden bg-surface-secondary mb-6">
                    {collection.cover && (
                      <img
                        src={urlFor(collection.cover).width(900).height(1200).url()}
                        alt=""
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <p className="site-meta-editorial" style={{ marginBottom: '12px' }}>
                    {collection.title} · {collection.year}
                  </p>
                  <div className="ac-prose">
                    <h3 style={{ margin: '0 0 12px' }}>{collection.subtitle ?? collection.title}</h3>
                    <p style={{ margin: 0 }}>{collection.excerpt}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </SiteSection>

      <SiteSection className="px-8 pb-24">
        <Divider />
        <div className="ac-prose pt-12 text-center">
          <p>
            Older collections live in the archive at the studio. For private viewings or made-to-order revivals of any past piece, write to{' '}
            <a href="mailto:yr@another-creation.com">yr@another-creation.com</a>.
          </p>
        </div>
      </SiteSection>
    </main>
  )
}
