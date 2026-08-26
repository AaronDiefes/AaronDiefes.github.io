import { withArena } from '../arena.js'

/**
 * Gouraud-shaded mesh. INTERACTIVE.
 *
 * One concept: drawMesh interpolates vertex colours across a triangle barycentrically.
 * Dragging the vertices is the point - the colour field follows the geometry, which is
 * what tells you the interpolation is per-fragment rather than a fixed gradient.
 */

export default {
  id: 'mesh',
  name: 'Mesh shading',
  slug: 'mesh',
  concepts: ['drawMesh interpolating vertex colours across triangles.'],
  docsHref: '/projects/graphics-engine/docs/advanced-geometry#mesh',
  size: { w: 512, h: 512 },

  params: [
    { key: 'shape', label: 'Geometry', type: 'choice', options: ['Triangle', 'Two triangles'], def: 'Two triangles' },
  ],

  handles: [
    { key: 'a', label: 'Vertex 1' }, { key: 'b', label: 'Vertex 2' },
    { key: 'c', label: 'Vertex 3' }, { key: 'd', label: 'Vertex 4' },
  ],
  initHandles: () => ({
    a: { x: 96, y: 108 }, b: { x: 420, y: 82 },
    c: { x: 436, y: 424 }, d: { x: 84, y: 400 },
  }),

  draw(module, canvas, p, h) {
    withArena(module, (g) => {
      canvas.clear(1, 1, 1, 1)
      const pair = p.shape === 'Two triangles'
      const verts = pair
        ? [h.a.x, h.a.y, h.b.x, h.b.y, h.c.x, h.c.y, h.d.x, h.d.y]
        : [h.a.x, h.a.y, h.b.x, h.b.y, h.c.x, h.c.y]
      const colours = pair
        ? [0.92, 0.24, 0.26, 1, 0.96, 0.82, 0.22, 1, 0.16, 0.52, 0.78, 1, 0.28, 0.68, 0.36, 1]
        : [0.92, 0.24, 0.26, 1, 0.96, 0.82, 0.22, 1, 0.16, 0.52, 0.78, 1]
      const idx = pair ? [0, 1, 2, 0, 2, 3] : [0, 1, 2]
      canvas.drawMesh(g.vec(verts), g.vec(colours), g.vec([]), g.ivec(idx), g.paint())
    })
  },
}
