import { useSyncExternalStore } from 'react'
import { getTheme, subscribe, toggleTheme } from '../lib/theme'

/**
 * Read the effective theme, and re-render when it changes.
 *
 * useSyncExternalStore rather than useState + useEffect because the source of
 * truth lives outside React (localStorage plus a matchMedia list). An effect
 * runs after paint, so the first frame would render with the wrong value; and
 * under concurrent rendering two components reading the same external source
 * can tear - render with different values in one pass. This is the API React
 * added for exactly that situation.
 *
 * `subscribe` and `getTheme` are module-scope constants in lib/theme.js. Passing
 * inline functions here would resubscribe on every render.
 *
 * No getServerSnapshot argument: this is a static SPA with no SSR, so passing
 * one would be dead code.
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getTheme)
  return { theme, toggleTheme }
}

export default useTheme
