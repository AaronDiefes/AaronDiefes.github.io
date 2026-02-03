# WebAssembly Graphics Engine Portfolio

## Core Value

Transform an existing C++ 2D graphics engine into an interactive web portfolio that demonstrates advanced graphics capabilities through live, browser-based demos with comprehensive documentation of the engine's architecture.

## Project Type

Portfolio showcase - converting native C++ graphics engine to WebAssembly for browser-based interactive demonstrations.

## Success Criteria

The project succeeds when:
- Users can interact with graphics engine features directly in their browser without installation
- Each engine capability has a live demo with configurable parameters and visual controls
- Source code examples are accessible alongside running demos
- Documentation clearly explains the engine's architecture and implementation details
- Portfolio loads and runs performantly on GitHub Pages static hosting
- Visitors understand the technical depth of the graphics engine implementation

## Constraints

### Technical Constraints
- Must compile existing C++ codebase to WebAssembly using Emscripten
- Must work on GitHub Pages (static hosting, no server-side processing)
- Browser compatibility: Modern browsers with WebAssembly support
- Performance: Canvas rendering at 30+ FPS for interactive demos
- File size: Keep WASM bundle under 5MB for reasonable load times

### Existing Codebase
- Graphics engine already implemented in C++ (graphics-engine/ directory)
- Core capabilities: shape drawing, transformations, shaders, blend modes, path rendering
- Build system: Makefile targeting native compilation
- Architecture: Header-based with includes (GCanvas.h, GShader.h, etc.)

### Scope Boundaries
- No server-side rendering or dynamic content generation
- No user account system or data persistence
- Focus on demonstration, not production graphics library distribution
- Documentation is informative, not tutorial-style teaching content

## Context

### Current State
- C++ graphics engine fully functional for native compilation
- Existing graphics-demo.html provides UI/UX reference design
- Basic portfolio website structure (index.html, admin.html)
- Engine implements: rectangles, circles, polygons, paths, matrix transformations, shaders (bitmap, gradient), blend modes, mesh rendering

### Target Audience
- Recruiters evaluating technical capabilities
- Engineers interested in graphics programming
- Technical decision-makers assessing problem-solving skills

### Key Differentiators
- Live, interactive demos (not just screenshots)
- Full source code transparency
- Deep technical documentation of implementation choices
- Real-time parameter manipulation showing cause-and-effect
