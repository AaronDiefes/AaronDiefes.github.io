# Phase 10: Basic Visualization - Research

**Researched:** 2026-02-11
**Domain:** SVG-based block diagram visualization for 5-stage pipelined processor
**Confidence:** HIGH

## Summary

This phase re-implements the CPU visualization using SVG-based block diagrams instead of the existing text-based stage cards. The user has decided to replace the simple "IF: ADD $t0, $t1, $t2" stage cards with a hardware block diagram showing functional units (Instruction Memory, Register File, ALU, Data Memory), pipeline registers (F/D, D/X, X/M, M/W), multiplexers, and data flow paths. The visualization will show which instruction is in each pipeline stage, highlight active components, and display register values via tooltips.

Research confirms SVG is the optimal choice for this task: vector graphics ensure scalability, CSS enables smooth active/inactive state transitions, and JavaScript DOM manipulation provides straightforward component highlighting. Standard SVG primitives (`<rect>`, `<polygon>`, `<text>`, `<g>`) combined with proper namespace handling (`createElementNS`) deliver performant interactive diagrams.

**Primary recommendation:** Build SVG diagram with grouped components, use CSS classes for active/inactive states, implement tooltip hover with native `<title>` elements, and leverage existing event system (`cpu:framechange`) for state updates.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Visual Approach:**
- SVG-based block diagram rendering (vector graphics, scalable, animatable paths)
- Not canvas-based or HTML/CSS positioned elements

**Components to Display:**
- Major functional blocks: Instruction Memory, Register File, ALU, Data Memory
- Pipeline registers: F/D, D/X, X/M, M/W (latches between stages)
- Multiplexers and control logic (the mux triangles from slide diagrams)
- PC (program counter) and adder logic
- Any other vital components needed for completeness

**Information Display During Execution:**
- Instructions in each pipeline stage - Show which instruction is currently in F/D, D/X, X/M, M/W registers
- Active component highlighting - Visual indication of which component is active (ALU lights up during EX, Memory lights up during MEM)
- Register file contents - Display register values being read/written
- **NOT included:** Values on data path wires (no "0x0400" labels on every wire)

**Interaction Model:**
- Tooltip on hover only - show basic component info when hovering over blocks
- No click-to-expand modals or sidebars
- Simple, non-intrusive information display

**Layout and Supplementary Displays:**
- Block diagram is the primary visualization
- **Keep:** Register values grid (32 registers with hex values)
- **Remove:** Stage cards showing "IF: ADD $t0, $t1, $t2" (redundant - block diagram shows this visually)
- **Remove:** Cycle/instruction counter text (can be integrated into diagram or removed)

### Claude's Discretion

- Exact SVG layout and spacing
- Color scheme for active/inactive states (should complement existing forest green theme)
- Tooltip styling and content
- Animation timing and transitions
- Component sizing and positioning details

### Reference Material

**Duke ECE 350 slide decks:**
- Slide 09: Pipelined Processors
- URL: https://people.duke.edu/~tkb13/courses/ece350-2023fa/
- Shows Insn Mem (left), Register File (center), ALU/SX (center-right), Data Mem (right)
- Pipeline registers labeled F/D, D/X, X/M, M/W in red
- Multiplexers shown as blue triangular shapes

### Deferred Ideas (OUT OF SCOPE)

None - discussion stayed within phase scope (visualization only, not adding new CPU features or controls)
</user_constraints>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vanilla SVG | SVG 1.1 / SVG 2 | Vector graphics rendering | Native browser support, no dependencies, scales infinitely |
| JavaScript DOM API | Native | SVG manipulation via `createElementNS` | Standard approach for dynamic SVG creation |
| CSS3 | Native | Styling and transitions | Hardware-accelerated animations, declarative state changes |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `structuredClone()` | ES2022 | Deep cloning state (existing) | Already used in Phase 9 for CPU state |
| Custom Events API | Native | Event communication (existing) | Already used - `cpu:framechange` events |
| `Uint32Array` | ES2015 | Register/memory storage (existing) | Already used in Phase 9 for 32-bit values |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| SVG | HTML5 Canvas | Canvas requires full redraws, harder to manipulate individual elements, no DOM access to components |
| SVG | HTML/CSS positioning | User explicitly rejected - harder to maintain complex diagrams, scaling issues |
| Vanilla JS | D3.js | Overkill for static diagram with state updates - adds 250KB dependency for features we don't need |
| Vanilla JS | JointJS | Designed for graph editing, not static processor diagrams - adds complexity |
| Native `<title>` | Custom tooltip library | User wants simple tooltips - native `<title>` is accessible and works on all elements |

