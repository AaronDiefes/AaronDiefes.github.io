import React from 'react'

/**
 * The demo picker. A chip row rather than a <select> - the names are the navigation,
 * and hiding eleven of twelve behind a dropdown was one of the old page's problems.
 */
function ScenePicker({ scenes, current, onSelect, disabled }) {
  return (
    <div className="scene-picker" role="group" aria-label="Choose a demo">
      {scenes.map((s) => (
        <button
          key={s.slug}
          type="button"
          aria-pressed={s === current}
          disabled={disabled}
          onClick={() => onSelect(s)}
        >
          {s.name}
        </button>
      ))}
    </div>
  )
}

export default ScenePicker
