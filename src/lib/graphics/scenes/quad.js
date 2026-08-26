import { withArena } from '../arena.js'

/**
 * Patch subdivision. INTERACTIVE.
 *
 * One concept: drawQuad takes four corners and refines them into a (level+1)² grid,
 * interpolating position and colour bilinearly at every grid point, then emitting two
 * triangles per cell.
 *
 * The lesson is the refinement, so the grid itself is drawn over the patch. At level 1
 * you can count four cells and see the flat triangle facets; raise it and both the
 * facets and the grid converge toward a smooth field. Without the overlay this demo
 * looked like the mesh demo with a slider.
 *
 * Capped at 14: cost grows with the square of the level.
 */

const W = 512
const H = 512

export default {
  id: 'quad',
  name: 'Patch subdivision',
  slug: 'quad',
  concepts: [
    'drawQuad refines four corners into a (level+1)² grid.',
    'Position and colour are interpolated bilinearly at every grid point.',
  ],
  docsHref: '/projects/graphics-engine/docs/advanced-geometry#quad',
  size: { w: W, h: H },

  params: [
    { key: 'level', label: 'Subdivision level', type: 'range', min: 1, max: 14, step: 1, def: 2 },
    { key: 'grid', label: 'Subdivision grid', type: 'choice', options: ['Hide', 'Show'], def: 'Show' },
  ],

  handles: [
    { key: 'p0', label: 'Corner 1' }, { key: 'p1', label: 'Corner 2' },
    { key: 'p2', label: 'Corner 3' }, { key: 'p3', label: 'Corner 4' },
  ],
  initHandles: () => ({
    p0: { x: 92, y: 104 }, p1: { x: 424, y: 76 },
    p2: { x: 440, y: 430 }, p3: { x: 76, y: 408 },
  }),
  guide: (h) => [h.p0, h.p1, h.p2, h.p3, h.p0],

  draw(module, canvas, p, h) {
    withArena(module, (g) => {
      canvas.clear(1, 1, 1, 1)
      const level = p.level | 0

      canvas.drawQuad(
        g.vec([h.p0.x, h.p0.y, h.p1.x, h.p1.y, h.p2.x, h.p2.y, h.p3.x, h.p3.y]),
        g.vec([0.92, 0.24, 0.26, 1, 0.96, 0.82, 0.22, 1,
               0.16, 0.52, 0.78, 1, 0.28, 0.68, 0.36, 1]),
        g.vec([]),
        level,
        g.paint())

      if (p.grid === 'Show') {
        // The same bilinear interpolation drawQuad performs internally, so the overlay
        // lands exactly on the cell boundaries it is describing.
        const at = (u, v) => ({
          x: (1 - u) * (1 - v) * h.p0.x + u * (1 - v) * h.p1.x + u * v * h.p2.x + (1 - u) * v * h.p3.x,
          y: (1 - u) * (1 - v) * h.p0.y + u * (1 - v) * h.p1.y + u * v * h.p2.y + (1 - u) * v * h.p3.y,
        })
        const n = level + 1
        const t = 0.9
        const line = (a, b) => {
          const dx = b.x - a.x, dy = b.y - a.y
          const len = Math.hypot(dx, dy) || 1
          const nx = -dy / len * t, ny = dx / len * t
          canvas.drawConvexPolygon(g.vec([
            a.x + nx, a.y + ny, b.x + nx, b.y + ny,
            b.x - nx, b.y - ny, a.x - nx, a.y - ny,
          ]), 0.08, 0.09, 0.11, 0.5)
        }
        for (let i = 0; i <= n; i++) {
          const f = i / n
          for (let j = 0; j < n; j++) {
            line(at(f, j / n), at(f, (j + 1) / n))
            line(at(j / n, f), at((j + 1) / n, f))
          }
        }
      }
    })
  },
}
