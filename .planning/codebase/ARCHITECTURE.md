# Architecture

**Analysis Date:** 2026-02-02

## Pattern Overview

**Overall:** Multi-layer portfolio website with dual implementations (JavaScript frontend + C++ reference backend)

**Key Characteristics:**
- Static HTML/CSS/JS site deployed on GitHub Pages
- Three-page portfolio architecture: landing, interactive demo, protected source viewer
- JavaScript Canvas API recreation of C++ graphics engine logic
- Client-side session authentication with SHA-256 hashing
- No backend services, no databases, no external API dependencies
- Reference C++ graphics engine source included for documentation

## Layers

**Presentation Layer:**
- Purpose: Render UI and handle user interactions in the browser
- Location: `index.html`, `graphics-demo.html`, `admin.html`
- Contains: HTML markup, embedded CSS (styled components), inline JavaScript
- Depends on: HTML5 Canvas API, Web Crypto API, sessionStorage
- Used by: End users via browser

**Application Logic Layer:**
- Purpose: Handle shape rendering, transformations, blend modes, animations
- Location: JavaScript embedded in `graphics-demo.html` (lines 247-395)
- Contains: `drawShape()`, `animate()`, event handlers, transformation math
- Depends on: Canvas 2D context, user input events
- Used by: Presentation layer

**State Management Layer:**
- Purpose: Maintain canvas drawing state, animation state, transformation values
- Location: JavaScript control variables in `graphics-demo.html` (lines 247-266)
- Contains: `animating` flag, `animationId`, slider values, canvas context
- Depends on: Browser globals (canvas element, DOM)
- Used by: Application logic layer

**Authentication Layer:**
- Purpose: Verify admin access to source code viewer
- Location: JavaScript in `admin.html` (lines 274-416)
- Contains: SHA-256 hashing, session token management, file tree building
- Depends on: Web Crypto API, sessionStorage, DOM manipulation
- Used by: admin.html page

**Reference Engine (C++):**
- Purpose: Documentation and reference implementation (not executed)
- Location: `/graphics-engine/`
- Contains: Canvas implementation, blend functions, shader operations, edge detection, path operations
- Depends on: C++ standard library, GImage/GPixel abstractions
- Used by: Development reference only

## Data Flow

**Drawing Operation Flow:**

1. User interacts with controls (color picker, shape type, sliders)
2. Event listeners update `shapeType`, `colorPicker`, `opacitySlider`, etc. variables
3. User clicks "Draw Shape" or canvas
4. `drawShape()` function called
5. Function reads current control values
6. Calculates canvas coordinates with random offset
7. Saves canvas state with `ctx.save()`
8. Applies transformations: `translate()`, `rotate()`, `scale()`
9. Sets fill/stroke colors with opacity via `hexToRgba()`
10. Renders shape using Canvas 2D API (`fillRect`, `arc`, `lineTo`, etc.)
11. Applies blend mode via `ctx.globalCompositeOperation`
12. Restores canvas state with `ctx.restore()`

**Animation Flow:**

1. User clicks "Animate Shapes"
2. `toggleAnimation()` flips `animating` flag to true
3. Calls `animate()` function
4. `animate()` increments rotation slider by 5 degrees
5. Calls `drawShape()` with new rotation
6. Schedules next frame with `setTimeout()` + `requestAnimationFrame()`
7. Loop continues until `animating` set to false

**Authentication Flow:**

1. User visits `admin.html`
2. Checks `sessionStorage.getItem('authenticated')`
3. If not authenticated, shows login form
4. User enters password and submits
5. Password hashed with SHA-256 using Web Crypto API
6. Hash compared to `PASSWORD_HASH` constant
7. If match, `sessionStorage.setItem('authenticated', 'true')`
8. Shows code viewer with file tree
9. User clicks file in tree
10. `loadFile()` displays file info and placeholder
11. Links to GitHub for actual source code

**State Management:**

