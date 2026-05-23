import { useRef } from 'react'
import useSplitReveal from '../../hooks/useSplitReveal'
import useReveal from '../../hooks/useReveal'

/**
 * PageHero — top-of-page opening: eyebrow + title + (optional) subline.
 *
 * Used on every page's main hero (marketing pages, secondary pages, detail
 * pages). Mid-section openers DON'T use this — they have their own
 * .site-eyebrow-section + .site-title-section roles.
 *
 * Entry animation (Phase 1 of animation roadmap):
 *   - eyebrow + subline: fade-up via useReveal, staggered so eyebrow lands
 *     first and subline last
 *   - title: per-character reveal via useSplitReveal, starts after eyebrow
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

  const containerRef = useRef(null)
  const titleRef = useRef(null)

  // Snappy entrance — eyebrow, title chars, subline all land quickly.
  useReveal(containerRef, { y: 12, duration: 0.4, delay: 0, stagger: 0.08, ease: 'power2.out' })
  useSplitReveal(titleRef, { delay: 0.08, duration: 0.5, stagger: 0.018, y: 12 })

  return (
    <div ref={containerRef} className={`flex flex-col ${gap} ${className}`.trim()}>
      {eyebrow && <p data-reveal className={eyebrowClass}>{eyebrow}</p>}
      {title && <h1 ref={titleRef} className={titleClass}>{title}</h1>}
      {subline && <p data-reveal className={sublineClass}>{subline}</p>}
    </div>
  )
}
