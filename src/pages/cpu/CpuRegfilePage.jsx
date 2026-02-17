import React from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../../components/shared/Breadcrumbs'

function CpuRegfilePage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'CPU Simulator', href: '/projects/cpu/demo' },
    { label: 'Documentation', href: '/projects/cpu/docs' },
    { label: 'Register File' }
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
        }

        .section li {
            margin-bottom: 0.5rem;
        }

        .code-block {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 1.5rem;
            border-radius: 8px;
            overflow-x: auto;
            margin: 1.5rem 0;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 0.9rem;
            line-height: 1.6;
        }

        .code-block .comment {
            color: #95a5a6;
        }

        .code-block .keyword {
            color: #3498db;
        }

        .code-block .type {
            color: #e67e22;
        }

        .code-block .signal {
            color: #2ecc71;
        }

        .port-diagram {
            background: #f8f9fa;
            padding: 1.5rem;
            border-radius: 8px;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 0.85rem;
            line-height: 1.8;
            margin: 1.5rem 0;
            border-left: 4px solid #2E7D32;
        }

        .ops-table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .ops-table th {
            background: linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%);
            color: white;
            padding: 1rem;
            text-align: left;
            font-weight: 600;
        }

        .ops-table td {
            padding: 0.75rem 1rem;
            border-bottom: 1px solid #e0e0e0;
            color: #555;
        }

        .ops-table tr:hover {
            background: #f5f5f5;
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

            .code-block {
                font-size: 0.8rem;
                padding: 1rem;
            }

            .port-diagram {
                font-size: 0.75rem;
                padding: 1rem;
            }

            .quick-links {
                flex-direction: column;
            }

            .quick-link {
                text-align: center;
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
        }
      `}</style>

      <Breadcrumbs items={breadcrumbItems} />

      <header className="landing-header">
        <h1>Register File</h1>
        <p>Checkpoint 2 - 32-Register Storage</p>
      </header>

      <div className="container">
        {/* Overview Section */}
        <section className="section">
          <h2>Overview</h2>
          <p>
            The register file is the CPU's fast-access storage for working data. It provides temporary storage for values being actively computed, similar to how variables work in high-level programming languages.
          </p>
          <p>
            In this MIPS-inspired processor, the register file consists of <strong>32 general-purpose registers</strong>, each 32 bits wide. These registers are named <code>$0</code> through <code>$31</code> and serve different roles by convention.
          </p>

          <h3>Key Features</h3>
          <ul>
            <li><strong>32 registers</strong> - Each register stores 32 bits (one word)</li>
            <li><strong>Two read ports</strong> - Can read two registers simultaneously for R-type instructions</li>
            <li><strong>One write port</strong> - Can write to one register per clock cycle</li>
            <li><strong>Combinational reads</strong> - Read outputs available immediately (no clock delay)</li>
            <li><strong>Synchronous writes</strong> - Data written on positive clock edge</li>
            <li><strong>$0 hardwired to zero</strong> - Register $0 always reads as 0, writes are ignored</li>
          </ul>
        </section>

        {/* Architecture Section */}
        <section className="section">
          <h2>Architecture</h2>
          <p>
            The register file is built as a 32x32-bit register array with dedicated read and write logic. It interfaces with the rest of the CPU through clearly defined input and output ports.
          </p>

          <h3>Port Specification</h3>
          <div className="port-diagram">
            <strong>Inputs:</strong><br />
            ctrl_readRegA [4:0]  ──── 5-bit address selecting which register to read on port A<br />
            ctrl_readRegB [4:0]  ──── 5-bit address selecting which register to read on port B<br />
            ctrl_writeReg [4:0]  ──── 5-bit address selecting which register to write<br />
            data_writeReg [31:0] ──── 32-bit data to write to selected register<br />
            ctrl_writeEnable     ──── Write enable signal (1 = write, 0 = no write)<br />
            clock                ──── Clock signal for synchronous writes<br />
            <br />
            <strong>Outputs:</strong><br />
            data_readRegA [31:0] ──── 32-bit data read from register A<br />
            data_readRegB [31:0] ──── 32-bit data read from register B<br />
          </div>

          <p>
            The dual read ports allow instructions like <code>add $t0, $t1, $t2</code> to read both source operands (<code>$t1</code> and <code>$t2</code>) in the same cycle, while the single write port writes the result back to <code>$t0</code>.
          </p>
        </section>

        {/* $0 Hardwired Section */}
        <section className="section">
          <h2>$0 Hardwired to Zero</h2>
          <p>
            One of the most important conventions in MIPS architecture is that <strong>register $0 is permanently zero</strong>. No matter what value you try to write to $0, it will always read back as 0.
          </p>

          <h3>Why is this useful?</h3>
          <ul>
            <li><strong>Load immediate:</strong> <code>addi $t0, $0, 42</code> loads constant 42 into $t0</li>
            <li><strong>Copy register:</strong> <code>add $t1, $t0, $0</code> copies $t0 to $t1</li>
            <li><strong>Discard result:</strong> Write to $0 when you don't need the result</li>
            <li><strong>Zero comparisons:</strong> <code>beq $t0, $0, label</code> branches if $t0 is zero</li>
            <li><strong>Simplify ISA:</strong> Eliminates need for special "load immediate" instruction</li>
          </ul>

          <h3>Implementation</h3>
          <p>
            The zero-hardwiring is implemented in two places: the write decoder and the read multiplexer.
          </p>

          <div className="code-block">
<span className="comment">// Register $0 hardwired to zero</span><br />
<span className="comment">// Only instantiate registers 1-31 (skip $0)</span><br />
<span className="keyword">genvar</span> i;<br />
<span className="keyword">generate</span><br />
&nbsp;&nbsp;<span className="keyword">for</span> (i = <span className="type">1</span>; i &lt; <span className="type">32</span>; i = i + <span className="type">1</span>) <span className="keyword">begin</span>: reg_loop<br />
&nbsp;&nbsp;&nbsp;&nbsp;register_32 reg_i(<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.d(data_writeReg),<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.clk(clock),<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.en(write_en[i]),<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.clr(ctrl_reset),<br />
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;.q(reg_out[i])<br />
&nbsp;&nbsp;&nbsp;&nbsp;);<br />
&nbsp;&nbsp;<span className="keyword">end</span><br />
<span className="keyword">endgenerate</span><br />
<br />
<span className="comment">// $0 always outputs constant zero</span><br />
<span className="keyword">assign</span> reg_out[<span className="type">0</span>] = <span className="type">32'b0</span>;
          </div>

          <p>
            By not instantiating a physical register for $0, we save hardware resources. The <code>assign</code> statement ensures $0 always reads as zero, and the write decoder (shown in the next section) prevents any write enables from reaching position 0.
          </p>
        </section>

        {/* Read Port Implementation */}
        <section className="section">
          <h2>Read Port Implementation</h2>
          <p>
            The register file provides <strong>combinational reads</strong>, meaning the output updates immediately when the address changes, with no clock delay. This is crucial for the CPU pipeline because it allows an instruction to read register values in the same cycle it decodes.
          </p>

          <h3>How It Works</h3>
          <p>
            Each read port uses a <strong>32:1 multiplexer</strong> to select one of the 32 register outputs based on the 5-bit read address. The two read ports operate independently, allowing simultaneous reads of two different registers.
          </p>

          <div className="code-block">
<span className="comment">// Dual-port read using 32:1 multiplexers</span><br />
<span className="comment">// Port A - reads from ctrl_readRegA address</span><br />
<span className="keyword">assign</span> data_readRegA = reg_out[ctrl_readRegA];<br />
<br />
<span className="comment">// Port B - reads from ctrl_readRegB address</span><br />
<span className="keyword">assign</span> data_readRegB = reg_out[ctrl_readRegB];
          </div>

          <p>
            Verilog's array indexing syntax makes this deceptively simple. Under the hood, the synthesizer generates a 32:1 mux for each read port. The combinational nature means these reads happen "instantly" from the perspective of the control logic.
          </p>

          <h3>Timing Characteristics</h3>
          <ul>
            <li><strong>Propagation delay:</strong> ~5ns through mux logic (typical for 32:1 mux in FPGA)</li>
            <li><strong>Setup time:</strong> Read address must be stable before clock edge</li>
            <li><strong>No clock dependency:</strong> Outputs change asynchronously with address changes</li>
          </ul>
        </section>

        {/* Write Port Implementation */}
        <section className="section">
          <h2>Write Port Implementation</h2>
          <p>
            Unlike reads, writes to the register file are <strong>synchronous</strong>, meaning data is only written on the positive edge of the clock. This prevents race conditions and ensures data stability.
          </p>

          <h3>Write Enable Decoder</h3>
          <p>
            The write enable signal must be decoded into 32 individual enable signals, one per register. Only the register matching <code>ctrl_writeReg</code> should receive a write pulse.
          </p>

          <div className="code-block">
<span className="comment">// Write enable decoder - converts 5-bit address to 32-bit one-hot</span><br />
<span className="keyword">wire</span> [<span className="type">31</span>:<span className="type">0</span>] write_en;<br />
<br />
decoder_5to32 write_decoder(<br />
&nbsp;&nbsp;.in(ctrl_writeReg),        <span className="comment">// 5-bit write address</span><br />
&nbsp;&nbsp;.enable(ctrl_writeEnable),  <span className="comment">// Global write enable</span><br />
&nbsp;&nbsp;.out(write_en)              <span className="comment">// 32-bit one-hot output</span><br />
);<br />
<br />
<span className="comment">// Example: if ctrl_writeReg = 5, then write_en[5] = 1, all others = 0</span><br />
<span className="comment">// If ctrl_writeEnable = 0, then all write_en bits = 0 (no write)</span>
          </div>

          <p>
            The decoder produces a <strong>one-hot encoded</strong> output where exactly one bit is set (the bit corresponding to the write address). This one-hot signal connects to the enable input of each register.
          </p>

          <h3>Single Write Port Limitation</h3>
          <p>
            The register file has only <strong>one write port</strong>, meaning only one register can be written per clock cycle. This is acceptable because most instructions produce at most one result. Instructions that need to write multiple values (like <code>mult</code> which produces a 64-bit result) either use special registers (HI/LO) or take multiple cycles.
          </p>
        </section>

        {/* Register Conventions */}
        <section className="section">
          <h2>Register Conventions</h2>
          <p>
            While all 32 registers are technically identical (except $0), the MIPS architecture defines <strong>conventions</strong> for how they should be used. Following these conventions ensures code can interoperate correctly, especially across function calls.
          </p>

          <table className="ops-table">
            <thead>
              <tr>
                <th>Register</th>
                <th>Name</th>
                <th>Purpose</th>
                <th>Preserved Across Calls?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>$0</td>
                <td>$zero</td>
                <td>Constant 0 (hardwired)</td>
                <td>N/A</td>
              </tr>
              <tr>
                <td>$1</td>
                <td>$at</td>
                <td>Assembler temporary (reserved)</td>
                <td>No</td>
              </tr>
              <tr>
                <td>$2-$3</td>
                <td>$v0-$v1</td>
                <td>Function return values</td>
                <td>No</td>
              </tr>
              <tr>
                <td>$4-$7</td>
                <td>$a0-$a3</td>
                <td>Function arguments</td>
                <td>No</td>
              </tr>
              <tr>
                <td>$8-$15</td>
                <td>$t0-$t7</td>
                <td>Temporary registers (caller-saved)</td>
                <td>No</td>
              </tr>
              <tr>
                <td>$16-$23</td>
                <td>$s0-$s7</td>
                <td>Saved registers (callee-saved)</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>$24-$25</td>
                <td>$t8-$t9</td>
                <td>More temporary registers</td>
                <td>No</td>
              </tr>
              <tr>
                <td>$26-$27</td>
                <td>$k0-$k1</td>
                <td>Kernel reserved (OS use)</td>
                <td>N/A</td>
              </tr>
              <tr>
                <td>$28</td>
                <td>$gp</td>
                <td>Global pointer (static data)</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>$29</td>
                <td>$sp</td>
                <td>Stack pointer</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>$30</td>
                <td>$fp</td>
                <td>Frame pointer</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td>$31</td>
                <td>$ra</td>
                <td>Return address (set by jal)</td>
                <td>N/A</td>
              </tr>
            </tbody>
          </table>

          <p>
            <strong>Caller-saved vs. Callee-saved:</strong>
          </p>
          <ul>
            <li><strong>Caller-saved ($t0-$t9):</strong> The calling function must save these if it needs them after the call</li>
            <li><strong>Callee-saved ($s0-$s7):</strong> The called function must preserve these values</li>
          </ul>
        </section>

        {/* Explore Further */}
        <section className="section">
          <h2>Explore Further</h2>
          <div className="quick-links">
            <Link to="/projects/cpu/docs/alu" className="quick-link">← Previous: ALU Design</Link>
            <Link to="/projects/cpu/docs/multdiv" className="quick-link">Next: Multiplication & Division →</Link>
            <Link to="/projects/cpu/docs" className="quick-link">Back to CPU Docs</Link>
            <a href="https://github.com/AaronDiefes/CPU" target="_blank" rel="noopener noreferrer" className="quick-link">View on GitHub →</a>
          </div>
        </section>
      </div>

      <footer style={{ background: '#2c3e50', color: '#ecf0f1', padding: '3rem 2rem 2rem', marginTop: '4rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '2rem' }}>
            {/* About Section */}
            <div>
              <h3 style={{ color: '#2E7D32', marginBottom: '1rem', fontSize: '1.2rem' }}>Aaron Diefes</h3>
              <p style={{ color: '#bdc3c7', lineHeight: 1.8, marginBottom: '1rem' }}>Software Engineer passionate about computer architecture and digital design.</p>
              <p style={{ color: '#bdc3c7', lineHeight: 1.8 }}>Building educational CPU visualizations with Verilog and JavaScript.</p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 style={{ color: '#2E7D32', marginBottom: '1rem', fontSize: '1.2rem' }}>Navigation</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '0.75rem' }}><Link to="/" style={{ color: '#ecf0f1', textDecoration: 'none', transition: 'color 0.15s' }}>← Portfolio Home</Link></li>
                <li style={{ marginBottom: '0.75rem' }}><Link to="/projects/cpu/demo" style={{ color: '#ecf0f1', textDecoration: 'none', transition: 'color 0.15s' }}>Try CPU Simulator</Link></li>
                <li style={{ marginBottom: '0.75rem' }}><Link to="/projects/cpu/docs" style={{ color: '#ecf0f1', textDecoration: 'none', transition: 'color 0.15s' }}>CPU Documentation</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 style={{ color: '#2E7D32', marginBottom: '1rem', fontSize: '1.2rem' }}>Resources</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '0.75rem' }}><a href="https://github.com/AaronDiefes" target="_blank" rel="noopener noreferrer" style={{ color: '#ecf0f1', textDecoration: 'none', transition: 'color 0.15s' }}>GitHub Profile</a></li>
                <li style={{ marginBottom: '0.75rem' }}><a href="https://github.com/AaronDiefes/CPU" target="_blank" rel="noopener noreferrer" style={{ color: '#ecf0f1', textDecoration: 'none', transition: 'color 0.15s' }}>CPU Verilog Source</a></li>
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
                <li style={{ marginBottom: '0.75rem' }}>• React Visualization</li>
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

export default CpuRegfilePage
