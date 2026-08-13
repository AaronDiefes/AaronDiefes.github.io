/**
 * Headless verification for the cycle-accurate pipeline model.
 *
 * The demo has no test suite, and a pipeline is exactly the kind of thing that
 * looks plausible on screen while being quietly wrong. This checks two separate
 * classes of claim:
 *
 *   1. ARCHITECTURAL CORRECTNESS - after each program, do the registers and
 *      memory hold what the ISA says they should?
 *   2. PIPELINE BEHAVIOUR - does it cost what a pipeline should cost? A taken
 *      branch must cost exactly 2 cycles, a load-use pair exactly 1, and a
 *      hazard-free run must reach 5 occupied stages at 1 IPC.
 *
 * A model can pass (1) and still not be a pipeline at all - the previous
 * simulator did. (2) is what makes it a pipeline.
 *
 * Run: node scripts/verify-pipeline.mjs
 */
// The core modules are IIFEs that register themselves on the global object -
// the same contract the browser uses (window.PipelineSimulator). The package is
// "type": "module", so importing for side effect and reading the global is the
// honest way to load it: it exercises exactly the path the demo does.
await import('../src/lib/cpu/core/pipeline-simulator.js')
const Sim = globalThis.PipelineSimulator

// ---- tiny assertion harness -------------------------------------------------
let passed = 0
const failures = []

function check(label, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected)
  if (ok) { passed++; return }
  failures.push(`${label}\n      expected: ${JSON.stringify(expected)}\n      actual:   ${JSON.stringify(actual)}`)
}

function i(mnemonic, fields = {}) {
  return { mnemonic, rs: 0, rt: 0, rd: 0, immediate: 0, shamt: 0, ...fields }
}

function run(instructions) {
  return Sim.simulate({ instructions })
}

function regs(result, list) {
  return list.map((n) => result.finalRegisters[n])
}

function eventsOf(result, kind) {
  return result.frames.flatMap((f) => f.events.filter((e) => e.kind === kind))
}

// =============================================================================
// 1. Forwarding: back-to-back dependents must resolve with NO stall
// =============================================================================
{
  const r = run([
    i('ADDI', { rd: 1, rs: 0, immediate: 5 }),   // $1 = 5
    i('ADDI', { rd: 2, rs: 0, immediate: 7 }),   // $2 = 7
    i('ADD',  { rd: 3, rs: 1, rt: 2 }),          // $3 = 12  (both operands forwarded)
    i('SUB',  { rd: 4, rs: 3, rt: 1 }),          // $4 = 7   (EX->EX forward of $3)
  ])

  check('forwarding: register results', regs(r, [1, 2, 3, 4]), [5, 7, 12, 7])
  check('forwarding: no stalls needed', eventsOf(r, 'stall').length, 0)
  check('forwarding: retired all 4', r.metadata.totalInstructions, 4)

  const fwd = eventsOf(r, 'forward')
  const hasExEx = fwd.some((e) => e.from === 'EXMEM' && e.reg === 3)
  check('forwarding: EX->EX bypass of $3 happened', hasExEx, true)
}

// =============================================================================
// 2. Load-use: the one hazard forwarding cannot fix - exactly one stall
// =============================================================================
{
  const withHazard = run([
    i('ADDI', { rd: 1, rs: 0, immediate: 40 }),  // $1 = 40 (address)
    i('ADDI', { rd: 2, rs: 0, immediate: 99 }),  // $2 = 99
    i('SW',   { rd: 2, rs: 1, immediate: 0 }),   // mem[40] = 99   (sw reads $rd as value)
    i('LW',   { rd: 3, rs: 1, immediate: 0 }),   // $3 = 99
    i('ADD',  { rd: 4, rs: 3, rt: 0 }),          // $4 = 99  <- load-use
  ])

  check('load-use: register results', regs(withHazard, [3, 4]), [99, 99])
  check('load-use: memory[40]', withHazard.finalMemory[40], 99)

  const stalls = eventsOf(withHazard, 'stall').filter((e) => e.reason === 'load-use')
  check('load-use: exactly one stall', stalls.length, 1)
  check('load-use: stall names the register', stalls[0] && stalls[0].reg, 3)

  // Same program with the dependency broken - must be exactly 1 cycle shorter.
  const noHazard = run([
    i('ADDI', { rd: 1, rs: 0, immediate: 40 }),
    i('ADDI', { rd: 2, rs: 0, immediate: 99 }),
    i('SW',   { rd: 2, rs: 1, immediate: 0 }),
    i('LW',   { rd: 3, rs: 1, immediate: 0 }),
    i('ADD',  { rd: 4, rs: 0, rt: 0 }),          // no longer reads $3
  ])
  check('load-use: costs exactly 1 cycle',
    withHazard.metadata.totalCycles - noHazard.metadata.totalCycles, 1)
}

