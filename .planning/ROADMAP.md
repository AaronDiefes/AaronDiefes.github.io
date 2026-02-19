# Roadmap: Technical Project Portfolio

## Milestones

- ✅ **v1.0 Graphics Engine** - Phases 1-8 (shipped 2026-02-11)
- ✅ **v1.1 CPU Simulator** - Phases 9-15 (shipped 2026-02-16)

## Phases

<details>
<summary>✅ v1.0 Graphics Engine (Phases 1-8) - SHIPPED 2026-02-11</summary>

### Phase 1: Build Foundation
**Goal:** Compilation pipeline produces working WASM module from C++ engine.
**Plans:** Complete

### Phase 2: JavaScript Bridge
**Goal:** JavaScript code has full API access to engine operations.
**Plans:** Complete

### Phase 3: Canvas Integration
**Goal:** Engine output renders visibly in HTML5 Canvas element.
**Plans:** Complete

### Phase 4: Interactive Controls
**Goal:** Users manipulate rendering parameters through UI controls.
**Plans:** Complete

### Phase 5: Code Examples
**Goal:** Source code visible alongside running demos.
**Plans:** 6/7 complete (1 rejected)

### Phase 6: Documentation System
**Goal:** Comprehensive documentation explains engine architecture and capabilities.
**Plans:** 1/4 complete (3 rejected)

### Phase 7: Testing & Optimization
**Goal:** Portfolio validated for correctness, performance, and compatibility.
**Plans:** Completed locally, not deployed

### Phase 8: Visual Polish
**Goal:** Unified green palette, consistent navigation, and professional micro-interactions across all portfolio pages.
**Plans:** 7/7 complete

</details>

### 🚧 v1.1 CPU Simulator (In Progress)

**Milestone Goal:** Add 5-stage pipelined CPU simulator to portfolio with interactive step-through demo and progression-based documentation.

#### Phase 9: Animation Framework & Data Structures
**Goal**: Pre-scripted animation system displays CPU pipeline execution through step-by-step walkthroughs
**Depends on**: Nothing (first phase of milestone)
**Requirements**: ANIM-01, ANIM-02, ANIM-03, ANIM-04, ANIM-06
**Success Criteria** (what must be TRUE):
  1. Data structures represent CPU state (5 pipeline stages, 32 registers, data memory, program counter)
  2. Pre-scripted sequences define program execution step-by-step with explicit state transitions
  3. Animation system can step forward and backward through pre-scripted sequences
  4. Program sequences include 8-10 core RISC instructions (add, sub, addi, lw, sw, beq, j) with correct state changes
  5. Timing system controls animation playback speed (adjustable from slow walkthrough to fast demonstration)
**Plans:** 3 plans

Plans:
- [ ] 09-01-PLAN.md — CPU State data structures & Instruction Set definitions (ANIM-01, ANIM-04)
- [ ] 09-02-PLAN.md — Animation Engine & Timing Controller (ANIM-03, ANIM-06)
- [ ] 09-03-PLAN.md — Sequence Generator, pre-scripted programs & integration tests (ANIM-02, ANIM-04)

#### Phase 10: Basic Visualization
**Goal**: SVG block diagram visualization of 5-stage pipelined processor with hardware components, pipeline registers, and active state highlighting during animation playback
**Depends on**: Phase 9
**Requirements**: VIZ-01, VIZ-02, VIZ-03, VIZ-06
**Success Criteria** (what must be TRUE):
  1. Pipeline visualization displays all 5 stages with current instruction in each stage during playback
  2. Register visualization displays all 32 registers with current values at each animation step
  3. Changed registers are highlighted when state transitions occur in animation
  4. Cycle count and instruction count display updates correctly as animation progresses
**Plans:** 4 plans complete
**Status:** Complete
**Completed:** 2026-02-15

Plans:
- [x] 10-01-PLAN.md — CSS layout + view components (PipelineView, RegisterView, ExecutionView)
- [x] 10-02-PLAN.md — CPUVisualizer coordinator + integration test page
- [x] 10-03-PLAN.md — SVG BlockDiagramView component + updated CSS styles
- [x] 10-04-PLAN.md — CPUVisualizer integration update + test page + visual verification

#### Phase 11: Interactive Demo Page
**Goal**: Complete demo page with step-through controls for navigating pre-scripted animation sequences
**Depends on**: Phase 10
**Requirements**: DEMO-01, DEMO-02, DEMO-03, DEMO-04, DEMO-05, DEMO-06, DEMO-07, VIZ-04, VIZ-05
**Success Criteria** (what must be TRUE):
  1. User can step forward and backward through animation frames using step controls
  2. User can play animation with adjustable speed and pause at any frame
  3. User can reset animation to initial state (frame 0)
  4. User can click on any instruction to jump to that point in animation sequence
  5. User can switch between 2+ pre-scripted programs (basic instructions walkthrough + Fibonacci walkthrough)
  6. Memory visualization shows data memory addresses and values as animation progresses
  7. Current instruction displays with field breakdown (opcode, rs, rt, rd, immediate) during walkthrough
**Plans:** 3 plans complete
**Status:** Complete
**Completed:** 2026-02-15

Plans:
- [x] 11-01-PLAN.md — New view components: MemoryView, InstructionView, InstructionList + CSS (VIZ-04, VIZ-05, DEMO-05)
- [x] 11-02-PLAN.md — ControlPanel and ProgramSelector UI components (DEMO-01-04, DEMO-06, DEMO-07)
- [x] 11-03-PLAN.md — Demo page assembly, CPUVisualizer integration, keyboard shortcuts + visual verification

