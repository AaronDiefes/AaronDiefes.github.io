import React, { useEffect, useRef } from 'react'

/**
 * ControlPanel - React wrapper for vanilla JS ControlPanel
 * Wraps the original control-panel.js implementation
 */
function ControlPanel({ engine }) {
  const containerRef = useRef(null)
  const panelRef = useRef(null)

  useEffect(() => {
    // Import and initialize vanilla JS ControlPanel
    import('../../lib/cpu/../../../archived/cpu-simulator/src/ui/control-panel.js').then(() => {
      if (window.ControlPanel && containerRef.current && engine && !panelRef.current) {
        panelRef.current = new window.ControlPanel(containerRef.current, engine)
      }
    })

    return () => {
      // Cleanup if needed
      if (panelRef.current && panelRef.current.destroy) {
        panelRef.current.destroy()
      }
    }
  }, [engine])

  return <div ref={containerRef} />
}

export default ControlPanel
