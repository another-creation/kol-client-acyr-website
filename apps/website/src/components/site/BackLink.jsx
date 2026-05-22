import { Link } from 'react-router-dom'

/**
 * BackLink — "← Back" / "← Back to journal" / etc. Mono uppercase chrome link.
 * Used at the top of secondary pages and in 404 states.
 *
 * Styling lives in .site-back-link (apps/website/src/styles/site-typography.css).
 * Consumer passes a Tailwind margin utility (e.g. mb-8) if spacing is needed.
 */
export default function BackLink({ to, children, className = '' }) {
  return (
    <Link to={to} className={`site-back-link ${className}`.trim()}>
      {children}
    </Link>
  )
}
