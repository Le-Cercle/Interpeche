import { useEffect } from 'react'
import { X, Calendar, User, Tag, ArrowLeft } from 'lucide-react'

const categoryClass = {
  'Événement':     'badge-evenement',
  'Formation':     'badge-formation',
  'Gouvernance':   'badge-gouvernance',
  'Distinction':   'badge-distinction',
  'Économie Bleue':'badge-economie',
  'Partenariat':   'badge-partenariat',
  'Innovation':    'badge-innovation',
  'Actualité':     'badge-default',
}

export default function NewsModal({ article, onClose }) {
  /* Lock body scroll + ESC key */
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  if (!article) return null

  /* Use full content if available, otherwise fall back to description */
  const fullText = article.contenu || article.description
  const paragraphs = fullText
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      {/* Blurred dark backdrop */}
      <div className="absolute inset-0 bg-ocean-950/80 backdrop-blur-md" style={{ animation: 'backdropIn 0.25s ease forwards' }} />

      {/* Modal card */}
      <div
        className="relative bg-white w-full sm:max-w-2xl sm:rounded-3xl rounded-t-3xl overflow-hidden flex flex-col modal-animate"
        style={{ maxHeight: '92vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Hero image ── */}
        <div className="relative flex-shrink-0 h-56 sm:h-72 overflow-hidden">
          <img
            src={article.image}
            alt={article.titre}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = `https://picsum.photos/seed/${article.id}/800/400` }}
          />
          {/* Gradient */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(0deg,rgba(0,11,24,0.75) 0%,rgba(0,11,24,0.2) 50%,transparent 100%)',
          }} />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
            style={{ background: 'rgba(0,11,24,0.55)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Category + date overlaid on image */}
          <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-3">
            <span className={`badge ${categoryClass[article.categorie] || 'badge-default'}`}>
              <Tag className="w-3 h-3" />
              {article.categorie}
            </span>
            <span className="text-white/80 text-xs">{article.date}</span>
          </div>
        </div>

        {/* ── Content (scrollable) ── */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8">
            {/* Title */}
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug mb-4">
              {article.titre}
            </h2>

            {/* Metadata row */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5">
              <span className="flex items-center gap-1.5 text-sm text-gray-400">
                <Calendar className="w-4 h-4 text-ocean-400" />
                {article.date}
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-300 hidden sm:block" />
              <span className="flex items-center gap-1.5 text-sm text-gray-400">
                <User className="w-4 h-4 text-ocean-400" />
                {article.auteur}
              </span>
            </div>

            {/* Separator with ocean gradient */}
            <div className="h-px mb-6" style={{ background: 'linear-gradient(90deg,#00b4d8,#48cae4,transparent)' }} />

            {/* Full article text */}
            <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed space-y-4">
              {paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div
          className="flex-shrink-0 px-6 md:px-8 py-4 flex items-center justify-between gap-3"
          style={{ borderTop: '1px solid #f3f4f6', background: 'white' }}
        >
          <span className="text-xs text-gray-400">Source : {article.auteur}</span>
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 text-sm font-semibold text-ocean-600 hover:text-ocean-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux actualités
          </button>
        </div>
      </div>
    </div>
  )
}
