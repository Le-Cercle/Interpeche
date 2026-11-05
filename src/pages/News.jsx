import { useState, useRef, useEffect, useCallback } from 'react'
import PageHero from '../components/PageHero'
import { Search, Filter, Calendar, User, X, Newspaper } from 'lucide-react'
import { SEO } from '../components/SEO'
import seoData from '../data/seo.json'
import { articles as articlesApi } from '../services/api'
import NewsModal from '../components/NewsModal'
import LazyImage from '../components/LazyImage'
import { useReveal } from '../hooks/useReveal'

const MONTHS_FR = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']
function formatDateFR(iso) {
  if (!iso) return ''
  const [y, m, d] = (iso.split('T')[0]).split('-')
  return `${parseInt(d, 10)} ${MONTHS_FR[parseInt(m, 10) - 1]} ${y}`
}
const mapArticle = (a) => ({
  ...a,
  image:   a.image_url,
  auteur:  a.auteur_nom,
  date:    formatDateFR(a.date_publication),
  carousel: Boolean(a.carousel),
})

/* ─── Category map ─── */
const categories = [
  'Toutes', 'Événement', 'Formation', 'Gouvernance',
  'Distinction', 'Économie Bleue', 'Partenariat', 'Innovation', 'Actualité',
]
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

/* ─── Highlight matching text ─── */
function Highlight({ text, query }) {
  if (!query.trim()) return <>{text}</>
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'gi'))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
          ? <mark key={i} className="bg-ocean-100 text-ocean-800 rounded px-0.5 not-italic font-semibold">{part}</mark>
          : part
      )}
    </>
  )
}

const PAGE_SIZE = 6

