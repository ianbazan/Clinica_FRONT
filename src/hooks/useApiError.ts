export function formatApiError(err: any): string {
  if (!err) return 'Error de red o del servidor.'
  const msg = err.message || String(err)
  // Try to parse JSON body after colon
  const colon = msg.indexOf(':')
  if (colon !== -1) {
    const body = msg.slice(colon + 1).trim()
    try {
      const parsed = JSON.parse(body)
      if (parsed?.error?.detail) return String(parsed.error.detail)
      if (parsed?.detail) return String(parsed.detail)
      if (parsed?.message) return String(parsed.message)
    } catch (_) {
      // not JSON
    }
  }
  // fallback: remove technical prefix
  return msg.replace(/^API\s*\d+\s*[^:]*:\s*/i, '') || 'Error de red o del servidor.'
}

export default function useApiError() {
  return { format: formatApiError }
}
