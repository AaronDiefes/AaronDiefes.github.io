import React from 'react'
import { Link } from 'react-router-dom'
import Breadcrumbs from '../../components/shared/Breadcrumbs'

function CpuMultdivPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'CPU Simulator', href: '/projects/cpu' },
    { label: 'Documentation', href: '/projects/cpu/docs' },
    { label: 'Multiplication & Division' }
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

        .ops-table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
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
            border-bottom: 1px solid #eee;
        }

        .ops-table tr:hover {
            background: #f5f5f5;
        }

        .ops-table code {
            background: #f5f5f5;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-family: 'Monaco', 'Courier New', monospace;
            font-size: 0.9rem;
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
        <h1>Multiplication & Division</h1>
        <p>Checkpoint 3 - Multi-Cycle Arithmetic</p>
      </header>

      <div className="container">
        {/* Overview */}
        <section className="section">
          <h2>Overview</h2>
          <p>
            Multiplication and division are among the most complex operations in a processor. Unlike addition and subtraction, which can be completed in a single clock cycle using the ALU, these arithmetic operations require multiple cycles to produce a result.
          </p>
          <p>
            <strong>Why MultDiv is Complex:</strong>
          </p>
          <ul>
            <li><strong>Multi-Cycle Operations:</strong> A 32-bit multiplication takes 16 cycles using modified Booth's algorithm; division takes 32 cycles using restoring division</li>
            <li><strong>Independent Unit:</strong> The MultDiv unit operates separately from the main pipeline, allowing other instructions to potentially continue while multiplication or division completes</li>
            <li><strong>Ready Signal:</strong> Uses a <code>data_resultRDY</code> signal to indicate when the result is available for the processor to read</li>
            <li><strong>Pipeline Stalls:</strong> The processor must stall (wait) while the MultDiv unit is busy, preventing other instructions from using the result until it's ready</li>
          </ul>
          <p>
            This checkpoint implements the MultDiv unit as a standalone module with its own state machine, interfacing with the processor through control signals and ready flags.
          </p>
        </section>

        {/* Modified Booth's Algorithm */}
        <section className="section">
          <h2>Modified Booth's Algorithm</h2>
          <p>
            Multiplication in hardware traditionally uses a shift-and-add approach: examine each bit of the multiplier, and if it's 1, add the multiplicand (shifted appropriately) to the accumulator. For a 32-bit multiply, this would take 32 cycles.
          </p>
          <p>
            <strong>Booth's encoding</strong> is an optimization that examines pairs of multiplier bits to reduce the number of partial products. <strong>Modified Booth's algorithm (radix-4)</strong> goes further by examining 3 bits at a time and processing 2 bits per cycle, cutting the multiplication time in half to just 16 cycles.
          </p>

          <h3>How Booth Encoding Works</h3>
          <p>
            Instead of examining each bit individually, modified Booth's algorithm looks at overlapping 3-bit windows of the multiplier. Based on the pattern, it decides whether to add 0, +M, -M, +2M, or -2M to the partial product (where M is the multiplicand).
          </p>

          <table className="ops-table">
            <thead>
              <tr>
                <th>Bits [i+1:i-1]</th>
                <th>Operation</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>000</code></td>
                <td>+0</td>
                <td>No operation (middle of 0s)</td>
              </tr>
              <tr>
                <td><code>001</code></td>
                <td>+M</td>
                <td>Add multiplicand</td>
              </tr>
              <tr>
                <td><code>010</code></td>
                <td>+M</td>
                <td>Add multiplicand</td>
              </tr>
              <tr>
                <td><code>011</code></td>
                <td>+2M</td>
                <td>Shift multiplicand left 1, then add</td>
              </tr>
              <tr>
                <td><code>100</code></td>
                <td>-2M</td>
                <td>Shift multiplicand left 1, then subtract</td>
              </tr>
              <tr>
                <td><code>101</code></td>
                <td>-M</td>
                <td>Subtract multiplicand</td>
              </tr>
              <tr>
                <td><code>110</code></td>
                <td>-M</td>
                <td>Subtract multiplicand</td>
              </tr>
              <tr>
                <td><code>111</code></td>
                <td>+0</td>
                <td>No operation (middle of 1s)</td>
              </tr>
            </tbody>
          </table>

          <p>
            This encoding reduces the number of additions/subtractions needed, and by processing 2 bits per cycle, we only need 16 cycles instead of 32.
          </p>

          <h3>Verilog Implementation</h3>
          <p>
            Here's how the Booth encoding is implemented in Verilog. The encoder examines 3 bits of the multiplier and selects the appropriate partial product:
          </p>

          <div className="code-block">
            <span className="comment">// Modified Booth encoding - examine 3 bits of multiplier</span><br />
            <span className="keyword">wire</span> [<span className="number">2</span>:<span className="number">0</span>] <span className="signal">booth_bits</span>;<br />
            <span className="keyword">assign</span> <span className="signal">booth_bits</span> = &#123;<span className="signal">multiplier</span>[<span className="signal">i</span>+<span className="number">1</span>], <span className="signal">multiplier</span>[<span className="signal">i</span>], <span className="signal">multiplier</span>[<span className="signal">i</span>-<span className="number">1</span>]&#125;;<br />
            <br />
            <span className="comment">// Partial product selection based on Booth encoding</span><br />
            <span className="keyword">always</span> @(*) <span className="keyword">begin</span><br />
            &nbsp;&nbsp;<span className="keyword">case</span>(<span className="signal">booth_bits</span>)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="number">3'b000</span>, <span className="number">3'b111</span>: <span className="signal">partial_product</span> = <span className="number">64'b0</span>;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// +0</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="number">3'b001</span>, <span className="number">3'b010</span>: <span className="signal">partial_product</span> = <span className="signal">multiplicand</span>;&nbsp;&nbsp;<span className="comment">// +M</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="number">3'b011</span>:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">partial_product</span> = <span className="signal">multiplicand</span> &lt;&lt; <span className="number">1</span>; <span className="comment">// +2M</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="number">3'b100</span>:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">partial_product</span> = ~(<span className="signal">multiplicand</span> &lt;&lt; <span className="number">1</span>) + <span className="number">1</span>; <span className="comment">// -2M</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="number">3'b101</span>, <span className="number">3'b110</span>: <span className="signal">partial_product</span> = ~<span className="signal">multiplicand</span> + <span className="number">1</span>; <span className="comment">// -M</span><br />
            &nbsp;&nbsp;<span className="keyword">endcase</span><br />
            <span className="keyword">end</span>
          </div>

          <p>
            The <code>~multiplicand + 1</code> pattern is two's complement negation in Verilog. Each cycle, the algorithm shifts the multiplier right by 2 bits, selects the appropriate partial product using Booth encoding, and accumulates it into the result register.
          </p>
        </section>

        {/* Multiplication State Machine */}
        <section className="section">
          <h2>Multiplication State Machine</h2>
          <p>
            Because multiplication is a multi-cycle operation, the MultDiv unit uses a state machine to track its progress. The state machine coordinates the 16 iterations needed to complete a 32-bit multiplication using modified Booth's algorithm.
          </p>

          <h3>State Machine States</h3>
          <ul>
            <li><strong>IDLE:</strong> Waiting for a multiply or divide command from the processor</li>
            <li><strong>MULTIPLY:</strong> Running Booth's algorithm - shifts multiplier by 2 bits per cycle, accumulates partial products for 16 cycles</li>
            <li><strong>DIVIDE:</strong> Running restoring division algorithm - 32 cycles of shift-and-subtract</li>
            <li><strong>DONE:</strong> Result ready - asserts <code>data_resultRDY</code> signal to indicate the processor can read the result</li>
          </ul>

          <h3>State Machine Implementation</h3>
          <p>
            The state machine uses a counter to track how many cycles remain. For multiplication with modified Booth's (radix-4), the counter starts at 16 and decrements each cycle:
          </p>

          <div className="code-block">
            <span className="comment">// MultDiv state machine</span><br />
            <span className="keyword">reg</span> [<span className="number">4</span>:<span className="number">0</span>] <span className="signal">counter</span>;<br />
            <span className="keyword">reg</span> [<span className="number">1</span>:<span className="number">0</span>] <span className="signal">state</span>; <span className="comment">// 0=IDLE, 1=MULTIPLY, 2=DIVIDE, 3=DONE</span><br />
            <br />
            <span className="keyword">always</span> @(<span className="keyword">posedge</span> <span className="signal">clock</span> <span className="keyword">or</span> <span className="keyword">posedge</span> <span className="signal">reset</span>) <span className="keyword">begin</span><br />
            &nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">reset</span>) <span className="keyword">begin</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">state</span> &lt;= <span className="number">2'b00</span>;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">counter</span> &lt;= <span className="number">5'b0</span>;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">data_resultRDY</span> &lt;= <span className="number">1'b0</span>;<br />
            &nbsp;&nbsp;<span className="keyword">end</span> <span className="keyword">else</span> <span className="keyword">begin</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">case</span>(<span className="signal">state</span>)<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="number">2'b00</span>: <span className="keyword">begin</span> <span className="comment">// IDLE</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">ctrl_MULT</span>) <span className="keyword">begin</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">state</span> &lt;= <span className="number">2'b01</span>;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">counter</span> &lt;= <span className="number">5'd16</span>;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Initialize accumulator and multiplier</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">end</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">end</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="number">2'b01</span>: <span className="keyword">begin</span> <span className="comment">// MULTIPLY</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">if</span> (<span className="signal">counter</span> == <span className="number">0</span>) <span className="keyword">begin</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">state</span> &lt;= <span className="number">2'b11</span>; <span className="comment">// DONE</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">data_resultRDY</span> &lt;= <span className="number">1'b1</span>;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">end</span> <span className="keyword">else</span> <span className="keyword">begin</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="signal">counter</span> &lt;= <span className="signal">counter</span> - <span className="number">1</span>;<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="comment">// Apply Booth's encoding, accumulate partial product</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">end</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">end</span><br />
            &nbsp;&nbsp;&nbsp;&nbsp;<span className="keyword">endcase</span><br />
            &nbsp;&nbsp;<span className="keyword">end</span><br />
            <span className="keyword">end</span>
          </div>

          <p>
            The accumulator register holds the running sum of partial products. Each cycle, the multiplier shifts right by 2 bits, the Booth encoder selects the partial product to add or subtract, and the accumulator is updated. After 16 iterations, the lower 32 bits of the accumulator contain the final product.
          </p>
        </section>

        {/* Division Algorithm */}
        <section className="section">
          <h2>Division Algorithm</h2>
          <p>
            Division uses a different approach called <strong>restoring division</strong>, which is conceptually similar to long division by hand. The algorithm performs a shift-and-subtract operation for each bit of the quotient, taking 32 cycles to complete a 32-bit division.
          </p>

          <h3>Restoring Division Process</h3>
          <p>
            The algorithm maintains a remainder register and a quotient register. Each cycle:
          </p>
          <ol style={{ lineHeight: '1.8', color: '#555', paddingLeft: '2rem' }}>
            <li>Shift the remainder left by 1 bit, bringing in the next bit of the dividend</li>
            <li>Subtract the divisor from the remainder (trial subtraction)</li>
            <li>Check if the result is negative:
              <ul style={{ marginTop: '0.5rem' }}>
                <li>If negative: restore the remainder (add divisor back), set quotient bit to 0</li>
                <li>If positive: keep the new remainder, set quotient bit to 1</li>
              </ul>
            </li>
          </ol>
          <p>
            This process repeats 32 times, producing one bit of the quotient per cycle. At the end, the quotient register contains the division result, and the remainder register contains the modulo result.
          </p>

          <h3>Verilog Implementation</h3>
          <p>
            Here's the core logic for one iteration of restoring division:
          </p>

          <div className="code-block">
            <span className="comment">// Restoring division - one iteration</span><br />
            <span className="comment">// Shift remainder left, bring in next dividend bit</span><br />
            <span className="keyword">wire</span> [<span className="number">31</span>:<span className="number">0</span>] <span className="signal">shifted_remainder</span> = &#123;<span className="signal">remainder</span>[<span className="number">30</span>:<span className="number">0</span>], <span className="signal">dividend</span>[<span className="number">31</span>-<span className="signal">i</span>]&#125;;<br />
            <span className="keyword">wire</span> [<span className="number">31</span>:<span className="number">0</span>] <span className="signal">trial</span> = <span className="signal">shifted_remainder</span> - <span className="signal">divisor</span>;<br />
            <br />
            <span className="comment">// If trial &gt;= 0 (MSB=0), keep subtraction; otherwise restore</span><br />
            <span className="keyword">assign</span> <span className="signal">remainder_next</span> = <span className="signal">trial</span>[<span className="number">31</span>] ? <span className="signal">shifted_remainder</span> : <span className="signal">trial</span>;<br />
            <span className="keyword">assign</span> <span className="signal">quotient</span>[<span className="number">31</span>-<span className="signal">i</span>] = ~<span className="signal">trial</span>[<span className="number">31</span>];<br />
          </div>

          <p>
            The sign bit (MSB) of the trial subtraction determines whether to restore. If <code>trial[31]</code> is 1 (negative), we restore by keeping the original shifted remainder and setting the quotient bit to 0. If it's 0 (positive), we keep the trial result and set the quotient bit to 1.
          </p>

          <h3>Signed Division</h3>
          <p>
            For signed division, the algorithm first converts both operands to positive values (keeping track of the original signs), performs unsigned division, then corrects the signs of the quotient and remainder based on the original operands:
          </p>
          <ul>
            <li><strong>Quotient sign:</strong> Negative if dividend and divisor have opposite signs</li>
            <li><strong>Remainder sign:</strong> Always matches the sign of the dividend</li>
          </ul>
        </section>

        {/* Exception Handling */}
        <section className="section">
          <h2>Exception Handling</h2>
          <p>
            The MultDiv unit must detect and handle exceptional conditions that could produce incorrect or undefined results.
          </p>

          <h3>Division by Zero</h3>
          <p>
            Division by zero is undefined and must be caught before starting the division algorithm. When <code>ctrl_DIV</code> is asserted and the divisor is zero, the MultDiv unit:
          </p>
          <ul>
            <li>Does not enter the DIVIDE state</li>
            <li>Immediately asserts the <code>data_exception</code> signal</li>
            <li>Returns to IDLE without producing a result</li>
          </ul>
          <p>
            The processor's control unit sees the exception signal and can handle it appropriately (e.g., trigger an exception handler, set an error flag, or halt execution).
          </p>

          <h3>Multiplication Overflow</h3>
          <p>
            A 32-bit × 32-bit multiplication produces a 64-bit result. If the upper 32 bits are non-zero, the result has overflowed the 32-bit result register. While the MultDiv unit can't directly prevent this, it can:
          </p>
          <ul>
            <li>Provide the upper 32 bits of the product for overflow detection</li>
            <li>Assert <code>data_exception</code> if the upper 32 bits are non-zero (depending on the instruction set specification)</li>
            <li>Allow the processor to read both the lower 32 bits (standard result) and upper 32 bits (for extended precision or overflow checking)</li>
          </ul>
          <p>
            Some processor architectures (like MIPS) have separate instructions to read the upper and lower halves of the multiplication result (<code>mfhi</code> and <code>mflo</code>).
          </p>
        </section>

        {/* Integration with Pipeline */}
        <section className="section">
          <h2>Integration with Pipeline</h2>
          <p>
            The MultDiv unit interfaces with the main processor pipeline through several signals:
          </p>

          <h3>Control Signals (Inputs)</h3>
          <ul>
            <li><code>ctrl_MULT</code> - Start multiplication operation</li>
            <li><code>ctrl_DIV</code> - Start division operation</li>
            <li><code>data_operandA</code> - First operand (multiplicand or dividend)</li>
            <li><code>data_operandB</code> - Second operand (multiplier or divisor)</li>
          </ul>

          <h3>Status Signals (Outputs)</h3>
          <ul>
            <li><code>data_resultRDY</code> - Result is ready (operation complete)</li>
            <li><code>data_exception</code> - Exception occurred (e.g., division by zero)</li>
            <li><code>data_result</code> - The result of multiplication (lower 32 bits) or division (quotient)</li>
          </ul>

          <h3>Pipeline Stalling</h3>
          <p>
            When a multiply or divide instruction enters the Execute stage, the processor checks <code>data_resultRDY</code>. If the MultDiv unit is still busy (RDY = 0):
          </p>
          <ul>
            <li>The pipeline stalls - no new instructions enter the Execute stage</li>
            <li>The current instruction waits in the Execute stage</li>
            <li>Once <code>data_resultRDY</code> becomes 1, the pipeline resumes</li>
            <li>The result is forwarded to the next pipeline stage (MEM or WB)</li>
          </ul>

          <h3>ALU Integration</h3>
          <p>
            The MultDiv unit often reuses the ALU's adder for the shift-and-add operations. This saves hardware resources since the ALU already has a high-performance 32-bit adder with carry-lookahead logic. The partial product addition in Booth's algorithm and the subtraction in restoring division both use this shared adder.
          </p>
        </section>

        {/* Explore Further */}
        <section className="section">
          <h2>Explore Further</h2>
          <div className="quick-links">
            <Link to="/projects/cpu/docs/regfile" className="quick-link">← Register File</Link>
            <Link to="/projects/cpu/docs/pipeline" className="quick-link">Pipeline Architecture →</Link>
            <Link to="/projects/cpu/docs" className="quick-link">Back to CPU Docs</Link>
            <a href="https://github.com/AaronDiefes/CPU" target="_blank" rel="noopener noreferrer" className="quick-link">View on GitHub</a>
          </div>
        </section>
      </div>

      <footer style={{ background: '#2c3e50', color: '#ecf0f1', padding: '3rem 2rem 2rem', marginTop: '4rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '2rem' }}>
            {/* About Section */}
            <div>
              <h3 style={{ color: '#2E7D32', marginBottom: '1rem', fontSize: '1.2rem' }}>Aaron Diefes</h3>
              <p style={{ color: '#bdc3c7', lineHeight: 1.8, marginBottom: '1rem' }}>Computer Engineering student at Duke University, passionate about processor design and digital systems.</p>
              <p style={{ color: '#bdc3c7', lineHeight: 1.8 }}>Building a complete 32-bit RISC processor from scratch in Verilog HDL.</p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 style={{ color: '#2E7D32', marginBottom: '1rem', fontSize: '1.2rem' }}>Navigation</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '0.75rem' }}><Link to="/" style={{ color: '#ecf0f1', textDecoration: 'none' }}>← Portfolio Home</Link></li>
                <li style={{ marginBottom: '0.75rem' }}><Link to="/projects/cpu" style={{ color: '#ecf0f1', textDecoration: 'none' }}>Interactive Simulator</Link></li>
                <li style={{ marginBottom: '0.75rem' }}><Link to="/projects/cpu/docs" style={{ color: '#ecf0f1', textDecoration: 'none' }}>CPU Documentation</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 style={{ color: '#2E7D32', marginBottom: '1rem', fontSize: '1.2rem' }}>Resources</h3>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ marginBottom: '0.75rem' }}><a href="https://github.com/AaronDiefes" target="_blank" rel="noopener noreferrer" style={{ color: '#ecf0f1', textDecoration: 'none' }}>GitHub Profile</a></li>
                <li style={{ marginBottom: '0.75rem' }}><a href="https://github.com/AaronDiefes/CPU" target="_blank" rel="noopener noreferrer" style={{ color: '#ecf0f1', textDecoration: 'none' }}>CPU Verilog Source</a></li>
              </ul>
            </div>

            {/* Tech Stack */}
            <div>
              <h3 style={{ color: '#2E7D32', marginBottom: '1rem', fontSize: '1.2rem' }}>Built With</h3>
              <ul style={{ listStyle: 'none', padding: 0, color: '#bdc3c7' }}>
                <li style={{ marginBottom: '0.75rem' }}>• Verilog HDL</li>
                <li style={{ marginBottom: '0.75rem' }}>• ModelSim Simulation</li>
                <li style={{ marginBottom: '0.75rem' }}>• Quartus Synthesis</li>
                <li style={{ marginBottom: '0.75rem' }}>• JavaScript Visualization</li>
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

export default CpuMultdivPage
