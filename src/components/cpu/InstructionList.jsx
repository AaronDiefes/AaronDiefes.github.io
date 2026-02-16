import React, { useEffect, useRef } from 'react'

/**
 * InstructionList - React wrapper for vanilla JS InstructionList
 * Wraps the original instruction-list.js implementation
 */
function InstructionList({ engine }) {
  const containerRef = useRef(null)
  const listRef = useRef(null)

  useEffect(() => {
    // Import and initialize vanilla JS InstructionList
    import('../../lib/cpu/../../../archived/cpu-simulator/src/ui/instruction-list.js').then(() => {
      if (window.InstructionList && containerRef.current && engine && !listRef.current) {
        listRef.current = new window.InstructionList(containerRef.current, engine)
      }
    })

    return () => {
      // Cleanup if needed
      if (listRef.current && listRef.current.destroy) {
        listRef.current.destroy()
      }
    }
  }, [engine])

  return <div ref={containerRef} />
}

export default InstructionList
