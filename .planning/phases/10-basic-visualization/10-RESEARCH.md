# Phase 10: Basic Visualization - Research

**Researched:** 2026-02-11
**Domain:** Vanilla JavaScript DOM-based CPU visualization
**Confidence:** MEDIUM-HIGH

## Summary

Phase 10 requires building interactive DOM-based visualizations for a 5-stage CPU pipeline and 32-register file. The visualization must display current pipeline state, register values, and highlight changes during animation playback.

The existing codebase uses vanilla JavaScript with no frameworks, following a consistent design system with CSS custom properties. The CPUState class already tracks visualization metadata (changedRegisters, activeStages) making Phase 10 a pure UI layer that listens to 'cpu:framechange' events and updates DOM accordingly.

The standard approach is CSS Grid for dashboard layout (pipeline stages + register grid), DocumentFragment/template tags for efficient DOM updates, and ARIA live regions for accessibility. No external libraries needed - pure HTML/CSS/JS aligns with project constraints.

**Primary recommendation:** Use CSS Grid two-column layout (pipeline visualization left, register grid right), event-driven updates via 'cpu:framechange' listener, and CSS classes for highlighting changed elements with transitions.

## Standard Stack

### Core (Already in Place)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Vanilla JS | ES6+ | DOM manipulation, event handling | Project constraint (no frameworks) |
| CSS Grid | Native | Dashboard layout structure | Universal browser support (97%+) |
| CSS Custom Properties | Native | Theming, dynamic styling | Already used in design-system.css |
| CustomEvent API | Native | cpu:framechange communication | Already implemented in AnimationEngine |

### Supporting (Native Browser APIs)
| API | Purpose | When to Use |
|-----|---------|-------------|
| DocumentFragment | Batch DOM updates | Building register grid (32 elements) |
| &lt;template&gt; tag | Reusable UI fragments | Pipeline stage cards, register cells |
| ARIA live regions | Accessibility announcements | Dynamic content changes for screen readers |
| CSS transitions | Visual feedback | Highlighting changed registers/stages |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS Grid | Flexbox only | Grid handles 2D layout better for dashboard structure |
| Inline styles | CSS classes | Classes more maintainable, enable transitions |
| React/Vue | Vanilla JS | Would add framework weight (project constraint: vanilla JS) |
| Canvas API | DOM elements | DOM provides accessibility, easier styling, text selection |

**Installation:**
No installation required - all native browser APIs.

## Architecture Patterns

### Recommended Project Structure
```
cpu-simulator/
├── src/
│   ├── visualization/
│   │   ├── pipeline-view.js         # Pipeline stage visualization
│   │   ├── register-view.js         # Register file visualization
│   │   ├── execution-view.js        # Cycle/instruction counters
│   │   └── cpu-visualizer.js        # Main coordinator
│   └── assets/
│       └── css/
│           └── visualization.css    # Visualization-specific styles
└── demo.html                        # Main interactive demo page
```

### Pattern 1: Event-Driven View Updates
**What:** Listen to 'cpu:framechange' events and update DOM based on CPUState changes
**When to use:** All visualization components - decouples rendering from animation logic
**Example:**
```javascript
// Source: Existing AnimationEngine implementation
class PipelineView {
  constructor(containerElement) {
    this.container = containerElement;
    this.setupEventListener();
  }

  setupEventListener() {
    window.addEventListener('cpu:framechange', (event) => {
      this.render(event.detail.state);
    });
  }

  render(cpuState) {
    // Update pipeline stage display based on cpuState.pipeline
    // Use cpuState.activeStages to highlight active stages
  }
}
```

