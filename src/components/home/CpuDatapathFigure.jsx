import React from 'react'

/**
 * A simplified five-stage datapath, drawn inline as SVG.
 *
 * The simulator generates its real diagram at runtime (React Flow), so there is
 * no static render of it in the repository to use on a card. This is a
 * deliberately reduced schematic - the five stages, the pipeline register
 * boundaries, and the forwarding path - rather than an attempt to reproduce the
 * full 22-node datapath at thumbnail size.
 *
 * Colours come from tokens so it follows the theme, including dark mode.
 * Decorative: the surrounding card supplies the accessible description.
 */
function CpuDatapathFigure() {
  return (
    <svg
      className="cpu-datapath"
      viewBox="0 0 620 250"
      fill="none"
      role="img"
      aria-label="Five-stage CPU datapath: program counter, register file, ALU, data memory and write-back, with a forwarding path from memory back to execute"
    >
      {/* Stage labels */}
      <g className="cpu-datapath-stage">
        <text x="42" y="18" textAnchor="middle">IF</text>
        <text x="170" y="18" textAnchor="middle">ID</text>
        <text x="310" y="18" textAnchor="middle">EX</text>
        <text x="450" y="18" textAnchor="middle">MEM</text>
        <text x="578" y="18" textAnchor="middle">WB</text>
      </g>

      {/* Pipeline register boundaries */}
      <g className="cpu-datapath-divider">
        <line x1="104" y1="30" x2="104" y2="226" />
        <line x1="240" y1="30" x2="240" y2="226" />
        <line x1="380" y1="30" x2="380" y2="226" />
        <line x1="516" y1="30" x2="516" y2="226" />
      </g>

      {/* Functional units */}
      <g className="cpu-datapath-unit">
        <rect x="14" y="100" width="52" height="38" rx="2" />
        <rect x="128" y="86" width="82" height="66" rx="2" />
        <rect x="272" y="98" width="72" height="42" rx="2" />
        <rect x="404" y="86" width="82" height="66" rx="2" />
        <rect x="540" y="100" width="56" height="38" rx="2" />
      </g>

      <g className="cpu-datapath-label">
        <text x="40" y="123" textAnchor="middle">PC</text>
        <text x="169" y="115" textAnchor="middle">Register</text>
        <text x="169" y="129" textAnchor="middle">file</text>
        <text x="308" y="123" textAnchor="middle">ALU</text>
        <text x="445" y="115" textAnchor="middle">Data</text>
        <text x="445" y="129" textAnchor="middle">memory</text>
        <text x="568" y="123" textAnchor="middle">WB</text>
      </g>

      {/* Datapath wires */}
      <g className="cpu-datapath-wire">
        <line x1="66" y1="119" x2="128" y2="119" />
        <line x1="210" y1="119" x2="272" y2="119" />
        <line x1="344" y1="119" x2="404" y2="119" />
        <line x1="486" y1="119" x2="540" y2="119" />
      </g>

      {/* Forwarding path: MEM result back into EX */}
      <path className="cpu-datapath-forward" d="M420 166 C420 204, 300 204, 300 166" />
      <text className="cpu-datapath-forward-label" x="360" y="220" textAnchor="middle">
        FORWARDING
      </text>
    </svg>
  )
}

export default CpuDatapathFigure
