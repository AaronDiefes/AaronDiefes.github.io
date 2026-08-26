import { useEffect, useState } from 'react'
import { loadEngine, loadTexture } from '../lib/graphics/engine.js'
import { allTextures } from '../lib/graphics/scenes/index.js'

/**
 * Loads the WASM engine once and preloads every texture the demos need.
 *
 * loadEngine() is memoised at module scope, so StrictMode's double-invoked effect
 * and any number of remounts still share one engine instance.
 */
export function useGraphicsEngine() {
  const [state, setState] = useState({ module: null, error: null, loading: true })

  useEffect(() => {
    let alive = true
    loadEngine()
      .then(async (module) => {
        for (const t of allTextures()) await loadTexture(module, t.vfsPath, t.url)
        if (alive) setState({ module, error: null, loading: false })
      })
      .catch((error) => {
        if (alive) setState({ module: null, error, loading: false })
      })
    return () => { alive = false }
  }, [])

  return state
}
