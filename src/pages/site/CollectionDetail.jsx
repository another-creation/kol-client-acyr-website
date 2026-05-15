import { Fragment, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '../../brand/config'
import Divider from '../../components/atoms/Divider'
import BlogBody from '../../components/site/BlogBody'
import { findCollection, adjacentCollections, formatShowDate } from '../../brand/data/collections-data'

function CollectionHero({ hero, title, subtitle, year, show }) {
  return (
    <section className="relative w-full h-[88dvh] overflow-hidden">
      {hero?.type === 'video' && hero.src ? (
        <video
          src={hero.src}
          poster={hero.poster}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
      ) : (
        <img
          src={hero?.src ?? hero}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, transparent 40%, color-mix(in srgb, var(--kol-surface-primary) 50%, transparent) 75%, var(--kol-surface-primary) 100%)' }}
      />
      <div className="absolute inset-0 flex items-end">
        <div className="w-full max-w-5xl mx-auto px-8 pb-16">
          <p className="kol-prose-label">{title} · {year}</p>
          <h1 className="kol-prose-display" style={{ marginBottom: '16px' }}>{subtitle ?? title}</h1>
          {show?.venue && (
            <p className="kol-prose-tagline">
              {show.venue}
              {show.date && <> · {formatShowDate(show.date)}</>}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

function VideoEmbed({ video }) {
  const [active, setActive] = useState(false)
  if (!video?.embedUrl) return null
  return (
    <div className="relative aspect-video rounded overflow-hidden bg-surface-secondary">
      {active ? (
        <iframe
          src={`${video.embedUrl}${video.embedUrl.includes('?') ? '&' : '?'}autoplay=1`}
          title={video.kind ?? 'video'}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer group"
          aria-label={`Play ${video.kind ?? 'video'}`}
          style={{ background: 'transparent' }}
        >
          {video.poster && (
            <img src={video.poster} alt="" className="absolute inset-0 w-full h-full object-cover" aria-hidden="true" />
          )}
          <span
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'color-mix(in srgb, black 30%, transparent)' }}
          >
            <span
              className="kol-prose-label"
              style={{ color: 'var(--kol-surface-on-inverse, #fff)', fontSize: '14px', margin: 0, padding: '12px 24px', border: '1px solid currentColor', borderRadius: '999px' }}
            >
              ▶ Play {video.duration && `· ${video.duration}`}
            </span>
          </span>
        </button>
      )}
    </div>
  )
}

export default function CollectionDetail() {
  const { slug } = useParams()
  const collection = findCollection(slug)
  usePageTitle(collection ? `${collection.title} · ${BRAND.name}` : `${BRAND.name} — Collections`)

  if (!collection) {
    return (
      <main className="bg-surface-primary max-w-3xl mx-auto px-8 py-24 text-center">
        <p className="kol-prose-label">404</p>
        <h1 className="kol-prose-display-md">Collection not found.</h1>
        <Link to="/collections" className="kol-prose-label" style={{ marginBottom: 0 }}>← Back to collections</Link>
      </main>
    )
  }

  const { prev, next } = adjacentCollections(slug)
  const showHasContent = collection.show && Object.values(collection.show).some(Boolean)
  const hasCollaborators = collection.collaborators?.length > 0
  const hasPress = collection.press?.length > 0
  const hasVideos = collection.videos?.length > 0

  return (
    <main className="bg-surface-primary pb-24">
      <CollectionHero
        hero={collection.hero}
        title={collection.title}
        subtitle={collection.subtitle}
        year={collection.year}
        show={collection.show}
      />

      <section className="max-w-3xl mx-auto px-8 pt-20 pb-12">
        <Link
          to="/collections"
          className="kol-back-link kol-helper-xs uppercase tracking-widest text-body hover:text-emphasis no-underline inline-flex items-center gap-1.5"
          style={{ marginBottom: '32px' }}
        >
          ← Back to collections
        </Link>

        <p className="kol-prose-lede">{collection.excerpt}</p>

        <BlogBody blocks={collection.notes} />
      </section>

      <section className="max-w-6xl mx-auto px-8 py-12">
        <p className="kol-prose-label">The looks</p>
        <Divider className="mb-8" />
        <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {collection.looks.map((look) => (
            <li key={look.number} className="flex flex-col">
              <div className="aspect-[3/4] rounded overflow-hidden bg-surface-secondary mb-3">
                <img src={look.image} alt={look.name} className="w-full h-full object-cover" />
              </div>
              <p className="kol-prose-label" style={{ marginBottom: '4px' }}>
                Look {String(look.number).padStart(2, '0')} · {look.family}
              </p>
              <div className="kol-prose">
                <p style={{ margin: '0 0 4px' }}><strong>{look.name}</strong></p>
                <p style={{ margin: 0, fontSize: '14px', lineHeight: '20px' }}>{look.fabric}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {showHasContent && (
        <section className="max-w-3xl mx-auto px-8 py-12">
          <p className="kol-prose-label">The show</p>
          <Divider className="mb-8" />
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 kol-prose">
            {collection.show.event && (
              <div>
                <dt className="kol-prose-label" style={{ margin: 0 }}>Event</dt>
                <dd style={{ margin: 0 }}>{collection.show.event}</dd>
              </div>
            )}
            {collection.show.venue && (
              <div>
                <dt className="kol-prose-label" style={{ margin: 0 }}>Venue</dt>
                <dd style={{ margin: 0 }}>{collection.show.venue}</dd>
              </div>
            )}
            {collection.show.date && (
              <div>
                <dt className="kol-prose-label" style={{ margin: 0 }}>Date</dt>
                <dd style={{ margin: 0 }}>{formatShowDate(collection.show.date)}</dd>
              </div>
            )}
            {collection.show.music && (
              <div>
                <dt className="kol-prose-label" style={{ margin: 0 }}>Music</dt>
                <dd style={{ margin: 0 }}>{collection.show.music}</dd>
              </div>
            )}
            {collection.show.film && (
              <div>
                <dt className="kol-prose-label" style={{ margin: 0 }}>Film</dt>
                <dd style={{ margin: 0 }}>{collection.show.film}</dd>
              </div>
            )}
            {collection.show.lighting && (
              <div>
                <dt className="kol-prose-label" style={{ margin: 0 }}>Lighting</dt>
                <dd style={{ margin: 0 }}>{collection.show.lighting}</dd>
              </div>
            )}
          </dl>
        </section>
      )}

      {hasCollaborators && (
        <section className="max-w-3xl mx-auto px-8 py-12">
          <p className="kol-prose-label">Collaborators</p>
          <Divider className="mb-8" />
          <ul className="flex flex-col">
            {collection.collaborators.map((c, i) => (
              <Fragment key={`${c.role}-${c.name}`}>
                {i > 0 && <Divider />}
                <li className="py-4 grid gap-4 sm:grid-cols-[160px_1fr]">
                  <p className="kol-prose-label" style={{ margin: 0 }}>{c.role}</p>
                  <div className="kol-prose">
                    <p style={{ margin: 0 }}>
                      {c.href
                        ? <a href={c.href} target="_blank" rel="noopener noreferrer"><strong>{c.name}</strong></a>
                        : <strong>{c.name}</strong>}
                    </p>
                  </div>
                </li>
              </Fragment>
            ))}
          </ul>
        </section>
      )}

      {hasVideos && (
        <section className="max-w-5xl mx-auto px-8 py-12">
          <p className="kol-prose-label">Watch</p>
          <Divider className="mb-8" />
          <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2">
            {collection.videos.map((v, i) => (
              <li key={i}>
                <VideoEmbed video={v} />
                <p className="kol-prose-label" style={{ marginTop: '8px', marginBottom: 0 }}>
                  {v.kind} {v.duration && `· ${v.duration}`}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {hasPress && (
        <section className="max-w-3xl mx-auto px-8 py-12">
          <p className="kol-prose-label">Press</p>
          <Divider className="mb-8" />
          <ul className="flex flex-col">
            {collection.press.map((p, i) => (
              <Fragment key={p.outlet}>
                {i > 0 && <Divider />}
                <li className="py-6">
                  <p className="kol-prose-label" style={{ marginBottom: '8px' }}>
                    {p.outlet}{p.date && <> · {p.date}</>}
                  </p>
                  <div className="kol-prose">
                    <p style={{ margin: 0 }}>
                      "{p.quote}"
                      {p.href && (
                        <> — <a href={p.href} target="_blank" rel="noopener noreferrer">read</a></>
                      )}
                    </p>
                  </div>
                </li>
              </Fragment>
            ))}
          </ul>
        </section>
      )}

      <section className="max-w-5xl mx-auto px-8 pt-12">
        <Divider />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-12">
          {prev ? (
            <Link to={`/collections/${prev.slug}`} className="block no-underline">
              <p className="kol-prose-label" style={{ marginBottom: '8px' }}>← Previous</p>
              <div className="kol-prose">
                <p style={{ margin: '0 0 4px' }}>{prev.title} · {prev.year}</p>
                <p style={{ margin: 0 }}><strong>{prev.subtitle ?? prev.title}</strong></p>
              </div>
            </Link>
          ) : <span />}
          {next ? (
            <Link to={`/collections/${next.slug}`} className="block no-underline text-right">
              <p className="kol-prose-label" style={{ marginBottom: '8px' }}>Next →</p>
              <div className="kol-prose">
                <p style={{ margin: '0 0 4px' }}>{next.title} · {next.year}</p>
                <p style={{ margin: 0 }}><strong>{next.subtitle ?? next.title}</strong></p>
              </div>
            </Link>
          ) : <span />}
        </div>
      </section>
    </main>
  )
}
