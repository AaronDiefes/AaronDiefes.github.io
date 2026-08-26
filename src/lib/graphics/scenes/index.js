/**
 * The demo registry.
 *
 * One engine concept per demo. Each is either interactive or static, decided by whether
 * changing something is the lesson:
 *
 *   interactive - the difference is the point (winding direction, nearest vs bilinear),
 *                 or there is a continuum worth sweeping (subdivision level, shear), or
 *                 the geometry itself is the subject (curve control points, mesh verts).
 *   static      - the image is the achievement (koi, Coons), or one composed frame
 *                 explains it better than any control could (all twelve blend modes).
 *
 * These modules are framework-free: the standalone prototype and the React page import
 * the same code, so a demo is never written twice.
 */

import fill from './fill.js'
import transforms from './transforms.js'
import winding from './winding.js'
import curves from './curves.js'
import blend from './blend.js'
import gradients from './gradients.js'
import texture from './texture.js'
import shaders from './shaders.js'
import mesh from './mesh.js'
import quad from './quad.js'
import coons from './coons.js'
import koi from './koi.js'

export const SCENES = [
  fill, transforms, winding, curves, blend,
  gradients, texture, shaders, mesh, quad, coons, koi,
]

export const SCENES_BY_SLUG = Object.fromEntries(SCENES.map((s) => [s.slug, s]))

export function defaultParams(scene) {
  return Object.fromEntries((scene.params ?? []).map((p) => [p.key, p.def]))
}

export function defaultHandles(scene) {
  return scene.initHandles ? scene.initHandles() : {}
}

/** Every texture any demo needs, deduplicated, for preloading. */
export function allTextures() {
  const seen = new Map()
  for (const s of SCENES) for (const t of s.textures ?? []) seen.set(t.vfsPath, t)
  return [...seen.values()]
}