**Installation:**
```bash
# No installation required - all native browser APIs
```

## Architecture Patterns

### Recommended Project Structure
```
cpu-simulator/src/visualization/
├── block-diagram-view.js      # New: SVG block diagram component
├── register-view.js            # Keep: Register grid (user decision)
├── execution-view.js           # Remove or integrate: Cycle/instruction counter
├── cpu-visualizer.js           # Update: Remove PipelineView, add BlockDiagramView
└── visualization.css           # Update: Add SVG-specific styles
```

### Pattern 1: SVG Component Creation with Namespace

**What:** Use `createElementNS` with correct SVG namespace for all SVG element creation

**When to use:** Every time you create SVG elements dynamically (`<svg>`, `<rect>`, `<text>`, `<g>`, `<polygon>`, etc.)

**Example:**
```javascript
// Source: MDN - Namespaces crash course
// https://developer.mozilla.org/en-US/docs/Web/SVG/Namespaces_Crash_Course

const SVG_NS = 'http://www.w3.org/2000/svg';

function createSVGElement(tagName, attributes = {}) {
  const element = document.createElementNS(SVG_NS, tagName);

  // Set attributes (no namespace for most SVG attributes)
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  return element;
}

// Usage
const rect = createSVGElement('rect', {
  x: 10,
  y: 10,
  width: 100,
  height: 50,
  class: 'alu-component'
});
```

**Critical:** Use `setAttribute()` not `setAttributeNS()` for standard SVG attributes (x, y, width, height, class). Only use `setAttributeNS()` for namespaced attributes like `xlink:href`.

### Pattern 2: Grouped Components for Hardware Blocks

**What:** Use `<g>` elements to group related shapes that represent a single hardware component

**When to use:** For each major component (ALU, Register File, Memory, Muxes) that will be styled/highlighted as a unit

**Example:**
```javascript
// Instruction Memory component (left side)
const instrMem = createSVGElement('g', {
  class: 'component instruction-memory',
  'data-component': 'IMEM'
});

// Background rectangle
const rect = createSVGElement('rect', {
  x: 20,
  y: 100,
  width: 120,
  height: 80,
  rx: 4
});

// Label
const label = createSVGElement('text', {
  x: 80,
  y: 145,
  'text-anchor': 'middle'
});
label.textContent = 'Instruction\nMemory';

// Tooltip (native SVG)
const title = createSVGElement('title');
title.textContent = 'Instruction Memory - Fetches instructions from program';

instrMem.appendChild(title);
instrMem.appendChild(rect);
instrMem.appendChild(label);
```

### Pattern 3: CSS-Driven State Changes

**What:** Use CSS classes to control active/inactive visual states, leveraging hardware-accelerated transitions

**When to use:** For component highlighting, pipeline register emphasis, data flow animation

**Example:**
```css
/* Base component styling */
.component rect {
  fill: var(--color-surface);
  stroke: var(--color-border);
  stroke-width: 2;
  transition: fill 0.3s ease, stroke 0.3s ease, stroke-width 0.3s ease;
}

/* Active state highlighting */
.component.active rect {
  fill: var(--color-active-light);
  stroke: var(--color-primary);
  stroke-width: 3;
}

/* Component-specific colors (match existing stage colors) */
.alu-component.active rect {
  fill: #FFF3E0;
  stroke: var(--stage-ex-color); /* Orange - already defined */
}

.register-file.active rect {
  fill: #E3F2FD;
  stroke: var(--stage-id-color); /* Blue */
}

.data-memory.active rect {
  fill: #F3E5F5;
  stroke: var(--stage-mem-color); /* Purple */
}
```

