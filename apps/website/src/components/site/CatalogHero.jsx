import PageHero from './PageHero'
import SiteSection from './SiteSection'

/**
 * CatalogHero — shared marketing hero for catalog pages (Shop, Handmade).
 *
 * Full-bleed mood image + bottom gradient + centred PageHero. One source so
 * the catalog pages don't drift apart. Image + copy are the only differences.
 */
export default function CatalogHero({ image, eyebrow, title, subline }) {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden">
      <img
        src={image}
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
          eyebrow={eyebrow}
          title={title}
          subline={subline}
          className="items-center"
        />
      </SiteSection>
    </section>
  )
}
