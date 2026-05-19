import ProductCard from './ProductCard'
import { PRODUCTS, formatPrice } from '../../data/shop-data'

export default function Collection() {
  const featured = PRODUCTS.filter((p) => p.featured).slice(0, 8)

  return (
    <section className="bg-surface-primary px-8 py-12">
      <div className="flex items-baseline justify-between mb-10">
        <h2 className="ac-sans-heading-06 uppercase text-emphasis">Collection</h2>
        <span className="ac-sans-heading-06 uppercase text-meta">SS 2026</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 h-[110vh]">
        {featured.map((p) => (
          <ProductCard
            key={p.slug}
            to={p.kind === 'pod' ? `/shop/${p.slug}` : `/handmade/${p.slug}`}
            src={p.image}
            name={p.name}
            price={formatPrice(p.price, p.currency)}
            overlay={false}
            fill
          />
        ))}
      </div>
    </section>
  )
}
