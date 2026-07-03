import { useState, useEffect } from 'react'
import { ChevronUp } from 'lucide-react'

/* ─── Scroll progress bar ─── */
export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el  = document.documentElement
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100
      setProgress(Math.min(pct, 100))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-transparent pointer-events-none">
      <div
        className="h-full transition-all duration-100 ease-linear"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg,#00b4d8,#48cae4,#f77f00)',
          boxShadow: '0 0 8px rgba(0,180,216,0.8)',
        }}
      />
    </div>
  )
}

/* ─── Back to top button ─── */
export function BackToTop() {
  const [visible, setVisible] = useState(false)
  const [pressing, setPressing] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <button
      onClick={scrollTop}
      onMouseDown={() => setPressing(true)}
      onMouseUp={() => setPressing(false)}
      onMouseLeave={() => setPressing(false)}
      aria-label="Retour en haut"
      className={`
        fixed bottom-6 right-6 z-50
        w-12 h-12 rounded-2xl
        flex items-center justify-center
        text-white
        transition-all duration-300
        ${visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-6 pointer-events-none'}
        ${pressing ? 'scale-90' : 'hover:scale-110 hover:-translate-y-1'}
      `}
      style={{
        background: 'linear-gradient(135deg,#006994,#00b4d8)',
        boxShadow: pressing
          ? '0 2px 10px rgba(0,180,216,0.4)'
          : '0 4px 20px rgba(0,105,148,0.5), 0 0 0 1px rgba(0,180,216,0.3)',
      }}
    >
      {/* Ripple bg */}
      <span
        className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'radial-gradient(circle at center,rgba(255,255,255,0.15),transparent 70%)' }}
      />
      <ChevronUp className="w-5 h-5 relative z-10" strokeWidth={2.5} />
    </button>
  )
}
