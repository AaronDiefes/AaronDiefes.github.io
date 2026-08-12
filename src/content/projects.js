/**
 * The three portfolio projects.
 *
 * Descriptions are deliberately neutral third person. First person is reserved
 * for the bio in profile.js - that split is what professional engineering
 * portfolios consistently do.
 *
 * `metrics` replaces the six-bullet feature lists the cards used to carry. The
 * lists were the reason all three cards read identically; three hard numbers
 * are retained by a reader in a way bullets are not. Every number below is
 * verifiable from the project or its documentation.
 *
 * Routes are kept in sync with src/lib/docs-nav.js, which owns the docs
 * structure; only the landing and demo entry points are repeated here.
 */

export const PROJECTS = [
  {
    key: 'graphics',
    kind: 'Systems / Graphics',
    title: '2D Graphics Engine',
    description:
      'A software rasterizer written in C++17 and compiled to WebAssembly. No GPU and no canvas drawing calls — the engine computes every pixel itself, then hands the finished buffer to the browser.',
    metrics: [
      { value: '12', label: 'Blend modes' },
      { value: '132 KB', label: 'WASM binary' },
      { value: '35', label: 'Rendered tests' },
    ],
    tech: ['C++17', 'WebAssembly', 'Emscripten'],
    media: {
      type: 'image',
      src: '/projects/home/graphics-blend-matrix.webp',
      alt: 'A matrix of gradient squares, each rendered with a different Porter-Duff blend mode',
      caption: '12 blend modes · software rasterized · 512² reference render',
    },
    demoHref: '/projects/graphics-engine/demo',
    demoLabel: 'Run the engine',
    docsHref: '/projects/graphics-engine/docs',
    docsCount: 6,
    repo: 'https://github.com/AaronDiefes/graphics-engine-2d',
  },
  {
    key: 'cpu',
    kind: 'Computer architecture',
    title: '32-bit CPU',
    description:
      'A 32-bit RISC processor built from the ground up in Verilog HDL, implementing a subset of the MIPS instruction set with a full five-stage pipeline, hazard detection and data forwarding.',
    metrics: [
      { value: '5', label: 'Pipeline stages' },
      { value: '32', label: 'Registers' },
      { value: '7', label: 'Deep dives' },
    ],
    tech: ['Verilog', 'RISC', 'Pipelining'],
    /* Drawn as an inline SVG rather than a bitmap: the datapath is generated at
       runtime inside the simulator, so no static render of it exists in the
       repo. See components/home/CpuDatapathFigure.jsx. */
    media: {
      type: 'cpu-datapath',
      caption: '5-stage datapath · hazard detection · data forwarding',
    },
    demoHref: '/projects/cpu/demo',
    demoLabel: 'Step through the pipeline',
    docsHref: '/projects/cpu/docs',
    docsCount: 7,
    repo: 'https://github.com/AaronDiefes/CPU',
  },
  {
    key: 'uber',
    kind: 'Case study',
    title: 'Ride-matching algorithms',
    description:
      'An algorithm design case study: a rider–driver matching system taken through five progressive rewrites, from brute force to KD-tree spatial indexing with Dijkstra pathfinding, benchmarked at every step.',
    metrics: [
      { value: '10,000', label: 'Passengers' },
      { value: 'O(log n)', label: 'KD-tree query' },
      { value: '5–7×', label: 'Speedup' },
    ],
    tech: ['Python', 'KD-trees', 'Dijkstra'],
    media: {
      type: 'image-pair',
      images: [
        {
          src: '/projects/home/uber-t1-metrics.webp',
          alt: 'Scatter plot of D1 and D2 metrics for the brute-force T1 implementation',
        },
        {
          src: '/projects/home/uber-t5-metrics.webp',
          alt: 'Scatter plot of D1 and D2 metrics for the optimised T5 implementation',
        },
      ],
      caption: 'T1 brute force → T5 optimized · 10,000-passenger dataset',
    },
    /* No demo route exists for this project. */
    demoHref: null,
    docsHref: '/projects/uber/docs',
    docsCount: 4,
    repo: 'https://github.com/AaronDiefes/cs330-case-study',
  },
]

export default PROJECTS
