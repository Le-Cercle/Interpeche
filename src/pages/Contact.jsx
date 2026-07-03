import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, MessageSquare, Facebook, Twitter, Linkedin, Youtube, AlertCircle } from 'lucide-react'
import { SEO } from '../components/SEO'
import seoData from '../data/seo.json'
import { useForm } from '../hooks/useForm'
import { validators } from '../utils/validation'
import { api } from '../utils/api'
import { useReveal } from '../hooks/useReveal'

const contactInfo = [
  {
    icon: MapPin,
    title: 'Adresse',
    lines: ['Zone Portuaire, Cité des cadres du port', 'Camp Blanc Villa n°26', 'Abidjan-Treichville, Côte d\'Ivoire'],
    color: 'from-ocean-600 to-ocean-400',
  },
  {
    icon: Phone,
    title: 'Téléphone',
    lines: ['+225 27 21 73 81 52', '+225 07 20 05 05 05'],
    color: 'from-coral-500 to-coral-400',
  },
  {
    icon: Mail,
    title: 'Email',
    lines: ['interpechecotedivoire@gmail.com'],
    color: 'from-teal-600 to-teal-400',
  },
  {
    icon: Clock,
    title: 'Horaires',
    lines: ['Lundi — Vendredi', '08h00 — 17h00'],
    color: 'from-purple-600 to-purple-400',
  },
]

