import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../../components/shared/Breadcrumbs'

function GraphicsFinalFeaturesPage() {
  const [activeTab, setActiveTab] = useState('sweep')

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Graphics Engine', href: '/projects/graphics-engine/wasm' },
    { label: 'Documentation', href: '/projects/graphics-engine/docs' },
    { label: 'Final Features' }
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

        .code-block .function {
            color: #dcdcaa;
        }

        .code-block .type {
            color: #4ec9b0;
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
            background: #f0f8f0;
            border-left: 4px solid #2E7D32;
            padding: 1rem 1.5rem;
            margin: 1.5rem 0;
            border-radius: 4px;
            font-size: 0.95rem;
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
        <h1>Advanced Features</h1>
        <p>Sweep Gradients, Position-Controlled Gradients, and Coons Patches</p>
      </header>

      <div className="container">
        {/* Introduction Section */}
        <section className="section">
          <h2>Introduction</h2>
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
        </section>

        {/* Tabs Container */}
        <div className="tabs-container">
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

              <pre className="code-block">{`void shadeRow(int x, int y, int c, GPixel row[]) override {
    float x_prime = (inv[0] * (x + 0.5f) + inv[2] * (y + 0.5f) + inv[4]) * (count - 1);
    float y_prime = (inv[1] * (x + 0.5f) + inv[3] * (y + 0.5f) + inv[5]) * (count - 1);

    float dx = P1.x - P0.x;
    float dy = P1.y - P0.y;
    // Calculate the angle of the line segment (starting angle)
    float line_angle = std::atan2(dy, dx);

    for (int i = 0; i < c; i++) {
        // Calculate angle from center to current pixel
        float angle_to_pixel = std::atan2(y_prime - P0.y, x_prime - P0.x);

        // Normalize angle to [0, 2*pi]
        if (angle_to_pixel < 0) {
            angle_to_pixel += 2 * M_PI;
        }

        // Calculate relative angle (offset by starting angle)
        float angle = angle_to_pixel - line_angle;
        if (angle < 0) {
            angle += 2 * M_PI;
        }

        // Normalize angle to [0, 1] for color interpolation
        float t = angle / (2 * M_PI);

        // Interpolate between colors based on t
        int k = floor(t * (count - 1));
        float u = t * (count - 1) - k;
        GColor gradient_color = (1 - u) * gradient_colors[k] + u * gradient_colors[k + 1];

        row[i] = unpremult(gradient_color);

        // Update position for next pixel in row
        x_prime += inv[0];
        y_prime += inv[1];
    }
}`}</pre>

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

              <pre className="code-block">{`void shadeRow(int x, int y, int c, GPixel row[]) override {
    float x_prime = (inv[0] * (x + 0.5f) + inv[2] * (y + 0.5f) + inv[4]) * (count - 1);
    float currX = x_prime;
    float prop;
    int k;
    GColor mix;

    for (int i = 0; i < c; i++) {
        currX = x_prime;
        // Clamp to valid gradient range
        if (currX < 0) currX = 0;
        if (currX > count - 1) currX = count - 1;

        // Calculate proportional position along gradient
        prop = currX / (count - 1);
        k = 0;

        // Find which color stops bracket this position
        while (true) {
            if (prop > positions[k]) {
                k++;
            } else {
                break;
            }
        }
        assert(prop <= positions[k]);

        float fullDiff;
        float propDiff;

        if (k == 0) {
            // Before first position, use first color
            mix = gradient_colors[k];
        } else if (k < count) {
            // Between two positions, interpolate
            fullDiff = positions[k] - positions[k - 1];
            propDiff = prop - positions[k - 1];

            float propC1 = propDiff / fullDiff;
            assert(propC1 >= 0.0f && propC1 <= 1.0f);

            mix = gradient_colors[k] * propC1 + gradient_colors[k - 1] * (1.0f - propC1);
        } else {
            // Past last position, use last color
            mix = gradient_colors[k - 1];
        }

        row[i] = unpremult(mix);
        x_prime += inv[0] * (count - 1);
    }
}`}</pre>

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

              <pre className="code-block">{`// Evaluate quadratic Bezier curve at parameter t
GPoint get_quad_bezier(const GPoint* curr_points, float t) {
    GPoint tangent;
    tangent.x = curr_points[0].x * pow(1-t, 2) +
                2 * curr_points[1].x * t * (1-t) +
                curr_points[2].x * t * t;
    tangent.y = curr_points[0].y * pow(1-t, 2) +
                2 * curr_points[1].y * t * (1-t) +
                curr_points[2].y * t * t;
    return tangent;
}

// Bilinear interpolation of four corner points
GPoint pt_weighted_avg(float u, float v, GPoint p1, GPoint p2, GPoint p3, GPoint p4) {
    GPoint p = (1-u)*(1-v)* p1 + u * (1-v) * p2 + u * v * p3 + (1-u) * v * p4;
    return p;
}`}</pre>

              <h4>Coons Patch Evaluation</h4>
              <p>
                The main evaluation function implements the Coons formula:
              </p>

              <pre className="code-block">{`GPoint pt_coons_avg(float u, float v, const GPoint pts[8]) {
    // Handle corners directly (optimization)
    if (u == 0.0f && v == 0.0f) return pts[0];
    if (u == 1.0f && v == 0.0f) return pts[2];
    if (u == 1.0f && v == 1.0f) return pts[4];
    if (u == 0.0f && v == 1.0f) return pts[6];

    // Define the four boundary curves
    GPoint top[3] = {pts[0], pts[1], pts[2]};
    GPoint right[3] = {pts[2], pts[3], pts[4]};
    GPoint bottom[3] = {pts[6], pts[5], pts[4]};
    GPoint left[3] = {pts[0], pts[7], pts[6]};

    // Handle edge cases (on boundary curves)
    if (u == 0.0f) return get_quad_bezier(left, v);
    if (u == 1.0f) return get_quad_bezier(right, v);
    if (v == 0.0f) return get_quad_bezier(top, u);
    if (v == 1.0f) return get_quad_bezier(bottom, u);

    // TB: Top-bottom interpolation
    GPoint a = get_quad_bezier(top, u);
    GPoint b = get_quad_bezier(bottom, u);
    GPoint ab = {a.x + ((b.x - a.x) * v), a.y + ((b.y - a.y) * v)};

    // LR: Left-right interpolation
    GPoint c = get_quad_bezier(left, v);
    GPoint d = get_quad_bezier(right, v);
    GPoint cd = {c.x + ((d.x - c.x) * u), c.y + ((d.y - c.y) * u)};

    // Corners: Bilinear interpolation of corners
    GPoint mid = pt_weighted_avg(u, v, pts[0], pts[2], pts[4], pts[6]);

    // Coons formula: TB + LR - Corners
    return (ab + cd) - mid;
}`}</pre>

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

export default GraphicsFinalFeaturesPage
