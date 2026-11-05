/** État vide / chargement commun aux grilles (galerie, vidéos…). */
export function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="flex flex-col items-center text-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-ocean-50 flex items-center justify-center mb-5">
        <Icon className="w-8 h-8 text-ocean-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-gray-500 text-sm max-w-sm mb-6">{text}</p>
      {action}
    </div>
  )
}

export function SkeletonGrid({ n = 8, cols = 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4', h = 'h-48' }) {
  return (
    <div className={`grid ${cols} gap-4`} aria-busy="true" aria-label="Chargement">
      {Array.from({ length: n }).map((_, i) => <div key={i} className={`skeleton ${h} rounded-xl`} />)}
    </div>
  )
}
