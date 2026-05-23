import PageHero from './PageHero'

/**
 * SecondaryPageShell — wrapper for secondary pages (Privacy, Terms,
 * ShippingReturns, Brand, Press, future similar surfaces).
 *
 * Composes outer <main> + <section> + PageHero + .ac-prose body. Navigation
 * is handled by the fixed nav, so there's no back link.
 *
 * Props:
 *   eyebrow, title, subline — passed to PageHero
 *   sublineKind — 'tagline' (default) | 'lede'
 *   children — body content (renders inside .ac-prose container)
 */
export default function SecondaryPageShell({
  eyebrow,
  title,
  subline,
  sublineKind = 'tagline',
  children,
}) {
  return (
    <main className="bg-surface-primary pb-24">
      <section className="max-w-3xl mx-auto px-8 pt-20">
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
