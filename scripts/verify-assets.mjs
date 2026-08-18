/**
 * Every absolute asset URL in the source must resolve to a real file in public/.
 *
 * This exists because twelve images on the graphics docs landing 404'd in
 * production and nobody noticed. The paths were correct once - back when those
 * docs were static HTML served from /docs/ - and the React conversion moved the
 * pages and the files but not the twelve <img src> attributes pointing at them.
 * Nothing failed: the build succeeded, the pages rendered, the images were just
 * silently absent. A broken URL is invisible to every check we had.
 *
 * The same class of bug had also disabled the Bitmap/Texture Shader demo, whose
 * relative `fetch('spock.png')` resolved against the route rather than the site
 * root and had never had a file behind it at all.
 *
 * Scope: only ABSOLUTE urls, which Vite copies verbatim from public/ and so
 * never validates. Assets imported from src/assets/ are resolved at build time,
 * so a broken one already fails the build and needs no help from here.
 *
 * Run: npm run verify:assets
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs'
import { join, extname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('..', import.meta.url))
const SRC = join(ROOT, 'src')
const PUBLIC = join(ROOT, 'public')

/*
 * Strings that look like absolute URLs but are not, listed explicitly so the
 * exception carries its reason rather than being silently tolerated.
 */
const NOT_URLS = new Map([
  ['/spock.png', 'path inside the WASM module\'s virtual filesystem (loadImageToVFS), not a site URL'],
])

const SOURCE_EXT = new Set(['.jsx', '.js', '.css', '.html'])
const ASSET_EXT = /\.(png|jpe?g|webp|gif|svg|avif|ico|woff2?|ttf|otf|wasm|pdf|mp4|webm)$/i

/** Every source file we might reference an asset from. */
function sources(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) sources(p, out)
    else if (SOURCE_EXT.has(extname(name))) out.push(p)
  }
  return out
}

/*
 * Absolute asset URLs, in the three shapes they actually appear in:
 *   "/path/to/thing.png"      quoted attribute or string literal
 *   '/path/to/thing.png'
 *   url(/path/to/thing.png)   CSS
 * A leading // is protocol-relative (i.e. remote), not a site path.
 */
const PATTERNS = [
  /["'](\/(?!\/)[^"'()\s]*?\.[a-z0-9]{2,5})["']/gi,
  /url\(\s*["']?(\/(?!\/)[^"')\s]+?)\s*["']?\s*\)/gi,
]

const findings = new Map()   // url -> Set of source files

for (const file of sources(SRC)) {
  const text = readFileSync(file, 'utf8')
  for (const re of PATTERNS) {
    re.lastIndex = 0
    let m
    while ((m = re.exec(text)) !== null) {
      const url = m[1].split(/[?#]/)[0]
      if (!ASSET_EXT.test(url)) continue
      if (NOT_URLS.has(url)) continue
      if (!findings.has(url)) findings.set(url, new Set())
      findings.get(url).add(file.slice(ROOT.length))
    }
  }
}

const missing = []
for (const [url, refs] of findings) {
  if (!existsSync(join(PUBLIC, url))) missing.push({ url, refs: [...refs] })
}

const checked = findings.size
if (missing.length) {
  console.error(`\n✗ asset audit: ${missing.length} of ${checked} absolute asset URLs have no file in public/\n`)
  for (const { url, refs } of missing) {
    console.error(`  • ${url}`)
    for (const r of refs) console.error(`      referenced by ${r}`)
  }
  console.error('')
  process.exit(1)
}
console.log(`✓ asset audit: ${checked} absolute asset URLs all resolve in public/`)
