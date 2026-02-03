# Coding Conventions

**Analysis Date:** 2026-02-02

## Naming Patterns

**Files:**
- C++ source files: `snake_case.cpp` (e.g., `my_final.cpp`, `my_canvas.cpp`, `matrix_transform.cpp`)
- C++ header files: `snake_case.h` or `PascalCase.h` in include directory
  - Public headers in `include/`: `PascalCase.h` (e.g., `GCanvas.h`, `GMatrix.h`, `GPaint.h`)
  - Implementation headers in root: `snake_case.h` (e.g., `my_utils.h`, `blend_functions.h`, `shader_ops.h`, `path_ops.h`, `Edge.h`)
- HTML files: `snake_case.html` (e.g., `graphics-demo.html`, `admin.html`)

**Functions:**
- C++ member functions: `camelCase` (e.g., `drawShape()`, `shadeRow()`, `isOpaque()`, `setContext()`)
- C++ class methods: `camelCase` (e.g., `unpremult()`, `pt_coons_avg()`)
- JavaScript functions: `camelCase` (e.g., `hexToRgba()`, `drawShape()`, `clearCanvas()`, `toggleAnimation()`)
- Utility functions: `snake_case` (e.g., `pt_coons_avg()`, `pt_weighted_avg()`)

**Variables:**
- C++ member variables: `fPrefixedCamelCase` (e.g., `fColor`, `fShader`, `fMode`, `fDeps`, `fSrc`)
- C++ local variables: `camelCase` (e.g., `x`, `y`, `color`, `rotation`, `scale`, `propC1`)
- JavaScript constants: `UPPER_SNAKE_CASE` (e.g., `PASSWORD_HASH`)
- JavaScript variables: `camelCase` (e.g., `canvas`, `ctx`, `shapeType`, `colorPicker`)

**Types:**
- C++ classes: `PascalCase` (e.g., `LinearPosGradientShader`, `MyFinal`, `GCanvas`, `GPaint`, `GMatrix`)
- CSS classes: `kebab-case` (e.g., `.project-grid`, `.project-card`, `.skill-badge`, `.control-group`)
- CSS ID selectors: `camelCase` (e.g., `#canvas`, `#shapeType`, `#colorPicker`, `#loginContainer`)

## Code Style

**Formatting:**
- No explicit formatter configured
- CSS inline styles: Properties use standard CSS with hyphenated names
- JavaScript: 4-space indentation observed in closures and control structures
- HTML: 4-space indentation for nested elements
- C++: Uses standard C++17 compilation with `-Wno-narrowing`, `-Wreturn-type`, `-Wunused-function`, `-Wreorder` warnings enabled

**Linting:**
- C++ compilation flags: `-g -Wno-narrowing -Wreturn-type -Wunused-function -Wreorder -Wunused-variable -Wfloat-conversion`
- Standard: C++17 (`-std=c++17`)
- Release builds: Include `-O3 -DNDEBUG` optimization flags
- No explicit linter configuration detected (no `.eslintrc`, `.prettierrc`, etc.)

## Import Organization

**C++ includes:**
Order follows include guard pattern with three categories:

1. **Standard library**: `#include <string>`, `#include <vector>`, etc.
2. **Project headers**: `#include "include/GCanvas.h"`, `#include "include/GMatrix.h"`, etc.
3. **Commented-out legacy includes**: Older headers marked with `//` prefix

Example from `my_final.cpp`:
```cpp
#include "include/GBitmap.h"
#include "include/GCanvas.h"
#include "include/GColor.h"
// ... more public headers ...
#include "include/GFinal.h"
// #include "starter_canvas.h"  (legacy, commented out)
// #include "Edge.h"
```

**JavaScript imports:**
- Uses global scope variables accessed via `document.getElementById()`
- No module system (inline `<script>` tags)
- Variables declared with `const` for constants and DOM elements

## Error Handling

**Patterns:**
- C++ assertions used for validation: `assert(prop <= positions[k]);`, `assert(propC1 >= 0.0f && propC1 <= 1.0f);`
- HTML form validation via `required` attribute on input fields
- JavaScript error display via CSS class toggling: `error.classList.add('show')` and `error.classList.remove('show')`
- User feedback through input state clearing: `document.getElementById('password').value = ''`

