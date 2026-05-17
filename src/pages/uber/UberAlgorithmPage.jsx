import React from 'react'
import { Link } from 'react-router-dom'
import DocsLayout from '../../components/docs/DocsLayout'
import DocsSection from '../../components/docs/DocsSection'

const TOC = [
  { id: 'overview', label: 'Overview', level: 2 },
  { id: 'synthetic-dataset', label: 'Synthetic Dataset', level: 2 },
  { id: 't1-brute-force', label: 'T1: Brute Force', level: 2 },
  { id: 't2-sorted-distance-optimization', label: 'T2: Sorted Distance Optimization', level: 2 },
  { id: 't3-grid-based-spatial-partitioning', label: 'T3: Grid-Based Spatial Partitioning', level: 2 },
  { id: 't4-kd-tree-nearest-neighbor', label: 'T4: KD-Tree Nearest Neighbor', level: 2 },
  { id: 't5-kd-tree-dijkstra-road-network', label: 'T5: KD-Tree + Dijkstra Road Network', level: 2 },
  { id: 'multiprocessing-optimization', label: 'Multiprocessing Optimization', level: 2 },
  { id: 'performance-comparison', label: 'Performance Comparison', level: 2 }
]

function UberAlgorithmPage() {
  return (
    <DocsLayout
      project="uber"
      currentSlug="algorithm"
      title="Algorithm Evolution"
      subtitle="T1-T5 Progressive Optimization for Ride-Sharing Matching"
      tocItems={TOC}
    >
      <style>{`
        /* Page-specific content styles only — layout chrome comes from docs-layout.css */
        .docs-layout .docs-content h3 {
            color: #2c3e50;
            margin-top: 2rem;
            margin-bottom: 1rem;
            font-size: 1.5rem;
        }

        .docs-layout .docs-content p {
            margin-bottom: 1rem;
            line-height: 1.8;
            color: #555;
        }

        .docs-layout .docs-content ul {
            margin-bottom: 1rem;
            line-height: 1.8;
            color: #555;
            padding-left: 2rem;
        }

        .docs-layout .docs-content li {
            margin-bottom: 0.5rem;
        }

        .docs-layout .docs-content .code-block {
            background: #1e1e1e;
            color: #d4d4d4;
            padding: 1.5rem;
            border-radius: 8px;
            overflow-x: auto;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 0.9rem;
            line-height: 1.6;
            margin: 1.5rem 0;
        }

        .docs-layout .docs-content .code-block .keyword { color: #569cd6; }
        .docs-layout .docs-content .code-block .comment { color: #6a9955; }
        .docs-layout .docs-content .code-block .signal { color: #9cdcfe; }
        .docs-layout .docs-content .code-block .operator { color: #d4d4d4; }
        .docs-layout .docs-content .code-block .number { color: #b5cea8; }
        .docs-layout .docs-content .code-block .string { color: #ce9178; }

        .docs-layout .docs-content .complexity-badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            background: #e8f5e9;
            color: #2E7D32;
            border-radius: 4px;
            font-weight: 600;
            font-size: 0.9rem;
            margin-left: 0.5rem;
        }

        .docs-layout .docs-content .performance-results {
          margin: 2rem 0;
          padding: 1.5rem;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #2E7D32;
        }

        .docs-layout .docs-content .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .docs-layout .docs-content .metric-card {
          background: white;
          padding: 1rem;
          border-radius: 6px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .docs-layout .docs-content .metric-label {
          display: block;
          font-weight: 600;
          color: #2E7D32;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .docs-layout .docs-content .metric-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #2c3e50;
        }

        .docs-layout .docs-content .performance-graph {
          width: 100%;
          max-width: 800px;
          height: auto;
          margin: 1rem auto;
          display: block;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .docs-layout .docs-content .graph-caption {
          text-align: center;
          font-style: italic;
          color: #666;
          margin-top: 0.5rem;
          font-size: 0.9rem;
        }

        .docs-layout .docs-content .comparison-table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .docs-layout .docs-content .comparison-table th {
          background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
          color: white;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
        }

        .docs-layout .docs-content .comparison-table td {
          padding: 1rem;
          border-bottom: 1px solid #e0e0e0;
          color: #2c3e50;
        }

        .docs-layout .docs-content .comparison-table tr:last-child td {
          border-bottom: none;
        }

        .docs-layout .docs-content .comparison-table tr:hover {
          background: #f8f9fa;
        }

        @media (max-width: 768px) {
          .docs-layout .docs-content .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .docs-layout .docs-content .comparison-table {
            font-size: 0.9rem;
          }

          .docs-layout .docs-content .comparison-table th,
          .docs-layout .docs-content .comparison-table td {
            padding: 0.75rem 0.5rem;
          }
        }
      `}</style>

      <DocsSection id="overview" title="Overview">
        <p>
          The <strong>ride-sharing matching problem</strong> is at the heart of platforms like Uber and Lyft: given a set of riders requesting rides and a set of available drivers, find the optimal rider-driver matches that minimize travel distance while ensuring fairness and efficiency.
        </p>
        <p>
          <strong>Performance Metrics (both in minutes):</strong>
        </p>
        <ul>
          <li><strong>D1 (Cumulative Passenger Time):</strong> Total time from passenger request to arrival. Formula: <code>(arrival_time - request_time).total_seconds() / 60</code>. Lower is better.</li>
          <li><strong>D2 (Driver Productivity):</strong> Difference between paid trip time and unpaid pickup time. Formula: <code>(trip_time - pickup_time) × 60</code>. Positive D2 = more paid time than unpaid (good). Negative D2 = more unpaid than paid (poor matching).</li>
        </ul>
        <p>
          This documentation follows a <strong>progressive optimization approach</strong>, evolving from a naive brute-force solution (T1) through increasingly sophisticated algorithms (T2-T5). Each iteration improves upon the previous in terms of time complexity, scalability, or accuracy.
        </p>

        <h3>Algorithm Summary</h3>
        <ul>
          <li><strong>T1 - Brute Force:</strong> Check every driver for every rider <span className="complexity-badge">O(n × m)</span></li>
          <li><strong>T2 - Sorted Distance:</strong> Pre-sort drivers, use early termination <span className="complexity-badge">O(n × m/k) avg</span></li>
          <li><strong>T3 - Grid Partitioning:</strong> Divide space into grid cells <span className="complexity-badge">O(n × k)</span></li>
          <li><strong>T4 - KD-Tree:</strong> Balanced tree for nearest-neighbor queries <span className="complexity-badge">O(n × log m)</span></li>
          <li><strong>T5 - KD-Tree + Dijkstra:</strong> Combine spatial indexing with road-network distance <span className="complexity-badge">O(n × (log m + E log V))</span></li>
        </ul>
      </DocsSection>

      <DocsSection id="synthetic-dataset" title="Synthetic Dataset">
        <p>
          All algorithms (T1-T5) are evaluated on a <strong>synthetic Manhattan ride-sharing dataset</strong> generated to simulate realistic taxi operations in NYC. The dataset provides consistent, reproducible performance benchmarks across all algorithms.
        </p>

        <h3>Dataset Specifications</h3>
        <div className="metrics-grid">
          <div className="metric-card" style={{ background: 'white' }}>
            <span className="metric-label">Passengers:</span>
            <span className="metric-value">10,000</span>
          </div>
          <div className="metric-card" style={{ background: 'white' }}>
            <span className="metric-label">Drivers:</span>
            <span className="metric-value">4,000</span>
          </div>
          <div className="metric-card" style={{ background: 'white' }}>
            <span className="metric-label">Road Network:</span>
            <span className="metric-value">600 nodes</span>
          </div>
          <div className="metric-card" style={{ background: 'white' }}>
            <span className="metric-label">Time Period:</span>
            <span className="metric-value">7 days</span>
          </div>
          <div className="metric-card" style={{ background: 'white' }}>
            <span className="metric-label">Geographic Area:</span>
            <span className="metric-value">Manhattan</span>
          </div>
          <div className="metric-card" style={{ background: 'white' }}>
            <span className="metric-label">Date Range:</span>
            <span className="metric-value">Jan 15-21, 2024</span>
          </div>
        </div>

        <h3>Dataset Generation</h3>
        <p>
          The dataset was synthetically generated to model realistic ride-sharing patterns in Manhattan:
        </p>
        <ul>
          <li><strong>Road Network:</strong> Manhattan grid structure (40.700-40.880°N, -74.020--73.970°W) with 600 intersection nodes connected by road segments. Note: The small graph size (600 nodes) makes pathfinding very fast (~0.5ms per call), which explains why algorithmic optimizations like A* vs Dijkstra show minimal practical difference.</li>
          <li><strong>Time-Varying Speeds:</strong> Edge weights vary by hour of day to simulate traffic patterns (rush hour: 10-20 mph, night: 30-40 mph)</li>
          <li><strong>Passenger Distribution:</strong> Concentrated during rush hours (7-9 AM: 30%, 5-7 PM: 30%) with realistic pickup/dropoff locations matching Manhattan taxi patterns</li>
          <li><strong>Driver Availability:</strong> Staggered entry times with 60% concentrated in midtown, 20% downtown, 20% uptown</li>
          <li><strong>Trip Distances:</strong> 40% short trips (&lt;2 km), 45% medium (2-5 km), 15% long (&gt;5 km)</li>
        </ul>

        <p>
          <strong>Why Synthetic Data?</strong> Synthetic data ensures reproducible benchmarks, avoids privacy concerns with real rider data, and allows controlled testing of edge cases. The dataset is large enough (10K passengers, 4K drivers) to demonstrate algorithmic differences while remaining computationally tractable.
        </p>
      </DocsSection>

      <DocsSection id="t1-brute-force" title="T1: Brute Force">
        <p>
          The simplest approach to the matching problem is to <strong>check every driver for every rider</strong>. For each rider, iterate through all available drivers, compute the Euclidean distance to each driver, and select the driver with the minimum distance. Once a driver is matched, mark them as unavailable for subsequent matches.
        </p>
        <p>
          <strong>Euclidean Distance Formula:</strong> For two points (lat1, lon1) and (lat2, lon2), the distance is computed as:
        </p>
        <pre className="code-block">
          <span className="signal">distance</span> <span className="operator">=</span> <span className="signal">sqrt</span>((<span className="signal">lat1</span> <span className="operator">-</span> <span className="signal">lat2</span>)<span className="operator">**</span><span className="number">2</span> <span className="operator">+</span> (<span className="signal">lon1</span> <span className="operator">-</span> <span className="signal">lon2</span>)<span className="operator">**</span><span className="number">2</span>)
        </pre>

        <h3>Python Implementation</h3>
        <pre className="code-block">
          <span className="keyword">def</span> <span className="signal">match_brute_force</span>(<span className="signal">riders</span>, <span className="signal">drivers</span>):<br/>
          &nbsp;&nbsp;<span className="signal">matches</span> <span className="operator">=</span> []<br/>
          &nbsp;&nbsp;<span className="signal">available_drivers</span> <span className="operator">=</span> <span className="signal">drivers</span>.<span className="signal">copy</span>()  <span className="comment"># Track which drivers are still available</span><br/>
          <br/>
          &nbsp;&nbsp;<span className="keyword">for</span> <span className="signal">rider</span> <span className="keyword">in</span> <span className="signal">riders</span>:<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">min_distance</span> <span className="operator">=</span> <span className="keyword">float</span>(<span className="string">'inf'</span>)  <span className="comment"># Initialize to infinity</span><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">best_driver</span> <span className="operator">=</span> <span className="keyword">None</span><br/>
          <br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">for</span> <span className="signal">driver</span> <span className="keyword">in</span> <span className="signal">available_drivers</span>:<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment"># Compute Euclidean distance between rider and driver</span><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">distance</span> <span className="operator">=</span> <span className="signal">sqrt</span>((<span className="signal">rider</span>.<span className="signal">lat</span> <span className="operator">-</span> <span className="signal">driver</span>.<span className="signal">lat</span>)<span className="operator">**</span><span className="number">2</span> <span className="operator">+</span><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(<span className="signal">rider</span>.<span className="signal">lon</span> <span className="operator">-</span> <span className="signal">driver</span>.<span className="signal">lon</span>)<span className="operator">**</span><span className="number">2</span>)<br/>
          <br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> <span className="signal">distance</span> <span className="operator">&lt;</span> <span className="signal">min_distance</span>:<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">min_distance</span> <span className="operator">=</span> <span className="signal">distance</span>  <span className="comment"># Update best distance found so far</span><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">best_driver</span> <span className="operator">=</span> <span className="signal">driver</span><br/>
          <br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">matches</span>.<span className="signal">append</span>((<span className="signal">rider</span>, <span className="signal">best_driver</span>))<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">available_drivers</span>.<span className="signal">remove</span>(<span className="signal">best_driver</span>)  <span className="comment"># Mark driver as matched</span><br/>
          <br/>
          &nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">matches</span>
        </pre>

        <h3>Performance Analysis</h3>
        <p>
          <strong>Time Complexity:</strong> O(n × m) where n is the number of riders and m is the number of drivers. For each of n riders, we check all m drivers.
        </p>
        <p>
          <strong>Space Complexity:</strong> O(m) for the list of available drivers.
        </p>
        <p>
          <strong>Scalability:</strong> For small datasets, this approach works fine and completes in milliseconds. However, for production-scale systems with thousands of drivers and riders, the quadratic growth becomes impractical. The number of distance calculations grows as n × m, making this infeasible for real-time matching at scale.
        </p>

        <h3>Experimental Results</h3>
        <div className="performance-results">
          <div className="metrics-grid">
            <div className="metric-card">
              <span className="metric-label">Average D1:</span>
              <span className="metric-value">1,051.85 min/ride</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Average D2:</span>
              <span className="metric-value">-314.32 min</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Runtime:</span>
              <span className="metric-value">10.8 s</span>
            </div>
          </div>

          <img
            src="/projects/uber/images/t1_d1_d2_plot.png"
            alt="T1 Brute Force D1 and D2 metrics over time from actual simulation run"
            className="performance-graph"
          />

          <p className="graph-caption">
            T1 brute-force matching results in negative D2 (drivers spend more time on unpaid pickups than paid trips). D1 (blue) = cumulative passenger time, D2 (orange) = driver productivity metric.
          </p>
        </div>
      </DocsSection>

      <DocsSection id="t2-sorted-distance-optimization" title="T2: Sorted Distance Optimization">
        <p>
          The brute-force approach has a critical inefficiency: it checks <em>all</em> drivers for each rider, even drivers that are obviously too far away. T2 improves on this by <strong>pre-sorting drivers by one coordinate axis</strong> (e.g., latitude) and using <strong>early termination</strong> when searching.
        </p>
        <p>
          <strong>Key Insight:</strong> If drivers are sorted by latitude, and we're searching for the nearest driver to a rider at latitude 40.75, once we encounter a driver at latitude 41.0 and the distance exceeds our current best, we can stop checking drivers with even higher latitudes (since they will only get farther away).
        </p>

        <h3>Python Implementation</h3>
        <pre className="code-block">
          <span className="keyword">def</span> <span className="signal">match_sorted</span>(<span className="signal">riders</span>, <span className="signal">drivers</span>):<br/>
          &nbsp;&nbsp;<span className="comment"># Pre-sort drivers by latitude for efficient searching</span><br/>
          &nbsp;&nbsp;<span className="signal">sorted_drivers</span> <span className="operator">=</span> <span className="keyword">sorted</span>(<span className="signal">drivers</span>, <span className="signal">key</span><span className="operator">=</span><span className="keyword">lambda</span> <span className="signal">d</span>: <span className="signal">d</span>.<span className="signal">lat</span>)<br/>
          &nbsp;&nbsp;<span className="signal">matches</span> <span className="operator">=</span> []<br/>
          &nbsp;&nbsp;<span className="signal">available</span> <span className="operator">=</span> [<span className="keyword">True</span>] <span className="operator">*</span> <span className="keyword">len</span>(<span className="signal">sorted_drivers</span>)  <span className="comment"># Track availability by index</span><br/>
          <br/>
          &nbsp;&nbsp;<span className="keyword">for</span> <span className="signal">rider</span> <span className="keyword">in</span> <span className="signal">riders</span>:<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">min_distance</span> <span className="operator">=</span> <span className="keyword">float</span>(<span className="string">'inf'</span>)<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">best_driver_idx</span> <span className="operator">=</span> <span className="keyword">None</span><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">threshold</span> <span className="operator">=</span> <span className="number">0.5</span>  <span className="comment"># Distance threshold for early termination</span><br/>
          <br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">for</span> <span className="signal">idx</span>, <span className="signal">driver</span> <span className="keyword">in</span> <span className="keyword">enumerate</span>(<span className="signal">sorted_drivers</span>):<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> <span className="keyword">not</span> <span className="signal">available</span>[<span className="signal">idx</span>]:<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">continue</span>  <span className="comment"># Skip already-matched drivers</span><br/>
          <br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment"># Early termination: if sorted coordinate exceeds threshold, stop</span><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> <span className="keyword">abs</span>(<span className="signal">driver</span>.<span className="signal">lat</span> <span className="operator">-</span> <span className="signal">rider</span>.<span className="signal">lat</span>) <span className="operator">&gt;</span> <span className="signal">threshold</span> <span className="keyword">and</span> <span className="signal">min_distance</span> <span className="operator">&lt;</span> <span className="keyword">float</span>(<span className="string">'inf'</span>):<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">break</span><br/>
          <br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">distance</span> <span className="operator">=</span> <span className="signal">sqrt</span>((<span className="signal">rider</span>.<span className="signal">lat</span> <span className="operator">-</span> <span className="signal">driver</span>.<span className="signal">lat</span>)<span className="operator">**</span><span className="number">2</span> <span className="operator">+</span><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(<span className="signal">rider</span>.<span className="signal">lon</span> <span className="operator">-</span> <span className="signal">driver</span>.<span className="signal">lon</span>)<span className="operator">**</span><span className="number">2</span>)<br/>
          <br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> <span className="signal">distance</span> <span className="operator">&lt;</span> <span className="signal">min_distance</span>:<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">min_distance</span> <span className="operator">=</span> <span className="signal">distance</span><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">best_driver_idx</span> <span className="operator">=</span> <span className="signal">idx</span><br/>
          <br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">available</span>[<span className="signal">best_driver_idx</span>] <span className="operator">=</span> <span className="keyword">False</span>  <span className="comment"># Mark driver as matched</span><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">matches</span>.<span className="signal">append</span>((<span className="signal">rider</span>, <span className="signal">sorted_drivers</span>[<span className="signal">best_driver_idx</span>]))<br/>
          <br/>
          &nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">matches</span>
        </pre>

        <h3>Performance Analysis</h3>
        <p>
          <strong>Time Complexity:</strong> O(n × m) worst case (if all drivers are within threshold), but O(n × m/k) average case where k is the pruning factor. In practice, we might only check 20-30% of drivers for each rider.
        </p>
        <p>
          <strong>Real-World Performance:</strong> For uniformly distributed drivers, this provides a 2-3× speedup over brute force. However, the improvement depends heavily on data distribution and the threshold choice. If drivers are clustered, performance gains are minimal.
        </p>

        <h3>Experimental Results</h3>
        <div className="performance-results">
          <div className="metrics-grid">
            <div className="metric-card">
              <span className="metric-label">Average D1:</span>
              <span className="metric-value">584.43 min/ride</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Average D2:</span>
              <span className="metric-value">134.66 min</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Runtime:</span>
              <span className="metric-value">10.9 s</span>
            </div>
          </div>

          <img
            src="/projects/uber/images/t2_d1_d2_plot.png"
            alt="T2 Sorted Distance D1 and D2 metrics over time from actual simulation run"
            className="performance-graph"
          />

          <p className="graph-caption">
            D1 (blue) = cumulative passenger time, D2 (orange) = driver productivity metric.
          </p>

          <h3>Improvement vs T1</h3>
          <ul>
            <li><strong>D1:</strong> 1,051.85 → 584.43 min/ride = <strong>-44% improvement</strong></li>
            <li><strong>D2:</strong> -314.32 → +134.66 min = <strong>Negative to positive (huge fix!)</strong></li>
            <li><strong>Runtime:</strong> 10.8s → 10.9s = <strong>+0.9% (essentially same)</strong></li>
          </ul>
        </div>
      </DocsSection>

      <DocsSection id="t3-grid-based-spatial-partitioning" title="T3: Grid-Based Spatial Partitioning">
        <p>
          Instead of searching through all drivers (or a sorted subset), T3 uses <strong>spatial partitioning</strong> to dramatically reduce the search space. The idea: divide the geographic area into a grid of cells, assign each driver to a cell based on their coordinates, and for each rider, search only the nearby cells (3×3 neighborhood around the rider's cell).
        </p>
        <p style={{ background: '#fff3cd', padding: '0.75rem', borderRadius: '6px', borderLeft: '3px solid #ffc107', fontSize: '0.95rem' }}>
          <strong>Note:</strong> The current implementation evaluates all available drivers (not grid-filtered) using Dijkstra pathfinding, making it functionally similar to brute-force with accurate distance calculation. True grid partitioning would limit evaluation to nearby cells only.
        </p>
        <p>
          <strong>Grid Cell Formula:</strong> For a coordinate (lat, lon) and grid granularity g, the cell index is:
        </p>
        <pre className="code-block">
          <span className="signal">cell_x</span> <span className="operator">=</span> <span className="keyword">int</span>((<span className="signal">lon</span> <span className="operator">-</span> <span className="signal">min_lon</span>) <span className="operator">/</span> <span className="signal">g</span>)<br/>
          <span className="signal">cell_y</span> <span className="operator">=</span> <span className="keyword">int</span>((<span className="signal">lat</span> <span className="operator">-</span> <span className="signal">min_lat</span>) <span className="operator">/</span> <span className="signal">g</span>)
        </pre>

        <h3>Python Implementation</h3>
        <pre className="code-block">
          <span className="keyword">def</span> <span className="signal">match_grid</span>(<span className="signal">riders</span>, <span className="signal">drivers</span>, <span className="signal">grid_size</span><span className="operator">=</span><span className="number">0.1</span>):<br/>
          &nbsp;&nbsp;<span className="comment"># Build grid: map (cell_x, cell_y) to list of drivers in that cell</span><br/>
          &nbsp;&nbsp;<span className="signal">grid</span> <span className="operator">=</span> {}<br/>
          &nbsp;&nbsp;<span className="keyword">for</span> <span className="signal">driver</span> <span className="keyword">in</span> <span className="signal">drivers</span>:<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">cell_x</span> <span className="operator">=</span> <span className="keyword">int</span>(<span className="signal">driver</span>.<span className="signal">lon</span> <span className="operator">/</span> <span className="signal">grid_size</span>)  <span className="comment"># Compute grid cell by longitude</span><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">cell_y</span> <span className="operator">=</span> <span className="keyword">int</span>(<span className="signal">driver</span>.<span className="signal">lat</span> <span className="operator">/</span> <span className="signal">grid_size</span>)  <span className="comment"># Compute grid cell by latitude</span><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">cell_x</span>, <span className="signal">cell_y</span>) <span className="keyword">not</span> <span className="keyword">in</span> <span className="signal">grid</span>:<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">grid</span>[(<span className="signal">cell_x</span>, <span className="signal">cell_y</span>)] <span className="operator">=</span> []<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">grid</span>[(<span className="signal">cell_x</span>, <span className="signal">cell_y</span>)].<span className="signal">append</span>(<span className="signal">driver</span>)<br/>
          <br/>
          &nbsp;&nbsp;<span className="signal">matches</span> <span className="operator">=</span> []<br/>
          &nbsp;&nbsp;<span className="signal">matched_drivers</span> <span className="operator">=</span> <span className="keyword">set</span>()<br/>
          <br/>
          &nbsp;&nbsp;<span className="keyword">for</span> <span className="signal">rider</span> <span className="keyword">in</span> <span className="signal">riders</span>:<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">rider_cell_x</span> <span className="operator">=</span> <span className="keyword">int</span>(<span className="signal">rider</span>.<span className="signal">lon</span> <span className="operator">/</span> <span className="signal">grid_size</span>)<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">rider_cell_y</span> <span className="operator">=</span> <span className="keyword">int</span>(<span className="signal">rider</span>.<span className="signal">lat</span> <span className="operator">/</span> <span className="signal">grid_size</span>)<br/>
          <br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">min_distance</span> <span className="operator">=</span> <span className="keyword">float</span>(<span className="string">'inf'</span>)<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">best_driver</span> <span className="operator">=</span> <span className="keyword">None</span><br/>
          <br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment"># Search 3x3 neighborhood of cells around rider's cell</span><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">for</span> <span className="signal">dx</span> <span className="keyword">in</span> [<span className="operator">-</span><span className="number">1</span>, <span className="number">0</span>, <span className="number">1</span>]:<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">for</span> <span className="signal">dy</span> <span className="keyword">in</span> [<span className="operator">-</span><span className="number">1</span>, <span className="number">0</span>, <span className="number">1</span>]:<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">cell</span> <span className="operator">=</span> (<span className="signal">rider_cell_x</span> <span className="operator">+</span> <span className="signal">dx</span>, <span className="signal">rider_cell_y</span> <span className="operator">+</span> <span className="signal">dy</span>)<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> <span className="signal">cell</span> <span className="keyword">not</span> <span className="keyword">in</span> <span className="signal">grid</span>:<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">continue</span>  <span className="comment"># Skip empty cells</span><br/>
          <br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">for</span> <span className="signal">driver</span> <span className="keyword">in</span> <span className="signal">grid</span>[<span className="signal">cell</span>]:<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> <span className="signal">driver</span> <span className="keyword">in</span> <span className="signal">matched_drivers</span>:<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">continue</span>  <span className="comment"># Skip already-matched drivers</span><br/>
          <br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">distance</span> <span className="operator">=</span> <span className="signal">sqrt</span>((<span className="signal">rider</span>.<span className="signal">lat</span> <span className="operator">-</span> <span className="signal">driver</span>.<span className="signal">lat</span>)<span className="operator">**</span><span className="number">2</span> <span className="operator">+</span><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(<span className="signal">rider</span>.<span className="signal">lon</span> <span className="operator">-</span> <span className="signal">driver</span>.<span className="signal">lon</span>)<span className="operator">**</span><span className="number">2</span>)<br/>
          <br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> <span className="signal">distance</span> <span className="operator">&lt;</span> <span className="signal">min_distance</span>:<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">min_distance</span> <span className="operator">=</span> <span className="signal">distance</span><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">best_driver</span> <span className="operator">=</span> <span className="signal">driver</span><br/>
          <br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> <span className="signal">best_driver</span>:<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">matches</span>.<span className="signal">append</span>((<span className="signal">rider</span>, <span className="signal">best_driver</span>))<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">matched_drivers</span>.<span className="signal">add</span>(<span className="signal">best_driver</span>)  <span className="comment"># Mark driver as matched</span><br/>
          <br/>
          &nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">matches</span>
        </pre>

        <h3>Performance Analysis</h3>
        <p>
          <strong>Time Complexity:</strong> O(n × k) where k is the average number of drivers per cell. With proper grid sizing, k can be very small (e.g., 5-10 drivers per cell), making this much faster than brute force.
        </p>
        <p>
          <strong>Space Complexity:</strong> O(m) for the grid data structure.
        </p>
        <p>
          <strong>Grid Granularity Tradeoff:</strong> Too large (coarse grid) → many drivers per cell, slower search. Too small (fine grid) → many empty cells, more cells to check. Optimal grid size depends on driver density and distribution.
        </p>

        <h3>Experimental Results</h3>
        <div className="performance-results">
          <div className="metrics-grid">
            <div className="metric-card">
              <span className="metric-label">Average D1:</span>
              <span className="metric-value">536.21 min/ride</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Average D2:</span>
              <span className="metric-value">177.16 min</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Runtime:</span>
              <span className="metric-value">20.6 min</span>
            </div>
          </div>

          <img
            src="/projects/uber/images/t3_d1_d2_plot.png"
            alt="T3 Grid-Based D1 and D2 metrics over time from actual simulation run"
            className="performance-graph"
          />

          <p className="graph-caption">
            D1 (blue) = cumulative passenger time, D2 (orange) = driver productivity metric.
          </p>

          <h3>Improvement vs T2</h3>
          <ul>
            <li><strong>D1:</strong> 584.43 → 536.21 min/ride = <strong>-8% improvement</strong></li>
            <li><strong>D2:</strong> 134.66 → 177.16 min = <strong>+32% improvement</strong> (higher = more paid time vs unpaid)</li>
            <li><strong>Runtime:</strong> 10.9s → 20.6 min = <strong>113× slower</strong></li>
          </ul>
          <p style={{ fontStyle: 'italic', color: '#666', marginTop: '1rem' }}>
            <strong>Why is T3 so much slower?</strong> T2 uses Euclidean distance for matching (~2000 fast comparisons), then runs Dijkstra only 2× for the selected driver (pickup + trip). T3 runs Dijkstra for EVERY available driver during matching (~2000 pathfinding calls per passenger) to find the driver with the shortest pickup time. This results in ~1000× more Dijkstra computations. Even with 8-core multiprocessing, T3 is 113× slower than T2. The trade-off: T3's road network matching achieves better D1/D2 metrics through more accurate distance calculations.
          </p>
        </div>
      </DocsSection>

      <DocsSection id="t4-kd-tree-nearest-neighbor" title="T4: KD-Tree Nearest Neighbor">
        <p>
          Grid partitioning works well, but has a fixed granularity problem. T4 uses a <strong>KD-Tree (k-dimensional tree)</strong>, a binary search tree that adaptively partitions space based on data distribution. KD-Trees excel at nearest-neighbor queries, achieving <strong>O(log m) search time</strong> for balanced trees.
        </p>
        <p>
          <strong>How KD-Trees Work:</strong> At each level of the tree, split points along alternating dimensions (latitude at level 0, longitude at level 1, latitude at level 2, etc.). Each node represents a hyperplane that divides the space into two half-spaces. To find the nearest neighbor, traverse the tree by comparing coordinates, and prune branches that cannot contain closer points.
        </p>

        <h3>Python Implementation</h3>
        <pre className="code-block">
          <span className="keyword">from</span> <span className="signal">scipy.spatial</span> <span className="keyword">import</span> <span className="signal">KDTree</span><br/>
          <br/>
          <span className="keyword">def</span> <span className="signal">match_kdtree</span>(<span className="signal">riders</span>, <span className="signal">drivers</span>):<br/>
          &nbsp;&nbsp;<span className="comment"># Build KD-Tree from driver coordinates</span><br/>
          &nbsp;&nbsp;<span className="signal">driver_coords</span> <span className="operator">=</span> [(<span className="signal">d</span>.<span className="signal">lat</span>, <span className="signal">d</span>.<span className="signal">lon</span>) <span className="keyword">for</span> <span className="signal">d</span> <span className="keyword">in</span> <span className="signal">drivers</span>]<br/>
          &nbsp;&nbsp;<span className="signal">tree</span> <span className="operator">=</span> <span className="signal">KDTree</span>(<span className="signal">driver_coords</span>)  <span className="comment"># O(m log m) construction time</span><br/>
          <br/>
          &nbsp;&nbsp;<span className="signal">matches</span> <span className="operator">=</span> []<br/>
          &nbsp;&nbsp;<span className="signal">matched_indices</span> <span className="operator">=</span> <span className="keyword">set</span>()<br/>
          <br/>
          &nbsp;&nbsp;<span className="keyword">for</span> <span className="signal">rider</span> <span className="keyword">in</span> <span className="signal">riders</span>:<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment"># Query tree for k=10 nearest drivers to handle already-matched drivers</span><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">distances</span>, <span className="signal">indices</span> <span className="operator">=</span> <span className="signal">tree</span>.<span className="signal">query</span>([<span className="signal">rider</span>.<span className="signal">lat</span>, <span className="signal">rider</span>.<span className="signal">lon</span>], <span className="signal">k</span><span className="operator">=</span><span className="number">10</span>)  <span className="comment"># O(log m) query</span><br/>
          <br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment"># Find first unmatched driver from nearest neighbors</span><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">for</span> <span className="signal">dist</span>, <span className="signal">idx</span> <span className="keyword">in</span> <span className="keyword">zip</span>(<span className="signal">distances</span>, <span className="signal">indices</span>):<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> <span className="signal">idx</span> <span className="keyword">not</span> <span className="keyword">in</span> <span className="signal">matched_indices</span>:<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">best_driver</span> <span className="operator">=</span> <span className="signal">drivers</span>[<span className="signal">idx</span>]<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">matches</span>.<span className="signal">append</span>((<span className="signal">rider</span>, <span className="signal">best_driver</span>))<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">matched_indices</span>.<span className="signal">add</span>(<span className="signal">idx</span>)  <span className="comment"># Mark driver as matched</span><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">break</span><br/>
          <br/>
          &nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">matches</span>
        </pre>

        <h3>Performance Analysis</h3>
        <p>
          <strong>Time Complexity:</strong> O(m log m) for tree construction + O(n log m) for n queries = O((n + m) log m) total. For large m, this is a significant improvement over grid-based O(n × k).
        </p>
        <p>
          <strong>Space Complexity:</strong> O(m) for the tree structure.
        </p>
        <p>
          <strong>Real-World Performance:</strong> For 1,000 riders and 1,000 drivers, KD-Tree reduces query time from milliseconds (grid) to microseconds per rider. This is the go-to approach for production systems handling spatial queries at scale.
        </p>
        <p>
          <strong>Learn More:</strong> See the <Link to="/projects/uber/docs/kdtree" style={{ color: '#2E7D32', fontWeight: 600 }}>KD-Tree Documentation</Link> for detailed implementation, balancing strategies, and performance benchmarks.
        </p>

        <h3>Experimental Results</h3>
        <div className="performance-results">
          <div className="metrics-grid">
            <div className="metric-card">
              <span className="metric-label">Average D1:</span>
              <span className="metric-value">527.26 min/ride</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Average D2:</span>
              <span className="metric-value">177.58 min</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Runtime:</span>
              <span className="metric-value">20.5 min</span>
            </div>
          </div>

          <img
            src="/projects/uber/images/t4_d1_d2_plot.png"
            alt="T4 KD-Tree D1 and D2 metrics over time from actual simulation run"
            className="performance-graph"
          />

          <p className="graph-caption">
            D1 (blue) = cumulative passenger time, D2 (orange) = driver productivity metric.
          </p>

          <h3>Improvement vs T3</h3>
          <ul>
            <li><strong>D1:</strong> 536.21 → 527.26 min/ride = <strong>-2% improvement</strong></li>
            <li><strong>D2:</strong> 177.16 → 177.58 min = <strong>+0.2% (essentially same)</strong></li>
            <li><strong>Runtime:</strong> 20.6 min → 20.5 min = <strong>-0.5% (essentially same)</strong></li>
          </ul>
          <p style={{ fontStyle: 'italic', color: '#666', marginTop: '1rem' }}>
            <strong>T4 vs T3:</strong> Both algorithms evaluate all available drivers (~2000 per passenger). T3 uses Dijkstra, while T4 uses A* with Euclidean heuristic. Theoretically, A* should be ~30% faster than Dijkstra, which over 20M calls should save ~6 minutes. However, actual runtime is nearly identical (20.5 vs 20.6 min). This is because on small, dense Manhattan grids (600 nodes), both algorithms explore similar nodes and complete in ~0.5ms per call, making the heuristic advantage negligible. The similarity demonstrates that Big O constant factors don't always translate to practical improvements on small graphs.
          </p>
        </div>
      </DocsSection>

      <DocsSection id="t5-kd-tree-dijkstra-road-network" title="T5: KD-Tree + Dijkstra Road Network">
        <p>
          All previous algorithms used <strong>Euclidean distance</strong> (straight-line distance) to match riders and drivers. However, in real-world ride-sharing, <strong>road network distance</strong> (actual driving distance following roads) is what matters. A driver 2 miles away as the crow flies might be 5 miles away by road if a river or highway separates them.
        </p>
        <p>
          T5 combines the spatial efficiency of KD-Trees with the accuracy of <strong>Dijkstra's shortest path algorithm</strong> on a weighted road network graph.
        </p>

        <h3>Two-Phase Approach</h3>
        <ul>
          <li><strong>Phase 1 - Spatial Filtering:</strong> Use KD-Tree to find k nearest drivers by Euclidean distance (e.g., k=5). This narrows the search space from thousands of drivers to a small candidate set.</li>
          <li><strong>Phase 2 - Road Distance Refinement:</strong> For each candidate driver, run Dijkstra's algorithm from the rider's location to compute the actual shortest road path distance. Select the driver with the minimum road distance.</li>
        </ul>

        <h3>Python Implementation</h3>
        <pre className="code-block">
          <span className="keyword">import</span> <span className="signal">networkx</span> <span className="keyword">as</span> <span className="signal">nx</span><br/>
          <span className="keyword">from</span> <span className="signal">scipy.spatial</span> <span className="keyword">import</span> <span className="signal">KDTree</span><br/>
          <br/>
          <span className="keyword">def</span> <span className="signal">match_kdtree_dijkstra</span>(<span className="signal">riders</span>, <span className="signal">drivers</span>, <span className="signal">road_graph</span>):<br/>
          &nbsp;&nbsp;<span className="comment"># Build KD-Tree from driver coordinates</span><br/>
          &nbsp;&nbsp;<span className="signal">driver_coords</span> <span className="operator">=</span> [(<span className="signal">d</span>.<span className="signal">lat</span>, <span className="signal">d</span>.<span className="signal">lon</span>) <span className="keyword">for</span> <span className="signal">d</span> <span className="keyword">in</span> <span className="signal">drivers</span>]<br/>
          &nbsp;&nbsp;<span className="signal">tree</span> <span className="operator">=</span> <span className="signal">KDTree</span>(<span className="signal">driver_coords</span>)<br/>
          <br/>
          &nbsp;&nbsp;<span className="signal">matches</span> <span className="operator">=</span> []<br/>
          &nbsp;&nbsp;<span className="signal">matched_indices</span> <span className="operator">=</span> <span className="keyword">set</span>()<br/>
          <br/>
          &nbsp;&nbsp;<span className="keyword">for</span> <span className="signal">rider</span> <span className="keyword">in</span> <span className="signal">riders</span>:<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment"># Phase 1: Find k=10 nearest drivers by Euclidean distance</span><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">distances</span>, <span className="signal">indices</span> <span className="operator">=</span> <span className="signal">tree</span>.<span className="signal">query</span>([<span className="signal">rider</span>.<span className="signal">lat</span>, <span className="signal">rider</span>.<span className="signal">lon</span>], <span className="signal">k</span><span className="operator">=</span><span className="number">10</span>)<br/>
          <br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment"># Phase 2: Compute road distance for each candidate driver</span><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">min_road_distance</span> <span className="operator">=</span> <span className="keyword">float</span>(<span className="string">'inf'</span>)<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">best_driver_idx</span> <span className="operator">=</span> <span className="keyword">None</span><br/>
          <br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">for</span> <span className="signal">idx</span> <span className="keyword">in</span> <span className="signal">indices</span>:<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> <span className="signal">idx</span> <span className="keyword">in</span> <span className="signal">matched_indices</span>:<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">continue</span>  <span className="comment"># Skip already-matched drivers</span><br/>
          <br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">driver</span> <span className="operator">=</span> <span className="signal">drivers</span>[<span className="signal">idx</span>]<br/>
          <br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment"># Run Dijkstra to find shortest road path from rider to driver</span><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">rider_node</span> <span className="operator">=</span> <span className="signal">find_nearest_node</span>(<span className="signal">road_graph</span>, <span className="signal">rider</span>.<span className="signal">lat</span>, <span className="signal">rider</span>.<span className="signal">lon</span>)<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">driver_node</span> <span className="operator">=</span> <span className="signal">find_nearest_node</span>(<span className="signal">road_graph</span>, <span className="signal">driver</span>.<span className="signal">lat</span>, <span className="signal">driver</span>.<span className="signal">lon</span>)<br/>
          <br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">try</span>:<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment"># Dijkstra's algorithm: O(E log V) where E = edges, V = vertices</span><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">road_distance</span> <span className="operator">=</span> <span className="signal">nx</span>.<span className="signal">shortest_path_length</span>(<span className="signal">road_graph</span>, <span className="signal">rider_node</span>, <span className="signal">driver_node</span>, <span className="signal">weight</span><span className="operator">=</span><span className="string">'length'</span>)<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">except</span> <span className="signal">nx</span>.<span className="signal">NetworkXNoPath</span>:<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">continue</span>  <span className="comment"># No path exists (e.g., disconnected components)</span><br/>
          <br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> <span className="signal">road_distance</span> <span className="operator">&lt;</span> <span className="signal">min_road_distance</span>:<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">min_road_distance</span> <span className="operator">=</span> <span className="signal">road_distance</span>  <span className="comment"># Update best road distance</span><br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">best_driver_idx</span> <span className="operator">=</span> <span className="signal">idx</span><br/>
          <br/>
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> <span className="signal">best_driver_idx</span> <span className="keyword">is</span> <span className="keyword">not</span> <span className="keyword">None</span>:<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">matches</span>.<span className="signal">append</span>((<span className="signal">rider</span>, <span className="signal">drivers</span>[<span className="signal">best_driver_idx</span>]))<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">matched_indices</span>.<span className="signal">add</span>(<span className="signal">best_driver_idx</span>)<br/>
          <br/>
          &nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">matches</span>
        </pre>

        <h3>Performance Analysis</h3>
        <p>
          <strong>Time Complexity:</strong> O(n × (log m + k × E log V)) where k is the number of candidate drivers (typically 5-10), E is the number of road edges, and V is the number of road vertices. For large graphs, Dijkstra dominates, but we only run it k times per rider (not m times).
        </p>
        <p>
          <strong>Accuracy vs Speed Tradeoff:</strong> Euclidean distance is fast but inaccurate. Road distance is accurate but slow. This hybrid approach balances both: use KD-Tree to eliminate 99% of drivers, then compute accurate road distances for the remaining 1%.
        </p>
        <p>
          <strong>Real-World Impact:</strong> In urban environments with rivers, highways, and one-way streets, road distance can differ from Euclidean distance by 2-3×. This leads to significantly better D1/D2 metrics and user satisfaction.
        </p>
        <p>
          <strong>Learn More:</strong> See the <Link to="/projects/uber/docs/pathfinding" style={{ color: '#2E7D32', fontWeight: 600 }}>Pathfinding Documentation</Link> for details on Dijkstra's algorithm, graph representation, and optimization techniques.
        </p>

        <h3>Experimental Results</h3>
        <div className="performance-results">
          <div className="metrics-grid">
            <div className="metric-card">
              <span className="metric-label">Average D1:</span>
              <span className="metric-value">669.95 min/ride</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Average D2:</span>
              <span className="metric-value">35.70 min</span>
            </div>
            <div className="metric-card">
              <span className="metric-label">Runtime:</span>
              <span className="metric-value">1.2 min</span>
            </div>
          </div>

          <img
            src="/projects/uber/images/t5_d1_d2_plot.png"
            alt="T5 KD-Tree + Dijkstra D1 and D2 metrics over time from actual simulation run"
            className="performance-graph"
          />

          <p className="graph-caption">
            D1 (blue) = cumulative passenger time, D2 (orange) = driver productivity metric.
          </p>

          <h3>Improvement vs T4</h3>
          <ul>
            <li><strong>D1:</strong> 527.26 → 669.95 min/ride = <strong>+27% worse</strong></li>
            <li><strong>D2:</strong> 177.58 → 35.70 min = <strong>-80% worse</strong></li>
            <li><strong>Runtime:</strong> 20.5 min → 1.2 min = <strong>-94% faster (17× speedup!)</strong></li>
          </ul>
          <p style={{ fontStyle: 'italic', color: '#666', marginTop: '1rem' }}>
            <strong>T5's Speed-Accuracy Trade-off:</strong> Unlike T3/T4 which evaluate all available drivers, T5 implements aggressive filtering by pruning to only the 10 closest candidates (by Euclidean distance) before computing pickup times. This reduces matching quality (worse D1/D2) but achieves dramatic speedup — 74.8 seconds vs 20.5 minutes, making it 17× faster than T4. The early termination when finding a driver within 6 minutes further improves performance. T5 demonstrates that for real-time systems prioritizing response time over perfect matching, candidate pruning is essential.
          </p>
        </div>
      </DocsSection>

      <DocsSection id="multiprocessing-optimization" title="Multiprocessing Optimization">
        <h3>The Performance Problem</h3>
        <p>
          After implementing T3-T5 algorithms, a critical performance bottleneck emerged: <strong>Dijkstra's pathfinding was too slow for large datasets</strong>. With 10,000 passengers and 4,000 available drivers, T3-T5 required computing road network distances for thousands of driver-passenger pairs, causing execution times to exceed <strong>100+ minutes per algorithm</strong>.
        </p>

        <div style={{ background: '#fff3cd', padding: '1rem', borderRadius: '8px', margin: '1.5rem 0', borderLeft: '4px solid #ffc107' }}>
          <strong>Original Bottleneck (per passenger):</strong>
          <ul style={{ marginTop: '0.5rem', marginBottom: 0 }}>
            <li>~2,000 available drivers to evaluate</li>
            <li>Each evaluation: 1 Dijkstra pathfinding call (~100ms)</li>
            <li>Total time per passenger: 2,000 × 100ms = <strong>200 seconds</strong></li>
            <li>For 10,000 passengers: ~23 days of sequential execution! ❌</li>
          </ul>
        </div>

        <h3>The Solution: Fork-Based Multiprocessing</h3>
        <p>
          To address this bottleneck, <strong>fork-based multiprocessing</strong> was implemented to parallelize Dijkstra pathfinding across multiple CPU cores. This optimization <strong>only parallelized the computation</strong> — the algorithms themselves (T3, T4, T5) remained unchanged.
        </p>

        <h3>Implementation Details</h3>
        <pre className="code-block">
          <span className="keyword">import</span> <span className="signal">multiprocessing</span> <span className="keyword">as</span> <span className="signal">mp</span><br/>
          <span className="signal">mp</span>.<span className="signal">set_start_method</span>(<span className="string">'fork'</span>, <span className="signal">force</span>=<span className="keyword">True</span>)  <span className="comment"># Use fork method</span><br/>
          <br/>
          <span className="keyword">def</span> <span className="signal">compute_driver_pickup_time</span>(<span className="signal">args</span>):<br/>
          &nbsp;&nbsp;<span className="signal">driver_idx</span>, <span className="signal">driver_data</span>, <span className="signal">passenger_node</span>, <span className="signal">hour</span> = <span className="signal">args</span><br/>
          &nbsp;&nbsp;<span className="comment"># Get driver's closest road network node</span><br/>
          &nbsp;&nbsp;<span className="signal">driver_node</span> = <span className="signal">get_closest_node</span>(<span className="signal">driver_data</span>)<br/>
          &nbsp;&nbsp;<span className="comment"># Run Dijkstra's algorithm to compute pickup time</span><br/>
          &nbsp;&nbsp;<span className="signal">pickup_time</span> = <span className="signal">map</span>.<span className="signal">get_time</span>(<span className="signal">driver_node</span>, <span className="signal">passenger_node</span>, <span className="signal">hour</span>)<br/>
          &nbsp;&nbsp;<span className="keyword">return</span> (<span className="signal">driver_idx</span>, <span className="signal">pickup_time</span>, <span className="signal">driver_node</span>)<br/>
          <br/>
          <span className="comment"># Parallelize driver evaluations for each passenger</span><br/>
          <span className="keyword">with</span> <span className="signal">mp</span>.<span className="signal">Pool</span>(<span className="signal">processes</span>=<span className="number">8</span>) <span className="keyword">as</span> <span className="signal">pool</span>:<br/>
          &nbsp;&nbsp;<span className="signal">results</span> = <span className="signal">pool</span>.<span className="signal">map</span>(<span className="signal">compute_driver_pickup_time</span>, <span className="signal">driver_jobs</span>)<br/>
          &nbsp;&nbsp;<span className="comment"># Select best driver from parallel results</span><br/>
          &nbsp;&nbsp;<span className="signal">best_driver</span> = <span className="keyword">min</span>(<span className="signal">results</span>, <span className="signal">key</span>=<span className="keyword">lambda</span> <span className="signal">x</span>: <span className="signal">x</span>[<span className="number">1</span>])
        </pre>

        <h3>Why Fork Method?</h3>
        <p>
          Python's <code>multiprocessing</code> module supports three start methods: <strong>spawn</strong>, <strong>fork</strong>, and <strong>forkserver</strong>. On macOS (used for development), the default is <code>spawn</code>, which requires pickling (serializing) all shared data. However, the road network graph uses complex data structures (<code>defaultdict</code> with lambda functions) that cannot be pickled.
        </p>
        <p>
          <strong>Fork method</strong> solves this by copying the parent process's memory space to child processes, allowing workers to directly access the shared graph data without serialization. This enables seamless parallelization without code refactoring.
        </p>

        <h3>Performance Results</h3>
        <div className="metrics-grid">
          <div className="metric-card" style={{ background: '#d4edda', border: '1px solid #28a745' }}>
            <span className="metric-label">T3 Speedup:</span>
            <span className="metric-value">5.4× faster</span>
            <span style={{ fontSize: '0.85rem', display: 'block', marginTop: '0.5rem' }}>111 min → 20.6 min</span>
          </div>
          <div className="metric-card" style={{ background: '#d4edda', border: '1px solid #28a745' }}>
            <span className="metric-label">T4 Speedup:</span>
            <span className="metric-value">~5× faster</span>
            <span style={{ fontSize: '0.85rem', display: 'block', marginTop: '0.5rem' }}>~100 min → 20.5 min</span>
          </div>
          <div className="metric-card" style={{ background: '#d1ecf1', border: '1px solid #17a2b8' }}>
            <span className="metric-label">Hardware:</span>
            <span className="metric-value">M1 Pro (8 cores)</span>
            <span style={{ fontSize: '0.85rem', display: 'block', marginTop: '0.5rem' }}>Python 3.13</span>
          </div>
        </div>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', fontStyle: 'italic', color: '#666' }}>
          Note: T5 doesn't require multiprocessing - its 10-candidate pruning makes it naturally fast (1.2 minutes without parallelization).
        </p>
        <div className="metrics-grid">
        </div>

        <h3>What Changed vs. What Didn't</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1.5rem' }}>
          <div style={{ background: '#d4edda', padding: '1.5rem', borderRadius: '8px', border: '2px solid #28a745' }}>
            <h4 style={{ color: '#155724', marginTop: 0 }}>What Changed (Computation Only)</h4>
            <ul style={{ color: '#155724', lineHeight: 1.8 }}>
              <li>Dijkstra pathfinding parallelized across 8 cores</li>
              <li>Driver evaluation jobs distributed to worker processes</li>
              <li>Results merged in parallel before final selection</li>
              <li>Execution time reduced by 5-7× due to parallelism</li>
            </ul>
          </div>
          <div style={{ background: '#fff3cd', padding: '1.5rem', borderRadius: '8px', border: '2px solid #ffc107' }}>
            <h4 style={{ color: '#856404', marginTop: 0 }}>What Didn't Change (Algorithms Unchanged)</h4>
            <ul style={{ color: '#856404', lineHeight: 1.8 }}>
              <li>T3 grid partitioning logic identical</li>
              <li>T4 KD-Tree structure and queries identical</li>
              <li>T5 hybrid KD-Tree + Dijkstra logic identical</li>
              <li>D1/D2 metrics remain the same (no algorithmic improvements)</li>
            </ul>
          </div>
        </div>

        <div style={{ background: '#e7f3ff', padding: '1rem', borderRadius: '8px', margin: '1.5rem 0', borderLeft: '4px solid #2196F3' }}>
          <strong>Key Takeaway:</strong> Multiprocessing is a <em>computational optimization</em>, not an <em>algorithmic optimization</em>. T3 and T4 produce identical results with or without multiprocessing — they just run faster with parallel execution. The 5× speedup comes from parallelizing 20 million pathfinding calls (not cache hits - the base implementation populates but doesn't retrieve cached paths). T5 doesn't require multiprocessing because its candidate pruning (10 drivers vs 2000) makes it naturally fast (1.2 minutes). The D1 and D2 metrics reflect the algorithm's matching quality, not the implementation's execution speed.
        </div>
      </DocsSection>

      <DocsSection id="performance-comparison" title="Performance Comparison">
        <p>
          The following table compares real-world performance metrics across all five algorithm implementations, showing the progression from brute-force to optimized spatial data structures and road network integration.
        </p>

        <table className="comparison-table">
          <thead>
            <tr>
              <th>Algorithm</th>
              <th>Complexity</th>
              <th>Avg D1 (min)</th>
              <th>Avg D2 (min)</th>
              <th>Runtime</th>
              <th>Dataset</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>T1: Brute Force</strong></td>
              <td>O(n × m)</td>
              <td>1,051.85</td>
              <td>-314.32</td>
              <td>10.8 s</td>
              <td>10K riders</td>
            </tr>
            <tr>
              <td><strong>T2: Sorted Distance</strong></td>
              <td>O(n × m/k) avg</td>
              <td>584.43</td>
              <td>134.66</td>
              <td>10.9 s</td>
              <td>10K riders</td>
            </tr>
            <tr>
              <td><strong>T3: Grid-Based</strong></td>
              <td>O(n × k)</td>
              <td>536.21</td>
              <td>177.16</td>
              <td>20.6 min*</td>
              <td>10K riders</td>
            </tr>
            <tr>
              <td><strong>T4: KD-Tree</strong></td>
              <td>O(n × m)</td>
              <td>527.26</td>
              <td>177.58</td>
              <td>20.5 min*</td>
              <td>10K riders</td>
            </tr>
            <tr>
              <td><strong>T5: KD-Tree + Pruning</strong></td>
              <td>O(n × k) k=10</td>
              <td>669.95</td>
              <td>35.70</td>
              <td>1.2 min</td>
              <td>10K riders</td>
            </tr>
          </tbody>
        </table>
        <p style={{ marginTop: '1rem', fontSize: '0.9rem', fontStyle: 'italic', color: '#666' }}>
          * T3-T4 runtimes use fork-based multiprocessing optimization (see Multiprocessing Optimization section below). T5 uses candidate pruning and doesn't require multiprocessing.
        </p>

        <h3>Key Insights</h3>
        <ul>
          <li><strong>Algorithm Quality (D1/D2):</strong>
            <ul style={{ marginLeft: '2rem', marginTop: '0.5rem' }}>
              <li>T1 (brute force): Worst quality — negative D2 means drivers waste more time on pickups than paid trips</li>
              <li>T2 (sorted): 44% D1 reduction vs T1, positive D2 (better driver productivity)</li>
              <li>T3-T4 (all drivers evaluated): Best quality — 49-50% D1 reduction vs T1, strong positive D2</li>
              <li>T5 (10-candidate pruning): Faster but worse quality — 36% worse D1 than T4, 80% worse D2</li>
            </ul>
          </li>
          <li><strong>Execution Time Trade-offs:</strong> T1-T2 run in ~11 seconds. T3-T4 require ~20 minutes with multiprocessing (evaluate all drivers). T5 runs in just 1.2 minutes by pruning to 10 candidates, sacrificing matching quality for speed.</li>
          <li><strong>The T5 Design Choice:</strong> T5 demonstrates that evaluating all drivers (T3, T4) produces better matches but is computationally expensive. T5's candidate pruning achieves 17× speedup over T4 at the cost of 27% worse D1 — a worthwhile trade-off for real-time systems prioritizing response time.</li>
          <li><strong>Multiprocessing Impact:</strong> Fork-based parallelization reduces T3-T4 execution time by 5× but doesn't change D1/D2 metrics. T5 doesn't need multiprocessing due to candidate pruning (already fast).</li>
          <li><strong>Practical Lesson:</strong> Perfect matching (evaluating all drivers) is too slow for real-time systems. Smart filtering (T5's approach) enables sub-second response times while maintaining acceptable match quality.</li>
        </ul>
      </DocsSection>
    </DocsLayout>
  )
}

export default UberAlgorithmPage
