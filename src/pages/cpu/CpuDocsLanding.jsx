import React from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../../components/shared/Breadcrumbs'

function CpuDocsLanding() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'CPU Simulator', href: '/projects/cpu-simulator' },
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

        .pipeline-diagram {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 2rem 0;
            padding: 2rem;
            background: #f8f9fa;
            border-radius: 8px;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .pipeline-step {
            flex: 1;
            min-width: 100px;
            text-align: center;
            padding: 1rem;
            background: white;
            border-radius: 8px;
            border: 2px solid #2E7D32;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .pipeline-step h4 {
            color: #2E7D32;
            font-weight: 600;
            margin-bottom: 0.5rem;
        }

        .pipeline-arrow {
            font-size: 1.5rem;
            color: #2E7D32;
            font-weight: bold;
        }

        .code-snippet {
            margin: 1.5rem 0;
        }

        /* Gallery Grid */
        .gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            margin-top: 2rem;
        }

        .gallery-item {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s, box-shadow 0.3s;
        }

        .gallery-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
        }

        .gallery-item img {
            width: 100%;
            height: 280px;
            object-fit: contain;
            display: block;
            background: #f8f9fa;
        }

        .gallery-item .caption {
            padding: 1rem;
            font-size: 0.9rem;
            color: #555;
            text-align: center;
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

            .pipeline-diagram {
                flex-direction: column;
            }

            .pipeline-arrow {
                transform: rotate(90deg);
            }

            .gallery-grid {
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
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
        <h1>CPU Documentation</h1>
        <p>Duke ECE 350 - Verilog Implementation</p>
      </header>

      <div className="container">
        {/* About the CPU */}
        <section className="section">
          <h2>About the CPU Project</h2>

          <h3>What is this?</h3>
          <p>
            This is a <strong>32-bit processor</strong> built from the ground up in Verilog HDL for Duke University's ECE 350 (Computer Architecture) course. The processor implements a subset of the MIPS instruction set and features a full 5-stage pipeline with hazard detection and data forwarding.
          </p>
          <p>
            The project was completed through <strong>4 checkpoints</strong>, progressively building the processor from basic arithmetic operations to a fully functional pipelined architecture capable of executing complex programs. Each checkpoint added new capabilities, culminating in a complete processor with advanced features like branch prediction and forwarding paths.
          </p>
          <p>
            <strong>Key Features:</strong>
          </p>
          <ul style={{ lineHeight: 1.8, color: '#555' }}>
            <li><strong>32-bit Architecture:</strong> 32 general-purpose registers, 32-bit data and address paths</li>
            <li><strong>5-Stage Pipeline:</strong> IF (Instruction Fetch), ID (Instruction Decode), EX (Execute), MEM (Memory Access), WB (Write Back)</li>
            <li><strong>Hazard Detection:</strong> Data hazard detection with stall logic</li>
            <li><strong>Data Forwarding:</strong> Forwarding paths from EX/MEM and MEM/WB stages to eliminate stalls</li>
            <li><strong>Register File:</strong> Dual read ports, single write port, $0 hardwired to zero</li>
            <li><strong>ALU:</strong> Carry-Lookahead adder with arithmetic and logic operations</li>
            <li><strong>Multiplication & Division:</strong> Booth's algorithm for fast multiplication, 2-layer implementation</li>
          </ul>

          <h3>Implementation Checkpoints</h3>
          <ul style={{ lineHeight: 1.8, color: '#555' }}>
            <li><strong>Checkpoint 1 - ALU:</strong> Arithmetic Logic Unit with carry-lookahead adder</li>
            <li><strong>Checkpoint 2 - Register File:</strong> 32 registers with dual read ports</li>
            <li><strong>Checkpoint 3 - Multiplication & Division:</strong> Booth's algorithm implementation</li>
            <li><strong>Checkpoint 4 - Complete Processor:</strong> 5-stage pipeline with hazards and forwarding</li>
          </ul>

          <h3>The Pipeline Architecture</h3>
          <p>
            The processor uses a classic 5-stage RISC pipeline. Each instruction flows through these stages, with data forwarding paths connecting stages to minimize stalls:
          </p>

          <div className="pipeline-diagram">
            <div className="pipeline-step">
              <h4>IF</h4>
              <p>Instruction Fetch</p>
            </div>
            <div className="pipeline-arrow">→</div>
            <div className="pipeline-step">
              <h4>ID</h4>
              <p>Instruction Decode</p>
            </div>
            <div className="pipeline-arrow">→</div>
            <div className="pipeline-step">
              <h4>EX</h4>
              <p>Execute</p>
            </div>
            <div className="pipeline-arrow">→</div>
            <div className="pipeline-step">
              <h4>MEM</h4>
              <p>Memory Access</p>
            </div>
            <div className="pipeline-arrow">→</div>
            <div className="pipeline-step">
              <h4>WB</h4>
              <p>Write Back</p>
            </div>
          </div>
        </section>

        {/* Documentation Cards */}
        <section className="section">
          <h2>Explore the Implementation</h2>
          <p>
            Each documentation page explains the design decisions, shows the Verilog implementation, and provides detailed analysis of the processor components.
          </p>

          <div className="doc-cards">
            <Link to="/cpu-docs/alu" className="doc-card">
              <h3>ALU Design (CP1)</h3>
              <p>Carry-Lookahead adder, arithmetic and logic operations</p>
            </Link>

            <Link to="/cpu-docs/regfile" className="doc-card">
              <h3>Register File (CP2)</h3>
              <p>32 registers, dual read ports, $0 hardwired to zero</p>
            </Link>

            <Link to="/cpu-docs/multdiv" className="doc-card">
              <h3>Multiplication & Division (CP3)</h3>
              <p>Booth's algorithm, 2-layer implementation</p>
            </Link>

            <Link to="/cpu-docs/pipeline" className="doc-card">
              <h3>Pipeline Architecture (CP4)</h3>
              <p>5-stage pipeline, datapath design</p>
            </Link>

            <Link to="/cpu-docs/hazards" className="doc-card">
              <h3>Hazards & Forwarding (CP4)</h3>
              <p>Data hazards, forwarding paths, stall logic</p>
            </Link>

            <Link to="/cpu-docs/instructions" className="doc-card">
              <h3>Instruction Set</h3>
              <p>Complete instruction reference with encoding formats</p>
            </Link>

            <Link to="/cpu-docs/memory" className="doc-card">
              <h3>Memory System</h3>
              <p>RAM, ROM, instruction and data memory</p>
            </Link>
          </div>
        </section>

        {/* Quick Links */}
        <section className="section">
          <h2>Explore Further</h2>
          <div className="quick-links">
            <Link to="/projects/cpu-simulator" className="quick-link">Try Interactive Simulator →</Link>
            <a href="https://github.com/AaronDiefes/CPU" target="_blank" rel="noopener noreferrer" className="quick-link">View Source on GitHub →</a>
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
              <p style={{ color: '#bdc3c7', lineHeight: 1.8, marginBottom: '1rem' }}>Software Engineer passionate about computer architecture and systems development.</p>
              <p style={{ color: '#bdc3c7', lineHeight: 1.8 }}>Building educational tools to visualize processor internals.</p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 style={{ color: '#2E7D32', marginBottom: '1rem', fontSize: '1.2rem' }}>Navigation</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '0.75rem' }}><Link to="/" style={{ color: '#ecf0f1', textDecoration: 'none', transition: 'color 0.15s' }}>← Portfolio Home</Link></li>
                <li style={{ marginBottom: '0.75rem' }}><Link to="/projects/cpu-simulator" style={{ color: '#ecf0f1', textDecoration: 'none', transition: 'color 0.15s' }}>CPU Simulator Demo</Link></li>
                <li style={{ marginBottom: '0.75rem' }}><Link to="/cpu-docs" style={{ color: '#ecf0f1', textDecoration: 'none', transition: 'color 0.15s' }}>Documentation</Link></li>
                <li style={{ marginBottom: '0.75rem' }}><Link to="/admin" style={{ color: '#ecf0f1', textDecoration: 'none', transition: 'color 0.15s' }}>Source Code Viewer</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 style={{ color: '#2E7D32', marginBottom: '1rem', fontSize: '1.2rem' }}>Resources</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '0.75rem' }}><a href="https://github.com/AaronDiefes" target="_blank" rel="noopener noreferrer" style={{ color: '#ecf0f1', textDecoration: 'none', transition: 'color 0.15s' }}>GitHub Profile</a></li>
                <li style={{ marginBottom: '0.75rem' }}><a href="https://github.com/AaronDiefes/CPU" target="_blank" rel="noopener noreferrer" style={{ color: '#ecf0f1', textDecoration: 'none', transition: 'color 0.15s' }}>CPU Verilog Repo</a></li>
                <li style={{ marginBottom: '0.75rem' }}><a href="https://github.com/AaronDiefes/AaronDiefes.github.io" target="_blank" rel="noopener noreferrer" style={{ color: '#ecf0f1', textDecoration: 'none', transition: 'color 0.15s' }}>Portfolio Repo</a></li>
              </ul>
            </div>

            {/* Tech Stack */}
            <div>
              <h3 style={{ color: '#2E7D32', marginBottom: '1rem', fontSize: '1.2rem' }}>Built With</h3>
              <ul style={{ listStyle: 'none', padding: 0, color: '#bdc3c7' }}>
                <li style={{ marginBottom: '0.75rem' }}>• Verilog HDL</li>
                <li style={{ marginBottom: '0.75rem' }}>• ModelSim Simulation</li>
                <li style={{ marginBottom: '0.75rem' }}>• Quartus Synthesis</li>
                <li style={{ marginBottom: '0.75rem' }}>• JavaScript Visualization</li>
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

export default CpuDocsLanding
