import { useState, useEffect } from 'react'
import PageHero from '../components/PageHero'
import { Link } from 'react-router-dom'
import { SEO } from '../components/SEO'
import seoData from '../data/seo.json'
import {
  Fish, Crown, Users, ChevronRight, ChevronLeft,
  Scale, Target, Handshake, Lightbulb, Shield,
  FileText, ArrowRight, Award,
} from 'lucide-react'
import { useReveal } from '../hooks/useReveal'

/* ─── Organs ─── */
const organs = [
  {
    title: 'Assemblée Générale',
    desc: 'Organe suprême de l\'interprofession, réunissant l\'ensemble des membres. Elle se réunit en session ordinaire une fois par an et valide les grandes orientations stratégiques.',
    icon: Users,
    color: 'from-ocean-600 to-ocean-400',
    members: [
      'Représentants des pêcheurs artisanaux',
      'Représentants des mareyeuses',
      'Représentants des transformatrices',
      'Représentants des importateurs/exportateurs',
    ],
  },
  {
    title: 'Conseil d\'Administration',
    desc: 'Organe de gestion de l\'interprofession, chargé de l\'administration et de la gestion des affaires courantes entre deux assemblées générales.',
    icon: Crown,
    color: 'from-coral-500 to-coral-400',
    members: [
      'Président : M. Kassogué Daouda',
      '3 Vice-présidents',
      'Secrétaire Général + Adjoint',
      'Trésorier Général + Adjoint',
    ],
  },
  {
    title: 'Direction Exécutive',
    desc: 'Assure la gestion opérationnelle quotidienne de l\'interprofession et la mise en œuvre des décisions du Conseil d\'Administration.',
    icon: Fish,
    color: 'from-teal-600 to-teal-400',
    members: [
      'Directeur Exécutif : M. Habdramane Coulibaly',
      'Service Communication',
      'Service Technique',
      'Service Financier',
    ],
  },
]

/* ─── Missions ─── */
const missions = [
  {
    icon: Target,
    title: 'Coordination des activités',
    desc: 'Coordonner les actions des différents acteurs de la filière pêche pour une meilleure organisation de la chaîne de valeur halieutique nationale.',
    color: 'bg-ocean-50 text-ocean-600',
    border: 'border-ocean-200',
  },
  {
    icon: Shield,
    title: 'Défense des intérêts',
    desc: 'Défendre les intérêts collectifs des membres auprès des instances publiques, des partenaires techniques et financiers, et des organisations régionales et internationales.',
    color: 'bg-coral-50 text-coral-600',
    border: 'border-coral-200',
  },
  {
    icon: Users,
    title: 'Représentation collective',
    desc: 'Représenter la filière pêche dans les instances nationales, régionales et internationales de décision pour peser sur les politiques halieutiques.',
    color: 'bg-teal-50 text-teal-600',
    border: 'border-teal-200',
  },
]

/* ─── "Pourquoi nous" carousel ─── */
const WHY_US = [
  {
    icon: Target,
    title: 'Mission et Vision',
    subtitle: 'Pêche durable et équitable',
    desc: 'Nous œuvrons pour un développement durable de la filière pêche, équilibrant les impératifs économiques et la préservation des ressources halieutiques pour les générations futures.',
    bg: 'linear-gradient(135deg,#000b18 0%,#001e3c 50%,#0077b6 100%)',
    accent: '#00b4d8',
    stat: '500+', statLabel: 'membres actifs',
  },
  {
    icon: Lightbulb,
    title: 'Soutien aux acteurs',
    subtitle: 'Formation continue',
    desc: 'Nous proposons des formations continues, un accompagnement technique personnalisé et un accès facilité aux financements pour tous les acteurs — pêcheurs, mareyeuses, transformatrices, armateurs.',
    bg: 'linear-gradient(135deg,#042f2e 0%,#0f766e 50%,#14b8a6 100%)',
    accent: '#0d9488',
    stat: '50+', statLabel: 'formations organisées',
  },
  {
    icon: Shield,
    title: 'Défense des intérêts',
    subtitle: 'Plaidoyer et représentation',
    desc: 'Interpêche CI représente les intérêts de ses membres auprès des autorités publiques et des instances nationales et internationales. Votre voix, notre mission.',
    bg: 'linear-gradient(135deg,#0f0c29 0%,#1e1b4b 50%,#312e81 100%)',
    accent: '#6366f1',
    stat: '20+', statLabel: 'partenaires stratégiques',
  },
  {
    icon: Handshake,
    title: 'Partenariats & Innovation',
    subtitle: 'Modernisation de la filière',
    desc: 'Nous développons des partenariats stratégiques nationaux et internationaux pour moderniser les équipements, adopter les technologies innovantes et renforcer la compétitivité de la filière.',
    bg: 'linear-gradient(135deg,#1c0a00 0%,#7c2d12 50%,#c2410c 100%)',
    accent: '#f77f00',
    stat: '1000+', statLabel: 'bénéficiaires',
  },
]

