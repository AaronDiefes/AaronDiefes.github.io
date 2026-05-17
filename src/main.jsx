import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/design-system.css'
import './styles/navigation.css'
import './styles/dropdown.css'
import './styles/visualization.css'
import './styles/global.css'
import './styles/docs-layout.css'
import './styles/docs-tabs.css'
import './styles/demo-layout.css'
import './styles/cpu-demo.css'
import './styles/graphics-demo.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
