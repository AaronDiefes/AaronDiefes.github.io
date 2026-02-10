# Roadmap - WebAssembly Graphics Engine Portfolio

## Overview

This roadmap transforms an existing C++ graphics engine into an interactive browser-based portfolio. The phases progress from foundational compilation infrastructure through interactive features to polished documentation, with each phase delivering a testable, verifiable capability. All 7 phases derive from the natural boundaries in the requirements, ensuring complete coverage of the v1 scope.

## Phase Structure

| Phase | Goal | Requirements | Duration Est. |
|-------|------|--------------|---------------|
| 1 - Build Foundation | WASM compilation pipeline established | WASM-01, WASM-02, WASM-03 | Foundation |
| 2 - JavaScript Bridge | JS can control engine operations | BRIDGE-01, BRIDGE-02, BRIDGE-03, BRIDGE-04 | Core |
| 3 - Canvas Integration | Engine renders to browser canvas | CANVAS-01, CANVAS-02, CANVAS-03 | Core |
| 4 - Interactive Controls | Users manipulate rendering in real-time | UI-01, UI-02, UI-03, UI-04 | Features |
| 5 - Code Examples | Source code visible alongside demos | CODE-01, CODE-02, CODE-03 | Features |
| 6 - Documentation System | Engine capabilities fully documented | DOC-01, DOC-02, DOC-03, DOC-04 | Enhancement |
| 7 - Testing & Optimization | Performance validated and verified | PERF-01, PERF-02, PERF-03, TEST-01, TEST-02, TEST-03 | Polish |
| 8 - Visual Polish | Professional aesthetic refinement | DESIGN-01, DESIGN-02, DESIGN-03, DESIGN-04 | Final Polish |

---

## Phase 1: Build Foundation

**Goal:** Compilation pipeline produces working WASM module from C++ engine.

**Dependencies:** None (foundation phase)

**Requirements:**
- WASM-01: Emscripten Build Configuration
- WASM-02: Module Interface Definitions
- WASM-03: Memory Management

**Success Criteria:**
1. Makefile produces .wasm and .js files from graphics-engine/ source code
2. Emscripten successfully compiles all C++ sources without modification or with minimal bridge code
3. WASM module loads in browser console without errors
4. Basic canvas creation function callable from browser DevTools
5. Pixel buffer can be allocated and read from JavaScript

**Technical Notes:**
- Install Emscripten SDK and configure environment
- Create separate emscripten.mk or modify existing Makefile with WASM target
- Use EMSCRIPTEN_BINDINGS to export GCreateCanvas and basic operations
- Configure ALLOW_MEMORY_GROWTH for dynamic canvas sizes
- Export malloc/free or use embind memory management
- Resolve any lodepng or platform-specific dependencies

**Blockers:**
- C++ code that relies on file I/O (lodepng) may need stubs or browser alternatives
- Platform-specific code in GTime.cpp may need conditional compilation

---

## Phase 2: JavaScript Bridge

**Goal:** JavaScript code has full API access to engine operations.

**Dependencies:** Phase 1 (requires compiled WASM module)

**Requirements:**
- BRIDGE-01: Canvas Creation API
- BRIDGE-02: Drawing Function Bindings
- BRIDGE-03: Transformation Functions
- BRIDGE-04: Shader Bindings

**Success Criteria:**
1. JavaScript can create canvas with specified dimensions and access underlying bitmap
2. All drawing operations (clear, drawRect, drawConvexPolygon, drawPath) callable from JS
3. Matrix transformations (translate, rotate, scale, save/restore CTM) work correctly
4. Shaders can be created and applied to paint objects from JavaScript
5. Demo script successfully draws test pattern using all bound functions

**Technical Notes:**
- Create comprehensive EMSCRIPTEN_BINDINGS block covering:
  - GCanvas methods (clear, drawRect, drawConvexPolygon, drawPath, drawMesh, drawQuad)
  - Matrix operations (save, restore, concat, translate, rotate, scale)
  - Paint configuration (setColor, setBlendMode, setShader)
  - Shader creation (GCreateBitmapShader, GCreateLinearGradient)
  - Color and geometry types (GColor, GRect, GPoint, GPath)
- Handle pointer marshaling for arrays (points[], colors[], indices[])
- Create JavaScript wrapper classes for ergonomic API

