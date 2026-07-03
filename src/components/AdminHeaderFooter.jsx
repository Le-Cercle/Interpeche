import { useState } from 'react'
import { Save, Edit2 } from 'lucide-react'

export default function AdminHeaderFooter() {
  const [editMode, setEditMode] = useState(false)
  const [header, setHeader] = useState({
    logoUrl: '/logo.png',
    logoAlt: 'Interpêche CI',
    navItems: ['Accueil', 'Qui sommes-nous', 'Activités', 'Organisation', 'Actualités', 'Galerie', 'Vidéothèque', 'Contact'],
  })
  const [footer, setFooter] = useState({
    companyName: 'Interpêche Côte d\'Ivoire',
    description: 'Interprofession de la filière pêche Côte d\'Ivoire',
    address: 'Zone Portuaire, Cité des cadres du port',
    phone: '+225 27 21 73 81 52',
    email: 'interpechecotedivoire@gmail.com',
    socialLinks: {
      facebook: 'https://www.facebook.com/interpeche.ci',
      twitter: '#',
      linkedin: '#',
      youtube: '#',
    },
  })

  const handleSave = () => {
    console.log('Header et Footer sauvegardés')
    setEditMode(false)
  }

  return (
    <div className="space-y-6">
      {/* Header Editor */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Header</h2>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              editMode
                ? 'bg-red-100 text-red-700'
                : 'bg-ocean-100 text-ocean-700'
            }`}
          >
            <Edit2 className="w-4 h-4" />
            {editMode ? 'Annuler' : 'Éditer'}
          </button>
        </div>

        {editMode ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL du Logo
              </label>
              <input
                type="text"
                value={header.logoUrl}
                onChange={(e) => setHeader({ ...header, logoUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alt Text du Logo
              </label>
              <input
                type="text"
                value={header.logoAlt}
                onChange={(e) => setHeader({ ...header, logoAlt: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Éléments de Navigation (séparés par des virgules)
              </label>
              <textarea
                value={header.navItems.join(', ')}
                onChange={(e) => setHeader({ ...header, navItems: e.target.value.split(',').map(item => item.trim()) })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400 resize-none"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p><strong>Logo :</strong> {header.logoUrl}</p>
            <p><strong>Navigation :</strong> {header.navItems.join(' • ')}</p>
          </div>
        )}
      </div>

      {/* Footer Editor */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Footer</h2>

        {editMode ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom de l'Entreprise
                </label>
                <input
                  type="text"
                  value={footer.companyName}
                  onChange={(e) => setFooter({ ...footer, companyName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <input
                  type="tel"
                  value={footer.phone}
                  onChange={(e) => setFooter({ ...footer, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={footer.email}
                  onChange={(e) => setFooter({ ...footer, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse
                </label>
                <input
                  type="text"
                  value={footer.address}
                  onChange={(e) => setFooter({ ...footer, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={footer.description}
                onChange={(e) => setFooter({ ...footer, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook
                </label>
                <input
                  type="url"
                  value={footer.socialLinks.facebook}
                  onChange={(e) => setFooter({ ...footer, socialLinks: { ...footer.socialLinks, facebook: e.target.value } })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Twitter
                </label>
                <input
                  type="url"
                  value={footer.socialLinks.twitter}
                  onChange={(e) => setFooter({ ...footer, socialLinks: { ...footer.socialLinks, twitter: e.target.value } })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn
                </label>
                <input
                  type="url"
                  value={footer.socialLinks.linkedin}
                  onChange={(e) => setFooter({ ...footer, socialLinks: { ...footer.socialLinks, linkedin: e.target.value } })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube
                </label>
                <input
                  type="url"
                  value={footer.socialLinks.youtube}
                  onChange={(e) => setFooter({ ...footer, socialLinks: { ...footer.socialLinks, youtube: e.target.value } })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400"
                />
              </div>
            </div>

            <button
              onClick={handleSave}
              className="w-full flex items-center justify-center gap-2 bg-ocean-600 hover:bg-ocean-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <Save className="w-4 h-4" />
              Enregistrer
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p><strong>Entreprise :</strong> {footer.companyName}</p>
            <p><strong>Adresse :</strong> {footer.address}</p>
            <p><strong>Téléphone :</strong> {footer.phone}</p>
            <p><strong>Email :</strong> {footer.email}</p>
          </div>
        )}
      </div>
    </div>
  )
}
