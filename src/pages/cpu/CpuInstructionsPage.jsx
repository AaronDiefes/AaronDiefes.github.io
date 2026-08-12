import React from 'react'
import DocsLayout from '../../components/docs/DocsLayout'
import DocsSection from '../../components/docs/DocsSection'

const TOC = [
  { id: 'overview', label: 'Overview', level: 2 },
  { id: 'instruction-formats', label: 'Instruction Formats', level: 2 },
  { id: 'implemented-instructions', label: 'Implemented Instructions', level: 2 },
  { id: 'instruction-encoding-examples', label: 'Instruction Encoding Examples', level: 2 },
  { id: 'assembly-examples', label: 'Assembly Examples', level: 2 }
]

function CpuInstructionsPage() {
  return (
    <DocsLayout
      project="cpu"
      currentSlug="instructions"
      title="Instruction Set"
      subtitle="Complete Instruction Reference"
      tocItems={TOC}
    >
      <style>{`
        .docs-layout .docs-content .bit-field {
            display: flex;
            border: 2px solid #2E7D32;
            border-radius: 8px;
            overflow: hidden;
            margin: 1.5rem 0;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 0.85rem;
        }
        .docs-layout .docs-content .bit-field .field {
            padding: 0.75rem;
            text-align: center;
            border-right: 1px solid #2E7D32;
            flex: 1;
        }
        .docs-layout .docs-content .bit-field .field:last-child {
            border-right: none;
        }
        .docs-layout .docs-content .bit-field .field-name {
            font-weight: 700;
            color: #2E7D32;
        }
        .docs-layout .docs-content .bit-field .field-bits {
            font-size: 0.75rem;
            color: #888;
            margin-top: 0.25rem;
        }

        .docs-layout .docs-content .ops-table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 0.9rem;
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
            border-bottom: 1px solid #ddd;
        }
        .docs-layout .docs-content .ops-table tr:hover {
            background: #f5f5f5;
        }
        .docs-layout .docs-content .ops-table code {
            background: rgba(46, 125, 50, 0.1);
            padding: 0.15rem 0.4rem;
            border-radius: 3px;
            color: #1B5E20;
        }

        .docs-layout .docs-content .encoding-example {
            background: #f9f9f9;
            border-left: 4px solid #2E7D32;
            padding: 1.5rem;
            border-radius: 0 8px 8px 0;
            margin: 1.5rem 0;
        }
        .docs-layout .docs-content .encoding-example code {
            font-family: 'Monaco', 'Courier New', monospace;
            background: rgba(0,0,0,0.05);
            padding: 0.15rem 0.4rem;
            border-radius: 3px;
        }

        @media (max-width: 768px) {
            .docs-layout .docs-content .bit-field {
                font-size: 0.7rem;
            }
            .docs-layout .docs-content .ops-table {
                font-size: 0.75rem;
            }
        }
      `}</style>

      <DocsSection id="overview" title="Overview">
        <p>
          The processor implements a 32-bit RISC instruction set architecture based on a MIPS-like ISA.
          All instructions are 32 bits wide (fixed-width encoding), which simplifies instruction fetch and decoding.
        </p>
        <ul>
          <li><strong>32-bit fixed-width instructions</strong> - Every instruction is exactly 32 bits</li>
          <li><strong>Three instruction formats:</strong> R-type (register), I-type (immediate), J-type (jump)</li>
          <li><strong>Opcode is always bits [31:27]</strong> - 5-bit opcode field identifies instruction type</li>
          <li><strong>32 general-purpose registers</strong> - $0 through $31 (with $0 hardwired to zero)</li>
        </ul>
      </DocsSection>

      <DocsSection id="instruction-formats" title="Instruction Formats">
        <p>
          The instruction set uses three encoding formats to efficiently represent different types of operations:
        </p>

        <h3>R-Type Format (Register Operations)</h3>
        <p>
          Used for register-to-register operations like arithmetic, logic, and shifts. Contains source and
          destination register addresses plus an ALU operation code.
        </p>

        <div className="bit-field">
          <div className="field">
            <div className="field-name">opcode</div>
            <div className="field-bits">[31:27]</div>
            <div className="field-bits">5 bits</div>
          </div>
          <div className="field">
            <div className="field-name">rd</div>
            <div className="field-bits">[26:22]</div>
            <div className="field-bits">5 bits</div>
          </div>
          <div className="field">
            <div className="field-name">rs</div>
            <div className="field-bits">[21:17]</div>
            <div className="field-bits">5 bits</div>
          </div>
          <div className="field">
            <div className="field-name">rt</div>
            <div className="field-bits">[16:12]</div>
            <div className="field-bits">5 bits</div>
          </div>
          <div className="field">
            <div className="field-name">shamt</div>
            <div className="field-bits">[11:7]</div>
            <div className="field-bits">5 bits</div>
          </div>
          <div className="field">
            <div className="field-name">ALUop</div>
            <div className="field-bits">[6:2]</div>
            <div className="field-bits">5 bits</div>
          </div>
          <div className="field">
            <div className="field-name">00</div>
            <div className="field-bits">[1:0]</div>
            <div className="field-bits">2 bits</div>
          </div>
        </div>

        <h3>I-Type Format (Immediate Operations)</h3>
        <p>
          Used for immediate operations (addi), memory operations (lw, sw), and branches. Contains a
          17-bit immediate value that can be used as data or an address offset.
        </p>

        <div className="bit-field">
          <div className="field" style={{flex: '1.2'}}>
            <div className="field-name">opcode</div>
            <div className="field-bits">[31:27]</div>
            <div className="field-bits">5 bits</div>
          </div>
          <div className="field" style={{flex: '1.2'}}>
            <div className="field-name">rd</div>
            <div className="field-bits">[26:22]</div>
            <div className="field-bits">5 bits</div>
          </div>
          <div className="field" style={{flex: '1.2'}}>
            <div className="field-name">rs</div>
            <div className="field-bits">[21:17]</div>
            <div className="field-bits">5 bits</div>
          </div>
          <div className="field" style={{flex: '4'}}>
            <div className="field-name">immediate</div>
            <div className="field-bits">[16:0]</div>
            <div className="field-bits">17 bits</div>
          </div>
        </div>

        <h3>J-Type Format (Jumps)</h3>
        <p>
          Used for unconditional jumps with large target addresses. The 27-bit target field provides
          a wide range for jump destinations.
        </p>

        <div className="bit-field">
          <div className="field" style={{flex: '1'}}>
            <div className="field-name">opcode</div>
            <div className="field-bits">[31:27]</div>
            <div className="field-bits">5 bits</div>
          </div>
          <div className="field" style={{flex: '5'}}>
            <div className="field-name">target</div>
            <div className="field-bits">[26:0]</div>
            <div className="field-bits">27 bits</div>
          </div>
        </div>
      </DocsSection>

      <DocsSection id="implemented-instructions" title="Implemented Instructions">
        <p>
          The processor implements a subset of instructions sufficient for demonstrating a complete
          5-stage pipeline with data hazards and forwarding. This includes arithmetic, logic, memory,
          branch, and jump operations.
        </p>

        <h3>R-Type Instructions (opcode 00000)</h3>
        <table className="ops-table">
          <thead>
            <tr>
              <th>Instruction</th>
              <th>ALUop</th>
              <th>Operation</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>add $rd, $rs, $rt</code></td>
              <td>00000</td>
              <td>rd = rs + rt</td>
              <td>Addition</td>
            </tr>
            <tr>
              <td><code>sub $rd, $rs, $rt</code></td>
              <td>00001</td>
              <td>rd = rs - rt</td>
              <td>Subtraction</td>
            </tr>
            <tr>
              <td><code>and $rd, $rs, $rt</code></td>
              <td>00010</td>
              <td>rd = rs &amp; rt</td>
              <td>Bitwise AND</td>
            </tr>
            <tr>
              <td><code>or $rd, $rs, $rt</code></td>
              <td>00011</td>
              <td>rd = rs | rt</td>
              <td>Bitwise OR</td>
            </tr>
            <tr>
              <td><code>sll $rd, $rs, shamt</code></td>
              <td>00100</td>
              <td>rd = rs &lt;&lt; shamt</td>
              <td>Shift left logical</td>
            </tr>
            <tr>
              <td><code>sra $rd, $rs, shamt</code></td>
              <td>00101</td>
              <td>rd = rs &gt;&gt;&gt; shamt</td>
              <td>Shift right arithmetic</td>
            </tr>
          </tbody>
        </table>

        <h3>I-Type Instructions</h3>
        <table className="ops-table">
          <thead>
            <tr>
              <th>Instruction</th>
              <th>Opcode</th>
              <th>Operation</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>addi $rd, $rs, imm</code></td>
              <td>00101</td>
              <td>rd = rs + imm</td>
              <td>Add immediate</td>
            </tr>
            <tr>
              <td><code>lw $rd, imm($rs)</code></td>
              <td>01000</td>
              <td>rd = Mem[rs + imm]</td>
              <td>Load word from memory</td>
            </tr>
            <tr>
              <td><code>sw $rd, imm($rs)</code></td>
              <td>00111</td>
              <td>Mem[rs + imm] = rd</td>
              <td>Store word to memory</td>
            </tr>
            <tr>
              <td><code>beq $rd, $rs, imm</code></td>
              <td>00010</td>
              <td>if (rd == rs) PC += imm</td>
              <td>Branch if equal</td>
            </tr>
            <tr>
              <td><code>bne $rd, $rs, imm</code></td>
              <td>00110</td>
              <td>if (rd != rs) PC += imm</td>
              <td>Branch if not equal</td>
            </tr>
            <tr>
              <td><code>blt $rd, $rs, imm</code></td>
              <td>10110</td>
              <td>if (rd &lt; rs) PC += imm</td>
              <td>Branch if less than</td>
            </tr>
          </tbody>
        </table>

        <h3>J-Type Instructions</h3>
        <table className="ops-table">
          <thead>
            <tr>
              <th>Instruction</th>
              <th>Opcode</th>
              <th>Operation</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>j target</code></td>
              <td>00001</td>
              <td>PC = target</td>
              <td>Unconditional jump</td>
            </tr>
            <tr>
              <td><code>jal target</code></td>
              <td>00011</td>
              <td>$31 = PC+1; PC = target</td>
              <td>Jump and link (for function calls)</td>
            </tr>
            <tr>
              <td><code>jr $rd</code></td>
              <td>00100</td>
              <td>PC = rd</td>
              <td>Jump register (for function returns)</td>
            </tr>
          </tbody>
        </table>

        <h3>Special Instructions</h3>
        <table className="ops-table">
          <thead>
            <tr>
              <th>Instruction</th>
              <th>Opcode</th>
              <th>Operation</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>mul $rd, $rs, $rt</code></td>
              <td>00110*</td>
              <td>rd = rs * rt</td>
              <td>Multiply (uses MultDiv unit)</td>
            </tr>
            <tr>
              <td><code>div $rd, $rs, $rt</code></td>
              <td>00111*</td>
              <td>rd = rs / rt</td>
              <td>Divide (uses MultDiv unit)</td>
            </tr>
            <tr>
              <td><code>setx target</code></td>
              <td>10101</td>
              <td>$30 = target</td>
              <td>Set exception register</td>
            </tr>
            <tr>
              <td><code>bex target</code></td>
              <td>10110</td>
              <td>if ($30 != 0) PC = target</td>
              <td>Branch on exception</td>
            </tr>
          </tbody>
        </table>
        <p style={{fontSize: '0.9rem', color: '#666', marginTop: '0.5rem'}}>
          * Note: Exact opcodes are representative of the implemented ISA. The table provides an educational reference.
        </p>
      </DocsSection>

      <DocsSection id="instruction-encoding-examples" title="Instruction Encoding Examples">
        <p>
          Understanding how assembly instructions are encoded into binary helps visualize the instruction
          format and the role of each field.
        </p>

        <div className="encoding-example">
          <h3>Example 1: <code>add $3, $1, $2</code></h3>
          <p>Add the values in registers $1 and $2, storing the result in $3.</p>
          <div className="code-block">
            <span className="comment">// Field breakdown:</span><br/>
            opcode = <span className="number">00000</span> <span className="comment">(R-type)</span><br/>
            rd     = <span className="number">00011</span> <span className="comment">($3)</span><br/>
            rs     = <span className="number">00001</span> <span className="comment">($1)</span><br/>
            rt     = <span className="number">00010</span> <span className="comment">($2)</span><br/>
            shamt  = <span className="number">00000</span> <span className="comment">(unused)</span><br/>
            ALUop  = <span className="number">00000</span> <span className="comment">(add operation)</span><br/>
            filler = <span className="number">00</span><br/>
            <br/>
            <span className="comment">// Binary encoding:</span><br/>
            <span className="number">00000</span> <span className="number">00011</span> <span className="number">00001</span> <span className="number">00010</span> <span className="number">00000</span> <span className="number">00000</span> <span className="number">00</span><br/>
            <br/>
            <span className="comment">// Hexadecimal:</span><br/>
            <span className="keyword">0x00C10800</span>
          </div>
        </div>

        <div className="encoding-example">
          <h3>Example 2: <code>lw $5, 4($2)</code></h3>
          <p>Load a word from memory address ($2 + 4) into register $5.</p>
          <div className="code-block">
            <span className="comment">// Field breakdown:</span><br/>
            opcode    = <span className="number">01000</span> <span className="comment">(lw instruction)</span><br/>
            rd        = <span className="number">00101</span> <span className="comment">($5)</span><br/>
            rs        = <span className="number">00010</span> <span className="comment">($2 - base address)</span><br/>
            immediate = <span className="number">00000000000000100</span> <span className="comment">(4 in 17-bit)</span><br/>
            <br/>
            <span className="comment">// Binary encoding:</span><br/>
            <span className="number">01000</span> <span className="number">00101</span> <span className="number">00010</span> <span className="number">00000000000000100</span><br/>
            <br/>
            <span className="comment">// Hexadecimal:</span><br/>
            <span className="keyword">0x40A40004</span>
          </div>
        </div>

        <div className="encoding-example">
          <h3>Example 3: <code>beq $1, $2, 8</code></h3>
          <p>Branch to PC + 8 if registers $1 and $2 are equal.</p>
          <div className="code-block">
            <span className="comment">// Field breakdown:</span><br/>
            opcode    = <span className="number">00010</span> <span className="comment">(beq instruction)</span><br/>
            rd        = <span className="number">00001</span> <span className="comment">($1)</span><br/>
            rs        = <span className="number">00010</span> <span className="comment">($2)</span><br/>
            immediate = <span className="number">00000000000001000</span> <span className="comment">(8 in 17-bit)</span><br/>
            <br/>
            <span className="comment">// Binary encoding:</span><br/>
            <span className="number">00010</span> <span className="number">00001</span> <span className="number">00010</span> <span className="number">00000000000001000</span><br/>
            <br/>
            <span className="comment">// Hexadecimal:</span><br/>
            <span className="keyword">0x10220008</span>
          </div>
        </div>
      </DocsSection>

      <DocsSection id="assembly-examples" title="Assembly Examples">
        <p>
          Here are common programming patterns using the instruction set:
        </p>

        <h3>Simple Arithmetic</h3>
        <div className="code-block">
          <span className="comment">// Calculate: $3 = ($1 + $2) - 5</span><br/>
          add  $3, $1, $2      <span className="comment">// $3 = $1 + $2</span><br/>
          addi $3, $3, <span className="number">-5</span>     <span className="comment">// $3 = $3 - 5</span>
        </div>

        <h3>Memory Access Pattern</h3>
        <div className="code-block">
          <span className="comment">// Load array[5] into $5, increment it, store back</span><br/>
          addi $1, $0, <span className="number">100</span>     <span className="comment">// $1 = base address of array</span><br/>
          lw   $5, <span className="number">5</span>($1)        <span className="comment">// $5 = array[5]</span><br/>
          addi $5, $5, <span className="number">1</span>        <span className="comment">// $5 = $5 + 1</span><br/>
          sw   $5, <span className="number">5</span>($1)        <span className="comment">// array[5] = $5</span>
        </div>

        <h3>Loop Example</h3>
        <div className="code-block">
          <span className="comment">// Sum numbers 1 to 10</span><br/>
          addi $1, $0, <span className="number">0</span>        <span className="comment">// $1 = sum = 0</span><br/>
          addi $2, $0, <span className="number">1</span>        <span className="comment">// $2 = counter = 1</span><br/>
          addi $3, $0, <span className="number">11</span>       <span className="comment">// $3 = limit = 11</span><br/>
          <br/>
          <span className="keyword">loop:</span><br/>
          add  $1, $1, $2       <span className="comment">// sum += counter</span><br/>
          addi $2, $2, <span className="number">1</span>        <span className="comment">// counter++</span><br/>
          bne  $2, $3, <span className="keyword">loop</span>    <span className="comment">// if counter != 11, repeat</span><br/>
          <br/>
          <span className="comment">// Result in $1 = 55</span>
        </div>

        <h3>Function Call Pattern</h3>
        <div className="code-block">
          <span className="comment">// Calling convention: arguments in $1-$3, return in $1</span><br/>
          addi $1, $0, <span className="number">5</span>        <span className="comment">// First argument</span><br/>
          addi $2, $0, <span className="number">3</span>        <span className="comment">// Second argument</span><br/>
          jal  <span className="keyword">multiply</span>       <span className="comment">// Call multiply, save return address in $31</span><br/>
          <span className="comment">// Result now in $1</span><br/>
          <br/>
          <span className="keyword">multiply:</span><br/>
          mul  $1, $1, $2       <span className="comment">// $1 = $1 * $2</span><br/>
          jr   $31              <span className="comment">// Return to caller</span>
        </div>
      </DocsSection>
    </DocsLayout>
  )
}

export default CpuInstructionsPage
