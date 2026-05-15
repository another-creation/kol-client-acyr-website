import { Link } from 'react-router-dom'
import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '../../brand/config'
import { BRAND_INFO } from '../../brand/data/info'
import { ACImages } from '../../brand/data/images'
import ContentFilters from '../../components/molecules/ContentFilters'
import { podProducts, formatPrice } from '../../brand/data/shop-data'
import ProductCard from '../../components/site/ProductCard'

const FILTER_GROUPS = [
  { label: 'Print', key: 'print', values: ['earth', 'metal', 'art-deco'] },
  { label: 'Type',  key: 'type',  values: ['jacket', 'pants', 'top', 'sweatshirt', 'swim', 'active', 'bag', 'hat'] },
]

function ShopGrid({ items }) {
  return (
    <ul className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
      <section className="relative w-full h-[60dvh] overflow-hidden">
        <img
          src={ACImages.hero}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, color-mix(in srgb, var(--kol-surface-primary) 30%, transparent), color-mix(in srgb, var(--kol-surface-primary) 30%, transparent), var(--kol-surface-primary))' }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-8">
            <p className="kol-prose-label">All-over print</p>
            <h1 className="kol-prose-display">Shop</h1>
            <p className="kol-prose-tagline" style={{ marginTop: '8px' }}>{BRAND_INFO.labels.manifesto}</p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-8 pt-16">
        <ContentFilters
          items={products}
          title="Shop"
          totalCount={products.length}
          filterGroups={FILTER_GROUPS}
          searchKeys={['name', 'type', 'print']}
          renderItem={(filteredItems) => <ShopGrid items={filteredItems} />}
        />
      </section>
    </main>
  )
}
