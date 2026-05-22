/**
 * Textarea — multi-line text atom built on the .ac-control shell with the
 * `--textarea` modifier (display: block).
 *
 *   variant="filled" (default) — persistent solid bg
 *   variant="ghost"            — borderless at rest, reveals on hover/focus
 *   variant="outline"          — bordered, transparent bg
 *
 *   size="sm" / "md" (default) / "lg" — padding + type class
 *
 * Default rows = 3. Vertical resize enabled — browser draws a native
 * drag handle at the bottom-right corner so users can grow the field.
 * Horizontal resize disabled to keep form layout stable.
 *
 * Controlled OR uncontrolled:
 *   - pass `value` + `onChange` for controlled,
 *   - pass `value` alone (no onChange) and we route through defaultValue.
 *
 * Pairs with `<Input>` for single-line.
 */

const SIZE_TYPE = { sm: 'ac-mono-12', md: 'ac-mono-14', lg: 'ac-mono-16' }

export default function Textarea({
  value,
  onChange,
  variant = 'filled',
  size = 'md',
  rows = 3,
  placeholder,
  disabled = false,
  className = '',
  ...props
}) {
  const wrapperCls = [
    'ac-control',
    `ac-control--${variant}`,
    'ac-control--textarea',
    `ac-control-${size}`,
    SIZE_TYPE[size],
    'relative block w-full',
    className,
  ].filter(Boolean).join(' ')

  /* React requires controlled inputs (value + onChange) OR uncontrolled
   * (defaultValue only). Pick based on whether onChange was passed. */
  const valueProps = onChange
    ? { value: value ?? '', onChange }
    : { defaultValue: value ?? '' }

  return (
    <label className={wrapperCls} aria-disabled={disabled || undefined}>
      <textarea
        {...valueProps}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        spellCheck={false}
        className="block w-full bg-transparent border-none outline-none text-auto"
        style={{ resize: 'vertical' }}
        {...props}
      />
    </label>
  )
}
