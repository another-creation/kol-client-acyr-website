import { Fragment, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '@ac/brand-data/config'
import Avatar from '../../components/atoms/Avatar'
import Divider from '../../components/atoms/Divider'
import Badge from '../../components/molecules/Badge'
import { findAuthor, articlesByAuthor, formatDate } from '../../lib/queries'
import { urlFor } from '../../lib/sanity'
import BackLink from '../../components/site/BackLink'
import PageHero from '../../components/site/PageHero'
import SiteSection from '../../components/site/SiteSection'

export default function JournalAuthor() {
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
      <SiteSection as="main" className="bg-surface-primary px-8 py-24 text-center">
        <p className="site-meta-status">404</p>
        <h1 className="site-title-page">Author not found.</h1>
        <BackLink to="/journal">← Back to journal</BackLink>
      </SiteSection>
    )
  }

  return (
    <main className="bg-surface-primary">
      <SiteSection width="reading" className="px-8 py-20">
        <BackLink to="/journal" className="mb-8">← Back to journal</BackLink>

        <header className="flex gap-8 items-start flex-wrap">
          <Avatar
            initial={author.avatarInitial}
            src={author.avatar ? urlFor(author.avatar).width(192).height(192).url() : null}
            alt={author.name}
            size="xl"
          />
          <div className="flex-1 min-w-0">
            <PageHero
              eyebrow={author.role}
              title={author.name}
              subline={author.bio}
              sublineKind="lede"
            />
            {author.links?.length > 0 && (
              <ul className="flex gap-4 flex-wrap site-meta-editorial">
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
      </SiteSection>

      <SiteSection width="reading" className="px-8 pb-24">
        <p className="site-eyebrow-section">Published by {author.name}</p>
        <Divider className="mb-6" />
        <ul className="flex flex-col">
          {articles.map((article, i) => (
            <Fragment key={article.slug}>
              {i > 0 && <Divider />}
              <li>
                <Link
                  to={`/journal/${article.slug}`}
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
                    <div className="site-meta-editorial flex items-center gap-3" style={{ marginBottom: '12px' }}>
                      {article.tag && <Badge variant="outline" size="sm">{article.tag}</Badge>}
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                    <div className="ac-prose">
                      <h3>{article.title}</h3>
                      <p>{article.excerpt}</p>
                    </div>
                  </div>
                </Link>
              </li>
            </Fragment>
          ))}
        </ul>
      </SiteSection>
    </main>
  )
}
