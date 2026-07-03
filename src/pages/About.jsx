import { Link } from 'react-router-dom'
import { Fish, Users, Award, Target, Zap, Heart, Globe, ArrowRight, Eye, CheckCircle, Calendar, TrendingUp, Search, Users2, Lightbulb, Waves } from 'lucide-react'
import { SEO } from '../components/SEO'
import seoData from '../data/seo.json'
import { useReveal } from '../hooks/useReveal'

const timeline = [
  { year: '2022', event: 'Processus de création de l\'interprofession lancé par les acteurs de la filière pêche' },
  { year: 'Août 2023', event: 'Création officielle d\'Interpêche Côte d\'Ivoire — 3 août 2023, Abidjan' },
  { year: 'Fév. 2024', event: 'Inauguration officielle du siège social à la Zone Portuaire de Treichville' },
  { year: 'Juin 2025', event: 'Remise des décrets de reconnaissance aux Organisations Interprofessionnelles Agricoles (OIA)' },
  { year: 'Sep. 2025', event: 'Validation des Cotisations Volontaires Obligatoires (CVO) — vers l\'autofinancement' },
  { year: '2026', event: 'Poursuite du développement et de la structuration de la filière pêche ivoirienne' },
]

export default function About() {
  const [heroRef, heroVisible] = useReveal()
  const [missionRef, missionVisible] = useReveal()
  const [timelineRef, timelineVisible] = useReveal()
  const [valuesRef, valuesVisible] = useReveal()

  return (
    <>
      <SEO {...seoData.about} />
      {/* Page header */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-ocean-900 to-ocean-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="container relative text-center" ref={heroRef}>
          <div className={`transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
              <Fish className="w-4 h-4 text-coral-400" />
              <span className="text-ocean-100 text-sm">Notre identité</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Qui sommes-nous ?</h1>
            <p className="text-ocean-100 text-lg max-w-2xl mx-auto leading-relaxed">
              Interpêche Côte d'Ivoire est l'interprofession officielle de la filière pêche, fédérant l'ensemble des acteurs du secteur halieutique ivoirien depuis 2023.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full">
            <path d="M0 60L480 30C720 15 960 15 1440 30V60H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white" ref={missionRef}>
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {[
              {
                icon: Target,
                color: 'from-ocean-600 to-ocean-400',
                title: 'Notre Mission',
                text: 'Fédérer, représenter et défendre les intérêts de tous les acteurs de la filière pêche en Côte d\'Ivoire, en favorisant un développement durable, équitable et compétitif du secteur halieutique national.',
              },
              {
                icon: Eye,
                color: 'from-coral-500 to-coral-400',
                title: 'Notre Vision',
                text: 'Être la référence de la gouvernance de la filière pêche en Côte d\'Ivoire, contribuant à la sécurité alimentaire, à la création d\'emplois et à la préservation des ressources marines pour les générations futures.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className={`card p-8 transition-all duration-700 ${missionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className={`inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} items-center justify-center mb-5`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transition-all duration-700 delay-300 ${missionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div>
              <span className="section-label">Notre rôle</span>
              <h2 className="section-title">Une organisation au service de toute la filière</h2>
              <p className="text-gray-500 leading-relaxed mb-6">
                L'Interprofession de la filière pêche Côte d'Ivoire (Interpêche-CI) est une organisation fédérant l'ensemble des maillons de la chaîne de valeur halieutique : pêcheurs artisanaux, mareyeuses, transformatrices, importateurs, exportateurs et armateurs.
              </p>
              <ul className="space-y-3">
                {[
                  'Dialogue structuré avec les autorités publiques',
                  'Promotion de la pêche durable et responsable',
                  'Accès aux financements et marchés internationaux',
                  'Renforcement des capacités techniques des membres',
                  'Défense des droits et intérêts économiques',
                ].map((p, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-ocean-500 flex-shrink-0" />
                    <span className="text-gray-600 text-sm">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <img
                src="/assets/img/atelier/atelier (7).jpg"
                alt="Atelier Interpêche"
                className="rounded-3xl w-full h-80 object-cover shadow-xl"
                onError={(e) => { e.target.src = 'https://picsum.photos/seed/atelier/700/400' }}
              />
              <div className="absolute -bottom-4 -left-4 bg-ocean-600 text-white rounded-2xl p-4 shadow-ocean">
                <div className="text-2xl font-bold">3 août</div>
                <div className="text-ocean-200 text-sm">Date de fondation 2023</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-ocean-50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users,      value: '500+',  label: 'Membres actifs',  color: 'from-ocean-600 to-ocean-400' },
              { icon: Calendar,   value: '50+',   label: 'Événements',       color: 'from-coral-500 to-coral-400' },
              { icon: Globe,      value: '20+',   label: 'Partenaires',      color: 'from-teal-600 to-teal-400'  },
              { icon: TrendingUp, value: '1000+', label: 'Bénéficiaires',    color: 'from-purple-600 to-purple-400' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className={`inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} items-center justify-center mb-3`}>
                  <s.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-3xl font-extrabold gradient-text">{s.value}</div>
                <div className="text-gray-500 text-sm mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white" ref={timelineRef}>
        <div className="container max-w-3xl">
          <div className="text-center mb-14">
            <span className="section-label">Notre parcours</span>
            <h2 className="section-title">Historique</h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-ocean-100" />
            <div className="space-y-8">
              {timeline.map((item, i) => (
                <div
                  key={i}
                  className={`flex gap-6 transition-all duration-700 ${timelineVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-ocean-600 flex items-center justify-center text-white font-bold text-xs text-center leading-tight">
                      {item.year.split(' ')[0]}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 flex-1 -mt-1">
                    <div className="font-semibold text-ocean-700 text-sm mb-1">{item.year}</div>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50" ref={valuesRef}>
        <div className="container">
          <div className="text-center mb-14">
            <span className="section-label">Ce qui nous guide</span>
            <h2 className="section-title">Nos valeurs</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Transparence', desc: 'Une gouvernance ouverte, honnête et responsable envers tous les membres.', icon: Search, color: 'from-ocean-600 to-ocean-400', accent: 'border-ocean-400' },
              { title: 'Solidarité', desc: 'Cohésion entre tous les acteurs de la filière pour un développement collectif.', icon: Users2, color: 'from-coral-500 to-coral-400', accent: 'border-coral-400' },
              { title: 'Innovation', desc: 'Adoption de pratiques et technologies modernes pour la compétitivité du secteur.', icon: Lightbulb, color: 'from-amber-500 to-amber-400', accent: 'border-amber-400' },
              { title: 'Durabilité', desc: 'Préservation des ressources marines pour les générations présentes et futures.', icon: Waves, color: 'from-teal-600 to-teal-400', accent: 'border-teal-400' },
            ].map((v, i) => (
              <div
                key={i}
                className={`card p-6 text-center border-t-4 ${v.accent} transition-all duration-700 ${valuesVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className={`inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br ${v.color} items-center justify-center mb-4 mx-auto`}>
                  <v.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
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
          <h2 className="text-3xl font-bold mb-4">Rejoignez Interpêche CI</h2>
          <p className="text-ocean-200 mb-8">Devenez membre et bénéficiez de l'accompagnement de la première interprofession de la filière pêche en Côte d'Ivoire.</p>
          <Link to="/contact" className="btn-primary btn-ocean-glow">
            Nous contacter <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </>
  )
}
