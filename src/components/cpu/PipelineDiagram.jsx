import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import { ReactFlow, ReactFlowProvider, useReactFlow, Background, Controls, Handle, Position, MarkerType, BaseEdge, EdgeLabelRenderer } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useCpuState } from '../../hooks/useCpuFrame'

/**
 * 5-stage pipelined RISC processor — schematic-accurate version.
 *
 * Geometry, port names, and wire connectivity are derived from
 * /Users/aaron/Aaron/CPU/CPU/processor.v (with alu.v and multdiv.v module
 * headers). Handle ids on each node match the Verilog port names, and edge
 * sourceHandle / targetHandle pairs are chosen so each wire terminates at
 * the actual port it carries data to.
 *
 * Long backward feedback wires (forwarding paths, write-back loop,
 * branch-target loop) use a custom FeedbackEdge that routes via the top or
 * bottom of the canvas, with a short horizontal stub off the port so the
 * vertical run never lies along a chip's own border.
 */

// ---------- Custom node components ----------------------------------------

function StageBandNode({ data }) {
  return (
    <div
      className={`rf-stage-band stage-${data.stage} ${data.active ? 'active' : ''}`}
      style={{ width: data.width, height: data.height }}
    >
      <div className="rf-stage-band-header">{data.name}</div>
      <div className="rf-stage-band-abbrev">({data.short})</div>
    </div>
  )
}

const IC_HEADER_H = 52
const IC_PORT_STEP = 32
const IC_PAD_BOTTOM = 22

/** Chip height is a pure function of its port count — used by the layout audit. */
const icHeight = (data) =>
  IC_HEADER_H +
  Math.max((data.inputs || []).length, (data.outputs || []).length, 1) * IC_PORT_STEP +
  IC_PAD_BOTTOM

function IcNode({ data }) {
  const stageClass = data.stage ? `stage-${data.stage}` : ''
  const variantClass = data.variant ? `variant-${data.variant}` : ''
  const inputs = data.inputs || []
  const outputs = data.outputs || []
  // Each port's vertical centre, relative to the chip's top.
  const portY = (i) => IC_HEADER_H + (i + 0.5) * IC_PORT_STEP

  return (
    <div
      className={`rf-ic ${stageClass} ${variantClass} ${data.active ? 'active' : ''}`}
      style={{ width: data.width ?? 200, height: icHeight(data) }}
    >
      <div className="rf-ic-header">
        <span className="rf-ic-title">{data.label}</span>
        {data.subtitle && <span className="rf-ic-subtitle">{data.subtitle}</span>}
      </div>

      {/* Port labels and handles are siblings of the header — both positioned
         absolutely against the chip itself so labels and handles line up. */}
      {inputs.map((p, i) => (
        <span
          key={`in-lbl-${p.id}`}
          className="rf-ic-port-label rf-ic-port-label-in"
          style={{ top: portY(i) - 8 }}
        >
          {p.label || p.id}
        </span>
      ))}
      {outputs.map((p, i) => (
        <span
          key={`out-lbl-${p.id}`}
          className="rf-ic-port-label rf-ic-port-label-out"
          style={{ top: portY(i) - 8 }}
        >
          {p.label || p.id}
        </span>
      ))}
      {inputs.map((p, i) => (
        <Handle
          key={`in-h-${p.id}`}
          type="target"
          position={Position.Left}
          id={p.id}
          style={{ top: portY(i) }}
        />
      ))}
      {outputs.map((p, i) => (
        <Handle
          key={`out-h-${p.id}`}
          type="source"
          position={Position.Right}
          id={p.id}
          style={{ top: portY(i) }}
        />
      ))}
    </div>
  )
}

/**
 * ClassicMuxNode — textbook trapezoidal MUX symbol. Data inputs on the wide
 * (left) edge, output on the narrow (right) edge, select input on top.
 *
 * Handles sit on the NODE's own edges, not on the trapezoid, and a drawn lead
 * line carries each one across to the symbol. Putting the handles inboard (at
 * left: 130) meant an incoming wire had to descend *through* the node to reach
 * its port — the two branch feedback wires ran straight down over the trapezoid
 * fill and the title text. With the handle on the boundary, a wire terminates
 * where the node terminates, which is the only place a wire can arrive cleanly.
 */
const MUX_LEAD_W = 130
const MUX_TRAPEZOID_W = 70
const MUX_RIGHT_W = 84
const MUX_IN_SPACING = 40
const MUX_TOP = 34

const muxSize = (data) => {
  const dataInputs = (data.inputs || []).filter((p) => p.id !== 'sel')
  const trapezoidHeight = Math.max(dataInputs.length * MUX_IN_SPACING + 34, 110)
  return {
    width: MUX_LEAD_W + MUX_TRAPEZOID_W + MUX_RIGHT_W,
    height: trapezoidHeight + MUX_TOP + 18,
    trapezoidHeight,
  }
}

function ClassicMuxNode({ data }) {
  const stageClass = data.stage ? `stage-${data.stage}` : ''
  const inputs = data.inputs || []
  const outputs = data.outputs || []
  const dataInputs = inputs.filter((p) => p.id !== 'sel')
  const selInput = inputs.find((p) => p.id === 'sel')

  const { width: totalWidth, height: totalHeight, trapezoidHeight } = muxSize(data)
  const narrowOffset = trapezoidHeight * 0.18
  const leftX = MUX_LEAD_W
  const rightX = MUX_LEAD_W + MUX_TRAPEZOID_W
  const selX = leftX + MUX_TRAPEZOID_W / 2

  const points = [
    [leftX, MUX_TOP],
    [rightX, MUX_TOP + narrowOffset],
    [rightX, MUX_TOP + trapezoidHeight - narrowOffset],
    [leftX, MUX_TOP + trapezoidHeight],
  ]
    .map((p) => p.join(','))
    .join(' ')

  const inY = (i) => MUX_TOP + (trapezoidHeight / (dataInputs.length + 1)) * (i + 1)
  const outY = MUX_TOP + trapezoidHeight / 2

  return (
    <div
      className={`rf-classic-mux ${stageClass} ${data.active ? 'active' : ''}`}
      style={{ width: totalWidth, height: totalHeight }}
    >
      <svg width={totalWidth} height={totalHeight} className="rf-classic-mux-svg">
        <polygon points={points} className="rf-classic-mux-polygon" />
        {/* Lead lines from the node boundary to the symbol. */}
        {dataInputs.map((p, i) => (
          <line key={`lead-${p.id}`} className="rf-classic-mux-lead" x1={0} y1={inY(i)} x2={leftX} y2={inY(i)} />
        ))}
        <line className="rf-classic-mux-lead" x1={rightX} y1={outY} x2={totalWidth} y2={outY} />
        {selInput && <line className="rf-classic-mux-lead" x1={selX} y1={0} x2={selX} y2={MUX_TOP + narrowOffset / 2} />}

        <text x={selX} y={MUX_TOP + trapezoidHeight / 2} textAnchor="middle" dominantBaseline="middle" className="rf-classic-mux-glyph">
          MUX
        </text>
        <text x={selX} y={totalHeight - 4} textAnchor="middle" className="rf-classic-mux-title">
          {data.label}
        </text>
      </svg>

      {/* Sel — handle on the node's top edge, label beside the lead line. */}
      {selInput && (
        <>
          <div className="rf-classic-mux-sel-label" style={{ top: 2, left: selX + 6 }}>
            {selInput.label}
          </div>
          <Handle type="target" position={Position.Top} id={selInput.id} style={{ left: selX, top: 0 }} />
        </>
      )}

      {/* Data inputs — handle on the node's left edge, label riding above its lead. */}
      {dataInputs.map((p, i) => (
        <React.Fragment key={p.id}>
          <div className="rf-classic-mux-in-label" style={{ top: inY(i) - 15, maxWidth: MUX_LEAD_W - 8 }}>
            {p.label}
          </div>
          <Handle type="target" position={Position.Left} id={p.id} style={{ top: inY(i), left: 0 }} />
        </React.Fragment>
      ))}

      {/* Output — handle on the node's right edge. */}
      {outputs.map((p) => (
        <React.Fragment key={p.id}>
          <div className="rf-classic-mux-out-label" style={{ top: outY - 15, left: rightX + 4 }}>
            {p.label}
          </div>
          <Handle type="source" position={Position.Right} id={p.id} style={{ top: outY, left: totalWidth }} />
        </React.Fragment>
      ))}
    </div>
  )
}