**Blockers:**
- GPath API may need special binding approach for chaining operations
- Shader lifetime management between JS and C++ ownership

---

## Phase 3: Canvas Integration

**Goal:** Engine output renders visibly in HTML5 Canvas element.

**Dependencies:** Phase 2 (requires JS API bindings)

**Requirements:**
- CANVAS-01: Pixel Buffer Transfer
- CANVAS-02: Coordinate System Mapping
- CANVAS-03: Real-time Rendering

**Success Criteria:**
1. Engine pixel buffer transfers to HTML5 Canvas ImageData correctly
2. Rendered shapes appear at correct positions matching engine coordinates
3. Multiple draw calls composite correctly in visible output
4. Canvas updates complete in under 33ms (30 FPS) for typical operations
5. Color values match expected output (no RGBA/BGRA confusion)

**Technical Notes:**
- Create JavaScript render loop:
  - Get pixel pointer from WASM heap
  - Create ImageData from WASM memory view
  - Use ctx.putImageData() to transfer to canvas
- Handle pixel format differences (GPixel ARGB vs ImageData RGBA)
- Implement requestAnimationFrame loop for smooth updates
- Verify coordinate system matches (top-left origin, Y-down)
- Consider double-buffering if flicker occurs

**Blockers:**
- Pixel format conversion overhead may impact performance
- Large canvases (>1000x1000) may have slow transfer times

---

## Phase 4: Interactive Controls

**Goal:** Users manipulate rendering parameters through UI controls.

**Dependencies:** Phase 3 (requires visible canvas rendering)

**Requirements:**
- UI-01: Demo Preset Selector
- UI-02: Parameter Controls
- UI-03: Visual Feedback
- UI-04: Responsive Layout

**Success Criteria:**
1. Demo selector switches between preset scenes (shapes, gradients, transformations, blend modes, paths)
2. Parameter controls (sliders, color pickers, dropdowns) modify engine state in real-time
3. Canvas updates immediately upon control changes without lag
4. Layout matches graphics-demo.html design (sidebar controls, main canvas)
5. All engine capabilities accessible through at least one demo preset

**Technical Notes:**
- Port graphics-demo.html layout and styling to WASM-integrated page
- Create demo presets showcasing:
  - Basic shapes (rectangles, circles, polygons)
  - Matrix transformations (translate, rotate, scale)
  - Shaders (solid colors, bitmap textures, linear gradients, radial gradients)
  - Blend modes (all supported modes from GBlendMode)
  - Path rendering (curves, fills, strokes)
  - Mesh rendering (triangulated quads)
- Wire event listeners to call WASM functions
- Implement clear/redraw pattern for control changes
- Add preset JSON or inline definitions

**Blockers:**
- Performance of full redraws on every control change
- Complexity of preset definitions if too many parameters

---

## Phase 5: Code Examples

**Goal:** Source code visible alongside running demos.

**Dependencies:** Phase 4 (requires working interactive demos)

**Requirements:**
- CODE-01: Syntax-Highlighted Examples
- CODE-02: Code-to-Visual Mapping
- CODE-03: Multiple Code Views

**Success Criteria:**
1. Each demo displays relevant C++ implementation with syntax highlighting
2. Code view shows actual source from my_canvas.cpp, shader_ops.h, etc.
3. Multiple code tabs available (organized by PA progression)
4. Code examples exactly correspond to what's executing in the canvas
5. Syntax highlighting makes code readable and professional

**Technical Notes:**
- Integrate Prism.js with VS Code Dark+ theme
- Documentation organized by programming assignment progression:
  - PA1+PA2: Core Rendering (shapes, blending, clipping)
  - PA3: Transformations & Textures (matrices, bitmap shader)
  - PA4: Paths & Gradients (GPath, winding fill, gradients)
  - PA5+PA6: Advanced Geometry (curves, meshes, shader composition)
  - Final: Final Features (sweep gradient, color matrix, strokes, Coons)
- Landing page includes architecture overview (WASM, pipeline diagram)
- Each documentation page: explanation + code + embedded demo

**Blockers:**
- Keeping code snippets in sync with actual implementation
- Code length vs UI space constraints

