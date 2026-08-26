import { withArena } from '../arena.js'

/**
 * Patch subdivision. INTERACTIVE.
 *
 * One concept: drawQuad subdivides a four-corner patch into a (level+1)^2 grid and
 * interpolates bilinearly at every grid point. The slider is the lesson - at level 1
 * the patch is visibly two flat triangles, and you can watch it converge.
 *
 * Capped at 14: cost grows with the square of the level, and beyond that the render
 * stops feeling immediate while dragging.
 */

export default {
  id: 'quad',
  name: 'Patch subdivision',
  slug: 'quad',
  concepts: ['drawQuad refining a four-corner patch into a (level+1)² grid.'],
  docsHref: '/projects/graphics-engine/docs/advanced-geometry#quad',
  size: { w: 512, h: 512 },

  params: [
    { key: 'level', label: 'Subdivision level', type: 'range', min: 1, max: 14, step: 1, def: 2 },
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
      canvas.drawQuad(
        g.vec([h.p0.x, h.p0.y, h.p1.x, h.p1.y, h.p2.x, h.p2.y, h.p3.x, h.p3.y]),
        g.vec([0.92, 0.24, 0.26, 1, 0.96, 0.82, 0.22, 1,
               0.16, 0.52, 0.78, 1, 0.28, 0.68, 0.36, 1]),
        g.vec([]),
        p.level | 0,
        g.paint())
    })
  },
}
