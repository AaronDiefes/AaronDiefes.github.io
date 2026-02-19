# Phase 17: Core Algorithm Documentation - Research

**Researched:** 2026-02-18
**Domain:** Algorithm documentation with Python code examples and syntax highlighting
**Confidence:** HIGH

## Summary

Phase 17 requires creating three React documentation pages for CS330 case study algorithms: Algorithm Evolution (T1-T5), KD-Tree Spatial Indexing, and Pathfinding (Dijkstra). Each page must include Python code examples with inline syntax highlighting using CSS classes (keyword, comment, signal, operator, number) following the established Verilog pattern from CPU documentation pages.

The existing codebase provides clear patterns: inline CSS in style tags, code blocks with span-based syntax highlighting, breadcrumb navigation, forest green design system, and footer with quick links. Python syntax highlighting follows the same approach as Verilog but with Python-specific token types (keywords like `def`, `class`, `return`; operators like `+`, `=`, `<=`; comments starting with `#`).

**Primary recommendation:** Follow CpuAluPage.jsx/CpuMultdivPage.jsx patterns exactly for page structure, inline CSS, and code block styling. Use the same span-based syntax highlighting approach but with Python token colors matching the existing palette. Include inline code comments explaining algorithm implementation details within the code blocks themselves.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React 18 | 18.x | UI components | Project standard, used by all doc pages |
| React Router | 6.x | Client-side routing | Portfolio standard for /projects/* routes |
| Inline CSS | N/A | Component styling | Established pattern in CPU/Graphics docs |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Breadcrumbs | Custom | Navigation component | Every doc page (shared component) |
| None | N/A | No external highlighting library | Manual span-based syntax highlighting |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Manual syntax highlighting | Prism.js, highlight.js | External libraries add bundle size; existing pattern uses manual span tags |
| Separate CSS files | Inline style tags | Inline styles match existing CPU/Graphics pattern, keep page-specific CSS colocated |

**Installation:**
No new dependencies required. All patterns use existing React, React Router, and custom components.

## Architecture Patterns

### Recommended Project Structure
```
src/pages/cs330/
├── Cs330DocsLanding.jsx      # Landing page (exists)
├── Cs330AlgorithmPage.jsx     # Algorithm Evolution (T1-T5)
├── Cs330KdtreePage.jsx        # KD-Tree Spatial Indexing
└── Cs330PathfindingPage.jsx  # Dijkstra Pathfinding
```

### Pattern 1: Page Component Structure
**What:** React component with inline CSS, breadcrumbs, header, content sections, code blocks, footer
**When to use:** Every CS330 documentation page
**Example:**
```jsx
// Source: Existing CPU documentation pattern (CpuAluPage.jsx)
import React from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../../components/shared/Breadcrumbs'

function Cs330AlgorithmPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'CS330 Case Study', href: '/projects/cs330/docs' },
    { label: 'Documentation', href: '/projects/cs330/docs' },
    { label: 'Algorithm Evolution' }
  ]

  return (
    <div>
      <style>{`
        .landing-header { /* forest green gradient */ }
        .container { max-width: 1200px; margin: 0 auto; }
        .section { background: white; padding: 3rem; }
        .code-block { background: #1e1e1e; color: #d4d4d4; }
        .code-block .keyword { color: #569cd6; }
        .code-block .comment { color: #6a9955; }
        .code-block .signal { color: #9cdcfe; }
        .code-block .operator { color: #d4d4d4; }
        .code-block .number { color: #b5cea8; }
      `}</style>

      <Breadcrumbs items={breadcrumbItems} />
      <header className="landing-header">
        <h1>Algorithm Evolution</h1>
        <p>T1-T5 Progressive Optimization</p>
      </header>

      <div className="container">
        <section className="section">
          <h2>Overview</h2>
          <p>Content...</p>
          <div className="code-block">
            <span className="keyword">def</span> <span className="signal">match_riders</span>(<span className="signal">riders</span>, <span className="signal">drivers</span>):<br />
            &nbsp;&nbsp;<span className="comment"># Algorithm implementation</span><br />
            &nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">matches</span>
          </div>
        </section>
      </div>
    </div>
  )
}
```

### Pattern 2: Python Code Syntax Highlighting
**What:** Manual span-based syntax highlighting using CSS classes
**When to use:** All Python code blocks in CS330 documentation
**Example:**
```jsx
<div className="code-block">
  <span className="comment"># T1: Brute Force - Check every driver</span><br />
  <span className="keyword">def</span> <span className="signal">match_brute_force</span>(<span className="signal">rider</span>, <span className="signal">drivers</span>):<br />
  &nbsp;&nbsp;<span className="signal">min_distance</span> <span className="operator">=</span> <span className="keyword">float</span>(<span className="string">'inf'</span>)<br />
  &nbsp;&nbsp;<span className="signal">best_driver</span> <span className="operator">=</span> <span className="keyword">None</span><br />
  &nbsp;&nbsp;<br />
  &nbsp;&nbsp;<span className="keyword">for</span> <span className="signal">driver</span> <span className="keyword">in</span> <span className="signal">drivers</span>:<br />
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">distance</span> <span className="operator">=</span> <span className="signal">euclidean_distance</span>(<span className="signal">rider</span>, <span className="signal">driver</span>)<br />
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> <span className="signal">distance</span> <span className="operator">&lt;</span> <span className="signal">min_distance</span>:<br />
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">min_distance</span> <span className="operator">=</span> <span className="signal">distance</span><br />
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">best_driver</span> <span className="operator">=</span> <span className="signal">driver</span><br />
  &nbsp;&nbsp;<br />
  &nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">best_driver</span>
</div>
```

### Pattern 3: Inline Code Annotations
**What:** Comments embedded within code blocks explaining implementation details
**When to use:** Key algorithm lines that need explanation
**Example:**
```jsx
<div className="code-block">
  <span className="comment"># KD-Tree node structure</span><br />
  <span className="keyword">class</span> <span className="signal">KDNode</span>:<br />
  &nbsp;&nbsp;<span className="keyword">def</span> <span className="signal">__init__</span>(<span className="signal">self</span>, <span className="signal">point</span>, <span className="signal">axis</span>):<br />
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">self</span>.<span className="signal">point</span> <span className="operator">=</span> <span className="signal">point</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment"># (lat, lon) coordinates</span><br />
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">self</span>.<span className="signal">axis</span> <span className="operator">=</span> <span className="signal">axis</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment"># 0=lat, 1=lon split axis</span><br />
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">self</span>.<span className="signal">left</span> <span className="operator">=</span> <span className="keyword">None</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment"># left subtree (&lt; median)</span><br />
  &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">self</span>.<span className="signal">right</span> <span className="operator">=</span> <span className="keyword">None</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment"># right subtree (&gt;= median)</span>
</div>
```

### Pattern 4: Side-by-Side Algorithm Comparison
**What:** Multiple code blocks showing algorithm evolution (T1 → T5)
**When to use:** Algorithm Evolution page showing progressive optimization
**Structure:**
```jsx
<section className="section">
  <h2>T1: Brute Force</h2>
  <p>O(n×m) complexity - checks every driver for every rider</p>
  <div className="code-block">
    {/* T1 implementation */}
  </div>
</section>

<section className="section">
  <h2>T2: Euclidean Distance Optimization</h2>
  <p>Still O(n×m) but faster distance calculation</p>
  <div className="code-block">
    {/* T2 implementation */}
  </div>
</section>

{/* Continue T3, T4, T5 */}
```

### Anti-Patterns to Avoid
- **External syntax highlighting libraries:** Don't use Prism.js or highlight.js - use manual span tags matching existing pattern
- **Separate CSS files:** Don't create `.css` files - use inline `<style>` tags in components
- **JSX formatting in code blocks:** Don't use JSX `<br />` tags - use `<br/>` or `{'\n'}` for line breaks
- **Missing breadcrumbs:** Every page must have breadcrumb navigation
- **Inconsistent footer:** Copy footer structure from CpuAluPage.jsx or Cs330DocsLanding.jsx

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Python code execution | Interactive Python interpreter | Static code examples with explanations | Documentation-only project, no demo page |
| Graph visualization | Custom D3.js graphs | Pre-generated matplotlib graphs from Python | Graphs stored in `public/projects/cs330/images/` |
| Syntax highlighting | Custom tokenizer/parser | Manual span tags with CSS classes | Matches existing CPU/Graphics pattern |
| Algorithm animation | Canvas/SVG animation | Static code + text explanation | CS330 is documentation-only (no demo page) |

**Key insight:** CS330 is a documentation-only project (unlike CPU/Graphics which have interactive demos). All visualizations are static images. All code examples are non-executable annotated snippets.

## Common Pitfalls

### Pitfall 1: Using External Syntax Highlighting Libraries
**What goes wrong:** Adding Prism.js or highlight.js creates bundle bloat and breaks consistency with existing pages
**Why it happens:** External libraries seem easier than manual span tagging
**How to avoid:** Follow the exact pattern from CpuAluPage.jsx - manual span tags with CSS classes (keyword, comment, signal, operator, number)
**Warning signs:** Import statements for highlight libraries, `className="language-python"` attributes

### Pitfall 2: Python-Specific Token Misclassification
**What goes wrong:** Using wrong CSS classes (e.g., `.signal` for Python keywords instead of `.keyword`)
**Why it happens:** Copying Verilog patterns without adapting token types to Python
**How to avoid:**
  - `.keyword`: Python keywords (`def`, `class`, `if`, `for`, `return`, `import`, `None`, `True`, `False`)
  - `.signal`: Variable names, function names, attributes (e.g., `rider`, `drivers`, `self.point`)
  - `.operator`: Operators (`=`, `+`, `-`, `*`, `<`, `>`, `==`, `!=`)
  - `.number`: Numeric literals (`0`, `1`, `16`, `3.14`)
  - `.comment`: Python comments (start with `#`)
  - `.string`: String literals (optional, use keyword color if needed)
**Warning signs:** Python keywords colored as signals, variable names colored as keywords

### Pitfall 3: Missing Inline Annotations in Code
**What goes wrong:** Code blocks without inline comments explaining implementation details
**Why it happens:** Forgetting requirement "Key algorithms shown with inline annotations explaining implementation details"
**How to avoid:** Add inline comments within code blocks using `<span className="comment">` tags that explain what each key line does
**Warning signs:** Long code blocks without any comments, unclear algorithm steps

### Pitfall 4: Inconsistent Breadcrumb Paths
**What goes wrong:** Breadcrumbs not matching the navigation hierarchy
**Why it happens:** Copying from CPU docs without updating paths
**How to avoid:** CS330 breadcrumbs pattern: `Home > CS330 Case Study > Documentation > [Topic]`
  - All pages: `{ label: 'CS330 Case Study', href: '/projects/cs330/docs' }` (NOT `/projects/cs330/demo`)
**Warning signs:** Breadcrumb linking to non-existent `/projects/cs330/demo` page

### Pitfall 5: Forgetting Route Registration
**What goes wrong:** Pages created but not accessible via URL
**Why it happens:** Creating page component but not adding to `App.jsx`
**How to avoid:** For each page created, add route in `App.jsx`:
  ```jsx
  <Route path="/projects/cs330/docs/algorithm" element={<Cs330AlgorithmPage />} />
  <Route path="/projects/cs330/docs/kdtree" element={<Cs330KdtreePage />} />
  <Route path="/projects/cs330/docs/pathfinding" element={<Cs330PathfindingPage />} />
  ```
**Warning signs:** 404 errors when navigating to page URLs, routes not in `App.jsx`

## Code Examples

### Python Keyword Token Examples
```python
# keyword class:
def, class, if, else, elif, for, while, return, import, from, as,
True, False, None, try, except, finally, with, lambda, pass, break, continue
```

### Algorithm Evolution Structure (T1-T5)
Each algorithm iteration should have:
1. **Section title:** `T1: Brute Force`, `T2: Optimization Name`, etc.
2. **Complexity analysis:** Big-O notation, time/space complexity
3. **Implementation explanation:** Text describing the approach
4. **Code block:** Python implementation with inline comments
5. **Performance notes:** When to use this approach, limitations

### KD-Tree Implementation Components
Must document:
1. **Node structure:** `KDNode` class with point, axis, left, right
2. **Tree construction:** `build_kdtree()` recursive function with median splitting
3. **Nearest neighbor search:** `find_nearest()` with distance pruning
4. **Complexity analysis:** O(log n) average case, O(n) worst case

### Dijkstra Pathfinding Components
Must document:
1. **Graph representation:** NetworkX graph structure with weighted edges
2. **Priority queue:** `heapq` for selecting minimum distance node
3. **Dijkstra implementation:** `dijkstra_shortest_path()` function
4. **Road network specifics:** Haversine distance for edge weights, real coordinates

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Prism.js/highlight.js | Manual span tags | v1.0 Graphics | Consistent with existing pages |
| Separate CSS modules | Inline style tags | v1.0 Graphics | Page-specific styles colocated |
| JSDoc comments | Inline code comments | v1.1 CPU | Algorithm explanation within code |

**Deprecated/outdated:**
- External syntax highlighting libraries: Portfolio uses manual span-based approach
- CSS modules: All doc pages use inline `<style>` tags

## Python Syntax Highlighting Reference

### Token to CSS Class Mapping
| Python Token | CSS Class | Color (from CPU docs) | Examples |
|--------------|-----------|----------------------|----------|
| Keywords | `.keyword` | `#569cd6` (blue) | `def`, `class`, `if`, `for`, `return`, `None` |
| Variables/Functions | `.signal` | `#9cdcfe` (light blue) | `rider`, `drivers`, `euclidean_distance` |
| Operators | `.operator` | `#d4d4d4` (white) | `=`, `+`, `<`, `>=`, `==` |
| Numbers | `.number` | `#b5cea8` (green) | `0`, `1`, `16`, `3.14` |
| Comments | `.comment` | `#6a9955` (green) | `# This is a comment` |
| Strings | `.keyword` or `.string` | `#569cd6` or `#ce9178` | `"text"`, `'text'` |

### Python Keywords List
```python
# Control flow
if, elif, else, for, while, break, continue, pass, return

# Function/class definition
def, class, lambda

# Boolean/None
True, False, None

# Import
import, from, as

# Exception handling
try, except, finally, raise

# Context managers
with, as

# Other
in, is, and, or, not, yield, global, nonlocal, assert, del
```

### Common Python Patterns in Ride-Sharing Context
```python
# Class definition (KD-Tree node)
class KDNode:
    def __init__(self, point, axis):
        self.point = point
        self.axis = axis

# Function definition (matching algorithm)
def match_riders(riders, drivers):
    matches = []
    return matches

# List comprehension (filtering)
available = [d for d in drivers if d.is_available]

# Dictionary access (rider attributes)
distance = euclidean_distance(rider['lat'], rider['lon'], driver['lat'], driver['lon'])

# NetworkX graph operations (Dijkstra)
import networkx as nx
path = nx.dijkstra_path(graph, source, target)
```

## Algorithm-Specific Research Findings

### Ride-Sharing Matching Algorithms
**Problem:** Match riders with nearby available drivers in real-time
**Spatial Indexing:** Geohash, R-tree, or KD-tree for O(log n) nearest-neighbor queries
**Optimization Goals:** Minimize D1 (average distance) and D2 (maximum distance)
**Source:** [How Uber Finds Nearby Drivers at 1 Million Requests per Second](https://www.geeksforgeeks.org/system-design/how-uber-finds-nearby-drivers-at-1-million-requests-per-second/), [SHAREK*: A Scalable Matching Method for Dynamic Ride Sharing](https://link.springer.com/article/10.1007/s10707-020-00411-0)

### KD-Tree Implementation
**Library:** `scipy.spatial.KDTree` or custom implementation
**Construction:** O(n log n) - recursive median splitting
**Query:** O(log n) average case for nearest neighbor
**Pitfall:** Performance degrades to O(n) in high dimensions (curse of dimensionality)
**Source:** [SciPy KDTree Documentation](https://docs.scipy.org/doc/scipy/reference/generated/scipy.spatial.KDTree.html), [scikit-learn KDTree Documentation](https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KDTree.html)

### Dijkstra Pathfinding
**Library:** `networkx.dijkstra_path()` or `networkx.single_source_dijkstra()`
**Graph Structure:** Nodes = intersections, Edges = road segments with weights
**Edge Weights:** Haversine distance or travel time
**Constraints:** Only works with non-negative edge weights
**Source:** [NetworkX dijkstra_path Documentation](https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.shortest_paths.weighted.dijkstra_path.html), [Visualizing Dijkstra's Algorithm with NetworkX](https://medium.com/@storiesofsrinidhi/visualizing-dijkstras-algorithm-with-networkx-and-matplotlib-a7a375fd0731)

### Performance Metrics
**D1 (average distance):** Mean distance across all rider-driver matches
**D2 (maximum distance):** Worst-case distance for any match
**Visualization:** Matplotlib comparison graphs stored in `public/projects/cs330/images/`
**Tool:** `scikit-plot` for metric visualization, matplotlib for custom graphs
**Source:** [Scikit-Plot Documentation](https://coderzcolumn.com/tutorials/machine-learning/scikit-plot-visualizing-machine-learning-algorithm-results-and-performance), [Matplotlib Performance Metrics](https://codezup.com/visualizing-performance-metrics-with-python-and-matplotlib/)

## Open Questions

1. **Algorithm Evolution Iteration Details**
   - What we know: T1-T5 progression from brute force to spatial indexing
   - What's unclear: Specific implementation details for T2, T3, T4 (intermediate steps)
   - Recommendation: User may have actual Python code from CS330 project - request access if needed

2. **Performance Graph Images**
   - What we know: D1/D2 metrics with comparison graphs
   - What's unclear: Whether matplotlib graphs already exist in a repository
   - Recommendation: Check if user has Python scripts that generated performance graphs, or create placeholder sections for graphs

3. **Bonus Algorithms Scope**
   - What we know: B1-B4 mentioned (load balancing, traffic modeling, predictive caching)
   - What's unclear: Full implementation details for bonus algorithms
   - Recommendation: Phase 17 focuses on core algorithms (T1-T5, KD-Tree, Dijkstra); Phase 18 likely covers bonus algorithms

## Sources

### Primary (HIGH confidence)
- Existing codebase patterns: `src/pages/cpu/CpuAluPage.jsx`, `src/pages/cpu/CpuMultdivPage.jsx`, `src/pages/cs330/Cs330DocsLanding.jsx`
- React Router documentation: Standard routing patterns used throughout portfolio
- Existing CSS patterns: Inline style tags, forest green design system, code block styling

### Secondary (MEDIUM confidence)
- [SciPy KDTree Documentation](https://docs.scipy.org/doc/scipy/reference/generated/scipy.spatial.KDTree.html) - KD-tree implementation reference
- [scikit-learn KDTree Documentation](https://scikit-learn.org/stable/modules/generated/sklearn.neighbors.KDTree.html) - Alternative KD-tree API
- [NetworkX dijkstra_path Documentation](https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.shortest_paths.weighted.dijkstra_path.html) - Dijkstra algorithm reference
- [Visualizing Dijkstra's Algorithm with NetworkX](https://medium.com/@storiesofsrinidhi/visualizing-dijkstras-algorithm-with-networkx-and-matplotlib-a7a375fd0731) - Implementation patterns
- [How Uber Finds Nearby Drivers](https://www.geeksforgeeks.org/system-design/how-uber-finds-nearby-drivers-at-1-million-requests-per-second/) - Spatial indexing in ride-sharing
- [SHAREK*: A Scalable Matching Method](https://link.springer.com/article/10.1007/s10707-020-00411-0) - Dynamic ride-sharing algorithms
- [Scikit-Plot Documentation](https://coderzcolumn.com/tutorials/machine-learning/scikit-plot-visualizing-machine-learning-algorithm-results-and-performance) - Performance metric visualization
- [Pygments Documentation](https://pygments.org/docs/quickstart/) - Python syntax highlighting reference (not used, but informative)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All patterns established in existing codebase
- Architecture: HIGH - Clear patterns from CPU/Graphics documentation pages
- Pitfalls: HIGH - Based on actual implementation patterns in codebase

**Research date:** 2026-02-18
**Valid until:** 60 days (stable patterns, unlikely to change)
