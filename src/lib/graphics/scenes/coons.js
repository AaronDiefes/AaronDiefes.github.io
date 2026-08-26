import { withArena } from '../arena.js'

/**
 * Coons patch. INTERACTIVE.
 *
 * One concept, and the most involved thing in the engine: four quadratic Bezier
 * boundary curves, with every interior point blended from them.
 *
 * All eight control points are draggable - four corners and the four edge midpoints -
 * because that is exactly what distinguishes a Coons patch from the quad next door.
 * With straight edges the two are indistinguishable; bow an edge and only this one
 * follows.
 *
 * Texture-only by construction: drawQuadraticCoons lowers to drawMesh passing nullptr
 * for colours, so the paint has to carry a shader.
 */

const TEXTURE = '/spock.png'
const W = 512
const H = 512

export default {
  id: 'coons',
  name: 'Coons patch',
  slug: 'coons',
  concepts: [
    'Four quadratic boundary curves; the interior is blended between them.',
    'Drag a midpoint to bow an edge — a flat quad cannot do this.',
  ],
  docsHref: '/projects/graphics-engine/docs/advanced-geometry#quad',
  size: { w: W, h: H },
  textures: [{ vfsPath: TEXTURE, url: '/projects/graphics-engine/spock.png' }],

  params: [
    { key: 'level', label: 'Subdivision level', type: 'range', min: 1, max: 12, step: 1, def: 8 },
    { key: 'outline', label: 'Boundary curves', type: 'choice', options: ['Hide', 'Show'], def: 'Show' },
  ],

  // Ring order: corner, edge midpoint, corner, edge midpoint, ... which is the order
  // drawQuadraticCoons expects its eight points in.
  handles: [
    { key: 'c0', label: 'Corner 1' }, { key: 'm0', label: 'Edge 1 midpoint' },
    { key: 'c1', label: 'Corner 2' }, { key: 'm1', label: 'Edge 2 midpoint' },
    { key: 'c2', label: 'Corner 3' }, { key: 'm2', label: 'Edge 3 midpoint' },
    { key: 'c3', label: 'Corner 4' }, { key: 'm3', label: 'Edge 4 midpoint' },
  ],
  initHandles: () => ({
    c0: { x: 96, y: 96 },  m0: { x: 256, y: 40 },
    c1: { x: 416, y: 96 }, m1: { x: 472, y: 256 },
    c2: { x: 416, y: 416 }, m2: { x: 256, y: 472 },
    c3: { x: 96, y: 416 }, m3: { x: 40, y: 256 },
  }),
  guide: (h) => [h.c0, h.m0, h.c1, h.m1, h.c2, h.m2, h.c3, h.m3, h.c0],

  draw(module, canvas, p, h) {
    withArena(module, (g) => {
      canvas.clear(1, 1, 1, 1)

      const ring = [h.c0, h.m0, h.c1, h.m1, h.c2, h.m2, h.c3, h.m3]
      const pts = g.vec(ring.flatMap((q) => [q.x, q.y]))
      const shader = g.shader(
        module.createBitmapShaderFromFile(TEXTURE, 1, 0, 0, 0, 1, 0, 0), 'bitmap')

      canvas.drawQuadraticCoons(pts, g.vec([0, 0, 391, 0, 391, 353, 0, 353]),
        p.level | 0, g.paint({ shader }))

      if (p.outline === 'Show') {
        // The four boundary quadratics, so it is obvious the edges are curves and not
        // a polygon through the same eight points.
        const t = 1.6
        for (let e = 0; e < 4; e++) {
          const a = ring[e * 2], m = ring[e * 2 + 1], b = ring[(e * 2 + 2) % 8]
          let prev = a
          for (let i = 1; i <= 24; i++) {
            const u = i / 24, w = 1 - u
            const q = {
              x: w * w * a.x + 2 * w * u * m.x + u * u * b.x,
              y: w * w * a.y + 2 * w * u * m.y + u * u * b.y,
            }
            const dx = q.x - prev.x, dy = q.y - prev.y
            const len = Math.hypot(dx, dy) || 1
            const nx = -dy / len * t, ny = dx / len * t
            canvas.drawConvexPolygon(g.vec([
              prev.x + nx, prev.y + ny, q.x + nx, q.y + ny,
              q.x - nx, q.y - ny, prev.x - nx, prev.y - ny,
            ]), 0.08, 0.10, 0.12, 0.7)
            prev = q
          }
        }
      }
    })
  },
}
