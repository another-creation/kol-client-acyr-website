import usePageTitle from '../../components/hooks/usePageTitle'
import KolLogo from '@ac/brand-data/logos/KolLogo'
import { BRAND } from '@ac/brand-data/config'
import { BRAND_INFO } from '@ac/brand-data/info'
import SecondaryPageShell from '../../components/site/SecondaryPageShell'
import Table from '../../components/organisms/Table'

const SWATCHES = [
  { name: 'Burgundy 200', hex: '#750E20', role: 'Brand primary' },
  { name: 'Burgundy 300', hex: '#5A0816', role: 'Brand secondary ink' },
  { name: 'Cream 100',    hex: '#FBF7EE', role: 'Surface' },
  { name: 'Cream 300',    hex: '#F2E5CB', role: 'Champagne' },
]

const LOGOS = [
  { variant: 'logomark',    height: 44 },
  { variant: 'wordmark',    height: 24 },
  { variant: 'lockup-hori', height: 28 },
  { variant: 'lockup-vert', height: 52 },
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
      <div className="not-prose my-8">
        <Table
          columns={[
            { accessor: 'preview', header: 'Preview', style: { minWidth: 220 }, render: (row) => <KolLogo variant={row.variant} height={row.height} /> },
            { accessor: 'name', header: 'Name', render: (row) => row.variant.replace(/-/g, ' / ') },
            { accessor: 'path', header: 'Path', className: 'ac-table-cell-meta', render: (row) => <code>svg/{row.variant}.svg</code> },
          ]}
          rows={LOGOS.map((l) => ({ id: l.variant, ...l }))}
        />
      </div>

      <h2>Palette</h2>
      <p>Burgundy and cream — anchored. Greyscale carries structure; brand colour is applied with restraint.</p>
      <div className="grid gap-1 grid-cols-[repeat(auto-fit,minmax(100px,1fr))] my-8 not-prose">
        {SWATCHES.map((s) => (
          <div key={s.name} className="flex flex-col gap-1.5">
            <div className="h-24 rounded-[4px] border border-fg-08" style={{ background: s.hex }} />
            <div className="ac-helper-10 flex flex-row flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className="text-meta">{s.name}</span>
              <span className="text-strong font-semibold">{s.hex}</span>
            </div>
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
