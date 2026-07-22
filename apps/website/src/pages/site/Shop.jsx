import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '@ac/brand-data/config'
import { ACImages } from '@ac/brand-data/images'
import { podProducts, formatPrice } from '../../data/shop-data'
import ProductCard from '../../components/site/ProductCard'
import CatalogHero from '../../components/site/CatalogHero'
import SiteSection from '../../components/site/SiteSection'
import Newsletter from '../../components/site/Newsletter'

export default function Shop() {
  usePageTitle(`${BRAND.name} — Shop`)
  const products = podProducts()

  return (
    <main className="bg-surface-primary">
      <CatalogHero
        image={ACImages.hero}
        eyebrow="All-over print"
        title="Shop."
        subline="Print-on-demand pieces drawn from earth, metal, and art-deco motifs. Made-to-order, shipped from our print partner, returnable if it doesn't sit right."
      />

      <SiteSection width="full" className="px-8 pb-32">
        <ul className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
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
      </SiteSection>

      <Newsletter />
    </main>
  )
}
