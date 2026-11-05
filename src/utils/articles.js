import { articles as articlesApi, config as configApi } from '../services/api'
import fallbackNews from '../data/news.json'

const MONTHS_FR = ['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre']

export function formatDateFR(iso) {
  if (!iso) return ''
  const [y, m, d] = String(iso).split('T')[0].split('-')
  return `${parseInt(d, 10)} ${MONTHS_FR[parseInt(m, 10) - 1]} ${y}`
}

/** Ligne API → forme utilisée par l'UI. */
export function mapArticle(a) {
  return {
    ...a,
    image: a.image_url,
    auteur: a.auteur_nom,
    date: formatDateFR(a.date_publication),
    carousel: Boolean(a.carousel),
  }
}

/** Tous les articles publiés (API, sinon news.json). */
export async function fetchAllArticles(limit = 100) {
  try {
    const rows = await articlesApi.list({ limit })
    if (Array.isArray(rows) && rows.length) return rows.map(mapArticle)
  } catch { /* repli */ }
  return fallbackNews.actualites.map((a) => ({ ...a }))
}

/* ─── Configuration du carrousel d'accueil ─── */
export const DEFAULT_CAROUSEL = {
  mode: 'latest',   // 'latest' = N derniers | 'manual' = sélection ordonnée
  count: 5,         // 3..8 (mode latest)
  ids: [],          // ids ordonnés (mode manual)
  autoplay: true,
  interval: 6,      // secondes
  showRail: true,   // liste « À suivre » (desktop)
}
const LS_KEY = 'homeCarouselConfig'

const sane = (c) => ({
  ...DEFAULT_CAROUSEL,
  ...c,
  count: Math.min(Math.max(parseInt(c.count, 10) || 5, 3), 8),
  interval: Math.min(Math.max(parseInt(c.interval, 10) || 6, 3), 20),
  ids: Array.isArray(c.ids) ? c.ids.slice(0, 8) : [],
  mode: c.mode === 'manual' ? 'manual' : 'latest',
})

export async function loadCarouselConfig() {
  try {
    const c = await configApi.get('home_carousel')
    if (c && typeof c === 'object' && !Array.isArray(c) && c.mode) return sane(c)
  } catch { /* repli */ }
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return sane(JSON.parse(raw))
  } catch { /* repli */ }
  return { ...DEFAULT_CAROUSEL }
}

/** Sauvegarde locale + serveur. Retourne { server: boolean }. */
export async function saveCarouselConfig(cfg) {
  const clean = sane(cfg)
  try { localStorage.setItem(LS_KEY, JSON.stringify(clean)) } catch { /* ignore */ }
  try {
    await configApi.update('home_carousel', clean)
    return { server: true }
  } catch {
    return { server: false }
  }
}

/** Articles du carrousel selon la config. */
export function pickCarousel(all, cfg) {
  if (cfg.mode === 'manual') {
    const byId = new Map(all.map((a) => [String(a.id), a]))
    const picked = cfg.ids.map((id) => byId.get(String(id))).filter(Boolean)
    if (picked.length) return picked
  }
  return all.slice(0, cfg.count)
}
