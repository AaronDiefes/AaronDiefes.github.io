# Technology Stack

**Analysis Date:** 2026-02-02

## Languages

**Primary:**
- HTML5 - Markup for all web pages
- CSS3 - Styling and responsive design
- JavaScript (ES6+) - Client-side interactivity and graphics rendering
- C++ (C++17) - Graphics engine reference implementation

**Secondary:**
- Bash - Build scripts (Makefile)

## Runtime

**Environment:**
- Browser (HTML5 Canvas API, Web Crypto API)
- g++ (GCC compiler for C++ graphics engine)

**Package Manager:**
- None (static site - no package.json or dependency management)

## Frameworks

**Core:**
- HTML5 Canvas 2D Context API - 2D graphics rendering
- Web Crypto API - SHA-256 password hashing for admin page
- Vanilla JavaScript - No framework dependencies

**Build/Dev:**
- GNU Make - C++ compilation (Makefile at `graphics-engine/Makefile`)

## Key Dependencies

**Runtime Libraries:**
- None - Site is completely self-contained with zero external dependencies

**Graphics Engine (C++ Reference):**
- Standard C++ Library (STL)
- System headers for image/bitmap operations
- GCC/g++ standard library

## Configuration

**Environment:**
- No environment variables required
- Static site deployment - no backend configuration
- Password hash hardcoded in `admin.html` (lines 275-277)
- Default admin password: "graphics2024" (stored as SHA-256 hash)

**Build:**
- C++ compilation flags: `-std=c++17 -Wno-narrowing -Wreturn-type -Wunused-function -Wreorder -Wunused-variable -Wfloat-conversion`
- Debug build: No optimization, with debug symbols (`-g`)
- Release build: Optimization level 3 (`-O3`) with NDEBUG flag

## Platform Requirements

**Development:**
- g++ (GCC C++ compiler) for building graphics engine reference
- Text editor or IDE for HTML/CSS/JavaScript
- Git for version control
- macOS/Linux/Windows (cross-platform compatible)

**Production:**
- Static hosting (GitHub Pages)
- Modern web browser with:
  - HTML5 Canvas support
  - CSS Grid and Flexbox support
  - Web Crypto API for SHA-256 hashing
  - ES6+ JavaScript support

## Static Assets

**Image Files:**
- `graphics-engine/final_coons.png` - Generated output from graphics engine
- `graphics-engine/final_linearpos.png` - Graphics processing output
- `graphics-engine/image` - Binary image file from rendering pipeline

## Build Artifacts

**C++ Compilation Output:**
- Compiled executable: `graphics-engine/image`
- Object files and debug symbols in `.dSYM` directories

---

*Stack analysis: 2026-02-02*
