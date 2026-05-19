import BrandHero from '../components/framework/BrandHero'
import PageSection from '../components/framework/PageSection'
import Button from '@components/atoms/Button'
import usePageTitle from '../components/hooks/usePageTitle'

const VARIANTS = ['primary', 'secondary', 'accent', 'outline', 'ghost']
const SIZES    = ['sm', 'md', 'lg']

export default function Demo() {
  usePageTitle('Demo')

  return (
    <>
      <BrandHero
        label="demo · unlisted"
        title="Button"
        lede="Four variants share the same padding scale as .ac-control (sm 4/12 · md 6/16 · lg 8/20). Heavier-background variants (secondary, accent) use font-weight 500 for ink punch; primary and outline stay at the ac-mono default 400."
      />

      <PageSection id="variants" label="01 — variants × sizes" title="Variants × sizes">
        <div
          className="grid items-center gap-4"
          style={{ gridTemplateColumns: 'max-content repeat(3, auto) 1fr' }}
        >
          {VARIANTS.map((variant) => (
            <div key={variant} className="contents">
              <p className="ac-helper-12 uppercase text-meta">{variant}</p>
              {SIZES.map((size) => (
                <div key={size} className="flex">
                  <Button variant={variant} size={size}>
                    {variant.charAt(0).toUpperCase() + variant.slice(1)} {size}
                  </Button>
                </div>
              ))}
              <span aria-hidden="true" />
            </div>
          ))}
        </div>
      </PageSection>

      <PageSection
        id="with-icons"
        label="02 — with icons"
        title="With icons"
        body="iconLeft / iconRight render alongside the label at full opacity — icons are co-equal content with the text, not affordances."
      >
        <div className="flex flex-wrap gap-3 items-center">
          <Button variant="primary"   size="md" iconLeft="plus">Add layer</Button>
          <Button variant="secondary" size="md" iconLeft="check">Confirmed</Button>
          <Button variant="accent"    size="md" iconRight="arrow-right">Continue</Button>
          <Button variant="outline"   size="md" iconRight="arrow-right">Read more</Button>
        </div>
      </PageSection>

      <PageSection
        id="icon-only"
        label="03 — icon only"
        title="Icon only"
        body="iconOnly drops the label entirely — the icon IS the action. Full opacity. Pass aria-label for accessibility."
      >
        <div className="flex flex-wrap gap-3 items-center">
          <Button variant="primary"   size="md" iconOnly="plus"        aria-label="Add" />
          <Button variant="secondary" size="md" iconOnly="check"       aria-label="Confirm" />
          <Button variant="accent"    size="md" iconOnly="search"      aria-label="Search" />
          <Button variant="outline"   size="md" iconOnly="arrow-right" aria-label="Next" />
          <Button variant="ghost"     size="md" iconOnly="x"           aria-label="Close" />
        </div>
      </PageSection>

      <PageSection
        id="on-dark"
        label='04 — on dark (data-theme="dark" scope)'
        title="On dark scope"
        body='When buttons live inside a forced-dark region (e.g. a #000 overlay on a card), wrap the region in data-theme="dark" so the DS tokens redeclare and variants behave correctly regardless of the page&apos;s theme.'
      >
        <div
          data-theme="dark"
          className="p-8 flex flex-wrap gap-3 items-center rounded-[4px]"
          style={{ background: '#000' }}
        >
          <Button variant="primary"   size="md">Primary</Button>
          <Button variant="secondary" size="md">Secondary</Button>
          <Button variant="accent"    size="md">Accent</Button>
          <Button variant="outline"   size="md">Outline</Button>
        </div>
      </PageSection>
    </>
  )
}
