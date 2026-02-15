import React from 'react'
import BlockDiagram from './BlockDiagram'
import RegisterView from './RegisterView'
import MemoryView from './MemoryView'
import InstructionView from './InstructionView'

/**
 * CPUVisualizer - Main coordinator component
 * Manages layout and delegates rendering to child view components
 */
function CPUVisualizer({ state }) {
  return (
    <div className="cpu-visualizer">
      <section className="diagram-section">
        <BlockDiagram state={state} />
      </section>

      <section className="info-section">
        <div className="info-panels">
          <section className="registers-section">
            <h2>Registers</h2>
            <RegisterView state={state} />
          </section>

          <section className="memory-section">
            <MemoryView state={state} />
          </section>

          <section className="instruction-detail-section">
            <InstructionView state={state} />
          </section>
        </div>
      </section>
    </div>
  )
}

export default CPUVisualizer
