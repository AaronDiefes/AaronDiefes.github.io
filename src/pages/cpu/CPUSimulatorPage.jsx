import React, { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

function CPUSimulatorPage() {
  const cpuVizContainerRef = useRef(null)
  const programSelectorContainerRef = useRef(null)
  const controlPanelContainerRef = useRef(null)
  const instructionListContainerRef = useRef(null)

  useEffect(() => {
    // Dynamically import all the required scripts
    const loadScripts = async () => {
      try {
        // Phase 9: Core
        await import('../../../archived/cpu-simulator/src/core/cpu-state.js')
        await import('../../../archived/cpu-simulator/src/core/instruction-set.js')
        await import('../../../archived/cpu-simulator/src/core/sequence-generator.js')

        // Phase 9: Animation
        await import('../../../archived/cpu-simulator/src/animation/timing-controller.js')
        await import('../../../archived/cpu-simulator/src/animation/animation-engine.js')

        // Phase 9: Programs
        await import('../../../archived/cpu-simulator/src/programs/basic-instructions.js')
        await import('../../../archived/cpu-simulator/src/programs/fibonacci.js')

        // Phase 10: Visualization
        await import('../../../archived/cpu-simulator/src/visualization/block-diagram-view.js')
        await import('../../../archived/cpu-simulator/src/visualization/register-view.js')
        await import('../../../archived/cpu-simulator/src/visualization/memory-view.js')
        await import('../../../archived/cpu-simulator/src/visualization/instruction-view.js')
        await import('../../../archived/cpu-simulator/src/visualization/cpu-visualizer.js')

        // Phase 11: UI Controls
        await import('../../../archived/cpu-simulator/src/ui/instruction-list.js')
        await import('../../../archived/cpu-simulator/src/ui/control-panel.js')
        await import('../../../archived/cpu-simulator/src/ui/program-selector.js')

        // Initialize after all scripts are loaded
        initializeCPUSimulator()
      } catch (error) {
        console.error('Failed to load CPU simulator scripts:', error)
      }
    }

    const initializeCPUSimulator = () => {
      // Create animation engine
      const engine = new window.AnimationEngine()

      // Create visualization
      const visualizer = new window.CPUVisualizer(
        cpuVizContainerRef.current
      )

      // Create instruction list
      const instructionList = new window.InstructionList(
        instructionListContainerRef.current,
        engine
      )

      // Create control panel
      const controlPanel = new window.ControlPanel(
        controlPanelContainerRef.current,
        engine
      )

      // Create program selector (loads default program)
      const programSelector = new window.ProgramSelector(
        programSelectorContainerRef.current,
        engine,
        {
          defaultProgram: 'basic',
          onProgramLoad: function(program, result) {
            // Wire instruction list
            instructionList.loadProgram(program, result)
            // Render initial state
            visualizer.render(result.frames[0])
          }
        }
      )

      // ========== KEYBOARD SHORTCUTS ==========
      const handleKeyDown = (e) => {
        // Don't interfere with input fields
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

      // Cleanup function
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    }

    loadScripts()
  }, [])

  return (
    <>
      <style>{`
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
            color: #333;
            min-height: 100vh;
            padding: 2rem;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }

        header {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white;
            padding: 2rem;
            text-align: center;
        }

        header h1 {
            margin-bottom: 0.5rem;
        }

        header p {
            opacity: 0.9;
            font-size: 1.1rem;
        }

        .demo-layout {
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 2rem;
            padding: 2rem;
        }

        .sidebar {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 8px;
            overflow-y: auto;
            max-height: calc(100vh - 200px);
        }

        .visualization-area {
            padding: 1.5rem;
            min-width: 0;
        }

        .program-selector {
            margin-bottom: 1.5rem;
        }

        .program-selector label {
            display: block;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #2c3e50;
        }

        .program-selector select {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
        }

        /* Control Panel Styles */
        .control-panel {
          margin-bottom: 1.5rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .control-panel button {
          flex: 1 1 calc(50% - 0.25rem);
          padding: 0.75rem;
          background: #2E7D32;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.3s;
        }

        .control-panel button:hover {
          background: #1B5E20;
        }

        .control-panel .btn-reset {
          background: #e74c3c;
        }

        .control-panel .btn-reset:hover {
          background: #c0392b;
        }

        .control-panel .speed-control {
          flex: 1 1 100%;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: white;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .control-panel .speed-control label {
          font-weight: 600;
          font-size: 0.85rem;
          color: #2c3e50;
          white-space: nowrap;
        }

        .control-panel .speed-control select {
          flex: 1;
          padding: 0.25rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.85rem;
        }

        .keyboard-shortcuts {
            margin-top: 2rem;
            padding: 1rem;
            background: white;
            border-radius: 4px;
            border: 1px solid #ddd;
        }

        .keyboard-shortcuts h3 {
            margin-bottom: 0.75rem;
            font-size: 0.95rem;
            color: #2c3e50;
        }

        .keyboard-shortcuts dl {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 0.5rem;
            font-size: 0.85rem;
        }

        .keyboard-shortcuts dt {
            font-weight: 600;
        }

        .keyboard-shortcuts kbd {
            display: inline-block;
            padding: 0.15rem 0.4rem;
            background: #f8f9fa;
            border: 1px solid #ddd;
            border-radius: 3px;
            font-family: monospace;
            font-size: 0.8rem;
        }

        .keyboard-shortcuts dd {
            margin: 0;
            color: #555;
        }

        .c-code-equivalent {
            margin-top: 2rem;
            padding: 1rem;
            background: white;
            border-radius: 4px;
            border: 1px solid #ddd;
        }

        .c-code-equivalent h3 {
            margin-bottom: 0.75rem;
            font-size: 0.95rem;
            color: #2c3e50;
        }

        .c-code-equivalent pre {
            margin: 0;
            padding: 0.75rem;
            background: #f8f9fa;
            border-radius: 4px;
            overflow-x: auto;
            font-size: 0.8rem;
            line-height: 1.5;
        }

        .c-code-equivalent code {
            font-family: 'Monaco', 'Courier New', monospace;
            color: #2c3e50;
        }

        /* Info panels for visualization components */
        .info-panels {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-top: 1.5rem;
        }

        footer {
            background: #2c3e50;
            color: white;
            text-align: center;
            padding: 1rem;
        }

        footer a {
            color: #2E7D32;
            text-decoration: none;
        }

        footer a:hover {
            text-decoration: underline;
        }

        /* Responsive layout */
        @media (max-width: 1024px) {
          .demo-layout {
            grid-template-columns: 1fr;
          }

          .sidebar {
            max-height: none;
          }

          .info-panels {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {
          body {
            padding: 1rem;
          }

          header h1 {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <nav className="site-nav" aria-label="Main navigation">
        <Link to="/" className="nav-brand">CPU Simulator</Link>
        <button className="menu-toggle" aria-expanded="false" aria-controls="nav-menu">
          <span className="sr-only">Toggle menu</span>
          <span className="hamburger-icon"></span>
        </button>
        <ul id="nav-menu" className="nav-links" hidden>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/#projects">Projects</Link></li>
          <li><Link to="/#about">About</Link></li>
          <li><a href="https://github.com/AaronDiefes" target="_blank" rel="noopener noreferrer">GitHub</a></li>
        </ul>
      </nav>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol>
          <li><Link to="/">Home</Link></li>
          <li><span className="separator" aria-hidden="true">›</span></li>
          <li><span aria-current="page">CPU Simulator</span></li>
        </ol>
      </nav>
      <div className="container">
        <header>
          <h1>CPU Pipeline Simulator</h1>
          <p>Interactive 5-stage RISC pipeline visualization with step-through execution</p>
        </header>

        <main className="demo-layout">
          {/* Left sidebar: controls */}
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

          {/* Main content: visualization */}
          <div className="visualization-area">
            <div id="cpu-viz-container" ref={cpuVizContainerRef}></div>
          </div>
        </main>

        <footer>
          <p>Built by Aaron Diefes | <Link to="/">Back to Home</Link> | <a href="https://github.com/AaronDiefes" target="_blank" rel="noopener noreferrer">View on GitHub</a></p>
        </footer>
      </div>
    </>
  )
}

export default CPUSimulatorPage
