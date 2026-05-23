import { useState } from 'react'
import Icon from '../loaders/icons/Icon'

export default function CodeBlock({ children, language }) {
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(children))
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked — silent */
    }
  }

  return (
    <div className="ac-codeblock">
      {language && <span className="ac-codeblock-lang">{language}</span>}
      <button
        type="button"
        className="ac-codeblock-copy"
        onClick={onCopy}
        aria-label={copied ? 'Copied' : 'Copy to clipboard'}
        title={copied ? 'Copied' : 'Copy'}
      >
        <Icon name={copied ? 'check' : 'copy'} size={14} />
        <span className="leading-none">{copied ? 'Copied' : 'Copy'}</span>
      </button>
      <pre><code>{children}</code></pre>
    </div>
  )
}
