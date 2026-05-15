/**
 * BlogBody — renders a block-structured article body.
 * See blog-data.js for supported block shapes.
 */
export default function BlogBody({ blocks = [] }) {
  return (
    <div className="kol-prose">
      {blocks.map((block, i) => {
        switch (block.type) {
          case 'p':     return <p key={i}>{block.text}</p>
          case 'h2':    return <h2 key={i}>{block.text}</h2>
          case 'h3':    return <h3 key={i}>{block.text}</h3>
          case 'quote': return (
            <blockquote key={i}>
              <p>{block.text}</p>
              {block.cite && <cite>{block.cite}</cite>}
            </blockquote>
          )
          case 'ul':    return <ul key={i}>{block.items.map((it, j) => <li key={j}>{it}</li>)}</ul>
          case 'ol':    return <ol key={i}>{block.items.map((it, j) => <li key={j}>{it}</li>)}</ol>
          default:      return null
        }
      })}
    </div>
  )
}
