import React from 'react'

/**
 * Shown while a lazy route chunk is in flight.
 *
 * Deliberately almost invisible. Two reasons:
 *
 *  - On *navigation* this should never appear at all. BrowserRouter runs with
 *    `future={{ v7_startTransition: true }}`, so React keeps the previous page
 *    on screen while the next chunk loads rather than swapping to a fallback.
 *    This is only reached on a cold load of a lazy route - a deep link, or a
 *    refresh.
 *  - Even then, a chunk usually arrives in a few dozen milliseconds. A spinner
 *    that renders instantly would flash on and off and read as jank, so the CSS
 *    holds it at opacity 0 for 250ms first. Fast loads show nothing whatsoever;
 *    only a genuinely slow one ever becomes visible.
 *
 * The page chrome is not reproduced here. Each page renders its own
 * <Navigation>, so there is no shared shell to hold - and a fake nav that
 * shifted by a pixel when the real one arrived would be worse than empty space.
 */
function RouteFallback() {
  return (
    <div className="route-fallback" role="status" aria-live="polite">
      <span className="route-fallback-label">Loading…</span>
    </div>
  )
}

export default RouteFallback
