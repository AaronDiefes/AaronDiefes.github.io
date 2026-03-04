import React from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../../components/shared/Breadcrumbs'

function UberDocsLanding() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Uber Algorithmic System', href: '/projects/uber/docs' },
    { label: 'Documentation' }
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

      <Breadcrumbs items={breadcrumbItems} />

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

          <p>
            <strong>Key Highlights:</strong>
          </p>
          <ul style={{ lineHeight: 1.8, color: '#555' }}>
            <li><strong>Algorithm Evolution:</strong> T1-T5 progressive optimization from brute force to spatial indexing</li>
            <li><strong>KD-Tree Spatial Indexing:</strong> O(log n) nearest-neighbor queries with balanced tree partitioning</li>
            <li><strong>Dijkstra's Algorithm:</strong> Road network pathfinding with weighted edges</li>
            <li><strong>Performance Analysis:</strong> D1/D2 metrics, comparison graphs, and algorithm benchmarks</li>
            <li><strong>Bonus Optimizations:</strong> Load balancing, traffic modeling, and predictive caching</li>
          </ul>
        </section>

        {/* Documentation Cards */}
        <section className="section">
          <h2>Explore the Implementation</h2>
          <p>
            Each documentation page explains the algorithm design, shows the Python implementation, and provides detailed performance analysis with visual graphs and metrics.
          </p>

          <div className="doc-cards">
            <Link to="/projects/uber/docs/algorithm" className="doc-card">
              <h3>Algorithm Evolution</h3>
              <p>T1-T5 progressive optimization from brute force to spatial indexing</p>
            </Link>

            <Link to="/projects/uber/docs/kdtree" className="doc-card">
              <h3>KD-Tree Spatial Indexing</h3>
              <p>Efficient nearest-neighbor search with balanced tree partitioning</p>
            </Link>

            <Link to="/projects/uber/docs/pathfinding" className="doc-card">
              <h3>Pathfinding</h3>
              <p>Dijkstra's algorithm on weighted road networks</p>
            </Link>

            <Link to="/projects/uber/docs/performance" className="doc-card">
              <h3>Performance Analysis</h3>
              <p>D1/D2 metrics, comparison graphs, and algorithm benchmarks</p>
            </Link>

            <Link to="/projects/uber/docs/bonus" className="doc-card">
              <h3>Bonus Algorithms</h3>
              <p>Load balancing, traffic-aware routing, predictive caching</p>
            </Link>
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
                <li style={{ marginBottom: '0.75rem' }}><Link to="/projects/uber/docs" style={{ color: '#ecf0f1', textDecoration: 'none', transition: 'color 0.15s' }}>Uber System Documentation</Link></li>
                <li style={{ marginBottom: '0.75rem' }}><Link to="/admin" style={{ color: '#ecf0f1', textDecoration: 'none', transition: 'color 0.15s' }}>Source Code Viewer</Link></li>
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

export default UberDocsLanding
