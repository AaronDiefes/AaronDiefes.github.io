# Archived Pre-React Files

This directory contains all the original vanilla JavaScript files from before the React conversion (completed February 15, 2026).

## Contents

### Original HTML Pages
- `index.html.backup` - Original portfolio homepage
- `graphics-demo.html` - JavaScript Canvas API demo
- `wasm-graphics-demo.html` - WebAssembly graphics engine demo (complete with all 10 demos)
- `admin.html` - Password-protected source code viewer

### Original CPU Simulator
- `cpu-simulator/` - Complete vanilla JS implementation with:
  - `src/core/` - CPUState, InstructionSet, SequenceGenerator
  - `src/animation/` - AnimationEngine, TimingController
  - `src/visualization/` - BlockDiagramView, RegisterView, MemoryView, InstructionView
  - `src/ui/` - ControlPanel, ProgramSelector, InstructionList
  - `src/programs/` - Program definitions (basic-instructions, fibonacci)

### Documentation (Original)
- `docs/` - Original documentation HTML files
  - Duplicate of `public/docs/` which is actively served
  - Contains: index.html, core-rendering.html, transforms-textures.html, etc.
  - Assets: CSS, JS, images

### C++ Source Code
- `graphics-engine-src/` - Complete C++ graphics engine source code
  - Used to build the WASM files (graphics_engine.js/wasm)
  - Not served by the website - reference only
  - Contains: blend_functions.h, shader_ops.h, my_canvas.cpp, etc.

### Test Files
- `wasm-test.html` - Basic WASM test
- `wasm-test-phase2.html` - Phase 2 WASM test
- `wasm-test-images.html` - WASM image loading test

### Assets (Moved to public/)
- `graphics_engine.js` - WASM glue code (now in `public/`)
- `graphics_engine.wasm` - Compiled C++ engine (now in `public/`)
- `poly_demo.png` - Demo image (now in `public/`)
- `spock.png` - Test image (now in `public/`)
- `image examples/` - Test images for graphics demos (copied to `src/assets/images/`)

## Status

⚠️ **These files are for reference only** - they are not served by the website.

The React versions in `/src/` are now the active codebase with identical functionality.

## React Conversion

All functionality from these files has been converted to React components in:
- `/src/pages/` - Page components
- `/src/components/` - Reusable components
- `/src/lib/` - Core logic (kept as vanilla JS modules)
- `/src/hooks/` - Custom React hooks

See `/CLAUDE.md` for complete React architecture documentation.
