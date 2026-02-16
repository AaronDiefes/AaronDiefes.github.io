---
phase: 13-documentation-foundation
plan: 05
subsystem: cpu-documentation
tags:
  - pipeline
  - five-stage
  - cp4
  - if-id-ex-mem-wb
  - control-unit
  - verilog

dependency-graph:
  requires:
    - 13-02 (ALU documentation pattern)
    - 13-03 (Register File documentation pattern)
    - 13-04 (MultDiv documentation pattern)
  provides:
    - /cpu-docs/pipeline route
    - CpuPipelinePage.jsx component
    - Pipeline Architecture documentation (CP4)
  affects:
    - App.jsx (route registration)

tech-stack:
  added:
    - Pipeline Architecture documentation with 5-stage design
    - Pipeline registers (IF/ID, ID/EX, EX/MEM, MEM/WB)
    - Control unit documentation with signal table
  patterns:
    - Control signal table using .control-table class
    - Instruction execution timeline using .timeline-table class
    - Pipeline stage diagram using .pipeline-diagram/.pipeline-step classes
    - Verilog code snippets with syntax highlighting
    - Colored stage cells (IF=green, ID=lighter green, EX=lighter, MEM=darker, WB=darkest)

key-files:
  created:
    - src/pages/cpu/CpuPipelinePage.jsx
  modified:
    - src/App.jsx

decisions:
  - "Document 5-stage pipeline: IF, ID, EX, MEM, WB with detailed explanations"
  - "Provide 5 Verilog code snippets (one per stage + pipeline register)"
  - "Include control unit section with 8-instruction control signal table"
  - "Create instruction execution timeline showing overlapping stages"
  - "Explain pipeline registers with flush and stall control"
  - "Document latency vs. throughput trade-off of pipelining"
  - "Link to MultDiv (prev) and Hazards & Forwarding (next)"
  - "Use colored stage cells in timeline for visual clarity"

metrics:
  duration: "3m 22s"
  tasks-completed: 2
  files-created: 1
  files-modified: 1
  commits: 2
  completed-date: "2026-02-16"
---

# Phase 13 Plan 05: Pipeline Architecture Documentation

**One-liner:** Created Pipeline Architecture documentation page (CP4) with comprehensive 5-stage pipeline design, pipeline registers, control unit signal table, instruction execution timeline, and 5 Verilog code snippets.

## Summary

Successfully created the Pipeline Architecture documentation page covering Checkpoint 4 of the CPU project. The page provides comprehensive documentation of the 5-stage pipelined processor design, explaining how instructions flow through the Instruction Fetch, Instruction Decode, Execute, Memory Access, and Write Back stages. Includes detailed explanations of pipeline registers with flush/stall control, control unit signal table for 8 instruction types, instruction execution timeline visualization showing overlapping stages, and 5 Verilog code snippets demonstrating the implementation.

## Tasks Completed

| Task | Name | Commit | Key Changes |
|------|------|--------|-------------|
| 1 | Create CpuPipelinePage.jsx | 2faa96a | Created 862-line documentation page with 5-stage pipeline, pipeline registers, control unit, timeline, 5 Verilog snippets |
| 2 | Activate Pipeline route | 36d75cc | Uncommented import and route in App.jsx for /cpu-docs/pipeline |

## Deviations from Plan

None - plan executed exactly as written.

## Technical Implementation

### CpuPipelinePage.jsx Structure

**Breadcrumbs:** Home > CPU Simulator > Documentation > Pipeline Architecture

**Header Section:**
- Title: "Pipeline Architecture"
- Subtitle: "Checkpoint 4 - 5-Stage Pipelined Processor"
- Green gradient background

**Content Sections:**

**1. Overview**
- What pipelining is: overlapping instruction execution at different stages
- Without pipelining: 25 cycles for 5 instructions (sequential)
- With pipelining: 9 cycles for 5 instructions (5 to fill + 4 more)
- Ideal throughput: 1 instruction per cycle (5x speedup)
- 5 stages: IF (Instruction Fetch), ID (Instruction Decode), EX (Execute), MEM (Memory Access), WB (Write Back)
- Pipeline registers between stages hold intermediate results

**2. Pipeline Stages** (with visual pipeline diagram at top)
- **Visual Pipeline Diagram:** 5 boxes (IF → ID → EX → MEM → WB) with arrows using .pipeline-diagram/.pipeline-step classes

