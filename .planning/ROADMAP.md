# Roadmap: Technical Project Portfolio

## Milestones

- ✅ **v1.0 Graphics Engine** - Phases 1-8 (shipped 2026-02-11)
- 🚧 **v1.1 CPU Simulator** - Phases 9-15 (in progress)

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
**Plans**: TBD

Plans:
- [ ] 11-01: TBD

#### Phase 12: Hazard Visualization
**Goal**: Pre-scripted hazard sequences demonstrate data dependencies and stalls through animated walkthroughs
**Depends on**: Phase 11
**Requirements**: ANIM-05, VIZ-07, VIZ-08
**Success Criteria** (what must be TRUE):
  1. Hazard sequences include pre-scripted examples showing data dependencies (RAW hazards)
  2. Animation walkthrough shows pipeline stalls occurring when hazards are encountered
  3. Data hazards are highlighted with color-coding during animation playback
  4. Stall bubbles appear in affected pipeline stages during hazard walkthrough frames
**Plans**: TBD

Plans:
- [ ] 12-01: TBD

#### Phase 13: Documentation Foundation
**Goal**: CPU project landing page and foundational documentation pages explaining the visualization
**Depends on**: Phase 12
**Requirements**: DOC-01, DOC-02, DOC-03, DOC-04
**Success Criteria** (what must be TRUE):
  1. CPU project has landing page explaining the animated visualization and linking to demo and docs
  2. Pipeline Basics documentation explains 5-stage pipeline concept (context for animation)
  3. ALU Design documentation explains Carry-Lookahead adder implementation (actual Verilog design)
  4. Instruction Set documentation lists all implemented instructions shown in animations
  5. All doc pages include code snippets from actual Verilog implementation
  6. All doc pages link to GitHub repo for full source code
**Plans**: TBD

Plans:
- [ ] 13-01: TBD

#### Phase 14: Advanced Documentation
**Goal**: Complete documentation with advanced topics explaining hardware implementation behind animations
**Depends on**: Phase 13
**Requirements**: DOC-05, DOC-06, DOC-07, DOC-08
**Success Criteria** (what must be TRUE):
  1. MultDiv documentation explains Booth's multiplication algorithm from Verilog implementation
  2. Advanced Features documentation covers hazards and forwarding (concepts shown in animations)
  3. All documentation pages include code snippets from actual Verilog source
  4. All documentation pages link to GitHub repo with hardware implementation
**Plans**: TBD

Plans:
- [ ] 14-01: TBD

#### Phase 15: Portfolio Integration & Polish
**Goal**: Integrate CPU visualization into portfolio with performance validation and quality checks
**Depends on**: Phase 14
**Requirements**: INT-01, INT-02, INT-03, INT-04, INT-05, PERF-01, PERF-02, PERF-03, QUAL-01, QUAL-02
**Success Criteria** (what must be TRUE):
  1. CPU project card appears on portfolio homepage
  2. CPU demo and documentation pages use existing forest green design system
  3. CPU documentation pages include breadcrumb navigation
  4. CPU pages are integrated into site-wide navigation
  5. CPU project structure matches graphics engine (demo + docs/)
  6. Step-through interactions (animation controls) respond in under 100ms
  7. Demo page loads in under 3 seconds
  8. Animations maintain 30+ FPS during playback
  9. All documentation pages pass WCAG 2.1 AA contrast requirements
  10. Demo controls (step, play, pause, jump) are keyboard-accessible
**Plans**: TBD

Plans:
- [ ] 15-01: TBD

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
| 11. Interactive Demo Page | v1.1 | 0/TBD | Not started | - |
| 12. Hazard Visualization | v1.1 | 0/TBD | Not started | - |
| 13. Documentation Foundation | v1.1 | 0/TBD | Not started | - |
| 14. Advanced Documentation | v1.1 | 0/TBD | Not started | - |
| 15. Portfolio Integration & Polish | v1.1 | 0/TBD | Not started | - |

---
*Roadmap created: 2026-02-11*
*Last updated: 2026-02-11 (Phase 10 re-planned with SVG block diagram approach)*
