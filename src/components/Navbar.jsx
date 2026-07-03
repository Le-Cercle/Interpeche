import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/qui-sommes-nous', label: 'Qui sommes-nous' },
  { to: '/activites', label: 'Activités' },
  { to: '/organisation', label: 'Organisation' },
  { to: '/actualites', label: 'Actualités' },
  {
    label: 'Médias',
    children: [
      { to: '/galerie', label: 'Galerie photos' },
      { to: '/videotheque', label: 'Vidéothèque' },
    ],
  },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mediaOpen, setMediaOpen] = useState(false)
  const mediaRef = useRef(null)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setMediaOpen(false)
  }, [location])

  useEffect(() => {
    if (!mediaOpen) return
    const handler = (e) => {
      if (mediaRef.current && !mediaRef.current.contains(e.target)) setMediaOpen(false)
    }
    document.addEventListener('mousedown', handler)
    document.addEventListener('focusin', handler)
    return () => {
      document.removeEventListener('mousedown', handler)
      document.removeEventListener('focusin', handler)
    }
  }, [mediaOpen])

  const isActive = (to) => location.pathname === to

  const navBase = isHome && !scrolled
    ? 'bg-transparent text-white'
    : 'bg-white/95 backdrop-blur-md shadow-sm text-gray-700'

  const linkColor = isHome && !scrolled
    ? 'text-white/90 hover:text-white'
    : 'text-gray-600 hover:text-ocean-600'

  const logoColor = isHome && !scrolled ? 'text-white' : 'text-ocean-700'

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBase}`}
      >
        <div className="container">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="Interpêche CI"
                className={`h-10 w-auto object-contain transition-all duration-300 ${
                  isHome && !scrolled ? 'brightness-0 invert' : ''
                }`}
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {links.map((link) =>
                link.children ? (
                  <div key={link.label} className="relative" ref={mediaRef}>
                    <button
                      onClick={() => setMediaOpen((o) => !o)}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${linkColor}`}
                    >
                      {link.label}
                      <ChevronDown className={`w-4 h-4 transition-transform ${mediaOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {mediaOpen && (
                      <div className="absolute top-full left-0 mt-2 w-44 bg-white rounded-xl shadow-glass border border-gray-100 py-1 z-50">
                        {link.children.map((child) => (
                          <Link
                            key={child.to}
                            to={child.to}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-ocean-50 hover:text-ocean-600 transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.to)
                        ? isHome && !scrolled
                          ? 'bg-white/20 text-white'
                          : 'bg-ocean-50 text-ocean-700'
                        : linkColor
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* CTA + Mobile toggle */}
            <div className="flex items-center gap-3">
              <Link
                to="/contact"
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 bg-coral-500 hover:bg-coral-600 text-white"
              >
                Nous contacter
              </Link>
              <button
                onClick={() => setMobileOpen((o) => !o)}
                className={`lg:hidden p-2 rounded-lg transition-colors ${
                  isHome && !scrolled ? 'text-white hover:bg-white/10' : 'text-gray-700 hover:bg-gray-100'
                }`}
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
          mobileOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-ocean-900/60 backdrop-blur-sm transition-opacity duration-300 ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMobileOpen(false)}
        />
        {/* Drawer */}
        <div
          className={`absolute top-0 right-0 h-full w-72 bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <Link to="/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Interpêche CI" className="h-9 w-auto object-contain" />
            </Link>
            <button onClick={() => setMobileOpen(false)} className="p-1 rounded-lg text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {links.map((link) =>
              link.children ? (
                <div key={link.label}>
                  <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-3">
                    {link.label}
                  </div>
                  {link.children.map((child) => (
                    <Link
                      key={child.to}
                      to={child.to}
                      className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive(child.to)
                          ? 'bg-ocean-50 text-ocean-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-ocean-600'
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? 'bg-ocean-50 text-ocean-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-ocean-600'
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>
          <div className="p-4 border-t border-gray-100">
            <Link to="/contact" className="btn-secondary w-full justify-center">
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
