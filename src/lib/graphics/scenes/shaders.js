import { withArena } from '../arena.js'

/**
 * Combining shaders. INTERACTIVE.
 *
 * One concept: a shader is something you can build out of other shaders. ComposeShader
 * multiplies two together; ProxyShader wraps one with its own matrix, which is how
 * drawMesh maps a texture per triangle. Neither was reachable from JS until the
 * bindings were extended.
 *
 * All three panels are on screen at once rather than behind a picker. A product is only
 * legible next to its two factors - asking the viewer to flip between them and hold the
 * previous one in memory is what made the earlier version hard to read.
 */

const TEXTURE = '/spock.png'
const W = 512
const H = 512
const HALF = W / 2      // the two factors, square
const BAND = H / 2      // the product, full width

export default {
  id: 'shaders',
  name: 'Combining shaders',
  slug: 'shaders',
  concepts: [
    'ComposeShader multiplies two shaders together.',
    'ProxyShader gives a shader its own matrix, independent of the canvas.',
  ],
  docsHref: '/projects/graphics-engine/docs/transforms-textures',
  size: { w: W, h: H },
  textures: [{ vfsPath: TEXTURE, url: '/projects/graphics-engine/spock.png' }],
  handles: [],

  labels: () => [
    { x: HALF * 0.5, y: 20, text: 'texture' },
    { x: HALF * 1.5, y: 20, text: 'second shader' },
    { x: W / 2, y: BAND + 20, text: 'composed — the two multiplied' },
  ],

  params: [
    { key: 'overlay', label: 'Second shader', type: 'choice',
      options: ['Sweep', 'Linear ramp', 'Radial', 'TriColor'], def: 'Sweep' },
    { key: 'rotate', label: 'Overlay rotation (proxy)', type: 'range', min: 0, max: 180, step: 1, def: 40,
      format: (v) => `${v}°` },
  ],

  draw(module, canvas, p) {
    withArena(module, (g) => {
      canvas.clear(1, 1, 1, 1)

      // Both factors get a square. The sweep in particular cannot show a wheel in a
      // short wide band - it degrades to a left-right wash - so the two sources sit
      // side by side on top and the product takes the full width beneath them.
      const texture = () => g.shader(
        module.createBitmapShaderFromFile(TEXTURE, 0.62, 0, 30, 0, 0.62, 6, 1), 'bitmap')

      const overlaySource = () => {
        if (p.overlay === 'TriColor') {
          // Barycentric across three points rather than along a line or around a
          // centre. drawMesh builds this per triangle; here it is an ordinary shader.
          return g.shader(module.createTriColorShader(
            g.vec([20, 10, HALF - 20, BAND * 0.4, HALF / 2, BAND - 10]),
            g.vec([0.98, 0.86, 0.30, 1, 0.24, 0.60, 0.80, 1, 0.88, 0.32, 0.42, 1])), 'triColor')
        }
        if (p.overlay === 'Linear ramp') {
          return g.shader(module.createLinearGradient(0, 0, HALF, BAND,
            g.vec([1, 0.32, 0.18, 1, 0.20, 0.85, 0.55, 1, 0.25, 0.35, 1, 1]), 0), 'ramp')
        }
        if (p.overlay === 'Radial') {
          return g.shader(module.createRadialGradient(HALF / 2, BAND / 2, BAND * 0.55,
            g.vec([1, 0.95, 0.35, 1, 0.90, 0.25, 0.30, 1, 0.15, 0.20, 0.55, 1]), 0), 'radial')
        }
        // The ramp wraps back to its first colour so the wheel has no seam.
        return g.shader(module.createAngleGradient(HALF / 2, BAND / 2, HALF, BAND / 2,
          g.vec([1, 0.86, 0.28, 1, 0.28, 0.72, 0.62, 1,
                 0.44, 0.36, 0.78, 1, 1, 0.86, 0.28, 1])), 'sweep')
      }

      // ProxyShader carries the rotation, so the overlay turns independently of the
      // texture it is multiplied with.
      const a = (p.rotate * Math.PI) / 180
      const rotated = () => g.shader(module.createProxyShader(
        overlaySource().getPtr(),
        Math.cos(a), -Math.sin(a), 0,
        Math.sin(a), Math.cos(a), 0), 'proxy')

      // Top left: the texture alone.
      canvas.drawRectWithPaint(0, 0, HALF, BAND, g.paint({ shader: texture() }))

      // Top right: the second shader alone. Translated so it fills its own square
      // using the same coordinates it was defined in.
      canvas.save()
      canvas.translate(HALF, 0)
      canvas.drawRectWithPaint(0, 0, HALF, BAND, g.paint({ shader: rotated() }))
      canvas.restore()

      // Bottom: the product, across the full width.
      canvas.save()
      canvas.translate(0, BAND)
      canvas.drawRectWithPaint(0, 0, W, BAND, g.paint({
        shader: g.shader(module.createComposeShader(texture().getPtr(), rotated().getPtr()),
          'compose'),
      }))
      canvas.restore()

      // Hairlines so the three regions read as panels rather than one image.
      canvas.drawRectWithPaint(0, BAND - 1, W, 2, g.paint({ color: [1, 1, 1], alpha: 0.92 }))
      canvas.drawRectWithPaint(HALF - 1, 0, 2, BAND, g.paint({ color: [1, 1, 1], alpha: 0.92 }))
    })
  },
}
