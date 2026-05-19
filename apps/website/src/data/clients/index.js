/**
 * CLIENTS — collaborators / customers / partners.
 *
 * SVGs imported via vite-plugin-svgr's `?react` suffix so each logo is a
 * real React component (currentColor paint inheritance, width/height props,
 * className passthrough). Mirrors the @ac/brand-data/logos pattern.
 *
 * Used by: Marquee on the home page. Reuse anywhere a small client-strip
 * is needed (about page, press kit, etc.).
 */

import Apotek                    from './svg/01-apotek.svg?react'
import Kvik                      from './svg/02-kvik.svg?react'
import Rannis                    from './svg/03-rannis.svg?react'
import ChineseEuropeanArtCentre  from './svg/04-chinese-european-art-centre.svg?react'
import HMDM                      from './svg/05-hmdm.svg?react'
import FH                        from './svg/06-fh.svg?react'
import RFF                       from './svg/07-rff.svg?react'
import Warrior                   from './svg/08-warrior.svg?react'

export const CLIENTS = [
  { name: 'Apotek',                       Logo: Apotek },
  { name: 'Kvik',                         Logo: Kvik },
  { name: 'Rannís',                       Logo: Rannis },
  { name: 'Chinese-European Art Centre',  Logo: ChineseEuropeanArtCentre },
  { name: 'HMDM',                         Logo: HMDM },
  { name: 'FH',                           Logo: FH },
  { name: 'Reykjavík Fashion Festival',   Logo: RFF },
  { name: 'Warrior',                      Logo: Warrior },
]
