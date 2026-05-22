import { Link } from 'react-router-dom'
import Button from '../atoms/Button'

export default function ProductCard({ src, label, name, price, sizes = [], color, to, overlay = true, fill = false }) {
  const Wrapper = to ? Link : 'div'
  const wrapperProps = to ? { to, className: `${fill ? 'flex flex-col h-full ' : ''}block no-underline`.trim() } : { className: fill ? 'flex flex-col h-full' : undefined }

  return (
    <Wrapper {...wrapperProps}>
      <div
        className={`ac-product-card bg-surface-secondary group relative overflow-hidden rounded-[4px]${fill ? ' flex-1 min-h-0' : ''}`}
        style={fill ? undefined : { aspectRatio: '3 / 4' }}
      >
        <img
          src={src}
          alt={label}
          className="w-full h-full object-cover object-top block transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
        {overlay && (
          <div
            data-overlay
            className="absolute left-0 right-0 bottom-0 flex flex-col p-4 bg-surface-tertiary opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <p className="site-name-card mb-1">{name}</p>
            <p className="site-meta-card mb-4">{price}</p>
            <Button variant="primary" size="md" className="w-full">
              Add to Bag
            </Button>
          </div>
        )}
      </div>
      {!overlay && (
        <div className="mt-3 flex items-baseline justify-between gap-4">
          <p className="site-name-card truncate">{name}</p>
          {price && <p className="site-meta-card flex-shrink-0">{price}</p>}
        </div>
      )}
    </Wrapper>
  )
}
