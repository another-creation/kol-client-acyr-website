/**
 * PageHero — top-of-page opening: eyebrow + title + (optional) subline.
 *
 * Used on every page's main hero (marketing pages, secondary pages, detail
 * pages). Mid-section openers DON'T use this — they have their own
 * .site-eyebrow-section + .site-title-section roles.
 *
 * Props:
 *   eyebrow         — small text above the title (optional)
 *   title           — h1 text (required)
 *   subline         — paragraph below the title (optional)
 *   variant         — 'marketing' (clamp 56-96 title) | 'secondary' (64 title). Default 'secondary'.
 *   eyebrowVariant  — 'standard' (Mono 12 fg-48) | 'display' (Mono 24 brand-accent). Default 'standard'.
 *   sublineKind     — 'lede' (Compact 24 sentence) | 'tagline' (Narrow 14 uppercase). Default tied to variant.
 *   className       — extra classes on the outer wrapper (e.g. text alignment)
 *
 * Internal layout: flex flex-col with gap-4 (lede subline) or gap-2 (tagline).
 * Parent owns positioning (section wrapper, max-width, text alignment etc.).
 */
export default function PageHero({
  eyebrow,
  title,
  subline,
  variant = 'secondary',
  eyebrowVariant = 'standard',
  sublineKind,
  className = '',
}) {
  const eyebrowClass = eyebrowVariant === 'display' ? 'site-display-eyebrow' : 'site-eyebrow-hero'
  const titleClass = variant === 'marketing' ? 'site-title-hero' : 'site-title-page'
  const resolvedSublineKind = sublineKind ?? (variant === 'marketing' ? 'lede' : 'tagline')
  const sublineClass = resolvedSublineKind === 'lede' ? 'site-subline-hero' : 'site-tagline'
  const gap = resolvedSublineKind === 'lede' ? 'gap-4' : 'gap-2'

  return (
    <div className={`flex flex-col ${gap} ${className}`.trim()}>
      {eyebrow && <p className={eyebrowClass}>{eyebrow}</p>}
      {title && <h1 className={titleClass}>{title}</h1>}
      {subline && <p className={sublineClass}>{subline}</p>}
    </div>
  )
}
