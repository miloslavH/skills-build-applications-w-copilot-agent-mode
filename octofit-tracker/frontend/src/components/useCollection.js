import { useEffect, useState } from 'react'
import { fetchCollection } from '../api.js'

export function useCollection(resource) {
  const [state, setState] = useState({ items: [], loading: true, error: '' })

  useEffect(() => {
    const controller = new AbortController()

    fetchCollection(resource, { signal: controller.signal })
      .then((items) => setState({ items, loading: false, error: '' }))
      .catch((error) => {
        if (error.name !== 'AbortError') {
          setState({ items: [], loading: false, error: error.message })
        }
      })

    return () => controller.abort()
  }, [resource])

  return state
}