export default function News() {
  const [allArticles, setAllArticles]   = useState([])
  const [search, setSearch]             = useState('')
  const [debouncedSearch, setDebounced] = useState('')
  const [activeCategory, setCategory]   = useState('Toutes')
  const [selectedArticle, setArticle]   = useState(null)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [headerRef, headerVisible]      = useReveal()
  const searchRef = useRef(null)

  /* Fetch articles from API */
  useEffect(() => {
    articlesApi.list({ limit: 200, published: 1 })
      .then((rows) => setAllArticles((rows || []).map(mapArticle)))
      .catch(console.error)
  }, [])

  /* Debounce search input by 200ms */
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 200)
    return () => clearTimeout(t)
  }, [search])

  /* Reset pagination when filter/search changes */
  useEffect(() => { setVisibleCount(PAGE_SIZE) }, [activeCategory, debouncedSearch])

  /* Filter articles */
  const filtered = allArticles.filter((n) => {
    const matchCat    = activeCategory === 'Toutes' || n.categorie === activeCategory
    const q           = debouncedSearch.toLowerCase()
    const matchSearch = !q ||
      n.titre.toLowerCase().includes(q) ||
      n.description.toLowerCase().includes(q) ||
      n.auteur.toLowerCase().includes(q)
    return matchCat && matchSearch
  })

  const featured  = filtered[0]
  const restAll   = filtered.slice(1)
  const rest      = restAll.slice(0, visibleCount - 1)  // -1 because featured counts
  const hasMore   = restAll.length > rest.length

  const openArticle  = useCallback((article) => setArticle(article), [])
  const closeArticle = useCallback(() => setArticle(null), [])

  const clearSearch = () => { setSearch(''); searchRef.current?.focus() }
  const loadMore    = () => setVisibleCount((c) => c + PAGE_SIZE)

  return (
    <>
      <SEO {...seoData.news} />
      {/* ── Modal ── */}
      {selectedArticle && <NewsModal article={selectedArticle} onClose={closeArticle} />}

      {/* ── Page header ── */}
      <PageHero icon={Newspaper} eyebrow="Restez informé" title="Toutes les" accent="actualités" crumb="Actualités" subtitle="Suivez toute l'actualité d'Interpêche CI et de la filière pêche en Côte d'Ivoire.">
{/* ── Search bar ── */}
            <div className="relative max-w-lg">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ocean-600 pointer-events-none" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un titre, un auteur, un mot-clé…"
                className="w-full pl-12 pr-12 py-4 rounded-2xl text-base text-gray-900 placeholder-gray-500 bg-white shadow-xl shadow-ocean-950/30 border border-white focus:outline-none focus:ring-4 focus:ring-coral-400/60 transition-all"
              />
              {search && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
                  aria-label="Effacer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search result count */}
            {debouncedSearch && (
              <p className="text-ocean-300 text-sm mt-3">
                {filtered.length} résultat{filtered.length !== 1 ? 's' : ''} pour « <span className="text-white font-medium">{debouncedSearch}</span> »
              </p>
            )}
</PageHero>

      {/* ── Filter bar (sticky) ── */}
      <section className="py-4 bg-white border-b border-gray-100 sticky top-20 z-30 shadow-sm">
        <div className="container">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            {categories.map((cat) => {
              const count = cat === 'Toutes'
                ? allArticles.length
                : allArticles.filter((n) => n.categorie === cat).length
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    activeCategory === cat
                      ? 'bg-ocean-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                  <span className={`ml-1.5 text-xs ${activeCategory === cat ? 'text-ocean-200' : 'text-gray-400'}`}>
                    ({count})
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Articles ── */}
      <section className="py-12 bg-gray-50 min-h-[50vh]">
        <div className="container">

          {/* Empty state */}
          {filtered.length === 0 && (
            <div className="text-center py-24">
              <div className="w-16 h-16 rounded-2xl bg-ocean-50 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-ocean-300" />
              </div>
              <p className="text-lg font-semibold text-gray-700 mb-1">Aucun résultat trouvé</p>
              <p className="text-gray-400 text-sm">
                Essayez un autre mot-clé ou sélectionnez une autre catégorie.
              </p>
              <button
                onClick={() => { setSearch(''); setCategory('Toutes') }}
                className="mt-5 btn-outline-ocean"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}

          {filtered.length > 0 && (
            <>
              {/* Featured article */}
              {featured && (
                <article
                  className="card mb-8 overflow-hidden group cursor-pointer"
                  onClick={() => openArticle(featured)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && openArticle(featured)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Image */}
                    <div className="relative h-64 md:h-auto overflow-hidden">
                      <LazyImage
                        src={featured.image} alt={featured.titre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        fallbackSeed={featured.id}
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
                      {/* "À la une" badge */}
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className={`badge ${categoryClass[featured.categorie] || 'badge-default'}`}>{featured.categorie}</span>
                        <span className="badge bg-coral-50 text-coral-600 font-bold">À la une</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-8 flex flex-col justify-center">
                      <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-ocean-600 transition-colors">
                        <Highlight text={featured.titre} query={debouncedSearch} />
                      </h2>
                      <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-4">
                        <Highlight text={featured.description} query={debouncedSearch} />
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-5">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{featured.date}</span>
                        <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{featured.auteur}</span>
                      </div>
                      <span className="text-ocean-600 text-sm font-semibold group-hover:underline">
                        Lire l'article complet →
                      </span>
                    </div>
                  </div>
                </article>
              )}

              {/* Grid */}
              {rest.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((item, i) => (
                    <article
                      key={item.id}
                      className="card group cursor-pointer overflow-hidden"
                      style={{ animationDelay: `${i * 40}ms` }}
                      onClick={() => openArticle(item)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && openArticle(item)}
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <LazyImage
                          src={item.image} alt={item.titre}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          fallbackSeed={item.id + 100}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ocean-900/0 group-hover:from-ocean-900/35 transition-all duration-500" />
                        <div className="absolute top-3 left-3">
                          <span className={`badge ${categoryClass[item.categorie] || 'badge-default'}`}>{item.categorie}</span>
                        </div>
                        {/* Read overlay hint */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-white text-xs font-semibold bg-ocean-900/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
                            Lire l'article
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="font-bold text-gray-900 leading-snug mb-2 line-clamp-2 group-hover:text-ocean-600 transition-colors">
                          <Highlight text={item.titre} query={debouncedSearch} />
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-3">
                          <Highlight text={item.description} query={debouncedSearch} />
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{item.date}</span>
                          <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{item.auteur}</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* Charger plus */}
              {hasMore && (
                <div className="mt-10 text-center">
                  <button
                    onClick={loadMore}
                    className="inline-flex items-center gap-2 border-2 border-ocean-600 text-ocean-600 font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:bg-ocean-600 hover:text-white"
                  >
                    Charger plus
                    <span className="text-xs opacity-70">({restAll.length - rest.length} restants)</span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
