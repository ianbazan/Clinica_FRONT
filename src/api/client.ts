const DEFAULT_API = '/api' // Use proxy in development

export const API_BASE = (import.meta as any).env?.VITE_API_URL ?? DEFAULT_API

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

  const res = await fetch(url, {
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...rest.headers,
    },
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
