/**
 * Curated demo programs.
 *
 * Each one exists to make a single pipeline phenomenon visible, and each one
 * TERMINATES. That second property is not a detail: the two programs this
 * replaces both ran until a `instructions.length * 3` safety cap and nobody
 * noticed, because the old branch target was computed as `pc + imm*4` instead of
 * `PC + 1 + N` so the Fibonacci loop could never exit. The `expect` block on each
 * program is what stops that class of silent drift - scripts/verify-pipeline.mjs
 * asserts it.
 *
 * ISA notes that trip people up (see processor.v:135-142):
 *   sw  $rd, N($rs)   ->  mem[$rs + N] = $rd     (the STORE VALUE is $rd)
 *   lw  $rd, N($rs)   ->  $rd = mem[$rs + N]
 *   bne $rd, $rs, N   ->  if ($rd != $rs) PC = PC + 1 + N
 *   blt $rd, $rs, N   ->  if ($rd <  $rs) PC = PC + 1 + N   (signed)
 * Memory is word-addressed, and PC increments by 1.
 */
(function () {
  'use strict';

  /** Build one instruction. Unset register fields default to $0. */
  function ins(mnemonic, fields, comment) {
    return {
      mnemonic,
      rs: 0, rt: 0, rd: 0, immediate: 0, shamt: 0,
      ...fields,
      comment: comment || '',
      text: render(mnemonic, { rs: 0, rt: 0, rd: 0, immediate: 0, shamt: 0, ...fields }),
    };
  }

  /** Assembly text for display, in the ISA's own operand order. */
  function render(m, f) {
    switch (m) {
      case 'ADD': case 'SUB': case 'AND': case 'OR': case 'MUL': case 'DIV':
        return `${m.toLowerCase()} $${f.rd}, $${f.rs}, $${f.rt}`;
      case 'SLL': case 'SRA':
        return `${m.toLowerCase()} $${f.rd}, $${f.rs}, ${f.shamt}`;
      case 'ADDI':
        return `addi $${f.rd}, $${f.rs}, ${f.immediate}`;
      case 'LW': case 'SW':
        return `${m.toLowerCase()} $${f.rd}, ${f.immediate}($${f.rs})`;
      case 'BNE': case 'BLT':
        return `${m.toLowerCase()} $${f.rd}, $${f.rs}, ${f.immediate}`;
      case 'J':
        return `j ${f.immediate}`;
      default:
        return m.toLowerCase();
    }
  }

  // ---------------------------------------------------------------------------

  const BASIC = {
    id: 'basic',
    name: 'Basic Walkthrough',
    teaches: 'How the pipeline fills, runs at one instruction per cycle, and drains.',
    description:
      'Six independent-ish ALU operations. Watch the five stages fill one at a time, ' +
      'run full for a few cycles, then drain. This is the pipeline at its best case.',
    cCode: [
      'int main() {',
      '    int a = 12;',
      '    int b = 10;',
      '    int sum  = a + b;   // 22',
      '    int diff = a - b;   // 2',
      '    int both = a & b;   // 8',
      '    int either = a | b; // 14',
      '    return 0;',
      '}',
    ].join('\n'),
    instructions: [
      ins('ADDI', { rd: 1, rs: 0, immediate: 12 }, 'a = 12'),
      ins('ADDI', { rd: 2, rs: 0, immediate: 10 }, 'b = 10'),
      ins('ADD',  { rd: 3, rs: 1, rt: 2 }, 'sum = a + b'),
      ins('SUB',  { rd: 4, rs: 1, rt: 2 }, 'diff = a - b'),
      ins('AND',  { rd: 5, rs: 1, rt: 2 }, 'both = a & b'),
      ins('OR',   { rd: 6, rs: 1, rt: 2 }, 'either = a | b'),
    ],
    expect: {
      registers: { 1: 12, 2: 10, 3: 22, 4: 2, 5: 8, 6: 14 },
      totalCycles: 10,          // 6 instructions + 4 to fill/drain
      stalls: 0,
      flushes: 0,
    },
  };

  const FORWARDING = {
    id: 'forwarding',
    name: 'Forwarding (Bypass)',
    teaches: 'Every instruction depends on the one before it - and nothing stalls.',
    description:
      'A dependency chain where each result is needed immediately by the next ' +
      'instruction. Without bypassing this would stall constantly; with it, the ' +
      'value is handed straight from EX/MEM back into the ALU and the pipeline ' +
      'never slows down.',
    cCode: [
      'int main() {',
      '    int x = 1;',
      '    x = x + x;  // 2',
      '    x = x + x;  // 4',
      '    x = x + x;  // 8',
      '    x = x + x;  // 16',
      '    return x;',
      '}',
    ].join('\n'),
    instructions: [
      ins('ADDI', { rd: 1, rs: 0, immediate: 1 }, 'x = 1'),
      ins('ADD',  { rd: 2, rs: 1, rt: 1 }, 'needs $1 from the instruction just ahead'),
      ins('ADD',  { rd: 3, rs: 2, rt: 2 }, 'needs $2 - bypassed again'),
      ins('ADD',  { rd: 4, rs: 3, rt: 3 }, 'needs $3 - bypassed again'),
      ins('ADD',  { rd: 5, rs: 4, rt: 4 }, 'needs $4 - bypassed again'),
    ],
    expect: {
      registers: { 1: 1, 2: 2, 3: 4, 4: 8, 5: 16 },
      totalCycles: 9,
      stalls: 0,                // the whole point
      flushes: 0,
    },
  };

  const LOAD_USE = {
    id: 'load-use',
    name: 'Load-Use Stall',
    teaches: 'The one hazard forwarding cannot fix, and the bubble it costs.',
    description:
      'A load followed immediately by an instruction that needs the loaded value. ' +
      'The data does not exist until the Memory stage, so no bypass can reach the ' +
      'ALU in time - the pipeline inserts one bubble and then forwards from MEM/WB.',
    cCode: [
      'int main() {',
      '    int mem[64];',
      '    mem[16] = 42;',
      '    int v = mem[16];   // load',
      '    int d = v + v;     // needs v immediately -> stall',
      '    return d;',
      '}',
    ].join('\n'),
    instructions: [
      ins('ADDI', { rd: 1, rs: 0, immediate: 16 }, 'address'),
      ins('ADDI', { rd: 2, rs: 0, immediate: 42 }, 'value'),
      ins('SW',   { rd: 2, rs: 1, immediate: 0 }, 'mem[16] = 42'),
      ins('LW',   { rd: 3, rs: 1, immediate: 0 }, 'v = mem[16]'),
      ins('ADD',  { rd: 4, rs: 3, rt: 3 }, 'needs v right away - one bubble'),
    ],
    expect: {
      registers: { 3: 42, 4: 84 },
      memory: { 16: 42 },
      totalCycles: 10,          // 5 + 4 fill/drain + 1 stall
      stalls: 1,
      flushes: 0,
    },
  };

  const BRANCH = {
    id: 'branch',
    name: 'Branch & Flush',
    teaches: 'A branch resolves in Execute, so two instructions behind it are wrong.',
    description:
      'Two branches: the first is not taken and costs nothing, the second is taken. ' +
      'Because the decision is not known until the Execute stage, the two ' +
      'instructions already fetched behind it are on the wrong path and get ' +
      'discarded - watch them turn into bubbles.',
    cCode: [
      'int main() {',
      '    int a = 5, b = 5;',
      '    if (a != b) goto skip;  // not taken',
      '    int c = 1;',
      '    int d = 7;',
      '    if (d != 0) goto end;   // taken - two instructions flushed',
      '    int e = 99;             // never runs',
      '    int f = 98;             // never runs',
      'end:',
      '    int g = 42;',
      '}',
    ].join('\n'),
    instructions: [
      ins('ADDI', { rd: 1, rs: 0, immediate: 5 }, 'a = 5'),
      ins('ADDI', { rd: 2, rs: 0, immediate: 5 }, 'b = 5'),
      ins('BNE',  { rd: 1, rs: 2, immediate: 2 }, 'a == b, so NOT taken - costs nothing'),
      ins('ADDI', { rd: 3, rs: 0, immediate: 1 }, 'runs, because the branch fell through'),
      ins('ADDI', { rd: 4, rs: 0, immediate: 7 }, 'd = 7'),
      ins('BNE',  { rd: 4, rs: 0, immediate: 2 }, 'd != 0, so TAKEN -> jump to 8'),
      ins('ADDI', { rd: 5, rs: 0, immediate: 99 }, 'wrong path - flushed'),
      ins('ADDI', { rd: 6, rs: 0, immediate: 98 }, 'wrong path - flushed'),
      ins('ADDI', { rd: 7, rs: 0, immediate: 42 }, 'branch target'),
    ],
    expect: {
      registers: { 3: 1, 5: 0, 6: 0, 7: 42 },  // 5 and 6 must never commit
      stalls: 0,
      flushes: 1,
    },
  };

  const MULTIPLY = {
    id: 'multiply',
    name: 'Multiply Stall',
    teaches: 'A multi-cycle unit freezes the front of the pipeline behind it.',
    description:
      'The multiplier needs 16 cycles, so Execute holds the multiply and feeds ' +
      'bubbles forward while Fetch and Decode sit frozen. Watch the train of ' +
      'bubbles march toward Write Back, then the pipeline resume.',
    cCode: [
      'int main() {',
      '    int a = 6, b = 7;',
      '    int p = a * b;   // multi-cycle',
      '    int q = p + 0;   // waits for the product',
      '    return q;',
      '}',
    ].join('\n'),
    instructions: [
      ins('ADDI', { rd: 1, rs: 0, immediate: 6 }, 'a = 6'),
      ins('ADDI', { rd: 2, rs: 0, immediate: 7 }, 'b = 7'),
      ins('MUL',  { rd: 3, rs: 1, rt: 2 }, 'p = a * b - occupies EX for 16 cycles'),
      ins('ADD',  { rd: 4, rs: 3, rt: 0 }, 'q = p'),
      ins('ADDI', { rd: 5, rs: 0, immediate: 1 }, 'pipeline resumes'),
    ],
    expect: {
      registers: { 3: 42, 4: 42, 5: 1 },
      flushes: 0,
    },
  };

  const FIBONACCI = {
    id: 'fibonacci',
    name: 'Fibonacci',
    teaches: 'A real loop: heavy forwarding, a backward branch, and a clean exit.',
    description:
      'Writes the first eight Fibonacci numbers into memory. Almost every ' +
      'instruction depends on the one before it, so bypassing is working constantly, ' +
      'and the loop branch is taken seven times and falls through once.',
    cCode: [
      'int main() {',
      '    int mem[8];',
      '    int a = 0, b = 1;',
      '    for (int i = 0; i < 8; i++) {',
      '        mem[i] = b;',
      '        int next = a + b;',
      '        a = b;',
      '        b = next;',
      '    }',
      '    return 0;',
      '}',
    ].join('\n'),
    instructions: [
      ins('ADDI', { rd: 1, rs: 0, immediate: 0 }, 'a = 0'),
      ins('ADDI', { rd: 2, rs: 0, immediate: 1 }, 'b = 1'),
      ins('ADDI', { rd: 3, rs: 0, immediate: 8 }, 'count = 8'),
      ins('ADDI', { rd: 4, rs: 0, immediate: 0 }, 'ptr = 0'),
      ins('SW',   { rd: 2, rs: 4, immediate: 0 }, 'mem[ptr] = b'),
      ins('ADD',  { rd: 5, rs: 1, rt: 2 }, 'next = a + b'),
      ins('ADD',  { rd: 1, rs: 2, rt: 0 }, 'a = b'),
      ins('ADD',  { rd: 2, rs: 5, rt: 0 }, 'b = next'),
      ins('ADDI', { rd: 4, rs: 4, immediate: 1 }, 'ptr++'),
      ins('ADDI', { rd: 3, rs: 3, immediate: -1 }, 'count--'),
      ins('BNE',  { rd: 3, rs: 0, immediate: -7 }, 'loop while count != 0'),
    ],
    expect: {
      registers: { 1: 21, 2: 34, 3: 0, 4: 8 },
      memory: { 0: 1, 1: 1, 2: 2, 3: 3, 4: 5, 5: 8, 6: 13, 7: 21 },
      flushes: 7,               // taken seven times, falls through on the eighth
    },
  };

  const PROGRAMS = {
    basic: BASIC,
    forwarding: FORWARDING,
    'load-use': LOAD_USE,
    branch: BRANCH,
    multiply: MULTIPLY,
    fibonacci: FIBONACCI,
  };

  if (typeof window !== 'undefined') {
    window.CPU_PROGRAMS = PROGRAMS;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.CPU_PROGRAMS = PROGRAMS;
  }
})();
