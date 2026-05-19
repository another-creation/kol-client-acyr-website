import Icon from '../loaders/icons/Icon'

/**
 * CarouselArrow — circular nav button for image carousels + lightbox.
 *
 * Shape only — visual primitive. Consumer controls positioning + visibility
 * (absolute placement, hover-reveal vs always-on) via `className`.
 *
 * Used by: LookbookCarousel (home), Gallery lightbox (styleguide). Any new
 * carousel in either app should reach for this, not roll its own.
 */
export default function CarouselArrow({
  direction = 'right',
  onClick,
  disabled = false,
  className = '',
  ariaLabel,
}) {
  const isLeft   = direction === 'left'
  const iconName = isLeft ? 'chevron-left' : 'chevron-right'
  return (
    <button
      type="button"
      aria-label={ariaLabel ?? (isLeft ? 'Previous' : 'Next')}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-fg-12 hover:bg-fg-24 text-emphasis transition-opacity duration-300 disabled:opacity-30 ${className}`.trim()}
    >
      <Icon name={iconName} size={20} />
    </button>
  )
}
