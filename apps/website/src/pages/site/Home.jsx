import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '@ac/brand-data/config'
import Testimonial from '../../components/site/Testimonial'
import FAQ from '../../components/site/FAQ'
import Collection from '../../components/site/Collection'
import CollectionCarousel from '../../components/site/CollectionCarousel'
import DesignerVision from '../../components/site/DesignerVision'
import Newsletter from '../../components/site/Newsletter'
import PageHero from '../../components/site/PageHero'

const FAQ_ITEMS = [
  { q: 'What is the difference between shop and atelier?', a: 'Shop pieces are print-on-demand — produced and shipped per order through our print partner. Atelier pieces are handmade by Ýr in Reykjavík, one at a time, by enquiry.' },
  { q: 'How long does a handmade piece take?', a: 'Most pieces are ready four to eight weeks from brief, depending on materials and the season. You get a window before anything is committed.' },
  { q: 'Can a handmade piece be made to my measurements?', a: 'Yes. Every atelier piece is cut to fit. Start with an email to yr@another-creation.xyz.' },
  { q: 'Where do you ship?', a: 'Worldwide. Shop orders ship via Printful with rates and delivery times calculated at checkout. Atelier pieces ship from Reykjavík and are quoted with the brief.' },
  { q: 'How do I care for the pieces?', a: 'Each garment ships with care notes. As a rule: cool wash, dry flat, iron gently. The handmade pieces are built to last — treat them that way and they will.' },
]

export default function ClientHome() {
  usePageTitle(BRAND.name)

  return (
    <main>
      <section
        className="relative w-full min-h-[70vh] sm:min-h-[calc(100svh-var(--ac-topnav-h))] flex items-center justify-center bg-cover bg-top"
        style={{ backgroundImage: 'url(/brand/shop/set/set-01.jpg)' }}
      >
        <div className="home-hero text-center px-8 items-center">
          <PageHero
            title="TIMELESS QUALITY DESIGN"
            variant="marketing"
            /* 1.6× .site-title-hero's clamp(56px, 9vw, 128px). Scoped here, not on
               the role — 5 other pages share it. ! because the role is unlayered. */
            className="items-center gap-6 [&_h1]:text-[clamp(90px,14.4vw,205px)]!"
          />
        </div>
      </section>

      {/* image-only panel — no copy, no actions */}
      <section
        className="w-full h-screen md:h-[300vh] bg-cover bg-center"
        style={{ backgroundImage: 'url(/brand/shop/set/set-02.jpg)' }}
        aria-hidden="true"
      />

      <Collection />

      <DesignerVision />

      <Testimonial
        quote="Every piece begins with a single question: what does a woman truly need? Not trend, not noise — but a garment that becomes part of her story. Crafted by hand from the finest materials, each design is made to age beautifully and last a lifetime."
        cite="Ýr Þrastardóttir"
      />

      <Newsletter />

      <CollectionCarousel />

      <FAQ
        kicker="Frequently asked"
        title="Before you order."
        items={FAQ_ITEMS}
      />
    </main>
  )
}
