import React from 'react'

/**
 * ProgramSelector - Dropdown to select CPU program
 * Pure React component
 */
function ProgramSelector({ programs, onProgramChange }) {
  return (
    <div className="program-selector">
      <label htmlFor="program-select">Select Program:</label>
      <select id="program-select" onChange={(e) => onProgramChange(e.target.value)}>
        {programs.map(program => (
          <option key={program.id} value={program.id}>
            {program.name}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ProgramSelector
