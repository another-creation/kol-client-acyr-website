/**
 * Brand info — canonical address / contact / identity strings.
 *
 * Single source of truth for all stationery, label, and asset mocks.
 * Update once, propagates everywhere. Used by StationeryMocks plus
 * future generators (social, type lab) that surface contact details.
 *
 * Pulled from anothercreation.com 2026-04-28.
 */

export const BRAND_INFO = {
  identity: {
    founder:     'Ýr Þrastardóttir',
    role:        'Founder · Designer',
    established: '2024',
    name:        'Another Creation',
    nameShort:   'AC',
  },
  contact: {
    email: 'yr@another-creation.com',
    phone: '+354 698 5802',
    web:   'another-creation.com',
  },
  studio: {
    street:   'Klapparstígur 16',
    postcode: '101 Reykjavík',
    country:  'Iceland',
    city:     'Reykjavík',
    locShort: 'Reykjavík · IS',
  },
  legal: {
    entity: 'Another Creation ehf',
    kt:     '580126-2240',
  },
  labels: {
    madeIn:    'Made in Iceland',
    handmade:  'Handmade in Reykjavík',
    handBy:    'Made by hand by Ýr',
    manifesto: 'Garments cut for slow living.',
  },
}
