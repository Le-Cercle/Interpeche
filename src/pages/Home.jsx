import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  Fish, Users, Calendar, Handshake, Award, Lightbulb,
  ArrowRight, ChevronLeft, ChevronRight, MapPin, Phone,
  Mail, Send, CheckCircle, TrendingUp, Shield, Globe, Waves,
} from 'lucide-react'
import { SEO } from '../components/SEO'
import { articles as articlesApi } from '../services/api'
import seoData from '../data/seo.json'

const MONTHS_FR = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']
function formatDateFR(iso) {
  if (!iso) return ''
  const [y, m, d] = (iso.split('T')[0]).split('-')
  return `${parseInt(d, 10)} ${MONTHS_FR[parseInt(m, 10) - 1]} ${y}`
}
const mapArticle = (a) => ({
  ...a,
  image:    a.image_url,
  auteur:   a.auteur_nom,
  date:     formatDateFR(a.date_publication),
  carousel: Boolean(a.carousel),
})
import NewsModal from '../components/NewsModal'
import LazyImage from '../components/LazyImage'
import { useReveal } from '../hooks/useReveal'

/* ─── Animated counter with ease-out ─── */
function useCounter(target, duration = 2000, active = false) {
  const [count, setCount] = useState(0)
  const [ticking, setTicking] = useState(false)
  const prevRef = useRef(0)

  useEffect(() => {
    if (!active) return
    let start = null
    const easeOut = (t) => 1 - Math.pow(1 - t, 3) // cubic ease-out
    const raf = (ts) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      const next = Math.floor(easeOut(p) * target)
      if (next !== prevRef.current) {
        prevRef.current = next
        setCount(next)
        setTicking(true)
        setTimeout(() => setTicking(false), 80)
      }
      if (p < 1) requestAnimationFrame(raf)
      else setCount(target)
    }
    requestAnimationFrame(raf)
  }, [active, target, duration])

  return [count, ticking]
}

/* ─── Category badge ─── */
function CategoryBadge({ cat }) {
  const map = {
    'Événement': 'badge-evenement', 'Formation': 'badge-formation',
    'Gouvernance': 'badge-gouvernance', 'Distinction': 'badge-distinction',
    'Économie Bleue': 'badge-economie', 'Partenariat': 'badge-partenariat',
    'Innovation': 'badge-innovation',
  }
  return <span className={`badge ${map[cat] || 'badge-default'}`}>{cat}</span>
}

/* ─── Bubble configs (fixed, no Math.random at render) ─── */
const BUBBLES = [
  { size: 7,  left: '4%',  delay: '0s',   dur: '11s' },
  { size: 13, left: '10%', delay: '2.2s', dur: '14s' },
  { size: 5,  left: '18%', delay: '4s',   dur: '10s' },
  { size: 18, left: '25%', delay: '0.8s', dur: '16s' },
  { size: 9,  left: '33%', delay: '3.5s', dur: '12s' },
  { size: 6,  left: '40%', delay: '1.5s', dur: '9s'  },
  { size: 15, left: '50%', delay: '5s',   dur: '15s' },
  { size: 8,  left: '58%', delay: '0.3s', dur: '11s' },
  { size: 20, left: '65%', delay: '2.8s', dur: '17s' },
  { size: 6,  left: '72%', delay: '4.8s', dur: '10s' },
  { size: 11, left: '79%', delay: '1.2s', dur: '13s' },
  { size: 4,  left: '85%', delay: '3.2s', dur: '8s'  },
  { size: 16, left: '91%', delay: '6s',   dur: '15s' },
  { size: 8,  left: '96%', delay: '0.6s', dur: '12s' },
  { size: 10, left: '22%', delay: '7s',   dur: '14s' },
  { size: 7,  left: '60%', delay: '8s',   dur: '11s' },
]

