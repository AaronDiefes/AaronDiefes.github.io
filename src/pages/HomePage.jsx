import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
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
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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

      <nav className="site-nav" aria-label="Main navigation">
        <a href="#" className="nav-brand">Aaron Diefes</a>
        <button className="menu-toggle" aria-expanded="false" aria-controls="nav-menu">
          <span className="sr-only">Toggle menu</span>
          <span className="hamburger-icon"></span>
        </button>
        <ul id="nav-menu" className="nav-links" hidden>
          <li><Link to="/">Home</Link></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="https://github.com/AaronDiefes" target="_blank" rel="noopener noreferrer">GitHub</a></li>
        </ul>
      </nav>

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
          <h2>Featured Project</h2>
          <div className="project-grid">
            <div className="project-card">
              <h3>2D Graphics Engine 🚀</h3>
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

              <Link to="/projects/graphics-engine/wasm" className="btn">Try Real C++ Engine →</Link>
              <Link to="/docs" className="btn">View Documentation</Link>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="github-repos">
            <h2>Other Projects</h2>
            <div className="repo-list">
              <div className="repo-item">
                <h4>CPU Simulator</h4>
                <p>Interactive visualization of CPU architecture and instruction execution with step-by-step animations.</p>
                <Link to="/projects/cpu-simulator">View Live Demo →</Link>
              </div>
              <div className="repo-item">
                <h4>CS330 Case Study</h4>
                <p>Academic project demonstrating software engineering principles.</p>
                <a href="https://github.com/AaronDiefes/cs330-case-study" target="_blank" rel="noopener noreferrer">View on GitHub →</a>
              </div>
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
