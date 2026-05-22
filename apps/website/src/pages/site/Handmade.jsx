import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '@ac/brand-data/config'
import { handmadeProducts, formatPrice, HANDMADE_FAQ } from '../../data/shop-data'
import { ACImages } from '@ac/brand-data/images'
import ProductCard from '../../components/site/ProductCard'
import FAQ from '../../components/site/FAQ'
import PageHero from '../../components/site/PageHero'
import SectionOpener from '../../components/site/SectionOpener'
import SiteSection from '../../components/site/SiteSection'
import EnquiryForm from '../../components/site/EnquiryForm'

const CATEGORIES = [
  { value: 'commission', label: 'Commission a piece' },
  { value: 'alteration', label: 'Alteration / repair' },
  { value: 'general',    label: 'General enquiry' },
]

export default function Handmade() {
  usePageTitle(`${BRAND.name} — Handmade`)
  const products = handmadeProducts().slice(0, 6)

  return (
    <main className="bg-surface-primary pb-24">
      {/* Hero — editorial-pattern full-bleed mood image, matches Collections / Journal */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <img
          src={ACImages.handmade}
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
            eyebrow="Made by hand by Ýr"
            title="Custom Made."
            subline="Bespoke pieces cut and constructed at the studio in Reykjavík. Four to eight weeks from brief to delivery. Begin with an email."
            className="items-center"
          />
        </SiteSection>
      </section>

      {/* Pieces */}
      <SiteSection width="full" className="px-8 py-32">
        <SectionOpener eyebrow="Pieces" divider>
          <ul className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <li key={p.slug}>
                <ProductCard
                  to={`/handmade/${p.slug}`}
                  src={p.image}
                  label={p.name}
                  name={p.name}
                  price={formatPrice(p.price, p.currency)}
                  sizes={p.sizes}
                />
              </li>
            ))}
          </ul>
        </SectionOpener>
      </SiteSection>

      {/* FAQ */}
      <SiteSection width="panel" className="px-8 py-32">
        <SectionOpener
          layout="split"
          eyebrow="Frequently asked"
          title="Before you commission."
        >
          <FAQ items={HANDMADE_FAQ} layout="stacked" />
        </SectionOpener>
      </SiteSection>

      {/* Inline contact form (mailto-styled) */}
      <SiteSection width="panel" className="px-8 py-32">
        <SectionOpener
          layout="split"
          eyebrow="Have questions?"
          title="Ask the studio."
          subline="Brief us on what you have in mind. We respond within two business days."
        >
          <EnquiryForm
            tag="Handmade"
            categories={CATEGORIES}
            defaultCategory="commission"
            subjectField
            messagePlaceholder="What can we make?"
          />
        </SectionOpener>
      </SiteSection>
    </main>
  )
}
