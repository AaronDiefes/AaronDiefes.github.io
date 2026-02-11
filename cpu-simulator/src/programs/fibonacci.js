/**
 * Fibonacci Sequence Program
 *
 * Computes the first 8 Fibonacci numbers (1, 1, 2, 3, 5, 8, 13, 21) using:
 * - A loop with registers for computation
 * - Memory stores for results
 * - Branch for loop control
 * - Jump for loop iteration
 *
 * This program demonstrates:
 * - Loop structures with branch and jump
 * - Register-based computation
 * - Memory array building
 * - Counter-based loop termination
 *
 * Requires: InstructionSet
 */
(function() {
  'use strict';

  /**
   * Fibonacci Program
   *
   * Expected final state:
   * - mem[0] = 1 (fib 0)
   * - mem[4] = 1 (fib 1)
   * - mem[8] = 2 (fib 2)
   * - mem[12] = 3 (fib 3)
   * - mem[16] = 5 (fib 4)
   * - mem[20] = 8 (fib 5)
   * - mem[24] = 13 (fib 6)
   * - mem[28] = 21 (fib 7)
   */
  const FIBONACCI_PROGRAM = {
    name: "Fibonacci Sequence",
    description: "Computes the first 8 Fibonacci numbers (1, 1, 2, 3, 5, 8, 13, 21) using a loop with registers and stores results in memory.",
    instructions: [
      // Initialization: fib(0)=1, fib(1)=1, counter=8, address=0
      Object.assign(
        InstructionSet.createInstruction('ADDI', { rs: 0, rt: 8, immediate: 1 }),
        { comment: 'Initialize $8 = 1 (current Fibonacci number)' }
      ),
      Object.assign(
        InstructionSet.createInstruction('ADDI', { rs: 0, rt: 9, immediate: 1 }),
        { comment: 'Initialize $9 = 1 (next Fibonacci number)' }
      ),
      Object.assign(
        InstructionSet.createInstruction('ADDI', { rs: 0, rt: 10, immediate: 8 }),
        { comment: 'Initialize $10 = 8 (loop counter - compute 8 numbers)' }
      ),
      Object.assign(
        InstructionSet.createInstruction('ADDI', { rs: 0, rt: 11, immediate: 0 }),
        { comment: 'Initialize $11 = 0 (memory address pointer)' }
      ),

      // Loop body (starts at instruction 4, word address 16)
      Object.assign(
        InstructionSet.createInstruction('SW', { rs: 11, rt: 8, immediate: 0 }),
        { comment: 'Store current Fibonacci: mem[$11] = $8' }
      ),
      Object.assign(
        InstructionSet.createInstruction('ADD', { rs: 8, rt: 9, rd: 12 }),
        { comment: 'Compute next Fibonacci: $12 = $8 + $9' }
      ),
      Object.assign(
        InstructionSet.createInstruction('ADD', { rs: 9, rt: 0, rd: 8 }),
        { comment: 'Shift values: $8 = $9 (current = next)' }
      ),
      Object.assign(
        InstructionSet.createInstruction('ADD', { rs: 12, rt: 0, rd: 9 }),
        { comment: 'Shift values: $9 = $12 (next = computed)' }
      ),
      Object.assign(
        InstructionSet.createInstruction('ADDI', { rs: 11, rt: 11, immediate: 4 }),
        { comment: 'Advance memory pointer: $11 = $11 + 4 (one word)' }
      ),
      Object.assign(
        InstructionSet.createInstruction('ADDI', { rs: 10, rt: 10, immediate: -1 }),
        { comment: 'Decrement counter: $10 = $10 - 1' }
      ),
      Object.assign(
        InstructionSet.createInstruction('BEQ', { rs: 10, rt: 0, immediate: 1 }),
        { comment: 'Branch if done: if $10 == 0, skip to end (offset +1)' }
      ),
      Object.assign(
        InstructionSet.createInstruction('J', { immediate: 4 }),
        { comment: 'Jump back to loop body: jump to word address 4 (instruction 4)' }
      ),

      // End
      Object.assign(
        InstructionSet.createInstruction('NOP', {}),
        { comment: 'End of program' }
      )
    ]
  };

  // Export to global scope
  if (typeof window !== 'undefined') {
    window.FIBONACCI_PROGRAM = FIBONACCI_PROGRAM;
  } else if (typeof global !== 'undefined') {
    global.FIBONACCI_PROGRAM = FIBONACCI_PROGRAM;
  }

  // Also export program registry
  if (typeof window !== 'undefined') {
    window.CPU_PROGRAMS = {
      basic: window.BASIC_PROGRAM,
      fibonacci: FIBONACCI_PROGRAM
    };
  } else if (typeof global !== 'undefined') {
    global.CPU_PROGRAMS = {
      basic: global.BASIC_PROGRAM,
      fibonacci: FIBONACCI_PROGRAM
    };
  }
})();
