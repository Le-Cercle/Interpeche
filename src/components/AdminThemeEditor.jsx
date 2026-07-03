import { useState, useEffect } from 'react'
import { useTheme } from '../hooks/useTheme'
import { RotateCcw, Save } from 'lucide-react'

const COLOR_FIELDS = [
  { key: 'primary', label: 'Couleur Primaire', description: 'Couleur principale du site' },
  { key: 'secondary', label: 'Couleur Secondaire', description: 'Couleur d\'accent' },
  { key: 'accent', label: 'Couleur Accent', description: 'Couleur d\'accent supplémentaire' },
  { key: 'background', label: 'Fond', description: 'Couleur de fond' },
  { key: 'text', label: 'Texte', description: 'Couleur du texte principal' },
  { key: 'headerBg', label: 'Fond Header', description: 'Couleur de fond du header' },
  { key: 'headerText', label: 'Texte Header', description: 'Couleur du texte du header' },
  { key: 'footerBg', label: 'Fond Footer', description: 'Couleur de fond du footer' },
  { key: 'footerText', label: 'Texte Footer', description: 'Couleur du texte du footer' },
]

export default function AdminThemeEditor() {
  const { theme, updateTheme, resetTheme } = useTheme()
  const [colors, setColors] = useState(theme)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setColors(theme)
  }, [theme])

  const handleColorChange = (key, value) => {
    setColors((prev) => ({ ...prev, [key]: value }))
    setSaved(false)
  }

  const handleSave = () => {
    updateTheme(colors)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser les couleurs par défaut ?')) {
      resetTheme()
      setColors(theme)
    }
  }

  return (
    <div className="space-y-6">
      {/* Preview */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Aperçu</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className="p-6 rounded-lg text-white"
            style={{ backgroundColor: colors.primary }}
          >
            <p className="font-bold">Couleur Primaire</p>
            <p className="text-sm opacity-90">{colors.primary}</p>
          </div>
          <div
            className="p-6 rounded-lg text-white"
            style={{ backgroundColor: colors.secondary }}
          >
            <p className="font-bold">Couleur Secondaire</p>
            <p className="text-sm opacity-90">{colors.secondary}</p>
          </div>
          <div
            className="p-6 rounded-lg text-white"
            style={{ backgroundColor: colors.accent }}
          >
            <p className="font-bold">Couleur Accent</p>
            <p className="text-sm opacity-90">{colors.accent}</p>
          </div>
        </div>
      </div>

      {/* Color Editor */}
      <div className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Personnaliser les Couleurs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COLOR_FIELDS.map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {field.label}
              </label>
              <p className="text-xs text-gray-500 mb-3">{field.description}</p>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={colors[field.key]}
                  onChange={(e) => handleColorChange(field.key, e.target.value)}
                  className="w-16 h-10 rounded-lg cursor-pointer border border-gray-200"
                />
                <input
                  type="text"
                  value={colors[field.key]}
                  onChange={(e) => handleColorChange(field.key, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:border-ocean-400"
                  placeholder="#000000"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
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

      {saved && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          ✓ Couleurs enregistrées avec succès !
        </div>
      )}
    </div>
  )
}
