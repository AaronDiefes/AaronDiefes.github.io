# Requirements: CPU Simulator Project

**Defined:** 2026-02-11
**Core Value:** Showcase technical depth through interactive project demonstrations with comprehensive documentation.

## Milestone v1.1 Requirements

Requirements for adding CPU simulator to portfolio. Each maps to roadmap phases.

### Core Simulation Engine

- [ ] **SIM-01**: CPU state machine implements 5-stage pipeline (Fetch, Decode, Execute, Memory, Writeback)
- [ ] **SIM-02**: Simulator supports 32 registers (32-bit each) with read/write operations
- [ ] **SIM-03**: Simulator implements data memory (1KB minimum) with load/store capability
- [ ] **SIM-04**: Instruction set includes 8-10 core RISC instructions (add, sub, addi, lw, sw, beq, j, etc.)
- [ ] **SIM-05**: Simulator detects data hazards (RAW dependencies) and inserts stalls
- [ ] **SIM-06**: Program counter tracks current instruction address

### Interactive Demo

- [ ] **DEMO-01**: Demo page provides step-forward control (execute one instruction)
- [ ] **DEMO-02**: Demo page provides step-backward control (rewind one instruction)
- [ ] **DEMO-03**: Demo page provides play/pause controls with adjustable speed
- [ ] **DEMO-04**: Demo page provides reset control (return to program start)
- [ ] **DEMO-05**: Demo page provides jump-to-instruction capability (click on instruction)
- [ ] **DEMO-06**: Demo page includes code editor (textarea) to modify programs
- [ ] **DEMO-07**: Demo page includes 2+ pre-loaded programs (basic instructions + Fibonacci)

### Visualization

- [ ] **VIZ-01**: Pipeline stage visualization shows all 5 stages with current instruction in each
- [ ] **VIZ-02**: Register visualization displays all 32 registers with values
- [ ] **VIZ-03**: Register visualization highlights registers that changed in current cycle
- [ ] **VIZ-04**: Memory visualization shows data memory addresses with values
- [ ] **VIZ-05**: Instruction display shows current instruction with field breakdown (opcode, rs, rt, rd, immediate)
- [ ] **VIZ-06**: Execution state displays cycle count and instruction count
- [ ] **VIZ-07**: Hazard visualization highlights data hazards with color-coding
- [ ] **VIZ-08**: Hazard visualization shows stall bubbles in pipeline stages

### Documentation

- [ ] **DOC-01**: Landing page explains CPU project and links to demo + docs
- [ ] **DOC-02**: Pipeline Basics doc page explains 5-stage pipeline concept
- [ ] **DOC-03**: ALU Design doc page explains Carry-Lookahead adder
- [ ] **DOC-04**: Instruction Set doc page documents all implemented instructions
- [ ] **DOC-05**: MultDiv doc page explains Booth's multiplication algorithm
- [ ] **DOC-06**: Advanced Features doc page covers hazards and forwarding
- [ ] **DOC-07**: All doc pages include code snippets from actual Verilog implementation
- [ ] **DOC-08**: All doc pages link to GitHub repo for full source code

### Portfolio Integration

- [ ] **INT-01**: CPU project integrated into portfolio homepage (project card)
- [ ] **INT-02**: CPU demo page uses existing design system (forest green palette)
- [ ] **INT-03**: CPU documentation pages include breadcrumb navigation
- [ ] **INT-04**: CPU pages integrated into site-wide navigation
- [ ] **INT-05**: CPU project follows same structure as graphics engine (demo + docs/)

### Performance & Quality

- [ ] **PERF-01**: Step-through interactions respond in < 100ms
- [ ] **PERF-02**: Demo page loads in < 3 seconds
- [ ] **PERF-03**: Animations maintain 30+ FPS
- [ ] **QUAL-01**: All documentation pages pass WCAG 2.1 AA contrast requirements
- [ ] **QUAL-02**: Demo controls are keyboard-accessible

## Future Requirements (v2.0+)

Deferred to future milestones. Tracked but not in current roadmap.

### Advanced Features
- **ADV-01**: Forwarding visualization showing data bypass paths
- **ADV-02**: Branch prediction visualization
- **ADV-03**: CPI (cycles per instruction) calculation and display
- **ADV-04**: Performance comparison across programs
- **ADV-05**: Export execution trace to JSON/CSV

### Enhanced Interactivity
- **ENH-01**: Breakpoint support (pause at specific instruction)
- **ENH-02**: Watch expressions for register/memory values
- **ENH-03**: Step-over (skip to next instruction in same function)
- **ENH-04**: Custom instruction set editor

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Multi-core simulation | Adds overwhelming complexity, not core to pipeline education |
| Cache hierarchy visualization | Scope creep - v1.1 focuses on pipeline, not memory hierarchy |
| Comprehensive ISA (full MIPS/RISC-V) | 8-10 instructions demonstrate competence without overwhelming |
| Cycle-accurate timing | Not needed for educational visualization |
| Real Verilog execution | Simulating conceptually, not running actual hardware |
| Assembly compiler | Use pre-assembled examples, not building a toolchain |
| Mobile-first responsive | Portfolio is desktop-first, mobile enhancement is v2.0+ |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| (To be filled by roadmapper) | — | — |

**Coverage:**
- Milestone v1.1 requirements: 35 total
- Mapped to phases: (pending roadmap)
- Unmapped: (pending roadmap)

---
*Requirements defined: 2026-02-11*
*Last updated: 2026-02-11 after initial definition*
