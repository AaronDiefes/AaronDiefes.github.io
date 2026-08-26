/**
 * Fails if a function bound into the WASM module is not exercised by any demo.
 *
 * This guard exists because of the exact failure it now prevents: the previous demo
 * page reached roughly two thirds of the engine, twelve implemented functions were
 * unreachable from JS at all, and several more were bound but called by nothing. None
 * of that was visible without going function by function through the bindings.
 *
 * Run: node scripts/verify-engine-coverage.mjs
 */
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const BINDINGS = join(ROOT, 'graphics-engine-src/wasm_bindings.cpp')
const SCENES_DIR = join(ROOT, 'src/lib/graphics/scenes')

/**
 * Bound names that no demo is expected to call directly, each with the reason. A name
 * may only sit here because exercising it from a demo would be meaningless - not
 * because covering it is inconvenient.
 */
const EXEMPT = {
  getPixelsPtr: 'plumbing - Surface reads the framebuffer through it',
  getWidth: 'plumbing - the Surface already knows its own size',
  getHeight: 'plumbing - the Surface already knows its own size',
  loadImageToVFS: 'plumbing - engine.js loadTexture calls it',
  testFileRead: 'debug helper, not an engine capability',
  reset: 'utility - demos build fresh paths rather than recycling one',
  drawRect: 'superseded by drawRectWithPaint; kept for compatibility',
  drawConvexPolygon: 'legacy colour overload, still used by the tiling demo',
  getColorR: 'accessor, not a drawing capability',
  getColorG: 'accessor, not a drawing capability',
  getColorB: 'accessor, not a drawing capability',
  getColorA: 'accessor, not a drawing capability',
  getPtr: 'accessor - every shader use goes through it',
  countPoints: 'reported as a statistic, not a drawing capability',
  invertMatrix: 'exposed for callers; demos rely on the engine inverting internally',
  mapPoints: 'exposed for callers; demos rely on the engine mapping internally',
  // Splitting a curve at t yields two curves that render identically to the original,
  // so there is nothing visible to demonstrate. The engine uses these internally while
  // flattening, which the curves demo already shows the result of.
  chopQuadAt: 'subdivision utility with no visible effect of its own',
  chopCubicAt: 'subdivision utility with no visible effect of its own',
}

function boundNames() {
  const src = readFileSync(BINDINGS, 'utf8')
  const start = src.indexOf('EMSCRIPTEN_BINDINGS(')
  if (start < 0) throw new Error('EMSCRIPTEN_BINDINGS block not found')
  const block = src.slice(start)

  const names = new Set()
  // .function("name", ...) for class methods
  for (const m of block.matchAll(/\.function\(\s*"([^"]+)"/g)) names.add(m[1])
  // function("name", ...) for free functions
  for (const m of block.matchAll(/(?:^|\s)function\(\s*"([^"]+)"/gm)) names.add(m[1])
  return names
}

function sceneSource() {
  const files = readdirSync(SCENES_DIR).filter((f) => f.endsWith('.js'))
  let all = ''
  for (const f of files) all += readFileSync(join(SCENES_DIR, f), 'utf8') + '\n'
  // The arena wraps several of these, so include it as demo-side code.
  all += readFileSync(join(ROOT, 'src/lib/graphics/arena.js'), 'utf8')
  return { source: all, files }
}

const bound = boundNames()
const { source, files } = sceneSource()

const uncovered = []
for (const name of [...bound].sort()) {
  if (name in EXEMPT) continue
  // Word-boundary match so `scale` does not match `grayscale`, and a bare mention in
  // a comment still counts as intent - the point is to catch total absence.
  const used = new RegExp(`\\b${name}\\b`).test(source)
  if (!used) uncovered.push(name)
}

const exemptButUnbound = Object.keys(EXEMPT).filter((n) => !bound.has(n))

console.log(`engine coverage: ${bound.size} bound names, ${files.length} demo modules`)

let failed = false

if (uncovered.length) {
  failed = true
  console.error(
    `\n${uncovered.length} bound function(s) are not exercised by any demo:\n` +
    uncovered.map((n) => `  - ${n}`).join('\n') +
    '\n\nEither use it in a demo, or add it to EXEMPT in this script with a reason.\n' +
    'Leaving engine capability unreachable is the bug this check exists to catch.'
  )
}

if (exemptButUnbound.length) {
  failed = true
  console.error(
    `\n${exemptButUnbound.length} EXEMPT entr(y/ies) name nothing that is bound:\n` +
    exemptButUnbound.map((n) => `  - ${n}`).join('\n') +
    '\n\nA stale exemption hides a real gap. Remove it.'
  )
}

if (failed) process.exit(1)

const covered = [...bound].filter((n) => !(n in EXEMPT)).length
console.log(`✓ all ${covered} demo-facing functions exercised (${Object.keys(EXEMPT).length} exempt)`)
