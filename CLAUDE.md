# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is **AaronDiefes.github.io**, a personal portfolio website hosted on GitHub Pages. The site is built with **React** and **Vite**, showcasing projects including an interactive CPU simulator and a C++ 2D graphics engine compiled to WebAssembly.

**Live URL:** https://aarondiefes.github.io/

## Technology Stack

- **React 18** - UI framework
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **Vanilla JS modules** - Core CPU simulation logic
- **WebAssembly** - C++ graphics engine compiled via Emscripten
- **Docker + Nginx** - Production deployment

## Important Directories

### `/archived/` - Pre-React Files (Reference Only)
This directory contains all the original vanilla JavaScript files before the React conversion. These files are kept for reference and comparison but are NOT served by the website. The React versions in `src/` are now the active codebase.

**Contents:**
- Original HTML pages (index.html, graphics-demo.html, wasm-graphics-demo.html, admin.html)
- Original CPU simulator vanilla JS implementation
- WASM test files
- Original asset files (moved to public/ or src/assets/)

⚠️ **Do not modify files in archived/** - they are historical reference only.

## Repository Structure

```
/
├── archived/                           # Pre-React vanilla JS files (reference only)
│   ├── index.html.backup               # Original homepage
│   ├── graphics-demo.html              # Original JS canvas demo
│   ├── wasm-graphics-demo.html         # Original WASM demo
│   ├── admin.html                      # Original admin page
│   ├── cpu-simulator/                  # Original vanilla JS CPU simulator
│   ├── wasm-test*.html                 # WASM test files
│   ├── graphics_engine.js              # Old WASM files (now in public/)
│   ├── graphics_engine.wasm
│   └── *.png                           # Old image files
│
├── src/                                # React source code
│   ├── main.jsx                        # Entry point
│   ├── App.jsx                         # Root component with routing
│   │
│   ├── pages/                          # Page components
│   │   ├── HomePage.jsx                # Portfolio homepage
│   │   ├── CPUSimulatorPage.jsx        # CPU simulator demo
│   │   ├── GraphicsDemoPage.jsx        # Graphics JS demo
│   │   ├── GraphicsWasmPage.jsx        # Graphics WASM demo
│   │   ├── AdminPage.jsx               # Admin/source viewer
│   │   └── DocsPage.jsx                # Documentation viewer
│   │
│   ├── components/                     # Shared components
│   │   ├── shared/
│   │   │   ├── Navigation.jsx          # Site nav
│   │   │   └── Footer.jsx              # Site footer
│   │   ├── cpu/                        # CPU simulator components
│   │   │   ├── CPUVisualizer.jsx       # Main coordinator
│   │   │   ├── BlockDiagram.jsx        # SVG block diagram
│   │   │   ├── RegisterView.jsx        # Register grid
│   │   │   ├── MemoryView.jsx          # Memory table
│   │   │   ├── InstructionView.jsx     # Instruction details
│   │   │   ├── ControlPanel.jsx        # Playback controls
│   │   │   ├── ProgramSelector.jsx     # Program dropdown
│   │   │   └── InstructionList.jsx     # Instruction list
│   │   └── graphics/                   # Graphics components (TBD)
│   │
│   ├── lib/                            # Vanilla JS logic (non-React)
│   │   └── cpu/
│   │       ├── core/                   # CPUState, InstructionSet, SequenceGenerator
│   │       ├── animation/              # AnimationEngine, TimingController
│   │       └── programs/               # Program definitions
│   │
│   ├── hooks/                          # Custom React hooks
│   │   ├── useAnimationEngine.js       # Wraps AnimationEngine
│   │   └── useWasmModule.js            # Loads WASM (TBD)
│   │
│   ├── styles/                         # CSS files
│   │   ├── design-system.css           # Color palette, typography
│   │   ├── navigation.css              # Nav styles
│   │   └── visualization.css           # CPU viz styles
│   │
│   └── assets/
│       ├── wasm/                       # WASM files
│       │   ├── engine.js
│       │   └── engine.wasm
│       └── images/                     # Test images
│
├── public/                             # Static files (copied to dist/)
├── dist/                               # Build output (gitignored)
├── docs/                               # Documentation files
├── docker/                             # Docker configuration
│   ├── Dockerfile                      # Multi-stage build
│   ├── docker-compose.yml
│   ├── nginx.conf                      # SPA routing config
│   └── .dockerignore
├── package.json
├── vite.config.js
├── index.html                          # Vite entry (contains <div id="root">)
└── CLAUDE.md
```

## Key Architecture

### React Application Structure

The site uses **React Router** for client-side routing with these main routes:

- `/` - Homepage (portfolio landing)
- `/projects/cpu-simulator` - Interactive CPU simulator
- `/projects/graphics-engine` - Graphics JS demo (TBD)
- `/projects/graphics-engine/wasm` - Graphics WASM demo (TBD)
- `/docs` - Documentation viewer (TBD)
- `/admin` - Admin page (TBD)

### CPU Simulator Architecture

**Hybrid approach:** Vanilla JS core logic + React UI wrapper

- **Core logic (vanilla JS):** CPUState, InstructionSet, SequenceGenerator, AnimationEngine - kept as ES modules for testability and independence
- **UI layer (React):** Wraps vanilla JS views (BlockDiagramView, RegisterView, etc.) using refs and useEffect
- **Custom hook:** `useAnimationEngine()` - wraps AnimationEngine class, provides state and controls to React components
- **State flow:** AnimationEngine emits `cpu:framechange` events → Hook updates React state → Components re-render

**Why this approach:**
- Core CPU logic already well-tested and working
- Faster migration (no need to rewrite algorithms)
- Separation of concerns (logic vs. presentation)
- Can still unit test vanilla JS modules independently

### Component Patterns

1. **Vanilla JS wrappers:** Components like `BlockDiagram.jsx`, `RegisterView.jsx` use `useRef` to hold DOM container, import vanilla JS class in `useEffect`, call `render(state)` on state changes
2. **Pure React components:** `ControlPanel.jsx`, `ProgramSelector.jsx` built from scratch in React (no vanilla JS)
3. **Custom hooks:** Abstract complex logic (animation engine, WASM loading) for reuse

## Git Configuration

This repository uses a **personal GitHub account SSH key** configured in `~/.ssh/config`:

```
Host github.com-personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_ed25519_github
```

The remote is configured as `git@github.com-personal:AaronDiefes/AaronDiefes.github.io.git` to ensure it uses the personal SSH key, not work credentials.

## Development Workflow

### Local Development

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Docker Development

```bash
cd docker
docker-compose build
docker-compose up
# Visit http://localhost:8080
```

### Deployment

**GitHub Pages:** Deploy `dist/` output to gh-pages branch or push to main.

```bash
npm run build
# Deploy dist/ contents
```

**Docker Production:** Multi-stage Dockerfile builds React app, then serves with Nginx.

## Design System

**Color Palette:**
- Primary gradient: Forest green `#2E7D32` to `#1B5E20`
- Dark text: `#2c3e50`
- Light backgrounds: `#f8f9fa`, `#f5f5f5`
- Accent: `#2E7D32`

**Typography:**
- System font stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, ...`
- Monospace for code: `'Monaco', 'Courier New', monospace`

## Working with the CPU Simulator

**To modify visualization:**
- React wrapper components: `src/components/cpu/*.jsx`
- Vanilla JS views: `cpu-simulator/src/visualization/*.js` (reference - not directly used)
- Core logic: `src/lib/cpu/core/*.js`
- Programs: `src/lib/cpu/programs/*.js`

**To add a new program:**
1. Create new file in `src/lib/cpu/programs/`
2. Export program object with `instructions` array
3. Register in `window.PROGRAMS` object

**To modify block diagram:**
- SVG rendering: `cpu-simulator/src/visualization/block-diagram-view.js`
- React wrapper: `src/components/cpu/BlockDiagram.jsx`

## Working with Graphics Engine

**WASM files:** Located in `src/assets/wasm/`
- `engine.js` - Emscripten-generated JS glue code
- `engine.wasm` - Compiled C++ binary

**C++ source (reference):** `graphics-engine-src/`
- Not served by the website
- Kept for documentation and rebuilding WASM

**To rebuild WASM:**
```bash
cd graphics-engine-src
# Use Emscripten toolchain to compile
# Copy output to src/assets/wasm/
```

## Nginx Configuration

**SPA routing:** Nginx config includes `try_files $uri $uri/ /index.html;` to support client-side routing.

**WASM MIME type:** Configured in nginx.conf for proper WASM serving.

**Caching:**
- Static assets (JS, CSS, WASM): 1 year cache
- HTML files: no-cache (always fetch latest)

## Migration Notes

**Archived files** (located in `/archived/`):
- All original vanilla JS HTML files before React conversion
- `index.html.backup` - Original portfolio homepage
- `cpu-simulator/` - Original vanilla JS CPU simulator implementation
- `graphics-demo.html` - Original JavaScript canvas demo
- `wasm-graphics-demo.html` - Original WebAssembly demo
- `admin.html` - Original admin/source viewer
- `wasm-test*.html` - WASM development test files
- Original WASM files and images (now in `public/`)

**Converted to React:**
- Homepage → `HomePage.jsx`
- CPU simulator → `CPUSimulatorPage.jsx` + components
- Navigation → `Navigation.jsx`
- Footer → `Footer.jsx`

**Still TODO:**
- Graphics demo pages (JS and WASM)
- Admin page
- Docs page
- Update GitHub Pages deployment workflow

## Common Tasks

**Add a new page:**
1. Create component in `src/pages/`
2. Add route in `src/App.jsx`
3. Update Navigation links if needed

**Add a new CPU program:**
1. Create file in `src/lib/cpu/programs/`
2. Export as `window.PROGRAMS.yourProgram`
3. Will appear in dropdown automatically

**Update styles:**
- Global styles: `src/styles/*.css`
- Component-specific: inline `<style>` tags or CSS modules

**Debug animation issues:**
- Check browser console for `cpu:framechange` events
- Verify `AnimationEngine` is loaded in `useAnimationEngine` hook
- Check vanilla JS view classes are imported correctly

## Troubleshooting

**Build fails:**
- Check for import path errors (use absolute paths from `src/`)
- Verify all dependencies in package.json
- Check for syntax errors in JSX files

**Dev server not updating:**
- Check Vite config
- Clear cache: `rm -rf node_modules/.vite`
- Restart dev server

**WASM not loading:**
- Check MIME type in nginx.conf
- Verify WASM files copied to correct location in Dockerfile
- Check browser network tab for 404s

**Docker build fails:**
- Check context path in docker-compose.yml (should be `..`)
- Verify Dockerfile path: `docker/Dockerfile`
- Check .dockerignore isn't excluding needed files
