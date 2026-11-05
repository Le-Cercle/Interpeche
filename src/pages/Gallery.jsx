import { useState, useEffect } from 'react'
import PageHero from '../components/PageHero'
import { X, ZoomIn, Images, ChevronLeft, ChevronRight } from 'lucide-react'
import { SEO } from '../components/SEO'
import seoData from '../data/seo.json'
import { useReveal } from '../hooks/useReveal'
import { gallery as galleryApi } from '../services/api'
import { EmptyState, SkeletonGrid } from '../components/EmptyState'

const mapPhoto = (p) => ({ ...p, src: p.image_url, cat: p.category })

const categories = ['Toutes', 'Ateliers', 'Événements', 'Formations', 'Partenariats']

export default function Gallery() {
  const [allPhotos, setAllPhotos]           = useState([])
  const [activeCategory, setActiveCategory] = useState('Toutes')
  const [lightbox, setLightbox]             = useState(null)
  const [loaded, setLoaded]                 = useState(false)
  const [headerRef, headerVisible]          = useReveal()
  const [gridRef, gridVisible]              = useReveal()

  useEffect(() => {
    galleryApi.list({ limit: 200, published: 1 })
      .then((rows) => setAllPhotos((Array.isArray(rows) ? rows : []).map(mapPhoto)))
      .catch(console.error)
      .finally(() => setLoaded(true))
  }, [])

  const filtered = allPhotos.filter((p) => activeCategory === 'Toutes' || p.cat === activeCategory)

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
      <PageHero icon={Images} eyebrow="Médiathèque" title="Galerie" accent="photos" crumb="Galerie photos" subtitle="Revivez les moments forts d'Interpêche CI : ateliers, événements, formations et partenariats." />

      {/* Filters */}
      <section className="py-6 bg-white border-b border-gray-100 sticky top-20 z-30 shadow-sm">
        <div className="container">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
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
                  ({cat === 'Toutes' ? allPhotos.length : allPhotos.filter((p) => p.cat === cat).length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Masonry Grid */}
      <section className="py-10 bg-gray-50 min-h-[60vh]" ref={gridRef}>
        <div className="container">
          {!loaded && <SkeletonGrid n={8} />}
          {loaded && filtered.length === 0 && (
            <EmptyState icon={Images} title="Aucune photo pour le moment"
              text={activeCategory === 'Toutes' ? 'Les photos seront bientôt disponibles. Revenez nous voir !' : `Aucune photo dans « ${activeCategory} ».`}
              action={activeCategory !== 'Toutes' && <button onClick={() => setActiveCategory('Toutes')} className="btn-outline-ocean">Voir toutes les photos</button>} />
          )}
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
