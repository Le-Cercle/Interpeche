import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import { Fish, BookOpen, Handshake, Users, Megaphone, Leaf, ArrowRight, CheckCircle } from 'lucide-react'
import { SEO } from '../components/SEO'
import seoData from '../data/seo.json'
import { useReveal } from '../hooks/useReveal'

const activities = [
  {
    icon: BookOpen,
    title: 'Formation & Renforcement des capacités',
    desc: 'Organisation de programmes de formation professionnelle pour les pêcheurs, mareyeuses et transformatrices. Ateliers pratiques, séminaires techniques et formations en gestion d\'entreprise.',
    tags: ['Formation', 'Développement', 'Compétences'],
    gradient: 'from-ocean-600 to-ocean-400',
    image: '/assets/img/atelier/atelier (1).jpg',
  },
  {
    icon: Megaphone,
    title: 'Plaidoyer & Défense des intérêts',
    desc: 'Représentation des acteurs auprès des institutions gouvernementales, des bailleurs de fonds et des organisations internationales. Actions de lobbying pour l\'amélioration du cadre réglementaire.',
    tags: ['Plaidoyer', 'Politique', 'Gouvernance'],
    gradient: 'from-coral-500 to-coral-400',
    image: '/assets/img/atelier/atelier (7).jpg',
  },
  {
    icon: Handshake,
    title: 'Partenariats & Coopération',
    desc: 'Développement de partenariats stratégiques avec des organisations nationales et internationales. Accords de coopération avec la BAD, l\'Union Européenne, la FAO et autres partenaires.',
    tags: ['Partenariat', 'International', 'Financement'],
    gradient: 'from-teal-600 to-teal-400',
    image: '/assets/img/news/news-3.jpg',
  },
  {
    icon: Users,
    title: 'Événements & Salons professionnels',
    desc: 'Organisation et participation aux grandes manifestations professionnelles : Salon de la Pêche et de l\'Aquaculture, Foire Nationale de l\'Emploi, journées thématiques départementales.',
    tags: ['Salon', 'Conférence', 'Networking'],
    gradient: 'from-purple-600 to-purple-400',
    image: '/assets/img/PM.jpg',
  },
  {
    icon: Fish,
    title: 'Structuration de la filière',
    desc: 'Mise en place de mécanismes d\'organisation professionnelle : cotisations volontaires obligatoires (CVO), système d\'informations sur le marché, traçabilité des produits halieutiques.',
    tags: ['Organisation', 'Filière', 'Économie'],
    gradient: 'from-ocean-700 to-ocean-500',
    image: '/assets/img/news/news-4.jpg',
  },
  {
    icon: Leaf,
    title: 'Développement durable & Environnement',
    desc: 'Promotion de pratiques de pêche durables et responsables. Actions de sensibilisation sur le repos biologique, la préservation des écosystèmes marins et lagunaires.',
    tags: ['Durabilité', 'Environnement', 'Écosystème'],
    gradient: 'from-green-600 to-green-400',
    image: '/assets/img/news/news-2.jpg',
  },
]

export default function Activities() {
  const [headerRef, headerVisible] = useReveal()
  const [gridRef, gridVisible] = useReveal()

  return (
    <>
      <SEO {...seoData.activities} />
      {/* Header */}
      <PageHero icon={Fish} eyebrow="Nos actions" title="Nos" accent="activités" crumb="Activités" subtitle="Découvrez les multiples actions menées par Interpêche CI pour le développement et la structuration de la filière pêche en Côte d'Ivoire." stats={[{ v: '50+', l: 'Événements organisés' }, { v: '1000+', l: 'Bénéficiaires' }]} />

      {/* Activities grid */}
      <section className="py-20 bg-white" ref={gridRef}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map((act, i) => (
              <article
                key={i}
                className={`card group overflow-hidden transition-all duration-700 ${gridVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={act.image}
                    alt={act.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = `https://picsum.photos/seed/${i + 20}/600/300` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className={`absolute top-3 left-3 w-10 h-10 rounded-xl bg-gradient-to-br ${act.gradient} flex items-center justify-center shadow-lg`}>
                    <act.icon className="w-5 h-5 text-white" />
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-ocean-600 transition-colors">
                    {act.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">
                    {act.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {act.tags.map((tag) => (
                      <span key={tag} className="badge bg-ocean-50 text-ocean-700 text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Programme highlight */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <span className="section-label">Programme phare</span>
            <h2 className="section-title">Formation des mareyeuses 2025</h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <img
              src="/assets/img/news/02-10/10/WhatsApp Image 2025-10-02 à 01.43.01_c8275d96.jpg"
              alt="Formation mareyeuses"
              className="rounded-3xl w-full h-72 object-cover shadow-xl"
              onError={(e) => { e.target.src = 'https://picsum.photos/seed/formation/700/400' }}
            />
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="badge badge-formation">Formation</span>
                <span className="text-gray-400 text-sm">Septembre 2025 · Yamoussoukro</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">30 femmes renforcent leurs capacités en techniques de vente</h3>
              <p className="text-gray-500 leading-relaxed mb-6">
                Un atelier de formation aux techniques de vente s'est tenu du 1er au 4 septembre 2025 à l'hôtel Palace de Yamoussoukro, rassemblant plus de 30 mareyeuses pour améliorer leurs compétences commerciales et leur gestion d'entreprise.
              </p>
              <ul className="space-y-2 mb-8">
                {['Techniques de vente et négociation', 'Gestion financière et comptabilité de base', 'Hygiène et conservation des produits', 'Accès aux financements'].map((p) => (
                  <li key={p} className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle className="w-5 h-5 text-ocean-500 flex-shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
              <Link to="/actualites" className="btn-secondary">
                Voir toutes les actualités <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 relative overflow-hidden text-white text-center"
        style={{ background: 'linear-gradient(135deg,#000b18 0%,#001e3c 45%,#003566 100%)' }}
      >
        <div className="caustic-overlay" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle,white 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="container max-w-2xl relative">
          <h2 className="text-3xl font-bold mb-4">Participez à nos activités</h2>
          <p className="text-ocean-200 mb-8">Rejoignez nos prochains ateliers, formations et événements organisés par Interpêche CI.</p>
          <Link to="/contact" className="btn-primary btn-ocean-glow">
            Nous contacter <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  )
}
