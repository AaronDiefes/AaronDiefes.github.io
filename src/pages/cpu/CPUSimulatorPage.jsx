import React, { useEffect, useRef } from 'react'
import DemoLayout from '../../components/shared/DemoLayout'
import PipelineDiagram from '../../components/cpu/PipelineDiagram'

function CPUSimulatorPage() {
  const cpuVizContainerRef = useRef(null)
  const programSelectorContainerRef = useRef(null)
  const controlPanelContainerRef = useRef(null)
  const instructionListContainerRef = useRef(null)

  useEffect(() => {
    const loadScripts = async () => {
      try {
        await import('../../../archived/cpu-simulator/src/core/cpu-state.js')
        await import('../../../archived/cpu-simulator/src/core/instruction-set.js')
        await import('../../../archived/cpu-simulator/src/core/sequence-generator.js')

        await import('../../../archived/cpu-simulator/src/animation/timing-controller.js')
        await import('../../../archived/cpu-simulator/src/animation/animation-engine.js')

        await import('../../../archived/cpu-simulator/src/programs/basic-instructions.js')
        await import('../../../archived/cpu-simulator/src/programs/fibonacci.js')

        await import('../../../archived/cpu-simulator/src/visualization/register-view.js')
        await import('../../../archived/cpu-simulator/src/visualization/memory-view.js')
        await import('../../../archived/cpu-simulator/src/visualization/instruction-view.js')
        await import('../../../archived/cpu-simulator/src/visualization/cpu-visualizer.js')

        await import('../../../archived/cpu-simulator/src/ui/instruction-list.js')
        await import('../../../archived/cpu-simulator/src/ui/control-panel.js')
        await import('../../../archived/cpu-simulator/src/ui/program-selector.js')

        initializeCPUSimulator()
      } catch (error) {
        console.error('Failed to load CPU simulator scripts:', error)
      }
    }

    const initializeCPUSimulator = () => {
      const engine = new window.AnimationEngine()

      const visualizer = new window.CPUVisualizer(
        cpuVizContainerRef.current
      )

      const instructionList = new window.InstructionList(
        instructionListContainerRef.current,
        engine
      )

      const controlPanel = new window.ControlPanel(
        controlPanelContainerRef.current,
        engine
      )

      const programSelector = new window.ProgramSelector(
        programSelectorContainerRef.current,
        engine,
        {
          defaultProgram: 'basic',
          onProgramLoad: function(program, result) {
            instructionList.loadProgram(program, result)
            visualizer.render(result.frames[0])
          }
        }
      )

      const handleKeyDown = (e) => {
        if (e.target.matches('input, textarea, select')) {
          return
        }

        switch (e.code) {
          case 'Space':
            e.preventDefault()
            engine.togglePlayPause()
            break
          case 'ArrowLeft':
            e.preventDefault()
            engine.stepBackward()
            break
          case 'ArrowRight':
            e.preventDefault()
            engine.stepForward()
            break
          case 'KeyR':
            if (!e.ctrlKey && !e.metaKey) {
              e.preventDefault()
              engine.reset()
            }
            break
        }
      }

      document.addEventListener('keydown', handleKeyDown)

      return () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    }

    loadScripts()
  }, [])

  return (
    <DemoLayout
      wrapperClass="cpu-demo"
      title="CPU Pipeline Simulator"
      subtitle="Interactive 5-stage RISC pipeline visualization with step-through execution"
    >
      <div className="demo-layout">
        <aside className="sidebar">
          <div id="program-selector-container" ref={programSelectorContainerRef}></div>
          <div id="control-panel-container" ref={controlPanelContainerRef}></div>
          <div id="instruction-list-container" ref={instructionListContainerRef}></div>

          <div className="c-code-equivalent">
            <h3>C Code Equivalent</h3>
            <pre><code id="c-code-display"></code></pre>
          </div>

          <div className="keyboard-shortcuts">
            <h3>Keyboard Shortcuts</h3>
            <dl>
              <dt><kbd>Space</kbd></dt><dd>Play / Pause</dd>
              <dt><kbd>&larr;</kbd></dt><dd>Step Back</dd>
              <dt><kbd>&rarr;</kbd></dt><dd>Step Forward</dd>
              <dt><kbd>R</kbd></dt><dd>Reset</dd>
            </dl>
          </div>
        </aside>

        <div className="visualization-area">
          <PipelineDiagram />
          <div id="cpu-viz-container" ref={cpuVizContainerRef} style={{ marginTop: '2rem' }}></div>
        </div>
      </div>
    </DemoLayout>
  )
}

export default CPUSimulatorPage
