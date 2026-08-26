import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Surface } from '../../lib/graphics/surface.js'
import SceneHandles from './SceneHandles.jsx'

/**
 * The drawing surface.
 *
 * Owns the Surface (and therefore the engine's CanvasWrapper), sizes it, and renders
 * when something changes. There is no frame loop: the engine produces images, so a
 * render happens on a parameter or handle change and not otherwise.
 */
function GraphicsStage({ module, scene, params, handles, onHandleChange, booting, onError }) {
  const stageRef = useRef(null)
  const canvasRef = useRef(null)
  const surfaceRef = useRef(null)
  const [, forceLayout] = useState(0)

  // Fit by both axes. Width alone lets a square demo grow until it pushes the panel
  // beside it off the screen.
  const fit = useCallback(() => {
    const surface = surfaceRef.current
    const stage = stageRef.current
    if (!surface || !stage || !scene) return
    const cs = getComputedStyle(stage)
    const avail = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
    const byHeight = Math.max(240, window.innerHeight * 0.62) * (scene.size.w / scene.size.h)
    const cssWidth = Math.max(240, Math.min(avail, byHeight))
    surface.configure({
      logicalW: scene.size.w,
      logicalH: scene.size.h,
      cssWidth,
      dpr: window.devicePixelRatio || 1,
    })
  }, [scene])

  // Create the surface once the engine is available; tear it down on unmount so the
  // C++ CanvasWrapper is released rather than leaked.
  useEffect(() => {
    if (!module || !canvasRef.current) return undefined
    surfaceRef.current = new Surface(canvasRef.current, module)
    forceLayout((n) => n + 1)
    return () => {
      surfaceRef.current?.destroy()
      surfaceRef.current = null
    }
  }, [module])

  // `module` belongs in these deps even though it is unused in the body: the surface
  // is created in the effect above only once the engine resolves, and without it this
  // effect never re-runs, so configure() is never called and the canvas sits at its
  // default 300x150 showing nothing.
  useEffect(() => {
    if (!surfaceRef.current || !scene) return undefined
    fit()
    const observer = new ResizeObserver(() => fit())
    if (stageRef.current) observer.observe(stageRef.current)
    window.addEventListener('resize', fit)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [fit, scene, module])

  // The render itself, on every change of scene, params or handles.
  useEffect(() => {
    const surface = surfaceRef.current
    if (!surface || !scene || !module) return
    try {
      surface.render((mod, canvas) => scene.draw(mod, canvas, params, handles))
      onError(null)
    } catch (err) {
      onError(err)
      // eslint-disable-next-line no-console
      console.error(err)
    }
  }, [module, scene, params, handles, onError])

  const toLogical = useCallback(
    (clientX, clientY) => surfaceRef.current?.toLogical(clientX, clientY) ?? { x: 0, y: 0 },
    [],
  )

  const labels = scene?.labels?.() ?? []

  return (
    <div className="graphics-stage" ref={stageRef}>
      <div className="graphics-surface">
        <canvas ref={canvasRef} />

        {scene && (
          <SceneHandles
            scene={scene}
            handles={handles}
            onChange={onHandleChange}
            toLogical={toLogical}
          />
        )}

        {/* The engine has no text rasterizer, so any labels a demo asks for are HTML
            positioned over the canvas in the demo's logical space. Only the picture
            itself is the engine's output. */}
        {labels.length > 0 && (
          <div className="scene-labels" aria-hidden="true">
            {labels.map((l, i) => (
              <span
                key={i}
                style={{
                  left: `${(l.x / scene.size.w) * 100}%`,
                  top: `${(l.y / scene.size.h) * 100}%`,
                }}
              >
                {l.text}
              </span>
            ))}
          </div>
        )}
      </div>

      {!booting && scene?.handles?.length > 0 && (
        <p className="graphics-hint">drag the points</p>
      )}

      {booting && (
        <div className="graphics-veil">
          <span className="graphics-spinner" />
          Starting the engine…
        </div>
      )}
    </div>
  )
}

export default GraphicsStage
