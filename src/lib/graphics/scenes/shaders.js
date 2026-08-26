import { withArena, polygonPoints } from '../arena.js'

/**
 * Combining shaders. INTERACTIVE.
 *
 * One concept: a shader is not only something you fill with, it is something you can
 * build from other shaders. ComposeShader multiplies two together and ProxyShader wraps
 * one with its own matrix, which is how drawMesh maps a texture per triangle - both were
 * unreachable from JS until the bindings were extended.
 *
 * Switching between the inputs and the combination is the lesson, so this is a picker
 * rather than a slider: you have to see the two sources to recognise the product.
 */

const TEXTURE = '/spock.png'

export default {
  id: 'shaders',
  name: 'Combining shaders',
  slug: 'shaders',
  concepts: ['ComposeShader multiplies two shaders; ProxyShader gives one its own matrix.'],
  docsHref: '/projects/graphics-engine/docs/transforms-textures',
  size: { w: 512, h: 512 },
  textures: [{ vfsPath: TEXTURE, url: '/projects/graphics-engine/spock.png' }],
  handles: [],

  params: [
    { key: 'show', label: 'Showing', type: 'choice',
      options: ['Texture', 'Gradient', 'Multiplied'], def: 'Multiplied' },
    { key: 'rotate', label: 'Gradient rotation (proxy)', type: 'range', min: 0, max: 90, step: 1, def: 36,
      format: (v) => `${v}°`,
      // Only meaningful when the gradient is on screen.
      when: (p) => p.show !== 'Texture' },
    { key: 'shape', label: 'Filled shape', type: 'choice',
      options: ['Rectangle', 'Polygon'], def: 'Polygon' },
  ],

  draw(module, canvas, p) {
    withArena(module, (g) => {
      canvas.clear(1, 1, 1, 1)

      const texture = g.shader(
        module.createBitmapShaderFromFile(TEXTURE, 1.1, 0, 40, 0, 1.1, 30, 1), 'bitmap')

      // A three-point barycentric ramp, wrapped in a proxy so it can be rotated
      // independently of whatever it is multiplied with.
      const base = g.shader(module.createTriColorShader(
        g.vec([70, 80, 450, 150, 240, 460]),
        g.vec([0.98, 0.86, 0.30, 1, 0.20, 0.55, 0.85, 1, 0.90, 0.30, 0.45, 1])), 'triColor')

      const a = (p.rotate * Math.PI) / 180
      const gradient = g.shader(module.createProxyShader(
        base.getPtr(),
        Math.cos(a), -Math.sin(a), 0,
        Math.sin(a), Math.cos(a), 0), 'proxy')

      let shader
      if (p.show === 'Texture') shader = texture
      else if (p.show === 'Gradient') shader = gradient
      else shader = g.shader(
        module.createComposeShader(texture.getPtr(), gradient.getPtr()), 'compose')

      const paint = g.paint({ shader })
      if (p.shape === 'Polygon') {
        // drawConvexPolygonWithPaint - a polygon taking a shader rather than a colour.
        canvas.drawConvexPolygonWithPaint(
          g.vec(polygonPoints(256, 256, 232, 6, -Math.PI / 2)), paint)
      } else {
        canvas.drawRectWithPaint(0, 0, 512, 512, paint)
      }
    })
  },
}
