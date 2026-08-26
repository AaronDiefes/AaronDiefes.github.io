import { withArena, starPoints } from '../arena.js'

/**
 * Nonzero winding. INTERACTIVE.
 *
 * One concept, and it only exists as a difference: a subpath wound the same way as the
 * one outside it adds to the winding number and stays filled; wound the other way it
 * cancels and cuts a hole.
 *
 * The previous version showed one star with one inner subpath - correct, but a single
 * flat shape in two colours. Here the ring count is a control, so alternating direction
 * produces a set of concentric bands and the rule is visible as a pattern rather than
 * asserted in a caption. Set every ring the same direction and the whole thing fills
 * solid, which is the other half of the lesson.
 */

const W = 512
const H = 512

export default {
  id: 'winding',
  name: 'Winding',
  slug: 'winding',
  concepts: [
    'The nonzero winding rule: reverse a subpath and its area becomes a hole.',
    'One path, many subpaths — the rule decides what is inside.',
  ],
  docsHref: '/projects/graphics-engine/docs/paths-gradients#winding',
  size: { w: W, h: H },
  handles: [],

  params: [
    { key: 'direction', label: 'Alternate subpaths', type: 'choice',
      options: ['Same winding', 'Reversed'], def: 'Reversed' },
    { key: 'rings', label: 'Nested subpaths', type: 'range', min: 1, max: 8, step: 1, def: 5 },
    { key: 'points', label: 'Star points', type: 'range', min: 3, max: 12, step: 1, def: 5 },
    { key: 'sharpness', label: 'Sharpness', type: 'range', min: 20, max: 80, step: 1, def: 44,
      format: (v) => (v / 100).toFixed(2) },
  ],

  draw(module, canvas, p) {
    withArena(module, (g) => {
      canvas.clear(1, 1, 1, 1)

      const rings = p.rings | 0
      const points = p.points | 0
      const inner = p.sharpness / 100
      const alternate = p.direction === 'Reversed'

      const path = g.path()
      for (let i = 0; i < rings; i++) {
        const scale = 1 - i * (0.82 / rings)
        // Every other subpath runs backwards, so its winding cancels the one outside it.
        const reversed = alternate && i % 2 === 1
        path.addPolygon(g.vec(starPoints(
          W / 2, H / 2, 226 * scale, 226 * scale * inner, points, -Math.PI / 2, reversed)))
      }

      // A gradient rather than a flat fill: the holes read as holes because the
      // background shows through them, which is easier to see against a varying colour.
      const shader = g.shader(module.createLinearGradient(
        70, 70, 442, 442,
        g.vec([0.10, 0.22, 0.48, 1, 0.16, 0.52, 0.62, 1, 0.85, 0.36, 0.22, 1]), 0), 'fill')
      canvas.drawPathWithPaint(path, g.paint({ shader }))
    })
  },
}
