import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, Settings, FileText, Palette, Users, Mail, BarChart3, Menu, X, Image, Video, TrendingUp, Activity, Save, HardDrive, CheckCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import AdminNavbar from '../components/AdminNavbar'
import AdminThemeEditor from '../components/AdminThemeEditor'
import AdminContentEditor from '../components/AdminContentEditor'
import AdminHeaderFooter from '../components/AdminHeaderFooter'
import AdminGalleryManager from '../components/AdminGalleryManager'
import AdminVideoManager from '../components/AdminVideoManager'
import AdminAdvancedStats from '../components/AdminAdvancedStats'
import AdminBackupRestore from '../components/AdminBackupRestore'
import AdminNewsManager from '../components/AdminNewsManager'
import AdminMediaLibrary from '../components/AdminMediaLibrary'
import AdminBrandManager from '../components/AdminBrandManager'
import AdminCarouselManager from '../components/AdminCarouselManager'
import RichTextEditor from '../components/RichTextEditor'

const MODULES = [
  { id: 'brand', label: 'Marque', icon: Palette },
  { id: 'overview', label: 'Aperçu', icon: BarChart3 },
  { id: 'stats', label: 'Statistiques', icon: TrendingUp },
  { id: 'content', label: 'Contenu', icon: FileText },
  { id: 'news', label: 'Actualités', icon: FileText },
  { id: 'carousel', label: 'Carrousel accueil', icon: Image },
  { id: 'media', label: 'Médias', icon: Image },
  { id: 'wysiwyg', label: 'Éditeur WYSIWYG', icon: FileText },
  { id: 'gallery', label: 'Galerie', icon: Image },
  { id: 'videos', label: 'Vidéos', icon: Video },
  { id: 'theme', label: 'Thème & Couleurs', icon: Palette },
  { id: 'header-footer', label: 'Header & Footer', icon: Settings },
  { id: 'backup', label: 'Sauvegarde', icon: HardDrive },
  { id: 'logs', label: 'Logs', icon: Activity },
  { id: 'newsletter', label: 'Newsletter', icon: Mail },
  { id: 'users', label: 'Utilisateurs', icon: Users },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [activeModule, setActiveModule] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  if (!user) {
    navigate('/admin/login')
    return null
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-ocean-900 text-white transition-all duration-300 overflow-hidden flex flex-col relative z-30`}
      >
        <div className="p-6 border-b border-ocean-800">
          <h2 className="text-xl font-bold">Admin Panel</h2>
          <p className="text-ocean-200 text-sm mt-1">Bienvenue, {user.username}</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {MODULES.map((module) => {
            const Icon = module.icon
            return (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeModule === module.id
                    ? 'bg-ocean-600 text-white'
                    : 'text-ocean-200 hover:bg-ocean-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{module.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-ocean-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {MODULES.find((m) => m.id === activeModule)?.label}
          </h1>
          <div className="w-10 h-10 rounded-full bg-ocean-600 text-white flex items-center justify-center font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          {activeModule === 'brand' && <AdminBrandManager />}
          {activeModule === 'overview' && <AdminOverview />}
          {activeModule === 'stats' && <AdminAdvancedStats />}
          {activeModule === 'content' && <AdminContentEditor />}
          {activeModule === 'news' && <AdminNewsManager />}
          {activeModule === 'carousel' && <AdminCarouselManager />}
          {activeModule === 'media' && <AdminMediaLibrary />}
          {activeModule === 'wysiwyg' && <AdminWYSIWYG />}
          {activeModule === 'gallery' && <AdminGalleryManager />}
          {activeModule === 'videos' && <AdminVideoManager />}
          {activeModule === 'theme' && <AdminThemeEditor />}
          {activeModule === 'header-footer' && <AdminHeaderFooter />}
          {activeModule === 'backup' && <AdminBackupRestore />}
          {activeModule === 'logs' && <AdminLogs />}
          {activeModule === 'newsletter' && <AdminNewsletter />}
          {activeModule === 'users' && <AdminUsers />}
        </div>
      </div>
    </div>
  )
}

function AdminOverview() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Pages',        value: '8',    icon: FileText,  color: 'bg-blue-500'   },
          { label: 'Articles',     value: '24',   icon: BarChart3, color: 'bg-green-500'  },
          { label: 'Utilisateurs', value: '1',    icon: Users,     color: 'bg-purple-500' },
          { label: 'Visites',      value: '1.2K', icon: Activity,  color: 'bg-orange-500' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-lg p-6 shadow">
              <div className={`w-12 h-12 ${stat.color} rounded-lg mb-4 flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          )
        })}
      </div>

      <div className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Bienvenue dans le panel d'administration</h2>
        <p className="text-gray-600 mb-4">
          Utilisez le menu de gauche pour accéder aux différents modules de gestion du site.
        </p>
        <ul className="space-y-2 text-gray-600 text-sm">
          {['Gérez le contenu de toutes les pages', 'Personnalisez les couleurs et le thème', 'Modifiez le header et footer', 'Gérez les abonnés à la newsletter', 'Consultez les statistiques du site'].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function AdminWYSIWYG() {
  const [content, setContent] = useState('')

  return (
    <div className="bg-white rounded-lg p-6 shadow">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Éditeur WYSIWYG</h2>
      <RichTextEditor value={content} onChange={setContent} />
      <div className="mt-4 flex gap-3">
        <button className="flex items-center gap-2 bg-ocean-600 hover:bg-ocean-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
          <Save className="w-4 h-4" />
          Enregistrer
        </button>
        <button className="px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
          Aperçu
        </button>
      </div>
    </div>
  )
}

function AdminLogs() {
  const [logs] = useState([
    { id: 1, action: 'Connexion', user: 'admin', timestamp: '2024-04-17 17:05:00', status: 'success' },
    { id: 2, action: 'Modification thème', user: 'admin', timestamp: '2024-04-17 16:45:30', status: 'success' },
    { id: 3, action: 'Ajout image', user: 'admin', timestamp: '2024-04-17 16:30:15', status: 'success' },
    { id: 4, action: 'Modification contenu', user: 'admin', timestamp: '2024-04-17 16:15:45', status: 'success' },
    { id: 5, action: 'Suppression vidéo', user: 'admin', timestamp: '2024-04-17 15:50:20', status: 'success' },
  ])

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Logs d'Activité</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Action</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Utilisateur</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Date & Heure</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Statut</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900 font-medium">{log.action}</td>
                <td className="py-3 px-4 text-gray-600">{log.user}</td>
                <td className="py-3 px-4 text-gray-600">{log.timestamp}</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AdminNewsletter() {
  const [subscribers] = useState([
    { id: 1, email: 'user1@example.com', subscribed: '2024-04-10', status: 'active' },
    { id: 2, email: 'user2@example.com', subscribed: '2024-04-12', status: 'active' },
    { id: 3, email: 'user3@example.com', subscribed: '2024-04-15', status: 'active' },
  ])

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Gestion Newsletter</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-gray-600 text-sm">Abonnés totaux</p>
            <p className="text-3xl font-bold text-blue-600">{subscribers.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-gray-600 text-sm">Actifs</p>
            <p className="text-3xl font-bold text-green-600">{subscribers.filter(s => s.status === 'active').length}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4">
            <p className="text-gray-600 text-sm">Taux d'engagement</p>
            <p className="text-3xl font-bold text-orange-600">68%</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Abonnés</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date d'abonnement</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Statut</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-900">{sub.email}</td>
                  <td className="py-3 px-4 text-gray-600">{sub.subscribed}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      {sub.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function AdminUsers() {
  const [users] = useState([
    { id: 1, username: 'admin', email: 'admin@example.com', role: 'Administrateur', lastLogin: '2024-04-17 17:05:00' },
  ])

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Gestion Utilisateurs</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Utilisateur</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Rôle</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-700">Dernière connexion</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-900 font-medium">{user.username}</td>
                <td className="py-3 px-4 text-gray-600">{user.email}</td>
                <td className="py-3 px-4 text-gray-600">{user.role}</td>
                <td className="py-3 px-4 text-gray-600">{user.lastLogin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
