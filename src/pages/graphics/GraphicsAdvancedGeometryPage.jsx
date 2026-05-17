import React, { useState } from 'react'
import DocsLayout from '../../components/docs/DocsLayout'
import DocsSection from '../../components/docs/DocsSection'

function GraphicsAdvancedGeometryPage() {
  const [activeTab, setActiveTab] = useState('bezier')

  const tocItems = [
    { id: 'introduction', label: 'Introduction', level: 2 },
    {
      id: 'bezier',
      label: 'Bezier Curves',
      level: 2,
      onClick: () => {
        setActiveTab('bezier')
        requestAnimationFrame(() => {
          document.getElementById('bezier')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      },
    },
    {
      id: 'mesh',
      label: 'Triangle Meshes',
      level: 2,
      onClick: () => {
        setActiveTab('mesh')
        requestAnimationFrame(() => {
          document.getElementById('mesh')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      },
    },
    {
      id: 'quad',
      label: 'Quad Rendering',
      level: 2,
      onClick: () => {
        setActiveTab('quad')
        requestAnimationFrame(() => {
          document.getElementById('quad')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      },
    },
    {
      id: 'shader',
      label: 'Shader Composition',
      level: 2,
      onClick: () => {
        setActiveTab('shader')
        requestAnimationFrame(() => {
          document.getElementById('shader')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      },
    },
  ]

  return (
    <DocsLayout
      project="graphics"
      currentSlug="advanced-geometry"
      title="Advanced Geometry"
      subtitle="Bezier Curves, Triangle Meshes, and Shader Composition"
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

        .docs-layout .docs-content ul,
        .docs-layout .docs-content ol {
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
        .docs-layout .docs-content .code-block .type { color: #4ec9b0; }
        .docs-layout .docs-content .code-block .function { color: #dcdcaa; }

        .docs-layout .docs-content .demo-instruction {
            background: #f0f8f4;
            border-left: 4px solid #2E7D32;
            padding: 1rem 1.5rem;
            margin: 1.5rem 0;
            border-radius: 4px;
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

      <DocsSection id="introduction" title="Introduction">
        <p>
          This section covers advanced rendering techniques including Bezier curves with adaptive tessellation, triangle meshes,
          (triangle meshes, quad rendering, and shader composition). Together, these assignments introduce
          advanced geometric techniques that enable smooth curves and complex textured surfaces.
        </p>
        <p>
          The engine includes support for quadratic and cubic Bezier curves using adaptive tessellation
          to convert smooth curves into line segments. The engine determines how many segments are needed based
          on the curve's shape, balancing visual smoothness with performance.
        </p>
        <p>
          Triangle mesh rendering with texture mapping, quad patches, and shader
          composition patterns. These features allow arbitrary geometry to be textured and shaded with flexible,
          reusable shader combinations.
        </p>
      </DocsSection>

      {/* Tabs container — wrapped in <section className="section"> manually since tabs have no h2 of their own. */}
      <section className="section tabs-container">
          <div className="tabs-header">
            <button
              className={`tab-button ${activeTab === 'bezier' ? 'active' : ''}`}
              onClick={() => setActiveTab('bezier')}
            >
              Bezier Curves
            </button>
            <button
              className={`tab-button ${activeTab === 'mesh' ? 'active' : ''}`}
              onClick={() => setActiveTab('mesh')}
            >
              Triangle Meshes
            </button>
            <button
              className={`tab-button ${activeTab === 'quad' ? 'active' : ''}`}
              onClick={() => setActiveTab('quad')}
            >
              Quad Rendering
            </button>
            <button
              className={`tab-button ${activeTab === 'shader' ? 'active' : ''}`}
              onClick={() => setActiveTab('shader')}
            >
              Shader Composition
            </button>
          </div>

          <div className="tabs-content">
            {/* Tab Panel 1: Bezier Curves */}
            <div id="bezier" className={`tab-panel ${activeTab === 'bezier' ? 'active' : ''}`}>
              <h3>Bezier Curves and Tessellation</h3>

              <h4>Algorithm Overview</h4>
              <p>
                <strong>Bezier curves</strong> are defined by control points that specify the curve's shape.
                The engine supports two types:
              </p>
              <ul>
                <li><strong>Quadratic Bezier</strong> (3 control points): Simpler curves with one control point</li>
                <li><strong>Cubic Bezier</strong> (4 control points): More expressive curves with two control points</li>
              </ul>
              <p>
                Since curves cannot be rasterized directly, they must be <strong>tessellated</strong> into line segments.
                The engine uses <strong>adaptive tessellation</strong>: it calculates how many segments are needed based
                on the curve's curvature. Tighter curves get more segments for smooth appearance, while flatter curves
                use fewer segments for efficiency.
              </p>
              <p>
                The tessellation algorithm computes a magnitude value <code>E</code> representing the curve's deviation
                from a straight line. The number of segments is determined by <code>ceil(sqrt(mag_E * factor))</code>,
                where the factor depends on the curve type (4 for quadratic, 16 for cubic).
              </p>

              <h4>What the Code Does</h4>
              <p>
                The C++ implementation below shows curve tessellation in the path rendering system. When a path contains
                quadratic or cubic curve segments, the code calculates the appropriate number of line segments and
                evaluates the curve equation at each parameter value <code>t</code> to generate the tessellated points.
              </p>
              <p>
                <strong>Key steps:</strong>
              </p>
              <ol>
                <li>Calculate deviation magnitude <code>E</code> from control points</li>
                <li>Determine segment count based on <code>sqrt(mag_E * factor)</code></li>
                <li>Evaluate Bezier curve equation at evenly spaced <code>t</code> values</li>
                <li>Store tessellated points and clip them into edges for rasterization</li>
              </ol>

              <h4>C++ Implementation</h4>
              <p><strong>File:</strong> <code>my_canvas.cpp</code> (lines 206-258)</p>
              <pre className="code-block">
  <span className="comment">// Quadratic Bezier tessellation</span><br/>
  <span className="keyword">case</span> <span className="signal">GPath</span>::<span className="signal">kQuad</span>: &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">A</span> <span className="operator">=</span> <span className="signal">tempPoints</span>[<span className="number">0</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">B</span> <span className="operator">=</span> <span className="signal">tempPoints</span>[<span className="number">1</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">C</span> <span className="operator">=</span> <span className="signal">tempPoints</span>[<span className="number">2</span>];<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Calculate deviation vector E</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">E</span> <span className="operator">=</span> (<span className="signal">A</span> <span className="operator">-</span> <span className="number">2</span><span className="operator">*</span><span className="signal">B</span> <span className="operator">+</span> <span className="signal">C</span>)<span className="operator">*</span><span className="number">.25f</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">mag_E</span> <span className="operator">=</span> <span className="signal">sqrt</span>(<span className="signal">E</span>.<span className="signal">x</span><span className="operator">*</span><span className="signal">E</span>.<span className="signal">x</span> <span className="operator">+</span> <span className="signal">E</span>.<span className="signal">y</span><span className="operator">*</span><span className="signal">E</span>.<span className="signal">y</span>);<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Adaptive segment count</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">num_segs</span> <span className="operator">=</span> (<span className="keyword">int</span>)<span className="signal">ceil</span>(<span className="signal">sqrt</span>(<span className="signal">mag_E</span><span className="operator">*</span><span className="number">4</span>));<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">storage</span>[<span className="signal">num_segs</span> <span className="operator">+</span> <span className="number">1</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">dt</span> <span className="operator">=</span> <span className="number">1.0f</span><span className="operator">/</span><span className="signal">num_segs</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">t</span> <span className="operator">=</span> <span className="number">0</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">storage</span>[<span className="number">0</span>] <span className="operator">=</span> <span className="signal">A</span>;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Evaluate curve at t values</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">for</span>(<span className="keyword">int</span> <span className="signal">i</span> <span className="operator">=</span> <span className="number">1</span>; <span className="signal">i</span> <span className="operator">&lt;</span> <span className="signal">num_segs</span>; <span className="signal">i</span><span className="operator">++</span>)&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">t</span> <span className="operator">+=</span> <span className="signal">dt</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">storage</span>[<span className="signal">i</span>] <span className="operator">=</span> ((<span className="number">1</span><span className="operator">-</span><span className="signal">t</span>)<span className="operator">*</span>(<span className="number">1</span><span className="operator">-</span><span className="signal">t</span>)<span className="operator">*</span><span className="signal">A</span> <span className="operator">+</span> <span className="number">2</span><span className="operator">*</span><span className="signal">t</span><span className="operator">*</span>(<span className="number">1</span><span className="operator">-</span><span className="signal">t</span>)<span className="operator">*</span><span className="signal">B</span> <span className="operator">+</span> <span className="signal">t</span><span className="operator">*</span><span className="signal">t</span><span className="operator">*</span><span className="signal">C</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">storage</span>[<span className="signal">num_segs</span>] <span className="operator">=</span> <span className="signal">C</span>;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Convert to edges</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">for</span>(<span className="keyword">int</span> <span className="signal">i</span> <span className="operator">=</span> <span className="number">0</span>; <span className="signal">i</span> <span className="operator">&lt;</span> <span className="signal">num_segs</span>; <span className="signal">i</span><span className="operator">++</span>)&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">Edge</span>::<span className="signal">clip</span>(<span className="signal">storage</span>[<span className="signal">i</span>], <span className="signal">storage</span>[<span className="signal">i</span><span className="operator">+</span><span className="number">1</span>], <span className="signal">fDevice</span>, <span className="signal">edges</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">break</span>;<br/>
  &#125;<br/>
  <br/>
  <span className="comment">// Cubic Bezier tessellation</span><br/>
  <span className="keyword">case</span> <span className="signal">GPath</span>::<span className="signal">kCubic</span>: &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">A</span> <span className="operator">=</span> <span className="signal">tempPoints</span>[<span className="number">0</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">B</span> <span className="operator">=</span> <span className="signal">tempPoints</span>[<span className="number">1</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">C</span> <span className="operator">=</span> <span className="signal">tempPoints</span>[<span className="number">2</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">D</span> <span className="operator">=</span> <span className="signal">tempPoints</span>[<span className="number">3</span>];<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Calculate two deviation vectors</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">E0</span> <span className="operator">=</span> <span className="signal">A</span> <span className="operator">-</span> <span className="number">2</span><span className="operator">*</span><span className="signal">B</span> <span className="operator">+</span> <span className="signal">C</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">E1</span> <span className="operator">=</span> <span className="signal">B</span> <span className="operator">-</span> <span className="number">2</span><span className="operator">*</span><span className="signal">C</span> <span className="operator">+</span> <span className="signal">D</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">E</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">E</span>.<span className="signal">x</span> <span className="operator">=</span> <span className="signal">max</span>(<span className="signal">abs</span>(<span className="signal">E0</span>.<span className="signal">x</span>), <span className="signal">abs</span>(<span className="signal">E1</span>.<span className="signal">x</span>));<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">E</span>.<span className="signal">y</span> <span className="operator">=</span> <span className="signal">max</span>(<span className="signal">abs</span>(<span className="signal">E0</span>.<span className="signal">y</span>), <span className="signal">abs</span>(<span className="signal">E1</span>.<span className="signal">y</span>));<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">mag_E</span> <span className="operator">=</span> <span className="signal">sqrt</span>(<span className="signal">E</span>.<span className="signal">x</span><span className="operator">*</span><span className="signal">E</span>.<span className="signal">x</span> <span className="operator">+</span> <span className="signal">E</span>.<span className="signal">y</span><span className="operator">*</span><span className="signal">E</span>.<span className="signal">y</span>);<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Adaptive segment count (higher factor for cubic)</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">num_segs</span> <span className="operator">=</span> (<span className="keyword">int</span>)<span className="signal">ceil</span>(<span className="signal">sqrt</span>((<span className="number">3</span><span className="operator">*</span><span className="signal">mag_E</span>)<span className="operator">*</span><span className="number">16</span>));<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">storage</span>[<span className="signal">num_segs</span> <span className="operator">+</span> <span className="number">1</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">dt</span> <span className="operator">=</span> <span className="number">1.0f</span><span className="operator">/</span><span className="signal">num_segs</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">t</span> <span className="operator">=</span> <span className="number">0</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">storage</span>[<span className="number">0</span>] <span className="operator">=</span> <span className="signal">A</span>;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Evaluate cubic Bezier equation</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">for</span>(<span className="keyword">int</span> <span className="signal">i</span> <span className="operator">=</span> <span className="number">1</span>; <span className="signal">i</span> <span className="operator">&lt;</span> <span className="signal">num_segs</span>; <span className="signal">i</span><span className="operator">++</span>)&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">t</span> <span className="operator">+=</span> <span className="signal">dt</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">storage</span>[<span className="signal">i</span>] <span className="operator">=</span> ((<span className="number">1</span><span className="operator">-</span><span className="signal">t</span>)<span className="operator">*</span>(<span className="number">1</span><span className="operator">-</span><span className="signal">t</span>)<span className="operator">*</span>(<span className="number">1</span><span className="operator">-</span><span className="signal">t</span>) <span className="operator">*</span> <span className="signal">A</span> <span className="operator">+</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="number">3</span> <span className="operator">*</span> (<span className="number">1</span><span className="operator">-</span><span className="signal">t</span>)<span className="operator">*</span>(<span className="number">1</span><span className="operator">-</span><span className="signal">t</span>) <span className="operator">*</span> <span className="signal">t</span> <span className="operator">*</span> <span className="signal">B</span> <span className="operator">+</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="number">3</span> <span className="operator">*</span> (<span className="number">1</span><span className="operator">-</span><span className="signal">t</span>) <span className="operator">*</span> <span className="signal">t</span><span className="operator">*</span><span className="signal">t</span> <span className="operator">*</span> <span className="signal">C</span> <span className="operator">+</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">t</span><span className="operator">*</span><span className="signal">t</span><span className="operator">*</span><span className="signal">t</span> <span className="operator">*</span> <span className="signal">D</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">storage</span>[<span className="signal">num_segs</span>] <span className="operator">=</span> <span className="signal">D</span>;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Convert to edges</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">for</span>(<span className="keyword">int</span> <span className="signal">i</span> <span className="operator">=</span> <span className="number">0</span>; <span className="signal">i</span> <span className="operator">&lt;</span> <span className="signal">num_segs</span>; <span className="signal">i</span><span className="operator">++</span>)&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">Edge</span>::<span className="signal">clip</span>(<span className="signal">storage</span>[<span className="signal">i</span>], <span className="signal">storage</span>[<span className="signal">i</span><span className="operator">+</span><span className="number">1</span>], <span className="signal">fDevice</span>, <span className="signal">edges</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">break</span>;<br/>
  &#125;
              </pre>
            </div>

            {/* Tab Panel 2: Triangle Meshes */}
            <div id="mesh" className={`tab-panel ${activeTab === 'mesh' ? 'active' : ''}`}>
              <h3>Triangle Mesh Rendering</h3>

              <h4>Algorithm Overview</h4>
              <p>
                <strong>Triangle meshes</strong> allow arbitrary 3D geometry to be rendered with texture mapping.
                A mesh consists of:
              </p>
              <ul>
                <li><strong>Vertices</strong>: Position coordinates for each mesh point</li>
                <li><strong>Texture coordinates</strong>: UV coordinates mapping vertices to texture pixels</li>
                <li><strong>Colors</strong> (optional): Per-vertex colors for interpolation</li>
                <li><strong>Index buffer</strong>: Triplets of vertex indices defining triangles</li>
              </ul>
              <p>
                The <code>drawMesh()</code> function processes the index buffer to extract triangles. For each triangle,
                it constructs transformation matrices that map texture coordinates to screen space, enabling correct
                texture sampling across the triangle's surface.
              </p>
              <p>
                The engine supports three mesh modes:
              </p>
              <ol>
                <li><strong>Colors only</strong>: Interpolate vertex colors using a TriColorShader</li>
                <li><strong>Textures only</strong>: Sample texture with ProxyShader transformation</li>
                <li><strong>Colors + Textures</strong>: Compose both effects using ComposeShader</li>
              </ol>

              <h4>What the Code Does</h4>
              <p>
                The implementation below shows the texture-only mesh rendering path. It iterates through triangles
                defined by the index buffer, constructs transformation matrices <code>T</code> (texture space) and
                <code>P</code> (position space), and creates a ProxyShader that applies the texture correctly across
                the triangle's surface.
              </p>
              <p>
                <strong>Key steps:</strong>
              </p>
              <ol>
                <li>Extract three vertices and texture coordinates from index buffer</li>
                <li>Build matrix <code>T</code> from texture coordinate deltas</li>
                <li>Build matrix <code>P</code> from position coordinate deltas</li>
                <li>Create ProxyShader with transformation <code>P * T<sup>-1</sup></code></li>
                <li>Render triangle using the transformed shader</li>
              </ol>

              <h4>C++ Implementation</h4>
              <p><strong>File:</strong> <code>my_canvas.cpp</code> (lines 380-414)</p>
              <pre className="code-block">
  <span className="comment">// drawMesh: Texture-only mode</span><br/>
  <span className="keyword">if</span>(<span className="signal">colors</span> <span className="operator">==</span> <span className="keyword">nullptr</span> <span className="operator">&amp;&amp;</span> <span className="signal">texs</span> <span className="operator">!=</span> <span className="keyword">nullptr</span>)&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">n</span> <span className="operator">=</span> <span className="number">0</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">for</span>(<span className="keyword">int</span> <span className="signal">i</span> <span className="operator">=</span> <span className="number">0</span>; <span className="signal">i</span> <span className="operator">&lt;</span> <span className="signal">count</span>; <span className="signal">i</span><span className="operator">++</span>)&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Extract triangle vertices</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">p0</span> <span className="operator">=</span> <span className="signal">verts</span>[<span className="signal">indices</span>[<span className="signal">n</span><span className="operator">+</span><span className="number">0</span>]];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">p1</span> <span className="operator">=</span> <span className="signal">verts</span>[<span className="signal">indices</span>[<span className="signal">n</span><span className="operator">+</span><span className="number">1</span>]];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">p2</span> <span className="operator">=</span> <span className="signal">verts</span>[<span className="signal">indices</span>[<span className="signal">n</span><span className="operator">+</span><span className="number">2</span>]];<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Extract texture coordinates</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">t0</span> <span className="operator">=</span> <span className="signal">texs</span>[<span className="signal">indices</span>[<span className="signal">n</span><span className="operator">+</span><span className="number">0</span>]];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">t1</span> <span className="operator">=</span> <span className="signal">texs</span>[<span className="signal">indices</span>[<span className="signal">n</span><span className="operator">+</span><span className="number">1</span>]];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">t2</span> <span className="operator">=</span> <span className="signal">texs</span>[<span className="signal">indices</span>[<span className="signal">n</span><span className="operator">+</span><span className="number">2</span>]];<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">points</span>[] <span className="operator">=</span> &#123;<span className="signal">p0</span>, <span className="signal">p1</span>, <span className="signal">p2</span>&#125;;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Build texture coordinate matrix</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GMatrix</span> <span className="signal">T</span> <span className="operator">=</span> <span className="signal">GMatrix</span>(<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">t1</span>.<span className="signal">x</span> <span className="operator">-</span> <span className="signal">t0</span>.<span className="signal">x</span>,&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">t2</span>.<span className="signal">x</span> <span className="operator">-</span> <span className="signal">t0</span>.<span className="signal">x</span>,&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">t0</span>.<span className="signal">x</span>,<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">t1</span>.<span className="signal">y</span> <span className="operator">-</span> <span className="signal">t0</span>.<span className="signal">y</span>,&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">t2</span>.<span className="signal">y</span> <span className="operator">-</span> <span className="signal">t0</span>.<span className="signal">y</span>,&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">t0</span>.<span className="signal">y</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;);<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Build position matrix</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GMatrix</span> <span className="signal">P</span> <span className="operator">=</span> <span className="signal">GMatrix</span>(<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">p1</span>.<span className="signal">x</span> <span className="operator">-</span> <span className="signal">p0</span>.<span className="signal">x</span>,&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">p2</span>.<span className="signal">x</span> <span className="operator">-</span> <span className="signal">p0</span>.<span className="signal">x</span>,&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">p0</span>.<span className="signal">x</span>,<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">p1</span>.<span className="signal">y</span> <span className="operator">-</span> <span className="signal">p0</span>.<span className="signal">y</span>,&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">p2</span>.<span className="signal">y</span> <span className="operator">-</span> <span className="signal">p0</span>.<span className="signal">y</span>,&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">p0</span>.<span className="signal">y</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;);<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Get the base shader from paint</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">auto</span> <span className="signal">real_sh</span> <span className="operator">=</span> <span className="signal">paint</span>.<span className="signal">getShader</span>();<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Invert T to map from screen to texture space</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GMatrix</span> <span className="signal">invT</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span>(<span className="keyword">auto</span> <span className="signal">inverted</span> <span className="operator">=</span> <span className="signal">T</span>.<span className="signal">invert</span>())&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">invT</span> <span className="operator">=</span> <span className="operator">*</span><span className="signal">inverted</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Create proxy shader with composed transformation</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">ProxyShader</span> <span className="signal">proxy</span>(<span className="signal">real_sh</span>,(<span className="signal">P</span> <span className="operator">*</span> <span className="signal">invT</span>));<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPaint</span> <span className="signal">p</span>(<span className="operator">&amp;</span><span className="signal">proxy</span>);<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Render the triangle</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">drawConvexPolygon</span>(<span className="signal">points</span>, <span className="number">3</span>, <span className="signal">p</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">n</span> <span className="operator">+=</span> <span className="number">3</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &#125;
              </pre>

              <h4>Interactive Demo</h4>
              <p className="demo-instruction">
                <strong>Mesh with Texture Mapping:</strong> The mesh demo shows triangles with interpolated texture
                coordinates. Drag vertices to see how the mesh deforms while maintaining texture mapping. The texture
                follows the geometry, demonstrating correct barycentric interpolation.
              </p>
            </div>

            {/* Tab Panel 3: Quad Rendering */}
            <div id="quad" className={`tab-panel ${activeTab === 'quad' ? 'active' : ''}`}>
              <h3>Quad Patch Rendering</h3>

              <h4>Algorithm Overview</h4>
              <p>
                <strong>Quads</strong> are four-sided patches commonly used for rectangular surfaces and texture mapping.
                The <code>drawQuad()</code> function provides a convenient interface for rendering quads with optional
                subdivision.
              </p>
              <p>
                A quad is defined by four corner vertices (A, B, C, D) and uses <strong>bilinear interpolation</strong>
                to map colors and textures across its surface. The quad can be subdivided into multiple sub-quads for
                smoother interpolation, controlled by the <code>level</code> parameter.
              </p>
              <p>
                The algorithm subdivides the quad into <code>(level+1) × (level+1)</code> smaller quads, each rendered
                as two triangles. This subdivision enables smoother gradients and texture mapping across non-planar
                quad surfaces.
              </p>

              <h4>What the Code Does</h4>
              <p>
                The implementation below generates a grid of interpolated points across the quad using bilinear
                interpolation with parameters <code>u</code> and <code>v</code>. Each grid cell becomes two triangles
                rendered via <code>drawMesh()</code>.
              </p>
              <p>
                <strong>Key steps:</strong>
              </p>
              <ol>
                <li>Create <code>(level+2) × (level+2)</code> grid of interpolated vertices</li>
                <li>For each grid point, compute bilinear interpolation: <code>(1-u)(1-v)A + u(1-v)B + uvC + (1-u)vD</code></li>
                <li>Interpolate colors and texture coordinates if provided</li>
                <li>For each grid cell, generate two triangles and render via <code>drawMesh()</code></li>
              </ol>

              <h4>C++ Implementation</h4>
              <p><strong>File:</strong> <code>my_canvas.cpp</code> (lines 482-563)</p>
              <pre className="code-block">
  <span className="keyword">void</span> <span className="signal">MyCanvas</span>::<span className="signal">drawQuad</span>(<span className="keyword">const</span> <span className="signal">GPoint</span> <span className="signal">verts</span>[<span className="number">4</span>], <span className="keyword">const</span> <span className="signal">GColor</span> <span className="signal">colors</span>[<span className="number">4</span>],<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">const</span> <span className="signal">GPoint</span> <span className="signal">texs</span>[<span className="number">4</span>], <span className="keyword">int</span> <span className="signal">level</span>, <span className="keyword">const</span> <span className="signal">GPaint</span><span className="operator">&amp;</span> <span className="signal">paint</span>)<br/>
  &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Allocate grid storage</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span><span className="operator">**</span> <span className="signal">new_quads</span> <span className="operator">=</span> <span className="keyword">new</span> <span className="signal">GPoint</span><span className="operator">*</span>[<span className="signal">level</span><span className="operator">+</span><span className="number">2</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GColor</span><span className="operator">**</span> <span className="signal">new_colors</span> <span className="operator">=</span> <span className="keyword">new</span> <span className="signal">GColor</span><span className="operator">*</span>[<span className="signal">level</span><span className="operator">+</span><span className="number">2</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span><span className="operator">**</span> <span className="signal">new_texs</span> <span className="operator">=</span> <span className="keyword">new</span> <span className="signal">GPoint</span><span className="operator">*</span>[<span className="signal">level</span><span className="operator">+</span><span className="number">2</span>];<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Generate interpolated grid</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">for</span>(<span className="keyword">int</span> <span className="signal">i</span> <span className="operator">=</span> <span className="number">0</span>; <span className="signal">i</span> <span className="operator">&lt;</span> <span className="signal">level</span> <span className="operator">+</span> <span className="number">2</span>; <span className="signal">i</span><span className="operator">++</span>)&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">u</span> <span className="operator">=</span> <span className="keyword">float</span>(<span className="signal">i</span>) <span className="operator">/</span> (<span className="number">1</span> <span className="operator">+</span> <span className="signal">level</span>);<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">new_quads</span>[<span className="signal">i</span>] <span className="operator">=</span> <span className="keyword">new</span> <span className="signal">GPoint</span>[<span className="signal">level</span> <span className="operator">+</span> <span className="number">2</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">new_colors</span>[<span className="signal">i</span>] <span className="operator">=</span> <span className="keyword">new</span> <span className="signal">GColor</span>[<span className="signal">level</span> <span className="operator">+</span> <span className="number">2</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">new_texs</span>[<span className="signal">i</span>] <span className="operator">=</span> <span className="keyword">new</span> <span className="signal">GPoint</span>[<span className="signal">level</span> <span className="operator">+</span> <span className="number">2</span>];<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">for</span>(<span className="keyword">int</span> <span className="signal">j</span> <span className="operator">=</span> <span className="number">0</span>; <span className="signal">j</span> <span className="operator">&lt;</span> <span className="signal">level</span> <span className="operator">+</span> <span className="number">2</span>; <span className="signal">j</span><span className="operator">++</span>)&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">v</span> <span className="operator">=</span> <span className="keyword">float</span>(<span className="signal">j</span>) <span className="operator">/</span> (<span className="number">1</span> <span className="operator">+</span> <span className="signal">level</span>);<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Bilinear interpolation for position</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">p</span> <span className="operator">=</span> (<span className="number">1</span><span className="operator">-</span><span className="signal">u</span>)<span className="operator">*</span>(<span className="number">1</span><span className="operator">-</span><span className="signal">v</span>)<span className="operator">*</span> <span className="signal">verts</span>[<span className="number">0</span>] <span className="operator">+</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">u</span> <span className="operator">*</span> (<span className="number">1</span><span className="operator">-</span><span className="signal">v</span>) <span className="operator">*</span> <span className="signal">verts</span>[<span className="number">1</span>] <span className="operator">+</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">u</span> <span className="operator">*</span> <span className="signal">v</span> <span className="operator">*</span> <span className="signal">verts</span>[<span className="number">2</span>] <span className="operator">+</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(<span className="number">1</span><span className="operator">-</span><span className="signal">u</span>) <span className="operator">*</span> <span className="signal">v</span> <span className="operator">*</span> <span className="signal">verts</span>[<span className="number">3</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">new_quads</span>[<span className="signal">i</span>][<span className="signal">j</span>] <span className="operator">=</span> <span className="signal">p</span>;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Bilinear interpolation for color</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span>(<span className="signal">colors</span> <span className="operator">!=</span> <span className="keyword">nullptr</span>)&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GColor</span> <span className="signal">c</span> <span className="operator">=</span> (<span className="number">1</span><span className="operator">-</span><span className="signal">u</span>)<span className="operator">*</span>(<span className="number">1</span><span className="operator">-</span><span className="signal">v</span>)<span className="operator">*</span> <span className="signal">colors</span>[<span className="number">0</span>] <span className="operator">+</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">u</span> <span className="operator">*</span> (<span className="number">1</span><span className="operator">-</span><span className="signal">v</span>) <span className="operator">*</span> <span className="signal">colors</span>[<span className="number">1</span>] <span className="operator">+</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">u</span> <span className="operator">*</span> <span className="signal">v</span> <span className="operator">*</span> <span className="signal">colors</span>[<span className="number">2</span>] <span className="operator">+</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(<span className="number">1</span><span className="operator">-</span><span className="signal">u</span>) <span className="operator">*</span> <span className="signal">v</span> <span className="operator">*</span> <span className="signal">colors</span>[<span className="number">3</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">new_colors</span>[<span className="signal">i</span>][<span className="signal">j</span>] <span className="operator">=</span> <span className="signal">c</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Bilinear interpolation for texture coordinates</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span>(<span className="signal">texs</span> <span className="operator">!=</span> <span className="keyword">nullptr</span>)&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">t</span> <span className="operator">=</span> (<span className="number">1</span><span className="operator">-</span><span className="signal">u</span>)<span className="operator">*</span>(<span className="number">1</span><span className="operator">-</span><span className="signal">v</span>)<span className="operator">*</span> <span className="signal">texs</span>[<span className="number">0</span>] <span className="operator">+</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">u</span> <span className="operator">*</span> (<span className="number">1</span><span className="operator">-</span><span className="signal">v</span>) <span className="operator">*</span> <span className="signal">texs</span>[<span className="number">1</span>] <span className="operator">+</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">u</span> <span className="operator">*</span> <span className="signal">v</span> <span className="operator">*</span> <span className="signal">texs</span>[<span className="number">2</span>] <span className="operator">+</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(<span className="number">1</span><span className="operator">-</span><span className="signal">u</span>) <span className="operator">*</span> <span className="signal">v</span> <span className="operator">*</span> <span className="signal">texs</span>[<span className="number">3</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">new_texs</span>[<span className="signal">i</span>][<span className="signal">j</span>] <span className="operator">=</span> <span className="signal">t</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Render grid as triangles</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">for</span>(<span className="keyword">int</span> <span className="signal">i</span> <span className="operator">=</span> <span className="number">0</span>; <span className="signal">i</span> <span className="operator">&lt;</span> <span className="signal">level</span> <span className="operator">+</span> <span className="number">1</span>; <span className="signal">i</span><span className="operator">++</span>)&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">for</span>(<span className="keyword">int</span> <span className="signal">j</span> <span className="operator">=</span> <span className="number">0</span>; <span className="signal">j</span> <span className="operator">&lt;</span> <span className="signal">level</span> <span className="operator">+</span> <span className="number">1</span>; <span className="signal">j</span><span className="operator">++</span>)&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Two triangles per grid cell</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">mesh_verts</span>[<span className="number">6</span>] <span className="operator">=</span> &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">new_quads</span>[<span className="signal">i</span>][<span className="signal">j</span>], <span className="signal">new_quads</span>[<span className="signal">i</span><span className="operator">+</span><span className="number">1</span>][<span className="signal">j</span>], <span className="signal">new_quads</span>[<span className="signal">i</span>][<span className="signal">j</span><span className="operator">+</span><span className="number">1</span>],<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">new_quads</span>[<span className="signal">i</span><span className="operator">+</span><span className="number">1</span>][<span className="signal">j</span>], <span className="signal">new_quads</span>[<span className="signal">i</span><span className="operator">+</span><span className="number">1</span>][<span className="signal">j</span><span className="operator">+</span><span className="number">1</span>], <span className="signal">new_quads</span>[<span className="signal">i</span>][<span className="signal">j</span><span className="operator">+</span><span className="number">1</span>]<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GColor</span> <span className="signal">mesh_colors</span>[<span className="number">6</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span>(<span className="signal">colors</span> <span className="operator">!=</span> <span className="keyword">nullptr</span>)&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">mesh_colors</span>[<span className="number">0</span>] <span className="operator">=</span> <span className="signal">new_colors</span>[<span className="signal">i</span>][<span className="signal">j</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">mesh_colors</span>[<span className="number">1</span>] <span className="operator">=</span> <span className="signal">new_colors</span>[<span className="signal">i</span><span className="operator">+</span><span className="number">1</span>][<span className="signal">j</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">mesh_colors</span>[<span className="number">2</span>] <span className="operator">=</span> <span className="signal">new_colors</span>[<span className="signal">i</span>][<span className="signal">j</span><span className="operator">+</span><span className="number">1</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">mesh_colors</span>[<span className="number">3</span>] <span className="operator">=</span> <span className="signal">new_colors</span>[<span className="signal">i</span><span className="operator">+</span><span className="number">1</span>][<span className="signal">j</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">mesh_colors</span>[<span className="number">4</span>] <span className="operator">=</span> <span className="signal">new_colors</span>[<span className="signal">i</span><span className="operator">+</span><span className="number">1</span>][<span className="signal">j</span><span className="operator">+</span><span className="number">1</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">mesh_colors</span>[<span className="number">5</span>] <span className="operator">=</span> <span className="signal">new_colors</span>[<span className="signal">i</span>][<span className="signal">j</span><span className="operator">+</span><span className="number">1</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">mesh_texs</span>[<span className="number">6</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span>(<span className="signal">texs</span> <span className="operator">!=</span> <span className="keyword">nullptr</span>)&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">mesh_texs</span>[<span className="number">0</span>] <span className="operator">=</span> <span className="signal">new_texs</span>[<span className="signal">i</span>][<span className="signal">j</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">mesh_texs</span>[<span className="number">1</span>] <span className="operator">=</span> <span className="signal">new_texs</span>[<span className="signal">i</span><span className="operator">+</span><span className="number">1</span>][<span className="signal">j</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">mesh_texs</span>[<span className="number">2</span>] <span className="operator">=</span> <span className="signal">new_texs</span>[<span className="signal">i</span>][<span className="signal">j</span><span className="operator">+</span><span className="number">1</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">mesh_texs</span>[<span className="number">3</span>] <span className="operator">=</span> <span className="signal">new_texs</span>[<span className="signal">i</span><span className="operator">+</span><span className="number">1</span>][<span className="signal">j</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">mesh_texs</span>[<span className="number">4</span>] <span className="operator">=</span> <span className="signal">new_texs</span>[<span className="signal">i</span><span className="operator">+</span><span className="number">1</span>][<span className="signal">j</span><span className="operator">+</span><span className="number">1</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">mesh_texs</span>[<span className="number">5</span>] <span className="operator">=</span> <span className="signal">new_texs</span>[<span className="signal">i</span>][<span className="signal">j</span><span className="operator">+</span><span className="number">1</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">indices</span>[] <span className="operator">=</span> &#123;<span className="number">0</span>, <span className="number">1</span>, <span className="number">2</span>, <span className="number">3</span>, <span className="number">4</span>, <span className="number">5</span>&#125;;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Render based on available attributes</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span>(<span className="signal">colors</span> <span className="operator">==</span> <span className="keyword">nullptr</span>)&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">drawMesh</span>(<span className="signal">mesh_verts</span>, <span className="keyword">nullptr</span>, <span className="signal">mesh_texs</span>, <span className="number">2</span>, <span className="signal">indices</span>, <span className="signal">paint</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">else</span> <span className="keyword">if</span>(<span className="signal">texs</span> <span className="operator">==</span> <span className="keyword">nullptr</span>)&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">drawMesh</span>(<span className="signal">mesh_verts</span>, <span className="signal">mesh_colors</span>, <span className="keyword">nullptr</span>, <span className="number">2</span>, <span className="signal">indices</span>, <span className="signal">paint</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">else</span>&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">drawMesh</span>(<span className="signal">mesh_verts</span>, <span className="signal">mesh_colors</span>, <span className="signal">mesh_texs</span>, <span className="number">2</span>, <span className="signal">indices</span>, <span className="signal">paint</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &#125;
              </pre>

              <h4>Demo Note</h4>
              <p className="demo-instruction">
                <strong>Quad rendering uses the mesh demo:</strong> The mesh demo can display quad patches subdivided
                into triangles. Higher subdivision levels produce smoother color and texture interpolation across
                non-planar surfaces.
              </p>
            </div>

            {/* Tab Panel 4: Shader Composition */}
            <div id="shader" className={`tab-panel ${activeTab === 'shader' ? 'active' : ''}`}>
              <h3>Shader Composition Patterns</h3>

              <h4>Algorithm Overview</h4>
              <p>
                <strong>Shader composition</strong> enables modular, reusable shader effects by combining multiple
                shaders together. The engine provides two key composition patterns:
              </p>
              <ul>
                <li>
                  <strong>ProxyShader</strong>: Wraps an existing shader with an additional transformation matrix.
                  This allows the same shader to be reused with different geometric transformations, essential for
                  texture mapping on meshes.
                </li>
                <li>
                  <strong>ComposeShader</strong>: Combines two shaders by modulating their outputs. Each pixel is
                  the product of both shaders' colors, enabling effects like textured gradients or lit textures.
                </li>
              </ul>
              <p>
                These patterns follow the <strong>Decorator pattern</strong> in software design: they wrap and enhance
                existing shaders without modifying their implementation, promoting code reuse and flexibility.
              </p>

              <h4>What the Code Does</h4>
              <p>
                The implementations below show both shader composition patterns. ProxyShader delegates rendering to
                the wrapped shader while applying an extra transformation. ComposeShader calls both wrapped shaders
                and multiplies their outputs per-pixel.
              </p>

              <h4>ProxyShader Implementation</h4>
              <p><strong>File:</strong> <code>shader_ops.h</code> (lines 629-645)</p>
              <pre className="code-block">
  <span className="keyword">class</span> <span className="signal">ProxyShader</span> : <span className="keyword">public</span> <span className="signal">GShader</span> &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GShader</span><span className="operator">*</span> <span className="signal">fRealShader</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GMatrix</span>&nbsp;&nbsp;<span className="signal">fExtraTransform</span>;<br/>
  <span className="keyword">public</span>:<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">ProxyShader</span>(<span className="signal">GShader</span><span className="operator">*</span> <span className="signal">shader</span>, <span className="keyword">const</span> <span className="signal">GMatrix</span><span className="operator">&amp;</span> <span className="signal">extraTransform</span>)<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <span className="signal">fRealShader</span>(<span className="signal">shader</span>), <span className="signal">fExtraTransform</span>(<span className="signal">extraTransform</span>) &#123;&#125;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">bool</span> <span className="signal">isOpaque</span>() <span className="keyword">override</span> &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">fRealShader</span><span className="operator">-&gt;</span><span className="signal">isOpaque</span>();<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Chain transformations: apply extraTransform after ctm</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">bool</span> <span className="signal">setContext</span>(<span className="keyword">const</span> <span className="signal">GMatrix</span><span className="operator">&amp;</span> <span className="signal">ctm</span>) <span className="keyword">override</span> &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">fRealShader</span><span className="operator">-&gt;</span><span className="signal">setContext</span>(<span className="signal">ctm</span> <span className="operator">*</span> <span className="signal">fExtraTransform</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Delegate rendering to wrapped shader</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">void</span> <span className="signal">shadeRow</span>(<span className="keyword">int</span> <span className="signal">x</span>, <span className="keyword">int</span> <span className="signal">y</span>, <span className="keyword">int</span> <span className="signal">count</span>, <span className="signal">GPixel</span> <span className="signal">row</span>[]) <span className="keyword">override</span> &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">fRealShader</span><span className="operator">-&gt;</span><span className="signal">shadeRow</span>(<span className="signal">x</span>, <span className="signal">y</span>, <span className="signal">count</span>, <span className="signal">row</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &#125;;
              </pre>

              <h4>ComposeShader Implementation</h4>
              <p><strong>File:</strong> <code>shader_ops.h</code> (lines 647-679)</p>
              <pre className="code-block">
  <span className="keyword">class</span> <span className="signal">ComposeShader</span> : <span className="keyword">public</span> <span className="signal">GShader</span> &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GShader</span><span className="operator">*</span> <span className="signal">sh1</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GShader</span><span className="operator">*</span> <span className="signal">sh2</span>;<br/>
  <span className="keyword">public</span>:<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Modulate two pixels by multiplying components</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPixel</span> <span className="signal">modulate</span>(<span className="signal">GPixel</span> <span className="signal">p1</span>, <span className="signal">GPixel</span> <span className="signal">p2</span>)&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">new_a</span> <span className="operator">=</span> <span className="signal">GRoundToInt</span>(<span className="signal">div255</span>(<span className="signal">GPixel_GetA</span>(<span className="signal">p1</span>) <span className="operator">*</span> <span className="signal">GPixel_GetA</span>(<span className="signal">p2</span>)));<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">new_r</span> <span className="operator">=</span> <span className="signal">GRoundToInt</span>(<span className="signal">div255</span>(<span className="signal">GPixel_GetR</span>(<span className="signal">p1</span>) <span className="operator">*</span> <span className="signal">GPixel_GetR</span>(<span className="signal">p2</span>)));<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">new_g</span> <span className="operator">=</span> <span className="signal">GRoundToInt</span>(<span className="signal">div255</span>(<span className="signal">GPixel_GetG</span>(<span className="signal">p1</span>) <span className="operator">*</span> <span className="signal">GPixel_GetG</span>(<span className="signal">p2</span>)));<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">new_b</span> <span className="operator">=</span> <span className="signal">GRoundToInt</span>(<span className="signal">div255</span>(<span className="signal">GPixel_GetB</span>(<span className="signal">p1</span>) <span className="operator">*</span> <span className="signal">GPixel_GetB</span>(<span className="signal">p2</span>)));<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">GPixel_PackARGB</span>(<span className="signal">new_a</span>, <span className="signal">new_r</span>, <span className="signal">new_g</span>, <span className="signal">new_b</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">ComposeShader</span>(<span className="signal">GShader</span><span className="operator">*</span> <span className="signal">shader1</span>, <span className="signal">GShader</span><span className="operator">*</span> <span className="signal">shader2</span>)<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: <span className="signal">sh1</span>(<span className="signal">shader1</span>), <span className="signal">sh2</span>(<span className="signal">shader2</span>) &#123;&#125;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Opaque only if both shaders are opaque</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">bool</span> <span className="signal">isOpaque</span>() <span className="keyword">override</span> &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">sh1</span><span className="operator">-&gt;</span><span className="signal">isOpaque</span>() <span className="operator">&amp;&amp;</span> <span className="signal">sh2</span><span className="operator">-&gt;</span><span className="signal">isOpaque</span>();<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Both shaders must set context successfully</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">bool</span> <span className="signal">setContext</span>(<span className="keyword">const</span> <span className="signal">GMatrix</span><span className="operator">&amp;</span> <span className="signal">ctm</span>) <span className="keyword">override</span> &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">sh1</span><span className="operator">-&gt;</span><span className="signal">setContext</span>(<span className="signal">ctm</span>) <span className="operator">&amp;&amp;</span> <span className="signal">sh2</span><span className="operator">-&gt;</span><span className="signal">setContext</span>(<span className="signal">ctm</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Shade with both shaders and modulate results</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">void</span> <span className="signal">shadeRow</span>(<span className="keyword">int</span> <span className="signal">x</span>, <span className="keyword">int</span> <span className="signal">y</span>, <span className="keyword">int</span> <span className="signal">c</span>, <span className="signal">GPixel</span> <span className="signal">row</span>[]) <span className="keyword">override</span> &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPixel</span> <span className="signal">row1</span>[<span className="signal">c</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPixel</span> <span className="signal">row2</span>[<span className="signal">c</span>];<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Get colors from both shaders</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">sh1</span><span className="operator">-&gt;</span><span className="signal">shadeRow</span>(<span className="signal">x</span>, <span className="signal">y</span>, <span className="signal">c</span>, <span className="signal">row1</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">sh2</span><span className="operator">-&gt;</span><span className="signal">shadeRow</span>(<span className="signal">x</span>, <span className="signal">y</span>, <span className="signal">c</span>, <span className="signal">row2</span>);<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Modulate each pixel</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">for</span>(<span className="keyword">int</span> <span className="signal">i</span> <span className="operator">=</span> <span className="number">0</span>; <span className="signal">i</span> <span className="operator">&lt;</span> <span className="signal">c</span>; <span className="signal">i</span><span className="operator">++</span>)&#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">row</span>[<span className="signal">i</span>] <span className="operator">=</span> <span className="signal">modulate</span>(<span className="signal">row1</span>[<span className="signal">i</span>], <span className="signal">row2</span>[<span className="signal">i</span>]);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &#125;;
              </pre>

              <h4>Usage Patterns</h4>
              <p>
                <strong>ProxyShader in mesh rendering:</strong>
              </p>
              <pre className="code-block">
  <span className="comment">// Transform texture shader to triangle space</span><br/>
  <span className="keyword">auto</span> <span className="signal">real_sh</span> <span className="operator">=</span> <span className="signal">paint</span>.<span className="signal">getShader</span>();<br/>
  <span className="signal">GMatrix</span> <span className="signal">invT</span> <span className="operator">=</span> <span className="signal">T</span>.<span className="signal">invert</span>();<br/>
  <span className="signal">ProxyShader</span> <span className="signal">proxy</span>(<span className="signal">real_sh</span>, (<span className="signal">P</span> <span className="operator">*</span> <span className="signal">invT</span>));<br/>
  <span className="signal">GPaint</span> <span className="signal">p</span>(<span className="operator">&amp;</span><span className="signal">proxy</span>);<br/>
  <span className="signal">drawConvexPolygon</span>(<span className="signal">points</span>, <span className="number">3</span>, <span className="signal">p</span>);
              </pre>

              <p>
                <strong>ComposeShader for textured color mesh:</strong>
              </p>
              <pre className="code-block">
  <span className="comment">// Combine color interpolation with texture</span><br/>
  <span className="keyword">auto</span> <span className="signal">color_shader</span> <span className="operator">=</span> <span className="signal">GCreateTriColorShader</span>(<span className="signal">points</span>, <span className="signal">colors</span>, <span className="signal">count</span>);<br/>
  <span className="keyword">auto</span> <span className="signal">texture_shader</span> <span className="operator">=</span> <span className="signal">GCreateProxyShader</span>(<span className="signal">real_sh</span>, (<span className="signal">P</span> <span className="operator">*</span> <span className="signal">invT</span>));<br/>
  <span className="keyword">auto</span> <span className="signal">compose_shader</span> <span className="operator">=</span> <span className="signal">GCreateComposeShader</span>(<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">color_shader</span>.<span className="signal">get</span>(),<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">texture_shader</span>.<span className="signal">get</span>()<br/>
  );<br/>
  <span className="signal">GPaint</span> <span className="signal">p</span>(<span className="signal">compose_shader</span>.<span className="signal">get</span>());<br/>
  <span className="signal">drawConvexPolygon</span>(<span className="signal">points</span>, <span className="number">3</span>, <span className="signal">p</span>);
              </pre>

              <h4>Demo Note</h4>
              <p className="demo-instruction">
                <strong>Shader composition in action:</strong> The mesh demo uses ProxyShader for texture mapping.
                When both colors and textures are provided, it uses ComposeShader to combine interpolated vertex
                colors with the texture pattern, creating rich visual effects.
              </p>
            </div>
          </div>
        </section>
    </DocsLayout>
  )
}

export default GraphicsAdvancedGeometryPage
