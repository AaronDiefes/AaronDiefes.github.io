# Phase 18: Performance Analysis Documentation - Research

**Researched:** 2026-02-26
**Domain:** Performance analysis documentation, matplotlib visualization, algorithm comparison presentation
**Confidence:** HIGH

## Summary

Phase 18 focuses on creating a comprehensive Performance Analysis documentation page that visualizes algorithm performance through D1/D2 time series graphs, supply-demand scatter plots, and algorithm comparison tables. This phase builds on the established CS330 documentation patterns from Phases 16-17, adding quantitative performance metrics and visual evidence of algorithm evolution from T1-T5.

The key challenge is presenting matplotlib-generated graphs in a React documentation page while maintaining the portfolio's forest green design system and responsive layout. The page must combine static images (performance graphs) with interactive documentation content (algorithm comparison tables, metric explanations) to provide both visual and analytical insight into algorithm performance.

**Primary recommendation:** Store matplotlib graphs as PNG files in `public/projects/cs330/images/`, use standard HTML `<img>` tags with responsive CSS, present D1/D2 metrics in time series line graphs comparing T1-T5, create supply-demand scatter plots with color-coded markers, and use HTML tables with forest green styling for algorithm comparison metrics.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 18.x | UI framework | Portfolio standard (all pages) |
| React Router | 6.x | Client-side routing | Portfolio standard for navigation |
| Matplotlib | 3.10.x | Graph generation | Python standard for scientific visualization |
| Python | 3.11+ | Graph generation script | CS330 project language |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| NumPy | Latest | Data manipulation for graphs | Generating performance data arrays |
| Pandas | Latest | Data processing | If performance data comes from CSV/tabular format |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Matplotlib (static PNG) | D3.js (interactive) | D3 requires JavaScript rewrite, adds complexity; static graphs sufficient for documentation |
| PNG format | SVG format | SVG scales better but larger file size; PNG adequate for docs at high DPI |
| HTML tables | Data visualization libraries | Tables clearer for discrete metric comparison; charts better for trends |

**Installation:**
```bash
# For React development (already installed)
npm install react react-router-dom

# For Python graph generation (separate script)
pip install matplotlib numpy pandas
```

## Architecture Patterns

### Recommended Project Structure
```
public/projects/cs330/
├── images/                         # Matplotlib-generated graphs
│   ├── d1_time_series.png         # D1 (avg distance) over T1-T5
│   ├── d2_time_series.png         # D2 (max distance) over T1-T5
│   ├── supply_demand_t1.png       # Supply-demand scatter for T1
│   ├── supply_demand_t5.png       # Supply-demand scatter for T5
│   └── algorithm_comparison.png   # Optional: visual complexity chart

src/pages/cs330/
├── Cs330DocsLanding.jsx           # Landing page (existing)
├── Cs330AlgorithmPage.jsx         # Algorithm Evolution (existing)
├── Cs330KdtreePage.jsx            # KD-Tree docs (existing)
├── Cs330PathfindingPage.jsx      # Pathfinding docs (existing)
└── Cs330PerformancePage.jsx      # NEW: Performance Analysis
```

### Pattern 1: Static Graph Embedding in React
**What:** Store matplotlib graphs as static PNG files in `public/`, reference via standard `<img>` tags
**When to use:** Documentation pages where graphs illustrate algorithm performance (not interactive demos)
**Example:**
```jsx
// Source: Established portfolio pattern for static assets
<section className="section">
  <h2>D1 Performance Comparison</h2>
  <p>
    The following graph shows average match distance (D1) across algorithms T1-T5.
    Lower values indicate better overall efficiency.
  </p>
  <img
    src="/projects/cs330/images/d1_time_series.png"
    alt="D1 time series comparing T1-T5 algorithms"
    style={{
      width: '100%',
      maxWidth: '800px',
      height: 'auto',
      margin: '2rem auto',
      display: 'block',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}
  />
</section>
```

