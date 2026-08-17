import React, { useRef, useState } from 'react'
import PipelineTimeline from './PipelineTimeline'

/**
 * The two detail views — the cycle grid, and the machine's actual state — behind
 * one segmented control.
 *
 * They used to be stacked, and together they were 1320px tall on a phone: the
 * timeline (391), the register grid (767, because 32 registers fall to two
 * columns) and data memory (162). That is three screens of panels you read one
 * at a time, sitting between the datapath and the bottom of the page. Tabbing
 * them costs nothing — nobody was comparing the register file against the cycle
 * grid at a glance, because you could never see both at once anyway.
 *
 * Registers and memory share a tab rather than getting one each: they are the
 * same question ("what does the machine hold right now"), and on a wide screen
 * .info-panels already sits them side by side.
 *
 * The vanilla CPUVisualizer owns the DOM inside #cpu-viz-container, so that
 * container is rendered unconditionally and only hidden — unmounting it would
 * pull the element out from under a class that has already bound to it.
 */

const TABS = [
  { id: 'timeline', label: 'Timeline' },
  { id: 'state', label: 'Registers & Memory' },
]

function StatePanels({ sequence, vizContainerRef }) {
  const [active, setActive] = useState('timeline')
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

  return (
    <section className="state-panels" aria-label="Machine detail">
      <div className="sp-tablist" role="tablist" aria-label="Detail view" onKeyDown={onKeyDown}>
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

      <div
        role="tabpanel"
        id="sp-panel-timeline"
        aria-labelledby="sp-tab-timeline"
        className="sp-panel"
        hidden={active !== 'timeline'}
      >
        <PipelineTimeline sequence={sequence} embedded />
      </div>

      <div
        role="tabpanel"
        id="sp-panel-state"
        aria-labelledby="sp-tab-state"
        className="sp-panel"
        hidden={active !== 'state'}
      >
        <div id="cpu-viz-container" ref={vizContainerRef}></div>
      </div>
    </section>
  )
}

export default StatePanels
