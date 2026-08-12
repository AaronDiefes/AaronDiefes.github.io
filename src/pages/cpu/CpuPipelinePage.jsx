import React from 'react'
import { Link } from 'react-router-dom'
import DocsLayout from '../../components/docs/DocsLayout'
import DocsSection from '../../components/docs/DocsSection'

const TOC = [
  { id: 'overview', label: 'Overview', level: 2 },
  { id: 'pipeline-stages', label: 'Pipeline Stages', level: 2 },
  { id: 'pipeline-registers', label: 'Pipeline Registers', level: 2 },
  { id: 'control-unit', label: 'Control Unit', level: 2 },
  { id: 'instruction-execution-timeline', label: 'Instruction Execution Timeline', level: 2 }
]

function CpuPipelinePage() {
  return (
    <DocsLayout
      project="cpu"
      currentSlug="pipeline"
      title="Pipeline Architecture"
      subtitle="Checkpoint 4 - 5-Stage Pipelined Processor"
      tocItems={TOC}
    >
      <style>{`
        .docs-layout .docs-content h4 {
            color: var(--color-primary);
            margin-top: 1.5rem;
            margin-bottom: 0.75rem;
            font-size: 1.25rem;
        }

        .docs-layout .docs-content .pipeline-diagram {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 2rem 0;
            padding: 2rem;
            background: var(--color-surface-alt);
            border-radius: 8px;
            flex-wrap: wrap;
            gap: 1rem;
        }
        .docs-layout .docs-content .pipeline-step {
            flex: 1;
            min-width: 100px;
            text-align: center;
            padding: 1rem;
            background: white;
            border-radius: 8px;
            border: 2px solid var(--color-primary);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .docs-layout .docs-content .pipeline-step h4 {
            color: var(--color-primary);
            font-weight: 600;
            margin: 0 0 0.5rem 0;
            font-size: 1.1rem;
        }
        .docs-layout .docs-content .pipeline-step p {
            margin: 0;
            font-size: 0.85rem;
            color: var(--color-text-muted);
        }
        .docs-layout .docs-content .pipeline-arrow {
            font-size: 1.5rem;
            color: var(--color-primary);
            font-weight: bold;
        }

        .docs-layout .docs-content .control-table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
            font-size: 0.9rem;
        }
        .docs-layout .docs-content .control-table th {
            background: var(--color-primary);
            color: white;
            padding: 0.75rem;
            text-align: left;
            font-weight: 600;
        }
        .docs-layout .docs-content .control-table td {
            padding: 0.75rem;
            border-bottom: 1px solid var(--color-border);
            text-align: center;
        }
        .docs-layout .docs-content .control-table td:first-child {
            text-align: left;
            font-weight: 600;
        }
        .docs-layout .docs-content .control-table tr:hover {
            background: var(--color-surface-alt);
        }
        .docs-layout .docs-content .control-table code {
            background: var(--color-surface-alt);
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 0.85rem;
        }

        .docs-layout .docs-content .timeline-table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
            font-size: 0.85rem;
        }
        .docs-layout .docs-content .timeline-table th,
        .docs-layout .docs-content .timeline-table td {
            padding: 0.5rem;
            text-align: center;
            border: 1px solid var(--color-border-light);
        }
        .docs-layout .docs-content .timeline-table th {
            background: var(--color-surface-alt);
            color: var(--color-text-heading);
            font-weight: 600;
        }
        .docs-layout .docs-content .timeline-table td:first-child {
            background: var(--color-surface-alt);
            font-weight: 600;
            color: var(--color-text-heading);
        }

        .docs-layout .docs-content .stage-if  { background: var(--stage-if-tint); color: var(--color-primary); font-weight: 600; }
        .docs-layout .docs-content .stage-id  { background: var(--stage-if-tint); color: var(--color-primary-dark); font-weight: 600; }
        .docs-layout .docs-content .stage-ex  { background: var(--color-accent); color: var(--color-primary-dark); font-weight: 600; }
        .docs-layout .docs-content .stage-mem { background: var(--color-accent); color: white;   font-weight: 600; }
        .docs-layout .docs-content .stage-wb  { background: var(--color-primary); color: white;   font-weight: 600; }

        @media (max-width: 768px) {
            .docs-layout .docs-content .pipeline-diagram {
                flex-direction: column;
            }
            .docs-layout .docs-content .pipeline-arrow {
                transform: rotate(90deg);
            }
        }

        @media (max-width: 480px) {
            .docs-layout .docs-content .control-table,
            .docs-layout .docs-content .timeline-table {
                font-size: 0.75rem;
            }
            .docs-layout .docs-content .control-table th,
            .docs-layout .docs-content .control-table td,
            .docs-layout .docs-content .timeline-table th,
            .docs-layout .docs-content .timeline-table td {
                padding: 0.4rem;
            }
        }
      `}</style>

      <DocsSection id="overview" title="Overview">
        <p>
          <strong>Pipelining</strong> is a technique that allows multiple instructions to be processed simultaneously at different stages of execution. Instead of waiting for one instruction to complete all five stages before starting the next, a pipelined processor overlaps instruction execution to maximize throughput.
        </p>

        <p>
          <strong>Without pipelining:</strong> Each instruction takes 5 clock cycles to complete (Fetch → Decode → Execute → Memory → Writeback), and the next instruction must wait until all stages are done. Total time for 5 instructions: 25 cycles.
        </p>

        <p>
          <strong>With pipelining:</strong> While Instruction 1 is in the Decode stage, Instruction 2 can be in the Fetch stage. Multiple instructions are "in flight" simultaneously, with each at a different stage. Total time for 5 instructions: 9 cycles (5 to fill the pipeline + 4 more cycles to complete the rest).
        </p>

        <p>
          <strong>Ideal throughput:</strong> Once the pipeline is full, one instruction completes every clock cycle—a <strong>5x speedup</strong> compared to non-pipelined execution.
        </p>

        <p>
          This processor implements a <strong>5-stage pipeline</strong>:
        </p>
        <ul>
          <li><strong>IF (Instruction Fetch):</strong> Read instruction from memory</li>
          <li><strong>ID (Instruction Decode):</strong> Decode instruction fields and read registers</li>
          <li><strong>EX (Execute):</strong> Perform ALU operation or compute address</li>
          <li><strong>MEM (Memory Access):</strong> Read/write data memory for load/store</li>
          <li><strong>WB (Write Back):</strong> Write result back to register file</li>
        </ul>

        <p>
          <strong>Pipeline registers</strong> between each stage hold intermediate results and pass them to the next stage on each clock cycle. These registers are essential for maintaining the state of each instruction as it flows through the pipeline.
        </p>
      </DocsSection>

      <DocsSection id="pipeline-stages" title="Pipeline Stages">
        <div className="pipeline-diagram">
          <div className="pipeline-step">
            <h4>IF</h4>
            <p>Fetch</p>
          </div>
          <div className="pipeline-arrow">→</div>
          <div className="pipeline-step">
            <h4>ID</h4>
            <p>Decode</p>
          </div>
          <div className="pipeline-arrow">→</div>
          <div className="pipeline-step">
            <h4>EX</h4>
            <p>Execute</p>
          </div>
          <div className="pipeline-arrow">→</div>
          <div className="pipeline-step">
            <h4>MEM</h4>
            <p>Memory</p>
          </div>
          <div className="pipeline-arrow">→</div>
          <div className="pipeline-step">
            <h4>WB</h4>
            <p>Writeback</p>
          </div>
        </div>

        <h3>Stage 1: Instruction Fetch (IF)</h3>
        <p>
          The Instruction Fetch stage reads the next instruction from instruction memory (ROM) using the current value of the Program Counter (PC). The PC is then incremented by 1 to point to the next instruction in sequence (unless a branch or jump changes the flow).
        </p>
        <p>
          Both the fetched instruction and the incremented PC value (PC+1) are passed to the IF/ID pipeline register for use in the next stage.
        </p>

        <div className="code-block">
          <span className="comment">// Instruction Fetch stage</span><br />
          <span className="keyword">wire</span> [<span className="number">31</span>:<span className="number">0</span>] <span className="signal">pc_current</span>, <span className="signal">pc_plus_one</span>, <span className="signal">instruction</span>;<br />
          <br />
          <span className="keyword">assign</span> <span className="signal">pc_plus_one</span> <span className="operator">=</span> <span className="signal">pc_current</span> <span className="operator">+</span> <span className="number">32'd1</span>;<br />
          <br />
          <span className="comment">// Instruction memory (ROM)</span><br />
          <span className="keyword">ROM</span> instruction_memory(<br />
          &nbsp;&nbsp;.<span className="signal">address</span>(<span className="signal">pc_current</span>[<span className="number">11</span>:<span className="number">0</span>]),<br />
          &nbsp;&nbsp;.<span className="signal">data</span>(<span className="signal">instruction</span>)<br />
          );
        </div>

        <h3>Stage 2: Instruction Decode (ID)</h3>
        <p>
          The Instruction Decode stage extracts the instruction fields (opcode, register addresses, immediate values) and reads two source registers from the register file. The 16-bit immediate value is sign-extended to 32 bits for use in arithmetic and memory address calculations.
        </p>
        <p>
          The control unit analyzes the opcode and generates control signals that determine how the instruction will be executed in subsequent stages (e.g., ALUSrc, MemWrite, RegWrite).
        </p>

        <div className="code-block">
          <span className="comment">// Instruction Decode - field extraction</span><br />
          <span className="keyword">wire</span> [<span className="number">4</span>:<span className="number">0</span>]&nbsp;&nbsp;<span className="signal">opcode</span> <span className="operator">=</span> <span className="signal">instruction</span>[<span className="number">31</span>:<span className="number">27</span>];<br />
          <span className="keyword">wire</span> [<span className="number">4</span>:<span className="number">0</span>]&nbsp;&nbsp;<span className="signal">rd</span>&nbsp;&nbsp;&nbsp;&nbsp; <span className="operator">=</span> <span className="signal">instruction</span>[<span className="number">26</span>:<span className="number">22</span>];<br />
          <span className="keyword">wire</span> [<span className="number">4</span>:<span className="number">0</span>]&nbsp;&nbsp;<span className="signal">rs</span>&nbsp;&nbsp;&nbsp;&nbsp; <span className="operator">=</span> <span className="signal">instruction</span>[<span className="number">21</span>:<span className="number">17</span>];<br />
          <span className="keyword">wire</span> [<span className="number">4</span>:<span className="number">0</span>]&nbsp;&nbsp;<span className="signal">rt</span>&nbsp;&nbsp;&nbsp;&nbsp; <span className="operator">=</span> <span className="signal">instruction</span>[<span className="number">16</span>:<span className="number">12</span>];<br />
          <span className="keyword">wire</span> [<span className="number">4</span>:<span className="number">0</span>]&nbsp;&nbsp;<span className="signal">shamt</span>&nbsp; <span className="operator">=</span> <span className="signal">instruction</span>[<span className="number">11</span>:<span className="number">7</span>];<br />
          <span className="keyword">wire</span> [<span className="number">16</span>:<span className="number">0</span>] <span className="signal">immediate</span> <span className="operator">=</span> <span className="signal">instruction</span>[<span className="number">16</span>:<span className="number">0</span>];<br />
          <span className="keyword">wire</span> [<span className="number">26</span>:<span className="number">0</span>] <span className="signal">target</span> <span className="operator">=</span> <span className="signal">instruction</span>[<span className="number">26</span>:<span className="number">0</span>];<br />
          <br />
          <span className="comment">// Sign extension</span><br />
          <span className="keyword">wire</span> [<span className="number">31</span>:<span className="number">0</span>] <span className="signal">sign_extended</span> <span className="operator">=</span> {'{'}{'{'}<span className="number">15</span>{'{'}<span className="signal">immediate</span>[<span className="number">16</span>]{'}'}{'}'},&nbsp;<span className="signal">immediate</span>{'}'};
        </div>

        <h3>Stage 3: Execute (EX)</h3>
        <p>
          The Execute stage performs the actual computation. The ALU receives two operands:
        </p>
        <ul>
          <li><strong>For R-type instructions:</strong> Two register values (e.g., <code>add $t0, $t1, $t2</code>)</li>
          <li><strong>For I-type instructions:</strong> One register value and the sign-extended immediate (e.g., <code>addi $t0, $t1, 100</code>)</li>
        </ul>
        <p>
          For branch instructions, the ALU computes the branch condition (equal/not-equal) by comparing two register values. For load/store instructions, the ALU calculates the memory address by adding the base register and offset.
        </p>
        <p>
          The <strong>MultDiv unit</strong> handles multiply and divide operations, which take multiple cycles to complete and may stall the pipeline.
        </p>

        <div className="code-block">
          <span className="comment">// Execute stage - ALU input selection</span><br />
          <span className="keyword">wire</span> [<span className="number">31</span>:<span className="number">0</span>] <span className="signal">alu_inputA</span> <span className="operator">=</span> <span className="signal">data_readRegA</span>;<br />
          <span className="keyword">wire</span> [<span className="number">31</span>:<span className="number">0</span>] <span className="signal">alu_inputB</span> <span className="operator">=</span> <span className="signal">ctrl_ALUinB</span> <span className="operator">?</span> <span className="signal">sign_extended</span> : <span className="signal">data_readRegB</span>;<br />
          <br />
          <span className="keyword">ALU</span> processor_alu(<br />
          &nbsp;&nbsp;.<span className="signal">data_operandA</span>(<span className="signal">alu_inputA</span>),<br />
          &nbsp;&nbsp;.<span className="signal">data_operandB</span>(<span className="signal">alu_inputB</span>),<br />
          &nbsp;&nbsp;.<span className="signal">ctrl_ALUopcode</span>(<span className="signal">alu_opcode</span>),<br />
          &nbsp;&nbsp;.<span className="signal">ctrl_shiftamt</span>(<span className="signal">shamt</span>),<br />
          &nbsp;&nbsp;.<span className="signal">data_result</span>(<span className="signal">alu_result</span>),<br />
          &nbsp;&nbsp;.<span className="signal">isNotEqual</span>(<span className="signal">alu_neq</span>),<br />
          &nbsp;&nbsp;.<span className="signal">isLessThan</span>(<span className="signal">alu_lt</span>),<br />
          &nbsp;&nbsp;.<span className="signal">overflow</span>(<span className="signal">alu_overflow</span>)<br />
          );
        </div>

        <h3>Stage 4: Memory Access (MEM)</h3>
        <p>
          The Memory Access stage is used by load and store instructions to read from or write to data memory (RAM). The memory address comes from the ALU result calculated in the previous stage.
        </p>
        <ul>
          <li><strong>Load instructions (<code>lw</code>):</strong> Read data from memory at the computed address</li>
          <li><strong>Store instructions (<code>sw</code>):</strong> Write register data to memory at the computed address</li>
          <li><strong>Other instructions:</strong> Pass through without accessing memory (ALU result forwarded to next stage)</li>
        </ul>
        <p>
          A multiplexer selects between memory data (for loads) and the ALU result (for arithmetic) to determine what value will be written back to the register file.
        </p>

        <div className="code-block">
          <span className="comment">// Memory stage</span><br />
          <span className="keyword">RAM</span> data_memory(<br />
          &nbsp;&nbsp;.<span className="signal">address</span>(<span className="signal">alu_result_mem</span>[<span className="number">11</span>:<span className="number">0</span>]),<br />
          &nbsp;&nbsp;.<span className="signal">data_in</span>(<span className="signal">data_readRegB_mem</span>),<br />
          &nbsp;&nbsp;.<span className="signal">write_enable</span>(<span className="signal">ctrl_memWrite</span>),<br />
          &nbsp;&nbsp;.<span className="signal">clock</span>(<span className="signal">clock</span>),<br />
          &nbsp;&nbsp;.<span className="signal">data_out</span>(<span className="signal">mem_data</span>)<br />
          );<br />
          <br />
          <span className="comment">// Select: memory data (load) or ALU result (other)</span><br />
          <span className="keyword">wire</span> [<span className="number">31</span>:<span className="number">0</span>] <span className="signal">wb_data</span> <span className="operator">=</span> <span className="signal">ctrl_memToReg</span> <span className="operator">?</span> <span className="signal">mem_data</span> : <span className="signal">alu_result_mem</span>;
        </div>

        <h3>Stage 5: Write Back (WB)</h3>
        <p>
          The Write Back stage writes the final result back to the register file. The destination register is determined by the instruction type:
        </p>
        <ul>
          <li><strong>R-type instructions:</strong> Write to <code>rd</code> (e.g., <code>add $t0, $t1, $t2</code> writes to <code>$t0</code>)</li>
          <li><strong>I-type load instructions:</strong> Write to <code>rt</code> (e.g., <code>lw $t0, 0($t1)</code> writes to <code>$t0</code>)</li>
        </ul>
        <p>
          The <strong>RegWrite</strong> control signal determines whether the instruction produces a result that should be written back. Store and branch instructions do not write to the register file, so RegWrite is 0 for those instructions.
        </p>

        <div className="code-block">
          <span className="comment">// Write Back stage</span><br />
          <span className="keyword">assign</span> <span className="signal">ctrl_writeEnable</span> <span className="operator">=</span> <span className="signal">reg_write_wb</span>;<br />
          <span className="keyword">assign</span> <span className="signal">ctrl_writeReg</span> <span className="operator">=</span> <span className="signal">dest_reg_wb</span>;<br />
          <span className="keyword">assign</span> <span className="signal">data_writeReg</span> <span className="operator">=</span> <span className="signal">wb_data_wb</span>;
        </div>
      </DocsSection>

      <DocsSection id="pipeline-registers" title="Pipeline Registers">
        <p>
          Pipeline registers are the "glue" that connects each stage together. These registers store intermediate values at the end of each clock cycle and provide inputs to the next stage. There are <strong>four pipeline register banks</strong> separating the five stages:
        </p>

        <ul>
          <li><strong>IF/ID Register:</strong> Holds the fetched instruction and PC+1 value</li>
          <li><strong>ID/EX Register:</strong> Holds decoded values, control signals, register data, and sign-extended immediate</li>
          <li><strong>EX/MEM Register:</strong> Holds ALU result, memory write data, destination register, and control signals</li>
          <li><strong>MEM/WB Register:</strong> Holds final data to write back (memory data or ALU result), destination register, and control signals</li>
        </ul>

        <p>
          All pipeline registers are <strong>edge-triggered D flip-flops</strong> that update on the rising edge of the clock. This synchronization ensures that all stages advance together, maintaining the integrity of the pipeline.
        </p>

        <p>
          Pipeline registers also include control logic for <strong>flushing</strong> (inserting NOPs to discard invalid instructions after a branch) and <strong>stalling</strong> (freezing the pipeline when waiting for a multi-cycle operation like multiply/divide or resolving a data hazard).
        </p>

        <h3>IF/ID Pipeline Register Example</h3>

        <div className="code-block">
          <span className="comment">// IF/ID Pipeline Register</span><br />
          <span className="keyword">reg</span> [<span className="number">31</span>:<span className="number">0</span>] <span className="signal">ifid_instruction</span>, <span className="signal">ifid_pc_plus_one</span>;<br />
          <br />
          <span className="keyword">always</span> @(<span className="keyword">posedge</span> <span className="signal">clock</span> <span className="keyword">or</span> <span className="keyword">posedge</span> <span className="signal">reset</span>) <span className="keyword">begin</span><br />
          &nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">reset</span> <span className="operator">||</span> <span className="signal">flush_ifid</span>) <span className="keyword">begin</span><br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">ifid_instruction</span> <span className="operator">&lt;=</span> <span className="number">32'b0</span>;&nbsp;&nbsp;<span className="comment">// NOP</span><br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">ifid_pc_plus_one</span> <span className="operator">&lt;=</span> <span className="number">32'b0</span>;<br />
          &nbsp;&nbsp;<span className="keyword">end</span> <span className="keyword">else if</span> (!<span className="signal">stall</span>) <span className="keyword">begin</span><br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">ifid_instruction</span> <span className="operator">&lt;=</span> <span className="signal">instruction</span>;<br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">ifid_pc_plus_one</span> <span className="operator">&lt;=</span> <span className="signal">pc_plus_one</span>;<br />
          &nbsp;&nbsp;<span className="keyword">end</span><br />
          <span className="keyword">end</span>
        </div>

        <p>
          <strong>Flush:</strong> When a branch is taken, instructions that were fetched after the branch need to be discarded (converted to NOPs). The <code>flush_ifid</code> signal clears the IF/ID register.
        </p>

        <p>
          <strong>Stall:</strong> When a hazard is detected (e.g., a load instruction followed immediately by an instruction that uses the loaded value), the pipeline must stall. The <code>stall</code> signal prevents pipeline registers from updating, effectively "freezing" the instruction in place until the hazard is resolved.
        </p>
      </DocsSection>

      <DocsSection id="control-unit" title="Control Unit">
        <p>
          The <strong>Control Unit</strong> is responsible for generating control signals based on the instruction's opcode. These signals orchestrate the behavior of the datapath components (ALU, memory, register file, multiplexers) to execute the instruction correctly.
        </p>

        <p>
          Each instruction type requires a specific combination of control signals. For example, an R-type <code>add</code> instruction needs to read two registers, perform an ALU addition, and write the result back to a register. An I-type <code>lw</code> (load word) instruction needs to calculate a memory address using the ALU, read from memory, and write the loaded data to a register.
        </p>

        <h3>Control Signals</h3>
        <ul>
          <li><strong>RegWrite:</strong> Enable writing to the register file (1 for instructions that produce a result)</li>
          <li><strong>MemWrite:</strong> Enable writing to data memory (1 for store instructions)</li>
          <li><strong>MemToReg:</strong> Select memory data for writeback (1 for load instructions, 0 for ALU result)</li>
          <li><strong>ALUSrc:</strong> Select second ALU input (1 for immediate value, 0 for register value)</li>
          <li><strong>Branch:</strong> Indicates a branch instruction (used to compute branch target)</li>
          <li><strong>Jump:</strong> Indicates a jump instruction (unconditional control transfer)</li>
          <li><strong>ALUOp:</strong> Specifies the ALU operation (add, subtract, AND, OR, etc.)</li>
        </ul>

        <h3>Control Signal Table</h3>
        <p>
          The following table shows the control signals for common instruction types. The opcode determines which signals are asserted (1) or deasserted (0).
        </p>

        <table className="control-table">
          <thead>
            <tr>
              <th>Instruction Type</th>
              <th>Opcode</th>
              <th>RegWrite</th>
              <th>MemWrite</th>
              <th>MemToReg</th>
              <th>ALUSrc</th>
              <th>Branch</th>
              <th>Jump</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>R-type (add, sub, and, or)</td>
              <td><code>00000</code></td>
              <td>1</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
            </tr>
            <tr>
              <td>addi (add immediate)</td>
              <td><code>00101</code></td>
              <td>1</td>
              <td>0</td>
              <td>0</td>
              <td>1</td>
              <td>0</td>
              <td>0</td>
            </tr>
            <tr>
              <td>lw (load word)</td>
              <td><code>01000</code></td>
              <td>1</td>
              <td>0</td>
              <td>1</td>
              <td>1</td>
              <td>0</td>
              <td>0</td>
            </tr>
            <tr>
              <td>sw (store word)</td>
              <td><code>00111</code></td>
              <td>0</td>
              <td>1</td>
              <td>X</td>
              <td>1</td>
              <td>0</td>
              <td>0</td>
            </tr>
            <tr>
              <td>beq (branch if equal)</td>
              <td><code>00010</code></td>
              <td>0</td>
              <td>0</td>
              <td>X</td>
              <td>0</td>
              <td>1</td>
              <td>0</td>
            </tr>
            <tr>
              <td>bne (branch if not equal)</td>
              <td><code>00110</code></td>
              <td>0</td>
              <td>0</td>
              <td>X</td>
              <td>0</td>
              <td>1</td>
              <td>0</td>
            </tr>
            <tr>
              <td>j (jump)</td>
              <td><code>00001</code></td>
              <td>0</td>
              <td>0</td>
              <td>X</td>
              <td>X</td>
              <td>0</td>
              <td>1</td>
            </tr>
            <tr>
              <td>jal (jump and link)</td>
              <td><code>00011</code></td>
              <td>1</td>
              <td>0</td>
              <td>0</td>
              <td>X</td>
              <td>0</td>
              <td>1</td>
            </tr>
          </tbody>
        </table>

        <p>
          <strong>Note:</strong> "X" indicates a "don't care" value—the signal can be either 0 or 1 without affecting correctness because it's not used by that instruction type.
        </p>
      </DocsSection>

      <DocsSection id="instruction-execution-timeline" title="Instruction Execution Timeline">
        <p>
          The power of pipelining comes from overlapping instruction execution. While one instruction is being decoded, another is being fetched, and a third might be executing. This visualization shows how three instructions progress through the pipeline over time.
        </p>

        <table className="timeline-table">
          <thead>
            <tr>
              <th>Instruction</th>
              <th>Cycle 1</th>
              <th>Cycle 2</th>
              <th>Cycle 3</th>
              <th>Cycle 4</th>
              <th>Cycle 5</th>
              <th>Cycle 6</th>
              <th>Cycle 7</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Instr 1</td>
              <td className="stage-if">IF</td>
              <td className="stage-id">ID</td>
              <td className="stage-ex">EX</td>
              <td className="stage-mem">MEM</td>
              <td className="stage-wb">WB</td>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>Instr 2</td>
              <td></td>
              <td className="stage-if">IF</td>
              <td className="stage-id">ID</td>
              <td className="stage-ex">EX</td>
              <td className="stage-mem">MEM</td>
              <td className="stage-wb">WB</td>
              <td></td>
            </tr>
            <tr>
              <td>Instr 3</td>
              <td></td>
              <td></td>
              <td className="stage-if">IF</td>
              <td className="stage-id">ID</td>
              <td className="stage-ex">EX</td>
              <td className="stage-mem">MEM</td>
              <td className="stage-wb">WB</td>
            </tr>
          </tbody>
        </table>

        <p>
          <strong>Key observations:</strong>
        </p>
        <ul>
          <li><strong>Cycle 1:</strong> Only Instruction 1 is active (IF stage). The pipeline is filling.</li>
          <li><strong>Cycle 3:</strong> Three instructions are active simultaneously at different stages.</li>
          <li><strong>Cycle 5:</strong> Instruction 1 completes (WB stage). The pipeline is now fully utilized.</li>
          <li><strong>Cycle 6 onward:</strong> One instruction completes every cycle (ideal throughput).</li>
        </ul>

        <p>
          <strong>Latency vs. Throughput:</strong> While each individual instruction still takes 5 cycles to complete (latency), the overall throughput is 1 instruction per cycle once the pipeline is full. This is the fundamental trade-off of pipelining: latency remains constant, but throughput increases dramatically.
        </p>

        <p>
          <strong>Hazards</strong> can disrupt this ideal flow. Data hazards (when an instruction depends on the result of a previous instruction still in the pipeline), control hazards (branches), and structural hazards (resource conflicts) can force the pipeline to stall or flush, reducing throughput. These are covered in detail in the <Link to="/projects/cpu/docs/hazards">Hazards & Forwarding</Link> documentation.
        </p>
      </DocsSection>
    </DocsLayout>
  )
}

export default CpuPipelinePage
