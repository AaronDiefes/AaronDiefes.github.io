import React from 'react'

/**
 * ControlPanel - Playback controls for animation
 * Pure React component (no vanilla JS wrapper needed)
 */
function ControlPanel({ controls, isPlaying, progress }) {
  return (
    <div className="control-panel">
      <div className="playback-controls">
        <button onClick={controls.reset} className="control-btn" title="Reset to beginning">
          ⏮ Reset
        </button>
        <button onClick={controls.stepBack} className="control-btn" title="Step backward">
          ⏪ Back
        </button>
        <button
          onClick={isPlaying ? controls.pause : controls.play}
          className="control-btn primary"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸ Pause' : '▶ Play'}
        </button>
        <button onClick={controls.step} className="control-btn" title="Step forward">
          Step ⏩
        </button>
      </div>

      <div className="progress-info">
        <span>Frame: {progress.current} / {progress.total}</span>
      </div>

      <div className="speed-controls">
        <label>Speed:</label>
        <button onClick={() => controls.setSpeed(0.25)} className="speed-btn">0.25x</button>
        <button onClick={() => controls.setSpeed(0.5)} className="speed-btn">0.5x</button>
        <button onClick={() => controls.setSpeed(1)} className="speed-btn">1x</button>
        <button onClick={() => controls.setSpeed(2)} className="speed-btn">2x</button>
        <button onClick={() => controls.setSpeed(4)} className="speed-btn">4x</button>
      </div>
    </div>
  )
}

export default ControlPanel
