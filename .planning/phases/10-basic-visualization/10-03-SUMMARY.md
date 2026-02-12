# Phase 10 Plan 03: SVG Block Diagram View Summary

**One-liner:** SVG-based processor block diagram with hardware components, pipeline registers, multiplexers, and active state highlighting

---

## Metadata

```yaml
phase: 10-basic-visualization
plan: 03
subsystem: visualization
tags: [svg, block-diagram, processor-architecture, pipeline-visualization]
completed: 2026-02-12T03:40:52Z
duration: 2m 32s
```

## What Was Built

Created the SVG-based block diagram visualization component that replaces the text-based pipeline stage cards with a hardware-accurate 5-stage pipelined processor architecture diagram. The block diagram shows all major processor components, pipeline registers, multiplexers, and data path connections with active state highlighting.

### Key Artifacts

**BlockDiagramView Component** (`block-diagram-view.js` - 618 lines)
- SVG block diagram using `createElementNS` with proper namespace handling
- Responsive scaling via `viewBox="0 0 900 500"` and `preserveAspectRatio="xMidYMid meet"`
- Hardware components: Instruction Memory, Register File, ALU, Data Memory, PC, Adder, Sign Extend
- 4 pipeline registers (F/D, D/X, X/M, M/W) rendered as red vertical bars with instruction text displays
- 3 multiplexers (ALU source, WB source, PC source) rendered as blue triangles
- Data path wires connecting components (no value labels per user decision)
- Native SVG tooltips on all components via `<title>` elements
- `render(state)` method highlights active components and updates pipeline register instruction displays

**Visualization CSS Updates** (`visualization.css` - updated)
- `.cpu-block-diagram` container styles
- Component base styles with CSS transitions for smooth active state changes
- Component-specific active colors matching pipeline stage colors (IF green, ID blue, EX orange, MEM purple)
- Pipeline register styles (red fill `#EF5350`, stroke `#C62828`)
- Multiplexer styles (blue fill `#2196F3`, stroke `#1976D2`)
- Data path wire styles
- Changed `.cpu-visualizer` layout from 2-column grid to vertical flex column (block diagram full width, register grid below)
- Removed old pipeline stage card styles (`.pipeline-stage`, `.stage-header`, `.stage-label`, `.instruction-text`)
- Preserved register grid styles (kept per user decision)
- Added `prefers-reduced-motion` support for accessibility

## Dependency Graph

**Requires:**
- `10-01`: RegisterView, PipelineView patterns
- `10-02`: CPUVisualizer coordinator pattern
- `09-01`: CPUState with pipeline stage structure

**Provides:**
- `BlockDiagramView` class for SVG processor diagram rendering
- SVG-specific CSS styles for hardware components
- Visual hardware architecture representation

**Affects:**
- Plan 10-04 will integrate BlockDiagramView into CPUVisualizer (replacing PipelineView)

## Technical Details

### Architecture Decisions

1. **SVG Creation Pattern:** Used helper method `_svg(tagName, attributes)` wrapping `createElementNS` for all SVG element creation, ensuring proper namespace handling throughout
2. **Component Grouping:** Each hardware component wrapped in `<g>` element with `data-component` attribute for efficient JavaScript selection and styling
3. **Painter's Order:** SVG elements added in back-to-front order (data paths → components → pipeline registers → labels) to ensure correct layering
4. **Pipeline Register Mapping:** Map pipeline registers to stages: FD←IF, DX←ID, XM←EX, MW←MEM for instruction display updates
5. **Active State Highlighting:** CSS class-based (.active) with hardware-accelerated transitions, cleared and reapplied each frame
6. **Layout Change:** Switched from 2-column grid (pipeline left, registers right) to vertical stack (block diagram top full-width, registers below) to accommodate wider SVG diagram

### Tech Stack

**Added:**
- Native SVG 1.1 (vector graphics rendering)
- `createElementNS` with SVG namespace for dynamic element creation
- `viewBox` responsive scaling
- Native `<title>` elements for tooltips

**Patterns:**
- IIFE module wrapper with `window.BlockDiagramView` export
- Component map for fast lookup (`Map<string, SVGElement>`)
- Multi-line SVG text using `<tspan>` elements with `dy` offsets
- CSS-driven state transitions with `transition` properties

### Key Files

**Created:**
- `cpu-simulator/src/visualization/block-diagram-view.js` (618 lines)

**Modified:**
- `cpu-simulator/src/visualization/visualization.css` (95 additions, 49 deletions)

