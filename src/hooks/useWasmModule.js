import { useState, useEffect } from 'react'

/**
 * Custom hook to load and manage the WebAssembly graphics module
 * Matches the original wasm-graphics-demo.html loading pattern
 */
export function useWasmModule() {
  const [module, setModule] = useState(null)
  const [canvas, setCanvas] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true
    let scriptElement = null

    async function loadWasm() {
      try {
        // Check if script already loaded
        if (window.GraphicsEngine) {
          initializeModule()
          return
        }

        // Load the Emscripten-generated JS file
        scriptElement = document.createElement('script')
        scriptElement.src = '/graphics_engine.js'
        scriptElement.async = true

        scriptElement.onload = () => {
          if (mounted && window.GraphicsEngine) {
            initializeModule()
          }
        }

        scriptElement.onerror = () => {
          if (mounted) {
            setError('Failed to load graphics_engine.js')
            setLoading(false)
          }
        }

        document.body.appendChild(scriptElement)
      } catch (err) {
        if (mounted) {
          setError(err.message)
          setLoading(false)
        }
      }
    }

    function initializeModule() {
      // Call GraphicsEngine() which returns a promise
      window.GraphicsEngine().then((mod) => {
        if (mounted) {
          setModule(mod)
          setLoading(false)
        }
      }).catch((err) => {
        if (mounted) {
          setError('Failed to initialize WASM module: ' + err.message)
          setLoading(false)
        }
      })
    }

    loadWasm()

    return () => {
      mounted = false
      if (scriptElement && scriptElement.parentNode) {
        // Don't remove script - keep it for other components
      }
    }
  }, [])

  const createCanvas = (width, height) => {
    if (!module || canvas) return canvas

    const newCanvas = new module.CanvasWrapper(width, height)
    setCanvas(newCanvas)
    return newCanvas
  }

  const deleteCanvas = () => {
    if (canvas) {
      canvas.delete()
      setCanvas(null)
    }
  }

  return {
    module,
    canvas,
    loading,
    error,
    createCanvas,
    deleteCanvas
  }
}
