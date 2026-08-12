import React from 'react'
import DocsLayout from '../../components/docs/DocsLayout'
import DocsSection from '../../components/docs/DocsSection'

const TOC = [
  { id: 'overview', label: 'Overview', level: 2 },
  { id: 'carry-lookahead-adder', label: 'Carry-Lookahead Adder', level: 2 },
  { id: 'alu-operations', label: 'ALU Operations', level: 2 },
  { id: 'overflow-detection', label: 'Overflow Detection', level: 2 },
  { id: 'status-flags', label: 'Status Flags', level: 2 }
]

function CpuAluPage() {
  return (
    <DocsLayout
      project="cpu"
      currentSlug="alu"
      title="ALU Design"
      subtitle="Checkpoint 1 — Arithmetic Logic Unit"
      tocItems={TOC}
    >
      <style>{`
        .docs-layout .docs-content .ops-table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
        }
        .docs-layout .docs-content .ops-table th {
            background: #2E7D32;
            color: white;
            padding: 0.75rem;
            text-align: left;
            font-weight: 600;
        }
        .docs-layout .docs-content .ops-table td {
            padding: 0.75rem;
            border-bottom: 1px solid #eee;
        }
        .docs-layout .docs-content .ops-table tr:hover {
            background: #f5f5f5;
        }
        .docs-layout .docs-content .ops-table code {
            background: #f5f5f5;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 0.9rem;
        }

        .docs-layout .docs-content h3 {
            color: #2c3e50;
            margin: 1.5rem 0 0.75rem;
            font-size: 1.25rem;
        }
        .docs-layout .docs-content p {
            margin-bottom: 1rem;
            line-height: 1.7;
            color: #444;
        }
        .docs-layout .docs-content ul {
            margin-bottom: 1rem;
            line-height: 1.7;
            color: #444;
            padding-left: 2rem;
        }
        .docs-layout .docs-content li { margin-bottom: 0.4rem; }
      `}</style>

      <DocsSection id="overview" title="Overview">
        <p>
          The <strong>Arithmetic Logic Unit (ALU)</strong> is the computational core of the processor. It performs arithmetic operations (addition, subtraction) and logical operations (AND, OR, shifts) on data. Every instruction that computes a result—whether it's adding two numbers, comparing values, or manipulating bits—relies on the ALU.
        </p>
        <p>
          <strong>Input/Output Interface:</strong>
        </p>
        <ul>
          <li><strong>Inputs:</strong> Two 32-bit data operands (<code>data_operandA</code>, <code>data_operandB</code>) and a 5-bit ALU opcode (<code>ctrl_ALUopcode</code>)</li>
          <li><strong>Outputs:</strong> A 32-bit result (<code>data_result</code>) and three status flags: <code>isNotEqual</code>, <code>isLessThan</code>, and <code>overflow</code></li>
        </ul>
        <p>
          <strong>Supported Operations:</strong> The ALU implements six fundamental operations: addition (ADD), subtraction (SUB), bitwise AND, bitwise OR, shift left logical (SLL), and shift right arithmetic (SRA). Each operation is selected by the 5-bit opcode provided by the control unit.
        </p>
      </DocsSection>

      <DocsSection id="carry-lookahead-adder" title="Carry-Lookahead Adder">
        <p>
          The heart of the ALU is the <strong>Carry-Lookahead Adder (CLA)</strong>, which performs fast 32-bit addition. Unlike a ripple-carry adder where the carry propagates sequentially through each bit position (resulting in O(n) delay), the CLA computes all carry bits in parallel using <strong>generate (G)</strong> and <strong>propagate (P)</strong> signals.
        </p>

        <h3>Why Carry-Lookahead?</h3>
        <p>
          In a ripple-carry adder, each bit position must wait for the carry from the previous position before computing its result. For a 32-bit adder, this creates a chain of 32 dependencies, making the critical path very long. The CLA breaks this chain by computing carries in logarithmic time: <strong>O(log n)</strong> instead of O(n).
        </p>

        <h3>Generate and Propagate Signals</h3>
        <p>
          The CLA uses two key signals for each bit position:
        </p>
        <ul>
          <li><strong>Generate (G<sub>i</sub>):</strong> This bit position generates a carry regardless of the carry-in. This happens when both input bits are 1: <code>G<sub>i</sub> = A<sub>i</sub> AND B<sub>i</sub></code></li>
          <li><strong>Propagate (P<sub>i</sub>):</strong> This bit position will propagate a carry-in to carry-out. This happens when exactly one input bit is 1: <code>P<sub>i</sub> = A<sub>i</sub> XOR B<sub>i</sub></code></li>
        </ul>

        <h3>Carry Equations</h3>
        <p>
          Using the generate and propagate signals, we can compute the carry-out for each bit position directly from the carry-in and the generate/propagate signals of previous positions. For a 4-bit block:
        </p>
        <ul>
          <li><code>C<sub>1</sub> = G<sub>0</sub> + P<sub>0</sub>·C<sub>0</sub></code></li>
          <li><code>C<sub>2</sub> = G<sub>1</sub> + P<sub>1</sub>·G<sub>0</sub> + P<sub>1</sub>·P<sub>0</sub>·C<sub>0</sub></code></li>
          <li><code>C<sub>3</sub> = G<sub>2</sub> + P<sub>2</sub>·G<sub>1</sub> + P<sub>2</sub>·P<sub>1</sub>·G<sub>0</sub> + P<sub>2</sub>·P<sub>1</sub>·P<sub>0</sub>·C<sub>0</sub></code></li>
          <li><code>C<sub>4</sub> = G<sub>3</sub> + P<sub>3</sub>·G<sub>2</sub> + P<sub>3</sub>·P<sub>2</sub>·G<sub>1</sub> + P<sub>3</sub>·P<sub>2</sub>·P<sub>1</sub>·G<sub>0</sub> + P<sub>3</sub>·P<sub>2</sub>·P<sub>1</sub>·P<sub>0</sub>·C<sub>0</sub></code></li>
        </ul>

        <h3>Two-Level CLA Structure</h3>
        <p>
          For a 32-bit adder, we use a <strong>two-level hierarchical design</strong>:
        </p>
        <ul>
          <li><strong>Level 1:</strong> Eight 4-bit CLA blocks (bits 0-3, 4-7, 8-11, ..., 28-31)</li>
          <li><strong>Level 2:</strong> A second CLA layer that computes the carry-in for each 4-bit block based on the group generate/propagate signals</li>
        </ul>
        <p>
          This hierarchical approach keeps the logic depth manageable while achieving fast parallel carry computation.
        </p>

        <h3>Verilog Implementation — 4-bit CLA Block</h3>
        <pre className="code-block">
          <span className="comment">// 4-bit CLA block - Generate and Propagate</span>{'\n'}
          <span className="keyword">wire</span> <span className="signal">[3:0] g</span>, <span className="signal">p</span>;<br/>
          <span className="keyword">assign</span> <span className="signal">g</span> <span className="operator">=</span> <span className="signal">A</span> <span className="operator">&</span> <span className="signal">B</span>;           <span className="comment">// Generate: both bits are 1</span><br/>
          <span className="keyword">assign</span> <span className="signal">p</span> <span className="operator">=</span> <span className="signal">A</span> <span className="operator">^</span> <span className="signal">B</span>;           <span className="comment">// Propagate: one bit is 1</span><br/>
          <br/>
          <span className="comment">// Carry lookahead equations</span><br/>
          <span className="keyword">assign</span> <span className="signal">c</span>[<span className="number">1</span>] <span className="operator">=</span> <span className="signal">g</span>[<span className="number">0</span>] <span className="operator">|</span> (<span className="signal">p</span>[<span className="number">0</span>] <span className="operator">&</span> <span className="signal">c</span>[<span className="number">0</span>]);<br/>
          <span className="keyword">assign</span> <span className="signal">c</span>[<span className="number">2</span>] <span className="operator">=</span> <span className="signal">g</span>[<span className="number">1</span>] <span className="operator">|</span> (<span className="signal">p</span>[<span className="number">1</span>] <span className="operator">&</span> <span className="signal">g</span>[<span className="number">0</span>]) <span className="operator">|</span> (<span className="signal">p</span>[<span className="number">1</span>] <span className="operator">&</span> <span className="signal">p</span>[<span className="number">0</span>] <span className="operator">&</span> <span className="signal">c</span>[<span className="number">0</span>]);<br/>
          <span className="keyword">assign</span> <span className="signal">c</span>[<span className="number">3</span>] <span className="operator">=</span> <span className="signal">g</span>[<span className="number">2</span>] <span className="operator">|</span> (<span className="signal">p</span>[<span className="number">2</span>] <span className="operator">&</span> <span className="signal">g</span>[<span className="number">1</span>]) <span className="operator">|</span> (<span className="signal">p</span>[<span className="number">2</span>] <span className="operator">&</span> <span className="signal">p</span>[<span className="number">1</span>] <span className="operator">&</span> <span className="signal">g</span>[<span className="number">0</span>])<br/>
          {'                      '}<span className="operator">|</span> (<span className="signal">p</span>[<span className="number">2</span>] <span className="operator">&</span> <span className="signal">p</span>[<span className="number">1</span>] <span className="operator">&</span> <span className="signal">p</span>[<span className="number">0</span>] <span className="operator">&</span> <span className="signal">c</span>[<span className="number">0</span>]);
        </pre>
      </DocsSection>

      <DocsSection id="alu-operations" title="ALU Operations">
        <p>
          The ALU supports six operations, each selected by a 5-bit opcode. The operation results are computed in parallel, and a multiplexer selects the correct result based on the opcode.
        </p>

        <table className="ops-table">
          <thead>
            <tr>
              <th>Opcode</th>
              <th>Operation</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr><td><code>00000</code></td><td><strong>ADD</strong></td><td>Addition using Carry-Lookahead Adder: <code>A + B</code></td></tr>
            <tr><td><code>00001</code></td><td><strong>SUB</strong></td><td>Subtraction via 2's complement: <code>A + ~B + 1</code></td></tr>
            <tr><td><code>00010</code></td><td><strong>AND</strong></td><td>Bitwise AND: <code>A & B</code></td></tr>
            <tr><td><code>00011</code></td><td><strong>OR</strong></td><td>Bitwise OR: <code>A | B</code></td></tr>
            <tr><td><code>00100</code></td><td><strong>SLL</strong></td><td>Shift Left Logical: <code>A &lt;&lt; shiftamt</code> (fills with 0s)</td></tr>
            <tr><td><code>00101</code></td><td><strong>SRA</strong></td><td>Shift Right Arithmetic: <code>A &gt;&gt;&gt; shiftamt</code> (sign-extends)</td></tr>
          </tbody>
        </table>

        <h3>Verilog Implementation — ALU Operation Select</h3>
        <pre className="code-block">
          <span className="comment">// ALU operation select</span><br/>
          <span className="keyword">wire</span> <span className="signal">[31:0] add_result</span>, <span className="signal">sub_result</span>, <span className="signal">and_result</span>, <span className="signal">or_result</span>, <span className="signal">sll_result</span>, <span className="signal">sra_result</span>;<br/>
          <br/>
          <span className="keyword">assign</span> <span className="signal">and_result</span> <span className="operator">=</span> <span className="signal">data_operandA</span> <span className="operator">&</span> <span className="signal">data_operandB</span>;<br/>
          <span className="keyword">assign</span> <span className="signal">or_result</span>  <span className="operator">=</span> <span className="signal">data_operandA</span> <span className="operator">|</span> <span className="signal">data_operandB</span>;<br/>
          <span className="keyword">assign</span> <span className="signal">sll_result</span> <span className="operator">=</span> <span className="signal">data_operandA</span> <span className="operator">&lt;&lt;</span> <span className="signal">ctrl_shiftamt</span>;<br/>
          <span className="keyword">assign</span> <span className="signal">sra_result</span> <span className="operator">=</span> <span className="operator">$signed</span>(<span className="signal">data_operandA</span>) <span className="operator">&gt;&gt;&gt;</span> <span className="signal">ctrl_shiftamt</span>;
        </pre>

        <p>
          <strong>Note on Subtraction:</strong> Subtraction is implemented using 2's complement addition: <code>A - B = A + (~B) + 1</code>. The operand B is inverted (bitwise NOT), and the carry-in to the adder is set to 1, effectively adding 1 to the inverted B.
        </p>
      </DocsSection>

      <DocsSection id="overflow-detection" title="Overflow Detection">
        <p>
          <strong>Overflow</strong> occurs when the result of a signed operation exceeds the range that can be represented with 32 bits. For signed integers, the valid range is -2,147,483,648 to 2,147,483,647 (using two's complement representation).
        </p>

        <h3>When Does Overflow Occur?</h3>
        <ul>
          <li><strong>Addition:</strong> Overflow occurs when adding two numbers with the same sign produces a result with the opposite sign.</li>
          <li><strong>Subtraction:</strong> Overflow occurs when subtracting a negative number from a positive number produces a negative result, or vice versa.</li>
        </ul>

        <h3>Overflow Detection Logic</h3>
        <p>
          For addition, overflow is detected by comparing the sign bits of the operands and the result:
        </p>
        <ul>
          <li>If both operands have the same sign (<code>A[31] == B[31]</code>), and</li>
          <li>The result has a different sign (<code>result[31] != A[31]</code>)</li>
          <li>Then overflow has occurred.</li>
        </ul>

        <h3>Verilog Implementation — Overflow Detection</h3>
        <pre className="code-block">
          <span className="comment">// Overflow detection for addition</span><br/>
          <span className="keyword">assign</span> <span className="signal">overflow</span> <span className="operator">=</span> (<span className="signal">data_operandA</span>[<span className="number">31</span>] <span className="operator">==</span> <span className="signal">data_operandB</span>[<span className="number">31</span>])<br/>
          {'                  '}<span className="operator">&</span> (<span className="signal">add_result</span>[<span className="number">31</span>] <span className="operator">!=</span> <span className="signal">data_operandA</span>[<span className="number">31</span>]);
        </pre>

        <p>
          <strong>Alternative Method:</strong> Overflow can also be detected by comparing the carry into the most significant bit (MSB) with the carry out of the MSB. If these two carries differ, overflow has occurred. This method works for both addition and subtraction.
        </p>
      </DocsSection>

      <DocsSection id="status-flags" title="Status Flags">
        <p>
          In addition to the 32-bit result, the ALU outputs three status flags that provide information about the result. These flags are used by conditional branch instructions to make control flow decisions.
        </p>

        <h3>isNotEqual Flag</h3>
        <p>
          The <code>isNotEqual</code> flag indicates whether the result is non-zero. It's computed by performing a bitwise OR reduction on all 32 bits of the result:
        </p>
        <pre className="code-block">
          <span className="keyword">assign</span> <span className="signal">isNotEqual</span> <span className="operator">=</span> <span className="operator">|</span><span className="signal">data_result</span>;  <span className="comment">// OR reduction: 1 if any bit is 1</span>
        </pre>
        <p>
          This flag is used by the <code>bne</code> (branch if not equal) instruction to determine if two values are different.
        </p>

        <h3>isLessThan Flag</h3>
        <p>
          The <code>isLessThan</code> flag indicates whether operand A is less than operand B in signed arithmetic. This is determined by examining the sign bit of the result (from A - B) while accounting for overflow:
        </p>
        <ul>
          <li>If no overflow: <code>A &lt; B</code> if <code>(A - B)[31] == 1</code> (negative result)</li>
          <li>If overflow: The sign bit is inverted due to wraparound</li>
        </ul>
        <pre className="code-block">
          <span className="comment">// Less-than comparison considering overflow</span><br/>
          <span className="keyword">assign</span> <span className="signal">isLessThan</span> <span className="operator">=</span> <span className="signal">overflow</span> <span className="operator">?</span> <span className="operator">~</span><span className="signal">sub_result</span>[<span className="number">31</span>] <span className="operator">:</span> <span className="signal">sub_result</span>[<span className="number">31</span>];
        </pre>
        <p>
          This flag is used by the <code>blt</code> (branch if less than) instruction for signed comparisons.
        </p>

        <h3>Overflow Flag</h3>
        <p>
          As described in the previous section, the <code>overflow</code> flag indicates whether a signed arithmetic overflow occurred during addition or subtraction. This flag is critical for detecting arithmetic errors in signed operations.
        </p>
      </DocsSection>
    </DocsLayout>
  )
}

export default CpuAluPage
