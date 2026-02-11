# Architecture Research

**Domain:** CPU Simulator Educational Visualization
**Researched:** 2026-02-11
**Confidence:** HIGH

## Standard Architecture

### System Overview

Educational CPU simulators follow a three-layer architecture optimized for progressive learning and interactive visualization:

```
┌─────────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Demo Page    │  │ Doc Pages    │  │ Navigation   │      │
│  │ (Controls +  │  │ (Progressive │  │ (Breadcrumb  │      │
│  │  Canvas)     │  │  Learning)   │  │  + Menu)     │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
│         │                  │                  │              │
├─────────┴──────────────────┴──────────────────┴──────────────┤
│                   SIMULATION LAYER                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │           CPU Simulator State Machine                │    │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐    │    │
│  │  │Pipeline│  │Register│  │ Memory │  │  ALU   │    │    │
│  │  │ Model  │  │  File  │  │  Model │  │ Model  │    │    │
│  │  └────────┘  └────────┘  └────────┘  └────────┘    │    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│                   VISUALIZATION LAYER                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                   │
│  │ Pipeline │  │ Register │  │  Memory  │                   │
│  │Visualizer│  │Visualizer│  │Visualizer│                   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                   │
│       └─────────────┴──────────────┴──── Canvas API          │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Demo Page** | Interactive step-through interface with controls and visualization canvas | Single HTML page with embedded JS, sidebar controls (step/run/reset), main canvas area |
| **Documentation Pages** | Progressive learning path from basics → advanced | Multiple HTML pages (4-6 pages), each focused on one concept area |
| **Navigation System** | Consistent site-wide nav + breadcrumbs | Shared CSS/JS for nav.css + breadcrumbs.css, shows current location in learning path |
| **CPU State Machine** | Core simulation logic: pipeline stages, register operations, instruction execution | JavaScript class-based model with state object, executes instructions cycle-by-cycle |
| **Pipeline Model** | 5-stage pipeline (Fetch, Decode, Execute, Memory, Writeback) with hazard detection | State machine tracking current instruction in each stage, detects data/control hazards |
| **Register File** | 32 general-purpose registers + special registers (PC, IR, etc.) | JavaScript array/object, tracks read/write operations for visualization |
| **Memory Model** | Instruction and data memory with addressable storage | JavaScript Map or typed array, loads program, stores data |
| **ALU Model** | Arithmetic and logic operations | Function set for ADD, SUB, AND, OR, etc., updates flags |
| **Visualizers** | Render current state of each component to canvas | Canvas 2D drawing functions, highlight active elements, show data flow with arrows/colors |

## Recommended Project Structure

Based on existing portfolio pattern (graphics-demo.html + docs/) and industry best practices:

```
├── index.html                    # Portfolio landing (already exists)
├── cpu-demo.html                 # Interactive CPU simulator demo
├── docs/
│   ├── index.html                # Graphics docs landing (already exists)
│   ├── cpu/
│   │   ├── index.html            # CPU docs landing page
│   │   ├── pipeline-basics.html  # Phase 1: Understanding the Pipeline
│   │   ├── alu-operations.html   # Phase 2: ALU and Instruction Execution
│   │   ├── instruction-set.html  # Phase 3: Complete Instruction Set
│   │   ├── hazards-forwarding.html # Phase 4: Pipeline Hazards & Forwarding
│   │   ├── advanced-topics.html  # Phase 5: Branch Prediction, etc.
│   │   └── assets/
│   │       ├── diagrams/         # Static pipeline diagrams
│   │       └── code-examples/    # Assembly code snippets
│   ├── assets/
│   │   ├── css/
│   │   │   ├── design-system.css # Shared design (already exists)
│   │   │   ├── nav.css           # Navigation (already exists)
│   │   │   ├── breadcrumbs.css   # Breadcrumbs (already exists)
│   │   │   └── docs.css          # Doc pages (already exists)
│   │   └── js/
│   │       ├── nav.js            # Navigation handler (already exists)
│   │       ├── cpu-simulator.js  # Core CPU simulation engine
│   │       ├── cpu-visualizer.js # Visualization rendering
│   │       └── cpu-demo-ui.js    # Demo page UI controls
└── .planning/
    └── research/                 # This directory
