import Icon from '../loaders/icons/Icon'

/**
 * FAQ — collapsible Q/A list with left-column header.
 * items: [{ q, a }]
 */
export default function FAQ({ kicker, title, items = [] }) {
  return (
    <section className="bg-surface-primary text-on-primary px-8 h-[1000px] overflow-hidden flex items-center">
      <div className="max-w-[1200px] w-full mx-auto grid gap-8 md:gap-12 md:grid-cols-[1fr_2fr]">
        <div className="flex flex-col gap-4">
          {kicker && <span className="ac-helper-16 uppercase text-fg-48">{kicker}</span>}
          {title && <h2 className="ac-sans-heading-02 m-0">{title}</h2>}
        </div>
        <div className="flex flex-col">
          {items.map((item, i) => (
            <details
              key={i}
              name="faq"
              className="group border-t border-fg-08 first:border-t-0"
            >
              <summary className="flex items-center justify-between gap-4 py-6 cursor-pointer list-none [&::-webkit-details-marker]:hidden ac-sans-heading-05">
                <span>{item.q}</span>
                <span
                  aria-hidden="true"
                  className="ac-btn ac-btn-primary w-7 h-7 shrink-0 rounded-full! transition-transform duration-200 group-open:rotate-45"
                >
                  <Icon name="plus" size={12} />
                </span>
              </summary>
              <div className="ac-prose pb-6">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