**JavaScript usage:**
```javascript
// Update active components based on CPU state
function updateComponentStates(state) {
  // Clear all active states
  document.querySelectorAll('.component.active')
    .forEach(el => el.classList.remove('active'));

  // Highlight active components
  if (state.pipeline.EX.active) {
    document.querySelector('[data-component="ALU"]')
      .classList.add('active');
  }

  if (state.pipeline.MEM.active && state.pipeline.MEM.memRead) {
    document.querySelector('[data-component="DMEM"]')
      .classList.add('active');
  }
}
```

### Pattern 4: ViewBox for Responsive Scaling

**What:** Define SVG coordinate system with `viewBox`, let CSS control actual size

**When to use:** Always - ensures diagram scales responsively across different screen sizes

**Example:**
```javascript
// Source: MDN - preserveAspectRatio
// https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/preserveAspectRatio

const svg = createSVGElement('svg', {
  viewBox: '0 0 800 400',  // Internal coordinate system (800x400 units)
  preserveAspectRatio: 'xMidYMid meet',  // Center and scale to fit
  class: 'block-diagram'
});
```

```css
/* Let container control size, viewBox controls proportions */
.block-diagram {
  width: 100%;
  height: auto;
  max-width: 1200px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
}
```

**Effect:** Diagram maintains aspect ratio, scales smoothly, works on any viewport size.

### Pattern 5: Pipeline Register Emphasis

**What:** Visually distinguish pipeline registers (F/D, D/X, X/M, M/W) as vertical red bars between stages, show current instruction in each

**When to use:** To match reference architecture style and clearly delineate pipeline boundaries

**Example:**
```javascript
// F/D pipeline register (between IF and ID stages)
const fdRegister = createSVGElement('g', {
  class: 'pipeline-register',
  'data-pipeline-reg': 'FD'
});

// Vertical bar (red, matching reference slides)
const bar = createSVGElement('rect', {
  x: 160,
  y: 80,
  width: 8,
  height: 240,
  rx: 2
});

// Label
const label = createSVGElement('text', {
  x: 164,
  y: 60,
  'text-anchor': 'middle',
  class: 'pipeline-label'
});
label.textContent = 'F/D';

// Instruction display (updated dynamically)
const instrText = createSVGElement('text', {
  x: 164,
  y: 340,
  'text-anchor': 'middle',
  class: 'pipeline-instruction',
  'data-instruction-display': 'FD'
});
instrText.textContent = 'NOP';

fdRegister.appendChild(bar);
fdRegister.appendChild(label);
fdRegister.appendChild(instrText);
```

```css
.pipeline-register rect {
  fill: #EF5350;  /* Red - matches reference slides */
  stroke: #C62828;
  stroke-width: 1;
}

.pipeline-label {
  font-size: 14px;
  font-weight: bold;
  fill: #C62828;
}

.pipeline-instruction {
  font-family: var(--font-mono);
  font-size: 11px;
  fill: var(--color-text);
}
```

### Pattern 6: Multiplexer Triangles

**What:** Represent multiplexers as blue triangular shapes (polygons) matching reference architecture style

**When to use:** For all data path selection points (ALU input selection, write-back data selection, PC update selection)

**Example:**
```javascript
// Source: MDN - SVG polygon
// https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/polygon

// Multiplexer before ALU (selects register vs immediate)
const mux = createSVGElement('g', {
  class: 'multiplexer',
  'data-mux': 'ALU_SRC'
});

// Triangle pointing right
const triangle = createSVGElement('polygon', {
  points: '300,140 320,155 300,170',  // x,y pairs for triangle vertices
  class: 'mux-shape'
});

const title = createSVGElement('title');
title.textContent = 'ALU Source MUX - Selects register or immediate value';

mux.appendChild(title);
mux.appendChild(triangle);
```

```css
.mux-shape {
  fill: #2196F3;  /* Blue - matches reference slides */
  stroke: #1976D2;
  stroke-width: 1;
  opacity: 0.8;
}

.multiplexer.active .mux-shape {
  opacity: 1.0;
  stroke-width: 2;
}
```

### Anti-Patterns to Avoid

