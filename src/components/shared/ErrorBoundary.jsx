import React from 'react'

/**
 * Catches render errors in the route subtree so one broken page shows a
 * recovery panel instead of unmounting the whole app to a blank white screen.
 *
 * This is a class component, and it has to be: error boundaries are the one
 * remaining React feature with no hook equivalent. `getDerivedStateFromError`
 * and `componentDidCatch` are lifecycle methods with no `use*` counterpart, so
 * even a codebase that is otherwise entirely function components needs exactly
 * one class. (React's own docs say the same.)
 *
 * Two deliberate choices worth keeping:
 *
 *  1. The fallback UI imports nothing. No <Navigation>, no <Link>, no content
 *     modules. If the thing that just threw was the navigation or the router
 *     itself, a fallback that renders them throws again from inside the
 *     boundary - and an error thrown while rendering a fallback is NOT caught,
 *     so it takes down the app anyway. The plain <a href="/"> is load-bearing:
 *     a full document load is the one recovery that works even when the client
 *     router is the broken part.
 *
 *  2. Reset happens via a `resetKey` prop, not by putting `key` on the boundary
 *     itself. Keying the boundary would remount the entire route subtree on
 *     EVERY navigation, not just after a failure - and it would also defeat the
 *     v7_startTransition behaviour that keeps the previous page on screen while
 *     the next lazy chunk loads.
 */
class ErrorBoundary extends React.Component {
  state = { error: null, resetKey: this.props.resetKey }

  static getDerivedStateFromError(error) {
    return { error }
  }

  static getDerivedStateFromProps(props, state) {
    // Clear a captured error once the visitor navigates somewhere else, so a
    // single bad page does not leave the app stuck on the fallback.
    if (props.resetKey !== state.resetKey) {
      return { error: null, resetKey: props.resetKey }
    }
    return null
  }

  componentDidCatch(error, info) {
    // Static host, no error-reporting backend, so the console is the only sink
    // available. Without this the boundary swallows the stack entirely and the
    // failure becomes unreproducible.
    console.error('Route render failed:', error, info?.componentStack)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="route-error" role="alert">
        <div className="route-error-inner">
          <p className="route-error-eyebrow">Something went wrong</p>
          <h1 className="route-error-title">This page failed to load.</h1>
          <p className="route-error-body">
            The rest of the site is unaffected. Reloading usually clears it.
          </p>
          <div className="route-error-actions">
            {/* Full document load, not a router navigation - see note 1 above. */}
            <a className="route-error-button" href="/">
              Return home
            </a>
            <button
              type="button"
              className="route-error-button route-error-button-quiet"
              onClick={() => window.location.reload()}
            >
              Reload the page
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default ErrorBoundary
