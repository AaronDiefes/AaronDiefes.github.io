# Codebase Structure

**Analysis Date:** 2026-02-02

## Directory Layout

```
/Users/orases/Aaron/website/
├── index.html                  # Portfolio homepage (landing page)
├── graphics-demo.html          # Interactive 2D graphics engine demo
├── admin.html                  # Password-protected source code viewer
├── CLAUDE.md                   # Development guidance for Claude Code
├── graphics-engine/            # C++ reference implementation (documentation)
│   ├── include/                # C++ header files (API definitions)
│   │   ├── GCanvas.h          # Canvas interface
│   │   ├── GPaint.h           # Paint/style configuration
│   │   ├── GShader.h          # Shader interface
│   │   ├── GMatrix.h          # Transformation matrices
│   │   ├── GBitmap.h          # Bitmap/image data
│   │   ├── GPath.h            # Path operations
│   │   ├── GPoint.h           # Point primitives
│   │   ├── GRect.h            # Rectangle primitives
│   │   ├── GColor.h           # Color representation
│   │   ├── GPixel.h           # Pixel operations
│   │   ├── GBlendMode.h       # Blend mode enums
│   │   ├── GShader.h          # Shader pipeline
│   │   ├── GMath.h            # Math utilities
│   │   ├── GRandom.h          # Random number generation
│   │   ├── GTime.h            # Timing utilities
│   │   ├── GTypes.h           # Type definitions
│   │   └── GFinal.h           # Final project interface
│   ├── src/                    # C++ implementation files
│   │   ├── GBitmap.cpp        # Bitmap implementation
│   │   ├── GBitmap_lode.cpp   # PNG/image loading
│   │   ├── GPath.cpp          # Path implementation
│   │   ├── GTime.cpp          # Timing implementation
│   │   └── lodepng.h/cpp      # PNG codec library
│   ├── apps/                   # Application/demo executables
│   │   ├── main_image.cpp     # Main entry point
│   │   ├── image.cpp          # Image processing application
│   │   ├── image.h            # Image interface
│   │   ├── image_recs.cpp     # Rectangle test app
│   │   ├── image_final.cpp    # Final project application
│   │   ├── GWindow.cpp        # Window management
│   │   ├── GWindow.h          # Window interface
│   │   ├── GTime.cpp          # Timing implementation
│   │   ├── spock.png          # Test image asset
│   │   └── wheel.png          # Test image asset
│   ├── my_canvas.cpp          # Main canvas implementation
│   ├── my_final.cpp           # Final project submission
│   ├── matrix_transform.cpp   # Transformation matrix operations
│   ├── Edge.h                 # Edge detection and clipping
│   ├── blend_functions.h      # Color blending modes (src, dst, src_over, etc.)
│   ├── shader_ops.h           # Shader pipeline implementation
│   ├── path_ops.h             # Path operations and utilities
│   ├── my_utils.h             # Utility functions
│   ├── starter_canvas.h       # Canvas base class/starter code
│   ├── Makefile               # Build configuration
│   ├── README.md              # Graphics engine documentation
│   ├── final_coons.png        # Output image (Coons patch rendering)
│   ├── final_linearpos.png    # Output image (linear position rendering)
│   ├── image                  # Compiled binary executable
│   ├── diff/                  # Reference output images for comparison
│   └── expected/              # Expected test outputs
├── .git/                       # Git repository metadata
├── .claude/                    # Claude Code session files
└── .planning/
    └── codebase/              # Documentation files (this directory)
        ├── ARCHITECTURE.md    # System architecture
        └── STRUCTURE.md       # This file
```

## Directory Purposes

**Root Level:**
- Purpose: Portfolio website entry points and documentation
- Contains: HTML pages for public access
- Key files: `index.html`, `graphics-demo.html`, `admin.html`

**graphics-engine/:**
- Purpose: Reference implementation of 2D graphics engine in C++
- Contains: Complete graphics library with canvas drawing, transformations, shaders, blending
- Key files: `my_canvas.cpp` (main implementation), header files in `include/`
- Note: This is for reference and documentation only; the JavaScript demo reimplements the logic

**graphics-engine/include/:**
- Purpose: API definitions and type declarations
- Contains: Abstract interfaces and data structures
- Key files: `GCanvas.h` (drawing interface), `GMatrix.h` (transforms), `GShader.h` (shaders)

**graphics-engine/src/:**
- Purpose: Core graphics library implementations
- Contains: Bitmap handling, PNG image loading, path operations
- Key files: `GBitmap.cpp`, `lodepng.h/cpp` (PNG codec)

**graphics-engine/apps/:**
- Purpose: Executable applications demonstrating the graphics engine
- Contains: Main entry point, test applications, window management
- Key files: `main_image.cpp` (entry point), `image.cpp` (demo app)

**.planning/codebase/:**
- Purpose: GSD documentation and analysis artifacts
- Contains: Architecture and structure guides generated by mapping process
- Key files: This file and `ARCHITECTURE.md`

## Key File Locations

**Entry Points:**
- `index.html`: Main portfolio homepage - served as root at https://aarondiefes.github.io/
- `graphics-demo.html`: Interactive Canvas demo page
- `admin.html`: Source code viewer with password protection

**Configuration:**
- `CLAUDE.md`: Development guidelines and repository configuration for Claude
- `Makefile` (in graphics-engine/): Build configuration for C++ compilation

**Core Logic:**
- `graphics-demo.html` lines 247-395: All drawing, transformation, animation logic
- `my_canvas.cpp`: C++ canvas implementation (reference)
- `blend_functions.h`: Blending algorithm implementations
- `shader_ops.h`: Shader pipeline for texture mapping and gradients

