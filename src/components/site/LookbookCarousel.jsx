import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { ACImages } from '../../brand/data/images'

const SLIDES = [
  ACImages.hero,
  ACImages.editorial.left,
  ACImages.portrait,
  ACImages.editorial.right,
  ACImages.handmade,
]

export default function LookbookCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'start',
    dragFree: true,
    duration: 30,
    containScroll: false,
  })

  const [canPrev, setCanPrev] = useState(true)
  const [canNext, setCanNext] = useState(true)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => {
      setCanPrev(emblaApi.canScrollPrev())
      setCanNext(emblaApi.canScrollNext())
    }
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi])

  useEffect(() => {
    const onKey = e => {
      if (e.key === 'ArrowLeft') scrollPrev()
      else if (e.key === 'ArrowRight') scrollNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [scrollPrev, scrollNext])

  const arrowBase = 'absolute top-1/2 -translate-y-1/2 w-14 h-14 flex items-center justify-center rounded-full text-[#F5F3EF] cursor-pointer transition-opacity duration-300 z-[2] bg-black/20 hover:bg-black/40 text-2xl leading-none opacity-0 group-hover:opacity-100'

  return (
    <section className="group relative w-screen ml-[calc(50%-50vw)] overflow-hidden" style={{ height: '70vh' }}>
      <div ref={emblaRef} className="overflow-hidden h-full cursor-grab active:cursor-grabbing">
        <div className="flex h-full touch-pan-y">
          {SLIDES.map((src, i) => (
            <div
              key={i}
              className="relative min-w-0 h-full select-none flex-[0_0_90vw] sm:flex-[0_0_70vw]"
            >
              <img
                src={src}
                alt=""
                draggable={false}
                className="w-full h-full object-cover block pointer-events-none"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        aria-label="Previous"
        onClick={scrollPrev}
        disabled={!canPrev}
        className={`${arrowBase} left-6 disabled:opacity-30`}
      >
        ‹
      </button>
      <button
        aria-label="Next"
        onClick={scrollNext}
        disabled={!canNext}
        className={`${arrowBase} right-6 disabled:opacity-30`}
      >
        ›
      </button>
    </section>
  )
}
