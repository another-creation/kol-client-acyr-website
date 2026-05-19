import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '@ac/brand-data/config'
import Marquee from '../../components/site/Marquee'
import Testimonial from '../../components/site/Testimonial'
import FAQ from '../../components/site/FAQ'
import { CLIENTS } from '../../data/clients'
import Collection from '../../components/site/Collection'
import LookbookCarousel from '../../components/site/LookbookCarousel'
import DesignerVision from '../../components/site/DesignerVision'
import SupportCTA from '../../components/site/SupportCTA'
import HandmadeCard from '../../components/site/HandmadeCard'
import Newsletter from '../../components/site/Newsletter'

const FAQ_ITEMS = [
  { q: 'What is the difference between shop and atelier?', a: 'Shop pieces are print-on-demand — produced and shipped per order through our print partner. Atelier pieces are handmade by Ýr in Reykjavík, one at a time, by enquiry.' },
  { q: 'How long does a handmade piece take?', a: 'Most pieces are ready four to eight weeks from brief, depending on materials and the season. You get a window before anything is committed.' },
  { q: 'Can a handmade piece be made to my measurements?', a: 'Yes. Every atelier piece is cut to fit. Start with an email to yr@another-creation.xyz.' },
  { q: 'Where do you ship?', a: 'Worldwide. Shop orders ship via Printful with rates and delivery times calculated at checkout. Atelier pieces ship from Reykjavík and are quoted with the brief.' },
  { q: 'How do I care for the pieces?', a: 'Each garment ships with care notes. As a rule: cool wash, dry flat, iron gently. The handmade pieces are built to last — treat them that way and they will.' },
]

export default function ClientHome() {
  usePageTitle(`${BRAND.name} — the federation bridge platform`)

  return (
    <main>
      <section
        className="relative w-full min-h-[70vh] sm:min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: 'url(/brand/photoshoot/33a4402.jpg)' }}
      >
        <div className="text-center px-8 flex flex-col items-center gap-6">
          <span className="ac-helper-20 uppercase text-accent-primary" style={{ fontSize: 24, fontWeight: 600 }}>
            Another Creation
          </span>
          <h1 className="font-narrow uppercase font-medium text-[clamp(56px,8vw,96px)] leading-[1.05]">
            Timeless Quality Design
          </h1>
        </div>
      </section>

      <Marquee
        items={CLIENTS.map((c) => ({
          name: c.name,
          logo: (
            <c.Logo
              height={64}
              aria-label={c.name}
              className="opacity-[0.48] hover:opacity-100 transition-opacity duration-700"
            />
          ),
        }))}
      />

      <Collection />

      <LookbookCarousel />

      <Testimonial
        kicker={`${BRAND.name} positioning · Kolkrabbi · Stardate 2026`}
        quote="Strong, trustworthy, elegant — yet flexible enough to counter the rigid nature of sovereign institutions."
        cite="Brand positioning, Kolkrabbi"
      />

      <DesignerVision />

      <SupportCTA />

      <HandmadeCard />

      <Newsletter />

      <FAQ
        kicker="Frequently asked"
        title="Before you order."
        items={FAQ_ITEMS}
      />
    </main>
  )
}
