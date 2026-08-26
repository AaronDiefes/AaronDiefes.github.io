import React, { useCallback, useRef } from 'react'

/**
 * Draggable control points, as an SVG overlay in the demo's own logical space.
 *
 * Pointer events rather than mouse events so touch works, with touch-action: none so
 * a drag does not scroll the page out from under the visitor.
 */
function SceneHandles({ scene, handles, onChange, toLogical }) {
  const svgRef = useRef(null)
  const dragging = useRef(null)

  const onPointerDown = useCallback((ev) => {
    const target = ev.target.closest('circle')
    if (!target) return
    dragging.current = target.dataset.key
    try { svgRef.current.setPointerCapture(ev.pointerId) } catch { /* older Safari */ }
    ev.preventDefault()
  }, [])

  const onPointerMove = useCallback((ev) => {
    if (!dragging.current) return
    const p = toLogical(ev.clientX, ev.clientY)
    onChange(dragging.current, {
      x: Math.max(0, Math.min(scene.size.w, p.x)),
      y: Math.max(0, Math.min(scene.size.h, p.y)),
    })
  }, [onChange, scene.size.h, scene.size.w, toLogical])

  const endDrag = useCallback(() => { dragging.current = null }, [])

  if (!scene.handles?.length) return null

  const guide = scene.guide?.(handles)

  return (
    <svg
      ref={svgRef}
      className="scene-handles"
      viewBox={`0 0 ${scene.size.w} ${scene.size.h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      {guide && (
        <polyline
          points={guide.map((p) => `${p.x},${p.y}`).join(' ')}
          vectorEffect="non-scaling-stroke"
        />
      )}
      {scene.handles.map((h) => (
        <circle
          key={h.key}
          data-key={h.key}
          cx={handles[h.key].x}
          cy={handles[h.key].y}
          r="9"
          vectorEffect="non-scaling-stroke"
        >
          <title>{h.label}</title>
        </circle>
      ))}
    </svg>
  )
}

export default SceneHandles
