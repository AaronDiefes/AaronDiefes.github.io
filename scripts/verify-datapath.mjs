/**
 * Structural audit of the CPU datapath schematic.
 *
 * The redraw moved every node on the board, so "it looks right" is not a check.
 * These assertions are the ones that would have caught the two bugs that made
 * the diagram look broken in the first place - handles landing outside their
 * node, and geometry drifting from the CSS that renders it - plus the defects
 * the structural audit turned up.
 *
 * Run: npm run verify:datapath
 */

import { build } from 'esbuild'
import { readFileSync, unlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const SRC = new URL('../src/components/cpu/PipelineDiagram.jsx', import.meta.url).pathname
const OUT = join(tmpdir(), `datapath-audit-${process.pid}.mjs`)

/* React Flow and the stylesheet are irrelevant to the geometry; stub them so
   the module can be loaded outside a browser. */
const stub = {
  name: 'stub',
  setup(b) {
    b.onResolve({ filter: /^react$/ }, () => ({ path: 'react', namespace: 'stub' }))
    b.onResolve({ filter: /^@xyflow\/react/ }, () => ({ path: 'xyflow', namespace: 'stub' }))
    b.onResolve({ filter: /\.css$/ }, () => ({ path: 'css', namespace: 'stub' }))
    b.onResolve({ filter: /useCpuFrame/ }, () => ({ path: 'cpu', namespace: 'stub' }))
    b.onLoad({ filter: /.*/, namespace: 'stub' }, (a) => ({
      contents:
        a.path === 'xyflow'
          ? `export const ReactFlow=()=>null, ReactFlowProvider=()=>null, Background=()=>null,
             Controls=()=>null, Handle=()=>null, BaseEdge=()=>null, EdgeLabelRenderer=()=>null,
             MarkerType={ArrowClosed:'arrowclosed'}, Position={Left:'left',Right:'right',Top:'top'};
             export const useReactFlow=()=>({fitBounds(){},fitView(){}});`
          : a.path === 'cpu'
            ? `export const useCpuState=()=>null;`
            : a.path === 'react'
              ? `export const Fragment=null, useMemo=()=>null, useState=()=>[], useEffect=()=>{},
                 useRef=()=>({}), useCallback=(f)=>f;
                 export default {Fragment, useMemo, useState, useEffect, useRef, useCallback};`
              : ``,
      loader: 'js',
    }))
  },
}

await build({
  entryPoints: [SRC],
  outfile: OUT,
  bundle: true,
  format: 'esm',
  platform: 'node',
  jsx: 'transform',
  jsxFactory: 'h',
  jsxFragment: 'Frag',
  banner: { js: 'const h=()=>null, Frag=null;' },
  plugins: [stub],
  logLevel: 'silent',
})

const mod = await import(pathToFileURL(OUT).href)
unlinkSync(OUT)

const { initialNodes, initialEdges, controlEdges, icHeight, muxSize, STAGE_BOUNDS } = mod

let pass = 0
const fail = []
const ok = (cond, msg) => (cond ? pass++ : fail.push(msg))

const byId = Object.fromEntries(initialNodes.map((n) => [n.id, n]))
const allEdges = [...initialEdges, ...controlEdges]

// ---------------------------------------------------------------------------
// 1. Connectivity is the safety property: the port-level wiring was validated
//    against processor.v, so the redraw must move geometry and nothing else.
//    Deliberate exceptions are listed here rather than silently tolerated.
// ---------------------------------------------------------------------------
const INTENDED_WIRING_CHANGES = new Set([
  // The overflow and multdiv-exception paths shared one XMDATA port, so the two
  // wires rendered as a single line with two tails.
  'md-exc-xm',
  // processor.v:343 computes dx_PC_plus_one inside the branch-target block and
  // :363 feeds it to xm_data_in for jal; it is not carried by the ID/EX latch.
  // Replaces the old `idex-jal-xm`, which sourced IDEX.pc while its port claimed PC+1.
  'brtgt-jal-xm',
  'idex-jal-xm',
])

const baseline = JSON.parse(readFileSync(new URL('./datapath-wiring.json', import.meta.url), 'utf8'))
const nowWiring = Object.fromEntries(
  allEdges.map((e) => [e.id, `${e.source}.${e.sourceHandle} -> ${e.target}.${e.targetHandle}`])
)
for (const [id, wire] of Object.entries(baseline)) {
  if (INTENDED_WIRING_CHANGES.has(id)) continue
  ok(nowWiring[id] === wire, `wiring changed for ${id}: ${wire} -> ${nowWiring[id] ?? '(removed)'}`)
}
for (const id of Object.keys(nowWiring)) {
  ok(
    baseline[id] !== undefined || INTENDED_WIRING_CHANGES.has(id),
    `new edge ${id} is not in the baseline and not declared intentional`
  )
}

// ---------------------------------------------------------------------------
// 2. Every handle exists. A dangling handle makes React Flow attach the edge to
//    the node origin, which reads as a stray wire rather than as an error.
// ---------------------------------------------------------------------------
for (const e of allEdges) {
  const s = byId[e.source]
  const t = byId[e.target]
  ok(!!s, `edge ${e.id}: unknown source node ${e.source}`)
  ok(!!t, `edge ${e.id}: unknown target node ${e.target}`)
  if (!s || !t) continue
  ok(
    (s.data.outputs || []).some((p) => p.id === e.sourceHandle),
    `edge ${e.id}: ${e.source} has no output port "${e.sourceHandle}"`
  )
  ok(
    (t.data.inputs || []).some((p) => p.id === e.targetHandle),
    `edge ${e.id}: ${e.target} has no input port "${e.targetHandle}"`
  )
}

// ---------------------------------------------------------------------------
// 3. Every edge names the stage that lights it. 26 of 59 used to have no
//    data.path, so half of a live stage's wires stayed grey.
// ---------------------------------------------------------------------------
const STAGES = ['IF', 'ID', 'EX', 'MEM', 'WB']
for (const e of allEdges) {
  ok(STAGES.includes(e.data?.path), `edge ${e.id} has no valid data.path (got ${e.data?.path})`)
}

// ---------------------------------------------------------------------------
// 4. Node boxes: size is a pure function of the data, so it can be recomputed.
// ---------------------------------------------------------------------------
const box = (n) => {
  const { x, y } = n.position
  if (n.type === 'band') return { x, y, w: n.data.width, h: n.data.height }
  if (n.type === 'ic') return { x, y, w: n.data.width, h: icHeight(n.data) }
  if (n.type === 'pipereg') return { x, y, w: n.data.width, h: n.data.height }
  const m = muxSize(n.data)
  return { x, y, w: m.width, h: m.height }
}

const bands = initialNodes.filter((n) => n.type === 'band')
const chips = initialNodes.filter((n) => n.type !== 'band')

// No two chips overlap.
for (let i = 0; i < chips.length; i++) {
  for (let j = i + 1; j < chips.length; j++) {
    const a = box(chips[i])
    const b = box(chips[j])
    const hit = a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h
    ok(!hit, `${chips[i].id} overlaps ${chips[j].id}`)
  }
}

// Every stage chip sits inside its own band; every latch sits in a channel.
const bandFor = (stage) => bands.find((b) => b.data.stage === stage)
for (const c of chips) {
  const b = box(c)
  if (c.type === 'pipereg') {
    for (const band of bands) {
      const bb = box(band)
      const hit = b.x < bb.x + bb.w && bb.x < b.x + b.w
      ok(!hit, `latch ${c.id} horizontally overlaps band ${band.id}`)
    }
    continue
  }
  const band = bandFor(c.data.stage)
  ok(!!band, `${c.id} has no band for stage ${c.data.stage}`)
  if (!band) continue
  const bb = box(band)
  ok(
    b.x >= bb.x && b.x + b.w <= bb.x + bb.w && b.y >= bb.y && b.y + b.h <= bb.y + bb.h,
    `${c.id} escapes band ${band.id} (chip ${b.x},${b.y} ${b.w}x${b.h} vs band ${bb.x},${bb.y} ${bb.w}x${bb.h})`
  )
}

// ---------------------------------------------------------------------------
// 5. Port labels fit. 10.5px Monaco measures ~6.3px/char; a label is inset 8px
//    with 4px of padding either side. Opposite-side labels on the same row must
//    not collide, or the chip reads as a jumble of overlapping signal names.
// ---------------------------------------------------------------------------
const CHAR_W = 6.3
const INSET = 8 + 4 // left offset + padding
const MIN_GAP = 10
for (const c of chips.filter((n) => n.type === 'ic')) {
  const ins = c.data.inputs || []
  const outs = c.data.outputs || []
  for (let i = 0; i < Math.max(ins.length, outs.length); i++) {
    const a = ins[i] ? (ins[i].label || ins[i].id).length : 0
    const b = outs[i] ? (outs[i].label || outs[i].id).length : 0
    const need = (a ? INSET + a * CHAR_W : 0) + (b ? INSET + b * CHAR_W : 0) + (a && b ? MIN_GAP : 0)
    ok(
      need <= c.data.width,
      `${c.id} row ${i}: labels need ${Math.ceil(need)}px but the chip is ${c.data.width}px`
    )
  }
}

// ---------------------------------------------------------------------------
// 6. Feedback lanes must be inside the frame every stage is fitted to. They
//    used to sit outside STAGE_BOUNDS, so the write-back loop was clipped out of
//    four of the five focus views - including WB, where it is the whole point.
// ---------------------------------------------------------------------------
const lanes = initialEdges.filter((e) => e.type === 'feedback')
ok(lanes.length > 0, 'no feedback edges found — the lane check is vacuous')
for (const e of lanes) {
  const y = e.data.routeY
  for (const [stage, b] of Object.entries(STAGE_BOUNDS)) {
    ok(y > b.y && y < b.y + b.height, `feedback ${e.id} routeY ${y} falls outside the ${stage} frame`)
  }
}

// Lanes must not coincide, unless their x-ranges are disjoint (a shared lane is
// fine when the two wires never occupy the same span).
const span = (e) => {
  const s = box(byId[e.source])
  const t = box(byId[e.target])
  return [Math.min(s.x, t.x), Math.max(s.x + s.w, t.x + t.w)]
}
for (let i = 0; i < lanes.length; i++) {
  for (let j = i + 1; j < lanes.length; j++) {
    if (lanes[i].data.routeY !== lanes[j].data.routeY) continue
    const [a0, a1] = span(lanes[i])
    const [b0, b1] = span(lanes[j])
    ok(a1 < b0 || b1 < a0, `${lanes[i].id} and ${lanes[j].id} share lane ${lanes[i].data.routeY} and overlap`)
  }
}

// ---------------------------------------------------------------------------
// 7. The budget the redraw was for: each stage frame small enough that a focused
//    stage is readable inline. The wrapper is 640px tall in a ~680px column.
// ---------------------------------------------------------------------------
const COLUMN_W = 680
const WRAPPER_H = 640
for (const [stage, b] of Object.entries(STAGE_BOUNDS)) {
  const zoom = Math.min(COLUMN_W / b.width, WRAPPER_H / b.height)
  ok(zoom >= 0.6, `${stage} focus fits at only ${zoom.toFixed(2)} zoom (port labels would render under 6.5px)`)
}

// ---------------------------------------------------------------------------

const total = pass + fail.length
if (fail.length) {
  console.error(`\n✗ datapath audit: ${fail.length} of ${total} checks failed\n`)
  for (const f of fail) console.error(`  • ${f}`)
  console.error('')
  process.exit(1)
}
console.log(`✓ datapath audit: ${total} checks passed`)
