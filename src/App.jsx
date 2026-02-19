import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

// Top-level pages
import HomePage from './pages/HomePage'
import AdminPage from './pages/AdminPage'

// Graphics Engine pages
import GraphicsWasmPage from './pages/graphics/GraphicsWasmPage'
import DocsPage from './pages/graphics/DocsPage'
import GraphicsCoreRenderingPage from './pages/graphics/GraphicsCoreRenderingPage'
import GraphicsTransformsPage from './pages/graphics/GraphicsTransformsPage'
import GraphicsPathsPage from './pages/graphics/GraphicsPathsPage'
import GraphicsAdvancedGeometryPage from './pages/graphics/GraphicsAdvancedGeometryPage'
import GraphicsFinalFeaturesPage from './pages/graphics/GraphicsFinalFeaturesPage'
import GraphicsOptimizationPage from './pages/graphics/GraphicsOptimizationPage'

// CPU pages
import CPUSimulatorPage from './pages/cpu/CPUSimulatorPage'
import CpuDocsLanding from './pages/cpu/CpuDocsLanding'
import CpuAluPage from './pages/cpu/CpuAluPage'
import CpuRegfilePage from './pages/cpu/CpuRegfilePage'
import CpuMultdivPage from './pages/cpu/CpuMultdivPage'
import CpuPipelinePage from './pages/cpu/CpuPipelinePage'
import CpuHazardsPage from './pages/cpu/CpuHazardsPage'
import CpuInstructionsPage from './pages/cpu/CpuInstructionsPage'
import CpuMemoryPage from './pages/cpu/CpuMemoryPage'

// CS330 Case Study pages
import Cs330DocsLanding from './pages/cs330/Cs330DocsLanding'
import Cs330AlgorithmPage from './pages/cs330/Cs330AlgorithmPage'

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
      'cs330-page',
      'docs-page',
      'admin-page'
    )

    // Add class based on current route
    if (location.pathname === '/') {
      document.body.classList.add('home-page')
    } else if (location.pathname.startsWith('/projects/cpu/')) {
      document.body.classList.add('cpu-page')
    } else if (location.pathname.startsWith('/projects/graphics-engine/')) {
      document.body.classList.add('graphics-page')
    } else if (location.pathname.startsWith('/projects/cs330/')) {
      document.body.classList.add('cs330-page')
    } else if (location.pathname === '/admin') {
      document.body.classList.add('admin-page')
    }
  }, [location])

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
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

      {/* CS330 Case Study Project */}
      <Route path="/projects/cs330/docs" element={<Cs330DocsLanding />} />
      <Route path="/projects/cs330/docs/algorithm" element={<Cs330AlgorithmPage />} />
    </Routes>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
