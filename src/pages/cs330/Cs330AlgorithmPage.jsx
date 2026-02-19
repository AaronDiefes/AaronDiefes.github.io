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
        }

        .code-block .keyword {
            color: #569cd6;
        }

        .code-block .comment {
            color: #6a9955;
        }

        .code-block .signal {
            color: #9cdcfe;
        }

        .code-block .operator {
            color: #d4d4d4;
        }

        .code-block .number {
            color: #b5cea8;
        }

        .code-block .string {
            color: #ce9178;
        }

        .complexity-badge {
            display: inline-block;
            padding: 0.25rem 0.75rem;
            background: #e8f5e9;
            color: #2E7D32;
            border-radius: 4px;
            font-weight: 600;
            font-size: 0.9rem;
            margin-left: 0.5rem;
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
        <h1>Algorithm Evolution</h1>
        <p>T1-T5 Progressive Optimization for Ride-Sharing Matching</p>
      </header>

      <div className="container">
        {/* Overview Section */}
        <section className="section">
          <h2>Overview</h2>
          <p>
            The <strong>ride-sharing matching problem</strong> is at the heart of platforms like Uber and Lyft: given a set of riders requesting rides and a set of available drivers, find the optimal rider-driver matches that minimize travel distance while ensuring fairness and efficiency.
          </p>
          <p>
            <strong>Two Key Metrics:</strong>
          </p>
          <ul>
            <li><strong>D1 (Average Match Distance):</strong> The mean distance across all rider-driver matches. Lower D1 indicates better overall efficiency.</li>
            <li><strong>D2 (Maximum Match Distance):</strong> The longest distance any rider has to their matched driver. Lower D2 indicates better fairness (no rider is unfairly matched far away).</li>
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
        </section>

        {/* T1: Brute Force Section */}
        <section className="section">
          <h2>T1: Brute Force<span className="complexity-badge">O(n × m)</span></h2>
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
            <strong>Real-World Performance:</strong> For small datasets (10-100 riders/drivers), this approach works fine and completes in milliseconds. However, for production-scale systems with thousands of drivers and riders, this becomes impractical. With 1,000 riders and 1,000 drivers, we perform 1 million distance calculations.
          </p>
        </section>

        {/* T2: Sorted Distance Optimization Section */}
        <section className="section">
          <h2>T2: Sorted Distance Optimization<span className="complexity-badge">O(n × m/k) avg</span></h2>
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
        </section>

        {/* T3: Grid-Based Spatial Partitioning Section */}
        <section className="section">
          <h2>T3: Grid-Based Spatial Partitioning<span className="complexity-badge">O(n × k)</span></h2>
          <p>
            Instead of searching through all drivers (or a sorted subset), T3 uses <strong>spatial partitioning</strong> to dramatically reduce the search space. The idea: divide the geographic area into a grid of cells, assign each driver to a cell based on their coordinates, and for each rider, search only the nearby cells (3×3 neighborhood around the rider's cell).
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
        </section>

        {/* T4: KD-Tree Nearest Neighbor Section */}
        <section className="section">
          <h2>T4: KD-Tree Nearest Neighbor<span className="complexity-badge">O(n × log m)</span></h2>
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
            <strong>Learn More:</strong> See the <Link to="/projects/cs330/docs/kdtree" style={{ color: '#2E7D32', fontWeight: 600 }}>KD-Tree Documentation</Link> for detailed implementation, balancing strategies, and performance benchmarks.
          </p>
        </section>

        {/* T5: KD-Tree + Dijkstra Road Network Section */}
        <section className="section">
          <h2>T5: KD-Tree + Dijkstra Road Network<span className="complexity-badge">O(n × (log m + E log V))</span></h2>
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
            <strong>Learn More:</strong> See the <Link to="/projects/cs330/docs/pathfinding" style={{ color: '#2E7D32', fontWeight: 600 }}>Pathfinding Documentation</Link> for details on Dijkstra's algorithm, graph representation, and optimization techniques.
          </p>
        </section>

        {/* Explore Further Section */}
        <section className="section">
          <h2>Explore Further</h2>
          <div className="quick-links">
            <Link to="/projects/cs330/docs/kdtree" className="quick-link">KD-Tree Implementation →</Link>
            <Link to="/projects/cs330/docs/pathfinding" className="quick-link">Pathfinding with Dijkstra →</Link>
            <Link to="/projects/cs330/docs/performance" className="quick-link">Performance Analysis →</Link>
            <a href="https://github.com/AaronDiefes/cs330-case-study" target="_blank" rel="noopener noreferrer" className="quick-link">View Source on GitHub →</a>
            <Link to="/projects/cs330/docs" className="quick-link">Back to CS330 Documentation →</Link>
          </div>
        </section>
      </div>

      <footer style={{ background: '#2c3e50', color: '#ecf0f1', padding: '3rem 2rem 2rem', marginTop: '4rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '2rem' }}>
            {/* About Section */}
            <div>
              <h3 style={{ color: '#2E7D32', marginBottom: '1rem', fontSize: '1.2rem' }}>Aaron Diefes</h3>
              <p style={{ color: '#bdc3c7', lineHeight: 1.8, marginBottom: '1rem' }}>Software Engineer passionate about algorithm design and efficient data structures.</p>
              <p style={{ color: '#bdc3c7', lineHeight: 1.8 }}>Building solutions that balance performance, scalability, and code clarity.</p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 style={{ color: '#2E7D32', marginBottom: '1rem', fontSize: '1.2rem' }}>Navigation</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '0.75rem' }}><Link to="/" style={{ color: '#ecf0f1', textDecoration: 'none', transition: 'color 0.15s' }}>← Portfolio Home</Link></li>
                <li style={{ marginBottom: '0.75rem' }}><Link to="/projects/cs330/docs" style={{ color: '#ecf0f1', textDecoration: 'none', transition: 'color 0.15s' }}>CS330 Documentation</Link></li>
                <li style={{ marginBottom: '0.75rem', color: '#95a5a6' }}>Algorithm Evolution</li>
                <li style={{ marginBottom: '0.75rem' }}><Link to="/projects/cs330/docs/kdtree" style={{ color: '#ecf0f1', textDecoration: 'none', transition: 'color 0.15s' }}>KD-Tree</Link></li>
                <li style={{ marginBottom: '0.75rem' }}><Link to="/projects/cs330/docs/pathfinding" style={{ color: '#ecf0f1', textDecoration: 'none', transition: 'color 0.15s' }}>Pathfinding</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 style={{ color: '#2E7D32', marginBottom: '1rem', fontSize: '1.2rem' }}>Resources</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '0.75rem' }}><a href="https://github.com/AaronDiefes" target="_blank" rel="noopener noreferrer" style={{ color: '#ecf0f1', textDecoration: 'none', transition: 'color 0.15s' }}>GitHub Profile</a></li>
                <li style={{ marginBottom: '0.75rem' }}><a href="https://github.com/AaronDiefes/cs330-case-study" target="_blank" rel="noopener noreferrer" style={{ color: '#ecf0f1', textDecoration: 'none', transition: 'color 0.15s' }}>CS330 Case Study Repo</a></li>
                <li style={{ marginBottom: '0.75rem' }}><a href="https://github.com/AaronDiefes/AaronDiefes.github.io" target="_blank" rel="noopener noreferrer" style={{ color: '#ecf0f1', textDecoration: 'none', transition: 'color 0.15s' }}>Portfolio Repo</a></li>
              </ul>
            </div>

            {/* Tech Stack */}
            <div>
              <h3 style={{ color: '#2E7D32', marginBottom: '1rem', fontSize: '1.2rem' }}>Built With</h3>
              <ul style={{ listStyle: 'none', padding: 0, color: '#bdc3c7' }}>
                <li style={{ marginBottom: '0.75rem' }}>• Python</li>
                <li style={{ marginBottom: '0.75rem' }}>• NetworkX</li>
                <li style={{ marginBottom: '0.75rem' }}>• KD-Trees</li>
                <li style={{ marginBottom: '0.75rem' }}>• Matplotlib</li>
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

export default Cs330AlgorithmPage
