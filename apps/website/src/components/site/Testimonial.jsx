export default function Testimonial({ kicker, quote, cite }) {
  return (
    <section className="bg-surface-primary text-on-primary px-5 md:px-8 lg:px-14 py-16 md:py-24">
      <div className="max-w-[1200px] h-[600px] mx-auto flex flex-col justify-center text-center">
        <p className="mb-8 ac-helper-12 uppercase text-fg-48">{kicker}</p>
        <p className="m-0 italic font-bold text-[clamp(32px,4.5vw,64px)] leading-[1.2] tracking-[-0.005em] before:content-['“'] before:text-accent-primary before:opacity-70 after:content-['”'] after:text-accent-primary after:opacity-70">{quote}</p>
        <p className="mt-10 ac-helper-12 uppercase text-fg-64 before:content-['—_']">{cite}</p>
      </div>
    </section>
  )
}
