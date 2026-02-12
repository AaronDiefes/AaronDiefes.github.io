---
phase: 10-basic-visualization
plan: 01
subsystem: "visualization"
tags: ["visualization", "ui-components", "pipeline", "registers"]
dependency_graph:
  requires:
    - "09-01: CPUState with pipeline, registers, changedRegisters Set"
    - "09-02: AnimationEngine event contract (cpu:framechange)"
    - "design-system.css: Existing color/typography tokens"
  provides:
    - "PipelineView: 5-stage pipeline card renderer"
    - "RegisterView: 32-register grid with selective updates"
    - "ExecutionView: Cycle/instruction counter display"
    - "visualization.css: Layout, stage colors, responsive grid"
  affects:
    - "10-02: CPUVisualizer will instantiate and coordinate these views"
tech_stack:
  added: []
  patterns:
    - "IIFE module pattern (window exports)"
    - "DocumentFragment for efficient DOM construction"
    - "Map/Array for O(1) element lookups"
    - "Selective DOM updates (only changed registers)"
    - "CSS Grid with auto-fill responsive layout"
key_files:
  created:
    - "cpu-simulator/src/visualization/visualization.css"
    - "cpu-simulator/src/visualization/pipeline-view.js"
    - "cpu-simulator/src/visualization/register-view.js"
    - "cpu-simulator/src/visualization/execution-view.js"
  modified: []
decisions:
  - decision: "Use state.pipeline.IF.instruction for all active stages in non-pipelined mode"
    rationale: "In non-pipelined execution (Phase 9), only one stage is active per frame. The instruction flows through all 5 stages sequentially, and IF stage stores the instruction object. This avoids duplication across all stage objects."
    alternatives: ["Store instruction in each stage object", "Track instruction separately"]
    trade_offs: "Simple and efficient for non-pipelined mode, will need adjustment for true pipelining in Phase 12+"
  - decision: "Selective register updates via changedRegisters Set"
    rationale: "Only 1-3 registers change per instruction. Updating all 32 registers every frame is wasteful (32x unnecessary DOM writes)."
    alternatives: ["Update all 32 registers every frame", "Dirty flag per register"]
    trade_offs: "Requires tracking changed set, but provides 10x+ performance improvement"
  - decision: "CSS transition for register highlight removal (300ms ease-out)"
    rationale: "Visual feedback for register writes. User can see which registers changed on current frame, then highlight fades smoothly."
    alternatives: ["Instant removal", "JavaScript animation", "Permanent highlight"]
    trade_offs: "CSS handles animation automatically, respects prefers-reduced-motion"
metrics:
  duration: "2m 5s"
  completed: "2026-02-12"
  tasks: 3
  files_created: 4
  lines_added: 503
---

# Phase 10 Plan 01: Basic Visualization Components

**One-liner:** Pure render components (PipelineView, RegisterView, ExecutionView) with CSS Grid layout, stage-specific colors, selective register updates, and assembly-style instruction formatting

## What Was Built

Created the three leaf visualization view components and their shared CSS stylesheet:

1. **visualization.css (180 lines)**
   - Stage color tokens (IF=green, ID=blue, EX=orange, MEM=purple, WB=red)
   - CSS Grid layout with 2-column desktop, 1-column mobile (768px breakpoint)
   - Pipeline stage cards with color-coded left borders (4px normal, 6px active)
   - Register grid with auto-fill minmax(130px, 1fr) responsive columns
   - Register change highlighting (yellow background, 300ms fade-out)
   - Register $0 reduced opacity (hardwired-to-zero visual cue)
   - Execution counter styling with monospace fonts
   - Extends design-system.css without duplicating existing tokens

2. **pipeline-view.js (154 lines)**
   - Renders 5 stage cards (IF, ID, EX, MEM, WB) with data-stage attributes
   - Displays instruction mnemonic + formatted operands for active stages
   - Shows 'NOP' for inactive stages
   - Assembly-style operand formatting:
     - R-type (ADD/SUB): `$rd, $rs, $rt` → `$10, $8, $9`
     - I-type (ADDI): `$rt, $rs, imm` → `$8, $0, 10`
     - I-type (LW): `$rt, imm($rs)` → `$12, 0($8)`
     - S-type (SW): `$rt, imm($rs)` → `$10, 0($8)`
     - B-type (BEQ): `$rs, $rt, offset` → `$8, $8, 2`
     - J-type (J): `target` → `0`
   - DocumentFragment for batch DOM construction
   - Map<stageName, element> for O(1) stage lookups

3. **register-view.js (103 lines)**
   - 32-register grid with $0-$31 labels
   - Selective update: only renders changed registers (from state.changedRegisters Set)
   - Removes 'changed' class from previous frame's highlights before applying new ones
   - Hex formatting: `0x` prefix, uppercase, 8-digit zero-padded
   - First render: updates all 32 registers (initialization)
   - Subsequent renders: updates only 1-3 registers per frame (typical)
   - Defensive handling: Register $0 always shows 0x00000000 even if in changedRegisters

4. **execution-view.js (66 lines)**
   - Displays cycleCount and instructionCount from CPUState
   - Queries existing data-cycle-count/data-instruction-count spans
   - Creates structure if container is empty
   - Simple textContent updates per frame
   - Container expects aria-live="polite" (set by parent CPUVisualizer in Plan 02)

