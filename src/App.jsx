import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CPUSimulatorPage from './pages/CPUSimulatorPage'
import GraphicsDemoPage from './pages/GraphicsDemoPage'
import GraphicsWasmPage from './pages/GraphicsWasmPage'
import AdminPage from './pages/AdminPage'
import DocsPage from './pages/DocsPage'
import CpuDocsLanding from './pages/cpu/CpuDocsLanding'

// Phase 13 CPU docs - all pages active
import CpuAluPage from './pages/cpu/CpuAluPage'
import CpuRegfilePage from './pages/cpu/CpuRegfilePage'
import CpuMultdivPage from './pages/cpu/CpuMultdivPage'
import CpuPipelinePage from './pages/cpu/CpuPipelinePage'
import CpuHazardsPage from './pages/cpu/CpuHazardsPage'
import CpuInstructionsPage from './pages/cpu/CpuInstructionsPage'
import CpuMemoryPage from './pages/cpu/CpuMemoryPage'

function AppContent() {
  const location = useLocation()

  useEffect(() => {
    // Remove all page-specific classes
    document.body.classList.remove(
      'home-page',
      'cpu-simulator-page',
      'graphics-demo-page',
      'wasm-demo-page',
      'docs-page',
      'admin-page',
      'cpu-docs-page'
    )

    // Add class based on current route
    if (location.pathname === '/') {
      document.body.classList.add('home-page')
    } else if (location.pathname === '/projects/cpu-simulator') {
      document.body.classList.add('cpu-simulator-page')
    } else if (location.pathname === '/projects/graphics-engine') {
      document.body.classList.add('graphics-demo-page')
    } else if (location.pathname === '/projects/graphics-engine/wasm') {
      document.body.classList.add('wasm-demo-page')
    } else if (location.pathname === '/docs') {
      document.body.classList.add('docs-page')
    } else if (location.pathname === '/admin') {
      document.body.classList.add('admin-page')
    } else if (location.pathname.startsWith('/cpu-docs')) {
      document.body.classList.add('cpu-docs-page')
    }
  }, [location])

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/projects/cpu-simulator" element={<CPUSimulatorPage />} />
      <Route path="/projects/graphics-engine" element={<GraphicsDemoPage />} />
      <Route path="/projects/graphics-engine/wasm" element={<GraphicsWasmPage />} />
      <Route path="/docs" element={<DocsPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/cpu-docs" element={<CpuDocsLanding />} />
      <Route path="/cpu-docs/alu" element={<CpuAluPage />} />
      <Route path="/cpu-docs/regfile" element={<CpuRegfilePage />} />
      <Route path="/cpu-docs/multdiv" element={<CpuMultdivPage />} />
      <Route path="/cpu-docs/pipeline" element={<CpuPipelinePage />} />
      <Route path="/cpu-docs/hazards" element={<CpuHazardsPage />} />
      <Route path="/cpu-docs/instructions" element={<CpuInstructionsPage />} />
      <Route path="/cpu-docs/memory" element={<CpuMemoryPage />} />
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
