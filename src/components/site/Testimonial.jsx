/**
 * Testimonial — centered editorial pull quote.
 * `inverse` flips the panel polarity (light bg + dark text for dark-mode pages).
 * Styled by `.site-testimonial*` in kol-site.css.
 */
export default function Testimonial({ kicker, quote, cite, inverse = false }) {
  const cls = 'site-testimonial' + (inverse ? ' site-testimonial--inverse' : '')
  return (
    <section className={cls}>
      <div className="max-w-[1200px] mx-auto text-center">
        {kicker && <span className="site-testimonial-kicker block mb-8">{kicker}</span>}
        {quote && <blockquote className="site-testimonial-quote">{quote}</blockquote>}
        {cite && <cite className="site-testimonial-cite block mt-10 not-italic">{cite}</cite>}
      </div>
    </section>
  )
}
