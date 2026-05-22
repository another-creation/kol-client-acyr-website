import { Link } from 'react-router-dom'
import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '@ac/brand-data/config'
import { ACImages } from '@ac/brand-data/images'
import ContentFilters from '../../components/molecules/ContentFilters'
import { podProducts, formatPrice } from '../../data/shop-data'
import ProductCard from '../../components/site/ProductCard'
import PageHero from '../../components/site/PageHero'
import SiteSection from '../../components/site/SiteSection'

const FILTER_GROUPS = [
  { label: 'Print', key: 'print', values: ['earth', 'metal', 'art-deco'] },
  { label: 'Type',  key: 'type',  values: ['jacket', 'pants', 'top', 'sweatshirt', 'swim', 'active', 'bag', 'hat'] },
]

function ShopGrid({ items }) {
  return (
    <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {items.map((p) => (
        <li key={p.slug}>
          <ProductCard
            to={`/shop/${p.slug}`}
            src={p.image}
            label={p.name}
            name={p.name}
            price={formatPrice(p.price, p.currency)}
            sizes={p.sizes}
            color={p.print}
          />
        </li>
      ))}
    </ul>
  )
}

export default function Shop() {
  usePageTitle(`${BRAND.name} — Shop`)
  const products = podProducts()

  return (
    <main className="bg-surface-primary pb-24">
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <img
          src={ACImages.hero}
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
            eyebrow="All-over print"
            title="Shop."
            subline="Print-on-demand pieces drawn from earth, metal, and art-deco motifs. Made-to-order, shipped from our print partner, returnable if it doesn't sit right."
            className="items-center"
          />
        </SiteSection>
      </section>

      <SiteSection width="full" className="px-8 py-32">
        <ContentFilters
          items={products}
          title="Shop"
          totalCount={products.length}
          filterGroups={FILTER_GROUPS}
          searchKeys={['name', 'type', 'print']}
          renderItem={(filteredItems) => <ShopGrid items={filteredItems} />}
        />
      </SiteSection>
    </main>
  )
}