const PIPEREG_HEADER_H = 50
const PIPEREG_PAD_BOTTOM = 14

/**
 * Pipeline register — a compact latch between two stages.
 *
 * It used to be a 130×700 slab, which made it the largest object on the board
 * and forced every cross-stage wire into a 300–500px vertical run just to reach
 * a port at the far end of it. At 110×~220 the ports are grouped where the
 * wires already are, and the latch reads as a divider rather than a component.
 */
function PipelineRegisterNode({ data }) {
  const inputs = data.inputs || [{ id: 'in', label: 'in' }]
  const outputs = data.outputs || [{ id: 'out', label: 'out' }]
  const totalHeight = data.height ?? 220
  const portsAreaHeight = totalHeight - PIPEREG_HEADER_H - PIPEREG_PAD_BOTTOM

  // Distribute input ports and output ports independently across the ports
  // area so each side fills the full height, regardless of how many it has.
  const inStep = portsAreaHeight / inputs.length
  const outStep = portsAreaHeight / outputs.length
  const portY = (step, i) => PIPEREG_HEADER_H + step * (i + 0.5)

  return (
    <div
      className={`rf-pipereg ${data.active ? 'active' : ''}`}
      style={{ height: totalHeight, width: data.width ?? 110 }}
    >
      <div className="rf-pipereg-header">
        <div className="rf-pipereg-label">{data.label}</div>
        <div className="rf-pipereg-instr">{data.instruction || '—'}</div>
      </div>
      {/*
        Handles and labels are SIBLINGS, both positioned absolutely against the
        node itself. They used to be nested: an absolutely-positioned wrapper
        holding a Handle that ALSO carried its own `top`, inside a
        position:relative ports area, with a portY that already included the
        header height. Those offsets compounded, so handles landed at roughly
        double their intended y - on IF/ID the `ins` handle sat 296px BELOW the
        bottom of the register. Every cross-stage wire therefore terminated in
        empty canvas, which is what "the wires are not connected" looked like.

        One portY formula drives both the handle and its label, so they cannot
        drift apart again.
      */}
      {inputs.map((p, i) => (
        <span
          key={`in-lbl-${p.id}`}
          className="rf-pipereg-port-label rf-pipereg-port-label-in"
          style={{ top: portY(inStep, i) - 6 }}
        >
          {p.label}
        </span>
      ))}
      {outputs.map((p, i) => (
        <span
          key={`out-lbl-${p.id}`}
          className="rf-pipereg-port-label rf-pipereg-port-label-out"
          style={{ top: portY(outStep, i) - 6 }}
        >
          {p.label}
        </span>
      ))}
      {inputs.map((p, i) => (
        <Handle
          key={`in-h-${p.id}`}
          type="target"
          position={Position.Left}
          id={p.id}
          style={{ top: portY(inStep, i) }}
        />
      ))}
      {outputs.map((p, i) => (
        <Handle
          key={`out-h-${p.id}`}
          type="source"
          position={Position.Right}
          id={p.id}
          style={{ top: portY(outStep, i) }}
        />
      ))}
    </div>
  )
}

const nodeTypes = {
  band: StageBandNode,
  ic: IcNode,
  'mux-classic': ClassicMuxNode,
  pipereg: PipelineRegisterNode,
}

// ---------- Custom feedback edge ------------------------------------------

/**
 * FeedbackEdge — orthogonal route for long backward wires, out to a lane above
 * or below the board and back.
 *
 * The stub matters. Without it the path went straight up from the source
 * handle, and since a Right handle sits exactly on the node's right edge and a
 * Left handle on its left edge, every vertical ran precisely along a chip's
 * border — under an opaque chip, which paints above the edges. Four of these
 * were stacked on the same border at once. Stepping 26px clear first puts the
 * vertical in open canvas where it can actually be seen.
 */
const FEEDBACK_STUB = 26

