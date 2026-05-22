import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '@ac/brand-data/config'
import { BRAND_INFO } from '@ac/brand-data/info'
import Divider from '../../components/atoms/Divider'
import PageHero from '../../components/site/PageHero'
import SiteSection from '../../components/site/SiteSection'
import EnquiryForm from '../../components/site/EnquiryForm'

const SUBJECTS = [
  { value: 'general',       label: 'General enquiry' },
  { value: 'order',         label: 'Order or shipping' },
  { value: 'made-to-order', label: 'Made-to-order / fitting' },
  { value: 'press',         label: 'Press / interview' },
  { value: 'wholesale',     label: 'Stockist / wholesale' },
]

export default function Contact() {
  usePageTitle(`Contact · ${BRAND.name}`)

  return (
    <main className="bg-surface-primary pb-24">
      <SiteSection className="px-8 pt-20">
        <PageHero
          eyebrow="Contact"
          title={<>Studio &amp; enquiries.</>}
          subline="For appointments, made-to-order fittings, press, or general enquiries — write directly. We answer within two business days."
          sublineKind="lede"
        />
      </SiteSection>

      <SiteSection className="px-8 pt-12 pb-12">
        <Divider />
        <div className="grid gap-8 sm:grid-cols-2 pt-8">
          <div>
            <p className="site-eyebrow-section">Studio</p>
            <div className="ac-prose">
              <p style={{ margin: '0 0 4px' }}><strong>{BRAND_INFO.studio.street}</strong></p>
              <p style={{ margin: '0 0 4px' }}>{BRAND_INFO.studio.postcode}</p>
              <p style={{ margin: 0 }}>{BRAND_INFO.studio.country}</p>
            </div>
          </div>
          <div>
            <p className="site-eyebrow-section">Hours</p>
            <div className="ac-prose">
              <p style={{ margin: '0 0 4px' }}>Mon–Fri 13:00–18:00</p>
              <p style={{ margin: 0 }}>Sat 13:00–16:00</p>
            </div>
          </div>
          <div>
            <p className="site-eyebrow-section">Direct</p>
            <div className="ac-prose">
              <p style={{ margin: '0 0 4px' }}>
                <a href={`mailto:${BRAND_INFO.contact.email}`}>{BRAND_INFO.contact.email}</a>
              </p>
              <p style={{ margin: 0 }}>{BRAND_INFO.contact.phone}</p>
            </div>
          </div>
          <div>
            <p className="site-eyebrow-section">Press</p>
            <div className="ac-prose">
              <p style={{ margin: 0 }}>
                <a href={`mailto:${BRAND_INFO.contact.press}?subject=${encodeURIComponent('[Press] Enquiry')}`}>{BRAND_INFO.contact.press}</a>
              </p>
            </div>
          </div>
        </div>
      </SiteSection>

      <SiteSection className="px-8 pb-24">
        <Divider />
        <p className="site-eyebrow-section" style={{ marginTop: '32px' }}>Write to us</p>
        <p className="site-tagline" style={{ marginTop: '4px' }}>
          The form opens your mail client with the message pre-filled.
        </p>

        <div className="mt-8">
          <EnquiryForm
            categories={SUBJECTS}
            defaultCategory="general"
          />
        </div>
      </SiteSection>
    </main>
  )
}
