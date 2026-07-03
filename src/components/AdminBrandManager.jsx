import { useState } from 'react'
import { Save, RotateCcw, Eye, Copy } from 'lucide-react'

export default function AdminBrandManager() {
  const [brandData, setBrandData] = useState({
    // Identité de la marque
    companyName: 'Interpêche Côte d\'Ivoire',
    tagline: 'Au service des acteurs de la filière pêche',
    description: 'Interprofession de la filière pêche Côte d\'Ivoire',
    
    // Logo et images
    logo: '/logo.png',
    logoAlt: 'Interpêche CI',
    favicon: '/favicon.jpg',
    ogImage: '/og-image.png',
    
    // Couleurs principales
    colors: {
      primary: '#006994',
      secondary: '#f77f00',
      accent: '#00b4d8',
      background: '#ffffff',
      text: '#1a1a1a',
      headerBg: '#000b18',
      headerText: '#ffffff',
      footerBg: '#000b18',
      footerText: '#ffffff',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
    },

    // Typographie
    typography: {
      primaryFont: 'font-sans',
      secondaryFont: 'font-serif',
      headingSize: 'text-4xl',
      bodySize: 'text-base',
      lineHeight: 'leading-relaxed',
    },

    // Informations de contact
    contact: {
      phone: '+225 27 21 73 81 52',
      email: 'interpechecotedivoire@gmail.com',
      address: 'Zone Portuaire, Cité des cadres du port, Abidjan',
      city: 'Abidjan',
      country: 'Côte d\'Ivoire',
    },

    // Réseaux sociaux
    social: {
      facebook: 'https://www.facebook.com/interpeche.ci',
      twitter: 'https://twitter.com/interpeche',
      linkedin: 'https://linkedin.com/company/interpeche',
      youtube: 'https://youtube.com/@interpeche',
      instagram: 'https://instagram.com/interpeche',
    },

    // SEO
    seo: {
      siteTitle: 'Interpêche CI — Au service des acteurs de la filière pêche',
      siteDescription: 'Interprofession de la filière pêche Côte d\'Ivoire. Découvrez nos activités, formations et actualités.',
      keywords: 'pêche, Côte d\'Ivoire, interprofession, filière pêche',
    },

    // Textes personnalisés
    texts: {
      heroTitle: 'Bienvenue chez Interpêche',
      heroSubtitle: 'Ensemble pour une filière pêche durable',
      ctaButton: 'Découvrir',
      footerCopyright: '© 2024 Interpêche Côte d\'Ivoire. Tous droits réservés.',
    },
  })

  const [editMode, setEditMode] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('identity')

  const handleSave = () => {
    localStorage.setItem('brandData', JSON.stringify(brandData))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser la marque ?')) {
      // Réinitialiser aux valeurs par défaut
      setBrandData({
        companyName: 'Interpêche Côte d\'Ivoire',
        tagline: 'Au service des acteurs de la filière pêche',
        description: 'Interprofession de la filière pêche Côte d\'Ivoire',
        logo: '/logo.png',
        logoAlt: 'Interpêche CI',
        favicon: '/favicon.jpg',
        ogImage: '/og-image.png',
        colors: {
          primary: '#006994',
          secondary: '#f77f00',
          accent: '#00b4d8',
          background: '#ffffff',
          text: '#1a1a1a',
          headerBg: '#000b18',
          headerText: '#ffffff',
          footerBg: '#000b18',
          footerText: '#ffffff',
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
        },
        typography: {
          primaryFont: 'font-sans',
          secondaryFont: 'font-serif',
          headingSize: 'text-4xl',
          bodySize: 'text-base',
          lineHeight: 'leading-relaxed',
        },
        contact: {
          phone: '+225 27 21 73 81 52',
          email: 'interpechecotedivoire@gmail.com',
          address: 'Zone Portuaire, Cité des cadres du port, Abidjan',
          city: 'Abidjan',
          country: 'Côte d\'Ivoire',
        },
        social: {
          facebook: 'https://www.facebook.com/interpeche.ci',
          twitter: 'https://twitter.com/interpeche',
          linkedin: 'https://linkedin.com/company/interpeche',
          youtube: 'https://youtube.com/@interpeche',
          instagram: 'https://instagram.com/interpeche',
        },
        seo: {
          siteTitle: 'Interpêche CI — Au service des acteurs de la filière pêche',
          siteDescription: 'Interprofession de la filière pêche Côte d\'Ivoire. Découvrez nos activités, formations et actualités.',
          keywords: 'pêche, Côte d\'Ivoire, interprofession, filière pêche',
        },
        texts: {
          heroTitle: 'Bienvenue chez Interpêche',
          heroSubtitle: 'Ensemble pour une filière pêche durable',
          ctaButton: 'Découvrir',
          footerCopyright: '© 2024 Interpêche Côte d\'Ivoire. Tous droits réservés.',
        },
      })
    }
  }

  const updateNested = (section, field, value) => {
    setBrandData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  const tabs = [
    { id: 'identity', label: 'Identité' },
    { id: 'colors', label: 'Couleurs' },
    { id: 'typography', label: 'Typographie' },
    { id: 'contact', label: 'Contact' },
    { id: 'social', label: 'Réseaux Sociaux' },
    { id: 'seo', label: 'SEO' },
    { id: 'texts', label: 'Textes' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestionnaire de Marque</h1>
            <p className="text-gray-600 mt-1">Gérez tous les aspects de votre marque au même endroit</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setEditMode(!editMode)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                editMode
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-ocean-100 text-ocean-700 hover:bg-ocean-200'
              }`}
            >
              {editMode ? 'Annuler' : 'Éditer'}
            </button>
            {editMode && (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-ocean-600 hover:bg-ocean-700 text-white rounded-lg font-semibold transition-colors"
              >
                <Save className="w-4 h-4" />
                Enregistrer
              </button>
            )}
          </div>
        </div>

        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            ✓ Marque enregistrée avec succès !
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-ocean-600 text-ocean-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* Identité */}
          {activeTab === 'identity' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'entreprise</label>
                <input
                  type="text"
                  value={brandData.companyName}
                  onChange={(e) => setBrandData({ ...brandData, companyName: e.target.value })}
                  disabled={!editMode}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Slogan</label>
                <input
                  type="text"
                  value={brandData.tagline}
                  onChange={(e) => setBrandData({ ...brandData, tagline: e.target.value })}
                  disabled={!editMode}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={brandData.description}
                  onChange={(e) => setBrandData({ ...brandData, description: e.target.value })}
                  disabled={!editMode}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg disabled:bg-gray-50 resize-none"
                />
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-900 mb-4">Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                    <input
                      type="text"
                      value={brandData.logo}
                      onChange={(e) => setBrandData({ ...brandData, logo: e.target.value })}
                      disabled={!editMode}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Favicon URL</label>
                    <input
                      type="text"
                      value={brandData.favicon}
                      onChange={(e) => setBrandData({ ...brandData, favicon: e.target.value })}
                      disabled={!editMode}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">OG Image URL</label>
                    <input
                      type="text"
                      value={brandData.ogImage}
                      onChange={(e) => setBrandData({ ...brandData, ogImage: e.target.value })}
                      disabled={!editMode}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg disabled:bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text Logo</label>
                    <input
                      type="text"
                      value={brandData.logoAlt}
                      onChange={(e) => setBrandData({ ...brandData, logoAlt: e.target.value })}
                      disabled={!editMode}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Couleurs */}
          {activeTab === 'colors' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(brandData.colors).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={value}
                        onChange={(e) => updateNested('colors', key, e.target.value)}
                        disabled={!editMode}
                        className="w-12 h-10 rounded-lg cursor-pointer border border-gray-200"
                      />
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => updateNested('colors', key, e.target.value)}
                        disabled={!editMode}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono disabled:bg-gray-50"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Aperçu des couleurs */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-gray-900 mb-4">Aperçu</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(brandData.colors).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div
                        className="w-full h-20 rounded-lg border border-gray-200 mb-2"
                        style={{ backgroundColor: value }}
                      />
                      <p className="text-xs text-gray-600 capitalize">{key}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Typographie */}
          {activeTab === 'typography' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Police primaire</label>
                <select
                  value={brandData.typography.primaryFont}
                  onChange={(e) => updateNested('typography', 'primaryFont', e.target.value)}
                  disabled={!editMode}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg disabled:bg-gray-50"
                >
                  <option value="font-sans">Sans Serif</option>
                  <option value="font-serif">Serif</option>
                  <option value="font-mono">Monospace</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Police secondaire</label>
                <select
                  value={brandData.typography.secondaryFont}
                  onChange={(e) => updateNested('typography', 'secondaryFont', e.target.value)}
                  disabled={!editMode}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg disabled:bg-gray-50"
                >
                  <option value="font-sans">Sans Serif</option>
                  <option value="font-serif">Serif</option>
                  <option value="font-mono">Monospace</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Taille des titres</label>
                <select
                  value={brandData.typography.headingSize}
                  onChange={(e) => updateNested('typography', 'headingSize', e.target.value)}
                  disabled={!editMode}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg disabled:bg-gray-50"
                >
                  <option value="text-2xl">Petit</option>
                  <option value="text-3xl">Normal</option>
                  <option value="text-4xl">Grand</option>
                  <option value="text-5xl">Très grand</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Taille du corps</label>
                <select
                  value={brandData.typography.bodySize}
                  onChange={(e) => updateNested('typography', 'bodySize', e.target.value)}
                  disabled={!editMode}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg disabled:bg-gray-50"
                >
                  <option value="text-sm">Petit</option>
                  <option value="text-base">Normal</option>
                  <option value="text-lg">Grand</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hauteur de ligne</label>
                <select
                  value={brandData.typography.lineHeight}
                  onChange={(e) => updateNested('typography', 'lineHeight', e.target.value)}
                  disabled={!editMode}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg disabled:bg-gray-50"
                >
                  <option value="leading-tight">Serré</option>
                  <option value="leading-normal">Normal</option>
                  <option value="leading-relaxed">Relaxé</option>
                  <option value="leading-loose">Très relaxé</option>
                </select>
              </div>
            </div>
          )}

          {/* Contact */}
          {activeTab === 'contact' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={brandData.contact.phone}
                  onChange={(e) => updateNested('contact', 'phone', e.target.value)}
                  disabled={!editMode}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={brandData.contact.email}
                  onChange={(e) => updateNested('contact', 'email', e.target.value)}
                  disabled={!editMode}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                <textarea
                  value={brandData.contact.address}
                  onChange={(e) => updateNested('contact', 'address', e.target.value)}
                  disabled={!editMode}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg disabled:bg-gray-50 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                  <input
                    type="text"
                    value={brandData.contact.city}
                    onChange={(e) => updateNested('contact', 'city', e.target.value)}
                    disabled={!editMode}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                  <input
                    type="text"
                    value={brandData.contact.country}
                    onChange={(e) => updateNested('contact', 'country', e.target.value)}
                    disabled={!editMode}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg disabled:bg-gray-50"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Réseaux Sociaux */}
          {activeTab === 'social' && (
            <div className="space-y-4">
              {Object.entries(brandData.social).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{key}</label>
                  <input
                    type="url"
                    value={value}
                    onChange={(e) => updateNested('social', key, e.target.value)}
                    disabled={!editMode}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg disabled:bg-gray-50"
                  />
                </div>
              ))}
            </div>
          )}

          {/* SEO */}
          {activeTab === 'seo' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre du site</label>
                <input
                  type="text"
                  value={brandData.seo.siteTitle}
                  onChange={(e) => updateNested('seo', 'siteTitle', e.target.value)}
                  disabled={!editMode}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg disabled:bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">Affiché dans les résultats de recherche</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description du site</label>
                <textarea
                  value={brandData.seo.siteDescription}
                  onChange={(e) => updateNested('seo', 'siteDescription', e.target.value)}
                  disabled={!editMode}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg disabled:bg-gray-50 resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">Affiché sous le titre dans les résultats</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mots-clés</label>
                <input
                  type="text"
                  value={brandData.seo.keywords}
                  onChange={(e) => updateNested('seo', 'keywords', e.target.value)}
                  disabled={!editMode}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg disabled:bg-gray-50"
                  placeholder="Séparés par des virgules"
                />
              </div>
            </div>
          )}

          {/* Textes */}
          {activeTab === 'texts' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre de la page d'accueil</label>
                <input
                  type="text"
                  value={brandData.texts.heroTitle}
                  onChange={(e) => updateNested('texts', 'heroTitle', e.target.value)}
                  disabled={!editMode}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sous-titre de la page d'accueil</label>
                <input
                  type="text"
                  value={brandData.texts.heroSubtitle}
                  onChange={(e) => updateNested('texts', 'heroSubtitle', e.target.value)}
                  disabled={!editMode}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Texte du bouton CTA</label>
                <input
                  type="text"
                  value={brandData.texts.ctaButton}
                  onChange={(e) => updateNested('texts', 'ctaButton', e.target.value)}
                  disabled={!editMode}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg disabled:bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Copyright du footer</label>
                <input
                  type="text"
                  value={brandData.texts.footerCopyright}
                  onChange={(e) => updateNested('texts', 'footerCopyright', e.target.value)}
                  disabled={!editMode}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg disabled:bg-gray-50"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {editMode && (
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-ocean-600 hover:bg-ocean-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            Enregistrer les modifications
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Réinitialiser
          </button>
        </div>
      )}

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">ℹ️ À propos du Gestionnaire de Marque</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Gérez tous les aspects de votre marque au même endroit</li>
          <li>• Modifiez les couleurs, polices, textes et images</li>
          <li>• Personnalisez les informations de contact et réseaux sociaux</li>
          <li>• Optimisez votre SEO avec les métadonnées</li>
          <li>• Les modifications s'appliquent automatiquement au site</li>
        </ul>
      </div>
    </div>
  )
}