**Plans:** 6 plans (1 rejected by user)
Plans:
- [x] 05-01-PLAN.md - Foundation assets (CSS, JS for tabs and code styling)
- [x] 05-02-PLAN.md - Core Rendering (PA1+PA2) documentation page
- [x] 05-03-PLAN.md - Transformations & Textures (PA3) documentation page
- [x] 05-04-PLAN.md - Paths & Gradients (PA4) documentation page
- [x] 05-05-PLAN.md - Advanced Geometry (PA5+PA6) documentation page
- [x] 05-06-PLAN.md - Final Features documentation page
- [x] ~~05-07-PLAN.md - Landing page~~ **REJECTED** - See 05-07-REJECTED.md

---

## Phase 6: Documentation System

**Goal:** Comprehensive documentation explains engine architecture and capabilities.

**Dependencies:** Phase 5 (benefits from code examples being complete)

**Requirements:**
- DOC-01: Architecture Overview
- DOC-02: API Reference
- DOC-03: Implementation Details
- DOC-04: Capability Showcase

**Success Criteria:**
1. Architecture page explains canvas abstraction, shader system, blend pipeline, path rendering
2. API reference documents all exported functions with parameters and examples
3. Implementation details explain edge-list rasterization, scanline rendering, matrix math
4. Capability catalog lists all features with descriptions and links to demos
5. Documentation accessible from main portfolio navigation

**Technical Notes:**
- Create documentation pages:
  - /docs/architecture.html - system overview with Mermaid diagrams
  - /docs/api-reference.html - function signatures and usage
  - /docs/implementation.html - algorithm explanations
  - /docs/capabilities.html - feature catalog
- Extract API documentation from header files (GCanvas.h, GShader.h, etc.)
- Create architecture diagrams with Mermaid:
  - Canvas -> Paint -> Shader -> Blender -> Pixels pipeline
  - Transformation matrix stack
  - Edge list construction and rasterization
- Link documentation to corresponding demos
- Style consistently with portfolio design (forest green theme)

**Blockers:**
- None identified (research complete)

**Plans:** 1 plan (3 rejected by user)
Plans:
- [x] ~~06-01-PLAN.md - Architecture Overview~~ **REJECTED** - See 06-01-REJECTED.md
- [x] ~~06-02-PLAN.md - API Reference~~ **REJECTED** - See 06-02-REJECTED.md
- [x] ~~06-03-PLAN.md - Implementation Details~~ **REJECTED** - See 06-03-REJECTED.md
- [ ] 06-04-PLAN.md - Capability Showcase page with feature catalog + navigation integration

**Note:** Plans 06-01 through 06-03 were never deployed to the live site and user confirmed these pages should NOT be added. The live site has 7 documentation pages total, which is the desired structure.

---

## Phase 7: Testing & Optimization

**Goal:** Portfolio validated for correctness, performance, and compatibility.

**Dependencies:** Phase 6 (complete feature set required for testing)

**Requirements:**
- PERF-01: Load Time
- PERF-02: Frame Rate
- PERF-03: Memory Efficiency
- TEST-01: Visual Regression Tests
- TEST-02: Cross-Browser Verification
- TEST-03: Functionality Validation

**Success Criteria:**
1. WASM bundle size under 5MB, page loads in under 5 seconds on broadband
2. All interactive demos maintain 30+ FPS during parameter manipulation
3. Memory usage stays under 100MB for typical demo canvases, no leaks after repeated operations
4. Visual regression tests pass (WASM output matches expected/ reference images)
5. Portfolio works correctly in Chrome, Firefox, and Safari latest versions
6. All exported functions validated with automated tests

**Technical Notes:**
- Optimize WASM build:
  - Use -O3 optimization flag
  - Enable -s WASM=1 for pure WASM output
  - Measure and reduce bundle size (strip debug symbols if needed)
- Performance profiling:
  - Use browser DevTools Performance tab
  - Measure frame times for each demo
  - Identify bottlenecks (transfer vs rendering)
