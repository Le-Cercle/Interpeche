import { useEffect, useRef } from 'react'

/** True if user wants less motion or device is touch (reduce effects). */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const isCoarse = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches

/**
 * Depth parallax. Sets `--py` (px scrolled inside the section, clamped to its
 * height) on the returned ref. Children use `translate3d(0, calc(var(--py) * k), 0)`
 * via `.depth-N` classes. rAF-throttled, only runs while section is on screen.
 */
export function useParallax() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    const factor = isCoarse() ? 0.4 : 1
    let raf = 0
    let active = true

    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const py = Math.min(Math.max(-r.top, 0), r.height) * factor
      el.style.setProperty('--py', `${py.toFixed(1)}px`)
    }
    const onScroll = () => { if (active && !raf) raf = requestAnimationFrame(update) }

    const io = new IntersectionObserver(([e]) => { active = e.isIntersecting })
    io.observe(el)
    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return ref
}

/**
 * Scroll progress 0..1 of an element crossing the viewport
 * (0 = top enters bottom edge, 1 = bottom reaches ~40% of viewport).
 * Writes `--p` on the ref; also calls cb(p) for JS consumers.
 */
export function useScrollProgress(cb) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (prefersReducedMotion()) { cb(1); return }
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const p = (vh * 0.85 - r.top) / (r.height + vh * 0.35)
      cb(Math.min(Math.max(p, 0), 1))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return ref
}