### Pattern 2: Matplotlib Graph Generation Script
**What:** Separate Python script generates performance graphs from algorithm run data
**When to use:** One-time graph generation for documentation (not real-time visualization)
**Example:**
```python
# Source: Matplotlib official documentation + best practices
import matplotlib.pyplot as plt
import numpy as np

# Set consistent style matching portfolio design
plt.style.use('seaborn-v0_8-darkgrid')
plt.rcParams['figure.figsize'] = (10, 6)
plt.rcParams['axes.labelsize'] = 12
plt.rcParams['axes.titlesize'] = 14
plt.rcParams['xtick.labelsize'] = 10
plt.rcParams['ytick.labelsize'] = 10

# D1 time series data (example)
algorithms = ['T1\nBrute Force', 'T2\nSorted', 'T3\nGrid', 'T4\nKD-Tree', 'T5\nKD+Dijkstra']
d1_values = [2.45, 2.38, 1.95, 1.82, 1.65]  # Average distances

# Create line graph with markers
fig, ax = plt.subplots()
ax.plot(algorithms, d1_values, marker='o', linewidth=2,
        markersize=8, color='#2E7D32', label='D1 (Avg Distance)')
ax.set_xlabel('Algorithm', fontweight='bold')
ax.set_ylabel('Average Match Distance (km)', fontweight='bold')
ax.set_title('D1 Performance Evolution: T1-T5', fontweight='bold', pad=20)
ax.grid(True, alpha=0.3)
ax.legend()

# Save as high-DPI PNG for web
plt.tight_layout()
plt.savefig('public/projects/cs330/images/d1_time_series.png',
            dpi=150, bbox_inches='tight', facecolor='white')
plt.close()
```

### Pattern 3: Supply-Demand Scatter Plot
**What:** Spatial scatter plot showing rider locations (demand) and driver locations (supply)
**When to use:** Visualizing spatial distribution to illustrate why spatial indexing matters
**Example:**
```python
# Source: Matplotlib scatter plot + geospatial visualization patterns
import matplotlib.pyplot as plt
import numpy as np

# Generate sample data (or load from algorithm run)
np.random.seed(42)
riders_lat = np.random.uniform(40.70, 40.80, 100)   # Demand
riders_lon = np.random.uniform(-74.02, -73.92, 100)
drivers_lat = np.random.uniform(40.70, 40.80, 50)   # Supply
drivers_lon = np.random.uniform(-74.02, -73.92, 50)

fig, ax = plt.subplots(figsize=(10, 8))

# Plot demand (riders) in red
ax.scatter(riders_lon, riders_lat, c='#d32f2f', marker='o',
           s=50, alpha=0.6, label='Riders (Demand)', edgecolors='black', linewidth=0.5)

# Plot supply (drivers) in forest green (portfolio color)
ax.scatter(drivers_lon, drivers_lat, c='#2E7D32', marker='^',
           s=100, alpha=0.8, label='Drivers (Supply)', edgecolors='black', linewidth=0.5)

ax.set_xlabel('Longitude', fontweight='bold')
ax.set_ylabel('Latitude', fontweight='bold')
ax.set_title('Supply-Demand Spatial Distribution (T1 Brute Force)',
             fontweight='bold', pad=20)
ax.legend(loc='upper right')
ax.grid(True, alpha=0.3)

plt.tight_layout()
plt.savefig('public/projects/cs330/images/supply_demand_t1.png',
            dpi=150, bbox_inches='tight', facecolor='white')
plt.close()
```

### Pattern 4: Algorithm Comparison Table
**What:** HTML table with algorithm metrics (time complexity, D1, D2, runtime)
**When to use:** Presenting discrete metrics for side-by-side algorithm comparison
**Example:**
```jsx
// Source: Established CS330 documentation pattern
<section className="section">
  <h2>Algorithm Performance Summary</h2>
  <p>
    The following table compares key performance metrics across all five algorithms.
    Complexity is theoretical worst-case, while D1/D2 are measured from 1,000
    rider/driver simulation runs.
  </p>

  <table style={{
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '2rem'
  }}>
    <thead>
      <tr style={{
        background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)',
        color: 'white'
      }}>
        <th style={{ padding: '1rem', textAlign: 'left' }}>Algorithm</th>
        <th style={{ padding: '1rem', textAlign: 'left' }}>Complexity</th>
        <th style={{ padding: '1rem', textAlign: 'center' }}>D1 (km)</th>
        <th style={{ padding: '1rem', textAlign: 'center' }}>D2 (km)</th>
        <th style={{ padding: '1rem', textAlign: 'center' }}>Runtime (ms)</th>
      </tr>
    </thead>
    <tbody>
      <tr style={{ borderBottom: '1px solid #ddd' }}>
        <td style={{ padding: '1rem' }}>T1: Brute Force</td>
        <td style={{ padding: '1rem' }}>O(n × m)</td>
        <td style={{ padding: '1rem', textAlign: 'center' }}>2.45</td>
        <td style={{ padding: '1rem', textAlign: 'center' }}>5.82</td>
        <td style={{ padding: '1rem', textAlign: 'center' }}>1250</td>
      </tr>
      {/* ...additional rows... */}
    </tbody>
  </table>
</section>
```

