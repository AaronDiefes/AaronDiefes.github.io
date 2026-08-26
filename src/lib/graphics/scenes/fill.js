import { withArena, polygonPoints } from '../arena.js'

/**
 * Convex polygon fill. STATIC.
 *
 * One concept: the scanline rasterizer filling convex polygons, layer over layer,
 * through the CTM save/restore stack. The composition is fixed because there is
 * nothing here a visitor could usefully change - the point is the fill itself.
 */

const PALETTE = [
  [0.60, 0.90, 0.70], [0.30, 0.20, 0.70], [0.50, 0.90, 0.50],
  [0.40, 0.30, 0.80], [0.90, 0.30, 0.80], [0.90, 0.90, 0.30],
  [0.20, 0.80, 0.80], [1.00, 0.60, 0.70], [0.80, 0.30, 0.40],
]

export default {
  id: 'fill',
  name: 'Convex fill',
  slug: 'fill',
  concepts: ['Convex polygons filled by the scanline rasterizer, stacked through save/restore.'],
  docsHref: '/projects/graphics-engine/docs/core-rendering#edge',
  size: { w: 512, h: 512 },
  handles: [],

  params: [
    { key: 'shapes', label: 'Shapes', type: 'range', min: 1, max: 40, step: 1, def: 16 },
    { key: 'sides', label: 'Sides of the innermost', type: 'range', min: 3, max: 12, step: 1, def: 3 },
    { key: 'alpha', label: 'Opacity', type: 'range', min: 20, max: 100, step: 1, def: 85,
      format: (v) => (v / 100).toFixed(2) },
  ],

  draw(module, canvas, p) {
    withArena(module, (g) => {
      canvas.clear(1, 1, 1, 1)
      const layers = p.shapes | 0
      const alpha = p.alpha / 100
      const first = p.sides | 0
      for (let i = layers - 1; i >= 0; i--) {
        // Each ring gains a side, so the innermost is the simplest polygon the
        // rasterizer can fill and the outermost approaches a circle.
        const sides = first + i
        const radius = layers === 1 ? 200 : 34 + i * (200 / (layers - 1))
        const c = PALETTE[i % PALETTE.length]
        canvas.save()
        canvas.translate(256, 256)
        canvas.rotate((18 * i * Math.PI) / 180)
        canvas.drawConvexPolygon(g.vec(polygonPoints(0, 0, radius, sides, 0)),
          c[0], c[1], c[2], alpha)
        canvas.restore()
      }
    })
  },
}
