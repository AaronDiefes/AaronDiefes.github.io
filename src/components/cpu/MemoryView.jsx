import React, { useEffect, useRef } from 'react'

/**
 * MemoryView - React wrapper for vanilla JS MemoryView
 * Displays non-zero memory addresses in a table
 */
function MemoryView({ state }) {
  const containerRef = useRef(null)
  const viewRef = useRef(null)

  useEffect(() => {
    // Import and initialize vanilla JS MemoryView
    import('../../../archived/cpu-simulator/src/visualization/memory-view.js').then(() => {
      if (window.MemoryView && containerRef.current && !viewRef.current) {
        viewRef.current = new window.MemoryView(containerRef.current)
      }
    })
  }, [])

  useEffect(() => {
    // Render on state changes
    if (viewRef.current && state) {
      viewRef.current.render(state)
    }
  }, [state])

  return <div ref={containerRef} />
}

export default MemoryView
