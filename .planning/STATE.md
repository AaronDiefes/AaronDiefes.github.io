# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-02-11)

**Core value:** Showcase technical depth through interactive project demonstrations with comprehensive documentation
**Current focus:** Phase 11 - Interactive Demo Page (v1.1 CPU Simulator)

## Current Position

Phase: 13 of 15 (Documentation Foundation)
Plan: 6 of 7 complete
Status: In progress
Last activity: 2026-02-16 — Phase 13 Plan 06 complete (Hazards & Forwarding documentation)

Progress: [████████████░░░░░░░░] 80% (12/15 phases, 1 skipped)

## Performance Metrics

**Velocity:**
- Total plans completed: 12 (Phases 9-11, 13 in progress)
- Average duration: 2 min 28 sec
- Total execution time: 28 min 50 sec

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| v1.0 (Phases 1-8) | Complete | N/A | N/A |
| Phase 9 | 3 | 7m 40s | 2m 33s |
| Phase 10 | 3 | 6m 53s | 2m 18s |
| Phase 11 | 2 | 4m 8s | 2m 4s |
| Phase 13 | 4 | 10m 9s | 2m 32s |

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

*Consistent execution velocity maintained*
| Phase 13 P06 | 205 | 2 tasks | 2 files |
| Phase 13 P05 | 202 | 2 tasks | 2 files |

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

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

## Session Continuity

Last session: 2026-02-16
Stopped at: Completed 13-05-PLAN.md (Pipeline Architecture documentation)
Resume file: None

---
*State initialized: 2026-02-11*
*Last updated: 2026-02-16T21:33:25Z*
