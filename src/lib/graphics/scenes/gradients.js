import { withArena, polygonPoints } from '../arena.js'

/**
 * Gradient shaders. INTERACTIVE.
 *
 * One concept: the engine implements five different gradient shaders and three tile
 * modes. Switching between them is the only way to see that they differ - and two of
 * them (nonlinear, linearPos) are indistinguishable from a plain linear gradient until
 * you move the middle stop, which is why that slider exists.
 */

const STOPS = [
  [0.96, 0.29, 0.16, 1],
  [0.94, 0.84, 0.22, 1],
  [0.12, 0.45, 0.72, 1],
]
const TILE = { Clamp: 0, Repeat: 1, Mirror: 2 }

export default {
  id: 'gradients',
  name: 'Gradients',
  slug: 'gradients',
  concepts: ['Five gradient shaders across three tile modes.'],
  docsHref: '/projects/graphics-engine/docs/paths-gradients#linear',
  size: { w: 512, h: 512 },
  handles: [],

  params: [
    { key: 'kind', label: 'Shader', type: 'choice',
      options: ['Linear', 'Radial', 'Sweep', 'Nonlinear', 'LinearPos'], def: 'Radial' },
    { key: 'tile', label: 'Tile mode', type: 'choice', options: ['Clamp', 'Repeat', 'Mirror'],
      def: 'Clamp',
      // Sweep wraps a full turn; it has nothing to tile.
      when: (p) => p.kind !== 'Sweep' },
    { key: 'shape', label: 'Filled shape', type: 'choice',
      options: ['Rectangle', 'Polygon'], def: 'Rectangle' },
    { key: 'stop', label: 'Middle stop', type: 'range', min: 2, max: 98, step: 1, def: 50,
      format: (v) => (v / 100).toFixed(2),
      // Only the two stop-position shaders read this.
      when: (p) => p.kind === 'Nonlinear' || p.kind === 'LinearPos' },
  ],

  draw(module, canvas, p) {
    withArena(module, (g) => {
      canvas.clear(1, 1, 1, 1)
      const colors = g.vec(STOPS.flat())
      const tile = TILE[p.tile]
      const mid = p.stop / 100
      const cx = 256, cy = 256

      let shader
      switch (p.kind) {
        case 'Radial':
          shader = g.shader(module.createRadialGradient(cx, cy, 190, colors, tile), 'radial')
          break
        case 'Sweep': {
          // The ramp has to return to its first colour or the wheel shows a hard seam
          // where 360 degrees meets 0.
          const wrapped = g.vec([...STOPS.flat(), ...STOPS[0]])
          shader = g.shader(module.createAngleGradient(cx, cy, 460, cy, wrapped), 'sweep')
          break
        }
        case 'Nonlinear':
          shader = g.shader(module.createNonlinearGradient(
            70, cy, 442, cy, colors, g.vec([0, mid, 1]), tile), 'nonlinear')
          break
        case 'LinearPos':
          shader = g.shader(module.createLinearPosGradient(
            70, cy, 442, cy, colors, g.vec([0, mid, 1])), 'linearPos')
          break
        default:
          shader = g.shader(module.createLinearGradient(70, cy, 442, cy, colors, tile), 'linear')
      }
      const paint = g.paint({ shader })
      if (p.shape === 'Polygon') {
        // drawConvexPolygonWithPaint: a polygon filled by a shader, not a colour.
        canvas.drawConvexPolygonWithPaint(g.vec(polygonPoints(cx, cy, 232, 7, -Math.PI / 2)), paint)
      } else {
        canvas.drawRectWithPaint(0, 0, 512, 512, paint)
      }
    })
  },
}