**Testing/Assets:**
- `graphics-engine/apps/spock.png`, `wheel.png`: Test image assets
- `graphics-engine/diff/`: Reference outputs for comparison testing
- `graphics-engine/expected/`: Expected test results

## Naming Conventions

**Files:**
- HTML files: lowercase with hyphens (`index.html`, `graphics-demo.html`, `admin.html`)
- C++ implementation: camelCase (`my_canvas.cpp`, `matrix_transform.cpp`)
- C++ headers: PascalCase with .h extension (`GCanvas.h`, `GPaint.h`, `GMatrix.h`)
- Header guards: `FILENAME_DEFINED` (e.g., `GCanvas_DEFINED`)

**Directories:**
- lowercase snake_case for most: `graphics-engine`, `include`, `src`, `apps`
- dot-prefix for hidden: `.git`, `.claude`, `.planning`

**C++ Functions:**
- camelCase: `drawShape()`, `loadFile()`, `animate()`
- Library functions: PrefixedCamelCase (`GFloorToInt()`, `GRoundToInt()`)

**C++ Classes:**
- PascalCase: `GCanvas`, `GPaint`, `GMatrix`, `MyCanvas`, `MyBMShader`
- Abstract base classes typically have G prefix (e.g., `GCanvas`, `GShader`)
- Implementation classes have My prefix (e.g., `MyCanvas`)

**JavaScript Variables:**
- DOM references: `camelCase` (e.g., `canvas`, `ctx`, `shapeType`, `colorPicker`)
- Constants: `SCREAMING_SNAKE_CASE` (e.g., `PASSWORD_HASH`)
- Function scoped: `camelCase` (e.g., `animating`, `animationId`)

**CSS:**
- Class names: lowercase with hyphens (`.project-card`, `.control-group`, `.file-tree-item`)
- IDs: lowercase with hyphens (`#canvas`, `#loginForm`, `#codeViewer`)

## Where to Add New Code

**New Feature (Drawing/Rendering):**
- Primary code: Add JavaScript function to `graphics-demo.html` script section (lines 247-395)
- HTML markup: Add control element in `<div class="controls">` section (lines 174-235)
- CSS: Add styles inline in `<style>` tag (lines 7-164)
- Pattern: Follow existing `drawShape()` function structure with Canvas 2D context management

**New Page (Additional Portfolio Section):**
- Create new `.html` file in root: `/Users/orases/Aaron/website/new-page.html`
- Link from `index.html` projects section (lines 265-291)
- Include consistent header (gradient background), container layout, footer
- Embed CSS and JavaScript inline (no external dependencies)

**New Transformation/Utility:**
- Add to JavaScript utilities section in `graphics-demo.html` (after line 286)
- Follow pattern: Use Canvas 2D context methods (`translate()`, `rotate()`, `scale()`)
- Expose through controls if user-facing, otherwise keep as internal helper

**New C++ Component (for reference/documentation only):**
- Add header to `graphics-engine/include/G*.h`
- Add implementation to `graphics-engine/*.cpp` or `graphics-engine/src/*.cpp`
- Follow existing pattern: abstract interface in header, implementation in cpp
- Update `Makefile` if adding new source files

**Admin Source Code Viewer Enhancement:**
- File list structure: Update `files` object in `admin.html` lines 329-352
- File descriptions: Update `getFileDescription()` function lines 408-415
- UI styling: Modify inline CSS in `admin.html` lines 7-231

## Special Directories

**graphics-engine/diff/:**
- Purpose: Stores reference/expected outputs for testing graphics operations
- Generated: Yes (by running the C++ application)
- Committed: Yes (included in repository)
- Use: Visual regression testing - compare generated output against expected

**graphics-engine/expected/:**
- Purpose: Contains baseline/correct output images for comparison tests
- Generated: No (created manually or copied from reference implementation)
- Committed: Yes (included in repository)
- Use: Validation that new code produces correct graphics output

**.claude/:**
- Purpose: Claude Code workspace state and session metadata
- Generated: Yes (automatically by Claude Code)
- Committed: No (should be in .gitignore)
- Use: Editor state persistence between sessions

**.planning/:**
- Purpose: GSD planning and documentation artifacts
- Generated: Yes (by `/gsd:map-codebase` and `/gsd:plan-phase` commands)
- Committed: No (should be in .gitignore)
- Use: Context for orchestrating implementation phases

## File Modification Strategy

**When Adding UI Controls:**
1. Add HTML control element to `<div class="controls">` section
2. Add CSS rule to `<style>` tag for layout/appearance
3. Add JavaScript event listener in the "Event listeners" section
4. Add DOM reference variable at top of script section
5. Update `drawShape()` to read and apply the new control value

**When Adding Canvas Drawing Operations:**
1. Add case to shape switch statement in `drawShape()` (around line 308)
2. Use Canvas 2D context methods: `ctx.beginPath()`, `ctx.moveTo()`, `ctx.lineTo()`, `ctx.arc()`, `ctx.fill()`, `ctx.stroke()`
3. Remember to wrap in `ctx.save()` / `ctx.restore()` for state isolation
4. Test transformation application (translate, rotate, scale all apply)

**When Modifying C++ Reference Code:**
1. Update headers in `include/` for interface changes
2. Update implementation in `*.cpp` files
3. Update `Makefile` if new files added
4. Recompile with `make clean && make`
5. No need to sync back to HTML demo (they are independent)

---

*Structure analysis: 2026-02-02*
