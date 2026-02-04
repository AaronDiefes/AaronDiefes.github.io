# Phase 6: Documentation System - Research

**Researched:** 2026-02-04
**Domain:** Technical documentation, API reference generation, architecture diagrams, capability catalogs
**Confidence:** HIGH

## Summary

Phase 6 creates comprehensive documentation for the graphics engine, covering architecture overview, API reference, implementation details, and capability showcase. The standard approach for C++ API documentation is a hybrid model: hand-written architecture and algorithm explanations combined with structured API reference extracted from header file comments. Modern documentation emphasizes visual hierarchy (diagrams, code examples), accessibility (keyboard navigation, semantic HTML), and integration with existing demos (iframe embedding, deep linking).

The project already has strong Phase 5 foundations: Prism.js syntax highlighting, accessible tab navigation, forest green color scheme, and embedded demos. Phase 6 extends this to create four new documentation pages with distinct purposes: architecture.html (system overview with pipeline diagrams), api-reference.html (function signatures from headers), implementation.html (algorithm explanations with math and code), and capabilities.html (feature matrix linking to demos).

Documentation tools like Doxygen (v1.16.1, released January 2026) can auto-generate API reference from header comments, but hand-written documentation is essential for architecture diagrams, algorithm explanations, and capability showcases. Mermaid (v11.1.0+) provides version-controlled architecture diagrams as code with SVG export. MDN's Canvas API documentation serves as the gold standard for graphics API documentation structure.

**Primary recommendation:** Hand-write architecture, implementation, and capabilities pages using Phase 5's established patterns (docs.css, Prism.js, forest green theme). For API reference, extract function signatures and comments from header files manually or with lightweight parsing (grep/awk), formatting as structured HTML tables. Use Mermaid for pipeline diagrams (Canvas → Paint → Shader → Blender → Pixels) embedded as inline SVG. Create capability matrix table linking features to demos and source files.

## Standard Stack

The established libraries/tools for technical documentation with API reference:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Prism.js | 1.30.0 | Syntax highlighting | Already established in Phase 5, C++ support with line numbers and copy buttons |
| Mermaid | v11.1.0+ | Architecture diagrams | Diagrams-as-code, version control friendly, 200K+ icons from Iconify, SVG export |
| HTML/CSS | Static | Documentation structure | Zero build step, GitHub Pages compatible, already styled with docs.css |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Doxygen | 1.16.1 (2026) | C++ API doc generator | Optional - if auto-generation preferred over manual extraction |
| Prism-themes | latest | VS Code Dark+ theme | Already in use from Phase 5 |
| Mermaid Live Editor | Web | Interactive diagram editing | Design diagrams before embedding in HTML |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Hand-written API reference | Doxygen auto-generation | Doxygen requires XML parsing, build step, and generates complete site structure - overkill for 13 header files (1206 lines) |
| Mermaid diagrams | Draw.io/Figma SVG | Hand-drawn SVGs aren't version-controlled as text, harder to update |
| Static HTML | Docusaurus/Mintlify | Modern frameworks require Node.js builds, more complexity than needed for 4 pages |

**Installation (Mermaid):**
```html
<!-- Include via CDN -->
<script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
  mermaid.initialize({ startOnLoad: true, theme: 'forest' });
</script>
```

**Extraction (API Reference):**
```bash
# Extract function signatures from header files
grep -A 3 "virtual" graphics-engine/include/GCanvas.h
# Or use Doxygen for structured XML output
doxygen -g  # Generate config
doxygen Doxyfile  # Generate docs
```

## Architecture Patterns

### Recommended Project Structure
```
docs/
├── index.html              # Landing page (existing, from Phase 5)
├── architecture.html       # NEW: System overview with diagrams
├── api-reference.html      # NEW: Function signatures and usage
├── implementation.html     # NEW: Algorithm explanations
├── capabilities.html       # NEW: Feature catalog and matrix
├── core-rendering.html     # Existing Phase 5 PA1+PA2 docs
├── transforms-textures.html # Existing Phase 5 PA3+PA4 docs
├── paths-gradients.html    # Existing Phase 5 PA3 docs
├── advanced-geometry.html  # Existing Phase 5 PA5+PA6 docs
├── final-features.html     # Existing Phase 5 final project docs
└── assets/
    ├── css/
    │   ├── docs.css       # Existing from Phase 5
    │   └── code.css       # Existing from Phase 5
    ├── js/
    │   └── tabs.js        # Existing from Phase 5
    └── images/
        └── (35 reference PNGs from Phase 5)
```

### Pattern 1: Architecture Overview with Pipeline Diagrams
**What:** Visual explanation of engine data flow using Mermaid diagrams
**When to use:** Architecture overview page
**Example:**
```html
<!-- Mermaid diagram embedded inline -->
<div class="mermaid">
graph LR
    A[GCanvas] --> B[GPaint]
    B --> C[GShader]
    C --> D[Blender]
    D --> E[Pixel Buffer]
    E --> F[HTML5 Canvas]

    style A fill:#2E7D32,stroke:#1B5E20,color:#fff
    style F fill:#2E7D32,stroke:#1B5E20,color:#fff
</div>

<!-- Alternative: Flowchart for transformation stack -->
<div class="mermaid">
flowchart TD
    A[User Coordinate Space] --> B[save()/restore()]
    B --> C[concat(matrix)]
    C --> D[Device Coordinate Space]
    D --> E[Edge Clipping]
    E --> F[Scanline Rasterization]
</div>
```

