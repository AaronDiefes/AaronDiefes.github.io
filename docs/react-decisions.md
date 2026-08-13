# React architecture decisions

**Status: planned, not yet implemented.** This records what we intend to change in the
React app and *why*, so the reasoning survives the gap between deciding and building. Each
section is written to be usable as an answer to "why React, and what did you actually do
with it?"

Verified against the repo on 2026-08-11: React 18.3.1, `react-router-dom` 6.30.3 installed
(the manifest says `^6.22.0`), Vite 6, no TypeScript, no test framework. Static SPA on
GitHub Pages — **no server, no SSR, no backend.** That last fact drives most of what follows.

---

## Why React at all

Honest version: the site is ~25 routes of mostly-static content, and a plain static-site
generator would render it with less JavaScript. React earns its place here for two specific
reasons, and it's worth being able to say which:

1. **The CPU simulator is a real application**, not a document. It has playback state, a
   frame timeline, a register file, and a datapath diagram that all update together 135
   times per program. That's a state-synchronisation problem, which is what React is for.
2. **The documentation and the demos share chrome and navigation.** One component tree
   means the nav, theme, and routing are written once rather than per page.

The rest of the site is along for the ride. That's a reasonable trade, not a triumph, and
saying so is more credible than claiming every page needed a component model.

---

## 1. Route-based code splitting

> **Status: implemented** on `perf/code-splitting`. Measured result: first load fell from
> 1,198 KB to 198 KB of JavaScript — **237 KB to 64 KB gzipped**, a 73% reduction — and the
> chunk-size warning is gone. React Flow (181 KB) and its 14 KB stylesheet now load only on
> `/projects/cpu/demo`. Sourcemaps are off in production, removing a further ~2.8 MB per
> deploy. The sections below describe the reasoning; the notes marked *Outcome* record what
> actually happened when it ran.

### The problem

The production bundle is **one chunk: 1,232 KB raw / 240 KB gzipped.** Vite prints a
chunk-size warning on every build. The cause is `src/App.jsx` — all 25 route components are
imported statically at the top of the file, so Rollup has no seam to split on.

The worst instance: `@xyflow/react` is **2.7 MB installed**, imported by exactly one file
(`src/components/cpu/PipelineDiagram.jsx`), reachable from exactly one route
(`/projects/cpu/demo`). Every visitor who lands on the homepage downloads a graph-diagram
library they will probably never use.

Note that dynamic `import()` is *already* used ~20 times in this codebase — the CPU
components pull their vanilla-JS modules in lazily. So the technique isn't new here; it just
was never applied at the route level. `lazy(` and `Suspense` currently appear zero times.

### The fix

```jsx
// Module scope, NOT inside a component. Declaring lazy() inside a component
// creates a new component type every render, which remounts the subtree.
const CpuSimulatorPage = lazy(() => import('./pages/cpu/CPUSimulatorPage'))
```

…with a single `<Suspense>` boundary around `<Routes>`, plus:

```jsx
<BrowserRouter future={{ v7_startTransition: true }}>
```

### Why that future flag matters (the interesting part)

Naive lazy routes flicker: React unmounts the old page, paints the Suspense fallback, then
paints the new page. `v7_startTransition` routes Router state updates through
`useTransition`, which tells React to **keep the previous screen on-screen** until the new
chunk resolves. One line, removes the flash, and it's forward-compatible with React Router 7.

### The GitHub Pages trap this creates

This one is worth knowing because it's non-obvious and self-inflicted:

`public/404.html` (the SPA redirect shim) catches **every** unmatched path — including
`/assets/*.js`. After a redeploy, a user with the page still open clicks a link, the browser
requests a chunk whose content hash no longer exists, and GitHub Pages serves **404.html
with a 200 status**. The browser then tries to parse HTML as an ES module and fails.
`React.lazy` does not retry, and it caches the rejected promise — so that route stays broken
until a manual reload.

Mitigation, which ships *with* the splitting rather than after it:

```js
window.addEventListener('vite:preloadError', () => {
  // Guard against a reload loop for a genuinely offline user.
  if (sessionStorage.getItem('chunk-reloaded')) return
  sessionStorage.setItem('chunk-reloaded', '1')
  window.location.reload()
})
```

