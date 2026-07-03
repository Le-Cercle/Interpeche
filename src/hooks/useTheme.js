import { useState, useCallback, useEffect } from 'react'

const DEFAULT_THEME = {
  primary: '#006994',
  secondary: '#f77f00',
  accent: '#00b4d8',
  background: '#ffffff',
  text: '#1a1a1a',
  headerBg: '#000b18',
  headerText: '#ffffff',
  footerBg: '#000b18',
  footerText: '#ffffff',
}

export function useTheme() {
  const [theme, setTheme] = useState(DEFAULT_THEME)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedTheme = localStorage.getItem('siteTheme')
    if (storedTheme) {
      try {
        setTheme(JSON.parse(storedTheme))
      } catch (e) {
        setTheme(DEFAULT_THEME)
      }
    } else {
      setTheme(DEFAULT_THEME)
    }
    setLoading(false)
  }, [])

  const updateTheme = useCallback((newTheme) => {
    const merged = { ...theme, ...newTheme }
    setTheme(merged)
    localStorage.setItem('siteTheme', JSON.stringify(merged))
    applyThemeToDOM(merged)
  }, [theme])

  const resetTheme = useCallback(() => {
    setTheme(DEFAULT_THEME)
    localStorage.setItem('siteTheme', JSON.stringify(DEFAULT_THEME))
    applyThemeToDOM(DEFAULT_THEME)
  }, [])

  return {
    theme,
    loading,
    updateTheme,
    resetTheme,
  }
}

function applyThemeToDOM(theme) {
  const root = document.documentElement
  root.style.setProperty('--color-primary', theme.primary)
  root.style.setProperty('--color-secondary', theme.secondary)
  root.style.setProperty('--color-accent', theme.accent)
  root.style.setProperty('--color-background', theme.background)
  root.style.setProperty('--color-text', theme.text)
  root.style.setProperty('--color-header-bg', theme.headerBg)
  root.style.setProperty('--color-header-text', theme.headerText)
  root.style.setProperty('--color-footer-bg', theme.footerBg)
  root.style.setProperty('--color-footer-text', theme.footerText)
}
