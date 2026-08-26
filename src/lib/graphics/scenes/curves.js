import { withArena } from '../arena.js'

/**
 * Bezier flattening. INTERACTIVE.
 *
 * One concept: the rasterizer only fills line segments, so a curve is flattened
 * first, and the engine picks how many segments from the curve's own error vector.
 * Dragging the control points is the lesson - a flatter curve visibly emits fewer
 * segments, a tighter one more.
 */

export default {
  id: 'curves',
  name: 'Curves',
  slug: 'curves',
  concepts: ['Curves are flattened to line segments; the count comes from the curve’s error vector.'],
  docsHref: '/projects/graphics-engine/docs/advanced-geometry#bezier',
  size: { w: 512, h: 512 },

  params: [
    { key: 'show', label: 'Emitted segments', type: 'choice', options: ['Hide', 'Show'], def: 'Show' },
  ],

  handles: [
    { key: 'a', label: 'Start' }, { key: 'b', label: 'Control 1' },
    { key: 'c', label: 'Control 2' }, { key: 'd', label: 'End' },
  ],
  initHandles: () => ({
    a: { x: 60, y: 330 }, b: { x: 180, y: 90 },
    c: { x: 350, y: 400 }, d: { x: 460, y: 150 },
  }),
  guide: (h) => [h.a, h.b, h.c, h.d],

  draw(module, canvas, p, h) {
    withArena(module, (g) => {
      canvas.clear(1, 1, 1, 1)

      const width = 46
      const path = g.path()
      path.moveTo(h.a.x, h.a.y)
      path.cubicTo(h.b.x, h.b.y, h.c.x, h.c.y, h.d.x, h.d.y)
      path.lineTo(h.d.x, h.d.y + width)
      path.cubicTo(h.c.x, h.c.y + width, h.b.x, h.b.y + width, h.a.x, h.a.y + width)
      const shader = g.shader(module.createLinearGradient(
        h.a.x, h.a.y, h.d.x, h.d.y,
        g.vec([0.11, 0.34, 0.19, 1, 0.44, 0.78, 0.53, 1]), 0), 'ribbon')
      canvas.drawPathWithPaint(path, g.paint({ shader }))

      if (p.show === 'Show') {
        // Mirror the engine's own rule so the marks land where it actually splits.
        const e0 = { x: h.a.x - 2 * h.b.x + h.c.x, y: h.a.y - 2 * h.b.y + h.c.y }
        const e1 = { x: h.b.x - 2 * h.c.x + h.d.x, y: h.b.y - 2 * h.c.y + h.d.y }
        const magE = Math.hypot(Math.max(Math.abs(e0.x), Math.abs(e1.x)),
                                Math.max(Math.abs(e0.y), Math.abs(e1.y)))
        const segs = Math.ceil(Math.sqrt(3 * magE * 16))
        const pts = []
        for (let i = 0; i <= segs; i++) {
          const u = i / segs, m = 1 - u
          pts.push({
            x: m * m * m * h.a.x + 3 * m * m * u * h.b.x + 3 * m * u * u * h.c.x + u * u * u * h.d.x,
            y: m * m * m * h.a.y + 3 * m * m * u * h.b.y + 3 * m * u * u * h.c.y + u * u * u * h.d.y,
          })
        }
        // Alternating colours so individual segments stay countable rather than
        // merging into one indistinct band.
        const T = 5
        for (let i = 0; i < segs; i++) {
          const p0 = pts[i], p1 = pts[i + 1]
          const dx = p1.x - p0.x, dy = p1.y - p0.y
          const len = Math.hypot(dx, dy) || 1
          const nx = -dy / len * T, ny = dx / len * T
          const odd = i % 2
          canvas.drawConvexPolygon(
            g.vec([p0.x + nx, p0.y + ny, p1.x + nx, p1.y + ny,
                   p1.x - nx, p1.y - ny, p0.x - nx, p0.y - ny]),
            odd ? 0.97 : 0.09, odd ? 0.47 : 0.11, odd ? 0.15 : 0.10, 1)
        }
      }
    })
  },
}
