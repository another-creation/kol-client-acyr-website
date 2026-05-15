import { Link, useParams } from 'react-router-dom'
import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '../../brand/config'
import Avatar from '../../components/atoms/Avatar'
import Divider from '../../components/atoms/Divider'
import Badge from '../../components/molecules/Badge'
import BlogBody from '../../components/site/BlogBody'
import { findArticle, findAuthor, formatDate } from '../../brand/data/blog-data'

export default function BlogArticle() {
  const { slug } = useParams()
  const article = findArticle(slug)
  const author = article ? findAuthor(article.authorSlug) : null
  usePageTitle(article ? `${article.title} · ${BRAND.name}` : `${BRAND.name} — Journal`)

  if (!article) {
    return (
      <main className="bg-surface-primary max-w-3xl mx-auto px-8 py-24 text-center">
        <p className="kol-prose-label">404</p>
        <h1 className="kol-prose-display-md">Article not found.</h1>
        <Link to="/blog" className="kol-prose-label" style={{ marginBottom: 0 }}>← Back to journal</Link>
      </main>
    )
  }

  return (
    <main className="bg-surface-primary pb-24">
      {article.cover && (
        <div className="w-full h-[280px] md:h-[400px] overflow-hidden mb-16 bg-surface-secondary">
          <img src={article.cover} alt="" className="w-full h-full object-cover" aria-hidden="true" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-8">
        <Link
          to="/blog"
          className="kol-back-link kol-helper-xs uppercase tracking-widest text-body hover:text-emphasis no-underline inline-flex items-center gap-1.5"
          style={{ marginBottom: '32px' }}
        >
          ← Back to journal
        </Link>

        <header style={{ marginBottom: '64px' }}>
          {article.tag && (
            <div style={{ marginBottom: '20px' }}>
              <Badge variant="outline" size="sm">{article.tag}</Badge>
            </div>
          )}
          <h1 className="kol-prose-display-md">{article.title}</h1>
          <p className="kol-prose-lede">{article.excerpt}</p>
          <Divider className="pt-4" />
          <div className="kol-prose-label flex items-center gap-3 flex-wrap pt-4" style={{ marginBottom: 0 }}>
            {author && (
              <Link to={`/blog/author/${author.slug}`} className="inline-flex items-center gap-2.5 no-underline text-meta hover:text-emphasis">
                <Avatar initial={author.avatarInitial} size="sm" />
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
            <Link to={`/blog/author/${author.slug}`} className="flex gap-5 no-underline hover:opacity-80 transition-opacity">
              <Avatar initial={author.avatarInitial} size="lg" />
              <div className="min-w-0 flex-1">
                <p className="kol-prose-label" style={{ marginBottom: '8px' }}>{author.role}</p>
                <div className="kol-prose">
                  <h3 style={{ margin: '0 0 8px' }}>{author.name}</h3>
                  <p style={{ margin: 0 }}>{author.bio}</p>
                </div>
              </div>
            </Link>
          </aside>
        )}
      </div>
    </main>
  )
}
