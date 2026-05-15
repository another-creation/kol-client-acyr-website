/**
 * FAQ — collapsible Q/A list with left-column header.
 * Styled by `.site-faq*` in kol-site.css.
 * items: [{ q, a }]
 */
export default function FAQ({ kicker, title, items = [] }) {
  return (
    <section className="site-faq">
      <div className="site-faq-inner">
        <div className="site-faq-head flex flex-col gap-4">
          {kicker && <span className="site-faq-kicker">{kicker}</span>}
          {title && <h2 className="site-faq-title">{title}</h2>}
        </div>
        <div className="site-faq-list flex flex-col">
          {items.map((item, i) => (
            <details key={i} className="site-faq-item">
              <summary>
                <span>{item.q}</span>
                <span className="site-faq-item-toggle" aria-hidden="true">+</span>
              </summary>
              <div className="site-faq-item-body">{item.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