**Outcome.** Shipped as `src/lib/chunk-recovery.js`, with one change from the sketch above: a
*timestamp* rather than a boolean flag. A boolean has to be cleared on success, and every
place you might clear it is either too early (clear it on load, and a failing chunk reloads
forever) or unreachable (the load failed, so nothing runs). A timestamp expires on its own and
needs no reset path. Storage access is also wrapped — if `sessionStorage` throws (Safari
private mode), the handler declines to reload at all, because an unguarded reload loop is
worse than a visible error.

This was verified rather than assumed: removing a chunk from `dist/` reproduced the trap
exactly — the missing asset returned **200 with `content-type: text/html`**, the handler fired
and reloaded (confirmed via `performance.getEntriesByType('navigation')[0].type === "reload"`),
the second attempt was suppressed, and the error boundary rendered instead of a white screen.

The no-flash claim was also measured, not assumed: a `MutationObserver` watching for
`.route-fallback` during a client-side navigation to a lazy route recorded **zero** fallback
renders.

### Expected result

Entry chunk from 240 KB gzip to roughly 60–90 KB, with React Flow off the critical path.
Pair with `build.rollupOptions.output.manualChunks` to give react/react-dom/react-router a
long-cached vendor chunk.

**Outcome: 64 KB gzipped**, at the good end of that estimate.

| | before | after |
|---|---|---|
| JS on first load | 1,198 KB (237 KB gzip) | 198 KB (**64 KB gzip**) |
| CSS on first load | 85 KB | 70 KB |
| Sourcemaps per deploy | ~2.8 MB | none |
| Chunks | 1 | entry + 2 vendor + 1 per route |

One unplanned bonus: React Flow's *stylesheet* split out alongside its JavaScript, because it
is imported by `PipelineDiagram` rather than by `main.jsx`. That took 14 KB of diagram CSS off
every documentation page.

A caution for later, since it is easy to get wrong: splitting moves `vendor-flow.css` to load
*after* the main stylesheet, which inverts the cascade order for anything both files style.
The overrides for React Flow's zoom controls survive that only because they are scoped
(`.rf-cpu-wrapper .react-flow__controls-button`, two classes) and win on specificity rather
than on order. An unscoped override would silently stop applying the moment splitting was
enabled.

---

## 2. Error boundaries

React 18 has **no hook equivalent** — a boundary must be a class implementing
`static getDerivedStateFromError()` and/or `componentDidCatch()`. That's ~30 lines.

