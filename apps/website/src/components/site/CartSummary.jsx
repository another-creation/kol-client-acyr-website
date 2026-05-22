import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../loaders/icons/Icon'
import { formatPrice } from '../../data/shop-data'

const THUMB = 80

export function QtyControl({ qty, onChange, onDelete }) {
  const atMin = qty === 1
  const [hover, setHover] = useState(false)
  const showTrash = atMin && hover
  return (
    <div className="inline-flex items-center gap-3">
      <button
        type="button"
        aria-label={atMin ? 'Remove item' : 'Decrease quantity'}
        onClick={() => (atMin ? onDelete() : onChange(qty - 1))}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="w-7 h-7 inline-flex items-center justify-center bg-fg-04 hover:bg-fg-08 transition-colors rounded-full"
        style={{ border: 'none', cursor: 'pointer', color: 'inherit' }}
      >
        <Icon name={showTrash ? 'trash' : 'minus'} size={12} />
      </button>
      <span className="site-name-card" style={{ minWidth: '1.5em', textAlign: 'center' }}>{qty}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(qty + 1)}
        className="w-7 h-7 inline-flex items-center justify-center bg-fg-04 hover:bg-fg-08 transition-colors rounded-full"
        style={{ border: 'none', cursor: 'pointer', color: 'inherit' }}
      >
        <Icon name="plus" size={12} />
      </button>
    </div>
  )
}

export function CartRow({ item, linkTo, onLinkClick, qtyControl }) {
  const thumb = (
    <div
      className="aspect-square rounded-[4px] overflow-hidden bg-surface-secondary"
      style={{ width: THUMB, height: THUMB }}
    >
      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
    </div>
  )

  const name = linkTo ? (
    <Link to={linkTo} onClick={onLinkClick} className="site-name-card no-underline hover:text-emphasis mb-2">
      {item.name}
    </Link>
  ) : (
    <p className="site-name-card mb-2">{item.name}</p>
  )

  const metaLine = [item.size, item.color].filter(Boolean).join(' · ')

  return (
    <div className="grid gap-4 items-start" style={{ gridTemplateColumns: `${THUMB}px 1fr auto` }}>
      {linkTo ? <Link to={linkTo} onClick={onLinkClick} className="block">{thumb}</Link> : thumb}
      <div className="flex flex-col min-w-0">
        {name}
        {metaLine && <p className="site-meta-card mb-2">{metaLine}</p>}
        {qtyControl}
      </div>
      <p className="site-name-card">{formatPrice(item.price * item.qty, item.currency)}</p>
    </div>
  )
}

export function CartTotalsRow({ label, value, emphasis = false }) {
  return (
    <div className="flex items-center justify-between">
      <span className={emphasis ? 'site-name-card' : 'site-meta-card'}>{label}</span>
      <span className="site-name-card">{value}</span>
    </div>
  )
}

/**
 * CartPanel — single source of truth for the cart-sidebar shell.
 *
 * Owns: background, border, padding, header / list / footer scaffolding,
 *       per-row CartRow rendering.
 *
 * Consumers (CartDrawer, Checkout aside) pass slot content + positioning
 * via className. Tuning any wrapper rule = one edit here.
 *
 * Props:
 *   className     — outer aside positioning (e.g. "absolute top-0 right-0 h-dvh w-[480px]"
 *                   for the drawer, "lg:fixed lg:right-0 lg:top-0 lg:h-dvh lg:w-[480px] lg:z-[60]"
 *                   for the checkout aside).
 *   header        — JSX node rendered inside the header bar. Typically the
 *                   "Your bag · N" text plus an optional close button.
 *   items         — cart items array. If empty, renders `empty` in place of
 *                   list + footer.
 *   qtyControlFor — (item) => JSX. Per-item qty control node.
 *   linkToFor     — (item) => string | null. Optional. If set, row name + thumb
 *                   wrap in a Link.
 *   onLinkClick   — handler for row link clicks (e.g. closeCart in the drawer).
 *   empty         — JSX rendered when items.length === 0 (in place of list + footer).
 *   footer        — JSX rendered in the footer bar when items.length > 0.
 *   onClick       — optional aside click handler. Default: stopPropagation
 *                   (safe in all contexts, required by the drawer overlay).
 */
export function CartPanel({
  className = '',
  header,
  items,
  qtyControlFor,
  linkToFor,
  onLinkClick,
  empty,
  footer,
  onClick,
}) {
  const stopProp = (e) => e.stopPropagation()
  const isEmpty  = items.length === 0

  return (
    <aside
      className={`bg-surface-primary border-l border-fg-08 flex flex-col ${className}`}
      onClick={onClick ?? stopProp}
    >
      {header && (
        <header className="flex items-center justify-between px-6 h-14 border-b border-fg-08 flex-shrink-0">
          {header}
        </header>
      )}

      {isEmpty ? (
        empty
      ) : (
        <>
          <ul className="flex-1 overflow-y-auto flex flex-col">
            {items.map((it) => (
              <li key={it.id} className="px-6 py-5 border-b border-fg-08">
                <CartRow
                  item={it}
                  linkTo={linkToFor?.(it)}
                  onLinkClick={onLinkClick}
                  qtyControl={qtyControlFor?.(it)}
                />
              </li>
            ))}
          </ul>

          {footer && (
            <footer className="px-6 py-5 border-t border-fg-08 flex-shrink-0 flex flex-col gap-4">
              {footer}
            </footer>
          )}
        </>
      )}
    </aside>
  )
}