**Mermaid architecture diagram syntax (v11.1.0+):**
```
architecture-beta
    group cloud(cloud)[Cloud]
    service canvas(database)[Canvas] in cloud
    service shader(server)[Shader] in cloud

    canvas:L -- R:shader
```

**Source:** [Mermaid Architecture Diagrams](https://mermaid.js.org/syntax/architecture.html), [Mermaid.js Official Docs](https://mermaid.js.org/)

### Pattern 2: API Reference Function Table
**What:** Structured table format for API documentation extracted from headers
**When to use:** API reference page
**Example:**
```html
<section class="api-section">
  <h2 id="gcanvas">GCanvas</h2>
  <p>Core canvas abstraction for all drawing operations.</p>

  <table class="api-table">
    <thead>
      <tr>
        <th>Function</th>
        <th>Parameters</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr id="gcanvas-clear">
        <td><code>void clear(const GColor&)</code></td>
        <td>
          <ul>
            <li><code>GColor</code> - Fill color (RGBA)</li>
          </ul>
        </td>
        <td>Fill the entire canvas with the specified color using kSrc porter-duff mode.</td>
      </tr>
      <tr id="gcanvas-drawrect">
        <td><code>void drawRect(const GRect&, const GPaint&)</code></td>
        <td>
          <ul>
            <li><code>GRect</code> - Rectangle bounds (left, top, right, bottom)</li>
            <li><code>GPaint</code> - Paint settings (color, shader, blend mode)</li>
          </ul>
        </td>
        <td>Fill the rectangle with paint. Pixels are filled if their centers are inside the rectangle.</td>
      </tr>
    </tbody>
  </table>

  <h3>Usage Example</h3>
  <pre class="line-numbers"><code class="language-cpp">
// Create canvas
auto canvas = GCreateCanvas(bitmap);

// Clear to white
canvas->clear(GColor::RGBA(1, 1, 1, 1));

// Draw red rectangle
GPaint paint;
paint.setColor(GColor::RGBA(1, 0, 0, 1));
canvas->drawRect(GRect::LTRB(10, 10, 100, 100), paint);
  </code></pre>
</section>
```

**CSS styling (add to docs.css):**
```css
.api-table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

.api-table th {
  background: #2E7D32;
  color: white;
  text-align: left;
  padding: 1rem;
  font-weight: 600;
}

.api-table td {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  vertical-align: top;
}

.api-table code {
  background: #f5f5f5;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 0.9rem;
}

.api-table ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}
```

**Source:** Inspired by [MDN Canvas API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

### Pattern 3: Implementation Details with Algorithm Breakdown
**What:** Mathematical explanation → Algorithm steps → C++ implementation → Visual demo
**When to use:** Implementation details page
**Example:**
```html
<section class="algorithm-section">
  <h2>Scanline Rasterization</h2>

  <h3>Mathematical Foundation</h3>
  <p>Each edge is represented as a line equation <code>x = m*y + b</code> where:</p>
  <ul>
    <li><code>m = (x1 - x0) / (y1 - y0)</code> is the slope</li>
    <li><code>b = x0 - m*y0</code> is the x-intercept</li>
    <li>Sample at pixel center: <code>x = m*(y + 0.5) + b</code></li>
  </ul>

  <h3>Algorithm Steps</h3>
  <ol>
    <li>Convert polygon vertices to edges (store top, bottom, slope)</li>
    <li>Sort edges by top Y coordinate</li>
    <li>For each scanline Y from top to bottom:
      <ul>
        <li>Find all active edges (top ≤ Y < bottom)</li>
        <li>Calculate X intersection for each edge</li>
        <li>Sort intersections by X</li>
        <li>Fill between pairs of intersections</li>
      </ul>
    </li>
  </ol>

  <h3>C++ Implementation</h3>
  <pre class="line-numbers" data-line="24"><code class="language-cpp">
// Edge evaluation at scanline Y
float Edge::eval(int y) {
    return m * ((float)y + 0.5f) + x;  // x = m*y + b
}

// Scanline filling
void fillScanline(int y, std::vector<Edge>& edges, GPixel* dst, const GPaint& paint) {
    std::vector<float> intersections;
    for (auto& edge : edges) {
        if (edge.top <= y && y < edge.bottom) {
            intersections.push_back(edge.eval(y));
        }
    }
    std::sort(intersections.begin(), intersections.end());

    for (size_t i = 0; i + 1 < intersections.size(); i += 2) {
        int x0 = GRoundToInt(intersections[i]);
        int x1 = GRoundToInt(intersections[i + 1]);
        fillRow(dst, x0, x1, paint);  // Fill pixels from x0 to x1
    }
}
  </code></pre>

  <h3>Visual Demo</h3>
  <iframe src="../wasm-graphics-demo.html#demo=shapes"
          width="100%"
          height="500"
          loading="lazy"
          style="border: 1px solid #ddd; border-radius: 8px;">
  </iframe>
</section>
```

**Pattern established in Phase 5:** Core-rendering.html, transforms-textures.html, paths-gradients.html all use this four-part structure (Math → Algorithm → Code → Demo).

### Pattern 4: Capability Catalog with Feature Matrix
**What:** Comprehensive table of all engine features with descriptions and demo links
**When to use:** Capabilities showcase page
**Example:**
```html
<section class="capability-section">
  <h2>Rendering Capabilities</h2>

  <table class="capability-matrix">
    <thead>
      <tr>
        <th>Feature</th>
        <th>Description</th>
        <th>Source File</th>
        <th>Demo</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Rectangle Drawing</strong></td>
        <td>Axis-aligned rectangle rendering with blend modes</td>
        <td><code>my_canvas.cpp::drawRect()</code></td>
        <td><a href="../wasm-graphics-demo.html#demo=shapes">Shapes Demo</a></td>
      </tr>
      <tr>
        <td><strong>Polygon Rendering</strong></td>
        <td>Convex polygon fill with edge-list scanline algorithm</td>
        <td><code>my_canvas.cpp::drawConvexPolygon()</code></td>
        <td><a href="../wasm-graphics-demo.html#demo=polygon-spiral">Polygon Spiral</a></td>
      </tr>
      <tr>
        <td><strong>Linear Gradient</strong></td>
        <td>Color interpolation between two points with tile modes</td>
        <td><code>shader_ops.h::LinearGradientShader</code></td>
        <td><a href="../wasm-graphics-demo.html#demo=linear-gradient">Linear Gradient Demo</a></td>
      </tr>
      <tr>
        <td><strong>Radial Gradient</strong></td>
        <td>Circular gradient from center point with radius</td>
        <td><code>shader_ops.h::RadialGradientShader</code></td>
        <td><a href="../wasm-graphics-demo.html#demo=radial-gradient">Radial Gradient Demo</a></td>
      </tr>
      <tr>
        <td><strong>Sweep Gradient</strong></td>
        <td>Angular gradient using atan2 for 360° color sweep</td>
        <td><code>shader_ops.h::AngleGradientShader</code></td>
        <td><a href="../wasm-graphics-demo.html#demo=sweep-gradient">Sweep Gradient Demo</a></td>
      </tr>
      <tr>
        <td><strong>Bitmap Shader</strong></td>
        <td>Texture mapping with clamp/repeat/mirror tile modes</td>
        <td><code>shader_ops.h::BitmapShader</code></td>
        <td><a href="../wasm-graphics-demo.html#demo=bitmap-shader">Bitmap Shader Demo</a></td>
      </tr>
      <tr>
        <td><strong>Porter-Duff Blending</strong></td>
        <td>13 blend modes (Clear, Src, Dst, SrcOver, DstOver, SrcIn, DstIn, etc.)</td>
        <td><code>blend_functions.h</code></td>
        <td><a href="../wasm-graphics-demo.html#demo=blend-modes">Blend Modes Demo</a></td>
      </tr>
      <tr>
        <td><strong>Path Rendering</strong></td>
        <td>Bezier curve tessellation with winding-fill rule</td>
        <td><code>path_ops.h, my_canvas.cpp::drawPath()</code></td>
        <td><a href="../wasm-graphics-demo.html#demo=paths">Paths Demo</a></td>
      </tr>
      <tr>
        <td><strong>Triangle Mesh</strong></td>
        <td>Indexed triangle rendering with texture coordinates</td>
        <td><code>my_canvas.cpp::drawMesh()</code></td>
        <td><a href="../wasm-graphics-demo.html#demo=mesh">Mesh Demo</a></td>
      </tr>
      <tr>
        <td><strong>Matrix Transformations</strong></td>
        <td>Translate, rotate, scale with save/restore stack</td>
        <td><code>my_canvas.cpp::concat(), save(), restore()</code></td>
        <td><a href="../wasm-graphics-demo.html#demo=transforms">Transforms Demo</a></td>
      </tr>
    </tbody>
  </table>
</section>

<section class="capability-section">
  <h2>System Architecture</h2>

  <table class="capability-matrix">
    <thead>
      <tr>
        <th>Component</th>
        <th>Purpose</th>
        <th>Key Classes</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Canvas Abstraction</strong></td>
        <td>Drawing surface with coordinate system and clipping</td>
        <td><code>GCanvas</code> (interface), <code>MyCanvas</code> (implementation)</td>
      </tr>
      <tr>
        <td><strong>Shader System</strong></td>
        <td>Generates colors for each pixel (solid, gradient, bitmap)</td>
        <td><code>GShader</code> (base), <code>LinearGradientShader</code>, <code>RadialGradientShader</code>, <code>AngleGradientShader</code>, <code>BitmapShader</code></td>
      </tr>
      <tr>
        <td><strong>Blend Pipeline</strong></td>
        <td>Composites source and destination pixels using blend modes</td>
        <td><code>GBlendMode</code> (enum), <code>blend_functions.h</code> (implementations)</td>
      </tr>
      <tr>
        <td><strong>Path System</strong></td>
        <td>Vector path construction and tessellation</td>
        <td><code>GPath</code> (interface), <code>path_ops.h</code> (Bezier algorithms)</td>
      </tr>
      <tr>
        <td><strong>Edge Rasterizer</strong></td>
        <td>Converts polygons to scanline fills</td>
        <td><code>Edge</code> (edge structure), <code>my_canvas.cpp::drawConvexPolygon()</code></td>
      </tr>
    </tbody>
  </table>
</section>
```

**CSS styling:**
```css
.capability-matrix {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
}

.capability-matrix thead {
  background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
  color: white;
}

.capability-matrix th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
}

.capability-matrix td {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.capability-matrix tbody tr:hover {
  background: #f8f9fa;
}

.capability-matrix a {
  color: #2E7D32;
  text-decoration: none;
  font-weight: 600;
}

.capability-matrix a:hover {
  text-decoration: underline;
}
```

**Source:** Inspired by [Apache Beam Capability Matrix](https://beam.apache.org/documentation/runners/capability-matrix/), [Citrix Feature Matrix](https://docs.citrix.com/en-us/citrix-workspace-app/citrix-workspace-app-feature-matrix.html)

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| C++ header parsing | Custom regex/string parsing | Doxygen or manual extraction | Doxygen handles complex C++ syntax (templates, namespaces, inheritance), outputs XML for programmatic processing. For 13 headers (1206 lines), manual extraction with grep is simpler. |
| Architecture diagrams | Hand-coded SVG | Mermaid diagrams-as-code | Mermaid provides version control, regeneration, consistent styling. Hand-coded SVG requires manual coordinate calculation and is brittle to changes. |
| Code snippet management | Copy-paste code into HTML | Extract from source with line numbers | Phase 5 already demonstrates this pattern. Embedding source snippets directly keeps docs in sync with code. |
| Documentation search | Custom JavaScript search | Browser built-in search (Ctrl+F) or external tools | For 4 documentation pages, browser search is sufficient. Complex search (Algolia DocSearch) is overkill. |
| Responsive tables | Custom JavaScript scrolling | CSS `overflow-x: auto` on wrapper | Modern CSS handles horizontal scroll for wide tables on mobile. No JavaScript needed. |

**Key insight:** Documentation tooling has two extremes: over-engineering (full Doxygen site generation for 4 pages) and under-engineering (brittle regex parsing). The sweet spot for this project is: hand-written HTML pages using Phase 5's established patterns, Mermaid for diagrams, and simple grep/awk extraction for API reference data.

## Common Pitfalls

### Pitfall 1: Over-reliance on Auto-Generated Documentation
**What goes wrong:** Using Doxygen to generate complete documentation site results in generic, hard-to-customize output that doesn't match the portfolio's forest green aesthetic or Phase 5's navigation patterns.

**Why it happens:** Doxygen is designed for large codebases (hundreds of files) and generates comprehensive but generic documentation. For a portfolio showcasing 13 header files, it's overkill and requires extensive theme customization.

**How to avoid:**
- Use Doxygen only for API reference extraction (if at all)
- Hand-write architecture, implementation, and capabilities pages
- Maintain consistent styling with Phase 5 (docs.css, forest green palette)
- Link to existing demos rather than regenerating them

**Warning signs:**
- Documentation doesn't match portfolio color scheme
- Navigation doesn't integrate with existing docs/index.html
- Generic Doxygen theme overrides your CSS

**Source:** [Doxygen vs Hand-Written Documentation](https://idratherbewriting.com/learnapidoc/nativelibraryapis_doxygen.html)

### Pitfall 2: Stale Code Examples
**What goes wrong:** Code snippets in documentation diverge from actual implementation, confusing users who try to understand discrepancies.

**Why it happens:** Code examples are copy-pasted into HTML during initial documentation, but source code evolves. No automated synchronization exists.

**How to avoid:**
- Extract snippets programmatically with line number references
- Document which source file and line range each snippet comes from
- Use `data-src-file` and `data-src-lines` HTML attributes for traceability
- Consider build-time validation (compare snippet hashes to source)

**Warning signs:**
- Function signatures in docs don't match header files
- Code examples reference parameters that don't exist
- Comments in snippets contradict current implementation

**Example mitigation:**
```html
<!-- Add metadata for traceability -->
<pre data-src-file="my_canvas.cpp" data-src-lines="145-162">
  <code class="language-cpp">
  // Extracted code here
  </code>
</pre>
```

### Pitfall 3: Inaccessible Architecture Diagrams
**What goes wrong:** Complex SVG diagrams without text alternatives are invisible to screen readers, failing WCAG accessibility requirements.

**Why it happens:** Mermaid generates visual SVGs, but developers forget to add ARIA labels and semantic descriptions.

**How to avoid:**
- Add `role="img"` and `aria-label` to diagram containers
- Provide text alternative in adjacent paragraph or `<details>` element
- Use semantic HTML structure (headings, lists) to describe flow
- Test with screen reader (VoiceOver on macOS, NVDA on Windows)

**Warning signs:**
- No alt text or aria-label on diagram containers
- Diagram information isn't conveyed in surrounding text
- Screen reader only announces "graphic" without context

**Example:**
```html
<div class="mermaid" role="img" aria-label="Graphics pipeline: Canvas receives draw commands, passes through Paint object to Shader, then Blender, finally updating pixel buffer and HTML5 Canvas">
graph LR
  A[GCanvas] --> B[GPaint]
  B --> C[GShader]
  C --> D[Blender]
  D --> E[HTML5 Canvas]
</div>

<!-- Text alternative -->
<details>
  <summary>Text description of pipeline</summary>
  <p>The graphics pipeline flows through five stages: GCanvas receives drawing commands, passes them through GPaint configuration, generates colors via GShader, composites with existing pixels using Blender, and outputs to HTML5 Canvas.</p>
</details>
```

**Source:** [Accessible SVG Diagrams](https://www.w3.org/WAI/tutorials/images/complex/), [Navigation Accessibility](https://usability.yale.edu/web-accessibility/articles/navigation)

### Pitfall 4: Missing Deep Links in Capability Catalog
**What goes wrong:** Capability catalog links to demo homepage instead of specific feature demonstrations, requiring users to manually navigate and configure controls.

**Why it happens:** Demo URLs don't include feature-specific anchors or query parameters.

**How to avoid:**
- Use hash fragments for demo selection: `wasm-graphics-demo.html#demo=blend-modes`
- Pre-configure parameters via URL: `#demo=transforms&rotation=45&scale=2`
- Test all catalog links to ensure they load correct demo state
- Document URL scheme for maintainability

**Warning signs:**
- All capability links point to same demo URL
- Users can't share direct links to specific feature demonstrations
- Clicking catalog link requires manual control adjustment

**Example:**
```html
<!-- Good: Direct link to specific demo -->
<a href="../wasm-graphics-demo.html#demo=radial-gradient&radius=150&colors=3">
  Radial Gradient Demo
</a>

<!-- Bad: Generic link requires manual navigation -->
<a href="../wasm-graphics-demo.html">
  Radial Gradient Demo
</a>
```

**Note:** Check if wasm-graphics-demo.html already implements hash-based routing from Phase 4. If not, this is a prerequisite for effective capability catalog.

### Pitfall 5: Non-Responsive API Reference Tables
**What goes wrong:** Wide API reference tables with many columns overflow on mobile devices, requiring horizontal scroll that users don't discover.

**Why it happens:** Desktop-first design doesn't account for narrow viewports (< 768px).

**How to avoid:**
- Wrap tables in scrollable container with visible scroll indicator
- Use responsive table patterns (stacked labels on mobile)
- Test at 320px, 768px, and 1024px breakpoints
- Add CSS for horizontal scroll shadow effect

**Warning signs:**
- Table extends beyond viewport on mobile
- No visual indication that horizontal scroll is available
- Text truncation without indication

**Example CSS:**
```css
/* Responsive table wrapper with scroll shadow */
.table-wrapper {
  width: 100%;
  overflow-x: auto;
  background: linear-gradient(to right, white 30%, rgba(255,255,255,0)),
              linear-gradient(to left, white 30%, rgba(255,255,255,0)),
              linear-gradient(to right, rgba(0,0,0,.15), rgba(0,0,0,0)),
              linear-gradient(to left, rgba(0,0,0,.15), rgba(0,0,0,0));
  background-position: 0 0, 100% 0, 0 0, 100% 0;
  background-size: 4em 100%, 4em 100%, 1em 100%, 1em 100%;
  background-repeat: no-repeat;
  background-attachment: local, local, scroll, scroll;
}

@media (max-width: 768px) {
  .api-table {
    font-size: 0.85rem;
  }

  .api-table td,
  .api-table th {
    padding: 0.5rem;
  }
}
```

**Source:** [Responsive Table Patterns](https://www.dreamhost.com/blog/navigation-menu-design/)

## Code Examples

Verified patterns from official sources and Phase 5 implementation:

### Mermaid Pipeline Diagram for Architecture Page
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Architecture - Graphics Engine Documentation</title>
  <link rel="stylesheet" href="assets/css/docs.css">

  <!-- Mermaid for diagrams -->
  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
    mermaid.initialize({
      startOnLoad: true,
      theme: 'base',
      themeVariables: {
        primaryColor: '#2E7D32',
        primaryTextColor: '#fff',
        primaryBorderColor: '#1B5E20',
        lineColor: '#2E7D32',
        secondaryColor: '#81C784',
        tertiaryColor: '#f8f9fa'
      }
    });
  </script>
</head>
<body>
  <header class="docs-header">
    <nav class="docs-nav">
      <a href="index.html" class="nav-link">Documentation Index</a>
      <a href="../index.html" class="nav-link">Portfolio</a>
    </nav>
    <h1>Architecture Overview</h1>
    <p class="subtitle">System Design and Data Flow</p>
  </header>

  <main class="docs-content">
    <section>
      <h2>Rendering Pipeline</h2>
      <p>The graphics engine follows a layered pipeline architecture where each stage transforms data for the next:</p>

      <div class="mermaid" role="img" aria-label="Rendering pipeline from canvas to pixels">
graph LR
    A[GCanvas<br/>Drawing Commands] --> B[GPaint<br/>Configuration]
    B --> C[GShader<br/>Color Generation]
    C --> D[GBlendMode<br/>Compositing]
    D --> E[Pixel Buffer<br/>ARGB Data]
    E --> F[HTML5 Canvas<br/>Display]

    style A fill:#2E7D32,stroke:#1B5E20,color:#fff,stroke-width:2px
    style F fill:#2E7D32,stroke:#1B5E20,color:#fff,stroke-width:2px
    style B fill:#81C784,stroke:#2E7D32,stroke-width:2px
    style C fill:#81C784,stroke:#2E7D32,stroke-width:2px
    style D fill:#81C784,stroke:#2E7D32,stroke-width:2px
    style E fill:#81C784,stroke:#2E7D32,stroke-width:2px
      </div>

      <details>
        <summary>Text Description of Pipeline</summary>
        <ol>
          <li><strong>GCanvas:</strong> Receives drawing commands (drawRect, drawPath, drawMesh)</li>
          <li><strong>GPaint:</strong> Configures color/shader and blend mode</li>
          <li><strong>GShader:</strong> Generates per-pixel colors (solid, gradient, bitmap)</li>
          <li><strong>GBlendMode:</strong> Composites source colors with destination pixels</li>
          <li><strong>Pixel Buffer:</strong> ARGB data in WASM heap memory</li>
          <li><strong>HTML5 Canvas:</strong> Displays final image in browser</li>
        </ol>
      </details>
    </section>

    <section>
      <h2>Transformation Matrix Stack</h2>
      <p>Matrix transformations enable coordinate space manipulation with save/restore semantics:</p>

      <div class="mermaid" role="img" aria-label="Transformation matrix stack showing save, concat, and restore operations">
flowchart TD
    A[Identity Matrix] --> B[save<br/>Push to Stack]
    B --> C[concat translate 100, 50]
    C --> D[concat rotate 45°]
    D --> E[Draw Operations<br/>in Transformed Space]
    E --> F[restore<br/>Pop from Stack]
    F --> G[Back to Identity]

    style A fill:#2E7D32,stroke:#1B5E20,color:#fff
    style G fill:#2E7D32,stroke:#1B5E20,color:#fff
      </div>

      <details>
        <summary>Text Description of Matrix Stack</summary>
        <p>The transformation stack allows nested coordinate spaces. Each save() pushes the current transformation matrix (CTM) onto a stack. concat() multiplies the CTM by a new transformation. restore() pops the stack, reverting to the previous CTM. This enables local transformations without affecting outer coordinate spaces.</p>
      </details>
    </section>
  </main>
</body>
</html>
```

**Source:** [Mermaid Documentation](https://mermaid.js.org/), Phase 5 docs.css styling patterns

### API Reference Extraction Script
```bash
#!/bin/bash
# extract_api.sh - Extract function signatures from header files
# Usage: ./extract_api.sh > api_data.txt

HEADERS="graphics-engine/include/GCanvas.h graphics-engine/include/GShader.h graphics-engine/include/GPaint.h"

for header in $HEADERS; do
  echo "=== $(basename $header) ==="

  # Extract virtual functions (pure virtual interface methods)
  grep -A 5 "virtual.*=" "$header" | sed 's/^[[:space:]]*//'

  # Extract factory functions (GCreate*)
  grep -A 3 "^std::unique_ptr<" "$header" | sed 's/^[[:space:]]*//'

  echo ""
done
```

**Alternative: Manual extraction with documentation comments**
```bash
# Extract function signature with preceding comment block
awk '/\/\*\*/,/\*\// {comment=comment $0 "\n"}
     /virtual.*=.*0;/ {print comment $0 "\n"; comment=""}' GCanvas.h
```

### Capability Matrix HTML Template
```html
<!-- capabilities.html -->
<section class="capability-section">
  <h2>Feature Catalog</h2>
  <p>Complete list of graphics engine capabilities with links to demos and source code.</p>

  <div class="table-wrapper">
    <table class="capability-matrix">
      <thead>
        <tr>
          <th>Feature</th>
          <th>Description</th>
          <th>Implementation</th>
          <th>Documentation</th>
          <th>Demo</th>
        </tr>
      </thead>
      <tbody>
        <!-- Basic Shapes -->
        <tr>
          <td><strong>Rectangle Drawing</strong></td>
          <td>Axis-aligned rectangle fill with arbitrary paint</td>
          <td>
            <code>my_canvas.cpp</code><br/>
            <small>Lines 40-48</small>
          </td>
          <td><a href="core-rendering.html#rectangle-drawing">Core Rendering</a></td>
          <td><a href="../wasm-graphics-demo.html#demo=shapes">View Demo</a></td>
        </tr>

        <!-- Convex Polygons -->
        <tr>
          <td><strong>Convex Polygon</strong></td>
          <td>Arbitrary convex polygon rendering via edge-list scanline algorithm</td>
          <td>
            <code>my_canvas.cpp</code><br/>
            <small>Lines 56-92</small>
          </td>
          <td><a href="core-rendering.html#edge-rasterization">Core Rendering</a></td>
          <td><a href="../wasm-graphics-demo.html#demo=polygon-spiral">View Demo</a></td>
        </tr>

        <!-- Linear Gradient -->
        <tr>
          <td><strong>Linear Gradient Shader</strong></td>
          <td>Color interpolation along a line with clamp/repeat/mirror tile modes</td>
          <td>
            <code>shader_ops.h</code><br/>
            <small>LinearGradientShader class</small>
          </td>
          <td><a href="paths-gradients.html#linear-gradient">Paths & Gradients</a></td>
          <td><a href="../wasm-graphics-demo.html#demo=linear-gradient">View Demo</a></td>
        </tr>

        <!-- Radial Gradient -->
        <tr>
          <td><strong>Radial Gradient Shader</strong></td>
          <td>Circular gradient from center with radius parameter</td>
          <td>
            <code>shader_ops.h</code><br/>
            <small>RadialGradientShader class</small>
          </td>
          <td><a href="paths-gradients.html#radial-gradient">Paths & Gradients</a></td>
          <td><a href="../wasm-graphics-demo.html#demo=radial-gradient">View Demo</a></td>
        </tr>

        <!-- Sweep Gradient -->
        <tr>
          <td><strong>Sweep Gradient Shader</strong></td>
          <td>Angular gradient using atan2 for 360° color sweep</td>
          <td>
            <code>shader_ops.h</code><br/>
            <small>AngleGradientShader class</small>
          </td>
          <td><a href="final-features.html#sweep-gradient">Final Features</a></td>
          <td><a href="../wasm-graphics-demo.html#demo=sweep-gradient">View Demo</a></td>
        </tr>

        <!-- Bitmap Shader -->
        <tr>
          <td><strong>Bitmap Shader</strong></td>
          <td>Texture mapping with transformation matrix and tile modes</td>
          <td>
            <code>shader_ops.h</code><br/>
            <small>BitmapShader class</small>
          </td>
          <td><a href="transforms-textures.html#bitmap-shader">Transforms & Textures</a></td>
          <td><a href="../wasm-graphics-demo.html#demo=bitmap-shader">View Demo</a></td>
        </tr>

        <!-- Porter-Duff Blending -->
        <tr>
          <td><strong>Porter-Duff Blending</strong></td>
          <td>13 blend modes including Clear, Src, Dst, SrcOver, DstOver, SrcIn, DstIn, SrcOut, DstOut, SrcATop, DstATop, Xor, Plus</td>
          <td>
            <code>blend_functions.h</code><br/>
            <small>All blend mode functions</small>
          </td>
          <td><a href="core-rendering.html#porter-duff-blending">Core Rendering</a></td>
          <td><a href="../wasm-graphics-demo.html#demo=blend-modes">View Demo</a></td>
        </tr>

        <!-- Path Rendering -->
        <tr>
          <td><strong>Bezier Path Rendering</strong></td>
          <td>Quadratic and cubic Bezier curves with adaptive tessellation</td>
          <td>
            <code>path_ops.h</code><br/>
            <code>my_canvas.cpp::drawPath()</code>
          </td>
          <td><a href="paths-gradients.html#bezier-curves">Paths & Gradients</a><br/>
              <a href="advanced-geometry.html#bezier-curves">Advanced Geometry</a></td>
          <td><a href="../wasm-graphics-demo.html#demo=paths">View Demo</a></td>
        </tr>

        <!-- Triangle Mesh -->
        <tr>
          <td><strong>Triangle Mesh</strong></td>
          <td>Indexed triangle rendering with optional color and texture interpolation</td>
          <td>
            <code>my_canvas.cpp::drawMesh()</code>
          </td>
          <td><a href="advanced-geometry.html#triangle-meshes">Advanced Geometry</a></td>
          <td><a href="../wasm-graphics-demo.html#demo=mesh">View Demo</a></td>
        </tr>

        <!-- Matrix Transformations -->
        <tr>
          <td><strong>Affine Transformations</strong></td>
          <td>2D matrix transformations: translate, rotate, scale with save/restore stack</td>
          <td>
            <code>my_canvas.cpp</code><br/>
            <small>save(), restore(), concat()</small>
          </td>
          <td><a href="transforms-textures.html#matrix-transforms">Transforms & Textures</a></td>
          <td><a href="../wasm-graphics-demo.html#demo=transforms">View Demo</a></td>
        </tr>
      </tbody>
    </table>
  </div>
</section>
```

**CSS for responsive table:**
```css
.table-wrapper {
  width: 100%;
  overflow-x: auto;
  margin: 2rem 0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.capability-matrix {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px; /* Ensures horizontal scroll on mobile */
}

.capability-matrix thead {
  background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
  color: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.capability-matrix th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  white-space: nowrap;
}

.capability-matrix td {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  vertical-align: top;
}

.capability-matrix tbody tr:hover {
  background: #f8f9fa;
}

.capability-matrix code {
  background: #f5f5f5;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 0.85rem;
  display: inline-block;
}

.capability-matrix small {
  color: #666;
  display: block;
  margin-top: 0.25rem;
}

.capability-matrix a {
  color: #2E7D32;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.capability-matrix a:hover {
  color: #1B5E20;
  text-decoration: underline;
}

@media (max-width: 768px) {
  .capability-matrix {
    font-size: 0.85rem;
  }

  .capability-matrix td,
  .capability-matrix th {
    padding: 0.75rem 0.5rem;
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Doxygen-only documentation | Hybrid: hand-written architecture + structured API reference | 2020s | Modern docs balance auto-generation (API reference) with hand-crafted explanations (architecture, tutorials). Pure Doxygen output is too generic for portfolios. |
| PNG/JPG diagram images | Mermaid diagrams-as-code | 2021+ (Mermaid v9+) | Version-controlled diagrams that regenerate on code changes. Accessible to screen readers with proper ARIA labels. |
| Single-page API reference | Multi-page topic-based documentation | Ongoing | Separating architecture, API reference, implementation details, and capabilities improves navigation and reduces cognitive load. MDN pioneered this pattern. |
| Desktop-only table layouts | Responsive tables with horizontal scroll | 2016+ (mobile-first era) | Wide API reference tables wrap in scrollable containers with visual scroll indicators. Tested at 320px viewport. |
| Comment-only documentation | Documentation as code (Markdown, inline examples) | 2020s | Runnable examples embedded in docs (CodeSandbox, JSFiddle for JS; iframe demos for WASM). Phase 5 already demonstrates this with embedded demos. |

**Deprecated/outdated:**
- **JavaDoc-style comments only:** Modern docs require architecture explanations and visual examples, not just parameter descriptions. Comments are necessary but not sufficient.
- **Separate wiki systems:** GitHub wikis and external wikis (Confluence) are deprecated in favor of docs/ folders in repositories. Keeps documentation versioned with code.
- **Flash/Java applet demos:** WASM replaced Flash for browser demos. Phase 4 already uses WASM.
- **Auto-generated UML class diagrams:** Too detailed for overview documentation. Modern architecture diagrams focus on data flow and component relationships, not every class/method.

**Emerging in 2026:**
- **GenAI documentation assistants:** Tools like GitHub Copilot can generate documentation comments, but human review is essential. [Source: Technical Documentation Trends 2026](https://www.fluidtopics.com/blog/industry-insights/technical-documentation-trends-2026/)
- **GEO (Generated Engine Optimization):** Optimizing docs for AI systems (ChatGPT, Copilot) to surface correct information. Structured data (tables, code blocks) helps AI parse. [Source: Technical Documentation Trends 2026](https://www.fluidtopics.com/blog/industry-insights/technical-documentation-trends-2026/)
- **Interactive API playgrounds:** Mintlify, Docusaurus, and modern doc platforms embed live API calls. For this project, Phase 4's interactive demos already serve this purpose.

## Open Questions

Things that couldn't be fully resolved:

1. **Demo URL Deep Linking Scheme**
   - What we know: Phase 4 created 10 interactive demos in wasm-graphics-demo.html
   - What's unclear: Does wasm-graphics-demo.html implement hash-based routing (`#demo=shapes`) or query parameters (`?demo=shapes`)?
   - Recommendation: Check wasm-graphics-demo.html implementation. If no routing exists, add it in Phase 6 or document manual navigation requirement in capability catalog.

2. **Header File Documentation Comment Coverage**
   - What we know: Header files have some documentation comments (e.g., GCanvas.h has detailed function comments)
   - What's unclear: How comprehensive are comments across all 13 headers? Are they Doxygen-compatible?
   - Recommendation: Audit header files during API reference page creation. If comments are sparse, supplement with hand-written descriptions based on implementation knowledge from Phase 5.

3. **Architecture Diagram Complexity**
   - What we know: Need pipeline diagram (Canvas → Shader → Blender → Pixels) and matrix stack diagram
   - What's unclear: How detailed should diagrams be? Include every class or show high-level components only?
   - Recommendation: Start with high-level component diagrams (5-7 boxes). Use Phase 5's existing documentation pages as complexity guide. Can expand with detailed class diagrams in future phases if needed.

4. **Source File Line Number Stability**
   - What we know: Code examples reference specific line numbers (e.g., "Lines 40-48")
   - What's unclear: How to handle line numbers shifting as code evolves?
   - Recommendation: Use relative references ("in the drawRect() function") or extract entire functions rather than line ranges. Add `data-src-file` attributes for traceability without brittle line numbers.

## Sources

### Primary (HIGH confidence)
- [Mermaid Official Documentation v11.1.0+](https://mermaid.js.org/) - Architecture diagrams, flowcharts, SVG export
- [Mermaid Architecture Diagrams](https://mermaid.js.org/syntax/architecture.html) - New architecture diagram syntax
- [MDN Canvas API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) - Structure and organization patterns for graphics API docs
- [MDN WebGL API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) - Tutorial series structure
- Phase 5 Research (.planning/phases/05-code-examples/05-RESEARCH.md) - Established patterns: Prism.js, tabs.js, docs.css, forest green theme
- Phase 5 Implementation (docs/core-rendering.html, docs/index.html) - Working examples of documentation structure

### Secondary (MEDIUM confidence)
- [Doxygen Official Site](https://www.doxygen.nl/) - C++ documentation generator, v1.16.1 released January 2026
- [I'd Rather Be Writing: Doxygen](https://idratherbewriting.com/learnapidoc/nativelibraryapis_doxygen.html) - When to use Doxygen vs hand-written docs
- [API Documentation Tools Comparison 2026](https://ferndesk.com/blog/best-api-documentation-tools) - Mintlify, Docusaurus, Redoc comparison
- [Static Site Generators for API Docs](https://idratherbewriting.com/learnapidoc/pubapis_static_site_generators.html) - Static vs dynamic documentation
- [Technical Documentation Best Practices 2026](https://www.documind.chat/blog/technical-documentation-best-practices) - 10 essential practices including GenAI integration
- [Technical Documentation Trends 2026](https://www.fluidtopics.com/blog/industry-insights/technical-documentation-trends-2026/) - GenAI, GEO, emerging patterns
- [Apache Beam Capability Matrix](https://beam.apache.org/documentation/runners/capability-matrix/) - Feature matrix table pattern
- [Citrix Workspace Feature Matrix](https://docs.citrix.com/en-us/citrix-workspace-app/citrix-workspace-app-feature-matrix.html) - Capability catalog example
- [W3C WAI: Accessible Navigation](https://www.w3.org/WAI/tutorials/menus/structure/) - Menu structure and ARIA
- [Yale Usability: Navigation Accessibility](https://usability.yale.edu/web-accessibility/articles/navigation) - Navigation best practices

### Tertiary (LOW confidence)
- [Mermaid vs Architecture as Code](https://medium.com/@koshea-il/architecture-diagrams-as-code-mermaid-vs-architecture-as-code-d7f200842712) - Comparison, need verification
- [Documentation Generator Comparison (Wikipedia)](https://en.wikipedia.org/wiki/Comparison_of_documentation_generators) - General overview, not 2026-specific
- [Capability Mapping Guide 2026](https://skillpanel.com/blog/capability-mapping/) - Business capability mapping, adapted for feature catalogs

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Prism.js and Mermaid are well-established, Phase 5 provides direct evidence
- Architecture patterns: HIGH - MDN documentation and Phase 5 implementation provide verified patterns
- API reference extraction: MEDIUM - Manual extraction is simple, but Doxygen integration path is unverified for this specific project
- Capability catalog structure: MEDIUM - Verified patterns exist (Apache Beam, Citrix), but application to graphics engine is adaptation
- Pitfalls: HIGH - Based on common documentation anti-patterns and accessibility guidelines (W3C WAI)

**Research date:** 2026-02-04
**Valid until:** 60 days (2026-04-05) - Documentation patterns are stable, but Mermaid and Doxygen may see minor updates. GenAI integration trends are evolving rapidly.