/* ─── Colleges ─── */
const colleges = [
  {
    name: 'Collège des Producteurs',
    desc: 'Regroupant les pêcheurs artisanaux, semi-industriels et industriels.',
    detail: '60% des voix au CA · 17 pêcheurs artisanaux · 3 pêcheurs industriels',
    color: 'border-ocean-500 bg-ocean-50',
  },
  {
    name: 'Collège des Commerçants',
    desc: 'Représentant les commerçantes de poissons frais, congelés et importateurs.',
    detail: '6 mareyeuses · 4 importateurs de thon · 4 grossistes distributeurs',
    color: 'border-coral-400 bg-coral-50',
  },
  {
    name: 'Collège des Transformateurs',
    desc: 'Pour les acteurs de la transformation et de la conservation des produits.',
    detail: 'Fumaison · Séchage · Salaison · Conservation sous vide',
    color: 'border-teal-500 bg-teal-50',
  },
  {
    name: 'Collège des Industriels',
    desc: 'Les propriétaires et exploitants de navires et de frigos industriels.',
    detail: '4 industriels · Armateurs · Opérateurs de chambres froides',
    color: 'border-purple-500 bg-purple-50',
  },
  {
    name: 'Collège des Importateurs/Exportateurs',
    desc: 'Les opérateurs du commerce extérieur des produits halieutiques.',
    detail: 'Import · Export · Négoce international',
    color: 'border-indigo-500 bg-indigo-50',
  },
  {
    name: 'Collège des Fournisseurs',
    desc: 'Les fournisseurs d\'intrants, équipements et services pour la filière.',
    detail: 'Engins de pêche · Carburant · Glace · Emballages',
    color: 'border-amber-500 bg-amber-50',
  },
]

/* ─── Legal texts ─── */
const legalTexts = [
  {
    ref: 'Ordonnance n°2011-473',
    date: '21 décembre 2011',
    title: 'Cadre juridique des Organisations Interprofessionnelles Agricoles',
    desc: 'Ordonnance relative aux interprofessions agricoles en Côte d\'Ivoire. Ce texte fondateur définit le cadre légal de création, d\'organisation et de fonctionnement des OIA, y compris le droit à collecter les Cotisations Volontaires Obligatoires (CVO).',
    icon: Scale,
    color: 'from-ocean-600 to-ocean-400',
  },
  {
    ref: 'Arrêté Interministériel n°014',
    date: '27 décembre 2022',
    title: 'Composition et fonctionnement d\'Interpêche CI',
    desc: 'Arrêté Interministériel portant composition et modalités de fonctionnement de l\'Interprofession de la filière pêche de Côte d\'Ivoire. Ce texte précise la structure des collèges, les règles de représentation et les conditions d\'adhésion à l\'interprofession.',
    icon: FileText,
    color: 'from-coral-500 to-coral-400',
  },
]