**Stage 1: Instruction Fetch (IF)**
- Reads instruction from instruction memory (ROM) using PC
- Increments PC by 1 for next instruction
- Passes instruction and PC+1 to IF/ID pipeline register
- **Verilog Snippet 1:** IF stage implementation with ROM instantiation

**Stage 2: Instruction Decode (ID)**
- Decodes instruction fields: opcode, rs, rt, rd, shamt, immediate, target
- Reads two source registers from register file
- Sign-extends 16-bit immediate to 32 bits
- Control unit generates control signals based on opcode
- **Verilog Snippet 2:** ID stage field extraction and sign extension

**Stage 3: Execute (EX)**
- ALU performs computation (add, subtract, compare)
- For R-type: ALU operates on two register values
- For I-type: ALU operates on register and sign-extended immediate
- For branches: ALU computes branch condition
- MultDiv unit handles multiply and divide
- **Verilog Snippet 3:** EX stage ALU input selection and instantiation

**Stage 4: Memory Access (MEM)**
- Load instructions read from data memory (RAM)
- Store instructions write to data memory (RAM)
- Other instructions pass through (ALU result forwarded)
- Memory address from ALU result
- **Verilog Snippet 4:** MEM stage RAM instantiation and data selection

**Stage 5: Write Back (WB)**
- Writes result back to register file
- Destination register: rd (R-type) or rt (I-type loads)
- Write enable asserted for instructions that produce a result
- **Verilog Snippet 5:** WB stage register write connections

**3. Pipeline Registers**
- IF/ID register: holds instruction and PC+1
- ID/EX register: holds decoded values, control signals, register data
- EX/MEM register: holds ALU result, memory write data, control signals
- MEM/WB register: holds final data, control signals
- All are edge-triggered D flip-flops
- Flush and stall control for hazards
- **Verilog Snippet 6 (IF/ID example):** Pipeline register implementation with flush and stall logic

**4. Control Unit**
- Opcode-based decoding: each opcode maps to control signals
- Control signals: RegWrite, MemWrite, MemToReg, ALUSrc, Branch, Jump, ALUOp
- **Control Signal Table** (using .control-table class):
  - 8 rows: R-type, addi, lw, sw, beq, bne, j, jal
  - 8 columns: Instruction Type, Opcode, RegWrite, MemWrite, MemToReg, ALUSrc, Branch, Jump
  - Shows which signals are asserted (1) or deasserted (0) for each instruction
  - "X" for don't care values

**5. Instruction Execution Timeline**
- Visual timeline showing how 3 instructions overlap in the pipeline
- **Timeline Table** (using .timeline-table class):
  - Rows: Instr 1, Instr 2, Instr 3
  - Columns: Cycle 1-7
  - Colored cells: IF (lightest green), ID, EX, MEM, WB (darkest green)
  - Shows pipeline filling (cycles 1-5) and full utilization (cycles 6-7)
- Key observations:
  - Cycle 1: Only Instruction 1 active (pipeline filling)
  - Cycle 3: Three instructions active simultaneously
  - Cycle 5: Instruction 1 completes, pipeline fully utilized
  - Cycle 6+: One instruction completes per cycle (ideal throughput)
- Latency vs. Throughput explanation:
  - Latency: 5 cycles per instruction (constant)
  - Throughput: 1 instruction per cycle once pipeline is full
- Hazards preview: data hazards, control hazards, structural hazards (link to Hazards page)

**6. Explore Further**
- Quick links to:
  - Previous: Multiplication & Division (/cpu-docs/multdiv)
  - Next: Hazards & Forwarding (/cpu-docs/hazards)
  - Back to CPU docs (/cpu-docs)
  - GitHub: https://github.com/AaronDiefes/CPU

**Footer:**
- 4-column grid: About, Navigation, Resources, Built With
- Tech stack: Verilog HDL, ModelSim Simulation, Quartus Synthesis, JavaScript Visualization

### Styling

**Inline CSS in `<style>` tag:**
- Matches DocsPage.jsx and other CPU doc pages
- Uses .code-block with .keyword, .comment, .signal, .operator, .number classes for Verilog syntax highlighting
- Uses .control-table for control signal table (8 rows × 8 columns)
- Uses .timeline-table for instruction execution timeline
- Uses .stage-if, .stage-id, .stage-ex, .stage-mem, .stage-wb classes for colored stage cells:
  - IF: #e8f5e9 (lightest green)
  - ID: #c8e6c9
  - EX: #a5d6a7
  - MEM: #81c784 (white text)
  - WB: #66bb6a (white text, darkest)
- Uses .pipeline-diagram/.pipeline-step for visual pipeline diagram at top
- Responsive breakpoints at 768px and 480px

