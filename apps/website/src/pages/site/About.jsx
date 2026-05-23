import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '@ac/brand-data/config'
import { BRAND_INFO } from '@ac/brand-data/info'
import Divider from '../../components/atoms/Divider'
import Carousel from '../../components/primitives/Carousel'
import PageHero from '../../components/site/PageHero'
import SiteSection from '../../components/site/SiteSection'

const HERO   = '/brand/yr/acyr-01.jpg'
const SECOND = '/brand/yr/acyr-06.jpg'

const STORY_GALLERY = [
  '/brand/mood/image-44.jpeg',
  '/brand/mood/image-40.jpeg',
  '/brand/yr/acyr-05.jpg',
  '/brand/mood/image-23.jpeg',
  '/brand/mood/image-16.jpeg',
  '/brand/yr/acyr-07.jpg',
  '/brand/mood/image-29.jpeg',
  '/brand/mood/image-5.jpeg',
  '/brand/yr/acyr-21.jpg',
]

export default function About() {
  usePageTitle(`About · ${BRAND.name}`)

  return (
    <main className="bg-surface-primary pb-24">
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <img
          src={HERO}
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
            eyebrow="About"
            title={`${BRAND.name}.`}
            subline={`Founded in Reykjavík in 2013 by ${BRAND_INFO.identity.founder} — clothing made by hand, in small numbers, for the independent woman.`}
            className="items-center"
          />
        </SiteSection>
      </section>

      <SiteSection width="wide" className="px-8 pt-12 pb-12">
        <Divider />

        <div className="grid md:grid-cols-2 gap-12 items-center pt-8">
          <figure className="m-0">
            <img
              src={SECOND}
              alt={`${BRAND_INFO.identity.founder} — ${BRAND_INFO.identity.role}`}
              className="block w-full h-auto rounded-sm"
              loading="lazy"
            />
            <figcaption className="site-meta-editorial mt-3">
              {BRAND_INFO.identity.founder} · {BRAND_INFO.identity.role}
            </figcaption>
          </figure>

          <div className="ac-prose">
            <h2>Designer's vision</h2>
            <p>
              Ýr is committed to breaking the cycle of overproduction and material waste in the fashion industry. With a deep understanding of the environmental impact of fast fashion, Ýr is driven by the belief that sustainable practices are not only necessary but also achievable without compromising on style or functionality. Another Creation is more than just a fashion brand; it's a movement toward conscious consumption and responsible production.
            </p>
            <p>
              Drawing inspiration from nature's resilience and beauty, Ýr seeks to create garments that not only reflect cutting-edge design techniques but also prioritize sustainability at every step of the production process.
            </p>
          </div>
        </div>
      </SiteSection>

      <SiteSection className="px-8">
        <div className="ac-prose">
          <h2>Ýr Þrastardóttir — creator of Another Creation</h2>
          <p>
            {BRAND_INFO.identity.founder} is the founder of Another Creation, a fashion label she has been working on since 2013. She graduated with a BA in fashion design from the Icelandic Academy of the Arts in 2010 and has been working on her own labels since then.
          </p>
          <p>
            The concept of Another Creation is to make beautiful and functional clothes that empower the independent woman. The Icelandic culture has a long history of strong females throughout the centuries and Another Creation puts the concept into modern times.
          </p>
          <p>
            Along with her work for Another Creation, she has been custom designing for film, concerts and television in Iceland. She makes custom-made dresses and coats through Another Creation.
          </p>
          <p>
            She was selected from her graduating class to participate on behalf of Iceland in Designer's Nest during Copenhagen Fashion Week in 2011, which launched her into manufacturing her own collection sold in Kiosk, an Icelandic designer store. Ýr has been selected four times to participate at the Reykjavík Fashion Festival — in 2011, 2012, 2015 and 2017. She has also participated in numerous group exhibitions and worked in film, theatre and with the Icelandic Dance Company.
          </p>
          <p>
            In 2013 she founded Another Creation. The company was selected from 200 applicants to participate in StartupReykjavík, a mentor-driven seed stage investment program. Following the startup, Another Creation was chosen to participate in the Creative Business Cup in autumn 2013 and received special awards for outstanding combination of creative power and commercial know-how.
          </p>
        </div>
      </SiteSection>

      <section className="pt-16">
        <SiteSection as="div" className="px-8 mb-12">
          <Divider />
        </SiteSection>
        <Carousel
          className="[&_.ac-embla-container]:!gap-0 [&_.ac-embla-slide]:!w-[clamp(200px,70vw,300px)] [&_.ac-embla-slide]:!h-[clamp(280px,90vw,400px)]"
          options={{ align: 'start', loop: false, dragFree: true, containScroll: 'trimSnaps' }}
        >
          {STORY_GALLERY.map((src) => (
            <img
              key={src}
              src={src}
              alt=""
              className="block w-full h-full object-cover"
              loading="lazy"
            />
          ))}
        </Carousel>
      </section>
    </main>
  )
}
