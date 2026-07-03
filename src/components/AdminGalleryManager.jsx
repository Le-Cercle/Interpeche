import { useState } from 'react'
import { Upload, Trash2, Edit2, Save, X } from 'lucide-react'

export default function AdminGalleryManager() {
  const [images, setImages] = useState([
    { id: 1, url: '/assets/img/gallery/1.jpg', title: 'Image 1', category: 'Événements' },
    { id: 2, url: '/assets/img/gallery/2.jpg', title: 'Image 2', category: 'Formation' },
  ])
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [newImage, setNewImage] = useState({ url: '', title: '', category: '' })
  const [showForm, setShowForm] = useState(false)

  const categories = ['Événements', 'Formation', 'Gouvernance', 'Partenariat', 'Autre']

  const handleAddImage = () => {
    if (newImage.url && newImage.title) {
      setImages([...images, { id: Date.now(), ...newImage }])
      setNewImage({ url: '', title: '', category: '' })
      setShowForm(false)
    }
  }

  const handleEdit = (image) => {
    setEditingId(image.id)
    setEditData(image)
  }

  const handleSaveEdit = () => {
    setImages(images.map(img => img.id === editingId ? editData : img))
    setEditingId(null)
  }

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      setImages(images.filter(img => img.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Add Image Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Ajouter une Image</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-ocean-600 hover:bg-ocean-700 text-white rounded-lg transition-colors"
          >
            {showForm ? 'Annuler' : 'Nouvelle Image'}
          </button>
        </div>

        {showForm && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL de l'image
              </label>
              <input
                type="text"
                value={newImage.url}
                onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                placeholder="https://exemple.com/image.jpg"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre
                </label>
                <input
                  type="text"
                  value={newImage.title}
                  onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
                  placeholder="Titre de l'image"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={newImage.category}
                  onChange={(e) => setNewImage({ ...newImage, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleAddImage}
              disabled={!newImage.url || !newImage.title}
              className="w-full flex items-center justify-center gap-2 bg-ocean-600 hover:bg-ocean-700 disabled:bg-gray-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <Upload className="w-4 h-4" />
              Ajouter l'image
            </button>
          </div>
        )}
      </div>

      {/* Images Grid */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Galerie ({images.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((image) => (
            <div key={image.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              {/* Image Preview */}
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23999" font-size="12"%3EImage%3C/text%3E%3C/svg%3E'
                  }}
                />
              </div>

              {/* Edit Mode */}
              {editingId === image.id ? (
                <div className="p-4 space-y-3 bg-gray-50">
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-ocean-400"
                  />
                  <select
                    value={editData.category}
                    onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-ocean-400"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
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
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{image.title}</h3>
                  <p className="text-xs text-gray-500 mb-3">{image.category}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(image)}
                      className="flex-1 flex items-center justify-center gap-1 bg-ocean-100 hover:bg-ocean-200 text-ocean-700 text-sm font-semibold px-3 py-2 rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Éditer
                    </button>
                    <button
                      onClick={() => handleDelete(image.id)}
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

        {images.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune image pour le moment</p>
          </div>
        )}
      </div>
    </div>
  )
}
