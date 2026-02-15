import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../components/shared/Breadcrumbs'

function GraphicsDemoPage() {
  const canvasRef = useRef(null)
  const [shapeType, setShapeType] = useState('rect')
  const [color, setColor] = useState('#667eea')
  const [opacity, setOpacity] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [scale, setScale] = useState(100)
  const [blendMode, setBlendMode] = useState('source-over')
  const [animating, setAnimating] = useState(false)
  const animationIdRef = useRef(null)

  useEffect(() => {
    // Draw initial shape
    drawShape()
  }, [])

  useEffect(() => {
    if (animating) {
      animate()
    } else {
      if (animationIdRef.current) {
        clearTimeout(animationIdRef.current)
      }
    }

    return () => {
      if (animationIdRef.current) {
        clearTimeout(animationIdRef.current)
      }
    }
  }, [animating, rotation])

  const hexToRgba = (hex, alpha) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  const drawShape = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const x = Math.random() * (canvas.width - 200) + 100
    const y = Math.random() * (canvas.height - 200) + 100
    const size = 50

    const fillColor = hexToRgba(color, opacity / 100)
    const rotationRad = (rotation * Math.PI) / 180
    const scaleValue = scale / 100

    ctx.save()
    ctx.globalCompositeOperation = blendMode
    ctx.translate(x, y)
    ctx.rotate(rotationRad)
    ctx.scale(scaleValue, scaleValue)

    ctx.fillStyle = fillColor
    ctx.strokeStyle = fillColor
    ctx.lineWidth = 3

    switch(shapeType) {
      case 'rect':
        ctx.fillRect(-size/2, -size/2, size, size)
        break
      case 'circle':
        ctx.beginPath()
        ctx.arc(0, 0, size/2, 0, Math.PI * 2)
        ctx.fill()
        break
      case 'triangle':
        ctx.beginPath()
        ctx.moveTo(0, -size/2)
        ctx.lineTo(size/2, size/2)
        ctx.lineTo(-size/2, size/2)
        ctx.closePath()
        ctx.fill()
        break
      case 'line':
        ctx.beginPath()
        ctx.moveTo(-size/2, -size/2)
        ctx.lineTo(size/2, size/2)
        ctx.stroke()
        break
      case 'polygon':
        const sides = 6
        ctx.beginPath()
        for (let i = 0; i < sides; i++) {
          const angle = (i * 2 * Math.PI) / sides
          const px = (size/2) * Math.cos(angle)
          const py = (size/2) * Math.sin(angle)
          if (i === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.closePath()
        ctx.fill()
        break
    }

    ctx.restore()
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  const animate = () => {
    if (!animating) return

    setRotation(prev => (prev + 5) % 360)
    drawShape()

    animationIdRef.current = setTimeout(() => {
      requestAnimationFrame(animate)
    }, 100)
  }

  const toggleAnimation = () => {
    setAnimating(prev => !prev)
  }

  const handleCanvasClick = () => {
    drawShape()
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Graphics Engine', href: '/projects/graphics-engine/wasm' },
    { label: 'JS Demo' }
  ]

  return (
    <div>
      <style>{`
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
            color: #333;
            min-height: 100vh;
            padding: 2rem;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }

        header {
            background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
            color: white;
            padding: 2rem;
            text-align: center;
        }

        header h1 {
            margin-bottom: 0.5rem;
        }

        header p {
            opacity: 0.9;
            font-size: 1.1rem;
        }

        .content {
            display: grid;
            grid-template-columns: 300px 1fr;
            gap: 2rem;
            padding: 2rem;
        }

        .controls {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 8px;
        }

        .control-group {
            margin-bottom: 1.5rem;
        }

        .control-group label {
            display: block;
            font-weight: 600;
            margin-bottom: 0.5rem;
            color: #2c3e50;
        }

        .control-group select,
        .control-group input[type="range"],
        .control-group input[type="color"] {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
        }

        .control-group input[type="range"] {
            padding: 0;
        }

        button {
            width: 100%;
            padding: 0.75rem;
            background: #2E7D32;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s;
            margin-bottom: 0.5rem;
        }

        button:hover {
            background: #1B5E20;
        }

        button.secondary {
            background: #e74c3c;
        }

        button.secondary:hover {
            background: #c0392b;
        }

        .canvas-container {
            background: #f0f0f0;
            border-radius: 8px;
            padding: 1rem;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        #canvas {
            background: white;
            border: 2px solid #ddd;
            cursor: crosshair;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .value-display {
            display: inline-block;
            float: right;
            color: #2E7D32;
            font-weight: 600;
        }

        .info {
            background: #e8f4f8;
            padding: 1rem;
            border-radius: 4px;
            margin-bottom: 1rem;
            font-size: 0.9rem;
            line-height: 1.6;
        }

        footer {
            background: #2c3e50;
            color: white;
            text-align: center;
            padding: 1rem;
        }

        footer a {
            color: #2E7D32;
            text-decoration: none;
        }

        footer a:hover {
            text-decoration: underline;
        }

        @media (max-width: 900px) {
            .content {
                grid-template-columns: 1fr;
            }
        }

        @media (max-width: 480px) {
            body {
                padding: 1rem;
            }

            header h1 {
                font-size: 1.5rem;
            }
        }
      `}</style>

      <Breadcrumbs items={breadcrumbItems} />

      <div className="container">
        <header>
          <h1>2D Graphics Engine Demo</h1>
          <p>Interactive demonstration of a C++ graphics engine with shape rendering, transformations, and shaders</p>
        </header>

        <div className="content">
          <div className="controls">
            <div className="info">
              This demo showcases the capabilities of my custom 2D graphics engine built in C++. Use the controls to draw shapes and apply transformations.
            </div>

            <div className="control-group">
              <label>Shape Type</label>
              <select
                id="shapeType"
                value={shapeType}
                onChange={(e) => setShapeType(e.target.value)}
              >
                <option value="rect">Rectangle</option>
                <option value="circle">Circle</option>
                <option value="triangle">Triangle</option>
                <option value="line">Line</option>
                <option value="polygon">Polygon</option>
              </select>
            </div>

            <div className="control-group">
              <label>
                Color
                <input
                  type="color"
                  id="colorPicker"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                />
              </label>
            </div>

            <div className="control-group">
              <label>
                Opacity
                <span className="value-display" id="opacityValue">{opacity}%</span>
              </label>
              <input
                type="range"
                id="opacity"
                min="0"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label>
                Rotation
                <span className="value-display" id="rotationValue">{rotation}°</span>
              </label>
              <input
                type="range"
                id="rotation"
                min="0"
                max="360"
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label>
                Scale
                <span className="value-display" id="scaleValue">{(scale / 100).toFixed(1)}x</span>
              </label>
              <input
                type="range"
                id="scale"
                min="10"
                max="200"
                value={scale}
                onChange={(e) => setScale(Number(e.target.value))}
              />
            </div>

            <div className="control-group">
              <label>Blend Mode</label>
              <select
                id="blendMode"
                value={blendMode}
                onChange={(e) => setBlendMode(e.target.value)}
              >
                <option value="source-over">Normal</option>
                <option value="multiply">Multiply</option>
                <option value="screen">Screen</option>
                <option value="overlay">Overlay</option>
                <option value="difference">Difference</option>
              </select>
            </div>

            <button id="drawBtn" onClick={drawShape}>Draw Shape</button>
            <button className="secondary" id="clearBtn" onClick={clearCanvas}>Clear Canvas</button>
            <button
              id="animateBtn"
              onClick={toggleAnimation}
              style={{
                background: animating ? '#e74c3c' : '#2E7D32'
              }}
            >
              {animating ? 'Stop Animation' : 'Animate Shapes'}
            </button>
          </div>

          <div className="canvas-container">
            <canvas
              ref={canvasRef}
              id="canvas"
              width="700"
              height="600"
              onClick={handleCanvasClick}
            />
          </div>
        </div>

        <footer>
          <p>Built by Aaron Diefes | <Link to="/">Back to Home</Link> | <Link to="/admin">View Source Code</Link></p>
        </footer>
      </div>
    </div>
  )
}

export default GraphicsDemoPage