## Logging

**Framework:** `console` object (not observed in codebase)

**Patterns:**
- No explicit logging statements found in codebase
- No structured logging framework detected
- Console operations not used in graphics engine or web UI

## Comments

**When to Comment:**
- File-level copyright headers: Observed in public header files (e.g., `GCanvas.h`)
- Algorithm documentation: Detailed JSDoc-style comments in header files explaining parameter usage and behavior
- Legacy code markers: Commented-out includes indicate deprecated functionality
- Type documentation: Comments explain complex type parameters

**JSDoc/TSDoc:**
- C++ style: Multi-line comments with detailed explanations
- Example from `GCanvas.h`:
```cpp
/**
 *  Save off a copy of the canvas state (CTM), to be later used if the balancing call to
 *  restore() is made. Calls to save/restore can be nested:
 *  ...detailed example...
 */
virtual void save() = 0;
```
- JavaScript: Sparse, minimal comments except for critical business logic (e.g., password hashing algorithm)
- HTML: Minimal comments except for demarcating major sections (`<!-- Login Form -->`, `<!-- Code Viewer -->`)

## Function Design

**Size:**
- C++ shader functions: Medium (60-110 lines for complex algorithms like `shadeRow()`)
- JavaScript functions: Small to medium (10-50 lines)
- HTML event handlers: Small inline closures

**Parameters:**
- C++ uses const references for arrays and objects: `const GColor colors[]`, `const GMatrix& ctm`
- C++ member functions commonly use `this` returns for chaining: `GPaint& setColor(GColor c) { fColor = c; return *this; }`
- JavaScript closures capture variables from outer scope

**Return Values:**
- C++ bool returns for status: `bool setContext(const GMatrix& ctm) override`
- C++ optional pattern: `if (auto inverse = m.invert()) { ... }`
- C++ void for drawing operations
- JavaScript direct value returns for utility functions

## Module Design

**Exports:**
- C++ class definitions in `.h` files define the public interface
- All implementation in `.cpp` files
- Header-only utility headers for template-like code: `my_utils.h`, `blend_functions.h`

**Barrel Files:**
- Not used in C++ codebase
- HTML pages are standalone (index.html, graphics-demo.html, admin.html)
- No aggregated exports observed

## C++ Specific Conventions

**Class Hierarchy:**
- Inheritance indicated by `: public BaseClass` syntax
- Virtual method overriding with `override` keyword: `bool setContext(const GMatrix& ctm) override`
- Pure virtual base classes used for interfaces (e.g., `GCanvas`, `GShader`, `GFinal`)

**Constructor Patterns:**
- Initializer lists used: `LinearPosGradientShader(...) : P0(p0), P1(p1), count(count)`
- Default member initialization: `GColor fColor = {0, 0, 0, 1};`

**STL Usage:**
- `std::vector<>` for dynamic arrays: `std::vector<GColor> gradient_colors {};`
- Vector initialization with empty braces: `{}`

## JavaScript Conventions

**DOM Manipulation:**
- Event listeners attached via `addEventListener()`: `drawBtn.addEventListener('click', drawShape);`
- Arrow functions used in callbacks: `opacitySlider.addEventListener('input', (e) => { ... })`
- CSS class manipulation for state: `classList.add()`, `classList.remove()`
- Inline style manipulation when immediate feedback needed: `animateBtn.style.background = '#e74c3c'`

**Async Operations:**
- `async/await` pattern for hashing: `async function sha256(message) { ... }`
- Web Crypto API usage: `crypto.subtle.digest('SHA-256', msgBuffer)`
- `sessionStorage` for client-side session state

**HTML Canvas:**
- Canvas context obtained via `getContext('2d')`
- State management via `ctx.save()` and `ctx.restore()`
- Canvas drawing operations use familiar patterns: `fillRect()`, `beginPath()`, `fill()`, `stroke()`

---

*Convention analysis: 2026-02-02*