```

### Structure Rationale

- **docs/cpu/ subfolder:** Keeps CPU documentation separate from graphics documentation but maintains parallel structure
- **Shared assets:** Reuses existing design system (design-system.css, nav.css, breadcrumbs.css) for consistency
- **Modular JS:** Separates simulation logic (cpu-simulator.js), visualization (cpu-visualizer.js), and UI (cpu-demo-ui.js) for maintainability
- **Progressive doc pages:** Mirrors graphics project structure: landing → basics → intermediate → advanced

## Architectural Patterns

### Pattern 1: State Machine with Observable State

**What:** CPU simulator as state machine with subscriber pattern for visualization updates

**When to use:** When visualization needs to react to state changes in real-time (step-through execution)

**Trade-offs:**
- **Pros:** Clean separation between simulation logic and visualization, easy to add multiple visualizers
- **Cons:** Slightly more complex than direct coupling, requires event handling

**Example:**
```javascript
class CPUSimulator {
  constructor() {
    this.state = {
      registers: new Array(32).fill(0),
      pc: 0,
      pipeline: { fetch: null, decode: null, execute: null, memory: null, writeback: null },
      memory: new Map(),
      flags: { zero: false, negative: false, overflow: false }
    };
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  notify() {
    this.observers.forEach(obs => obs.update(this.state));
  }

  step() {
    // Execute one clock cycle
    this.executeWriteback();
    this.executeMemory();
    this.executeALU();
    this.executeDecode();
    this.executeFetch();
    this.notify(); // Trigger visualization update
  }
}

// Visualizer subscribes to state changes
const visualizer = new CPUVisualizer(canvas);
simulator.subscribe(visualizer);
```

### Pattern 2: Component-Based Visualization

**What:** Each CPU component (pipeline, registers, memory) has dedicated visualizer class

**When to use:** When different parts of CPU need different visual representations

**Trade-offs:**
- **Pros:** Modular, each visualizer can be developed/tested independently, easy to show/hide components
- **Cons:** Coordination needed for layout, more classes to manage

**Example:**
```javascript
class PipelineVisualizer {
  constructor(ctx, x, y, width, height) {
    this.ctx = ctx;
    this.bounds = { x, y, width, height };
  }

  render(pipelineState) {
    const stageWidth = this.bounds.width / 5;
    const stages = ['Fetch', 'Decode', 'Execute', 'Memory', 'Writeback'];
    stages.forEach((stage, i) => {
      this.drawStage(i * stageWidth, stage, pipelineState[stage.toLowerCase()]);
    });
  }

  drawStage(x, stageName, instruction) {
    // Draw box, label, highlight if active, show instruction
  }
}

class RegisterFileVisualizer {
  constructor(ctx, x, y) {
    this.ctx = ctx;
    this.position = { x, y };
  }

  render(registers) {
    // Draw register grid, highlight reads/writes
  }
}
```

### Pattern 3: Progressive Disclosure in Documentation

**What:** Documentation starts with simplified model, progressively adds complexity

**When to use:** Educational content where learners need scaffolding from simple to complex

**Trade-offs:**
- **Pros:** Matches natural learning progression, prevents cognitive overload, builds confidence
- **Cons:** Requires careful curriculum design, some repetition across pages

**Example structure:**
```
Page 1 (pipeline-basics.html):
  - Show 5-stage pipeline with NO hazards
  - Single instruction moving through stages
  - Build mental model of sequential flow

Page 2 (alu-operations.html):
  - Introduce different instruction types
  - Show how ALU processes each type
  - Still ignore hazards

Page 3 (hazards-forwarding.html):
  - NOW introduce data hazards
  - Show forwarding paths
  - Build on existing pipeline knowledge
```

### Pattern 4: Step-Through Execution Control

**What:** UI provides step, run, pause, reset controls for simulation

**When to use:** Educational simulators where learners need to examine state at their own pace

**Trade-offs:**
- **Pros:** Learners control pacing, can examine each cycle, supports "aha moments"
- **Cons:** Can be tedious for long programs, needs speed controls

**Example:**
```javascript
class SimulatorController {
  constructor(simulator, visualizer) {
    this.simulator = simulator;
    this.visualizer = visualizer;
    this.running = false;
    this.intervalId = null;
  }

