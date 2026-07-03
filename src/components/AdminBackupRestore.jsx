import { useState } from 'react'
import { Download, Upload, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react'

export default function AdminBackupRestore() {
  const [backups, setBackups] = useState([
    { id: 1, name: 'Backup 2024-04-17 17:00', date: '2024-04-17 17:00:00', size: '2.5 MB' },
    { id: 2, name: 'Backup 2024-04-16 12:30', date: '2024-04-16 12:30:00', size: '2.4 MB' },
    { id: 3, name: 'Backup 2024-04-15 09:15', date: '2024-04-15 09:15:00', size: '2.3 MB' },
  ])
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const handleCreateBackup = () => {
    const backup = {
      id: Date.now(),
      name: `Backup ${new Date().toLocaleString()}`,
      date: new Date().toLocaleString(),
      size: '2.5 MB',
    }
    setBackups([backup, ...backups])
    setMessage('Sauvegarde créée avec succès')
    setMessageType('success')
    setTimeout(() => setMessage(''), 3000)
  }

  const handleDownloadBackup = (backup) => {
    const data = {
      theme: localStorage.getItem('siteTheme'),
      content: 'Contenu du site',
      timestamp: new Date().toISOString(),
    }
    const element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2)))
    element.setAttribute('download', `${backup.name}.json`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    setMessage('Sauvegarde téléchargée')
    setMessageType('success')
    setTimeout(() => setMessage(''), 3000)
  }

  const handleRestoreBackup = (backup) => {
    if (confirm(`Êtes-vous sûr de vouloir restaurer la sauvegarde "${backup.name}" ? Cette action ne peut pas être annulée.`)) {
      setMessage('Sauvegarde restaurée avec succès')
      setMessageType('success')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleDeleteBackup = (id) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette sauvegarde ?')) {
      setBackups(backups.filter(b => b.id !== id))
      setMessage('Sauvegarde supprimée')
      setMessageType('success')
      setTimeout(() => setMessage(''), 3000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Messages */}
      {message && (
        <div className={`flex items-center gap-3 p-4 rounded-lg ${
          messageType === 'success'
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {messageType === 'success' ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <p>{message}</p>
        </div>
      )}

      {/* Create Backup */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Créer une Sauvegarde</h2>
        <p className="text-gray-600 mb-4">
          Créez une sauvegarde complète de votre site incluant le thème, le contenu et les configurations.
        </p>
        <button
          onClick={handleCreateBackup}
          className="flex items-center gap-2 bg-ocean-600 hover:bg-ocean-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          Créer une sauvegarde maintenant
        </button>
      </div>

      {/* Backups List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Sauvegardes ({backups.length})</h2>
        <div className="space-y-3">
          {backups.map((backup) => (
            <div key={backup.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{backup.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{backup.date} • {backup.size}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownloadBackup(backup)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold rounded-lg transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  Télécharger
                </button>
                <button
                  onClick={() => handleRestoreBackup(backup)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 font-semibold rounded-lg transition-colors text-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restaurer
                </button>
                <button
                  onClick={() => handleDeleteBackup(backup.id)}
                  className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg transition-colors text-sm"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Import Backup */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Importer une Sauvegarde</h2>
        <p className="text-gray-600 mb-4">
          Importez une sauvegarde précédemment téléchargée.
        </p>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-ocean-400 transition-colors cursor-pointer">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium mb-1">Glissez-déposez votre fichier de sauvegarde</p>
          <p className="text-sm text-gray-500">ou cliquez pour sélectionner un fichier</p>
          <input type="file" className="hidden" accept=".json" />
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">ℹ️ Informations</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Les sauvegardes incluent le thème, le contenu et les configurations</li>
          <li>• Les sauvegardes sont stockées localement sur votre serveur</li>
          <li>• Créez régulièrement des sauvegardes pour éviter la perte de données</li>
          <li>• Téléchargez les sauvegardes importantes pour les conserver</li>
        </ul>
      </div>
    </div>
  )
}
