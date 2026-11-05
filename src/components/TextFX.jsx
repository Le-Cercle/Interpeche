import { useState } from 'react'
import { useScrollProgress } from '../hooks/useParallax'

/**
 * Masked line reveal: each word slides up from behind a clip mask on mount.
 * Accessible: full text in aria-label, split spans aria-hidden.
 */
export function RevealWords({ text, className = '', baseDelay = 0.1, step = 0.07 }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} aria-hidden="true" className="word-mask">
          <span className="word-rise" style={{ animationDelay: `${baseDelay + i * step}s` }}>
            {w}&nbsp;
          </span>
        </span>
      ))}
    </span>
  )
}

/**
 * Word-by-word lighting tied to scroll (Apple-style).
 * Words go from dim to lit as the paragraph crosses the viewport.
 */
export function ScrollLitText({ text, className = '' }) {
  const [p, setP] = useState(0)
  const ref = useScrollProgress(setP)
  const words = text.split(' ')
  const lit = p * (words.length + 4)
  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => {
        const t = Math.min(Math.max(lit - i, 0), 1)
        return (
          <span key={i} aria-hidden="true" style={{ opacity: 0.28 + t * 0.72, transition: 'opacity .25s' }}>
            {w}{' '}
          </span>
        )
      })}
    </p>
  )
}
