import { withArena } from '../arena.js'

/**
 * Triangle meshes. INTERACTIVE.
 *
 * One concept: drawMesh takes a vertex list and an index list and shades each triangle
 * by interpolating its three corner colours barycentrically.
 *
 * This and the patch demo used to look almost identical - four draggable corners
 * filled with a colour blend - which taught nothing about how they differ. The
 * distinction is the geometry: a mesh is triangles you supply yourself, so this one
 * builds a fan of many triangles around a centre you drag, and can show the triangle
 * edges. Subdivision belongs to the patch demo, not here.
 */

const W = 512
const H = 512

const WHEEL = [
  [0.92, 0.24, 0.26], [0.96, 0.62, 0.18], [0.96, 0.86, 0.24],
  [0.44, 0.74, 0.30], [0.16, 0.60, 0.62], [0.20, 0.42, 0.76],
  [0.44, 0.30, 0.68], [0.80, 0.28, 0.52],
]

export default {
  id: 'mesh',
  name: 'Triangle meshes',
  slug: 'mesh',
  concepts: [
    'drawMesh: a vertex list plus an index list, shaded per triangle.',
    'Colours interpolate barycentrically across each triangle.',
  ],
  docsHref: '/projects/graphics-engine/docs/advanced-geometry#mesh',
  size: { w: W, h: H },

  params: [
    { key: 'triangles', label: 'Triangles', type: 'range', min: 3, max: 32, step: 1, def: 10 },
    { key: 'edges', label: 'Triangle edges', type: 'choice', options: ['Hide', 'Show'], def: 'Show' },
  ],

  handles: [
    { key: 'centre', label: 'Centre vertex' },
    { key: 'rim', label: 'Rim' },
  ],
  initHandles: () => ({ centre: { x: 236, y: 268 }, rim: { x: 452, y: 190 } }),

  draw(module, canvas, p, h) {
    withArena(module, (g) => {
      canvas.clear(1, 1, 1, 1)

      const n = p.triangles | 0
      const radius = Math.max(40, Math.hypot(h.rim.x - h.centre.x, h.rim.y - h.centre.y))
      const phase = Math.atan2(h.rim.y - h.centre.y, h.rim.x - h.centre.x)

      // A fan: one shared centre vertex, n rim vertices, n triangles indexed off them.
      const verts = [h.centre.x, h.centre.y]
      const colours = [0.99, 0.99, 0.98, 1]
      for (let i = 0; i < n; i++) {
        const a = phase + (i / n) * Math.PI * 2
        verts.push(h.centre.x + radius * Math.cos(a), h.centre.y + radius * Math.sin(a))
        const c = WHEEL[i % WHEEL.length]
        colours.push(c[0], c[1], c[2], 1)
      }
      const idx = []
      for (let i = 0; i < n; i++) idx.push(0, 1 + i, 1 + ((i + 1) % n))

      canvas.drawMesh(g.vec(verts), g.vec(colours), g.vec([]), g.ivec(idx), g.paint())

      if (p.edges === 'Show') {
        // The spokes, drawn as thin quads: the engine has no stroker, so a "line" here
        // is a four-point polygon like any other fill.
        const t = 1.1
        for (let i = 0; i < n; i++) {
          const a = phase + (i / n) * Math.PI * 2
          const ex = h.centre.x + radius * Math.cos(a)
          const ey = h.centre.y + radius * Math.sin(a)
          const dx = ex - h.centre.x, dy = ey - h.centre.y
          const len = Math.hypot(dx, dy) || 1
          const nx = -dy / len * t, ny = dx / len * t
          canvas.drawConvexPolygon(g.vec([
            h.centre.x + nx, h.centre.y + ny, ex + nx, ey + ny,
            ex - nx, ey - ny, h.centre.x - nx, h.centre.y - ny,
          ]), 0.10, 0.11, 0.13, 0.55)
        }
      }
    })
  },
}
