import React, { useEffect, useRef, useState } from 'react'
import DemoLayout from '../../components/shared/DemoLayout'
import PipelineDiagram from '../../components/cpu/PipelineDiagram'
import PipelineTimeline from '../../components/cpu/PipelineTimeline'
import PipelineNarration from '../../components/cpu/PipelineNarration'

function CPUSimulatorPage() {
  /* The whole simulated run, captured when a program loads. The timeline needs
     every cycle at once; cpu:framechange only ever carries the current one. */
  const [sequence, setSequence] = useState(null)
  const cpuVizContainerRef = useRef(null)
  const programSelectorContainerRef = useRef(null)
  const controlPanelContainerRef = useRef(null)
  const instructionListContainerRef = useRef(null)

  useEffect(() => {
    /*
     * `cleanup` is assigned asynchronously, so the effect cannot simply return
     * it - by the time the dynamic imports resolve, the effect has long since
     * returned. Capturing it in a closure and invoking it from the real cleanup
     * is what makes the teardown actually run.
     *
     * `cancelled` guards the other half of the race: the visitor can navigate
     * away while those chunks are still in flight, which is more likely now
     * that routes are code-split. Initialising after that point would build a
     * simulator into a detached DOM and bind listeners nothing owns. It also
     * fixes the StrictMode double-mount in development, which was constructing
     * two engines (visible as the program loading twice in the console).
     */
    let cleanup = null
    let cancelled = false

    const loadScripts = async () => {
      try {
        /*
         * These now come from src/lib/cpu/, not archived/. The archived tree is
         * marked read-only by CLAUDE.md, and until now the live demo imported
         * fourteen modules straight out of it - so "archived" was never actually
         * archived. src/lib/cpu/ already held a byte-identical, unimported copy;
         * that copy is now the real one and carries the pipeline rewrite.
         *
         * Order matters: PipelineSimulator must exist before sequence-generator
         * (which delegates to it), and every module registers itself on `window`.
         */
        await import('../../lib/cpu/core/cpu-state.js')
        await import('../../lib/cpu/core/instruction-set.js')
        await import('../../lib/cpu/core/pipeline-simulator.js')
        await import('../../lib/cpu/core/sequence-generator.js')

        await import('../../lib/cpu/animation/timing-controller.js')
        await import('../../lib/cpu/animation/animation-engine.js')

        await import('../../lib/cpu/programs/curated-programs.js')

        await import('../../lib/cpu/visualization/register-view.js')
        await import('../../lib/cpu/visualization/memory-view.js')
        await import('../../lib/cpu/visualization/instruction-view.js')
        await import('../../lib/cpu/visualization/cpu-visualizer.js')

        await import('../../lib/cpu/ui/instruction-list.js')
        await import('../../lib/cpu/ui/control-panel.js')
        await import('../../lib/cpu/ui/program-selector.js')

        if (cancelled) return
        cleanup = initializeCPUSimulator()
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
            /* The timeline needs the WHOLE run, not just the current frame -
               it draws which instruction occupied which stage on every cycle.
               cpu:framechange only carries one frame, so the sequence is lifted
               into React state here, where it is already available. */
            setSequence({ program, frames: result.frames, metadata: result.metadata })
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
        /*
         * This listener is document-level and calls preventDefault() on Space.
         * Left attached, it kept swallowing Space on every other page for the
         * rest of the session - so Space stopped scrolling the documentation
         * once a visitor had opened the demo, and every return visit added
         * another copy.
         */
        document.removeEventListener('keydown', handleKeyDown)

        /*
         * Cancels the requestAnimationFrame loop. Without this, navigating away
         * mid-playback leaves the engine animating against a visualiser whose
         * DOM React has already removed.
         */
        engine.pause()
      }
    }

    loadScripts()

    return () => {
      cancelled = true
      if (cleanup) cleanup()
    }
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
          {/* Sits above the datapath on purpose: the timeline is the index -
              it tells you where you are before you look at where data flows. */}
          <PipelineTimeline sequence={sequence} />
          {/* When (timeline) -> why (narration) -> where (datapath). */}
          <PipelineNarration />
          <PipelineDiagram />
          <div id="cpu-viz-container" ref={cpuVizContainerRef} style={{ marginTop: '2rem' }}></div>
        </div>
      </div>
    </DemoLayout>
  )
}

export default CPUSimulatorPage
