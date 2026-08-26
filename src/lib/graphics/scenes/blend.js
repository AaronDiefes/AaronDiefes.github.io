import { withArena } from '../arena.js'

/**
 * Porter-Duff compositing. STATIC.
 *
 * One concept: the twelve operators, hand-written in the engine. All twelve are drawn
 * in one frame on purpose - SrcIn only means anything next to DstIn, and a mode picker
 * would hide eleven of them behind a control. The grid IS the explanation, so there is
 * nothing to drive.
 */

const MODES = [
  'Clear', 'Src', 'Dst', 'SrcOver', 'DstOver', 'SrcIn',
  'DstIn', 'SrcOut', 'DstOut', 'SrcATop', 'DstATop', 'Xor',
]

export default {
  id: 'blend',
  name: 'Blend modes',
  slug: 'blend',
  static: true,
  concepts: ['All twelve Porter-Duff operators, blue destination under red source.'],
  docsHref: '/projects/graphics-engine/docs/core-rendering#blend',
  size: { w: 512, h: 400 },
  params: [],
  handles: [],

  /* The engine has no text rasterizer, so the cell labels are page furniture drawn in
     HTML over the canvas. Positions are in this demo's logical space; the page maps
     them. Only the picture is the engine's - never let the two blur together. */
  labels: () => MODES.map((mode, i) => ({
    x: (i % 4) * 128 + 64,
    y: Math.floor(i / 4) * 133.3 + 124,
    text: mode,
  })),

  draw(module, canvas) {
    withArena(module, (g) => {
      canvas.clear(1, 1, 1, 1)
      const cols = 4, rows = 3
      const cellW = 512 / cols, cellH = 400 / rows
      MODES.forEach((mode, i) => {
        const cx = (i % cols) * cellW + cellW / 2
        const cy = Math.floor(i / cols) * cellH + cellH / 2
        const r = 42

        const dst = g.path()
        dst.addCircle(cx - 15, cy - 6, r, module.PathDirection.CW)
        canvas.drawPathWithPaint(dst, g.paint({ color: [0.13, 0.36, 0.70], alpha: 0.9 }))

        const src = g.path()
        src.addCircle(cx + 15, cy + 8, r, module.PathDirection.CW)
        canvas.drawPathWithPaint(src, g.paint({
          color: [0.88, 0.28, 0.20], alpha: 0.85, blendMode: module.BlendMode[mode],
        }))
      })
    })
  },
}
