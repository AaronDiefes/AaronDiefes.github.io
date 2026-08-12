import React from 'react'
import { Link } from 'react-router-dom'
import { DOCS_NAV } from '../../lib/docs-nav'
import Navigation from '../../components/shared/Navigation'
import SiteFooter from '../../components/shared/SiteFooter'

function UberDocsLanding() {
  return (
    <div className="docs-landing">

      <Navigation />

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
      <SiteFooter />
    </div>
  )
}

export default UberDocsLanding
