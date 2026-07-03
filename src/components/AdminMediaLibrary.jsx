import { useState } from 'react'
import { Upload, Trash2, Copy, Download, Eye, Grid3x3, List } from 'lucide-react'

export default function AdminMediaLibrary() {
  const [media, setMedia] = useState([
    { id: 1, name: 'image-1.jpg', type: 'image', url: '/assets/img/gallery/1.jpg', size: '2.4 MB', date: '2024-04-17', alt: 'Image 1' },
    { id: 2, name: 'image-2.jpg', type: 'image', url: '/assets/img/gallery/2.jpg', size: '1.8 MB', date: '2024-04-16', alt: 'Image 2' },
    { id: 3, name: 'image-3.jpg', type: 'image', url: '/assets/img/gallery/3.jpg', size: '3.1 MB', date: '2024-04-15', alt: 'Image 3' },
  ])
  const [viewMode, setViewMode] = useState('grid')
  const [selectedMedia, setSelectedMedia] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  const filteredMedia = media.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchType = filterType === 'all' || m.type === filterType
    return matchSearch && matchType
  })

  const handleDelete = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) {
      setMedia(media.filter(m => m.id !== id))
      setSelectedMedia(null)
    }
  }

  const handleCopyUrl = (url) => {
    navigator.clipboard.writeText(url)
    alert('URL copiée !')
  }

  const handleDownload = (url, name) => {
    const element = document.createElement('a')
    element.setAttribute('href', url)
    element.setAttribute('download', name)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleUpload = (e) => {
    const files = e.target.files
    if (files) {
      for (let file of files) {
        const newMedia = {
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type.startsWith('image') ? 'image' : 'file',
          url: URL.createObjectURL(file),
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          date: new Date().toLocaleDateString(),
          alt: file.name,
        }
        setMedia([newMedia, ...media])
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Bibliothèque Média</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-ocean-400 transition-colors cursor-pointer">
          <label className="cursor-pointer">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium mb-1">Glissez-déposez vos fichiers</p>
            <p className="text-sm text-gray-500 mb-3">ou cliquez pour sélectionner</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400"
          />

          {/* Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-ocean-400"
          >
            <option value="all">Tous les fichiers</option>
            <option value="image">Images</option>
            <option value="file">Fichiers</option>
          </select>

          {/* View Mode */}
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-ocean-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-ocean-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMedia.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedMedia(item)}
                className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                  selectedMedia?.id === item.id
                    ? 'border-ocean-600 shadow-lg'
                    : 'border-gray-200 hover:border-ocean-400'
                }`}
              >
                <div className="aspect-square bg-gray-100 relative group">
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={item.alt}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3C/svg%3E'
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <Upload className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                    <button className="p-2 bg-white rounded-lg hover:bg-gray-100">
                      <Eye className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.size}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Nom</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Taille</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMedia.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedMedia(item)}
                    className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                      selectedMedia?.id === item.id ? 'bg-ocean-50' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-gray-900 font-medium">{item.name}</td>
                    <td className="py-3 px-4 text-gray-600">{item.type}</td>
                    <td className="py-3 px-4 text-gray-600">{item.size}</td>
                    <td className="py-3 px-4 text-gray-600">{item.date}</td>
                    <td className="py-3 px-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(item.id)
                        }}
                        className="text-red-600 hover:text-red-700 font-medium text-sm"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredMedia.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun fichier trouvé</p>
          </div>
        )}
      </div>

      {/* Preview Panel */}
      {selectedMedia && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Détails du fichier</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Preview */}
            <div>
              {selectedMedia.type === 'image' ? (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.alt}
                  className="w-full rounded-lg"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3C/svg%3E'
                  }}
                />
              ) : (
                <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <Upload className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom du fichier</label>
                <p className="text-gray-900 font-medium">{selectedMedia.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <p className="text-gray-900">{selectedMedia.type}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Taille</label>
                <p className="text-gray-900">{selectedMedia.size}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={selectedMedia.url}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono bg-gray-50"
                  />
                  <button
                    onClick={() => handleCopyUrl(selectedMedia.url)}
                    className="p-2 bg-ocean-100 hover:bg-ocean-200 text-ocean-700 rounded-lg transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  onClick={() => handleDownload(selectedMedia.url, selectedMedia.name)}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Télécharger
                </button>
                <button
                  onClick={() => handleDelete(selectedMedia.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
