# Technology Stack

**Project:** CPU Simulator Visualization
**Researched:** 2026-02-11
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Vanilla JavaScript (ES2024+) | ES2024 | Core simulation logic, state management | No framework overhead, perfect for static GitHub Pages hosting, matches existing portfolio pattern (graphics-demo.html uses pure JS), enables sub-100ms interactivity requirement |
| HTML5 Canvas API | Native | CPU pipeline stage visualization | Superior performance for complex animations vs SVG (canvas handles thousands of elements without DOM overhead), matches existing graphics-demo.html pattern, hardware-accelerated rendering |
| SVG | Native | Interactive UI controls, register/memory displays | Excellent for static elements that need hover/click interaction, crisp rendering at any zoom level, DOM access enables easy event handling |
| Vite | 7.3.1 | Build tool & dev server | Fast HMR during development, optimized production builds via Rollup, zero config for vanilla JS projects, official guide for static site deployment to GitHub Pages |

### Visualization & UI Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| D3.js | 7.9.0 | Data-driven DOM manipulation for register/memory views | Use for binding CPU state to visual elements (registers, memory cells), NOT for full visualization (too heavy for this use case), excellent for scales/axes if adding performance graphs |
| Prism.js | 1.29.0 | Assembly code syntax highlighting | Lightweight (2KB core + 300-500 bytes per language), superior accuracy vs Highlight.js, use for displaying assembly instructions with color-coded syntax |

### State Management & Data

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Immer.js | 11.1.4 | Immutable state updates for step-through | Simplifies creating snapshots for forward/backward stepping, zero dependencies, allows mutating a draft to produce next immutable state (critical for undo/redo), use for CPU state transitions |
| localStorage API | Native | Persist program/state between sessions | Store user's assembly programs, last simulator state, UI preferences, 5-10MB limit sufficient for assembly programs |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Vite Dev Server | Local development with instant HMR | Serves files over HTTP (required for ES modules), auto-refresh on changes |
| ESLint | Code quality | Use Airbnb config or Standard.js for consistency |
| Prettier | Code formatting | Auto-format on save |

## Installation

```bash
# Initialize project
npm init -y

# Core build tool
npm install -D vite@7.3.1

# Visualization libraries
npm install d3@7.9.0 prismjs@1.29.0

# State management
npm install immer@11.1.4

# Dev tools
npm install -D eslint prettier
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Vanilla JS + Vite | React + Vite | Only if building multi-route SPA or need component reusability across many views. CPU simulator is single-page with minimal UI components, framework overhead not justified |
| HTML5 Canvas | D3.js full SVG approach | If interactivity on EVERY pipeline element is critical (e.g., click each transistor). Canvas is better for our animated pipeline stages |
| Prism.js | Monaco Editor (0.55.1) | If building full IDE with autocomplete/IntelliSense. Monaco is 5-10MB vs Prism's 2KB—overkill for read-only syntax highlighting |
| Immer.js | Custom immutable patterns | If bundle size is absolutely critical (Immer adds ~14KB). For educational project, Immer's clarity worth the bytes |
| HTML5 Canvas | SVG only | If no animations needed and all elements need hover tooltips. SVG struggles with 60fps animations of many elements |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Monaco Editor | 5-10MB bundle, no mobile support, designed for VS Code-level features | Prism.js (2KB) for syntax highlighting OR CodeMirror 6 (~300KB) if users need to edit code |
| Angular/Vue framework | Adds 100KB+ for minimal benefit on single-page static visualization | Vanilla JS with Vite build tooling |
| Highlight.js | 9% slower than Prism, 30% larger output HTML, less accurate syntax highlighting | Prism.js (faster, smaller, more accurate) |
| jQuery | Obsolete in 2025, modern DOM APIs (querySelector, fetch) are native | Native browser APIs (document.querySelector, etc.) |
| WebGL/Three.js | GPU-accelerated 3D library—massive overkill for 2D pipeline diagrams | HTML5 Canvas 2D context |
| Redux/MobX | State management libraries designed for complex apps with many components | Immer.js + vanilla JS state object pattern |

## Stack Patterns by Variant

**If user needs to EDIT assembly code:**
- Add CodeMirror 6 (~300KB, mobile-friendly, modular architecture)
- Avoid Monaco (no mobile support, 5-10MB)
- CodeMirror integrates well with vanilla JS, provides basic autocomplete

**If visualization needs 10,000+ animated elements:**
- Stick with Canvas for pipeline stages
- Consider WebGL via D3-force for extreme performance (but adds complexity)
- Current recommendation handles 100s of elements at 60fps

**If targeting mobile heavily:**
- CodeMirror 6 has excellent mobile support
- Canvas touch events well-supported
- Avoid Monaco (no official mobile browser support)

**If adding performance graphs (CPI, throughput):**
- Use D3.js scales + Canvas rendering (not D3's SVG output)
- D3 for math/data binding, Canvas for rendering
- See approach in https://blog.scottlogic.com/2020/05/01/rendering-one-million-points-with-d3.html

## Version Compatibility

| Package | Compatible With | Notes |
|---------|-----------------|-------|
| Vite 7.3.1 | Node 18+ | Uses native ESM, requires modern Node |
| D3 7.9.0 | ES2015+ browsers | No IE11 support (fine for 2025) |
| Immer 11.1.4 | ES2015+ with Proxy support | Requires modern browsers, no polyfill needed for 2025 |
| Prism 1.29.0 | Any browser | Zero dependencies, works everywhere |

## Integration with Existing Portfolio

**Design System Match:**
- Existing portfolio uses forest green gradient (`#2E7D32` to `#1B5E20`)
- Graphics-demo.html already uses pure JS + Canvas pattern
- CPU simulator should follow same architecture: single HTML file, inline styles or shared CSS, no build step for end user

