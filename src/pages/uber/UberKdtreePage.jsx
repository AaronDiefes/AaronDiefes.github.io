import React from 'react'
import { Link } from 'react-router-dom'
import DocsLayout from '../../components/docs/DocsLayout'
import DocsSection from '../../components/docs/DocsSection'

const TOC = [
  { id: 'overview', label: 'Overview', level: 2 },
  { id: 'node-structure', label: 'Node Structure', level: 2 },
  { id: 'tree-construction', label: 'Tree Construction', level: 2 },
  { id: 'nearest-neighbor-search', label: 'Nearest Neighbor Search', level: 2 },
  { id: 'ride-sharing-integration', label: 'Ride-Sharing Integration', level: 2 }
]

function UberKdtreePage() {
  return (
    <DocsLayout
      project="uber"
      currentSlug="kdtree"
      title="KD-Tree Spatial Indexing"
      subtitle="Efficient Nearest-Neighbor Queries for Ride-Sharing"
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
      `}</style>

      <DocsSection id="overview" title="Overview">
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
      </DocsSection>

      <DocsSection id="node-structure" title="Node Structure">
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
      </DocsSection>

      <DocsSection id="tree-construction" title="Tree Construction">
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
      </DocsSection>

      <DocsSection id="nearest-neighbor-search" title="Nearest Neighbor Search">
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
      </DocsSection>

      <DocsSection id="ride-sharing-integration" title="Ride-Sharing Integration">
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
      </DocsSection>
    </DocsLayout>
  )
}

export default UberKdtreePage
