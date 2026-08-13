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
 * bottom of the canvas with a configurable routeY, so they don't cut
 * through node bodies.
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

function IcNode({ data }) {
  const stageClass = data.stage ? `stage-${data.stage}` : ''
  const variantClass = data.variant ? `variant-${data.variant}` : ''
  const inputs = data.inputs || []
  const outputs = data.outputs || []
  const PORT_STEP = 32
  const HEADER_H = 52
  const PAD_BOTTOM = 22
  const numPorts = Math.max(inputs.length, outputs.length, 1)
  const chipHeight = HEADER_H + numPorts * PORT_STEP + PAD_BOTTOM
  // Each port's vertical centre, relative to the chip's top.
  const portY = (i) => HEADER_H + (i + 0.5) * PORT_STEP

  return (
    <div
      className={`rf-ic ${stageClass} ${variantClass} ${data.active ? 'active' : ''}`}
      style={{ width: data.width ?? 260, height: chipHeight }}
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
 * Pipeline register chip — partitioned-width input port column on the left,
 * output port column on the right. Each input port matches one partition of
 * the latch's writeIn vector (e.g., IF/ID takes {PC, instruction}; EX/MEM
 * takes {xm_data, xm_b, xm_ins}).
 */
/**
 * ClassicMuxNode — textbook trapezoidal MUX symbol. Data inputs on the wide
 * (left) edge, output on the narrow (right) edge, select input on top. Used
 * for muxes where the schematic-style shape adds clarity over a labeled
 * rectangle. Input port ids: any non-'sel' id is treated as a data input.
 */
function ClassicMuxNode({ data }) {
  const stageClass = data.stage ? `stage-${data.stage}` : ''
  const inputs = data.inputs || []
  const outputs = data.outputs || []
  const dataInputs = inputs.filter((p) => p.id !== 'sel')
  const selInput = inputs.find((p) => p.id === 'sel')

  const LEFT_LABEL_W = 130
  const TRAPEZOID_W = 70
  const RIGHT_LABEL_W = 90
  const totalWidth = LEFT_LABEL_W + TRAPEZOID_W + RIGHT_LABEL_W
  const inputSpacing = 38
  const trapezoidHeight = Math.max(dataInputs.length * inputSpacing + 30, 110)
  const trapezoidTop = 32
  const totalHeight = trapezoidHeight + trapezoidTop + 18
  const narrowOffset = trapezoidHeight * 0.18
  const trapezoidLeftX = LEFT_LABEL_W
  const trapezoidRightX = LEFT_LABEL_W + TRAPEZOID_W

  const points = [
    [trapezoidLeftX, trapezoidTop],
    [trapezoidRightX, trapezoidTop + narrowOffset],
    [trapezoidRightX, trapezoidTop + trapezoidHeight - narrowOffset],
    [trapezoidLeftX, trapezoidTop + trapezoidHeight],
  ]
    .map((p) => p.join(','))
    .join(' ')

  return (
    <div
      className={`rf-classic-mux ${stageClass} ${data.active ? 'active' : ''}`}
      style={{ width: totalWidth, height: totalHeight }}
    >
      <svg width={totalWidth} height={totalHeight} className="rf-classic-mux-svg">
        <polygon points={points} className="rf-classic-mux-polygon" />
        <text
          x={trapezoidLeftX + TRAPEZOID_W / 2}
          y={trapezoidTop + trapezoidHeight / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="rf-classic-mux-glyph"
        >
          MUX
        </text>
        <text
          x={trapezoidLeftX + TRAPEZOID_W / 2}
          y={14}
          textAnchor="middle"
          className="rf-classic-mux-title"
        >
          {data.label}
        </text>
      </svg>

      {/* Sel input (top edge of trapezoid) */}
      {selInput && (
        <>
          <div
            className="rf-classic-mux-sel-label"
            style={{ top: trapezoidTop - 14, left: trapezoidRightX + 6 }}
          >
            {selInput.label}
          </div>
          <Handle
            type="target"
            position={Position.Top}
            id={selInput.id}
            style={{ left: trapezoidLeftX + TRAPEZOID_W / 2, top: trapezoidTop }}
          />
        </>
      )}

      {/* Data inputs (left edge) */}
      {dataInputs.map((p, i) => {
        const portY = trapezoidTop + (trapezoidHeight / (dataInputs.length + 1)) * (i + 1)
        return (
          <React.Fragment key={p.id}>
            <div
              className="rf-classic-mux-in-label"
              style={{ top: portY - 8, width: LEFT_LABEL_W - 8 }}
            >
              {p.label}
            </div>
            <Handle
              type="target"
              position={Position.Left}
              id={p.id}
              style={{ top: portY, left: trapezoidLeftX }}
            />
          </React.Fragment>
        )
      })}

      {/* Output (right edge) */}
      {outputs.map((p) => {
        const portY = trapezoidTop + trapezoidHeight / 2
        return (
          <React.Fragment key={p.id}>
            <div
              className="rf-classic-mux-out-label"
              style={{ top: portY - 8, left: trapezoidRightX + 4 }}
            >
              {p.label}
            </div>
            <Handle
              type="source"
              position={Position.Right}
              id={p.id}
              style={{ top: portY, left: trapezoidRightX }}
            />
          </React.Fragment>
        )
      })}
    </div>
  )
}

function PipelineRegisterNode({ data }) {
  const inputs = data.inputs || [{ id: 'in', label: 'in' }]
  const outputs = data.outputs || [{ id: 'out', label: 'out' }]
  const headerHeight = 56
  const padBottom = 20
  const totalHeight = data.height ?? 640
  const portsAreaHeight = totalHeight - headerHeight - padBottom

  // Distribute input ports and output ports independently across the ports
  // area so each side fills the full height of the pipereg, regardless of
  // how many ports it has.
  const inStep  = portsAreaHeight / inputs.length
  const outStep = portsAreaHeight / outputs.length
  const portY = (step, i) => headerHeight + step * (i + 0.5)

  return (
    <div
      className={`rf-pipereg ${data.active ? 'active' : ''}`}
      style={{ height: totalHeight, width: data.width ?? 130 }}
    >
      <div className="rf-pipereg-header">
        <div className="rf-pipereg-label">{data.label}</div>
        <div className="rf-pipereg-instr">{data.instruction || '—'}</div>
      </div>
      <div className="rf-pipereg-ports">
        {inputs.map((p, i) => (
          <div
            key={`in-${p.id}`}
            className="rf-pipereg-port rf-pipereg-port-in"
            style={{ top: portY(inStep, i) - 7 }}
          >
            <Handle type="target" position={Position.Left} id={p.id} style={{ top: portY(inStep, i) }} />
            <span className="rf-pipereg-port-label">{p.label}</span>
          </div>
        ))}
        {outputs.map((p, i) => (
          <div
            key={`out-${p.id}`}
            className="rf-pipereg-port rf-pipereg-port-out"
            style={{ top: portY(outStep, i) - 7 }}
          >
            <span className="rf-pipereg-port-label">{p.label}</span>
            <Handle type="source" position={Position.Right} id={p.id} style={{ top: portY(outStep, i) }} />
          </div>
        ))}
      </div>
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
 * FeedbackEdge — orthogonal 4-segment route for long backward wires.
 * Path: source → vertical to routeY → horizontal across canvas → vertical
 * to target. Each feedback wire gets a unique routeY so they don't overlap.
 */
function FeedbackEdge({ id, sourceX, sourceY, targetX, targetY, data, label, labelStyle, markerEnd, style }) {
  const routeY = data?.routeY ?? 40
  const path = `M ${sourceX} ${sourceY} L ${sourceX} ${routeY} L ${targetX} ${routeY} L ${targetX} ${targetY}`
  return (
    <>
      <BaseEdge id={id} path={path} markerEnd={markerEnd} style={style} />
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${(sourceX + targetX) / 2}px, ${routeY - 8}px)`,
              fontSize: 10,
              fontFamily: 'Monaco, Menlo, monospace',
              color: 'var(--color-text-muted)',
              background: 'var(--color-surface)',
              padding: '0 4px',
              pointerEvents: 'none',
              ...labelStyle,
            }}
            className="nodrag nopan"
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

// Canvas: ~3300 × 1020. Five stage bands separated by 180-wide channels that
// contain only the pipeline-register pill. Chips widened so every port label
// fits within the chip body without colliding with the opposite-side labels.

const BAND_TOP = 110
const BAND_HEIGHT = 810
const PIPE_HEIGHT = 700
const PIPE_TOP = 165
const PIPE_WIDTH = 130

const initialNodes = [
  // ---- Stage band backgrounds (wider; channels between them are 180 px) ----
  { id: 'band-if',  type: 'band', position: { x: 0,    y: BAND_TOP }, data: { stage: 'if',  name: 'INSTRUCTION FETCH',  short: 'IF',  width: 480,  height: BAND_HEIGHT } },
  { id: 'band-id',  type: 'band', position: { x: 660,  y: BAND_TOP }, data: { stage: 'id',  name: 'INSTRUCTION DECODE', short: 'ID',  width: 380,  height: BAND_HEIGHT } },
  { id: 'band-ex',  type: 'band', position: { x: 1220, y: BAND_TOP }, data: { stage: 'ex',  name: 'EXECUTE',            short: 'EX',  width: 1080, height: BAND_HEIGHT } },
  { id: 'band-mem', type: 'band', position: { x: 2480, y: BAND_TOP }, data: { stage: 'mem', name: 'MEMORY ACCESS',      short: 'MEM', width: 320,  height: BAND_HEIGHT } },
  { id: 'band-wb',  type: 'band', position: { x: 2980, y: BAND_TOP }, data: { stage: 'wb',  name: 'WRITE BACK',         short: 'WB',  width: 320,  height: BAND_HEIGHT } },

  // ==== IF stage (band 0–480) ====
  // PC_MUX uses the classic trapezoidal MUX symbol; selects between PC+1
  // (default) and the branch/jump target.
  { id: 'PC_MUX', type: 'mux-classic', position: { x: 30, y: 200 }, data: {
    label: 'PC Source Mux', stage: 'if',
    inputs: [
      { id: 'sel', label: 'sel = take_branch' },
      { id: 'in0', label: 'PC+1' },
      { id: 'in1', label: 'br/jmp target' },
    ],
    outputs: [{ id: 'out', label: 'PC_In' }],
  } },
  // PC drops the writeEnable port from the diagram (writeEnable = ~any_stall,
  // sourced from stall logic in EX — covered by docs, not drawn here).
  { id: 'PC', type: 'ic', position: { x: 30, y: 440 }, data: {
    label: 'PC', subtitle: 'reg_32bit · stallable', stage: 'if', width: 240,
    inputs: [
      { id: 'writeIn', label: 'writeIn' },
      { id: 'writeEnable', label: 'writeEnable = ~stall' },
    ],
    outputs: [{ id: 'readOut', label: 'PC_Out' }],
  } },
  { id: 'IMEM', type: 'ic', position: { x: 310, y: 440 }, data: {
    label: 'Instruction Memory', subtitle: 'ROM', variant: 'external', stage: 'if', width: 160,
    inputs: [{ id: 'address', label: 'address' }],
    outputs: [{ id: 'q', label: 'q_imem' }],
  } },
  // PC+1 ALU drops the B=1 and op=ADD ports — those are tied to constants
  // in the Verilog instance, not wires; subtitle calls out the operation.
  { id: 'PC_INC', type: 'ic', position: { x: 30, y: 680 }, data: {
    label: 'PC+1 ALU', subtitle: 'alu · A + 1 (ADD)', variant: 'alu', stage: 'if', width: 240,
    inputs: [
      { id: 'A', label: 'A = PC_Out' },
    ],
    outputs: [{ id: 'result', label: 'PC_plus_one' }],
  } },

  // ==== IF/ID pipeline register (channel x=480-660) ====
  { id: 'IFID', type: 'pipereg', position: { x: 515, y: PIPE_TOP }, data: {
    label: 'IF/ID', instruction: '—', height: PIPE_HEIGHT, width: PIPE_WIDTH,
    inputs: [
      { id: 'in-pc',  label: 'PC' },
      { id: 'in-ins', label: 'ins' },
    ],
    outputs: [
      { id: 'pc',  label: 'PC' },
      { id: 'ins', label: 'instruction' },
    ],
  } },

  // ==== ID stage (band 660–1040) ====
  { id: 'READADDR', type: 'ic', position: { x: 700, y: 240 }, data: {
    label: 'Read Address Logic', subtitle: 'combinational', variant: 'logic', stage: 'id', width: 300,
    inputs: [{ id: 'ins', label: 'fd_ins' }],
    outputs: [
      { id: 'readA', label: 'ctrl_readRegA' },
      { id: 'readB', label: 'ctrl_readRegB' },
    ],
  } },
  { id: 'REGFILE', type: 'ic', position: { x: 700, y: 520 }, data: {
    label: 'Register File', subtitle: '32 × 32-bit', variant: 'external', stage: 'id', width: 300,
    inputs: [
      { id: 'readA',       label: 'ctrl_readRegA' },
      { id: 'readB',       label: 'ctrl_readRegB' },
      { id: 'writeReg',    label: 'ctrl_writeReg' },
      { id: 'writeData',   label: 'data_writeReg' },
      { id: 'writeEnable', label: 'ctrl_writeEnable' },
    ],
    outputs: [
      { id: 'dataA', label: 'data_readRegA' },
      { id: 'dataB', label: 'data_readRegB' },
    ],
  } },

  // ==== ID/EX pipeline register (channel x=1040-1220) ====
  { id: 'IDEX', type: 'pipereg', position: { x: 1075, y: PIPE_TOP }, data: {
    label: 'ID/EX', instruction: '—', height: PIPE_HEIGHT, width: PIPE_WIDTH,
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
      { id: 'ins',   label: 'instruction' },
    ],
  } },

  // ==== EX stage (band 1220–2300, 3 columns) ====
  // Column 1 (left, x=1260): forwarding muxes + sign extend
  { id: 'FWDA', type: 'ic', position: { x: 1260, y: 210 }, data: {
    label: 'Fwd Mux A (3:1)', subtitle: 'forwarded_A', variant: 'mux', stage: 'ex', width: 280,
    inputs: [
      { id: 'sel',    label: 'sel = mx/wx' },
      { id: 'in_reg', label: 'in0 = dx_readA' },
      { id: 'in_xm',  label: 'in1 = xm_o (MX)' },
      { id: 'in_mw',  label: 'in2 = mw_data (WX)' },
    ],
    outputs: [{ id: 'out', label: 'forwarded_A' }],
  } },
  { id: 'FWDB', type: 'ic', position: { x: 1260, y: 410 }, data: {
    label: 'Fwd Mux B (3:1)', subtitle: 'forwarded_B', variant: 'mux', stage: 'ex', width: 280,
    inputs: [
      { id: 'sel',    label: 'sel = mx/wx' },
      { id: 'in_reg', label: 'in0 = dx_readB' },
      { id: 'in_xm',  label: 'in1 = xm_o (MX)' },
      { id: 'in_mw',  label: 'in2 = mw_data (WX)' },
    ],
    outputs: [{ id: 'out', label: 'forwarded_B' }],
  } },
  { id: 'SIGNEXT', type: 'ic', position: { x: 1260, y: 680 }, data: {
    label: 'Sign Extend', subtitle: '17 → 32 bit', variant: 'logic', stage: 'ex', width: 280,
    inputs: [{ id: 'imm17', label: 'imm17 = ins[16:0]' }],
    outputs: [{ id: 'out', label: 'signext_imm' }],
  } },

  // Column 2 (middle, x=1620): ALU / ALU Source Mux / MultDiv
  { id: 'ALU', type: 'ic', position: { x: 1620, y: 200 }, data: {
    label: 'Main ALU', subtitle: 'alu execute_alu', variant: 'alu', stage: 'ex', width: 320,
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
  { id: 'ALUSRC', type: 'ic', position: { x: 1620, y: 460 }, data: {
    label: 'ALU Source Mux', subtitle: 'mux_2', variant: 'mux', stage: 'ex', width: 300,
    inputs: [
      { id: 'sel', label: 'sel = is_i_type' },
      { id: 'in0', label: 'in0 = forwarded_B' },
      { id: 'in1', label: 'in1 = signext_imm' },
    ],
    outputs: [{ id: 'out', label: 'data_operandB' }],
  } },
  { id: 'MULTDIV', type: 'ic', position: { x: 1620, y: 680 }, data: {
    label: 'MultDiv Unit', subtitle: 'multdiv md_unit', variant: 'multdiv', stage: 'ex', width: 300,
    inputs: [
      { id: 'A',     label: 'data_operandA' },
      { id: 'B',     label: 'data_operandB' },
      { id: 'mult',  label: 'ctrl_MULT' },
      { id: 'div',   label: 'ctrl_DIV' },
    ],
    outputs: [
      { id: 'result',    label: 'data_result' },
      { id: 'exception', label: 'data_exception' },
      { id: 'rdy',       label: 'data_resultRDY' },
    ],
  } },

  // Column 3 (right, x=1980): XM Data Mux + Branch Target Calc
  { id: 'XMDATA', type: 'ic', position: { x: 1980, y: 200 }, data: {
    label: 'XM Data Mux', subtitle: 'select EX output', variant: 'mux', stage: 'ex', width: 280,
    inputs: [
      { id: 'sel', label: 'sel (instr type)' },
      { id: 'alu', label: 'alu_out' },
      { id: 'md',  label: 'multdiv_result' },
      { id: 'jal', label: 'dx_PC+1 (jal)' },
      { id: 'exc', label: 'exception_status' },
    ],
    outputs: [{ id: 'out', label: 'xm_data_in' }],
  } },
  { id: 'BRTGT', type: 'ic', position: { x: 1980, y: 580 }, data: {
    label: 'Branch Target Calc', subtitle: '2× ALU + target mux', variant: 'logic', stage: 'ex', width: 280,
    inputs: [
      { id: 'pc',      label: 'dx_PC' },
      { id: 'imm',     label: 'signext_imm' },
      { id: 'opa',     label: 'data_operandA' },
      { id: 'sel_ins', label: 'ins (opcode)' },
      { id: 'ne',      label: 'not_equal' },
      { id: 'lt',      label: 'less_than' },
    ],
    outputs: [
      { id: 'target',      label: 'branch_jump_target' },
      { id: 'take_branch', label: 'take_branch' },
    ],
  } },

  // ==== EX/MEM pipeline register (channel x=2300-2480) ====
  { id: 'EXMEM', type: 'pipereg', position: { x: 2335, y: PIPE_TOP }, data: {
    label: 'EX/MEM', instruction: '—', height: PIPE_HEIGHT, width: PIPE_WIDTH,
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

  // ==== MEM stage (band 2480–2800) ====
  { id: 'WMFWD', type: 'ic', position: { x: 2510, y: 220 }, data: {
    label: 'WM Forward Mux', subtitle: 'mw_data → store?', variant: 'mux', stage: 'mem', width: 280,
    inputs: [
      { id: 'sel', label: 'sel = wm_forward' },
      { id: 'in0', label: 'in0 = xm_b' },
      { id: 'in1', label: 'in1 = mw_data' },
    ],
    outputs: [{ id: 'out', label: 'data → DMEM' }],
  } },
  { id: 'DMEM', type: 'ic', position: { x: 2510, y: 460 }, data: {
    label: 'Data Memory', subtitle: 'RAM (external)', variant: 'external', stage: 'mem', width: 280,
    inputs: [
      { id: 'address', label: 'address_dmem' },
      { id: 'data',    label: 'data' },
      { id: 'wren',    label: 'wren = mem_is_sw' },
    ],
    outputs: [{ id: 'q', label: 'q_dmem' }],
  } },
  { id: 'MEMMUX', type: 'ic', position: { x: 2510, y: 700 }, data: {
    label: 'MEM Data Mux', subtitle: 'lw → memory data', variant: 'mux', stage: 'mem', width: 280,
    inputs: [
      { id: 'sel', label: 'sel = is_lw' },
      { id: 'in0', label: 'in0 = xm_o' },
      { id: 'in1', label: 'in1 = q_dmem' },
    ],
    outputs: [{ id: 'out', label: 'mw_data_in' }],
  } },

  // ==== MEM/WB pipeline register (channel x=2800-2980) ====
  { id: 'MEMWB', type: 'pipereg', position: { x: 2835, y: PIPE_TOP }, data: {
    label: 'MEM/WB', instruction: '—', height: PIPE_HEIGHT, width: PIPE_WIDTH,
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

  // ==== WB stage (band 2980–3300) ====
  { id: 'WBLOGIC', type: 'ic', position: { x: 3010, y: 410 }, data: {
    label: 'WB Mux + Enable', subtitle: 'jal→$r31, setx→$r30, …', variant: 'logic', stage: 'wb', width: 280,
    inputs: [
      { id: 'mw_data', label: 'mw_data' },
      { id: 'mw_ins',  label: 'mw_ins' },
    ],
    outputs: [
      { id: 'writeReg',    label: 'ctrl_writeReg' },
      { id: 'writeEnable', label: 'ctrl_writeEnable' },
      { id: 'writeData',   label: 'data_writeReg' },
    ],
  } },
]

// ---------- Edges ---------------------------------------------------------

// Convention: `type: 'feedback'` + `data.routeY` for long backward wires
// that should route via the top (low routeY) or bottom (high routeY) of the
// canvas. `routeY` values are deliberately staggered so parallel feedback
// wires don't overlap each other.

const initialEdges = [
  // ---------- IF stage primary datapath ----------
  { id: 'pcmux-pc',    source: 'PC_MUX', sourceHandle: 'out',     target: 'PC',     targetHandle: 'writeIn',  type: 'smoothstep', className: 'rf-edge-data', data: { path: 'IF' } },
  { id: 'pc-inc',      source: 'PC',     sourceHandle: 'readOut', target: 'PC_INC', targetHandle: 'A',        type: 'smoothstep', className: 'rf-edge-data' },
  { id: 'pcinc-pcmux', source: 'PC_INC', sourceHandle: 'result',  target: 'PC_MUX', targetHandle: 'in0',      type: 'smoothstep', className: 'rf-edge-data' },
  { id: 'pc-imem',     source: 'PC',     sourceHandle: 'readOut', target: 'IMEM',   targetHandle: 'address',  type: 'smoothstep', className: 'rf-edge-data', data: { path: 'IF' } },
  { id: 'pc-ifid',     source: 'PC',     sourceHandle: 'readOut', target: 'IFID',   targetHandle: 'in-pc',    type: 'smoothstep', className: 'rf-edge-data', data: { path: 'IF' } },
  { id: 'imem-ifid',   source: 'IMEM',   sourceHandle: 'q',       target: 'IFID',   targetHandle: 'in-ins',   type: 'smoothstep', className: 'rf-edge-data', data: { path: 'IF' } },

  // ---------- ID stage ----------
  { id: 'ifid-rdaddr', source: 'IFID',     sourceHandle: 'ins',   target: 'READADDR', targetHandle: 'ins',   type: 'smoothstep', className: 'rf-edge-data', data: { path: 'ID' } },
  { id: 'rdaddr-rfA',  source: 'READADDR', sourceHandle: 'readA', target: 'REGFILE',  targetHandle: 'readA', type: 'smoothstep', className: 'rf-edge-control', data: { path: 'ID' } },
  { id: 'rdaddr-rfB',  source: 'READADDR', sourceHandle: 'readB', target: 'REGFILE',  targetHandle: 'readB', type: 'smoothstep', className: 'rf-edge-control', data: { path: 'ID' } },
  { id: 'rf-idex-a',   source: 'REGFILE',  sourceHandle: 'dataA', target: 'IDEX',     targetHandle: 'in-readA', type: 'smoothstep', className: 'rf-edge-data', data: { path: 'ID' } },
  { id: 'rf-idex-b',   source: 'REGFILE',  sourceHandle: 'dataB', target: 'IDEX',     targetHandle: 'in-readB', type: 'smoothstep', className: 'rf-edge-data', data: { path: 'ID' } },
  { id: 'ifid-idex-pc',  source: 'IFID', sourceHandle: 'pc',  target: 'IDEX', targetHandle: 'in-pc',  type: 'smoothstep', className: 'rf-edge-data' },
  { id: 'ifid-idex-ins', source: 'IFID', sourceHandle: 'ins', target: 'IDEX', targetHandle: 'in-ins', type: 'smoothstep', className: 'rf-edge-data' },

  // ---------- EX stage — primary datapath ----------
  { id: 'idex-fwda',   source: 'IDEX', sourceHandle: 'readA', target: 'FWDA',    targetHandle: 'in_reg', type: 'smoothstep', className: 'rf-edge-data', data: { path: 'EX' } },
  { id: 'idex-fwdb',   source: 'IDEX', sourceHandle: 'readB', target: 'FWDB',    targetHandle: 'in_reg', type: 'smoothstep', className: 'rf-edge-data', data: { path: 'EX' } },
  { id: 'idex-sx',     source: 'IDEX', sourceHandle: 'ins',   target: 'SIGNEXT', targetHandle: 'imm17',  type: 'smoothstep', className: 'rf-edge-data', data: { path: 'EX' } },
  { id: 'fwda-alu',    source: 'FWDA',    sourceHandle: 'out', target: 'ALU',    targetHandle: 'A',   type: 'smoothstep', className: 'rf-edge-data', data: { path: 'EX' } },
  { id: 'fwdb-alusrc', source: 'FWDB',    sourceHandle: 'out', target: 'ALUSRC', targetHandle: 'in0', type: 'smoothstep', className: 'rf-edge-data', data: { path: 'EX' } },
  { id: 'sx-alusrc',   source: 'SIGNEXT', sourceHandle: 'out', target: 'ALUSRC', targetHandle: 'in1', type: 'smoothstep', className: 'rf-edge-data', data: { path: 'EX' } },
  { id: 'alusrc-alu',  source: 'ALUSRC',  sourceHandle: 'out', target: 'ALU',    targetHandle: 'B',   type: 'smoothstep', className: 'rf-edge-data', data: { path: 'EX' } },

  // ---------- EX stage — MultDiv parallel path ----------
  { id: 'fwda-md',   source: 'FWDA',   sourceHandle: 'out', target: 'MULTDIV', targetHandle: 'A', type: 'smoothstep', className: 'rf-edge-multdiv' },
  { id: 'alusrc-md', source: 'ALUSRC', sourceHandle: 'out', target: 'MULTDIV', targetHandle: 'B', type: 'smoothstep', className: 'rf-edge-multdiv' },

  // ---------- EX stage — Branch target calc ----------
  { id: 'idex-brpc',   source: 'IDEX',    sourceHandle: 'pc',  target: 'BRTGT', targetHandle: 'pc',      type: 'smoothstep', className: 'rf-edge-data' },
  { id: 'sx-brtgt',    source: 'SIGNEXT', sourceHandle: 'out', target: 'BRTGT', targetHandle: 'imm',     type: 'smoothstep', className: 'rf-edge-data' },
  { id: 'fwda-brtgt',  source: 'FWDA',    sourceHandle: 'out', target: 'BRTGT', targetHandle: 'opa',     type: 'smoothstep', className: 'rf-edge-data' },
  { id: 'idex-brsel',  source: 'IDEX',    sourceHandle: 'ins', target: 'BRTGT', targetHandle: 'sel_ins', type: 'smoothstep', className: 'rf-edge-control' },

  // ---------- EX stage — XM Data Mux ----------
  { id: 'alu-xmdata', source: 'ALU',     sourceHandle: 'result', target: 'XMDATA', targetHandle: 'alu', type: 'smoothstep', className: 'rf-edge-data', data: { path: 'EX' } },
  { id: 'md-xmdata',  source: 'MULTDIV', sourceHandle: 'result', target: 'XMDATA', targetHandle: 'md',  type: 'smoothstep', className: 'rf-edge-multdiv' },
  { id: 'idex-xmsel', source: 'IDEX',    sourceHandle: 'ins',    target: 'XMDATA', targetHandle: 'sel', type: 'smoothstep', className: 'rf-edge-control' },

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
  { id: 'exmem-memmuxsel', source: 'EXMEM', sourceHandle: 'ins', target: 'MEMMUX', targetHandle: 'sel',   type: 'smoothstep', className: 'rf-edge-control' },

  // ---------- MEM → MEM/WB ----------
  { id: 'memmux-memwb',   source: 'MEMMUX', sourceHandle: 'out', target: 'MEMWB', targetHandle: 'in-data', type: 'smoothstep', className: 'rf-edge-data', data: { path: 'MEM' } },
  { id: 'exmem-memwb-b',  source: 'EXMEM',  sourceHandle: 'b',   target: 'MEMWB', targetHandle: 'in-b',    type: 'smoothstep', className: 'rf-edge-data' },
  { id: 'exmem-memwb-ins', source: 'EXMEM', sourceHandle: 'ins', target: 'MEMWB', targetHandle: 'in-ins',  type: 'smoothstep', className: 'rf-edge-data' },

  // ---------- WB stage ----------
  { id: 'memwb-wb-data', source: 'MEMWB', sourceHandle: 'data', target: 'WBLOGIC', targetHandle: 'mw_data', type: 'smoothstep', className: 'rf-edge-data', data: { path: 'WB' } },
  { id: 'memwb-wb-ins',  source: 'MEMWB', sourceHandle: 'ins',  target: 'WBLOGIC', targetHandle: 'mw_ins',  type: 'smoothstep', className: 'rf-edge-data', data: { path: 'WB' } },

  // ====== Long backward feedback wires (custom FeedbackEdge) ======

  // Forwarding feedback — route via BOTTOM of canvas with staggered routeY
  { id: 'xm-fwda', type: 'feedback', source: 'EXMEM', sourceHandle: 'o',     target: 'FWDA', targetHandle: 'in_xm', className: 'rf-edge-forward', data: { routeY: 950 } },
  { id: 'xm-fwdb', type: 'feedback', source: 'EXMEM', sourceHandle: 'o',     target: 'FWDB', targetHandle: 'in_xm', className: 'rf-edge-forward', data: { routeY: 965 }, label: 'EX/MEM → Fwd Muxes (MX bypass)' },
  { id: 'mw-fwda', type: 'feedback', source: 'MEMWB', sourceHandle: 'data',  target: 'FWDA', targetHandle: 'in_mw', className: 'rf-edge-forward', data: { routeY: 980 } },
  { id: 'mw-fwdb', type: 'feedback', source: 'MEMWB', sourceHandle: 'data',  target: 'FWDB', targetHandle: 'in_mw', className: 'rf-edge-forward', data: { routeY: 995 }, label: 'MEM/WB → Fwd Muxes (WX bypass)' },

  // WM bypass (MEM/WB → WM Forward Mux for sw)
  { id: 'mw-wmfwd', type: 'feedback', source: 'MEMWB', sourceHandle: 'data', target: 'WMFWD', targetHandle: 'in1', className: 'rf-edge-forward', data: { routeY: 65 }, label: 'WM bypass' },

  // Branch target + take_branch back to PC Source Mux — route via TOP
  // ---------- Status wires: the branch decision and the exception path ------
  // These ports were drawn but unwired. They carry real signals: processor.v
  // derives do_bne from not_equal and do_blt from less_than, and an ALU
  // overflow is turned into a fake setx that writes $r30. Without them the
  // branch loop was drawn with no visible cause - BRTGT fed PC_MUX, but
  // nothing showed what made take_branch true.
  { id: 'alu-ne-brtgt', source: 'ALU', sourceHandle: 'isNotEqual', target: 'BRTGT', targetHandle: 'ne', type: 'smoothstep', className: 'rf-edge-data', data: { path: 'EX' } },
  { id: 'alu-lt-brtgt', source: 'ALU', sourceHandle: 'isLessThan', target: 'BRTGT', targetHandle: 'lt', type: 'smoothstep', className: 'rf-edge-data', data: { path: 'EX' } },
  { id: 'alu-ovf-xm',   source: 'ALU', sourceHandle: 'overflow',   target: 'XMDATA', targetHandle: 'exc', type: 'smoothstep', className: 'rf-edge-control', data: { path: 'EX' } },
  { id: 'md-exc-xm',    source: 'MULTDIV', sourceHandle: 'exception', target: 'XMDATA', targetHandle: 'exc', type: 'smoothstep', className: 'rf-edge-control', data: { path: 'EX' } },
  // jal links PC+1 into $r31, and that value rides the ID/EX latch.
  { id: 'idex-jal-xm',  source: 'IDEX', sourceHandle: 'pc', target: 'XMDATA', targetHandle: 'jal', type: 'smoothstep', className: 'rf-edge-data', data: { path: 'EX' } },

  { id: 'md-stall-pc', type: 'feedback', source: 'MULTDIV', sourceHandle: 'rdy', target: 'PC', targetHandle: 'writeEnable', className: 'rf-edge-forward', data: { routeY: 965 }, label: 'multdiv stall -> freeze PC' },
  { id: 'brtgt-pcmux', type: 'feedback', source: 'BRTGT', sourceHandle: 'target',      target: 'PC_MUX', targetHandle: 'in1', className: 'rf-edge-feedback', data: { routeY: 50 }, label: 'branch/jump target' },
  { id: 'brtgt-sel',   type: 'feedback', source: 'BRTGT', sourceHandle: 'take_branch', target: 'PC_MUX', targetHandle: 'sel', className: 'rf-edge-feedback', data: { routeY: 80 } },

  // Write-back to RegFile — route via TOP
  { id: 'wb-rf-wreg',  type: 'feedback', source: 'WBLOGIC', sourceHandle: 'writeReg',    target: 'REGFILE', targetHandle: 'writeReg',    className: 'rf-edge-feedback', data: { routeY: 25 }, label: 'write-back' },
  { id: 'wb-rf-wen',   type: 'feedback', source: 'WBLOGIC', sourceHandle: 'writeEnable', target: 'REGFILE', targetHandle: 'writeEnable', className: 'rf-edge-feedback', data: { routeY: 35 } },
  { id: 'wb-rf-wdata', type: 'feedback', source: 'WBLOGIC', sourceHandle: 'writeData',   target: 'REGFILE', targetHandle: 'writeData',   className: 'rf-edge-feedback', data: { routeY: 45 } },
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
  { id: 'ctrl-aluop',   source: 'IDEX', sourceHandle: 'ins', target: 'ALU',     targetHandle: 'op',    label: 'ALUopcode' },
  { id: 'ctrl-shamt',   source: 'IDEX', sourceHandle: 'ins', target: 'ALU',     targetHandle: 'shamt', label: 'shiftamt' },
  { id: 'ctrl-alusrc',  source: 'IDEX', sourceHandle: 'ins', target: 'ALUSRC',  targetHandle: 'sel',   label: 'is_i_type' },
  { id: 'ctrl-mult',    source: 'IDEX', sourceHandle: 'ins', target: 'MULTDIV', targetHandle: 'mult',  label: 'is_mul' },
  { id: 'ctrl-div',     source: 'IDEX', sourceHandle: 'ins', target: 'MULTDIV', targetHandle: 'div',   label: 'is_div' },
  { id: 'ctrl-wren',    source: 'EXMEM', sourceHandle: 'ins', target: 'DMEM',   targetHandle: 'wren',  label: 'is_sw' },
  { id: 'ctrl-fwda',    source: 'EXMEM', sourceHandle: 'ins', target: 'FWDA',   targetHandle: 'sel',   label: 'rd match (MX/WX)' },
  { id: 'ctrl-fwdb',    source: 'EXMEM', sourceHandle: 'ins', target: 'FWDB',   targetHandle: 'sel',   label: 'rd match (MX/WX)' },
  { id: 'ctrl-wmfwd',   source: 'MEMWB', sourceHandle: 'ins', target: 'WMFWD',  targetHandle: 'sel',   label: 'rd match (WM)' },
].map((e) => ({
  ...e,
  type: 'smoothstep',
  className: 'rf-edge-control',
  labelStyle: { fontSize: 9 },
}))

// ---------- Component -----------------------------------------------------

const STAGE_ORDER = ['IF', 'ID', 'EX', 'MEM', 'WB']

/**
 * Each pipeline register holds the instruction the stage DOWNSTREAM of it is
 * working on this cycle: the IF/ID latch feeds ID, ID/EX feeds EX, and so on.
 */
const PIPEREG_FEEDS = { IFID: 'ID', IDEX: 'EX', EXMEM: 'MEM', MEMWB: 'WB' }

/**
 * Viewport bounds per stage, derived from the band nodes so they can never drift
 * from the layout. Padded sideways to take in the pipeline registers sitting in
 * the channels either side of each band.
 */
const STAGE_BOUNDS = (() => {
  const out = {}
  initialNodes
    .filter((n) => n.type === 'band')
    .forEach((n) => {
      const stage = n.data.short
      out[stage] = {
        x: n.position.x - 165,
        y: n.position.y - 20,
        width: n.data.width + 330,
        height: n.data.height + 40,
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
   * The whole board is ~3300px wide. Fitted into the demo column that lands at
   * roughly 0.3 zoom, where the 10.5px port labels - the Verilog signal names
   * that are the point of drawing it at this level of detail - are unreadable.
   * Rather than simplify the schematic, the viewport focuses one stage at a
   * time, so the detail survives and becomes legible on demand.
   */
  const [focus, setFocus] = useState('ALL')

  /*
   * Focusing alone cannot make this readable, and it is worth being clear why:
   * the EX stage is ~1410px wide including its channels, while the demo column
   * is around 680px. Even perfectly fitted that caps out near 0.45 zoom, so the
   * 10.5px port labels still render at ~5px. The missing ingredient is not
   * framing, it is space - hence expanding to the full viewport, where EX fits
   * at close to 1:1 and the Verilog signal names finally read.
   */
  const [expanded, setExpanded] = useState(false)
  const [showControl, setShowControl] = useState(false)
  const wrapperRef = useRef(null)
  const { fitBounds, fitView } = useReactFlow()

  const applyFocus = useCallback(() => {
    if (focus === 'ALL') {
      fitView({ padding: 0.04, duration: 300 })
    } else if (STAGE_BOUNDS[focus]) {
      fitBounds(STAGE_BOUNDS[focus], { padding: 0.08, duration: 300 })
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
    const ro = new ResizeObserver(() => {
      clearTimeout(timer)
      timer = setTimeout(applyFocus, 120)
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
      if (e.data?.path && occupied[e.data.path]) {
        return { ...e, animated: true }
      }
      return e
    })
  }, [occupied, showControl])

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