/* ─── Light rays ─── */
const RAYS = [
  { left: '7%',  width: 70,  delay: '0s',   dur: '7s'  },
  { left: '20%', width: 130, delay: '2.5s', dur: '9s'  },
  { left: '38%', width: 55,  delay: '5s',   dur: '6s'  },
  { left: '58%', width: 100, delay: '1.2s', dur: '8s'  },
  { left: '78%', width: 80,  delay: '3.8s', dur: '7s'  },
  { left: '90%', width: 50,  delay: '6s',   dur: '10s' },
]

/* ─── 3-layer animated waves ─── */
function OceanWaves() {
  return (
    <div className="wave-container">
      {/* Wave 3 — deep navy, slowest */}
      <div className="wave-layer wave-3">
        <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,70 C180,100 360,40 540,70 C720,100 900,40 1080,70 C1260,100 1350,55 1440,70 L1440,120 L0,120 Z" fill="rgba(0,30,60,0.65)" />
          <path d="M1440,70 C1260,100 1080,40 900,70 C720,100 540,40 360,70 C180,100 90,55 0,70 L0,120 L1440,120 Z" fill="rgba(0,30,60,0.65)" />
        </svg>
      </div>
      {/* Wave 2 — ocean blue tint, medium */}
      <div className="wave-layer wave-2">
        <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,80 C240,110 480,50 720,80 C960,110 1200,50 1440,80 L1440,120 L0,120 Z" fill="rgba(0,105,148,0.35)" />
          <path d="M1440,80 C1200,110 960,50 720,80 C480,110 240,50 0,80 L0,120 L1440,120 Z" fill="rgba(0,105,148,0.35)" />
        </svg>
      </div>
      {/* Wave 1 — white, fastest → transitions to next white section */}
      <div className="wave-layer wave-1">
        <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,90 C160,120 320,65 480,90 C640,115 800,62 960,90 C1120,118 1280,70 1440,90 L1440,120 L0,120 Z" fill="white" />
          <path d="M1440,90 C1280,120 1120,65 960,90 C800,115 640,62 480,90 C320,118 160,70 0,90 L0,120 L1440,120 Z" fill="white" />
        </svg>
      </div>
    </div>
  )
}

/* ─── Fish that swims across once, then repeats ─── */
function SwimmingFish({ top, delay, duration, flipped, size }) {
  const [phase, setPhase] = useState(0) // 0=hidden, 1=swimming

  useEffect(() => {
    const interval = (delay + duration + 25) * 1000
    // First appearance
    const t1 = setTimeout(() => setPhase(1), delay * 1000)
    const t2 = setTimeout(() => setPhase(0), (delay + duration) * 1000)
    // Repeat
    const repeat = setInterval(() => {
      setPhase(1)
      setTimeout(() => setPhase(0), duration * 1000)
    }, interval)
    return () => { clearTimeout(t1); clearTimeout(t2); clearInterval(repeat) }
  }, [delay, duration])

  if (phase === 0) return null

  return (
    <div
      className="fish-swim-anim"
      style={{
        top,
        animationDuration: `${duration}s`,
        ...(flipped
          ? { right: 0, animationName: 'fish-swim-reverse' }
          : { left: 0,  animationName: 'fish-swim' }),
      }}
    >
      <Fish
        style={{
          width: size,
          height: size,
          color: 'rgba(144,224,239,0.5)',
          filter: 'drop-shadow(0 0 8px rgba(0,180,216,0.6))',
        }}
      />
    </div>
  )
}

