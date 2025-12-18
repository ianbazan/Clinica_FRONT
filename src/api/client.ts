// Force backend URL for all environments (bypass Vite proxy)
export const API_BASE = 'https://msif-app-284932020200.us-central1.run.app'

type FetchOptions = RequestInit & { query?: Record<string, string | number | boolean> }

function buildUrl(path: string, query?: Record<string, string | number | boolean>) {
  const u = new URL(path, API_BASE)
  if (query) {
    Object.entries(query).forEach(([k, v]) => u.searchParams.set(k, String(v)))
  }
  return u.toString()
}

export async function apiFetch<T = any>(path: string, opts: FetchOptions = {}): Promise<T> {
  const { query, ...rest } = opts
  const url = buildUrl(path, query)

  // Add Authorization header from localStorage if present
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...rest.headers as Record<string, string>,
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(url, {
    mode: 'cors',
    credentials: 'include',
    headers,
    ...rest,
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`API ${res.status} ${res.statusText}: ${text}`)
  }

  // try parse JSON, fallback to empty
  const txt = await res.text()
  try {
    return txt ? JSON.parse(txt) : (null as any)
  } catch (e) {
    return (txt as any) as T
  }
}

export default apiFetch
