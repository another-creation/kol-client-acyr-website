/**
 * SiteSection — page section wrapper with a named max-width.
 *
 * Standardises the website's section widths to a 5-stop scale.
 * Replaces the prior drift of max-w-3xl / 4xl / 5xl / 6xl / [1200px]
 * scattered across pages with no internal logic.
 *
 * Widths:
 *   narrow  — max-w-3xl  (768px)  — reading width: legal, forms, prose body
 *   reading — max-w-4xl  (896px)  — editorial lists with thumbs: journal, articles
 *   wide    — max-w-5xl  (1024px) — content + media mix: collections, brand
 *   grid    — max-w-6xl  (1152px) — product / content grids
 *   panel   — max-w-[1200px]      — section-spanning panels (FAQ, testimonial)
 *   full    — no max-width        — section grows to viewport
 *
 * Always centers with mx-auto. Horizontal + vertical padding stays at the
 * call site via className (some pages need asymmetric pt-20 / pb-24 / etc.).
 *
 * Props:
 *   width     — 'narrow' | 'wide' | 'grid' | 'panel' | 'full'. Default 'narrow'.
 *   as        — element tag (default 'section')
 *   className — extra classes (padding, layout, bg, etc.)
 *   children
 */
const WIDTH_MAP = {
  narrow:  'max-w-3xl',
  reading: 'max-w-4xl',
  wide:    'max-w-5xl',
  grid:    'max-w-6xl',
  panel:   'max-w-[1200px]',
  full:    '',
}

export default function SiteSection({
  width = 'narrow',
  as: Tag = 'section',
  className = '',
  children,
  ...rest
}) {
  const widthCls = WIDTH_MAP[width] ?? WIDTH_MAP.narrow
  return (
    <Tag className={`${widthCls} mx-auto ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  )
}
