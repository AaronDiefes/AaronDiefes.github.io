import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { installChunkRecovery } from './lib/chunk-recovery'
import './styles/fonts.css'
import './styles/design-system.css'
import './styles/navigation.css'
import './styles/dropdown.css'
import './styles/visualization.css'
// Must follow design-system.css and visualization.css - they are the only other
// files with a global :root colour block, and equal specificity means the last
// one wins. See the header comment in theme.css.
import './styles/theme.css'
import './styles/global.css'
import './styles/docs-layout.css'
import './styles/docs-tabs.css'
import './styles/docs-content.css'
import './styles/docs-landing.css'
import './styles/home.css'
import './styles/resume.css'
import './styles/command-palette.css'
import './styles/pipeline-flow.css'
import './styles/demo-layout.css'
import './styles/cpu-demo.css'
import './styles/graphics-demo.css'
import './styles/app-shell.css'

// Must run before the first lazy chunk can be requested: it listens for a
// route chunk that 404s after a deploy and reloads once to pick up fresh
// filenames. See the header comment in chunk-recovery.js.
installChunkRecovery()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
