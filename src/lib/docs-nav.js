// Single source of truth for project documentation structure.
// Consumed by Navigation (Projects dropdown), DocsSidebar, DocsLayout (prev/next),
// and the three docs landing pages (card grids).

export const DOCS_NAV = {
  cpu: {
    key: 'cpu',
    label: 'CPU Simulator',
    shortLabel: 'CPU',
    landingHref: '/projects/cpu/docs',
    demoHref: '/projects/cpu/demo',
    pages: [
      { slug: 'alu', label: 'ALU Design', href: '/projects/cpu/docs/alu',
        description: 'Carry-Lookahead adder, arithmetic and logic operations' },
      { slug: 'regfile', label: 'Register File', href: '/projects/cpu/docs/regfile',
        description: '32 registers, dual read ports, $0 hardwired to zero' },
      { slug: 'multdiv', label: 'Multiplication & Division', href: '/projects/cpu/docs/multdiv',
        description: "Booth's algorithm, 2-layer implementation" },
      { slug: 'pipeline', label: 'Pipeline Architecture', href: '/projects/cpu/docs/pipeline',
        description: '5-stage pipeline, datapath design' },
      { slug: 'hazards', label: 'Hazards & Forwarding', href: '/projects/cpu/docs/hazards',
        description: 'Data hazards, forwarding paths, stall logic' },
      { slug: 'instructions', label: 'Instruction Set', href: '/projects/cpu/docs/instructions',
        description: 'Complete instruction reference with encoding formats' },
      { slug: 'memory', label: 'Memory System', href: '/projects/cpu/docs/memory',
        description: 'RAM, ROM, instruction and data memory' }
    ]
  },

  graphics: {
    key: 'graphics',
    label: 'Graphics Engine',
    shortLabel: 'Graphics',
    landingHref: '/projects/graphics-engine/docs',
    demoHref: '/projects/graphics-engine/demo',
    pages: [
      { slug: 'core-rendering', label: 'Core Rendering',
        href: '/projects/graphics-engine/docs/core-rendering',
        description: 'Edge rasterization, shape drawing, Porter-Duff blend modes, polygon clipping' },
      { slug: 'transforms-textures', label: 'Transformations & Textures',
        href: '/projects/graphics-engine/docs/transforms-textures',
        description: 'Matrix math, CTM stack, bitmap shader with tile modes' },
      { slug: 'paths-gradients', label: 'Paths & Gradients',
        href: '/projects/graphics-engine/docs/paths-gradients',
        description: 'GPath construction, winding fill, linear and radial gradients' },
      { slug: 'advanced-geometry', label: 'Advanced Geometry',
        href: '/projects/graphics-engine/docs/advanced-geometry',
        description: 'Bezier curves, triangle meshes, quad rendering, shader composition' },
      { slug: 'final-features', label: 'Final Features',
        href: '/projects/graphics-engine/docs/final-features',
        description: 'Sweep gradient, color matrix, stroke polygon, Coons patches' },
      { slug: 'optimization-performance', label: 'Optimization & Performance',
        href: '/projects/graphics-engine/docs/optimization-performance',
        description: 'Fixed-point division, blend fast paths, static dispatch, memory access patterns' }
    ]
  },

  uber: {
    key: 'uber',
    label: 'Uber Algorithmic System',
    shortLabel: 'Uber',
    landingHref: '/projects/uber/docs',
    // No demo route for Uber; landing is the entry point.
    demoHref: null,
    pages: [
      { slug: 'algorithm', label: 'Algorithm Evolution', href: '/projects/uber/docs/algorithm',
        description: "T1-T5 progressive optimization from brute force to spatial indexing with KD-trees and Dijkstra's pathfinding. Includes performance analysis with D1/D2 metrics and comparison graphs." },
      { slug: 'kdtree', label: 'KD-Tree', href: '/projects/uber/docs/kdtree',
        description: 'Spatial indexing data structure for O(log n) nearest-neighbor queries on driver/passenger locations.' },
      { slug: 'pathfinding', label: 'Pathfinding', href: '/projects/uber/docs/pathfinding',
        description: "Dijkstra's algorithm on road networks for shortest-path route computation." },
      { slug: 'bonus', label: 'Bonus Algorithms', href: '/projects/uber/docs/bonus',
        description: 'B1-B4 advanced optimizations exploring workload balancing, traffic-aware routing, and path caching strategies with real simulation results.' }
    ]
  }
}

// Lookup helpers

export function getProject(projectKey) {
  return DOCS_NAV[projectKey] || null
}

export function getSiblingNav(projectKey, currentSlug) {
  const project = DOCS_NAV[projectKey]
  if (!project) return { prev: null, next: null, landing: null }
  const idx = project.pages.findIndex(p => p.slug === currentSlug)
  return {
    prev: idx > 0 ? project.pages[idx - 1] : null,
    next: idx >= 0 && idx < project.pages.length - 1 ? project.pages[idx + 1] : null,
    landing: { label: `Back to ${project.label} Docs`, href: project.landingHref }
  }
}
