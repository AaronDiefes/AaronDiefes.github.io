/**
 * Scoped allocation for embind objects.
 *
 * Every VectorFloat, PathWrapper, PaintWrapper and shader crossing the JS/C++
 * boundary owns C++ memory that embind will not reclaim on its own. The existing
 * demo page deletes most of them by hand and misses several - harmless at one draw
 * per slider release, not harmless when dragging re-renders continuously.
 *
 * An arena removes the discipline problem: allocate through it, and everything is
 * released when the draw finishes, including on the error path.
 *
 * Release order is reverse-allocation, which matters for composed shaders:
 * ProxyShader and ComposeShader hold raw pointers to shaders they do not own, so
 * the wrapper has to go before the shaders it points at.
 */

export function withArena(module, fn) {
  const owned = []
  const keep = (obj) => {
    if (obj) owned.push(obj)
    return obj
  }

  const g = {
    module,

    /** Flat float array -> VectorFloat. Points are [x,y,...], colours [r,g,b,a,...]. */
    vec(values) {
      const v = new module.VectorFloat()
      for (let i = 0; i < values.length; i++) v.push_back(values[i])
      return keep(v)
    },

    /** Flat int array -> VectorInt, for mesh indices. */
    ivec(values) {
      const v = new module.VectorInt()
      for (let i = 0; i < values.length; i++) v.push_back(values[i])
      return keep(v)
    },

    path() {
      return keep(new module.PathWrapper())
    },

    /** A paint, optionally pre-set with a colour, alpha, blend mode or shader. */
    paint({ color, alpha, blendMode, shader } = {}) {
      const p = keep(new module.PaintWrapper())
      if (color) p.setColor(color[0], color[1], color[2], color.length > 3 ? color[3] : 1)
      if (alpha != null) p.setAlpha(alpha)
      if (blendMode != null) p.setBlendMode(blendMode)
      if (shader) p.setShader(shader.getPtr())
      return p
    },

    /**
     * Track a shader returned by a factory. Factories return null on failure - most
     * commonly a singular local matrix, which the engine cannot invert and which then
     * draws nothing without raising anything. Surfacing it as a throw beats a
     * silently blank canvas.
     */
    shader(s, label = 'shader') {
      if (!s) {
        throw new Error(
          `${label} factory returned null - usually a singular matrix ` +
          '(remember the argument order is a, c, e, b, d, f)'
        )
      }
      return keep(s)
    },
  }

  try {
    return fn(g)
  } finally {
    for (let i = owned.length - 1; i >= 0; i--) {
      try {
        owned[i].delete()
      } catch {
        // A double-delete or an already-invalid handle must not mask the real error
        // from the draw itself.
      }
    }
  }
}

/** Regular polygon as a flat [x,y,...] array. `reverse` flips winding direction. */
export function polygonPoints(cx, cy, radius, sides, rotation = 0, reverse = false) {
  const pts = []
  for (let i = 0; i < sides; i++) {
    const a = (i / sides) * Math.PI * 2 + rotation
    pts.push({ x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) })
  }
  if (reverse) pts.reverse()
  const flat = []
  for (const p of pts) flat.push(p.x, p.y)
  return flat
}

/** Star polygon, alternating outer and inner radius. */
export function starPoints(cx, cy, outer, inner, points, rotation = 0, reverse = false) {
  const pts = []
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = (i / (points * 2)) * Math.PI * 2 + rotation
    pts.push({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) })
  }
  if (reverse) pts.reverse()
  const flat = []
  for (const p of pts) flat.push(p.x, p.y)
  return flat
}

/** Trace a flat point array into a path as one closed subpath. */
export function traceSubpath(path, flat) {
  if (flat.length < 4) return
  path.moveTo(flat[0], flat[1])
  for (let i = 2; i < flat.length; i += 2) path.lineTo(flat[i], flat[i + 1])
}

/** #rrggbb -> [r,g,b] in 0..1 */
export function hexToRgb(hex) {
  const h = hex.replace('#', '')
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ]
}
