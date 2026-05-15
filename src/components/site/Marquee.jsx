/**
 * Marquee — scrolling band of names. Accepts items as strings or { name } objects.
 * Styled by `.site-marquee*` in kol-site.css.
 */
export default function Marquee({ kicker, note, items = [] }) {
  const list = items.map((it) => (typeof it === 'string' ? { name: it } : it))
  return (
    <section className="site-marquee">
      {(kicker || note) && (
        <div className="max-w-[1200px] mx-auto mb-10 px-[var(--kol-pad-page-x)] flex items-baseline justify-between gap-4 flex-wrap">
          {kicker && <span className="site-marquee-kicker">{kicker}</span>}
          {note && <span className="site-marquee-head-note">{note}</span>}
        </div>
      )}
      <div className="site-marquee-track-wrap">
        <div className="site-marquee-track">
          {[...list, ...list].map((item, i) => (
            <span key={i} className="site-marquee-item inline-flex items-center gap-3">
              {item.logo ? (
                <span className="site-marquee-item-logo inline-flex items-center">{item.logo}</span>
              ) : (
                <span className="site-marquee-item-label">
                  <span>{item.name}</span>
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
