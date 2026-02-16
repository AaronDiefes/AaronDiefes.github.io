import React from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../../components/shared/Breadcrumbs'

function CpuMemoryPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'CPU Simulator', href: '/projects/cpu-simulator' },
    { label: 'Documentation', href: '/cpu-docs' },
    { label: 'Memory System' }
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

        .memory-map {
            display: flex;
            flex-direction: column;
            border: 2px solid #2E7D32;
            border-radius: 8px;
            overflow: hidden;
            margin: 1.5rem 0;
        }

        .memory-region {
            display: flex;
            justify-content: space-between;
            padding: 1rem 1.5rem;
            border-bottom: 1px solid #e0e0e0;
        }

        .memory-region:last-child {
            border-bottom: none;
        }

        .memory-region .addr {
            font-family: 'Monaco', 'Courier New', monospace;
            color: #2E7D32;
            font-weight: 600;
        }

        .memory-region .desc {
            color: #555;
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
      `}</style>

      <Breadcrumbs items={breadcrumbItems} />

      <header className="landing-header">
        <h1>Memory System</h1>
        <p>Instruction and Data Memory</p>
      </header>

      <div className="container">
        {/* Overview */}
        <section className="section">
          <h2>Overview</h2>
          <p>
            The processor uses a <strong>Harvard architecture</strong> with separate instruction memory
            (ROM) and data memory (RAM). This separation allows simultaneous instruction fetch and data
            access, which is essential for pipeline efficiency.
          </p>
          <ul>
            <li><strong>Harvard architecture:</strong> Separate instruction memory and data memory</li>
            <li><strong>Instruction memory (ROM):</strong> Read-only, loaded with program at synthesis</li>
            <li><strong>Data memory (RAM):</strong> Read/write, used by load and store instructions</li>
            <li><strong>Word-addressed:</strong> Both memories use 32-bit word addressing</li>
            <li><strong>Address space:</strong> 12-bit addresses provide 4096 words (16 KB per memory)</li>
          </ul>
        </section>

        {/* Instruction Memory */}
        <section className="section">
          <h2>Instruction Memory (ROM)</h2>
          <p>
            Instruction memory stores the program binary. It is read-only because the program is fixed
            at synthesis time. The Program Counter (PC) addresses this memory to fetch instructions.
          </p>
          <ul>
            <li><strong>Contains:</strong> The assembled program binary (machine code)</li>
            <li><strong>Addressed by:</strong> Program Counter (PC)</li>
            <li><strong>Read timing:</strong> Combinational (no clock delay) - instruction available same cycle</li>
            <li><strong>Simulation:</strong> Initialized from a .mem or .mif file</li>
            <li><strong>Synthesis:</strong> Compiled into FPGA block RAM</li>
          </ul>

          <h3>Verilog Implementation</h3>
          <div className="code-block">
            <span className="comment">// Instruction Memory (ROM)</span><br/>
            <span className="keyword">module</span> <span className="signal">ROM</span>(<br/>
            &nbsp;&nbsp;<span className="keyword">input</span> [<span className="number">11</span>:<span className="number">0</span>] <span className="signal">address</span>,<br/>
            &nbsp;&nbsp;<span className="keyword">output</span> [<span className="number">31</span>:<span className="number">0</span>] <span className="signal">data</span><br/>
            );<br/>
            &nbsp;&nbsp;<span className="keyword">reg</span> [<span className="number">31</span>:<span className="number">0</span>] memory [<span className="number">0</span>:<span className="number">4095</span>];<br/>
            <br/>
            &nbsp;&nbsp;<span className="comment">// Initialize from program file</span><br/>
            &nbsp;&nbsp;<span className="keyword">initial</span> <span className="keyword">begin</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;$readmemh(<span className="number">"program.mem"</span>, memory);<br/>
            &nbsp;&nbsp;<span className="keyword">end</span><br/>
            <br/>
            &nbsp;&nbsp;<span className="comment">// Combinational read (immediate access)</span><br/>
            &nbsp;&nbsp;<span className="keyword">assign</span> data = memory[address];<br/>
            <span className="keyword">endmodule</span>
          </div>

          <p>
            The <code>$readmemh</code> system task loads the program from a hexadecimal file during
            simulation. In FPGA synthesis, this initializes the block RAM contents.
          </p>
        </section>

        {/* Data Memory */}
        <section className="section">
          <h2>Data Memory (RAM)</h2>
          <p>
            Data memory provides storage for program variables, arrays, and the stack. It supports both
            read and write operations, controlled by load (lw) and store (sw) instructions.
          </p>
          <ul>
            <li><strong>Used by:</strong> Load word (lw) and store word (sw) instructions</li>
            <li><strong>Write timing:</strong> Synchronous - data written on clock edge</li>
            <li><strong>Read timing:</strong> Combinational - data available same cycle (or 1-cycle latency)</li>
            <li><strong>Write control:</strong> Write enable signal from memory stage</li>
          </ul>

          <h3>Verilog Implementation</h3>
          <div className="code-block">
            <span className="comment">// Data Memory (RAM)</span><br/>
            <span className="keyword">module</span> <span className="signal">RAM</span>(<br/>
            &nbsp;&nbsp;<span className="keyword">input</span> [<span className="number">11</span>:<span className="number">0</span>] <span className="signal">address</span>,<br/>
            &nbsp;&nbsp;<span className="keyword">input</span> [<span className="number">31</span>:<span className="number">0</span>] <span className="signal">data_in</span>,<br/>
            &nbsp;&nbsp;<span className="keyword">input</span> <span className="signal">write_enable</span>,<br/>
            &nbsp;&nbsp;<span className="keyword">input</span> <span className="signal">clock</span>,<br/>
            &nbsp;&nbsp;<span className="keyword">output</span> [<span className="number">31</span>:<span className="number">0</span>] <span className="signal">data_out</span><br/>
            );<br/>
            &nbsp;&nbsp;<span className="keyword">reg</span> [<span className="number">31</span>:<span className="number">0</span>] memory [<span className="number">0</span>:<span className="number">4095</span>];<br/>
            <br/>
            &nbsp;&nbsp;<span className="comment">// Synchronous write</span><br/>
            &nbsp;&nbsp;<span className="keyword">always</span> @(<span className="keyword">posedge</span> clock) <span className="keyword">begin</span><br/>
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (write_enable)<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;memory[address] &lt;= data_in;<br/>
            &nbsp;&nbsp;<span className="keyword">end</span><br/>
            <br/>
            &nbsp;&nbsp;<span className="comment">// Combinational read</span><br/>
            &nbsp;&nbsp;<span className="keyword">assign</span> data_out = memory[address];<br/>
            <span className="keyword">endmodule</span>
          </div>

          <p>
            The write operation happens on the positive edge of the clock when <code>write_enable</code> is
            high. The read operation is combinational, providing data immediately when the address changes.
          </p>
        </section>

        {/* Memory Map */}
        <section className="section">
          <h2>Memory Map</h2>
          <p>
            The Harvard architecture provides separate address spaces for instruction and data memory.
            Each memory has its own 12-bit address bus, supporting 4096 words (16 KB).
          </p>

          <h3>Instruction Memory Address Space</h3>
          <div className="memory-map">
            <div className="memory-region">
              <div className="addr">0x000 - 0xFFF</div>
              <div className="desc">Instruction Memory (ROM) - 4096 words × 32 bits = 16 KB</div>
            </div>
          </div>

          <h3>Data Memory Address Space</h3>
          <div className="memory-map">
            <div className="memory-region">
              <div className="addr">0x000 - 0xFFF</div>
              <div className="desc">Data Memory (RAM) - 4096 words × 32 bits = 16 KB</div>
            </div>
          </div>

          <p>
            Note: The same address (e.g., 0x100) refers to different physical locations in instruction
            memory versus data memory. There is no memory-mapped I/O in this design.
          </p>
        </section>

        {/* Wrapper Module */}
        <section className="section">
          <h2>Wrapper Module</h2>
          <p>
            The top-level <code>Wrapper.v</code> module connects the processor to both memories. It
            routes the instruction fetch signals to ROM and the memory stage signals to RAM.
          </p>

          <h3>Top-Level Connection</h3>
          <div className="code-block">
            <span className="comment">// Top-level Wrapper connecting processor to memories</span><br/>
            <span className="keyword">module</span> <span className="signal">Wrapper</span>(<br/>
            &nbsp;&nbsp;<span className="keyword">input</span> <span className="signal">clock</span>, <span className="signal">reset</span><br/>
            );<br/>
            &nbsp;&nbsp;<span className="comment">// Instruction fetch signals</span><br/>
            &nbsp;&nbsp;<span className="keyword">wire</span> [<span className="number">31</span>:<span className="number">0</span>] instruction, pc;<br/>
            <br/>
            &nbsp;&nbsp;<span className="comment">// Data memory signals</span><br/>
            &nbsp;&nbsp;<span className="keyword">wire</span> [<span className="number">31</span>:<span className="number">0</span>] mem_address, mem_data_in, mem_data_out;<br/>
            &nbsp;&nbsp;<span className="keyword">wire</span> mem_write_enable;<br/>
            <br/>
            &nbsp;&nbsp;<span className="comment">// Instruction Memory</span><br/>
            &nbsp;&nbsp;<span className="signal">ROM</span> imem(<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;.address(pc[<span className="number">11</span>:<span className="number">0</span>]),<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;.data(instruction)<br/>
            &nbsp;&nbsp;);<br/>
            <br/>
            &nbsp;&nbsp;<span className="comment">// Data Memory</span><br/>
            &nbsp;&nbsp;<span className="signal">RAM</span> dmem(<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;.address(mem_address[<span className="number">11</span>:<span className="number">0</span>]),<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;.data_in(mem_data_in),<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;.write_enable(mem_write_enable),<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;.clock(clock),<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;.data_out(mem_data_out)<br/>
            &nbsp;&nbsp;);<br/>
            <br/>
            &nbsp;&nbsp;<span className="comment">// Processor</span><br/>
            &nbsp;&nbsp;<span className="signal">processor</span> cpu(<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;.clock(clock),<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;.reset(reset),<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;.instruction(instruction),<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;.pc(pc),<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;.mem_address(mem_address),<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;.mem_data_in(mem_data_in),<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;.mem_data_out(mem_data_out),<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;.mem_write_enable(mem_write_enable)<br/>
            &nbsp;&nbsp;);<br/>
            <span className="keyword">endmodule</span>
          </div>

          <p>
            The wrapper handles all external connections, providing clock and reset to both the processor
            and data memory. The processor outputs addresses and receives data from both memories without
            knowing the internal implementation details.
          </p>
        </section>

        {/* Memory in the Simulator */}
        <section className="section">
          <h2>Memory in the JavaScript Simulator</h2>
          <p>
            The interactive CPU simulator on this website models the memory system in JavaScript to
            provide real-time visualization of program execution.
          </p>

          <h3>Simplified Implementation</h3>
          <ul>
            <li>
              <strong>Instruction memory:</strong> Array of instruction objects with decoded opcode and operand
              fields (not raw binary)
            </li>
            <li>
              <strong>Data memory:</strong> <code>Uint32Array</code> of 256 words (simplified from 4096 for
              demonstration)
            </li>
            <li>
              <strong>Memory view:</strong> Component displays only non-zero memory addresses for cleaner
              educational visualization
            </li>
            <li>
              <strong>Address calculation:</strong> Load/store addresses computed in Execute stage, memory
              accessed in Memory stage
            </li>
          </ul>

          <h3>Try It Out</h3>
          <p>
            The CPU simulator includes programs that demonstrate memory operations. Try the Fibonacci
            program to see how the stack is used, or the array sum program to see sequential memory access.
          </p>

          <div className="quick-links">
            <Link to="/projects/cpu-simulator" className="quick-link">
              Launch CPU Simulator →
            </Link>
          </div>
        </section>

        {/* Explore Further */}
        <section className="section">
          <h2>Explore Further</h2>
          <div className="quick-links">
            <Link to="/cpu-docs/instructions" className="quick-link">← Previous: Instruction Set</Link>
            <Link to="/cpu-docs" className="quick-link">Back to CPU Docs</Link>
            <Link to="/projects/cpu-simulator" className="quick-link">Try the Simulator</Link>
            <a href="https://github.com/AaronDiefes/CPU" className="quick-link" target="_blank" rel="noopener noreferrer">
              View on GitHub
            </a>
          </div>
        </section>
      </div>

      <footer>
        <p>&copy; 2024 Aaron Diefes. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default CpuMemoryPage