- **Using `innerHTML` for large SVG structures:** While `innerHTML` works for SVG, it causes full DOM reparse. Use DocumentFragment + `createElementNS` for initial construction, then update via class manipulation for state changes.

- **Forgetting `createElementNS`:** Using `createElement('rect')` instead of `createElementNS(SVG_NS, 'rect')` creates HTML elements, not SVG elements - they won't render.

- **Animating `x`/`y` attributes:** For smooth animations, use CSS `transform` instead of repeatedly setting `x`/`y` attributes. `transform` is hardware-accelerated.

- **Overcomplicated tooltips:** User wants simple hover tooltips - use native `<title>` element inside SVG groups, not custom JavaScript libraries.

- **Wire value labels:** User explicitly excluded data path wire values - don't add "0x0400" labels between components.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| SVG element creation | Custom XML string builder | `createElementNS` + helper function | Proper namespace handling, DOM integration, attribute safety |
| Responsive scaling | Manual resize listeners + coordinate math | `viewBox` + `preserveAspectRatio` | Browser-native, tested across devices, handles edge cases |
| Tooltips | Custom positioned `<div>` with JS | Native SVG `<title>` element | Accessible, works on touch devices, no positioning logic |
| State transitions | Manual style manipulation | CSS classes + transitions | Hardware-accelerated, declarative, easier to maintain |
| Component grouping | Flat SVG structure with manual tracking | `<g>` elements with `data-*` attributes | Semantic grouping, single event target, simplified selection |

**Key insight:** SVG has mature native features for all required functionality. The browser handles scaling, tooltips, grouping, and styling better than custom JavaScript. Leverage the platform.

## Common Pitfalls

### Pitfall 1: Namespace Confusion

**What goes wrong:** SVG elements created with `createElement()` instead of `createElementNS()` render as empty boxes or not at all.

**Why it happens:** Browsers need explicit namespace declaration to distinguish SVG from HTML. Without SVG namespace (`http://www.w3.org/2000/svg`), elements are treated as unknown HTML elements.

**How to avoid:**
- Always use `createElementNS(SVG_NS, tagName)` for SVG elements
- Store namespace constant: `const SVG_NS = 'http://www.w3.org/2000/svg';`
- Use `setAttribute()` for standard SVG attributes (NOT `setAttributeNS()`)
- Only use `setAttributeNS()` for `xlink:href` and other namespaced attributes

**Warning signs:** Elements appear in DOM inspector but don't render visually; console shows no errors.

### Pitfall 2: Text Positioning and Anchoring

**What goes wrong:** SVG `<text>` elements position from baseline, not top-left like HTML - text appears cut off or misaligned.

**Why it happens:** SVG text uses baseline alignment by default. Coordinate (`x`, `y`) is the baseline position, not the top-left corner.

**How to avoid:**
- Use `text-anchor="middle"` for centered text
- Account for font size when positioning (y-coordinate is baseline, add ~70% of font size to get visual center)
- Use `dominant-baseline="middle"` for vertical centering
- Test with actual content - "gjpqy" renders lower than "ABCD" due to descenders

**Warning signs:** Text appears too high/low, cut off by component boundaries, not centered despite `text-anchor: middle`.

### Pitfall 3: ViewBox Coordinate Mismatches

**What goes wrong:** Components positioned at pixel coordinates don't match where they render after setting `viewBox`.

**Why it happens:** `viewBox` defines internal coordinate system independent of actual SVG size. `viewBox="0 0 800 400"` means the internal space is 800×400 units, regardless of CSS width.

**How to avoid:**
- Set `viewBox` first, then use those coordinates consistently
- Example: `viewBox="0 0 800 400"` means x ranges 0-800, y ranges 0-400
- Don't mix pixel-based positioning with viewBox coordinates
- Use `preserveAspectRatio="xMidYMid meet"` to maintain aspect ratio

**Warning signs:** Components overlap unexpectedly, diagram doesn't fill container, proportions are distorted.

### Pitfall 4: Event Delegation with SVG

**What goes wrong:** Click/hover events on `<g>` elements don't fire when clicking child shapes.

**Why it happens:** SVG child elements receive events, not the parent `<g>`. Unlike HTML where events bubble predictably, SVG requires explicit pointer-events handling.

