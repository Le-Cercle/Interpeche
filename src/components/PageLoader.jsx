export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-ocean-900 to-ocean-700">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-ocean-400/30" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-ocean-400 animate-spin" />
        </div>
        <p className="text-ocean-200 text-sm font-medium">Chargement...</p>
      </div>
    </div>
  )
}
