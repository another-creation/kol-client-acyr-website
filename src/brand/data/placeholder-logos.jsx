/**
 * Placeholder brand logotypes — fictional marks for marquee/partner strips.
 * Each is a small SVG (mark + wordmark). `fill="currentColor"` so they inherit
 * the marquee's text color. Replace with real client logos when available.
 */

const common = {
  height: 48,
  fill: 'currentColor',
  xmlns: 'http://www.w3.org/2000/svg',
}

const wordmarkProps = {
  fontFamily: "'Right Grotesk', sans-serif",
  fontWeight: 700,
  fontSize: 22,
  letterSpacing: 0.5,
}

export const PlaceholderLumen = () => (
  <svg {...common} viewBox="0 0 140 32">
    <circle cx="12" cy="16" r="8" />
    <text x="30" y="23" {...wordmarkProps}>LUMEN</text>
  </svg>
)

export const PlaceholderNova = () => (
  <svg {...common} viewBox="0 0 130 32">
    <rect x="6" y="10" width="12" height="12" transform="rotate(45 12 16)" />
    <text x="30" y="23" {...wordmarkProps}>NOVA</text>
  </svg>
)

export const PlaceholderOrbit = () => (
  <svg {...common} viewBox="0 0 140 32">
    <circle cx="12" cy="16" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="16" r="3" />
    <text x="30" y="23" {...wordmarkProps}>ORBIT</text>
  </svg>
)

export const PlaceholderStrata = () => (
  <svg {...common} viewBox="0 0 145 32">
    <rect x="4" y="10" width="16" height="2" />
    <rect x="4" y="15" width="16" height="2" />
    <rect x="4" y="20" width="16" height="2" />
    <text x="30" y="23" {...wordmarkProps}>STRATA</text>
  </svg>
)

export const PlaceholderVector = () => (
  <svg {...common} viewBox="0 0 150 32">
    <path d="M4 22 L14 10 L24 22 L19 22 L14 16 L9 22 Z" />
    <text x="30" y="23" {...wordmarkProps}>VECTOR</text>
  </svg>
)

export const PlaceholderKernel = () => (
  <svg {...common} viewBox="0 0 150 32">
    <path d="M12 6 L20 10 L20 22 L12 26 L4 22 L4 10 Z" />
    <text x="30" y="23" {...wordmarkProps}>KERNEL</text>
  </svg>
)

export const PLACEHOLDER_LOGOS = [
  { name: 'Lumen',  logo: <PlaceholderLumen /> },
  { name: 'Nova',   logo: <PlaceholderNova /> },
  { name: 'Orbit',  logo: <PlaceholderOrbit /> },
  { name: 'Strata', logo: <PlaceholderStrata /> },
  { name: 'Vector', logo: <PlaceholderVector /> },
  { name: 'Kernel', logo: <PlaceholderKernel /> },
]
