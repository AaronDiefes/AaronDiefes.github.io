import { withArena, polygonPoints } from '../arena.js'

/**
 * The transform stack. INTERACTIVE.
 *
 * One concept: what the CTM can do to a shape. Rotate and scale have obvious
 * effects, but `concat` is the only way to express a shear - so the slider drives
 * an arbitrary affine, and sweeping it is the whole lesson.
 */

export default {
  id: 'transforms',
  name: 'Transforms',
  slug: 'transforms',
  concepts: ['translate, rotate and scale, plus concat for the shear they cannot express.'],
  docsHref: '/projects/graphics-engine/docs/transforms-textures',
  size: { w: 512, h: 512 },
  handles: [],

  params: [
    { key: 'shear', label: 'Shear (concat)', type: 'range', min: -80, max: 80, step: 1, def: 30,
      format: (v) => (v / 100).toFixed(2) },
    { key: 'spin', label: 'Rotation', type: 'range', min: 0, max: 90, step: 1, def: 22,
      format: (v) => `${v}°` },
    { key: 'squash', label: 'Scale Y', type: 'range', min: 30, max: 130, step: 1, def: 100,
      format: (v) => (v / 100).toFixed(2) },
  ],

  draw(module, canvas, p) {
    withArena(module, (g) => {
      canvas.clear(1, 1, 1, 1)
      const k = p.shear / 100
      const cols = 4, rows = 4
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const t = (r * cols + c) / (rows * cols - 1)
          canvas.save()
          canvas.translate(74 + c * 121, 74 + r * 121)
          canvas.rotate((p.spin * Math.PI / 180) * t)
          canvas.scale(1, p.squash / 100)
          // Matrix order is (a, c, e, b, d, f); `c` carries the shear.
          canvas.concat(1, k * t, 0, 0, 1, 0)
          canvas.drawConvexPolygon(g.vec(polygonPoints(0, 0, 44, 4, Math.PI / 4)),
            0.12 + t * 0.7, 0.35, 0.55 - t * 0.3, 1)
          canvas.restore()
        }
      }
    })
  },
}
