import React, { useMemo, useRef, useEffect } from 'react'
import { useCpuFrame } from '../../hooks/useCpuFrame'

/**
 * The pipeline occupancy grid: rows are instructions, columns are clock cycles,
 * and each cell says which stage that instruction was in on that cycle.
 *
 * This is the view that makes a pipeline legible. The datapath answers "where is
 * the data flowing", but only a cycle grid answers "how are five instructions
 * overlapping, and what did that stall actually cost". The documentation already
 * teaches with exactly this diagram - CpuPipelinePage has a static 3x7 table and
 * CpuHazardsPage a hand-written grid with stall and conflict markers - so this
 * deliberately reuses that visual vocabulary rather than inventing a new one.
 * Reading the docs and then watching the demo should feel like the same idea.
 *
 * WHY A WINDOW RATHER THAN THE WHOLE RUN
 *
 * Rows are instruction *issues*, not source lines, so a loop multiplies them:
 * Fibonacci issues 60 instructions over 78 cycles. Rendering all of that is both
 * unreadable and beside the point - what matters is the neighbourhood of the
 * current cycle, which is where the overlapping happens. So the grid shows a
 * sliding window and follows the playhead.
 */

const STAGES = ['IF', 'ID', 'EX', 'MEM', 'WB']

// Cycles shown behind and ahead of the playhead. Enough to see an instruction's
// whole five-stage journey plus the neighbours it overlaps with.
const WINDOW_BEHIND = 5
const WINDOW_AHEAD = 12

function buildRows(frames) {
  /** instrId -> { instrId, label, pc, cells: Map<cycle, stage> } */
  const rows = new Map()

  frames.forEach((frame, cycle) => {
    for (const stage of STAGES) {
      const slot = frame.stages && frame.stages[stage]
      if (!slot || slot.bubble || slot.instrId == null) continue

      if (!rows.has(slot.instrId)) {
        rows.set(slot.instrId, {
          instrId: slot.instrId,
          pc: slot.pc,
          label: (slot.instruction && slot.instruction.text) || slot.mnemonic || '—',
          cells: new Map(),
        })
      }
      // An instruction can sit in one stage for several cycles (a stall). The
      // first cycle is the real occupancy; later ones are the stall showing.
      const row = rows.get(slot.instrId)
      if (!row.cells.has(cycle)) row.cells.set(cycle, stage)
    }
  })

  return [...rows.values()].sort((a, b) => a.instrId - b.instrId)
}

/** Instructions the pipeline threw away, so the grid can show them as discarded. */
function buildFlushed(frames) {
  const killed = new Set()
  frames.forEach((frame) => {
    (frame.events || []).forEach((e) => {
      if (e.kind === 'flush') (e.killed || []).forEach((id) => killed.add(id))
    })
  })
  return killed
}

/** cycle -> the stall event active on it, so a repeated cell can say WHY. */
function buildStalls(frames) {
  const byCycle = new Map()
  frames.forEach((frame, cycle) => {
    const stall = (frame.events || []).find((e) => e.kind === 'stall')
    if (stall) byCycle.set(cycle, stall)
  })
  return byCycle
}

function PipelineTimeline({ sequence }) {
  const detail = useCpuFrame()
  const currentCycle = detail ? detail.index : 0
  const scrollerRef = useRef(null)

  const frames = sequence && sequence.frames ? sequence.frames : null

  const { rows, flushed, stalls } = useMemo(() => {
    if (!frames) return { rows: [], flushed: new Set(), stalls: new Map() }
    return {
      rows: buildRows(frames),
      flushed: buildFlushed(frames),
      stalls: buildStalls(frames),
    }
  }, [frames])

  // The visible slice of cycles, clamped to the run.
  const total = frames ? frames.length : 0
  const from = Math.max(0, Math.min(currentCycle - WINDOW_BEHIND, Math.max(0, total - (WINDOW_BEHIND + WINDOW_AHEAD))))
  const to = Math.min(total - 1, from + WINDOW_BEHIND + WINDOW_AHEAD)
  const cycles = []
  for (let c = from; c <= to; c++) cycles.push(c)

  // Only rows with something to show in this window.
  const visibleRows = useMemo(
    () => rows.filter((r) => [...r.cells.keys()].some((c) => c >= from && c <= to)),
    [rows, from, to]
  )

  // Keep the playhead in view when the window itself does not move (short runs).
  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const marker = el.querySelector('[data-current="true"]')
    if (marker) marker.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, [currentCycle])

  if (!frames || rows.length === 0) {
    return (
      <section className="pipeline-timeline" aria-label="Pipeline occupancy over time">
        <header className="ptl-head">
          <h3 className="ptl-title">Pipeline Timeline</h3>
        </header>
        <p className="ptl-empty">Choose a program to see instructions move through the stages.</p>
      </section>
    )
  }

  const activeNow = STAGES.filter((s) => {
    const f = frames[currentCycle]
    return f && f.stages && f.stages[s] && !f.stages[s].bubble
  }).length

  const stallNow = stalls.get(currentCycle)

  return (
    <section className="pipeline-timeline" aria-label="Pipeline occupancy over time">
      <header className="ptl-head">
        <h3 className="ptl-title">Pipeline Timeline</h3>
        <p className="ptl-meta">
          <span className="ptl-cycle">Cycle {currentCycle}</span>
          <span className="ptl-sep">·</span>
          <span>{activeNow} of 5 stages busy</span>
          {stallNow && (
            <>
              <span className="ptl-sep">·</span>
              <span className="ptl-stall-note">
                {stallNow.reason === 'load-use' ? 'stalled: waiting on a load' : 'stalled: multiply in progress'}
              </span>
            </>
          )}
        </p>
      </header>

      <div className="ptl-scroller" ref={scrollerRef}>
        <table className="ptl-grid">
          <thead>
            <tr>
              <th scope="col" className="ptl-corner">Instruction</th>
              {cycles.map((c) => (
                <th
                  key={c}
                  scope="col"
                  className={`ptl-cyc${c === currentCycle ? ' is-current' : ''}`}
                  data-current={c === currentCycle ? 'true' : undefined}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((row) => {
              const wasFlushed = flushed.has(row.instrId)
              return (
                <tr key={row.instrId} className={wasFlushed ? 'ptl-row is-flushed' : 'ptl-row'}>
                  <th scope="row" className="ptl-label" title={wasFlushed ? 'Discarded - fetched on the wrong side of a branch' : undefined}>
                    <span className="ptl-label-text">{row.label}</span>
                    {wasFlushed && <span className="ptl-flag">flushed</span>}
                  </th>

                  {cycles.map((c) => {
                    const stage = row.cells.get(c)
                    const prevStage = row.cells.get(c - 1)
                    // Same stage two cycles running means the instruction did not
                    // advance - that is a stall, and it is the thing to show.
                    const isStalled = !!stage && stage === prevStage
                    const cls = [
                      'ptl-cell',
                      stage ? `stage-${stage.toLowerCase()}` : 'is-empty',
                      isStalled ? 'is-stalled' : '',
                      c === currentCycle ? 'is-current' : '',
                    ].filter(Boolean).join(' ')

                    return (
                      <td key={c} className={cls}>
                        {stage ? (isStalled ? '••' : stage) : ''}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <footer className="ptl-legend">
        {STAGES.map((s) => (
          <span key={s} className={`ptl-key stage-${s.toLowerCase()}`}>{s}</span>
        ))}
        <span className="ptl-key is-stalled">•• stalled</span>
        <span className="ptl-key is-flushed">flushed</span>
      </footer>
    </section>
  )
}

export default PipelineTimeline