export default function Contact() {
  const [headerRef, headerVisible] = useReveal()
  const [formRef, formVisible] = useReveal()

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
    { name: '', email: '', subject: '', message: '' },
    {
      name: validators.name,
      email: validators.email,
      subject: validators.subject,
      message: validators.message,
    },
    async (data) => {
      await api.sendContactMessage(data)
    }
  )

  const handleSubmit = (e) => {
    onSubmit(e)
  }

  return (
    <>
      <SEO {...seoData.contact} />
      {/* Header */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-ocean-900 to-ocean-700 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="container relative text-center" ref={headerRef}>
          <div className={`transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
              <MessageSquare className="w-4 h-4 text-coral-400" />
              <span className="text-ocean-100 text-sm">Parlons ensemble</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Contactez-nous</h1>
            <p className="text-ocean-100 text-lg max-w-xl mx-auto leading-relaxed">
              Une question, un partenariat ou une adhésion ? Notre équipe est disponible pour vous accompagner.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none" className="w-full">
            <path d="M0 60L480 30C720 15 960 15 1440 30V60H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Contact info cards */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, i) => (
              <div key={i} className="card p-6 text-center group">
                <div className={`inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br ${info.color} items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <info.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{info.title}</h3>
                {info.lines.map((line, j) => (
                  <p key={j} className="text-gray-500 text-sm">{line}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="py-16 bg-gray-50" ref={formRef}>
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Form */}
            <div className={`card p-8 transition-all duration-700 ${formVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Envoyez-nous un message</h2>
              <p className="text-gray-500 text-sm mb-6">Nous vous répondrons dans les plus brefs délais.</p>

              {submitSuccess ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message envoyé !</h3>
                  <p className="text-gray-500 text-sm mb-6">Merci pour votre message. Notre équipe vous répondra bientôt.</p>
                  <button
                    onClick={resetForm}
                    className="btn-outline-ocean"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {submitError && (
                    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-700">{submitError}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom complet *</label>
                      <input
                        type="text"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Jean Dupont"
                        className={`w-full px-4 py-2.5 border rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none transition-colors bg-white ${
                          touched.name && errors.name
                            ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-400'
                            : 'border-gray-200 focus:border-ocean-400 focus:ring-1 focus:ring-ocean-400'
                        }`}
                      />
                      {touched.name && errors.name && (
                        <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="jean@exemple.com"
                        className={`w-full px-4 py-2.5 border rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none transition-colors bg-white ${
                          touched.email && errors.email
                            ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-400'
                            : 'border-gray-200 focus:border-ocean-400 focus:ring-1 focus:ring-ocean-400'
                        }`}
                      />
                      {touched.email && errors.email && (
                        <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Sujet *</label>
                    <select
                      name="subject"
                      value={values.subject}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-2.5 border rounded-xl text-sm text-gray-800 focus:outline-none transition-colors bg-white ${
                        touched.subject && errors.subject
                          ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-400'
                          : 'border-gray-200 focus:border-ocean-400 focus:ring-1 focus:ring-ocean-400'
                      }`}
                    >
                      <option value="">Choisissez un sujet</option>
                      <option>Adhésion à Interpêche CI</option>
                      <option>Partenariat</option>
                      <option>Information générale</option>
                      <option>Formation</option>
                      <option>Événement</option>
                      <option>Autre</option>
                    </select>
                    {touched.subject && errors.subject && (
                      <p className="text-xs text-red-600 mt-1">{errors.subject}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Message *</label>
                    <textarea
                      name="message"
                      value={values.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows={5}
                      placeholder="Décrivez votre demande en détail..."
                      className={`w-full px-4 py-2.5 border rounded-xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none transition-colors bg-white resize-none ${
                        touched.message && errors.message
                          ? 'border-red-300 focus:border-red-400 focus:ring-1 focus:ring-red-400'
                          : 'border-gray-200 focus:border-ocean-400 focus:ring-1 focus:ring-ocean-400'
                      }`}
                    />
                    {touched.message && errors.message && (
                      <p className="text-xs text-red-600 mt-1">{errors.message}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-ocean-600 hover:bg-ocean-700 disabled:bg-ocean-400 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-ocean"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Envoyer le message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Map + Info */}
            <div className={`flex flex-col gap-6 transition-all duration-700 delay-200 ${formVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              {/* Map */}
              <div className="card overflow-hidden flex-1 min-h-64">
                <iframe
                  title="Localisation Interpêche CI"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.0!2d-3.9965!3d5.2960!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x102375bf4bc879a3%3A0x63b0be00e5c16e96!2sTreichville%2C%20Abidjan%2C%20C%C3%B4te%20d'Ivoire!5e0!3m2!1sfr!2sci!4v1700000000000"
                  className="w-full h-full min-h-64"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                />
              </div>

              {/* Quick contact */}
              <div className="card p-6">
                <h3 className="font-bold text-gray-900 mb-4">Contact direct</h3>
                <div className="space-y-3">
                  <a href="tel:+2252721738152"
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-ocean-50 hover:text-ocean-600 transition-colors group">
                    <div className="w-9 h-9 rounded-lg bg-ocean-100 group-hover:bg-ocean-600 flex items-center justify-center transition-colors">
                      <Phone className="w-4 h-4 text-ocean-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Appeler maintenant</div>
                      <div className="font-medium text-sm">+225 27 21 73 81 52</div>
                    </div>
                  </a>
                  <a href="tel:+2250720050505"
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-ocean-50 hover:text-ocean-600 transition-colors group">
                    <div className="w-9 h-9 rounded-lg bg-ocean-100 group-hover:bg-ocean-600 flex items-center justify-center transition-colors">
                      <Phone className="w-4 h-4 text-ocean-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Appeler maintenant</div>
                      <div className="font-medium text-sm">+225 07 20 05 05 05</div>
                    </div>
                  </a>
                  <a href="mailto:interpechecotedivoire@gmail.com"
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-coral-50 hover:text-coral-600 transition-colors group">
                    <div className="w-9 h-9 rounded-lg bg-coral-100 group-hover:bg-coral-500 flex items-center justify-center transition-colors">
                      <Mail className="w-4 h-4 text-coral-500 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-400">Écrire un email</div>
                      <div className="font-medium text-sm">interpechecotedivoire@gmail.com</div>
                    </div>
                  </a>
                </div>

                {/* Réseaux sociaux */}
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Suivez-nous</p>
                  <div className="flex gap-3">
                    {[
                      { icon: Facebook, href: 'https://www.facebook.com/interpeche.ci', label: 'Facebook', bg: 'hover:bg-[#1877F2]' },
                      { icon: Twitter,  href: '#',                                       label: 'Twitter',  bg: 'hover:bg-[#1DA1F2]' },
                      { icon: Linkedin, href: '#',                                       label: 'LinkedIn', bg: 'hover:bg-[#0A66C2]' },
                      { icon: Youtube,  href: '#',                                       label: 'YouTube',  bg: 'hover:bg-[#FF0000]' },
                    ].map(({ icon: Icon, href, label, bg }) => (
                      <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                        className={`w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:text-white transition-all duration-200 ${bg}`}>
                        <Icon className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
