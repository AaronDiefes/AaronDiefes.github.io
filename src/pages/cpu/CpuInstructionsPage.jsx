import React from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../../components/shared/Breadcrumbs'

function CpuInstructionsPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'CPU Simulator', href: '/projects/cpu/demo' },
    { label: 'Documentation', href: '/projects/cpu/docs' },
    { label: 'Instruction Set' }
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

        .bit-field {
            display: flex;
            border: 2px solid #2E7D32;
            border-radius: 8px;
            overflow: hidden;
            margin: 1.5rem 0;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 0.85rem;
        }

        .bit-field .field {
            padding: 0.75rem;
            text-align: center;
            border-right: 1px solid #2E7D32;
            flex: 1;
        }

        .bit-field .field:last-child {
            border-right: none;
        }

        .bit-field .field-name {
            font-weight: 700;
            color: #2E7D32;
        }

        .bit-field .field-bits {
            font-size: 0.75rem;
            color: #888;
            margin-top: 0.25rem;
        }

        .ops-table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 0.9rem;
        }

        .ops-table th {
            background: #2E7D32;
            color: white;
            padding: 0.75rem;
            text-align: left;
            font-weight: 600;
        }

        .ops-table td {
            padding: 0.75rem;
            border-bottom: 1px solid #ddd;
        }

        .ops-table tr:hover {
            background: #f5f5f5;
        }

        .ops-table code {
            background: rgba(46, 125, 50, 0.1);
            padding: 0.15rem 0.4rem;
            border-radius: 3px;
            color: #1B5E20;
        }

        .encoding-example {
            background: #f9f9f9;
            border-left: 4px solid #2E7D32;
            padding: 1.5rem;
            border-radius: 0 8px 8px 0;
            margin: 1.5rem 0;
        }

        .encoding-example code {
            font-family: 'Monaco', 'Courier New', monospace;
            background: rgba(0,0,0,0.05);
            padding: 0.15rem 0.4rem;
            border-radius: 3px;
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

            .bit-field {
                font-size: 0.7rem;
            }

            .ops-table {
                font-size: 0.75rem;
            }
        }
      `}</style>

      <Breadcrumbs items={breadcrumbItems} />

      <header className="landing-header">
        <h1>Instruction Set</h1>
        <p>Complete Instruction Reference</p>
      </header>

      <div className="container">
        {/* Overview */}
        <section className="section">
          <h2>Overview</h2>
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
        </section>

        {/* Instruction Formats */}
        <section className="section">
          <h2>Instruction Formats</h2>
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
        </section>

        {/* Implemented Instructions */}
        <section className="section">
          <h2>Implemented Instructions</h2>
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
        </section>

        {/* Instruction Encoding Examples */}
        <section className="section">
          <h2>Instruction Encoding Examples</h2>
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
        </section>

        {/* Assembly Examples */}
        <section className="section">
          <h2>Assembly Examples</h2>
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
        </section>

        {/* Explore Further */}
        <section className="section">
          <h2>Explore Further</h2>
          <div className="quick-links">
            <Link to="/projects/cpu/docs/hazards" className="quick-link">← Previous: Hazards & Forwarding</Link>
            <Link to="/projects/cpu/docs/memory" className="quick-link">Next: Memory System →</Link>
            <Link to="/projects/cpu/docs" className="quick-link">Back to CPU Docs</Link>
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

export default CpuInstructionsPage
