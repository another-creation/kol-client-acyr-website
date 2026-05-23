import { Fragment, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '@ac/brand-data/config'
import Divider from '../../components/atoms/Divider'
import BlogBody from '../../components/site/BlogBody'
import { findCollection, adjacentCollections, formatShowDate } from '../../lib/queries'
import { urlFor } from '../../lib/sanity'
import BackLink from '../../components/site/BackLink'
import PageHero from '../../components/site/PageHero'
import SectionOpener from '../../components/site/SectionOpener'
import SiteSection from '../../components/site/SiteSection'

function CollectionHero({ heroImage, heroVideo, heroVideoPoster, cover, title, subtitle, year, show }) {
  const videoUrl = heroVideo?.asset?.url
  const posterUrl = heroVideoPoster ? urlFor(heroVideoPoster).width(1600).url() : null
  const imageUrl = heroImage
    ? urlFor(heroImage).width(1920).url()
    : cover
    ? urlFor(cover).width(1920).url()
    : null

  return (
    <section className="relative w-full h-[88dvh] overflow-hidden">
      {videoUrl ? (
        <video
          src={videoUrl}
          poster={posterUrl ?? undefined}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          aria-hidden="true"
        />
      ) : (
        imageUrl && (
          <img
            src={imageUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            aria-hidden="true"
          />
        )
      )}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, transparent 40%, color-mix(in srgb, var(--ac-surface-primary) 50%, transparent) 75%, var(--ac-surface-primary) 100%)' }}
      />
      <div className="absolute inset-0 flex items-end">
        <SiteSection width="wide" as="div" className="w-full px-8 pb-16">
          <PageHero
            variant="marketing"
            sublineKind="tagline"
            eyebrow={`${title} · ${year}`}
            title={subtitle ?? title}
            subline={show?.venue && <>{show.venue}{show.date && <> · {formatShowDate(show.date)}</>}</>}
          />
        </SiteSection>
      </div>
    </section>
  )
}

export default function CollectionDetail() {
  const { slug } = useParams()
  const [state, setState] = useState({ status: 'loading', collection: null, prev: null, next: null })

  useEffect(() => {
    setState({ status: 'loading', collection: null, prev: null, next: null })
    Promise.all([findCollection(slug), adjacentCollections(slug)]).then(([collection, adjacent]) =>
      setState({
        status: collection ? 'ok' : 'not-found',
        collection,
        prev: adjacent?.prev ?? null,
        next: adjacent?.next ?? null,
      }),
    )
  }, [slug])

  const { status, collection, prev, next } = state
  usePageTitle(collection ? `${collection.title} · ${BRAND.name}` : `${BRAND.name} — Collections`)

  if (status === 'loading') {
    return <main className="bg-surface-primary min-h-[60vh]" />
  }

  if (status === 'not-found') {
    return (
      <SiteSection as="main" className="bg-surface-primary px-8 py-24 text-center">
        <p className="site-meta-status">404</p>
        <h1 className="site-title-page">Collection not found.</h1>
        <BackLink to="/collections">← Back to collections</BackLink>
      </SiteSection>
    )
  }

  const showHasContent = collection.show && Object.values(collection.show).some(Boolean)
  const hasCollaborators = collection.collaborators?.length > 0
  const hasPress = collection.press?.length > 0
  const looks = collection.looks ?? []

  return (
    <main className="bg-surface-primary pb-24">
      <CollectionHero
        heroImage={collection.heroImage}
        heroVideo={collection.heroVideo}
        heroVideoPoster={collection.heroVideoPoster}
        cover={collection.cover}
        title={collection.title}
        subtitle={collection.subtitle}
        year={collection.year}
        show={collection.show}
      />

      <SiteSection width="full" className="px-8 pt-20 pb-12">
        <BackLink to="/collections" className="mb-8">← Back to collections</BackLink>

        <p className="site-subline-hero">{collection.excerpt}</p>

        <BlogBody blocks={collection.notes} />
      </SiteSection>

      <SiteSection width="full" className="px-8 py-12">
        <SectionOpener eyebrow="The looks" divider>
          <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {looks.map((look) => (
              <li key={look.number} className="flex flex-col">
                <div className="aspect-[3/4] rounded overflow-hidden bg-surface-secondary mb-3">
                  {look.image && (
                    <img
                      src={urlFor(look.image).width(800).height(1066).url()}
                      alt={look.name ?? `Look ${look.number}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <p className="site-meta-editorial" style={{ marginBottom: '4px' }}>
                  Look {String(look.number).padStart(2, '0')}
                  {look.family && <> · {look.family}</>}
                </p>
                {(look.name || look.fabric) && (
                  <div className="ac-prose">
                    {look.name && <p style={{ margin: '0 0 4px' }}><strong>{look.name}</strong></p>}
                    {look.fabric && <p style={{ margin: 0, fontSize: '14px', lineHeight: '20px' }}>{look.fabric}</p>}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </SectionOpener>
      </SiteSection>

      {showHasContent && (
        <SiteSection className="px-8 py-12">
          <SectionOpener eyebrow="The show" divider>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 ac-prose">
              {collection.show.event && (
                <div>
                  <dt className="site-meta-editorial" style={{ margin: 0 }}>Event</dt>
                  <dd style={{ margin: 0 }}>{collection.show.event}</dd>
                </div>
              )}
              {collection.show.venue && (
                <div>
                  <dt className="site-meta-editorial" style={{ margin: 0 }}>Venue</dt>
                  <dd style={{ margin: 0 }}>{collection.show.venue}</dd>
                </div>
              )}
              {collection.show.date && (
                <div>
                  <dt className="site-meta-editorial" style={{ margin: 0 }}>Date</dt>
                  <dd style={{ margin: 0 }}>{formatShowDate(collection.show.date)}</dd>
                </div>
              )}
              {collection.show.music && (
                <div>
                  <dt className="site-meta-editorial" style={{ margin: 0 }}>Music</dt>
                  <dd style={{ margin: 0 }}>{collection.show.music}</dd>
                </div>
              )}
              {collection.show.film && (
                <div>
                  <dt className="site-meta-editorial" style={{ margin: 0 }}>Film</dt>
                  <dd style={{ margin: 0 }}>{collection.show.film}</dd>
                </div>
              )}
              {collection.show.lighting && (
                <div>
                  <dt className="site-meta-editorial" style={{ margin: 0 }}>Lighting</dt>
                  <dd style={{ margin: 0 }}>{collection.show.lighting}</dd>
                </div>
              )}
            </dl>
          </SectionOpener>
        </SiteSection>
      )}

      {hasCollaborators && (
        <SiteSection className="px-8 py-12">
          <SectionOpener eyebrow="Collaborators" divider>
            <ul className="flex flex-col">
              {collection.collaborators.map((c, i) => (
                <Fragment key={`${c.role}-${c.name}`}>
                  {i > 0 && <Divider />}
                  <li className="py-4 grid gap-4 sm:grid-cols-[160px_1fr]">
                    <p className="site-meta-editorial" style={{ margin: 0 }}>{c.role}</p>
                    <div className="ac-prose">
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
          </SectionOpener>
        </SiteSection>
      )}

      {hasPress && (
        <SiteSection className="px-8 py-12">
          <SectionOpener eyebrow="Press" divider>
            <ul className="flex flex-col">
              {collection.press.map((p, i) => (
                <Fragment key={p.outlet}>
                  {i > 0 && <Divider />}
                  <li className="py-6">
                    <p className="site-meta-editorial" style={{ marginBottom: '8px' }}>
                      {p.outlet}{p.date && <> · {p.date}</>}
                    </p>
                    <div className="ac-prose">
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
          </SectionOpener>
        </SiteSection>
      )}

      <SiteSection width="wide" className="px-8 pt-12">
        <Divider />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-12">
          {prev ? (
            <Link to={`/collections/${prev.slug}`} className="block no-underline">
              <p className="site-back-link" style={{ marginBottom: '8px' }}>← Previous</p>
              <div className="ac-prose">
                <p style={{ margin: '0 0 4px' }}>{prev.title} · {prev.year}</p>
              </div>
            </Link>
          ) : <span />}
          {next ? (
            <Link to={`/collections/${next.slug}`} className="block no-underline text-right">
              <p className="site-back-link" style={{ marginBottom: '8px' }}>Next →</p>
              <div className="ac-prose">
                <p style={{ margin: '0 0 4px' }}>{next.title} · {next.year}</p>
              </div>
            </Link>
          ) : <span />}
        </div>
      </SiteSection>
    </main>
  )
}
