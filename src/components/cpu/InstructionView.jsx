import React, { useEffect, useRef } from 'react'

/**
 * InstructionView - React wrapper for vanilla JS InstructionView
 * Displays current instruction details
 */
function InstructionView({ state }) {
  const containerRef = useRef(null)
  const viewRef = useRef(null)

  useEffect(() => {
    // Import and initialize vanilla JS InstructionView
    import('../../../archived/cpu-simulator/src/visualization/instruction-view.js').then(() => {
      if (window.InstructionView && containerRef.current && !viewRef.current) {
        viewRef.current = new window.InstructionView(containerRef.current)
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

export default InstructionView
