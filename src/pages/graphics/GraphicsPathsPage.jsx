import React, { useState } from 'react'
import DocsLayout from '../../components/docs/DocsLayout'
import DocsSection from '../../components/docs/DocsSection'

function GraphicsPathsPage() {
  const [activeTab, setActiveTab] = useState('construction')

  const tocItems = [
    { id: 'vector-graphics-and-gradient-shading', label: 'Vector Graphics and Gradient Shading', level: 2 },
    {
      id: 'construction',
      label: 'Path Construction',
      level: 2,
      onClick: () => {
        setActiveTab('construction')
        requestAnimationFrame(() => {
          document.getElementById('construction')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      },
    },
    {
      id: 'winding',
      label: 'Winding Fill Rule',
      level: 2,
      onClick: () => {
        setActiveTab('winding')
        requestAnimationFrame(() => {
          document.getElementById('winding')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      },
    },
    {
      id: 'linear',
      label: 'Linear Gradient',
      level: 2,
      onClick: () => {
        setActiveTab('linear')
        requestAnimationFrame(() => {
          document.getElementById('linear')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      },
    },
    {
      id: 'radial',
      label: 'Radial Gradient',
      level: 2,
      onClick: () => {
        setActiveTab('radial')
        requestAnimationFrame(() => {
          document.getElementById('radial')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      },
    },
  ]

  return (
    <DocsLayout
      project="graphics"
      currentSlug="paths-gradients"
      title="Paths & Gradients"
      subtitle="Vector Paths, Winding Fill, and Color Gradients"
      tocItems={tocItems}
    >
      <style>{`
        /* Page-specific content styles only — layout chrome comes from docs-layout.css */
        .docs-layout .docs-content h3 {
            color: #2c3e50;
            margin-top: 2rem;
            margin-bottom: 1rem;
            font-size: 1.5rem;
        }

        .docs-layout .docs-content h4 {
            color: #2c3e50;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            font-size: 1.25rem;
        }

        .docs-layout .docs-content p {
            margin-bottom: 1rem;
            line-height: 1.8;
            color: #555;
        }

        .docs-layout .docs-content ul {
            margin-bottom: 1rem;
            line-height: 1.8;
            color: #555;
            padding-left: 2rem;
        }

        .docs-layout .docs-content li {
            margin-bottom: 0.5rem;
        }

        .docs-layout .docs-content code {
            background: #f5f5f5;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 0.9rem;
            color: #c7254e;
        }

        .docs-layout .docs-content .code-block {
            background: #1e1e1e;
            color: #d4d4d4;
            padding: 1.5rem;
            border-radius: 8px;
            overflow-x: auto;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 0.9rem;
            line-height: 1.6;
            margin: 1.5rem 0;
            white-space: pre;
        }

        .docs-layout .docs-content .code-block .keyword { color: #569cd6; }
        .docs-layout .docs-content .code-block .comment { color: #6a9955; }
        .docs-layout .docs-content .code-block .signal { color: #9cdcfe; }
        .docs-layout .docs-content .code-block .operator { color: #d4d4d4; }
        .docs-layout .docs-content .code-block .number { color: #b5cea8; }
        .docs-layout .docs-content .code-block .string { color: #ce9178; }

        .docs-layout .docs-content .note {
            background: #f0f7ff;
            border-left: 4px solid #2E7D32;
            padding: 1rem 1.5rem;
            margin: 1.5rem 0;
            border-radius: 4px;
        }

        .docs-layout .docs-content .note strong {
            color: #2E7D32;
        }

        .docs-layout .docs-content .tabs-container {
            background: white;
            padding: 2rem;
            margin-bottom: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .docs-layout .docs-content .tabs-header {
            display: flex;
            gap: 0.5rem;
            border-bottom: 2px solid #e0e0e0;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }

        .docs-layout .docs-content .tab-button {
            padding: 0.75rem 1.5rem;
            background: transparent;
            border: none;
            border-bottom: 3px solid transparent;
            color: #555;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            margin-bottom: -2px;
        }

        .docs-layout .docs-content .tab-button:hover {
            color: #2E7D32;
            background: #f5f5f5;
        }

        .docs-layout .docs-content .tab-button.active {
            color: #2E7D32;
            border-bottom-color: #2E7D32;
            background: transparent;
        }

        .docs-layout .docs-content .tab-panel {
            display: none;
        }

        .docs-layout .docs-content .tab-panel.active {
            display: block;
            animation: fadeIn 0.3s;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 768px) {
            .docs-layout .docs-content .tabs-header {
                flex-direction: column;
            }

            .docs-layout .docs-content .tab-button {
                width: 100%;
                text-align: left;
            }
        }
      `}</style>

      <DocsSection id="vector-graphics-and-gradient-shading" title="Vector Graphics and Gradient Shading">
        <p>
          This section introduces two fundamental computer graphics concepts: <strong>vector paths</strong> and <strong>gradient shaders</strong>.
          These capabilities move beyond simple rectangles and solid colors, enabling complex shapes and smooth color transitions.
        </p>
        <p>
          The <code>GPath</code> class constructs general vector shapes from commands like <code>moveTo</code>, <code>lineTo</code>, and <code>quadTo</code>.
          The <strong>winding fill rule</strong> determines which pixels fall "inside" the path—essential for handling self-intersecting
          and nested shapes correctly.
        </p>
        <p>
          Gradient shaders compute pixel colors based on spatial position. <strong>Linear gradients</strong> project each pixel onto
          a gradient vector to determine its color. <strong>Radial gradients</strong> calculate distance from a center point, creating
          concentric circles of color.
        </p>
      </DocsSection>

      {/* Tabs container — wrapped in <section className="section"> manually since tabs have no h2 of their own. */}
      <section className="section tabs-container">
          <div className="tabs-header">
            <button
              className={`tab-button ${activeTab === 'construction' ? 'active' : ''}`}
              onClick={() => setActiveTab('construction')}
            >
              Path Construction
            </button>
            <button
              className={`tab-button ${activeTab === 'winding' ? 'active' : ''}`}
              onClick={() => setActiveTab('winding')}
            >
              Winding Fill Rule
            </button>
            <button
              className={`tab-button ${activeTab === 'linear' ? 'active' : ''}`}
              onClick={() => setActiveTab('linear')}
            >
              Linear Gradient
            </button>
            <button
              className={`tab-button ${activeTab === 'radial' ? 'active' : ''}`}
              onClick={() => setActiveTab('radial')}
            >
              Radial Gradient
            </button>
          </div>

          <div className="tabs-content">
            {/* Tab 1: Path Construction */}
            <div id="construction" className={`tab-panel ${activeTab === 'construction' ? 'active' : ''}`}>
              <h3>GPath: Command-Based Path Construction</h3>
              <p>
                The <code>GPath</code> class represents complex vector shapes as a sequence of drawing commands.
                Rather than storing only final geometry, it maintains a command buffer that can be transformed,
                analyzed, and rasterized on demand.
              </p>

              <h4>Path Building: Adding a Rectangle</h4>
              <p>
                Building a path involves issuing commands like <code>moveTo</code> (move the pen without drawing)
                and <code>lineTo</code> (draw a line to the target point). The <code>addRect</code> function
                demonstrates how high-level shapes are constructed from these primitives.
              </p>
              <p>
                Notice the direction parameter: clockwise or counter-clockwise winding affects how overlapping
                paths interact under the fill rule.
              </p>

              <pre className="code-block">
  <span className="comment">// From path_ops.h - GPath::addRect implementation</span><br/>
  <span className="keyword">void</span> <span className="signal">GPath</span>::<span className="signal">addRect</span>(<span className="keyword">const</span> <span className="signal">GRect</span><span className="operator">&amp;</span> <span className="signal">r</span>, <span className="signal">GPath</span>::<span className="signal">Direction</span> <span className="signal">dir</span>) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">this</span><span className="operator">-&gt;</span><span className="signal">moveTo</span>(<span className="signal">r</span>.<span className="signal">left</span>, <span className="signal">r</span>.<span className="signal">top</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span>(<span className="signal">dir</span> <span className="operator">==</span> <span className="signal">kCW_Direction</span>)&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">this</span><span className="operator">-&gt;</span><span className="signal">lineTo</span>(<span className="signal">r</span>.<span className="signal">right</span>, <span className="signal">r</span>.<span className="signal">top</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">this</span><span className="operator">-&gt;</span><span className="signal">lineTo</span>(<span className="signal">r</span>.<span className="signal">right</span>, <span className="signal">r</span>.<span className="signal">bottom</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">this</span><span className="operator">-&gt;</span><span className="signal">lineTo</span>(<span className="signal">r</span>.<span className="signal">left</span>, <span className="signal">r</span>.<span className="signal">bottom</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">this</span><span className="operator">-&gt;</span><span className="signal">lineTo</span>(<span className="signal">r</span>.<span className="signal">left</span>, <span className="signal">r</span>.<span className="signal">top</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">else</span>&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">this</span><span className="operator">-&gt;</span><span className="signal">lineTo</span>(<span className="signal">r</span>.<span className="signal">left</span>, <span className="signal">r</span>.<span className="signal">bottom</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">this</span><span className="operator">-&gt;</span><span className="signal">lineTo</span>(<span className="signal">r</span>.<span className="signal">right</span>, <span className="signal">r</span>.<span className="signal">bottom</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">this</span><span className="operator">-&gt;</span><span className="signal">lineTo</span>(<span className="signal">r</span>.<span className="signal">right</span>, <span className="signal">r</span>.<span className="signal">top</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">this</span><span className="operator">-&gt;</span><span className="signal">lineTo</span>(<span className="signal">r</span>.<span className="signal">left</span>, <span className="signal">r</span>.<span className="signal">top</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span>;<br/>
  &#125;
              </pre>

              <h4>Path Iteration with Edger</h4>
              <p>
                The <code>GPath::Edger</code> iterates through path commands, decomposing complex shapes into
                renderable edges. Each verb type (kMove, kLine, kQuad, kCubic) provides the necessary points
                for that segment.
              </p>
              <p>
                This iteration pattern separates path construction from path rendering—the same path can be
                stroked, filled, or analyzed for bounds without changing the underlying representation.
              </p>

              <pre className="code-block">
  <span className="comment">// From path_ops.h - Iterating path commands for bounds calculation</span><br/>
  <span className="signal">GPath</span>::<span className="signal">Edger</span> <span className="signal">iter</span>(<span className="operator">*</span><span className="keyword">this</span>);<br/>
  <span className="signal">std</span>::<span className="signal">vector</span><span className="operator">&lt;</span><span className="keyword">float</span><span className="operator">&gt;</span> <span className="signal">candidate_x</span>;<br/>
  <span className="signal">std</span>::<span className="signal">vector</span><span className="operator">&lt;</span><span className="keyword">float</span><span className="operator">&gt;</span> <span className="signal">candidate_y</span>;<br/>
  <br/>
  <span className="keyword">while</span>(<span className="keyword">auto</span> <span className="signal">v</span> <span className="operator">=</span> <span className="signal">iter</span>.<span className="signal">next</span>(<span className="signal">curr_points</span>)) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">switch</span>(<span className="signal">v</span>.<span className="signal">value</span>())&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">case</span> <span className="signal">GPath</span>::<span className="signal">kMove</span>:<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">candidate_x</span>.<span className="signal">push_back</span>(<span className="signal">curr_points</span>[<span className="number">0</span>].<span className="signal">x</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">candidate_y</span>.<span className="signal">push_back</span>(<span className="signal">curr_points</span>[<span className="number">0</span>].<span className="signal">y</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">break</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">case</span> <span className="signal">GPath</span>::<span className="signal">kLine</span>:<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">candidate_x</span>.<span className="signal">push_back</span>(<span className="signal">curr_points</span>[<span className="number">0</span>].<span className="signal">x</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">candidate_y</span>.<span className="signal">push_back</span>(<span className="signal">curr_points</span>[<span className="number">0</span>].<span className="signal">y</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">candidate_x</span>.<span className="signal">push_back</span>(<span className="signal">curr_points</span>[<span className="number">1</span>].<span className="signal">x</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">candidate_y</span>.<span className="signal">push_back</span>(<span className="signal">curr_points</span>[<span className="number">1</span>].<span className="signal">y</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">break</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">case</span> <span className="signal">GPath</span>::<span className="signal">kQuad</span>:<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Handle quadratic bezier...</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">break</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">case</span> <span className="signal">GPath</span>::<span className="signal">kCubic</span>:<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Handle cubic bezier...</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">break</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &#125;
              </pre>

              <h4>Constructing Circles from Quadratic Beziers</h4>
              <p>
                True circles can be approximated using quadratic Bezier curves. The <code>addCircle</code>
                function uses 8 quadratic segments with carefully chosen control points to create a smooth circle.
              </p>
              <p>
                The magic value <code>0.41421356237</code> (approximately <code>√2 - 1</code>) positions
                the control points to minimize curvature error, ensuring the quadratics closely match a perfect circle.
              </p>

              <pre className="code-block">
  <span className="comment">// From path_ops.h - GPath::addCircle with quadratic approximation</span><br/>
  <span className="keyword">this</span><span className="operator">-&gt;</span><span className="signal">moveTo</span>(<span className="signal">unit_points</span>[<span className="number">0</span>]);<br/>
  <br/>
  <span className="keyword">if</span>(<span className="signal">dir</span> <span className="operator">==</span> <span className="signal">kCCW_Direction</span>)&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">this</span><span className="operator">-&gt;</span><span className="signal">quadTo</span>(<span className="signal">unit_points</span>[<span className="number">1</span>], <span className="signal">unit_points</span>[<span className="number">2</span>]);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">this</span><span className="operator">-&gt;</span><span className="signal">quadTo</span>(<span className="signal">unit_points</span>[<span className="number">3</span>], <span className="signal">unit_points</span>[<span className="number">4</span>]);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">this</span><span className="operator">-&gt;</span><span className="signal">quadTo</span>(<span className="signal">unit_points</span>[<span className="number">5</span>], <span className="signal">unit_points</span>[<span className="number">6</span>]);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">this</span><span className="operator">-&gt;</span><span className="signal">quadTo</span>(<span className="signal">unit_points</span>[<span className="number">7</span>], <span className="signal">unit_points</span>[<span className="number">8</span>]);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">this</span><span className="operator">-&gt;</span><span className="signal">quadTo</span>(<span className="signal">unit_points</span>[<span className="number">9</span>], <span className="signal">unit_points</span>[<span className="number">10</span>]);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">this</span><span className="operator">-&gt;</span><span className="signal">quadTo</span>(<span className="signal">unit_points</span>[<span className="number">11</span>], <span className="signal">unit_points</span>[<span className="number">12</span>]);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">this</span><span className="operator">-&gt;</span><span className="signal">quadTo</span>(<span className="signal">unit_points</span>[<span className="number">13</span>], <span className="signal">unit_points</span>[<span className="number">14</span>]);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">this</span><span className="operator">-&gt;</span><span className="signal">quadTo</span>(<span className="signal">unit_points</span>[<span className="number">15</span>], <span className="signal">unit_points</span>[<span className="number">0</span>]);<br/>
  &#125;
              </pre>

              <p className="note">
                <strong>Key Insight:</strong> Path construction is declarative—you describe what shape you want,
                and the rasterizer handles the pixel-level details. This separation of concerns is fundamental
                to scalable vector graphics.
              </p>
            </div>

            {/* Tab 2: Winding Fill Rule */}
            <div id="winding" className={`tab-panel ${activeTab === 'winding' ? 'active' : ''}`}>
              <h3>The Winding Number Fill Rule</h3>
              <p>
                Given a complex path, how do we determine which pixels are "inside" the shape? The <strong>winding number
                algorithm</strong> provides the answer. As we scan across each row of pixels, we track a winding count
                that increments when crossing left-to-right edges and decrements for right-to-left edges.
              </p>
              <p>
                The <strong>non-zero winding rule</strong> states: a pixel is inside the path if its winding count
                is non-zero. This handles self-intersecting paths elegantly—regions where the path winds around multiple
                times remain filled, while regions where winding cancels out are left empty.
              </p>

              <h4>The Algorithm in Practice</h4>
              <p>
                The <code>drawPath</code> function implements winding fill by scanning each horizontal row from top to bottom.
                At each row, we process edges in left-to-right order, maintaining the winding count <code>w</code>.
              </p>
              <p>
                When <code>w</code> transitions from 0 to non-zero, we've entered the shape—record the left boundary.
                When <code>w</code> returns to 0, we've exited—record the right boundary and fill that span.
              </p>

              <pre className="code-block">
  <span className="comment">// From my_canvas.cpp - Winding fill implementation</span><br/>
  <span className="keyword">for</span>(<span className="keyword">int</span> <span className="signal">y</span> <span className="operator">=</span> <span className="signal">yMin</span>; <span className="signal">y</span> <span className="operator">&lt;</span> <span className="signal">yMax</span>; <span className="signal">y</span><span className="operator">++</span>)&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">size_t</span> <span className="signal">i</span> <span className="operator">=</span> <span className="number">0</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">w</span> <span className="operator">=</span> <span className="number">0</span>;&nbsp;&nbsp;<span className="comment">// Winding count</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">L</span> <span className="operator">=</span> <span className="number">0</span>;&nbsp;&nbsp;<span className="comment">// Left boundary</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">R</span> <span className="operator">=</span> <span className="number">0</span>;&nbsp;&nbsp;<span className="comment">// Right boundary</span><br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Loop through active edges at this y value</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">while</span> (<span className="signal">i</span> <span className="operator">&lt;</span> <span className="signal">edges</span>.<span className="signal">size</span>() <span className="operator">&amp;&amp;</span> <span className="signal">edges</span>[<span className="signal">i</span>].<span className="signal">isValid</span>(<span className="signal">y</span>)) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">x</span> <span className="operator">=</span> <span className="signal">GRoundToInt</span>(<span className="signal">edges</span>[<span className="signal">i</span>].<span className="signal">eval</span>(<span className="signal">y</span>));<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">w</span> <span className="operator">==</span> <span className="number">0</span>) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">L</span> <span className="operator">=</span> <span className="signal">x</span>;&nbsp;&nbsp;<span className="comment">// Entering shape - mark left edge</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">w</span> <span className="operator">+=</span> <span className="signal">edges</span>[<span className="signal">i</span>].<span className="signal">dire</span>;&nbsp;&nbsp;<span className="comment">// Update winding count (+1 or -1)</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">w</span> <span className="operator">==</span> <span className="number">0</span>) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">R</span> <span className="operator">=</span> <span className="signal">x</span>;&nbsp;&nbsp;<span className="comment">// Exiting shape - mark right edge</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Fill pixels from L to R</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span>(<span className="signal">paint</span>.<span className="signal">getShader</span>())&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Apply shader across span...</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">else</span>&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span>(<span className="signal">R</span><span className="operator">-</span><span className="signal">L</span> <span className="operator">&gt;</span> <span className="number">0</span>)&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">blitRow</span>(<span className="signal">L</span>, <span className="signal">y</span>, <span className="signal">R</span> <span className="operator">-</span> <span className="signal">L</span>, <span className="signal">proc</span>, <span className="signal">fDevice</span>, <span className="signal">src</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Move to next edge or remove if complete</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">edges</span>[<span className="signal">i</span>].<span className="signal">isValid</span>(<span className="signal">y</span><span className="operator">+</span><span className="number">1</span>)) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">i</span> <span className="operator">+=</span> <span className="number">1</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">else</span> &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">edges</span>.<span className="signal">erase</span>(<span className="signal">edges</span>.<span className="signal">begin</span>() <span className="operator">+</span> <span className="signal">i</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">assert</span>(<span className="signal">w</span> <span className="operator">==</span> <span className="number">0</span>);&nbsp;&nbsp;<span className="comment">// Winding must return to zero</span><br/>
  &#125;
              </pre>

              <h4>Why Winding Matters</h4>
              <p>
                The winding rule handles complex scenarios that simpler fill rules cannot:
              </p>
              <ul>
                <li><strong>Self-intersecting paths:</strong> A path that crosses itself creates regions with different winding numbers.</li>
                <li><strong>Nested paths:</strong> A donut shape (outer circle + inner circle) naturally empties the center when both wind the same direction.</li>
                <li><strong>Directional control:</strong> Clockwise vs. counter-clockwise winding allows additive or subtractive regions.</li>
              </ul>

              <p className="note">
                <strong>Mathematical Insight:</strong> The winding number counts how many times the path winds around a point.
                This topological property makes the algorithm robust to path complexity and ensures consistent results.
              </p>
            </div>

            {/* Tab 3: Linear Gradient */}
            <div id="linear" className={`tab-panel ${activeTab === 'linear' ? 'active' : ''}`}>
              <h3>Linear Gradient Shader</h3>
              <p>
                A <strong>linear gradient</strong> interpolates colors along a line defined by two points. Each pixel's
                color is determined by projecting it onto the gradient line—pixels at the start point receive the
                first color, pixels at the end point receive the last color, and pixels in between are interpolated.
              </p>

              <h4>Projection Math</h4>
              <p>
                The key operation is computing the <strong>t-value</strong> (0 to 1) for each pixel. This represents
                how far along the gradient line the pixel projects. We achieve this by transforming pixel coordinates
                into gradient space using an inverse matrix.
              </p>
              <p>
                The transformation matrix aligns the gradient vector (p1 - p0) with the x-axis, simplifying the
                projection to a single coordinate lookup.
              </p>

              <pre className="code-block">
  <span className="comment">// From shader_ops.h - Linear gradient setup</span><br/>
  <span className="keyword">bool</span> <span className="signal">setContext</span>(<span className="keyword">const</span> <span className="signal">GMatrix</span><span className="operator">&amp;</span> <span className="signal">ctm</span>) <span className="keyword">override</span>&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GMatrix</span> <span className="signal">linear_transformation_matrix</span> <span className="operator">=</span> <span className="signal">GMatrix</span>(<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">p1</span>.<span className="signal">x</span> <span className="operator">-</span> <span className="signal">p0</span>.<span className="signal">x</span>,&nbsp;&nbsp;&nbsp;&nbsp;<span className="operator">-</span>(<span className="signal">p1</span>.<span className="signal">y</span> <span className="operator">-</span> <span className="signal">p0</span>.<span className="signal">y</span>),&nbsp;&nbsp;&nbsp;<span className="signal">p0</span>.<span className="signal">x</span>,<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">p1</span>.<span className="signal">y</span> <span className="operator">-</span> <span className="signal">p0</span>.<span className="signal">y</span>,&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">p1</span>.<span className="signal">x</span> <span className="operator">-</span> <span className="signal">p0</span>.<span className="signal">x</span>,&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">p0</span>.<span className="signal">y</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;);<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GMatrix</span> <span className="signal">temp</span> <span className="operator">=</span> <span className="signal">ctm</span> <span className="operator">*</span> <span className="signal">linear_transformation_matrix</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span>(<span className="keyword">auto</span> <span className="signal">inverted</span> <span className="operator">=</span> <span className="signal">temp</span>.<span className="signal">invert</span>())&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">inv</span> <span className="operator">=</span> <span className="operator">*</span><span className="signal">inverted</span>;&nbsp;&nbsp;<span className="comment">// Store inverse for fast per-pixel projection</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> <span className="keyword">true</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> <span className="keyword">false</span>;<br/>
  &#125;
              </pre>

              <h4>Per-Pixel Color Computation</h4>
              <p>
                The <code>shadeRow</code> function computes colors for an entire scanline at once. For each pixel,
                we transform its coordinates, extract the t-value, map it to a color index, and interpolate between
                adjacent color stops.
              </p>
              <p>
                Notice the clamping mode: values outside [0, count-1] are clamped to the edge colors, preventing
                extrapolation artifacts.
              </p>

              <pre className="code-block">
  <span className="comment">// From shader_ops.h - Linear gradient shadeRow (clamp mode)</span><br/>
  <span className="keyword">void</span> <span className="signal">shadeRow</span>(<span className="keyword">int</span> <span className="signal">x</span>, <span className="keyword">int</span> <span className="signal">y</span>, <span className="keyword">int</span> <span className="signal">c</span>, <span className="signal">GPixel</span> <span className="signal">row</span>[]) <span className="keyword">override</span>&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Transform pixel coordinates to gradient space</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">x_prime</span> <span className="operator">=</span> (<span className="signal">inv</span>[<span className="number">0</span>] <span className="operator">*</span> (<span className="signal">x</span> <span className="operator">+</span> <span className="number">0.5f</span>) <span className="operator">+</span> <span className="signal">inv</span>[<span className="number">2</span>] <span className="operator">*</span> (<span className="signal">y</span> <span className="operator">+</span> <span className="number">0.5f</span>) <span className="operator">+</span> <span className="signal">inv</span>[<span className="number">4</span>]) <span className="operator">*</span> (<span className="signal">count</span> <span className="operator">-</span> <span className="number">1</span>);<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">for</span>(<span className="keyword">int</span> <span className="signal">i</span> <span className="operator">=</span> <span className="number">0</span>; <span className="signal">i</span> <span className="operator">&lt;</span> <span className="signal">c</span>; <span className="signal">i</span><span className="operator">++</span>)&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">currX</span> <span className="operator">=</span> <span className="signal">x_prime</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Clamp to valid range</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span>(<span className="signal">currX</span> <span className="operator">&lt;</span> <span className="number">0</span>)&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">currX</span> <span className="operator">=</span> <span className="number">0</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span>(<span className="signal">currX</span> <span className="operator">&gt;</span> <span className="signal">count</span> <span className="operator">-</span> <span className="number">1</span>)&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">currX</span> <span className="operator">=</span> <span className="signal">count</span> <span className="operator">-</span> <span className="number">1</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Find color stops surrounding this position</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">k</span> <span className="operator">=</span> <span className="signal">floor</span>(<span className="signal">currX</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">t</span> <span className="operator">=</span> <span className="signal">currX</span> <span className="operator">-</span> (<span className="keyword">float</span>)<span className="signal">k</span>;&nbsp;&nbsp;<span className="comment">// Fractional position between stops</span><br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Interpolate between colors[k] and colors[k+1]</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GColor</span> <span className="signal">gradient_color</span> <span className="operator">=</span> (<span className="number">1</span><span className="operator">-</span><span className="signal">t</span>)<span className="operator">*</span><span className="signal">gradient_colors</span>[<span className="signal">k</span>] <span className="operator">+</span> (<span className="signal">t</span> <span className="operator">*</span> <span className="signal">gradient_colors</span>[<span className="signal">k</span> <span className="operator">+</span> <span className="number">1</span>]);<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">row</span>[<span className="signal">i</span>] <span className="operator">=</span> <span className="signal">unpremult</span>(<span className="signal">gradient_color</span>);<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">x_prime</span> <span className="operator">+=</span> <span className="signal">inv</span>[<span className="number">0</span>]<span className="operator">*</span>(<span className="signal">count</span> <span className="operator">-</span> <span className="number">1</span>);&nbsp;&nbsp;<span className="comment">// Advance to next pixel</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &#125;
              </pre>

              <h4>Tile Modes</h4>
              <p>
                What happens outside the gradient bounds? The shader supports three tile modes:
              </p>
              <ul>
                <li><strong>Clamp:</strong> Extend edge colors infinitely (shown above)</li>
                <li><strong>Repeat:</strong> Tile the gradient using modulo arithmetic: <code>currX = fmod(currX, count-1)</code></li>
                <li><strong>Mirror:</strong> Alternate forward and backward: flip the gradient when crossing boundaries</li>
              </ul>

              <p className="note">
                <strong>Performance Note:</strong> The inverse matrix computation happens once during setup.
                Per-pixel shading only performs multiplication and addition—no trigonometry or square roots required.
              </p>
            </div>

            {/* Tab 4: Radial Gradient */}
            <div id="radial" className={`tab-panel ${activeTab === 'radial' ? 'active' : ''}`}>
              <h3>Radial Gradient Shader</h3>
              <p>
                A <strong>radial gradient</strong> creates concentric circles of color radiating from a center point.
                Unlike linear gradients that project onto a line, radial gradients measure distance from the center—pixels
                at the center receive the first color, pixels at the radius receive the last color.
              </p>

              <h4>Distance-Based Shading</h4>
              <p>
                The core computation is the Euclidean distance from each pixel to the gradient's center point.
                We normalize this distance by the gradient's radius to obtain a t-value (0 at center, 1 at radius edge).
              </p>
              <p>
                The mathematical formula: <code>distance = sqrt((x - cx)² + (y - cy)²)</code>, then <code>t = distance / radius</code>.
                This t-value maps to the color gradient exactly like linear gradients.
              </p>

              <pre className="code-block">
  <span className="comment">// From shader_ops.h - Radial gradient shadeRow (clamp mode)</span><br/>
  <span className="keyword">void</span> <span className="signal">shadeRow</span>(<span className="keyword">int</span> <span className="signal">x</span>, <span className="keyword">int</span> <span className="signal">y</span>, <span className="keyword">int</span> <span className="signal">c</span>, <span className="signal">GPixel</span> <span className="signal">row</span>[]) <span className="keyword">override</span> &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">x_prime</span> <span className="operator">=</span> (<span className="signal">inv</span>[<span className="number">0</span>] <span className="operator">*</span> (<span className="signal">x</span> <span className="operator">+</span> <span className="number">0.5f</span>) <span className="operator">+</span> <span className="signal">inv</span>[<span className="number">2</span>] <span className="operator">*</span> (<span className="signal">y</span> <span className="operator">+</span> <span className="number">0.5f</span>) <span className="operator">+</span> <span className="signal">inv</span>[<span className="number">4</span>]);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">y_prime</span> <span className="operator">=</span> (<span className="signal">inv</span>[<span className="number">1</span>] <span className="operator">*</span> (<span className="signal">x</span> <span className="operator">+</span> <span className="number">0.5f</span>) <span className="operator">+</span> <span className="signal">inv</span>[<span className="number">3</span>] <span className="operator">*</span> (<span className="signal">y</span> <span className="operator">+</span> <span className="number">0.5f</span>) <span className="operator">+</span> <span className="signal">inv</span>[<span className="number">5</span>]);<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">for</span> (<span className="keyword">int</span> <span className="signal">i</span> <span className="operator">=</span> <span className="number">0</span>; <span className="signal">i</span> <span className="operator">&lt;</span> <span className="signal">c</span>; <span className="signal">i</span><span className="operator">++</span>) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Compute Euclidean distance from center</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">distance</span> <span className="operator">=</span> <span className="signal">sqrt</span>(<span className="signal">pow</span>(<span className="signal">x_prime</span> <span className="operator">-</span> <span className="signal">center</span>.<span className="signal">x</span>, <span className="number">2</span>) <span className="operator">+</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">pow</span>(<span className="signal">y_prime</span> <span className="operator">-</span> <span className="signal">center</span>.<span className="signal">y</span>, <span className="number">2</span>));<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">distance</span> <span className="operator">&lt;</span> <span className="signal">radius</span>) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Normalize distance to [0, 1]</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">t</span> <span className="operator">=</span> <span className="signal">distance</span> <span className="operator">/</span> <span className="signal">radius</span>;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Map t to color index</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">num_colors</span> <span className="operator">=</span> <span className="signal">count</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">color_index</span> <span className="operator">=</span> <span className="signal">t</span> <span className="operator">*</span> (<span className="signal">num_colors</span> <span className="operator">-</span> <span className="number">1</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">k</span> <span className="operator">=</span> <span className="signal">std</span>::<span className="signal">floor</span>(<span className="signal">color_index</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">t_blend</span> <span className="operator">=</span> <span className="signal">color_index</span> <span className="operator">-</span> <span className="signal">k</span>;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GColor</span> <span className="signal">gradient_color</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">k</span> <span className="operator">&lt;</span> <span className="signal">num_colors</span> <span className="operator">-</span> <span className="number">1</span>) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GColor</span> <span className="signal">color0</span> <span className="operator">=</span> <span className="signal">gradient_colors</span>[<span className="signal">k</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GColor</span> <span className="signal">color1</span> <span className="operator">=</span> <span className="signal">gradient_colors</span>[<span className="signal">k</span> <span className="operator">+</span> <span className="number">1</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Interpolate between adjacent color stops</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">gradient_color</span> <span className="operator">=</span> (<span className="number">1</span> <span className="operator">-</span> <span className="signal">t_blend</span>) <span className="operator">*</span> <span className="signal">color0</span> <span className="operator">+</span> <span className="signal">t_blend</span> <span className="operator">*</span> <span className="signal">color1</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">else</span> &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">gradient_color</span> <span className="operator">=</span> <span className="signal">gradient_colors</span>[<span className="signal">num_colors</span> <span className="operator">-</span> <span className="number">1</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">row</span>[<span className="signal">i</span>] <span className="operator">=</span> <span className="signal">unpremult</span>(<span className="signal">gradient_color</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">else</span>&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Outside radius: clamp to final color</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">row</span>[<span className="signal">i</span>] <span className="operator">=</span> <span className="signal">unpremult</span>(<span className="signal">gradient_colors</span>[<span className="signal">count</span> <span className="operator">-</span> <span className="number">1</span>]);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">x_prime</span> <span className="operator">+=</span> <span className="signal">inv</span>[<span className="number">0</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">y_prime</span> <span className="operator">+=</span> <span className="signal">inv</span>[<span className="number">1</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &#125;
              </pre>

              <h4>Tile Modes for Radial Gradients</h4>
              <p>
                Like linear gradients, radial gradients support tile modes that control behavior outside the defined radius:
              </p>
              <ul>
                <li><strong>Clamp:</strong> Pixels beyond the radius receive the final color (shown above)</li>
                <li><strong>Repeat:</strong> The gradient tiles at multiples of the radius: <code>t = fmod(t, 1.0)</code></li>
                <li><strong>Mirror:</strong> The gradient alternates inward/outward at each radius boundary</li>
              </ul>

              <h4>Transformation Support</h4>
              <p>
                The <code>setContext</code> function inverts the current transformation matrix (CTM), allowing radial gradients
                to be transformed along with the canvas. You can scale, rotate, and skew radial gradients, turning circles into
                ellipses or creating directional radial effects.
              </p>

              <pre className="code-block">
  <span className="comment">// From shader_ops.h - Radial gradient context setup</span><br/>
  <span className="keyword">bool</span> <span className="signal">setContext</span>(<span className="keyword">const</span> <span className="signal">GMatrix</span><span className="operator">&amp;</span> <span className="signal">ctm</span>) <span className="keyword">override</span> &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">inv</span> <span className="operator">=</span> <span className="signal">ctm</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="keyword">auto</span> <span className="signal">inverted</span> <span className="operator">=</span> <span className="signal">inv</span>.<span className="signal">invert</span>()) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">inv</span> <span className="operator">=</span> <span className="operator">*</span><span className="signal">inverted</span>;&nbsp;&nbsp;<span className="comment">// Inverse allows pixel &rarr; gradient space transformation</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> <span className="keyword">true</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> <span className="keyword">false</span>;<br/>
  &#125;
              </pre>

              <p className="note">
                <strong>Optimization Consideration:</strong> The square root calculation for distance is unavoidable, but
                modern CPUs have fast hardware implementations. For extremely performance-critical applications, consider
                pre-computing a lookup table or using approximations.
              </p>
            </div>
          </div>
        </section>
    </DocsLayout>
  )
}

export default GraphicsPathsPage
