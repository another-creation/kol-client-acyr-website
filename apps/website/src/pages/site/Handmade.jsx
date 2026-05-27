import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '@ac/brand-data/config'
import { handmadeProducts, formatPrice, HANDMADE_FAQ } from '../../data/shop-data'
import { ACImages } from '@ac/brand-data/images'
import ProductCard from '../../components/site/ProductCard'
import FAQ from '../../components/site/FAQ'
import CatalogHero from '../../components/site/CatalogHero'
import SectionOpener from '../../components/site/SectionOpener'
import SiteSection from '../../components/site/SiteSection'
import EnquiryForm from '../../components/site/EnquiryForm'
import Newsletter from '../../components/site/Newsletter'

const CATEGORIES = [
  { value: 'commission', label: 'Commission a piece' },
  { value: 'alteration', label: 'Alteration / repair' },
  { value: 'general',    label: 'General enquiry' },
]

// Curated set imagery — Handmade uses set-01..08 (Shop uses 09..20, no overlap).
const SET = Array.from({ length: 8 }, (_, i) => `/brand/shop/set/set-${String(i + 1).padStart(2, '0')}.jpg`)

export default function Handmade() {
  usePageTitle(`${BRAND.name} — Handmade`)
  const products = handmadeProducts().slice(0, 8)

  return (
    <main className="bg-surface-primary">
      {/* Hero */}
      <CatalogHero
        image={ACImages.handmade}
        eyebrow="Made by hand by Ýr"
        title="Custom Made."
        subline="Bespoke pieces cut and constructed at the studio in Reykjavík. Four to eight weeks from brief to delivery. Begin with an email."
      />

      {/* Pieces */}
      <SiteSection width="full" className="px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p, i) => (
            <div key={p.slug} className="opacity-70 hover:opacity-100 transition-opacity duration-300">
              <ProductCard
                to={`/handmade/${p.slug}`}
                src={SET[i % SET.length]}
                name={p.name}
                price={formatPrice(p.price, p.currency)}
                overlay={false}
              />
            </div>
          ))}
        </div>
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

      <Newsletter />
    </main>
  )
}
