# Project Research Summary

**Project:** CPU Simulator Visualization
**Domain:** Interactive Educational Visualization
**Researched:** 2026-02-11
**Confidence:** HIGH

## Executive Summary

Educational CPU simulators are built using three-layer architecture: presentation (controls + UI), simulation (CPU state machine with pipeline, registers, ALU), and visualization (Canvas API rendering). The recommended approach is vanilla JavaScript with HTML5 Canvas for performance, avoiding framework overhead for a static GitHub Pages portfolio site. This matches the existing graphics-demo.html pattern and delivers sub-100ms step-through interactivity.

The critical success factors are: (1) choosing the right abstraction level—instruction-cycle visualization, not gate-level detail, targeted at recruiters and CS students, (2) progressive disclosure to avoid cognitive overload (users have 8-47 second attention spans), and (3) tight MVP scope (8-10 instructions maximum) to ship a polished demo rather than an incomplete feature-rich simulator. The MVP focuses on demonstrating 5-stage pipeline with hazard detection, which showcases technical depth without scope creep.

Key risks include performance degradation from animation lag (mitigate with GPU-accelerated CSS transforms and requestAnimationFrame), documentation-demo mismatch (mitigate with single source of truth and screenshot automation), and non-technical audience barriers (mitigate with annotated walkthroughs for recruiters). The research indicates high confidence in stack and architecture choices, with standard patterns available from existing educational simulators (QtRvSim, EduMIPS64, RISC-V Visualizer).

## Key Findings

### Recommended Stack

Vanilla JavaScript (ES2024+) with Vite build tooling provides optimal performance for static GitHub Pages hosting while matching the existing portfolio pattern. The stack avoids framework overhead (React/Vue add 100KB+ with minimal benefit) and enables direct Canvas API manipulation for 60fps animations.

**Core technologies:**
- **Vanilla JavaScript (ES2024+)**: Core simulation logic and state management — no framework overhead, perfect for static hosting, matches graphics-demo.html pattern
- **HTML5 Canvas API**: CPU pipeline stage visualization — superior performance vs SVG (handles complex animations without DOM overhead), hardware-accelerated rendering
- **SVG**: Interactive UI controls and register/memory displays — excellent for static elements needing hover/click, crisp at any zoom level
- **Vite 7.3.1**: Build tool and dev server — fast HMR during development, optimized production builds, zero config for vanilla JS, official GitHub Pages deployment guide

