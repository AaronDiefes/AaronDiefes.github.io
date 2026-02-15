/**
 * Basic Instructions Walkthrough Program
 *
 * Demonstrates all 8 core RISC instruction types through a simple program that:
 * - Loads immediate values into registers
 * - Performs register arithmetic
 * - Executes memory load/store operations
 * - Takes a branch
 * - Performs a jump
 *
 * This program is designed for educational purposes to show how each instruction
 * type behaves in the 5-stage pipeline.
 *
 * Requires: InstructionSet
 */
(function() {
  'use strict';

  /**
   * Basic Instructions Program
   *
   * Expected final state:
   * - $8 = 10
   * - $9 = 20
   * - $10 = 30 (ADD result)
   * - $11 = 10 (SUB result)
   * - $12 = 30 (LW result)
   * - mem[10] = 30 (SW result)
   */
  const BASIC_PROGRAM = {
    name: "Basic Instructions Walkthrough",
    description: "Demonstrates all 8 core RISC instruction types: register arithmetic, immediates, memory load/store, branch, and jump.",
    cCode: `#include <stdio.h>

int main() {
    int memory[256] = {0};

    // Arithmetic operations
    int a = 10;
    int b = 20;
    int sum = a + b;           // 30
    int difference = b - a;     // 10

    // Memory operations
    memory[10] = sum;           // Store 30 at memory[10]
    int loaded = memory[10];    // Load from memory[10]

    // Conditional branching
    if (a == a) {
        printf("Condition true, branch taken\\n");
    }

    printf("Results: sum=%d, diff=%d, loaded=%d\\n",
           sum, difference, loaded);

    return 0;
}`,
    instructions: [
      // Step 1: Load immediate values into registers
      Object.assign(
        InstructionSet.createInstruction('ADDI', { rs: 0, rt: 8, immediate: 10 }),
        { comment: 'Load 10 into $8: $8 = $0 + 10' }
      ),
      Object.assign(
        InstructionSet.createInstruction('ADDI', { rs: 0, rt: 9, immediate: 20 }),
        { comment: 'Load 20 into $9: $9 = $0 + 20' }
      ),

      // Step 2: Register arithmetic
      Object.assign(
        InstructionSet.createInstruction('ADD', { rs: 8, rt: 9, rd: 10 }),
        { comment: 'Add registers: $10 = $8 + $9 = 30' }
      ),
      Object.assign(
        InstructionSet.createInstruction('SUB', { rs: 9, rt: 8, rd: 11 }),
        { comment: 'Subtract registers: $11 = $9 - $8 = 10' }
      ),

      // Step 3: Memory operations
      Object.assign(
        InstructionSet.createInstruction('SW', { rs: 8, rt: 10, immediate: 0 }),
        { comment: 'Store $10 to memory: mem[$8 + 0] = mem[10] = 30' }
      ),
      Object.assign(
        InstructionSet.createInstruction('LW', { rs: 8, rt: 12, immediate: 0 }),
        { comment: 'Load from memory: $12 = mem[$8 + 0] = mem[10] = 30' }
      ),

      // Step 4: Branch (taken - skips NOP)
      Object.assign(
        InstructionSet.createInstruction('BEQ', { rs: 8, rt: 8, immediate: 2 }),
        { comment: 'Branch if $8 == $8 (always true): skip 2 instructions ahead' }
      ),

      // Step 5: NOP (skipped by branch)
      Object.assign(
        InstructionSet.createInstruction('NOP', {}),
        { comment: 'No operation (this instruction is skipped by the branch)' }
      ),

      // Step 6: Jump (demonstrates J instruction)
      Object.assign(
        InstructionSet.createInstruction('J', { immediate: 0 }),
        { comment: 'Jump to address 0 (demonstrates jump instruction - would loop back)' }
      )
    ]
  };

  // Export to global scope
  if (typeof window !== 'undefined') {
    window.BASIC_PROGRAM = BASIC_PROGRAM;
  } else if (typeof global !== 'undefined') {
    global.BASIC_PROGRAM = BASIC_PROGRAM;
  }
})();
