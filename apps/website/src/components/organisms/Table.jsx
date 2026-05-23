import { useEffect, useRef } from 'react'

/**
 * Table — data table.
 * Styles: src/ds/components/organisms.css.
 *
 * Variants:
 *   default — bordered, column dividers, header bg
 *   simple  — borderless, flush, no column dividers
 *
 * Selecting cells and copying writes GitHub-flavored markdown to the clipboard
 * (header row + separator + selected body rows). `<code>` / `<kbd>` wrap in
 * backticks, `<a>` becomes `[text](href)`.
 */
const Table = ({ caption, columns, rows, variant = 'default', className = '' }) => {
  const variantClass = variant === 'simple' ? 'ac-table--simple' : ''
  const wrapperClass = ['ac-table-wrapper', variantClass, className].filter(Boolean).join(' ')
  const wrapperRef = useRef(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    if (!wrapper) return

    const handleCopy = (e) => {
      const selection = document.getSelection()
      if (!selection || selection.isCollapsed) return

      const tableEl = wrapper.querySelector('table')
      if (!tableEl) return
      const anchorIn = selection.anchorNode && tableEl.contains(selection.anchorNode)
      const focusIn = selection.focusNode && tableEl.contains(selection.focusNode)
      if (!anchorIn && !focusIn) return

      const cellToMarkdown = (cell) => {
        let out = ''
        cell.childNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            out += node.textContent
            return
          }
          if (node.nodeType !== Node.ELEMENT_NODE) return
          const tag = node.tagName.toLowerCase()
          const text = node.textContent
          if (tag === 'code' || tag === 'kbd') out += '`' + text + '`'
          else if (tag === 'a') out += `[${text}](${node.getAttribute('href') ?? ''})`
          else out += text
        })
        return out.replace(/\s+/g, ' ').trim() || '—'
      }

      const headerCells = Array.from(tableEl.querySelectorAll('thead th'))
      const bodyRows = Array.from(tableEl.querySelectorAll('tbody tr')).filter((tr) =>
        selection.containsNode(tr, true),
      )
      if (bodyRows.length === 0 || headerCells.length === 0) return

      const headerLine = `| ${headerCells.map(cellToMarkdown).join(' | ')} |`
      const sepLine = `| ${headerCells.map(() => '---').join(' | ')} |`
      const bodyLines = bodyRows.map((tr) => {
        const cells = Array.from(tr.querySelectorAll('td')).map(cellToMarkdown)
        return `| ${cells.join(' | ')} |`
      })
      const md = [headerLine, sepLine, ...bodyLines].join('\n')

      e.clipboardData.setData('text/plain', md)
      e.clipboardData.setData('text/html', '')
      e.preventDefault()
    }

    document.addEventListener('copy', handleCopy)
    return () => document.removeEventListener('copy', handleCopy)
  }, [])

  return (
  <div ref={wrapperRef} className={wrapperClass}>
    <table className="ac-table">
      {caption ? <caption className="sr-only">{caption}</caption> : null}
      <thead className="ac-table-thead">
        <tr>
          {columns.map((column) => (
            <th
              key={column.accessor}
              scope="col"
              className={column.headerClassName ?? 'ac-table-cell-title'}
              style={column.style}
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={row.id ?? row.token ?? rowIndex} className="ac-table-row">
            {columns.map((column) => (
              <td key={column.accessor} className={(typeof column.className === 'function' ? column.className(row) : column.className) ?? 'ac-table-cell-text'} style={column.style}>
                {column.render ? column.render(row) : row[column.accessor] ?? '—'}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  )
}

export default Table
