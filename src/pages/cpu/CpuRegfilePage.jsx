import React from 'react'
import DocsLayout from '../../components/docs/DocsLayout'
import DocsSection from '../../components/docs/DocsSection'

const TOC = [
  { id: 'overview', label: 'Overview', level: 2 },
  { id: 'architecture', label: 'Architecture', level: 2 },
  { id: '0-hardwired-to-zero', label: '$0 Hardwired to Zero', level: 2 },
  { id: 'read-port-implementation', label: 'Read Port Implementation', level: 2 },
  { id: 'write-port-implementation', label: 'Write Port Implementation', level: 2 },
  { id: 'register-conventions', label: 'Register Conventions', level: 2 }
]

function CpuRegfilePage() {
  return (
    <DocsLayout
      project="cpu"
      currentSlug="regfile"
      title="Register File"
      subtitle="Checkpoint 2 - 32-Register Storage"
      tocItems={TOC}
    >
      <style>{`
        /* This page never set padding-left, so the global "* { padding: 0 }" reset
           left its lists flush. docs-content.css now sets 2rem for every other
           page, so it has to be reset back to 0 here to preserve the original
           appearance. Pre-existing divergence, kept deliberately. */
        .docs-layout .docs-content ul {
            margin-bottom: 1rem;
            line-height: 1.8;
            color: var(--color-text-light);
            padding-left: 0;
        }

        .docs-layout .docs-content .code-block {
            background: var(--color-code-bg);
            color: var(--color-code-text);
            padding: 1.5rem;
            border-radius: 8px;
            overflow-x: auto;
            margin: 1.5rem 0;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 0.9rem;
            line-height: 1.6;
        }
        .docs-layout .docs-content .code-block .comment { color: var(--color-code-comment); }
        .docs-layout .docs-content .code-block .keyword { color: var(--color-code-keyword); }
        .docs-layout .docs-content .code-block .type    { color: var(--color-code-string); }
        .docs-layout .docs-content .code-block .signal  { color: var(--color-code-signal); }

        .docs-layout .docs-content .port-diagram {
            background: var(--color-surface-alt);
            padding: 1.5rem;
            border-radius: 8px;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 0.85rem;
            line-height: 1.8;
            margin: 1.5rem 0;
            border-left: 4px solid var(--color-primary);
        }

        .docs-layout .docs-content .ops-table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .docs-layout .docs-content .ops-table th {
            background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
            color: var(--color-surface);
            padding: 1rem;
            text-align: left;
            font-weight: 600;
        }
        .docs-layout .docs-content .ops-table td {
            padding: 0.75rem 1rem;
            border-bottom: 1px solid var(--color-border);
            color: var(--color-text-light);
        }
        .docs-layout .docs-content .ops-table tr:hover {
            background: var(--color-surface-alt);
        }

        @media (max-width: 768px) {
            .docs-layout .docs-content .code-block {
                font-size: 0.8rem;
                padding: 1rem;
            }
            .docs-layout .docs-content .port-diagram {
                font-size: 0.75rem;
                padding: 1rem;
            }
        }
      `}</style>

      <DocsSection id="overview" title="Overview">
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
      </DocsSection>

      <DocsSection id="architecture" title="Architecture">
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
      </DocsSection>

      <DocsSection id="0-hardwired-to-zero" title="$0 Hardwired to Zero">
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
      </DocsSection>

      <DocsSection id="read-port-implementation" title="Read Port Implementation">
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
      </DocsSection>

      <DocsSection id="write-port-implementation" title="Write Port Implementation">
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
      </DocsSection>

      <DocsSection id="register-conventions" title="Register Conventions">
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
      </DocsSection>
    </DocsLayout>
  )
}

export default CpuRegfilePage
