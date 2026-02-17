import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../../components/shared/Breadcrumbs'

function GraphicsTransformsPage() {
  const [activeTab, setActiveTab] = useState('matrix')

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Graphics Engine', href: '/projects/graphics-engine/wasm' },
    { label: 'Documentation', href: '/projects/graphics-engine/docs' },
    { label: 'Transforms & Textures' }
  ]

  return (
    <div>
      <style>{`
        /* Landing page specific styles */
        .landing-header {
            background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
            color: white;
            padding: 4rem 2rem 3rem;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .landing-header h1 {
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }

        .landing-header p {
            font-size: 1.3rem;
            opacity: 0.95;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 3rem 2rem;
        }

        .section {
            background: white;
            padding: 3rem;
            margin-bottom: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .section h2 {
            color: #2c3e50;
            margin-bottom: 1.5rem;
            font-size: 2rem;
            border-bottom: 3px solid #2E7D32;
            padding-bottom: 0.5rem;
        }

        .section h3 {
            color: #2c3e50;
            margin-top: 2rem;
            margin-bottom: 1rem;
            font-size: 1.5rem;
        }

        .section h4 {
            color: #2c3e50;
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            font-size: 1.25rem;
        }

        .section p {
            margin-bottom: 1rem;
            line-height: 1.8;
            color: #555;
        }

        .section ul {
            margin-bottom: 1rem;
            line-height: 1.8;
            color: #555;
            padding-left: 2rem;
        }

        .section li {
            margin-bottom: 0.5rem;
        }

        .section code {
            background: #f5f5f5;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 0.9rem;
            color: #c7254e;
        }

        .code-block {
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

        .code-block .keyword {
            color: #569cd6;
        }

        .code-block .comment {

        .code-block .signal {
            color: #9cdcfe;
        }

        .code-block .operator {
            color: #d4d4d4;
        }

        .code-block .number {
            color: #b5cea8;
        }
            color: #6a9955;
        }

        .code-block .string {
            color: #ce9178;
        }

        .code-block .number {
            color: #b5cea8;
        }

        .tabs-container {
            background: white;
            padding: 2rem;
            margin-bottom: 2rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .tabs-header {
            display: flex;
            gap: 0.5rem;
            border-bottom: 2px solid #e0e0e0;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }

        .tab-button {
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

        .tab-button:hover {
            color: #2E7D32;
            background: #f5f5f5;
        }

        .tab-button.active {
            color: #2E7D32;
            border-bottom-color: #2E7D32;
            background: transparent;
        }

        .tab-panel {
            display: none;
        }

        .tab-panel.active {
            display: block;
            animation: fadeIn 0.3s;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .quick-links {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
            flex-wrap: wrap;
        }

        .quick-link {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            background: white;
            color: #2E7D32;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            transition: background 0.3s, color 0.3s;
            border: 2px solid #2E7D32;
        }

        .quick-link:hover {
            background: #2E7D32;
            color: white;
        }

        footer {
            background: #2c3e50;
            color: white;
            text-align: center;
            padding: 2rem;
            margin-top: 4rem;
        }

        footer p {
            color: rgba(255, 255, 255, 0.8);
        }

        @media (max-width: 768px) {
            .landing-header h1 {
                font-size: 2rem;
            }

            .landing-header p {
                font-size: 1.1rem;
            }

            .section {
                padding: 2rem;
            }

            .tabs-header {
                flex-direction: column;
            }

            .tab-button {
                width: 100%;
                text-align: left;
            }
        }

        @media (max-width: 480px) {
            .landing-header {
                padding: 3rem 1rem 2rem;
            }

            .container {
                padding: 2rem 1rem;
            }

            .section {
                padding: 1.5rem;
            }

            .quick-links {
                flex-direction: column;
            }

            .quick-link {
                text-align: center;
            }
        }
      `}</style>

      <Breadcrumbs items={breadcrumbItems} />

      <header className="landing-header">
        <h1>Transformations & Textures</h1>
        <p>Matrix Transformations, CTM Stack, and Bitmap Shaders</p>
      </header>

      <div className="container">
        {/* Introduction Section */}
        <section className="section">
          <h2>Introduction</h2>
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
        </section>

        {/* Tabs Container */}
        <div className="tabs-container">
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
            <div className={`tab-panel ${activeTab === 'matrix' ? 'active' : ''}`}>
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
            <div className={`tab-panel ${activeTab === 'ctm' ? 'active' : ''}`}>
              <h3>Current Transform Matrix (CTM) Stack</h3>

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
            <div className={`tab-panel ${activeTab === 'bitmap' ? 'active' : ''}`}>
              <h3>Bitmap Shader & Tile Modes</h3>

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
        </div>

        {/* Explore Further Section */}
        <section className="section">
          <h2>Explore Further</h2>
          <div className="quick-links">
            <a href="https://github.com/AaronDiefes/graphics-engine-2d" target="_blank" rel="noopener noreferrer" className="quick-link">View Source on GitHub →</a>
            <Link to="/projects/graphics-engine/docs" className="quick-link">Back to Graphics Documentation →</Link>
          </div>
        </section>
      </div>

      <footer style={{ background: '#2c3e50', color: '#ecf0f1', padding: '3rem 2rem 2rem', marginTop: '4rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '2rem' }}>
            {/* About Section */}
            <div>
              <h3 style={{ color: '#2E7D32', marginBottom: '1rem', fontSize: '1.2rem' }}>Aaron Diefes</h3>
              <p style={{ color: '#bdc3c7', lineHeight: 1.8, marginBottom: '1rem' }}>Computer Engineering student at Duke University.</p>
              <p style={{ color: '#bdc3c7', lineHeight: 1.8 }}>Building a 2D graphics engine from scratch.</p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 style={{ color: '#2E7D32', marginBottom: '1rem', fontSize: '1.2rem' }}>Navigation</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '0.75rem' }}><Link to="/" style={{ color: '#ecf0f1', textDecoration: 'none', transition: 'color 0.15s' }}>← Portfolio Home</Link></li>
                <li style={{ marginBottom: '0.75rem' }}><Link to="/projects/graphics-engine/wasm" style={{ color: '#ecf0f1', textDecoration: 'none', transition: 'color 0.15s' }}>Graphics Engine Demo</Link></li>
                <li style={{ marginBottom: '0.75rem' }}><Link to="/projects/graphics-engine/docs" style={{ color: '#ecf0f1', textDecoration: 'none', transition: 'color 0.15s' }}>Documentation</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 style={{ color: '#2E7D32', marginBottom: '1rem', fontSize: '1.2rem' }}>Resources</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '0.75rem' }}><a href="https://github.com/AaronDiefes" target="_blank" rel="noopener noreferrer" style={{ color: '#ecf0f1', textDecoration: 'none', transition: 'color 0.15s' }}>GitHub Profile</a></li>
                <li style={{ marginBottom: '0.75rem' }}><a href="https://github.com/AaronDiefes/graphics-engine-2d" target="_blank" rel="noopener noreferrer" style={{ color: '#ecf0f1', textDecoration: 'none', transition: 'color 0.15s' }}>Graphics Engine Repository</a></li>
                <li style={{ marginBottom: '0.75rem' }}><a href="https://github.com/AaronDiefes/AaronDiefes.github.io" target="_blank" rel="noopener noreferrer" style={{ color: '#ecf0f1', textDecoration: 'none', transition: 'color 0.15s' }}>Portfolio Repository</a></li>
              </ul>
            </div>

            {/* Tech Stack */}
            <div>
              <h3 style={{ color: '#2E7D32', marginBottom: '1rem', fontSize: '1.2rem' }}>Built With</h3>
              <ul style={{ listStyle: 'none', padding: 0, color: '#bdc3c7' }}>
                <li style={{ marginBottom: '0.75rem' }}>• C++ Graphics Engine</li>
                <li style={{ marginBottom: '0.75rem' }}>• Emscripten (WebAssembly)</li>
                <li style={{ marginBottom: '0.75rem' }}>• HTML5 Canvas</li>
                <li style={{ marginBottom: '0.75rem' }}>• React Visualization</li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{ borderTop: '1px solid #34495e', paddingTop: '2rem', textAlign: 'center', color: '#95a5a6' }}>
            <p>© 2026 Aaron Diefes. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default GraphicsTransformsPage
