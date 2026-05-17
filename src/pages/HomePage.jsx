import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Navigation from '../components/shared/Navigation';

export default function HomePage() {
  const location = useLocation();

  // Scroll to a hash target after the homepage renders. The element may not be
  // in the DOM on the very first paint when arriving from another route, so
  // retry on the next animation frame once.
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const tryScroll = (retries = 1) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (retries > 0) {
        requestAnimationFrame(() => tryScroll(retries - 1));
      }
    };
    tryScroll();
  }, [location.hash]);

  return (
    <>
      <style>{`
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
        }

        header {
            background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
            color: white;
            padding: 4rem 2rem;
            text-align: center;
        }

        header h1 {
            font-size: clamp(2rem, 1.5rem + 2vw, 3rem);
            margin-bottom: 0.5rem;
            font-weight: 700;
        }

        header p {
            font-size: clamp(1.1rem, 1rem + 0.5vw, 1.3rem);
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
            font-size: clamp(1.5rem, 1.2rem + 1vw, 2rem);
            border-bottom: 3px solid #2E7D32;
            padding-bottom: 0.5rem;
        }

        .project-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 2rem;
            margin-top: 2rem;
        }

        .project-card {
            background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
            color: white;
            padding: 2rem;
            border-radius: 12px;
            transition: transform 0.3s, box-shadow 0.3s;
            cursor: pointer;
        }

        .project-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(46, 125, 50, 0.3);
        }

        .project-card h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
        }

        .project-card p {
            margin-bottom: 1.5rem;
            opacity: 0.95;
        }

        .project-card .tech-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 1.5rem;
        }

        .tech-tag {
            background: rgba(255, 255, 255, 0.2);
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.85rem;
            backdrop-filter: blur(10px);
        }

        .btn {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            background: white;
            color: #2E7D32;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            transition: background 0.3s, color 0.3s;
            margin-right: 0.5rem;
            margin-top: 0.5rem;
        }

        .btn:hover {
            background: #f0f0f0;
        }

        .btn:focus-visible {
            outline: 2px solid white;
            outline-offset: 2px;
        }

        .btn.secondary {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            backdrop-filter: blur(10px);
        }

        .btn.secondary:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .about {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 3rem;
            align-items: center;
        }

        .about-text {
            line-height: 1.8;
        }

        .about-text p {
            margin-bottom: 1rem;
        }

        .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .skill-badge {
            background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
            color: white;
            padding: 0.5rem 1.25rem;
            border-radius: 25px;
            font-weight: 500;
            transition: transform var(--timing-instant);
        }

        .skill-badge:hover {
            transform: scale(1.05);
        }

        .github-repos {
            margin-top: 2rem;
        }

        .repo-list {
            display: grid;
            gap: 1rem;
            margin-top: 1rem;
        }

        .repo-item {
            padding: 1.5rem;
            background: #f8f9fa;
            border-left: 4px solid #2E7D32;
            border-radius: 4px;
            transition: transform var(--timing-instant) var(--easing-standard), box-shadow var(--timing-standard) var(--easing-standard);
        }

        .repo-item:hover {
            transform: translateX(4px);
        }

        .repo-item h4 {
            color: #2c3e50;
            margin-bottom: 0.5rem;
        }

        .repo-item p {
            color: #666;
            font-size: 0.95rem;
        }

        .repo-item a {
            color: #2E7D32;
            text-decoration: none;
            font-weight: 500;
        }

        .repo-item a:hover {
            text-decoration: underline;
        }

        footer {
            background: #2c3e50;
            color: white;
            text-align: center;
            padding: 2rem;
            margin-top: 4rem;
        }

        footer a {
            color: #2E7D32;
            text-decoration: none;
            margin: 0 1rem;
        }

        footer a:hover {
            text-decoration: underline;
        }

        @media (max-width: 768px) {
            header h1 {
                font-size: 2rem;
            }

            header p {
                font-size: 1.1rem;
            }

            .about {
                grid-template-columns: 1fr;
            }

            .section {
                padding: 2rem;
            }
        }

        @media (max-width: 480px) {
            header {
                padding: 2.5rem 1.5rem;
            }

            .container {
                padding: 1.5rem 1rem;
            }

            .section {
                padding: 1.5rem;
                border-radius: 8px;
            }

            .project-card {
                padding: 1.5rem;
            }

            .btn {
                display: block;
                text-align: center;
                margin-right: 0;
            }
        }
      `}</style>

      <Navigation />

      <header>
        <h1>Aaron Diefes</h1>
        <p>Software Engineer & Graphics Programmer</p>
      </header>

      <div className="container">
        <section id="about" className="section">
          <h2>About Me</h2>
          <div className="about">
            <div className="about-text">
              <p>Hello! I'm Aaron, a software engineer passionate about computer graphics, low-level programming, and building elegant solutions to complex problems.</p>
              <p>I specialize in C++ development, graphics programming, and creating interactive web experiences. I love diving deep into how things work and building projects from the ground up.</p>
            </div>
            <div>
              <h3 style={{color: '#2c3e50', marginBottom: '1rem'}}>Skills</h3>
              <div className="skills">
                <span className="skill-badge">C++</span>
                <span className="skill-badge">JavaScript</span>
                <span className="skill-badge">Graphics Programming</span>
                <span className="skill-badge">WebGL</span>
                <span className="skill-badge">Canvas API</span>
                <span className="skill-badge">Git</span>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="section">
          <h2>Projects</h2>
          <div className="project-grid">
            <div className="project-card">
              <h3>2D Graphics Engine</h3>
              <p>A custom-built 2D graphics engine written in C++ and compiled to WebAssembly - running real C++ code in your browser at near-native speed! Explore the implementation details in the comprehensive documentation with algorithm explanations and interactive demos.</p>

              <div className="tech-tags">
                <span className="tech-tag">C++</span>
                <span className="tech-tag">WebAssembly</span>
                <span className="tech-tag">Emscripten</span>
                <span className="tech-tag">Shaders</span>
                <span className="tech-tag">Linear Algebra</span>
              </div>

              <strong style={{display: 'block', marginBottom: '0.5rem'}}>Key Features:</strong>
              <ul style={{marginLeft: '1.5rem', marginBottom: '1.5rem'}}>
                <li>Real-time shape rendering (rectangles, polygons, paths)</li>
                <li>Matrix transformations with CTM stack</li>
                <li>Porter-Duff blend modes (12 compositing operations)</li>
                <li>Shader system (linear gradients, bitmap textures)</li>
                <li>Bezier curves and mesh rendering</li>
                <li>PNG image loading via virtual filesystem</li>
              </ul>

              <Link to="/projects/graphics-engine/demo" className="btn">Try Real C++ Engine →</Link>
              <Link to="/projects/graphics-engine/docs" className="btn">View Documentation</Link>
              <a href="https://github.com/AaronDiefes/graphics-engine-2d" target="_blank" rel="noopener noreferrer" className="btn secondary">GitHub Repo</a>
            </div>

            <div className="project-card">
              <h3>32-bit CPU</h3>
              <p>A 32-bit RISC processor built from scratch in Verilog HDL with an interactive JavaScript visualization. Features a complete 5-stage pipeline with hazard detection, data forwarding, and step-by-step animations showing instruction execution through the pipeline stages.</p>

              <div className="tech-tags">
                <span className="tech-tag">Verilog</span>
                <span className="tech-tag">JavaScript</span>
                <span className="tech-tag">Computer Architecture</span>
                <span className="tech-tag">Pipeline</span>
                <span className="tech-tag">RISC</span>
              </div>

              <strong style={{display: 'block', marginBottom: '0.5rem'}}>Key Features:</strong>
              <ul style={{marginLeft: '1.5rem', marginBottom: '1.5rem'}}>
                <li>5-stage pipeline (IF, ID, EX, MEM, WB)</li>
                <li>32 general-purpose registers with $0 hardwired to zero</li>
                <li>Carry-Lookahead ALU with 6 operations</li>
                <li>Booth's algorithm for multiplication/division</li>
                <li>Data forwarding paths to minimize stalls</li>
                <li>Interactive step-through visualization</li>
              </ul>

              <Link to="/projects/cpu/demo" className="btn">CPU Simulator →</Link>
              <Link to="/projects/cpu/docs" className="btn">View Documentation</Link>
              <a href="https://github.com/AaronDiefes/CPU" target="_blank" rel="noopener noreferrer" className="btn secondary">GitHub Repo</a>
            </div>

            <div className="project-card">
              <h3>Uber Algorithmic System</h3>
              <p>Ride-sharing platform algorithm analysis inspired by Uber's matching system. Demonstrates progressive algorithm evolution from brute-force (T1) to optimized spatial indexing (T5) with KD-trees and Dijkstra's pathfinding, including comprehensive performance analysis on 10,000 passenger datasets.</p>

              <div className="tech-tags">
                <span className="tech-tag">Python</span>
                <span className="tech-tag">Algorithm Design</span>
                <span className="tech-tag">KD-Trees</span>
                <span className="tech-tag">Dijkstra's Algorithm</span>
                <span className="tech-tag">Multiprocessing</span>
              </div>

              <strong style={{display: 'block', marginBottom: '0.5rem'}}>Key Features:</strong>
              <ul style={{marginLeft: '1.5rem', marginBottom: '1.5rem'}}>
                <li>Progressive algorithm evolution (T1-T5 iterations)</li>
                <li>KD-tree spatial indexing for O(log n) queries</li>
                <li>Dijkstra's algorithm for road network pathfinding</li>
                <li>Performance analysis with D1/D2 metrics</li>
                <li>Fork-based multiprocessing (5-7× speedup)</li>
                <li>Interactive visualizations and comparison graphs</li>
              </ul>

              <Link to="/projects/uber/docs" className="btn">View Documentation</Link>
              <a href="https://github.com/AaronDiefes/cs330-case-study" target="_blank" rel="noopener noreferrer" className="btn secondary">GitHub Repo</a>
            </div>
          </div>
        </section>

      </div>

      <footer>
        <p>
          <a href="https://github.com/AaronDiefes" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="mailto:awdiefes@gmail.com">Email</a>
        </p>
        <p style={{marginTop: '1rem', opacity: 0.8}}>&copy; 2026 Aaron Diefes. All rights reserved.</p>
      </footer>
    </>
  );
}
