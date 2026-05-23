import { useRef } from 'react'
import Icon from '../loaders/icons/Icon'
import useReveal from '../../hooks/useReveal'

/**
 * FAQ — collapsible Q/A list using native <details name> for exclusive open.
 *
 * Two layouts:
 *   - `split` (default) — full section: 2-col grid with kicker+title on left,
 *     items on right, locked at h-[1000px]. For top-level FAQ sections (Home).
 *   - `stacked` — no container, just renders the items list (and optional
 *     kicker+title above). Parent owns the section wrapper. For in-page
 *     FAQ sections (Handmade).
 */
export default function FAQ({ kicker, title, items = [], layout = 'split' }) {
  const itemsRef = useRef(null)
  useReveal(itemsRef, { y: 14, duration: 0.45, stagger: 0.05, ease: 'power2.out' })

  const Header = (kicker || title) ? (
    <div className="flex flex-col gap-4">
      {kicker && <span className="site-eyebrow-section">{kicker}</span>}
      {title && <h2 className="site-title-section m-0">{title}</h2>}
    </div>
  ) : null

  const Items = (
    <div ref={itemsRef} className="flex flex-col">
      {items.map((item, i) => (
        <details
          key={i}
          name="faq"
          data-reveal
          className="group border-t border-fg-08 first:border-t-0"
        >
          <summary className="flex items-center justify-between gap-4 py-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden site-title-row">
            <span>{item.q}</span>
            <span
              aria-hidden="true"
              className="ac-btn ac-btn-ghost w-7 h-7 shrink-0 rounded-full! transition-transform duration-200 group-open:rotate-45"
            >
              <Icon name="plus" size={12} />
            </span>
          </summary>
          <div className="ac-prose pb-6">
            {item.a}
          </div>
        </details>
      ))}
    </div>
  )

  if (layout === 'stacked') {
    return (
      <>
        {Header}
        {Items}
      </>
    )
  }

  return (
    <section className="bg-surface-primary text-on-primary px-8 h-[1000px] overflow-hidden flex items-center">
      <div className="max-w-[1200px] w-full mx-auto grid gap-8 md:gap-12 md:grid-cols-[1fr_2fr]">
        {Header}
        {Items}
      </div>
    </section>
  )
}
