import React, { useState } from 'react'
import DocsLayout from '../../components/docs/DocsLayout'
import DocsSection from '../../components/docs/DocsSection'
import EngineFigure from '../../components/docs/EngineFigure'

function GraphicsTransformsPage() {
  const [activeTab, setActiveTab] = useState('matrix')

  const tocItems = [
    { id: 'introduction', label: 'Introduction', level: 2 },
    {
      id: 'matrix',
      label: 'Matrix Fundamentals',
      level: 2,
      onClick: () => {
        setActiveTab('matrix')
        requestAnimationFrame(() => {
          document.getElementById('matrix')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      },
    },
    {
      id: 'ctm',
      label: 'CTM Stack',
      level: 2,
      onClick: () => {
        setActiveTab('ctm')
        requestAnimationFrame(() => {
          document.getElementById('ctm')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      },
    },
    {
      id: 'bitmap',
      label: 'Bitmap Shader',
      level: 2,
      onClick: () => {
        setActiveTab('bitmap')
        requestAnimationFrame(() => {
          document.getElementById('bitmap')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        })
      },
    },
  ]

  return (
    <DocsLayout
      project="graphics"
      currentSlug="transforms-textures"
      title="Transformations & Textures"
      subtitle="Matrix Transformations, CTM Stack, and Bitmap Shaders"
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
            color: var(--color-code-inline);
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
          This section introduces two fundamental concepts in computer graphics:
          <strong> matrix transformations</strong> and <strong>texture mapping</strong>. These capabilities
          allow shapes to be positioned, rotated, and scaled anywhere on the canvas, and enable textures
          (bitmap images) to be applied to shapes with various tiling behaviors.
        </p>
        <p>
          The <code>GMatrix</code> class represents 2D affine transformations using a 3×3 matrix with
          homogeneous coordinates. The Current Transform Matrix (CTM) stack allows transformations to
          be saved and restored, enabling hierarchical scene construction. The bitmap shader samples
          texels from an image and supports three tile modes for handling coordinates outside the
          texture bounds: Clamp, Repeat, and Mirror.
        </p>
      </DocsSection>

      {/* Tabs container — wrapped in <section className="section"> manually since tabs have no h2 of their own. */}
      <section className="section tabs-container">
          <div className="tabs-header">
            <button
              className={`tab-button ${activeTab === 'matrix' ? 'active' : ''}`}
              onClick={() => setActiveTab('matrix')}
            >
              Matrix Fundamentals
            </button>
            <button
              className={`tab-button ${activeTab === 'ctm' ? 'active' : ''}`}
              onClick={() => setActiveTab('ctm')}
            >
              CTM Stack
            </button>
            <button
              className={`tab-button ${activeTab === 'bitmap' ? 'active' : ''}`}
              onClick={() => setActiveTab('bitmap')}
            >
              Bitmap Shader
            </button>
          </div>

          <div className="tabs-content">
            {/* Tab 1: Matrix Fundamentals */}
            <div id="matrix" className={`tab-panel ${activeTab === 'matrix' ? 'active' : ''}`}>
              <h3>Matrix Fundamentals</h3>

              <h4>2D Affine Transformation Matrices</h4>
              <p>
                A 2D affine transformation can represent translation, rotation, scaling, and shearing
                operations using a 3×3 matrix with homogeneous coordinates. The bottom row is always
                [0, 0, 1] and is implied but not stored:
              </p>
              <pre className="code-block">
[ <span className="signal">a</span>  <span className="signal">c</span>  <span className="signal">e</span> ]     [ <span className="number">0</span> <span className="number">2</span> <span className="number">4</span> ]  <span className="comment">&lt;-- indices</span><br/>
[ <span className="signal">b</span>  <span className="signal">d</span>  <span className="signal">f</span> ]     [ <span className="number">1</span> <span className="number">3</span> <span className="number">5</span> ]<br/>
[ <span className="number">0</span>  <span className="number">0</span>  <span className="number">1</span> ]  <span className="comment">&lt;-- implied</span>
              </pre>

              <p>
                When transforming a point (x, y) by this matrix, the resulting point (x', y') is computed as:
              </p>
              <ul>
                <li><strong>x' = ax + cy + e</strong></li>
                <li><strong>y' = bx + dy + f</strong></li>
              </ul>

              <p>
                The matrix elements control different aspects of the transformation:
                <code> a</code> and <code>d</code> control scaling; <code>b</code> and <code>c</code> control rotation and shearing; <code>e</code> and <code>f</code> control translation.
              </p>

              <h4>Matrix Construction</h4>
              <p>
                The <code>GMatrix</code> class provides static factory methods to create common transformations.
                These matrices can be composed by multiplication to build complex transformations.
              </p>

              <pre className="code-block">
<span className="signal">GMatrix</span> <span className="signal">GMatrix</span>::<span className="signal">Translate</span>(<span className="keyword">float</span> <span className="signal">tx</span>, <span className="keyword">float</span> <span className="signal">ty</span>)&#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GMatrix</span> <span className="signal">translate_matrix</span> <span className="operator">=</span> <span className="signal">GMatrix</span>((<span className="keyword">float</span>)<span className="number">1</span>, (<span className="keyword">float</span>)<span className="number">0</span>, <span className="signal">tx</span>, (<span className="keyword">float</span>)<span className="number">0</span>, (<span className="keyword">float</span>)<span className="number">1</span>, <span className="signal">ty</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">translate_matrix</span>;<br/>
&#125;<br/>
<br/>
<span className="signal">GMatrix</span> <span className="signal">GMatrix</span>::<span className="signal">Scale</span>(<span className="keyword">float</span> <span className="signal">sx</span>, <span className="keyword">float</span> <span className="signal">sy</span>)&#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GMatrix</span> <span className="signal">scale_matrix</span> <span className="operator">=</span> <span className="signal">GMatrix</span>(<span className="signal">sx</span>, (<span className="keyword">float</span>)<span className="number">0</span>, (<span className="keyword">float</span>)<span className="number">0</span>, (<span className="keyword">float</span>)<span className="number">0</span>, <span className="signal">sy</span>, (<span className="keyword">float</span>)<span className="number">0</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">scale_matrix</span>;<br/>
&#125;<br/>
<br/>
<span className="signal">GMatrix</span> <span className="signal">GMatrix</span>::<span className="signal">Rotate</span>(<span className="keyword">float</span> <span className="signal">radians</span>)&#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GMatrix</span> <span className="signal">rotate_matrix</span> <span className="operator">=</span> <span className="signal">GMatrix</span>(<span className="signal">cos</span>(<span className="signal">radians</span>), <span className="operator">-</span><span className="signal">sin</span>(<span className="signal">radians</span>), <span className="number">0</span>, <span className="signal">sin</span>(<span className="signal">radians</span>), <span className="signal">cos</span>(<span className="signal">radians</span>), <span className="number">0</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">rotate_matrix</span>;<br/>
&#125;
              </pre>

              <h4>Matrix Composition</h4>
              <p>
                Transformations can be combined by multiplying matrices. The <code>Concat</code> method
                computes the product of two matrices, creating a single matrix that applies both transformations
                in sequence. Matrix multiplication is <strong>not commutative</strong>: A × B ≠ B × A.
              </p>

              <pre className="code-block">
<span className="signal">GMatrix</span> <span className="signal">GMatrix</span>::<span className="signal">Concat</span>(<span className="keyword">const</span> <span className="signal">GMatrix</span><span className="operator">&amp;</span> <span className="signal">a</span>, <span className="keyword">const</span> <span className="signal">GMatrix</span><span className="operator">&amp;</span> <span className="signal">b</span>)&#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">GMatrix</span>(<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(<span className="signal">a</span>[<span className="number">0</span>] <span className="operator">*</span> <span className="signal">b</span>[<span className="number">0</span>]) <span className="operator">+</span> (<span className="signal">a</span>[<span className="number">2</span>] <span className="operator">*</span> <span className="signal">b</span>[<span className="number">1</span>]),<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(<span className="signal">a</span>[<span className="number">0</span>] <span className="operator">*</span> <span className="signal">b</span>[<span className="number">2</span>]) <span className="operator">+</span> (<span className="signal">a</span>[<span className="number">2</span>] <span className="operator">*</span> <span className="signal">b</span>[<span className="number">3</span>]),<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(<span className="signal">a</span>[<span className="number">0</span>] <span className="operator">*</span> <span className="signal">b</span>[<span className="number">4</span>]) <span className="operator">+</span> (<span className="signal">a</span>[<span className="number">2</span>] <span className="operator">*</span> <span className="signal">b</span>[<span className="number">5</span>]) <span className="operator">+</span> <span className="signal">a</span>[<span className="number">4</span>],<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(<span className="signal">a</span>[<span className="number">1</span>] <span className="operator">*</span> <span className="signal">b</span>[<span className="number">0</span>]) <span className="operator">+</span> (<span className="signal">a</span>[<span className="number">3</span>] <span className="operator">*</span> <span className="signal">b</span>[<span className="number">1</span>]),<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(<span className="signal">a</span>[<span className="number">1</span>] <span className="operator">*</span> <span className="signal">b</span>[<span className="number">2</span>]) <span className="operator">+</span> (<span className="signal">a</span>[<span className="number">3</span>] <span className="operator">*</span> <span className="signal">b</span>[<span className="number">3</span>]),<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(<span className="signal">a</span>[<span className="number">1</span>] <span className="operator">*</span> <span className="signal">b</span>[<span className="number">4</span>]) <span className="operator">+</span> (<span className="signal">a</span>[<span className="number">3</span>] <span className="operator">*</span> <span className="signal">b</span>[<span className="number">5</span>]) <span className="operator">+</span> <span className="signal">a</span>[<span className="number">5</span>]<br/>
&nbsp;&nbsp;&nbsp;&nbsp;);<br/>
&#125;
              </pre>

              <h4>Point Transformation</h4>
              <p>
                The <code>mapPoints</code> method transforms an array of points by applying the matrix.
                Each point (x, y) is transformed using the affine transformation formula shown above.
              </p>

              <pre className="code-block">
<span className="keyword">void</span> <span className="signal">GMatrix</span>::<span className="signal">mapPoints</span>(<span className="signal">GPoint</span> <span className="signal">dst</span>[], <span className="keyword">const</span> <span className="signal">GPoint</span> <span className="signal">src</span>[], <span className="keyword">int</span> <span className="signal">count</span>) <span className="keyword">const</span> &#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GMatrix</span> <span className="signal">curr</span> <span className="operator">=</span> (<span className="operator">*</span><span className="keyword">this</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">for</span>(<span className="keyword">int</span> <span className="signal">i</span> <span className="operator">=</span> <span className="number">0</span>; <span className="signal">i</span> <span className="operator">&lt;</span> <span className="signal">count</span>; <span className="operator">++</span><span className="signal">i</span>) &#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">mapped_x</span> <span className="operator">=</span> (<span className="signal">curr</span>[<span className="number">0</span>] <span className="operator">*</span> <span className="signal">src</span>[<span className="signal">i</span>].<span className="signal">x</span>) <span className="operator">+</span> (<span className="signal">curr</span>[<span className="number">2</span>] <span className="operator">*</span> <span className="signal">src</span>[<span className="signal">i</span>].<span className="signal">y</span>) <span className="operator">+</span> <span className="signal">curr</span>[<span className="number">4</span>];<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">mapped_y</span> <span className="operator">=</span> (<span className="signal">curr</span>[<span className="number">1</span>] <span className="operator">*</span> <span className="signal">src</span>[<span className="signal">i</span>].<span className="signal">x</span>) <span className="operator">+</span> (<span className="signal">curr</span>[<span className="number">3</span>] <span className="operator">*</span> <span className="signal">src</span>[<span className="signal">i</span>].<span className="signal">y</span>) <span className="operator">+</span> <span className="signal">curr</span>[<span className="number">5</span>];<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">dst</span>[<span className="signal">i</span>].<span className="signal">x</span> <span className="operator">=</span> <span className="signal">mapped_x</span>;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">dst</span>[<span className="signal">i</span>].<span className="signal">y</span> <span className="operator">=</span> <span className="signal">mapped_y</span>;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
&#125;
              </pre>
            </div>

            {/* Tab 2: CTM Stack */}
            <div id="ctm" className={`tab-panel ${activeTab === 'ctm' ? 'active' : ''}`}>
              <h3>Current Transform Matrix (CTM) Stack</h3>
            <EngineFigure
              src="spock_clock.png"
              alt="A texture drawn seven times, rotated around a centre"
              caption="One texture, drawn repeatedly through save/rotate/restore on the CTM stack."
              demo="transforms"
            />

              <h4>The Transformation Stack Concept</h4>
              <p>
                The CTM stack enables hierarchical transformations by allowing the current transformation
                state to be saved and restored. This is essential for drawing complex scenes where different
                parts of the scene have different coordinate systems.
              </p>
              <p>
                The canvas maintains a stack of transformation matrices. Operations like <code>save()</code> push the current matrix onto the stack, and <code>restore()</code> pops it off, returning
                to the previous transformation state. The <code>concat()</code> method modifies the top
                matrix by multiplying it with a new transformation.
              </p>

              <h4>Save Operation</h4>
              <p>
                The <code>save()</code> method creates a snapshot of the current transformation state by
                pushing a copy of the top matrix onto the stack. This allows nested transformations where
                inner transformations can be undone without affecting outer ones.
              </p>

              <pre className="code-block">
<span className="keyword">void</span> <span className="signal">MyCanvas</span>::<span className="signal">save</span>() &#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GMatrix</span> <span className="signal">top</span> <span className="operator">=</span> <span className="signal">ctm</span>[<span className="signal">ctm</span>.<span className="signal">size</span>() <span className="operator">-</span> <span className="number">1</span>];<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">ctm</span>.<span className="signal">push_back</span>(<span className="signal">top</span>);<br/>
&#125;
              </pre>

              <h4>Restore Operation</h4>
              <p>
                The <code>restore()</code> method pops the top matrix off the stack, discarding any
                transformations applied since the last <code>save()</code>. This efficiently reverts
                to the previous coordinate system.
              </p>

              <pre className="code-block">
<span className="keyword">void</span> <span className="signal">MyCanvas</span>::<span className="signal">restore</span>() &#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">ctm</span>.<span className="signal">erase</span>(<span className="signal">ctm</span>.<span className="signal">end</span>() <span className="operator">-</span><span className="number">1</span>);<br/>
&#125;
              </pre>

              <h4>Concat Operation</h4>
              <p>
                The <code>concat()</code> method multiplies the current transformation matrix by a new
                matrix, effectively adding a new transformation to the existing ones. This is how transformations
                accumulate: each <code>concat()</code> builds upon the previous transformation state.
              </p>

              <pre className="code-block">
<span className="keyword">void</span> <span className="signal">MyCanvas</span>::<span className="signal">concat</span>(<span className="keyword">const</span> <span className="signal">GMatrix</span><span className="operator">&amp;</span> <span className="signal">matrix</span>) &#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GMatrix</span><span className="operator">&amp;</span> <span className="signal">top</span> <span className="operator">=</span> <span className="signal">ctm</span>.<span className="signal">back</span>();<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">top</span> <span className="operator">=</span> <span className="signal">GMatrix</span>::<span className="signal">Concat</span>(<span className="signal">top</span>, <span className="signal">matrix</span>);<br/>
&#125;
              </pre>

              <h4>Why the CTM Stack Matters</h4>
              <p>
                The CTM stack is fundamental to scene graph architectures. It allows you to:
              </p>
              <ul>
                <li><strong>Build hierarchies:</strong> Parent transformations automatically affect children</li>
                <li><strong>Isolate effects:</strong> Use save/restore to prevent transformations from leaking</li>
                <li><strong>Compose scenes:</strong> Combine local and global coordinate systems effortlessly</li>
              </ul>
              <p>
                For example, to draw a rotated shape at a specific position, you save the current state,
                translate to the position, rotate, draw the shape, then restore to return to the original
                coordinate system.
              </p>
            </div>

            {/* Tab 3: Bitmap Shader */}
            <div id="bitmap" className={`tab-panel ${activeTab === 'bitmap' ? 'active' : ''}`}>
              <h3>Bitmap Shader & Tile Modes</h3>
            <EngineFigure
              src="bitmap_tiling.png"
              alt="A texture tiled with the repeat and mirror modes, one half sheared"
              caption="The bitmap shader tiling a texture, with a sheared local matrix on one half."
              demo="texture"
            />

              <h4>Texture Mapping Concept</h4>
              <p>
                A bitmap shader enables texture mapping by sampling colors from a source image (bitmap) and
                applying them to shapes. The shader transforms canvas coordinates into texture coordinates,
                then samples the appropriate pixel (texel) from the bitmap.
              </p>
              <p>
                The shader uses the inverse of the combined CTM and local transformation matrix to map from
                canvas space to texture space. For each pixel being rendered, the shader computes where in
                the texture that pixel should sample from.
              </p>

              <h4>Coordinate Transformation</h4>
              <p>
                The <code>setContext</code> method prepares the shader for rendering by computing the inverse
                of the transformation matrix. This inverse matrix converts screen coordinates back to texture
                coordinates.
              </p>

              <pre className="code-block">
<span className="keyword">bool</span> <span className="signal">setContext</span>(<span className="keyword">const</span> <span className="signal">GMatrix</span><span className="operator">&amp;</span> <span className="signal">ctm</span>) <span className="keyword">override</span>&#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">GMatrix</span> <span className="signal">temp</span> <span className="operator">=</span> <span className="signal">ctm</span> <span className="operator">*</span> <span className="signal">fMat</span>;<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span>(<span className="keyword">auto</span> <span className="signal">inverted</span> <span className="operator">=</span> <span className="signal">temp</span>.<span className="signal">invert</span>())&#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">inv</span> <span className="operator">=</span> <span className="operator">*</span><span className="signal">inverted</span>;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> <span className="keyword">true</span>;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">inv</span> <span className="operator">=</span> <span className="signal">fMat</span>;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> <span className="keyword">false</span>;<br/>
&#125;
              </pre>

              <h4>Tile Modes</h4>
              <p>
                When texture coordinates fall outside the [0, width) × [0, height) bounds of the bitmap,
                the tile mode determines how the shader handles these coordinates:
              </p>
              <ul>
                <li><strong>Clamp:</strong> Extends the edge color indefinitely (coordinates clamped to [0, size-1])</li>
                <li><strong>Repeat:</strong> Wraps the texture by repeating it (modulo arithmetic)</li>
                <li><strong>Mirror:</strong> Reflects the texture back and forth (ping-pong pattern)</li>
              </ul>

              <h4>Clamp Tile Mode</h4>
              <p>
                Clamp mode restricts coordinates to valid texture bounds. Coordinates less than 0 become 0;
                coordinates greater than or equal to the texture dimension become dimension-1.
              </p>

              <pre className="code-block">
<span className="keyword">int</span> <span className="signal">clamp_x</span>(<span className="keyword">int</span> <span className="signal">x</span>)&#123;<br/>
&nbsp;&nbsp;<span className="keyword">if</span>(<span className="signal">x</span> <span className="operator">&lt;=</span> <span className="number">0</span>)&#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> <span className="number">0</span>;<br/>
&nbsp;&nbsp;&#125;<br/>
&nbsp;&nbsp;<span className="keyword">if</span>(<span className="signal">x</span> <span className="operator">&gt;=</span> <span className="signal">fDevice</span>.<span className="signal">width</span>())&#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">fDevice</span>.<span className="signal">width</span>() <span className="operator">-</span> <span className="number">1</span>;<br/>
&nbsp;&nbsp;&#125;<br/>
&nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">x</span>;<br/>
&#125;<br/>
<br/>
<span className="keyword">int</span> <span className="signal">clamp_y</span>(<span className="keyword">int</span> <span className="signal">y</span>)&#123;<br/>
&nbsp;&nbsp;<span className="keyword">if</span>(<span className="signal">y</span> <span className="operator">&lt;=</span> <span className="number">0</span>)&#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> <span className="number">0</span>;<br/>
&nbsp;&nbsp;&#125;<br/>
&nbsp;&nbsp;<span className="keyword">if</span>(<span className="signal">y</span> <span className="operator">&gt;=</span> <span className="signal">fDevice</span>.<span className="signal">height</span>())&#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">fDevice</span>.<span className="signal">height</span>() <span className="operator">-</span> <span className="number">1</span>;<br/>
&nbsp;&nbsp;&#125;<br/>
&nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">y</span>;<br/>
&#125;
              </pre>

              <h4>Repeat Tile Mode</h4>
              <p>
                Repeat mode wraps coordinates using modulo arithmetic. Negative coordinates are handled by
                wrapping from the opposite edge. This creates a seamless tiling pattern.
              </p>

              <pre className="code-block">
<span className="keyword">int</span> <span className="signal">repeatX</span>(<span className="keyword">const</span> <span className="signal">GBitmap</span><span className="operator">&amp;</span> <span className="signal">bm</span>, <span className="keyword">float</span> <span className="signal">x</span>) &#123;<br/>
<br/>
&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">res</span>;<br/>
&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">x</span> <span className="operator">&lt;</span> <span className="number">0.0f</span>) &#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">res</span> <span className="operator">=</span> <span className="signal">bm</span>.<span className="signal">width</span>() <span className="operator">-</span> (<span className="signal">GRoundToInt</span>(<span className="signal">abs</span>(<span className="signal">x</span>)) <span className="operator">%</span> <span className="signal">bm</span>.<span className="signal">width</span>());<br/>
&nbsp;&nbsp;&#125; <span className="keyword">else</span> &#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">res</span> <span className="operator">=</span> <span className="signal">GRoundToInt</span>(<span className="signal">x</span>) <span className="operator">%</span> <span className="signal">bm</span>.<span className="signal">width</span>();<br/>
&nbsp;&nbsp;&#125;<br/>
&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">res</span> <span className="operator">==</span> <span className="signal">bm</span>.<span className="signal">width</span>()) <span className="keyword">return</span> <span className="signal">bm</span>.<span className="signal">width</span>() <span className="operator">-</span> <span className="number">1</span>;<br/>
&nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">res</span>;<br/>
&#125;
              </pre>

              <h4>Mirror Tile Mode</h4>
              <p>
                Mirror mode reflects the texture back and forth. The coordinate is taken modulo twice the
                texture dimension. If the result exceeds the dimension, it's reflected back from the far edge.
              </p>

              <pre className="code-block">
<span className="keyword">int</span> <span className="signal">mirrorX</span>(<span className="keyword">const</span> <span className="signal">GBitmap</span><span className="operator">&amp;</span> <span className="signal">bm</span>, <span className="keyword">float</span> <span className="signal">x</span>) &#123;<br/>
&nbsp;&nbsp;<span className="signal">x</span> <span className="operator">=</span> <span className="signal">x</span> <span className="operator">&lt;</span> <span className="number">0.0f</span> <span className="operator">?</span> <span className="operator">-</span><span className="signal">x</span> : <span className="signal">x</span>;<br/>
&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">map</span> <span className="operator">=</span> <span className="signal">GRoundToInt</span>(<span className="signal">x</span>) <span className="operator">%</span> (<span className="signal">bm</span>.<span className="signal">width</span>() <span className="operator">*</span> <span className="number">2</span>);<br/>
&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">map</span> <span className="operator">&gt;=</span> <span className="signal">bm</span>.<span className="signal">width</span>()) <span className="keyword">return</span> (<span className="signal">bm</span>.<span className="signal">width</span>() <span className="operator">*</span> <span className="number">2</span>) <span className="operator">-</span> <span className="signal">map</span> <span className="operator">-</span> <span className="number">1</span>;<br/>
&nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">map</span>;<br/>
&#125;
              </pre>

              <h4>Shader Row Processing</h4>
              <p>
                The <code>shadeRow</code> method is called for each horizontal span of pixels to be filled.
                It transforms the starting canvas coordinates to texture space, then iterates across the row,
                sampling texels and applying the appropriate tile mode.
              </p>

              <pre className="code-block">
<span className="keyword">void</span> <span className="signal">shadeRow</span>(<span className="keyword">int</span> <span className="signal">x</span>, <span className="keyword">int</span> <span className="signal">y</span>, <span className="keyword">int</span> <span className="signal">count</span>, <span className="signal">GPixel</span> <span className="signal">row</span>[]) <span className="keyword">override</span>&#123;<br/>
&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">x_prime</span> <span className="operator">=</span> <span className="signal">inv</span>[<span className="number">0</span>] <span className="operator">*</span> (<span className="signal">x</span> <span className="operator">+</span> <span className="number">0.5f</span>) <span className="operator">+</span> <span className="signal">inv</span>[<span className="number">2</span>] <span className="operator">*</span> (<span className="signal">y</span> <span className="operator">+</span> <span className="number">0.5f</span>) <span className="operator">+</span> <span className="signal">inv</span>[<span className="number">4</span>]; <span className="comment">//x' = ax + cy + e</span><br/>
&nbsp;&nbsp;<span className="keyword">float</span> <span className="signal">y_prime</span> <span className="operator">=</span> <span className="signal">inv</span>[<span className="number">1</span>] <span className="operator">*</span> (<span className="signal">x</span> <span className="operator">+</span> <span className="number">0.5f</span>) <span className="operator">+</span> <span className="signal">inv</span>[<span className="number">3</span>] <span className="operator">*</span> (<span className="signal">y</span> <span className="operator">+</span> <span className="number">0.5f</span>) <span className="operator">+</span> <span className="signal">inv</span>[<span className="number">5</span>]; <span className="comment">//y' = bx + dy + f</span><br/>
<br/>
&nbsp;&nbsp;<span className="keyword">if</span>(<span className="signal">tile_mode</span> <span className="operator">==</span> <span className="signal">GTileMode</span>::<span className="signal">kRepeat</span>)&#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">for</span>(<span className="keyword">int</span> <span className="signal">i</span> <span className="operator">=</span> <span className="number">0</span>; <span className="signal">i</span> <span className="operator">&lt;</span> <span className="signal">count</span>; <span className="signal">i</span><span className="operator">++</span>)&#123;<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">xCurr</span> <span className="operator">=</span> <span className="signal">GFloorToInt</span>(<span className="signal">x_prime</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">int</span> <span className="signal">yCurr</span> <span className="operator">=</span> <span className="signal">GFloorToInt</span>(<span className="signal">y_prime</span>);<br/>
<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">xCurr</span> <span className="operator">=</span> <span className="signal">repeatX</span>(<span className="signal">fDevice</span>, <span className="signal">xCurr</span>);<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">yCurr</span> <span className="operator">=</span> <span className="signal">repeatY</span>(<span className="signal">fDevice</span>, <span className="signal">yCurr</span>);<br/>
<br/>
<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">row</span>[<span className="signal">i</span>] <span className="operator">=</span> <span className="operator">*</span>(<span className="signal">fDevice</span>.<span className="signal">getAddr</span>(<span className="signal">xCurr</span>, <span className="signal">yCurr</span>));<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">x_prime</span> <span className="operator">+=</span> <span className="signal">inv</span>[<span className="number">0</span>];<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">y_prime</span> <span className="operator">+=</span> <span className="signal">inv</span>[<span className="number">1</span>];<br/>
&nbsp;&nbsp;&nbsp;&nbsp;&#125;<br/>
&nbsp;&nbsp;&#125;
              </pre>
            </div>
          </div>
        </section>
    </DocsLayout>
  )
}

export default GraphicsTransformsPage
