import { useState, useCallback, useEffect } from 'react'
import { auth as authApi, setToken, clearToken, getToken } from '../services/api'

// Identifiants de développement : présents UNIQUEMENT en `vite dev`
// (supprimés du bundle de production). En production, la connexion passe
// obligatoirement par la table `users` via /api/auth.php.
const DEV_FALLBACK = import.meta.env.DEV ? { username: 'admin', password: 'admin123' } : null

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('adminAuth')
      if (stored) {
        const auth = JSON.parse(stored)
        // En production une session sans jeton serveur n'est pas valide.
        if (import.meta.env.DEV || getToken()) {
          setUser(auth)
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem('adminAuth')
        }
      }
    } catch {
      localStorage.removeItem('adminAuth')
    }
    setLoading(false)
  }, [])

  const login = useCallback(async (username, password) => {
    // 1) Authentification serveur (comptes de la table `users`)
    try {
      const res = await authApi.login(username, password)
      if (res?.token && res?.user) {
        setToken(res.token)
        const u = { username: res.user.username, email: res.user.email, role: res.user.role, loginTime: new Date().toISOString() }
        localStorage.setItem('adminAuth', JSON.stringify(u))
        setUser(u)
        setIsAuthenticated(true)
        return { success: true }
      }
    } catch (e) {
      // Identifiants refusés par le serveur : on s'arrête là.
      if (e?.status === 401 || e?.status === 422 || e?.status === 429) {
        return { success: false, error: e.message || 'Identifiants invalides' }
      }
      // Sinon (serveur absent, ex. `vite dev`) : repli développement ci-dessous.
    }

    // 2) Repli développement uniquement
    if (DEV_FALLBACK && username === DEV_FALLBACK.username && password === DEV_FALLBACK.password) {
      const u = { username, role: 'admin', loginTime: new Date().toISOString() }
      localStorage.setItem('adminAuth', JSON.stringify(u))
      setUser(u)
      setIsAuthenticated(true)
      return { success: true }
    }
    return { success: false, error: 'Identifiants invalides' }
  }, [])

  const logout = useCallback(() => {
    authApi.logout().catch(() => {})
    clearToken()
    localStorage.removeItem('adminAuth')
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  return { isAuthenticated, user, loading, login, logout }
}
