import React, { useEffect, useRef } from 'react'

/**
 * BlockDiagram - React wrapper for vanilla JS BlockDiagramView
 * Displays SVG CPU architecture diagram with pipeline stages
 */
function BlockDiagram({ state }) {
  const containerRef = useRef(null)
  const viewRef = useRef(null)

  useEffect(() => {
    // Import and initialize vanilla JS BlockDiagramView
    import('../../../archived/cpu-simulator/src/visualization/block-diagram-view.js').then(() => {
      if (window.BlockDiagramView && containerRef.current && !viewRef.current) {
        viewRef.current = new window.BlockDiagramView(containerRef.current)
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

export default BlockDiagram