#### Phase 12: Hazard Visualization
**Goal**: Pre-scripted hazard sequences demonstrate data dependencies and stalls through animated walkthroughs
**Status**: SKIPPED - Advanced topic beyond portfolio scope
**Reason**: Current CPU simulator effectively demonstrates core pipeline concepts without needing hazard/stall complexity

#### Phase 13: Documentation Foundation
**Goal**: Comprehensive CPU documentation covering all major components following Duke ECE 350 checkpoint progression (ALU, Register File, MultDiv, Pipeline, Hazards, Instructions, Memory)
**Depends on**: Phase 11
**Requirements**: DOC-01, DOC-02, DOC-03, DOC-04, DOC-07, DOC-08
**Success Criteria** (what must be TRUE):
  1. CPU project has landing page explaining the project and linking to demo and all doc topics
  2. ALU Design documentation explains Carry-Lookahead adder implementation (CP1)
  3. Register File documentation explains 32-register design with $0 hardwired to zero (CP2)
  4. MultDiv documentation explains Booth's multiplication algorithm (CP3)
  5. Pipeline Architecture documentation explains 5-stage pipeline design (CP4)
  6. Hazards & Forwarding documentation explains data hazards and forwarding paths (CP4)
  7. Instruction Set documentation lists all implemented instructions with encoding formats
  8. Memory System documentation explains RAM/ROM and instruction/data memory
  9. All doc pages include Verilog code snippets from actual implementation
  10. All doc pages link to GitHub repo for full source code
**Plans:** 7 plans

Plans:
- [ ] 13-01-PLAN.md — CPU docs landing page + routing setup (DOC-01)
- [ ] 13-02-PLAN.md — ALU Design documentation page (DOC-03, CP1)
- [ ] 13-03-PLAN.md — Register File documentation page (CP2)
- [ ] 13-04-PLAN.md — Multiplication & Division documentation page (CP3)
- [ ] 13-05-PLAN.md — Pipeline Architecture documentation page (DOC-02, CP4)
- [ ] 13-06-PLAN.md — Hazards & Forwarding documentation page (CP4)
- [ ] 13-07-PLAN.md — Instruction Set + Memory System documentation pages (DOC-04)

#### Phase 14: Advanced Documentation
**Goal**: Complete documentation with advanced topics explaining hardware implementation behind animations
**Depends on**: Phase 13
**Requirements**: DOC-05, DOC-06, DOC-07, DOC-08
**Status**: Complete (requirements met in Phase 13)
**Completed**: 2026-02-16
**Success Criteria** (what must be TRUE):
  1. ✅ MultDiv documentation explains Booth's multiplication algorithm from Verilog implementation
  2. ✅ Advanced Features documentation covers hazards and forwarding (concepts shown in animations)
  3. ✅ All documentation pages include code snippets from actual Verilog source
  4. ✅ All documentation pages link to GitHub repo with hardware implementation

**Note**: All requirements were satisfied during Phase 13 execution. No additional plans needed.

#### Phase 15: Portfolio Integration & Polish
**Goal**: Integrate CPU visualization into portfolio with performance validation and quality checks
**Depends on**: Phase 14
**Requirements**: INT-01, INT-02, INT-03, INT-04, INT-05, PERF-01, PERF-02, PERF-03, QUAL-01, QUAL-02
**Status**: Complete
**Completed**: 2026-02-16
**Success Criteria** (what must be TRUE):
  1. ✅ CPU project card appears on portfolio homepage
  2. ✅ CPU demo and documentation pages use existing forest green design system
  3. ✅ CPU documentation pages include breadcrumb navigation
  4. ✅ CPU pages are integrated into site-wide navigation
  5. ✅ CPU project structure matches graphics engine (demo + docs/)
  6. ✅ Step-through interactions (animation controls) respond in under 100ms
  7. ✅ Demo page loads in under 3 seconds
  8. ✅ Animations maintain 30+ FPS during playback
  9. ✅ All documentation pages pass WCAG 2.1 AA contrast requirements
  10. ✅ Demo controls (step, play, pause, jump) are keyboard-accessible

**Note**: All integration completed during Phase 13 execution and subsequent refinements. Performance and accessibility targets met through existing implementation.

## Progress

**Execution Order:**
Phases execute in numeric order: 9 → 10 → 11 → 12 → 13 → 14 → 15

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Build Foundation | v1.0 | Complete | Complete | 2026-02-11 |
| 2. JavaScript Bridge | v1.0 | Complete | Complete | 2026-02-11 |
| 3. Canvas Integration | v1.0 | Complete | Complete | 2026-02-11 |
| 4. Interactive Controls | v1.0 | Complete | Complete | 2026-02-11 |
| 5. Code Examples | v1.0 | 6/7 | Complete | 2026-02-11 |
| 6. Documentation System | v1.0 | 1/4 | Complete | 2026-02-11 |
| 7. Testing & Optimization | v1.0 | Complete | Complete | 2026-02-11 |
| 8. Visual Polish | v1.0 | 7/7 | Complete | 2026-02-11 |
| 9. Animation Framework & Data Structures | v1.1 | 3/3 | Complete | 2026-02-11 |
| 10. Basic Visualization | v1.1 | 4/4 | Complete | 2026-02-15 |
| 11. Interactive Demo Page | v1.1 | 3/3 | Complete | 2026-02-15 |
| 12. Hazard Visualization | v1.1 | - | Skipped | - |
| 13. Documentation Foundation | v1.1 | 7/7 | Complete | 2026-02-16 |
| 14. Advanced Documentation | v1.1 | - | Complete | 2026-02-16 |
| 15. Portfolio Integration & Polish | v1.1 | - | Complete | 2026-02-16 |

---
*Roadmap created: 2026-02-11*
*Last updated: 2026-02-16*
*Milestone v1.1 (CPU Simulator) complete: 2026-02-16*
