# Phase 10: Basic Visualization - Context

**Gathered:** 2026-02-11
**Status:** Ready for re-planning

<domain>
## Phase Boundary

Visual block diagram representation of the 5-stage pipelined processor architecture showing hardware components and data flow during program execution. This replaces the text-based status display approach from the initial implementation.

</domain>

<decisions>
## Implementation Decisions

### Visual Approach
- SVG-based block diagram rendering (vector graphics, scalable, animatable paths)
- Not canvas-based or HTML/CSS positioned elements

### Components to Display
- Major functional blocks: Instruction Memory, Register File, ALU, Data Memory
- Pipeline registers: F/D, D/X, X/M, M/W (latches between stages)
- Multiplexers and control logic (the mux triangles from slide diagrams)
- PC (program counter) and adder logic
- Any other vital components needed for completeness

### Information Display During Execution
- **Instructions in each pipeline stage** - Show which instruction is currently in F/D, D/X, X/M, M/W registers
- **Active component highlighting** - Visual indication of which component is active (e.g., ALU lights up during EX stage, Memory lights up during MEM stage)
- **Register file contents** - Display register values being read/written

**NOT included:**
- Values on data path wires (no "0x0400" labels on every wire)

### Interaction Model
- Tooltip on hover only - show basic component info when hovering over blocks
- No click-to-expand modals or sidebars
- Simple, non-intrusive information display

### Layout and Supplementary Displays
- Block diagram is the primary visualization
- **Keep:** Register values grid (32 registers with hex values)
- **Remove:** Stage cards showing "IF: ADD $t0, $t1, $t2" (redundant - block diagram shows this visually)
- **Remove:** Cycle/instruction counter text (can be integrated into diagram or removed)

### Claude's Discretion
- Exact SVG layout and spacing
- Color scheme for active/inactive states (should complement existing forest green theme)
- Tooltip styling and content
- Animation timing and transitions
- Component sizing and positioning details

</decisions>

<specifics>
## Specific Ideas

**Reference Architecture:**
- Duke ECE 350 slide decks (particularly Slide 09: Pipelined Processors)
- URL: https://people.duke.edu/~tkb13/courses/ece350-2023fa/
- Pipeline terminology slide showing: Insn Mem (left), Register File (center), ALU/SX (center-right), Data Mem (right)
- Pipeline registers labeled F/D, D/X, X/M, M/W in red
- Multiplexers shown as blue triangular shapes

**Visual Style:**
- Similar level of detail to the reference slide
- Hardware block diagram feel (not abstract/schematic)
- Component blocks should be recognizable as their functional units

**User's CPU Implementation:**
- Verilog code in repository (to be located) can inform exact component details
- May differ slightly from textbook 5-stage pipeline (e.g., hazard handling specifics)

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope (visualization only, not adding new CPU features or controls)

</deferred>

---

*Phase: 10-basic-visualization*
*Context gathered: 2026-02-11*
