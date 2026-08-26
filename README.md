# Aaron Diefes Portfolio

Personal portfolio website showcasing software engineering projects, including an interactive CPU simulator and a C++ 2D graphics engine compiled to WebAssembly.

**Live Site:** https://aarondiefes.github.io/

## Technology Stack

- **React 18** - UI framework
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **Vanilla JS** - Core CPU simulation logic
- **WebAssembly** - C++ graphics engine (Emscripten)
- **Docker + Nginx** - Production deployment

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Docker

```bash
cd docker
docker-compose build
docker-compose up
# Visit http://localhost:8080
```

## Project Structure

```
src/
├── pages/              # Page components (HomePage, CPUSimulatorPage, etc.)
├── components/         # Reusable React components
│   ├── shared/         # Navigation, Footer
│   ├── cpu/            # CPU simulator components
│   └── graphics/       # Graphics engine components
├── lib/                # Vanilla JS modules (CPU core logic)
├── hooks/              # Custom React hooks
├── styles/             # Global CSS files
└── assets/             # Static assets (WASM, images)
```

## Features

### CPU Simulator

Interactive visualization of a 5-stage pipelined MIPS processor with:
- Step-by-step instruction execution
- SVG block diagram showing datapath
- Register and memory state visualization
- Multiple example programs (basic instructions, Fibonacci)
- Playback controls with variable speed

### Graphics Engine

A software rasterizer written in C++17 and compiled to WebAssembly. No GPU and no
canvas drawing calls: the engine computes every pixel itself, then hands the finished
buffer to the browser.

Twelve demos at `/projects/graphics-engine/demo`, one engine concept each — some fixed
renders, some you can drive:
- Scanline fill of convex polygons and the CTM stack, including arbitrary affines
- Nonzero winding, and curves flattened by a curvature-adaptive rule
- All twelve Porter-Duff blend modes
- Five gradient shaders across three tile modes
- Nearest and bilinear texture sampling, and shaders composed from other shaders
- Gouraud meshes, bilinear patch subdivision, and Coons patches

The C++ source lives in `graphics-engine-src/` and is built with Emscripten — see
`CLAUDE.md` for the toolchain notes and the parity check that guards a rebuild.

## Development

See [CLAUDE.md](./CLAUDE.md) for detailed architecture documentation, component patterns, and development guidelines.

## Deployment

### GitHub Pages

```bash
npm run build
# Deploy dist/ to gh-pages branch
```

### Docker

Multi-stage Dockerfile builds the React app and serves it with Nginx.

```bash
cd docker
docker-compose up -d
```

## License

© 2026 Aaron Diefes. All rights reserved.
