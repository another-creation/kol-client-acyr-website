/**
 * SigTicker — bottom signature band with identity + token references.
 * Styled by `.site-sig*` in kol-site.css.
 * line: array of strings | null (separator)
 * tokens: array of strings (flagged as .site-sig-hex if starts with #)
 */
export default function SigTicker({ line = [], tokens = [] }) {
  return (
    <section className="site-sig">
      <div className="max-w-[1200px] mx-auto flex flex-wrap justify-between gap-6">
        <div className="inline-flex gap-[14px] flex-wrap items-center">
          {line.map((item, i) => {
            if (item === null) return <span key={i} className="site-sig-sep" aria-hidden="true">×</span>
            return <span key={i}>{item}</span>
          })}
        </div>
        <div className="inline-flex gap-[14px] flex-wrap items-center">
          {tokens.map((t, i) => (
            <span key={i} className={t.startsWith('#') ? 'site-sig-hex' : undefined}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
