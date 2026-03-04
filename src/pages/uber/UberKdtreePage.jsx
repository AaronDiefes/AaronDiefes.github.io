import React from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../../components/shared/Breadcrumbs'

function UberKdtreePage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Uber Algorithmic System', href: '/projects/uber/docs' },
    { label: 'Documentation', href: '/projects/uber/docs' },
    { label: 'KD-Tree Spatial Indexing' }
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
        <h1>KD-Tree Spatial Indexing</h1>
        <p>Efficient Nearest-Neighbor Queries for Ride-Sharing</p>
      </header>

      <div className="container">
        {/* Overview Section */}
        <section className="section">
          <h2>Overview</h2>
          <p>
            A <strong>KD-Tree (k-dimensional tree)</strong> is a binary search tree data structure that partitions space for efficient spatial queries. In the ride-sharing matching problem, KD-Trees enable <strong>O(log n) nearest-neighbor searches</strong> instead of O(n) brute-force scans, dramatically improving performance at scale.
          </p>
          <p>
            <strong>Why KD-Trees for Ride-Sharing?</strong>
          </p>
          <ul>
            <li><strong>Spatial Partitioning:</strong> The tree recursively divides 2D coordinate space (latitude, longitude) by alternating axis splits, creating balanced regions.</li>
            <li><strong>Fast Queries:</strong> Finding the nearest driver to a rider takes O(log n) time on average, compared to O(n) for checking every driver.</li>
            <li><strong>Adaptive Structure:</strong> Unlike fixed grid partitioning, KD-Trees adapt to data distribution through median-split construction.</li>
          </ul>

          <h3>Time Complexities</h3>
          <ul>
            <li><strong>Construction:</strong> <span className="complexity-badge">O(n log n)</span> - Sorting and recursive median splits</li>
            <li><strong>Nearest-Neighbor Query:</strong> <span className="complexity-badge">O(log n) average</span>, O(n) worst case - Tree traversal with branch pruning</li>
            <li><strong>Space:</strong> <span className="complexity-badge">O(n)</span> - One node per point</li>
          </ul>

          <p>
            <strong>2D Context:</strong> For ride-sharing, we work with 2D points representing (latitude, longitude) coordinates. The tree alternates splitting on axis 0 (latitude) and axis 1 (longitude) as it descends.
          </p>
        </section>

        {/* Node Structure Section */}
        <section className="section">
          <h2>Node Structure<span className="complexity-badge">Data Structure</span></h2>
          <p>
            Each node in the KD-Tree stores a single point and information about how space is partitioned at that level. The <strong>axis</strong> field determines which coordinate dimension is used for splitting: left children have smaller values on that axis, right children have larger or equal values.
          </p>

          <h3>KDNode Class Definition</h3>
          <pre className="code-block">
            <span className="keyword">class</span> <span className="signal">KDNode</span>:<br/>
            &nbsp;&nbsp;<span className="keyword">def</span> <span className="signal">__init__</span>(<span className="signal">self</span>, <span className="signal">point</span>, <span className="signal">axis</span>, <span className="signal">left</span><span className="operator">=</span><span className="keyword">None</span>, <span className="signal">right</span><span className="operator">=</span><span className="keyword">None</span>):<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">self</span>.<span className="signal">point</span> <span className="operator">=</span> <span className="signal">point</span>       <span className="comment"># (lat, lon) tuple representing driver location</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">self</span>.<span className="signal">axis</span> <span className="operator">=</span> <span className="signal">axis</span>         <span className="comment"># 0=latitude split, 1=longitude split</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">self</span>.<span className="signal">left</span> <span className="operator">=</span> <span className="signal">left</span>         <span className="comment"># Subtree with points &lt; median on axis</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">self</span>.<span className="signal">right</span> <span className="operator">=</span> <span className="signal">right</span>       <span className="comment"># Subtree with points &gt;= median on axis</span>
          </pre>

          <h3>Attribute Explanation</h3>
          <ul>
            <li><strong>point:</strong> A tuple (latitude, longitude) representing a driver's location in 2D space.</li>
            <li><strong>axis:</strong> The dimension used for partitioning at this node (0 for latitude, 1 for longitude). Alternates with tree depth.</li>
            <li><strong>left:</strong> Pointer to the left child subtree, containing all points with coordinate values less than this node's value on the splitting axis.</li>
            <li><strong>right:</strong> Pointer to the right child subtree, containing all points with coordinate values greater than or equal to this node's value on the splitting axis.</li>
          </ul>

          <h3>Axis Alternation</h3>
          <p>
            The splitting axis alternates with tree depth to ensure balanced partitioning across all dimensions:
          </p>
          <ul>
            <li><strong>Depth 0:</strong> Split on latitude (axis 0) - points are divided north/south</li>
            <li><strong>Depth 1:</strong> Split on longitude (axis 1) - points are divided east/west</li>
            <li><strong>Depth 2:</strong> Split on latitude (axis 0) - alternation continues...</li>
          </ul>
          <p>
            Formula: <code>axis = depth % 2</code> (for 2D trees)
          </p>
        </section>

        {/* Tree Construction Section */}
        <section className="section">
          <h2>Tree Construction<span className="complexity-badge">O(n log n)</span></h2>
          <p>
            Building a balanced KD-Tree involves <strong>recursive median-split partitioning</strong>. At each level, we sort points by the current axis coordinate, select the median as the split point, and recursively build left and right subtrees. This ensures the tree is balanced, keeping query time logarithmic.
          </p>

          <h3>Build Algorithm</h3>
          <pre className="code-block">
            <span className="keyword">def</span> <span className="signal">build_kdtree</span>(<span className="signal">points</span>, <span className="signal">depth</span><span className="operator">=</span><span className="number">0</span>):<br/>
            &nbsp;&nbsp;<span className="comment"># Base case: empty list returns None</span><br/>
            &nbsp;&nbsp;<span className="keyword">if</span> <span className="keyword">not</span> <span className="signal">points</span>:<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> <span className="keyword">None</span><br/>
            <br/>
            &nbsp;&nbsp;<span className="comment"># Calculate splitting axis from depth (alternates 0, 1, 0, 1, ...)</span><br/>
            &nbsp;&nbsp;<span className="signal">axis</span> <span className="operator">=</span> <span className="signal">depth</span> <span className="operator">%</span> <span className="number">2</span>  <span className="comment"># 0=latitude, 1=longitude</span><br/>
            <br/>
            &nbsp;&nbsp;<span className="comment"># Sort points by current axis coordinate</span><br/>
            &nbsp;&nbsp;<span className="signal">sorted_points</span> <span className="operator">=</span> <span className="keyword">sorted</span>(<span className="signal">points</span>, <span className="signal">key</span><span className="operator">=</span><span className="keyword">lambda</span> <span className="signal">p</span>: <span className="signal">p</span>[<span className="signal">axis</span>])<br/>
            <br/>
            &nbsp;&nbsp;<span className="comment"># Find median index (middle element becomes root)</span><br/>
            &nbsp;&nbsp;<span className="signal">median_idx</span> <span className="operator">=</span> <span className="keyword">len</span>(<span className="signal">sorted_points</span>) <span className="operator">//</span> <span className="number">2</span><br/>
            <br/>
            &nbsp;&nbsp;<span className="comment"># Create node with median point as the splitting hyperplane</span><br/>
            &nbsp;&nbsp;<span className="signal">node</span> <span className="operator">=</span> <span className="signal">KDNode</span>(<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">point</span><span className="operator">=</span><span className="signal">sorted_points</span>[<span className="signal">median_idx</span>],<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">axis</span><span className="operator">=</span><span className="signal">axis</span>,<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment"># Recursively build left subtree (points before median)</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">left</span><span className="operator">=</span><span className="signal">build_kdtree</span>(<span className="signal">sorted_points</span>[:<span className="signal">median_idx</span>], <span className="signal">depth</span> <span className="operator">+</span> <span className="number">1</span>),<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment"># Recursively build right subtree (points after median)</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">right</span><span className="operator">=</span><span className="signal">build_kdtree</span>(<span className="signal">sorted_points</span>[<span className="signal">median_idx</span> <span className="operator">+</span> <span className="number">1</span>:], <span className="signal">depth</span> <span className="operator">+</span> <span className="number">1</span>)<br/>
            &nbsp;&nbsp;)<br/>
            <br/>
            &nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">node</span>
          </pre>

          <h3>Why Median Splitting Creates Balance</h3>
          <p>
            Selecting the <strong>median</strong> as the split point ensures that exactly half the points fall on each side of the partition (left subtree has ⌊n/2⌋ points, right subtree has ⌈n/2⌉ points). This creates a balanced tree where the height is O(log n), keeping query operations efficient.
          </p>
          <p>
            <strong>Construction Complexity:</strong> At each level, we sort O(n) points in O(n log n) time, but this happens only once per level. The recursion depth is O(log n), so total time is O(n log n).
          </p>
        </section>

        {/* Nearest Neighbor Search Section */}
        <section className="section">
          <h2>Nearest Neighbor Search<span className="complexity-badge">O(log n) average</span></h2>
          <p>
            The power of KD-Trees comes from <strong>efficient pruning</strong> during nearest-neighbor queries. Instead of checking every point, we traverse the tree and skip entire subtrees that cannot possibly contain a closer point than our current best.
          </p>

          <h3>Search Algorithm with Pruning</h3>
          <pre className="code-block">
            <span className="keyword">def</span> <span className="signal">find_nearest</span>(<span className="signal">node</span>, <span className="signal">target</span>, <span className="signal">best</span><span className="operator">=</span><span className="keyword">None</span>, <span className="signal">best_dist</span><span className="operator">=</span><span className="keyword">float</span>(<span className="string">'inf'</span>)):<br/>
            &nbsp;&nbsp;<span className="comment"># Base case: reached a null node, return current best</span><br/>
            &nbsp;&nbsp;<span className="keyword">if</span> <span className="signal">node</span> <span className="keyword">is</span> <span className="keyword">None</span>:<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">best</span>, <span className="signal">best_dist</span><br/>
            <br/>
            &nbsp;&nbsp;<span className="comment"># Compute Euclidean distance from target to current node's point</span><br/>
            &nbsp;&nbsp;<span className="signal">distance</span> <span className="operator">=</span> <span className="signal">sqrt</span>((<span className="signal">target</span>[<span className="number">0</span>] <span className="operator">-</span> <span className="signal">node</span>.<span className="signal">point</span>[<span className="number">0</span>])<span className="operator">**</span><span className="number">2</span> <span className="operator">+</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(<span className="signal">target</span>[<span className="number">1</span>] <span className="operator">-</span> <span className="signal">node</span>.<span className="signal">point</span>[<span className="number">1</span>])<span className="operator">**</span><span className="number">2</span>)<br/>
            <br/>
            &nbsp;&nbsp;<span className="comment"># Update best if current node is closer</span><br/>
            &nbsp;&nbsp;<span className="keyword">if</span> <span className="signal">distance</span> <span className="operator">&lt;</span> <span className="signal">best_dist</span>:<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">best</span> <span className="operator">=</span> <span className="signal">node</span>.<span className="signal">point</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">best_dist</span> <span className="operator">=</span> <span className="signal">distance</span><br/>
            <br/>
            &nbsp;&nbsp;<span className="comment"># Determine which subtree to search first (same side as target)</span><br/>
            &nbsp;&nbsp;<span className="keyword">if</span> <span className="signal">target</span>[<span className="signal">node</span>.<span className="signal">axis</span>] <span className="operator">&lt;</span> <span className="signal">node</span>.<span className="signal">point</span>[<span className="signal">node</span>.<span className="signal">axis</span>]:<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">near_subtree</span> <span className="operator">=</span> <span className="signal">node</span>.<span className="signal">left</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">far_subtree</span> <span className="operator">=</span> <span className="signal">node</span>.<span className="signal">right</span><br/>
            &nbsp;&nbsp;<span className="keyword">else</span>:<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">near_subtree</span> <span className="operator">=</span> <span className="signal">node</span>.<span className="signal">right</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">far_subtree</span> <span className="operator">=</span> <span className="signal">node</span>.<span className="signal">left</span><br/>
            <br/>
            &nbsp;&nbsp;<span className="comment"># Recursively search the near subtree first</span><br/>
            &nbsp;&nbsp;<span className="signal">best</span>, <span className="signal">best_dist</span> <span className="operator">=</span> <span className="signal">find_nearest</span>(<span className="signal">near_subtree</span>, <span className="signal">target</span>, <span className="signal">best</span>, <span className="signal">best_dist</span>)<br/>
            <br/>
            &nbsp;&nbsp;<span className="comment"># Check if far subtree could contain a closer point (KEY OPTIMIZATION)</span><br/>
            &nbsp;&nbsp;<span className="signal">plane_distance</span> <span className="operator">=</span> <span className="keyword">abs</span>(<span className="signal">target</span>[<span className="signal">node</span>.<span className="signal">axis</span>] <span className="operator">-</span> <span className="signal">node</span>.<span className="signal">point</span>[<span className="signal">node</span>.<span className="signal">axis</span>])<br/>
            &nbsp;&nbsp;<span className="keyword">if</span> <span className="signal">plane_distance</span> <span className="operator">&lt;</span> <span className="signal">best_dist</span>:<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment"># Splitting plane intersects search radius - must check far subtree</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">best</span>, <span className="signal">best_dist</span> <span className="operator">=</span> <span className="signal">find_nearest</span>(<span className="signal">far_subtree</span>, <span className="signal">target</span>, <span className="signal">best</span>, <span className="signal">best_dist</span>)<br/>
            <br/>
            &nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">best</span>, <span className="signal">best_dist</span>
          </pre>

          <h3>The Pruning Decision</h3>
          <p>
            The key to O(log n) performance is the <strong>splitting plane distance check</strong>. The splitting plane at each node divides space into two half-spaces. If the distance from the target point to the splitting plane is greater than the current best distance, the entire far subtree can be pruned because <em>no point in that subtree can be closer than our current best</em>.
          </p>
          <p>
            <strong>Example:</strong> Searching for nearest driver to rider at (40.75, -74.00) with current best distance 0.5 km. At a node splitting on latitude 40.80, the plane distance is |40.75 - 40.80| = 0.05 degrees ≈ 5.5 km. If best_dist = 0.5 km &lt; 5.5 km, we must check the far subtree. If best_dist = 10 km &gt; 5.5 km, we can skip the far subtree entirely.
          </p>

          <h3>Complexity Analysis</h3>
          <ul>
            <li><strong>Average Case:</strong> O(log n) - In balanced trees with uniformly distributed data, most subtrees are pruned.</li>
            <li><strong>Worst Case:</strong> O(n) - If all points lie on a line or tree is heavily imbalanced, pruning fails and we must check most nodes.</li>
          </ul>
        </section>

        {/* Ride-Sharing Integration Section */}
        <section className="section">
          <h2>Ride-Sharing Integration</h2>
          <p>
            In the T4 algorithm from the <Link to="/projects/uber/docs/algorithm" style={{ color: '#2E7D32', fontWeight: 600 }}>Algorithm Evolution</Link> page, KD-Trees replace brute-force driver scanning. The matching workflow builds a tree once from all driver locations, then queries it for each rider to find the nearest available driver.
          </p>

          <h3>Matching with KD-Tree</h3>
          <pre className="code-block">
            <span className="keyword">from</span> <span className="signal">scipy.spatial</span> <span className="keyword">import</span> <span className="signal">KDTree</span><br/>
            <br/>
            <span className="keyword">def</span> <span className="signal">match_with_kdtree</span>(<span className="signal">riders</span>, <span className="signal">drivers</span>):<br/>
            &nbsp;&nbsp;<span className="comment"># Extract driver locations as (lat, lon) tuples</span><br/>
            &nbsp;&nbsp;<span className="signal">driver_coords</span> <span className="operator">=</span> [(<span className="signal">d</span>.<span className="signal">lat</span>, <span className="signal">d</span>.<span className="signal">lon</span>) <span className="keyword">for</span> <span className="signal">d</span> <span className="keyword">in</span> <span className="signal">drivers</span>]<br/>
            <br/>
            &nbsp;&nbsp;<span className="comment"># Build KD-Tree from driver points: O(m log m) construction</span><br/>
            &nbsp;&nbsp;<span className="signal">tree</span> <span className="operator">=</span> <span className="signal">KDTree</span>(<span className="signal">driver_coords</span>)<br/>
            <br/>
            &nbsp;&nbsp;<span className="signal">matches</span> <span className="operator">=</span> []<br/>
            &nbsp;&nbsp;<span className="signal">matched_indices</span> <span className="operator">=</span> <span className="keyword">set</span>()  <span className="comment"># Track which drivers are already matched</span><br/>
            <br/>
            &nbsp;&nbsp;<span className="keyword">for</span> <span className="signal">rider</span> <span className="keyword">in</span> <span className="signal">riders</span>:<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment"># Query tree for k=10 nearest drivers: O(log m) query</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">distances</span>, <span className="signal">indices</span> <span className="operator">=</span> <span className="signal">tree</span>.<span className="signal">query</span>([<span className="signal">rider</span>.<span className="signal">lat</span>, <span className="signal">rider</span>.<span className="signal">lon</span>], <span className="signal">k</span><span className="operator">=</span><span className="number">10</span>)<br/>
            <br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="comment"># Find first unmatched driver from nearest neighbors</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">for</span> <span className="signal">dist</span>, <span className="signal">idx</span> <span className="keyword">in</span> <span className="keyword">zip</span>(<span className="signal">distances</span>, <span className="signal">indices</span>):<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> <span className="signal">idx</span> <span className="keyword">not</span> <span className="keyword">in</span> <span className="signal">matched_indices</span>:<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">best_driver</span> <span className="operator">=</span> <span className="signal">drivers</span>[<span className="signal">idx</span>]<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">matches</span>.<span className="signal">append</span>((<span className="signal">rider</span>, <span className="signal">best_driver</span>))<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">matched_indices</span>.<span className="signal">add</span>(<span className="signal">idx</span>)  <span className="comment"># Mark driver as unavailable</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">break</span><br/>
            <br/>
            &nbsp;&nbsp;<span className="keyword">return</span> <span className="signal">matches</span>
          </pre>

          <h3>Handling Already-Matched Drivers</h3>
          <p>
            A limitation of static KD-Trees is that they don't support efficient deletion. Once a driver is matched, they should be unavailable for subsequent matches. The solution: query for k nearest neighbors (e.g., k=10) and select the first unmatched driver from the result set. This works well when k is large enough relative to the number of riders.
          </p>

          <h3>Alternative Strategies</h3>
          <ul>
            <li><strong>Rebuild After Each Match:</strong> Reconstruct the tree after each match to exclude matched drivers. Cost: O(m log m) per match, too expensive.</li>
            <li><strong>Dynamic KD-Tree:</strong> Use a modified tree structure that supports deletion. Complex to implement and often slower than querying for k neighbors.</li>
            <li><strong>Batch Matching:</strong> Collect all rider requests in a batch, then solve as an assignment problem using Hungarian algorithm. Better global optimality but higher latency.</li>
          </ul>
        </section>

        {/* Explore Further Section */}
        <section className="section">
          <h2>Explore Further</h2>
          <div className="quick-links">
            <Link to="/projects/uber/docs/algorithm" className="quick-link">Algorithm Evolution (T1-T5) →</Link>
            <Link to="/projects/uber/docs/pathfinding" className="quick-link">Pathfinding with Dijkstra →</Link>
            <a href="https://docs.scipy.org/doc/scipy/reference/generated/scipy.spatial.KDTree.html" target="_blank" rel="noopener noreferrer" className="quick-link">SciPy KDTree Reference →</a>
            <a href="https://github.com/AaronDiefes/cs330-case-study" target="_blank" rel="noopener noreferrer" className="quick-link">View Source on GitHub →</a>
            <Link to="/projects/uber/docs" className="quick-link">Back to CS330 Documentation →</Link>
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
                <li style={{ marginBottom: '0.75rem' }}><Link to="/projects/uber/docs" style={{ color: '#ecf0f1', textDecoration: 'none', transition: 'color 0.15s' }}>CS330 Documentation</Link></li>
                <li style={{ marginBottom: '0.75rem' }}><Link to="/projects/uber/docs/algorithm" style={{ color: '#ecf0f1', textDecoration: 'none', transition: 'color 0.15s' }}>Algorithm Evolution</Link></li>
                <li style={{ marginBottom: '0.75rem', color: '#95a5a6' }}>KD-Tree</li>
                <li style={{ marginBottom: '0.75rem' }}><Link to="/projects/uber/docs/pathfinding" style={{ color: '#ecf0f1', textDecoration: 'none', transition: 'color 0.15s' }}>Pathfinding</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 style={{ color: '#2E7D32', marginBottom: '1rem', fontSize: '1.2rem' }}>Resources</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '0.75rem' }}><a href="https://github.com/AaronDiefes" target="_blank" rel="noopener noreferrer" style={{ color: '#ecf0f1', textDecoration: 'none', transition: 'color 0.15s' }}>GitHub Profile</a></li>
                <li style={{ marginBottom: '0.75rem' }}><a href="https://github.com/AaronDiefes/cs330-case-study" target="_blank" rel="noopener noreferrer" style={{ color: '#ecf0f1', textDecoration: 'none', transition: 'color 0.15s' }}>Uber Algorithmic System Repo</a></li>
                <li style={{ marginBottom: '0.75rem' }}><a href="https://github.com/AaronDiefes/AaronDiefes.github.io" target="_blank" rel="noopener noreferrer" style={{ color: '#ecf0f1', textDecoration: 'none', transition: 'color 0.15s' }}>Portfolio Repo</a></li>
              </ul>
            </div>

            {/* Tech Stack */}
            <div>
              <h3 style={{ color: '#2E7D32', marginBottom: '1rem', fontSize: '1.2rem' }}>Built With</h3>
              <ul style={{ listStyle: 'none', padding: 0, color: '#bdc3c7' }}>
                <li style={{ marginBottom: '0.75rem' }}>• Python</li>
                <li style={{ marginBottom: '0.75rem' }}>• SciPy KDTree</li>
                <li style={{ marginBottom: '0.75rem' }}>• NetworkX</li>
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

export default UberKdtreePage
