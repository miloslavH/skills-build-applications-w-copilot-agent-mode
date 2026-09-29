const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim()

export const API_BASE_URL = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000'

export async function requestApi(path, { signal } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, { signal })

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

export async function fetchCollection(resource, { signal } = {}) {
  const payload = await requestApi(`/api/${resource}/`, { signal })
  return normalizeCollection(payload)
}