**How to avoid:**
- Set `pointer-events: bounding-box` on `<g>` elements for easier targeting
- OR attach listeners to child shapes and use `event.currentTarget.closest('g')`
- For tooltips, put `<title>` inside the `<g>` - it works for all children

**Warning signs:** Must click exact shape boundary for interaction, hover areas feel inconsistent.

### Pitfall 5: Text Wrapping and Line Breaks

**What goes wrong:** SVG `<text>` doesn't support automatic line wrapping - `\n` in `textContent` doesn't create line breaks.

**Why it happens:** SVG text is designed for precise positioning, not flow layout like HTML.

**How to avoid:**
- Use multiple `<text>` elements with adjusted `y` values for multi-line labels
- OR use `<tspan>` elements with `dy` offsets:
  ```javascript
  const text = createSVGElement('text', { x: 100, y: 100 });
  const line1 = createSVGElement('tspan', { x: 100, dy: 0 });
  line1.textContent = 'Instruction';
  const line2 = createSVGElement('tspan', { x: 100, dy: 16 });
  line2.textContent = 'Memory';
  text.appendChild(line1);
  text.appendChild(line2);
  ```
- For single-line labels, keep text short

**Warning signs:** Component labels show "\n" literally, text runs off component boundaries.

### Pitfall 6: Z-Index and Layering

**What goes wrong:** SVG doesn't respect CSS `z-index` - elements added later appear on top regardless of z-index value.

**Why it happens:** SVG uses painter's algorithm - elements are drawn in DOM order, not CSS stacking order.

**How to avoid:**
- Order matters: add background shapes first, foreground elements last
- For dynamic re-ordering, use `element.parentNode.appendChild(element)` to move to top
- Structure SVG logically: backgrounds → components → labels → tooltips

**Warning signs:** Labels hidden behind components, active highlighting covered by inactive elements.

## Code Examples

Verified patterns from research and best practices:

### Complete SVG Block Diagram Initialization

```javascript
// Create root SVG element with responsive viewBox
const SVG_NS = 'http://www.w3.org/2000/svg';

function createBlockDiagram(container) {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.setAttribute('viewBox', '0 0 800 400');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.setAttribute('class', 'cpu-block-diagram');

  // Add components in layer order (back to front)
  svg.appendChild(createDataPaths());       // Background: wires/connections
  svg.appendChild(createComponents());      // Middle: functional units
  svg.appendChild(createPipelineRegisters()); // Foreground: F/D, D/X, etc.
  svg.appendChild(createLabels());          // Top: text labels

  container.appendChild(svg);
  return svg;
}
```

### Reusable Component Builder

```javascript
function createComponent(type, x, y, width, height, label) {
  const g = document.createElementNS(SVG_NS, 'g');
  g.setAttribute('class', `component ${type}`);
  g.setAttribute('data-component', type.toUpperCase());

  // Tooltip
  const title = document.createElementNS(SVG_NS, 'title');
  title.textContent = getComponentDescription(type);
  g.appendChild(title);

  // Background rect
  const rect = document.createElementNS(SVG_NS, 'rect');
  rect.setAttribute('x', x);
  rect.setAttribute('y', y);
  rect.setAttribute('width', width);
  rect.setAttribute('height', height);
  rect.setAttribute('rx', 4);
  g.appendChild(rect);

  // Label
  const text = document.createElementNS(SVG_NS, 'text');
  text.setAttribute('x', x + width / 2);
  text.setAttribute('y', y + height / 2 + 5); // +5 for baseline adjustment
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('class', 'component-label');
  text.textContent = label;
  g.appendChild(text);

  return g;
}

// Usage
const alu = createComponent('alu', 400, 150, 80, 100, 'ALU');
const regFile = createComponent('register-file', 250, 120, 100, 160, 'Register File');
```

### State Update Handler

