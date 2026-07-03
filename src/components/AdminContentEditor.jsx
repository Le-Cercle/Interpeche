import { useState } from 'react'
import { Plus, Edit2, Trash2, Save } from 'lucide-react'

const PAGES = [
  { id: 'home', name: 'Accueil', path: '/' },
  { id: 'about', name: 'Qui sommes-nous', path: '/qui-sommes-nous' },
  { id: 'activities', name: 'Activités', path: '/activites' },
  { id: 'governance', name: 'Organisation', path: '/organisation' },
  { id: 'news', name: 'Actualités', path: '/actualites' },
  { id: 'gallery', name: 'Galerie', path: '/galerie' },
  { id: 'videos', name: 'Vidéothèque', path: '/videotheque' },
  { id: 'contact', name: 'Contact', path: '/contact' },
]

export default function AdminContentEditor() {
  const [selectedPage, setSelectedPage] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [content, setContent] = useState({
    title: '',
    description: '',
    body: '',
  })

  const handleSelectPage = (page) => {
    setSelectedPage(page)
    setEditMode(false)
    setContent({
      title: `Titre de ${page.name}`,
      description: `Description de ${page.name}`,
      body: `Contenu principal de ${page.name}`,
    })
  }

  const handleSave = () => {
    console.log('Contenu sauvegardé :', selectedPage, content)
    setEditMode(false)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Pages List */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pages</h2>
          <div className="space-y-2">
            {PAGES.map((page) => (
              <button
                key={page.id}
                onClick={() => handleSelectPage(page)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  selectedPage?.id === page.id
                    ? 'bg-ocean-100 text-ocean-700 font-semibold'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Editor */}
      <div className="lg:col-span-2">
        {selectedPage ? (
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Éditer : {selectedPage.name}
              </h2>
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
                    Titre
                  </label>
                  <input
                    type="text"
                    value={content.title}
                    onChange={(e) => setContent({ ...content, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={content.description}
                    onChange={(e) => setContent({ ...content, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contenu
                  </label>
                  <textarea
                    value={content.body}
                    onChange={(e) => setContent({ ...content, body: e.target.value })}
                    rows={8}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400 resize-none font-mono text-sm"
                  />
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
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Titre</p>
                  <p className="text-lg font-semibold text-gray-900">{content.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <p className="text-gray-700">{content.description}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Contenu</p>
                  <p className="text-gray-700 whitespace-pre-wrap">{content.body}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500">Sélectionnez une page pour commencer à éditer</p>
          </div>
        )}
      </div>
    </div>
  )
}
