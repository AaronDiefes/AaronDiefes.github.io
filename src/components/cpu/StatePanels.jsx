import React, { useRef, useState } from 'react'
import PipelineTimeline from './PipelineTimeline'
import PipelineDiagram from './PipelineDiagram'

/**
 * One viewer: the three ways of looking at the machine, behind one tab bar.
 *
 * The datapath belongs in here rather than in a panel of its own. It used to
 * sit directly above this control with its own row of segmented buttons - the
 * stage focus - so the page showed two near-identical button strips stacked on
 * each other doing unrelated jobs. They are not the same kind of thing: the
 * tabs choose WHICH VIEW, the stage buttons choose what part of ONE view. That
 * relationship is now expressed by nesting, with the stage buttons a level down
 * inside the datapath panel.
 *
 * Registers and memory share a tab: same question ("what does the machine hold
 * right now"), and .info-panels already sits them side by side on a wide screen.
 *
 * The vanilla CPUVisualizer owns the DOM inside #cpu-viz-container, so that
 * container is rendered unconditionally and only hidden - unmounting it would
 * pull the element out from under a class that has already bound to it. Same
 * for the datapath: React Flow cannot measure a display:none container, so it
 * stays mounted and re-fits itself when its tab comes back (its ResizeObserver
 * fires on the 0x0 -> sized transition).
 */

const TABS = [
  { id: 'datapath', label: 'Datapath' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'state', label: 'Registers & Memory' },
]

function StatePanels({ sequence, vizContainerRef }) {
  const [active, setActive] = useState('datapath')
  const tabRefs = useRef({})

  /* A tablist is a single tab stop: Left/Right move between tabs rather than
     Tab cycling through every one of them. */
  const onKeyDown = (e) => {
    const i = TABS.findIndex((t) => t.id === active)
    let next = null
    if (e.key === 'ArrowRight') next = TABS[(i + 1) % TABS.length]
    else if (e.key === 'ArrowLeft') next = TABS[(i - 1 + TABS.length) % TABS.length]
    else if (e.key === 'Home') next = TABS[0]
    else if (e.key === 'End') next = TABS[TABS.length - 1]
    if (!next) return
    e.preventDefault()
    setActive(next.id)
    const el = tabRefs.current[next.id]
    if (el) el.focus()
  }

  const panelProps = (id) => ({
    role: 'tabpanel',
    id: `sp-panel-${id}`,
    'aria-labelledby': `sp-tab-${id}`,
    hidden: active !== id,
  })

  return (
    <section className="state-panels" aria-label="Machine views">
      <div className="sp-tablist" role="tablist" aria-label="View" onKeyDown={onKeyDown}>
        {TABS.map((t) => (
          <button
            key={t.id}
            ref={(el) => { tabRefs.current[t.id] = el }}
            type="button"
            role="tab"
            id={`sp-tab-${t.id}`}
            aria-selected={active === t.id}
            aria-controls={`sp-panel-${t.id}`}
            tabIndex={active === t.id ? 0 : -1}
            className={`sp-tab${active === t.id ? ' is-on' : ''}`}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* The datapath brings its own chrome and sizes itself, so it gets no
          panel padding and no height cap. */}
      <div {...panelProps('datapath')} className="sp-panel sp-panel-datapath">
        <PipelineDiagram />
      </div>

      <div {...panelProps('timeline')} className="sp-panel">
        <PipelineTimeline sequence={sequence} embedded />
      </div>

      <div {...panelProps('state')} className="sp-panel">
        <div id="cpu-viz-container" ref={vizContainerRef}></div>
      </div>
    </section>
  )
}

export default StatePanels