- Canvas drawing state managed via implicit Canvas 2D context state
- Control values stored in DOM elements (input/select)
- Animation state tracked by `animating` boolean
- Session state persisted in `sessionStorage` (not cleared between tabs)
- No persistence across browser sessions (no localStorage used)

## Key Abstractions

**Shape Drawing System:**
- Purpose: Render geometric shapes with consistent interface
- Examples: Rectangle, Circle, Triangle, Line, Polygon
- Pattern: Switch statement on `shapeType.value` dispatches to appropriate Canvas API calls
- Location: `graphics-demo.html` lines 308-344 (`drawShape()` function)

**Transformation Pipeline:**
- Purpose: Apply matrix transformations (translate, rotate, scale) to shapes
- Examples: Used in Canvas context methods
- Pattern: Canvas context state management (`save()` → transform → draw → `restore()`)
- Location: `graphics-demo.html` lines 298-346

**Blend Mode System:**
- Purpose: Control how drawn shapes compose with existing canvas pixels
- Examples: "source-over", "multiply", "screen", "overlay", "difference"
- Pattern: Set via `ctx.globalCompositeOperation` property
- Location: `graphics-demo.html` lines 299, 223-229

**Color Utility:**
- Purpose: Convert hex color picker values to RGBA with opacity
- Examples: `#667eea` → `rgba(102, 126, 234, 1.0)`
- Pattern: String parsing and formatting
- Location: `graphics-demo.html` lines 281-286 (`hexToRgba()` function)

**File Navigation System (admin.html):**
- Purpose: Provide browsable view of graphics engine source structure
- Examples: Core Files, Headers, Applications, Build
- Pattern: Object literal mapping categories to file metadata, DOM generation
- Location: `admin.html` lines 329-370 (file structure and `loadFileTree()`)

## Entry Points

**index.html:**
- Location: `/Users/orases/Aaron/website/index.html`
- Triggers: User navigates to https://aarondiefes.github.io/
- Responsibilities: Render portfolio landing page, display skills, link to other sections

**graphics-demo.html:**
- Location: `/Users/orases/Aaron/website/graphics-demo.html`
- Triggers: User clicks "Try Interactive Demo" button or navigates directly
- Responsibilities: Initialize canvas, set up control event listeners, handle drawing and animation

**admin.html:**
- Location: `/Users/orases/Aaron/website/admin.html`
- Triggers: User clicks "View Source Code" button or navigates directly
- Responsibilities: Authenticate user, display file tree, load and display file contents

## Error Handling

**Strategy:** Minimal error handling - site assumes stable browser environment and valid user input

**Patterns:**
- No try-catch blocks in graphics demo
- Canvas drawing assumes valid shape type (switch statement has default)
- Password validation handled via hash comparison (silent failure shows error message)
- File loading in admin.html displays placeholder for unrecognized files
- No input validation on sliders/controls (browsers enforce min/max)

## Cross-Cutting Concerns

**Logging:** None. No logging framework. Debug info removed from production (commented code in `my_canvas.cpp` line 77-78).

**Validation:**
- HTML5 input constraints (type="range" min/max, type="color")
- Form submission validation via HTML5 (required attribute)
- No client-side JS validation beyond browser constraints

**Authentication:**
- Client-side SHA-256 hashing of password
- Session token in sessionStorage (not httpOnly, vulnerable to XSS but acceptable for demo)
- No CSRF protection (not applicable for static site)
- No rate limiting (browser-only access, no server)

**Styling:**
- Inline CSS in each HTML file
- Consistent color palette across all pages (primary gradient #667eea to #764ba2)
- Responsive design with single breakpoint at 768px
- No CSS framework or preprocessor

**Canvas Rendering:**
- All shapes rendered to single canvas element with 2D context
- Drawing operations are immediate (no scene graph)
- No GPU acceleration explicitly configured (browser decides)
- Animation uses setTimeout + requestAnimationFrame pattern

---

*Architecture analysis: 2026-02-02*
