---
phase: 11-interactive-demo-page
plan: 01
subsystem: cpu-simulator/visualization-ui
tags: [visualization, ui-components, memory-display, instruction-display, navigation]
dependency_graph:
  requires:
    - "09-01: CPUState with memory and changedMemory tracking"
    - "09-02: AnimationEngine with jumpToFrame() navigation"
    - "09-03: SequenceGenerator producing frame sequences with pipeline data"
    - "10-01: RegisterView pattern (IIFE, window export, render method)"
  provides:
    - "MemoryView: data memory table visualization"
    - "InstructionView: instruction field breakdown display"
    - "InstructionList: clickable program navigation with jump-to-frame"
  affects:
    - "Phase 11-02: Demo page will integrate these three new components"
tech_stack:
  added:
    - "MemoryView component (vanilla JS, IIFE pattern)"
    - "InstructionView component (vanilla JS, IIFE pattern)"
    - "InstructionList component (vanilla JS, IIFE pattern)"
  patterns:
    - "IIFE + window export for global scope exposure"
    - "render(state) method for declarative UI updates"
    - "CSS change highlighting with transition animations"
    - "Keyboard accessibility (tabindex, Enter/Space handlers)"
    - "Auto-scroll with playback-aware logic (smooth when paused)"
key_files:
  created:
    - path: "cpu-simulator/src/visualization/memory-view.js"
      purpose: "Renders non-zero data memory addresses in hex table"
      loc: 130
    - path: "cpu-simulator/src/visualization/instruction-view.js"
      purpose: "Shows current instruction mnemonic, stage, and decoded fields"
      loc: 175
    - path: "cpu-simulator/src/ui/instruction-list.js"
      purpose: "Clickable instruction list with jump-to-frame navigation"
      loc: 240
  modified:
    - path: "cpu-simulator/src/visualization/visualization.css"
      purpose: "Added styles for MemoryView, InstructionView, InstructionList"
      changes: "+240 lines (CSS sections for 3 new components)"
decisions:
  - id: "memory-filter-nonzero"
    summary: "MemoryView shows only non-zero addresses (not all 256 words)"
    rationale: "Cleaner display for educational demos, avoids massive table with mostly zeros"
    alternatives: ["Show all 256 addresses", "Paginate full memory"]
  - id: "instruction-if-source"
    summary: "InstructionView always reads from state.pipeline.IF.instruction"
    rationale: "Follows Phase 10 decision for non-pipelined mode (all stages share same instruction)"
    alternatives: ["Read from active stage directly"]
  - id: "autoscroll-when-paused"
    summary: "InstructionList auto-scrolls to active instruction only when engine.isPlaying === false"
    rationale: "Prevents scroll jank during continuous playback, improves visual stability"
    alternatives: ["Always auto-scroll", "Never auto-scroll", "Debounce scroll"]
  - id: "keyboard-accessibility"
    summary: "Clickable instructions have tabindex=0 and respond to Enter/Space"
    rationale: "WCAG keyboard navigation requirement for interactive elements"
    alternatives: ["Mouse-only interaction"]
metrics:
  duration: "2m 38s"
  completed_date: "2026-02-15"
  tasks_completed: 2
  files_created: 3
  files_modified: 1
  commits: 2
---

# Phase 11 Plan 01: New UI Components Summary

**One-liner:** Created MemoryView (non-zero memory table), InstructionView (instruction field breakdown), and InstructionList (clickable jump-to-frame navigation) following Phase 10 component patterns.

## What Was Built

Three new UI components extending the CPU simulator's visualization capabilities:

1. **MemoryView** (`cpu-simulator/src/visualization/memory-view.js`)
   - Renders data memory as a 3-column table (Address | Hex Value | Decimal)
   - Shows only non-zero memory addresses (filters out unused memory)
   - Highlights recently changed addresses with yellow background
   - Empty state message when no memory in use
   - Scrollable container (max-height: 300px)

2. **InstructionView** (`cpu-simulator/src/visualization/instruction-view.js`)
   - Shows current instruction mnemonic with active stage label
   - Displays decoded instruction fields (opcode, rs, rt, rd, immediate)
   - Conditional field rendering based on InstructionSet definition
   - Shows instruction comment if present
   - "No instruction active" placeholder when pipeline idle

3. **InstructionList** (`cpu-simulator/src/ui/instruction-list.js`)
   - Renders program instructions as ordered list
   - Builds instruction-to-frame mapping from frame sequence
   - Click or Enter/Space on instruction jumps to its first IF frame
   - Highlights active instruction during playback
   - Auto-scrolls to active instruction (only when paused, prevents scroll jank)
   - Keyboard accessible (tabindex, focus-visible outlines)

All three components follow established Phase 10 patterns:
- IIFE wrapper with `window` export
- `render(state)` method accepting CPUState
- CSS classes for styling and change highlighting
- Reduced-motion media query support

## Implementation Notes

**MemoryView filtering logic:**
```javascript
// Scans 256-word memory array, only renders non-zero addresses
for (let wordIndex = 0; wordIndex < state.memory.length; wordIndex++) {
  if (state.memory[wordIndex] !== 0) {
    // Build table row for this address
  }
}
```

**InstructionView stage detection:**
```javascript
// Priority: WB > MEM > EX > ID > IF
_getActiveStage(pipeline) {
  const stages = ['WB', 'MEM', 'EX', 'ID', 'IF'];
  for (const stage of stages) {
    if (pipeline[stage]?.active) return stage;
  }
  return null;
}
```