### Pattern 2: CSS Grid Dashboard Layout
**What:** Two-dimensional layout with named grid areas for pipeline, registers, controls
**When to use:** Main demo page structure
**Example:**
```css
/* Source: CSS Grid layout patterns 2026 */
.cpu-dashboard {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header header"
    "pipeline registers"
    "controls controls";
  gap: var(--space-lg);
}

.pipeline-view { grid-area: pipeline; }
.register-view { grid-area: registers; }
.controls { grid-area: controls; }

/* Responsive: stack on mobile */
@media (max-width: 768px) {
  .cpu-dashboard {
    grid-template-columns: 1fr;
    grid-template-areas:
      "header"
      "pipeline"
      "registers"
      "controls";
  }
}
```

### Pattern 3: DocumentFragment for Batch DOM Updates
**What:** Build DOM structure in memory before inserting to minimize reflows
**When to use:** Initial render of 32-register grid, pipeline stage cards
**Example:**
```javascript
// Source: MDN DocumentFragment best practices
function buildRegisterGrid(registerValues) {
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < 32; i++) {
    const cell = document.createElement('div');
    cell.className = 'register-cell';
    cell.dataset.register = i;
    cell.innerHTML = `
      <div class="register-name">$${i}</div>
      <div class="register-value">${formatHex(registerValues[i])}</div>
    `;
    fragment.appendChild(cell);
  }

  return fragment;
}

// Single DOM insertion
container.appendChild(buildRegisterGrid(state.registers));
```

### Pattern 4: CSS Class-Based Highlighting
**What:** Toggle CSS classes for changed registers/active stages instead of inline styles
**When to use:** Visual feedback for state changes during animation
**Example:**
```javascript
// Update changed registers
function highlightChangedRegisters(cpuState) {
  // Clear previous highlights
  document.querySelectorAll('.register-cell.changed')
    .forEach(el => el.classList.remove('changed'));

  // Add new highlights
  cpuState.changedRegisters.forEach(regNum => {
    const cell = document.querySelector(`[data-register="${regNum}"]`);
    cell.classList.add('changed');
  });
}
```

```css
/* CSS handles animation timing */
.register-cell {
  transition: background var(--timing-standard) var(--easing-standard);
}

.register-cell.changed {
  background: var(--color-accent-light);
  animation: pulse 500ms ease-out;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

### Pattern 5: Monospace Alignment for Hex Values
**What:** Use monospace fonts and fixed-width formatting for register/memory values
**When to use:** Register display, memory display, binary/hex formatting
**Example:**
```javascript
// Source: Hex editor display patterns
function formatHex(value) {
  return '0x' + value.toString(16).toUpperCase().padStart(8, '0');
}

