import { useEffect, useState } from 'react'
import BrandHero from '../components/framework/BrandHero'
import PageSection from '../components/framework/PageSection'
import ContentFilters from '@components/molecules/ContentFilters'
import Badge from '@components/molecules/Badge'
import Icon from '@components/loaders/icons/Icon'
import CarouselArrow from '@components/molecules/CarouselArrow'
import usePageTitle from '../components/hooks/usePageTitle'
import { MEDIA_METADATA } from '../data/media-metadata'

export default function Gallery() {
  usePageTitle('Gallery')
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [lightbox, setLightbox] = useState(null)

  useEffect(() => {
    fetch('/__photos.json')
      .then((r) => (r.ok ? r.json() : Promise.reject(r.statusText)))
      .then(setData)
      .catch(setError)
  }, [])

  if (error) {
    return (
      <BrandHero
        label="media library"
        title="Gallery"
        lede={`Unavailable: ${String(error)}. Is the dev server running and the photoIndexPlugin registered in vite.config.js?`}
      />
    )
  }

  if (!data) {
    return <BrandHero label="media library" title="Gallery" lede="Loading…" />
  }

  if (!data.groups.length) {
    return (
      <BrandHero
        label="media library"
        title="Gallery"
        lede="No media found. Drop folders into public/brand/<group>/ and reload."
      />
    )
  }

  const items = data.groups.flatMap((g) =>
    g.files.flatMap((f) => {
      const subcategory = deriveSubcategory(f.src, g.name)
      const meta = MEDIA_METADATA[f.src] ?? {}
      const fallbackName = (f.src.split('/').pop() ?? f.src).replace(/\.[^.]+$/, '')
      const base = {
        ...f,
        name: meta.title ?? fallbackName,
        title: meta.title,
        category: g.name,
        subcategory,
        groupKey: subcategory ? `${g.name} / ${subcategory}` : g.name,
        tags: meta.tags ?? [],
        credits: meta.credits,
        year: meta.year,
        season: meta.season,
        featured: meta.featured ?? false,
      }
      const crossPosts = (meta.crossPostTo ?? []).map((target) => {
        const [cat, sub] = target.split('/')
        return {
          ...base,
          category: cat,
          subcategory: sub ?? null,
          groupKey: sub ? `${cat} / ${sub}` : cat,
        }
      })
      return [base, ...crossPosts]
    }),
  )

  const totalVideo = items.filter((f) => f.type === 'video').length
  const categoryValues = data.groups.map((g) => g.name)
  const tagValues = [...new Set(items.flatMap((i) => i.tags))].sort()

  return (
    <>
      <BrandHero
        label="media library"
        title="Gallery"
        lede={`${items.length} items across ${data.groups.length} groups${totalVideo > 0 ? ` (${totalVideo} video)` : ''}. Live index of public/brand/ via photoIndexPlugin.`}
      />

      <PageSection id="content">
        <ContentFilters
          items={items}
          title="Media"
          totalCount={items.length}
          filterGroups={[
            { label: 'Category', key: 'category', values: categoryValues },
            { label: 'Type',     key: 'type',     values: ['image', 'video'] },
            ...(tagValues.length ? [{ label: 'Tags', key: 'tags', values: tagValues }] : []),
          ]}
          viewModeOptions={[
            { value: 'grid', label: 'Grid' },
            { value: 'list', label: 'List' },
          ]}
          defaultViewMode="grid"
          searchKeys={['name', 'category', 'tags']}
          renderItem={(filtered, viewMode) =>
            viewMode === 'list'
              ? <ListView items={filtered} onOpen={setLightbox} />
              : <GridView items={filtered} onOpen={setLightbox} />
          }
        />
      </PageSection>

      {lightbox && (
        <Lightbox
          list={lightbox.list}
          startIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  )
}

function deriveSubcategory(src, category) {
  const parts = src.split('/').filter(Boolean)
  const idx = parts.indexOf(category)
  if (idx === -1) return null
  const after = parts.slice(idx + 1)
  return after.length > 1 ? after[0] : null
}

function slugifyKey(key) {
  return key.toLowerCase().replace(/\s*\/\s*/g, '--').replace(/\s+/g, '-')
}

function groupByCategory(items) {
  const groups = new Map()
  for (const item of items) {
    const key = item.groupKey ?? item.category
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(item)
  }
  return [...groups.entries()].map(([category, files]) => ({ category, files }))
}

function CategoryHeader({ category, count }) {
  return (
    <h3 className="ac-helper-12 text-fg-48 uppercase tracking-wider">
      {category} <span className="text-fg-32">· {count}</span>
    </h3>
  )
}

function openHandler(onOpen, list, entry) {
  return (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    const index = list.findIndex((x) => x.src === entry.src)
    onOpen({ list, index: index < 0 ? 0 : index })
  }
}

function GridView({ items, onOpen }) {
  const grouped = groupByCategory(items)
  return (
    <div className="flex flex-col gap-12">
      {grouped.map(({ category, files }) => (
        <section key={category} id={slugifyKey(category)} className="flex flex-col gap-3">
          <CategoryHeader category={category} count={files.length} />
          <div
            className="grid gap-2"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}
          >
            {files.map((entry) => (
              <a
                key={entry.src}
                href={entry.src}
                target="_blank"
                rel="noreferrer"
                title={entry.src.split('/').pop()}
                onClick={openHandler(onOpen, items, entry)}
                className="block aspect-square overflow-hidden bg-fg-04 relative rounded-[4px] cursor-zoom-in"
              >
                {entry.type === 'video' ? (
                  <video
                    src={entry.src}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'center top' }}
                  />
                ) : (
                  <img
                    src={entry.src}
                    loading="lazy"
                    alt=""
                    className="w-full h-full object-cover"
                    style={{ objectPosition: 'center top' }}
                  />
                )}
                {entry.type === 'video' && (
                  <span className="ac-helper-10 absolute top-2 right-2 uppercase tracking-wider bg-surface-inverse text-on-inverse px-2 py-0.5 rounded-sm">
                    video
                  </span>
                )}
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function ListView({ items, onOpen }) {
  const grouped = groupByCategory(items)
  return (
    <div className="flex flex-col gap-12">
      {grouped.map(({ category, files }) => (
        <section key={category} id={slugifyKey(category)} className="flex flex-col gap-3">
          <CategoryHeader category={category} count={files.length} />
          <ul className="flex flex-col">
            {files.map((entry) => (
              <li
                key={entry.src}
                className="flex items-center gap-4 border-b border-fg-08 py-3"
              >
                <a
                  href={entry.src}
                  target="_blank"
                  rel="noreferrer"
                  onClick={openHandler(onOpen, items, entry)}
                  className="block w-20 h-20 flex-shrink-0 overflow-hidden bg-fg-04 rounded-[4px] cursor-zoom-in"
                >
                  {entry.type === 'video' ? (
                    <video
                      src={entry.src}
                      muted
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={entry.src}
                      loading="lazy"
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </a>
                <div className="flex-1 min-w-0">
                  <a
                    href={entry.src}
                    target="_blank"
                    rel="noreferrer"
                    onClick={openHandler(onOpen, items, entry)}
                    className="ac-prose-label text-emphasis hover:underline truncate block"
                  >
                    {entry.name}
                  </a>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={entry.type === 'video' ? 'info' : 'default'} size="sm">{entry.type}</Badge>
                  </div>
                </div>
                <a
                  href={entry.src}
                  target="_blank"
                  rel="noreferrer"
                  className="text-meta hover:text-emphasis flex-shrink-0"
                  aria-label="Open in new tab"
                >
                  <Icon name="external-link" size={16} />
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

function Lightbox({ list, startIndex, onClose }) {
  const [index, setIndex] = useState(startIndex)
  const entry = list[index]

  const prev = () => setIndex((i) => (i - 1 + list.length) % list.length)
  const next = () => setIndex((i) => (i + 1) % list.length)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [list.length, onClose])

  if (!entry) return null

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      style={{ background: 'rgba(0, 0, 0, 0.9)' }}
      onClick={onClose}
    >
      <CarouselArrow
        direction="left"
        onClick={(e) => { e.stopPropagation(); prev() }}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10"
      />
      <CarouselArrow
        direction="right"
        onClick={(e) => { e.stopPropagation(); next() }}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10"
      />

      <div
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 'calc(100vw - 144px)', maxHeight: 'calc(100vh - 48px)' }}
      >
        {entry.type === 'video' ? (
          <video
            key={entry.src}
            src={entry.src}
            controls
            autoPlay
            style={{ maxWidth: '100%', maxHeight: 'calc(100vh - 48px)', display: 'block' }}
          />
        ) : (
          <img
            key={entry.src}
            src={entry.src}
            alt={entry.name}
            style={{ maxWidth: '100%', maxHeight: 'calc(100vh - 48px)', display: 'block' }}
          />
        )}
      </div>

      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-center max-w-[60ch]"
        onClick={(e) => e.stopPropagation()}
      >
        {entry.title && (
          <span className="ac-helper-14 text-emphasis">{entry.title}</span>
        )}
        {entry.credits && (
          <span className="ac-helper-12 text-fg-64">{entry.credits}</span>
        )}
        <span className="ac-helper-10 text-fg-48 uppercase tracking-wider">
          {[entry.season, entry.year].filter(Boolean).join(' · ')}
          {(entry.season || entry.year) ? ' · ' : ''}
          {index + 1} / {list.length}
        </span>
      </div>
    </div>
  )
}