```javascript
// Integrate with existing cpu:framechange event system
function handleFrameChange(event) {
  const state = event.detail.state;

  // Clear all active states
  document.querySelectorAll('.component.active, .pipeline-register.active')
    .forEach(el => el.classList.remove('active'));

  // Highlight active components based on pipeline stage
  if (state.pipeline.IF.active) {
    document.querySelector('[data-component="IMEM"]')?.classList.add('active');
  }

  if (state.pipeline.ID.active) {
    document.querySelector('[data-component="REGISTER-FILE"]')?.classList.add('active');
  }

  if (state.pipeline.EX.active) {
    document.querySelector('[data-component="ALU"]')?.classList.add('active');
  }

  if (state.pipeline.MEM.active) {
    if (state.pipeline.MEM.memRead || state.pipeline.MEM.memWrite) {
      document.querySelector('[data-component="DMEM"]')?.classList.add('active');
    }
  }

  // Update pipeline register instruction displays
  updatePipelineRegisterDisplays(state);
}

function updatePipelineRegisterDisplays(state) {
  const stages = ['FD', 'DX', 'XM', 'MW'];
  const stageMap = {
    'FD': 'IF',  // F/D shows what IF stage has
    'DX': 'ID',  // D/X shows what ID stage has
    'XM': 'EX',  // X/M shows what EX stage has
    'MW': 'MEM'  // M/W shows what MEM stage has
  };

  stages.forEach(pipeReg => {
    const stageName = stageMap[pipeReg];
    const display = document.querySelector(`[data-instruction-display="${pipeReg}"]`);

    if (display) {
      const instruction = state.pipeline.IF.instruction; // All stages share instruction
      const active = state.pipeline[stageName].active;

      if (active && instruction) {
        display.textContent = `${instruction.mnemonic} ${formatOperands(instruction)}`;
      } else {
        display.textContent = 'NOP';
      }
    }
  });
}
```

### CSS Active State Styling

