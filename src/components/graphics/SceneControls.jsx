import React from 'react'

/**
 * Declarative controls, built from the demo's own `params` list.
 *
 * This replaces the old page's approach of assembling control markup as an HTML string
 * and injecting it with innerHTML inside a setTimeout, then wiring a delegated listener
 * and reading values back out of the DOM.
 *
 * Two behaviours worth keeping in mind:
 *  - range inputs fire on 'input', not 'change', so the image follows the thumb rather
 *    than waiting for the visitor to let go.
 *  - a param may declare `when` (show only in some configurations) or `optionsFor`
 *    (restrict its choices based on a sibling), so a control never sits there inert or
 *    offers a combination the engine cannot draw.
 */
function SceneControls({ scene, params, onChange, disabled }) {
  const visible = (scene.params ?? []).filter((p) => !p.when || p.when(params))
  if (!visible.length) return null

  return (
    <div className="scene-controls">
      {visible.map((p) => {
        const value = params[p.key]
        const shown = p.type === 'choice' ? '' : (p.format ? p.format(value) : value)

        return (
          <div className="scene-control" key={p.key}>
            <label htmlFor={`ctrl-${p.key}`}>
              {p.label}
              <span>{shown}</span>
            </label>

            {p.type === 'range' && (
              <input
                id={`ctrl-${p.key}`}
                type="range"
                min={p.min}
                max={p.max}
                step={p.step}
                value={value}
                disabled={disabled}
                onChange={(e) => onChange(p.key, Number(e.target.value))}
              />
            )}

            {p.type === 'choice' && (() => {
              const options = p.optionsFor?.(params) ?? p.options
              return (
                <div
                  className={`scene-segmented${options.length > 4 ? ' is-wrapped' : ''}`}
                  role="group"
                  aria-label={p.label}
                >
                  {options.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      aria-pressed={value === opt}
                      disabled={disabled}
                      onClick={() => onChange(p.key, opt)}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )
            })()}
          </div>
        )
      })}
    </div>
  )
}

export default SceneControls
