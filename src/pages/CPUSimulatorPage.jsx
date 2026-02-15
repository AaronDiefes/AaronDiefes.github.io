import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAnimationEngine } from '../hooks/useAnimationEngine'
import CPUVisualizer from '../components/cpu/CPUVisualizer'
import ControlPanel from '../components/cpu/ControlPanel'
import ProgramSelector from '../components/cpu/ProgramSelector'
import InstructionList from '../components/cpu/InstructionList'

function CPUSimulatorPage() {
  const { currentState, isPlaying, progress, controls } = useAnimationEngine()
  const [programs, setPrograms] = useState([])
  const [currentProgram, setCurrentProgram] = useState(null)

  useEffect(() => {
    Promise.all([
      import('../lib/cpu/programs/basic-instructions.js'),
      import('../lib/cpu/programs/fibonacci.js'),
      import('../lib/cpu/core/sequence-generator.js')
    ]).then(() => {
      if (window.PROGRAMS) {
        const programList = Object.keys(window.PROGRAMS).map(key => ({
          id: key,
          name: window.PROGRAMS[key].name || key,
          program: window.PROGRAMS[key]
        }))
        setPrograms(programList)
        if (programList.length > 0) {
          loadProgram(programList[0].id)
        }
      }
    })
  }, [])

  const loadProgram = (programId) => {
    if (!window.SequenceGenerator || !window.PROGRAMS) return
    const program = window.PROGRAMS[programId]
    if (!program) return
    const generator = new window.SequenceGenerator()
    const frames = generator.generateSequence(program)
    controls.loadFrames(frames)
    setCurrentProgram(program)
  }

  const handleProgramChange = (programId) => {
    loadProgram(programId)
  }

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

        @media (max-width: 1024px) {
            .demo-layout {
                grid-template-columns: 1fr;
            }
            .sidebar {
                max-height: none;
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
          <aside className="sidebar">
            <ProgramSelector programs={programs} onProgramChange={handleProgramChange} />
            <ControlPanel controls={controls} isPlaying={isPlaying} progress={progress} />
            <InstructionList
              instructions={currentProgram?.instructions}
              currentFrame={progress.current}
              onJumpToFrame={controls.jumpToFrame}
            />

            <div className="keyboard-shortcuts">
              <h3>Keyboard Shortcuts</h3>
              <dl>
                <dt><kbd>Space</kbd></dt><dd>Play / Pause</dd>
                <dt><kbd>←</kbd></dt><dd>Step Back</dd>
                <dt><kbd>→</kbd></dt><dd>Step Forward</dd>
                <dt><kbd>R</kbd></dt><dd>Reset</dd>
              </dl>
            </div>
          </aside>

          <div className="visualization-area">
            <CPUVisualizer state={currentState} />
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
