import { withArena } from '../arena.js'

/**
 * Texture filtering. INTERACTIVE.
 *
 * One concept, and like winding it lives entirely in the difference: the engine has a
 * nearest-neighbour bitmap shader and a bilinear one. At high magnification they are
 * unmistakably different, and flipping between them is the only way to show it.
 */

const TEXTURE = '/spock.png'
const TILE = { Clamp: 0, Repeat: 1, Mirror: 2 }

export default {
  id: 'texture',
  name: 'Texture filtering',
  slug: 'texture',
  concepts: ['Nearest-neighbour against bilinear sampling, and the three tile modes.'],
  docsHref: '/projects/graphics-engine/docs/transforms-textures',
  size: { w: 512, h: 512 },
  textures: [{ vfsPath: TEXTURE, url: '/projects/graphics-engine/spock.png' }],
  handles: [],

  params: [
    { key: 'filter', label: 'Sampling', type: 'choice', options: ['Nearest', 'Bilinear'], def: 'Nearest' },
    { key: 'zoom', label: 'Magnification', type: 'range', min: 100, max: 900, step: 10, def: 420,
      format: (v) => `${(v / 100).toFixed(1)}x` },
    { key: 'tile', label: 'Tile mode', type: 'choice', options: ['Clamp', 'Repeat', 'Mirror'], def: 'Clamp' },
  ],

  draw(module, canvas, p) {
    withArena(module, (g) => {
      canvas.clear(1, 1, 1, 1)
      const s = p.zoom / 100
      // Keep the same feature centred as the zoom changes, so the control reads as
      // magnification rather than a pan.
      const tx = 256 - 175 * s
      const ty = 256 - 150 * s
      const factory = p.filter === 'Bilinear'
        ? module.createBilerpBitmapShaderFromFile
        : module.createBitmapShaderFromFile
      const shader = g.shader(
        factory.call(module, TEXTURE, s, 0, tx, 0, s, ty, TILE[p.tile]),
        `${p.filter.toLowerCase()} bitmap`)
      canvas.drawRectWithPaint(0, 0, 512, 512, g.paint({ shader }))
    })
  },
}
