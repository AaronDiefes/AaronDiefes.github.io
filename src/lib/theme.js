/**
 * Theme store.
 *
 * Deliberately a plain module rather than React context: the state of record is
 * the `data-theme` attribute on <html>, and the only consumer is the toggle
 * button itself. A provider would re-render the whole tree to update one icon.
 *
 * Three viewer states are supported:
 *   - explicit dark  -> data-theme="dark"
 *   - explicit light -> data-theme="light"
 *   - no preference  -> NO attribute, so the prefers-color-scheme block in
 *                       theme.css decides
 *
 * The initial attribute is written by an inline script in index.html before
 * first paint, so there is no flash of the wrong theme. This module must agree
 * with that script - if you change the storage key, change it in both places.
 */

export const THEME_KEY = 'ad-theme'

const listeners = new Set()

const media = typeof window !== 'undefined'
  ? window.matchMedia('(prefers-color-scheme: dark)')
  : null

function readStored() {
  try {
    const v = localStorage.getItem(THEME_KEY)
    return v === 'light' || v === 'dark' ? v : null
  } catch {
    // Private mode or blocked storage: fall back to the system preference.
    return null
  }
}

/** The theme actually in effect right now: stored choice, else the system. */
export function getTheme() {
  if (typeof window === 'undefined') return 'light'
  return readStored() || (media && media.matches ? 'dark' : 'light')
}

/** True when the visitor has made an explicit choice. */
export function hasExplicitChoice() {
  return readStored() !== null
}

function notify() {
  listeners.forEach((fn) => fn())
}

/** Apply a theme and remember it. */
export function setTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    // Non-fatal: the attribute below still applies for this page view.
  }
  document.documentElement.setAttribute('data-theme', theme)
  notify()
}

/** Flip between light and dark, starting from whatever is currently effective. */
export function toggleTheme() {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark')
}

/**
 * Subscribe to theme changes. Module-scope and stable, as useSyncExternalStore
 * requires - an inline subscribe would resubscribe on every render.
 */
export function subscribe(callback) {
  listeners.add(callback)

  // Follow the OS only while the visitor has not chosen explicitly.
  const onSystemChange = () => {
    if (!hasExplicitChoice()) callback()
  }
  media?.addEventListener('change', onSystemChange)

  return () => {
    listeners.delete(callback)
    media?.removeEventListener('change', onSystemChange)
  }
}
