import { useState, useEffect } from 'react'
import { Play, Video, ExternalLink, ChevronLeft } from 'lucide-react'
import { SEO } from '../components/SEO'
import seoData from '../data/seo.json'
import { useReveal } from '../hooks/useReveal'
import { videos as videosApi } from '../services/api'

/* YouTube embed : attributs complets recommandés par Google */
const YT_ALLOW = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'

const YT = (id) => `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1&color=white`

const MONTHS_FR = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']
function formatDateFR(iso) {
  if (!iso) return ''
  const [y, m, d] = (iso.split('T')[0]).split('-')
  return `${parseInt(d, 10)} ${MONTHS_FR[parseInt(m, 10) - 1]} ${y}`
}

const mapVideo = (v) => ({
  ...v,
  ytId:     v.youtube_id,
  embedUrl: v.embed_url || (v.youtube_id ? YT(v.youtube_id) : ''),
  thumbnail: v.thumbnail_url,
  desc:     v.description,
  date:     formatDateFR(v.date_publication),
  title:    v.titre,
  category: v.categorie,
})

const categories = ['Toutes', 'Documentaire', 'Présentation', 'Formation', 'Événement']

/* Composant player YouTube avec ratio 16:9 fiable */
function YouTubePlayer({ vid }) {
  const ytLink = vid.ytLink || (vid.ytId ? `https://youtu.be/${vid.ytId}` : null)

  return (
    <div className="mb-10">
      <div className="rounded-3xl overflow-hidden shadow-2xl bg-black">
        {vid.embedUrl ? (
          /* padding-bottom 56.25% = ratio 16:9 — fonctionne sur tous les navigateurs */
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={vid.embedUrl}
              title={vid.title}
              className="absolute inset-0 w-full h-full border-0"
              allow={YT_ALLOW}
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        ) : (
          <div className="relative">
            <img
              src={vid.thumbnail}
              alt={vid.title}
              className="w-full h-72 object-cover opacity-30"
              onError={(e) => { e.target.src = `https://picsum.photos/seed/${vid.id + 80}/1200/400` }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-10">
              <div className="w-16 h-16 rounded-full bg-white/10 border border-white/30 flex items-center justify-center mb-4">
                <Play className="w-8 h-8 text-white/60 ml-1" />
              </div>
              <p className="text-white font-bold text-xl mb-2">{vid.title}</p>
              <p className="text-white/60 text-sm mb-5">{vid.desc}</p>
              <p className="text-white/40 text-xs mb-5">Vidéo bientôt disponible sur notre chaîne YouTube</p>
            </div>
          </div>
        )}
      </div>

      {/* Barre sous le player */}
      <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="font-semibold text-gray-900 text-sm">{vid.title}</p>
          <p className="text-gray-400 text-xs">{vid.date}</p>
        </div>
        <div className="flex items-center gap-3">
          {ytLink && (
            <a
              href={ytLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ocean-600 hover:text-ocean-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Voir sur YouTube
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Videos() {
  const [allVideos, setAllVideos]           = useState([])
  const [activeCategory, setActiveCategory] = useState('Toutes')
  const [playing, setPlaying]               = useState(null)
  const [headerRef, headerVisible]          = useReveal()
  const [gridRef, gridVisible]              = useReveal()

  useEffect(() => {
    videosApi.list({ published: 1 })
      .then((rows) => setAllVideos((rows || []).map(mapVideo)))
      .catch(console.error)
  }, [])

  const filtered = allVideos.filter((v) => activeCategory === 'Toutes' || v.category === activeCategory)

  /* Cherche dans TOUS les videos (pas seulement filtered) pour éviter les bugs de filtre */
  const playingVid = playing !== null ? allVideos.find((v) => v.id === playing) : null

  return (
    <>
      <SEO {...seoData.videos} />
      {/* ── Header ── */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-ocean-900 to-ocean-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="container relative text-center" ref={headerRef}>
          <div className={`transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
              <Video className="w-4 h-4 text-coral-400" />
              <span className="text-ocean-100 text-sm">Médiathèque</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Vidéothèque</h1>
            <p className="text-ocean-100 text-lg max-w-xl mx-auto">
              Retrouvez toutes nos vidéos — reportages, événements, formations et temps forts de la filière pêche.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full">
            <path d="M0 60L480 30C720 15 960 15 1440 30V60H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 bg-white border-b border-gray-100 sticky top-20 z-30 shadow-sm">
        <div className="container">
          <div className="flex items-center gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setPlaying(null) }}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat ? 'bg-ocean-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-12 bg-gray-50 min-h-screen" ref={gridRef}>
        <div className="container">

          {/* Player actif */}
          {playingVid && (
            <>
              <button
                onClick={() => setPlaying(null)}
                className="mb-4 text-sm text-gray-500 hover:text-ocean-600 transition-colors flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" /> Retour à la liste
              </button>
              <YouTubePlayer vid={playingVid} />
            </>
          )}

          {/* Vidéo mise en avant (quand rien ne joue) */}
          {filtered[0] && !playingVid && (
            <div
              className={`mb-10 rounded-3xl overflow-hidden shadow-2xl group cursor-pointer transition-all duration-700 ${gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              onClick={() => setPlaying(filtered[0].id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setPlaying(filtered[0].id)}
            >
              <div className="relative h-80 md:h-96">
                <img
                  src={filtered[0].thumbnail}
                  alt={filtered[0].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = 'https://picsum.photos/seed/video/1200/500' }}
                />
                <div className="absolute inset-0 bg-ocean-900/40 group-hover:bg-ocean-900/50 transition-colors flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-ocean-900/80 to-transparent">
                  <span className="badge badge-evenement mb-2">{filtered[0].category}</span>
                  <h2 className="text-2xl font-bold text-white">{filtered[0].title}</h2>
                  <p className="text-ocean-200 text-sm mt-1">{filtered[0].date}</p>
                </div>
              </div>
            </div>
          )}

          {/* Grille des vidéos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.slice(playingVid ? 0 : 1).map((video, i) => (
              <article
                key={video.id}
                className={`card group cursor-pointer overflow-hidden transition-all duration-700 ${
                  gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                } ${playingVid?.id === video.id ? 'ring-2 ring-ocean-500' : ''}`}
                style={{ transitionDelay: `${i * 80}ms` }}
                onClick={() => setPlaying(video.id)}
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = `https://picsum.photos/seed/${video.id + 60}/600/300` }}
                  />
                  <div className="absolute inset-0 bg-ocean-900/30 group-hover:bg-ocean-900/50 transition-colors flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/20 border border-white/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 text-white ml-0.5" />
                    </div>
                  </div>
                  {!video.embedUrl && (
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-md">
                      Bientôt
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <span className={`badge ${{ 'Documentaire': 'badge-default', 'Présentation': 'badge-gouvernance', 'Formation': 'badge-formation', 'Événement': 'badge-evenement' }[video.category] || 'badge-default'} mb-2`}>{video.category}</span>
                  <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-ocean-600 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-gray-400 text-xs mt-1">{video.date}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
