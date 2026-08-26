import { withArena, polygonPoints } from '../arena.js'

/**
 * The transform stack. INTERACTIVE.
 *
 * One concept: what the CTM does to a shape.
 *
 * The previous version varied rotation, scale and shear together across a 4x4 grid, so
 * every cell differed from its neighbour in three ways at once and none of them was
 * named. It read as decoration. Here each cell applies exactly one transform to the
 * same square, labelled, with a faint outline of the untransformed square behind it -
 * so the cell shows the mapping, not just the result.
 *
 * `concat` gets its own cell because it is the only one of these that translate, scale
 * and rotate cannot express.
 */

const W = 512
const H = 384
const COLS = 3
const ROWS = 2
const CELL_W = W / COLS
const CELL_H = H / ROWS

const CELLS = [
  { name: 'Identity' },
  { name: 'translate' },
  { name: 'rotate' },
  { name: 'scale' },
  { name: 'concat — shear' },
  { name: 'combined' },
]

export default {
  id: 'transforms',
  name: 'Transforms',
  slug: 'transforms',
  concepts: [
    'translate, rotate and scale, each applied on its own to the same square.',
    'concat applies an arbitrary affine — the shear the others cannot express.',
  ],
  docsHref: '/projects/graphics-engine/docs/transforms-textures',
  size: { w: W, h: H },
  handles: [],

  labels: () => CELLS.map((c, i) => ({
    x: (i % COLS) * CELL_W + CELL_W / 2,
    y: Math.floor(i / COLS) * CELL_H + CELL_H - 16,
    text: c.name,
  })),

  params: [
    { key: 'amount', label: 'Amount', type: 'range', min: 0, max: 100, step: 1, def: 60,
      format: (v) => (v / 100).toFixed(2) },
    { key: 'ghost', label: 'Show original', type: 'choice', options: ['Hide', 'Show'], def: 'Show' },
  ],

  draw(module, canvas, p) {
    withArena(module, (g) => {
      canvas.clear(1, 1, 1, 1)

      const t = p.amount / 100
      const R = 46
      const square = () => g.vec(polygonPoints(0, 0, R, 4, Math.PI / 4))

      CELLS.forEach((cell, i) => {
        const cx = (i % COLS) * CELL_W + CELL_W / 2
        const cy = Math.floor(i / COLS) * CELL_H + CELL_H / 2 - 8

        // The untransformed square, so each cell reads as a before and after rather
        // than six unrelated shapes.
        if (p.ghost === 'Show') {
          canvas.save()
          canvas.translate(cx, cy)
          canvas.drawConvexPolygon(square(), 0.55, 0.58, 0.62, 0.22)
          canvas.restore()
        }

        canvas.save()
        canvas.translate(cx, cy)
        switch (i) {
          case 1: canvas.translate(34 * t, 20 * t); break
          case 2: canvas.rotate((Math.PI / 4) * t); break
          case 3: canvas.scale(1 + 0.7 * t, 1 - 0.55 * t); break
          // Matrix order is (a, c, e, b, d, f); `c` carries the horizontal shear.
          case 4: canvas.concat(1, 0.9 * t, 0, 0, 1, 0); break
          case 5:
            canvas.rotate((Math.PI / 5) * t)
            canvas.scale(1 + 0.35 * t, 1 + 0.35 * t)
            canvas.concat(1, 0.5 * t, 0, 0, 1, 0)
            break
          default: break
        }
        canvas.drawConvexPolygon(square(), 0.12, 0.38, 0.24, 0.92)
        canvas.restore()
      })
    })
  },
}
