import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '@ac/brand-data/config'
import Avatar from '../../components/atoms/Avatar'
import Divider from '../../components/atoms/Divider'
import Badge from '../../components/molecules/Badge'
import BlogBody from '../../components/site/BlogBody'
import { findArticle, formatDate } from '../../lib/queries'
import { urlFor } from '../../lib/sanity'
import BackLink from '../../components/site/BackLink'
import PageHero from '../../components/site/PageHero'
import SiteSection from '../../components/site/SiteSection'

export default function JournalArticle() {
  const { slug } = useParams()
  const [state, setState] = useState({ status: 'loading', article: null })

  useEffect(() => {
    setState({ status: 'loading', article: null })
    findArticle(slug).then((article) =>
      setState({ status: article ? 'ok' : 'not-found', article }),
    )
  }, [slug])

  const { status, article } = state
  usePageTitle(article ? `${article.title} · ${BRAND.name}` : `${BRAND.name} — Journal`)

  if (status === 'loading') {
    return <main className="bg-surface-primary min-h-[60vh]" />
  }

  if (status === 'not-found') {
    return (
      <SiteSection as="main" className="bg-surface-primary px-8 py-24 text-center">
        <p className="site-meta-status">404</p>
        <h1 className="site-title-page">Article not found.</h1>
        <BackLink to="/journal">← Back to journal</BackLink>
      </SiteSection>
    )
  }

  const author = article.author

  return (
    <main className="bg-surface-primary pb-24">
      {article.cover && (
        <div className="w-full h-[280px] md:h-[400px] overflow-hidden mb-16 bg-surface-secondary">
          <img
            src={urlFor(article.cover).width(1600).height(800).url()}
            alt=""
            className="w-full h-full object-cover"
            aria-hidden="true"
          />
        </div>
      )}

      <SiteSection as="div" className="px-8">
        <BackLink to="/journal" className="mb-8">← Back to journal</BackLink>

        <header style={{ marginBottom: '64px' }}>
          {article.tag && (
            <div style={{ marginBottom: '20px' }}>
              <Badge variant="outline" size="sm">{article.tag}</Badge>
            </div>
          )}
          <PageHero
            title={article.title}
            subline={article.excerpt}
            sublineKind="lede"
          />
          <Divider className="pt-4" />
          <div className="site-meta-editorial flex items-center gap-3 flex-wrap pt-4">
            {author && (
              <Link to={`/journal/author/${author.slug}`} className="inline-flex items-center gap-2.5 no-underline text-meta hover:text-emphasis">
                <Avatar
                  initial={author.avatarInitial}
                  src={author.avatar ? urlFor(author.avatar).width(64).height(64).url() : null}
                  alt={author.name}
                  size="sm"
                />
                <span>{author.name}</span>
              </Link>
            )}
            <span aria-hidden="true">·</span>
            <span>{formatDate(article.publishedAt)}</span>
            <span aria-hidden="true">·</span>
            <span>{article.readingMinutes} min read</span>
          </div>
        </header>

        <BlogBody blocks={article.body} />

        {author && (
          <aside className="mt-20 p-8 rounded border border-fg-08 bg-surface-secondary">
            <Link to={`/journal/author/${author.slug}`} className="flex gap-5 no-underline hover:opacity-80 transition-opacity">
              <Avatar
                initial={author.avatarInitial}
                src={author.avatar ? urlFor(author.avatar).width(112).height(112).url() : null}
                alt={author.name}
                size="lg"
              />
              <div className="min-w-0 flex-1">
                <p className="site-meta-editorial" style={{ marginBottom: '8px' }}>{author.role}</p>
                <div className="ac-prose">
                  <h3 style={{ margin: '0 0 8px' }}>{author.name}</h3>
                  <p style={{ margin: 0 }}>{author.bio}</p>
                </div>
              </div>
            </Link>
          </aside>
        )}
      </SiteSection>
    </main>
  )
}
