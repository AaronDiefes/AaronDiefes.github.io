# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-11)

**Core value:** Showcase technical depth through interactive project demonstrations with comprehensive documentation
**Current focus:** Milestone v1.2 (CS330 Case Study) - Defining requirements

## Current Position

Milestone: v1.2 CS330 Case Study
Phase: Not started (defining requirements)
Status: Defining requirements
Last activity: 2026-02-16 — Milestone v1.2 started

Progress: [░░░░░░░░░░░░░░░░░░░░] 0% (milestone just started)

## Performance Metrics

**Velocity:**
- Total plans completed: 15 (Phases 9-11, 13 complete)
- Average duration: 2 min 39 sec
- Total execution time: 40 min 34 sec

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| v1.0 (Phases 1-8) | Complete | N/A | N/A |
| Phase 9 | 3 | 7m 40s | 2m 33s |
| Phase 10 | 3 | 6m 53s | 2m 18s |
| Phase 11 | 2 | 4m 8s | 2m 4s |
| Phase 13 | 7 | 21m 53s | 3m 8s |

**Recent Trend:**
- 09-03: 3m 19s (sequence generator and programs)
- 10-01: 2m 5s (visualization components)
- 10-02: 2m 16s (CPUVisualizer coordinator and tests)
- 10-03: 2m 32s (SVG block diagram view)
- 11-01: 2m 38s (MemoryView, InstructionView, InstructionList)
- 11-02: 1m 30s (UI control components)
- 13-01: 2m 18s (CPU docs landing page)
- 13-02: 2m 27s (ALU Design documentation)
- 13-03: 2m 37s (Register File documentation)
- 13-04: 2m 47s (Multiplication & Division documentation)
- 13-05: 3m 22s (Pipeline Architecture documentation)
- 13-06: 3m 25s (Hazards & Forwarding documentation)
- 13-07: 5m 3s (Instructions & Memory reference documentation)

*Consistent execution velocity maintained*
| Phase 13 P07 | 303 | 3 tasks | 3 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- v1.0: Unified forest green design system (#2E7D32 primary)
- v1.0: Vanilla JS + WASM for graphics engine demos
- v1.0: Portfolio-centric navigation with breadcrumbs
- v1.1: CPU simulator will use vanilla JavaScript (no framework)
- v1.1: 5-stage pipeline with hazard detection (8-10 instruction subset)
- v1.1: Follows same structure as graphics engine (demo + docs/)
- 09-01: structuredClone() for state deep copying instead of Object.freeze()
- 09-01: Uint32Array for registers/memory to match 32-bit RISC architecture
- 09-01: Register $0 hardwired to zero via getRegister/setRegister protection
- 09-01: Execute functions compute results without mutating state (pure functions)
- 09-01: Visualization metadata tracked in CPUState for Phase 10+ animation
- 09-02: Base FPS of 2 (500ms per frame at 1x) for educational CPU simulation pacing
- 09-02: Speed range 0.25x-4x with named presets for UI convenience
- 09-02: Generic AnimationEngine design decoupled from CPU state for testability
- 09-02: CustomEvent 'cpu:framechange' on window for loose coupling with UI
- 09-03: Non-pipelined simulation for Phase 9 (each instruction completes all 5 stages before next)
- 09-03: SequenceGenerator clones state per stage, clearing change tracking between stages
- 09-03: Async generateSequenceAsync with 10-instruction chunking for Phase 11+ longer programs
- [Phase 10-01]: Use state.pipeline.IF.instruction for all active stages in non-pipelined mode (avoids duplication)
- [Phase 10-01]: Selective register updates via changedRegisters Set (10x+ performance improvement)
- [Phase 10-01]: CSS transition for register highlight removal (300ms ease-out, respects prefers-reduced-motion)
- [Phase 10-02]: CPUVisualizer coordinator pattern - single entry point manages 3 child views and event wiring
- [Phase 10-02]: aria-live="polite" for execution state accessibility (screen reader announcements)
- [Phase 10-02]: Dual-purpose test page pattern - automated tests + interactive live demo for visual inspection
- [Phase 10-03]: No wire value labels on data paths - keeps diagram clean and educational
- [Phase 10-03]: Native SVG tooltips via <title> elements instead of custom JS library
- [Phase 10-03]: Vertical stacked layout (block diagram full-width, registers below) replaces 2-column grid
- [Phase 11-01]: MemoryView shows only non-zero addresses (not all 256 words) for cleaner educational display
- [Phase 11-01]: InstructionView always reads from state.pipeline.IF.instruction (follows Phase 10 non-pipelined decision)
- [Phase 11-01]: InstructionList auto-scrolls to active instruction only when paused (prevents scroll jank during playback)
- [Phase 11-01]: Keyboard accessibility with tabindex=0 and Enter/Space handlers for clickable instructions
- [Phase 11-02]: CSS class selectors instead of IDs for UI components to prevent ID collisions
- [Phase 11-02]: Callback pattern for ProgramSelector coordination (decouples from other UI components)
- [Phase 11-02]: aria-live="polite" for frame counter accessibility (non-interrupting screen reader announcements)
- [Phase 13-01]: CPU docs use /cpu-docs path prefix (not /projects/cpu-docs) for cleaner URLs
- [Phase 13-01]: CPU doc pages placed in src/pages/cpu/ subdirectory for organization
- [Phase 13-01]: Inline CSS in style tags within components for landing/doc pages (matches DocsPage.jsx pattern)
- [Phase 13-02]: Use inline CSS code-block styling with keyword/comment/signal classes for Verilog syntax highlighting
- [Phase 13-02]: Document two-level CLA hierarchy (8 blocks of 4 bits) for 32-bit addition in ALU
- [Phase 13-03]: Use .port-diagram class for ASCII art port specifications in register file documentation
- [Phase 13-03]: Include MIPS register convention table with caller/callee-saved distinctions
- [Phase 13-05]: Document 5-stage pipeline (IF, ID, EX, MEM, WB) with pipeline registers and control unit signal table
- [Phase 13-06]: Timeline visualization with colored cells for hazard conflicts (reused from pipeline page pattern)
- [Phase 13-06]: Flexbox-based forwarding diagram showing EX/MEM and MEM/WB data paths to EX stage
- [Phase 13-07]: Bit-field diagram CSS for instruction format visualization (R-type, I-type, J-type)
- [Phase 13-07]: Complete instruction reference with encoding examples showing binary/hex conversion
- [Phase 13-07]: Memory-map CSS class for Harvard architecture address space visualization

### Pending Todos

1. **Add CS330 Case Study documentation to portfolio** (2026-02-19)
   - Area: documentation
   - Create `/projects/cs330/docs` structure following CPU/Graphics pattern
   - No demo page needed (docs-only project)
   - Include images from code output
   - Match green theme, breadcrumbs, inline CSS styling

### Blockers/Concerns

None yet.

## Session Continuity

Last session: 2026-02-16
Stopped at: Completed 13-07-PLAN.md (Instructions & Memory reference documentation) - Phase 13 complete
Resume file: None

---
*State initialized: 2026-02-11*
*Last updated: 2026-02-16T21:48:00Z*