function formatBinary(value) {
  return '0b' + value.toString(2).padStart(32, '0');
}
```

```css
.register-value, .memory-value {
  font-family: var(--font-mono);
  font-variant-numeric: tabular-nums; /* Fixed-width digits */
  letter-spacing: 0.05em;
}
```

### Anti-Patterns to Avoid
- **Updating DOM on every frame during fast playback:** Use requestAnimationFrame throttling or batch updates to prevent performance issues
- **Inline styles for highlighting:** Use CSS classes to enable transitions and maintain separation of concerns
- **Creating new DOM nodes on every update:** Update textContent/classList only; create structure once
- **Global querySelector every update:** Cache element references in view constructors
- **Synchronous rendering blocking animation loop:** Keep render functions lightweight (<16ms)

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Layout system | Custom positioning logic | CSS Grid + Flexbox | Native, responsive, accessible, well-tested |
| State management | Custom pub/sub | CustomEvent on window | Already implemented, browser-optimized |
| Value formatting | String concatenation | toLocaleString(), Intl.NumberFormat | Handles edge cases, i18n-ready |
| Accessibility | Manual focus management | Native HTML elements + ARIA | Screen reader compatibility out-of-box |
| Responsive design | JS resize listeners | CSS media queries | Declarative, performant, maintainable |
| Animation timing | setTimeout loops | CSS transitions + requestAnimationFrame | GPU-accelerated, respects prefers-reduced-motion |

**Key insight:** Browser APIs have evolved to handle common UI patterns efficiently. Custom solutions add maintenance burden and often miss edge cases (accessibility, internationalization, reduced motion preferences).

## Common Pitfalls

### Pitfall 1: Excessive DOM Updates During Playback
**What goes wrong:** Updating all 32 register cells + 5 pipeline stages on every frame (2-4 FPS) causes jank
**Why it happens:** Naive implementation updates entire view even when only 1-2 registers changed
**How to avoid:** Check cpuState.changedRegisters and only update elements that actually changed
**Warning signs:** Animation feels sluggish, CPU profiler shows high "Recalculate Style" time

### Pitfall 2: Layout Thrashing (Read-Write-Read Pattern)
**What goes wrong:** Reading offsetHeight/clientWidth after DOM writes forces synchronous reflow
**Why it happens:** Measuring elements to position tooltips or calculate sizes
**How to avoid:** Batch all reads before writes, or use ResizeObserver for async measurement
**Warning signs:** Chrome DevTools shows "Forced reflow" warnings

### Pitfall 3: Inaccessible Dynamic Content
**What goes wrong:** Screen readers don't announce register value changes or pipeline stage transitions
**Why it happens:** Forgetting ARIA live regions for dynamic content
**How to avoid:** Use aria-live="polite" on register/cycle counter containers
**Warning signs:** Testing with VoiceOver/NVDA reveals no feedback during animation

### Pitfall 4: Non-Monospace Font Alignment Issues
**What goes wrong:** Hex values like 0x0000000A and 0xFFFFFFFF have different widths, causing layout shift
**Why it happens:** Using proportional font for numeric data
**How to avoid:** Set font-family: var(--font-mono) and font-variant-numeric: tabular-nums on value displays
**Warning signs:** Register grid column widths jump during value updates

### Pitfall 5: Missing Responsive Breakpoints
**What goes wrong:** Two-column layout becomes unusable on mobile/tablet
**Why it happens:** Assuming desktop viewport
**How to avoid:** Test at 320px, 768px, 1024px breakpoints; use CSS Grid auto-fit/minmax
**Warning signs:** Horizontal scroll on mobile, text overflow, tiny touch targets

### Pitfall 6: Performance Degradation with Template Cloning
**What goes wrong:** Cloning &lt;template&gt; nodes 32 times per frame update is slower than expected
**Why it happens:** MDN 2026 research shows DocumentFragment performance is "often overstated"
**How to avoid:** Create DOM structure once, update textContent/classList only on subsequent frames
**Warning signs:** Profiler shows significant time in cloneNode()

## Code Examples

Verified patterns from official sources and existing codebase:

### CSS Grid Dashboard Layout
```css
/* Source: Project design-system.css + CSS Grid 2026 patterns */
.cpu-demo-container {
  display: grid;
  grid-template-columns: minmax(300px, 1fr) minmax(300px, 1fr);
  grid-template-rows: auto 1fr auto;
  gap: var(--space-lg);
  padding: var(--space-lg);
  max-width: 1400px;
  margin: 0 auto;
}

.pipeline-visualization {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-md);
}

.register-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--space-sm);
  padding: var(--space-md);
}

@media (max-width: 768px) {
  .cpu-demo-container {
    grid-template-columns: 1fr;
  }

  .pipeline-visualization {
    grid-template-columns: 1fr;
  }
}
```

### Event-Driven Rendering
```javascript
// Source: Existing AnimationEngine pattern
class CPUVisualizer {
  constructor(containerElement) {
    this.container = containerElement;
    this.pipelineView = null;
    this.registerView = null;

    this.setupViews();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Listen to animation frame changes
    window.addEventListener('cpu:framechange', (event) => {
      this.render(event.detail.state);
    });
  }

  render(cpuState) {
    // Delegate to specialized views
    this.pipelineView.update(cpuState.pipeline, cpuState.activeStages);
    this.registerView.update(cpuState.registers, cpuState.changedRegisters);
    this.executionView.update(cpuState.cycleCount, cpuState.instructionCount);
  }
}
```

### Efficient Register Update (Only Changed)
```javascript
// Source: DOM manipulation best practices 2026
class RegisterView {
  constructor(containerElement) {
    this.container = containerElement;
    this.cells = new Map(); // Cache DOM references
    this.buildGrid();
  }