export default function Governance() {
  const [headerRef, headerVisible] = useReveal()
  const [orgRef,    orgVisible]    = useReveal()
  const [missionRef, missionVisible] = useReveal()
  const [whyRef,    whyVisible]    = useReveal()
  const [collegeRef, collegeVisible] = useReveal()
  const [legalRef,  legalVisible]  = useReveal()

  const [slide, setSlide] = useState(0)
  const prevSlide = () => setSlide((s) => (s - 1 + WHY_US.length) % WHY_US.length)
  const nextSlide = () => setSlide((s) => (s + 1) % WHY_US.length)

  useEffect(() => {
    const t = setInterval(nextSlide, 5500)
    return () => clearInterval(t)
  }, [])

  return (
    <>
      <SEO {...seoData.governance} />
      {/* ── Header ── */}
      <PageHero icon={Crown} eyebrow="Structure organisationnelle" title="Organisation" accent="& gouvernance" crumb="Organisation" subtitle="Une gouvernance transparente et inclusive pour représenter efficacement tous les acteurs de la filière pêche ivoirienne." />

      {/* ── Organs ── */}
      <section className="py-20 bg-white" ref={orgRef}>
        <div className="container">
          <div className="text-center mb-14">
            <span className="section-label">Structure</span>
            <h2 className="section-title">Organes de gouvernance</h2>
            <p className="section-desc mx-auto">Interpêche CI est dotée d'organes démocratiques garantissant une représentation équilibrée de tous les acteurs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {organs.map((org, i) => (
              <div key={i}
                className={`card p-8 transition-all duration-700 ${orgVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 120}ms` }}>
                <div className={`inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br ${org.color} items-center justify-center mb-5`}>
                  <org.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{org.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{org.desc}</p>
                <ul className="space-y-2">
                  {org.members.map((m, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                      <ChevronRight className="w-3 h-3 text-ocean-400 flex-shrink-0" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Table des missions ── */}
      <section className="py-16 bg-gray-50" ref={missionRef}>
        <div className="container">
          <div className="text-center mb-12">
            <span className="section-label">Rôle</span>
            <h2 className="section-title">Nos 3 missions fondamentales</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {missions.map((m, i) => (
              <div key={i}
                className={`rounded-2xl border-2 p-7 ${m.border} ${m.color.split(' ')[0]} transition-all duration-700 ${missionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: `${i * 100}ms` }}>
                <div className={`inline-flex w-12 h-12 rounded-xl items-center justify-center mb-4 ${m.color}`}>
                  <m.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{m.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── "Pourquoi nous" carousel ── */}
      <section className="py-0" ref={whyRef}>
        <div className={`transition-all duration-700 ${whyVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="relative overflow-hidden" style={{ minHeight: '420px' }}>
            {WHY_US.map((item, i) => (
              <div key={i}
                className={`absolute inset-0 flex items-center transition-all duration-700 ${i === slide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                style={{ background: item.bg }}
              >
                <div className="w-full">
                  <div className="container py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                      <div>
                        <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6"
                          style={{ background: `${item.accent}22`, border: `1px solid ${item.accent}44` }}>
                          <item.icon className="w-4 h-4" style={{ color: item.accent }} />
                          <span className="text-white/80 text-sm">{item.subtitle}</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{item.title}</h2>
                        <p className="text-white/80 text-lg leading-relaxed">{item.desc}</p>
                      </div>
                      <div className="flex justify-center">
                        <div className="rounded-3xl p-10 text-center"
                          style={{ background: `${item.accent}18`, border: `1px solid ${item.accent}33`, backdropFilter: 'blur(10px)' }}>
                          <div className="text-6xl font-extrabold text-white mb-2">{item.stat}</div>
                          <div className="text-white/60 text-sm">{item.statLabel}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Static container for height */}
            <div className="invisible py-20">
              <div className="container">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div><div className="h-6 mb-6" /><div className="h-10 mb-4" /><div className="h-24" /></div>
                  <div className="flex justify-center"><div className="p-10 text-center"><div className="text-6xl mb-2">000+</div><div className="text-sm">placeholder</div></div></div>
                </div>
              </div>
            </div>

            {/* Prev / Next */}
            <button onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-all"
              aria-label="Précédent"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center text-white transition-all"
              aria-label="Suivant"><ChevronRight className="w-5 h-5" /></button>

            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
              {WHY_US.map((_, i) => (
                <button key={i} onClick={() => setSlide(i)}
                  className={`transition-all duration-300 rounded-full ${i === slide ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Organigramme ── */}
      <section className="py-16 bg-white">
        <div className="container max-w-4xl text-center">
          <span className="section-label">Organigramme</span>
          <h2 className="section-title mb-8">Structure organisationnelle</h2>
          <div className="card p-4 overflow-hidden">
            <img src="/assets/img/organigramme.jpg" alt="Organigramme Interpêche CI"
              className="w-full rounded-xl"
              onError={(e) => {
                e.target.parentElement.innerHTML = `
                  <div class="py-16 text-center text-gray-400">
                    <p class="text-lg font-medium mb-2">Organigramme</p>
                    <p class="text-sm">Image disponible dans les assets du projet</p>
                  </div>`
              }}
            />
          </div>
        </div>
      </section>

      {/* ── Colleges ── */}
      <section className="py-20 bg-gray-50" ref={collegeRef}>
        <div className="container">
          <div className="text-center mb-14">
            <span className="section-label">Représentation</span>
            <h2 className="section-title">Les Collèges membres</h2>
            <p className="section-desc mx-auto">L'interprofession est organisée en collèges représentant chaque maillon de la chaîne de valeur halieutique, avec des voix pondérées au Conseil d'Administration.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {colleges.map((col, i) => (
              <div key={i}
                className={`card p-6 border-l-4 ${col.color} transition-all duration-700 ${collegeVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                style={{ transitionDelay: `${i * 80}ms` }}>
                <h3 className="font-bold text-gray-900 mb-2">{col.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-3">{col.desc}</p>
                <p className="text-xs font-medium text-gray-400 border-t border-gray-100 pt-3">{col.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Textes juridiques ── */}
      <section className="py-20 bg-white" ref={legalRef}>
        <div className="container">
          <div className="text-center mb-12">
            <span className="section-label">Base légale</span>
            <h2 className="section-title">Cadre juridique</h2>
            <p className="section-desc mx-auto">Interpêche CI est reconnue et encadrée par des textes officiels de la République de Côte d'Ivoire.</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {legalTexts.map((law, i) => (
              <div key={i}
                className={`rounded-3xl overflow-hidden transition-all duration-700 ${legalVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 150}ms`, border: '1px solid #e5e7eb' }}>
                <div className={`p-6 bg-gradient-to-br ${law.color} flex items-center gap-4`}>
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <law.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">{law.ref}</div>
                    <div className="text-white/70 text-sm">{law.date}</div>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <h3 className="font-bold text-gray-900 mb-3">{law.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{law.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Décret de reconnaissance ── */}
      <section className="py-20 bg-gradient-to-br from-ocean-800 to-ocean-600 text-white relative overflow-hidden">
        <div className="caustic-overlay" />
        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="section-label text-coral-400">Reconnaissance officielle</span>
              <h2 className="text-3xl font-bold text-white mb-6">Décret de reconnaissance officielle</h2>
              <p className="text-ocean-100 leading-relaxed mb-4">
                Le 28 juin 2025, Interpêche CI a reçu son décret de reconnaissance officielle de l'État ivoirien lors d'une cérémonie officielle, marquant une étape décisive dans la structuration de la filière pêche nationale.
              </p>
              <p className="text-ocean-100 leading-relaxed">
                Cette reconnaissance confère à l'interprofession le statut d'Organisation Interprofessionnelle Agricole (OIA), lui permettant de collecter les Cotisations Volontaires Obligatoires (CVO) et de bénéficier du soutien institutionnel de l'État.
              </p>
            </div>
            <div>
              <img src="/assets/img/atelier/atelier (7).jpg" alt="Remise décret"
                className="rounded-3xl w-full h-72 object-cover shadow-2xl"
                onError={(e) => { e.target.src = 'https://picsum.photos/seed/decret/700/400' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA double ── */}
      <section className="py-20 bg-gray-50">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CTA 1 — Participer */}
            <div className="card p-10 text-center"
              style={{ background: 'linear-gradient(135deg,#001e3c,#003566)', border: 'none' }}>
              <div className="inline-flex w-14 h-14 rounded-2xl bg-ocean-500/30 items-center justify-center mb-5">
                <Award className="w-7 h-7 text-ocean-300" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Participer à la gouvernance</h3>
              <p className="text-ocean-200 text-sm leading-relaxed mb-7">
                Impliquez-vous dans les instances de décision d'Interpêche CI — Assemblée Générale, commissions techniques, groupes de travail sectoriels.
              </p>
              <Link to="/contact"
                className="inline-flex items-center gap-2 bg-ocean-400 hover:bg-ocean-300 text-ocean-900 font-bold px-6 py-3 rounded-xl transition-all">
                Nous contacter <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* CTA 2 — Adhérer */}
            <div className="card p-10 text-center"
              style={{ background: 'linear-gradient(135deg,#7c1d1d,#c2410c)', border: 'none' }}>
              <div className="inline-flex w-14 h-14 rounded-2xl bg-coral-400/20 items-center justify-center mb-5">
                <Handshake className="w-7 h-7 text-coral-300" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Adhérer à Interpêche CI</h3>
              <p className="text-orange-100 text-sm leading-relaxed mb-7">
                Rejoignez les 500+ membres actifs de l'interprofession et bénéficiez de tous nos services : formation, accompagnement, représentation et accès aux financements.
              </p>
              <Link to="/contact"
                className="inline-flex items-center gap-2 bg-coral-400 hover:bg-coral-300 text-white font-bold px-6 py-3 rounded-xl transition-all">
                Demander l'adhésion <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
