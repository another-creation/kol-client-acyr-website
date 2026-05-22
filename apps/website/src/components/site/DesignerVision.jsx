import Button from '../atoms/Button'

export default function DesignerVision() {
  return (
    <section className="bg-surface-primary grid grid-cols-1 md:grid-cols-2 md:h-[120vh]">
      <div className="bg-surface-secondary overflow-hidden">
        <img
          src="/brand/yr/acyr-01.jpg"
          alt="Designer"
          className="w-full h-full object-cover object-top block"
        />
      </div>

      <div className="flex flex-col justify-center px-16 py-20 gap-6">
        <p className="site-eyebrow-section">The Designer</p>
        <h2 className="site-title-section uppercase" style={{ marginBottom: 16 }}>Designer's<br />Vision</h2>
        <div className="flex flex-col gap-4">
          <p className="site-subline-hero max-w-[380px]">
            Every piece begins with a single question: what does a woman truly need?
            Not trend, not noise — but a garment that becomes part of her story.
            Crafted by hand from the finest materials, each design is made to age
            beautifully and last a lifetime.
          </p>
          <p className="site-subline-emphasis max-w-[380px]">
            From a studio in Reykjavík, each piece is cut by hand in small
            numbers. No seasons, no overproduction — clothing made for the
            independent woman, built to be kept.
          </p>
        </div>
        <div className="mt-2">
          <Button size="lg" variant="secondary">Our Story</Button>
        </div>
      </div>
    </section>
  )
}