  buildGrid() {
    // Create structure once
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < 32; i++) {
      const cell = document.createElement('div');
      cell.className = 'register-cell';
      cell.dataset.register = i;
      cell.innerHTML = `
        <div class="register-name">$${i}</div>
        <div class="register-value" data-value>0x00000000</div>
      `;

      this.cells.set(i, {
        element: cell,
        valueEl: cell.querySelector('[data-value]')
      });

      fragment.appendChild(cell);
    }

    this.container.appendChild(fragment);
  }

  update(registers, changedRegisters) {
    // Only update changed registers
    changedRegisters.forEach(regNum => {
      const { element, valueEl } = this.cells.get(regNum);

      // Update value
      valueEl.textContent = this.formatHex(registers[regNum]);

      // Add highlight class (CSS handles animation)
      element.classList.add('changed');

      // Remove highlight after animation
      setTimeout(() => {
        element.classList.remove('changed');
      }, 500);
    });
  }

  formatHex(value) {
    return '0x' + value.toString(16).toUpperCase().padStart(8, '0');
  }
}
```

### Pipeline Stage Visualization
```javascript
// Source: Educational CPU visualization patterns
class PipelineView {
  constructor(containerElement) {
    this.container = containerElement;
    this.stages = ['IF', 'ID', 'EX', 'MEM', 'WB'];
    this.stageElements = new Map();
    this.buildPipeline();
  }

  buildPipeline() {
    const fragment = document.createDocumentFragment();

    this.stages.forEach(stageName => {
      const stageCard = document.createElement('div');
      stageCard.className = 'pipeline-stage';
      stageCard.dataset.stage = stageName;
      stageCard.innerHTML = `
        <div class="stage-header">${stageName}</div>
        <div class="stage-content" data-content>
          <div class="stage-instruction">-</div>
          <div class="stage-details"></div>
        </div>
      `;

      this.stageElements.set(stageName, {
        element: stageCard,
        contentEl: stageCard.querySelector('[data-content]')
      });

      fragment.appendChild(stageCard);
    });

    this.container.appendChild(fragment);
  }

  update(pipeline, activeStages) {
    this.stages.forEach(stageName => {
      const { element, contentEl } = this.stageElements.get(stageName);
      const stageData = pipeline[stageName];

      // Toggle active class
      if (activeStages.has(stageName)) {
        element.classList.add('active');
      } else {
        element.classList.remove('active');
      }

      // Update instruction display
      const instruction = stageData.instruction;
      const instrEl = contentEl.querySelector('.stage-instruction');

      if (instruction && stageData.active) {
        instrEl.textContent = this.formatInstruction(instruction);
      } else {
        instrEl.textContent = '-';
      }
    });
  }

  formatInstruction(instruction) {
    // Format: "ADD $10, $8, $9"
    const { mnemonic, rs, rt, rd, immediate } = instruction;

    if (mnemonic === 'ADDI' || mnemonic === 'LW' || mnemonic === 'SW') {
      return `${mnemonic} $${rt}, $${rs}, ${immediate}`;
    } else if (mnemonic === 'BEQ') {
      return `${mnemonic} $${rs}, $${rt}, ${immediate}`;
    } else if (mnemonic === 'J') {
      return `${mnemonic} ${immediate}`;
    } else {
      return `${mnemonic} $${rd}, $${rs}, $${rt}`;
    }
  }
}
```

### ARIA Live Region for Accessibility
```html
<!-- Source: WCAG 2.1 AA live regions best practices -->
<div class="execution-state" aria-live="polite" aria-atomic="true">
  <div class="stat">
    <span class="label">Cycle:</span>
    <span class="value" id="cycle-count">0</span>
  </div>
  <div class="stat">
    <span class="label">Instructions:</span>
    <span class="value" id="instruction-count">0</span>
  </div>
