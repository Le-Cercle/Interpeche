import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

const BUBBLES = [
  { s: 8, l: '8%', d: '0s', t: '13s' }, { s: 14, l: '22%', d: '3s', t: '16s' },
  { s: 6, l: '41%', d: '1.5s', t: '11s' }, { s: 18, l: '63%', d: '5s', t: '17s' },
  { s: 9, l: '78%', d: '2s', t: '12s' }, { s: 12, l: '92%', d: '6s', t: '15s' },
]
const RAYS = [
  { l: '12%', w: 90, d: '0s', t: '8s' }, { l: '48%', w: 140, d: '2.5s', t: '10s' }, { l: '80%', w: 70, d: '4.5s', t: '7s' },
]

/**
 * En-tête de page commun : fil d'Ariane, accroche, titre à mot-clé en dégradé,
 * pastilles de chiffres, atmosphère océan (caustiques, rayons, bulles) et vague.
 * `children` = contenu additionnel sous le sous-titre (ex. barre de recherche).
 */
export default function PageHero({ icon: Icon, eyebrow, title, accent, subtitle, crumb, stats = [], children }) {
  return (
    <section className="relative overflow-hidden pt-32 pb-28 md:pb-32 text-white"
      style={{ background: 'linear-gradient(160deg,#000b18 0%,#001e3c 45%,#00507a 100%)' }}>
      <div className="caustic-overlay" aria-hidden="true" />
      {RAYS.map((r, i) => (
        <div key={i} className="light-ray" aria-hidden="true"
          style={{ left: r.l, width: r.w, animationDelay: r.d, animationDuration: r.t }} />
      ))}
      {BUBBLES.map((b, i) => (
        <div key={i} className="bubble" aria-hidden="true"
          style={{ width: b.s, height: b.s, left: b.l, animationDelay: b.d, animationDuration: b.t, opacity: 0.5 }} />
      ))}
      <div className="absolute inset-0 opacity-[0.04]" aria-hidden="true"
        style={{ backgroundImage: 'radial-gradient(circle,#fff 1px,transparent 1px)', backgroundSize: '44px 44px' }} />

      <div className="container relative">
        {/* Fil d'Ariane */}
        <nav aria-label="Fil d'Ariane" className="hero-in mb-8">
          <ol className="flex items-center gap-1.5 text-sm text-ocean-200">
            <li><Link to="/" className="inline-flex items-center gap-1.5 hover:text-white transition-colors"><Home className="w-3.5 h-3.5" />Accueil</Link></li>
            <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5 opacity-60" /></li>
            <li aria-current="page" className="text-white font-medium">{crumb || title}</li>
          </ol>
        </nav>

        <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-end">
          <div className="max-w-3xl">
            <div className="hero-in inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm px-4 py-1.5 mb-6" style={{ animationDelay: '.08s' }}>
              {Icon && <Icon className="w-4 h-4 text-coral-400" />}
              <span className="text-ocean-100 text-sm font-medium">{eyebrow}</span>
            </div>
            <h1 className="hero-in text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight mb-5" style={{ animationDelay: '.16s' }}>
              {title}
              {accent && (
                <span className="block mt-1"
                  style={{ background: 'linear-gradient(90deg,#48cae4,#00b4d8 40%,#ff9f47)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {accent}
                </span>
              )}
            </h1>
            <p className="hero-in text-ocean-100 text-lg md:text-xl leading-relaxed max-w-2xl" style={{ animationDelay: '.26s' }}>{subtitle}</p>
            {children && <div className="hero-in mt-8" style={{ animationDelay: '.34s' }}>{children}</div>}
          </div>

          {stats.length > 0 && (
            <dl className="hero-in hidden lg:grid grid-cols-1 gap-3 min-w-[200px]" style={{ animationDelay: '.4s' }}>
              {stats.map((s, i) => (
                <div key={i} className="rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md px-5 py-3">
                  <dd className="text-2xl font-extrabold text-white leading-none">{s.v}</dd>
                  <dt className="text-xs text-ocean-200 mt-1 uppercase tracking-wider">{s.l}</dt>
                </div>
              ))}
            </dl>
          )}
        </div>
      </div>

      {/* Vague à 2 couches vers le contenu */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="block w-full h-12 md:h-16" fill="none">
          <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,10 1440,40 L1440,80 L0,80 Z" fill="rgba(255,255,255,.35)" />
          <path d="M0,55 C300,20 600,80 900,50 C1100,30 1300,60 1440,50 L1440,80 L0,80 Z" fill="#fff" />
        </svg>
      </div>
    </section>
  )
}
