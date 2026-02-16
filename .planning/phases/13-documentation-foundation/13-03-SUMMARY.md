---
phase: 13-documentation-foundation
plan: 03
subsystem: cpu-documentation
tags:
  - register-file
  - checkpoint-2
  - verilog
  - documentation
  - cpu-docs

dependency-graph:
  requires:
    - 13-01 (CPU docs landing page)
  provides:
    - /cpu-docs/regfile route
    - CpuRegfilePage.jsx component
    - Register File documentation (CP2)
  affects:
    - App.jsx (route registration)

tech-stack:
  added:
    - Register File documentation page
  patterns:
    - Inline CSS matching DocsPage.jsx pattern
    - Breadcrumbs navigation pattern
    - Verilog code blocks with syntax highlighting
    - Port diagram ASCII art visualization
    - Register convention table

key-files:
  created:
    - src/pages/cpu/CpuRegfilePage.jsx
  modified:
    - src/App.jsx

decisions:
  - "Follow DocsPage.jsx pattern for consistent styling across CPU docs"
  - "Include 3 Verilog code snippets ($0 hardwiring, read mux, write decoder)"
  - "Use .port-diagram class for ASCII-art port specification"
  - "Add MIPS register convention table with caller/callee-saved distinctions"
  - "Link to previous (ALU), next (MultDiv), CPU docs, and GitHub repo"
  - "Explain combinational reads vs synchronous writes"
  - "Focus on dual-port read and single-port write architecture"

metrics:
  duration: "2m 37s"
  tasks-completed: 2
  files-created: 1
  files-modified: 1
  commits: 2
  completed-date: "2026-02-16"
---

# Phase 13 Plan 03: Register File Documentation

**One-liner:** Created comprehensive Register File documentation page (CP2) explaining the 32-register design with dual-port read, single-port write, and $0 hardwired to zero.

## Summary

Successfully created the Register File documentation page for Checkpoint 2, covering the 32x32-bit register array architecture. The page explains the dual-port read/single-port write design, the $0-hardwired-to-zero convention, and includes three Verilog code snippets showing the actual implementation. A complete MIPS register convention table documents the standard register usage patterns.

## Tasks Completed

| Task | Name | Commit | Key Changes |
|------|------|--------|-------------|
| 1 | Create CpuRegfilePage.jsx | 71b80c4 | 552-line documentation page with 6 sections, 3 Verilog snippets, register table, port diagram |
| 2 | Activate route in App.jsx | 030a78a | Uncommented CpuRegfilePage import and /cpu-docs/regfile route |

## Deviations from Plan

None - plan executed exactly as written.

## Technical Implementation

### Page Structure

**Breadcrumbs:** Home > CPU Simulator > Documentation > Register File

**Header:**
- Title: "Register File"
- Subtitle: "Checkpoint 2 - 32-Register Storage"

**Content Sections:**

1. **Overview** - What the register file does
   - 32 registers, 32 bits each
   - Two read ports (simultaneous reads)
   - One write port (synchronous)
   - Clock-synchronized writes, combinational reads
   - $0 hardwired to zero

2. **Architecture** - Design and port specification
   - ASCII art port diagram showing inputs/outputs
   - ctrl_readRegA/B [4:0] → data_readRegA/B [31:0]
   - ctrl_writeReg [4:0], data_writeReg [31:0], ctrl_writeEnable
   - Clock input for synchronous writes

3. **$0 Hardwired to Zero** - Why and how
   - RISC convention: $0 always reads as 0
   - Use cases: load immediate, copy, discard, zero comparisons
   - Verilog snippet: generate loop for registers 1-31, assign reg_out[0] = 32'b0

4. **Read Port Implementation** - Combinational reads
   - 32:1 multiplexer for each read port
   - No clock delay (immediate output)
   - Verilog snippet: assign data_readRegA = reg_out[ctrl_readRegA]
   - Timing: ~5ns propagation delay

5. **Write Port Implementation** - Synchronous writes
   - 5-to-32 decoder converts address to one-hot enable
   - Only selected register receives write pulse
   - Verilog snippet: decoder_5to32 module instantiation
   - Single write port limitation explained

6. **Register Conventions** - MIPS standard usage
   - Table with all 32 registers: number, name, purpose, preservation
   - $0 (zero), $at (assembler temp), $v0-$v1 (return), $a0-$a3 (args)
   - $t0-$t9 (temporaries, caller-saved), $s0-$s7 (saved, callee-saved)
   - $sp (stack), $ra (return address), etc.
   - Caller-saved vs callee-saved explained

7. **Explore Further** - Navigation links
   - Previous: ALU Design (/cpu-docs/alu)
   - Next: Multiplication & Division (/cpu-docs/multdiv)
   - Back to CPU docs (/cpu-docs)
   - GitHub: https://github.com/AaronDiefes/CPU

### Verilog Code Snippets