### Pattern 5: Responsive Image Styling
**What:** CSS rules ensuring graphs display well on all screen sizes
**When to use:** All embedded matplotlib graphs in documentation
**Example:**
```jsx
// Source: Portfolio responsive design patterns
<style>{`
  .performance-graph {
    width: 100%;
    max-width: 800px;
    height: auto;
    margin: 2rem auto;
    display: block;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }

  .performance-graph-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 2rem;
    margin: 2rem 0;
  }

  .performance-graph-grid img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  }

  @media (max-width: 768px) {
    .performance-graph-grid {
      grid-template-columns: 1fr;
    }
  }
`}</style>
```

### Anti-Patterns to Avoid
- **Don't embed base64-encoded images inline:** Bloats HTML, not cacheable, poor performance
- **Don't use low-DPI graphs:** Save at 150+ DPI for crisp display on retina screens
- **Don't hardcode pixel dimensions:** Use responsive CSS (max-width, percentage widths)
- **Don't generate graphs on page load:** Pre-generate and store as static assets
- **Don't use interactive charting libraries for docs:** Adds JavaScript bundle bloat for minimal benefit

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Graph generation | Custom SVG/Canvas renderer | Matplotlib | Industry-standard scientific visualization, proven API, extensive documentation |
| Data visualization | Custom plotting from scratch | Matplotlib + NumPy | Handles edge cases (scaling, axes, labels, legends), production-tested |
| Image optimization | Manual image compression | matplotlib savefig with DPI | Built-in optimization, consistent output quality |
| Responsive images | JavaScript resize logic | CSS max-width + height: auto | Native browser support, no JavaScript overhead |
| Table styling | Complex CSS frameworks | Inline styles matching design system | Keeps documentation self-contained, matches existing CS330 pages |

**Key insight:** Performance documentation is about clarity and evidence, not interactivity. Static matplotlib graphs (saved as PNG) provide professional-quality visualizations without JavaScript complexity. Focus effort on clear metric explanations and algorithm insights, not recreating matplotlib in JavaScript.

## Common Pitfalls

### Pitfall 1: Low-Resolution Graphs
**What goes wrong:** Graphs saved at default 72-80 DPI appear blurry on high-resolution displays
**Why it happens:** Matplotlib defaults to screen resolution, but web images need higher DPI for retina displays
**How to avoid:** Always use `dpi=150` or higher in `plt.savefig()` for web display
**Warning signs:** Graphs look sharp in Python but fuzzy when embedded in web page

