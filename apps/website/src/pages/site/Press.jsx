import usePageTitle from '../../components/hooks/usePageTitle'
import { BRAND } from '@ac/brand-data/config'
import { BRAND_INFO } from '@ac/brand-data/info'
import SecondaryPageShell from '../../components/site/SecondaryPageShell'

export default function Press() {
  usePageTitle(`Press · ${BRAND.name}`)

  return (
    <SecondaryPageShell
      eyebrow="Press"
      title="Press"
      subline="For journalists, editors, and writers."
    >
      <h2>About</h2>
      <p>Another Creation is a womenswear label founded in Reykjavík in 2013 by Ýr Þrastardóttir. Garments are made by hand in small numbers — cut and stitched in the studio, sourced and finished to last.</p>

      <h2>Quick facts</h2>
      <ul>
        <li><strong>Founded:</strong> {BRAND_INFO.identity.established}, Reykjavík</li>
        <li><strong>Designer:</strong> {BRAND_INFO.identity.founder}</li>
        <li><strong>Studio:</strong> {BRAND_INFO.studio.street}, {BRAND_INFO.studio.postcode}, {BRAND_INFO.studio.country}</li>
        <li><strong>Legal entity:</strong> {BRAND_INFO.legal.entity} · kt {BRAND_INFO.legal.kt}</li>
      </ul>

      <h2>Press contact</h2>
      <p>
        <a href={`mailto:${BRAND_INFO.contact.press}`}>{BRAND_INFO.contact.press}</a><br />
        {BRAND_INFO.contact.phone}
      </p>

      <h2>Press kit</h2>
      <p>For high-resolution imagery, logos, the slide deck (vector PDF, in progress), and the longer designer bio, write to <a href={`mailto:${BRAND_INFO.contact.press}`}>{BRAND_INFO.contact.press}</a>. Most requests turn around within 48 hours.</p>

      <h2>Brand assets</h2>
      <p>Logos, palette, and typeface are summarised at <a href="/brand">/brand</a>.</p>
    </SecondaryPageShell>
  )
}
