import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, LogIn, AlertCircle, ChevronLeft } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      const result = login(username, password)
      if (result.success) {
        navigate('/admin/dashboard')
      } else {
        setError(result.error)
      }
      setLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ocean-900 to-ocean-700 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-ocean-100 rounded-full mb-4">
              <Lock className="w-8 h-8 text-ocean-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
            <p className="text-gray-500">Connectez-vous pour gérer le site</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-ocean-400 focus:ring-1 focus:ring-ocean-400 transition-colors"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:border-ocean-400 focus:ring-1 focus:ring-ocean-400 transition-colors"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full flex items-center justify-center gap-2 bg-ocean-600 hover:bg-ocean-700 disabled:bg-ocean-400 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Se connecter
                </>
              )}
            </button>
          </form>

          {/* Demo hint */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-400 text-center">
              Contactez l'administrateur pour obtenir vos accès.
            </p>
          </div>
        </div>

        {/* Footer link */}
        <div className="text-center mt-6">
          <a href="/" className="inline-flex items-center gap-1 text-white hover:text-ocean-200 text-sm transition-colors">
            <ChevronLeft className="w-4 h-4" /> Retour au site
          </a>
        </div>
      </div>
    </div>
  )
}
