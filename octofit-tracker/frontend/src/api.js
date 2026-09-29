const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

export const API_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

export async function requestApi(path, { signal } = {}) {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`
  const response = await fetch(url, { signal })

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`)
  }

  return response.json()
}

export function normalizeCollection(payload) {
  if (Array.isArray(payload)) return payload
  if (!payload || typeof payload !== 'object') return []

  for (const key of ['results', 'items', 'data', 'records']) {
    const value = payload[key]
    if (Array.isArray(value)) return value
    if (value && typeof value === 'object') {
      const nestedItems = normalizeCollection(value)
      if (nestedItems.length > 0) return nestedItems
    }
  }

  return []
}

export async function fetchCollection(endpoint, { signal } = {}) {
  const payload = await requestApi(endpoint, { signal })
  return normalizeCollection(payload)
}