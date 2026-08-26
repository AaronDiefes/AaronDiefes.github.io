import { withArena } from '../arena.js'

/**
 * Coons patch. STATIC.
 *
 * One concept, and the most involved thing in the engine: four quadratic boundary
 * curves with the interior filled by blending them. It was unreachable from JS until
 * the bindings were extended, so this is its first appearance anywhere on the site.
 *
 * Static because it is a showpiece, and because the implementation lowers to drawMesh
 * with null colours - it needs a texture, so there is no colour knob to offer, and
 * dragging the eight control points would mostly produce folded-over messes.
 */

const TEXTURE = '/spock.png'

export default {
  id: 'coons',
  name: 'Coons patch',
  slug: 'coons',
  static: true,
  concepts: ['Four quadratic boundary curves, interior filled by blending them.'],
  docsHref: '/projects/graphics-engine/docs/advanced-geometry#quad',
  size: { w: 512, h: 512 },
  textures: [{ vfsPath: TEXTURE, url: '/projects/graphics-engine/spock.png' }],
  params: [],
  handles: [],

  draw(module, canvas) {
    withArena(module, (g) => {
      canvas.clear(1, 1, 1, 1)
      // Corner, edge-midpoint, corner, edge-midpoint... around the ring. The midpoints
      // are pushed out along each edge normal to bow the boundaries.
      const c = [
        { x: 96, y: 96 }, { x: 416, y: 96 }, { x: 416, y: 416 }, { x: 96, y: 416 },
      ]
      const bow = 0.34
      const pts = []
      for (let i = 0; i < 4; i++) {
        const a = c[i], b = c[(i + 1) % 4]
        const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2
        const dx = b.x - a.x, dy = b.y - a.y
        pts.push(a.x, a.y)
        pts.push(mx - dy * bow * 0.5, my + dx * bow * 0.5)
      }
      const shader = g.shader(
        module.createBitmapShaderFromFile(TEXTURE, 1, 0, 0, 0, 1, 0, 0), 'bitmap')
      canvas.drawQuadraticCoons(g.vec(pts), g.vec([0, 0, 391, 0, 391, 353, 0, 353]),
        8, g.paint({ shader }))
    })
  },
}
