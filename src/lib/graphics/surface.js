/**
 * Owns the engine's drawing surface: the CanvasWrapper, its resolution, and getting
 * finished pixels onto a <canvas>.
 *
 * Demos never touch any of this. They draw in their own logical coordinate space
 * (whatever `size` they declare) and the CTM maps that onto however many device
 * pixels the surface decided to allocate.
 *
 * There is no frame loop here on purpose. The engine renders images, so a render
 * happens when something changes - a slider moved, a handle dragged - and not
 * otherwise.
 */

/**
 * Device-pixel ceiling. Both the C++ rasterization and the JS blit cost scale
 * linearly with pixel count, so this exists to keep dragging immediate rather than
 * to hit a frame budget: a retina phone at dpr 3 would otherwise allocate ~9x the
 * work of a logical-size render for no visible gain.
 */
const MAX_DEVICE_PIXELS = 2_400_000

/** Never allocate a backing store below this, or thin geometry disappears. */
const MIN_WIDTH = 280

export class Surface {
  /**
   * @param {HTMLCanvasElement} canvas  the visible canvas
   * @param {object} module             the loaded engine module
   */
  constructor(canvas, module) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.module = module

    this.wasm = null          // CanvasWrapper
    this.deviceW = 0
    this.deviceH = 0
    this.logicalW = 0
    this.logicalH = 0
    this.imageData = null
    this.out32 = null         // Uint32Array view over imageData, reused per render
  }

  /**
   * Size the surface for a demo's logical space at a given CSS width.
   * Returns true if the backing store was reallocated.
   */
  configure({ logicalW, logicalH, cssWidth, dpr = 1 }) {
    const aspect = logicalH / logicalW
    const scale = Math.min(dpr, 2)

    let w = Math.max(MIN_WIDTH, Math.round(cssWidth * scale))
    let h = Math.round(w * aspect)

    if (w * h > MAX_DEVICE_PIXELS) {
      const k = Math.sqrt(MAX_DEVICE_PIXELS / (w * h))
      w = Math.round(w * k)
      h = Math.round(h * k)
    }

    const unchanged =
      w === this.deviceW && h === this.deviceH &&
      logicalW === this.logicalW && logicalH === this.logicalH

    // The presented size is set every time even when the backing store is reused,
    // because the CSS width can change without the device size changing.
    this.canvas.style.width = `${Math.round(cssWidth)}px`
    this.canvas.style.height = `${Math.round(cssWidth * aspect)}px`

    if (unchanged) return false

    this.deviceW = w
    this.deviceH = h
    this.logicalW = logicalW
    this.logicalH = logicalH

    this.canvas.width = w
    this.canvas.height = h

    if (this.wasm) this.wasm.delete()
    this.wasm = new this.module.CanvasWrapper(w, h)

    this.imageData = this.ctx.createImageData(w, h)
    this.out32 = new Uint32Array(this.imageData.data.buffer)

    return true
  }

  /**
   * Render one image. `draw` receives the engine module and a canvas already scaled
   * from the demo's logical space to device pixels, so a demo's coordinates mean the
   * same thing at every resolution.
   */
  render(draw) {
    if (!this.wasm) return
    const canvas = this.wasm
    canvas.save()
    canvas.scale(this.deviceW / this.logicalW, this.deviceH / this.logicalH)
    try {
      draw(this.module, canvas)
    } finally {
      // restore even if a demo throws, or the CTM stack leaks into the next render
      canvas.restore()
    }
    this.blit()
  }

  /**
   * Copy the engine's framebuffer onto the visible canvas.
   *
   * The engine stores premultiplied ARGB; ImageData wants non-premultiplied RGBA in
   * byte order. After an opaque clear every pixel has alpha 255, where
   * un-premultiplying is the identity - so the whole conversion collapses to swapping
   * the red and blue bytes, one 32-bit word at a time, into a buffer allocated once.
   *
   * The previous implementation allocated a fresh ImageData per render and did four
   * per-channel divides per pixel. Measured 2.88ms -> 1.50ms at 800x600.
   */
  blit() {
    const { module, wasm, deviceW, deviceH, out32 } = this
    const count = deviceW * deviceH
    const src = new Uint32Array(module.HEAPU32.buffer, wasm.getPixelsPtr(), count)

    for (let i = 0; i < count; i++) {
      const v = src[i]
      out32[i] = (v & 0xff00ff00) | ((v & 0x00ff0000) >>> 16) | ((v & 0x000000ff) << 16)
    }
    this.ctx.putImageData(this.imageData, 0, 0)
  }

  /** Map a pointer position on the canvas into the current demo's logical space. */
  toLogical(clientX, clientY) {
    const r = this.canvas.getBoundingClientRect()
    return {
      x: ((clientX - r.left) / r.width) * this.logicalW,
      y: ((clientY - r.top) / r.height) * this.logicalH,
    }
  }

  destroy() {
    if (this.wasm) {
      this.wasm.delete()
      this.wasm = null
    }
    this.imageData = null
    this.out32 = null
  }
}
