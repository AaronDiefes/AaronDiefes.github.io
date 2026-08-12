/**
 * Technical skills, grouped and written as running prose rather than a badge
 * cloud. Prose carries far more information per square inch and reads senior;
 * a six-pill cloud undersells three systems projects.
 *
 * Everything here is evidenced by the projects or their documentation - hence
 * the `evidence` link on most groups, which points at the write-up that proves
 * the claim. Nothing is listed that the repository does not demonstrate.
 *
 * Deliberately absent: WebGL. The string appears nowhere in this codebase -
 * the graphics demo uses canvas 2D to blit a pixel buffer produced by the WASM
 * module. Claiming it would be an avoidable interview risk, and the software
 * rasterizer is the stronger claim anyway.
 */

export const SKILL_GROUPS = [
  {
    title: 'Languages',
    body: 'C++ (C++17), Python, JavaScript, Verilog HDL, HTML and CSS.',
  },
  {
    title: 'Systems and low-level',
    body: 'WebAssembly via the Emscripten toolchain, C++/JS interop bindings, manual pixel-buffer memory layout, virtual filesystems, PNG decoding, Makefile builds.',
    evidence: { label: 'Optimization & Performance', href: '/projects/graphics-engine/docs/optimization-performance' },
  },
  {
    title: 'Computer architecture',
    body: "Five-stage RISC pipeline, carry-lookahead ALU, Booth's algorithm for multiply and divide, a 32-entry register file with dual read ports, hazard detection, data-forwarding paths, instruction encoding, RAM/ROM design.",
    evidence: { label: 'Hazards & Forwarding', href: '/projects/cpu/docs/hazards' },
  },
  {
    title: 'Graphics and rendering',
    body: 'Scanline rasterization with edge lists, Porter-Duff compositing, affine transforms with a CTM stack, polygon clipping, linear and sweep gradient shaders, bitmap texturing, quadratic and cubic Béziers, mesh rendering.',
    evidence: { label: 'Core Rendering', href: '/projects/graphics-engine/docs/core-rendering' },
  },
  {
    title: 'Algorithms and concurrency',
    body: "KD-tree spatial indexing, Dijkstra's algorithm over road networks, priority queues, asymptotic analysis, empirical benchmarking on 10,000-record datasets, fork-based multiprocessing.",
    evidence: { label: 'KD-Trees', href: '/projects/uber/docs/kdtree' },
  },
  {
    title: 'Web and tooling',
    body: 'React 18, React Router, Vite, Canvas 2D, SVG visualization, design systems, WCAG AA contrast and keyboard navigation, Git, GitHub Actions, Docker, Nginx.',
  },
]

export default SKILL_GROUPS
