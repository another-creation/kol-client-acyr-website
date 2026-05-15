import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '../../brand/config'
import Badge from '../../components/molecules/Badge'
import Divider from '../../components/atoms/Divider'
import { sortedArticles, findAuthor, formatDate } from '../../brand/data/blog-data'

export default function Blog() {
  usePageTitle(`${BRAND.name} — Journal`)
  const articles = sortedArticles()

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
          style={{ background: 'linear-gradient(to bottom, color-mix(in srgb, var(--kol-surface-primary) 60%, transparent), color-mix(in srgb, var(--kol-surface-primary) 30%, transparent), var(--kol-surface-primary))' }}
        />
        <div className="relative max-w-3xl mx-auto px-5 py-24 text-center flex flex-col items-center">
          <p className="kol-prose-label">Journal</p>
          <h1 className="kol-prose-display">Notes from the atelier.</h1>
          <p className="kol-prose-lede max-w-xl">
            Collection updates, runway notes, pop-up dates, and how a small Reykjavík atelier
            actually runs day to day.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-8 pb-24">
        <ul className="flex flex-col">
          {articles.map((article, i) => {
            const author = findAuthor(article.authorSlug)
            return (
              <Fragment key={article.slug}>
                {i > 0 && <Divider />}
                <li>
                  <Link
                    to={`/blog/${article.slug}`}
                    className="grid gap-8 py-12 sm:grid-cols-[280px_1fr] no-underline hover:opacity-80 transition-opacity"
                  >
                    {article.cover && (
                      <div className="aspect-[4/3] rounded overflow-hidden bg-surface-secondary">
                        <img src={article.cover} alt="" className="w-full h-full object-cover" aria-hidden="true" />
                      </div>
                    )}
                    <div className="flex flex-col justify-center">
                      <div className="kol-prose-label flex items-center gap-3" style={{ marginBottom: '12px' }}>
                        {article.tag && <Badge variant="outline" size="sm">{article.tag}</Badge>}
                        <span>{formatDate(article.publishedAt)}</span>
                      </div>
                      <div className="kol-prose">
                        <h3>{article.title}</h3>
                        <p>{article.excerpt}</p>
                      </div>
                      <div className="kol-prose-label flex gap-3" style={{ marginBottom: 0, marginTop: '4px' }}>
                        {author && <span>{author.name}</span>}
                        <span aria-hidden="true">·</span>
                        <span>{article.readingMinutes} min read</span>
                      </div>
                    </div>
                  </Link>
                </li>
              </Fragment>
            )
          })}
        </ul>
      </section>
    </main>
  )
}
