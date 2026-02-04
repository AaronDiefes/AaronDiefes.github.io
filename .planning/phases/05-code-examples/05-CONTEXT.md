# Phase 5: Code Examples - Context

**Gathered:** 2026-02-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Create documentation pages that explain C++ graphics engine implementation through code snippets and embedded interactive demos. Show technical depth to portfolio visitors (recruiters, engineers, technical decision-makers). Does NOT modify the existing wasm-graphics-demo.html interactive demo page.

</domain>

<decisions>
## Implementation Decisions

### Code Location
- Documentation pages only (separate from interactive demo page)
- wasm-graphics-demo.html remains unchanged - pure interactive playground
- New doc pages at /docs/ directory (e.g., /docs/shaders.html, /docs/rendering.html)
- Each doc page explains a major feature area with code + embedded demos

### Page Layout
- Structure per page: Explanation text → C++ code snippet → Interactive demo
- Interleaved narrative style: explanation and code woven together, building understanding
- Demo always at the end as the finale/proof
- Example flow: "Here's the algorithm [explanation] → Here's the implementation [code] → Now see it working [demo]"
- Mobile: same layout, stacked vertically (no hiding/collapsing)

### Code Content
- Show C++ implementation code from .cpp files (my_canvas.cpp, shader_ops.cpp, etc.)
- NOT JavaScript API calls, NOT WASM glue code - pure C++ engine implementation
- Key excerpts (20-50 lines) rather than complete functions - focus on algorithms, omit boilerplate
- Demonstrate technical depth and problem-solving approach

### Documentation Topics
Four main documentation pages covering all engine capabilities:
1. **Rendering basics** - Canvas, shapes, colors, foundational drawing operations
2. **Shaders system** - All gradient types (linear/radial/sweep), bitmap shaders, shader architecture
3. **Advanced features** - Matrix transformations, blend modes, path rendering (Bezier curves)
4. **Architecture** - How the engine works, WASM integration, pixel pipeline overview

### Code Organization
- Tabbed by concept within each doc page
- Example: Shaders page has tabs: "Linear Gradient" | "Radial Gradient" | "Sweep/Angle Gradient" | "Bitmap Shader"
- Technical names for tabs (not abbreviated, not overly descriptive)
- Within each tab: interleaved explanation + code snippets, ending with demo
- Progressive narrative building to complete understanding

### Presentation Style
- Syntax highlighting: Prism.js with C++ language support
- Theme: Dark theme (like VSCode Dark+) for better code reading contrast
- Features enabled:
  - ✅ Copy button (one-click copy entire snippet)
  - ✅ Line numbers (left gutter)
  - ✅ Inline comments (explanatory comments within the C++ code)
  - ✅ Highlighted lines (emphasize key lines with background color/arrows)

### Claude's Discretion
- Exact spacing, margins, typography for doc pages
- Error state handling for demo iframes
- Specific Prism.js theme choice (any professional dark theme)
- Which specific lines to highlight in each snippet
- Exact wording of explanatory text (technical but accessible)

</decisions>

<specifics>
## Specific Ideas

- "The code snippets will be pulled from the C++ engine itself, not any of the translated WASM code or the code that wrote the demo"
- "The whole point of this section of my website is to show off the engine, using code snippets + explanation, and demos of the code"
- "I could see code integrated into text. For example, text explanation of algorithm, code showing algorithm, moves on to next part of algorithm, shows next part of code, etc. Always end with the demo."
- Somewhere explain high-level how demos work (WASM translation, Emscripten, etc.) - likely in Architecture page

</specifics>

<deferred>
## Deferred Ideas

None - discussion stayed within phase scope.

</deferred>

---

*Phase: 05-code-examples*
*Context gathered: 2026-02-03*
