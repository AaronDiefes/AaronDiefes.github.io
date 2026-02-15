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

### Graphics Engine (Coming Soon)

C++ 2D graphics engine compiled to WebAssembly featuring:
- Real-time shape rendering
- Matrix transformations
- Porter-Duff blend modes
- Shader system (gradients, textures)
- Bezier curves and mesh rendering

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
