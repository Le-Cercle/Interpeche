import { useState } from 'react'
import { Plus, Edit2, Trash2, Save, X, Calendar, User, Tag, CheckCircle } from 'lucide-react'
import RichTextEditor from './RichTextEditor'
import { useStore, adminLog } from '../hooks/useStore'
import newsJson from '../data/news.json'

const DEFAULT_NEWS = newsJson.actualites.map((a) => ({
  id: a.id,
  titre: a.titre,
  description: a.description,
  contenu: a.contenu || '',
  auteur: a.auteur || 'Admin',
  date: a.date,
  categorie: a.categorie,
  image: a.image || '',
  couleur: '#006994',
  police: 'font-sans',
  taille: 'text-lg',
}))

export default function AdminNewsManager() {
  const [news, setNews, resetNews] = useStore('adminNews', DEFAULT_NEWS)
  const [saved, setSaved] = useState(false)

  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [showForm, setShowForm] = useState(false)
  const [newArticle, setNewArticle] = useState({
    titre: '',
    description: '',
    contenu: '',
    auteur: 'Admin',
    categorie: 'Actualité',
    image: '',
    couleur: '#006994',
    police: 'font-sans',
    taille: 'text-lg',
  })

  const categories = ['Événement', 'Formation', 'Gouvernance', 'Distinction', 'Économie Bleue', 'Partenariat', 'Innovation', 'Actualité']
  const fonts = [
    { value: 'font-sans', label: 'Sans Serif' },
    { value: 'font-serif', label: 'Serif' },
    { value: 'font-mono', label: 'Monospace' },
  ]
  const sizes = [
    { value: 'text-sm', label: 'Petit' },
    { value: 'text-base', label: 'Normal' },
    { value: 'text-lg', label: 'Grand' },
    { value: 'text-xl', label: 'Très grand' },
    { value: 'text-2xl', label: 'Énorme' },
  ]

  const flash = () => { setSaved(true); setTimeout(() => setSaved(false), 3000) }

  const handleAddArticle = () => {
    if (newArticle.titre && newArticle.description) {
      const article = { id: Date.now(), date: new Date().toLocaleDateString('fr-FR'), ...newArticle }
      setNews([article, ...news])
      adminLog('Ajout actualité', newArticle.titre)
      setNewArticle({ titre: '', description: '', contenu: '', auteur: 'Admin', categorie: 'Actualité', image: '', couleur: '#006994', police: 'font-sans', taille: 'text-lg' })
      setShowForm(false)
      flash()
    }
  }

  const handleEdit = (article) => {
    setEditingId(article.id)
    setEditData(article)
  }

  const handleSaveEdit = () => {
    setNews(news.map(a => a.id === editingId ? editData : a))
    adminLog('Modification actualité', editData.titre)
    setEditingId(null)
    flash()
  }

  const handleDelete = (id) => {
    const article = news.find(a => a.id === id)
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      setNews(news.filter(a => a.id !== id))
      adminLog('Suppression actualité', article?.titre || '')
      flash()
    }
  }

  return (
    <div className="space-y-6">
      {/* Add Article Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Ajouter une Actualité</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-ocean-600 hover:bg-ocean-700 text-white rounded-lg transition-colors"
          >
            {showForm ? 'Annuler' : 'Nouvelle Actualité'}
          </button>
        </div>

        {showForm && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            {/* Titre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Titre</label>
              <input
                type="text"
                value={newArticle.titre}
                onChange={(e) => setNewArticle({ ...newArticle, titre: e.target.value })}
                placeholder="Titre de l'actualité"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description courte</label>
              <textarea
                value={newArticle.description}
                onChange={(e) => setNewArticle({ ...newArticle, description: e.target.value })}
                placeholder="Résumé de l'actualité"
                rows={2}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400 resize-none"
              />
            </div>

            {/* Contenu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contenu détaillé</label>
              <RichTextEditor
                value={newArticle.contenu}
                onChange={(value) => setNewArticle({ ...newArticle, contenu: value })}
              />
            </div>

            {/* Métadonnées */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                <select
                  value={newArticle.categorie}
                  onChange={(e) => setNewArticle({ ...newArticle, categorie: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="text"
                  value={newArticle.image}
                  onChange={(e) => setNewArticle({ ...newArticle, image: e.target.value })}
                  placeholder="https://exemple.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400"
                />
              </div>
            </div>

            {/* Style */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold text-gray-900 mb-3">Style du titre</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Couleur</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={newArticle.couleur}
                      onChange={(e) => setNewArticle({ ...newArticle, couleur: e.target.value })}
                      className="w-12 h-10 rounded-lg cursor-pointer border border-gray-200"
                    />
                    <input
                      type="text"
                      value={newArticle.couleur}
                      onChange={(e) => setNewArticle({ ...newArticle, couleur: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-ocean-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Police</label>
                  <select
                    value={newArticle.police}
                    onChange={(e) => setNewArticle({ ...newArticle, police: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400"
                  >
                    {fonts.map(font => (
                      <option key={font.value} value={font.value}>{font.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Taille</label>
                  <select
                    value={newArticle.taille}
                    onChange={(e) => setNewArticle({ ...newArticle, taille: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400"
                  >
                    {sizes.map(size => (
                      <option key={size.value} value={size.value}>{size.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={handleAddArticle}
              disabled={!newArticle.titre || !newArticle.description}
              className="w-full flex items-center justify-center gap-2 bg-ocean-600 hover:bg-ocean-700 disabled:bg-gray-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Ajouter l'actualité
            </button>
          </div>
        )}
      </div>

      {/* News List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Actualités ({news.length})</h2>
        <div className="space-y-4">
          {news.map((article) => (
            <div key={article.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              {editingId === article.id ? (
                <div className="p-4 space-y-4 bg-gray-50">
                  {/* Edit Mode */}
                  <input
                    type="text"
                    value={editData.titre}
                    onChange={(e) => setEditData({ ...editData, titre: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400"
                  />
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400 resize-none"
                  />
                  <RichTextEditor
                    value={editData.contenu}
                    onChange={(value) => setEditData({ ...editData, contenu: value })}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select
                      value={editData.categorie}
                      onChange={(e) => setEditData({ ...editData, categorie: e.target.value })}
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    <input
                      type="color"
                      value={editData.couleur}
                      onChange={(e) => setEditData({ ...editData, couleur: e.target.value })}
                      className="h-10 rounded-lg cursor-pointer border border-gray-200"
                    />
                    <select
                      value={editData.taille}
                      onChange={(e) => setEditData({ ...editData, taille: e.target.value })}
                      className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400"
                    >
                      {sizes.map(size => (
                        <option key={size.value} value={size.value}>{size.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveEdit}
                      className="flex-1 flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-3 py-2 rounded transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      Enregistrer
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex-1 flex items-center justify-center gap-1 bg-gray-400 hover:bg-gray-500 text-white text-sm font-semibold px-3 py-2 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  <div className="flex gap-4 mb-3">
                    {article.image && (
                      <img
                        src={article.image}
                        alt={article.titre}
                        className="w-24 h-24 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3C/svg%3E'
                        }}
                      />
                    )}
                    <div className="flex-1">
                      <h3
                        className={`font-bold mb-2 ${article.police} ${article.taille}`}
                        style={{ color: article.couleur }}
                      >
                        {article.titre}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">{article.description}</p>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          <Tag className="w-3 h-3" />
                          {article.categorie}
                        </span>
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          <Calendar className="w-3 h-3" />
                          {article.date}
                        </span>
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          <User className="w-3 h-3" />
                          {article.auteur}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(article)}
                      className="flex-1 flex items-center justify-center gap-1 bg-ocean-100 hover:bg-ocean-200 text-ocean-700 text-sm font-semibold px-3 py-2 rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Éditer
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="flex-1 flex items-center justify-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-semibold px-3 py-2 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {news.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune actualité pour le moment</p>
          </div>
        )}
      </div>
    </div>
  )
}
