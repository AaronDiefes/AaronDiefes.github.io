# WebAssembly Graphics Engine Portfolio

## Vision

Transform the portfolio website to showcase the actual C++ 2D graphics engine running natively in the browser via WebAssembly. Replace the current JavaScript recreation with the real engine, providing an interactive interface where users can explore and execute the actual C++ functions with comprehensive documentation of capabilities.

## Problem Statement

Currently, the graphics engine:
- Only runs via command-line with arguments
- Requires C++ compilation environment to test
- Is recreated in JavaScript (graphics-demo.html) rather than using the actual implementation
- Lacks accessible documentation of its capabilities for non-technical visitors

This limits the engine's discoverability and makes it difficult for potential employers/collaborators to understand the technical depth of the implementation.

## Goals

### Primary Objectives
1. **Compile C++ engine to WebAssembly** - Make the actual graphics engine run in the browser with native performance
2. **Interactive function interface** - Allow users to call real C++ functions and see visual results in real-time
3. **Comprehensive documentation** - Explain engine capabilities both in code comments and on the website
4. **Replace command-line workflow** - Provide web UI for all functionality currently requiring terminal arguments

### Success Criteria
- [ ] C++ graphics engine compiled to WASM and running in browser
- [ ] All core features accessible via web interface:
  - Shape drawing (rectangles, circles, polygons, paths)
  - Transformations (translate, rotate, scale via matrices)
  - Shaders and gradients (linear, Coons patches, texture mapping)
  - Blend modes and compositing operations
  - Any additional custom implementations
- [ ] Triple interaction model:
  - Visual controls (sliders, buttons, color pickers)
  - Code examples (copy-paste snippets showing C++ API usage)
  - Preset demos (curated showcases with customizable parameters)
- [ ] Documentation visible on site explaining each capability
- [ ] Performance matches or exceeds native compilation
- [ ] Existing portfolio pages (index.html, admin.html) remain functional

## Technical Approach

### Core Architecture
- **Emscripten compilation** - Compile graphics-engine/ to WebAssembly module
- **JavaScript bridge** - Expose C++ functions to JavaScript via Emscripten bindings
- **Canvas rendering** - WASM writes to HTML5 Canvas or ImageData buffer
- **Bidirectional API** - JS calls C++ functions, C++ renders to web canvas

### Key Components
1. **WASM Module** - Compiled graphics engine with exported functions
2. **Interactive Demo Page** - Enhanced graphics-demo.html calling real C++ code
3. **Documentation System** - Inline code comments + website explanations
4. **Code Example Gallery** - Showcases of engine capabilities with source
5. **Parameter Controls** - UI for adjusting function parameters in real-time

### Technology Stack
- **Emscripten** - C++ to WebAssembly compiler toolchain
- **WebAssembly (WASM)** - Runtime for C++ engine in browser
- **JavaScript ES6+** - Bridge layer and UI controls
- **HTML5 Canvas** - Rendering target for graphics output
- **Existing C++ codebase** - graphics-engine/ directory (my_canvas.cpp, shader_ops.h, etc.)

## Constraints

### Technical
- Must maintain compatibility with existing HTML/CSS/JS static site
- GitHub Pages hosting (static files only, no server-side processing)
- WASM file size should be reasonable for web delivery (<5MB ideal)
- Must work in modern browsers (Chrome, Firefox, Safari, Edge)

### Design
- Maintain existing visual design language (purple/blue gradient theme)
- Keep portfolio homepage (index.html) clean and professional
- Admin page (admin.html) remains for source code viewing
- Documentation should be accessible to non-experts

### Scope
- Focus on interactive showcase, not full IDE or debugging environment
- Existing C++ code structure preserved (no major refactoring)
- No backend services or databases (stay static)

## Out of Scope (for this project)

- Real-time collaborative editing
- Server-side rendering or compute
- Mobile app compilation
- WebGL/WebGPU rewrite (use existing 2D Canvas approach)
- Automated testing framework (future enhancement)

## Non-Functional Requirements

### Performance
- WASM module load time: <2 seconds on typical connection
- Rendering performance: 60fps for animations
- Interactive controls: <16ms response time

### Usability
- Documentation explains technical concepts clearly
- Code examples are copy-paste ready
- Visual controls provide immediate feedback
- Preset demos load instantly

### Accessibility
- Keyboard navigation for all controls
- Screen reader compatible documentation
- High contrast mode support

## Project Context

### Existing Codebase
- **Portfolio website** (index.html, graphics-demo.html, admin.html) - Fully functional
- **C++ graphics engine** (graphics-engine/) - Complete implementation with:
  - Canvas drawing (my_canvas.cpp)
  - Shader operations (shader_ops.h)
  - Blend functions (blend_functions.h)
  - Path operations (path_ops.h)
  - Matrix transformations (matrix_transform.cpp)
- **Codebase documentation** (.planning/codebase/) - Comprehensive analysis
- **Git repository** - Connected to personal GitHub (AaronDiefes.github.io)

### Current Limitations
- JavaScript recreation in graphics-demo.html doesn't showcase actual C++ implementation
- No way to demonstrate engine capabilities without local C++ environment
- Command-line only interface limits accessibility

### Stakeholders
- **Primary user**: Aaron Diefes (portfolio owner, original engine author)
- **Target audience**: Potential employers, collaborators, graphics programming enthusiasts
- **Secondary users**: Students/learners exploring 2D graphics concepts

---

**Created**: 2026-02-02
**Status**: Planning
**Next Steps**: Create roadmap with implementation phases
