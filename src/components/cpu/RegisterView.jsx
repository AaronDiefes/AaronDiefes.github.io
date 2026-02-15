import React, { useEffect, useRef } from 'react'

/**
 * RegisterView - React wrapper for vanilla JS RegisterView
 * Displays 32 MIPS registers in a grid with change highlighting
 */
function RegisterView({ state }) {
  const containerRef = useRef(null)
  const viewRef = useRef(null)

  useEffect(() => {
    // Import and initialize vanilla JS RegisterView
    import('../../../archived/cpu-simulator/src/visualization/register-view.js').then(() => {
      if (window.RegisterView && containerRef.current && !viewRef.current) {
        viewRef.current = new window.RegisterView(containerRef.current)
      }
    })
  }, [])

  useEffect(() => {
    // Render on state changes
    if (viewRef.current && state) {
      viewRef.current.render(state)
    }
  }, [state])

  return <div ref={containerRef} className="register-grid" />
}

export default RegisterView
