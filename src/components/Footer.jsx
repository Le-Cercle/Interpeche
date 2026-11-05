import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Linkedin, Youtube, ArrowRight, Send, AlertCircle, Lock } from 'lucide-react'
import { useForm } from '../hooks/useForm'
import { validators } from '../utils/validation'
import { api } from '../utils/api'

const navLinks = [
  { to: '/qui-sommes-nous', label: 'Qui sommes-nous' },
  { to: '/activites', label: 'Nos activités' },
  { to: '/organisation', label: 'Organisation' },
  { to: '/actualites', label: 'Actualités' },
  { to: '/galerie', label: 'Galerie' },
  { to: '/videotheque', label: 'Vidéothèque' },
  { to: '/contact', label: 'Contact' },
]

export default function Footer() {
  const {
    values,
    errors,
    touched,
    isSubmitting,
    submitError,
    submitSuccess,
    handleChange,
    handleBlur,
    handleSubmit: onSubmit,
    resetForm,
  } = useForm(
    { email: '' },
    { email: validators.email },
    async (data) => {
      await api.subscribeNewsletter(data.email)
    }
  )

  const handleNewsletter = (e) => {
    onSubmit(e)
  }

  return (
    <footer className="relative bg-ocean-900 text-white overflow-hidden">
      {/* Top wave */}
      <div className="absolute top-0 left-0 right-0 -translate-y-px">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" className="w-full">
          <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53.3 600 46.7 720 40C840 33.3 960 26.7 1080 23.3C1200 20 1320 20 1380 20L1440 20V60H0V0Z" fill="rgb(0,40,64)" />
        </svg>
      </div>

      {/* Decorative orbs */}
      <div className="absolute top-20 right-0 w-80 h-80 bg-ocean-700 rounded-full filter blur-3xl opacity-20" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-coral-500 rounded-full filter blur-3xl opacity-10" />

      <div className="container relative pt-20 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <img src="/logo.png" alt="Interpêche CI" className="h-12 w-auto object-contain brightness-0 invert" />
            </Link>
            <p className="text-ocean-200 text-sm leading-relaxed mb-6">
              Interprofession de la filière pêche Côte d'Ivoire — Fédérant et représentant tous les acteurs du secteur halieutique depuis 2023.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: '#', label: 'Facebook' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Linkedin, href: '#', label: 'LinkedIn' },
                { icon: Youtube, href: '#', label: 'YouTube' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-ocean-800 hover:bg-ocean-600 flex items-center justify-center transition-colors duration-200 group/social"
                >
                  <Icon className="w-4 h-4 text-ocean-300 group-hover/social:text-white transition-colors duration-200" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-widest">Navigation</h3>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="flex items-center gap-2 text-ocean-200 hover:text-coral-400 text-sm transition-colors duration-200 group"
                  >
                    <ArrowRight className="w-0 h-3 opacity-0 -ml-2 group-hover:w-3 group-hover:ml-0 group-hover:opacity-100 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-widest">Contact</h3>
            <ul className="space-y-3.5">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-coral-400 mt-0.5 flex-shrink-0" />
                <span className="text-ocean-200 text-sm">Zone Portuaire, Cité des cadres du port — Camp Blanc Villa n°26, Abidjan-Treichville</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-coral-400 flex-shrink-0" />
                <span className="text-ocean-200 text-sm">+225 27 21 73 81 52</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-coral-400 flex-shrink-0" />
                <span className="text-ocean-200 text-sm">+225 07 20 05 05 05</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-coral-400 flex-shrink-0" />
                <a href="mailto:interpechecotedivoire@gmail.com" className="text-ocean-200 hover:text-coral-400 text-sm transition-colors truncate">
                  interpechecotedivoire@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-coral-400 flex-shrink-0" />
                <span className="text-ocean-200 text-sm">Lun–Ven, 08h00–17h00</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-widest">Newsletter</h3>
            <p className="text-ocean-200 text-sm mb-4 leading-relaxed">
              Abonnez-vous pour recevoir nos actualités et informations sur la filière pêche.
            </p>
            {submitSuccess ? (
              <div className="bg-green-500/20 border border-green-500/30 text-green-300 rounded-xl p-3 text-sm">
                Merci pour votre inscription !
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="space-y-2">
                {submitError && (
                  <div className="flex items-start gap-2 p-2 bg-red-500/20 border border-red-500/30 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-300 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-red-300">{submitError}</p>
                  </div>
                )}
                <input
                  type="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Votre adresse email"
                  className={`w-full px-4 py-2.5 bg-ocean-800 border text-white placeholder-ocean-400 rounded-xl text-sm focus:outline-none transition-colors ${
                    touched.email && errors.email
                      ? 'border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400'
                      : 'border-ocean-700 focus:border-ocean-400 focus:ring-1 focus:ring-ocean-400'
                  }`}
                />
                {touched.email && errors.email && (
                  <p className="text-xs text-red-300">{errors.email}</p>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-coral-500 hover:bg-coral-600 disabled:bg-coral-400 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      S'abonner
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-ocean-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-ocean-400 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} Interpêche Côte d'Ivoire. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-ocean-400 hover:text-ocean-200 text-xs transition-colors">Mentions légales</a>
            <a href="#" className="text-ocean-400 hover:text-ocean-200 text-xs transition-colors">Confidentialité</a>
            <Link to="/admin/login" className="flex items-center gap-1 text-ocean-400 hover:text-ocean-200 text-xs transition-colors">
              <Lock className="w-3 h-3" />
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
