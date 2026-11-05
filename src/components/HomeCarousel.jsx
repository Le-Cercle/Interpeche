import { useState, useEffect, useCallback } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { prefersReducedMotion } from '../hooks/useParallax'

/**
 * Carrousel « À la une » — premier écran de l'accueil.
 * Piloté par la config admin (autoplay, intervalle, rail). Accessible :
 * pause manuelle + pause au survol/focus, aucun autoplay si reduced-motion.
 */
export default function HomeCarousel({ items, cfg, onOpen }) {
  const [slide, setSlide] = useState(0)
  const [userPaused, setUserPaused] = useState(() => prefersReducedMotion())
  const [hover, setHover] = useState(false)
  const n = items.length
  const auto = cfg.autoplay && !userPaused && !hover && n > 1

  const go = useCallback((i) => setSlide((((i % n) + n) % n) || 0), [n])

  useEffect(() => { if (slide >= n) setSlide(0) }, [n, slide])

  useEffect(() => {
    if (!auto) return
    const t = setTimeout(() => go(slide + 1), cfg.interval * 1000)
    return () => clearTimeout(t)
  }, [auto, slide, cfg.interval, go])

  if (!n) return null
  const cur = items[slide] || items[0]

  return (
    <section
      className="relative h-[92vh] min-h-[620px] bg-ocean-950 overflow-hidden"
      aria-roledescription="carrousel"
      aria-label="Dernières actualités"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <h1 className="sr-only">Interpêche Côte d'Ivoire — interprofession de la filière pêche</h1>

      {/* Images + teinte de marque (unifie des photos hétérogènes) */}
      {items.map((item, i) => (
        <div key={item.id} className="absolute inset-0 carousel-slide" style={{ opacity: i === slide ? 1 : 0, zIndex: i === slide ? 1 : 0 }} aria-hidden={i !== slide}>
          <img src={item.image} alt="" className="w-full h-full object-cover"
            style={{ transform: i === slide && !prefersReducedMotion() ? 'scale(1.06)' : 'scale(1)', transition: 'transform 8s ease-out' }}
            onError={(e) => { e.target.src = `https://picsum.photos/seed/${item.id}/1600/900` }} />
        </div>
      ))}
      <div className="absolute inset-0 z-[2] bg-ocean-700/30 mix-blend-multiply" aria-hidden="true" />
      <div className="absolute inset-0 z-[2]" aria-hidden="true"
        style={{ background: 'linear-gradient(0deg,rgba(0,11,24,.96) 0%,rgba(0,21,42,.72) 32%,rgba(0,21,42,.18) 65%,rgba(0,11,24,.55) 100%)' }} />
      <div className="absolute inset-x-0 top-0 h-40 z-[2] bg-gradient-to-b from-ocean-950/80 to-transparent" aria-hidden="true" />

      {/* Contenu */}
      <div className="container absolute inset-x-0 bottom-0 z-10 pb-28 md:pb-32">
        <div className="grid lg:grid-cols-[1fr_380px] gap-10 items-end">
          <div key={cur.id} className="hero-in max-w-3xl" aria-live={auto ? 'off' : 'polite'}>
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-flex items-center rounded-full bg-coral-500 text-ocean-950 text-xs font-bold px-3 py-1 uppercase tracking-wider">{cur.categorie}</span>
              <span className="text-ocean-100 text-sm">{cur.date}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-[1.08] tracking-tight mb-4 line-clamp-3">{cur.titre}</h2>
            <p className="text-ocean-100 text-base md:text-lg leading-relaxed line-clamp-2 mb-7 max-w-2xl">{cur.description}</p>
            <button onClick={() => onOpen(cur)}
              className="btn-ocean-glow inline-flex items-center gap-2 bg-coral-500 hover:bg-coral-400 text-ocean-950 font-bold px-7 py-3.5 rounded-xl transition-colors">
              Lire l'article <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Rail « À suivre » : toutes les une visibles d'un coup */}
          {cfg.showRail && n > 1 && (
            <ol className="hidden lg:flex flex-col gap-2" aria-label="Toutes les actualités à la une">
              {items.map((item, i) => (
                <li key={item.id}>
                  <button onClick={() => go(i)} aria-current={i === slide}
                    className={`relative w-full text-left rounded-xl px-4 py-3 overflow-hidden backdrop-blur-md border transition-colors ${
                      i === slide ? 'bg-white/15 border-white/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-coral-400 mb-0.5">{item.categorie}</span>
                    <span className={`block text-sm font-semibold leading-snug line-clamp-2 ${i === slide ? 'text-white' : 'text-ocean-100'}`}>{item.titre}</span>
                    {i === slide && cfg.autoplay && (
                      <span key={slide} className="rail-fill absolute left-0 bottom-0 h-[3px] bg-coral-400"
                        style={{ animationDuration: `${cfg.interval}s`, animationPlayState: auto ? 'running' : 'paused' }} />
                    )}
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Contrôles */}
        <div className="mt-8 flex items-center gap-4">
          <div className="flex items-center gap-2">
            {items.map((_, i) => (
              <button key={i} onClick={() => go(i)} aria-label={`Actualité ${i + 1} sur ${n}`} aria-current={i === slide}
                className="group py-3">
                <span className={`block h-1.5 rounded-full transition-all duration-500 ${i === slide ? 'w-12 bg-coral-400' : 'w-6 bg-white/40 group-hover:bg-white/70'}`} />
              </button>
            ))}
          </div>
          <span className="text-white/80 text-sm tabular-nums">{String(slide + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
          {cfg.autoplay && (
            <button onClick={() => setUserPaused((p) => !p)} aria-label={userPaused ? 'Lancer le défilement' : 'Mettre en pause le défilement'}
              className="ml-1 w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors">
              {userPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
          )}
          <div className="ml-auto flex gap-2">
            <button onClick={() => go(slide - 1)} aria-label="Précédent" className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center text-white transition-colors"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={() => go(slide + 1)} aria-label="Suivant" className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm flex items-center justify-center text-white transition-colors"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      {/* Vague vers la section suivante */}
      <div className="wave-divider absolute bottom-0 left-0 right-0 z-[5]" aria-hidden="true">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" fill="none" className="h-10 md:h-14 w-full">
          <path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="#000b18" />
        </svg>
      </div>
    </section>
  )
}
