import Button from '../atoms/Button'

export default function SupportCTA() {
  return (
    <section
      className="bg-surface-inverse px-8 py-24 flex flex-col items-center text-center gap-6"
    >
      <p className="ac-prose-label text-on-inverse">Independent Studio</p>
      <h2 className="ac-prose-display-md max-w-[720px] text-on-inverse" style={{ marginBottom: 0 }}>
        Support my Journey
      </h2>
      <p className="text-on-inverse opacity-40 max-w-[600px] text-[20px] leading-7">
        When you buy from Another Creation you support an independent atelier,
        not a factory floor. Made to order. Made to last.
      </p>
      <div className="flex flex-wrap gap-3 justify-center mt-4">
        <Button size="lg" variant="secondary">Shop Collection</Button>
        <Button size="lg" variant="outline">Learn More</Button>
      </div>
    </section>
  )
}
