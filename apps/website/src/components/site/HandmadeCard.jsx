import { ACImages } from '@ac/brand-data/images'
import Button from '../atoms/Button'

export default function HandmadeCard() {
  return (
    <section
      className="relative h-[90vh] min-h-[560px] flex items-end p-16 bg-cover"
      style={{
        backgroundImage: `url(${ACImages.handmade})`,
        backgroundPosition: 'center 40%',
      }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)' }}
      />
      <div data-theme="dark" className="relative flex flex-col gap-5 max-w-[480px]">
        <h2 className="site-title-section uppercase">
          Handmade &amp;<br />tailored<br />to your needs
        </h2>
        <div className="mt-2">
          <Button size="lg" variant="secondary">Shop Jackets</Button>
        </div>
      </div>
    </section>
  )
}
