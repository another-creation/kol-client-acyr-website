import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Icon from '../loaders/icons/Icon'

const score = (entry, q) => {
  const label    = entry.label.toLowerCase()
  const haystack = entry.haystack ?? label
  if (label === q) return 0
  if (label.startsWith(q)) return 1
  if (label.includes(q)) return 2
  if (haystack.includes(q)) return 3
  return null
}

export default function CmdKSearch({
  open,
  setOpen,
  entries = [],
  placeholder = 'Search…',
  onNavigate,
}) {
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const [query, setQuery] = useState('')
  const [idx, setIdx]     = useState(0)

  useEffect(() => {
    const onKey = (e) => {
      const isCmd = e.metaKey || e.ctrlKey
      if (isCmd && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
        return
      }
      if (open && e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  useEffect(() => {
    if (!open) return
    setQuery('')
    setIdx(0)
    const t = setTimeout(() => inputRef.current?.focus(), 0)
    document.body.style.overflow = 'hidden'
    return () => {
      clearTimeout(t)
      document.body.style.overflow = ''
    }
  }, [open])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return entries.slice(0, 12)
    return entries
      .map((e) => ({ e, s: score(e, q) }))
      .filter((x) => x.s !== null)
      .sort((a, b) => a.s - b.s)
      .map((x) => x.e)
      .slice(0, 40)
  }, [query, entries])

  const onChangeQuery = (e) => {
    setQuery(e.target.value)
    setIdx(0)
  }

  const go = (entry) => {
    setOpen(false)
    if (onNavigate) {
      onNavigate(entry)
    } else if (entry.external) {
      window.open(entry.to, '_blank', 'noopener,noreferrer')
    } else {
      navigate(entry.to)
    }
  }

  const onInputKey = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIdx((i) => Math.min(results.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIdx((i) => Math.max(0, i - 1))
    } else if (e.key === 'Enter' && results[idx]) {
      e.preventDefault()
      go(results[idx])
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] px-4"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.5)' }} />
      <div
        className="relative w-full max-w-[560px] bg-surface-primary rounded-[4px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 h-12 border-b border-fg-08">
          <Icon name="search" size={14} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={onChangeQuery}
            onKeyDown={onInputKey}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-emphasis"
            style={{ border: 'none', outline: 'none', fontSize: 14, padding: 0 }}
          />
          <span className="ac-helper-xxs text-meta">ESC</span>
        </div>

        <ul className="flex-1 overflow-y-auto max-h-[60vh] m-0 p-0" style={{ listStyle: 'none' }}>
          {results.length === 0 ? (
            <li className="px-4 py-3 ac-helper-xxs text-meta">No results.</li>
          ) : (
            results.map((r, i) => {
              const active = i === idx
              return (
                <li
                  key={`${r.section}-${r.to}-${r.label}`}
                  onMouseEnter={() => setIdx(i)}
                  onClick={() => go(r)}
                  className="px-4 py-3 cursor-pointer flex items-center justify-between gap-4"
                  style={{ background: active ? 'var(--ac-fg-04)' : 'transparent' }}
                >
                  <span className="ac-sans-nav truncate">{r.label}</span>
                  <span className="ac-helper-xxs text-meta flex-shrink-0">{r.section}</span>
                </li>
              )
            })
          )}
        </ul>
      </div>
    </div>
  )
}
