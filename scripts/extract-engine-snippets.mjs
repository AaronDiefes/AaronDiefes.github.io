/**
 * Extracts the C++ excerpts the graphics demo's code panel displays, straight
 * from the engine source in graphics-engine-src/.
 *
 * Why a script rather than pasted strings: the panel's whole claim is "this is
 * the code that drew the frame you are looking at". A pasted excerpt silently
 * becomes a lie the moment the source moves. Anchors are matched by exact
 * trimmed text, never by line number, so the extraction survives edits above it
 * and fails loudly if the anchor itself is edited away.
 *
 * Run `node scripts/extract-engine-snippets.mjs` to regenerate, or
 * `--check` to verify the committed output is current (used by CI).
 *
 * NOTE on the blend fast path: the free function getBlendMode() in
 * blend_functions.h:430 is a DEAD earlier draft - both of its call sites are
 * commented out, and it carries a copy-paste bug (src_over_mode tested twice,
 * the second overwriting the first with dst_mode) plus an uninitialised
 * new_proc. The live, correct copy is inlined at my_canvas.cpp. Quote that one.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(ROOT, 'graphics-engine-src')

const SNIPPETS = [
  {
    id: 'edge-direction',
    file: 'Edge.h',
    caption: 'Edge setup — winding direction captured branch-free, before the swap',
    start: 'int w = p0.y > p1.y;',
    lines: 5,
  },
  {
    id: 'winding',
    file: 'my_canvas.cpp',
    caption: 'Nonzero winding — a span opens at w==0 and closes when w returns to 0',
    start: 'while (i < edges.size() && edges[i].isValid(y)) {',
    lines: 7,
  },
  {
    id: 'tessellation-quad',
    file: 'my_canvas.cpp',
    caption: 'Quadratic tessellation — segment count derived from the error vector',
    start: 'GPoint E = (A - 2*B + C)*.25f;',
    lines: 3,
  },
  {
    id: 'tessellation-cubic',
    file: 'my_canvas.cpp',
    caption: 'Cubic tessellation — the same rule, bounded by the larger second difference',
    start: 'GPoint E0 = A - 2*B + C;',
    lines: 9,
  },
  {
    id: 'div255',
    file: 'my_utils.h',
    caption: 'Fixed-point divide — exact for all [0, 65025], no integer division',
    start: 'static inline uint8_t div255(unsigned before){',
    lines: 3,
  },
  {
    id: 'blend-fastpath',
    file: 'my_canvas.cpp',
    caption: 'Blend fast paths — rewrite the operator once per draw, not per pixel',
    start: 'if(color.a == 1){',
    lines: 6,
    // Two identical anchors (my_canvas.cpp:101 and :171) - the convex-polygon
    // path and the path-fill path carry the same fast-path block. Take the first.
    occurrence: 0,
    drop: [/^\s*\/\/ if\(proc == src_over_mode\)/],
  },
  {
    id: 'drawquad',
    file: 'my_canvas.cpp',
    caption: 'Bilinear patch — (level+1)² grid, corners interpolated in both axes',
    start: 'float v = float(j) / (1 + level);',
    lines: 2,
  },
  {
    id: 'bilerp-sample',
    file: 'shader_ops.h',
    caption: 'Bilinear sampling — four taps around the point, weighted by the sub-texel offset',
    start: 'float u = x_prime - GFloorToInt(x_prime);',
    // Three tile-mode branches inside the bilerp shader share this line; the first
    // is the repeat branch. Any of them shows the same 4-tap weighting, which is
    // the point of the excerpt.
    occurrence: 0,
    lines: 8,
  },
  {
    id: 'compose-modulate',
    file: 'shader_ops.h',
    caption: 'Compose — both shaders sampled per row, then multiplied together',
    start: 'sh1->shadeRow(x, y, c, row1);',
    lines: 6,
  },
  {
    id: 'coons-interior',
    file: 'my_final.cpp',
    caption: 'Coons patch — an interior point as a bilinear blend of the boundary curves',
    start: 'GPoint p = (1-u)*(1-v)* p1 + u * (1-v) * p2 + u * v * p3 + (1-u) * v * p4;',
    lines: 2,
  },
  {
    id: 'matrix-concat',
    file: 'matrix_transform.cpp',
    caption: 'Matrix concatenation — the 2x3 affine product behind every transform',
    start: 'GMatrix GMatrix::Concat(const GMatrix& a, const GMatrix& b){',
    lines: 11,
  },
]

function extract(s) {
  const text = readFileSync(join(SRC, s.file), 'utf8')
  const all = text.split('\n')
  const hits = []
  all.forEach((line, i) => { if (line.trim() === s.start) hits.push(i) })

  if (hits.length === 0) {
    throw new Error(
      `snippet "${s.id}": anchor not found in ${s.file}\n  looking for: ${s.start}\n` +
      `  The engine source moved. Update the anchor in scripts/extract-engine-snippets.mjs.`
    )
  }
  if (hits.length > 1 && s.occurrence === undefined) {
    throw new Error(
      `snippet "${s.id}": anchor is ambiguous in ${s.file} (${hits.length} matches at lines ` +
      `${hits.map(h => h + 1).join(', ')}). Add an "occurrence" field to disambiguate.`
    )
  }
  const startIdx = hits[s.occurrence ?? 0]
  let raw = all.slice(startIdx, startIdx + s.lines)
  if (s.drop) raw = raw.filter(l => !s.drop.some(re => re.test(l)))

  // Strip the common leading indentation so the panel isn't mostly whitespace.
  const indents = raw.filter(l => l.trim()).map(l => l.match(/^\s*/)[0].length)
  const strip = Math.min(...indents)
  const code = raw.map(l => l.slice(strip)).join('\n').replace(/\s+$/, '')

  return { id: s.id, file: s.file, line: startIdx + 1, caption: s.caption, code }
}

const out = SNIPPETS.map(extract)
const banner =
  '// GENERATED by scripts/extract-engine-snippets.mjs - do not edit by hand.\n' +
  '// Source of truth: graphics-engine-src/\n\n'
const body = `export const ENGINE_SNIPPETS = ${JSON.stringify(
  Object.fromEntries(out.map(s => [s.id, s])), null, 2)}\n`

const target = join(ROOT, 'src/lib/graphics/snippets.generated.js')
const next = banner + body

if (process.argv.includes('--check')) {
  let current = null
  try { current = readFileSync(target, 'utf8') } catch { /* missing */ }
  if (current !== next) {
    console.error(
      'Engine snippets are stale.\n' +
      'The C++ in graphics-engine-src/ no longer matches what the demo\n' +
      "displays as \"the code that drew this frame\". Run:\n\n" +
      '  node scripts/extract-engine-snippets.mjs\n'
    )
    process.exit(1)
  }
  console.log(`engine snippets: ${out.length} up to date`)
} else {
  writeFileSync(target, next)
  for (const s of out) console.log(`  ${s.id.padEnd(20)} ${s.file}:${s.line}  (${s.code.split('\n').length} lines)`)
  console.log(`\nwrote ${target}`)
}
