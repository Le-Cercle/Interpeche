import { useState, useEffect, useCallback } from 'react'

/**
 * useStore — hook générique pour persister des données dans localStorage.
 * Initialise depuis localStorage si une valeur existe, sinon depuis defaultValue.
 *
 * @param {string} key       - Clé localStorage
 * @param {*}      defaultValue - Valeur initiale si rien en localStorage
 * @returns [value, setValue, reset]
 */
export function useStore(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : defaultValue
    } catch {
      return defaultValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // localStorage indisponible (mode privé, quota dépassé)
    }
  }, [key, value])

  const reset = useCallback(() => {
    localStorage.removeItem(key)
    setValue(defaultValue)
  }, [key, defaultValue])

  return [value, setValue, reset]
}

/**
 * adminLog — ajoute une entrée dans les logs admin (localStorage).
 */
export function adminLog(action, details = '') {
  try {
    const logs = JSON.parse(localStorage.getItem('adminLogs') || '[]')
    logs.unshift({
      id: Date.now(),
      action,
      details,
      user: 'admin',
      timestamp: new Date().toLocaleString('fr-FR'),
      status: 'success',
    })
    localStorage.setItem('adminLogs', JSON.stringify(logs.slice(0, 100)))
  } catch {
    // silently fail
  }
}
