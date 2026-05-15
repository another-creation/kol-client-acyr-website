/**
 * Badge — status / categorization indicator
 *
 * Converted from Badge.tsx (shadcn/CVA) → plain JSX with kol- CSS variables.
 * CSS classes live in components.css under 2-LABELS → Badges.
 */

const VARIANT_MAP = {
  default: 'kol-badge-default',
  secondary: 'kol-badge-secondary',
  destructive: 'kol-badge-destructive',
  outline: 'kol-badge-outline',
  success: 'kol-badge-success',
  warning: 'kol-badge-warning',
  critical: 'kol-badge-critical',
  info: 'kol-badge-info'
}

const SIZE_MAP = {
  sm: 'kol-badge-sm',
  md: 'kol-badge-md',
  lg: 'kol-badge-lg'
}

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const variantClass = VARIANT_MAP[variant] || VARIANT_MAP.default
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md

  return (
    <div
      className={`kol-badge ${variantClass} ${sizeClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </div>
  )
}

export default Badge
