import React, { useState } from 'react'
import DocsLayout from '../../components/docs/DocsLayout'
import DocsSection from '../../components/docs/DocsSection'

function GraphicsOptimizationPage() {
  const [activeTab, setActiveTab] = useState('fixed-point')

  const tocItems = [
    { id: 'performance-engineering-in-software-rendering', label: 'Performance Engineering in Software Rendering', level: 2 },
    {
      id: 'fixed-point',
      label: 'Fixed-Point Division',
      level: 2,
      onClick: () => {
        setActiveTab('fixed-point')
        requestAnimationFrame(() => {
          document.getElementById('fixed-point')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      },
    },
    {
      id: 'fast-paths',
      label: 'Blend Fast Paths',
      level: 2,
      onClick: () => {
        setActiveTab('fast-paths')
        requestAnimationFrame(() => {
          document.getElementById('fast-paths')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      },
    },
    {
      id: 'dispatch',
      label: 'Static Dispatch',
      level: 2,
      onClick: () => {
        setActiveTab('dispatch')
        requestAnimationFrame(() => {
          document.getElementById('dispatch')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      },
    },
    {
      id: 'memory',
      label: 'Memory Access Patterns',
      level: 2,
      onClick: () => {
        setActiveTab('memory')
        requestAnimationFrame(() => {
          document.getElementById('memory')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      },
    },
  ]

  return (
    <DocsLayout
      project="graphics"
      currentSlug="optimization-performance"
      title="Optimization & Performance"
      subtitle="Fast Paths, Fixed-Point Math, and Dispatch Strategies"
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

        .docs-layout .docs-content .content-block {
            margin-bottom: 2rem;
        }

        .docs-layout .docs-content .info-box {
            background: #e8f5e9;
            border-left: 4px solid #2E7D32;
            padding: 1rem 1.5rem;
            margin: 1.5rem 0;
            border-radius: 4px;
        }

        .docs-layout .docs-content .info-box strong {
            color: #1B5E20;
        }

        .docs-layout .docs-content .data-table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
        }

        .docs-layout .docs-content .data-table thead {
            background: #2E7D32;
            color: white;
        }

        .docs-layout .docs-content .data-table th {
            padding: 0.75rem;
            text-align: left;
            font-weight: 600;
        }

        .docs-layout .docs-content .data-table td {
            padding: 0.75rem;
            border-bottom: 1px solid #ddd;
        }

        .docs-layout .docs-content .data-table tbody tr:nth-child(even) {
            background: #f8f9fa;
        }

      `}</style>

      <DocsSection id="performance-engineering-in-software-rendering" title="Performance Engineering in Software Rendering">
        <p>
          Software rendering performance hinges on minimizing per-pixel costs. Since a typical 1920×1080 frame contains over 2 million pixels, even small optimizations compound dramatically. This section explores the key performance techniques used in the graphics engine: fixed-point arithmetic for division, fast paths based on alpha transparency, and static dispatch to eliminate function call overhead.
        </p>
        <p>
          These optimizations focus on the <strong>hot path</strong>: the blend operation executed billions of times per second during rendering. By reducing blend costs from 20+ cycles to as few as 2 cycles for common cases, the engine achieves real-time performance for complex scenes.
        </p>
      </DocsSection>

      {/* Tabs container — wrapped in <section className="section"> manually since tabs have no h2 of their own. */}
      <section className="section tabs-container">
          <div className="tabs-header">
            <button
              className={`tab-button ${activeTab === 'fixed-point' ? 'active' : ''}`}
              onClick={() => setActiveTab('fixed-point')}
            >
              Fixed-Point Division
            </button>
            <button
              className={`tab-button ${activeTab === 'fast-paths' ? 'active' : ''}`}
              onClick={() => setActiveTab('fast-paths')}
            >
              Blend Fast Paths
            </button>
            <button
              className={`tab-button ${activeTab === 'dispatch' ? 'active' : ''}`}
              onClick={() => setActiveTab('dispatch')}
            >
              Static Dispatch
            </button>
            <button
              className={`tab-button ${activeTab === 'memory' ? 'active' : ''}`}
              onClick={() => setActiveTab('memory')}
            >
              Memory Access Patterns
            </button>
          </div>

          <div className="tabs-content">
            {/* Tab 1: Fixed-Point Division */}
            <div id="fixed-point" className={`tab-panel ${activeTab === 'fixed-point' ? 'active' : ''}`}>
              <h3>Fixed-Point Division by 255</h3>

              <div className="content-block">
                <h4>The Problem</h4>
                <p>
                  Porter-Duff blend formulas require dividing by 255 to normalize alpha-scaled products back to [0, 255]. For example, in src-over blending:
                </p>
                <pre className="code-block">
  <span className="signal">result_channel</span> <span className="operator">=</span> <span className="signal">src_channel</span> <span className="operator">+</span> (<span className="signal">dest_channel</span> <span className="operator">*</span> (<span className="number">255</span> <span className="operator">-</span> <span className="signal">src_alpha</span>)) <span className="operator">/</span> <span className="number">255</span>
                </pre>
                <p>
                  Integer division is <strong>40-80 cycles</strong> on modern CPUs, making it the bottleneck in blend operations. With millions of pixels per frame, this division dominates rendering time.
                </p>
              </div>

              <div className="content-block">
                <h4>The Solution: Fixed-Point Approximation</h4>
                <p>
                  Instead of true division, we use a fixed-point trick that approximates <code>x/255</code> using shifts and adds:
                </p>
                <pre className="code-block">
  <span className="keyword">static</span> <span className="keyword">inline</span> <span className="signal">uint8_t</span> <span className="signal">div255</span>(<span className="keyword">unsigned</span> <span className="signal">before</span>) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> (<span className="signal">before</span> <span className="operator">+</span> <span className="number">128</span>) <span className="operator">*</span> <span className="number">257</span> <span className="operator">&gt;&gt;</span> <span className="number">16</span>;<br/>
  &#125;
                </pre>

                <p><strong>Mathematical Proof:</strong></p>
                <p>
                  We want to compute <code>floor(x / 255)</code> for <code>0 ≤ x ≤ 65025</code> (max product of two 8-bit values).
                </p>
                <p>
                  Note that <code>257 = 2^16 / 255</code> approximately. Multiplying by 257 and shifting right by 16 bits is equivalent to dividing by <code>2^16 / 257 ≈ 255</code>.
                </p>
                <p>
                  The <code>+ 128</code> offset provides rounding: it adds 0.5 in the fixed-point representation (128/256 = 0.5), ensuring the result rounds to nearest instead of truncating.
                </p>

                <div className="info-box">
                  <strong>Accuracy:</strong> This approximation is exact for all values in [0, 65025]. The maximum error is 0, making it a perfect substitute for true division by 255.
                </div>

                <div className="info-box">
                  <strong>Performance:</strong> Reduces blend operation cost from ~80 cycles (with division) to ~8 cycles. On modern CPUs with mul + shift fusion, this can be as fast as 2-3 cycles.
                </div>
              </div>

              <div className="content-block">
                <h4>Usage in Blend Functions</h4>
                <p>
                  Every Porter-Duff blend mode uses <code>div255</code> for alpha-scaled multiplication:
                </p>
                <pre className="code-block">
  <span className="comment">// Src-over blend: S + D * (1 - Sa)</span><br/>
  <span className="signal">GPixel</span> <span className="signal">src_over_mode</span>(<span className="signal">GPixel</span> <span className="signal">src</span>, <span className="signal">GPixel</span> <span className="signal">dest</span>) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">sa</span> <span className="operator">=</span> <span className="signal">GPixel_GetA</span>(<span className="signal">src</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// ... extract other channels ...</span><br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">ba</span> <span className="operator">=</span> <span className="signal">sa</span> <span className="operator">+</span> <span className="signal">div255</span>((<span className="number">255</span> <span className="operator">-</span> <span className="signal">sa</span>) <span className="operator">*</span> <span className="signal">da</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">br</span> <span className="operator">=</span> <span className="signal">sr</span> <span className="operator">+</span> <span className="signal">div255</span>((<span className="number">255</span> <span className="operator">-</span> <span className="signal">sa</span>) <span className="operator">*</span> <span className="signal">dr</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">bg</span> <span className="operator">=</span> <span className="signal">sg</span> <span className="operator">+</span> <span className="signal">div255</span>((<span className="number">255</span> <span className="operator">-</span> <span className="signal">sa</span>) <span className="operator">*</span> <span className="signal">dg</span>);<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">bb</span> <span className="operator">=</span> <span className="signal">sb</span> <span className="operator">+</span> <span className="signal">div255</span>((<span className="number">255</span> <span className="operator">-</span> <span className="signal">sa</span>) <span className="operator">*</span> <span className="signal">db</span>);<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">GPixel_PackARGB</span>(<span className="signal">ba</span>, <span className="signal">br</span>, <span className="signal">bg</span>, <span className="signal">bb</span>);<br/>
  &#125;
                </pre>
                <p>
                  This pattern repeats across all 12 blend modes, with <code>div255</code> called 4 times per pixel (once per ARGB channel). The optimization compounds: rendering a 1920×1080 frame with alpha blending performs ~8 million <code>div255</code> calls. Without this trick, frame rendering would take seconds instead of milliseconds.
                </p>
              </div>
            </div>

            {/* Tab 2: Blend Fast Paths */}
            <div id="fast-paths" className={`tab-panel ${activeTab === 'fast-paths' ? 'active' : ''}`}>
              <h3>Blend Mode Fast Paths</h3>

              <div className="content-block">
                <h4>The Optimization</h4>
                <p>
                  Many blend modes simplify dramatically when the source alpha is fully opaque (α = 1) or fully transparent (α = 0). The engine detects these cases early and substitutes simpler blend modes, eliminating unnecessary computation.
                </p>

                <div className="info-box">
                  <strong>Example:</strong> When source alpha is 1.0 (opaque), <code>src-over</code> reduces to <code>src</code> because the formula <code>S + D * (1 - Sa)</code> becomes <code>S + D * 0 = S</code>. This eliminates 4 multiplications and 4 <code>div255</code> calls per pixel.
                </div>
              </div>

              <div className="content-block">
                <h4>Fast Path Logic</h4>
                <p>
                  The <code>getBlendMode</code> function analyzes source alpha and rewrites the blend mode at draw time:
                </p>
                <pre className="code-block">
  <span className="signal">BlendProc</span> <span className="signal">getBlendMode</span>(<span className="signal">BlendProc</span> <span className="signal">proc</span>, <span className="signal">GColor</span> <span className="signal">color</span>) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Opaque source (α = 1): Many modes simplify</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">color</span>.<span className="signal">a</span> <span className="operator">==</span> <span className="number">1</span>) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">proc</span> <span className="operator">==</span> <span className="signal">src_over_mode</span>) &#123; <span className="keyword">return</span> <span className="signal">src_mode</span>; &#125;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// S + 0 = S</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">proc</span> <span className="operator">==</span> <span className="signal">dst_out_mode</span>) &#123; <span className="keyword">return</span> <span className="signal">clear_mode</span>; &#125;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// 0</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">proc</span> <span className="operator">==</span> <span className="signal">src_atop_mode</span>) &#123; <span className="keyword">return</span> <span className="signal">src_in_mode</span>; &#125;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Da*S</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">proc</span> <span className="operator">==</span> <span className="signal">xor_mode</span>) &#123; <span className="keyword">return</span> <span className="signal">src_out_mode</span>; &#125;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// S * (1-Da)</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Transparent source (α = 0): Even more modes reduce to no-op or clear</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">color</span>.<span className="signal">a</span> <span className="operator">==</span> <span className="number">0</span>) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">proc</span> <span className="operator">==</span> <span className="signal">src_mode</span>) &#123; <span className="keyword">return</span> <span className="signal">clear_mode</span>; &#125;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// 0</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">proc</span> <span className="operator">==</span> <span className="signal">src_over_mode</span>) &#123; <span className="keyword">return</span> <span className="signal">dst_mode</span>; &#125;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// D (no change)</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">proc</span> <span className="operator">==</span> <span className="signal">dst_over_mode</span>) &#123; <span className="keyword">return</span> <span className="signal">dst_mode</span>; &#125;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// D</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">proc</span> <span className="operator">==</span> <span className="signal">src_in_mode</span>) &#123; <span className="keyword">return</span> <span className="signal">clear_mode</span>; &#125;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// 0</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">proc</span> <span className="operator">==</span> <span className="signal">dst_in_mode</span>) &#123; <span className="keyword">return</span> <span className="signal">clear_mode</span>; &#125;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// 0</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">proc</span> <span className="operator">==</span> <span className="signal">src_atop_mode</span>) &#123; <span className="keyword">return</span> <span className="signal">dst_mode</span>; &#125;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// D</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">proc</span> <span className="operator">==</span> <span className="signal">xor_mode</span>) &#123; <span className="keyword">return</span> <span className="signal">dst_mode</span>; &#125;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// D</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">proc</span>;&nbsp;&nbsp;<span className="comment">// No optimization available</span><br/>
  &#125;
                </pre>
              </div>

              <div className="content-block">
                <h4>Impact on Common Scenarios</h4>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Scenario</th>
                      <th>Without Optimization</th>
                      <th>With Fast Path</th>
                      <th>Speedup</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Opaque rect fill (src-over)</td>
                      <td>4 multiplies + 4 div255</td>
                      <td>Direct copy (src mode)</td>
                      <td><strong>~10x</strong></td>
                    </tr>
                    <tr>
                      <td>Transparent shape (α=0)</td>
                      <td>Full blend calculation</td>
                      <td>No-op (dst mode)</td>
                      <td><strong>Skip entirely</strong></td>
                    </tr>
                    <tr>
                      <td>Clearing region (dst-out, α=1)</td>
                      <td>Multiplications per pixel</td>
                      <td>Memset to zero</td>
                      <td><strong>~20x</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="content-block">
                <h4>Real-World Performance Gains</h4>
                <p>
                  These optimizations are most impactful for:
                </p>
                <ul>
                  <li><strong>Solid color fills</strong> – UI backgrounds, rectangles, cleared regions (90%+ of pixels can use fast paths)</li>
                  <li><strong>Gradient fills</strong> – Edges may be semi-transparent, but interior pixels are often opaque</li>
                  <li><strong>Layered composition</strong> – Background layers frequently use opaque colors</li>
                </ul>
                <p>
                  In typical UI rendering (buttons, backgrounds, text), 60-80% of pixels hit a fast path, resulting in 4-8x overall speedup compared to naive blending.
                </p>
              </div>
            </div>

            {/* Tab 3: Static Dispatch */}
            <div id="dispatch" className={`tab-panel ${activeTab === 'dispatch' ? 'active' : ''}`}>
              <h3>Static Dispatch for Blend Functions</h3>

              <div className="content-block">
                <h4>The Problem: Indirect Call Overhead</h4>
                <p>
                  Blend modes could be implemented using a function pointer array and dynamic dispatch:
                </p>
                <pre className="code-block">
  <span className="comment">// Function pointer array</span><br/>
  <span className="keyword">const</span> <span className="signal">BlendProc</span> <span className="signal">gProcs</span>[] <span className="operator">=</span> &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">clear_mode</span>, <span className="signal">src_mode</span>, <span className="signal">dst_mode</span>, <span className="signal">src_over_mode</span>,<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">/* ...8 more blend functions... */</span><br/>
  &#125;;<br/>
  <br/>
  <span className="comment">// Dynamic dispatch (slow)</span><br/>
  <span className="keyword">for</span> (<span className="keyword">int</span> <span className="signal">i</span> <span className="operator">=</span> <span className="number">0</span>; <span className="signal">i</span> <span className="operator">&lt;</span> <span className="signal">n</span>; <span className="signal">i</span><span className="operator">++</span>) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">dst</span>[<span className="signal">i</span>] <span className="operator">=</span> <span className="signal">gProcs</span>[<span className="signal">mode</span>](<span className="signal">src</span>[<span className="signal">i</span>], <span className="signal">dst</span>[<span className="signal">i</span>]);&nbsp;&nbsp;<span className="comment">// Indirect call per pixel</span><br/>
  &#125;
                </pre>
                <p>
                  <strong>Cost:</strong> Each indirect function call adds 10-20 cycles due to pipeline stalls (branch prediction fails, instruction cache misses, register spilling). For a 1920×1080 frame, this adds ~40 million wasted cycles (20+ milliseconds).
                </p>
              </div>

              <div className="content-block">
                <h4>The Solution: Static Dispatch with Templates</h4>
                <p>
                  The engine uses template-based static dispatch with an if-else chain. The compiler unrolls this into a jump table with predictable branches:
                </p>
                <pre className="code-block">
  <span className="keyword">template</span><span className="operator">&lt;</span><span className="keyword">typename</span> <span className="signal">Proc</span><span className="operator">&gt;</span><br/>
  <span className="keyword">void</span> <span className="signal">blitRow</span>(<span className="keyword">int</span> <span className="signal">x</span>, <span className="keyword">int</span> <span className="signal">y</span>, <span className="keyword">int</span> <span className="signal">n</span>, <span className="signal">Proc</span> <span className="signal">blend</span>, <span className="signal">GBitmap</span> <span className="signal">fDevice</span>, <span className="signal">GPixel</span> <span className="signal">src</span>) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPixel</span><span className="operator">*</span> <span className="signal">dst</span> <span className="operator">=</span> <span className="signal">fDevice</span>.<span className="signal">getAddr</span>(<span className="signal">x</span>, <span className="signal">y</span>);<br/>
  <br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">blend</span> <span className="operator">==</span> <span className="signal">src_mode</span>) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">for</span> (<span className="keyword">int</span> <span className="signal">i</span> <span className="operator">=</span> <span className="number">0</span>; <span className="signal">i</span> <span className="operator">&lt;</span> <span className="signal">n</span>; <span className="signal">i</span><span className="operator">++</span>) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">dst</span>[<span className="signal">i</span>] <span className="operator">=</span> <span className="signal">src</span>;&nbsp;&nbsp;<span className="comment">// Direct assignment, no function call</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">else</span> <span className="keyword">if</span> (<span className="signal">blend</span> <span className="operator">==</span> <span className="signal">src_over_mode</span>) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">for</span> (<span className="keyword">int</span> <span className="signal">i</span> <span className="operator">=</span> <span className="number">0</span>; <span className="signal">i</span> <span className="operator">&lt;</span> <span className="signal">n</span>; <span className="signal">i</span><span className="operator">++</span>) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">dst</span>[<span className="signal">i</span>] <span className="operator">=</span> <span className="signal">src_over_mode</span>(<span className="signal">src</span>, <span className="signal">dst</span>[<span className="signal">i</span>]);&nbsp;&nbsp;<span className="comment">// Direct call</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// ...10 more blend modes with direct calls...</span><br/>
  &#125;
                </pre>

                <div className="info-box">
                  <strong>Why This Works:</strong> The template parameter <code>Proc</code> is known at compile time. The compiler evaluates <code>blend == src_mode</code> statically, eliminating dead branches. Each instantiation of <code>blitRow</code> compiles to a single tight loop with direct function calls (which can be inlined).
                </div>
              </div>

              <div className="content-block">
                <h4>Branch Prediction Benefits</h4>
                <p>
                  In a typical rendering frame, the same blend mode is used for thousands of consecutive pixels. The CPU's branch predictor learns the pattern after 2-3 iterations, achieving 99%+ prediction accuracy. Combined with loop unrolling, this reduces the effective cost of the dispatch to near-zero.
                </p>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Method</th>
                      <th>Cost per Pixel</th>
                      <th>Inline-able</th>
                      <th>Branch Predict</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Function pointer</td>
                      <td>~15 cycles</td>
                      <td>❌ No</td>
                      <td>❌ Poor</td>
                    </tr>
                    <tr>
                      <td>Virtual function</td>
                      <td>~12 cycles</td>
                      <td>❌ No</td>
                      <td>⚠️ Fair</td>
                    </tr>
                    <tr>
                      <td><strong>Static dispatch (this engine)</strong></td>
                      <td><strong>~2 cycles</strong></td>
                      <td><strong>✅ Yes</strong></td>
                      <td><strong>✅ Excellent</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="content-block">
                <h4>Code Size Trade-off</h4>
                <p>
                  Static dispatch increases code size: each instantiation of <code>blitRow</code> generates separate machine code. With 12 blend modes, this creates 12 copies of the loop (~1-2 KB each). Total cost: ~15-20 KB.
                </p>
                <p>
                  <strong>Worth it?</strong> Absolutely. Modern CPUs have 256+ KB L2 cache. The 20 KB cost is negligible, and the 5-8x speedup in the hot path justifies the trade-off.
                </p>
              </div>
            </div>

            {/* Tab 4: Memory Access Patterns */}
            <div id="memory" className={`tab-panel ${activeTab === 'memory' ? 'active' : ''}`}>
              <h3>Memory Access Patterns</h3>

              <div className="content-block">
                <h4>Scanline-Based Rendering</h4>
                <p>
                  The engine renders shapes scanline-by-scanline (row-by-row), not pixel-by-pixel. This enables highly efficient memory access patterns:
                </p>
                <pre className="code-block">
  <span className="comment">// Process entire scanline at once</span><br/>
  <span className="keyword">for</span> (<span className="keyword">int</span> <span className="signal">y</span> <span className="operator">=</span> <span className="signal">top</span>; <span className="signal">y</span> <span className="operator">&lt;</span> <span className="signal">bottom</span>; <span className="signal">y</span><span className="operator">++</span>) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPixel</span><span className="operator">*</span> <span className="signal">dst</span> <span className="operator">=</span> <span className="signal">fDevice</span>.<span className="signal">getAddr</span>(<span className="signal">x_left</span>, <span className="signal">y</span>);&nbsp;&nbsp;<span className="comment">// Get row pointer</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">for</span> (<span className="keyword">int</span> <span className="signal">x</span> <span className="operator">=</span> <span className="number">0</span>; <span className="signal">x</span> <span className="operator">&lt;</span> <span className="signal">width</span>; <span className="signal">x</span><span className="operator">++</span>) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">dst</span>[<span className="signal">x</span>] <span className="operator">=</span> <span className="signal">blend</span>(<span className="signal">src</span>[<span className="signal">x</span>], <span className="signal">dst</span>[<span className="signal">x</span>]);&nbsp;&nbsp;<span className="comment">// Sequential memory access</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
  &#125;
                </pre>

                <div className="info-box">
                  <strong>Cache Efficiency:</strong> Sequential row access achieves 95%+ cache hit rate. The CPU prefetcher detects the linear pattern and loads upcoming pixels into L1 cache before they're needed, hiding memory latency.
                </div>
              </div>

              <div className="content-block">
                <h4>Why Scanline Order Matters</h4>
                <p>
                  Pixel framebuffers are stored row-major in memory: all pixels in a row are contiguous. Accessing pixels in scanline order is 20-50x faster than random access due to:
                </p>
                <ul>
                  <li><strong>Cache lines</strong> – CPUs load 64 bytes (16 pixels) per cache miss. Sequential access amortizes this cost over 16 pixels instead of 1.</li>
                  <li><strong>Prefetching</strong> – Hardware prefetchers detect stride-1 patterns and automatically fetch ahead, achieving near-zero memory latency.</li>
                  <li><strong>TLB efficiency</strong> – Sequential access uses fewer page table entries, reducing TLB misses.</li>
                </ul>
              </div>

              <div className="content-block">
                <h4>Minimizing Writes</h4>
                <p>
                  The blend fast paths eliminate unnecessary writes. When the blend mode is <code>dst</code> (destination unchanged) or when alpha is 0, the engine skips the entire scanline:
                </p>
                <pre className="code-block">
  <span className="keyword">if</span> (<span className="signal">blend</span> <span className="operator">==</span> <span className="signal">dst_mode</span>) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// No write needed - destination unchanged</span><br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span>;&nbsp;&nbsp;<span className="comment">// Skip entire scanline</span><br/>
  &#125;<br/>
  <br/>
  <span className="comment">// Otherwise, process normally</span><br/>
  <span className="keyword">for</span> (<span className="keyword">int</span> <span className="signal">i</span> <span className="operator">=</span> <span className="number">0</span>; <span className="signal">i</span> <span className="operator">&lt;</span> <span className="signal">n</span>; <span className="signal">i</span><span className="operator">++</span>) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">dst</span>[<span className="signal">i</span>] <span className="operator">=</span> <span className="signal">blend</span>(<span className="signal">src</span>[<span className="signal">i</span>], <span className="signal">dst</span>[<span className="signal">i</span>]);<br/>
  &#125;
                </pre>
                <p>
                  <strong>Impact:</strong> In multi-layer rendering (e.g., UI with transparent overlays), 30-50% of draw calls can skip writing entirely. This reduces memory bandwidth usage and cache pollution.
                </p>
              </div>

              <div className="content-block">
                <h4>Data Layout for Shaders</h4>
                <p>
                  Shaders generate colors into a temporary buffer, which is then blended:
                </p>
                <pre className="code-block">
  <span className="comment">// Shader fills row buffer</span><br/>
  <span className="signal">GPixel</span> <span className="signal">row_buffer</span>[<span className="signal">width</span>];<br/>
  <span className="signal">shader</span><span className="operator">-&gt;</span><span className="signal">shadeRow</span>(<span className="signal">x</span>, <span className="signal">y</span>, <span className="signal">width</span>, <span className="signal">row_buffer</span>);<br/>
  <br/>
  <span className="comment">// Blend from buffer to framebuffer</span><br/>
  <span className="signal">GPixel</span><span className="operator">*</span> <span className="signal">dst</span> <span className="operator">=</span> <span className="signal">fDevice</span>.<span className="signal">getAddr</span>(<span className="signal">x</span>, <span className="signal">y</span>);<br/>
  <span className="keyword">for</span> (<span className="keyword">int</span> <span className="signal">i</span> <span className="operator">=</span> <span className="number">0</span>; <span className="signal">i</span> <span className="operator">&lt;</span> <span className="signal">width</span>; <span className="signal">i</span><span className="operator">++</span>) &#123;<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">dst</span>[<span className="signal">i</span>] <span className="operator">=</span> <span className="signal">blend</span>(<span className="signal">row_buffer</span>[<span className="signal">i</span>], <span className="signal">dst</span>[<span className="signal">i</span>]);<br/>
  &#125;
                </pre>
                <p>
                  <strong>Why separate?</strong> This allows shaders to compute colors optimally (e.g., vectorized gradient interpolation) without interleaving with blend operations. The temporary buffer stays in L1 cache, so the extra copy is nearly free (~1 cycle per pixel).
                </p>
              </div>
            </div>
          </div>
        </section>
    </DocsLayout>
  )
}

export default GraphicsOptimizationPage
