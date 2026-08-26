import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import DemoLayout from '../../components/shared/DemoLayout'
import GraphicsStage from '../../components/graphics/GraphicsStage.jsx'
import ScenePicker from '../../components/graphics/ScenePicker.jsx'
import SceneControls from '../../components/graphics/SceneControls.jsx'
import { useGraphicsEngine } from '../../hooks/useGraphicsEngine.js'
import {
  SCENES, SCENES_BY_SLUG, defaultParams, defaultHandles,
} from '../../lib/graphics/scenes/index.js'

/**
 * The C++ graphics engine demo.
 *
 * One engine concept per demo. Some are fixed renders and some can be driven; which
 * is which is decided in the demo modules, by whether changing something is the lesson.
 *
 * All the drawing lives in src/lib/graphics/scenes/, framework-free, so the standalone
 * design prototype and this page render from exactly the same source.
 */
function GraphicsWasmPage() {
  const { module, error: engineError, loading } = useGraphicsEngine()
  const [searchParams, setSearchParams] = useSearchParams()

  const initialScene = SCENES_BY_SLUG[searchParams.get('scene')] ?? SCENES[0]
  const [scene, setScene] = useState(initialScene)
  const [params, setParams] = useState(() => defaultParams(initialScene))
  const [handles, setHandles] = useState(() => defaultHandles(initialScene))
  const [drawError, setDrawError] = useState(null)

  const selectScene = useCallback((next) => {
    setScene(next)
    setParams(defaultParams(next))
    setHandles(defaultHandles(next))
    setDrawError(null)
    setSearchParams({ scene: next.slug }, { replace: true })
  }, [setSearchParams])

  // Back/forward and shared links should move the page, not just the address bar.
  useEffect(() => {
    const slug = searchParams.get('scene')
    const target = SCENES_BY_SLUG[slug]
    if (target && target !== scene) {
      setScene(target)
      setParams(defaultParams(target))
      setHandles(defaultHandles(target))
    }
  }, [searchParams, scene])

  const setParam = useCallback((key, value) => {
    setParams((prev) => {
      const next = { ...prev, [key]: value }
      // A choice can restrict a sibling's options; keep the combination legal rather
      // than letting a demo be asked to draw something it cannot.
      for (const p of scene.params ?? []) {
        if (!p.optionsFor) continue
        const allowed = p.optionsFor(next)
        if (allowed && !allowed.includes(next[p.key])) next[p.key] = allowed[0]
      }
      return next
    })
  }, [scene])

  const setHandle = useCallback((key, point) => {
    setHandles((prev) => ({ ...prev, [key]: point }))
  }, [])

  // Keyboard: left/right move through the demos, R resets the current one.
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.metaKey || e.ctrlKey || e.altKey) return
      const i = SCENES.indexOf(scene)
      if (e.key === 'ArrowRight') { e.preventDefault(); selectScene(SCENES[(i + 1) % SCENES.length]) }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); selectScene(SCENES[(i - 1 + SCENES.length) % SCENES.length]) }
      else if (e.key === 'r' || e.key === 'R') { e.preventDefault(); selectScene(scene) }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [scene, selectScene])

  const failure = engineError ?? drawError
  const interactive = !scene.static
  const concepts = useMemo(() => scene.concepts ?? [], [scene])

  return (
    <DemoLayout
      wrapperClass="graphics-demo"
      title="C++ Graphics Engine"
      subtitle="A software rasterizer written in C++17 and compiled to WebAssembly. No GPU and no canvas drawing calls — the engine computes every pixel itself, then hands the finished buffer to the browser."
    >
      <div className="graphics-demo-body">
        <ScenePicker
          scenes={SCENES}
          current={scene}
          onSelect={selectScene}
          disabled={loading}
        />

        {failure && (
          <p className="graphics-error" role="alert">
            {engineError
              ? `The engine failed to start: ${failure.message}`
              : `${scene.name} failed to draw: ${failure.message}`}
          </p>
        )}

        <div className="graphics-columns">
          <GraphicsStage
            module={module}
            scene={scene}
            params={params}
            handles={handles}
            onHandleChange={setHandle}
            booting={loading}
            onError={setDrawError}
          />

          <section className="graphics-panel">
            <h2>What this shows</h2>
            <ul className="graphics-concepts">
              {concepts.map((c) => <li key={c}>{c}</li>)}
            </ul>

            <a className="graphics-docs-link" href={scene.docsHref}>
              Read how it works ›
            </a>

            {!interactive && (
              <p className="graphics-fixed-note">A fixed render — nothing to adjust.</p>
            )}

            <SceneControls
              scene={scene}
              params={params}
              onChange={setParam}
              disabled={loading}
            />

            {interactive && (
              <div className="graphics-actions">
                <button type="button" onClick={() => selectScene(scene)}>Reset</button>
              </div>
            )}

            <details className="demo-details">
              <summary>Keyboard shortcuts</summary>
              <ul>
                <li><kbd>←</kbd> <kbd>→</kbd> previous / next demo</li>
                <li><kbd>R</kbd> reset the current demo</li>
              </ul>
            </details>
          </section>
        </div>
      </div>
    </DemoLayout>
  )
}

export default GraphicsWasmPage
