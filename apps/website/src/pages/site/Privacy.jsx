import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '@ac/brand-data/config'
import { BRAND_INFO } from '@ac/brand-data/info'
import SecondaryPageShell from '../../components/site/SecondaryPageShell'

export default function Privacy() {
  usePageTitle(`Privacy · ${BRAND.name}`)

  return (
    <SecondaryPageShell
      eyebrow="Legal"
      title="Privacy policy"
      subline={`Effective ${new Date().toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' })}`}
    >
      <p>This is a placeholder template. Replace the specifics with the studio's actual policy before going live. {BRAND_INFO.legal.entity} is the data controller for personal information collected through this website.</p>

      <h2>What we collect</h2>
      <p>We collect only the information you give us directly: name, email, shipping address, and payment information at checkout. We do not buy or sell mailing lists.</p>

      <h2>How we use it</h2>
      <ul>
        <li>To fulfil orders you place and contact you about them.</li>
        <li>To send you our newsletter, only if you have opted in. You can unsubscribe at any time from any newsletter footer.</li>
        <li>To improve the site through aggregated, anonymous analytics.</li>
      </ul>

      <h2>Cookies</h2>
      <p>We use a small number of cookies for session, cart, and analytics. You can disable them in your browser without breaking the site, except cart functions during checkout.</p>

      <h2>Third-party services</h2>
      <p>Our checkout, fulfilment, and analytics rely on third-party providers who only receive the information they need to do their job. They are bound by their own privacy policies.</p>

      <h2>Your rights</h2>
      <p>Under the GDPR (Iceland is in the EEA) you have the right to access, correct, delete, or export your personal data, and to withdraw consent for processing. Write to <a href={`mailto:${BRAND_INFO.contact.email}`}>{BRAND_INFO.contact.email}</a> and we will respond within 30 days.</p>

      <h2>Retention</h2>
      <p>We keep order records for the period required by Icelandic tax and consumer-protection law (currently seven years). Newsletter subscriptions are kept until you unsubscribe.</p>

      <h2>Contact</h2>
      <p>{BRAND_INFO.legal.entity} · {BRAND_INFO.studio.street}, {BRAND_INFO.studio.postcode}, {BRAND_INFO.studio.country} · <a href={`mailto:${BRAND_INFO.contact.email}`}>{BRAND_INFO.contact.email}</a></p>
    </SecondaryPageShell>
  )
}