- Visual regression:
  - Compare against graphics-engine/expected/*.png
  - Use pixel-by-pixel diff or perceptual diff
  - Automate with test script
- Cross-browser testing:
  - Test locally on all three browsers
  - Verify WebAssembly support detection
  - Handle any browser-specific issues
- Functionality tests:
  - Create test suite calling each binding
  - Verify return values and state changes
  - Test edge cases (zero dimensions, null pointers, etc.)

**Blockers:**
- Older Safari versions may have WASM quirks
- Optimization may require code changes impacting earlier phases

---

## Phase 8: Visual Polish

**Goal:** Professional aesthetic refinement across all portfolio pages.

**Dependencies:** Phase 7 (complete feature set tested and optimized)

**Requirements:**
- DESIGN-01: Typography & Spacing Refinement
- DESIGN-02: Animation & Transitions
- DESIGN-03: Visual Hierarchy & Layout
- DESIGN-04: Responsive Design Polish

**Success Criteria:**
1. Typography is consistent, readable, and professionally styled across all pages
2. Smooth transitions and animations enhance user experience without distraction
3. Visual hierarchy guides users naturally through content
4. Layout adapts elegantly to all screen sizes (mobile, tablet, desktop)
5. Color scheme is cohesive and professional throughout portfolio

**Technical Notes:**
- Typography refinement:
  - Font pairing (headings vs body)
  - Line height and letter spacing optimization
  - Responsive font scaling
  - Code font improvements
- Animation & transitions:
  - Page load animations
  - Hover states and micro-interactions
  - Smooth scrolling
  - Tab transitions
  - Demo state changes
- Visual hierarchy:
  - White space optimization
  - Section separation and flow
  - Call-to-action prominence
  - Content grouping
- Layout polish:
  - Grid alignment refinement
  - Card design consistency
  - Navigation UX improvements
  - Footer and header balance
- Color scheme:
  - Consistent application of forest green palette
  - Contrast ratio validation (WCAG AA)
  - Accent color usage
  - Background and surface colors

**Blockers:**
- May require design tools for mockups
- Animation performance on lower-end devices
- Balance between visual flair and professional simplicity

---

## Progress Tracking

| Phase | Status | Completion |
|-------|--------|------------|
| 1 - Build Foundation | Complete | 100% |
| 2 - JavaScript Bridge | Complete | 100% |
| 3 - Canvas Integration | Complete | 100% |
| 4 - Interactive Controls | Complete | 100% |
| 5 - Code Examples | Complete | 100% (6/7 plans, 1 rejected) |
| 6 - Documentation System | Incomplete | 0% (3/4 plans rejected, 1 remaining) |
| 7 - Testing & Optimization | Skipped | N/A |
| 8 - Visual Polish | Ready to Plan | 0% |

**Overall Progress:** 63% (5/8 phases complete)

**Note:** Phase 7 (Testing & Optimization) was completed locally but never deployed. Skipping to Phase 8 (Visual Polish) based on user request to work with live site code.

---

## Next Steps

1. ~~Review and approve this roadmap~~
2. ~~Phase 1: Install Emscripten and create WASM build configuration~~
3. ~~Phase 2: Expose JavaScript API bindings~~
4. ~~Phase 3: Integrate with HTML5 Canvas~~
5. ~~Phase 4: Add interactive parameter controls~~
6. ~~Plan Phase 5 - Code Examples (7 plans created)~~
7. ~~Execute Phase 5 - Code Examples~~
8. ~~Plan Phase 6 - Documentation System (4 plans created)~~
9. **Next:** Execute Phase 6 - Documentation System

## Requirement Coverage

All v1 requirements mapped to phases (Phase 8 requirements to be added in REQUIREMENTS.md):

**Phase 1:** WASM-01, WASM-02, WASM-03 (3 requirements)
**Phase 2:** BRIDGE-01, BRIDGE-02, BRIDGE-03, BRIDGE-04 (4 requirements)
**Phase 3:** CANVAS-01, CANVAS-02, CANVAS-03 (3 requirements)
**Phase 4:** UI-01, UI-02, UI-03, UI-04 (4 requirements)
**Phase 5:** CODE-01, CODE-02, CODE-03 (3 requirements)
**Phase 6:** DOC-01, DOC-02, DOC-03, DOC-04 (4 requirements)
**Phase 7:** PERF-01, PERF-02, PERF-03, TEST-01, TEST-02, TEST-03 (6 requirements)
**Phase 8:** DESIGN-01, DESIGN-02, DESIGN-03, DESIGN-04 (4 requirements - TBD)

**Total:** 27 v1 requirements + 4 v2 requirements = 31 requirements mapped

## Out of Scope (v2+)

- Mobile device optimization
- Touch gesture controls
- Downloadable WASM library package
- Advanced shader editor (user-created shaders)
- 3D graphics capabilities
- Animation timeline/keyframe editor
- Performance profiling tools in UI
- WebGL acceleration