**InstructionList frame mapping:**
```javascript
// Map each instruction index to its first IF frame
frameSequence.frames.forEach((frame, frameIndex) => {
  if (frame.pipeline?.IF?.active) {
    const instructionIndex = frame.pipeline.IF.pc / 4;
    if (!this.instructionToFrameMap.has(instructionIndex)) {
      this.instructionToFrameMap.set(instructionIndex, frameIndex);
    }
  }
});
```

**Auto-scroll logic:**
```javascript
// Only scroll when NOT playing (avoids jank)
if (!this.engine.isPlaying) {
  currentItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
```

## CSS Architecture

Added three major sections to `visualization.css`:

1. **Memory View styles** (70 lines)
   - Sticky table header for scrollable container
   - Monospace font for hex addresses and values
   - Yellow highlight for changed rows (300ms transition)

2. **Instruction View styles** (80 lines)
   - Card-like display container
   - Flex-wrap layout for instruction fields
   - Field badges with background color distinction
   - Italic comment styling

3. **Instruction List styles** (90 lines)
   - Ordered list with inside numbering
   - Hover highlight for clickable items
   - Active instruction: light green background + left border (matches IF stage color)
   - Focus-visible outlines for keyboard navigation

All transitions disabled via `@media (prefers-reduced-motion: reduce)`.

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

**File existence:**
```
✓ cpu-simulator/src/visualization/memory-view.js (130 LOC)
✓ cpu-simulator/src/visualization/instruction-view.js (175 LOC)
✓ cpu-simulator/src/ui/instruction-list.js (240 LOC)
✓ cpu-simulator/src/visualization/visualization.css (modified +240 lines)
```

**Pattern compliance:**
```
✓ class MemoryView / class InstructionView / class InstructionList
✓ window.MemoryView / window.InstructionView / window.InstructionList
✓ render(state) methods in MemoryView and InstructionView
✓ state.changedMemory usage in MemoryView
✓ state.pipeline.IF.instruction usage in InstructionView
✓ engine.jumpToFrame() calls in InstructionList
✓ instructionToFrameMap building logic
✓ CSS sections for .memory-view, .instruction-view, .instruction-list
✓ 2 prefers-reduced-motion media queries (original + new)
```

**Must-have truths satisfied:**
- [x] Memory visualization shows non-zero data memory addresses with hex values
- [x] Instruction display shows current instruction mnemonic, stage, and decoded fields
- [x] Clickable instruction list shows all program instructions with current instruction highlighted
- [x] Clicking an instruction in the list jumps animation to that instruction's first IF frame

## Integration Points

These components are ready for Phase 11-02 integration:

**Instantiation pattern:**
```javascript
const memoryView = new MemoryView(document.querySelector('#memory-container'));
const instructionView = new InstructionView(document.querySelector('#instruction-container'));
const instructionList = new InstructionList(document.querySelector('#list-container'), animationEngine);

// Load program (InstructionList only)
instructionList.loadProgram(program, frameSequence);

// Render on frame change (MemoryView and InstructionView)
window.addEventListener('cpu:framechange', (event) => {
  const state = event.detail.state;
  memoryView.render(state);
  instructionView.render(state);
  // InstructionList updates itself via event listener
});
```

**Dependencies:**
- `window.CPUState` (Phase 9-01)
- `window.InstructionSet` (Phase 9-01)
- `window.AnimationEngine` (Phase 9-02)
- CSS design tokens from `design-system.css`

## Task Breakdown

### Task 1: Create MemoryView and InstructionView components
**Status:** Complete
**Commit:** `3036b07`
**Duration:** ~1m 20s
**Files:** `memory-view.js`, `instruction-view.js`

Created both visualization components following RegisterView patterns. MemoryView filters non-zero addresses, InstructionView conditionally renders fields based on instruction type.

### Task 2: Create InstructionList component and update CSS
**Status:** Complete
**Commit:** `af945aa`
**Duration:** ~1m 18s
**Files:** `instruction-list.js`, `visualization.css`

Built InstructionList with instruction-to-frame mapping, click/keyboard handlers, and active instruction tracking. Added comprehensive CSS for all three new components with reduced-motion support.

## Next Steps

Phase 11-02 will:
1. Create interactive demo page integrating these components
2. Wire up AnimationEngine with program loader
3. Add playback controls (play/pause/step/speed)
4. Combine BlockDiagramView, RegisterView, and these 3 new components into unified demo

## Self-Check: PASSED

**Created files verified:**
```
FOUND: cpu-simulator/src/visualization/memory-view.js
FOUND: cpu-simulator/src/visualization/instruction-view.js
FOUND: cpu-simulator/src/ui/instruction-list.js
```

**Modified files verified:**
```
FOUND: cpu-simulator/src/visualization/visualization.css (contains .memory-view, .instruction-view, .instruction-list)
```

**Commits verified:**
```
FOUND: 3036b07 (Task 1: MemoryView and InstructionView)
FOUND: af945aa (Task 2: InstructionList and CSS)
```

**Pattern verification:**
- All files use IIFE pattern with window export
- render(state) methods present in MemoryView and InstructionView
- InstructionList uses loadProgram() and integrates with AnimationEngine
- CSS follows existing visualization.css structure with BEM-style classes
- Reduced-motion support added for new transitions

All must-have artifacts and key-links verified through grep patterns. Ready for Phase 11-02 integration.
