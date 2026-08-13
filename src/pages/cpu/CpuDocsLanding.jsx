import React from 'react'
import { Link } from 'react-router-dom'
import { DOCS_NAV } from '../../lib/docs-nav'
import Navigation from '../../components/shared/Navigation'
import SiteFooter from '../../components/shared/SiteFooter'

function CpuDocsLanding() {
  return (
    <div className="docs-landing">

      <Navigation />

      <header className="landing-header">
        <h1>CPU Documentation</h1>
        <p>32-bit RISC Processor - Verilog Implementation</p>
      </header>

      <div className="container">
        {/* About the CPU */}
        <section className="section">
          <h2>About the CPU Project</h2>

          <h3>What is this?</h3>
          <p>
            This is a <strong>32-bit processor</strong> built from the ground up in Verilog HDL. The processor implements a subset of the MIPS instruction set and features a full 5-stage pipeline with hazard detection and data forwarding.
          </p>
          <p>
            The project was completed through <strong>4 checkpoints</strong>, progressively building the processor from basic arithmetic operations to a fully functional pipelined architecture capable of executing complex programs. Each checkpoint added new capabilities, culminating in a complete processor with advanced features like branch prediction and forwarding paths.
          </p>
          <p>
            <strong>Key Features:</strong>
          </p>
          <ul style={{ lineHeight: 1.8, color: 'var(--color-text-light)' }}>
            <li><strong>32-bit Architecture:</strong> 32 general-purpose registers, 32-bit data and address paths</li>
            <li><strong>5-Stage Pipeline:</strong> IF (Instruction Fetch), ID (Instruction Decode), EX (Execute), MEM (Memory Access), WB (Write Back)</li>
            <li><strong>Hazard Detection:</strong> Data hazard detection with stall logic</li>
            <li><strong>Data Forwarding:</strong> Forwarding paths from EX/MEM and MEM/WB stages to eliminate stalls</li>
            <li><strong>Register File:</strong> Dual read ports, single write port, $0 hardwired to zero</li>
            <li><strong>ALU:</strong> Carry-Lookahead adder with arithmetic and logic operations</li>
            <li><strong>Multiplication & Division:</strong> Booth's algorithm for fast multiplication, 2-layer implementation</li>
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
            {DOCS_NAV.cpu.pages.map((page) => (
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
            <Link to="/projects/cpu/demo" className="quick-link">Try Interactive Simulator →</Link>
            <a href="https://github.com/AaronDiefes/CPU" target="_blank" rel="noopener noreferrer" className="quick-link">View Source on GitHub →</a>
            <Link to="/" className="quick-link">Back to Portfolio →</Link>
          </div>
        </section>
      </div>
      <SiteFooter />
    </div>
  )
}

export default CpuDocsLanding
