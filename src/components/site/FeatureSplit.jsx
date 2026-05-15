/**
 * FeatureSplit — text + image editorial pull.
 * Used as the main hero on /site and as the "The fleet" feature on /.
 * `meta` renders a stats strip; `ctas` renders a button row — pick one.
 * Styled by `.site-feature*` in kol-site.css.
 */
export default function FeatureSplit({ kicker, title, body, meta, ctas, media, caption, className = '', innerClassName = '', columnClassName = '', bgImage }) {
  const sectionStyle = bgImage
    ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : undefined
  return (
    <section className={`site-feature ${className}`.trim()} style={sectionStyle}>
      <div className={`max-w-[1200px] mx-auto grid grid-cols-1 min-[901px]:grid-cols-2 items-center gap-[clamp(48px,6vw,96px)] ${innerClassName}`.trim()}>
        <div className={`flex flex-col gap-4 max-w-[640px] ${columnClassName}`.trim()}>
          {kicker && <span className="site-feature-kicker">{kicker}</span>}
          {title && <h1 className="site-feature-pull">{title}</h1>}
          {body && <p className="site-feature-body">{body}</p>}
          {meta && meta.length > 0 && (
            <div className="site-feature-meta flex flex-wrap gap-y-7 gap-x-12 pt-4">
              {meta.map((m) => (
                <div key={m.label} className="flex flex-col gap-0.5">
                  <span className="site-feature-meta-num">{m.num}</span>
                  <span className="site-feature-meta-label">{m.label}</span>
                </div>
              ))}
            </div>
          )}
          {ctas && <div className="flex flex-wrap gap-4 pt-2">{ctas}</div>}
        </div>
        {media && (
          <div className="site-feature-visual relative aspect-[4/5] rounded-[4px] overflow-hidden">
            {media}
            {caption && <div className="site-feature-visual-veil" aria-hidden="true" />}
            {caption && <span className="site-feature-visual-caption">{caption}</span>}
          </div>
        )}
      </div>
    </section>
  )
}
