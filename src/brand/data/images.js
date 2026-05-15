const ANNA = '/brand/photoshoot'
const TEX  = '/brand/textures'

export const ACImages = {
  // Hero
  hero: `${ANNA}/33a7313.jpg`,

  // Editorial 2-col pair — ocean/cliff, portrait format, complement each other
  editorial: {
    left:  `${ANNA}/33a7313.jpg`,
    right: `${ANNA}/33a7554.jpg`,
  },

  // Designer's Vision — gold coat, geothermal fog
  portrait: `${ANNA}/33a6584.jpg`,

  // Handmade section — warm misty landscape, panoramic
  handmade: `${ANNA}/33a4845.jpg`,

  // Texture separator bands
  texture: {
    warm: `${TEX}/Irl99HVe.jpg`,   // warm brown/cream marble
    dark: `${TEX}/K5-0kdCb-2.jpg`, // dark marble + gold veining
  },

  // Collection grid — 8 editorial looks
  looks: [
    { src: `${ANNA}/33a6719.jpg`,   label: 'Look I',    name: 'Ivory Wool Overcoat',     price: '€1,280', sizes: ['XS','S','M','L'],    color: 'Ivory'       },
    { src: `${ANNA}/33a6082.jpg`,   label: 'Look II',   name: 'Charcoal Cashmere Blazer', price: '€960',  sizes: ['S','M','L'],         color: 'Charcoal'    },
    { src: `${ANNA}/33a5074.jpg`,   label: 'Look III',  name: 'Sand Linen Trench',        price: '€1,140', sizes: ['XS','S','M','L','XL'], color: 'Sand'     },
    { src: `${ANNA}/33a6361.jpg`,   label: 'Look IV',   name: 'Slate Silk Dress',         price: '€870',  sizes: ['XS','S','M'],         color: 'Slate'      },
    { src: `${ANNA}/33a4845.jpg`,   label: 'Look V',    name: 'Onyx Tailored Trousers',   price: '€620',  sizes: ['S','M','L','XL'],     color: 'Onyx'       },
    { src: `${ANNA}/33a5964.jpg`,   label: 'Look VI',   name: 'Pearl Draped Blouse',      price: '€540',  sizes: ['XS','S','M','L'],    color: 'Pearl'      },
    { src: `${ANNA}/33a6554.jpg`,   label: 'Look VII',  name: 'Gold Embroidered Cape',    price: '€1,750', sizes: ['One Size'],           color: 'Gold'       },
    { src: `${ANNA}/33a6242.jpg`,   label: 'Look VIII', name: 'Obsidian Leather Skirt',   price: '€780',  sizes: ['XS','S','M','L'],    color: 'Obsidian'   },
  ],
}