</div>
```

```javascript
// Updates announced automatically by screen readers
function updateExecutionState(cycleCount, instructionCount) {
  document.getElementById('cycle-count').textContent = cycleCount;
  document.getElementById('instruction-count').textContent = instructionCount;
  // aria-live="polite" causes screen reader to announce after current speech
}
```

### CSS Color-Coded Pipeline Stages
```css
/* Source: Educational CPU pipeline visual design patterns */
:root {
  --stage-if: #4CAF50;    /* Green - Fetch */
  --stage-id: #2196F3;    /* Blue - Decode */
  --stage-ex: #FF9800;    /* Orange - Execute */
  --stage-mem: #9C27B0;   /* Purple - Memory */
  --stage-wb: #F44336;    /* Red - Write Back */
}

.pipeline-stage {
  border: 2px solid var(--color-border);
  border-radius: 8px;
  padding: var(--space-md);
  background: var(--color-surface);
  transition: all var(--timing-standard) var(--easing-standard);
}

.pipeline-stage[data-stage="IF"].active {
  border-color: var(--stage-if);
  background: color-mix(in srgb, var(--stage-if) 10%, white);
}

.pipeline-stage[data-stage="ID"].active {
  border-color: var(--stage-id);
  background: color-mix(in srgb, var(--stage-id) 10%, white);
}

.pipeline-stage[data-stage="EX"].active {
  border-color: var(--stage-ex);
  background: color-mix(in srgb, var(--stage-ex) 10%, white);
}

.pipeline-stage[data-stage="MEM"].active {
  border-color: var(--stage-mem);
  background: color-mix(in srgb, var(--stage-mem) 10%, white);
}

.pipeline-stage[data-stage="WB"].active {
  border-color: var(--stage-wb);
  background: color-mix(in srgb, var(--stage-wb) 10%, white);
}

.stage-header {
  font-weight: bold;
  font-size: var(--text-lg);
  margin-bottom: var(--space-sm);
  font-family: var(--font-mono);
}

.stage-instruction {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-text);
  min-height: 1.5em; /* Prevent layout shift */
}
```

### Responsive Monospace Formatting
```css
/* Source: Monospace font best practices 2026 */
.register-value, .memory-address, .hex-value {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-variant-numeric: tabular-nums; /* Fixed-width numerics */
  letter-spacing: 0.05em;
  color: var(--color-text);
}