function FeedbackEdge({ id, sourceX, sourceY, targetX, targetY, data, label, labelStyle, markerEnd, style }) {
  const routeY = data?.routeY ?? 40
  const sx = sourceX + FEEDBACK_STUB
  // A Top-position handle is entered vertically; a Left handle horizontally.
  const enterTop = !!data?.enterTop
  const tx = enterTop ? targetX : targetX - FEEDBACK_STUB

  const path = enterTop
    ? `M ${sourceX} ${sourceY} L ${sx} ${sourceY} L ${sx} ${routeY} L ${tx} ${routeY} L ${tx} ${targetY}`
    : `M ${sourceX} ${sourceY} L ${sx} ${sourceY} L ${sx} ${routeY} L ${tx} ${routeY} L ${tx} ${targetY} L ${targetX} ${targetY}`

  return (
    <>
      <BaseEdge id={id} path={path} markerEnd={markerEnd} style={style} />
      {label && (
        <EdgeLabelRenderer>
          <div
            /*
             * Sat directly on the lane with an opaque surface background, so
             * every label boxed out the wire it was labelling. It rides just
             * above the lane now, and uses a soft scrim rather than a solid
             * rectangle so the wire stays continuous underneath.
             */
            className="nodrag nopan rf-feedback-label"
            style={{
              transform: `translate(-50%, -100%) translate(${(sourceX + targetX) / 2}px, ${routeY - 4}px)`,
              ...labelStyle,
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}

const edgeTypes = {
  feedback: FeedbackEdge,
}

// ---------- Static layout --------------------------------------------------

/*
 * Canvas ~2780 × 880, down from 3300 × 1020.
 *
 * The board is laid out for the FOCUSED stage, not the overview: 22 chips with
 * 4–6 labelled ports each cannot be legible all at once in a ~680px column, and
 * chasing that produces a diagram that is bad at everything. So the overview
 * carries shape, stage colour and flow direction, and each stage is sized to be
 * readable when it is the thing on screen.
 *
 * Widths are no longer round numbers; each chip is sized to its own widest
 * in/out label pair. The old 320px ALU was about 40% air, which read as "these
 * parts are far apart" when they are adjacent in the Verilog.
 */

const BAND_TOP = 120
const BAND_HEIGHT = 660
const BAND_BOTTOM = BAND_TOP + BAND_HEIGHT   // 780
const PIPE_WIDTH = 110

// Feedback lanes, 18px apart: enough for a 10px label to ride above its own
// wire without touching the lane above it.
const LANE = {
  // Above the board: the write-back loop and the branch loop.
  wbReg: 26, wbEn: 44, wbData: 62, brTarget: 80, brSel: 98,
  // Below it: every bypass. The WM bypass is the shortest of them, so it takes
  // the shallowest lane rather than diving past the other four.
  wmBypass: 792, mxA: 810, mxB: 828, wxA: 846, wxB: 864, mdStall: 882,
}

const initialNodes = [
  /*
   * zIndex -1 puts the bands BELOW the edges. React Flow's viewport layers in a
   * fixed order - edges, then edgelabel-renderer, then nodes - so nodes paint
   * last. These bands are opaque rectangles, which meant every wire routed
   * inside a stage was drawn and then covered by its own band.
   */
  { id: 'band-if',  type: 'band', zIndex: -1, position: { x: 0,    y: BAND_TOP }, data: { stage: 'if',  name: 'INSTRUCTION FETCH',  short: 'IF',  width: 480, height: BAND_HEIGHT } },
  { id: 'band-id',  type: 'band', zIndex: -1, position: { x: 630,  y: BAND_TOP }, data: { stage: 'id',  name: 'INSTRUCTION DECODE', short: 'ID',  width: 420, height: BAND_HEIGHT } },
  { id: 'band-ex',  type: 'band', zIndex: -1, position: { x: 1200, y: BAND_TOP }, data: { stage: 'ex',  name: 'EXECUTE',            short: 'EX',  width: 760, height: BAND_HEIGHT } },
  { id: 'band-mem', type: 'band', zIndex: -1, position: { x: 2110, y: BAND_TOP }, data: { stage: 'mem', name: 'MEMORY ACCESS',      short: 'MEM', width: 260, height: BAND_HEIGHT } },
  { id: 'band-wb',  type: 'band', zIndex: -1, position: { x: 2520, y: BAND_TOP }, data: { stage: 'wb',  name: 'WRITE BACK',         short: 'WB',  width: 260, height: BAND_HEIGHT } },

  // ==== IF stage (band 0–480) ====
  { id: 'PC_MUX', type: 'mux-classic', position: { x: 30, y: 160 }, data: {
    label: 'PC Source Mux', stage: 'if',
    inputs: [
      { id: 'sel', label: 'take_branch' },
      { id: 'in0', label: 'PC+1' },
      { id: 'in1', label: 'br/jmp target' },
    ],
    outputs: [{ id: 'out', label: 'PC_In' }],
  } },
  { id: 'PC', type: 'ic', position: { x: 30, y: 370 }, data: {
    label: 'PC', subtitle: 'reg_32bit · stallable', stage: 'if', width: 200,
    inputs: [
      { id: 'writeIn', label: 'writeIn' },
      { id: 'writeEnable', label: 'wren = ~stall' },
    ],
    outputs: [{ id: 'readOut', label: 'PC_Out' }],
  } },
  { id: 'IMEM', type: 'ic', position: { x: 280, y: 370 }, data: {
    label: 'Instruction Memory', subtitle: 'ROM', variant: 'external', stage: 'if', width: 170,
    inputs: [{ id: 'address', label: 'address' }],
    outputs: [{ id: 'q', label: 'q_imem' }],
  } },
  // PC+1 ALU drops the B=1 and op=ADD ports — those are tied to constants in
  // the Verilog instance, not wires; the subtitle carries the operation.
  { id: 'PC_INC', type: 'ic', position: { x: 30, y: 580 }, data: {
    label: 'PC+1 ALU', subtitle: 'alu · A + 1 (ADD)', variant: 'alu', stage: 'if', width: 190,
    inputs: [{ id: 'A', label: 'A = PC_Out' }],
    outputs: [{ id: 'result', label: 'PC_plus_one' }],
  } },

  // ==== IF/ID pipeline register (channel 480–630) ====
  { id: 'IFID', type: 'pipereg', position: { x: 500, y: 350 }, data: {
    label: 'IF/ID', instruction: '—', height: 200, width: PIPE_WIDTH,
    inputs: [
      { id: 'in-pc',  label: 'PC' },
      { id: 'in-ins', label: 'ins' },
    ],
    outputs: [
      { id: 'pc',  label: 'PC' },
      { id: 'ins', label: 'ins' },
    ],
  } },

  // ==== ID stage (band 630–1050) ====
  { id: 'READADDR', type: 'ic', position: { x: 660, y: 230 }, data: {
    label: 'Read Address Logic', subtitle: 'combinational', variant: 'logic', stage: 'id', width: 200,
    inputs: [{ id: 'ins', label: 'fd_ins' }],
    outputs: [
      { id: 'readA', label: 'ctrl_readRegA' },
      { id: 'readB', label: 'ctrl_readRegB' },
    ],
  } },
  { id: 'REGFILE', type: 'ic', position: { x: 660, y: 460 }, data: {
    label: 'Register File', subtitle: '32 × 32-bit', variant: 'external', stage: 'id', width: 220,
    inputs: [
      { id: 'readA',       label: 'ctrl_readRegA' },
      { id: 'readB',       label: 'ctrl_readRegB' },
      { id: 'writeReg',    label: 'ctrl_writeReg' },
      { id: 'writeData',   label: 'data_writeReg' },
      { id: 'writeEnable', label: 'ctrl_writeEn' },
    ],
    outputs: [
      { id: 'dataA', label: 'data_readRegA' },
      { id: 'dataB', label: 'data_readRegB' },
    ],
  } },

  // ==== ID/EX pipeline register (channel 1050–1200) ====
  { id: 'IDEX', type: 'pipereg', position: { x: 1070, y: 325 }, data: {
    label: 'ID/EX', instruction: '—', height: 250, width: PIPE_WIDTH,
    inputs: [
      { id: 'in-pc',    label: 'PC' },
      { id: 'in-readA', label: 'readA' },
      { id: 'in-readB', label: 'readB' },
      { id: 'in-ins',   label: 'ins' },
    ],
    outputs: [
      { id: 'pc',    label: 'PC' },
      { id: 'readA', label: 'readA' },
      { id: 'readB', label: 'readB' },
      { id: 'ins',   label: 'ins' },
    ],
  } },

  // ==== EX stage (band 1200–1960, three columns) ====
  // Column A (x 1230): operand selection
  { id: 'FWDA', type: 'ic', position: { x: 1230, y: 150 }, data: {
    label: 'Fwd Mux A (3:1)', subtitle: 'forwarded_A', variant: 'mux', stage: 'ex', width: 200,
    inputs: [
      { id: 'sel',    label: 'sel = mx/wx' },
      { id: 'in_reg', label: '0 = dx_readA' },
      { id: 'in_xm',  label: '1 = xm_o (MX)' },
      { id: 'in_mw',  label: '2 = mw_data (WX)' },
    ],
    outputs: [{ id: 'out', label: 'forwarded_A' }],
  } },
  { id: 'FWDB', type: 'ic', position: { x: 1230, y: 378 }, data: {
    label: 'Fwd Mux B (3:1)', subtitle: 'forwarded_B', variant: 'mux', stage: 'ex', width: 200,
    inputs: [
      { id: 'sel',    label: 'sel = mx/wx' },
      { id: 'in_reg', label: '0 = dx_readB' },
      { id: 'in_xm',  label: '1 = xm_o (MX)' },
      { id: 'in_mw',  label: '2 = mw_data (WX)' },
    ],
    outputs: [{ id: 'out', label: 'forwarded_B' }],
  } },
  { id: 'SIGNEXT', type: 'ic', position: { x: 1230, y: 606 }, data: {
    label: 'Sign Extend', subtitle: '17 → 32 bit', variant: 'logic', stage: 'ex', width: 200,
    inputs: [{ id: 'imm17', label: 'ins[16:0]' }],
    outputs: [{ id: 'out', label: 'signext_imm' }],
  } },

  // Column B (x 1470): the functional units
  { id: 'ALU', type: 'ic', position: { x: 1470, y: 150 }, data: {
    label: 'Main ALU', subtitle: 'alu execute_alu', variant: 'alu', stage: 'ex', width: 210,
    inputs: [
      { id: 'A',     label: 'data_operandA' },
      { id: 'B',     label: 'data_operandB' },
      { id: 'op',    label: 'ctrl_ALUopcode' },
      { id: 'shamt', label: 'ctrl_shiftamt' },
    ],
    outputs: [
      { id: 'result',     label: 'data_result' },
      { id: 'isNotEqual', label: 'isNotEqual' },
      { id: 'isLessThan', label: 'isLessThan' },
      { id: 'overflow',   label: 'overflow' },
    ],
  } },
  { id: 'ALUSRC', type: 'ic', position: { x: 1470, y: 378 }, data: {
    label: 'ALU Source Mux', subtitle: 'mux_2', variant: 'mux', stage: 'ex', width: 210,
    inputs: [
      { id: 'sel', label: 'sel = is_i_type' },
      { id: 'in0', label: '0 = forwarded_B' },
      { id: 'in1', label: '1 = signext_imm' },
    ],
    outputs: [{ id: 'out', label: 'operandB' }],
  } },
  { id: 'MULTDIV', type: 'ic', position: { x: 1470, y: 574 }, data: {
    label: 'MultDiv Unit', subtitle: 'multdiv md_unit', variant: 'multdiv', stage: 'ex', width: 210,
    inputs: [
      { id: 'A',    label: 'data_operandA' },
      { id: 'B',    label: 'data_operandB' },
      { id: 'mult', label: 'ctrl_MULT' },
      { id: 'div',  label: 'ctrl_DIV' },
    ],
    outputs: [
      { id: 'result',    label: 'data_result' },
      { id: 'exception', label: 'exception' },
      { id: 'rdy',       label: 'resultRDY' },
    ],
  } },

  // Column C (x 1710): what leaves the stage
  { id: 'XMDATA', type: 'ic', position: { x: 1710, y: 150 }, data: {
    label: 'XM Data Mux', subtitle: 'select EX output', variant: 'mux', stage: 'ex', width: 220,
    inputs: [
      { id: 'sel',    label: 'sel (instr type)' },
      { id: 'alu',    label: 'alu_out' },
      { id: 'md',     label: 'multdiv_result' },
      { id: 'jal',    label: 'dx_PC+1 (jal)' },
      // The overflow and multdiv-exception paths used to share one `exc` port,
      // so the two wires rendered as a single line with two tails.
      { id: 'exc',    label: 'alu overflow' },
      { id: 'exc_md', label: 'md exception' },
    ],
    outputs: [{ id: 'out', label: 'xm_data_in' }],
  } },
  { id: 'BRTGT', type: 'ic', position: { x: 1710, y: 450 }, data: {
    label: 'Branch Target Calc', subtitle: '2× ALU + target mux', variant: 'logic', stage: 'ex', width: 210,
    inputs: [
      { id: 'pc',      label: 'dx_PC' },
      { id: 'imm',     label: 'signext_imm' },
      { id: 'opa',     label: 'data_operandA' },
      { id: 'sel_ins', label: 'ins (opcode)' },
      { id: 'ne',      label: 'not_equal' },
      { id: 'lt',      label: 'less_than' },
    ],
    outputs: [
      { id: 'target',      label: 'branch_target' },
      { id: 'take_branch', label: 'take_branch' },
      // processor.v:343 computes dx_PC_plus_one inside this block, and :363
      // feeds it to xm_data_in for jal. It is not carried by the ID/EX latch.
      { id: 'pc_plus_one', label: 'dx_PC+1' },
    ],
  } },

  // ==== EX/MEM pipeline register (channel 1960–2110) ====
  { id: 'EXMEM', type: 'pipereg', position: { x: 1980, y: 340 }, data: {
    label: 'EX/MEM', instruction: '—', height: 220, width: PIPE_WIDTH,
    inputs: [
      { id: 'in-data', label: 'xm_data' },
      { id: 'in-b',    label: 'xm_b' },
      { id: 'in-ins',  label: 'ins' },
    ],
    outputs: [
      { id: 'o',   label: 'xm_o' },
      { id: 'b',   label: 'xm_b' },
      { id: 'ins', label: 'xm_ins' },
    ],
  } },

  // ==== MEM stage (band 2110–2370) ====
  { id: 'WMFWD', type: 'ic', position: { x: 2140, y: 190 }, data: {
    label: 'WM Forward Mux', subtitle: 'mw_data → store?', variant: 'mux', stage: 'mem', width: 200,
    inputs: [
      { id: 'sel', label: 'sel = wm_fwd' },
      { id: 'in0', label: '0 = xm_b' },
      { id: 'in1', label: '1 = mw_data' },
    ],
    outputs: [{ id: 'out', label: 'to DMEM' }],
  } },
  { id: 'DMEM', type: 'ic', position: { x: 2140, y: 410 }, data: {
    label: 'Data Memory', subtitle: 'RAM (external)', variant: 'external', stage: 'mem', width: 200,
    inputs: [
      { id: 'address', label: 'address_dmem' },
      { id: 'data',    label: 'data' },
      { id: 'wren',    label: 'wren = is_sw' },
    ],
    outputs: [{ id: 'q', label: 'q_dmem' }],
  } },
  { id: 'MEMMUX', type: 'ic', position: { x: 2140, y: 600 }, data: {
    label: 'MEM Data Mux', subtitle: 'lw → memory data', variant: 'mux', stage: 'mem', width: 200,
    inputs: [
      { id: 'sel', label: 'sel = is_lw' },
      { id: 'in0', label: '0 = xm_o' },
      { id: 'in1', label: '1 = q_dmem' },
    ],
    outputs: [{ id: 'out', label: 'mw_data_in' }],
  } },

  // ==== MEM/WB pipeline register (channel 2370–2520) ====
  { id: 'MEMWB', type: 'pipereg', position: { x: 2390, y: 340 }, data: {
    label: 'MEM/WB', instruction: '—', height: 220, width: PIPE_WIDTH,
    inputs: [
      { id: 'in-data', label: 'mw_data' },
      { id: 'in-b',    label: 'xm_b' },
      { id: 'in-ins',  label: 'xm_ins' },
    ],
    outputs: [
      { id: 'data', label: 'mw_data' },
      { id: 'ins',  label: 'mw_ins' },
    ],
  } },

  // ==== WB stage (band 2520–2780) ====
  { id: 'WBLOGIC', type: 'ic', position: { x: 2550, y: 410 }, data: {
    label: 'WB Mux + Enable', subtitle: 'jal→$r31, setx→$r30, …', variant: 'logic', stage: 'wb', width: 210,
    inputs: [
      { id: 'mw_data', label: 'mw_data' },
      { id: 'mw_ins',  label: 'mw_ins' },
    ],
    outputs: [
      { id: 'writeReg',    label: 'ctrl_writeReg' },
      { id: 'writeEnable', label: 'ctrl_writeEn' },
      { id: 'writeData',   label: 'data_writeReg' },
    ],
  } },
]

// ---------- Edges ---------------------------------------------------------

/*
 * `data.path` names the stage whose occupancy lights the wire. EVERY edge now
 * carries one: 26 of 59 previously did not, so in any live stage roughly half
 * its wires stayed grey while the rest animated — which read as "those aren't
 * part of the flow" rather than "those are structural".
 */

const initialEdges = [
  // ---------- IF stage primary datapath ----------
  { id: 'pcmux-pc',    source: 'PC_MUX', sourceHandle: 'out',     target: 'PC',     targetHandle: 'writeIn',  type: 'smoothstep', className: 'rf-edge-data', data: { path: 'IF' } },
  { id: 'pc-inc',      source: 'PC',     sourceHandle: 'readOut', target: 'PC_INC', targetHandle: 'A',        type: 'smoothstep', className: 'rf-edge-data', data: { path: 'IF' } },
  { id: 'pcinc-pcmux', source: 'PC_INC', sourceHandle: 'result',  target: 'PC_MUX', targetHandle: 'in0',      type: 'smoothstep', className: 'rf-edge-data', data: { path: 'IF' } },
  { id: 'pc-imem',     source: 'PC',     sourceHandle: 'readOut', target: 'IMEM',   targetHandle: 'address',  type: 'smoothstep', className: 'rf-edge-data', data: { path: 'IF' } },
  { id: 'pc-ifid',     source: 'PC',     sourceHandle: 'readOut', target: 'IFID',   targetHandle: 'in-pc',    type: 'smoothstep', className: 'rf-edge-data', data: { path: 'IF' } },
  { id: 'imem-ifid',   source: 'IMEM',   sourceHandle: 'q',       target: 'IFID',   targetHandle: 'in-ins',   type: 'smoothstep', className: 'rf-edge-data', data: { path: 'IF' } },

  // ---------- ID stage ----------
  { id: 'ifid-rdaddr', source: 'IFID',     sourceHandle: 'ins',   target: 'READADDR', targetHandle: 'ins',   type: 'smoothstep', className: 'rf-edge-data', data: { path: 'ID' } },
  { id: 'rdaddr-rfA',  source: 'READADDR', sourceHandle: 'readA', target: 'REGFILE',  targetHandle: 'readA', type: 'smoothstep', className: 'rf-edge-control', data: { path: 'ID' } },
  { id: 'rdaddr-rfB',  source: 'READADDR', sourceHandle: 'readB', target: 'REGFILE',  targetHandle: 'readB', type: 'smoothstep', className: 'rf-edge-control', data: { path: 'ID' } },
  { id: 'rf-idex-a',   source: 'REGFILE',  sourceHandle: 'dataA', target: 'IDEX',     targetHandle: 'in-readA', type: 'smoothstep', className: 'rf-edge-data', data: { path: 'ID' } },
  { id: 'rf-idex-b',   source: 'REGFILE',  sourceHandle: 'dataB', target: 'IDEX',     targetHandle: 'in-readB', type: 'smoothstep', className: 'rf-edge-data', data: { path: 'ID' } },
  { id: 'ifid-idex-pc',  source: 'IFID', sourceHandle: 'pc',  target: 'IDEX', targetHandle: 'in-pc',  type: 'smoothstep', className: 'rf-edge-data', data: { path: 'ID' } },
  { id: 'ifid-idex-ins', source: 'IFID', sourceHandle: 'ins', target: 'IDEX', targetHandle: 'in-ins', type: 'smoothstep', className: 'rf-edge-data', data: { path: 'ID' } },

  // ---------- EX stage — primary datapath ----------
  { id: 'idex-fwda',   source: 'IDEX', sourceHandle: 'readA', target: 'FWDA',    targetHandle: 'in_reg', type: 'smoothstep', className: 'rf-edge-data', data: { path: 'EX' } },
  { id: 'idex-fwdb',   source: 'IDEX', sourceHandle: 'readB', target: 'FWDB',    targetHandle: 'in_reg', type: 'smoothstep', className: 'rf-edge-data', data: { path: 'EX' } },
  { id: 'idex-sx',     source: 'IDEX', sourceHandle: 'ins',   target: 'SIGNEXT', targetHandle: 'imm17',  type: 'smoothstep', className: 'rf-edge-data', data: { path: 'EX' } },
  { id: 'fwda-alu',    source: 'FWDA',    sourceHandle: 'out', target: 'ALU',    targetHandle: 'A',   type: 'smoothstep', className: 'rf-edge-data', data: { path: 'EX' } },
  { id: 'fwdb-alusrc', source: 'FWDB',    sourceHandle: 'out', target: 'ALUSRC', targetHandle: 'in0', type: 'smoothstep', className: 'rf-edge-data', data: { path: 'EX' } },
  { id: 'sx-alusrc',   source: 'SIGNEXT', sourceHandle: 'out', target: 'ALUSRC', targetHandle: 'in1', type: 'smoothstep', className: 'rf-edge-data', data: { path: 'EX' } },
  { id: 'alusrc-alu',  source: 'ALUSRC',  sourceHandle: 'out', target: 'ALU',    targetHandle: 'B',   type: 'smoothstep', className: 'rf-edge-data', data: { path: 'EX' } },

  // ---------- EX stage — MultDiv parallel path ----------
  { id: 'fwda-md',   source: 'FWDA',   sourceHandle: 'out', target: 'MULTDIV', targetHandle: 'A', type: 'smoothstep', className: 'rf-edge-multdiv', data: { path: 'EX' } },
  { id: 'alusrc-md', source: 'ALUSRC', sourceHandle: 'out', target: 'MULTDIV', targetHandle: 'B', type: 'smoothstep', className: 'rf-edge-multdiv', data: { path: 'EX' } },

  // ---------- EX stage — Branch target calc ----------
  { id: 'idex-brpc',   source: 'IDEX',    sourceHandle: 'pc',  target: 'BRTGT', targetHandle: 'pc',      type: 'smoothstep', className: 'rf-edge-data', data: { path: 'EX' } },
  { id: 'sx-brtgt',    source: 'SIGNEXT', sourceHandle: 'out', target: 'BRTGT', targetHandle: 'imm',     type: 'smoothstep', className: 'rf-edge-data', data: { path: 'EX' } },
  { id: 'fwda-brtgt',  source: 'FWDA',    sourceHandle: 'out', target: 'BRTGT', targetHandle: 'opa',     type: 'smoothstep', className: 'rf-edge-data', data: { path: 'EX' } },
  { id: 'idex-brsel',  source: 'IDEX',    sourceHandle: 'ins', target: 'BRTGT', targetHandle: 'sel_ins', type: 'smoothstep', className: 'rf-edge-control', data: { path: 'EX' } },

  // ---------- EX stage — XM Data Mux ----------
  { id: 'alu-xmdata', source: 'ALU',     sourceHandle: 'result', target: 'XMDATA', targetHandle: 'alu', type: 'smoothstep', className: 'rf-edge-data', data: { path: 'EX' } },
  { id: 'md-xmdata',  source: 'MULTDIV', sourceHandle: 'result', target: 'XMDATA', targetHandle: 'md',  type: 'smoothstep', className: 'rf-edge-multdiv', data: { path: 'EX' } },
  { id: 'idex-xmsel', source: 'IDEX',    sourceHandle: 'ins',    target: 'XMDATA', targetHandle: 'sel', type: 'smoothstep', className: 'rf-edge-control', data: { path: 'EX' } },

  // ---------- EX → EX/MEM ----------
  { id: 'xmdata-exmem', source: 'XMDATA', sourceHandle: 'out', target: 'EXMEM', targetHandle: 'in-data', type: 'smoothstep', className: 'rf-edge-data', data: { path: 'EX' } },
  { id: 'fwdb-exmem',   source: 'FWDB',   sourceHandle: 'out', target: 'EXMEM', targetHandle: 'in-b',    type: 'smoothstep', className: 'rf-edge-data', data: { path: 'EX' } },
  { id: 'idex-exmem',   source: 'IDEX',   sourceHandle: 'ins', target: 'EXMEM', targetHandle: 'in-ins',  type: 'smoothstep', className: 'rf-edge-data', data: { path: 'EX' } },

  // ---------- MEM stage primary datapath ----------
  { id: 'exmem-wmfwd-b', source: 'EXMEM', sourceHandle: 'b',   target: 'WMFWD',  targetHandle: 'in0',     type: 'smoothstep', className: 'rf-edge-data', data: { path: 'MEM' } },
  { id: 'wmfwd-dmem',    source: 'WMFWD', sourceHandle: 'out', target: 'DMEM',   targetHandle: 'data',    type: 'smoothstep', className: 'rf-edge-data', data: { path: 'MEM' } },
  { id: 'exmem-dmem-a',  source: 'EXMEM', sourceHandle: 'o',   target: 'DMEM',   targetHandle: 'address', type: 'smoothstep', className: 'rf-edge-data', data: { path: 'MEM' } },
  { id: 'exmem-memmux',  source: 'EXMEM', sourceHandle: 'o',   target: 'MEMMUX', targetHandle: 'in0',     type: 'smoothstep', className: 'rf-edge-data', data: { path: 'MEM' } },
  { id: 'dmem-memmux',   source: 'DMEM',  sourceHandle: 'q',   target: 'MEMMUX', targetHandle: 'in1',     type: 'smoothstep', className: 'rf-edge-data', data: { path: 'MEM' } },
  { id: 'exmem-memmuxsel', source: 'EXMEM', sourceHandle: 'ins', target: 'MEMMUX', targetHandle: 'sel',   type: 'smoothstep', className: 'rf-edge-control', data: { path: 'MEM' } },

  // ---------- MEM → MEM/WB ----------
  { id: 'memmux-memwb',   source: 'MEMMUX', sourceHandle: 'out', target: 'MEMWB', targetHandle: 'in-data', type: 'smoothstep', className: 'rf-edge-data', data: { path: 'MEM' } },
  { id: 'exmem-memwb-b',  source: 'EXMEM',  sourceHandle: 'b',   target: 'MEMWB', targetHandle: 'in-b',    type: 'smoothstep', className: 'rf-edge-data', data: { path: 'MEM' } },
  { id: 'exmem-memwb-ins', source: 'EXMEM', sourceHandle: 'ins', target: 'MEMWB', targetHandle: 'in-ins',  type: 'smoothstep', className: 'rf-edge-data', data: { path: 'MEM' } },

  // ---------- WB stage ----------
  { id: 'memwb-wb-data', source: 'MEMWB', sourceHandle: 'data', target: 'WBLOGIC', targetHandle: 'mw_data', type: 'smoothstep', className: 'rf-edge-data', data: { path: 'WB' } },
  { id: 'memwb-wb-ins',  source: 'MEMWB', sourceHandle: 'ins',  target: 'WBLOGIC', targetHandle: 'mw_ins',  type: 'smoothstep', className: 'rf-edge-data', data: { path: 'WB' } },

  // ---------- Status wires: the branch decision and the exception path ------
  // processor.v derives do_bne from not_equal and do_blt from less_than, and an
  // ALU overflow is turned into a fake setx that writes $r30. Without them the
  // branch loop was drawn with no visible cause.
  { id: 'alu-ne-brtgt', source: 'ALU', sourceHandle: 'isNotEqual', target: 'BRTGT', targetHandle: 'ne', type: 'smoothstep', className: 'rf-edge-data', data: { path: 'EX' } },
  { id: 'alu-lt-brtgt', source: 'ALU', sourceHandle: 'isLessThan', target: 'BRTGT', targetHandle: 'lt', type: 'smoothstep', className: 'rf-edge-data', data: { path: 'EX' } },
  { id: 'alu-ovf-xm',   source: 'ALU', sourceHandle: 'overflow',   target: 'XMDATA', targetHandle: 'exc',    type: 'smoothstep', className: 'rf-edge-control', data: { path: 'EX' } },
  { id: 'md-exc-xm',    source: 'MULTDIV', sourceHandle: 'exception', target: 'XMDATA', targetHandle: 'exc_md', type: 'smoothstep', className: 'rf-edge-control', data: { path: 'EX' } },
  // jal links PC+1 into $r31. processor.v:343 computes that PC+1 inside the
  // branch-target block, so it comes from BRTGT — it used to be drawn from the
  // ID/EX latch, whose port carries plain dx_PC.
  { id: 'brtgt-jal-xm', source: 'BRTGT', sourceHandle: 'pc_plus_one', target: 'XMDATA', targetHandle: 'jal', type: 'smoothstep', className: 'rf-edge-data', data: { path: 'EX' } },

  // ====== Long backward feedback wires (custom FeedbackEdge) ======
  // Forwarding feedback — out to a lane BELOW the board and back.
  { id: 'xm-fwda', type: 'feedback', source: 'EXMEM', sourceHandle: 'o',    target: 'FWDA', targetHandle: 'in_xm', className: 'rf-edge-forward', data: { routeY: LANE.mxA, path: 'EX' } },
  { id: 'xm-fwdb', type: 'feedback', source: 'EXMEM', sourceHandle: 'o',    target: 'FWDB', targetHandle: 'in_xm', className: 'rf-edge-forward', data: { routeY: LANE.mxB, path: 'EX' }, label: 'EX/MEM → Fwd Muxes (MX bypass)' },
  { id: 'mw-fwda', type: 'feedback', source: 'MEMWB', sourceHandle: 'data', target: 'FWDA', targetHandle: 'in_mw', className: 'rf-edge-forward', data: { routeY: LANE.wxA, path: 'EX' } },
  { id: 'mw-fwdb', type: 'feedback', source: 'MEMWB', sourceHandle: 'data', target: 'FWDB', targetHandle: 'in_mw', className: 'rf-edge-forward', data: { routeY: LANE.wxB, path: 'EX' }, label: 'MEM/WB → Fwd Muxes (WX bypass)' },
  { id: 'md-stall-pc', type: 'feedback', source: 'MULTDIV', sourceHandle: 'rdy', target: 'PC', targetHandle: 'writeEnable', className: 'rf-edge-forward', data: { routeY: LANE.mdStall, path: 'EX' }, label: 'multdiv stall → freeze PC' },

  // WM bypass (MEM/WB → WM Forward Mux for sw) — short hop above the board.
  { id: 'mw-wmfwd', type: 'feedback', source: 'MEMWB', sourceHandle: 'data', target: 'WMFWD', targetHandle: 'in1', className: 'rf-edge-forward', data: { routeY: LANE.wmBypass, path: 'MEM' }, label: 'WM bypass' },

  // Branch target + take_branch back to the PC Source Mux — via the TOP.
  { id: 'brtgt-pcmux', type: 'feedback', source: 'BRTGT', sourceHandle: 'target',      target: 'PC_MUX', targetHandle: 'in1', className: 'rf-edge-feedback', data: { routeY: LANE.brTarget, path: 'EX' }, label: 'branch/jump target' },
  { id: 'brtgt-sel',   type: 'feedback', source: 'BRTGT', sourceHandle: 'take_branch', target: 'PC_MUX', targetHandle: 'sel', className: 'rf-edge-feedback', data: { routeY: LANE.brSel, path: 'EX', enterTop: true } },

  // Write-back to RegFile — via the TOP.
  { id: 'wb-rf-wreg',  type: 'feedback', source: 'WBLOGIC', sourceHandle: 'writeReg',    target: 'REGFILE', targetHandle: 'writeReg',    className: 'rf-edge-feedback', data: { routeY: LANE.wbReg, path: 'WB' }, label: 'write-back' },
  { id: 'wb-rf-wen',   type: 'feedback', source: 'WBLOGIC', sourceHandle: 'writeEnable', target: 'REGFILE', targetHandle: 'writeEnable', className: 'rf-edge-feedback', data: { routeY: LANE.wbEn, path: 'WB' } },
  { id: 'wb-rf-wdata', type: 'feedback', source: 'WBLOGIC', sourceHandle: 'writeData',   target: 'REGFILE', targetHandle: 'writeData',   className: 'rf-edge-feedback', data: { routeY: LANE.wbData, path: 'WB' } },
]


/**
 * Control signals, shown only when the visitor asks for them.
 *
 * They are kept off the default view because the datapath is the story - where
 * data flows - and drawing nine more dashed wires across it obscures exactly
 * the thing a first look should see. But they are real, and leaving the ports
 * dangling was its own kind of lie.
 *
 * Note there is no Control Unit box to draw them from, and that is faithful
 * rather than lazy: processor.v has no such module. Decode is inline
 * combinational logic on the instruction bits, so each control wire is sourced
 * from the latch that actually carries those bits.
 *
 * The three forwarding selects are the honest exception. They are not decoded
 * from an instruction at all - they come from comparing destination registers
 * across latches - so they are drawn from the latch holding the candidate
 * value, labelled as the comparison they really are.
 */
const controlEdges = [
  { id: 'ctrl-aluop',   source: 'IDEX', sourceHandle: 'ins', target: 'ALU',     targetHandle: 'op',    label: 'ALUopcode', path: 'EX' },
  { id: 'ctrl-shamt',   source: 'IDEX', sourceHandle: 'ins', target: 'ALU',     targetHandle: 'shamt', label: 'shiftamt',  path: 'EX' },
  { id: 'ctrl-alusrc',  source: 'IDEX', sourceHandle: 'ins', target: 'ALUSRC',  targetHandle: 'sel',   label: 'is_i_type', path: 'EX' },
  { id: 'ctrl-mult',    source: 'IDEX', sourceHandle: 'ins', target: 'MULTDIV', targetHandle: 'mult',  label: 'is_mul',    path: 'EX' },
  { id: 'ctrl-div',     source: 'IDEX', sourceHandle: 'ins', target: 'MULTDIV', targetHandle: 'div',   label: 'is_div',    path: 'EX' },
  { id: 'ctrl-wren',    source: 'EXMEM', sourceHandle: 'ins', target: 'DMEM',   targetHandle: 'wren',  label: 'is_sw',     path: 'MEM' },
  { id: 'ctrl-fwda',    source: 'EXMEM', sourceHandle: 'ins', target: 'FWDA',   targetHandle: 'sel',   label: 'rd match (MX/WX)', path: 'EX' },
  { id: 'ctrl-fwdb',    source: 'EXMEM', sourceHandle: 'ins', target: 'FWDB',   targetHandle: 'sel',   label: 'rd match (MX/WX)', path: 'EX' },
  { id: 'ctrl-wmfwd',   source: 'MEMWB', sourceHandle: 'ins', target: 'WMFWD',  targetHandle: 'sel',   label: 'rd match (WM)',    path: 'MEM' },
].map(({ path, ...e }) => ({
  ...e,
  type: 'smoothstep',
  className: 'rf-edge-control',
  labelStyle: { fontSize: 9 },
  data: { path },
}))

// ---------- Component -----------------------------------------------------

const STAGE_ORDER = ['IF', 'ID', 'EX', 'MEM', 'WB']

/**
 * Each pipeline register holds the instruction the stage DOWNSTREAM of it is
 * working on this cycle: the IF/ID latch feeds ID, ID/EX feeds EX, and so on.
 */
const PIPEREG_FEEDS = { IFID: 'ID', IDEX: 'EX', EXMEM: 'MEM', MEMWB: 'WB' }

/**
 * Viewport bounds per stage, derived from the band nodes so they can never
 * drift from the layout.
 *
 * The vertical extent deliberately spans the WHOLE board, not just the band.
 * The feedback lanes live above and below every band, and framing a stage to
 * its band alone cut them off — in WB focus that meant losing the write-back
 * loop, which is the entire point of the stage. Sideways it takes in the
 * pipeline registers in the channels either side.
 */
const BOARD_TOP = 12
const BOARD_BOTTOM = 890

const STAGE_BOUNDS = (() => {
  const out = {}
  initialNodes
    .filter((n) => n.type === 'band')
    .forEach((n) => {
      out[n.data.short] = {
        x: n.position.x - 155,
        y: BOARD_TOP,
        width: n.data.width + 310,
        height: BOARD_BOTTOM - BOARD_TOP,
      }
    })
  return out
})()

const FOCUS_OPTIONS = ['ALL', 'IF', 'ID', 'EX', 'MEM', 'WB']

function PipelineDiagramInner() {
  // One shared subscription rather than a private window listener - see
  // useCpuFrame. The frame now describes the whole machine for one clock cycle.
  const state = useCpuState()

  /*
   * The whole board is ~2780px wide. Fitted into the demo column that lands
   * around 0.24 zoom, where the 10.5px port labels - the Verilog signal names
   * that are the point of drawing it at this level of detail - are unreadable.
   * Rather than simplify the schematic, the viewport focuses one stage at a
   * time, so the detail survives and becomes legible on demand.
   */
  const [focus, setFocus] = useState('ALL')

  /*
   * Focusing alone cannot make this readable, and it is worth being clear why:
   * the EX stage is ~1070px wide including its channels, while the demo column
   * is around 680px. Even perfectly fitted that caps out near 0.64 zoom, so the
   * 10.5px port labels still render at ~7px. The missing ingredient is not
   * framing, it is space - hence expanding to the full viewport, where EX fits
   * above 1:1 and the Verilog signal names finally read.
   */
  const [expanded, setExpanded] = useState(false)
  const [showControl, setShowControl] = useState(false)
  const wrapperRef = useRef(null)
  const { fitBounds, fitView } = useReactFlow()

  const applyFocus = useCallback(() => {
    if (focus === 'ALL') {
      fitView({ padding: 0.04, duration: 300 })
    } else if (STAGE_BOUNDS[focus]) {
      fitBounds(STAGE_BOUNDS[focus], { padding: 0.05, duration: 300 })
    }
  }, [focus, fitBounds, fitView])

  /*
   * The fit cannot happen until React Flow has an initialised instance AND a
   * measured container. Calling it earlier silently does nothing, which left
   * the board sitting at zoom 1 in its top-left corner - the default viewport -
   * looking like the diagram had simply rendered wrong.
   */
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (ready) applyFocus()
  }, [ready, applyFocus])

  /*
   * Re-apply the framing whenever the canvas changes size.
   *
   * A single requestAnimationFrame after expanding is not enough: the fit gets
   * computed against the pre-expand box, and React Flow then runs its own
   * resize fit on top, so the view ends up showing the whole board no matter
   * which stage was selected. Observing the element instead means the framing
   * is re-applied after the layout has actually settled - and it fixes window
   * resizes and the sidebar collapsing at the same time.
   */
  useEffect(() => {
    const el = wrapperRef.current
    if (!el || !ready || typeof ResizeObserver === 'undefined') return
    let timer

    /* The diagram lives in a tab. A hidden tab is display:none, so it reports
       0x0 - and fitting into that would both fail and consume the callback that
       should have re-framed the board when the tab came back. */
    const run = () => {
      const r = el.getBoundingClientRect()
      if (r.width < 10 || r.height < 10) return
      applyFocus()
    }

    const ro = new ResizeObserver(() => {
      clearTimeout(timer)
      timer = setTimeout(run, 120)
    })
    ro.observe(el)
    return () => {
      ro.disconnect()
      clearTimeout(timer)
    }
  }, [applyFocus, ready])

  // Escape leaves the expanded view, per the usual dialog affordance.
  useEffect(() => {
    if (!expanded) return
    const onKey = (e) => { if (e.key === 'Escape') setExpanded(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [expanded])

  /**
   * Which stages hold a real instruction right now. This used to collapse to a
   * single "active stage" by taking the last match in IF..WB order, which was
   * correct only while the simulator ran one instruction at a time. Against a
   * real pipeline that logic reports WB and nothing else, so the diagram would
   * look broken rather than busy.
   */
  const occupied = useMemo(() => {
    if (!state) return {}
    const out = {}
    for (const s of STAGE_ORDER) {
      const slot = state.stages ? state.stages[s] : null
      const legacy = state.pipeline ? state.pipeline[s] : null
      out[s] = slot ? !slot.bubble : !!(legacy && legacy.active)
    }
    return out
  }, [state])

  /**
   * Is this chip doing work this cycle?
   *
   * Being in an occupied stage is the baseline, but a few units are only
   * involved for particular instructions, and lighting them unconditionally
   * would teach the wrong thing - it would suggest every instruction runs the
   * multiplier, or touches data memory.
   */
  const chipIsActive = (node) => {
    const stage = node.data.stage
    if (!stage) return false
    const S = stage.toUpperCase()
    if (!occupied[S]) return false

    const slot = state && state.stages ? state.stages[S] : null
    if (!slot) return false

    if (node.id === 'MULTDIV') return slot.mnemonic === 'MUL' || slot.mnemonic === 'DIV'
    if (node.id === 'DMEM') return !!(slot.memRead || slot.memWrite)
    return true
  }

  const nodes = useMemo(() => {
    return initialNodes.map((n) => {
      const next = { ...n, data: { ...n.data } }

      if (n.type === 'band') {
        const stage = n.id.replace('band-', '').toUpperCase()
        next.data.active = !!occupied[stage]
      } else if (n.type === 'pipereg') {
        // Each latch shows its OWN occupant. Previously all four echoed the
        // mnemonic from IF, which was only ever right because nothing else was
        // in flight.
        const feeds = PIPEREG_FEEDS[n.id]
        const slot = state && state.stages ? state.stages[feeds] : null
        const holds = slot && !slot.bubble && slot.mnemonic
        next.data.instruction = holds ? slot.mnemonic : '—'
        next.data.active = !!holds
      } else {
        // .rf-ic.active / .rf-classic-mux.active have existed in the stylesheet
        // all along and nothing ever set them, so individual chips never lit up.
        next.data.active = chipIsActive(n)
      }
      return next
    })
  }, [occupied, state])

  const edges = useMemo(() => {
    const base = showControl ? [...initialEdges, ...controlEdges] : initialEdges
    return base.map((e) => {
      const live = e.data?.path && occupied[e.data.path]
      /*
       * `rf-edge-dim` rather than opacity on a wrapper: during stage focus the
       * chips drop to 0.18 but the wires had no dimming rule at all, so a
       * focused stage read as a wire nest laid over ghosts. Tagging the edge
       * lets the stylesheet fade everything that is not in the focused stage.
       */
      const inFocus = focus === 'ALL' || e.data?.path === focus
      const cls = `${e.className || ''}${inFocus ? '' : ' rf-edge-dim'}`
      return live ? { ...e, className: cls, animated: true } : { ...e, className: cls }
    })
  }, [occupied, showControl, focus])

  return (
    <section className={`rf-cpu-panel${expanded ? ' is-expanded' : ''}`} aria-label="Datapath">
      <header className="rf-panel-head">
        <h3 className="rf-panel-title">Datapath</h3>
        <div className="rf-focus" role="group" aria-label="Zoom to a pipeline stage">
          {FOCUS_OPTIONS.map((f) => (
            <button
              key={f}
              type="button"
              className={`rf-focus-btn${focus === f ? ' is-on' : ''}`}
              aria-pressed={focus === f}
              onClick={() => setFocus(f)}
            >
              {f === 'ALL' ? 'Whole datapath' : f}
            </button>
          ))}
          <button
            type="button"
            className={`rf-focus-btn${showControl ? ' is-on' : ''}`}
            aria-pressed={showControl}
            onClick={() => setShowControl((v) => !v)}
            title="Show the control signals decoded from each instruction"
          >
            Control
          </button>
          <button
            type="button"
            className="rf-focus-btn rf-expand-btn"
            aria-pressed={expanded}
            onClick={() => setExpanded((v) => !v)}
            title={expanded ? 'Close (Esc)' : 'Fill the window so the port labels are readable'}
          >
            {expanded ? 'Close' : 'Expand'}
          </button>
        </div>
      </header>

      {/* data-focus drives the dimming; see pipeline-flow.css. */}
      <div ref={wrapperRef} className="rf-cpu-wrapper" data-focus={focus === 'ALL' ? undefined : focus.toLowerCase()}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          /*
           * Deliberately NOT using the `fitView` prop. React Flow re-runs its
           * own fit whenever the container resizes, which raced our stage
           * framing and always won - select EX, expand, and you would be handed
           * the whole board again. The initial fit is done here instead, so
           * there is exactly one thing deciding the viewport.
           */
          onInit={() => setReady(true)}
          /* 0.2 was too high a floor for the whole-datapath view in a narrow
             column - the fit would clamp and clip the board. */
          minZoom={0.1}
          maxZoom={2}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: true }}
          defaultEdgeOptions={{
            type: 'smoothstep',
            markerEnd: { type: MarkerType.ArrowClosed, width: 10, height: 10 },
          }}
        >
          <Background gap={24} size={1} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>

      {/* Nothing previously explained what solid vs dashed vs orange meant. */}
      <footer className="rf-legend">
        <span className="rf-legend-item"><i className="rf-swatch is-data" />data</span>
        <span className="rf-legend-item"><i className="rf-swatch is-control" />control</span>
        <span className="rf-legend-item"><i className="rf-swatch is-forward" />forwarding</span>
        <span className="rf-legend-item"><i className="rf-swatch is-feedback" />feedback</span>
        <span className="rf-legend-item"><i className="rf-swatch is-live" />carrying data now</span>
        <span className="rf-legend-item rf-legend-note">dashed outline = external module</span>
      </footer>
    </section>
  )
}

/**
 * useReactFlow (used for the stage focus) only works inside a provider, and the
 * provider has to sit ABOVE the component that calls it - hence the split.
 */
function PipelineDiagram() {
  return (
    <ReactFlowProvider>
      <PipelineDiagramInner />
    </ReactFlowProvider>
  )
}

export default PipelineDiagram
export { initialNodes, initialEdges, controlEdges, icHeight, muxSize, STAGE_BOUNDS }
