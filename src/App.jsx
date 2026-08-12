import React, { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

import ErrorBoundary from './components/shared/ErrorBoundary'
import RouteFallback from './components/shared/RouteFallback'

/*
 * EAGER - these three are part of the first paint or must respond instantly.
 *
 * HomePage is the most common entry point, so splitting it would only add a
 * round trip to the request most likely to happen. NotFoundPage is the
 * catch-all and is tiny. CommandPalette is bound to a global Cmd/Ctrl-K
 * listener that has to work on every page, including before any lazy route has
 * resolved.
 */
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'
import CommandPalette from './components/shared/CommandPalette'

/*
 * LAZY - one chunk per route.
 *
 * Every lazy() call sits at module scope. This is not stylistic: lazy() returns
 * a new component *type* each time it runs, so calling it inside a component
 * would make React see a different type on every render, unmount the old tree
 * and refetch the chunk - an infinite remount loop rather than a cache.
 *
 * The two demos are the reason this is worth doing at all. The CPU demo pulls
 * in React Flow and the graphics demo is a 1,165-line page, and before this
 * split every visitor downloaded both to read a documentation page.
 */
const ResumePage = lazy(() => import('./pages/ResumePage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))

// Graphics Engine pages
const GraphicsWasmPage = lazy(() => import('./pages/graphics/GraphicsWasmPage'))
const DocsPage = lazy(() => import('./pages/graphics/DocsPage'))
const GraphicsCoreRenderingPage = lazy(() => import('./pages/graphics/GraphicsCoreRenderingPage'))
const GraphicsTransformsPage = lazy(() => import('./pages/graphics/GraphicsTransformsPage'))
const GraphicsPathsPage = lazy(() => import('./pages/graphics/GraphicsPathsPage'))
const GraphicsAdvancedGeometryPage = lazy(() => import('./pages/graphics/GraphicsAdvancedGeometryPage'))
const GraphicsFinalFeaturesPage = lazy(() => import('./pages/graphics/GraphicsFinalFeaturesPage'))
const GraphicsOptimizationPage = lazy(() => import('./pages/graphics/GraphicsOptimizationPage'))

// CPU pages
const CPUSimulatorPage = lazy(() => import('./pages/cpu/CPUSimulatorPage'))
const CpuDocsLanding = lazy(() => import('./pages/cpu/CpuDocsLanding'))
const CpuAluPage = lazy(() => import('./pages/cpu/CpuAluPage'))
const CpuRegfilePage = lazy(() => import('./pages/cpu/CpuRegfilePage'))
const CpuMultdivPage = lazy(() => import('./pages/cpu/CpuMultdivPage'))
const CpuPipelinePage = lazy(() => import('./pages/cpu/CpuPipelinePage'))
const CpuHazardsPage = lazy(() => import('./pages/cpu/CpuHazardsPage'))
const CpuInstructionsPage = lazy(() => import('./pages/cpu/CpuInstructionsPage'))
const CpuMemoryPage = lazy(() => import('./pages/cpu/CpuMemoryPage'))

// Uber Algorithmic System pages
const UberDocsLanding = lazy(() => import('./pages/uber/UberDocsLanding'))
const UberAlgorithmPage = lazy(() => import('./pages/uber/UberAlgorithmPage'))
const UberKdtreePage = lazy(() => import('./pages/uber/UberKdtreePage'))
const UberPathfindingPage = lazy(() => import('./pages/uber/UberPathfindingPage'))
const UberBonusPage = lazy(() => import('./pages/uber/UberBonusPage'))

function AppContent() {
  const location = useLocation()

  useEffect(() => {
    // Scroll to top instantly on route change
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

    // Remove all page-specific classes
    document.body.classList.remove(
      'home-page',
      'cpu-page',
      'graphics-page',
      'uber-page',
      'admin-page'
    )

    // Add class based on current route
    if (location.pathname === '/') {
      document.body.classList.add('home-page')
    } else if (location.pathname.startsWith('/projects/cpu/')) {
      document.body.classList.add('cpu-page')
    } else if (location.pathname.startsWith('/projects/graphics-engine/')) {
      document.body.classList.add('graphics-page')
    } else if (location.pathname.startsWith('/projects/uber/')) {
      document.body.classList.add('uber-page')
    } else if (location.pathname === '/admin') {
      document.body.classList.add('admin-page')
    }
  }, [location])

  return (
    <>
      {/* Mounted once, outside <Routes>, so the Cmd/Ctrl-K shortcut works on
          every page. Renders null until opened, so it costs nothing at rest. */}
      <CommandPalette />

      {/* The boundary wraps Suspense, not the other way round, so it catches
          both a page that throws while rendering and a chunk that fails to
          load. resetKey clears a captured error when the visitor navigates
          away - see the note in ErrorBoundary about why this is not a `key`. */}
      <ErrorBoundary resetKey={location.pathname}>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/resume" element={<ResumePage />} />
            <Route path="/admin" element={<AdminPage />} />

            {/* CPU Project */}
            <Route path="/projects/cpu/demo" element={<CPUSimulatorPage />} />
            <Route path="/projects/cpu/docs" element={<CpuDocsLanding />} />
            <Route path="/projects/cpu/docs/alu" element={<CpuAluPage />} />
            <Route path="/projects/cpu/docs/regfile" element={<CpuRegfilePage />} />
            <Route path="/projects/cpu/docs/multdiv" element={<CpuMultdivPage />} />
            <Route path="/projects/cpu/docs/pipeline" element={<CpuPipelinePage />} />
            <Route path="/projects/cpu/docs/hazards" element={<CpuHazardsPage />} />
            <Route path="/projects/cpu/docs/instructions" element={<CpuInstructionsPage />} />
            <Route path="/projects/cpu/docs/memory" element={<CpuMemoryPage />} />

            {/* Graphics Engine Project */}
            <Route path="/projects/graphics-engine/demo" element={<GraphicsWasmPage />} />
            <Route path="/projects/graphics-engine/docs" element={<DocsPage />} />
            <Route path="/projects/graphics-engine/docs/core-rendering" element={<GraphicsCoreRenderingPage />} />
            <Route path="/projects/graphics-engine/docs/transforms-textures" element={<GraphicsTransformsPage />} />
            <Route path="/projects/graphics-engine/docs/paths-gradients" element={<GraphicsPathsPage />} />
            <Route path="/projects/graphics-engine/docs/advanced-geometry" element={<GraphicsAdvancedGeometryPage />} />
            <Route path="/projects/graphics-engine/docs/final-features" element={<GraphicsFinalFeaturesPage />} />
            <Route path="/projects/graphics-engine/docs/optimization-performance" element={<GraphicsOptimizationPage />} />

            {/* Uber Algorithmic System Project */}
            <Route path="/projects/uber/docs" element={<UberDocsLanding />} />
            <Route path="/projects/uber/docs/algorithm" element={<UberAlgorithmPage />} />
            <Route path="/projects/uber/docs/kdtree" element={<UberKdtreePage />} />
            <Route path="/projects/uber/docs/pathfinding" element={<UberPathfindingPage />} />
            <Route path="/projects/uber/docs/bonus" element={<UberBonusPage />} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </>
  )
}

function App() {
  return (
    /*
     * v7_startTransition wraps React Router's internal location update in
     * React.startTransition. Without it, navigating to a lazy route swaps
     * straight to the Suspense fallback - the page you were reading vanishes
     * and is replaced by a loading state. With it, React holds the current
     * page on screen until the next chunk has arrived, so code splitting
     * becomes invisible during navigation rather than adding a flash to it.
     */
    <BrowserRouter future={{ v7_startTransition: true }}>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
