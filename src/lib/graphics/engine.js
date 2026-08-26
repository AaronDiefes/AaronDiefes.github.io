/**
 * Loads the C++ graphics engine (Emscripten/embind module) exactly once.
 *
 * Replaces the inline script-injection that lived in GraphicsWasmPage.jsx, which
 * appended a <script> to document.body on every mount and never removed it. Under
 * StrictMode's double-invoked effects that was a latent double-load; the module-level
 * promise here makes concurrent and repeat callers share one instance, so mounting
 * the page twice cannot start two engines.
 *
 * The glue is built with MODULARIZE + EXPORT_NAME="GraphicsEngine", so loading the
 * script defines a factory on window rather than instantiating anything itself.
 */

const SCRIPT_SRC = '/graphics_engine.js'

/** Shared by the texture loader and by callers embedding an inline binary. */
export function base64ToBytes(b64) {
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

let enginePromise = null

function injectScript() {
  return new Promise((resolve, reject) => {
    // A previous load may already have defined the factory - reuse it rather than
    // adding a second identical <script> to the document.
    if (typeof window.GraphicsEngine === 'function') {
      resolve(window.GraphicsEngine)
      return
    }

    const existing = document.querySelector(`script[src="${SCRIPT_SRC}"]`)
    if (existing) {
      existing.addEventListener('load', () => {
        if (typeof window.GraphicsEngine === 'function') resolve(window.GraphicsEngine)
        else reject(new Error('graphics_engine.js loaded but defined no GraphicsEngine factory'))
      })
      existing.addEventListener('error', () => reject(new Error(`failed to load ${SCRIPT_SRC}`)))
      return
    }

    const script = document.createElement('script')
    script.src = SCRIPT_SRC
    script.async = true
    script.onload = () => {
      if (typeof window.GraphicsEngine === 'function') resolve(window.GraphicsEngine)
      else reject(new Error('graphics_engine.js loaded but defined no GraphicsEngine factory'))
    }
    script.onerror = () => reject(new Error(`failed to load ${SCRIPT_SRC}`))
    document.head.appendChild(script)
  })
}

/**
 * Resolves to the instantiated engine module. Safe to call from many places and
 * many times; the work happens once.
 */
export function loadEngine() {
  if (!enginePromise) {
    enginePromise = injectScript()
      .then((factory) => factory())
      .catch((err) => {
        // Do not cache a failure - a transient network error should not permanently
        // poison the page.
        enginePromise = null
        throw err
      })
  }
  return enginePromise
}

/**
 * Copies an image into the engine's virtual filesystem so bitmap shaders can read
 * it by path. The engine decodes PNG itself (lodepng), so this hands over raw file
 * bytes, not decoded pixels.
 *
 * Fetch failures are the interesting case: a 404 returns an HTML error page with a
 * 200-shaped body, which the decoder then rejects and every bitmap shader silently
 * returns null. So the PNG signature is checked here rather than letting a bad
 * fetch surface later as an unexplained blank render.
 */
export async function loadTexture(module, vfsPath, source) {
  let bytes
  if (source instanceof Uint8Array) {
    bytes = source
  } else if (typeof source === 'string' && source.startsWith('data:')) {
    // Decoded inline rather than fetched: a strict CSP (the Artifact sandbox, for one)
    // can refuse `fetch` of a data: URI even though the bytes are already local.
    bytes = base64ToBytes(source.slice(source.indexOf(',') + 1))
  } else {
    const response = await fetch(source)
    if (!response.ok) {
      throw new Error(`texture ${source} failed to load (HTTP ${response.status})`)
    }
    bytes = new Uint8Array(await response.arrayBuffer())
  }

  const isPng =
    bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47
  if (!isPng) {
    throw new Error(
      `texture is not a PNG - got ${bytes.length} bytes starting ` +
      `${Array.from(bytes.slice(0, 4)).map((b) => b.toString(16)).join(' ')}. ` +
      'A 404 page served under a .png name looks exactly like this.'
    )
  }

  const ptr = module._malloc(bytes.length)
  try {
    module.HEAPU8.set(bytes, ptr)
    module.loadImageToVFS(vfsPath, ptr, bytes.length)
  } finally {
    module._free(ptr)
  }
  return vfsPath
}