  step() {
    this.simulator.step();
  }

  run() {
    this.running = true;
    this.intervalId = setInterval(() => {
      if (this.simulator.isHalted()) {
        this.pause();
      } else {
        this.simulator.step();
      }
    }, 500); // 500ms per cycle
  }

  pause() {
    this.running = false;
    clearInterval(this.intervalId);
  }

  reset() {
    this.pause();
    this.simulator.reset();
  }
}
```

## Data Flow

### User Interaction Flow

```
[User Action: Click "Step"]
    ↓
[UI Controller] → [CPU Simulator.step()] → [Update State]
    ↓                                            ↓
[Notify Observers] ← ← ← ← ← ← ← ← ← ← ← ← ← ← ┘
    ↓
[Visualizers receive state]
    ↓
[Canvas rendering: draw pipeline, registers, memory]
    ↓
[User sees updated visualization]
```

### Documentation Learning Flow

```
[Landing Page: docs/cpu/index.html]
    ↓
[Choose learning path: Beginner starts at pipeline-basics.html]
    ↓
[Read concept explanation + view static diagrams]
    ↓
[Click "Try Interactive Demo" link → cpu-demo.html with pre-loaded example]
    ↓
[Experiment with controls, observe behavior]
    ↓
[Return to docs, continue to next page: alu-operations.html]
    ↓
[Repeat: concept → demo → practice]
```

### Simulation Execution Flow

```
[Load Program into Memory]
    ↓
[Fetch Stage: Read instruction at PC]
    ↓
[Decode Stage: Parse opcode, registers]
    ↓
[Execute Stage: ALU operation or address calculation]
    ↓
[Memory Stage: Load/store if needed]
    ↓
[Writeback Stage: Update destination register]
    ↓
[Increment PC (or branch)] → [Back to Fetch]
```

### Key Data Flows

1. **Control Flow:** User clicks control buttons → SimulatorController → CPUSimulator state changes → Observers notified → Visualizers re-render
2. **Visualization Flow:** State object (immutable snapshot) → Multiple visualizers (pipeline, registers, memory) → Canvas 2D API rendering
3. **Navigation Flow:** User navigates docs via breadcrumbs/sidebar → New page loads → Breadcrumb shows current position in learning path

## Integration with Existing Portfolio

### Integration Points

| Existing Component | CPU Integration | Notes |
|-------------------|-----------------|-------|
| index.html (Portfolio landing) | Add CPU project card in "Featured Projects" section | Similar to graphics engine card, links to cpu-demo.html and docs/cpu/index.html |
| docs/assets/css/design-system.css | Reuse as-is for CPU docs | Maintains visual consistency (green gradient, typography) |
| docs/assets/css/nav.css | Reuse as-is | Top navigation works site-wide |
| docs/assets/css/breadcrumbs.css | Reuse as-is | Breadcrumbs show: Home › CPU Simulator › [Current Page] |
| docs/assets/css/docs.css | Reuse as-is | Documentation page layout consistent with graphics docs |

### Navigation Structure

```
Site Navigation (top nav):
  - Home (index.html)
  - Projects dropdown:
    - Graphics Engine → docs/index.html
    - CPU Simulator → docs/cpu/index.html
  - About
  - GitHub

Breadcrumb examples:
  - Home › CPU Simulator › Pipeline Basics
  - Home › CPU Simulator › Interactive Demo
  - Home › CPU Simulator › ALU Operations
```

### Design Consistency

**Maintain existing design system:**
- Primary gradient: `#2E7D32` to `#1B5E20` (green)
- Text color: `#2c3e50`
- Card shadows, border radius (12px), spacing
- Hover transitions, button styles

**CPU-specific additions:**
- Canvas background: Light gray (`#f0f0f0`) to distinguish from controls
- Stage highlighting: Use green accent for active pipeline stage
- Data flow arrows: Animated or colored to show movement
- Register highlighting: Different colors for read (blue) vs write (green)

## Suggested Build Order (Dependencies)

### Phase 1: Foundation
**Order:** Core simulation engine → Basic visualization → Demo page skeleton

**Why:** Need working CPU model before any visualization makes sense

**Components:**
1. `cpu-simulator.js`: State machine, 5-stage pipeline, basic instruction set (ADD, SUB, LOAD, STORE)
2. `cpu-visualizer.js`: Basic pipeline renderer (boxes with stage names)
3. `cpu-demo.html`: Page structure, canvas, step/reset controls

**Validation:** Can step through simple program (3-4 instructions), see pipeline advance

---

### Phase 2: Documentation Foundation
**Order:** Landing page → First doc page (pipeline-basics) → Navigation integration

**Why:** Establishes learning path structure, ensures design consistency

**Components:**
1. `docs/cpu/index.html`: Landing with overview, links to doc pages
2. `docs/cpu/pipeline-basics.html`: First educational page
3. Update breadcrumbs, navigation to include CPU section

**Validation:** Navigation flows work, design matches graphics docs

---

### Phase 3: Enhanced Visualization
**Order:** Register file visualizer → Memory visualizer → Data flow indicators

**Why:** Builds on working pipeline, adds detail progressively

**Components:**
1. `RegisterFileVisualizer`: Show 32 registers, highlight active
2. `MemoryVisualizer`: Show instruction/data memory
3. Data flow arrows between components

**Validation:** Can see register reads/writes, memory accesses during execution

---

### Phase 4: Complete Instruction Set
**Order:** Expand ALU operations → Branch instructions → Documentation pages

**Why:** Now that visualization is solid, add full functionality

**Components:**
1. Complete ALU: AND, OR, XOR, shift operations
2. Branch handling: JMP, BEQ, BNE, conditional branches
3. `docs/cpu/alu-operations.html`
4. `docs/cpu/instruction-set.html`

**Validation:** Can run programs with loops, conditionals

---

### Phase 5: Advanced Features
**Order:** Hazard detection → Forwarding visualization → Advanced docs

**Why:** Most complex concepts, requires all previous work

**Components:**
1. Data hazard detection in simulator
2. Forwarding paths in visualization
3. `docs/cpu/hazards-forwarding.html`
4. `docs/cpu/advanced-topics.html`

**Validation:** Correctly handles hazards, visualization shows forwarding paths

---

### Phase 6: Polish & Integration
**Order:** Code examples → Demo presets → Portfolio integration

**Why:** User experience enhancements after functionality complete

**Components:**
1. Pre-loaded demo programs (factorial, Fibonacci, etc.)
2. Assembly code editor in demo (optional)
3. Update `index.html` with CPU project card
4. Add GitHub link to CPU repository

**Validation:** Complete user journey from portfolio → demo → docs

---

## Anti-Patterns to Avoid

### Anti-Pattern 1: Monolithic Simulation + Visualization

**What people do:** Combine CPU simulation logic and canvas rendering in one giant function

**Why it's wrong:**
- Can't test simulation without DOM
- Can't reuse simulation in different contexts
- Hard to debug ("is bug in logic or rendering?")

**Do this instead:** Separate concerns with clear interfaces:
```javascript
// GOOD: Separate simulation from visualization
const simulator = new CPUSimulator();
const visualizer = new CPUVisualizer(canvas);
simulator.subscribe(visualizer);

simulator.step(); // Logic happens here
// Visualizer automatically updates via observer pattern
```

### Anti-Pattern 2: Documentation as Code Comments

**What people do:** Write detailed explanations as code comments in simulator, expect users to read source

**Why it's wrong:**
- Source code is intimidating for beginners
- Can't include diagrams, progressive examples
- No narrative flow or learning path

**Do this instead:**
- Dedicated documentation pages with clear progression
- Link from docs to specific demo states (e.g., "Try hazard example")
- Keep code clean, docs educational

### Anti-Pattern 3: All-or-Nothing Complexity

**What people do:** Build full 5-stage pipeline with hazards, forwarding, branch prediction all at once

**Why it's wrong:**
- Overwhelming for learners
- Hard to debug (which part is broken?)
- Can't demonstrate concepts in isolation

**Do this instead:**
- Start with single-cycle CPU (docs/cpu/pipeline-basics.html)
- Add pipelining without hazards (demonstrate speedup)
- Then add hazards one at a time (data, control)
- Progressive disclosure matches build order

### Anti-Pattern 4: Pixel-Perfect Hardware Realism

**What people do:** Try to exactly replicate MIPS or ARM architecture with all edge cases

**Why it's wrong:**
- Educational goal is understanding, not certification
- Real architectures have complexity that obscures core concepts
- Maintenance burden for complete accuracy

**Do this instead:**
- Simplified but representative architecture
- 32 registers, basic instruction set, clear pipeline stages
- Note in docs: "This is a teaching model, not exact hardware"
- Focus on core concepts (pipelining, hazards) not quirks

## Scalability Considerations

| Concern | Portfolio Site (Current) | After CPU Addition | Future Growth |
|---------|--------------------------|-------------------|---------------|
| **File organization** | Flat structure (3 projects) | Organized docs/cpu/ subfolder | Can add docs/os/, docs/compiler/ |
| **Asset loading** | All CSS/JS loaded per page | Shared design system reused | Consider CDN if assets grow large |
| **Navigation complexity** | Simple top nav | Add dropdown for projects | May need sidebar nav if 5+ projects |
| **Build process** | None (static HTML) | Still static, no build needed | Could add build step if adding TypeScript/modules |

### Scaling Priorities

1. **First concern (likely at 3-4 projects):** Navigation dropdown becomes cluttered
   - **Solution:** Organize by category (Systems Projects, Graphics, etc.)

2. **Second concern (unlikely soon):** Asset duplication across projects
   - **Solution:** Centralize shared assets in docs/assets/, use relative imports

---

## Sources

**Educational CPU Simulator Architecture:**
- [CPU-OS Simulator – CPU, OS Simulation for Computer Education](https://teach-sim.com/)
- [Online Educational CPU Visual Simulator - CPUVSIM](https://www.merlot.org/merlot/viewMaterial.htm?id=773407108)
- [CADSS: Computer Architecture Design Simulator for Students](https://dl.acm.org/doi/fullHtml/10.1145/3605507.3610626)
- [GitHub - Belotti01/CPU-Visual-Simulator: Educational CPU Visual Simulator](https://github.com/Belotti01/CPU-Visual-Simulator)

**Pipeline Visualization Best Practices:**
- [Visualizing CPU Pipelining | Tim Mastny](https://timmastny.com/blog/visualizing-cpu-pipelining/)
- [CPU Pipeline Simulator: Visualize Hazards, Cache Latency & Assembly Code Execution](https://yomotherboard.com/interactive-cpu-architecture-simulator/)
- [The PSE CPU Execution Visualization Tool](https://www.ece.lsu.edu/koppel/pse/)
- [gem5: Visualization](https://www.gem5.org/documentation/general_docs/cpu_models/visualization/)

**Progressive Learning in Educational Simulators:**
- [Simulation-based training in professional education: learning, participation, and instructional design | Instructional Science](https://link.springer.com/article/10.1007/s11251-025-09763-2)
- [The Progressive Learning Platform for Computer Engineering](https://www.researchgate.net/publication/344528489_The_Progressive_Learning_Platform_for_Computer_Engineering)

**Technical Documentation Structure:**
- [Technical Documentation: What It Is and How to Do It Well](https://draft.dev/learn/technical-documentation-what-it-is-and-how-to-do-it-well)
- [Creating effective technical documentation | MDN Blog](https://developer.mozilla.org/en-US/blog/technical-writing/)

**State Machine Architecture:**
- [Stately (XState)](https://stately.ai/)
- [Modern Embedded Software and Tools - Quantum Leaps](https://www.state-machine.com/)
- [Interactive 3D Visualization and Simulation with State Machines](https://blogs.itemis.com/en/interactive-3d-visualization-and-simulation-with-state-machines)

**Interactive Educational Tool Architecture:**
- [EdTech Platform Stack: Key Technologies for Modern Learning](https://chisw.com/blog/modern-edtech-platform-stack/)
- [Platform Debugger Architecture Redesign for Remote Development in 2026.1 | The JetBrains Platform Blog](https://blog.jetbrains.com/platform/2026/01/platform-debugger-architecture-redesign-for-remote-development-in-2026-1/)

---
*Architecture research for: CPU Simulator Educational Visualization*
*Researched: 2026-02-11*
