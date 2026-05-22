export default function Testimonial({ kicker, quote, cite }) {
  return (
    <section className="bg-surface-primary text-on-primary px-5 md:px-8 lg:px-14 py-16 md:py-24">
      <div className="max-w-[1200px] h-[600px] mx-auto flex flex-col justify-center text-center">
        <p className="mb-8 site-eyebrow-section">{kicker}</p>
        <p className="site-quote before:content-['“'] before:text-accent-primary before:opacity-70 after:content-['”'] after:text-accent-primary after:opacity-70">{quote}</p>
        <p className="mt-10 site-quote-cite before:content-['—_']">{cite}</p>
      </div>
    </section>
  )
}
