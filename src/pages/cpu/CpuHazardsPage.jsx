import React from 'react'
import DocsLayout from '../../components/docs/DocsLayout'
import DocsSection from '../../components/docs/DocsSection'

const TOC = [
  { id: 'overview', label: 'Overview', level: 2 },
  { id: 'data-hazards', label: 'Data Hazards', level: 2 },
  { id: 'data-forwarding-bypassing', label: 'Data Forwarding (Bypassing)', level: 2 },
  { id: 'load-use-hazard-stall-required', label: 'Load-Use Hazard (Stall Required)', level: 2 },
  { id: 'control-hazards', label: 'Control Hazards', level: 2 },
  { id: 'forwarding-paths-diagram', label: 'Forwarding Paths Diagram', level: 2 }
]

function CpuHazardsPage() {
  return (
    <DocsLayout
      project="cpu"
      currentSlug="hazards"
      title="Hazards & Forwarding"
      subtitle="Checkpoint 4 - Keeping the Pipeline Flowing"
      tocItems={TOC}
    >
      <style>{`
        .docs-layout .docs-content ol {
            margin-bottom: 1rem;
            line-height: 1.8;
            color: var(--color-text-light);
            padding-left: 2rem;
        }

        .docs-layout .docs-content .hazard-example {
            background: var(--stage-ex-tint);
            border-left: 4px solid var(--status-warn-border);
            padding: 1.5rem;
            border-radius: 0 8px 8px 0;
            margin: 1.5rem 0;
        }
        .docs-layout .docs-content .hazard-example code {
            font-family: 'Monaco', 'Courier New', monospace;
            background: rgba(0,0,0,0.05);
            padding: 0.15rem 0.4rem;
            border-radius: 3px;
        }

        .docs-layout .docs-content .timeline-table {
            display: grid;
            grid-template-columns: auto repeat(5, 1fr);
            gap: 0;
            margin: 1.5rem 0;
            border: 1px solid var(--color-border-light);
            border-radius: 8px;
            overflow: hidden;
            max-width: 800px;
        }
        .docs-layout .docs-content .timeline-header {
            background: var(--color-primary);
            color: var(--color-surface);
            padding: 0.75rem;
            font-weight: 600;
            text-align: center;
        }
        .docs-layout .docs-content .timeline-cell {
            padding: 0.75rem;
            text-align: center;
            border: 1px solid var(--color-border-light);
            background: var(--color-surface);
        }
        .docs-layout .docs-content .timeline-label {
            background: var(--color-surface-alt);
            padding: 0.75rem;
            font-weight: 600;
            border: 1px solid var(--color-border-light);
            white-space: nowrap;
        }

        .docs-layout .docs-content .stage-if       { background: var(--stage-id-tint); font-weight: 600; }
        .docs-layout .docs-content .stage-id       { background: var(--stage-mem-tint); font-weight: 600; }
        .docs-layout .docs-content .stage-ex       { background: var(--color-highlight); font-weight: 600; }
        .docs-layout .docs-content .stage-mem      { background: var(--stage-wb-tint); font-weight: 600; }
        .docs-layout .docs-content .stage-wb       { background: var(--stage-if-tint); font-weight: 600; }
        .docs-layout .docs-content .stage-stall    { background: var(--status-warn-bg); font-weight: 600; color: var(--status-err-fg); }
        /* The saturated amber (--status-warn-border) is a border colour, and it
           is unusable as a text fill: white on it scores 1.63:1 in light mode
           and no token clears 4.5:1 in both themes. So the cell takes the
           designed warn pair (4.96:1 light / 8.73:1 dark) and keeps its louder
           identity - and its distinction from .stage-stall - via an inset ring
           in the original amber rather than a flood fill. */
        .docs-layout .docs-content .stage-conflict {
            background: var(--status-warn-bg);
            color: var(--status-warn-fg);
            box-shadow: inset 0 0 0 2px var(--status-warn-border);
            font-weight: 700;
        }

        .docs-layout .docs-content .forwarding-diagram {
            display: flex;
            justify-content: space-around;
            align-items: center;
            padding: 2rem;
            background: var(--color-surface-alt);
            border-radius: 8px;
            margin: 1.5rem 0;
            flex-wrap: wrap;
            gap: 2rem;
        }
        .docs-layout .docs-content .forwarding-box {
            background: var(--color-surface);
            border: 2px solid var(--color-primary);
            border-radius: 8px;
            padding: 1.5rem;
            min-width: 150px;
            text-align: center;
            position: relative;
        }
        .docs-layout .docs-content .forwarding-box h4 {
            margin: 0 0 0.5rem 0;
            color: var(--color-primary);
            font-size: 1rem;
        }
        .docs-layout .docs-content .forwarding-box p {
            margin: 0;
            font-size: 0.85rem;
            color: var(--color-text-muted);
        }
        /* These arrows carry meaning - they show which way a value is forwarded
           - so they have to be readable. The raw amber border colour scored
           1.48:1 on the band; the warn foreground keeps the amber identity at
           4.5:1+ in both themes. */
        .docs-layout .docs-content .forwarding-arrow {
            color: var(--status-warn-fg);
            font-size: 2rem;
            font-weight: bold;
        }

        @media (max-width: 768px) {
            .docs-layout .docs-content .timeline-table {
                font-size: 0.85rem;
            }
            .docs-layout .docs-content .forwarding-diagram {
                flex-direction: column;
            }
        }
      `}</style>

      <DocsSection id="overview" title="Overview">
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
      </DocsSection>

      <DocsSection id="data-hazards" title="Data Hazards">
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
      </DocsSection>

      <DocsSection id="data-forwarding-bypassing" title="Data Forwarding (Bypassing)">
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
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&&  !(<span className="signal">exmem_regWrite</span> && <span className="signal">exmem_rd</span> == <span className="signal">idex_rs</span>)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&&  (<span className="signal">memwb_rd</span> == <span className="signal">idex_rs</span>);<br />
          <span className="keyword">wire</span> <span className="signal">mem_hazard_B</span> = (<span className="signal">memwb_regWrite</span> && <span className="signal">memwb_rd</span> != <span className="number">0</span>)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&&  !(<span className="signal">exmem_regWrite</span> && <span className="signal">exmem_rd</span> == <span className="signal">idex_rt</span>)<br />
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&&  (<span className="signal">memwb_rd</span> == <span className="signal">idex_rt</span>);
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
      </DocsSection>

      <DocsSection id="load-use-hazard-stall-required" title="Load-Use Hazard (Stall Required)">
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
      </DocsSection>

      <DocsSection id="control-hazards" title="Control Hazards">
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
      </DocsSection>

      <DocsSection id="forwarding-paths-diagram" title="Forwarding Paths Diagram">
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
      </DocsSection>
    </DocsLayout>
  )
}

export default CpuHazardsPage