**Supporting libraries:**
- **D3.js 7.9.0**: Data-driven DOM manipulation for register/memory views (NOT full visualization—too heavy)
- **Prism.js 1.29.0**: Assembly code syntax highlighting (2KB core vs Monaco Editor's 5-10MB)
- **Immer.js 11.1.4**: Immutable state updates for step-through with undo/redo capabilities

**Critical version requirements:**
- Vite requires Node 18+, D3 and Immer require ES2015+ browsers (no IE11 support, acceptable for 2025)

### Expected Features

Research of established CPU simulators (QtRvSim, EduMIPS64, CPU Visual Simulator) reveals clear feature expectations.

**Must have (table stakes):**
- Step-through execution controls (step, run, pause, reset) — cannot demonstrate execution without control
- Register visualization (32 registers, highlight changes) — users expect to observe state
- Memory visualization (data memory addresses) — core state observation requirement
- Pipeline stage visualization (5 stages: F→D→E→M→W) — fundamental pipelining concept
- Instruction display (current instruction with field breakdown) — understanding what executes
- Execution state tracking (cycle count, instruction count) — track progress
- Pre-loaded example programs (basic operations + Fibonacci) — ready-to-use learning
- Code editor (simple textarea with load button) — ability to modify examples
- Basic hazard visualization (highlight data hazards, show stalls) — critical for understanding real pipeline limitations

**Should have (competitive differentiators):**
- Data forwarding visualization — shows how modern CPUs optimize around hazards (high educational value)
- Animation between pipeline stages — makes abstract flow concrete, increases engagement (65% of learners are visual)
- Speed control slider — user controls pace from slow learning to fast testing
- Execution statistics (CPI, stall counts, hazard counts) — quantifies performance concepts
- Interactive register/memory editing — enables "what-if" experimentation
- ALU operation visualization — shows "5 + 3 = 8" with internal steps (unique to this implementation)

**Defer (v2+):**
- Instruction timing diagram (high complexity, academic tool territory)
- Breakpoint support (useful but adds debugging complexity)
- Instruction history/trace (storage and UI complexity)
- Architecture comparison mode (sequential vs pipelined—demonstrates value but requires building two CPUs)
- Syntax validation (nice-to-have, not essential for learning)
- Tutorial/guided tour (better after interface stabilizes)

**Anti-features (explicitly avoid):**
- Full RISC-V/MIPS ISA support (scope creep—focus on 8-15 instruction subset demonstrating categories)
- Cycle-accurate microarchitecture (too low-level, becomes hardware design tool not educational visualizer)
- Multi-core/threading visualization (exponential complexity, separate educational topic)
- Cache hierarchy visualization (separate topic, memory abstraction sufficient)
- Out-of-order execution (too advanced, graduate-level topic)

### Architecture Approach

Educational CPU simulators follow a proven three-layer separation: presentation layer (demo page with controls), simulation layer (CPU state machine), and visualization layer (component-based Canvas renderers). This architecture enables independent development of simulation logic (testable without DOM) and visualization (multiple views of same state).

**Major components:**
1. **CPU State Machine** (cpu-simulator.js) — Core simulation logic with observable state pattern: executes instructions cycle-by-cycle, maintains pipeline/register/memory state, notifies observers on state changes
2. **Component Visualizers** (cpu-visualizer.js) — Modular rendering classes: PipelineVisualizer (5-stage boxes with instruction labels), RegisterFileVisualizer (32 registers with read/write highlighting), MemoryVisualizer (data memory grid)
3. **Simulator Controller** (cpu-demo-ui.js) — UI control logic: step/run/pause/reset controls, speed slider, program loading, coordinates state machine and visualizers
4. **Documentation Pages** (docs/cpu/*.html) — Progressive learning path: pipeline-basics → alu-operations → instruction-set → hazards-forwarding → advanced-topics

**Recommended structure:**
```
cpu-demo.html                    # Interactive demo (matches graphics-demo.html)
docs/cpu/
  ├── index.html                 # CPU docs landing
  ├── pipeline-basics.html       # Phase 1: Understanding Pipeline
  ├── alu-operations.html        # Phase 2: ALU Operations
  ├── instruction-set.html       # Phase 3: Complete ISA
  ├── hazards-forwarding.html    # Phase 4: Hazards & Forwarding
  └── advanced-topics.html       # Phase 5: Branch Prediction, etc.
docs/assets/
  ├── css/ (reuse design-system.css, nav.css, breadcrumbs.css)
  └── js/ (cpu-simulator.js, cpu-visualizer.js, cpu-demo-ui.js)
```

**Key patterns:**
- **State Machine with Observable State**: CPU simulator emits state changes, visualizers subscribe and update (clean separation, testable independently)
- **Component-Based Visualization**: Each CPU component has dedicated visualizer class (modular, show/hide independently)
- **Progressive Disclosure in Documentation**: Start simple (no hazards), add complexity progressively (matches learning curve)
- **Step-Through Execution Control**: UI provides step/run/pause/reset (learners control pacing for "aha moments")

**Integration with existing portfolio:**
- Reuse design-system.css (green gradient `#2E7D32` to `#1B5E20`, typography, spacing)
- Reuse nav.css and breadcrumbs.css for site-wide navigation
- Add CPU project card to index.html Featured Projects section
- Follow graphics-demo.html pattern: single HTML page, inline/shared CSS, Canvas-based visualization

### Critical Pitfalls

Research identified six critical pitfalls with specific prevention strategies:

1. **Abstraction Level Mismatch** — Simulator shows too much detail (register-transfer level, gate operations) or too little (oversimplified black box), failing to match audience mental model. **Prevention**: Define target audience explicitly (recruiters + CS students), focus on instruction-cycle level (not gate-level), show pipeline stages and register state changes without simulating every transistor. **Warning signs**: User can't explain what happened after watching, requires Verilog knowledge to understand.

2. **Performance Degradation (Animation Lag)** — Visualizations become choppy or unresponsive as execution progresses, frame rates drop below 30fps. **Prevention**: Use CSS transform/opacity for animations (GPU-accelerated), avoid animating left/top (forces layout recalculation), use requestAnimationFrame, profile with Chrome DevTools Performance tab early, test on older hardware. **Warning signs**: >100ms frame times, CPU usage spikes to 100%, memory grows unbounded.

3. **Documentation-Demo Mismatch** — Documentation describes features the demo lacks, uses different terminology, shows outdated screenshots. **Prevention**: Single source of truth (code generates docs), screenshot automation, consistent glossary, link docs to demo state via URL parameters, review checklist before completing features. **Warning signs**: Docs reference "Step" button but UI says "Next", example code doesn't work when pasted.

4. **Unclear Educational Path (Cognitive Overload)** — User sees dozens of controls with no guidance, information density too high, no progression from simple to complex. **Prevention**: Progressive disclosure (start minimal, reveal on demand), guided first-run experience, default to simplified view with "Show Advanced" option, limit initial state to 3-4 key registers, provide preset examples demonstrating one concept each. **Warning signs**: More than 10 controls visible on load, no default example, analytics show >70% bounce rate in first minute.

5. **Over-Scoped First Version** — Project attempts multiple ISAs, full instruction sets, interrupts, multi-core, cache simulation in MVP, development drags on for months without shippable state. **Prevention**: Define MVP in writing (8-10 core instructions maximum), create "not doing" list explicitly, choose ONE simple ISA subset, timebox to 2-3 weeks, focus on depth in narrow scope, ship working subset then iterate. **Warning signs**: Feature list keeps growing, "just one more instruction" syndrome, no working end-to-end demo after 2 weeks.

6. **Non-Technical Audience Barriers** — Recruiters or hiring managers can't evaluate technical depth because presentation assumes deep prior knowledge, uses jargon without explanation. **Prevention**: Provide "recruiter mode" with annotated walkthrough, 1-2 minute video demo with narration, add "Why This Matters" section explaining skill demonstration, label everything (no unlabeled binary values), preset examples with explanations, architecture diagram with plain language annotations. **Warning signs**: Acronyms (PC, IR, ALU) without expansion, no introduction for new visitors, missing context about real-world relevance.

## Implications for Roadmap

Based on combined research, suggested 6-phase structure with clear dependencies and rationale:

### Phase 1: Foundation (Core Simulation Engine)
**Rationale:** Need working CPU model before visualization makes sense. Establishes abstraction level and prevents scope creep by defining exact instruction set upfront. Addresses "over-scoped MVP" and "abstraction mismatch" pitfalls.

**Delivers:**
- CPU state machine (5-stage pipeline, register file, memory model)
- Basic instruction set (8-10 instructions: ADD, SUB, AND, OR, ADDI, LW, SW, BEQ, J)
- Step-through execution logic

**Addresses features:**
- Execution state tracking (table stakes)
- Step-through controls (table stakes—backend logic)

**Avoids pitfalls:**
- Over-scoped MVP (explicit instruction limit)
- Abstraction mismatch (define level in design spec)

**Research flag:** SKIP research-phase — standard state machine pattern, well-documented in existing simulators

---

### Phase 2: Core Visualization (Canvas Rendering)
**Rationale:** Build on working simulator with basic visualization pipeline, establish performance patterns early. Must validate 60fps animation before adding complexity. Addresses "performance degradation" pitfall.

**Delivers:**
- Pipeline visualizer (5-stage boxes with instruction labels)
- Register file visualizer (32 registers, highlight changes)
- Basic Canvas rendering with GPU-accelerated animations

**Uses stack:**
- HTML5 Canvas API (core rendering)
- CSS transforms (GPU-accelerated animations)
- requestAnimationFrame (smooth animation timing)

**Addresses features:**
- Pipeline stage visualization (table stakes)
- Register visualization (table stakes)

**Avoids pitfalls:**
- Performance degradation (profile early, use GPU-accelerated properties)

**Research flag:** SKIP research-phase — Canvas patterns well-established, existing graphics-demo.html provides reference

---

### Phase 3: Interactive Demo Page
**Rationale:** Complete user-facing demo with controls, enabling end-to-end testing. Implements progressive disclosure to avoid cognitive overload. Addresses "unclear educational path" pitfall.

**Delivers:**
- cpu-demo.html page structure
- UI controls (step, run, pause, reset, speed slider)
- Memory visualizer (data memory grid)
- Pre-loaded example programs (basic operations, Fibonacci)

**Implements architecture:**
- Simulator Controller component
- Observable state pattern connecting state machine to visualizers

**Addresses features:**
- Step-through controls (table stakes—UI implementation)
- Memory visualization (table stakes)
- Pre-loaded programs (table stakes)
- Code editor (table stakes—simple textarea)
- Speed control slider (differentiator)

**Avoids pitfalls:**
- Cognitive overload (progressive disclosure, guided first run)
- Performance (validation with full demo)

**Research flag:** SKIP research-phase — UI patterns standard, existing portfolio provides design system

---

### Phase 4: Documentation Foundation
**Rationale:** Establish learning path structure and ensure design consistency before expanding features. Creates framework for preventing "documentation-demo mismatch." Documentation informs what features matter most.

**Delivers:**
- docs/cpu/index.html (landing page)
- docs/cpu/pipeline-basics.html (first educational page)
- Navigation integration (breadcrumbs, site nav updates)
- Screenshot automation infrastructure

**Implements architecture:**
- Progressive disclosure pattern in documentation
- Integration with existing design system (design-system.css, nav.css)

**Addresses features:**
- Documentation requirements (implicit table stakes for educational tool)

**Avoids pitfalls:**
- Documentation-demo mismatch (establish process early)
- Non-technical barriers (annotated content for recruiters)

**Research flag:** SKIP research-phase — Documentation structure modeled after existing docs/index.html

---

### Phase 5: Advanced Visualization (Hazards & Forwarding)
**Rationale:** Most complex concepts require all previous work. Hazard detection is competitive differentiator and critical educational value. This phase demonstrates deep technical understanding for recruiters.

**Delivers:**
- Data hazard detection in simulator
- Forwarding paths in visualization (animated arrows showing EX→EX, MEM→EX forwarding)
- Hazard highlighting (color-coded data hazards, stall indicators)
- Execution statistics dashboard (CPI, stall counts, hazard counts)
- docs/cpu/hazards-forwarding.html

**Addresses features:**
- Hazard detection visualization (table stakes for pipelined CPU)
- Data forwarding visualization (differentiator)
- Execution statistics (differentiator)

**Avoids pitfalls:**
- Abstraction mismatch (hazards demonstrate why pipelines aren't perfect—key educational insight)

**Research flag:** NEEDS research-phase — Forwarding visualization patterns less standard, may need specific implementation research for optimal rendering (arrows vs highlighting vs data paths)

---

### Phase 6: Polish & Portfolio Integration
**Rationale:** User experience enhancements after core functionality complete. Makes project recruiter-ready with clear value proposition. Addresses "non-technical audience barriers."

**Delivers:**
- Remaining documentation pages (alu-operations.html, instruction-set.html, advanced-topics.html)
- Interactive register/memory editing (differentiator)
- ALU operation visualization (differentiator—unique to this implementation)
- Update index.html with CPU project card
- "Why This Matters" annotation for recruiters
- 1-2 minute demo video with narration
- Keyboard shortcuts (enhancer)
- Download/share programs (enhancer)

**Addresses features:**
- Interactive editing (differentiator)
- ALU visualization (differentiator)
- Multiple documentation pages (complete learning path)

**Avoids pitfalls:**
- Non-technical barriers (recruiter-focused presentation)
- Documentation-demo mismatch (complete sync between demo and docs)

**Research flag:** SKIP research-phase — Polish phase uses established patterns from earlier phases

---

### Phase Ordering Rationale

**Dependency-driven ordering:**
- Phase 1 (simulation) must precede Phase 2 (visualization)—can't visualize non-existent state
- Phase 2 must precede Phase 3 (demo page)—need working visualizers before building controls
- Phase 4 (documentation) comes after working demo exists—prevents documenting changing features
- Phase 5 (advanced features) requires all previous phases—hazards interact with entire system
- Phase 6 (polish) comes last—enhances completed core functionality

**Pitfall avoidance sequencing:**
- Early phase (Phase 1) prevents over-scoping by defining exact MVP boundaries
- Mid-phase (Phase 2) addresses performance early before complexity increases
- Mid-phase (Phase 3) implements progressive disclosure while feature set is manageable
- Later phase (Phase 5) tackles most complex features only after foundation solid
- Final phase (Phase 6) addresses non-technical audience after technical depth proven

**Architecture-informed grouping:**
- Phases 1-2 build Simulation + Visualization layers (backend)
- Phase 3 completes Presentation layer (frontend)
- Phase 4 establishes Documentation system (support)
- Phase 5 adds Advanced Simulation features (depth)
- Phase 6 integrates with Portfolio (context)

### Research Flags

**Phases likely needing deeper research during planning:**
- **Phase 5 (Advanced Visualization)**: Forwarding path rendering patterns less standardized across existing simulators—may need specific Canvas animation research for optimal arrow/highlighting approach. Complex interaction between hazard detection and visualization state.

**Phases with standard patterns (skip research-phase):**
- **Phase 1 (Foundation)**: State machine architecture well-documented in existing CPU simulators (QtRvSim, EduMIPS64), pipeline models established
- **Phase 2 (Core Visualization)**: Canvas rendering patterns proven in graphics-demo.html, GPU-accelerated animation well-documented
- **Phase 3 (Interactive Demo)**: UI control patterns standard across educational simulators, existing portfolio provides design system reference
- **Phase 4 (Documentation)**: Documentation structure mirrors existing docs/index.html, progressive learning patterns researched
- **Phase 6 (Polish)**: Enhancement patterns established in earlier phases, portfolio integration follows existing project cards

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Core technologies verified with official docs (Vite 7.3.1, D3 7.9.0, Immer 11.1.4), Canvas vs SVG performance comparison from multiple sources, existing portfolio uses same patterns |
| Features | HIGH | Based on analysis of 5+ established educational CPU simulators (QtRvSim, EduMIPS64, RISC-V Visualizer, CPU Visual Simulator), feature prioritization validated by academic research on visualization best practices |
| Architecture | HIGH | Three-layer architecture (presentation/simulation/visualization) proven across multiple existing simulators, component boundaries clear, integration with existing portfolio straightforward |
| Pitfalls | MEDIUM | Pitfall patterns identified from educational simulator research and visualization best practices, but some prevention strategies inferred from general web performance principles rather than CPU-specific sources |

**Overall confidence:** HIGH

Research is comprehensive with official documentation for stack choices, detailed analysis of existing simulators for features and architecture, and evidence-based pitfall identification. The domain (educational CPU visualization) has established patterns and multiple reference implementations.

### Gaps to Address

**Performance benchmarking specifics:**
- Research identified GPU-accelerated animation requirements but didn't provide specific Canvas operation benchmarks
- **Handle during**: Phase 2 (Core Visualization)—profile early with realistic data (32 registers, 5 pipeline stages), establish 60fps budget before adding complexity

**Forwarding path visualization patterns:**
- Research found that existing simulators use different approaches (arrows, highlighting, separate data path diagrams) but no consensus on "best" approach
- **Handle during**: Phase 5 planning—may need brief research phase to evaluate visual approaches, or implement simplest (highlighting) then iterate based on user feedback

**Recruiter evaluation criteria:**
- Research identified need for "recruiter mode" but based on general portfolio advice, not CPU simulator-specific feedback
- **Handle during**: Phase 6—can iterate based on feedback from portfolio reviews, not critical for MVP launch

**Mobile responsive design priority:**
- Research noted 50% of portfolio traffic is mobile but didn't specify CPU simulator mobile usage patterns (may be primarily desktop tool)
- **Handle during**: Phase 3 or Phase 6—validate whether mobile optimization is essential for MVP or can be deferred, likely defer given educational context (typically desktop)

**Testing on target hardware:**
- Pitfall research emphasized testing on older hardware, but didn't specify minimum viable specifications
- **Handle during**: All phases—test on 3-5 year old hardware, define minimum spec (e.g., 2019 MacBook Air, 4GB RAM as baseline)

## Sources

### Primary (HIGH confidence)

**Official Documentation:**
- Vite 7.3.1: https://vite.dev/guide/ (verified features, GitHub Pages deployment)
- D3.js 7.9.0: https://d3js.org/ (official site, API documentation)
- Immer 11.1.4: https://immerjs.github.io/immer/ + GitHub releases
- Canvas API: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
- localStorage API: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

**Established CPU Simulators (comparative analysis):**
- QtRvSim (RISC-V): https://deepwiki.com/cvut/qtrvsim/1-overview
- RISC-V CPU Visualizer: https://risc-v-cpu-visualizer.vercel.app/
- EduMIPS64 (MIPS64): https://edumips.org/
- CPU Visual Simulator (jcancelli): https://github.com/jcancelli/cpu-visual-simulator

**Existing Portfolio (verified patterns):**
- graphics-demo.html uses vanilla JS + Canvas pattern (read from /Users/orases/Aaron/website/graphics-demo.html)
- Green color scheme `#2E7D32` to `#1B5E20` (verified line 19)

### Secondary (MEDIUM confidence)

**Performance & Animation:**
- Canvas vs SVG performance: https://blog.openreplay.com/svg-vs-canvas--a-comparison/ + https://frontendmasters.com/courses/d3/svg-vs-html5-canvas/
- GPU vs CPU animations: https://www.erwinhofman.com/blog/website-performance-laggy-animations-gpu-vs-cpu/
- Animation optimization: https://web.dev/articles/animations-overview

**Educational Visualization Best Practices:**
- PSE CPU Visualization Tool: https://www.ece.lsu.edu/koppel/pse/
- Teaching computer architecture via simulation: https://pmc.ncbi.nlm.nih.gov/articles/PMC10909196/
- Pedagogical design principles: https://www.tandfonline.com/doi/full/10.1080/10494820.2025.2523390
- Data visualization principles: https://pmc.ncbi.nlm.nih.gov/articles/PMC7733875/

**Feature Prioritization:**
- Data hazards visualization: https://cca.informatik.uni-freiburg.de/riscv-simulator/datahazards.html
- WebRISC-V pipeline simulator: https://arxiv.org/html/2504.03722v1
- ASM Visualizer: https://asm.diveintosystems.org/

**CodeMirror vs Monaco comparison:**
- https://agenthicks.com/research/codemirror-vs-monaco-editor-comparison
- https://sourcegraph.com/blog/migrating-monaco-codemirror

**Prism vs Highlight.js benchmarks:**
- https://github.com/highlightjs/highlight.js/issues/3625
- https://www.peterbe.com/plog/benchmark-compare-highlight.js-vs-prism

### Tertiary (LOW confidence, needs validation)

**User Attention Span Statistics:**
- 47 seconds average web attention span (2025): https://devrix.com/tutorial/user-attention-span/
- 8.25 seconds for social media-trained users: https://sqmagazine.co.uk/social-media-attention-span-statistics/
- 65% visual learners: common educational psychology claim, needs academic source validation

**Recruiter Portfolio Evaluation:**
- https://www.nucamp.co/blog/coding-bootcamp-job-hunting-selecting-projects-for-your-portfolio-what-recruiters-look-for
- https://tietalent.com/en/blog/220/beyond-the-ats-how-to-build-a-tech-portfolio
- (Based on general portfolio advice, not CPU simulator-specific)

**Vanilla JS State Management Patterns:**
- https://medium.com/@chirag.dave/state-management-in-vanilla-js-2026-trends-f9baed7599de
- (Single source, 2026 dated but needs validation)

---
*Research completed: 2026-02-11*
*Ready for roadmap: yes*
