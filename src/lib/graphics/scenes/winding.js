import { withArena, starPoints } from '../arena.js'

/**
 * Nonzero winding. INTERACTIVE.
 *
 * One concept, and it only exists as a difference: an inner subpath wound the same
 * way as the outer one adds to the winding number and fills solid; wound the other
 * way it cancels and leaves a hole. A toggle is the honest control here - there is
 * no continuum, just the two cases side by side in time.
 */

export default {
  id: 'winding',
  name: 'Winding',
  slug: 'winding',
  concepts: ['The nonzero winding rule: reverse a subpath and the fill becomes a hole.'],
  docsHref: '/projects/graphics-engine/docs/paths-gradients#winding',
  size: { w: 512, h: 512 },
  handles: [],

  params: [
    { key: 'direction', label: 'Inner subpath', type: 'choice',
      options: ['Same winding', 'Reversed'], def: 'Reversed' },
    { key: 'points', label: 'Star points', type: 'range', min: 3, max: 12, step: 1, def: 5 },
  ],

  draw(module, canvas, p) {
    withArena(module, (g) => {
      canvas.clear(1, 1, 1, 1)
      const reversed = p.direction === 'Reversed'
      const n = p.points | 0
      const path = g.path()
      path.addPolygon(g.vec(starPoints(256, 256, 200, 88, n, -Math.PI / 2)))
      path.addPolygon(g.vec(starPoints(256, 256, 116, 51, n, -Math.PI / 2, reversed)))
      canvas.drawPathWithPaint(path, g.paint({ color: [0.13, 0.20, 0.42] }))
    })
  },
}
