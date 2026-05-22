import BackLink from './BackLink'
import PageHero from './PageHero'

/**
 * SecondaryPageShell — wrapper for secondary pages (Privacy, Terms,
 * ShippingReturns, Brand, Press, future similar surfaces).
 *
 * Composes outer <main> + <section> + BackLink + PageHero + .ac-prose body.
 * Body content goes inside children (rendered inside .ac-prose).
 *
 * Props:
 *   backTo, backLabel — back link target + label (defaults: "/", "← Back")
 *   eyebrow, title, subline — passed to PageHero
 *   sublineKind — 'tagline' (default) | 'lede'
 *   children — body content (renders inside .ac-prose container)
 */
export default function SecondaryPageShell({
  backTo = '/',
  backLabel = '← Back',
  eyebrow,
  title,
  subline,
  sublineKind = 'tagline',
  children,
}) {
  return (
    <main className="bg-surface-primary pb-24">
      <section className="max-w-3xl mx-auto px-8 pt-20">
        <BackLink to={backTo} className="mb-8">{backLabel}</BackLink>

        <PageHero
          eyebrow={eyebrow}
          title={title}
          subline={subline}
          sublineKind={sublineKind}
        />

        <div className="ac-prose">
          {children}
        </div>
      </section>
    </main>
  )
}
