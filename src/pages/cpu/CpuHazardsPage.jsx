import React from 'react'
import { Link } from 'react-router-dom'

function CpuHazardsPage() {
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

        .section ol {
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

        .hazard-example {
            background: #fff3e0;
            border-left: 4px solid #ff9800;
            padding: 1.5rem;
            border-radius: 0 8px 8px 0;
            margin: 1.5rem 0;
        }

        .hazard-example code {
            font-family: 'Monaco', 'Courier New', monospace;
            background: rgba(0,0,0,0.05);
            padding: 0.15rem 0.4rem;
            border-radius: 3px;
        }

        .timeline-table {
            display: grid;
            grid-template-columns: auto repeat(5, 1fr);
            gap: 0;
            margin: 1.5rem 0;
            border: 1px solid #ddd;
            border-radius: 8px;
            overflow: hidden;
            max-width: 800px;
        }

        .timeline-header {
            background: #2E7D32;
            color: white;
            padding: 0.75rem;
            font-weight: 600;
            text-align: center;
        }

        .timeline-cell {
            padding: 0.75rem;
            text-align: center;
            border: 1px solid #ddd;
            background: white;
        }

        .timeline-label {
            background: #f5f5f5;
            padding: 0.75rem;
            font-weight: 600;
            border: 1px solid #ddd;
            white-space: nowrap;
        }

        .stage-if {
            background: #e3f2fd;
            font-weight: 600;
        }

        .stage-id {
            background: #f3e5f5;
            font-weight: 600;
        }

        .stage-ex {
            background: #fff9c4;
            font-weight: 600;
        }

        .stage-mem {
            background: #ffebee;
            font-weight: 600;
        }

        .stage-wb {
            background: #e8f5e9;
            font-weight: 600;
        }

        .stage-stall {
            background: #ffccbc;
            font-weight: 600;
            color: #d84315;
        }

        .stage-conflict {
            background: #ff9800;
            color: white;
            font-weight: 700;
        }

        .forwarding-diagram {
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 2rem;
            background: #f9f9f9;
            border-radius: 8px;
            margin: 1.5rem 0;
            flex-wrap: wrap;
            gap: 2rem;
        }

        .forwarding-box {
            background: white;
            border: 2px solid #2E7D32;
            border-radius: 8px;
            padding: 1.5rem;
            min-width: 150px;
            text-align: center;
            position: relative;
        }

        .forwarding-box h4 {
            margin: 0 0 0.5rem 0;
            color: #2E7D32;
            font-size: 1rem;
        }

        .forwarding-box p {
            margin: 0;
            font-size: 0.85rem;
            color: #666;
        }

        .forwarding-arrow {
            color: #ff9800;
            font-size: 2rem;
            font-weight: bold;
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

            .timeline-table {
                font-size: 0.85rem;
            }

            .forwarding-diagram {
                flex-direction: column;
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

      <header className="landing-header">
        <h1>Hazards & Forwarding</h1>
        <p>Checkpoint 4 - Keeping the Pipeline Flowing</p>
      </header>

      <div className="container">
        {/* Overview */}
        <section className="section">
          <h2>Overview</h2>
          <p>
            Pipeline hazards are situations where the next instruction cannot execute in the following clock cycle as intended. Without proper handling, hazards can lead to incorrect results, stalled execution, or wasted clock cycles.
          </p>
          <p>
            <strong>Types of Pipeline Hazards:</strong>
          </p>
          <ul>
            <li><strong>Data Hazards:</strong> An instruction depends on the result of a previous instruction that hasn't completed yet</li>
            <li><strong>Control Hazards:</strong> The program flow changes (branches, jumps) before the next instructions are known</li>
            <li><strong>Structural Hazards:</strong> Two instructions need the same hardware resource simultaneously (rare in well-designed pipelines)</li>
          </ul>
          <p>
            This processor primarily handles data hazards and control hazards. Without hazard handling, the pipeline would read stale register values, producing incorrect computation results.
          </p>
          <p>
            <strong>Hazard Solutions:</strong>
          </p>
          <ul>
            <li><strong>Forwarding (Bypassing):</strong> Forward the result from where it's computed directly to where it's needed, avoiding unnecessary stalls</li>
            <li><strong>Stalling (Pipeline Bubbles):</strong> Insert NOPs (no-operation instructions) to delay execution until data is ready</li>
            <li><strong>Flushing:</strong> Cancel wrong-path instructions when a branch changes program flow</li>
          </ul>
        </section>

        {/* Data Hazards */}
        <section className="section">
          <h2>Data Hazards</h2>
          <p>
            A <strong>Read-After-Write (RAW)</strong> data hazard occurs when an instruction needs to read a register value that a previous instruction has not yet written back. This is the most common type of data hazard in pipelined processors.
          </p>

          <div className="hazard-example">
            <p><strong>Example Scenario:</strong></p>
            <code>add $1, $2, $3    // writes $1 in WB (cycle 5)</code><br />
            <code>sub $4, $1, $5    // reads $1 in ID (cycle 3) - STALE VALUE!</code>
          </div>

          <p>
            Without forwarding, the <code>sub</code> instruction reads the OLD value of <code>$1</code> from the register file during the ID stage (cycle 3), but the <code>add</code> instruction doesn't write the NEW value until the WB stage (cycle 5).
          </p>

          <h3>Timeline Visualization</h3>
          <p>
            Here's what happens cycle-by-cycle without forwarding:
          </p>

          <div className="timeline-table">
            <div className="timeline-header">Cycle</div>
            <div className="timeline-header">1</div>
            <div className="timeline-header">2</div>
            <div className="timeline-header">3</div>
            <div className="timeline-header">4</div>
            <div className="timeline-header">5</div>

            <div className="timeline-label">add $1</div>
            <div className="timeline-cell stage-if">IF</div>
            <div className="timeline-cell stage-id">ID</div>
            <div className="timeline-cell stage-ex">EX</div>
            <div className="timeline-cell stage-mem">MEM</div>
            <div className="timeline-cell stage-wb">WB ← $1 written</div>

            <div className="timeline-label">sub $4</div>
            <div className="timeline-cell"></div>
            <div className="timeline-cell stage-if">IF</div>
            <div className="timeline-cell stage-conflict">ID ← $1 read!</div>
            <div className="timeline-cell stage-ex">EX</div>
            <div className="timeline-cell stage-mem">MEM</div>
          </div>

          <p>
            The orange cell shows the conflict: <code>sub</code> reads <code>$1</code> in cycle 3, but <code>add</code> doesn't write the new value until cycle 5. The result is incorrect computation using stale data.
          </p>
        </section>

        {/* Data Forwarding */}
        <section className="section">
          <h2>Data Forwarding (Bypassing)</h2>
          <p>
            Instead of waiting for the Write Back stage, <strong>data forwarding</strong> allows us to send the computed result directly from where it's produced to where it's needed. This eliminates many unnecessary stalls and keeps the pipeline running efficiently.
          </p>

          <h3>Forwarding Paths</h3>
          <p>
            The processor implements two main forwarding paths:
          </p>
          <ul>
            <li><strong>EX-to-EX Forwarding:</strong> Forward the ALU result from the EX/MEM pipeline register back to the EX stage input (most common case)</li>
            <li><strong>MEM-to-EX Forwarding:</strong> Forward data from the MEM/WB pipeline register back to the EX stage input (less common, but still necessary)</li>
          </ul>
          <p>
            A forwarding MUX at each ALU input selects between three sources:
          </p>
          <ul>
            <li>Normal register file output (no hazard)</li>
            <li>EX/MEM forwarded value (EX-to-EX forwarding)</li>
            <li>MEM/WB forwarded value (MEM-to-EX forwarding)</li>
          </ul>

          <h3>Forwarding Detection Logic</h3>
          <p>
            The forwarding unit examines the pipeline registers to detect when forwarding is needed. It checks if a previous instruction will write to a register that the current instruction needs to read.
          </p>

          <div className="code-block">
            <span className="comment">// Forwarding unit - detect EX hazard (EX-to-EX forwarding)</span><br />
            <span className="keyword">wire</span> <span className="signal">ex_hazard_A</span> = (<span className="signal">exmem_regWrite</span> && <span className="signal">exmem_rd</span> != <span className="number">0</span>)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&&  (<span className="signal">exmem_rd</span> == <span className="signal">idex_rs</span>);<br />
            <span className="keyword">wire</span> <span className="signal">ex_hazard_B</span> = (<span className="signal">exmem_regWrite</span> && <span className="signal">exmem_rd</span> != <span className="number">0</span>)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&&  (<span className="signal">exmem_rd</span> == <span className="signal">idex_rt</span>);<br />
            <br />
            <span className="comment">// Forwarding unit - detect MEM hazard (MEM-to-EX forwarding)</span><br />
            <span className="keyword">wire</span> <span className="signal">mem_hazard_A</span> = (<span className="signal">memwb_regWrite</span> && <span className="signal">memwb_rd</span> != <span className="number">0</span>)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&&  !(<span className="signal">exmem_regWrite</span> && <span className="signal">exmem_rd</span> == <span className="signal">idex_rs</span>)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&&  (<span className="signal">memwb_rd</span> == <span className="signal">idex_rs</span>);<br />
            <span className="keyword">wire</span> <span className="signal">mem_hazard_B</span> = (<span className="signal">memwb_regWrite</span> && <span className="signal">memwb_rd</span> != <span className="number">0</span>)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&&  !(<span className="signal">exmem_regWrite</span> && <span className="signal">exmem_rd</span> == <span className="signal">idex_rt</span>)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&&  (<span className="signal">memwb_rd</span> == <span className="signal">idex_rt</span>);
          </div>

          <p>
            Key observations:
          </p>
          <ul>
            <li>We only forward if the destination register is non-zero (register $0 is hardwired to zero)</li>
            <li>EX hazard takes priority over MEM hazard (the most recent value is always correct)</li>
            <li>We check both ALU input operands (rs and rt) independently</li>
          </ul>

          <h3>Forwarding MUX Implementation</h3>
          <p>
            Once hazards are detected, forwarding MUXes select the correct data source:
          </p>

          <div className="code-block">
            <span className="comment">// Forwarding MUX for ALU input A</span><br />
            <span className="keyword">wire</span> [<span className="number">31</span>:<span className="number">0</span>] <span className="signal">alu_input_a</span>;<br />
            <span className="keyword">assign</span> <span className="signal">alu_input_a</span> = <span className="signal">ex_hazard_A</span>&nbsp;&nbsp;? <span className="signal">exmem_alu_result</span> :<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">mem_hazard_A</span> ? <span className="signal">wb_data</span> :<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">data_readRegA</span>;<br />
            <br />
            <span className="comment">// Forwarding MUX for ALU input B</span><br />
            <span className="keyword">wire</span> [<span className="number">31</span>:<span className="number">0</span>] <span className="signal">alu_input_b</span>;<br />
            <span className="keyword">assign</span> <span className="signal">alu_input_b</span> = <span className="signal">ex_hazard_B</span>&nbsp;&nbsp;? <span className="signal">exmem_alu_result</span> :<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">mem_hazard_B</span> ? <span className="signal">wb_data</span> :<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">data_readRegB</span>;
          </div>

          <p>
            The MUX priority is: EX forwarding (most recent) → MEM forwarding (less recent) → normal register file read (no hazard).
          </p>
        </section>

        {/* Load-Use Hazard */}
        <section className="section">
          <h2>Load-Use Hazard (Stall Required)</h2>
          <p>
            While forwarding eliminates most data hazards, there's one case where forwarding alone is insufficient: the <strong>load-use hazard</strong>.
          </p>
          <p>
            Load instructions (<code>lw</code>) read data from memory during the MEM stage, not the EX stage. If the very next instruction needs that loaded value, forwarding cannot help because the data isn't available yet when the ALU needs it.
          </p>

          <div className="hazard-example">
            <p><strong>Load-Use Example:</strong></p>
            <code>lw  $1, 0($2)    // data available after MEM (cycle 4)</code><br />
            <code>add $3, $1, $4   // needs $1 in EX (cycle 3) - NOT READY!</code>
          </div>

          <h3>Timeline Without Stall (Broken)</h3>
          <div className="timeline-table">
            <div className="timeline-header">Cycle</div>
            <div className="timeline-header">1</div>
            <div className="timeline-header">2</div>
            <div className="timeline-header">3</div>
            <div className="timeline-header">4</div>
            <div className="timeline-header">5</div>

            <div className="timeline-label">lw $1</div>
            <div className="timeline-cell stage-if">IF</div>
            <div className="timeline-cell stage-id">ID</div>
            <div className="timeline-cell stage-ex">EX</div>
            <div className="timeline-cell stage-mem">MEM ← $1 ready</div>
            <div className="timeline-cell stage-wb">WB</div>

            <div className="timeline-label">add $3</div>
            <div className="timeline-cell"></div>
            <div className="timeline-cell stage-if">IF</div>
            <div className="timeline-cell stage-conflict">ID</div>
            <div className="timeline-cell stage-conflict">EX ← $1 needed!</div>
            <div className="timeline-cell stage-mem">MEM</div>
          </div>

          <p>
            The <code>add</code> instruction needs <code>$1</code> in cycle 3 (EX stage), but the <code>lw</code> instruction doesn't have the data until cycle 4 (MEM stage). Even forwarding from MEM/WB would be too late.
          </p>

          <h3>Solution: Pipeline Stall</h3>
          <p>
            The hazard detection unit identifies load-use hazards and inserts a one-cycle stall (pipeline bubble):
          </p>
          <ul>
            <li>Freeze the PC and IF/ID pipeline register (don't fetch new instructions)</li>
            <li>Insert a NOP (bubble) into the ID/EX pipeline register</li>
            <li>After one cycle, the loaded data is available in MEM/WB and can be forwarded</li>
          </ul>

          <h3>Stall Detection Logic</h3>
          <div className="code-block">
            <span className="comment">// Load-use hazard detection</span><br />
            <span className="keyword">wire</span> <span className="signal">load_use_hazard</span> = <span className="signal">idex_memRead</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&&  ((<span className="signal">idex_rt</span> == <span className="signal">ifid_rs</span>) || (<span className="signal">idex_rt</span> == <span className="signal">ifid_rt</span>));<br />
            <br />
            <span className="comment">// Stall: freeze PC and IF/ID register, insert NOP in ID/EX</span><br />
            <span className="keyword">assign</span> <span className="signal">stall</span> = <span className="signal">load_use_hazard</span>;
          </div>

          <p>
            The stall logic checks if the instruction in the EX stage is a load (<code>idex_memRead</code>) and if its destination register (<code>idex_rt</code>) matches either source register of the instruction in the ID stage.
          </p>

          <h3>Timeline With Stall (Correct)</h3>
          <div className="timeline-table">
            <div className="timeline-header">Cycle</div>
            <div className="timeline-header">1</div>
            <div className="timeline-header">2</div>
            <div className="timeline-header">3</div>
            <div className="timeline-header">4</div>
            <div className="timeline-header">5</div>

            <div className="timeline-label">lw $1</div>
            <div className="timeline-cell stage-if">IF</div>
            <div className="timeline-cell stage-id">ID</div>
            <div className="timeline-cell stage-ex">EX</div>
            <div className="timeline-cell stage-mem">MEM ← $1 ready</div>
            <div className="timeline-cell stage-wb">WB</div>

            <div className="timeline-label">add $3</div>
            <div className="timeline-cell"></div>
            <div className="timeline-cell stage-if">IF</div>
            <div className="timeline-cell stage-stall">STALL</div>
            <div className="timeline-cell stage-id">ID</div>
            <div className="timeline-cell stage-ex">EX (forwarded)</div>
          </div>

          <p>
            With the one-cycle stall, the <code>add</code> instruction delays its EX stage to cycle 5, and the loaded value can be forwarded from MEM/WB to the EX stage. The pipeline remains correct at the cost of one bubble.
          </p>
        </section>

        {/* Control Hazards */}
        <section className="section">
          <h2>Control Hazards</h2>
          <p>
            Control hazards occur when the program flow changes due to branches (<code>beq</code>, <code>bne</code>) or jumps (<code>j</code>, <code>jal</code>). Since instructions are fetched sequentially, the processor may fetch wrong-path instructions before knowing the branch outcome.
          </p>

          <h3>Branch Decision Timing</h3>
          <p>
            In this processor, branch decisions are made in the EX stage:
          </p>
          <ul>
            <li>The branch target address is calculated in EX</li>
            <li>The ALU compares the two operands to determine if the branch is taken</li>
            <li>By the time we know the outcome, two wrong-path instructions are already in the pipeline (IF and ID stages)</li>
          </ul>

          <h3>Branch Flush Logic</h3>
          <p>
            When a branch is taken, the processor must flush (cancel) the wrong-path instructions:
          </p>

          <div className="code-block">
            <span className="comment">// Branch resolution in EX stage</span><br />
            <span className="keyword">wire</span> <span className="signal">branch_taken</span> = <span className="signal">ctrl_branch</span> && (<span className="signal">ctrl_bne</span> ? <span className="signal">alu_neq</span> : ~<span className="signal">alu_neq</span>);<br />
            <span className="keyword">wire</span> <span className="signal">jump</span> = <span className="signal">ctrl_jump</span>;<br />
            <br />
            <span className="comment">// Flush IF/ID and ID/EX on taken branch or jump</span><br />
            <span className="keyword">assign</span> <span className="signal">flush_ifid</span> = <span className="signal">branch_taken</span> || <span className="signal">jump</span>;<br />
            <span className="keyword">assign</span> <span className="signal">flush_idex</span> = <span className="signal">branch_taken</span>;<br />
            <br />
            <span className="comment">// PC source selection</span><br />
            <span className="keyword">assign</span> <span className="signal">pc_next</span> = <span className="signal">jump</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;? <span className="signal">jump_target</span> :<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">branch_taken</span> ? <span className="signal">branch_target</span> :<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">pc_plus_one</span>;
          </div>

          <p>
            The flush signals convert the pipeline registers into NOPs, effectively canceling the wrong-path instructions. The PC is updated to the branch target or jump target, and correct-path instructions begin fetching immediately.
          </p>

          <h3>Control Hazard Performance Impact</h3>
          <p>
            Control hazards incur a performance penalty:
          </p>
          <ul>
            <li><strong>Taken branch:</strong> 2-cycle penalty (flush IF and ID stages)</li>
            <li><strong>Jump:</strong> 1-cycle penalty (flush IF stage)</li>
            <li><strong>Not-taken branch:</strong> No penalty (no flush needed)</li>
          </ul>
          <p>
            More advanced processors use <strong>branch prediction</strong> to speculatively fetch instructions based on predicted branch outcomes, reducing the average penalty. This processor uses a simpler approach: assume branches are not taken, and flush on misprediction.
          </p>
        </section>

        {/* Forwarding Paths Diagram */}
        <section className="section">
          <h2>Forwarding Paths Diagram</h2>
          <p>
            Here's a visual representation of the two main forwarding paths in the processor:
          </p>

          <div className="forwarding-diagram">
            <div className="forwarding-box">
              <h4>EX Stage</h4>
              <p>ALU inputs<br />need operands</p>
            </div>

            <div className="forwarding-arrow">←</div>

            <div className="forwarding-box">
              <h4>EX/MEM</h4>
              <p>ALU result<br />(EX-to-EX)</p>
            </div>

            <div className="forwarding-arrow">←</div>

            <div className="forwarding-box">
              <h4>MEM/WB</h4>
              <p>Memory/ALU data<br />(MEM-to-EX)</p>
            </div>
          </div>

          <p>
            Forwarding paths (orange arrows) allow computed values to bypass the normal pipeline flow and reach the EX stage immediately when needed. This keeps the pipeline flowing efficiently without unnecessary stalls.
          </p>

          <h3>When Forwarding Happens</h3>
          <ul>
            <li><strong>EX-to-EX (most common):</strong> Previous instruction computed an ALU result, current instruction needs it</li>
            <li><strong>MEM-to-EX (less common):</strong> Instruction two cycles back produced a result, current instruction needs it (and there's no more recent forwarding source)</li>
            <li><strong>No forwarding:</strong> No data hazard detected, read normally from register file</li>
          </ul>
        </section>

        {/* Explore Further */}
        <section className="section">
          <h2>Explore Further</h2>
          <div className="quick-links">
            <Link to="/projects/cpu/docs/multdiv" className="quick-link">← Multiplication & Division</Link>
            <Link to="/projects/cpu/docs" className="quick-link">Back to CPU Docs</Link>
            <a href="https://github.com/AaronDiefes/CPU" target="_blank" rel="noopener noreferrer" className="quick-link">View on GitHub</a>
          </div>
        </section>
      </div>

      <footer>
        <p>&copy; {new Date().getFullYear()} Aaron Diefes. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default CpuHazardsPage
