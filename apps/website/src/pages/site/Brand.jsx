import usePageTitle from '../../components/hooks/usePageTitle'
import KolLogo from '@ac/brand-data/logos/KolLogo'
import { BRAND } from '@ac/brand-data/config'
import { BRAND_INFO } from '@ac/brand-data/info'
import SecondaryPageShell from '../../components/site/SecondaryPageShell'

const SWATCHES = [
  { name: 'Burgundy 200', hex: '#750E20', role: 'Brand primary' },
  { name: 'Burgundy 300', hex: '#5A0816', role: 'Brand secondary ink' },
  { name: 'Cream 100',    hex: '#FBF7EE', role: 'Surface' },
  { name: 'Cream 300',    hex: '#F2E5CB', role: 'Champagne' },
]

export default function Brand() {
  usePageTitle(`Brand · ${BRAND.name}`)

  return (
    <SecondaryPageShell
      eyebrow="Brand"
      title="Brand"
      subline="The mark, palette, and type — at a glance."
    >
      <p>Another Creation is a womenswear label from Reykjavík, founded in 2013 by Ýr Þrastardóttir. Garments are made by hand in small numbers. This page is the short version — full assets and the press kit are available on request.</p>

      <h2>The mark</h2>
      <p>A wordmark and a signature. Used alone, or together as a lockup.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 not-prose">
        <div className="aspect-square bg-fg-04 rounded flex items-center justify-center p-12">
          <KolLogo variant="logomark" className="max-h-full max-w-full" />
        </div>
        <div className="aspect-square bg-fg-04 rounded flex items-center justify-center p-12">
          <KolLogo variant="wordmark" className="max-h-full max-w-full" />
        </div>
      </div>

      <h2>Palette</h2>
      <p>Burgundy and cream — anchored. Greyscale carries structure; brand colour is applied with restraint.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-8 not-prose">
        {SWATCHES.map((s) => (
          <div key={s.name}>
            <div className="aspect-square rounded" style={{ backgroundColor: s.hex }} />
            <p className="site-meta-system text-emphasis mt-2">{s.name}</p>
            <p className="site-meta-system">{s.hex}</p>
            <p className="site-meta-system">{s.role}</p>
          </div>
        ))}
      </div>

      <h2>Type</h2>
      <p>Right Grotesk across the system — one family carrying display, headings, body, and labels through its cuts. Designed for editorial set, quiet by default.</p>

      <h2>Assets on request</h2>
      <p>For high-resolution logos, the asset register, or the press kit, write to <a href={`mailto:${BRAND_INFO.contact.press}`}>{BRAND_INFO.contact.press}</a>.</p>
    </SecondaryPageShell>
  )
}