/* Ensure consistent width for hex values */
.register-value::before {
  content: '0x';
  opacity: 0.6;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| jQuery DOM manipulation | Vanilla JS with cached refs | 2020-2024 | Smaller bundle, native performance, no deps |
| Inline styles | CSS classes + transitions | 2023+ | GPU acceleration, respects prefers-reduced-motion |
| Tables for layout | CSS Grid | 2017+ | Responsive without media query complexity |
| setInterval for animation | requestAnimationFrame | 2015+ | 60fps sync with browser paint cycle |
| Manual ARIA | Semantic HTML + native elements | 2021+ | Better screen reader support out-of-box |
| Sass/LESS variables | CSS custom properties | 2020+ | Runtime theming, no build step |

**Deprecated/outdated:**
- &lt;table&gt; for layout: Use CSS Grid for two-dimensional layouts
- innerHTML for updates: Use textContent for text-only updates (XSS prevention)
- DocumentFragment performance claims: MDN 2026 notes performance benefit "often overstated" - optimize for readability
- offsetWidth/Height for measurements: Use ResizeObserver API for async, non-blocking measurement

## Open Questions

1. **Should register values display in hex, decimal, or both?**
   - What we know: Academic CPU visualizers typically show hex (0x format)
   - What's unclear: User preference for decimal vs hex vs binary
   - Recommendation: Default to hex, add toggle in Phase 11 (controls enhancement)

2. **How much pipeline stage detail to show?**
   - What we know: CPUState tracks instruction, opcode, rs/rt/rd, aluResult, etc.
   - What's unclear: Is full detail overwhelming or educational?
   - Recommendation: Phase 10 shows instruction + active indicator; Phase 11+ adds detail panel

3. **Performance threshold for 32 register updates?**
   - What we know: Only changed registers need updates (typically 1-3 per cycle)
   - What's unclear: Actual performance on low-end devices
   - Recommendation: Implement selective updates; measure with Chrome DevTools on throttled CPU

4. **Color-coding strategy for register changes vs pipeline stages?**
   - What we know: Educational pipeline diagrams use color per stage (IF=green, ID=blue, etc.)
   - What's unclear: Does this conflict with register highlight colors?
   - Recommendation: Use stage border colors + neutral yellow/gold for register highlights

## Sources

### Primary (HIGH confidence)
- [MDN: CSS Grid Layout](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Grid_layout) - Layout structure patterns
- [MDN: DocumentFragment](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment) - Performance characteristics
- [MDN: ARIA Live Regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Guides/Live_regions) - Accessibility implementation
- [MDN: Using CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_cascading_variables/Using_CSS_custom_properties) - Theming patterns
- Existing codebase: /Users/orases/Aaron/website/cpu-simulator/src/core/cpu-state.js (CPUState structure)
- Existing codebase: /Users/orases/Aaron/website/cpu-simulator/src/animation/animation-engine.js (Event patterns)
- Existing codebase: /Users/orases/Aaron/website/docs/assets/css/design-system.css (Design tokens)

### Secondary (MEDIUM confidence)
- [CSS Grid vs Flexbox in 2026 - TheLinuxCode](https://thelinuxcode.com/css-grid-vs-flexbox-in-2026-practical-differences-mental-patterns-and-real-layout-patterns/) - Layout decision matrix
- [Patterns for Memory Efficient DOM Manipulation - Frontend Masters](https://frontendmasters.com/blog/patterns-for-memory-efficient-dom-manipulation/) - DOM update strategies
- [ARIA Live Regions for Dynamic Content - UXPin](https://www.uxpin.com/studio/blog/aria-live-regions-for-dynamic-content/) - Accessibility patterns
- [CSS Custom Properties Theming - NamasteDev](https://namastedev.com/blog/how-to-use-custom-properties-and-themes-in-modern-css/) - Design system integration
- [Best Monospaced Google Fonts 2026 - Lexington Themes](https://lexingtonthemes.com/blog/best-new-monospaced-google-fonts-2026) - Typography recommendations

### Tertiary (LOW confidence - research findings)
- [Interactive CPU Architecture Simulator - YoMotherboard](https://yomotherboard.com/interactive-cpu-architecture-simulator/) - Educational patterns (content not accessible)
- [GeeksforGeeks: Pipelined Architecture](https://www.geeksforgeeks.org/computer-organization-architecture/pipelined-architecture-with-its-diagram/) - Visual design patterns with color coding
- [Hex Editor Neo Documentation](https://hhdsoftwaredocs.online/hex/customization/binary-editor/editor.html) - Monospace font requirements for hex display

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All native APIs, already in use in codebase
- Architecture: HIGH - Event-driven pattern established, CSS Grid well-documented
- Pitfalls: MEDIUM - Based on general DOM performance best practices, not CPU-specific testing
- Code examples: HIGH - Derived from existing codebase patterns + verified MDN sources

**Research date:** 2026-02-11
**Valid until:** 2026-03-11 (30 days - stable technologies, mostly native APIs)

**Key dependencies:**
- CPUState metadata (changedRegisters, activeStages) - already implemented
- AnimationEngine events (cpu:framechange) - already implemented
- Design system tokens (colors, spacing, fonts) - already defined

**Technical debt to avoid:**
- Don't create custom grid system (use CSS Grid)
- Don't build custom event bus (use CustomEvent)
- Don't hand-roll number formatting (use native toString(16) + padStart)
- Don't skip ARIA attributes (phase 10 compliance required)
