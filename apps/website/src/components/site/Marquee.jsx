export default function Marquee({ kicker, note, items = [] }) {
  const list = items.map((it) => (typeof it === 'string' ? { name: it } : it))
  return (
    <section data-theme="dark" className="relative w-screen ml-[calc(50%-50vw)] h-48 bg-black text-white flex flex-col justify-center overflow-hidden">
      {(kicker || note) && (
        <div className="max-w-[1200px] mx-auto mb-10 px-[var(--ac-pad-page-x)] flex items-baseline justify-between gap-4 flex-wrap">
          {kicker && <span className="site-eyebrow-section">{kicker}</span>}
          {note && <span className="site-meta-system">{note}</span>}
        </div>
      )}
      <div className="relative w-full overflow-hidden">
        <div className="marquee-scroll flex w-max">
          {[...list, ...list].map((item, i) => (
            <span key={i} className="inline-flex items-center gap-3 pr-16 md:pr-32">
              {item.logo ? (
                <span className="inline-flex items-center">{item.logo}</span>
              ) : (
                <span className="inline-flex items-baseline gap-1.5 whitespace-nowrap text-[22px] font-medium tracking-[-0.005em]">
                  {item.name}
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
