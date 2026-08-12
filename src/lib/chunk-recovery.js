/**
 * Recovery for stale lazy-route chunks after a deploy.
 *
 * THE FAILURE THIS FIXES
 *
 * Code splitting means the browser fetches route chunks by hashed filename
 * (`/assets/CpuAluPage-a1b2c3.js`). Those hashes change on every deploy. So a
 * visitor who loaded the site before a deploy is holding an index.html that
 * references filenames which no longer exist, and the moment they navigate to
 * a lazy route the fetch 404s.
 *
 * On GitHub Pages that 404 is especially nasty. The 404 is served as
 * `public/404.html` with a 200-ish body - so the browser does not get a clean
 * network error, it gets a *successful* response whose body is HTML. Parsing
 * HTML as an ES module throws a SyntaxError, and React.lazy has no retry: the
 * route simply fails forever until the visitor manually reloads.
 *
 * A reload fixes it completely, because index.html is served no-cache and the
 * fresh copy references the new hashes.
 *
 * THE GUARD
 *
 * Reloading in response to a failed load is obviously a loop risk: if the
 * reload does not fix the problem, we would reload forever. So a reload is
 * allowed at most once per RETRY_WINDOW_MS. A genuine stale-chunk case is
 * fixed by the first reload; anything still failing after that is a real bug
 * and is allowed to surface to the ErrorBoundary instead of being papered over.
 *
 * A timestamp is used rather than a "have we tried yet" flag on purpose - a
 * boolean needs clearing on success, and every place you might clear it is
 * either too early (reload loop) or unreachable (the load failed). A timestamp
 * expires on its own and needs no reset path.
 *
 * This is inert during development: Vite only routes dynamic imports through
 * the preload helper that emits `vite:preloadError` in a production build.
 */

const RETRY_KEY = 'ad-chunk-retry'
const RETRY_WINDOW_MS = 15000

/** Storage can throw (Safari private mode, blocked cookies). */
function readLastRetry() {
  try {
    return Number(window.sessionStorage.getItem(RETRY_KEY)) || 0
  } catch {
    return null // signals "cannot track" - see installChunkRecovery
  }
}

function writeLastRetry(at) {
  try {
    window.sessionStorage.setItem(RETRY_KEY, String(at))
    return true
  } catch {
    return false
  }
}

export function installChunkRecovery() {
  window.addEventListener('vite:preloadError', (event) => {
    const lastRetry = readLastRetry()

    // No usable storage means no loop protection, and an unguarded reload loop
    // is far worse than a visible error. Let the ErrorBoundary handle it.
    if (lastRetry === null) return

    const now = Date.now()
    if (now - lastRetry < RETRY_WINDOW_MS) return

    if (!writeLastRetry(now)) return

    // Stops Vite rethrowing, so nothing else reacts to an error we are about to
    // resolve by throwing the whole document away.
    event.preventDefault()
    window.location.reload()
  })
}
