/**
 * Image — raster asset loader.
 *
 * Globs ./img/<category>/<name>.{png,jpg,jpeg,webp,gif,avif} at build time,
 * Vite hashes URLs and resolves them via `?url`. Usage:
 *   <Image category="mocks" name="business-card-bg" />
 *
 * Mirrors the Graphic loader pattern but for raster files (rendered as
 * <img>, not inline-injected). Missing assets render an AssetPlaceholder so
 * gaps are visible rather than silently empty.
 */
import AssetPlaceholder from '../../primitives/AssetPlaceholder'

const imageModules = import.meta.glob(
  './img/**/*.{png,jpg,jpeg,webp,gif,avif}',
  { eager: true, query: '?url', import: 'default' }
)

const IMAGE_CACHE = Object.entries(imageModules).reduce((acc, [path, url]) => {
  const [category, file] = path.replace('./img/', '').split('/')
  const name = file.replace(/\.[^.]+$/, '')
  if (!acc[category]) acc[category] = {}
  acc[category][name] = url
  return acc
}, {})

export const IMAGES = Object.fromEntries(
  Object.entries(IMAGE_CACHE).map(([category, items]) => [category, Object.keys(items).sort()])
)

/** Resolve a (category, name) pair to a Vite-hashed URL, or null if missing. */
export const imageUrl = (category, name) => IMAGE_CACHE[category]?.[name] ?? null

export default function Image({
  category,
  name,
  alt = '',
  className = '',
  style,
  loading = 'lazy',
}) {
  const src = IMAGE_CACHE[category]?.[name]
  if (!src) {
    if (import.meta.env.DEV) console.warn(`Image: ${category}/${name} not found`)
    return <AssetPlaceholder category={category} name={name} note="pending" className={className} />
  }
  return (
    <img
      src={src}
      alt={alt}
      className={`kol-image block w-full h-auto ${className}`.trim()}
      style={style}
      loading={loading}
    />
  )
}