```css
/* Component base styles */
.component rect {
  fill: var(--color-surface);
  stroke: var(--color-border);
  stroke-width: 2;
  transition: all 0.3s ease;
}

/* Active highlighting */
.component.active rect {
  stroke-width: 3;
}

/* Component-specific active colors */
.alu.active rect {
  fill: #FFF3E0;
  stroke: var(--stage-ex-color); /* Orange from existing palette */
}

.register-file.active rect {
  fill: #E3F2FD;
  stroke: var(--stage-id-color); /* Blue */
}

.data-memory.active rect,
.instruction-memory.active rect {
  fill: #F3E5F5;
  stroke: var(--stage-mem-color); /* Purple */
}

/* Pipeline registers (red vertical bars) */
.pipeline-register rect {
  fill: #EF5350;
  stroke: #C62828;
  stroke-width: 1;
}

/* Multiplexers (blue triangles) */
.multiplexer polygon {
  fill: #2196F3;
  stroke: #1976D2;
  stroke-width: 1;
  opacity: 0.8;
}

.multiplexer.active polygon {
  opacity: 1.0;
  stroke-width: 2;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Stage cards (text-based) | SVG block diagram | Phase 10 re-plan (2026-02) | More educational - shows hardware architecture visually |
| Inline SVG in HTML | JavaScript-generated SVG | Modern practice | Dynamic updates easier, separation of concerns |
| Custom tooltip libraries | Native `<title>` element | SVG 1.1+ (2003) | Accessible, lightweight, works on touch devices |
| Manual coordinate math | `viewBox` + `preserveAspectRatio` | SVG 1.0 (2001) | Responsive by default, browser-optimized |

**Deprecated/outdated:**
- **`innerHTML` for SVG manipulation:** Modern approach uses `createElementNS` with DocumentFragment for performance
- **`xlink:href` for image links:** SVG 2.0 uses plain `href` attribute (though `xlink:href` still widely supported for compatibility)
- **External SVG with `<object>` or `<embed>`:** Inline SVG preferred for JavaScript manipulation and styling

## Open Questions

1. **Exact component layout from Duke ECE 350 slides**
   - What we know: Slide 09 shows standard 5-stage pipeline layout (Insn Mem → Reg File → ALU → Data Mem), pipeline registers in red, muxes as blue triangles
   - What's unclear: Exact positioning, spacing, wire routing details
   - Recommendation: Reference the general layout, adapt spacing/proportions for web display (likely more horizontal space needed for labels)

2. **Pipeline register instruction display positioning**
   - What we know: Need to show which instruction is in each pipeline register (F/D, D/X, X/M, M/W)
   - What's unclear: Best placement - below register bar, inside bar, or floating above?
   - Recommendation: Place below pipeline register bars (similar to labels) using small monospace text - keeps diagram clean, follows reference style

3. **Register file read/write visualization detail**
   - What we know: User wants to display "register values being read/written"
   - What's unclear: Show this via tooltip on Register File component? Or separate indicator?
   - Recommendation: Tooltip on hover of Register File showing "Reading: $t0, $t1" and "Writing: $t2" - keeps main diagram uncluttered, user rejected wire value labels

4. **Active component highlighting persistence**
   - What we know: Components light up when active (ALU during EX, Memory during MEM)
   - What's unclear: Should highlighting persist through subsequent stages or clear immediately?
   - Recommendation: Clear on next frame - matches animation flow, prevents visual clutter, aligns with cycle-accurate behavior

## Sources

### Primary (HIGH confidence)

**SVG Standards and Documentation:**
- [MDN - Namespaces crash course](https://developer.mozilla.org/en-US/docs/Web/SVG/Namespaces_Crash_Course) - Namespace handling, createElementNS
- [MDN - Basic Shapes](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Basic_Shapes) - SVG primitives (rect, polygon, circle)
- [MDN - Paths](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorials/SVG_from_scratch/Paths) - Path syntax for connections
- [MDN - preserveAspectRatio](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/preserveAspectRatio) - Responsive scaling

**RISC Architecture:**
- [Organization of Computer Systems: Processor & Datapath](https://www.cise.ufl.edu/~mssz/CompOrg/CDA-proc.html) - MIPS datapath components
- [Classic RISC pipeline - Wikipedia](https://en.wikipedia.org/wiki/Classic_RISC_pipeline) - 5-stage pipeline architecture
- [CSC236 Data Structures - MIPS Datapath](https://cs.middlesexcc.edu/~schatz/csc264/handouts/mips.datapath.html) - Component descriptions

### Secondary (MEDIUM confidence)

**Best Practices and Tutorials:**
- [Tooltip Best Practices | CSS-Tricks](https://css-tricks.com/tooltip-best-practices/) - Tooltip implementation guidance
- [Mastering SVG Hover Effects](https://www.svgator.com/blog/mastering-svg-hover-effects-tips-examples-and-best-practices/) - CSS hover animations
- [Using Javascript with SVG](https://www.petercollingridge.co.uk/tutorials/svg/interactive/javascript/) - DOM manipulation patterns
- [How to Scale SVG | CSS-Tricks](https://css-tricks.com/scale-svg/) - Responsive SVG techniques

**Performance:**
- [Updates in hardware-accelerated animation capabilities | Chrome for Developers](https://developer.chrome.com/blog/hardware-accelerated-animations) - Transform vs position animation
- [innerHTML vs createElement/appendChild | Medium](https://medium.com/@kevinchi118/innerhtml-vs-createelement-appendchild-3da39275a694) - DOM manipulation performance

### Tertiary (LOW confidence - informational only)

- [Flourish Interactive SVG](https://flourish.studio/blog/interactive-svg-template/) - Commercial tool reference (not using, but validates approach)
- [6502 svg schematic](https://davidmjc.github.io/6502/) - Example of interactive processor diagram

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - SVG and vanilla JS are proven technologies, no uncertainty
- Architecture: HIGH - Patterns verified through MDN docs and existing codebase integration
- Component layout: MEDIUM - Reference slides guide structure, but exact positioning is Claude's discretion
- Pitfalls: HIGH - Namespace issues, text positioning, viewBox coordination are well-documented gotchas

**Research date:** 2026-02-11
**Valid until:** ~30 days (SVG/DOM standards stable, processor architecture reference stable)

**Key dependencies:**
- Existing Phase 9 code: AnimationEngine, CPUState, cpu:framechange events
- Existing Phase 10 code: RegisterView (keep), ExecutionView (remove/integrate)
- Design system: visualization.css (update), forest green theme (existing)
