import { withArena } from '../arena.js'

/**
 * Texture sampling. INTERACTIVE.
 *
 * One concept: the engine ships two bitmap shaders, one taking the nearest texel and
 * one blending the four around the sample point.
 *
 * They are drawn side by side rather than behind a toggle. Flipping between two states
 * asks the viewer to remember the previous one; showing both at once means the seam
 * down the middle is the answer - hard blocks on the left, smooth ramps on the right,
 * same texture, same magnification.
 */

const TEXTURE = '/spock.png'
const TILE = { Clamp: 0, Repeat: 1, Mirror: 2 }
const W = 512
const H = 512

export default {
  id: 'texture',
  name: 'Texture sampling',
  slug: 'texture',
  concepts: [
    'Nearest-neighbour against bilinear sampling, side by side.',
    'Clamp, Repeat and Mirror tiling.',
  ],
  docsHref: '/projects/graphics-engine/docs/transforms-textures',
  size: { w: W, h: H },
  textures: [{ vfsPath: TEXTURE, url: '/projects/graphics-engine/spock.png' }],
  handles: [],

  // Positions are in logical space; the page draws these as HTML over the canvas.
  labels: () => [
    { x: W * 0.25, y: 22, text: 'Nearest' },
    { x: W * 0.75, y: 22, text: 'Bilinear' },
  ],

  params: [
    { key: 'zoom', label: 'Magnification', type: 'range', min: 100, max: 1600, step: 20, def: 260,
      format: (v) => `${(v / 100).toFixed(1)}×` },
    { key: 'compare', label: 'Show', type: 'choice',
      options: ['Both', 'Nearest only', 'Bilinear only'], def: 'Both' },
    { key: 'tile', label: 'Tile mode', type: 'choice', options: ['Clamp', 'Repeat', 'Mirror'], def: 'Clamp' },
  ],

  draw(module, canvas, p) {
    withArena(module, (g) => {
      canvas.clear(1, 1, 1, 1)

      const s = p.zoom / 100
      // Keep the same feature under the divider as the zoom changes, so the control
      // reads as magnification rather than a pan.
      const focusX = 196, focusY = 150
      const tx = W / 2 - focusX * s
      const ty = H / 2 - focusY * s
      const tile = TILE[p.tile]

      const paintFor = (bilinear) => {
        const factory = bilinear
          ? module.createBilerpBitmapShaderFromFile
          : module.createBitmapShaderFromFile
        // Matrix order is (a, c, e, b, d, f).
        return g.paint({
          shader: g.shader(factory.call(module, TEXTURE, s, 0, tx, 0, s, ty, tile),
            bilinear ? 'bilerp bitmap' : 'nearest bitmap'),
        })
      }

      if (p.compare === 'Nearest only') {
        canvas.drawRectWithPaint(0, 0, W, H, paintFor(false))
      } else if (p.compare === 'Bilinear only') {
        canvas.drawRectWithPaint(0, 0, W, H, paintFor(true))
      } else {
        // Two halves of one continuous image: the shader matrix is identical on both
        // sides, so the only difference across the seam is how texels are sampled.
        canvas.drawRectWithPaint(0, 0, W / 2, H, paintFor(false))
        canvas.drawRectWithPaint(W / 2, 0, W / 2, H, paintFor(true))
        canvas.drawRectWithPaint(W / 2 - 1, 0, 2, H, g.paint({ color: [1, 1, 1], alpha: 0.85 }))
      }
    })
  },
}