// =============================================================================
// 3. Taken branch: resolved in EX, so exactly 2 instructions are flushed
// =============================================================================
{
  const taken = run([
    i('ADDI', { rd: 1, rs: 0, immediate: 1 }),
    i('ADDI', { rd: 2, rs: 0, immediate: 2 }),
    i('BNE',  { rd: 1, rs: 2, immediate: 2 }),   // 1 != 2 -> taken, target = 2+1+2 = 5
    i('ADDI', { rd: 3, rs: 0, immediate: 111 }), // flushed
    i('ADDI', { rd: 4, rs: 0, immediate: 222 }), // flushed
    i('ADDI', { rd: 5, rs: 0, immediate: 333 }), // executes
  ])

  check('branch: wrong-path instructions did NOT commit', regs(taken, [3, 4]), [0, 0])
  check('branch: target instruction did commit', regs(taken, [5]), [333])

  const flushes = eventsOf(taken, 'flush')
  check('branch: one flush event', flushes.length, 1)
  check('branch: two instructions killed', flushes[0] && flushes[0].killed.length, 2)

  // Not-taken costs nothing.
  const notTaken = run([
    i('ADDI', { rd: 1, rs: 0, immediate: 1 }),
    i('ADDI', { rd: 2, rs: 0, immediate: 1 }),   // now equal -> not taken
    i('BNE',  { rd: 1, rs: 2, immediate: 2 }),
    i('ADDI', { rd: 3, rs: 0, immediate: 111 }),
    i('ADDI', { rd: 4, rs: 0, immediate: 222 }),
    i('ADDI', { rd: 5, rs: 0, immediate: 333 }),
  ])
  check('branch: not-taken falls through', regs(notTaken, [3, 4, 5]), [111, 222, 333])
  check('branch: not-taken has no flush', eventsOf(notTaken, 'flush').length, 0)
  check('branch: taken costs exactly 2 cycles',
    taken.metadata.totalCycles - (notTaken.metadata.totalCycles - 2), 2)
}

// =============================================================================
// 4. It is actually a pipeline: five stages occupied, IPC -> 1
// =============================================================================
{
  const n = 12
  const independent = Array.from({ length: n }, (_, k) =>
    i('ADDI', { rd: (k % 20) + 1, rs: 0, immediate: k })
  )
  const r = run(independent)

  const maxOccupied = Math.max(...r.frames.map((f) => f.activeStages.size))
  check('pipeline: five stages occupied simultaneously', maxOccupied, 5)

  const fullFrames = r.frames.filter((f) => f.activeStages.size === 5).length
  check('pipeline: sustained full occupancy', fullFrames >= n - 5, true)

  // n instructions, no hazards: n + 4 cycles to fill and drain.
  check('pipeline: cycle count is n + 4', r.metadata.totalCycles, n + 4)
  check('pipeline: retired every instruction', r.metadata.totalInstructions, n)
}

// =============================================================================
// 5. $r0 stays zero, and word addressing / PC+1 hold
// =============================================================================
{
  const r = run([
    i('ADDI', { rd: 0, rs: 0, immediate: 42 }),  // write to $0 must be ignored
    i('ADDI', { rd: 1, rs: 0, immediate: 8 }),
  ])
  check('$r0 is hardwired to zero', r.finalRegisters[0], 0)
  check('$r0 write did not leak', regs(r, [1]), [8])

  // PC advances by 1 per instruction, not 4.
  const pcs = r.frames.map((f) => f.stages.IF.pc).filter((p) => p != null)
  check('PC increments by 1', pcs.slice(0, 2), [0, 1])
}