/* ─── Services ─── */
const services = [
  { icon: Users,     gradient: 'from-ocean-600 to-ocean-400', title: 'Coordination des Acteurs',    desc: 'Fédération de tous les acteurs — pêcheurs, mareyeuses, transformateurs, armateurs.' },
  { icon: Shield,    gradient: 'from-coral-500 to-coral-400',  title: 'Défense des Intérêts',        desc: 'Représentation et plaidoyer auprès des institutions gouvernementales et partenaires.' },
  { icon: Calendar,  gradient: 'from-ocean-500 to-ocean-300',  title: "Organisation d'Événements",   desc: 'Séminaires, ateliers, conférences et salons professionnels pour dynamiser la filière.' },
  { icon: Award,     gradient: 'from-purple-600 to-purple-400', title: 'Renforcement des Capacités', desc: 'Programmes de formation professionnelle pour améliorer compétences et productivité.' },
  { icon: Handshake, gradient: 'from-teal-600 to-teal-400',    title: 'Partenariats Stratégiques',   desc: 'Développement de coopérations nationales et internationales dans le secteur.' },
  { icon: Lightbulb, gradient: 'from-coral-600 to-ocean-400',  title: 'Innovation & Développement',  desc: 'Promotion de pratiques innovantes et durables pour un secteur halieutique compétitif.' },
]

