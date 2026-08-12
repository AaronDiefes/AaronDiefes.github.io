import React, { useState } from 'react'
import DocsLayout from '../../components/docs/DocsLayout'
import DocsSection from '../../components/docs/DocsSection'

function GraphicsCoreRenderingPage() {
  const [activeTab, setActiveTab] = useState('edge')

  const tocItems = [
    { id: 'introduction', label: 'Introduction', level: 2 },
    {
      id: 'edge',
      label: 'Edge Rasterization',
      level: 2,
      onClick: () => {
        setActiveTab('edge')
        requestAnimationFrame(() => {
          document.getElementById('edge')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      },
    },
    {
      id: 'rect',
      label: 'Rectangle Drawing',
      level: 2,
      onClick: () => {
        setActiveTab('rect')
        requestAnimationFrame(() => {
          document.getElementById('rect')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      },
    },
    {
      id: 'blend',
      label: 'Porter-Duff Blending',
      level: 2,
      onClick: () => {
        setActiveTab('blend')
        requestAnimationFrame(() => {
          document.getElementById('blend')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      },
    },
    {
      id: 'clip',
      label: 'Polygon Clipping',
      level: 2,
      onClick: () => {
        setActiveTab('clip')
        requestAnimationFrame(() => {
          document.getElementById('clip')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      },
    },
  ]

  return (
    <DocsLayout
      project="graphics"
      currentSlug="core-rendering"
      title="Core Rendering"
      subtitle="Edge Rasterization, Shape Drawing, and Blend Modes"
      tocItems={tocItems}
    >
      <style>{`
        .docs-layout .docs-content h4 {
            color: var(--color-text-heading);
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            font-size: 1.25rem;
        }

        .docs-layout .docs-content code {
            background: var(--color-surface-alt);
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 0.9rem;
            color: var(--color-code-string);
        }

        .docs-layout .docs-content .code-block {
            background: var(--color-code-bg);
            color: var(--color-code-text);
            padding: 1.5rem;
            border-radius: 8px;
            overflow-x: auto;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 0.9rem;
            line-height: 1.6;
            margin: 1.5rem 0;
            white-space: pre;
        }
      `}</style>

      <DocsSection id="introduction" title="Introduction">
        <p>
          Core rendering forms the foundation of the entire graphics engine. Every shape drawn on screen—whether a simple rectangle or a complex curved path—ultimately becomes a collection of edges that are rasterized into pixels through a scanline algorithm.
        </p>
        <p>
          This section establishes the fundamental building blocks: drawing rectangles, implementing edge-based rasterization, and creating a full Porter-Duff alpha blending system. It then extends this foundation to handle arbitrary convex polygons with viewport clipping, enabling the rendering of triangles, pentagons, and any other convex shape.
        </p>
        <p>
          This page covers the core algorithms that make it all work: how shapes are converted to edges, how those edges are walked scanline-by-scanline, how alpha values are properly composited, and how shapes are clipped to stay within the viewport boundaries.
        </p>
      </DocsSection>

      {/* Tabs container — wrapped in <section className="section"> manually since tabs have no h2 of their own. */}
      <section className="section tabs-container">
        <div className="tabs-header">
          <button
            className={`tab-button ${activeTab === 'edge' ? 'active' : ''}`}
            onClick={() => setActiveTab('edge')}
          >
            Edge Rasterization
          </button>
          <button
            className={`tab-button ${activeTab === 'rect' ? 'active' : ''}`}
            onClick={() => setActiveTab('rect')}
          >
            Rectangle Drawing
          </button>
          <button
            className={`tab-button ${activeTab === 'blend' ? 'active' : ''}`}
            onClick={() => setActiveTab('blend')}
          >
            Porter-Duff Blending
          </button>
          <button
            className={`tab-button ${activeTab === 'clip' ? 'active' : ''}`}
            onClick={() => setActiveTab('clip')}
          >
            Polygon Clipping
          </button>
        </div>

        <div className="tabs-content">
          {/* Tab 1: Edge Rasterization */}
          <div id="edge" className={`tab-panel ${activeTab === 'edge' ? 'active' : ''}`}>
            <h3>Edge-Based Rendering</h3>
            <p>
              The graphics engine uses an edge-based scanline algorithm for all shape rendering. Every shape—rectangle, triangle, polygon, path—is first converted into a list of edges. Each edge represents one side of the shape, storing the top and bottom Y coordinates, the X position, and the slope (how X changes as Y increments).
            </p>
            <p>
              The scanline algorithm then processes the frame buffer row by row. For each Y coordinate, it finds all active edges, calculates their X intersections, and fills between pairs of edges. This approach handles arbitrary shapes efficiently and naturally supports anti-aliasing in future extensions.
            </p>

            <h4>Edge Structure</h4>
            <p>
              Each edge stores its vertical span (top to bottom), its current X position, and its slope for efficient scanline traversal. The <code>dire</code> (direction) field tracks whether the edge runs left-to-right or right-to-left, which is crucial for the winding rule used in complex path rendering.
            </p>

            <pre className="code-block">
<span className="keyword">class</span> <span className="signal">Edge</span> &#123;<br/>
<span className="keyword">public</span>:<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">top</span>, <span className="signal">bottom</span>;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">m</span>, <span className="signal">x</span>;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">dire</span>;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">left_x</span>;<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">Edge</span>(<span className="signal">GPoint</span> <span className="signal">p0</span>, <span className="signal">GPoint</span> <span className="signal">p1</span>, <span className="signal">GBitmap</span> <span className="signal">fDevice</span>, <span className="keyword">int</span> <span className="signal">dir</span>) &#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">p0</span>.<span className="signal">y</span> <span className="operator">&gt;</span> <span className="signal">p1</span>.<span className="signal">y</span>) &#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">std</span>::<span className="signal">swap</span>(<span className="signal">p0</span>, <span className="signal">p1</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">top</span> <span className="operator">=</span> <span className="signal">GRoundToInt</span>(<span className="signal">p0</span>.<span className="signal">y</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">bottom</span> <span className="operator">=</span> <span className="signal">GRoundToInt</span>(<span className="signal">p1</span>.<span className="signal">y</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">left_x</span> <span className="operator">=</span> <span className="signal">p0</span>.<span className="signal">x</span>;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">m</span> <span className="operator">=</span> <span className="signal">calculateSlope</span>(<span className="signal">p0</span>, <span className="signal">p1</span>);<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">b</span> <span className="operator">=</span> <span className="signal">calculateB</span>(<span className="signal">p0</span>, <span className="signal">p1</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">x</span> <span className="operator">=</span> <span className="signal">b</span>;<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">dire</span> <span className="operator">=</span> <span className="signal">dir</span>;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">eval</span>(<span className="keyword">int</span> <span className="signal">y</span>)&#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">m</span> <span className="operator">*</span> ((<span className="keyword">float</span>)<span className="signal">y</span> <span className="operator">+</span> <span className="number">0.5f</span>) <span className="operator">+</span> <span className="signal">x</span>;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
<br/>
<span className="keyword">private</span>:<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">calculateSlope</span>(<span className="signal">GPoint</span> <span className="signal">p0</span>, <span className="signal">GPoint</span> <span className="signal">p1</span>) &#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> (<span className="signal">p1</span>.<span className="signal">x</span> <span className="operator">-</span> <span className="signal">p0</span>.<span className="signal">x</span>) <span className="operator">/</span> (<span className="signal">p1</span>.<span className="signal">y</span> <span className="operator">-</span> <span className="signal">p0</span>.<span className="signal">y</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">calculateB</span>(<span className="signal">GPoint</span> <span className="signal">p0</span>, <span className="signal">GPoint</span> <span className="signal">p1</span>) &#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">p0</span>.<span className="signal">x</span> <span className="operator">-</span> (<span className="signal">m</span> <span className="operator">*</span> <span className="signal">p0</span>.<span className="signal">y</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
&#125;;
            </pre>

            <h4>Scanline Filling</h4>
            <p>
              The <code>eval()</code> method is the heart of edge rasterization. For any given Y coordinate, it calculates the corresponding X position by evaluating <code>m * (y + 0.5) + b</code>. The <code>+ 0.5</code> samples at the pixel center, which is essential for proper geometric accuracy.
            </p>
            <p>
              During rendering, edges are sorted by Y position, then processed scanline by scanline. As each row is rendered, the algorithm finds pairs of edge intersections and fills the pixels between them. This approach works for any convex polygon and forms the foundation for more complex path rendering.
            </p>
          </div>

          {/* Tab 2: Rectangle Drawing */}
          <div id="rect" className={`tab-panel ${activeTab === 'rect' ? 'active' : ''}`}>
            <h3>Rectangle Rendering</h3>
            <p>
              Rectangles are the simplest renderable shape, but they demonstrate the core rendering pipeline. A rectangle is defined by four corner points, which are converted into four edges, then passed through the same scanline algorithm used for all shapes.
            </p>
            <p>
              The <code>drawRect()</code> function converts a <code>GRect</code> into four <code>GPoint</code> vertices, then delegates to <code>drawConvexPolygon()</code>. This design means rectangles get all the benefits of the polygon renderer: clipping, transformation support, and complex blend modes.
            </p>

            <h4>Rectangle to Polygon Conversion</h4>
            <pre className="code-block">
<span className="keyword">void</span> <span className="signal">MyCanvas</span>::<span className="signal">drawRect</span>(<span className="keyword">const</span> <span className="signal">GRect</span><span className="operator">&amp;</span> <span className="signal">rect</span>, <span className="keyword">const</span> <span className="signal">GPaint</span><span className="operator">&amp;</span> <span className="signal">paint</span>) &#123;<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">p1</span> <span className="operator">=</span> &#123;<span className="signal">rect</span>.<span className="signal">left</span>, <span className="signal">rect</span>.<span className="signal">top</span>&#125;;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">p2</span> <span className="operator">=</span> &#123;<span className="signal">rect</span>.<span className="signal">right</span>, <span className="signal">rect</span>.<span className="signal">top</span>&#125;;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">p3</span> <span className="operator">=</span> &#123;<span className="signal">rect</span>.<span className="signal">right</span>, <span className="signal">rect</span>.<span className="signal">bottom</span>&#125;;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">p4</span> <span className="operator">=</span> &#123;<span className="signal">rect</span>.<span className="signal">left</span>, <span className="signal">rect</span>.<span className="signal">bottom</span>&#125;;<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">src</span>[<span className="number">4</span>] <span className="operator">=</span> &#123;<span className="signal">p1</span>, <span className="signal">p2</span>, <span className="signal">p3</span>, <span className="signal">p4</span>&#125;;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">drawConvexPolygon</span>(<span className="signal">src</span>, <span className="number">4</span>, <span className="signal">paint</span>);<br/>
&#125;;
            </pre>

            <h4>Convex Polygon Rendering</h4>
            <p>
              The <code>drawConvexPolygon()</code> function handles all convex shapes. It transforms points by the current transformation matrix, creates edges between consecutive vertices (wrapping from the last back to the first), clips those edges to the viewport, sorts them by Y coordinate, and finally fills the polygon using the scanline algorithm.
            </p>

            <pre className="code-block">
<span className="keyword">void</span> <span className="signal">MyCanvas</span>::<span className="signal">drawConvexPolygon</span>(<span className="keyword">const</span> <span className="signal">GPoint</span> <span className="signal">points</span>[], <span className="keyword">int</span> <span className="signal">count</span>, <span className="keyword">const</span> <span className="signal">GPaint</span><span className="operator">&amp;</span> <span className="signal">paint</span>)&#123;<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span>(<span className="signal">count</span> <span className="operator">&lt;</span> <span className="number">3</span>)&#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span>;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">dst</span>[<span className="signal">count</span>];<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GMatrix</span> <span className="signal">mat</span> <span className="operator">=</span> <span className="signal">ctm</span>[<span className="signal">ctm</span>.<span className="signal">size</span>() <span className="operator">-</span> <span className="number">1</span>];<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">mat</span>.<span className="signal">mapPoints</span>(<span className="signal">dst</span>, <span className="signal">points</span>, <span className="signal">count</span>);<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">std</span>::<span className="signal">vector</span><span className="operator">&lt;</span><span className="signal">Edge</span><span className="operator">&gt;</span> <span className="signal">edges</span>;<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Create array of edges</span><br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">for</span>(<span className="keyword">int</span> <span className="signal">i</span> <span className="operator">=</span> <span className="number">0</span>; <span className="signal">i</span> <span className="operator">&lt;</span> <span className="signal">count</span>; <span className="signal">i</span><span className="operator">++</span>)&#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">nextIndex</span> <span className="operator">=</span> (<span className="signal">i</span> <span className="operator">+</span> <span className="number">1</span>) <span className="operator">%</span> <span className="signal">count</span>;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">Edge</span>::<span className="signal">clip</span>(<span className="signal">dst</span>[<span className="signal">i</span>], <span className="signal">dst</span>[<span className="signal">nextIndex</span>], <span className="signal">fDevice</span>, <span className="signal">edges</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">edges</span>.<span className="signal">size</span>() <span className="operator">&lt;</span> <span className="number">2</span>)&#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span>;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Sort by top value</span><br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">std</span>::<span className="signal">sort</span>(<span className="signal">edges</span>.<span className="signal">begin</span>(), <span className="signal">edges</span>.<span className="signal">end</span>(), [](<span className="keyword">const</span> <span className="signal">Edge</span><span className="operator">&amp;</span> <span className="signal">a</span>, <span className="keyword">const</span> <span className="signal">Edge</span><span className="operator">&amp;</span> <span className="signal">b</span>) &#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">a</span>.<span className="signal">top</span> <span className="operator">&gt;</span> <span className="signal">b</span>.<span className="signal">top</span>;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&#125;);<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// ... blend mode selection and optimization ...</span><br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">fillPolygon</span>(<span className="signal">edges</span>, <span className="signal">color</span>, <span className="signal">proc</span>, <span className="signal">fDevice</span>);<br/>
&#125;
            </pre>

            <p>
              Note how the function creates edges by connecting each vertex to the next, with the last vertex wrapping back to the first via modulo arithmetic. This automatically closes the polygon. The edges are then clipped and sorted before being passed to the fill routine.
            </p>
          </div>

          {/* Tab 3: Porter-Duff Blending */}
          <div id="blend" className={`tab-panel ${activeTab === 'blend' ? 'active' : ''}`}>
            <h3>Alpha Compositing with Porter-Duff</h3>
            <p>
              The graphics engine implements the complete Porter-Duff compositing model with 12 blend modes. Porter-Duff blending defines how source pixels (S) combine with destination pixels (D) based on their alpha values, using the formula: <code>result = S_coef * S + D_coef * D</code>.
            </p>
            <p>
              All blending operates on <strong>premultiplied alpha</strong>, where RGB channels are already multiplied by the alpha channel. This representation makes compositing math simpler and more efficient: instead of unpremultiply-blend-repremultiply on every pixel, we work directly with premultiplied values.
            </p>

            <h4>Src Over (Most Common Blend Mode)</h4>
            <p>
              The <code>src_over</code> blend mode is the default compositing operation used when drawing one image over another. It places the source pixel "over" the destination, with the destination showing through transparent areas. The formula is: <code>S + (1 - Sa) * D</code>, where Sa is the source alpha.
            </p>

            <pre className="code-block">
<span className="comment">// S + (1 - Sa)*D</span><br/>
<span className="signal">GPixel</span> <span className="signal">src_over_mode</span>(<span className="signal">GPixel</span> <span className="signal">src</span>, <span className="signal">GPixel</span> <span className="signal">dest</span>)&#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">sa</span> <span className="operator">=</span> <span className="signal">GPixel_GetA</span>(<span className="signal">src</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">sr</span> <span className="operator">=</span> <span className="signal">GPixel_GetR</span>(<span className="signal">src</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">sg</span> <span className="operator">=</span> <span className="signal">GPixel_GetG</span>(<span className="signal">src</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">sb</span> <span className="operator">=</span> <span className="signal">GPixel_GetB</span>(<span className="signal">src</span>);<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">da</span> <span className="operator">=</span> <span className="signal">GPixel_GetA</span>(<span className="signal">dest</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">dr</span> <span className="operator">=</span> <span className="signal">GPixel_GetR</span>(<span className="signal">dest</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">dg</span> <span className="operator">=</span> <span className="signal">GPixel_GetG</span>(<span className="signal">dest</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">db</span> <span className="operator">=</span> <span className="signal">GPixel_GetB</span>(<span className="signal">dest</span>);<br/>
<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">ba</span> <span className="operator">=</span> <span className="signal">sa</span> <span className="operator">+</span> <span className="signal">div255</span>((<span className="number">255</span><span className="operator">-</span><span className="signal">sa</span>)<span className="operator">*</span><span className="signal">da</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">br</span> <span className="operator">=</span> <span className="signal">sr</span> <span className="operator">+</span> <span className="signal">div255</span>((<span className="number">255</span><span className="operator">-</span><span className="signal">sa</span>)<span className="operator">*</span><span className="signal">dr</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">bg</span> <span className="operator">=</span> <span className="signal">sg</span> <span className="operator">+</span> <span className="signal">div255</span>((<span className="number">255</span><span className="operator">-</span><span className="signal">sa</span>)<span className="operator">*</span><span className="signal">dg</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">bb</span> <span className="operator">=</span> <span className="signal">sb</span> <span className="operator">+</span> <span className="signal">div255</span>((<span className="number">255</span><span className="operator">-</span><span className="signal">sa</span>)<span className="operator">*</span><span className="signal">db</span>);<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">GPixel_PackARGB</span>(<span className="signal">ba</span>, <span className="signal">br</span>, <span className="signal">bg</span>, <span className="signal">bb</span>);<br/>
&#125;
            </pre>

            <p>
              The <code>div255()</code> helper function performs fast fixed-point division by 255, essential for performance since blending happens per-pixel. The alpha math <code>sa + div255((255-sa)*da)</code> produces the final alpha: fully opaque where source is opaque, blending source and destination alpha elsewhere.
            </p>

            <h4>Other Porter-Duff Modes</h4>
            <p>
              The engine supports all 12 standard Porter-Duff operators. Here are two more examples:
            </p>

            <pre className="code-block">
<span className="comment">// D + (1 - Da)*S</span><br/>
<span className="signal">GPixel</span> <span className="signal">dst_over_mode</span>(<span className="signal">GPixel</span> <span className="signal">src</span>, <span className="signal">GPixel</span> <span className="signal">dest</span>)&#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">sa</span> <span className="operator">=</span> <span className="signal">GPixel_GetA</span>(<span className="signal">src</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">sr</span> <span className="operator">=</span> <span className="signal">GPixel_GetR</span>(<span className="signal">src</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">sg</span> <span className="operator">=</span> <span className="signal">GPixel_GetG</span>(<span className="signal">src</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">sb</span> <span className="operator">=</span> <span className="signal">GPixel_GetB</span>(<span className="signal">src</span>);<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">da</span> <span className="operator">=</span> <span className="signal">GPixel_GetA</span>(<span className="signal">dest</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">dr</span> <span className="operator">=</span> <span className="signal">GPixel_GetR</span>(<span className="signal">dest</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">dg</span> <span className="operator">=</span> <span className="signal">GPixel_GetG</span>(<span className="signal">dest</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">db</span> <span className="operator">=</span> <span className="signal">GPixel_GetB</span>(<span className="signal">dest</span>);<br/>
<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">ba</span> <span className="operator">=</span> <span className="signal">da</span> <span className="operator">+</span> <span className="signal">div255</span>((<span className="number">255</span><span className="operator">-</span><span className="signal">da</span>)<span className="operator">*</span><span className="signal">sa</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">br</span> <span className="operator">=</span> <span className="signal">dr</span> <span className="operator">+</span> <span className="signal">div255</span>((<span className="number">255</span><span className="operator">-</span><span className="signal">da</span>)<span className="operator">*</span><span className="signal">sr</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">bg</span> <span className="operator">=</span> <span className="signal">dg</span> <span className="operator">+</span> <span className="signal">div255</span>((<span className="number">255</span><span className="operator">-</span><span className="signal">da</span>)<span className="operator">*</span><span className="signal">sg</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">bb</span> <span className="operator">=</span> <span className="signal">db</span> <span className="operator">+</span> <span className="signal">div255</span>((<span className="number">255</span><span className="operator">-</span><span className="signal">da</span>)<span className="operator">*</span><span className="signal">sb</span>);<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">GPixel_PackARGB</span>(<span className="signal">ba</span>, <span className="signal">br</span>, <span className="signal">bg</span>, <span className="signal">bb</span>);<br/>
&#125;<br/>
<br/>
<span className="comment">// (1 - Sa)*D + (1 - Da)*S</span><br/>
<span className="signal">GPixel</span> <span className="signal">xor_mode</span>(<span className="signal">GPixel</span> <span className="signal">src</span>, <span className="signal">GPixel</span> <span className="signal">dest</span>)&#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">sa</span> <span className="operator">=</span> <span className="signal">GPixel_GetA</span>(<span className="signal">src</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">sr</span> <span className="operator">=</span> <span className="signal">GPixel_GetR</span>(<span className="signal">src</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">sg</span> <span className="operator">=</span> <span className="signal">GPixel_GetG</span>(<span className="signal">src</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">sb</span> <span className="operator">=</span> <span className="signal">GPixel_GetB</span>(<span className="signal">src</span>);<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">da</span> <span className="operator">=</span> <span className="signal">GPixel_GetA</span>(<span className="signal">dest</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">dr</span> <span className="operator">=</span> <span className="signal">GPixel_GetR</span>(<span className="signal">dest</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">dg</span> <span className="operator">=</span> <span className="signal">GPixel_GetG</span>(<span className="signal">dest</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">db</span> <span className="operator">=</span> <span className="signal">GPixel_GetB</span>(<span className="signal">dest</span>);<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">ba</span> <span className="operator">=</span> <span className="signal">div255</span>((<span className="number">255</span><span className="operator">-</span><span className="signal">sa</span>)<span className="operator">*</span><span className="signal">da</span>) <span className="operator">+</span> <span className="signal">div255</span>((<span className="number">255</span><span className="operator">-</span><span className="signal">da</span>)<span className="operator">*</span><span className="signal">sa</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">br</span> <span className="operator">=</span> <span className="signal">div255</span>((<span className="number">255</span><span className="operator">-</span><span className="signal">sa</span>)<span className="operator">*</span><span className="signal">dr</span>) <span className="operator">+</span> <span className="signal">div255</span>((<span className="number">255</span><span className="operator">-</span><span className="signal">da</span>)<span className="operator">*</span><span className="signal">sr</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">bg</span> <span className="operator">=</span> <span className="signal">div255</span>((<span className="number">255</span><span className="operator">-</span><span className="signal">sa</span>)<span className="operator">*</span><span className="signal">dg</span>) <span className="operator">+</span> <span className="signal">div255</span>((<span className="number">255</span><span className="operator">-</span><span className="signal">da</span>)<span className="operator">*</span><span className="signal">sg</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">bb</span> <span className="operator">=</span> <span className="signal">div255</span>((<span className="number">255</span><span className="operator">-</span><span className="signal">sa</span>)<span className="operator">*</span><span className="signal">db</span>) <span className="operator">+</span> <span className="signal">div255</span>((<span className="number">255</span><span className="operator">-</span><span className="signal">da</span>)<span className="operator">*</span><span className="signal">sb</span>);<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">GPixel_PackARGB</span>(<span className="signal">ba</span>, <span className="signal">br</span>, <span className="signal">bg</span>, <span className="signal">bb</span>);<br/>
&#125;
            </pre>

            <h4>Complete Blend Mode List</h4>
            <p>The engine implements these 12 Porter-Duff operators:</p>
            <ul>
              <li><strong>clear</strong>: Result is transparent (0)</li>
              <li><strong>src</strong>: Source replaces destination (S)</li>
              <li><strong>dst</strong>: Destination unchanged (D)</li>
              <li><strong>src_over</strong>: Source over destination (S + (1-Sa)*D)</li>
              <li><strong>dst_over</strong>: Destination over source (D + (1-Da)*S)</li>
              <li><strong>src_in</strong>: Source inside destination (Da*S)</li>
              <li><strong>dst_in</strong>: Destination inside source (Sa*D)</li>
              <li><strong>src_out</strong>: Source outside destination ((1-Da)*S)</li>
              <li><strong>dst_out</strong>: Destination outside source ((1-Sa)*D)</li>
              <li><strong>src_atop</strong>: Source atop destination (Da*S + (1-Sa)*D)</li>
              <li><strong>dst_atop</strong>: Destination atop source (Sa*D + (1-Da)*S)</li>
              <li><strong>xor</strong>: Exclusive or ((1-Sa)*D + (1-Da)*S)</li>
            </ul>
          </div>

          {/* Tab 4: Polygon Clipping */}
          <div id="clip" className={`tab-panel ${activeTab === 'clip' ? 'active' : ''}`}>
            <h3>Viewport Clipping</h3>
            <p>
              Clipping ensures that shapes extending outside the viewport boundaries are properly trimmed before rasterization. Without clipping, edge calculations could produce invalid memory accesses or visual artifacts. The engine clips each edge of a polygon against the viewport's four boundaries: top, bottom, left, and right.
            </p>
            <p>
              The <code>Edge::clip()</code> function takes two points defining an edge and clips them against the bitmap dimensions. It handles all cases: edges completely inside, completely outside, and partially clipped. When an edge crosses a boundary, the function calculates the intersection point and creates clipped edges that stay within bounds.
            </p>

            <h4>Vertical Clipping</h4>
            <p>
              First, the function clips against top and bottom boundaries. If an edge is completely above or below the viewport, it's discarded. If it crosses a boundary, the function calculates the X coordinate where the edge intersects the boundary and creates a new point at that intersection.
            </p>

            <pre className="code-block">
<span className="keyword">static</span> <span className="keyword">void</span> <span className="signal">clip</span>(<span className="signal">GPoint</span> <span className="signal">p0</span>, <span className="signal">GPoint</span> <span className="signal">p1</span>, <span className="signal">GBitmap</span> <span className="signal">fDevice</span>, <span className="signal">std</span>::<span className="signal">vector</span><span className="operator">&lt;</span><span className="signal">Edge</span><span className="operator">&gt;</span> <span className="operator">&amp;</span><span className="signal">edges</span>)&#123;<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">w</span> <span className="operator">=</span> <span className="signal">p0</span>.<span className="signal">y</span> <span className="operator">&gt;</span> <span className="signal">p1</span>.<span className="signal">y</span>;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">dir</span> <span className="operator">=</span> <span className="number">2</span><span className="operator">*</span><span className="signal">w</span> <span className="operator">-</span> <span className="number">1</span>;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">p0</span>.<span className="signal">y</span> <span className="operator">&gt;</span> <span className="signal">p1</span>.<span className="signal">y</span>) &#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">std</span>::<span className="signal">swap</span>(<span className="signal">p0</span>, <span className="signal">p1</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">new_p0</span> <span className="operator">=</span> <span className="signal">p0</span>;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">new_p1</span> <span className="operator">=</span> <span className="signal">p1</span>;<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Line segment is completely out of bounds</span><br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">p1</span>.<span className="signal">y</span> <span className="operator">&lt;</span> <span className="number">0</span> <span className="operator">||</span> <span className="signal">p0</span>.<span className="signal">y</span> <span className="operator">&gt;=</span> <span className="signal">fDevice</span>.<span className="signal">height</span>()) &#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span>;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Line segment top point is out of bounds</span><br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">p0</span>.<span className="signal">y</span> <span className="operator">&lt;</span> <span className="number">0</span>)&#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">new_p0</span> <span className="operator">=</span> &#123;<span className="signal">getTopX</span>(<span className="signal">p0</span>, <span className="signal">p1</span>), <span className="number">0</span>&#125;;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Line segment bottom point is out of bounds</span><br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">p1</span>.<span className="signal">y</span> <span className="operator">&gt;</span> <span className="signal">fDevice</span>.<span className="signal">height</span>())&#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">new_p1</span> <span className="operator">=</span> &#123;<span className="signal">getBottomX</span>(<span className="signal">p0</span>, <span className="signal">p1</span>, <span className="signal">fDevice</span>), <span className="keyword">float</span>(<span className="signal">fDevice</span>.<span className="signal">height</span>())&#125;;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Reassign p0 and p1 with new x values</span><br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">p0</span> <span className="operator">=</span> <span className="signal">new_p0</span>;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">p1</span> <span className="operator">=</span> <span className="signal">new_p1</span>;<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// ... horizontal clipping continues ...</span><br/>
&#125;
            </pre>

            <h4>Horizontal Clipping Cases</h4>
            <p>
              After vertical clipping, the function handles horizontal clipping. There are several cases: edge completely inside (add as-is), completely left (create vertical edge at x=0), completely right (create vertical edge at x=width), partially left, partially right, or spanning entirely across (create multiple edge segments).
            </p>

            <pre className="code-block">
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">left</span> <span className="operator">=</span> <span className="number">0</span>;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">right</span> <span className="operator">=</span> <span className="signal">fDevice</span>.<span className="signal">width</span>();<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">p0</span>.<span className="signal">x</span> <span className="operator">&gt;</span> <span className="signal">p1</span>.<span className="signal">x</span>) &#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">std</span>::<span className="signal">swap</span>(<span className="signal">p0</span>, <span className="signal">p1</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// IF edge is completely horizontally contained</span><br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span>(<span className="signal">p0</span>.<span className="signal">x</span> <span className="operator">&gt;=</span> <span className="signal">left</span> <span className="operator">&amp;&amp;</span> <span className="signal">p1</span>.<span className="signal">x</span> <span className="operator">&lt;</span> <span className="signal">right</span>)&#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">Edge</span> <span className="signal">inEdge</span> <span className="operator">=</span> <span className="signal">Edge</span>(<span className="signal">p0</span>, <span className="signal">p1</span>, <span className="signal">fDevice</span>, <span className="signal">dir</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span>(<span className="signal">inEdge</span>.<span className="signal">top</span> <span className="operator">&lt;</span> <span className="signal">inEdge</span>.<span className="signal">bottom</span>)&#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">edges</span>.<span className="signal">push_back</span>(<span className="signal">inEdge</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span>;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Line segment completely to the left</span><br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">p1</span>.<span className="signal">x</span> <span className="operator">&lt;</span> <span className="signal">left</span>) &#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">pp0</span> <span className="operator">=</span> &#123;<span className="number">0</span>, <span className="signal">p0</span>.<span className="signal">y</span>&#125;;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">pp1</span> <span className="operator">=</span> &#123;<span className="number">0</span>, <span className="signal">p1</span>.<span className="signal">y</span>&#125;;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">Edge</span> <span className="signal">leftEdge</span> <span className="operator">=</span> <span className="signal">Edge</span>(<span className="signal">pp0</span>, <span className="signal">pp1</span>, <span className="signal">fDevice</span>, <span className="signal">dir</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span>(<span className="signal">leftEdge</span>.<span className="signal">top</span> <span className="operator">&lt;</span> <span className="signal">leftEdge</span>.<span className="signal">bottom</span>)&#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">edges</span>.<span className="signal">push_back</span>(<span className="signal">leftEdge</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span>;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Line segment completely to the right</span><br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">p0</span>.<span className="signal">x</span> <span className="operator">&gt;=</span> <span className="signal">right</span> ) &#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">pp0</span> <span className="operator">=</span> &#123;<span className="signal">fDevice</span>.<span className="signal">width</span>(), <span className="signal">p0</span>.<span className="signal">y</span>&#125;;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GPoint</span> <span className="signal">pp1</span> <span className="operator">=</span> &#123;<span className="signal">fDevice</span>.<span className="signal">width</span>(), <span className="signal">p1</span>.<span className="signal">y</span>&#125;;<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">Edge</span> <span className="signal">rightEdge</span> <span className="operator">=</span> <span className="signal">Edge</span>(<span className="signal">pp0</span>, <span className="signal">pp1</span>, <span className="signal">fDevice</span>, <span className="signal">dir</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span>(<span className="signal">rightEdge</span>.<span className="signal">top</span> <span className="operator">&lt;</span> <span className="signal">rightEdge</span>.<span className="signal">bottom</span>)&#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">edges</span>.<span className="signal">push_back</span>(<span className="signal">rightEdge</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span>;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// ... additional cases for partially clipped edges ...</span><br/>
&#125;
            </pre>

            <h4>Clipping Benefits</h4>
            <p>
              Clipping provides several benefits beyond correctness:
            </p>
            <ul>
              <li><strong>Memory safety</strong>: Prevents writing outside the bitmap buffer</li>
              <li><strong>Performance</strong>: Avoids rasterizing invisible pixels</li>
              <li><strong>Correctness</strong>: Handles edge cases at boundaries properly</li>
              <li><strong>Convexity preservation</strong>: Clipping a convex polygon against a convex viewport produces a convex result</li>
            </ul>
            <p>
              The convex polygon guarantee is crucial: because the input is convex and the clipping region is convex (a rectangle), the output is guaranteed to be convex. This means the simple scanline algorithm continues to work correctly on clipped geometry.
            </p>
          </div>
        </div>
      </section>
    </DocsLayout>
  )
}

export default GraphicsCoreRenderingPage
