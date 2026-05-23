/**
 * GSAP entry point.
 *
 * Single import surface for the project — every consumer does:
 *   import { gsap, ScrollTrigger } from '@/lib/gsap'
 *
 * Registers ScrollTrigger once at module load. Side-effect-free otherwise.
 */

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/** True when the user prefers reduced motion. Animation hooks short-circuit
 *  when this is true and snap elements to their final state. */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export { gsap, ScrollTrigger }
