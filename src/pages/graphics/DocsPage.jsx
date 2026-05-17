import React from 'react'
import { Link } from 'react-router-dom'
import { DOCS_NAV } from '../../lib/docs-nav'

function DocsPage() {
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

        .landing-nav {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            margin-top: 1.5rem;
        }

        .landing-nav a {
            color: white;
            text-decoration: none;
            padding: 0.5rem 1rem;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            backdrop-filter: blur(10px);
            transition: background 0.3s;
        }

        .landing-nav a:hover {
            background: rgba(255, 255, 255, 0.3);
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

        .section p {
            margin-bottom: 1rem;
            line-height: 1.8;
            color: #555;
        }

        .pipeline-diagram {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 2rem 0;
            padding: 2rem;
            background: #f8f9fa;
            border-radius: 8px;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .pipeline-step {
            flex: 1;
            min-width: 100px;
            text-align: center;
            padding: 1rem;
            background: white;
            border-radius: 8px;
            border: 2px solid #2E7D32;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .pipeline-step h4 {
            color: #2E7D32;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }

        .pipeline-arrow {
            font-size: 1.5rem;
            color: #2E7D32;
            font-weight: bold;
        }

        .code-snippet {
            margin: 1.5rem 0;
        }

        /* Gallery Grid */
        .gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }

        .gallery-item {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .gallery-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }

        .gallery-item img {
            width: 100%;
            height: 280px;
            object-fit: contain;
            display: block;
            background: #f8f9fa;
        }

        .gallery-item .caption {
            padding: 1rem;
            font-size: 0.9rem;
            color: #555;
            text-align: center;
        }

        .doc-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }

        .doc-card {
            background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
            color: white;
            padding: 2rem;
            border-radius: 12px;
            transition: transform 0.3s, box-shadow 0.3s;
            cursor: pointer;
            text-decoration: none;
            display: block;
        }

        .doc-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(46, 125, 50, 0.3);
        }

        .doc-card h3 {
            font-size: 1.5rem;
            margin: 0 0 1rem 0;
            color: white;
        }

        .doc-card .pa-label {
            display: none;
        }

        .doc-card p {
            margin: 0;
            opacity: 0.95;
            color: white;
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

            .pipeline-diagram {
                flex-direction: column;
            }

            .pipeline-arrow {
                transform: rotate(90deg);
            }

            .gallery-grid {
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            }

            .doc-cards {
                grid-template-columns: 1fr;
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

      <header className="landing-header">
        <h1>Graphics Engine Documentation</h1>
        <p>C++ Implementation with WebAssembly</p>
      </header>

      <div className="container">
        {/* About the Engine */}
        <section className="section">
          <h2>About the 2D Graphics Engine</h2>

          <h3>What is this?</h3>
          <p>
            This is a <strong>2D graphics API</strong> similar to OpenGL, but focused on 2D rendering instead of 3D. Just like OpenGL provides functions for drawing triangles and applying textures in 3D space, this engine provides a complete API for 2D drawing operations.
          </p>
          <p>
            It's a software renderer built from scratch in C++, implementing functionality found in production libraries like <strong>Skia</strong> (used by Chrome and Android), <strong>Cairo</strong> (used by GTK and Firefox), and the <strong>HTML5 Canvas API</strong>. You give it high-level drawing commands—"draw a rectangle," "fill a path with a gradient," "apply a matrix transformation"—and it produces the actual pixel colors on screen.
          </p>
          <p>
            <strong>Key Features:</strong>
          </p>
          <ul style={{ lineHeight: 1.8, color: '#555' }}>
            <li><strong>Shape Drawing:</strong> Rectangles, polygons, paths with curves</li>
            <li><strong>Transformations:</strong> 2D affine matrices (translate, rotate, scale) with CTM stack</li>
            <li><strong>Shaders:</strong> Solid colors, linear/radial/sweep gradients, bitmap textures with tile modes</li>
            <li><strong>Compositing:</strong> Porter-Duff blend modes (12 modes including src-over, xor, multiply)</li>
            <li><strong>Path Rendering:</strong> Winding fill rule, Bezier curve tessellation</li>
            <li><strong>Advanced Geometry:</strong> Triangle meshes, Coons patches, shader composition</li>
          </ul>

          <h3>Technologies Used</h3>
          <ul style={{ lineHeight: 1.8, color: '#555' }}>
            <li><strong>C++17:</strong> Core rendering engine implementation with hand-optimized rasterization algorithms</li>
            <li><strong>WebAssembly:</strong> Compiles C++ to bytecode that runs at near-native speed in the browser</li>
            <li><strong>Emscripten:</strong> Toolchain for compiling C++ to WebAssembly and generating JavaScript bindings</li>
            <li><strong>HTML5 Canvas API:</strong> Display target for the rendered pixel buffer (ARGB → RGBA at 60fps)</li>
          </ul>

          <h3>The Rendering Pipeline</h3>
          <p>
            Every draw call flows through this pipeline, transforming high-level commands into pixel colors:
          </p>

          <div className="pipeline-diagram">
            <div className="pipeline-step">
              <h4>Draw Call</h4>
              <p>High-level command</p>
            </div>
            <div className="pipeline-arrow">→</div>
            <div className="pipeline-step">
              <h4>Transform</h4>
              <p>Apply CTM matrix</p>
            </div>
            <div className="pipeline-arrow">→</div>
            <div className="pipeline-step">
              <h4>Clip</h4>
              <p>Constrain to viewport</p>
            </div>
            <div className="pipeline-arrow">→</div>
            <div className="pipeline-step">
              <h4>Rasterize</h4>
              <p>Edges to pixels</p>
            </div>
            <div className="pipeline-arrow">→</div>
            <div className="pipeline-step">
              <h4>Shade</h4>
              <p>Compute color</p>
            </div>
            <div className="pipeline-arrow">→</div>
            <div className="pipeline-step">
              <h4>Blend</h4>
              <p>Composite layers</p>
            </div>
            <div className="pipeline-arrow">→</div>
            <div className="pipeline-step">
              <h4>Pixels</h4>
              <p>Final framebuffer</p>
            </div>
          </div>
        </section>

        {/* Example Gallery */}
        <section className="section">
          <h2>Example Renders</h2>
          <p>
            Here are some example outputs from the graphics engine, showcasing various rendering capabilities including blend modes, gradients, paths, meshes, and bitmap textures.
          </p>

          <div className="gallery-grid">
            <div className="gallery-item">
              <img src="/docs/assets/images/gradient_blendmodes.png" alt="Gradient blend modes" />
              <div className="caption">Porter-Duff Blend Modes</div>
            </div>
            <div className="gallery-item">
              <img src="/docs/assets/images/color_clock.png" alt="Color clock gradient" />
              <div className="caption">Radial Gradient with Color Stops</div>
            </div>
            <div className="gallery-item">
              <img src="/docs/assets/images/cubic_fan.png" alt="Cubic bezier fan" />
              <div className="caption">Cubic Bezier Curve Tessellation</div>
            </div>
            <div className="gallery-item">
              <img src="/docs/assets/images/both_mesh.png" alt="Triangle mesh rendering" />
              <div className="caption">Triangle Mesh with Texture Mapping</div>
            </div>
            <div className="gallery-item">
              <img src="/docs/assets/images/bitmap_tiling.png" alt="Bitmap tiling modes" />
              <div className="caption">Bitmap Shader Tile Modes</div>
            </div>
            <div className="gallery-item">
              <img src="/docs/assets/images/wheel.png" alt="Color wheel" />
              <div className="caption">Sweep Gradient Color Wheel</div>
            </div>
            <div className="gallery-item">
              <img src="/docs/assets/images/spock_quad.png" alt="Spock quad rendering" />
              <div className="caption">Quad Rendering with Bilinear Interpolation</div>
            </div>
            <div className="gallery-item">
              <img src="/docs/assets/images/stars.png" alt="Star polygons" />
              <div className="caption">Path Winding Fill Algorithm</div>
            </div>
            <div className="gallery-item">
              <img src="/docs/assets/images/rings.png" alt="Concentric rings" />
              <div className="caption">Stroke Rendering with Transformations</div>
            </div>
            <div className="gallery-item">
              <img src="/docs/assets/images/poly.png" alt="Polygon rendering" />
              <div className="caption">Convex Polygon Rasterization</div>
            </div>
            <div className="gallery-item">
              <img src="/docs/assets/images/sweep_mesh.png" alt="Sweep gradient mesh" />
              <div className="caption">Mesh with Sweep Gradient Shader</div>
            </div>
            <div className="gallery-item">
              <img src="/docs/assets/images/lion_head.png" alt="Lion head texture" />
              <div className="caption">Bitmap Texture with Mirror Tiling</div>
            </div>
          </div>
        </section>

        {/* Documentation Cards */}
        <section className="section">
          <h2>Explore the Implementation</h2>
          <p>
            Each documentation page explains the algorithms, shows the C++ implementation, and provides interactive demos for different aspects of the rendering engine.
          </p>

          <div className="doc-cards">
            {DOCS_NAV.graphics.pages.map((page) => (
              <Link key={page.slug} to={page.href} className="doc-card">
                <h3>{page.label}</h3>
                <p>{page.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Capabilities Catalog */}
        <section className="section">
          <h2>Feature Catalog</h2>
          <p>
            Comprehensive list of all rendering capabilities organized by category. Click to expand and see detailed feature descriptions with links to documentation.
          </p>

          <details style={{ marginTop: '2rem', border: '2px solid #2E7D32', borderRadius: '8px', overflow: 'hidden' }}>
            <summary style={{ background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)', color: 'white', padding: '1.5rem', fontSize: '1.25rem', fontWeight: 600, cursor: 'pointer', userSelect: 'none' }}>
              View All Engine Capabilities (26 Features)
            </summary>

            <div style={{ padding: '2rem', background: 'white' }}>
              {/* Category 1: Core Rendering */}
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ color: '#2E7D32', fontSize: '1.5rem', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '2px solid #2E7D32' }}>1. Core Rendering</h3>
                <p style={{ color: '#666', marginBottom: '1rem' }}>Fundamental drawing operations: shape rasterization, edge-list algorithm, Porter-Duff compositing.</p>
                <ul style={{ lineHeight: 2, color: '#555' }}>
                  <li><strong>Edge Rasterization</strong> – Scanline algorithm using sorted edge list for efficient pixel coverage</li>
                  <li><strong>Rectangle Drawing</strong> – Optimized axis-aligned rectangle fill with clipping</li>
                  <li><strong>Polygon Drawing</strong> – Convex polygon rasterization using edge walking</li>
                  <li><strong>Porter-Duff Blending</strong> – 12 compositing modes including src-over, xor, multiply</li>
                  <li><strong>Polygon Clipping</strong> – Sutherland-Hodgman algorithm for viewport clipping</li>
                </ul>
              </div>

              {/* Category 2: Shaders & Textures */}
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ color: '#2E7D32', fontSize: '1.5rem', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '2px solid #2E7D32' }}>2. Shaders & Textures</h3>
                <p style={{ color: '#666', marginBottom: '1rem' }}>Shader pipeline: solid colors, gradients (linear, radial, sweep), bitmap textures with tile modes.</p>
                <ul style={{ lineHeight: 2, color: '#555' }}>
                  <li><strong>Solid Color Shader</strong> – Simple constant color shader with alpha channel support</li>
                  <li><strong>Linear Gradient</strong> – Color interpolation along a line with multiple color stops</li>
                  <li><strong>Radial Gradient</strong> – Circular gradient radiating from center point</li>
                  <li><strong>Sweep Gradient</strong> – Angle-based gradient (atan2) for color wheels</li>
                  <li><strong>Bitmap Shader</strong> – Texture mapping with clamp, repeat, and mirror tile modes</li>
                  <li><strong>Shader Composition</strong> – ProxyShader and ComposeShader for chaining transformations</li>
                </ul>
              </div>

              {/* Category 3: Transformations */}
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ color: '#2E7D32', fontSize: '1.5rem', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '2px solid #2E7D32' }}>3. Transformations</h3>
                <p style={{ color: '#666', marginBottom: '1rem' }}>2D affine transformations: translate, rotate, scale, shear. Current Transformation Matrix (CTM) stack for hierarchical transforms.</p>
                <ul style={{ lineHeight: 2, color: '#555' }}>
                  <li><strong>Matrix Transform</strong> – 3x3 homogeneous coordinate matrix for 2D affine transforms</li>
                  <li><strong>CTM Stack</strong> – save() and restore() for hierarchical transformation management</li>
                  <li><strong>Translate</strong> – Move coordinate system by (dx, dy)</li>
                  <li><strong>Rotate</strong> – Rotate coordinate system by angle (radians)</li>
                  <li><strong>Scale</strong> – Scale coordinate system by (sx, sy)</li>
                </ul>
              </div>

              {/* Category 4: Paths & Curves */}
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ color: '#2E7D32', fontSize: '1.5rem', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '2px solid #2E7D32' }}>4. Paths & Curves</h3>
                <p style={{ color: '#666', marginBottom: '1rem' }}>Path construction, winding fill rule, Bezier curve tessellation for smooth curves.</p>
                <ul style={{ lineHeight: 2, color: '#555' }}>
                  <li><strong>GPath Construction</strong> – Moveto, lineto, quadto, cubicto path building</li>
                  <li><strong>Winding Fill Rule</strong> – Non-zero winding rule for complex path filling</li>
                  <li><strong>Quadratic Bezier</strong> – Smooth quadratic curves with adaptive tessellation</li>
                  <li><strong>Cubic Bezier</strong> – Complex cubic curves with adaptive subdivision</li>
                  <li><strong>Path Transformation</strong> – Apply arbitrary matrix to path vertices</li>
                </ul>
              </div>

              {/* Category 5: Advanced Geometry */}
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ color: '#2E7D32', fontSize: '1.5rem', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '2px solid #2E7D32' }}>5. Advanced Geometry</h3>
                <p style={{ color: '#666', marginBottom: '1rem' }}>Triangle meshes, quad rendering, Coons patches for complex surface modeling.</p>
                <ul style={{ lineHeight: 2, color: '#555' }}>
                  <li><strong>Triangle Mesh</strong> – Vertex array with per-vertex colors and texture coordinates</li>
                  <li><strong>Quad Rendering</strong> – 4-point texture mapping with bilinear interpolation</li>
                  <li><strong>Coons Patches</strong> – Bicubic surface interpolation from 4 boundary curves</li>
                  <li><strong>Barycentric Interpolation</strong> – Smooth color/texture blending across triangle faces</li>
                </ul>
              </div>

              {/* Category 6: Optimization & Performance */}
              <div>
                <h3 style={{ color: '#2E7D32', fontSize: '1.5rem', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '2px solid #2E7D32' }}>6. Optimization & Performance</h3>
                <p style={{ color: '#666', marginBottom: '1rem' }}>Performance optimizations for real-time software rendering.</p>
                <ul style={{ lineHeight: 2, color: '#555' }}>
                  <li><strong>Fixed-Point Division</strong> – Fast div255 approximation using shifts (10x faster)</li>
                  <li><strong>Blend Fast Paths</strong> – Alpha-based optimization (opaque/transparent shortcuts)</li>
                  <li><strong>Static Dispatch</strong> – Template-based blend dispatch (eliminates function call overhead)</li>
                  <li><strong>Scanline Rendering</strong> – Sequential memory access for 95%+ cache hit rate</li>
                </ul>
              </div>
            </div>
          </details>
        </section>

        {/* Quick Links */}
        <section className="section">
          <h2>Explore Further</h2>
          <div className="quick-links">
            <Link to="/projects/graphics-engine/demo" className="quick-link">Try Interactive Demos →</Link>
            <a href="https://github.com/AaronDiefes/AaronDiefes.github.io" target="_blank" rel="noopener noreferrer" className="quick-link">View Source on GitHub →</a>
            <Link to="/" className="quick-link">Back to Portfolio →</Link>
          </div>
        </section>
      </div>

      <footer>
        <p>&copy; {new Date().getFullYear()} Aaron Diefes. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default DocsPage
