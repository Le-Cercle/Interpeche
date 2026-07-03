import { useState, useCallback, useEffect } from 'react'

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123',
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedAuth = localStorage.getItem('adminAuth')
    if (storedAuth) {
      try {
        const auth = JSON.parse(storedAuth)
        setUser(auth)
        setIsAuthenticated(true)
      } catch (e) {
        localStorage.removeItem('adminAuth')
      }
    }
    setLoading(false)
  }, [])

  const login = useCallback((username, password) => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const adminUser = { username, role: 'admin', loginTime: new Date().toISOString() }
      localStorage.setItem('adminAuth', JSON.stringify(adminUser))
      setUser(adminUser)
      setIsAuthenticated(true)
      return { success: true }
    }
    return { success: false, error: 'Identifiants invalides' }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('adminAuth')
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  }
}
