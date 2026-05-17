import React, { useState } from 'react'
import DocsLayout from '../../components/docs/DocsLayout'
import DocsSection from '../../components/docs/DocsSection'

function GraphicsFinalFeaturesPage() {
  const [activeTab, setActiveTab] = useState('sweep')

  return (
    <DocsLayout
      project="graphics"
      currentSlug="final-features"
      title="Advanced Features"
      subtitle="Sweep Gradients, Position-Controlled Gradients, and Coons Patches"
      tocMode="none"
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
        .docs-layout .docs-content .code-block .function { color: #dcdcaa; }
        .docs-layout .docs-content .code-block .type { color: #4ec9b0; }

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

        .docs-layout .docs-content .demo-instruction {
            background: #f0f8f0;
            border-left: 4px solid #2E7D32;
            padding: 1rem 1.5rem;
            margin: 1.5rem 0;
            border-radius: 4px;
            font-size: 0.95rem;
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
          This section covers three advanced shader and rendering techniques that extend the engine's
          capabilities beyond standard gradients and shape rendering: sweep gradients, position-controlled
          gradients, and Coons patches.
        </p>
        <p>
          <strong>Sweep gradients</strong> (also called conical or angular gradients) distribute colors
          radially based on angle around a center point, creating color wheel effects. <strong>Position-controlled
          gradients</strong> vary colors based on radial distance from a center point, enabling custom
          falloff patterns. <strong>Coons patches</strong> interpolate between four boundary curves to
          create smooth parametric surfaces, useful for rendering curved shapes with natural color transitions.
        </p>
        <p>
          Each feature represents a sophisticated shader algorithm that leverages coordinate transformations,
          interpolation techniques, and mathematical functions to achieve advanced visual effects.
        </p>
      </DocsSection>

      {/* Tabs container — wrapped in <section className="section"> manually since tabs have no h2 of their own. */}
      <section className="section tabs-container">
          <div className="tabs-header">
            <button
              className={`tab-button ${activeTab === 'sweep' ? 'active' : ''}`}
              onClick={() => setActiveTab('sweep')}
            >
              Sweep Gradient
            </button>
            <button
              className={`tab-button ${activeTab === 'position' ? 'active' : ''}`}
              onClick={() => setActiveTab('position')}
            >
              Position-Based Gradient
            </button>
            <button
              className={`tab-button ${activeTab === 'coons' ? 'active' : ''}`}
              onClick={() => setActiveTab('coons')}
            >
              Coons Patches
            </button>
          </div>

          <div className="tabs-content">
            {/* Tab 1: Sweep Gradient */}
            <div className={`tab-panel ${activeTab === 'sweep' ? 'active' : ''}`}>
              <h3>Sweep Gradient (Angle-Based)</h3>

              <h4>What is a Sweep Gradient?</h4>
              <p>
                A <strong>sweep gradient</strong> (also called a conical or angular gradient) distributes
                colors radially around a center point based on angle. Unlike linear gradients that vary
                along a line, or radial gradients that vary by distance from center, sweep gradients
                rotate colors around the center like a color wheel.
              </p>
              <p>
                The key insight is using <code>atan2(dy, dx)</code> to convert a pixel's position
                relative to the center into an angle. This angle (normalized to [0, 1]) then determines
                which color to sample from the gradient.
              </p>

              <h4>Algorithm Breakdown</h4>
              <p>The sweep gradient shader performs these steps for each pixel:</p>
              <ol>
                <li>Transform the pixel coordinates using the inverse matrix</li>
                <li>Calculate the angle to the pixel using <code>atan2(y_prime - center.y, x_prime - center.x)</code></li>
                <li>Normalize the angle from [−π, π] to [0, 2π]</li>
                <li>Account for the starting angle offset</li>
                <li>Map the angle to a t-value in [0, 1] for color interpolation</li>
                <li>Interpolate between adjacent colors based on t</li>
              </ol>

              <h4>Implementation</h4>
              <p>
                From <code>shader_ops.h</code>, the <code>AngleGradientShader</code> demonstrates
                sweep gradient rendering. The critical angle calculation happens in the shadeRow loop.
              </p>

              <pre className="code-block">
  <span className="keyword">void</span> <span className="signal">shadeRow</span>(<span className="keyword">int</span> <span className="signal">x</span>, <span className="keyword">int</span> <span className="signal">y</span>, <span className="keyword">int</span> <span className="signal">c</span>, <span className="signal">GPixel</span> <span className="signal">row</span>[]) <span className="keyword">override</span> &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">x_prime</span> <span className="operator">=</span> (<span className="signal">inv</span>[<span className="number">0</span>] <span className="operator">*</span> (<span className="signal">x</span> <span className="operator">+</span> <span className="number">0.5f</span>) <span className="operator">+</span> <span className="signal">inv</span>[<span className="number">2</span>] <span className="operator">*</span> (<span className="signal">y</span> <span className="operator">+</span> <span className="number">0.5f</span>) <span className="operator">+</span> <span className="signal">inv</span>[<span className="number">4</span>]) <span className="operator">*</span> (<span className="signal">count</span> <span className="operator">-</span> <span className="number">1</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">y_prime</span> <span className="operator">=</span> (<span className="signal">inv</span>[<span className="number">1</span>] <span className="operator">*</span> (<span className="signal">x</span> <span className="operator">+</span> <span className="number">0.5f</span>) <span className="operator">+</span> <span className="signal">inv</span>[<span className="number">3</span>] <span className="operator">*</span> (<span className="signal">y</span> <span className="operator">+</span> <span className="number">0.5f</span>) <span className="operator">+</span> <span className="signal">inv</span>[<span className="number">5</span>]) <span className="operator">*</span> (<span className="signal">count</span> <span className="operator">-</span> <span className="number">1</span>);<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">dx</span> <span className="operator">=</span> <span className="signal">P1</span>.<span className="signal">x</span> <span className="operator">-</span> <span className="signal">P0</span>.<span className="signal">x</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">dy</span> <span className="operator">=</span> <span className="signal">P1</span>.<span className="signal">y</span> <span className="operator">-</span> <span className="signal">P0</span>.<span className="signal">y</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Calculate the angle of the line segment (starting angle)</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">line_angle</span> <span className="operator">=</span> <span className="signal">std</span>::<span className="signal">atan2</span>(<span className="signal">dy</span>, <span className="signal">dx</span>);<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">for</span> (<span className="keyword">int</span> <span className="signal">i</span> <span className="operator">=</span> <span className="number">0</span>; <span className="signal">i</span> <span className="operator">&lt;</span> <span className="signal">c</span>; <span className="signal">i</span><span className="operator">++</span>) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Calculate angle from center to current pixel</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">angle_to_pixel</span> <span className="operator">=</span> <span className="signal">std</span>::<span className="signal">atan2</span>(<span className="signal">y_prime</span> <span className="operator">-</span> <span className="signal">P0</span>.<span className="signal">y</span>, <span className="signal">x_prime</span> <span className="operator">-</span> <span className="signal">P0</span>.<span className="signal">x</span>);<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Normalize angle to [0, 2*pi]</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">angle_to_pixel</span> <span className="operator">&lt;</span> <span className="number">0</span>) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">angle_to_pixel</span> <span className="operator">+=</span> <span className="number">2</span> <span className="operator">*</span> <span className="signal">M_PI</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Calculate relative angle (offset by starting angle)</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">angle</span> <span className="operator">=</span> <span className="signal">angle_to_pixel</span> <span className="operator">-</span> <span className="signal">line_angle</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">angle</span> <span className="operator">&lt;</span> <span className="number">0</span>) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">angle</span> <span className="operator">+=</span> <span className="number">2</span> <span className="operator">*</span> <span className="signal">M_PI</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Normalize angle to [0, 1] for color interpolation</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">t</span> <span className="operator">=</span> <span className="signal">angle</span> <span className="operator">/</span> (<span className="number">2</span> <span className="operator">*</span> <span className="signal">M_PI</span>);<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Interpolate between colors based on t</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">k</span> <span className="operator">=</span> <span className="signal">floor</span>(<span className="signal">t</span> <span className="operator">*</span> (<span className="signal">count</span> <span className="operator">-</span> <span className="number">1</span>));<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">u</span> <span className="operator">=</span> <span className="signal">t</span> <span className="operator">*</span> (<span className="signal">count</span> <span className="operator">-</span> <span className="number">1</span>) <span className="operator">-</span> <span className="signal">k</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GColor</span> <span className="signal">gradient_color</span> <span className="operator">=</span> (<span className="number">1</span> <span className="operator">-</span> <span className="signal">u</span>) <span className="operator">*</span> <span className="signal">gradient_colors</span>[<span className="signal">k</span>] <span className="operator">+</span> <span className="signal">u</span> <span className="operator">*</span> <span className="signal">gradient_colors</span>[<span className="signal">k</span> <span className="operator">+</span> <span className="number">1</span>];<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">row</span>[<span className="signal">i</span>] <span className="operator">=</span> <span className="signal">unpremult</span>(<span className="signal">gradient_color</span>);<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Update position for next pixel in row</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">x_prime</span> <span className="operator">+=</span> <span className="signal">inv</span>[<span className="number">0</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">y_prime</span> <span className="operator">+=</span> <span className="signal">inv</span>[<span className="number">1</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &#125;
              </pre>

              <h4>Key Implementation Details</h4>
              <ul>
                <li><strong>atan2 Function:</strong> Returns angle in radians [−π, π], handles all quadrants correctly</li>
                <li><strong>Angle Normalization:</strong> Converts negative angles to positive [0, 2π] range</li>
                <li><strong>Starting Angle Offset:</strong> The line_angle parameter rotates where color[0] appears</li>
                <li><strong>Color Interpolation:</strong> Linear interpolation between adjacent color stops</li>
                <li><strong>Incremental Updates:</strong> x_prime and y_prime increment for efficiency along the row</li>
              </ul>

              <h4>Visual Result</h4>
              <p>
                The sweep gradient creates a rainbow effect radiating from the center. As you move
                counterclockwise around the center point, you transition through all gradient colors.
                This is perfect for creating color pickers, circular progress indicators, and artistic effects.
              </p>
            </div>

            {/* Tab 2: Position-Based Gradient */}
            <div className={`tab-panel ${activeTab === 'position' ? 'active' : ''}`}>
              <h3>Position-Controlled Linear Gradient</h3>

              <h4>What is Position-Based Control?</h4>
              <p>
                Standard linear gradients distribute colors evenly between two points. A
                <strong> position-based gradient</strong> allows explicit control over where each
                color stop appears along the gradient line using a positions array. This enables
                non-uniform color distribution.
              </p>
              <p>
                For example, with three colors at positions [0, 0.25, 1], the first color occupies
                25% of the gradient space, while the transition from second to third color occupies
                the remaining 75%.
              </p>

              <h4>Algorithm Breakdown</h4>
              <p>The shader evaluates each pixel's gradient position (t-value) and determines:</p>
              <ol>
                <li>Transform pixel coordinates to gradient space using inverse matrix</li>
                <li>Calculate the proportional distance along the gradient line (prop)</li>
                <li>Find which color stops bracket this position (positions[k-1] ≤ prop ≤ positions[k])</li>
                <li>Calculate local interpolation within that segment</li>
                <li>Blend between the two bracketing colors</li>
              </ol>

              <h4>Implementation</h4>
              <p>
                From <code>my_final.cpp</code>, the <code>LinearPosGradientShader</code> demonstrates
                how to handle non-uniform color stop positioning. The key logic finds the correct
                color segment and interpolates within it.
              </p>

              <pre className="code-block">
  <span className="keyword">void</span> <span className="signal">shadeRow</span>(<span className="keyword">int</span> <span className="signal">x</span>, <span className="keyword">int</span> <span className="signal">y</span>, <span className="keyword">int</span> <span className="signal">c</span>, <span className="signal">GPixel</span> <span className="signal">row</span>[]) <span className="keyword">override</span> &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">x_prime</span> <span className="operator">=</span> (<span className="signal">inv</span>[<span className="number">0</span>] <span className="operator">*</span> (<span className="signal">x</span> <span className="operator">+</span> <span className="number">0.5f</span>) <span className="operator">+</span> <span className="signal">inv</span>[<span className="number">2</span>] <span className="operator">*</span> (<span className="signal">y</span> <span className="operator">+</span> <span className="number">0.5f</span>) <span className="operator">+</span> <span className="signal">inv</span>[<span className="number">4</span>]) <span className="operator">*</span> (<span className="signal">count</span> <span className="operator">-</span> <span className="number">1</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">currX</span> <span className="operator">=</span> <span className="signal">x_prime</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">prop</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">k</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GColor</span> <span className="signal">mix</span>;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">for</span> (<span className="keyword">int</span> <span className="signal">i</span> <span className="operator">=</span> <span className="number">0</span>; <span className="signal">i</span> <span className="operator">&lt;</span> <span className="signal">c</span>; <span className="signal">i</span><span className="operator">++</span>) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">currX</span> <span className="operator">=</span> <span className="signal">x_prime</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Clamp to valid gradient range</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">currX</span> <span className="operator">&lt;</span> <span className="number">0</span>) <span className="signal">currX</span> <span className="operator">=</span> <span className="number">0</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">currX</span> <span className="operator">&gt;</span> <span className="signal">count</span> <span className="operator">-</span> <span className="number">1</span>) <span className="signal">currX</span> <span className="operator">=</span> <span className="signal">count</span> <span className="operator">-</span> <span className="number">1</span>;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Calculate proportional position along gradient</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">prop</span> <span className="operator">=</span> <span className="signal">currX</span> <span className="operator">/</span> (<span className="signal">count</span> <span className="operator">-</span> <span className="number">1</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">k</span> <span className="operator">=</span> <span className="number">0</span>;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Find which color stops bracket this position</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">while</span> (<span className="keyword">true</span>) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">prop</span> <span className="operator">&gt;</span> <span className="signal">positions</span>[<span className="signal">k</span>]) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">k</span><span className="operator">++</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125; <span className="keyword">else</span> &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">break</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">assert</span>(<span className="signal">prop</span> <span className="operator">&lt;=</span> <span className="signal">positions</span>[<span className="signal">k</span>]);<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">fullDiff</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">propDiff</span>;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">k</span> <span className="operator">==</span> <span className="number">0</span>) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Before first position, use first color</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">mix</span> <span className="operator">=</span> <span className="signal">gradient_colors</span>[<span className="signal">k</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125; <span className="keyword">else if</span> (<span className="signal">k</span> <span className="operator">&lt;</span> <span className="signal">count</span>) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Between two positions, interpolate</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">fullDiff</span> <span className="operator">=</span> <span className="signal">positions</span>[<span className="signal">k</span>] <span className="operator">-</span> <span className="signal">positions</span>[<span className="signal">k</span> <span className="operator">-</span> <span className="number">1</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">propDiff</span> <span className="operator">=</span> <span className="signal">prop</span> <span className="operator">-</span> <span className="signal">positions</span>[<span className="signal">k</span> <span className="operator">-</span> <span className="number">1</span>];<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">propC1</span> <span className="operator">=</span> <span className="signal">propDiff</span> <span className="operator">/</span> <span className="signal">fullDiff</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">assert</span>(<span className="signal">propC1</span> <span className="operator">&gt;=</span> <span className="number">0.0f</span> <span className="operator">&amp;&amp;</span> <span className="signal">propC1</span> <span className="operator">&lt;=</span> <span className="number">1.0f</span>);<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">mix</span> <span className="operator">=</span> <span className="signal">gradient_colors</span>[<span className="signal">k</span>] <span className="operator">*</span> <span className="signal">propC1</span> <span className="operator">+</span> <span className="signal">gradient_colors</span>[<span className="signal">k</span> <span className="operator">-</span> <span className="number">1</span>] <span className="operator">*</span> (<span className="number">1.0f</span> <span className="operator">-</span> <span className="signal">propC1</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125; <span className="keyword">else</span> &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Past last position, use last color</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">mix</span> <span className="operator">=</span> <span className="signal">gradient_colors</span>[<span className="signal">k</span> <span className="operator">-</span> <span className="number">1</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">row</span>[<span className="signal">i</span>] <span className="operator">=</span> <span className="signal">unpremult</span>(<span className="signal">mix</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">x_prime</span> <span className="operator">+=</span> <span className="signal">inv</span>[<span className="number">0</span>] <span className="operator">*</span> (<span className="signal">count</span> <span className="operator">-</span> <span className="number">1</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &#125;
              </pre>

              <h4>Key Implementation Details</h4>
              <ul>
                <li><strong>Position Array:</strong> Positions must be monotonically increasing from 0.0 to 1.0</li>
                <li><strong>Binary Search Opportunity:</strong> The while loop could be optimized with binary search</li>
                <li><strong>Local Interpolation:</strong> propC1 is the interpolation factor within the current segment</li>
                <li><strong>Edge Handling:</strong> Special cases for before first and after last position</li>
                <li><strong>Clamping:</strong> currX is clamped to [0, count-1] for clamp tile mode</li>
              </ul>

              <h4>Use Cases</h4>
              <p>
                Position-based gradients are essential for:
              </p>
              <ul>
                <li>Creating color bands of specific widths</li>
                <li>Emphasizing certain color transitions</li>
                <li>Matching design specifications with precise color placement</li>
                <li>Creating non-linear color progressions</li>
              </ul>

              <p className="demo-instruction">
                <strong>Design Note:</strong> This feature bridges the gap between simple gradients
                and complex shader logic, giving designers fine-grained control over color distribution
                without writing custom shader code.
              </p>
            </div>

            {/* Tab 3: Coons Patches */}
            <div className={`tab-panel ${activeTab === 'coons' ? 'active' : ''}`}>
              <h3>Quadratic Coons Patches</h3>

              <h4>What is a Coons Patch?</h4>
              <p>
                A <strong>Coons patch</strong> is a method for creating a smooth surface defined by
                boundary curves. Given four curves that form the edges of a patch, the Coons formulation
                interpolates the interior points to create a continuous surface.
              </p>
              <p>
                The quadratic variant uses quadratic Bezier curves for each of the four boundaries,
                allowing for curved edges rather than straight lines. This creates more organic,
                visually interesting surfaces compared to simple rectangular meshes.
              </p>

              <h4>Mathematical Foundation</h4>
              <p>The Coons patch formula is:</p>
              <p style={{ textAlign: 'center', fontFamily: 'monospace', fontSize: '1.1em' }}>
                <strong>P(u,v) = TB(u,v) + LR(u,v) − Corners(u,v)</strong>
              </p>
              <p>Where:</p>
              <ul>
                <li><strong>TB(u,v):</strong> Top-bottom interpolation. Evaluate top and bottom curves at u, then lerp by v</li>
                <li><strong>LR(u,v):</strong> Left-right interpolation. Evaluate left and right curves at v, then lerp by u</li>
                <li><strong>Corners(u,v):</strong> Bilinear interpolation of the four corner points. Subtract to avoid double-counting corners</li>
              </ul>

              <h4>Implementation Strategy</h4>
              <p>
                The implementation in <code>my_final.cpp</code> generates a triangle mesh by:
              </p>
              <ol>
                <li>Subdividing the [0,1]×[0,1] parameter space into a grid (controlled by level parameter)</li>
                <li>Evaluating the Coons patch formula at each grid point</li>
                <li>Creating quad faces (split into two triangles) connecting adjacent grid points</li>
                <li>Passing the mesh to the existing drawMesh function for rendering</li>
              </ol>

              <h4>Core Functions</h4>
              <p>
                Two helper functions implement the mathematical operations:
              </p>

              <pre className="code-block">
  <span className="comment">// Evaluate quadratic Bezier curve at parameter t</span><br/>
  <span className="signal">GPoint</span> <span className="signal">get_quad_bezier</span>(<span className="keyword">const</span> <span className="signal">GPoint</span><span className="operator">*</span> <span className="signal">curr_points</span>, <span className="keyword">float</span> <span className="signal">t</span>) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">tangent</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">tangent</span>.<span className="signal">x</span> <span className="operator">=</span> <span className="signal">curr_points</span>[<span className="number">0</span>].<span className="signal">x</span> <span className="operator">*</span> <span className="signal">pow</span>(<span className="number">1</span><span className="operator">-</span><span className="signal">t</span>, <span className="number">2</span>) <span className="operator">+</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="number">2</span> <span className="operator">*</span> <span className="signal">curr_points</span>[<span className="number">1</span>].<span className="signal">x</span> <span className="operator">*</span> <span className="signal">t</span> <span className="operator">*</span> (<span className="number">1</span><span className="operator">-</span><span className="signal">t</span>) <span className="operator">+</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">curr_points</span>[<span className="number">2</span>].<span className="signal">x</span> <span className="operator">*</span> <span className="signal">t</span> <span className="operator">*</span> <span className="signal">t</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">tangent</span>.<span className="signal">y</span> <span className="operator">=</span> <span className="signal">curr_points</span>[<span className="number">0</span>].<span className="signal">y</span> <span className="operator">*</span> <span className="signal">pow</span>(<span className="number">1</span><span className="operator">-</span><span className="signal">t</span>, <span className="number">2</span>) <span className="operator">+</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="number">2</span> <span className="operator">*</span> <span className="signal">curr_points</span>[<span className="number">1</span>].<span className="signal">y</span> <span className="operator">*</span> <span className="signal">t</span> <span className="operator">*</span> (<span className="number">1</span><span className="operator">-</span><span className="signal">t</span>) <span className="operator">+</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">curr_points</span>[<span className="number">2</span>].<span className="signal">y</span> <span className="operator">*</span> <span className="signal">t</span> <span className="operator">*</span> <span className="signal">t</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">tangent</span>;<br/>
  &#125;<br/>
  <br/>
  <span className="comment">// Bilinear interpolation of four corner points</span><br/>
  <span className="signal">GPoint</span> <span className="signal">pt_weighted_avg</span>(<span className="keyword">float</span> <span className="signal">u</span>, <span className="keyword">float</span> <span className="signal">v</span>, <span className="signal">GPoint</span> <span className="signal">p1</span>, <span className="signal">GPoint</span> <span className="signal">p2</span>, <span className="signal">GPoint</span> <span className="signal">p3</span>, <span className="signal">GPoint</span> <span className="signal">p4</span>) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">p</span> <span className="operator">=</span> (<span className="number">1</span><span className="operator">-</span><span className="signal">u</span>)<span className="operator">*</span>(<span className="number">1</span><span className="operator">-</span><span className="signal">v</span>)<span className="operator">*</span> <span className="signal">p1</span> <span className="operator">+</span> <span className="signal">u</span> <span className="operator">*</span> (<span className="number">1</span><span className="operator">-</span><span className="signal">v</span>) <span className="operator">*</span> <span className="signal">p2</span> <span className="operator">+</span> <span className="signal">u</span> <span className="operator">*</span> <span className="signal">v</span> <span className="operator">*</span> <span className="signal">p3</span> <span className="operator">+</span> (<span className="number">1</span><span className="operator">-</span><span className="signal">u</span>) <span className="operator">*</span> <span className="signal">v</span> <span className="operator">*</span> <span className="signal">p4</span>;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">p</span>;<br/>
  &#125;
              </pre>

              <h4>Coons Patch Evaluation</h4>
              <p>
                The main evaluation function implements the Coons formula:
              </p>

              <pre className="code-block">
  <span className="signal">GPoint</span> <span className="signal">pt_coons_avg</span>(<span className="keyword">float</span> <span className="signal">u</span>, <span className="keyword">float</span> <span className="signal">v</span>, <span className="keyword">const</span> <span className="signal">GPoint</span> <span className="signal">pts</span>[<span className="number">8</span>]) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Handle corners directly (optimization)</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">u</span> <span className="operator">==</span> <span className="number">0.0f</span> <span className="operator">&amp;&amp;</span> <span className="signal">v</span> <span className="operator">==</span> <span className="number">0.0f</span>) <span className="keyword">return</span> <span className="signal">pts</span>[<span className="number">0</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">u</span> <span className="operator">==</span> <span className="number">1.0f</span> <span className="operator">&amp;&amp;</span> <span className="signal">v</span> <span className="operator">==</span> <span className="number">0.0f</span>) <span className="keyword">return</span> <span className="signal">pts</span>[<span className="number">2</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">u</span> <span className="operator">==</span> <span className="number">1.0f</span> <span className="operator">&amp;&amp;</span> <span className="signal">v</span> <span className="operator">==</span> <span className="number">1.0f</span>) <span className="keyword">return</span> <span className="signal">pts</span>[<span className="number">4</span>];<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">u</span> <span className="operator">==</span> <span className="number">0.0f</span> <span className="operator">&amp;&amp;</span> <span className="signal">v</span> <span className="operator">==</span> <span className="number">1.0f</span>) <span className="keyword">return</span> <span className="signal">pts</span>[<span className="number">6</span>];<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Define the four boundary curves</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">top</span>[<span className="number">3</span>] <span className="operator">=</span> &#123;<span className="signal">pts</span>[<span className="number">0</span>], <span className="signal">pts</span>[<span className="number">1</span>], <span className="signal">pts</span>[<span className="number">2</span>]&#125;;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">right</span>[<span className="number">3</span>] <span className="operator">=</span> &#123;<span className="signal">pts</span>[<span className="number">2</span>], <span className="signal">pts</span>[<span className="number">3</span>], <span className="signal">pts</span>[<span className="number">4</span>]&#125;;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">bottom</span>[<span className="number">3</span>] <span className="operator">=</span> &#123;<span className="signal">pts</span>[<span className="number">6</span>], <span className="signal">pts</span>[<span className="number">5</span>], <span className="signal">pts</span>[<span className="number">4</span>]&#125;;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">left</span>[<span className="number">3</span>] <span className="operator">=</span> &#123;<span className="signal">pts</span>[<span className="number">0</span>], <span className="signal">pts</span>[<span className="number">7</span>], <span className="signal">pts</span>[<span className="number">6</span>]&#125;;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Handle edge cases (on boundary curves)</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">u</span> <span className="operator">==</span> <span className="number">0.0f</span>) <span className="keyword">return</span> <span className="signal">get_quad_bezier</span>(<span className="signal">left</span>, <span className="signal">v</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">u</span> <span className="operator">==</span> <span className="number">1.0f</span>) <span className="keyword">return</span> <span className="signal">get_quad_bezier</span>(<span className="signal">right</span>, <span className="signal">v</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">v</span> <span className="operator">==</span> <span className="number">0.0f</span>) <span className="keyword">return</span> <span className="signal">get_quad_bezier</span>(<span className="signal">top</span>, <span className="signal">u</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">v</span> <span className="operator">==</span> <span className="number">1.0f</span>) <span className="keyword">return</span> <span className="signal">get_quad_bezier</span>(<span className="signal">bottom</span>, <span className="signal">u</span>);<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// TB: Top-bottom interpolation</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">a</span> <span className="operator">=</span> <span className="signal">get_quad_bezier</span>(<span className="signal">top</span>, <span className="signal">u</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">b</span> <span className="operator">=</span> <span className="signal">get_quad_bezier</span>(<span className="signal">bottom</span>, <span className="signal">u</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">ab</span> <span className="operator">=</span> &#123;<span className="signal">a</span>.<span className="signal">x</span> <span className="operator">+</span> ((<span className="signal">b</span>.<span className="signal">x</span> <span className="operator">-</span> <span className="signal">a</span>.<span className="signal">x</span>) <span className="operator">*</span> <span className="signal">v</span>), <span className="signal">a</span>.<span className="signal">y</span> <span className="operator">+</span> ((<span className="signal">b</span>.<span className="signal">y</span> <span className="operator">-</span> <span className="signal">a</span>.<span className="signal">y</span>) <span className="operator">*</span> <span className="signal">v</span>)&#125;;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// LR: Left-right interpolation</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">c</span> <span className="operator">=</span> <span className="signal">get_quad_bezier</span>(<span className="signal">left</span>, <span className="signal">v</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">d</span> <span className="operator">=</span> <span className="signal">get_quad_bezier</span>(<span className="signal">right</span>, <span className="signal">v</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">cd</span> <span className="operator">=</span> &#123;<span className="signal">c</span>.<span className="signal">x</span> <span className="operator">+</span> ((<span className="signal">d</span>.<span className="signal">x</span> <span className="operator">-</span> <span className="signal">c</span>.<span className="signal">x</span>) <span className="operator">*</span> <span className="signal">u</span>), <span className="signal">c</span>.<span className="signal">y</span> <span className="operator">+</span> ((<span className="signal">d</span>.<span className="signal">y</span> <span className="operator">-</span> <span className="signal">c</span>.<span className="signal">y</span>) <span className="operator">*</span> <span className="signal">u</span>)&#125;;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Corners: Bilinear interpolation of corners</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">mid</span> <span className="operator">=</span> <span className="signal">pt_weighted_avg</span>(<span className="signal">u</span>, <span className="signal">v</span>, <span className="signal">pts</span>[<span className="number">0</span>], <span className="signal">pts</span>[<span className="number">2</span>], <span className="signal">pts</span>[<span className="number">4</span>], <span className="signal">pts</span>[<span className="number">6</span>]);<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Coons formula: TB + LR - Corners</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> (<span className="signal">ab</span> <span className="operator">+</span> <span className="signal">cd</span>) <span className="operator">-</span> <span className="signal">mid</span>;<br/>
  &#125;
              </pre>

              <h4>Key Implementation Details</h4>
              <ul>
                <li><strong>8-Point Control:</strong> pts[0,1,2] define top, pts[2,3,4] define right, etc.</li>
                <li><strong>Texture Mapping:</strong> The function also handles texture coordinates for shader application</li>
                <li><strong>Level Parameter:</strong> Higher levels create finer tessellation, smoother appearance</li>
                <li><strong>Triangle Indices:</strong> Each quad is split into two triangles for rendering</li>
                <li><strong>Edge Optimization:</strong> Boundary cases handled separately for accuracy</li>
              </ul>

              <h4>Visual Result</h4>
              <p>
                Coons patches create smooth, curved surfaces perfect for:
              </p>
              <ul>
                <li>Organic shape rendering (fabric, terrain, rounded UI elements)</li>
                <li>Texture mapping onto curved surfaces</li>
                <li>Morphing between shapes with curved boundaries</li>
                <li>Creating visually interesting backgrounds and effects</li>
              </ul>

              <p className="demo-instruction">
                <strong>Technical Note:</strong> The Coons patch formulation elegantly solves the
                problem of interpolating a surface from boundary conditions. The subtraction of the
                bilinear corner term prevents double-counting at the corners, a common pitfall in
                surface interpolation algorithms.
              </p>
            </div>
          </div>
        </section>
    </DocsLayout>
  )
}

export default GraphicsFinalFeaturesPage
