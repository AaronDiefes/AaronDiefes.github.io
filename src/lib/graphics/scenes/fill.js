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
  static: true,
  concepts: ['Convex polygons filled by the scanline rasterizer, stacked through save/restore.'],
  docsHref: '/projects/graphics-engine/docs/core-rendering#edge',
  size: { w: 512, h: 512 },
  params: [],
  handles: [],

  draw(module, canvas) {
    withArena(module, (g) => {
      canvas.clear(1, 1, 1, 1)
      const layers = 16
      for (let i = layers - 1; i >= 0; i--) {
        const sides = 3 + i
        const radius = 34 + i * (200 / (layers - 1))
        const c = PALETTE[i % PALETTE.length]
        canvas.save()
        canvas.translate(256, 256)
        canvas.rotate((18 * i * Math.PI) / 180)
        canvas.drawConvexPolygon(g.vec(polygonPoints(0, 0, radius, sides, 0)),
          c[0], c[1], c[2], 0.85)
        canvas.restore()
      }
    })
  },
}