### Pitfall 2: Inconsistent Graph Styling
**What goes wrong:** Graphs use different colors, fonts, sizes across D1/D2/scatter plots
**Why it happens:** Each matplotlib script uses different rcParams or style settings
**How to avoid:** Create shared configuration at top of graph generation script, use portfolio colors (#2E7D32)
**Warning signs:** Graphs feel like they're from different projects

### Pitfall 3: Hardcoded Absolute Paths in img src
**What goes wrong:** Images don't load after deployment or on different machines
**Why it happens:** Using local filesystem paths instead of public URL paths
**How to avoid:** Always use paths relative to `public/` directory (e.g., `/projects/cs330/images/d1.png`)
**Warning signs:** Images work in dev but break in production build

### Pitfall 4: Missing alt Text for Graphs
**What goes wrong:** Screen readers can't describe graphs, poor accessibility, bad SEO
**Why it happens:** Forgetting that images need descriptive alt attributes
**How to avoid:** Write descriptive alt text explaining what the graph shows (e.g., "Line graph showing D1 average match distance decreasing from T1 to T5")
**Warning signs:** Image tags without alt attributes, accessibility warnings

### Pitfall 5: Overcomplicated Comparison Tables
**What goes wrong:** Tables with too many metrics, hard to scan, cognitive overload
**Why it happens:** Trying to show every possible metric in one table
**How to avoid:** Focus on 4-6 key metrics (algorithm name, complexity, D1, D2, runtime), add detail in prose
**Warning signs:** Tables wider than viewport, horizontal scrolling required

### Pitfall 6: Not Explaining Metrics Before Showing Graphs
**What goes wrong:** Readers see graphs but don't understand what D1/D2 represent
**Why it happens:** Assuming prior knowledge from Algorithm Evolution page
**How to avoid:** Add "Metrics Overview" section defining D1 (average distance) and D2 (maximum distance) before graphs
**Warning signs:** Graph section lacks context, metrics not defined on page

## Code Examples

Verified patterns from official sources and existing CS330 pages:

### Complete Python Graph Generation Script
```python
# Source: Matplotlib documentation + scientific visualization best practices
"""
Performance graph generation for CS330 Case Study
Generates D1/D2 time series and supply-demand scatter plots
Run once to generate static images for documentation
"""

import matplotlib.pyplot as plt
import numpy as np

# Configure matplotlib for consistent styling
plt.style.use('seaborn-v0_8-whitegrid')
plt.rcParams['figure.figsize'] = (10, 6)
plt.rcParams['font.size'] = 11
plt.rcParams['axes.labelsize'] = 12
plt.rcParams['axes.titlesize'] = 14
plt.rcParams['legend.fontsize'] = 10

# Portfolio color scheme
PORTFOLIO_GREEN = '#2E7D32'
PORTFOLIO_DARK_GREEN = '#1B5E20'
DEMAND_RED = '#d32f2f'

# Algorithm data (replace with actual measurement data)
algorithms = ['T1', 'T2', 'T3', 'T4', 'T5']
algorithm_labels = [
    'T1\nBrute Force',
    'T2\nSorted',
    'T3\nGrid',
    'T4\nKD-Tree',
    'T5\nKD+Dijkstra'
]

# D1 metric: average match distance (km)
d1_values = [2.45, 2.38, 1.95, 1.82, 1.65]

# D2 metric: maximum match distance (km)
d2_values = [5.82, 5.65, 4.20, 3.95, 3.45]

# Runtimes (milliseconds for 1000 riders/drivers)
runtimes = [1250, 980, 450, 180, 320]

def generate_d1_graph():
    """Generate D1 time series line graph"""
    fig, ax = plt.subplots()

    ax.plot(algorithm_labels, d1_values,
            marker='o', linewidth=2.5, markersize=10,
            color=PORTFOLIO_GREEN, label='D1 (Average Distance)')

    ax.set_xlabel('Algorithm', fontweight='bold')
    ax.set_ylabel('Average Match Distance (km)', fontweight='bold')
    ax.set_title('D1 Performance Evolution: Algorithm Comparison',
                 fontweight='bold', pad=20)
    ax.grid(True, alpha=0.3, linestyle='--')
    ax.legend()

    # Annotate values on points
    for i, (label, value) in enumerate(zip(algorithm_labels, d1_values)):
        ax.annotate(f'{value:.2f}',
                   xy=(i, value),
                   xytext=(0, 10),
                   textcoords='offset points',
                   ha='center',
                   fontsize=9,
                   bbox=dict(boxstyle='round,pad=0.3',
                            facecolor='white',
                            edgecolor=PORTFOLIO_GREEN,
                            alpha=0.8))

    plt.tight_layout()
    plt.savefig('public/projects/cs330/images/d1_time_series.png',
                dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    print("✓ Generated d1_time_series.png")

def generate_d2_graph():
    """Generate D2 time series line graph"""
    fig, ax = plt.subplots()

    ax.plot(algorithm_labels, d2_values,
            marker='s', linewidth=2.5, markersize=10,
            color=PORTFOLIO_DARK_GREEN, label='D2 (Maximum Distance)')

    ax.set_xlabel('Algorithm', fontweight='bold')
    ax.set_ylabel('Maximum Match Distance (km)', fontweight='bold')
    ax.set_title('D2 Performance Evolution: Algorithm Comparison',
                 fontweight='bold', pad=20)
    ax.grid(True, alpha=0.3, linestyle='--')
    ax.legend()

    # Annotate values
    for i, (label, value) in enumerate(zip(algorithm_labels, d2_values)):
        ax.annotate(f'{value:.2f}',
                   xy=(i, value),
                   xytext=(0, 10),
                   textcoords='offset points',
                   ha='center',
                   fontsize=9,
                   bbox=dict(boxstyle='round,pad=0.3',
                            facecolor='white',
                            edgecolor=PORTFOLIO_DARK_GREEN,
                            alpha=0.8))

    plt.tight_layout()
    plt.savefig('public/projects/cs330/images/d2_time_series.png',
                dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    print("✓ Generated d2_time_series.png")

def generate_combined_graph():
    """Generate combined D1 + D2 comparison graph"""
    fig, ax = plt.subplots()

    x = np.arange(len(algorithms))
    width = 0.35

    bars1 = ax.bar(x - width/2, d1_values, width,
                   label='D1 (Avg)', color=PORTFOLIO_GREEN, alpha=0.8)
    bars2 = ax.bar(x + width/2, d2_values, width,
                   label='D2 (Max)', color=PORTFOLIO_DARK_GREEN, alpha=0.8)

    ax.set_xlabel('Algorithm', fontweight='bold')
    ax.set_ylabel('Distance (km)', fontweight='bold')
    ax.set_title('D1 vs D2 Performance Comparison', fontweight='bold', pad=20)
    ax.set_xticks(x)
    ax.set_xticklabels(algorithm_labels)
    ax.legend()
    ax.grid(True, alpha=0.3, axis='y', linestyle='--')

    plt.tight_layout()
    plt.savefig('public/projects/cs330/images/d1_d2_combined.png',
                dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    print("✓ Generated d1_d2_combined.png")

def generate_supply_demand_scatter():
    """Generate supply-demand spatial distribution scatter plot"""
    np.random.seed(42)

    # Simulate NYC coordinates (Manhattan area)
    riders_lat = np.random.uniform(40.70, 40.80, 100)
    riders_lon = np.random.uniform(-74.02, -73.92, 100)
    drivers_lat = np.random.uniform(40.70, 40.80, 50)
    drivers_lon = np.random.uniform(-74.02, -73.92, 50)

    fig, ax = plt.subplots(figsize=(10, 8))

    # Plot riders (demand)
    ax.scatter(riders_lon, riders_lat,
              c=DEMAND_RED, marker='o', s=60, alpha=0.6,
              label='Riders (Demand)', edgecolors='black', linewidth=0.5)

    # Plot drivers (supply)
    ax.scatter(drivers_lon, drivers_lat,
              c=PORTFOLIO_GREEN, marker='^', s=120, alpha=0.8,
              label='Drivers (Supply)', edgecolors='black', linewidth=0.5)

    ax.set_xlabel('Longitude', fontweight='bold')
    ax.set_ylabel('Latitude', fontweight='bold')
    ax.set_title('Supply-Demand Spatial Distribution', fontweight='bold', pad=20)
    ax.legend(loc='upper right', fontsize=11)
    ax.grid(True, alpha=0.3, linestyle='--')

    plt.tight_layout()
    plt.savefig('public/projects/cs330/images/supply_demand_distribution.png',
                dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    print("✓ Generated supply_demand_distribution.png")

def generate_runtime_graph():
    """Generate runtime comparison bar chart"""
    fig, ax = plt.subplots()

    colors = [PORTFOLIO_GREEN if runtime < 500 else '#f57c00'
              for runtime in runtimes]
    bars = ax.bar(algorithm_labels, runtimes, color=colors, alpha=0.8)

    ax.set_xlabel('Algorithm', fontweight='bold')
    ax.set_ylabel('Runtime (milliseconds)', fontweight='bold')
    ax.set_title('Algorithm Runtime Comparison (1000 riders/drivers)',
                 fontweight='bold', pad=20)
    ax.grid(True, alpha=0.3, axis='y', linestyle='--')

    # Add value labels on bars
    for bar in bars:
        height = bar.get_height()
        ax.annotate(f'{height:.0f}ms',
                   xy=(bar.get_x() + bar.get_width() / 2, height),
                   xytext=(0, 5),
                   textcoords='offset points',
                   ha='center', va='bottom',
                   fontsize=9,
                   fontweight='bold')

    plt.tight_layout()
    plt.savefig('public/projects/cs330/images/runtime_comparison.png',
                dpi=150, bbox_inches='tight', facecolor='white')
    plt.close()
    print("✓ Generated runtime_comparison.png")

if __name__ == '__main__':
    print("Generating performance analysis graphs...")
    generate_d1_graph()
    generate_d2_graph()
    generate_combined_graph()
    generate_supply_demand_scatter()
    generate_runtime_graph()
    print("\n✅ All graphs generated successfully!")
    print("Location: public/projects/cs330/images/")
```

### React Performance Page Component Structure
```jsx
// Source: Established CS330 documentation pattern
import React from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../../components/shared/Breadcrumbs'

function Cs330PerformancePage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'CS330 Case Study', href: '/projects/cs330/docs' },
    { label: 'Documentation', href: '/projects/cs330/docs' },
    { label: 'Performance Analysis' }
  ]

  return (
    <div>
      <style>{`
        /* Reuse established CS330 page styles */
        .landing-header {
          background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
          color: white;
          padding: 4rem 2rem 3rem;
          text-align: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .performance-graph {
          width: 100%;
          max-width: 800px;
          height: auto;
          margin: 2rem auto;
          display: block;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .metric-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          background: #e8f5e9;
          color: #2E7D32;
          border-radius: 6px;
          font-weight: 600;
          margin: 0.5rem;
        }

        .comparison-table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
        }

        .comparison-table thead tr {
          background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
          color: white;
        }

        .comparison-table th,
        .comparison-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }

        .comparison-table tbody tr:hover {
          background: #f5f5f5;
        }
      `}</style>

      <Breadcrumbs items={breadcrumbItems} />

      <header className="landing-header">
        <h1>Performance Analysis</h1>
        <p>D1/D2 Metrics, Algorithm Benchmarks, and Spatial Visualizations</p>
      </header>

      <div className="container">
        {/* Metrics Overview Section */}
        <section className="section">
          <h2>Performance Metrics</h2>
          <p>
            We evaluate algorithm performance using two primary metrics:
          </p>
          <ul>
            <li>
              <strong>D1 (Average Match Distance):</strong> The mean distance
              across all rider-driver matches. Lower D1 indicates better overall
              system efficiency - riders are matched with nearby drivers on average.
            </li>
            <li>
              <strong>D2 (Maximum Match Distance):</strong> The longest distance
              any rider has to their matched driver. Lower D2 indicates better
              fairness - no rider is unfairly matched to a far-away driver while
              closer drivers are available.
            </li>
          </ul>
          <p>
            Additional metrics include <strong>runtime</strong> (wall-clock execution
            time) and <strong>theoretical complexity</strong> (big-O notation).
          </p>
        </section>

        {/* D1 Analysis Section */}
        <section className="section">
          <h2>D1: Average Match Distance</h2>
          <p>
            The following graph shows D1 (average match distance) evolution from
            T1 to T5. Notice the significant improvement from T2 to T3 (grid
            partitioning) and T4 to T5 (road network distance).
          </p>
          <img
            src="/projects/cs330/images/d1_time_series.png"
            alt="Line graph showing D1 average match distance decreasing from T1 (2.45km) to T5 (1.65km)"
            className="performance-graph"
          />
          <p>
            <strong>Key Insight:</strong> Spatial indexing (T3-T4) reduces D1 by
            finding geometrically closer matches, while road network distance (T5)
            further refines matches by accounting for actual driving distance, not
            just straight-line distance.
          </p>
        </section>

        {/* Algorithm Comparison Table Section */}
        <section className="section">
          <h2>Algorithm Performance Summary</h2>
          <table className="comparison-table">
            <thead>
              <tr>
                <th>Algorithm</th>
                <th>Complexity</th>
                <th>D1 (km)</th>
                <th>D2 (km)</th>
                <th>Runtime (ms)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>T1: Brute Force</td>
                <td>O(n × m)</td>
                <td>2.45</td>
                <td>5.82</td>
                <td>1250</td>
              </tr>
              {/* Additional rows */}
            </tbody>
          </table>
        </section>

        {/* Explore Further Section */}
        <section className="section">
          <h2>Explore Further</h2>
          <div className="quick-links">
            <Link to="/projects/cs330/docs/algorithm" className="quick-link">
              Algorithm Evolution →
            </Link>
            <Link to="/projects/cs330/docs" className="quick-link">
              Back to CS330 Documentation →
            </Link>
          </div>
        </section>
      </div>

      {/* Footer (reuse existing pattern) */}
    </div>
  )
}

export default Cs330PerformancePage
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Interactive D3.js charts | Static matplotlib PNG graphs | 2024+ | Simpler deployment, faster page load, adequate for documentation (non-interactive use case) |
| Client-side graph generation | Pre-generated static images | Ongoing | Eliminates runtime overhead, consistent appearance, cacheable assets |
| SVG for all graphs | PNG at high DPI (150+) | 2023+ | Smaller file sizes, faster rendering, retina-quality display |
| Complex comparison UI | Simple HTML tables | Ongoing | Clearer metric comparison, accessible, responsive without JavaScript |
| Embedded base64 images | External image files | Best practice | Cacheable, smaller HTML size, better browser optimization |

**Deprecated/outdated:**
- **Low-DPI graphs (72-96 DPI):** Blurry on modern displays; use 150+ DPI
- **Inline styles in string attributes:** React prefers style objects (e.g., `style={{ width: '100%' }}`)
- **matplotlib seaborn-darkgrid style:** Use `seaborn-v0_8-whitegrid` (versioned style name)

## Open Questions

1. **Should performance graphs include error bars or confidence intervals?**
   - What we know: D1/D2 are point estimates from single simulation runs
   - What's unclear: Whether multiple runs with statistical analysis would strengthen documentation
   - Recommendation: Start with point estimates; add error bars if data shows significant variance

2. **PNG vs SVG for web embedding?**
   - What we know: PNG at 150 DPI adequate for docs, smaller file size; SVG scales infinitely but larger
   - What's unclear: User preference for zooming into graphs
   - Recommendation: Use PNG (matches existing portfolio pattern); can regenerate as SVG if users request

3. **Should supply-demand scatter plots show matched connections?**
   - What we know: Lines connecting riders to matched drivers would illustrate matching quality
   - What's unclear: Whether this adds clarity or visual clutter
   - Recommendation: Start without connection lines (clearer spatial distribution); add as optional "with matches" variant if useful

4. **Real data vs simulated data?**
   - What we know: Phase 18 focuses on documentation structure; actual CS330 algorithm implementation separate
   - What's unclear: Whether user has real performance data or needs simulated data for graphs
   - Recommendation: Use placeholder/simulated data for graph generation script; user can replace with actual data

## Sources

### Primary (HIGH confidence)
- [Matplotlib Official Documentation - savefig](https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.savefig.html) - Graph export formats and DPI settings
- [Matplotlib Performance Best Practices](https://matplotlib.org/stable/users/explain/artists/performance.html) - Rendering optimization and output formats
- Existing CS330 pages (Cs330AlgorithmPage.jsx, Cs330PathfindingPage.jsx) - Established patterns for inline styles, code blocks, tables
- Portfolio CLAUDE.md - Project structure, routing patterns, design system colors

### Secondary (MEDIUM confidence)
- [Scientific Computing - Best Practices for Matplotlib](https://www.scivision.dev/best-practices-for-matplotlib-plots/) - Visualization guidelines
- [GeeksforGeeks - Matplotlib Scatter Plots](https://www.geeksforgeeks.org/python/python_ml_scatterplot/) - Spatial visualization examples
- [Machine Learning Plus - Top 50 Matplotlib Visualizations](https://www.machinelearningplus.com/plots/top-50-matplotlib-visualizations-the-master-plots-python/) - Performance graph examples
- [Big-O Cheat Sheet](https://www.bigocheatsheet.com/) - Algorithm complexity reference for comparison tables

### Tertiary (LOW confidence)
- [Medium - Visualizing Algorithm Runtimes](https://dev.to/chroline/visualizing-algorithm-runtimes-in-python-f92) - Performance comparison examples (not verified with official docs)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - React/matplotlib are established portfolio/Python standards
- Architecture: HIGH - Patterns verified from existing CS330 pages and matplotlib docs
- Graph generation: HIGH - Matplotlib official documentation and scientific visualization best practices
- Image embedding: HIGH - Standard HTML/CSS patterns verified from existing pages
- Pitfalls: HIGH - Based on common web development issues (DPI, responsive images, accessibility)

**Research date:** 2026-02-26
**Valid until:** 60 days (stable domain - matplotlib API stable, React patterns established)
