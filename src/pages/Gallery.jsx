import { useState, useEffect } from 'react'
import { X, ZoomIn, Images, ChevronLeft, ChevronRight } from 'lucide-react'
import { SEO } from '../components/SEO'
import seoData from '../data/seo.json'
import { useReveal } from '../hooks/useReveal'

const categories = ['Toutes', 'Ateliers', 'Événements', 'Formations', 'Partenariats']

const photos = [
  { id: 1, src: '/assets/img/atelier/atelier (1).jpg', cat: 'Ateliers', title: 'Atelier de travail', cols: 1, rows: 1 },
  { id: 2, src: '/assets/img/atelier/atelier (2).jpg', cat: 'Ateliers', title: 'Session de formation', cols: 1, rows: 2 },
  { id: 3, src: '/assets/img/atelier/atelier (3).jpg', cat: 'Ateliers', title: 'Présentation technique', cols: 1, rows: 1 },
  { id: 4, src: '/assets/img/atelier/atelier (4).jpg', cat: 'Ateliers', title: 'Échange d\'expériences', cols: 2, rows: 1 },
  { id: 5, src: '/assets/img/atelier/atelier (5).jpg', cat: 'Ateliers', title: 'Groupe de travail', cols: 1, rows: 1 },
  { id: 6, src: '/assets/img/atelier/atelier (6).jpg', cat: 'Ateliers', title: 'Démonstration pratique', cols: 1, rows: 1 },
  { id: 7, src: '/assets/img/atelier/atelier (7).jpg', cat: 'Événements', title: 'Cérémonie officielle', cols: 1, rows: 1 },
  { id: 8, src: '/assets/img/news/news-1.jpg', cat: 'Événements', title: 'Campagne 2025', cols: 1, rows: 1 },
  { id: 9, src: '/assets/img/news/news-2.jpg', cat: 'Événements', title: 'Activités filière', cols: 1, rows: 1 },
  { id: 10, src: '/assets/img/news/news-3.jpg', cat: 'Partenariats', title: 'Réunion BAD', cols: 2, rows: 1 },
  { id: 11, src: '/assets/img/news/news-4.jpg', cat: 'Formations', title: 'Calendrier pêche', cols: 1, rows: 1 },
  { id: 12, src: '/assets/img/news/news-5.jpg', cat: 'Formations', title: 'Repos biologique', cols: 1, rows: 1 },
  { id: 13, src: '/assets/img/news/news-6.jpg', cat: 'Événements', title: 'Inauguration siège', cols: 1, rows: 1 },
  { id: 14, src: '/assets/img/PM.jpg', cat: 'Événements', title: 'Salon pêche 2025', cols: 1, rows: 1 },
  { id: 15, src: '/assets/img/about.jpg', cat: 'Partenariats', title: 'Interpêche CI', cols: 1, rows: 1 },

  /* ─── COMATPH-CI — AG 2026 ─── */
  { id: 16, src: '/assets/img/news/comatph/comatph-01.jpeg', cat: 'Événements', title: 'AG COMATPH-CI', cols: 1, rows: 1 },
  { id: 17, src: '/assets/img/news/comatph/comatph-02.jpeg', cat: 'Événements', title: 'Présidente COMATPH-CI', cols: 1, rows: 1 },
  { id: 18, src: '/assets/img/news/comatph/comatph-03.jpeg', cat: 'Événements', title: 'Habdramane Coulibaly', cols: 1, rows: 1 },
  { id: 19, src: '/assets/img/news/comatph/comatph-04.jpeg', cat: 'Événements', title: 'Cellule genre du ministère', cols: 1, rows: 1 },
  { id: 20, src: '/assets/img/news/comatph/comatph-05.jpeg', cat: 'Événements', title: 'Mareyeuses et transformatrices', cols: 1, rows: 1 },
  { id: 21, src: '/assets/img/news/comatph/comatph-06.jpeg', cat: 'Événements', title: 'Photo de groupe COMATPH-CI', cols: 1, rows: 1 },

  /* ─── Gouvernance des interprofessions — DOPAF 2026 ─── */
  { id: 22, src: '/assets/img/news/gouvernance-interprofessions/atelier-01.jpeg', cat: 'Ateliers', title: 'Atelier national OIA', cols: 1, rows: 1 },
  { id: 23, src: '/assets/img/news/gouvernance-interprofessions/atelier-02.jpeg', cat: 'Ateliers', title: 'Kassogué Daouda — DOPAF', cols: 1, rows: 1 },
  { id: 24, src: '/assets/img/news/gouvernance-interprofessions/atelier-03.jpeg', cat: 'Ateliers', title: 'Responsables des interprofessions', cols: 1, rows: 1 },
  { id: 25, src: '/assets/img/news/gouvernance-interprofessions/atelier-04.jpeg', cat: 'Ateliers', title: 'Ouverture officielle DOPAF', cols: 1, rows: 1 },

  /* ─── Autonomisation des femmes — San Pedro ─── */
  { id: 26, src: '/assets/img/news/autonomisation-femmes/autonomisation-1.jpeg', cat: 'Événements', title: 'Délégation Coopérative Espoir', cols: 1, rows: 1 },
  { id: 27, src: '/assets/img/news/autonomisation-femmes/autonomisation-2.jpeg', cat: 'Événements', title: 'Conteneur frigorifique 40 pieds', cols: 1, rows: 1 },

  /* ─── Partenariat SURIMI — Uminokuni ─── */
  { id: 28, src: '/assets/img/news/02-06/02-06 (1).jpeg', cat: 'Partenariats', title: 'Réunion SURIMI', cols: 1, rows: 1 },
  { id: 29, src: '/assets/img/news/02-06/02-06 (2).jpeg', cat: 'Partenariats', title: 'Délégation Uminokuni', cols: 1, rows: 1 },
  { id: 30, src: '/assets/img/news/02-06/02-06 (3).jpeg', cat: 'Partenariats', title: 'Projets SURIMI', cols: 1, rows: 1 },
  { id: 31, src: '/assets/img/news/02-06/02-06 (4).jpeg', cat: 'Partenariats', title: 'Kassogué Daouda et délégation japonaise', cols: 1, rows: 1 },
  { id: 32, src: '/assets/img/news/02-06/02-06 (5).jpeg', cat: 'Partenariats', title: 'Séance de travail SURIMI', cols: 1, rows: 1 },
  { id: 33, src: '/assets/img/news/02-06/02-06 (6).jpeg', cat: 'Partenariats', title: 'Engagement INTERPÊCHE-CI', cols: 1, rows: 1 },
  { id: 34, src: '/assets/img/news/02-06/02-06 (7).jpeg', cat: 'Partenariats', title: 'Visite Port de Pêche', cols: 1, rows: 1 },
  { id: 35, src: '/assets/img/news/02-06/02-06 (8).jpeg', cat: 'Partenariats', title: 'Infrastructures halieutiques', cols: 1, rows: 1 },
  { id: 36, src: '/assets/img/news/02-06/02-06 (9).jpeg', cat: 'Partenariats', title: 'Coopération CI-Japon', cols: 1, rows: 1 },

  /* ─── Économie bleue — Audience ministérielle ─── */
  { id: 37, src: '/assets/img/interpeche/developpement (1).jpeg', cat: 'Événements', title: 'Audience au cabinet du ministre', cols: 1, rows: 1 },
  { id: 38, src: '/assets/img/interpeche/developpement (2).jpeg', cat: 'Événements', title: 'Projets de l\'économie bleue', cols: 1, rows: 1 },
  { id: 39, src: '/assets/img/interpeche/developpement (3).jpeg', cat: 'Événements', title: 'Plan stratégique filière pêche', cols: 1, rows: 1 },
  { id: 40, src: '/assets/img/interpeche/developpement (4).jpeg', cat: 'Événements', title: 'Partenariats internationaux', cols: 1, rows: 1 },
  { id: 41, src: '/assets/img/interpeche/developpement (5).jpeg', cat: 'Événements', title: 'Rencontre au ministère', cols: 1, rows: 1 },

  /* ─── Formation des mareyeuses — Yamoussoukro 2025 ─── */
  { id: 42, src: '/assets/img/news/02-10/10/WhatsApp Image 2025-10-02 à 01.43.01_c8275d96.jpg', cat: 'Formations', title: 'Formation des mareyeuses', cols: 1, rows: 1 },
  { id: 43, src: '/assets/img/news/02-10/10/WhatsApp Image 2025-10-02 à 01.43.02_ebe4de44.jpg', cat: 'Formations', title: 'Participantes à la formation', cols: 1, rows: 1 },

  /* ─── Cotisations Volontaires Obligatoires — CVO ─── */
  { id: 44, src: '/assets/img/news/02-10/IMG_4562.png', cat: 'Ateliers', title: 'Réunion du Conseil d\'Administration', cols: 1, rows: 1 },
  { id: 45, src: '/assets/img/news/02-10/IMG_4478.png', cat: 'Ateliers', title: 'Participants à la réunion CVO', cols: 1, rows: 1 },
  { id: 46, src: '/assets/img/news/02-10/IMG_4479.png', cat: 'Ateliers', title: 'Discussions sur l\'autofinancement', cols: 1, rows: 1 },

  /* ─── Remise des décrets OIA — 2025 ─── */
  { id: 47, src: '/assets/img/atelier/atelier (8).jpg', cat: 'Ateliers', title: 'Cérémonie OIA', cols: 1, rows: 1 },
  { id: 48, src: '/assets/img/atelier/atelier (9).jpg', cat: 'Ateliers', title: 'Acteurs du secteur', cols: 1, rows: 1 },
  { id: 49, src: '/assets/img/atelier/atelier (10).jpg', cat: 'Ateliers', title: 'Remise des documents', cols: 1, rows: 1 },
  { id: 50, src: '/assets/img/atelier/atelier (11).jpg', cat: 'Ateliers', title: 'Moment de la cérémonie', cols: 1, rows: 1 },
  { id: 51, src: '/assets/img/atelier/atelier (12).jpg', cat: 'Ateliers', title: 'Représentants officiels', cols: 1, rows: 1 },
  { id: 52, src: '/assets/img/atelier/atelier (13).jpg', cat: 'Ateliers', title: 'Photo de groupe OIA', cols: 1, rows: 1 },

  /* ─── Journée Départementale Grand-Lahou ─── */
  { id: 53, src: '/assets/img/news/grand-lahou-21-11/edition-6 (1).jpeg', cat: 'Événements', title: 'Journée Départementale Grand-Lahou', cols: 1, rows: 1 },
  { id: 54, src: '/assets/img/news/grand-lahou-21-11/edition-6 (2).jpeg', cat: 'Événements', title: 'Participants Grand-Lahou', cols: 1, rows: 1 },
  { id: 55, src: '/assets/img/news/grand-lahou-21-11/edition-6 (3).jpeg', cat: 'Événements', title: 'Discours Grand-Lahou', cols: 1, rows: 1 },
  { id: 56, src: '/assets/img/news/grand-lahou-21-11/edition-6 (4).jpeg', cat: 'Événements', title: 'Remise des récompenses', cols: 1, rows: 1 },
  { id: 57, src: '/assets/img/news/grand-lahou-21-11/edition-6 (5).jpeg', cat: 'Événements', title: 'Photo de groupe Grand-Lahou', cols: 1, rows: 1 },

  /* ─── Délocalisation du marché aux poissons ─── */
  { id: 58, src: '/assets/img/interpeche/delocalisation.jpeg', cat: 'Événements', title: 'Visite du nouveau site', cols: 1, rows: 1 },

  /* ─── Présentation de vœux 2024 ─── */
  { id: 59, src: '/assets/img/interpeche/IMG-20241207-WA0005.jpg', cat: 'Événements', title: 'Présentation de vœux 2024', cols: 1, rows: 1 },
  { id: 60, src: '/assets/img/interpeche/IMG-20241207-WA0006.jpg', cat: 'Événements', title: 'Cérémonie officielle', cols: 1, rows: 1 },
  { id: 61, src: '/assets/img/interpeche/IMG-20241207-WA0007.jpg', cat: 'Événements', title: 'Présentation de vœux', cols: 1, rows: 1 },
  { id: 62, src: '/assets/img/interpeche/IMG-20241207-WA0008.jpg', cat: 'Événements', title: 'Discours du Président', cols: 1, rows: 1 },
  { id: 63, src: '/assets/img/interpeche/IMG-20241207-WA0009.jpg', cat: 'Événements', title: 'Équipe Interpêche', cols: 1, rows: 1 },
  { id: 64, src: '/assets/img/interpeche/IMG-20241207-WA0010.jpg', cat: 'Événements', title: 'Invités d\'honneur', cols: 1, rows: 1 },

  /* ─── Salon de la pêche ─── */
  { id: 65, src: '/assets/img/PM2.jpg', cat: 'Événements', title: 'Salon de la pêche 2025', cols: 1, rows: 1 },
  { id: 66, src: '/assets/img/PM3.jpg', cat: 'Événements', title: 'Salon de la pêche — stand', cols: 1, rows: 1 },
  { id: 67, src: '/assets/img/PM4.jpg', cat: 'Événements', title: 'Salon de la pêche — clôture', cols: 1, rows: 1 },

  /* ─── Port d'Abidjan 75 ans ─── */
  { id: 68, src: '/assets/img/news/port-abidjan-75ans/port-abidjan.jpg', cat: 'Événements', title: 'Port d\'Abidjan 75 ans', cols: 1, rows: 1 },
]

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('Toutes')
  const [lightbox, setLightbox] = useState(null)
  const [headerRef, headerVisible] = useReveal()
  const [gridRef, gridVisible] = useReveal()

  const filtered = photos.filter((p) => activeCategory === 'Toutes' || p.cat === activeCategory)

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setLightbox(null) }
    if (lightbox !== null) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox])

  const openLightbox = (index) => setLightbox(index)
  const closeLightbox = () => setLightbox(null)
  const prevPhoto = () => setLightbox((i) => (i - 1 + filtered.length) % filtered.length)
  const nextPhoto = () => setLightbox((i) => (i + 1) % filtered.length)

  return (
    <>
      <SEO {...seoData.gallery} />
      {/* Header */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-ocean-900 to-ocean-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="container relative text-center" ref={headerRef}>
          <div className={`transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
              <Images className="w-4 h-4 text-coral-400" />
              <span className="text-ocean-100 text-sm">Médiathèque</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Galerie Photos</h1>
            <p className="text-ocean-100 text-lg max-w-xl mx-auto">Revivez les moments forts d'Interpêche CI — ateliers, événements, formations et partenariats.</p>
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
                onClick={() => setActiveCategory(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat ? 'bg-ocean-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
                <span className="ml-1.5 text-xs opacity-60">
                  ({cat === 'Toutes' ? photos.length : photos.filter((p) => p.cat === cat).length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="py-10 bg-gray-50 min-h-screen" ref={gridRef}>
        <div className="container">
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {filtered.map((photo, i) => (
              <div
                key={photo.id}
                onClick={() => openLightbox(i)}
                className={`relative break-inside-avoid overflow-hidden rounded-xl cursor-pointer group transition-all duration-700 ${
                  gridVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                }`}
                style={{ transitionDelay: `${(i % 12) * 50}ms` }}
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = `https://picsum.photos/seed/${photo.id + 50}/400/300` }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-ocean-900/0 group-hover:bg-ocean-900/50 transition-all duration-300 flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
                </div>
                {/* Title */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-xs font-medium">{photo.title}</p>
                  <p className="text-white/60 text-xs">{photo.cat}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && filtered[lightbox] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {lightbox + 1} / {filtered.length}
          </div>

          {/* Image */}
          <div className="relative max-w-5xl max-h-[90vh] mx-4" onClick={(e) => e.stopPropagation()}>
            <img
              src={filtered[lightbox].src}
              alt={filtered[lightbox].title}
              className="max-h-[85vh] max-w-full object-contain rounded-xl shadow-2xl"
              onError={(e) => { e.target.src = `https://picsum.photos/seed/${filtered[lightbox].id + 50}/800/600` }}
            />
            <div className="mt-3 text-center">
              <p className="text-white font-medium">{filtered[lightbox].title}</p>
              <p className="text-white/50 text-sm">{filtered[lightbox].cat}</p>
            </div>
          </div>

          {/* Nav */}
          <button
            onClick={(e) => { e.stopPropagation(); prevPhoto() }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Photo précédente"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextPhoto() }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Photo suivante"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </>
  )
}
