import React from 'react'

/**
 * InstructionList - List of instructions with click-to-jump
 * Pure React component
 */
function InstructionList({ instructions, currentFrame, onJumpToFrame }) {
  if (!instructions || instructions.length === 0) {
    return <div className="instruction-list">No instructions loaded</div>
  }

  return (
    <div className="instruction-list">
      <h3>Instructions</h3>
      <ol>
        {instructions.map((instr, index) => (
          <li
            key={index}
            className={index === currentFrame ? 'active' : ''}
            onClick={() => onJumpToFrame(index)}
            style={{ cursor: 'pointer' }}
          >
            {instr}
          </li>
        ))}
      </ol>
    </div>
  )
}

export default InstructionList
