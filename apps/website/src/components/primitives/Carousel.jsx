import { Children, useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Icon from '../loaders/icons/Icon'

/**
 * arrows — 'below' (default) renders the bordered button row under the
 * viewport; 'overlay' floats bare chevrons over the slides at the left and
 * right edges, vertically centred.
 */
export default function Carousel({ children, options = { align: 'start', loop: false, dragFree: true, containScroll: 'trimSnaps' }, className = '', arrows = 'below' }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const onSelect = useCallback((api) => {
    setCanPrev(api.canScrollPrev())
    setCanNext(api.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    onSelect(emblaApi)
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  const slides = Children.toArray(children)

  const overlay = arrows === 'overlay'

  return (
    <div className={`ac-embla ${overlay ? 'relative' : ''} ${className}`.trim()}>
      <div className="ac-embla-viewport" ref={emblaRef}>
        <div className="ac-embla-container">
          {slides.map((child, i) => (
            <div key={i} className="ac-embla-slide">{child}</div>
          ))}
        </div>
      </div>
      {overlay ? (
        <>
          <button
            type="button"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 text-white cursor-pointer disabled:opacity-30 disabled:cursor-default"
            aria-label="Previous"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
          ><Icon name="chevron-left" size={28} /></button>
          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 text-white cursor-pointer disabled:opacity-30 disabled:cursor-default"
            aria-label="Next"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
          ><Icon name="chevron-right" size={28} /></button>
        </>
      ) : (
      <div className="ac-embla-controls">
        <button
          type="button"
          className="ac-embla-btn border border-fg-12 hover:border-fg-32 text-auto"
          aria-label="Previous"
          onClick={() => emblaApi?.scrollPrev()}
          disabled={!canPrev}
        >‹</button>
        <button
          type="button"
          className="ac-embla-btn border border-fg-12 hover:border-fg-32 text-auto"
          aria-label="Next"
          onClick={() => emblaApi?.scrollNext()}
          disabled={!canNext}
        >›</button>
      </div>
      )}
    </div>
  )
}