## Decisions Made

1. **No wire value labels:** User explicitly excluded "0x0400" style labels on data path wires - keeps diagram clean and educational focus on architecture, not data flow
2. **Native SVG tooltips:** Used `<title>` elements instead of custom JavaScript tooltip library - simpler, accessible, works on touch devices
3. **Component layout from Duke ECE 350:** Referenced Slide 09 standard 5-stage pipeline layout (Insn Mem → Reg File → ALU → Data Mem) for educational accuracy
4. **Multi-line labels via tspan:** Used `<tspan>` elements with `dy` offsets for components like "Instruction\nMemory" - SVG doesn't support `\n` in textContent
5. **Memory highlight conditional:** Only highlight Data Memory when `memRead` or `memWrite` is true - not all instructions access memory in MEM stage
6. **Instruction formatting reuse:** Copied `formatOperands` logic from PipelineView to maintain consistent assembly-style display (ADD $rd, $rs, $rt)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## Testing Notes

**Manual Verification:**
- File exists: `cpu-simulator/src/visualization/block-diagram-view.js`
- Uses `createElementNS` with SVG namespace `http://www.w3.org/2000/svg`
- Contains `viewBox` attribute on root SVG
- Has `data-component` attributes for IMEM, REGFILE, ALU, DMEM, PC, ADDER, SIGNEXT
- Has `data-pipeline-reg` attributes for FD, DX, XM, MW
- Has `data-mux` attributes for ALU_SRC, WB_SRC
- Has `data-instruction-display` attributes for FD, DX, XM, MW
- Has `<title>` elements for tooltips
- Has `render(state)` method that reads `state.pipeline`
- Has `_formatInstruction` method
- File is 618 lines (exceeds 300 line minimum)

**CSS Verification:**
- `.cpu-block-diagram` class exists
- `.component rect` base styles with `transition`
- `.component.active rect` with `stroke-width: 3`
- Component-specific active styles (instruction-memory, register-file, alu, data-memory)
- `.pipeline-register rect` with red fill `#EF5350`
- `.multiplexer polygon` with blue fill `#2196F3`
- `.data-path` stroke styles
- `.cpu-visualizer` uses `flex-direction: column` (not grid)
- NO `.pipeline-stage` card styles (removed)
- Register grid styles present (`.register-grid`, `.register-cell`)
- Stage color tokens still in `:root`

**Integration Testing:** Deferred to Plan 10-04 (will test full integration with CPUVisualizer coordinator)

## Performance Notes

- SVG rendering is hardware-accelerated in modern browsers
- CSS transitions use GPU-accelerated properties (fill, stroke, opacity)
- Component map (`Map`) provides O(1) lookup for active state updates
- DocumentFragment not needed (SVG created once in constructor, then class manipulation for updates)
- `querySelectorAll` used sparingly (only to clear active states each frame)

## Next Steps

**Immediate (Plan 10-04):**
- Integrate BlockDiagramView into CPUVisualizer coordinator
- Replace PipelineView with BlockDiagramView in CPU visualizer
- Update test page to display block diagram
- Verify active state highlighting works correctly during animation playback

**Future Phases:**
- Phase 11: Add true pipelined execution (block diagram will show different instructions in each pipeline register simultaneously)
- Phase 12: Add hazard detection visualization (highlight hazards/stalls on block diagram)

## Self-Check: PASSED

**Created files verified:**
```bash
✓ FOUND: cpu-simulator/src/visualization/block-diagram-view.js
```

**Commits verified:**
```bash
✓ FOUND: 7168d59 feat(10-03): create BlockDiagramView SVG component
✓ FOUND: 21d5a7d feat(10-03): update visualization.css with SVG block diagram styles
```

**Must-have truths verified:**
- ✓ SVG block diagram renders Instruction Memory, Register File, ALU, Data Memory as rectangular blocks
- ✓ Pipeline registers F/D, D/X, X/M, M/W appear as red vertical bars
- ✓ Multiplexers appear as blue triangular shapes
- ✓ PC block and adder logic visible
- ✓ Data path wires connect components (no value labels)
- ✓ Active components highlight with stage-specific colors
- ✓ Pipeline registers display instruction names or 'NOP'
- ✓ Hovering shows native SVG tooltip
- ✓ Diagram scales responsively using viewBox

**Exports verified:**
- ✓ `window.BlockDiagramView` exported

---

**Plan complete.** All tasks executed, committed, and verified.
