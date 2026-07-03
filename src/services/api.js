const BASE = import.meta.env.VITE_API_URL ?? '/api'

// Clé localStorage pour le token d'authentification
const TOKEN_KEY = 'interpeche_auth_token'

export function getToken()         { return localStorage.getItem(TOKEN_KEY) }
export function setToken(t)        { localStorage.setItem(TOKEN_KEY, t) }
export function clearToken()       { localStorage.removeItem(TOKEN_KEY) }

// ── Client HTTP de base ────────────────────────────────────
async function request(path, options = {}) {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  })

  if (res.status === 204) return null

  const body = await res.json().catch(() => ({ error: res.statusText }))

  if (!res.ok) {
    const err = new Error(body?.error ?? `Erreur ${res.status}`)
    err.status = res.status
    err.body   = body
    throw err
  }
  return body
}

const get    = (path)        => request(path)
const post   = (path, data)  => request(path, { method: 'POST',   body: JSON.stringify(data) })
const put    = (path, data)  => request(path, { method: 'PUT',    body: JSON.stringify(data) })
const del    = (path)        => request(path, { method: 'DELETE' })

// ── Auth ───────────────────────────────────────────────────
export const auth = {
  login:  (username, password) => post('/auth.php', { username, password }),
  logout: ()                   => del('/auth.php'),
  me:     ()                   => get('/auth.php'),
}

// ── Articles ───────────────────────────────────────────────
export const articles = {
  list:   (params = {}) => get('/articles.php?' + new URLSearchParams(params)),
  get:    (id)          => get(`/articles.php?id=${id}`),
  bySlug: (slug)        => get(`/articles.php?slug=${encodeURIComponent(slug)}`),
  create: (data)        => post('/articles.php', data),
  update: (id, data)    => put(`/articles.php?id=${id}`, data),
  delete: (id)          => del(`/articles.php?id=${id}`),
  // Helpers fréquents
  carousel:   ()        => get('/articles.php?carousel=1&limit=6'),
  recent:     (n = 6)   => get(`/articles.php?limit=${n}`),
  search:     (q)       => get(`/articles.php?search=${encodeURIComponent(q)}`),
  byCategory: (cat)     => get(`/articles.php?category=${encodeURIComponent(cat)}`),
}

// ── Galerie ────────────────────────────────────────────────
export const gallery = {
  list:   (params = {}) => get('/gallery.php?' + new URLSearchParams(params)),
  create: (data)        => post('/gallery.php', data),
  update: (id, data)    => put(`/gallery.php?id=${id}`, data),
  delete: (id)          => del(`/gallery.php?id=${id}`),
}

// ── Vidéos ─────────────────────────────────────────────────
export const videos = {
  list:   (params = {}) => get('/videos.php?' + new URLSearchParams(params)),
  create: (data)        => post('/videos.php', data),
  update: (id, data)    => put(`/videos.php?id=${id}`, data),
  delete: (id)          => del(`/videos.php?id=${id}`),
}

// ── Configuration du site ──────────────────────────────────
export const config = {
  getAll:  ()           => get('/site-config.php'),
  get:     (key)        => get(`/site-config.php?key=${key}`),
  update:  (key, data)  => put(`/site-config.php?key=${key}`, data),
}

// ── Blocs de contenu par page ──────────────────────────────
export const pageBlocks = {
  get:    (page)        => get(`/page-blocks.php?page=${page}`),
  update: (id, data)    => put(`/page-blocks.php?id=${id}`, data),
}

// ── SEO ────────────────────────────────────────────────────
export const seo = {
  getAll:  ()           => get('/seo.php'),
  get:     (key)        => get(`/seo.php?key=${key}`),
  update:  (key, data)  => put(`/seo.php?key=${key}`, data),
}

// ── Contact ────────────────────────────────────────────────
export const contact = {
  send:       (data)        => post('/contact.php', data),
  list:       (status)      => get(`/contact.php${status ? '?status=' + status : ''}`),
  setStatus:  (id, status)  => put(`/contact.php?id=${id}`, { status }),
}

// ── Newsletter ─────────────────────────────────────────────
export const newsletter = {
  subscribe:   (email, source = 'homepage') => post('/newsletter.php', { email, source }),
  unsubscribe: (token)                      => del(`/newsletter.php?token=${token}`),
  list:        (status = 'active')          => get(`/newsletter.php?status=${status}`),
}

// ── Export groupé (compatible avec l'usage existant) ───────
const api = { auth, articles, gallery, videos, config, pageBlocks, seo, contact, newsletter }
export default api
