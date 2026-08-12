import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Vendor chunking.
 *
 * Route splitting already separates the application code. This separates the
 * dependencies underneath it, which change far less often than the pages do -
 * so a content edit ships a small page chunk and leaves the visitor's cached
 * React and React Flow untouched.
 *
 * Returning undefined leaves placement to Rollup, which is the right default;
 * only the two groups that are genuinely worth isolating are named.
 */
function manualChunks(id) {
  if (!id.includes('node_modules')) return undefined

  // React Flow and its d3 / zustand dependencies. ~The largest single thing in
  // the bundle, and reachable from exactly one route (the CPU demo), so it
  // stays out of every other page's critical path.
  if (
    id.includes('@xyflow') ||
    id.includes('/d3-') ||
    id.includes('/zustand/') ||
    id.includes('/classcat/')
  ) {
    return 'vendor-flow'
  }

  // The framework itself. The trailing slash is what makes this safe: it
  // anchors each alternative to a whole package directory, so `react-is`,
  // `react-transition-group` and similar fall through to Rollup instead of
  // being swept in by the `react` prefix.
  if (/node_modules\/(react|react-dom|react-router|react-router-dom|scheduler)\//.test(id)) {
    return 'vendor-react'
  }

  return undefined
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Off in production. Sourcemaps were adding ~2.8 MB to every deploy and
    // publishing the full un-minified source; nothing on the site consumes
    // them (the /admin source viewer is an unimplemented stub).
    sourcemap: false,
    rollupOptions: {
      output: { manualChunks }
    }
  },
  assetsInclude: ['**/*.wasm'],
  server: {
    port: 5173,
    open: true
  }
})
