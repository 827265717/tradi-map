const BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

function authHeaders() {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function apiFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...options.headers,
    },
  })
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`)
  if (res.status === 204) return null
  return res.json()
}

// 认证
export const register = (email, password) =>
  apiFetch('/register', { method: 'POST', body: JSON.stringify({ email, password }) })

export const login = (email, password) =>
  apiFetch('/login', { method: 'POST', body: JSON.stringify({ email, password }) })

// 收藏
export const getFavorites = () => apiFetch('/favorites')

export const addFavorite = (entryId) =>
  apiFetch('/favorites', { method: 'POST', body: JSON.stringify({ entry_id: entryId }) })

export const removeFavorite = (entryId) =>
  apiFetch(`/favorites/${encodeURIComponent(entryId)}`, { method: 'DELETE' })

// 浏览统计（EvidencePanel 打开时调用）
export const recordView = (entryId) =>
  apiFetch(`/entries/${encodeURIComponent(entryId)}/view`, { method: 'POST' })

export const getStats = (entryId) =>
  apiFetch(`/entries/${encodeURIComponent(entryId)}/stats`)