**Snippet 1: $0 Hardwired to Zero**
```verilog
genvar i;
generate
  for (i = 1; i < 32; i = i + 1) begin: reg_loop
    register_32 reg_i(.d(data_writeReg), .clk(clock), .en(write_en[i]),
                      .clr(ctrl_reset), .q(reg_out[i]));
  end
endgenerate

assign reg_out[0] = 32'b0;
```

**Snippet 2: Read Port Implementation**
```verilog
assign data_readRegA = reg_out[ctrl_readRegA];
assign data_readRegB = reg_out[ctrl_readRegB];
```

**Snippet 3: Write Enable Decoder**
```verilog
wire [31:0] write_en;
decoder_5to32 write_decoder(
  .in(ctrl_writeReg),
  .enable(ctrl_writeEnable),
  .out(write_en)
);
```

### Styling

**Inline CSS in `<style>` tag:**
- Reused classes from DocsPage.jsx: `.landing-header`, `.container`, `.section`, `.code-block`, `.ops-table`, `.quick-links`
- Added `.port-diagram` class for ASCII art port specification
- Green gradient theme (#2E7D32 to #1B5E20)
- Responsive breakpoints at 768px and 480px
- Code block syntax highlighting with color-coded classes

**Footer:**
- 4-column grid: About, Navigation, Resources, Built With
- Tech stack: Verilog HDL, ModelSim, Quartus, React
- Links to portfolio, simulator, docs, GitHub

## Verification Results

**Build Verification:**
- `npm run build` completed successfully
- Bundle size: 324.91 kB (includes CpuRegfilePage + CpuAluPage from Plan 13-02)
- No compilation errors or warnings

**Content Verification:**
- Page has 6 major sections as planned
- 3 Verilog code snippets included
- Register convention table with all 32 registers
- Port diagram with ASCII art visualization
- All navigation links present (ALU, MultDiv, CPU docs, GitHub)

**Route Verification:**
- CpuRegfilePage import uncommented in App.jsx
- /cpu-docs/regfile route activated
- Route coexists with /cpu-docs/alu route from Plan 13-02 (no conflicts)

## Success Criteria

- [x] CpuRegfilePage.jsx exists with register file documentation
- [x] Explains $0 hardwired to zero with Verilog code
- [x] Shows read/write port implementations (Verilog snippets)
- [x] Register convention table included (32 registers)
- [x] At least 3 Verilog code snippets (has exactly 3)
- [x] Route active at /cpu-docs/regfile
- [x] Links to GitHub repo (https://github.com/AaronDiefes/CPU)
- [x] Breadcrumbs show: Home > CPU Simulator > Documentation > Register File
- [x] Build completes without errors

## Files Changed

**Created:**
- `src/pages/cpu/CpuRegfilePage.jsx` (552 lines) - Complete Register File documentation with 6 sections, 3 Verilog snippets, register table, port diagram, navigation links

**Modified:**
- `src/App.jsx` (+2 lines, -2 lines) - Uncommented CpuRegfilePage import and route

## Context Notes

**Wave 2 Parallelization:**
Plan 13-03 ran in wave 2 alongside Plan 13-02 (ALU). Both plans modified App.jsx but only uncommented different lines (different imports and routes), so there were no conflicts. The build output confirms both pages are included in the bundle.

**Pattern Consistency:**
CpuRegfilePage follows the exact same structure as CpuDocsLanding and DocsPage:
- Inline CSS in `<style>` tag
- Breadcrumbs at top
- Landing header with green gradient
- Sections with `.section` class
- Code blocks with `.code-block` class
- Quick links and footer at bottom

This consistency makes the CPU documentation feel like a unified system.

## Next Steps

Plans 13-04 through 13-07 will create the remaining 5 documentation pages:
- 13-04: Multiplication & Division (CP3)
- 13-05: Pipeline Architecture (CP4)
- 13-06: Hazards & Forwarding (CP4)
- 13-07: Instruction Set & Memory System

Each will follow the same pattern: create page component, uncomment import and route in App.jsx.

## Self-Check: PASSED

**Files Created:**
- FOUND: src/pages/cpu/CpuRegfilePage.jsx (552 lines)

**Files Modified:**
- FOUND: src/App.jsx (CpuRegfilePage import and route uncommented)

**Commits Exist:**
- FOUND: 71b80c4 (Task 1: Create CpuRegfilePage.jsx)
- FOUND: 030a78a (Task 2: Activate route)

**Build Verification:**
- PASSED: npm run build completed successfully (764ms)
- PASSED: Bundle includes CpuRegfilePage (324.91 kB total)

**Content Verification:**
- PASSED: 6 major sections present
- PASSED: 3 Verilog code snippets included
- PASSED: Register convention table with 32 registers
- PASSED: Port diagram ASCII art present
- PASSED: All navigation links included

**Route Verification:**
- PASSED: /cpu-docs/regfile route active in App.jsx
- PASSED: CpuRegfilePage import uncommented

All verification criteria met. Plan execution complete.
