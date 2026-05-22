import Divider from '../atoms/Divider'

/**
 * SectionOpener — eyebrow + optional title + optional subline + optional
 * children, with two layout variants.
 *
 * Single source of truth for mid-section opener spacing. Replaces ad-hoc
 * `<p className="site-eyebrow-section"> + <Divider /> + content` sibling
 * sequences across the site.
 *
 * Props:
 *   layout    — 'stacked' (default) | 'split'.
 *                 stacked: heading block above children, optional divider between.
 *                 split:   heading block in left column (1fr), children in right
 *                          column (2fr). For wide-canvas surfaces where heading
 *                          sits beside content (like the Home FAQ pattern).
 *   eyebrow   — string. Renders as .site-eyebrow-section.
 *   title     — string. Optional. Renders as .site-title-section h2.
 *   subline   — string. Optional. Renders as .site-subline-hero.
 *   divider   — boolean. Optional. Adds a Divider after the heading block.
 *                 stacked layout only; ignored in split.
 *   className — outer wrapper passthrough (positioning, padding).
 *   children  — section content.
 *
 * Internal spacing (do NOT add mb-N / mt-N at the call site — adjust here):
 *   stacked:
 *     - gap-2 between eyebrow / title / subline (heading block, tight)
 *     - mt-6 on Divider (24px from heading)
 *     - mt-8 on children (32px from heading or divider)
 *   split:
 *     - gap-8 (md: gap-12) between heading column and content column
 *     - gap-2 between eyebrow / title / subline (heading block, tight)
 *     - stacks to single column on small viewports
 */
export default function SectionOpener({
  layout = 'stacked',
  eyebrow,
  title,
  subline,
  divider = false,
  className = '',
  children,
}) {
  const Header = (
    <div className="flex flex-col gap-2">
      {eyebrow && <p className="site-eyebrow-section">{eyebrow}</p>}
      {title && <h2 className="site-title-section">{title}</h2>}
      {subline && <p className="site-subline-hero">{subline}</p>}
    </div>
  )

  if (layout === 'split') {
    return (
      <div className={`grid gap-8 md:gap-12 md:grid-cols-[1fr_2fr] ${className}`.trim()}>
        {Header}
        <div>{children}</div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col ${className}`.trim()}>
      {Header}
      {divider && <Divider className="mt-6" />}
      {children && <div className="mt-8">{children}</div>}
    </div>
  )
}
