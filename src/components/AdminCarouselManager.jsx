import { useState, useEffect, useMemo } from 'react'
import { Save, ArrowUp, ArrowDown, X, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'
import {
  DEFAULT_CAROUSEL, fetchAllArticles, loadCarouselConfig, saveCarouselConfig, pickCarousel,
} from '../utils/articles'

const MAX_MANUAL = 8

export default function AdminCarouselManager() {
  const [cfg, setCfg] = useState(DEFAULT_CAROUSEL)
  const [all, setAll] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState(null) // { type: 'ok'|'local'|'error', msg }
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let off = false
    Promise.all([loadCarouselConfig(), fetchAllArticles(100)]).then(([c, a]) => {
      if (off) return
      setCfg(c); setAll(a); setLoading(false)
    })
    return () => { off = true }
  }, [])

  const byId = useMemo(() => new Map(all.map((a) => [String(a.id), a])), [all])
  const preview = useMemo(() => pickCarousel(all, cfg), [all, cfg])
  const set = (patch) => { setStatus(null); setCfg((c) => ({ ...c, ...patch })) }

  const toggle = (id) => {
    const sid = String(id)
    const has = cfg.ids.map(String).includes(sid)
    if (!has && cfg.ids.length >= MAX_MANUAL) return
    set({ ids: has ? cfg.ids.filter((x) => String(x) !== sid) : [...cfg.ids, id] })
  }
  const move = (i, d) => {
    const j = i + d
    if (j < 0 || j >= cfg.ids.length) return
    const ids = [...cfg.ids];
    [ids[i], ids[j]] = [ids[j], ids[i]]
    set({ ids })
  }

  const save = async () => {
    setSaving(true)
    const { server } = await saveCarouselConfig(cfg)
    setSaving(false)
    setStatus(server
      ? { type: 'ok', msg: 'Carrousel enregistré. Les visiteurs voient la nouvelle configuration.' }
      : { type: 'local', msg: "Serveur injoignable ou session expirée : enregistré dans ce navigateur uniquement. Reconnectez-vous puis réessayez pour publier." })
  }

  if (loading) return <p className="text-gray-500">Chargement…</p>

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Carrousel de la page d'accueil</h2>
        <p className="text-gray-500 text-sm mt-1">Premier écran du site : choisissez quelles actualités sont mises à la une et comment elles défilent.</p>
      </div>

      {/* Source */}
      <section className="bg-white rounded-xl shadow p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Source des actualités</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { v: 'latest', t: 'Les plus récentes', d: 'Automatique : les N derniers articles publiés.' },
            { v: 'manual', t: 'Sélection manuelle', d: "Vous choisissez les articles et leur ordre." },
          ].map((o) => (
            <label key={o.v} className={`cursor-pointer rounded-xl border-2 p-4 transition-colors ${cfg.mode === o.v ? 'border-ocean-500 bg-ocean-50' : 'border-gray-200 hover:border-gray-300'}`}>
              <input type="radio" name="mode" className="sr-only" checked={cfg.mode === o.v} onChange={() => set({ mode: o.v })} />
              <span className="block font-semibold text-gray-900">{o.t}</span>
              <span className="block text-sm text-gray-500 mt-0.5">{o.d}</span>
            </label>
          ))}
        </div>

        {cfg.mode === 'latest' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre d'actualités : <strong>{cfg.count}</strong></label>
            <input type="range" min="3" max="8" value={cfg.count} onChange={(e) => set({ count: +e.target.value })} className="w-full max-w-sm accent-ocean-600" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Ordre d'affichage ({cfg.ids.length}/{MAX_MANUAL})</p>
              {cfg.ids.length === 0 && <p className="text-sm text-gray-400 border border-dashed rounded-lg p-4">Cochez des articles dans la liste pour les ajouter. Sans sélection, les plus récentes sont utilisées.</p>}
              <ol className="space-y-2">
                {cfg.ids.map((id, i) => {
                  const a = byId.get(String(id))
                  return (
                    <li key={id} className="flex items-center gap-2 bg-ocean-50 border border-ocean-100 rounded-lg px-3 py-2">
                      <span className="w-6 h-6 rounded-full bg-ocean-600 text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                      <span className="flex-1 text-sm text-gray-800 line-clamp-1">{a ? a.titre : `Article #${id} (introuvable)`}</span>
                      <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Monter" className="p-1 rounded hover:bg-white disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                      <button onClick={() => move(i, 1)} disabled={i === cfg.ids.length - 1} aria-label="Descendre" className="p-1 rounded hover:bg-white disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                      <button onClick={() => toggle(id)} aria-label="Retirer" className="p-1 rounded hover:bg-white text-red-500"><X className="w-4 h-4" /></button>
                    </li>
                  )
                })}
              </ol>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Articles disponibles</p>
              <ul className="max-h-80 overflow-y-auto border border-gray-200 rounded-lg divide-y">
                {all.map((a) => {
                  const on = cfg.ids.map(String).includes(String(a.id))
                  const full = !on && cfg.ids.length >= MAX_MANUAL
                  return (
                    <li key={a.id}>
                      <label className={`flex items-start gap-3 px-3 py-2.5 text-sm ${full ? 'opacity-40' : 'cursor-pointer hover:bg-gray-50'}`}>
                        <input type="checkbox" checked={on} disabled={full} onChange={() => toggle(a.id)} className="mt-1 accent-ocean-600" />
                        <span><span className="block text-gray-900 line-clamp-2">{a.titre}</span><span className="text-xs text-gray-400">{a.date} · {a.categorie}</span></span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        )}
      </section>

      {/* Défilement */}
      <section className="bg-white rounded-xl shadow p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Défilement & affichage</h3>
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={cfg.autoplay} onChange={(e) => set({ autoplay: e.target.checked })} className="w-4 h-4 accent-ocean-600" />
          <span className="text-sm text-gray-800">Défilement automatique</span>
        </label>
        <div className={cfg.autoplay ? '' : 'opacity-40 pointer-events-none'}>
          <label className="block text-sm font-medium text-gray-700 mb-2">Durée par actualité : <strong>{cfg.interval} s</strong></label>
          <input type="range" min="3" max="15" value={cfg.interval} onChange={(e) => set({ interval: +e.target.value })} className="w-full max-w-sm accent-ocean-600" />
        </div>
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={cfg.showRail} onChange={(e) => set({ showRail: e.target.checked })} className="w-4 h-4 accent-ocean-600" />
          <span className="text-sm text-gray-800">Afficher la liste « à suivre » à droite (ordinateur)</span>
        </label>
      </section>

      {/* Aperçu */}
      <section className="bg-white rounded-xl shadow p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Aperçu — {preview.length} actualité{preview.length > 1 ? 's' : ''}</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {preview.map((a, i) => (
            <figure key={a.id} className="relative shrink-0 w-44 h-28 rounded-lg overflow-hidden bg-ocean-900">
              <img src={a.image} alt="" className="w-full h-full object-cover opacity-80" onError={(e) => { e.target.style.display = 'none' }} />
              <figcaption className="absolute inset-0 p-2 flex flex-col justify-end bg-gradient-to-t from-ocean-950/90 to-transparent">
                <span className="text-[10px] font-bold text-coral-400">{i + 1}</span>
                <span className="text-xs text-white font-semibold line-clamp-2">{a.titre}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-4">
        <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 bg-ocean-600 hover:bg-ocean-700 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-xl transition-colors">
          <Save className="w-4 h-4" /> {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
        <a href="/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-sm text-ocean-700 hover:underline"><ExternalLink className="w-4 h-4" /> Voir le site</a>
        {status && (
          <p role="status" className={`flex items-center gap-2 text-sm ${status.type === 'ok' ? 'text-green-700' : 'text-amber-700'}`}>
            {status.type === 'ok' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}{status.msg}
          </p>
        )}
      </div>
    </div>
  )
}
