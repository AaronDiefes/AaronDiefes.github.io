import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CPUSimulatorPage from './pages/CPUSimulatorPage'
import GraphicsDemoPage from './pages/GraphicsDemoPage'
import GraphicsWasmPage from './pages/GraphicsWasmPage'
import AdminPage from './pages/AdminPage'
import DocsPage from './pages/DocsPage'

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
      'admin-page'
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
