import React from 'react'
import { Link } from 'react-router-dom'
import { DOCS_NAV } from '../../lib/docs-nav'

function UberDocsLanding() {
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

        .landing-nav {
            display: flex;
            justify-content: center;
            gap: 1.5rem;
            margin-top: 1.5rem;
        }

        .landing-nav a {
            color: white;
            text-decoration: none;
            padding: 0.5rem 1rem;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            backdrop-filter: blur(10px);
            transition: background 0.3s;
        }

        .landing-nav a:hover {
            background: rgba(255, 255, 255, 0.3);
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

        .doc-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-top: 2rem;
        }

        .doc-card {
            background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
            color: white;
            padding: 2rem;
            border-radius: 12px;
            transition: transform 0.3s, box-shadow 0.3s;
            cursor: pointer;
            text-decoration: none;
            display: block;
        }

        .doc-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(46, 125, 50, 0.3);
        }

        .doc-card h3 {
            font-size: 1.5rem;
            margin: 0 0 1rem 0;
            color: white;
        }

        .doc-card .pa-label {
            display: none;
        }

        .doc-card p {
            margin: 0;
            opacity: 0.95;
            color: white;
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

            .doc-cards {
                grid-template-columns: 1fr;
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

      <header className="landing-header">
        <h1>Uber Algorithmic System</h1>
        <p>Ride-Sharing Matching Algorithm Design</p>
      </header>

      <div className="container">
        {/* About the Project */}
        <section className="section">
          <h2>About the Project</h2>

          <h3>What is this?</h3>
          <p>
            This is an <strong>algorithm design case study</strong> from Stanford CS330. The project explores the design, implementation, and optimization of algorithms for a ride-sharing platform that matches riders with nearby drivers efficiently.
          </p>

          <h3>The Problem</h3>
          <p>
            Design an efficient system for a ride-sharing platform to match riders with nearby available drivers in real-time. The system must handle spatial queries, compute road network distances, and optimize matches while scaling to thousands of drivers and riders.
          </p>

          <h3>The Approach</h3>
          <p>
            The case study demonstrates <strong>progressive algorithm evolution</strong>, starting with a naive brute-force approach (T1) and evolving through five iterations (T1-T5) to reach an optimized solution using spatial indexing and graph-based pathfinding. Each iteration analyzes performance using D1 (average distance) and D2 (maximum distance) metrics.
          </p>

          <h3>The Nine Algorithms</h3>
          <p>
            The project implements and analyzes <strong>nine distinct matching algorithms</strong>, each building on insights from previous iterations:
          </p>
          <p style={{ marginTop: '1rem', marginBottom: '0.5rem' }}><strong>Core Algorithm Progression (T1-T5):</strong></p>
          <ul style={{ lineHeight: 1.8, color: '#555', marginBottom: '1.5rem' }}>
            <li><strong>T1: Brute Force</strong> - Exhaustive driver evaluation for each passenger</li>
            <li><strong>T2: Sorted Distance</strong> - Pre-sorting with early termination optimization</li>
            <li><strong>T3: Grid-Based Partitioning</strong> - Spatial grid cells for localized search</li>
            <li><strong>T4: KD-Tree Nearest Neighbor</strong> - Balanced tree structure for O(log n) queries</li>
            <li><strong>T5: KD-Tree + Road Network</strong> - Spatial indexing with Dijkstra pathfinding</li>
          </ul>
          <p style={{ marginBottom: '0.5rem' }}><strong>Bonus Optimizations (B1-B4):</strong></p>
          <ul style={{ lineHeight: 1.8, color: '#555' }}>
            <li><strong>B1: Manhattan Routing</strong> - Grid-optimized distance metric for urban areas</li>
            <li><strong>B2: Workload Balancing</strong> - Exponential penalty for driver fairness</li>
            <li><strong>B3: Traffic-Aware Routing</strong> - Dynamic congestion modeling and adaptation</li>
            <li><strong>B4: Hybrid Caching</strong> - Aggressive path caching with binary search</li>
          </ul>
        </section>

        {/* Documentation Cards */}
        <section className="section">
          <h2>Explore the Implementation</h2>
          <p>
            Each documentation page explains the algorithm design, shows the Python implementation, and provides detailed performance analysis with visual graphs and metrics.
          </p>

          <div className="doc-cards">
            {DOCS_NAV.uber.pages.map((page) => (
              <Link key={page.slug} to={page.href} className="doc-card">
                <h3>{page.label}</h3>
                <p>{page.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section className="section">
          <h2>Explore Further</h2>
          <div className="quick-links">
            <a href="https://github.com/AaronDiefes/cs330-case-study" target="_blank" rel="noopener noreferrer" className="quick-link">View Source on GitHub →</a>
            <Link to="/" className="quick-link">Back to Portfolio →</Link>
          </div>
        </section>
      </div>

      <footer>
        <p>&copy; {new Date().getFullYear()} Aaron Diefes. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default UberDocsLanding
