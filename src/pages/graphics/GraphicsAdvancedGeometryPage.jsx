import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../../components/shared/Breadcrumbs'

function GraphicsAdvancedGeometryPage() {
  const [activeTab, setActiveTab] = useState('bezier')

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Graphics Engine', href: '/projects/graphics-engine/wasm' },
    { label: 'Documentation', href: '/projects/graphics-engine/docs' },
    { label: 'Advanced Geometry' }
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

        .section ol {
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

        .code-block .type {
            color: #4ec9b0;
        }

        .code-block .function {
            color: #dcdcaa;
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

        .demo-instruction {
            background: #f0f8f4;
            border-left: 4px solid #2E7D32;
            padding: 1rem 1.5rem;
            margin: 1.5rem 0;
            border-radius: 4px;
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
        <h1>Advanced Geometry</h1>
        <p>Bezier Curves, Triangle Meshes, and Shader Composition</p>
      </header>

      <div className="container">
        {/* Introduction Section */}
        <section className="section">
          <h2>Introduction</h2>
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
        </section>

        {/* Tabs Container */}
        <div className="tabs-container">
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
            <div className={`tab-panel ${activeTab === 'bezier' ? 'active' : ''}`}>
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
              <pre className="code-block">{`// Quadratic Bezier tessellation
case GPath::kQuad: {
    GPoint A = tempPoints[0];
    GPoint B = tempPoints[1];
    GPoint C = tempPoints[2];

    // Calculate deviation vector E
    GPoint E = (A - 2*B + C)*.25f;
    float mag_E = sqrt(E.x*E.x + E.y*E.y);

    // Adaptive segment count
    int num_segs = (int)ceil(sqrt(mag_E*4));

    storage[num_segs + 1];
    float dt = 1.0f/num_segs;
    float t = 0;
    storage[0] = A;

    // Evaluate curve at t values
    for(int i = 1; i < num_segs; i++){
        t += dt;
        storage[i] = ((1-t)*(1-t)*A + 2*t*(1-t)*B + t*t*C);
    }
    storage[num_segs] = C;

    // Convert to edges
    for(int i = 0; i < num_segs; i++){
        Edge::clip(storage[i], storage[i+1], fDevice, edges);
    }
    break;
}

// Cubic Bezier tessellation
case GPath::kCubic: {
    GPoint A = tempPoints[0];
    GPoint B = tempPoints[1];
    GPoint C = tempPoints[2];
    GPoint D = tempPoints[3];

    // Calculate two deviation vectors
    GPoint E0 = A - 2*B + C;
    GPoint E1 = B - 2*C + D;
    GPoint E;
    E.x = max(abs(E0.x), abs(E1.x));
    E.y = max(abs(E0.y), abs(E1.y));

    float mag_E = sqrt(E.x*E.x + E.y*E.y);

    // Adaptive segment count (higher factor for cubic)
    int num_segs = (int)ceil(sqrt((3*mag_E)*16));

    storage[num_segs + 1];
    float dt = 1.0f/num_segs;
    float t = 0;
    storage[0] = A;

    // Evaluate cubic Bezier equation
    for(int i = 1; i < num_segs; i++){
        t += dt;
        storage[i] = ((1-t)*(1-t)*(1-t) * A +
                      3 * (1-t)*(1-t) * t * B +
                      3 * (1-t) * t*t * C +
                      t*t*t * D);
    }
    storage[num_segs] = D;

    // Convert to edges
    for(int i = 0; i < num_segs; i++){
        Edge::clip(storage[i], storage[i+1], fDevice, edges);
    }
    break;
}`}</pre>
            </div>

            {/* Tab Panel 2: Triangle Meshes */}
            <div className={`tab-panel ${activeTab === 'mesh' ? 'active' : ''}`}>
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
              <pre className="code-block">{`// drawMesh: Texture-only mode
if(colors == nullptr && texs != nullptr){
    int n = 0;
    for(int i = 0; i < count; i++){
        // Extract triangle vertices
        GPoint p0 = verts[indices[n+0]];
        GPoint p1 = verts[indices[n+1]];
        GPoint p2 = verts[indices[n+2]];

        // Extract texture coordinates
        GPoint t0 = texs[indices[n+0]];
        GPoint t1 = texs[indices[n+1]];
        GPoint t2 = texs[indices[n+2]];

        GPoint points[] = {p0, p1, p2};

        // Build texture coordinate matrix
        GMatrix T = GMatrix(
            t1.x - t0.x,    t2.x - t0.x,    t0.x,
            t1.y - t0.y,    t2.y - t0.y,    t0.y
        );

        // Build position matrix
        GMatrix P = GMatrix(
            p1.x - p0.x,    p2.x - p0.x,    p0.x,
            p1.y - p0.y,    p2.y - p0.y,    p0.y
        );

        // Get the base shader from paint
        auto real_sh = paint.getShader();

        // Invert T to map from screen to texture space
        GMatrix invT;
        if(auto inverted = T.invert()){
            invT = *inverted;
        }

        // Create proxy shader with composed transformation
        ProxyShader proxy(real_sh,(P * invT));
        GPaint p(&proxy);

        // Render the triangle
        drawConvexPolygon(points, 3, p);
        n += 3;
    }
}`}</pre>

              <h4>Interactive Demo</h4>
              <p className="demo-instruction">
                <strong>Mesh with Texture Mapping:</strong> The mesh demo shows triangles with interpolated texture
                coordinates. Drag vertices to see how the mesh deforms while maintaining texture mapping. The texture
                follows the geometry, demonstrating correct barycentric interpolation.
              </p>
            </div>

            {/* Tab Panel 3: Quad Rendering */}
            <div className={`tab-panel ${activeTab === 'quad' ? 'active' : ''}`}>
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
              <pre className="code-block">{`void MyCanvas::drawQuad(const GPoint verts[4], const GColor colors[4],
                        const GPoint texs[4], int level, const GPaint& paint)
{
    // Allocate grid storage
    GPoint** new_quads = new GPoint*[level+2];
    GColor** new_colors = new GColor*[level+2];
    GPoint** new_texs = new GPoint*[level+2];

    // Generate interpolated grid
    for(int i = 0; i < level + 2; i++){
        float u = float(i) / (1 + level);

        new_quads[i] = new GPoint[level + 2];
        new_colors[i] = new GColor[level + 2];
        new_texs[i] = new GPoint[level + 2];

        for(int j = 0; j < level + 2; j++){
            float v = float(j) / (1 + level);

            // Bilinear interpolation for position
            GPoint p = (1-u)*(1-v)* verts[0] +
                       u * (1-v) * verts[1] +
                       u * v * verts[2] +
                       (1-u) * v * verts[3];
            new_quads[i][j] = p;

            // Bilinear interpolation for color
            if(colors != nullptr){
                GColor c = (1-u)*(1-v)* colors[0] +
                           u * (1-v) * colors[1] +
                           u * v * colors[2] +
                           (1-u) * v * colors[3];
                new_colors[i][j] = c;
            }

            // Bilinear interpolation for texture coordinates
            if(texs != nullptr){
                GPoint t = (1-u)*(1-v)* texs[0] +
                           u * (1-v) * texs[1] +
                           u * v * texs[2] +
                           (1-u) * v * texs[3];
                new_texs[i][j] = t;
            }
        }
    }

    // Render grid as triangles
    for(int i = 0; i < level + 1; i++){
        for(int j = 0; j < level + 1; j++){
            // Two triangles per grid cell
            GPoint mesh_verts[6] = {
                new_quads[i][j], new_quads[i+1][j], new_quads[i][j+1],
                new_quads[i+1][j], new_quads[i+1][j+1], new_quads[i][j+1]
            };

            GColor mesh_colors[6];
            if(colors != nullptr){
                mesh_colors[0] = new_colors[i][j];
                mesh_colors[1] = new_colors[i+1][j];
                mesh_colors[2] = new_colors[i][j+1];
                mesh_colors[3] = new_colors[i+1][j];
                mesh_colors[4] = new_colors[i+1][j+1];
                mesh_colors[5] = new_colors[i][j+1];
            }

            GPoint mesh_texs[6];
            if(texs != nullptr){
                mesh_texs[0] = new_texs[i][j];
                mesh_texs[1] = new_texs[i+1][j];
                mesh_texs[2] = new_texs[i][j+1];
                mesh_texs[3] = new_texs[i+1][j];
                mesh_texs[4] = new_texs[i+1][j+1];
                mesh_texs[5] = new_texs[i][j+1];
            }

            int indices[] = {0, 1, 2, 3, 4, 5};

            // Render based on available attributes
            if(colors == nullptr){
                drawMesh(mesh_verts, nullptr, mesh_texs, 2, indices, paint);
            }
            else if(texs == nullptr){
                drawMesh(mesh_verts, mesh_colors, nullptr, 2, indices, paint);
            }
            else{
                drawMesh(mesh_verts, mesh_colors, mesh_texs, 2, indices, paint);
            }
        }
    }
}`}</pre>

              <h4>Demo Note</h4>
              <p className="demo-instruction">
                <strong>Quad rendering uses the mesh demo:</strong> The mesh demo can display quad patches subdivided
                into triangles. Higher subdivision levels produce smoother color and texture interpolation across
                non-planar surfaces.
              </p>
            </div>

            {/* Tab Panel 4: Shader Composition */}
            <div className={`tab-panel ${activeTab === 'shader' ? 'active' : ''}`}>
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
              <pre className="code-block">{`class ProxyShader : public GShader {
    GShader* fRealShader;
    GMatrix  fExtraTransform;
public:
    ProxyShader(GShader* shader, const GMatrix& extraTransform)
        : fRealShader(shader), fExtraTransform(extraTransform) {}

    bool isOpaque() override {
        return fRealShader->isOpaque();
    }

    // Chain transformations: apply extraTransform after ctm
    bool setContext(const GMatrix& ctm) override {
        return fRealShader->setContext(ctm * fExtraTransform);
    }

    // Delegate rendering to wrapped shader
    void shadeRow(int x, int y, int count, GPixel row[]) override {
        fRealShader->shadeRow(x, y, count, row);
    }
};`}</pre>

              <h4>ComposeShader Implementation</h4>
              <p><strong>File:</strong> <code>shader_ops.h</code> (lines 647-679)</p>
              <pre className="code-block">{`class ComposeShader : public GShader {
    GShader* sh1;
    GShader* sh2;
public:
    // Modulate two pixels by multiplying components
    GPixel modulate(GPixel p1, GPixel p2){
        int new_a = GRoundToInt(div255(GPixel_GetA(p1) * GPixel_GetA(p2)));
        int new_r = GRoundToInt(div255(GPixel_GetR(p1) * GPixel_GetR(p2)));
        int new_g = GRoundToInt(div255(GPixel_GetG(p1) * GPixel_GetG(p2)));
        int new_b = GRoundToInt(div255(GPixel_GetB(p1) * GPixel_GetB(p2)));

        return GPixel_PackARGB(new_a, new_r, new_g, new_b);
    }

    ComposeShader(GShader* shader1, GShader* shader2)
        : sh1(shader1), sh2(shader2) {}

    // Opaque only if both shaders are opaque
    bool isOpaque() override {
        return sh1->isOpaque() && sh2->isOpaque();
    }

    // Both shaders must set context successfully
    bool setContext(const GMatrix& ctm) override {
        return sh1->setContext(ctm) && sh2->setContext(ctm);
    }

    // Shade with both shaders and modulate results
    void shadeRow(int x, int y, int c, GPixel row[]) override {
        GPixel row1[c];
        GPixel row2[c];

        // Get colors from both shaders
        sh1->shadeRow(x, y, c, row1);
        sh2->shadeRow(x, y, c, row2);

        // Modulate each pixel
        for(int i = 0; i < c; i++){
            row[i] = modulate(row1[i], row2[i]);
        }
    }
};`}</pre>

              <h4>Usage Patterns</h4>
              <p>
                <strong>ProxyShader in mesh rendering:</strong>
              </p>
              <pre className="code-block">{`// Transform texture shader to triangle space
auto real_sh = paint.getShader();
GMatrix invT = T.invert();
ProxyShader proxy(real_sh, (P * invT));
GPaint p(&proxy);
drawConvexPolygon(points, 3, p);`}</pre>

              <p>
                <strong>ComposeShader for textured color mesh:</strong>
              </p>
              <pre className="code-block">{`// Combine color interpolation with texture
auto color_shader = GCreateTriColorShader(points, colors, count);
auto texture_shader = GCreateProxyShader(real_sh, (P * invT));
auto compose_shader = GCreateComposeShader(
    color_shader.get(),
    texture_shader.get()
);
GPaint p(compose_shader.get());
drawConvexPolygon(points, 3, p);`}</pre>

              <h4>Demo Note</h4>
              <p className="demo-instruction">
                <strong>Shader composition in action:</strong> The mesh demo uses ProxyShader for texture mapping.
                When both colors and textures are provided, it uses ComposeShader to combine interpolated vertex
                colors with the texture pattern, creating rich visual effects.
              </p>
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

export default GraphicsAdvancedGeometryPage
