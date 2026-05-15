import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '../../brand/config'
import FeatureSplit from '../../components/site/FeatureSplit'
import Marquee from '../../components/site/Marquee'
import Testimonial from '../../components/site/Testimonial'
import FAQ from '../../components/site/FAQ'
import { PLACEHOLDER_LOGOS } from '../../brand/data/placeholder-logos'
import Collection from '../../components/site/Collection'
import LookbookCarousel from '../../components/site/LookbookCarousel'
import DesignerVision from '../../components/site/DesignerVision'
import SupportCTA from '../../components/site/SupportCTA'
import HandmadeCard from '../../components/site/HandmadeCard'
import Newsletter from '../../components/site/Newsletter'

const FAQ_ITEMS = [
  { q: 'What does Acme ship?',      a: 'A federated bridge-command platform — telemetry, virtual bridges, role-aware consoles, and a shared operating model across six vessels.' },
  { q: 'How long does commissioning take?', a: 'Days, not quarters. We\'ve migrated sector registries in a single fiscal quarter with zero transmissions lost.' },
  { q: 'Is Acme sovereign-ready?',  a: 'Yes. Deploy on the infrastructure your command controls — on-premise, sector cloud, or a sovereign region of a commercial provider.' },
  { q: 'Can we run just the flagship?', a: 'Yes. Each vessel is shippable on its own. Allied commands start with what they need and grow into the rest.' },
  { q: 'What does an audit trail look like?', a: 'Every transmission, view, and order generates an immutable, signed audit line — retained for the full statutory window.' },
]

export default function ClientHome() {
  usePageTitle(`${BRAND.name} — the federation bridge platform`)

  return (
    <main>
      <FeatureSplit
        className="min-h-[70vh] sm:min-h-screen flex items-center"
        innerClassName="max-w-none !flex flex-1 justify-center text-center"
        columnClassName="!max-w-none items-center"
        bgImage="/brand/photoshoot/33a4402.jpg"
        kicker={<span className="font-display text-[var(--burgundy-100)]">Another Creation</span>}
        title={<span className="uppercase text-[clamp(56px,8vw,96px)] font-['Right_Grotesk_Narrow'] font-medium">Timeless Quality Design</span>}
      />

      <Marquee items={PLACEHOLDER_LOGOS} />

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
        kicker="Ship's log"
        title="Transmissions from the bridge."
        items={FAQ_ITEMS}
      />
    </main>
  )
}