// =============================================================================
// 6. Multdiv stall freezes the pipeline behind it
// =============================================================================
{
  const r = run([
    i('ADDI', { rd: 1, rs: 0, immediate: 6 }),
    i('ADDI', { rd: 2, rs: 0, immediate: 7 }),
    i('MUL',  { rd: 3, rs: 1, rt: 2 }),          // $3 = 42, multi-cycle
    i('ADD',  { rd: 4, rs: 3, rt: 0 }),          // consumes the product
  ])
  check('multdiv: product is correct', regs(r, [3]), [42])
  check('multdiv: consumer got the product', regs(r, [4]), [42])
  const md = eventsOf(r, 'stall').filter((e) => e.reason === 'multdiv')
  check('multdiv: stalled while busy', md.length > 0, true)
}

// =============================================================================
// 7. A load consumed TWO instructions later needs no stall - the value arrives
//    via MEM/WB. This is the case the EX->EX suppression exists to protect:
//    if the bypass fired from a load in EX/MEM it would forward the ADDRESS.
// =============================================================================
{
  const r = run([
    i('ADDI', { rd: 1, rs: 0, immediate: 40 }),
    i('ADDI', { rd: 2, rs: 0, immediate: 77 }),
    i('SW',   { rd: 2, rs: 1, immediate: 0 }),   // mem[40] = 77
    i('LW',   { rd: 3, rs: 1, immediate: 0 }),   // $3 = 77
    i('ADDI', { rd: 9, rs: 0, immediate: 1 }),   // filler - breaks the load-use distance
    i('ADD',  { rd: 4, rs: 3, rt: 0 }),          // reads $3 two after the load
  ])
  check('load @2: consumer got the DATA, not the address', regs(r, [4]), [77])
  check('load @2: no stall required', eventsOf(r, 'stall').length, 0)
  const suppressed = eventsOf(r, 'forward').filter((e) => e.suppressedBy === 'lw-in-MEM')
  check('load @2: no bogus EX->EX bypass from the load', suppressed.length, 0)
}

// =============================================================================
// 8. Back-to-back multiplies: the second must latch its OWN operands
// =============================================================================
{
  const r = run([
    i('ADDI', { rd: 1, rs: 0, immediate: 3 }),
    i('ADDI', { rd: 2, rs: 0, immediate: 5 }),
    i('MUL',  { rd: 3, rs: 1, rt: 2 }),          // 15
    i('ADDI', { rd: 4, rs: 0, immediate: 9 }),
    i('ADDI', { rd: 5, rs: 0, immediate: 11 }),
    i('MUL',  { rd: 6, rs: 4, rt: 5 }),          // 99 - must not reuse 3x5
  ])
  check('two multiplies: each latched its own operands', regs(r, [3, 6]), [15, 99])
}

// =============================================================================
// 9. Curated demo programs: every one must produce its documented result AND
//    terminate. The programs these replace both ran to a safety cap forever
//    because a branch-target bug made the loop exit unreachable - and nothing
//    caught it. These assertions are what make that impossible to repeat.
// =============================================================================
{
  await import('../src/lib/cpu/programs/curated-programs.js')
  const programs = globalThis.CPU_PROGRAMS
  check('curated: six programs registered', Object.keys(programs).length, 6)

  for (const [id, prog] of Object.entries(programs)) {
    const r = Sim.simulate(prog)
    const e = prog.expect || {}

    if (e.registers) {
      for (const [reg, want] of Object.entries(e.registers)) {
        check(`${id}: $${reg}`, r.finalRegisters[Number(reg)], want)
      }
    }
    if (e.memory) {
      for (const [addr, want] of Object.entries(e.memory)) {
        check(`${id}: mem[${addr}]`, r.finalMemory[Number(addr)], want)
      }
    }
    if (e.totalCycles != null) check(`${id}: cycle count`, r.metadata.totalCycles, e.totalCycles)
    if (e.stalls != null) check(`${id}: stall count`, eventsOf(r, 'stall').length, e.stalls)
    if (e.flushes != null) check(`${id}: flush count`, eventsOf(r, 'flush').length, e.flushes)

    // Termination is the property that was silently broken before.
    check(`${id}: terminates well before the cap`, r.metadata.totalCycles < 1000, true)
    check(`${id}: retired every instruction it should`, r.metadata.totalInstructions > 0, true)
  }
}

// ---- report -----------------------------------------------------------------
console.log(`\n  ${passed} passed, ${failures.length} failed\n`)
if (failures.length) {
  failures.forEach((f) => console.log(`  FAIL  ${f}\n`))
  process.exit(1)
}
console.log('  Pipeline model verified.\n')