We're not adding `react-error-boundary`. It's a good library, but this app needs one
boundary, and a 5th dependency to avoid 30 lines of a documented React primitive is a poor
trade. ("Why not the library?" → "One boundary didn't earn a dependency, and the router
gives me the reset semantics I'd have wanted from it.")

Two real failure surfaces:
- A failed lazy chunk (see above) — currently a blank white page.
- `src/hooks/useWasmModule.js` loads a 132 KB binary. The hook catches its own load errors
  into state, but `new module.CanvasWrapper(...)` in `GraphicsWasmPage` is unguarded.
  *(Correction: `useWasmModule.js` is dead code — never imported. The live loader is inline
  in `GraphicsWasmPage.jsx`, so the unguarded construction is on the page, not the hook.)*

**Outcome.** Shipped as `src/components/shared/ErrorBoundary.jsx`. Two details worth keeping:

*The fallback imports nothing.* No `<Navigation>`, no `<Link>`, no content modules — just
markup and a plain `<a href="/">`. If the thing that threw was the navigation or the router,
a fallback rendering them throws again from inside the boundary, and an error thrown while
rendering a fallback is **not** caught. A full document load is the one recovery that still
works when the client router is the broken part.

*Reset is a `resetKey` prop, not `key` on the boundary.* Keying the boundary looks tidier and
is wrong twice over: it remounts the whole route subtree on every navigation rather than only
after a failure, and it defeats `v7_startTransition` — a changed key forces React to discard
the previous tree, which is exactly the screen the transition was holding on to.

---

## 3. `useReducedMotion` via `useSyncExternalStore`

### The honest framing

This is an **accessibility fix** that happens to have a nice API story — not an API in
search of a problem. Five stylesheets already honour `prefers-reduced-motion`, but the
JavaScript-driven motion ignores it: the animation engine's autoplay, and the smooth
`scrollIntoView` calls in `TableOfContents.jsx` and `DocsLayout.jsx`. So the CSS respects
the setting and the JS overrides it.

```js
// Both must be module-scope constants. An inline `subscribe` resubscribes every
// render; `getSnapshot` must return a primitive or a cached object or you loop forever.
const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
const subscribe = (cb) => { mq.addEventListener('change', cb); return () => mq.removeEventListener('change', cb) }
const getSnapshot = () => mq.matches

export const useReducedMotion = () => useSyncExternalStore(subscribe, getSnapshot)
```

### Why not `useState` + `useEffect`?

Because the effect runs *after* paint, so the first frame renders with the wrong value; and
under concurrent rendering two components reading the same external source can **tear** —
render with different values in the same pass. `useSyncExternalStore` is the API React added
specifically to keep external mutable sources consistent across a concurrent render.

`getServerSnapshot` (the third argument) is omitted deliberately — there's no SSR here, so
passing it would be dead code.

---

## 4. Navigation: flat nav + ⌘K command palette

The palette indexes ~25 destinations from `src/lib/docs-nav.js` — the same `DOCS_NAV` that
already feeds the nav and the three project landing pages, so there's no second index to
drift.

**The palette is a UX decision, not a concurrency showcase.** We explicitly considered
`useDeferredValue` for the filtering and rejected it — see below.

Its keyboard model reuses what's already proven in
`src/components/shared/ProjectsDropdown.jsx`: a flat array of focusable refs rebuilt each
render, arrow/Home/End to move, Escape to close and return focus to the trigger, and
click-outside handling. That component is being simplified out of the nav, but its
interaction model is the reference implementation.

---

## Deliberately rejected

This list is the most useful part of the document. "I picked three things, and here's what I
turned down and why" is a stronger answer than a list of eight features.

| Rejected | Why |
|---|---|
| **`useDeferredValue` for the palette** | The dataset is 17 pages and ~100 headings. Filtering that takes microseconds. It's also a documented **no-op** unless the child is wrapped in `memo`. Real full-text search would need a build-time index over the ~54,000 words currently embedded in JSX — a separate project, not a hook. |
| **React 19** | Server Components, Server Actions, `useOptimistic`, and `use()` all presuppose a server or a data layer. This site is static with **zero fetches and zero forms** — those features aren't "less useful here," they're inapplicable. The upgrade itself is low-risk (already on `createRoot`, no `propTypes`, no string refs) but it's low-value, and it isn't where the 240 KB went. |
| **React Compiler 1.0** | Automatic memoization solves *render cost*. This app's problem is *chunk size*. Also, `@vitejs/plugin-react` v6 swapped Babel for oxc, so the integration story is mid-churn. Evaluated and deferred. |
| **Router `loader`s** | Every page is static JSX. Loaders would be `async () => null` — the clearest possible sign that a feature was chosen for the résumé rather than the app. |
| **Broad `memo` / `useMemo`** | Premature memoization reads as noise. The real complexity here is 45 `useEffect`s and imperative refs wrapping vanilla classes. |
| **Hash routing** | Would "fix" GitHub Pages deep links, but the 404.html shim already works and keeps clean, shareable URLs. |

---

## Deferred to a second milestone

React Router 6 splits its feature set by router type. These are **data-router-only** and
need `createBrowserRouter` instead of `<BrowserRouter>/<Routes>`:

- `route.lazy` (a different, router-native code-splitting API)
- `errorElement` + `useRouteError` — chrome-preserving error pages, where the nav survives
  and only the outlet errors
- `<ScrollRestoration>` — would replace the manual `scrollTo` effect in `AppContent`
- `viewTransition` on `Link` (stabilised in 6.27, so 6.30.3 already has it — no upgrade
  needed, but it does nothing under `<BrowserRouter>`)

Also deferred: generating routes from `DOCS_NAV` with an `<Outlet />` layout, which would
cut `App.jsx` from 25 routes to ~8 and delete the prop plumbing where all 17 docs pages
hand-pass `project`/`currentSlug`/`title`/`subtitle` that already exist in the data.

**Constraint if we do that:** lazy `import()` specifiers must stay statically analyzable.
Vite can split `() => import('./pages/cpu/CpuAluPage.jsx')` but **not**
`() => import('./pages/' + slug)`. Data-driven routes need an explicit slug→loader map.

---

## Incidental issues found while investigating

- `vite.config.js` sets `sourcemap: true` for production — roughly doubles the deployed
  artifact and publishes readable source.
- `useWasmModule.js` injects a `<script>` tag and deliberately never removes it on cleanup.
  Under `StrictMode`'s double-invoked effects that's a latent double-load. Fix the hook
  (guard on an existing `script[src="/graphics_engine.js"]`, or hoist to a module-level
  memoised promise) — **don't** remove StrictMode to hide it.
- `.github/workflows/deploy.yml` builds on Node 18, which is EOL.
