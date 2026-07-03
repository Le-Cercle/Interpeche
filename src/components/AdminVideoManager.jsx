import { useState } from 'react'
import { Plus, Trash2, Edit2, Save, X, Play } from 'lucide-react'

export default function AdminVideoManager() {
  const [videos, setVideos] = useState([
    { id: 1, title: 'Vidéo 1', youtubeId: 'dQw4w9WgXcQ', category: 'Événement', description: 'Description vidéo 1' },
    { id: 2, title: 'Vidéo 2', youtubeId: 'jNQXAC9IVRw', category: 'Formation', description: 'Description vidéo 2' },
  ])
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [newVideo, setNewVideo] = useState({ title: '', youtubeId: '', category: '', description: '' })
  const [showForm, setShowForm] = useState(false)

  const categories = ['Événement', 'Formation', 'Gouvernance', 'Partenariat', 'Autre']

  const handleAddVideo = () => {
    if (newVideo.title && newVideo.youtubeId) {
      setVideos([...videos, { id: Date.now(), ...newVideo }])
      setNewVideo({ title: '', youtubeId: '', category: '', description: '' })
      setShowForm(false)
    }
  }

  const handleEdit = (video) => {
    setEditingId(video.id)
    setEditData(video)
  }

  const handleSaveEdit = () => {
    setVideos(videos.map(v => v.id === editingId ? editData : v))
    setEditingId(null)
  }

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette vidéo ?')) {
      setVideos(videos.filter(v => v.id !== id))
    }
  }

  const getYoutubeThumbnail = (youtubeId) => {
    return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
  }

  return (
    <div className="space-y-6">
      {/* Add Video Form */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Ajouter une Vidéo</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-ocean-600 hover:bg-ocean-700 text-white rounded-lg transition-colors"
          >
            {showForm ? 'Annuler' : 'Nouvelle Vidéo'}
          </button>
        </div>

        {showForm && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID YouTube
              </label>
              <input
                type="text"
                value={newVideo.youtubeId}
                onChange={(e) => setNewVideo({ ...newVideo, youtubeId: e.target.value })}
                placeholder="dQw4w9WgXcQ"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400"
              />
              <p className="text-xs text-gray-500 mt-1">Exemple: https://youtube.com/watch?v=<strong>dQw4w9WgXcQ</strong></p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titre
              </label>
              <input
                type="text"
                value={newVideo.title}
                onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                placeholder="Titre de la vidéo"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Catégorie
                </label>
                <select
                  value={newVideo.category}
                  onChange={(e) => setNewVideo({ ...newVideo, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={newVideo.description}
                onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                placeholder="Description de la vidéo"
                rows={3}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400 resize-none"
              />
            </div>

            <button
              onClick={handleAddVideo}
              disabled={!newVideo.title || !newVideo.youtubeId}
              className="w-full flex items-center justify-center gap-2 bg-ocean-600 hover:bg-ocean-700 disabled:bg-gray-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Ajouter la vidéo
            </button>
          </div>
        )}
      </div>

      {/* Videos Grid */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Vidéothèque ({videos.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <div key={video.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              {/* Video Thumbnail */}
              <div className="aspect-video bg-gray-900 relative group">
                <img
                  src={getYoutubeThumbnail(video.youtubeId)}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23222" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" dy=".3em" fill="%23fff" font-size="12"%3EVideo%3C/text%3E%3C/svg%3E'
                  }}
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 flex items-center justify-center transition-colors">
                  <Play className="w-12 h-12 text-white fill-white" />
                </div>
              </div>

              {/* Edit Mode */}
              {editingId === video.id ? (
                <div className="p-4 space-y-3 bg-gray-50">
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    placeholder="Titre"
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
                  <textarea
                    value={editData.description}
                    onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                    placeholder="Description"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-ocean-400 resize-none"
                  />
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
                  <h3 className="font-semibold text-gray-900 text-sm mb-1">{video.title}</h3>
                  <p className="text-xs text-gray-500 mb-2">{video.category}</p>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{video.description}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(video)}
                      className="flex-1 flex items-center justify-center gap-1 bg-ocean-100 hover:bg-ocean-200 text-ocean-700 text-sm font-semibold px-3 py-2 rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                      Éditer
                    </button>
                    <button
                      onClick={() => handleDelete(video.id)}
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

        {videos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune vidéo pour le moment</p>
          </div>
        )}
      </div>
    </div>
  )
}