export default function Home() {
  const [carouselNews, setCarouselNews] = useState([])
  const [recentNews, setRecentNews]     = useState([])

  const [slide, setSlide] = useState(0)
  const [selectedArticle, setArticle] = useState(null)
  const [statsRef,    statsVisible]    = useReveal()
  const [servicesRef, servicesVisible] = useReveal()
  const [newsRef,     newsVisible]     = useReveal()
  const [aboutRef,    aboutVisible]    = useReveal()

  const [s1, t1] = useCounter(500,  2000, statsVisible)
  const [s2, t2] = useCounter(50,   1500, statsVisible)
  const [s3, t3] = useCounter(20,   1200, statsVisible)
  const [s4, t4] = useCounter(1000, 2500, statsVisible)

  useEffect(() => {
    articlesApi.carousel().then((rows) => setCarouselNews((rows || []).map(mapArticle))).catch(console.error)
    articlesApi.recent(3).then((rows) => setRecentNews((rows || []).map(mapArticle))).catch(console.error)
  }, [])

  const prevSlide = useCallback(() => setSlide((s) => (s - 1 + carouselNews.length) % carouselNews.length), [carouselNews.length])
  const nextSlide = useCallback(() => setSlide((s) => (s + 1) % carouselNews.length), [carouselNews.length])

  useEffect(() => {
    if (carouselNews.length === 0) return
    const t = setInterval(nextSlide, 6000)
    return () => clearInterval(t)
  }, [nextSlide, carouselNews.length])

  return (
    <>
      <SEO {...seoData.home} />
      {selectedArticle && <NewsModal article={selectedArticle} onClose={() => setArticle(null)} />}

      {/* ══════════════════════════════════════════
          HERO — Immersive deep ocean
      ══════════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex items-center overflow-hidden"
        style={{ background: 'linear-gradient(180deg,#000b18 0%,#001020 18%,#001e3c 48%,#003566 75%,#006994 100%)' }}
      >
        {/* Caustic light overlay */}
        <div className="caustic-overlay" />

        {/* Light rays */}
        {RAYS.map((ray, i) => (
          <div key={i} className="light-ray"
            style={{ left: ray.left, width: `${ray.width}px`, animationDelay: ray.delay, animationDuration: ray.dur }} />
        ))}

        {/* Rising bubbles */}
        {BUBBLES.map((b, i) => (
          <div key={i} className="bubble"
            style={{ width: `${b.size}px`, height: `${b.size}px`, left: b.left, animationDelay: b.delay, animationDuration: b.dur }} />
        ))}

        {/* Swimming fish */}
        <SwimmingFish top="30%" delay={4}  duration={22} size={24} />
        <SwimmingFish top="58%" delay={16} duration={28} size={34} flipped />
        <SwimmingFish top="72%" delay={30} duration={18} size={16} />

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle,rgba(255,255,255,0.9) 1px,transparent 1px)', backgroundSize: '44px 44px' }} />

        {/* Content */}
        <div className="container relative z-10 pt-28 pb-52">
          <div className="max-w-3xl">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8">
              <span className="w-2 h-2 bg-coral-400 rounded-full animate-pulse" />
              <span className="text-ocean-200 text-sm font-medium">Fondée le 3 août 2023 · Abidjan, Côte d'Ivoire</span>
            </div>

            {/* Title with bioluminescent glow */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
              Au service des{' '}
              <span
                className="block mt-2 title-glow"
                style={{
                  background: 'linear-gradient(90deg,#48cae4 0%,#00b4d8 35%,#ff9f47 65%,#f77f00 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                acteurs de la pêche
              </span>
            </h1>

            <p className="text-lg md:text-xl text-ocean-200 mb-10 max-w-2xl leading-relaxed">
              Interpêche Côte d'Ivoire fédère et représente tous les acteurs de la filière pêche pour un développement{' '}
              <strong className="text-white">durable et équitable</strong> du secteur halieutique ivoirien.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="btn-ocean-glow inline-flex items-center justify-center gap-2 bg-coral-500 hover:bg-coral-600 text-white font-bold px-8 py-4 rounded-xl text-base transition-all duration-300"
              >
                Rejoindre la filière
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/qui-sommes-nous"
                className="inline-flex items-center justify-center gap-2 glass border border-white/30 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:bg-white/15 text-base"
              >
                <Waves className="w-5 h-5 text-ocean-300" />
                En savoir plus
              </Link>
            </div>

            {/* Scroll hint */}
            <div className="mt-14 flex items-center gap-3 text-ocean-500 text-xs">
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-ocean-400 to-transparent" />
              <span className="text-ocean-300">Faites défiler pour explorer</span>
            </div>
          </div>
        </div>

        {/* Animated 3-layer waves */}
        <OceanWaves />
      </section>

      {/* ══════════════════════════════════════════
          STATS — Abysse → surface
      ══════════════════════════════════════════ */}
      <section
        className="py-16 relative overflow-hidden"
        ref={statsRef}
      >
        <div className="container relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8">
            {[
              { value: s1, tick: t1, suffix: '+', label: 'Membres actifs',           icon: Users,      color: 'from-ocean-600 to-ocean-400' },
              { value: s2, tick: t2, suffix: '+', label: 'Événements organisés',     icon: Calendar,   color: 'from-coral-500 to-coral-400' },
              { value: s3, tick: t3, suffix: '+', label: 'Partenaires stratégiques', icon: Globe,      color: 'from-teal-600 to-teal-400'   },
              { value: s4, tick: t4, suffix: '+', label: 'Bénéficiaires',            icon: TrendingUp, color: 'from-purple-600 to-purple-400' },
            ].map((stat, i) => (
              <div
                key={i}
                className={`stat-card-ocean text-center p-6 rounded-2xl bg-white border border-ocean-100 transition-all duration-700 ${
                  statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {/* Icon */}
                <div className={`inline-flex w-12 h-12 rounded-2xl items-center justify-center mb-4 bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>

                {/* Animated number */}
                <div
                  className="text-4xl md:text-5xl font-extrabold gradient-text tabular-nums transition-all duration-75"
                  style={{
                    transform: stat.tick ? 'scale(1.12)' : 'scale(1)',
                    textShadow: stat.tick ? '0 0 20px rgba(0,180,216,0.6)' : 'none',
                  }}
                >
                  {stat.value.toLocaleString('fr-FR')}{stat.suffix}
                </div>

                {/* Label */}
                <div className="text-gray-500 text-sm mt-2 font-medium">{stat.label}</div>

                {/* Tick flash bar */}
                <div
                  className="mt-3 h-0.5 rounded-full mx-auto transition-all duration-75"
                  style={{
                    width: stat.tick ? '80%' : '30%',
                    background: stat.tick
                      ? 'linear-gradient(90deg,#00b4d8,#48cae4)'
                      : 'rgba(0,180,216,0.2)',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          NEWS CAROUSEL
      ══════════════════════════════════════════ */}
      {carouselNews.length > 0 && (
        <section className="py-20 relative" style={{ background: '#f3f4f6' }}>
          <div className="container">
            <div className="text-center mb-12">
              <span className="section-label">À la Une</span>
              <h2 className="section-title">Actualités récentes</h2>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl group"
              style={{ boxShadow: '0 30px 80px rgba(0,11,24,0.35)' }}>
              <div className="relative h-[480px] md:h-[520px]">
                {carouselNews.map((item, i) => (
                  <div key={item.id} className="absolute inset-0 carousel-slide cursor-pointer"
                    style={{ opacity: i === slide ? 1 : 0, zIndex: i === slide ? 1 : 0 }}
                    onClick={() => setArticle(item)}
                    role="button"
                    tabIndex={i === slide ? 0 : -1}
                    onKeyDown={(e) => e.key === 'Enter' && setArticle(item)}
                  >
                    <img src={item.image} alt={item.titre} className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = `https://picsum.photos/seed/${item.id}/1200/520` }} />
                    <div className="absolute inset-0" style={{
                      background: 'linear-gradient(0deg,rgba(0,11,24,0.92) 0%,rgba(0,30,60,0.45) 45%,transparent 100%)',
                    }} />
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                      <CategoryBadge cat={item.categorie} />
                      <h3 className="text-2xl md:text-3xl font-bold text-white mt-3 mb-3 max-w-2xl leading-snug">{item.titre}</h3>
                      <p className="text-ocean-100 text-sm md:text-base max-w-xl line-clamp-2 mb-4">{item.description}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-ocean-300 text-sm">{item.date}</span>
                        <span className="text-ocean-500">·</span>
                        <span className="text-ocean-300 text-sm">{item.auteur}</span>
                        <span className="ml-auto text-white/80 text-sm font-semibold underline-offset-2 hover:underline">
                          Lire l'article →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/15 hover:bg-white/35 backdrop-blur-sm flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
                aria-label="Précédent"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/15 hover:bg-white/35 backdrop-blur-sm flex items-center justify-center text-white transition-all opacity-0 group-hover:opacity-100"
                aria-label="Suivant"><ChevronRight className="w-5 h-5" /></button>

              <div className="absolute bottom-4 right-8 z-10 flex gap-2">
                {carouselNews.map((_, i) => (
                  <button key={i} onClick={() => setSlide(i)}
                    className={`transition-all duration-300 rounded-full ${i === slide ? 'w-6 h-2 bg-coral-400' : 'w-2 h-2 bg-white/45 hover:bg-white/80'}`} />
                ))}
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link to="/actualites" className="btn-outline-ocean">
                Toutes les actualités <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════
          SERVICES — ocean card glow on hover
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-white" ref={servicesRef}>
        <div className="container">
          <div className="text-center mb-14">
            <span className="section-label">Ce que nous faisons</span>
            <h2 className="section-title">Nos services</h2>
            <p className="section-desc mx-auto">
              Interpêche CI œuvre pour le développement intégral de la filière pêche à travers six axes stratégiques.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((srv, i) => (
              <div
                key={i}
                className={`service-card bg-white rounded-2xl p-6 shadow-md transition-all duration-700 ${
                  servicesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className={`service-icon inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br ${srv.gradient} items-center justify-center mb-4`}>
                  <srv.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{srv.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{srv.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ABOUT — Abysse section
      ══════════════════════════════════════════ */}
      <section
        ref={aboutRef}
        className="py-20 relative overflow-hidden text-white"
        style={{ background: 'linear-gradient(135deg,#000b18 0%,#001e3c 45%,#003566 100%)' }}
      >
        {/* Caustic overlay */}
        <div className="caustic-overlay" style={{ opacity: 0.7 }} />

        {/* Ambient bubbles */}
        {[
          { size: 10, left: '5%',  delay: '0s', dur: '14s' },
          { size: 6,  left: '92%', delay: '3s', dur: '11s' },
          { size: 14, left: '48%', delay: '7s', dur: '16s' },
        ].map((b, i) => (
          <div key={i} className="bubble"
            style={{ width: `${b.size}px`, height: `${b.size}px`, left: b.left, animationDelay: b.delay, animationDuration: b.dur, opacity: 0.35 }} />
        ))}

        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle,white 1px,transparent 1px)', backgroundSize: '44px 44px' }} />

        {/* Wave top (white → abysse) */}
        <div className="wave-divider absolute top-0 left-0 right-0" style={{ transform: 'rotate(180deg)' }}>
          <svg viewBox="0 0 1440 55" fill="none" preserveAspectRatio="none">
            <path d="M0,27 C360,54 720,0 1080,27 C1260,41 1380,13 1440,27 L1440,55 L0,55 Z" fill="white" />
          </svg>
        </div>

        <div className="container relative pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div className={`transition-all duration-700 ${aboutVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <span className="section-label text-coral-400">À propos de nous</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-snug">
                Première interprofession de la filière pêche en Côte d'Ivoire
              </h2>
              <p className="text-ocean-200 leading-relaxed mb-8">
                Créée le 3 août 2023, Interpêche-CI rassemble l'ensemble des maillons de la chaîne de valeur halieutique — de la capture à la commercialisation — pour défendre les intérêts communs du secteur.
              </p>
              <ul className="space-y-4 mb-10">
                {[
                  'Coordination de 500+ acteurs de la filière pêche',
                  'Dialogue structuré avec les autorités publiques',
                  "Promotion d'une pêche durable et responsable",
                  'Accès aux financements et aux marchés internationaux',
                ].map((p, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-coral-400 flex-shrink-0 mt-0.5" />
                    <span className="text-ocean-200 text-sm">{p}</span>
                  </li>
                ))}
              </ul>
              <Link to="/qui-sommes-nous" className="btn-primary btn-ocean-glow">
                Découvrir notre histoire <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Image */}
            <div className={`transition-all duration-700 delay-200 ${aboutVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-full h-full rounded-3xl border border-ocean-400/20" />
                <div className="absolute -top-2 -left-2 w-full h-full rounded-3xl border border-coral-500/15" />
                <img
                  src="/assets/img/about.jpg" alt="Interpêche CI"
                  className="relative rounded-3xl w-full h-80 object-cover"
                  style={{ boxShadow: '0 25px 60px rgba(0,11,24,0.7),0 0 0 1px rgba(0,180,216,0.15)' }}
                  onError={(e) => { e.target.src = 'https://picsum.photos/seed/fishing/700/400' }}
                />
                <div
                  className="absolute -bottom-6 -right-4 glass rounded-2xl p-4"
                  style={{ boxShadow: '0 8px 32px rgba(0,11,24,0.5),0 0 20px rgba(0,180,216,0.1)', border: '1px solid rgba(0,180,216,0.2)' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-coral-500 flex items-center justify-center"
                      style={{ boxShadow: '0 0 20px rgba(247,127,0,0.4)' }}>
                      <Fish className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm">Fondée en 2023</div>
                      <div className="text-ocean-300 text-xs">Zone Portuaire, Abidjan</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave bottom (abysse → gray-50) */}
        <div className="wave-divider absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none">
            <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,15 1440,30 L1440,60 L0,60 Z" fill="#f3f4f6" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          RECENT NEWS
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-gray-100" ref={newsRef}>
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="section-label">Restez informé</span>
              <h2 className="section-title mb-0">Dernières nouvelles</h2>
            </div>
            <Link to="/actualites"
              className="hidden sm:flex items-center gap-2 text-ocean-600 hover:text-ocean-700 font-semibold text-sm transition-colors">
              Voir tout <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentNews.map((item, i) => (
              <article
                key={item.id}
                className={`card group cursor-pointer overflow-hidden transition-all duration-700 ${newsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
                onClick={() => setArticle(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setArticle(item)}
              >
                <div className="relative overflow-hidden h-48">
                  <LazyImage src={item.image} alt={item.titre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    fallbackSeed={item.id + 10} />
                  <div className="absolute inset-0 bg-gradient-to-t from-ocean-900/0 group-hover:from-ocean-900/40 to-transparent transition-all duration-500" />
                  <div className="absolute top-3 left-3"><CategoryBadge cat={item.categorie} /></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-xs font-semibold bg-ocean-900/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      Lire l'article
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-xs text-gray-400 mb-2">{item.date} · {item.auteur}</p>
                  <h3 className="font-bold text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-ocean-600 transition-colors">{item.titre}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link to="/actualites" className="btn-outline-ocean">Toutes les actualités <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CONTACT CTA — deep ocean
      ══════════════════════════════════════════ */}
      <section className="py-20 bg-white">
        <div className="container">
          <div
            className="rounded-3xl p-8 md:p-14 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg,#000b18 0%,#001e3c 40%,#003566 80%,#006994 100%)' }}
          >
            {/* Caustic */}
            <div className="caustic-overlay rounded-3xl" />

            {/* Ambient bubbles */}
            {[
              { size: 9,  left: '3%',  delay: '0s', dur: '12s' },
              { size: 13, left: '97%', delay: '4s', dur: '15s' },
              { size: 6,  left: '50%', delay: '8s', dur: '10s' },
            ].map((b, i) => (
              <div key={i} className="bubble"
                style={{ width: `${b.size}px`, height: `${b.size}px`, left: b.left, animationDelay: b.delay, animationDuration: b.dur, opacity: 0.45 }} />
            ))}

            {/* Dot grid */}
            <div className="absolute inset-0 opacity-[0.04]"
              style={{ backgroundImage: 'radial-gradient(circle,white 1px,transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Info */}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Rejoignez la filière pêche ivoirienne
                </h2>
                <p className="text-ocean-200 leading-relaxed mb-6">
                  Que vous soyez pêcheur, mareyeuse, transformateur ou partenaire, Interpêche CI vous accompagne dans votre développement.
                </p>
                <div className="space-y-3">
                  {[
                    { icon: Phone, text: '+225 27 21 73 81 52' },
                    { icon: Mail,  text: 'interpechecotedivoire@gmail.com' },
                    { icon: MapPin, text: 'Zone Portuaire, Abidjan-Treichville' },
                  ].map(({ icon: Icon, text }, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-coral-400 flex-shrink-0" />
                      <span className="text-ocean-200 text-sm">{text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick form */}
              <div
                className="rounded-2xl p-6"
                style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(14px)', border: '1px solid rgba(0,180,216,0.2)' }}
              >
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Send className="w-4 h-4 text-coral-400" /> Message rapide
                </h3>
                <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                  {[{ ph: 'Votre nom', type: 'text' }, { ph: 'Votre email', type: 'email' }].map(({ ph, type }, i) => (
                    <input key={i} type={type} placeholder={ph}
                      className="w-full px-4 py-2.5 text-white placeholder-ocean-400 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-coral-400 transition-colors"
                      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(0,180,216,0.2)' }} />
                  ))}
                  <textarea rows={3} placeholder="Votre message..."
                    className="w-full px-4 py-2.5 text-white placeholder-ocean-400 rounded-xl text-sm resize-none focus:outline-none focus:ring-1 focus:ring-coral-400 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(0,180,216,0.2)' }} />
                  <button type="submit"
                    className="btn-ocean-glow w-full flex items-center justify-center gap-2 bg-coral-500 hover:bg-coral-600 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors">
                    <Send className="w-4 h-4" /> Envoyer le message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