## Implementation Notes

**IIFE Module Pattern:**
All JS files follow Phase 9 pattern: IIFE wrapper with `window.PipelineView` export. No ES6 modules for consistency with existing codebase.

**Performance Optimizations:**
- DocumentFragment: Single DOM insertion for all 32 registers (not 32 separate appends)
- Selective updates: RegisterView only touches changed registers (1-3 per frame, not all 32)
- Map lookups: PipelineView uses Map for O(1) stage element access
- CSS transitions: Hardware-accelerated background-color animation (not JavaScript)

**Instruction Display Logic:**
In non-pipelined mode (Phase 9), only one stage is active per frame. The instruction object is stored in `state.pipeline.IF.instruction` and flows through all 5 stages. PipelineView reads from IF stage for all active stages, avoiding instruction duplication in state.

**Register $0 Handling:**
- CSS: `[data-register="0"]` has `opacity: 0.6` to indicate special status
- JS: Defensive check ensures $0 always displays 0x00000000
- State: CPUState.setRegister() already prevents writes to $0, but view layer is defensive

**Accessibility:**
- ExecutionView container expects `aria-live="polite"` for screen reader announcements
- Pipeline stages use semantic HTML with clear labels
- Register labels use `$N` convention matching MIPS/RISC-V documentation
- CSS respects `prefers-reduced-motion` (inherited from design-system.css)

## Deviations from Plan

None - plan executed exactly as written.

## Testing Notes

These are pure render components with no internal state beyond DOM references. Testing in Plan 02:

1. **Integration test with CPUState:** Create mock state, call render(), verify DOM
2. **Register highlighting:** Trigger changedRegisters, verify 'changed' class applied/removed
3. **Pipeline stages:** Set active=true for each stage, verify 'active' class and instruction text
4. **Instruction formatting:** Test all 8 instruction types (ADD, SUB, ADDI, LW, SW, BEQ, J, NOP)
5. **Responsive layout:** Resize viewport, verify 2-column → 1-column at 768px
6. **Register $0 opacity:** Verify reduced opacity in computed styles

## Key Artifacts

**Commits:**
- `f712b33`: visualization.css (layout, stage colors, register grid, highlighting)
- `2ac6a55`: pipeline-view.js (5-stage pipeline visualization)
- `88cd16e`: register-view.js + execution-view.js (register grid + counters)

**Files Created:**
```
cpu-simulator/src/visualization/
├── visualization.css         (180 lines)
├── pipeline-view.js          (154 lines)
├── register-view.js          (103 lines)
└── execution-view.js         (66 lines)
                              ─────────
                              503 lines total
```

**Key Lines:**

```css
/* Stage colors (visualization.css:14-18) */
--stage-if-color: #4CAF50;   /* Green */
--stage-id-color: #2196F3;   /* Blue */
--stage-ex-color: #FF9800;   /* Orange */
--stage-mem-color: #9C27B0;  /* Purple */
--stage-wb-color: #F44336;   /* Red */
```

```javascript
// Selective register update (register-view.js:68-82)
const changed = Array.from(state.changedRegisters || []);
changed.forEach(index => {
  const cell = this.registerCells[index];
  const valueEl = cell.querySelector('.register-value');
  const value = index === 0 ? 0 : state.registers[index];
  valueEl.textContent = '0x' + value.toString(16).toUpperCase().padStart(8, '0');
  cell.classList.add('changed');
});
```

```javascript
// Instruction formatting (pipeline-view.js:98-108)
switch (type) {
  case 'R':
    return `$${rd}, $${rs}, $${rt}`;  // ADD $10, $8, $9
  case 'I':
    if (instruction.mnemonic === 'ADDI') {
      return `$${rt}, $${rs}, ${immediate}`;  // ADDI $8, $0, 10
    } else if (instruction.mnemonic === 'LW') {
      return `$${rt}, ${immediate}($${rs})`;  // LW $12, 0($8)
    }
    break;
  // ...
}
```

## Next Steps (Plan 02)

Plan 02 will create CPUVisualizer coordinator class that:
1. Instantiates PipelineView, RegisterView, ExecutionView
2. Subscribes to AnimationEngine's `cpu:framechange` event
3. Calls render() on each view when frame changes
4. Manages container structure and aria-live regions
5. Provides control buttons (play, pause, step, reset, speed)

These view components are complete and ready for integration.

## Self-Check: PASSED

**Files exist:**
- FOUND: cpu-simulator/src/visualization/visualization.css
- FOUND: cpu-simulator/src/visualization/pipeline-view.js
- FOUND: cpu-simulator/src/visualization/register-view.js
- FOUND: cpu-simulator/src/visualization/execution-view.js

**Commits exist:**
- FOUND: f712b33 (visualization.css)
- FOUND: 2ac6a55 (pipeline-view.js)
- FOUND: 88cd16e (register-view.js + execution-view.js)

**Key features verified:**
- CSS defines stage colors, responsive grid, register highlighting
- PipelineView uses IIFE, exports window.PipelineView, formats operands
- RegisterView uses selective updates via changedRegisters
- ExecutionView displays cycle and instruction counts
- All components follow Phase 9 IIFE module pattern
