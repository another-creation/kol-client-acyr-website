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
import { Flip } from 'gsap/Flip'
import { ExpoScaleEase } from 'gsap/EasePack'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, ScrollTrigger, Flip, ExpoScaleEase, SplitText)

/** True when the user prefers reduced motion. Animation hooks short-circuit
 *  when this is true and snap elements to their final state. */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export { gsap, ScrollTrigger, Flip, ExpoScaleEase, SplitText, useGSAP }
