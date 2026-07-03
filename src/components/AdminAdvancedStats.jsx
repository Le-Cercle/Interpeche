import { useState, useMemo } from 'react'
import { TrendingUp, Users, FileText, Eye, Clock, Download } from 'lucide-react'

export default function AdminAdvancedStats() {
  const [timeRange, setTimeRange] = useState('month')

  // Mock data - À remplacer par des données réelles
  const mockData = useMemo(() => ({
    pageViews: [
      { date: '2024-04-01', views: 245, unique: 180 },
      { date: '2024-04-02', views: 312, unique: 220 },
      { date: '2024-04-03', views: 289, unique: 210 },
      { date: '2024-04-04', views: 401, unique: 290 },
      { date: '2024-04-05', views: 523, unique: 380 },
      { date: '2024-04-06', views: 612, unique: 450 },
      { date: '2024-04-07', views: 789, unique: 580 },
    ],
    topPages: [
      { path: '/', title: 'Accueil', views: 2450, avgTime: '2m 34s' },
      { path: '/qui-sommes-nous', title: 'Qui sommes-nous', views: 1820, avgTime: '1m 45s' },
      { path: '/activites', title: 'Activités', views: 1456, avgTime: '2m 12s' },
      { path: '/contact', title: 'Contact', views: 892, avgTime: '1m 23s' },
      { path: '/actualites', title: 'Actualités', views: 756, avgTime: '3m 01s' },
    ],
    deviceStats: [
      { device: 'Desktop', percentage: 65, count: 4550 },
      { device: 'Mobile', percentage: 28, count: 1960 },
      { device: 'Tablet', percentage: 7, count: 490 },
    ],
    trafficSources: [
      { source: 'Direct', percentage: 45, count: 3150 },
      { source: 'Organic', percentage: 35, count: 2450 },
      { source: 'Referral', percentage: 15, count: 1050 },
      { source: 'Social', percentage: 5, count: 350 },
    ],
    userBehavior: [
      { metric: 'Bounce Rate', value: '32.5%', trend: 'down', change: '-2.3%' },
      { metric: 'Avg Session Duration', value: '2m 18s', trend: 'up', change: '+0m 12s' },
      { metric: 'Pages per Session', value: '3.2', trend: 'up', change: '+0.4' },
      { metric: 'Conversion Rate', value: '4.8%', trend: 'up', change: '+1.2%' },
    ],
  }), [])

  const stats = [
    { label: 'Vues totales', value: '7,200', icon: Eye, color: 'bg-blue-500' },
    { label: 'Visiteurs uniques', value: '2,100', icon: Users, color: 'bg-green-500' },
    { label: 'Pages', value: '8', icon: FileText, color: 'bg-purple-500' },
    { label: 'Temps moyen', value: '2m 18s', icon: Clock, color: 'bg-orange-500' },
  ]

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex gap-2">
        {['week', 'month', 'year'].map(range => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              timeRange === range
                ? 'bg-ocean-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {range === 'week' ? 'Cette semaine' : range === 'month' ? 'Ce mois' : 'Cette année'}
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow p-6">
              <div className={`w-12 h-12 ${stat.color} rounded-lg mb-4 flex items-center justify-center`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Page Views Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Vues par jour</h2>
        <div className="space-y-4">
          {mockData.pageViews.map((day) => (
            <div key={day.date} className="flex items-center gap-4">
              <div className="w-24 text-sm text-gray-600">{day.date}</div>
              <div className="flex-1">
                <div className="flex gap-2 mb-1">
                  <div className="flex-1 bg-blue-100 rounded h-6 flex items-center justify-end pr-2">
                    <span className="text-xs font-semibold text-blue-700">{day.views}</span>
                  </div>
                </div>
                <div className="text-xs text-gray-500">{day.unique} visiteurs uniques</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Pages */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Pages les plus visitées</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Page</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Vues</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Temps moyen</th>
              </tr>
            </thead>
            <tbody>
              {mockData.topPages.map((page) => (
                <tr key={page.path} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{page.title}</p>
                      <p className="text-xs text-gray-500">{page.path}</p>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4 text-gray-900 font-semibold">{page.views.toLocaleString()}</td>
                  <td className="text-right py-3 px-4 text-gray-600">{page.avgTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Device & Traffic */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Devices */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Appareils</h2>
          <div className="space-y-4">
            {mockData.deviceStats.map((device) => (
              <div key={device.device}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{device.device}</span>
                  <span className="text-sm text-gray-600">{device.percentage}% ({device.count})</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-ocean-600 h-2 rounded-full"
                    style={{ width: `${device.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Sources de trafic</h2>
          <div className="space-y-4">
            {mockData.trafficSources.map((source) => (
              <div key={source.source}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{source.source}</span>
                  <span className="text-sm text-gray-600">{source.percentage}% ({source.count})</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User Behavior */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Comportement des utilisateurs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockData.userBehavior.map((behavior) => (
            <div key={behavior.metric} className="border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">{behavior.metric}</p>
              <p className="text-2xl font-bold text-gray-900 mb-2">{behavior.value}</p>
              <div className={`flex items-center gap-1 text-sm ${
                behavior.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className={`w-4 h-4 ${behavior.trend === 'down' ? 'rotate-180' : ''}`} />
                {behavior.change}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-ocean-600 hover:bg-ocean-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
          <Download className="w-4 h-4" />
          Exporter le rapport
        </button>
      </div>
    </div>
  )
}
