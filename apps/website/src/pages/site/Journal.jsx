import { Fragment, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '@ac/brand-data/config'
import Badge from '../../components/molecules/Badge'
import Divider from '../../components/atoms/Divider'
import PageHero from '../../components/site/PageHero'
import SiteSection from '../../components/site/SiteSection'
import { sortedArticles, formatDate } from '../../lib/queries'
import { urlFor } from '../../lib/sanity'

export default function Journal() {
  usePageTitle(`${BRAND.name} — Journal`)
  const [articles, setArticles] = useState(null)

  useEffect(() => {
    sortedArticles().then(setArticles)
  }, [])

  return (
    <main className="bg-surface-primary">
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <img
          src="/brand/photoshoot/33a4845.jpg"
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
            eyebrow="Journal"
            title="Notes from the atelier."
            subline="Collection updates, runway notes, pop-up dates, and how a small Reykjavík atelier actually runs day to day."
            className="items-center"
          />
        </SiteSection>
      </section>

      <SiteSection width="reading" className="px-8 pb-24">
        {articles && (
          <ul className="flex flex-col">
            {articles.map((article, i) => (
              <Fragment key={article.slug}>
                {i > 0 && <Divider />}
                <li>
                  <Link
                    to={`/journal/${article.slug}`}
                    className="grid gap-8 py-12 sm:grid-cols-[280px_1fr] no-underline hover:opacity-80 transition-opacity"
                  >
                    {article.cover && (
                      <div className="aspect-[4/3] rounded overflow-hidden bg-surface-secondary">
                        <img
                          src={urlFor(article.cover).width(560).height(420).url()}
                          alt=""
                          className="w-full h-full object-cover"
                          aria-hidden="true"
                        />
                      </div>
                    )}
                    <div className="flex flex-col justify-center">
                      <div className="site-meta-editorial flex items-center gap-3" style={{ marginBottom: '12px' }}>
                        {article.tag && <Badge variant="outline" size="sm">{article.tag}</Badge>}
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                      <div className="ac-prose">
                        <h3>{article.title}</h3>
                        <p>{article.excerpt}</p>
                      </div>
                      <div className="site-meta-editorial flex gap-3" style={{ marginTop: '4px' }}>
                        {article.author && <span>{article.author.name}</span>}
                        <span aria-hidden="true">·</span>
                        <span>{article.readingMinutes} min read</span>
                      </div>
                    </div>
                  </Link>
                </li>
              </Fragment>
            ))}
          </ul>
        )}
      </SiteSection>
    </main>
  )
}
