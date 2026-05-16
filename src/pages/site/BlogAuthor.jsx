import { Fragment, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '../../brand/config'
import Avatar from '../../components/atoms/Avatar'
import Divider from '../../components/atoms/Divider'
import Badge from '../../components/molecules/Badge'
import { findAuthor, articlesByAuthor, formatDate } from '../../lib/queries'
import { urlFor } from '../../lib/sanity'

export default function BlogAuthor() {
  const { slug } = useParams()
  const [state, setState] = useState({ status: 'loading', author: null, articles: [] })

  useEffect(() => {
    setState({ status: 'loading', author: null, articles: [] })
    Promise.all([findAuthor(slug), articlesByAuthor(slug)]).then(([author, articles]) =>
      setState({ status: author ? 'ok' : 'not-found', author, articles: articles ?? [] }),
    )
  }, [slug])

  const { status, author, articles } = state
  usePageTitle(author ? `${author.name} · ${BRAND.name} Journal` : `${BRAND.name} — Journal`)

  if (status === 'loading') {
    return <main className="bg-surface-primary min-h-[60vh]" />
  }

  if (status === 'not-found') {
    return (
      <main className="bg-surface-primary max-w-3xl mx-auto px-8 py-24 text-center">
        <p className="kol-prose-label">404</p>
        <h1 className="kol-prose-display-md">Author not found.</h1>
        <Link to="/blog" className="kol-prose-label" style={{ marginBottom: 0 }}>← Back to journal</Link>
      </main>
    )
  }

  return (
    <main className="bg-surface-primary">
      <section className="max-w-4xl mx-auto px-8 py-20">
        <Link
          to="/blog"
          className="kol-back-link kol-helper-xs uppercase tracking-widest text-body hover:text-emphasis no-underline inline-flex items-center gap-1.5"
          style={{ marginBottom: '32px' }}
        >
          ← Back to journal
        </Link>

        <header className="flex gap-8 items-start flex-wrap">
          <Avatar
            initial={author.avatarInitial}
            src={author.avatar ? urlFor(author.avatar).width(192).height(192).url() : null}
            alt={author.name}
            size="xl"
          />
          <div className="flex-1 min-w-0">
            <p className="kol-prose-label">{author.role}</p>
            <h1 className="kol-prose-display-md">{author.name}</h1>
            <p className="kol-prose-lede">{author.bio}</p>
            {author.links?.length > 0 && (
              <ul className="flex gap-4 flex-wrap kol-prose-label" style={{ marginBottom: 0 }}>
                {author.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target={link.href?.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="text-meta hover:text-emphasis underline underline-offset-4"
                    >
                      {link.label} →
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </header>
      </section>

      <section className="max-w-4xl mx-auto px-8 pb-24">
        <p className="kol-prose-label">Published by {author.name}</p>
        <Divider className="mb-6" />
        <ul className="flex flex-col">
          {articles.map((article, i) => (
            <Fragment key={article.slug}>
              {i > 0 && <Divider />}
              <li>
                <Link
                  to={`/blog/${article.slug}`}
                  className="grid gap-8 py-10 sm:grid-cols-[240px_1fr] no-underline hover:opacity-80 transition-opacity"
                >
                  {article.cover && (
                    <div className="aspect-[4/3] rounded overflow-hidden bg-surface-secondary">
                      <img
                        src={urlFor(article.cover).width(480).height(360).url()}
                        alt=""
                        className="w-full h-full object-cover"
                        aria-hidden="true"
                      />
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
                  </div>
                </Link>
              </li>
            </Fragment>
          ))}
        </ul>
      </section>
    </main>
  )
}
