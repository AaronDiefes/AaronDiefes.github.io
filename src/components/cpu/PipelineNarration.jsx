import React from 'react'
import { useCpuState } from '../../hooks/useCpuFrame'

/**
 * Plain-English account of what every stage is doing this cycle.
 *
 * This replaces two things that each assumed a single instruction: the vanilla
 * caption strip, which described one active stage per cycle, and the "Current
 * Instruction" panel, which named one instruction as current. Neither question
 * has an answer once five instructions are in flight - so instead of choosing
 * one, this answers it for all five, and then explains the hazards, which is
 * the part a reader most needs help with and which nothing on the page has ever
 * mentioned.
 */

const STAGES = [
  { key: 'IF', label: 'Fetch' },
  { key: 'ID', label: 'Decode' },
  { key: 'EX', label: 'Execute' },
  { key: 'MEM', label: 'Memory' },
  { key: 'WB', label: 'Write back' },
]

const reg = (n) => `$${n}`

/** One sentence describing what this stage is doing to this instruction. */
function describe(stageKey, slot) {
  if (!slot || slot.bubble) return null
  const m = slot.mnemonic

  switch (stageKey) {
    case 'IF':
      return <>Fetching <code>{slot.instruction?.text || m}</code> from instruction memory at PC {slot.pc}.</>

    case 'ID': {
      // Both read ports can name the same register (add $4, $3, $3), and
      // "reading $3 = 0, $3 = 0" reads like a bug rather than a fact.
      const parts = []
      if (slot.rs != null && slot.rs !== 0) parts.push(`${reg(slot.rs)} = ${slot.rsVal}`)
      if (slot.rt != null && slot.rt !== 0 && slot.rt !== slot.rs) parts.push(`${reg(slot.rt)} = ${slot.rtVal}`)
      return (
        <>
          Decoding <code>{m}</code>
          {parts.length > 0 ? <>. Reading {parts.join(', ')}.</> : '.'}
        </>
      )
    }

    case 'EX': {
      const fwd = []
      if (slot.fwdA) fwd.push(`operand A from ${slot.fwdA === 'EXMEM' ? 'EX/MEM' : 'MEM/WB'}`)
      if (slot.fwdB) fwd.push(`operand B from ${slot.fwdB === 'EXMEM' ? 'EX/MEM' : 'MEM/WB'}`)

      let main
      if (slot.branchTaken) {
        main = <>Branch resolved: <strong>taken</strong>, jumping to {slot.branchTarget}.</>
      } else if (m === 'BNE' || m === 'BLT') {
        main = <>Branch resolved: <strong>not taken</strong>, carrying on.</>
      } else if (m === 'MUL' || m === 'DIV') {
        main = <>Multiplier working on <code>{m}</code>.</>
      } else if (m === 'LW' || m === 'SW') {
        main = <>Computing the memory address: {slot.aluResult}.</>
      } else {
        main = <>ALU computes {slot.aluResult}.</>
      }

      return (
        <>
          {main}
          {fwd.length > 0 && <> Bypassing {fwd.join(' and ')} rather than reading the register file.</>}
        </>
      )
    }

    case 'MEM':
      if (slot.memRead) return <>Loading {slot.memData} from data memory at address {slot.address}.</>
      if (slot.memWrite) return <>Storing to data memory at address {slot.address}.</>
      return <>Nothing to do in memory — passing straight through.</>

    case 'WB':
      if (slot.regWrite && slot.writeReg !== 0) {
        return <>Writing {slot.writeData} into {reg(slot.writeReg)}.</>
      }
      return <>No register write — this instruction produces no result.</>

    default:
      return null
  }
}

/** The hazard events, explained rather than merely flagged. */
function explainEvent(e, i) {
  if (e.kind === 'stall' && e.reason === 'load-use') {
    return (
      <li key={i} className="narr-event is-stall">
        <strong>Stalled.</strong> The load has not reached Memory yet, so {reg(e.reg)} does not exist
        in time for the instruction behind it. No bypass can fix this one — a bubble is inserted and
        the value is forwarded a cycle later.
      </li>
    )
  }
  if (e.kind === 'stall' && e.reason === 'multdiv') {
    return (
      <li key={i} className="narr-event is-stall">
        <strong>Stalled.</strong> The multiplier needs {e.remaining} more cycles. Fetch and Decode
        are frozen and Execute feeds bubbles forward until it finishes.
      </li>
    )
  }
  if (e.kind === 'flush') {
    return (
      <li key={i} className="narr-event is-flush">
        <strong>Flushed.</strong> The branch resolved in Execute, so the {e.killed.length}{' '}
        instruction{e.killed.length === 1 ? '' : 's'} already fetched behind it were on the wrong
        path and have been discarded.
      </li>
    )
  }
  if (e.kind === 'forward' && e.active !== false) {
    const from = e.from === 'EXMEM' ? 'EX/MEM' : 'MEM/WB'
    return (
      <li key={i} className="narr-event is-forward">
        <strong>Bypassed.</strong> {reg(e.reg)} = {e.value} taken straight from {from} — the register
        file still holds the old value.
      </li>
    )
  }
  return null
}

function PipelineNarration() {
  const state = useCpuState()

  if (!state) {
    return (
      <section className="pipeline-narration" aria-label="What is happening this cycle">
        <header className="narr-head"><h3 className="narr-title">This Cycle</h3></header>
        <p className="narr-empty">Press Play or Step to begin execution.</p>
      </section>
    )
  }

  const events = (state.events || []).map(explainEvent).filter(Boolean)

  return (
    <section className="pipeline-narration" aria-label="What is happening this cycle" aria-live="polite">
      <header className="narr-head">
        <h3 className="narr-title">This Cycle</h3>
        <span className="narr-cycle">Cycle {state.cycle}</span>
      </header>

      <ol className="narr-stages">
        {STAGES.map(({ key, label }) => {
          const slot = state.stages ? state.stages[key] : null
          const idle = !slot || slot.bubble
          return (
            <li key={key} className={`narr-stage stage-${key.toLowerCase()}${idle ? ' is-idle' : ''}`}>
              <span className="narr-badge">{key}</span>
              <span className="narr-stage-label">{label}</span>
              <span className="narr-text">
                {idle ? <em>empty</em> : describe(key, slot)}
              </span>
            </li>
          )
        })}
      </ol>

      {events.length > 0 && <ul className="narr-events">{events}</ul>}
    </section>
  )
}

export default PipelineNarration