**Deployment Pattern:**
- Graphics-demo.html serves as template for structure
- Build with Vite, output static files to `cpu-demo/` directory
- GitHub Pages serves everything as static assets
- No backend/API calls needed

**File Structure Consistency:**
```
cpu-simulator.html          # Main page (matches graphics-demo.html pattern)
cpu-simulator/
  ├── assets/
  │   ├── js/
  │   │   ├── simulator.js    # Core CPU logic
  │   │   ├── state.js        # Immer-based state management
  │   │   ├── renderer.js     # Canvas rendering
  │   │   └── ui-controls.js  # Event handlers
  │   └── css/
  │       └── cpu-demo.css
  └── programs/
      ├── fibonacci.asm
      └── basic.asm
```

## Performance Targets

| Metric | Target | How Stack Achieves It |
|--------|--------|----------------------|
| Initial load | < 500KB total | Prism (2KB) + D3 (70KB gzipped) + Immer (14KB) + custom code (~50KB) = ~150KB |
| Step forward/back | < 50ms | Immer creates snapshots efficiently, Canvas redraws in < 16ms (60fps) |
| Animation frame rate | 60fps | Canvas 2D with hardware acceleration, requestAnimationFrame |
| First contentful paint | < 1s | Vite production build optimizes bundle splitting, no framework bootstrap delay |

## Sources

**HIGH CONFIDENCE (verified with official docs):**
- Vite 7.3.1: https://vite.dev/guide/ (official docs, verified current version)
- D3 7.9.0: https://d3js.org/ (official site, verified features and version)
- Canvas vs SVG performance: https://blog.openreplay.com/svg-vs-canvas--a-comparison/ + https://frontendmasters.com/courses/d3/svg-vs-html5-canvas/
- Immer 11.1.4: https://immerjs.github.io/immer/ + https://github.com/immerjs/immer/releases
- localStorage API: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage

**MEDIUM CONFIDENCE (multiple web sources, 2025/2026 dated):**
- CodeMirror 6 vs Monaco comparison: https://agenthicks.com/research/codemirror-vs-monaco-editor-comparison + https://sourcegraph.com/blog/migrating-monaco-codemirror
- Prism vs Highlight.js: https://github.com/highlightjs/highlight.js/issues/3625 + https://www.peterbe.com/plog/benchmark-compare-highlight.js-vs-prism
- Vanilla JS state management patterns 2025: https://medium.com/@chirag.dave/state-management-in-vanilla-js-2026-trends-f9baed7599de

**MEDIUM CONFIDENCE (existing portfolio evidence):**
- Graphics-demo.html uses vanilla JS + Canvas pattern (verified by reading /Users/orases/Aaron/website/graphics-demo.html)
- Forest green color scheme `#2E7D32` to `#1B5E20` (from graphics-demo.html line 19)

---
*Stack research for: CPU Simulator Visualization*
*Researched: 2026-02-11*
*Overall confidence: HIGH - Core technologies verified with official docs, alternatives researched across multiple sources*
