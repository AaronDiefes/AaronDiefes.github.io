import React from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../../components/shared/Breadcrumbs'

function Cs330PathfindingPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'CS330 Case Study', href: '/projects/cs330/docs' },
    { label: 'Documentation', href: '/projects/cs330/docs' },
    { label: 'Pathfinding' }
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
        <h1>Pathfinding</h1>
        <p>Dijkstra's Algorithm on Road Networks</p>
      </header>

      <div className="container">
        {/* Overview Section */}
        <section className="section">
          <h2>Overview</h2>
          <p>
            In ride-sharing systems, <strong>Euclidean distance</strong> (straight-line distance) is often a poor approximation of actual travel distance. Two points may be geographically close but far apart by road due to rivers, highways, one-way streets, or other physical barriers. This discrepancy can lead to inefficient matches and poor user experience.
          </p>
          <p>
            <strong>Dijkstra's algorithm</strong> solves the single-source shortest path problem on weighted graphs with non-negative edge weights. When applied to road networks, it computes the actual shortest driving distance between two locations, providing far more accurate matches than Euclidean distance alone.
          </p>
          <p>
            <strong>Time Complexity:</strong> <span className="complexity-badge">O((V + E) log V)</span> with a binary heap priority queue, where V is the number of vertices (intersections) and E is the number of edges (road segments).
          </p>
          <p>
            <strong>Why This Matters:</strong> For ride-sharing platforms operating in urban environments with complex road layouts, road distance accuracy directly impacts D1/D2 metrics and overall user satisfaction. A driver 1 mile away by Euclidean distance might be 3 miles away by road, while another driver 1.5 miles away Euclidean might only be 1.2 miles by road.
          </p>
        </section>

        {/* Graph Representation Section */}
        <section className="section">
          <h2>Graph Representation</h2>
          <p>
            A <strong>road network</strong> is naturally modeled as a weighted graph where:
          </p>
          <ul>
            <li><strong>Nodes (vertices):</strong> Represent intersections or points of interest in the road network</li>
            <li><strong>Edges:</strong> Represent road segments connecting two intersections</li>
            <li><strong>Edge weights:</strong> Represent the distance (in kilometers or miles) or travel time between connected nodes</li>
          </ul>

          <h3>Building the Graph with NetworkX</h3>
          <p>
            Python's <strong>NetworkX</strong> library provides efficient graph data structures and algorithms. We construct an undirected graph where nodes store latitude/longitude coordinates and edges store distances computed using the Haversine formula.
          </p>

          <pre className="code-block">
            <span className="keyword">import</span> <span className="signal">networkx</span> <span className="keyword">as</span> <span className="signal">nx</span><br/>
            <br/>
            <span className="keyword">def</span> <span className="signal">build_road_network</span>(<span className="signal">intersections</span>, <span className="signal">roads</span>):<br/>
            &nbsp;&nbsp;<span className="comment"># Create undirected graph (roads are bidirectional)</span><br/>
            &nbsp;&nbsp;<span className="signal">graph</span> <span className="operator">=</span> <span className="signal">nx</span>.<span className="signal">Graph</span>()<br/>
            <br/>
            &nbsp;&nbsp;<span className="comment"># Add nodes with geographic coordinates</span><br/>
            &nbsp;&nbsp;<span className="keyword">for</span> <span className="signal">node_id</span>, <span className="signal">lat</span>, <span className="signal">lon</span> <span className="keyword">in</span> <span className="signal">intersections</span>:<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">graph</span>.<span className="signal">add_node</span>(<span className="signal">node_id</span>, <span className="signal">lat</span><span className="operator">=</span><span className="signal">lat</span>, <span className="signal">lon</span><span className="operator">=</span><span className="signal">lon</span>)  <span className="comment"># Store lat/lon as node attributes</span><br/>
            <br/>
            &nbsp;&nbsp;<span className="comment"># Add edges with distance weights (road segments)</span><br/>
            &nbsp;&nbsp;<span className="keyword">for</span> <span className="signal">start</span>, <span className="signal">end</span>, <span className="signal">distance</span> <span className="keyword">in</span> <span className="signal">roads</span>:<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">graph</span>.<span className="signal">add_edge</span>(<span className="signal">start</span>, <span className="signal">end</span>, <span className="signal">weight</span><span className="operator">=</span><span className="signal">distance</span>)  <span className="comment"># Weight = road segment length</span><br/>
            <br/>
            &nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">graph</span>
          </pre>

          <p>
            <strong>Node Attributes:</strong> Storing latitude and longitude with each node allows us to snap rider/driver locations to the nearest graph node (finding the closest intersection to their GPS coordinates).
          </p>
          <p>
            <strong>Edge Weights:</strong> Edge weights are typically computed using the Haversine formula, which calculates great-circle distances between two geographic coordinates. For more accuracy, real-world systems use actual measured road segment lengths from mapping data.
          </p>
        </section>

        {/* Haversine Distance Section */}
        <section className="section">
          <h2>Haversine Distance</h2>
          <p>
            The <strong>Haversine formula</strong> calculates the great-circle distance between two points on a sphere (Earth) given their latitude and longitude. Unlike Euclidean distance, which assumes a flat plane, Haversine accounts for the Earth's curvature, providing accurate geographic distances.
          </p>
          <p>
            <strong>When to Use Haversine:</strong> For distances greater than a few kilometers, Euclidean distance (√(Δlat² + Δlon²)) can be off by 10-20%. Haversine is essential for accurate geographic calculations.
          </p>

          <h3>Python Implementation</h3>
          <pre className="code-block">
            <span className="keyword">from</span> <span className="signal">math</span> <span className="keyword">import</span> <span className="signal">radians</span>, <span className="signal">sin</span>, <span className="signal">cos</span>, <span className="signal">asin</span>, <span className="signal">sqrt</span><br/>
            <br/>
            <span className="keyword">def</span> <span className="signal">haversine_distance</span>(<span className="signal">lat1</span>, <span className="signal">lon1</span>, <span className="signal">lat2</span>, <span className="signal">lon2</span>):<br/>
            &nbsp;&nbsp;<span className="comment"># Convert latitude and longitude from degrees to radians</span><br/>
            &nbsp;&nbsp;<span className="signal">lat1</span>, <span className="signal">lon1</span>, <span className="signal">lat2</span>, <span className="signal">lon2</span> <span className="operator">=</span> <span className="keyword">map</span>(<span className="signal">radians</span>, [<span className="signal">lat1</span>, <span className="signal">lon1</span>, <span className="signal">lat2</span>, <span className="signal">lon2</span>])<br/>
            <br/>
            &nbsp;&nbsp;<span className="comment"># Haversine formula: compute differences</span><br/>
            &nbsp;&nbsp;<span className="signal">dlat</span> <span className="operator">=</span> <span className="signal">lat2</span> <span className="operator">-</span> <span className="signal">lat1</span>  <span className="comment"># Change in latitude</span><br/>
            &nbsp;&nbsp;<span className="signal">dlon</span> <span className="operator">=</span> <span className="signal">lon2</span> <span className="operator">-</span> <span className="signal">lon1</span>  <span className="comment"># Change in longitude</span><br/>
            <br/>
            &nbsp;&nbsp;<span className="comment"># Apply Haversine formula: a = sin²(Δlat/2) + cos(lat1)·cos(lat2)·sin²(Δlon/2)</span><br/>
            &nbsp;&nbsp;<span className="signal">a</span> <span className="operator">=</span> <span className="signal">sin</span>(<span className="signal">dlat</span> <span className="operator">/</span> <span className="number">2</span>)<span className="operator">**</span><span className="number">2</span> <span className="operator">+</span> <span className="signal">cos</span>(<span className="signal">lat1</span>) <span className="operator">*</span> <span className="signal">cos</span>(<span className="signal">lat2</span>) <span className="operator">*</span> <span className="signal">sin</span>(<span className="signal">dlon</span> <span className="operator">/</span> <span className="number">2</span>)<span className="operator">**</span><span className="number">2</span><br/>
            <br/>
            &nbsp;&nbsp;<span className="comment"># c = 2·arcsin(√a) - angular distance in radians</span><br/>
            &nbsp;&nbsp;<span className="signal">c</span> <span className="operator">=</span> <span className="number">2</span> <span className="operator">*</span> <span className="signal">asin</span>(<span className="signal">sqrt</span>(<span className="signal">a</span>))<br/>
            <br/>
            &nbsp;&nbsp;<span className="comment"># Earth radius in kilometers (mean radius)</span><br/>
            &nbsp;&nbsp;<span className="signal">R</span> <span className="operator">=</span> <span className="number">6371</span><br/>
            <br/>
            &nbsp;&nbsp;<span className="comment"># Distance = R × c (multiply angular distance by Earth radius)</span><br/>
            &nbsp;&nbsp;<span className="signal">distance</span> <span className="operator">=</span> <span className="signal">R</span> <span className="operator">*</span> <span className="signal">c</span><br/>
            <br/>
            &nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">distance</span>  <span className="comment"># Returns distance in kilometers</span>
          </pre>

          <p>
            <strong>Formula Breakdown:</strong>
          </p>
          <ul>
            <li><strong>Step 1:</strong> Convert degrees to radians (required for trigonometric functions)</li>
            <li><strong>Step 2:</strong> Compute Δlat and Δlon (differences between coordinates)</li>
            <li><strong>Step 3:</strong> Calculate intermediate value 'a' using sine and cosine terms</li>
            <li><strong>Step 4:</strong> Calculate angular distance 'c' using arcsine</li>
            <li><strong>Step 5:</strong> Multiply by Earth's radius (6371 km) to get distance in kilometers</li>
          </ul>
          <p>
            <strong>Why Not Euclidean?</strong> Euclidean distance treats lat/lon as Cartesian coordinates on a flat plane. This is fine for very small distances (under 1 km) but becomes increasingly inaccurate at larger scales. For a 10 km distance, Euclidean can be off by several hundred meters.
          </p>
        </section>

        {/* Dijkstra's Algorithm Section */}
        <section className="section">
          <h2>Dijkstra's Algorithm<span className="complexity-badge">O((V + E) log V)</span></h2>
          <p>
            <strong>Dijkstra's algorithm</strong> finds the shortest path from a source node to all other nodes (or to a specific target node) in a weighted graph with non-negative edge weights. It uses a <strong>greedy strategy</strong>: always expand the node with the smallest known distance first.
          </p>

          <h3>Algorithm Steps</h3>
          <ul>
            <li><strong>Initialize:</strong> Set distance to source = 0, all other nodes = infinity</li>
            <li><strong>Priority Queue:</strong> Use a min-heap to track nodes by their current shortest distance</li>
            <li><strong>Relaxation:</strong> For each node, check if going through it provides a shorter path to its neighbors</li>
            <li><strong>Early Termination:</strong> Stop when target node is popped from the queue (we've found the shortest path)</li>
            <li><strong>Path Reconstruction:</strong> Track predecessors to rebuild the actual path from source to target</li>
          </ul>

          <h3>Python Implementation</h3>
          <pre className="code-block">
            <span className="keyword">import</span> <span className="signal">heapq</span><br/>
            <br/>
            <span className="keyword">def</span> <span className="signal">dijkstra_shortest_path</span>(<span className="signal">graph</span>, <span className="signal">source</span>, <span className="signal">target</span>):<br/>
            &nbsp;&nbsp;<span className="comment"># Initialize distances: source = 0, all others = infinity</span><br/>
            &nbsp;&nbsp;<span className="signal">distances</span> <span className="operator">=</span> {'{'}node: <span className="keyword">float</span>(<span className="string">'inf'</span>) <span className="keyword">for</span> <span className="signal">node</span> <span className="keyword">in</span> <span className="signal">graph</span>.<span className="signal">nodes</span>()<span className="operator">}</span><br/>
            &nbsp;&nbsp;<span className="signal">distances</span>[<span className="signal">source</span>] <span className="operator">=</span> <span className="number">0</span><br/>
            <br/>
            &nbsp;&nbsp;<span className="comment"># Track predecessors for path reconstruction</span><br/>
            &nbsp;&nbsp;<span className="signal">predecessors</span> <span className="operator">=</span> {}<br/>
            <br/>
            &nbsp;&nbsp;<span className="comment"># Priority queue: (distance, node_id) - min-heap by distance</span><br/>
            &nbsp;&nbsp;<span className="signal">priority_queue</span> <span className="operator">=</span> [(<span className="number">0</span>, <span className="signal">source</span>)]<br/>
            &nbsp;&nbsp;<span className="signal">visited</span> <span className="operator">=</span> <span className="keyword">set</span>()<br/>
            <br/>
            &nbsp;&nbsp;<span className="keyword">while</span> <span className="signal">priority_queue</span>:<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment"># Pop node with minimum distance (O(log V) operation)</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">current_distance</span>, <span className="signal">current_node</span> <span className="operator">=</span> <span className="signal">heapq</span>.<span className="signal">heappop</span>(<span className="signal">priority_queue</span>)<br/>
            <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment"># Early termination: if we reached target, we have the shortest path</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> <span className="signal">current_node</span> <span className="operator">==</span> <span className="signal">target</span>:<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">break</span><br/>
            <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment"># Skip if already visited (stale queue entry)</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> <span className="signal">current_node</span> <span className="keyword">in</span> <span className="signal">visited</span>:<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">continue</span><br/>
            <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">visited</span>.<span className="signal">add</span>(<span className="signal">current_node</span>)<br/>
            <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment"># Relaxation: check all neighbors</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">for</span> <span className="signal">neighbor</span> <span className="keyword">in</span> <span className="signal">graph</span>.<span className="signal">neighbors</span>(<span className="signal">current_node</span>):<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">edge_weight</span> <span className="operator">=</span> <span className="signal">graph</span>[<span className="signal">current_node</span>][<span className="signal">neighbor</span>][<span className="string">'weight'</span>]  <span className="comment"># Get edge distance</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">new_distance</span> <span className="operator">=</span> <span className="signal">current_distance</span> <span className="operator">+</span> <span className="signal">edge_weight</span>  <span className="comment"># Distance through current node</span><br/>
            <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment"># If we found a shorter path, update distance and add to queue</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> <span className="signal">new_distance</span> <span className="operator">&lt;</span> <span className="signal">distances</span>[<span className="signal">neighbor</span>]:<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">distances</span>[<span className="signal">neighbor</span>] <span className="operator">=</span> <span className="signal">new_distance</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">predecessors</span>[<span className="signal">neighbor</span>] <span className="operator">=</span> <span className="signal">current_node</span>  <span className="comment"># Track path</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">heapq</span>.<span className="signal">heappush</span>(<span className="signal">priority_queue</span>, (<span className="signal">new_distance</span>, <span className="signal">neighbor</span>))<br/>
            <br/>
            &nbsp;&nbsp;<span className="comment"># Reconstruct path from source to target</span><br/>
            &nbsp;&nbsp;<span className="signal">path</span> <span className="operator">=</span> []<br/>
            &nbsp;&nbsp;<span className="signal">current</span> <span className="operator">=</span> <span className="signal">target</span><br/>
            &nbsp;&nbsp;<span className="keyword">while</span> <span className="signal">current</span> <span className="keyword">in</span> <span className="signal">predecessors</span>:<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">path</span>.<span className="signal">append</span>(<span className="signal">current</span>)<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">current</span> <span className="operator">=</span> <span className="signal">predecessors</span>[<span className="signal">current</span>]<br/>
            &nbsp;&nbsp;<span className="signal">path</span>.<span className="signal">append</span>(<span className="signal">source</span>)<br/>
            &nbsp;&nbsp;<span className="signal">path</span>.<span className="signal">reverse</span>()  <span className="comment"># Path was built backwards</span><br/>
            <br/>
            &nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">distances</span>[<span className="signal">target</span>], <span className="signal">path</span>
          </pre>

          <h3>Key Concepts</h3>
          <p>
            <strong>Priority Queue (Min-Heap):</strong> The priority queue ensures we always process the node with the smallest known distance next. This is critical for correctness - if we processed nodes in arbitrary order, we might visit a node before finding its true shortest path.
          </p>
          <p>
            <strong>Relaxation Step:</strong> For each neighbor, we check if going through the current node provides a shorter path than previously known. If yes, we update the distance and add it to the queue. This is called "relaxing" an edge.
          </p>
          <p>
            <strong>Early Termination:</strong> If we only need the distance to a single target node (not all nodes), we can stop as soon as we pop the target from the queue. At that moment, we've found the shortest path to the target.
          </p>
          <p>
            <strong>Why Non-Negative Weights?</strong> Dijkstra's greedy strategy assumes that once we pop a node from the queue, we've found its shortest path. Negative edge weights would violate this assumption - we might find a shorter path later by following a negative edge.
          </p>
        </section>

        {/* Priority Queue Section */}
        <section className="section">
          <h2>Priority Queue with heapq</h2>
          <p>
            Python's <strong>heapq</strong> module provides an efficient min-heap implementation for priority queue operations. The heap maintains the invariant that the smallest element is always at the root (index 0), enabling O(log n) insertions and deletions.
          </p>

          <h3>Heap Operations</h3>
          <pre className="code-block">
            <span className="keyword">import</span> <span className="signal">heapq</span><br/>
            <br/>
            <span className="comment"># Initialize empty priority queue (min-heap)</span><br/>
            <span className="signal">queue</span> <span className="operator">=</span> []<br/>
            <br/>
            <span className="comment"># Push (insert) an element: O(log n) time</span><br/>
            <span className="signal">heapq</span>.<span className="signal">heappush</span>(<span className="signal">queue</span>, (<span className="signal">distance</span>, <span className="signal">node_id</span>))  <span className="comment"># Tuple: (priority, data)</span><br/>
            <br/>
            <span className="comment"># Pop (extract) minimum element: O(log n) time</span><br/>
            <span className="signal">distance</span>, <span className="signal">node</span> <span className="operator">=</span> <span className="signal">heapq</span>.<span className="signal">heappop</span>(<span className="signal">queue</span>)  <span className="comment"># Returns smallest element</span><br/>
            <br/>
            <span className="comment"># Tuple comparison: Python compares tuples element-wise</span><br/>
            <span className="comment"># (5, 'A') &lt; (7, 'B') because 5 &lt; 7 (first element determines order)</span><br/>
            <span className="comment"># This makes (distance, node_id) tuples work perfectly for priority queues</span>
          </pre>

          <p>
            <strong>Tuple Comparison:</strong> When pushing tuples onto the heap, Python compares them element-by-element from left to right. The first element (distance) determines priority, so the node with the smallest distance is always popped first.
          </p>
          <p>
            <strong>Why Not a Sorted List?</strong> A sorted list would require O(n) time for every insertion (to maintain sorted order). A heap achieves O(log n) insertions and deletions by maintaining a weaker ordering invariant - only the parent-child relationship needs to be maintained, not full global order.
          </p>
          <p>
            <strong>Complexity Impact:</strong> With a priority queue, Dijkstra runs in O((V + E) log V) time. Without it (using a simple list), we'd need O(V²) time to find the minimum distance node on each iteration, making the algorithm impractical for large graphs.
          </p>
        </section>

        {/* Ride-Sharing Integration Section */}
        <section className="section">
          <h2>Ride-Sharing Integration</h2>
          <p>
            In the <Link to="/projects/cs330/docs/algorithm" style={'{ color: "#2E7D32", fontWeight: 600 }'}>Algorithm Evolution</Link> documentation, we introduced <strong>T5: KD-Tree + Dijkstra</strong> - a hybrid approach that combines spatial indexing with road network pathfinding. This section shows how Dijkstra integrates into the matching pipeline.
          </p>

          <h3>Two-Phase Matching Strategy</h3>
          <ul>
            <li><strong>Phase 1 - Spatial Filtering (KD-Tree):</strong> Use the <Link to="/projects/cs330/docs/kdtree" style={'{ color: "#2E7D32", fontWeight: 600 }'}>KD-Tree</Link> to find k nearest drivers by Euclidean distance (typically k=5-10). This narrows the search space from thousands of drivers to a handful of candidates.</li>
            <li><strong>Phase 2 - Road Distance Refinement (Dijkstra):</strong> For each candidate driver, compute the actual shortest road path distance using Dijkstra. Select the driver with the minimum road distance.</li>
          </ul>

          <h3>Python Implementation</h3>
          <pre className="code-block">
            <span className="keyword">from</span> <span className="signal">scipy.spatial</span> <span className="keyword">import</span> <span className="signal">KDTree</span><br/>
            <span className="keyword">import</span> <span className="signal">networkx</span> <span className="keyword">as</span> <span className="signal">nx</span><br/>
            <br/>
            <span className="keyword">def</span> <span className="signal">match_with_road_distance</span>(<span className="signal">rider</span>, <span className="signal">candidate_drivers</span>, <span className="signal">graph</span>):<br/>
            &nbsp;&nbsp;<span className="comment"># Step 1: Snap rider to nearest graph node (find closest intersection)</span><br/>
            &nbsp;&nbsp;<span className="signal">rider_node</span> <span className="operator">=</span> <span className="signal">find_nearest_node</span>(<span className="signal">graph</span>, <span className="signal">rider</span>.<span className="signal">lat</span>, <span className="signal">rider</span>.<span className="signal">lon</span>)<br/>
            <br/>
            &nbsp;&nbsp;<span className="signal">min_road_distance</span> <span className="operator">=</span> <span className="keyword">float</span>(<span className="string">'inf'</span>)<br/>
            &nbsp;&nbsp;<span className="signal">best_driver</span> <span className="operator">=</span> <span className="keyword">None</span><br/>
            <br/>
            &nbsp;&nbsp;<span className="comment"># Step 2: For each candidate driver (from KD-tree query)</span><br/>
            &nbsp;&nbsp;<span className="keyword">for</span> <span className="signal">driver</span> <span className="keyword">in</span> <span className="signal">candidate_drivers</span>:<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment"># Snap driver to nearest graph node</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">driver_node</span> <span className="operator">=</span> <span className="signal">find_nearest_node</span>(<span className="signal">graph</span>, <span className="signal">driver</span>.<span className="signal">lat</span>, <span className="signal">driver</span>.<span className="signal">lon</span>)<br/>
            <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">try</span>:<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment"># Run Dijkstra to compute shortest road path distance</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">road_distance</span> <span className="operator">=</span> <span className="signal">nx</span>.<span className="signal">shortest_path_length</span>(<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">graph</span>, <span className="signal">rider_node</span>, <span className="signal">driver_node</span>, <span className="signal">weight</span><span className="operator">=</span><span className="string">'weight'</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;)<br/>
            <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment"># Update best match if this driver is closer by road</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> <span className="signal">road_distance</span> <span className="operator">&lt;</span> <span className="signal">min_road_distance</span>:<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">min_road_distance</span> <span className="operator">=</span> <span className="signal">road_distance</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">best_driver</span> <span className="operator">=</span> <span className="signal">driver</span><br/>
            <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">except</span> <span className="signal">nx</span>.<span className="signal">NetworkXNoPath</span>:<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment"># No path exists (disconnected graph components)</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">continue</span><br/>
            <br/>
            &nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">best_driver</span>, <span className="signal">min_road_distance</span>
          </pre>

          <h3>Snapping to Road Network</h3>
          <p>
            Since rider/driver GPS coordinates don't perfectly align with graph nodes (intersections), we need to <strong>snap</strong> each location to its nearest node:
          </p>
          <pre className="code-block">
            <span className="keyword">def</span> <span className="signal">find_nearest_node</span>(<span className="signal">graph</span>, <span className="signal">lat</span>, <span className="signal">lon</span>):<br/>
            &nbsp;&nbsp;<span className="signal">min_distance</span> <span className="operator">=</span> <span className="keyword">float</span>(<span className="string">'inf'</span>)<br/>
            &nbsp;&nbsp;<span className="signal">nearest_node</span> <span className="operator">=</span> <span className="keyword">None</span><br/>
            <br/>
            &nbsp;&nbsp;<span className="comment"># Iterate through all nodes to find closest by Haversine distance</span><br/>
            &nbsp;&nbsp;<span className="keyword">for</span> <span className="signal">node</span> <span className="keyword">in</span> <span className="signal">graph</span>.<span className="signal">nodes</span>():<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">node_lat</span> <span className="operator">=</span> <span className="signal">graph</span>.<span className="signal">nodes</span>[<span className="signal">node</span>][<span className="string">'lat'</span>]<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">node_lon</span> <span className="operator">=</span> <span className="signal">graph</span>.<span className="signal">nodes</span>[<span className="signal">node</span>][<span className="string">'lon'</span>]<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">distance</span> <span className="operator">=</span> <span className="signal">haversine_distance</span>(<span className="signal">lat</span>, <span className="signal">lon</span>, <span className="signal">node_lat</span>, <span className="signal">node_lon</span>)<br/>
            <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> <span className="signal">distance</span> <span className="operator">&lt;</span> <span className="signal">min_distance</span>:<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">min_distance</span> <span className="operator">=</span> <span className="signal">distance</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">nearest_node</span> <span className="operator">=</span> <span className="signal">node</span><br/>
            <br/>
            &nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">nearest_node</span>
          </pre>

          <h3>Performance Tradeoff</h3>
          <p>
            <strong>Accuracy vs Speed:</strong> Euclidean distance is fast (O(1)) but inaccurate. Road distance is accurate but slow (O((V + E) log V)). The KD-Tree + Dijkstra hybrid balances both:
          </p>
          <ul>
            <li><strong>KD-Tree phase:</strong> O(log m) to find k candidates - eliminates 99% of drivers</li>
            <li><strong>Dijkstra phase:</strong> O(k × (V + E) log V) - only run k times (k ≈ 5-10), not m times (m ≈ 1000s)</li>
            <li><strong>Total complexity:</strong> O(log m + k × (V + E) log V) - practical for real-time matching</li>
          </ul>
          <p>
            <strong>Real-World Impact:</strong> In cities with rivers, highways, and one-way streets, road distance often differs from Euclidean distance by 2-3×. This hybrid approach provides 90%+ of the accuracy of pure road-based matching at a fraction of the computational cost.
          </p>
        </section>

        {/* Explore Further Section */}
        <section className="section">
          <h2>Explore Further</h2>
          <div className="quick-links">
            <Link to="/projects/cs330/docs/algorithm" className="quick-link">Algorithm Evolution →</Link>
            <Link to="/projects/cs330/docs/kdtree" className="quick-link">KD-Tree Implementation →</Link>
            <a href="https://networkx.org/documentation/stable/reference/algorithms/generated/networkx.algorithms.shortest_paths.weighted.dijkstra_path.html" target="_blank" rel="noopener noreferrer" className="quick-link">NetworkX Dijkstra Docs →</a>
            <a href="https://github.com/AaronDiefes/cs330-case-study" target="_blank" rel="noopener noreferrer" className="quick-link">View Source on GitHub →</a>
            <Link to="/projects/cs330/docs" className="quick-link">Back to CS330 Documentation →</Link>
          </div>
        </section>
      </div>

      <footer style={'{ background: "#2c3e50", color: "#ecf0f1", padding: "3rem 2rem 2rem", marginTop: "4rem" }'}>
        <div style={'{ maxWidth: "1200px", margin: "0 auto" }'}>
          <div style={'{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "3rem", marginBottom: "2rem" }'}>
            {/* About Section */}
            <div>
              <h3 style={'{ color: "#2E7D32", marginBottom: "1rem", fontSize: "1.2rem" }'}>Aaron Diefes</h3>
              <p style={'{ color: "#bdc3c7", lineHeight: 1.8, marginBottom: "1rem" }'}>Software Engineer passionate about algorithm design and efficient data structures.</p>
              <p style={'{ color: "#bdc3c7", lineHeight: 1.8 }'}>Building solutions that balance performance, scalability, and code clarity.</p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 style={'{ color: "#2E7D32", marginBottom: "1rem", fontSize: "1.2rem" }'}>Navigation</h3>
              <ul style={'{ listStyle: "none", padding: 0 }'}>
                <li style={'{ marginBottom: "0.75rem" }'}><Link to="/" style={'{ color: "#ecf0f1", textDecoration: "none", transition: "color 0.15s" }'}>← Portfolio Home</Link></li>
                <li style={'{ marginBottom: "0.75rem" }'}><Link to="/projects/cs330/docs" style={'{ color: "#ecf0f1", textDecoration: "none", transition: "color 0.15s" }'}>CS330 Documentation</Link></li>
                <li style={'{ marginBottom: "0.75rem" }'}><Link to="/projects/cs330/docs/algorithm" style={'{ color: "#ecf0f1", textDecoration: "none", transition: "color 0.15s" }'}>Algorithm Evolution</Link></li>
                <li style={'{ marginBottom: "0.75rem" }'}><Link to="/projects/cs330/docs/kdtree" style={'{ color: "#ecf0f1", textDecoration: "none", transition: "color 0.15s" }'}>KD-Tree</Link></li>
                <li style={'{ marginBottom: "0.75rem", color: "#95a5a6" }'}>Pathfinding</li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 style={'{ color: "#2E7D32", marginBottom: "1rem", fontSize: "1.2rem" }'}>Resources</h3>
              <ul style={'{ listStyle: "none", padding: 0 }'}>
                <li style={'{ marginBottom: "0.75rem" }'}><a href="https://github.com/AaronDiefes" target="_blank" rel="noopener noreferrer" style={'{ color: "#ecf0f1", textDecoration: "none", transition: "color 0.15s" }'}>GitHub Profile</a></li>
                <li style={'{ marginBottom: "0.75rem" }'}><a href="https://github.com/AaronDiefes/cs330-case-study" target="_blank" rel="noopener noreferrer" style={'{ color: "#ecf0f1", textDecoration: "none", transition: "color 0.15s" }'}>CS330 Case Study Repo</a></li>
                <li style={'{ marginBottom: "0.75rem" }'}><a href="https://github.com/AaronDiefes/AaronDiefes.github.io" target="_blank" rel="noopener noreferrer" style={'{ color: "#ecf0f1", textDecoration: "none", transition: "color 0.15s" }'}>Portfolio Repo</a></li>
              </ul>
            </div>

            {/* Tech Stack */}
            <div>
              <h3 style={'{ color: "#2E7D32", marginBottom: "1rem", fontSize: "1.2rem" }'}>Built With</h3>
              <ul style={'{ listStyle: "none", padding: 0, color: "#bdc3c7" }'}>
                <li style={'{ marginBottom: "0.75rem" }'}>• Python</li>
                <li style={'{ marginBottom: "0.75rem" }'}>• NetworkX</li>
                <li style={'{ marginBottom: "0.75rem" }'}>• KD-Trees</li>
                <li style={'{ marginBottom: "0.75rem" }'}>• Matplotlib</li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={'{ borderTop: "1px solid #34495e", paddingTop: "2rem", textAlign: "center", color: "#95a5a6" }'}>
            <p>© 2026 Aaron Diefes. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Cs330PathfindingPage
