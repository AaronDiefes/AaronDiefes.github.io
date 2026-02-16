import React, { useEffect, useRef } from 'react'

/**
 * ProgramSelector - React wrapper for vanilla JS ProgramSelector
 * Wraps the original program-selector.js implementation
 */
function ProgramSelector({ engine, onProgramLoad }) {
  const containerRef = useRef(null)
  const selectorRef = useRef(null)

  useEffect(() => {
    // Import and initialize vanilla JS ProgramSelector
    import('../../lib/cpu/../../../archived/cpu-simulator/src/ui/program-selector.js').then(() => {
      if (window.ProgramSelector && containerRef.current && engine && !selectorRef.current) {
        selectorRef.current = new window.ProgramSelector(
          containerRef.current,
          engine,
          {
            defaultProgram: 'basic',
            onProgramLoad: onProgramLoad
          }
        )
      }
    })

    return () => {
      // Cleanup if needed
      if (selectorRef.current && selectorRef.current.destroy) {
        selectorRef.current.destroy()
      }
    }
  }, [engine, onProgramLoad])

  return <div ref={containerRef} />
}

export default ProgramSelector