### App.jsx Route Registration

**Import:** Uncommented `import CpuPipelinePage from './pages/cpu/CpuPipelinePage'`

**Route:** Activated `<Route path="/cpu-docs/pipeline" element={<CpuPipelinePage />} />`

**Previously active routes confirmed:**
- /cpu-docs/alu (CpuAluPage)
- /cpu-docs/regfile (CpuRegfilePage)
- /cpu-docs/multdiv (CpuMultdivPage)

## Verification Results

**Build Verification:**
- `npm run build` completed successfully with no errors
- Build output: 398.99 kB (gzipped: 93.35 kB)
- 62 modules transformed
- Build time: 809ms

**Content Verification:**
- Confirmed "Pipeline Architecture" title in component
- Confirmed all 6 content sections present (Overview, Pipeline Stages, Pipeline Registers, Control Unit, Execution Timeline, Explore Further)
- Confirmed 5 pipeline stages explained with detailed descriptions
- Confirmed 5 Verilog code snippets (one per stage + pipeline register)
- Confirmed control signal table with 8 instruction types
- Confirmed instruction execution timeline with colored stage cells
- Confirmed breadcrumbs structure
- Confirmed quick links to multdiv, hazards, cpu-docs, GitHub

**Route Verification:**
- /cpu-docs/pipeline route activated in App.jsx
- CpuPipelinePage import uncommented
- Previously activated routes (alu, regfile, multdiv) remain active

## Success Criteria

- [x] CpuPipelinePage.jsx exists with pipeline architecture documentation
- [x] All 5 pipeline stages explained with Verilog snippets
- [x] Pipeline register design documented with flush/stall control
- [x] Control unit signal table included (8 instruction types)
- [x] Instruction execution timeline visualization with colored stages
- [x] Route active at /cpu-docs/pipeline
- [x] Links to GitHub repo
- [x] Breadcrumbs show: Home > CPU Simulator > Documentation > Pipeline Architecture
- [x] Quick links to MultDiv (prev) and Hazards & Forwarding (next)
- [x] 5 Verilog code snippets provided (IF, ID, EX, MEM, WB)
- [x] Build completes without errors
- [x] All task verification criteria met
- [x] File exceeds minimum 250 lines (862 lines total)

## Files Changed

**Created:**
- `src/pages/cpu/CpuPipelinePage.jsx` (862 lines) - Comprehensive Pipeline Architecture documentation with 5-stage pipeline, pipeline registers, control unit signal table, instruction execution timeline, 5 Verilog snippets

**Modified:**
- `src/App.jsx` (+3 lines, -3 lines) - Uncommented CpuPipelinePage import and route

## Next Steps

Remaining plans in Phase 13:
- 13-06: Hazards & Forwarding (CP4) - Hazard detection and data forwarding documentation
- 13-07: Instruction Set & Memory System - ISA and memory architecture documentation

Each subsequent plan will:
1. Create the page component in `src/pages/cpu/`
2. Uncomment the corresponding route in `App.jsx`
3. Follow the same styling pattern as existing CPU doc pages
4. Provide comprehensive technical documentation with Verilog snippets

## Self-Check: PASSED

**Files Created:**
- FOUND: src/pages/cpu/CpuPipelinePage.jsx (862 lines)

**Files Modified:**
- FOUND: src/App.jsx (route activation confirmed)

**Commits Exist:**
- FOUND: 2faa96a (Task 1: Create CpuPipelinePage.jsx)
- FOUND: 36d75cc (Task 2: Activate Pipeline route)

**Build Verification:**
- PASSED: npm run build completed successfully (809ms)
- PASSED: Pipeline content found in build output (398.99 kB bundle)

**Route Verification:**
- PASSED: /cpu-docs/pipeline route registered in App.jsx
- PASSED: CpuPipelinePage import uncommented
- PASSED: Previously activated routes (alu, regfile, multdiv) still present

**Content Verification:**
- PASSED: 5 pipeline stages explained (IF, ID, EX, MEM, WB)
- PASSED: 5 Verilog code snippets provided (one per stage + pipeline register)
- PASSED: Control unit signal table with 8 instruction types present
- PASSED: Instruction execution timeline with colored stage cells present
- PASSED: Pipeline registers section with flush/stall control present
- PASSED: Quick links to multdiv (prev) and hazards (next) present
- PASSED: GitHub link to CPU repo present
- PASSED: File meets minimum line requirement (862 > 250 lines)

All verification criteria met. Plan execution complete.
